import React, { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrambleTextPlugin);
}

export interface PortfolioProject {
  id: string | number;
  artist: string; // Cliente / Marca
  album: string; // Projeto
  category: string; // Categoria
  label: string; // Entregáveis / Tecnologias
  year: string; // Ano
  image?: string; // URL da Imagem
  video?: string; // URL do Vídeo MP4
  url?: string; // Link externo se houver
}

export interface PortfolioConfig {
  timeZone?: string;
  timeUpdateInterval?: number;
  idleDelay?: number;
  debounceDelay?: number;
}

export interface PortfolioLocation {
  coordinates?: string;
  city?: string;
}

export interface PortfolioSocialLinks {
  label1?: string;
  href1?: string;
  label2?: string;
  href2?: string;
  label3?: string;
  href3?: string;
}

interface MusicPortfolioProps {
  PROJECTS_DATA?: PortfolioProject[];
  CONFIG?: PortfolioConfig;
  LOCATION?: PortfolioLocation;
  SOCIAL_LINKS?: PortfolioSocialLinks;
  title?: string;
  subtitle?: string;
}

// Relógio em tempo real dos cantos
const TimeDisplay = ({ CONFIG = {} }: { CONFIG?: PortfolioConfig }) => {
  const [time, setTime] = useState({ hours: "", minutes: "", dayPeriod: "" });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: CONFIG.timeZone || "America/Sao_Paulo",
        hour12: true,
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      };
      const formatter = new Intl.DateTimeFormat("pt-BR", options);
      const parts = formatter.formatToParts(now);

      setTime({
        hours: parts.find((part) => part.type === "hour")?.value || "",
        minutes: parts.find((part) => part.type === "minute")?.value || "",
        dayPeriod: parts.find((part) => part.type === "dayPeriod")?.value || "",
      });
    };

    updateTime();
    const interval = setInterval(updateTime, CONFIG.timeUpdateInterval || 1000);
    return () => clearInterval(interval);
  }, [CONFIG.timeZone, CONFIG.timeUpdateInterval]);

  return (
    <time className="corner-item bottom-right font-mono" id="current-time">
      <span>{time.hours}</span>
      <span className="time-blink">:</span>
      <span>{time.minutes}</span> {time.dayPeriod}
    </time>
  );
};

// Item individual do projeto
const ProjectItem = ({
  project,
  index,
  onMouseEnter,
  onMouseLeave,
  onClick,
  isActive,
  isIdle,
  setRef,
}: {
  project: PortfolioProject;
  index: number;
  onMouseEnter: (index: number, mediaUrl: string, isVideo: boolean, e: React.MouseEvent) => void;
  onMouseLeave: () => void;
  onClick: (index: number) => void;
  isActive: boolean;
  isIdle: boolean;
  setRef: (el: HTMLLIElement | null) => void;
}) => {
  const textRefs = {
    artist: useRef<HTMLSpanElement>(null),
    album: useRef<HTMLSpanElement>(null),
    category: useRef<HTMLSpanElement>(null),
    label: useRef<HTMLSpanElement>(null),
    year: useRef<HTMLSpanElement>(null),
  };

  useEffect(() => {
    const fields: (keyof typeof textRefs)[] = [
      "artist",
      "album",
      "category",
      "label",
      "year",
    ];

    if (isActive) {
      fields.forEach((key) => {
        const ref = textRefs[key];
        if (ref.current) {
          gsap.killTweensOf(ref.current);
          try {
            gsap.to(ref.current, {
              duration: 0.8,
              scrambleText: {
                text: project[key],
                chars: "qwerty1337h@ck3r01",
                revealDelay: 0.15,
                speed: 0.4,
              },
            });
          } catch {
            ref.current.textContent = project[key];
          }
        }
      });
    } else {
      fields.forEach((key) => {
        const ref = textRefs[key];
        if (ref.current) {
          gsap.killTweensOf(ref.current);
          ref.current.textContent = project[key];
        }
      });
    }
  }, [isActive, project]);

  const mediaUrl = project.video || project.image || "";
  const isVideo = Boolean(project.video || (project.image && project.image.endsWith(".mp4")));

  return (
    <li
      ref={setRef}
      data-project-index={index}
      className={`project-item group ${isActive ? "active" : ""} ${isIdle ? "idle" : ""}`}
      onMouseEnter={(e) => onMouseEnter(index, mediaUrl, isVideo, e)}
      onMouseLeave={onMouseLeave}
      onClick={() => onClick(index)}
    >
      <span ref={textRefs.artist} className="project-data artist hover-text">
        {project.artist}
      </span>
      <span ref={textRefs.album} className="project-data album hover-text font-serif italic text-white/90">
        {project.album}
      </span>
      <span ref={textRefs.category} className="project-data category hover-text hidden md:inline-block text-zinc-400">
        {project.category}
      </span>
      <span ref={textRefs.label} className="project-data label hover-text hidden lg:inline-block text-zinc-400">
        {project.label}
      </span>
      <span ref={textRefs.year} className="project-data year hover-text text-right text-zinc-500 font-mono">
        {project.year}
      </span>
    </li>
  );
};

