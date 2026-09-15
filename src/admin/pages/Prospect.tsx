import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { 
  Search, ArrowRight, LayoutDashboard, UserCheck, Briefcase, Clock, 
  Loader2, Download, Globe, Mail, Phone, MessageSquare, Bookmark, 
  ChevronRight, ChevronLeft, Building2, Send, Copy, Trash2, FileText, 
  Terminal, Sparkles, X, Check, Calendar, DollarSign, FileCheck
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
      nome: "YOKOTA & XAVIER, Dentista Zona Leste SP, Clinica Vila Matilde",
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
  const [gerandoPropostaId, setGerandoPropostaId] = useState<string | null>(null);
  const [reativandoSlug, setReativandoSlug] = useState<string | null>(null);
  const [showBuscarModal, setShowBuscarModal] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [buscarForm, setBuscarForm] = useState({ nicho: "", cidade: "", estado: "SP", quantidade: "15" });
  const [toast, setToast] = useState<{ msg: string; tipo: "ok" | "erro" } | null>(null);

  const showToast = (msg: string, tipo: "ok" | "erro" = "ok") => {
    setToast({ msg, tipo });
    setTimeout(() => setToast(null), 4000);
  };

  const nichos = [
    "Clinicas Odontologicas (Implantes e Lentes de Contato)",
    "Advocacia", "Clinica Estetica", "Nutricionista",
    "Contabilidade", "Creche e Escola Infantil", "Clinica de Fisioterapia"
  ];

  const handleBuscarLeads = async () => {
    setBuscando(true);
    try {
      const res = await fetch("/api/buscar-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nicho: buscarForm.nicho,
          cidade: buscarForm.cidade,
          estado: buscarForm.estado,
          quantidade: parseInt(buscarForm.quantidade) || 15
        })
      });
      if (!res.ok) throw new Error("Falha ao acionar o n8n");
      setShowBuscarModal(false);
      showToast("Busca iniciada! Os leads aparecem aqui em alguns minutos.");
      setTimeout(fetchCrmLeads, 30000);
    } catch {
      showToast("Erro ao conectar com o n8n. Verifique se o Workflow A está ativo.", "erro");
    } finally {
      setBuscando(false);
    }
  };

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

  const handleGerarProposta = async (lead: any) => {
    setGerandoPropostaId(lead.id);
    try {
      const res = await fetch("/api/build-and-deploy-site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: lead.nome || lead.title || lead.companyName,
          niche:       lead.categoria || lead.nicho || lead.niche,
          phone:       lead.telefone || lead.phone,
          address:     lead.endereco || lead.address,
          website:     lead.website  || lead.siteUrl || "",
          city:        lead.cidade   || lead.city,
        })
      });
      const data = await res.json();
      if (data.success || data.deployedUrl) {
        showToast(`Site gerado para ${lead.nome || lead.title}!`);
        const url = data.deployedUrl || `/api/site-preview/${data.projectId}`;
        window.open(url, "_blank");
      } else {
        throw new Error(data.error || "Falha na geração");
      }
      await fetchCrmLeads();
    } catch (err) {
      showToast("Erro ao gerar proposta. Tente novamente.", "erro");
    } finally {
      setGerandoPropostaId(null);
    }
  };

  // Reativa uma proposta expirada (site-amostra + PDF do n8n) por R$ 799.
  // A logica de negocio (novo prazo, novo preco) vive no n8n; aqui so chamamos.
  const handleReativarProposta = async (lead: any) => {
    if (!lead.propostaSlug) return;
    setReativandoSlug(lead.propostaSlug);
    try {
      const res = await fetch("/api/reativar-proposta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: lead.propostaSlug })
      });
      if (!res.ok) throw new Error("Falha ao reativar");
      const data = await res.json();
      const atualiza = (l: any) => l.id === lead.id
        ? { ...l, propostaStatus: "gerada", propostaValor: data.novoValor ?? 799, propostaExpiraEm: data.novaExpiraEm }
        : l;
      setCrmLeads(prev => prev.map(atualiza));
      setSelectedLead((prev: any) => (prev && prev.id === lead.id ? atualiza(prev) : prev));
      alert(`Proposta reativada por R$ ${data.novoValor ?? 799}! O site volta a ficar acessivel por mais 3 dias.`);
    } catch (err) {
      alert("Erro ao reativar a proposta. Confira o n8n.");
    } finally {
      setReativandoSlug(null);
    }
  };

  // Leads criados pelo n8n usam scoreOportunidade (0-100) em vez de indexNum/score,
  // que so existiam nos leads de mock antigos. Essas funcoes cobrem os dois formatos.
  const getScore = (lead: any) => lead.scoreOportunidade ?? lead.indexNum ?? lead.score ?? 0;
  const getTier = (lead: any) => {
    if (lead.temp) return lead.temp;
    const s = getScore(lead);
    if (s >= 70) return "Quente";
    if (s >= 40) return "Morno";
    return "Frio";
  };

  const filteredLeads = crmLeads.filter(lead => {
    const matchesSearch = lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.categoria?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.cidade?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.telefone?.includes(searchTerm);
    if (!matchesSearch) return false;

    if (filterTag === "Sem proposta") return !lead.propostaSlug && !lead.generatedSiteUrl;
    if (filterTag === "Proposta enviada") return lead.propostaStatus === "gerada";
    if (filterTag === "Pago / Aceito") return lead.propostaStatus === "pago";
    if (filterTag === "Expirado") return lead.propostaStatus === "expirado";
    if (filterTag === "Sem site") return !lead.temSite;
    if (filterTag === "Tier 3 (Quente)") return getTier(lead) === "Quente";
    if (filterTag === "Tier 2 (Morno)") return getTier(lead) === "Morno";
    if (filterTag === "Score 50+") return getScore(lead) >= 50;
    if (filterTag === "Com telefone") return !!lead.telefone;
    return true;
  });

  const columns = ["Base", "Abordado", "Agendado", "Follow Up", "Convertido"];

  return (
    <div className="flex-1 overflow-y-auto w-full bg-[#070c18] text-white min-h-screen pb-20 font-sans">

      {/* TOAST */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[9999] flex items-start gap-3 px-5 py-4 rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-sm animate-fade-in-up ${toast.tipo === "erro" ? "bg-red-50 text-red-800" : "bg-emerald-50 text-emerald-800"}`}>
          <span className="text-lg">{toast.tipo === "erro" ? "✕" : "✓"}</span>
          <p className="text-sm font-semibold leading-snug">{toast.msg}</p>
          <button onClick={() => setToast(null)} className="ml-auto text-slate-400 hover:text-slate-700 shrink-0"><X size={15} /></button>
        </div>
      )}
      <Header 
        title="Gestão de Clientes ✦ CRM Comercial" 
        subtitle="Filtre, priorize e acompanhe a jornada de prospecção e vendas de cada cliente." 
      />

      <div className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-6">

        {/* CAMPO DE BUSCA + BOTÃO BUSCAR LEADS */}
        <div className="flex gap-3">
          <div className="flex-1 bg-white text-slate-900 border-2 border-slate-900 rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] flex items-center gap-3">
            <Search className="text-slate-400 shrink-0" size={20} />
            <input
              type="text"
              placeholder="Buscar por nome, categoria, cidade ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-slate-900 text-sm md:text-base font-medium focus:outline-none placeholder:text-slate-400"
            />
          </div>
          <button
            onClick={() => setShowBuscarModal(true)}
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-extrabold text-sm px-5 rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 whitespace-nowrap uppercase tracking-wide"
          >
            <Sparkles size={16} /> Buscar Leads
          </button>
        </div>

        {/* MODAL BUSCAR LEADS */}
        {showBuscarModal && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white text-slate-900 border-2 border-slate-900 rounded-2xl p-6 w-full max-w-md shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-extrabold text-lg uppercase tracking-wide">Buscar Leads via n8n</h2>
                <button onClick={() => setShowBuscarModal(false)} className="text-slate-400 hover:text-slate-900"><X size={20} /></button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-extrabold uppercase tracking-wide text-slate-600 block mb-1">Nicho</label>
                  <select
                    value={buscarForm.nicho}
                    onChange={(e) => setBuscarForm(f => ({ ...f, nicho: e.target.value }))}
                    className="w-full border-2 border-slate-900 rounded-lg px-3 py-2.5 text-sm font-medium focus:outline-none focus:border-[#2563eb]"
                  >
                    <option value="">Automático (rotação do dia)</option>
                    {nichos.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>

                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-xs font-extrabold uppercase tracking-wide text-slate-600 block mb-1">Cidade</label>
                    <input
                      type="text"
                      placeholder="Ex: São Paulo"
                      value={buscarForm.cidade}
                      onChange={(e) => setBuscarForm(f => ({ ...f, cidade: e.target.value }))}
                      className="w-full border-2 border-slate-900 rounded-lg px-3 py-2.5 text-sm font-medium focus:outline-none focus:border-[#2563eb]"
                    />
                  </div>
                  <div className="w-24">
                    <label className="text-xs font-extrabold uppercase tracking-wide text-slate-600 block mb-1">Estado</label>
                    <input
                      type="text"
                      placeholder="SP"
                      maxLength={2}
                      value={buscarForm.estado}
                      onChange={(e) => setBuscarForm(f => ({ ...f, estado: e.target.value.toUpperCase() }))}
                      className="w-full border-2 border-slate-900 rounded-lg px-3 py-2.5 text-sm font-medium focus:outline-none focus:border-[#2563eb]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-extrabold uppercase tracking-wide text-slate-600 block mb-1">Quantidade de leads</label>
                  <input
                    type="number"
                    min={1} max={50}
                    value={buscarForm.quantidade}
                    onChange={(e) => setBuscarForm(f => ({ ...f, quantidade: e.target.value }))}
                    className="w-full border-2 border-slate-900 rounded-lg px-3 py-2.5 text-sm font-medium focus:outline-none focus:border-[#2563eb]"
                  />
                </div>
              </div>

              <button
                onClick={handleBuscarLeads}
                disabled={buscando}
                className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-60 text-white font-extrabold text-sm py-3.5 rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
              >
                {buscando ? <><Loader2 size={16} className="animate-spin" /> Buscando…</> : <><Sparkles size={16} /> Iniciar busca</>}
              </button>
              <p className="text-[11px] text-slate-500 text-center">Deixe Nicho/Cidade em branco para usar a rotação automática do dia.</p>
            </div>
          </div>
        )}

        {/* CHIPS DE FILTRO COM DESIGN DE BOTÃO QUADRADO (AZUL ESCOM) */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 custom-scrollbar">
          {["Todos", "Sem proposta", "Proposta enviada", "Pago / Aceito", "Expirado", "Sem site", "Tier 3 (Quente)", "Tier 2 (Morno)", "Score 50+", "Com telefone"].map(tag => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag)}
              className={`px-4 py-2 rounded-lg text-xs font-extrabold whitespace-nowrap transition-all border-2 border-slate-900 ${
                filterTag === tag
                  ? "bg-[#2563eb] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-slate-800 hover:bg-slate-100 shadow-sm"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* KANBAN BOARD EM CARDS BRANCOS E BORDAS FORTES SOBRE FUNDO ESCURO */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 items-start">
          {columns.map(colName => {
            const colLeads = filteredLeads.filter(l => (l.etapa || "Base") === colName);
            const dotColor = colName === "Base" ? "bg-[#2563eb]" : colName === "Abordado" ? "bg-cyan-500" : colName === "Agendado" ? "bg-emerald-500" : "bg-amber-500";

            return (
              <div key={colName} className="bg-white text-slate-900 border-2 border-slate-900 rounded-2xl p-4 min-h-[550px] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.9)] flex flex-col">
                
                {/* Header Coluna */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-slate-200 px-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${dotColor} border border-slate-900`}></span>
                    <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wide">{colName}</h3>
                  </div>
                  <span className="text-xs font-mono bg-slate-100 text-slate-900 font-bold px-2 py-0.5 rounded-md border border-slate-300">
                    {colLeads.length}
                  </span>
                </div>

                {/* Cards na Coluna */}
                <div className="space-y-3 flex-1">
                  {colLeads.length === 0 ? (
                    <div className="py-16 text-center text-xs text-slate-400 italic">
                      Sem leads
                    </div>
                  ) : (
                    colLeads.map(lead => (
                      <div
                        key={lead.id}
                        onClick={() => { setSelectedLead(lead); setActiveModalTab("Informações"); }}
                        className="bg-slate-50 border-2 border-slate-900 hover:border-[#2563eb] hover:bg-white rounded-xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(37,99,235,1)] transition-all cursor-pointer space-y-3 group"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#2563eb] text-white border border-slate-900">
                            #{getScore(lead)}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-800 border border-slate-400">
                            {getTier(lead)}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-[#2563eb] leading-snug line-clamp-2 transition-colors">
                            {lead.nome}
                          </h4>
                          <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                            {lead.categoria} &bull; {lead.cidade}
                          </p>
                        </div>

                        {/* Status da proposta no card */}
                        {lead.propostaStatus === "pago" ? (
                          <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-400 rounded-md px-2 py-1.5 uppercase">
                            <Check size={11} /> Aceito — Pago
                          </div>
                        ) : lead.propostaStatus === "expirado" ? (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleReativarProposta(lead); }}
                            disabled={reativandoSlug === lead.propostaSlug}
                            className="w-full text-[10px] font-extrabold text-center py-1.5 rounded-md border border-slate-900 bg-red-50 text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50 uppercase"
                          >
                            {reativandoSlug === lead.propostaSlug ? "Reativando…" : "Expirado — Reativar R$ 799"}
                          </button>
                        ) : (lead.generatedSiteUrl || lead.pdfUrl) ? (
                          <div className="flex items-center gap-2 text-[10px] font-bold">
                            {lead.generatedSiteUrl && (
                              <a href={lead.generatedSiteUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="flex-1 text-center py-1.5 rounded-md border border-slate-900 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors">
                                Ver site
                              </a>
                            )}
                            {lead.pdfUrl && (
                              <a href={lead.pdfUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="flex-1 text-center py-1.5 rounded-md border border-slate-900 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors">
                                Ver PDF
                              </a>
                            )}
                          </div>
                        ) : gerandoPropostaId === lead.id ? (
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-300 rounded-md px-2 py-1.5">
                            <Loader2 size={11} className="animate-spin" /> Gerando proposta…
                          </div>
                        ) : (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleGerarProposta(lead); }}
                            className="w-full text-[10px] font-extrabold text-center py-1.5 rounded-md border border-slate-900 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors uppercase"
                          >
                            + Gerar proposta
                          </button>
                        )}

                        {/* Botão de Ligar em Azul ESCOM */}
                        <div className="pt-2 border-t border-slate-200">
                          <a
                            href={`tel:${lead.telefone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-extrabold py-2.5 rounded-lg text-center border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all block uppercase tracking-wide"
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

        {/* LEAD DETAILS MODAL EM CARD BRANCO */}
        {selectedLead && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white text-slate-900 border-2 border-slate-900 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col">
              
              {/* Header Modal */}
              <div className="p-6 border-b-2 border-slate-900 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <button onClick={() => setSelectedLead(null)} className="p-1.5 rounded-lg border-2 border-slate-900 hover:bg-slate-200 text-slate-800">
                    <ChevronLeft size={20} />
                  </button>
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-md bg-[#2563eb] text-white border border-slate-900">
                    #{getScore(selectedLead)}
                  </span>
                  <h2 className="text-lg font-extrabold text-slate-900 truncate max-w-md">
                    {selectedLead.nome}
                  </h2>
                </div>

                <button onClick={() => setSelectedLead(null)} className="p-2 rounded-lg border-2 border-slate-900 bg-white hover:bg-slate-100 text-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <X size={18} />
                </button>
              </div>

              {/* Abas Modal */}
              <div className="flex items-center gap-2 border-b-2 border-slate-300 px-6 bg-slate-100/80">
                {(["Informações", "Scripts", "Objeções", "Site", "Venda", "Agendar"] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveModalTab(tab)}
                    className={`py-3.5 px-4 text-xs font-extrabold transition-all relative border-b-4 ${
                      activeModalTab === tab
                        ? "text-[#2563eb] border-[#2563eb]"
                        : "text-slate-600 border-transparent hover:text-slate-900"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Conteúdo da Aba */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-white">
                {activeModalTab === "Informações" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-50 border-2 border-slate-900 p-4 rounded-xl space-y-1">
                        <span className="text-xs font-mono text-slate-500 font-bold uppercase">CATEGORIA</span>
                        <div className="text-sm font-bold text-slate-900">{selectedLead.categoria}</div>
                      </div>

                      <div className="bg-slate-50 border-2 border-slate-900 p-4 rounded-xl space-y-1">
                        <span className="text-xs font-mono text-slate-500 font-bold uppercase">TELEFONE</span>
                        <div className="text-sm font-bold text-[#2563eb]">{selectedLead.telefone || "Não informado"}</div>
                      </div>
                    </div>

                    <div className="bg-slate-50 border-2 border-slate-900 p-4 rounded-xl space-y-1">
                      <span className="text-xs font-mono text-slate-500 font-bold uppercase">ENDEREÇO</span>
                      <div className="text-sm font-bold text-slate-900">{selectedLead.endereco || selectedLead.cidade}</div>
                    </div>

                    {selectedLead.propostaStatus === "expirado" ? (
                      <div className="bg-red-50 border-2 border-slate-900 p-4 rounded-xl space-y-2">
                        <span className="text-xs font-mono text-red-700 font-bold uppercase">Amostra expirada (3 dias sem pagamento)</span>
                        <p className="text-xs text-slate-600">O site e o PDF ficam ocultos ao público até reativar. Reative por um preço promocional — a amostra volta a ficar acessível por mais 3 dias.</p>
                        <button
                          onClick={() => handleReativarProposta(selectedLead)}
                          disabled={reativandoSlug === selectedLead.propostaSlug}
                          className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-extrabold text-sm py-3 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all uppercase tracking-wide"
                        >
                          {reativandoSlug === selectedLead.propostaSlug ? "Reativando..." : "Reativar por R$ 799"}
                        </button>
                      </div>
                    ) : (selectedLead.generatedSiteUrl || selectedLead.pdfUrl) && (
                      <div className="bg-slate-50 border-2 border-slate-900 p-4 rounded-xl space-y-2">
                        <span className="text-xs font-mono text-slate-500 font-bold uppercase">Proposta gerada automaticamente (n8n)</span>
                        <div className="flex gap-2">
                          {selectedLead.generatedSiteUrl && (
                            <a href={selectedLead.generatedSiteUrl} target="_blank" rel="noreferrer" className="flex-1 text-center text-xs font-extrabold py-2.5 rounded-lg border-2 border-slate-900 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors">
                              Ver site-amostra
                            </a>
                          )}
                          {selectedLead.pdfUrl && (
                            <a href={selectedLead.pdfUrl} target="_blank" rel="noreferrer" className="flex-1 text-center text-xs font-extrabold py-2.5 rounded-lg border-2 border-slate-900 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors">
                              Ver Análise Estratégica (PDF)
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Botão Gerar Proposta via n8n — só quando ainda não existe proposta */}
                    {!selectedLead.propostaSlug && !selectedLead.generatedSiteUrl && selectedLead.propostaStatus !== 'expirado' && (
                      <button
                        onClick={() => handleGerarProposta(selectedLead)}
                        disabled={gerandoPropostaId === selectedLead.id}
                        className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-extrabold text-sm py-4 rounded-lg border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 uppercase tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {gerandoPropostaId === selectedLead.id
                          ? <><Loader2 className="animate-spin" size={18} /><span>Gerando proposta…</span></>
                          : <><Sparkles size={18} /><span>Gerar Proposta para {selectedLead.nome}</span></>
                        }
                      </button>
                    )}

                    {/* Badge proposta paga */}
                    {selectedLead.propostaStatus === 'pago' && (
                      <div className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border-2 border-emerald-600 bg-emerald-50 text-emerald-700 font-extrabold text-sm uppercase tracking-wide">
                        ✓ Proposta aceita e paga
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
