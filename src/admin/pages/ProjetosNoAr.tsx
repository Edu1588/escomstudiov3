import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Plus, Edit2, Trash2, X, ExternalLink } from "lucide-react";
import { getExternalProjects, saveExternalProject, deleteExternalProject, ExternalProject } from "../../firebase";

export default function ProjetosNoAr() {
  const [projetos, setProjetos] = useState<ExternalProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ExternalProject | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    desc: "",
    urlPaginaVendas: "",
    urlAdmin: "",
    observacao: ""
  });

  const loadProjects = async () => {
    setLoading(true);
    const data = await getExternalProjects();
    setProjetos(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveExternalProject({
      id: editingProject?.id,
      ...formData
    });
    setIsModalOpen(false);
    loadProjects();
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Certeza que deseja deletar este projeto?")) {
      await deleteExternalProject(id);
      loadProjects();
    }
  };

  const handleEdit = (projeto: ExternalProject, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProject(projeto);
    setFormData({
      name: projeto.name || "",
      desc: projeto.desc || "",
      urlPaginaVendas: projeto.urlPaginaVendas || "",
      urlAdmin: projeto.urlAdmin || "",
      observacao: projeto.observacao || ""
    });
    setIsModalOpen(true);
  };

  const handleOpenNew = () => {
    setEditingProject(null);
    setFormData({
      name: "",
      desc: "",
      urlPaginaVendas: "",
      urlAdmin: "",
      observacao: ""
    });
    setIsModalOpen(true);
  };

  return (
    <div className="h-full flex flex-col relative">
      <Header title="Projetos no Ar" />
      <div className="p-8 flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold font-sans">PROJETOS NO AR</h1>
              <p className="text-gray-400 text-sm mt-1">Gerencie os projetos externos disponíveis.</p>
            </div>
            <button 
              onClick={handleOpenNew}
              className="bg-[#39ff14] text-black px-4 py-2 rounded font-semibold font-sans flex items-center gap-2 hover:bg-[#32e612] transition-colors"
            >
              <Plus size={20} />
              Novo Projeto
            </button>
          </div>

          {loading ? (
            <div className="text-gray-400">Carregando projetos...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projetos.map((projeto) => (
                <div key={projeto.id} className="bg-[#111] rounded-xl border border-white/5 overflow-hidden group">
                  <div className="p-5 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-lg font-sans">{projeto.name}</h3>
                      <div className="flex gap-2">
                        <button onClick={(e) => handleEdit(projeto, e)} className="p-1.5 bg-black/50 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={(e) => handleDelete(projeto.id as string, e)} className="p-1.5 bg-black/50 hover:bg-red-500/20 rounded-lg text-white/50 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    {projeto.desc && <p className="text-sm text-gray-400 mb-4">{projeto.desc}</p>}
                    
                    <div className="space-y-3 mt-auto">
                      {projeto.urlPaginaVendas && (
                        <a href={projeto.urlPaginaVendas} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2 rounded bg-white/5 hover:bg-white/10 transition-colors text-sm text-gray-300">
                          <span className="truncate mr-2">Página de Vendas</span>
                          <ExternalLink size={14} className="text-[#39ff14] flex-shrink-0" />
                        </a>
                      )}
                      {projeto.urlAdmin && (
                        <a href={projeto.urlAdmin} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2 rounded bg-white/5 hover:bg-white/10 transition-colors text-sm text-gray-300">
                          <span className="truncate mr-2">Admin URL</span>
                          <ExternalLink size={14} className="text-[#39ff14] flex-shrink-0" />
                        </a>
                      )}
                      {projeto.observacao && (
                        <div className="mt-4 text-xs text-gray-500 p-3 bg-black/40 rounded border border-white/5">
                          <strong className="text-gray-400 block mb-1">Observação:</strong>
                          {projeto.observacao}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {projetos.length === 0 && (
                <div className="col-span-full py-12 text-center text-gray-500 border border-dashed border-white/10 rounded-xl">
                  Nenhum projeto cadastrado.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[100] backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#111] z-10">
              <h2 className="text-xl font-bold">{editingProject ? "Editar Projeto" : "Novo Projeto"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Nome do Projeto <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39ff14] transition-colors"
                    placeholder="Ex: Landing Page X"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Descrição</label>
                  <textarea
                    rows={3}
                    value={formData.desc}
                    onChange={(e) => setFormData({...formData, desc: e.target.value})}
                    className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39ff14] transition-colors resize-none"
                    placeholder="Breve descrição do projeto"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">URL Página de Vendas</label>
                  <input
                    type="url"
                    value={formData.urlPaginaVendas}
                    onChange={(e) => setFormData({...formData, urlPaginaVendas: e.target.value})}
                    className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39ff14] transition-colors"
                    placeholder="https://..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">URL Admin</label>
                  <input
                    type="url"
                    value={formData.urlAdmin}
                    onChange={(e) => setFormData({...formData, urlAdmin: e.target.value})}
                    className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39ff14] transition-colors"
                    placeholder="https://..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Observação</label>
                  <textarea
                    rows={4}
                    value={formData.observacao}
                    onChange={(e) => setFormData({...formData, observacao: e.target.value})}
                    className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39ff14] transition-colors resize-none"
                    placeholder="Informações adicionais, acessos, notas..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 rounded-lg text-white hover:bg-white/5 transition-colors font-sans"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#39ff14] text-black px-6 py-2 rounded-lg font-semibold font-sans hover:bg-[#32e612] transition-colors"
                >
                  {editingProject ? "Salvar Alterações" : "Criar Projeto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
