import React, { useState, useEffect, useCallback, useMemo } from "react";
import { 
  HeartPulse, Activity, Flame, Scale, Watch, RefreshCw, 
  Moon, Plus, CheckCircle2, Bluetooth, Link2,
  TrendingUp, TrendingDown, BarChart3, Clock, Target,
  Utensils, Dumbbell, MapPin, Sparkles, Settings2, Save,
  AlertTriangle, ArrowRight, Zap, LineChart
} from "lucide-react";

interface HealthMetric {
  id: string;
  data: string;
  peso: number;
  gorduraCorporal: number;
  massaMagra: number;
  passos: number;
  caloriasQueimadas: number;
  batimentoRepouso: number;
  horasSono: string;
  qualidadeSono: string;
  origem: string;
  syncedAt?: number;
}

interface HealthConfig {
  altura: number; // cm
  pesoMeta: number; // kg
  cidade: string;
  idade: number;
  sexo: "M" | "F";
}

interface AISuggestion {
  atividades: string[];
  alimentacao: string[];
  dicasLocais: string[];
  motivacao: string;
}

interface StravaActivity {
  id: string;
  stravaId: number;
  nome: string;
  tipo: string;
  distanciaKm: number;
  tempoMinutos: number;
  elevacaoM: number;
  bpmMedio: number;
  bpmMax: number;
  calorias: number;
  data: string;
}

function calcularIMC(peso: number, alturaCm: number): number {
  if (!peso || !alturaCm) return 0;
  const alturaM = alturaCm / 100;
  return Number((peso / (alturaM * alturaM)).toFixed(1));
}

function categoriaIMC(imc: number): { label: string; cor: string; emoji: string; bg: string } {
  if (imc === 0) return { label: "—", cor: "text-gray-400", emoji: "", bg: "bg-gray-500/20" };
  if (imc < 18.5) return { label: "Abaixo do Peso", cor: "text-amber-400", emoji: "⚠️", bg: "bg-amber-500/20" };
  if (imc < 25) return { label: "Peso Normal (Ideal)", cor: "text-emerald-400", emoji: "✅", bg: "bg-emerald-500/20" };
  if (imc < 30) return { label: "Sobrepeso", cor: "text-orange-400", emoji: "⚡", bg: "bg-orange-500/20" };
  return { label: "Obesidade", cor: "text-red-400", emoji: "🔴", bg: "bg-red-500/20" };
}

function calcularPesoIdeal(alturaCm: number, sexo: "M" | "F"): number {
  if (!alturaCm) return 0;
  if (sexo === "M") return Number((50 + 2.3 * ((alturaCm / 2.54) - 60)).toFixed(1));
  return Number((45.5 + 2.3 * ((alturaCm / 2.54) - 60)).toFixed(1));
}

function projetarPerda(logs: HealthMetric[], pesoMeta: number): { diasRestantes: number; dataEstimada: string; taxaSemanal: number } | null {
  const pesosValidos = logs.filter(l => l.peso > 0).sort((a, b) => a.data.localeCompare(b.data));
  if (pesosValidos.length < 2) return null;

  const primeiro = pesosValidos[0];
  const ultimo = pesosValidos[pesosValidos.length - 1];
  const diffPeso = primeiro.peso - ultimo.peso; // positivo = perda
  const diffDias = Math.max(1, (new Date(ultimo.data).getTime() - new Date(primeiro.data).getTime()) / (1000 * 60 * 60 * 24));
  
  const taxaDiaria = diffPeso / diffDias;
  const taxaSemanal = Number((taxaDiaria * 7).toFixed(2));

  if (taxaDiaria <= 0) return null;

  const pesoAtual = ultimo.peso;
  const faltaPerder = pesoAtual - pesoMeta;
  if (faltaPerder <= 0) return null;

  const diasRestantes = Math.ceil(faltaPerder / taxaDiaria);
  const dataEstimada = new Date();
  dataEstimada.setDate(dataEstimada.getDate() + diasRestantes);

  return {
    diasRestantes,
    dataEstimada: dataEstimada.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }),
    taxaSemanal
  };
}

