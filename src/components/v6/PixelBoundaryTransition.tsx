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
    if (uProgress <= 0.005) {
      discard;
    }

    // Micro-pixels densos: escala fina ultra definida (~1.5px)
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
  color,
  progressRef,
}: {
  color: string;
  progressRef: React.MutableRefObject<number>;
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const colorVec = useRef(new THREE.Color(color));
  const { size } = useThree();

  useEffect(() => {
    colorVec.current.set(color);
  }, [color]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uColor.value.copy(colorVec.current);
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
          uColor: { value: colorVec.current },
          uProgress: { value: 0 },
          uTime: { value: 0 },
          uResolution: { value: new THREE.Vector2(size.width, size.height) },
        }}
      />
    </mesh>
  );
}

export function PixelBoundaryTransition({ toColor }: { toColor: string }) {
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
    const container = containerRef.current;
    if (!trigger || !container) return;

    let ctx = gsap.context(() => {
      // Dispara estritamente quando a linha de fronteira entre as seções cruza a tela
      ScrollTrigger.create({
        trigger: trigger,
        start: "top 85%",
        end: "bottom 15%",
        scrub: 0.4,
        onEnter: () => {
          container.style.opacity = "1";
        },
        onEnterBack: () => {
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
          // De 0.0 a 0.5: micro-pixels stardust crescem da nova cor e cobrem a viewport
          // De 0.5 a 1.0: transição desvanece suavemente revelando a nova seção
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

    return () => {
      ctx.revert();
    };
  }, [mounted, toColor]);

  return (
    <>
      <div
        ref={triggerRef}
        className="pointer-events-none relative h-px w-full"
        style={{ zIndex: 1 }}
      />
      {mounted &&
        createPortal(
          <div
            ref={containerRef}
            className="pointer-events-none fixed inset-0 z-30 opacity-0 transition-opacity duration-150"
          >
            <Canvas
              camera={{ position: [0, 0, 1] }}
              gl={{ alpha: true, antialias: false }}
              resize={{ scroll: false }}
            >
              <Scene color={toColor} progressRef={progressRef} />
            </Canvas>
          </div>,
          document.body
        )}
    </>
  );
}
