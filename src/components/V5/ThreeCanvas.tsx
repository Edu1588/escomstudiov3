import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

useGLTF.preload('/models/HEFESTO_FABRICA.glb');
useGLTF.preload('/models/hefestoHD-v1.glb');
useGLTF.preload('/models/hephestinho-v1.glb');
useGLTF.preload('/models/003_anvil.glb');

// Global mouse tracker ref so canvas reacts even when pointer-events-none is on container
const globalMouse = { x: 0, y: 0 };
if (typeof window !== 'undefined') {
  window.addEventListener('pointermove', (e) => {
    globalMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    globalMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });
}

function ModelLoader({ roughness, metalness, modelColor, autoRotate, autoRotateSpeed, scrollProgress, scrollY, isClean, modelPath = '/models/HEFESTO_FABRICA.glb', fixedScale, fixedY }: any) {
  const modelRef = useRef<THREE.Group>(null);
  const headPivotRef = useRef<THREE.Group | null>(null);
  
  // Hook call at top level
  const gltf = useGLTF(modelPath);

  const isArticulated = typeof modelPath === 'string' && (modelPath.toLowerCase().includes('hefestohd') || modelPath.toLowerCase().includes('hephestinho'));

  // Clone scene so multiple canvas instances render separate copies without stealing Object3D
  const clonedScene = useMemo(() => {
    const rawScene = Array.isArray(gltf) ? gltf[0]?.scene : (gltf as any)?.scene;
    if (!rawScene) return null;

    if (isArticulated) {
      // Montagem com separação de Busto Fixo e Cabeça Articulada (padrão RobotBust3D)
      const wrapper = new THREE.Group();
      
      const box = new THREE.Box3().setFromObject(rawScene);
      const center = box.getCenter(new THREE.Vector3());
      
      const chestGroup = new THREE.Group();
      const headPivot = new THREE.Group();
      const headGroup = new THREE.Group();
      
      // Ponto de articulação do pescoço (entre o peitoral e a base do queixo)
      const neckPivotY = 0.55 - center.y;
      const neckPivotZ = 0.00 - center.z;
      
      headPivot.position.set(0, neckPivotY, neckPivotZ);
      headGroup.position.set(0, -neckPivotY, -neckPivotZ);
      headPivot.add(headGroup);
      
      const clone = rawScene.clone(true);
      
      const allParts: THREE.Object3D[] = [];
      clone.traverse((child: any) => {
        if (child.isMesh) {
          if (child.material) {
            const mat = child.material.clone();
            mat.color.set('#ffffff');
            mat.roughness = 0.45;
            mat.metalness = 0.40;
            mat.needsUpdate = true;
            child.material = mat;
            child.castShadow = true;
            child.receiveShadow = true;
          }
          allParts.push(child);
        }
      });
      
      allParts.forEach((node) => {
        node.position.x -= center.x;
        node.position.y -= center.y;
        node.position.z -= center.z;
        
        if (node.name === 'tripo_part_1') {
          // Busto / Peitoral / Ombros / Avental -> Fixo no peito
          chestGroup.add(node);
        } else {
          // tripo_part_0 (cabeça/cabelo), tripo_part_2 (rosto), tripo_part_3..5 (detalhes) -> Cabeça (acompanham o mouse)
          headGroup.add(node);
        }
      });
      
      wrapper.add(chestGroup);
      wrapper.add(headPivot);
      headPivotRef.current = headPivot;
      
      return wrapper;
    }

    const clone = rawScene.clone(true);

    clone.traverse((child: any) => {
      if (child.isMesh && child.material) {
        if (isClean) {
          const mat = child.material.clone();
          // Manter as texturas originais do modelo (map, normalMap, roughnessMap) intactas
          mat.color.set('#ffffff'); // Branco neutro garante que a textura original apareça com fidelidade 100%
          mat.roughness = child.material.roughness !== undefined ? child.material.roughness : 0.45;
          mat.metalness = child.material.metalness !== undefined ? child.material.metalness : 0.40;
          mat.needsUpdate = true;
          child.material = mat;
          child.castShadow = true;
          child.receiveShadow = true;
        } else {
          // Para o modo com shader/efeito do Hero: material monocromático prateado reflexivo para o EffectPass
          child.material = new THREE.MeshStandardMaterial({
            color: modelColor || '#d8d8d8',
            roughness: roughness ?? 0.25,
            metalness: metalness ?? 0.75,
            emissive: new THREE.Color('#151515'),
            emissiveIntensity: 0.1,
            map: null,
            envMapIntensity: 1.0,
          });
        }
      }
    });
    return clone;
  }, [gltf, modelColor, roughness, metalness, isClean, modelPath, isArticulated]);

  useFrame((state, delta) => {
    const px = globalMouse.x || state.pointer.x;
    const py = globalMouse.y || state.pointer.y;
    const time = state.clock.getElapsedTime();
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    if (isArticulated && headPivotRef.current) {
      if (isMobile) {
        // No Mobile: Movimentação autônoma contínua, orgânica e sutil (olhar vivo e respiração suave)
        const autoHeadY = Math.sin(time * 0.75) * 0.16 + Math.cos(time * 0.35) * 0.06; // Olhar sutil esquerda/direita (~12°)
        const autoHeadX = Math.sin(time * 0.55 + 0.8) * 0.06; // Leve inclinação para cima/baixo (~4°)
        const autoHeadZ = Math.cos(time * 0.65) * 0.03; // Inclinação lateral natural (~2°)
        
        headPivotRef.current.rotation.y = THREE.MathUtils.lerp(headPivotRef.current.rotation.y, autoHeadY, 0.04);
        headPivotRef.current.rotation.x = THREE.MathUtils.lerp(headPivotRef.current.rotation.x, autoHeadX, 0.04);
        headPivotRef.current.rotation.z = THREE.MathUtils.lerp(headPivotRef.current.rotation.z, autoHeadZ, 0.04);
      } else {
        // No Desktop: Cabeça acompanha o cursor do mouse com suavidade e elegância
        const targetHeadRotY = (px * Math.PI) / 8.0; // Rotação horizontal sutil (~22° max)
        const targetHeadRotX = -(py * Math.PI) / 10.0; // Rotação vertical sutil (~18° max)
        const targetHeadRotZ = -(px * Math.PI) / 22.0; // Inclinação lateral leve (~8° max)
        
        headPivotRef.current.rotation.y = THREE.MathUtils.lerp(headPivotRef.current.rotation.y, targetHeadRotY, 0.05);
        headPivotRef.current.rotation.x = THREE.MathUtils.lerp(headPivotRef.current.rotation.x, targetHeadRotX, 0.05);
        headPivotRef.current.rotation.z = THREE.MathUtils.lerp(headPivotRef.current.rotation.z, targetHeadRotZ, 0.05);
      }
    }

    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
    const baseHeroScale = isMobile ? 2.65 : 3.05;
    const baseHeroY = isMobile ? -0.55 : -0.70;
    const scroll = scrollY || 0;

    let targetScale = isClean ? 3.6 : baseHeroScale;
    let targetY = isClean ? -1.4 : baseHeroY;
    let targetRotX = 0.25;
    let targetRotY = -0.8;
    
    if (fixedScale !== undefined && fixedY !== undefined) {
      targetScale = fixedScale;
      targetY = fixedY;
      // Busto fixo posicionado um pouco mais virado para a direita
      targetRotX = isArticulated ? 0.04 : 0.06 - (py * Math.PI) / 10.0;
      targetRotY = isArticulated ? -0.15 : -0.20 + (px * Math.PI) / 8.0;
    } else if (!isClean) {
      if (scroll <= vh) {
        // Section 1: Zoom into the top of the head
        let p = scroll / vh;
        targetScale = baseHeroScale + p * 3.6; // zoom in progressivo
        targetY = baseHeroY - p * 1.3; 
        targetRotX = 0.1 + p * 0.35; // Tilt forward to see top of head, but not too much
        targetRotY = -0.8 - p * 0.3;
      } else if (scroll <= vh * 2.5) {
        // Section 2: Tilt to show chin
        let p = (scroll - vh) / (vh * 1.5);
        p = Math.min(p, 1.0);
        targetScale = (baseHeroScale * 1.9) + p * 1.5;
        targetY = -2.0 + p * 3.2; // Move up to keep chin in view
        targetRotX = 0.45 - p * 1.0; // Tilt back to show chin
        targetRotY = -1.3 + p * 0.5;
      } else {
        targetScale = baseHeroScale * 2.3;
        targetY = 1.0;
        targetRotX = -1.5;
        targetRotY = -0.8;
      }
    } else {
      targetScale = 3.6 + (scrollProgress || 0) * 8.0;
      targetY = -1.4 - (scrollProgress || 0) * 1.5;
    }
    
    if (modelRef.current) {
      modelRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05);
      modelRef.current.position.lerp(new THREE.Vector3(0.0, targetY, 0), 0.05);

      if (autoRotate) {
        modelRef.current.rotation.y += delta * (autoRotateSpeed !== undefined ? autoRotateSpeed : 0.5);
      } else if (fixedScale !== undefined) {
        if (isArticulated) {
          // Busto permanece fixo na posição virada
          modelRef.current.rotation.x = THREE.MathUtils.lerp(modelRef.current.rotation.x, targetRotX, 0.05);
          modelRef.current.rotation.y = THREE.MathUtils.lerp(modelRef.current.rotation.y, targetRotY, 0.05);
        } else {
          // Interpolação amortecida suave para movimento sutil e orgânico ao mouse
          modelRef.current.rotation.x = THREE.MathUtils.lerp(modelRef.current.rotation.x, targetRotX, 0.04);
          modelRef.current.rotation.y = THREE.MathUtils.lerp(modelRef.current.rotation.y, targetRotY, 0.04);
        }
      } else {
        if (isClean) {
          // Repulsive mouse effect
          modelRef.current.rotation.y = THREE.MathUtils.lerp(modelRef.current.rotation.y, -0.6 - (px * Math.PI) / 4, 0.05);
          modelRef.current.rotation.x = THREE.MathUtils.lerp(modelRef.current.rotation.x, (py * Math.PI) / 6, 0.05);
        } else {
          // Attractive mouse effect + Scroll tilt
          modelRef.current.rotation.y = THREE.MathUtils.lerp(modelRef.current.rotation.y, targetRotY + (px * Math.PI) / 4, 0.05);
          modelRef.current.rotation.x = THREE.MathUtils.lerp(modelRef.current.rotation.x, targetRotX - (py * Math.PI) / 6, 0.05);
        }
      }
    }
  });

  if (clonedScene) {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const initialY = fixedY !== undefined ? fixedY : (isClean ? -1.4 : (isMobile ? -0.55 : -0.70));
    const initialRotY = fixedScale !== undefined ? (isArticulated ? -0.15 : -0.20) : (isClean ? -0.6 : -0.8);
    const initialScale = fixedScale !== undefined ? fixedScale : (isClean ? 3.6 : (isMobile ? 2.65 : 3.05));
    
    return (
      <group ref={modelRef} position={[0, initialY, 0]} rotation={[0, initialRotY, 0]} scale={initialScale}>
        <primitive object={clonedScene} />
      </group>
    );
  }

  return null;
}

