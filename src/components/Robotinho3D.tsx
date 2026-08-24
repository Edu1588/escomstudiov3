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
    const getHeight = () => container.clientHeight || container.offsetHeight || 640;

    // Câmera calibrada para robô um pouco maior
    const camera = new THREE.PerspectiveCamera(38, getWidth() / getHeight(), 0.1, 1000);
    camera.position.set(0, 0.0, 3.55);
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
    renderer.toneMappingExposure = 1.05;

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

    // 3. Mouse Tracking (Rotação sutil do robô inteiro)
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    // Ângulo base virado mais para a direita (~41 graus em direção aos cards)
    const baseBodyRotY = 0.72;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2);
      const y = (e.clientY - (rect.top + rect.height / 2)) / (window.innerHeight / 2);

      // Rotação muito leve do robô com o mouse
      targetRotY = THREE.MathUtils.clamp(x * 0.18, -0.15, 0.15);
      targetRotX = THREE.MathUtils.clamp(y * 0.10, -0.08, 0.08);
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 4. Hierarquia 3D: Robô Completo Sólido com Pivôs Apenas nos Dedos
    const robotWrapper = new THREE.Group();
    robotWrapper.rotation.y = baseBodyRotY;
    scene.add(robotWrapper);

    const bodyGroup = new THREE.Group();

    // Pivôs locais individuais para cada falange de dedo especificada pelo usuário
    const fingerPivots: { pivot: THREE.Group; phase: number; speed: number }[] = [];

    let isModelReady = false;

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      "/models/robotinho-v1.glb",
      (gltf) => {
        const rawModel = gltf.scene;

        // Centralização exata do modelo completo
        const box = new THREE.Box3().setFromObject(rawModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Escala calibrada para robô um pouco maior
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.30 / (maxDim || 1);
        robotWrapper.scale.set(scale, scale, scale);

        // Peças dos dedos da mão que se movem:
        const fingerPartNames = new Set([
          "tripo_part_34",
          "tripo_part_31",
          "tripo_part_27",
          "tripo_part_32",
          "tripo_part_45",
          "tripo_part_49",
          "tripo_part_46",
          "tripo_part_37",
          "tripo_part_43",
          "tripo_part_54"
        ]);

        const allMeshes: THREE.Mesh[] = [];
        rawModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            allMeshes.push(child as THREE.Mesh);
          }
        });

        allMeshes.forEach((mesh, index) => {
          mesh.castShadow = true;
          mesh.receiveShadow = true;

          if (mesh.material) {
            const mat = mesh.material as THREE.MeshStandardMaterial;
            mat.roughness = 0.78; // Acabamento fosco realista
            mat.metalness = 0.20;
            mat.envMapIntensity = 0.5;
            mat.needsUpdate = true;
          }

          if (fingerPartNames.has(mesh.name)) {
            // Pivô local na junta da falange para articular sem desmontar a mão
            mesh.geometry.computeBoundingBox();
            const fBox = mesh.geometry.boundingBox!;
            const fCenter = fBox.getCenter(new THREE.Vector3());

            const jointX = fCenter.x - center.x;
            const jointY = fBox.min.y - center.y;
            const jointZ = fCenter.z - center.z;

            const fingerPivot = new THREE.Group();
            fingerPivot.position.set(jointX, jointY, jointZ);

            mesh.position.set(-fCenter.x, -fBox.min.y, -fCenter.z);
            fingerPivot.add(mesh);

            bodyGroup.add(fingerPivot);

            fingerPivots.push({
              pivot: fingerPivot,
              phase: (index * 0.65) % Math.PI,
              speed: 1.1 + (index % 3) * 0.35,
            });
          } else {
            // Todo o restante do robô (cabeça, capacete, camisa, calça, sapatos, braços) é sólido no corpo
            mesh.position.x -= center.x;
            mesh.position.y -= center.y;
            mesh.position.z -= center.z;
            bodyGroup.add(mesh);
          }
        });

        robotWrapper.add(bodyGroup);

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
        // 1. Rotação muito sutil do robô inteiro acompanhando o mouse
        currentRotY += (targetRotY - currentRotY) * 0.06;
        currentRotX += (targetRotX - currentRotX) * 0.06;

        robotWrapper.rotation.y = baseBodyRotY + currentRotY;
        robotWrapper.rotation.x = currentRotX;

        // 2. Micro-articulação fluida dos dedos nas próprias juntas (amplitude aumentada)
        fingerPivots.forEach((f) => {
          const wave = Math.sin(elapsed * f.speed + f.phase);
          f.pivot.rotation.x = wave * 0.16;
          f.pivot.rotation.z = Math.cos(elapsed * f.speed + f.phase) * 0.12;
        });

        // 3. Levitação suave do robô
        robotWrapper.position.y = Math.sin(elapsed * 1.5) * 0.035;
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
