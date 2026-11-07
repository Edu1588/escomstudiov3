// Contador de visitas: manda para a API do site (/api/visita), que soma no Supabase.
// Os ids das páginas são os mesmos que o painel usa: home, construtora, portfolio-projetos, portfolioedu, baseproposta, sobre, piassa.
export type PaginaContada = "home" | "construtora" | "portfolio-projetos" | "portfolioedu" | "baseproposta" | "sobre" | "piassa";

export function logPageView(pagina: PaginaContada) {
  try {
    const corpo = JSON.stringify({ pagina });
    // sendBeacon não atrasa a página e envia mesmo se a pessoa sair logo
    if (navigator.sendBeacon && navigator.sendBeacon("/api/visita", new Blob([corpo], { type: "application/json" }))) return;
    fetch("/api/visita", { method: "POST", headers: { "Content-Type": "application/json" }, body: corpo, keepalive: true }).catch(() => {});
  } catch { /* o contador nunca pode quebrar a página */ }
}
