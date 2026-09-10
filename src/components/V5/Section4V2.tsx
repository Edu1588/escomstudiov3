import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function Section4V2() {
  const { t } = useLanguage();

  const metrics = [
    { value: '50+', labelPt: 'EMPRESAS ATENDIDAS', labelEn: 'COMPANIES SERVED' },
    { value: '50M+', labelPt: 'PESSOAS IMPACTADAS', labelEn: 'PEOPLE REACHED' },
    { value: 'R$ 10M+', labelPt: 'EM TRÁFEGO PAGO / ANO', labelEn: 'ANNUAL PAID TRAFFIC' },
    { value: '15K+', labelPt: 'ARTES & LAYOUTS FORJADOS', labelEn: 'DESIGNS & ASSETS CREATED' },
  ];

  return (
    <section id="metrics" className="relative py-24 z-10 bg-[#050505] min-h-screen border-t border-white/15 w-full overflow-hidden flex flex-col justify-center">
      {/* Dragonfly Header */}
      <div className="flex flex-col items-center justify-center text-center mb-8 px-4">
        <span className="text-[#ff4f00] font-mono text-3xl md:text-4xl font-bold tracking-widest mb-1">
          02
        </span>
        <h2 className="text-white font-mono text-2xl md:text-4xl font-bold tracking-[0.25em] uppercase">
          RESULTADOS
        </h2>
      </div>

      {/* Hairline SEC Bar */}
      <div className="w-full border-y border-white/15 py-3 px-4 sm:px-8 mb-12 flex justify-between items-center font-mono text-xs text-white/40 tracking-widest">
        <span>SEC-02</span>
        <span>— RESULTADOS QUE FORJAMOS</span>
        <span>[ PERFORMANCE & IMPACTO ]</span>
      </div>

      {/* 4-Column Edge-to-Edge Grid (0 Gap with Hairline Dividers) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full border-b border-white/15">
        {metrics.map((m, idx) => (
          <div 
            key={idx}
            className={`group p-8 sm:p-12 border-b sm:border-b-0 border-white/15 ${
              idx < metrics.length - 1 ? 'sm:border-r border-white/15' : ''
            } hover:bg-white/[0.02] transition-colors flex flex-col justify-between min-h-[220px]`}
          >
            <span className="font-mono text-xs text-[#ff4f00] font-bold tracking-widest">
              0{idx + 1} // METRIC
            </span>

            <div className="my-6">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold font-mono text-white group-hover:text-[#ff4f00] transition-colors tracking-tight">
                {m.value}
              </div>
            </div>

            <div className="text-xs font-mono text-white/60 group-hover:text-white uppercase tracking-wider font-semibold border-t border-white/10 pt-3">
              {t(m.labelPt, m.labelEn)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

