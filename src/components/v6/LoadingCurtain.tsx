import React, { useEffect, useState } from "react";

interface LoadingCurtainProps {
  progress: number; // 0 to 100
  onFinished?: () => void;
}

export function LoadingCurtain({ progress, onFinished }: LoadingCurtainProps) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [hideNumber, setHideNumber] = useState(false);
  const [openCurtains, setOpenCurtains] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  // Interpolação suave do número de 0 a 100%
  useEffect(() => {
    const timer = setInterval(() => {
      setDisplayProgress((prev) => {
        if (prev < progress) {
          const diff = progress - prev;
          const increment = Math.max(1, Math.ceil(diff * 0.22));
          return Math.min(100, prev + increment);
        }
        return prev;
      });
    }, 25);

    return () => clearInterval(timer);
  }, [progress]);

  // Quando atinge 100%: some a numeração e abre a tela lateralmente no meio como cortina
  useEffect(() => {
    if (displayProgress >= 100) {
      // 1. Espera um instante sutil e esconde a numeração
      const hideTimer = setTimeout(() => {
        setHideNumber(true);
      }, 180);

      // 2. Abre as duas metades da cortina lateralmente
      const openTimer = setTimeout(() => {
        setOpenCurtains(true);
      }, 480);

      // 3. Remove o elemento do DOM após a conclusão da animação
      const finishTimer = setTimeout(() => {
        setIsRemoved(true);
        if (onFinished) onFinished();
      }, 1500);

      return () => {
        clearTimeout(hideTimer);
        clearTimeout(openTimer);
        clearTimeout(finishTimer);
      };
    }
  }, [displayProgress, onFinished]);

  if (isRemoved) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] pointer-events-none transition-opacity duration-300 ${
        openCurtains ? "pointer-events-none" : "pointer-events-auto"
      }`}
      aria-hidden={openCurtains}
    >
      {/* Cortina Metade Esquerda */}
      <div
        className="absolute top-0 bottom-0 left-0 w-1/2 bg-[#050505] transition-transform duration-1000 ease-[cubic-bezier(0.77,0,0.175,1)] will-change-transform border-r border-white/5"
        style={{
          transform: openCurtains ? "translateX(-100%)" : "translateX(0)",
        }}
      />

      {/* Cortina Metade Direita */}
      <div
        className="absolute top-0 bottom-0 right-0 w-1/2 bg-[#050505] transition-transform duration-1000 ease-[cubic-bezier(0.77,0,0.175,1)] will-change-transform border-l border-white/5"
        style={{
          transform: openCurtains ? "translateX(100%)" : "translateX(0)",
        }}
      />

      {/* Linha central sutil no meio que se divide com a cortina */}
      <div
        className={`absolute top-0 bottom-0 left-1/2 w-px bg-cyan-400/25 -translate-x-1/2 transition-opacity duration-300 pointer-events-none ${
          openCurtains || hideNumber ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Conteúdo Central: Numeração Fina e Elegante de 0 a 100% */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 transition-all duration-300"
        style={{
          opacity: hideNumber ? 0 : 1,
          transform: hideNumber ? "scale(0.94) translateY(6px)" : "scale(1) translateY(0)",
        }}
      >
        <div className="flex flex-col items-center gap-3">
          {/* Tag editorial de topo */}
          <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-500 font-light">
            <span className="size-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>ESCOM STUDIO // SYSTEM INITIALIZING</span>
          </div>

          {/* Numeração Fina de 0 a 100% */}
          <div className="flex items-baseline font-serif font-extralight text-7xl sm:text-8xl md:text-9xl text-white tracking-tighter tabular-nums select-none">
            <span>{displayProgress}</span>
            <span className="text-3xl sm:text-4xl md:text-5xl font-light text-cyan-400/90 ml-1">%</span>
          </div>

          {/* Micro linha técnica editorial */}
          <div className="w-36 h-[1px] bg-white/10 overflow-hidden relative mt-1">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-white transition-all duration-150 ease-out"
              style={{ width: `${displayProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
