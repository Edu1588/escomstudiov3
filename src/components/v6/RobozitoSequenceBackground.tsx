import React, { useEffect, useRef, useState } from "react";

const TOTAL_FRAMES = 95;

interface RobozitoSequenceBackgroundProps {
  currentFrame?: number; // 0 to 94
  frameRef?: React.MutableRefObject<number>;
  progressRef?: React.MutableRefObject<number>; // 0.0 to 1.0
  className?: string;
  onLoaded?: () => void;
}

export function RobozitoSequenceBackground({
  currentFrame = 0,
  frameRef,
  progressRef,
  className = "",
  onLoaded,
}: RobozitoSequenceBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedCountRef = useRef<number>(0);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const lastDrawnFrameRef = useRef<number>(-1);

  // Pre-carregamento dos 95 frames
  useEffect(() => {
    let isMounted = true;
    const images: HTMLImageElement[] = [];
    imagesRef.current = images;

    // Carregar primeiro o frame 0 para visualização imediata
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNum = String(i + 1).padStart(3, "0");
      img.src = `/robozitosequence/ezgif-frame-${frameNum}.png`;

      img.onload = () => {
        if (!isMounted) return;
        loadedCountRef.current += 1;

        if (i === 0 || loadedCountRef.current === 1) {
          setInitialLoaded(true);
          renderFrame(0);
        }

        if (loadedCountRef.current === TOTAL_FRAMES && onLoaded) {
          onLoaded();
        }
      };

      images.push(img);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Função para desenhar o frame com aspect-ratio "cover" de alta resolução
  const renderFrame = (targetIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(targetIndex)));
    
    // Tenta obter a imagem alvo; se não carregou ainda, pega a imagem mais próxima carregada
    let img = imagesRef.current[clamped];
    if (!img || !img.complete || img.naturalWidth === 0) {
      let found = false;
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const prev = clamped - offset;
        if (prev >= 0 && imagesRef.current[prev]?.complete && imagesRef.current[prev].naturalWidth > 0) {
          img = imagesRef.current[prev];
          found = true;
          break;
        }
        const next = clamped + offset;
        if (next < TOTAL_FRAMES && imagesRef.current[next]?.complete && imagesRef.current[next].naturalWidth > 0) {
          img = imagesRef.current[next];
          found = true;
          break;
        }
      }
      if (!found) return;
    }

    lastDrawnFrameRef.current = clamped;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth || 1920;
    const ih = img.naturalHeight || 1080;

    const scale = Math.max(cw / iw, ch / ih);
    const nw = iw * scale;
    const nh = ih * scale;
    const nx = (cw - nw) / 2;
    const ny = (ch - nh) / 2;

    ctx.drawImage(img, nx, ny, nw, nh);
  };

  // Animação e verificação contínua via RAF para 60-120fps ultra suave sem re-renders
  useEffect(() => {
    let animId: number;

    const loop = () => {
      let targetFrame = currentFrame;

      if (frameRef) {
        targetFrame = Math.round(frameRef.current);
      } else if (progressRef) {
        targetFrame = Math.round(progressRef.current * (TOTAL_FRAMES - 1));
      }

      const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, targetFrame));
      if (clamped !== lastDrawnFrameRef.current) {
        renderFrame(clamped);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [currentFrame, frameRef, progressRef, initialLoaded]);

  // Redimensionamento do canvas conforme a janela
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      let targetFrame = currentFrame;
      if (frameRef) {
        targetFrame = Math.round(frameRef.current);
      } else if (progressRef) {
        targetFrame = Math.round(progressRef.current * (TOTAL_FRAMES - 1));
      }
      renderFrame(targetFrame);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentFrame, frameRef, progressRef]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Overlay gradiente cinematográfico para contraste editorial e legibilidade perfeita */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/50 pointer-events-none" />
    </div>
  );
}
