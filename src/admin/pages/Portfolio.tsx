import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Plus, Edit2, Trash2, X, Star, ExternalLink, Video, Sparkles, RefreshCw } from "lucide-react";
import { getPortfolioProjects, savePortfolioProject, deletePortfolioProject, PortfolioProject } from "../../firebase";
import { INITIAL_PORTFOLIO_PROJECTS, PortfolioItem } from "../../data/initialPortfolio";

export default function Portfolio() {
  const [projetos, setProjetos] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  const [formData, setFormData] = useState({
    client: "",
    title: "",
    category: "",
    tagType: "WEBSITE",
    deliverables: "",
    year: "2025",
    video: "",
    image: "",
    link: "",
    badges: ["DEV", "SOTD"],
    destaque: true,
    desc: "",
  });

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await getPortfolioProjects();
      if (data && data.length > 0) {
        setProjetos(data);
      } else {
        // Se ainda não houver itens no banco, exibe os 9 projetos padrão como base inicial
        const fallback: PortfolioProject[] = INITIAL_PORTFOLIO_PROJECTS.map((item) => ({
          id: item.id,
          name: item.client,
          client: item.client,
          title: item.title,
          category: item.category,
          tagType: item.tagType,
          deliverables: item.deliverables,
          year: item.year,
          badges: item.badges,
          video: item.video,
          image: item.image,
          link: item.link,
          url: item.link,
          destaque: item.destaque,
          desc: item.desc,
        }));
        setProjetos(fallback);
      }
    } catch (err) {
      console.error("Erro ao carregar projetos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // Sincroniza os 9 projetos padrão com o Firebase se ainda não foram salvos
  const handleSeedProjects = async () => {
    if (!window.confirm("Deseja salvar os 9 projetos padrão da HOME no banco de dados agora?")) return;
    setIsSeeding(true);
    try {
      for (const item of INITIAL_PORTFOLIO_PROJECTS) {
        await savePortfolioProject({
          client: item.client,
          title: item.title,
          name: item.client,
          category: item.category,
          tagType: item.tagType,
          deliverables: item.deliverables,
          year: item.year,
          badges: item.badges,
          video: item.video,
          image: item.image,
          link: item.link,
          url: item.link,
          destaque: item.destaque,
          desc: item.desc,
        });
      }
      alert("Projetos base sincronizados com sucesso no banco de dados!");
      await loadProjects();
    } catch (err) {
      console.error("Erro ao sincronizar projetos:", err);
      alert("Ocorreu um erro ao sincronizar os projetos.");
    } finally {
      setIsSeeding(false);
    }
  };

  const handleOpenNew = () => {
    setEditingProject(null);
    setFormData({
      client: "",
      title: "",
      category: "",
      tagType: "WEBSITE",
      deliverables: "",
      year: new Date().getFullYear().toString(),
      video: "",
      image: "",
      link: "",
      badges: ["DEV", "SOTD"],
      destaque: true,
      desc: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (projeto: PortfolioProject) => {
    setEditingProject(projeto);
    setFormData({
      client: projeto.client || projeto.name || "",
      title: projeto.title || projeto.name || "",
      category: projeto.category || "",
      tagType: projeto.tagType || projeto.tag || "WEBSITE",
      deliverables: projeto.deliverables || projeto.desc || "",
      year: projeto.year ? String(projeto.year) : "2025",
      video: projeto.video || "",
      image: projeto.image || "",
      link: projeto.link || projeto.url || "",
      badges: projeto.badges || ["DEV", "SOTD"],
      destaque: projeto.destaque ?? true,
      desc: projeto.desc || "",
    });
    setIsModalOpen(true);
  };

  const handleToggleBadge = (badge: string) => {
    setFormData((prev) => {
      const exists = prev.badges.includes(badge);
      const newBadges = exists ? prev.badges.filter((b) => b !== badge) : [...prev.badges, badge];
      return { ...prev, badges: newBadges };
    });
  };

  const handleSave = async () => {
    if (!formData.client || !formData.title) {
      alert("Por favor, preencha o Nome do Cliente e o Título do Projeto.");
      return;
    }

    try {
      await savePortfolioProject({
        id: editingProject?.id,
        name: formData.client,
        client: formData.client,
        title: formData.title,
        category: formData.category || "WEBSITE",
        tagType: formData.tagType || "WEBSITE",
        tag: formData.tagType || "WEBSITE",
        deliverables: formData.deliverables || "",
        desc: formData.desc || formData.deliverables || "",
        year: formData.year || "2025",
        video: formData.video || "",
        image: formData.image || "",
        link: formData.link || "",
        url: formData.link || "",
        badges: formData.badges,
        destaque: formData.destaque,
        score: "98%",
      });

      setIsModalOpen(false);
      await loadProjects();
    } catch (err) {
      console.error("Erro ao salvar projeto:", err);
      alert("Erro ao salvar projeto.");
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (window.confirm("Deseja realmente excluir este projeto do portfólio?")) {
      try {
        await deletePortfolioProject(id);
        await loadProjects();
      } catch (err) {
        console.error("Erro ao excluir:", err);
      }
    }
  };

  const handleToggleDestaque = async (projeto: PortfolioProject, e: React.MouseEvent) => {
    e.stopPropagation();
    const isNowDestaque = !projeto.destaque;

    await savePortfolioProject({
      ...projeto,
      destaque: isNowDestaque,
    });
    loadProjects();
  };

  return (
    <div className="flex-1 overflow-y-auto w-full bg-[#050505] min-h-screen text-white">
      <Header title="Gestão de Portfólio" />
      <div className="p-6 sm:p-8 max-w-[1400px] mx-auto mt-2">
        {/* CABEÇALHO */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#00d1ff] animate-pulse" />
              <h2 className="text-2xl font-bold tracking-tight">Portfólio de Projetos da HOME</h2>
            </div>
            <p className="text-gray-400 text-sm mt-1">
              Todos os projetos cadastrados aqui aparecem no grid de portfólio oficial da página inicial.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSeedProjects}
              disabled={isSeeding}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 text-gray-300 hover:text-white px-3.5 py-2.5 rounded-lg text-xs font-mono tracking-wider transition-colors disabled:opacity-50"
              title="Sincronizar os 9 projetos padrão com o banco de dados"
            >
              <RefreshCw size={14} className={isSeeding ? "animate-spin" : ""} />
              <span>{isSeeding ? "Sincronizando..." : "Sincronizar Base"}</span>
            </button>

            <button
              onClick={handleOpenNew}
              className="flex items-center gap-2 bg-[#00d1ff] hover:bg-[#00b8e6] text-black px-4 py-2.5 rounded-lg text-sm font-bold transition-all shadow-[0_0_20px_rgba(0,209,255,0.3)] hover:shadow-[0_0_25px_rgba(0,209,255,0.5)] cursor-pointer"
            >
              <Plus size={16} />
              <span>Cadastrar Novo Projeto</span>
            </button>
          </div>
        </div>

        {/* LISTAGEM DOS PROJETOS EM GRID */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400 font-mono text-sm">
            <span className="size-2 rounded-full bg-cyan animate-pulse mr-3" />
            Carregando projetos do portfólio...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projetos.map((projeto) => (
              <div
                key={projeto.id || projeto.client}
                className="bg-[#0c0c0c] border border-white/10 rounded-2xl overflow-hidden group hover:border-[#00d1ff]/50 transition-all duration-300 flex flex-col shadow-lg"
              >
                {/* MÍDIA / THUMB OU VÍDEO PREVIEW */}
                <div className="relative aspect-[16/10] bg-[#141414] overflow-hidden">
                  {projeto.video ? (
                    <video
                      src={projeto.video}
                      muted
                      loop
                      playsInline
                      autoPlay
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : projeto.image ? (
                    <img
                      src={projeto.image}
                      alt={projeto.title || projeto.client}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 font-mono text-xs">
                      Sem mídia
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                  {/* Badges superiores na mídia */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="bg-black/70 backdrop-blur border border-white/15 text-[#00d1ff] font-mono text-[9px] uppercase px-2 py-0.5 rounded font-bold">
                      {projeto.tagType || projeto.category || "CASE"}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handleToggleDestaque(projeto, e)}
                      className={`pointer-events-auto size-7 rounded-full flex items-center justify-center transition-all ${
                        projeto.destaque
                          ? "bg-[#00d1ff] text-black shadow-[0_0_12px_rgba(0,209,255,0.6)]"
                          : "bg-black/60 text-white/50 hover:text-white border border-white/20"
                      }`}
                      title={projeto.destaque ? "Em destaque na Home" : "Ativar destaque na Home"}
                    >
                      <Star size={13} fill={projeto.destaque ? "black" : "none"} />
                    </button>
                  </div>

                  {/* Informações sobre a mídia */}
                  <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                      {projeto.category}
                    </span>
                    <h4 className="text-white font-medium text-sm line-clamp-1">
                      {projeto.client} — {projeto.title}
                    </h4>
                  </div>
                </div>

                {/* DETALHES DO PROJETO */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white font-mono truncate">
                        {projeto.client}
                      </span>
                      <span className="text-[10px] font-mono text-gray-500">{projeto.year}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1 font-mono">
                      {projeto.deliverables || projeto.desc || "Sem entregáveis especificados"}
                    </p>
                  </div>

                  {/* Badges e Links */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-mono text-[9px]">
                      {(projeto.badges || ["DEV", "SOTD"]).map((b, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded border border-white/20 text-zinc-300 bg-white/5 font-semibold"
                        >
                          {b}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {projeto.link && (
                        <a
                          href={projeto.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="size-7 rounded bg-white/5 hover:bg-[#00d1ff] text-gray-300 hover:text-black flex items-center justify-center transition-colors"
                          title="Abrir link do projeto"
                        >
                          <ExternalLink size={13} />
                        </a>
                      )}

                      <button
                        onClick={() => handleOpenEdit(projeto)}
                        className="size-7 rounded bg-white/5 hover:bg-[#00d1ff] text-gray-300 hover:text-black flex items-center justify-center transition-colors"
                        title="Editar projeto"
                      >
                        <Edit2 size={13} />
                      </button>

                      <button
                        onClick={() => handleDelete(projeto.id)}
                        className="size-7 rounded bg-white/5 hover:bg-red-500 text-gray-300 hover:text-white flex items-center justify-center transition-colors"
                        title="Excluir projeto"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL DE CADASTRO / EDIÇÃO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d0d0d] border border-white/15 rounded-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh] shadow-2xl">
            <div className="flex justify-between items-center p-5 border-b border-white/10 bg-[#121212]">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#00d1ff]" />
                <h3 className="text-lg font-bold text-white">
                  {editingProject ? "Editar Projeto do Portfólio" : "Cadastrar Novo Projeto no Portfólio"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-gray-400 tracking-wider mb-1.5 uppercase">
                    CLIENTE / MARCA *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Academia Gaviões"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    className="w-full bg-[#161616] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#00d1ff]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-gray-400 tracking-wider mb-1.5 uppercase">
                    ANO DE LANÇAMENTO
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 2025"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full bg-[#161616] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#00d1ff]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-400 tracking-wider mb-1.5 uppercase">
                  TÍTULO DO PROJETO *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Plataforma & Web App de Alta Conversão"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#161616] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#00d1ff]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-gray-400 tracking-wider mb-1.5 uppercase">
                    CATEGORIA TÉCNICA
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: FRANQUIAS & ECOSSISTEMA"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#161616] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#00d1ff]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-gray-400 tracking-wider mb-1.5 uppercase">
                    TIPO DE TAG (CARD)
                  </label>
                  <select
                    value={formData.tagType}
                    onChange={(e) => setFormData({ ...formData, tagType: e.target.value })}
                    className="w-full bg-[#161616] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#00d1ff]"
                  >
                    <option value="WEB APP">WEB APP</option>
                    <option value="WEBSITE">WEBSITE</option>
                    <option value="3D BRAND">3D BRAND</option>
                    <option value="DASHBOARD">DASHBOARD</option>
                    <option value="PORTAL">PORTAL</option>
                    <option value="CATÁLOGO B2B">CATÁLOGO B2B</option>
                    <option value="E-COMMERCE">E-COMMERCE</option>
                    <option value="EXPERIÊNCIA">EXPERIÊNCIA</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-400 tracking-wider mb-1.5 uppercase">
                  ENTREGÁVEIS (DELIVERABLES)
                </label>
                <input
                  type="text"
                  placeholder="Ex: UI/UX · WEB APP · CRO"
                  value={formData.deliverables}
                  onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                  className="w-full bg-[#161616] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#00d1ff]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-400 tracking-wider mb-1.5 uppercase">
                  URL DO VÍDEO (MP4 / CLOUDINARY)
                </label>
                <input
                  type="text"
                  placeholder="https://res.cloudinary.com/.../video.mp4"
                  value={formData.video}
                  onChange={(e) => setFormData({ ...formData, video: e.target.value })}
                  className="w-full bg-[#161616] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#00d1ff]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-400 tracking-wider mb-1.5 uppercase">
                  URL DA THUMBNAIL / IMAGEM DE CAPA
                </label>
                <input
                  type="text"
                  placeholder="https://.../capa.webp"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-[#161616] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#00d1ff]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-400 tracking-wider mb-1.5 uppercase">
                  LINK DO PROJETO (URL EXTERNA)
                </label>
                <input
                  type="text"
                  placeholder="https://meuprojeto.com.br"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full bg-[#161616] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#00d1ff]"
                />
              </div>

              {/* BADGES ESTILO AWWWARDS */}
              <div>
                <label className="block text-[11px] font-mono text-gray-400 tracking-wider mb-1.5 uppercase">
                  BADGES DE RECONHECIMENTO
                </label>
                <div className="flex flex-wrap gap-2">
                  {["DEV", "SOTD", "HM", "PRO", "AI ENGINE", "HIGH-END"].map((badge) => {
                    const isSelected = formData.badges.includes(badge);
                    return (
                      <button
                        type="button"
                        key={badge}
                        onClick={() => handleToggleBadge(badge)}
                        className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#00d1ff] text-black shadow-[0_0_12px_rgba(0,209,255,0.4)]"
                            : "bg-white/5 text-gray-400 hover:text-white border border-white/15"
                        }`}
                      >
                        {badge}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CHECKBOX DE DESTAQUE NA HOME */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="destaque-home"
                  checked={formData.destaque}
                  onChange={(e) => setFormData({ ...formData, destaque: e.target.checked })}
                  className="size-4.5 accent-[#00d1ff] bg-black border-white/20 rounded cursor-pointer"
                />
                <label htmlFor="destaque-home" className="text-xs text-gray-300 font-medium cursor-pointer">
                  Exibir em destaque no Grid de Portfólio da HOME
                </label>
              </div>
            </div>

            <div className="p-5 border-t border-white/10 flex justify-end gap-3 bg-[#111]">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-xs font-mono uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!formData.client || !formData.title}
                className="bg-[#00d1ff] hover:bg-[#00b8e6] disabled:opacity-50 disabled:cursor-not-allowed text-black px-6 py-2.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,209,255,0.3)]"
              >
                {editingProject ? "Salvar Alterações" : "Publicar Projeto"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
