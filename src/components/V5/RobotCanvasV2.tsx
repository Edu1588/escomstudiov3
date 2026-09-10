import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

interface RobotCanvasV2Props {
  className?: string;
  style?: React.CSSProperties;
  isEmbedded?: boolean;
}

export default function RobotCanvasV2({ className = '', style, isEmbedded = false }: RobotCanvasV2Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = isEmbedded && canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
    const height = isEmbedded && canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.1, 4.2);

    // Iluminação PBR de Alta Definição (Prata com acento Neon Ciano)
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x09090b, 2.4);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.4);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x00d1ff, 2.4);
    fillLight.position.set(-4, 2, 3);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x00d1ff, 4.8, 16);
    rimLight.position.set(3, -2, 3);
    scene.add(rimLight);

    const goldLight = new THREE.PointLight(0xc5a86a, 2.4, 12);
    goldLight.position.set(-3, 3, -2);
    scene.add(goldLight);

    // Luzes de Neon Ciano nos Olhos do Robô
    const eyeLightL = new THREE.PointLight(0x00f0ff, 2.6, 2.0);
    eyeLightL.position.set(-0.13, 0.41, 0.38);

    const eyeLightR = new THREE.PointLight(0x00f0ff, 2.6, 2.0);
    eyeLightR.position.set(0.13, 0.41, 0.38);

    // Grupo do Robô
    const robotWrapper = new THREE.Group();
    scene.add(robotWrapper);

    let headPivotRef: THREE.Group | null = null;

    // Partículas de Energia no Espaço (Neon Ciano e Ouro)
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x00d1ff);
    const color2 = new THREE.Color(0x00f0ff);
    const color3 = new THREE.Color(0xc5a86a);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      const rand = Math.random();
      const chosenColor = rand < 0.5 ? color1 : (rand < 0.8 ? color2 : color3);
      particleColors[i * 3] = chosenColor.r;
      particleColors[i * 3 + 1] = chosenColor.g;
      particleColors[i * 3 + 2] = chosenColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.032,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Carregamento com GLTFLoader + DracoLoader
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      '/models/3Dmodelrobot-v1.glb',
      (gltf) => {
        const rawModel = gltf.scene;

        const box = new THREE.Box3().setFromObject(rawModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.4 / (maxDim || 1);
        robotWrapper.scale.set(scale, scale, scale);
        robotWrapper.position.set(0, -0.2, 0);

        rawModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.roughness = 0.36;
              mat.metalness = 0.72;
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
          if (child.name.startsWith('tripo_part_')) {
            allNodes.push(child);
          }
        });

        allNodes.forEach((node) => {
          node.position.x -= center.x;
          node.position.y -= center.y;
          node.position.z -= center.z;

          if (node.name === 'tripo_part_0') {
            chestGroup.add(node);
          } else {
            headGroup.add(node);
          }
        });

        headPivot.add(eyeLightL);
        headPivot.add(eyeLightR);

        robotWrapper.add(chestGroup);
        robotWrapper.add(headPivot);

        headPivotRef = headPivot;
      },
      undefined,
      (err) => {
        console.error('[RobotCanvasV2] Erro ao carregar modelo GLB do robô:', err);
      }
    );

    // Mouse Tracking & Scroll Animation Loop
    let animationFrameId: number;
    let mouseX = 0;
    let mouseY = 0;
    let targetHeadRotX = 0;
    let targetHeadRotY = 0;
    let currentHeadRotX = 0;
    let currentHeadRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const scrollY = window.scrollY || window.pageYOffset;
      const totalScroll = document.body.scrollHeight - window.innerHeight || 1;
      const scrollProgress = scrollY / totalScroll;

      // Animação da cabeça com mouse
      targetHeadRotY = mouseX * 0.55;
      targetHeadRotX = mouseY * 0.35;

      currentHeadRotY += (targetHeadRotY - currentHeadRotY) * 0.06;
      currentHeadRotX += (targetHeadRotX - currentHeadRotX) * 0.06;

      if (headPivotRef) {
        headPivotRef.rotation.y = currentHeadRotY;
        headPivotRef.rotation.x = currentHeadRotX;
      }

      // Rotação suave do robô conforme scroll
      robotWrapper.rotation.y = Math.sin(scrollProgress * Math.PI * 4) * 0.45 + mouseX * 0.15;
      robotWrapper.rotation.x = Math.cos(scrollProgress * Math.PI * 2) * 0.12 + mouseY * 0.08;
      robotWrapper.position.y = -0.2 - Math.sin(scrollProgress * Math.PI * 2) * 0.3;

      // Pulsação dos olhos neon
      const time = Date.now() * 0.003;
      const pulseIntensity = 1.8 + Math.sin(time) * 0.5;
      eyeLightL.intensity = pulseIntensity;
      eyeLightR.intensity = pulseIntensity;

      // Movimento sutil das partículas
      particles.rotation.y += 0.0008;
      particles.rotation.x = Math.sin(time * 0.2) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const w = isEmbedded && canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
      const h = isEmbedded && canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, [isEmbedded]);

  if (isEmbedded) {
    return (
      <canvas
        ref={canvasRef}
        className={`w-full h-full block ${className}`}
        style={style}
        aria-label="ESCOM Studio Official 3D Robot Core"
      />
    );
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        className={`fixed inset-0 w-full h-full z-0 pointer-events-none ${className}`}
        style={style}
        aria-label="ESCOM Studio Official 3D Robot Core"
      />
      {/* Vinheta atmosférica suave que destaca o robô e suaviza as bordas */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 45%, transparent 25%, rgba(5,5,5,0.4) 70%, rgba(5,5,5,0.85) 100%)'
        }}
      />
    </>
  );
}
