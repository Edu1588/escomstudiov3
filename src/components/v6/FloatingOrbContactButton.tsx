import React, { useState } from "react";
import { MessageCircle, ArrowUpRight, X } from "lucide-react";
import { LiveOrb } from "@/components/ui/live-orb";

export function FloatingOrbContactButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const whatsappUrl =
    "https://wa.me/5513981062787?text=Ol%C3%A1%20vim%20atrav%C3%A9s%20do%20Site%20Escom%20Studio%20e%20gostaria%20de%20um%20diagn%C3%B3stico%20de%20projeto.";

  return (
    <aside
      aria-label="Atendimento rápido ESCOM Studio"
      className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50 flex flex-col items-end pointer-events-none"
    >
      {/* BALÃO / MINI MENU EXPANDIDO QUANDO CLICADO */}
      {isOpen && (
        <div className="pointer-events-auto mb-3 w-72 sm:w-80 rounded-2xl bg-[#0c0c0e]/95 backdrop-blur-xl border border-white/15 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(0,229,255,0.15)] animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#0CCE6B] animate-pulse" />
              <span className="font-mono text-[11px] uppercase tracking-wider text-white font-semibold">
                ESCOM Studio // Online
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-400 hover:text-white p-1 transition-colors cursor-pointer"
              aria-label="Fechar menu de contato"
            >
              <X className="size-4" />
            </button>
          </div>

          <p className="mt-3 text-xs text-zinc-300 leading-relaxed font-sans">
            Precisa de um diagnóstico para seu novo site, branding 3D ou sistema de alta conversão?
          </p>

          <div className="mt-4 flex flex-col gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#0CCE6B] text-black font-semibold text-xs transition-all hover:bg-[#00e5ff] hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] group"
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="size-4" />
                <span>Conversar no WhatsApp</span>
              </div>
              <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <a
              href="#diagnostico"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-[11px] tracking-wide transition-colors group"
            >
              <span>Preencher Diagnóstico Rápido</span>
              <span className="text-cyan group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </div>
      )}

      {/* BOTÃO PRINCIPAL COM LIVE ORB */}
      <div
        className="pointer-events-auto flex items-center gap-3 cursor-pointer select-none group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* PILL COM TEXTO REVELADO NO HOVER / DESKTOP */}
        <div
          className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-white/15 text-white transition-all duration-300 shadow-lg ${
            isHovered
              ? "opacity-100 translate-x-0"
              : "opacity-80 translate-x-1 hover:opacity-100"
          }`}
        >
          <span className="size-1.5 rounded-full bg-[#0CCE6B] animate-pulse" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-200 group-hover:text-cyan transition-colors">
            Fale Conosco
          </span>
        </div>

        {/* CONTAINER DO ORB INTERATIVO */}
        <div className="relative size-14 sm:size-16 rounded-full bg-black/80 backdrop-blur-md border border-white/20 group-hover:border-cyan/60 flex items-center justify-center shadow-[0_10px_35px_rgba(0,0,0,0.7),0_0_25px_rgba(0,229,255,0.25)] group-hover:shadow-[0_10px_40px_rgba(0,229,255,0.45)] transition-all duration-300 group-hover:scale-105 active:scale-95">
          {/* AURA PULSANTE DE FUNDO */}
          <div className="absolute inset-0 rounded-full bg-cyan/15 blur-md animate-pulse pointer-events-none" />

          {/* O ORB INTERATIVO 3D EM GLSL */}
          <div className="relative size-11 sm:size-12 rounded-full overflow-hidden flex items-center justify-center">
            <LiveOrb
              size={52}
              variant="custom"
              color="#00e5ff"
              eyeColor="#000000"
              interactive={true}
              blink={true}
              lookOrigin="screen"
              className="pointer-events-none"
            />
          </div>

          {/* BADGE DE MENSAGEM NO CANTO */}
          <div className="absolute -top-1 -right-1 size-5 rounded-full bg-[#0CCE6B] border-2 border-black flex items-center justify-center text-black">
            <MessageCircle className="size-2.5 stroke-[2.5]" />
          </div>
        </div>
      </div>
    </aside>
  );
}

export default FloatingOrbContactButton;
