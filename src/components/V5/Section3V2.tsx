import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function Section3V2() {
  const { t } = useLanguage();

  const services = [
    {
      num: '01/05',
      badge: 'BRANDING',
      title: 'Branding',
      desc: 'Marcas incríveis atreladas à essência e pilares profundos da sua identidade visual para atrair o público ideal.',
      visualType: 'vortex',
    },
    {
      num: '02/05',
      badge: 'COMUNICAÇÃO',
      title: 'Comunicação',
      desc: 'Estratégias de discurso e canais consistentes. Tão importante quanto o que comunicar é como e onde comunicar.',
      visualType: 'tower',
    },
    {
      num: '03/05',
      badge: 'DESIGN',
      title: 'Design',
      desc: 'Ideias, conceitos e informações traduzidas em propaganda de alto nível com tipografias e diagramações obsessivas.',
      visualType: 'sphere',
    },
    {
      num: '04/05',
      badge: 'DIGITAL',
      title: 'Digital',
      desc: 'Lançamos e consolidamos a presença criativa da sua marca no mundo digital com foco em engajamento e métrica.',
      visualType: 'matrix',
    },
    {
      num: '05/05',
      badge: 'TECH HOUSE',
      title: 'Tech House',
      desc: 'Aplicações escaláveis, inteligência artificial, interfaces de alta imersão e gamificação moldadas através da programação.',
      visualType: 'tech',
    },
  ];

  return (
    <section
      id="services"
      className="relative py-20 z-10 bg-[#050505] min-h-screen border-t border-white/15 w-full overflow-hidden"
    >
      {/* Header matching Dragonfly 02 Section */}
      <div className="flex flex-col items-center justify-center text-center mb-8 px-4">
        <span className="text-[#ff4f00] font-mono text-3xl md:text-4xl font-bold tracking-widest mb-1">
          02
        </span>
        <h2 className="text-white font-mono text-2xl md:text-4xl font-bold tracking-[0.25em] uppercase">
          O QUE FORJAMOS
        </h2>
      </div>

      {/* SEC Bar */}
      <div className="w-full border-y border-white/15 py-3 px-4 sm:px-8 mb-12 flex justify-between items-center font-mono text-xs text-white/40 tracking-widest">
        <span>SEC-02</span>
        <span>— O QUE FORJAMOS</span>
        <span>[ CINCO FRENTES, UMA FORJA ]</span>
      </div>

      {/* Main Title & Description */}
      <div className="px-6 md:px-16 max-w-5xl mx-auto mb-16 text-center">
        <h3 className="text-3xl sm:text-5xl font-mono text-white font-bold mb-4 tracking-tight uppercase">
          Cinco frentes, uma forja.
        </h3>
        <p className="font-sans text-sm sm:text-base text-white/70 font-light leading-relaxed max-w-2xl mx-auto">
          Do rascunho em papel vegetal ao software encapsulado. Combinamos multidisciplinaridade técnica sob uma única visão agressiva de conversão. Cada serviço alimenta a chama da sua marca.
        </p>
      </div>

      {/* 2 & 3 Grid Matrix Edge-to-Edge with Hairline Borders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full border-y border-white/15">
        {services.map((s, idx) => (
          <div
            key={idx}
            className={`group relative flex flex-col justify-between p-8 sm:p-10 border-b border-white/15 ${
              (idx + 1) % 3 !== 0 ? 'lg:border-r border-white/15' : ''
            } hover:bg-white/[0.02] transition-colors`}
          >
            {/* Top Badge & Number */}
            <div className="flex justify-between items-center mb-6 font-mono text-xs">
              <span className="text-[#ff4f00] font-bold tracking-widest bg-[#ff4f00]/10 border border-[#ff4f00]/30 px-3 py-1 rounded-full uppercase">
                {s.num} // {s.badge}
              </span>
              <span className="text-white/30">[ FÁBRICA ]</span>
            </div>

            {/* Visual Dot Matrix Artwork */}
            <div className="relative w-full aspect-[16/9] bg-[#050505] border border-white/10 rounded-lg overflow-hidden my-4 flex items-center justify-center">
              <div className="w-full h-full flex items-center justify-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-black to-black opacity-80 group-hover:opacity-100 transition-opacity">
                <div className="font-mono text-[10px] sm:text-[11px] text-white/40 leading-none select-none overflow-hidden text-center p-2 group-hover:text-[#ff4f00] transition-colors whitespace-pre">
                  {s.visualType === 'vortex' && `
    . : + * # % @ % # * + : .
  : + * # % @ @ @ @ @ % # * + :
+ * # % @ @ @ @ @ @ @ @ @ % # * +
                  `}
                  {s.visualType === 'tower' && `
    [ 0 1 0 1 1 0 1 0 ]
  [ 1 1 1 1 1 1 1 1 1 1 ]
[ 0 0 0 0 1 1 1 1 0 0 0 0 ]
                  `}
                  {s.visualType === 'sphere' && `
      . - = + # + = - .
    - = + # % % % # + = -
  + # % % @ @ @ @ % % # +
                  `}
                  {s.visualType === 'matrix' && `
:: :: :: :: :: :: :: :: :: :: ::
+. +. +. +. +. +. +. +. +. +. +.
*# *# *# *# *# *# *# *# *# *# *#
                  `}
                  {s.visualType === 'tech' && `
< / >  A I  G A M E  I N T E R F A C E
[ 1 0 1 0 1 1 0 1 ]  -  T E C H  H O U S E
                  `}
                </div>
              </div>
            </div>

            {/* Title & Description */}
            <div className="pt-4 border-t border-white/10 mt-auto">
              <h4 className="font-mono font-bold text-xl text-white tracking-wide uppercase mb-3 group-hover:text-[#ff4f00] transition-colors">
                {s.title}
              </h4>
              <p className="font-sans text-xs sm:text-sm text-white/70 leading-relaxed font-light">
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA Banner */}
      <div className="w-full border-b border-white/15 bg-[#050505]/90 py-12 px-6 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-7xl mx-auto">
        <div>
          <span className="text-[#ff4f00] font-mono text-xs font-bold tracking-widest uppercase block mb-1">
            ESTÁ PRONTO?
          </span>
          <h3 className="text-2xl sm:text-3xl font-mono text-white font-bold uppercase tracking-tight">
            PRONTO PARA FORJAR?
          </h3>
        </div>

        <a
          href="#contact"
          className="bg-[#ff4f00] hover:bg-[#ff4f00]/90 text-black font-mono font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-full transition-all shadow-xl shadow-[#ff4f00]/20 flex items-center gap-3 shrink-0"
        >
          <span>Vamos conversar</span>
          <span className="text-lg">→</span>
        </a>
      </div>
    </section>
  );
}


