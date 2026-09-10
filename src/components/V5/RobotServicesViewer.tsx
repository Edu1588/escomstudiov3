import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

interface RobotServicesViewerProps {
  className?: string;
  height?: number | string;
}

export default function RobotServicesViewer({ className = '', height = 620 }: RobotServicesViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let width = container.clientWidth || 400;
    let height = container.clientHeight || 620;

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
    renderer.toneMappingExposure = 1.35;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.05, 3.8);

    // Iluminação cinematográfica monocromática com acento em Ciano
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x050505, 2.2);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.8);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x00d1ff, 2.8);
    fillLight.position.set(-4, 2, 3);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x00d1ff, 5.0, 16);
    rimLight.position.set(2.5, -1.5, 3);
    scene.add(rimLight);

    const backLight = new THREE.PointLight(0xffffff, 2.0, 12);
    backLight.position.set(-2.5, 3, -2);
    scene.add(backLight);

    // Luzes neon ciano pulsantes nos olhos do robô
    const eyeLightL = new THREE.PointLight(0x00f0ff, 3.0, 2.5);
    eyeLightL.position.set(-0.13, 0.41, 0.38);

    const eyeLightR = new THREE.PointLight(0x00f0ff, 3.0, 2.5);
    eyeLightR.position.set(0.13, 0.41, 0.38);

    const robotGroup = new THREE.Group();
    scene.add(robotGroup);

    let headPivotRef: THREE.Group | null = null;

    // Carregamento do modelo oficial do robô
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
        const scale = 2.5 / (maxDim || 1);
        robotGroup.scale.set(scale, scale, scale);
        robotGroup.position.set(0, -0.22, 0);

        rawModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              // Visual metálico chumbo / dark brutalista de alta fidelidade
              mat.roughness = 0.32;
              mat.metalness = 0.78;
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

        robotGroup.add(chestGroup);
        robotGroup.add(headPivot);

        headPivotRef = headPivot;
      },
      undefined,
      (err) => {
        console.error('[RobotServicesViewer] Erro ao carregar robô 3D:', err);
      }
    );

    // Tracking de mouse responsivo global ou na seção
    let mouseX = 0;
    let mouseY = 0;
    let targetHeadRotX = 0;
    let targetHeadRotY = 0;
    let currentHeadRotX = 0;
    let currentHeadRotY = 0;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalizado relativo à janela para que olhar acompanhe o cursor mesmo sobre os cards laterais
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Movimento dinâmico da cabeça: ampla rotação para olhar cards da esquerda ou da direita
      targetHeadRotY = mouseX * 0.75;
      targetHeadRotX = mouseY * 0.45;

      currentHeadRotY += (targetHeadRotY - currentHeadRotY) * 0.07;
      currentHeadRotX += (targetHeadRotX - currentHeadRotX) * 0.07;

      if (headPivotRef) {
        headPivotRef.rotation.y = currentHeadRotY;
        headPivotRef.rotation.x = currentHeadRotX;
        headPivotRef.rotation.z = -currentHeadRotY * 0.15; // Inclinação orgânica natural
      }

      // Respiração suave do corpo do robô
      const time = performance.now() * 0.002;
      robotGroup.position.y = -0.22 + Math.sin(time) * 0.03;
      robotGroup.rotation.y = mouseX * 0.12;

      // Pulso neon nos olhos
      const pulse = 2.4 + Math.sin(time * 2.5) * 0.8;
      eyeLightL.intensity = pulse;
      eyeLightR.intensity = pulse;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 400;
      const h = container.clientHeight || 620;
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
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full flex items-center justify-center overflow-hidden select-none pointer-events-auto ${className}`}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    >
      {/* Glow e Radar Holográfico de Fundo */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(0, 209, 255, 0.08) 0%, rgba(0, 0, 0, 0) 70%)'
        }}
      >
        <div className="w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] rounded-full border border-white/5 border-dashed animate-[spin_60s_linear_infinite]" />
        <div className="absolute w-[240px] h-[240px] sm:w-[300px] sm:h-[300px] rounded-full border border-[#00d1ff]/10" />
      </div>

      <canvas 
        ref={canvasRef} 
        className="relative z-10 w-full h-full block cursor-grab active:cursor-grabbing"
      />

      {/* Telemetria Inferior do Robô */}
      <div className="absolute bottom-3 z-20 flex items-center gap-3 px-3.5 py-1.5 bg-[#050505]/90 border border-white/10 text-[10px] font-mono tracking-widest text-stone-400">
        <span className="w-2 h-2 rounded-full bg-[#00d1ff] animate-pulse" />
        <span className="text-[#00d1ff]">ROBOT CORE // NEURAL TRACKING ACTIVE</span>
      </div>
    </div>
  );
}
