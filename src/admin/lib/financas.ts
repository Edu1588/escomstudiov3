// Regras do controle financeiro do painel. Funções puras: a tela e a API só guardam e mostram,
// quem decide o que entra em cada mês é este módulo (testado em financas.test.ts).

export type Fluxo = "income" | "expense";          // income = ganho, expense = gasto
export type Tipo = "single" | "recurring";         // single = único (ou parcela), recurring = repete todo mês

export interface Lancamento {
  id: string;
  title: string;
  amount: number;
  flow: Fluxo;
  type: Tipo;
  category: string;
  date: string;                 // AAAA-MM-DD. No recorrente é o primeiro mês em que ele vale
  end_date?: string | null;     // recorrente: último mês (opcional; vazio = sem fim)
  status: "paid" | "pending";   // vale para o único/parcela
  paid_months?: string[];       // recorrente: meses (AAAA-MM) já pagos/recebidos
  card_id?: string | null;      // gasto feito no cartão
  group_id?: string | null;     // parcelas da mesma compra
  installment_n?: number | null;
  installment_total?: number | null;
}

export interface Cartao {
  id: string;
  name: string;
  last4: string;
  expiry: string;
  limit: number;
  color: string;
  brand: string;
}

export interface Ocorrencia {
  lanc: Lancamento;
  mes: string;      // AAAA-MM
  valor: number;
  pago: boolean;
}

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const MESES_LONGOS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

/** Valor digitado no padrão brasileiro: "1500", "1500,50", "1.500" e "1.500,50". */
export function valorBR(texto: string | number): number {
  if (typeof texto === "number") return texto;
  const s = String(texto ?? "").trim().replace(/[^\d.,-]/g, "");
  if (!s) return NaN;
  const n = s.includes(",") ? s.replace(/\./g, "").replace(",", ".") : s.replace(/\.(?=\d{3}(\D|$))/g, "");
  return parseFloat(n);
}

export const mesDe = (data: string): string => String(data || "").slice(0, 7);

