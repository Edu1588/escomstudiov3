import React from 'react';

export default function TeamV2() {
  const team = [
    {
      name: 'HEFESTO SILVA',
      role: 'MESTRE DE FORJA & CEO',
      bio: 'Estrategista de marcas e posicionamento com mais de 12 anos moldando marcas de alto impacto.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    },
    {
      name: 'ISABELA MENDES',
      role: 'DIRETORA DE DESIGN & CRIAÇÃO',
      bio: 'Especialista em identidades visuais de alta gastronomia, automotivo e posicionamento de luxo.',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600',
    },
    {
      name: 'LUCAS CARVALHO',
      role: 'HEAD DE PERFORMANCE & DADOS',
      bio: 'Gestão de tráfego pago e automação de funis com mais de R$ 10M geridos em campanhas.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
    },
    {
      name: 'GABRIEL TORRES',
      role: 'TECH HOUSE LEAD & DEV',
      bio: 'Arquiteto de sistemas, 3D WebGL, inteligência artificial e ecossistemas web escaláveis.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
    },
  ];

  return (
    <section id="team" className="relative py-24 z-10 bg-[#050505] border-t border-white/15 w-full overflow-hidden flex flex-col justify-center">
      {/* Dragonfly Header matching 03 TEAM */}
      <div className="flex flex-col items-center justify-center text-center mb-8 px-4">
        <span className="text-[#ff4f00] font-mono text-3xl md:text-4xl font-bold tracking-widest mb-1">
          03
        </span>
        <h2 className="text-white font-mono text-2xl md:text-4xl font-bold tracking-[0.25em] uppercase">
          TIME
        </h2>
      </div>

      {/* Hairline SEC Bar */}
      <div className="w-full border-y border-white/15 py-3 px-4 sm:px-8 mb-12 flex justify-between items-center font-mono text-xs text-white/40 tracking-widest">
        <span>SEC-03</span>
        <span>— MESTRES DA FORJA</span>
        <span>[ LIDERANÇA & MENTES CRIATIVAS ]</span>
      </div>

      {/* Intro Text */}
      <div className="px-6 md:px-16 max-w-4xl mx-auto mb-16 text-center">
        <h3 className="text-3xl sm:text-5xl font-mono text-white font-bold mb-4 tracking-tight uppercase">
          Mentes focadas em execução cirúrgica.
        </h3>
        <p className="font-sans text-sm sm:text-base text-white/70 font-light leading-relaxed max-w-2xl mx-auto">
          Unimos estratégia, design obsessivo e engenharia técnica sob a liderança de especialistas seniores apaixonados pela perfeição de cada entrega.
        </p>
      </div>

      {/* 4-Column Edge-to-Edge Team Grid matching Dragonfly screenshot 5 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full border-y border-white/15">
        {team.map((m, idx) => (
          <div
            key={idx}
            className={`group relative p-6 sm:p-8 border-b sm:border-b-0 border-white/15 ${
              idx < team.length - 1 ? 'lg:border-r border-white/15' : ''
            } hover:bg-white/[0.02] transition-colors flex flex-col justify-between`}
          >
            {/* Top Info & Orange Crosshair */}
            <div className="flex justify-between items-center font-mono text-xs mb-4">
              <span className="text-[#ff4f00] font-bold tracking-widest">
                0{idx + 1} // MEMBER
              </span>
              <span className="text-[#ff4f00] text-sm font-bold">+</span>
            </div>

            {/* Portrait Card */}
            <div className="relative aspect-[3/4] w-full bg-neutral-900 overflow-hidden rounded-lg mb-6 border border-white/10 group-hover:border-[#ff4f00]/50 transition-all">
              <img
                src={m.avatar}
                alt={m.name}
                className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
            </div>

            {/* Name & Role */}
            <div className="mt-auto">
              <h4 className="font-mono font-bold text-lg text-white tracking-wider uppercase mb-1 group-hover:text-[#ff4f00] transition-colors">
                {m.name}
              </h4>
              <span className="text-[#ff4f00] font-mono text-xs font-semibold tracking-wider uppercase block mb-3">
                {m.role}
              </span>
              <p className="font-sans text-xs text-white/60 leading-relaxed font-light">
                {m.bio}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
