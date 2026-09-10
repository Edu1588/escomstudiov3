import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface BarrierCard {
  id: number;
  title: string;
  pillarId: string;
  desc: string;
  isBroken: boolean;
}

export default function BreakBarriersV2() {
  const { t } = useLanguage();

  const [cards, setCards] = useState<BarrierCard[]>([
    {
      id: 1,
      title: 'O Padrão Comum',
      pillarId: 'PILAR 22',
      desc: 'Publicidade morna e clichês que passam despercebidos. Clique ou arraste com força para libertar o verdadeiro impacto da sua marca.',
      isBroken: false,
    },
    {
      id: 2,
      title: 'Teto Comercial',
      pillarId: 'PILAR 68',
      desc: 'Canais digitais travados no mesmo faturamento. Rompa os limites e estilhace as barreiras de tráfego para escalar suas vendas.',
      isBroken: false,
    },
    {
      id: 3,
      title: 'Inércia Criativa',
      pillarId: 'PILAR 37',
      desc: 'Marcas genéricas sem personalidade própria. Forje conceitos fortes, quebrando o silêncio sob a alta pressão da concorrência.',
      isBroken: false,
    },
    {
      id: 4,
      title: 'Falta de Agilidade',
      pillarId: 'PILAR 53',
      desc: 'Processos corporativos lentos e engessados. Derreta o metal, mude o estado físico e forje com agilidade extrema de mercado.',
      isBroken: false,
    },
  ]);

  const handleShatter = (id: number) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, isBroken: !card.isBroken } : card
      )
    );
  };

  return (
    <section className="relative py-24 z-10 bg-[#050505] border-t border-white/15 w-full overflow-hidden flex flex-col justify-center">
      {/* Header */}
      <div className="flex flex-col items-center justify-center text-center mb-8 px-4">
        <span className="text-[#ff4f00] font-mono text-3xl md:text-4xl font-bold tracking-widest mb-1">
          05
        </span>
        <h2 className="text-white font-mono text-2xl md:text-4xl font-bold tracking-[0.25em] uppercase">
          QUEBRANDO BARREIRAS
        </h2>
      </div>

      {/* SEC Bar */}
      <div className="w-full border-y border-white/15 py-3 px-4 sm:px-8 mb-12 flex justify-between items-center font-mono text-xs text-white/40 tracking-widest">
        <span>SEC-05</span>
        <span>— QUEBRANDO BARREIRAS</span>
        <span>[ INTERAÇÃO INDUSTRIAL ]</span>
      </div>

      {/* Intro */}
      <div className="px-6 md:px-16 max-w-4xl mx-auto mb-12 text-center">
        <h3 className="text-3xl sm:text-5xl font-mono text-white font-bold mb-4 tracking-tight uppercase">
          Limitações se estilhaçam, marcas se consolidam.
        </h3>
        <p className="font-sans text-sm sm:text-base text-white/70 font-light leading-relaxed mb-6">
          Forjar não é apenas aquecer; é quebrar a resistência de materiais brutos para criar ferramentas indestrutíveis. Interaja diretamente abaixo e sinta a força da nossa bigorna comercial.
        </p>
        <div className="inline-flex items-center gap-2 bg-[#ff4f00]/10 border border-[#ff4f00]/30 px-4 py-1.5 rounded-full text-[#ff4f00] font-mono text-xs uppercase tracking-widest animate-pulse">
          <span>🔨</span>
          <span>Dica: Clique ou arraste os cards para estilhaçá-los</span>
        </div>
      </div>

      {/* 4 Cards Grid Edge-to-Edge */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full border-y border-white/15">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleShatter(card.id)}
            className={`cursor-pointer select-none relative p-8 border-b sm:border-b-0 border-white/15 ${
              card.id < 4 ? 'lg:border-r border-white/15' : ''
            } transition-all duration-500 min-h-[300px] flex flex-col justify-between ${
              card.isBroken
                ? 'bg-[#ff4f00]/10 border-[#ff4f00]/50'
                : 'hover:bg-white/[0.03] bg-[#050505]'
            }`}
          >
            {/* Status indicator badge */}
            <div className="flex justify-between items-center font-mono text-xs mb-6">
              <span
                className={`font-bold tracking-widest px-3 py-1 rounded-full uppercase border transition-colors ${
                  card.isBroken
                    ? 'bg-[#ff4f00] text-black border-[#ff4f00]'
                    : 'bg-[#050505] text-white/60 border-white/20'
                }`}
              >
                {card.isBroken ? 'RECONSTRUINDO...' : `${card.pillarId} INTACT`}
              </span>
              <span className="text-white/30 text-[10px]">
                {card.isBroken ? '⚡ SHATTERED' : '🔨 TAP TO FORGE'}
              </span>
            </div>

            {/* Title & Desc */}
            <div className="my-auto">
              <h4
                className={`font-mono text-2xl font-bold uppercase mb-3 tracking-tight transition-colors ${
                  card.isBroken ? 'text-[#ff4f00] line-through' : 'text-white'
                }`}
              >
                {card.title}
              </h4>
              <p className="font-sans text-xs sm:text-sm text-white/70 leading-relaxed font-light">
                {card.desc}
              </p>
            </div>

            {/* Shatter effect overlay indicator */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between font-mono text-[10px] text-white/40 uppercase">
              <span>{card.isBroken ? 'BARREIRA ROMPIDA' : 'RESISTÊNCIA BRUTA'}</span>
              <span className="text-[#ff4f00]">{card.isBroken ? '✓ LIBERTADO' : '→ BREAK'}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
