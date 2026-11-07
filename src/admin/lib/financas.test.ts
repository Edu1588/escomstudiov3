// Testes das regras financeiras. Rodar: npx esbuild src/admin/lib/financas.test.ts --bundle --platform=node --outfile=<tmp>.cjs && node <tmp>.cjs
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  valorBR, somarMeses, ocorrenciasDoMes, resumoDoMes, serieMeses, usoDoCartao, faturaAte,
  dividirParcelas, dataDaParcela, montarParcelas, type Lancamento,
} from "./financas";

const L = (p: Partial<Lancamento>): Lancamento => ({
  id: Math.random().toString(36).slice(2), title: "x", amount: 0, flow: "expense", type: "single",
  category: "Outros", date: "2026-10-05", status: "pending", ...p,
});

test("valorBR aceita os formatos brasileiros", () => {
  assert.equal(valorBR("1500"), 1500);
  assert.equal(valorBR("1.500"), 1500);
  assert.equal(valorBR("1.500,50"), 1500.5);
  assert.equal(valorBR("1500,5"), 1500.5);
  assert.ok(Number.isNaN(valorBR("")));
});

test("somarMeses atravessa o ano", () => {
  assert.equal(somarMeses("2026-11", 2), "2027-01");
  assert.equal(somarMeses("2026-01", -1), "2025-12");
});

test("único conta só no próprio mês", () => {
  const ls = [L({ amount: 100, date: "2026-10-10" })];
  assert.equal(ocorrenciasDoMes(ls, "2026-10").length, 1);
  assert.equal(ocorrenciasDoMes(ls, "2026-11").length, 0);
});

test("recorrente repete todo mês a partir do início, até o fim se houver", () => {
  const sem = L({ type: "recurring", amount: 500, date: "2026-08-01" });
  assert.equal(ocorrenciasDoMes([sem], "2026-07").length, 0);
  assert.equal(ocorrenciasDoMes([sem], "2026-08").length, 1);
  assert.equal(ocorrenciasDoMes([sem], "2027-03").length, 1);
  const com = L({ type: "recurring", amount: 500, date: "2026-08-01", end_date: "2026-10-31" });
  assert.equal(ocorrenciasDoMes([com], "2026-10").length, 1);
  assert.equal(ocorrenciasDoMes([com], "2026-11").length, 0);
});

test("recorrente: pago por mês, não para sempre", () => {
  const r = L({ type: "recurring", amount: 500, date: "2026-08-01", paid_months: ["2026-09"] });
  assert.equal(ocorrenciasDoMes([r], "2026-09")[0].pago, true);
  assert.equal(ocorrenciasDoMes([r], "2026-10")[0].pago, false);
});

test("resumo separa realizado de previsto e calcula os saldos", () => {
  const ls = [
    L({ flow: "income", amount: 3000, status: "paid", date: "2026-10-02" }),
    L({ flow: "income", amount: 1000, status: "pending", date: "2026-10-20" }),
    L({ flow: "expense", amount: 400, status: "paid", date: "2026-10-03" }),
    L({ flow: "expense", type: "recurring", amount: 600, date: "2026-01-01" }),     // aluguel, não pago em outubro
    L({ flow: "expense", amount: 999, status: "paid", date: "2026-09-30" }),          // outro mês: fica fora
  ];
  const r = resumoDoMes(ls, "2026-10");
  assert.deepEqual(r.entradas, { realizado: 3000, previsto: 1000, total: 4000 });
  assert.deepEqual(r.saidas, { realizado: 400, previsto: 600, total: 1000 });
  assert.equal(r.saldoRealizado, 2600);
  assert.equal(r.saldoPrevisto, 3000);
  assert.equal(r.fixos, 600);
});

test("resumo não acumula erro de centavos", () => {
  const ls = Array.from({ length: 10 }, () => L({ flow: "expense", amount: 0.1, status: "paid" }));
  assert.equal(resumoDoMes(ls, "2026-10").saidas.realizado, 1);
});

test("dividirParcelas não perde centavos", () => {
  assert.deepEqual(dividirParcelas(100, 3), [33.33, 33.33, 33.34]);
  assert.equal(dividirParcelas(1000, 7).reduce((a, b) => a + b, 0).toFixed(2), "1000.00");
  assert.deepEqual(dividirParcelas(50, 1), [50]);
});

test("dataDaParcela mantém o dia e ajusta meses curtos", () => {
  assert.equal(dataDaParcela("2026-01-31", 1), "2026-02-28");
  assert.equal(dataDaParcela("2026-11-15", 2), "2027-01-15");
  assert.equal(dataDaParcela("2028-01-31", 1), "2028-02-29");
});

test("montarParcelas: grupo, numeração, status e soma exata", () => {
  const ps = montarParcelas({ title: "Notebook", flow: "expense", category: "Equipamentos & Compras", card_id: "c1" },
    1000, 3, "2026-10-10", "g1", "paid");
  assert.equal(ps.length, 3);
  assert.deepEqual(ps.map(p => p.title), ["Notebook (1/3)", "Notebook (2/3)", "Notebook (3/3)"]);
  assert.deepEqual(ps.map(p => p.status), ["paid", "pending", "pending"]);
  assert.deepEqual(ps.map(p => p.date), ["2026-10-10", "2026-11-10", "2026-12-10"]);
  assert.ok(ps.every(p => p.group_id === "g1" && p.card_id === "c1" && p.type === "single"));
  assert.equal(ps.reduce((a, p) => a + p.amount, 0).toFixed(2), "1000.00");
});

test("cartão: usado = gastos não pagos; pagar libera o limite", () => {
  const ps = montarParcelas({ title: "TV", flow: "expense", category: "Outros", card_id: "c1" }, 1200, 3, "2026-10-10", "g", "pending")
    .map((p, i) => ({ ...p, id: "p" + i })) as Lancamento[];
  const outro = L({ card_id: "c2", amount: 50 });
  const todos = [...ps, outro];
  assert.equal(usoDoCartao("c1", todos), 1200);
  assert.equal(faturaAte("c1", todos, "2026-10").length, 1);
  assert.equal(faturaAte("c1", todos, "2026-11").length, 2);
  todos[0] = { ...todos[0], status: "paid" };
  assert.equal(usoDoCartao("c1", todos), 800);
});

test("série do gráfico inclui meses futuros com parcelas e fixos", () => {
  const ls = [
    ...montarParcelas({ title: "TV", flow: "expense", category: "Outros", card_id: null }, 300, 3, "2026-10-10", "g", "pending")
      .map((p, i) => ({ ...p, id: "p" + i })) as Lancamento[],
    L({ flow: "income", type: "recurring", amount: 5000, date: "2026-09-01" }),
  ];
  const s = serieMeses(ls, "2026-10", 1, 2);
  assert.deepEqual(s.map(x => x.mes), ["2026-09", "2026-10", "2026-11", "2026-12"]);
  assert.deepEqual(s.map(x => x.gasto), [0, 100, 100, 100]);
  assert.deepEqual(s.map(x => x.ganho), [5000, 5000, 5000, 5000]);
});
