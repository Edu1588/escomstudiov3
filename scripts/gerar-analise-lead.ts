/**
 * Gera PDF de Análise Estratégica para um lead e salva no Firebase.
 *
 * Uso:
 *   npx tsx scripts/gerar-analise-lead.ts --leadId "academia-gavies-24h-premium---taquaral-campinas"
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import Groq from "groq-sdk";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const args = process.argv.slice(2);
function arg(name: string, fallback = ""): string {
  const i = args.indexOf(`--${name}`);
  return i !== -1 ? args[i + 1] : fallback;
}

const LEAD_ID = arg("leadId");
if (!LEAD_ID) { console.error("❌ Uso: npx tsx scripts/gerar-analise-lead.ts --leadId <id>"); process.exit(1); }

const SUPABASE_URL     = process.env.SUPABASE_URL || "";
const SUPABASE_SVC_KEY = process.env.SUPABASE_SERVICE_KEY || "";
const GROQ_KEY         = process.env.GROQ_API_KEY || "";
const SERPER_KEY       = process.env.SERPER_API_KEY || "";
const PAGESPEED_KEY    = process.env.PAGESPEED_API_KEY || "";

const firebaseConfig = {
  projectId: "escom-studio-portfolio",
  appId: "1:885439718303:web:531fc4658dd499cde713aa",
  apiKey: "AIzaSyDjDQAtyv_csEsFVZRsj1gYPLy81eDYKA8",
  authDomain: "escom-studio-portfolio.firebaseapp.com",
};
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

async function ensureAuth() {
  if (!auth.currentUser) {
    await signInWithEmailAndPassword(auth, process.env.FIREBASE_ADMIN_EMAIL!, process.env.FIREBASE_ADMIN_PASSWORD!);
  }
}

async function sbFetch(path: string) {
  const res = await fetch(SUPABASE_URL.replace(/\/$/, "") + path, {
    headers: { apikey: SUPABASE_SVC_KEY, Authorization: `Bearer ${SUPABASE_SVC_KEY}` },
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}`);
  return res.json();
}

async function getPageSpeed(url: string) {
  if (!PAGESPEED_KEY) return null;
  try {
    const p = new URLSearchParams({ url, strategy: "MOBILE", category: "PERFORMANCE", key: PAGESPEED_KEY });
    p.append("category", "SEO");
    const res = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${p}`);
    if (!res.ok) return null;
    const d: any = await res.json();
    const cats = d.lighthouseResult?.categories || {};
    return {
      performance: cats.performance ? Math.round(cats.performance.score * 100) : null,
      seo: cats.seo ? Math.round(cats.seo.score * 100) : null,
    };
  } catch { return null; }
}

async function main() {
  console.log(`\n🔬 Gerando Análise Estratégica`);
  console.log(`   Lead ID: ${LEAD_ID}\n`);

  // 1. Lead do Supabase
  console.log("📡 Buscando lead...");
  const rows = await sbFetch(`/rest/v1/leads?id=eq.${encodeURIComponent(LEAD_ID)}&select=*&limit=1`);
  const lead = rows?.[0];
  if (!lead) { console.error("❌ Lead não encontrado"); process.exit(1); }
  console.log(`   ✅ ${lead.nome} | ${lead.rating}⭐ (${lead.reviews_count} avaliações)`);

  const diag = lead.diagnostico || {};
  const ps = diag.pagespeed || {};

  // 2. Concorrentes via Serper
  let concorrentes: any[] = [];
  if (SERPER_KEY) {
    console.log("🔍 Buscando concorrentes via Serper...");
    try {
      const sr = await fetch("https://google.serper.dev/places", {
        method: "POST",
        headers: { "X-API-KEY": SERPER_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ q: `${lead.categoria} em ${lead.cidade}`, gl: "br", hl: "pt-br" }),
      });
      if (sr.ok) {
        const sd: any = await sr.json();
        concorrentes = (sd.places || [])
          .filter((p: any) => p.title && p.title.toLowerCase() !== lead.nome.toLowerCase())
          .slice(0, 5)
          .map((p: any) => ({ nome: p.title, rating: p.rating ?? null, reviews: p.ratingCount ?? null, temSite: !!p.website, site: p.website || null, endereco: p.address || null }));
        console.log(`   ✅ ${concorrentes.length} concorrentes encontrados`);
      }
    } catch {}
  }

  // 3. PageSpeed dos concorrentes
  const concorrentesComPS = await Promise.all(
    concorrentes.map(async (c) => {
      if (!c.site) return c;
      const ps = await getPageSpeed(c.site);
      return { ...c, pagespeed: ps };
    })
  );

  const concorrentesStr = concorrentesComPS.length > 0
    ? concorrentesComPS.map((c, i) => `${i + 1}. ${c.nome}
   - Rating: ${c.rating ?? "sem dados"} (${c.reviews ?? 0} avaliações)
   - Site: ${c.site || "não possui"}
   - PageSpeed: ${c.pagespeed ? `Performance ${c.pagespeed.performance}%, SEO ${c.pagespeed.seo}%` : "não analisado"}
   - Endereço: ${c.endereco || "não disponível"}`).join("\n\n")
    : "Dados de concorrentes não disponíveis.";

  // 4. Gerar HTML via Groq
  console.log("\n🤖 Gerando análise com Groq (pode levar 30-60s)...");
  const groq = new Groq({ apiKey: GROQ_KEY });

  const prompt = `Você é um estrategista sênior da ESCOM Studio. Gere um Relatório de Análise Estratégica completo em HTML para o lead abaixo.

DADOS DO LEAD:
Nome: ${lead.nome}
Nicho: ${lead.categoria}
Cidade: ${lead.cidade}
Rating Google: ${lead.rating || "não disponível"} estrelas (${lead.reviews_count || 0} avaliações)
Site atual: ${lead.website || "não possui site próprio"}
Score de oportunidade: ${lead.score_oportunidade || 0}/100
PageSpeed mobile: Performance ${ps.performance ?? "não disponível"}%, SEO ${ps.seo ?? "não disponível"}%, Acessibilidade ${ps.acessibilidade ?? "não disponível"}%
Diagnóstico UX: ${diag.identidadeVisualUI ? JSON.stringify({ identidadeVisual: diag.identidadeVisualUI, heuristicas: diag.heuristicasNielsen, arquitetura: diag.arquiteturaInformacao }) : "não disponível"}

CONCORRENTES REAIS (Google Maps):
${concorrentesStr}

REGRA CRÍTICA: Use APENAS os dados acima. PROIBIDO inventar informações. Se dados não disponíveis, escreva "dado não disponível".

Gere relatório HTML completo com as seções:
1. CAPA: Logo "ESCOM Studio" em #00d1ff, título "Análise Estratégica", nome "${lead.nome}", data ${new Date().toLocaleDateString("pt-BR")}
2. CONTEXTO DO NICHO: panorama do mercado de ${lead.categoria} em ${lead.cidade}
3. CAMPO DE BATALHA: tabela comparativa dos concorrentes reais acima — colunas: Nome, Rating, Avaliações, Tem Site, Performance, SEO
4. DIAGNÓSTICO DIGITAL: tabela com notas reais de Performance (${ps.performance ?? "N/D"}%), SEO (${ps.seo ?? "N/D"}%), Acessibilidade (${ps.acessibilidade ?? "N/D"}%) com badges FORTE/MÉDIO/FRACO
5. CONTRASTE REPUTAÇÃO × PRESENÇA DIGITAL: ${lead.rating} estrelas no Google vs site com performance ${ps.performance ?? "N/D"}%
6. OCEANO AZUL: oportunidades não exploradas identificadas nos dados reais dos concorrentes
7. JANELA DE OPORTUNIDADE: por que agir agora baseado na posição vs concorrentes
8. DIFERENCIAIS DISPONÍVEIS: 5 ações concretas e específicas para ${lead.nome}
9. SÍNTESE ESTRATÉGICA: 3 prioridades imediatas + estimativa de retorno
10. PROPOSTA ESCOM STUDIO: o que entregamos, prazo 15 dias, valor R$990, CTA "Contratar Agora"

DESIGN:
- Fundo: #ffffff, Primária ESCOM: #00d1ff, Secundária: #0a0a14
- Tabelas: header #0a0a14 texto #fff, linhas alternadas #f0f9ff
- Badges FORTE: bg #dcfce7 texto #166534; MÉDIO: #fef3c7 #92400e; FRACO: #fee2e2 #991b1b
- Fontes: Playfair Display + Plus Jakarta Sans (Google Fonts)
- @page { size: A4; margin: 20mm } @media print { box-shadow: none }
- Cada seção com page-break-after: always exceto última

Retorne APENAS o HTML completo (<!DOCTYPE html>...). Sem markdown.`;

  const r = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [
      { role: "system", content: "Você gera relatórios HTML profissionais. Retorne APENAS HTML puro começando com <!DOCTYPE html>." },
      { role: "user", content: prompt }
    ],
    temperature: 0.2,
    max_tokens: 16000,
  });

  let html = r.choices?.[0]?.message?.content || "";
  if (html.includes("```html")) html = html.split("```html")[1].split("```")[0].trim();
  else if (html.includes("```")) html = html.split("```")[1].split("```")[0].trim();
  const lower = html.toLowerCase();
  const idx = lower.includes("<!doctype") ? lower.indexOf("<!doctype") : lower.indexOf("<html");
  if (idx > 0) html = html.slice(idx);

  if (!html.toLowerCase().includes("<html")) {
    console.error("❌ Groq não retornou HTML válido"); process.exit(1);
  }
  console.log(`   ✅ Análise gerada (${html.length.toLocaleString()} chars)`);

  // 5. Salva no Firebase
  console.log("\n🔥 Salvando no Firebase...");
  await ensureAuth();
  const analiseId = `analise_${LEAD_ID}`;
  await setDoc(doc(db, "generated_sites", analiseId), {
    companyName: lead.nome,
    niche: lead.categoria,
    tipo: "analise_estrategica",
    htmlContent: html,
    leadId: LEAD_ID,
    score: lead.score_oportunidade,
    rating: lead.rating,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }, { merge: true });
  console.log(`   ✅ Salvo: generated_sites/${analiseId}`);

  // 6. Salva link no lead do Supabase
  const analiseUrl = `https://www.escomstudio.com.br/api/site-preview/${analiseId}`;
  try {
    await fetch(`${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/leads?id=eq.${LEAD_ID}`, {
      method: "PATCH",
      headers: { apikey: SUPABASE_SVC_KEY, Authorization: `Bearer ${SUPABASE_SVC_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ analise_gerada: analiseUrl }),
    });
    console.log("   ✅ Link salvo no lead Supabase");
  } catch {}

  console.log(`\n✅ Concluído!`);
  console.log(`   📊 Análise: ${analiseUrl}\n`);
}

main().catch(err => { console.error("❌ Erro:", err.message); process.exit(1); });
