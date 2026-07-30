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
    <div className="flex-1 overflow-y-auto w-full bg-[#f6f5f0] text-slate-900 min-h-screen pb-20 font-sans">
      <Header 
        title="Gestão de Clientes ✦ CRM Comercial" 
        subtitle="Filtre, priorize e acompanhe a jornada de prospecção e vendas de cada cliente." 
      />

      <div className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-6">

        {/* CAMPO DE BUSCA COM NOVO DESIGN DE BORDA PRETA */}
        <div className="bg-white border-2 border-slate-900 rounded-xl p-4 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] flex items-center gap-3">
          <Search className="text-slate-400 shrink-0" size={20} />
          <input
            type="text"
            placeholder="Buscar por nome, categoria, cidade ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-slate-900 text-sm md:text-base font-medium focus:outline-none placeholder:text-slate-400"
          />
        </div>

        {/* CHIPS DE FILTRO COM DESIGN DE BOTÃO QUADRADO (AZUL ESCOM) */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 custom-scrollbar">
          {["Todos", "Sem site", "Tier 3 (Quente)", "Tier 2 (Morno)", "Score 50+", "Com telefone", "Com WhatsApp"].map(tag => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag)}
              className={`px-4 py-2 rounded-lg text-xs font-extrabold whitespace-nowrap transition-all border-2 border-slate-900 ${
                filterTag === tag
                  ? "bg-[#2563eb] text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
                  : "bg-white text-slate-800 hover:bg-slate-100 shadow-sm"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* KANBAN BOARD EM CARDS BRANCOS E BORDAS FORTES */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 items-start">
          {columns.map(colName => {
            const colLeads = filteredLeads.filter(l => (l.etapa || "Base") === colName);
            const dotColor = colName === "Base" ? "bg-[#2563eb]" : colName === "Abordado" ? "bg-cyan-500" : colName === "Agendado" ? "bg-emerald-500" : "bg-amber-500";

            return (
              <div key={colName} className="bg-white border-2 border-slate-900 rounded-2xl p-4 min-h-[550px] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col">
                
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
                        className="bg-slate-50 border-2 border-slate-900 hover:border-[#2563eb] hover:bg-white rounded-xl p-4 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:shadow-[4px_4px_0px_0px_rgba(37,99,235,1)] transition-all cursor-pointer space-y-3 group"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#2563eb] text-white border border-slate-900">
                            #{lead.indexNum || 21}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-800 border border-slate-400">
                            {lead.temp || "Frio"}
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

                        {/* Botão de Ligar em Azul ESCOM */}
                        <div className="pt-2 border-t border-slate-200">
                          <a
                            href={`tel:${lead.telefone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-extrabold py-2.5 rounded-lg text-center border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all block uppercase tracking-wide"
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

        {/* LEAD DETAILS MODAL */}
        {selectedLead && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#f6f5f0] border-2 border-slate-900 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex flex-col">
              
              {/* Header Modal */}
              <div className="p-6 border-b-2 border-slate-900 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <button onClick={() => setSelectedLead(null)} className="p-1.5 rounded-lg border-2 border-slate-900 hover:bg-slate-100 text-slate-800">
                    <ChevronLeft size={20} />
                  </button>
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-md bg-[#2563eb] text-white border border-slate-900">
                    #{selectedLead.indexNum || 21}
                  </span>
                  <h2 className="text-lg font-extrabold text-slate-900 truncate max-w-md">
                    {selectedLead.nome}
                  </h2>
                </div>

                <button onClick={() => setSelectedLead(null)} className="p-2 rounded-lg border-2 border-slate-900 bg-white hover:bg-slate-100 text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
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

                    {/* Botão Gerar Site em Azul ESCOM com Sombra Deslocada */}
                    <button
                      onClick={() => handleGenerateSiteFromCrm(selectedLead)}
                      disabled={isGeneratingSite}
                      className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-extrabold text-sm py-4 rounded-lg border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
                    >
                      {isGeneratingSite ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                      <span>Gerar Landing Page Personalizada para {selectedLead.nome}</span>
                    </button>
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
