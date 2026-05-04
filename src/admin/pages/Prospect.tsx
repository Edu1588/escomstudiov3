import React, { useState } from "react";
import { Header } from "../components/Header";
import { 
  Search, ArrowRight, LayoutDashboard, UserCheck, Briefcase, Clock, 
  Loader2, Download, Globe, Mail, Phone, MessageSquare, Bookmark, 
  ChevronRight, Building2, Send, Copy, Trash2, FileText
} from "lucide-react";

export default function Prospect() {
  const [activeTab, setActiveTab] = useState("UX ANALYZER");
  
  // States specific to tabs
  const [uxState, setUxState] = useState<"idle" | "loading" | "results">("idle");
  const [uxActiveInnerTab, setUxActiveInnerTab] = useState("IDENTIDADE VISUAL E UI");
  const [uxInput, setUxInput] = useState("");
  const [uxResults, setUxResults] = useState<any>(null);

  const [leadState, setLeadState] = useState<"idle" | "loading" | "results">("idle");
  const [leadInput, setLeadInput] = useState("");
  const [leadResults, setLeadResults] = useState<any[]>([]);
  const [leadGeneratingTextId, setLeadGeneratingTextId] = useState<number | null>(null);

  const [jobState, setJobState] = useState<"idle" | "loading" | "results">("idle");
  const [jobResults, setJobResults] = useState<any[]>([]);

  const [historyTab, setHistoryTab] = useState("LEADS (2)");

  const tabs = [
    { id: "UX ANALYZER", icon: <LayoutDashboard size={18} /> },
    { id: "LEAD FINDER", icon: <UserCheck size={18} /> },
    { id: "JOB FINDER", icon: <Briefcase size={18} /> },
    { id: "HISTÓRICO", icon: <Clock size={18} /> },
  ];

  const handleUxAudit = async () => {
    if (!uxInput) return;
    setUxState("loading");
    try {
      const res = await fetch("/api/analyze-ux", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: uxInput })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setUxResults(json.data);
      } else {
        alert(json.error || "Erro ao analisar");
      }
    } catch(err) {
      console.error(err);
      alert("Erro na conexão");
    } finally {
      setUxState("results");
    }
  };

  const handleLeadSearch = async () => {
    if (!leadInput) return;
    setLeadState("loading");
    try {
      const res = await fetch("/api/find-leads", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche: leadInput })
      });
      const json = await res.json();
      if (json.success) {
        setLeadResults(json.data);
      } else {
        alert(json.error || "Erro ao buscar leads");
      }
    } catch (err) {
      console.error(err);
      alert("Erro na conexão");
    } finally {
      setLeadState("results");
    }
  };

  const handleGenerateProspectText = async (index: number, siteInfo: any) => {
    setLeadGeneratingTextId(index);
    try {
      const res = await fetch("/api/generate-prospect-text", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteInfo })
      });
      const json = await res.json();
      if (json.success && json.data) {
        const newLeads = [...leadResults];
        newLeads[index].generatedText = json.data;
        setLeadResults(newLeads);
      } else {
        alert(json.error || "Erro ao gerar prospecção");
      }
    } catch(err) {
      console.error(err);
      alert("Erro na conexão");
    } finally {
      setLeadGeneratingTextId(null);
    }
  };

  const handleJobSearch = async () => {
    setJobState("loading");
    try {
      const res = await fetch("/api/find-jobs", {
        method: "POST", headers: { "Content-Type": "application/json" }
      });
      const json = await res.json();
      if (json.success) {
        setJobResults(json.data);
      } else {
        alert(json.error || "Erro ao buscar vagas");
      }
    } catch (err) {
      console.error(err);
      alert("Erro na conexão");
    } finally {
      setJobState("results");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto w-full bg-[#050505]">
      <Header title="Ferramentas PRO" />
      <div className="max-w-[1200px] mx-auto mt-8 px-8">
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#2EFF00]">
             <img src="https://eionstudio.com.br/wp-content/uploads/2026/02/about-slide-2.jpg" alt="Edu" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-[#2EFF00] text-5xl font-bold tracking-tight mb-2">ESCOM TOOLS</h1>
            <p className="text-gray-400 text-lg">Suite de ferramentas avançadas para análise de UX e captação de Leads B2B.</p>
          </div>
          <div className="ml-auto flex items-center gap-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-full px-4 py-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2EFF00] animate-pulse"></span>
            <span className="text-[#2EFF00] font-mono text-xs tracking-widest">SYSTEM ONLINE</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-16 border-b border-[#1a1a1a] pb-8 pt-4">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-4 rounded-md font-mono tracking-widest transition-all ${
                activeTab === tab.id 
                  ? 'bg-[#2EFF00] text-black font-bold shadow-[0_0_15px_rgba(46,255,0,0.5)]' 
                  : 'bg-transparent border border-[#333] text-[#2EFF00] hover:bg-[#111]'
              }`}
            >
              {React.cloneElement(tab.icon, { size: 18 })}
              {tab.id}
            </button>
          ))}
        </div>

        {/* --- UX ANALYZER TAB --- */}
        {activeTab === "UX ANALYZER" && (
          <div className="max-w-5xl">
             {uxState === "idle" && (
               <div className="relative mb-24">
                 <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-[#2EFF00]/50 to-[#2EFF00]/10 blur opacity-30"></div>
                 <div className="relative flex items-center bg-[#050505] border border-[#2EFF00] rounded-lg">
                   <div className="px-6 text-[#2EFF00]">
                     <Search size={24} />
                   </div>
                   <input 
                     type="text" 
                     value={uxInput}
                     onChange={e => setUxInput(e.target.value)}
                     placeholder="Cole a URL do site aqui (ex: https://brasil.uxdesign.cc)"
                     className="flex-1 bg-transparent border-none py-6 text-white font-mono placeholder:text-gray-600 focus:outline-none"
                   />
                   <button onClick={handleUxAudit} className="bg-[#188C00] hover:bg-[#20ba00] text-black font-mono tracking-widest font-bold flex items-center gap-3 px-10 py-6 rounded-r-md border-l border-[#2EFF00] transition-colors">
                     AUDITAR
                     <ArrowRight size={20} />
                   </button>
                 </div>
               </div>
             )}

             {uxState === "loading" && (
                <div className="py-24 flex flex-col items-center justify-center border border-[#1a1a1a] border-dashed rounded-xl bg-[#0a0a0a]/50">
                   <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
                     <div className="absolute inset-0 border-4 border-[#2EFF00]/20 rounded-full"></div>
                     <div className="absolute inset-0 border-4 border-[#2EFF00] rounded-full border-t-transparent animate-spin"></div>
                     <Search size={32} className="text-[#2EFF00]" />
                   </div>
                   <h2 className="text-[#2EFF00] text-xl font-mono tracking-widest mb-6">PROCESSANDO DADOS</h2>
                   <div className="w-[400px] h-2 bg-[#1a1a1a] rounded overflow-hidden mb-2">
                     <div className="h-full bg-[#2EFF00] w-[8%]"></div>
                   </div>
                   <div className="w-[400px] flex justify-between text-[#2EFF00] font-mono text-[10px] tracking-widest">
                     <span>EXTRAINDO CONTEXTO</span>
                     <span>8%</span>
                   </div>
                   <p className="text-gray-500 font-mono text-xs mt-8">Avaliando heurísticas, leis de UX e vieses cognitivos... Isso pode levar alguns segundos.</p>
                </div>
             )}

             {uxState === "results" && (
                <div className="border border-[#1a1a1a] rounded-xl bg-[#0a0a0a] p-8">
                   <div className="flex justify-between items-center mb-8 border-b border-[#1a1a1a] pb-6">
                     <div className="flex items-center gap-4 text-[#2EFF00]">
                       <LayoutDashboard size={24} />
                       <h2 className="font-mono tracking-widest uppercase text-lg">Relatório de Auditoria</h2>
                     </div>
                     <button className="flex items-center gap-2 bg-transparent hover:bg-[#111] border border-[#2EFF00] text-[#2EFF00] px-4 py-2 rounded font-mono text-sm transition-colors">
                       <Download size={16} />
                       BAIXAR RELATÓRIO
                     </button>
                   </div>

                   <div className="flex flex-wrap gap-2 mb-8">
                     {["RESUMO EXECUTIVO", "IDENTIDADE VISUAL E UI", "HEURÍSTICAS DE NIELSEN", "VIESES COGNITIVOS E PSICOLOGIA", "ARQUITETURA DA INFORMAÇÃO", "ACESSIBILIDADE E INCLUSÃO"].map(tab => (
                       <button
                         key={tab}
                         onClick={() => setUxActiveInnerTab(tab)}
                         className={`px-6 py-3 font-mono text-xs tracking-widest transition-colors border ${
                           uxActiveInnerTab === tab 
                             ? 'bg-[#2EFF00] text-black border-[#2EFF00] font-bold' 
                             : 'bg-transparent text-[#2EFF00] border-[#1a1a1a] hover:border-[#333]'
                         }`}
                       >
                         {tab}
                       </button>
                     ))}
                   </div>

                   <div className="bg-[#050505] border border-[#1a1a1a] rounded-lg p-8">
                      <p className="text-gray-300 text-sm leading-relaxed mb-8">
                        {uxResults?.summary || "Resumo da auditoria da página..."}
                      </p>

                      <div className="border-t border-[#1a1a1a] pt-8 space-y-8">
                         {uxResults?.issues?.filter((i: any) => i.tab === uxActiveInnerTab)?.length > 0 ? (
                           uxResults.issues.filter((i: any) => i.tab === uxActiveInnerTab).map((issue: any, idx: number) => (
                             <div key={idx} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-px before:bg-[#2EFF00]/30">
                                <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full border-2 border-[#2EFF00] bg-black ring-4 ring-black"></div>
                                <h3 className="text-white font-bold text-lg mb-3">{issue.title}</h3>
                                <p className="text-gray-400 text-sm mb-4">{issue.description}</p>
                                <div className="bg-[#111] border border-[#1a1a1a] rounded p-4">
                                  <div className="text-[#2EFF00] font-mono text-[10px] tracking-widest mb-2 flex items-center gap-2">
                                    <span className="rotate-180 inline-block w-2 h-2 text-current">&rarr;</span>
                                    COMO DEVERIA SER:
                                  </div>
                                  <p className="text-[#2EFF00] text-sm">{issue.recommendation}</p>
                                </div>
                             </div>
                           ))
                         ) : (
                           <div className="text-gray-500 font-mono text-sm text-center py-8">Nenhum problema encontrado nesta categoria específica ainda.</div>
                         )}
                      </div>
                   </div>
                </div>
             )}
          </div>
        )}

        {/* --- LEAD FINDER TAB --- */}
        {activeTab === "LEAD FINDER" && (
          <div className="max-w-5xl">
            {leadState === "idle" && (
              <>
                <div className="relative mb-20">
                  <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-[#2EFF00]/50 to-[#2EFF00]/10 blur opacity-30"></div>
                  <div className="relative flex items-center bg-[#050505] border border-[#2EFF00] rounded-lg">
                    <div className="px-6 text-[#2EFF00]">
                      <Search size={24} />
                    </div>
                    <input 
                      type="text" 
                      value={leadInput}
                      onChange={e => setLeadInput(e.target.value)}
                      placeholder="Ex: Clínicas odontológicas em São Paulo"
                      className="flex-1 bg-transparent border-none py-6 text-white font-mono placeholder:text-gray-600 focus:outline-none"
                    />
                    <button onClick={handleLeadSearch} className="bg-[#188C00] hover:bg-[#20ba00] text-black font-mono tracking-widest font-bold flex items-center gap-3 px-8 py-6 rounded-r-md border-l border-[#2EFF00] transition-colors">
                      BUSCAR LEADS
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
                <div className="py-24 text-center border border-[#1a1a1a] border-dashed rounded-xl bg-[#0a0a0a]/50">
                  <Building2 size={48} className="mx-auto text-[#188C00] mb-6" />
                  <h3 className="text-[#2EFF00] font-mono tracking-widest uppercase mb-2 text-lg">NENHUM LEAD PESQUISADO</h3>
                  <p className="text-gray-500 font-mono text-sm">Digite um nicho acima para começar a buscar empresas e contatos.</p>
                </div>
              </>
            )}

            {leadState === "loading" && (
               <div className="py-24 flex flex-col items-center justify-center border border-[#1a1a1a] border-dashed rounded-xl bg-[#0a0a0a]/50">
                 <div className="relative px-8 py-4 mb-6">
                   <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#2EFF00] rounded-tr"></div>
                   <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#2EFF00] rounded-tl"></div>
                   <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#2EFF00] rounded-br"></div>
                   <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#2EFF00] rounded-bl"></div>
                   <Building2 size={32} className="text-[#2EFF00] animate-pulse" />
                 </div>
                 <h2 className="text-[#2EFF00] text-xl font-mono tracking-widest mb-6">MINERANDO EMPRESAS</h2>
                 <div className="w-[400px] h-2 bg-[#1a1a1a] rounded overflow-hidden mb-2">
                   <div className="h-full bg-[#2EFF00] w-[45%]"></div>
                 </div>
               </div>
            )}

            {leadState === "results" && (
              <>
                <div className="relative mb-12">
                  <div className="relative flex items-center bg-[#050505] border border-[#2EFF00] rounded-lg">
                    <div className="px-6 text-[#2EFF00]">
                      <Search size={24} />
                    </div>
                    <input 
                      type="text" 
                      value={leadInput}
                      onChange={e => setLeadInput(e.target.value)}
                      className="flex-1 bg-transparent border-none py-6 text-white font-mono focus:outline-none"
                    />
                    <button onClick={handleLeadSearch} className="bg-[#2EFF00] hover:bg-[#28e600] text-black font-mono tracking-widest font-bold flex items-center gap-3 px-8 py-6 rounded-r-md border-l border-[#2EFF00] transition-colors">
                      BUSCAR LEADS
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {leadResults.map((lead, idx) => (
                    <div key={idx} className="border border-[#1a1a1a] bg-[#0a0a0a] rounded-lg p-6 relative flex flex-col">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#188C00]"></div>
                      <h3 className="text-xl font-bold text-white mb-2 pl-2">{lead.title}</h3>
                      <p className="text-gray-400 font-mono text-xs mb-8 pl-2">{lead.snippet}</p>
                      
                      <div className="flex items-center gap-6 text-[10px] font-mono mb-8 pl-2 pb-6 border-b border-[#1a1a1a] overflow-x-auto">
                        <a href={lead.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#2EFF00] whitespace-nowrap hover:underline">
                          <Globe size={14} /> {new URL(lead.link.startsWith('http') ? lead.link : 'https://' + lead.link).hostname.toUpperCase()}
                        </a>
                        <div className="flex items-center gap-2 text-white whitespace-nowrap">
                          <Mail size={14} className="text-[#2EFF00]" /> {lead.email}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 whitespace-nowrap">
                          <Phone size={14} /> Telefone não encontrado
                        </div>
                      </div>

                      <div className="flex items-center gap-4 pl-2">
                        <button 
                          onClick={() => handleGenerateProspectText(idx, lead)}
                          disabled={leadGeneratingTextId === idx}
                          className="flex items-center gap-2 bg-[#188C00]/10 hover:bg-[#188C00]/20 text-[#188C00] border border-[#188C00]/30 disabled:opacity-50 px-6 py-3 rounded font-mono text-xs transition-colors"
                        >
                          {leadGeneratingTextId === idx ? <Loader2 size={16} className="animate-spin" /> : <MessageSquare size={16} />}
                          GERAR TEXTO DE PROSPECÇÃO
                        </button>
                        <button className="flex items-center gap-2 border border-[#333] hover:border-gray-500 text-gray-300 hover:text-white px-6 py-3 rounded font-mono text-xs transition-colors">
                          <Bookmark size={16} /> Salvar Lead
                        </button>
                      </div>

                      {lead.generatedText && (
                        <div className="border border-[#188C00]/30 bg-[#050505] rounded-lg overflow-hidden ml-2 mt-6">
                           <div className="flex items-center justify-between px-4 py-3 border-b border-[#188C00]/30 bg-[#188C00]/5">
                              <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                                <ChevronRight size={14} className="text-[#2EFF00]" />
                                Assunto: <span className="text-[#2EFF00] font-bold">{lead.generatedText.subject}</span>
                              </div>
                              <div className="flex items-center gap-3 text-gray-400">
                                <a href={`mailto:${lead.email}?subject=${encodeURIComponent(lead.generatedText.subject)}&body=${encodeURIComponent(lead.generatedText.body)}`} className="hover:text-white transition-colors"><Send size={14}/></a>
                                <button onClick={() => navigator.clipboard.writeText(lead.generatedText.body)} className="hover:text-white transition-colors"><Copy size={14}/></button>
                              </div>
                           </div>
                           <div className="p-4 bg-transparent text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                              {lead.generatedText.body}
                           </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {leadResults.length === 0 && (
                    <div className="text-gray-500 font-mono text-center pt-8">Nenhum lead encontrado, tente outro termo.</div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* --- JOB FINDER TAB --- */}
        {activeTab === "JOB FINDER" && (
          <div className="max-w-5xl">
             <div className="mb-12">
               <h2 className="text-[#2EFF00] flex items-center gap-4 text-3xl font-mono tracking-widest uppercase mb-6">
                 <Briefcase size={32} /> JOB FINDER
               </h2>
               <p className="text-gray-400 font-mono text-sm max-w-2xl leading-relaxed mb-8">
                 Busca automática por vagas recentes (últimos 15 dias) para Web Design, Diretor de Arte e Designer Sênior em São Paulo ou Remoto.
               </p>
               {jobState === "idle" && (
                 <button onClick={handleJobSearch} className="bg-[#2EFF00] hover:bg-[#28e600] text-black font-mono tracking-widest font-bold flex items-center gap-3 px-8 py-5 rounded-lg transition-colors">
                   <Search size={20} />
                   BUSCAR VAGAS RECENTES
                 </button>
               )}
               {jobState !== "idle" && (
                 <button className="bg-[#188C00] text-black font-mono tracking-widest font-bold flex items-center gap-3 px-8 py-5 rounded-lg opacity-80 cursor-not-allowed">
                   <Loader2 size={20} className="animate-spin" />
                   BUSCANDO VAGAS...
                 </button>
               )}
             </div>

             {jobState === "idle" && (
                <div className="py-24 text-center border border-[#1a1a1a] border-dashed rounded-xl bg-[#0a0a0a]/50">
                  <Briefcase size={48} className="mx-auto text-[#188C00] mb-6" />
                  <h3 className="text-[#2EFF00] font-mono tracking-widest uppercase mb-2 text-lg">NENHUMA VAGA PESQUISADA</h3>
                  <p className="text-gray-500 font-mono text-sm">Clique no botão acima para buscar vagas recentes.</p>
                </div>
             )}

             {jobState === "loading" && (
               <div className="py-24 flex flex-col items-center justify-center border border-[#1a1a1a] border-dashed rounded-xl bg-[#0a0a0a]/50">
                 <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
                   <div className="absolute inset-0 border-4 border-[#2EFF00]/20 rounded-full"></div>
                   <div className="absolute inset-0 border-4 border-[#2EFF00] rounded-full border-t-transparent animate-spin"></div>
                   <Briefcase size={32} className="text-[#2EFF00]" />
                 </div>
                 <h2 className="text-[#2EFF00] text-xl font-mono tracking-widest mb-6">MINERANDO VAGAS</h2>
                 <div className="w-[400px] h-2 bg-[#1a1a1a] rounded overflow-hidden mb-2">
                   <div className="h-full bg-[#2EFF00] w-[12%]"></div>
                 </div>
                 <div className="w-[400px] flex justify-between text-[#2EFF00] font-mono text-[10px] tracking-widest">
                   <span>BUSCANDO OPORTUNIDADES</span>
                   <span>12%</span>
                 </div>
               </div>
             )}

             {jobState === "results" && (
                <div className="space-y-6">
                  {jobResults.map((job, idx) => (
                   <div key={idx} className="border border-[#1a1a1a] bg-[#0a0a0a] rounded-lg p-6 relative flex flex-col">
                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#188C00]"></div>
                     
                     <div className="flex justify-between items-start mb-4 pl-2">
                       <h3 className="text-xl font-bold text-white">{job.title}</h3>
                       <div className="border border-[#188C00]/30 text-[#188C00] px-3 py-1 text-xs font-mono rounded bg-[#188C00]/5">{job.company}</div>
                     </div>
                     
                     <p className="text-gray-400 font-mono text-xs mb-8 pl-2 leading-relaxed">
                       {job.snippet}
                     </p>

                     <div className="flex items-center gap-6 text-[10px] font-mono mb-8 pl-2 pb-6 border-b border-[#1a1a1a]">
                       <div className="flex items-center gap-2 text-[#2EFF00]">
                         <Globe size={14} /> Via web
                       </div>
                       <div className="flex items-center gap-2 text-white">
                         <span className="text-[#2EFF00]">$</span> A combinar
                       </div>
                       <a href={job.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#2EFF00] hover:underline">
                         <Globe size={14} /> ACESSAR VAGA
                       </a>
                     </div>

                     <div className="flex items-center gap-4 pl-2">
                       <a href={job.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 border border-[#333] hover:border-[#2EFF00] text-gray-300 hover:text-white px-6 py-2 rounded font-mono text-xs transition-colors">
                         <FileText size={16} /> Detalhes
                       </a>
                     </div>
                   </div>
                  ))}
                  {jobResults.length === 0 && (
                     <div className="text-gray-500 font-mono text-center pt-8">Nenhuma vaga encontrada.</div>
                  )}
                </div>
             )}
          </div>
        )}

        {/* --- HISTÓRICO TAB --- */}
        {activeTab === "HISTÓRICO" && (
          <div className="max-w-5xl">

             <div className="flex items-center gap-6 mb-12 border-b border-[#1a1a1a] pb-6">
                <h2 className="text-[#2EFF00] flex items-center gap-4 text-3xl font-mono tracking-widest uppercase">
                  <Clock size={32} /> HISTÓRICO
                </h2>
                
                <div className="ml-auto flex bg-[#0a0a0a] border border-[#1a1a1a] rounded">
                   <button 
                     onClick={() => setHistoryTab("LEADS (2)")}
                     className={`px-6 py-3 font-mono text-xs tracking-widest transition-colors ${
                       historyTab === "LEADS (2)" ? 'bg-[#2EFF00] text-black font-bold' : 'text-gray-400 hover:text-white'
                     }`}
                   >
                     LEADS (2)
                   </button>
                   <button 
                     onClick={() => setHistoryTab("VAGAS (10)")}
                     className={`px-6 py-3 font-mono text-xs tracking-widest transition-colors border-l border-[#1a1a1a] ${
                       historyTab === "VAGAS (10)" ? 'bg-[#2EFF00] text-black font-bold' : 'text-gray-400 hover:text-white'
                     }`}
                   >
                     VAGAS (10)
                   </button>
                </div>
             </div>

             {historyTab === "LEADS (2)" && (
                <div className="space-y-6">
                   <div className="border border-[#1a1a1a] bg-[#0a0a0a] rounded-lg p-6 relative flex flex-col">
                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#188C00]"></div>
                     
                     <div className="flex justify-between items-start mb-6 pl-2">
                       <h3 className="text-xl font-bold text-white">Clínica Brasil Dentistas</h3>
                       <button className="text-xs font-mono text-gray-500 hover:text-red-500 underline decoration-gray-500 underline-offset-4 transition-colors">Remover</button>
                     </div>

                     <p className="text-gray-400 font-mono text-xs mb-8 pl-2 leading-relaxed">
                       Contato · Trabalhe Conosco; Go Back; Go Back. Search the Site. Inscreva-se ... Em consultório: feito pelo dentista, com resultados rápidos... Notícias. Ler ...
                     </p>

                     <div className="flex items-center gap-6 text-[10px] font-mono mb-8 pl-2 pb-6 border-b border-[#1a1a1a]">
                       <div className="flex items-center gap-2 text-[#2EFF00]">
                         <Globe size={14} /> WWW.CLINICABRASILDENTISTAS.COM.BR
                       </div>
                       <div className="flex items-center gap-2 text-white">
                         <Mail size={14} className="text-[#2EFF00]" /> contato@clinicabrasildentistas.com.br
                       </div>
                       <div className="flex items-center gap-2 text-gray-600">
                         <Phone size={14} /> Telefone não encontrado
                       </div>
                     </div>

                     {/* Prospection Generated Block */}
                     <div className="border border-[#188C00]/30 bg-[#050505] rounded-lg overflow-hidden ml-2">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-[#188C00]/30 bg-[#188C00]/5">
                           <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                             <ChevronRight size={14} className="text-[#2EFF00]" />
                             Assunto: <span className="text-[#2EFF00] font-bold">Otimizando a Experiência do Paciente na Clínica Brasil Dentistas</span>
                           </div>
                           <div className="flex items-center gap-3 text-gray-400">
                             <button className="hover:text-white transition-colors"><Send size={14}/></button>
                             <button className="hover:text-white transition-colors"><Copy size={14}/></button>
                           </div>
                        </div>
                        <div className="p-4 bg-transparent text-gray-300 text-sm leading-relaxed space-y-4">
                           <p>Olá, me chamo Edu Santos. Sou especialista em design de sites, análise cognitiva e vieses comportamentais com anos de experiência na área. Estava pesquisando sobre clínicas dentárias e acabei caindo no site da Clínica Brasil Dentistas.</p>
                           <p>Notei que o site oferece uma ampla gama de informações sobre os tratamentos e serviços oferecidos, o que é ótimo para os pacientes que buscam entender melhor suas opções de tratamento. No entanto, percebi que a navegação e a apresentação das informações poderiam ser otimizadas para melhorar a experiência do usuário e aumentar as conversões.</p>
                           <p>Uma abordagem de design estratégico, focada na psicologia do usuário, pode ajudar a simplificar a navegação, destacar os pontos fortes da clínica e direcionar os pacientes para as informações mais relevantes para suas necessidades. Isso pode incluir a criação de fluxos de usuário mais claros, a utilização de elementos visuais atraentes e a otimização do site para dispositivos...</p>
                        </div>
                     </div>

                   </div>
                </div>
             )}

             {historyTab === "VAGAS (10)" && (
                <div className="py-24 text-center border border-[#1a1a1a] rounded-xl bg-[#0a0a0a]">
                  <Briefcase size={48} className="mx-auto text-gray-600 mb-6" />
                  <p className="text-gray-500 font-mono text-sm max-w-[400px] mx-auto">Funcionalidade em construção. Aqui aparecerá a lista de vagas pesquisadas anteriormente.</p>
                </div>
             )}
          </div>
        )}

      </div>
    </div>
  );
}

