import React, { useState, useEffect, useMemo } from "react";
import { Header } from "../components/Header";
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
  BarChart2,
  Inbox,
  Lightbulb,
  CheckSquare,
  X
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from "recharts";
import { db } from "../../lib/firebase";
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc, getDoc } from "firebase/firestore";

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

interface DailyTip {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: "alta" | "media" | "baixa";
  impact: string;
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

export default function Financas() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cards, setCards] = useState<CardItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);

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

  // State Específico de Cartão & Parcelamento
  const [isCardExpense, setIsCardExpense] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState("");
  const [isInstallment, setIsInstallment] = useState(false);
  const [installmentsCount, setInstallmentsCount] = useState(2);

  // State Form Cartão
  const [cardName, setCardName] = useState("");
  const [cardLast4, setCardLast4] = useState("");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardLimit, setCardLimit] = useState("");
  const [cardUsed, setCardUsed] = useState("");
  const [cardColor, setCardColor] = useState("from-[#2563eb] via-[#1d4ed8] to-[#1e3a8a]");

  // State das 5 Dicas do Dia do Cron / IA
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [loadingTips, setLoadingTips] = useState(false);
  const [dailyTipsData, setDailyTipsData] = useState<{ date: string; dicas: DailyTip[] } | null>(null);

  // Escutar Firebase Firestore em Tempo Real (financas & cartoes)
  useEffect(() => {
    setLoadingData(true);

    // 1. Escutar Lançamentos no Firestore
    const unsubFinancas = onSnapshot(collection(db, "financas"), (snapshot) => {
      const list: Transaction[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        list.push({
          id: d.id,
          title: data.title || "Sem título",
          amount: Number(data.amount) || 0,
          flow: data.flow || "expense",
          type: data.type || "recurring",
          category: data.category || "Geral",
          date: data.date || "",
          status: data.status || "paid"
        });
      });

      // Ordenar por data decrescente
      list.sort((a, b) => (b.date > a.date ? 1 : -1));
      setTransactions(list);
      setLoadingData(false);
    }, (error) => {
      console.warn("Erro ao ouvir financas no Firebase:", error);
      setLoadingData(false);
    });

    // 2. Escutar Cartões no Firestore
    const unsubCartoes = onSnapshot(collection(db, "cartoes"), (snapshot) => {
      const cardList: CardItem[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        cardList.push({
          id: d.id,
          name: data.name || "Cartão Corporativo",
          last4: data.last4 || "0000",
          expiry: data.expiry || "12/28",
          limit: Number(data.limit) || 0,
          used: Number(data.used) || 0,
          color: data.color || "from-[#2563eb] via-[#1d4ed8] to-[#1e3a8a]",
          brand: data.brand || "Mastercard"
        });
      });
      setCards(cardList);
    }, (error) => {
      console.warn("Erro ao ouvir cartoes no Firebase:", error);
    });

    return () => {
      unsubFinancas();
      unsubCartoes();
    };
  }, []);

  // Métricas Consolidadas Calculadas em Tempo Real
  const metrics = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    let recurringIncome = 0;
    let recurringExpense = 0;

    transactions.forEach(t => {
      if (t.flow === "income") {
        totalIncome += t.amount;
        if (t.type === "recurring") recurringIncome += t.amount;
      } else {
        totalExpense += t.amount;
        if (t.type === "recurring") recurringExpense += t.amount;
      }
    });

    const netProfit = totalIncome - totalExpense;
    const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : "0";

    const totalCardLimit = cards.reduce((acc, c) => acc + (Number(c.limit) || 0), 0);
    const totalCardUsed = cards.reduce((acc, c) => acc + (Number(c.used) || 0), 0);

    return {
      totalIncome,
      totalExpense,
      recurringIncome,
      recurringExpense,
      netProfit,
      profitMargin,
      totalCardLimit,
      totalCardUsed
    };
  }, [transactions, cards]);

  // Dados Agrupados por Mês para o Gráfico Recharts
  const chartData = useMemo(() => {
    const monthsMap: Record<string, { month: string; ganho: number; gasto: number }> = {};
    const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

    // Iniciar últimos 6 meses
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthsMap[key] = {
        month: monthNames[d.getMonth()],
        ganho: 0,
        gasto: 0
      };
    }

    // Somar transações do banco
    transactions.forEach(t => {
      if (!t.date) return;
      const key = t.date.substring(0, 7); // YYYY-MM
      if (monthsMap[key]) {
        if (t.flow === "income") monthsMap[key].ganho += t.amount;
        else monthsMap[key].gasto += t.amount;
      }
    });

    return Object.values(monthsMap);
  }, [transactions]);

  // Transações Filtradas por Tipo e Busca
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            t.category.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (filterType === "all") return true;
      if (filterType === "income") return t.flow === "income";
      if (filterType === "expense") return t.flow === "expense";
      if (filterType === "recurring") return t.type === "recurring";
      if (filterType === "single") return t.type === "single";
      return true;
    });
  }, [transactions, filterType, searchQuery]);

  // Abrir Modal para Criar Novo Lançamento
  const openNewModal = () => {
    setEditingTx(null);
    setFormTitle("");
    setFormAmount("");
    setFormFlow("expense");
    setFormType("recurring");
    setFormCategory(CATEGORIES[0]);
    setFormDate(new Date().toISOString().split("T")[0]);
    setFormStatus("paid");
    setIsCardExpense(false);
    setSelectedCardId("");
    setIsInstallment(false);
    setInstallmentsCount(2);
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
    setIsCardExpense(false);
    setIsInstallment(false);
    setShowAddModal(true);
  };

  // Salvar no Firebase Firestore (Novo ou Edição com Gerador de Parcelas)
  const handleSaveTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formAmount) return;

    const amountNum = parseFloat(formAmount.replace(",", "."));

    if (editingTx) {
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
      } catch (err) {
        console.error("Erro ao atualizar no Firebase:", err);
      }
    } else if (formFlow === "expense" && isCardExpense && isInstallment && installmentsCount > 1) {
      const totalAmount = amountNum;
      const installmentVal = parseFloat((totalAmount / installmentsCount).toFixed(2));

      for (let i = 1; i <= installmentsCount; i++) {
        const baseDate = new Date(formDate + "T12:00:00");
        baseDate.setMonth(baseDate.getMonth() + (i - 1));
        const installmentDateStr = baseDate.toISOString().split("T")[0];

        const installmentTx = {
          title: `${formTitle} (${i}/${installmentsCount})`,
          amount: installmentVal,
          flow: "expense",
          type: "recurring",
          category: formCategory,
          date: installmentDateStr,
          status: i === 1 ? formStatus : "pending",
          cardId: selectedCardId || null,
          createdAt: new Date().toISOString()
        };

        try {
          await addDoc(collection(db, "financas"), installmentTx);
        } catch (err) {
          console.error("Erro ao gerar parcela no Firebase:", err);
        }
      }

      if (selectedCardId) {
        const targetCard = cards.find(c => c.id === selectedCardId);
        if (targetCard) {
          const newUsed = (Number(targetCard.used) || 0) + totalAmount;
          try {
            await updateDoc(doc(db, "cartoes", selectedCardId), { used: newUsed });
          } catch (err) {}
        }
      }
    } else {
      const newTxData = {
        title: formTitle,
        amount: amountNum,
        flow: formFlow,
        type: formType,
        category: formCategory,
        date: formDate,
        status: formStatus,
        createdAt: new Date().toISOString()
      };

      try {
        await addDoc(collection(db, "financas"), newTxData);
      } catch (err) {
        console.error("Erro ao salvar no Firebase:", err);
      }
    }

    setShowAddModal(false);
  };

  // Salvar Novo Cartão no Firebase Firestore (collection: "cartoes")
  const handleSaveCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardName || !cardLast4) return;

    const newCardData = {
      name: cardName,
      last4: cardLast4,
      expiry: cardExpiry || "12/28",
      limit: parseFloat(cardLimit || "0"),
      used: parseFloat(cardUsed || "0"),
      color: cardColor,
      brand: "Mastercard",
      createdAt: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, "cartoes"), newCardData);
    } catch (err) {
      console.error("Erro ao salvar cartão no Firebase:", err);
    }

    setCardName("");
    setCardLast4("");
    setCardLimit("");
    setCardUsed("");
    setShowAddCardModal(false);
  };

  // Alternar Status no Firebase
  const toggleStatus = async (id: string, currentStatus: "paid" | "pending") => {
    const nextStatus = currentStatus === "paid" ? "pending" : "paid";
    try {
      await updateDoc(doc(db, "financas", id), { status: nextStatus });
    } catch (err) {
      console.error("Erro ao atualizar status no Firebase:", err);
    }
  };

  // Deletar Lançamento do Firebase
  const handleDeleteTx = async (id: string) => {
    try {
      await deleteDoc(doc(db, "financas", id));
    } catch (err) {
      console.error("Erro ao deletar lançamento do Firebase:", err);
    }
  };

  // Deletar Cartão do Firebase
  const handleDeleteCard = async (id: string) => {
    try {
      await deleteDoc(doc(db, "cartoes", id));
    } catch (err) {
      console.error("Erro ao deletar cartão do Firebase:", err);
    }
  };

  // Abrir Modal de Sugestões (5 Dicas do Dia)
  const handleOpenSuggestions = async () => {
    setShowTipsModal(true);
    if (!dailyTipsData) {
      setLoadingTips(true);
      try {
        const res = await fetch("/api/financas-dicas");
        const data = await res.json();
        if (data.success && data.data) {
          setDailyTipsData(data.data);
        }
      } catch (e) {
        console.error("Erro ao carregar dicas do dia:", e);
      } finally {
        setLoadingTips(false);
      }
    }
  };

  // Forçar Atualização Manual das 5 Dicas
  const handleRefreshDailyTips = async () => {
    setLoadingTips(true);
    try {
      const res = await fetch("/api/financas-cron");
      const data = await res.json();
      if (data.success && data.data) {
        setDailyTipsData(data.data);
      }
    } catch (e) {
      console.error("Erro ao regerar dicas do dia:", e);
    } finally {
      setLoadingTips(false);
    }
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#050507] text-white custom-scrollbar pb-24">
      {/* HEADER DA PÁGINA */}
      <Header 
        title="Painel Financeiro & Cartões" 
        subtitle="Controle completo de fluxo de caixa, cartões corporativos, edições de lançamentos e 5 dicas diárias com IA." 
      />

      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        
        {/* BARRA DE AÇÕES SUPERIOR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0b0c12] border border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan/10 border border-cyan/30 text-cyan flex items-center justify-center shrink-0">
              <Wallet size={20} />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-serif text-white font-normal tracking-tight">
                Fluxo de Caixa Operacional
              </h2>
              <p className="text-white/40 text-xs font-mono mt-0.5">
                Balanço consolidado em tempo real com Firestore
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* BOTÃO SUGESTÕES (5 DICAS COM IA) */}
            <button
              onClick={handleOpenSuggestions}
              disabled={loadingTips}
              className="flex items-center gap-2 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 font-mono font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl border border-amber-400/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loadingTips ? (
                <RefreshCw size={14} className="animate-spin text-amber-300" />
              ) : (
                <Lightbulb size={14} className="text-amber-400 fill-amber-400/40" />
              )}
              <span>Sugestões IA</span>
            </button>

            {/* BOTÃO NOVO LANÇAMENTO */}
            <button
              onClick={openNewModal}
              className="flex items-center gap-2 bg-[#00d1ff] hover:bg-[#00b8e6] text-black font-mono font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-lg shadow-[#00d1ff]/15 active:scale-95 transition-all cursor-pointer"
            >
              <Plus size={15} strokeWidth={2.5} />
              <span>Novo Lançamento</span>
            </button>
          </div>
        </div>

        {/* TOP CARDS KPIS (RESUMO EXECUTIVO) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {/* Card Saldo & Ganhos */}
          <div className="bg-[#0b0c12] border border-white/10 rounded-2xl p-5 hover:border-emerald-500/40 transition-all shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-white/50">Saldo & Ganhos</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <ArrowUpRight size={16} />
              </div>
            </div>
            <div className="text-2xl font-serif font-light text-emerald-400 tracking-tight">
              R$ {metrics.totalIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs font-mono text-white/40 pt-1 border-t border-white/5">
              Recorrentes: <span className="text-white font-semibold">R$ {metrics.recurringIncome.toLocaleString("pt-BR")}</span>
            </div>
          </div>

          {/* Card Total de Despesas */}
          <div className="bg-[#0b0c12] border border-white/10 rounded-2xl p-5 hover:border-rose-500/40 transition-all shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-white/50">Total de Despesas</span>
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
                <ArrowDownRight size={16} />
              </div>
            </div>
            <div className="text-2xl font-serif font-light text-rose-400 tracking-tight">
              R$ {metrics.totalExpense.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs font-mono text-white/40 pt-1 border-t border-white/5">
              Fixos Recorrentes: <span className="text-white font-semibold">R$ {metrics.recurringExpense.toLocaleString("pt-BR")}</span>
            </div>
          </div>

          {/* Card Lucro Líquido */}
          <div className="bg-[#0b0c12] border border-white/10 rounded-2xl p-5 hover:border-cyan/40 transition-all shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-white/50">Lucro Líquido</span>
              <div className={`w-8 h-8 rounded-lg ${metrics.netProfit >= 0 ? "bg-cyan/10 text-cyan border border-cyan/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"} flex items-center justify-center`}>
                <PieChartIcon size={16} />
              </div>
            </div>
            <div className={`text-2xl font-serif font-light ${metrics.netProfit >= 0 ? "text-cyan" : "text-rose-400"} tracking-tight`}>
              R$ {metrics.netProfit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs font-mono text-white/40 pt-1 border-t border-white/5">
              Margem de Lucro: <span className="text-white font-semibold">{metrics.profitMargin}%</span>
            </div>
          </div>

          {/* Card Limite de Cartões */}
          <div className="bg-[#0b0c12] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-white/50">Limite de Cartões</span>
              <CreditCard size={18} className="text-white/60" />
            </div>
            <div className="text-xl font-serif font-light text-white tracking-tight">
              R$ {metrics.totalCardUsed.toLocaleString("pt-BR")} <span className="text-white/30 text-sm">/ R$ {metrics.totalCardLimit.toLocaleString("pt-BR")}</span>
            </div>
            <div className="text-xs font-mono text-white/40 pt-1 border-t border-white/5">
              {cards.length} cartões corporativos
            </div>
          </div>
        </div>

        {/* SEÇÃO 2: MEUS CARTÕES DE CRÉDITO & GRÁFICO COMPARATIVO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* PAINEL DE CARTÕES (MY CARDS) */}
          <div className="bg-[#0b0c12] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <CreditCard size={18} className="text-cyan" />
                  <h3 className="font-serif text-base text-white font-normal">Meus Cartões</h3>
                </div>
                <button
                  onClick={() => setShowAddCardModal(true)}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white font-mono text-[10px] uppercase tracking-wider rounded-lg border border-white/10 transition-all cursor-pointer"
                >
                  + Adicionar
                </button>
              </div>

              <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
                {cards.length === 0 ? (
                  <div className="py-12 text-center text-white/40 space-y-2">
                    <Inbox size={32} className="mx-auto text-white/20" />
                    <p className="text-xs font-mono text-white/70">Nenhum cartão cadastrado.</p>
                    <p className="text-[11px] text-white/40 max-w-[200px] mx-auto">
                      Clique em <strong className="text-cyan">+ Adicionar</strong> acima para cadastrar seu cartão.
                    </p>
                  </div>
                ) : (
                  cards.map(card => {
                    const percentUsed = card.limit > 0 ? Math.min(100, Math.round((card.used / card.limit) * 100)) : 0;
                    return (
                      <div
                        key={card.id}
                        className={`relative bg-gradient-to-br ${card.color} text-white p-5 rounded-xl border border-white/15 shadow-xl overflow-hidden space-y-3`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-white/75">{card.name}</span>
                          <button
                            onClick={() => handleDeleteCard(card.id)}
                            className="text-white/40 hover:text-rose-300 text-xs font-bold transition-colors cursor-pointer"
                            title="Remover Cartão"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="text-base font-mono tracking-widest font-semibold text-white/95">
                          •••• •••• •••• {card.last4}
                        </div>

                        <div className="flex items-center justify-between text-xs font-mono pt-1 text-white/80">
                          <div>
                            <span className="block text-[9px] text-white/50 uppercase">Validade</span>
                            <span>{card.expiry}</span>
                          </div>
                          <div className="text-right">
                            <span className="block text-[9px] text-white/50 uppercase">Limite Usado</span>
                            <span className="font-semibold">R$ {card.used.toLocaleString()} / R$ {card.limit.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Barra de Progresso do Limite */}
                        <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden border border-white/10">
                          <div
                            className={`h-full transition-all ${
                              percentUsed > 80 ? "bg-rose-500" : percentUsed > 50 ? "bg-amber-400" : "bg-emerald-400"
                            }`}
                            style={{ width: `${percentUsed}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* GRÁFICO COMPARATIVO MENSAL (RECHARTS DINÂMICO REAL) */}
          <div className="lg:col-span-2 bg-[#0b0c12] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <BarChart2 size={18} className="text-cyan" />
                <h3 className="font-serif text-base text-white font-normal">Evolução Mensal (Ganhos vs Gastos)</h3>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Ganhos
                </span>
                <span className="flex items-center gap-1.5 text-rose-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span> Gastos
                </span>
              </div>
            </div>

            <div className="h-[280px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" strokeOpacity={0.06} />
                  <XAxis dataKey="month" stroke="#666666" tick={{ fill: "#888888", fontSize: 11, fontFamily: "monospace" }} />
                  <YAxis stroke="#666666" tick={{ fill: "#888888", fontSize: 10, fontFamily: "monospace" }} />
                  <Tooltip
                    formatter={(val: any) => `R$ ${Number(val).toLocaleString("pt-BR")}`}
                    contentStyle={{ backgroundColor: "#09090b", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontFamily: "monospace", fontSize: "12px" }}
                  />
                  <Bar dataKey="ganho" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="gasto" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* SEÇÃO 3: TABELA DE LANÇAMENTOS (EXTRATO) */}
        <div className="bg-[#0b0c12] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <Filter size={16} className="text-white/50" />
              <h3 className="font-serif text-base text-white font-normal">Extrato de Lançamentos</h3>
              <span className="text-[11px] font-mono bg-white/5 text-cyan border border-cyan/30 px-2 py-0.5 rounded-md">
                {filteredTransactions.length} itens
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Buscar lançamento..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs font-mono bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-cyan/50"
                />
              </div>

              {["all", "income", "expense", "recurring"].map(typeKey => (
                <button
                  key={typeKey}
                  onClick={() => setFilterType(typeKey as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    filterType === typeKey 
                      ? "bg-cyan/15 text-cyan border border-cyan/30 font-bold" 
                      : "bg-white/5 text-white/50 hover:text-white border border-white/10"
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
                <tr className="border-b border-white/10 text-[10px] font-mono uppercase text-white/40 tracking-[0.14em]">
                  <th className="py-3 px-3">Lançamento</th>
                  <th className="py-3 px-3">Tipo / Recorrência</th>
                  <th className="py-3 px-3">Categoria</th>
                  <th className="py-3 px-3">Data</th>
                  <th className="py-3 px-3 text-right">Valor</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs font-sans">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-white/40 font-mono">
                      Nenhum lançamento encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map(item => (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-3 font-medium text-white">
                        {item.title}
                      </td>

                      <td className="py-3.5 px-3 font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            item.flow === "income" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                          }`}>
                            {item.flow === "income" ? "Ganho" : "Gasto"}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/5 text-white/60 border border-white/10">
                            {item.type === "recurring" ? "Recorrente" : "Único"}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-xs text-white/60 font-mono">
                        {item.category}
                      </td>

                      <td className="py-3.5 px-3 text-xs text-white/50 font-mono">
                        {item.date}
                      </td>

                      <td className={`py-3.5 px-3 text-right font-mono font-bold text-sm ${
                        item.flow === "income" ? "text-emerald-400" : "text-rose-400"
                      }`}>
                        {item.flow === "income" ? "+" : "-"} R$ {Number(item.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </td>

                      <td className="py-3.5 px-3 text-center font-mono">
                        <button
                          onClick={() => toggleStatus(item.id, item.status)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                            item.status === "paid"
                              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                              : "bg-amber-500/15 text-amber-400 border-amber-500/30"
                          }`}
                        >
                          {item.status === "paid" ? <Check size={12} /> : <Clock size={12} />}
                          <span>{item.status === "paid" ? "Pago/Recebido" : "Pendente"}</span>
                        </button>
                      </td>

                      {/* BOTÕES DE AÇÕES: EDITAR (LÁPIS) E EXCLUIR (LIXEIRA) */}
                      <td className="py-3.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 hover:bg-cyan/10 text-white/40 hover:text-cyan rounded-lg transition-colors cursor-pointer"
                            title="Editar Valores e Detalhes"
                          >
                            <Pencil size={14} />
                          </button>

                          <button
                            onClick={() => handleDeleteTx(item.id)}
                            className="p-1.5 hover:bg-rose-500/10 text-white/40 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                            title="Excluir Lançamento"
                          >
                            <Trash2 size={14} />
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
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-[#0b0c12] border border-white/15 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200 text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-serif text-lg text-white font-normal">
                  {editingTx ? "Editar Lançamento Financeiro" : "Novo Lançamento Financeiro"}
                </h3>
                <button onClick={() => setShowAddModal(false)} className="text-white/40 hover:text-white transition-colors cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveTransaction} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-white/50 mb-1.5">Tipo do Lançamento</label>
                  <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => setFormFlow("expense")}
                      className={`py-2 rounded-xl border transition-all cursor-pointer ${
                        formFlow === "expense" ? "bg-rose-500/20 text-rose-300 border-rose-500/50 font-bold" : "bg-white/5 text-white/50 border-white/10"
                      }`}
                    >
                      Gasto (Saída)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormFlow("income")}
                      className={`py-2 rounded-xl border transition-all cursor-pointer ${
                        formFlow === "income" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold" : "bg-white/5 text-white/50 border-white/10"
                      }`}
                    >
                      Ganho (Entrada)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-white/50 mb-1.5">Frequência</label>
                  <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => setFormType("recurring")}
                      className={`py-2 rounded-xl border transition-all cursor-pointer ${
                        formType === "recurring" ? "bg-cyan/15 text-cyan border-cyan/40 font-bold" : "bg-white/5 text-white/50 border-white/10"
                      }`}
                    >
                      Recorrente (Mensal)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormType("single")}
                      className={`py-2 rounded-xl border transition-all cursor-pointer ${
                        formType === "single" ? "bg-cyan/15 text-cyan border-cyan/40 font-bold" : "bg-white/5 text-white/50 border-white/10"
                      }`}
                    >
                      Único (Pontual)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-white/50 mb-1">Título do Lançamento</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Servidor Vercel, Cliente X, Pró-labore"
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-xs placeholder:text-white/30 focus:outline-none focus:border-cyan/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-white/50 mb-1">Valor (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="0.00"
                      value={formAmount}
                      onChange={e => setFormAmount(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-xs placeholder:text-white/30 focus:outline-none focus:border-cyan/50 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-white/50 mb-1">Categoria</label>
                    <select
                      value={formCategory}
                      onChange={e => setFormCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-[#09090b] border border-white/10 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-cyan/50"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* OPÇÃO DE CARTÃO DE CRÉDITO E PARCELAMENTO */}
                {formFlow === "expense" && !editingTx && (
                  <div className="p-3.5 bg-white/[0.02] border border-white/10 rounded-xl space-y-3 font-mono">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-white/80">
                      <input
                        type="checkbox"
                        checked={isCardExpense}
                        onChange={(e) => setIsCardExpense(e.target.checked)}
                        className="accent-cyan cursor-pointer"
                      />
                      <span>💳 Pagamento com Cartão de Crédito?</span>
                    </label>

                    {isCardExpense && (
                      <div className="space-y-3 pt-2 border-t border-white/5">
                        {cards.length > 0 && (
                          <div>
                            <label className="block text-[10px] uppercase text-white/50 mb-1">
                              Selecione o Cartão Utilizado
                            </label>
                            <select
                              value={selectedCardId}
                              onChange={(e) => setSelectedCardId(e.target.value)}
                              className="w-full px-3 py-1.5 bg-[#09090b] border border-white/10 rounded-lg text-xs text-white"
                            >
                              <option value="">Nenhum / Cartão Geral</option>
                              {cards.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.name} (•••• {c.last4})
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        <label className="flex items-center gap-2 cursor-pointer text-xs text-white/80">
                          <input
                            type="checkbox"
                            checked={isInstallment}
                            onChange={(e) => setIsInstallment(e.target.checked)}
                            className="accent-cyan cursor-pointer"
                          />
                          <span>É Compra Parcelada? (Lançar parcelas mensais)</span>
                        </label>

                        {isInstallment && (
                          <div className="space-y-2 pt-1">
                            <label className="block text-[10px] uppercase text-white/50">
                              Número de Parcelas
                            </label>
                            <select
                              value={installmentsCount}
                              onChange={(e) => setInstallmentsCount(parseInt(e.target.value, 10))}
                              className="w-full px-3 py-1.5 bg-[#09090b] border border-white/10 rounded-lg text-xs font-bold text-white"
                            >
                              {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 18, 24, 36, 48].map((n) => (
                                <option key={n} value={n}>
                                  {n}x parcelas mensais
                                </option>
                              ))}
                            </select>

                            {formAmount && parseFloat(formAmount.replace(",", ".")) > 0 && (
                              <div className="p-2.5 bg-cyan/10 border border-cyan/30 rounded-lg text-xs text-cyan space-y-1">
                                <div className="flex items-center gap-1.5">
                                  <Zap size={13} className="text-cyan" />
                                  <span>Geração de Parcelas Automáticas:</span>
                                </div>
                                <p className="text-[11px] text-white/70 leading-snug">
                                  Serão criadas <strong>{installmentsCount} parcelas de R$ {(parseFloat(formAmount.replace(",", ".")) / installmentsCount).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mês</strong> sequenciais mês a mês no extrato.
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-white/50 mb-1">Data</label>
                    <input
                      type="date"
                      value={formDate}
                      onChange={e => setFormDate(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-cyan/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-white/50 mb-1">Status</label>
                    <select
                      value={formStatus}
                      onChange={e => setFormStatus(e.target.value as any)}
                      className="w-full px-3 py-2 bg-[#09090b] border border-white/10 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-cyan/50"
                    >
                      <option value="paid">Pago / Concluído</option>
                      <option value="pending">Pendente</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-mono text-xs rounded-xl border border-white/10 transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#00d1ff] hover:bg-[#00b8e6] text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg shadow-[#00d1ff]/15"
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
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-[#0b0c12] border border-white/15 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-serif text-lg text-white font-normal">Cadastrar Novo Cartão</h3>
                <button onClick={() => setShowAddCardModal(false)} className="text-white/40 hover:text-white transition-colors cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveCard} className="space-y-3 font-mono">
                <div>
                  <label className="block text-[10px] uppercase text-white/50 mb-1">Nome do Cartão / Banco</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Itaú Black, Nubank Pro"
                    value={cardName}
                    onChange={e => setCardName(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-cyan/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase text-white/50 mb-1">Últimos 4 Dígitos</label>
                    <input
                      type="text"
                      maxLength={4}
                      required
                      placeholder="6782"
                      value={cardLast4}
                      onChange={e => setCardLast4(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-xs placeholder:text-white/30 focus:outline-none focus:border-cyan/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-white/50 mb-1">Validade</label>
                    <input
                      type="text"
                      placeholder="08/29"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-cyan/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase text-white/50 mb-1">Limite Total (R$)</label>
                    <input
                      type="number"
                      required
                      placeholder="15000"
                      value={cardLimit}
                      onChange={e => setCardLimit(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-xs placeholder:text-white/30 focus:outline-none focus:border-cyan/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-white/50 mb-1">Gasto Atual (R$)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={cardUsed}
                      onChange={e => setCardUsed(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-xs placeholder:text-white/30 focus:outline-none focus:border-cyan/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-white/50 mb-1">Estilo Visual do Cartão</label>
                  <select
                    value={cardColor}
                    onChange={e => setCardColor(e.target.value)}
                    className="w-full px-3 py-2 bg-[#09090b] border border-white/10 rounded-xl text-white text-xs"
                  >
                    <option value="from-[#2563eb] via-[#1d4ed8] to-[#1e3a8a]">Azul ESCOM Pro</option>
                    <option value="from-slate-950 via-[#0e172a] to-slate-900">Black Card Premium</option>
                    <option value="from-emerald-700 via-emerald-800 to-slate-900">Emerald Green</option>
                    <option value="from-orange-600 via-amber-600 to-slate-900">Sunset Gold</option>
                  </select>
                </div>

                <div className="pt-3 flex justify-end gap-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowAddCardModal(false)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-mono text-xs rounded-xl border border-white/10 transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#00d1ff] hover:bg-[#00b8e6] text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg shadow-[#00d1ff]/15"
                  >
                    Salvar Cartão
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 💡 5 DICAS DO DIA (DISPARADAS PELO CRON DIÁRIO / IA GROQ) */}
        {showTipsModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-[#0b0c12] border border-white/15 rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar animate-in fade-in zoom-in duration-200 text-white">
              
              {/* Header Modal */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center">
                    <Lightbulb size={20} className="fill-amber-400/40" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-white font-normal flex items-center gap-2">
                      5 Dicas Financeiras do Dia
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan/10 text-cyan border border-cyan/30">
                        Cron 08h ⚡
                      </span>
                    </h3>
                    <p className="text-xs font-mono text-white/40">
                      {dailyTipsData?.date ? `Análise realizada em: ${dailyTipsData.date}` : "Análise em tempo real do seu balanço com IA"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowTipsModal(false)}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white flex items-center justify-center border border-white/10 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Lista de 5 Dicas */}
              {loadingTips ? (
                <div className="py-16 text-center space-y-3 font-mono">
                  <RefreshCw size={32} className="animate-spin text-cyan mx-auto" />
                  <p className="text-xs font-bold text-white">Processando análise financeira com IA...</p>
                  <p className="text-[11px] text-white/40">Avaliando lançamentos, despesas e fluxo de caixa.</p>
                </div>
              ) : dailyTipsData?.dicas && dailyTipsData.dicas.length > 0 ? (
                <div className="space-y-3.5">
                  {dailyTipsData.dicas.map((tip, idx) => (
                    <div
                      key={tip.id || idx}
                      className="p-4 bg-white/[0.02] border border-white/10 rounded-xl space-y-2 hover:border-white/20 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-white/10 text-cyan font-mono font-bold text-[10px] flex items-center justify-center">
                            #{idx + 1}
                          </span>
                          <span className="text-[11px] font-mono text-cyan uppercase tracking-wider">
                            {tip.category || "Geral"}
                          </span>
                        </div>

                        <span className={`px-2 py-0.5 rounded font-mono text-[9px] uppercase border ${
                          tip.priority === "alta"
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                            : tip.priority === "media"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        }`}>
                          Prioridade {tip.priority}
                        </span>
                      </div>

                      <h4 className="font-serif text-sm font-medium text-white">{tip.title}</h4>
                      <p className="text-xs text-white/70 font-sans leading-relaxed">{tip.description}</p>

                      {tip.impact && (
                        <div className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded inline-block mt-1">
                          💡 Impacto: {tip.impact}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-white/40 space-y-2 font-mono">
                  <Inbox size={32} className="mx-auto text-white/20" />
                  <p className="text-xs text-white/70">Nenhuma dica gerada ainda.</p>
                  <p className="text-[11px] text-white/40">Cadastre seus lançamentos e clique abaixo para calcular.</p>
                </div>
              )}

              {/* Footer Modal com Botão de Regeneração */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 font-mono">
                <span className="text-[10px] uppercase text-white/40">
                  Automação diária às 08:00
                </span>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRefreshDailyTips}
                    disabled={loadingTips}
                    className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-white font-mono text-xs rounded-xl border border-white/10 flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw size={13} className={loadingTips ? "animate-spin" : ""} />
                    <span>Recalcular Dicas</span>
                  </button>

                  <button
                    onClick={() => setShowTipsModal(false)}
                    className="px-4 py-2 bg-[#00d1ff] hover:bg-[#00b8e6] text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg shadow-[#00d1ff]/15"
                  >
                    Fechar
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
