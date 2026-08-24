import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

export default function Robotinho3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer Setup
    const scene = new THREE.Scene();

    const getWidth = () => container.clientWidth || container.offsetWidth || 480;
    const getHeight = () => container.clientHeight || container.offsetHeight || 620;

    const camera = new THREE.PerspectiveCamera(38, getWidth() / getHeight(), 0.1, 1000);
    camera.position.set(0, 0.04, 3.10);
    camera.lookAt(0, 0.0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(getWidth(), getHeight());
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05; // Fosco e sem reflexos estourados

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 2. Iluminação Suave Cyberpunk
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x09090b, 1.8);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(3, 4, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x00d1ff, 1.3);
    fillLight.position.set(-3, 2, 2);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x00d1ff, 2.8, 12);
    rimLight.position.set(-2, 3, -2);
    scene.add(rimLight);

    const accentLight = new THREE.PointLight(0x00e6a5, 2.0, 12);
    accentLight.position.set(2, -1, 2);
    scene.add(accentLight);

    // 3. Mouse Tracking (Para a cabeça do robô)
    let targetHeadRotX = 0;
    let targetHeadRotY = 0;
    let currentHeadRotX = 0;
    let currentHeadRotY = 0;

    // Ângulo base do corpo virado ~28 graus para a direita
    const baseBodyRotY = 0.48;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2);
      const y = (e.clientY - (rect.top + rect.height / 2)) / (window.innerHeight / 2);

      targetHeadRotY = THREE.MathUtils.clamp(x * 0.70, -0.65, 0.65);
      targetHeadRotX = THREE.MathUtils.clamp(y * 0.45, -0.35, 0.35);
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 4. Estruturas para articulação: Cabeça + Dedos da Mão Levantada
    const robotWrapper = new THREE.Group();
    robotWrapper.rotation.y = baseBodyRotY;
    scene.add(robotWrapper);

    const bodyGroup = new THREE.Group();
    const headPivot = new THREE.Group();
    const headGroup = new THREE.Group();

    // Arrays para animar os dedos da mão levantada
    const fingerMeshes: { mesh: THREE.Mesh; initPos: THREE.Vector3; initRot: THREE.Euler; phase: number; speed: number }[] = [];

    let isModelReady = false;

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      "/models/robotinho-v1.glb",
      (gltf) => {
        const rawModel = gltf.scene;

        // Centralização do modelo
        const box = new THREE.Box3().setFromObject(rawModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Escala ampliada para presença imponente
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.58 / (maxDim || 1);
        robotWrapper.scale.set(scale, scale, scale);

        // Pivô do pescoço
        const neckPivotY = 0.54 - center.y;
        const neckPivotZ = 0.02 - center.z;

        headPivot.position.set(0, neckPivotY, neckPivotZ);
        headGroup.position.set(0, -neckPivotY, -neckPivotZ);
        headPivot.add(headGroup);

        // Partes da cabeça e chifres
        const headPartNames = new Set([
          "tripo_part_23", "tripo_part_26", "tripo_part_28", "tripo_part_25",
          "tripo_part_10", "tripo_part_13", "tripo_part_4", "tripo_part_53",
          "tripo_part_8", "tripo_part_39", "tripo_part_7", "tripo_part_16",
          "tripo_part_50", "tripo_part_33", "tripo_part_20", "tripo_part_52",
          "tripo_part_18", "tripo_part_17", "tripo_part_9", "tripo_part_42",
          "tripo_part_44"
        ]);

        // Partes dos dedos da mão levantada
        const raisedFingerPartNames = new Set([
          "tripo_part_45", "tripo_part_27", "tripo_part_32", "tripo_part_46",
          "tripo_part_31", "tripo_part_49", "tripo_part_54", "tripo_part_43",
          "tripo_part_15", "tripo_part_34", "tripo_part_40", "tripo_part_48",
          "tripo_part_37", "tripo_part_12", "tripo_part_30", "tripo_part_35",
          "tripo_part_11"
        ]);

        const allNodes: THREE.Mesh[] = [];
        rawModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            allNodes.push(child as THREE.Mesh);
          }
        });

        allNodes.forEach((mesh, index) => {
          mesh.position.x -= center.x;
          mesh.position.y -= center.y;
          mesh.position.z -= center.z;

          mesh.castShadow = true;
          mesh.receiveShadow = true;

          if (mesh.material) {
            const mat = mesh.material as THREE.MeshStandardMaterial;
            mat.roughness = 0.78; // Acabamento fosco
            mat.metalness = 0.20;
            mat.envMapIntensity = 0.5;
            mat.needsUpdate = true;
          }

          if (headPartNames.has(mesh.name)) {
            // Adicionar à cabeça para seguir o mouse
            headGroup.add(mesh);
          } else {
            // Corpo, tronco, braços e pernas
            bodyGroup.add(mesh);

            // Se for um dos dedos da mão levantada, registrar para animação lenta
            if (raisedFingerPartNames.has(mesh.name)) {
              fingerMeshes.push({
                mesh,
                initPos: mesh.position.clone(),
                initRot: mesh.rotation.clone(),
                phase: (index * 0.45) % Math.PI,
                speed: 0.9 + (index % 3) * 0.3,
              });
            }
          }
        });

        robotWrapper.add(bodyGroup);
        robotWrapper.add(headPivot);

        isModelReady = true;
        setIsLoaded(true);
      },
      (xhr) => {
        if (xhr.lengthComputable && xhr.total > 0) {
          const percent = Math.round((xhr.loaded / xhr.total) * 100);
          setLoadingProgress(percent);
        }
      },
      (error) => {
        console.error("Erro ao carregar robotinho-v1.glb:", error);
        setHasError(true);
      }
    );

    // 5. Render & Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (isModelReady) {
        // 1. Cabeça segue o mouse com interpolação orgânica
        currentHeadRotY += (targetHeadRotY - currentHeadRotY) * 0.08;
        currentHeadRotX += (targetHeadRotX - currentHeadRotX) * 0.08;

        headPivot.rotation.y = currentHeadRotY;
        headPivot.rotation.x = currentHeadRotX;
        headPivot.rotation.z = currentHeadRotY * -0.08;

        // 2. Micro-movimento lento e fluido dos dedos da mão levantada
        fingerMeshes.forEach((f) => {
          const wave = Math.sin(elapsed * f.speed + f.phase);
          f.mesh.rotation.x = f.initRot.x + wave * 0.06;
          f.mesh.rotation.z = f.initRot.z + Math.cos(elapsed * f.speed + f.phase) * 0.04;
          f.mesh.position.y = f.initPos.y + wave * 0.003;
        });

        // 3. Levitação suave e amigável do corpo inteiro
        robotWrapper.position.y = Math.sin(elapsed * 1.5) * 0.04;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 6. Handle Resize
    const handleResize = () => {
      if (!container) return;
      const w = getWidth();
      const h = getHeight();
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      dracoLoader.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[520px] md:h-[580px] lg:h-[660px] flex items-center justify-center select-none overflow-visible z-[99]">
      {/* Glow de fundo */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#00d1ff]/15 via-[#00e6a5]/08 to-transparent rounded-full blur-[100px] pointer-events-none transform scale-90" />

      {/* Loading State */}
      {!isLoaded && !hasError && (
        <div className="absolute z-20 flex flex-col items-center gap-3 bg-black/70 backdrop-blur-md px-6 py-4 rounded-2xl border border-cyan-500/30 shadow-[0_0_25px_rgba(0,229,255,0.25)]">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs text-cyan-400 font-medium tracking-widest uppercase">
            CARREGANDO 3D... {loadingProgress > 0 ? `${loadingProgress}%` : ""}
          </span>
        </div>
      )}

      {hasError && (
        <div className="absolute z-20 text-center font-mono text-xs text-red-400 bg-red-950/40 p-4 rounded-xl border border-red-500/30">
          Erro ao carregar robotinho-v1.glb
        </div>
      )}

      {/* Canvas 3D */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing z-[99] overflow-visible" />
    </div>
  );
}
