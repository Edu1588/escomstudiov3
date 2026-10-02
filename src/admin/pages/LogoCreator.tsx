import React, { useState, useRef } from "react";
import { Header } from "../components/Header";
import { 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  Layers, 
  Eye, 
  Palette, 
  Sliders, 
  ShieldCheck, 
  Maximize2, 
  Smartphone, 
  CreditCard, 
  Globe, 
  RefreshCw,
  Zap,
  Info,
  ChevronRight
} from "lucide-react";

interface ColorItem {
  name: string;
  hex: string;
  role: string;
}

interface LogoConcept {
  id: string;
  name: string;
  type: string;
  markType: "monogram" | "symbol" | "emblem";
  rationale: string;
  svg: string;
  monoBlackSvg: string;
  monoWhiteSvg: string;
  colors: ColorItem[];
  typographyRecommendation: string;
  auditScore: number;
  auditNotes: string;
}

const SEGMENT_PRESETS = [
  "Tecnologia & SaaS",
  "Advocacia & Direito",
  "Saúde & Estética",
  "Finanças & Investimentos",
  "Moda & Luxo",
  "Gastronomia & Café",
  "Construção & Arquitetura",
  "Educação & Consultoria"
];

const VIBE_CHIPS = [
  "Minimalista",
  "Monolítico & Austero",
  "Futurista / Cyber",
  "Luxuoso & Nobre",
  "Orgânico & Fluido",
  "Construtivista & Bold",
  "Discreto & Elegante"
];

const COLOR_PALETTES = [
  { name: "Cyber Amber & Dark", val: "Âmbar Dourado (#F59E0B) e Preto Ônix (#0A0A0F)" },
  { name: "Cyan Lumina", val: "Ciano Neon (#06B6D4) e Grafite Noturno (#121217)" },
  { name: "Emerald Precision", val: "Verde Esmeralda (#10B981) e Ardósia Profunda (#09090B)" },
  { name: "Monocromático Luxo", val: "Branco Puro (#FFFFFF) e Preto Absoluto (#000000)" },
  { name: "Deep Cobalt", val: "Azul Cobalto Real (#2563EB) e Platina (#F8FAFC)" }
];