export function mesAtual(hoje: Date = new Date()): string {
  return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}`;
}

/** Soma (ou subtrai) meses de um "AAAA-MM". */
export function somarMeses(mes: string, n: number): string {
  const [a, m] = mes.split("-").map(Number);
  const total = a * 12 + (m - 1) + n;
  return `${Math.floor(total / 12)}-${String((total % 12) + 1).padStart(2, "0")}`;
}

export const rotuloMes = (mes: string): string => MESES[Number(mes.slice(5, 7)) - 1] || mes;
export const rotuloMesLongo = (mes: string): string => `${MESES_LONGOS[Number(mes.slice(5, 7)) - 1] || ""} ${mes.slice(0, 4)}`;

/** Lançamentos que valem no mês: únicos/parcelas daquele mês e recorrentes ativos nele. */
export function ocorrenciasDoMes(lancamentos: Lancamento[], mes: string): Ocorrencia[] {
  const out: Ocorrencia[] = [];
  for (const l of lancamentos) {
    if (l.type === "recurring") {
      const inicio = mesDe(l.date);
      const fim = l.end_date ? mesDe(l.end_date) : null;
      if (inicio <= mes && (!fim || mes <= fim)) out.push({ lanc: l, mes, valor: l.amount, pago: (l.paid_months || []).includes(mes) });
    } else if (mesDe(l.date) === mes) {
      out.push({ lanc: l, mes, valor: l.amount, pago: l.status === "paid" });
    }
  }
  return out;
}

const centavos = (v: number) => Math.round(v * 100);
const reais = (c: number) => c / 100;

export interface Resumo {
  entradas: { realizado: number; previsto: number; total: number };
  saidas: { realizado: number; previsto: number; total: number };
  saldoRealizado: number;   // o que de fato entrou menos o que de fato saiu
  saldoPrevisto: number;    // fechamento do mês se tudo o que está pendente acontecer
  fixos: number;            // gastos recorrentes do mês
}

/** Resumo de um mês. "Realizado" = marcado como pago/recebido; "previsto" = ainda pendente. */
export function resumoDoMes(lancamentos: Lancamento[], mes: string): Resumo {
  let er = 0, ep = 0, sr = 0, sp = 0, fx = 0;   // em centavos, para não acumular erro de arredondamento
  for (const o of ocorrenciasDoMes(lancamentos, mes)) {
    const c = centavos(o.valor);
    if (o.lanc.flow === "income") { if (o.pago) er += c; else ep += c; }
    else {
      if (o.pago) sr += c; else sp += c;
      if (o.lanc.type === "recurring") fx += c;
    }
  }
  return {
    entradas: { realizado: reais(er), previsto: reais(ep), total: reais(er + ep) },
    saidas: { realizado: reais(sr), previsto: reais(sp), total: reais(sr + sp) },
    saldoRealizado: reais(er - sr),
    saldoPrevisto: reais(er + ep - sr - sp),
    fixos: reais(fx),
  };
}

/** Série para o gráfico: `antes` meses antes do mês central, o mês, e `depois` meses à frente (parcelas e fixos futuros). */
export function serieMeses(lancamentos: Lancamento[], mesCentral: string, antes = 3, depois = 2) {
  const out: { mes: string; rotulo: string; ganho: number; gasto: number }[] = [];
  for (let i = -antes; i <= depois; i++) {
    const mes = somarMeses(mesCentral, i);
    const r = resumoDoMes(lancamentos, mes);
    out.push({ mes, rotulo: rotuloMes(mes), ganho: r.entradas.total, gasto: r.saidas.total });
  }
  return out;
}

/** Limite usado do cartão = gastos no cartão ainda não pagos (inclui parcelas futuras, que ocupam o limite). */
export function usoDoCartao(cartaoId: string, lancamentos: Lancamento[]): number {
  let c = 0;
  for (const l of lancamentos) {
    if (l.card_id === cartaoId && l.flow === "expense" && l.type === "single" && l.status !== "paid") c += centavos(l.amount);
  }
  return reais(c);
}

/** Gastos do cartão a pagar até o fim de um mês (a "fatura" a quitar). */
export function faturaAte(cartaoId: string, lancamentos: Lancamento[], mes: string): Lancamento[] {
  return lancamentos.filter(l => l.card_id === cartaoId && l.flow === "expense" && l.type === "single" && l.status !== "paid" && mesDe(l.date) <= mes);
}

/** Divide um total em n parcelas sem perder centavos: a última absorve a diferença. */
export function dividirParcelas(total: number, n: number): number[] {
  const t = centavos(total);
  const base = Math.floor(t / n);
  return Array.from({ length: n }, (_, i) => reais(i === n - 1 ? t - base * (n - 1) : base));
}

/** Data da parcela i (0 = a primeira), mantendo o dia; em meses mais curtos usa o último dia (31/01 -> 28/02). */
export function dataDaParcela(dataInicial: string, i: number): string {
  const [a, m, d] = dataInicial.split("-").map(Number);
  const mes = somarMeses(`${a}-${String(m).padStart(2, "0")}`, i);
  const [na, nm] = mes.split("-").map(Number);
  const ultimoDia = new Date(na, nm, 0).getDate();
  return `${mes}-${String(Math.min(d, ultimoDia)).padStart(2, "0")}`;
}

/** Monta as parcelas de uma compra (sem id; quem grava gera os ids). */
export function montarParcelas(base: Omit<Lancamento, "id" | "amount" | "date" | "type" | "installment_n" | "installment_total" | "group_id" | "status">,
  total: number, n: number, dataInicial: string, groupId: string, statusPrimeira: "paid" | "pending"): Omit<Lancamento, "id">[] {
  return dividirParcelas(total, n).map((valor, i) => ({
    ...base,
    title: `${base.title} (${i + 1}/${n})`,
    amount: valor,
    type: "single" as Tipo,
    date: dataDaParcela(dataInicial, i),
    status: i === 0 ? statusPrimeira : "pending",
    group_id: groupId,
    installment_n: i + 1,
    installment_total: n,
  }));
}
