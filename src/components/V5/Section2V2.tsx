import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../../contexts/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export default function Section2V2() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const ethosRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (textRef.current) {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 85%',
          },
        }
      );
    }

    if (ethosRef.current) {
      gsap.fromTo(
        ethosRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          delay: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ethosRef.current,
            start: 'top 85%',
          },
        }
      );
    }
  }, []);

  return (
    <section
      id="philosophy"
      ref={sectionRef}
      className="relative py-24 z-10 bg-[#050505] min-h-screen flex flex-col justify-center border-t border-white/15 w-full overflow-hidden"
    >
      {/* Header Indicator matching Dragonfly 01 ABOUT */}
      <div className="flex flex-col items-center justify-center text-center mb-8 px-4">
        <span className="text-[#ff4f00] font-mono text-3xl md:text-4xl font-bold tracking-widest mb-1">
          01
        </span>
        <h2 className="text-white font-mono text-2xl md:text-4xl font-bold tracking-[0.25em] uppercase">
          QUEM SOMOS
        </h2>
      </div>

      {/* Hairline Separator with SEC-01 label */}
      <div className="w-full border-y border-white/15 py-3 px-4 sm:px-8 mb-12 flex justify-between items-center font-mono text-xs text-white/40 tracking-widest">
        <span>SEC-01</span>
        <span>— NOSSO PROPÓSITO</span>
        <span>[ FÁBRICA PUBLICIDADE & DIGITAL ]</span>
      </div>

      <div className="w-full">
        {/* Purpose Headline Section */}
        <div className="px-6 md:px-16 max-w-6xl mx-auto mb-16">
          <p className="text-[#ff4f00] font-mono text-xs font-bold tracking-[0.3em] uppercase mb-4">
            — NOSSO PROPÓSITO
          </p>
          <h3
            ref={textRef}
            className="text-2xl sm:text-4xl md:text-5xl font-light text-white leading-[1.25] tracking-tight font-serif"
          >
            {t(
              'Fortalecer marcas, potencializar resultados, ser parceiro estratégico em cada etapa da jornada.',
              'Strengthen brands, maximize results, and act as a strategic partner across every stage of the journey.'
            )}
          </h3>
        </div>

        {/* Quem Somos Main Narrative & Quote */}
        <div className="border-t border-white/15 w-full bg-[#050505]">
          <div className="grid grid-cols-1 lg:grid-cols-12 w-full border-b border-white/15">
            {/* Left Narrative Box */}
            <div className="lg:col-span-7 p-6 sm:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-white/15">
              <span className="text-[#ff4f00] font-mono text-xs font-bold tracking-[0.25em] uppercase block mb-4">
                [ ONDE MARCAS GANHAM FORMA, FORÇA E PRESENÇA ]
              </span>
              <h4 className="text-xl sm:text-2xl md:text-3xl font-mono text-white font-bold mb-6 tracking-wide uppercase">
                Onde marcas ganham forma, força e presença.
              </h4>
              <p className="font-sans text-sm sm:text-base text-white/70 leading-relaxed font-light space-y-4">
                Somos a <strong className="text-white font-semibold">Fábrica Publicidade & Digital</strong>. Nós não apenas criamos marcas ou layouts; nós as forjamos em uma bigorna de pura estratégia criativa, design obsessivo e tecnologia modular. Retiramos as marcas do estado bruto de metal e as lapidamos até se tornarem ferramentas afiadas de altíssima conversão de vendas.
              </p>
            </div>

            {/* Right Quote Box */}
            <div className="lg:col-span-5 p-6 sm:p-12 lg:p-16 flex flex-col justify-between bg-white/[0.01]">
              <div ref={ethosRef} className="space-y-6">
                <div className="flex items-center gap-2 text-[#ff4f00] text-xs font-mono font-bold tracking-widest uppercase">
                  <span>TÊMPERA DA ESTRATÉGIA</span>
                  <span className="w-8 h-[1px] bg-[#ff4f00]" />
                </div>
                <blockquote className="font-serif italic text-base sm:text-lg text-white/90 leading-relaxed border-l-2 border-[#ff4f00] pl-4">
                  "O segredo de uma marca indestrutível é a têmpera de sua estratégia: resistir à pressão do mercado, reter a atenção do cliente e dominar os canais digitais com autoridade."
                </blockquote>
                <p className="font-mono text-xs text-white/50 tracking-widest uppercase text-right">
                  — Fábrica, Mestre de Forja
                </p>
              </div>
            </div>
          </div>

          {/* 2-Column Edge-to-Edge Grid for Philosophy & Innovation */}
          <div className="grid grid-cols-1 md:grid-cols-2 w-full">
            <div className="p-6 sm:p-10 border-b md:border-b-0 md:border-r border-white/15 hover:bg-white/[0.02] transition-colors">
              <span className="text-[#ff4f00] font-mono text-xs font-bold tracking-widest uppercase block mb-3">
                01. NOSSA FILOSOFIA
              </span>
              <p className="font-sans text-sm sm:text-base text-white/80 font-light leading-relaxed">
                Não produzimos clichês. Cada detalhe é desenhado sob medida para as dores do seu cliente.
              </p>
            </div>

            <div className="p-6 sm:p-10 hover:bg-white/[0.02] transition-colors">
              <span className="text-[#ff4f00] font-mono text-xs font-bold tracking-widest uppercase block mb-3">
                02. INOVAÇÃO DE IMPACTO
              </span>
              <p className="font-sans text-sm sm:text-base text-white/80 font-light leading-relaxed">
                Usamos tecnologia de ponta e análise de dados focado em aumentar retenção e ROI.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


