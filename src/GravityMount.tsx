import { StrictMode, useRef, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Gravity, MatterBody, GravityRef } from "./components/ui/gravity";
import { TiltCard } from "./components/TiltCard";
import BackToTop from "./components/BackToTop";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import AnimatedZap from "./components/AnimatedZap";
import AnimatedLock from "./components/AnimatedLock";
import AnimatedGraph from "./components/AnimatedGraph";
import studio from "@theatre/studio";
import "./index.css";

import { Component as GradientBarsBackground } from "./components/ui/gradient-bars-background";

studio.initialize();
studio.ui.hide();

function useLanguage() {
  const [lang, setLang] = useState("pt");
  useEffect(() => {
    const handleLangChange = (e: any) => {
      setLang(e.detail);
    };
    window.addEventListener("languageChanged", handleLangChange);
    return () => window.removeEventListener("languageChanged", handleLangChange);
  }, []);
  return lang;
}

function useI18n(key: string, fallback: string) {
  const lang = useLanguage();
  const i18nObj = (window as any).i18n;
  if (!i18nObj) return fallback;
  return i18nObj[lang]?.[key] || fallback;
}

const ProjectModal = ({ project, onClose }: { project: PortfolioProject | null; onClose: () => void }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  if (!project) return null;

  return (
    <AnimatePresence>
      {project && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            if (isZoomed) setIsZoomed(false);
            else onClose();
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4 md:p-8 cursor-pointer"
          style={{ backdropFilter: 'blur(12px)' }}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className={`bg-[#0a0a0a] border border-white/10 w-full ${isZoomed ? 'max-w-none h-full md:h-[95vh]' : 'max-w-4xl max-h-[90vh] md:max-h-[80vh]'} rounded-2xl overflow-hidden cursor-default relative flex flex-col transition-all duration-500 ease-[0.33, 1, 0.68, 1]`}
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-[100] bg-black/50 backdrop-blur-md hover:bg-white/10 w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors border border-white/10"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <div className={`flex flex-col ${isZoomed ? '' : 'md:flex-row'} h-full overflow-hidden`}>
              {/* Image Section */}
              <div 
                onClick={() => setIsZoomed(!isZoomed)}
                className={`${isZoomed ? 'w-full h-full' : 'w-full md:w-1/2 h-[350px] md:h-auto'} bg-black relative overflow-hidden group cursor-zoom-in flex items-center justify-center`}
              >
                <motion.img 
                  layout
                  src={project.image} 
                  alt={project.name}
                  className={`w-full h-full ${isZoomed ? 'object-contain' : 'object-cover'} transition-all duration-700 ease-[0.33, 1, 0.68, 1] group-hover:scale-[1.02]`}
                />
                {!isZoomed && (
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="bg-white/20 backdrop-blur-xl text-white px-4 py-2 rounded-full text-xs font-mono tracking-widest border border-white/20">CLIQUE PARA AMPLIAR</span>
                  </div>
                )}
                {!isZoomed && <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>}
              </div>

              {/* Info Section */}
              {!isZoomed && (
                <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto flex flex-col custom-scrollbar">
                  <div className="system-tag mb-5 inline-flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                      <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                      <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                    </div>
                    <span className="text-[10px] font-mono opacity-50 tracking-widest uppercase">PROJ_ID: {project.id?.slice(0, 8)}</span>
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tighter uppercase font-sans">
                    {project.name}
                  </h3>
                  
                  <div className="flex items-center gap-3 mb-6">
                    <p className="text-[#2EFF00] font-mono text-[10px] tracking-widest uppercase border border-[#2EFF00]/30 px-2 py-0.5 rounded">
                      {project.category}
                    </p>
                    <span className="text-white/20 text-[10px] font-mono">/</span>
                    <span className="text-white/40 text-[10px] font-mono uppercase">Performance {project.score}</span>
                  </div>

                  <p className="text-gray-400 text-base leading-relaxed mb-8 font-sans">
                    {project.desc}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col gap-1">
                        <span className="text-gray-500 text-[9px] uppercase font-mono tracking-widest">Score</span>
                        <span className="text-xl font-bold text-white font-mono">{project.score}</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col gap-1">
                        <span className="text-gray-500 text-[9px] uppercase font-mono tracking-widest">Status</span>
                        <span className="text-[#2EFF00] text-[10px] font-mono uppercase tracking-widest">Live</span>
                    </div>
                  </div>

                  <a 
                    href={`/portfolio-projetos/${project.id}`}
                    className="mt-auto group relative overflow-hidden bg-white text-black font-bold py-4 px-6 rounded-xl text-center transition-all duration-300 tracking-tighter hover:bg-[#2EFF00] active:scale-95 text-sm"
                  >
                    <span className="relative z-10">VER ESTUDO DE CASO</span>
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ScrambleTag = ({ text }: { text: string }) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const originalText = useRef(text);
  const isAnimating = useRef(false);

  const handleHover = () => {
    if (isAnimating.current || !textRef.current) return;
    isAnimating.current = true;
    let step = 0;
    const steps = 15;
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    
    const interval = setInterval(() => {
      let scrambled = '';
      for (let i = 0; i < originalText.current.length; i++) {
        if (originalText.current[i] === ' ') {
          scrambled += ' ';
        } else {
          scrambled += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      if (textRef.current) textRef.current.innerText = scrambled;
      step++;
      if (step > steps) { 
        clearInterval(interval); 
        if(textRef.current) textRef.current.innerText = originalText.current; 
        isAnimating.current = false; 
      }
    }, 50);
  };

  return (
    <div className="system-tag" onMouseEnter={handleHover}>
      <span className="arrow">&gt;_</span> <span className="dot">●</span> <span ref={textRef}>{text}</span>
    </div>
  );
};

function ServicosCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  
  const servicosTitle = useI18n('nav_servicos', 'O que fazemos');
  const servicosSub = useI18n('servicos_sub', 'Design com propósito comercial e infraestrutura tecnológica integrada para máxima performance.');

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (titleRef.current && (window as any).TextRotateEntrance && !isMobile) {
      titleRef.current.classList.remove('text-rotate-wrap', 'in-view');
      new (window as any).TextRotateEntrance(titleRef.current);
      setTimeout(() => titleRef.current?.classList.add('in-view'), 50);
    }
    if (descRef.current && (window as any).TextRotateEntrance && !isMobile) {
      descRef.current.classList.remove('text-rotate-wrap', 'in-view');
      new (window as any).TextRotateEntrance(descRef.current);
      setTimeout(() => descRef.current?.classList.add('in-view'), 50);
    }
  }, [isMobile, servicosTitle, servicosSub]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Header animation
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [1, 1, 0, 0]);
  
  // Card 1: 
  // Rise (0 -> 0.2)
  // Shift left (0.4 -> 0.6)
  const c1y = useTransform(scrollYProgress, [0, 0.15], [600, 0]);
  const c1opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const c1x = useTransform(scrollYProgress, [0.4, 0.6], ["0%", "-105%"]);
  
  // Card 2:
  // Rise center (0.4 -> 0.6)
  const c2y = useTransform(scrollYProgress, [0.4, 0.55], [600, 0]);
  const c2opacity = useTransform(scrollYProgress, [0.4, 0.5], [0, 1]);
  
  // Card 3:
  // Rise right (0.7 -> 0.85)
  const c3y = useTransform(scrollYProgress, [0.7, 0.85], [600, 0]);
  const c3opacity = useTransform(scrollYProgress, [0.7, 0.8], [0, 1]);
  const c3x = "105%";

  const cardData = [
    {
      id: "SVC_01",
      title: useI18n('svc_01_tit', "Infraestrutura Inteligente"),
      desc: useI18n('svc_01_desc', "Cada projeto é desenvolvido com uma base inteligente que centraliza funções essenciais dentro do próprio site. Menos dependência, mais controle total do seu ecossistema."),
      icon: <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
    },
    {
      id: "SVC_02",
      title: useI18n('svc_02_tit', "Menos ferramentas. Mais eficiência."),
      desc: useI18n('svc_02_desc', "Ao integrar funcionalidades diretamente no projeto, reduzimos significativamente custos recorrentes com plataformas externas."),
      icon: <svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
    },
    {
      id: "SVC_03",
      title: useI18n('svc_03_tit', "Centralização total"),
      desc: useI18n('svc_03_desc', "A centralização melhora a performance e facilita a gestão do seu negócio, em um único ambiente coeso e escalável."),
      icon: <svg viewBox="0 0 24 24"><path d="M12 7v6m-6 4v-4h12v4"/></svg>
    }
  ];

  const TechCard = ({ data, style, className = "" }: { data: any; style: any; className?: string; key?: string }) => {
    return (
      <motion.div 
        style={isMobile ? {} : style}
        className={`${isMobile ? "relative" : "absolute"} w-full md:w-[450px] h-auto pointer-events-auto ${className}`}
      >
        <div className="card-item bg-white flex flex-col h-auto md:h-[380px]" style={{ borderLeft: "1px solid rgba(0,0,0,0.1)", borderTop: "1px solid rgba(0,0,0,0.1)", padding: isMobile ? "2rem" : "3rem" }}>
          <div className="card-header"><span>{data.id}</span><div className="line"></div></div>
          <div className="card-icon">{data.icon}</div>
          <h3 className="card-title">{data.title}</h3>
          <p className="card-desc mb-auto">{data.desc}</p>
        </div>
      </motion.div>
    );
  };

  if (isMobile) {
    return (
      <div className="w-full bg-white" style={{ padding: "5rem 2rem" }} id="servicos-mobile">
        <div className="mb-12">
          <ScrambleTag text="[ NOSSOS_SERVIÇOS ]" />
          <h2 className="section-title" style={{ color: "#000", marginTop: "1rem" }}>{servicosTitle}</h2>
          <p className="manifesto-text" style={{ color: "#333", marginTop: "1rem" }}>{servicosSub}</p>
        </div>
        <div className="flex flex-col gap-8">
          {cardData.map(card => (
            <div key={card.id} className="card-item bg-white flex flex-col h-auto md:h-[380px]" style={{ border: "1px solid rgba(0,0,0,0.1)", padding: "2rem" }}>
              <div className="card-header"><span>{card.id}</span><div className="line"></div></div>
              <div className="card-icon">{card.icon}</div>
              <h3 className="card-title">{card.title}</h3>
              <p className="card-desc mb-0">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative h-[450vh] w-full bg-white">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden pointer-events-none">
        
        {/* Sticky Header */}
        <motion.div 
          style={{ opacity: headerOpacity, width: "100%", maxWidth: "1600px", margin: "0 auto", padding: "0 4rem", alignItems: "flex-end" }}
          className="split-layout"
        >
          <div className="split-left pointer-events-auto">
            <ScrambleTag text="[ NOSSOS_SERVIÇOS ]" />
            <h2 ref={titleRef} className="section-title animate-text-rotate m-0" style={{ color: "#000", marginTop: "1rem", marginBottom: 0 }}>{servicosTitle}</h2>
          </div>
          <div className="split-right flex items-end justify-start" style={{ paddingBottom: "0.5rem" }}>
             <p ref={descRef} className="manifesto-text animate-text-rotate" style={{ marginTop: 0, marginBottom: 0 }}>{servicosSub}</p>
          </div>
        </motion.div>

        {/* Card Container Area */}
        <div className="relative w-full h-[500px] flex items-center justify-center pointer-events-none">
            <TechCard 
              data={cardData[0]} 
              style={{ x: c1x, y: c1y, opacity: c1opacity, zIndex: 30 }} 
            />
            <TechCard 
              data={cardData[1]} 
              style={{ x: "0%", y: c2y, opacity: c2opacity, zIndex: 20 }} 
            />
            <TechCard 
              data={cardData[2]} 
              style={{ x: c3x, y: c3y, opacity: c3opacity, zIndex: 10 }} 
            />
        </div>

      </div>
    </div>
  );
}

function ValorCards() {
  return (
    <div className="cards-grid">
      <TiltCard className="card-item h-[380px] flex flex-col">
        <div className="card-header" style={{ marginBottom: "2rem" }}>
          <span>P/01</span>
          <div style={{ width: 32, height: 32 }}>
            <AnimatedZap size={32} />
          </div>
        </div>
        <h3 className="card-title" data-i18n="val_01_tit">Velocidade</h3>
        <p className="card-desc mb-auto" data-i18n="val_01_desc">Carregamento instantâneo sem scripts de terceiros pesados.</p>
      </TiltCard>
      
      <TiltCard className="card-item h-[380px] flex flex-col">
        <div className="card-header" style={{ marginBottom: "2rem" }}>
          <span>P/02</span>
          <div style={{ width: 32, height: 32 }}>
            <AnimatedLock size={32} />
          </div>
        </div>
        <h3 className="card-title" data-i18n="val_02_tit">Controle</h3>
        <p className="card-desc mb-auto" data-i18n="val_02_desc">Os dados do cliente são próprios, sem depender de APIs externas para o básico.</p>
      </TiltCard>

      <TiltCard className="card-item h-[380px] flex flex-col">
        <div className="card-header" style={{ marginBottom: "2rem" }}>
          <span>P/03</span>
          <div style={{ width: 32, height: 32 }}>
            <AnimatedGraph size={32} />
          </div>
        </div>
        <h3 className="card-title" data-i18n="val_03_tit">Escala</h3>
        <p className="card-desc mb-auto" data-i18n="val_03_desc">Infraestrutura pronta para crescer conforme o tráfego aumenta.</p>
      </TiltCard>
    </div>
  );
}

function GravityDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gravityRef = useRef<GravityRef>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          gravityRef.current?.start();
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full flex flex-col relative z-10 pt-48 pb-0" style={{ fontFamily: "var(--font-sans)", backgroundColor: "var(--black)" }}>
      <div className="text-4xl sm:text-5xl md:text-6xl text-white w-full text-center z-20 relative pointer-events-none" style={{ fontWeight: 700, letterSpacing: "-2px" }} data-i18n="tools_tit">
        Nossas Ferramentas
      </div>
      <p className="pt-4 text-base sm:text-lg text-gray-400 w-full text-center z-20 relative pointer-events-none mb-12" style={{ fontFamily: "var(--font-mono)", letterSpacing: "2px", textTransform: "uppercase" }} data-i18n="tools_sub">
        O QUE USAMOS PARA CONSTRUIR O SEU SISTEMA
      </p>
      <div className="w-full relative mt-4 h-[400px] sm:h-[450px] overflow-hidden">
        <Gravity ref={gravityRef} autoStart={false} gravity={{ x: 0, y: 1 }} className="w-full h-full">
          <MatterBody matterBodyOptions={{ friction: 0.5, restitution: 0.2 }} x="10%" y="10%" angle={5}>
            <div className="text-xl sm:text-2xl md:text-3xl bg-[#080808] text-[#2EFF00] border border-[#2EFF00] rounded-full hover:cursor-grab px-12 py-6 font-mono">
              react
            </div>
          </MatterBody>
          <MatterBody matterBodyOptions={{ friction: 0.5, restitution: 0.2 }} x="35%" y="15%" angle={-3}>
            <div className="text-xl sm:text-2xl md:text-3xl bg-[#080808] text-white border border-[#333] rounded-full hover:cursor-grab px-12 py-6">
              typescript
            </div>
          </MatterBody>
          <MatterBody matterBodyOptions={{ friction: 0.5, restitution: 0.2 }} x="45%" y="5%" angle={10}>
            <div className="text-xl sm:text-2xl md:text-3xl bg-[#080808] text-white border border-[#333] rounded-full hover:cursor-grab px-12 py-6">
              node.js
            </div>
          </MatterBody>
          <MatterBody matterBodyOptions={{ friction: 0.5, restitution: 0.2 }} x="20%" y="20%" angle={-5}>
            <div className="text-xl sm:text-2xl md:text-3xl bg-[#080808] text-white border border-[#333] rounded-full hover:cursor-grab px-12 py-6">
              tailwind
            </div>
          </MatterBody>
          <MatterBody matterBodyOptions={{ friction: 0.5, restitution: 0.2 }} x="75%" y="5%" angle={5}>
            <div className="text-xl sm:text-2xl md:text-3xl bg-[#080808] text-[#2EFF00] border border-[#2EFF00] rounded-full hover:cursor-grab px-12 py-6 font-mono">
              infrastructure
            </div>
          </MatterBody>
          <MatterBody matterBodyOptions={{ friction: 0.5, restitution: 0.2 }} x="55%" y="10%" angle={-2}>
             <div className="text-xl sm:text-2xl md:text-3xl bg-[#080808] text-white border border-[#333] rounded-full hover:cursor-grab px-12 py-6">
              automation
            </div>
          </MatterBody>
          <MatterBody matterBodyOptions={{ friction: 0.5, restitution: 0.2 }} x="15%" y="5%" angle={8}>
            <div className="text-xl sm:text-2xl md:text-3xl bg-[#080808] text-white border border-[#333] rounded-full hover:cursor-grab px-12 py-6">
              artificial intelligence
            </div>
          </MatterBody>
          <MatterBody matterBodyOptions={{ friction: 0.5, restitution: 0.2 }} x="80%" y="15%" angle={-4}>
            <div className="text-xl sm:text-2xl md:text-3xl bg-[#080808] text-[#2EFF00] border border-[#2EFF00] rounded-full hover:cursor-grab px-12 py-6 font-mono">
              data analytics
            </div>
          </MatterBody>
          <MatterBody matterBodyOptions={{ friction: 0.5, restitution: 0.2 }} x="25%" y="10%" angle={2}>
            <div className="text-xl sm:text-2xl md:text-3xl bg-[#080808] text-white border border-[#333] rounded-full hover:cursor-grab px-12 py-6">
              ui/ux design
            </div>
          </MatterBody>
          <MatterBody matterBodyOptions={{ friction: 0.5, restitution: 0.2 }} x="65%" y="10%" angle={-8}>
            <div className="text-xl sm:text-2xl md:text-3xl bg-[#080808] text-[#2EFF00] border border-[#2EFF00] rounded-full hover:cursor-grab px-12 py-6 font-mono">
              conversion api
            </div>
          </MatterBody>
          <MatterBody matterBodyOptions={{ friction: 0.5, restitution: 0.2 }} x="50%" y="15%" angle={5}>
            <div className="text-xl sm:text-2xl md:text-3xl bg-[#080808] text-white border border-[#333] rounded-full hover:cursor-grab px-12 py-6">
              next.js
            </div>
          </MatterBody>
          <MatterBody matterBodyOptions={{ friction: 0.5, restitution: 0.2 }} x="85%" y="5%" angle={-6}>
            <div className="text-xl sm:text-2xl md:text-3xl bg-[#080808] text-white border border-[#333] rounded-full hover:cursor-grab px-12 py-6">
              python
            </div>
          </MatterBody>
          <MatterBody matterBodyOptions={{ friction: 0.5, restitution: 0.2 }} x="40%" y="20%" angle={4}>
            <div className="text-xl sm:text-2xl md:text-3xl bg-[#080808] text-white border border-[#333] rounded-full hover:cursor-grab px-12 py-6">
              aws
            </div>
          </MatterBody>
          <MatterBody matterBodyOptions={{ friction: 0.5, restitution: 0.2 }} x="60%" y="20%" angle={-3}>
            <div className="text-xl sm:text-2xl md:text-3xl bg-[#080808] text-[#2EFF00] border border-[#2EFF00] rounded-full hover:cursor-grab px-12 py-6 font-mono">
              firebase
            </div>
          </MatterBody>
          <MatterBody matterBodyOptions={{ friction: 0.5, restitution: 0.2 }} x="30%" y="5%" angle={7}>
            <div className="text-xl sm:text-2xl md:text-3xl bg-[#080808] text-white border border-[#333] rounded-full hover:cursor-grab px-12 py-6">
              crm integration
            </div>
          </MatterBody>
          <MatterBody matterBodyOptions={{ friction: 0.5, restitution: 0.2 }} x="70%" y="15%" angle={-5}>
            <div className="text-xl sm:text-2xl md:text-3xl bg-[#080808] text-white border border-[#333] rounded-full hover:cursor-grab px-12 py-6">
              landing pages
            </div>
          </MatterBody>
          <MatterBody matterBodyOptions={{ friction: 0.5, restitution: 0.2 }} x="90%" y="10%" angle={3}>
            <div className="text-xl sm:text-2xl md:text-3xl bg-[#080808] text-[#2EFF00] border border-[#2EFF00] rounded-full hover:cursor-grab px-12 py-6 font-mono">
              copywriting
            </div>
          </MatterBody>
          <MatterBody matterBodyOptions={{ friction: 0.5, restitution: 0.2 }} x="5%" y="15%" angle={-7}>
            <div className="text-xl sm:text-2xl md:text-3xl bg-[#080808] text-white border border-[#333] rounded-full hover:cursor-grab px-12 py-6">
              seo
            </div>
          </MatterBody>
          <MatterBody matterBodyOptions={{ friction: 0.5, restitution: 0.2 }} x="45%" y="25%" angle={6}>
            <div className="text-xl sm:text-2xl md:text-3xl bg-[#080808] text-[#2EFF00] border border-[#2EFF00] rounded-full hover:cursor-grab px-12 py-6 font-mono">
              supabase
            </div>
          </MatterBody>
        </Gravity>
      </div>
    </div>
  );
}

function ScienceCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  
  const cienciaTitle = useI18n('ciencia_tit', 'Projetado com base em <span className="highlight">dados.</span>');
  const cienciaSub = useI18n('ciencia_sub', 'Decisões baseadas em psicologia cognitiva e engenharia de performance para maximizar a retenção e conversão.');

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (titleRef.current && (window as any).TextRotateEntrance && !isMobile) {
      titleRef.current.classList.remove('text-rotate-wrap', 'in-view');
      new (window as any).TextRotateEntrance(titleRef.current);
      setTimeout(() => titleRef.current?.classList.add('in-view'), 50);
    }
  }, [isMobile, cienciaTitle]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const headerOpacity = useTransform(scrollYProgress, [0, 0.1, 0.8, 0.9], [0, 1, 1, 0]);

  const c1y = useTransform(scrollYProgress, [0, 0.3], ["100vh", "0vh"]);
  const c1opacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);
  const c1x = useTransform(scrollYProgress, [0.3, 0.5], ["0%", "-55%"]);

  const c2y = useTransform(scrollYProgress, [0.3, 0.5], ["100vh", "0vh"]);
  const c2opacity = useTransform(scrollYProgress, [0.4, 0.5], [0, 1]);
  const c2x = useTransform(scrollYProgress, [0.3, 0.5], ["0%", "55%"]);

  const cardData = [
    {
      title: useI18n('sci_01_tit', "UX Engineering & Psicologia Cognitiva"),
      desc: useI18n('sci_01_desc', "Analisamos e otimizamos interfaces com base nas Heurísticas de Nielsen, Gestalt, Leis de UX, Don Norman e Vieses Cognitivos."),
      icon: <svg viewBox="0 0 24 24"><path d="M9.5 2c-1.8 0-3.3 1.3-3.5 3.1-.9.4-1.5 1.3-1.5 2.4 0 .9.5 1.7 1.2 2.1-.2.5-.2 1 0 1.5-.7.4-1.2 1.2-1.2 2.1 0 1.2.9 2.2 2 2.4v2.4c0 1.1.9 2 2 2h3.5v-18h-2.5zm5 0h-2.5v18h3.5c1.1 0 2-.9 2-2v-2.4c1.1-.2 2-1.2 2-2.4 0-.9-.5-1.7-1.2-2.1.2-.5.2-1 0-1.5.7-.4 1.2-1.2 1.2-2.1 0-1.1-.6-2-1.5-2.4-.2-1.8-1.7-3.1-3.5-3.1z" fill="currentColor"/></svg>,
      tags: ["HEURÍSTICAS", "GESTALT", "VIESES"],
      id: "SCI_01"
    },
    {
      title: useI18n('sci_02_tit', "Performance & SEO Técnico"),
      desc: useI18n('sci_02_desc', "Otimizamos o SEO ao máximo: desde a compressão cirúrgica do tamanho dos arquivos até à renomeação automática de imagens."),
      icon: <svg viewBox="0 0 24 24"><path d="M12 22A10 10 0 1 0 12 2a10 10 0 0 0 0 20zm0-18a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm-1 4v5.6l4.3 2.5.8-1.3-3.6-2.1V8h-1.5z" fill="currentColor"/></svg>,
      tags: ["OTIMIZAÇÃO", "AUTO-NAMING"],
      id: "SCI_02"
    }
  ];

  if (isMobile) {
    return (
      <div className="w-full bg-black" style={{ padding: "5rem 2rem", background: "var(--black)" }}>
        <div className="mb-12">
          <ScrambleTag text="[ CIÊNCIA & PERFORMANCE ]" />
          <h2 className="section-title" style={{ marginTop: "1rem" }} dangerouslySetInnerHTML={{ __html: cienciaTitle }}></h2>
          <p className="manifesto-text" style={{ marginTop: "1rem" }}>{cienciaSub}</p>
        </div>
        <div className="flex flex-col gap-8">
          {cardData.map(card => (
            <div key={card.id} className="w-full">
              <div className="card-item" style={{ height: "auto", padding: "2rem", background: "rgba(255,255,255,0.02)", border: "1px solid var(--neon)", display: "flex", flexDirection: "column", borderRadius: "10px" }}>
                <div className="card-header" style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", color: "var(--neon)", fontFamily: "var(--font-mono)", fontSize: "0.85rem", letterSpacing: "1px" }}>
                  <span>{card.id}</span><div style={{ flex: 1, height: "1px", background: "rgba(57, 255, 20, 0.3)" }}></div>
                </div>
                <div className="card-icon" style={{ marginBottom: "1.5rem", color: "var(--neon)", width: "32px", height: "32px" }}>{card.icon}</div>
                <h3 className="card-title" style={{ color: "white", fontSize: "1.4rem", marginBottom: "1rem" }}>{card.title}</h3>
                <p className="card-desc" style={{ color: "var(--gray-light)", marginBottom: "1.5rem", lineHeight: "1.6" }}>{card.desc}</p>
                <div className="tag-group" style={{ display: "flex", gap: "0.6rem", marginTop: "auto", flexWrap: "wrap" }}>
                  {card.tags.map(tag => (
                    <span key={tag} className="min-tag" style={{ border: "1px solid rgba(57, 255, 20, 0.3)", padding: "0.3rem 0.8rem", fontSize: "0.7rem", fontFamily: "var(--font-mono)", letterSpacing: "1px", color: "var(--neon)", background: "rgba(57, 255, 20, 0.05)", textTransform: "uppercase", borderRadius: "4px" }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative h-[300vh] w-full" style={{ backgroundColor: "var(--black)" }}>
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden pointer-events-none">
        
        {/* Sticky Header */}
        <motion.div 
          style={{ opacity: headerOpacity, width: "100%", maxWidth: "1600px", margin: "0 auto", padding: "0 4rem" }}
          className="split-layout"
        >
          <div className="split-left pointer-events-auto">
            <ScrambleTag text="[ CIÊNCIA & PERFORMANCE ]" />
            <h2 ref={titleRef} className="section-title animate-text-rotate" style={{ marginTop: "1rem" }} dangerouslySetInnerHTML={{ __html: cienciaTitle }}></h2>
          </div>
          <div className="split-right flex items-center">
             <p className="manifesto-text" style={{ marginTop: 0 }}>{cienciaSub}</p>
          </div>
        </motion.div>

        {/* Card Container Area */}
        <div className="relative w-full h-[500px] flex items-center justify-center pointer-events-none mt-12">
            <motion.div 
              style={{ x: c1x, y: c1y, opacity: c1opacity, zIndex: 20 }}
              className="absolute w-[350px] md:w-[450px] pointer-events-auto"
            >
              <TiltCard spotlight={true} className="card-item" style={{ height: "420px", padding: "3rem", background: "rgba(255,255,255,0.02)", border: "1px solid var(--neon)", display: "flex", flexDirection: "column", borderRadius: "10px" }}>
                <div className="card-header" style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem", color: "var(--neon)", fontFamily: "var(--font-mono)", fontSize: "0.85rem", letterSpacing: "1px" }}>
                  <span>{cardData[0].id}</span><div style={{ flex: 1, height: "1px", background: "rgba(57, 255, 20, 0.3)" }}></div>
                </div>
                <div className="card-icon" style={{ marginBottom: "2rem", color: "var(--neon)", width: "40px", height: "40px" }}>{cardData[0].icon}</div>
                <h3 className="card-title" style={{ color: "white", fontSize: "1.5rem", marginBottom: "1rem" }}>{cardData[0].title}</h3>
                <p className="card-desc" style={{ color: "var(--gray-light)", marginBottom: "2rem", lineHeight: "1.6" }}>{cardData[0].desc}</p>
                <div className="tag-group" style={{ display: "flex", gap: "0.8rem", marginTop: "auto", flexWrap: "wrap" }}>
                  {cardData[0].tags.map(tag => (
                    <span key={tag} className="min-tag" style={{ border: "1px solid rgba(57, 255, 20, 0.3)", padding: "0.4rem 1rem", fontSize: "0.75rem", fontFamily: "var(--font-mono)", letterSpacing: "1px", color: "var(--neon)", background: "rgba(57, 255, 20, 0.05)", textTransform: "uppercase", borderRadius: "4px" }}>{tag}</span>
                  ))}
                </div>
              </TiltCard>
            </motion.div>

            <motion.div 
              style={{ x: c2x, y: c2y, opacity: c2opacity, zIndex: 10 }}
              className="absolute w-[350px] md:w-[450px] pointer-events-auto"
            >
              <TiltCard spotlight={true} className="card-item" style={{ height: "420px", padding: "3rem", background: "rgba(255,255,255,0.02)", border: "1px solid var(--neon)", display: "flex", flexDirection: "column", borderRadius: "10px" }}>
                <div className="card-header" style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem", color: "var(--neon)", fontFamily: "var(--font-mono)", fontSize: "0.85rem", letterSpacing: "1px" }}>
                  <span>{cardData[1].id}</span><div style={{ flex: 1, height: "1px", background: "rgba(57, 255, 20, 0.3)" }}></div>
                </div>
                <div className="card-icon" style={{ marginBottom: "2rem", color: "var(--neon)", width: "40px", height: "40px" }}>{cardData[1].icon}</div>
                <h3 className="card-title" style={{ color: "white", fontSize: "1.5rem", marginBottom: "1rem" }}>{cardData[1].title}</h3>
                <p className="card-desc" style={{ color: "var(--gray-light)", marginBottom: "2rem", lineHeight: "1.6" }}>{cardData[1].desc}</p>
                <div className="tag-group" style={{ display: "flex", gap: "0.8rem", marginTop: "auto", flexWrap: "wrap" }}>
                  {cardData[1].tags.map(tag => (
                    <span key={tag} className="min-tag" style={{ border: "1px solid rgba(57, 255, 20, 0.3)", padding: "0.4rem 1rem", fontSize: "0.75rem", fontFamily: "var(--font-mono)", letterSpacing: "1px", color: "var(--neon)", background: "rgba(57, 255, 20, 0.05)", textTransform: "uppercase", borderRadius: "4px" }}>{tag}</span>
                  ))}
                </div>
              </TiltCard>
            </motion.div>
        </div>

      </div>
    </div>
  );
}

import { getPortfolioProjects, PortfolioProject } from "./firebase";

function ProjectList() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const projs = await getPortfolioProjects();
        setProjects(projs);
        
        const modalSlider = document.getElementById("projectModalSlider");
        if (modalSlider && projs.length > 0) {
          modalSlider.innerHTML = projs.map(p => `<div class="project-modal-item"><img src="${p.image || ''}" alt="${p.name}"></div>`).join('');
        } else if (modalSlider) {
          modalSlider.innerHTML = '';
        }
      } catch (err) {
        console.error(err);
        setError(err);
      }
    }
    load();
  }, []);

  const handleMouseEnter = (index: number) => {
      const pModalSlider = document.getElementById('projectModalSlider');
      const pModalContainer = document.getElementById('projectModalContainer');
      const viewCursor = document.getElementById('viewCursor');
      const cursor = document.getElementById('cursor');
      const cursorDot = document.getElementById('cursorDot');

      if (pModalSlider) pModalSlider.style.top = `${index * -100}%`;
      if (pModalContainer) pModalContainer.classList.add('active');
      if (viewCursor) viewCursor.classList.add('active');
      if (cursor) cursor.style.opacity = '0';
      if (cursorDot) cursorDot.style.opacity = '0';
  };

  const handleMouseLeave = () => {
      const pModalContainer = document.getElementById('projectModalContainer');
      const viewCursor = document.getElementById('viewCursor');
      const cursor = document.getElementById('cursor');
      const cursorDot = document.getElementById('cursorDot');

      if (pModalContainer) pModalContainer.classList.remove('active');
      if (viewCursor) viewCursor.classList.remove('active');
      if (cursor) cursor.style.opacity = '1';
      if (cursorDot) cursorDot.style.opacity = '1';
  };

  const handleProjectClick = (e: any, project: PortfolioProject) => {
    e.preventDefault();
    setSelectedProject(project);
    // Disable body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Reset cursors
    const viewCursor = document.getElementById('viewCursor');
    const cursor = document.getElementById('cursor');
    const cursorDot = document.getElementById('cursorDot');
    
    if (viewCursor) viewCursor.classList.remove('active');
    if (cursor) cursor.style.opacity = '1';
    if (cursorDot) cursorDot.style.opacity = '1';
    if (cursor) cursor.classList.remove('active');
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
    document.body.style.overflow = 'auto';
  };

  if (error) return <div style={{ color: 'red', padding: '2rem' }}>Error loading projects.</div>;

  return (
    <>
      <div className="project-list" style={{ borderTop: "1px solid var(--border-color)" }}>
         {projects.length === 0 ? (
           <div style={{ padding: '2.5rem 0', color: 'var(--gray-mid)', fontFamily: 'var(--font-mono)' }}>Nenhum projeto encontrado.</div>
         ) : projects.map((p, index) => (
           <a key={p.id || index} href={`/portfolio-projetos/${p.id}`} className="project-row" data-index={index}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              onClick={(e) => handleProjectClick(e, p)}
              style={{ display: 'grid' }}
           >
              <span className="proj-num">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="proj-title">{p.name || 'Sem Nome'}</h3>
              <span className="proj-cat">{p.category || 'Sem Categoria'}</span>
              <span className="proj-year">
                {p.createdAt 
                  ? (typeof p.createdAt === 'string' 
                     ? new Date(p.createdAt).getFullYear() 
                     : (p.createdAt.toDate ? p.createdAt.toDate().getFullYear() : (p.createdAt.seconds ? new Date(p.createdAt.seconds * 1000).getFullYear() : '2025')))
                  : '2025'}
              </span>
              <span className="proj-arrow">↗</span>
           </a>
         ))}
      </div>
      <ProjectModal project={selectedProject} onClose={handleCloseModal} />
    </>
  );
}

const container = document.getElementById("gravity-root");
if (container) {
  createRoot(container).render(
    <StrictMode>
      <GravityDemo />
    </StrictMode>
  );
}

const heroBgContainer = document.getElementById("hero-background-react-root");
if (heroBgContainer) {
  createRoot(heroBgContainer).render(
    <StrictMode>
      <GradientBarsBackground numBars={19} gradientFrom="#39ff14" animationDuration={3} backgroundColor="transparent" />
    </StrictMode>
  );
}

const servicosContainer = document.getElementById("servicos-react-root");
if (servicosContainer) {
  createRoot(servicosContainer).render(
    <StrictMode>
      <ServicosCards />
    </StrictMode>
  );
}

const valorContainer = document.getElementById("valor-react-root");
if (valorContainer) {
  createRoot(valorContainer).render(
    <StrictMode>
      <ValorCards />
    </StrictMode>
  );
}

const cienciaContainer = document.getElementById("ciencia-react-root");
if (cienciaContainer) {
  createRoot(cienciaContainer).render(
    <StrictMode>
      <ScienceCards />
    </StrictMode>
  );
}

const backToTopContainer = document.getElementById("backtotop-root");
if (backToTopContainer) {
  createRoot(backToTopContainer).render(
    <StrictMode>
      <BackToTop />
    </StrictMode>
  );
}

const portfolioListContainer = document.getElementById("portfolio-list-react-root");
if (portfolioListContainer) {
  createRoot(portfolioListContainer).render(
    <StrictMode>
      <ProjectList />
    </StrictMode>
  );
}
