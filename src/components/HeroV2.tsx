import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { TextEffect } from '@/components/ui/text-effect';
import CornerFrameScrambleText from '@/components/ui/corner-frame-scramble-text';
import { TextMarquee } from '@/components/ui/text-marquee';

export default function HeroV2() {
  const bgColor = '#111111';
  const currentYear = new Date().getFullYear();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrambleTrigger, setScrambleTrigger] = useState(0);

  // Loop para o efeito de scramble - incrementa para forçar o reinício
  useEffect(() => {
    const interval = setInterval(() => {
      setScrambleTrigger(prev => prev + 1);
    }, 5000); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = window.scrollY;
      const windowHeight = window.innerHeight || 1;
      
      let progress = totalScroll / windowHeight;
      
      if (!isFinite(progress)) {
        progress = 0;
      }

      if (progress > 1) progress = 1;
      if (progress < 0) progress = 0;
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTextVisible = (scrollProgress || 0) > 0.8;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <style>
        {`
          @keyframes scaleOuter { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
          @keyframes scaleInner { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
          .animate-scale-outer { animation: scaleOuter 3s ease-in-out infinite; }
          .animate-scale-inner { animation: scaleInner 3s ease-in-out infinite; animation-delay: 0.3s; }

          @keyframes glitch-anim {
            0% { transform: translate(0); clip-path: inset(40% 0 61% 0); }
            20% { transform: translate(-5px, 5px); clip-path: inset(92% 0 1% 0); }
            40% { transform: translate(-5px, -5px); clip-path: inset(43% 0 1% 0); }
            60% { transform: translate(5px, 5px); clip-path: inset(25% 0 58% 0); }
            80% { transform: translate(5px, -5px); clip-path: inset(54% 0 7% 0); }
            100% { transform: translate(0); clip-path: inset(58% 0 43% 0); }
          }

          .hero-glitch {
            position: relative;
            animation: glitch-anim 2s infinite linear alternate-reverse;
          }

          .text-gradient-custom {
            background: linear-gradient(to bottom, #00ff00 20%, #004d00 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          @keyframes float {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }
          .floating-rock {
            animation: float 6s ease-in-out infinite;
          }
        `}
      </style>
      
      <div className="w-full relative h-[250vh] bg-[#111111] font-rajdhani selection:bg-white selection:text-black">
        
        {/* =========================================
            BOTÕES FLUTUANTES FORAM MOVIDOS PARA BackToTop.tsx
            ========================================= */}
        <div className="sticky top-0 w-full h-screen overflow-hidden bg-black">
          
          {/* =========================================
              SECÇÃO 1 (HERO) - SEM GLOW VERDE
              ========================================= */}
          <div 
            className="absolute inset-0 w-full h-full flex bg-black"
            style={{
              opacity: Math.max(0, Math.min(1, 1 - (scrollProgress || 0) * 2)),
              filter: `blur(${(scrollProgress || 0) * 40}px) grayscale(${(scrollProgress || 0)})`,
              transform: `scale(${1 + (scrollProgress || 0) * 0.1})`,
              pointerEvents: (scrollProgress || 0) > 0.4 ? 'none' : 'auto',
              willChange: 'opacity, filter, transform'
            }}
          >
            <div className="flex-1 relative overflow-hidden flex flex-col justify-between p-8 md:p-12 xl:p-16 bg-black">
              
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center pointer-events-none select-none z-0">
                  <h1 className={`text-[28vw] xl:text-[26rem] font-black text-white tracking-tighter leading-none transform scale-y-[1.1] font-bebas ${(scrollProgress || 0) > 0.1 ? 'hero-glitch' : ''}`}>
                    ESCOM
                  </h1>
                </div>

                {/* Character Image - SEM GLOW */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[80%] md:h-[95%] w-full max-w-3xl z-[100] pointer-events-none flex items-end justify-center">
                  <img 
                    src="https://escom.eionstudio.com.br/wp-content/uploads/2026/04/robozito2.png" 
                    alt="ESCOM Robot" 
                    className="w-full h-full object-contain object-bottom" 
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Content Layer */}
                <div className="relative z-[150] flex flex-col h-full justify-between">
                  <div className="flex justify-between items-start w-full relative">
                    <div className="flex flex-col gap-12 relative">
                      <div className="space-y-1">
                        <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-medium font-rajdhani">Digital Studio</p>
                        <p className="text-[#00e300] text-[16px] uppercase tracking-widest font-bold leading-none font-rajdhani">HIGH-END WEB ENGINEERING</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-medium font-rajdhani">Performance & Data</p>
                        <p className="text-[#00e300] text-[20px] uppercase tracking-widest font-black max-w-[240px] leading-tight font-rajdhani">
                          SISTEMAS QUE <br/> TRABALHAM <br/> POR VOCÊ
                        </p>
                      </div>
                    </div>

                    <div className="absolute left-1/2 -translate-x-1/2 top-0 w-full text-center pointer-events-none hidden md:block">
                      <p className="text-white/20 text-[10px] font-bold tracking-[0.8em] uppercase font-rajdhani">
                        CODE . DESIGN . AUTOMATE . SCALE
                      </p>
                    </div>

                    <div className="absolute right-0 top-0 flex flex-col items-start text-left">
                      <div className="font-rajdhani">
                        <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-medium leading-snug">Global Soluções</p>
                        <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-medium leading-snug">Soluções Digitais Premium</p>
                      </div>
                      <div className="pointer-events-none select-none mix-blend-overlay font-rajdhani -mt-2">
                        <span className="text-[6rem] xl:text-[9rem] font-black tracking-tighter text-white/10 leading-none transform scale-y-[1.2] block origin-top-left">
                          {currentYear}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pulsing Circle - VERDE NEON */}
                  <div className="absolute right-4 md:right-16 top-[65%] md:top-[60%] -translate-y-1/2 w-72 h-72 md:w-96 md:h-96 pointer-events-none">
                    <div className="absolute inset-0 rounded-full border-[1.5px] border-white/5 animate-scale-outer" />
                    <div className="absolute inset-8 rounded-full border-[1.5px] border-white/5 animate-scale-inner" />
                    
                    <div className="absolute top-[10%] right-12 text-right font-rajdhani">
                      <p className="text-[#00e300] text-[20px] font-bold uppercase tracking-[0.1em] leading-[0.9] opacity-80">
                        ESTRATÉGIA <br/> DIGITAL {'{'}CORE{'}'}
                      </p>
                      <p className="text-[#00e300]/30 font-rajdhani text-[9px] uppercase tracking-widest mt-2">DEPLOY_VERSION_2.0</p>
                    </div>
                    
                    <div className="absolute bottom-[20%] left-10 font-rajdhani">
                      <CornerFrameScrambleText 
                        value="CORE_TRANSMISSION" 
                        as="p"
                        className="text-[#00e300] text-[10px] uppercase tracking-[0.4em] font-bold"
                        style={{ '--foreground': '#00e300' } as any}
                        trigger={scrambleTrigger}
                      />
                    </div>
                  </div>

                  <div className="w-full relative pr-24">
                    <div className="mb-2">
                      <TextMarquee
                        prefix={<span className="text-xs md:text-sm font-medium text-[#00e300] uppercase tracking-[0.2em] mr-2">SUA MARCA MAIS</span>}
                        height={40}
                        speed={1.0}
                        className="text-xs md:text-sm font-medium text-[#00e300] uppercase tracking-[0.2em] font-rajdhani"
                      >
                        <span>VISTA</span>
                        <span>REQUISITADA</span>
                        <span>VELOZ</span>
                        <span>PRESTIGIADA</span>
                        <span>IMPORTANTE</span>
                        <span>RESPEITADA</span>
                      </TextMarquee>
                    </div>
                    <div className="flex justify-between items-end w-full">
                      <p className="text-white/30 text-[11px] uppercase tracking-[0.3em] font-bold font-rajdhani">
                        ESCALE SEM LIMITES_
                      </p>
                      <button className="text-[#00e300] font-black uppercase tracking-[0.2em] text-xl hover:text-white transition-colors cursor-pointer mr-4 font-rajdhani underline decoration-[#00e300]/20 underline-offset-8">
                        EXPLORE_
                      </button>
                    </div>
                  </div>
                </div>
            </div>

            {/* Sidebar v2 */}
            <div className="w-24 bg-white hidden md:flex flex-col items-center py-12 relative z-[200]">
              <div className="absolute -left-[1.75rem] top-12 w-[3.5rem] h-[3.5rem] group cursor-pointer z-[210]">
                <div className="absolute inset-0 border-[2px] border-[#00e300] rounded-none bg-white transition-all group-hover:bg-[#00e300]"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 ">
                  <div className="w-6 h-[2px] bg-black group-hover:bg-white transition-colors"></div>
                  <div className="w-6 h-[2px] bg-black group-hover:bg-white transition-colors"></div>
                  <div className="w-6 h-[2px] bg-black group-hover:bg-white transition-colors"></div>
                </div>
              </div>

              <div className="flex-1 w-full flex items-center justify-center">
                 <p className="rotate-90 origin-center text-[10px] font-black tracking-[0.5em] text-black/10 uppercase mb-32 font-rajdhani">NAVIGATION_</p>
              </div>

              <nav className="flex flex-col gap-10 items-center w-full font-rajdhani shrink-0">
                {['INÍCIO', 'SOBRE', 'SERVIÇOS', 'CONTATO'].map((item, index) => (
                  <a key={index} href={item === 'SOBRE' ? '/sobre' : `#${item.toLowerCase()}`} className="group flex items-center justify-center  transition-all">
                    <span className="text-black/40 group-hover:text-[#00e300] text-[10px] uppercase tracking-[0.4em] font-black transition-colors" style={{ writingMode: 'vertical-rl' }}>{item}</span>
                  </a>
                ))}
              </nav>

              <div className="flex-1 w-full flex flex-col items-center justify-end pb-8">
                <button className="text-black/20 hover:text-red-500 transition-colors transform hover:scale-110">
                  <Heart size={20} fill="currentColor" />
                </button>
              </div>
            </div>
          </div>

          {/* =========================================
              SECÇÃO 2 (Manifesto) - CONTEÚDO COMPLETO
              ========================================= */}
          <div 
            className="absolute inset-0 w-full h-full flex items-center justify-center bg-black z-[250] overflow-hidden"
            style={{
              opacity: scrollProgress || 0,
              filter: `blur(${Math.max(0, (1 - (scrollProgress || 0)) * 40)}px)`,
              pointerEvents: (scrollProgress || 0) > 0.8 ? 'auto' : 'none',
              willChange: 'opacity, filter'
            }}
          >
            {/* BACKGROUND DEBRIS */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <div className="floating-rock absolute top-20 left-[10%] w-32 h-32 bg-white/5 rounded-none blur-[80px]" />
              <div className="floating-rock absolute bottom-40 right-[15%] w-48 h-48 bg-white/5 rounded-none blur-[100px]" style={{ animationDelay: '1s' }} />
              <div className="floating-rock absolute top-1/2 left-[5%] w-24 h-24 bg-white/5 rounded-none blur-xl" style={{ animationDelay: '2s' }} />
            </div>

            <div className="max-w-6xl mx-auto px-10 text-center relative z-10 space-y-12">
              <div className="space-y-4">
                <p className={`font-rajdhani text-[10px] uppercase tracking-[0.8em] text-[#00e300]/40 transition-all duration-1000 delay-100 ${isTextVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  MANIFESTO_DIGITAL
                </p>
                <div 
                  className={`font-rajdhani transition-all duration-1000 ease-out transform ${
                    isTextVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95'
                  }`}
                >
                  <div className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter text-gradient-custom mb-4 uppercase leading-[0.9]">
                    <TextEffect preset="blur" trigger={isTextVisible}>
                      Um site não deve ser apenas uma vitrine.
                    </TextEffect>
                  </div>
                  <span className="block text-3xl md:text-5xl lg:text-7xl font-black tracking-tighter text-white uppercase opacity-90 leading-[0.9]">
                    Deve funcionar como <br/> uma ferramenta.
                  </span>
                </div>
              </div>

              <div className={`mt-10 max-w-3xl mx-auto transition-all duration-1000 delay-300 ease-out transform ${isTextVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <p className="font-rajdhani text-sm md:text-lg font-light text-white/70 tracking-wide leading-relaxed">
                  Cada projeto é estruturado para operar como parte do negócio — 
                  combinando experiência, automação e inteligência de dados em um único 
                  sistema.
                </p>
                <div className="pt-8">
                  <button className="font-rajdhani font-bold text-[#00e300] text-xs tracking-[0.4em] uppercase hover:text-white transition-colors">
                    DESCUBRA A ENGENHARIA_ [+]
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
