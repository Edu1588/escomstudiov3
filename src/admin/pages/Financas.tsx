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
  BarChart2,
  Inbox,
  Lightbulb,
  CheckSquare
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
    const unsubFinancas = onSnapshot(
      collection(db, "financas"),
      (snap) => {
        const list: Transaction[] = snap.docs.map((d) => ({
          id: d.id,
          ...d.data()
        })) as Transaction[];
        setTransactions(list);
        setLoadingData(false);
      },
      (err) => {
        console.warn("Aviso ao escutar financas no Firebase:", err);
        setLoadingData(false);
      }
    );

    // 2. Escutar Cartões no Firestore
    const unsubCartoes = onSnapshot(
      collection(db, "cartoes"),
      (snap) => {
        const cardList: CardItem[] = snap.docs.map((d) => ({
          id: d.id,
          ...d.data()
        })) as CardItem[];
        setCards(cardList);
      },
      (err) => {
        console.warn("Aviso ao escutar cartoes no Firebase:", err);
      }
    );

    // 3. Escutar Dicas do Dia no Firestore (financas_dicas_diarias/latest)
    const unsubTips = onSnapshot(
      doc(db, "financas_dicas_diarias", "latest"),
      (docSnap) => {
        if (docSnap.exists()) {
          setDailyTipsData(docSnap.data() as any);
        }
      },
      (err) => {
        console.warn("Aviso ao escutar dicas no Firebase:", err);
      }
    );

    return () => {
      unsubFinancas();
      unsubCartoes();
      unsubTips();
    };
  }, []);

  // Gráfico Dinâmico baseado EXCLUSIVAMENTE em Lançamentos Reais
  const chartData = useMemo(() => {
    const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const map: Record<string, { month: string; ganho: number; gasto: number }> = {};

    // Inicializar os últimos 6 meses
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const mName = monthNames[d.getMonth()];
      map[mName] = { month: mName, ganho: 0, gasto: 0 };
    }

    transactions.forEach((t) => {
      if (!t.date) return;
      const parts = t.date.split("-");
      if (parts.length >= 2) {
        const monthIdx = parseInt(parts[1], 10) - 1;
        const mName = monthNames[monthIdx];
        if (map[mName]) {
          if (t.flow === "income") map[mName].ganho += Number(t.amount || 0);
          if (t.flow === "expense") map[mName].gasto += Number(t.amount || 0);
        }
      }
    });

    return Object.values(map);
  }, [transactions]);

  // Métricas Principais Calculadas dos Dados Reais do Firestore
  const metrics = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.flow === "income")
      .reduce((acc, t) => acc + Number(t.amount || 0), 0);

    const totalExpense = transactions
      .filter((t) => t.flow === "expense")
      .reduce((acc, t) => acc + Number(t.amount || 0), 0);

    const netProfit = totalIncome - totalExpense;
    const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : "0";

    const recurringIncome = transactions
      .filter((t) => t.flow === "income" && t.type === "recurring")
      .reduce((acc, t) => acc + Number(t.amount || 0), 0);

    const recurringExpense = transactions
      .filter((t) => t.flow === "expense" && t.type === "recurring")
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
    return transactions.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
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
      // Atualizar Registro Existente no Firestore
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
      // COMPRA PARCELADA NO CARTÃO: GERAR N PARCELAS RECORRENTES AUTOMATICAMENTE!
      const totalAmount = amountNum;
      const installmentVal = parseFloat((totalAmount / installmentsCount).toFixed(2));

      for (let i = 1; i <= installmentsCount; i++) {
        // Calcular data incrementando mês a mês
        const baseDate = new Date(formDate + "T12:00:00");
        baseDate.setMonth(baseDate.getMonth() + (i - 1));
        const installmentDateStr = baseDate.toISOString().split("T")[0];

        const installmentTx = {
          title: `${formTitle} (${i}/${installmentsCount})`,
          amount: installmentVal,
          flow: "expense",
          type: "recurring", // Parcela recorrente mensal
          category: formCategory,
          date: installmentDateStr,
          status: i === 1 ? formStatus : "pending", // 1ª parcela fica com status escolhido, demais ficam pendentes
          cardId: selectedCardId || null,
          createdAt: new Date().toISOString()
        };

        try {
          await addDoc(collection(db, "financas"), installmentTx);
        } catch (err) {
          console.error("Erro ao gerar parcela no Firebase:", err);
        }
      }

      // Atualizar limite usado do cartão se selecionado
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
      // Criar Novo Registro Único no Firestore
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
              Controle completo de fluxo de caixa, cartões corporativos, edições de lançamentos e 5 dicas diárias com IA.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* BOTÃO SUGESTÕES (5 DICAS DO DIA DO CRON DIÁRIO) */}
            <button
              onClick={handleOpenSuggestions}
              disabled={loadingTips}
              className="flex items-center gap-2 bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-sm px-5 py-3 rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all disabled:opacity-50"
            >
              {loadingTips ? (
                <RefreshCw size={18} className="animate-spin text-white" />
              ) : (
                <Lightbulb size={18} className="text-yellow-300 fill-yellow-300" />
              )}
              <span>Sugestões</span>
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
              {cards.length === 0 ? (
                <div className="py-12 text-center text-slate-500 space-y-2">
                  <Inbox size={32} className="mx-auto text-slate-400" />
                  <p className="text-xs font-bold text-slate-700">Nenhum cartão cadastrado.</p>
                  <p className="text-[11px] text-slate-500 max-w-[200px] mx-auto">
                    Clique em <strong className="text-slate-900">+ Adicionar</strong> acima para cadastrar seu primeiro cartão.
                  </p>
                </div>
              ) : (
                cards.map(card => {
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
                })
              )}
            </div>
          </div>

          {/* GRÁFICO COMPARATIVO MENSAL (RECHARTS DINÂMICO REAL) */}
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
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
                          onClick={() => toggleStatus(item.id, item.status)}
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

                {/* OPÇÃO DE CARTÃO DE CRÉDITO E PARCELAMENTO DE RECORRÊNCIA */}
                {formFlow === "expense" && !editingTx && (
                  <div className="p-3 bg-slate-50 border-2 border-slate-900 rounded-xl space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-900">
                      <input
                        type="checkbox"
                        checked={isCardExpense}
                        onChange={(e) => setIsCardExpense(e.target.checked)}
                        className="w-4 h-4 text-[#2563eb] rounded border-slate-900 focus:ring-0 cursor-pointer"
                      />
                      <span>💳 Pagamento com Cartão de Crédito?</span>
                    </label>

                    {isCardExpense && (
                      <div className="space-y-3 pt-2 border-t border-slate-300">
                        {cards.length > 0 && (
                          <div>
                            <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                              Selecione o Cartão Utilizado
                            </label>
                            <select
                              value={selectedCardId}
                              onChange={(e) => setSelectedCardId(e.target.value)}
                              className="w-full px-3 py-2 bg-white border-2 border-slate-900 rounded-xl text-xs font-semibold text-slate-900"
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

                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-900">
                          <input
                            type="checkbox"
                            checked={isInstallment}
                            onChange={(e) => setIsInstallment(e.target.checked)}
                            className="w-4 h-4 text-[#2563eb] rounded border-slate-900 focus:ring-0 cursor-pointer"
                          />
                          <span>É Compra Parcelada? (Lançar parcelas recorrentes automaticamente)</span>
                        </label>

                        {isInstallment && (
                          <div className="space-y-2 pt-1">
                            <label className="block text-[11px] font-bold uppercase text-slate-600">
                              Número de Parcelas
                            </label>
                            <select
                              value={installmentsCount}
                              onChange={(e) => setInstallmentsCount(parseInt(e.target.value, 10))}
                              className="w-full px-3 py-2 bg-white border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900"
                            >
                              {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 18, 24, 36, 48].map((n) => (
                                <option key={n} value={n}>
                                  {n}x parcelas mensais
                                </option>
                              ))}
                            </select>

                            {formAmount && parseFloat(formAmount.replace(",", ".")) > 0 && (
                              <div className="p-2.5 bg-blue-50 border-2 border-blue-900 rounded-xl text-xs font-bold text-blue-900 space-y-1">
                                <div className="flex items-center gap-1.5">
                                  <Zap size={14} className="text-[#2563eb]" />
                                  <span>Geração de Parcelas Automáticas:</span>
                                </div>
                                <p className="text-[11px] font-semibold text-slate-700 leading-snug">
                                  Serão criadas <strong>{installmentsCount} parcelas de R$ {(parseFloat(formAmount.replace(",", ".")) / installmentsCount).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mês</strong> sequenciais mês a mês no seu extrato.
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

        {/* MODAL 💡 5 DICAS DO DIA (DISPARADAS PELO CRON DIÁRIO / IA GROQ) */}
        {showTipsModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 max-w-2xl w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar animate-in fade-in zoom-in duration-200">
              
              {/* Header Modal */}
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Lightbulb size={24} className="fill-slate-900 text-slate-900" />
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-slate-900 flex items-center gap-2">
                      5 Dicas do Dia
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-900 font-bold">
                        Cron Diário 08h ⚡
                      </span>
                    </h3>
                    <p className="text-xs font-semibold text-slate-500">
                      {dailyTipsData?.date ? `Análise realizada em: ${dailyTipsData.date}` : "Análise em tempo real do seu balanço"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowTipsModal(false)}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center border-2 border-slate-900"
                >
                  ✕
                </button>
              </div>

              {/* Lista de 5 Dicas */}
              {loadingTips ? (
                <div className="py-16 text-center space-y-3">
                  <RefreshCw size={36} className="animate-spin text-[#2563eb] mx-auto" />
                  <p className="text-sm font-bold text-slate-800">Processando análise financeira com IA...</p>
                  <p className="text-xs text-slate-500">Avaliando lançamentos, recorrentes e fluxo de caixa.</p>
                </div>
              ) : dailyTipsData?.dicas && dailyTipsData.dicas.length > 0 ? (
                <div className="space-y-4">
                  {dailyTipsData.dicas.map((tip, idx) => (
                    <div
                      key={tip.id || idx}
                      className="p-4 bg-slate-50 border-2 border-slate-900 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-2 hover:bg-white transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center">
                            #{idx + 1}
                          </span>
                          <span className="text-xs font-bold text-[#2563eb] uppercase tracking-wider">
                            {tip.category || "Geral"}
                          </span>
                        </div>

                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border border-slate-900 ${
                          tip.priority === "alta"
                            ? "bg-rose-500 text-white"
                            : tip.priority === "media"
                            ? "bg-amber-400 text-slate-900"
                            : "bg-emerald-400 text-slate-900"
                        }`}>
                          Prioridade {tip.priority}
                        </span>
                      </div>

                      <h4 className="font-black text-base text-slate-900">{tip.title}</h4>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed">{tip.description}</p>

                      {tip.impact && (
                        <div className="text-xs font-extrabold text-emerald-700 bg-emerald-100/70 border border-emerald-800 px-3 py-1 rounded-lg inline-block mt-1">
                          💡 Impacto Estimado: {tip.impact}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-500 space-y-2">
                  <Inbox size={32} className="mx-auto text-slate-400" />
                  <p className="text-sm font-bold text-slate-800">Nenhuma dica gerada ainda.</p>
                  <p className="text-xs text-slate-500">Cadastre seus lançamentos e clique abaixo para gerar suas 5 dicas do dia.</p>
                </div>
              )}

              {/* Footer Modal com Botão de Regeneração */}
              <div className="pt-4 border-t-2 border-slate-900 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500">
                  Automação disposta diariamente às 08:00
                </span>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRefreshDailyTips}
                    disabled={loadingTips}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs rounded-xl border-2 border-slate-900 flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
                  >
                    <RefreshCw size={14} className={loadingTips ? "animate-spin" : ""} />
                    <span>Recalcular Dicas Agora</span>
                  </button>

                  <button
                    onClick={() => setShowTipsModal(false)}
                    className="px-5 py-2 bg-[#2563eb] text-white font-bold text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
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
