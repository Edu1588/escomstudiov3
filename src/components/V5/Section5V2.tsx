import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function Section5V2() {
  const { t } = useLanguage();

  const clients = [
    'PAIOÇA DO CABOCLO',
    'AZUL VEÍCULOS',
    'TELIC TECHNOLOGIES',
    'AUTOSIM',
    'UNION NETWORK',
    'FOGÃO MINEIRO',
    'PROCIVIL CONSTRUTORA',
    'SR. BRASERO CHURRASCO',
    'UNIMAIS VEÍCULOS',
    'GORRE',
    'NETCONFIG',
    'BRASIL VISA',
    'HIDROCAMP',
    'TGLOBAL NETWORKS',
    'COLÉGIO PITÁGORAS',
    'ESTOQUE & OFFICE',
    'RENATA FREITAS STUDIO',
  ];

  return (
    <section id="clients" className="relative py-24 z-10 bg-[#050505] border-t border-white/15 w-full overflow-hidden flex flex-col justify-center">
      {/* Dragonfly Header */}
      <div className="flex flex-col items-center justify-center text-center mb-8 px-4">
        <span className="text-[#ff4f00] font-mono text-3xl md:text-4xl font-bold tracking-widest mb-1">
          06
        </span>
        <h2 className="text-white font-mono text-2xl md:text-4xl font-bold tracking-[0.25em] uppercase">
          CLIENTES
        </h2>
      </div>

      {/* SEC Bar */}
      <div className="w-full border-y border-white/15 py-3 px-4 sm:px-8 mb-12 flex justify-between items-center font-mono text-xs text-white/40 tracking-widest">
        <span>SEC-06</span>
        <span>— MERCADOS EM QUE FORJAMOS</span>
        <span>[ MARCAS QUE CONFIAM ]</span>
      </div>

      {/* Headline */}
      <div className="px-6 md:px-16 max-w-4xl mx-auto mb-12 text-center">
        <h3 className="text-3xl sm:text-5xl font-mono text-white font-bold mb-4 tracking-tight uppercase">
          Marcas que confiam na nossa bigorna.
        </h3>
      </div>

      {/* Edge-to-Edge Grid Matrix of Clients */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 w-full border-y border-white/15">
        {clients.map((client, idx) => (
          <div
            key={idx}
            className="p-6 sm:p-8 border-b border-white/15 border-r border-white/15 hover:bg-white/[0.03] transition-colors flex items-center justify-center text-center group min-h-[100px]"
          >
            <span className="font-mono text-xs sm:text-sm text-white/70 group-hover:text-[#ff4f00] group-hover:font-bold transition-colors uppercase tracking-wider">
              {client}
            </span>
          </div>
        ))}
      </div>

      {/* Sub-ticker Faixa */}
      <div className="w-full border-b border-white/15 py-4 bg-[#ff4f00]/10 overflow-hidden relative mt-8">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-8 font-mono text-xs text-[#ff4f00] font-bold tracking-[0.2em] uppercase mx-4">
              <span>✦ DESIGN ASSINADO</span>
              <span>✦ ESTRUTURAS ROBUSTAS DE MARKETING</span>
              <span>✦ ENGENHARIA DE CÓDIGO RESISTENTE À ALTAS CORES DE TRÁFEGO</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