export function MusicPortfolio({
  PROJECTS_DATA = [],
  LOCATION = {},
  CONFIG = {},
  SOCIAL_LINKS = {},
  title = "Alguns de nossos trabalhos",
  subtitle = "Soluções completas onde estratégia de posicionamento, design suíço de alta precisão e engenharia de software transformam empresas em líderes de mercado.",
}: MusicPortfolioProps) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isIdle, setIsIdle] = useState(true);
  const [activeMedia, setActiveMedia] = useState<{ url: string; isVideo: boolean }>({
    url: PROJECTS_DATA[0]?.video || "",
    isVideo: true,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Posição suave do popup follower
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const popupRef = useRef<HTMLDivElement>(null);
  const popupVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const idleAnimationRef = useRef<gsap.core.Timeline | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const projectItemsRef = useRef<(HTMLLIElement | null)[]>([]);

  // Rastreamento da posição do cursor para o popup flutuante
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (activeIndex === -1) return;
    const x = e.clientX;
    const y = e.clientY;

    if (popupRef.current) {
      const cardWidth = 540;
      const cardHeight = 350;
      const pad = 24;

      // Se estiver muito à direita da tela, inverte para a esquerda do cursor
      let posX = x + pad;
      if (posX + cardWidth > window.innerWidth - pad) {
        posX = x - cardWidth - pad;
      }

      // Se estiver muito abaixo, sobe
      let posY = y - cardHeight / 2;
      if (posY + cardHeight > window.innerHeight - pad) {
        posY = window.innerHeight - cardHeight - pad;
      }
      if (posY < pad) {
        posY = pad;
      }

      gsap.to(popupRef.current, {
        x: posX,
        y: posY,
        duration: 0.18,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  }, [activeIndex]);

  // Animação de idle
  const startIdleAnimation = useCallback(() => {
    if (idleAnimationRef.current) return;

    const timeline = gsap.timeline({
      repeat: -1,
      repeatDelay: 2.5,
    });

    projectItemsRef.current.forEach((item, index) => {
      if (!item) return;

      const hideTime = index * 0.05;
      const showTime = PROJECTS_DATA.length * 0.05 * 0.5 + index * 0.05;

      timeline.to(
        item,
        {
          opacity: 0.25,
          duration: 0.15,
          ease: "power2.inOut",
        },
        hideTime,
      );

      timeline.to(
        item,
        {
          opacity: 1,
          duration: 0.15,
          ease: "power2.inOut",
        },
        showTime,
      );
    });

    idleAnimationRef.current = timeline;
  }, [PROJECTS_DATA.length]);

  const stopIdleAnimation = useCallback(() => {
    if (idleAnimationRef.current) {
      idleAnimationRef.current.kill();
      idleAnimationRef.current = null;

      projectItemsRef.current.forEach((item) => {
        if (item) {
          gsap.set(item, { opacity: 1 });
        }
      });
    }
  }, []);

  const startIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }

    idleTimerRef.current = setTimeout(() => {
      if (activeIndex === -1) {
        setIsIdle(true);
        startIdleAnimation();
      }
    }, CONFIG.idleDelay || 4000);
  }, [activeIndex, startIdleAnimation, CONFIG.idleDelay]);

  const stopIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  const handleProjectMouseEnter = useCallback(
    (index: number, mediaUrl: string, isVideo: boolean, e: React.MouseEvent) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      stopIdleAnimation();
      stopIdleTimer();
      setIsIdle(false);

      setActiveIndex(index);
      setActiveMedia({ url: mediaUrl, isVideo });

      if (popupRef.current) {
        const x = e.clientX;
        const y = e.clientY;
        const cardWidth = 540;
        const cardHeight = 350;
        const pad = 24;

        let posX = x + pad;
        if (posX + cardWidth > window.innerWidth - pad) {
          posX = x - cardWidth - pad;
        }
        let posY = y - cardHeight / 2;
        if (posY + cardHeight > window.innerHeight - pad) {
          posY = window.innerHeight - cardHeight - pad;
        }
        if (posY < pad) posY = pad;

        gsap.set(popupRef.current, { x: posX, y: posY });
      }

      if (popupVideoRef.current && isVideo && mediaUrl) {
        popupVideoRef.current.src = mediaUrl;
        popupVideoRef.current.play().catch(() => {});
      }
    },
    [stopIdleAnimation, stopIdleTimer],
  );

  const handleProjectMouseLeave = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
  }, []);

  const handleContainerMouseLeave = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    setActiveIndex(-1);

    if (popupVideoRef.current) {
      popupVideoRef.current.pause();
    }

    startIdleTimer();
  }, [startIdleTimer]);

  const handleProjectClick = useCallback(
    (index: number) => {
      setMobileActiveIndex(index);
      const proj = PROJECTS_DATA[index];
      if (proj && proj.video && mobileVideoRef.current) {
        mobileVideoRef.current.src = proj.video;
        mobileVideoRef.current.play().catch(() => {});
      }
    },
    [PROJECTS_DATA],
  );

  // Mobile Sticky: IntersectionObserver para atualizar o vídeo sticky conforme rola os projetos
  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth >= 1024) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idxAttr = entry.target.getAttribute("data-project-index");
            if (idxAttr !== null) {
              const idx = parseInt(idxAttr, 10);
              if (!isNaN(idx)) {
                setMobileActiveIndex(idx);
                const proj = PROJECTS_DATA[idx];
                if (proj && proj.video && mobileVideoRef.current) {
                  mobileVideoRef.current.src = proj.video;
                  mobileVideoRef.current.play().catch(() => {});
                }
              }
            }
          }
        });
      },
      {
        rootMargin: "-25% 0px -40% 0px",
        threshold: 0.4,
      },
    );

    projectItemsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [PROJECTS_DATA]);

  useEffect(() => {
    startIdleTimer();
    return () => {
      stopIdleTimer();
      stopIdleAnimation();
    };
  }, [startIdleTimer, stopIdleTimer, stopIdleAnimation]);

  const activeProject = activeIndex !== -1 ? PROJECTS_DATA[activeIndex] : null;
  const currentMobileProject = PROJECTS_DATA[mobileActiveIndex] || PROJECTS_DATA[0];

  return (
    <div
      className="portfolio-wrapper relative select-none"
      onMouseMove={handleMouseMove}
    >
      {/* POPUP PREVIEW CARD FLUTUANTE QUE SEGUE O CURSOR (DESKTOP) */}
      <div
        ref={popupRef}
        className={`pointer-events-none fixed top-0 left-0 z-50 hidden md:block overflow-hidden rounded-2xl border border-cyan/50 bg-[#080808]/95 p-3 shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_40px_rgba(0,209,255,0.35)] backdrop-blur-xl transition-[opacity,transform] duration-200 ${
          activeIndex !== -1
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
        style={{ width: "540px" }}
      >
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-950 border border-white/10 shadow-inner">
          <video
            ref={popupVideoRef}
            src={activeMedia.url}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          />
          <div className="absolute top-3 left-3 flex items-center gap-2 rounded-full bg-black/85 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-cyan backdrop-blur-md border border-cyan/40 shadow-sm">
            <span className="size-2 rounded-full bg-cyan animate-pulse" />
            <span className="font-semibold">{activeProject?.artist}</span>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between px-2 py-0.5 font-mono text-xs">
          <span className="text-white font-medium truncate max-w-[340px]">
            {activeProject?.album}
          </span>
          <span className="text-cyan font-mono font-semibold">{activeProject?.year}</span>
        </div>
      </div>

      {/* Elementos Técnicos dos Cantos (Corner Elements) */}
      <aside className="corner-elements hidden sm:block">
        <div className="corner-item top-left flex items-center gap-2">
          <div className="corner-square" aria-hidden="true" />
          <span className="text-zinc-400 font-mono text-[10px]">
            ESCOM // PORTFOLIO ARCHIVE
          </span>
        </div>

        <nav className="corner-item top-right flex items-center gap-3 font-mono text-[10px]">
          <a href="#diagnostico" className="hover:text-cyan transition-colors">
            {SOCIAL_LINKS.label1 || "INICIAR PROJETO"}
          </a>
          <span className="text-zinc-600">/</span>
          <a
            href="https://wa.me/5513981062787"
            target="_blank"
            rel="noreferrer"
            className="hover:text-cyan transition-colors"
          >
            {SOCIAL_LINKS.label2 || "WHATSAPP"}
          </a>
          <span className="text-zinc-600">/</span>
          <a
            href="https://instagram.com/escom.studio"
            target="_blank"
            rel="noreferrer"
            className="hover:text-cyan transition-colors"
          >
            {SOCIAL_LINKS.label3 || "INSTAGRAM"}
          </a>
        </nav>

        <div className="corner-item bottom-left font-mono text-[10px] text-zinc-500">
          <span>{LOCATION.coordinates || "23.5505° S, 46.6333° W"}</span>
          <span className="ml-2 text-zinc-600">// {LOCATION.city || "SÃO PAULO"}</span>
        </div>

        <TimeDisplay CONFIG={CONFIG} />
      </aside>

      {/* Conteúdo Principal do Portfólio */}
      <div className="portfolio-content">
        <header className="mb-8 md:mb-14">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan">
            <span className="size-1.5 rounded-full bg-cyan animate-pulse" />
            <span>Portfólio Selecionado // Casos Reais</span>
          </div>
          <h2 className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tight">
            {title}
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-zinc-400 max-w-xl font-sans">
            {subtitle}
          </p>

          {/* Cabeçalho da Tabela Técnica (Desktop) */}
          <div className="hidden md:grid grid-cols-12 gap-6 mt-12 pb-3 border-b border-white/20 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            <span className="col-span-3">01 // Cliente</span>
            <span className="col-span-3">02 // Projeto</span>
            <span className="col-span-3">03 // Categoria</span>
            <span className="col-span-2">04 // Entrega</span>
            <span className="col-span-1 text-right">Ano</span>
          </div>
        </header>

        {/* MOBILE STICKY VIDEO PLAYER AO ROLAR */}
        {currentMobileProject && (
          <div className="md:hidden sticky top-14 z-30 mb-8 rounded-xl border border-cyan/40 bg-black/95 p-2 shadow-2xl backdrop-blur-xl">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-zinc-950 border border-white/10">
              <video
                ref={mobileVideoRef}
                src={currentMobileProject.video}
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover"
              />
              <div className="absolute top-2 left-2 flex items-center gap-1.5 rounded-full bg-black/80 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-cyan backdrop-blur-md border border-cyan/30">
                <span className="size-1.5 rounded-full bg-cyan animate-pulse" />
                <span>{currentMobileProject.artist}</span>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between px-1 font-mono text-[10px] text-zinc-400">
              <span className="text-white font-medium truncate max-w-[200px]">
                {currentMobileProject.album}
              </span>
              <span className="text-cyan font-mono">{currentMobileProject.year}</span>
            </div>
          </div>
        )}

        <main
          ref={containerRef}
          className={`portfolio-container ${activeIndex !== -1 ? "has-active" : ""}`}
          onMouseLeave={handleContainerMouseLeave}
        >
          <ul className="project-list" role="list">
            {PROJECTS_DATA.map((project, index) => (
              <ProjectItem
                key={project.id}
                project={project}
                index={index}
                onMouseEnter={handleProjectMouseEnter}
                onMouseLeave={handleProjectMouseLeave}
                onClick={handleProjectClick}
                isActive={activeIndex !== -1 ? activeIndex === index : (isMobile && mobileActiveIndex === index)}
                isIdle={isIdle}
                setRef={(el) => {
                  projectItemsRef.current[index] = el;
                }}
              />
            ))}
          </ul>
        </main>
      </div>
    </div>
  );
}

export default MusicPortfolio;
