import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowRight, ChevronUp, ChevronDown, Play, ExternalLink, Sparkles } from "lucide-react";
import { DisplayProject } from "./FeaturedWorksSection";

interface RoulettePortfolioCarouselProps {
  projects: DisplayProject[];
  onSelect: (project: DisplayProject) => void;
}

export function RoulettePortfolioCarousel({
  projects,
  onSelect,
}: RoulettePortfolioCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Ângulo alvo e ângulo atual interpolado suavemente (lerp)
  const [targetAngle, setTargetAngle] = useState(0);
  const currentAngleRef = useRef(0);
  const [activeAngle, setActiveAngle] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Arraste com mouse ou touch
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const startAngleRef = useRef(0);

  // Configuração geométrica do cilindro 3D
  const ANGLE_STEP = 24; // Separação angular entre cada slide
  const RADIUS = 620; // Raio do tambor 3D em pixels no desktop
  const totalItems = projects.length;

  // LERP suave a 60-120fps no requestAnimationFrame
  useEffect(() => {
    let animId: number;

    const updateLoop = () => {
      const diff = targetAngle - currentAngleRef.current;
      if (Math.abs(diff) > 0.05) {
        currentAngleRef.current += diff * 0.12; // Suavização com inércia elegante
        setActiveAngle(currentAngleRef.current);
      }
      animId = requestAnimationFrame(updateLoop);
    };

    animId = requestAnimationFrame(updateLoop);
    return () => cancelAnimationFrame(animId);
  }, [targetAngle]);

  // Vínculo com o Scroll da página ("a roleta rola com o scroll")
  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Se a seção estiver próxima ou dentro da tela
      if (rect.bottom > -200 && rect.top < windowHeight + 200) {
        // Progresso relativo do elemento passando pela tela (0.0 a 1.0)
        const totalDistance = rect.height + windowHeight;
        const currentDistance = windowHeight - rect.top;
        const progress = Math.max(0, Math.min(1, currentDistance / totalDistance));

        // Mapeia o progresso do scroll no giro total da roleta
        const maxScrollAngle = Math.max(0, (totalItems - 1) * ANGLE_STEP);
        const scrollTarget = progress * maxScrollAngle;

        // Apenas aplica se o usuário não estiver arrastando manualmente no momento
        if (!isDraggingRef.current) {
          setTargetAngle(scrollTarget);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Inicializa na posição atual
    return () => window.removeEventListener("scroll", handleScroll);
  }, [totalItems, ANGLE_STEP]);

  // Controle de rotação via roda do mouse dentro da área da roleta
  const handleWheel = useCallback((e: React.WheelEvent) => {
    // Se o usuário usar scroll direto sobre o carrossel, move suavemente
    if (Math.abs(e.deltaY) > 5) {
      e.stopPropagation();
      const delta = e.deltaY > 0 ? ANGLE_STEP * 0.7 : -ANGLE_STEP * 0.7;
      const maxAngle = Math.max(0, (totalItems - 1) * ANGLE_STEP);
      setTargetAngle((prev) => Math.max(0, Math.min(maxAngle, prev + delta)));
    }
  }, [totalItems, ANGLE_STEP]);

  // Controle de arrasto com mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    startYRef.current = e.clientY;
    startAngleRef.current = targetAngle;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaY = e.clientY - startYRef.current;
    // Arrastar para cima rola para baixo (avança na roleta)
    const angleChange = (-deltaY / 15) * (ANGLE_STEP / 4);
    const maxAngle = Math.max(0, (totalItems - 1) * ANGLE_STEP);
    setTargetAngle(Math.max(0, Math.min(maxAngle, startAngleRef.current + angleChange)));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Controle de toque em dispositivos móveis
  const handleTouchStart = (e: React.TouchEvent) => {
    isDraggingRef.current = true;
    startYRef.current = e.touches[0].clientY;
    startAngleRef.current = targetAngle;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    const deltaY = e.touches[0].clientY - startYRef.current;
    const angleChange = (-deltaY / 12) * (ANGLE_STEP / 4);
    const maxAngle = Math.max(0, (totalItems - 1) * ANGLE_STEP);
    setTargetAngle(Math.max(0, Math.min(maxAngle, startAngleRef.current + angleChange)));
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  // Botões de navegação Próximo / Anterior
  const handlePrev = () => {
    setTargetAngle((prev) => Math.max(0, prev - ANGLE_STEP));
  };

  const handleNext = () => {
    const maxAngle = Math.max(0, (totalItems - 1) * ANGLE_STEP);
    setTargetAngle((prev) => Math.min(maxAngle, prev + ANGLE_STEP));
  };

  // Identifica o card atualmente em foco frontal
  const currentIndex = Math.min(
    totalItems - 1,
    Math.max(0, Math.round(activeAngle / ANGLE_STEP))
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full py-10 md:py-16 select-none overflow-hidden"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Luz ambiente de profundidade */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[44rem] rounded-full bg-cyan-500/[0.04] blur-[150px] pointer-events-none" />

      {/* CONTROLES SUPERIORES FLUTUANTES (Contador & Navegação rápida) */}
      <div className="relative z-20 flex items-center justify-between mb-8 px-2 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 font-mono text-xs text-zinc-400">
          <span className="text-cyan font-bold text-sm">
            0{currentIndex + 1}
          </span>
          <span>/</span>
          <span>0{totalItems} CASES NO AR</span>
          <span className="hidden sm:inline-block text-zinc-600">|</span>
          <span className="hidden sm:inline-block text-[11px] text-zinc-500 tracking-wider">
            SCROLL OU ARRASTE PARA GIRAR A ROLETA
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="size-9 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 border border-white/15 flex items-center justify-center text-white transition-all cursor-pointer"
            title="Caso Anterior"
            aria-label="Caso Anterior"
          >
            <ChevronUp className="size-4" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === totalItems - 1}
            className="size-9 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 border border-white/15 flex items-center justify-center text-white transition-all cursor-pointer"
            title="Próximo Caso"
            aria-label="Próximo Caso"
          >
            <ChevronDown className="size-4" />
          </button>
        </div>
      </div>

      {/* PALCO 3D COM PERSPECTIVA SUÍÇA E INCLINAÇÃO DIAGONAL (Pinterest Style) */}
      <div
        className="relative mx-auto h-[620px] sm:h-[720px] md:h-[820px] w-full max-w-5xl flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{
          perspective: "1600px",
          perspectiveOrigin: "50% 50%",
        }}
      >
        {/* TAMBOR CILÍNDRICO INCLINADO A ~ -18 GRAUS (Ref: Pinterest Slide Deck Drum) */}
        <div
          ref={trackRef}
          className="relative size-full flex items-center justify-center transform-gpu"
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateZ(-16deg) rotateY(3deg)",
            transition: "transform 0.1s ease-out",
          }}
        >
          {projects.map((project, i) => {
            // Ângulo relativo deste card em relação ao centro frontal da câmera
            const theta = i * ANGLE_STEP - activeAngle;
            const rad = (theta * Math.PI) / 180;

            // Cinemática cilíndrica vertical
            const translateY = RADIUS * Math.sin(rad);
            const translateZ = RADIUS * (Math.cos(rad) - 1);
            const rotateX = -theta;

            // Fator de profundidade: 1.0 no centro frontal, decai nas extremidades
            const cosVal = Math.cos(rad);
            const isVisible = cosVal > -0.15; // Oculta cards na parte traseira oculta
            const scale = Math.max(0.68, Math.min(1.04, 0.72 + 0.32 * cosVal));
            const opacity = Math.max(0, Math.min(1, (cosVal + 0.15) / 1.15));
            const isCenter = Math.abs(theta) < ANGLE_STEP * 0.65;
            const isHovered = hoveredIndex === i;

            if (!isVisible) return null;

            return (
              <div
                key={project.id}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => onSelect(project)}
                className="roulette-card absolute w-[90vw] sm:w-[540px] md:w-[640px] lg:w-[700px] aspect-[16/10] rounded-2xl md:rounded-3xl cursor-pointer transition-all duration-300 transform-gpu group"
                style={{
                  transformStyle: "preserve-3d",
                  transform: `translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) scale(${scale})`,
                  opacity,
                  zIndex: Math.round(cosVal * 100),
                  willChange: "transform, opacity",
                }}
              >
                {/* CONTAINER DO SLIDE COM BORDA METÁLICA E SOMBRA PROFUNDA */}
                <div
                  className={`relative size-full overflow-hidden rounded-2xl md:rounded-3xl bg-[#090909] border transition-all duration-500 shadow-[0_30px_90px_rgba(0,0,0,0.92)] ${
                    isHovered || isCenter
                      ? "border-cyan/50 shadow-[0_35px_100px_rgba(0,209,255,0.22)]"
                      : "border-white/15"
                  }`}
                >
                  {/* IMAGEM PRINCIPAL DO SLIDE */}
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      className={`size-full object-cover transition-transform duration-700 ease-out ${
                        isHovered ? "scale-105" : "scale-100 group-hover:scale-105"
                      }`}
                    />
                  ) : (
                    <div className="size-full flex items-center justify-center bg-gradient-to-br from-zinc-900 to-black font-mono text-sm text-zinc-500">
                      ESCOM Studio Case
                    </div>
                  )}

                  {/* VÍDEO NO HOVER (Toca imediatamente ao passar o mouse) */}
                  {project.video && (
                    <video
                      src={project.video}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className={`absolute inset-0 size-full object-cover z-10 transition-opacity duration-300 ${
                        isHovered ? "opacity-100" : "opacity-0 group-hover:opacity-100 pointer-events-none"
                      }`}
                    />
                  )}

                  {/* OVERLAY SUTIL QUANDO REPOUSO */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/30 transition-opacity duration-300 ${
                      isHovered ? "opacity-30" : "opacity-80 group-hover:opacity-30"
                    }`}
                  />

                  {/* TAGS PERMANENTES DISCRETAS (Canto superior esquerdo) */}
                  <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-20 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md border border-white/20 font-mono text-[9px] sm:text-[10px] uppercase font-bold text-cyan tracking-wider">
                      {project.tagType}
                    </span>
                    <span className="px-2 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 font-mono text-[9px] sm:text-[10px] font-semibold text-zinc-300">
                      {project.year}
                    </span>
                  </div>

                  {/* IDENTIFICAÇÃO BÁSICA DO CLIENTE NO RODAPÉ DO CARD */}
                  <div
                    className={`absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-20 flex items-center justify-between transition-all duration-300 ${
                      isHovered
                        ? "opacity-0 translate-y-3 pointer-events-none"
                        : "opacity-100 translate-y-0 group-hover:opacity-0 group-hover:translate-y-3 pointer-events-none"
                    }`}
                  >
                    <div>
                      <span className="block font-sans font-bold text-base sm:text-xl text-white drop-shadow-md">
                        {project.client}
                      </span>
                      <span className="block font-mono text-[10px] sm:text-xs text-zinc-400">
                        {project.title}
                      </span>
                    </div>

                    <div className="size-8 sm:size-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                      <Play className="size-3.5 sm:size-4 fill-white ml-0.5" />
                    </div>
                  </div>

                  {/* ══════════════════════════════════════════════════════════
                      PAINEL COMPLETO DE INFORMAÇÕES REVELADO NO HOVER
                      ("no hover de thumb aparece as infos do projeto")
                     ══════════════════════════════════════════════════════════ */}
                  <div
                    className={`roulette-hud absolute inset-0 z-30 p-5 sm:p-7 md:p-9 flex flex-col justify-between bg-black/90 backdrop-blur-xl border-2 border-cyan/60 transition-all duration-300 ease-out opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto`}
                    style={
                      isHovered
                        ? { opacity: 1, transform: "translateY(0)", pointerEvents: "auto" }
                        : undefined
                    }
                  >
                    {/* Topo do HUD de Informações */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] sm:text-[11px] font-bold text-cyan uppercase tracking-widest bg-cyan/15 px-3 py-1 rounded-full border border-cyan/30">
                          <span className="size-1.5 rounded-full bg-cyan animate-pulse" />
                          <span>{project.category}</span>
                        </span>
                        <span className="font-mono text-[10px] sm:text-[11px] text-zinc-400 bg-white/10 px-2.5 py-1 rounded-full border border-white/15">
                          {project.year}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px]">
                        {project.badges.map((b, bI) => (
                          <span
                            key={bI}
                            className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider border ${
                              b === "SOTD"
                                ? "bg-amber-400/20 text-amber-300 border-amber-400/40"
                                : "bg-cyan/20 text-cyan border-cyan/40"
                            }`}
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Centro do HUD: Título e Detalhes */}
                    <div className="my-auto py-2">
                      <h4 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-light tracking-tight leading-tight">
                        {project.client}
                      </h4>
                      <p className="mt-1 text-sm sm:text-base text-zinc-200 font-sans font-medium">
                        {project.title}
                      </p>
                      <p className="mt-2 text-xs sm:text-sm font-mono text-cyan tracking-wide">
                        {project.deliverables}
                      </p>
                    </div>

                    {/* Rodapé do HUD: Botão de Interação Imediata */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/15">
                      <span className="font-mono text-[10px] sm:text-[11px] text-zinc-400">
                        CLIQUE PARA ABRIR O CASE COMPLETO
                      </span>

                      <div className="inline-flex items-center gap-2 bg-white text-black group-hover:bg-cyan px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-lg">
                        <span>Ver Projeto</span>
                        <ArrowRight className="size-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* INDICADORES EM PONTOS / BARRA DE PROGRESSO INFERIOR */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {projects.map((_, i) => (
          <button
            key={i}
            onClick={() => setTargetAngle(i * ANGLE_STEP)}
            className={`transition-all rounded-full cursor-pointer ${
              i === currentIndex
                ? "w-8 h-1.5 bg-cyan shadow-[0_0_12px_rgba(0,209,255,0.6)]"
                : "w-2 h-1.5 bg-white/20 hover:bg-white/40"
            }`}
            title={`Ir para caso 0${i + 1}`}
            aria-label={`Ir para caso 0${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default RoulettePortfolioCarousel;
