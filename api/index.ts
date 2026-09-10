import express from "express";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";
import * as cheerio from "cheerio";
import Groq from "groq-sdk";
import cron from "node-cron";

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

import { Resend } from "resend";
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp, Timestamp, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, orderBy, where, writeBatch, limit } from 'firebase/firestore';
import fs from 'fs';
import firebaseConfig from "./firebase-applet-config.js";

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId || '(default)');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json({ limit: '50mb' }));

export async function ensureAuth() {
  if (!auth.currentUser) {
    try { await signInWithEmailAndPassword(auth, "admin@escom.com", "Edu@1508001"); console.log("[SERVER_AUTH] Autenticado"); }
    catch(e) { console.error('[SERVER_AUTH] Falha:', e.message); }
  }
}
ensureAuth().catch(err => console.error("Initial auth failed:", err));

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
      model: "llama-3.1-8b-instant", temperature: 0.6, response_format: { type: "json_object" }
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
      model: "llama-3.1-8b-instant", temperature: 0.7, response_format: { type: "json_object" }
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
      model: "llama-3.3-70b-versatile", temperature: 0.9
    });
    let query = (g.choices[0]?.message?.content || "Dentista em São Paulo").trim().replace(/^["']|["']$/g,"");
    const resp = await fetch("https://google.serper.dev/places", {
      method:"POST", headers:{"X-API-KEY":process.env.SERPER_API_KEY,"Content-Type":"application/json"},
      body: JSON.stringify({ q:query, gl:"br", hl:"pt-br" })
    });
    const data = JSON.parse(await resp.text());
    const places = data.places || [];
    await ensureAuth();
    const existing = new Set((await getDocs(collection(db,"generated_sites"))).docs.map(d=>d.id));
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
        model:"llama-3.1-8b-instant", temperature:0.7, response_format:{ type:"json_object" }
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
        model:"llama-3.1-8b-instant", temperature:0.7, response_format:{ type:"json_object" }
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
        model:"llama-3.3-70b-versatile", temperature:0.5, response_format:{ type:"json_object" }
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
  await setDoc(doc(db, "generated_sites", projectId), siteRecord, { merge: true });
  console.log(`[AUTO_BUILD] Protótipo criado na coleção generated_sites com ID: ${projectId}`);

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
  await setDoc(doc(db, "proposals", proposalId), proposalDoc, { merge: true });
  console.log(`[AUTO_BUILD] Proposta criada na coleção proposals com ID: ${proposalId}`);

  return siteRecord;
}


async function runAutoBuildPipeline() {
  console.log("[AUTO_BUILD] Pipeline iniciado...");
  if (!process.env.SERPER_API_KEY || !process.env.GROQ_API_KEY) return { error: "missing_keys" };
  await ensureAuth();
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const batchSnap = await getDocs(collection(db, "auto_build_queue"));
  const batches = batchSnap.docs.map(d => ({ id: d.id, ...d.data() } as any)).filter(b => b.status !== "completed" && b.status !== "failed").sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  let batch, batchId;

  if (batches.length === 0) {
    console.log("[AUTO_BUILD] Novo lote...");
    batchId = "batch_" + Date.now();
    const leads = [];
    const niches = ["Clínica Odontológica em São Paulo","Arquiteto em Curitiba","Contabilidade em Belo Horizonte","Academia em Porto Alegre","dentist in New York"];
    const gls = ["br","br","br","br","us"];
    const hls = ["pt-br","pt-br","pt-br","pt-br","en"];
    const existingNames = new Set((await getDocs(collection(db,"generated_sites"))).docs.map(d => d.data().companyName?.toLowerCase().trim()));
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
    batch = { status:"in_progress", createdAt:Date.now(), totalLeads:leads.length, processedLeads:0, leads };
    await setDoc(doc(db,"auto_build_queue",batchId), batch);
  } else {
    batch = batches[0];
    batchId = batch.id;
  }

  const leadsArr = batch.leads || [];
  const idx = leadsArr.findIndex(l => l.status === "pending");
  if (idx === -1) {
    await updateDoc(doc(db,"auto_build_queue",batchId), { status:"completed" });
    return { status:"completed", batchId };
  }

  const lead = leadsArr[idx];
  console.log("[AUTO_BUILD] Processando " + lead.title);

  try {
    if (!lead.reports) {
      const r1 = await groq.chat.completions.create({
        messages: [{ role:"system", content:"JSON válido" }, { role:"user", content:`Psicografia para ${lead.title} (${lead.niche}). JSON: { doresETraumas, desejosProfundos, objecoesEBarreiras, niveisDeConsciencia, avatares }`}],
        model:"llama-3.1-8b-instant", temperature:0.7, response_format:{ type:"json_object" }
      });
      const r2 = await groq.chat.completions.create({
        messages: [{ role:"system", content:"JSON válido" }, { role:"user", content:`Análise Estratégica para ${lead.title} (${lead.niche}). JSON: { benchmarking, gapsDeMercado, vantagensCompetitivas, oceanoAzul, filtroDeComunicacao }`}],
        model:"llama-3.1-8b-instant", temperature:0.7, response_format:{ type:"json_object" }
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
      await setDoc(doc(db, "generated_sites", sitePid), siteRecord, { merge: true });
    }

    leadsArr[idx] = lead;
    const processed = leadsArr.filter(l => l.status !== "pending").length;
    await updateDoc(doc(db,"auto_build_queue",batchId), { leads: leadsArr, processedLeads: processed, lastProcessedAt: Date.now() });
    return { status: lead.status, batchId, lead: lead.title };
  } catch(e) {
    lead.status = "failed";
    lead.error = e.message;
    leadsArr[idx] = lead;
    await updateDoc(doc(db,"auto_build_queue",batchId), { leads: leadsArr });
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
    const snap = await getDocs(collection(db, "jobs"));
    const jobs = snap.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        title: data.title || "Vaga de Marketing",
        company: data.company || "Não informada",
        snippet: data.snippet || "",
        link: data.link || "",
        role: data.role || "Não informada",
        status: data.status || "Pendente",
        emailContato: data.emailContato || null,
        createdAt: data.createdAt || 0
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
      model: "llama-3.3-70b-versatile", temperature: 0.8, response_format: { type: "json_object" }
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
      model: "llama-3.3-70b-versatile", temperature: 0.8, response_format: { type: "json_object" }
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
    const leads = await sbFetch("/leads?select=*&order=criado_em.desc");
    res.json({ success: true, leads: leads || [] });
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

    await ensureAuth();
    const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;
    const existing = new Set((await getDocs(collection(db,"generated_sites"))).docs.map(d=>d.id));
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

// --- Generated Sites ---
app.get("/api/generated-sites", async (req, res) => {
  try {
    await ensureAuth();
    const sitesSnap = await getDocs(collection(db, "generated_sites"));
    const sites = sitesSnap.docs.map(d => ({ projectId: d.id, ...d.data() }));
    res.json({ success: true, data: sites });
  } catch(e) { res.json({ success: true, data: [] }); }
});

app.put("/api/generated-sites/:projectId/status", async (req, res) => {
  try {
    await ensureAuth();
    const { projectId } = req.params;
    const { status } = req.body;
    await updateDoc(doc(db, "generated_sites", projectId), { status, updatedAt: Date.now() });
    res.json({ success: true });
  } catch(e) { res.status(500).json({ success: false, error: e.message }); }
});

app.post("/api/generated-sites/:projectId/mark-viewed", async (req, res) => {
  try {
    await ensureAuth();
    const { projectId } = req.params;
    await updateDoc(doc(db, "generated_sites", projectId), { viewed: true, viewedAt: Date.now() });
    res.json({ success: true });
  } catch(e) { res.status(500).json({ success: false, error: e.message }); }
});

app.delete("/api/generated-sites/:projectId", async (req, res) => {
  try {
    await ensureAuth();
    const { projectId } = req.params;
    await deleteDoc(doc(db, "generated_sites", projectId));
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

// Dispara o Workflow B do n8n para gerar site-amostra + PDF + link de pagamento.
// Busca dados completos do lead no Firestore e repassa ao n8n via webhook.
app.post("/api/gerar-proposta", async (req, res) => {
  try {
    const { leadId } = req.body;
    if (!leadId) return res.status(400).json({ error: "leadId obrigatorio" });
    await ensureAuth();
    const leadSnap = await getDoc(doc(db, "leads", leadId));
    if (!leadSnap.exists()) return res.status(404).json({ error: "Lead nao encontrado" });
    const lead: any = { id: leadId, ...leadSnap.data() };
    const n8nHost = process.env.N8N_HOST || "https://n8n-iliw.srv1887358.hstgr.cloud";
    const resp = await fetch(`${n8nHost}/webhook/gerar-proposta`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leadId,
        nome: lead.nome,
        categoria: lead.categoria,
        cidade: lead.cidade,
        website: lead.website,
        telefone: lead.telefone,
        endereco: lead.endereco,
        rating: lead.rating,
        reviewsCount: lead.reviewsCount,
        diagnostico: lead.diagnostico || null
      })
    });
    const data = await resp.json().catch(() => ({}));
    res.status(resp.status).json(data);
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
    await ensureAuth();
    const { projectId } = req.params;
    const snap = await getDoc(doc(db, "generated_sites", projectId));
    if (snap.exists()) {
      const site = snap.data();
      if (site.deployedUrl) return res.redirect(site.deployedUrl);
      if (site.htmlUrl) return res.redirect(site.htmlUrl);
      const html = site.htmlContent || "<html><body><p>Protótipo não disponível</p></body></html>";
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.send(html);
    } else {
      res.status(404).json({ error: "Projeto não encontrado" });
    }
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Serve o site-amostra gerado pelo n8n em /proposta-{slug} (roteado via vercel.json,
// destino "/api" -> esta mesma funcao). O HTML fica salvo como TEXTO na colecao
// "propostas" do Firestore (campo indexHtml) - sem Firebase Storage. O preco vem
// como token {{PRECO_CHEIO}}/{{PRECO_OFERTA}} e e substituido pelo valor ATUAL da
// proposta aqui (pode ter mudado numa reativacao).
const PAGINA_PROPOSTA_EXPIRADA = `<!DOCTYPE html><html lang="pt-br"><head><meta charset="utf-8" /><title>Amostra expirada - Escom Studio</title><meta name="robots" content="noindex" /><style>body{font-family:Arial,Helvetica,sans-serif;background:#0b0f1a;color:#f2f2f2;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center;}a{color:#4dabf7;}</style></head><body><div><h1>Esta amostra nao esta mais disponivel</h1><p>O prazo de 3 dias para avaliacao expirou. Fale com a gente para gerar uma nova proposta.</p><p><a href="https://escomstudio.com.br">Voltar para o site da Escom Studio</a></p></div></body></html>`;
const PAGINA_PROPOSTA_NAO_ENCONTRADA = `<!DOCTYPE html><html lang="pt-br"><head><meta charset="utf-8" /><title>Proposta nao encontrada</title><meta name="robots" content="noindex" /></head><body><h1>Proposta nao encontrada</h1><p><a href="https://escomstudio.com.br">Voltar para o site da Escom Studio</a></p></body></html>`;

app.get("/proposta-:slug", async (req, res) => {
  try {
    await ensureAuth();
    const { slug } = req.params; // Express ja tira o prefixo "proposta-" (literal na rota); o slug no Firestore tambem nao tem esse prefixo.
    const propostaSnap = await getDoc(doc(db, "propostas", slug));
    if (!propostaSnap.exists()) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("X-Robots-Tag", "noindex, nofollow");
      return res.status(404).send(PAGINA_PROPOSTA_NAO_ENCONTRADA);
    }
    const proposta: any = propostaSnap.data();
    const expirou = proposta.status === "expirado" || (proposta.expiraEm ? new Date(proposta.expiraEm).getTime() < Date.now() : false);
    if (expirou && proposta.status !== "pago") {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("X-Robots-Tag", "noindex, nofollow");
      return res.status(410).send(PAGINA_PROPOSTA_EXPIRADA);
    }
    let html = proposta.indexHtml;
    if (!html) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("X-Robots-Tag", "noindex, nofollow");
      return res.status(404).send(PAGINA_PROPOSTA_NAO_ENCONTRADA);
    }
    const formatarReal = (n: number) => "R$ " + Number(n).toLocaleString("pt-BR", { minimumFractionDigits: 2 });
    if (proposta.valorCheio != null) html = html.split("{{PRECO_CHEIO}}").join(formatarReal(proposta.valorCheio));
    if (proposta.valor != null) html = html.split("{{PRECO_OFERTA}}").join(formatarReal(proposta.valor));
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    res.status(200).send(html);
  } catch (e) {
    res.status(500).send("Erro ao carregar a proposta");
  }
});

app.get("/api/proposals/:id", async (req, res) => {
  try {
    await ensureAuth();
    const { id } = req.params;
    const docSnap = await getDoc(doc(db, "proposals", id));
    if (docSnap.exists()) {
      res.json({ success: true, proposal: docSnap.data() });
    } else {
      res.status(404).json({ success: false, error: "Proposal not found" });
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// --- Build & Deploy ---
export async function generateMandatory15SectionsHtml(payload) {
  const { formData, siteData, reports, projectId } = payload;
  const pid = projectId || "site_" + Date.now();
  const name = formData?.companyName || "Empresa";
  const niche = formData?.niche || "";
  const comp = formData?.primaryHex || "#ff5a00";
  const escomColor = "#00d1ff";
  const phone = formData?.phone || "";
  const address = formData?.address || "";
  const esc = s => (s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");

  // Selecionar imagens do Unsplash dinâmicas baseadas no nicho
  const nicheLower = niche.toLowerCase();
  let imgHero = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop";
  let imgSolution = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop";
  let imgAbout = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop";

  if (nicheLower.includes("restaurante") || nicheLower.includes("comida") || nicheLower.includes("gastronomia") || nicheLower.includes("parrilla") || nicheLower.includes("churrasco") || nicheLower.includes("sushi") || nicheLower.includes("massas") || nicheLower.includes("pizzaria") || nicheLower.includes("alimento")) {
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

  // --- GROQ AI: Gerar HTML com Framework v3.0 (Site do cliente no topo, prospecção no final) ---
  const apiKey = process.env.GROQ_API_KEY || process.env.Groq_API_KEY || process.env.Groq;
  if (apiKey) {
    try {
      const groq = new Groq({ apiKey });
      const siteDataStr = JSON.stringify(siteData || {});
      const reportsStr = reports ? JSON.stringify(reports) : "não disponível";

      const prompt = `Você é um Engenheiro de Front-end Sênior, Copywriter de Elite, Especialista em UI/UX e Estrategista de Conversão da ESCOM Studio.
Sua missão é gerar o código HTML COMPLETO de uma Landing Page de altíssima conversão.

[DADOS DA EMPRESA E ESTRUTURA VISUAL]
- Nome: ${name}
- Nicho: ${niche}
- Cor primária do cliente: ${comp} (Use esta cor EXCLUSIVAMENTE nas seções do Bloco B - o site do cliente)
- Cor oficial da ESCOM Studio: ${escomColor} (Use esta cor EXCLUSIVAMENTE nas seções do Bloco A e Bloco C - prospecção no final)
- Telefone: ${phone} (Todos os CTAs do cliente devem apontar para o WhatsApp funcional dele: https://wa.me/telefone?text=mensagem)
- Endereço físico real: ${address}
- Proposta ID (para link da proposta em PDF): ${pid}
- Copy pré-gerada: ${siteDataStr}
- Relatórios de inteligência e auditoria de site existente: ${reportsStr}

[REGRAS ABSOLUTAS DE COPY]
1. É TERMINANTEMENTE PROIBIDO o uso de travessões ou meia-riscas (— ou ‐) em QUALQUER parte do texto.
2. Toda copy deve ser moldada a partir dos dados REAIS da empresa e de sua auditoria de mercado.

[STACK TÉCNICA OBRIGATÓRIA]
- Tailwind CSS via CDN: <script src="https://cdn.tailwindcss.com"></script>
- GSAP + ScrollTrigger via CDN: <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script> e <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
- Lenis Smooth Scroll: <script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"></script>
- Google Fonts: Playfair Display (títulos) + Plus Jakarta Sans (corpo)
- Font Awesome 6: <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">
- Imagens reais do Unsplash (ex: para carros use mecânica, para parrilla use carne/churrasco, etc.)

[ARQUITETURA OBRIGATÓRIA E ORDEM DE SEÇÕES: 15 SEÇÕES EM 3 BLOCOS]
O site do cliente deve vir PRIMEIRO (no topo do site) para impactar o cliente, e as seções de venda e proposta da ESCOM Studio devem vir APENAS NO FINAL.

PARTE I: SITE DA EMPRESA (BLOCO B) - ESTILO BASEADO NA COR DO CLIENTE: ${comp}
1. HERO (id="hero"): Fullscreen, imagem de destaque do Unsplash refinada com opacidade de 20% e filtro escuro. Título persuasivo (headline), subtítulo, botões CTA (primário e secundário). Animação de entrada com GSAP.
2. AGITAÇÃO DO PROBLEMA (id="problema"): Título chamativo e grid de 3 cards detalhando os problemas reais do nicho.
3. A SOLUÇÃO (id="solucao"): Layout split (texto persuasivo + imagem real do Unsplash). Lista com checkmarks dos 4 benefícios principais.
4. DIFERENCIAIS (id="diferenciais"): Grid de 4 diferenciais competitivos reais em cards com hover interativo.
5. COMO FUNCIONA (id="como-funciona"): 3 passos visuais numerados (01, 02, 03) descrevendo a jornada do cliente.
6. PROVA SOCIAL (id="depoimentos"): 3 depoimentos autênticos com foto avatar (faces do Unsplash), nome e cargo/cidade.
7. SOBRE (id="sobre"): Split layout (imagem real + texto sobre história, paixão e dedicação). Grid de 3 estatísticas relevantes.
8. FAQ (id="faq"): Accordion com 4 perguntas do nicho. JavaScript de toggle.
9. CTA FINAL (id="cta-final"): Chamada à ação urgente com botão para contato/WhatsApp do cliente.

PARTE II: PROSPECÇÃO COMERCIAL (BLOCO A) - ESTILO BASEADO NA COR DA ESCOM: ${escomColor}
10. TARJA DE URGÊNCIA (id="banner-urgencia"): Banner com gradiente animado posicionado acima do diagnóstico comercial: "Proposta exclusiva válida por 3 dias | Condições Especiais Liberadas".
11. DOSSIÊ ESTRATÉGICO (id="dossie"): Título "Dossiê de Mercado & Diagnóstico Digital", texto sobre oportunidades reais e grid de 4 cards (Score, Pontos Críticos, Oportunidades, ROI Projetado). Deve conter o botão de destaque: "Visualizar Diagnóstico Técnico em PDF" apontando para a URL "https://escom-studio.vercel.app/proposta-escom-${pid}" em nova aba.
12. INVESTIMENTO (id="investimento"): Card de preço com taxa única R$ 990, lista dos entregáveis inclusos e badge de escassez comercial.
13. EXPANSÕES TECNOLÓGICAS (id="expansoes"): Grid de módulos adicionais (CRM, Chatbot IA, Dashboard, WhatsApp Bot) com preços mensais e botões funcionais para ativar no painel.

PARTE III: PROSPECÇÃO INSTITUCIONAL (BLOCO C) - ESTILO BASEADO NA COR DA ESCOM: ${escomColor}
14. ESCOM STUDIO (id="escom"): Seção institucional com a história da agência, especialidades e badges de capacidades técnicas.
15. FOOTER + FORMULÁRIO (id="footer"): Formulário de contato para aceite do projeto, dados de contato reais e botão WhatsApp flutuante do cliente.

[REGRAS DE ESTILO]
- Tema: Dark mode luxuoso (fundo #0a0a0a, cards em glassmorphism).
- Use a cor do cliente (${comp}) apenas no Bloco B.
- Use o ciano da ESCOM (#00d1ff) nas partes II e III (Blocos A e C).
- Animações GSAP: Todos os elementos com reveal on scroll (fade-up, stagger).
- Lenis: Inicializar smooth scroll no script final com easing correto.

Retorne APENAS o código HTML completo. Comece com <!DOCTYPE html>. Sem markdown, sem explicações.`;

      const response = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "Você é um gerador de código HTML/CSS/JS de altíssimo nível. Gere APENAS código HTML puro, completo e funcional. Sem markdown. Sem explicações. Comece com <!DOCTYPE html>." },
          { role: "user", content: prompt }
        ],
        model: "llama-3.3-70b-specdec",
        temperature: 0.15,
        max_tokens: 8000
      });

      let html = response.choices[0].message.content || "";
      if (html.includes("```html")) html = html.split("```html")[1].split("```")[0].trim();
      else if (html.includes("```")) html = html.split("```")[1].split("```")[0].trim();
      html = html.trim();
      html = html.replace(/—/g, ",").replace(/–/g, ",");
      if (html.startsWith("<!DOCTYPE html>") || html.includes("<html")) return html;
    } catch (e) { console.error("[BUILD_HTML] Falha ao gerar via Groq:", e.message); }
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
    const { projectId, slug, formData, siteData, lead } = payload;
    const pid = projectId || "site_" + Date.now();
    const siteSlug = slug || pid;

    const html = await generateMandatory15SectionsHtml(payload);
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

    await ensureAuth();
    await setDoc(doc(db, "generated_sites", pid), siteRecord, { merge: true });

    res.json({ success: true, projectId: pid, deployedUrl, status: siteRecord.status });
  } catch(e) { res.status(500).json({ success: false, error: e.message }); }
});

app.post("/api/approve-site", async (req, res) => {
  try {
    const { projectId, slug } = req.body;
    if (!projectId) return res.status(400).json({ error: "projectId required" });
    await ensureAuth();
    const snap = await getDoc(doc(db, "generated_sites", projectId));
    if (!snap.exists()) return res.status(404).json({ error: "Site not found" });
    const site = snap.data();
    let deployedUrl = site.deployedUrl;
    if (!deployedUrl && site.htmlContent) {
      const siteSlug = slug || projectId;
      const dir = path.join(os.tmpdir(), "dist-deployed", siteSlug);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, "index.html"), site.htmlContent, "utf-8");
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
    await updateDoc(doc(db, "generated_sites", projectId), { status: deployedUrl ? "approved" : "failed_deploy", deployedUrl, updatedAt: Date.now() });
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
      model: "llama-3.3-70b-versatile",
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
      model: "llama-3.3-70b-versatile", temperature: 0.7, response_format: { type: "json_object" }
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
      model:"llama-3.3-70b-versatile", temperature:0.7, response_format:{ type:"json_object" }
    });
    const r2 = await groq.chat.completions.create({
      messages: [{ role:"system", content:"JSON válido" }, { role:"user", content:`Proposta Comercial para ${companyName} (${niche}). Formato JSON: { numeroProposta, data, cliente: { nome, empresa }, apresentacao, diagnostico, solucoes: [{ titulo, descricao, investimento, prazo }], investimentoTotal, condicoesPagamento, garantias, prazoExecucao, contato }`}],
      model:"llama-3.3-70b-versatile", temperature:0.7, response_format:{ type:"json_object" }
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
      model: "llama-3.3-70b-versatile",
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
  await ensureAuth();
  const snap = await getDocs(collection(db, "financas"));
  const transactions: any[] = [];
  snap.forEach(d => transactions.push(d.data()));

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
    model: "llama-3.3-70b-versatile",
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

  // Salvar no Firestore
  await setDoc(doc(db, "financas_dicas_diarias", "latest"), dicasData);
  await setDoc(doc(db, "financas_dicas_diarias", `dica_${todayStr}`), dicasData);

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
    await ensureAuth();
    const todayStr = new Date().toISOString().split("T")[0];
    const docSnap = await getDoc(doc(db, "financas_dicas_diarias", "latest"));

    if (docSnap.exists() && docSnap.data().date === todayStr) {
      return res.json({ success: true, data: docSnap.data() });
    }

    // Se não existir dica para hoje, gera uma nova na hora
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

    await setDoc(doc(db, "google_health_tokens", "admin"), docData, { merge: true });

    res.redirect("https://www.escomstudio.com.br/admin/saude");
  } catch (error) {
    console.error("Erro no callback do Google Fit:", error);
    res.status(500).send("Erro interno ao processar autenticação.");
  }
});

app.get("/api/google-health-sync", async (req, res) => {
  try {
    const tokenDoc = await getDoc(doc(db, "google_health_tokens", "admin"));
    if (!tokenDoc.exists()) {
      return res.status(400).json({ error: "Token não encontrado. Autorize primeiro." });
    }
    
    let { access_token, refresh_token, expires_at } = tokenDoc.data() as any;
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
      
      await setDoc(doc(db, "google_health_tokens", "admin"), updateData, { merge: true });
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

    // Salvar no Firestore
    const batch = writeBatch(db);
    const syncedAt = new Date().toISOString();
    let savedCount = 0;

    for (const [date, metrics] of Object.entries(dailyMetrics)) {
      delete (metrics as any)._rawSonoHours;
      (metrics as any).syncedAt = syncedAt;
      const docRef = doc(db, "health_metrics", date);
      batch.set(docRef, metrics, { merge: true });
      savedCount++;
    }

    if (savedCount > 0) {
      await batch.commit();
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
    const tokenSnap = await getDoc(doc(db, "google_health_tokens", "admin"));
    if (tokenSnap.exists()) {
      const data = tokenSnap.data() as any;
      res.json({ connected: true, lastSync: data.updatedAt || null, expiresAt: data.expires_at || null });
    } else {
      res.json({ connected: false, lastSync: null });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar status" });
  }
});

app.get("/api/health-metrics", async (req, res) => {
  try {
    const q = query(collection(db, "health_metrics"), orderBy("data", "desc"), limit(30));
    const snapshot = await getDocs(q);
    const metrics = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json({ success: true, metrics });
  } catch (error) {
    console.error("Erro ao buscar health metrics:", error);
    res.status(500).json({ success: false, error: "Erro interno" });
  }
});

app.post("/api/health-metrics", async (req, res) => {
  try {
    const { peso, gorduraCorporal, massaMagra, notas } = req.body;
    const docDate = new Date().toISOString().split('T')[0];
    
    await setDoc(doc(db, "health_metrics", docDate), {
      data: docDate,
      peso: peso || null,
      gorduraCorporal: gorduraCorporal || null,
      massaMagra: massaMagra || null,
      notas: notas || "",
      origem: "Manual",
      updatedAt: new Date().toISOString()
    }, { merge: true });
    
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
        model: "llama-3.3-70b-versatile",
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

    await setDoc(doc(db, "strava_tokens", "admin"), {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: data.expires_at,
      used_secret: data._usedSecret,
      athlete: data.athlete ? { id: data.athlete.id, name: `${data.athlete.firstname} ${data.athlete.lastname}`, profile: data.athlete.profile } : null,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    res.redirect("https://www.escomstudio.com.br/admin/saude");
  } catch (error) {
    console.error("Erro no callback Strava:", error);
    res.status(500).send("Erro interno no callback Strava.");
  }
});

app.get("/api/strava-status", async (req, res) => {
  try {
    const docSnap = await getDoc(doc(db, "strava_tokens", "admin"));
    if (docSnap.exists()) {
      const data = docSnap.data() as any;
      res.json({ connected: true, athlete: data.athlete, lastSync: data.updatedAt || null });
    } else {
      res.json({ connected: false, athlete: null });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao verificar status Strava" });
  }
});

app.get("/api/strava-sync", async (req, res) => {
  try {
    const tokenDoc = await getDoc(doc(db, "strava_tokens", "admin"));
    if (!tokenDoc.exists()) {
      return res.status(400).json({ error: "Token Strava não encontrado. Autorize primeiro." });
    }

    let { access_token, refresh_token, expires_at, used_secret } = tokenDoc.data() as any;
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
          await setDoc(doc(db, "strava_tokens", "admin"), {
            access_token,
            refresh_token: refreshData.refresh_token || refresh_token,
            expires_at,
            updatedAt: new Date().toISOString()
          }, { merge: true });
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

    const batch = writeBatch(db);
    let savedCount = 0;

    activitiesData.forEach((act: any) => {
      const actId = `strava_${act.id}`;
      const distanceKm = Number((act.distance / 1000).toFixed(2));
      const movingTimeMinutes = Math.round(act.moving_time / 60);
      const startDate = act.start_date_local ? act.start_date_local.split("T")[0] : new Date().toISOString().split("T")[0];

      const activityRecord = {
        id: actId,
        stravaId: act.id,
        nome: act.name,
        tipo: act.type,
        distanciaKm: distanceKm,
        tempoMinutos: movingTimeMinutes,
        elevacaoM: Math.round(act.total_elevation_gain || 0),
        bpmMedio: Math.round(act.average_heartrate || 0),
        bpmMax: Math.round(act.max_heartrate || 0),
        calorias: Math.round(act.calories || 0),
        data: startDate,
        syncedAt: new Date().toISOString()
      };

      const docRef = doc(db, "strava_activities", actId);
      batch.set(docRef, activityRecord, { merge: true });
      savedCount++;
    });

    if (savedCount > 0) {
      await batch.commit();
    }

    await setDoc(doc(db, "strava_tokens", "admin"), { updatedAt: new Date().toISOString() }, { merge: true });

    res.json({ success: true, count: savedCount, message: `${savedCount} atividades sincronizadas do Strava!` });
  } catch (error: any) {
    console.error("Erro na sincronização Strava:", error);
    res.status(500).json({ error: "Erro interno", details: error.message });
  }
});

// --- CONTRACTS API ---
app.get("/api/contracts", async (req, res) => {
  try {
    await ensureAuth();
    const snap = await getDocs(collection(db, "contracts"));
    let contracts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    
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
      const docRef = await addDoc(collection(db, "contracts"), defaultContract);
      contracts = [{ id: docRef.id, ...defaultContract }];
    }
    
    res.json({ success: true, contracts });
  } catch (error: any) {
    console.error("Erro ao buscar contratos:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/contracts", async (req, res) => {
  try {
    await ensureAuth();
    const contractData = {
      ...req.body,
      status: req.body.status || "ATIVO",
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, "contracts"), contractData);
    res.json({ success: true, id: docRef.id, contract: { id: docRef.id, ...contractData } });
  } catch (error: any) {
    console.error("Erro ao criar contrato:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put("/api/contracts/:id", async (req, res) => {
  try {
    await ensureAuth();
    const { id } = req.params;
    await updateDoc(doc(db, "contracts", id), {
      ...req.body,
      updatedAt: new Date().toISOString()
    });
    res.json({ success: true });
  } catch (error: any) {
    console.error("Erro ao atualizar contrato:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put("/api/contracts/:id/status", async (req, res) => {
  try {
    await ensureAuth();
    const { id } = req.params;
    const { status } = req.body;
    await updateDoc(doc(db, "contracts", id), {
      status,
      updatedAt: new Date().toISOString()
    });
    res.json({ success: true });
  } catch (error: any) {
    console.error("Erro ao atualizar status do contrato:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete("/api/contracts/:id", async (req, res) => {
  try {
    await ensureAuth();
    const { id } = req.params;
    await deleteDoc(doc(db, "contracts", id));
    res.json({ success: true });
  } catch (error: any) {
    console.error("Erro ao deletar contrato:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => { console.log("Server running on port " + PORT); });

export default app;
