"use client";

import React, { useState } from "react";
import { ArrowRight, Sparkles, Building2, Car, ShoppingBag, Layers, ExternalLink } from "lucide-react";
import { useLanguage } from "@/components/v6/LanguageContext";
import { InteractiveBlurTitle } from "@/components/v6/InteractiveBlurTitle";
import BuildingShowcase3D from "./BuildingShowcase3D";
import CarShowcase3D from "./CarShowcase3D";
import ClothingRailShowcase from "./ClothingRailShowcase";
import EscomGlassyCoverflow from "./EscomGlassyCoverflow";

interface FeaturedWorksSectionProps {
  Eyebrow?: React.ComponentType<{
    children: React.ReactNode;
    cyan?: boolean;
    light?: boolean;
    className?: string;
  }>;
}

export function FeaturedWorksSection({ Eyebrow }: FeaturedWorksSectionProps) {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"all" | "building" | "car" | "fashion" | "coverflow">("all");

  return (
    <section
      id="trabalhos"
      className="relative bg-[#000000] border-t border-white/10 text-white px-5 pt-16 pb-20 md:px-12 xl:px-[8vw] 2xl:px-[10vw] md:pt-24 md:pb-32 overflow-hidden"
    >
      {/* Luz ambiente de fundo sutil sem Three.js contínuo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 size-[42rem] rounded-full bg-cyan-500/[0.03] blur-[150px] pointer-events-none" />

      {/* CABEÇALHO EDITORIAL SUÍÇO */}
      <div className="relative z-10 max-w-5xl">
        {Eyebrow ? (
          <Eyebrow cyan>PROJETOS SELECIONADOS // EXPERIÊNCIAS IMERSIVAS</Eyebrow>
        ) : (
          <div className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan">
            <span className="size-1.5 rounded-full bg-cyan animate-pulse" />
            <span>PROJETOS SELECIONADOS // EXPERIÊNCIAS IMERSIVAS</span>
          </div>
        )}

        <InteractiveBlurTitle
          as="h2"
          className="mt-6 md:mt-10 font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light text-white tracking-tight leading-[1.08]"
        >
          Sistemas e experiências 3D construídos para alta conversão.
        </InteractiveBlurTitle>

        <p className="mt-4 md:mt-6 text-xs sm:text-sm md:text-base text-zinc-400 max-w-3xl font-sans leading-relaxed">
          Substituímos plataformas genéricas e retalhos estáticos por sistemas proprietários com visualização 3D em tempo real, interatividade tátil no browser e engenharia de conversão.
        </p>
      </div>

      {/* BARRA DE NAVEGAÇÃO RÁPIDA ENTRE OS PROJETOS */}
      <div className="relative z-10 mt-10 md:mt-14 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-1.5 rounded-full font-mono text-[10px] sm:text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-white text-black font-bold shadow-[0_0_20px_rgba(255,255,255,0.25)]"
                : "bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/10"
            }`}
          >
            Todos os Projetos
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("building")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-[10px] sm:text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "building"
                ? "bg-cyan text-black font-bold shadow-[0_0_20px_rgba(0,209,255,0.35)]"
                : "bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/10"
            }`}
          >
            <Building2 className="size-3" />
            <span>01 · Construtora 3D</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("car")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-[10px] sm:text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "car"
                ? "bg-cyan text-black font-bold shadow-[0_0_20px_rgba(0,209,255,0.35)]"
                : "bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/10"
            }`}
          >
            <Car className="size-3" />
            <span>02 · Carro 3D Outgrid</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("fashion")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-[10px] sm:text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "fashion"
                ? "bg-cyan text-black font-bold shadow-[0_0_20px_rgba(0,209,255,0.35)]"
                : "bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/10"
            }`}
          >
            <ShoppingBag className="size-3" />
            <span>03 · Loja de Roupas</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("coverflow")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-[10px] sm:text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "coverflow"
                ? "bg-cyan text-black font-bold shadow-[0_0_20px_rgba(0,209,255,0.35)]"
                : "bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/10"
            }`}
          >
            <Layers className="size-3" />
            <span>04 · Portfólio Coverflow</span>
          </button>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
          <span className="size-2 rounded-full bg-[#00e6a5] animate-ping" />
          <span>ROLANDO EM TEMPO REAL</span>
        </div>
      </div>

      {/* JORNADA EM SCROLL COM OS 4 PROJETOS */}
      <div className="mt-12 space-y-24 md:space-y-36">

        {/* ============================================================== */}
        {/* PROJETO 1: CONSTRUTORA 3D (ESPELHO DE VENDAS INTERATIVO)       */}
        {/* ============================================================== */}
        {(activeTab === "all" || activeTab === "building") && (
          <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Coluna de Copy Editorial */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-cyan font-bold tracking-widest">PROJETO // 01</span>
                <span className="text-zinc-600">/</span>
                <span className="font-mono text-[10px] uppercase tracking-wider bg-white/10 border border-white/15 px-2.5 py-0.5 rounded-full text-zinc-300">
                  CONSTRUTORA & INCORPORAÇÃO
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl md:text-5xl font-light text-white leading-[1.12]">
                Espelho de Vendas 3D para Construtoras e Incorporadoras.
              </h3>

              <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
                Cada luz acesa é uma unidade disponível. Substituímos tabelas frias de Excel e PDFs estáticos de corretores por uma maquete tridimensional interativa onde o comprador consulta preços, simula o fluxo de pagamento e visualiza a vista do apartamento por pavimento.
              </p>

              <div className="grid grid-cols-2 gap-4 border-y border-white/10 py-5">
                <div>
                  <div className="font-serif text-2xl sm:text-3xl font-light text-[#f6c65b]">3.2x</div>
                  <div className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 mt-1">Velocidade no Fechamento</div>
                </div>
                <div>
                  <div className="font-serif text-2xl sm:text-3xl font-light text-[#3ddc97]">100%</div>
                  <div className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 mt-1">Disponibilidade ao Vivo</div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-zinc-400 font-mono">
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-cyan" />
                  <span>Maquete com iluminação adaptativa dia, entardecer e noite</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-cyan" />
                  <span>Filtro dinâmico por metragem, suítes e valor de entrada</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-cyan" />
                  <span>Link individual com identificação por corretor credenciado</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="/construtora"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#f6c65b] text-[#1b1502] font-mono text-xs font-bold uppercase tracking-wider hover:bg-white transition-all shadow-[0_0_30px_rgba(246,198,91,0.25)]"
                >
                  <span>Experimentar Espelho 3D</span>
                  <ExternalLink className="size-3.5" />
                </a>
              </div>
            </div>

            {/* Coluna Visual do Prédio 3D */}
            <div className="lg:col-span-7">
              <BuildingShowcase3D />
            </div>
          </article>
        )}

        {/* ============================================================== */}
        {/* PROJETO 2: CARRO 3D (OUTGRID R7 MOTORS)                        */}
        {/* ============================================================== */}
        {(activeTab === "all" || activeTab === "car") && (
          <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Coluna Visual do Carro 3D (Esquerda no Desktop para ritmo visual) */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <CarShowcase3D />
            </div>

            {/* Coluna de Copy Editorial */}
            <div className="lg:col-span-5 order-1 lg:order-2 space-y-6">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-cyan font-bold tracking-widest">PROJETO // 02</span>
                <span className="text-zinc-600">/</span>
                <span className="font-mono text-[10px] uppercase tracking-wider bg-white/10 border border-white/15 px-2.5 py-0.5 rounded-full text-zinc-300">
                  AUTOMOTIVO & ALTA PERFORMANCE
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl md:text-5xl font-light text-white leading-[1.12]">
                Showroom Automotivo 3D com Renderização em Tempo Real.
              </h3>

              <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
                Desenvolvido para concessionárias de luxo e importadoras de supercarros. O comprador explora cada detalhe do veículo em 360°, customiza a paleta de cores da pintura e componentes aerodinâmicos diretamente pelo navegador — sem a necessidade de baixar nenhum aplicativo pesado.
              </p>

              <div className="grid grid-cols-2 gap-4 border-y border-white/10 py-5">
                <div>
                  <div className="font-serif text-2xl sm:text-3xl font-light text-[#ff6b00]">60 FPS</div>
                  <div className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 mt-1">Renderização WebGL Fluida</div>
                </div>
                <div>
                  <div className="font-serif text-2xl sm:text-3xl font-light text-cyan">+240%</div>
                  <div className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 mt-1">Conversão de Lead Qualificado</div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-zinc-400 font-mono">
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-cyan" />
                  <span>Modelo físico 3D McLaren Senna CRXW Widebody</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-cyan" />
                  <span>Shader de tinta metálica com reflexos de iluminação de estúdio</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-cyan" />
                  <span>Integração de proposta comercial direta via WhatsApp/CRM</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="#diagnostico"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-white transition-all shadow-[0_0_30px_rgba(0,209,255,0.25)]"
                >
                  <span>Solicitar Sistema Automotivo</span>
                  <ArrowRight className="size-3.5" />
                </a>
              </div>
            </div>
          </article>
        )}

        {/* ============================================================== */}
        {/* PROJETO 3: LOJA DE ROUPAS (PRODUCT RAIL GALLERY)              */}
        {/* ============================================================== */}
        {(activeTab === "all" || activeTab === "fashion") && (
          <article className="space-y-8">
            <div className="max-w-3xl space-y-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-cyan font-bold tracking-widest">PROJETO // 03</span>
                <span className="text-zinc-600">/</span>
                <span className="font-mono text-[10px] uppercase tracking-wider bg-white/10 border border-white/15 px-2.5 py-0.5 rounded-full text-zinc-300">
                  E-COMMERCE & VESTUÁRIO EDITORIAL
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl md:text-5xl font-light text-white leading-[1.12]">
                Arara Interativa com Física Tátil e Visualização Frente e Verso.
              </h3>

              <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
                Trazemos a experiência sensorial de uma boutique de luxo para a tela do smartphone ou desktop. O comprador navega pelas peças penduradas no cabide, puxa a roupa para frente, inspeciona o caimento nas costas e confere detalhes de tecidos e especificações sem recarregar a página.
              </p>
            </div>

            {/* Componente Product Rail Gallery */}
            <ClothingRailShowcase />
          </article>
        )}

        {/* ============================================================== */}
        {/* PROJETO 4: COVERFLOW CAROUSEL (ECOSSISTEMA ESCOM STUDIO)       */}
        {/* ============================================================== */}
        {(activeTab === "all" || activeTab === "coverflow") && (
          <article className="space-y-8 pt-8 border-t border-white/10">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-2xl space-y-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-cyan font-bold tracking-widest">PROJETO // 04</span>
                  <span className="text-zinc-600">/</span>
                  <span className="font-mono text-[10px] uppercase tracking-wider bg-white/10 border border-white/15 px-2.5 py-0.5 rounded-full text-zinc-300">
                    ECOSSISTEMA GLOBAL DE CASES
                  </span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-white leading-tight">
                  Galeria Panorâmica de Operações em Campo.
                </h3>
                <p className="text-zinc-400 text-sm">
                  Deslize ou utilize os controles para navegar entre as soluções proprietárias entregues pela ESCOM Studio.
                </p>
              </div>

              <div className="font-mono text-[11px] text-zinc-400 flex items-center gap-2">
                <Sparkles className="size-3.5 text-cyan" />
                <span>Navegação tátil com profundidade espacial</span>
              </div>
            </div>

            {/* Coverflow Glassy Carousel Integrado */}
            <EscomGlassyCoverflow />
          </article>
        )}

      </div>
    </section>
  );
}

export default FeaturedWorksSection;
