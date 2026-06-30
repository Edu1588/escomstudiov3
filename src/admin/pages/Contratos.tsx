import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Search, Plus, Clock, FileText, CheckCircle, XCircle } from "lucide-react";

export default function Contratos() {
  const [activeTab, setActiveTab] = useState("TUDO");
  const tabs = ["TUDO", "ATIVOS", "FINALIZADOS", "ENCERRADOS"];
  
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/contracts");
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const data = await res.json();
        setContracts(data.contracts || []);
      }
    } catch (e) {
      console.error("Failed to fetch contracts", e);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/contracts/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchContracts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredContracts = contracts.filter(c => {
    if (activeTab === "TUDO") return true;
    if (activeTab === "ATIVOS") return c.status === "ATIVO";
    if (activeTab === "FINALIZADOS") return c.status === "FINALIZADO";
    if (activeTab === "ENCERRADOS") return c.status === "ENCERRADO";
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto w-full">
      <Header title="Análise Geral" />
      <div className="p-8 max-w-[1200px] mx-auto mt-4">
        
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-tight">Gestão de Contratos</h2>
            <p className="text-gray-400 text-sm mt-1">Visualize e gerencie todos os compromissos ativos do estúdio.</p>
          </div>
          <button className="flex items-center gap-2 bg-[#00d1ff] hover:bg-[#00b8e6] text-black px-4 py-2 rounded-lg text-sm font-bold transition-colors">
            <Plus size={16} />
            NOVO CONTRATO
          </button>
        </div>

        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#1a1a1a] flex items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Buscar por cliente ou empresa..." 
                className="w-full bg-[#111] border border-[#333] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00d1ff] transition-colors"
              />
            </div>
            
            <div className="flex items-center gap-2">
              {tabs.map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded text-xs font-mono tracking-wider transition-colors ${
                    activeTab === tab ? 'bg-[#1a1a1a] text-white border border-[#333]' : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] text-gray-500 font-mono tracking-widest text-left border-b border-[#1a1a1a]">
                <th className="px-6 py-4 font-medium">CLIENTE/EMPRESA</th>
                <th className="px-6 py-4 font-medium">VALOR PROJETO</th>
                <th className="px-6 py-4 font-medium">DATA ACEITE</th>
                <th className="px-6 py-4 font-medium text-center">STATUS</th>
                <th className="px-6 py-4 font-medium text-right">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {!loading && filteredContracts.map(c => (
                <tr key={c.id} className="border-b border-[#1a1a1a] hover:bg-[#111] transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold">{c.company}</div>
                    <div className="text-xs text-gray-500">{c.clientName}</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-[#00d1ff]">
                    {c.budget?.includes('R$') ? c.budget : `R$ ${c.budget}`}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(c.createdAt?.seconds ? c.createdAt.seconds * 1000 : c.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                      c.status === 'ATIVO' ? 'bg-[#00d1ff]/10 text-[#00d1ff]' :
                      c.status === 'FINALIZADO' ? 'bg-blue-500/10 text-blue-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       {c.status !== 'ATIVO' && (
                         <button onClick={() => updateStatus(c.id, 'ATIVO')} title="Marcar como Ativo" className="p-1.5 hover:bg-[#333] rounded text-gray-400 hover:text-white transition-colors">
                           <Clock size={16} />
                         </button>
                       )}
                       {c.status !== 'FINALIZADO' && (
                         <button onClick={() => updateStatus(c.id, 'FINALIZADO')} title="Marcar como Finalizado" className="p-1.5 hover:bg-[#333] rounded text-gray-400 hover:text-[#00d1ff] transition-colors">
                           <CheckCircle size={16} />
                         </button>
                       )}
                       {c.status !== 'ENCERRADO' && (
                         <button onClick={() => updateStatus(c.id, 'ENCERRADO')} title="Encerrar" className="p-1.5 hover:bg-[#333] rounded text-gray-400 hover:text-red-500 transition-colors">
                           <XCircle size={16} />
                         </button>
                       )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {loading && (
            <div className="py-24 flex flex-col items-center justify-center text-gray-500">
              <Clock size={32} className="mb-4 opacity-30 animate-spin" />
              <p className="text-xs font-mono tracking-widest uppercase">Carregando contratos...</p>
            </div>
          )}

          {!loading && filteredContracts.length === 0 && (
            <div className="py-24 flex flex-col items-center justify-center text-gray-500">
              <FileText size={32} className="mb-4 opacity-30" />
              <p className="text-xs font-mono tracking-widest uppercase">Nenhum contrato encontrado.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
