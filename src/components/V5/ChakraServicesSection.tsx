import React, { useState } from 'react';

interface ServiceItem {
  id: string;
  chakra: string;
  chakraName: string;
  title: string;
  description: string;
  tag: string;
  bars: number;
  color: string;
  glowColor: string;
  side: 'left' | 'right';
  topPercent: number; // Posição vertical relativa (0 a 100%)
}

const SERVICES: ServiceItem[] = [
  // LADO ESQUERDO
  {
    id: 'automacao-ia',
    chakra: 'Ajna',
    chakraName: 'Ajna // Visão & Decisão',
    title: 'Automação & Agentes IA 24/7',
    description: 'Atendimento no WhatsApp com qualificação por faturamento, respostas imediatas e agendamento comercial automático.',
    tag: 'PRODUÇÃO ATIVA',
    bars: 3,
    color: '#00d1ff',
    glowColor: 'rgba(0, 209, 255, 0.6)',
    side: 'left',
    topPercent: 20,
  },
  {
    id: 'carrosseis-ia',
    chakra: 'Anahata',
    chakraName: 'Anahata // Conexão & Ritmo',
    title: 'Carrosséis Automatizados',
    description: 'Geração instantânea de carrosséis para Instagram via API/FIPE, dados técnicos e design diagramado pronto para postar.',
    tag: 'ZERO RETRABALHO',
    bars: 3,
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.6)',
    side: 'left',
    topPercent: 44,
  },
  {
    id: 'landing-pages',
    chakra: 'Svadhisthana',
    chakraName: 'Svadhisthana // Criação & Fricção Zero',
    title: 'Landing Pages Automatizadas',
    description: 'Estruturas de conversão brutalista com LCP < 0.4s, Lighthouse 100, tracking GA4 e captura de leads sem atrito.',
    tag: 'CONVERSÃO +240%',
    bars: 3,
    color: '#f97316',
    glowColor: 'rgba(249, 115, 22, 0.6)',
    side: 'left',
    topPercent: 70,
  },

  // LADO DIREITO
  {
    id: 'sistemas-erp',
    chakra: 'Sahasrara',
    chakraName: 'Sahasrara // Soberania Central',
    title: 'Sistemas ERP Proprietários',
    description: 'Plataformas completas de gestão sob medida, controle de contratos, clientes e faturamento sem custos de SaaS mensal.',
    tag: 'SOBERANIA DIGITAL',
    bars: 3,
    color: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.6)',
    side: 'right',
    topPercent: 12,
  },
  {
    id: 'dashboards-roi',
    chakra: 'Vishuddha',
    chakraName: 'Vishuddha // Inteligência de Dados',
    title: 'Dashboards de ROI em Tempo Real',
    description: 'Visão executiva unificada conectando tráfego pago, faturamento, CAC, LTV e métricas de fechamento em um só painel.',
    tag: 'DADOS EM TEMPO REAL',
    bars: 3,
    color: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.6)',
    side: 'right',
    topPercent: 34,
  },
  {
    id: 'arquitetura-escalavel',
    chakra: 'Manipura',
    chakraName: 'Manipura // Potência & Código',
    title: 'Engenharia de Plataformas',
    description: 'Código puro em Next.js e React com microsserviços escaláveis, webhooks seguros e infraestrutura com 99.9% de uptime.',
    tag: 'DAILY DRIVER',
    bars: 3,
    color: '#eab308',
    glowColor: 'rgba(234, 179, 8, 0.6)',
    side: 'right',
    topPercent: 58,
  },
  {
    id: 'fundacao-web',
    chakra: 'Muladhara',
    chakraName: 'Muladhara // Base Blindada',
    title: 'Fundação & SEO Orgânico',
    description: 'Semântica avançada, acessibilidade, domínio do Google Meu Negócio e presença digital inabalável perante concorrentes.',
    tag: 'TOP 1 RANK',
    bars: 3,
    color: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.6)',
    side: 'right',
    topPercent: 82,
  },
];

