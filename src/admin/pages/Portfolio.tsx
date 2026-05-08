import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Plus, Edit2, Trash2, X, Star } from "lucide-react";
import { getPortfolioProjects, savePortfolioProject, deletePortfolioProject, PortfolioProject } from "../../firebase";

export default function Portfolio() {
  const [projetos, setProjetos] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    desc: "",
    image: "",
    score: "",
    destaque: false
  });

  const loadProjects = async () => {
    setLoading(true);
    const data = await getPortfolioProjects();
    setProjetos(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleOpenNew = () => {
    setEditingProject(null);
    setFormData({ name: "", category: "", desc: "", image: "", score: "90%", destaque: false });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (projeto: PortfolioProject) => {
    setEditingProject(projeto);
    setFormData({
      name: projeto.name || "",
      category: projeto.category || "",
      desc: projeto.desc || "",
      image: projeto.image || "",
      score: projeto.score || "90%",
      destaque: projeto.destaque || false
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (formData.destaque) {
      const destaqueCount = projetos.filter(p => p.destaque && p.id !== editingProject?.id).length;
      if (destaqueCount >= 5) {
        alert("Você só pode ter no máximo 5 projetos em destaque.");
        return;
      }
    }

    await savePortfolioProject({
      id: editingProject?.id,
      ...formData
    });
    setIsModalOpen(false);
    loadProjects();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Deseja realmente excluir este projeto?")) {
      await deletePortfolioProject(id);
      loadProjects();
    }
  };

  const handleToggleDestaque = async (projeto: PortfolioProject, e: React.MouseEvent) => {
    e.stopPropagation();
    const isNowDestaque = !projeto.destaque;
    
    if (isNowDestaque) {
      const destaqueCount = projetos.filter(p => p.destaque).length;
      if (destaqueCount >= 5) {
        alert("Você só pode ter no máximo 5 projetos em destaque.");
        return;
      }
    }

    await savePortfolioProject({
      ...projeto,
      destaque: isNowDestaque
    });
    loadProjects();
  };

  return (
    <div className="flex-1 overflow-y-auto w-full">
      <Header title="Análise Geral" />
      <div className="p-8 max-w-[1200px] mx-auto mt-4">
        
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-tight">Portfólio de Projetos</h2>
            <p className="text-gray-400 text-sm mt-1">Gerencie os projetos que aparecem no seu portfólio público.</p>
          </div>
          <button onClick={handleOpenNew} className="flex items-center gap-2 bg-[#2EFF00] hover:bg-[#28e600] text-black px-4 py-2 rounded-lg text-sm font-bold transition-colors">
            <Plus size={16} />
            Novo Projeto
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-10">Carregando projetos...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projetos.map((projeto) => (
              <div key={projeto.id} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl overflow-hidden group relative hover:border-[#333] transition-colors flex flex-col h-full">
                
                <div className="relative h-48 overflow-hidden bg-[#111]">
                  <img src={projeto.image || "https://fakeimg.pl/400x300/111/333?text=Sem+foto"} alt={projeto.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="absolute top-0 right-0 p-3 flex flex-col gap-2">
                    <button 
                      onClick={(e) => handleToggleDestaque(projeto, e)}
                      className={`w-8 h-8 rounded-full flex flex-col items-center justify-center transition-colors shadow-lg ${projeto.destaque ? 'bg-[#2EFF00] text-black' : 'bg-black/50 text-white hover:bg-black/80'}`}
                      title={projeto.destaque ? "Remover destaque" : "Marcar como destaque (max 5)"}
                    >
                      <Star size={14} fill={projeto.destaque ? "black" : "none"} />
                    </button>
                    <div className="bg-white/90 backdrop-blur text-black font-bold text-xs px-2 py-1 flex flex-col items-center justify-center rounded shadow-lg">
                      <span className="text-[10px] text-gray-500 font-mono leading-none">A</span>
                      <span>{projeto.score}</span>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button onClick={() => handleOpenEdit(projeto)} className="w-12 h-12 bg-[#2EFF00] hover:bg-[#28e600] text-black rounded-xl flex items-center justify-center transition-transform hover:scale-110">
                      <Edit2 size={20} />
                    </button>
                    <button onClick={() => handleDelete(projeto.id!)} className="w-12 h-12 bg-red-500/80 hover:bg-red-500 text-white rounded-xl flex items-center justify-center transition-transform hover:scale-110 shadow-lg">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-white">{projeto.name}</h3>
                    <span className="bg-[#1a1a1a] border border-[#333] text-gray-400 text-[10px] font-mono tracking-widest px-2 py-1 rounded">{projeto.category}</span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-auto">{projeto.desc}</p>
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
              <h2 className="text-xl font-bold">{editingProject ? "Editar Projeto" : "Novo Projeto"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-mono text-gray-500 tracking-wider mb-2">NOME DO PROJETO</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2EFF00]" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-500 tracking-wider mb-2">CATEGORIA</label>
                  <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2EFF00]" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-500 tracking-wider mb-2">SCORE (ex: 95%)</label>
                  <input type="text" value={formData.score} onChange={e => setFormData({...formData, score: e.target.value})} className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2EFF00]" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-500 tracking-wider mb-2">URL DA IMAGEM</label>
                <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2EFF00]" />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-500 tracking-wider mb-2">DESCRIÇÃO</label>
                <textarea value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} rows={3} className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2EFF00] resize-none" />
              </div>
              
              <div className="flex items-center gap-3 mt-4">
                <input type="checkbox" id="destaque" checked={formData.destaque} onChange={e => setFormData({...formData, destaque: e.target.checked})} className="w-5 h-5 accent-[#2EFF00] bg-[#111] border-[#333] rounded" />
                <label htmlFor="destaque" className="text-sm text-gray-300">Marcar como Destaque (Max 5 na Home)</label>
              </div>
            </div>

            <div className="p-6 border-t border-[#1a1a1a] flex justify-end gap-4 bg-[#050505]">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-sm font-bold text-gray-400 hover:text-white transition-colors">
                Cancelar
              </button>
              <button 
                onClick={handleSave} 
                disabled={!formData.name}
                className="bg-[#2EFF00] hover:bg-[#28e600] disabled:opacity-50 disabled:cursor-not-allowed text-black px-6 py-3 rounded-lg text-sm font-bold transition-colors"
              >
                Salvar Projeto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
