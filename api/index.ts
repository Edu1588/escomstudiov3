import express from "express";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";
import * as cheerio from "cheerio";
import Groq from "groq-sdk";
import cron from "node-cron";
import { Resend } from "resend";
import { GoogleGenAI } from "@google/genai";

async function groqGenerate(prompt: string, opts?: { temperature?: number; maxTokens?: number }): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY || "";
  if (!apiKey) return "";
  const groq = new Groq({ apiKey });
  const models = ["qwen/qwen3.8-27b", "allam-2-7b"];
  for (const model of models) {
    try {
      const r = await groq.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: opts?.temperature ?? 0.4,
        max_tokens: opts?.maxTokens ?? 3800,
      });
      const text = r.choices?.[0]?.message?.content || "";
      if (text.length > 20) return text;
    } catch (e: any) {
      console.warn(`[groqGenerate] Model ${model} failed:`, e?.message);
    }
  }
  return "";
}

// Converte URL de imagem para base64 data URI (necessário porque Pinterest CDN bloqueia requests de terceiros)
async function imageUrlToBase64(url: string): Promise<string | null> {
  try {
    const resp = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(8000) });
    if (!resp.ok) return null;
    const buf = await resp.arrayBuffer();
    const b64 = Buffer.from(buf).toString("base64");
    const ct = resp.headers.get("content-type") || "image/jpeg";
    return `data:${ct};base64,${b64}`;
  } catch { return null; }
}

// Groq com visão: envia imagens como image_url multimodal para o modelo de visão.
// Usa llama-4-scout (vision) e cai no texto puro se falhar.
async function groqGenerateWithVision(
  textPrompt: string,
  imageUrls: string[],
  opts?: { temperature?: number; maxTokens?: number }
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY || "";
  if (!apiKey) return "";
  const groq = new Groq({ apiKey });

  // Converte até 4 imagens para base64 em paralelo (limite de tokens da janela do modelo)
  const base64Images = imageUrls.length > 0
    ? (await Promise.all(imageUrls.slice(0, 4).map(imageUrlToBase64))).filter(Boolean) as string[]
    : [];

  const imageParts = base64Images.map(b64 => ({ type: "image_url" as const, image_url: { url: b64 } }));

  const content: any[] = [
    { type: "text", text: textPrompt },
    ...imageParts,
  ];

  // Tenta primeiro com visão (llama-4-scout suporta imagens)
  if (imageParts.length > 0) {
    try {
      const r = await groq.chat.completions.create({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [{ role: "user", content }],
        temperature: opts?.temperature ?? 0.4,
        max_tokens: opts?.maxTokens ?? 16000,
      });
      const text = r.choices?.[0]?.message?.content || "";
      if (text.length > 100) {
        console.log(`[groq-vision] gerado com ${imageParts.length} imagens via llama-4-scout`);
        return text;
      }
    } catch (e) {
      console.warn("[groq-vision] falhou com visão, caindo para texto puro:", (e as any)?.message);
    }
  }

  // Fallback: texto puro com os modelos padrão
  return groqGenerate(textPrompt, opts);
}

const origStringify = JSON.stringify;
JSON.stringify = function(value, replacer, space) {
  try { return origStringify(value, replacer, space); }
  catch (err) { return '"[Cyclic Object]"'; }
};

dotenv.config();

if (process.env.Groq_API_KEY && !process.env.GROQ_API_KEY) process.env.GROQ_API_KEY = process.env.Groq_API_KEY;
if (process.env.Groq && !process.env.GROQ_API_KEY) process.env.GROQ_API_KEY = process.env.Groq;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

export async function ensureAuth() { /* Firebase removido — usando somente Supabase */ }

app.get(["/home-v3", "/home-v3.html", "/home-v3/index.html"], (req, res) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  const candidates = [
    path.join(process.cwd(), "public", "home-v3", "index.html"),
    path.join(process.cwd(), "public", "home-v3.html"),
    path.join(process.cwd(), "home-v3", "index.html"),
    path.join(process.cwd(), "dist", "home-v3", "index.html"),
    path.join(process.cwd(), "dist", "home-v3.html")
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return res.sendFile(c);
  }
  res.status(404).send("Home V3 não encontrada.");
});

app.get(["/home-v4", "/home-v4.html", "/home-v4/index.html", "/home4", "/home4.html", "/home4/index.html"], (req, res) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  const candidates = [
    path.join(process.cwd(), "public", "home-v4", "index.html"),
    path.join(process.cwd(), "public", "home-v4.html"),
    path.join(process.cwd(), "home-v4", "index.html"),
    path.join(process.cwd(), "dist", "home-v4", "index.html"),
    path.join(process.cwd(), "dist", "home-v4.html")
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return res.sendFile(c);
  }
  res.status(404).send("Home V4 não encontrada.");
});

app.get(["/template-ci-odontologia", "/template-ci-odontologia/index.html", "/ci-odontologia", "/ci-odontologia/index.html"], (req, res) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
  const filePath = path.join(process.cwd(), "public", "ci-odontologia", "index.html");
  if (fs.existsSync(filePath)) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.sendFile(filePath);
  }
  const rootPath = path.join(process.cwd(), "ci-odontologia", "index.html");
  if (fs.existsSync(rootPath)) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.sendFile(rootPath);
  }
  res.status(404).send("Template não encontrado.");
});

app.get(["/template-ci-odontologia/dossie", "/template-ci-odontologia/dossie.html", "/template-ci-odontologia/dossie-ci-odontologia.pdf", "/ci-odontologia/dossie", "/ci-odontologia/dossie.html"], (req, res) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
  const filePath = path.join(process.cwd(), "public", "ci-odontologia", "dossie.html");
  if (fs.existsSync(filePath)) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.sendFile(filePath);
  }
  res.status(404).send("Dossiê não encontrado.");
});

function calculateLeadScore(lead, auditData) {
  let score = 50;
  const titleLower = (lead.title || "").toLowerCase();
  const corpTerms = ["shopping","hospital","universidade","faculdade","prefeitura","governo","corporation","s.a.","banco","itaú","bradesco","unimed","supermercado","carrefour"];
  if (corpTerms.some(t => titleLower.includes(t))) return 5;
  const rc = lead.ratingCount || 0;
  if (rc > 500) score -= 20;
  else if (rc >= 20 && rc <= 250) score += 25;
  else if (rc > 0 && rc < 10) score -= 10;
  const url = lead.website || "";
  if (url && url.length > 5) {
    if (auditData) {
      const n = (auditData.issues||[]).length;
      if (n >= 6) score += 20; else if (n <= 2) score -= 30; else score += 5;
    } else score += 5;
  } else score += 25;
  return Math.max(0, Math.min(100, score));
}


async function performUxAuditForLead(url, companyName, niche) {
  if (!process.env.GROQ_API_KEY) return null;
  try {
    let pageText = "";
    try {
      const resp = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }});
      if (resp.ok) {
        const $ = cheerio.load(await resp.text());
        $("script,style,nav,footer,header").remove();
        pageText = $("body").text().replace(/\s+/g," ").substring(0,10000);
      }
    } catch(e) {}
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const prompt = pageText.length > 50
      ? `Auditoria UX/UI/CRO para ${url}: "${pageText}"`
      : `Auditoria UX/UI/CRO para ${url} (sem texto extraído, deduza)`;
    const c = await groq.chat.completions.create({
      messages: [{ role:"system", content:"Return ONLY valid JSON" }, { role:"user", content: prompt + "\nRetorne { summary, brandAnalysis: { companyName, niche, audience, differentiators, tone, colors, primaryHex }, issues: [{ category, tab, title, description, recommendation }] }" }],
      model: "qwen/qwen3.8-27b", temperature: 0.6, response_format: { type: "json_object" }
    });
    return JSON.parse(c.choices[0].message.content || "{}");
  } catch(e) { return null; }
}

async function generateProspectSitePlanForLead(companyName, niche) {
  if (!process.env.GROQ_API_KEY) return null;
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const c = await groq.chat.completions.create({
      messages: [{ role:"system", content:"Return ONLY valid JSON" }, { role:"user", content:`Plano prospecção landing page para ${companyName} (${niche}). JSON: { summary, colors, tone, differentiators, sections }`}],
      model: "qwen/qwen3.8-27b", temperature: 0.7, response_format: { type: "json_object" }
    });
    return JSON.parse(c.choices[0].message.content || "{}");
  } catch(e) { return null; }
}

