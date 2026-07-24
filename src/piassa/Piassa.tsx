import React, { useState, useEffect } from "react";
import {
  Briefcase, Loader2, Globe, Bookmark, FileText, Lock, ArrowLeft,
  Clock, Trash2, CheckCircle, XCircle, AlertTriangle, Sun, Moon, RefreshCw, DollarSign,
  LayoutGrid, List
} from "lucide-react";
import { db } from "../lib/firebase";
import { collection, getDocs, deleteDoc, doc, query, orderBy, updateDoc } from "firebase/firestore";

const PASSWORD = "654321";

const ROLES = ["Todas", "Estrategista de Marketing", "Copywriter", "Redator", "Marketing Industrial", "Growth Marketing", "Redator Publicitário", "Funil de Vendas"];

export default function Piassa() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [shake, setShake] = useState(false);

  const [dark, setDark] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [savedLoading, setSavedLoading] = useState(false);
  const [filterRole, setFilterRole] = useState("Todas");
  const [sortBy, setSortBy] = useState<"recents" | "oldest">("recents");

  useEffect(() => {
    if (authenticated) loadSavedJobs();
  }, [authenticated]);

  const loadSavedJobs = async () => {
    setSavedLoading(true);
    try {
      const snap = await getDocs(query(collection(db, "jobs"), orderBy("createdAt", "desc")));
      setSavedJobs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error(e);
    } finally {
      setSavedLoading(false);
    }
  };

  const formatDate = (ts: any) => {
    if (!ts) return "";
    let ms = ts?.seconds ? ts.seconds * 1000 : typeof ts === "number" ? ts : Date.now();
    const d = new Date(ms);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  };

  const daysRemaining = (ts: any) => {
    if (!ts) return 15;
    let ms = ts?.seconds ? ts.seconds * 1000 : typeof ts === "number" ? ts : Date.now();
    const elapsed = (Date.now() - ms) / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.round(15 - elapsed));
  };

  const daysSincePost = (ts: any) => {
    if (!ts) return 0;
    let ms = ts?.seconds ? ts.seconds * 1000 : typeof ts === "number" ? ts : Date.now();
    return Math.max(0, Math.round((Date.now() - ms) / (1000 * 60 * 60 * 24)));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === PASSWORD) {
      setAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setPasswordInput("");
    }
  };

  const handleDeleteJob = async (id: string) => {
    try {
      await deleteDoc(doc(db, "jobs", id));
      setSavedJobs(savedJobs.filter(j => j.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, "jobs", id), { status });
      setSavedJobs(savedJobs.map(j => j.id === id ? { ...j, status } : j));
    } catch (e) {
      console.error(e);
    }
  };

  const getRoleCount = (roleName: string) => {
    if (roleName === "Todas") return savedJobs.length;
    return savedJobs.filter(j => j.role === roleName).length;
  };

  const filteredJobs = filterRole === "Todas" ? savedJobs : savedJobs.filter(j => j.role === filterRole);

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    const getMs = (ts: any) => (ts?.seconds ? ts.seconds * 1000 : typeof ts === "number" ? ts : 0);
    const timeA = getMs(a.createdAt);
    const timeB = getMs(b.createdAt);
    if (sortBy === "recents") return timeB - timeA;
    return timeA - timeB;
  });

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <form onSubmit={handleLogin} className={`w-full max-w-md ${shake ? 'animate-[shake_0.5s_ease]' : ''}`}>
          <div className="text-center mb-12">
            <div className="w-16 h-16 mx-auto mb-6 border-2 border-[#00d1ff] rounded-full flex items-center justify-center">
              <Lock size={28} className="text-[#00d1ff]" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Piassa</h1>
            <p className="text-gray-500 font-mono text-xs tracking-widest uppercase">Buscador de Vagas</p>
          </div>

          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-8">
            <label className="block text-xs font-mono tracking-widest text-gray-400 mb-4 uppercase">Senha de Acesso</label>
            <input type="password" value={passwordInput} onChange={e => { setPasswordInput(e.target.value); setPasswordError(false); }}
              className={`w-full bg-black border ${passwordError ? 'border-red-500' : 'border-[#1a1a1a]'} rounded-lg px-4 py-3 text-white font-mono text-sm outline-none focus:border-[#00d1ff] transition-colors mb-4`}
              placeholder="Digite a senha" autoFocus />
            {passwordError && <p className="text-red-500 text-xs font-mono flex items-center gap-2 mb-4"><AlertTriangle size={14} /> Senha incorreta.</p>}
            <button type="submit" className="w-full bg-[#00d1ff] hover:bg-[#00b8e6] text-black font-bold py-3 rounded-lg transition-colors font-mono tracking-widest uppercase text-sm">Acessar</button>
          </div>
        </form>
        <style>{`@keyframes shake { 0%,100% { transform: translateX(0); } 10%,30%,50%,70%,90% { transform: translateX(-5px); } 20%,40%,60%,80% { transform: translateX(5px); } }`}</style>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? 'bg-black text-white' : 'light bg-white text-gray-900'}`}>
      <header className={`border-b backdrop-blur-sm sticky top-0 z-10 transition-colors duration-300 ${dark ? 'border-[#1a1a1a] bg-[#0a0a0a]/50' : 'border-gray-200 bg-white/80'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className={`transition-colors ${dark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}><ArrowLeft size={18} /></a>
            <div className="w-8 h-8 border border-[#00d1ff] rounded-full flex items-center justify-center"><Briefcase size={14} className="text-[#00d1ff]" /></div>
            <span className={`font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>Piassa</span>
            <span className={`text-[10px] font-mono tracking-widest uppercase hidden sm:inline ${dark ? 'text-gray-600' : 'text-gray-400'}`}>Vagas</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setDark(!dark)} className={`p-2 rounded-lg transition-colors ${dark ? 'bg-[#1a1a1a] text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-500 hover:text-gray-900'}`}>
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button onClick={loadSavedJobs} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono tracking-widest uppercase transition-colors ${dark ? 'bg-[#1a1a1a] text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-500 hover:text-gray-900'}`}>
              <RefreshCw size={14} /> Atualizar
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Clock size={20} className="text-[#00d1ff]" />
            <h2 className="text-sm sm:text-xl font-mono tracking-widest uppercase">VAGAS ENCONTRADAS</h2>
            
            {/* Seletor Ordenação & Lista / Grade */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "recents" | "oldest")}
                className={`text-[10px] font-mono tracking-widest uppercase px-2.5 py-1.5 rounded-lg border outline-none cursor-pointer ${
                  dark ? 'bg-[#1a1a1a] border-[#333] text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-700'
                }`}
              >
                <option value="recents">Mais Recentes</option>
                <option value="oldest">Mais Antigas</option>
              </select>

              <div className={`flex rounded-lg p-0.5 border ${dark ? 'bg-[#1a1a1a] border-[#333]' : 'bg-gray-100 border-gray-200'}`}>
                <button onClick={() => setViewMode("list")} title="Ver como Lista"
                  className={`p-1.5 rounded transition-all ${viewMode === "list" ? (dark ? 'bg-[#00d1ff] text-black shadow' : 'bg-white text-gray-900 shadow') : 'text-gray-500 hover:text-gray-300'}`}>
                  <List size={14} />
                </button>
                <button onClick={() => setViewMode("grid")} title="Ver como Grade"
                  className={`p-1.5 rounded transition-all ${viewMode === "grid" ? (dark ? 'bg-[#00d1ff] text-black shadow' : 'bg-white text-gray-900 shadow') : 'text-gray-500 hover:text-gray-300'}`}>
                  <LayoutGrid size={14} />
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-thin">
            {ROLES.map(r => {
              const count = getRoleCount(r);
              const label = r === "Todas" ? "Todas" : r === "Estrategista de Marketing" ? "Marketing" : r === "Marketing Industrial" ? "Mkt Industrial" : r === "Growth Marketing" ? "Growth" : r === "Redator Publicitário" ? "Red. Pub." : r;
              return (
                <button key={r} onClick={() => setFilterRole(r)}
                  className={`px-3 py-1.5 text-[10px] font-mono tracking-widest uppercase rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                    filterRole === r
                      ? 'bg-[#00d1ff] border-[#00d1ff] text-black font-bold'
                      : dark ? 'border-[#1a1a1a] text-gray-500 hover:border-gray-500 hover:text-white' : 'border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-900'
                  }`}
                >
                  {label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {savedLoading && (
          <div className="py-24 text-center">
            <Loader2 size={28} className="mx-auto text-[#00d1ff] mb-4" />
            <p className="text-[#00d1ff] font-mono text-sm tracking-widest">CARREGANDO...</p>
          </div>
        )}

        {!savedLoading && sortedJobs.length === 0 && (
          <div className={`py-24 text-center border border-dashed rounded-xl ${dark ? 'border-[#1a1a1a] bg-[#0a0a0a]/50' : 'border-gray-200 bg-gray-50'}`}>
            <Bookmark size={48} className="mx-auto text-gray-600 mb-6" />
            <h3 className="text-gray-400 font-mono tracking-widest uppercase mb-2">NENHUMA VAGA ENCONTRADA</h3>
            <p className="text-gray-600 font-mono text-sm">Aguardando a próxima busca automática (06:00).</p>
          </div>
        )}

        {!savedLoading && (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
            {sortedJobs.map(job => (
              <div key={job.id} 
                className={`border rounded-lg p-5 relative flex flex-col justify-between ${
                  dark ? 'border-[#1a1a1a] bg-[#0a0a0a]' : 'border-gray-200 bg-white'
                } ${viewMode === "list" ? "mb-0" : "h-full"}`}
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00d1ff] rounded-l-lg"></div>
                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 pl-2 gap-2">
                    <h3 className={`text-base sm:text-lg font-bold break-words line-clamp-2 ${dark ? 'text-white' : 'text-gray-900'}`}>{job.title}</h3>
                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      {job.role && <div className="border border-[#00d1ff]/30 text-[#00d1ff] px-2 py-0.5 text-[10px] font-mono rounded bg-[#00d1ff]/5 whitespace-nowrap">{job.role}</div>}
                      <div className="border border-[#00d1ff]/30 text-[#00d1ff] px-2 py-0.5 text-[10px] font-mono rounded bg-[#00d1ff]/5 whitespace-nowrap">{job.company}</div>
                      {job.salary && <div className="border border-yellow-500/30 text-yellow-500 px-2 py-0.5 text-[10px] font-mono rounded bg-yellow-500/5 whitespace-nowrap flex items-center gap-1"><DollarSign size={10} />{job.salary}</div>}
                    </div>
                  </div>
                  <p className={`font-mono text-xs mb-4 pl-2 leading-relaxed break-words ${viewMode === "grid" ? "line-clamp-3" : ""} ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{job.snippet}</p>
                </div>
                <div>
                  <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-mono mb-4 pl-2 pb-4 border-b ${dark ? 'border-[#1a1a1a]' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-1 text-gray-500 whitespace-nowrap">
                      <Clock size={11} />
                      Salva em {formatDate(job.createdAt)} · {daysSincePost(job.createdAt)}d
                    </div>
                    <div className="flex items-center gap-1 text-orange-500 whitespace-nowrap">
                      <AlertTriangle size={11} />
                      Expira {daysRemaining(job.createdAt)}d
                    </div>
                    {job.link && job.link !== "#" && (
                      <a href={job.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[#00d1ff] hover:underline whitespace-nowrap"><FileText size={11} /> Acessar Vaga</a>
                    )}
                  </div>
                  <div className="flex items-center justify-between pl-2 flex-wrap gap-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <select value={job.status || "Pendente"} onChange={(e) => handleUpdateStatus(job.id, e.target.value)}
                        className={`px-2.5 py-1 text-[10px] font-mono rounded outline-none border cursor-pointer ${
                          job.status === "Inscrito" ? "bg-[#00d1ff]/10 border-[#00d1ff]/30 text-[#00d1ff]" :
                          job.status === "Descartado" ? "bg-red-500/10 border-red-500/30 text-red-500" :
                          "bg-orange-500/10 border-orange-500/30 text-orange-500"
                        }`}
                      >
                        <option value="Pendente" className={dark ? 'bg-[#0a0a0a] text-orange-500' : 'bg-white text-orange-500'}>Pendente</option>
                        <option value="Inscrito" className={dark ? 'bg-[#0a0a0a] text-[#00d1ff]' : 'bg-white text-[#00d1ff]'}>Inscrito</option>
                        <option value="Descartado" className={dark ? 'bg-[#0a0a0a] text-red-500' : 'bg-white text-red-500'}>Descartado</option>
                      </select>
                      <div className={`flex items-center gap-1 ${
                        job.status === "Inscrito" ? "text-[#00d1ff]" :
                        job.status === "Descartado" ? "text-red-500" : "text-orange-500"
                      }`}>
                        {job.status === "Inscrito" ? <CheckCircle size={12} /> :
                         job.status === "Descartado" ? <XCircle size={12} /> : <Clock size={12} />}
                        <span className="text-[10px] font-mono">{job.status || "Pendente"}</span>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteJob(job.id)} className="text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!savedLoading && filteredJobs.length > 0 && (
          <p className={`text-center font-mono text-[10px] pt-4 ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
            {filteredJobs.length} vaga(s) · Atualizado diariamente às 06:00 · Vagas expiram em 15 dias
          </p>
        )}
      </main>

      <style>{`
        .light { --bg: #ffffff; --bg2: #f5f5f5; --border: #d1d5db; --text: #111827; --text2: #6b7280; }
        .light .bg-\\[\\#0a0a0a\\] { background: var(--bg2) !important; }
        .light .bg-\\[\\#0a0a0a\\]\\/50 { background: rgba(245,245,245,0.8) !important; }
        .light .border-\\[\\#1a1a1a\\] { border-color: var(--border) !important; }
        .light .border-\\[\\#333\\] { border-color: #d1d5db !important; }
        .light .border-dashed { border-color: #d1d5db !important; }
        .light .text-gray-500 { color: var(--text2) !important; }
        .light .text-gray-400 { color: var(--text2) !important; }
        .light .text-gray-600 { color: #9ca3af !important; }
        .light .text-gray-300 { color: #4b5563 !important; }
        .light .text-\\[\\#00d1ff\\] { color: #15803d !important; }
        .light .border-\\[\\#00d1ff\\]\\/30 { border-color: rgba(21,128,61,0.3) !important; }
        .light .bg-\\[\\#00d1ff\\]\\/5 { background: rgba(21,128,61,0.08) !important; }
        .light select option { background: #fff !important; }
        .scrollbar-thin::-webkit-scrollbar { height: 3px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        .light .scrollbar-thin::-webkit-scrollbar-thumb { background: #ccc; }
      `}</style>
    </div>
  );
}