import React, { useState, useEffect, useMemo } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  RefreshCw,
  PieChart as PieChartIcon,
  Calendar,
  AlertCircle,
  Check,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  ShieldCheck,
  CreditCard,
  Pencil,
  Wallet,
  Search,
  ChevronRight,
  BarChart2
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from "recharts";
import { db } from "../../lib/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";

interface Transaction {
  id: string;
  title: string;
  amount: number;
  flow: "income" | "expense"; // income = Ganho, expense = Gasto
  type: "recurring" | "single"; // recurring = Recorrente, single = Único
  category: string;
  date: string;
  status: "paid" | "pending";
}

interface CardItem {
  id: string;
  name: string;
  last4: string;
  expiry: string;
  limit: number;
  used: number;
  color: string;
  brand: string;
}

const CATEGORIES = [
  "Clientes & Contratos",
  "Infraestrutura & Servidores",
  "Software & Ferramentas SaaS",
  "Marketing & Anúncios",
  "Pessoal & Pró-labore",
  "Impostos & Taxas",
  "Equipamentos & Compras",
  "Outros"
];

const DEFAULT_CARDS: CardItem[] = [
  {
    id: "c1",
    name: "Itaú Corporate Black",
    last4: "6782",
    expiry: "08/29",
    limit: 35000,
    used: 4200,
    color: "from-slate-950 via-[#0e172a] to-slate-900",
    brand: "Mastercard"
  },
  {
    id: "c2",
    name: "Nubank ESCOM Pro",
    last4: "4358",
    expiry: "11/28",
    limit: 18000,
    used: 2150,
    color: "from-[#2563eb] via-[#1d4ed8] to-[#1e3a8a]",
    brand: "Visa"
  },
  {
    id: "c3",
    name: "Reserva Estratégica",
    last4: "9102",
    expiry: "12/30",
    limit: 50000,
    used: 0,
    color: "from-emerald-700 via-emerald-800 to-slate-900",
    brand: "Elo"
  }
];

const DEFAULT_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1",
    title: "Salário & Retainer - Cliente Alpha",
    amount: 8500,
    flow: "income",
    type: "recurring",
    category: "Clientes & Contratos",
    date: "2026-07-05",
    status: "paid"
  },
  {
    id: "tx-2",
    title: "Servidor Vercel & Cloudflare",
    amount: 140,
    flow: "expense",
    type: "recurring",
    category: "Infraestrutura & Servidores",
    date: "2026-07-10",
    status: "paid"
  },
  {
    id: "tx-3",
    title: "Assinatura Resend & Groq API",
    amount: 220,
    flow: "expense",
    type: "recurring",
    category: "Software & Ferramentas SaaS",
    date: "2026-07-12",
    status: "paid"
  },
  {
    id: "tx-4",
    title: "Desenvolvimento Landing Page Beta",
    amount: 4500,
    flow: "income",
    type: "single",
    category: "Clientes & Contratos",
    date: "2026-07-18",
    status: "paid"
  },
  {
    id: "tx-5",
    title: "Anúncios Meta Ads Prospecção",
    amount: 800,
    flow: "expense",
    type: "single",
    category: "Marketing & Anúncios",
    date: "2026-07-20",
    status: "paid"
  }
];

// Dados simulados para o gráfico histórico dos últimos meses
const CHART_DATA = [
  { month: "Fev", ganho: 9800, gasto: 3200 },
  { month: "Mar", ganho: 11500, gasto: 4100 },
  { month: "Abr", ganho: 10200, gasto: 3800 },
  { month: "Mai", ganho: 12800, gasto: 4500 },
  { month: "Jun", ganho: 14000, gasto: 4900 },
  { month: "Jul", ganho: 13000, gasto: 3160 }
];