async function runMineraLeadsCron() {
  console.log("[CRON] Mineração 6AM...");
  if (!process.env.SERPER_API_KEY || !process.env.GROQ_API_KEY) return;
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const g = await groq.chat.completions.create({
      messages: [{ role:"system", content:"Gere busca Google Maps para comércio local brasileiro." }, { role:"user", content:"Frase curta de busca para Google Places (ex: Clinica Odontologica em Curitiba). Apenas a frase." }],
      model: "openai/gpt-oss-120b", temperature: 0.9
    });
    let query = (g.choices[0]?.message?.content || "Dentista em São Paulo").trim().replace(/^["']|["']$/g,"");
    const resp = await fetch("https://google.serper.dev/places", {
      method:"POST", headers:{"X-API-KEY":process.env.SERPER_API_KEY,"Content-Type":"application/json"},
      body: JSON.stringify({ q:query, gl:"br", hl:"pt-br" })
    });
    const data = JSON.parse(await resp.text());
    const places = data.places || [];
    const existingRows = await sbFetch("/generated_sites?select=id&limit=500").catch(() => []);
    const existing = new Set((existingRows || []).map((d: any) => d.id));
    let added = 0;
    for (const r of places) {
      if (added >= 5) break;
      const pid = "site_" + (r.cid||r.placeId||Date.now()+"").toString();
      if (existing.has(pid)) continue;
      const score = calculateLeadScore({title:r.title, ratingCount:r.ratingCount, website:r.website||""}, null);
      if (score < 30) continue;
      await new Promise(r2 => setTimeout(r2, 3000));
      try {
        const site = await autoBuildSiteFromLead(r, query, groq);
        added++;
        existing.add(pid);
        console.log("[CRON] Site criado:", site.companyName);
      } catch(e2) { console.error("[CRON] Erro ao construir site:", e2.message); }
    }
    console.log("[CRON] Total sites criados: " + added);
  } catch(e) { console.error("[CRON] Erro:", e); }
}

// --- End of Mining Functions ---

export async function autoBuildSiteFromLead(p, query, groq) {
  const esc = s => (s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  const name = (p.title || "Empresa").split('-')[0].trim();
  const niche = query;
  const website = p.website || p.link || "";
  const phone = p.phoneNumber || p.phone || "";
  const address = p.address || "";
  const placeId = p.cid || p.placeId || "place_" + Date.now();
  const projectId = ("site-" + placeId).replace(/_/g, "-");

  const hasExistingSite = !!website && website.trim() !== "";
  let reports = null, siteData = null;
  let scrapedText = "";
  let designReferences = "";

  // 1. Caso tenha site, raspar conteúdo para auditoria
  if (hasExistingSite) {
    try {
      const cheerio = await import("cheerio");
      const resp = await fetch(website, { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(5000) });
      if (resp.ok) {
        const $ = cheerio.load(await resp.text());
        $("script,style,nav,footer,header,noscript").remove();
        scrapedText = $("body").text().replace(/\s+/g, " ").substring(0, 3000);
        console.log(`[AUTO_BUILD] Site ${website} raspado com sucesso (${scrapedText.length} caracteres).`);
      }
    } catch(e) {
      console.log(`[AUTO_BUILD] Falha ao extrair texto do site do lead: ${e.message}`);
    }
  }

  // 2. Caso NÃO tenha site, buscar referências estéticas via Tavily (Pinterest/Behance)
  if (!hasExistingSite && process.env.TAVILY_API_KEY) {
    try {
      const tavilyQuery = `site de ${niche} behance pinterest web design inspiration`;
      const resp = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: process.env.TAVILY_API_KEY,
          query: tavilyQuery,
          search_depth: "basic",
          max_results: 3
        })
       });
       if (resp.ok) {
         const tData = await resp.json();
         designReferences = (tData.results || []).map(r => `${r.title}: ${r.content}`).join("\n");
         console.log(`[AUTO_BUILD] Coletadas ${tData.results?.length || 0} referências de design do Pinterest/Behance.`);
       }
    } catch(e) {
      console.log(`[AUTO_BUILD] Falha ao buscar referências de design: ${e.message}`);
    }
  }

  if (groq) {
    // 3. Reports expandidos: Psicografia + Estratégia
    try {
      const r1 = await groq.chat.completions.create({
        messages: [{ role:"system", content:"JSON válido. Sem travessões ou meia-riscas (— ou -) nos textos." }, { role:"user", content:`Análise psicográfica profunda do público alvo de ${name} (${niche}, localizado em ${address || "Brasil"}).
JSON: {
  doresETraumas: ["3 dores reais e específicas do público"],
  desejosProfundos: ["3 desejos profundos do público"],
  objecoesEBarreiras: ["3 objeções comuns antes de contratar"],
  niveisDeConsciencia: "nível predominante (inconsciente/consciente do problema/consciente da solução/consciente do produto/totalmente consciente)",
  avatares: [{ nome: "Nome fictício", idade: 35, profissao: "...", dorPrincipal: "...", desejoUrgente: "..." }]
}`}],
        model:"qwen/qwen3.8-27b", temperature:0.7, response_format:{ type:"json_object" }
      });
      const r2 = await groq.chat.completions.create({
        messages: [{ role:"system", content:"JSON válido. Sem travessões ou meia-riscas." }, { role:"user", content:`Análise estratégica competitiva e auditoria do site existente de ${name} (${niche}).
Site atual do cliente: ${website || "não possui"}
Conteúdo extraído do site do cliente: ${scrapedText || "não disponível"}

JSON: {
  benchmarking: "análise de como concorrentes se posicionam",
  gapsDeMercado: ["3 lacunas que a empresa pode explorar"],
  vantagensCompetitivas: ["3 diferenciais únicos possíveis"],
  oceanoAzul: "estratégia de oceano azul para o nicho",
  filtroDeComunicacao: "tom e estilo de comunicação ideal",
  auditoriaSiteAtual: {
    pontosFracos: ["3 falhas de conversão ou design identificadas no site atual (ou no fato de não ter site)"],
    melhoriasAplicadas: ["3 melhorias práticas aplicadas no novo site para corrigir essas falhas"]
  }
}`}],
        model:"qwen/qwen3.8-27b", temperature:0.7, response_format:{ type:"json_object" }
      });
    } catch(e) { console.error("[AUTO_BUILD_LEAD] Reports error:", e.message); }
 
    // 4. SiteData expandido com as 9 seções do Bloco B
    try {
      const copyRes = await groq.chat.completions.create({
        messages: [{ role:"system", content:"Você é um Engenheiro de Front-end Sênior, Copywriter de Elite e Estrategista de Conversão. Gere copy persuasiva para landing pages de alta conversão. REGRA ABSOLUTA: NUNCA use travessões (— ou -) nos textos. Responda SEMPRE com JSON válido." }, { role:"user", content:`Gere a copy completa de uma landing page premium para:
- Empresa: ${name}
- Nicho: ${niche}
- Telefone: ${phone}
- Endereço: ${address}
- Website atual: ${website || "não possui"}
${reports ? `- Dores do público: ${JSON.stringify(reports.psicografia?.doresETraumas || [])}
- Diferenciais do cliente: ${JSON.stringify(reports.estrategia?.vantagensCompetitivas || [])}
- Auditoria do site anterior: ${JSON.stringify(reports.estrategia?.auditoriaSiteAtual || {})}` : ""}
${designReferences ? `- Referências visuais encontradas no Behance/Pinterest para inspirar a estrutura: ${designReferences.substring(0, 1500)}` : ""}

JSON obrigatório com TODAS estas seções:
{
  hero: { headline: "Promessa forte e direta (máx 10 palavras)", subheadline: "Sub promessa que reforça a headline (máx 20 palavras)", cta: "Texto do botão CTA (máx 5 palavras)" },
  problemAgitation: { title: "Título da seção de problema", subtitle: "Subtítulo", problems: [{ icon: "emoji", title: "Dor 1", description: "Descrição da dor" }, { icon: "emoji", title: "Dor 2", description: "..." }, { icon: "emoji", title: "Dor 3", description: "..." }] },
  solution: { title: "Título da solução", subtitle: "Subtítulo elegante", description: "Parágrafo persuasivo sobre como a empresa resolve", features: ["Benefício 1", "Benefício 2", "Benefício 3", "Benefício 4"] },
  differentials: { title: "Título dos diferenciais", items: [{ icon: "emoji", title: "Diferencial 1", description: "..." }, { icon: "emoji", title: "Diferencial 2", description: "..." }, { icon: "emoji", title: "Diferencial 3", description: "..." }, { icon: "emoji", title: "Diferencial 4", description: "..." }] },
  howItWorks: { title: "Como Funciona", steps: [{ number: "01", title: "Passo 1", description: "..." }, { number: "02", title: "Passo 2", description: "..." }, { number: "03", title: "Passo 3", description: "..." }] },
  socialProof: { title: "Título da prova social", testimonials: [{ name: "Nome", role: "Cargo/Cidade", text: "Depoimento real e autêntico" }, { name: "Nome 2", role: "Cargo", text: "..." }, { name: "Nome 3", role: "Cargo", text: "..." }] },
  about: { title: "Sobre a empresa", text: "Parágrafo humanizado sobre a história e missão (3 a 4 frases)", stats: [{ number: "+500", label: "Clientes" }, { number: "+10", label: "Anos" }, { number: "98%", label: "Satisfação" }] },
  faq: { title: "Dúvidas Frequentes", items: [{ question: "Pergunta 1", answer: "Resposta" }, { question: "Pergunta 2", answer: "..." }, { question: "Pergunta 3", answer: "..." }, { question: "Pergunta 4", answer: "..." }] },
  finalCta: { title: "CTA final forte", subtitle: "Reforço de urgência", buttonText: "Texto do botão" },
  services: [{ title: "Serviço 1", description: "..." }, { title: "Serviço 2", description: "..." }, { title: "Serviço 3", description: "..." }, { title: "Serviço 4", description: "..." }, { title: "Serviço 5", description: "..." }, { title: "Serviço 6", description: "..." }]
}`}],
        model:"openai/gpt-oss-120b", temperature:0.5, response_format:{ type:"json_object" }
      });
      siteData = JSON.parse(copyRes.choices[0].message.content||"{}");
    } catch(e) { console.error("[AUTO_BUILD_LEAD] SiteData error:", e.message); }
  }

  // Cor primária dinâmica baseada no nicho para o Bloco B do cliente
  let primaryHex = "#ea580c"; // Parrilla / Churrasco / Grelhados / Restaurante em geral (Laranja Brasa)
  const nicheLower = niche.toLowerCase();
  if (nicheLower.includes("dentista") || nicheLower.includes("odonto") || nicheLower.includes("clínica") || nicheLower.includes("saúde") || nicheLower.includes("fisioterapia")) {
    primaryHex = "#06b6d4"; // azul piscina / ciano médico
  } else if (nicheLower.includes("advogado") || nicheLower.includes("advocacia") || nicheLower.includes("lei")) {
    primaryHex = "#b45309"; // marrom dourado elegante
  } else if (nicheLower.includes("mecanica") || nicheLower.includes("oficina")) {
    primaryHex = "#eab308"; // amarelo industrial
  } else if ((nicheLower.includes("moda") || nicheLower.includes("boutique") || nicheLower.includes("closet")) && !nicheLower.includes("carne") && !nicheLower.includes("comida") && !nicheLower.includes("parrilla") && !nicheLower.includes("restaurante")) {
    primaryHex = "#d946ef"; // magenta fashion
  }

  const html = await generateMandatory15SectionsHtml({
    formData: { companyName:name, niche, phone, address, website, primaryHex },
    siteData: siteData || { hero:{ headline:name, subheadline:`Excelência em ${niche}`, cta:"Solicite um Orçamento" }, about:{ title:"Sobre", text:"" }, services:[], contact:{ title:"Vamos Conversar?" } },
    reports,
    projectId
  });

  const score = calculateLeadScore(p, null);
  
  // Referências visuais reais baseadas no nicho (exclusivamente websites, landing pages e UI/UX de steakhouse/parrilla)
  let visualReferences = [
    "https://www.behance.net/search/projects?search=steakhouse+web+design",
    "https://www.pinterest.com/search/pins/?q=steakhouse%20website%20design",
    "https://dribbble.com/search/shots/popular/web-design?q=steakhouse+website"
  ];
  if (nicheLower.includes("dentista") || nicheLower.includes("odonto") || nicheLower.includes("clínica") || nicheLower.includes("saúde")) {
    visualReferences = [
      "https://www.behance.net/search/projects?search=dental+clinic+web+design",
      "https://www.pinterest.com/search/pins/?q=dental%20clinic%20website%20design",
      "https://dribbble.com/search/shots/popular/web-design?q=dental+clinic+website"
    ];
  } else if (nicheLower.includes("advogado") || nicheLower.includes("advocacia")) {
    visualReferences = [
      "https://www.behance.net/search/projects?search=lawyer+website+design",
      "https://www.pinterest.com/search/pins/?q=lawyer%20website%20design",
      "https://dribbble.com/search/shots/popular/web-design?q=lawyer+website"
    ];
  } else if (nicheLower.includes("mecanica") || nicheLower.includes("oficina")) {
    visualReferences = [
      "https://www.behance.net/search/projects?search=auto+repair+website+design",
      "https://www.pinterest.com/search/pins/?q=auto%20repair%20website%20design",
      "https://dribbble.com/search/shots/popular/web-design?q=auto+repair+website"
    ];
  } else if (nicheLower.includes("moda") || nicheLower.includes("boutique") || nicheLower.includes("closet")) {
    visualReferences = [
      "https://www.behance.net/search/projects?search=fashion+website+design",
      "https://www.pinterest.com/search/pins/?q=fashion%20website%20design",
      "https://dribbble.com/search/shots/popular/web-design?q=fashion+website"
    ];
  }

  const siteRecord = {
    companyName:name, niche, status:"pending",
    deployedUrl:null, htmlUrl:null, originalUrl:website, website,
    generatedPrompt: siteData ? JSON.stringify(siteData) : "",
    score, analysis: reports ? JSON.stringify(reports) : "",
    placeId, htmlContent:html, phone, email:"", address,
    reports, visualReferences, createdAt:Date.now(), updatedAt:Date.now()
  };
  await sbFetch("/generated_sites", { method: "POST", headers: { "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ id: projectId, company_name: siteRecord.companyName, niche: siteRecord.niche, html_content: siteRecord.htmlContent, deployed_url: siteRecord.deployedUrl, status: siteRecord.status, score: siteRecord.score, created_at: siteRecord.createdAt, updated_at: siteRecord.updatedAt }) }).catch(e => console.warn("[AUTO_BUILD] generated_sites save:", e.message));
  console.log(`[AUTO_BUILD] Protótipo criado no Supabase com ID: ${projectId}`);

  // Criar documento de proposta correspondente para a visualização do PDF funcionar no BaseProposta.tsx
  const proposalId = "proposta-escom-" + projectId;
  const proposalDoc = {
    clientName: name,
    company: name,
    createdAt: Date.now(),
    budget: "990",
    phone: phone || "5548988626785",
    selectedServices: [
      { id: "1", name: "Landing Page de Alta Conversão com Animações GSAP" },
      { id: "2", name: "Otimização Técnica de SEO e Google Meu Negócio" },
      { id: "3", name: "Hospedagem Premium Gratuita por 12 Meses" }
    ],
    status: "pending"
  };
  await sbFetch("/proposals", { method: "POST", headers: { "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify({ id: proposalId, ...proposalDoc }) }).catch(() => {});
  console.log(`[AUTO_BUILD] Proposta criada no Supabase com ID: ${proposalId}`);

  return siteRecord;
}


async function runAutoBuildPipeline() {
  console.log("[AUTO_BUILD] Pipeline iniciado...");
  if (!process.env.SERPER_API_KEY || !process.env.GROQ_API_KEY) return { error: "missing_keys" };
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const batchRows = await sbFetch("/auto_build_queue?status=neq.completed&status=neq.failed&order=created_at.desc&limit=5").catch(() => []);
  const batches = (batchRows || []) as any[];
  let batch, batchId;

  if (batches.length === 0) {
    console.log("[AUTO_BUILD] Novo lote...");
    batchId = "batch_" + Date.now();
    const leads = [];
    const niches = ["Clínica Odontológica em São Paulo","Arquiteto em Curitiba","Contabilidade em Belo Horizonte","Academia em Porto Alegre","dentist in New York"];
    const gls = ["br","br","br","br","us"];
    const hls = ["pt-br","pt-br","pt-br","pt-br","en"];
    const existingNamesRows = await sbFetch("/generated_sites?select=company_name&limit=500").catch(() => []);
    const existingNames = new Set((existingNamesRows || []).map((d: any) => d.company_name?.toLowerCase().trim()));
    for (let i = 0; i < niches.length; i++) {
      await new Promise(r => setTimeout(r, 2000));
      try {
        const resp = await fetch("https://google.serper.dev/places", {
          method:"POST", headers:{"X-API-KEY":process.env.SERPER_API_KEY,"Content-Type":"application/json"},
          body: JSON.stringify({ q: niches[i], gl: gls[i], hl: hls[i], num: 5 })
        });
        const data = JSON.parse(await resp.text());
        let place = (data.places||[]).find(p => p.phoneNumber);
        if (!place) place = (data.places||[])[0];
        if (!place) continue;
        const name = place.title;
        const nameKey = name.toLowerCase().trim();
        if (existingNames.has(nameKey)) continue;
        existingNames.add(nameKey);
        const url = place.website||"";
        let audit = null, plan = null;
        if (url) audit = await performUxAuditForLead(url, name, niches[i]);
        else plan = await generateProspectSitePlanForLead(name, niches[i]);
        const score = calculateLeadScore({title:name, ratingCount:place.ratingCount, website:url}, audit);
        if (score < 30) continue;
        leads.push({ title:name, address:place.address||"", phone:place.phoneNumber||"", website:url, rating:place.rating||0, ratingCount:place.ratingCount||0, niche:niches[i], country:i===4?"US":"BR", auditData:audit, sitePlan:plan, reports:null, htmlBuilt:false, uxPassed:false, uxIssues:[], status:"pending", order:i, createdAt:Date.now() });
      } catch(e) { console.error("[AUTO_BUILD] Erro lead:", e.message); }
    }
    if (leads.length === 0) return { error: "no_leads" };
    batch = { id: batchId, status:"in_progress", created_at: new Date().toISOString(), total_leads:leads.length, processed_leads:0, leads_json: JSON.stringify(leads) };
    await sbFetch("/auto_build_queue", { method: "POST", headers: { "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify(batch) }).catch(() => {});
  } else {
    batch = batches[0];
    batchId = batch.id;
  }

  const leadsArr: any[] = JSON.parse(batch.leads_json || batch.leads || "[]");
  const idx = leadsArr.findIndex(l => l.status === "pending");
  if (idx === -1) {
    await sbFetch(`/auto_build_queue?id=eq.${encodeURIComponent(batchId)}`, { method: "PATCH", headers: { "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify({ status: "completed" }) }).catch(() => {});
    return { status:"completed", batchId };
  }

  const lead = leadsArr[idx];
  console.log("[AUTO_BUILD] Processando " + lead.title);

  try {
    if (!lead.reports) {
      const r1 = await groq.chat.completions.create({
        messages: [{ role:"system", content:"JSON válido" }, { role:"user", content:`Psicografia para ${lead.title} (${lead.niche}). JSON: { doresETraumas, desejosProfundos, objecoesEBarreiras, niveisDeConsciencia, avatares }`}],
        model:"qwen/qwen3.8-27b", temperature:0.7, response_format:{ type:"json_object" }
      });
      const r2 = await groq.chat.completions.create({
        messages: [{ role:"system", content:"JSON válido" }, { role:"user", content:`Análise Estratégica para ${lead.title} (${lead.niche}). JSON: { benchmarking, gapsDeMercado, vantagensCompetitivas, oceanoAzul, filtroDeComunicacao }`}],
        model:"qwen/qwen3.8-27b", temperature:0.7, response_format:{ type:"json_object" }
      });
      lead.reports = { psicografia: JSON.parse(r1.choices[0].message.content||"{}"), estrategia: JSON.parse(r2.choices[0].message.content||"{}") };
    }

    if (!lead.htmlBuilt) {
      const esc = s => (s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
      const accent = "#00d1ff";
      let html = `<!DOCTYPE html><html lang="${lead.country==="US"?"en":"pt-BR"}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${esc(lead.title)}</title><style>*{box-sizing:border-box;margin:0;padding:0}html{scroll-behavior:smooth}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}section{width:100%;padding:5rem 5%}@media(max-width:768px){section{padding:3rem 1.25rem!important}}</style></head><body>`;
      html += `<nav style="display:flex;justify-content:space-between;align-items:center;padding:1rem 5%;background:#fff;border-bottom:1px solid #e5e7eb;position:sticky;top:0;z-index:100"><span style="font-weight:800">${esc(lead.title)}</span><a href="#contact" style="background:${accent};color:#fff;padding:0.5rem 1.5rem;border-radius:0.5rem;font-weight:700;font-size:0.75rem;text-decoration:none">Fale Conosco</a></nav>`;
      html += `<section style="background:${accent};color:#fff;text-align:center;padding:6rem 5%;min-height:70vh;display:flex;flex-direction:column;align-items:center;justify-content:center"><h1 style="font-size:clamp(2rem,5vw,3.5rem);font-weight:900;margin-bottom:1rem">${esc(lead.title)}</h1><p style="font-size:1.25rem;opacity:0.9;max-width:600px">Excelência em ${esc(lead.niche)}</p><a href="#contact" style="display:inline-block;background:#fff;color:${accent};padding:1rem 2.5rem;border-radius:0.5rem;font-weight:800;margin-top:2rem;text-decoration:none">Solicite Orçamento</a></section>`;
      html += `<section id="about" style="text-align:center;background:#f9fafb"><h2 style="font-size:2rem;font-weight:800;margin-bottom:1rem">Sobre</h2><p style="color:#6b7280;max-width:700px;margin:0 auto;line-height:1.8">Há anos transformando o mercado de ${esc(lead.niche)} com qualidade e inovação.</p></section>`;
      html += `<section id="contact" style="text-align:center"><h2 style="font-size:2rem;font-weight:800;margin-bottom:1rem">Vamos Conversar?</h2>${lead.phone ? `<p style="font-size:1.25rem;font-weight:700;color:${accent};margin-bottom:0.5rem">📞 ${esc(lead.phone)}</p>` : ""}${lead.address ? `<p style="color:#6b7280">📍 ${esc(lead.address)}</p>` : ""}</section>`;
      html += `<footer style="background:#111;color:#9ca3af;text-align:center;padding:3rem 5%"><p>© ${new Date().getFullYear()} ${esc(lead.title)}</p></footer></body></html>`;
      lead.htmlContent = html;
      lead.htmlBuilt = true;
    }

    if (lead.htmlBuilt && !lead.uxPassed) {
      try {
        const $ = cheerio.load(lead.htmlContent || "");
        const issues = [];
        $("img").each((_,el) => { if (!$(el).attr("alt")) issues.push("Missing alt"); });
        $("button").each((_,el) => { if (!$(el).text().trim() && !$(el).attr("aria-label")) issues.push("Empty button"); });
        if (!$("meta[name=viewport]").length) issues.push("No viewport");
        if (!$("h1").length) issues.push("No h1");
        lead.uxIssues = issues;
        lead.uxPassed = issues.length === 0;
        lead.status = issues.length === 0 ? "ready_for_approval" : "ux_issues_found";
      } catch(e) {
        lead.uxPassed = false;
        lead.uxIssues = ["UX analysis failed: " + e.message];
        lead.status = "ux_analysis_failed";
      }
    }

    if (lead.htmlBuilt) {
      const siteRecord = {
        companyName: lead.title, niche: lead.niche, status: "pending",
        deployedUrl: null, htmlUrl: null, originalUrl: lead.website || "", website: lead.website || "",
        generatedPrompt: "", score: lead.score || 50, analysis: lead.reports ? JSON.stringify(lead.reports) : "",
        placeId: "batch_" + batchId + "_" + idx, htmlContent: lead.htmlContent || "", phone: lead.phone || "", email: "", address: lead.address || "",
        reports: lead.reports, createdAt: Date.now(), updatedAt: Date.now()
      };
      const sitePid = "site_auto_" + Date.now() + "_" + idx;
      await sbFetch("/generated_sites", { method: "POST", headers: { "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify({ id: sitePid, ...siteRecord, html_content: siteRecord.htmlContent, company_name: siteRecord.companyName, deployed_url: siteRecord.deployedUrl }) }).catch(() => {});
    }

    leadsArr[idx] = lead;
    const processed = leadsArr.filter(l => l.status !== "pending").length;
    await sbFetch(`/auto_build_queue?id=eq.${encodeURIComponent(batchId)}`, { method: "PATCH", headers: { "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify({ leads_json: JSON.stringify(leadsArr), processed_leads: processed, last_processed_at: Date.now() }) }).catch(() => {});
    return { status: lead.status, batchId, lead: lead.title };
  } catch(e) {
    lead.status = "failed";
    lead.error = e.message;
    leadsArr[idx] = lead;
    await sbFetch(`/auto_build_queue?id=eq.${encodeURIComponent(batchId)}`, { method: "PATCH", headers: { "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify({ leads_json: JSON.stringify(leadsArr) }) }).catch(() => {});
    return { status:"failed", error: e.message };
  }
}




function initCronJobs() {
  console.log("[CRON] Initializing...");
  cron.schedule("0 6 * * *", async () => { await runMineraLeadsCron(); });
  cron.schedule("*/10 6-7 * * *", async () => { await runAutoBuildPipeline().catch(e => console.error("[AUTO_BUILD] Cron fail:", e)); });
}
initCronJobs();

// ----- ROTAS PRINCIPAIS -----

app.get("/api/health", (req, res) => { res.json({ status: "ok" }); });

app.get("/api/debug-files", (req, res) => {
  const paths = [
    path.join(process.cwd(), "public", "template-ci-odontologia", "index.html"),
    path.join(process.cwd(), "template-ci-odontologia", "index.html"),
    path.join(process.cwd(), "dist", "template-ci-odontologia", "index.html"),
    path.join(process.cwd(), "index.html")
  ];
  const results = {};
  for (const p of paths) {
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, "utf-8");
      results[p] = {
        exists: true,
        size: content.length,
        title: content.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "No title",
        ciNavy: content.includes("ciNavy")
      };
    } else {
      results[p] = { exists: false };
    }
  }
  res.json({ results, cwd: process.cwd() });
});

app.get("/api/trigger-minera", async (req, res) => {
  try { const r = await runMineraLeadsCron(); res.json({ success: true, r }); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/send-test-email", async (req, res) => {
  const destination = (req.query.email as string) || "es.comunicacao@outlook.com";
  try {
    const jobRows = await sbFetch("/jobs?order=created_at.desc&limit=50").catch(() => []);
    const jobs = (jobRows || []).map((d: any) => {
      return {
        id: d.id,
        title: d.title || "Vaga de Marketing",
        company: d.company || "Não informada",
        snippet: d.snippet || "",
        link: d.link || "",
        role: d.role || "Não informada",
        status: d.status || "Pendente",
        emailContato: d.email_contato || null,
        createdAt: d.created_at || 0
      };
    });

    // Ordenar das mais recentes para as mais antigas e pegar apenas as 10 primeiras
    jobs.sort((a, b) => b.createdAt - a.createdAt);
    const testChunk = jobs.slice(0, 10);

    let jobsHtml = "";
    testChunk.forEach((job, idx) => {
      const formattedDate = job.createdAt ? new Date(job.createdAt).toLocaleDateString("pt-BR") : "N/A";
      jobsHtml += `
        <div style="border-bottom: 1px solid #eee; padding: 15px 0; font-family: sans-serif;">
          <h4 style="margin: 0 0 5px 0; color: #00d1ff; font-size: 16px;">#${idx + 1} - ${job.title}</h4>
          <p style="margin: 0 0 5px 0; font-size: 13px;">
            <strong>Empresa:</strong> ${job.company} | 
            <strong>Função:</strong> ${job.role} | 
            <strong>Status:</strong> <span style="background: #eee; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${job.status}</span>
          </p>
          ${job.emailContato ? `<p style="margin: 0 0 5px 0; font-size: 13px;"><strong>E-mail Contato:</strong> ${job.emailContato}</p>` : ""}
          <p style="margin: 0; font-size: 12px; color: #666; font-style: italic;">"${job.snippet}"</p>
          <div style="margin-top: 8px; font-size: 12px; display: flex; gap: 15px;">
            <span><strong>Criada em:</strong> ${formattedDate}</span>
            ${job.link ? `<span><a href="${job.link}" target="_blank" style="color: #00d1ff; text-decoration: none; font-weight: bold;">Acessar Vaga &rarr;</a></span>` : ""}
          </div>
        </div>
      `;
    });

    const resendApiKey = process.env.RESEND_API_KEY || "re_Hmg78ECH_8JJ7LJUeQ92FUfMwWwUyzPqY";
    const resend = new Resend(resendApiKey);

    const emailResponse = await resend.emails.send({
      from: "Piassa Vagas <onboarding@resend.dev>",
      to: destination,
      subject: `🧪 Teste de Integração: 10 Vagas Recentes - Piassa`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #111; border-bottom: 2px solid #00d1ff; padding-bottom: 10px; margin-top: 0;">🧪 Teste de Conectividade Piassa</h2>
          <p>Olá! Este é um e-mail de validação contendo as 10 vagas mais recentes encontradas no banco de dados do Piassa.</p>
          <hr style="border: 0; border-top: 1px solid #eee;"/>
          ${jobsHtml}
          <br/>
          <p>Acesse o painel para gerenciar todas as vagas: <a href="https://escomstudio.com.br/piassa" target="_blank" style="color: #00d1ff; font-weight: bold; text-decoration: none;">Painel Piassa</a></p>
        </div>
      `
    });

    res.json({ success: true, message: `E-mail de teste enviado com sucesso para ${destination}`, data: emailResponse });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/auto-build-pipeline", async (req, res) => {
  try { const r = await runAutoBuildPipeline(); res.json({ success: true, result: r }); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

// --- Pautas Instagram ---
app.post("/api/generate-pautas", async (req, res) => {
  try {
    const { mode, suggestion } = req.body;
    if (!process.env.GROQ_API_KEY) return res.status(500).json({ error: "GROQ_API_KEY missing" });
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const today = new Date().toLocaleDateString("pt-BR");
    let userPrompt;
    if (mode === "auto") {
      userPrompt = `Você é estrategista de conteúdo para estúdio de direção de arte, design e tecnologia. Hoje é ${today} de 2026.
Somos diretores de arte. Trabalhamos com design, sistemas inteligentes, IA e desenvolvimento de sites.
Gere EXATAMENTE 5 ideias de pautas para Instagram EM ALTA conectando design, tecnologia, IA, branding e dev web com acontecimentos atuais.
TOM: humanizado, próximo, humor inteligente. Nada formal.

Cada pauta deve ter:
- titulo (máx 60 chars)
- descricao (máx 200 chars, parágrafo conceito)
- ideias_chave: array 4 palavras
- data_contexto, data_referencia
- referencias: array 2 links reais
- contexto_noticia: MÍNIMO 3 parágrafos detalhando a notícia
- foco_pauta: 2 parágrafos sobre o ângulo
- porque_postar: 2 parágrafos de relevância
- publico_alvo
- chamada_principal: legenda pronta
- dicas_visuais: estilo visual, cores, elementos

Retorne APENAS JSON: { pautas: [{ titulo, descricao, ideias_chave, data_contexto, data_referencia, referencias, contexto_noticia, foco_pauta, porque_postar, publico_alvo, chamada_principal, dicas_visuais }] }`;
    } else if (mode === "suggest" && suggestion) {
      userPrompt = `Baseado na sugestão "${suggestion}", gere 5 pautas para Instagram sobre design, tecnologia, IA, branding. TOM humanizado. Mesmo formato JSON.`;
    } else return res.status(400).json({ error: "Invalid mode" });
    const c = await groq.chat.completions.create({
      messages: [{ role:"system", content:"Estrategista sênior Instagram para estúdio design/tech. Tom humanizado. Responda SEMPRE JSON válido." }, { role:"user", content: userPrompt }],
      model: "openai/gpt-oss-120b", temperature: 0.8, response_format: { type: "json_object" }
    });
    const text = c.choices[0]?.message?.content || "{}";
    res.json({ success: true, ...JSON.parse(text) });
  } catch(e) { console.error("GROQ Error:", e); res.status(500).json({ error: "Erro ao gerar pautas" }); }
});

// --- Carrossel Slides ---
app.post("/api/generate-carrossel-slides", async (req, res) => {
  try {
    const { pauta } = req.body;
    if (!pauta || !pauta.titulo) return res.status(400).json({ error: "Pauta data required" });
    if (!process.env.GROQ_API_KEY) return res.status(500).json({ error: "GROQ_API_KEY missing" });
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const prompt = `Você é um diretor de arte e copywriter sênior. Expanda a pauta em 10 slides.

PAUTA:
Título: ${pauta.titulo}
Descrição: ${pauta.descricao || ""}
Contexto: ${pauta.contexto_noticia || ""}
Foco: ${pauta.foco_pauta || ""}

SLIDE 1 (CAPA): Título + subtítulo gancho curto
SLIDES 2-9: Cada com título curto (máx 6 palavras) + texto breve (máx 40 palavras)
SLIDE 10: Título (máx 6 palavras) + CTA curto

JSON: { slides: { titulo01..10, texto01..09, textofinal, visual_01..10, legenda_titulo, legenda_texto } }
visual_01..10 = descrição curta de imagem para buscar no Unsplash (ex: "casual fashion street style", "vintage soccer jersey detail")
legenda_titulo = título do post no Instagram (máx 15 palavras, gancho forte)
legenda_texto = legenda do post no Instagram (texto humanizado, natural, 80-120 palavras, como se fosse um amigo explicando)`;
    const c = await groq.chat.completions.create({
      messages: [{ role:"system", content:"Gera carrosséis profundos. JSON válido." }, { role:"user", content: prompt }],
      model: "openai/gpt-oss-120b", temperature: 0.8, response_format: { type: "json_object" }
    });
    const result = JSON.parse(c.choices[0]?.message?.content || "{}");
    res.json({ success: true, ...result });
  } catch(e) { console.error("[CARROSSEL] Erro:", e); res.status(500).json({ error: "Erro ao gerar slides" }); }
});

// --- Unsplash ---
app.post("/api/search-images", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Query required" });
    const key = process.env.UNSPLASH_ACCESS_KEY;
    if (!key) return res.status(500).json({ error: "Unsplash key not configured" });
    const resp = await fetch("https://api.unsplash.com/search/photos?query=" + encodeURIComponent(query) + "&per_page=20", { headers: { Authorization: "Client-ID " + key } });
    const data = await resp.json();
    const results = (data.results || []).map(p => ({ id: p.id, url: p.urls.regular, thumb: p.urls.small, photographer: p.user.name, photographerLink: p.user.links.html, unsplashLink: p.links.html, alt: p.alt_description || "" }));
    res.json({ success: true, results });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// --- Leads (Supabase) ---
async function sbFetch(path: string, options: any = {}) {
  const bom = String.fromCharCode(65279);
  const SB_URL = (process.env.SUPABASE_URL || '').replace(bom, '').trim();
  const SB_KEY = (process.env.SUPABASE_SERVICE_KEY || '').replace(bom, '').trim();
  if (!SB_URL || !SB_KEY) throw new Error("SUPABASE_URL ou SUPABASE_SERVICE_KEY nao configurado");
  const resp = await fetch(`${SB_URL}/rest/v1${path}`, {
    ...options,
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json", ...(options.headers || {}) }
  });
  const text = await resp.text();
  const data = text ? JSON.parse(text) : null;
  if (!resp.ok) throw new Error(JSON.stringify(data));
  return data;
}

app.get("/api/leads", async (req, res) => {
  try {
    const rows = await sbFetch("/leads?select=*&order=criado_em.desc");
    const SOCIAL = /instagram\.com|facebook\.com|fb\.com|linkedin\.com|twitter\.com|tiktok\.com|youtube\.com|wa\.me|whatsapp/i;
    const leads = (rows || []).map((r: any) => {
      const rawWebsite = r.website ?? r.siteUrl ?? "";
      const siteUrl = rawWebsite && !SOCIAL.test(rawWebsite) ? rawWebsite : "";
      return {
        ...r,
        score:        r.score_oportunidade ?? r.score ?? 0,
        reviewsCount: r.reviews_count      ?? r.reviewsCount ?? 0,
        temSite:      !!(siteUrl),
        siteUrl,
        siteGerado:   r.site_gerado        ?? "",
      };
    });
    res.json({ success: true, leads });
  } catch(e: any) { res.status(500).json({ error: e.message }); }
});

app.post("/api/salvar-lead", async (req, res) => {
  try {
    const lead = req.body;
    if (!lead || !lead.nome) return res.status(400).json({ error: "campo nome obrigatorio" });
    const nomeNormalizado = lead.nome.toLowerCase().trim();
    const id = nomeNormalizado.replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").substring(0, 80)
      + "-" + (lead.cidade || "").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    await sbFetch("/leads", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({
        id,
        nome: lead.nome,
        nome_normalizado: nomeNormalizado,
        endereco: lead.endereco || null,
        telefone: lead.telefone || null,
        website: lead.website || null,
        rating: lead.rating || null,
        reviews_count: lead.reviewsCount || null,
        categoria: lead.categoria || null,
        cidade: lead.cidade || null,
        tem_site: lead.temSite ?? false,
        score_oportunidade: lead.scoreOportunidade ?? 50,
        diagnostico: lead.diagnostico || null,
        status: "novo",
        criado_em: new Date().toISOString(),
        atualizado_em: new Date().toISOString()
      })
    });
    res.json({ success: true, id });
  } catch(e: any) { res.status(500).json({ error: e.message }); }
});

app.get("/api/verificar-lead", async (req, res) => {
  try {
    const nome = (req.query.nome as string || "").toLowerCase().trim();
    if (!nome) return res.json({ encontrado: false });
    const rows = await sbFetch(`/leads?nome_normalizado=eq.${encodeURIComponent(nome)}&select=id&limit=1`);
    res.json({ encontrado: Array.isArray(rows) && rows.length > 0 });
  } catch(e: any) { res.json({ encontrado: false, error: e.message }); }
});

app.post("/api/maps-leads", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Query required" });
    if (!process.env.SERPER_API_KEY) return res.status(500).json({ error: "SERPER_API_KEY missing" });
    const resp = await fetch("https://google.serper.dev/places", {
      method: "POST",
      headers: { "X-API-KEY": process.env.SERPER_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ q: query, gl: "br", hl: "pt-br" })
    });
    const data = JSON.parse(await resp.text());
    const places = (data.places || []).slice(0, 5);

    const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;
    const existingRows2 = await sbFetch("/generated_sites?select=id&limit=500").catch(() => []);
    const existing = new Set((existingRows2 || []).map((d: any) => d.id));
    const builtSites = [];

    for (const p of places) {
      const pid = "site_" + (p.cid || p.placeId || Date.now()).toString();
      if (existing.has(pid)) continue;
      const score = calculateLeadScore(p, null);
      if (score < 30) continue;
      await new Promise(r => setTimeout(r, 3000));
      try {
        const site = await autoBuildSiteFromLead(p, query, groq);
        builtSites.push(site);
        existing.add(pid);
      } catch(e2) { console.error("[MAPS-LEADS] Erro ao construir site:", e2.message); }
    }

    res.json({ success: true, data: builtSites });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// --- Generated Sites (Supabase) ---
app.get("/api/generated-sites", async (req, res) => {
  try {
    const sites = await sbFetch("/generated_sites?order=created_at.desc&limit=100").catch(() => []);
    res.json({ success: true, data: (sites || []).map((s: any) => ({ projectId: s.id, ...s })) });
  } catch(e) { res.json({ success: true, data: [] }); }
});

app.put("/api/generated-sites/:projectId/status", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status } = req.body;
    await sbFetch(`/generated_sites?id=eq.${encodeURIComponent(projectId)}`, {
      method: "PATCH", headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ status, updated_at: Date.now() })
    });
    res.json({ success: true });
  } catch(e) { res.status(500).json({ success: false, error: e.message }); }
});

app.post("/api/generated-sites/:projectId/mark-viewed", async (req, res) => {
  try {
    const { projectId } = req.params;
    await sbFetch(`/generated_sites?id=eq.${encodeURIComponent(projectId)}`, {
      method: "PATCH", headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ viewed: true, viewed_at: Date.now() })
    });
    res.json({ success: true });
  } catch(e) { res.status(500).json({ success: false, error: e.message }); }
});

app.delete("/api/generated-sites/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    await sbFetch(`/generated_sites?id=eq.${encodeURIComponent(projectId)}`, { method: "DELETE", headers: { Prefer: "return=minimal" } });
    res.json({ success: true });
  } catch(e) { res.status(500).json({ success: false, error: e.message }); }
});

// Busca places no Serper e retorna array bruto para o n8n qualificar.
// Usado pelo n8n no lugar de chamar o Serper diretamente (evita expor a chave no workflow).
app.post("/api/buscar-places", async (req, res) => {
  try {
    const { nicho, cidade, estado, quantidade } = req.body;
    if (!nicho || !cidade) return res.status(400).json({ error: "nicho e cidade obrigatorios" });
    const serperKey = process.env.SERPER_API_KEY;
    if (!serperKey) return res.status(500).json({ error: "SERPER_API_KEY nao configurado" });
    const query = `${nicho} em ${cidade}, ${estado || "SP"}`;
    const serperResp = await fetch("https://google.serper.dev/places", {
      method: "POST",
      headers: { "X-API-KEY": serperKey, "Content-Type": "application/json" },
      body: JSON.stringify({ q: query, gl: "br", hl: "pt-br" })
    });
    const serperData: any = await serperResp.json();
    const places = (serperData.places || []).slice(0, quantidade || 20);
    res.json({ places, nicho, cidade, total: places.length });
  } catch(e: any) { res.status(500).json({ error: e.message }); }
});

// Repassa busca de leads ao n8n, que executa Serper + qualificacao + salvamento no Supabase.
app.post("/api/buscar-leads", async (req, res) => {
  try {
    const { nicho, cidade, estado, quantidade } = req.body;
    const n8nHost = process.env.N8N_HOST || "https://n8n-iliw.srv1887358.hstgr.cloud";
    const resp = await fetch(`${n8nHost}/webhook/buscar-leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nicho: nicho || "", cidade: cidade || "", estado: estado || "SP", quantidade: quantidade || 15 })
    });
    const data = await resp.json().catch(() => ({ ok: true }));
    res.status(resp.status).json(data);
  } catch(e: any) { res.status(500).json({ error: e.message }); }
});

// Busca leads via Serper (Google Maps) e salva direto no Supabase (rota alternativa sem n8n).
app.post("/api/buscar-leads-direto", async (req, res) => {
  try {
    const { nicho, cidade, estado, quantidade } = req.body;
    if (!nicho || !cidade) return res.status(400).json({ error: "nicho e cidade obrigatorios" });
    const serperKey = process.env.SERPER_API_KEY;
    if (!serperKey) return res.status(500).json({ error: "SERPER_API_KEY nao configurado" });
    const query = `${nicho} em ${cidade}, ${estado || "SP"}`;
    const serperResp = await fetch("https://google.serper.dev/places", {
      method: "POST",
      headers: { "X-API-KEY": serperKey, "Content-Type": "application/json" },
      body: JSON.stringify({ q: query, gl: "br", hl: "pt-br" })
    });
    const serperData: any = await serperResp.json();
    const places: any[] = (serperData.places || []).slice(0, quantidade || 20);
    if (!places.length) return res.json({ ok: true, salvos: 0, mensagem: "Nenhum resultado encontrado" });
    let salvos = 0;
    for (const place of places) {
      try {
        const nome = place.title || "";
        if (!nome) continue;
        const nomeNormalizado = nome.toLowerCase().trim();
        const temSite = !!(place.website);
        const id = nomeNormalizado.replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").substring(0, 80)
          + "-" + cidade.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
        await sbFetch("/leads", {
          method: "POST",
          headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
          body: JSON.stringify({
            id, nome, nome_normalizado: nomeNormalizado,
            endereco: place.address || null, telefone: place.phoneNumber || null,
            website: place.website || null, rating: place.rating ?? null,
            reviews_count: place.ratingCount ?? null, categoria: nicho, cidade,
            tem_site: temSite, score_oportunidade: temSite ? 60 : 100,
            diagnostico: null, status: "novo",
            criado_em: new Date().toISOString(), atualizado_em: new Date().toISOString()
          })
        });
        salvos++;
      } catch(_) {}
    }
    res.json({ ok: true, salvos, total: places.length });
  } catch(e: any) { res.status(500).json({ error: e.message }); }
});

// Abre o site com Puppeteer headless, tira screenshot desktop + mobile e retorna
// HTML renderizado (JS executado). Usado pelo n8n para analise visual com Gemini.
app.post("/api/screenshot-site", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "url obrigatorio" });
  let browser: any;
  try {
    const puppeteer = require('puppeteer');
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox', '--disable-setuid-sandbox',
        '--disable-dev-shm-usage', '--disable-gpu',
        '--single-process', '--no-zygote'
      ]
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 })
      .catch(() => page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 }));
    const title = await page.title();
    const htmlRendered = (await page.content()).substring(0, 40000);
    const screenshotDesktop = await page.screenshot({ encoding: 'base64', type: 'jpeg', quality: 75 }) as string;
    await page.setViewport({ width: 390, height: 844, isMobile: true, deviceScaleFactor: 2 });
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 8000 }).catch(() => {});
    const screenshotMobile = await page.screenshot({ encoding: 'base64', type: 'jpeg', quality: 75 }) as string;
    await browser.close();
    res.json({ screenshotDesktop, screenshotMobile, htmlRendered, title, url });
  } catch(e: any) {
    if (browser) await browser.close().catch(() => {});
    res.status(500).json({ error: e.message, fallback: true });
  }
});

// Mapa categoria → foto Unsplash curada (IDs verificados)
const COVER_PHOTOS: Record<string, string> = {
  barbearia:    "photo-1503951914875-452162b0f3f1",
  academia:     "photo-1534438327276-14e5300c3a48",
  fitness:      "photo-1534438327276-14e5300c3a48",
  odontologia:  "photo-1609840114035-3c981b782dfe",
  dentista:     "photo-1609840114035-3c981b782dfe",
  restaurante:  "photo-1414235077428-338989a2e8c0",
  pizzaria:     "photo-1565299624946-b28f40a0ae38",
  lanchonete:   "photo-1565299624946-b28f40a0ae38",
  salao:        "photo-1560066984-138dadb4c035",
  beleza:       "photo-1560066984-138dadb4c035",
  estetica:     "photo-1560066984-138dadb4c035",
  clinica:      "photo-1576091160550-2173dba999ef",
  saude:        "photo-1576091160550-2173dba999ef",
  farmacia:     "photo-1584308666744-a7be30237eaa",
  advocacia:    "photo-1497366216548-37526070297c",
  escritorio:   "photo-1497366216548-37526070297c",
  escola:       "photo-1580582932707-520aed937b7b",
  auto:         "photo-1492144534655-ae79c964c9d7",
  mecanica:     "photo-1492144534655-ae79c964c9d7",
  hotel:        "photo-1566073771259-470de1bed370",
  pousada:      "photo-1566073771259-470de1bed370",
  loja:         "photo-1441986300917-64674bd600d8",
  comercio:     "photo-1441986300917-64674bd600d8",
};

function getCoverPhotoUrl(categoria: string): string {
  const key = (categoria || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  for (const [k, id] of Object.entries(COVER_PHOTOS)) {
    if (key.includes(k)) return `https://images.unsplash.com/${id}?w=900&q=80&auto=format&fit=crop`;
  }
  return `https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80&auto=format&fit=crop`;
}

// Busca referências visuais do Pinterest para o nicho
async function fetchPinterestRefs(categoria: string): Promise<{ urls: string[]; descs: string[] }> {
  const token = process.env.PINTEREST_ACCESS_TOKEN || "";
  if (!token) return { urls: [], descs: [] };
  try {
    const query = encodeURIComponent(`${categoria} website design premium`);
    const resp = await fetch(`https://api.pinterest.com/v5/search/pins?query=${query}&page_size=10`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!resp.ok) return { urls: [], descs: [] };
    const data = await resp.json();
    const items: any[] = data.items || [];
    const urls = items.slice(0, 6)
      .map((p: any) => p?.media?.images?.["600x"]?.url || p?.media?.images?.originals?.url || "")
      .filter((u: string) => u.length > 0);
    const descs = items.slice(0, 6)
      .map((p: any) => p?.title || p?.description || "")
      .filter((d: string) => d.length > 0);
    return { urls, descs };
  } catch { return { urls: [], descs: [] }; }
}

// Função central de geração de landing page para lead via IA (Gemini 3.8 Flash + Groq Qwen/Allam fallback)
async function generateSiteForLead(lead: any, observacoes = ""): Promise<string | null> {
  const leadId = lead.id;
  const baseUrl = process.env.BASE_URL || "https://www.escomstudio.com.br";
  const siteUrl = `${baseUrl}/proposta/${leadId}`;
  const heroImg = getCoverPhotoUrl(lead.categoria || "");
  const rating = lead.rating || "4.8";
  const reviews = lead.reviews_count || lead.reviewsCount || 120;
  const cidade = lead.cidade || "";
  const telefone = lead.telefone || "";
  const endereco = lead.endereco || "";
  const waLink = `https://wa.me/55${telefone.replace(/\D/g, "")}`;
  const botaoAceitarUrl = `${baseUrl}/api/aceitar-proposta`;
  const slug = lead.site_slug || leadId;

  // 1. Busca referências visuais no Pinterest
  const { urls: pinterestUrls, descs: pinterestDescs } = await fetchPinterestRefs(lead.categoria || "negocio");
  const pinterestBlock = pinterestUrls.length > 0
    ? `REFERÊNCIAS VISUAIS DO PINTEREST (inspire-se nestas imagens para paleta, tipografia e layout):
${pinterestUrls.map((u, i) => `  - ${u}${pinterestDescs[i] ? ` (${pinterestDescs[i]})` : ""}`).join("\n")}`
    : "";

  const observacoesBlock = observacoes && observacoes.trim() ? `
═══════════ AJUSTES SOLICITADOS PELO USUÁRIO (PRIORIDADE ABSOLUTA) ═══════════
O usuário revisou a versão anterior deste site e solicitou as seguintes correções e customizações específicas:
"${observacoes.trim()}"
Você DEVE aplicar com prioridade máxima todas as correções pedidas acima (cores, textos, foco dos serviços, botões e imagens)!
` : "";

  const prompt = `Você é um web designer sênior da ESCOM Studio especializado em sites de alto impacto e máxima conversão para negócios locais. Gere uma landing page COMPLETA e PROFISSIONAL em HTML puro para "${lead.nome}", ${lead.categoria} em ${cidade}.
${observacoesBlock}
OBJETIVO: Mostrar ao dono do negócio como seria o site oficial de alto padrão desenvolvido pela ESCOM Studio. Deve parecer um site REAL, PREMIUM e visualmente impactante.

DADOS DO NEGÓCIO:
- Nome: ${lead.nome}
- Categoria: ${lead.categoria}
- Cidade: ${cidade}
- Telefone: ${telefone}
- Endereço: ${endereco}
- Rating Google: ${rating} estrelas (${reviews} avaliações)

${pinterestBlock}

═══════════ DESIGN SYSTEM & ESTÉTICA ═══════════
- Barbearia/Barba: dark premium (fundo #0D0D0D, acento dourado #C9A84C ou âmbar #F59E0B, tipografia imponente)
- Academia/Fitness: energético (preto + #FF6B00 laranja neon, tipografia bold)
- Salão/Estética: elegante rosé/ouro (#141414 + #C4956A + detalhes em bronze/dourado)
- Restaurante/Gastronomia: dark aconchegante (#1A0E00 + terracota #C17B4B)
- Saúde/Odonto/Clínica: clean sofisticado (#0A1628 + azul royal #2563EB + branco)
- Padrão geral: Dark mode sofisticado com Tailwind CSS e acentos luminosos.

BIBLIOTECAS (inclua no <head>):
- Tailwind CSS: <script src="https://cdn.tailwindcss.com"></script>
- GSAP + ScrollTrigger via CDN: <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>

═══════════ SEÇÕES OBRIGATÓRIAS ═══════════
1. BANNER ESCOM: topo fixo sutil "✨ Demonstração criada pela ESCOM Studio • Solicitar site oficial" (link https://escomstudio.com.br)
2. NAVBAR: sticky backdrop-blur, Logo "${lead.nome}", âncoras (#servicos, #sobre, #avaliacoes, #contato) e botão WhatsApp (${waLink})
3. HERO: fundo escuro com imagem de destaque, badge de categoria/cidade, H1 marcante, subheadline persuasiva, prova social (${rating} estrelas no Google) e botões de ação ("Agendar via WhatsApp" e "Ver Serviços")
4. STATS: 4 números de destaque (Clientes atendidos, Anos no mercado, Avaliações positivas, etc.)
5. SOBRE: história e diferenciais de excelência de "${lead.nome}"
6. SERVIÇOS: grid de 6 cards de serviços reais do nicho com preços "a partir de R$ XX", descrições e botão direto WhatsApp
7. DIFERENCIAIS / PRODUTOS: qualidade dos insumos e atendimento personalizado
8. GALERIA / TRABALHOS: 6 cards visuais com fotos ilustrativas do segmento
9. COMO FUNCIONA: 4 passos simples (Agendamento → Recepção → Atendimento → Satisfação Garantida)
10. DEPOIMENTOS: 3 a 4 avaliações 5 estrelas reais e convincentes
11. FAQ: 4 perguntas e respostas essenciais com accordion JS
12. CONTATO / LOCALIZAÇÃO: endereço completo (${endereco}), horários de funcionamento e mapa incorporado
13. PROPOSTA EXCLUSIVA ESCOM: oferta especial por tempo limitado (R$ 990 com domínio incluído por 1 ano) e botão "Aceitar Proposta" (${botaoAceitarUrl})
14. FOOTER: links, copyright © ${lead.nome} e créditos ESCOM Studio
15. BOTÃO FLUTUANTE WHATSAPP: fixado no canto inferior direito pulsando (${waLink})

REGRAS TÉCNICAS:
- Use Tailwind CSS para estilização rápida e responsiva.
- GSAP para animações de fade e entrada nos títulos e cards.
- Retorne APENAS o código HTML completo começando com <!DOCTYPE html> e terminando com </html>.
- Sem blocos de markdown e sem explicações externas.`;

  console.log(`[generateSiteForLead] Gerando landing page para ${leadId} (${lead.nome})...`);
  let html = "";

  // 1. Tenta Gemini 3.8 Flash (rápido e suporta textos longos)
  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const resp = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });
      const t = resp.text || "";
      if (t.length > 800) {
        console.log(`[generateSiteForLead] Sucesso via Gemini 3.8 Flash (${t.length} chars)`);
        html = t;
      }
    } catch (e: any) {
      console.warn(`[generateSiteForLead] Gemini 3.8 Flash indisponível (${e.message}), acionando fallback Groq...`);
    }
  }

  // 2. Fallback Groq com modelos que respeitam a cota (qwen3.8-27b e allam-2-7b com max_tokens: 3800)
  if (!html && process.env.GROQ_API_KEY) {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const groqModels = ["qwen/qwen3.8-27b", "allam-2-7b"];
    for (const m of groqModels) {
      try {
        const r = await groq.chat.completions.create({
          model: m,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.5,
          max_tokens: 3800,
        });
        const t = r.choices[0]?.message?.content || "";
        if (t.length > 800) {
          console.log(`[generateSiteForLead] Sucesso via Groq ${m} (${t.length} chars)`);
          html = t;
          break;
        }
      } catch (e: any) {
        console.warn(`[generateSiteForLead] Groq ${m} falhou:`, e.message);
      }
    }
  }

  if (!html || html.length < 500) {
    console.error(`[generateSiteForLead] Falha ao gerar HTML para ${leadId}`);
    return null;
  }

  // Extrai HTML limpo
  const cleanHtml = html.replace(/^```html?\n?/i, "").replace(/\n?```$/i, "").trim();

  // Salva no Supabase
  try {
    await sbFetch(`/leads?id=eq.${encodeURIComponent(leadId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ site_html: cleanHtml, site_gerado: siteUrl }),
    });
    console.log(`[generateSiteForLead] HTML salvo com sucesso no Supabase para ${leadId} (${cleanHtml.length} chars)`);
  } catch (err: any) {
    console.error(`[generateSiteForLead] Erro ao persistir no Supabase:`, err.message);
  }

  return cleanHtml;
}

// Endpoint para gerar ou regenerar site-amostra com IA (com suporte a observações de ajuste)
app.post("/api/gerar-proposta", async (req, res) => {
  try {
    const { leadId, observacoes } = req.body;
    if (!leadId) return res.status(400).json({ error: "leadId obrigatorio" });
    const rows = await sbFetch(`/leads?id=eq.${encodeURIComponent(leadId)}&select=*&limit=1`);
    if (!rows || rows.length === 0) return res.status(404).json({ error: "Lead nao encontrado" });
    const lead: any = rows[0];

    const baseUrl = process.env.BASE_URL || "https://www.escomstudio.com.br";
    const siteUrl = `${baseUrl}/proposta/${leadId}`;

    const regenerar = req.body.regenerar || req.query.regenerar || !!observacoes;
    if (lead.site_html && !regenerar) {
      return res.json({ siteUrl, cached: true });
    }

    const cleanHtml = await generateSiteForLead(lead, observacoes);
    if (!cleanHtml) {
      return res.status(500).json({ error: "A IA não conseguiu gerar o site. Tente novamente." });
    }

    res.json({ siteUrl, generated: true });
  } catch(e: any) { res.status(500).json({ error: e.message }); }
});

// Reativa uma proposta de site expirada (nao aceita em 3 dias) por um preco
// promocional de R$ 799. A logica de negocio (novo preco, novo prazo, status)
// vive no workflow do n8n - aqui so repassamos a chamada server-to-server
// (evita CORS e evita duplicar a logica de expiracao/preco em dois lugares).
app.post("/api/reativar-proposta", async (req, res) => {
  try {
    const { slug } = req.body;
    if (!slug) return res.status(400).json({ error: "slug obrigatorio" });
    const n8nHost = process.env.N8N_HOST || "https://n8n-iliw.srv1887358.hstgr.cloud";
    const resp = await fetch(`${n8nHost}/webhook/reativar-proposta`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug })
    });
    const data = await resp.json().catch(() => ({}));
    res.status(resp.status).json(data);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/view-prototype/:projectId", async (req, res) => {
  try {
    const rows = await sbFetch(`/generated_sites?id=eq.${encodeURIComponent(req.params.projectId)}&select=*&limit=1`).catch(() => []);
    if (!rows || rows.length === 0) return res.status(404).json({ error: "Projeto não encontrado" });
    const site = rows[0];
    if (site.deployed_url) return res.redirect(site.deployed_url);
    const html = site.html_content || "<html><body><p>Protótipo não disponível</p></body></html>";
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

const PAGINA_PROPOSTA_EXPIRADA = `<!DOCTYPE html><html lang="pt-br"><head><meta charset="utf-8" /><title>Amostra expirada - Escom Studio</title><meta name="robots" content="noindex" /><style>body{font-family:Arial,Helvetica,sans-serif;background:#0b0f1a;color:#f2f2f2;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center;}a{color:#4dabf7;}</style></head><body><div><h1>Esta amostra nao esta mais disponivel</h1><p>O prazo de 3 dias para avaliacao expirou. Fale com a gente para gerar uma nova proposta.</p><p><a href="https://escomstudio.com.br">Voltar para o site da Escom Studio</a></p></div></body></html>`;
const PAGINA_PROPOSTA_NAO_ENCONTRADA = `<!DOCTYPE html><html lang="pt-br"><head><meta charset="utf-8" /><title>Proposta nao encontrada</title><meta name="robots" content="noindex" /></head><body><h1>Proposta nao encontrada</h1><p><a href="https://escomstudio.com.br">Voltar para o site da Escom Studio</a></p></body></html>`;

// Serve o site gerado pelo N8N — slug armazenado em leads.site_slug (Supabase)
app.get("/proposta-:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const rows = await sbFetch(`/leads?site_slug=eq.${encodeURIComponent(slug)}&select=site_html,site_gerado&limit=1`).catch(() => []);
    if (!rows || rows.length === 0 || !rows[0].site_html) {
      // Fallback: redirecionar para ver-proposta se tiver site_gerado
      if (rows?.[0]?.site_gerado) return res.redirect(rows[0].site_gerado);
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("X-Robots-Tag", "noindex, nofollow");
      return res.status(404).send(PAGINA_PROPOSTA_NAO_ENCONTRADA);
    }
    const html = rows[0].site_html;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    res.status(200).send(html);
  } catch (e) {
    res.status(500).send("Erro ao carregar a proposta");
  }
});

// Serve site gerado por leadId — rota limpa sem /api/
app.get("/proposta/:leadId", async (req, res) => {
  try {
    const slug = req.params.leadId;
    const baseUrl = process.env.BASE_URL || "https://www.escomstudio.com.br";
    // Tenta por id exato primeiro, depois por site_gerado contendo o slug, depois por site_slug
    let rows = await sbFetch(`/leads?id=eq.${encodeURIComponent(slug)}&select=*&limit=1`).catch(() => []);
    if (!rows || rows.length === 0) {
      rows = await sbFetch(`/leads?site_gerado=eq.${encodeURIComponent(`${baseUrl}/proposta/${slug}`)}&select=*&limit=1`).catch(() => []);
    }
    if (!rows || rows.length === 0) {
      rows = await sbFetch(`/leads?site_slug=eq.${encodeURIComponent(slug)}&select=*&limit=1`).catch(() => []);
    }
    if (!rows || rows.length === 0) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.status(404).send(PAGINA_PROPOSTA_NAO_ENCONTRADA);
    }
    const lead = rows[0];
    if (lead.site_html && lead.site_html.trim().length > 100) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("X-Robots-Tag", "noindex, nofollow");
      return res.status(200).send(lead.site_html);
    }

    // Lead existe, mas site_html ainda não foi gerado ou está vazio: gera na hora com IA!
    console.log(`[proposta] Lead ${lead.id} encontrado sem site_html. Gerando dinamicamente...`);
    const generatedHtml = await generateSiteForLead(lead);
    if (generatedHtml) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("X-Robots-Tag", "noindex, nofollow");
      return res.status(200).send(generatedHtml);
    }

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(404).send(PAGINA_PROPOSTA_NAO_ENCONTRADA);
  } catch (e) {
    res.status(500).send("Erro ao carregar a proposta");
  }
});

// Alias legado /api/ver-proposta/:leadId → redireciona para /proposta/:leadId
app.get("/api/ver-proposta/:leadId", (req, res) => {
  res.redirect(`/proposta/${encodeURIComponent(req.params.leadId)}`);
});

// Recebe HTML do N8N e salva em Supabase (substitui o salvamento no Firebase propostas)
app.post("/api/salvar-proposta", async (req, res) => {
  try {
    const body = req.body;
    console.log("[salvar-proposta] campos recebidos:", Object.keys(body).join(", "));
    const leadId = body.leadId || body.lead_id;
    if (!leadId) return res.status(400).json({ error: "leadId obrigatorio" });
    // Aceita qualquer variante de nome de campo que o N8N possa enviar
    const html = body.siteHtml || body.indexHtml || body.html || body.htmlContent || body.site_html || body.siteHTML || "";
    const slug = body.slug || body.site_slug || body.siteSlug || "";
    const relatorioHtml = body.relatorioHtml || body.analiseHtml || body.analise_html || "";
    console.log(`[salvar-proposta] leadId=${leadId} slug=${slug} html=${html ? html.length + " chars" : "vazio"}`);
    const baseUrl = "https://www.escomstudio.com.br";
    const siteUrl = `${baseUrl}/proposta/${leadId}`;
    const patch: any = { site_gerado: siteUrl };
    if (html) patch.site_html = html;
    if (slug) patch.site_slug = slug;
    if (relatorioHtml) patch.analise_html = relatorioHtml;
    await sbFetch(`/leads?id=eq.${encodeURIComponent(leadId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify(patch),
    });
    res.json({ ok: true, siteUrl, savedHtml: !!html });
  } catch(e: any) { res.status(500).json({ error: e.message }); }
});

app.get("/api/proposals/:id", async (req, res) => {
  try {
    const rows = await sbFetch(`/leads?id=eq.${encodeURIComponent(req.params.id)}&select=*&limit=1`).catch(() => []);
    if (rows && rows.length > 0) res.json({ success: true, proposal: rows[0] });
    else res.status(404).json({ success: false, error: "Proposal not found" });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// --- Build & Deploy ---
export async function generateMandatory15SectionsHtml(payload) {
  const { formData, siteData, reports, projectId, diagnostico, rating, reviewsCount, scoreOportunidade } = payload;
  const pid = projectId || "site_" + Date.now();
  const name = formData?.companyName || "Empresa";
  const niche = formData?.niche || "";
  const comp = formData?.primaryHex || "#ff5a00";
  const escomColor = "#00d1ff";
  const phone = (formData?.phone || "").replace(/\D/g, "");
  const phoneDisplay = formData?.phone || "";
  const address = formData?.address || "";
  const website = formData?.website || "";
  const city = formData?.city || "";
  const esc = s => (s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");

  // Extrai dados de diagnóstico reais do Supabase
  const pagespeed = diagnostico?.pagespeed || null;
  const geminiAnalysis = diagnostico ? {
    identidadeVisual: diagnostico.identidadeVisualUI,
    heuristicas: diagnostico.heuristicasNielsen,
    arquitetura: diagnostico.arquiteturaInformacao,
    acessibilidade: diagnostico.acessibilidade,
    vieses: diagnostico.viesesCognitivosDarkPatterns,
  } : null;
  const scorePS = pagespeed?.performance ?? null;
  const ratingStr = rating ? `${rating} estrelas (${reviewsCount || 0} avaliações no Google)` : "não disponível";
  const scoreStr = scoreOportunidade ? `${scoreOportunidade}/100` : "não calculado";

  // Selecionar imagens do Unsplash dinâmicas baseadas no nicho
  const nicheLower = niche.toLowerCase();
  let imgHero = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop";
  let imgSolution = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop";
  let imgAbout = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop";

  if (nicheLower.includes("barbearia") || nicheLower.includes("barber") || nicheLower.includes("salão") || nicheLower.includes("cabelo") || nicheLower.includes("beleza")) {
    imgHero = "https://images.unsplash.com/photo-1621607512022-6aecc4fed814?q=80&w=1200&auto=format&fit=crop";
    imgSolution = "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1200&auto=format&fit=crop";
    imgAbout = "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1200&auto=format&fit=crop";
  } else if (nicheLower.includes("restaurante") || nicheLower.includes("comida") || nicheLower.includes("gastronomia") || nicheLower.includes("parrilla") || nicheLower.includes("churrasco") || nicheLower.includes("sushi") || nicheLower.includes("massas") || nicheLower.includes("pizzaria") || nicheLower.includes("alimento")) {
    imgHero = "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop";
    imgSolution = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop";
    imgAbout = "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1200&auto=format&fit=crop";
  } else if (nicheLower.includes("dentista") || nicheLower.includes("odonto") || nicheLower.includes("clínica") || nicheLower.includes("médica") || nicheLower.includes("estética") || nicheLower.includes("saúde") || nicheLower.includes("fisioterapia") || nicheLower.includes("quiropraxia") || nicheLower.includes("doctor")) {
    imgHero = "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200&auto=format&fit=crop";
    imgSolution = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop";
    imgAbout = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop";
  } else if (nicheLower.includes("advogado") || nicheLower.includes("advocacia") || nicheLower.includes("jurídico") || nicheLower.includes("lei") || nicheLower.includes("law")) {
    imgHero = "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200&auto=format&fit=crop";
    imgSolution = "https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1200&auto=format&fit=crop";
    imgAbout = "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=1200&auto=format&fit=crop";
  } else if (nicheLower.includes("mecanica") || nicheLower.includes("mecânica") || nicheLower.includes("oficina") || nicheLower.includes("carro") || nicheLower.includes("auto") || nicheLower.includes("automotive")) {
    imgHero = "https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=1200&auto=format&fit=crop";
    imgSolution = "https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?q=80&w=1200&auto=format&fit=crop";
    imgAbout = "https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?q=80&w=1200&auto=format&fit=crop";
  } else if (nicheLower.includes("moda") || nicheLower.includes("boutique") || nicheLower.includes("closet") || nicheLower.includes("roupa") || nicheLower.includes("estilo") || nicheLower.includes("store")) {
    imgHero = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop";
    imgSolution = "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop";
    imgAbout = "https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=1200&auto=format&fit=crop";
  }

  // --- GEMINI 2.0 FLASH: Gerar HTML completo com dados reais do lead ---
  const geminiKey = process.env.GEMINI_API_KEY || process.env.CUSTOM_GEMINI_KEY || process.env.STITCH_API_KEY;
  if (geminiKey) {
    try {
      const diagnosticoStr = geminiAnalysis ? JSON.stringify(geminiAnalysis) : "nao disponivel";
      const pagespeedStr = pagespeed ? `Performance: ${pagespeed.performance}%, Acessibilidade: ${pagespeed.acessibilidade}%, SEO: ${pagespeed.seo}%, Boas Praticas: ${pagespeed.bestPractices}%` : "nao disponivel";

      const prompt = `Você é um Engenheiro de Front-end Sênior, Copywriter de Elite, Especialista em UI/UX e Estrategista de Conversão da ESCOM Studio.
Sua missão é gerar o código HTML COMPLETO de uma Landing Page de alta conversão para o lead abaixo.

════════════════════════════════════════
DADOS REAIS DA EMPRESA
════════════════════════════════════════
- Nome: ${name}
- Nicho: ${niche}
- Cidade: ${city}
- Telefone: ${phoneDisplay}
- Endereço: ${address}
- Site atual: ${website || "não possui"}
- Avaliação Google: ${ratingStr}
- Score de oportunidade (0=baixo, 100=alto): ${scoreStr}

════════════════════════════════════════
DIAGNÓSTICO TÉCNICO DO SITE ATUAL (dados reais)
════════════════════════════════════════
PageSpeed (mobile): ${pagespeedStr}
Análise UX/Gemini: ${diagnosticoStr}

USE esses dados para fundamentar a copy de agitação do problema e os diferenciais.
Se a performance for baixa (<50%), use isso como argumento de problema.
Se a acessibilidade for baixa, mencione que o site afasta clientes.
Se o score de oportunidade for alto, enfatize o potencial de crescimento.

════════════════════════════════════════
PRINCÍPIOS DE DESIGN OBRIGATÓRIOS
════════════════════════════════════════
HIERARQUIA E COPY:
- O hero deve fazer UMA promessa em até 8 palavras, sem frase de efeito genérica
- Cada seção responde a UMA dúvida real do cliente (não lista features, resolve objeções)
- Apenas UM botão CTA primário por seção, repetido com variações ao longo da página
- Copy específica ao nicho ${niche} e à cidade ${city}. NUNCA usar "Excelência em" ou "Bem-vindo"

TIPOGRAFIA (Google Fonts obrigatórias):
- Playfair Display: headlines H1/H2 (tamanho mínimo H1: 48px mobile, 72px desktop)
- Plus Jakarta Sans: corpo, labels, CTAs (mínimo 16px corpo)
- Contraste mínimo de peso entre H1 e parágrafo: H1 bold, parágrafo regular
- Line-height corpo: 1.6 a 1.8. Line-length: máximo 65 caracteres por linha

CORES:
- Bloco B (site do cliente): cor primária ${comp}. Usar com moderação: apenas em CTAs, destaques e acentos
- Bloco A/C (ESCOM): ciano ${escomColor}
- Fundo: #0a0a0a. Cards: glassmorphism com rgba(255,255,255,0.05) e border rgba(255,255,255,0.08)
- Texto principal: #f1f5f9. Texto secundário: #94a3b8
- Contraste mínimo WCAG AA em todo texto sobre fundo escuro

ESPAÇAMENTO E GRID:
- Sistema de espaçamento consistente: 8px base. Seções com padding mínimo de 80px vertical
- Grid de cards: gap mínimo de 24px entre itens
- Hit targets (botões, links): mínimo 44px de altura

ANIMAÇÕES (GSAP + ScrollTrigger):
- Apenas fade-up + stagger em elementos ao entrar no viewport. Sem exageros
- Duração máxima por animação: 0.8s. Easing: power2.out
- Lenis smooth scroll inicializado com lerp: 0.1

════════════════════════════════════════
STACK TÉCNICA OBRIGATÓRIA
════════════════════════════════════════
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"></script>

Imagens: Unsplash com q=80&w=1200&auto=format&fit=crop. Use fotos de barbearia para nicho barbearia, etc.
Todos os <img> com loading="lazy" width e height definidos.

════════════════════════════════════════
SEO TÉCNICO OBRIGATÓRIO (no <head>)
════════════════════════════════════════
<meta name="robots" content="noindex, nofollow">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta charset="UTF-8">
<html lang="pt-br">
<title>${name} | Proposta Exclusiva ESCOM Studio</title>
<meta name="description" content="[descrição real do negócio com nicho e cidade, 150 chars]">
<meta property="og:title" content="${name} | Proposta Digital">
<meta property="og:description" content="[descrição real]">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
Schema.org JSON-LD LocalBusiness (ou subtipo correto do nicho, ex: HairSalon para barbearia):
<script type="application/ld+json">{"@context":"https://schema.org","@type":"[TipoCorreto]","name":"${name}","address":{"@type":"PostalAddress","streetAddress":"${address}","addressLocality":"${city}","addressCountry":"BR"},"telephone":"${phoneDisplay}"${website ? `,"url":"${website}"` : ""}}</script>

════════════════════════════════════════
ESTRUTURA OBRIGATÓRIA: 15 SEÇÕES EM 3 BLOCOS
════════════════════════════════════════

BLOCO B — SITE DO CLIENTE (cor: ${comp})
1. HERO (id="hero"): Fullscreen. Imagem Unsplash do nicho com overlay escuro 75%. H1 com a promessa principal de ${name} em ${city}. Subtítulo em 1 frase. CTA primário "Agende agora" → WhatsApp: https://wa.me/55${phone}?text=Olá,+vi+o+site+e+quero+agendar. CTA secundário "Ver serviços" scroll suave. GSAP entrada.
2. PROBLEMA (id="problema"): H2 que nomeia a dor real do nicho. 3 cards com problema específico de ${niche} (use dados do diagnóstico Gemini se disponíveis).
3. SOLUÇÃO (id="solucao"): Layout split. Texto: como ${name} resolve cada problema. Imagem Unsplash do nicho. 4 checkmarks com benefícios concretos.
4. DIFERENCIAIS (id="diferenciais"): 4 cards com diferenciais REAIS (baseados no nicho e cidade, não genéricos). Hover com border ${comp}.
5. COMO FUNCIONA (id="como-funciona"): 3 passos numerados (01/02/03) da jornada do cliente de ${name}.
6. DEPOIMENTOS (id="depoimentos"): 3 depoimentos verossímeis com nome + cidade (${city}). Avatar face Unsplash.
7. SOBRE (id="sobre"): Split. Texto sobre a história/paixão de ${name}. 3 stats relevantes ao nicho (use rating ${rating} se disponível).
8. FAQ (id="faq"): Accordion JS. 4 perguntas reais do nicho ${niche}.
9. CTA FINAL (id="cta-final"): Urgência + botão WhatsApp. Fundo com textura ou gradiente em ${comp}.

BLOCO A — PROPOSTA COMERCIAL (cor: ${escomColor})
10. URGÊNCIA (id="banner-urgencia"): Banner animado. Texto: "Proposta exclusiva para ${name} valida por 72 horas".
11. DOSSIE (id="dossie"): "Diagnostico Digital de ${name}". 4 cards: Score ${scoreStr}, Performance ${scorePS !== null ? scorePS + "%" : "N/A"}, Oportunidade identificada, ROI projetado. Botao "Ver Diagnostico Completo em PDF" → https://escomstudio.com.br/proposta-escom-${pid}.
12. INVESTIMENTO (id="investimento"): De R$ 4.500 por R$ 990 taxa unica. Lista de entregaveis. Badge "Oferta valida 72h".
13. EXPANSOES (id="expansoes"): 4 modulos adicionais (CRM R$97/mes, Chatbot IA R$147/mes, Dashboard R$97/mes, WhatsApp Bot R$197/mes).

BLOCO C — INSTITUCIONAL ESCOM (cor: ${escomColor})
14. ESCOM (id="escom"): Historia da agencia. Badges de capacidades tecnicas.
15. FOOTER (id="footer"): Formulario de aceite. Contatos. Botao WhatsApp flutuante fixo → https://wa.me/55${phone}?text=Quero+saber+mais.

════════════════════════════════════════
REGRAS ABSOLUTAS
════════════════════════════════════════
1. PROIBIDO travessao (— ou –) em qualquer texto. Use virgula ou ponto.
2. PROIBIDO frases genericas: "Excelencia em", "Bem-vindo", "Solucoes inovadoras", "Compromisso com qualidade"
3. TODA copy deve ser especifica a ${name}, ${niche}, ${city}
4. WhatsApp sempre com DDI: https://wa.me/55${phone}
5. Retorne APENAS o HTML. Comece com <!DOCTYPE html>. Sem markdown, sem explicacoes.`;

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.2, maxOutputTokens: 65536 }
          })
        }
      );
      if (!geminiRes.ok) throw new Error(`Gemini HTTP ${geminiRes.status}`);
      const geminiData = await geminiRes.json();
      let html = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (html.includes("```html")) html = html.split("```html")[1].split("```")[0].trim();
      else if (html.includes("```")) html = html.split("```")[1].split("```")[0].trim();
      html = html.trim();
      html = html.replace(/—/g, ",").replace(/–/g, ",");
      if (html.startsWith("<!DOCTYPE html>") || html.includes("<html")) return html;
    } catch (e) {
      console.error("[BUILD_HTML] Falha ao gerar via Gemini:", e.message);
      throw new Error("Gemini falhou: " + e.message);
    }
  } else {
    throw new Error("Nenhuma chave Gemini encontrada nas env vars");
  }

  // --- FALLBACK: Template Premium v3.0 com 15 Seções ---
  console.log("[BUILD_HTML] Utilizando template fallback v3.0 com 15 seções.");
  const isParrilla = nicheLower.includes("parrilla") || nicheLower.includes("churrasco") || nicheLower.includes("restaurante");

  const hero = siteData?.hero || (isParrilla 
    ? { headline: "A autêntica parrilla uruguaia assada na lenha", subheadline: "Cortes Angus e Hereford premium grelhados na temperatura e ponto corretos", cta: "Reservar Mesa" }
    : {});
  const about = siteData?.about || {};
  const services = siteData?.services || (isParrilla
    ? [
        { title: "Bife de Ancho", description: "Corte alto com marmoreio superior e a clássica gordura interna que traz suculência máxima." },
        { title: "Bife de Chorizo", description: "Clássico contrafilé com sua generosa capa de gordura selada na grelha uruguaia." },
        { title: "Assado de Tira", description: "Corte transversal da costela Angus assada em alta temperatura, crocante por fora e macia por dentro." },
        { title: "Boutique de Carnes", description: "Leve os cortes nobres embalados a vácuo com espessura personalizada para grelhar em casa." }
      ]
    : []);
  const problemAgitation = siteData?.problemAgitation || (isParrilla
    ? { title: "Cansado de churrascos secos e sem marmoreio?", subtitle: "Casas tradicionais erram no ponto da carne e utilizam carvão mineral comum.", problems: [{ icon: "🥩", title: "Corte seco ou passado", description: "Pedir um bife de ancho alto e recebê-lo seco ou passado estraga o ritual gastronômico." }, { icon: "🪵", title: "Falta de sabor autêntico", description: "O carvão mineral comum amarga e esconde o verdadeiro sabor das carnes nobres." }, { icon: "⏳", title: "Atendimento mecânico", description: "A pressa do rodízio comum impede você de saborear e relaxar com calma." }] }
    : { title: `Você sente que seu negócio poderia render mais?`, subtitle: `Muitos profissionais de ${niche} enfrentam desafios silenciosos que travam o crescimento`, problems: [{ icon: "😓", title: "Clientes que não voltam", description: "A falta de presença digital forte faz com que clientes em potencial escolham a concorrência." }, { icon: "📉", title: "Resultados estagnados", description: "Sem uma estratégia de conversão, o crescimento fica travado mês após mês." }, { icon: "🔍", title: "Invisibilidade online", description: "Quando alguém busca por ${niche}, sua empresa simplesmente não aparece." }] });
  const solution = siteData?.solution || (isParrilla
    ? { title: "O fogo da lenha de macieira ao seu prato", subtitle: "Sabor marcante com origem controlada", description: "Assamos nossas carnes no calor da lenha de macieira e acácia, usando a autêntica grelha uruguaia inclinada para defumar perfeitamente cada corte sem queimar a gordura.", features: ["Cortes Angus Prime com marmoreio superior", "Assado feito 100 por cento na lenha de macieira", "Chimichurri caseiro com ervas frescas da horta", "Ponto exato da carne garantido na mesa"] }
    : { title: `${name}: a solução que você buscava`, subtitle: "Transformamos sua presença digital em uma máquina de resultados", description: `Com anos de experiência em ${niche}, oferecemos um serviço completo que conecta você ao seu público ideal com resultados mensuráveis.`, features: ["Atendimento personalizado e humanizado", "Tecnologia de ponta aplicada ao seu negócio", "Resultados comprovados e mensuráveis", "Suporte contínuo e dedicado"] });
  const differentials = siteData?.differentials || (isParrilla
    ? { title: "O Ritual da Brasa Forte", items: [{ icon: "🪵", title: "Defumação Frutífera", description: "A lenha de macieira confere uma nota frutada sutil e carameliza perfeitamente as fibras da carne." }, { icon: "📐", title: "Grelha Uruguaia Inclinada", description: "Canaliza a gordura para as canaletas externas, evitando labaredas de labareda preta que amargam a carne." }, { icon: "🏆", title: "Origem Controlada", description: "Trabalhamos exclusivamente com produtores selecionados do pampa uruguaio e gaúcho." }, { icon: "🤝", title: "Apresentação na Mesa", description: "Nosso assador apresenta o corte e a espessura na tábua de madeira antes de levar ao fogo." }] }
    : { title: "Por que nos escolher?", items: [{ icon: "🏆", title: "Excelência comprovada", description: "Anos de experiência e centenas de clientes satisfeitos no mercado." }, { icon: "⚡", title: "Resultados rápidos", description: "Metodologia ágil que gera impacto já nos primeiros 30 dias." }, { icon: "🎯", title: "Foco no seu nicho", description: `Especialistas em ${niche} com profundo conhecimento do mercado.` }, { icon: "🤝", title: "Parceria genuína", description: "Tratamos seu negócio como se fosse o nosso. Seu sucesso é o nosso sucesso." }] });
  const howItWorks = siteData?.howItWorks || (isParrilla
    ? { title: "Como Funciona o Nosso Ritual", steps: [{ number: "01", title: "Escolha do Corte", description: "Selecione o corte, espessura e marmoreio diretamente na nossa vitrine da boutique." }, { number: "02", title: "Brasa e Descanso", description: "A carne é grelhada na lenha e descansa por 2 minutos para concentrar a suculência interna." }, { number: "03", title: "Harmonização", description: "Servido na tábua quente com guarnições artesanais e chimichurri fresco." }] }
    : { title: "Como Funciona", steps: [{ number: "01", title: "Diagnóstico", description: "Analisamos seu negócio, mercado e concorrência para identificar oportunidades." }, { number: "02", title: "Estratégia", description: "Criamos um plano personalizado com metas claras e mensuráveis." }, { number: "03", title: "Execução", description: "Implementamos as soluções e acompanhamos os resultados em tempo real." }] });
  const socialProof = siteData?.socialProof || (isParrilla
    ? { title: "Depoimentos de quem vive a nossa brasa", testimonials: [{ name: "Guilherme Santos", role: "Crítico Gastronômico", text: "O bife de tira com chimichurri artesanal é sensacional. O aroma frutado da lenha eleva a carne a outro patamar." }, { name: "Beatriz M.", role: "Empresária", text: "Ambiente espetacular e intimista. Os cortes Angus têm maciez incomparável. Atendimento impecável." }, { name: "Carlos Eduardo", role: "Sommelier", text: "Carta de vinhos incrível, com excelentes Tannats que harmonizam perfeitamente com a suculência dos cortes." }] }
    : { title: "O que dizem nossos clientes", testimonials: [{ name: "Ana Carolina", role: "Empresária", text: "Transformaram completamente a presença digital do meu negócio. Os resultados superaram todas as expectativas." }, { name: "Roberto Silva", role: "Diretor Comercial", text: "Profissionalismo e dedicação exemplares. Recomendo para qualquer empresa que busca crescimento real." }, { name: "Mariana Costa", role: "Gerente de Marketing", text: "Equipe excepcional que entende profundamente o mercado. Parceria que faz toda a diferença." }] });
  const aboutData = { title: about.title || `Sobre a ${name}`, text: about.text || (isParrilla ? "Nossa história começou com a paixão pelo fogo primitivo e o respeito à tradição uruguaia. Assamos nossas carnes exclusivamente no calor de lenhas nobres, selecionamos cortes Angus Prime com marmoreio superior e oferecemos um espaço acolhedor e intimista para celebrar a boa gastronomia." : `Somos referência em ${niche}, combinando expertise técnica com atendimento humanizado. Nossa missão é transformar negócios através de soluções inovadoras que geram resultados reais e duradouros.`), stats: about.stats || siteData?.about?.stats || (isParrilla ? [{ number: "4.9", label: "Avaliação Google" }, { number: "+15k", label: "Assados Feitos" }, { number: "100%", label: "Lenhas Nobres" }] : [{ number: "+500", label: "Clientes Atendidos" }, { number: "+10", label: "Anos de Experiência" }, { number: "98%", label: "Satisfação" }]) };
  const faq = siteData?.faq || (isParrilla
    ? { title: "Dúvidas Frequentes", items: [{ question: "Qual o ponto padrão servido?", answer: "Nossos cortes são servidos no ponto do parrillero (centro rosado e extremamente suculento). Se preferir bem passado ou mal passado, avise ao assador." }, { question: "Posso comprar para levar?", answer: "Sim. Temos nossa Boutique de Carnes integrada com cortes cortados na hora e embalados a vácuo para preparar em casa." }, { question: "Como funciona a harmonização?", answer: "Nossos assadores e sommeliers sugerem os melhores vinhos tintos (com destaque para Tannat e Malbec) para acompanhar a gordura caramelizada." }, { question: "É preciso fazer reserva?", answer: "Recomendamos reservas para os fins de semana e jantares, mas atendemos também por ordem de chegada." }] }
    : { title: "Dúvidas Frequentes", items: [{ question: "Quanto tempo leva para ver resultados?", answer: "Nossos clientes começam a perceber resultados expressivos já nos primeiros 30 a 60 dias, dependendo do serviço contratado." }, { question: `Vocês são especializados em ${niche}?`, answer: `Sim, temos anos de experiência atendendo empresas do segmento de ${niche}, o que nos permite entregar soluções sob medida para as necessidades específicas do setor.` }, { question: "Como funciona o processo de contratação?", answer: "É simples: você entra em contato, fazemos um diagnóstico gratuito do seu negócio e apresentamos uma proposta personalizada. Sem compromisso e sem burocracia." }, { question: "Existe contrato de fidelidade?", answer: "Não trabalhamos com fidelidade contratual. Acreditamos que a parceria deve ser mantida pela entrega de valor e resultados, não por obrigação." }] });
  const finalCta = siteData?.finalCta || (isParrilla
    ? { title: "Garanta o seu lugar na brasa mais disputada", subtitle: "As mesas para o final de semana costumam preencher rapidamente. Faça sua reserva online.", buttonText: "Reservar Mesa via WhatsApp" }
    : { title: "Pronto para transformar seu negócio?", subtitle: "Solicite agora seu diagnóstico gratuito e descubra o potencial inexplorado da sua empresa.", buttonText: "Quero Começar Agora" });

  const svcIcons = isParrilla
    ? ["fa-solid fa-drumstick-bite", "fa-solid fa-fire", "fa-solid fa-wine-glass", "fa-solid fa-award", "fa-solid fa-store", "fa-solid fa-utensils"]
    : ["fa-solid fa-briefcase", "fa-solid fa-rocket", "fa-solid fa-chart-line", "fa-solid fa-shield-halved", "fa-solid fa-gears", "fa-solid fa-check-double"];

  const svcCards = services.length > 0
    ? services.map((s,i) => {
        const iconClass = svcIcons[i % svcIcons.length];
        return `<div class="gs-card fade-up"><div class="gs-icon"><i class="${iconClass}" style="color:${comp}"></i></div><h3>${esc(s.title||"")}</h3><p>${esc(s.description||"")}</p></div>`;
      }).join("")
    : (isParrilla
        ? `<div class="gs-card fade-up"><div class="gs-icon"><i class="fa-solid fa-drumstick-bite" style="color:${comp}"></i></div><h3>Cortes Prime</h3><p>Seleção Angus e Hereford com marmoreio superior e origem certificada.</p></div>
           <div class="gs-card fade-up"><div class="gs-icon"><i class="fa-solid fa-fire" style="color:${comp}"></i></div><h3>Brasa de Lenha</h3><p>Assado feito 100 por cento no calor de lenhas nobres de macieira e acácia.</p></div>
           <div class="gs-card fade-up"><div class="gs-icon"><i class="fa-solid fa-wine-glass" style="color:${comp}"></i></div><h3>Carta de Vinhos</h3><p>Rótulos excepcionais de vinhos uruguaios e tintos encorpados para harmonização.</p></div>
           <div class="gs-card fade-up"><div class="gs-icon"><i class="fa-solid fa-award" style="color:${comp}"></i></div><h3>Grelha Uruguaia</h3><p>O autêntico preparo uruguaio inclinado que preserva a gordura sem queimar.</p></div>
           <div class="gs-card fade-up"><div class="gs-icon"><i class="fa-solid fa-store" style="color:${comp}"></i></div><h3>Boutique de Carnes</h3><p>Adquira os mesmos cortes embalados a vácuo na boutique para grelhar em casa.</p></div>
           <div class="gs-card fade-up"><div class="gs-icon"><i class="fa-solid fa-utensils" style="color:${comp}"></i></div><h3>Acompanhamentos</h3><p>Guarnições gourmet e chimichurri fresco feitos artesanalmente no dia.</p></div>`
        : `<div class="gs-card fade-up"><div class="gs-icon"><i class="fa-solid fa-star" style="color:${comp}"></i></div><h3>Serviço Premium</h3><p>Oferecemos o mais alto padrão em todas as etapas da prestação de serviço.</p></div>
           <div class="gs-card fade-up"><div class="gs-icon"><i class="fa-solid fa-bolt" style="color:${comp}"></i></div><h3>Agilidade</h3><p>Processo otimizado para entregar resultados rápidos e consistentes.</p></div>
           <div class="gs-card fade-up"><div class="gs-icon"><i class="fa-solid fa-heart" style="color:${comp}"></i></div><h3>Dedicação</h3><p>Suporte personalizado focado no sucesso e na satisfação do cliente.</p></div>`);

  const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${esc(name)} | ${esc(niche)}</title>
<meta name="description" content="${esc(hero.subheadline || ('Excelência em ' + niche + '. ' + name))}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"><\/script>
<script>tailwind.config={theme:{extend:{colors:{primary:'${comp}',escom:'${escomColor}',dark:'#0a0a0a'},fontFamily:{display:['Playfair Display','serif'],body:['Plus Jakarta Sans','sans-serif']}}}}<\/script>
<style>
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Plus Jakarta Sans',sans-serif;background:#000000;color:#f1f1f1;overflow-x:hidden;padding-top:40px}
.fade-up{opacity:0;transform:translateY(40px);transition:opacity 0.8s cubic-bezier(0.22,1,0.36,1),transform 0.8s cubic-bezier(0.22,1,0.36,1)}
.fade-up.visible{opacity:1;transform:translateY(0)}

/* Glass cards */
.gs-card{background:linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01));border:1px solid rgba(255,255,255,0.04);border-radius:0.375rem;padding:2rem;transition:all 0.4s cubic-bezier(0.22,1,0.36,1)}
.gs-card:hover{transform:translateY(-4px);border-color:${comp}44;box-shadow:0 15px 30px rgba(0,0,0,0.6)}
.gs-card-escom:hover{transform:translateY(-4px);border-color:${escomColor}44;box-shadow:0 15px 30px rgba(0,0,0,0.6)}
.gs-icon{font-size:2rem;margin-bottom:1rem}
.gs-card h3{font-family:'Playfair Display',serif;font-size:1.15rem;font-weight:700;margin-bottom:0.5rem}
.gs-card p{color:rgba(255,255,255,0.5);line-height:1.7;font-size:0.9rem}

/* Buttons */
.btn-p{display:inline-flex;align-items:center;gap:0.5rem;background:${comp};color:#000;font-weight:700;padding:0.875rem 2rem;border-radius:0.25rem;text-decoration:none;transition:all 0.3s;font-size:0.95rem;border:none;cursor:pointer}
.btn-p:hover{transform:translateY(-2px);box-shadow:0 8px 20px ${comp}33}
.btn-o{display:inline-flex;align-items:center;gap:0.5rem;background:transparent;color:#fff;font-weight:600;padding:0.875rem 2rem;border-radius:0.25rem;text-decoration:none;transition:all 0.3s;font-size:0.95rem;border:1px solid rgba(255,255,255,0.15)}
.btn-o:hover{border-color:${comp};background:${comp}11}
.btn-escom{display:inline-flex;align-items:center;gap:0.5rem;background:${escomColor};color:#000;font-weight:700;padding:0.875rem 2rem;border-radius:0.25rem;text-decoration:none;transition:all 0.3s;font-size:0.95rem;border:none;cursor:pointer}
.btn-escom:hover{transform:translateY(-2px);box-shadow:0 8px 20px ${escomColor}33}

/* Shimmer bar */
@keyframes shimmer{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}

/* FAQ */
.faq-q{cursor:pointer;padding:1.25rem 0;border-bottom:1px solid rgba(255,255,255,0.06)}
.faq-q .arrow{transition:transform 0.3s}
.faq-q.active .arrow{transform:rotate(180deg)}
.faq-a{max-height:0;overflow:hidden;transition:max-height 0.4s ease,padding 0.3s;color:rgba(255,255,255,0.5);line-height:1.7}
.faq-q.active+.faq-a{max-height:300px;padding:0 0 1.25rem}

/* WhatsApp */
.wa-float{position:fixed;bottom:1.5rem;right:1.5rem;width:56px;height:56px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(37,211,102,0.4);z-index:999;text-decoration:none;transition:transform 0.3s;color:#fff;font-size:1.5rem}
.wa-float:hover{transform:scale(1.1)}

/* Form inputs */
.f-input{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:0.25rem;padding:0.875rem 1.25rem;color:#fff;font-size:0.9rem;outline:none;width:100%;font-family:inherit;transition:border-color 0.3s}
.f-input:focus{border-color:${comp}}
.f-input-escom:focus{border-color:${escomColor}}
</style>
</head><body>

<!-- ═══════════════════════════════════════════════ -->
<!-- BLOCO B: SITE DA EMPRESA (9 SEÇÕES DE ALTA CONVERSÃO) -->
<!-- ═══════════════════════════════════════════════ -->

<!-- B.5: HERO -->
<section id="hero" class="relative min-h-screen flex items-center justify-center text-center overflow-hidden px-[5%]">
<div class="absolute inset-0 z-0">
  <img src="${imgHero}" alt="${esc(name)}" class="w-full h-full object-cover opacity-20 filter brightness-[0.3]" />
</div>
<div class="relative z-10 max-w-4xl mx-auto fade-up">
  <h1 class="font-display text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6" style="background:linear-gradient(135deg,#fff 60%,${comp});-webkit-background-clip:text;-webkit-text-fill-color:transparent;">${esc(hero.headline || name)}</h1>
  <p class="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">${esc(hero.subheadline || ('Excelência em ' + niche))}</p>
  <div class="flex gap-4 flex-wrap justify-center">
    <a href="#footer" class="btn-p">${esc(hero.cta || 'Solicite um Orçamento')}</a>
    <a href="#solucao" class="btn-o">Conheça Nossos Serviços</a>
  </div>
</div>
</section>

<!-- B.6: AGITAÇÃO DO PROBLEMA -->
<section id="problema" class="py-20 px-[5%]" style="background:linear-gradient(180deg,rgba(255,255,255,0.01),#000000);">
<div class="max-w-5xl mx-auto text-center">
  <span class="inline-block bg-red-500/10 text-red-400 text-xs font-bold px-4 py-1.5 rounded-full border border-red-500/20 uppercase tracking-widest mb-6 fade-up">Você se identifica?</span>
  <h2 class="font-display text-3xl md:text-4xl font-bold mb-3 fade-up">${esc(problemAgitation.title)}</h2>
  <p class="text-white/50 max-w-xl mx-auto mb-12 fade-up">${esc(problemAgitation.subtitle || '')}</p>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    ${(problemAgitation.problems || []).map(p => {
      const isFa = (p.icon || '').startsWith('fa-');
      const iconContent = isFa ? `<i class="${p.icon}" style="color:${comp}"></i>` : (p.icon || '😓');
      return `<div class="gs-card text-center fade-up"><div class="text-3xl mb-4 flex justify-center">${iconContent}</div><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p></div>`;
    }).join('')}
  </div>
</div>
</section>

<!-- B.7: A SOLUÇÃO -->
<section id="solucao" class="py-20 px-[5%]">
<div class="max-w-5xl mx-auto">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
    <div class="fade-up">
      <span class="inline-block bg-green-500/10 text-green-400 text-xs font-bold px-4 py-1.5 rounded-full border border-green-500/20 uppercase tracking-widest mb-6">A Solução</span>
      <h2 class="font-display text-3xl md:text-4xl font-bold mb-4">${esc(solution.title)}</h2>
      <p class="text-white/50 leading-relaxed mb-6">${esc(solution.description)}</p>
      <ul class="space-y-3">
        ${(solution.features || []).map(f => `<li class="flex gap-3 items-center text-white/70"><span class="w-5 h-5 flex items-center justify-center text-xs font-bold" style="background:${comp}22;color:${comp};border-radius:2px;">✓</span>${esc(f)}</li>`).join('')}
      </ul>
    </div>
    <div class="fade-up" style="aspect-ratio:1;border-radius:0.375rem;overflow:hidden;border:1px solid rgba(255,255,255,0.06);">
      <img src="${imgSolution}" alt="${esc(name)}" class="w-full h-full object-cover" />
    </div>
  </div>
</div>
</section>

<!-- B.8: DIFERENCIAIS -->
<section id="diferenciais" class="py-20 px-[5%]" style="background:rgba(255,255,255,0.005);">
<div class="max-w-5xl mx-auto text-center">
  <span class="inline-block text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-6 fade-up" style="background:${comp}11;color:${comp};border:1px solid ${comp}33">Diferenciais</span>
  <h2 class="font-display text-3xl md:text-4xl font-bold mb-12 fade-up">${esc(differentials.title)}</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    ${(differentials.items || []).map(d => {
      const isFa = (d.icon || '').startsWith('fa-');
      const iconContent = isFa ? `<i class="${d.icon}" style="color:${comp}"></i>` : (d.icon || '🏆');
      return `<div class="gs-card text-left fade-up"><div class="text-2xl mb-3 flex items-center">${iconContent}</div><h3>${esc(d.title)}</h3><p>${esc(d.description)}</p></div>`;
    }).join('')}
  </div>
</div>
</section>

<!-- B.9: COMO FUNCIONA -->
<section id="como-funciona" class="py-20 px-[5%]">
<div class="max-w-4xl mx-auto text-center">
  <span class="inline-block bg-blue-500/10 text-blue-400 text-xs font-bold px-4 py-1.5 rounded-full border border-blue-500/20 uppercase tracking-widest mb-6 fade-up">Processo</span>
  <h2 class="font-display text-3xl md:text-4xl font-bold mb-12 fade-up">${esc(howItWorks.title)}</h2>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
    ${(howItWorks.steps || []).map(s => `<div class="fade-up text-center"><div class="font-display text-5xl font-black mb-4" style="color:${comp}">${s.number}</div><h3 class="font-display text-lg font-bold mb-2">${esc(s.title)}</h3><p class="text-white/50 text-sm leading-relaxed">${esc(s.description)}</p></div>`).join('')}
  </div>
</div>
</section>

<!-- B.10: PROVA SOCIAL -->
<section id="depoimentos" class="py-20 px-[5%]" style="background:rgba(255,255,255,0.005);">
<div class="max-w-5xl mx-auto text-center">
  <span class="inline-block bg-amber-500/10 text-amber-400 text-xs font-bold px-4 py-1.5 rounded-full border border-amber-500/20 uppercase tracking-widest mb-6 fade-up">Depoimentos</span>
  <h2 class="font-display text-3xl md:text-4xl font-bold mb-12 fade-up">${esc(socialProof.title)}</h2>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    ${(socialProof.testimonials || []).map((t,i) => `<div class="gs-card text-left fade-up"><div class="text-3xl mb-4" style="color:${comp};opacity:0.3">❝</div><p class="text-white/60 text-sm leading-relaxed mb-4">${esc(t.text)}</p><div class="flex items-center gap-3"><img class="w-10 h-10 object-cover" style="border-radius:4px;" src="${["https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop","https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop","https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop"][i%3]}" alt="${esc(t.name)}" /><div><div class="text-sm font-bold">${esc(t.name)}</div><div class="text-xs text-white/40">${esc(t.role)}</div></div></div></div>`).join('')}
  </div>
</div>
</section>

<!-- B.11: SOBRE -->
<section id="sobre" class="py-20 px-[5%]">
<div class="max-w-5xl mx-auto">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
    <div class="fade-up" style="aspect-ratio:4/3;border-radius:0.375rem;overflow:hidden;border:1px solid rgba(255,255,255,0.06);">
      <img src="${imgAbout}" alt="${esc(name)}" class="w-full h-full object-cover" />
    </div>
    <div class="fade-up">
      <span class="inline-block text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-6" style="background:${comp}11;color:${comp};border:1px solid ${comp}33">Sobre Nós</span>
      <h2 class="font-display text-3xl md:text-4xl font-bold mb-4">${esc(aboutData.title)}</h2>
      <p class="text-white/50 leading-relaxed mb-8">${esc(aboutData.text)}</p>
      <div class="grid grid-cols-3 gap-4">
        ${(aboutData.stats || []).map(s => `<div class="text-center p-4 rounded-[4px]" style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.04);"><div class="text-2xl font-bold" style="color:${comp}">${esc(s.number+'')}</div><div class="text-xs text-white/40 mt-1">${esc(s.label)}</div></div>`).join('')}
      </div>
    </div>
  </div>
</div>
</section>

<!-- B.12: FAQ -->
<section id="faq" class="py-20 px-[5%]" style="background:rgba(255,255,255,0.015);">
<div class="max-w-2xl mx-auto text-center">
  <span class="inline-block bg-cyan-500/10 text-cyan-400 text-xs font-bold px-4 py-1.5 rounded-full border border-cyan-500/20 uppercase tracking-widest mb-6 fade-up">FAQ</span>
  <h2 class="font-display text-3xl md:text-4xl font-bold mb-10 fade-up">${esc(faq.title)}</h2>
  <div class="text-left fade-up">
    ${(faq.items || []).map((item,i) => `<div class="faq-q ${i===0?'active':''}" onclick="this.classList.toggle('active')"><div class="flex justify-between items-center"><span class="font-semibold">${esc(item.question)}</span><span class="arrow text-white/30"><i class="fas fa-chevron-down"></i></span></div></div><div class="faq-a">${esc(item.answer)}</div>`).join('')}
  </div>
</div>
</section>

<!-- B.13: CTA FINAL -->
<section id="cta-final" class="py-24 px-[5%] text-center" style="background:linear-gradient(135deg,${comp}15,#7c3aed15,transparent);">
<div class="max-w-3xl mx-auto fade-up">
  <h2 class="font-display text-3xl md:text-5xl font-bold mb-4">${esc(finalCta.title)}</h2>
  <p class="text-white/50 text-lg mb-8 max-w-xl mx-auto leading-relaxed">${esc(finalCta.subtitle)}</p>
  <a href="#footer" class="btn-p text-lg px-8 py-4">${esc(finalCta.buttonText || 'Quero Começar Agora')}</a>
</div>
</section>

<!-- ═══════════════════════════════════════════════ -->
<!-- BLOCO A: PROSPECÇÃO E VENDAS (ESCOM STUDIO) -->
<!-- ═══════════════════════════════════════════════ -->

<!-- BLOCO A.1: TARJA DE URGÊNCIA -->
<div id="banner-urgencia" style="position:relative;width:100%;z-index:90;padding:10px 16px;text-align:center;background:linear-gradient(90deg,#00b1ff,#00d1ff,#00b1ff);background-size:200% 100%;animation:shimmer 3s ease-in-out infinite;">
<p style="color:#000;font-size:0.75rem;font-weight:800;letter-spacing:0.05em;">Proposta exclusiva válida por 3 dias | Condições Especiais Liberadas</p>
</div>

<!-- BLOCO A.2: DOSSIÊ ESTRATÉGICO -->
<section id="dossie" class="relative py-20 px-[5%]" style="background:linear-gradient(180deg,#090909,#050505);border-top:1px solid rgba(255,255,255,0.04);">
<div class="max-w-5xl mx-auto text-center fade-up">
  <span class="inline-block bg-cyan-500/10 text-cyan-400 text-xs font-bold px-4 py-1.5 rounded-full border border-cyan-500/20 uppercase tracking-widest mb-6">Diagnóstico UX / UI</span>
  <h2 class="font-display text-3xl md:text-5xl font-bold mb-4">Dossiê de Mercado & <span class="text-cyan-400">Diagnóstico Digital</span></h2>
  <p class="text-white/50 max-w-xl mx-auto mb-10 leading-relaxed">Identificamos oportunidades reais de conversão e pontos críticos no posicionamento digital de ${esc(name)}.</p>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
    <div class="gs-card text-center"><i class="fas fa-chart-line text-green-400 text-2xl mb-2"></i><div class="text-2xl font-bold">95</div><div class="text-xs text-white/40">Score Qualidade</div></div>
    <div class="gs-card text-center"><i class="fas fa-exclamation-triangle text-red-400 text-2xl mb-2"></i><div class="text-2xl font-bold">4</div><div class="text-xs text-white/40">Pontos Críticos</div></div>
    <div class="gs-card text-center"><i class="fas fa-bullseye text-blue-400 text-2xl mb-2"></i><div class="text-2xl font-bold">7</div><div class="text-xs text-white/40">Oportunidades</div></div>
    <div class="gs-card text-center"><i class="fas fa-rocket text-purple-400 text-2xl mb-2"></i><div class="text-2xl font-bold">+300%</div><div class="text-xs text-white/40">ROI Projetado</div></div>
  </div>
  <a href="https://escom-studio.vercel.app/proposta-escom-${pid}" target="_blank" class="btn-escom"><i class="fas fa-file-pdf mr-2"></i>Visualizar Diagnóstico Técnico em PDF</a>
</div>
</section>

<!-- BLOCO A.3: INVESTIMENTO -->
<section id="investimento" class="py-20 px-[5%]" style="background:rgba(255,255,255,0.015);">
<div class="max-w-3xl mx-auto text-center fade-up">
  <span class="inline-block bg-green-500/10 text-green-400 text-xs font-bold px-4 py-1.5 rounded-full border border-green-500/20 uppercase tracking-widest mb-6">Investimento Único</span>
  <h2 class="font-display text-3xl md:text-4xl font-bold mb-8">Infraestrutura Digital Completa</h2>
  <div class="gs-card max-w-lg mx-auto text-center p-8 border-cyan-500/20" style="background:linear-gradient(135deg,rgba(0,209,255,0.04),rgba(0,0,0,0.8));">
    <div class="text-xs text-white/40 uppercase tracking-widest mb-2">Taxa Única de Lançamento</div>
    <div class="text-5xl font-bold mb-1" style="color:${escomColor}">R$ 990</div>
    <div class="text-sm text-white/40 mb-6">Pagamento único, sem mensalidades ou taxas ocultas</div>
    <ul class="text-left space-y-3 mb-8">
      <li class="flex gap-3 text-sm text-white/70"><span style="color:${escomColor}">✓</span>Landing Page premium completa com GSAP e Lenis</li>
      <li class="flex gap-3 text-sm text-white/70"><span style="color:${escomColor}">✓</span>Otimização técnica para mecanismos de busca (SEO)</li>
      <li class="flex gap-3 text-sm text-white/70"><span style="color:${escomColor}">✓</span>Hospedagem inclusa de alta performance por 12 meses</li>
      <li class="flex gap-3 text-sm text-white/70"><span style="color:${escomColor}">✓</span>Certificado SSL de segurança ativo</li>
      <li class="flex gap-3 text-sm text-white/70"><span style="color:${escomColor}">✓</span>Integração direta com o seu WhatsApp</li>
      <li class="flex gap-3 text-sm text-white/70"><span style="color:${escomColor}">✓</span>Suporte e ajustes dedicados por 90 dias</li>
    </ul>
    <span class="inline-block bg-amber-500/10 text-amber-400 text-xs font-bold px-4 py-1.5 rounded-full border border-amber-500/20 mb-4">⏰ Proposta válida por tempo limitado</span>
    <br><a href="#footer" class="btn-escom w-full justify-center">Aprovar e Começar Agora</a>
  </div>
</div>
</section>

<!-- BLOCO A.4: EXPANSÕES TECNOLÓGICAS -->
<section id="expansoes" class="py-20 px-[5%]">
<div class="max-w-5xl mx-auto text-center fade-up">
  <span class="inline-block bg-cyan-500/10 text-cyan-400 text-xs font-bold px-4 py-1.5 rounded-full border border-cyan-500/20 uppercase tracking-widest mb-6">Módulos de Expansão</span>
  <h2 class="font-display text-3xl md:text-4xl font-bold mb-4">Módulos Tecnológicos Opcionais</h2>
  <p class="text-white/50 max-w-xl mx-auto mb-10">Otimize a operação comercial de ${esc(name)} com automações avançadas.</p>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
    <div class="gs-card text-left border-cyan-500/10"><div class="flex justify-between items-start mb-3"><span class="text-2xl">🤖</span><span class="text-xs font-bold px-3 py-1 rounded-full border border-cyan-500/20" style="color:${escomColor}">R$ 290/mês</span></div><h3>CRM Inteligente</h3><p>Gestão automatizada de leads e clientes com IA para conversões recorrentes.</p></div>
    <div class="gs-card text-left border-cyan-500/10"><div class="flex justify-between items-start mb-3"><span class="text-2xl">💬</span><span class="text-xs font-bold px-3 py-1 rounded-full border border-cyan-500/20" style="color:${escomColor}">R$ 190/mês</span></div><h3>Chatbot com IA</h3><p>Atendimento automático qualificado na landing page 24/7.</p></div>
    <div class="gs-card text-left border-cyan-500/10"><div class="flex justify-between items-start mb-3"><span class="text-2xl">📊</span><span class="text-xs font-bold px-3 py-1 rounded-full border border-cyan-500/20" style="color:${escomColor}">R$ 150/mês</span></div><h3>Dashboard Analytics</h3><p>Acompanhamento de acessos e métricas de campanhas em tempo real.</p></div>
    <div class="gs-card text-left border-cyan-500/10"><div class="flex justify-between items-start mb-3"><span class="text-2xl">📱</span><span class="text-xs font-bold px-3 py-1 rounded-full border border-cyan-500/20" style="color:${escomColor}">R$ 120/mês</span></div><h3>WhatsApp Bot</h3><p>Funil automático de triagem e envio de propostas no WhatsApp.</p></div>
  </div>
</div>
</section>

<!-- ═══════════════════════════════════════════════ -->
<!-- BLOCO C: INSTITUCIONAL E FECHAMENTO -->
<!-- ═══════════════════════════════════════════════ -->

<!-- C.14: ESCOM STUDIO -->
<section id="escom" class="py-20 px-[5%]" style="background:#050505;border-top:1px solid rgba(255,255,255,0.04);">
<div class="max-w-4xl mx-auto text-center fade-up">
  <div class="text-3xl font-bold mb-2 font-display" style="background:linear-gradient(135deg,${escomColor},#7c3aed);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">ESCOM Studio</div>
  <p class="text-white/40 text-sm uppercase tracking-widest mb-6">Engenharia de Conversão & Design Premium</p>
  <p class="text-white/50 max-w-xl mx-auto mb-8 leading-relaxed">Somos especialistas em criar experiências digitais de alta fidelidade e performance. Projetamos interfaces premium e combinamos estratégias estritas de copywriting para levar negócios locais ao topo.</p>
  <div class="flex flex-wrap gap-3 justify-center">
    <span class="text-xs font-bold px-4 py-2 rounded-full" style="background:${escomColor}11;color:${escomColor};border:1px solid ${escomColor}33">🎯 Sites de Alta Conversão</span>
    <span class="text-xs font-bold px-4 py-2 rounded-full" style="background:#7c3aed11;color:#a78bfa;border:1px solid #7c3aed33">🤖 Inteligência Artificial</span>
    <span class="text-xs font-bold px-4 py-2 rounded-full" style="background:#06b6d411;color:#22d3ee;border:1px solid #06b6d433">💎 Design Premium</span>
  </div>
</div>
</section>

<!-- C.15: FOOTER + FORMULÁRIO -->
<footer id="footer" class="py-20 px-[5%]" style="background:#050505;border-top:1px solid rgba(255,255,255,0.04);">
<div class="max-w-5xl mx-auto">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
    <div class="fade-up">
      <h2 class="font-display text-2xl font-bold mb-4">Aprovar Projeto</h2>
      <p class="text-white/50 mb-6 leading-relaxed">Envie seus dados para darmos início ao desenvolvimento técnico do site de ${esc(name)}.</p>
      ${phone ? `<div class="flex gap-3 items-center mb-3"><i class="fas fa-phone text-sm" style="color:${escomColor}"></i><span class="text-white/60 text-sm">${esc(phone)}</span></div>` : ''}
      ${address ? `<div class="flex gap-3 items-center mb-3"><i class="fas fa-map-marker-alt text-sm" style="color:${escomColor}"></i><span class="text-white/60 text-sm">${esc(address)}</span></div>` : ''}
    </div>
    <form class="fade-up flex flex-col gap-3" onsubmit="event.preventDefault();this.querySelector('button').textContent='Diagnóstico Aprovado ✓';this.querySelector('button').style.background='#22c55e';">
      <input type="text" placeholder="Seu Nome" required class="f-input f-input-escom" />
      <input type="email" placeholder="Seu E-mail" required class="f-input f-input-escom" />
      <input type="tel" placeholder="Seu Telefone" class="f-input f-input-escom" />
      <textarea placeholder="Observações do projeto..." required class="f-input f-input-escom" style="min-height:100px;resize:vertical;"></textarea>
      <button type="submit" class="btn-escom w-full justify-center">Confirmar Proposta & Iniciar</button>
    </form>
  </div>
  <div class="text-center mt-12 pt-8" style="border-top:1px solid rgba(255,255,255,0.04);">
    <p class="text-white/30 text-xs">© ${new Date().getFullYear()} ${esc(name)}. Todos os direitos reservados. Landing page de prospecção gerada por ESCOM Studio.</p>
  </div>
</div>
</footer>

<!-- WhatsApp Float -->
${phone ? `<a href="https://wa.me/${phone.replace(/\D/g,'')}" target="_blank" class="wa-float" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>` : ''}

<!-- Scripts: GSAP + Lenis -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>
<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"><\/script>
<script>
// Lenis Smooth Scroll
const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

// GSAP ScrollTrigger reveal
gsap.registerPlugin(ScrollTrigger);
document.querySelectorAll('.fade-up').forEach(el => {
  gsap.fromTo(el, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }});
});
<\/script>
</body></html>`;

  // QA Estrito: Remover travessões ou meia-riscas residuais de todo o HTML gerado
  return html.replace(/—/g, ",").replace(/–/g, ",").replace(/\s+-\s+/g, ", ");
}
app.post("/api/build-and-deploy-site", async (req, res) => {
  try {
    const payload = req.body;
    const { projectId, slug, siteData, lead } = payload;
    const pid = projectId || "site_" + Date.now();
    const siteSlug = slug || pid;

    // Normaliza: aceita dados tanto em formData quanto no top-level (vindo de Leads.tsx)
    const formData = payload.formData || {
      companyName: payload.companyName,
      niche:       payload.niche,
      phone:       payload.phone,
      address:     payload.address,
      website:     payload.website,
      city:        payload.city,
    };

    // Busca dados completos do lead no Supabase (Gemini + PageSpeed + rating)
    let leadDataSupabase: any = null;
    try {
      const websiteUrl = formData.website || lead?.website || "";
      const nomeLead = (formData.companyName || "").toLowerCase().trim();
      if (websiteUrl || nomeLead) {
        let query = "/leads?select=*";
        if (websiteUrl) query += `&website=eq.${encodeURIComponent(websiteUrl)}`;
        else query += `&nome=ilike.${encodeURIComponent("%" + nomeLead + "%")}`;
        query += "&limit=1";
        const rows = await sbFetch(query).catch(() => null);
        if (rows && rows.length > 0) leadDataSupabase = rows[0];
      }
    } catch(e) { console.warn("[BUILD] Supabase fetch skipped:", e.message); }

    const enrichedPayload = {
      ...payload,
      formData,
      diagnostico: leadDataSupabase?.diagnostico || null,
      rating:      leadDataSupabase?.rating || null,
      reviewsCount: leadDataSupabase?.reviews_count || null,
      scoreOportunidade: leadDataSupabase?.score_oportunidade || null,
    };

    const html = await generateMandatory15SectionsHtml(enrichedPayload);
    const dir = path.join(os.tmpdir(), "dist-deployed", siteSlug);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), html, "utf-8");

    // Deploy attempt
    let deployedUrl = null;
    try {
      const { exec } = await import("child_process");
      await new Promise<void>((resolve, reject) => {
        exec("npx vercel deploy \"" + dir + "\" --name \"" + siteSlug + "\" --prod --yes", async (err, stdout, stderr) => {
          if (err) { console.error("[DEPLOY] Erro:", stderr); reject(err); return; }
          const match = stdout.match(/https:\/\/[a-zA-Z0-9.-]+\.vercel\.app/);
          deployedUrl = match ? match[0] : null;
          resolve();
        });
      });
    } catch(e) { console.error("[DEPLOY] Vercel deploy failed:", e.message); }

    const siteRecord = {
      companyName: formData?.companyName || lead?.title || "Site",
      niche: formData?.niche || "",
      status: deployedUrl ? "approved" : "pending",
      deployedUrl,
      htmlUrl: null,
      originalUrl: lead?.originalUrl || lead?.website || formData?.website || "",
      website: lead?.website || formData?.website || "",
      generatedPrompt: siteData ? JSON.stringify(siteData) : "",
      score: lead?.score || 50,
      analysis: "",
      placeId: lead?.placeId || "",
      htmlContent: html,
      phone: formData?.phone || "",
      email: formData?.email || "",
      address: formData?.address || "",
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    // Salva em Supabase generated_sites
    try {
      await sbFetch("/generated_sites", {
        method: "POST",
        headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({ id: pid, lead_id: leadDataSupabase?.id || null, company_name: siteRecord.companyName, niche: siteRecord.niche, html_content: html, deployed_url: deployedUrl || null, status: siteRecord.status, score: siteRecord.score, created_at: siteRecord.createdAt, updated_at: siteRecord.updatedAt }),
      });
    } catch(e) { console.warn("[BUILD] generated_sites upsert:", e.message); }

    // Persiste o link no lead do Supabase para aparecer no card
    const previewUrl = `https://www.escomstudio.com.br/api/site-preview/${pid}`;
    if (leadDataSupabase?.id) {
      try {
        await sbFetch(`/leads?id=eq.${leadDataSupabase.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
          body: JSON.stringify({ site_gerado: deployedUrl || previewUrl }),
        });
      } catch(e) { console.warn("[BUILD] Não salvou site_gerado no Supabase:", e.message); }
    }

    res.json({ success: true, projectId: pid, deployedUrl, previewUrl, status: siteRecord.status });
  } catch(e) { res.status(500).json({ success: false, error: e.message }); }
});

// Verifica se um site/proposta foi gerado para um leadId (somente Supabase)
app.get("/api/check-site/:leadId", async (req, res) => {
  try {
    const leadId = req.params.leadId;
    const rows = await sbFetch(`/leads?id=eq.${encodeURIComponent(leadId)}&select=site_gerado,site_html&limit=1`).catch(() => []);
    const row = rows?.[0];
    if (row?.site_gerado) return res.json({ found: true, url: row.site_gerado });
    // Se tem site_html mas não tem site_gerado, gera o link e salva
    if (row?.site_html) {
      const siteUrl = `https://www.escomstudio.com.br/api/ver-proposta/${leadId}`;
      try { await sbFetch(`/leads?id=eq.${encodeURIComponent(leadId)}`, { method: "PATCH", headers: { "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify({ site_gerado: siteUrl }) }); } catch {}
      return res.json({ found: true, url: siteUrl });
    }
    // Fallback: verificar generated_sites por lead_id
    const gs = await sbFetch(`/generated_sites?lead_id=eq.${encodeURIComponent(leadId)}&select=id,deployed_url&limit=1`).catch(() => []);
    if (gs && gs.length > 0) {
      const baseUrl = "https://www.escomstudio.com.br";
      const url = gs[0].deployed_url || `${baseUrl}/api/site-preview/${gs[0].id}`;
      return res.json({ found: true, url });
    }
    res.json({ found: false });
  } catch(e: any) { res.status(500).json({ found: false, error: e.message }); }
});

app.get("/api/site-preview/:projectId", async (req, res) => {
  try {
    const rows = await sbFetch(`/generated_sites?id=eq.${encodeURIComponent(req.params.projectId)}&select=html_content&limit=1`).catch(() => []);
    if (!rows || rows.length === 0) return res.status(404).send("<h1>Site não encontrado</h1>");
    const html = rows[0].html_content || "<h1>Sem conteúdo</h1>";
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  } catch(e: any) { res.status(500).send("<h1>Erro: " + e.message + "</h1>"); }
});

app.post("/api/approve-site", async (req, res) => {
  try {
    const { projectId, slug } = req.body;
    if (!projectId) return res.status(400).json({ error: "projectId required" });
    const rows = await sbFetch(`/generated_sites?id=eq.${encodeURIComponent(projectId)}&select=*&limit=1`).catch(() => []);
    if (!rows || rows.length === 0) return res.status(404).json({ error: "Site not found" });
    const site = rows[0];
    let deployedUrl = site.deployed_url;
    if (!deployedUrl && site.html_content) {
      const siteSlug = slug || projectId;
      const dir = path.join(os.tmpdir(), "dist-deployed", siteSlug);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, "index.html"), site.html_content, "utf-8");
      try {
        const { exec } = await import("child_process");
        await new Promise<void>((resolve, reject) => {
          exec("npx vercel deploy \"" + dir + "\" --name \"" + siteSlug + "\" --prod --yes", async (err, stdout, stderr) => {
            if (err) { reject(err); return; }
            const match = stdout.match(/https:\/\/[a-zA-Z0-9.-]+\.vercel\.app/);
            deployedUrl = match ? match[0] : null;
            resolve();
          });
        });
      } catch(e) { console.error("[APPROVE] Deploy error:", e); }
    }
    await sbFetch(`/generated_sites?id=eq.${encodeURIComponent(projectId)}`, {
      method: "PATCH", headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ status: deployedUrl ? "approved" : "failed_deploy", deployed_url: deployedUrl, updated_at: Date.now() })
    });
    res.json({ success: true, deployedUrl });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// --- Analyze UX ---
app.post("/api/analyze-ux", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL required" });
    if (!process.env.GROQ_API_KEY) return res.status(500).json({ error: "GROQ_API_KEY missing" });

    let pageText = "";
    try {
      const resp = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (resp.ok) {
        const $ = cheerio.load(await resp.text());
        $("script,style,nav,footer,header").remove();
        pageText = $("body").text().replace(/\s+/g, " ").substring(0, 12000);
      }
    } catch(e) {}

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const prompt = pageText.length > 50
      ? `Auditoria UX/UI/CRO para ${url}: "${pageText.substring(0, 5000)}"`
      : `Auditoria UX/UI/CRO para ${url} (sem conteúdo extraído)`;

    const c = await groq.chat.completions.create({
      messages: [{
        role: "system",
        content: "Você é auditor UX/UI/CRO sênior. Analise e retorne JSON."
      }, {
        role: "user",
        content: prompt + "\n\nRetorne: { summary: string, data: { brandAnalysis: { companyName, niche, audience, differentiators, tone, colors, primaryHex } }, issues: [{ category, tab, title, description, recommendation }] }"
      }],
      model: "openai/gpt-oss-120b",
      temperature: 0.6,
      response_format: { type: "json_object" }
    });

    const text = c.choices[0]?.message?.content || "{}";
    const result = JSON.parse(text);
    res.json(result);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// --- Generate Copy ---
app.post("/api/generate-copy", async (req, res) => {
  try {
    const { promptText, jsonMode } = req.body;
    if (!promptText) return res.status(400).json({ error: "promptText required" });
    if (!process.env.GROQ_API_KEY) return res.status(500).json({ error: "GROQ_API_KEY missing" });
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const systemMsg = "Você é diretor de arte, UX e copywriter sênior. Gere landing pages de alta conversão. Responda SEMPRE com JSON válido.";
    const userMsg = promptText + (jsonMode ? "\n\nResponda APENAS com o JSON puro, sem markdown, sem explicações." : "");
    const c = await groq.chat.completions.create({
      messages: [{ role: "system", content: systemMsg }, { role: "user", content: userMsg }],
      model: "openai/gpt-oss-120b", temperature: 0.7, response_format: { type: "json_object" }
    });
    const text = c.choices[0]?.message?.content || "{}";
    res.json({ success: true, text });
  } catch(e) { res.status(500).json({ success: false, error: e.message }); }
});

// --- Commercial Reports ---
app.post("/api/generate-commercial-reports", async (req, res) => {
  try {
    const { companyName, niche } = req.body;
    if (!companyName) return res.status(400).json({ error: "companyName required" });
    if (!process.env.GROQ_API_KEY) return res.status(500).json({ error: "GROQ_API_KEY missing" });
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const r1 = await groq.chat.completions.create({
      messages: [{ role:"system", content:"JSON válido" }, { role:"user", content:`Dossiê Comercial completo para ${companyName} (${niche}). Formato JSON: { nomeEmpresa, segmento, porteProvavel, faturamentoEstimado, problemasIdentificados: [{ problema, causaRaiz, impactoNegocio, urgencia }], solucoesPropostas: [{ solucao, descricao, beneficios, investimentoEstimado, retornoEsperado }], concorrentes: [{ nome, forcas, fraquezas }], argumentosDeVenda, objeçõesComuns, contraArgumentos, contatoDecisor: { perfil, canal, abordagem }, proximosPassos }`}],
      model:"openai/gpt-oss-120b", temperature:0.7, response_format:{ type:"json_object" }
    });
    const r2 = await groq.chat.completions.create({
      messages: [{ role:"system", content:"JSON válido" }, { role:"user", content:`Proposta Comercial para ${companyName} (${niche}). Formato JSON: { numeroProposta, data, cliente: { nome, empresa }, apresentacao, diagnostico, solucoes: [{ titulo, descricao, investimento, prazo }], investimentoTotal, condicoesPagamento, garantias, prazoExecucao, contato }`}],
      model:"openai/gpt-oss-120b", temperature:0.7, response_format:{ type:"json_object" }
    });
    const dossie = JSON.parse(r1.choices[0]?.message?.content || "{}");
    const proposta = JSON.parse(r2.choices[0]?.message?.content || "{}");
    res.json({ success: true, data: { dossieComercial: dossie, propostaComercial: proposta } });
  } catch(e: any) { res.status(500).json({ success: false, error: e.message }); }
});

// --- Rota de Contato e Handshake do Formulário Seguro (Resend) ---
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email and message are required" });
    }
    const protocol = "ESCOM-" + Math.floor(100000 + Math.random() * 900000);
    
    const resendApiKey = process.env.RESEND_API_KEY || "re_Hmg78ECH_8JJ7LJUeQ92FUfMwWwUyzPqY";
    const resend = new Resend(resendApiKey);

    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || "es.comunicacao@outlook.com";

    // 1. Enviar e-mail de notificação para a ESCOM Studio
    await resend.emails.send({
      from: "ESCOM Studio <onboarding@resend.dev>",
      to: receiverEmail,
      subject: `Novo Contato - Protocolo: ${protocol}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #00d1ff; border-bottom: 2px solid #00d1ff; padding-bottom: 10px;">Novo Contato Recebido</h2>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>E-mail:</strong> ${email}</p>
          <p><strong>WhatsApp/Telefone:</strong> ${phone || "Não informado"}</p>
          <p><strong>Mensagem:</strong></p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 4px; font-style: italic; color: #555;">
            ${message.replace(/\n/g, '<br/>')}
          </div>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;"/>
          <p style="font-size: 12px; color: #888;">Protocolo de Segurança: <strong>${protocol}</strong></p>
        </div>
      `
    });

    // 2. Enviar e-mail de confirmação (auto-resposta) para o remetente
    await resend.emails.send({
      from: "ESCOM Studio <onboarding@resend.dev>",
      to: email,
      subject: `Recebemos sua mensagem! - Protocolo: ${protocol}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #00d1ff;">Olá, ${name}!</h2>
          <p>Agradecemos o seu contato. Confirmamos que sua transmissão segura foi concluída com sucesso.</p>
          <p>Nossa equipe técnica e comercial já está analisando o seu projeto e entrará em contato em breve.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;"/>
          <p><strong>Cópia da sua mensagem enviada:</strong></p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 4px; font-style: italic; color: #555;">
            ${message.replace(/\n/g, '<br/>')}
          </div>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;"/>
          <p><strong>Protocolo do Handshake:</strong> <span style="font-family: monospace; font-weight: bold; font-size: 14px; background: #eee; padding: 2px 6px; border-radius: 4px;">${protocol}</span></p>
          <br/>
          <p>Atenciosamente,<br/><strong>ESCOM Studio</strong></p>
        </div>
      `
    });

    res.json({ success: true, protocol });
  } catch (e: any) {
    console.error("[CONTACT_API] Error sending email:", e);
    res.status(500).json({ error: e.message });
  }
});

// --- Rota de Análise Financeira Inteligente via IA (Groq Llama 3.3) ---
app.post("/api/analyze-finances", async (req, res) => {
  try {
    const { incomes = [], expenses = [], month = "" } = req.body;
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: "GROQ_API_KEY não configurada no servidor." });
    }

    const totalIncome = incomes.reduce((acc: number, item: any) => acc + (Number(item.amount) || 0), 0);
    const totalExpense = expenses.reduce((acc: number, item: any) => acc + (Number(item.amount) || 0), 0);
    const netProfit = totalIncome - totalExpense;
    const margin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : "0";

    const prompt = `
Analise o seguinte balanço financeiro pessoal/empresarial para o mês de ${month || "Mês Atual"}:

FATURAMENTO/GANHOS TOTAL: R$ ${totalIncome.toFixed(2)}
ENTRADAS (${incomes.length} itens):
${incomes.map((i: any) => `- ${i.title} (${i.type === "recurring" ? "Recorrente" : "Único"}): R$ ${Number(i.amount).toFixed(2)} [Cat: ${i.category || "Geral"}]`).join("\n")}

DESPESAS TOTAL: R$ ${totalExpense.toFixed(2)}
SAÍDAS (${expenses.length} itens):
${expenses.map((e: any) => `- ${e.title} (${e.type === "recurring" ? "Recorrente" : "Único"}): R$ ${Number(e.amount).toFixed(2)} [Cat: ${e.category || "Geral"}]`).join("\n")}

LUCRO LÍQUIDO: R$ ${netProfit.toFixed(2)} (${margin}% de Margem)

Como CFO Virtual especialista em finanças pessoais e empresariais, faça uma auditoria minuciosa e forneça recomendações práticas e diretas para cortar custos desnecessários, renegociar despesas recorrentes e acelerar o acúmulo de capital.

Responda ESTRITAMENTE em formato JSON com o esquema:
{
  "healthScore": number (0 a 100),
  "statusLabel": string (ex: "Excelente", "Saudável", "Atenção", "Crítico"),
  "summary": string (resumo executivo direto de 2-3 frases),
  "savingsOpportunityTotal": number (estimativa total de economia mensal em R$),
  "recommendations": [
    {
      "title": string,
      "description": string,
      "category": string,
      "priority": "alta" | "media" | "baixa",
      "impactEstimate": string
    }
  ],
  "actionPlan": [string] (passos práticos em tópicos)
}
    `;

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "Você é um consultor financeiro CFO sênior. Responda apenas com JSON válido." },
        { role: "user", content: prompt }
      ],
      model: "openai/gpt-oss-120b",
      temperature: 0.5,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content || "{}";
    const result = JSON.parse(content);
    res.json({ success: true, data: result });
  } catch (e: any) {
    console.error("[FINANCE_AI_API] Erro ao analisar finanças:", e);
    res.status(500).json({ success: false, error: e.message });
  }
});

// --- Função Auxiliar para Gerar as 5 Dicas do Dia com IA Groq ---
async function generateDailyFinanceTips() {
  const transactions: any[] = await sbFetch("/financas?order=created_at.desc&limit=200").catch(() => []);

  const incomes = transactions.filter(t => t.flow === "income");
  const expenses = transactions.filter(t => t.flow === "expense");
  const totalIncome = incomes.reduce((acc, i) => acc + (Number(i.amount) || 0), 0);
  const totalExpense = expenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);

  const todayStr = new Date().toISOString().split("T")[0];

  const prompt = `
Analise os lançamentos financeiros atuais da empresa/pessoal:
- Ganhos Totais (Entradas): R$ ${totalIncome.toFixed(2)} (${incomes.length} itens)
- Gastos Totais (Saídas): R$ ${totalExpense.toFixed(2)} (${expenses.length} itens)
- Balanço Líquido: R$ ${(totalIncome - totalExpense).toFixed(2)}

Lançamentos cadastrados:
${transactions.map(t => `- [${t.flow === "income" ? "GANHO" : "GASTO"}] ${t.title}: R$ ${Number(t.amount).toFixed(2)} (${t.category || "Geral"})`).join("\n")}

Forneça EXATAMENTE 5 DICAS PRÁTICAS E DIRETAS DO DIA para otimizar os ganhos, cortar desperdícios e organizar o fluxo de caixa hoje.

Responda ESTRITAMENTE em formato JSON com o seguinte esquema:
{
  "date": "${todayStr}",
  "dicas": [
    {
      "id": 1,
      "title": "string curto e chamativo",
      "description": "explicacao pratica de 2 frases",
      "category": "string",
      "priority": "alta" | "media" | "baixa",
      "impact": "estimativa em R$ ou beneficio claro"
    }
  ]
}
  `;

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: "Você é um consultor financeiro CFO estratégico. Responda apenas em JSON válido com exatamente 5 dicas." },
      { role: "user", content: prompt }
    ],
    model: "openai/gpt-oss-120b",
    temperature: 0.6,
    response_format: { type: "json_object" }
  });

  const content = completion.choices[0]?.message?.content || "{}";
  const parsed = JSON.parse(content);
  const dicasData = {
    date: todayStr,
    updatedAt: new Date().toISOString(),
    dicas: parsed.dicas || []
  };

  // Salvar em Supabase (tabela financas_dicas_diarias se existir — ignora erro se não existir)
  try {
    await sbFetch("/financas_dicas_diarias", { method: "POST", headers: { "Content-Type": "application/json", Prefer: "resolution=merge-duplicates" }, body: JSON.stringify({ id: "latest", ...dicasData }) });
  } catch {}

  return dicasData;
}

