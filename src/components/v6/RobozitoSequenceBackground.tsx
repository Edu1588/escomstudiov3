import React, { useEffect, useRef, useState } from "react";

const TOTAL_FRAMES = 96;
// Meta: esperar carregar ao menos metade dos frames (48 imagens) para liberar o site com fluidez
const TARGET_LOAD_FRAMES = Math.ceil(TOTAL_FRAMES / 2);

interface RobozitoSequenceBackgroundProps {
  currentFrame?: number; // 0 to 95
  frameRef?: React.MutableRefObject<number>;
  progressRef?: React.MutableRefObject<number>; // 0.0 to 1.0
  className?: string;
  onProgress?: (progressPercent: number) => void;
  onLoaded?: () => void;
}

export function RobozitoSequenceBackground({
  currentFrame = 0,
  frameRef,
  progressRef,
  className = "",
  onProgress,
  onLoaded,
}: RobozitoSequenceBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedCountRef = useRef<number>(0);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const lastDrawnFrameRef = useRef<number>(-1);

  // Pre-carregamento dos 95 frames com monitoramento da meta (metade das imagens)
  useEffect(() => {
    let isMounted = true;
    const images: HTMLImageElement[] = [];
    imagesRef.current = images;

    const notifyProgress = () => {
      if (!isMounted) return;
      const count = loadedCountRef.current;
      const pct = Math.min(100, Math.round((count / TARGET_LOAD_FRAMES) * 100));
      if (onProgress) {
        onProgress(pct);
      }
      if (count >= TOTAL_FRAMES && onLoaded) {
        onLoaded();
      }
    };

    // Timeout de segurança: após 4.5 segundos, se a rede for lenta, completa para não travar
    const safetyTimer = setTimeout(() => {
      if (isMounted && onProgress) {
        onProgress(100);
      }
    }, 4500);

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNum = String(i + 1).padStart(3, "0");
      img.src = `/robozitosequence/ezgif-frame-${frameNum}.png`;

      const handleSingleLoad = () => {
        if (!isMounted) return;
        loadedCountRef.current += 1;

        if (i === 0 || loadedCountRef.current === 1) {
          setInitialLoaded(true);
          renderFrame(0);
        }

        notifyProgress();
      };

      if (img.complete && img.naturalWidth > 0) {
        handleSingleLoad();
      } else {
        img.onload = handleSingleLoad;
        img.onerror = handleSingleLoad; // Erro em frame individual não bloqueia o carregamento
      }

      images.push(img);
    }

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
    };
  }, []);

  // Função para desenhar o frame com aspect-ratio "cover" de alta resolução e brilho natural
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
      {/* Removidos os filtros escuros pesados. Apenas uma sombra lateral suave à esquerda para garantir legibilidade dos textos sem escurecer o robô */}
      <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 to-transparent pointer-events-none" />
    </div>
  );
}
