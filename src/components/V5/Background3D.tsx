import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function Background3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setLoaded] = useState(false);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.02);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(1); // Force 1:1 pixel ratio for crisp low-res pixelation
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // Pixelation Setup (Dragonfly style - refined fine grain)
    const pixelSize = 3; // Refined fine-grain pixel size (3px blocks)
    let lowResWidth = Math.max(1, Math.floor(width / pixelSize));
    let lowResHeight = Math.max(1, Math.floor(height / pixelSize));

    const renderTarget = new THREE.WebGLRenderTarget(lowResWidth, lowResHeight, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
    });

    // Fullscreen Orthographic Quad Scene for Post-Pass
    const postScene = new THREE.Scene();
    const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const postMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: renderTarget.texture },
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float uTime;
        varying vec2 vUv;

        void main() {
          vec4 color = texture2D(tDiffuse, vUv);
          gl_FragColor = color;
        }
      `,
    });

    const postQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), postMaterial);
    postScene.add(postQuad);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xff4f00, 4.0); // Orange rim light
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 3.0); // White main light
    dirLight2.position.set(-5, -5, -5);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xff4f00, 5.0, 20);
    pointLight.position.set(0, 0, 4);
    scene.add(pointLight);

    // Model Container Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    let baseModelScale = 1.0;

    // Load Model
    const loader = new GLTFLoader();

    loader.load(
      '/models/HEFESTO_FABRICA.glb',
      (gltf) => {
        const modelMesh = gltf.scene;

        // Center Bounding Box
        const box = new THREE.Box3().setFromObject(modelMesh);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        modelMesh.position.sub(center); // center around 0,0,0

        const maxDim = Math.max(size.x, size.y, size.z);
        baseModelScale = 4.5 / maxDim;
        modelGroup.scale.set(baseModelScale, baseModelScale, baseModelScale);

        modelMesh.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.roughness = 0.25;
              mat.metalness = 0.85;
            }
          }
        });

        modelGroup.add(modelMesh);
        setLoaded(true);
      },
      undefined,
      (err) => {
        console.error('Error loading HEFESTO_FABRICA.glb:', err);
        setError('Could not load 3D model');
      }
    );

    // Mouse & Scroll State
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let scrollProgress = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        scrollProgress = window.scrollY / maxScroll;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    // Resize Handler
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);

      const newLowWidth = Math.max(1, Math.floor(newWidth / pixelSize));
      const newLowHeight = Math.max(1, Math.floor(newHeight / pixelSize));
      renderTarget.setSize(newLowWidth, newLowHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);

      postMaterial.uniforms.uTime.value = time * 0.001;

      // Smooth Mouse Interaction
      targetX += (mouseX * 0.5 - targetX) * 0.05;
      targetY += (mouseY * 0.5 - targetY) * 0.05;

      if (modelGroup) {
        // Section 2 Zoom Factor (peaks around scrollProgress 0.15 to 0.35)
        const sec2Progress = Math.min(Math.max((scrollProgress - 0.08) / 0.30, 0.0), 1.0);
        const sec2ZoomFactor = Math.sin(sec2Progress * Math.PI); // 0 -> 1 -> 0

        // Scale: Base scale (1.0) with dramatic Macro Zoom (up to 2.25x) during Section 2
        const currentScale = 1.0 + sec2ZoomFactor * 1.25;
        modelGroup.scale.set(
          baseModelScale * currentScale,
          baseModelScale * currentScale,
          baseModelScale * currentScale
        );

        // Initial Y orientation offset so statue faces forward towards camera at initial scroll
        const initialY = 0.0;

        // Rotation: Strictly driven by scrollProgress + subtle mouse parallax (NO time auto-rotation)
        modelGroup.rotation.y = initialY + scrollProgress * Math.PI * 2.8 + targetX * 0.4;
        modelGroup.rotation.x = sec2ZoomFactor * 0.55 + scrollProgress * Math.PI * 0.5 + targetY * 0.4;
        modelGroup.rotation.z = -sec2ZoomFactor * 0.15;

        // Position: Macro Zoom brings 3D model right up to camera + shifts slightly to frame text
        modelGroup.position.x = -sec2ZoomFactor * 1.2;
        modelGroup.position.y = -sec2ZoomFactor * 0.3 - scrollProgress * 0.4;
        modelGroup.position.z = sec2ZoomFactor * 3.8 + Math.sin(scrollProgress * Math.PI) * 1.2;
      }

      // 1. Render 3D Scene into Low-Res RenderTarget with Nearest Filtering
      renderer.setRenderTarget(renderTarget);
      renderer.clear();
      renderer.render(scene, camera);

      // 2. Render Fullscreen Pixelated Quad to Canvas
      renderer.setRenderTarget(null);
      renderer.render(postScene, postCamera);
    };

    animate(0);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      renderTarget.dispose();
      postMaterial.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#050505]">
      {/* 3D Canvas - Clean smooth rendering */}
      <div ref={containerRef} className="w-full h-full opacity-80" />
    </div>
  );
}


