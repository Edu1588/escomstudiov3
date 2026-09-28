import React from "react";
import MusicPortfolio, { type PortfolioProject } from "@/components/ui/music-portfolio";

const worksProjects: PortfolioProject[] = [
  {
    id: 1,
    artist: "ACADEMIA GAVIÕES",
    album: "PLATAFORMA & WEB APP",
    category: "ECOSSISTEMA DIGITAL",
    label: "UI/UX · WEB APP · CRO",
    year: "2025",
    video: "https://res.cloudinary.com/djw0tqmiw/video/upload/v1790374497/450e2001cc633e92a38d435f6f4c232b.mp4",
  },
  {
    id: 2,
    artist: "UBAH DESIGN",
    album: "EXPERIÊNCIA 3D BRAND",
    category: "HIGH-END DESIGN",
    label: "THREE.JS · 120FPS · BRANDING",
    year: "2025",
    video: "https://res.cloudinary.com/djw0tqmiw/video/upload/v1790374497/b3ecccbe43103abe5da4f3b610af3a37.mp4",
  },
  {
    id: 3,
    artist: "MOA PRO",
    album: "SISTEMA DE GERAÇÃO LEADS",
    category: "AUTOMAÇÃO & IA",
    label: "AGENTES IA · FUNIL CRO",
    year: "2024",
    video: "https://res.cloudinary.com/djw0tqmiw/video/upload/v1790374501/dk5kshrywj6gti0f816w.mp4",
  },
  {
    id: 4,
    artist: "GOLONI MOBILIÁRIO",
    album: "CATÁLOGO DIGITAL B2B",
    category: "E-COMMERCE B2B",
    label: "DESIGN SUÍÇO · PERFORMANCE",
    year: "2024",
    video: "https://res.cloudinary.com/djw0tqmiw/video/upload/v1790374496/0263c8292333293669f42df6e2782ea6.mp4",
  },
  {
    id: 5,
    artist: "FULL ENGLISH SCHOOL",
    album: "PORTAL & MATRÍCULAS",
    category: "EDTECH & CAPTAÇÃO",
    label: "FULLSTACK NEXT.JS · SEO",
    year: "2024",
    video: "https://res.cloudinary.com/djw0tqmiw/video/upload/v1790374497/044516c3efd6b312e96495faa8d4f9ef.mp4",
  },
  {
    id: 6,
    artist: "AUTOSIM FRANQUIAS",
    album: "EXPANSÃO & DASHBOARD",
    category: "FRANCHISING CRM",
    label: "PORTAL BI · GERAÇÃO B2B",
    year: "2024",
    video: "https://res.cloudinary.com/djw0tqmiw/video/upload/v1790374502/043a2a2d03caf1f8adc4e143b2f976c4.mp4",
  },
  {
    id: 7,
    artist: "FÁBRICA PUBLICIDADE",
    album: "HUB INSTITUCIONAL 2026",
    category: "POSICIONAMENTO",
    label: "ENGENHARIA FRONT-END",
    year: "2024",
    video: "https://res.cloudinary.com/djw0tqmiw/video/upload/v1790374732/c1a0adede9aafa4edb54d55eff51287b.mp4",
  },
];

const config = {
  timeZone: "America/Sao_Paulo",
  timeUpdateInterval: 1000,
  idleDelay: 4000,
  debounceDelay: 80,
};

const location = {
  coordinates: "23.5505° S, 46.6333° W",
  city: "SÃO PAULO",
};

const socialLinks = {
  label1: "INICIAR PROJETO",
  label2: "WHATSAPP",
  label3: "INSTAGRAM",
};

interface FeaturedWorksSectionProps {
  Eyebrow?: React.ComponentType<{
    children: React.ReactNode;
    cyan?: boolean;
    light?: boolean;
    className?: string;
  }>;
}

export function FeaturedWorksSection({ Eyebrow }: FeaturedWorksSectionProps) {
  return (
    <section id="trabalhos" className="relative bg-[#000000] border-t border-white/10">
      <MusicPortfolio
        PROJECTS_DATA={worksProjects}
        CONFIG={config}
        LOCATION={location}
        SOCIAL_LINKS={socialLinks}
        title="Alguns de nossos trabalhos"
        subtitle="Soluções completas onde estratégia de posicionamento, design suíço de alta precisão e engenharia de software transformam empresas em líderes de mercado."
      />
    </section>
  );
}

export default FeaturedWorksSection;
