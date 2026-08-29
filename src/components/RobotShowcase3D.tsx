import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

export default function RobotShowcase3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const getWidth = () => container.clientWidth || container.offsetWidth || 800;
    const getHeight = () => container.clientHeight || container.offsetHeight || 650;

    const camera = new THREE.PerspectiveCamera(36, getWidth() / getHeight(), 0.1, 1000);
    camera.position.set(0, 0.0, 3.8);
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
    renderer.toneMappingExposure = 1.20;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 2. Iluminação Cinematográfica com Forte Luz Azul Lateral
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x060913, 1.8);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    // Forte luz azul lateral esquerda
    const leftBlueLight = new THREE.DirectionalLight(0x00d1ff, 7.0);
    leftBlueLight.position.set(-5.5, 2.2, 3.0);
    scene.add(leftBlueLight);

    const leftBluePoint = new THREE.PointLight(0x00d1ff, 9.0, 15);
    leftBluePoint.position.set(-3.2, 0.8, 2.0);
    scene.add(leftBluePoint);

    const leftSpot = new THREE.SpotLight(0x00e5ff, 7.5, 20, Math.PI / 4, 0.35, 1);
    leftSpot.position.set(-4.0, 2.0, 3.5);
    scene.add(leftSpot);

    const rimLight = new THREE.PointLight(0x00d1ff, 4.5, 15);
    rimLight.position.set(-3, 3, -3);
    scene.add(rimLight);

    const accentLight = new THREE.PointLight(0x00e6a5, 2.5, 15);
    accentLight.position.set(3, -2, 3);
    scene.add(accentLight);

    // 3. Controles Interativos (Arrasto 360° + Mouse Tracking)
    const robotWrapper = new THREE.Group();
    scene.add(robotWrapper);

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let dragRotationY = 0;
    let dragRotationX = 0;
    let mouseTrackingX = 0;
    let mouseTrackingY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        dragRotationY += deltaX * 0.008;
        dragRotationX += deltaY * 0.005;
        dragRotationX = THREE.MathUtils.clamp(dragRotationX, -0.4, 0.4);

        previousMousePosition = { x: e.clientX, y: e.clientY };
      } else {
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2);
        const y = (e.clientY - (rect.top + rect.height / 2)) / (window.innerHeight / 2);

        mouseTrackingX = THREE.MathUtils.clamp(x * 0.15, -0.15, 0.15);
        mouseTrackingY = THREE.MathUtils.clamp(y * 0.10, -0.08, 0.08);
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // Touch support
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - previousMousePosition.x;
        const deltaY = e.touches[0].clientY - previousMousePosition.y;

        dragRotationY += deltaX * 0.008;
        dragRotationX += deltaY * 0.005;
        dragRotationX = THREE.MathUtils.clamp(dragRotationX, -0.4, 0.4);

        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    container.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);

    // 4. Carregamento do Modelo robotinho-v1.glb
    const bodyGroup = new THREE.Group();

    // Mapeamento dos 5 dedos com seus respectivos segmentos unificados
    const fingerDefs = [
      {
        name: "thumb",
        knuckle: { x: -0.132, y: 0.702, z: 0.016 },
        curlAngles: { x: 0.18, y: 0.08, z: 0.12 },
        speed: 1.1,
        phase: 0.15,
        parts: ["tripo_part_34", "tripo_part_31"]
      },
      {
        name: "index",
        knuckle: { x: -0.141, y: 0.732, z: 0.071 },
        curlAngles: { x: 0.22, y: 0.02, z: -0.04 },
        speed: 1.0,
        phase: 0.0,
        parts: ["tripo_part_32", "tripo_part_27"]
      },
      {
        name: "middle",
        knuckle: { x: -0.113, y: 0.733, z: 0.065 },
        curlAngles: { x: 0.25, y: 0.0, z: -0.02 },
        speed: 1.05,
        phase: 0.25,
        parts: ["tripo_part_49", "tripo_part_45"]
      },
      {
        name: "ring",
        knuckle: { x: -0.115, y: 0.698, z: 0.061 },
        curlAngles: { x: 0.26, y: -0.02, z: 0.02 },
        speed: 1.1,
        phase: 0.45,
        parts: ["tripo_part_37", "tripo_part_46"]
      },
      {
        name: "pinky",
        knuckle: { x: -0.097, y: 0.719, z: 0.062 },
        curlAngles: { x: 0.28, y: -0.04, z: 0.05 },
        speed: 1.15,
        phase: 0.65,
        parts: ["tripo_part_43", "tripo_part_54"]
      }
    ];

    const activeFingers: {
      pivot: THREE.Group;
      curlAngles: { x: number; y: number; z: number };
      speed: number;
      phase: number;
    }[] = [];

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

        const box = new THREE.Box3().setFromObject(rawModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.45 / (maxDim || 1);
        robotWrapper.scale.set(scale, scale, scale);

        const allMeshes: THREE.Mesh[] = [];
        rawModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            allMeshes.push(child as THREE.Mesh);
          }
        });

        allMeshes.forEach((mesh) => {
          mesh.castShadow = true;
          mesh.receiveShadow = true;

          if (mesh.material) {
            const mat = mesh.material as THREE.MeshStandardMaterial;
            mat.roughness = 0.58;
            mat.metalness = 0.32;
            mat.envMapIntensity = 0.8;
            mat.needsUpdate = true;
          }
        });

        // Montar cada dedo unindo seus segmentos
        fingerDefs.forEach((fDef) => {
          const pivotX = fDef.knuckle.x - center.x;
          const pivotY = fDef.knuckle.y - center.y;
          const pivotZ = fDef.knuckle.z - center.z;

          const fingerPivot = new THREE.Group();
          fingerPivot.position.set(pivotX, pivotY, pivotZ);

          const fingerInner = new THREE.Group();
          fingerInner.position.set(-pivotX, -pivotY, -pivotZ);
          fingerPivot.add(fingerInner);

          const partsSet = new Set(fDef.parts);

          allMeshes.forEach((mesh) => {
            if (partsSet.has(mesh.name)) {
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

        // Correntes da cintura em ÂNGULO DE 45 GRAUS
        const chainMesh = allMeshes.find((m) => m.name === "tripo_part_9");
        if (chainMesh) {
          const chainPivotX = 0.021 - center.x;
          const chainPivotY = 0.604 - center.y;
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

        const allFingerPartNames = new Set(fingerDefs.flatMap((f) => f.parts));

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
        console.error("Erro ao carregar showcase:", error);
        setHasError(true);
      }
    );

    // 5. Render & Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    let curY = 0;
    let curX = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (isModelReady) {
        // Interpolação suave para rotação de arrasto + mouse
        curY += (dragRotationY + mouseTrackingX - curY) * 0.08;
        curX += (dragRotationX + mouseTrackingY - curX) * 0.08;

        robotWrapper.rotation.y = curY;
        robotWrapper.rotation.x = curX;

        // Flexão unificada dos dedos
        activeFingers.forEach((finger) => {
          const curl = Math.sin(elapsed * finger.speed + finger.phase) * 0.5 + 0.5;
          finger.pivot.rotation.x = curl * finger.curlAngles.x;
          finger.pivot.rotation.y = curl * finger.curlAngles.y;
          finger.pivot.rotation.z = curl * finger.curlAngles.z;
        });

        // Balanço da corrente a 45 graus
        if (chainPivotRef) {
          const chainSwayZ = Math.sin(elapsed * 1.5 - 0.4) * 0.035;
          const chainSwayX = Math.cos(elapsed * 1.5 - 0.4) * 0.025;
          chainPivotRef.rotation.z = -0.785 + chainSwayZ;
          chainPivotRef.rotation.x = 0.12 + chainSwayX;
        }

        // Levitação suave
        robotWrapper.position.y = Math.sin(elapsed * 1.5) * 0.04;
      }

      renderer.render(scene, camera);
    };

    animate();

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
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      cancelAnimationFrame(animationFrameId);
      dracoLoader.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-visible">
      {/* Background Neon Aura */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#00d1ff]/20 via-[#00e6a5]/10 to-transparent rounded-full blur-[120px] pointer-events-none transform scale-90" />

      {/* Loading State */}
      {!isLoaded && !hasError && (
        <div className="absolute z-20 flex flex-col items-center gap-3 bg-black/70 backdrop-blur-md px-6 py-4 rounded-2xl border border-cyan-500/30 shadow-[0_0_25px_rgba(0,229,255,0.25)]">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs text-cyan-400 font-medium tracking-widest uppercase">
            CARREGANDO SHOWCASE 3D... {loadingProgress > 0 ? `${loadingProgress}%` : ""}
          </span>
        </div>
      )}

      {hasError && (
        <div className="absolute z-20 text-center font-mono text-xs text-red-400 bg-red-950/40 p-4 rounded-xl border border-red-500/30">
          Erro ao carregar o modelo 3D
        </div>
      )}

      {/* Canvas 3D Three.js */}
      <div ref={containerRef} className="w-full h-full z-10 overflow-visible" />
    </div>
  );
}
