import React, { useState } from "react";
import { Header } from "../components/Header";
import { 
  Plus, 
  LayoutTemplate, 
  ExternalLink, 
  Eye, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  Sparkles,
  Globe,
  Copy,
  Layers,
  Search,
  Filter,
  BarChart3
} from "lucide-react";

export default function Paginas() {
  const [filterQuery, setFilterQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("TODAS");

  const paginas = [
    { 
      id: "home", 
      title: "Página Inicial (Home)", 
      path: "/", 
      category: "PRINCIPAL",
      acessos: 1420, 
      leads: 38, 
      conversion: "2.6%", 
      status: "ATIVO",
      desc: "Landing Page oficial da ESCOM Studio com Hero 3D e seções de serviços.",
      previewImg: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
    },
    { 
      id: "portfolio-projetos", 
      title: "Portfólio de Projetos", 
      path: "/portfolio-projetos", 
      category: "PORTFÓLIO",
      acessos: 890, 
      leads: 19, 
      conversion: "2.1%", 
      status: "ATIVO",
      desc: "Vitrine de cases de sucesso, trabalhos realizados e protótipos interativos.",
      previewImg: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80"
    },
    { 
      id: "portfolioedu", 
      title: "Portfólio EDU", 
      path: "/portfolioedu", 
      category: "PORTFÓLIO",
      acessos: 640, 
      leads: 12, 
      conversion: "1.8%", 
      status: "ATIVO",
      desc: "Página personalizada com currículo interativo e projetos acadêmicos.",
      previewImg: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
    },
    { 
      id: "baseproposta", 
      title: "Base de Propostas", 
      path: "/baseproposta", 
      category: "PROSPECÇÃO",
      acessos: 1120, 
      leads: 45, 
      conversion: "4.0%", 
      status: "ATIVO",
      desc: "Template interativo de propostas comerciais com calculadora de escopo.",
      previewImg: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80"
    },
    { 
      id: "home-v3", 
      title: "Home V3 (Modular System)", 
      path: "/home-v3", 
      category: "EXPERIMENTAL",
      acessos: 410, 
      leads: 8, 
      conversion: "1.9%", 
      status: "ATIVO",
      desc: "Versão modular com animações avançadas em GSAP e Lenis smooth scroll.",
      previewImg: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80"
    },
    { 
      id: "sobre", 
      title: "Sobre a ESCOM Studio", 
      path: "/sobre", 
      category: "INSTITUCIONAL",
      acessos: 530, 
      leads: 6, 
      conversion: "1.1%", 
      status: "ATIVO",
      desc: "Manifesto da agência, equipe técnica, infraestrutura e visão estratégica.",
      previewImg: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
    },
    { 
      id: "piassa", 
      title: "Painel Piassa Vagas", 
      path: "/piassa", 
      category: "FERRAMENTAS",
      acessos: 780, 
      leads: 29, 
      conversion: "3.7%", 
      status: "ATIVO",
      desc: "Sistema automatizado de mineração e disparo de e-mails para oportunidades.",
      previewImg: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"
    }
  ];

  const filteredPages = paginas.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(filterQuery.toLowerCase()) || p.path.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesCat = selectedCategory === "TODAS" || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const totalLeads = paginas.reduce((acc, curr) => acc + curr.leads, 0);
  const totalAcessos = paginas.reduce((acc, curr) => acc + curr.acessos, 0);

  return (
    <div className="flex-1 overflow-y-auto w-full bg-[#070c18] text-white pb-20 font-sans">
      <Header 
        title="Gestão de Páginas ✦ Hub Digital" 
        subtitle="Monitore, gerencie e acompanhe a performance de todas as landing pages do ESCOM Studio." 
      />

      <div className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-8">
        
        {/* BARRA DE FILTRO POR PERÍODO DE TEMPO */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0e172a] border border-[#1e2e4a] rounded-2xl p-4 shadow-xl">
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Filtro de Período de Acessos</h3>
            <p className="text-xs text-gray-300 font-bold mt-0.5">
              Exibindo dados por: {
                selectedCategory === "TODAS" ? "Todas as Categorias" : selectedCategory
              }
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#080d19] border border-[#1d2d4a] rounded-xl p-1 overflow-x-auto">
            {[
              { id: "all", label: "Todo o Período" },
              { id: "today", label: "Hoje" },
              { id: "week", label: "Esta Semana" },
              { id: "month", label: "Este Mês" },
              { id: "year", label: "Este Ano" }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setSelectedCategory(item.id === "all" ? "TODAS" : selectedCategory)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap bg-[#2563eb] text-white hover:bg-blue-600 shadow-md shadow-blue-500/20"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* CARDS DE MÉTRICAS GERAIS DE PÁGINAS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="bg-[#0e172a] border border-[#1e2e4a] rounded-2xl p-5 space-y-2 shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-center text-gray-400 text-xs font-mono">
              <span>TOTAL DE PÁGINAS</span>
              <Layers size={16} className="text-blue-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">
              {paginas.length} <span className="text-xs text-emerald-400 font-normal">Páginas Ativas</span>
            </div>
            <div className="text-[11px] text-gray-400">100% monitoradas em tempo real</div>
          </div>

          <div className="bg-[#0e172a] border border-[#1e2e4a] rounded-2xl p-5 space-y-2 shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-center text-gray-400 text-xs font-mono">
              <span>TRÁFEGO TOTAL</span>
              <Eye size={16} className="text-cyan-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">
              {totalAcessos.toLocaleString()} <span className="text-xs text-cyan-400 font-normal">Visualizações</span>
            </div>
            <div className="text-[11px] text-gray-400">Visitas acumuladas nos protótipos</div>
          </div>

          <div className="bg-[#0e172a] border border-[#1e2e4a] rounded-2xl p-5 space-y-2 shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-center text-gray-400 text-xs font-mono">
              <span>LEADS GERADOS</span>
              <Users size={16} className="text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">
              {totalLeads} <span className="text-xs text-emerald-400 font-normal">Leads Capturados</span>
            </div>
            <div className="text-[11px] text-gray-400">Origem: Formulários & CTAs</div>
          </div>

          <div className="bg-[#0e172a] border border-[#1e2e4a] rounded-2xl p-5 space-y-2 shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-center text-gray-400 text-xs font-mono">
              <span>TAXA DE CONVERSÃO</span>
              <TrendingUp size={16} className="text-purple-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">
              2.4% <span className="text-xs text-purple-400 font-normal">Média Geral</span>
            </div>
            <div className="text-[11px] text-gray-400">Acima da média de mercado</div>
          </div>
        </div>

        {/* BARRA DE FILTROS E BUSCA */}
        <div className="bg-[#0e172a] border border-[#1e2e4a] rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          {/* Busca por Nome */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Buscar por nome ou URL da página..."
              className="w-full bg-[#080d19] border border-[#1d2d4a] rounded-xl pl-12 pr-4 py-2.5 text-white text-xs md:text-sm focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          {/* Categorias */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {["TODAS", "PRINCIPAL", "PORTFÓLIO", "PROSPECÇÃO", "INSTITUCIONAL"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat 
                    ? "bg-[#2563eb] text-white shadow-md shadow-blue-500/20" 
                    : "bg-[#080d19] text-gray-400 hover:text-white border border-[#1d2d4a]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Criar Nova Página */}
          <button 
            onClick={() => alert("Em breve: Gerador automático de novas páginas por IA!")}
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 shrink-0"
          >
            <Plus size={16} />
            <span>Criar Nova Página</span>
          </button>
        </div>

        {/* GRID DE PÁGINAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPages.map((pagina) => (
            <div 
              key={pagina.id}
              className="bg-[#0e172a] border border-[#1e2e4a] hover:border-blue-500 rounded-3xl overflow-hidden transition-all duration-300 group flex flex-col justify-between shadow-xl"
            >
              {/* Imagem de Capa da Página */}
              <div className="relative h-44 overflow-hidden bg-black">
                <img 
                  src={pagina.previewImg} 
                  alt={pagina.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e172a] via-[#0e172a]/40 to-transparent"></div>
                
                {/* Badges Flutuantes */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md">
                    ● {pagina.status}
                  </span>
                  <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full backdrop-blur-md">
                    {pagina.category}
                  </span>
                </div>

                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.origin + pagina.path);
                    alert("URL copiada!");
                  }}
                  className="absolute top-3 right-3 bg-black/60 hover:bg-black text-white p-2 rounded-full backdrop-blur-md border border-white/20 transition-colors"
                  title="Copiar URL"
                >
                  <Copy size={14} />
                </button>
              </div>

              {/* Corpo de Informações */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors leading-tight">
                    {pagina.title}
                  </h3>
                  <div className="text-xs text-blue-400 font-mono flex items-center gap-1">
                    <Globe size={12} />
                    <span>{pagina.path}</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed pt-1">
                    {pagina.desc}
                  </p>
                </div>

                {/* Métricas de Acessos & Leads */}
                <div className="grid grid-cols-3 gap-2 bg-[#080d19] border border-[#1b2b4a] rounded-2xl p-3 text-center">
                  <div>
                    <span className="text-[9px] text-gray-400 font-mono block">ACESSOS</span>
                    <span className="text-sm font-extrabold text-white">{pagina.acessos}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-blue-400 font-mono block">LEADS</span>
                    <span className="text-sm font-extrabold text-blue-400">{pagina.leads}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-purple-400 font-mono block">CONVERSÃO</span>
                    <span className="text-sm font-extrabold text-purple-400">{pagina.conversion}</span>
                  </div>
                </div>

                {/* Botão de Ação */}
                <a
                  href={pagina.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#18294a] hover:bg-[#2563eb] border border-[#243d6e] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md group-hover:shadow-blue-500/20"
                >
                  <span>Abrir Página em Nova Aba</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