function SceneContent(props: any) {
  const isClean = props.renderClean;
  const isFixed = props.fixedScale !== undefined;
  
  return (
    <>
      {isClean ? (
        <>
          {/* Luz Ambiente Geral */}
          <ambientLight intensity={1.6} color="#ffffff" />
          
          {/* Luz Principal Frontal/Topo (Key Light - Realça a textura facial e os olhos) */}
          <directionalLight position={[3, 5, 5]} intensity={3.5} color="#ffffff" />
          
          {/* Luz de Preenchimento Suave (Fill Light - Revela sombras sem estourar) */}
          <directionalLight position={[-3, 2, 4]} intensity={2.0} color="#eef2f7" />
          
          {/* Luz Inferior para Detalhes do Avental e Peito */}
          <directionalLight position={[0, -4, 3]} intensity={1.2} color="#ffffff" />
          
          {/* Luz Quente da Forja (Rim/Edge Light - Realce elegante nas costas e contorno) */}
          <directionalLight position={[-6, 2, -4]} intensity={3.0} color="#ff5511" />
          <pointLight position={[-4, -1, -2]} intensity={8.0} distance={15} color="#ff4400" />
        </>
      ) : isFixed ? (
        <>
          <ambientLight intensity={3.5} />
          <directionalLight position={[5, 5, 5]} intensity={8} color="#ffffff" />
          <directionalLight position={[-5, -5, -5]} intensity={4} color="#ffffff" />
          <pointLight position={[0, 2, 5]} intensity={10} color="#ff4d16" distance={50} />
        </>
      ) : (
        <>
          <ambientLight intensity={3.0} />
          <directionalLight position={[6, 8, 6]} intensity={8} color="#ffffff" />
          <directionalLight position={[-6, -4, -4]} intensity={5} color="#ffffff" />
          <pointLight position={[0, 0, 5]} intensity={8} color="#ffffff" distance={25} />
          <pointLight position={[0, 4, -2]} intensity={6} color="#ffffff" distance={25} />
        </>
      )}
      
      <ModelLoader {...props} isClean={isClean} />
    </>
  );
}

