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

    // Câmera calibrada para enquadramento completo do corpo inteiro sem cortes
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

    // Ângulo base virado para a direita (~41 graus em direção aos cards)
    const baseBodyRotY = 0.72;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2);
      const y = (e.clientY - (rect.top + rect.height / 2)) / (window.innerHeight / 2);

      // Rotação sutil do robô com o mouse
      targetRotY = THREE.MathUtils.clamp(x * 0.18, -0.15, 0.15);
      targetRotX = THREE.MathUtils.clamp(y * 0.10, -0.08, 0.08);
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 4. Hierarquia 3D: Robô Completo Sólido com Dedos Articulados e Correntes na Cintura
    const robotWrapper = new THREE.Group();
    robotWrapper.rotation.y = baseBodyRotY;
    scene.add(robotWrapper);

    const bodyGroup = new THREE.Group();

    // Definição dos 5 dedos anatômicos com seus nós e pontos de rotação na junta da palma
    const fingerDefs = [
      {
        name: "thumb",
        knuckle: { x: -0.130, y: 0.680, z: 0.010 },
        curlAngles: { x: 0.20, y: 0.10, z: 0.18 },
        speed: 1.1,
        phase: 0.15,
        parts: new Set(["tripo_part_31", "tripo_part_34", "tripo_part_48", "tripo_part_30", "tripo_part_35"])
      },
      {
        name: "index",
        knuckle: { x: -0.155, y: 0.705, z: 0.055 },
        curlAngles: { x: 0.28, y: 0.04, z: -0.08 },
        speed: 1.0,
        phase: 0.0,
        parts: new Set(["tripo_part_27", "tripo_part_32", "tripo_part_15"])
      },
      {
        name: "middle",
        knuckle: { x: -0.127, y: 0.700, z: 0.058 },
        curlAngles: { x: 0.32, y: 0.02, z: -0.04 },
        speed: 1.05,
        phase: 0.25,
        parts: new Set(["tripo_part_45", "tripo_part_49", "tripo_part_40", "tripo_part_12"])
      },
      {
        name: "ring",
        knuckle: { x: -0.108, y: 0.700, z: 0.055 },
        curlAngles: { x: 0.35, y: -0.02, z: 0.04 },
        speed: 1.1,
        phase: 0.45,
        parts: new Set(["tripo_part_46", "tripo_part_37"])
      },
      {
        name: "pinky",
        knuckle: { x: -0.092, y: 0.715, z: 0.048 },
        curlAngles: { x: 0.38, y: -0.05, z: 0.08 },
        speed: 1.15,
        phase: 0.65,
        parts: new Set(["tripo_part_54", "tripo_part_43"])
      }
    ];

    const activeFingers: {
      pivot: THREE.Group;
      curlAngles: { x: number; y: number; z: number };
      speed: number;
      phase: number;
    }[] = [];

    // Pivô da Corrente da Cintura (tripo_part_9 conectado pelo eixo superior)
    let chainPivotRef: THREE.Group | null = null;

    let isModelReady = false;

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      "/models/robotinho-v1.glb",
      (gltf) => {
        const rawModel = gltf.scene;

        // Centralização do modelo completo
        const box = new THREE.Box3().setFromObject(rawModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Escala proporcional confortável
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.30 / (maxDim || 1);
        robotWrapper.scale.set(scale, scale, scale);

        // Coletar todas as malhas
        const allMeshes: THREE.Mesh[] = [];
        rawModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            allMeshes.push(child as THREE.Mesh);
          }
        });

        // Configurar materiais PBR foscos e realistas
        allMeshes.forEach((mesh) => {
          mesh.castShadow = true;
          mesh.receiveShadow = true;

          if (mesh.material) {
            const mat = mesh.material as THREE.MeshStandardMaterial;
            mat.roughness = 0.78;
            mat.metalness = 0.20;
            mat.envMapIntensity = 0.5;
            mat.needsUpdate = true;
          }
        });

        // Montar os 5 dedos como grupos cinemáticos unificados
        fingerDefs.forEach((fDef) => {
          const pivotX = fDef.knuckle.x - center.x;
          const pivotY = fDef.knuckle.y - center.y;
          const pivotZ = fDef.knuckle.z - center.z;

          const fingerPivot = new THREE.Group();
          fingerPivot.position.set(pivotX, pivotY, pivotZ);

          const fingerInner = new THREE.Group();
          fingerInner.position.set(-pivotX, -pivotY, -pivotZ);
          fingerPivot.add(fingerInner);

          // Anexar todas as peças deste dedo ao grupo interno
          allMeshes.forEach((mesh) => {
            if (fDef.parts.has(mesh.name)) {
              mesh.position.x -= center.x;
              mesh.position.y -= center.y;
              mesh.position.z -= center.z;
              fingerInner.add(mesh);
            }
          });

          bodyGroup.add(fingerPivot);

          activeFingers.push({
            pivot: fingerPivot,
            curlAngles: fDef.curlAngles,
            speed: fDef.speed,
            phase: fDef.phase
          });
        });

        // Configuração especial para as correntes da cintura (tripo_part_9)
        // Conectadas apenas pelo eixo superior (ponto de fixação no cinto Y=0.604)
        const chainMesh = allMeshes.find((m) => m.name === "tripo_part_9");
        if (chainMesh) {
          const chainPivotX = 0.021 - center.x;
          const chainPivotY = 0.604 - center.y; // Ponto superior do cinto
          const chainPivotZ = 0.056 - center.z;

          const chainPivot = new THREE.Group();
          chainPivot.position.set(chainPivotX, chainPivotY, chainPivotZ);

          const chainInner = new THREE.Group();
          chainInner.position.set(-chainPivotX, -chainPivotY, -chainPivotZ);
          chainPivot.add(chainInner);

          chainMesh.position.x -= center.x;
          chainMesh.position.y -= center.y;
          chainMesh.position.z -= center.z;
          chainInner.add(chainMesh);

          bodyGroup.add(chainPivot);
          chainPivotRef = chainPivot;
        }

        // Todas as outras peças (cabeça, capacete, camisa, calça, palma, braço, sapatos)
        const allFingerPartNames = new Set(fingerDefs.flatMap((f) => Array.from(f.parts)));

        allMeshes.forEach((mesh) => {
          if (!allFingerPartNames.has(mesh.name) && mesh.name !== "tripo_part_9") {
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

        // 2. Movimento suave e contínuo de ABRIR e FECHAR a mão (Flexão Cinemática dos Dedos)
        activeFingers.forEach((finger) => {
          // Onda senoidal de 0 (aberto) a 1 (fechado)
          const curl = (Math.sin(elapsed * finger.speed + finger.phase) * 0.5 + 0.5);

          finger.pivot.rotation.x = curl * finger.curlAngles.x;
          finger.pivot.rotation.y = curl * finger.curlAngles.y;
          finger.pivot.rotation.z = curl * finger.curlAngles.z;
        });

        // 3. Pêndulo e inclinação natural das correntes na cintura (tripo_part_9)
        if (chainPivotRef) {
          const chainSwayZ = Math.sin(elapsed * 1.5 - 0.4) * 0.045;
          const chainSwayX = Math.cos(elapsed * 1.5 - 0.4) * 0.035;
          // Inclinada acompanhando a curvatura do quadril e balanço de levitação
          chainPivotRef.rotation.z = -0.06 + chainSwayZ;
          chainPivotRef.rotation.x = 0.05 + chainSwayX;
        }

        // 4. Levitação suave do robô
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
