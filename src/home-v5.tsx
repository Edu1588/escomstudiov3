import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import ThreeCanvas from './components/V5/ThreeCanvas';
import ControlSlider from './components/V5/ControlSlider';
import PixelArtCanvas from './components/V5/PixelArtCanvas';
import BlurText from './components/V5/BlurText';
import SplashCursor from './components/V5/SplashCursor';
import SciFiLoadingScreen from './components/V5/SciFiLoadingScreen';
import RobotServicesViewer from './components/V5/RobotServicesViewer';
import { ArrowUp } from 'lucide-react';
import gsap from 'gsap';
import SplitType from 'split-type';
import { LanguageProvider } from './contexts/LanguageContext';
import './home-v5.css';

const NAV = [
  { label: "Origem", id: "jornada" },
  { label: "Ecossistema", id: "ecossistema" },
  { label: "Serviços", id: "servicos" },
  { label: "Metodologia", id: "metodologia" },
  { label: "Mercados", id: "mercados" },
  { label: "Contato", id: "contato" },
];

const WRITING = [
  {
    type: 'vortex' as const,
    tag: "CONVERSÃO CIRÚRGICA",
    title: "A LINHA ENTRE O CLIQUE E O LUCRO",
    meta: "Engenharia de Conversão",
    description: "Páginas construídas com fricção zero e carregamento sub-segundo. O lead nunca espera. Cada milissegundo economizado é conversão capturada antes do concorrente sequer carregar.",
  },
  {
    type: 'structure' as const,
    tag: "SISTEMAS PROPRIETÁRIOS",
    title: "CÓDIGO PURO & INTELIGÊNCIA ARTIFICIAL",
    meta: "Soberania Digital",
    description: "Design que atrai os olhos e engenharia de backend que converte no checkout. Tráfego pago, agentes IA 24/7 e automação de ponta integrados em uma única máquina de receita.",
  },
];

const SERVICES_V5 = [
  {
    id: "01",
    tag: "AUTOMAÇÃO & IA 24/7",
    title: "Agentes de IA & Atendimento no WhatsApp",
    description: "Atendimento imediato no WhatsApp com qualificação por faturamento, respostas inteligentes e agendamento comercial automático. Seu lead atendido em menos de 10 segundos, 24 horas por dia.",
    badge: "ZERO ESPERA",
    meta: "Atendimento & Conversão",
  },
  {
    id: "02",
    tag: "CONTEÚDO AUTOMATIZADO",
    title: "Carrosséis Inteligentes & Conexão FIPE",
    description: "Geração instantânea e diagramada de carrosséis prontos para Instagram integrados a APIs oficiais e tabela FIPE. Elimina o retrabalho de design e entrega criativos de alta atração em segundos.",
    badge: "API DIRETA",
    meta: "Escala Criativa",
  },
  {
    id: "03",
    tag: "FRICÇÃO ZERO",
    title: "Landing Pages Automatizadas de Alta Performance",
    description: "Páginas construídas em código limpo com carregamento sub-segundo (LCP < 0.4s), Lighthouse 100 e tracking avançado (GA4 e CAPI). Cada milissegundo economizado é conversão capturada antes do concorrente.",
    badge: "LCP < 0.4s",
    meta: "Performance Web",
  },
  {
    id: "04",
    tag: "SOBERANIA DIGITAL",
    title: "Sistemas ERP & Plataformas Proprietárias",
    description: "Plataformas de gestão desenhadas sob medida para a sua operação: controle de contratos, clientes, faturamento e pipeline comercial centralizados, sem dependência de assinaturas caras de SaaS.",
    badge: "SEM SAAS RECORRENTE",
    meta: "Sistemas Sob Medida",
  },
  {
    id: "05",
    tag: "DADOS EM TEMPO REAL",
    title: "Dashboards de ROI & Inteligência Comercial",
    description: "Visão executiva unificada conectando tráfego pago, faturamento, CAC, LTV e taxa de fechamento em tempo real. Clareza matemática sobre onde cada centavo investido se transforma em lucro líquido.",
    badge: "ROI CONSOLIDADO",
    meta: "Business Intelligence",
  },
  {
    id: "06",
    tag: "INFRAESTRUTURA & SEO",
    title: "Engenharia de Plataformas & SEO Orgânico",
    description: "Arquitetura escalável em Next.js e React com microsserviços seguros, 99.9% de uptime, semântica avançada e domínio orgânico no Google para atrair clientes qualificados sem custo por clique.",
    badge: "DOMÍNIO ORGÂNICO",
    meta: "Infraestrutura Blindada",
  },
];

const CONTENT: [string, string, string][] = [
  ["01 — 05", "CRM Nativo Blindado — centralização de leads, propostas e histórico sem SaaS fragmentado", "Controle"],
  ["02 — 05", "Agentes de IA 24/7 — atendimento no WhatsApp com qualificação por faturamento e agenda direta", "Automação"],
  ["03 — 05", "AutoCarrossel Inteligente — consulta automática à FIPE e geração instantânea de criativos prontos", "Escala"],
  ["04 — 05", "Máquina de Ranqueamento — SEO técnico mobile-first, Lighthouse 100 e domínio orgânico", "Performance"],
  ["05 — 05", "Minerador de Leads B2B — radar inteligente que mapeia decisores e entrega WhatsApp direto", "Prospecção"],
  ["Faixa", "Engenharia de conversão, ecossistema blindado e código proprietário", "Soberania"],
];

