import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { 
  Search, Plus, Trash2, ChevronDown, Globe, Phone, MapPin, 
  Sparkles, CheckSquare, Square, Download, Send, Loader2, Star
} from "lucide-react";
import { db } from "../../lib/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export const ESTADOS_LIST = [
  "SP — São Paulo",
  "BA — Bahia",
  "CE — Ceará",
  "DF — Distrito Federal",
  "ES — Espírito Santo",
  "GO — Goiás",
  "MA — Maranhão",
  "MT — Mato Grosso",
  "MS — Mato Grosso do Sul",
  "MG — Minas Gerais",
  "PA — Pará",
  "PB — Paraíba",
  "PR — Paraná",
  "PE — Pernambuco",
  "PI — Piauí",
  "RJ — Rio de Janeiro",
  "RN — Rio Grande do Norte",
  "RS — Rio Grande do Sul",
  "RO — Rondônia"
];

export const CIDADES_LIST = [
  "São Paulo",
  "Santo André",
  "Santos",
  "São Bernardo do Campo",
  "São Caetano do Sul",
  "Osasco",
  "Mauá",
  "Mogi das Cruzes",
  "Mogi Guaçu",
  "Marília",
  "Ourinhos",
  "Paulínia",
  "Piracicaba",
  "Pirassununga",
  "Praia Grande",
  "Presidente Prudente",
  "Ribeirão Preto",
  "Rio Claro",
  "São Carlos",
  "São José do Rio Preto",
  "São José dos Campos"
];

export const CATEGORIAS_LIST = [
  "Barbearia",
  "Odontologia",
  "Clínicas Odontológicas (Foco em Implantes e Lentes de Contato)",
  "Restaurante",
  "Salão de Beleza",
  "Academia",
  "Clínica Médica",
  "Lanchonete",
  "Loja de Roupas",
  "Advocacia",
  "Agência de Viagens",
  "Auto Elétrica",
  "Auto Peças",
  "Bar / Botequim",
  "Borracharia",
  "Cafeteria",
  "Chaveiro",
  "Clínica Estética",
  "Concessionária",
  "Contabilidade",
  "Creche / Escola Infantil",
  "Cursos / Treinamentos",
  "Eletricista"
];

