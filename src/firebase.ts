// Portfólio e Trajetória: dados no Supabase, pela API do site (/api/portfolio e /api/experiences).
// O nome do arquivo ficou "firebase.ts" para não mexer nas páginas que importam daqui; o Firestore não é mais usado.
// Ler é público (o site mostra); gravar e apagar exige o login do painel (o authFetch do admin envia o token).
import { ordenarExperiencias } from "./lib/trajetoria";

export interface PortfolioProject {
  id?: string;
  name: string;
  client?: string;
  title?: string;
  category: string;
  tag?: string;
  tagType?: string;
  desc?: string;
  deliverables?: string;
  image?: string;
  video?: string;
  link?: string;
  url?: string;
  year?: string;
  score?: string;
  badges?: string[];
  destaque?: boolean;
  featured?: boolean;
  createdAt?: any;
}

export interface Experience {
  id?: string;
  role: string;
  company: string;
  period: string;     // início, ex.: "JUN 2025"
  location: string;   // fim, ex.: "MAI 2025" ou "ATUAL"
  desc: string;
  createdAt?: any;
}

async function api(metodo: string, url: string, corpo?: unknown) {
  const r = await fetch(url, { method: metodo, headers: { "Content-Type": "application/json" }, body: corpo ? JSON.stringify(corpo) : undefined });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.success === false) throw new Error(j.error || `Erro ${r.status}`);
  return j;
}

// Normaliza os nomes de campo antigos (client/name/title, image/imageUrl/thumb, etc.)
function normalizarProjeto(data: any): PortfolioProject {
  const clientName = data.client || data.name || data.title || "";
  const rawBadges = data.badges;
  const badges = Array.isArray(rawBadges) ? rawBadges
    : typeof rawBadges === "string" && rawBadges.trim() ? rawBadges.split(",").map((s: string) => s.trim())
    : ["DEV", "SOTD"];
  return {
    id: data.id,
    name: clientName,
    client: clientName,
    title: data.title || data.name || "",
    category: data.category || "WEBSITE",
    tag: data.tag || data.tagType || "WEBSITE",
    tagType: data.tagType || data.tag || "WEBSITE",
    desc: data.description || data.desc || data.deliverables || "",
    deliverables: data.deliverables || data.desc || "",
    image: data.image || data.imageUrl || data.thumbnailUrl || data.thumb || "",
    video: data.video || data.videoUrl || "",
    link: data.link || data.url || "",
    url: data.url || data.link || "",
    year: data.year ? String(data.year) : "2025",
    score: data.score || "",          // sem nota inventada: só mostra se foi cadastrada
    badges,
    destaque: data.destaque ?? data.featured ?? true,
    featured: data.destaque ?? data.featured ?? true,
    createdAt: data.createdAt,
  };
}

export const getPortfolioProjects = async (): Promise<PortfolioProject[]> => {
  try {
    const j = await api("GET", "/api/portfolio");
    return (j.items || []).map(normalizarProjeto);   // a API já devolve do mais novo para o mais antigo
  } catch (error) {
    console.error("Erro ao carregar o portfólio:", error);
    return [];
  }
};

export const savePortfolioProject = async (project: Partial<PortfolioProject>) => {
  try {
    const clientName = project.client || project.name || "";
    const badges = Array.isArray(project.badges) ? project.badges
      : typeof project.badges === "string" ? (project.badges as string).split(",").map(s => s.trim()).filter(Boolean)
      : ["DEV", "SOTD"];
    const payload = {
      id: project.id,
      name: clientName, client: clientName, title: project.title || project.name || "",
      category: project.category || "WEBSITE",
      tag: project.tag || project.tagType || "WEBSITE", tagType: project.tagType || project.tag || "WEBSITE",
      desc: project.desc || project.deliverables || "", description: project.desc || project.deliverables || "",
      deliverables: project.deliverables || project.desc || "",
      image: project.image || "", video: project.video || "",
      link: project.link || project.url || "", url: project.url || project.link || "",
      year: project.year || "2025", score: project.score || "", badges,
      featured: project.destaque ?? project.featured ?? true, destaque: project.destaque ?? project.featured ?? true,
    };
    const j = await api("POST", "/api/portfolio", payload);
    return { success: true, id: j.id };
  } catch (error) {
    console.error("Erro ao salvar o projeto:", error);
    return { success: false, error };
  }
};

export const deletePortfolioProject = async (id: string) => {
  try { await api("DELETE", `/api/portfolio/${encodeURIComponent(id)}`); return { success: true }; }
  catch (error) { console.error("Erro ao apagar o projeto:", error); return { success: false, error }; }
};

export const getExperiences = async (): Promise<Experience[]> => {
  try {
    const j = await api("GET", "/api/experiences");
    return ordenarExperiencias(j.items || []);   // atual primeiro, depois do início mais recente para o mais antigo
  } catch (error) {
    console.error("Erro ao carregar a trajetória:", error);
    return [];
  }
};

export const saveExperience = async (experience: Experience) => {
  try { const j = await api("POST", "/api/experiences", experience); return { success: true, id: j.id }; }
  catch (error) { console.error("Erro ao salvar a experiência:", error); return { success: false, error }; }
};

export const deleteExperience = async (id: string) => {
  try { await api("DELETE", `/api/experiences/${encodeURIComponent(id)}`); return { success: true }; }
  catch (error) { console.error("Erro ao apagar a experiência:", error); return { success: false, error }; }
};
