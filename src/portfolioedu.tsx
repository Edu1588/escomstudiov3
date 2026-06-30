import React, { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { InteractiveTiltCard } from "./components/ui/tilt-card";
import { logPageView } from "./lib/analytics";
import { getPortfolioProjects, PortfolioProject, getExperiences, Experience } from "./firebase";
import { BreakableCard } from "./components/ui/kinetic-shatter-box-section";

function PortfolioEduExtra() {
  useEffect(() => {
    logPageView("Portfolio EDU");
  }, []);
  
  return (
    <div style={{ width: "350px", height: "450px" }}>
      <InteractiveTiltCard
        image={{
          src: "https://res.cloudinary.com/djw0tqmiw/image/upload/v1781623854/dson8tpoeb04giyqooqd.png",
          alt: "Edu Santos",
        }}
        tiltFactor={20}
        hoverScale={1.05}
        shadowIntensity={0.6}
        glareEffect={true}
        glareIntensity={0.4}
      />
    </div>
  );
}

const TABS = ["Web Design", "Social Media", "Designer", "Ilustração"];

function PortfolioGrid() {
  const [projectsList, setProjectsList] = useState<PortfolioProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [activeTab, setActiveTab] = useState("Web Design");

  useEffect(() => {
    getPortfolioProjects().then(data => {
      setProjectsList(data);
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedProject(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filtered = projectsList.filter(p => {
    const tag = (p.tag || '').trim().toLowerCase();
    const active = activeTab.trim().toLowerCase();
    if (!tag) return p.category?.trim().toLowerCase() === active;
    return tag === active;
  });

  if (projectsList.length === 0) return null;

  return (
    <>
      <div className="projects-tabs">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`projects-tab ${activeTab === tab ? 'active' : ''}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="projects-grid">
        {filtered.map((proj, i) => (
          <a 
            href="#" 
            className="project-card" 
            key={proj.id || i}
            onClick={(e) => {
              e.preventDefault();
              setSelectedProject(proj);
            }}
          >
              <div className="project-header">
                <span>PRJ_{String(i + 1).padStart(2, '0')} / {proj.category}</span>
                <span>2026</span>
              </div>
              
              <div className="project-image-placeholder mt-4 mb-4 relative" style={{ padding: 0 }}>
                <img src={proj.image || "https://fakeimg.pl/800x600/111/333?text=Sem+foto"} alt={proj.name} className="w-full h-full object-cover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <span className="project-tag absolute bottom-4 left-4 bg-black/80 px-2 py-1">{proj.category}</span>
              </div>
              
              <div className="project-info mt-auto">
                  <div>
                    <h3 className="project-title">{proj.name}</h3>
                    <p className="project-desc line-clamp-3">{proj.desc}</p>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "11px",
                      color: "#00d1ff",
                      letterSpacing: "1px",
                      marginTop: "8px",
                      display: "inline-block"
                    }}>
                      LER MAIS →
                    </span>
                  </div>
                  <div className="project-link-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  </div>
              </div>
          </a>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-500 font-mono text-sm py-10">
          Nenhum projeto encontrado para "{activeTab}".
        </p>
      )}

      {selectedProject && (
        <div 
          className="custom-modal-overlay"
          onClick={() => setSelectedProject(null)}
        >
          <div 
            className="custom-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="custom-modal-close"
              onClick={() => setSelectedProject(null)}
            >
              FECHAR [X]
            </button>

            <div className="custom-modal-image-col scrollbar-thin">
              <img 
                src={selectedProject.image || "https://fakeimg.pl/800x600/111/333?text=Sem+foto"} 
                alt={selectedProject.name} 
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  objectFit: "contain",
                  objectPosition: "top"
                }} 
              />
            </div>

            <div className="custom-modal-desc-col">
              <div 
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "11px",
                  color: "#00d1ff",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  marginBottom: "16px"
                }}
              >
                // PROJETO // {selectedProject.category}
              </div>

              <h2 
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "30px",
                  fontWeight: 700,
                  color: "#ffffff",
                  letterSpacing: "-1px",
                  lineHeight: "1.1",
                  marginBottom: "24px"
                }}
              >
                {selectedProject.name}
              </h2>

              <div 
                style={{
                  flex: 1,
                  overflowY: "auto",
                  paddingRight: "10px",
                  marginBottom: "24px"
                }}
                className="scrollbar-thin"
              >
                <p 
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "15px",
                    lineHeight: "1.7",
                    color: "#999999",
                    whiteSpace: "pre-wrap"
                  }}
                >
                  {selectedProject.desc}
                </p>
              </div>

              <div 
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                  paddingTop: "20px",
                  marginTop: "auto",
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "11px",
                  color: "#555555"
                }}
              >
                <span>ESTIMATED SCORE: {selectedProject.score || "95%"}</span>
                <span>STATUS: FINALIZADO</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Timeline() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExperiences().then(data => {
      setExperiences(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="text-center font-mono text-xs text-gray-500 py-10">Carregando trajetória...</div>;
  }

  if (experiences.length === 0) {
    const fallbackExperiences: Experience[] = [
      {
        role: "Diretor Criativo",
        company: "ESCOM STUDIO",
        period: "2023 — ATUAL",
        location: "REMOTO",
        desc: "Liderando projetos de design estratégico e plataformas web de alta conversão."
      },
      {
        role: "Head de Design",
        company: "AGÊNCIA DIGITAL XYZ",
        period: "2019 — 2023",
        location: "SÃO PAULO, SP",
        desc: "Gestão da equipe de design, reformulação de processos e inovação criativa."
      },
      {
        role: "Senior UX/UI Designer",
        company: "TECH SOLUTIONS LTDA",
        period: "2016 — 2019",
        location: "REMOTO",
        desc: "Prototipagem, testes de usabilidade e criação de Design Systems globais."
      },
      {
        role: "Designer Gráfico Pleno",
        company: "STUDIO 3",
        period: "2012 — 2016",
        location: "SÃO PAULO, SP",
        desc: "Identidade visual, materiais offline e introdução à interfaces web."
      }
    ];
    
    return (
      <div className="timeline">
        {fallbackExperiences.map((exp, i) => (
          <div className="timeline-item" key={i}>
            <div className="timeline-marker"></div>
            <div className="timeline-date-info">
              <div className="timeline-date">{exp.period}</div>
              <div className="timeline-location">{exp.location}</div>
            </div>
            <div className="timeline-content-box">
              <div className="timeline-role">{exp.role}</div>
              <div className="timeline-company">{exp.company}</div>
              <div className="timeline-desc">{exp.desc}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="timeline">
      {experiences.map((exp, i) => (
        <div className="timeline-item" key={exp.id || i}>
          <div className="timeline-marker"></div>
          <div className="timeline-date-info">
            <div className="timeline-date">{exp.period}</div>
            <div className="timeline-location">{exp.location}</div>
          </div>
          <div className="timeline-content-box">
            <div className="timeline-role">{exp.role}</div>
            <div className="timeline-company">{exp.company}</div>
            <div className="timeline-desc">{exp.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

const container = document.getElementById("tilt-card-root");
if (container) {
  createRoot(container).render(
    <StrictMode>
      <PortfolioEduExtra />
    </StrictMode>
  );
}

const projectsContainer = document.getElementById("projects-root");
if (projectsContainer) {
  createRoot(projectsContainer).render(
    <StrictMode>
      <PortfolioGrid />
    </StrictMode>
  );
}

const timelineContainer = document.getElementById("timeline-root");
if (timelineContainer) {
  createRoot(timelineContainer).render(
    <StrictMode>
      <Timeline />
    </StrictMode>
  );
}

function ShatterSection() {
  const cards = [
    {
      title: "Design de Conversão",
      description: "Direção criativa focada em transformar cliques casuais em conexões de real valor comercial e autoridade no mercado."
    },
    {
      title: "Ecossistemas Digitais",
      description: "Sites integrados, otimizados e sob medida. Toda decisão visual responde a uma pergunta estratégica de negócio."
    },
    {
      title: "Infraestrutura Comercial",
      description: "Mais de uma década desenvolvendo marcas imponentes, arquiteturas limpas e fluxos de automação eficientes."
    },
    {
      title: "Parceria Incomparável",
      description: "Pronto para levar seu negócio ao próximo nível de percepção estética e escala de resultados? Fale conosco."
    }
  ];

  return (
    <div className="shatter-grid">
      {cards.map((c, i) => (
        <div key={i} className="shatter-card-container">
          <BreakableCard
            title={c.title}
            description={c.description}
          />
        </div>
      ))}
    </div>
  );
}

const shatterContainer = document.getElementById("shatter-root");
if (shatterContainer) {
  createRoot(shatterContainer).render(
    <StrictMode>
      <ShatterSection />
    </StrictMode>
  );
}
