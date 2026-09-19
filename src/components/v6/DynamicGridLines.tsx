import React from "react";

interface DynamicGridLinesProps {
  /**
   * Ref para valor de progresso de 0.0 (fechado) a 1.0 (totalmente aberto)
   * Ou progresso numérico direto
   */
  progress?: number;
  color?: "dark" | "light";
  label?: string;
}

export function FourPointStar({ className = "size-2.5 text-current" }: { className?: string }) {
  return (
    <svg viewBox="0 0 10 10" className={className} fill="currentColor">
      <path d="M5 0 L5.8 4.2 L10 5 L5.8 5.8 L5 10 L4.2 5.8 L0 5 L4.2 4.2 Z" />
    </svg>
  );
}

export function DynamicGridLines({
  progress = 1,
  color = "dark",
  label = "SYSTEM ARCHITECTURE",
}: DynamicGridLinesProps) {
  const isDark = color === "dark";
  const lineColor = isDark ? "bg-black/20" : "bg-white/20";
  const textColor = isDark ? "text-black/60" : "text-white/60";
  const starColor = isDark ? "text-black" : "text-white";

  // progress varia de 0 (fechado no centro) a 1 (aberto no enquadramento)
  // vertical: de 46% a 14% do topo e base
  // horizontal: de 44% a 12% da esquerda e direita
  const topPercent = 46 - progress * 32; // 46% -> 14%
  const bottomPercent = 46 - progress * 32; // 46% -> 14%
  const leftPercent = 44 - progress * 32; // 44% -> 12%
  const rightPercent = 44 - progress * 32; // 44% -> 12%

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20 select-none">
      {/* Marcador superior esquerdo estilo The Model */}
      <div
        className={`absolute font-mono text-[9px] uppercase tracking-[0.2em] ${textColor} flex items-center gap-2 transition-all duration-300`}
        style={{
          top: `calc(${topPercent}% - 22px)`,
          left: `${leftPercent}%`,
        }}
      >
        <div className="grid grid-cols-2 gap-[2px] opacity-70">
          <div className="size-1 bg-current" />
          <div className="size-1 bg-current" />
          <div className="size-1 bg-current" />
          <div className="size-1 bg-current" />
        </div>
        <span>-- {label}</span>
      </div>

      {/* LINHA HORIZONTAL SUPERIOR */}
      <div
        className={`absolute inset-x-0 h-px ${lineColor} transition-all duration-150 ease-out`}
        style={{ top: `${topPercent}%` }}
      />

      {/* LINHA HORIZONTAL INFERIOR */}
      <div
        className={`absolute inset-x-0 h-px ${lineColor} transition-all duration-150 ease-out`}
        style={{ bottom: `${bottomPercent}%` }}
      />

      {/* LINHA VERTICAL ESQUERDA */}
      <div
        className={`absolute inset-y-0 w-px ${lineColor} transition-all duration-150 ease-out`}
        style={{ left: `${leftPercent}%` }}
      />

      {/* LINHA VERTICAL DIREITA */}
      <div
        className={`absolute inset-y-0 w-px ${lineColor} transition-all duration-150 ease-out`}
        style={{ right: `${rightPercent}%` }}
      />

      {/* ESTRELAS NOS 4 CRUZAMENTOS (✦) */}
      {/* Canto Superior Esquerdo */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ease-out"
        style={{ top: `${topPercent}%`, left: `${leftPercent}%` }}
      >
        <FourPointStar className={`size-3 ${starColor}`} />
      </div>

      {/* Canto Superior Direito */}
      <div
        className="absolute translate-x-1/2 -translate-y-1/2 transition-all duration-150 ease-out"
        style={{ top: `${topPercent}%`, right: `${rightPercent}%` }}
      >
        <FourPointStar className={`size-3 ${starColor}`} />
      </div>

      {/* Canto Inferior Esquerdo */}
      <div
        className="absolute -translate-x-1/2 translate-y-1/2 transition-all duration-150 ease-out"
        style={{ bottom: `${bottomPercent}%`, left: `${leftPercent}%` }}
      >
        <FourPointStar className={`size-3 ${starColor}`} />
      </div>

      {/* Canto Inferior Direito */}
      <div
        className="absolute translate-x-1/2 translate-y-1/2 transition-all duration-150 ease-out"
        style={{ bottom: `${bottomPercent}%`, right: `${rightPercent}%` }}
      >
        <FourPointStar className={`size-3 ${starColor}`} />
      </div>
    </div>
  );
}
