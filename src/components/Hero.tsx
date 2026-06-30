import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, X } from "lucide-react";

export default function Hero() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const [slotIndex, setSlotIndex] = useState(0);
  const slotListRef = useRef<HTMLDivElement>(null);

  const slotItems = ["GANHOS.", "TEMPO.", "CONVERSÃO.", "CLIENTES."];

  // Alterna as palavras da Slot Machine (Roleta)
  useEffect(() => {
    const interval = setInterval(() => {
      setSlotIndex((prev) => (prev + 1) % slotItems.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Monitora o movimento do mouse para o custom cursor
  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches);
    };
    checkTouch();
    window.addEventListener("resize", checkTouch);

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    if (!isTouchDevice) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      window.removeEventListener("resize", checkTouch);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isTouchDevice]);

  // Efeito de hover nos botões e links para o cursor crescer
  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    const addHoverListeners = () => {
      const clickables = document.querySelectorAll("button, a");
      clickables.forEach((el) => {
        el.addEventListener("mouseenter", handleMouseEnter);
        el.addEventListener("mouseleave", handleMouseLeave);
      });
    };

    // Timeout curto para garantir que todos os elementos do DOM estão renderizados
    const timer = setTimeout(addHoverListeners, 500);

    return () => {
      clearTimeout(timer);
      const clickables = document.querySelectorAll("button, a");
      clickables.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, [isTouchDevice, isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative w-full min-h-screen flex overflow-x-hidden bg-[#060806]">
      {/* Cursor Customizado Cyberpunk */}
      {!isTouchDevice && (
        <motion.div
          className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
          animate={{
            x: cursorPos.x,
            y: cursorPos.y,
            width: isHovered ? 40 : 12,
            height: isHovered ? 40 : 12,
            backgroundColor: isHovered ? "transparent" : "#39FF14",
            border: isHovered ? "2px solid #39FF14" : "none",
          }}
          transition={{ type: "tween", ease: "backOut", duration: 0.15 }}
          style={{
            transform: "translate(-50%, -50%)",
          }}
        />
      )}

      {/* Menu Lateral (Off-canvas) - Z-70 para ficar acima de tudo */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-64 md:w-80 bg-[#0a0d0a] z-[70] border-r border-white/5 flex flex-col p-8 justify-between"
          >
            <div>
              <div className="mb-12 flex justify-between items-center">
                {/* Botão de Fechar Menu */}
                <button
                  onClick={toggleMenu}
                  className="text-white/70 hover:text-[#39FF14] transition-colors cursor-pointer"
                >
                  <X size={30} />
                </button>

                {/* Seletor de Idiomas (Dentro do menu) */}
                <div className="flex gap-2 text-sm font-medium">
                  <button className="text-white cursor-pointer font-mono">PT</button>
                  <span className="text-white/30">/</span>
                  <button className="text-white/40 hover:text-white transition-colors cursor-pointer font-mono">
                    EN
                  </button>
                </div>
              </div>

              <ul className="flex flex-col gap-6 text-xl font-medium font-cabin uppercase">
                <li>
                  <a
                    href="#"
                    onClick={toggleMenu}
                    className="hover:text-[#39FF14] transition-colors"
                  >
                    Início
                  </a>
                </li>
                <li>
                  <a
                    href="#serviços"
                    onClick={toggleMenu}
                    className="hover:text-[#39FF14] transition-colors"
                  >
                    Serviços
                  </a>
                </li>
                <li>
                  <a
                    href="#planos"
                    onClick={toggleMenu}
                    className="hover:text-[#39FF14] transition-colors"
                  >
                    Planos
                  </a>
                </li>
                <li>
                  <a
                    href="#projetos"
                    onClick={toggleMenu}
                    className="hover:text-[#39FF14] transition-colors"
                  >
                    Projetos
                  </a>
                </li>
                <li>
                  <a
                    href="#contato"
                    onClick={toggleMenu}
                    className="hover:text-[#39FF14] transition-colors"
                  >
                    Contato
                  </a>
                </li>
              </ul>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Conteúdo Principal do Site */}
      <motion.div
        className="w-full flex-shrink-0 min-h-screen relative flex flex-col bg-[#060806] p-4 md:p-8"
        animate={{
          x: isMenuOpen ? (window.innerWidth >= 768 ? 320 : 256) : 0,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      >
        {/* SVG de Fundo Centralizado */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[5] overflow-hidden">
          <img
            src="https://res.cloudinary.com/djw0tqmiw/image/upload/v1780084528/clevu4gpxuc4jli2myak.svg"
            alt="Background Logo"
            className="w-[150%] md:w-[100%] max-w-6xl h-auto opacity-[0.05]"
          />
        </div>

        {/* Quadro com Borda sobrepondo tudo no main (z-45 passa SOBRE o robô) */}
        <div className="absolute inset-4 md:inset-8 border-2 border-white/20 rounded-[3px] pointer-events-none z-[45]"></div>

        {/* Overlay escuro para foco no menu */}
        <div
          onClick={isMenuOpen ? toggleMenu : undefined}
          className={`absolute inset-4 md:inset-8 bg-black/60 z-[60] transition-opacity duration-500 rounded-[3px] ${
            isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        ></div>

        {/* Cabeçalho (z-50) */}
        <header className="relative z-[50] flex justify-between items-center py-4 px-4 lg:px-8">
          {/* 1. Botão Menu Hambúrguer */}
          <div className="flex items-center w-32">
            <button
              onClick={toggleMenu}
              className="flex flex-col gap-[6px] p-2 group cursor-pointer"
            >
              <span className="w-8 h-[2px] bg-white group-hover:bg-[#39FF14] transition-colors"></span>
              <span className="w-8 h-[2px] bg-white group-hover:bg-[#39FF14] transition-colors"></span>
            </button>
          </div>

          {/* 2. Logo Centro com "STUDIO" */}
          <div className="flex-1 flex justify-center items-center">
            <h1 className="text-xl md:text-2xl font-bold font-cabin tracking-[0.2em] text-white uppercase italic">
              ESCOM <span className="text-[#39FF14] font-medium">STUDIO</span>
            </h1>
          </div>

          {/* 3. Botão Contato (Direita) */}
          <div className="flex items-center justify-end w-32">
            <a
              href="#contato"
              className="hidden md:flex items-center justify-center border border-[#39FF14] text-white px-6 py-2 text-xs uppercase tracking-widest hover:bg-[#39FF14] hover:text-black transition-colors duration-300 font-mono"
            >
              Contato
            </a>
          </div>
        </header>

        {/* Seção Hero Principal (z-30, fica ABAIXO da borda z-45) */}
        <main className="relative z-[30] flex-1 flex flex-col lg:flex-row w-full px-4 lg:px-12 mt-8 lg:mt-0 pb-20">
          {/* Coluna Esquerda: Textos e CTAs */}
          <div className="w-full lg:w-[50%] flex flex-col justify-center z-30 pb-32 lg:pb-0 pt-8 lg:pt-0">
            {/* Título Corrigido com Quebra de Linha */}
            <h2 className="text-[2.8rem] sm:text-[3.5rem] md:text-6xl lg:text-[4.2rem] xl:text-[4.8rem] leading-[1.05] font-bold font-cabin italic mb-6">
              <span className="text-white block">REDUZA CUSTOS.</span>
              <span className="text-[#39FF14] block">OTIMIZE</span>
              {/* Componente da Roleta na linha de baixo */}
              <div className="h-[1.15em] overflow-hidden inline-block vertical-align-bottom relative font-black mt-1 text-[#39FF14]">
                <div
                  ref={slotListRef}
                  className="flex flex-col transition-transform duration-600"
                  style={{
                    transform: `translateY(-${slotIndex * 25}%)`,
                    transition: "transform 0.6s cubic-bezier(0.65, 0, 0.35, 1)",
                  }}
                >
                  {slotItems.map((item, idx) => (
                    <span
                      key={idx}
                      className="block h-[1.15em] line-height-[1.15em] text-[#39FF14]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </h2>

            <p className="text-white/60 font-light text-base md:text-lg max-w-xl mb-10 leading-relaxed font-sans">
              Web Design de alta performance e automação de CRM/SaaS. Entregamos arquitetura digital de
              ponta para empresas que buscam eficiência máxima, além de ajudar pequenas e médias
              empresas a alavancarem sua presença digital.
            </p>

            {/* Botões CTA Retangulares */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#contato"
                className="bg-[#39FF14] text-black px-8 py-3.5 rounded-sm font-bold text-sm uppercase tracking-wide hover:bg-white transition-colors duration-300 flex items-center gap-2"
              >
                Iniciar Projeto
                <ArrowUpRight size={18} strokeWidth={2.5} />
              </a>
              <a
                href="#projetos"
                className="border border-white/20 text-white px-8 py-3.5 rounded-sm font-bold text-sm uppercase tracking-wide hover:bg-white/10 transition-colors duration-300"
              >
                Ver Portfólio
              </a>
            </div>
          </div>

          {/* Coluna Direita: Imagens e Cards Flutuantes */}
          <div className="absolute inset-0 lg:relative lg:inset-auto lg:w-[50%] h-full min-h-screen lg:min-h-0 flex justify-end items-end pointer-events-none z-0">
            {/* Grafite ao Fundo */}
            <img
              src="https://res.cloudinary.com/djw0tqmiw/image/upload/v1780089101/egwbrwpnemlnq1wign8a.png"
              alt="Grafite Background"
              className="absolute top-[45%] right-[-10%] transform -translate-y-1/2 w-full lg:w-[130%] max-w-none h-auto object-contain opacity-100 pointer-events-none z-0"
            />

            {/* Robô Gigante */}
            <img
              src="https://res.cloudinary.com/djw0tqmiw/image/upload/v1780088351/wewaoybtqawls86r5kpz.png"
              alt="Cyborg Robot"
              className="absolute bottom-[-2rem] right-[-20%] lg:right-[-10%] h-[85vh] lg:h-[95vh] w-auto max-w-none object-contain object-bottom pointer-events-none z-20 drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
            />

            {/* Cards Tech/Cyberpunk Animados com Delays no Float do Framer Motion */}
            <div className="hidden lg:flex flex-col gap-4 w-48 mr-8 lg:mr-16 z-30 pointer-events-auto h-full justify-end pb-32">
              {/* Card 1 */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative bg-[#0a100a]/80 backdrop-blur-md p-4 border border-white/5 hover:border-[#39FF14]/30 transition-colors group rounded-[3px] select-none"
              >
                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#39FF14]"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#39FF14]"></div>

                <div className="text-white/50 text-[10px] font-mono uppercase tracking-widest mb-1">
                  Clientes_Ativos
                </div>
                <div className="text-2xl font-bold text-white tracking-tight font-sans">42</div>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5,
                }}
                className="relative bg-[#0a100a]/80 backdrop-blur-md p-4 border border-white/5 hover:border-[#39FF14]/30 transition-colors group lg:-ml-12 rounded-[3px] select-none"
              >
                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#39FF14]"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#39FF14]"></div>

                <div className="text-white/50 text-[10px] font-mono uppercase tracking-widest mb-1">
                  Uptime_Medio
                </div>
                <div className="text-2xl font-bold text-white tracking-tight font-sans">99.98%</div>
              </motion.div>

              {/* Card 3 */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 3,
                }}
                className="relative bg-[#0a100a]/80 backdrop-blur-md p-4 border border-white/5 hover:border-[#39FF14]/30 transition-colors group rounded-[3px] select-none"
              >
                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#39FF14]"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#39FF14]"></div>

                <div className="text-white/50 text-[10px] font-mono uppercase tracking-widest mb-1">
                  ROI_Medio
                </div>
                <div className="text-2xl font-bold text-white tracking-tight font-sans">3.4x</div>
              </motion.div>
            </div>
          </div>
        </main>

        {/* Indicador de Scroll Centralizado (Mais para cima, cruzando a borda) */}
        <div className="absolute bottom-12 md:bottom-16 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 z-[60] pointer-events-auto">
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold font-mono">
            Descobrir
          </span>
          <div className="w-5 h-8 border border-white/30 rounded-full flex justify-center pt-1.5 bg-[#060806]/40 backdrop-blur-[2px]">
            <motion.div
              animate={{
                y: [0, 8, 0],
                opacity: [1, 0, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-1 h-1.5 bg-[#39FF14] rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
