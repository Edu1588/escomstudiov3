import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { 
  Search, ArrowRight, LayoutDashboard, UserCheck, Briefcase, Clock, 
  Loader2, Download, Globe, Mail, Phone, MessageSquare, Bookmark, 
  ChevronRight, ChevronLeft, Building2, Send, Copy, Trash2, FileText, 
  Terminal, Sparkles, X, Check, Calendar, DollarSign, HelpCircle, FileCheck
} from "lucide-react";
import { db } from "../../lib/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, orderBy } from "firebase/firestore";

export default function Prospect() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTag, setFilterTag] = useState("Todos");
  
  // Lista de leads no CRM
  const [crmLeads, setCrmLeads] = useState<any[]>([
    {
      id: "crm-1",
      indexNum: 21,
      nome: "CI Odontologia",
      categoria: "Clínicas Odontológicas (Foco em Implantes e Lentes de Contato)",
      cidade: "São Paulo, SP",
      endereco: "R. Bela Vista, 590 - Chácara Santo Antônio, São Paulo - SP, 04709-001",
      telefone: "(11) 99753-3611",
      rating: 4.9,
      reviewsCount: 58,
      temSite: true,
      temp: "Frio",
      etapa: "Base",
      siteUrl: "https://cursoimplantes.com.br",
      generatedSiteUrl: "https://escom-studio.vercel.app/template-ci-odontologia/index.html"
    },
    {
      id: "crm-2",
      indexNum: 20,
      nome: "YOKOTA & XAVIER, Dentista Zona Leste SP, Clinica Vila Matilde, Especialista, Melhor: Implante Dentario Canal BucoMaxilo Siso",
      categoria: "Clínicas Odontológicas (Foco em Implantes e Lentes de Contato)",
      cidade: "São Paulo, SP",
      endereco: "Rua Demétrio Ribeiro, 1000 - Tatuapé, São Paulo - SP",
      telefone: "(11) 98765-4321",
      rating: 4.8,
      reviewsCount: 120,
      temSite: true,
      temp: "Frio",
      etapa: "Base",
      siteUrl: "",
      generatedSiteUrl: ""
    }
  ]);

  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<"Informações" | "Scripts" | "Objeções" | "Site" | "Venda" | "Agendar">("Informações");
  const [isGeneratingSite, setIsGeneratingSite] = useState(false);

  useEffect(() => {
    fetchCrmLeads();
  }, []);

  const fetchCrmLeads = async () => {
    try {
      const res = await fetch("/api/leads");
      if (res.ok) {
        const data = await res.json();
        if (data.leads && data.leads.length > 0) {
          setCrmLeads(data.leads);
        }
      }
    } catch (err) {
      console.warn("Erro ao buscar leads do Firebase", err);
    }
  };

  const handleUpdateEtapa = async (leadId: string, newEtapa: string) => {
    setCrmLeads(prev => prev.map(l => l.id === leadId ? { ...l, etapa: newEtapa } : l));
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead((prev: any) => ({ ...prev, etapa: newEtapa }));
    }
    try {
      await updateDoc(doc(db, "leads", leadId), { etapa: newEtapa });
    } catch (err) {}
  };

  const handleGenerateSiteFromCrm = async (lead: any) => {
    setIsGeneratingSite(true);
    try {
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
      const newUrl = data.deployedUrl || "https://escom-studio.vercel.app/template-ci-odontologia/index.html";
      setCrmLeads(prev => prev.map(l => l.id === lead.id ? { ...l, generatedSiteUrl: newUrl } : l));
      setSelectedLead((prev: any) => ({ ...prev, generatedSiteUrl: newUrl }));
      alert(`Site gerado com sucesso para ${lead.nome} no padrão benchmark de 15 seções!`);
      window.open("/template-ci-odontologia/index.html", "_blank");
    } catch (err) {
      window.open("/template-ci-odontologia/index.html", "_blank");
    } finally {
      setIsGeneratingSite(false);
    }
  };

  const filteredLeads = crmLeads.filter(lead => {
    const matchesSearch = lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.categoria?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.cidade?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.telefone?.includes(searchTerm);
    if (!matchesSearch) return false;

    if (filterTag === "Sem site") return !lead.temSite;
    if (filterTag === "Tier 3 (Quente)") return lead.temp === "Quente";
    if (filterTag === "Tier 2 (Morno)") return lead.temp === "Morno";
    if (filterTag === "Score 50+") return (lead.score || 0) >= 50;
    if (filterTag === "Com telefone") return !!lead.telefone;
    if (filterTag === "Com WhatsApp") return !!lead.telefone;
    return true;
  });

  const columns = ["Base", "Abordado", "Agendado", "Follow Up", "Convertido"];

  return (
    <div className="flex-1 overflow-y-auto w-full bg-[#f8fafc] dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 min-h-screen p-6 md:p-8">
      {/* HEADER CRM */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">CRM</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Filtre, priorize e gerencie o contato com cada lead</p>
      </div>

      {/* CAMPO DE BUSCA */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Buscar por nome, categoria, cidade ou telefone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
      </div>

      {/* CHIPS DE FILTRO */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 custom-scrollbar">
        {["Todos", "Sem site", "Tier 3 (Quente)", "Tier 2 (Morno)", "Score 50+", "Com telefone", "Com WhatsApp"].map(tag => (
          <button
            key={tag}
            onClick={() => setFilterTag(tag)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
              filterTag === tag
                ? "bg-[#0F172A] text-white dark:bg-slate-800 border-slate-700"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-400"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* KANBAN BOARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 items-start">
        {columns.map(colName => {
          const colLeads = filteredLeads.filter(l => (l.etapa || "Base") === colName);
          const dotColor = colName === "Base" ? "bg-slate-400" : colName === "Abordado" ? "bg-blue-500" : colName === "Agendado" ? "bg-emerald-500" : "bg-amber-500";

          return (
            <div key={colName} className="bg-slate-100/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 min-h-[500px]">
              {/* Header Coluna */}
              <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`}></span>
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">{colName}</h3>
                </div>
                <span className="text-xs font-mono text-slate-400 font-semibold">{colLeads.length}</span>
              </div>

              {/* Cards na Coluna */}
              <div className="space-y-3">
                {colLeads.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400 italic">
                    Sem leads
                  </div>
                ) : (
                  colLeads.map(lead => (
                    <div
                      key={lead.id}
                      onClick={() => { setSelectedLead(lead); setActiveModalTab("Informações"); }}
                      className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:border-blue-500 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
                          {lead.indexNum || 21}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {lead.temp || "Frio"}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug line-clamp-2">
                          {lead.nome}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                          {lead.categoria} • {lead.cidade}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                        <a
                          href={`tel:${lead.telefone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold py-2 rounded-xl text-center border border-slate-200 dark:border-slate-800 transition-colors"
                        >
                          Ligar
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* LEAD DETAILS MODAL (IGUAL AO PRINT) */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            
            {/* Header Modal */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
              <div className="flex items-center gap-3">
                <button onClick={() => setSelectedLead(null)} className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500">
                  <ChevronLeft size={20} />
                </button>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                  {selectedLead.indexNum || 21}
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {selectedLead.temp || "Frio"}
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate max-w-md">
                  {selectedLead.nome}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">1 / 2</span>
                <button onClick={() => setSelectedLead(null)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Abas Modal */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 px-6 bg-slate-50/50 dark:bg-slate-900/30">
              {(["Informações", "Scripts", "Objeções", "Site", "Venda", "Agendar"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveModalTab(tab)}
                  className={`py-3.5 px-4 text-xs font-bold transition-all relative border-b-2 ${
                    activeModalTab === tab
                      ? "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400"
                      : "text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Conteúdo das Abas */}
            <div className="p-6 md:p-8 overflow-y-auto flex-1 custom-scrollbar">
              
              {/* TAB 1: INFORMAÇÕES */}
              {activeModalTab === "Informações" && (
                <div className="space-y-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">INFORMAÇÕES DO LEAD</h3>
                  
                  <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                    <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-2">
                      <span className="text-slate-500 font-medium">Categoria</span>
                      <span className="md:col-span-3 font-semibold text-slate-800 dark:text-slate-200">{selectedLead.categoria}</span>
                    </div>

                    <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-2">
                      <span className="text-slate-500 font-medium">Cidade</span>
                      <span className="md:col-span-3 font-semibold text-slate-800 dark:text-slate-200">{selectedLead.cidade}</span>
                    </div>

                    <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
                      <span className="text-slate-500 font-medium">Telefone</span>
                      <div className="md:col-span-3 flex items-center gap-3">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedLead.telefone || "(11) 95660-8040"}</span>
                        <a href={`tel:${selectedLead.telefone}`} className="bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-bold px-3 py-1 rounded-lg">
                          Ligar
                        </a>
                      </div>
                    </div>

                    <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-2">
                      <span className="text-slate-500 font-medium">Endereço</span>
                      <span className="md:col-span-3 text-slate-700 dark:text-slate-300">{selectedLead.endereco || "R. Bela Vista, 590 - Chácara Santo Antônio, São Paulo - SP"}</span>
                    </div>

                    <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-2">
                      <span className="text-slate-500 font-medium">Avaliação</span>
                      <span className="md:col-span-3 font-semibold text-amber-500">{selectedLead.rating || 4.9}/5 - {selectedLead.reviewsCount || 58} avaliações</span>
                    </div>

                    <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
                      <span className="text-slate-500 font-medium">Etapa</span>
                      <div className="md:col-span-3 flex items-center gap-2 flex-wrap">
                        {columns.map(et => (
                          <button
                            key={et}
                            onClick={() => handleUpdateEtapa(selectedLead.id, et)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                              (selectedLead.etapa || "Base") === et
                                ? "bg-blue-600 text-white shadow-sm"
                                : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300"
                            }`}
                          >
                            {et}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
                      <span className="text-slate-500 font-medium">Site</span>
                      <span className="md:col-span-3 font-semibold text-emerald-500 flex items-center gap-1.5">
                        {selectedLead.temSite ? "Tem site 🌐" : "Sem site ⚠️"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SCRIPTS */}
              {activeModalTab === "Scripts" && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">SCRIPTS DE ABORDAÇÃO COMERCIAL</h3>
                  <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl border border-slate-800 font-sans text-sm space-y-4">
                    <p className="text-cyan-400 font-bold">Script de WhatsApp para {selectedLead.nome}:</p>
                    <p className="italic text-slate-300 leading-relaxed">
                      "Olá, equipe da {selectedLead.nome}! Tudo bem? Gostei bastante da estrutura da empresa de vocês na {selectedLead.cidade}. Notei uma grande oportunidade de reestruturação digital para atrair mais pacientes de ticket alto. Desenvolvemos uma demonstração exclusiva com 15 seções de alta conversão. Podemos agendar 5 minutos?"
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 3: OBJEÇÕES */}
              {activeModalTab === "Objeções" && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">QUEBRA DE OBJEÇÕES</h3>
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                      <h4 className="font-bold text-white text-sm">"Já temos agência/site"</h4>
                      <p className="text-xs text-slate-400 mt-1">Resposta: "Excelente! Nosso modelo não substitui sua agência, ele aplica engenharia de conversão de 15 seções focada em ROI direto em 3 dias."</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: SITE (CRIAR SITE NO PADRÃO 15 SEÇÕES) */}
              {activeModalTab === "Site" && (
                <div className="space-y-6 text-center py-6">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
                    <Sparkles size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Gerador de Site Benchmark (15 Seções)</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto mt-2">
                      Gere a Landing Page de Alta Conversão para <strong>{selectedLead.nome}</strong> aplicando a Skill <code className="text-cyan-400 font-mono">escom-site-builder</code> com mineração de dados reais.
                    </p>
                  </div>

                  {selectedLead.generatedSiteUrl ? (
                    <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-400 text-sm max-w-md mx-auto space-y-2">
                      <p className="font-bold">✓ Landing Page Gerada com Sucesso!</p>
                      <a
                        href={selectedLead.generatedSiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 underline text-white font-semibold"
                      >
                        <Globe size={16} /> Abrir Landing Page
                      </a>
                    </div>
                  ) : null}

                  <div>
                    <button
                      onClick={() => handleGenerateSiteFromCrm(selectedLead)}
                      disabled={isGeneratingSite}
                      className="bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-base px-8 py-4 rounded-full shadow-xl shadow-cyan-500/20 transition-all hover:scale-105 inline-flex items-center gap-2"
                    >
                      {isGeneratingSite ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                      <span>Criar Site Benchmark (R$ 990)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 5: VENDA */}
              {activeModalTab === "Venda" && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">PROPOSTA COMERCIAL</h3>
                  <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg">Landing Page High-End ESCOM</span>
                      <span className="text-2xl font-extrabold text-cyan-400">R$ 990</span>
                    </div>
                    <p className="text-xs text-slate-400">Implementação completa em 3 dias com hospedagem e código-fonte entregue.</p>
                  </div>
                </div>
              )}

              {/* TAB 6: AGENDAR */}
              {activeModalTab === "Agendar" && (
                <div className="space-y-4 text-center py-6">
                  <Calendar className="mx-auto text-blue-500" size={36} />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Agendar Reunião / Apresentação</h3>
                  <p className="text-xs text-slate-500">Agende diretamente no Google Calendar ou WhatsApp do cliente.</p>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
