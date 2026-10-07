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
  curtainsOpen?: boolean;
  onSatelliteEnded?: () => void;
}

/** Pausa após a cortina abrir totalmente, para o início do vídeo do satélite não ser cortado. */
const SATELLITE_START_DELAY_MS = 450;

export function RobozitoSequenceBackground({
  currentFrame = 0,
  frameRef,
  progressRef,
  className = "",
  onProgress,
  onLoaded,
  curtainsOpen = false,
  onSatelliteEnded,
}: RobozitoSequenceBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const satelliteVideoRef = useRef<HTMLVideoElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedCountRef = useRef<number>(0);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const lastDrawnFrameRef = useRef<number>(-1);

  // Transição sequencial: Tela de loading -> Vídeo do Satélite -> Vídeo do Robô Hero em looping
  const [satelliteEnded, setSatelliteEnded] = useState(false);
  const satelliteEndedRef = useRef(false);
  const satelliteStartedRef = useRef(false);

  // Pré-carregamento dos 96 frames com monitoramento da meta (metade das imagens)
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

    // Timeout de segurança: após 4.5 segundos, completa para não travar
    const safetyTimer = setTimeout(() => {
      if (isMounted && onProgress) {
        onProgress(100);
      }
    }, 4500);

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      const frameNum = i + 1;
      img.src = `https://res.cloudinary.com/ifuatk2z/image/upload/v1790263032/roboescom_${frameNum}.png`;

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
        img.onerror = handleSingleLoad;
      }

      images.push(img);
    }

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
    };
  }, []);

  // Transição suave para o vídeo Hero quando o vídeo do Satélite termina
  const onSatelliteEndedRef = useRef(onSatelliteEnded);
  onSatelliteEndedRef.current = onSatelliteEnded;

  const handleSatelliteEnded = () => {
    if (satelliteEndedRef.current) return;
    satelliteEndedRef.current = true;
    setSatelliteEnded(true);
    onSatelliteEndedRef.current?.();

    const hero = heroVideoRef.current;
    if (hero) {
      hero.currentTime = 0;
      hero.play().catch(() => {});
    }
  };

  const handleSatelliteTimeUpdate = () => {
    const sat = satelliteVideoRef.current;
    if (sat && sat.duration > 0) {
      // 0.35s antes do término, inicia a transição suave para o Hero
      if (sat.currentTime >= sat.duration - 0.35) {
        handleSatelliteEnded();
      }
    }
  };

  const startSatellite = () => {
    const sat = satelliteVideoRef.current;
    if (!sat || satelliteStartedRef.current) return;
    satelliteStartedRef.current = true;
    sat.currentTime = 0;
    sat.play().catch((err) => {
      console.warn("Satellite autoplay blocked or errored:", err);
      handleSatelliteEnded();
    });
  };

  // Disparo do vídeo do Satélite após a cortina abrir TOTALMENTE + pequena pausa,
  // garantindo que o primeiro frame do vídeo seja visto pelo usuário.
  useEffect(() => {
    if (!curtainsOpen) return;
    const t = setTimeout(startSatellite, SATELLITE_START_DELAY_MS);
    return () => clearTimeout(t);
  }, [curtainsOpen]);

  // Rede de segurança: só atua se a cortina nunca sinalizar abertura.
  // (O loading completa no máximo em ~4.5s + 1.8s de animação de cortina.)
  useEffect(() => {
    const safetyTimeout = setTimeout(startSatellite, 12000);
    return () => clearTimeout(safetyTimeout);
  }, []);

  // Função para desenhar o frame no canvas
  const renderFrame = (targetIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(targetIndex)));
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

    const frameProgress = Math.max(0, Math.min(1, clamped / (TOTAL_FRAMES - 1)));
    const focusXRatio = 0.77 - frameProgress * 0.27;

    let nx = (cw - nw) / 2;
    if (nw > cw) {
      const targetScreenX = cw * 0.52;
      const targetNx = targetScreenX - focusXRatio * nw;
      nx = Math.max(cw - nw, Math.min(0, targetNx));
    }

    const ny = (ch - nh) / 2;
    ctx.drawImage(img, nx, ny, nw, nh);
  };

  // Loop RAF de sincronização com scroll
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

      // Sincroniza vídeo ativo no topo com crossfade para a sequência de scroll
      const isHeroActive = satelliteEndedRef.current;
      const activeVideo = isHeroActive ? heroVideoRef.current : satelliteVideoRef.current;
      const inactiveVideo = isHeroActive ? satelliteVideoRef.current : heroVideoRef.current;

      if (activeVideo) {
        // Conforme o scroll avança (frames 0 a 6), a opacidade do vídeo diminui até revelar o canvas
        const videoOpacity = Math.max(0, Math.min(1, 1 - (clamped / 5)));
        activeVideo.style.opacity = String(videoOpacity);

        if (clamped > 15) {
          if (!activeVideo.paused) {
            activeVideo.pause();
          }
        } else {
          if (activeVideo.paused && (satelliteStartedRef.current || isHeroActive)) {
            activeVideo.play().catch(() => {});
          }
        }
      }

      if (inactiveVideo) {
        inactiveVideo.style.opacity = "0";
        if (!inactiveVideo.paused && isHeroActive) {
          inactiveVideo.pause();
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [currentFrame, frameRef, progressRef, initialLoaded]);

  // Redimensionamento do canvas
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
      {/* Sequência Canvas no Scroll (Frames 001 a 096) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* 1. VÍDEO DO SATÉLITE (Executa primeiro após a tela de loading) */}
      <video
        ref={satelliteVideoRef}
        src="https://res.cloudinary.com/ifuatk2z/video/upload/v1791323378/satelite.mp4"
        muted
        playsInline
        preload="auto"
        onEnded={handleSatelliteEnded}
        onTimeUpdate={handleSatelliteTimeUpdate}
        onError={handleSatelliteEnded}
        className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 pointer-events-none"
        style={{ opacity: satelliteEnded ? 0 : 1 }}
      />

      {/* 2. VÍDEO DO ROBÔ HERO (Entra em seguida em looping contínuo até haver scroll) */}
      <video
        ref={heroVideoRef}
        src="https://res.cloudinary.com/ifuatk2z/video/upload/v1790688472/robot_inicio.mp4"
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover object-[77%_center] md:object-center transition-opacity duration-700 pointer-events-none"
        style={{ opacity: satelliteEnded ? 1 : 0 }}
      />

      {/* Sombra lateral suave no desktop e vinheta balanceada no mobile */}
      <div className="absolute inset-0 bg-black/20 md:hidden pointer-events-none" />
      <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 to-transparent pointer-events-none" />
    </div>
  );
}

export default RobozitoSequenceBackground;
