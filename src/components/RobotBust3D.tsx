import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

export default function RobotBust3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isBlueprintActive, setIsBlueprintActive] = useState<boolean>(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer Setup
    const scene = new THREE.Scene();

    const getWidth = () => container.clientWidth || container.offsetWidth || 560;
    const getHeight = () => container.clientHeight || container.offsetHeight || 680;

    const width = getWidth();
    const height = getHeight();
    const aspect = width / height;
    const isMobileViewport = window.innerWidth < 1024;

    const camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 1000);
    if (isMobileViewport) {
      camera.position.set(0, 0.08, 6.80);
      camera.lookAt(0, 0.02, 0);
    } else {
      camera.position.set(0, 0.04, 3.40);
      camera.lookAt(0, 0.12, 0);
    }

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(getWidth(), getHeight());
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.30;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 2. Iluminação PBR de Alta Definição
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x09090b, 2.8);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.8);
    keyLight.position.set(3, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x00d1ff, 2.5);
    fillLight.position.set(-4, 2, 2);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x00ffff, 5.5, 16);
    rimLight.position.set(-2, 3, -2);
    scene.add(rimLight);

    const accentLight = new THREE.PointLight(0x00e6a5, 3.8, 14);
    accentLight.position.set(3, -2, 3);
    scene.add(accentLight);

    // 2.1 Luzes de Alta Precisão dos Olhos / Face (Azul Neon Puro 0x00f0ff / 0x00d8ff)
    const faceGlowLight = new THREE.PointLight(0x00d8ff, 0, 2.2);
    faceGlowLight.position.set(0, 0.40, 0.42);

    const eyeL = new THREE.PointLight(0x00f0ff, 0, 1.2);
    eyeL.position.set(-0.13, 0.41, 0.38);

    const eyeR = new THREE.PointLight(0x00f0ff, 0, 1.2);
    eyeR.position.set(0.13, 0.41, 0.38);

    const chinUnderglow = new THREE.PointLight(0x0099ff, 0, 1.4);
    chinUnderglow.position.set(0, 0.20, 0.32);

    // 3. Rastreamento do Mouse (Desktop) + Modo Automático Lento (Mobile)
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let isDesktopMouseActive = false;

    // 4. Modo Blueprint / Wireframe no Hover
    let isBlueprint = false;
    const meshesList: { mesh: THREE.Mesh; origMat: THREE.Material | THREE.Material[] }[] = [];

    const blueprintMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
    });

    const setBlueprintMode = (active: boolean) => {
      isBlueprint = active;
      setIsBlueprintActive(active);
      meshesList.forEach(({ mesh, origMat }) => {
        mesh.material = active ? blueprintMaterial : origMat;
      });
    };

    // 5. Controle de Luzes dos Olhos
    let isEyesOn = false;
    let currentEyeIntensity = 0.0;
    let isAnimatingToggle = false;
    let toggleStartTime = 0;
    let autoTurnOffTimer: number | null = null;

    type Keyframe = { time: number; intensity: number };
    let toggleSequence: Keyframe[] = [];

    const handleToggleEyes = () => {
      if (autoTurnOffTimer) {
        clearTimeout(autoTurnOffTimer);
        autoTurnOffTimer = null;
      }

      isEyesOn = true;
      toggleStartTime = performance.now();
      isAnimatingToggle = true;

      toggleSequence = [
        { time: 0, intensity: 0.0 },
        { time: 40, intensity: 4.5 },
        { time: 90, intensity: 0.3 },
        { time: 150, intensity: 5.0 },
        { time: 230, intensity: 1.0 },
        { time: 320, intensity: 3.8 },
        { time: 450, intensity: 2.2 },
        { time: 600, intensity: 2.0 },
      ];

      autoTurnOffTimer = window.setTimeout(() => {
        isEyesOn = false;
        toggleStartTime = performance.now();
        isAnimatingToggle = true;

        toggleSequence = [
          { time: 0, intensity: 2.0 },
          { time: 100, intensity: 1.2 },
          { time: 250, intensity: 0.4 },
          { time: 450, intensity: 0.0 },
        ];
      }, 3500);
    };

    const handleMouseMove = (e: MouseEvent) => {
      isDesktopMouseActive = true;
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const x = (e.clientX - centerX) / (window.innerWidth / 2);
      const y = (e.clientY - centerY) / (window.innerHeight / 2);

      targetRotY = THREE.MathUtils.clamp(x * 0.85, -0.75, 0.75);
      targetRotX = THREE.MathUtils.clamp(y * 0.45, -0.35, 0.35);
    };

    const handleMouseEnter = () => {
      setBlueprintMode(true);
      handleToggleEyes();
    };

    const handleMouseLeave = () => {
      setBlueprintMode(false);
    };

    const handleClick = () => {
      setBlueprintMode(!isBlueprint);
      handleToggleEyes();
    };

    window.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("click", handleClick);
    window.addEventListener("toggle-robot-eyes", handleToggleEyes);

    // 6. Carregamento do Robô 3D
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

        const box = new THREE.Box3().setFromObject(rawModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const targetScale = isMobileViewport ? 0.45 : 2.05;
        const scale = targetScale / (maxDim || 1);
        robotWrapper.scale.set(scale, scale, scale);

        rawModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.roughness = 0.32;
              mat.metalness = 0.68;
              mat.needsUpdate = true;
              meshesList.push({ mesh, origMat: mesh.material });
            }
          }
        });

        const chestGroup = new THREE.Group();
        const headPivot = new THREE.Group();
        const headGroup = new THREE.Group();

        const neckPivotY = 0.25 - center.y;
        const neckPivotZ = 0.00 - center.z;

        headPivot.position.set(0, neckPivotY, neckPivotZ);
        headGroup.position.set(0, -neckPivotY, -neckPivotZ);
        headPivot.add(headGroup);

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
            chestGroup.add(node);
          } else {
            headGroup.add(node);
          }
        });

        // Adiciona as luzes de neon azul diretamente ao pivot da cabeça
        headPivot.add(faceGlowLight);
        headPivot.add(eyeL);
        headPivot.add(eyeR);
        headPivot.add(chinUnderglow);

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

    // 7. Render & Animation Loop
    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      time += 0.015;

      const isMobile = window.innerWidth < 1024;

      // Movimento suave no mobile
      if (isMobile && !isDesktopMouseActive) {
        const autoY = Math.sin(time * 0.40) * 0.38 + Math.sin(time * 0.18) * 0.14;
        const autoX = Math.cos(time * 0.28) * 0.18 + Math.sin(time * 0.12) * 0.08;

        targetRotY = THREE.MathUtils.clamp(autoY, -0.55, 0.55);
        targetRotX = THREE.MathUtils.clamp(autoX, -0.28, 0.28);
      }

      // Execução da animação de acendimento/apagamento dos olhos
      if (isAnimatingToggle && toggleSequence.length > 0) {
        const elapsed = performance.now() - toggleStartTime;
        const lastKeyframe = toggleSequence[toggleSequence.length - 1];

        if (elapsed >= lastKeyframe.time) {
          currentEyeIntensity = lastKeyframe.intensity;
          isAnimatingToggle = false;
        } else {
          for (let i = 0; i < toggleSequence.length - 1; i++) {
            const k1 = toggleSequence[i];
            const k2 = toggleSequence[i + 1];
            if (elapsed >= k1.time && elapsed <= k2.time) {
              const progress = (elapsed - k1.time) / (k2.time - k1.time);
              currentEyeIntensity = k1.intensity + (k2.intensity - k1.intensity) * progress;
              break;
            }
          }
        }
      }

      // Micro-pulsação bio-elétrica sutil quando aceso
      let finalIntensity = currentEyeIntensity;
      if (isEyesOn && !isAnimatingToggle) {
        const pulse = 1.0 + Math.sin(time * 3.5) * 0.06 + Math.sin(time * 8.0) * 0.02;
        finalIntensity = currentEyeIntensity * pulse;
      }

      // No modo blueprint ativo, garante iluminação viva
      if (isBlueprint) {
        finalIntensity = Math.max(finalIntensity, 2.0);
      }

      faceGlowLight.intensity = finalIntensity * 2.8;
      eyeL.intensity = finalIntensity * 3.5;
      eyeR.intensity = finalIntensity * 3.5;
      chinUnderglow.intensity = finalIntensity * 1.5;

      // Suavização ultra fluida do movimento da cabeça com Lerp
      currentRotX += (targetRotX - currentRotX) * 0.055;
      currentRotY += (targetRotY - currentRotY) * 0.055;

      if (headPivotRef) {
        headPivotRef.rotation.y = currentRotY;
        headPivotRef.rotation.x = currentRotX;
      }

      // Micro-respiração orgânica do robô com elevação no desktop
      const basePosY = isMobile ? 0 : 0.08;
      robotWrapper.position.y = basePosY + Math.sin(time * 1.5) * 0.01;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = getWidth();
      const h = getHeight();
      camera.aspect = w / h;
      const isMobile = window.innerWidth < 1024;
      if (isMobile) {
        camera.position.set(0, 0.08, 6.80);
        camera.lookAt(0, 0.02, 0);
      } else {
        camera.position.set(0, 0.04, 3.40);
        camera.lookAt(0, 0.12, 0);
      }
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (autoTurnOffTimer) clearTimeout(autoTurnOffTimer);
      window.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("click", handleClick);
      window.removeEventListener("toggle-robot-eyes", handleToggleEyes);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      dracoLoader.dispose();
      blueprintMaterial.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-visible group cursor-pointer">
      {/* Contêiner WebGL Canvas */}
      <div
        ref={containerRef}
        className="w-full h-full relative z-20 flex items-center justify-center overflow-visible"
        title="Passe o mouse para ver a malha em grid blueprint 3D"
      />
    </div>
  );
}
