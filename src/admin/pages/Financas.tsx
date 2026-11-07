import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Header } from "../components/Header";
import {
  Plus, Trash2, RefreshCw, Lightbulb, ArrowUpRight, ArrowDownRight, PieChart as PieChartIcon, CreditCard,
  Pencil, Wallet, Search, BarChart2, Inbox, X, ChevronLeft, ChevronRight, Check, Clock, Repeat, Layers, AlertCircle, DownloadCloud,
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import { db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  type Lancamento, type Cartao, valorBR, mesAtual, somarMeses, rotuloMesLongo, ocorrenciasDoMes, resumoDoMes,
  serieMeses, usoDoCartao, faturaAte, dividirParcelas,
} from "../lib/financas";

// Controle financeiro: dados no Supabase (/api/financas). As regras de mês, recorrência, parcelas e cartão
// estão em ../lib/financas.ts (com testes). Esta tela só mostra e envia.

interface DailyTip { id: number; title: string; description: string; category: string; priority: "alta" | "media" | "baixa"; impact: string; }

const CATEGORIES = [
  "Clientes & Contratos", "Infraestrutura & Servidores", "Software & Ferramentas SaaS", "Marketing & Anúncios",
  "Pessoal & Pró-labore", "Impostos & Taxas", "Equipamentos & Compras", "Outros",
];
const CORES_CARTAO = [
  "from-[#2563eb] via-[#1d4ed8] to-[#1e3a8a]", "from-[#7c3aed] via-[#6d28d9] to-[#4c1d95]",
  "from-[#0f172a] via-[#1e293b] to-[#334155]", "from-[#059669] via-[#047857] to-[#064e3b]", "from-[#e11d48] via-[#be123c] to-[#881337]",
];
const brl = (n: number) => { const v = Number(n) || 0; return (v < 0 ? "− R$ " : "R$ ") + Math.abs(v).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
const hojeISO = () => new Date().toISOString().slice(0, 10);
const dataBR = (d: string) => d ? d.slice(8, 10) + "/" + d.slice(5, 7) + "/" + d.slice(0, 4) : "";

type Filtro = "all" | "income" | "expense" | "recurring" | "pending";

async function chamar(metodo: string, url: string, corpo?: unknown) {
  const r = await fetch(url, { method: metodo, headers: { "Content-Type": "application/json" }, body: corpo ? JSON.stringify(corpo) : undefined });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.success === false) throw new Error(j.error || `Erro ${r.status}`);
  return j;
}

export default function Financas() {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [cartoes, setCartoes] = useState<Cartao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroCarga, setErroCarga] = useState("");
  const [aviso, setAviso] = useState<{ msg: string; tipo: "ok" | "erro" } | null>(null);
  const [mes, setMes] = useState(mesAtual());
  const [filtro, setFiltro] = useState<Filtro>("all");
  const [busca, setBusca] = useState("");

  // importação do Firestore (dados antigos)
  const [antigos, setAntigos] = useState<{ lancamentos: any[]; cartoes: any[] } | null>(null);
  const [importando, setImportando] = useState(false);

  // modal de lançamento
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<Lancamento | null>(null);
  const [fTitulo, setFTitulo] = useState("");
  const [fValor, setFValor] = useState("");
  const [fFluxo, setFFluxo] = useState<"income" | "expense">("expense");
  const [fTipo, setFTipo] = useState<"single" | "recurring">("single");
  const [fCategoria, setFCategoria] = useState(CATEGORIES[0]);
  const [fData, setFData] = useState(hojeISO());
  const [fFim, setFFim] = useState("");
  const [fPago, setFPago] = useState(true);
  const [fCartao, setFCartao] = useState("");
  const [fParcelas, setFParcelas] = useState(1);
  const [salvando, setSalvando] = useState(false);

  // modal de cartão
  const [modalCartao, setModalCartao] = useState(false);
  const [cNome, setCNome] = useState("");
  const [cFinal, setCFinal] = useState("");
  const [cValidade, setCValidade] = useState("");
  const [cLimite, setCLimite] = useState("");
  const [cCor, setCCor] = useState(CORES_CARTAO[0]);

  // dicas da IA
  const [dicasAberto, setDicasAberto] = useState(false);
  const [carregandoDicas, setCarregandoDicas] = useState(false);
  const [dicas, setDicas] = useState<{ date: string; dicas: DailyTip[] } | null>(null);
  const [erroDicas, setErroDicas] = useState("");

  const avisar = (msg: string, tipo: "ok" | "erro" = "ok") => { setAviso({ msg, tipo }); setTimeout(() => setAviso(null), 4500); };

  const carregar = useCallback(async () => {
    try {
      const j = await chamar("GET", "/api/financas");
      setLancamentos(j.lancamentos || []);
      setCartoes(j.cartoes || []);
      setErroCarga("");
      // base nova vazia: procura dados antigos no Firestore para oferecer a importação
      if (!(j.lancamentos || []).length && !(j.cartoes || []).length) {
        try {
          const [fl, fc] = await Promise.all([getDocs(collection(db, "financas")), getDocs(collection(db, "cartoes"))]);
          const ls = fl.docs.map(d => ({ id: d.id, ...d.data() }));
          const cs = fc.docs.map(d => ({ id: d.id, ...d.data() }));
          setAntigos(ls.length || cs.length ? { lancamentos: ls, cartoes: cs } : null);
        } catch { setAntigos(null); }
      } else setAntigos(null);
    } catch (e: any) {
      setErroCarga(e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  // ── números do mês ──
  const resumo = useMemo(() => resumoDoMes(lancamentos, mes), [lancamentos, mes]);
  const serie = useMemo(() => serieMeses(lancamentos, mes, 3, 2), [lancamentos, mes]);
  const usoCartoes = useMemo(() => cartoes.map(c => ({ c, usado: usoDoCartao(c.id, lancamentos), fatura: faturaAte(c.id, lancamentos, mes).reduce((a, l) => a + l.amount, 0) })), [cartoes, lancamentos, mes]);
  const limiteTotal = cartoes.reduce((a, c) => a + (Number(c.limit) || 0), 0);
  const usadoTotal = usoCartoes.reduce((a, x) => a + x.usado, 0);
  const nomeCartao = (id?: string | null) => cartoes.find(c => c.id === id)?.name;

  const extrato = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return ocorrenciasDoMes(lancamentos, mes)
      .filter(o => !q || o.lanc.title.toLowerCase().includes(q) || o.lanc.category.toLowerCase().includes(q))
      .filter(o => filtro === "all" || (filtro === "income" && o.lanc.flow === "income") || (filtro === "expense" && o.lanc.flow === "expense")
        || (filtro === "recurring" && o.lanc.type === "recurring") || (filtro === "pending" && !o.pago))
      .sort((a, b) => (a.lanc.type === "recurring" ? a.lanc.date.slice(8) : a.lanc.date.slice(8)).localeCompare(b.lanc.date.slice(8)));
  }, [lancamentos, mes, busca, filtro]);

  // ── ações ──
  const abrirNovo = () => {
    setEditando(null); setFTitulo(""); setFValor(""); setFFluxo("expense"); setFTipo("single"); setFCategoria("Outros");
    const hoje = hojeISO(); setFData(mesAtual() === mes ? hoje : `${mes}-01`); setFFim(""); setFPago(true); setFCartao(""); setFParcelas(1);
    setModalAberto(true);
  };
  const abrirEdicao = (l: Lancamento) => {
    setEditando(l); setFTitulo(l.title); setFValor(String(l.amount).replace(".", ",")); setFFluxo(l.flow); setFTipo(l.type);
    setFCategoria(l.category || CATEGORIES[0]); setFData(l.date); setFFim(l.end_date || ""); setFPago(l.status === "paid");
    setFCartao(l.card_id || ""); setFParcelas(1); setModalAberto(true);
  };

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    const valor = valorBR(fValor);
    if (!fTitulo.trim()) return avisar("Informe a descrição.", "erro");
    if (!(valor > 0)) return avisar("Informe um valor válido, por exemplo 1500 ou 1.500,50.", "erro");
    if (fTipo === "recurring" && fFim && fFim < fData) return avisar("A data final não pode ser antes do início.", "erro");
    const corpo: any = {
      title: fTitulo.trim(), amount: valor, flow: fFluxo, type: fTipo, category: fCategoria, date: fData,
      end_date: fTipo === "recurring" ? (fFim || null) : null, status: fPago ? "paid" : "pending",
      card_id: fFluxo === "expense" ? (fCartao || null) : null,
    };
    setSalvando(true);
    try {
      if (editando) {
        if (editando.type === "recurring") delete corpo.status;   // no recorrente o pago é por mês (botão no extrato)
        await chamar("PUT", `/api/financas/lancamentos/${editando.id}`, corpo);
        avisar("Lançamento atualizado.");
      } else {
        const r = await chamar("POST", "/api/financas/lancamentos", { ...corpo, parcelas: fFluxo === "expense" && fTipo === "single" ? fParcelas : 1 });
        avisar(r.criados > 1 ? `${r.criados} parcelas criadas.` : "Lançamento criado.");
      }
      setModalAberto(false);
      await carregar();
    } catch (err: any) { avisar(err.message, "erro"); }
    finally { setSalvando(false); }
  };

  const alternar = async (l: Lancamento) => {
    try { await chamar("POST", `/api/financas/lancamentos/${l.id}/alternar`, l.type === "recurring" ? { mes } : {}); await carregar(); }
    catch (err: any) { avisar(err.message, "erro"); }
  };

  const apagar = async (l: Lancamento) => {
    let grupo = false;
    if (l.group_id && (l.installment_total || 0) > 1) {
      const todas = window.confirm(`"${l.title}" faz parte de uma compra parcelada.\n\nOK = apagar TODAS as ${l.installment_total} parcelas\nCancelar = escolher apagar só esta`);
      if (todas) grupo = true;
      else if (!window.confirm("Apagar só esta parcela?")) return;
    } else if (!window.confirm(l.type === "recurring" ? `Apagar "${l.title}"? Ele some de todos os meses.` : `Apagar "${l.title}"?`)) return;
    try { await chamar("DELETE", `/api/financas/lancamentos/${l.id}${grupo ? "?grupo=1" : ""}`); avisar("Apagado."); await carregar(); }
    catch (err: any) { avisar(err.message, "erro"); }
  };

  const salvarCartao = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await chamar("POST", "/api/financas/cartoes", { name: cNome, last4: cFinal, expiry: cValidade, limit: cLimite, color: cCor });
      setModalCartao(false); setCNome(""); setCFinal(""); setCValidade(""); setCLimite("");
      avisar("Cartão cadastrado."); await carregar();
    } catch (err: any) { avisar(err.message, "erro"); }
  };

  const apagarCartao = async (c: Cartao) => {
    if (!window.confirm(`Remover o cartão ${c.name}? Os gastos continuam no extrato, só sem o cartão.`)) return;
    try { await chamar("DELETE", `/api/financas/cartoes/${c.id}`); await carregar(); } catch (err: any) { avisar(err.message, "erro"); }
  };

  const pagarFatura = async (c: Cartao, valor: number) => {
    if (!window.confirm(`Pagar a fatura do ${c.name} até ${rotuloMesLongo(mes)}: ${brl(valor)}?\nOs gastos ficam como pagos e o limite é liberado.`)) return;
    try { await chamar("POST", `/api/financas/cartoes/${c.id}/pagar-fatura`, { mes }); avisar("Fatura paga."); await carregar(); }
    catch (err: any) { avisar(err.message, "erro"); }
  };

  const importar = async () => {
    if (!antigos) return;
    setImportando(true);
    try {
      const r = await chamar("POST", "/api/financas/importar", antigos);
      avisar(`Importados: ${r.lancamentos} lançamentos e ${r.cartoes} cartões${r.ignorados?.length ? ` (${r.ignorados.length} ignorados por estarem incompletos)` : ""}.`);
      await carregar();
    } catch (err: any) { avisar(err.message, "erro"); }
    finally { setImportando(false); }
  };

  const abrirDicas = async (forcar = false) => {
    setDicasAberto(true); setErroDicas("");
    if (dicas && !forcar) return;
    setCarregandoDicas(true);
    try {
      const j = await chamar("GET", forcar ? "/api/financas-cron" : "/api/financas-dicas");
      setDicas(j.data);
    } catch (err: any) { setErroDicas(err.message); }
    finally { setCarregandoDicas(false); }
  };

  const previaParcelas = fFluxo === "expense" && fTipo === "single" && !editando && fParcelas > 1 && valorBR(fValor) > 0 ? dividirParcelas(valorBR(fValor), fParcelas) : null;
  const ehFuturo = (m: string) => m > mesAtual();

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#050507] text-white custom-scrollbar pb-24">
      <Header title="Painel Financeiro & Cartões" subtitle="Fluxo de caixa por mês: realizado e previsto, fixos mensais, parcelas e cartões." />

      {aviso && (
        <div className={`fixed top-4 right-4 z-[200] max-w-sm px-4 py-3 rounded-xl border text-sm shadow-xl ${aviso.tipo === "ok" ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-200" : "bg-rose-950/90 border-rose-500/40 text-rose-200"}`}>{aviso.msg}</div>
      )}

      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        {/* BARRA SUPERIOR: mês + ações */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0b0c12] border border-white/10 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan/10 border border-cyan/30 text-cyan flex items-center justify-center shrink-0"><Wallet size={20} /></div>
            <div className="flex items-center gap-2">
              <button onClick={() => setMes(somarMeses(mes, -1))} className="p-1.5 rounded-lg hover:bg-white/10 text-white/60" title="Mês anterior"><ChevronLeft size={18} /></button>
              <div className="min-w-[150px] text-center">
                <div className="text-lg font-serif">{rotuloMesLongo(mes)}</div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-white/40">{mes === mesAtual() ? "mês atual" : ehFuturo(mes) ? "previsão" : "mês passado"}</div>
              </div>
              <button onClick={() => setMes(somarMeses(mes, 1))} className="p-1.5 rounded-lg hover:bg-white/10 text-white/60" title="Próximo mês"><ChevronRight size={18} /></button>
              {mes !== mesAtual() && <button onClick={() => setMes(mesAtual())} className="text-[10px] font-mono uppercase px-2 py-1 rounded-md border border-white/15 text-white/60 hover:text-white">Hoje</button>}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => abrirDicas(false)} className="flex items-center gap-2 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 font-mono font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl border border-amber-400/30">
              <Lightbulb size={14} /> Sugestões IA
            </button>
            <button onClick={abrirNovo} disabled={!!erroCarga} className="flex items-center gap-2 bg-[#00d1ff] hover:bg-[#00b8e6] text-black font-mono font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl disabled:opacity-40">
              <Plus size={15} strokeWidth={2.5} /> Novo Lançamento
            </button>
          </div>
        </div>

        {erroCarga && (
          <div className="flex gap-3 items-start p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-sm text-rose-200">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <div><b>Não consegui carregar as finanças.</b> {erroCarga}<br /><span className="text-rose-200/70">Veja Configurações &gt; Status do sistema.</span></div>
          </div>
        )}

        {antigos && (
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between p-4 rounded-xl border border-cyan/30 bg-cyan/5 text-sm">
            <div><b className="text-cyan">Dados antigos encontrados.</b> {antigos.lancamentos.length} lançamentos e {antigos.cartoes.length} cartões estão no Firestore. Importe para o novo controle (pode repetir sem duplicar).</div>
            <button onClick={importar} disabled={importando} className="flex items-center gap-2 shrink-0 bg-cyan text-black font-mono font-bold text-xs uppercase px-4 py-2 rounded-lg disabled:opacity-50">
              {importando ? <RefreshCw size={14} className="animate-spin" /> : <DownloadCloud size={14} />} Importar
            </button>
          </div>
        )}

        {/* KPIs DO MÊS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          <Kpi titulo="Entradas do mês" cor="emerald" icone={<ArrowUpRight size={16} />} valor={resumo.entradas.total}
            linhas={[["Recebido", resumo.entradas.realizado], ["A receber", resumo.entradas.previsto]]} />
          <Kpi titulo="Saídas do mês" cor="rose" icone={<ArrowDownRight size={16} />} valor={resumo.saidas.total}
            linhas={[["Pago", resumo.saidas.realizado], ["A pagar", resumo.saidas.previsto], ["Fixos mensais", resumo.fixos]]} />
          <Kpi titulo="Saldo do mês" cor={resumo.saldoPrevisto >= 0 ? "cyan" : "rose"} icone={<PieChartIcon size={16} />} valor={resumo.saldoPrevisto}
            linhas={[["Realizado até agora", resumo.saldoRealizado], ["Margem prevista", null, resumo.entradas.total > 0 ? ((resumo.saldoPrevisto / resumo.entradas.total) * 100).toFixed(1) + "%" : "sem entradas"]]} />
          <Kpi titulo="Cartões (limite usado)" cor="white" icone={<CreditCard size={16} />} valor={usadoTotal}
            linhas={[["Limite total", limiteTotal], ["Disponível", Math.max(0, limiteTotal - usadoTotal)]]} />
        </div>

        {/* CARTÕES + GRÁFICO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-[#0b0c12] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5"><CreditCard size={18} className="text-cyan" /><h3 className="font-serif text-base">Meus Cartões</h3></div>
              <button onClick={() => setModalCartao(true)} disabled={!!erroCarga} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 font-mono text-[10px] uppercase tracking-wider rounded-lg border border-white/10 disabled:opacity-40">+ Adicionar</button>
            </div>
            <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
              {cartoes.length === 0 ? (
                <div className="py-12 text-center text-white/40 space-y-2"><Inbox size={32} className="mx-auto text-white/20" /><p className="text-xs font-mono text-white/70">Nenhum cartão cadastrado.</p></div>
              ) : usoCartoes.map(({ c, usado, fatura }) => {
                const pct = c.limit > 0 ? Math.min(100, Math.round((usado / c.limit) * 100)) : 0;
                return (
                  <div key={c.id} className={`relative bg-gradient-to-br ${c.color || CORES_CARTAO[0]} p-5 rounded-xl border border-white/15 shadow-xl space-y-3`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-white/75">{c.name}</span>
                      <button onClick={() => apagarCartao(c)} className="text-white/40 hover:text-rose-300 text-xs" title="Remover cartão">✕</button>
                    </div>
                    <div className="text-base font-mono tracking-widest font-semibold">•••• {c.last4}</div>
                    <div className="flex items-center justify-between text-xs font-mono text-white/80">
                      <div><span className="block text-[9px] text-white/50 uppercase">Validade</span>{c.expiry || "—"}</div>
                      <div className="text-right"><span className="block text-[9px] text-white/50 uppercase">Usado / limite</span><b>{brl(usado)}</b> / {brl(c.limit)}</div>
                    </div>
                    <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden border border-white/10">
                      <div className={`h-full ${pct > 80 ? "bg-rose-500" : pct > 50 ? "bg-amber-400" : "bg-emerald-400"}`} style={{ width: `${pct}%` }} />
                    </div>
                    {fatura > 0 && (
                      <button onClick={() => pagarFatura(c, fatura)} className="w-full text-[11px] font-mono font-bold uppercase py-2 rounded-lg bg-black/30 hover:bg-black/50 border border-white/20">
                        Pagar fatura até {rotuloMesLongo(mes).split(" ")[0]}: {brl(fatura)}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-2 bg-[#0b0c12] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5"><BarChart2 size={18} className="text-cyan" /><h3 className="font-serif text-base">Entradas e saídas por mês</h3></div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-emerald-400"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Entradas</span>
                <span className="flex items-center gap-1.5 text-rose-400"><span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Saídas</span>
                <span className="text-white/40">meses futuros = previsão</span>
              </div>
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={serie} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} onClick={(d: any) => d?.activePayload?.[0]?.payload?.mes && setMes(d.activePayload[0].payload.mes)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" strokeOpacity={0.06} />
                  <XAxis dataKey="rotulo" stroke="#666" tick={{ fill: "#888", fontSize: 11, fontFamily: "monospace" }} />
                  <YAxis stroke="#666" tick={{ fill: "#888", fontSize: 10, fontFamily: "monospace" }} />
                  <Tooltip formatter={(v: any) => brl(Number(v))} labelFormatter={(_: any, p: any) => p?.[0]?.payload?.mes ? rotuloMesLongo(p[0].payload.mes) : ""}
                    contentStyle={{ backgroundColor: "#09090b", borderRadius: 12, border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontFamily: "monospace", fontSize: 12 }} />
                  <Bar dataKey="ganho" name="Entradas" radius={[4, 4, 0, 0]}>
                    {serie.map(s => <Cell key={s.mes} fill="#10b981" fillOpacity={ehFuturo(s.mes) ? 0.4 : s.mes === mes ? 1 : 0.75} />)}
                  </Bar>
                  <Bar dataKey="gasto" name="Saídas" radius={[4, 4, 0, 0]}>
                    {serie.map(s => <Cell key={s.mes} fill="#f43f5e" fillOpacity={ehFuturo(s.mes) ? 0.4 : s.mes === mes ? 1 : 0.75} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] font-mono text-white/40">Clique numa barra para abrir aquele mês.</p>
          </div>
        </div>

        {/* EXTRATO DO MÊS */}
        <div className="bg-[#0b0c12] border border-white/10 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <h3 className="font-serif text-base">Extrato de {rotuloMesLongo(mes)}</h3>
              <span className="text-[11px] font-mono bg-white/5 text-cyan border border-cyan/30 px-2 py-0.5 rounded-md">{extrato.length} itens</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar..." className="pl-8 pr-3 py-1.5 text-xs font-mono bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-cyan/50" />
              </div>
              {([["all", "Todos"], ["income", "Entradas"], ["expense", "Saídas"], ["recurring", "Fixos"], ["pending", "Pendentes"]] as [Filtro, string][]).map(([k, r]) => (
                <button key={k} onClick={() => setFiltro(k)} className={`px-3 py-1.5 text-[11px] font-mono rounded-lg border ${filtro === k ? "bg-cyan/15 text-cyan border-cyan/40" : "bg-white/5 text-white/50 border-white/10"}`}>{r}</button>
              ))}
            </div>
          </div>

          {carregando ? <div className="py-10 text-center text-white/40 text-sm">Carregando...</div>
            : extrato.length === 0 ? (
              <div className="py-12 text-center text-white/40 space-y-2"><Inbox size={32} className="mx-auto text-white/20" /><p className="text-xs font-mono">Nada neste mês{filtro !== "all" || busca ? " com esse filtro" : ""}.</p></div>
            ) : (
              <div className="divide-y divide-white/5">
                {extrato.map(o => {
                  const l = o.lanc;
                  const entrada = l.flow === "income";
                  return (
                    <div key={l.id} className="flex flex-col md:flex-row md:items-center gap-3 py-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium truncate">{l.title}</span>
                          {l.type === "recurring" && <Etiqueta icone={<Repeat size={10} />} texto={l.end_date ? `Fixo até ${dataBR(l.end_date).slice(3)}` : "Fixo mensal"} />}
                          {l.group_id && l.installment_total && <Etiqueta icone={<Layers size={10} />} texto={`Parcela ${l.installment_n}/${l.installment_total}`} />}
                          {l.card_id && <Etiqueta icone={<CreditCard size={10} />} texto={nomeCartao(l.card_id) || "Cartão"} />}
                        </div>
                        <div className="text-[11px] font-mono text-white/40 mt-0.5">
                          {l.type === "recurring" ? `todo dia ${l.date.slice(8, 10)} · desde ${dataBR(l.date).slice(3)}` : dataBR(l.date)} · {l.category}
                        </div>
                      </div>
                      <div className={`font-mono font-semibold md:w-36 md:text-right ${entrada ? "text-emerald-400" : "text-rose-400"}`}>{entrada ? "+" : "−"} {brl(o.valor)}</div>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => alternar(l)} title={o.pago ? "Marcar como pendente" : entrada ? "Marcar como recebido" : "Marcar como pago"}
                          className={`flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-1 rounded-md border ${o.pago ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30" : "bg-amber-500/10 text-amber-300 border-amber-500/30"}`}>
                          {o.pago ? <Check size={11} /> : <Clock size={11} />} {o.pago ? (entrada ? "Recebido" : "Pago") : "Pendente"}
                        </button>
                        <button onClick={() => abrirEdicao(l)} className="p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/10" title="Editar"><Pencil size={13} /></button>
                        <button onClick={() => apagar(l)} className="p-1.5 rounded-md text-white/40 hover:text-rose-400 hover:bg-rose-500/10" title="Apagar"><Trash2 size={13} /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
        </div>
      </div>

      {/* MODAL LANÇAMENTO */}
      {modalAberto && (
        <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={salvar} className="bg-[#0b0c12] border border-white/10 rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg">{editando ? "Editar lançamento" : "Novo lançamento"}</h3>
              <button type="button" onClick={() => setModalAberto(false)} className="text-white/50 hover:text-white"><X size={20} /></button>
            </div>
            {editando?.group_id && <p className="text-[11px] text-amber-300/80">Esta é uma parcela: a edição vale só para ela.</p>}

            <Alternador valor={fFluxo} onChange={v => { setFFluxo(v as any); if (!editando) setFCategoria(v === "income" ? "Clientes & Contratos" : "Outros"); if (v === "income") { setFCartao(""); setFParcelas(1); } }}
              opcoes={[["expense", "Saída (gasto)"], ["income", "Entrada (ganho)"]]} />
            <Campo rotulo="Descrição"><input value={fTitulo} onChange={e => setFTitulo(e.target.value)} className="inp" placeholder="Ex.: Aluguel, Cliente X, Notebook" required /></Campo>
            <div className="grid grid-cols-2 gap-3">
              <Campo rotulo={previaParcelas ? "Valor total da compra (R$)" : "Valor (R$)"}><input value={fValor} onChange={e => setFValor(e.target.value)} className="inp font-mono" placeholder="1.500,00" inputMode="decimal" required /></Campo>
              <Campo rotulo="Categoria"><select value={fCategoria} onChange={e => setFCategoria(e.target.value)} className="inp">{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></Campo>
            </div>

            <Alternador valor={fTipo} onChange={v => { setFTipo(v as any); if (v === "recurring") setFParcelas(1); }} desabilitado={!!editando?.group_id}
              opcoes={[["single", "Único / parcelado"], ["recurring", "Fixo mensal (repete todo mês)"]]} />

            <div className="grid grid-cols-2 gap-3">
              <Campo rotulo={fTipo === "recurring" ? "Começa em" : previaParcelas ? "Data da 1ª parcela" : "Data"}><input type="date" value={fData} onChange={e => setFData(e.target.value)} className="inp" required /></Campo>
              {fTipo === "recurring"
                ? <Campo rotulo="Termina em (opcional)"><input type="date" value={fFim} onChange={e => setFFim(e.target.value)} className="inp" /></Campo>
                : !(editando?.type === "recurring") && (
                  <Campo rotulo="Situação"><select value={fPago ? "paid" : "pending"} onChange={e => setFPago(e.target.value === "paid")} className="inp">
                    <option value="paid">{fFluxo === "income" ? "Já recebido" : previaParcelas ? "1ª parcela paga" : "Já pago"}</option>
                    <option value="pending">{fFluxo === "income" ? "A receber" : "A pagar"}</option>
                  </select></Campo>
                )}
            </div>
            {fTipo === "recurring" && !editando && (
              <label className="flex items-center gap-2 text-xs text-white/70"><input type="checkbox" checked={fPago} onChange={e => setFPago(e.target.checked)} /> Já {fFluxo === "income" ? "recebido" : "pago"} no primeiro mês</label>
            )}

            {fFluxo === "expense" && (
              <div className="grid grid-cols-2 gap-3">
                <Campo rotulo="Pago no cartão? (opcional)"><select value={fCartao} onChange={e => setFCartao(e.target.value)} className="inp">
                  <option value="">Não (Pix, boleto, dinheiro)</option>
                  {cartoes.map(c => <option key={c.id} value={c.id}>{c.name} •••• {c.last4}</option>)}
                </select></Campo>
                {fTipo === "single" && !editando && (
                  <Campo rotulo="Parcelas"><select value={fParcelas} onChange={e => setFParcelas(Number(e.target.value))} className="inp">
                    {Array.from({ length: 24 }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n === 1 ? "À vista" : `${n}x`}</option>)}
                  </select></Campo>
                )}
              </div>
            )}
            {previaParcelas && (
              <p className="text-[11px] font-mono text-cyan/80">Serão criadas {fParcelas} parcelas mensais de {brl(previaParcelas[0])}{previaParcelas[fParcelas - 1] !== previaParcelas[0] ? ` (a última de ${brl(previaParcelas[fParcelas - 1])}, para fechar o total)` : ""}.</p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setModalAberto(false)} className="px-4 py-2 text-sm text-white/60 hover:text-white">Cancelar</button>
              <button type="submit" disabled={salvando} className="px-5 py-2 text-sm font-bold bg-[#00d1ff] text-black rounded-lg disabled:opacity-50">{salvando ? "Salvando..." : "Salvar"}</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL CARTÃO */}
      {modalCartao && (
        <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={salvarCartao} className="bg-[#0b0c12] border border-white/10 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between"><h3 className="font-serif text-lg">Novo cartão</h3><button type="button" onClick={() => setModalCartao(false)} className="text-white/50 hover:text-white"><X size={20} /></button></div>
            <Campo rotulo="Nome"><input value={cNome} onChange={e => setCNome(e.target.value)} className="inp" placeholder="Ex.: Nubank PJ" required /></Campo>
            <div className="grid grid-cols-3 gap-3">
              <Campo rotulo="4 últimos dígitos"><input value={cFinal} onChange={e => setCFinal(e.target.value.replace(/\D/g, "").slice(0, 4))} className="inp font-mono" inputMode="numeric" required /></Campo>
              <Campo rotulo="Validade"><input value={cValidade} onChange={e => setCValidade(e.target.value.slice(0, 5))} className="inp font-mono" placeholder="MM/AA" /></Campo>
              <Campo rotulo="Limite (R$)"><input value={cLimite} onChange={e => setCLimite(e.target.value)} className="inp font-mono" placeholder="5.000" inputMode="decimal" /></Campo>
            </div>
            <div className="flex gap-2">{CORES_CARTAO.map(c => <button type="button" key={c} onClick={() => setCCor(c)} className={`w-8 h-8 rounded-lg bg-gradient-to-br ${c} border-2 ${cCor === c ? "border-white" : "border-transparent"}`} />)}</div>
            <p className="text-[11px] text-white/40">O limite usado é calculado sozinho a partir dos gastos lançados neste cartão.</p>
            <div className="flex justify-end gap-3"><button type="button" onClick={() => setModalCartao(false)} className="px-4 py-2 text-sm text-white/60">Cancelar</button><button type="submit" className="px-5 py-2 text-sm font-bold bg-[#00d1ff] text-black rounded-lg">Salvar</button></div>
          </form>
        </div>
      )}

      {/* MODAL DICAS */}
      {dicasAberto && (
        <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b0c12] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[88vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg flex items-center gap-2"><Lightbulb size={18} className="text-amber-400" /> Sugestões do dia (IA)</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => abrirDicas(true)} disabled={carregandoDicas} className="p-1.5 rounded-md text-white/50 hover:text-white" title="Gerar de novo"><RefreshCw size={15} className={carregandoDicas ? "animate-spin" : ""} /></button>
                <button onClick={() => setDicasAberto(false)} className="text-white/50 hover:text-white"><X size={20} /></button>
              </div>
            </div>
            <p className="text-[11px] text-white/40">Baseadas nos lançamentos do mês atual. São sugestões automáticas, confira antes de agir.</p>
            {carregandoDicas ? <div className="py-10 text-center text-white/40 text-sm">Analisando...</div>
              : erroDicas ? <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-sm text-rose-200">{erroDicas}</div>
              : (dicas?.dicas || []).map(d => (
                <div key={d.id} className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-1">
                  <div className="flex items-center justify-between gap-2"><b>{d.title}</b><span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${d.priority === "alta" ? "bg-rose-500/15 text-rose-300" : d.priority === "media" ? "bg-amber-500/15 text-amber-300" : "bg-white/10 text-white/60"}`}>{d.priority}</span></div>
                  <p className="text-sm text-white/70">{d.description}</p>
                  {d.impact && <p className="text-[11px] font-mono text-cyan/80">{d.impact}</p>}
                </div>
              ))}
          </div>
        </div>
      )}

      <style>{`.inp{width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:.75rem;padding:.5rem .75rem;font-size:.8rem;color:#fff;outline:none}.inp:focus{border-color:rgba(0,209,255,.5)}.inp option{background:#0b0c12}`}</style>
    </div>
  );
}

function Kpi({ titulo, cor, icone, valor, linhas }: { titulo: string; cor: "emerald" | "rose" | "cyan" | "white"; icone: React.ReactNode; valor: number; linhas: [string, number | null, string?][] }) {
  const cores = { emerald: "text-emerald-400", rose: "text-rose-400", cyan: "text-cyan", white: "text-white" };
  return (
    <div className="bg-[#0b0c12] border border-white/10 rounded-2xl p-5 shadow-xl space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-white/50">{titulo}</span>
        <div className={`w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center ${cores[cor]}`}>{icone}</div>
      </div>
      <div className={`text-2xl font-serif font-light tracking-tight ${cores[cor]}`}>{brl(valor)}</div>
      <div className="text-xs font-mono text-white/40 pt-1 border-t border-white/5 space-y-0.5">
        {linhas.map(([r, v, t]) => <div key={r} className="flex justify-between gap-2"><span>{r}</span><span className="text-white/80">{t ?? brl(v || 0)}</span></div>)}
      </div>
    </div>
  );
}

function Etiqueta({ icone, texto }: { icone: React.ReactNode; texto: string }) {
  return <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/60">{icone}{texto}</span>;
}

function Campo({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return <label className="block space-y-1"><span className="text-[10px] font-mono uppercase tracking-wider text-white/50">{rotulo}</span>{children}</label>;
}

function Alternador({ valor, onChange, opcoes, desabilitado }: { valor: string; onChange: (v: string) => void; opcoes: [string, string][]; desabilitado?: boolean }) {
  return (
    <div className={`grid grid-cols-2 gap-2 ${desabilitado ? "opacity-40 pointer-events-none" : ""}`}>
      {opcoes.map(([v, r]) => (
        <button type="button" key={v} onClick={() => onChange(v)} className={`py-2 text-xs rounded-xl border ${valor === v ? "bg-cyan/15 text-cyan border-cyan/40 font-bold" : "bg-white/5 text-white/50 border-white/10"}`}>{r}</button>
      ))}
    </div>
  );
}
