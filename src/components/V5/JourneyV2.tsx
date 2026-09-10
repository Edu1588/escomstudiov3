import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function JourneyV2() {
  const { t } = useLanguage();

  const pillars = [
    {
      num: '01',
      stage: 'AQUECIMENTO',
      focus: 'Posicionamento — Forjando a marca.',
      desc: 'Construímos identidades estratégicas que ganham forma, força e presença no mercado. Retiramos sua marca do anonimato injetando essência visual de altíssimo impacto.',
      items: [
        'Branding & Identidade Visual',
        'Naming & Manual de Marca',
        'Site Institucional',
        'Embalagens & Papelaria',
        'Comunicação Visual de Loja',
      ],
      tag: 'FASE 1: METAL BRUTO',
    },
    {
      num: '02',
      stage: 'MARTELO & BIGORNA',
      focus: 'Relacionamento — Moldando a presença.',
      desc: 'Criamos presença ativa, consistente e líder nos canais digitais e físicos. Cada martelada é um ponto de contato polido com extremo valor para engajar sua audiência.',
      items: [
        'Gestão de Redes Sociais',
        'Produção de Conteúdo',
        'E-mail Marketing',
        'Campanhas Sazonais',
        'Materiais para PDV',
      ],
      tag: 'FASE 2: CONFORMAÇÃO',
    },
    {
      num: '03',
      stage: 'TÊMPERA',
      focus: 'Vendas & Resultados — Afiando a lâmina.',
      desc: 'Transformamos tráfego qualificado em clientes recorrentes e de alto ticket. A têmpera final que torna seu funil de vendas afiado, letal e pronto para vencer os concorrentes.',
      items: [
        'Meta Ads & Google Ads',
        'Landing Pages',
        'Copywriting de Conversão',
        'CRM & Automações',
        'CRO & Otimização',
      ],
      tag: 'FASE 3: LÂMINA AFIADA',
    },
  ];

  return (
    <section id="journey" className="relative py-24 z-10 bg-[#050505] min-h-screen border-t border-white/15 w-full overflow-hidden flex flex-col justify-center">
      {/* Dragonfly Header */}
      <div className="flex flex-col items-center justify-center text-center mb-8 px-4">
        <span className="text-[#ff4f00] font-mono text-3xl md:text-4xl font-bold tracking-widest mb-1">
          03
        </span>
        <h2 className="text-white font-mono text-2xl md:text-4xl font-bold tracking-[0.25em] uppercase">
          JORNADA DA FORJA
        </h2>
      </div>

      {/* Hairline SEC Bar */}
      <div className="w-full border-y border-white/15 py-3 px-4 sm:px-8 mb-12 flex justify-between items-center font-mono text-xs text-white/40 tracking-widest">
        <span>SEC-03</span>
        <span>— JORNADA DA FORJA</span>
        <span>[ DA IDENTIDADE À PERFORMANCE ]</span>
      </div>

      {/* Section Title & Description */}
      <div className="px-6 md:px-16 max-w-5xl mx-auto mb-16 text-center">
        <h3 className="text-3xl sm:text-5xl font-mono text-white font-bold mb-4 tracking-tight uppercase">
          Da identidade à performance.
        </h3>
        <p className="font-sans text-sm sm:text-base text-white/70 font-light leading-relaxed max-w-2xl mx-auto">
          Três pilares essenciais. Cada etapa, uma analogia com o processo de forja: do metal bruto à lâmina afiada. Conheça as divisões estratégicas da Fábrica.
        </p>
      </div>

      {/* 3-Column Edge-to-Edge Grid (0 Gap with Hairline Borders) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 w-full border-y border-white/15">
        {pillars.map((p, idx) => (
          <div
            key={idx}
            className={`p-8 sm:p-12 border-b lg:border-b-0 border-white/15 ${
              idx < pillars.length - 1 ? 'lg:border-r border-white/15' : ''
            } hover:bg-white/[0.02] transition-colors flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-sm text-[#ff4f00] font-bold tracking-widest">
                  {p.num} // {p.stage}
                </span>
                <span className="text-[10px] font-mono text-white/40 border border-white/10 px-2.5 py-1 rounded-full uppercase">
                  {p.tag}
                </span>
              </div>

              <h4 className="text-xl sm:text-2xl font-mono text-white font-bold mb-4 tracking-tight">
                {p.focus}
              </h4>

              <p className="font-sans text-sm text-white/70 font-light leading-relaxed mb-8">
                {p.desc}
              </p>
            </div>

            <div className="border-t border-white/10 pt-6">
              <span className="text-[10px] font-mono text-[#ff4f00] uppercase tracking-widest block mb-3 font-bold">
                [ SERVIÇOS DESTE PILAR ]
              </span>
              <ul className="space-y-2 font-mono text-xs text-white/80">
                {p.items.map((item, iIndex) => (
                  <li key={iIndex} className="flex items-center gap-2.5">
                    <span className="text-[#ff4f00] text-xs">⚡</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
