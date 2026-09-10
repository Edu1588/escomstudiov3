import React from 'react';

export default function CareersV2() {
  return (
    <section id="careers" className="relative py-24 z-10 bg-[#050505] border-t border-white/15 w-full overflow-hidden flex flex-col justify-center">
      {/* Top ASCII Dragon/Anvil Pixel Emblem matching Dragonfly screenshot 8 */}
      <div className="flex justify-center mb-6">
        <pre className="font-mono text-[9px] sm:text-[10px] text-[#ff4f00] leading-tight select-none opacity-80">
{`    |\\___/|
    (  o.o  )  F Á B R I C A
     > ^ <   C A R E E R S`}
        </pre>
      </div>

      {/* Dragonfly Header matching 05 CAREERS */}
      <div className="flex flex-col items-center justify-center text-center mb-8 px-4">
        <span className="text-[#ff4f00] font-mono text-3xl md:text-4xl font-bold tracking-widest mb-1">
          05
        </span>
        <h2 className="text-white font-mono text-2xl md:text-4xl font-bold tracking-[0.25em] uppercase">
          CAREERS
        </h2>
      </div>

      {/* Hairline SEC Bar */}
      <div className="w-full border-y border-white/15 py-3 px-4 sm:px-8 mb-12 flex justify-between items-center font-mono text-xs text-white/40 tracking-widest">
        <span>SEC-05</span>
        <span>— TRABALHE CONOSCO</span>
        <span>[ TALENTOS & FORJA DE CARREIRA ]</span>
      </div>

      {/* Intro Text & CTA Box matching Dragonfly screenshot 8 */}
      <div className="px-6 md:px-16 max-w-4xl mx-auto text-center space-y-8">
        <h3 className="text-3xl sm:text-5xl font-mono text-white font-bold tracking-tight uppercase leading-snug">
          Fábrica atrai operadores de classe mundial para forjar os projetos mais ambiciosos do mercado.
        </h3>

        <p className="font-sans text-sm sm:text-base text-white/70 font-light leading-relaxed max-w-2xl mx-auto">
          Procuramos designers obsessivos, estrategistas de tráfego analíticos e desenvolvedores mestres. Se você busca excelência sem desculpas, seu lugar é na nossa bigorna.
        </p>

        <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#contact"
            className="bg-[#ff4f00] hover:bg-[#ff4f00]/90 text-black font-mono font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-full transition-all shadow-xl shadow-[#ff4f00]/25 hover:scale-105"
          >
            Enviar Currículo / Briefing →
          </a>
        </div>
      </div>
    </section>
  );
}
