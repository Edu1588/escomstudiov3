"use client";

import React, { useState } from "react";
import { Maximize2, ExternalLink, Sparkles, Building2, SunMedium, Moon } from "lucide-react";

export interface BuildingShowcase3DProps {
  className?: string;
}

export function BuildingShowcase3D({ className = "" }: BuildingShowcase3DProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className={`relative w-full h-full min-h-[500px] md:min-h-[620px] rounded-2xl overflow-hidden bg-[#060a22] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] ${className}`}>
      {/* Top Bar HUD */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#0a0e26]/85 backdrop-blur-md border border-[#5cc8ff]/30 text-white font-mono text-[10px] uppercase tracking-wider pointer-events-auto">
          <Building2 className="size-3.5 text-[#f6c65b]" />
          <span className="font-semibold text-white">Espelho de Vendas 3D · Construtora</span>
          <span className="text-zinc-500">|</span>
          <span className="text-[#3ddc97]">100% Interativo</span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <a
            href="/construtora"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#5cc8ff]/15 hover:bg-[#5cc8ff]/25 border border-[#5cc8ff]/40 text-[#5cc8ff] text-[10px] font-mono uppercase tracking-wider transition-colors"
          >
            <span>Abrir Demo Completa</span>
            <ExternalLink className="size-3" />
          </a>
        </div>
      </div>

      {/* Frame Interativo WebGL da Maquete 3D */}
      <iframe
        src="/construtora/index.html"
        title="Espelho de Vendas 3D para Construtoras"
        className="w-full h-full min-h-[500px] md:min-h-[620px] border-0"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
      />

      {/* Bottom Hint */}
      <div className="absolute bottom-3 left-4 z-20 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-zinc-400 font-mono text-[9px] uppercase tracking-wider">
        <Sparkles className="size-3 text-[#f6c65b]" />
        <span>Gire a maquete, clique nas janelas iluminadas para ver preços e pavimentos</span>
      </div>
    </div>
  );
}

export default BuildingShowcase3D;
