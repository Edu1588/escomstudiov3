import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform vec3 uColor;
  uniform float uProgress;
  uniform vec2 uResolution;
  uniform float uTime;
  
  float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }
  
  void main() {
    // Se o progresso for <= 0.005, descarta 100% dos fragmentos
    if (uProgress <= 0.005) {
      discard;
    }

    // Micro-pixels densos: grãos ultra finos (~1.5px a 2px)
    float pixelsX = clamp(uResolution.x * 0.48, 700.0, 1000.0); 
    float pixelsY = pixelsX * (uResolution.y / uResolution.x);
    vec2 grid = vec2(pixelsX, pixelsY);
    
    vec2 pUv = floor(vUv * grid) / grid;
    
    vec2 aspectUv = pUv;
    aspectUv.x *= uResolution.x / uResolution.y;
    vec2 aspectCenter = vec2(0.5 * (uResolution.x / uResolution.y), 0.5);
    
    vec2 dBox = abs(aspectUv - aspectCenter);
    float boxDist = max(dBox.x / aspectCenter.x, dBox.y / aspectCenter.y);
    float radialDist = length(dBox) / length(aspectCenter);
    float shapeDist = mix(boxDist, radialDist, 0.35);
    
    float n = hash(pUv * 876.54);
    float threshold = 0.04 + shapeDist * 0.70 + n * 0.26;
    float band = 0.18;
    
    bool show = false;
    if (uProgress >= threshold + band) {
      show = true;
    } else if (uProgress <= threshold - band) {
      show = false;
    } else {
      float prob = (uProgress - (threshold - band)) / (2.0 * band);
      float grain = hash(pUv * 1423.17 + fract(uTime * 15.0));
      if (grain < prob) {
        show = true;
      }
    }
    
    if (!show) {
      discard;
    }
    
    gl_FragColor = vec4(uColor, 1.0);
  }
`;

function Scene({ color, progressRef }: { color: string, progressRef: React.MutableRefObject<number> }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const colorVec = new THREE.Color(color);
  const { size } = useThree();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uProgress.value = progressRef.current;
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
        uniforms={{
          uColor: { value: colorVec },
          uProgress: { value: 0 },
          uTime: { value: 0 },
          uResolution: { value: new THREE.Vector2(size.width, size.height) }
        }}
      />
    </mesh>
  );
}

interface ChunkyTransitionProps {
  color?: string;
  nextColor?: string;
}

export function ChunkyTransition({ color, nextColor = "#000000" }: ChunkyTransitionProps) {
  const effectiveColor = color || nextColor;
  const triggerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0.0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const trigger = triggerRef.current;
    if (!trigger) return;
    const section = trigger.closest("section");
    if (!section) return;

    const container = containerRef.current;
    if (!container) return;

    // Filhos da seção que recebem o foco óptico gradual (blur 18px -> 0px)
    const contentElements = Array.from(section.children).filter(
      (child) =>
        child !== trigger &&
        child !== container &&
        !child.classList.contains("transition-ignore")
    );

    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=85%",
          pin: true,
          pinSpacing: true,
          scrub: 0.6,
          anticipatePin: 1,
          onEnter: () => {
            if (container) container.style.opacity = "1";
          },
          onEnterBack: () => {
            if (container) container.style.opacity = "1";
          },
          onLeave: () => {
            if (container) container.style.opacity = "0";
          },
          onLeaveBack: () => {
            if (container) container.style.opacity = "0";
          },
        },
      });

      // 1. Micro-pixels crescem em 1 fluxo stardust cobrindo a tela (0.0 a 0.48)
      tl.fromTo(
        progressRef,
        { current: 0.0 },
        {
          current: 1.35,
          duration: 0.48,
          ease: "none",
        },
        0
      );

      // 2. Os elementos da seção emergem com foco óptico gradual (blur 18px -> 0px)
      tl.fromTo(
        contentElements,
        {
          opacity: 0,
          filter: "blur(18px)",
          y: 16,
        },
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          duration: 0.42,
          stagger: 0.08,
          ease: "power2.out",
        },
        0.12
      );

      // 3. Quando os micro-pixels consolidam o fundo (a partir de 0.50), o canvas se dissipa suavemente
      tl.to(
        container,
        {
          opacity: 0,
          duration: 0.20,
          ease: "power1.out",
        },
        0.52
      );
    }, section);

    return () => {
      ctx.revert();
    };
  }, [mounted, effectiveColor]);

  return (
    <>
      <div
        ref={triggerRef}
        className="absolute top-0 left-0 w-full h-1 pointer-events-none transition-ignore"
      />
      {mounted && (
        <div
          ref={containerRef}
          className="absolute inset-0 z-20 pointer-events-none opacity-0 transition-opacity duration-200 transition-ignore"
        >
          <Canvas
            camera={{ position: [0, 0, 1] }}
            gl={{ alpha: true, antialias: false }}
            resize={{ scroll: false }}
          >
            <Scene color={effectiveColor} progressRef={progressRef} />
          </Canvas>
        </div>
      )}
    </>
  );
}
