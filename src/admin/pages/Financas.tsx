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
  PieChart,
  Calendar,
  AlertCircle,
  Check,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  ShieldCheck
} from "lucide-react";
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

const DEFAULT_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1",
    title: "Contrato Retainer - Cliente Alpha",
    amount: 8500,
    flow: "income",
    type: "recurring",
    category: "Clientes & Contratos",
    date: "2026-07-05",
    status: "paid"
  },
  {
    id: "tx-2",
    title: "Servidor Vercel & Domínios",
    amount: 140,
    flow: "expense",
    type: "recurring",
    category: "Infraestrutura & Servidores",
    date: "2026-07-10",
    status: "paid"
  },
  {
    id: "tx-3",
    title: "Assinatura Resend & OpenAI API",
    amount: 220,
    flow: "expense",
    type: "recurring",
    category: "Software & Ferramentas SaaS",
    date: "2026-07-12",
    status: "paid"
  },
  {
    id: "tx-4",
    title: "Projeto Site Landing Page Beta",
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

export default function Financas() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem("escom_financas_data");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_TRANSACTIONS;
  });

  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "income" | "expense" | "recurring" | "single">("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formFlow, setFormFlow] = useState<"income" | "expense">("expense");
  const [formType, setFormType] = useState<"recurring" | "single">("recurring");
  const [formCategory, setFormCategory] = useState(CATEGORIES[0]);
  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
  const [formStatus, setFormStatus] = useState<"paid" | "pending">("paid");

  // AI Analysis State
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [aiError, setAiError] = useState("");

  // Persistir LocalStorage e Firebase
  useEffect(() => {
    localStorage.setItem("escom_financas_data", JSON.stringify(transactions));
  }, [transactions]);

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

  // Totais & Métricas
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

    return {
      totalIncome,
      totalExpense,
      netProfit,
      profitMargin,
      recurringIncome,
      recurringExpense
    };
  }, [transactions]);

  // Lista Filtrada
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (filterType === "income") return t.flow === "income";
      if (filterType === "expense") return t.flow === "expense";
      if (filterType === "recurring") return t.type === "recurring";
      if (filterType === "single") return t.type === "single";
      return true;
    });
  }, [transactions, filterType]);

  // Handler Adicionar
  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formAmount) return;

    const newTx: Transaction = {
      id: "tx-" + Date.now(),
      title: formTitle,
      amount: parseFloat(formAmount.replace(",", ".")),
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

    // Limpar formulário
    setFormTitle("");
    setFormAmount("");
    setShowAddModal(false);
  };

  // Handler Alternar Status (Pago <-> Pendente)
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

  // Handler Deletar
  const handleDelete = async (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    try {
      await deleteDoc(doc(db, "financas", id));
    } catch (e) {}
  };

  // Handler Análise IA
  const handleAnalyzeWithAI = async () => {
    setAiAnalyzing(true);
    setAiError("");
    try {
      const incomes = transactions.filter(t => t.flow === "income");
      const expenses = transactions.filter(t => t.flow === "expense");

      const res = await fetch("/api/analyze-finances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          incomes,
          expenses,
          month: "Mês Atual"
        })
      });

      const data = await res.json();
      if (data.success) {
        setAiResult(data.data);
      } else {
        setAiError(data.error || "Erro ao processar análise da IA.");
      }
    } catch (err: any) {
      setAiError("Falha na comunicação com o servidor da IA: " + err.message);
    } finally {
      setAiAnalyzing(false);
    }
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#070c18] p-4 md:p-8 text-slate-900 custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER PRINCIPAL */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-[#2563eb] text-white flex items-center justify-center font-bold border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <DollarSign size={24} />
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                Gestão Financeira & Otimização
              </h1>
            </div>
            <p className="text-slate-600 text-sm font-medium">
              Administre ganhos, controle despesas recorrentes e otimize seu fluxo de caixa em tempo real com IA.
            </p>
          </div>

          <div className="flex items-center gap-3">
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
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm px-5 py-3 rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
            >
              <Plus size={18} />
              <span>Novo Lançamento</span>
            </button>
          </div>
        </div>

        {/* METRIC CARDS SUMMARY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card Entradas */}
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Ganhos Total</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-900">
                <ArrowUpRight size={18} />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-600">
              R$ {metrics.totalIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <div className="mt-2 text-xs font-semibold text-slate-500">
              Recorrentes: <span className="text-slate-900">R$ {metrics.recurringIncome.toLocaleString("pt-BR")}</span>
            </div>
          </div>

          {/* Card Saídas */}
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Gastos Total</span>
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center border border-rose-900">
                <ArrowDownRight size={18} />
              </div>
            </div>
            <div className="text-2xl font-black text-rose-600">
              R$ {metrics.totalExpense.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <div className="mt-2 text-xs font-semibold text-slate-500">
              Recorrentes (Fixos): <span className="text-slate-900">R$ {metrics.recurringExpense.toLocaleString("pt-BR")}</span>
            </div>
          </div>

          {/* Card Lucro Líquido */}
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Lucro Líquido</span>
              <div className={`w-8 h-8 rounded-lg ${metrics.netProfit >= 0 ? "bg-blue-100 text-blue-700" : "bg-rose-100 text-rose-700"} flex items-center justify-center border border-slate-900`}>
                <PieChart size={18} />
              </div>
            </div>
            <div className={`text-2xl font-black ${metrics.netProfit >= 0 ? "text-blue-600" : "text-rose-600"}`}>
              R$ {metrics.netProfit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <div className="mt-2 text-xs font-semibold text-slate-500">
              Margem de Lucro: <span className="text-slate-900 font-bold">{metrics.profitMargin}%</span>
            </div>
          </div>

          {/* Card Saúde Financeira */}
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Status Financeiro</span>
              <ShieldCheck size={20} className="text-[#2563eb]" />
            </div>
            <div className="text-xl font-black text-slate-900">
              {metrics.netProfit > 3000 ? "Saudável & Expansão" : metrics.netProfit >= 0 ? "Equilibrado" : "Atenção a Custos"}
            </div>
            <div className="mt-2 text-xs font-medium text-slate-500">
              {transactions.length} lançamentos salvos no mês
            </div>
          </div>
        </div>

        {/* MÓDULO DE RELATÓRIO DA IA (QUANDO GERADO) */}
        {aiResult && (
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-6">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Sparkles size={22} className="fill-slate-900" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Relatório de Otimização Financeira da IA (Groq Llama 3.3)
                  </h3>
                  <p className="text-xs font-medium text-slate-600">
                    Análise completa com recomendações estratégicas para maximizar seu lucro.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 border border-blue-900 rounded-lg text-xs font-bold">
                  Score de Saúde: {aiResult.healthScore}% ({aiResult.statusLabel})
                </span>
                <button
                  onClick={() => setAiResult(null)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900"
                >
                  Fechar Análise
                </button>
              </div>
            </div>

            {/* Oportunidade de Economia */}
            {aiResult.savingsOpportunityTotal > 0 && (
              <div className="p-4 bg-emerald-50 border-2 border-emerald-900 rounded-xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <Zap size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">Oportunidade de Economia Estimada</div>
                  <div className="text-lg font-black text-emerald-900">
                    R$ {Number(aiResult.savingsOpportunityTotal).toLocaleString("pt-BR", { minimumFractionDigits: 2 })} / mês
                  </div>
                </div>
              </div>
            )}

            {/* Resumo Executivo */}
            <div className="p-4 bg-slate-50 border-2 border-slate-900 rounded-xl">
              <h4 className="text-xs font-bold uppercase text-slate-500 mb-1">Resumo Executivo</h4>
              <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                {aiResult.summary}
              </p>
            </div>

            {/* Recomendações em Cards */}
            {aiResult.recommendations && aiResult.recommendations.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Recomendações Práticas da IA</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiResult.recommendations.map((rec: any, idx: number) => (
                    <div key={idx} className="p-4 bg-white border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#2563eb] uppercase tracking-wider">{rec.category || "Geral"}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          rec.priority === "alta" ? "bg-rose-100 text-rose-800 border border-rose-900" : "bg-amber-100 text-amber-800 border border-amber-900"
                        }`}>
                          Prioridade {rec.priority}
                        </span>
                      </div>
                      <h5 className="font-black text-sm text-slate-900">{rec.title}</h5>
                      <p className="text-xs text-slate-600 leading-relaxed">{rec.description}</p>
                      {rec.impactEstimate && (
                        <div className="text-xs font-bold text-emerald-700 pt-1">
                          Impacto: {rec.impactEstimate}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PAINEL DE TRANSAÇÕES */}
        <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-6">
          {/* Barra de Filtros */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-900 pb-4">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-slate-600" />
              <h3 className="font-black text-lg text-slate-900">Extrato de Lançamentos</h3>
              <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-900">
                {filteredTransactions.length} itens
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setFilterType("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 border-slate-900 transition-all ${
                  filterType === "all" ? "bg-[#2563eb] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterType("income")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 border-slate-900 transition-all ${
                  filterType === "income" ? "bg-emerald-600 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Ganhos (Entradas)
              </button>
              <button
                onClick={() => setFilterType("expense")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 border-slate-900 transition-all ${
                  filterType === "expense" ? "bg-rose-600 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Gastos (Saídas)
              </button>
              <button
                onClick={() => setFilterType("recurring")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 border-slate-900 transition-all ${
                  filterType === "recurring" ? "bg-slate-900 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Recorrentes
              </button>
            </div>
          </div>

          {/* TABELA DE TRANSAÇÕES */}
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
                      Nenhum lançamento encontrado para os filtros selecionados.
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

                      <td className="py-3.5 px-3 text-center">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 hover:bg-rose-100 text-rose-600 rounded-lg border border-transparent hover:border-rose-900 transition-all"
                          title="Excluir Lançamento"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL ADICIONAR NOVO LANÇAMENTO */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 max-w-lg w-full shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-5 animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
                <h3 className="font-black text-xl text-slate-900">Novo Lançamento Financeiro</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-500 hover:text-slate-900 font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddTransaction} className="space-y-4">
                {/* Tipo de Fluxo (Ganho vs Gasto) */}
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

                {/* Recorrência */}
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

                {/* Título */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Título do Lançamento</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Servidor Vercel, Cliente Retainer X"
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                  />
                </div>

                {/* Valor & Categoria */}
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

                {/* Data & Status */}
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
                    Salvar Lançamento
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
