import React, { useEffect, useMemo, useState } from "react";
import { Header } from "../components/Header";
import { Eye, Globe, Copy, Search, ExternalLink, Clock, Check } from "lucide-react";

/* Gestão de Páginas — tudo aqui é real:
   - Acessos e última visita: tabela page_views do Supabase (o site soma a cada visita, via /api/visita).
   - Visitas de hoje / 7 / 30 dias: tabela daily_views.
   - Leads: tabela "leads" do Supabase (/api/leads). Conversão = leads ÷ visitas do site inteiro (não existe visita por página com lead por página).
   - Status: o painel pede a página de verdade (HEAD) e mostra se ela responde.
   As imagens são capturas reais de cada página (public/admin-previews, geradas com o Chrome). */
interface Pagina { id: string; title: string; path: string; category: string; desc: string }

const PAGINAS: Pagina[] = [
  { id: "home", title: "Página Inicial", path: "/", category: "PRINCIPAL", desc: "Landing oficial da ESCOM Studio, com hero 3D, serviços e contato." },
  { id: "construtora", title: "Espelho de Vendas 3D", path: "/construtora", category: "PRODUTO", desc: "Simulação 3D do empreendimento com espelho de vendas, simulador de pagamento, entorno e galeria dos apartamentos." },
  { id: "portfolio-projetos", title: "Portfólio de Projetos", path: "/portfolio-projetos", category: "PORTFÓLIO", desc: "Vitrine de cases, trabalhos realizados e protótipos interativos." },
  { id: "portfolioedu", title: "Portfólio EDU", path: "/portfolioedu", category: "PORTFÓLIO", desc: "Currículo interativo e projetos do Edu." },
  { id: "baseproposta", title: "Base de Propostas", path: "/baseproposta", category: "PROSPECÇÃO", desc: "Modelo de proposta comercial interativa enviada aos clientes." },
  { id: "sobre", title: "Sobre a ESCOM Studio", path: "/sobre", category: "INSTITUCIONAL", desc: "Manifesto da agência, equipe, infraestrutura e visão estratégica." },
  { id: "piassa", title: "Painel Piassa Vagas", path: "/piassa", category: "FERRAMENTAS", desc: "Mineração de vagas e disparo automatizado de e-mails." },
];
const CATEGORIAS = ["TODAS", "PRINCIPAL", "PRODUTO", "PORTFÓLIO", "PROSPECÇÃO", "INSTITUCIONAL", "FERRAMENTAS"];

type Visita = { total: number; ultima: Date | null };
const dia = (d: Date) => d.toISOString().slice(0, 10);