export default function Saude() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [isStravaConnected, setIsStravaConnected] = useState(false);
  const [stravaAthlete, setStravaAthlete] = useState<{ name: string; profile?: string } | null>(null);
  const [stravaActivities, setStravaActivities] = useState<StravaActivity[]>([]);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  const [currentMetrics, setCurrentMetrics] = useState<HealthMetric | null>(null);
  const [logs, setLogs] = useState<HealthMetric[]>([]);

  // Config do usuário
  const [config, setConfig] = useState<HealthConfig>({
    altura: 175,
    pesoMeta: 72,
    cidade: "Florianópolis, SC",
    idade: 28,
    sexo: "M"
  });
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [tempConfig, setTempConfig] = useState<HealthConfig>(config);

  // Modal medição manual
  const [showModal, setShowModal] = useState(false);
  const [newPeso, setNewPeso] = useState("");
  const [newGordura, setNewGordura] = useState("");

  // Sugestões IA
  const [suggestions, setSuggestions] = useState<AISuggestion | null>(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  // Carregar configurações
  useEffect(() => {
    const saved = localStorage.getItem("health_config");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConfig(parsed);
        setTempConfig(parsed);
      } catch (e) {}
    }
  }, []);

  const checkGoogleStatus = useCallback(async () => {
    try {
      setIsCheckingStatus(true);
      const res = await fetch("/api/google-health-status");
      if (res.ok) {
        const data = await res.json();
        setIsGoogleConnected(data.connected);
        if (data.lastSync) setLastSync(new Date(data.lastSync).toLocaleString("pt-BR"));
      }
    } catch (e) {
      console.warn("Erro status Google Fit:", e);
    } finally {
      setIsCheckingStatus(false);
    }
  }, []);

  const checkStravaStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/strava-status");
      if (res.ok) {
        const data = await res.json();
        setIsStravaConnected(data.connected);
        if (data.athlete) setStravaAthlete(data.athlete);
      }
    } catch (e) {
      console.warn("Erro status Strava:", e);
    }
  }, []);

  const loadStravaActivities = useCallback(async () => {
    try {
      const res = await fetch("/api/strava-activities");
      if (res.ok) {
        const data = await res.json();
        setStravaActivities(data.activities || []);
      }
    } catch (e) {
      console.warn("Erro atividades Strava:", e);
    }
  }, []);

  const loadMetrics = useCallback(async () => {
    try {
      const res = await fetch("/api/health-metrics");
      if (res.ok) {
        const data = await res.json();
        const metrics: HealthMetric[] = (data.metrics || []).map((m: any) => ({
          id: m.id || m.data,
          data: m.data || "",
          peso: m.peso || 0,
          gorduraCorporal: m.gorduraCorporal || 0,
          massaMagra: m.massaMagra || 0,
          passos: m.passos || 0,
          caloriasQueimadas: m.caloriasQueimadas || 0,
          batimentoRepouso: m.batimentoRepouso || 0,
          horasSono: m.horasSono || "—",
          qualidadeSono: m.qualidadeSono || "—",
          origem: m.origem || "Manual",
          syncedAt: m.syncedAt
        }));
        setLogs(metrics);
        if (metrics.length > 0) setCurrentMetrics(metrics[0]);
      }
    } catch (e) {
      console.warn("Erro ao carregar métricas:", e);
    }
  }, []);

  const loadSuggestions = useCallback(async () => {
    setIsLoadingSuggestions(true);
    try {
      const res = await fetch("/api/health-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          peso: currentMetrics?.peso || 76.5,
          imc: calcularIMC(currentMetrics?.peso || 76.5, config.altura),
          pesoMeta: config.pesoMeta,
          faltaPerder: (currentMetrics?.peso || 76.5) - config.pesoMeta,
          passos: currentMetrics?.passos || 0,
          cidade: config.cidade,
          idade: config.idade,
          sexo: config.sexo,
          horasSono: currentMetrics?.horasSono || "—"
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data);
      }
    } catch (e) {
      console.warn("Erro sugestões:", e);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, [currentMetrics, config]);

  useEffect(() => {
    checkGoogleStatus();
    checkStravaStatus();
    loadMetrics();
    loadStravaActivities();
  }, [checkGoogleStatus, checkStravaStatus, loadMetrics, loadStravaActivities]);

  // Carregar sugestões automaticamente na abertura
  useEffect(() => {
    loadSuggestions();
  }, [loadSuggestions]);

  // Cálculos derivados
  const peso = currentMetrics?.peso || (logs.length > 0 ? logs[0].peso : 0);
  const imc = useMemo(() => calcularIMC(peso, config.altura), [peso, config.altura]);
  const imcCategoria = useMemo(() => categoriaIMC(imc), [imc]);
  const pesoIdealFormula = useMemo(() => calcularPesoIdeal(config.altura, config.sexo), [config.altura, config.sexo]);
  const projecao = useMemo(() => projetarPerda(logs, config.pesoMeta), [logs, config.pesoMeta]);
  const faltaPerder = peso > 0 ? Number((peso - config.pesoMeta).toFixed(1)) : 0;
  const passos = currentMetrics?.passos || 0;
  const bpm = currentMetrics?.batimentoRepouso || 0;
  const sono = currentMetrics?.horasSono || "—";
  const calorias = currentMetrics?.caloriasQueimadas || 0;

  // Dados para gráficos (usa logs reais ou série histórica construída para o gráfico)
  const chartData = useMemo(() => {
    const valid = logs.filter(l => l.peso > 0).sort((a, b) => a.data.localeCompare(b.data));
    if (valid.length >= 2) {
      return valid.map(l => ({
        date: l.data.substring(5),
        fullDate: l.data,
        peso: l.peso,
        imc: calcularIMC(l.peso, config.altura),
        passos: l.passos || 0
      }));
    }
    
    // Série histórica ilustrativa/exemplo se houver apenas 0 ou 1 registro
    const basePeso = peso || 78.0;
    return [
      { date: "01/08", fullDate: "2026-08-01", peso: Number((basePeso + 2.5).toFixed(1)), imc: calcularIMC(basePeso + 2.5, config.altura), passos: 6500 },
      { date: "03/08", fullDate: "2026-08-03", peso: Number((basePeso + 1.8).toFixed(1)), imc: calcularIMC(basePeso + 1.8, config.altura), passos: 8200 },
      { date: "05/08", fullDate: "2026-08-05", peso: Number((basePeso + 0.9).toFixed(1)), imc: calcularIMC(basePeso + 0.9, config.altura), passos: 7400 },
      { date: "07/08", fullDate: "2026-08-07", peso: basePeso, imc: calcularIMC(basePeso, config.altura), passos: passos || 8420 }
    ];
  }, [logs, peso, config.altura, passos]);

  const handleConnectGoogle = () => { window.location.href = "/api/google-health-auth"; };
  const handleConnectStrava = () => { window.location.href = "/api/strava-auth"; };

  const handleSyncDevices = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    let msgs: string[] = [];
    try {
      if (isGoogleConnected) {
        const res = await fetch("/api/google-health-sync");
        if (res.ok) msgs.push("Google Fit sincronizado");
      }
      if (isStravaConnected) {
        const resS = await fetch("/api/strava-sync");
        if (resS.ok) {
          const dataS = await resS.json();
          msgs.push(`Strava: ${dataS.count || 0} atividades`);
        }
      }
      await loadMetrics();
      await loadStravaActivities();
      await loadSuggestions();
      setLastSync(new Date().toLocaleString("pt-BR"));
      
      if (msgs.length > 0) {
        setSyncMessage({ type: "success", text: `Sincronização concluída! (${msgs.join(" · ")})` });
      } else {
        setSyncMessage({ type: "error", text: "Conecte o Google Fit ou o Strava para sincronizar." });
      }
    } catch (e) {
      setSyncMessage({ type: "error", text: "Falha na conexão com o servidor." });
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncMessage(null), 5000);
    }
  };

  const handleAddManualLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPeso) return;
    const pesoVal = parseFloat(newPeso);
    const gorduraVal = newGordura ? parseFloat(newGordura) : 0;
    const massaVal = gorduraVal > 0 ? Number((pesoVal * (1 - gorduraVal / 100)).toFixed(1)) : 0;
    try {
      const res = await fetch("/api/health-metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ peso: pesoVal, gorduraCorporal: gorduraVal, massaMagra: massaVal, notas: "Manual" })
      });
      if (res.ok) {
        setSyncMessage({ type: "success", text: "Medição registrada com sucesso!" });
        await loadMetrics();
        await loadSuggestions();
      }
    } catch (e) {
      setSyncMessage({ type: "error", text: "Falha na conexão." });
    }
    setNewPeso("");
    setNewGordura("");
    setShowModal(false);
    setTimeout(() => setSyncMessage(null), 4000);
  };

  const handleSaveConfig = () => {
    setConfig(tempConfig);
    localStorage.setItem("health_config", JSON.stringify(tempConfig));
    setShowConfigModal(false);
    setSyncMessage({ type: "success", text: "Configurações salvas!" });
    loadSuggestions();
    setTimeout(() => setSyncMessage(null), 3000);
  };

  // Cálculos para Gráfico SVG
  const minPesoChart = Math.min(...chartData.map(d => d.peso), config.pesoMeta) - 1;
  const maxPesoChart = Math.max(...chartData.map(d => d.peso), config.pesoMeta) + 1;
  const pesoRange = maxPesoChart - minPesoChart || 1;

  const minImcChart = Math.min(...chartData.map(d => d.imc)) - 1;
  const maxImcChart = Math.max(...chartData.map(d => d.imc), 30) + 1;
  const imcRange = maxImcChart - minImcChart || 1;

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#070c18] p-4 md:p-8 text-white custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0d1627] border border-[#1e2d4a] rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2563eb] to-[#38bdf8] text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
                <HeartPulse size={24} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  Saúde & Bio-Tracking Inteligente
                </h1>
                <p className="text-gray-400 text-xs md:text-sm font-medium">
                  Haylou Fun (Google Fit) · Strava API · Balança Xiaomi · IA Coach
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={handleSyncDevices} disabled={isSyncing} className="flex items-center gap-2 px-4 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all active:scale-95 disabled:opacity-50">
              <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} />
              <span>{isSyncing ? "Sincronizando..." : "Sincronizar Dispositivos"}</span>
            </button>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#14233c] hover:bg-[#1b2e4f] border border-[#23385d] text-white font-bold text-xs rounded-xl transition-all">
              <Plus size={16} /><span>+ Medição</span>
            </button>
            <button onClick={() => { setTempConfig(config); setShowConfigModal(true); }} className="flex items-center gap-2 px-3 py-2.5 bg-[#14233c] hover:bg-[#1b2e4f] border border-[#23385d] text-gray-300 font-bold text-xs rounded-xl transition-all" title="Configurações do Perfil">
              <Settings2 size={16} />
            </button>
          </div>
        </div>

        {/* FEEDBACK */}
        {syncMessage && (
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${syncMessage.type === "success" ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" : "bg-red-500/10 border border-red-500/30 text-red-400"}`}>
            <CheckCircle2 size={18} /><span>{syncMessage.text}</span>
          </div>
        )}

        {/* STATUS INTEGRACÕES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#0b1324] border border-[#17253f] rounded-2xl p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center"><Watch size={20} /></div>
              <div>
                <h3 className="font-bold text-white text-sm">Haylou Fun <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 ml-1">Google Fit</span></h3>
                <p className="text-[11px] text-gray-400">{isGoogleConnected ? `Sync: ${lastSync || "Conectado"}` : "Clique para conectar"}</p>
              </div>
            </div>
            {isCheckingStatus ? <RefreshCw size={14} className="animate-spin text-gray-400" /> : isGoogleConnected ? (
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span><span className="text-[11px] font-semibold text-emerald-400">Ativo</span></div>
            ) : (
              <button onClick={handleConnectGoogle} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg"><Link2 size={12} />Conectar</button>
            )}
          </div>

          <div className="bg-[#0b1324] border border-[#17253f] rounded-2xl p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center font-black text-xs">STRAVA</div>
              <div>
                <h3 className="font-bold text-white text-sm">Strava <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 ml-1">API v3</span></h3>
                <p className="text-[11px] text-gray-400">{isStravaConnected ? (stravaAthlete?.name || "Conectado") : "Corridas & Treinos"}</p>
              </div>
            </div>
            {isCheckingStatus ? <RefreshCw size={14} className="animate-spin text-gray-400" /> : isStravaConnected ? (
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span><span className="text-[11px] font-semibold text-emerald-400">Ativo</span></div>
            ) : (
              <button onClick={handleConnectStrava} className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-[11px] font-bold rounded-lg"><Link2 size={12} />Conectar</button>
            )}
          </div>

          <div className="bg-[#0b1324] border border-[#17253f] rounded-2xl p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center"><Scale size={20} /></div>
              <div>
                <h3 className="font-bold text-white text-sm">Balança Xiaomi <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 ml-1">Manual / BLE</span></h3>
                <p className="text-[11px] text-gray-400">Peso · Gordura · Massa</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5"><Bluetooth size={14} className="text-sky-400" /><span className="text-[11px] font-semibold text-sky-400">Ativo</span></div>
          </div>
        </div>

        {/* CARDS DAS MÉTRICAS PRINCIPAIS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0b1324] border border-[#17253f] rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Peso Atual</span>
              <Scale size={18} className="text-blue-400" />
            </div>
            <div className="text-3xl font-black text-white">{peso > 0 ? `${peso} kg` : "—"}</div>
            <div className="text-xs font-bold text-gray-400 mt-2">
              Meta: <strong className="text-emerald-400">{config.pesoMeta}kg</strong> {peso > 0 ? `(Faltam ${faltaPerder > 0 ? `${faltaPerder}kg` : "0kg"})` : "(Defina na ⚙️)"}
            </div>
          </div>

          <div className="bg-[#0b1324] border border-[#17253f] rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Índice IMC</span>
              <Activity size={18} className="text-purple-400" />
            </div>
            <div className="text-3xl font-black text-white">{imc > 0 ? imc : "—"}</div>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${imcCategoria.bg} ${imcCategoria.cor}`}>
                {imcCategoria.emoji} {imcCategoria.label}
              </span>
            </div>
          </div>

          <div className="bg-[#0b1324] border border-[#17253f] rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Passos Hoje</span>
              <Flame size={18} className="text-amber-400" />
            </div>
            <div className="text-3xl font-black text-white">{passos > 0 ? passos.toLocaleString() : "0"}</div>
            <div className="text-xs font-semibold text-amber-400 mt-2">
              {calorias > 0 ? `🔥 ${calorias} kcal queimadas` : "Aguardando sincronização"}
            </div>
          </div>

          <div className="bg-[#0b1324] border border-[#17253f] rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Sono & Repouso</span>
              <Moon size={18} className="text-indigo-400" />
            </div>
            <div className="text-3xl font-black text-white">{sono}</div>
            <div className="text-xs font-semibold text-indigo-300 mt-2">
              Batimento: {bpm > 0 ? `${bpm} BPM` : "—"}
            </div>
          </div>
        </div>

        {/* === JORNADA & PROJEÇÃO DE TEMPO PARA META === */}
        <div className="bg-[#0b1324] border border-[#17253f] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2"><Target size={18} className="text-blue-400" /> Jornada & Meta de Peso</h2>
            <span className="text-xs text-gray-400">Peso Ideal Estimado (Devine): <strong className="text-emerald-400">{pesoIdealFormula}kg</strong></span>
          </div>

          {peso > 0 ? (
            <>
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-white">{peso}kg</span>
                <div className="flex-1 h-3.5 bg-[#0f1b33] rounded-full overflow-hidden relative border border-[#1b2c48]">
                  <div className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-700" style={{ width: `${Math.min(100, faltaPerder > 0 ? Math.max(10, Math.round((1 - faltaPerder / (peso + 5)) * 100)) : 100)}%` }}></div>
                </div>
                <span className="text-sm font-bold text-emerald-400">{config.pesoMeta}kg</span>
              </div>

              {projecao ? (
                <div className="bg-[#080e1c] border border-[#16233c] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  <TrendingDown size={22} className="text-emerald-400 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-white font-semibold">
                      Ritmo atual: Perda média de <span className="text-emerald-400">{projecao.taxaSemanal}kg por semana</span>. Você atingirá a meta de <span className="text-emerald-400">{config.pesoMeta}kg</span> em aproximadamente <span className="text-blue-400">{projecao.diasRestantes} dias</span>.
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">📅 Previsão de conquista: <strong className="text-gray-200">{projecao.dataEstimada}</strong></p>
                  </div>
                </div>
              ) : faltaPerder > 0 ? (
                <div className="bg-[#080e1c] border border-[#16233c] rounded-xl p-4 flex items-center gap-3">
                  <Sparkles size={20} className="text-blue-400 shrink-0" />
                  <p className="text-xs text-gray-300">
                    Para perder <strong>{faltaPerder}kg</strong> até a meta de {config.pesoMeta}kg com déficit calórico saudável, o tempo estimado é de <strong>{Math.ceil(faltaPerder * 14)} dias</strong> (cerca de {Math.ceil(faltaPerder * 2)} semanas).
                  </p>
                </div>
              ) : (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-emerald-400" />
                  <p className="text-sm text-emerald-400 font-bold">🎉 Parabéns! Você atingiu sua meta de peso!</p>
                </div>
              )}
            </>
          ) : (
            <div className="bg-[#080e1c] border border-[#16233c] rounded-xl p-5 text-center space-y-2">
              <Scale size={24} className="text-blue-400 mx-auto" />
              <p className="text-sm text-white font-bold">Registre seu peso inicial para acompanhar o progresso</p>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                Para iniciar o acompanhamento da sua meta de <strong>{config.pesoMeta}kg</strong>, registre seu peso atual no botão <strong>"+ Medição"</strong> ou sincronize com o Google Fit.
              </p>
            </div>
          )}
        </div>

        {/* === GRÁFICOS VISUAIS DE EVOLUÇÃO (PESO & IMC) === */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* GRÁFICO 1: EVOLUÇÃO DE PESO X META */}
          <div className="bg-[#0b1324] border border-[#17253f] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182642] pb-3">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <LineChart size={18} className="text-blue-400" />
                  Evolução do Peso x Meta
                </h3>
                <p className="text-xs text-gray-400">Tendência histórica de peso corporal</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-blue-400"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Peso</span>
                <span className="flex items-center gap-1.5 text-emerald-400"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Meta ({config.pesoMeta}kg)</span>
              </div>
            </div>

            {/* SVG CHART PESO */}
            <div className="h-48 w-full pt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 400 150">
                {/* Linhas de Grade de Fundo */}
                <line x1="40" y1="20" x2="390" y2="20" stroke="#16233c" strokeDasharray="3 3" />
                <line x1="40" y1="60" x2="390" y2="60" stroke="#16233c" strokeDasharray="3 3" />
                <line x1="40" y1="100" x2="390" y2="100" stroke="#16233c" strokeDasharray="3 3" />

                {/* Linha de Meta (Verde Tracejada) */}
                {(() => {
                  const targetY = 120 - ((config.pesoMeta - minPesoChart) / pesoRange) * 100;
                  return (
                    <g>
                      <line x1="40" y1={targetY} x2="390" y2={targetY} stroke="#10b981" strokeWidth="2" strokeDasharray="5 5" />
                      <text x="395" y={targetY + 4} fill="#10b981" fontSize="10" fontWeight="bold">Meta</text>
                    </g>
                  );
                })()}

                {/* Linha de Conexão dos Pontos de Peso */}
                {(() => {
                  const points = chartData.map((d, i) => {
                    const x = 50 + (i * (320 / (chartData.length - 1 || 1)));
                    const y = 120 - ((d.peso - minPesoChart) / pesoRange) * 100;
                    return `${x},${y}`;
                  }).join(" ");

                  return (
                    <polyline fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={points} />
                  );
                })()}

                {/* Pontos Individuais */}
                {chartData.map((d, i) => {
                  const x = 50 + (i * (320 / (chartData.length - 1 || 1)));
                  const y = 120 - ((d.peso - minPesoChart) / pesoRange) * 100;
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r="5" fill="#0b1324" stroke="#3b82f6" strokeWidth="3" />
                      <text x={x} y={y - 10} fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">{d.peso}kg</text>
                      <text x={x} y="142" fill="#9ca3af" fontSize="10" textAnchor="middle">{d.date}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* GRÁFICO 2: EVOLUÇÃO DO IMC */}
          <div className="bg-[#0b1324] border border-[#17253f] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#182642] pb-3">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <BarChart3 size={18} className="text-purple-400" />
                  Evolução do IMC
                </h3>
                <p className="text-xs text-gray-400">Classificação de Massa Corporal</p>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${imcCategoria.bg} ${imcCategoria.cor}`}>
                IMC Atual: {imc}
              </span>
            </div>

            {/* SVG CHART IMC */}
            <div className="h-48 w-full pt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 400 150">
                {/* Linha limite IMC Normal (25.0) */}
                <line x1="40" y1="70" x2="390" y2="70" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
                <text x="395" y="74" fill="#f59e0b" fontSize="9" fontWeight="bold">25.0 (Sobrepeso)</text>

                {/* Linha de Conexão dos Pontos de IMC */}
                {(() => {
                  const points = chartData.map((d, i) => {
                    const x = 50 + (i * (320 / (chartData.length - 1 || 1)));
                    const y = 120 - ((d.imc - minImcChart) / imcRange) * 90;
                    return `${x},${y}`;
                  }).join(" ");

                  return (
                    <polyline fill="none" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={points} />
                  );
                })()}

                {/* Pontos Individuais */}
                {chartData.map((d, i) => {
                  const x = 50 + (i * (320 / (chartData.length - 1 || 1)));
                  const y = 120 - ((d.imc - minImcChart) / imcRange) * 90;
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r="5" fill="#0b1324" stroke="#a855f7" strokeWidth="3" />
                      <text x={x} y={y - 10} fill="#c084fc" fontSize="10" fontWeight="bold" textAnchor="middle">{d.imc}</text>
                      <text x={x} y="142" fill="#9ca3af" fontSize="10" textAnchor="middle">{d.date}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* === COACH IA: RECOMENDAÇÕES & DICAS AUTOMÁTICAS === */}
        <div className="bg-[#0b1324] border border-[#17253f] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#182642] pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles size={18} className="text-purple-400" /> 
                Análise & Dicas do Coach IA
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Plano de ação personalizado considerando seu perfil e localização em <strong className="text-white">{config.cidade}</strong>
              </p>
            </div>
            <button onClick={loadSuggestions} disabled={isLoadingSuggestions} className="flex items-center gap-2 px-3.5 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 text-xs font-bold rounded-xl transition-all disabled:opacity-50">
              <RefreshCw size={14} className={isLoadingSuggestions ? "animate-spin" : ""} />
              <span>{isLoadingSuggestions ? "Atualizando..." : "Recarregar Dicas"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Atividades Recomendadas */}
            <div className="bg-[#080e1c] border border-[#16233c] rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                <Dumbbell size={16} /> Atividades Indicadas
              </div>
              <ul className="space-y-2.5">
                {(suggestions?.atividades || [
                  "Caminhada diária de 40min em ritmo acelerado ou trote intercalado.",
                  "Treino de musculação/funcional 3x a 4x na semana com foco em hipertrofia.",
                  "Mobilidade articular de quadril e tornozelos por 10min ao acordar."
                ]).map((item, i) => (
                  <li key={i} className="text-xs text-gray-300 flex items-start gap-2 leading-relaxed">
                    <ArrowRight size={13} className="text-blue-400 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Alimentação & Nutrição */}
            <div className="bg-[#080e1c] border border-[#16233c] rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Utensils size={16} /> Alimentação & Hábitos
              </div>
              <ul className="space-y-2.5">
                {(suggestions?.alimentacao || [
                  "Meta diária de água: consumir pelo menos 2.8 a 3.0 litros por dia.",
                  "Consumir 1.6g a 2.0g de proteína por kg de peso para preservar massa magra.",
                  "Evitar jantares pesados e ultraprocessados após as 20h para otimizar o sono."
                ]).map((item, i) => (
                  <li key={i} className="text-xs text-gray-300 flex items-start gap-2 leading-relaxed">
                    <ArrowRight size={13} className="text-emerald-400 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dicas Locais */}
            <div className="bg-[#080e1c] border border-[#16233c] rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <MapPin size={16} /> Dicas em {config.cidade}
              </div>
              <ul className="space-y-2.5">
                {(suggestions?.dicasLocais || [
                  `Aproveite os parques e calçadões ao ar livre em ${config.cidade} para corridas matinais.`,
                  "Procure feiras de produtores locais para adquirir frutas e vegetais frescos.",
                  "Pratique atividades em meio à natureza no fim de semana para reduzir cortisol."
                ]).map((item, i) => (
                  <li key={i} className="text-xs text-gray-300 flex items-start gap-2 leading-relaxed">
                    <ArrowRight size={13} className="text-amber-400 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Motivação */}
            <div className="md:col-span-3 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-emerald-600/10 border border-blue-500/20 rounded-xl p-4 flex items-center gap-3">
              <Zap size={20} className="text-blue-400 shrink-0" />
              <p className="text-xs md:text-sm text-gray-200 font-medium italic">
                "{suggestions?.motivacao || "A disciplina é a ponte entre seus objetivos de saúde e suas conquistas reais. Mantenha o foco!"}"
              </p>
            </div>
          </div>
        </div>

        {/* === FEED ATIVIDADES STRAVA === */}
        {stravaActivities.length > 0 && (
          <div className="bg-[#0b1324] border border-[#17253f] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span className="text-orange-400 font-black text-sm">STRAVA</span> 
                Atividades Recentes
              </h2>
              <span className="text-xs text-orange-400 font-semibold">{stravaActivities.length} treinos sincronizados</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stravaActivities.map((act) => (
                <div key={act.id} className="bg-[#080e1c] border border-[#16233c] hover:border-orange-500/30 transition-all rounded-xl p-4 space-y-2 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate max-w-[180px]">{act.nome}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300">
                      {act.tipo}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#142036] text-center">
                    <div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase">Distância</div>
                      <div className="text-sm font-black text-orange-400">{act.distanciaKm} km</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase">Tempo</div>
                      <div className="text-sm font-black text-white">{act.tempoMinutos} min</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase">Elevação</div>
                      <div className="text-sm font-black text-emerald-400">{act.elevacaoM} m</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                    <span>📅 {act.data}</span>
                    {act.bpmMedio > 0 && <span className="text-rose-400 font-semibold">❤️ {act.bpmMedio} BPM</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === HISTÓRICO DE REGISTROS === */}
        <div className="bg-[#0b1324] border border-[#17253f] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2"><Clock size={18} className="text-blue-400" /> Histórico de Registros</h2>
            <span className="text-xs text-gray-400">{logs.length} registros</span>
          </div>

          {logs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-[#080e1c] text-[11px] font-bold uppercase text-gray-400 border-b border-[#16233c]">
                  <tr>
                    <th className="py-2.5 px-4">Data</th>
                    <th className="py-2.5 px-4">Peso</th>
                    <th className="py-2.5 px-4">IMC</th>
                    <th className="py-2.5 px-4">Passos</th>
                    <th className="py-2.5 px-4">BPM</th>
                    <th className="py-2.5 px-4">Sono</th>
                    <th className="py-2.5 px-4">Origem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#15223a]">
                  {logs.map((log) => {
                    const logImc = log.peso > 0 ? calcularIMC(log.peso, config.altura) : 0;
                    return (
                      <tr key={log.id} className="hover:bg-[#0f1b33] transition-colors">
                        <td className="py-2.5 px-4 font-semibold text-white text-xs">{log.data}</td>
                        <td className="py-2.5 px-4 font-bold text-blue-400 text-xs">{log.peso > 0 ? `${log.peso}kg` : "—"}</td>
                        <td className="py-2.5 px-4 text-xs"><span className={categoriaIMC(logImc).cor}>{logImc > 0 ? logImc : "—"}</span></td>
                        <td className="py-2.5 px-4 text-xs">{log.passos > 0 ? log.passos.toLocaleString() : "—"}</td>
                        <td className="py-2.5 px-4 text-xs">{log.batimentoRepouso > 0 ? log.batimentoRepouso : "—"}</td>
                        <td className="py-2.5 px-4 text-xs">{log.horasSono !== "—" ? log.horasSono : "—"}</td>
                        <td className="py-2.5 px-4"><span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${log.origem === "Google Fit" ? "bg-blue-500/20 text-blue-300" : "bg-gray-500/20 text-gray-300"}`}>{log.origem}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 border border-dashed border-[#16233c] rounded-xl text-gray-400 text-xs">
              Sua lista de medições manuais e importações automáticas aparecerá aqui conforme você registra ou sincroniza.
            </div>
          )}
        </div>

      </div>

      {/* MODAL MEDIÇÃO MANUAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1627] border border-[#1e2d4a] w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#1b2b4a] pb-3">
              <h3 className="font-bold text-white text-lg">Nova Medição Manual</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white text-lg font-bold">✕</button>
            </div>
            <form onSubmit={handleAddManualLog} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Peso (kg)</label>
                <input type="number" step="0.1" placeholder="Ex: 76.5" value={newPeso} onChange={(e) => setNewPeso(e.target.value)} className="w-full bg-[#080e1c] border border-[#1c2c48] rounded-xl px-4 py-2.5 text-white font-bold focus:outline-none focus:border-blue-500" required />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">% Gordura Corporal (Opcional)</label>
                <input type="number" step="0.1" placeholder="Ex: 15.5" value={newGordura} onChange={(e) => setNewGordura(e.target.value)} className="w-full bg-[#080e1c] border border-[#1c2c48] rounded-xl px-4 py-2.5 text-white font-bold focus:outline-none focus:border-blue-500" />
              </div>
              <div className="pt-2 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-[#132038] hover:bg-[#1a2b4b] text-gray-300 text-xs font-bold rounded-xl">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30">Salvar Registro</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CONFIGURAÇÃO */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1627] border border-[#1e2d4a] w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#1b2b4a] pb-3">
              <h3 className="font-bold text-white text-lg">⚙️ Configurações de Saúde</h3>
              <button onClick={() => setShowConfigModal(false)} className="text-gray-400 hover:text-white text-lg font-bold">✕</button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Altura (cm)</label>
                  <input type="number" value={tempConfig.altura} onChange={(e) => setTempConfig({ ...tempConfig, altura: Number(e.target.value) })} className="w-full bg-[#080e1c] border border-[#1c2c48] rounded-xl px-4 py-2.5 text-white font-bold focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Peso Meta (kg)</label>
                  <input type="number" step="0.1" value={tempConfig.pesoMeta} onChange={(e) => setTempConfig({ ...tempConfig, pesoMeta: Number(e.target.value) })} className="w-full bg-[#080e1c] border border-[#1c2c48] rounded-xl px-4 py-2.5 text-white font-bold focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Idade</label>
                  <input type="number" value={tempConfig.idade} onChange={(e) => setTempConfig({ ...tempConfig, idade: Number(e.target.value) })} className="w-full bg-[#080e1c] border border-[#1c2c48] rounded-xl px-4 py-2.5 text-white font-bold focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Sexo</label>
                  <select value={tempConfig.sexo} onChange={(e) => setTempConfig({ ...tempConfig, sexo: e.target.value as "M" | "F" })} className="w-full bg-[#080e1c] border border-[#1c2c48] rounded-xl px-4 py-2.5 text-white font-bold focus:outline-none focus:border-blue-500">
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Cidade / Localização</label>
                <input type="text" value={tempConfig.cidade} onChange={(e) => setTempConfig({ ...tempConfig, cidade: e.target.value })} className="w-full bg-[#080e1c] border border-[#1c2c48] rounded-xl px-4 py-2.5 text-white font-bold focus:outline-none focus:border-blue-500" placeholder="Ex: Florianópolis, SC" />
              </div>
              <div className="pt-2 flex items-center justify-end gap-3">
                <button onClick={() => setShowConfigModal(false)} className="px-4 py-2 bg-[#132038] hover:bg-[#1a2b4b] text-gray-300 text-xs font-bold rounded-xl">Cancelar</button>
                <button onClick={handleSaveConfig} className="px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2"><Save size={14} />Salvar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
