import React from "react";
import { InteractiveBlurTitle } from "@/components/v6/InteractiveBlurTitle";

const CLIENTS = [
  "Academia Gaviões",
  "Ubah Design",
  "Moa Pro",
  "Goloni Mobiliário",
  "Full English School",
  "Escola Cera",
  "Autosim Franquias",
  "Fábrica Publicidade",
  "Studio One",
  "Cavalcante Associados",
  "Rilluci",
  "ProgeFitness",
  "VCR mobiliário",
];

interface ClientsMarqueeSectionProps {
  Eyebrow: React.ComponentType<{
    children: React.ReactNode;
    cyan?: boolean;
    light?: boolean;
    className?: string;
  }>;
}

export function ClientsMarqueeSection({ Eyebrow }: ClientsMarqueeSectionProps) {
  // Duplica a lista de clientes para garantir um loop contínuo infinito e sem emendas
  const marqueeItems = [...CLIENTS, ...CLIENTS];

  return (
    <section
      id="clientes"
      className="border-t border-black/15 bg-[#ecece3] py-16 md:py-24 text-black overflow-hidden relative"
    >
      <div className="px-5 md:px-12 xl:px-[22vw]">
        <Eyebrow light>✦ Clientes & Marcas Atendidas</Eyebrow>
        <InteractiveBlurTitle
          as="h3"
          className="mt-4 md:mt-6 font-serif text-2xl sm:text-3xl md:text-4xl text-black font-light leading-snug"
        >
          Empresas que confiam na engenharia e visão da ESCOM Studio
        </InteractiveBlurTitle>
      </div>

      {/* Faixa Marquee Contínua com Efeito Lento */}
      <div className="relative mt-12 md:mt-16 w-full overflow-hidden border-y border-black/15 py-6 sm:py-8 bg-black/[0.015]">
        {/* Gradientes de fade nas laterais para suavizar entrada e saída */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-32 bg-gradient-to-r from-[#ecece3] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-32 bg-gradient-to-l from-[#ecece3] to-transparent" />

        <div className="animate-slow-marquee flex items-center gap-10 sm:gap-14">
          {marqueeItems.map((client, idx) => (
            <div
              key={`${client}-${idx}`}
              className="group flex items-center gap-10 sm:gap-14 shrink-0 cursor-default select-none"
            >
              <span className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-black/80 transition-colors duration-300 group-hover:text-black tracking-tight whitespace-nowrap">
                {client}
              </span>
              <span className="font-mono text-xs sm:text-sm text-black/25 shrink-0 select-none">
                ✦
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ClientsMarqueeSection;
