import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

function AnimatedWord({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span className={`${className} flex flex-nowrap`}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          className="block"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: i * 0.05, ease: [0.215, 0.61, 0.355, 1] }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}

const TRANSLATIONS = {
  PT: {
    word1: "imagine",
    word2: "seu",
    word3: "futuro",
    description: "criamos soluções digitais extraordinárias, conectando design moderno de ponta e tecnologia robusta para acelerar sua marca.",
    cta: "vamos conversar",
    nav: {
      inicio: "início",
      servicos: "serviços",
      planos: "planos",
      projetos: "projetos",
      contato: "contato"
    },
    stats: {
      brands: "marcas parceiras",
      projects: "projetos entregues",
      satisfaction: "de satisfação"
    }
  },
  EN: {
    word1: "imagine",
    word2: "your",
    word3: "future",
    description: "we create extraordinary digital solutions, connecting cutting-edge modern design and robust technology to accelerate your brand.",
    cta: "let's talk",
    nav: {
      inicio: "home",
      servicos: "services",
      planos: "plans",
      projetos: "projects",
      contato: "contact"
    },
    stats: {
      brands: "partner brands",
      projects: "delivered projects",
      satisfaction: "client satisfaction"
    }
  }
};

export default function EscomLanding() {
  const [lang, setLang] = useState('PT');
  const [activeModal, setActiveModal] = useState(null);
  const [copiedText, setCopiedText] = useState(false);
  const [hoveredWord, setHoveredWord] = useState(null);
  const [emailInput, setEmailInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const sectionRef = useRef(null);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          section.querySelectorAll('[data-parallax]').forEach(el => {
            const speed = parseFloat(el.getAttribute('data-parallax') || '0');
            el.style.transform = `translate3d(0, ${scrolled * speed}px, 0)`;
          });
          const fadeOverlay = document.getElementById('hero-fade-overlay');
          if (fadeOverlay) {
            const maxScroll = window.innerHeight * 0.8;
            const progress = Math.min(1, Math.max(0, scrolled / maxScroll));
            fadeOverlay.style.opacity = progress.toString();
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Readex+Pro:wght@300;400;500;600;700&display=swap';
    document.head.appendChild(link);

    const style = document.createElement('style');
    style.innerHTML = `
      #root {
        margin: 0;
        padding: 0;
        height: 100%;
      }
      body, html {
        margin: 0;
        padding: 0;
        background-color: #000000;
        color: #ffffff;
        font-family: 'Readex Pro', system-ui, -apple-system, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        overflow-x: clip;
      }
      .hero-title {
        letter-spacing: -0.04em;
        line-height: 0.95;
        text-shadow: 0 4px 12px rgba(0,0,0,0.5);
      }
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(255,255,255,0.02);
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(255,255,255,0.2);
        border-radius: 9999px;
      }
      
      @keyframes float1 {
        0%, 100% { transform: translate(-50%, -50%) translateY(0px) rotate(0deg); }
        50% { transform: translate(-50%, -50%) translateY(-15px) rotate(1deg); }
      }
      @keyframes float2 {
        0%, 100% { transform: translate(-50%, -50%) translateY(0px) rotate(0deg); }
        50% { transform: translate(-50%, -50%) translateY(-25px) rotate(-1deg); }
      }
      @keyframes floatTop {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }

      .animate-float-1 {
        animation: float1 7s ease-in-out infinite;
      }
      .animate-float-2 {
        animation: float2 9s ease-in-out infinite;
      }
      .animate-float-top {
        animation: floatTop 6s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-lang', lang);
  }, [lang]);

  const handleCopy = (text) => {
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = text;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    try {
      document.execCommand('copy');
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
    document.body.removeChild(tempTextArea);
  };

  const handleSubmitEmail = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmailInput('');
        setActiveModal(null);
      }, 2500);
    }
  };

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-black select-none">
      
      {}
      <img
        data-parallax="0.06"
        className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none z-0 scale-[1.12]"
        src="https://res.cloudinary.com/djw0tqmiw/image/upload/v1780418938/jciyygvvbgjb5otgwoys.png"
        alt="Static Background"
      />

      {/* Floating Center Visual elements (glowing rings/circles) - Z-INDEX 30 */}
      <div data-parallax="0.16" className="absolute inset-0 w-full h-full pointer-events-none z-30">
        <img 
          src="https://res.cloudinary.com/djw0tqmiw/image/upload/v1780418950/fu4xtoaqvpiao1fmpyuq.png"
          className="absolute top-1/2 left-1/2 max-w-[85vw] md:max-w-[48vw] h-auto object-contain pointer-events-none animate-float-1"
          alt="Floating Visual Element 1"
        />
      </div>
      <div data-parallax="0.22" className="absolute inset-0 w-full h-full pointer-events-none z-30">
        <img 
          src="https://res.cloudinary.com/djw0tqmiw/image/upload/v1780418951/bp7wdizjvdpklcx3jt6h.png"
          className="absolute top-1/2 left-1/2 max-w-[80vw] md:max-w-[42vw] h-auto object-contain pointer-events-none animate-float-2"
          alt="Floating Visual Element 2"
        />
      </div>

      {}
      <nav className="absolute z-50 px-6 md:px-10 pt-6 top-0 left-0 right-0 flex items-center justify-between gap-4">
        {/* Left Brand logo and name */}
        <div 
          onClick={() => setActiveModal('about')}
          className="flex items-center gap-3 bg-neutral-900/95 backdrop-blur rounded-full pl-4 pr-6 py-3 cursor-pointer hover:bg-neutral-800/95 transition-all duration-300 border border-white/10 shadow-lg group"
        >
          <div className="relative flex items-center justify-center w-5 h-5">
            <span className="absolute animate-ping inline-flex h-3 w-3 rounded-full bg-[#00d1ff] opacity-40"></span>
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-[#00d1ff] stroke-[2] transition-transform duration-500 group-hover:rotate-90">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 3v18M3 12h18" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-white text-sm font-normal tracking-tight">escom_studio</span>
        </div>

        {/* Central navigation pill */}
        <div className="hidden md:flex items-center gap-1 bg-neutral-900/95 backdrop-blur rounded-full px-3 py-2 border border-white/10 shadow-lg">
          {Object.keys(t.nav).map((key) => {
            const label = t.nav[key];
            return (
              <button
                key={key}
                onClick={() => setActiveModal(key === 'contato' || key === 'contato_en' ? 'get-started' : key)}
                className="text-neutral-300 hover:text-white transition-colors text-sm px-4 py-2 rounded-full hover:bg-white/5 capitalize"
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Right side actions and CTA */}
        <div className="flex items-center gap-4">
          {/* Language Switcher Component */}
          <div className="flex items-center gap-1.5 bg-neutral-900/95 backdrop-blur px-3 py-2.5 rounded-full border border-white/10 text-xs font-semibold">
            <button 
              onClick={() => setLang('PT')} 
              className={`transition-colors duration-200 ${lang === 'PT' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
            >
              PT
            </button>
            <span className="text-neutral-700">/</span>
            <button 
              onClick={() => setLang('EN')} 
              className={`transition-colors duration-200 ${lang === 'EN' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
            >
              EN
            </button>
          </div>

          <button
            onClick={() => setActiveModal('get-started')}
            className="bg-white text-black text-sm font-normal rounded-full px-6 py-3 hover:bg-neutral-200 transition-colors shadow-lg active:scale-95 whitespace-nowrap"
          >
            {t.cta}
          </button>
        </div>
      </nav>

      {}
      <div className="relative h-full w-full pointer-events-none">
        
        <h1 
          data-parallax="0.32"
          data-no-scramble
          onMouseEnter={() => setHoveredWord('protect')}
          onMouseLeave={() => setHoveredWord(null)}
          className={`hero-title absolute text-white font-medium text-[11vw] md:text-[13vw] left-4 md:left-10 top-[22%] select-none pointer-events-auto cursor-help transition-[opacity,filter] duration-300 z-20 ${hoveredWord && hoveredWord !== 'protect' ? 'opacity-30 scale-95 blur-[2px]' : 'opacity-100'}`}
        >
          <AnimatedWord text={t.word1} />
        </h1>

        {/* Word 2: "seu / your" -> Positioned on top of the robot/circles. (z-40) */}
        <h1 
          data-parallax="0.22"
          data-no-scramble
          onMouseEnter={() => setHoveredWord('your')}
          onMouseLeave={() => setHoveredWord(null)}
          className={`hero-title absolute text-white font-medium text-[11vw] md:text-[13vw] right-4 md:right-10 top-[38%] select-none pointer-events-auto cursor-help transition-[opacity,filter] duration-300 z-40 ${hoveredWord && hoveredWord !== 'your' ? 'opacity-30 scale-95 blur-[2px]' : 'opacity-100'}`}
        >
          <AnimatedWord text={t.word2} />
        </h1>

        {/* Word 3: "futuro / future" -> Positioned on top of the robot/circles. (z-40) */}
        <h1 
          data-parallax="0.28"
          data-no-scramble
          onMouseEnter={() => setHoveredWord('data')}
          onMouseLeave={() => setHoveredWord(null)}
          className={`hero-title absolute text-white font-medium text-[11vw] md:text-[13vw] left-[18%] md:left-[28%] top-[54%] select-none pointer-events-auto cursor-help transition-[opacity,filter] duration-300 z-40 ${hoveredWord && hoveredWord !== 'data' ? 'opacity-30 scale-95 blur-[2px]' : 'opacity-100'}`}
        >
          <AnimatedWord text={t.word3} />
        </h1>

        {/* 
          Description Paragraph with high z-index.
          This solves the exact overlap issue shown in image_3c02a5.png 
        */}
        <div data-parallax="0.2" className="absolute left-6 md:left-10 top-[46%] max-w-[280px] text-[15px] leading-snug text-white pointer-events-auto z-40">
          <p className="border-l border-white/60 pl-3 py-1">
            {t.description}
          </p>
        </div>

        {/* Stat Block - Top-Right */}
        <div 
          data-parallax="0.15"
          onClick={() => setActiveModal('stat-startups')}
          className="absolute right-6 md:right-24 top-[14%] pointer-events-auto cursor-pointer group bg-black/20 p-2 rounded-xl backdrop-blur-[2px] z-40"
        >
          <div className="flex items-center gap-3 justify-end">
            <span className="hidden md:block h-px w-24 bg-white/40 rotate-[20deg] origin-right transform transition-transform duration-300 group-hover:scale-x-110 group-hover:bg-white/80" />
            <span className="text-4xl md:text-5xl font-medium tracking-tight text-white group-hover:text-neutral-200 transition-colors">
              +120
            </span>
          </div>
          <p className="text-xs md:text-sm text-white/95 mt-1 text-right group-hover:text-white transition-colors">
            {t.stats.brands}
          </p>
        </div>

        {/* Stat Block - Bottom-Left */}
        <div 
          data-parallax="0.12"
          onClick={() => setActiveModal('stat-data')}
          className="absolute left-6 md:left-20 bottom-20 md:bottom-24 pointer-events-auto cursor-pointer group bg-black/20 p-2 rounded-xl backdrop-blur-[2px] z-40"
        >
          <div className="flex items-center gap-3">
            <span className="text-4xl md:text-5xl font-medium tracking-tight text-white group-hover:text-neutral-200 transition-colors">
              +350
            </span>
            <span className="hidden md:block h-px w-24 bg-white/40 rotate-[-20deg] origin-left transform transition-transform duration-300 group-hover:scale-x-110 group-hover:bg-white/80" />
          </div>
          <p className="text-xs md:text-sm text-white/95 mt-1 group-hover:text-white transition-colors">
            {t.stats.projects}
          </p>
        </div>

        {/* Stat Block - Bottom-Right */}
        <div 
          data-parallax="0.16"
          onClick={() => setActiveModal('stat-downloads')}
          className="absolute right-6 md:right-20 bottom-16 md:bottom-20 pointer-events-auto cursor-pointer group bg-black/20 p-2 rounded-xl backdrop-blur-[2px] z-40"
        >
          <div className="flex items-center gap-3 justify-end">
            <span className="hidden md:block h-px w-24 bg-white/40 rotate-[-20deg] origin-right transform transition-transform duration-300 group-hover:scale-x-110 group-hover:bg-white/80" />
            <span className="text-4xl md:text-5xl font-medium tracking-tight text-white group-hover:text-neutral-200 transition-colors">
              98.7%
            </span>
          </div>
          <p className="text-xs md:text-sm text-white/95 mt-1 text-right group-hover:text-white transition-colors">
            {t.stats.satisfaction}
          </p>
        </div>

      </div>

      {/* 
        This asset overlaps absolutely everything visual below it (including background images).
        Now elements like Navbar (z-50) and Hero Titles (z-40) stay on top of it.
      */}
      <div 
        data-parallax="0.48"
        className="absolute inset-0 w-full h-full z-30 pointer-events-none"
      >
        <div 
          className="absolute top-0 w-[100vw] md:w-[65vw]"
          style={{
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        >
          <img 
            src="https://res.cloudinary.com/djw0tqmiw/image/upload/v1780418939/e84odyan3ohg2t8646rg.png"
            className="w-full h-auto object-contain select-none animate-float-top origin-top"
            style={{
              maskImage: 'linear-gradient(to bottom, black 45%, transparent 90%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 45%, transparent 90%)'
            }}
            alt="Top Floating Asset Overlap"
          />
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-black z-20" />

      {}
      {activeModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-all duration-300">
          <div className="relative w-full max-w-lg bg-neutral-950 border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            
            {/* Modal Glow Accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#00d1ff] animate-pulse" />
                <span className="text-xs uppercase tracking-widest text-white/40 font-semibold">{activeModal} | escom_studio</span>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-full p-2 transition-all duration-200"
                aria-label="Close modal"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content Switch */}
            <div className="overflow-y-auto custom-scrollbar flex-1 pr-2 text-white">
              {activeModal === 'about' && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-medium tracking-tight">escom_studio</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed font-normal">
                    {lang === 'PT' 
                      ? 'somos uma potência criativa independente. unimos design sofisticado, estratégia de marca e engenharia de software para construir os produtos digitais mais cobiçados do mercado.'
                      : 'we are an independent creative powerhouse. we unite sophisticated design, brand strategy, and software engineering to build the most coveted digital products in the market.'}
                  </p>
                  <div className="p-4 bg-neutral-900/50 rounded-2xl border border-white/5 space-y-2">
                    <p className="text-xs text-neutral-400">⚡ {lang === 'PT' ? 'especialidades:' : 'specialties:'}</p>
                    <p className="text-xs text-white font-mono">• {lang === 'PT' ? 'design de produto & design system' : 'product design & design systems'}</p>
                    <p className="text-xs text-white font-mono">• {lang === 'PT' ? 'branding & identidade interativa' : 'branding & interactive identity'}</p>
                    <p className="text-xs text-white font-mono">• {lang === 'PT' ? 'web apps de ultra-performance' : 'high-performance web apps'}</p>
                  </div>
                </div>
              )}

              {activeModal === 'inicio' && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-medium tracking-tight capitalize">{lang === 'PT' ? 'bem-vindo' : 'welcome'}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed font-normal">
                    {lang === 'PT'
                      ? 'bem-vindo ao nosso espaço imersivo. desenvolvemos experiências web sem fricção focadas em alto desempenho, design impecável e fidelidade interativa máxima.'
                      : 'welcome to our immersive space. we develop frictionless web experiences focused on high performance, impeccable design, and absolute interactive fidelity.'}
                  </p>
                </div>
              )}

              {activeModal === 'servicos' && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-medium tracking-tight capitalize">{lang === 'PT' ? 'nossos serviços' : 'our services'}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed font-normal font-normal">
                    {lang === 'PT'
                      ? 'oferecemos escopos completos para elevar seu ecossistema digital ao nível das grandes marcas internacionais.'
                      : 'we offer comprehensive scopes to elevate your digital ecosystem to the standard of leading international brands.'}
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-2 justify-center">
                    <div className="p-3 bg-neutral-900/50 rounded-xl border border-white/5">
                      <p className="text-white text-xs font-medium mb-1">01 / design</p>
                      <p className="text-[11px] text-neutral-400">
                        {lang === 'PT' ? 'interfaces pixel-perfect e sistemas visuais escaláveis.' : 'pixel-perfect interfaces and scalable visual systems.'}
                      </p>
                    </div>
                    <div className="p-3 bg-neutral-900/50 rounded-xl border border-white/5">
                      <p className="text-white text-xs font-medium mb-1">02 / dev</p>
                      <p className="text-[11px] text-neutral-400 font-normal">
                        {lang === 'PT' ? 'animações fluidas, react, next.js e integrações de ponta.' : 'fluid animations, react, next.js, and cutting-edge integrations.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeModal === 'planos' && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-medium tracking-tight capitalize">{lang === 'PT' ? 'modelos de parceria' : 'partnership models'}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed font-normal">
                    {lang === 'PT'
                      ? 'estruturas de investimento adaptáveis para startups em crescimento e empresas consolidadas.'
                      : 'adaptable investment structures for fast-growing startups and established enterprises.'}
                  </p>
                  <div className="p-4 bg-neutral-900/50 rounded-2xl border border-white/5 space-y-3">
                    <div className="flex justify-between items-center text-xs text-neutral-400">
                      <span>{lang === 'PT' ? 'por escopo fixo' : 'by fixed scope'}</span>
                      <span className="text-white font-mono">on-demand</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-neutral-400">
                      <span>{lang === 'PT' ? 'squad mensal dedicado' : 'dedicated monthly squad'}</span>
                      <span className="text-white font-mono">retainer</span>
                    </div>
                  </div>
                </div>
              )}

              {activeModal === 'projetos' && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-medium tracking-tight capitalize">{lang === 'PT' ? 'cases recentes' : 'recent cases'}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed font-normal">
                    {lang === 'PT'
                      ? 'seleção de cases de sucesso desenvolvidos recentemente com tecnologias de última geração.'
                      : 'a handpicked selection of successful cases recently developed with next-generation technologies.'}
                  </p>
                  <div className="p-4 bg-neutral-900/50 rounded-2xl border border-white/5 space-y-2">
                    <p className="text-xs text-neutral-300 font-mono">🚀 aurum fintech app</p>
                    <p className="text-xs text-neutral-300 font-mono">🛡️ quantum cryptosystem website</p>
                    <p className="text-xs text-neutral-300 font-mono">🌐 lumina interactive design system</p>
                  </div>
                </div>
              )}

              {activeModal === 'get-started' && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-medium tracking-tight text-white">
                    {lang === 'PT' ? 'iniciar uma conversa' : 'start a conversation'}
                  </h3>
                  <p className="text-sm text-neutral-400 leading-relaxed font-normal">
                    {lang === 'PT'
                      ? 'entre em contato para receber nosso deck de cases e agendar um call de alinhamento estratégico.'
                      : 'get in touch to receive our case deck and schedule a strategic alignment call.'}
                  </p>
                  
                  {isSubmitted ? (
                    <div className="p-4 bg-[#00d1ff]/10 border border-[#00d1ff]/20 rounded-2xl text-center space-y-2 animate-pulse">
                      <p className="text-sm text-[#00d1ff] font-medium">
                        {lang === 'PT' ? '✓ contato solicitado com sucesso' : '✓ contact successfully requested'}
                      </p>
                      <p className="text-xs text-neutral-400">
                        {lang === 'PT' ? 'entraremos em contato nas próximas 2 horas.' : 'we will reach out to you within 2 hours.'}
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitEmail} className="space-y-3">
                      <input 
                        type="email"
                        required
                        placeholder={lang === 'PT' ? 'seu@email-corporativo.com' : 'your@corporate-email.com'}
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00d1ff]/30 transition-colors"
                      />
                      <button 
                        type="submit"
                        className="w-full bg-white hover:bg-neutral-200 text-black font-medium py-3 rounded-xl text-sm transition-colors"
                      >
                        {lang === 'PT' ? 'solicitar contato' : 'request contact'}
                      </button>
                    </form>
                  )}
                  <div className="pt-2">
                    <button 
                      onClick={() => handleCopy('contato@escom.studio')}
                      className="w-full flex items-center justify-between p-3 bg-neutral-900 hover:bg-neutral-850 rounded-xl border border-white/5 text-xs text-neutral-300 transition-colors group"
                    >
                      <span>contato@escom.studio</span>
                      <span className="text-[10px] bg-white/10 text-white px-2 py-1 rounded">
                        {copiedText ? (lang === 'PT' ? 'copiado!' : 'copied!') : (lang === 'PT' ? 'clique para copiar' : 'click to copy')}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Stats detailed modals */}
              {activeModal === 'stat-startups' && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-medium tracking-tight text-white">
                    +120 {lang === 'PT' ? 'marcas parceiras' : 'partner brands'}
                  </h3>
                  <p className="text-sm text-neutral-400 leading-relaxed font-normal">
                    {lang === 'PT'
                      ? 'ao longo de nossa trajetória, construímos relacionamentos sólidos com marcas líderes em tecnologia, fintechs e inovação no brasil e no exterior.'
                      : 'throughout our history, we have built solid relationships with leading brands in technology, fintechs, and innovation globally.'}
                  </p>
                </div>
              )}

              {activeModal === 'stat-data' && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-medium tracking-tight text-white">
                    +350 {lang === 'PT' ? 'projetos entregues' : 'delivered projects'}
                  </h3>
                  <p className="text-sm text-neutral-400 leading-relaxed font-normal">
                    {lang === 'PT'
                      ? 'de sites interativos premium a sistemas corporativos complexos, cada entrega representa nosso selo de qualidade absoluta.'
                      : 'from premium interactive sites to complex corporate systems, every delivery represents our absolute seal of quality.'}
                  </p>
                </div>
              )}

              {activeModal === 'stat-downloads' && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-medium tracking-tight text-white">
                    98.7% {lang === 'PT' ? 'de satisfação' : 'client satisfaction'}
                  </h3>
                  <p className="text-sm text-neutral-400 leading-relaxed font-normal">
                    {lang === 'PT'
                      ? 'nosso foco em qualidade extrema e suporte atencioso garante que quase a totalidade de nossos clientes retornem para novos projetos.'
                      : 'our focus on extreme quality and dedicated support ensures that almost all our clients return for future ventures.'}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer Brand Accent */}
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono">escom_studio // 2026</span>
              <button 
                onClick={() => setActiveModal(null)} 
                className="text-xs text-white hover:underline"
              >
                {lang === 'PT' ? 'fechar' : 'close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating help hint bottom center */}
      <div className="absolute bottom-10 left-0 right-0 z-20 flex items-center justify-center mx-auto w-fit bg-neutral-900/60 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/5 text-[11px] text-white/50">
        {lang === 'PT' 
          ? 'passe o mouse nas palavras ou clique nos números para explorar' 
          : 'hover over words or click numbers to explore'}
      </div>
      
      {/* Scroll Fade Overlay */}
      <div id="hero-fade-overlay" className="absolute inset-0 bg-black pointer-events-none z-[100]" style={{ opacity: 0, transition: 'opacity 0.1s ease-out' }} />

    </section>
  );
}