const SPOTLIGHT: [string, string][] = [
  ["Paioça do Caboclo", "Alimentação"],
  ["Azul Veículos", "Automotivo"],
  ["Telic Technologies", "Tecnologia"],
  ["Autosim", "Automotivo"],
  ["Union Network", "Telecom"],
  ["Fogão Mineiro", "Alimentação"],
  ["Procivil Construtora", "Construção"],
  ["Sr. Brasero", "Churrasco"],
  ["Unimais Veículos", "Automotivo"],
];

const INDEX = [
  "Engenharia de Conversão",
  "Sistemas Proprietários",
  "Agentes IA 24/7",
  "AutoCarrossel Inteligente",
  "Máquina de Ranqueamento",
  "SEO Mobile-First",
  "Lighthouse Score 100",
  "Minerador de Leads B2B",
  "CRM Nativo Blindado",
  "Next.js & React",
  "Landing Pages Brutalistas",
  "Dashboards de ROI",
  "Automação de WhatsApp",
  "Mapeamento de ICP",
  "Fricção Zero",
  "Arquitetura Escalável",
  "Google Analytics 4",
  "Google Meu Negócio",
  "Webhooks & Integrações",
  "Design Assinado",
  "Ecossistemas Digitais",
  "Soberania Digital",
  "Checkout Sub-Segundo",
  "Retenção de Leads",
  "Alta Performance",
  "LCP 0.4s",
  "Tráfego Pago Otimizado",
  "Código Proprietário",
  "Soberania",
  "Infraestrutura 24/7",
  "São Paulo / SP",
  "Brasil",
];

const JOBS: [string, string, string][] = [
  ["WhatsApp Oficial", "(13) 98106-2787", "Atendimento Direto"],
  ["Instagram Oficial", "@escomstudio", "Portfólio & Bastidores"],
  ["E-mail Corporativo", "contato@escomstudio.com.br", "Diagnóstico de Projeto"],
];

function BlurSplitText({
  text,
  className = "",
  style = {},
  as: Component = "p",
  delay = 0,
  stagger = 0.012,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  as?: any;
  delay?: number;
  stagger?: number;
}) {
  const containerRef = useRef<HTMLElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || animated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimated(true);
            observer.disconnect();

            try {
              const split = new SplitType(el, { types: 'words,chars' });
              
              gsap.fromTo(
                split.chars,
                {
                  opacity: 0,
                  filter: 'blur(16px)',
                  y: 18,
                },
                {
                  opacity: 1,
                  filter: 'blur(0px)',
                  y: 0,
                  duration: 1.3,
                  delay: delay,
                  stagger: stagger,
                  ease: 'power3.out',
                }
              );
            } catch (splitErr) {
              console.warn('[BlurSplitText] Fallback para texto natural:', splitErr);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [animated, delay, stagger]);

  return (
    <Component
      ref={containerRef}
      className={className}
      style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        ...style,
      }}
    >
      {text}
    </Component>
  );
}

function BlurLineReveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || animated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimated(true);
            observer.disconnect();

            try {
              const split = new SplitType(el, { types: 'lines,words' });
              
              if (split.words) {
                gsap.fromTo(
                  split.words,
                  {
                    opacity: 0,
                    filter: 'blur(8px)',
                    y: 15,
                  },
                  {
                    opacity: 1,
                    filter: 'blur(0px)',
                    y: 0,
                    duration: 0.8,
                    delay: delay,
                    stagger: 0.02,
                    ease: 'power2.out',
                  }
                );
              }
            } catch (splitErr) {
              console.warn('[BlurLineReveal] Fallback para renderização padrão:', splitErr);
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, [animated, delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

function SectionLabel({ n, children }: { n: string; children: string }) {
  return (
    <div className="flex flex-col items-center gap-2 pt-12 pb-6 select-none w-[70%] mx-auto border-t-[3px] border-dotted border-white/20">
      <span className="text-4xl sm:text-6xl md:text-7xl text-[#00d1ff] font-mono font-extralight tracking-widest">{n}</span>
      <h2 
        className="text-2xl sm:text-4xl md:text-5xl text-white tracking-widest uppercase font-sans font-light text-center"
      >
        {children}
      </h2>
    </div>
  );
}

const HeroText = React.memo(() => {
  return (
    <BlurText
      text="ESCOM"
      as="h1"
      style={{ fontFamily: "'Outfit', sans-serif", justifyContent: 'center' }}
      className="relative z-10 text-center text-[16vw] leading-[0.85] font-light tracking-tight text-[#00d1ff] md:text-[13vw] select-none uppercase drop-shadow-[0_0_25px_rgba(0,209,255,0.4)] cursor-default"
      animateBy="letters"
      direction="bottom"
      delay={60}
      stepDuration={0.8}
      hoverBlur={true}
    />
  );
});

function InteractiveImage({ src, alt }: { src: string, alt: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !imgRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    
    const rotateX = y * 25;
    const rotateY = -x * 25;
    
    imgRef.current.style.transition = 'none';
    imgRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  };

  const handleMouseLeave = () => {
    if (!imgRef.current) return;
    imgRef.current.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
    imgRef.current.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full h-full flex items-center justify-center cursor-default bg-[#050505]"
      style={{ perspective: '1000px' }}
    >
      <img loading="lazy" ref={imgRef}
        src={src} 
        alt={alt}
        className="w-[85%] h-[85%] md:w-[95%] md:h-[95%] object-contain pointer-events-none opacity-90"
        style={{ filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.9))', transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)' }}
      />
    </div>
  );
}

function HomeV5Content() {
  const [loading, setLoading] = useState(true);
  const [pixelFactor, setPixelFactor] = useState(5.0);
  const [brightness, setBrightness] = useState(1.15);
  const [smearIntensity, setSmearIntensity] = useState(0.3);
  const [roughness, setRoughness] = useState(0.28);
  const [metalness, setMetalness] = useState(0.75);
  const [cameraZ, setCameraZ] = useState(6.5);
  const [autoRotate, setAutoRotate] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0) {
        setScrollProgress(window.scrollY / max);
      }
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: window.location.pathname,
        user_agent: navigator.userAgent
      })
    }).catch(console.error);
  }, []);

  const threeProps = useMemo(
    () => ({
      pixelFactor,
      cameraZ,
      cameraFOV: 45,
      bgColor: "#050505",
      autoRotate,
      brightness,
      smearIntensity,
      roughness,
      metalness,
      scrollProgress,
      scrollY,
      modelPath: "/models/hefestoHD-v1.glb"
    }),
    [pixelFactor, cameraZ, autoRotate, brightness, smearIntensity, roughness, metalness, scrollProgress, scrollY]
  );

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#f5f5f7] font-mono selection:bg-[#00d1ff] selection:text-black">
      {/* Sci-Fi Loading Screen with Enter Gate */}
      {loading && <SciFiLoadingScreen onEnter={() => setLoading(false)} />}

      {/* 3D Canvas Background — Robô Busto Oficial ESCOM com Shader de Pixels no HERO */}
      <ThreeCanvas {...threeProps} />

      {/* Fixed Top-Right Action Button */}
      <a
        href="#contato"
        className="hidden md:block fixed top-6 right-6 z-50 text-black bg-[#00d1ff] hover:bg-white transition-colors uppercase font-bold font-mono text-xs tracking-widest px-6 py-3.5 rounded-none shadow-2xl pointer-events-auto"
      >
        Iniciar Projeto
      </a>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 right-6 z-50 p-3 bg-transparent transition-all duration-500 flex items-center justify-center border border-transparent
          ${scrollY > 400 ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}`}
        aria-label="Voltar ao topo"
      >
        <ArrowUp className="w-8 h-8 text-stone-500 stroke-[1] transition-colors hover:text-[#00d1ff]" />
      </button>

      {/* Navigation Header Bar (Matching Reference) */}
      <div ref={menuRef} className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
        <nav className="bg-[#111111]/90 backdrop-blur-xl border border-white/15 px-6 py-3 flex items-center justify-between gap-8 shadow-2xl pointer-events-auto min-w-[280px] sm:min-w-[340px]">
          {/* Left Icon */}
          <span className="font-mono text-base font-bold text-white tracking-widest select-none">
            &gt;|&lt;
          </span>

          {/* Center Indicator */}
          <div className="flex items-center gap-1 text-[#00d1ff] font-mono text-xs font-bold select-none">
            <span>▪</span><span>▪</span><span>▪</span><span>▪</span><span>▪</span>
          </div>

          {/* Right Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="font-mono text-xs uppercase tracking-widest text-stone-200 hover:text-white transition-colors flex items-center gap-1.5 font-bold cursor-pointer"
          >
            <span>MENU</span>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${isMenuOpen ? "rotate-180" : ""}`}>
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </nav>

        {/* Dropdown Menu */}
        <div className={`absolute top-full mt-2 overflow-hidden transition-all duration-300 origin-top bg-[#050505]/90 backdrop-blur-xl border border-white/15 w-56 shadow-2xl pointer-events-auto ${isMenuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
          <ul className="flex flex-col py-2 font-mono">
            {NAV.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-6 py-3 text-xs text-stone-300 hover:text-[#00d1ff] hover:bg-white/5 transition-colors tracking-widest text-left uppercase"
                >
                  {item.label}
                </a>
              </li>
            ))}
            
          </ul>
        </div>
      </div>

      {/* Control Panel (Floating) */}
      {showControls && (
        <div 
          className="fixed bottom-6 left-6 z-[60] w-72 bg-[#050505]/90 backdrop-blur border border-white/10 p-5 rounded-lg shadow-2xl"
          style={{ animation: "fadeIn 0.3s ease-out" }}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="label-xs text-white">Shader Controls</h3>
            <div className="w-2 h-2 rounded-full bg-[#00d1ff] shadow-[0_0_8px_rgba(0,209,255,0.5)]" />
          </div>

          <ControlSlider label="Pixel Factor" value={pixelFactor} min={2} max={15} step={1} onChange={setPixelFactor} formatValue={(v) => `${v}x`} />
          <ControlSlider label="Smear Intensity" value={smearIntensity} min={0} max={1} step={0.05} onChange={setSmearIntensity} formatValue={(v) => v.toFixed(2)} />
          <ControlSlider label="Brightness" value={brightness} min={0.3} max={2.0} step={0.1} onChange={setBrightness} formatValue={(v) => v.toFixed(1)} />
          <ControlSlider label="Roughness" value={roughness} min={0} max={1} step={0.05} onChange={setRoughness} formatValue={(v) => v.toFixed(2)} />
          <ControlSlider label="Metalness" value={metalness} min={0} max={1} step={0.05} onChange={setMetalness} formatValue={(v) => v.toFixed(2)} />
          <ControlSlider label="Camera Distance" value={cameraZ} min={3} max={15} step={0.5} onChange={setCameraZ} formatValue={(v) => `${v}u`} />

          <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/10">
            <span className="label-xs text-stone-400">Auto-Rotate</span>
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className="relative w-8 h-4 rounded-full transition-colors"
              style={{ background: autoRotate ? "rgba(0, 209, 255, 0.3)" : "rgba(255,255,255,0.1)" }}
            >
              <div 
                className="absolute top-[2px] w-3 h-3 rounded-full transition-all"
                style={{ 
                  left: autoRotate ? "18px" : "2px", 
                  background: autoRotate ? "#00d1ff" : "#8B8578" 
                }}
              />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-16 relative z-10 pointer-events-none">
        {/* Hero Section */}
        <section className="relative flex min-h-[88vh] flex-col items-center justify-center overflow-hidden px-6 pt-20">
          <div className="pointer-events-auto flex flex-col items-center">
            <HeroText />
          </div>
        </section>

        {/* Section 01: Nosso propósito */}
        <section id="jornada" className="mx-auto max-w-[1400px] px-6 pointer-events-auto">
          <SectionLabel n="01">Nosso propósito</SectionLabel>

          <div className="mx-auto max-w-7xl space-y-8 md:space-y-10 pb-28">
            {/* Paragraph 1: Aligned to the left - Large scale */}
            <div className="relative w-full md:w-[75%] lg:w-[60%] mr-auto">
              <span className="absolute -top-7 left-0 text-[10px] text-stone-500 font-mono tracking-widest uppercase">
                SEC—01
              </span>
              <BlurSplitText 
                text="A engenharia digital da ESCOM constrói ecossistemas onde código, inteligência artificial e conversão se tornam um só organismo. Design que atrai os olhos e tecnologia robusta que multiplica seu faturamento."
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl leading-[1.4] text-stone-300 font-serif font-light tracking-wide text-left"
              />
            </div>

            {/* Paragraph 2: Offset to the right - Large scale */}
            <div className="relative w-full md:w-[75%] lg:w-[60%] md:ml-auto flex flex-col md:flex-row gap-3 md:gap-8 items-start md:items-start justify-end text-left md:text-right">
              <BlurSplitText 
                text="Não construímos apenas sites bonitos. Desenvolvemos máquinas de conversão blindadas: tráfego pago, automação de WhatsApp e sistemas proprietários para consolidar a soberania do seu negócio."
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl leading-[1.4] text-stone-300 font-serif font-light tracking-wide md:text-right"
              />
              <span className="text-[10px] text-stone-500 font-mono tracking-widest uppercase shrink-0 pt-3 text-right">
                ETHOS
              </span>
            </div>
          </div>

          <div className="pb-28 text-center select-none flex flex-col gap-2">
            <BlurText 
              text="CONSTRUIR"
              as="h2"
              animateBy="letters"
              delay={40}
              stepDuration={1.2}
              style={{ justifyContent: 'center' }}
              hoverBlur={true}
              className="text-[14vw] leading-[0.85] md:text-[10rem] uppercase tracking-tight text-white font-serif font-light cursor-default"
            />
            <BlurText 
              text="CONVERTER"
              as="h2"
              animateBy="letters"
              delay={40}
              stepDuration={1.2}
              style={{ justifyContent: 'center' }}
              hoverBlur={true}
              className="text-[14vw] leading-[0.85] md:text-[10rem] uppercase tracking-tight text-white font-serif font-light cursor-default"
            />
            <BlurText 
              text="E ESCALAR"
              as="h2"
              animateBy="letters"
              delay={40}
              stepDuration={1.2}
              style={{ justifyContent: 'center' }}
              hoverBlur={true}
              className="text-[14vw] leading-[0.85] md:text-[10rem] uppercase tracking-tight text-white font-serif font-light cursor-default"
            />
          </div>
        </section>

        {/* Section 02: Quem somos & Ecossistema */}
        <section id="ecossistema" className="mx-auto max-w-[1400px] px-6 pointer-events-auto">
          <SectionLabel n="02">Quem somos & Ecossistema</SectionLabel>

          <div className="grid gap-12 md:gap-16 pb-28 md:grid-cols-2">
            {WRITING.map((w) => (
              <article key={w.title} className="group relative border-none bg-transparent p-0 flex flex-col justify-between">
                <div>
                  {/* Tag label header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-block bg-white/10 text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 text-stone-300">
                      {w.tag}
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono tracking-widest uppercase">
                      {w.meta}
                    </span>
                  </div>

                  {/* Pixelated ASCII / Dot-Matrix Graphic Canvas */}
                  <div className="relative aspect-[16/10] bg-[#050505] overflow-hidden mb-5 border border-white/5 group-hover:border-white/20 transition-colors">
                    <PixelArtCanvas type={w.type} />
                  </div>

                  {/* Title & Description */}
                  <h3 
                    className="text-lg sm:text-xl md:text-2xl font-bold font-mono text-white tracking-wider uppercase group-hover:text-[#00d1ff] transition-colors"
                  >
                    {w.title}
                  </h3>
                  
                  <p 
                    className="text-sm sm:text-base text-stone-400 font-serif leading-relaxed mt-2"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                  >
                    {w.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="bg-[#050505] relative z-20 pointer-events-auto w-full">
        {/* Section 03: Nossos Serviços & Sistemas com Robô Centralizado e Cards Flutuantes */}
        <section id="servicos" className="mx-auto max-w-[1400px] px-6 relative">
          <SectionLabel n="03">Nossos Serviços & Sistemas</SectionLabel>

          {/* Header da Seção */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/10 pb-6 gap-4">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#00d1ff] uppercase block mb-1">
                ECOSSISTEMA INTEGRADO DE CRESCIMENTO
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-white uppercase tracking-wide">
                Soluções Proprietárias Sob Medida
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 font-mono max-w-md">
              Engenharia ponta a ponta: inteligência artificial, tráfego, automação de processos e plataformas com 0% dependência de ferramentas frágeis.
            </p>
          </div>

          {/* Palco Central: Robô 3D Interativo no Centro + 6 Cards Flutuantes em Volta */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pb-16 relative">
            {/* Coluna Esquerda: 3 Cards Flutuantes */}
            <div className="lg:col-span-4 flex flex-col gap-5 order-2 lg:order-1">
              {SERVICES_V5.slice(0, 3).map((s) => (
                <div
                  key={s.id}
                  className="group relative border border-white/10 bg-[#0a0a0c]/85 backdrop-blur-md p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:border-[#00d1ff]/60 hover:shadow-[0_0_30px_rgba(0,209,255,0.08)] hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono tracking-widest text-[#00d1ff] uppercase">
                        {s.tag}
                      </span>
                      <span className="text-[9px] font-mono tracking-widest text-stone-400 border border-white/10 px-2 py-0.5 bg-white/5 uppercase">
                        {s.badge}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold font-mono text-white tracking-wide uppercase group-hover:text-[#00d1ff] transition-colors leading-snug">
                      {s.title}
                    </h3>

                    <p 
                      className="text-sm text-stone-400 font-serif leading-relaxed mt-2.5"
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                    >
                      {s.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-stone-400">
                    <span>{s.meta}</span>
                    <span className="text-stone-400 font-bold group-hover:text-[#00d1ff] transition-colors">
                      {s.id} // 06
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Coluna Central: Robô Oficial 3D com Cabeça Articulada Responsiva ao Mouse */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center order-1 lg:order-2 min-h-[460px] lg:min-h-[640px] relative">
              <div className="w-full h-full flex items-center justify-center relative">
                <RobotServicesViewer height={620} className="w-full" />
              </div>
            </div>

            {/* Coluna Direita: 3 Cards Flutuantes */}
            <div className="lg:col-span-4 flex flex-col gap-5 order-3">
              {SERVICES_V5.slice(3, 6).map((s) => (
                <div
                  key={s.id}
                  className="group relative border border-white/10 bg-[#0a0a0c]/85 backdrop-blur-md p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:border-[#00d1ff]/60 hover:shadow-[0_0_30px_rgba(0,209,255,0.08)] hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono tracking-widest text-[#00d1ff] uppercase">
                        {s.tag}
                      </span>
                      <span className="text-[9px] font-mono tracking-widest text-stone-400 border border-white/10 px-2 py-0.5 bg-white/5 uppercase">
                        {s.badge}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold font-mono text-white tracking-wide uppercase group-hover:text-[#00d1ff] transition-colors leading-snug">
                      {s.title}
                    </h3>

                    <p 
                      className="text-sm text-stone-400 font-serif leading-relaxed mt-2.5"
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                    >
                      {s.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-stone-400">
                    <span>{s.meta}</span>
                    <span className="text-stone-400 font-bold group-hover:text-[#00d1ff] transition-colors">
                      {s.id} // 06
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Especificação Técnica de Entregáveis */}
          <div className="pt-8 pb-4">
            <span className="label-xs text-stone-400 uppercase font-mono tracking-widest block mb-4">
              ESPECIFICAÇÃO TÉCNICA DE ENTREGÁVEIS & INTEGRAÇÕES
            </span>
          </div>
          <ul className="pb-24 border-t border-white/10">
            {CONTENT.map(([tag, title, date]) => (
              <li key={title}>
                <a
                  href="#servicos"
                  className="group flex items-center gap-6 border-b border-white/10 py-5 px-3 transition-all hover:bg-[#00d1ff] hover:border-[#00d1ff]"
                >
                  <span className="label-xs w-24 shrink-0 text-[#00d1ff] font-bold group-hover:text-black">{tag}</span>
                  <span className="flex-1 text-sm text-stone-200 font-mono transition-colors group-hover:text-black">
                    {title}
                  </span>
                  <span className="label-xs shrink-0 text-stone-400 group-hover:text-black/70">{date}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Section 04: Nossa Metodologia */}
        <section id="metodologia" className="mx-auto max-w-[1400px] px-6 relative py-12 overflow-visible">
          {/* Interactive Fluid Splash Effect spanning the entire section with soft edge fading */}
          <div 
            className="absolute -inset-x-6 -inset-y-4 z-0 pointer-events-none overflow-hidden"
            style={{
              maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.35) 75%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.35) 75%, rgba(0,0,0,0) 100%)',
            }}
          >
            <SplashCursor
              isAbsolute={true}
              DENSITY_DISSIPATION={3.5}
              VELOCITY_DISSIPATION={2}
              PRESSURE={0.1}
              CURL={3}
              SPLAT_RADIUS={0.2}
              SPLAT_FORCE={6000}
              COLOR_UPDATE_SPEED={10}
              SHADING={true}
              RAINBOW_MODE={false}
              COLOR="#00d1ff"
            />
          </div>

          {/* Section 04 Header */}
          <div className="relative z-10">
            <SectionLabel n="04">Nossa Metodologia</SectionLabel>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start pb-28 pt-8 relative z-10">
            {/* Column 1: Text Content with Sticky Title and scrolling blur-reveal text */}
            <div className="space-y-10 text-stone-200 font-sans relative">
              {/* Sticky Column 1 Header fixed at top of column while text scrolls */}
              <div className="lg:sticky lg:top-0 z-30 bg-[#050505]/85 backdrop-blur-sm pb-6 pt-6 border-b border-white/10">
                <span className="text-[10px] text-[#00d1ff] font-mono tracking-widest uppercase bg-white/5 px-3 py-1 border border-white/10">
                  ENGENHARIA & ARQUITETURA
                </span>
                <BlurText
                  as="h3"
                  text="A ENGENHARIA DA ESCOM"
                  className="text-3xl sm:text-4xl md:text-5xl font-light text-white tracking-wide uppercase mt-4 font-sans"
                  delay={150}
                  animateBy="words"
                  direction="top"
                />
              </div>
              
              {/* Top fade out overlay */}
              <div 
                className="hidden lg:block lg:sticky z-20 w-full pointer-events-none"
                style={{ 
                  top: '106px', 
                  height: '140px',
                  background: 'linear-gradient(to bottom, rgba(5,5,5,0.9) 0%, rgba(5,5,5,0) 100%)',
                }}
              />

              {/* Scrolling paragraphs with blur-reveal effect */}
              <div className="space-y-12 text-base sm:text-lg leading-relaxed text-stone-300 font-sans pt-4 pb-12 lg:-mt-[140px]">
                <BlurLineReveal delay={0.1}>
                  <p className="border-l-2 border-[#00d1ff] pl-6 text-stone-300 text-base sm:text-lg">
                    Na <strong className="text-white font-semibold">ESCOM STUDIO</strong>, engenharia digital é a disciplina de unir código limpo, inteligência artificial e conversão extrema. Submetemos cada interface aos mais rigorosos testes de stress e fricção zero, até que o sistema se torne uma máquina de receita inquebrável.
                  </p>
                </BlurLineReveal>

                <BlurLineReveal delay={0.2}>
                  <p className="pl-6 text-stone-300 text-base sm:text-lg">
                    No mercado atual, sites lentos e ferramentas desconexas queimam orçamento sem gerar retorno. Nós não entregamos apenas estética: nós <strong className="text-white">construímos operações digitais completas</strong>, integrando tráfego pago, atendimento automático no WhatsApp e páginas com carregamento em 0.4s.
                  </p>
                </BlurLineReveal>

                <BlurLineReveal delay={0.3}>
                  <p className="pl-6 text-stone-300 text-base sm:text-lg">
                    O equilíbrio exato entre sofisticação visual de marca e brutalidade de conversão: o ponto onde o usuário não encontra atrito, o lead é qualificado em segundos e o ticket médio se multiplica.
                  </p>
                </BlurLineReveal>

                <BlurLineReveal delay={0.4}>
                  <div className="pt-8 border-t border-white/10 space-y-4 font-sans">
                    <span className="text-xs text-white font-mono uppercase tracking-widest block font-bold">O MÉTODO DE ENGENHARIA</span>
                    <div className="text-xs sm:text-sm text-stone-300 space-y-4 leading-relaxed font-sans">
                      <p><span className="text-[#00d1ff] font-mono font-extralight text-base sm:text-lg mr-2">01.</span> <strong className="text-white font-semibold">MAPEAMENTO:</strong> Diagnóstico profundo de ICP, gargalos e fluxos nativos.</p>
                      <p><span className="text-[#00d1ff] font-mono font-extralight text-base sm:text-lg mr-2">02.</span> <strong className="text-white font-semibold">ENGENHARIA BLINDADA:</strong> Desenvolvimento puro em Next.js/React, sem dependência de plataformas lentas.</p>
                      <p><span className="text-[#00d1ff] font-mono font-extralight text-base sm:text-lg mr-2">03.</span> <strong className="text-white font-semibold">SISTEMAS PROPRIETÁRIOS:</strong> Agentes IA 24/7, AutoCarrossel e automações conectadas ao seu WhatsApp.</p>
                      <p><span className="text-[#00d1ff] font-mono font-extralight text-base sm:text-lg mr-2">04.</span> <strong className="text-white font-semibold">ESCALA & ROI:</strong> Lighthouse Score 100, indexação no Google e maximização de faturamento líquido.</p>
                    </div>
                  </div>
                </BlurLineReveal>
              </div>
            </div>

            {/* Column 2: Architecture & Telemetry Specs Card */}
            <div className="lg:sticky lg:top-20 w-full relative bg-transparent overflow-visible z-40">
              <div className="border border-white/10 bg-[#050505] p-8 sm:p-10 space-y-8 font-mono relative">
                {/* HUD Corner Accents */}
                <div className="absolute top-2 left-2 text-[10px] text-[#00d1ff]/50">┌</div>
                <div className="absolute top-2 right-2 text-[10px] text-[#00d1ff]/50">┐</div>
                <div className="absolute bottom-2 left-2 text-[10px] text-[#00d1ff]/50">└</div>
                <div className="absolute bottom-2 right-2 text-[10px] text-[#00d1ff]/50">┘</div>

                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-xs text-[#00d1ff] uppercase tracking-widest font-bold">TELEMETRIA DE SISTEMAS</span>
                  <span className="text-[10px] text-stone-500 uppercase">SYS.CORE // v5</span>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-xs text-stone-300 mb-1">
                      <span>VELOCIDADE DE CARREGAMENTO (LCP)</span>
                      <span className="text-[#00d1ff] font-bold">&lt; 0.4s</span>
                    </div>
                    <div className="h-1 bg-white/10 w-full overflow-hidden">
                      <div className="h-full bg-[#00d1ff] w-[96%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-stone-300 mb-1">
                      <span>TAXA DE RETENÇÃO & LIGHTHOUSE</span>
                      <span className="text-[#00d1ff] font-bold">100 / 100</span>
                    </div>
                    <div className="h-1 bg-white/10 w-full overflow-hidden">
                      <div className="h-full bg-[#00d1ff] w-[100%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-stone-300 mb-1">
                      <span>ESTABILIDADE & DISPONIBILIDADE</span>
                      <span className="text-[#00d1ff] font-bold">99.98% UPTIME</span>
                    </div>
                    <div className="h-1 bg-white/10 w-full overflow-hidden">
                      <div className="h-full bg-[#00d1ff] w-[99%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-stone-300 mb-1">
                      <span>AUTOMAÇÃO DE WHATSAPP</span>
                      <span className="text-[#00d1ff] font-bold">RESPOSTA &lt; 10s</span>
                    </div>
                    <div className="h-1 bg-white/10 w-full overflow-hidden">
                      <div className="h-full bg-[#00d1ff] w-[94%]" />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 text-xs text-stone-400 space-y-2">
                  <div className="flex justify-between">
                    <span>STACK:</span>
                    <span className="text-white">Next.js 15, React 19, TypeScript, Edge API</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ARQUITETURA:</span>
                    <span className="text-white">Código Proprietário Sem SaaS Fragmentado</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SEGURANÇA:</span>
                    <span className="text-[#00d1ff]">SSL Blindado, CAPI & Webhooks Nativos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 05: Mercados & Clientes */}
        <section id="mercados" className="mx-auto max-w-[1400px] px-6">
          <SectionLabel n="05">Mercados & Clientes</SectionLabel>

          <p className="mx-auto max-w-2xl pb-12 text-center text-sm leading-relaxed text-stone-400 font-mono">
            Operações digitais que confiam na nossa engenharia. Sistemas proprietários, interfaces de alta conversão
            e arquiteturas de código preparadas para suportar picos de escala e faturamento contínuo.
          </p>

          <div className="pb-6 text-center">
            <span className="label-xs text-[#00d1ff] border border-[#00d1ff]/30 px-3 py-1 rounded-full bg-[#00d1ff]/10">
              Spotlight
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 pt-6">
            {SPOTLIGHT.map(([brand, cat]) => (
              <div
                key={brand}
                className="group relative border border-white/10 p-6 transition-all hover:border-[#00d1ff]/50 hover:bg-[#00d1ff]/5 flex flex-col justify-between h-40"
              >
                <div>
                  <span className="label-xs text-[#00d1ff] font-bold">{cat}</span>
                  <h4 className="font-mono text-base text-stone-200 mt-2 font-bold group-hover:text-white transition-colors">{brand}</h4>
                </div>
                <div className="flex items-center justify-between text-xs text-stone-300 font-mono pt-4 border-t border-white/5">
                  <span>Status</span>
                  <span className="text-[#00d1ff] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00d1ff] animate-pulse"></span>
                    Ativo
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Section 05.5: Index de Serviços */}
          <div className="pt-24 pb-12">
            <span className="text-xs text-stone-300 font-mono uppercase tracking-widest block mb-8 font-bold border-b border-white/10 pb-4">
              [ ÍNDICE DE CAPACIDADES ]
            </span>
            <div className="flex flex-wrap gap-2 text-xs font-mono text-stone-300">
              {INDEX.map((item) => (
                <span
                  key={item}
                  className="border border-white/10 px-3 py-1.5 hover:border-[#00d1ff] hover:text-[#00d1ff] transition-colors cursor-default"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Section 07: Contato / Footer */}
        <footer id="contato" className="border-t border-white/10 bg-[#050505] text-stone-300 font-mono pt-16">
          <div className="mx-auto max-w-[1400px] px-6 pb-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              <span className="label-xs text-[#00d1ff] font-bold tracking-widest block mb-2">DIAGNÓSTICO & PROJETO</span>
              <h2 className="text-4xl sm:text-5xl font-light text-white font-sans tracking-tight uppercase leading-tight">
                Construa apenas o que gera lucro.
              </h2>
              <p className="text-sm text-stone-400 font-mono mt-6 max-w-md leading-relaxed">
                A ESCOM STUDIO é o seu braço de engenharia digital, automação e inteligência de vendas. Fale com nossos especialistas e consolide sua soberania no mercado.
              </p>
            </div>

            <div className="space-y-4">
              {JOBS.map(([label, val, desc]) => (
                <a
                  key={label}
                  href={label.includes("WhatsApp") ? "https://wa.me/5513981062787?text=Ol%C3%A1!%20Gostaria%20de%20um%20diagn%C3%B3stico%20da%20ESCOM%20Studio." : label.includes("Instagram") ? "https://instagram.com/escomstudio" : "mailto:contato@escomstudio.com.br"}
                  target="_blank"
                  rel="noreferrer"
                  className="group block border border-white/10 p-5 hover:border-[#00d1ff] hover:bg-[#00d1ff]/5 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <span className="label-xs text-[#00d1ff] font-bold">{label}</span>
                    <span className="label-xs text-stone-400 group-hover:text-white transition-colors">{desc}</span>
                  </div>
                  <span className="block text-lg font-bold text-white mt-2 group-hover:text-[#00d1ff] transition-colors">{val}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="border-t border-white/5 mx-auto max-w-[1400px] px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="label-xs text-stone-400 uppercase font-mono">
              ESCOM STUDIO — ENGENHARIA DE CRESCIMENTO DIGITAL
            </span>
            <div className="flex flex-wrap gap-6 text-xs text-stone-400 font-mono">
              {NAV.map((l) => (
                <a key={l.id} href={`#${l.id}`} className="hover:text-[#00d1ff] transition-colors uppercase">
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          <div className="mx-auto max-w-[1400px] px-6 pb-12 flex flex-col sm:flex-row items-center justify-between border-t border-white/5 pt-6">
            <span className="label-xs text-stone-400">
              © 2026 ESCOM STUDIO. Todos os direitos reservados. Código Proprietário Blindado.
            </span>
            <span className="label-xs text-[#00d1ff]/80 mt-2 sm:mt-0">
              &gt;| ESCOM STUDIO |&lt;
            </span>
          </div>
        </footer>
        </div>
      </main>

    </div>
  );
}

class HomeErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error('[HomeV5 ErrorBoundary]:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] text-[#f5f5f7] flex flex-col items-center justify-center p-6 text-center font-mono">
          <div className="max-w-md p-8 border border-[#00d1ff]/30 bg-black/60 shadow-2xl space-y-4">
            <span className="text-[#00d1ff] text-xs uppercase tracking-widest block font-bold">ESCOM STUDIO v5</span>
            <h1 className="text-2xl font-bold uppercase tracking-wider text-white">Engenharia Digital & Sistemas</h1>
            <p className="text-sm text-stone-400 font-serif">
              Ocorreu uma instabilidade na aceleração gráfica. Clique no botão abaixo para restaurar a interface.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2.5 bg-[#00d1ff] text-black font-bold uppercase text-xs tracking-widest hover:bg-white transition-colors cursor-pointer"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function HomeV5() {
  return (
    <HomeErrorBoundary>
      <LanguageProvider>
        <HomeV5Content />
      </LanguageProvider>
    </HomeErrorBoundary>
  );
}

// Mount if direct entry
const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<HomeV5 />);
}