function EffectPass({ pixelFactor, brightness, smearIntensity, scrollProgress = 0, scrollY = 0, isEmbedded = false }: any) {
  const { gl, scene, camera, size } = useThree();
  
  const target = useMemo(() => {
    return new THREE.WebGLRenderTarget(
      Math.floor(size.width / pixelFactor),
      Math.floor(size.height / pixelFactor),
      {
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
      }
    );
  }, [pixelFactor, size]);

  useEffect(() => {
    target.setSize(Math.floor(size.width / pixelFactor), Math.floor(size.height / pixelFactor));
  }, [size, pixelFactor, target]);

  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const quadScene = useMemo(() => new THREE.Scene(), []);
  const quadCamera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), []);

  useFrame((state) => {
    // Render main scene to offscreen target
    gl.setRenderTarget(target);
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    // Update uniforms
    if (materialRef.current) {
      materialRef.current.uniforms.tDiffuse.value = target.texture;
      materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
      materialRef.current.uniforms.uPixelFactor.value = pixelFactor;
      materialRef.current.uniforms.uBrightness.value = brightness;
      materialRef.current.uniforms.uSmear.value = smearIntensity;
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      
      // Map pointer from [-1, 1] to [0, 1]
      materialRef.current.uniforms.uMouse.value.set(
        (state.pointer.x + 1.0) / 2.0,
        (state.pointer.y + 1.0) / 2.0
      );
      
      // Calculate scroll fade opacity for statue dots
      const fadeStart = typeof window !== 'undefined' ? window.innerHeight * 0.2 : 500;
      const fadeEnd = typeof window !== 'undefined' ? window.innerHeight * 1.0 : 1000;
      let fadeProgress = 0;
      if (scrollY > fadeStart) {
        fadeProgress = Math.min(1.0, (scrollY - fadeStart) / (fadeEnd - fadeStart));
      }
      const opacityVal = isEmbedded ? 1.0 : Math.max(0.1, 1.0 - fadeProgress);
      materialRef.current.uniforms.uOpacity.value = opacityVal;
    }

    // Render quad to screen
    gl.render(quadScene, quadCamera);
  }, 1);

  const uniforms = useMemo(() => ({
    tDiffuse: { value: null },
    uResolution: { value: new THREE.Vector2() },
    uPixelFactor: { value: 6.0 },
    uBrightness: { value: 1.0 },
    uSmear: { value: 0.3 },
    uTime: { value: 0.0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uOpacity: { value: 1.0 }
  }), []);

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform sampler2D tDiffuse;
    uniform vec2 uResolution;
    uniform float uPixelFactor;
    uniform float uBrightness;
    uniform float uSmear;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uOpacity;
    
    varying vec2 vUv;

    float rand(vec2 co){
      return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }

    void main() {
      vec2 uv = vUv;
      
      // Calculate dot grid
      vec2 d = uPixelFactor / uResolution;
      
      vec2 basePixelUv = floor(uv / d) * d + (d * 0.5);
      vec2 pixelUv = basePixelUv;
      vec2 fractUv = fract(uv / d);
      
      // Add slow continuous horizontal drift instead of blinking noise
      float drift = sin(pixelUv.y * 10.0 + uTime * 0.5) * 0.5 + sin(pixelUv.y * 25.0 - uTime * 0.2) * 0.5;
      pixelUv.x += drift * uSmear * 0.015;
      
      vec4 texColor = texture2D(tDiffuse, pixelUv);
      
      // Calculate luma based on the rendered scene (which includes the dark background)
      float luma = dot(texColor.rgb, vec3(0.299, 0.587, 0.114)) * uBrightness;
      
      vec2 cuv = fractUv - 0.5;
      float r = length(cuv);
      
      // ASCII-like shapes based on luminance. Ignore dark background.
      float shape = 0.0;
      if (luma > 0.015) {
        if (luma > 0.5) {
          // Plus
          shape = step(abs(cuv.x), 0.06) * step(abs(cuv.y), 0.25) + step(abs(cuv.y), 0.06) * step(abs(cuv.x), 0.25);
        } else if (luma > 0.3) {
          // Minus
          shape = step(abs(cuv.y), 0.06) * step(abs(cuv.x), 0.25);
        } else if (luma > 0.15) {
          // Small plus
          shape = step(abs(cuv.x), 0.05) * step(abs(cuv.y), 0.15) + step(abs(cuv.y), 0.05) * step(abs(cuv.x), 0.15);
        } else if (luma > 0.06) {
          // Small dot
          shape = step(r, 0.1);
        } else {
          // Tiny dot
          shape = step(r, 0.06);
        }
      }
      
      // Calculate aspect-corrected distance to mouse for circular hover effect
      vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
      
      // Base color for dots: cleaner grays
      vec3 baseCol = vec3(clamp(luma * 1.3, 0.1, 0.75));
      
      // Hover effect: tight cluster of twinkling pixels
      float hoverRadius = 0.08; 
      float dist = distance(basePixelUv * aspect, uMouse * aspect);
      vec2 cell = floor(uv / d);
      
      if (dist < hoverRadius) {
        float spatialNoise = rand(cell * 20.0);
        float temporalNoise = sin(uTime * 8.0 + spatialNoise * 100.0);
        float prob = mix(0.7, 0.98, dist / hoverRadius);
        
        if (spatialNoise > prob && temporalNoise > 0.0) { 
          baseCol = vec3(1.0, 0.35, 0.08); // pure orange
        }
      }
      
      // Render dots with alpha transparency so background seamlessly matches page
      gl_FragColor = vec4(baseCol, shape * uOpacity);
    }
  `;

  return (
    <mesh
      onUpdate={(self) => quadScene.add(self)}
      {...({ onRemove: (self: any) => quadScene.remove(self) } as any)}
    >
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
        transparent={true}
      />
    </mesh>
  );
}

export default function ThreeCanvas(props: any) {
  if (props.isEmbedded) {
    return (
      <div className={`w-full h-full relative overflow-hidden pointer-events-auto ${props.className || ''}`}>
        <Canvas
          camera={{ position: [0, 0, props.cameraZ || 6.5], fov: props.cameraFOV || 45 }}
          gl={{ 
            antialias: true, 
            alpha: true,
            powerPreference: 'high-performance'
          }}
        >
          {props.renderClean && !props.transparentBg && <color attach="background" args={[props.bgColor || '#050505']} />}
          
          <React.Suspense fallback={null}>
            <SceneContent {...props} />
          </React.Suspense>
          
          {!props.renderClean && <EffectPass {...props} />}
        </Canvas>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}>
      <Canvas
        camera={{ position: [0, 0, props.cameraZ || 7], fov: props.cameraFOV || 45 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        <color attach="background" args={[props.bgColor || '#050505']} />
        
        <React.Suspense fallback={null}>
          <SceneContent {...props} />
        </React.Suspense>
        
        {!props.renderClean && <EffectPass {...props} />}
      </Canvas>
    </div>
  );
}
