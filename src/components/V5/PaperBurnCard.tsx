import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const createPerlinNoiseTexture = (width = 512, height = 512) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  const noiseMap = new Float32Array(width * height);
  
  const offsetX = Math.random() * 1000;
  const offsetY = Math.random() * 1000;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      let value = 0;
      const px = x + offsetX;
      const py = y + offsetY;
      value += Math.sin(px * 0.012) * Math.cos(py * 0.012) * 0.45;
      value += Math.sin(px * 0.035) * Math.cos(py * 0.035) * 0.3;
      value += Math.sin(px * 0.08) * Math.cos(py * 0.08) * 0.15;
      value += (Math.random() - 0.5) * 0.1;
      noiseMap[idx] = (value + 1) / 2;
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

interface PaperBurnCardProps {
  name: string;
  role: string;
  img: string;
  onClick?: () => void;
  className?: string;
}

export const PaperBurnCard: React.FC<PaperBurnCardProps> = ({
  name,
  role,
  img,
  onClick,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const canvas2DRef = useRef<HTMLCanvasElement | null>(null);
  const overlayTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const hoverProgressRef = useRef(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const renderOverlayToCanvas = (ctx: CanvasRenderingContext2D, w: number, h: number, hovered: boolean) => {
    ctx.clearRect(0, 0, w, h);

    // Dark gradient overlay at the bottom half for text readability
    const grad = ctx.createLinearGradient(0, h, 0, h * 0.4); 
    grad.addColorStop(0, 'rgba(5, 5, 5, 0.95)');
    grad.addColorStop(0.5, 'rgba(5, 5, 5, 0.6)');
    grad.addColorStop(1, 'rgba(5, 5, 5, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Top-Right Corner Icon
    const dotSize = 8;
    const dotGap = 3;
    const startX = w - 36;
    const startY = 24;
    ctx.fillStyle = '#ff4d16';
    ctx.fillRect(startX, startY, dotSize, dotSize);
    ctx.fillRect(startX + dotSize + dotGap, startY, dotSize, dotSize);
    ctx.fillRect(startX, startY + dotSize + dotGap, dotSize, dotSize);
    ctx.fillRect(startX + dotSize + dotGap, startY + dotSize + dotGap, dotSize, dotSize);

    // Bottom Label Container
    const bottomLabelH = 150; 
    const labelY = h - bottomLabelH;
    ctx.fillStyle = hovered ? 'rgba(255, 77, 22, 0.1)' : 'rgba(5, 5, 5, 0.8)';
    ctx.fillRect(0, labelY, w, bottomLabelH);

    // Hairline border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, labelY);
    ctx.lineTo(w, labelY);
    ctx.stroke();

    // Member Name
    ctx.fillStyle = hovered ? '#ff4d16' : '#ffffff';
    ctx.font = 'bold 28px monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(name.toUpperCase(), 32, labelY + 36);

    // Role
    ctx.fillStyle = '#d6d3d1';
    ctx.font = '19px monospace';
    ctx.fillText(role.toUpperCase(), 32, labelY + 76);

    // Outer Card Border
    ctx.strokeStyle = hovered ? '#ff4d16' : 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = hovered ? 4 : 2;
    ctx.strokeRect(0, 0, w, h);
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 460;

    const canvasW = Math.round(width * 2);
    const canvasH = Math.round(height * 2);

    const canvas2D = document.createElement('canvas');
    canvas2D.width = canvasW;
    canvas2D.height = canvasH;
    canvas2DRef.current = canvas2D;
    const ctx2D = canvas2D.getContext('2d');
    if (!ctx2D) return;

    renderOverlayToCanvas(ctx2D, canvasW, canvasH, isHovered);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const domCanvas = renderer.domElement;
    domCanvas.style.position = 'absolute';
    domCanvas.style.top = '0';
    domCanvas.style.left = '0';
    domCanvas.style.width = '100%';
    domCanvas.style.height = '100%';

    const overlayTexture = new THREE.CanvasTexture(canvas2D);
    overlayTexture.magFilter = THREE.LinearFilter;
    overlayTexture.minFilter = THREE.LinearFilter;
    overlayTextureRef.current = overlayTexture;

    const noiseTexture = createPerlinNoiseTexture(512, 512);
    
    // Load Photo Texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');
    let photoTexture = new THREE.Texture();

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform sampler2D uPhotoTexture;
      uniform sampler2D uOverlayTexture;
      uniform sampler2D uNoiseTexture;
      uniform float uThreshold;
      uniform float uBurnSize;
      uniform float uHoverProgress;
      uniform vec2 uPhotoRes;
      uniform vec2 uContainerRes;
      varying vec2 vUv;

      void main() {
        vec4 noise = texture2D(uNoiseTexture, vUv);
        float noiseValue = noise.r * 0.55 + (1.0 - vUv.y) * 0.45;
        float burnEdge = smoothstep(uThreshold - uBurnSize, uThreshold, noiseValue);

        // Object-fit: cover for the photo texture
        vec2 ratio = vec2(
          min((uContainerRes.x / uContainerRes.y) / (uPhotoRes.x / uPhotoRes.y), 1.0),
          min((uContainerRes.y / uContainerRes.x) / (uPhotoRes.y / uPhotoRes.x), 1.0)
        );
        vec2 uvCover = vec2(
          vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
          vUv.y * ratio.y + (1.0 - ratio.y) * 1.0 // object-position: top (1.0 in WebGL)
        );
        
        vec4 photoColor = texture2D(uPhotoTexture, uvCover);
        vec4 overlayColor = texture2D(uOverlayTexture, vUv);
        
        // User requested original colors without filters
        vec3 finalPhoto = photoColor.rgb;

        // Composite photo and overlay
        // Three.js CanvasTexture has premultiplied alpha by default
        vec3 finalBaseColor = finalPhoto * (1.0 - overlayColor.a) + overlayColor.rgb;

        // Glowing fire/ember edges
        float edgeGlow = smoothstep(uThreshold, uThreshold - uBurnSize * 0.4, noiseValue);
        float secondaryGlow = smoothstep(uThreshold - uBurnSize * 0.2, uThreshold - uBurnSize * 0.8, noiseValue) * 0.5;

        vec3 burnColor = mix(finalBaseColor, vec3(1.0, 0.45, 0.1), edgeGlow * 0.85);
        burnColor += vec3(1.0, 0.6, 0.15) * edgeGlow * 2.2;
        burnColor += vec3(0.95, 0.2, 0.05) * secondaryGlow * 1.6;

        if (noiseValue < uThreshold - uBurnSize) {
          discard;
        }

        gl_FragColor = vec4(burnColor, burnEdge);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uPhotoTexture: { value: photoTexture },
        uOverlayTexture: { value: overlayTexture },
        uNoiseTexture: { value: noiseTexture },
        uThreshold: { value: 0.0 },
        uBurnSize: { value: 0.16 },
        uHoverProgress: { value: 0.0 },
        uPhotoRes: { value: new THREE.Vector2(1, 1) },
        uContainerRes: { value: new THREE.Vector2(width, height) }
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

    textureLoader.load(img, (loadedTexture) => {
      loadedTexture.minFilter = THREE.LinearFilter;
      material.uniforms.uPhotoTexture.value = loadedTexture;
      material.uniforms.uPhotoRes.value.set(loadedTexture.image.width, loadedTexture.image.height);
      setIsLoaded(true);
    });

    let animationFrameId: number;
    const renderLoop = () => {
      if (!containerRef.current) return;
      const targetHover = isHovered ? 1 : 0;
      hoverProgressRef.current += (targetHover - hoverProgressRef.current) * 0.12;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const startPoint = windowHeight * 0.3; 
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

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    const handleResize = () => {
      if (!containerRef.current || !renderer) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      renderer.setSize(w, h);
      if (materialRef.current) {
        materialRef.current.uniforms.uContainerRes.value.set(w, h);
      }
      if (canvas2DRef.current && ctx2D) {
        const cW = Math.round(w * 2);
        const cH = Math.round(h * 2);
        canvas2DRef.current.width = cW;
        canvas2DRef.current.height = cH;
        renderOverlayToCanvas(ctx2D, cW, cH, isHovered);
        if (overlayTextureRef.current) overlayTextureRef.current.needsUpdate = true;
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (domCanvas && domCanvas.parentNode === container) {
        container.removeChild(domCanvas);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [img]);

  useEffect(() => {
    if (canvas2DRef.current) {
      const ctx2D = canvas2DRef.current.getContext('2d');
      if (ctx2D) {
        renderOverlayToCanvas(
          ctx2D,
          canvas2DRef.current.width,
          canvas2DRef.current.height,
          isHovered
        );
        if (overlayTextureRef.current) overlayTextureRef.current.needsUpdate = true;
      }
    }
  }, [isHovered, name, role]);

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative cursor-pointer transition-all overflow-hidden h-[460px] flex flex-col justify-between select-none ${className}`}
    >
      <div className={`absolute inset-0 flex flex-col justify-between bg-[#050505] border border-white/10 group-hover:border-[#ff4d16] transition-opacity duration-300 ${isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="relative flex-1 overflow-hidden">
          <img
            src={img}
            alt={name}
            className="w-full h-full object-cover object-top transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-50" />
        </div>
        <div className="p-3 absolute top-0 right-0 z-10">
          <div className="grid grid-cols-2 gap-0.5 w-2.5 h-2.5">
            <div className="bg-[#ff4d16] w-1 h-1" />
            <div className="bg-[#ff4d16] w-1 h-1" />
            <div className="bg-[#ff4d16] w-1 h-1" />
            <div className="bg-[#ff4d16] w-1 h-1" />
          </div>
        </div>
        <div className="p-5 border-t border-white/10 bg-[#050505]/80 backdrop-blur-sm">
          <h4 className="text-base font-bold text-white tracking-wider font-mono uppercase group-hover:text-[#ff4d16] transition-colors">
            {name}
          </h4>
          <p className="text-xs text-stone-300 font-serif tracking-widest uppercase mt-1">
            {role}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaperBurnCard;
