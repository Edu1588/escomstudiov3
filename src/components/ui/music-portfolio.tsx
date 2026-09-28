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
  isActive,
  isIdle,
  setRef,
}: {
  project: PortfolioProject;
  index: number;
  onMouseEnter: (index: number, mediaUrl: string, isVideo: boolean) => void;
  onMouseLeave: () => void;
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
      className={`project-item group ${isActive ? "active" : ""} ${isIdle ? "idle" : ""}`}
      onMouseEnter={() => onMouseEnter(index, mediaUrl, isVideo)}
      onMouseLeave={onMouseLeave}
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
  subtitle = "Estratégia, engenharia de alta performance e design suíço aplicados a marcas líderes.",
}: MusicPortfolioProps) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isIdle, setIsIdle] = useState(true);
  const [activeMedia, setActiveMedia] = useState<{ url: string; isVideo: boolean }>({
    url: "",
    isVideo: false,
  });

  const backgroundRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const idleAnimationRef = useRef<gsap.core.Timeline | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const projectItemsRef = useRef<(HTMLLIElement | null)[]>([]);

  // Pré-carregamento suave das mídias
  useEffect(() => {
    PROJECTS_DATA.forEach((project) => {
      if (project.image && !project.image.endsWith(".mp4")) {
        const img = new Image();
        img.src = project.image;
      }
    });
  }, [PROJECTS_DATA]);

  // Animação de idle (pulso discreto nos itens quando o usuário não interage)
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
    (index: number, mediaUrl: string, isVideo: boolean) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      stopIdleAnimation();
      stopIdleTimer();
      setIsIdle(false);

      if (activeIndex === index) return;

      setActiveIndex(index);
      setActiveMedia({ url: mediaUrl, isVideo });

      if (mediaUrl) {
        if (isVideo) {
          if (videoRef.current) {
            videoRef.current.src = mediaUrl;
            videoRef.current.play().catch(() => {});
          }
        }
        if (backgroundRef.current) {
          const bg = backgroundRef.current;
          bg.style.transition = "none";
          bg.style.transform = "translate(-50%, -50%) scale(1.18)";
          if (!isVideo) {
            bg.style.backgroundImage = `url(${mediaUrl})`;
          }
          bg.style.opacity = "1";

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              bg.style.transition =
                "opacity 0.6s ease, transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
              bg.style.transform = "translate(-50%, -50%) scale(1.0)";
            });
          });
        }
      }
    },
    [activeIndex, stopIdleAnimation, stopIdleTimer],
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

    if (backgroundRef.current) {
      backgroundRef.current.style.opacity = "0";
    }
    if (videoRef.current) {
      videoRef.current.pause();
    }

    startIdleTimer();
  }, [startIdleTimer]);

  useEffect(() => {
    startIdleTimer();
    return () => {
      stopIdleTimer();
      stopIdleAnimation();
    };
  }, [startIdleTimer, stopIdleTimer, stopIdleAnimation]);

  return (
    <div className="portfolio-wrapper relative select-none">
      {/* Background Media Container (Imagens e Vídeos com scale & blur cinemáticos) */}
      <div
        ref={backgroundRef}
        className="portfolio-background"
        id="backgroundImage"
        role="img"
        aria-hidden="true"
      >
        {activeMedia.isVideo && (
          <video
            ref={videoRef}
            src={activeMedia.url}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
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
            href="https://wa.me/5511999999999"
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
        <header className="mb-10 md:mb-16">
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
                isActive={activeIndex === index}
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
