import React, { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

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

    // Micro-pixels densos de alta definição (~1.5px a 2px)
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

export function PixelTransitionCanvas({
  color,
  progressRef,
}: {
  color: string;
  progressRef: React.MutableRefObject<number>;
}) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        gl={{ alpha: true, antialias: false }}
        resize={{ scroll: false }}
      >
        <Scene color={color} progressRef={progressRef} />
      </Canvas>
    </div>
  );
}
