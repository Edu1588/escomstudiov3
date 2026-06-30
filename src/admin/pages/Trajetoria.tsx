import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Plus, Edit2, Trash2, X, Briefcase } from "lucide-react";
import { getExperiences, saveExperience, deleteExperience, Experience } from "../../firebase";

export default function Trajetoria() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);

  const [formData, setFormData] = useState({
    role: "",
    company: "",
    period: "",
    location: "",
    desc: ""
  });

  const loadExperiences = async () => {
    setLoading(true);
    const data = await getExperiences();
    setExperiences(data);
    setLoading(false);
  };

  useEffect(() => {
    loadExperiences();
  }, []);

  const handleOpenNew = () => {
    setEditingExperience(null);
    setFormData({ role: "", company: "", period: "", location: "", desc: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exp: Experience) => {
    setEditingExperience(exp);
    setFormData({
      role: exp.role || "",
      company: exp.company || "",
      period: exp.period || "",
      location: exp.location || "",
      desc: exp.desc || ""
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    await saveExperience({
      id: editingExperience?.id,
      ...formData
    });
    setIsModalOpen(false);
    loadExperiences();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Deseja realmente excluir esta experiência profissional?")) {
      await deleteExperience(id);
      loadExperiences();
    }
  };

  return (
    <div className="flex-1 overflow-y-auto w-full">
      <Header title="Análise Geral" />
      <div className="p-8 max-w-[1200px] mx-auto mt-4">
        
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-tight">Trajetória Profissional</h2>
            <p className="text-gray-400 text-sm mt-1">Gerencie suas experiências profissionais exibidas no seu portfólio (/portfolioedu).</p>
          </div>
          <button onClick={handleOpenNew} className="flex items-center gap-2 bg-[#00d1ff] hover:bg-[#00b8e6] text-black px-4 py-2 rounded-lg text-sm font-bold transition-colors">
            <Plus size={16} />
            Nova Experiência
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-10">Carregando trajetória profissional...</div>
        ) : experiences.length === 0 ? (
          <div className="text-center text-gray-500 py-16 border border-dashed border-[#333] rounded-2xl bg-[#0a0a0a]">
            <Briefcase size={40} className="mx-auto text-gray-600 mb-4" />
            <p>Nenhuma experiência profissional cadastrada ainda.</p>
            <button onClick={handleOpenNew} className="mt-4 bg-[#00d1ff]/10 border border-[#00d1ff]/30 hover:bg-[#00d1ff]/20 text-[#00d1ff] px-4 py-2 rounded-lg text-xs font-bold transition-all">
              Adicionar Primeira Experiência
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6 hover:border-[#333] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-bold text-lg text-white">{exp.role}</h3>
                    <span className="text-gray-500 text-sm">—</span>
                    <span className="text-[#00d1ff] font-semibold text-sm">{exp.company}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 font-mono tracking-wider mb-3 uppercase">
                    <span>📅 {exp.period}</span>
                    <span>📍 {exp.location}</span>
                  </div>
                  <p className="text-sm text-gray-400 max-w-3xl leading-relaxed">{exp.desc}</p>
                </div>
                
                <div className="flex items-center gap-2 self-end md:self-center">
                  <button onClick={() => handleOpenEdit(exp)} className="w-10 h-10 bg-[#111] hover:bg-[#222] border border-[#333] text-white rounded-lg flex items-center justify-center transition-colors" title="Editar">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(exp.id!)} className="w-10 h-10 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 rounded-lg flex items-center justify-center transition-colors" title="Excluir">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-[#1a1a1a]">
              <h2 className="text-xl font-bold">{editingExperience ? "Editar Experiência" : "Nova Experiência"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-mono text-gray-500 tracking-wider mb-2">CARGO / FUNÇÃO</label>
                <input type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} placeholder="Ex: Diretor Criativo" className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00d1ff]" />
              </div>
              
              <div>
                <label className="block text-xs font-mono text-gray-500 tracking-wider mb-2">EMPRESA / PROJETO</label>
                <input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} placeholder="Ex: ESCOM STUDIO" className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00d1ff]" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-500 tracking-wider mb-2">PERÍODO</label>
                  <input type="text" value={formData.period} onChange={e => setFormData({...formData, period: e.target.value})} placeholder="Ex: 2023 — ATUAL" className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00d1ff]" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-500 tracking-wider mb-2">LOCALIZAÇÃO</label>
                  <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Ex: REMOTO ou SÃO PAULO, SP" className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00d1ff]" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-500 tracking-wider mb-2">DESCRIÇÃO DAS ATIVIDADES</label>
                <textarea value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} placeholder="Resuma as principais realizações, tecnologias e responsabilidades..." rows={4} className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00d1ff] resize-none" />
              </div>
            </div>

            <div className="p-6 border-t border-[#1a1a1a] flex justify-end gap-4 bg-[#050505]">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-sm font-bold text-gray-400 hover:text-white transition-colors">
                Cancelar
              </button>
              <button 
                onClick={handleSave} 
                disabled={!formData.role || !formData.company}
                className="bg-[#00d1ff] hover:bg-[#00b8e6] disabled:opacity-50 disabled:cursor-not-allowed text-black px-6 py-3 rounded-lg text-sm font-bold transition-colors"
              >
                Salvar Experiência
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
