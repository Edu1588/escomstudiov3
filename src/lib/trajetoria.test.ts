import assert from "node:assert/strict";
import { test } from "node:test";
import { mesAno, ehAtual, ordenarExperiencias } from "./trajetoria";

test("mesAno entende os formatos usados", () => {
  assert.equal(mesAno("JUN 2025"), 202506);
  assert.equal(mesAno("nov 2022"), 202211);
  assert.equal(mesAno("06/2018"), 201806);
  assert.equal(mesAno("2019"), 201901);
  assert.equal(mesAno(""), 0);
});

test("ehAtual", () => {
  assert.ok(ehAtual("ATUAL"));
  assert.ok(ehAtual("Presente"));
  assert.ok(!ehAtual("MAI 2025"));
});

test("atual primeiro, depois do início mais recente para o mais antigo", () => {
  const lista = [
    { id: "a", period: "JUN 2018", location: "MAI 2021" },
    { id: "b", period: "JUN 2022", location: "OUT 2022" },
    { id: "c", period: "JUN 2025", location: "ATUAL" },
    { id: "d", period: "NOV 2022", location: "MAI 2025" },
    { id: "e", period: "MAR 2015", location: "ATUAL" },   // cadastrada depois, mas também atual
  ];
  assert.deepEqual(ordenarExperiencias(lista).map(x => x.id), ["c", "e", "d", "b", "a"]);
});

test("não altera a lista original", () => {
  const lista = [{ period: "2019" }, { period: "2021" }];
  ordenarExperiencias(lista);
  assert.equal(lista[0].period, "2019");
});
