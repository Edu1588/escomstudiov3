// Ordem da Trajetória (Admin > Trajetória e /portfolioedu): primeiro o emprego atual, depois do início mais recente
// para o mais antigo. Antes era a ordem em que cada experiência foi cadastrada.
// Nos dados, "period" guarda o início (ex.: "JUN 2025") e "location" guarda o fim (ex.: "MAI 2025" ou "ATUAL").

const MESES: Record<string, number> = {
  JAN: 1, FEV: 2, FEB: 2, MAR: 3, ABR: 4, APR: 4, MAI: 5, MAY: 5, JUN: 6, JUL: 7, AGO: 8, AUG: 8,
  SET: 9, SEP: 9, OUT: 10, OCT: 10, NOV: 11, DEZ: 12, DEC: 12,
};

/** "JUN 2025", "jun/2025", "06/2025" ou "2025" -> número AAAAMM (0 se não reconhecer). */
export function mesAno(texto?: string): number {
  const t = String(texto || "").toUpperCase();
  const ano = t.match(/(19|20)\d{2}/);
  if (!ano) return 0;
  const sigla = t.match(/\b(JAN|FEV|FEB|MAR|ABR|APR|MAI|MAY|JUN|JUL|AGO|AUG|SET|SEP|OUT|OCT|NOV|DEZ|DEC)/);
  const num = t.match(/\b(0?[1-9]|1[0-2])\s*\/\s*(19|20)\d{2}/);
  const mes = sigla ? MESES[sigla[1]] : num ? Number(num[1]) : 1;
  return Number(ano[0]) * 100 + mes;
}

export const ehAtual = (fim?: string) => /ATUAL|PRESENTE|HOJE|CURRENT|NOW/i.test(String(fim || ""));

export function ordenarExperiencias<T extends { period?: string; location?: string }>(lista: T[]): T[] {
  return [...lista].sort((a, b) => {
    const atualA = ehAtual(a.location), atualB = ehAtual(b.location);
    if (atualA !== atualB) return atualA ? -1 : 1;
    return mesAno(b.period) - mesAno(a.period);
  });
}
