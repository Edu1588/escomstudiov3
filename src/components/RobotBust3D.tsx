import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

export default function RobotBust3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isBlueprintHovered, setIsBlueprintHovered] = useState<boolean>(false);

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
    let isHovered = false;
    let hoverProgress = 0.0;
    const blueprintDarkColor = new THREE.Color(0x02182b);
    const blueprintEmissive = new THREE.Color(0x003355);

    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const allMeshes: THREE.Mesh[] = [];

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
      const centerX = rect.left + rect.width * 0.5;
      const centerY = rect.top + rect.height * 0.5;

      const x = (e.clientX - centerX) / (window.innerWidth * 0.5);
      const y = (e.clientY - centerY) / (window.innerHeight * 0.5);

      targetRotY = THREE.MathUtils.clamp(x * 0.95, -0.85, 0.85);
      targetRotX = THREE.MathUtils.clamp(y * 0.55, -0.38, 0.38);
    };

    const handleMouseEnter = () => {
      isHovered = true;
      setIsBlueprintHovered(true);
    };

    const handleMouseLeave = () => {
      isHovered = false;
      setIsBlueprintHovered(false);
    };

    const handleClick = () => {
      // No clique ou toque, além de disparar a sequência de olhos, alterna o modo blueprint no mobile
      if (window.innerWidth < 1024) {
        isHovered = !isHovered;
        setIsBlueprintHovered(isHovered);
      }
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
              mesh.userData.origRoughness = mat.roughness;
              mesh.userData.origMetalness = mat.metalness;
              mesh.userData.origColor = mat.color.clone();
              mesh.userData.origEmissive = mat.emissive.clone();
              allMeshes.push(mesh);
            }

            // Cria malha wireframe idêntica em overlay como filha da mesh original
            const wireMesh = new THREE.Mesh(mesh.geometry, wireMaterial);
            wireMesh.name = "wireframe_blueprint";
            mesh.add(wireMesh);
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

      // Interpolação suave do efeito Blueprint no Hover
      const targetHover = isHovered ? 1.0 : 0.0;
      hoverProgress += (targetHover - hoverProgress) * 0.085;

      if (hoverProgress > 0.002) {
        wireMaterial.opacity = hoverProgress * 0.95;
        wireMaterial.visible = true;
      } else {
        wireMaterial.opacity = 0.0;
        wireMaterial.visible = false;
      }

      // Transição da cor base e emissive dos materiais para blueprint escuro
      if (allMeshes.length > 0) {
        allMeshes.forEach((mesh) => {
          if (mesh.material && mesh.userData.origColor) {
            const mat = mesh.material as THREE.MeshStandardMaterial;
            mat.color.lerpColors(mesh.userData.origColor, blueprintDarkColor, hoverProgress);
            mat.emissive.lerpColors(mesh.userData.origEmissive, blueprintEmissive, hoverProgress);
          }
        });
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

      // Micro-pulsação bio-elétrica sutil quando aceso ou em hover blueprint
      let finalIntensity = currentEyeIntensity;
      if (isEyesOn && !isAnimatingToggle) {
        const pulse = 1.0 + Math.sin(time * 3.5) * 0.06 + Math.sin(time * 8.0) * 0.02;
        finalIntensity = currentEyeIntensity * pulse;
      }

      // No modo blueprint, acende também as luzes da face proporcionalmente ao hover
      const combinedEyeIntensity = Math.max(finalIntensity, hoverProgress * 2.2);

      faceGlowLight.intensity = combinedEyeIntensity * 2.8;
      eyeL.intensity = combinedEyeIntensity * 3.5;
      eyeR.intensity = combinedEyeIntensity * 3.5;
      chinUnderglow.intensity = combinedEyeIntensity * 1.5;

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
      wireMaterial.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-hidden group cursor-crosshair">
      {/* Grade Blueprint de Fundo (ativada no Hover) */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-500 z-10 ${
          isBlueprintHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.16) 0%, transparent 75%),
            linear-gradient(to right, rgba(0, 240, 255, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 240, 255, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 32px 32px, 32px 32px",
        }}
      />

      {/* Retículas Técnicas HUD CAD (ativadas no Hover) */}
      <div
        className={`absolute inset-5 pointer-events-none z-20 flex flex-col justify-between transition-opacity duration-300 font-mono text-[10px] tracking-widest text-cyan-400 ${
          isBlueprintHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="bg-black/75 px-2.5 py-1 rounded border border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
              SYS.CAD // WIREFRAME 3D
            </span>
          </div>
          <span className="bg-black/75 px-2.5 py-1 rounded border border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
            TOPOLOGY // MESH ACTIVE
          </span>
        </div>

        <div className="flex justify-between items-end">
          <span className="bg-black/75 px-2.5 py-1 rounded border border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
            HEAD TRACK: ACTIVE (LERP)
          </span>
          <span className="bg-black/75 px-2.5 py-1 rounded border border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
            [BLUEPRINT INSPECT]
          </span>
        </div>
      </div>

      {/* Indicador Flutuante Padrão (Sem Hover) */}
      <div
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none z-20 transition-opacity duration-300 font-mono text-[10px] tracking-wider uppercase text-black/60 bg-[#ecece3]/90 backdrop-blur-md px-3 py-1 rounded-full border border-black/15 flex items-center gap-2 shadow-sm ${
          isBlueprintHovered ? "opacity-0" : "opacity-100"
        }`}
      >
        <span className="size-1.5 rounded-full bg-cyan-500 animate-pulse" />
        <span>Passe o cursor para ativar o Blueprint 3D</span>
      </div>

      {/* Contêiner WebGL Canvas */}
      <div
        ref={containerRef}
        className="w-full h-full relative z-20 flex items-center justify-center overflow-visible"
        title="Passe o mouse para ver o modelo em grid blueprint"
      />
    </div>
  );
}
