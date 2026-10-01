import React, { useState, useEffect, useMemo } from "react";
import { Header } from "../components/Header";
import { 
  Search, Plus, Trash2, ChevronDown, Globe, Phone, MapPin, 
  Sparkles, CheckSquare, Square, Download, Send, Loader2, Star,
  Copy, Check, ExternalLink, Instagram, MessageCircle, RefreshCw,
  Filter, ArrowUpRight
} from "lucide-react";
import { db } from "../../lib/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export const ESTADOS_LIST = [
  "SP — São Paulo",
  "BA — Bahia",
  "CE — Ceará",
  "DF — Distrito Federal",
  "ES — Espírito Santo",
  "GO — Goiás",
  "MA — Maranhão",
  "MT — Mato Grosso",
  "MS — Mato Grosso do Sul",
  "MG — Minas Gerais",
  "PA — Pará",
  "PB — Paraíba",
  "PR — Paraná",
  "PE — Pernambuco",
  "PI — Piauí",
  "RJ — Rio de Janeiro",
  "RN — Rio Grande do Norte",
  "RS — Rio Grande do Sul",
  "RO — Rondônia"
];

export const CIDADES_LIST = [
  "São Paulo",
  "Santo André",
  "Santos",
  "São Bernardo do Campo",
  "São Caetano do Sul",
  "Osasco",
  "Mauá",
  "Mogi das Cruzes",
  "Mogi Guaçu",
  "Marília",
  "Ourinhos",
  "Paulínia",
  "Piracicaba",
  "Pirassununga",
  "Praia Grande",
  "Presidente Prudente",
  "Ribeirão Preto",
  "Rio Claro",
  "São Carlos",
  "São José do Rio Preto",
  "São José dos Campos"
];

export const CATEGORIAS_LIST = [
  "Hamburgueria",
  "Bar / Restaurante",
  "Barbearia",
  "Odontologia",
  "Clínicas Odontológicas (Implantes e Lentes)",
  "Salão de Beleza",
  "Academia",
  "Clínica Médica",
  "Lanchonete",
  "Loja de Roupas",
  "Advocacia",
  "Agência de Viagens",
  "Auto Elétrica",
  "Cafeteria",
  "Clínica Estética",
  "Contabilidade",
  "Cursos / Treinamentos"
];

