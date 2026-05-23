import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const MouseDistortion = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // optimize performance
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const clock = new THREE.Clock();

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform vec2 uMouse;
      uniform vec2 uResolution;
      uniform float uTime;
      uniform vec2 uImageRes;

      void main() {
        vec2 uv = vUv;
        
        // Aspect ratio correction for the mouse distance
        vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
        vec2 mouse = uMouse;
        
        float dist = length((uv - mouse) * aspect);
        
        // Mouse Ripple / Distortion - Made significantly LIGHTER
        float radius = 0.35; // Larger radius, softer spread
        float strength = 0.01; // Very light effect
        
        vec2 distortedUv = uv;
        if (dist < radius) {
            float t = dist / radius;
            float smoothT = smoothstep(1.0, 0.0, t);
            vec2 dir = normalize(uv - mouse);
            // Light, elegant fluid wave
            distortedUv += dir * strength * smoothT * sin(dist * 12.0 - uTime * 4.0);
        }

        // Object-fit: cover logic, bottom-aligned
        vec2 s = uResolution; // Screen resolution
        vec2 i = uImageRes;   // Image resolution
        float rs = s.x / s.y;
        float ri = i.x / i.y;
        vec2 newScale = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x);
        // Align to top of image when cropping vertically (WebGL texture top is 1.0 if not flipped, or 0.0 if flipped).
        // Standard WebGL: 0.0 is bottom. To show top of image at top of screen, we need offset.y = newScale.y - s.y
        vec2 offset = (rs < ri ? vec2((newScale.x - s.x) / 2.0, 0.0) : vec2(0.0, (newScale.y - s.y) * 0.9)) / newScale;
        vec2 finalUv = distortedUv * s / newScale + offset;

        vec4 texColor = texture2D(uTexture, finalUv);
        
        // Add a very subtle light wash at the mouse epicenter
        float lightGlow = smoothstep(radius*0.5, 0.0, dist) * 0.03;
        texColor.rgb += vec3(lightGlow);

        gl_FragColor = texColor;
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexture: { value: null },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uResolution: { value: new THREE.Vector2(width, height) },
        uTime: { value: 0 },
        uImageRes: { value: new THREE.Vector2(1920, 1080) }
      },
      transparent: true
    });

    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');
    textureLoader.load(
      'https://res.cloudinary.com/djw0tqmiw/image/upload/v1779483539/upbk0qco7n4axl66yilf.png',
      (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        material.uniforms.uTexture.value = texture;
        const img = texture.image;
        if (img) {
          material.uniforms.uImageRes.value.set(img.width, img.height);
        }
      }
    );

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const targetMouse = new THREE.Vector2(0.5, 0.5);
    const currentMouse = new THREE.Vector2(0.5, 0.5);

    const onResize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      renderer.setSize(width, height);
      material.uniforms.uResolution.value.set(width, height);
    };
    window.addEventListener('resize', onResize);

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetMouse.x = (e.clientX - rect.left) / width;
      targetMouse.y = 1.0 - (e.clientY - rect.top) / height;
    };
    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      currentMouse.lerp(targetMouse, 0.08); // smooth interpolation
      material.uniforms.uMouse.value.copy(currentMouse);
      
      material.uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };
    renderer.setAnimationLoop(animate);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      renderer.setAnimationLoop(null);
      
      const canvas = renderer.domElement;
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
      
      material.dispose();
      geometry.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 1, pointerEvents: 'none' }}
    />
  );
};
