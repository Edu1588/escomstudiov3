import React from 'react';

export default function SpotlightV2() {
  const spotlightClients = [
    { name: 'AZUL VEÍCULOS', category: 'AUTOMOTIVE / PERFORMANCE', highlight: true },
    { name: 'PAIOÇA DO CABOCLO', category: 'GASTRONOMY / BRANDING', highlight: false },
    { name: 'TELIC TECHNOLOGIES', category: 'TECH / SOFTWARE', highlight: true },
    { name: 'AUTOAVALIAR', category: 'ECOSYSTEM / PLATFORM', highlight: false },
    { name: 'GORRE CLOTHING', category: 'FASHION / E-COMMERCE', highlight: true },
    { name: 'UNIMAIS VEÍCULOS', category: 'DEALERSHIP / DIGITAL', highlight: false },
  ];

  return (
    <section id="spotlight" className="relative py-20 z-10 bg-[#050505] border-t border-white/15 w-full overflow-hidden flex flex-col justify-center">
      {/* Header */}
      <div className="flex flex-col items-center justify-center text-center mb-8 px-4">
        <span className="text-[#ff4f00] font-mono text-3xl md:text-4xl font-bold tracking-widest mb-1">
          ✦
        </span>
        <h2 className="text-white font-mono text-2xl md:text-4xl font-bold tracking-[0.25em] uppercase">
          SPOTLIGHT
        </h2>
      </div>

      {/* Hairline SEC Bar */}
      <div className="w-full border-y border-white/15 py-3 px-4 sm:px-8 mb-8 flex justify-between items-center font-mono text-xs text-white/40 tracking-widest">
        <span>SPOTLIGHT</span>
        <span>— CLIENTES EM FOCO</span>
        <span>[ IMPACTO & ESCALA ]</span>
      </div>

      {/* Stacked Full-Width Typography Bands matching Dragonfly screenshot 7 */}
      <div className="w-full flex flex-col border-b border-white/15 select-none">
        {spotlightClients.map((item, idx) => (
          <div
            key={idx}
            className={`w-full py-8 sm:py-12 px-6 sm:px-12 border-t border-white/15 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-pointer ${
              item.highlight
                ? 'bg-[#ff4f00] text-black hover:bg-white hover:text-black'
                : 'bg-[#050505] text-white hover:bg-[#ff4f00] hover:text-black'
            }`}
          >
            <h3 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-mono tracking-tighter uppercase leading-none transition-transform group-hover:translate-x-3 duration-300">
              {item.name}
            </h3>

            <div className="flex items-center gap-4 font-mono text-xs sm:text-sm font-bold tracking-widest uppercase opacity-80 shrink-0">
              <span>{item.category}</span>
              <span className="text-lg">→</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
