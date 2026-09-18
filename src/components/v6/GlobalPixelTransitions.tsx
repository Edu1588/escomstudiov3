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

function Scene({
  colorRef,
  progressRef,
}: {
  colorRef: React.MutableRefObject<THREE.Color>;
  progressRef: React.MutableRefObject<number>;
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uColor.value.copy(colorRef.current);
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
          uColor: { value: colorRef.current },
          uProgress: { value: 0 },
          uTime: { value: 0 },
          uResolution: { value: new THREE.Vector2(size.width, size.height) },
        }}
      />
    </mesh>
  );
}

export function GlobalPixelTransitions() {
  const containerRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef<THREE.Color>(new THREE.Color("#000000"));
  const progressRef = useRef(0.0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    if (!container) return;

    let ctx = gsap.context(() => {
      // Configuração das transições de seção em toda a extensão da página
      const transitions = [
        { trigger: "#solucoes", color: "#000000" },
        { trigger: "#metodo", color: "#ECECE3" },
        { trigger: "#sobre", color: "#000000" },
        { trigger: "#insights", color: "#ECECE3" },
        { trigger: "#diagnostico", color: "#000000" },
      ];

      transitions.forEach(({ trigger, color }) => {
        const el = document.querySelector(trigger);
        if (!el) return;

        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          end: "top 25%",
          scrub: 0.5,
          onEnter: () => {
            colorRef.current.set(color);
            container.style.opacity = "1";
          },
          onEnterBack: () => {
            colorRef.current.set(color);
            container.style.opacity = "1";
          },
          onLeave: () => {
            container.style.opacity = "0";
            progressRef.current = 0.0;
          },
          onLeaveBack: () => {
            container.style.opacity = "0";
            progressRef.current = 0.0;
          },
          onUpdate: (self) => {
            // De 0.0 a 0.5: micro-pixels stardust crescem e cobrem a viewport
            // De 0.5 a 1.0: transição desvanece suavemente revelando a seção seguinte
            if (self.progress <= 0.5) {
              progressRef.current = self.progress * 2.0 * 1.35;
              container.style.opacity = "1";
            } else {
              progressRef.current = 1.35;
              const fade = 1.0 - (self.progress - 0.5) * 2.0;
              container.style.opacity = String(Math.max(0, fade));
            }
          },
        });
      });

      // Efeito de revelação de foco óptico (blur -> nítido) nos títulos de seção
      gsap.utils.toArray<HTMLElement>(".reveal-focus").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0.15, filter: "blur(14px)", y: 22 },
          {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    });

    return () => {
      ctx.revert();
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-30 pointer-events-none opacity-0 transition-opacity duration-150"
    >
      <Canvas
        camera={{ position: [0, 0, 1] }}
        gl={{ alpha: true, antialias: false }}
        resize={{ scroll: false }}
      >
        <Scene colorRef={colorRef} progressRef={progressRef} />
      </Canvas>
    </div>
  );
}