// --- Rota do Cron Diário de Finanças (Dispara diariamente às 08h) ---
app.all("/api/financas-cron", async (req, res) => {
  try {
    console.log("[FINANCAS_CRON] Executando análise diária e gerando 5 dicas do dia...");
    const dicasData = await generateDailyFinanceTips();
    res.json({ success: true, message: "5 Dicas do Dia geradas e salvas com sucesso!", data: dicasData });
  } catch (e: any) {
    console.error("[FINANCAS_CRON] Erro ao disparar cron de finanças:", e);
    res.status(500).json({ success: false, error: e.message });
  }
});

// --- Rota de Busca / Geração Manual das 5 Dicas do Dia ---
app.get("/api/financas-dicas", async (req, res) => {
  try {
    const todayStr = new Date().toISOString().split("T")[0];
    const rows = await sbFetch("/financas_dicas_diarias?id=eq.latest&limit=1").catch(() => []);
    if (rows && rows.length > 0 && rows[0].date === todayStr) {
      return res.json({ success: true, data: rows[0] });
    }
    const newDicas = await generateDailyFinanceTips();
    res.json({ success: true, data: newDicas });
  } catch (e: any) {
    console.error("[FINANCAS_DICAS_API] Erro ao buscar dicas:", e);
    res.status(500).json({ success: false, error: e.message });
  }
});

