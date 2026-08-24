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

    const width = container.clientWidth || container.offsetWidth || 480;
    const height = container.clientHeight || container.offsetHeight || 580;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(0, 0.05, 3.0);
    camera.lookAt(0, 0.05, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 2. Cyberpunk Lighting Setup
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

    // 3. Mouse Tracking Variables & Head Rotation Uniform
    const headRotationUniform = { value: new THREE.Vector2(0, 0) };
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2);
      const y = (e.clientY - (rect.top + rect.height / 2)) / (window.innerHeight / 2);

      // Limitar a rotação para um movimento natural da cabeça
      targetRotY = THREE.MathUtils.clamp(x * 0.75, -0.65, 0.65);
      targetRotX = THREE.MathUtils.clamp(y * 0.45, -0.35, 0.35);
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 4. Wrapper and Draco-enabled GLTF Loader
    const robotWrapper = new THREE.Group();
    scene.add(robotWrapper);

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      "/models/futuristRobot-v1.glb",
      (gltf) => {
        const rawModel = gltf.scene;

        // Centralização geométrica exata
        const box = new THREE.Box3().setFromObject(rawModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        rawModel.position.x = -center.x;
        rawModel.position.y = -center.y;
        rawModel.position.z = -center.z;

        // Escala aumentada para dar maior presença ao busto (2.75x)
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.75 / (maxDim || 1);
        robotWrapper.scale.set(scale, scale, scale);

        // Modificação do Vertex Shader para animar APENAS a cabeça mantendo o peito fixo para frente
        rawModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            if (mesh.material) {
              const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
              mat.roughness = 0.35;
              mat.metalness = 0.65;

              mat.onBeforeCompile = (shader) => {
                shader.uniforms.uHeadRotation = headRotationUniform;
                shader.uniforms.uNeckY = { value: -0.05 };
                shader.uniforms.uHeadY = { value: 0.30 };

                shader.vertexShader = `
                  uniform vec2 uHeadRotation;
                  uniform float uNeckY;
                  uniform float uHeadY;
                  ${shader.vertexShader}
                `;

                shader.vertexShader = shader.vertexShader.replace(
                  "#include <begin_vertex>",
                  `
                  #include <begin_vertex>

                  // Fator de influência da cabeça (0 = peito/ombros fixos, 1 = topo da cabeça)
                  float headFactor = smoothstep(uNeckY, uHeadY, transformed.y);

                  if (headFactor > 0.0) {
                    // Rotação Y (Giro esquerda / direita)
                    float angleY = uHeadRotation.x * headFactor;
                    float cosY = cos(angleY);
                    float sinY = sin(angleY);
                    mat2 rotY = mat2(cosY, sinY, -sinY, cosY);
                    transformed.xz = rotY * transformed.xz;

                    // Rotação X (Inclinação cima / baixo em torno do pescoço)
                    float angleX = uHeadRotation.y * headFactor;
                    float cosX = cos(angleX);
                    float sinX = sin(angleX);
                    mat2 rotX = mat2(cosX, -sinX, sinX, cosX);
                    
                    transformed.y -= uNeckY;
                    transformed.yz = rotX * transformed.yz;
                    transformed.y += uNeckY;
                  }
                  `
                );

                shader.vertexShader = shader.vertexShader.replace(
                  "#include <beginnormal_vertex>",
                  `
                  #include <beginnormal_vertex>

                  float headFactorNorm = smoothstep(uNeckY, uHeadY, position.y);
                  if (headFactorNorm > 0.0) {
                    float angleYNorm = uHeadRotation.x * headFactorNorm;
                    float cosYN = cos(angleYNorm);
                    float sinYN = sin(angleYNorm);
                    mat2 rotYN = mat2(cosYN, sinYN, -sinYN, cosYN);
                    objectNormal.xz = rotYN * objectNormal.xz;

                    float angleXNorm = uHeadRotation.y * headFactorNorm;
                    float cosXN = cos(angleXNorm);
                    float sinXN = sin(angleXNorm);
                    mat2 rotXN = mat2(cosXN, -sinXN, sinXN, cosXN);
                    objectNormal.yz = rotXN * objectNormal.yz;
                  }
                  `
                );
              };

              mat.needsUpdate = true;
              mesh.material = mat;
            }
          }
        });

        robotWrapper.add(rawModel);
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

    // 5. Render & Animation Loop (Sem flutuação vertical)
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Interpolação suave para a rotação da cabeça
      currentRotY += (targetRotY - currentRotY) * 0.08;
      currentRotX += (targetRotX - currentRotX) * 0.08;

      // Passar a rotação calculada para o shader da cabeça
      headRotationUniform.value.set(currentRotY, currentRotX);

      renderer.render(scene, camera);
    };

    animate();

    // 6. Handle Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || container.offsetWidth || 480;
      const h = container.clientHeight || container.offsetHeight || 580;
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
    <div className="relative w-full h-[440px] md:h-[540px] lg:h-[620px] flex items-center justify-center select-none">
      {/* Background Neon Aura */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#00d1ff]/20 via-[#00e6a5]/15 to-transparent rounded-full blur-[100px] pointer-events-none transform scale-95" />

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
    </div>
  );
}
