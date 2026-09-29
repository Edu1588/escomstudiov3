/**
 * Busca leads via Serper, qualifica com PageSpeed + Gemini, salva no Supabase.
 *
 * Uso:
 *   npx tsx scripts/buscar-leads.ts --nicho "Barbearia" --cidade "Marilia" --estado SP --quantidade 10
 *
 * Env vars necessárias em .env.local:
 *   SERPER_API_KEY, PAGESPEED_API_KEY, GEMINI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY
 */
import { config } from "dotenv";
config({ path: ".env.local" });

// ── Args ──────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
function arg(name: string, fallback = ""): string {
  const i = args.indexOf(`--${name}`);
  return i !== -1 ? args[i + 1] : fallback;
}

const NICHO      = arg("nicho",      "Barbearia");
const CIDADE     = arg("cidade",     "São Paulo");
const ESTADO     = arg("estado",     "SP");
const QUANTIDADE = parseInt(arg("quantidade", "10"));

// ── Credenciais ───────────────────────────────────────────────────────────────
const SERPER_KEY       = process.env.SERPER_API_KEY       || "";
const PAGESPEED_KEY    = process.env.PAGESPEED_API_KEY    || "";
const SUPABASE_URL     = process.env.SUPABASE_URL         || "";
const SUPABASE_SVC_KEY = process.env.SUPABASE_SERVICE_KEY || "";

