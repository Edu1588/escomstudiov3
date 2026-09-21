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
      alert(`Proposta reativada por R$ ${data.novoValor ?? 799}! O site volta a ficar acessível por mais 3 dias.`);
    } catch (err) {
      alert("Erro ao reativar a proposta. Confira o n8n.");
    } finally {
      setReativandoSlug(null);
    }
  };

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
    <div className="flex-1 overflow-y-auto w-full bg-[#050507] text-white min-h-screen pb-24 font-sans custom-scrollbar">

      {/* TOAST FEEDBACK */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[9999] flex items-start gap-3 px-5 py-4 rounded-xl border border-white/20 shadow-2xl max-w-sm animate-in fade-in slide-in-from-bottom-3 ${
          toast.tipo === "erro" ? "bg-rose-950/90 text-rose-200 border-rose-500/40" : "bg-emerald-950/90 text-emerald-200 border-emerald-500/40"
        }`}>
          <span className="text-base font-bold">{toast.tipo === "erro" ? "✕" : "✓"}</span>
          <p className="text-xs font-mono font-medium leading-snug">{toast.msg}</p>
          <button onClick={() => setToast(null)} className="ml-auto text-white/40 hover:text-white shrink-0"><X size={14} /></button>
        </div>
      )}

      {/* HEADER PRINCIPAL */}
      <Header 
        title="Gestão de Clientes · Funil CRM" 
        subtitle="Filtre, priorize e acompanhe a jornada de prospecção e vendas de cada lead." 
      />

      <div className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-6">

        {/* CAMPO DE BUSCA + BOTÃO BUSCAR LEADS */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 bg-[#0b0c12] text-white border border-white/10 rounded-xl px-4 py-3 shadow-lg flex items-center gap-3 focus-within:border-cyan/50 transition-colors">
            <Search className="text-white/40 shrink-0" size={18} />
            <input
              type="text"
              placeholder="Buscar por nome, categoria, cidade ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-white text-xs md:text-sm font-sans focus:outline-none placeholder:text-white/30"
            />
          </div>
          <button
            onClick={() => setShowBuscarModal(true)}
            className="bg-[#00d1ff] hover:bg-[#00b8e6] text-black font-mono font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow-lg shadow-[#00d1ff]/15 active:scale-95 transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <Sparkles size={15} />
            <span>Buscar Leads</span>
          </button>
        </div>

        {/* CHIPS DE FILTRO */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {["Todos", "Sem proposta", "Proposta enviada", "Pago / Aceito", "Expirado", "Sem site", "Tier 3 (Quente)", "Tier 2 (Morno)", "Score 50+", "Com telefone"].map(tag => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                filterTag === tag
                  ? "bg-cyan/15 text-cyan border border-cyan/40 font-bold shadow-md shadow-cyan/5"
                  : "bg-white/5 text-white/50 hover:text-white hover:bg-white/10 border border-white/10"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* KANBAN BOARD */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5 items-start">
          {columns.map(colName => {
            const colLeads = filteredLeads.filter(l => (l.etapa || "Base") === colName);
            const dotColor = colName === "Base" ? "bg-cyan" : colName === "Abordado" ? "bg-sky-400" : colName === "Agendado" ? "bg-emerald-400" : colName === "Follow Up" ? "bg-amber-400" : "bg-emerald-500";

            return (
              <div key={colName} className="bg-[#0b0c12] border border-white/10 rounded-2xl p-4 min-h-[550px] shadow-xl flex flex-col">
                
                {/* Header da Coluna */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10 px-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${dotColor} shadow-[0_0_8px_currentColor]`}></span>
                    <h3 className="font-serif text-sm text-white font-normal uppercase tracking-wider">{colName}</h3>
                  </div>
                  <span className="text-[11px] font-mono bg-white/5 text-cyan font-bold px-2 py-0.5 rounded-md border border-cyan/20">
                    {colLeads.length}
                  </span>
                </div>

                {/* Cards na Coluna */}
                <div className="space-y-3 flex-1">
                  {colLeads.length === 0 ? (
                    <div className="py-20 text-center text-xs font-mono text-white/30 italic">
                      Sem leads
                    </div>
                  ) : (
                    colLeads.map(lead => (
                      <div
                        key={lead.id}
                        onClick={() => { setSelectedLead(lead); setActiveModalTab("Informações"); }}
                        className="bg-[#10121a] hover:bg-[#151724] border border-white/10 hover:border-cyan/40 rounded-xl p-4 shadow-md transition-all cursor-pointer space-y-3 group"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan/10 text-cyan border border-cyan/30">
                            #{getScore(lead)}
                          </span>
                          <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded border ${
                            getTier(lead) === "Quente" ? "bg-amber-500/10 text-amber-400 border-amber-500/30" :
                            getTier(lead) === "Morno" ? "bg-sky-500/10 text-sky-400 border-sky-500/30" :
                            "bg-white/5 text-white/50 border-white/10"
                          }`}>
                            {getTier(lead)}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-serif text-sm font-medium text-white group-hover:text-cyan leading-snug line-clamp-2 transition-colors">
                            {lead.nome}
                          </h4>
                          <p className="text-[11px] font-mono text-white/40 mt-1 line-clamp-1">
                            {lead.categoria} &bull; {lead.cidade}
                          </p>
                        </div>

                        {/* Status da proposta no card */}
                        {lead.propostaStatus === "pago" ? (
                          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-md px-2 py-1.5 uppercase">
                            <Check size={11} /> Aceito — Pago
                          </div>
                        ) : lead.propostaStatus === "expirado" ? (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleReativarProposta(lead); }}
                            disabled={reativandoSlug === lead.propostaSlug}
                            className="w-full text-[10px] font-mono font-bold text-center py-1.5 rounded-md border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 transition-colors disabled:opacity-50 uppercase cursor-pointer"
                          >
                            {reativandoSlug === lead.propostaSlug ? "Reativando…" : "Expirado — Reativar"}
                          </button>
                        ) : (lead.generatedSiteUrl || lead.pdfUrl) ? (
                          <div className="flex items-center gap-2 text-[10px] font-mono font-semibold">
                            {lead.generatedSiteUrl && (
                              <a 
                                href={lead.generatedSiteUrl} 
                                target="_blank" 
                                rel="noreferrer" 
                                onClick={(e) => e.stopPropagation()} 
                                className="flex-1 text-center py-1 rounded border border-cyan/30 bg-cyan/10 text-cyan hover:bg-cyan/20 transition-colors"
                              >
                                Ver site
                              </a>
                            )}
                            {lead.pdfUrl && (
                              <a 
                                href={lead.pdfUrl} 
                                target="_blank" 
                                rel="noreferrer" 
                                onClick={(e) => e.stopPropagation()} 
                                className="flex-1 text-center py-1 rounded border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition-colors"
                              >
                                Ver PDF
                              </a>
                            )}
                          </div>
                        ) : gerandoPropostaId === lead.id ? (
                          <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-cyan bg-cyan/10 border border-cyan/30 rounded-md px-2 py-1.5">
                            <Loader2 size={11} className="animate-spin text-cyan" /> Gerando…
                          </div>
                        ) : (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleGerarProposta(lead); }}
                            className="w-full text-[10px] font-mono font-bold text-center py-1.5 rounded-md border border-cyan/30 bg-cyan/10 text-cyan hover:bg-cyan/20 transition-colors uppercase cursor-pointer"
                          >
                            + Gerar proposta
                          </button>
                        )}

                        {/* Botão de Ligar */}
                        <div className="pt-2 border-t border-white/5">
                          <a
                            href={`tel:${lead.telefone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-[#00d1ff] hover:bg-[#00b8e6] text-black text-xs font-mono font-bold py-2 rounded-lg text-center transition-all block uppercase tracking-wider shadow-sm cursor-pointer"
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

        {/* MODAL BUSCAR LEADS VIA N8N */}
        {showBuscarModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-[#0b0c12] text-white border border-white/15 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h2 className="font-serif text-lg text-white font-normal uppercase tracking-wide">Buscar Leads via n8n</h2>
                <button onClick={() => setShowBuscarModal(false)} className="text-white/40 hover:text-white transition-colors cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <label className="text-[10px] uppercase text-white/50 block mb-1">Nicho</label>
                  <select
                    value={buscarForm.nicho}
                    onChange={(e) => setBuscarForm(f => ({ ...f, nicho: e.target.value }))}
                    className="w-full bg-[#09090b] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan/50"
                  >
                    <option value="">Automático (rotação do dia)</option>
                    {nichos.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>

                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-[10px] uppercase text-white/50 block mb-1">Cidade</label>
                    <input
                      type="text"
                      placeholder="Ex: São Paulo"
                      value={buscarForm.cidade}
                      onChange={(e) => setBuscarForm(f => ({ ...f, cidade: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan/50"
                    />
                  </div>
                  <div className="w-24">
                    <label className="text-[10px] uppercase text-white/50 block mb-1">Estado</label>
                    <input
                      type="text"
                      placeholder="SP"
                      maxLength={2}
                      value={buscarForm.estado}
                      onChange={(e) => setBuscarForm(f => ({ ...f, estado: e.target.value.toUpperCase() }))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan/50 text-center font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase text-white/50 block mb-1">Quantidade de leads</label>
                  <input
                    type="number"
                    min={1} max={50}
                    value={buscarForm.quantidade}
                    onChange={(e) => setBuscarForm(f => ({ ...f, quantidade: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan/50"
                  />
                </div>
              </div>

              <button
                onClick={handleBuscarLeads}
                disabled={buscando}
                className="w-full bg-[#00d1ff] hover:bg-[#00b8e6] disabled:opacity-50 text-black font-mono font-bold text-xs py-3 rounded-xl shadow-lg shadow-[#00d1ff]/15 active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
              >
                {buscando ? <><Loader2 size={15} className="animate-spin text-black" /> Buscando…</> : <><Sparkles size={15} /> Iniciar busca</>}
              </button>
              <p className="text-[10px] font-mono text-white/40 text-center">Deixe Nicho/Cidade em branco para rotação automática.</p>
            </div>
          </div>
        )}

        {/* LEAD DETAILS MODAL */}
        {selectedLead && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-[#0b0c12] text-white border border-white/15 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200">
              
              {/* Header Modal */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan/10 text-cyan border border-cyan/30">
                    #{getScore(selectedLead)}
                  </span>
                  <h2 className="font-serif text-lg text-white font-normal truncate max-w-md">
                    {selectedLead.nome}
                  </h2>
                </div>

                <button onClick={() => setSelectedLead(null)} className="text-white/40 hover:text-white p-1 rounded-lg transition-colors cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              {/* Abas Modal */}
              <div className="flex items-center gap-2 border-b border-white/10 px-5 bg-white/[0.01] overflow-x-auto">
                {(["Informações", "Scripts", "Objeções", "Site", "Venda", "Agendar"] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveModalTab(tab)}
                    className={`py-3 px-3 text-xs font-mono uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                      activeModalTab === tab
                        ? "text-cyan border-cyan font-bold"
                        : "text-white/40 border-transparent hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Conteúdo da Aba */}
              <div className="p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar text-white">
                {activeModalTab === "Informações" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white/[0.02] border border-white/10 p-4 rounded-xl space-y-1">
                        <span className="text-[10px] font-mono text-white/40 uppercase">CATEGORIA</span>
                        <div className="text-xs font-medium text-white">{selectedLead.categoria}</div>
                      </div>

                      <div className="bg-white/[0.02] border border-white/10 p-4 rounded-xl space-y-1">
                        <span className="text-[10px] font-mono text-white/40 uppercase">TELEFONE</span>
                        <div className="text-xs font-mono font-bold text-cyan">{selectedLead.telefone || "Não informado"}</div>
                      </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/10 p-4 rounded-xl space-y-1">
                      <span className="text-[10px] font-mono text-white/40 uppercase">ENDEREÇO</span>
                      <div className="text-xs text-white/80">{selectedLead.endereco || selectedLead.cidade}</div>
                    </div>

                    {selectedLead.propostaStatus === "expirado" ? (
                      <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl space-y-2">
                        <span className="text-xs font-mono text-rose-300 font-bold uppercase">Amostra expirada (3 dias sem pagamento)</span>
                        <p className="text-xs text-white/60">O site e o PDF ficam ocultos ao público até reativar. Reative por um valor promocional de manutenção.</p>
                        <button
                          onClick={() => handleReativarProposta(selectedLead)}
                          disabled={reativandoSlug === selectedLead.propostaSlug}
                          className="w-full bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-mono font-bold text-xs py-2.5 rounded-lg transition-all uppercase tracking-wider cursor-pointer"
                        >
                          {reativandoSlug === selectedLead.propostaSlug ? "Reativando..." : "Reativar por R$ 799"}
                        </button>
                      </div>
                    ) : (selectedLead.generatedSiteUrl || selectedLead.pdfUrl) && (
                      <div className="bg-white/[0.02] border border-white/10 p-4 rounded-xl space-y-2">
                        <span className="text-[10px] font-mono text-white/40 uppercase">Proposta Gerada via n8n</span>
                        <div className="flex gap-2">
                          {selectedLead.generatedSiteUrl && (
                            <a href={selectedLead.generatedSiteUrl} target="_blank" rel="noreferrer" className="flex-1 text-center text-xs font-mono font-bold py-2 rounded-lg border border-cyan/30 bg-cyan/10 text-cyan hover:bg-cyan/20 transition-colors">
                              Ver site-amostra
                            </a>
                          )}
                          {selectedLead.pdfUrl && (
                            <a href={selectedLead.pdfUrl} target="_blank" rel="noreferrer" className="flex-1 text-center text-xs font-mono font-bold py-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition-colors">
                              Ver PDF Estratégico
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Botão Gerar Proposta via n8n */}
                    {!selectedLead.propostaSlug && !selectedLead.generatedSiteUrl && selectedLead.propostaStatus !== 'expirado' && (
                      <button
                        onClick={() => handleGerarProposta(selectedLead)}
                        disabled={gerandoPropostaId === selectedLead.id}
                        className="w-full bg-[#00d1ff] hover:bg-[#00b8e6] text-black font-mono font-bold text-xs py-3.5 rounded-xl shadow-lg shadow-[#00d1ff]/15 active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer disabled:opacity-50"
                      >
                        {gerandoPropostaId === selectedLead.id
                          ? <><Loader2 className="animate-spin" size={15} /><span>Gerando proposta…</span></>
                          : <><Sparkles size={15} /><span>Gerar Proposta para {selectedLead.nome}</span></>
                        }
                      </button>
                    )}

                    {/* Badge proposta paga */}
                    {selectedLead.propostaStatus === 'pago' && (
                      <div className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono font-bold text-xs uppercase tracking-wider">
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
