"use client";

import React from "react";
import { GlassyCarousel, GlassyCarouselItem } from "@/components/ui/glassy-coverflow-carousel";

const ESCOM_PROJECTS_ITEMS: GlassyCarouselItem[] = [
  {
    id: "construtora-3d",
    title: "Espelho de Vendas 3D",
    subtitle: "Construtoras & Incorporadoras · 2025",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    accent: "#f6c65b",
    description: "Tabela e maquete 3D interativa com disponibilidade de unidades em tempo real, filtro por pavimento e simulação financeira no browser.",
    href: "/construtora",
    linkLabel: "Explorar Maquete 3D",
  },
  {
    id: "outgrid-r7",
    title: "R7 Motors · Showroom 3D",
    subtitle: "Plataforma Automotiva High-End · 2025",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80",
    accent: "#00d1ff",
    description: "Visualizador tridimensional em WebGL com customização de cores, aerodinâmica interativa e pipeline de reserva direta integrada ao CRM.",
    href: "#",
    linkLabel: "Ver Sistema de Vendas",
  },
  {
    id: "clothing-rail",
    title: "Atelier Haute Couture",
    subtitle: "E-commerce Editorial & Vestuário · 2025",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    accent: "#00e6a5",
    description: "Experiência de compra com física de arara realista: rotação de peças em 360°, inspeção de corte/tecido e conversão com fricção zero.",
    href: "#",
    linkLabel: "Acessar Loja",
  },
  {
    id: "ubah-design",
    title: "UBAH Design Studio",
    subtitle: "Branding & Arquitetura Visual · 2025",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    accent: "#a855f7",
    description: "Posicionamento e plataforma institucional com tipografia brutalista, design system unificado e microinterações premiadas.",
    href: "https://ubah.com.br",
    linkLabel: "Visitar Website",
  },
  {
    id: "goloni-mobiliario",
    title: "Goloni Urban Furniture",
    subtitle: "Catálogo B2B & Sistema Digital · 2025",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
    accent: "#3b82f6",
    description: "Catálogo inteligente para arquitetos e construtoras com orçamentação automatizada e visualização de especificações técnicas.",
    href: "https://goloni.com.br",
    linkLabel: "Ver Projeto",
  },
  {
    id: "full-english",
    title: "Full English Hub",
    subtitle: "EdTech & Experiência de Usuário · 2024",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    accent: "#ec4899",
    description: "Portal de imersão linguística gamificado com dashboard de retenção e métricas de engajamento em tempo real.",
    href: "https://fullenglish.com.br",
    linkLabel: "Acessar Case",
  },
];

export function EscomGlassyCoverflow() {
  return (
    <div className="w-full relative rounded-3xl overflow-hidden border border-white/10 bg-[#04060a] shadow-[0_25px_80px_rgba(0,0,0,0.9)]">
      <div className="dark">
        <GlassyCarousel
          items={ESCOM_PROJECTS_ITEMS}
          layout="website"
          initialIndex={1}
          autoPlay={true}
          interval={5000}
          label="Projetos Selecionados ESCOM Studio"
          style={
            {
              "--color-background": "#04060a",
              "--color-foreground": "#ffffff",
              "--color-card": "#0c1017",
              "--color-card-foreground": "#ffffff",
              "--color-muted-foreground": "#8592a6",
              "--color-border": "rgba(255, 255, 255, 0.12)",
              "--color-primary": "#00d1ff",
              "--color-primary-foreground": "#000000",
              "--carousel-shadow-color": "#000000",
              minHeight: "560px",
              height: "auto",
              maxHeight: "720px",
            } as React.CSSProperties
          }
        />
      </div>
    </div>
  );
}

export default EscomGlassyCoverflow;
