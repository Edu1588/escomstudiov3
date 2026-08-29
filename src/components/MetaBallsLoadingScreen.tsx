import { useEffect, useState } from "react";
import MetaBalls from "./MetaBalls";

interface MetaBallsLoadingScreenProps {
  onComplete?: () => void;
}

export default function MetaBallsLoadingScreen({ onComplete }: MetaBallsLoadingScreenProps) {
  const [progress, setProgress] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [shouldRender, setShouldRender] = useState<boolean>(true);

  useEffect(() => {
    // Incremento dinâmico de progresso rápido e fluido
    const startTime = performance.now();
    const duration = 1800; // ~1.8 segundos para carregar assets 3D

    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const current = Math.min(Math.floor((elapsed / duration) * 100), 100);
      setProgress(current);

      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsFinished(true);
          setTimeout(() => {
            setShouldRender(false);
            if (onComplete) onComplete();
          }, 600);
        }, 200);
      }
    }, 24);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#050608] text-white transition-opacity duration-600 ease-out select-none ${
        isFinished ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
      }`}
      style={{
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,209,255,0.12)_0%,rgba(0,0,0,0)_70%)]" />

      {/* MetaBalls WebGL Shader Visualizer */}
      <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 relative z-10 flex items-center justify-center">
        <MetaBalls
          color="#00d1ff"
          cursorBallColor="#ffffff"
          cursorBallSize={2.5}
          ballCount={16}
          animationSize={28}
          enableMouseInteraction={true}
          enableTransparency={true}
          hoverSmoothness={0.12}
          clumpFactor={1.1}
          speed={0.35}
        />
      </div>

      {/* Progress & Counter */}
      <div className="flex flex-col items-center gap-3 relative z-20 -mt-6">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl sm:text-4xl font-light tracking-widest text-zinc-100">
            {progress}
          </span>
          <span className="text-xl sm:text-2xl font-light text-cyan-400">%</span>
        </div>

        {/* Minimalist Progress Bar */}
        <div className="w-48 sm:w-56 h-[2px] bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/80">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 transition-all duration-75 shadow-[0_0_10px_#00d1ff]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-zinc-500 mt-2 font-mono">
          CARREGANDO SISTEMA DE CRESCIMENTO
        </p>
      </div>
    </div>
  );
}
