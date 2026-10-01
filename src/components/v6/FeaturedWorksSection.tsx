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

  // Carrega projetos cadastrados dinamicamente no Firebase
  useEffect(() => {
    let isMounted = true;

    const fetchFirebaseProjects = async () => {
      try {
        const firebaseData = await getPortfolioProjects();
        if (!isMounted || !firebaseData || firebaseData.length === 0) return;

        // Filtra apenas os que estão marcados para destaque na Home (ou por padrão true)
        const activeFromDb = firebaseData.filter((p) => p.destaque !== false);

        if (activeFromDb.length > 0) {
          // Mapeia os dados do Firebase para o formato do Grid
          const mappedFromDb: DisplayProject[] = activeFromDb.map((p, idx) => ({
            id: p.id || `db-${idx}`,
            client: p.client || p.name || "ESCOM Project",
            title: p.title || p.name || "High-Impact System",
            category: p.category || "WEBSITE",
            deliverables: p.deliverables || p.desc || "UI/UX · SOFTWARE",
            year: p.year ? String(p.year) : "2025",
            badges: Array.isArray(p.badges) && p.badges.length > 0 ? p.badges : ["DEV", "SOTD"],
            video: p.video || "",
            image: p.image || "",
            link: p.link || p.url || "",
            tagType: p.tagType || p.tag || "WEBSITE",
          }));

          // Junta projetos do Firebase com os projetos padrão sem duplicação de nomes
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

          // Projetos do Firebase cadastrados recentemente aparecem primeiro no grid
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
      className="relative bg-[#000000] border-t border-white/10 text-white px-5 py-20 md:px-12 xl:px-[8vw] 2xl:px-[10vw] md:py-32 overflow-hidden"
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
      <div className="relative z-10 mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
        {filteredProjects.map((project) => {
          const isSaved = Boolean(savedProjects[project.id]);

          return (
            <article
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group cursor-pointer select-none flex flex-col"
            >
              {/* CARD DE MÍDIA COM VÍDEO & CANTOS ARREDONDADOS (16:10) */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[#0a0a0a] border border-white/10 group-hover:border-cyan/50 transition-all duration-500 shadow-[0_12px_35px_rgba(0,0,0,0.65)] group-hover:shadow-[0_20px_50px_rgba(0,209,255,0.18)]">
                {project.video ? (
                  <video
                    src={project.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                ) : project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-950 font-mono text-xs text-zinc-600">
                    Sem preview de vídeo
                  </div>
                )}

                {/* Overlay de gradiente inferior para legibilidade editorial */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                {/* Textos no canto inferior esquerdo sobre a imagem (idêntico à referência) */}
                <div className="absolute bottom-3.5 left-4 right-14 pointer-events-none">
                  <span className="block text-[9px] sm:text-[10px] tracking-[0.16em] uppercase font-mono text-zinc-300 font-semibold mb-0.5 opacity-90 drop-shadow">
                    {project.tagType}
                  </span>
                  <h3 className="text-white text-sm sm:text-base font-medium tracking-tight leading-snug line-clamp-1 drop-shadow-md">
                    {project.client} — {project.title}
                  </h3>
                </div>

                {/* Botões no canto inferior direito sobre a imagem (Seta ↗ e Bookmark) */}
                <div className="absolute bottom-3.5 right-3.5 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => toggleBookmark(project.id, e)}
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

              {/* BARRA DE AUTOR / CRÉDITOS & BADGES ABAIXO DA IMAGEM (Idêntica ao Print Awwwards) */}
              <div className="mt-3 flex items-center justify-between px-1">
                {/* Lado esquerdo: Avatar Monograma + Nome Estúdio + Badge PRO */}
                <div className="flex items-center gap-2">
                  <div className="size-5 sm:size-5.5 rounded-full bg-zinc-900 border border-white/20 flex items-center justify-center font-mono text-[9px] font-bold text-cyan">
                    ES
                  </div>
                  <span className="text-xs font-sans font-medium text-white/90">
                    ESCOM Studio
                  </span>
                  <span className="text-[8px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded bg-cyan/15 border border-cyan/40 text-cyan">
                    PRO
                  </span>
                </div>

                {/* Lado direito: Badges em pílula (DEV, SOTD, HM, Ano) */}
                <div className="flex items-center gap-1.5 font-mono text-[9px]">
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
        })}
      </div>

      {/* CTA INFERIOR PARA AGENDAR DIAGNÓSTICO */}
      <div className="relative z-10 mt-16 md:mt-24 pt-10 border-t border-white/10 flex flex-wrap items-center justify-between gap-6">
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
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative w-full max-w-5xl rounded-3xl border border-cyan/40 bg-[#080808] p-4 sm:p-6 shadow-[0_30px_100px_rgba(0,0,0,0.95),0_0_50px_rgba(0,209,255,0.2)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão de Fechar */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 size-10 rounded-full bg-black/80 border border-white/20 flex items-center justify-center text-white/80 hover:text-cyan hover:border-cyan transition-all cursor-pointer"
              title="Fechar (Esc)"
            >
              <X className="size-5" />
            </button>

            {/* Vídeo ou Imagem em Destaque */}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black border border-white/10 shadow-inner">
              {selectedProject.video ? (
                <video
                  src={selectedProject.video}
                  autoPlay
                  controls
                  playsInline
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