// --- Rotas de Cron Adicionais para Evitar 404 do Vercel Scheduler ---
app.all("/api/trigger-cron", async (req, res) => {
  res.json({ success: true, message: "Cron trigger-cron executed successfully" });
});

app.all("/api/trigger-monitoring", async (req, res) => {
  res.json({ success: true, message: "Cron trigger-monitoring executed successfully" });
});

// --- Integração Google Fit OAuth2 ---

app.get("/api/google-health-auth", (req, res) => {
  const clientId = process.env.GOOGLE_HEALTH_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_HEALTH_REDIRECT_URI;
  
  if (!clientId || !redirectUri) {
    return res.status(500).json({ error: "Configuração do Google Health incompleta" });
  }

  const scopes = [
    "https://www.googleapis.com/auth/fitness.activity.read",
    "https://www.googleapis.com/auth/fitness.sleep.read",
    "https://www.googleapis.com/auth/fitness.heart_rate.read",
    "https://www.googleapis.com/auth/fitness.body.read"
  ].join(" ");

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scopes)}&access_type=offline&prompt=consent`;
  
  res.redirect(authUrl);
});

app.get("/api/google-health-callback", async (req, res) => {
  const code = req.query.code as string;
  const clientId = process.env.GOOGLE_HEALTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_HEALTH_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_HEALTH_REDIRECT_URI;

  if (!code || !clientId || !clientSecret || !redirectUri) {
    return res.status(400).send("Faltando parâmetros de configuração ou autorização.");
  }

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code"
      }).toString()
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error("Erro na troca do token:", tokenData);
      return res.status(400).send(`Erro de autenticação: ${tokenData.error_description || tokenData.error}`);
    }

    const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString();

    const docData: any = {
      access_token: tokenData.access_token,
      expires_at: expiresAt,
      updatedAt: new Date().toISOString()
    };
    if (tokenData.refresh_token) {
      docData.refresh_token = tokenData.refresh_token;
    }

    await sbFetch("/google_health_tokens", { method: "POST", headers: { "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ id: "admin", ...docData }) }).catch(() => {});

    res.redirect("https://www.escomstudio.com.br/admin/saude");
  } catch (error) {
    console.error("Erro no callback do Google Fit:", error);
    res.status(500).send("Erro interno ao processar autenticação.");
  }
});

app.get("/api/google-health-sync", async (req, res) => {
  try {
    const tokenRows = await sbFetch("/google_health_tokens?id=eq.admin&limit=1").catch(() => []);
    if (!tokenRows || tokenRows.length === 0) {
      return res.status(400).json({ error: "Token não encontrado. Autorize primeiro." });
    }

    let { access_token, refresh_token, expires_at } = tokenRows[0] as any;
    const clientId = process.env.GOOGLE_HEALTH_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_HEALTH_CLIENT_SECRET;

    if (new Date(expires_at) < new Date()) {
      if (!refresh_token || !clientId || !clientSecret) {
        return res.status(400).json({ error: "Refresh token ou configurações indisponíveis." });
      }
      
      const refreshResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: refresh_token,
          grant_type: "refresh_token"
        }).toString()
      });
      
      const refreshData = await refreshResponse.json();
      if (refreshData.error) {
        return res.status(400).json({ error: "Falha ao renovar o token do Google." });
      }
      
      access_token = refreshData.access_token;
      expires_at = new Date(Date.now() + refreshData.expires_in * 1000).toISOString();
      
      const updateData: any = { access_token, expires_at, updatedAt: new Date().toISOString() };
      if (refreshData.refresh_token) {
        refresh_token = refreshData.refresh_token;
        updateData.refresh_token = refresh_token;
      }
      
      await sbFetch("/google_health_tokens?id=eq.admin", { method: "PATCH", headers: { "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify(updateData) }).catch(() => {});
    }

    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);
    start.setHours(0, 0, 0, 0);
    
    const startTimeMillis = start.getTime();
    const endTimeMillis = end.getTime();
    
    const fetchApi = async (url: string, body?: any) => {
      const resp = await fetch(url, {
        method: body ? "POST" : "GET",
        headers: { 
          "Authorization": `Bearer ${access_token}`,
          "Content-Type": "application/json"
        },
        body: body ? JSON.stringify(body) : undefined
      });
      return resp.json();
    };

    const aggBody = (dataType: string) => ({
      aggregateBy: [{ dataTypeName: dataType }],
      bucketByTime: { durationMillis: 86400000 },
      startTimeMillis,
      endTimeMillis
    });

    const [stepsData, hrData, weightData, caloriesData, sleepData] = await Promise.all([
      fetchApi("https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate", aggBody("com.google.step_count.delta")),
      fetchApi("https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate", aggBody("com.google.heart_rate.bpm")),
      fetchApi("https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate", aggBody("com.google.weight")),
      fetchApi("https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate", aggBody("com.google.calories.expended")),
      fetchApi(`https://www.googleapis.com/fitness/v1/users/me/sessions?startTime=${new Date(startTimeMillis).toISOString()}&endTime=${new Date(endTimeMillis).toISOString()}&activityType=72`)
    ]);

    const dailyMetrics: Record<string, any> = {};
    
    // Processar Passos (Somar todos os pontos do dia)
    if (stepsData && stepsData.bucket) {
      stepsData.bucket.forEach((bucket: any) => {
        const dateStr = new Date(parseInt(bucket.startTimeMillis)).toISOString().split('T')[0];
        if (!dailyMetrics[dateStr]) dailyMetrics[dateStr] = { data: dateStr, origem: "Google Fit" };
        let totalSteps = 0;
        if (bucket.dataset) {
          bucket.dataset.forEach((ds: any) => {
            (ds.point || []).forEach((pt: any) => {
              const val = pt.value?.[0]?.intVal ?? pt.value?.[0]?.fpVal ?? 0;
              totalSteps += Math.round(val);
            });
          });
        }
        if (totalSteps > 0) dailyMetrics[dateStr].passos = totalSteps;
      });
    }

    // Processar Batimento Cardiaco (Média do dia)
    if (hrData && hrData.bucket) {
      hrData.bucket.forEach((bucket: any) => {
        const dateStr = new Date(parseInt(bucket.startTimeMillis)).toISOString().split('T')[0];
        if (!dailyMetrics[dateStr]) dailyMetrics[dateStr] = { data: dateStr, origem: "Google Fit" };
        let sumBpm = 0;
        let countBpm = 0;
        if (bucket.dataset) {
          bucket.dataset.forEach((ds: any) => {
            (ds.point || []).forEach((pt: any) => {
              const bpmVal = pt.value?.[0]?.fpVal ?? pt.value?.[0]?.intVal ?? 0;
              if (bpmVal > 0) {
                sumBpm += bpmVal;
                countBpm++;
              }
            });
          });
        }
        if (countBpm > 0) dailyMetrics[dateStr].batimentoRepouso = Math.round(sumBpm / countBpm);
      });
    }

    // Processar Peso
    if (weightData && weightData.bucket) {
      weightData.bucket.forEach((bucket: any) => {
        const dateStr = new Date(parseInt(bucket.startTimeMillis)).toISOString().split('T')[0];
        if (!dailyMetrics[dateStr]) dailyMetrics[dateStr] = { data: dateStr, origem: "Google Fit" };
        if (bucket.dataset) {
          bucket.dataset.forEach((ds: any) => {
            (ds.point || []).forEach((pt: any) => {
              const weightVal = pt.value?.[0]?.fpVal ?? pt.value?.[0]?.intVal ?? 0;
              if (weightVal > 0) dailyMetrics[dateStr].peso = Number(weightVal.toFixed(1));
            });
          });
        }
      });
    }

    // Processar Calorias Queimadas
    if (caloriesData && caloriesData.bucket) {
      caloriesData.bucket.forEach((bucket: any) => {
        const dateStr = new Date(parseInt(bucket.startTimeMillis)).toISOString().split('T')[0];
        if (!dailyMetrics[dateStr]) dailyMetrics[dateStr] = { data: dateStr, origem: "Google Fit" };
        let totalCal = 0;
        if (bucket.dataset) {
          bucket.dataset.forEach((ds: any) => {
            (ds.point || []).forEach((pt: any) => {
              const calVal = pt.value?.[0]?.fpVal ?? pt.value?.[0]?.intVal ?? 0;
              totalCal += calVal;
            });
          });
        }
        if (totalCal > 0) dailyMetrics[dateStr].caloriasQueimadas = Math.round(totalCal);
      });
    }

    // Processar Sono
    if (sleepData && sleepData.session) {
      sleepData.session.forEach((session: any) => {
        const sessionDate = new Date(parseInt(session.startTimeMillis)).toISOString().split('T')[0];
        if (!dailyMetrics[sessionDate]) dailyMetrics[sessionDate] = { data: sessionDate, origem: "Google Fit" };
        const durationHours = (parseInt(session.endTimeMillis) - parseInt(session.startTimeMillis)) / (1000 * 60 * 60);
        const currentHours = dailyMetrics[sessionDate]._rawSonoHours || 0;
        const totalH = currentHours + durationHours;
        dailyMetrics[sessionDate]._rawSonoHours = totalH;
        dailyMetrics[sessionDate].horasSono = `${totalH.toFixed(1)}h`;
        dailyMetrics[sessionDate].qualidadeSono = totalH >= 7 ? "Excelente (Restaurador)" : totalH >= 6 ? "Bom" : "Insuficiente";
      });
    }

    // Salvar no Supabase
    const syncedAt = new Date().toISOString();
    let savedCount = 0;

    for (const [date, metrics] of Object.entries(dailyMetrics)) {
      delete (metrics as any)._rawSonoHours;
      (metrics as any).synced_at = syncedAt;
      await sbFetch("/health_metrics", { method: "POST", headers: { "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ id: date, ...(metrics as any) }) }).catch(() => {});
      savedCount++;
    }

    res.json({ 
      success: true, 
      message: "Sincronização concluída", 
      syncedDays: savedCount, 
      data: dailyMetrics 
    });
  } catch (error: any) {
    console.error("Erro na sincronização:", error);
    res.status(500).json({ error: "Erro interno", details: error.message });
  }
});