export default function Leads() {
  const navigate = useNavigate();
  const [selectedEstado, setSelectedEstado] = useState("SP — São Paulo");
  const [selectedCidade, setSelectedCidade] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState("Hamburgueria");
  const [leadLimit, setLeadLimit] = useState(25);

  // Estados de Busca e Filtros Inspirados no CRM
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCidade, setFilterCidade] = useState("todas");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [filterOportunidade, setFilterOportunidade] = useState("todas");
  const [filterSite, setFilterSite] = useState("todos"); // "todos" | "sem_site" | "com_site" | "site_gerado" | "com_analise"

  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [generatingSiteId, setGeneratingSiteId] = useState<string | null>(null);
  const [generatedSiteUrls, setGeneratedSiteUrls] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [emailModal, setEmailModal] = useState<{ lead: any } | null>(null);
  const [emailInput, setEmailInput] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [showMineradorModal, setShowMineradorModal] = useState(false);

  const notify = (msg: string, type: "success" | "error" = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leads");
      if (res.ok) {
        const data = await res.json();
        if (data.leads && data.leads.length > 0) {
          setLeads(data.leads);
          // Para leads que têm analise_gerada mas não têm site_gerado, verifica Firebase silenciosamente
          const semSite = data.leads.filter((l: any) => l.analise_gerada && !l.siteGerado && !l.site_gerado);
          semSite.forEach(async (l: any) => {
            try {
              const chk = await fetch(`/api/check-site/${l.id}`);
              if (!chk.ok) return;
              const result = await chk.json();
              if (result.found && result.url) {
                setGeneratedSiteUrls(prev => ({ ...prev, [l.id]: result.url }));
                setLeads(prev => prev.map(x => x.id === l.id ? { ...x, siteGerado: result.url } : x));
              }
            } catch {}
          });
          return;
        }
      }
      
      // Leads padrão inspirados exatamente no CRM de referência
      setLeads([
        {
          id: "crm-lead-1",
          nome: "Mobi Hamburgueria",
          categoria: "Hamburgueria",
          cidade: "São Paulo, SP",
          endereco: "R. Prof. Atílio Innocenti, 531 - Itaim Bibi, São Paulo - SP",
          telefone: "(11) 98123-4567",
          rating: 4.7,
          reviewsCount: 2422,
          temSite: false,
          oportunidade: "Alta",
          score: 95,
          photoUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=120&h=120&fit=crop"
        },
        {
          id: "crm-lead-2",
          nome: "Bar e Lanches Estadão",
          categoria: "Lanchonete",
          cidade: "São Paulo, SP",
          endereco: "Viaduto Nove de Julho, 193 - Centro Histórico, São Paulo - SP",
          telefone: "(11) 3257-7121",
          rating: 4.6,
          reviewsCount: 32533,
          temSite: false,
          oportunidade: "Alta",
          score: 91,
          photoUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=120&h=120&fit=crop"
        },
        {
          id: "crm-lead-3",
          nome: "Iron Burguer Hamburgueria",
          categoria: "Hamburgueria",
          cidade: "São Paulo, SP",
          endereco: "R. São Caetano do Sul, 120 - Tatuapé, São Paulo - SP",
          telefone: "(11) 97122-8890",
          rating: 4.4,
          reviewsCount: 5812,
          temSite: false,
          siteUrl: "https://ironburguer.com.br",
          oportunidade: "Alta",
          score: 91,
          photoUrl: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=120&h=120&fit=crop"
        },
        {
          id: "crm-lead-4",
          nome: "Asterix Cervejaria",
          categoria: "Bar / Restaurante",
          cidade: "São Paulo, SP",
          endereco: "Alameda dos Anapurus, 1312 - Moema, São Paulo - SP",
          telefone: "(11) 99455-1200",
          rating: 4.4,
          reviewsCount: 5141,
          temSite: false,
          siteUrl: "https://asterixcervejaria.com.br",
          instagram: "asterixcervejaria",
          oportunidade: "Alta",
          score: 91,
          photoUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=120&h=120&fit=crop"
        },
        {
          id: "crm-lead-5",
          nome: "Buteco de Minas",
          categoria: "Bar / Botequim",
          cidade: "São Paulo, SP",
          endereco: "Rua Gomes de Carvalho, 900 - Vila Olímpia, São Paulo - SP",
          telefone: "(11) 98344-9011",
          rating: 4.5,
          reviewsCount: 4262,
          temSite: false,
          oportunidade: "Alta",
          score: 91,
          photoUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=120&h=120&fit=crop"
        },
        {
          id: "crm-lead-6",
          nome: "Void Lojas Gerais - Largo da Batata",
          categoria: "Bar / Restaurante",
          cidade: "São Paulo, SP",
          endereco: "Rua Martim Carrasco, 56 - Pinheiros, São Paulo - SP",
          telefone: "(11) 96123-9900",
          rating: 4.4,
          reviewsCount: 2938,
          temSite: false,
          oportunidade: "Alta",
          score: 91,
          photoUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=120&h=120&fit=crop"
        },
        {
          id: "crm-lead-7",
          nome: "Novo Hamburger Artesanal",
          categoria: "Hamburgueria",
          cidade: "São Paulo, SP",
          endereco: "Av. Paulista, 2073 - Bela Vista, São Paulo - SP",
          telefone: "(11) 99233-1122",
          rating: 4.4,
          reviewsCount: 1965,
          temSite: false,
          oportunidade: "Alta",
          score: 91,
          photoUrl: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=120&h=120&fit=crop"
        }
      ]);
    } catch (err) {
      console.warn("Erro ao buscar leads da API, usando dados locais.", err);
    } finally {
      setLoading(false);
    }
  };

  const [geracaoStep, setGeracaoStep] = useState<string>("");
  const [pendingLeads, setPendingLeads] = useState<Record<string, boolean>>({});
  const [pendingMsg, setPendingMsg] = useState<Record<string, string>>({});
  const [pendingPct, setPendingPct] = useState<Record<string, number>>({});
  const [analiseUrls, setAnaliseUrls] = useState<Record<string, string>>({});

  const GERACAO_MSGS = [
    "Buscando referências no Pinterest...",
    "Analisando concorrentes...",
    "Mapeando oportunidades de nicho...",
    "Gerando análise estratégica...",
    "Criando identidade visual...",
    "Construindo estrutura do site...",
    "Aplicando referências de design...",
    "Refinando textos e CTAs...",
    "Otimizando para mobile...",
    "Finalizando e salvando...",
  ];

  const startProgressMessages = (leadId: string) => {
    let idx = 0;
    setPendingMsg(p => ({ ...p, [leadId]: GERACAO_MSGS[0] }));
    const msgInterval = setInterval(() => {
      idx = (idx + 1) % GERACAO_MSGS.length;
      setPendingMsg(p => {
        if (p[leadId] === undefined) { clearInterval(msgInterval); return p; }
        return { ...p, [leadId]: GERACAO_MSGS[idx] };
      });
    }, 6000);
  };

  // Polling: verifica a cada 8s se o site foi gerado (Supabase ou Firebase via site-preview)
  const pollSiteGerado = (leadId: string) => {
    let attempts = 0;
    const MAX = 30; // ~4 min
    const previewUrl = `/api/site-preview/${leadId}`;
    setPendingPct(p => ({ ...p, [leadId]: 2 }));
    const done = (url: string) => {
      clearInterval(interval);
      setPendingPct(p => ({ ...p, [leadId]: 100 }));
      setTimeout(() => {
        setPendingLeads(p => { const n = {...p}; delete n[leadId]; return n; });
        setPendingMsg(p => { const n = {...p}; delete n[leadId]; return n; });
        setPendingPct(p => { const n = {...p}; delete n[leadId]; return n; });
      }, 800);
      setGeneratedSiteUrls(prev => ({ ...prev, [leadId]: url }));
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, siteGerado: url } : l));
      notify("✅ Site gerado! Clique em 'Ver Site' no lead.");
    };
    const interval = setInterval(async () => {
      attempts++;
      const raw = attempts / MAX;
      const pct = Math.round(Math.min(95, raw < 0.7 ? raw * 110 : 77 + (raw - 0.7) * 60));
      setPendingPct(p => ({ ...p, [leadId]: pct }));
      try {
        // 1. Verifica Firebase via endpoint dedicado (testa múltiplos IDs/campos)
        const chk = await fetch(`/api/check-site/${leadId}`);
        if (chk.ok) {
          const data = await chk.json();
          if (data.found && data.url) { done(data.url); return; }
        }
        // 2. Verifica Supabase via /api/leads (fallback)
        const r = await fetch(`/api/leads`);
        if (r.ok) {
          const body = await r.json();
          const rows: any[] = body.leads ?? body ?? [];
          const found = rows.find((l: any) => l.id === leadId);
          const sbUrl = found?.siteGerado || found?.site_gerado || "";
          if (sbUrl) { done(sbUrl); return; }
        }
      } catch {}
      if (attempts >= MAX) {
        clearInterval(interval);
        setPendingLeads(p => { const n = {...p}; delete n[leadId]; return n; });
        setPendingMsg(p => { const n = {...p}; delete n[leadId]; return n; });
        setPendingPct(p => { const n = {...p}; delete n[leadId]; return n; });
      }
    }, 8000);
  };

  const handleEnviarEmail = async () => {
    if (!emailModal || !emailInput.trim()) return;
    setSendingEmail(true);
    try {
      const res = await fetch("/api/enviar-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: emailModal.lead.id,
          emailDestinatario: emailInput.trim(),
          nomeDestinatario: emailModal.lead.nome,
        }),
      });
      if (res.ok) {
        notify("✅ Proposta enviada com sucesso!");
        setEmailModal(null);
      } else {
        const err = await res.json().catch(() => ({}));
        notify("Erro ao enviar: " + (err.error || res.status), "error");
      }
    } catch (e: any) {
      notify("Erro: " + e.message, "error");
    } finally {
      setSendingEmail(false);
    }
  };

  const handleGerarProposta = async (lead: any) => {
    if (generatingSiteId) return;
    setGeneratingSiteId(lead.id);
    try {
      setGeracaoStep("analise");
      await fetch(`/api/gerar-analise/${lead.id}`);
      // Analise URL é sempre conhecida após o step 1
      setAnaliseUrls(prev => ({ ...prev, [lead.id]: `/api/gerar-analise/${lead.id}` }));

      setGeracaoStep("site");
      const res = await fetch("/api/gerar-proposta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: lead.id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao gerar proposta");

      setGeracaoStep("pronto");
      const siteUrl = data.siteUrl || data.propostaUrl || data.url || "";
      if (siteUrl) {
        setGeneratedSiteUrls(prev => ({ ...prev, [lead.id]: siteUrl }));
        setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, siteGerado: siteUrl } : l));
        notify("✅ Proposta gerada! Clique em 'Site' para abrir.");
        window.open(siteUrl, "_blank");
      } else {
        // N8N processa em segundo plano — inicia polling + mensagens
        setPendingLeads(prev => ({ ...prev, [lead.id]: true }));
        startProgressMessages(lead.id);
        notify("⏳ Gerando site em segundo plano... Você será avisado quando pronto.");
        pollSiteGerado(lead.id);
      }
    } catch (err: any) {
      notify(`Erro: ${err.message}`, "error");
    } finally {
      setGeneratingSiteId(null);
      setGeracaoStep("");
    }
  };

  const handleSearchLeads = async () => {
    setLoading(true);
    try {
      const ufClean = selectedEstado.split(" — ")[0];
      const res = await fetch("/api/buscar-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nicho: selectedCategoria,
          cidade: selectedCidade,
          estado: ufClean,
          quantidade: leadLimit
        })
      });
      if (res.ok) {
        notify("Raspagem concluída! Leads atualizados com sucesso.");
        setShowMineradorModal(false);
        await fetchLeads();
      } else {
        throw new Error("Falha ao acionar raspagem");
      }
    } catch (err) {
      notify("Erro ao buscar leads. Verifique a conexão.", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPhone = (lead: any) => {
    const cleanPhone = (lead.telefone || "").replace(/\D/g, "");
    navigator.clipboard.writeText(lead.telefone || cleanPhone);
    setCopiedId(lead.id);
    notify(`Telefone de ${lead.nome} copiado!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedLeadIds.length === filteredLeads.length && filteredLeads.length > 0) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(filteredLeads.map(l => l.id));
    }
  };

  const handleToggleSelectLead = (id: string) => {
    setSelectedLeadIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSendToCRM = async () => {
    if (selectedLeadIds.length === 0) {
      alert("Selecione pelo menos um lead para enviar ao CRM.");
      return;
    }
    const selectedLeads = leads.filter(l => selectedLeadIds.includes(l.id));
    try {
      for (const lead of selectedLeads) {
        await addDoc(collection(db, "leads"), {
          ...lead,
          etapa: "Base",
          createdAt: serverTimestamp()
        });
      }
      alert(`${selectedLeads.length} leads enviados com sucesso para o CRM!`);
      navigate("/prospect");
    } catch (err) {
      console.error("Erro ao enviar pro CRM", err);
      navigate("/prospect");
    }
  };

  const handleExportCSV = () => {
    if (filteredLeads.length === 0) return;
    const headers = ["Nome", "Categoria", "Cidade", "Telefone", "Endereço", "Tem Site", "Rating", "Reviews"];
    const rows = filteredLeads.map(l => [
      `"${l.nome || ''}"`,
      `"${l.categoria || ''}"`,
      `"${l.cidade || ''}"`,
      `"${l.telefone || ''}"`,
      `"${l.endereco || ''}"`,
      `"${l.temSite ? 'Sim' : 'Não'}"`,
      `"${l.rating || ''}"`,
      `"${l.reviewsCount || ''}"`
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `leads_escom_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Filtragem inteligente
  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      const term = searchTerm.toLowerCase();
      const matchSearch = !term || 
        l.nome?.toLowerCase().includes(term) ||
        l.endereco?.toLowerCase().includes(term) ||
        l.cidade?.toLowerCase().includes(term) ||
        l.telefone?.includes(term);

      const matchCidade = filterCidade === "todas" || l.cidade?.toLowerCase().includes(filterCidade.toLowerCase());
      
      const matchOportunidade = filterOportunidade === "todas" || 
        (l.oportunidade || (l.score >= 80 ? "Alta" : "Média")).toLowerCase() === filterOportunidade.toLowerCase();

      const matchSite = filterSite === "todos" ||
        (filterSite === "sem_site"    ? !l.temSite : false) ||
        (filterSite === "com_site"    ? l.temSite : false) ||
        (filterSite === "site_gerado" ? !!(l.siteGerado || generatedSiteUrls[l.id]) : false) ||
        (filterSite === "com_analise" ? !!l.diagnostico : false);

      return matchSearch && matchCidade && matchOportunidade && matchSite;
    });
  }, [leads, searchTerm, filterCidade, filterOportunidade, filterSite]);

  // Métricas para os Cards do Topo
  const totalLeads = leads.length;
  const altaOportunidadeCount = leads.filter(l => (l.score && l.score >= 85) || l.oportunidade === "Alta").length;
  const semSiteCount = leads.filter(l => !l.temSite).length;
  const telefoneValidoCount = leads.filter(l => l.telefone && l.telefone.replace(/\D/g, "").length >= 10).length;

  return (
    <div className="flex-1 overflow-y-auto w-full bg-[#000000] text-foreground min-h-screen p-4 md:p-8">
      <Header title="Organização de Leads" subtitle="CRM de Prospecção // Extração e Contatos Rápidos" />

      {/* NOTIFICAÇÃO */}
      {notification && (
        <div className={`mt-4 px-4 py-3 border text-xs font-mono uppercase tracking-[0.1em] flex items-center justify-between ${notification.type === "error" ? "bg-red-950/40 text-red-300 border-red-800" : "bg-cyan/10 text-cyan border-cyan/30"}`}>
          <span>{notification.msg}</span>
        </div>
      )}

      {/* 1. CARDS DE MÉTRICAS SUPERIORES (Inspirados no CRM de Referência) */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Leads Totais */}
        <div className="bg-[#09090b] border border-white/10 p-5 flex flex-col justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">Leads totais</span>
          <div className="my-2">
            <span className="font-serif text-4xl font-light text-white tracking-tight">{totalLeads}</span>
          </div>
          <span className="text-xs text-white/40 font-mono">registros da planilha</span>
        </div>

        {/* Card 2: Alta Oportunidade */}
        <div className="bg-[#09090b] border border-white/10 p-5 flex flex-col justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">Alta oportunidade</span>
          <div className="my-2">
            <span className="font-serif text-4xl font-light text-cyan tracking-tight">{altaOportunidadeCount}</span>
          </div>
          <span className="text-xs text-white/40 font-mono">bom potencial para site</span>
        </div>

        {/* Card 3: Sem Site Próprio */}
        <div className="bg-[#09090b] border border-white/10 p-5 flex flex-col justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">Sem site próprio</span>
          <div className="my-2">
            <span className="font-serif text-4xl font-light text-amber-400 tracking-tight">{semSiteCount}</span>
          </div>
          <span className="text-xs text-white/40 font-mono">inclui perfis só em redes sociais</span>
        </div>

        {/* Card 4: Telefone Válido */}
        <div className="bg-[#09090b] border border-white/10 p-5 flex flex-col justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">Telefone válido</span>
          <div className="my-2">
            <span className="font-serif text-4xl font-light text-emerald-400 tracking-tight">{telefoneValidoCount}</span>
          </div>
          <span className="text-xs text-white/40 font-mono">pronto para copiar/WhatsApp</span>
        </div>
      </div>

      {/* 2. BARRA DE FILTROS E BUSCA (Inspirada no layout horizontal da imagem) */}
      <div className="mt-6 bg-[#09090b] border border-white/10 p-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* Campo de Busca */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-white/40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar nome, endereço, cidade, telefone..."
              className="w-full bg-[#000000] border border-white/10 pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-white/40 font-mono focus:border-cyan/50 focus:outline-none transition-colors"
            />
          </div>

          {/* Select Cidades */}
          <div className="w-full lg:w-44">
            <select
              value={filterCidade}
              onChange={(e) => setFilterCidade(e.target.value)}
              className="w-full bg-[#000000] border border-white/10 px-3 py-2.5 text-xs text-white/80 font-mono focus:border-cyan/50 focus:outline-none"
            >
              <option value="todas">Todas as cidades</option>
              <option value="São Paulo">São Paulo</option>
              <option value="Santo André">Santo André</option>
              <option value="Campinas">Campinas</option>
              <option value="Santos">Santos</option>
            </select>
          </div>

          {/* Select Oportunidade */}
          <div className="w-full lg:w-44">
            <select
              value={filterOportunidade}
              onChange={(e) => setFilterOportunidade(e.target.value)}
              className="w-full bg-[#000000] border border-white/10 px-3 py-2.5 text-xs text-white/80 font-mono focus:border-cyan/50 focus:outline-none"
            >
              <option value="todas">Toda oportunidade</option>
              <option value="alta">Alta oportunidade</option>
              <option value="média">Média oportunidade</option>
            </select>
          </div>

          {/* Select Com ou Sem Site */}
          <div className="w-full lg:w-44">
            <select
              value={filterSite}
              onChange={(e) => setFilterSite(e.target.value)}
              className="w-full bg-[#000000] border border-white/10 px-3 py-2.5 text-xs text-white/80 font-mono focus:border-cyan/50 focus:outline-none"
            >
              <option value="todos">Com ou sem site</option>
              <option value="sem_site">Sem site próprio</option>
              <option value="com_site">Com site próprio</option>
              <option value="site_gerado">🖥 Site gerado pela ESCOM</option>
              <option value="com_analise">📄 Com análise</option>
            </select>
          </div>

          {/* Botão Novo Minerador */}
          <button
            onClick={() => setShowMineradorModal(true)}
            className="bg-[#00d1ff] hover:bg-[#00b8e6] text-black font-mono text-[11px] uppercase tracking-[0.12em] font-bold px-4 py-2.5 flex items-center justify-center gap-2 transition-all active:scale-95 whitespace-nowrap shadow-[0_0_20px_rgba(0,209,255,0.35)] cursor-pointer"
          >
            <Plus size={14} strokeWidth={2.5} className="text-black" />
            <span className="text-black font-bold">Raspar Novos Leads</span>
          </button>
        </div>
      </div>

      {/* 3. BARRA DE STATUS / SELEÇÃO / EXPORTAÇÃO */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-white/60">
            <strong className="text-white font-medium">{filteredLeads.length}</strong> leads exibidos
          </span>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-white/60 hover:text-white">
            <input
              type="checkbox"
              checked={selectedLeadIds.length === filteredLeads.length && filteredLeads.length > 0}
              onChange={handleToggleSelectAll}
              className="accent-[#00d1ff] cursor-pointer"
            />
            <span>Selecionar todos ({selectedLeadIds.length})</span>
          </label>

          {selectedLeadIds.length > 0 && (
            <button
              onClick={handleSendToCRM}
              className="bg-[#00d1ff]/10 hover:bg-[#00d1ff]/20 border border-[#00d1ff]/40 text-[#00d1ff] font-mono text-[10px] uppercase tracking-[0.1em] px-3 py-1.5 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Send size={12} className="text-[#00d1ff]" />
              <span>Enviar para CRM</span>
            </button>
          )}
        </div>

        <button
          onClick={handleExportCSV}
          className="text-xs font-mono uppercase tracking-[0.1em] text-white/80 hover:text-[#00d1ff] bg-white/[0.03] border border-white/15 hover:border-[#00d1ff]/40 px-3 py-1.5 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Download size={13} className="text-[#00d1ff]" />
          <span>Exportar Planilha (CSV)</span>
        </button>
      </div>

      {/* 4. TABELA DE LEADS (Layout Fiel ao Print do CRM) */}
      <div className="mt-4 bg-[#09090b] border border-white/10 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">
              <th className="py-3 px-4 w-10 text-center"></th>
              <th className="py-3 px-4">LEAD</th>
              <th className="py-3 px-4">OPORTUNIDADE</th>
              <th className="py-3 px-4">GOOGLE</th>
              <th className="py-3 px-4">SITE</th>
              <th className="py-3 px-4 text-right">CONTATOS RÁPIDOS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-xs font-sans">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-white/40 font-mono">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin text-cyan size-6" />
                    <span>Carregando leads raspados...</span>
                  </div>
                </td>
              </tr>
            ) : filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-white/40 font-mono">
                  Nenhum lead encontrado com os filtros atuais.
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => {
                const isSelected = selectedLeadIds.includes(lead.id);
                const isBookmarked = bookmarkedIds.includes(lead.id);
                const isCopied = copiedId === lead.id;
                const cleanPhone = (lead.telefone || "").replace(/\D/g, "");
                const mapsQuery = encodeURIComponent(`${lead.nome} ${lead.endereco || lead.cidade || ''}`);

                return (
                  <tr 
                    key={lead.id} 
                    className={`hover:bg-white/[0.02] transition-colors ${isSelected ? 'bg-white/[0.04]' : ''}`}
                  >
                    {/* Estrela / Favoritar */}
                    <td className="py-4 px-4 text-center">
                      <button 
                        onClick={() => handleToggleBookmark(lead.id)}
                        className="text-white/30 hover:text-amber-400 transition-colors"
                        title={isBookmarked ? "Remover dos favoritos" : "Favoritar lead"}
                      >
                        <Star 
                          size={15} 
                          fill={isBookmarked ? "#f59e0b" : "none"} 
                          className={isBookmarked ? "text-amber-400" : "text-white/30"} 
                        />
                      </button>
                    </td>

                    {/* LEAD: Foto + Nome + Cidade */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectLead(lead.id)}
                          className="accent-cyan cursor-pointer mr-1"
                        />
                        {lead.photoUrl ? (
                          <img 
                            src={lead.photoUrl} 
                            alt={lead.nome} 
                            className="size-10 rounded-lg object-cover border border-white/10 shrink-0" 
                          />
                        ) : (
                          <div className="size-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-serif text-sm font-semibold text-white/80 shrink-0">
                            {lead.nome?.charAt(0) || "L"}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-semibold text-white text-sm hover:text-cyan transition-colors truncate max-w-xs md:max-w-md">
                            {lead.nome}
                          </div>
                          <div className="text-white/40 text-xs font-mono mt-0.5 truncate">
                            {lead.cidade}
                          </div>
                          {/* Indicadores de assets gerados */}
                          {pendingLeads[lead.id] && (
                            <div className="mt-1.5 px-2 py-1.5 bg-amber-500/10 border border-amber-500/30 w-fit max-w-[240px] space-y-1">
                              <div className="flex items-center gap-1.5">
                                <Loader2 size={9} className="animate-spin shrink-0 text-amber-400" />
                                <span className="text-amber-400 font-mono text-[9px] truncate flex-1">
                                  {pendingMsg[lead.id] || "Gerando site..."}
                                </span>
                                <span className="text-amber-300 font-mono text-[9px] font-bold shrink-0">
                                  {pendingPct[lead.id] ?? 2}%
                                </span>
                              </div>
                              <div className="h-0.5 bg-amber-500/20 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-amber-400 rounded-full transition-all duration-[1500ms] ease-out"
                                  style={{ width: `${pendingPct[lead.id] ?? 2}%` }}
                                />
                              </div>
                            </div>
                          )}
                          {(lead.siteGerado || generatedSiteUrls[lead.id] || lead.diagnostico || analiseUrls[lead.id]) && (
                            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                              {(lead.siteGerado || generatedSiteUrls[lead.id]) && (
                                <>
                                  <a
                                    href={lead.siteGerado || generatedSiteUrls[lead.id]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-cyan/10 border border-cyan/30 text-cyan text-[10px] font-mono hover:bg-cyan/20 transition-colors"
                                    title="Ver site gerado"
                                  >
                                    <Globe size={9} />
                                    <span>Ver Site</span>
                                  </a>
                                  <button
                                    onClick={() => { setEmailModal({ lead }); setEmailInput(""); }}
                                    className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono hover:bg-emerald-500/20 transition-colors"
                                    title="Enviar proposta por email"
                                  >
                                    <span>✉ Enviar Proposta</span>
                                  </button>
                                </>
                              )}
                              {(lead.diagnostico || analiseUrls[lead.id]) && (
                                <a
                                  href={analiseUrls[lead.id] || `/api/gerar-analise/${lead.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-violet-500/10 border border-violet-500/30 text-violet-300 text-[10px] font-mono hover:bg-violet-500/20 transition-colors"
                                  title="Ver análise estratégica"
                                >
                                  <Download size={9} />
                                  <span>Ver Análise</span>
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* OPORTUNIDADE: Dot verde + Alta 95 */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] shrink-0" />
                        <span className="text-white font-medium">
                          {lead.oportunidade || "Alta"} · <span className="text-white/50">{lead.score || 91}</span>
                        </span>
                      </div>
                    </td>

                    {/* GOOGLE: Estrela + Rating + Avaliações */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-mono text-xs">
                        <span className="text-amber-400">★</span>
                        <span className="text-white font-semibold">{lead.rating || "4.5"}</span>
                        <span className="text-white/40 text-[11px]">
                          {(lead.reviewsCount || 100).toLocaleString()} aval.
                        </span>
                      </div>
                    </td>

                    {/* SITE: Badge Amarelo Sem Site ou Verde Com Site */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {lead.temSite ? (
                        <span className="inline-flex items-center px-2.5 py-1 text-[11px] font-mono text-emerald-300 bg-emerald-950/40 border border-emerald-800/60">
                          Com site
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 text-[11px] font-mono text-amber-300 bg-amber-950/40 border border-amber-800/60">
                          Sem site próprio
                        </span>
                      )}
                    </td>

                    {/* CONTATOS RÁPIDOS: Copiar, WhatsApp, Site, Maps */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-1.5 font-mono text-[11px]">
                        {/* Botão Copiar */}
                        <button
                          onClick={() => handleCopyPhone(lead)}
                          className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 flex items-center gap-1 transition-colors"
                          title="Copiar número de telefone"
                        >
                          {isCopied ? <Check size={12} className="text-emerald-400" /> : <Phone size={12} />}
                          <span>{isCopied ? "Copiado!" : "Copiar"}</span>
                        </button>

                        {/* Botão WhatsApp */}
                        {cleanPhone ? (
                          <a
                            href={`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(`Olá! Sou da ESCOM Studio. Vi o perfil da ${lead.nome} no Google e gostaria de conversar.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 bg-emerald-950/30 hover:bg-emerald-900/50 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 transition-colors"
                          >
                            <span>WhatsApp</span>
                          </a>
                        ) : null}

                        {/* Botão Site */}
                        {lead.siteUrl ? (
                          <a
                            href={lead.siteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 flex items-center gap-1 transition-colors"
                          >
                            <span>Site</span>
                            <ArrowUpRight size={10} className="text-white/40" />
                          </a>
                        ) : null}

                        {/* Botão Gerar Proposta */}
                        {generatingSiteId === lead.id ? (
                          <div className="flex flex-col gap-1 px-2.5 py-1.5 bg-cyan/5 border border-cyan/20 min-w-[140px]">
                            {/* Barra de progresso */}
                            <div className="relative h-0.5 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="absolute inset-y-0 left-0 bg-cyan transition-all duration-700 ease-in-out rounded-full"
                                style={{
                                  width: geracaoStep === "analise" ? "33%" : geracaoStep === "site" ? "66%" : geracaoStep === "pronto" ? "100%" : "5%",
                                  backgroundColor: geracaoStep === "pronto" ? "#34d399" : undefined,
                                }}
                              />
                            </div>
                            {/* Steps */}
                            <div className="flex items-center justify-between gap-1">
                              {(["analise", "site", "pronto"] as const).map((step, i) => {
                                const labels = ["Análise", "Site", "Pronto"];
                                const isActive = geracaoStep === step;
                                const isPast = (geracaoStep === "site" && i === 0) || (geracaoStep === "pronto" && i < 2);
                                const isDone = geracaoStep === "pronto";
                                return (
                                  <div key={step} className="flex items-center gap-0.5">
                                    <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                      isDone && i < 3 ? "bg-emerald-400" :
                                      isPast ? "bg-cyan/70" :
                                      isActive ? "bg-cyan animate-pulse" :
                                      "bg-white/20"
                                    }`} />
                                    <span className={`font-mono text-[9px] transition-colors duration-300 ${
                                      isDone ? "text-emerald-400" :
                                      isActive ? "text-cyan" :
                                      isPast ? "text-cyan/50" :
                                      "text-white/25"
                                    }`}>{labels[i]}</span>
                                  </div>
                                );
                              })}
                              <Loader2 size={8} className={`animate-spin ml-0.5 ${geracaoStep === "pronto" ? "text-emerald-400" : "text-cyan"}`} />
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleGerarProposta(lead)}
                            disabled={!!generatingSiteId}
                            className="px-2.5 py-1 bg-cyan/10 hover:bg-cyan/20 text-cyan border border-cyan/30 flex items-center gap-1 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Gerar análise + site via N8N"
                          >
                            <Sparkles size={11} />
                            <span>Proposta</span>
                          </button>
                        )}

                        {/* Botão Maps */}
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 flex items-center gap-1 transition-colors"
                        >
                          <span>Maps</span>
                        </a>

                        {/* Botão Instagram */}
                        {lead.instagram ? (
                          <a
                            href={`https://instagram.com/${lead.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 flex items-center gap-1 transition-colors"
                          >
                            <span>Instagram</span>
                          </a>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL ENVIAR PROPOSTA POR EMAIL */}
      {emailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setEmailModal(null)}>
          <div className="w-full max-w-md bg-[#09090b] border border-white/20 p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h2 className="font-serif text-xl font-light text-white">Enviar Proposta</h2>
                <p className="font-mono text-xs text-white/40 mt-0.5">{emailModal.lead.nome}</p>
              </div>
              <button onClick={() => setEmailModal(null)} className="text-white/40 hover:text-white text-xl leading-none">×</button>
            </div>
            <div className="space-y-2">
              <label className="font-mono text-xs text-white/50 uppercase tracking-widest">Email do destinatário</label>
              <input
                type="email"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleEnviarEmail()}
                placeholder="email@empresa.com.br"
                className="w-full bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-emerald-500/50"
                autoFocus
              />
            </div>
            <div className="text-xs text-white/30 space-y-1">
              <p>O email incluirá:</p>
              <ul className="list-disc list-inside space-y-0.5 text-white/25">
                <li>Link do site de demonstração</li>
                <li>Link da análise estratégica (PDF)</li>
                <li>Texto personalizado gerado por IA</li>
              </ul>
            </div>
            <button
              onClick={handleEnviarEmail}
              disabled={sendingEmail || !emailInput.trim()}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-mono text-sm font-bold transition-colors"
            >
              {sendingEmail ? "Enviando..." : "✉ Enviar Proposta"}
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE RASPAGEM / MINERADOR DE LEADS */}
      {showMineradorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-[#09090b] border border-white/20 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="font-serif text-2xl font-light text-white">Raspar Novos Leads</h2>
                <p className="font-mono text-xs text-white/40 mt-1 uppercase tracking-[0.1em]">
                  Extração automatizada no Google Maps & Redes
                </p>
              </div>
              <button 
                onClick={() => setShowMineradorModal(false)}
                className="text-white/40 hover:text-white p-1 font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div>
                <label className="block uppercase tracking-[0.1em] text-white/60 mb-2">Estado</label>
                <select
                  value={selectedEstado}
                  onChange={(e) => setSelectedEstado(e.target.value)}
                  className="w-full bg-[#000000] border border-white/15 px-3 py-2.5 text-white focus:border-cyan/50 focus:outline-none"
                >
                  {ESTADOS_LIST.map((uf) => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block uppercase tracking-[0.1em] text-white/60 mb-2">Cidade</label>
                <input
                  type="text"
                  value={selectedCidade}
                  onChange={(e) => setSelectedCidade(e.target.value)}
                  placeholder="Ex: São Paulo, Belo Horizonte, Recife..."
                  className="w-full bg-[#000000] border border-white/15 px-3 py-2.5 text-white placeholder-white/25 focus:border-cyan/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block uppercase tracking-[0.1em] text-white/60 mb-2">Categoria / Nicho</label>
                <select
                  value={selectedCategoria}
                  onChange={(e) => setSelectedCategoria(e.target.value)}
                  className="w-full bg-[#000000] border border-white/15 px-3 py-2.5 text-white focus:border-cyan/50 focus:outline-none"
                >
                  {CATEGORIAS_LIST.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="uppercase tracking-[0.1em] text-white/60">Limite de Leads</label>
                  <span className="text-cyan font-bold">{leadLimit} leads</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={leadLimit}
                  onChange={(e) => setLeadLimit(Number(e.target.value))}
                  className="w-full accent-cyan cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => setShowMineradorModal(false)}
                className="px-4 py-2 font-mono text-xs text-white/60 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleSearchLeads}
                disabled={loading}
                className="bg-[#00d1ff] hover:bg-[#00b8e6] text-black font-mono text-xs uppercase tracking-[0.12em] font-bold px-6 py-2.5 flex items-center gap-2 transition-all active:scale-95 shadow-[0_0_20px_rgba(0,209,255,0.35)] cursor-pointer"
              >
                {loading ? <Loader2 className="animate-spin size-4 text-black" /> : <Sparkles className="size-4 text-black" />}
                <span className="text-black font-bold">Iniciar Raspagem</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
