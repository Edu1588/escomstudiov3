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

    const getWidth = () => container.clientWidth || container.offsetWidth || 560;
    const getHeight = () => container.clientHeight || container.offsetHeight || 680;

    const width = getWidth();
    const height = getHeight();
    let aspect = width / height;
    const isMobileViewport = window.innerWidth < 1024;

    // Câmera com enquadramento dinâmico inteligente que impede cortes nos ombros e chifres
    const camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 1000);
    const applyCameraFraming = (currentAspect: number, isMobile: boolean) => {
      camera.aspect = currentAspect;
      if (isMobile) {
        camera.position.set(0, 0.05, 6.20);
        camera.lookAt(0, 0.03, 0);
      } else {
        // Compensação horizontal dinâmica: se o aspect ratio for mais estreito que 1.15,
        // ajusta a distância proporcionalmente para que os ombros NUNCA toquem as laterais
        const baseDist = 3.35;
        const targetDist = currentAspect < 1.15 ? baseDist * (1.15 / Math.max(currentAspect, 0.55)) : baseDist;
        camera.position.set(0, 0.04, targetDist);
        camera.lookAt(0, 0.08, 0);
      }
      camera.updateProjectionMatrix();
    };

    applyCameraFraming(aspect, isMobileViewport);

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

    // 2.1 Luzes dos Olhos / Face (Azul Neon Puro 0x00f0ff / 0x00d8ff)
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

    // 4. Uniforms do Modo Blueprint Interativo Localizado
    const targetMouse = new THREE.Vector2(999, 999);
    const currentMouse = new THREE.Vector2(999, 999);

    const blueprintUniforms = {
      uBlueprint: { value: 0.0 },
      uTime: { value: 0.0 },
      uMouse: { value: currentMouse },
      uAspect: { value: aspect },
    };

    let isHovered = false;
    let hoverProgress = 0.0;

    // 5. Controle de Luzes dos Olhos (apenas no clique)
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

      // Movimento suave da cabeça
      const x = (e.clientX - centerX) / (window.innerWidth / 2);
      const y = (e.clientY - centerY) / (window.innerHeight / 2);

      targetRotY = THREE.MathUtils.clamp(x * 0.85, -0.75, 0.75);
      targetRotX = THREE.MathUtils.clamp(y * 0.45, -0.35, 0.35);

      // Posição normalizada do mouse para a grade blueprint
      const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetMouse.set(ndcX, ndcY);
    };

    const handleMouseEnter = (e: MouseEvent) => {
      isHovered = true;
      const rect = container.getBoundingClientRect();
      const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetMouse.set(ndcX, ndcY);
      currentMouse.set(ndcX, ndcY);
    };

    const handleMouseLeave = () => {
      isHovered = false;
      targetMouse.set(999, 999);
    };

    const handleClick = (e: MouseEvent) => {
      handleToggleEyes();
      const rect = container.getBoundingClientRect();
      const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetMouse.set(ndcX, ndcY);
      currentMouse.set(ndcX, ndcY);
      isHovered = true;
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
        // Escala calibrada: imponente e com folga segura para nunca cortar ombros ou chifres
        const targetScale = isMobileViewport ? 0.40 : 1.90;
        const scale = targetScale / (maxDim || 1);
        robotWrapper.scale.set(scale, scale, scale);

        rawModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material) {
              const origMat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
              const mat = (origMat as THREE.MeshStandardMaterial).clone();
              mesh.material = mat;
              mat.roughness = 0.32;
              mat.metalness = 0.68;

              // Shader Hook: Grade Blueprint limpa e sutil desenhada diretamente na superfície metálica
              mat.onBeforeCompile = (shader) => {
                shader.uniforms.uBlueprint = blueprintUniforms.uBlueprint;
                shader.uniforms.uTime = blueprintUniforms.uTime;
                shader.uniforms.uMouse = blueprintUniforms.uMouse;
                shader.uniforms.uAspect = blueprintUniforms.uAspect;

                shader.vertexShader = `
                  varying vec3 vObjPos;
                  varying vec2 vScreenPos;
                  ${shader.vertexShader}
                `.replace(
                  "#include <begin_vertex>",
                  `#include <begin_vertex>
                  vObjPos = position;
                  vec4 clipPos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                  vScreenPos = clipPos.xy / max(clipPos.w, 0.0001);`
                );

                shader.fragmentShader = `
                  uniform float uBlueprint;
                  uniform float uTime;
                  uniform vec2 uMouse;
                  uniform float uAspect;
                  varying vec3 vObjPos;
                  varying vec2 vScreenPos;
                  ${shader.fragmentShader}
                `.replace(
                  "#include <dithering_fragment>",
                  `#include <dithering_fragment>
                  if (uBlueprint > 0.001) {
                    vec2 diff = vScreenPos - uMouse;
                    diff.x *= uAspect;
                    float dist = length(diff);

                    // Raio focal da passagem do mouse (sem luz ofuscante, sem anel neon)
                    float lensRadius = 0.26;
                    float feather = 0.08;
                    float spotMask = 1.0 - smoothstep(lensRadius - feather, lensRadius + feather, dist);

                    if (spotMask > 0.001) {
                      // Grade técnica procedural 3D nítida
                      vec3 gridScale = vObjPos * 22.0;
                      vec3 gridDeriv = fwidth(gridScale);
                      vec3 gridDist = abs(fract(gridScale - 0.5) - 0.5) / max(gridDeriv, vec3(0.001));
                      float minLine = min(min(gridDist.x, gridDist.y), gridDist.z);
                      float gridMask = 1.0 - min(minLine, 1.0);

                      // Apenas as linhas ciano da grade, desenhadas sobre a textura metálica original
                      // Sem fundo azul marinho e sem efeito de anel de luz
                      vec3 cyanLine = vec3(0.0, 0.88, 1.0);
                      float lineAlpha = gridMask * spotMask * uBlueprint * 0.95;

                      gl_FragColor.rgb = mix(gl_FragColor.rgb, cyanLine, lineAlpha);
                    }
                  }`
                );
              };

              mat.customProgramCacheKey = () => "blueprint-subtle-grid-v3";
              mat.needsUpdate = true;
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

      // Transição suave da grade e interpolação do cursor
      const targetHover = isHovered ? 1.0 : 0.0;
      hoverProgress += (targetHover - hoverProgress) * 0.08;
      blueprintUniforms.uBlueprint.value = hoverProgress;
      blueprintUniforms.uTime.value = time;

      if (isHovered) {
        currentMouse.lerp(targetMouse, 0.18);
      } else {
        currentMouse.set(999, 999);
      }
      blueprintUniforms.uMouse.value.copy(currentMouse);
      blueprintUniforms.uAspect.value = aspect;

      // Execução da animação de acendimento/apagamento dos olhos apenas no clique
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

      let finalIntensity = currentEyeIntensity;
      if (isEyesOn && !isAnimatingToggle) {
        const pulse = 1.0 + Math.sin(time * 3.5) * 0.06 + Math.sin(time * 8.0) * 0.02;
        finalIntensity = currentEyeIntensity * pulse;
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

      // Micro-respiração orgânica do robô
      const basePosY = isMobile ? 0 : 0.05;
      robotWrapper.position.y = basePosY + Math.sin(time * 1.5) * 0.008;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = getWidth();
      const h = getHeight();
      aspect = w / h;
      const isMobile = window.innerWidth < 1024;
      applyCameraFraming(aspect, isMobile);
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
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-visible group cursor-crosshair">
      {/* Contêiner WebGL Canvas */}
      <div
        ref={containerRef}
        className="w-full h-full relative z-20 flex items-center justify-center overflow-visible"
      />
    </div>
  );
}