if (!SERPER_KEY || !SUPABASE_URL || !SUPABASE_SVC_KEY) {
  console.error("❌ Faltam variáveis: SERPER_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY");
  process.exit(1);
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function sbFetch(path: string, options: RequestInit = {}) {
  const url = SUPABASE_URL.replace(/\/$/, "") + path;
  const res = await fetch(url, {
    ...options,
    headers: {
      apikey: SUPABASE_SVC_KEY,
      Authorization: `Bearer ${SUPABASE_SVC_KEY}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Supabase ${res.status}: ${txt}`);
  }
  return res;
}

// ── 1. Busca no Serper ────────────────────────────────────────────────────────
async function buscarPlaces(nicho: string, cidade: string, estado: string, quantidade: number) {
  console.log(`\n🔍 Buscando: ${nicho} em ${cidade}, ${estado}`);
  const query = `${nicho} em ${cidade}, ${estado}`;
  const res = await fetch("https://google.serper.dev/places", {
    method: "POST",
    headers: { "X-API-KEY": SERPER_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ q: query, gl: "br", hl: "pt-br" }),
  });
  if (!res.ok) throw new Error(`Serper ${res.status}`);
  const data: any = await res.json();
  const places = (data.places || []).slice(0, quantidade);
  console.log(`   ✅ ${places.length} lugares encontrados`);
  return places;
}

// ── 2. PageSpeed ──────────────────────────────────────────────────────────────
async function getPageSpeed(url: string) {
  if (!PAGESPEED_KEY) return null;
  try {
    const params = new URLSearchParams({
      url,
      strategy: "MOBILE",
      category: "PERFORMANCE",
      key: PAGESPEED_KEY,
    });
    // Adiciona múltiplas categorias
    ["ACCESSIBILITY", "SEO", "BEST_PRACTICES"].forEach(c => params.append("category", c));
    const res = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`);
    if (!res.ok) return null;
    const data: any = await res.json();
    const cats = (data.lighthouseResult || {}).categories || {};
    return {
      performance:   cats.performance    ? Math.round(cats.performance.score * 100)    : null,
      acessibilidade: cats.accessibility ? Math.round(cats.accessibility.score * 100)  : null,
      seo:           cats.seo            ? Math.round(cats.seo.score * 100)            : null,
      boasPraticas:  cats["best-practices"] ? Math.round(cats["best-practices"].score * 100) : null,
    };
  } catch {
    return null;
  }
}

// ── 3. Groq ───────────────────────────────────────────────────────────────────
import Groq from "groq-sdk";

const GROQ_KEY = process.env.GROQ_API_KEY || "";

async function analisarComGroq(lead: any, pagespeed: any): Promise<any> {
  if (!GROQ_KEY) return null;
  try {
    const groq = new Groq({ apiKey: GROQ_KEY });
    const prompt = `Você é um auditor sênior de UX/UI e conversão.
Avalie o site abaixo com base nas métricas técnicas fornecidas.

Negócio: ${lead.nome} (${lead.categoria})
Site: ${lead.website}
PageSpeed (mobile): ${JSON.stringify(pagespeed)}

Avalie 5 dimensões de 0 a 10:
(1) Identidade Visual e UI
(2) Heurísticas de Nielsen
(3) Vieses Cognitivos e Dark Patterns
(4) Arquitetura da Informação
(5) Acessibilidade

Responda APENAS JSON (sem markdown):
{"identidadeVisualUI":{"nota":0,"comentario":""},"heuristicasNielsen":{"nota":0,"comentario":""},"viesesCognitivosDarkPatterns":{"nota":0,"comentario":"","darkPatternsDetectados":[]},"arquiteturaInformacao":{"nota":0,"comentario":""},"acessibilidade":{"nota":0,"comentario":""},"resumoGeral":"","principaisProblemas":[]}`;

    const r = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_tokens: 2000,
    });
    const raw = r.choices?.[0]?.message?.content || "";
    const limpo = raw.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(limpo);
  } catch {
    return null;
  }
}

// ── 4. Calcula score ──────────────────────────────────────────────────────────
function calcularScore(pagespeed: any, gemini: any): number {
  let score = 20;
  if (pagespeed) {
    if (pagespeed.performance   !== null) score += pagespeed.performance   < 50 ? 20 : pagespeed.performance   < 80 ? 10 : 0;
    if (pagespeed.acessibilidade !== null) score += pagespeed.acessibilidade < 50 ? 15 : pagespeed.acessibilidade < 80 ?  7 : 0;
  }
  if (gemini) {
    const media = (gemini.identidadeVisualUI.nota + gemini.heuristicasNielsen.nota +
      gemini.viesesCognitivosDarkPatterns.nota + gemini.arquiteturaInformacao.nota +
      gemini.acessibilidade.nota) / 5;
    score += media < 4 ? 30 : media < 7 ? 15 : 0;
  }
  return Math.min(score, 100);
}

// ── 5. Salva no Supabase ──────────────────────────────────────────────────────
async function salvarLead(lead: any) {
  const nomeNorm = lead.nome.toLowerCase().trim();
  const id = nomeNorm.replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").substring(0, 80)
    + "-" + (lead.cidade || "").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  await sbFetch("/rest/v1/leads", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" } as any,
    body: JSON.stringify({
      id,
      nome:            lead.nome,
      nome_normalizado: nomeNorm,
      endereco:        lead.endereco   || null,
      telefone:        lead.telefone   || null,
      website:         lead.website    || null,
      rating:          lead.rating     ?? null,
      reviews_count:   lead.reviewsCount ?? null,
      categoria:       lead.categoria  || null,
      cidade:          lead.cidade     || null,
      tem_site:        !!lead.website,
      score_oportunidade: lead.scoreOportunidade ?? 50,
      diagnostico:     lead.diagnostico || null,
      status:          "novo",
      criado_em:       new Date().toISOString(),
      atualizado_em:   new Date().toISOString(),
    }),
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n🚀 Escom Prospecção — Local`);
  console.log(`   Nicho: ${NICHO} | Cidade: ${CIDADE}/${ESTADO} | Qtd: ${QUANTIDADE}`);

  const places = await buscarPlaces(NICHO, CIDADE, ESTADO, QUANTIDADE);
  if (!places.length) { console.log("Nenhum lugar encontrado."); return; }

  let salvos = 0;
  for (let i = 0; i < places.length; i++) {
    const p = places[i];
    const nome = p.title || "";
    if (!nome) continue;

    const lead: any = {
      nome,
      endereco:     p.address      || null,
      telefone:     p.phoneNumber  || null,
      website:      p.website      || null,
      rating:       p.rating       ?? null,
      reviewsCount: p.ratingCount  ?? null,
      categoria:    NICHO,
      cidade:       CIDADE,
    };

    console.log(`\n[${i + 1}/${places.length}] ${nome}`);

    if (lead.website) {
      console.log(`   📊 PageSpeed: ${lead.website}`);
      const pagespeed = await getPageSpeed(lead.website);

      let gemini = null;
      if (pagespeed) {
        console.log(`   🤖 Gemini...`);
        gemini = await analisarComGroq(lead, pagespeed);
        await sleep(1000); // rate limit
      }

      lead.temSite         = true;
      lead.scoreOportunidade = calcularScore(pagespeed, gemini);
      lead.diagnostico     = pagespeed
        ? { pagespeed, ...(gemini || {}) }
        : null;

      console.log(`   ✅ Score: ${lead.scoreOportunidade} | PS: perf=${pagespeed?.performance ?? "?"}%`);
    } else {
      lead.temSite          = false;
      lead.scoreOportunidade = 100;
      lead.diagnostico      = null;
      console.log(`   ⚡ Sem site — score 100`);
    }

    try {
      await salvarLead(lead);
      salvos++;
      console.log(`   💾 Salvo no Supabase`);
    } catch (e: any) {
      console.error(`   ❌ Erro ao salvar: ${e.message}`);
    }
  }

  console.log(`\n✅ Concluído: ${salvos}/${places.length} leads salvos no Supabase.\n`);
}

main().catch(err => { console.error("Erro fatal:", err); process.exit(1); });
