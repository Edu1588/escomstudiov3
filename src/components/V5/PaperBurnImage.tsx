import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// Create a Perlin-like noise texture for organic paper burn
const createPerlinNoiseTexture = (width = 512, height = 512) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  const noiseMap = new Float32Array(width * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      let value = 0;

      // Multiple frequency octaves for organic burnt paper texture
      value += Math.sin(x * 0.012) * Math.cos(y * 0.012) * 0.45;
      value += Math.sin(x * 0.035) * Math.cos(y * 0.035) * 0.3;
      value += Math.sin(x * 0.08) * Math.cos(y * 0.08) * 0.15;
      value += (Math.random() - 0.5) * 0.1;

      noiseMap[idx] = (value + 1) / 2; // Normalize to 0-1
    }
  }

  for (let i = 0; i < data.length; i += 4) {
    const idx = i / 4;
    const value = Math.floor(noiseMap[idx] * 255);
    data[i] = value;
    data[i + 1] = value;
    data[i + 2] = value;
    data[i + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
  return texture;
};

interface PaperBurnImageProps {
  src: string;
  alt: string;
  className?: string;
  isHovered?: boolean;
}

export const PaperBurnImage: React.FC<PaperBurnImageProps> = ({
  src,
  alt,
  className = '',
  isHovered = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const hoverProgressRef = useRef(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 460;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const canvas = renderer.domElement;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.objectFit = 'cover';
    canvas.style.pointerEvents = 'none';

    // 3. Noise Texture
    const noiseTexture = createPerlinNoiseTexture(512, 512);

    // 4. Load Image Texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');

    textureLoader.load(
      src,
      (imageTexture) => {
        imageTexture.colorSpace = THREE.SRGBColorSpace;
        imageTexture.magFilter = THREE.LinearFilter;
        imageTexture.minFilter = THREE.LinearFilter;

        const vertexShader = `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
          }
        `;

        const fragmentShader = `
          uniform sampler2D uTexture;
          uniform sampler2D uNoiseTexture;
          uniform float uThreshold;
          uniform float uBurnSize;
          uniform float uHoverProgress;
          varying vec2 vUv;

          void main() {
            vec4 noise = texture2D(uNoiseTexture, vUv);
            // Blend noise with a bottom-to-top gradient so paper catches fire upwards
            float noiseValue = noise.r * 0.55 + (1.0 - vUv.y) * 0.45;

            // Burn transition
            float burnEdge = smoothstep(uThreshold - uBurnSize, uThreshold, noiseValue);

            vec4 texColor = texture2D(uTexture, vUv);

            // Grayscale base on idle, full color on hover
            float gray = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
            vec3 grayColor = vec3(gray * 0.75);
            vec3 baseColor = mix(grayColor, texColor.rgb * 0.95, uHoverProgress);

            // Glowing ember edges
            float edgeGlow = smoothstep(uThreshold, uThreshold - uBurnSize * 0.4, noiseValue);
            float secondaryGlow = smoothstep(uThreshold - uBurnSize * 0.2, uThreshold - uBurnSize * 0.8, noiseValue) * 0.5;

            vec3 burnColor = mix(baseColor, vec3(1.0, 0.45, 0.1), edgeGlow * 0.85);
            burnColor += vec3(1.0, 0.6, 0.15) * edgeGlow * 2.2;
            burnColor += vec3(0.95, 0.2, 0.05) * secondaryGlow * 1.6;

            if (noiseValue < uThreshold - uBurnSize) {
              discard;
            }

            gl_FragColor = vec4(burnColor, burnEdge * texColor.a);
          }
        `;

        const material = new THREE.ShaderMaterial({
          uniforms: {
            uTexture: { value: imageTexture },
            uNoiseTexture: { value: noiseTexture },
            uThreshold: { value: 0.0 },
            uBurnSize: { value: 0.16 },
            uHoverProgress: { value: 0.0 },
          },
          vertexShader,
          fragmentShader,
          transparent: true,
          side: THREE.DoubleSide,
        });

        materialRef.current = material;

        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        setIsLoaded(true);
      },
      undefined,
      (err) => {
        console.warn('Error loading texture for PaperBurnImage:', err);
      }
    );

    // 5. Animation and Scroll loop
    let animationFrameId: number;

    const renderLoop = () => {
      if (!containerRef.current) return;

      // Update hover lerp
      const targetHover = isHovered ? 1 : 0;
      hoverProgressRef.current += (targetHover - hoverProgressRef.current) * 0.1;

      // Update scroll burn progress
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Burn trigger calculation:
      // Starts burning when card top reaches upper 40% of screen as user scrolls down to next section
      // Fully burns away as card leaves top edge of screen
      const startPoint = windowHeight * 0.4;
      const endPoint = -rect.height * 0.5;

      let progress = 0;
      if (rect.top < startPoint) {
        progress = (startPoint - rect.top) / (startPoint - endPoint);
        progress = Math.max(0, Math.min(1.0, progress));
      }

      if (materialRef.current) {
        materialRef.current.uniforms.uThreshold.value = progress;
        materialRef.current.uniforms.uHoverProgress.value = hoverProgressRef.current;
      }

      if (rendererRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, camera);
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current && rendererRef.current.domElement) {
        if (rendererRef.current.domElement.parentNode === container) {
          container.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current.dispose();
      }
    };
  }, [src, isHovered]);

  return (
    <div ref={containerRef} className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Static Image Fallback before WebGL canvas initializes */}
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover object-top filter grayscale contrast-125 brightness-75 group-hover:grayscale-0 group-hover:brightness-90 transition-all duration-500 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
};

export default PaperBurnImage;
