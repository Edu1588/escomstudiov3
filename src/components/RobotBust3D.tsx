import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

export default function RobotBust3D() {
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
    const getHeight = () => container.clientHeight || container.offsetHeight || 600;

    // Câmera posicionada para enquadramento perfeito com busto levemente maior
    const camera = new THREE.PerspectiveCamera(40, getWidth() / getHeight(), 0.1, 1000);
    camera.position.set(0, -0.01, 3.35);
    camera.lookAt(0, -0.01, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(getWidth(), getHeight());
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 2. Iluminação Cyberpunk
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x09090b, 3.5);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 4.2);
    keyLight.position.set(3, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x00d1ff, 3.2);
    fillLight.position.set(-4, 2, 2);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x00d1ff, 6.5, 15);
    rimLight.position.set(-2, 3, -3);
    scene.add(rimLight);

    const accentLight = new THREE.PointLight(0x00e6a5, 5.5, 15);
    accentLight.position.set(3, -2, 3);
    scene.add(accentLight);

    // 3. Variáveis de Rastreamento do Mouse
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2);
      const y = (e.clientY - (rect.top + rect.height / 2)) / (window.innerHeight / 2);

      // Movimento angular suave exclusivo da cabeça
      targetRotY = THREE.MathUtils.clamp(x * 0.70, -0.65, 0.65);
      targetRotX = THREE.MathUtils.clamp(y * 0.40, -0.35, 0.35);
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 4. Wrapper e Carregamento com Separação Rigorosa de Peitoral vs Cabeça
    const robotWrapper = new THREE.Group();
    scene.add(robotWrapper);

    let headPivotRef: THREE.Group | null = null;

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      "/models/3Dmodelrobot-v1.glb",
      (gltf) => {
        const rawModel = gltf.scene;

        // Calcular limites de todo o modelo para centralização
        const box = new THREE.Box3().setFromObject(rawModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Escala geral proporcional com busto levemente maior
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.28 / (maxDim || 1);
        robotWrapper.scale.set(scale, scale, scale);

        // Configurar materiais PBR
        rawModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.roughness = 0.35;
              mat.metalness = 0.65;
              mat.needsUpdate = true;
            }
          }
        });

        // Criar os grupos separados de Peitoral e Cabeça
        const chestGroup = new THREE.Group();
        const headPivot = new THREE.Group();
        const headGroup = new THREE.Group();

        // Ponto de articulação do pescoço (acima do peitoral)
        const neckPivotY = 0.25 - center.y;
        const neckPivotZ = 0.00 - center.z;

        headPivot.position.set(0, neckPivotY, neckPivotZ);
        headGroup.position.set(0, -neckPivotY, -neckPivotZ);
        headPivot.add(headGroup);

        // Distribuir nós entre peito (fixo) e cabeça (articulada)
        const allNodes: THREE.Object3D[] = [];
        rawModel.traverse((child) => {
          if (child.name.startsWith("tripo_part_")) {
            allNodes.push(child);
          }
        });

        allNodes.forEach((node) => {
          node.position.x -= center.x;
          node.position.y -= center.y;
          node.position.z -= center.z;

          if (node.name === "tripo_part_0") {
            // Peitoral, ombros e base -> Fixo no peito
            chestGroup.add(node);
          } else {
            // tripo_part_1 (cabeça/face/chifres), tripo_part_2 (queixo/pescoço), tripo_part_3..8 (detalhes)
            // -> Pertencem à cabeça (giram com o mouse)
            headGroup.add(node);
          }
        });

        robotWrapper.add(chestGroup);
        robotWrapper.add(headPivot);
        headPivotRef = headPivot;

        setIsLoaded(true);
      },
      (xhr) => {
        if (xhr.lengthComputable && xhr.total > 0) {
          const percent = Math.round((xhr.loaded / xhr.total) * 100);
          setLoadingProgress(percent);
        }
      },
      (error) => {
        console.error("Erro ao carregar o robô 3D:", error);
        setHasError(true);
      }
    );

    // 5. Render & Animation Loop (Apenas o headPivot gira)
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Interpolação suave para a rotação da cabeça
      currentRotY += (targetRotY - currentRotY) * 0.08;
      currentRotX += (targetRotX - currentRotX) * 0.08;

      if (headPivotRef) {
        // Apenas a cabeça gira em torno da articulação do pescoço
        headPivotRef.rotation.y = currentRotY;
        headPivotRef.rotation.x = currentRotX;
        headPivotRef.rotation.z = currentRotY * -0.08;
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
    <div className="relative w-full h-[480px] md:h-[540px] lg:h-[620px] flex items-center justify-center select-none overflow-visible">
      {/* Background Neon Aura */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#00d1ff]/15 via-[#00e6a5]/10 to-transparent rounded-full blur-[100px] pointer-events-none transform scale-90" />

      {/* Loading State */}
      {!isLoaded && !hasError && (
        <div className="absolute z-20 flex flex-col items-center gap-3 bg-black/70 backdrop-blur-md px-6 py-4 rounded-2xl border border-cyan-500/30 shadow-[0_0_25px_rgba(0,229,255,0.25)]">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs text-cyan-400 font-medium tracking-widest uppercase">
            CARREGANDO BUSTO 3D... {loadingProgress > 0 ? `${loadingProgress}%` : ""}
          </span>
        </div>
      )}

      {hasError && (
        <div className="absolute z-20 text-center font-mono text-xs text-red-400 bg-red-950/40 p-4 rounded-xl border border-red-500/30">
          Erro ao carregar o modelo 3D 3Dmodelrobot-v1.glb
        </div>
      )}

      {/* Canvas 3D Three.js */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing z-10 overflow-visible" />
    </div>
  );
}