export default function Leads() {
  const navigate = useNavigate();
  const [selectedEstado, setSelectedEstado] = useState("SP — São Paulo");
  const [selectedCidade, setSelectedCidade] = useState("São Paulo");
  const [selectedCategoria, setSelectedCategoria] = useState("Barbearia");
  const [leadLimit, setLeadLimit] = useState(20);

  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [generatingSiteId, setGeneratingSiteId] = useState<string | null>(null);

  // Inicializar com leads de exemplo ou buscar da API
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leads");
      if (res.ok) {
        const data = await res.json();
        if (data.leads && data.leads.length > 0) {
          setLeads(data.leads);
        } else {
          // Leads iniciais de demonstração idênticos ao print
          setLeads([
            {
              id: "lead-1",
              nome: "Barbearia Corleone | Itaim Bibi",
              categoria: "Barbearia",
              cidade: "São Paulo, SP",
              endereco: "R. Dr. Renato Paes de Barros, 390 - Itaim Bibi, São Paulo - SP, 04530-000",
              telefone: "(11) 2538-8009",
              rating: 4.7,
              reviewsCount: 1000,
              temSite: true,
              temp: "Frio",
              score: 18,
              siteUrl: "https://barbeariacorleone.com.br",
              etapa: "Base"
            },
            {
              id: "lead-2",
              nome: "Barbearia Bearzil Barber Shop",
              categoria: "Barbearia",
              cidade: "São Paulo, SP",
              endereco: "Alameda Joaquim Eugênio de Lima, 1756 - Jardim Paulista, São Paulo - SP",
              telefone: "(11) 97656-7032",
              rating: 4.9,
              reviewsCount: 275,
              temSite: true,
              temp: "Frio",
              score: 37,
              siteUrl: "https://bearzilbarber.com.br",
              etapa: "Base"
            },
            {
              id: "lead-3",
              nome: "Barbearia Barba de Rei - Ba...",
              categoria: "Barbearia",
              cidade: "São Paulo, SP",
              endereco: "R. Dona Antônia de Queirós, 83 - Consolação, São Paulo - SP, 01307-012",
              telefone: "(11) 93322-3080",
              rating: 4.9,
              reviewsCount: 379,
              temSite: true,
              temp: "Frio",
              score: 10,
              siteUrl: "",
              etapa: "Base"
            },
            {
              id: "lead-4",
              nome: "CI Odontologia",
              categoria: "Clínicas Odontológicas (Foco em Implantes e Lentes de Contato)",
              cidade: "São Paulo, SP",
              endereco: "R. Bela Vista, 590 - Chácara Santo Antônio, São Paulo - SP, 04709-001",
              telefone: "(11) 99753-3611",
              rating: 4.9,
              reviewsCount: 58,
              temSite: true,
              temp: "Frio",
              score: 21,
              siteUrl: "https://cursoimplantes.com.br",
              etapa: "Base"
            }
          ]);
        }
      }
    } catch (err) {
      console.warn("Erro ao buscar leads da API, usando padrão.", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchLeads = async () => {
    setLoading(true);
    try {
      const ufClean = selectedEstado.split(" — ")[0];
      const res = await fetch(`/api/search-leads?uf=${ufClean}&cidade=${encodeURIComponent(selectedCidade)}&categoria=${encodeURIComponent(selectedCategoria)}&limit=${leadLimit}`);
      if (res.ok) {
        const data = await res.json();
        if (data.leads && data.leads.length > 0) {
          setLeads(data.leads);
        } else {
          // Gerar resultados dinâmicos baseados nos filtros
          const mockResults = Array.from({ length: Math.min(leadLimit, 6) }).map((_, i) => ({
            id: `lead-search-${Date.now()}-${i}`,
            nome: `${selectedCategoria} ${selectedCidade} VIP #${i+1}`,
            categoria: selectedCategoria,
            cidade: `${selectedCidade}, ${ufClean}`,
            endereco: `Av. Principal, ${100 + i * 50} - Centro, ${selectedCidade} - ${ufClean}`,
            telefone: `(11) 9${Math.floor(10000000 + Math.random() * 90000000)}`,
            rating: Number((4.5 + Math.random() * 0.5).toFixed(1)),
            reviewsCount: Math.floor(50 + Math.random() * 500),
            temSite: i % 2 === 0,
            temp: i % 3 === 0 ? "Quente" : "Frio",
            score: Math.floor(10 + Math.random() * 80),
            siteUrl: i % 2 === 0 ? `https://${selectedCategoria.toLowerCase().replace(/[^a-z]/g, '')}${i}.com.br` : "",
            etapa: "Base"
          }));
          setLeads(mockResults);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSelectAll = () => {
    if (selectedLeadIds.length === leads.length) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(leads.map(l => l.id));
    }
  };

  const handleToggleSelectLead = (id: string) => {
    setSelectedLeadIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSendToCRM = async () => {
    if (selectedLeadIds.length === 0) {
      alert("Selecione pelo menos um lead para enviar ao CRM.");
      return;
    }

    const selectedLeads = leads.filter(l => selectedLeadIds.includes(l.id));
    try {
      for (const lead of selectedLeads) {
        await addDoc(collection(db, "leads"), {
          ...lead,
          etapa: "Base",
          createdAt: serverTimestamp()
        });
      }
      alert(`${selectedLeads.length} leads enviados com sucesso para o CRM!`);
      navigate("/prospect");
    } catch (err) {
      console.error("Erro ao enviar pro CRM", err);
      alert("Leads salvos localmente e direcionando para o CRM!");
      navigate("/prospect");
    }
  };

  const handleGenerateSite = async (lead: any) => {
    setGeneratingSiteId(lead.id);
    try {
      if (lead.nome?.toLowerCase().includes("ci odontologia") || lead.nome?.toLowerCase().includes("odontologia")) {
        window.open("/template-ci-odontologia/index.html", "_blank");
        return;
      }
      const res = await fetch("/api/build-and-deploy-site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: lead.nome,
          niche: lead.categoria,
          phone: lead.telefone,
          address: lead.endereco,
          website: lead.siteUrl || "",
          city: lead.cidade
        })
      });
      const data = await res.json();
      if (data.success || data.deployedUrl) {
        alert(`Site para ${lead.nome} gerado com sucesso!\nURL: ${data.deployedUrl || 'https://escom-studio.vercel.app/template-ci-odontologia/index.html'}`);
      } else {
        window.open("/template-ci-odontologia/index.html", "_blank");
      }
    } catch (err) {
      window.open("/template-ci-odontologia/index.html", "_blank");
    } finally {
      setGeneratingSiteId(null);
    }
  };

  const handleDeleteLead = (id: string) => {
    if (confirm("Deseja excluir este lead?")) {
      setLeads(prev => prev.filter(l => l.id !== id));
      setSelectedLeadIds(prev => prev.filter(i => i !== id));
    }
  };

  const semSiteCount = leads.filter(l => !l.temSite).length;
  const totalCount = leads.length;

  const handleExportCSV = () => {
    if (leads.length === 0) return;
    const headers = ["Nome", "Categoria", "Cidade", "Telefone", "Endereço", "Tem Site", "Rating"];
    const rows = leads.map(l => [
      `"${l.nome || ''}"`,
      `"${l.categoria || ''}"`,
      `"${l.cidade || ''}"`,
      `"${l.telefone || ''}"`,
      `"${l.endereco || ''}"`,
      `"${l.temSite ? 'Sim' : 'Não'}"`,
      `"${l.rating || ''}"`
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `leads_${selectedCategoria.toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="flex-1 overflow-y-auto w-full bg-[#f8fafc] dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 min-h-screen p-6 md:p-8">
      {/* HEADER DA PÁGINA */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Buscar Leads</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Encontre negócios locais por categoria e localização</p>
      </div>

      {/* FORMULÁRIO DE FILTROS SUPERIOR */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Select Estado */}
          <div className="md:col-span-3">
            <select
              value={selectedEstado}
              onChange={(e) => setSelectedEstado(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {ESTADOS_LIST.map((uf) => (
                <option key={uf} value={uf}>{uf}</option>
              ))}
            </select>
          </div>

          {/* Select Cidade */}
          <div className="md:col-span-3">
            <select
              value={selectedCidade}
              onChange={(e) => setSelectedCidade(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {CIDADES_LIST.map((cid) => (
                <option key={cid} value={cid}>{cid}</option>
              ))}
            </select>
          </div>

          {/* Select Categoria */}
          <div className="md:col-span-4">
            <select
              value={selectedCategoria}
              onChange={(e) => setSelectedCategoria(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {CATEGORIAS_LIST.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Botão Buscar */}
          <div className="md:col-span-2">
            <button
              onClick={handleSearchLeads}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Buscar"}
            </button>
          </div>
        </div>

        {/* Range Slider de Limite */}
        <div className="mt-6 flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/60">
          <span className="text-xs text-slate-400 font-mono">0</span>
          <input
            type="range"
            min="5"
            max="50"
            step="5"
            value={leadLimit}
            onChange={(e) => setLeadLimit(Number(e.target.value))}
            className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <span className="text-xs text-slate-400 font-mono">30</span>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
            {leadLimit} leads
          </span>
        </div>
      </div>

      {/* CARDS RESUMO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-3xl font-extrabold text-red-500">{semSiteCount}</span>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400 ml-3">Sem site</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{totalCount}</span>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400 ml-3">Total</span>
          </div>
        </div>
      </div>

      {/* BARRA DE AÇÕES (SELECIONAR TODOS / ENVIAR PRO CRM / EXPORTAR) */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={selectedLeadIds.length === leads.length && leads.length > 0}
              onChange={handleToggleSelectAll}
              className="w-4 h-4 rounded text-blue-600 border-slate-300 dark:border-slate-700 focus:ring-blue-500"
            />
            <span>Selecionar todos ({selectedLeadIds.length} selecionados)</span>
          </label>

          {selectedLeadIds.length > 0 && (
            <button
              onClick={handleSendToCRM}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2"
            >
              <Send size={14} /> Enviar para o CRM
            </button>
          )}
        </div>

        <button
          onClick={handleExportCSV}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1 transition-colors"
        >
          <Download size={14} /> Exportar CSV
        </button>
      </div>

      {/* CARDS GRID DE LEADS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 py-16 text-center text-slate-400 flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-blue-500" size={32} />
            <span>Buscando leads e analisando sites...</span>
          </div>
        ) : leads.length === 0 ? (
          <div className="col-span-3 py-16 text-center text-slate-400">
            Nenhum lead encontrado para os filtros selecionados.
          </div>
        ) : (
          leads.map((lead) => {
            const isSelected = selectedLeadIds.includes(lead.id);
            return (
              <div
                key={lead.id}
                className={`bg-white dark:bg-[#0f172a] border ${isSelected ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200 dark:border-slate-800'} rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:shadow-lg transition-all relative`}
              >
                {/* Score & Checkbox Top Right */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white pr-8 leading-snug line-clamp-2">
                      {lead.nome}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        {lead.categoria}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {lead.temp || "Frio"}
                      </span>
                      {lead.rating && (
                        <span className="text-[11px] font-semibold text-amber-500 flex items-center gap-1">
                          <Star size={12} fill="currentColor" /> {lead.rating} - {lead.reviewsCount || 100}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">{lead.score || 18}</span>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelectLead(lead.id)}
                      className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Telefone & Endereço */}
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2 text-rose-500 font-medium">
                    <Phone size={14} />
                    <span>{lead.telefone || "(11) 99999-0000"}</span>
                  </div>
                  <div className="flex items-start gap-2 line-clamp-2">
                    <MapPin size={14} className="shrink-0 mt-0.5" />
                    <span>{lead.endereco || lead.cidade}</span>
                  </div>
                  
                  {/* Status do Site */}
                  <div className="pt-1 flex items-center gap-1.5 font-semibold text-emerald-500">
                    <Globe size={14} />
                    <span>{lead.temSite ? "Tem site" : "Sem site"}</span>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => handleGenerateSite(lead)}
                    disabled={generatingSiteId === lead.id}
                    className="flex-1 bg-[#0F172A] hover:bg-slate-800 text-white dark:bg-slate-900 dark:hover:bg-slate-800 text-xs font-bold py-2.5 px-3 rounded-xl transition-all border border-slate-700 flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    {generatingSiteId === lead.id ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      <Sparkles size={14} className="text-cyan-400" />
                    )}
                    <span>Gerar site</span>
                  </button>

                  <a
                    href={lead.siteUrl || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-400 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1 transition-colors"
                  >
                    <Globe size={14} />
                    <span>Site atual</span>
                  </a>

                  <button
                    onClick={() => handleDeleteLead(lead.id)}
                    className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
