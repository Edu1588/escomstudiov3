import { StrictMode, useRef, useEffect, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { Gravity, MatterBody, GravityRef } from "./components/ui/gravity";
import { TiltCard } from "./components/TiltCard";
import { motion, useScroll, useTransform } from "motion/react";
import "./index.css";

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

  useEffect(() => {
    if (titleRef.current && (window as any).TextRotateEntrance) {
      new (window as any).TextRotateEntrance(titleRef.current);
    }
    if (descRef.current && (window as any).TextRotateEntrance) {
      new (window as any).TextRotateEntrance(descRef.current);
    }
  }, []);

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
      title: "Infraestrutura Inteligente",
      desc: "Cada projeto é desenvolvido com uma base inteligente que centraliza funções essenciais dentro do próprio site. Menos dependência, mais controle total do seu ecossistema.",
      icon: <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
    },
    {
      id: "SVC_02",
      title: "Menos ferramentas. Mais eficiência.",
      desc: "Ao integrar funcionalidades diretamente no projeto, reduzimos significativamente custos recorrentes com plataformas externas.",
      icon: <svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
    },
    {
      id: "SVC_03",
      title: "Centralização total",
      desc: "A centralização melhora a performance e facilita a gestão do seu negócio, em um único ambiente coeso e escalável.",
      icon: <svg viewBox="0 0 24 24"><rect x="10" y="3" width="4" height="4"/><rect x="4" y="17" width="4" height="4"/><rect x="16" y="17" width="4" height="4"/><path d="M12 7v6m-6 4v-4h12v4"/></svg>
    }
  ];

  const TechCard = ({ data, style, className = "" }: { data: any; style: any; className?: string }) => {
    return (
      <motion.div 
        style={style}
        className={`absolute w-[350px] md:w-[450px] h-auto pointer-events-auto ${className}`}
      >
        <div className="card-item bg-white" style={{ borderLeft: "1px solid rgba(0,0,0,0.1)", borderTop: "1px solid rgba(0,0,0,0.1)" }}>
          <div className="card-header"><span>{data.id}</span><div className="line"></div></div>
          <div className="card-icon">{data.icon}</div>
          <h3 className="card-title">{data.title}</h3>
          <p className="card-desc">{data.desc}</p>
        </div>
      </motion.div>
    );
  };

  return (
    <div ref={containerRef} className="relative h-[450vh] w-full bg-white">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden pointer-events-none">
        
        {/* Sticky Header */}
        <motion.div 
          style={{ opacity: headerOpacity, width: "100%", maxWidth: "1600px", margin: "0 auto", padding: "0 4rem" }}
          className="split-layout"
        >
          <div className="split-left pointer-events-auto">
            <ScrambleTag text="[ NOSSOS_SERVIÇOS ]" />
            <h2 ref={titleRef} className="section-title animate-text-rotate" style={{ color: "#000", marginTop: "1rem" }} data-i18n="nav_servicos">O que fazemos</h2>
          </div>
          <div className="split-right flex items-center">
             <p ref={descRef} className="manifesto-text animate-text-rotate" style={{ marginTop: 0 }}>Design com propósito comercial e infraestrutura tecnológica integrada para máxima performance.</p>
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
      <TiltCard className="card-item">
        <div className="card-header" style={{ marginBottom: "2rem" }}>
          <span>P/01</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--neon)" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        </div>
        <h3 className="card-title">Velocidade</h3>
        <p className="card-desc">Carregamento instantâneo sem scripts de terceiros pesados.</p>
      </TiltCard>
      
      <TiltCard className="card-item">
        <div className="card-header" style={{ marginBottom: "2rem" }}>
          <span>P/02</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--neon)" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <h3 className="card-title">Controle</h3>
        <p className="card-desc">Os dados do cliente são próprios, sem depender de APIs externas para o básico.</p>
      </TiltCard>

      <TiltCard className="card-item">
        <div className="card-header" style={{ marginBottom: "2rem" }}>
          <span>P/03</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--neon)" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
        </div>
        <h3 className="card-title">Escala</h3>
        <p className="card-desc">Infraestrutura pronta para crescer conforme o tráfego aumenta.</p>
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
      <div className="text-4xl sm:text-5xl md:text-6xl text-white w-full text-center z-20 relative pointer-events-none" style={{ fontWeight: 700, letterSpacing: "-2px" }}>
        Nossas Ferramentas
      </div>
      <p className="pt-4 text-base sm:text-lg text-gray-400 w-full text-center z-20 relative pointer-events-none mb-12" style={{ fontFamily: "var(--font-mono)", letterSpacing: "2px", textTransform: "uppercase" }}>
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

  useEffect(() => {
    if (titleRef.current && (window as any).TextRotateEntrance) {
      new (window as any).TextRotateEntrance(titleRef.current);
    }
  }, []);

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
      title: "UX Engineering & Psicologia Cognitiva",
      desc: "Analisamos e otimizamos interfaces com base nas Heurísticas de Nielsen, Gestalt, Leis de UX, Don Norman e Vieses Cognitivos.",
      icon: <svg viewBox="0 0 24 24"><path d="M9.5 2c-1.8 0-3.3 1.3-3.5 3.1-.9.4-1.5 1.3-1.5 2.4 0 .9.5 1.7 1.2 2.1-.2.5-.2 1 0 1.5-.7.4-1.2 1.2-1.2 2.1 0 1.2.9 2.2 2 2.4v2.4c0 1.1.9 2 2 2h3.5v-18h-2.5zm5 0h-2.5v18h3.5c1.1 0 2-.9 2-2v-2.4c1.1-.2 2-1.2 2-2.4 0-.9-.5-1.7-1.2-2.1.2-.5.2-1 0-1.5.7-.4 1.2-1.2 1.2-2.1 0-1.1-.6-2-1.5-2.4-.2-1.8-1.7-3.1-3.5-3.1z" fill="currentColor"/></svg>,
      tags: ["HEURÍSTICAS", "GESTALT", "VIESES"],
      id: "SCI_01"
    },
    {
      title: "Performance & SEO Técnico",
      desc: "Otimizamos o SEO ao máximo: desde a compressão cirúrgica do tamanho dos arquivos até à renomeação automática de imagens.",
      icon: <svg viewBox="0 0 24 24"><path d="M12 22A10 10 0 1 0 12 2a10 10 0 0 0 0 20zm0-18a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm-1 4v5.6l4.3 2.5.8-1.3-3.6-2.1V8h-1.5z" fill="currentColor"/></svg>,
      tags: ["OTIMIZAÇÃO", "AUTO-NAMING"],
      id: "SCI_02"
    }
  ];

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
            <h2 ref={titleRef} className="section-title animate-text-rotate" style={{ marginTop: "1rem" }} data-i18n="ciencia_tit">Projetado com base em <span className="highlight">dados.</span></h2>
          </div>
          <div className="split-right flex items-center">
             <p className="manifesto-text" style={{ marginTop: 0 }}>Decisões baseadas em psicologia cognitiva e engenharia de performance para maximizar a retenção e conversão.</p>
          </div>
        </motion.div>

        {/* Card Container Area */}
        <div className="relative w-full h-[500px] flex items-center justify-center pointer-events-none mt-12">
            <motion.div 
              style={{ x: c1x, y: c1y, opacity: c1opacity, zIndex: 20 }}
              className="absolute w-[350px] md:w-[450px] pointer-events-auto"
            >
              <TiltCard spotlight={true} className="card-item" style={{ height: "100%", padding: "3rem", background: "rgba(255,255,255,0.02)", border: "1px solid var(--neon)", display: "flex", flexDirection: "column", borderRadius: "10px" }}>
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
              <TiltCard spotlight={true} className="card-item" style={{ height: "100%", padding: "3rem", background: "rgba(255,255,255,0.02)", border: "1px solid var(--neon)", display: "flex", flexDirection: "column", borderRadius: "10px" }}>
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

const container = document.getElementById("gravity-root");
if (container) {
  createRoot(container).render(
    <StrictMode>
      <GravityDemo />
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
