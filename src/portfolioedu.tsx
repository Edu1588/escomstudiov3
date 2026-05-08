import React, { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { InteractiveTiltCard } from "./components/ui/tilt-card";
import { logPageView } from "./lib/analytics";
import { getPortfolioProjects, PortfolioProject } from "./firebase";

function PortfolioEduExtra() {
  useEffect(() => {
    logPageView("Portfolio EDU");
  }, []);
  
  return (
    <div style={{ width: "350px", height: "450px" }}>
      <InteractiveTiltCard
        image={{
          src: "https://eionstudio.com.br/wp-content/uploads/2026/02/about-slide-2.jpg",
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

function PortfolioGrid() {
  const [projectsList, setProjectsList] = useState<PortfolioProject[]>([]);

  useEffect(() => {
    getPortfolioProjects().then(data => {
      const destaques = data.filter(p => p.destaque).slice(0, 4);
      setProjectsList(destaques);
    });
  }, []);

  if (projectsList.length === 0) return null;

  return (
    <div className="projects-grid">
      {projectsList.map((proj, i) => (
        <a href="#" className="project-card" key={i}>
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
                  <p className="project-desc">{proj.desc}</p>
                </div>
                <div className="project-link-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </div>
            </div>
        </a>
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
