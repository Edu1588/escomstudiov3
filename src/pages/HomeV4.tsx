import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X, CheckCircle2, Sparkles, Volume2, VolumeX, ShieldCheck, Zap, Layers, BarChart3, HelpCircle } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import "../home-v4.css";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Robot High-Res Asset
const ROBOT_ASSET = "https://res.cloudinary.com/djw0tqmiw/image/upload/v1787692357/f0sbddmv3fqs9cns3zpj.webp";

export default function HomeV4() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);

  // Audio Engine State (Web Audio API)
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const droneGainRef = useRef<GainNode | null>(null);

  // Form State
  const [nome, setNome] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [faturamento, setFaturamento] = useState("R$ 30k a R$ 100k/mês");
  const [gargalo, setGargalo] = useState("Geração de Leads Qualificados");

  // Drag "HOLD & MOVE" State
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [isHolding, setIsHolding] = useState(false);
  const holdContainerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  // Web Audio Ambient Synthesizer
  const initAudio = () => {
    if (audioCtxRef.current) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Master Gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.12, ctx.currentTime);
      masterGain.connect(ctx.destination);
      droneGainRef.current = masterGain;

      // Ambient Drone Oscillator 1 (Low C fundamental 65.4Hz)
      const osc1 = ctx.createOscillator();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(65.4, ctx.currentTime);

      // Ambient Drone Oscillator 2 (Fifth harmonic 98.1Hz)
      const osc2 = ctx.createOscillator();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(98.1, ctx.currentTime);

      // Filter
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(220, ctx.currentTime);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(masterGain);

      osc1.start();
      osc2.start();
    } catch {
      // Ignore audio context autoplay restriction
    }
  };

  const toggleAudio = () => {
    if (isAudioMuted) {
      initAudio();
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      if (droneGainRef.current && audioCtxRef.current) {
        droneGainRef.current.gain.setTargetAtTime(0.12, audioCtxRef.current.currentTime, 0.1);
      }
      setIsAudioMuted(false);
    } else {
      if (droneGainRef.current && audioCtxRef.current) {
        droneGainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.1);
      }
      setIsAudioMuted(true);
    }
  };

  const playHoldChime = () => {
    if (isAudioMuted || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    } catch {
      // Audio error fallback
    }
  };

  useEffect(() => {
    if (!trackRef.current || !viewportRef.current) return;

    // GSAP ScrollTrigger Master Pinning
    const st = ScrollTrigger.create({
      trigger: trackRef.current,
      start: "top top",
      end: "bottom bottom",
      pin: viewportRef.current,
      pinSpacing: false,
      scrub: 0.8,
      onUpdate: (self) => {
        setScrollProgress(self.progress);
      }
    });

    return () => {
      st.kill();
    };
  }, []);

  const jumpToAct = (actFraction: number) => {
    setMenuOpen(false);
    if (!trackRef.current) return;
    const totalHeight = trackRef.current.scrollHeight - window.innerHeight;
    const targetY = trackRef.current.offsetTop + totalHeight * actFraction;
    gsap.to(window, { duration: 1.2, scrollTo: { y: targetY, offsetY: 0 }, ease: "power3.inOut" });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsHolding(true);
    playHoldChime();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isHolding || !holdContainerRef.current) return;
    const rect = holdContainerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const curX = (e.clientX - rect.left - centerX) * 0.85;
    const curY = (e.clientY - rect.top - centerY) * 0.85;
    setDragPos({ x: curX, y: curY });
  };

  const handlePointerUp = () => {
    setIsHolding(false);
    gsap.to(dragPos, {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.4)",
      onUpdate: () => setDragPos({ x: dragPos.x, y: dragPos.y })
    });
  };

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `*SOLICITAÇÃO DE DIAGNÓSTICO ESCOM (V4 - CINEMA)*\n\n` +
      `*Nome:* ${nome}\n` +
      `*Empresa:* ${empresa}\n` +
      `*WhatsApp:* ${whatsapp}\n` +
      `*Faturamento:* ${faturamento}\n` +
      `*Principal Gargalo:* ${gargalo}\n\n` +
      `_Enviado via experiência cinematográfica ESCOM V4_`;
    window.open(`https://wa.me/5511978351588?text=${encodeURIComponent(msg)}`, "_blank");
  };

  // Determine seamless background color
  const getStageBg = () => {
    if (scrollProgress < 0.20) return "#0a0a0a";
    if (scrollProgress < 0.46) return "#eee9dc";
    if (scrollProgress < 0.72) return "#4d110e";
    if (scrollProgress < 0.86) return "#eee9dc";
    return "#0a0a0a";
  };

  const currentActNumber = Math.min(9, Math.max(1, Math.floor(scrollProgress * 9) + 1));

  return (
    <main className="comic-site selection:bg-[#c9332b] selection:text-white">
      {/* Background Film Grain */}
      <div className="comic-grain-overlay" />

      {/* Fixed Nav Header */}
      <header className="cinema-nav">
        <button className="cinema-logo" onClick={() => jumpToAct(0)}>
          <span className="cinema-logo__mark">E</span>
          <span>
            ESCOM<small>/ STUDIO</small>
          </span>
        </button>

        <div className="cinema-nav-controls">
          {/* Sound Toggle Button */}
          <button
            className={`cinema-pill-btn ${!isAudioMuted ? "is-active" : ""}`}
            onClick={toggleAudio}
            title={isAudioMuted ? "Ativar som ambiente" : "Mutar som"}
          >
            {isAudioMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            <div className={`eq-bars ${!isAudioMuted ? "playing" : ""}`}>
              <span />
              <span />
              <span />
            </div>
            <span>{isAudioMuted ? "SOUND OFF" : "SOUND ON"}</span>
          </button>

          {/* Index Menu Button */}
          <button className="cinema-pill-btn" onClick={() => setMenuOpen(true)}>
            <Menu size={14} /> ÍNDICE
          </button>
        </div>
      </header>

      {/* Lateral Progress Bar */}
      <div className="cinema-progress-bar">
        <span>0{currentActNumber}</span>
        <i>
          <b style={{ height: `${Math.min(100, scrollProgress * 100)}%` }} />
        </i>
        <span>09</span>
      </div>

      {/* ====================================================================
          MASTER PINNED 100% CINEMA SCROLLYTELLING CONTAINER
          ==================================================================== */}
      <div className="cinema-track" ref={trackRef} id="cinema-track">
        <div
          className="cinema-viewport"
          ref={viewportRef}
          style={{ backgroundColor: getStageBg() }}
        >
          {/* Ink Wave Background Stream */}
          <div className="cinema-ink-waves" />

          {/* -------------------------------------------------------------
              ACT 1: Insignia Loader (0.00 - 0.12)
              ------------------------------------------------------------- */}
          <div
            className={`cinema-layer ${scrollProgress < 0.14 ? "is-active" : ""}`}
            style={{
              opacity: scrollProgress < 0.13 ? Math.max(0, 1 - scrollProgress * 8) : 0,
              transform: `scale(${1 - scrollProgress * 0.4}) translateY(${-scrollProgress * 160}px)`
            }}
          >
            <div className="stage-insignia-ring">
              <div className="stage-insignia-rays" />
              <span className="font-['Cinzel'] font-black text-4xl tracking-widest text-[#eee9dc]">E</span>
            </div>
            <p className="font-mono text-xs text-[#eee9dc]/70 uppercase tracking-[0.25em] mt-6">
              ESCOM STUDIO // THE GROWTH EXPERIENCE
            </p>
            <p className="font-mono text-[10px] text-[#c9332b] tracking-widest mt-8 animate-pulse">
              ROLE PARA INICIAR A JORNADA ↓
            </p>
          </div>

          {/* -------------------------------------------------------------
              ACT 2: "THE GROWTH EXPERIENCE" Headline & Mist (0.10 - 0.26)
              ------------------------------------------------------------- */}
          <div
            className={`cinema-layer ${scrollProgress >= 0.10 && scrollProgress < 0.28 ? "is-active" : ""}`}
            style={{
              opacity: scrollProgress >= 0.10 && scrollProgress < 0.28
                ? Math.min(1, Math.sin(((scrollProgress - 0.10) / 0.18) * Math.PI))
                : 0,
              transform: `translateY(${(0.19 - scrollProgress) * 140}px)`
            }}
          >
            <div className="font-mono text-xs text-[#c9332b] font-bold tracking-[0.2em] mb-4 uppercase">
              // O SINAL NO MEIO DO RUÍDO
            </div>
            <h1 className="cinema-hero-title">
              THE GROWTH<br />
              <span className="italic-red">EXPERIENCE.</span>
            </h1>
            <p className="font-mono text-sm text-[#eee9dc]/80 max-w-lg text-center mt-6">
              Nós operamos a infraestrutura completa de crescimento da sua empresa: análise de dados em tempo real, automação e engenharia de conversão.
            </p>
          </div>

          {/* -------------------------------------------------------------
              ACT 3: The Wasteland & Grid Scene (0.24 - 0.44)
              ------------------------------------------------------------- */}
          <div
            className={`cinema-layer ${scrollProgress >= 0.24 && scrollProgress < 0.46 ? "is-active" : ""}`}
            style={{
              opacity: scrollProgress >= 0.24 && scrollProgress < 0.46
                ? Math.min(1, Math.sin(((scrollProgress - 0.24) / 0.22) * Math.PI))
                : 0
            }}
          >
            <div className="stage-perspective-grid" />

            {/* Inset Zoom Panels */}
            <div
              className="stage-inset-panel top-left"
              style={{ transform: `translateY(${(0.35 - scrollProgress) * 90}px) rotate(-2deg)` }}
            >
              <img src={ROBOT_ASSET} alt="Sensor Óptico" className="w-full h-auto mix-blend-multiply" />
              <div className="text-[9px] font-mono font-bold mt-1 text-[#121313]">// SENSOR ATIVO</div>
            </div>

            <div
              className="stage-inset-panel bottom-right"
              style={{ transform: `translateY(${(scrollProgress - 0.35) * 70}px) rotate(2deg)` }}
            >
              <img src={ROBOT_ASSET} alt="Núcleo de Dados" className="w-full h-auto mix-blend-multiply" />
              <div className="text-[9px] font-mono font-bold mt-1 text-[#121313]">// FLUXO LTV / CAC</div>
            </div>

            {/* Woodcut Hatched Walking Robot */}
            <img
              className="woodcut-robot-img"
              src={ROBOT_ASSET}
              alt="Robô Operador ESCOM"
              style={{
                transform: `translateX(${(scrollProgress - 0.35) * 180}px) scale(${1 + (scrollProgress - 0.24) * 0.3})`
              }}
            />

            {/* Typewriter Narration Boxes */}
            <div className="stage-narration-box pos-left">
              EM UM TERRITÓRIO CHEIO DE RUÍDO.<br />
              UMA FIGURA PROCURA O SINAL DE DADOS.
            </div>

            <div className="stage-narration-box pos-right">
              O RUÍDO DIMINUI QUANDO O SISTEMA<br />
              COMEÇA A RESPONDER EM TEMPO REAL.
            </div>
          </div>

          {/* -------------------------------------------------------------
              ACT 4: The Data Monolith & Crimson Portal (0.42 - 0.58)
              ------------------------------------------------------------- */}
          <div
            className={`cinema-layer ${scrollProgress >= 0.42 && scrollProgress < 0.60 ? "is-active" : ""}`}
            style={{
              opacity: scrollProgress >= 0.42 && scrollProgress < 0.60
                ? Math.min(1, Math.sin(((scrollProgress - 0.42) / 0.18) * Math.PI))
                : 0,
              transform: `scale(${0.9 + (scrollProgress - 0.42) * 0.5})`
            }}
          >
            <div className="stage-monolith-portal">
              <div className="text-center text-white font-mono text-xs tracking-widest uppercase">
                <Sparkles size={32} className="mx-auto mb-2 text-[#eee9dc]" />
                GROWTH CORE<br />
                <span className="text-[10px] text-[#eee9dc]/80">CONEXÃO IMINENTE</span>
              </div>
            </div>

            <div className="stage-narration-box mt-10 text-center max-w-md">
              AO SE APROXIMAR DO NÚCLEO, O SINAL FICA MAIS FORTE.<br />
              A ESTRUTURA INTEIRA COMEÇA A CONVERGIR.
            </div>
          </div>

          {/* -------------------------------------------------------------
              ACT 5: The "HOLD & MOVE" Interactive Portal (0.56 - 0.74)
              ------------------------------------------------------------- */}
          <div
            ref={holdContainerRef}
            className={`cinema-layer ${scrollProgress >= 0.56 && scrollProgress < 0.74 ? "is-active" : ""}`}
            style={{
              opacity: scrollProgress >= 0.56 && scrollProgress < 0.74
                ? Math.min(1, Math.sin(((scrollProgress - 0.56) / 0.18) * Math.PI))
                : 0
            }}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <div className="stage-narration-box absolute top-12 left-8">
              // INTERAÇÃO REATIVA: SEGURE E ARRASTE O PORTAL
            </div>

            <div
              className="flex flex-col items-center justify-center text-center cursor-grab active:cursor-grabbing"
              style={{
                transform: `translate3d(${dragPos.x}px, ${dragPos.y}px, 0)`
              }}
            >
              <div
                className="stage-hold-disc mb-6"
                onPointerDown={handlePointerDown}
              >
                <span>HOLD &amp;</span>
                <span>MOVE</span>
              </div>

              <h2 className="font-['Cinzel'] text-4xl md:text-6xl uppercase tracking-wider text-white max-w-2xl">
                Ativando o<br />
                <span className="italic font-['Playfair_Display'] text-[#eee9dc]">Motor de Growth.</span>
              </h2>
              <p className="font-mono text-xs md:text-sm text-white/80 max-w-md mt-4">
                Do primeiro clique à conversão de vendas, cada parte do funil responde com precisão milimétrica.
              </p>
            </div>
          </div>

          {/* -------------------------------------------------------------
              ACT 6: Cathedral of Columns (0.72 - 0.84)
              ------------------------------------------------------------- */}
          <div
            className={`cinema-layer ${scrollProgress >= 0.72 && scrollProgress < 0.84 ? "is-active" : ""}`}
            style={{
              opacity: scrollProgress >= 0.72 && scrollProgress < 0.84
                ? Math.min(1, Math.sin(((scrollProgress - 0.72) / 0.12) * Math.PI))
                : 0
            }}
          >
            <div className="stage-cathedral-columns">
              <div className="stage-cathedral-column" />
              <div className="stage-cathedral-column" />
              <div className="stage-cathedral-column" />
              <div className="stage-cathedral-column" />
              <div className="stage-cathedral-column" />
            </div>

            <div className="relative z-10 text-center max-w-3xl px-4">
              <div className="font-mono text-xs text-[#c9332b] font-bold tracking-widest uppercase mb-2">
                // O TEMPLO DA OPERAÇÃO
              </div>
              <h2 className="font-['Cinzel'] text-4xl md:text-6xl uppercase tracking-wider text-[#121313]">
                Catedral de<br />
                <span className="italic font-['Playfair_Display'] text-[#c9332b]">Escala Contínua.</span>
              </h2>
              <p className="font-mono text-sm text-zinc-700 mt-4 max-w-md mx-auto">
                Uma arquitetura comercial integrada para marcas que buscam previsibilidade e lucro real.
              </p>
            </div>
          </div>

          {/* -------------------------------------------------------------
              ACT 7 & 8: Optical Sensor Awakening (0.82 - 0.90)
              ------------------------------------------------------------- */}
          <div
            className={`cinema-layer ${scrollProgress >= 0.82 && scrollProgress < 0.91 ? "is-active" : ""}`}
            style={{
              opacity: scrollProgress >= 0.82 && scrollProgress < 0.91
                ? Math.min(1, Math.sin(((scrollProgress - 0.82) / 0.09) * Math.PI))
                : 0
            }}
          >
            <div className="stage-awakening-strip">
              <div className="stage-sensor-orb" />
              <div className="text-center font-mono">
                <span className="text-[#c9332b] font-bold text-xs">// OPTICAL SENSOR 99.8%</span>
                <h3 className="font-['Oswald'] text-2xl uppercase tracking-wider text-[#121313] mt-1">SISTEMA ONLINE</h3>
              </div>
              <div className="stage-sensor-orb" />
            </div>
          </div>

          {/* -------------------------------------------------------------
              ACT 9: CLIMAX & INTERACTIVE ARTIFACTS (0.89 - 1.00)
              ------------------------------------------------------------- */}
          <div
            className={`cinema-layer ${scrollProgress >= 0.89 ? "is-active" : ""}`}
            style={{
              opacity: scrollProgress >= 0.89
                ? Math.min(1, (scrollProgress - 0.89) * 9)
                : 0
            }}
          >
            <div className="text-center max-w-2xl px-4">
              <div className="font-mono text-xs text-[#c9332b] font-bold tracking-[0.2em] mb-2 uppercase">
                // SISTEMA INTEGRADO ATIVO
              </div>
              <h2 className="font-['Cinzel'] text-4xl md:text-5xl uppercase tracking-wider text-[#eee9dc]">
                O Ápice da<br />
                <span className="italic font-['Playfair_Display'] text-[#c9332b]">Operação de Growth.</span>
              </h2>
              <p className="font-mono text-xs text-[#eee9dc]/80 mt-2">
                Clique nos artefatos abaixo para explorar a inteligência e os números da operação sem sair do palco:
              </p>
            </div>

            {/* 5 Interactive Artifact Nodes */}
            <div className="stage-artifacts-grid">
              <div className="stage-artifact-node" onClick={() => setActiveDrawer("pillars")}>
                <div>
                  <span>// ARTEFATO 01</span>
                  <h3>OS 5 PILARES</h3>
                  <p>Dados, Tráfego, Automação, Branding e Ecossistema Integrado.</p>
                </div>
                <div className="node-action">
                  <span>EXPLORAR</span>
                  <Layers size={14} />
                </div>
              </div>

              <div className="stage-artifact-node" onClick={() => setActiveDrawer("plans")}>
                <div>
                  <span>// ARTEFATO 02</span>
                  <h3>PLANOS &amp; PREÇOS</h3>
                  <p>Modelos de parceria: Essencial, Growth e Custom.</p>
                </div>
                <div className="node-action">
                  <span>VER PACOTES</span>
                  <Zap size={14} />
                </div>
              </div>

              <div className="stage-artifact-node" onClick={() => setActiveDrawer("metrics")}>
                <div>
                  <span>// ARTEFATO 03</span>
                  <h3>MÉTRICAS &amp; CASES</h3>
                  <p>+340% em leads, redução de 42% no CAC e ROAS 5.4x.</p>
                </div>
                <div className="node-action">
                  <span>VER DADOS</span>
                  <BarChart3 size={14} />
                </div>
              </div>

              <div className="stage-artifact-node" onClick={() => setActiveDrawer("funnel")}>
                <div>
                  <span>// ARTEFATO 04</span>
                  <h3>ENGENHARIA DE FUNIL</h3>
                  <p>Atração, conversão, triagem com IA e auditoria de custos.</p>
                </div>
                <div className="node-action">
                  <span>AUDITAR FUNIL</span>
                  <ShieldCheck size={14} />
                </div>
              </div>

              <div
                className="stage-artifact-node"
                style={{ background: "#c9332b", color: "#ffffff", borderColor: "#c9332b" }}
                onClick={() => setActiveDrawer("contact")}
              >
                <div>
                  <span style={{ color: "#ffffff" }}>// TERMINAL DE CONEXÃO</span>
                  <h3 style={{ color: "#ffffff" }}>INICIAR DIAGNÓSTICO</h3>
                  <p style={{ color: "rgba(255,255,255,0.9)" }}>Conecte-se com a diretoria no WhatsApp.</p>
                </div>
                <div className="node-action" style={{ color: "#ffffff", borderColor: "rgba(255,255,255,0.3)" }}>
                  <span>FALAR NO WHATSAPP</span>
                  <ArrowUpRight size={14} />
                </div>
              </div>

              <div className="stage-artifact-node" onClick={() => setActiveDrawer("faq")}>
                <div>
                  <span>// ARTEFATO 06</span>
                  <h3>FAQ &amp; GARANTIAS</h3>
                  <p>Prazos de entrega, formato de contratação e ferramentas.</p>
                </div>
                <div className="node-action">
                  <span>TIRAR DÚVIDAS</span>
                  <HelpCircle size={14} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          LATERAL HIGH-CONVERSION DRAWERS (SLIDE-IN MODALS)
          ==================================================================== */}

      {/* 1. DRAWER PILARES */}
      {activeDrawer === "pillars" && (
        <div className="cinema-drawer-backdrop" onClick={() => setActiveDrawer(null)}>
          <div className="cinema-drawer-content" onClick={(e) => e.stopPropagation()}>
            <button className="cinema-drawer-close" onClick={() => setActiveDrawer(null)}>
              <X size={14} /> FECHAR
            </button>
            <span className="font-mono text-xs text-[#c9332b] font-bold">// OS 5 PILARES DO SISTEMA</span>
            <h2 className="font-['Oswald'] text-4xl uppercase mt-2 mb-6">Motor de Growth Integrado</h2>
            <div className="flex flex-col gap-6">
              {[
                ["01", "Dados que Decidem", "Toda decisão começa em número. Dashboards em tempo real, LTV, CAC e BI contínuo."],
                ["02", "Tráfego que Converte", "Mídia paga em escala no Google, Meta e TikTok orientada a custo por lead e retorno real."],
                ["03", "Automação Inteligente", "Triagem de leads por inteligência artificial e disparos automáticos de WhatsApp e CRM 24/7."],
                ["04", "Branding que Vende", "Identidade visual imponente e tom de voz que ampliam a percepção de valor e ticket médio."],
                ["05", "Ecossistema Fechado", "Tráfego → Landing Page → Triagem IA → CRM → Dashboard. Sem ferramentas desconexas."]
              ].map(([no, title, desc]) => (
                <div key={no} className="p-4 bg-white border border-zinc-900 rounded shadow-[4px_4px_0_#121313]">
                  <span className="font-mono text-xs text-[#c9332b] font-bold">// PILAR {no}</span>
                  <h3 className="font-['Oswald'] text-2xl uppercase mt-1">{title}</h3>
                  <p className="font-mono text-xs text-zinc-700 mt-2">{desc}</p>
                </div>
              ))}
            </div>
            <button
              className="cinema-form button w-full mt-8 p-4 bg-[#c9332b] text-white font-mono text-xs uppercase font-bold rounded cursor-pointer border-none flex items-center justify-center gap-2"
              onClick={() => setActiveDrawer("contact")}
            >
              AGENDAR DIAGNÓSTICO GRÁTIS <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* 2. DRAWER PLANOS */}
      {activeDrawer === "plans" && (
        <div className="cinema-drawer-backdrop" onClick={() => setActiveDrawer(null)}>
          <div className="cinema-drawer-content" onClick={(e) => e.stopPropagation()}>
            <button className="cinema-drawer-close" onClick={() => setActiveDrawer(null)}>
              <X size={14} /> FECHAR
            </button>
            <span className="font-mono text-xs text-[#c9332b] font-bold">// MODELOS DE PARCERIA</span>
            <h2 className="font-['Oswald'] text-4xl uppercase mt-2 mb-6">Planos Transparentes</h2>
            <div className="flex flex-col gap-6">
              <div className="p-6 bg-white border border-zinc-900 rounded shadow-[5px_5px_0_#121313]">
                <span className="font-mono text-xs text-[#c9332b] font-bold">// PLANO 01</span>
                <h3 className="font-['Oswald'] text-3xl uppercase mt-1">ESSENCIAL</h3>
                <strong className="font-['Oswald'] text-3xl block my-2">R$ 2.900<small className="text-xs font-mono">/mês</small></strong>
                <p className="font-mono text-xs text-zinc-600 mb-4">Mídia Paga (Google + Meta) + Landing Page de Alta Conversão.</p>
                <button
                  className="w-full py-3 bg-zinc-900 text-white font-mono text-xs uppercase font-bold rounded cursor-pointer"
                  onClick={() => setActiveDrawer("contact")}
                >
                  CONTRATAR ESSENCIAL
                </button>
              </div>

              <div className="p-6 bg-[#dfd7c2] border-2 border-[#c9332b] rounded shadow-[6px_6px_0_#c9332b]">
                <span className="font-mono text-xs text-[#c9332b] font-bold">// MAIS ESCOLHIDO</span>
                <h3 className="font-['Oswald'] text-3xl uppercase mt-1">GROWTH</h3>
                <strong className="font-['Oswald'] text-3xl block my-2 text-[#c9332b]">R$ 4.900<small className="text-xs font-mono text-zinc-900">/mês</small></strong>
                <p className="font-mono text-xs text-zinc-800 mb-4">Funil completo, IA de triagem no WhatsApp, BI e CRM integrado 24/7.</p>
                <button
                  className="w-full py-3 bg-[#c9332b] text-white font-mono text-xs uppercase font-bold rounded cursor-pointer border-none"
                  onClick={() => setActiveDrawer("contact")}
                >
                  CONTRATAR GROWTH
                </button>
              </div>

              <div className="p-6 bg-zinc-900 text-white border border-zinc-900 rounded shadow-[5px_5px_0_#000]">
                <span className="font-mono text-xs text-[#c9332b] font-bold">// PERSONALIZADO</span>
                <h3 className="font-['Oswald'] text-3xl uppercase mt-1">CUSTOM</h3>
                <strong className="font-['Oswald'] text-3xl block my-2">SOB MEDIDA</strong>
                <p className="font-mono text-xs text-zinc-400 mb-4">Squad dedicado de engenharia e consultoria C-Level para grande escala.</p>
                <button
                  className="w-full py-3 bg-white text-zinc-900 font-mono text-xs uppercase font-bold rounded cursor-pointer border-none"
                  onClick={() => setActiveDrawer("contact")}
                >
                  FALAR COM DIRETORIA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. DRAWER MÉTRICAS */}
      {activeDrawer === "metrics" && (
        <div className="cinema-drawer-backdrop" onClick={() => setActiveDrawer(null)}>
          <div className="cinema-drawer-content" onClick={(e) => e.stopPropagation()}>
            <button className="cinema-drawer-close" onClick={() => setActiveDrawer(null)}>
              <X size={14} /> FECHAR
            </button>
            <span className="font-mono text-xs text-[#c9332b] font-bold">// PROVA MATEMÁTICA</span>
            <h2 className="font-['Oswald'] text-4xl uppercase mt-2 mb-6">Resultados Reais</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                ["+340%", "Aumento em Leads Qualificados"],
                ["-42%", "Redução Média no CAC"],
                ["< 3s", "Tempo de Resposta com IA"],
                ["5.4x", "ROAS Médio nos Primeiros 90 dias"]
              ].map(([val, desc]) => (
                <div key={val} className="p-4 bg-white border border-zinc-900 rounded shadow-[3px_3px_0_#121313]">
                  <strong className="font-['Oswald'] text-3xl text-[#c9332b] block">{val}</strong>
                  <span className="font-mono text-xs text-zinc-700 mt-1 block">{desc}</span>
                </div>
              ))}
            </div>

            <h3 className="font-['Oswald'] text-2xl uppercase mt-8 mb-4">Cases de Estudo</h3>
            <div className="flex flex-col gap-4">
              <div className="p-4 bg-white border border-zinc-900 rounded">
                <span className="font-mono text-[10px] text-[#c9332b] font-bold">// CLÍNICA MÉDICA</span>
                <h4 className="font-['Oswald'] text-xl uppercase mt-1">+410% em faturamento em 6 meses</h4>
              </div>
              <div className="p-4 bg-white border border-zinc-900 rounded">
                <span className="font-mono text-[10px] text-[#c9332b] font-bold">// E-COMMERCE B2B</span>
                <h4 className="font-['Oswald'] text-xl uppercase mt-1">R$ 1.8M gerados via tráfego integrado</h4>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. DRAWER FUNIL & CUSTOS */}
      {activeDrawer === "funnel" && (
        <div className="cinema-drawer-backdrop" onClick={() => setActiveDrawer(null)}>
          <div className="cinema-drawer-content" onClick={(e) => e.stopPropagation()}>
            <button className="cinema-drawer-close" onClick={() => setActiveDrawer(null)}>
              <X size={14} /> FECHAR
            </button>
            <span className="font-mono text-xs text-[#c9332b] font-bold">// AUDITORIA DE FUNIL</span>
            <h2 className="font-['Oswald'] text-4xl uppercase mt-2 mb-6">Quanto Custa Não Ter um Sistema?</h2>
            <div className="flex flex-col gap-4">
              {[
                ["Tráfego sem conversão", "R$ 3.000 a R$ 15.000/mês perdidos em cliques que não viram leads."],
                ["Lead sem atendimento rápido", "Até 78% dos compradores compram de quem atende primeiro."],
                ["Ferramentas desconexas", "Mensalidades de 5 a 10 softwares diferentes que não conversam."],
                ["Decisão por achismo", "Milhares de reais investidos em canais sem mensuração de ROI."]
              ].map(([prob, custo]) => (
                <div key={prob} className="p-4 bg-white border border-zinc-900 rounded shadow-[3px_3px_0_#121313]">
                  <strong className="font-['Oswald'] text-base uppercase text-zinc-900 block">{prob}</strong>
                  <span className="font-mono text-xs text-[#c9332b] mt-1 block font-bold">{custo}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. DRAWER CONTATO WHATSAPP */}
      {activeDrawer === "contact" && (
        <div className="cinema-drawer-backdrop" onClick={() => setActiveDrawer(null)}>
          <div className="cinema-drawer-content" onClick={(e) => e.stopPropagation()}>
            <button className="cinema-drawer-close" onClick={() => setActiveDrawer(null)}>
              <X size={14} /> FECHAR
            </button>
            <span className="font-mono text-xs text-[#c9332b] font-bold">// TERMINAL DE CONEXÃO</span>
            <h2 className="font-['Oswald'] text-4xl uppercase mt-2 mb-2">Diagnóstico Estratégico</h2>
            <p className="font-mono text-xs text-zinc-700 mb-6">
              Preencha os dados para falar diretamente com a diretoria no WhatsApp:
            </p>
            <form onSubmit={handleWhatsAppSubmit} className="cinema-form">
              <label>
                SEU NOME
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Eduardo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </label>
              <label>
                NOME DA EMPRESA
                <input
                  type="text"
                  required
                  placeholder="Ex: Nexus Tech"
                  value={empresa}
                  onChange={(e) => setEmpresa(e.target.value)}
                />
              </label>
              <label>
                WHATSAPP COM DDD
                <input
                  type="tel"
                  required
                  placeholder="Ex: (11) 99999-9999"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                />
              </label>
              <label>
                FATURAMENTO ATUAL
                <select value={faturamento} onChange={(e) => setFaturamento(e.target.value)}>
                  <option value="Até R$ 30k/mês">Até R$ 30k/mês</option>
                  <option value="R$ 30k a R$ 100k/mês">R$ 30k a R$ 100k/mês</option>
                  <option value="R$ 100k a R$ 500k/mês">R$ 100k a R$ 500k/mês</option>
                  <option value="Acima de R$ 500k/mês">Acima de R$ 500k/mês</option>
                </select>
              </label>
              <label>
                PRINCIPAL GARGALO
                <select value={gargalo} onChange={(e) => setGargalo(e.target.value)}>
                  <option value="Geração de Leads Qualificados">Geração de Leads Qualificados</option>
                  <option value="Taxa de Conversão Baixa no Site">Taxa de Conversão Baixa no Site</option>
                  <option value="Atendimento Lento / Falta de Automação">Atendimento Lento / Falta de Automação</option>
                  <option value="Falta de Posicionamento e Marca Forte">Falta de Posicionamento e Marca Forte</option>
                  <option value="Escala Geral da Operação">Escala Geral da Operação</option>
                </select>
              </label>
              <button type="submit">
                ENVIAR E FALAR NO WHATSAPP <ArrowUpRight size={16} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 6. DRAWER FAQ */}
      {activeDrawer === "faq" && (
        <div className="cinema-drawer-backdrop" onClick={() => setActiveDrawer(null)}>
          <div className="cinema-drawer-content" onClick={(e) => e.stopPropagation()}>
            <button className="cinema-drawer-close" onClick={() => setActiveDrawer(null)}>
              <X size={14} /> FECHAR
            </button>
            <span className="font-mono text-xs text-[#c9332b] font-bold">// PERGUNTAS FREQUENTES</span>
            <h2 className="font-['Oswald'] text-4xl uppercase mt-2 mb-6">Dúvidas Frequentes</h2>
            <div className="flex flex-col gap-4">
              {[
                ["Em quanto tempo começo a ver resultados?", "A estruturação inicial entra no ar em até 10 dias úteis e os primeiros leads chegam logo na primeira semana."],
                ["Já tenho agência de tráfego, por que a ESCOM?", "Agências tradicionais operam anúncios isolados. A ESCOM conecta tráfego, branding, IA de triagem e CRM."],
                ["Preciso pagar ferramentas por fora?", "Não. Todo o ecossistema básico de páginas, automações e dashboards está incluso."]
              ].map(([q, a]) => (
                <div key={q} className="p-4 bg-white border border-zinc-900 rounded shadow-[3px_3px_0_#121313]">
                  <strong className="font-['Oswald'] text-lg uppercase text-zinc-900 block">{q}</strong>
                  <p className="font-mono text-xs text-zinc-700 mt-2">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Menu Overlay */}
      {menuOpen && (
        <div className="cinema-menu-overlay">
          <div className="menu-inner">
            <button className="cinema-drawer-close text-white border-white/30" onClick={() => setMenuOpen(false)}>
              <X size={14} /> FECHAR
            </button>
            <h2>
              Índice da<br />
              <em className="text-[#c9332b]">Edição 01.</em>
            </h2>
            {[
              ["01", "Abertura & Insígnia", 0],
              ["02", "O Sinal na Névoa", 0.18],
              ["03", "A Marcha no Vazio", 0.35],
              ["04", "O Monolito de Dados", 0.50],
              ["05", "Portal HOLD & MOVE", 0.65],
              ["06", "Catedral do Núcleo", 0.78],
              ["07", "O Despertar da IA", 0.85],
              ["08", "Ápice & Artefatos de Conversão", 0.95]
            ].map(([no, label, frac]) => (
              <button key={no} onClick={() => jumpToAct(frac as number)}>
                <span>{no}</span>
                {label}
                <ArrowUpRight size={16} />
              </button>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
