import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  
  float rand(vec2 n) { 
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }
  
  void main() {
    float pixelsX = 250.0; 
    float pixelsY = pixelsX * (uResolution.y / uResolution.x);
    vec2 grid = vec2(pixelsX, pixelsY);
    
    vec2 pUv = floor(vUv * grid) / grid;
    
    vec2 aspectUv = pUv;
    aspectUv.x *= uResolution.x / uResolution.y;
    vec2 aspectCenter = vec2(0.5 * (uResolution.x / uResolution.y), 0.5);
    
    float dist = distance(aspectUv, aspectCenter) / distance(vec2(0.0), aspectCenter);
    float n = rand(pUv);
    
    float threshold = dist * 0.62 + n * 0.38;
    
    float band = 0.08;
    bool showB = false;
    
    if (uProgress > threshold + band) {
      showB = true;
    } else if (uProgress < threshold - band) {
      showB = false;
    } else {
      float prob = (uProgress - (threshold - band)) / (2.0 * band);
      float flickerNoise = rand(pUv * 100.0 + uTime * 15.0);
      if (flickerNoise < prob) {
        showB = true;
      }
    }
    
    if (!showB) {
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

export function ChunkyTransition({ nextColor = "#000000" }: { nextColor?: string }) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
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
    const nextSection = section.nextElementSibling as HTMLElement;

    let ctx = gsap.context(() => {
      const scrollDist = window.innerHeight * 0.8;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "bottom bottom",
          end: () => "+=" + scrollDist, 
          pin: true,
          pinSpacing: false, 
          scrub: 1,
        }
      });

      tl.set(container, { opacity: 1 }, 0);

      if (nextSection) {
        // Congela a proxima secao perfeitamente no lugar, anulando o scroll
        tl.fromTo(nextSection, 
          { y: () => -scrollDist }, 
          { y: 0, ease: "none", duration: 1 }, 
          0
        );
        // Garante que o conteudo esta invisivel enquanto os pixels cobrem a tela
        tl.set(nextSection, { opacity: 0 }, 0);
      }

      // FASE 1: (0 a 0.5) Pixels crescem ate formar uma cor solida
      tl.fromTo(progressRef, 
        { current: -0.2 }, 
        { current: 1.4, duration: 0.5, ease: "none" }, 
        0
      );

      // FASE 2: (0.5 a 1.0) Sem segunda transicao de pixels (nao encolhem).
      // Apenas revelamos (fade in) a nova secao em cima da cor solida.
      if (nextSection) {
        tl.to(nextSection, { opacity: 1, duration: 0.5, ease: "power2.inOut" }, 0.5);
      }
      
      // No final do scroll, escondemos o canvas, pois a nova secao ja esta la
      tl.set(container, { opacity: 0 }, 1.0);
    });

    return () => {
      ctx.revert();
      if (nextSection) {
        gsap.set(nextSection, { clearProps: "y,opacity" });
      }
    };
  }, [mounted]);

  return (
    <>
      <div ref={triggerRef} className="absolute bottom-0 w-full h-1 pointer-events-none" />
      {mounted && createPortal(
        <div 
           ref={containerRef} 
           className="fixed inset-0 z-[9999] pointer-events-none opacity-0"
        >
          <Canvas camera={{ position: [0, 0, 1] }} gl={{ alpha: true, antialias: false }} resize={{ scroll: false }}>
            <Scene color={nextColor} progressRef={progressRef} />
          </Canvas>
        </div>,
        document.body
      )}
    </>
  );
}