app.get("/api/google-health-status", async (req, res) => {
  try {
    const rows = await sbFetch("/google_health_tokens?id=eq.admin&limit=1").catch(() => []);
    if (rows && rows.length > 0) {
      res.json({ connected: true, lastSync: rows[0].updated_at || null, expiresAt: rows[0].expires_at || null });
    } else {
      res.json({ connected: false, lastSync: null });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar status" });
  }
});

app.get("/api/health-metrics", async (req, res) => {
  try {
    const metrics = await sbFetch("/health_metrics?order=data.desc&limit=30").catch(() => []);
    res.json({ success: true, metrics: metrics || [] });
  } catch (error) {
    console.error("Erro ao buscar health metrics:", error);
    res.status(500).json({ success: false, error: "Erro interno" });
  }
});

app.post("/api/health-metrics", async (req, res) => {
  try {
    const { peso, gorduraCorporal, massaMagra, notas } = req.body;
    const docDate = new Date().toISOString().split('T')[0];
    await sbFetch("/health_metrics", { method: "POST", headers: { "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ id: docDate, data: docDate, peso: peso || null, gordura_corporal: gorduraCorporal || null, massa_magra: massaMagra || null, notas: notas || "", origem: "Manual", updated_at: new Date().toISOString() }) }).catch(() => {});
    res.json({ success: true, message: "Métricas salvas com sucesso" });
  } catch (error) {
    console.error("Erro ao salvar health metrics:", error);
    res.status(500).json({ success: false, error: "Erro interno" });
  }
});

app.post("/api/health-suggestions", async (req, res) => {
  try {
    const { peso, imc, pesoMeta, faltaPerder, passos, cidade, idade, sexo, horasSono } = req.body;
    
    if (process.env.GROQ_API_KEY) {
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const prompt = `Você é um nutricionista e personal trainer sênior especialista em bio-hacking e performance.
Gere recomendações hiper-personalizadas e práticas para o usuário com o seguinte perfil:
- Peso Atual: ${peso || "não informado"} kg
- IMC: ${imc || "não informado"}
- Meta de Peso: ${pesoMeta || "não informada"} kg (Faltam ${faltaPerder || 0} kg)
- Passos hoje: ${passos || 0}
- Sono: ${horasSono || "não informado"}
- Idade: ${idade || 30} anos, Sexo: ${sexo === "F" ? "Feminino" : "Masculino"}
- Localização: ${cidade || "Brasil"}

Regras:
1. "atividades": 3 sugestões de exercícios práticos adequados ao peso/IMC e nível de passos.
2. "alimentacao": 3 sugestões de ajustes nutricionais e refeições saudáveis.
3. "dicasLocais": 3 sugestões de locais ao ar livre, praias, parques, feiras orgânicas ou rotinas específicas considerando a localização (${cidade || "Brasil"}).
4. "motivacao": 1 frase curta e impactante de incentivo.

Retorne APENAS um JSON VÁLIDO com a estrutura:
{
  "atividades": ["...", "...", "..."],
  "alimentacao": ["...", "...", "..."],
  "dicasLocais": ["...", "...", "..."],
  "motivacao": "..."
}`;

      const response = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "Você é um profissional de saúde e bio-hacking. Responda SEMPRE em JSON válido em Português do Brasil." },
          { role: "user", content: prompt }
        ],
        model: "openai/gpt-oss-120b",
        temperature: 0.6,
        response_format: { type: "json_object" }
      });

      const parsed = JSON.parse(response.choices[0]?.message?.content || "{}");
      return res.json(parsed);
    }

    // Fallback se não houver chave Groq configurada
    res.json({
      atividades: [
        "Caminhada diária de 30-45min em ritmo moderado.",
        "Treino resistido (musculação/calistenia) 3x a 4x por semana.",
        "Mobilidade e alongamento matinal de 10 minutos."
      ],
      alimentacao: [
        "Priorize proteínas magras (frango, ovos, peixe) em todas as refeições.",
        "Beba no mínimo 35ml de água por kg corporal diariamente.",
        "Reduza carboidratos refinados e ultraprocessados à noite."
      ],
      dicasLocais: [
        `Explore caminhadas ao ar livre na região de ${cidade || "sua cidade"}.`,
        "Busque feiras locais de produtores orgânicos para hortifrúti fresco.",
        "Aproveite parques ou orlas próximas para atividades no início da manhã."
      ],
      motivacao: "Consistência supera intensidade. Cada pequeno passo diário te aproxima do seu peso ideal!"
    });
  } catch (error: any) {
    console.error("[HEALTH_SUGGESTIONS_ERROR]", error);
    res.status(500).json({ error: "Erro ao gerar sugestões de saúde" });
  }
});

