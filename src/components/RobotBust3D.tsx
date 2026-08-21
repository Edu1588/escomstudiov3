import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

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

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.5, 4.2);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    // Limpar container e adicionar canvas
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 2. Lighting Setup (Futuristic Cyber Cyberpunk Theme)
    const ambientLight = new THREE.AmbientLight(0x0f172a, 2.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x00d1ff, 2.0);
    fillLight.position.set(-4, 2, -2);
    scene.add(fillLight);

    // Luz de contorno ciano (Rim light)
    const rimLight = new THREE.PointLight(0x00d1ff, 6.0, 15);
    rimLight.position.set(-2, 3, -2);
    scene.add(rimLight);

    // Luz esmeralda (Accent light)
    const accentLight = new THREE.PointLight(0x00e6a5, 5.0, 15);
    accentLight.position.set(2, -1, 3);
    scene.add(accentLight);

    // 3. Mouse Tracking Variables
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalizar coordenadas do mouse entre -1 e 1
      const rect = container.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      mouseX = x / (window.innerWidth / 2);
      mouseY = y / (window.innerHeight / 2);

      // Limites de rotação (radianos)
      targetRotY = mouseX * 0.65; // ~37 graus de rotação horizontal
      targetRotX = mouseY * 0.45; // ~25 graus de rotação vertical
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 4. Carregador do Modelo GLTF
    let robotModel: THREE.Group | null = null;
    let headMesh: THREE.Object3D | null = null;

    const loader = new GLTFLoader();
    loader.load(
      "/models/futuristRobot-v1.glb",
      (gltf) => {
        robotModel = gltf.scene;

        // Centralizar o modelo
        const box = new THREE.Box3().setFromObject(robotModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        robotModel.position.x -= center.x;
        robotModel.position.y -= center.y;
        robotModel.position.z -= center.z;

        // Ajustar escala para encaixar na tela
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.2 / maxDim;
        robotModel.scale.set(scale, scale, scale);

        // Procurar no esqueleto ou na hierarquia por nó da cabeça
        robotModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            const mesh = child as THREE.Mesh;
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.envMapIntensity = 1.5;
            }
          }

          const name = child.name.toLowerCase();
          if (
            name.includes("head") ||
            name.includes("cabeca") ||
            name.includes("cabeça") ||
            name.includes("neck")
          ) {
            headMesh = child;
          }
        });

        scene.add(robotModel);
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

    // 5. Render Loop (Com animação suave a 60-120 FPS)
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      if (robotModel) {
        // Interpolação suave (lerp) da rotação do mouse
        currentRotY += (targetRotY - currentRotY) * 0.06;
        currentRotX += (targetRotX - currentRotX) * 0.06;

        if (headMesh) {
          headMesh.rotation.y = currentRotY;
          headMesh.rotation.x = currentRotX;
        } else {
          // Se não houver osso individual da cabeça, rotaciona o busto suavemente
          robotModel.rotation.y = currentRotY;
          robotModel.rotation.x = currentRotX;
        }

        // Levitação/flutuação suave do busto
        robotModel.position.y = Math.sin(elapsedTime * 1.5) * 0.06 - 0.1;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 6. Handle Resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[450px] md:h-[550px] lg:h-[620px] flex items-center justify-center select-none">
      {/* Glow de fundo neon no Robô */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#00d1ff]/15 via-[#00e6a5]/10 to-transparent rounded-full blur-[100px] pointer-events-none transform scale-75" />

      {/* Indicadores de carregamento */}
      {!isLoaded && !hasError && (
        <div className="absolute z-20 flex flex-col items-center gap-3 bg-black/60 backdrop-blur-md px-6 py-4 rounded-2xl border border-cyan-500/30 shadow-[0_0_25px_rgba(0,229,255,0.2)]">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs text-cyan-400 font-medium tracking-widest uppercase">
            CARREGANDO BUSTO ROBÓTICO 3D... {loadingProgress > 0 ? `${loadingProgress}%` : ""}
          </span>
        </div>
      )}

      {hasError && (
        <div className="absolute z-20 text-center font-mono text-xs text-red-400 bg-red-950/40 p-4 rounded-xl border border-red-500/30">
          Não foi possível carregar o modelo 3D.
        </div>
      )}

      {/* Canvas 3D Three.js */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing z-10" />

      {/* Subtítulo indicador de interatividade */}
      {isLoaded && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-mono text-[10px] text-zinc-300 tracking-wider uppercase">
            [ MOVA O MOUSE PARA INTERAGIR ]
          </span>
        </div>
      )}
    </div>
  );
}
