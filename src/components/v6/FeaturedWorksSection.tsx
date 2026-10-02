import React, { useState, useEffect } from "react";
import { ArrowUpRight, X, ArrowRight, Bookmark } from "lucide-react";
import { useLanguage } from "@/components/v6/LanguageContext";
import { InteractiveBlurTitle } from "@/components/v6/InteractiveBlurTitle";
import { getPortfolioProjects, PortfolioProject } from "@/firebase";
import { INITIAL_PORTFOLIO_PROJECTS, PortfolioItem } from "@/data/initialPortfolio";

export interface DisplayProject {
  id: string | number;
  client: string;
  title: string;
  category: string;
  deliverables: string;
  year: string;
  badges: string[];
  video: string;
  image?: string;
  link?: string;
  tagType: string;
}

interface FeaturedProjectCardProps {
  project: DisplayProject;
  isSaved: boolean;
  onToggleBookmark: (id: string | number, e: React.MouseEvent) => void;
  onSelect: (project: DisplayProject) => void;
}

function getInitials(name: string): string {
  if (!name) return "ES";
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function FeaturedProjectCard({
  project,
  isSaved,
  onToggleBookmark,
  onSelect,
}: FeaturedProjectCardProps) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [videoError, setVideoError] = React.useState(false);

  const handleMouseEnter = () => {
    if (videoRef.current && project.video && !videoError) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <article
      onClick={() => onSelect(project)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group cursor-pointer select-none flex flex-col"
    >
      {/* CARD DE MÍDIA COM THUMB PADRÃO E VÍDEO NO HOVER (16:10) */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[#0a0a0a] border border-white/10 group-hover:border-cyan/50 transition-all duration-500 shadow-[0_12px_35px_rgba(0,0,0,0.65)] group-hover:shadow-[0_20px_50px_rgba(0,209,255,0.18)]">
        {/* IMAGEM THUMBNAIL SEMPRE VISÍVEL COMO BASE */}
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-900 to-black font-mono text-xs text-zinc-600">
            ESCOM Studio
          </div>
        )}

        {/* VÍDEO REPRODUZIDO EXCLUSIVAMENTE NO HOVER */}
        {project.video && !videoError && (
          <video
            ref={videoRef}
            src={project.video}
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setVideoError(true)}
            className={`absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-all duration-500 ease-out ${
              isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          />
        )}

        {/* Overlay de gradiente inferior para legibilidade editorial */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

        {/* Textos no canto inferior esquerdo sobre a imagem */}
        <div className="absolute bottom-3.5 left-4 right-14 pointer-events-none">
          <span className="block text-[9px] sm:text-[10px] tracking-[0.16em] uppercase font-mono text-cyan font-bold mb-0.5 opacity-90 drop-shadow">
            {project.tagType}
          </span>
          <h3 className="text-white text-sm sm:text-base font-medium tracking-tight leading-snug line-clamp-1 drop-shadow-md">
            {project.title}
          </h3>
        </div>

        {/* Botões no canto inferior direito sobre a imagem (Seta ↗ e Bookmark) */}
        <div className="absolute bottom-3.5 right-3.5 flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => onToggleBookmark(project.id, e)}
            className="size-7 sm:size-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/70 hover:text-cyan hover:border-cyan/60 hover:scale-105 transition-all"
            title="Salvar projeto"
          >
            <Bookmark
              className={`size-3.5 ${isSaved ? "fill-cyan text-cyan" : ""}`}
            />
          </button>

          <div className="size-7 sm:size-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 group-hover:text-cyan group-hover:border-cyan/60 group-hover:scale-110 transition-all duration-300 shadow-sm">
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </div>

      {/* BARRA DE IDENTIFICAÇÃO DO PROJETO & BADGES ABAIXO DA IMAGEM */}
      <div className="mt-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2 min-w-0">
          <div className="size-5 sm:size-5.5 rounded-full bg-cyan/10 border border-cyan/40 flex items-center justify-center font-mono text-[9px] font-bold text-cyan shrink-0">
            {getInitials(project.client || project.title)}
          </div>
          <span className="text-xs font-sans font-semibold text-white/95 truncate">
            {project.client}
          </span>
          <span className="text-[8px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-zinc-300 shrink-0">
            {project.year || "2025"}
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[9px] shrink-0">
          {project.badges.map((badge, bIdx) => {
            const isSotd = badge === "SOTD";
            const isDev = badge === "DEV";

            return (
              <span
                key={bIdx}
                className={`px-1.5 py-0.5 rounded tracking-wider border font-bold uppercase ${
                  isSotd
                    ? "border-amber-400/50 text-amber-300 bg-amber-400/10"
                    : isDev
                    ? "border-cyan/40 text-cyan bg-cyan/10"
                    : "border-white/20 text-zinc-300 bg-white/5"
                }`}
              >
                {badge}
              </span>
            );
          })}
        </div>
      </div>
    </article>
  );
}

interface FeaturedWorksSectionProps {
  Eyebrow?: React.ComponentType<{
    children: React.ReactNode;
    cyan?: boolean;
    light?: boolean;
    className?: string;
  }>;
}

export function FeaturedWorksSection({ Eyebrow }: FeaturedWorksSectionProps) {
  const { t, language } = useLanguage();
  const fw = t.featuredWorks;

  // Inicia com os 9 cases padrão de alta qualidade para renderização instantânea
  const [projects, setProjects] = useState<DisplayProject[]>(() =>
    INITIAL_PORTFOLIO_PROJECTS.map((item) => ({
      id: item.id,
      client: item.client,
      title: item.title,
      category: item.category,
      deliverables: item.deliverables,
      year: item.year,
      badges: item.badges,
      video: item.video,
      image: item.image,
      link: item.link,
      tagType: item.tagType,
    }))
  );

  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [selectedProject, setSelectedProject] = useState<DisplayProject | null>(null);
  const [savedProjects, setSavedProjects] = useState<Record<string | number, boolean>>({});
  const [videoErrors, setVideoErrors] = useState<Record<string | number, boolean>>({});
  const [lightboxVideoError, setLightboxVideoError] = useState<boolean>(false);

  // Carrega projetos cadastrados dinamicamente no Firebase garantindo apenas projetos com mídia válida
  useEffect(() => {
    let isMounted = true;

    const OBSOLETE_NAMES = [
      "posts diversos",
      "nutritech",
      "gf engenharia",
      "maria malta",
      "leandro lamezi",
      "sem foto",
      "studio one",
      "goloni",
      "estante do escritor",
      "moa pro",
      "full english",
      "ugb",
      "autosim",
      "autosim franquias",
      "rilucci",
      "rilucci iluminação",
    ];

    const fetchFirebaseProjects = async () => {
      try {
        const firebaseData = await getPortfolioProjects();
        if (!isMounted || !firebaseData || firebaseData.length === 0) return;

        // Filtra apenas projetos válidos que NÃO sejam os obsoletos e que tenham vídeo REAL funcionando
        const validFromDb = firebaseData.filter((p) => {
          if (p.destaque === false) return false;
          const titleLower = (p.title || p.name || "").toLowerCase();
          const clientLower = (p.client || "").toLowerCase();
          const isObsolete = OBSOLETE_NAMES.some(
            (obs) => titleLower.includes(obs) || clientLower.includes(obs)
          );
          if (isObsolete) return false;

          // Deve ter URL válida de vídeo com protocolo http e tamanho real
          const hasValidVideo = Boolean(
            p.video &&
            p.video.trim().length > 10 &&
            (p.video.startsWith("http://") || p.video.startsWith("https://"))
          );
          return hasValidVideo;
        });

        if (validFromDb.length > 0) {
          // Mapeia os dados do Firebase para o formato do Grid
          const mappedFromDb: DisplayProject[] = validFromDb.map((p, idx) => {
            // Se for um dos projetos base conhecidos, garante os dados corretos
            const matchingDefault = INITIAL_PORTFOLIO_PROJECTS.find(
              (def) => def.client.toLowerCase().trim() === (p.client || p.name || "").toLowerCase().trim()
            );

            return {
              id: p.id || `db-${idx}`,
              client: p.client || p.name || matchingDefault?.client || "ESCOM Project",
              title: p.title || p.name || matchingDefault?.title || "High-Impact System",
              category: p.category || matchingDefault?.category || "WEBSITE",
              deliverables: p.deliverables || p.desc || matchingDefault?.deliverables || "UI/UX · SOFTWARE",
              year: p.year ? String(p.year) : matchingDefault?.year || "2025",
              badges: Array.isArray(p.badges) && p.badges.length > 0 ? p.badges : matchingDefault?.badges || ["DEV", "SOTD"],
              video: p.video || matchingDefault?.video || "",
              image: p.image || matchingDefault?.image || "",
              link: p.link || p.url || matchingDefault?.link || "",
              tagType: p.tagType || p.tag || matchingDefault?.tagType || "WEBSITE",
            };
          });

          // Junta projetos válidos do Firebase com os projetos oficiais que ainda não estejam no DB
          const dbClientNames = new Set(mappedFromDb.map((p) => p.client.toLowerCase().trim()));
          const remainingDefaults = INITIAL_PORTFOLIO_PROJECTS.filter(
            (p) => !dbClientNames.has(p.client.toLowerCase().trim())
          ).map((item) => ({
            id: item.id,
            client: item.client,
            title: item.title,
            category: item.category,
            deliverables: item.deliverables,
            year: item.year,
            badges: item.badges,
            video: item.video,
            image: item.image,
            link: item.link,
            tagType: item.tagType,
          }));

          setProjects([...mappedFromDb, ...remainingDefaults]);
        }
      } catch (err) {
        console.error("Erro ao sincronizar portfólio dinâmico com Firebase:", err);
      }
    };

    fetchFirebaseProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  // Categorias para filtros
  const categories = [
    { id: "ALL", label: language === "PT" ? "Todos os Projetos" : language === "EN" ? "All Projects" : "Todos los Proyectos" },
    { id: "WEB", label: "Websites & Apps" },
    { id: "BRAND", label: "3D & Branding" },
    { id: "B2B", label: "Sistemas & B2B" },
  ];

  const filteredProjects = projects.filter((p) => {
    if (activeCategory === "ALL") return true;
    if (activeCategory === "WEB") return p.tagType === "WEB APP" || p.tagType === "WEBSITE" || p.tagType === "PORTAL";
    if (activeCategory === "BRAND") return p.tagType === "3D BRAND" || p.tagType === "EXPERIÊNCIA";
    if (activeCategory === "B2B") return p.tagType === "DASHBOARD" || p.tagType === "CATÁLOGO B2B" || p.tagType === "E-COMMERCE";
    return true;
  });

  // Fechar modal no ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedProject(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleBookmark = (id: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedProjects((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section
      id="trabalhos"
      className="relative bg-[#000000] border-t border-white/10 text-white px-5 pt-12 pb-6 md:px-12 xl:px-[8vw] 2xl:px-[10vw] md:pt-16 md:pb-8 overflow-hidden"
    >
      {/* Luz ambiente de fundo sutil */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 size-[42rem] rounded-full bg-cyan-500/[0.035] blur-[140px] pointer-events-none" />

      {/* CABEÇALHO EDITORIAL SUÍÇO */}
      <div className="relative z-10 max-w-5xl">
        {Eyebrow ? (
          <Eyebrow cyan>{fw.tag}</Eyebrow>
        ) : (
          <div className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan">
            <span className="size-1.5 rounded-full bg-cyan animate-pulse" />
            <span>{fw.tag}</span>
          </div>
        )}

        <InteractiveBlurTitle
          as="h2"
          className="mt-6 md:mt-10 font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light text-white tracking-tight leading-[1.08]"
        >
          {fw.title}
        </InteractiveBlurTitle>

        <p className="mt-4 md:mt-6 text-xs sm:text-sm md:text-base text-zinc-400 max-w-2xl font-sans leading-relaxed">
          {fw.subtitle}
        </p>
      </div>

      {/* BARRA DE FILTROS & CONTADOR ESTILO AWWWARDS */}
      <div className="relative z-10 mt-10 md:mt-14 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full font-mono text-[10px] sm:text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-white text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.25)]"
                  : "bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/10"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
          <span className="text-cyan font-semibold">
            {filteredProjects.length < 10 ? `0${filteredProjects.length}` : filteredProjects.length}
          </span>
          <span>/</span>
          <span>
            {projects.length < 10 ? `0${projects.length}` : projects.length} CASES
          </span>
        </div>
      </div>

      {/* GRID DE CARDS ESTILO AWWWARDS (3 COLUNAS) */}
      <div className="relative z-10 mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
        {filteredProjects.map((project) => (
          <FeaturedProjectCard
            key={project.id}
            project={project}
            isSaved={Boolean(savedProjects[project.id])}
            onToggleBookmark={toggleBookmark}
            onSelect={setSelectedProject}
          />
        ))}
      </div>

      {/* CTA INFERIOR PARA AGENDAR DIAGNÓSTICO (ESPAÇAMENTO OTIMIZADO) */}
      <div className="relative z-10 mt-8 md:mt-10 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-6">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan">
            ✦ HIGH-IMPACT ARCHITECTURE
          </span>
          <h4 className="mt-2 font-serif text-xl sm:text-2xl text-white font-light">
            Sua empresa precisa de um sistema digital desse nível?
          </h4>
        </div>
        <a
          href="#diagnostico"
          className="inline-flex items-center gap-3 bg-white text-black hover:bg-cyan hover:text-black px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_35px_rgba(0,209,255,0.4)]"
        >
          <span>Iniciar diagnóstico de projeto</span>
          <ArrowRight className="size-4" />
        </a>
      </div>

      {/* MODAL / LIGHTBOX DE VÍDEO EXPANDIDO AO CLICAR EM QUALQUER CARD */}
      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 sm:p-6 md:p-10 animate-in fade-in duration-200"
          onClick={() => {
            setSelectedProject(null);
            setLightboxVideoError(false);
          }}
        >
          <div
            className="relative w-full max-w-5xl rounded-3xl border border-cyan/40 bg-[#080808] p-4 sm:p-6 shadow-[0_30px_100px_rgba(0,0,0,0.95),0_0_50px_rgba(0,209,255,0.2)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão de Fechar */}
            <button
              onClick={() => {
                setSelectedProject(null);
                setLightboxVideoError(false);
              }}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 size-10 rounded-full bg-black/80 border border-white/20 flex items-center justify-center text-white/80 hover:text-cyan hover:border-cyan transition-all cursor-pointer"
              title="Fechar (Esc)"
            >
              <X className="size-5" />
            </button>

            {/* Vídeo ou Imagem em Destaque */}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black border border-white/10 shadow-inner">
              {selectedProject.video && !lightboxVideoError ? (
                <video
                  src={selectedProject.video}
                  poster={selectedProject.image}
                  autoPlay
                  controls
                  playsInline
                  onError={() => setLightboxVideoError(true)}
                  className="w-full h-full object-cover"
                />
              ) : selectedProject.image ? (
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600 font-mono text-sm">
                  Sem mídia disponível
                </div>
              )}
            </div>

            {/* Informações Completas do Case */}
            <div className="mt-5 sm:mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
              <div>
                <div className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-wider text-cyan">
                  <span>{selectedProject.category}</span>
                  <span className="text-zinc-600">//</span>
                  <span>{selectedProject.year}</span>
                </div>
                <h3 className="mt-1 font-serif text-xl sm:text-2xl md:text-3xl text-white font-light">
                  {selectedProject.client} — {selectedProject.title}
                </h3>
                <p className="mt-1 text-xs text-zinc-400 font-mono">
                  {selectedProject.deliverables}
                </p>
              </div>

              <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
                {selectedProject.link && (
                  <a
                    href={selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2.5 font-mono text-xs uppercase tracking-wider transition-all"
                  >
                    <span>Ver site ao vivo</span>
                    <ArrowUpRight className="size-3.5" />
                  </a>
                )}

                <a
                  href="#diagnostico"
                  onClick={() => setSelectedProject(null)}
                  className="inline-flex items-center gap-2 bg-cyan text-black hover:bg-white px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-all rounded-none shadow-[0_0_25px_rgba(0,209,255,0.3)]"
                >
                  <span>Quero um projeto semelhante</span>
                  <ArrowRight className="size-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default FeaturedWorksSection;