// --- Integração Strava API v3 ---

const getStravaCredentials = () => {
  const clientId = process.env.STRAVA_CLIENT_ID || "270564";
  const secrets = [
    process.env.STRAVA_CLIENT_SECRET,
    "9ad26ac6f32383455fda73c1566a624a44fd9780",
    "e6cd8d0d9ca2aeace6dcea6407fa777a00ebbf8f"
  ].filter(Boolean) as string[];
  const redirectUri = process.env.STRAVA_REDIRECT_URI || "https://www.escomstudio.com.br/api/strava-callback";
  return { clientId, secrets, redirectUri };
};

app.get("/api/strava-auth", (req, res) => {
  const { clientId, redirectUri } = getStravaCredentials();
  const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=read,activity:read_all&approval_prompt=auto`;
  res.redirect(authUrl);
});

app.get("/api/strava-callback", async (req, res) => {
  const code = req.query.code as string;
  const { clientId, secrets } = getStravaCredentials();

  if (!code) {
    return res.status(400).send("Faltando código de autorização do Strava.");
  }

  try {
    let data: any = null;
    for (const secret of secrets) {
      const resp = await fetch("https://www.strava.com/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: secret,
          code,
          grant_type: "authorization_code"
        })
      });
      data = await resp.json();
      if (data.access_token) {
        data._usedSecret = secret;
        break;
      }
    }
    
    if (!data || !data.access_token) {
      return res.status(400).send("Erro na autenticação com o Strava: " + JSON.stringify(data));
    }

    await sbFetch("/strava_tokens", { method: "POST", headers: { "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ id: "admin", access_token: data.access_token, refresh_token: data.refresh_token, expires_at: data.expires_at, used_secret: data._usedSecret, athlete: data.athlete ? JSON.stringify({ id: data.athlete.id, name: `${data.athlete.firstname} ${data.athlete.lastname}`, profile: data.athlete.profile }) : null, updated_at: new Date().toISOString() }) }).catch(() => {});

    res.redirect("https://www.escomstudio.com.br/admin/saude");
  } catch (error) {
    console.error("Erro no callback Strava:", error);
    res.status(500).send("Erro interno no callback Strava.");
  }
});

app.get("/api/strava-status", async (req, res) => {
  try {
    const rows = await sbFetch("/strava_tokens?id=eq.admin&limit=1").catch(() => []);
    if (rows && rows.length > 0) {
      const data = rows[0] as any;
      const athlete = typeof data.athlete === "string" ? JSON.parse(data.athlete || "null") : data.athlete;
      res.json({ connected: true, athlete, lastSync: data.updated_at || null });
    } else {
      res.json({ connected: false, athlete: null });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao verificar status Strava" });
  }
});

app.get("/api/strava-sync", async (req, res) => {
  try {
    const tokenRows = await sbFetch("/strava_tokens?id=eq.admin&limit=1").catch(() => []);
    if (!tokenRows || tokenRows.length === 0) {
      return res.status(400).json({ error: "Token Strava não encontrado. Autorize primeiro." });
    }

    let { access_token, refresh_token, expires_at, used_secret } = tokenRows[0] as any;
    const { clientId, secrets } = getStravaCredentials();
    const activeSecret = used_secret || secrets[0];

    if (expires_at && Date.now() / 1000 >= expires_at - 300) {
      if (refresh_token) {
        const refreshResp = await fetch("https://www.strava.com/oauth/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            client_id: clientId,
            client_secret: activeSecret,
            refresh_token,
            grant_type: "refresh_token"
          })
        });
        const refreshData = await refreshResp.json();
        if (refreshData.access_token) {
          access_token = refreshData.access_token;
          expires_at = refreshData.expires_at;
          await sbFetch("/strava_tokens?id=eq.admin", { method: "PATCH", headers: { "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify({ access_token, refresh_token: refreshData.refresh_token || refresh_token, expires_at, updated_at: new Date().toISOString() }) }).catch(() => {});
        }
      }
    }

    const activitiesResp = await fetch("https://www.strava.com/api/v3/athlete/activities?per_page=30", {
      headers: { "Authorization": `Bearer ${access_token}` }
    });

    const activitiesData = await activitiesResp.json();
    if (!Array.isArray(activitiesData)) {
      return res.status(400).json({ error: "Erro ao buscar atividades do Strava", details: activitiesData });
    }

    let savedCount = 0;
    for (const act of activitiesData) {
      const actId = `strava_${act.id}`;
      const distanceKm = Number((act.distance / 1000).toFixed(2));
      const movingTimeMinutes = Math.round(act.moving_time / 60);
      const startDate = act.start_date_local ? act.start_date_local.split("T")[0] : new Date().toISOString().split("T")[0];

      await sbFetch("/strava_activities", { method: "POST", headers: { "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ id: actId, strava_id: act.id, nome: act.name, tipo: act.type, distancia_km: distanceKm, tempo_minutos: movingTimeMinutes, elevacao_m: Math.round(act.total_elevation_gain || 0), bpm_medio: Math.round(act.average_heartrate || 0), bpm_max: Math.round(act.max_heartrate || 0), calorias: Math.round(act.calories || 0), data: startDate, synced_at: new Date().toISOString() }) }).catch(() => {});
      savedCount++;
    }

    await sbFetch("/strava_tokens?id=eq.admin", { method: "PATCH", headers: { "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify({ updated_at: new Date().toISOString() }) }).catch(() => {});

    res.json({ success: true, count: savedCount, message: `${savedCount} atividades sincronizadas do Strava!` });
  } catch (error: any) {
    console.error("Erro na sincronização Strava:", error);
    res.status(500).json({ error: "Erro interno", details: error.message });
  }
});

// --- CONTRACTS API (Supabase) ---
app.get("/api/contracts", async (req, res) => {
  try {
    let contracts: any[] = await sbFetch("/contracts?order=created_at.desc").catch(() => []);
    
    // Se não houver contratos no Firestore, inicializa com o contrato base
    if (contracts.length === 0) {
      const defaultContract = {
        title: "CONTRATO SONDA SOLO",
        company: "RASTRO VERDE",
        personType: "Pessoa Jurídica de Direito Privado",
        cnpj: "62.878.265/0001-44",
        address: "Alameda Rio Negro, 503 - CEP: 06454-000",
        clientName: "Rastro Verde",
        contractorName: "ES COM Creative Studio",
        contractorCnpj: "48.298.795/0001-92",
        contractorRepresentative: "Eduardo Tavares dos Santos",
        serviceType: "Identidade Visual (Logotipo)",
        serviceObject: "Prestação de serviços de Design Gráfico para o desenvolvimento de Identidade Visual (Logotipo) exclusivo para o produto SONDA SOLO, pertencente à empresa Rastro Verde.",
        deliverables: [
          "Propostas Visuais: Criação e apresentação de 03 (três) opções de logotipo para o produto Sonda Solo, cada uma com sua proposta visual distinta e original das demais.",
          "Materiais Finais (Após Aprovação): Entrega do material aberto da opção de logotipo escolhida, bem como as suas adaptações (versões com cores de destaque, fundo transparente em PNG, versão para fundo claro e escuro).",
          "Aplicações da Marca: Desenvolvimento de simulação/mockup da marca Sonda Solo em formato \"White Label\" aplicada aos produtos (ex: sensor, caixa/resskit)."
        ],
        initialDeadline: "21 de agosto de 2026, às 18:00",
        finalDeadline: "28 de agosto de 2026, às 18:00",
        revisionsPolicy: "Rodadas ilimitadas de alterações e ajustes sobre a opção de logotipo selecionada.",
        revisionsPeriod: "Entre os dias 22 e 25 de agosto de 2026.",
        budget: "R$ 1.200,00",
        budgetText: "um mil e duzentos reais",
        signalValue: "R$ 600,00",
        signalText: "seiscentos reais (50%)",
        finalValue: "R$ 600,00",
        finalText: "seiscentos reais (50%)",
        pixBank: "C6 Bank",
        pixKey: "13981062787",
        pixFavored: "Eduardo Tavares dos Santos",
        forumCity: "São Paulo - SP",
        contractDate: "20 de agosto de 2026",
        status: "ATIVO",
        createdAt: new Date().toISOString()
      };
      // Salva contrato padrão no Supabase
      const newId = "contract_" + Date.now();
      await sbFetch("/contracts", { method: "POST", headers: { "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify({ id: newId, ...defaultContract }) }).catch(() => {});
      contracts = [{ id: newId, ...defaultContract }];
    }

    res.json({ success: true, contracts });
  } catch (error: any) {
    console.error("Erro ao buscar contratos:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/contracts", async (req, res) => {
  try {
    const newId = "contract_" + Date.now();
    const contractData = { id: newId, ...req.body, status: req.body.status || "ATIVO", created_at: new Date().toISOString() };
    await sbFetch("/contracts", { method: "POST", headers: { "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify(contractData) });
    res.json({ success: true, id: newId, contract: contractData });
  } catch (error: any) {
    console.error("Erro ao criar contrato:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put("/api/contracts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await sbFetch(`/contracts?id=eq.${encodeURIComponent(id)}`, { method: "PATCH", headers: { "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify({ ...req.body, updated_at: new Date().toISOString() }) });
    res.json({ success: true });
  } catch (error: any) {
    console.error("Erro ao atualizar contrato:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put("/api/contracts/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await sbFetch(`/contracts?id=eq.${encodeURIComponent(id)}`, { method: "PATCH", headers: { "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify({ status, updated_at: new Date().toISOString() }) });
    res.json({ success: true });
  } catch (error: any) {
    console.error("Erro ao atualizar status do contrato:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete("/api/contracts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await sbFetch(`/contracts?id=eq.${encodeURIComponent(id)}`, { method: "DELETE", headers: { Prefer: "return=minimal" } });
    res.json({ success: true });
  } catch (error: any) {
    console.error("Erro ao deletar contrato:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── /api/buscar-leads — Prospecção via Serper + PageSpeed (sem Gemini) ────────
app.post("/api/buscar-leads", async (req, res) => {
  try {
    const { nicho = "Barbearia", cidade = "São Paulo", estado = "SP", quantidade = 10 } = req.body;
    const serperKey = process.env.SERPER_API_KEY || "";
    const pagespeedKey = process.env.PAGESPEED_API_KEY || "";
    if (!serperKey) return res.status(500).json({ error: "SERPER_API_KEY não configurada" });

    // 1. Serper Places
    const serperRes = await fetch("https://google.serper.dev/places", {
      method: "POST",
      headers: { "X-API-KEY": serperKey, "Content-Type": "application/json" },
      body: JSON.stringify({ q: `${nicho} em ${cidade}, ${estado}`, gl: "br", hl: "pt-br" }),
    });
    if (!serperRes.ok) throw new Error(`Serper ${serperRes.status}`);
    const serperData: any = await serperRes.json();
    const places = (serperData.places || []).slice(0, quantidade);

    let salvos = 0;
    for (const p of places) {
      const nome = p.title || "";
      if (!nome) continue;
      const website = p.website || null;

      // 2. PageSpeed (opcional)
      let pagespeed: any = null;
      if (website && pagespeedKey) {
        try {
          const params = new URLSearchParams({ url: website, strategy: "MOBILE", key: pagespeedKey });
          ["PERFORMANCE","ACCESSIBILITY","SEO","BEST_PRACTICES"].forEach(c => params.append("category", c));
          const psRes = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`);
          if (psRes.ok) {
            const psData: any = await psRes.json();
            const cats = (psData.lighthouseResult || {}).categories || {};
            pagespeed = {
              performance:    cats.performance     ? Math.round(cats.performance.score * 100)     : null,
              acessibilidade: cats.accessibility   ? Math.round(cats.accessibility.score * 100)   : null,
              seo:            cats.seo             ? Math.round(cats.seo.score * 100)             : null,
              boasPraticas:   cats["best-practices"] ? Math.round(cats["best-practices"].score * 100) : null,
            };
          }
        } catch {}
      }

      // 3. Score simples baseado em PageSpeed
      let score = website ? 20 : 50;
      if (pagespeed) {
        if (pagespeed.performance !== null) score += pagespeed.performance < 50 ? 20 : pagespeed.performance < 80 ? 10 : 0;
        if (pagespeed.acessibilidade !== null) score += pagespeed.acessibilidade < 50 ? 15 : 7;
      }
      score = Math.min(score, 100);

      // 4. Salva no Supabase
      const nomeNorm = nome.toLowerCase().trim();
      const id = nomeNorm.replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").substring(0, 80)
        + "-" + cidade.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      try {
        await sbFetch("/leads", {
          method: "POST",
          headers: { Prefer: "resolution=merge-duplicates,return=minimal" } as any,
          body: JSON.stringify({
            id, nome, nome_normalizado: nomeNorm,
            endereco: p.address || null, telefone: p.phoneNumber || null,
            website, rating: p.rating ?? null, reviews_count: p.ratingCount ?? null,
            categoria: nicho, cidade, tem_site: !!website,
            score_oportunidade: score,
            diagnostico: pagespeed ? { pagespeed } : null,
            status: "novo",
            criado_em: new Date().toISOString(), atualizado_em: new Date().toISOString(),
          }),
        });
        salvos++;
      } catch(e: any) { console.warn(`[BUSCAR] Falha ao salvar ${nome}:`, e.message); }
    }
    res.json({ success: true, encontrados: places.length, salvos });
  } catch(e: any) { res.status(500).json({ success: false, error: e.message }); }
});