function cleanSvgForDisplay(rawSvg: string, mode: "dark" | "light" | "monoBlack" | "monoWhite" = "dark"): string {
  if (!rawSvg) return "";
  let s = rawSvg.trim();
  s = s.replace(/\\"/g, '"').replace(/\\n/g, ' ').replace(/\\t/g, ' ');
  const match = s.match(/<svg[\s\S]*<\/svg>/i);
  if (match) s = match[0];
  
  s = s.replace(/\s+viewBox="[^"]*"/gi, '');
  s = s.replace(/\s+width="[^"]*"/gi, '');
  s = s.replace(/\s+height="[^"]*"/gi, '');
  s = s.replace(/<svg\b([^>]*)>/i, '<svg$1 viewBox="0 0 512 512" width="100%" height="100%" style="width:100%;height:100%;display:block;">');

  if (mode === "dark" || mode === "monoWhite") {
    // Garante que o desenho seja luminoso sobre o fundo preto/escuro
    s = s.replace(/(fill|stroke|stop-color)="(#0[0-9a-fA-F]{5}|#000|#1[0-9a-fA-F]{5}|black)"/gi, '$1="#f59e0b"');
  }

  return s;
}

export default function LogoCreator() {
  const [brandName, setBrandName] = useState("");
  const [segment, setSegment] = useState("Tecnologia & SaaS");
  const [selectedVibes, setSelectedVibes] = useState<string[]>(["Minimalista", "Futurista / Cyber"]);
  const [colorPref, setColorPref] = useState(COLOR_PALETTES[0].val);
  const [customNotes, setCustomNotes] = useState("");
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [concepts, setConcepts] = useState<LogoConcept[] | null>(null);
  const [selectedConceptIndex, setSelectedConceptIndex] = useState(0);
  
  // Modos de visualização no Lab Test
  const [bgMode, setBgMode] = useState<"dark" | "light" | "monoBlack" | "monoWhite">("dark");
  const [activeTab, setActiveTab] = useState<"overview" | "lab" | "mockups">("overview");
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const activeConcept = concepts ? concepts[selectedConceptIndex] : null;

  const toggleVibe = (vibe: string) => {
    setSelectedVibes(prev => 
      prev.includes(vibe) ? prev.filter(v => v !== vibe) : [...prev, vibe]
    );
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!brandName.trim()) {
      alert("Por favor, informe o nome da marca.");
      return;
    }

    setIsGenerating(true);
    setGenerationStep(1);

    // Passo simulado de feedback para respeitar as fases do logo-design-skill
    const stepTimer1 = setTimeout(() => setGenerationStep(2), 1200);
    const stepTimer2 = setTimeout(() => setGenerationStep(3), 2800);
    const stepTimer3 = setTimeout(() => setGenerationStep(4), 4500);

    try {
      const response = await fetch("/api/gerar-logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName: brandName.trim(),
          segment,
          vibe: selectedVibes.join(", "),
          colorPreferences: colorPref,
          customNotes
        })
      });

      if (!response.ok) {
        throw new Error(`Erro na API (${response.status})`);
      }

      const data = await response.json();
      if (data.concepts && Array.isArray(data.concepts) && data.concepts.length > 0) {
        setConcepts(data.concepts);
        setSelectedConceptIndex(0);
        setActiveTab("overview");
      } else {
        throw new Error("Nenhum conceito retornado.");
      }
    } catch (err: any) {
      console.error("Erro ao gerar logos:", err);
      alert("Não foi possível gerar via IA no momento. Tente novamente ou ajuste os termos.");
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      setIsGenerating(false);
      setGenerationStep(0);
    }
  };

  const handleCopySvg = (svgString: string) => {
    navigator.clipboard.writeText(svgString);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  // Download do arquivo .svg vetorial
  const handleDownloadSvg = (concept: LogoConcept, variant: "original" | "monoBlack" | "monoWhite" = "original") => {
    let content = concept.svg;
    let filenameSuffix = "vector";
    if (variant === "monoBlack") {
      content = concept.monoBlackSvg;
      filenameSuffix = "mono-black";
    } else if (variant === "monoWhite") {
      content = concept.monoWhiteSvg;
      filenameSuffix = "mono-white";
    }

    const blob = new Blob([content], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${brandName.toLowerCase().replace(/\s+/g, "-")}-${concept.id}-${filenameSuffix}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Download rasterizado PNG em altíssima resolução via Canvas
  const handleDownloadPng = (concept: LogoConcept, size: number = 2048) => {
    const svgString = bgMode === "monoBlack" ? concept.monoBlackSvg : bgMode === "monoWhite" ? concept.monoWhiteSvg : concept.svg;
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Se fundo light no modo monoBlack, preenche fundo branco opcional
        if (bgMode === "monoBlack" || bgMode === "light") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, size, size);
        } else if (bgMode === "dark") {
          ctx.fillStyle = "#09090b";
          ctx.fillRect(0, 0, size, size);
        }

        ctx.drawImage(img, 0, 0, size, size);
        const pngUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = pngUrl;
        link.download = `${brandName.toLowerCase().replace(/\s+/g, "-")}-${concept.id}-${size}x${size}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#000000] text-white overflow-hidden">
      <Header title="Logo Studio" subtitle="Motor de Identidade Visual Baseado em logo-design-skill" />

      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-8 custom-scrollbar">
        
        {/* Banner de Apresentação e Boas-Vindas */}
        <div className="relative overflow-hidden border border-white/10 bg-[#09090b] p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="space-y-2 relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-cyan-950/40 border border-cyan/40 text-cyan text-[11px] font-mono uppercase tracking-wider">
              <Sparkles size={13} />
              <span>Skill Ativada: logo-design</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-light text-white tracking-tight">
              Criador de Logos & Identidades Vetoriais
            </h1>
            <p className="text-sm text-white/60 leading-relaxed">
              Baseado nas diretrizes estritas do <span className="text-white font-medium">logo-design-skill</span>: geometria pura em SVG, proporção áurea, ausência total de clichês da indústria e testes rigorosos de contraste e pregnância óptica em 16px.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <div className="px-4 py-3 bg-white/5 border border-white/10 text-right">
              <span className="block font-mono text-[10px] uppercase text-white/40">Canvas Padrão</span>
              <span className="font-mono text-sm font-semibold text-cyan">512 × 512 SVG</span>
            </div>
            <div className="px-4 py-3 bg-white/5 border border-white/10 text-right">
              <span className="block font-mono text-[10px] uppercase text-white/40">Geração Múltipla</span>
              <span className="font-mono text-sm font-semibold text-amber-400">3 Conceitos</span>
            </div>
          </div>
        </div>

        {/* Formulário de Configuração & Briefing */}
        <form onSubmit={handleGenerate} className="border border-white/10 bg-[#09090b] p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Sliders size={18} className="text-cyan" />
              <h2 className="font-serif text-lg text-white">Briefing & Estruturação do Símbolo</h2>
            </div>
            <span className="text-xs font-mono text-white/40">Anti-Cliché Engine v3.0</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Nome da Marca */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-white/70">
                Nome da Marca / Projeto <span className="text-rose-500">*</span>
              </label>
              <input 
                type="text"
                value={brandName}
                onChange={e => setBrandName(e.target.value)}
                placeholder="Ex: Nexus Core, Vivant, Parrot..."
                className="w-full bg-[#121217] border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan transition-colors"
                required
              />
            </div>

            {/* Segmento / Indústria */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-white/70">
                Segmento / Nicho de Mercado
              </label>
              <select
                value={segment}
                onChange={e => setSegment(e.target.value)}
                className="w-full bg-[#121217] border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan transition-colors"
              >
                {SEGMENT_PRESETS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Paleta de Cores */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-white/70">
                Paleta e Harmonia Cromática
              </label>
              <select
                value={colorPref}
                onChange={e => setColorPref(e.target.value)}
                className="w-full bg-[#121217] border border-white/10 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan transition-colors"
              >
                {COLOR_PALETTES.map(p => (
                  <option key={p.name} value={p.val}>{p.name} — {p.val}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Vibe / Personalidade (Chips) */}
          <div className="space-y-2.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-white/70">
              Personalidade Visual & Adjetivos de Marca
            </label>
            <div className="flex flex-wrap gap-2">
              {VIBE_CHIPS.map(vibe => {
                const isSelected = selectedVibes.includes(vibe);
                return (
                  <button
                    key={vibe}
                    type="button"
                    onClick={() => toggleVibe(vibe)}
                    className={`px-3 py-1.5 text-xs font-mono transition-all border ${
                      isSelected 
                        ? "bg-cyan/15 border-cyan text-cyan" 
                        : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {vibe}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Instruções Customizadas */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-white/70">
              Instruções Especiais / Restrições (Opcional)
            </label>
            <input 
              type="text"
              value={customNotes}
              onChange={e => setCustomNotes(e.target.value)}
              placeholder="Ex: Monograma combinando as letras N e C, linhas nítidas, sem curvas desnecessárias..."
              className="w-full bg-[#121217] border border-white/10 px-3.5 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan transition-colors"
            />
          </div>

          {/* Botão de Ação */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-xs text-white/40 font-mono">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Gera 3 variações: Monograma, Símbolo Abstrato e Emblema Moderno</span>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className={`px-6 py-3 font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
                isGenerating 
                  ? "bg-white/10 text-white/40 cursor-not-allowed" 
                  : "bg-cyan hover:bg-cyan-400 text-black font-semibold shadow-lg shadow-cyan/20 active:scale-95"
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Construindo Identidade...</span>
                </>
              ) : (
                <>
                  <Zap size={14} />
                  <span>Gerar 3 Conceitos de Identidade</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Modal / Feedback de Progresso Animado */}
        {isGenerating && (
          <div className="border border-cyan/30 bg-cyan-950/20 p-6 flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-cyan font-mono text-xs uppercase tracking-wider">
                <RefreshCw size={14} className="animate-spin" />
                <span>Processando com Skill logo-design</span>
              </div>
              <h3 className="font-serif text-lg text-white">Construindo geometria vetorial e proporção áurea...</h3>
              <p className="text-xs text-white/60">
                {generationStep === 1 && "Fase 1: Mapeando atributos conceituais e adjetivos de marca..."}
                {generationStep === 2 && "Fase 2: Aplicando filtro anti-clichê da indústria e eliminando metáforas literais..."}
                {generationStep === 3 && "Fase 3: Traçando coordenadas vetoriais SVG no canvas 512x512 com preenchimentos balanceados..."}
                {generationStep >= 4 && "Fase 4: Realizando auditoria óptica de contraste e simulação em 16px..."}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${generationStep >= 1 ? "bg-cyan" : "bg-white/20"}`} />
              <div className={`w-8 h-0.5 ${generationStep >= 2 ? "bg-cyan" : "bg-white/20"}`} />
              <div className={`w-3 h-3 rounded-full ${generationStep >= 2 ? "bg-cyan" : "bg-white/20"}`} />
              <div className={`w-8 h-0.5 ${generationStep >= 3 ? "bg-cyan" : "bg-white/20"}`} />
              <div className={`w-3 h-3 rounded-full ${generationStep >= 3 ? "bg-cyan" : "bg-white/20"}`} />
              <div className={`w-8 h-0.5 ${generationStep >= 4 ? "bg-cyan" : "bg-white/20"}`} />
              <div className={`w-3 h-3 rounded-full ${generationStep >= 4 ? "bg-cyan" : "bg-white/20"}`} />
            </div>
          </div>
        )}

        {/* Exibição dos Conceitos Gerados */}
        {concepts && concepts.length > 0 && activeConcept && (
          <div className="space-y-6">
            
            {/* Barra de Abas e Modos */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("overview")}
                  className={`px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors border-b-2 -mb-[18px] ${
                    activeTab === "overview" 
                      ? "border-cyan text-cyan font-semibold" 
                      : "border-transparent text-white/50 hover:text-white"
                  }`}
                >
                  Visão Geral dos 3 Conceitos
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("lab")}
                  className={`px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors border-b-2 -mb-[18px] flex items-center gap-1.5 ${
                    activeTab === "lab" 
                      ? "border-amber-400 text-amber-400 font-semibold" 
                      : "border-transparent text-white/50 hover:text-white"
                  }`}
                >
                  <Eye size={13} />
                  <span>Laboratório de Teste (16px & Contraste)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("mockups")}
                  className={`px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors border-b-2 -mb-[18px] flex items-center gap-1.5 ${
                    activeTab === "mockups" 
                      ? "border-emerald-400 text-emerald-400 font-semibold" 
                      : "border-transparent text-white/50 hover:text-white"
                  }`}
                >
                  <Layers size={13} />
                  <span>Mockups em Aplicação Real</span>
                </button>
              </div>

              {/* Controles de Fundo */}
              <div className="flex items-center gap-1 bg-[#121217] p-1 border border-white/10">
                <button
                  type="button"
                  onClick={() => setBgMode("dark")}
                  className={`px-2.5 py-1 text-[11px] font-mono transition-colors ${
                    bgMode === "dark" ? "bg-white/15 text-white" : "text-white/40 hover:text-white"
                  }`}
                  title="Fundo Preto"
                >
                  Dark
                </button>
                <button
                  type="button"
                  onClick={() => setBgMode("light")}
                  className={`px-2.5 py-1 text-[11px] font-mono transition-colors ${
                    bgMode === "light" ? "bg-white text-black" : "text-white/40 hover:text-white"
                  }`}
                  title="Fundo Branco"
                >
                  Light
                </button>
                <button
                  type="button"
                  onClick={() => setBgMode("monoBlack")}
                  className={`px-2.5 py-1 text-[11px] font-mono transition-colors ${
                    bgMode === "monoBlack" ? "bg-zinc-800 text-white" : "text-white/40 hover:text-white"
                  }`}
                  title="Monocromático Preto"
                >
                  Mono Black
                </button>
                <button
                  type="button"
                  onClick={() => setBgMode("monoWhite")}
                  className={`px-2.5 py-1 text-[11px] font-mono transition-colors ${
                    bgMode === "monoWhite" ? "bg-zinc-800 text-white" : "text-white/40 hover:text-white"
                  }`}
                  title="Monocromático Branco"
                >
                  Mono White
                </button>
              </div>
            </div>

            {/* TAB 1: VISÃO GERAL DOS 3 CONCEITOS */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {concepts.map((concept, idx) => {
                    const isSelected = selectedConceptIndex === idx;
                    const renderedSvg = bgMode === "monoBlack" ? concept.monoBlackSvg : bgMode === "monoWhite" ? concept.monoWhiteSvg : concept.svg;
                    const cardBg = bgMode === "light" ? "bg-white text-black" : bgMode === "monoBlack" ? "bg-zinc-100 text-black" : "bg-[#09090b] text-white";

                    return (
                      <div 
                        key={concept.id}
                        onClick={() => setSelectedConceptIndex(idx)}
                        className={`group border cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected 
                            ? "border-cyan ring-1 ring-cyan shadow-xl shadow-cyan/10" 
                            : "border-white/10 hover:border-white/30"
                        } ${cardBg}`}
                      >
                        {/* Topo do Card */}
                        <div className="p-4 border-b border-white/10 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] uppercase px-2 py-0.5 bg-cyan/20 text-cyan border border-cyan/40">
                              0{idx + 1}
                            </span>
                            <span className="font-serif text-sm font-medium truncate">
                              {concept.type}
                            </span>
                          </div>
                          <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-1.5 py-0.5">
                            Audit {concept.auditScore}%
                          </span>
                        </div>

                        {/* Visualizador do SVG com prancheta de alto contraste */}
                        <div className={`p-6 flex items-center justify-center min-h-[260px] relative overflow-hidden transition-colors ${
                          bgMode === "light" || bgMode === "monoBlack" 
                            ? "bg-zinc-100" 
                            : "bg-[#0b0b10] bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px]"
                        }`}>
                          <div 
                            className="w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center transition-transform group-hover:scale-105 duration-300 drop-shadow-xl [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:max-h-full"
                            dangerouslySetInnerHTML={{ __html: cleanSvgForDisplay(renderedSvg, bgMode) }} 
                          />
                        </div>

                        {/* Rationale & Info */}
                        <div className="p-4 bg-black/40 border-t border-white/10 space-y-3">
                          <div>
                            <h4 className="font-serif text-base text-white font-medium">{concept.name}</h4>
                            <p className="text-xs text-white/60 line-clamp-3 mt-1 leading-relaxed">
                              {concept.rationale}
                            </p>
                          </div>

                          {/* Cores */}
                          <div className="flex items-center gap-1.5 pt-1">
                            {concept.colors.map(col => (
                              <button
                                key={col.hex}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyColor(col.hex);
                                }}
                                className="w-5 h-5 rounded-full border border-white/20 transition-transform hover:scale-125 relative group/col"
                                style={{ backgroundColor: col.hex }}
                                title={`${col.name}: ${col.hex} (${col.role})`}
                              >
                                {copiedHex === col.hex && (
                                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black px-1.5 py-0.5 text-[9px] font-mono text-cyan whitespace-nowrap border border-cyan/50">
                                    Copiado!
                                  </span>
                                )}
                              </button>
                            ))}
                            <span className="text-[10px] font-mono text-white/40 ml-1">
                              {concept.colors.length} cores
                            </span>
                          </div>

                          {/* Ações do Card */}
                          <div className="flex items-center justify-between pt-2 border-t border-white/5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadSvg(concept);
                              }}
                              className="text-xs font-mono text-cyan hover:text-cyan-300 flex items-center gap-1"
                            >
                              <Download size={13} />
                              <span>SVG</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadPng(concept, 2048);
                              }}
                              className="text-xs font-mono text-white/70 hover:text-white flex items-center gap-1"
                            >
                              <Download size={13} />
                              <span>PNG 2K</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopySvg(concept.svg);
                              }}
                              className="text-xs font-mono text-white/40 hover:text-white flex items-center gap-1"
                            >
                              <Copy size={13} />
                              <span>Código</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Destaque do Conceito Selecionado & Brand Kit */}
                <div className="border border-white/10 bg-[#09090b] p-6 lg:p-8 space-y-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs uppercase px-2 py-0.5 bg-cyan/15 text-cyan border border-cyan/30">
                          {activeConcept.type}
                        </span>
                        <span className="font-mono text-xs text-white/40">Canvas Nativo: 512 × 512 px</span>
                      </div>
                      <h3 className="text-2xl font-serif text-white mt-1">{activeConcept.name}</h3>
                    </div>

                    {/* Botões Rápidos do Brand Kit */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDownloadSvg(activeConcept, "original")}
                        className="px-4 py-2 bg-cyan hover:bg-cyan-400 text-black font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                      >
                        <Download size={14} />
                        <span>Baixar Master SVG</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadPng(activeConcept, 2048)}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                      >
                        <Download size={14} />
                        <span>PNG 2048px</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopySvg(activeConcept.svg)}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/80 font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors border border-white/10"
                      >
                        {copiedCode ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        <span>{copiedCode ? "Copiado!" : "Copiar SVG"}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Visualização Central */}
                    <div className={`lg:col-span-1 border border-white/10 p-6 flex flex-col items-center justify-center min-h-[320px] rounded-xl transition-colors ${
                      bgMode === "light" || bgMode === "monoBlack" 
                        ? "bg-white text-black" 
                        : "bg-[#0b0b10] bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:20px_20px]"
                    }`}>
                      <div 
                        className="w-56 h-56 flex items-center justify-center drop-shadow-2xl [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:max-h-full"
                        dangerouslySetInnerHTML={{ 
                          __html: cleanSvgForDisplay(
                            bgMode === "monoBlack" ? activeConcept.monoBlackSvg : bgMode === "monoWhite" ? activeConcept.monoWhiteSvg : activeConcept.svg,
                            bgMode
                          )
                        }} 
                      />
                      <span className="font-mono text-[10px] uppercase text-white/40 mt-4 tracking-widest">
                        {bgMode === "dark" ? "Visualização Padrão (Dark)" : bgMode}
                      </span>
                    </div>

                    {/* Especificações Técnicas de Design & Identidade */}
                    <div className="lg:col-span-2 space-y-4">
                      <div>
                        <h4 className="font-mono text-xs uppercase tracking-wider text-cyan mb-1.5">
                          Rationale Conceitual & Solução Visual
                        </h4>
                        <p className="text-sm text-white/80 leading-relaxed bg-[#121217] p-4 border border-white/5">
                          {activeConcept.rationale}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-[#121217] p-4 border border-white/5 space-y-2">
                          <span className="block font-mono text-[11px] uppercase tracking-wider text-white/50">
                            Tipografia Recomendada para Lockup
                          </span>
                          <span className="font-serif text-base text-white block">
                            {activeConcept.typographyRecommendation}
                          </span>
                        </div>

                        <div className="bg-[#121217] p-4 border border-white/5 space-y-2">
                          <span className="block font-mono text-[11px] uppercase tracking-wider text-emerald-400">
                            Auditoria Óptica & Retenção
                          </span>
                          <p className="text-xs text-white/70">
                            {activeConcept.auditNotes}
                          </p>
                        </div>
                      </div>

                      {/* Paleta Detalhada */}
                      <div className="space-y-2 pt-2">
                        <span className="block font-mono text-[11px] uppercase tracking-wider text-white/50">
                          Paleta de Cores da Identidade
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {activeConcept.colors.map(col => (
                            <div 
                              key={col.hex}
                              onClick={() => handleCopyColor(col.hex)}
                              className="flex items-center gap-3 p-2 bg-[#121217] border border-white/5 hover:border-white/20 cursor-pointer transition-colors group"
                            >
                              <div 
                                className="w-8 h-8 rounded border border-white/20 shrink-0" 
                                style={{ backgroundColor: col.hex }} 
                              />
                              <div className="min-w-0">
                                <span className="block font-serif text-xs text-white truncate">{col.name}</span>
                                <span className="font-mono text-[10px] text-white/40 group-hover:text-cyan transition-colors">
                                  {copiedHex === col.hex ? "Copiado!" : col.hex}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: LABORATÓRIO DE TESTE (16px, 32px, Contraste) */}
            {activeTab === "lab" && (
              <div className="space-y-6">
                <div className="border border-white/10 bg-[#09090b] p-6 space-y-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <Sliders size={18} className="text-amber-400" />
                      <h3 className="font-serif text-xl text-white">Laboratório de Escala & Resiliência Óptica</h3>
                    </div>
                    <p className="text-sm text-white/60 mt-1">
                      Segundo o manual de marca, um logo de alta performance deve ser imediatamente identificável tanto em um outdoor quanto em um favicon de 16 pixels.
                    </p>
                  </div>

                  {/* Escala Óptica (Favicon Ladder) */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                    {/* 128px */}
                    <div className="border border-white/10 bg-[#121217] p-4 flex flex-col items-center justify-between min-h-[220px]">
                      <span className="font-mono text-[11px] text-white/50 uppercase">128 × 128 px (App Icon)</span>
                      <div 
                        className="w-32 h-32 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full drop-shadow-md"
                        dangerouslySetInnerHTML={{ __html: cleanSvgForDisplay(bgMode === "monoBlack" ? activeConcept.monoBlackSvg : bgMode === "monoWhite" ? activeConcept.monoWhiteSvg : activeConcept.svg, bgMode) }}
                      />
                      <button
                        type="button"
                        onClick={() => handleDownloadPng(activeConcept, 128)}
                        className="text-[10px] font-mono text-cyan hover:underline"
                      >
                        Baixar PNG 128px
                      </button>
                    </div>

                    {/* 64px */}
                    <div className="border border-white/10 bg-[#121217] p-4 flex flex-col items-center justify-between min-h-[220px]">
                      <span className="font-mono text-[11px] text-white/50 uppercase">64 × 64 px (Touch Icon)</span>
                      <div 
                        className="w-16 h-16 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full drop-shadow-md"
                        dangerouslySetInnerHTML={{ __html: cleanSvgForDisplay(bgMode === "monoBlack" ? activeConcept.monoBlackSvg : bgMode === "monoWhite" ? activeConcept.monoWhiteSvg : activeConcept.svg, bgMode) }}
                      />
                      <button
                        type="button"
                        onClick={() => handleDownloadPng(activeConcept, 64)}
                        className="text-[10px] font-mono text-cyan hover:underline"
                      >
                        Baixar PNG 64px
                      </button>
                    </div>

                    {/* 32px */}
                    <div className="border border-white/10 bg-[#121217] p-4 flex flex-col items-center justify-between min-h-[220px]">
                      <span className="font-mono text-[11px] text-white/50 uppercase">32 × 32 px (Favicon Retina)</span>
                      <div 
                        className="w-8 h-8 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full drop-shadow-md"
                        dangerouslySetInnerHTML={{ __html: cleanSvgForDisplay(bgMode === "monoBlack" ? activeConcept.monoBlackSvg : bgMode === "monoWhite" ? activeConcept.monoWhiteSvg : activeConcept.svg, bgMode) }}
                      />
                      <button
                        type="button"
                        onClick={() => handleDownloadPng(activeConcept, 32)}
                        className="text-[10px] font-mono text-cyan hover:underline"
                      >
                        Baixar Favicon 32px
                      </button>
                    </div>

                    {/* 16px Pixel Test */}
                    <div className="border border-white/10 bg-[#121217] p-4 flex flex-col items-center justify-between min-h-[220px]">
                      <span className="font-mono text-[11px] text-amber-400 uppercase">16 × 16 px (Browser Tab)</span>
                      <div className="p-3 bg-black/60 border border-white/10 flex items-center justify-center">
                        <div 
                          className="w-4 h-4 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                          dangerouslySetInnerHTML={{ __html: cleanSvgForDisplay(bgMode === "monoBlack" ? activeConcept.monoBlackSvg : bgMode === "monoWhite" ? activeConcept.monoWhiteSvg : activeConcept.svg, bgMode) }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDownloadPng(activeConcept, 16)}
                        className="text-[10px] font-mono text-cyan hover:underline"
                      >
                        Baixar Favicon 16px
                      </button>
                    </div>
                  </div>

                  {/* Teste de Abas de Navegador Realista */}
                  <div className="border border-white/10 bg-[#18181b] p-4 space-y-3">
                    <span className="font-mono text-xs uppercase tracking-wider text-white/50 block">
                      Simulação Real em Aba de Navegador (Chrome / Safari)
                    </span>
                    <div className="flex items-center gap-2 max-w-sm bg-[#09090b] px-3 py-2 border-t-2 border-cyan rounded-t">
                      <div 
                        className="w-4 h-4 shrink-0 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                        dangerouslySetInnerHTML={{ __html: cleanSvgForDisplay(activeConcept.svg, "dark") }}
                      />
                      <span className="font-sans text-xs text-white truncate font-medium">
                        {brandName} — Plataforma Oficial
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: MOCKUPS EM APLICAÇÃO REAL */}
            {activeTab === "mockups" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Mockup 1: Cartão de Visitas Luxo */}
                  <div className="border border-white/10 bg-[#09090b] p-6 space-y-4">
                    <div className="flex items-center gap-2 text-white/70">
                      <CreditCard size={16} className="text-amber-400" />
                      <h4 className="font-serif text-base text-white">Cartão Dark Luxury</h4>
                    </div>
                    
                    <div className="relative aspect-[16/10] bg-gradient-to-br from-[#121217] via-[#09090b] to-[#000000] border border-white/15 p-6 flex flex-col justify-between shadow-2xl overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                      <div className="flex items-center justify-between">
                        <div 
                          className="w-12 h-12 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                          dangerouslySetInnerHTML={{ __html: cleanSvgForDisplay(activeConcept.svg, "dark") }}
                        />
                        <span className="font-mono text-[9px] uppercase tracking-widest text-white/30">Executive Pass</span>
                      </div>
                      <div>
                        <span className="font-serif text-base text-white tracking-wide block">{brandName}</span>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-cyan block mt-0.5">Founders Edition</span>
                      </div>
                    </div>
                  </div>

                  {/* Mockup 2: Ícone de Aplicativo Mobile */}
                  <div className="border border-white/10 bg-[#09090b] p-6 space-y-4">
                    <div className="flex items-center gap-2 text-white/70">
                      <Smartphone size={16} className="text-cyan" />
                      <h4 className="font-serif text-base text-white">Ícone Mobile (iOS / Android)</h4>
                    </div>
                    
                    <div className="aspect-[16/10] bg-[#121217] border border-white/10 p-6 flex flex-col items-center justify-center">
                      <div className="w-24 h-24 rounded-[22px] bg-gradient-to-b from-[#181822] to-[#0a0a0f] border border-white/20 shadow-2xl p-4 flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-cyan/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div 
                          className="w-16 h-16 drop-shadow-lg flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                          dangerouslySetInnerHTML={{ __html: cleanSvgForDisplay(activeConcept.svg, "dark") }}
                        />
                      </div>
                      <span className="font-sans text-xs text-white/80 mt-3 font-medium">{brandName}</span>
                    </div>
                  </div>

                  {/* Mockup 3: Header Institucional */}
                  <div className="border border-white/10 bg-[#09090b] p-6 space-y-4">
                    <div className="flex items-center gap-2 text-white/70">
                      <Globe size={16} className="text-emerald-400" />
                      <h4 className="font-serif text-base text-white">Header Web / Navbar</h4>
                    </div>
                    
                    <div className="aspect-[16/10] bg-[#121217] border border-white/10 p-4 flex flex-col justify-between">
                      <div className="w-full bg-[#09090b] border border-white/10 px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div 
                            className="w-7 h-7 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                            dangerouslySetInnerHTML={{ __html: cleanSvgForDisplay(activeConcept.svg, "dark") }}
                          />
                          <span className="font-serif text-sm font-semibold text-white tracking-tight">{brandName}</span>
                        </div>
                        <div className="hidden sm:flex items-center gap-3 text-[10px] font-mono text-white/50">
                          <span>PRODUTO</span>
                          <span>SOLUÇÕES</span>
                          <span className="text-cyan">PORTAL</span>
                        </div>
                      </div>
                      <div className="text-center py-4">
                        <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">
                          Preview de Interface Web Responsiva
                        </span>
                      </div>
                    </div>
                  </div>


                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
