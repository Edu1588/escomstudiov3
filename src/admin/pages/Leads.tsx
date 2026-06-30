import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Plus, Trash2, ChevronDown, X } from "lucide-react";
import { db } from "../../lib/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";

export default function Leads() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLead, setNewLead] = useState({ nome: "", email: "", origem: "Indicação", status: "NOVO" });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/leads");
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const data = await res.json();
        const loaded = data.leads;
        
        const getTimestamp = (val: any) => {
          if (!val) return 0;
          if (typeof val === 'number') return val;
          if (typeof val === 'string') return new Date(val).getTime();
          if (val.seconds !== undefined) return val.seconds * 1000;
          if (val._seconds !== undefined) return val._seconds * 1000;
          if (typeof val.toDate === 'function') return val.toDate().getTime();
          const d = new Date(val);
          return isNaN(d.getTime()) ? 0 : d.getTime();
        };

        if (Array.isArray(loaded)) {
          // Sort by date descending
          loaded.sort((a: any, b: any) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt));
          setLeads(loaded);
        } else {
          setLeads([]);
        }
      }
    } catch (error) {
      console.warn("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLead = async () => {
    if (!newLead.nome || !newLead.email) {
      alert("Por favor, preencha nome e contato.");
      return;
    }
    setLoading(true);
    try {
      // Direct Firebase add for now
      await addDoc(collection(db, "leads"), {
        ...newLead,
        createdAt: serverTimestamp(),
      });
      setIsModalOpen(false);
      setNewLead({ nome: "", email: "", origem: "Indicação", status: "NOVO" });
      await fetchLeads();
    } catch (error) {
      console.error("Error adding lead", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) return;
    const confirmed = window.confirm("Tem certeza que deseja apagar este lead?");
    if (!confirmed) return;
    
    try {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      if (res.ok) {
        setLeads(prev => prev.filter(l => l.id !== id));
      } else {
        alert("Erro ao apagar lead no servidor.");
      }
    } catch (error) {
      console.error("Error deleting lead", error);
      alert("Erro de conexão ao apagar lead.");
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/leads/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchLeads();
      }
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  const formatDate = (date: any) => {
    if (!date) return "--";
    
    // Handle Firestore Timestamp (client side instance)
    if (typeof date.toDate === 'function') {
      return date.toDate().toLocaleDateString('pt-BR');
    }
    
    // Handle serialized Timestamp {seconds, nanoseconds} or {_seconds, _nanoseconds}
    const seconds = date.seconds ?? date._seconds;
    if (seconds !== undefined) {
      return new Date(seconds * 1000).toLocaleDateString('pt-BR');
    }
    
    // Handle numeric timestamp
    if (typeof date === 'number') {
      return new Date(date).toLocaleDateString('pt-BR');
    }
    
    // Handle ISO string or Date object
    const d = new Date(date);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('pt-BR');
    }
    
    return String(date);
  };

  const handleExportCSV = () => {
    if (leads.length === 0) return;
    
    const headers = ["Nome", "Email/Contato", "Origem", "Status", "Data"];
    const rows = leads.map(l => [
      `"${l.nome || l.name || ''}"`,
      `"${l.email || l.phone || l.whatsapp || ''}"`,
      `"${l.origem || ''}"`,
      `"${l.status || ''}"`,
      `"${formatDate(l.createdAt)}"`
    ]);
    
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 overflow-y-auto w-full relative">
      <Header title="Análise Geral" />
      <div className="p-8 max-w-[1200px] mx-auto mt-4 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6">
            <div className="text-[10px] text-gray-500 font-mono tracking-widest mb-2">LEADS ATIVOS</div>
            <div className="text-3xl font-bold text-white mb-2">{leads.length}</div>
            <div className="text-[11px] font-mono text-[#00d1ff] flex items-center gap-1">
              <span>↗</span> Total cadastrado
            </div>
          </div>
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6">
            <div className="text-[10px] text-gray-500 font-mono tracking-widest mb-2">PROPOSTAS ENVIADAS</div>
            <div className="text-3xl font-bold text-white mb-2">0</div>
            <div className="text-[11px] font-mono text-gray-500 flex items-center gap-1">
              Total histórico
            </div>
          </div>
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6">
            <div className="text-[10px] text-gray-500 font-mono tracking-widest mb-2">TAXA DE CONVERSÃO</div>
            <div className="text-3xl font-bold text-white mb-2">0%</div>
            <div className="text-[11px] font-mono text-gray-500 flex items-center gap-1">
              Propostas aceitas
            </div>
          </div>
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6">
            <div className="text-[10px] text-gray-500 font-mono tracking-widest mb-2">PIPELINE TOTAL</div>
            <div className="text-3xl font-bold text-[#00d1ff] mb-2">R$ 0</div>
            <div className="text-[11px] font-mono text-gray-500 flex items-center gap-1">
              Volume em negociação
            </div>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold">Gestão de Leads</h2>
            <div className="flex gap-4">
              <button onClick={handleExportCSV} className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Exportar CSV
              </button>
              <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-[#00d1ff] hover:bg-[#00b8e6] text-black px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                <Plus size={16} />
                Novo Lead
              </button>
            </div>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] text-gray-500 font-mono text-left border-b border-[#1a1a1a]">
                <th className="pb-3 font-medium">NOME / CONTATO</th>
                <th className="pb-3 font-medium">ORIGEM</th>
                <th className="pb-3 font-medium">INTERESSE</th>
                <th className="pb-3 font-medium">DATA</th>
                <th className="pb-3 font-medium text-right">STATUS</th>
                <th className="pb-3 font-medium text-right">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">Caregando...</td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">Nenhum lead encontrado</td>
                </tr>
              ) : leads.map((lead) => (
                <tr key={lead.id} className="border-b border-[#1a1a1a]/50">
                  <td className="py-4">
                    <div className="font-bold text-white mb-0.5">{lead.nome || lead.name}</div>
                    <div className="text-[11px] text-gray-500">{lead.email || lead.phone || lead.whatsapp || '--'}</div>
                  </td>
                  <td className="py-4 text-gray-300">{lead.origem || 'Site'}</td>
                  <td className="py-4 text-gray-300">-</td>
                  <td className="py-4 text-gray-300">{formatDate(lead.createdAt)}</td>
                  <td className="py-4 text-right">
                    <select 
                      value={lead.status || 'NOVO'} 
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      className="bg-[#111] border border-[#333] rounded px-3 py-1 cursor-pointer text-xs font-medium text-gray-300 focus:outline-none"
                    >
                      <option value="NOVO">NOVO</option>
                      <option value="EM_CONTATO">EM CONTATO</option>
                      <option value="AGENDADO">AGENDADO</option>
                      <option value="FECHADO">FECHADO</option>
                      <option value="PERDIDO">PERDIDO</option>
                    </select>
                  </td>
                  <td className="py-4 text-right pl-4">
                    <button onClick={() => handleDelete(lead.id)} className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {isModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111] border border-[#333] rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-[#333]">
              <h3 className="text-lg font-bold">Novo Lead</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-mono text-gray-500 mb-1">NOME COMPLETO</label>
                <input 
                  type="text" 
                  value={newLead.nome}
                  onChange={(e) => setNewLead({...newLead, nome: e.target.value})}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white outline-none focus:border-[#00d1ff] transition-colors"
                  placeholder="Nome do Lead"
                />
              </div>
              
              <div>
                <label className="block text-xs font-mono text-gray-500 mb-1">EMAIL / TELEFONE</label>
                <input 
                  type="text" 
                  value={newLead.email}
                  onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white outline-none focus:border-[#00d1ff] transition-colors"
                  placeholder="contato@email.com"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-500 mb-1">ORIGEM</label>
                <input 
                  type="text" 
                  value={newLead.origem}
                  onChange={(e) => setNewLead({...newLead, origem: e.target.value})}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white outline-none focus:border-[#00d1ff] transition-colors"
                  placeholder="Instagram, Indicação..."
                />
              </div>
            </div>

            <div className="p-4 border-t border-[#333] flex justify-end gap-3 bg-[#0a0a0a]">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleAddLead}
                className="bg-[#00d1ff] hover:bg-[#00b8e6] text-black px-4 py-2 rounded-lg text-sm font-bold transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
