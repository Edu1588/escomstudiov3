import React from 'react';

export default function PortfolioV2() {
  const projects = [
    {
      title: 'AZUL VEÍCULOS',
      category: 'BRANDING & PERFORMANCE',
      year: '2025',
      desc: 'Rebranding completo e estratégia de aquisição digital para uma das maiores concessionárias da região.',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: 'PAIOÇA DO CABOCLO',
      category: 'IDENTIDADE VISUAL & CONTEÚDO',
      year: '2024',
      desc: 'Posicionamento e branding para uma casa sertaneja e gastronômica de renome no interior paulista.',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: 'TELIC TECHNOLOGIES',
      category: 'UI/UX & TECH HOUSE',
      year: '2025',
      desc: 'Desenvolvimento de portal corporativo de alta performance e identidade digital para soluções tech.',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: 'FOGÃO MINEIRO',
      category: 'DIREÇÃO DE ARTE & CAMPANHAS',
      year: '2024',
      desc: 'Campanhas promocionais e remodelagem da comunicação em redes sociais para rede alimentícia.',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
    },
  ];

  return (
    <section id="portfolio" className="relative py-24 z-10 bg-[#050505] border-t border-white/15 w-full overflow-hidden flex flex-col justify-center">
      {/* ASCII Dragon/Anvil Pixel Emblem matching Dragonfly screenshot 6 */}
      <div className="flex justify-center mb-6">
        <pre className="font-mono text-[9px] sm:text-[10px] text-[#ff4f00] leading-tight select-none opacity-80">
{`   /\\_/\\
  ( o.o )  F Á B R I C A
   > ^ <  P O R T F O L I O`}
        </pre>
      </div>

      {/* Dragonfly Header matching 04 PORTFOLIO */}
      <div className="flex flex-col items-center justify-center text-center mb-8 px-4">
        <span className="text-[#ff4f00] font-mono text-3xl md:text-4xl font-bold tracking-widest mb-1">
          04
        </span>
        <h2 className="text-white font-mono text-2xl md:text-4xl font-bold tracking-[0.25em] uppercase">
          PORTFOLIO
        </h2>
      </div>

      {/* Hairline SEC Bar */}
      <div className="w-full border-y border-white/15 py-3 px-4 sm:px-8 mb-12 flex justify-between items-center font-mono text-xs text-white/40 tracking-widest">
        <span>SEC-04</span>
        <span>— PROJETOS EM DESTAQUE</span>
        <span>[ CASOS DE SUCESSO FORJADOS ]</span>
      </div>

      {/* Intro Text */}
      <div className="px-6 md:px-16 max-w-4xl mx-auto mb-16 text-center">
        <h3 className="text-3xl sm:text-5xl font-mono text-white font-bold mb-4 tracking-tight uppercase">
          Trabalhos forjados sob demanda.
        </h3>
        <p className="font-sans text-sm sm:text-base text-white/70 font-light leading-relaxed max-w-2xl mx-auto">
          Conheça os projetos de marcas que confiaram na nossa equipe para escalar seu posicionamento e vendas.
        </p>
      </div>

      {/* 2x2 Edge-to-Edge Grid Matrix matching Dragonfly screenshot 6 */}
      <div className="grid grid-cols-1 md:grid-cols-2 w-full border-y border-white/15">
        {projects.map((p, idx) => (
          <div
            key={idx}
            className={`group relative p-8 sm:p-12 border-b border-white/15 ${
              idx % 2 === 0 ? 'md:border-r border-white/15' : ''
            } hover:bg-white/[0.02] transition-colors flex flex-col justify-between`}
          >
            {/* Top Meta Info */}
            <div className="flex justify-between items-center font-mono text-xs mb-6">
              <span className="text-[#ff4f00] font-bold tracking-widest bg-[#ff4f00]/10 border border-[#ff4f00]/30 px-3 py-1 rounded-full uppercase">
                {p.category}
              </span>
              <span className="text-white/40 font-bold">{p.year}</span>
            </div>

            {/* Image Preview Box */}
            <div className="relative aspect-[16/9] w-full bg-neutral-900 overflow-hidden rounded-lg mb-6 border border-white/10 group-hover:border-[#ff4f00]/50 transition-all">
              <img
                src={p.image}
                alt={p.title}
                className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-[#050505]/40 group-hover:bg-transparent transition-colors" />
            </div>

            {/* Title & Desc */}
            <div>
              <h4 className="font-mono font-bold text-2xl text-white tracking-wider uppercase mb-2 group-hover:text-[#ff4f00] transition-colors">
                {p.title}
              </h4>
              <p className="font-sans text-xs sm:text-sm text-white/70 leading-relaxed font-light">
                {p.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