export default function Financas() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem("escom_financas_data");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_TRANSACTIONS;
  });

  const [cards, setCards] = useState<CardItem[]>(() => {
    const savedCards = localStorage.getItem("escom_financas_cards");
    if (savedCards) {
      try { return JSON.parse(savedCards); } catch (e) {}
    }
    return DEFAULT_CARDS;
  });

  const [filterType, setFilterType] = useState<"all" | "income" | "expense" | "recurring" | "single">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  // State Form Transação (Novo ou Edição)
  const [formTitle, setFormTitle] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formFlow, setFormFlow] = useState<"income" | "expense">("expense");
  const [formType, setFormType] = useState<"recurring" | "single">("recurring");
  const [formCategory, setFormCategory] = useState(CATEGORIES[0]);
  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
  const [formStatus, setFormStatus] = useState<"paid" | "pending">("paid");

  // State Form Cartão
  const [cardName, setCardName] = useState("");
  const [cardLast4, setCardLast4] = useState("");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardLimit, setCardLimit] = useState("");
  const [cardUsed, setCardUsed] = useState("");
  const [cardColor, setCardColor] = useState("from-[#2563eb] via-[#1d4ed8] to-[#1e3a8a]");

  // AI State
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  // Persistir LocalStorage
  useEffect(() => {
    localStorage.setItem("escom_financas_data", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("escom_financas_cards", JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    fetchFirestoreTransactions();
  }, []);

  const fetchFirestoreTransactions = async () => {
    try {
      const snap = await getDocs(collection(db, "financas"));
      if (!snap.empty) {
        const firestoreList = snap.docs.map(d => ({ id: d.id, ...d.data() } as Transaction));
        setTransactions(firestoreList);
      }
    } catch (e) {
      console.log("Usando dados locais de finanças.");
    }
  };

  // Métricas Principais
  const metrics = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.flow === "income")
      .reduce((acc, t) => acc + Number(t.amount || 0), 0);

    const totalExpense = transactions
      .filter(t => t.flow === "expense")
      .reduce((acc, t) => acc + Number(t.amount || 0), 0);

    const netProfit = totalIncome - totalExpense;
    const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : "0";

    const recurringIncome = transactions
      .filter(t => t.flow === "income" && t.type === "recurring")
      .reduce((acc, t) => acc + Number(t.amount || 0), 0);

    const recurringExpense = transactions
      .filter(t => t.flow === "expense" && t.type === "recurring")
      .reduce((acc, t) => acc + Number(t.amount || 0), 0);

    const totalCardLimit = cards.reduce((acc, c) => acc + Number(c.limit || 0), 0);
    const totalCardUsed = cards.reduce((acc, c) => acc + Number(c.used || 0), 0);

    return {
      totalIncome,
      totalExpense,
      netProfit,
      profitMargin,
      recurringIncome,
      recurringExpense,
      totalCardLimit,
      totalCardUsed
    };
  }, [transactions, cards]);

  // Lançamentos Filtrados
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            t.category.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
      if (filterType === "income") return t.flow === "income";
      if (filterType === "expense") return t.flow === "expense";
      if (filterType === "recurring") return t.type === "recurring";
      if (filterType === "single") return t.type === "single";
      return true;
    });
  }, [transactions, filterType, searchQuery]);

  // Abrir Modal para Criar Novo
  const openNewModal = () => {
    setEditingTx(null);
    setFormTitle("");
    setFormAmount("");
    setFormFlow("expense");
    setFormType("recurring");
    setFormCategory(CATEGORIES[0]);
    setFormDate(new Date().toISOString().split("T")[0]);
    setFormStatus("paid");
    setShowAddModal(true);
  };

  // Abrir Modal para Editar Existente
  const openEditModal = (tx: Transaction) => {
    setEditingTx(tx);
    setFormTitle(tx.title);
    setFormAmount(String(tx.amount));
    setFormFlow(tx.flow);
    setFormType(tx.type);
    setFormCategory(tx.category);
    setFormDate(tx.date);
    setFormStatus(tx.status);
    setShowAddModal(true);
  };

  // Salvar (Novo ou Edição)
  const handleSaveTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formAmount) return;

    const amountNum = parseFloat(formAmount.replace(",", "."));

    if (editingTx) {
      // Atualizar Existente
      const updatedList = transactions.map(t => {
        if (t.id === editingTx.id) {
          return {
            ...t,
            title: formTitle,
            amount: amountNum,
            flow: formFlow,
            type: formType,
            category: formCategory,
            date: formDate,
            status: formStatus
          };
        }
        return t;
      });
      setTransactions(updatedList);

      try {
        await updateDoc(doc(db, "financas", editingTx.id), {
          title: formTitle,
          amount: amountNum,
          flow: formFlow,
          type: formType,
          category: formCategory,
          date: formDate,
          status: formStatus
        });
      } catch (err) {}
    } else {
      // Criar Novo
      const newTx: Transaction = {
        id: "tx-" + Date.now(),
        title: formTitle,
        amount: amountNum,
        flow: formFlow,
        type: formType,
        category: formCategory,
        date: formDate,
        status: formStatus
      };

      setTransactions(prev => [newTx, ...prev]);

      try {
        await addDoc(collection(db, "financas"), newTx);
      } catch (err) {}
    }

    setShowAddModal(false);
  };

  // Adicionar Cartão
  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardName || !cardLast4) return;

    const newCard: CardItem = {
      id: "card-" + Date.now(),
      name: cardName,
      last4: cardLast4,
      expiry: cardExpiry || "12/28",
      limit: parseFloat(cardLimit || "10000"),
      used: parseFloat(cardUsed || "0"),
      color: cardColor,
      brand: "Mastercard"
    };

    setCards(prev => [...prev, newCard]);
    setCardName("");
    setCardLast4("");
    setCardLimit("");
    setCardUsed("");
    setShowAddCardModal(false);
  };

  // Alternar Status
  const toggleStatus = async (id: string) => {
    setTransactions(prev =>
      prev.map(t => {
        if (t.id === id) {
          const nextStatus = t.status === "paid" ? "pending" : "paid";
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  // Deletar Transação
  const handleDeleteTx = async (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    try {
      await deleteDoc(doc(db, "financas", id));
    } catch (e) {}
  };

  // Deletar Cartão
  const handleDeleteCard = (id: string) => {
    setCards(prev => prev.filter(c => c.id !== id));
  };

  // IA Otimizadora
  const handleAnalyzeWithAI = async () => {
    setAiAnalyzing(true);
    try {
      const res = await fetch("/api/analyze-finances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          incomes: transactions.filter(t => t.flow === "income"),
          expenses: transactions.filter(t => t.flow === "expense"),
          month: "Mês Atual"
        })
      });

      const data = await res.json();
      if (data.success) {
        setAiResult(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiAnalyzing(false);
    }
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#070c18] p-4 md:p-8 text-slate-900 custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER DASHBOARD */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-[#2563eb] text-white flex items-center justify-center font-bold border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Wallet size={24} />
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                Painel Financeiro & Cartões
              </h1>
            </div>
            <p className="text-slate-600 text-sm font-medium">
              Controle completo de fluxo de caixa, cartões corporativos, edições de lançamentos e análise em tempo real com IA.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleAnalyzeWithAI}
              disabled={aiAnalyzing}
              className="flex items-center gap-2 bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-sm px-5 py-3 rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all disabled:opacity-50"
            >
              {aiAnalyzing ? (
                <RefreshCw size={18} className="animate-spin text-white" />
              ) : (
                <Sparkles size={18} className="text-yellow-300 fill-yellow-300" />
              )}
              <span>{aiAnalyzing ? "Analisando com IA..." : "Otimizar com IA"}</span>
            </button>

            <button
              onClick={openNewModal}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm px-5 py-3 rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
            >
              <Plus size={18} />
              <span>Novo Lançamento</span>
            </button>
          </div>
        </div>

        {/* TOP CARDS KPIS (RESUMO EXECUTIVO) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Saldo & Ganhos</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-900">
                <ArrowUpRight size={18} />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-600">
              R$ {metrics.totalIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <div className="mt-2 text-xs font-semibold text-slate-500">
              Recorrentes: <span className="text-slate-900 font-bold">R$ {metrics.recurringIncome.toLocaleString("pt-BR")}</span>
            </div>
          </div>

          <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total de Despesas</span>
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center border border-rose-900">
                <ArrowDownRight size={18} />
              </div>
            </div>
            <div className="text-2xl font-black text-rose-600">
              R$ {metrics.totalExpense.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <div className="mt-2 text-xs font-semibold text-slate-500">
              Fixos Recorrentes: <span className="text-slate-900 font-bold">R$ {metrics.recurringExpense.toLocaleString("pt-BR")}</span>
            </div>
          </div>

          <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Lucro Líquido</span>
              <div className={`w-8 h-8 rounded-lg ${metrics.netProfit >= 0 ? "bg-blue-100 text-blue-700" : "bg-rose-100 text-rose-700"} flex items-center justify-center border border-slate-900`}>
                <PieChartIcon size={18} />
              </div>
            </div>
            <div className={`text-2xl font-black ${metrics.netProfit >= 0 ? "text-blue-600" : "text-rose-600"}`}>
              R$ {metrics.netProfit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <div className="mt-2 text-xs font-semibold text-slate-500">
              Margem de Lucro: <span className="text-slate-900 font-bold">{metrics.profitMargin}%</span>
            </div>
          </div>

          <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Limite de Cartões</span>
              <CreditCard size={20} className="text-[#2563eb]" />
            </div>
            <div className="text-xl font-black text-slate-900">
              R$ {metrics.totalCardUsed.toLocaleString("pt-BR")} / R$ {metrics.totalCardLimit.toLocaleString("pt-BR")}
            </div>
            <div className="mt-2 text-xs font-semibold text-slate-500">
              {cards.length} cartões cadastrados
            </div>
          </div>
        </div>

        {/* SEÇÃO 2: MEUS CARTÕES DE CRÉDITO & GRÁFICO COMPARATIVO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* PAINEL DE CARTÕES (MY CARDS) */}
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard size={20} className="text-[#2563eb]" />
                <h3 className="font-black text-lg text-slate-900">Meus Cartões</h3>
              </div>
              <button
                onClick={() => setShowAddCardModal(true)}
                className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg border border-slate-900 transition-all"
              >
                + Adicionar
              </button>
            </div>

            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
              {cards.map(card => {
                const percentUsed = card.limit > 0 ? Math.min(100, Math.round((card.used / card.limit) * 100)) : 0;
                return (
                  <div
                    key={card.id}
                    className={`relative bg-gradient-to-br ${card.color} text-white p-5 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] overflow-hidden space-y-3`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-white/80">{card.name}</span>
                      <button
                        onClick={() => handleDeleteCard(card.id)}
                        className="text-white/60 hover:text-rose-300 text-xs font-bold"
                        title="Remover Cartão"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="text-lg font-mono tracking-widest font-bold">
                      •••• •••• •••• {card.last4}
                    </div>

                    <div className="flex items-center justify-between text-xs font-semibold pt-1">
                      <div>
                        <span className="block text-[10px] text-white/60 uppercase">Validade</span>
                        <span>{card.expiry}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] text-white/60 uppercase">Limite Usado</span>
                        <span className="font-bold">R$ {card.used.toLocaleString()} / R$ {card.limit.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Barra de Progresso do Limite */}
                    <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/20">
                      <div
                        className={`h-full transition-all ${
                          percentUsed > 80 ? "bg-rose-500" : percentUsed > 50 ? "bg-amber-400" : "bg-emerald-400"
                        }`}
                        style={{ width: `${percentUsed}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* GRÁFICO COMPARATIVO MENSAL (RECHARTS) */}
          <div className="lg:col-span-2 bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
              <div className="flex items-center gap-2">
                <BarChart2 size={20} className="text-[#2563eb]" />
                <h3 className="font-black text-lg text-slate-900">Evolução Mensal (Ganhos vs Gastos)</h3>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold">
                <span className="flex items-center gap-1 text-emerald-600">
                  <span className="w-3 h-3 rounded bg-emerald-500 border border-slate-900"></span> Ganhos
                </span>
                <span className="flex items-center gap-1 text-rose-600">
                  <span className="w-3 h-3 rounded bg-rose-500 border border-slate-900"></span> Gastos
                </span>
              </div>
            </div>

            <div className="h-[280px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CHART_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fill: "#334155", fontSize: 12, fontWeight: "bold" }} />
                  <YAxis tick={{ fill: "#334155", fontSize: 11 }} />
                  <Tooltip
                    formatter={(val: any) => `R$ ${Number(val).toLocaleString("pt-BR")}`}
                    contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "2px solid #000", color: "#fff", fontWeight: "bold" }}
                  />
                  <Bar dataKey="ganho" fill="#10b981" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="gasto" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* RELATÓRIO DA IA (QUANDO SOLICITADO) */}
        {aiResult && (
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-6">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Sparkles size={22} className="fill-slate-900" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Relatório de Otimização Financeira IA (Groq Llama 3.3)
                  </h3>
                  <p className="text-xs font-medium text-slate-600">
                    Auditoria inteligente dos seus lançamentos para aumento de lucro.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 border border-blue-900 rounded-lg text-xs font-bold">
                  Health Score: {aiResult.healthScore}% ({aiResult.statusLabel})
                </span>
                <button onClick={() => setAiResult(null)} className="text-xs font-bold text-slate-500 hover:text-slate-900">
                  Fechar
                </button>
              </div>
            </div>

            {aiResult.savingsOpportunityTotal > 0 && (
              <div className="p-4 bg-emerald-50 border-2 border-emerald-900 rounded-xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <Zap size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">Economia Estimada Identificada</div>
                  <div className="text-lg font-black text-emerald-900">
                    R$ {Number(aiResult.savingsOpportunityTotal).toLocaleString("pt-BR", { minimumFractionDigits: 2 })} / mês
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 bg-slate-50 border-2 border-slate-900 rounded-xl">
              <h4 className="text-xs font-bold uppercase text-slate-500 mb-1">Resumo Executivo</h4>
              <p className="text-sm font-semibold text-slate-800 leading-relaxed">{aiResult.summary}</p>
            </div>

            {aiResult.recommendations && aiResult.recommendations.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 mb-3">Recomendações da IA</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiResult.recommendations.map((rec: any, idx: number) => (
                    <div key={idx} className="p-4 bg-white border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#2563eb] uppercase">{rec.category}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-900">
                          {rec.priority}
                        </span>
                      </div>
                      <h5 className="font-black text-sm text-slate-900">{rec.title}</h5>
                      <p className="text-xs text-slate-600 leading-relaxed">{rec.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SEÇÃO 3: TABELA DE LANÇAMENTOS (COM EDIÇÃO E EXCLUSÃO) */}
        <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-900 pb-4">
            <div className="flex items-center gap-3">
              <Filter size={18} className="text-slate-600" />
              <h3 className="font-black text-lg text-slate-900">Extrato de Lançamentos</h3>
              <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-900">
                {filteredTransactions.length} itens
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar lançamento..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs font-semibold bg-slate-50 border-2 border-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>

              {["all", "income", "expense", "recurring"].map(typeKey => (
                <button
                  key={typeKey}
                  onClick={() => setFilterType(typeKey as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 border-slate-900 transition-all ${
                    filterType === typeKey ? "bg-[#2563eb] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {typeKey === "all" ? "Todos" : typeKey === "income" ? "Ganhos" : typeKey === "expense" ? "Gastos" : "Recorrentes"}
                </button>
              ))}
            </div>
          </div>

          {/* TABELA DE LANÇAMENTOS */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-900 text-xs font-black uppercase text-slate-500 tracking-wider">
                  <th className="py-3 px-3">Lançamento</th>
                  <th className="py-3 px-3">Tipo / Recorrência</th>
                  <th className="py-3 px-3">Categoria</th>
                  <th className="py-3 px-3">Data</th>
                  <th className="py-3 px-3 text-right">Valor</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm font-semibold">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-slate-500 font-medium">
                      Nenhum lançamento encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-3 font-bold text-slate-900">
                        {item.title}
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                            item.flow === "income" ? "bg-emerald-100 text-emerald-800 border-emerald-900" : "bg-rose-100 text-rose-800 border-rose-900"
                          }`}>
                            {item.flow === "income" ? "Ganho" : "Gasto"}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-900">
                            {item.type === "recurring" ? "Recorrente" : "Único"}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-xs text-slate-600 font-bold">
                        {item.category}
                      </td>

                      <td className="py-3.5 px-3 text-xs text-slate-500 font-medium">
                        {item.date}
                      </td>

                      <td className={`py-3.5 px-3 text-right font-black text-base ${
                        item.flow === "income" ? "text-emerald-600" : "text-rose-600"
                      }`}>
                        {item.flow === "income" ? "+" : "-"} R$ {Number(item.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        <button
                          onClick={() => toggleStatus(item.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border border-slate-900 transition-all ${
                            item.status === "paid"
                              ? "bg-emerald-500 text-white"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {item.status === "paid" ? <Check size={14} /> : <Clock size={14} />}
                          <span>{item.status === "paid" ? "Pago/Recebido" : "Pendente"}</span>
                        </button>
                      </td>

                      {/* BOTÕES DE AÇÕES: EDITAR (LÁPIS) E EXCLUIR (LIXEIRA) */}
                      <td className="py-3.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 hover:bg-blue-100 text-[#2563eb] rounded-lg border border-transparent hover:border-blue-900 transition-all"
                            title="Editar Valores e Detalhes do Lançamento"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            onClick={() => handleDeleteTx(item.id)}
                            className="p-1.5 hover:bg-rose-100 text-rose-600 rounded-lg border border-transparent hover:border-rose-900 transition-all"
                            title="Excluir Lançamento"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL ADICIONAR / EDITAR LANÇAMENTO */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 max-w-lg w-full shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-5 animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
                <h3 className="font-black text-xl text-slate-900">
                  {editingTx ? "Editar Lançamento Financeiro" : "Novo Lançamento Financeiro"}
                </h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-500 hover:text-slate-900 font-bold">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveTransaction} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Tipo do Lançamento</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormFlow("expense")}
                      className={`py-2.5 rounded-xl font-bold text-sm border-2 border-slate-900 transition-all ${
                        formFlow === "expense" ? "bg-rose-600 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      Gasto (Saída)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormFlow("income")}
                      className={`py-2.5 rounded-xl font-bold text-sm border-2 border-slate-900 transition-all ${
                        formFlow === "income" ? "bg-emerald-600 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      Ganho (Entrada)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">Frequência</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormType("recurring")}
                      className={`py-2 rounded-xl font-bold text-xs border-2 border-slate-900 transition-all ${
                        formType === "recurring" ? "bg-slate-900 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      Recorrente (Mensal)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormType("single")}
                      className={`py-2 rounded-xl font-bold text-xs border-2 border-slate-900 transition-all ${
                        formType === "single" ? "bg-slate-900 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      Único (Pontual)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Título do Lançamento</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Salário, Servidor Vercel, Cliente X"
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Valor (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="0.00"
                      value={formAmount}
                      onChange={e => setFormAmount(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-slate-900 font-black focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Categoria</label>
                    <select
                      value={formCategory}
                      onChange={e => setFormCategory(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-slate-900 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Data</label>
                    <input
                      type="date"
                      value={formDate}
                      onChange={e => setFormDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-slate-900 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Status</label>
                    <select
                      value={formStatus}
                      onChange={e => setFormStatus(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-slate-900 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                    >
                      <option value="paid">Pago / Concluído</option>
                      <option value="pending">Pendente</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-3 border-t-2 border-slate-900">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border-2 border-slate-900"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    {editingTx ? "Atualizar Lançamento" : "Salvar Lançamento"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL ADICIONAR CARTÃO DE CRÉDITO */}
        {showAddCardModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 max-w-md w-full shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
                <h3 className="font-black text-xl text-slate-900">Cadastrar Novo Cartão / Conta</h3>
                <button onClick={() => setShowAddCardModal(false)} className="text-slate-500 hover:text-slate-900 font-bold">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveCard} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Nome do Cartão / Banco</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Itaú Black, Nubank Pro"
                    value={cardName}
                    onChange={e => setCardName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-slate-900 font-semibold text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Últimos 4 Dígitos</label>
                    <input
                      type="text"
                      maxLength={4}
                      required
                      placeholder="6782"
                      value={cardLast4}
                      onChange={e => setCardLast4(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-slate-900 font-mono font-bold text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Validade</label>
                    <input
                      type="text"
                      placeholder="08/29"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-slate-900 font-mono font-bold text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Limite Total (R$)</label>
                    <input
                      type="number"
                      required
                      placeholder="15000"
                      value={cardLimit}
                      onChange={e => setCardLimit(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-slate-900 font-black text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Gasto Atual (R$)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={cardUsed}
                      onChange={e => setCardUsed(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-slate-900 font-black text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Estilo de Cor do Cartão</label>
                  <select
                    value={cardColor}
                    onChange={e => setCardColor(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-slate-900 font-semibold text-xs"
                  >
                    <option value="from-[#2563eb] via-[#1d4ed8] to-[#1e3a8a]">Azul ESCOM Pro</option>
                    <option value="from-slate-950 via-[#0e172a] to-slate-900">Black Card Premium</option>
                    <option value="from-emerald-700 via-emerald-800 to-slate-900">Emerald Green</option>
                    <option value="from-orange-600 via-amber-600 to-slate-900">Sunset Gold</option>
                  </select>
                </div>

                <div className="pt-3 flex justify-end gap-3 border-t-2 border-slate-900">
                  <button
                    type="button"
                    onClick={() => setShowAddCardModal(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border-2 border-slate-900"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#2563eb] text-white font-bold text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Salvar Cartão
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
