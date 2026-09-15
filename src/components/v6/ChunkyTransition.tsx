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
  const progressRef = useRef(-0.2);
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

    // Elementos da seção que devem fazer fade-out durante o pin
    const contentElements = Array.from(section.children).filter(
      (child) => child !== trigger && child !== container
    );

    let ctx = gsap.context(() => {
      const scrollDistance = window.innerHeight * 0.9;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "bottom bottom",
          end: () => "+=" + scrollDistance,
          pin: true,
          pinSpacing: true,
          scrub: 0.6,
          anticipatePin: 1,
          onEnter: () => {
            if (container) container.style.opacity = "1";
          },
          onLeave: () => {
            if (container) container.style.opacity = "0";
          },
          onEnterBack: () => {
            if (container) container.style.opacity = "1";
          },
          onLeaveBack: () => {
            if (container) container.style.opacity = "0";
          },
        },
      });

      // 1. O conteúdo da seção atual desvanece
      tl.to(
        contentElements,
        {
          opacity: 0,
          y: -40,
          duration: 0.45,
          ease: "power2.inOut",
        },
        0
      );

      // 2. Os blocos de pixels crescem até cobrir 100% da tela com nextColor
      tl.fromTo(
        progressRef,
        { current: -0.2 },
        {
          current: 1.4,
          duration: 0.85,
          ease: "none",
        },
        0.05
      );
    });

    return () => {
      ctx.revert();
      if (contentElements.length) {
        gsap.set(contentElements, { clearProps: "opacity,transform" });
      }
    };
  }, [mounted, nextColor]);

  return (
    <>
      <div ref={triggerRef} className="absolute bottom-0 w-full h-1 pointer-events-none" />
      {mounted &&
        createPortal(
          <div
            ref={containerRef}
            className="fixed inset-0 z-40 pointer-events-none opacity-0 transition-opacity duration-200"
          >
            <Canvas
              camera={{ position: [0, 0, 1] }}
              gl={{ alpha: true, antialias: false }}
              resize={{ scroll: false }}
            >
              <Scene color={nextColor} progressRef={progressRef} />
            </Canvas>
          </div>,
          document.body
        )}
    </>
  );
}
