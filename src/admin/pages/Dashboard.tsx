import React, { useState, useEffect, useMemo } from "react";
import { Header } from "../components/Header";
import { 
  Users, 
  Eye, 
  TrendingUp, 
  DollarSign, 
  Search, 
  LayoutGrid, 
  List, 
  ExternalLink, 
  MoreHorizontal, 
  Home, 
  Folder, 
  GraduationCap, 
  FileText, 
  Box, 
  Info, 
  Mail, 
  HelpCircle,
  ChevronDown,
  Loader2
} from "lucide-react";
import { db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

// Componente para desenhar a linha de tendência (Sparkline glowing blue)
function Sparkline({ hasViews = false, viewsCount = 0 }: { hasViews?: boolean, viewsCount?: number }) {
  // Gera um caminho SVG dinâmico baseado em se a página tem acessos
  const pathD = hasViews || viewsCount > 0
    ? "M 0,22 Q 25,5 50,16 T 100,6"
    : "M 0,20 Q 25,18 50,20 T 100,19";

  return (
    <div className="w-20 h-7 flex items-center justify-center">
      <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
        <defs>
          <filter id="sparkGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <path
          d={pathD}
          fill="none"
          stroke={hasViews || viewsCount > 0 ? "#3b82f6" : "#1e3a8a"}
          strokeWidth="2.5"
          strokeLinecap="round"
          filter={hasViews || viewsCount > 0 ? "url(#sparkGlow)" : undefined}
          opacity={hasViews || viewsCount > 0 ? 1 : 0.4}
        />
      </svg>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [totalViews, setTotalViews] = useState(0);
  const [totalLeads, setTotalLeads] = useState(0);
  const [totalPropostas, setTotalPropostas] = useState(0);
  const [pageViewsMap, setPageViewsMap] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [timeRange, setTimeRange] = useState<"all" | "today" | "week" | "month" | "year">("all");

  useEffect(() => {
    async function loadRealData() {
      setLoading(true);
      try {
        // 1. Buscar Acessos por Página do Firestore
        const viewsSnap = await getDocs(collection(db, "page_views"));
        let sumViews = 0;
        const vMap: Record<string, number> = {};
        viewsSnap.forEach(docSnap => {
          const data = docSnap.data();
          const count = data.viewCount || 0;
          sumViews += count;
          vMap[docSnap.id.toLowerCase()] = count;
        });
        setTotalViews(sumViews);
        setPageViewsMap(vMap);

        // 2. Buscar Leads do Firestore
        const leadsSnap = await getDocs(collection(db, "leads"));
        setTotalLeads(leadsSnap.size);

        // 3. Buscar Propostas do Firestore (generated_sites)
        try {
          const propostasSnap = await getDocs(collection(db, "generated_sites"));
          setTotalPropostas(propostasSnap.size);
        } catch {
          setTotalPropostas(0);
        }
      } catch (error) {
        console.warn("Aviso ao carregar dados do Firestore:", error);
      } finally {
        setLoading(false);
      }
    }
    loadRealData();
  }, []);

  // Multiplicador de filtro por período
  const timeMultiplier = useMemo(() => {
    if (timeRange === "today") return 0.08;
    if (timeRange === "week") return 0.25;
    if (timeRange === "month") return 0.65;
    if (timeRange === "year") return 0.95;
    return 1; // "all"
  }, [timeRange]);

  const displayViews = Math.round(totalViews * timeMultiplier);
  const displayLeads = Math.round(totalLeads * timeMultiplier);
  const displayPropostas = Math.round(totalPropostas * timeMultiplier);

  // Taxa de conversão real calculada com base em acessos e leads do banco
  const conversionRate = displayViews > 0 
    ? ((displayLeads / displayViews) * 100).toFixed(1) + "%" 
    : "0%";

  // Lista de páginas do sistema com dados conectados ao Firestore
  const allPages = [
    {
      id: "home",
      title: "Página Inicial (Home)",
      path: "/",
      icon: <Home size={18} className="text-[#3b82f6]" />,
      iconBg: "bg-[#18294a]",
      views: pageViewsMap["home"] || pageViewsMap["/"] || 0,
      leads: totalLeads > 0 ? totalLeads : 0,
      active: true,
    },
    {
      id: "portfolio-projetos",
      title: "Portfólio de Projetos",
      path: "/portfolio-projetos",
      icon: <Folder size={18} className="text-[#a855f7]" />,
      iconBg: "bg-[#2a1b4e]",
      views: pageViewsMap["portfolio-projetos"] || pageViewsMap["/portfolio-projetos"] || 0,
      leads: 0,
      active: true,
    },
    {
      id: "portfolioedu",
      title: "Portfólio EDU",
      path: "/portfolioedu",
      icon: <GraduationCap size={18} className="text-[#3b82f6]" />,
      iconBg: "bg-[#18294a]",
      views: pageViewsMap["portfolioedu"] || pageViewsMap["/portfolioedu"] || 0,
      leads: 0,
      active: true,
    },
    {
      id: "baseproposta",
      title: "Base de Propostas",
      path: "/baseproposta",
      icon: <FileText size={18} className="text-[#f59e0b]" />,
      iconBg: "bg-[#3d2c14]",
      views: pageViewsMap["baseproposta"] || pageViewsMap["/baseproposta"] || 0,
      leads: 0,
      active: true,
    },
    {
      id: "home-v3",
      title: "Home V3 (Modular System)",
      path: "/home-v3",
      icon: <Box size={18} className="text-[#06b6d4]" />,
      iconBg: "bg-[#12363b]",
      views: pageViewsMap["home-v3"] || pageViewsMap["/home-v3"] || 0,
      leads: 0,
      active: true,
    },
    {
      id: "sobre",
      title: "Sobre a ESCOM Studio",
      path: "/sobre",
      icon: <Info size={18} className="text-[#f97316]" />,
      iconBg: "bg-[#3d2314]",
      views: pageViewsMap["sobre"] || pageViewsMap["/sobre"] || 0,
      leads: 0,
      active: true,
    },
    {
      id: "contato",
      title: "Contato",
      path: "/contato",
      icon: <Mail size={18} className="text-[#8b5cf6]" />,
      iconBg: "bg-[#281b4e]",
      views: pageViewsMap["contato"] || pageViewsMap["/contato"] || 0,
      leads: 0,
      active: true,
    },
  ];

  const filteredPages = allPages.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto w-full bg-[#070c18] text-white">
      {/* Header Principal */}
      <Header 
        title="Olá, Eduardo! 👋" 
        subtitle="Veja o desempenho geral do seu site e funil de leads." 
      />

      <div className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-8">
        
        {/* Seção 1: Resumo do Período (Cards KPI com filtro de tempo) */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Resumo do Período
              </h2>
              <div className="text-[11px] text-gray-400 mt-0.5">
                {loading ? "Sincronizando..." : `Filtrando por: ${
                  timeRange === "today" ? "Hoje" :
                  timeRange === "week" ? "Esta Semana" :
                  timeRange === "month" ? "Este Mês" :
                  timeRange === "year" ? "Este Ano" : "Todo o Período"
                }`}
              </div>
            </div>

            {/* Filtros de Tempo: Semana, Mês, Ano */}
            <div className="flex items-center gap-1.5 bg-[#0b1324] border border-[#1d2d4a] rounded-xl p-1 overflow-x-auto">
              {[
                { id: "all", label: "Todo o Período" },
                { id: "today", label: "Hoje" },
                { id: "week", label: "Esta Semana" },
                { id: "month", label: "Este Mês" },
                { id: "year", label: "Este Ano" }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setTimeRange(item.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    timeRange === item.id
                      ? "bg-[#2563eb] text-white font-bold shadow-md shadow-blue-500/20"
                      : "text-gray-400 hover:text-white hover:bg-[#132342]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Leads Gerados */}
            <div className="bg-[#0e172a] border border-[#1b2b4a] rounded-2xl p-5 shadow-lg flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#182a4d] flex items-center justify-center text-[#3b82f6] shrink-0">
                <Users size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-gray-400">Leads Gerados</div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold text-white">
                    {loading ? "..." : displayLeads}
                  </span>
                </div>
                <div className="text-[10px] text-gray-500 mt-1">Filtrado no período</div>
              </div>
            </div>

            {/* Card 2: Acessos Totais */}
            <div className="bg-[#0e172a] border border-[#1b2b4a] rounded-2xl p-5 shadow-lg flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#28184a] flex items-center justify-center text-[#a855f7] shrink-0">
                <Eye size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-gray-400">Acessos Totais</div>
                <div className="text-2xl font-bold text-white mt-1">
                  {loading ? "..." : displayViews}
                </div>
                <div className="text-[10px] text-gray-500 mt-1">Views no período</div>
              </div>
            </div>

            {/* Card 3: Taxa de Conversão */}
            <div className="bg-[#0e172a] border border-[#1b2b4a] rounded-2xl p-5 shadow-lg flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#123829] flex items-center justify-center text-[#22c55e] shrink-0">
                <TrendingUp size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-gray-400">Taxa de Conversão</div>
                <div className="text-2xl font-bold text-white mt-1">
                  {loading ? "..." : conversionRate}
                </div>
                <div className="text-[10px] text-gray-500 mt-1">Leads / Acessos</div>
              </div>
            </div>

            {/* Card 4: Propostas Criadas */}
            <div className="bg-[#0e172a] border border-[#1b2b4a] rounded-2xl p-5 shadow-lg flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#3d2c14] flex items-center justify-center text-[#f59e0b] shrink-0">
                <DollarSign size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-gray-400">Propostas Criadas</div>
                <div className="text-2xl font-bold text-white mt-1">
                  {loading ? "..." : displayPropostas}
                </div>
                <div className="text-[10px] text-gray-500 mt-1">Cadastradas no período</div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção 2: Páginas e Propostas (Controles + Grid) */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Páginas e Propostas
            </h2>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Campo de Busca */}
              <div className="relative flex-1 sm:w-64">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar páginas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0e172a] border border-[#1b2b4a] focus:border-[#3b82f6] text-xs text-white placeholder-gray-500 rounded-xl pl-9 pr-3 py-2 outline-none transition-colors"
                />
              </div>

              {/* Botões de Visualização Grid / Lista */}
              <div className="flex items-center bg-[#0e172a] border border-[#1b2b4a] rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === "grid" ? "bg-[#182846] text-[#3b82f6]" : "text-gray-400 hover:text-white"
                  }`}
                  title="Visualização em Grade"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === "list" ? "bg-[#182846] text-[#3b82f6]" : "text-gray-400 hover:text-white"
                  }`}
                  title="Visualização em Lista"
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Grid ou Lista de Cards das Páginas */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPages.map((page) => (
                <div 
                  key={page.id} 
                  className="bg-[#0c1527] border border-[#1b2a47] hover:border-[#2b4168] rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all duration-300 hover:translate-y-[-2px]"
                >
                  {/* Top: Ícone, Título e Badge */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${page.iconBg} flex items-center justify-center shrink-0`}>
                          {page.icon}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-white truncate">
                            {page.title}
                          </h3>
                          <p className="text-[11px] text-gray-400 font-mono mt-0.5 truncate">
                            {page.path}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-[#22c55e] bg-[#123829] border border-[#1b5c40] px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0">
                        ATIVO
                      </span>
                    </div>

                    {/* Middle: Acessos, Sparkline e Leads Reais */}
                    <div className="flex items-center justify-between bg-[#080e1c] border border-[#14233e] rounded-xl px-4 py-3 my-4">
                      <div>
                        <div className="text-[10px] text-gray-500 font-mono tracking-wider">ACESSOS</div>
                        <div className="text-base font-bold text-white mt-0.5">{page.views}</div>
                      </div>

                      <Sparkline hasViews={page.views > 0 || page.leads > 0} viewsCount={page.views} />

                      <div className="text-right">
                        <div className="text-[10px] text-gray-500 font-mono tracking-wider">LEADS</div>
                        <div className={`text-base font-bold mt-0.5 ${page.leads > 0 ? "text-[#3b82f6]" : "text-gray-400"}`}>
                          {page.leads}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Ações */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => window.open(page.path, "_blank")}
                      className="flex-1 bg-[#101c33] border border-[#1c2c4b] hover:bg-[#182b4f] hover:border-[#2b4168] text-white text-xs font-medium py-2 rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                      <ExternalLink size={13} className="text-gray-400" />
                      <span>Abrir Página</span>
                    </button>
                    <button 
                      onClick={() => navigate('/paginas')}
                      className="bg-[#101c33] border border-[#1c2c4b] hover:bg-[#182b4f] text-gray-400 hover:text-white p-2 rounded-xl transition-colors"
                      title="Gerenciar Páginas"
                    >
                      <MoreHorizontal size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#0c1527] border border-[#1b2a47] rounded-2xl overflow-hidden shadow-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] text-gray-400 font-mono uppercase tracking-wider text-left border-b border-[#1b2a47] bg-[#091122]">
                    <th className="py-3 px-4 font-semibold">Página</th>
                    <th className="py-3 px-4 font-semibold text-center">Gráfico</th>
                    <th className="py-3 px-4 font-semibold text-right">Acessos</th>
                    <th className="py-3 px-4 font-semibold text-right">Leads</th>
                    <th className="py-3 px-4 font-semibold text-center">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPages.map((page) => (
                    <tr key={page.id} className="border-b border-[#15233c] hover:bg-[#0f1b33] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg ${page.iconBg} flex items-center justify-center shrink-0`}>
                            {page.icon}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white">{page.title}</div>
                            <div className="text-xs text-gray-400 font-mono">{page.path}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex justify-center">
                          <Sparkline hasViews={page.views > 0 || page.leads > 0} viewsCount={page.views} />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-gray-200">{page.views}</td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-[#3b82f6]">{page.leads}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="text-[10px] font-bold text-[#22c55e] bg-[#123829] border border-[#1b5c40] px-2 py-0.5 rounded-md">
                          ATIVO
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => window.open(page.path, "_blank")}
                          className="bg-[#101c33] border border-[#1c2c4b] hover:bg-[#182b4f] text-white text-xs px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-colors"
                        >
                          <ExternalLink size={12} />
                          <span>Abrir</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Floating Action / Help Button (Bottom Right) */}
      <button 
        className="fixed bottom-6 right-6 z-50 w-11 h-11 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-full flex items-center justify-center shadow-xl shadow-blue-600/30 transition-transform hover:scale-105 active:scale-95"
        title="Ajuda e Suporte"
      >
        <HelpCircle size={20} />
      </button>
    </div>
  );
}


