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
  
  float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }
  
  void main() {
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
    float threshold = shapeDist * 0.72 + n * 0.28;
    float band = 0.20;
    
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

export function ChunkyTransition({ nextColor = "#000000" }: { nextColor?: string }) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(-0.15);
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

    const nextSection = section.nextElementSibling as HTMLElement | null;

    // Elementos da seção atual para fade out
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
          pinSpacing: false,
          scrub: 0.7,
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

      // 1. Elementos da seção atual fazem fade out no início (0.0 a 0.35)
      tl.to(
        contentElements,
        {
          opacity: 0,
          y: -25,
          duration: 0.35,
          ease: "power1.inOut",
        },
        0
      );

      // 2. Micro-pixels da nova cor crescem em 1 fluxo direto cobrindo 100% da tela (0.0 a 0.55)
      // Sem segundo fluxo de pixel (não encolhem)!
      tl.fromTo(
        progressRef,
        { current: -0.15 },
        {
          current: 1.35,
          duration: 0.55,
          ease: "none",
        },
        0
      );

      // 3. A próxima seção se posiciona na frente do canvas (z-30) e revela seu conteúdo (0.15 a 0.50)
      // Ela é mantida fixa anulando o scroll até o final da transição, e o conteúdo NÃO fica invisível!
      if (nextSection) {
        gsap.set(nextSection, { position: "relative", zIndex: 30 });

        tl.fromTo(
          nextSection,
          { y: () => -scrollDistance },
          { y: 0, ease: "none", duration: 1.0 },
          0
        );

        // O conteúdo emerge imediatamente junto com a mudança de cor (0.15 a 0.50)
        tl.fromTo(
          nextSection,
          { opacity: 0 },
          { opacity: 1, duration: 0.35, ease: "power2.out" },
          0.15
        );
      }

      // 4. Assim que o fundo da nova cor se consolidou (em 0.55), o canvas esconde suavemente
      // garantindo que a tela nunca fique coberta por um plano sólido vazio
      tl.to(
        container,
        {
          opacity: 0,
          duration: 0.15,
          ease: "power1.out",
        },
        0.55
      );
    });

    return () => {
      ctx.revert();
      if (contentElements.length) {
        gsap.set(contentElements, { clearProps: "opacity,transform" });
      }
      if (nextSection) {
        gsap.set(nextSection, { clearProps: "y,opacity,position,zIndex" });
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
            className="fixed inset-0 z-20 pointer-events-none opacity-0 transition-opacity duration-200"
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
