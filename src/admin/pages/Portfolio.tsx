import React, { useState, useEffect, useRef } from "react";
import { Header } from "../components/Header";
import { Plus, Edit2, Trash2, X, Star, ExternalLink, RefreshCw, CheckCircle2, Upload, Image as ImageIcon } from "lucide-react";
import { getPortfolioProjects, savePortfolioProject, deletePortfolioProject, PortfolioProject } from "../../firebase";
import { INITIAL_PORTFOLIO_PROJECTS } from "../../data/initialPortfolio";

// Lista de nomes de projetos antigos obsoletos que devem ser expurgados do banco
const OBSOLETE_NAMES = [
  "posts diversos",
  "nutritech",
  "gf engenharia",
  "maria malta",
  "leandro lamezi",
  "sem foto",
  "studio one",
  "goloni",
  "estante do escritor",
  "moa pro",
  "full english",
  "ugb",
];

function AdminProjectCard({
  projeto,
  onToggleDestaque,
  onEdit,
  onDelete,
}: {
  projeto: PortfolioProject;
  onToggleDestaque: (projeto: PortfolioProject, e: React.MouseEvent) => void;
  onEdit: (projeto: PortfolioProject) => void;
  onDelete: (id?: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleMouseEnter = () => {
    if (videoRef.current && projeto.video) {
      const p = videoRef.current.play();
      if (p !== undefined) {
        p.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="bg-[#0c0c0c] border border-white/10 rounded-2xl overflow-hidden group hover:border-[#00d1ff]/50 transition-all duration-300 flex flex-col shadow-lg"
    >
      {/* MÍDIA: THUMBNAIL PADRÃO & VÍDEO NO HOVER */}
      <div className="relative aspect-[16/10] bg-[#141414] overflow-hidden">
        {projeto.image ? (
          <img
            src={projeto.image}
            alt={projeto.title || projeto.client}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center text-gray-600 font-mono text-xs">
            Sem thumbnail
          </div>
        )}

        {/* VÍDEO EXCLUSIVAMENTE NO HOVER */}
        {projeto.video && (
          <video
            ref={videoRef}
            src={projeto.video}
            muted
            loop
            playsInline
            preload="none"
            className={`absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${
              isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

        {/* Badges superiores na mídia */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="bg-black/70 backdrop-blur border border-white/15 text-[#00d1ff] font-mono text-[9px] uppercase px-2 py-0.5 rounded font-bold">
            {projeto.tagType || projeto.category || "CASE"}
          </span>

          <button
            type="button"
            onClick={(e) => onToggleDestaque(projeto, e)}
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
              onClick={() => onEdit(projeto)}
              className="size-7 rounded bg-white/5 hover:bg-[#00d1ff] text-gray-300 hover:text-black flex items-center justify-center transition-colors"
              title="Editar projeto"
            >
              <Edit2 size={13} />
            </button>

            <button
              onClick={() => onDelete(projeto.id)}
              className="size-7 rounded bg-white/5 hover:bg-red-500 text-gray-300 hover:text-white flex items-center justify-center transition-colors"
              title="Excluir projeto"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [projetos, setProjetos] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

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

  // Função para limpar itens obsoletos e garantir os projetos oficiais da HOME anterior no Firestore
  const cleanAndSeedOfficialProjects = async (currentData: PortfolioProject[]) => {
    try {
      // 1. Identifica e deleta projetos antigos que não têm vídeo válido ou têm nomes da lista obsoleta
      const obsoleteProjects = currentData.filter((p) => {
        const titleLower = (p.title || p.name || "").toLowerCase();
        const clientLower = (p.client || "").toLowerCase();
        const hasNoValidVideo = !p.video || p.video.trim().length < 10 || !p.video.startsWith("http");
        const matchesObsolete = OBSOLETE_NAMES.some((obs) => titleLower.includes(obs) || clientLower.includes(obs));
        return hasNoValidVideo || matchesObsolete;
      });

      if (obsoleteProjects.length > 0) {
        for (const obs of obsoleteProjects) {
          if (obs.id) {
            await deletePortfolioProject(obs.id);
          }
        }
      }

      // 2. Busca lista atualizada pós-limpeza
      const updatedData = await getPortfolioProjects();

      // 3. Garante que todos os projetos oficiais da HOME anterior estejam presentes no Firestore
      const existingNames = new Set(
        updatedData.map((p) => (p.client || p.name || "").toLowerCase().trim())
      );

      for (const official of INITIAL_PORTFOLIO_PROJECTS) {
        const alreadyExists = existingNames.has(official.client.toLowerCase().trim());
        if (!alreadyExists) {
          await savePortfolioProject({
            client: official.client,
            name: official.client,
            title: official.title,
            category: official.category,
            tagType: official.tagType,
            deliverables: official.deliverables,
            desc: official.desc,
            year: official.year,
            badges: official.badges,
            video: official.video,
            image: official.image,
            link: official.link,
            url: official.link,
            destaque: official.destaque,
            score: official.score || "98%",
          });
        }
      }

      // 4. Retorna a lista final atualizada
      const finalData = await getPortfolioProjects();
      return finalData;
    } catch (err) {
      console.error("Erro na limpeza e sincronização:", err);
      return currentData;
    }
  };

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await getPortfolioProjects();

      // Verifica se existem projetos obsoletos ou se faltam os projetos oficiais
      const hasObsolete = data.some((p) => {
        const titleLower = (p.title || p.name || "").toLowerCase();
        const clientLower = (p.client || "").toLowerCase();
        const hasNoValidVideo = !p.video || p.video.trim().length < 10 || !p.video.startsWith("http");
        return hasNoValidVideo || OBSOLETE_NAMES.some((obs) => titleLower.includes(obs) || clientLower.includes(obs));
      });

      const missingOfficial = INITIAL_PORTFOLIO_PROJECTS.some(
        (official) => !data.some((p) => (p.client || p.name || "").toLowerCase().trim() === official.client.toLowerCase().trim())
      );

      if (hasObsolete || missingOfficial || data.length === 0) {
        const synced = await cleanAndSeedOfficialProjects(data);
        setProjetos(synced);
      } else {
        setProjetos(data);
      }
    } catch (err) {
      console.error("Erro ao carregar projetos:", err);
      // Fallback garantido usando os projetos oficiais
      setProjetos(
        INITIAL_PORTFOLIO_PROJECTS.map((item) => ({
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
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // Botão manual para forçar restauração e limpeza
  const handleForceSync = async () => {
    if (!window.confirm("Isso removerá os registros antigos obsoletos e garantirá todos os projetos oficiais da Home com vídeos e links. Deseja continuar?")) return;
    setIsSyncing(true);
    setFeedbackMsg("Limpando projetos antigos e restaurando os cases da Home...");
    try {
      const current = await getPortfolioProjects();
      const updated = await cleanAndSeedOfficialProjects(current);
      setProjetos(updated);
      setFeedbackMsg("Projetos oficiais da Home sincronizados e antigos removidos com sucesso!");
      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch (err) {
      console.error(err);
      alert("Erro ao sincronizar projetos.");
    } finally {
      setIsSyncing(false);
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

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxW = 1200;
        const scale = Math.min(1, maxW / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const webpData = canvas.toDataURL("image/webp", 0.85);
          setFormData((prev) => ({ ...prev, image: webpData }));
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
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
      setFeedbackMsg("Projeto salvo com sucesso! Já disponível no Admin e na Home.");
      setTimeout(() => setFeedbackMsg(null), 4000);
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
        {/* FEEDBACK MSG */}
        {feedbackMsg && (
          <div className="mb-6 p-4 rounded-xl bg-cyan-950/60 border border-cyan/40 text-cyan flex items-center gap-3 text-sm animate-in fade-in">
            <CheckCircle2 size={18} className="shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* CABEÇALHO */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#00d1ff] animate-pulse" />
              <h2 className="text-2xl font-bold tracking-tight">Portfólio de Projetos da HOME</h2>
            </div>
            <p className="text-gray-400 text-sm mt-1">
              Todos os cases abaixo estão conectados diretamente ao Grid de Portfólio da página inicial. Qualquer novo projeto cadastrado passa a aparecer imediatamente na HOME.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleForceSync}
              disabled={isSyncing}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 text-gray-300 hover:text-white px-3.5 py-2.5 rounded-lg text-xs font-mono tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
              title="Remover projetos obsoletos e restaurar os 9 cases oficiais da Home"
            >
              <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
              <span>{isSyncing ? "Sincronizando..." : "Restaurar Projetos da Home"}</span>
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
            Carregando e sincronizando projetos oficiais...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projetos.map((projeto) => (
              <AdminProjectCard
                key={projeto.id || projeto.client}
                projeto={projeto}
                onToggleDestaque={handleToggleDestaque}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
              />
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

              {/* CAMPO DE THUMBNAIL / CAPA PRINCIPAL (IMAGEM FIXA) */}
              <div className="bg-[#121212] p-4 rounded-xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono text-[#00d1ff] tracking-wider uppercase font-bold flex items-center gap-1.5">
                    <ImageIcon size={14} />
                    IMAGEM DA THUMBNAIL (CAPA DO CARD) *
                  </label>
                  {formData.image && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: "" })}
                      className="text-xs text-red-400 hover:text-red-300 font-mono transition-colors"
                    >
                      Remover foto
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                  Esta imagem é a thumbnail fixa exibida permanentemente no card do portfólio. O vídeo MP4 só é reproduzido quando o visitante passa o mouse por cima (hover).
                </p>

                {/* Preview visual da Thumbnail */}
                {formData.image ? (
                  <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden border border-white/20 bg-black">
                    <img
                      src={formData.image}
                      alt="Thumbnail Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur text-[10px] font-mono text-cyan border border-white/10">
                      Thumbnail Ativa (16:10)
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[16/10] w-full rounded-lg border border-dashed border-white/20 bg-black/40 flex flex-col items-center justify-center text-center p-4">
                    <ImageIcon size={28} className="text-gray-500 mb-2" />
                    <span className="text-xs text-gray-400 font-mono">Nenhuma imagem selecionada</span>
                    <span className="text-[10px] text-gray-600 font-mono mt-0.5">Faça upload ou cole a URL abaixo</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  {/* Botão de Upload Local */}
                  <label className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/15 text-white px-3.5 py-2.5 rounded-lg text-xs font-mono font-medium cursor-pointer transition-colors">
                    <Upload size={14} className="text-[#00d1ff]" />
                    <span>Escolher imagem do PC</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Input de URL externa */}
                  <div className="flex-[2]">
                    <input
                      type="text"
                      placeholder="Ou cole a URL: https://.../capa.webp"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full bg-[#161616] border border-white/15 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#00d1ff] font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* CAMPO DE VÍDEO MP4 (REPRODUZ APENAS NO HOVER) */}
              <div className="bg-[#121212] p-4 rounded-xl border border-white/10 space-y-2">
                <label className="block text-[11px] font-mono text-gray-300 tracking-wider uppercase font-semibold">
                  URL DO VÍDEO (MP4 / CLOUDINARY) — REPRODUZ NO HOVER
                </label>
                <input
                  type="text"
                  placeholder="https://res.cloudinary.com/.../video.mp4"
                  value={formData.video}
                  onChange={(e) => setFormData({ ...formData, video: e.target.value })}
                  className="w-full bg-[#161616] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#00d1ff]"
                />
                <p className="text-[10px] text-gray-500 font-mono">
                  Opcional. Se informado, o vídeo tocará em loop exclusivamente quando o visitante passar o mouse sobre o card.
                </p>
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