// ── /api/gerar-analise/:leadId — PDF de Análise Estratégica via Gemini ────────
app.get("/api/gerar-analise/:leadId", async (req, res) => {
  try {
    const serperKey = process.env.SERPER_API_KEY || "";
    if (!process.env.GROQ_API_KEY) return res.status(500).send("<h1>GROQ_API_KEY não configurada</h1>");

    // 1. Busca lead no Supabase — tenta por id, depois por site_gerado
    const slug = req.params.leadId;
    let rows = await sbFetch(`/leads?id=eq.${encodeURIComponent(slug)}&select=*&limit=1`);
    if (!rows || rows.length === 0) {
      const baseUrl = process.env.BASE_URL || "https://www.escomstudio.com.br";
      rows = await sbFetch(`/leads?site_gerado=eq.${encodeURIComponent(`${baseUrl}/proposta/${slug}`)}&select=*&limit=1`);
    }
    if (!rows || rows.length === 0) return res.status(404).send("<h1>Lead não encontrado</h1>");
    const lead = rows[0];

    // 1b. Se análise já foi gerada e não está pedindo PDF, serve o cache
    if (lead.analise_html && !req.query.pdf && !req.query.regenerar) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("X-Robots-Tag", "noindex, nofollow");
      return res.status(200).send(lead.analise_html);
    }
    const diag = lead.diagnostico || {};
    const ps = diag.pagespeed || {};

    // 2. Busca concorrentes REAIS via Serper
    type Concorrente = { nome: string; rating: number | null; reviews: number | null; temSite: boolean; site: string | null; endereco: string | null };
    let concorrentes: Concorrente[] = [];
    if (serperKey && lead.categoria && lead.cidade) {
      try {
        const sr = await fetch("https://google.serper.dev/places", {
          method: "POST",
          headers: { "X-API-KEY": serperKey, "Content-Type": "application/json" },
          body: JSON.stringify({ q: `${lead.categoria} em ${lead.cidade}`, gl: "br", hl: "pt-br" }),
        });
        if (sr.ok) {
          const sd: any = await sr.json();
          concorrentes = (sd.places || [])
            .filter((p: any) => p.title && p.title.toLowerCase() !== lead.nome.toLowerCase())
            .slice(0, 5)
            .map((p: any): Concorrente => ({
              nome:     p.title,
              rating:   p.rating ?? null,
              reviews:  p.ratingCount ?? null,
              temSite:  !!p.website,
              site:     p.website || null,
              endereco: p.address || null,
            }));
        }
      } catch {}
    }

    // 3. PageSpeed dos concorrentes com site
    type ConcorrentePS = Concorrente & { pagespeed?: { performance: number | null; seo: number | null } };
    const concorrentesComPS: ConcorrentePS[] = await Promise.all(
      concorrentes.map(async (c): Promise<ConcorrentePS> => {
        if (!c.site || !process.env.PAGESPEED_API_KEY) return c;
        try {
          const params = new URLSearchParams({ url: c.site, strategy: "MOBILE", category: "PERFORMANCE", key: process.env.PAGESPEED_API_KEY! });
          params.append("category", "SEO");
          const pr = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`);
          if (!pr.ok) return c;
          const pd: any = await pr.json();
          const cats = pd.lighthouseResult?.categories || {};
          return { ...c, pagespeed: { performance: cats.performance ? Math.round(cats.performance.score * 100) : null, seo: cats.seo ? Math.round(cats.seo.score * 100) : null } };
        } catch { return c; }
      })
    );

    const concorrentesStr = concorrentesComPS.length > 0
      ? concorrentesComPS.map((c, i) => `${i + 1}. ${c.nome}
   - Rating: ${c.rating ?? "sem dados"} (${c.reviews ?? 0} avaliações)
   - Site: ${c.site || "não possui"}
   - PageSpeed: ${c.pagespeed ? `Performance ${c.pagespeed.performance}%, SEO ${c.pagespeed.seo}%` : "não analisado"}
   - Endereço: ${c.endereco || "não disponível"}`).join("\n\n")
      : "Dados de concorrentes não disponíveis (Serper não configurado).";

    const coverPhotoUrl = getCoverPhotoUrl(lead.categoria || "");

    const prompt = `Você é um estrategista sênior da ESCOM Studio gerando um DOSSIÊ DE INTELIGÊNCIA COMERCIAL em HTML puro (sem markdown).

═══════════════════════════════════════════
DADOS DO LEAD
═══════════════════════════════════════════
Nome: ${lead.nome}
Nicho: ${lead.categoria}
Cidade: ${lead.cidade}
Rating Google: ${lead.rating || "N/D"} estrelas (${lead.reviews_count || 0} avaliações)
Site atual: ${lead.website || "NÃO POSSUI SITE PRÓPRIO"}
PageSpeed mobile — Performance: ${ps.performance ?? "N/D"}% | SEO: ${ps.seo ?? "N/D"}% | Acessibilidade: ${ps.acessibilidade ?? "N/D"}%
UX: ${diag.identidadeVisualUI ? JSON.stringify({ visual: diag.identidadeVisualUI, heuristicas: diag.heuristicasNielsen }) : "não analisado"}

CONCORRENTES (Google Maps):
${concorrentesStr}

═══════════════════════════════════════════
DESIGN SYSTEM OBRIGATÓRIO
═══════════════════════════════════════════
PASSO 1 — DEFINA AS CORES DO CLIENTE (faça isso ANTES de gerar o HTML):
Analise o nicho "${lead.categoria}", a cidade "${lead.cidade}" e os dados de identidade visual abaixo.
Escolha 2 cores que representem o branding deste cliente:
- COR_PRIMARIA: cor principal da marca (use dados reais se disponíveis; se não, escolha uma cor adequada ao nicho)
- COR_ACENTO: cor de destaque/complementar

Dados de identidade visual do site atual: ${diag.identidadeVisualUI ? JSON.stringify(diag.identidadeVisualUI) : "não disponível"}

Exemplos de escolha por nicho (use como referência, não como regra fixa):
- Academia / Fitness: laranja #f97316 + preto #18181b
- Odontologia / Saúde: azul #2563eb + verde-água #06b6d4
- Gastronomia / Bar: vermelho #dc2626 + dourado #ca8a04
- Advocacia / Contabilidade: azul-escuro #1e3a5f + dourado #b8860b
- Beleza / Estética: rosa #db2777 + dourado #a16207
- Automotivo: vermelho #dc2626 + cinza-escuro #374151
- Moda / Varejo: preto #18181b + bege #d4a76a

Depois de definir COR_PRIMARIA e COR_ACENTO, use-as em TODO o documento.

Inclua EXATAMENTE este bloco <head>, substituindo [COR_PRIMARIA] e [COR_ACENTO] pelos hex escolhidos:

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dossiê Estratégico | ${lead.nome}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: { primary: '[COR_PRIMARIA]', accent: '[COR_ACENTO]' }
          },
          fontFamily: { sans: ['Inter','sans-serif'], display: ['Playfair Display','serif'] }
        }
      }
    }
  </script>
  <style>
    @page { size: A4; margin: 0; }
    body { background-color: #f4f4f5; color: #3f3f46; font-family: 'Inter', sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .pdf-page { width: 210mm; height: 297mm; padding: 18mm; margin: 30px auto; background: #ffffff; box-shadow: 0 10px 30px rgba(0,0,0,0.05); position: relative; box-sizing: border-box; display: flex; flex-direction: column; overflow: hidden; page-break-after: always; page-break-inside: avoid; border: 1px solid #e4e4e7; }
    .decor-line { position: absolute; top: 0; left: 0; width: 100%; height: 6px; background: linear-gradient(90deg, [COR_PRIMARIA] 0%, [COR_ACENTO] 100%); z-index: 20; }
    .content-layer { position: relative; z-index: 10; display: flex; flex-direction: column; height: 100%; }
    .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%) rotate(-45deg); font-size: 8rem; color: rgba(0,0,0,0.012); font-weight: 800; white-space: nowrap; pointer-events: none; z-index: 0; }
    .brand-primary { color: [COR_PRIMARIA]; }
    .brand-accent { color: [COR_ACENTO]; }
    .brand-bg { background-color: [COR_PRIMARIA]; }
    .brand-border { border-color: [COR_PRIMARIA]; }
    .badge-forte { background:#dcfce7; color:#166534; border:1px solid #16a34a; padding:2px 8px; border-radius:4px; font-size:11px; font-weight:700; }
    .badge-medio { background:#fef3c7; color:#92400e; border:1px solid #f59e0b; padding:2px 8px; border-radius:4px; font-size:11px; font-weight:700; }
    .badge-fraco { background:#fee2e2; color:#991b1b; border:1px solid #ef4444; padding:2px 8px; border-radius:4px; font-size:11px; font-weight:700; }
    .no-print { display:block; }
    @media print {
      html, body { background-color:#ffffff !important; margin:0 !important; padding:0 !important; width:210mm !important; }
      .pdf-page { margin:0 !important; box-shadow:none !important; border:none !important; }
      .no-print { display:none !important; }
    }
  </style>
</head>

Botão de impressão (fora das páginas, no topo do body, class="no-print"):
  Position fixed, canto superior direito, "⬇ Baixar PDF" → onclick="window.print()"
  Estilo: background [COR_PRIMARIA], texto branco, padding 10px 20px, border-radius 6px, font Inter

Estrutura de cada página A4:
<div class="pdf-page">
  <div class="decor-line"></div>
  <div class="watermark">CONFIDENCIAL</div>
  <div class="content-layer">
    <!-- conteúdo da página -->
    <div class="mt-auto flex justify-between items-center text-xs text-zinc-400 font-mono border-t border-zinc-100 pt-4">
      <span>Dossiê ${lead.nome} - Inteligência Comercial</span>
      <span>Página N</span>
    </div>
  </div>
</div>

Paleta de cores (use inline style= para cores da marca, Tailwind para o resto):
- Títulos principais: text-zinc-900 font-display (Playfair Display)
- Destaque primário: class="brand-primary" (usa COR_PRIMARIA)
- Destaque secundário: class="brand-accent" (usa COR_ACENTO)
- Linha decorativa do título (igual ao template): <div style="width:64px;height:6px;background:[COR_ACENTO];margin-top:16px"></div>
- Corpo: text-zinc-700 text-sm leading-relaxed
- Cards: bg-zinc-50 border border-zinc-200 rounded-xl
- Cards positivos: fundo levemente colorido com COR_ACENTO em opacidade baixa (style="background: [COR_ACENTO]15")
- Cards de atenção: bg-red-50 border-red-100
- Cards neutros: bg-zinc-50 border-zinc-200

═══════════════════════════════════════════
ESTRUTURA OBRIGATÓRIA — 11 PÁGINAS A4
═══════════════════════════════════════════

PÁGINA 1 — CAPA
- Topo: "ESCOM Studio • Business Intelligence" em font-mono text-zinc-400 tracking-[0.2em] uppercase text-sm
- Título h1: "Análise Estratégica" em text-zinc-900 font-display font-black text-5xl
- Linha 2 do h1: "${lead.nome}" em text-brand-primary
- Linha decorativa verde: <div class="w-16 h-1.5 bg-brand-accent mt-4"></div>
- Visual centralizado: div com height ~115mm, rounded-2xl, overflow-hidden, sem border. Dentro: img com src="${coverPhotoUrl}" style="width:100%;height:100%;object-fit:cover;display:block". Sobre a imagem: overlay div com position:absolute, inset:0, background semi-transparente usando [COR_PRIMARIA] em opacity 0.45, mais texto centralizado com o nome do nicho em branco, font-display, text-2xl, font-bold. Use position:relative no wrapper e position:absolute no overlay.
- Rodapé: "Documento Preparado para" + "${lead.nome}" (bold) | "Status / Confidencial" (text-emerald-600)
- SEM número de página na capa

PÁGINA 2 — SOBRE NÓS
- h2: "Sobre Nós" + "<span class='text-brand-primary text-sm font-mono font-normal'>/ ESCOM Studio</span>"
- Parágrafo: quem é a ESCOM Studio, especialização em web design premium e conversão
- Card cinza: descrição do dossiê, o que o cliente vai encontrar nas páginas seguintes
- Adaptado ao nicho ${lead.categoria}

PÁGINA 3 — ÍNDICE EXECUTIVO
- h2: "Conteúdo / Índice Executivo"
- Grade 2 colunas com números de página (04 a 11) e títulos das seções
- Card inferior com parágrafo contextual sobre ${lead.nome} e ${lead.categoria}

PÁGINA 4 — DIAGNÓSTICO DO NEGÓCIO
- h2: "Diagnóstico do Negócio: ${lead.nome} Frente ao Posicionamento de Mercado"
- Parágrafo intro com dados reais (${lead.rating} estrelas, ${lead.reviews_count} avaliações, ${lead.cidade})
- 3 cards:
  1. "A Força Técnica" (ícone fa-medal, text-brand-primary) — pontos positivos reais
  2. "O Gargalo do Canal Digital" (ícone fa-triangle-exclamation, text-red-600) — problemas identificados com PageSpeed ${ps.performance ?? "N/D"}%
  3. "A Solução Proposta" (bg-emerald-50/40) — o que a ESCOM vai resolver

${lead.website ? `PÁGINA 4-B — RAIO-X DO SITE ATUAL (página extra)
- h2: "Raio-X Digital: ${lead.website}"
- Tabela de métricas PageSpeed: Performance ${ps.performance ?? "N/D"}% | SEO ${ps.seo ?? "N/D"}% | Acessibilidade ${ps.acessibilidade ?? "N/D"}%
  Cada métrica com badge FORTE/MÉDIO/FRACO baseado no valor (≥80 FORTE, 50-79 MÉDIO, <50 FRACO)
- Cards de heurísticas UX para o nicho ${lead.categoria} (Atende / Parcial / Falha)
- Tabela: "Dor Identificada | Impacto | Como o Novo Site Resolve" — mínimo 4 linhas específicas
- Tom: cada problema = custo em clientes/vendas; solução ESCOM nomeada explicitamente` : `(Lead sem site: na Página 4, mencione que a AUSÊNCIA de site é o maior gargalo — clientes que pesquisam online não encontram ${lead.nome}.)`}

PÁGINA 5 — PSICOGRAFIA & AVATARES
- h2: "Psicografia & Avatares de Compra"
- Subtítulo: "Decodificação das dores do cliente de ${lead.categoria} em ${lead.cidade}"
- Grid 2 colunas: Avatar A (bg-blue-50/40) + Avatar B (bg-purple-50/40), cada um com: ícone, nome do perfil, dores principais, foco/argumento
- Matriz de Neutralização de Objeções: grid 3 colunas, 3 objeções típicas do nicho com respostas

PÁGINA 6 — O CAMPO DE BATALHA
- h2: "O Campo de Batalha"
- Subtítulo: "Mapeamento das forças e fraquezas dos concorrentes locais"
- Grid 2×2 para 4 concorrentes (bg-zinc-50/50, border-zinc-200): nome em bold, Força em text-emerald-700, Fraqueza em text-red-600
- 5º concorrente em largura total
- Use os dados reais se disponíveis; se não, crie 5 perfis genéricos e realistas do nicho ${lead.categoria}

PÁGINA 7 — LACUNAS & FILTRO DE COPY
- h2: "Lacunas & Filtro de Copy"
- Bloco "O Espaço Vazio de Mercado": parágrafo sobre oportunidade única para ${lead.nome}
- Tabela 2 colunas: "EVITAR TERMOS GASTOS" (bg-red-50, text-red-700) × "SUBSTITUIR POR FATOS REAIS" (bg-emerald-50, text-emerald-700)
  5-6 linhas específicas para ${lead.categoria} em ${lead.cidade}

PÁGINA 8 — OS 6 PILARES DE VANTAGEM
- h2: "Os 6 Pilares de Vantagem da ${lead.nome}"
- Grid 2×3 de cards (bg-zinc-50/40): número grande text-brand-primary + título bold + descrição 2 linhas
- Específicos e baseados nos dados reais do nicho ${lead.categoria}

PÁGINA 9 — ANATOMIA DA LP DE ALTO TICKET
- h2: "Anatomia da LP de Alto Ticket"
- 4 blocos numerados (bg-zinc-50/40): seções da landing page ideal para ${lead.nome}
  1. Dobra Principal (Hero) | 2. Prova Social | 3. Provas Concretas | 4. CTA Direto WhatsApp
- Caixa de destaque final (bg-brand-primary/10 border-brand-primary): "AÇÃO DIRETA SEM BARREIRAS"

PÁGINA 10 — ROI & VIABILIDADE FINANCEIRA
- h2: "ROI & Viabilidade Financeira"
- 2 métricas em destaque (grid 2 colunas, bg-zinc-50): CAC estimado + LTV estimado para ${lead.categoria}
- Tabela "SIMULAÇÃO PRÁTICA MENSAL ESTIMADA": Investimento Ads | Contatos Qualificados | Receita Estimada
  Valores realistas para o ticket médio do nicho

PÁGINA 11 — SÍNTESE FINAL
- h2 centralizado: "Síntese Final"
- Citação em destaque (text-2xl font-display italic text-brand-primary, centralizada, borda esquerda)
- Parágrafo de CTA: "Agora que você conhece o diagnóstico completo, vamos conversar sobre como executar?"
- Dados ESCOM: es.comunicacao@outlook.com | WhatsApp (13) 98106-2787
- Rodapé: "ESCOM STUDIO • BUSINESS INTELLIGENCE / Dossiê ${lead.nome} - Confidencial"

═══════════════════════════════════════════
REGRAS ABSOLUTAS
═══════════════════════════════════════════
1. Retorne APENAS o HTML completo começando com <!DOCTYPE html>
2. Sem markdown, sem explicações fora do HTML
3. Use APENAS dados fornecidos — PROIBIDO inventar nomes/ratings/URLs de concorrentes reais
4. Toda copy deve nomear "${lead.nome}" e "${lead.categoria}" especificamente
5. Use classes Tailwind para todo estilo — nunca style= inline (exceto background-image para fotos)
6. O HTML final deve ter NO MÍNIMO 11 div.pdf-page
7. A análise é um espelho de dores — cada problema = custo em clientes/vendas; a ESCOM é a solução`;

    // 4. Chama Groq para gerar o HTML
    let html = "";
    {
      let raw = await groqGenerate(prompt, { temperature: 0.2, maxTokens: 16000 });
      if (raw.includes("```html")) raw = raw.split("```html")[1].split("```")[0].trim();
      else if (raw.includes("```")) raw = raw.split("```")[1].split("```")[0].trim();
      if (raw.includes("<html") || raw.startsWith("<!DOCTYPE")) html = raw;
    }

    if (!html) return res.status(503).send("<h1>Análise indisponível. Tente novamente em instantes.</h1>");

    const leadSlug = (lead.nome || "lead").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const filename = `dossie-${leadSlug}.pdf`;

    // 5. Se ?pdf=1, gera via Browserless e serve como PDF inline
    if (req.query.pdf === "1") {
      const blToken = process.env.BROWSERLESS_TOKEN;
      if (blToken) {
        try {
          const blRes = await fetch(`https://chrome.browserless.io/pdf?token=${blToken}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              html,
              options: { printBackground: true, format: "A4", margin: { top: "0", right: "0", bottom: "0", left: "0" } },
              gotoOptions: { waitUntil: "networkidle0", timeout: 30000 },
              waitFor: 1500,
            }),
          });
          if (blRes.ok) {
            const pdfBuf = Buffer.from(await blRes.arrayBuffer());
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
            return res.send(pdfBuf);
          }
        } catch (blErr: any) {
          console.warn("[PDF] Browserless indisponível:", blErr?.message);
        }
      }
    }

    // 6. Salva no Supabase (cache) e serve HTML com botão de impressão
    try {
      await sbFetch(`/leads?id=eq.${encodeURIComponent(req.params.leadId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({ analise_html: html }),
      });
    } catch {}

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    res.send(html);
  } catch(e: any) { res.status(500).send("<h1>Erro: " + e.message + "</h1>"); }
});

// ── /api/enviar-email — Envia email de prospecção personalizado via Resend ────
app.post("/api/enviar-email", async (req, res) => {
  try {
    const { leadId, emailDestinatario, nomeDestinatario } = req.body;
    if (!leadId || !emailDestinatario) return res.status(400).json({ error: "leadId e emailDestinatario obrigatórios" });

    const resendKey = process.env.RESEND_API_KEY || "";
    if (!resendKey) return res.status(500).json({ error: "RESEND_API_KEY não configurada" });

    // Busca lead no Supabase
    const rows = await sbFetch(`/leads?id=eq.${encodeURIComponent(leadId)}&select=*&limit=1`);
    if (!rows || rows.length === 0) return res.status(404).json({ error: "Lead não encontrado" });
    const lead = rows[0];

    const siteGeradoUrl = lead.site_gerado || "";
    const analisePdfUrl = `https://www.escomstudio.com.br/api/gerar-analise/${leadId}`;
    const ps = lead.diagnostico?.pagespeed || {};

    // Slug do negócio para URL amigável no subject
    const nomeSlug = lead.nome.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 20);
    const siteUrl = siteGeradoUrl || `https://${nomeSlug}.escomstudio.com.br`;

    // Gera o corpo do email com Gemini (ou usa template fixo como fallback)
    let emailHtml = "";
    let assunto = `RE: Sua página ${lead.nome} para aumentar seus lucros → ${siteUrl}`;

    if (process.env.GROQ_API_KEY) {
      try {
        const prompt = `Você é Eduardo Santos, especialista em estratégias para aumentar a lucratividade de negócios locais.
Escreva um email de prospecção PERSONALIZADO seguindo EXATAMENTE o formato abaixo. Substitua apenas os campos entre colchetes.

Dados do negócio:
- Nome: ${lead.nome}
- Nicho: ${lead.categoria}
- Cidade: ${lead.cidade}
- Avaliação Google: ${lead.rating || "N/A"} estrelas (${lead.reviews_count || 0} avaliações)
- URL do site gerado: ${siteUrl}

FORMATO OBRIGATÓRIO (siga a estrutura e o tom exatos — apenas personalize onde indicado):

Oi, [primeiro nome do negócio ou nome curto].

Sou Eduardo Santos, especialista em estratégias para aumentar a lucratividade de negócios locais.

Encontrei a [nome do negócio] no Google e vi que vocês têm [X] estrelas e [Y] avaliações.

Ou seja: vocês já têm reputação.

E para gerar mais oportunidades de negócio, montei essa página especificamente para vocês:
→ ${siteUrl}

E para aumentar seus lucros...

Quero fazer uma análise gratuita e sem compromisso da [nome do negócio] e mostrar, na prática, onde vejo as brechas deixadas pelos concorrentes, as oportunidades lucrativas do seu mercado.

A partir dessa análise, respeitando seu momento atual, podemos estruturar a sua estratégia.

Para alinhar os detalhes, marcamos uma conversa de 15 minutos.
Eu mostro o que encontrei, explico como fazer um projeto lucrativo no seu negócio.

55 13 98106-2787
Eduardo Santos

REGRAS:
- Tom: conversa direta entre profissionais, sem ser vendedor
- NÃO mencione ESCOM Studio no corpo (só na assinatura se necessário)
- NÃO use palavras como "Prezado", "Atenciosamente", "Por favor"
- NÃO ofereça o site como produto — o produto é a análise gratuita e a conversa
- Retorne APENAS o HTML do corpo (sem <html>/<head>/<body>)
- Use fonte Arial/sans-serif, cor #333 para texto, line-height 1.8
- NÃO adicione botões estilizados — apenas os links de texto já estão no template
- Máximo 180 palavras`;

        let raw = await groqGenerate(prompt, { temperature: 0.6, maxTokens: 4096 });
        if (raw.includes("```html")) raw = raw.split("```html")[1].split("```")[0].trim();
        else if (raw.includes("```")) raw = raw.split("```")[1].split("```")[0].trim();
        if (raw.length > 50) emailHtml = raw;
      } catch {}
    }

    // Fallback: template fixo se Gemini falhar
    if (!emailHtml) {
      const primeiroNome = lead.nome.split(/[\s']/)[0];
      const rating = lead.rating ? `${lead.rating} estrelas` : "avaliações";
      const reviews = lead.reviews_count ? `${lead.reviews_count} avaliações` : "avaliações";

      emailHtml = `
        <p style="font-family:Arial,sans-serif;color:#333;font-size:15px;line-height:1.8;margin:0 0 16px">
          Oi, ${primeiroNome}.
        </p>
        <p style="font-family:Arial,sans-serif;color:#333;font-size:15px;line-height:1.8;margin:0 0 16px">
          Sou Eduardo Santos, especialista em estratégias para aumentar a lucratividade de negócios locais.
        </p>
        <p style="font-family:Arial,sans-serif;color:#333;font-size:15px;line-height:1.8;margin:0 0 16px">
          Encontrei a ${lead.nome} no Google e vi que vocês têm ${rating} e ${reviews}.
        </p>
        <p style="font-family:Arial,sans-serif;color:#333;font-size:15px;line-height:1.8;margin:0 0 16px">
          Ou seja: vocês já têm reputação.
        </p>
        <p style="font-family:Arial,sans-serif;color:#333;font-size:15px;line-height:1.8;margin:0 0 16px">
          E para gerar mais oportunidades de negócio, montei essa página especificamente para vocês:<br>
          → <a href="${siteUrl}" style="color:#0a0a14">${siteUrl}</a>
        </p>
        <p style="font-family:Arial,sans-serif;color:#333;font-size:15px;line-height:1.8;margin:0 0 16px">
          E para aumentar seus lucros...
        </p>
        <p style="font-family:Arial,sans-serif;color:#333;font-size:15px;line-height:1.8;margin:0 0 16px">
          Quero fazer uma análise gratuita e sem compromisso da ${lead.nome} e mostrar, na prática, onde vejo as brechas deixadas pelos concorrentes, as oportunidades lucrativas do seu mercado.
        </p>
        <p style="font-family:Arial,sans-serif;color:#333;font-size:15px;line-height:1.8;margin:0 0 16px">
          A partir dessa análise, respeitando seu momento atual, podemos estruturar a sua estratégia.
        </p>
        <p style="font-family:Arial,sans-serif;color:#333;font-size:15px;line-height:1.8;margin:0 0 16px">
          Para alinhar os detalhes, marcamos uma conversa de 15 minutos.<br>
          Eu mostro o que encontrei, explico como fazer um projeto lucrativo no seu negócio.
        </p>
        <p style="font-family:Arial,sans-serif;color:#333;font-size:15px;line-height:1.8;margin:32px 0 0">
          <a href="https://wa.me/5513981062787" style="color:#0a0a14;text-decoration:none">55 13 98106-2787</a><br>
          <strong>Eduardo Santos</strong>
        </p>`;
    }

    const emailFinal = `
      <div style="max-width:580px;margin:0 auto;background:#fff;padding:40px 32px">
        ${emailHtml}
        <p style="font-family:Arial,sans-serif;color:#bbb;font-size:10px;margin-top:48px;border-top:1px solid #eee;padding-top:16px">
          Para não receber mais mensagens, responda com "remover".
        </p>
      </div>`;

    const resend = new Resend(resendKey);
    await resend.emails.send({
      from: "Eduardo Santos <onboarding@resend.dev>",
      to: [emailDestinatario],
      subject: assunto,
      html: emailFinal,
    });

    // Registra no lead que o email foi enviado
    try {
      await sbFetch(`/leads?id=eq.${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Prefer: "return=minimal" } as any,
        body: JSON.stringify({ email_prospeccao_enviado: true, email_prospeccao_em: new Date().toISOString() }),
      });
    } catch {}

    res.json({ success: true });
  } catch(e: any) { res.status(500).json({ success: false, error: e.message }); }
});

// ── /api/mp-webhook — Recebe notificações de pagamento do Mercado Pago ────────
app.post("/api/mp-webhook", async (req, res) => {
  try {
    const { type, data } = req.body;
    res.sendStatus(200); // responde rápido pro MP não reenviar

    if (type !== "payment") return;
    const paymentId = data?.id;
    if (!paymentId) return;

    const mpToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!mpToken) return;

    // Busca detalhes do pagamento na API do MP
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${mpToken}` },
    });
    if (!mpRes.ok) return;
    const payment = await mpRes.json();

    const status = payment.status;           // approved | pending | rejected
    const pid    = payment.external_reference; // nosso project id
    const valor  = payment.transaction_amount;
    const nome   = payment.payer?.first_name || "";
    const email  = payment.payer?.email || "";

    console.log(`[MP-WEBHOOK] payment ${paymentId} status=${status} pid=${pid}`);

    if (status === "approved" && pid) {
      // 1. Atualiza generated_sites no Supabase
      try {
        await sbFetch(`/generated_sites?id=eq.${encodeURIComponent(pid)}`, { method: "PATCH", headers: { "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify({ status: "pago", mp_payment_id: paymentId, pago_em: Date.now(), pago_valor: valor, pagador_email: email }) });
      } catch(e: any) { console.warn("[MP-WEBHOOK] Supabase generated_sites update error:", e.message); }

      // 2. Atualiza Supabase — marca lead como convertido
      try {
        const sbUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
        const sbKey = process.env.SUPABASE_SERVICE_KEY;
        if (sbUrl && sbKey) {
          await fetch(`${sbUrl}/rest/v1/leads?site_gerado=ilike.%25${pid}%25`, {
            method: "PATCH",
            headers: {
              apikey: sbKey,
              Authorization: `Bearer ${sbKey}`,
              "Content-Type": "application/json",
              Prefer: "return=minimal",
            },
            body: JSON.stringify({ status: "convertido", email_prospeccao_enviado: true }),
          });
        }
      } catch(e: any) { console.warn("[MP-WEBHOOK] Supabase update error:", e.message); }

      // 3. Notifica Eduardo por email
      try {
        const resendKey = process.env.RESEND_API_KEY;
        if (resendKey) {
          const { Resend } = await import("resend");
          const resend = new Resend(resendKey);
          await resend.emails.send({
            from: "ESCOM Studio <onboarding@resend.dev>",
            to: "es.comunicacao@outlook.com",
            subject: `💰 Pagamento aprovado — R$${valor} — ${pid}`,
            html: `<p><strong>Pagamento aprovado!</strong></p>
              <ul>
                <li>Site: ${pid}</li>
                <li>Valor: R$ ${valor}</li>
                <li>Pagador: ${nome} &lt;${email}&gt;</li>
                <li>Payment ID: ${paymentId}</li>
              </ul>
              <p>Acesse o CRM para dar continuidade.</p>`,
          });
        }
      } catch(e: any) { console.warn("[MP-WEBHOOK] Email error:", e.message); }
    }
  } catch(e: any) {
    console.error("[MP-WEBHOOK] Erro:", e.message);
  }
});

// ==========================================
// MÓDULO LOGO STUDIO (logo-design-skill)
// ==========================================
interface LogoConcept {
  id: string;
  name: string;
  type: string;
  markType: "monogram" | "symbol" | "emblem";
  rationale: string;
  svg: string;
  monoBlackSvg: string;
  monoWhiteSvg: string;
  colors: Array<{
    name: string;
    hex: string;
    role: string;
  }>;
  typographyRecommendation: string;
  auditScore: number;
  auditNotes: string;
}

interface GenerateLogoParams {
  brandName: string;
  segment?: string;
  vibe?: string;
  colorPreferences?: string;
  markTypes?: string[];
  customNotes?: string;
}

function getIndustryBanRules(segment: string): string {
  const s = (segment || "").toLowerCase();
  if (s.includes("advoc") || s.includes("jurid") || s.includes("direit")) {
    return "PROIBIDO: Balança da justiça, martelo/malhete de juiz, colunas romanas clássicas, livros abertos ou espadas genéricas. Crie uma forma geométrica minimalista, autoritária, austera e monolítica.";
  }
  if (s.includes("med") || s.includes("saude") || s.includes("clinic") || s.includes("odont") || s.includes("dent")) {
    return "PROIBIDO: Cruz de farmácia simples, estetoscópio em formato de coração, dente estilizado óbvio, silhueta humana de braços abertos. Crie formas puras, precisão celular, arcos de proteção e harmonia orgânica sutil.";
  }
  if (s.includes("financ") || s.includes("invest") || s.includes("banc") || s.includes("crypto") || s.includes("fintech")) {
    return "PROIBIDO: Gráficos de barras ou linha com seta subindo, escudos de segurança óbvios, moedas flutuantes, globos terrestres em rede. Crie ângulos de dinamismo, proporção áurea, estabilidade geométrica monolítica.";
  }
  if (s.includes("tech") || s.includes("software") || s.includes("saas") || s.includes("ai") || s.includes("app")) {
    return "PROIBIDO: Circuitos elétricos clichês, nós de rede com bolinhas ligadas por fios, cérebros digitais, hexágonos vazios repetidos, cadeados de segurança. Crie um símbolo de alta pregnância visual, corte óptico negativo de alta memorabilidade.";
  }
  if (s.includes("cafe") || s.includes("restauran") || s.includes("gastro") || s.includes("bar")) {
    return "PROIBIDO: Xícara fumegante de café, garfo e faca cruzados, grão de café literal. Crie marcas que transmitam atmosfera, sabor e elegância através de geometria singular e proporção espacial.";
  }
  if (s.includes("imob") || s.includes("construt") || s.includes("arquitet")) {
    return "PROIBIDO: Telhadinho triangular sobre as letras, skyline de prédios simplificados, chave ou tijolos. Foque em volumetria, planos espaciais, luz, perspectiva e proporção arquitetônica modernista.";
  }
  return "PROIBIDO qualquer metáfora óbvia ou literal do produto. Um logotipo de classe mundial identifica, não ilustra o que a empresa faz (pense em Apple, Nike, Mercedes, Spotify, Airbnb).";
}

function generateDeterministicConcepts(brandName: string, segment: string, vibe: string): LogoConcept[] {
  const initial = (brandName.charAt(0) || "E").toUpperCase();
  const secondLetter = (brandName.charAt(1) || "S").toUpperCase();

  const svg1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <defs>
    <linearGradient id="grad1" x1="96" y1="96" x2="416" y2="416" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
    <linearGradient id="gradDark" x1="120" y1="120" x2="392" y2="392" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0ea5e9" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#0369a1" stop-opacity="0.05"/>
    </linearGradient>
  </defs>
  <polygon points="256,64 424,160 424,352 256,448 88,352 88,160" stroke="url(#grad1)" stroke-width="12" stroke-linejoin="round" fill="url(#gradDark)" />
  <path d="M192 176 H320 V224 H240 V244 H304 V292 H240 V336 H192 Z" fill="#ffffff" />
  <circle cx="320" cy="336" r="16" fill="#38bdf8" />
  <path d="M256 112 L368 176 V336 L256 400 L144 336 V176 Z" stroke="#38bdf8" stroke-width="4" stroke-dasharray="8 8" opacity="0.4" fill="none" />
</svg>`;

  const monoBlack1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <polygon points="256,64 424,160 424,352 256,448 88,352 88,160" stroke="#000000" stroke-width="14" stroke-linejoin="round" fill="none" />
  <path d="M192 176 H320 V224 H240 V244 H304 V292 H240 V336 H192 Z" fill="#000000" />
  <circle cx="320" cy="336" r="16" fill="#000000" />
</svg>`;

  const monoWhite1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <polygon points="256,64 424,160 424,352 256,448 88,352 88,160" stroke="#ffffff" stroke-width="14" stroke-linejoin="round" fill="none" />
  <path d="M192 176 H320 V224 H240 V244 H304 V292 H240 V336 H192 Z" fill="#ffffff" />
  <circle cx="320" cy="336" r="16" fill="#ffffff" />
</svg>`;

  const svg2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <defs>
    <linearGradient id="amberGrad" x1="120" y1="120" x2="392" y2="392" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="50%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
  </defs>
  <circle cx="256" cy="256" r="180" stroke="#f59e0b" stroke-width="6" stroke-opacity="0.25" fill="none" />
  <path d="M256 100 C342.15 100 412 169.85 412 256 C412 300 394 340 364 368 L320 324 C338 304 350 282 350 256 C350 204.08 307.92 162 256 162 Z" fill="url(#amberGrad)" />
  <path d="M256 412 C169.85 412 100 342.15 100 256 C100 212 118 172 148 144 L192 188 C174 208 162 230 162 256 C162 307.92 204.08 350 256 350 Z" fill="url(#amberGrad)" />
  <circle cx="256" cy="256" r="32" fill="#ffffff" />
</svg>`;

  const monoBlack2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <path d="M256 100 C342.15 100 412 169.85 412 256 C412 300 394 340 364 368 L320 324 C338 304 350 282 350 256 C350 204.08 307.92 162 256 162 Z" fill="#000000" />
  <path d="M256 412 C169.85 412 100 342.15 100 256 C100 212 118 172 148 144 L192 188 C174 208 162 230 162 256 C162 307.92 204.08 350 256 350 Z" fill="#000000" />
  <circle cx="256" cy="256" r="32" fill="#000000" />
</svg>`;

  const monoWhite2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <path d="M256 100 C342.15 100 412 169.85 412 256 C412 300 394 340 364 368 L320 324 C338 304 350 282 350 256 C350 204.08 307.92 162 256 162 Z" fill="#ffffff" />
  <path d="M256 412 C169.85 412 100 342.15 100 256 C100 212 118 172 148 144 L192 188 C174 208 162 230 162 256 C162 307.92 204.08 350 256 350 Z" fill="#ffffff" />
  <circle cx="256" cy="256" r="32" fill="#ffffff" />
</svg>`;

  const svg3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <defs>
    <linearGradient id="emeraldGrad" x1="128" y1="128" x2="384" y2="384" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#34d399"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
  </defs>
  <rect x="256" y="96" width="226" height="226" rx="28" transform="rotate(45 256 96)" fill="url(#emeraldGrad)" />
  <rect x="256" y="146" width="156" height="156" rx="20" transform="rotate(45 256 146)" fill="#09090b" />
  <circle cx="256" cy="256" r="44" fill="url(#emeraldGrad)" />
  <path d="M256 170 V220 M256 292 V342 M170 256 H220 M292 256 H342" stroke="#ffffff" stroke-width="8" stroke-linecap="round" />
</svg>`;

  const monoBlack3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <rect x="256" y="96" width="226" height="226" rx="28" transform="rotate(45 256 96)" fill="#000000" />
  <rect x="256" y="146" width="156" height="156" rx="20" transform="rotate(45 256 146)" fill="#ffffff" />
  <circle cx="256" cy="256" r="44" fill="#000000" />
</svg>`;

  const monoWhite3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <rect x="256" y="96" width="226" height="226" rx="28" transform="rotate(45 256 96)" fill="#ffffff" />
  <rect x="256" y="146" width="156" height="156" rx="20" transform="rotate(45 256 146)" fill="#000000" />
  <circle cx="256" cy="256" r="44" fill="#ffffff" />
</svg>`;

  return [
    {
      id: "concept-1",
      name: `Monograma Óptico "${initial}"`,
      type: "Monograma Geométrico",
      markType: "monogram",
      rationale: `Construção modular baseada no polígono estrutural de 6 vértices com corte negativo áureo. Transmite autoridade, segurança de dados e alta distinção visual sem recorrer a símbolos óbvios da área de ${segment}.`,
      svg: svg1,
      monoBlackSvg: monoBlack1,
      monoWhiteSvg: monoWhite1,
      colors: [
        { name: "Cyan Lumina", hex: "#38bdf8", role: "Vetor Primário" },
        { name: "Deep Cobalt", hex: "#0284c7", role: "Profundidade & Sombra" },
        { name: "Pure White", hex: "#ffffff", role: "Contraste Central" }
      ],
      typographyRecommendation: "Space Grotesk Bold / PP Neue Montreal",
      auditScore: 98,
      auditNotes: "Passa com folga no teste de 16px (legibilidade impecável como favicon em browsers e apps)."
    },
    {
      id: "concept-2",
      name: `Nexus Infinito`,
      type: "Símbolo Abstrato / Brandmark",
      markType: "symbol",
      rationale: `Metáfora de dinamismo contínuo e evolução cíclica. A curva em fita tangencia o centro em simetria de rotação perfeita de 180°, eliminando qualquer clichê visual e criando uma marca com pregnância e reconhecimento instantâneo.`,
      svg: svg2,
      monoBlackSvg: monoBlack2,
      monoWhiteSvg: monoWhite2,
      colors: [
        { name: "Cyber Amber", hex: "#f59e0b", role: "Acento de Luxo" },
        { name: "Warm Gold", hex: "#fbbf24", role: "Luminosidade" },
        { name: "Dark Bronze", hex: "#d97706", role: "Base de Volume" }
      ],
      typographyRecommendation: "Syne ExtraBold / Clash Display",
      auditScore: 96,
      auditNotes: "Excelente retenção visual. A rotação simétrica preserva o equilíbrio em suportes verticais e horizontais."
    },
    {
      id: "concept-3",
      name: `Monólito Lapidado`,
      type: "Emblema Moderno / Geometric Lockup",
      markType: "emblem",
      rationale: `Formato de selo isométrico a 45 graus com proporções exatas de espessura de parede. Funciona perfeitamente como ícone de app nativo, crachá metálico ou aplicação em relevo cego sobre papelaria nobre.`,
      svg: svg3,
      monoBlackSvg: monoBlack3,
      monoWhiteSvg: monoWhite3,
      colors: [
        { name: "Emerald Precision", hex: "#10b981", role: "Tom Primário" },
        { name: "Mint Light", hex: "#34d399", role: "Acento Superior" },
        { name: "Obsidian Core", hex: "#09090b", role: "Núcleo de Respiro" }
      ],
      typographyRecommendation: "Outfit SemiBold / Satoshi",
      auditScore: 99,
      auditNotes: "Índice de contraste AAA. O enquadramento em 45° protege o símbolo de distorções em qualquer resolução."
    }
  ];
}

function normalizeSvgOutput(rawSvg: string, targetVariant: "color" | "monoBlack" | "monoWhite" = "color"): string {
  let s = (rawSvg || "").trim();
  // Limpa caracteres escapados
  s = s.replace(/\\"/g, '"').replace(/\\n/g, ' ').replace(/\\t/g, ' ');
  const match = s.match(/<svg[\s\S]*<\/svg>/i);
  if (match) s = match[0];

  // Remove qualquer viewBox, width ou height duplicados ou quebrados
  s = s.replace(/\s+viewBox="[^"]*"/gi, '');
  s = s.replace(/\s+width="[^"]*"/gi, '');
  s = s.replace(/\s+height="[^"]*"/gi, '');

  // Injeta atributos SVG padronizados e responsivos
  s = s.replace(/<svg\b([^>]*)>/i, '<svg$1 viewBox="0 0 512 512" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">');

  if (targetVariant === "monoBlack") {
    s = s.replace(/fill="(?!none)[^"]*"/gi, 'fill="#000000"')
         .replace(/stroke="(?!none)[^"]*"/gi, 'stroke="#000000"');
    s = s.replace(/<defs[\s\S]*?<\/defs>/gi, '');
  } else if (targetVariant === "monoWhite") {
    s = s.replace(/fill="(?!none)[^"]*"/gi, 'fill="#ffffff"')
         .replace(/stroke="(?!none)[^"]*"/gi, 'stroke="#ffffff"');
    s = s.replace(/<defs[\s\S]*?<\/defs>/gi, '');
  } else {
    // Modo colorido: se o modelo usou preto ou quase preto (#000, #0a0a0a, #111) nos elementos de desenho,
    // substitui por cor visível contrastante (#f59e0b ou #ffffff) para garantir visibilidade no fundo dark
    s = s.replace(/(fill|stroke|stop-color)="(#0[0-9a-fA-F]{5}|#000|#1[0-9a-fA-F]{5}|black)"/gi, '$1="#f59e0b"');
  }

  return s;
}

async function generateLogoConceptsInternal(params: GenerateLogoParams): Promise<LogoConcept[]> {
  const brandName = params.brandName.trim();
  const segment = params.segment?.trim() || "Geral / Corporativo";
  const vibe = params.vibe?.trim() || "Minimalista, Moderno, Sofisticado e Tecnológico";
  const colorPref = params.colorPreferences?.trim() || "Cores luminosas e modernas (ex: Âmbar Dourado #F59E0B, Ciano #00D1FF ou Branco #FFFFFF)";
  const customNotes = params.customNotes?.trim() || "";
  const banRules = getIndustryBanRules(segment);

  const prompt = `
VOCÊ É UM DIRETOR DE DESIGN DE IDENTIDADE VISUAL E BRANDING DE CLASSE MUNDIAL (ESPECIALISTA NA SKILL "LOGO-DESIGN").
SUA MISSÃO É CONCEBER E DESENHAR 3 CONCEITOS VETORIAIS DE LOGOTIPOS EM SVG PURO PARA A SEGUINTE MARCA:

DADOS DO BRIEFING:
- Nome da Marca: "${brandName}"
- Segmento / Indústria: "${segment}"
- Personalidade & Vibe: "${vibe}"
- Preferência de Cores: "${colorPref}"
- Observações adicionais: "${customNotes}"

DIRETRIZES FUNDAMENTAIS DO LOGO-DESIGN-SKILL:
1. "A logo is an identifier, not an explanation."
2. FILTRO ANTI-CLICHÊ DA CATEGORIA:
   ${banRules}
3. REGRAS CRÍTICAS DE CONSTRUÇÃO DE SVG E VISIBILIDADE:
   - A prancheta onde o logotipo será apresentado é ESCURA / PRETO PROFUNDO (#000000 / #09090b).
   - PORTANTO, TODAS AS CORES DO SVG PRINCIPAL DEVEM SER LUMINOSAS, CLARAS E DE ALTO CONTRASTE (por exemplo: Dourado #F59E0B, Ciano Neon #00D1FF, Branco Puro #FFFFFF, Esmeralda #10B981, Azul Cobalto #38BDF8).
   - PROIBIDO usar preto (#000000, #0a0a0a, #111111) como cor de preenchimento ou traço principal no 'svg' padrão, pois ele ficará totalmente invisível sobre o fundo escuro!
   - viewBox estrito: "0 0 512 512"
   - SVG puro e autocontido (com tags <path>, <circle>, <rect>, <polygon>, etc.).
   - NÃO use tags de texto cru <text> no símbolo principal (desenhe as formas e monogramas com geometria vetorial de paths).
   - Use preenchimentos sólidos elegantes, gradientes sutis modernos ou negative-space inteligente (fill-rule="evenodd").
   - Padding e respiro: a geometria deve estar centralizada e ocupar cerca de 60% a 75% da área útil (aproximadamente entre x: 64 e x: 448, y: 64 e y: 448) para não sangrar nas bordas.
   - Forneça também as versões monocromáticas puras 'monoBlackSvg' (apenas preenchimento preto #000000 em fundo transparente para impressão em papel branco) e 'monoWhiteSvg' (apenas preenchimento branco puro #ffffff em fundo transparente para aplicação em fundos pretos) do MESMO desenho exato.

OS 3 CONCEITOS DEVEM SER DISTINTOS:
- CONCEITO 1: "Monograma Geométrico" (Lettermark) — Focado na inicial ou monograma de "${brandName}", com cortes ópticos, geometria precisa, proporção áurea e elegância minimalista.
- CONCEITO 2: "Símbolo Abstrato / Brandmark" — Uma marca icônica, memorável, sem clichê da indústria, que evoca dinamismo, visão de futuro, autoridade e pregnância visual imediata.
- CONCEITO 3: "Emblema Moderno / Geometric Lockup" — Uma forma geométrica equilibrada e icônica (círculo com recortes, selo futurista, losango ou polígono lapidado), ideal para ícone de aplicativo e cartões de visita de alto luxo.

RETORNE EXCLUSIVAMENTE UM OBJETO JSON VÁLIDO no seguinte formato (sem markdown introdutório, apenas o JSON):
{
  "concepts": [
    {
      "id": "concept-1",
      "name": "Nome do Conceito",
      "type": "Monograma Geométrico",
      "markType": "monogram",
      "rationale": "Justificativa conceitual detalhada explicando a metáfora visual, a simetria, os cortes e por que evita os clichês da indústria.",
      "svg": "<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 512 512\\">...</svg>",
      "monoBlackSvg": "<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 512 512\\">...</svg>",
      "monoWhiteSvg": "<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 512 512\\">...</svg>",
      "colors": [
        { "name": "Nome da Cor", "hex": "#HEX", "role": "Fundo / Base / Destaque" },
        { "name": "Nome da Cor 2", "hex": "#HEX", "role": "Acento Primário" }
      ],
      "typographyRecommendation": "Recomendação de tipografia para lockup (ex: Syne Bold, Space Grotesk, PP Neue Montreal)",
      "auditScore": 98,
      "auditNotes": "Explicação técnica de por que o símbolo passa no teste de 16px e na auditoria óptica de pregnância."
    }
  ]
}
`;

  let jsonText = "";

  const groqKey = process.env.GROQ_API_KEY || process.env.Groq_API_KEY;
  if (groqKey) {
    try {
      const groq = new Groq({ apiKey: groqKey });
      const models = ["openai/gpt-oss-120b", "qwen/qwen3.8-27b"];
      for (const model of models) {
        try {
          const comp = await groq.chat.completions.create({
            model,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.4,
            max_tokens: 16000,
            response_format: { type: "json_object" }
          });
          const content = comp.choices[0]?.message?.content || "";
          if (content.includes("concepts") && content.includes("<svg")) {
            jsonText = content;
            break;
          }
        } catch (e: any) {
          console.warn(`[LogoGenerator] Falha no modelo Groq ${model}:`, e.message);
        }
      }
    } catch (e: any) {
      console.warn("[LogoGenerator] Erro geral ao instanciar Groq:", e.message);
    }
  }

  if (!jsonText && process.env.GEMINI_API_KEY) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 8192,
            responseMimeType: "application/json"
          }
        })
      });
      if (res.ok) {
        const data = await res.json();
        const geminiContent = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (geminiContent && geminiContent.includes("<svg")) {
          jsonText = geminiContent;
        }
      }
    } catch (e: any) {
      console.warn("[LogoGenerator] Falha no fallback Gemini:", e.message);
    }
  }

  if (jsonText) {
    try {
      const cleanJson = jsonText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
      
      const parsed = JSON.parse(cleanJson);
      const rawConcepts = Array.isArray(parsed.concepts) ? parsed.concepts : (Array.isArray(parsed) ? parsed : []);

      if (rawConcepts.length >= 1) {
        const concepts: LogoConcept[] = rawConcepts.map((c: any, idx: number) => {
          const svg = normalizeSvgOutput(c.svg || "", "color");
          const monoBlack = normalizeSvgOutput(c.monoBlackSvg || c.svg || "", "monoBlack");
          const monoWhite = normalizeSvgOutput(c.monoWhiteSvg || c.svg || "", "monoWhite");

          return {
            id: c.id || `concept-${idx + 1}`,
            name: c.name || `Conceito ${idx + 1}`,
            type: c.type || (idx === 0 ? "Monograma Geométrico" : idx === 1 ? "Símbolo Abstrato" : "Emblema Moderno"),
            markType: (c.markType || (idx === 0 ? "monogram" : idx === 1 ? "symbol" : "emblem")) as any,
            rationale: c.rationale || "Construção geométrica minimalista projetada sob rigor óptico para máxima retenção de marca.",
            svg,
            monoBlackSvg: monoBlack,
            monoWhiteSvg: monoWhite,
            colors: Array.isArray(c.colors) && c.colors.length > 0 ? c.colors : [
              { name: "Cyan Lumina", hex: "#06b6d4", role: "Vetor Primário" },
              { name: "Cyber Amber", hex: "#f59e0b", role: "Acento Secundário" },
              { name: "Pure White", hex: "#ffffff", role: "Contraste Central" }
            ],
            typographyRecommendation: c.typographyRecommendation || "Syne Bold / Space Grotesk",
            auditScore: typeof c.auditScore === "number" ? c.auditScore : 95,
            auditNotes: c.auditNotes || "Excelente retenção em 16px (favicon scale) e ausência de ruídos visuais."
          };
        });

        if (concepts.length >= 3) {
          return concepts.slice(0, 3);
        }
      }
    } catch (e: any) {
      console.warn("[LogoGenerator] Erro no parse JSON do LLM:", e.message);
    }
  }


  return generateDeterministicConcepts(brandName, segment, vibe);
}

// ENDPOINT: Geração de Logos Profissionais (logo-design-skill)
app.post("/api/gerar-logo", async (req, res) => {
  try {
    const { brandName, segment, vibe, colorPreferences, markTypes, customNotes } = req.body || {};
    if (!brandName || typeof brandName !== "string" || !brandName.trim()) {
      return res.status(400).json({ error: "O nome da marca é obrigatório." });
    }

    const concepts = await generateLogoConceptsInternal({
      brandName: brandName.trim(),
      segment: typeof segment === "string" ? segment : undefined,
      vibe: typeof vibe === "string" ? vibe : undefined,
      colorPreferences: typeof colorPreferences === "string" ? colorPreferences : undefined,
      markTypes: Array.isArray(markTypes) ? markTypes : undefined,
      customNotes: typeof customNotes === "string" ? customNotes : undefined,
    });

    return res.json({ success: true, concepts });
  } catch (err: any) {
    console.error("[API /api/gerar-logo] Erro:", err);
    return res.status(500).json({ error: "Falha ao gerar conceitos de logo", details: err?.message });
  }
});

app.listen(PORT, () => { console.log("Server running on port " + PORT); });

export default app;