export default function ChakraServicesSection() {
  const [activeService, setActiveService] = useState<string | null>(null);

  const leftServices = SERVICES.filter(s => s.side === 'left');
  const rightServices = SERVICES.filter(s => s.side === 'right');

  return (
    <section 
      id="servicos" 
      className="relative w-full min-h-screen bg-[#030306] text-white py-24 px-4 sm:px-6 lg:px-12 overflow-hidden border-t border-white/10 select-none"
      style={{ fontFamily: "'Space Mono', 'IBM Plex Mono', monospace" }}
    >
      {/* Background Cyber Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 40%, rgba(0, 209, 255, 0.12) 0%, transparent 70%),
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 36px 36px, 36px 36px',
        }}
      />

      {/* Section Header */}
      <div className="relative z-10 max-w-4xl mx-auto text-center mb-16 sm:mb-24">
        <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-[#00d1ff] bg-[#00d1ff]/10 border border-[#00d1ff]/30 px-3 py-1">
          ANATOMIA DE SISTEMAS // NADA É ORNAMENTAL
        </span>
        <h2 
          className="text-3xl sm:text-5xl md:text-6xl font-light uppercase tracking-tight text-white mt-5"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          Serviços &amp; Ecossistemas Digitais
        </h2>
        <p className="text-xs sm:text-sm text-stone-400 font-mono mt-4 max-w-xl mx-auto leading-relaxed">
          Automação com IA, geração de criativos, landing pages de alta conversão, ERPs proprietários e dashboards de ROI integrados em um organismo único.
        </p>
      </div>

      {/* Stage Layout: Left HUD Cards | Central Cybernetic Figure | Right HUD Cards */}
      <div className="relative max-w-7xl mx-auto min-h-[900px] flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-6">
        
        {/* LEFT COLUMN: 3 HUD Cards */}
        <div className="w-full lg:w-[35%] flex flex-col gap-6 z-20">
          {leftServices.map((service) => {
            const isHovered = activeService === service.id;
            return (
              <div
                key={service.id}
                onMouseEnter={() => setActiveService(service.id)}
                onMouseLeave={() => setActiveService(null)}
                className="group relative p-6 bg-[#07070b]/90 backdrop-blur-md border transition-all duration-300 cursor-default"
                style={{
                  borderColor: isHovered ? service.color : 'rgba(255, 255, 255, 0.1)',
                  boxShadow: isHovered ? `0 0 25px ${service.glowColor}` : 'none',
                  clipPath: 'polygon(0% 0%, calc(100% - 16px) 0%, 100% 16px, 100% 100%, 16px 100%, 0% calc(100% - 16px))',
                }}
              >
                {/* Horizontal Connector Line extending towards center */}
                <div 
                  className="hidden lg:block absolute top-1/2 -right-8 w-8 h-[2px] pointer-events-none transition-all duration-300"
                  style={{
                    backgroundColor: isHovered ? service.color : 'rgba(255, 255, 255, 0.2)',
                    boxShadow: isHovered ? `0 0 10px ${service.color}` : 'none'
                  }}
                />

                {/* Header Title with Custom Accent Color */}
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 
                    className="text-base sm:text-lg font-bold tracking-wide uppercase transition-colors"
                    style={{ color: isHovered ? service.color : '#ffffff' }}
                  >
                    {service.title}
                  </h3>
                  
                  {/* Glowing Target Reticle Icon */}
                  <div 
                    className="w-5 h-5 rounded-full border border-dashed flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:rotate-90"
                    style={{ borderColor: service.color }}
                  >
                    <div 
                      className="w-1.5 h-1.5 rounded-full" 
                      style={{ backgroundColor: service.color, boxShadow: `0 0 8px ${service.color}` }}
                    />
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-stone-300 font-sans leading-relaxed mb-4">
                  {service.description}
                </p>

                {/* Bottom Status & Bars */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[10px] font-mono">
                  <span className="tracking-widest uppercase font-bold" style={{ color: service.color }}>
                    {service.tag}
                  </span>

                  {/* 3 mini progress pills */}
                  <div className="flex items-center gap-1">
                    <span className="w-3.5 h-1 rounded-sm" style={{ backgroundColor: service.color }} />
                    <span className="w-3.5 h-1 rounded-sm" style={{ backgroundColor: service.color }} />
                    <span className="w-3.5 h-1 rounded-sm opacity-40" style={{ backgroundColor: service.color }} />
                  </div>
                </div>

                <div className="text-[9px] text-stone-500 font-mono uppercase tracking-widest mt-1">
                  {service.chakraName}
                </div>
              </div>
            );
          })}
        </div>

        {/* CENTER COLUMN: Cybernetic Human Torso Anatomy Model with Glowing Energy Chakras */}
        <div className="relative w-full lg:w-[30%] h-[600px] sm:h-[750px] lg:h-[880px] flex items-center justify-center z-10 pointer-events-none">
          {/* Cyber Human Body Silhouette Render */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Dark Studio Backlight */}
            <div className="absolute inset-0 bg-radial from-[#00d1ff]/10 via-transparent to-transparent opacity-50 blur-2xl" />

            {/* Futuristic Body Silhouette Image */}
            <img 
              src="https://res.cloudinary.com/ifuatk2z/image/upload/v1787785392/edufabrica.png" 
              alt="ESCOM Anatomia Cyber"
              className="w-[85%] h-[85%] object-contain filter grayscale contrast-125 brightness-40 opacity-70 drop-shadow-[0_0_30px_rgba(0,0,0,0.9)]"
            />

            {/* Vertical Spine Light Conduit */}
            <div className="absolute top-[12%] bottom-[12%] w-[2px] bg-gradient-to-b from-[#a855f7] via-[#00d1ff] to-[#ef4444] opacity-70 shadow-[0_0_12px_rgba(0,209,255,0.6)]" />

            {/* Pulsing Energy Nodes / Chakras aligned vertically on spine */}
            {SERVICES.map((item) => {
              const isItemActive = activeService === item.id;
              return (
                <div
                  key={`chakra-${item.id}`}
                  className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center transition-all duration-300"
                  style={{ top: `${item.topPercent}%` }}
                >
                  {/* Outer Concentric Energy Ring */}
                  <div 
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-dashed flex items-center justify-center transition-all duration-500 animate-spin"
                    style={{ 
                      borderColor: item.color,
                      opacity: isItemActive ? 1 : 0.4,
                      animationDuration: isItemActive ? '4s' : '12s'
                    }}
                  >
                    {/* Middle Glowing Aura */}
                    <div 
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full transition-all duration-300 flex items-center justify-center"
                      style={{
                        backgroundColor: `${item.color}25`,
                        boxShadow: `0 0 ${isItemActive ? '25px' : '12px'} ${item.color}`,
                      }}
                    >
                      {/* Bright Inner Core Center */}
                      <div 
                        className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white transition-all duration-300"
                        style={{
                          boxShadow: `0 0 10px #ffffff, 0 0 15px ${item.color}`,
                          transform: isItemActive ? 'scale(1.4)' : 'scale(1)',
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: 4 HUD Cards */}
        <div className="w-full lg:w-[35%] flex flex-col gap-6 z-20">
          {rightServices.map((service) => {
            const isHovered = activeService === service.id;
            return (
              <div
                key={service.id}
                onMouseEnter={() => setActiveService(service.id)}
                onMouseLeave={() => setActiveService(null)}
                className="group relative p-6 bg-[#07070b]/90 backdrop-blur-md border transition-all duration-300 cursor-default"
                style={{
                  borderColor: isHovered ? service.color : 'rgba(255, 255, 255, 0.1)',
                  boxShadow: isHovered ? `0 0 25px ${service.glowColor}` : 'none',
                  clipPath: 'polygon(16px 0%, 100% 0%, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0% 100%, 0% 16px)',
                }}
              >
                {/* Horizontal Connector Line extending towards center */}
                <div 
                  className="hidden lg:block absolute top-1/2 -left-8 w-8 h-[2px] pointer-events-none transition-all duration-300"
                  style={{
                    backgroundColor: isHovered ? service.color : 'rgba(255, 255, 255, 0.2)',
                    boxShadow: isHovered ? `0 0 10px ${service.color}` : 'none'
                  }}
                />

                {/* Header Title with Custom Accent Color */}
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 
                    className="text-base sm:text-lg font-bold tracking-wide uppercase transition-colors"
                    style={{ color: isHovered ? service.color : '#ffffff' }}
                  >
                    {service.title}
                  </h3>
                  
                  {/* Glowing Target Reticle Icon */}
                  <div 
                    className="w-5 h-5 rounded-full border border-dashed flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:rotate-90"
                    style={{ borderColor: service.color }}
                  >
                    <div 
                      className="w-1.5 h-1.5 rounded-full" 
                      style={{ backgroundColor: service.color, boxShadow: `0 0 8px ${service.color}` }}
                    />
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-stone-300 font-sans leading-relaxed mb-4">
                  {service.description}
                </p>

                {/* Bottom Status & Bars */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[10px] font-mono">
                  <span className="tracking-widest uppercase font-bold" style={{ color: service.color }}>
                    {service.tag}
                  </span>

                  {/* 3 mini progress pills */}
                  <div className="flex items-center gap-1">
                    <span className="w-3.5 h-1 rounded-sm" style={{ backgroundColor: service.color }} />
                    <span className="w-3.5 h-1 rounded-sm" style={{ backgroundColor: service.color }} />
                    <span className="w-3.5 h-1 rounded-sm opacity-40" style={{ backgroundColor: service.color }} />
                  </div>
                </div>

                <div className="text-[9px] text-stone-500 font-mono uppercase tracking-widest mt-1">
                  {service.chakraName}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Bottom CTA to start project */}
      <div className="relative z-20 mt-16 text-center">
        <a
          href="#contato"
          className="inline-flex items-center gap-3 px-8 py-3.5 border border-[#00d1ff] bg-[#00d1ff]/10 hover:bg-[#00d1ff] text-[#00d1ff] hover:text-black font-bold text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(0,209,255,0.2)]"
        >
          <span>SOLICITAR ENGENHARIA DE PROJETO</span>
          <span>↗</span>
        </a>
      </div>
    </section>
  );
}