export default function Paginas() {
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("TODAS");
  const [visitas, setVisitas] = useState<Record<string, Visita>>({});
  const [diarias, setDiarias] = useState<Record<string, number>>({});
  const [totalLeads, setTotalLeads] = useState<number | null>(null);
  const [online, setOnline] = useState<Record<string, boolean | undefined>>({});
  const [copiado, setCopiado] = useState<string | null>(null);

  useEffect(() => {
    let vivo = true;
    (async () => {
      try {
        const r = await fetch("/api/visitas");
        const j = r.ok ? await r.json() : { paginas: [], diarias: {} };
        const mapa: Record<string, Visita> = {};
        (j.paginas || []).forEach((p: any) => { mapa[String(p.id).toLowerCase()] = { total: p.total, ultima: p.ultima ? new Date(p.ultima) : null }; });
        if (vivo) { setVisitas(mapa); setDiarias(j.diarias || {}); }
      } catch { /* sem acesso: os números ficam como "—" */ }
      try {
        const r = await fetch("/api/leads");
        const j = r.ok ? await r.json() : { leads: [] };
        if (vivo) setTotalLeads((j.leads || []).filter((l: any) => l.origem !== "site").length);
      } catch { /* idem */ }
    })();
    // status real: pede cada página e vê se ela responde
    PAGINAS.forEach(async p => {
      let ok = false;
      try { ok = (await fetch(p.path, { method: "HEAD", cache: "no-store" })).ok; } catch { ok = false; }
      if (vivo) setOnline(prev => ({ ...prev, [p.id]: ok }));
    });
    return () => { vivo = false; };
  }, []);

  const visitaDe = (p: Pagina): Visita | undefined => visitas[p.id] ?? visitas[p.path.toLowerCase()] ?? visitas[p.path.replace(/^\//, "").toLowerCase()];

  const resumo = useMemo(() => {
    const hoje = new Date();
    const soma = (dias: number) => {
      const ini = new Date(hoje); ini.setHours(0, 0, 0, 0); ini.setDate(ini.getDate() - (dias - 1));
      const de = dia(ini);
      return Object.entries(diarias).reduce((s, [d, n]) => (d >= de ? s + n : s), 0);
    };
    const total = Object.values(visitas).reduce((s, v) => s + v.total, 0);
    return { total, hoje: soma(1), sete: soma(7), trinta: soma(30) };
  }, [visitas, diarias]);

  const filtradas = PAGINAS.filter(p =>
    (categoria === "TODAS" || p.category === categoria) &&
    (p.title.toLowerCase().includes(busca.toLowerCase()) || p.path.toLowerCase().includes(busca.toLowerCase())));
  const noAr = PAGINAS.filter(p => online[p.id]).length;

  const copiar = async (p: Pagina) => {
    try { await navigator.clipboard.writeText(window.location.origin + p.path); setCopiado(p.id); setTimeout(() => setCopiado(null), 1800); } catch { /* sem permissão da área de transferência */ }
  };

  const Metrica = ({ rotulo, valor, cor }: { rotulo: string; valor: React.ReactNode; cor: string }) => (
    <div className="bg-[#0e172a] border border-[#1e2e4a] rounded-2xl p-5 space-y-2 shadow-xl">
      <div className="flex justify-between items-center text-gray-400 text-xs font-mono"><span>{rotulo}</span></div>
      <div className={`text-3xl font-extrabold ${cor}`}>{valor}</div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto w-full bg-[#070c18] text-white pb-20 font-sans">
      <Header title="Gestão de Páginas" subtitle="Acompanhe o que está no ar, as visitas e a última visita de cada página do site." />

      <div className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <Metrica rotulo="PÁGINAS NO AR" valor={<>{noAr}<span className="text-base text-gray-500 font-semibold"> / {PAGINAS.length}</span></>} cor="text-emerald-400" />
          <Metrica rotulo="VISUALIZAÇÕES (TOTAL)" valor={resumo.total.toLocaleString("pt-BR")} cor="text-cyan-400" />
          <Metrica rotulo="HOJE · 7 DIAS · 30 DIAS" valor={<span className="text-2xl">{resumo.hoje} · {resumo.sete} · {resumo.trinta}</span>} cor="text-white" />
          <Metrica rotulo="LEADS MINERADOS" valor={totalLeads !== null ? String(totalLeads) : "—"} cor="text-purple-400" />
        </div>

        <div className="bg-[#0e172a] border border-[#1e2e4a] rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar por nome ou endereço da página..."
              className="w-full bg-[#080d19] border border-[#1d2d4a] rounded-xl pl-12 pr-4 py-2.5 text-white text-xs md:text-sm focus:border-blue-500 outline-none transition-colors" />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {CATEGORIAS.map(cat => (
              <button key={cat} onClick={() => setCategoria(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${categoria === cat ? "bg-[#2563eb] text-white shadow-md shadow-blue-500/20" : "bg-[#080d19] text-gray-400 hover:text-white border border-[#1d2d4a]"}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtradas.map(p => {
            const v = visitaDe(p);
            const status = online[p.id];
            return (
              <div key={p.id} className="bg-[#0e172a] border border-[#1e2e4a] hover:border-blue-500 rounded-3xl overflow-hidden transition-all duration-300 group flex flex-col shadow-xl">
                <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#0b1330] to-[#050816]">
                  <img src={`/admin-previews/${p.id}.webp`} alt={`Captura da página ${p.title}`} loading="lazy"
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e172a] via-transparent to-transparent"></div>
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md border ${status === undefined ? "bg-gray-500/20 text-gray-300 border-gray-500/30" : status ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}`}>
                      ● {status === undefined ? "VERIFICANDO" : status ? "NO AR" : "FORA DO AR"}
                    </span>
                    <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full backdrop-blur-md">{p.category}</span>
                  </div>
                  <button onClick={() => copiar(p)} title="Copiar endereço"
                    className="absolute top-3 right-3 bg-black/60 hover:bg-black text-white p-2 rounded-full backdrop-blur-md border border-white/20 transition-colors">
                    {copiado === p.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors leading-tight">{p.title}</h3>
                    <div className="text-xs text-blue-400 font-mono flex items-center gap-1"><Globe size={12} /><span>{p.path}</span></div>
                    <p className="text-xs text-gray-400 leading-relaxed pt-1">{p.desc}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 bg-[#080d19] border border-[#1b2b4a] rounded-2xl p-3 text-center">
                    <div>
                      <span className="text-[9px] text-gray-400 font-mono flex items-center justify-center gap-1"><Eye size={10} /> ACESSOS</span>
                      <span className="text-sm font-extrabold text-white">{v ? v.total.toLocaleString("pt-BR") : "—"}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 font-mono flex items-center justify-center gap-1"><Clock size={10} /> ÚLTIMA VISITA</span>
                      <span className="text-sm font-extrabold text-cyan-300">{v?.ultima ? v.ultima.toLocaleDateString("pt-BR") : "—"}</span>
                    </div>
                  </div>
                  <a href={p.path} target="_blank" rel="noopener noreferrer"
                    className="w-full bg-[#18294a] hover:bg-[#2563eb] border border-[#243d6e] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md group-hover:shadow-blue-500/20">
                    <span>Abrir página em nova aba</span><ExternalLink size={14} />
                  </a>
                </div>
              </div>
            );
          })}
          {filtradas.length === 0 && <div className="col-span-full text-center text-gray-500 py-16 text-sm">Nenhuma página encontrada.</div>}
        </div>
      </div>
    </div>
  );
}
