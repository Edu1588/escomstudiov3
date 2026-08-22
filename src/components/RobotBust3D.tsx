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
    camera.position.set(0, 0.45, 2.8);
    camera.lookAt(0, 0.45, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 2. High Quality Lighting Setup
    // Hemisphere light for bright ambient coverage
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x0f172a, 3.5);
    scene.add(hemiLight);

    // Key Light (Front/Top)
    const keyLight = new THREE.DirectionalLight(0xffffff, 4.0);
    keyLight.position.set(3, 5, 5);
    scene.add(keyLight);

    // Fill Light (Cyan side glow)
    const fillLight = new THREE.DirectionalLight(0x00d1ff, 3.0);
    fillLight.position.set(-4, 2, 2);
    scene.add(fillLight);

    // Rim Light (Cyan backlight)
    const rimLight = new THREE.PointLight(0x00d1ff, 6.0, 15);
    rimLight.position.set(-2, 3, -3);
    scene.add(rimLight);

    // Accent Light (Emerald green glow)
    const accentLight = new THREE.PointLight(0x00e6a5, 5.0, 15);
    accentLight.position.set(3, -1, 3);
    scene.add(accentLight);

    // 3. Mouse Tracking Variables
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;

      targetRotY = x * 0.65; // Horizontal turn
      targetRotX = y * 0.40; // Vertical turn
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 4. Load GLTF 3D Model
    let robotModel: THREE.Group | null = null;
    let initialPosY = 0;

    const loader = new GLTFLoader();
    loader.load(
      "/models/futuristRobot-v1.glb",
      (gltf) => {
        robotModel = gltf.scene;

        // Calculate bounding box and scale
        const box = new THREE.Box3().setFromObject(robotModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Center mesh geometry
        robotModel.position.x = -center.x;
        robotModel.position.y = -center.y + 0.1;
        robotModel.position.z = -center.z;
        initialPosY = robotModel.position.y;

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.3 / maxDim;
        robotModel.scale.set(scale, scale, scale);

        // Adjust materials for maximum shine and visibility
        robotModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.roughness = 0.3;
              mat.metalness = 0.7;
              mat.needsUpdate = true;
            }
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

    // 5. Render & Lerp Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (robotModel) {
        // Smooth lerp rotation towards mouse position
        currentRotY += (targetRotY - currentRotY) * 0.07;
        currentRotX += (targetRotX - currentRotX) * 0.07;

        robotModel.rotation.y = currentRotY;
        robotModel.rotation.x = currentRotX;

        // Subtle vertical floating motion
        robotModel.position.y = initialPosY + Math.sin(elapsedTime * 1.5) * 0.05;
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
    <div className="relative w-full h-[380px] md:h-[480px] lg:h-[540px] flex items-center justify-center select-none">
      {/* Background Neon Aura */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#00d1ff]/20 via-[#00e6a5]/15 to-transparent rounded-full blur-[90px] pointer-events-none transform scale-90" />

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
          Erro ao carregar o modelo 3D futuristRobot-v1.glb
        </div>
      )}

      {/* Canvas 3D Three.js */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing z-10" />

      {/* Interactive Badge */}
      {isLoaded && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-cyan-500/30 pointer-events-none shadow-[0_0_12px_rgba(0,229,255,0.2)]">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-mono text-[10px] text-cyan-300 tracking-wider uppercase">
            [ BUSTO 3D INTERATIVO &bull; MOVA O MOUSE ]
          </span>
        </div>
      )}
    </div>
  );
}
