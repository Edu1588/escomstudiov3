import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";
import * as cheerio from "cheerio";
import Groq from "groq-sdk";
import cron from "node-cron";

// Prevent cyclic object value crashes
const origStringify = JSON.stringify;
JSON.stringify = function(value, replacer, space) {
  try {
    return origStringify(value, replacer, space);
  } catch (err) {
    return '"[Cyclic Object]"';
  }
};

dotenv.config();

// Normalização de chaves de API devido a maiúsculas/minúsculas no Vercel
if (process.env.Groq_API_KEY && !process.env.GROQ_API_KEY) {
  process.env.GROQ_API_KEY = process.env.Groq_API_KEY;
}
if (process.env.Groq && !process.env.GROQ_API_KEY) {
  process.env.GROQ_API_KEY = process.env.Groq;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { Resend } from "resend";
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp, Timestamp, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';
import fs from 'fs';
import firebaseConfig from "./firebase-applet-config.js";

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId || '(default)');

// Server Admin Login
async function ensureAuth() {
  if (!auth.currentUser) {
    try {
      await signInWithEmailAndPassword(auth, "admin@escom.com", "Edu@1508001");
      console.log("[SERVER_AUTH] Autenticação Firebase realizada com sucesso");
    } catch(e: any) {
      console.error("[SERVER_AUTH] Falha ao autenticar o servidor no Firebase:", e.message);
    }
  }
}
ensureAuth().catch(err => console.error("Initial auth failed:", err));

function calculateLeadScore(lead: any, auditData?: any): number {
  let score = 50; // default base médio
  const titleLower = (lead.title || "").toLowerCase();
  
  // 1. Termos Corporativos / Grandes Marcas (Ignorar ou dar score mínimo)
  const corporateTerms = [
    "shopping", "hospital", "universidade", "faculdade", "prefeitura", 
    "governo", "estado", "corporation", "s.a.", "s/a", "holding", 
    "banco", "itaú", "bradesco", "santander", "unimed", "drogasil", "raia", 
    "supermercado", "carrefour", "extra", "pão de açúcar", "assai", "atacadao"
  ];
  if (corporateTerms.some(term => titleLower.includes(term))) {
    return 5; // score baixíssimo (deve ser ignorado)
  }

  // 2. Metrificação Inteligente de Porte por Avaliações (Rating Count)
  const ratingCount = lead.ratingCount || 0;
  if (ratingCount > 500) {
    score -= 20;
  } else if (ratingCount >= 20 && ratingCount <= 250) {
    // Médio porte comercial com verba de marketing
    score += 25;
  } else if (ratingCount > 0 && ratingCount < 10) {
    // Muito pequeno / informal
    score -= 10;
  }

  // 3. Website e sua qualidade
  const siteUrl = lead.website || lead.link || lead.site || "";
  if (siteUrl && siteUrl.length > 5) {
    if (auditData) {
      const issuesCount = auditData.issues?.length || 0;
      if (issuesCount >= 6) {
        // Possui site mas está cheio de problemas de conversão
        score += 20;
      } else if (issuesCount <= 2) {
        // Site já é muito bom
        score -= 30;
      } else {
        score += 5;
      }
    } else {
      score += 5;
    }
  } else {
    // Não tem site
    score += 25;
  }

  return Math.max(0, Math.min(100, score));
}

// Resend initialization (Lazy loaded for security)
const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[SECURITY_WARN] RESEND_API_KEY missing. Email delivery will skip.");
    return null;
  }
  return new Resend(apiKey);
};

async function runJobFinderCron() {
  console.log("[CRON] Running daily job finder...");
  if (!process.env.SERPER_API_KEY) {
    console.log("[CRON] No SERPER_API_KEY, skipping job finder.");
    return;
  }
  
  try {
    // 1. Clean up jobs older than 15 days
    const jobsSnap = await getDocs(collection(db, "jobs"));
    const now = Date.now();
    const fifteenDaysMs = 15 * 24 * 60 * 60 * 1000;
    let existingLinks = new Set<string>();
    let deletedCount = 0;

    for (const d of jobsSnap.docs) {
      const jobData = d.data();
      let createdAtMs = jobData.createdAt?.toMillis?.() || Date.now(); // Assume now if missing timestamp objects
      if (jobData.createdAt && typeof jobData.createdAt === 'number') {
        createdAtMs = jobData.createdAt;
      } else if (jobData.createdAt?.seconds) {
        createdAtMs = jobData.createdAt.seconds * 1000;
      }

      if (now - createdAtMs > fifteenDaysMs) {
        // Older than 15 days, remove
        await deleteDoc(d.ref);
        deletedCount++;
      } else {
        if (jobData.link) existingLinks.add(jobData.link);
      }
    }
    
    console.log(`[CRON] Deleted ${deletedCount} old jobs.`);

    // 2. Fetch new jobs (Design and AI) until ~20 are gathered
    let newJobsFound = 0;
    const queries = [
      '("web designer" OR "ui designer" OR "diretor de arte" OR "product designer") ("vagas" OR "vaga" OR "emprego") (site:gupy.io OR site:linkedin.com OR site:vagas.com.br)',
      '("engenheiro de ia" OR "inteligencia artificial" OR "machine learning") ("vagas" OR "vaga" OR "emprego") (site:gupy.io OR site:linkedin.com OR site:vagas.com.br)'
    ];
    
    for (const queryStr of queries) {
      if (newJobsFound >= 20) break;
      
      // Search
      const response = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "X-API-KEY": process.env.SERPER_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          q: queryStr,
          gl: "br",
          hl: "pt-br",
          tbs: "qdr:d15", // past 15 days
          num: 30 // try to get more at once to reach 20 new ones easily
        })
      });
      
      const txtReq1 = await response.text();
      let searchData: any = {};
      try { searchData = JSON.parse(txtReq1); } catch(e) {}
      const organicResults = searchData.organic || [];
      
      for (const r of organicResults) {
        if (newJobsFound >= 20) break;
        if (r.link && existingLinks.has(r.link)) continue; // skip already tracked
        
        let company = "Empresa não identificada";
        if (r.title && r.title.includes("-")) {
          const parts = r.title.split("-");
          company = parts[parts.length - 1].trim();
        } else if (r.title && r.title.includes("|")) {
          const parts = r.title.split("|");
          company = parts[parts.length - 1].trim();
        }
        
        const newJob = {
          title: r.title || "Vaga",
          company: company,
          snippet: r.snippet || "",
          link: r.link || "",
          status: "Pendente",
          createdAt: serverTimestamp()
        };
        
        await addDoc(collection(db, "jobs"), newJob);
        existingLinks.add(r.link);
        newJobsFound++;
      }
    }
    
    console.log(`[CRON] Saved ${newJobsFound} new jobs to history.`);
    return { deletedCount, newJobsFound };
  } catch (err) {
    console.error("[CRON] Error in job finder script:", err);
    throw err;
  }
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

function isRealJobLink(link: string): boolean {
  if (!link || link === "#") return false;
  try {
    const url = new URL(link);
    const host = url.hostname;
    const path = url.pathname;

    // Exclude generic search pages
    if (host === "portal.gupy.io" && path.startsWith("/job-search")) return false;
    if (host === "portal.gupy.io") return false;
    if (host.includes("vagas.com.br") && (path.startsWith("/vagas-de-") || path === "/" || path === "")) return false;
    if (host.includes("linkedin.com") && !path.includes("/jobs/view/")) return false;
    if (host.includes("linkedin.com") && path.includes("/posts/")) return false;

    // Keep only known job listing patterns
    const validPatterns = [
      /\.gupy\.io\/jobs\//,
      /linkedin\.com\/jobs\/view\//,
      /vagas\.com\.br\//,
      /catho\.com\.br\//,
      /indeed\.com\.br\//,
      /infojobs\.com\.br\//,
      /glassdoor\.com\.br\//,
      /solides\.com\.br\//,
      /recrut\.com\.br\//,
      /trabalhabrasil\.com\.br\//,
      /empregos\.com\.br\//,
      /bne\.com\.br\//,
      /apinfo\.com\.br\//,
    ];

    return validPatterns.some(p => p.test(link));
  } catch {
    return false;
  }
}

function extractCompany(title: string, link: string): string {
  let company = "Empresa não identificada";
  if (title) {
    // Try last segment after "-" or "|"
    const sep = title.includes("|") ? "|" : title.includes("–") ? "–" : title.includes("-") ? "-" : null;
    if (sep) {
      const parts = title.split(sep);
      const last = parts[parts.length - 1].trim();
      // Only use if it looks like a company name (not too long, not a generic word)
      if (last && last.length < 60 && !last.toLowerCase().includes("vaga") && !last.toLowerCase().includes("emprego")) {
        company = last;
      }
    }
  }
  if (company === "Empresa não identificada" && link) {
    try {
      const host = new URL(link).hostname.replace("www.", "");
      // Extract company from subdomain like "atento.gupy.io" → "Atento"
      const parts = host.split(".");
      if (parts.length >= 2 && parts[0] !== "gupy" && parts[0] !== "linkedin" && parts[0] !== "vagas") {
        company = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
      }
    } catch {}
  }
  return company;
}

function extractSalary(snippet: string, title: string): string | null {
  const text = `${snippet} ${title}`;
  const patterns = [
    /R\$\s*([\d.,]+\s*(?:mil|k)?)\s*(?:a|à|–|-|até)\s*R\$\s*([\d.,]+\s*(?:mil|k)?)/i,
    /(?:salário|remuneração|salarial|renda|faixa\s*salarial|ganhe|receba|oferecemos)\s*(?::|de)?\s*R\$\s*([\d.,]+(?:\s*(?:mil|k))?)/i,
    /R\$\s*([\d.,]+(?:\s*(?:mil|k))?)/i,
    /(\d[\d.,]*)\s*(?:a|à|–|-|até)\s*R?\$?\s*(\d[\d.,]+\s*(?:mil|k)?)/i,
  ];
  const normalize = (s: string) => {
    let v = s.toLowerCase().replace("mil", "000").replace("k", "000").replace(/\./g, "").replace(",", ".").trim();
    const n = parseFloat(v);
    return isNaN(n) ? null : n;
  };
  for (const p of patterns) {
    const m = text.match(p);
    if (m) {
      if (m[2]) {
        const min = normalize(m[1]);
        const max = normalize(m[2]);
        if (min && max) return `R$ ${min.toLocaleString("pt-BR")} - R$ ${max.toLocaleString("pt-BR")}`;
      }
      const val = normalize(m[1]);
      if (val) return `R$ ${val.toLocaleString("pt-BR")}`;
    }
  }
  return null;
}

async function runPiassaCron() {
  console.log("[PIASSA_CRON] Starting daily piassa job search...");
  if (!process.env.SERPER_API_KEY) {
    console.log("[PIASSA_CRON] No SERPER_API_KEY, skipping.");
    return { error: "No SERPER_API_KEY" };
  }

  const results: any[] = [];
  let deletedCount = 0;

  try {
    // 1. Clean up saved jobs older than 15 days
    const fifteenDaysAgo = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);
    const jobsSnap = await getDocs(collection(db, "jobs"));
    let existingLinks = new Set<string>();

    for (const d of jobsSnap.docs) {
      const jobData = d.data();
      let createdAtMs = jobData.createdAt?.toMillis?.() || Date.now();
      if (jobData.createdAt?.seconds) createdAtMs = jobData.createdAt.seconds * 1000;
      else if (typeof jobData.createdAt === 'number') createdAtMs = jobData.createdAt;

      if (Date.now() - createdAtMs > 15 * 24 * 60 * 60 * 1000) {
        await deleteDoc(d.ref);
        deletedCount++;
      } else {
        if (jobData.link) existingLinks.add(jobData.link);
      }
    }
    console.log(`[PIASSA_CRON] Deleted ${deletedCount} old jobs.`);

    // 2. Search 30 jobs: 7 roles × 2 location types = 14 queries, capped at 30 total
    const queries = [
      { q: 'vaga estrategista de marketing presencial São Paulo (site:gupy.io OR site:linkedin.com OR site:vagas.com.br)', role: 'Estrategista de Marketing' },
      { q: 'vaga estrategista de marketing remoto home office (site:gupy.io OR site:linkedin.com OR site:vagas.com.br)', role: 'Estrategista de Marketing' },
      { q: 'vaga copywriter copy presencial São Paulo (site:gupy.io OR site:linkedin.com OR site:vagas.com.br)', role: 'Copywriter' },
      { q: 'vaga copywriter copy remoto home office (site:gupy.io OR site:linkedin.com OR site:vagas.com.br)', role: 'Copywriter' },
      { q: 'vaga redator conteúdo presencial São Paulo (site:gupy.io OR site:linkedin.com OR site:vagas.com.br)', role: 'Redator' },
      { q: 'vaga redator conteúdo remoto home office (site:gupy.io OR site:linkedin.com OR site:vagas.com.br)', role: 'Redator' },
      { q: 'vaga marketing industrial presencial São Paulo (site:gupy.io OR site:linkedin.com OR site:vagas.com.br)', role: 'Marketing Industrial' },
      { q: 'vaga marketing industrial remoto home office (site:gupy.io OR site:linkedin.com OR site:vagas.com.br)', role: 'Marketing Industrial' },
      { q: 'vaga growth marketing presencial São Paulo (site:gupy.io OR site:linkedin.com OR site:vagas.com.br)', role: 'Growth Marketing' },
      { q: 'vaga growth marketing remoto home office (site:gupy.io OR site:linkedin.com OR site:vagas.com.br)', role: 'Growth Marketing' },
      { q: 'vaga redator publicitário presencial São Paulo (site:gupy.io OR site:linkedin.com OR site:vagas.com.br)', role: 'Redator Publicitário' },
      { q: 'vaga redator publicitário remoto home office (site:gupy.io OR site:linkedin.com OR site:vagas.com.br)', role: 'Redator Publicitário' },
      { q: '(especialista OR analista) funil de vendas presencial São Paulo (site:gupy.io OR site:linkedin.com OR site:vagas.com.br)', role: 'Funil de Vendas' },
      { q: '(especialista OR analista) funil de vendas remoto home office (site:gupy.io OR site:linkedin.com OR site:vagas.com.br)', role: 'Funil de Vendas' },
    ];

    let totalSaved = 0;
    for (let i = 0; i < queries.length; i++) {
      if (totalSaved >= 30) break;

      const { q, role } = queries[i];
      console.log(`[PIASSA_CRON] Batch ${i + 1}/${queries.length}: searching "${role}"...`);

      const response = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "X-API-KEY": process.env.SERPER_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          q,
          gl: "br",
          hl: "pt-br",
          tbs: "qdr:d15",
          num: 5
        })
      });

      const txt = await response.text();
      let searchData: any = {};
      try { searchData = JSON.parse(txt); } catch { }
      const organic = searchData.organic || [];

      for (const r of organic) {
        if (totalSaved >= 30) break;
        if (!r.link || existingLinks.has(r.link) || !isRealJobLink(r.link)) continue;

        const newJob = {
          title: r.title || "Vaga",
          company: extractCompany(r.title, r.link),
          snippet: r.snippet || "",
          link: r.link,
          role,
          salary: extractSalary(r.snippet || "", r.title || ""),
          status: "Pendente",
          createdAt: serverTimestamp()
        };

        await addDoc(collection(db, "jobs"), newJob);
        existingLinks.add(r.link);
        totalSaved++;
        results.push(newJob);
      }

      console.log(`[PIASSA_CRON] Batch ${i + 1} done. Total saved so far: ${totalSaved}`);

      // 2-second delay between batches (respectful to API rate limits)
      if (i < queries.length - 1 && totalSaved < 30) {
        await sleep(2000);
      }
    }

    console.log(`[PIASSA_CRON] Complete. Saved ${totalSaved} new jobs, deleted ${deletedCount} old.`);
    return { savedJobs: totalSaved, deletedCount };
  } catch (err) {
    console.error("[PIASSA_CRON] Error:", err);
    throw err;
  }
}

async function performUxAuditForLead(url: string, companyName: string, niche: string): Promise<any> {
  if (!process.env.GROQ_API_KEY) return null;
  try {
    let pageText = "";
    try {
      const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)" }});
      if (response.ok) {
         const html = await response.text();
         const $ = cheerio.load(html);
         $('script, style, nav, footer, header').remove();
         pageText = $("body").text().replace(/\s+/g, ' ').substring(0, 10000); // 10k chars
      }
    } catch (e) {
      console.warn("Could not fetch URL:", e);
    }

    // Use Groq API for Deep Audit
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    let promptText = "";
    if (pageText.length > 50) {
      promptText = `Você é um diretor sênior de UX/UI, Heurísticas e CRO. Faça uma auditoria profunda no conteúdo extraído do site (${url}):\n"${pageText}"`;
    } else {
      promptText = `Você é um diretor sênior de UX/UI, Heurísticas e CRO. O site alvo é: ${url}. Como não foi possível extrair o texto, use seu amplo conhecimento sobre esta marca ou deduza as informações com base no domínio e nome para fazer uma auditoria completa.`;
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "system", content: "You always return ONLY purely valid JSON, with absolutely NO markdown backticks." }, { role: "user", content: `${promptText}
 
Retorne APENAS um JSON válido. Não inclua Markdown.
INSTRUÇÕES CRUCIAIS DE CONTEÚDO E FORMATO:
1. No campo "summary" (Resumo Executivo):
   O texto deve ser um parágrafo analítico profissional muito detalhado identificando as principais fraquezas técnicas, cores e fontes.
   Este texto DEVE incluir referências numeradas com colchetes (ex: [1], [2], [3], [4], [5]) apontando para as partes do site onde os problemas ocorrem.
   Logo após o parágrafo (pulando uma linha), liste obrigatoriamente e de forma explícita a legenda detalhada das referências no seguinte formato exato (cada legenda iniciando com '-> '):
   -> [1] Descrição exata de qual elemento/seção possui o problema de contraste (ex: Botão principal de 'Agendar visita' e rodapé).
   -> [2] Descrição do elemento/seção com problema de tipografia (ex: Seção de diferenciais).
   -> [3] Descrição do fundo da página e texto com legibilidade fraca.
   -> [4] Descrição de títulos e parágrafos inconsistentes.
   -> [5] Descrição de problemas de navegação ou menu.

   Exemplo de formato para o campo "summary":
   "A interface do site apresenta problemas graves de contraste [1] e falta de consistência na tipografia [2]. As cores utilizadas, como #038 e #ECEFF3, não oferecem suficiente contraste com o fundo #F9FAFB, dificultando a leitura [3]. A escolha de fontes, incluindo Roboto e Montserrat, é diversa, mas não sempre aplicada de forma consistente [4]. Além disso, a navegação pode ser confusa devido à falta de uma estrutura clara [5].

   -> [1] Botão principal de 'Agendar visita' e textos de rodapé.
   -> [2] Seção de 'Nossos diferenciais' e 'Proposta pedagógica'.
   -> [3] Fundo da página e texto de 'Identidade bem definida'.
   -> [4] Títulos e parágrafos em diferentes seções.
   -> [5] Menu de navegação superior e links internos."

2. No campo "issues":
   Gere obrigatoriamente de 15 a 20 problemas distribuídos entre as abas. Garanta que CADA UMA das 5 abas (listadas no campo 'tab') receba no mínimo 3 problemas detalhados.
   A descrição ("description") e a recomendação ("recommendation") de cada problema NÃO podem ser curtas, resumidas ou genéricas. Elas devem ser extremamente explicativas, técnicas, profundas e completas, contendo no mínimo de 5 a 8 linhas de texto detalhado cada.
   Seja altamente analítico e específico:
   - Se for sobre "tipografia" ou "fontes", cite os nomes das fontes reais encontradas ou recomendadas (ex: Roboto, Montserrat, Inter, Arial, Playfair Display) e justifique tecnicamente seu impacto na legibilidade e no design system.
   - Se for sobre "cores" ou "contraste", identifique os códigos hexadecimais das cores atuais (ex: '#E5E7EB', '#1F2937') e proponha códigos de cores hexadecimais substitutos ideais para a correção (ex: '#FFFFFF' sobre '#0F172A') que atinjam a conformidade WCAG AA ou AAA.
   - A recomendação deve ser um guia técnico, passo a passo, altamente profissional e acionável.

Exemplo de formato para o array "issues" (siga este padrão de extensão e detalhe técnico para todos os problemas que gerar):
[
  {
    "category": "cores",
    "tab": "IDENTIDADE VISUAL E UI",
    "title": "Taxa de Contraste Insuficiente no Botão de Chamada Primária",
    "description": "O botão principal de ação que contém a chamada para 'Agendar Visita Técnica' utiliza texto cinza-claro na cor #D1D5DB sobre um fundo verde-limão brilhante na cor #00d1ff. Esta combinação de cores gera uma taxa de contraste cromático de apenas 1.8:1, o que viola severamente a recomendação mínima das diretrizes de acessibilidade WCAG 2.1 (seção 1.4.3), que exige no mínimo 4.5:1 para fontes normais. A consequência direta é que usuários com fadiga ocular, daltonismo ou sob incidência direta de luz solar não conseguirão ler a ação principal da página.",
    "recommendation": "Para corrigir esta falha de usabilidade e CRO, altere a cor do texto do botão primário de #D1D5DB para preto puro (#000000) ou azul-escuro profundo (#0F172A). Esta simples alteração aumentará o contraste para mais de 8.5:1, garantindo excelente legibilidade para todos os públicos e enquadrando o site nos padrões de conformidade WCAG AA. Adicione adicionalmente uma transição suave de cor de fundo (CSS transition) de #00d1ff para #22c55e em hover para enriquecer a micro-animação de feedback visual do botão."
  }
]

Formato JSON final exigido:
{ 
  "summary": "Sumário contendo as referências [1] a [5] e a legenda detalhada explicada acima.", 
  "brandAnalysis": {
    "companyName": "nome real ou deduzido",
    "niche": "nicho do mercado",
    "audience": "descrição detalhada do público alvo",
    "differentiators": "principais diferenciais (ex: preço, qualidade, exclusividade)",
    "tone": "tom de voz (ex: corporativo, jovem, luxuoso)",
    "colors": "sugestão de cores detalhada",
    "primaryHex": "# hex color (ex: #000000)"
  },
  "issues": [
    { 
      "category": "tipografia" | "cores" | "heuristica" | "vies" | "arquitetura" | "acessibilidade",
      "tab": "IDENTIDADE VISUAL E UI" | "HEURÍSTICAS DE NIELSEN" | "VIESES COGNITIVOS E PSICOLOGIA" | "ARQUITETURA DA INFORMAÇÃO" | "ACESSIBILIDADE E INCLUSÃO",
      "title": "Nome focado no problema.",
      "description": "Explicação técnica super detalhada de 5 a 8 linhas incluindo cores hexadecimais ou fontes específicas afetadas.",
      "recommendation": "Passo a passo de correção detalhado de 5 a 8 linhas contendo ações específicas e hexadecimais/fontes recomendadas."
    }
  ]
}`}],
      model: "llama-3.3-70b-versatile",
      temperature: 0.6,
      response_format: { type: "json_object" }
    });

    return JSON.parse(chatCompletion.choices[0].message.content || "{}");
  } catch (error) {
    console.error(`[UX_AUDIT] Error auditing lead ${companyName}:`, error);
    return null;
  }
}

async function generateProspectSitePlanForLead(companyName: string, niche: string): Promise<any> {
  if (!process.env.GROQ_API_KEY) return null;
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You always return ONLY purely valid JSON, with absolutely NO markdown backticks." },
        { role: "user", content: `Você é Edu Santos, especialista em design de landing pages e conversão. Crie um plano estratégico de prospecção de site (para venda de Landing Page) para a empresa "${companyName}" do nicho "${niche}" que atualmente não possui site.
        
        Retorne ESTRITAMENTE um JSON no seguinte formato:
        {
          "summary": "Explicação persuasiva de por que este nicho precisa de um site e o custo de oportunidade de estar offline no mercado hoje.",
          "colors": "Sugestão de paleta de cores adequada para o nicho (ex: verde e preto para fintech, azul para saúde).",
          "tone": "Tom de voz recomendado para a marca.",
          "differentiators": "3 diferenciais de conversão que a marca deve destacar.",
          "sections": [
            { "title": "Nome da Seção (ex: Hero, Depoimentos, etc)", "description": "Roteiro de copy e elementos visuais persuasivos recomendados para esta seção." }
          ]
        }
        Gere pelo menos 5 seções estratégicas.` }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    return JSON.parse(chatCompletion.choices[0].message.content || "{}");
  } catch (error) {
    console.error(`[SITE_PLAN] Error generating site plan for ${companyName}:`, error);
    return null;
  }
}

async function runMineraLeadsCron() {
  console.log("[CRON] Running daily Mineração de Sites finder at 6 AM...");
  if (!process.env.SERPER_API_KEY || !process.env.GROQ_API_KEY) {
    console.log("[CRON] No SERPER_API_KEY or GROQ_API_KEY, skipping MineraLeads.");
    return;
  }
  
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "Você é um analista de marketing. Seu objetivo é encontrar pequenas empresas e profissionais locais no Brasil que POSSAM PRECISAR de um novo site ou landing page. NUNCA busque por agências de marketing, agências de publicidade, desenvolvedores, empresas de software ou 'criação de sites'." },
        { role: "user", content: "Gere apenas uma frase curta de busca para o Google (apenas o texto) focada em comércios físicos, consultórios, lojas ou prestadores de serviço tradicionais (ex: dentista, arquitetura, restaurante, contabilidade, medicos, padaria, oficinas, corretores) em uma cidade brasileira (capitais ou cidades de médio porte). Seja diversificado para não repetir. Exemplo: 'Clínica Odontológica em Curitiba'. Retorne EXATAMENTE APENAS a frase da busca, sem mais nenhum texto e sem aspas." }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.9,
    });

    let query = chatCompletion.choices[0]?.message?.content?.trim() || "Dentista em São Paulo";
    query = query.replace(/^["']|["']$/g, '');
    
    console.log("[CRON] Mineração Query Generated:", query);

    const response = await fetch("https://google.serper.dev/places", {
      method: "POST",
      headers: {
        "X-API-KEY": process.env.SERPER_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        q: query,
        gl: "br",
        hl: "pt-br"
      })
    });
    
    const txtReq2 = await response.text();
    let searchData: any = {};
    try { searchData = JSON.parse(txtReq2); } catch(e) {}
    const placesResults = searchData.places || [];

    // Filtros corporativos: evitar grandes corporações/shoppings/marcas nacionais
    const corporateTerms = ["shopping", "hospital", "universidade", "faculdade", "prefeitura", "corporation", "s.a.", "rede", "governo", "estado", "federativo"];
    const filteredResults = placesResults.filter((r: any) => {
      const titleLower = (r.title || "").toLowerCase();
      const hasPhone = !!r.phoneNumber && r.phoneNumber.trim() !== "";
      const isCorporate = corporateTerms.some(term => titleLower.includes(term));
      return hasPhone && !isCorporate;
    });

    await ensureAuth();
    const querySnapshot = await getDocs(collection(db, "leads"));
    const existingLeads = new Set(querySnapshot.docs.map(doc => doc.id));

    // Queremos minerar 30 leads
    let addedCount = 0;
    const leadsAdded = [];

    for (const r of filteredResults) {
      if (addedCount >= 30) break;
      const placeId = (r.cid || r.placeId || Date.now().toString()).toString();
      
      if (!existingLeads.has(placeId)) {
        const siteUrl = r.website || r.link || "";
        let auditData = null;
        let sitePlan = null;
        const companyName = r.title || "Empresa não identificada";

        if (siteUrl && siteUrl.length > 5) {
          // Lead possui site -> Aplicar auditoria automatizada de UX
          console.log(`[CRON] Auditing website for: ${companyName} (${siteUrl})`);
          auditData = await performUxAuditForLead(siteUrl, companyName, query);
        } else {
          // Lead não possui site -> Gerar plano estratégico de prospecção
          console.log(`[CRON] Generating prospecting site plan for: ${companyName}`);
          sitePlan = await generateProspectSitePlanForLead(companyName, query);
        }

        const calculatedScore = calculateLeadScore({ title: companyName, ratingCount: r.ratingCount, website: siteUrl }, auditData);
        
        // Ignora se o score for muito baixo (ex: < 30) para evitar encher a planilha com leads inviáveis
        if (calculatedScore < 30) {
          console.log(`[CRON] Lead ${companyName} ignored due to low score: ${calculatedScore}`);
          continue;
        }

        // Intervalo de 5 segundos a cada lead para não estourar a rede
        await new Promise(resolve => setTimeout(resolve, 5000));

        await setDoc(doc(db, "leads", placeId), {
          title: companyName,
          address: r.address || "Sem endereço",
          phone: r.phoneNumber || "Sem telefone",
          website: siteUrl,
          rating: r.rating || 0,
          ratingCount: r.ratingCount || 0,
          placeId: placeId,
          status: 'pending',
          niche: query,
          auditData: auditData,
          sitePlan: sitePlan,
          score: calculatedScore,
          createdAt: Date.now()
        });

        addedCount++;
        leadsAdded.push(placeId);
        existingLeads.add(placeId);
      }
    }
    
    console.log(`[CRON] Mined and analyzed ${addedCount} leads for query: ${query}`);
    return { query, count: addedCount, leadsAdded };
  } catch (error) {
    console.error("[CRON] Error in minera leads cron:", error);
    throw error;
  }
}

async function runProposalMonitoringJob() {
  console.log("[MONITORING] Iniciando monitoramento de propostas...");
  try {
    await ensureAuth();
    const querySnapshot = await getDocs(collection(db, "proposals"));
    const now = Date.now();
    const oneDayMs = 1 * 24 * 60 * 60 * 1000;
    const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
    
    let sheetsCount = 0;
    let expiredCount = 0;
    
    for (const d of querySnapshot.docs) {
      const proposal = d.data();
      const slug = d.id;
      
      if (proposal.status !== "pendente") {
        continue;
      }
      
      let createdAtMs = 0;
      if (proposal.createdAt) {
        createdAtMs = new Date(proposal.createdAt).getTime();
      } else {
        continue;
      }
      
      const timeDiff = now - createdAtMs;
      
      // 1. Verificação de Expiração (3 dias)
      if (timeDiff >= threeDaysMs) {
        console.log(`[MONITORING] Proposta ${slug} expirou (passou de 3 dias). Atualizando status...`);
        const docRef = doc(db, "proposals", slug);
        await updateDoc(docRef, { status: "expirado" });
        expiredCount++;
        continue;
      }
      
      // 2. Verificação de Integração Sheets (1 dia)
      if (timeDiff >= oneDayMs) {
        if (proposal.sentToSheets === true) {
          continue;
        }
        
        console.log(`[MONITORING] Proposta ${slug} está pendente há mais de 1 dia. Enviando para o Google Sheets...`);
        
        const pageUrl = `https://escom-studio.vercel.app/${slug}`;
        const pdfUrl = `https://escom-studio.vercel.app/${slug}?download=pdf`;
        
        const payload = {
          name: proposal.clientName || "Cliente",
          email: proposal.email || "Não informado",
          whatsapp: proposal.phone || "Não informado",
          pageUrl: pageUrl,
          pdfUrl: pdfUrl,
          status: "entrar em contato",
          company: proposal.company || "Empresa",
          createdAt: proposal.createdAt,
          timePendingDays: Math.floor(timeDiff / (24 * 60 * 60 * 1000))
        };
        
        const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
        if (webhookUrl && webhookUrl.startsWith("http")) {
          try {
            const res = await fetch(webhookUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
            });
            if (res.ok) {
              console.log(`[MONITORING] Sucesso ao enviar webhook para proposta ${slug}`);
            } else {
              console.error(`[MONITORING] Erro no webhook da planilha para ${slug}: ${res.statusText}`);
            }
          } catch (webhookErr: any) {
            console.error(`[MONITORING] Falha ao enviar webhook para ${slug}:`, webhookErr.message);
          }
        } else {
          console.warn("[MONITORING] Variável GOOGLE_SHEETS_WEBHOOK_URL ausente ou inválida. Simulando envio no log:", payload);
        }
        
        const docRef = doc(db, "proposals", slug);
        await updateDoc(docRef, { sentToSheets: true });
        sheetsCount++;
      }
    }
    
    console.log(`[MONITORING] Concluído. Expiradas: ${expiredCount}, Enviadas ao Sheets: ${sheetsCount}`);
    return { sheetsCount, expiredCount };
  } catch (err) {
    console.error("[MONITORING] Erro no monitoramento de propostas:", err);
    throw err;
  }
}

function initCronJobs() {
  console.log("[CRON] Initializing CRON jobs");
  cron.schedule('0 8 * * *', async () => {
    await runJobFinderCron();
  });
  cron.schedule('0 6 * * *', async () => {
    await runMineraLeadsCron();
  });
  cron.schedule('0 7 * * *', async () => {
    await runProposalMonitoringJob().catch(err => console.error("[CRON_ERROR] Monitoring failed:", err));
  });
}

const app = express();
const PORT = Number(process.env.PORT) || 3000;

initCronJobs();

app.use(cors());
app.use(express.json());

app.get("/api/trigger-cron", async (req, res) => {
  try {
    const result = await runJobFinderCron();
    res.json({ success: true, result });
  } catch (err: any) {
    console.error(err);
    fs.writeFileSync("cron-error.txt", err.stack || err.toString());
    res.status(500).json({ success: false, error: "Failed to run cron" });
  }
});

app.get("/api/piassa-cron", async (req, res) => {
  try {
    const result = await runPiassaCron();
    res.json({ success: true, ...result });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/trigger-minera", async (req, res) => {
  try {
    const result = await runMineraLeadsCron();
    res.json({ success: true, result });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/trigger-monitoring", async (req, res) => {
  try {
    const result = await runProposalMonitoringJob();
    res.json({ success: true, result });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Secure API Route for Contact Form
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    
    // 1. Validation (Secure SDLC)
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: "VALIDATION_FAILED", 
        message: "Campos obrigatórios ausentes." 
      });
    }

    // Save Lead to Firebase
    let leadId = null;
    try {
      const docRef = await addDoc(collection(db, 'leads'), { name, email, phone: phone || null, message, status: 'novo', origem: 'Site', createdAt: serverTimestamp() });
      leadId = docRef.id;
    } catch (err) { console.error("Firebase save lead error:", err); }

    // 2. Email Sending via Resend
    const resendClient = getResend();
    
    if (resendClient) {
      await resendClient.emails.send({
        from: "ESCOM <onboarding@resend.dev>", // Default for free accounts, use your domain once verified
        to: process.env.CONTACT_RECEIVER_EMAIL || "es.comunicacao@outlook.com",
        subject: `[PROJETO_NOVO] ${name.toUpperCase()}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #111;">
            <h2 style="border-bottom: 1px solid #eee; padding-bottom: 10px;">SOLICITAÇÃO DE PROJETO</h2>
            <p><strong>NOME:</strong> ${name}</p>
            <p><strong>EMAIL:</strong> ${email}</p>
            <p><strong>WHATSAPP:</strong> ${phone || 'NÃO INFORMADO'}</p>
            <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 8px;">
              <p><strong>MENSAGEM:</strong></p>
              <p>${message.replace(/\n/g, '<br>')}</p>
            </div>
            <p style="margin-top: 20px; font-size: 10px; color: #999;">PROTOCOLO: ${Date.now()}</p>
          </div>
        `,
        replyTo: email
      });
      console.log(`[SECURE_API] Email sent via Resend from ${email}`);
    } else {
      console.log(`[DEMO_MODE] Data received but not sent (missing RESEND_API_KEY):`, { name, email });
    }
    
    res.status(200).json({ 
      success: true, 
      message: "Dados transmitidos com sucesso via Resend.",
      protocol: `ESCOM-${Date.now().toString().slice(-6)}`
    });

  } catch (error) {
    console.error("[CRITICAL_API_ERROR]", error);
    res.status(500).json({ 
      error: "INTERNAL_SERVER_ERROR", 
      message: "Falha na comunicação segura. Tente novamente." 
    });
  }
});

app.post("/api/generate-copy", async (req, res) => {
  try {
    const { promptText, jsonMode } = req.body;
    if (!promptText) return res.status(400).json({ error: "Prompt is required" });
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: "GROQ_API_KEY is not configured in .env" });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const payload: any = {
      messages: [
        { role: "system", content: "Você é um Copywriter Sênior de Resposta Direta, Head de Growth e Diretor de Arte." + (jsonMode ? " RETORNE APENAS JSON VALIDO." : "") },
        { role: "user", content: promptText }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
    };

    if (jsonMode) payload.response_format = { type: "json_object" };

    const chatCompletion = await groq.chat.completions.create(payload);

    res.json({ success: true, text: chatCompletion.choices[0]?.message?.content || "" });
  } catch (error) {
    console.error("GROQ API Error:", error);
    res.status(500).json({ error: "Erro ao gerar copy" });
  }
});

// UX ANALYZER API
app.post("/api/analyze-ux", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: "GROQ_API_KEY is not configured in .env" });
    }

    let pageText = "";
    try {
      const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)" }});
      if (response.ok) {
         const html = await response.text();
         const $ = cheerio.load(html);
         $('script, style, nav, footer, header').remove();
         pageText = $("body").text().replace(/\s+/g, ' ').substring(0, 10000); // 10k chars
      }
    } catch (e) {
      console.warn("Could not fetch URL:", e);
    }

    // Use Groq API for Deep Audit
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    let promptText = "";
    const heuristicsRules = `\n\nOBRIGATÓRIO: Sua análise deve focar e penalizar severamente os seguintes 8 problemas críticos:
1. Bagunça visual e excesso de estímulos: Cores conflitantes, fundos poluídos que embaralham letras e mistura de fontes/tamanhos.
2. Layout desorganizado e navegação confusa: Efeito "labirinto", espaços desproporcionais, desalinhamento de produtos e mudanças de largura.
3. Excesso de texto e falta de apelo visual: Aspecto de "planilha de estoque" ou "lista jogada", ignorando o desejo de ver o produto.
4. Imagens inadequadas, amadoras ou sem contexto: Produtos fora de uso (ex: joias sem humanos), fotos amadoras (fios no chão), fundos repetidos.
5. Falta de clareza imediata: Incapacidade de entender a proposta de valor nos 3 primeiros segundos.
6. Má experiência em dispositivos móveis e lentidão: Falta de adaptação para telas pequenas (fotos espremidas, texto longo) e lentidão.
7. Oportunidades de venda desperdiçadas: Falta de categorias claras, ausência de cross-sell e sem avaliações visíveis.
8. Falta de mecanismos essenciais para conversão: Ausência de botões de compra/conversão e uso de contatos defasados (fax/telefone fixo).`;

    if (pageText.length > 50) {
      promptText = `Você é um diretor sênior de UX/UI, Heurísticas e CRO. Faça uma auditoria profunda no conteúdo extraído do site (${url}):\n"${pageText}"` + heuristicsRules;
    } else {
      promptText = `Você é um diretor sênior de UX/UI, Heurísticas e CRO. O site alvo é: ${url}. Como não foi possível extrair o texto, use seu amplo conhecimento sobre esta marca ou deduza as informações com base no domínio e nome para fazer uma auditoria completa.` + heuristicsRules;
    }

    const stream = await groq.chat.completions.create({
      messages: [{ role: "system", content: "You always return ONLY purely valid JSON, with absolutely NO markdown backticks." }, { role: "user", content: `${promptText}
 
Retorne APENAS um JSON válido. Não inclua Markdown.
INSTRUÇÕES CRUCIAIS DE CONTEÚDO E FORMATO:
1. No campo "summary" (Resumo Executivo):
   O texto deve ser um parágrafo analítico profissional muito detalhado identificando as principais fraquezas técnicas, cores e fontes.
   Este texto DEVE incluir referências numeradas com colchetes (ex: [1], [2], [3], [4], [5]) apontando para as partes do site onde os problemas ocorrem.
   Logo após o parágrafo (pulando uma linha), liste obrigatoriamente e de forma explícita a legenda detalhada das referências no seguinte formato exato (cada legenda iniciando com '-> '):
   -> [1] Descrição exata de qual elemento/seção possui o problema de contraste (ex: Botão principal de 'Agendar visita' e rodapé).
   -> [2] Descrição do elemento/seção com problema de tipografia (ex: Seção de diferenciais).
   -> [3] Descrição do fundo da página e texto com legibilidade fraca.
   -> [4] Descrição de títulos e parágrafos inconsistentes.
   -> [5] Descrição de problemas de navegação ou menu.

   Exemplo de formato para o campo "summary":
   "A interface do site apresenta problemas graves de contraste [1] e falta de consistência na tipografia [2]. As cores utilizadas, como #038 e #ECEFF3, não oferecem suficiente contraste com o fundo #F9FAFB, dificultando a leitura [3]. A escolha de fontes, incluindo Roboto e Montserrat, é diversa, mas não sempre aplicada de forma consistente [4]. Além disso, a navegação pode ser confusa devido à falta de uma estrutura clara [5].

   -> [1] Botão principal de 'Agendar visita' e textos de rodapé.
   -> [2] Seção de 'Nossos diferenciais' e 'Proposta pedagógica'.
   -> [3] Fundo da página e texto de 'Identidade bem definida'.
   -> [4] Títulos e parágrafos em diferentes seções.
   -> [5] Menu de navegação superior e links internos."

2. No campo "issues":
   Gere obrigatoriamente de 15 a 20 problemas distribuídos entre as abas. Garanta que CADA UMA das 5 abas (listadas no campo 'tab') receba no mínimo 3 problemas detalhados.
   A descrição ("description") e a recomendação ("recommendation") de cada problema NÃO podem ser curtas, resumidas ou genéricas. Elas devem ser extremamente explicativas, técnicas, profundas e completas, contendo no mínimo de 5 a 8 linhas de texto detalhado cada.
   Seja altamente analítico e específico:
   - Se for sobre "tipografia" ou "fontes", cite os nomes das fontes reais encontradas ou recomendadas (ex: Roboto, Montserrat, Inter, Arial, Playfair Display) e justifique tecnicamente seu impacto na legibilidade e no design system.
   - Se for sobre "cores" ou "contraste", identifique os códigos hexadecimais das cores atuais (ex: '#E5E7EB', '#1F2937') e proponha códigos de cores hexadecimais substitutos ideais para a correção (ex: '#FFFFFF' sobre '#0F172A') que atinjam a conformidade WCAG AA ou AAA.
   - A recomendação deve ser um guia técnico, passo a passo, altamente profissional e acionável.

Exemplo de formato para o array "issues" (siga este padrão de extensão e detalhe técnico para todos os problemas que gerar):
[
  {
    "category": "cores",
    "tab": "IDENTIDADE VISUAL E UI",
    "title": "Taxa de Contraste Insuficiente no Botão de Chamada Primária",
    "description": "O botão principal de ação que contém a chamada para 'Agendar Visita Técnica' utiliza texto cinza-claro na cor #D1D5DB sobre um fundo verde-limão brilhante na cor #00d1ff. Esta combinação de cores gera uma taxa de contraste cromático de apenas 1.8:1, o que viola severamente a recomendação mínima das diretrizes de acessibilidade WCAG 2.1 (seção 1.4.3), que exige no mínimo 4.5:1 para fontes normais. A consequência direta é que usuários com fadiga ocular, daltonismo ou sob incidência direta de luz solar não conseguirão ler a ação principal da página.",
    "recommendation": "Para corrigir esta falha de usabilidade e CRO, altere a cor do texto do botão primário de #D1D5DB para preto puro (#000000) ou azul-escuro profundo (#0F172A). Esta simples alteração aumentará o contraste para mais de 8.5:1, garantindo excelente legibilidade para todos os públicos e enquadrando o site nos padrões de conformidade WCAG AA. Adicione adicionalmente uma transição suave de cor de fundo (CSS transition) de #00d1ff para #22c55e em hover para enriquecer a micro-animação de feedback visual do botão."
  }
]

Formato JSON final exigido:
{ 
  "summary": "Sumário contendo as referências [1] a [5] e a legenda detalhada explicada acima.", 
  "brandAnalysis": {
    "companyName": "nome real ou deduzido",
    "niche": "nicho do mercado",
    "audience": "descrição detalhada do público alvo",
    "differentiators": "principais diferenciais (ex: preço, qualidade, exclusividade)",
    "tone": "tom de voz (ex: corporativo, jovem, luxuoso)",
    "colors": "sugestão de cores detalhada",
    "primaryHex": "# hex color (ex: #000000)"
  },
  "issues": [
    { 
      "category": "tipografia" | "cores" | "heuristica" | "vies" | "arquitetura" | "acessibilidade",
      "tab": "IDENTIDADE VISUAL E UI" | "HEURÍSTICAS DE NIELSEN" | "VIESES COGNITIVOS E PSICOLOGIA" | "ARQUITETURA DA INFORMAÇÃO" | "ACESSIBILIDADE E INCLUSÃO",
      "title": "Nome focado no problema.",
      "description": "Explicação técnica super detalhada de 5 a 8 linhas incluindo cores hexadecimais ou fontes específicas afetadas.",
      "recommendation": "Passo a passo de correção detalhado de 5 a 8 linhas contendo ações específicas e hexadecimais/fontes recomendadas."
    }
  ]
}`}],
      model: "llama-3.3-70b-versatile",
      temperature: 0.6,
      response_format: { type: "json_object" },
      stream: true
    });

    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        res.write(content);
      }
    }
    res.end();
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to analyze UX" });
    } else {
      res.end();
    }
  }
});

// MAPS LEAD FINDER API
app.post("/api/maps-leads", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Query is required" });
    if (!process.env.SERPER_API_KEY) {
       return res.status(500).json({ error: "SERPER_API_KEY is not configured in .env" });
    }

    // Search Google Maps using Serper
    const response = await fetch("https://google.serper.dev/places", {
      method: "POST",
      headers: {
        "X-API-KEY": process.env.SERPER_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        q: query,
        gl: "br",
        hl: "pt-br"
      })
    });
    
    const textResponse = await response.text();
    let searchData: any = {};
    try { searchData = JSON.parse(textResponse); } catch(e) {}
    const placesResults = searchData.places || [];

    await ensureAuth();
    // Salvar na Planilha (Firebase Leads) e evitar repetição
    const querySnapshot = await getDocs(collection(db, "leads"));
    const existingLeads = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    const returnedLeads = [];
    
    for (const r of placesResults) {
      const placeId = (r.cid || r.placeId || Date.now().toString()).toString();
      
      const score = calculateLeadScore({ title: r.title, ratingCount: r.ratingCount, website: r.website || r.link });

      // Ignora de forma robusta se for corporação muito grande (score muito baixo)
      if (score < 20) continue;

      const newLeadItem = {
        id: placeId,
        title: r.title || "Empresa não identificada",
        address: r.address || "Sem endereço",
        phone: r.phoneNumber || "Sem telefone",
        website: r.website || r.link || "",
        rating: r.rating || 0,
        ratingCount: r.ratingCount || 0,
        placeId: placeId,
        status: 'pending',
        score: score
      };
      returnedLeads.push(newLeadItem);
    }
    
    // Sort so highest score comes first
    returnedLeads.sort((a, b) => (b.score || 0) - (a.score || 0));

    res.json({ 
      success: true, 
      data: returnedLeads
    });

  } catch (error) {
    console.error("Maps Leads Error:", error);
    res.status(500).json({ error: "Failed to search maps" });
  }
});

// LEAD FINDER API
app.post("/api/find-leads", async (req, res) => {
  try {
    const { niche } = req.body;
    if (!niche) return res.status(400).json({ error: "Niche query is required" });
    if (!process.env.SERPER_API_KEY) {
       return res.status(500).json({ error: "SERPER_API_KEY is not configured in .env" });
    }

    // Search Google using Serper
    const response = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": process.env.SERPER_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        q: niche + " site:.com.br OR site:.br",
        gl: "br",
        hl: "pt-br",
        num: 10
      })
    });
    
    const txtReq2 = await response.text();
    let searchData: any = {};
    try { searchData = JSON.parse(txtReq2); } catch(e) {}
    const organicResults = searchData.organic || [];

    res.json({ 
      success: true, 
      data: organicResults.map((r: any) => {
        let email = "contato@empresa.com.br";
        try {
          if (r.link) {
            const urlStr = r.link.startsWith('http') ? r.link : 'https://' + r.link;
            const hostname = new URL(urlStr).hostname.replace('www.', '');
            email = "contato@" + hostname;
          }
        } catch (urlErr) {
          console.warn("Falha ao analisar URL para email:", r.link, urlErr);
        }

        return {
          title: r.title,
          snippet: r.snippet,
          link: r.link,
          email: email
        };
      })
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to search leads" });
  }
});

// GENERATE PROSPECT TEXT API
app.post("/api/generate-prospect-text", async (req, res) => {
  try {
     const { siteInfo } = req.body;
     if (!process.env.GROQ_API_KEY) {
       return res.status(500).json({ error: "GROQ_API_KEY is not configured in .env" });
     }
     const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
     const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "user", content: `Você é Edu Santos, especialista em design da ES COM Creative Studio.
Escreva um email de prospecção frio personalizado (em português do Brasil) para a empresa:
${JSON.stringify(siteInfo)}

Siga RIGOROSAMENTE as seguintes diretrizes:
1. Tom de voz humano, natural, amigável e prestativo. Evite formalidades corporativas e termos robóticos.
2. Inicie avisando de forma sutil que o site deles parece estar fora do ar ou com problemas como gancho.
3. Mencione que fez um protótipo visual de sugestão sem compromisso.
4. Use os placeholders: [Link para o protótipo] e [Link para o dossiê].
5. Termine de forma amigável convidando para uma conversa rápida com a frase exata: "Se gostarem da proposta, o que acha de batermos um papo rápido de 15 minutos para eu te explicar como funciona a implementação?".

Exemplo de estilo a seguir:
"Assunto: O site de vocês parece estar fora do ar

Olá, pessoal.
Meu nome é Edu Santos, sou da ES COM Creative Studio.
Hoje estava pesquisando alguns escritórios da região da Paulista e acabei chegando até a Silva & Associados. Tentei acessar o site de vocês e percebi que o domínio não está respondendo.
Não sei se isso já está sendo tratado internamente ou se foi algo recente, mas achei que valia avisar.
Como trabalho há bastante tempo com sites e comunicação digital, acabei fazendo uma análise rápida da situação. Quando alguém procura um escritório no Google e encontra um site fora do ar, normalmente não tenta acessar de novo depois. A maioria simplesmente continua a pesquisa.
Enquanto olhávamos isso aqui no estúdio, surgiu a ideia de montar uma proposta visual para vocês. Fizemos um protótipo para mostrar como poderia ficar uma nova versão do site.
Segue o link:
[Link para o protótipo]
Também deixo um material que produzimos sobre presença digital para o nicho de vocês:
[Link para o dossiê]
Não existe qualquer compromisso da parte de vocês.
Se gostarem da proposta, o que acha de batermos um papo rápido de 15 minutos para eu te explicar como funciona a implementação?
Espero que o aviso seja útil.
Abraço,
Edu Santos
ES COM Creative Studio"

Retorne APENAS um objeto JSON válido: {"subject": "...", "body": "..."}`}],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        response_format: { type: "json_object" }
     });
     const result = JSON.parse(chatCompletion.choices[0].message.content || "{}");
     res.json({ success: true, data: result });
  } catch(err) {
     console.error(err);
     res.status(500).json({ error: "Failed to generate text" });
  }
});

// GENERATE PAUTAS (Instagram content ideas) API
app.post("/api/generate-pautas", async (req, res) => {
  try {
    const { mode, suggestion } = req.body;
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: "GROQ_API_KEY is not configured" });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    let userPrompt = "";
    if (mode === "auto") {
      userPrompt = `Você é um estrategista de conteúdo especializado em estética, design e tendências. Hoje é ${new Date().toLocaleDateString("pt-BR")} de 2026.

Gere EXATAMENTE 5 ideias de pautas para Instagram que estejam EM ALTA e conectem o mundo da estética, design, branding com acontecimentos mundiais atuais.

Cada pauta deve ter:
- titulo: chamada criativa principal (máximo 60 caracteres)
- descricao: parágrafo explicando o conceito, por que é relevante agora e como aplicar visualmente (máximo 200 caracteres)
- ideias_chave: array com 4 palavras-chave
- data_contexto: data ou período em que essa pauta é relevante (ex: "Junho 2026", "Julho 2026", "Durante a Copa do Mundo")
- referencias: array com 2 links reais de referência (sites, artigos, perfis reais) que embasam a pauta

Retorne APENAS JSON: { pautas: [{ titulo, descricao, ideias_chave: [], data_contexto: "", referencias: [] }] }`;
    } else if (mode === "suggest" && suggestion) {
      userPrompt = `Você é um estrategista de conteúdo. Com base nesta sugestão, gere 5 ideias de pautas criativas para Instagram focadas em estética, design e branding:

Sugestão: "${suggestion}"

Cada pauta deve ter:
- titulo: chamada criativa (máximo 60 caracteres)
- descricao: parágrafo explicando o conceito (máximo 200 caracteres)
- ideias_chave: array com 4 palavras-chave
- data_contexto: data ou período em que essa pauta é relevante
- referencias: array com 2 links reais de referência que embasam a pauta

Retorne APENAS JSON: { pautas: [{ titulo, descricao, ideias_chave: [], data_contexto: "", referencias: [] }] }`;
    } else {
      return res.status(400).json({ error: "Invalid mode or missing suggestion" });
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Você é um estrategista de conteúdo sênior para Instagram. Conhece tendências de estética, design, branding e comportamento digital. Responda SEMPRE com JSON válido, sem markdown.",
        },
        { role: "user", content: userPrompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
      response_format: { type: "json_object" },
    });

    const text = chatCompletion.choices[0]?.message?.content || "{}";
    res.json({ success: true, ...JSON.parse(text) });
  } catch (error) {
    console.error("GROQ Pautas Error:", error);
    res.status(500).json({ error: "Erro ao gerar pautas" });
  }
});

// DEBUG SERPER
app.get("/api/debug-serper", async (req, res) => {
  try {
    const key = process.env.SERPER_API_KEY;
    if (!key) {
      return res.json({ error: "SERPER_API_KEY is not defined" });
    }
    const queryStr = req.query.q || '("web designer" OR "ui designer" OR "diretor de arte" OR "product designer") ("vagas" OR "vaga" OR "emprego") (site:gupy.io OR site:linkedin.com OR site:vagas.com.br)';
    const response = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": key,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        q: queryStr,
        gl: "br",
        hl: "pt-br",
        num: 20
      })
    });
    const status = response.status;
    const bodyText = await response.text();
    let bodyJson = null;
    try {
      bodyJson = JSON.parse(bodyText);
    } catch (e) {}
    return res.json({
      success: true,
      queryUsed: queryStr,
      keyLength: key.length,
      keyFirstChars: key.substring(0, 4) + "...",
      status,
      bodyText,
      bodyJson
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// JOB FINDER API — Piassa
async function searchJobsForRole(queryStr: string, role: string): Promise<any[]> {
  const response = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: {
      "X-API-KEY": process.env.SERPER_API_KEY!,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      q: queryStr,
      gl: "br",
      hl: "pt-br",
      tbs: "qdr:d15",
      num: 5
    })
  });

  const txt = await response.text();
  let searchData: any = {};
  try { searchData = JSON.parse(txt); } catch {}
  const organic = searchData.organic || [];

  return organic
    .filter((r: any) => isRealJobLink(r.link))
    .map((r: any) => ({
      title: r.title || "Vaga",
      company: extractCompany(r.title, r.link),
      snippet: r.snippet || "",
      link: r.link,
      role,
      salary: extractSalary(r.snippet || "", r.title || "")
    }));
}

app.post("/api/find-jobs", async (req, res) => {
  try {
    if (!process.env.SERPER_API_KEY) {
       return res.status(500).json({ error: "SERPER_API_KEY is not configured in .env" });
    }

    const { jobType } = req.body || {};

    const allQueries = [
      { q: 'vaga estrategista de marketing presencial São Paulo OR remoto home office (site:gupy.io OR site:linkedin.com OR site:vagas.com.br)', role: 'Estrategista de Marketing' },
      { q: 'vaga copywriter copy presencial São Paulo OR remoto home office (site:gupy.io OR site:linkedin.com OR site:vagas.com.br)', role: 'Copywriter' },
      { q: 'vaga redator conteúdo presencial São Paulo OR remoto home office (site:gupy.io OR site:linkedin.com OR site:vagas.com.br)', role: 'Redator' },
      { q: 'vaga marketing industrial presencial São Paulo OR remoto home office (site:gupy.io OR site:linkedin.com OR site:vagas.com.br)', role: 'Marketing Industrial' },
      { q: 'vaga growth marketing presencial São Paulo OR remoto home office (site:gupy.io OR site:linkedin.com OR site:vagas.com.br)', role: 'Growth Marketing' },
      { q: 'vaga redator publicitário presencial São Paulo OR remoto home office (site:gupy.io OR site:linkedin.com OR site:vagas.com.br)', role: 'Redator Publicitário' },
      { q: '(especialista OR analista) funil de vendas presencial São Paulo OR remoto home office (site:gupy.io OR site:linkedin.com OR site:vagas.com.br)', role: 'Funil de Vendas' },
    ];

    let queriesToRun = allQueries;
    if (jobType && jobType !== "all") {
      const match = allQueries.find(q => q.role.toLowerCase().replace(/\s/g, "-") === jobType);
      queriesToRun = match ? [match] : allQueries;
    }

    const resultsArrays = await Promise.all(queriesToRun.map(q => searchJobsForRole(q.q, q.role)));
    const dataList = resultsArrays.flat();

    res.json({ success: true, data: dataList });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to search jobs" });
  }
});

// SERVICES API com Persistência Firestore
app.get("/api/services", async (req, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, "services"));
    const servicesList: any[] = [];
    querySnapshot.forEach((docSnap) => {
      servicesList.push({ id: docSnap.id, ...docSnap.data() });
    });

    // Se o Firestore estiver vazio, preenchemos com os padrões e salvamos
    if (servicesList.length === 0) {
      const defaults = [
        { name: "Landing Page Alta Conversão", price: 2200, active: true, description: "Página única otimizada para capturar leads ou vender produtos com alta taxa de conversão." },
        { name: "Site Completo (5 a 6 páginas)", price: 4500, active: true, description: "Site institucional completo com páginas sobre, serviços, contato e blog." },
        { name: "E-commerce Básico", price: 6500, active: true, description: "Loja virtual completa com até 50 produtos cadastrados, carrinho e checkout." },
        { name: "Gestão de Tráfego Mensal", price: 1500, active: false, description: "Gestão de campanhas de anúncios no Google e Meta Ads para atrair clientes." },
        { name: "Identidade Visual", price: 3200, active: true, description: "Criação de logotipo, paleta de cores, tipografia e manual da marca." },
      ];
      for (const service of defaults) {
        const docRef = await addDoc(collection(db, "services"), {
          ...service,
          createdAt: serverTimestamp()
        });
        servicesList.push({ id: docRef.id, ...service });
      }
    }

    res.json({ success: true, services: servicesList });
  } catch (e: any) {
    console.error("Erro ao carregar serviços do Firestore:", e.message);
    res.status(500).json({ error: "Failed to load services" });
  }
});

app.post("/api/services", async (req, res) => {
  try {
    const { id, name, price, active, description } = req.body;
    if (!name || price === undefined) return res.status(400).json({ error: "Name and price required" });
    
    let priceNumber = typeof price === 'string' ? parseFloat(price.replace(".", "")) : price;
    const dataPayload = {
      name,
      price: priceNumber,
      active: active ?? true,
      description: description || "",
      updatedAt: serverTimestamp()
    };

    if (id && typeof id === 'string' && id.length > 5) {
      const docRef = doc(db, "services", id);
      await updateDoc(docRef, dataPayload);
    } else {
      await addDoc(collection(db, "services"), {
        ...dataPayload,
        createdAt: serverTimestamp()
      });
    }
    res.json({ success: true });
  } catch (e: any) {
    console.error("Erro ao salvar serviço no Firestore:", e.message);
    res.status(500).json({ error: "Error saving service" });
  }
});

app.delete("/api/services/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (id) {
      await deleteDoc(doc(db, "services", id));
    }
    res.json({ success: true });
  } catch (e: any) {
    console.error("Erro ao deletar serviço no Firestore:", e.message);
    res.status(500).json({ error: "Failed to delete service" });
  }
});

// PROPOSALS API
app.post("/api/proposals", async (req, res) => {
  try {
    const { clientName, email, phone, company, budget, selectedServices, observations } = req.body;
    if (!company) {
      return res.status(400).json({ error: "Company name is required." });
    }
    
    const slug = `proposta-escom-${company.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
    const proposal = {
      id: slug,
      clientName,
      email: email || "",
      phone,
      company,
      budget,
      selectedServices,
      observations,
      status: 'pendente', 
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    };
    
    await setDoc(doc(db, "proposals", slug), proposal);
    
    res.json({ success: true, slug, proposal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate proposal" });
  }
});

app.get("/api/proposals", async (req, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, "proposals"));
    const proposalsList: any[] = [];
    querySnapshot.forEach((docSnap) => {
      proposalsList.push(docSnap.data());
    });
    res.json({ success: true, proposals: proposalsList });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch proposals" });
  }
});

app.get("/api/proposals/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;
    const docRef = doc(db, "proposals", slug);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return res.status(404).json({ error: "Proposal not found" });
    }
    
    const proposal = docSnap.data();
    
    if (proposal.status === 'expirado' || (new Date(proposal.expiresAt) < new Date() && proposal.status === 'pendente')) {
      return res.status(410).json({ error: "Proposal expired" });
    }
    
    res.json({ success: true, proposal });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch proposal" });
  }
});

app.delete("/api/proposals/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const docRef = doc(db, "proposals", id);
    await deleteDoc(docRef);
    res.json({ success: true });
  } catch (e) {
    console.error("Error deleting proposal:", e);
    res.status(500).json({ error: "Failed to delete proposal" });
  }
});

app.post("/api/proposals/:slug/accept", async (req, res) => {
  try {
    const slug = req.params.slug;
    const docRef = doc(db, "proposals", slug);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return res.status(404).json({ error: "Proposal not found" });
    
    const proposal = docSnap.data();
    if (proposal.status === "aceito") {
      return res.json({ success: true, message: "Already accepted" });
    }
    
    await updateDoc(docRef, { status: "aceito" });
    
    await addDoc(collection(db, "contracts"), {
      proposalSlug: slug,
      clientName: proposal.clientName,
      company: proposal.company,
      budget: proposal.budget,
      selectedServices: proposal.selectedServices,
      status: "ATIVO", 
      createdAt: serverTimestamp(),
    });
    
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Failed to accept proposal" });
  }
});

// CONTRACTS API
app.get("/api/contracts", async (req, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, "contracts"));
    const contractsList: any[] = [];
    querySnapshot.forEach((docSnap) => {
      contractsList.push({ id: docSnap.id, ...docSnap.data() });
    });
    res.json({ success: true, contracts: contractsList });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch contracts" });
  }
});

app.put("/api/contracts/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const docRef = doc(db, "contracts", id);
    await updateDoc(docRef, { status });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Failed to update contract" });
  }
});

// LEADS API
app.get("/api/leads", async (req, res) => {
  try {
    const type = req.query.type;
    const querySnapshot = await getDocs(collection(db, "leads"));
    const leadsList: any[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (type === 'mined') {
        if (data && data.title && data.title !== 'Empresa não identificada' && !data.title.includes('undefined')) {
          leadsList.push({ id: docSnap.id, ...data });
        }
      } else {
        if (data && (data.origem === 'Site' || data.message)) {
          leadsList.push({ id: docSnap.id, ...data });
        }
      }
    });
    res.json({ success: true, leads: leadsList });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch leads" });
  }
});

app.delete("/api/leads/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await deleteDoc(doc(db, "leads", id));
    res.json({ success: true });
  } catch (e) {
    console.error("Error deleting lead:", e);
    res.status(500).json({ error: "Failed to delete lead" });
  }
});

app.put("/api/leads/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await updateDoc(doc(db, "leads", id), { status });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Failed to update lead status" });
  }
});

// GET /api/generated-sites
app.get("/api/generated-sites", async (req, res) => {
  try {
    await ensureAuth();
    const querySnapshot = await getDocs(collection(db, "generated_sites"));
    const sitesList: any[] = [];
    querySnapshot.forEach((docSnap) => {
      sitesList.push({ id: docSnap.id, ...docSnap.data() });
    });
    res.json({ success: true, data: sitesList });
  } catch (e: any) {
    console.error("Erro ao carregar sites gerados:", e.message);
    res.status(500).json({ error: "Failed to load generated sites" });
  }
});

// GET /api/lead-data/:projectId
app.get("/api/lead-data/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;

    // Try generated_sites first
    let docSnap = await getDoc(doc(db, "generated_sites", projectId));
    if (docSnap.exists()) {
      const data = docSnap.data();
      return res.json({ success: true, data: { ...data, id: docSnap.id } });
    }

    // Fallback to leads collection
    const leadsSnap = await getDocs(collection(db, "leads"));
    let found = null;
    leadsSnap.forEach((d) => {
      const dData = d.data();
      if (d.id === projectId || dData.placeId === projectId || dData.title?.toLowerCase().includes(projectId.toLowerCase())) {
        found = { id: d.id, ...dData };
      }
    });

    if (found) {
      return res.json({ success: true, data: found });
    }

    res.status(404).json({ error: "Lead não encontrado" });
  } catch (e: any) {
    console.error("Erro ao buscar lead data:", e.message);
    res.status(500).json({ error: "Failed to fetch lead data" });
  }
});

// PUT /api/generated-sites/:id/status
app.put("/api/generated-sites/:id/status", async (req, res) => {
  try {
    await ensureAuth();
    const { id } = req.params;
    const { status } = req.body;
    await updateDoc(doc(db, "generated_sites", id), { status });
    res.json({ success: true });
  } catch (e: any) {
    console.error("Erro ao atualizar status do site gerado:", e.message);
    res.status(500).json({ error: "Failed to update site status" });
  }
});

// GET /api/view-prototype/:projectId (Proxy para visualizar protótipo do Stitch sem forçar download)
app.get("/api/view-prototype/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!projectId) {
      return res.status(400).send("Project ID is required.");
    }

    const docRef = doc(db, "generated_sites", projectId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return res.status(404).send("Prototype not found");
    }
    const siteData = docSnap.data();
    const htmlUrl = siteData.htmlUrl;
    if (!htmlUrl) {
      return res.status(400).send("No HTML URL available for this site.");
    }

    let htmlContent = "";
    if (projectId === "12943424911819052785") {
      console.log(`[PROXY_PROTOTYPE] Serving local patched HTML for Silva & Associados`);
      const localPath = path.join(process.cwd(), "public", "template-silva-associados", "index.html");
      htmlContent = fs.readFileSync(localPath, "utf8");
    } else {
      console.log(`[PROXY_PROTOTYPE] Fetching HTML from Stitch: ${htmlUrl}`);
      const response = await fetch(htmlUrl);
      if (!response.ok) {
        return res.status(500).send(`Failed to fetch HTML from Stitch API: ${response.statusText}`);
      }
      htmlContent = await response.text();
    }

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Content-Disposition", "inline");
    return res.send(htmlContent);
  } catch (error: any) {
    console.error("Error serving prototype proxy:", error);
    return res.status(500).send("Internal Server Error: " + error.message);
  }
});

// POST /api/approve-site (Deploy Vercel)
app.post("/api/approve-site", async (req, res) => {
  try {
    await ensureAuth();
    const { projectId, slug } = req.body;
    if (!projectId || !slug) {
      return res.status(400).json({ error: "Project ID and Slug are required." });
    }

    const docRef = doc(db, "generated_sites", projectId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return res.status(404).json({ error: "Site not found" });
    }
    const siteData = docSnap.data();

    // 1. Obter o HTML do Stitch ou do arquivo local
    let htmlContent = "";
    if (projectId === "12943424911819052785") {
      console.log(`[VERCEL_DEPLOY] Carregando HTML local corrigido para Silva & Associados...`);
      const localPath = path.join(process.cwd(), "public", "template-silva-associados", "index.html");
      htmlContent = fs.readFileSync(localPath, "utf-8");
    } else {
      const htmlUrl = siteData.htmlUrl;
      if (!htmlUrl) {
        return res.status(400).json({ error: "No HTML URL available for this site." });
      }

      console.log(`[VERCEL_DEPLOY] Baixando HTML do Stitch para ${slug}...`);
      const response = await fetch(htmlUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch HTML from Stitch: ${response.statusText}`);
      }
      htmlContent = await response.text();
    }

    // 2. Criar diretório temporário no workspace para o deploy
    const targetDir = path.join(process.cwd(), "dist-deployed", slug);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    fs.writeFileSync(path.join(targetDir, "index.html"), htmlContent, "utf-8");

    // 3. Executar o deploy na Vercel usando a CLI da Vercel
    const { exec } = await import("child_process");
    console.log(`[VERCEL_DEPLOY] Iniciando deploy na Vercel para ${slug} em ${targetDir}...`);
    
    const command = `npx vercel deploy "${targetDir}" --name "${slug}" --prod --yes`;
    
    exec(command, async (error, stdout, stderr) => {
      if (error) {
        console.error(`[VERCEL_DEPLOY] Erro ao fazer deploy na Vercel:`, error);
        await updateDoc(docRef, { status: "failed_deploy", error: error.message });
        return;
      }
      
      const lines = stdout.split("\n");
      const deployUrlLine = lines.find(l => l.includes("https://") && l.includes("vercel.app"));
      let finalUrl = "";
      if (deployUrlLine) {
        const matches = deployUrlLine.match(/https:\/\/[a-zA-Z0-9.-]+\.vercel\.app/);
        if (matches) finalUrl = matches[0];
      }
      
      if (!finalUrl) {
        const cleanLines = lines.map(l => l.trim()).filter(l => l.length > 0);
        for (const line of cleanLines) {
          if (line.includes("vercel.app") && line.startsWith("https://")) {
            finalUrl = line;
            break;
          }
        }
      }

      if (!finalUrl) {
        finalUrl = `https://${slug}.vercel.app`;
      }

      console.log(`[VERCEL_DEPLOY] Deploy concluído com sucesso! URL: ${finalUrl}`);

      await updateDoc(docRef, {
        status: "approved",
        deployedUrl: finalUrl
      });
    });

    res.json({ success: true, message: "Deploy process started in background." });

  } catch (e: any) {
    console.error("Erro no processo de aprovação/deploy:", e.message);
    res.status(500).json({ error: e.message || "Failed to deploy site" });
  }
});

// ─── Helper: scrape imagens reais do site do lead ───
async function scrapeLeadRealImages(websiteUrl: string): Promise<string[]> {
  if (!websiteUrl || !websiteUrl.startsWith("http")) return [];
  try {
    const resp = await fetch(websiteUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" },
      signal: AbortSignal.timeout(8000)
    });
    if (!resp.ok) return [];
    const html = await resp.text();
    const $ = cheerio.load(html);
    const images: { src: string; area: number }[] = [];

    $("img").each((_i, el) => {
      let src = $(el).attr("src") || $(el).attr("data-src") || "";
      if (!src || src.startsWith("data:") || src.includes("base64")) return;
      // Resolver URL relativa
      try { src = new URL(src, websiteUrl).href; } catch { return; }
      // Ignorar icones, logos, SVGs, etc
      const alt = ($(el).attr("alt") || "").toLowerCase();
      const cls = ($(el).attr("class") || "").toLowerCase();
      const id = ($(el).attr("id") || "").toLowerCase();
      const ignoreTerms = ["logo", "icon", "avatar", "thumbnail", "thumb", "menu", "close", "search", "arrow", "social", "spinner", "loading", "banner-ad", "pixel", "tracking"];
      if (ignoreTerms.some(t => alt.includes(t) || cls.includes(t) || id.includes(t) || src.includes(t))) return;
      // Apenas imagens grandes o suficiente
      const w = parseInt($(el).attr("width") || "0");
      const h = parseInt($(el).attr("height") || "0");
      const area = w * h;
      if (area > 0 && area < 10000) return; // ignora < 100x100
      images.push({ src, area: area || 999999 });
    });

    // Também procurar em background-image (style attr)
    $("[style*='background-image'], [style*=\"background-image\"]").each((_i, el) => {
      const style = $(el).attr("style") || "";
      const m = style.match(/url\(['"]?(.*?)['"]?\)/);
      if (!m) return;
      let src = m[1];
      try { src = new URL(src, websiteUrl).href; } catch { return; }
      if (images.some(i => i.src === src)) return;
      images.push({ src, area: 999999 });
    });

    // Ordenar por área (maiores primeiro) e deduplicar
    images.sort((a, b) => b.area - a.area);
    const seen = new Set<string>();
    return images.filter(i => { if (seen.has(i.src)) return false; seen.add(i.src); return true; }).slice(0, 5).map(i => i.src);
  } catch {
    return [];
  }
}

// ─── Helper: busca imagens do Google Places via placeId ───
async function scrapePlacePhotos(placeId: string): Promise<string[]> {
  if (!placeId || placeId.length < 10 || !process.env.GOOGLE_API_KEY) return [];
  try {
    // Primeiro obtém detalhes do place para peçar photo_reference
    const detailsResp = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&key=${process.env.GOOGLE_API_KEY}&fields=photos`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!detailsResp.ok) return [];
    const details: any = await detailsResp.json();
    const photos = details?.result?.photos || [];
    return photos.slice(0, 3).map((p: any) =>
      `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photoreference=${p.photo_reference}&key=${process.env.GOOGLE_API_KEY}`
    );
  } catch {
    return [];
  }
}

// POST /api/build-and-deploy-site (Builder de sites a partir dos parâmetros + copy gerado)
app.post("/api/build-and-deploy-site", async (req, res) => {
  try {
    await ensureAuth();
    const { projectId, slug, formData, siteData, paletteIndex, lead } = req.body;
    if (!slug || !formData || !siteData) {
      return res.status(400).json({ error: "slug, formData e siteData são obrigatórios." });
    }

    // ─── HIERARQUIA DE IMAGENS: real > IA > referencias ───
    const leadWebsite = formData.website || lead?.originalUrl || lead?.website || "";
    const leadPlaceId = formData.placeId || lead?.placeId || "";

    let realImages: string[] = [];
    let placeImages: string[] = [];

    // 1. Buscar imagens reais (paralelo: site + Google Places)
    if (leadWebsite) {
      realImages = await scrapeLeadRealImages(leadWebsite);
      console.log(`[BUILD] Imagens extraídas do site ${leadWebsite}: ${realImages.length}`);
    }
    if (leadPlaceId) {
      placeImages = await scrapePlacePhotos(leadPlaceId);
      console.log(`[BUILD] Imagens do Google Places (${leadPlaceId}): ${placeImages.length}`);
    }
    const realImgSet = [...realImages, ...placeImages];

    // 2. Imagens geradas pela IA (Pollinations.ai) do siteData
    const aiImages: string[] = [];
    if (siteData.hero?.imageUrl) aiImages.push(siteData.hero.imageUrl);
    if (siteData.about?.imageUrl) aiImages.push(siteData.about.imageUrl);
    (siteData.services || []).forEach((s: any) => { if (s.imageUrl) aiImages.push(s.imageUrl); });

    // 3. Imagens _referencias (fallback decorativo)
    const nicheMap: Record<string, string> = {
      saude: "saude", sa\u00fade: "saude", cl\u00ednica: "saude", clinica: "saude", m\u00e9dico: "saude", medico: "saude", hospital: "saude",
      academia: "academia", fitness: "academia", esporte: "academia", crossfit: "academia", pilates: "academia",
      mecanica: "mecanica", oficina: "mecanica", auto: "mecanica", el\u00e9trica: "mecanica",
      advogado: "advogados", advocacia: "advogados", jur\u00eddico: "advogados", juridico: "advogados", direito: "advogados",
      alimento: "alimentos", restaurante: "alimentos", gastronomia: "alimentos", comida: "alimentos", bar: "alimentos"
    };
    let nicheFolder = "";
    if (formData.niche) {
      const lowerNiche = formData.niche.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      for (const [key, folder] of Object.entries(nicheMap)) {
        if (lowerNiche.includes(key)) { nicheFolder = folder; break; }
      }
    }
    const refImages: string[] = [];
    if (nicheFolder) {
      const refDir = path.join(process.cwd(), "_referencias", nicheFolder);
      try {
        const files = fs.readdirSync(refDir).filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));
        for (const file of files) {
          const imgPath = path.join(refDir, file);
          const ext = path.extname(file).slice(1).replace("jpg", "jpeg");
          const b64 = fs.readFileSync(imgPath).toString("base64");
          refImages.push(`data:image/${ext};base64,${b64}`);
        }
      } catch (_) {}
    }
    if (refImages.length === 0 && nicheFolder === "") {
      const rootDir = path.join(process.cwd(), "_referencias");
      try {
        const files = fs.readdirSync(rootDir).filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));
        for (const file of files) {
          const imgPath = path.join(rootDir, file);
          const ext = path.extname(file).slice(1).replace("jpg", "jpeg");
          const b64 = fs.readFileSync(imgPath).toString("base64");
          refImages.push(`data:image/${ext};base64,${b64}`);
        }
      } catch (_) {}
    }

    // ─── FALLBACK UNSPLASH (qualidade profissional por nicho) ───
    const unsplashByNiche: Record<string, string[]> = {
      saude: ["https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200", "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200", "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=1200"],
      academia: ["https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200", "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200", "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200"],
      advogados: ["https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200", "https://images.unsplash.com/photo-1560252829-804f1aedf1be?w=1200", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200"],
      mecanica: ["https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=1200", "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1200", "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1200"],
      alimentos: ["https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200", "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200", "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200"]
    };
    const unsplashFallback = unsplashByNiche[nicheFolder] || [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200"
    ];

    // ─── SELECIONAR IMAGENS POR PRIORIDADE: real > place > AI > Unsplash > _referencias ───
    const heroBgImg = realImgSet[0] || placeImages[0] || aiImages[0] || unsplashFallback[0] || refImages[0] || "";
    const aboutImg = realImgSet[realImgSet.length > 1 ? 1 : 0] || placeImages[placeImages.length > 1 ? 1 : 0] || (aiImages.length > 1 ? aiImages[1] : aiImages[0]) || unsplashFallback[1] || (refImages.length > 1 ? refImages[1] : refImages[0]) || heroBgImg;
    const decorativeImg = realImgSet[2] || placeImages[2] || aiImages[aiImages.length > 2 ? 2 : aiImages.length - 1] || unsplashFallback[2] || (refImages.length > 2 ? refImages[2] : (refImages.length > 1 ? refImages[1] : refImages[0])) || heroBgImg;

    console.log(`[BUILD] heroBgImg: ${heroBgImg ? heroBgImg.substring(0, 60) + "..." : "none"}`);
    console.log(`[BUILD] aboutImg: ${aboutImg ? aboutImg.substring(0, 60) + "..." : "none"}`);
    console.log(`[BUILD] decorativeImg: ${decorativeImg ? decorativeImg.substring(0, 60) + "..." : "none"}`);

    // 2. Dados do copy e paleta de marca
    const primaryHex = siteData.primaryHex || formData.primaryHex || "#00d1ff";
    const palette = siteData.colorPalettes?.[paletteIndex || 0]?.colors || null;

    // Paleta inteligente: extrai 5 cores do palette da IA, mapeando por luminância
    const hexToRgb = (h: string) => { const r = h.replace('#',''); return { r: parseInt(r.substring(0,2),16), g: parseInt(r.substring(2,4),16), b: parseInt(r.substring(4,6),16) }; };
    const luminance = (h: string) => { if (!h || !/^#[0-9a-fA-F]{6}$/.test(h)) return 0.5; const c = hexToRgb(h); return (0.2126*c.r + 0.7152*c.g + 0.0722*c.b)/255; };
    const isLight = (h: string) => luminance(h) > 0.5;

    let brandBg = "#ffffff", brandBgAlt = "#f9fafb", brandText = "#111827", brandTextMuted = "#6b7280";
    let brandBorder = "#e5e7eb", brandCard = "#ffffff", brandAccent = primaryHex;
    let brandAccentText = "#ffffff", brandFooter = "#111827", brandFooterText = "#9ca3af";

    if (palette && Array.isArray(palette) && palette.length >= 5) {
      const sorted = [...palette].sort((a, b) => luminance(b) - luminance(a));
      brandBg = sorted[0];                     // mais clara → fundo principal
      brandBgAlt = sorted[1];                  // 2ª mais clara → fundo alternado
      brandCard = sorted[1];                   // mesma do bgAlt para cards
      brandText = sorted[4];                   // mais escura → texto
      brandFooter = sorted[4];                 // mais escura → footer
      const mid = sorted[2];
      brandTextMuted = mid;
      brandBorder = mid;
      brandAccent = primaryHex;                // primaryHex sempre como accent
      // Texto do accent: branco se accent escuro, preto se accent claro
      brandAccentText = isLight(brandAccent) ? "#111827" : "#ffffff";
      // Texto do footer: tom mais claro que o fundo do footer
      const footerLum = luminance(brandFooter);
      brandFooterText = footerLum < 0.3 ? "#9ca3af" : footerLum < 0.6 ? "#6b7280" : "#374151";
    } else {
      // Fallback inteligente: deriva do primaryHex
      brandAccent = primaryHex;
      brandAccentText = isLight(brandAccent) ? "#111827" : "#ffffff";
      if (luminance(brandAccent) < 0.15) {
        brandFooter = brandAccent;
        brandFooterText = "#9ca3af";
      }
    }

    // 3. Construir seções HTML
    const hero = siteData.hero || {};
    const about = siteData.about || {};
    const services = Array.isArray(siteData.services) ? siteData.services : [];
    const benefits = Array.isArray(siteData.benefits) ? siteData.benefits : [];
    const testimonials = Array.isArray(siteData.testimonials) ? siteData.testimonials : [];
    const pricing = siteData.pricing || {};
    const plans = Array.isArray(pricing.plans) ? pricing.plans : [];
    const faq = Array.isArray(siteData.faq) ? siteData.faq : [];
    const contact = siteData.contact || {};
    const sections = formData.sections || {};

    const esc = (s: any) => { if (!s) return ""; return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); };

    let sectionsHtml = "";

    // -- NAV (fundo principal) --
    sectionsHtml += `<nav style="background:${brandBg};border-bottom:1px solid ${brandBorder};padding:1rem 5%;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;z-index:100;">
      <div style="display:flex;align-items:center;gap:0.5rem;">
        <div style="width:2rem;height:2rem;border-radius:0.375rem;background:${brandAccent};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:0.75rem;">S</div>
        <span style="font-weight:800;font-size:1.125rem;color:${brandText};letter-spacing:-0.02em;">${esc(formData.companyName || slug)}</span>
      </div>
      <a href="#contact" style="background:${brandAccent};color:#fff;padding:0.5rem 1.5rem;border-radius:0.5rem;font-weight:700;font-size:0.75rem;text-decoration:none;text-transform:uppercase;letter-spacing:0.05em;">Fale Conosco</a>
    </nav>`;

    // -- HERO (seção de destaque com fundo accent) --
    if (sections.hero) {
      const heroHasBg = !!heroBgImg;
      const heroBgStyle = heroBgImg ? `background-image:url(${esc(heroBgImg)});background-size:cover;background-position:center;` : "";
      sectionsHtml += `<section style="position:relative;padding:6rem 5%;display:flex;flex-direction:column;align-items:center;text-align:center;overflow:hidden;min-height:70vh;background:${brandAccent};${heroBgStyle}">
        ${heroHasBg ? `<div style="position:absolute;inset:0;background:${brandAccent};opacity:0.85;mix-blend-mode:multiply;"></div>` : `<div style="position:absolute;inset:0;background:linear-gradient(135deg,${brandAccent}dd 0%,${brandAccent} 100%);"></div>`}
        <div style="position:relative;z-index:2;max-width:900px;">
          ${hero.subheadline ? `<div style="display:inline-block;padding:0.375rem 1rem;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.2);border-radius:999px;font-size:0.6875rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:${brandAccentText};margin-bottom:2rem;">${esc(hero.subheadline)}</div>` : ""}
          <h1 style="font-size:clamp(2.25rem,5vw,4rem);font-weight:900;color:${brandAccentText};line-height:1.1;margin:0 0 1.5rem;letter-spacing:-0.03em;">${esc(hero.headline || `${formData.companyName || 'Sua Empresa'} — Transforme seu Negócio`)}</h1>
          ${hero.cta ? `<a href="#contact" style="display:inline-block;background:#fff;color:${brandAccent};padding:1rem 2.5rem;border-radius:0.5rem;font-weight:800;font-size:1rem;text-decoration:none;box-shadow:0 4px 20px rgba(0,0,0,0.15);transition:all 0.2s;">${esc(hero.cta)}</a>` : ""}
        </div>
      </section>`;
    }

    // -- ABOUT (fundo principal) --
    if (sections.about) {
      sectionsHtml += `<section id="about" style="padding:5rem 5%;background:${brandBg};display:flex;flex-direction:column;align-items:center;text-align:center;">
        ${aboutImg ? `<div style="max-width:280px;margin:0 auto 2rem;border-radius:1rem;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);"><img src="${esc(aboutImg)}" alt="Foto ${esc(formData.companyName || 'da empresa')}" style="width:100%;display:block;" /></div>` : ""}
        <div style="max-width:800px;">
          <h2 style="font-size:clamp(1.75rem,3vw,2.75rem);font-weight:800;color:${brandText};margin:0 0 1rem;letter-spacing:-0.02em;">${esc(about.title || `Sobre a ${formData.companyName || 'Empresa'}`)}</h2>
          <div style="width:3rem;height:0.25rem;background:${brandAccent};border-radius:999px;margin:0 auto 2rem;"></div>
          <p style="font-size:1.125rem;line-height:1.8;color:${brandTextMuted};max-width:700px;margin:0 auto;">${esc(about.text || `Conheça nossa história e proposta de valor para o nicho de ${formData.niche || 'atuação'}.`)}</p>
        </div>
      </section>`;
    }

    // -- SERVICES (fundo alternado sutil) --
    if (sections.services && services.length > 0) {
      let cardsHtml = "";
      for (let i = 0; i < services.length; i++) {
        const svc = services[i];
        cardsHtml += `<div style="background:${brandBg};border:1px solid ${brandBorder};border-radius:1rem;overflow:hidden;transition:all 0.3s;display:flex;flex-direction:column;box-shadow:0 1px 3px rgba(0,0,0,0.04);">
          ${svc.imageUrl ? `<div style="height:12rem;overflow:hidden;"><img src="${esc(svc.imageUrl)}" alt="${esc(svc.title)}" style="width:100%;height:100%;object-fit:cover;transition:transform 0.5s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" /></div>` : `<div style="height:12rem;background:${brandBgAlt};display:flex;align-items:center;justify-content:center;font-size:2rem;color:${brandBorder};">✦</div>`}
          <div style="padding:1.5rem;flex:1;">
            <h3 style="font-size:1.125rem;font-weight:700;color:${brandText};margin:0 0 0.5rem;">${esc(svc.title)}</h3>
            <p style="font-size:0.875rem;color:${brandTextMuted};line-height:1.6;margin:0;">${esc(svc.description)}</p>
          </div>
        </div>`;
      }
      sectionsHtml += `<section style="padding:5rem 5%;background:${brandBgAlt};">
        <h2 style="font-size:clamp(1.75rem,3vw,2.5rem);font-weight:800;color:${brandText};text-align:center;margin:0 0 3rem;letter-spacing:-0.02em;">Nossos Serviços</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;max-width:1200px;margin:0 auto;">${cardsHtml}</div>
      </section>`;
    }

    // -- BENEFITS (fundo principal) --
    if (sections.benefits && benefits.length > 0) {
      let benefitsHtml = "";
      for (let i = 0; i < benefits.length; i++) {
        const ben = benefits[i];
        benefitsHtml += `<div style="display:flex;align-items:flex-start;gap:1rem;">
          <div style="width:2.5rem;height:2.5rem;border-radius:0.75rem;background:${brandAccent}15;display:flex;align-items:center;justify-content:center;color:${brandAccent};font-size:1.25rem;flex-shrink:0;">✓</div>
          <div>
            <h4 style="font-size:1.125rem;font-weight:700;color:${brandText};margin:0 0 0.375rem;">${esc(ben.title)}</h4>
            <p style="font-size:0.875rem;color:${brandTextMuted};line-height:1.6;margin:0;">${esc(ben.description)}</p>
          </div>
        </div>`;
      }
      sectionsHtml += `<section style="padding:5rem 5%;background:${brandBg};">
        <div style="max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:center;">
          <div>
            <h2 style="font-size:clamp(1.5rem,3vw,2.25rem);font-weight:800;color:${brandText};margin:0 0 2rem;letter-spacing:-0.02em;">Por que nos escolher?</h2>
            <div style="display:flex;flex-direction:column;gap:1.5rem;">${benefitsHtml}</div>
          </div>
          <div style="aspect-ratio:1;border-radius:1.5rem;background:${brandBgAlt};border:1px solid ${brandBorder};display:flex;align-items:center;justify-content:center;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.06);">
            ${decorativeImg ? `<img src="${esc(decorativeImg)}" alt="Ambiente" style="width:100%;height:100%;object-fit:cover;opacity:0.7;" />` : `<div style="font-size:4rem;color:${brandAccent};opacity:0.2;">✦</div>`}
          </div>
        </div>
      </section>`;
    }

    // -- TESTIMONIALS (fundo alternado sutil) --
    if (sections.testimonials && testimonials.length > 0) {
      let testHtml = "";
      for (let i = 0; i < testimonials.length; i++) {
        const t = testimonials[i];
        testHtml += `<div style="background:${brandBg};border:1px solid ${brandBorder};border-radius:1.25rem;padding:2rem;position:relative;box-shadow:0 1px 3px rgba(0,0,0,0.04);">
          <div style="position:absolute;top:-0.75rem;left:-0.75rem;width:2.5rem;height:2.5rem;border-radius:50%;background:${brandBgAlt};border:1px solid ${brandBorder};display:flex;align-items:center;justify-content:center;color:${brandAccent};font-size:1.25rem;">"</div>
          <p style="color:${brandTextMuted};font-style:italic;line-height:1.7;margin:0.5rem 0 1.5rem;font-size:0.9375rem;">${esc(t.text)}</p>
          <div style="display:flex;align-items:center;gap:0.75rem;">
            <div style="width:2.5rem;height:2.5rem;border-radius:50%;background:${brandAccent}15;display:flex;align-items:center;justify-content:center;color:${brandAccent};font-weight:700;font-size:0.875rem;">${esc((t.name || "C")[0])}</div>
            <div>
              <p style="font-weight:700;color:${brandText};margin:0;font-size:0.875rem;">${esc(t.name)}</p>
              <p style="color:${brandTextMuted};font-size:0.75rem;text-transform:uppercase;letter-spacing:0.05em;margin:0;">${esc(t.role)}</p>
            </div>
          </div>
        </div>`;
      }
      sectionsHtml += `<section style="padding:5rem 5%;background:${brandBgAlt};">
        <h2 style="font-size:clamp(1.5rem,3vw,2.25rem);font-weight:800;color:${brandText};text-align:center;margin:0 0 3rem;">O que dizem sobre nós</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1.5rem;max-width:1000px;margin:0 auto;">${testHtml}</div>
      </section>`;
    }

    // -- PRICING (fundo principal) --
    if (sections.pricing && plans.length > 0) {
      let plansHtml = "";
      for (let i = 0; i < plans.length; i++) {
        const plan = plans[i];
        const isHighlight = plan.highlight || i === 1;
        const features = Array.isArray(plan.features) ? plan.features : [];
        let featuresHtml = "";
        for (const f of features) {
          featuresHtml += `<div style="display:flex;align-items:center;gap:0.5rem;padding:0.375rem 0;"><span style="color:${brandAccent};">✓</span><span style="color:${brandTextMuted};font-size:0.875rem;">${esc(f)}</span></div>`;
        }
        plansHtml += `<div style="padding:2.5rem 2rem;border-radius:1.5rem;border:1px solid ${isHighlight ? brandAccent : brandBorder};background:${isHighlight ? brandBg : brandBg};position:relative;${isHighlight ? `box-shadow:0 8px 30px ${brandAccent}22;border-color:${brandAccent};` : ""}transform:${isHighlight ? "scale(1.03)" : "scale(1)"};">
          ${isHighlight ? `<div style="position:absolute;top:-0.75rem;left:50%;transform:translateX(-50%);background:${brandAccent};color:#fff;padding:0.25rem 1rem;border-radius:999px;font-size:0.625rem;font-weight:900;text-transform:uppercase;letter-spacing:0.1em;white-space:nowrap;">Mais Escolhido</div>` : ""}
          <h3 style="font-size:1.25rem;font-weight:700;color:${brandText};margin:0 0 0.5rem;">${esc(plan.name)}</h3>
          <div style="font-size:2.5rem;font-weight:900;color:${brandText};margin:0 0 1.5rem;">R$ ${esc(plan.price || "0")}<span style="font-size:0.875rem;color:${brandTextMuted};font-weight:400;">/mês</span></div>
          <div style="margin-bottom:2rem;">${featuresHtml}</div>
          <a href="#contact" style="display:block;text-align:center;padding:0.875rem;border-radius:0.75rem;font-weight:700;font-size:0.875rem;text-decoration:none;background:${isHighlight ? brandAccent : "transparent"};color:${isHighlight ? "#fff" : brandText};border:1px solid ${isHighlight ? brandAccent : brandBorder};">Assinar Agora</a>
        </div>`;
      }
      sectionsHtml += `<section style="padding:5rem 5%;background:${brandBg};">
        <h2 style="font-size:clamp(1.5rem,3vw,2.25rem);font-weight:800;color:${brandText};text-align:center;margin:0 0 0.5rem;">${esc(pricing.title || "Investimento")}</h2>
        ${pricing.description ? `<p style="color:${brandTextMuted};text-align:center;max-width:600px;margin:0 auto 3rem;font-size:0.9375rem;">${esc(pricing.description)}</p>` : ""}
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;max-width:1000px;margin:0 auto;align-items:center;">${plansHtml}</div>
      </section>`;
    }

    // -- FAQ (fundo alternado sutil) --
    if (sections.faq && faq.length > 0) {
      let faqHtml = "";
      for (let i = 0; i < faq.length; i++) {
        const f = faq[i];
        faqHtml += `<details style="background:${brandBg};border:1px solid ${brandBorder};border-radius:0.75rem;overflow:hidden;margin-bottom:0.75rem;">
          <summary style="padding:1.25rem 1.5rem;font-weight:600;color:${brandText};cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;">
            <span>${esc(f.question)}</span>
            <span style="color:${brandAccent};font-size:0.875rem;transition:transform 0.2s;">▼</span>
          </summary>
          ${f.answer ? `<div style="padding:0 1.5rem 1.25rem;color:${brandTextMuted};line-height:1.7;font-size:0.9375rem;border-top:1px solid ${brandBorder};padding-top:1rem;">${esc(f.answer)}</div>` : ""}
        </details>`;
      }
      sectionsHtml += `<section style="padding:5rem 5%;background:${brandBgAlt};">
        <h2 style="font-size:clamp(1.5rem,3vw,2.25rem);font-weight:800;color:${brandText};text-align:center;margin:0 0 3rem;">Dúvidas Frequentes</h2>
        <div style="max-width:700px;margin:0 auto;">${faqHtml}</div>
      </section>`;
    }

    // -- CONTACT (fundo principal) --
    const mapsUrl = contact.mapsUrl || `https://maps.google.com/maps?q=${encodeURIComponent(formData.address || formData.companyName || 'Brasil')}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
    sectionsHtml += `<section id="contact" style="padding:5rem 5%;background:${brandBg};">
      <div style="max-width:1100px;margin:0 auto;">
        <h2 style="font-size:clamp(1.75rem,3vw,2.5rem);font-weight:800;color:${brandText};text-align:center;margin:0 0 0.5rem;">${esc(contact.title || "Vamos impulsionar o seu negócio?")}</h2>
        ${contact.description ? `<p style="color:${brandTextMuted};text-align:center;max-width:600px;margin:0 auto 3rem;font-size:0.9375rem;">${esc(contact.description)}</p>` : ""}
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:3rem;">
          <div style="background:${brandBg};border:1px solid ${brandBorder};border-radius:1.25rem;padding:2rem;">
            <form onsubmit="event.preventDefault();alert('Obrigado pelo contato! Em breve retornaremos.');">
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
                <input type="text" placeholder="Nome Completo" style="width:100%;padding:0.875rem 1rem;background:${brandBgAlt};border:1px solid ${brandBorder};border-radius:0.75rem;color:${brandText};font-size:0.875rem;outline:none;box-sizing:border-box;" />
                <input type="text" placeholder="Empresa" style="width:100%;padding:0.875rem 1rem;background:${brandBgAlt};border:1px solid ${brandBorder};border-radius:0.75rem;color:${brandText};font-size:0.875rem;outline:none;box-sizing:border-box;" />
              </div>
              <input type="email" placeholder="E-mail Corporativo" style="width:100%;padding:0.875rem 1rem;background:${brandBgAlt};border:1px solid ${brandBorder};border-radius:0.75rem;color:${brandText};font-size:0.875rem;outline:none;margin-bottom:1rem;box-sizing:border-box;" />
              <textarea placeholder="Fale um pouco sobre o seu desafio..." style="width:100%;padding:0.875rem 1rem;background:${brandBgAlt};border:1px solid ${brandBorder};border-radius:0.75rem;color:${brandText};font-size:0.875rem;outline:none;min-height:120px;resize:none;margin-bottom:1.5rem;box-sizing:border-box;font-family:inherit;"></textarea>
              <button type="submit" style="width:100%;padding:1rem;background:${brandAccent};color:#fff;border:none;border-radius:0.75rem;font-weight:800;font-size:1rem;cursor:pointer;transition:opacity 0.2s;">Enviar Solicitação →</button>
            </form>
          </div>
          <div style="display:flex;flex-direction:column;gap:1.5rem;">
            <div style="background:${brandBg};border:1px solid ${brandBorder};border-radius:1.25rem;padding:1.5rem;">
              ${contact.phone ? `<div style="display:flex;align-items:center;gap:0.75rem;padding:0.5rem 0;"><div style="width:2.25rem;height:2.25rem;border-radius:50%;background:${brandAccent}15;display:flex;align-items:center;justify-content:center;color:${brandAccent};font-size:0.875rem;">📞</div><div><p style="color:${brandTextMuted};font-size:0.625rem;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 0.125rem;font-weight:700;">Telefone</p><p style="color:${brandText};font-weight:500;margin:0;">${esc(contact.phone)}</p></div></div>` : ""}
              ${contact.email ? `<div style="display:flex;align-items:center;gap:0.75rem;padding:0.5rem 0;"><div style="width:2.25rem;height:2.25rem;border-radius:50%;background:${brandAccent}15;display:flex;align-items:center;justify-content:center;color:${brandAccent};font-size:0.875rem;">✉</div><div><p style="color:${brandTextMuted};font-size:0.625rem;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 0.125rem;font-weight:700;">Email</p><p style="color:${brandText};font-weight:500;margin:0;">${esc(contact.email)}</p></div></div>` : ""}
              ${contact.address ? `<div style="display:flex;align-items:center;gap:0.75rem;padding:0.5rem 0;"><div style="width:2.25rem;height:2.25rem;border-radius:50%;background:${brandAccent}15;display:flex;align-items:center;justify-content:center;color:${brandAccent};font-size:0.875rem;">📍</div><div><p style="color:${brandTextMuted};font-size:0.625rem;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 0.125rem;font-weight:700;">Endereço</p><p style="color:${brandText};font-weight:500;margin:0;">${esc(contact.address)}</p></div></div>` : ""}
            </div>
            <div style="background:${brandBgAlt};border:1px solid ${brandBorder};border-radius:1.25rem;overflow:hidden;flex:1;min-height:200px;">
              <iframe src="${esc(mapsUrl)}" style="width:100%;height:100%;min-height:200px;border:none;filter:grayscale(0.3) opacity(0.8);" loading="lazy"></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>`;

    // -- FOOTER (escuro, única seção diferente do padrão claro) --
    sectionsHtml += `<footer style="background:${brandFooter};padding:3rem 5%;text-align:center;">
      <p style="color:${brandFooterText};font-size:0.8125rem;margin:0 0 0.5rem;">© ${new Date().getFullYear()} ${esc(formData.companyName || slug)}. Todos os direitos reservados.</p>
      <p style="color:#6b7280;font-size:0.6875rem;margin:0;">Feito com Escom Studio — Estratégia, Design & Conversão</p>
    </footer>`;

    // 4. Montar HTML completo
    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${esc(formData.companyName || slug)} — Site Oficial</title>
<meta name="description" content="${esc(formData.companyName || slug)} — Transformando o mercado de ${esc(formData.niche || 'atuação')} com excelência e profissionalismo.">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#ffffff;color:#111827}
img{max-width:100%;height:auto}
a{color:inherit}
section{width:100%}
details summary::-webkit-details-marker{display:none}
details[open] summary span:last-child{transform:rotate(180deg)}
@media(max-width:768px){
  section{padding:3rem 1.25rem !important}
  #contact > div > div{grid-template-columns:1fr !important}
}
</style>
</head>
<body>
${sectionsHtml}
</body>
</html>`;

    // 5. Salvar e fazer deploy
    const targetDir = path.join(process.cwd(), "dist-deployed", slug);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    fs.writeFileSync(path.join(targetDir, "index.html"), html, "utf-8");

    const { exec } = await import("child_process");
    console.log(`[BUILD_DEPLOY] Iniciando deploy na Vercel para ${slug}...`);
    const command = `npx vercel deploy "${targetDir}" --name "${slug}" --prod --yes`;

    exec(command, async (error, stdout, stderr) => {
      if (error) {
        console.error(`[BUILD_DEPLOY] Erro no deploy:`, error);
        if (projectId) {
          await updateDoc(doc(db, "generated_sites", projectId), { status: "failed_deploy", error: error.message });
        }
        return;
      }

      const lines = stdout.split("\n");
      let finalUrl = "";
      const deployUrlLine = lines.find(l => l.includes("https://") && l.includes("vercel.app"));
      if (deployUrlLine) {
        const matches = deployUrlLine.match(/https:\/\/[a-zA-Z0-9.-]+\.vercel\.app/);
        if (matches) finalUrl = matches[0];
      }
      if (!finalUrl) {
        const cleanLines = lines.map(l => l.trim()).filter(l => l.length > 0);
        for (const line of cleanLines) {
          if (line.includes("vercel.app") && line.startsWith("https://")) { finalUrl = line; break; }
        }
      }
      if (!finalUrl) finalUrl = `https://${slug}.vercel.app`;

      console.log(`[BUILD_DEPLOY] Deploy concluído! URL: ${finalUrl}`);

      if (projectId) {
        await updateDoc(doc(db, "generated_sites", projectId), {
          status: "approved",
          deployedUrl: finalUrl,
          builtFromParams: true,
          builtAt: new Date().toISOString()
        });
      }
    });

    res.json({ success: true, message: "Build e deploy iniciado!" });

  } catch (e: any) {
    console.error("Erro no build/deploy:", e.message);
    res.status(500).json({ error: e.message || "Failed to build and deploy site" });
  }
});

// POST /api/generate-commercial-reports
app.post("/api/generate-commercial-reports", async (req, res) => {
  try {
    const { companyName, niche } = req.body;
    if (!companyName || !niche) {
      return res.status(400).json({ error: "Company name and Niche are required." });
    }
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: "GROQ_API_KEY is not configured in .env" });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    
    // Prompt 1: Psicografia & Avatares de Compra
    console.log(`[COMMERCIAL_REPORTS] Gerando relatório psicográfico para ${companyName}...`);
    const responsePsicografia = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "Você é um especialista em psicologia de consumo e neuromarketing. Retorne estritamente um objeto JSON válido, sem tags markdown." },
        { role: "user", content: `Gere um dossiê analítico sobre "Psicografia & Avatares de Compra" para a empresa "${companyName}" do nicho "${niche}".
        A análise deve conter obrigatoriamente:
        1. doresETraumas (texto detalhando traumas antigos dos clientes com o mercado).
        2. desejosProfundos (o que o cliente realmente quer no nível subconsciente como status ou refúgio).
        3. objecoesEBarreiras (lista de medos que impedem de fechar).
        4. niveisDeConsciencia (definição se conhecem a solução).
        5. avatares (uma lista com 3 avatares contendo name, profile e scriptDeVenda gancho de comunicação).
        
        Retorne estritamente o formato JSON:
        {
          "doresETraumas": "...",
          "desejosProfundos": "...",
          "objecoesEBarreiras": ["...", "..."],
          "niveisDeConsciencia": "...",
          "avatares": [
            { "name": "Avatar 1", "profile": "...", "scriptDeVenda": "..." }
          ]
        }` }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const parsedPsicografia = JSON.parse(responsePsicografia.choices[0].message.content || "{}");

    // Prompt 2: Análise Estratégica
    console.log(`[COMMERCIAL_REPORTS] Gerando relatório de análise estratégica para ${companyName}...`);
    const responseEstrategica = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "Você é um consultor de posicionamento de mercado e Oceano Azul. Retorne estritamente um objeto JSON válido, sem tags markdown." },
        { role: "user", content: `Gere uma "Análise Estratégica" para a empresa "${companyName}" do nicho "${niche}".
        CRÍTICO: Ao apontar as fraquezas (weaknesses) dos concorrentes no benchmarking e os gapsDeMercado, você deve basear-se diretamente nestes 8 erros capitais de UX/Negócios que assolam o mercado:
        1. Bagunça visual/excesso de estímulos. 2. Layout desorganizado/labirinto. 3. Excesso de texto/falta de apelo visual. 4. Imagens amadoras/inadequadas. 5. Falta de clareza imediata. 6. Má experiência mobile/lentidão. 7. Oportunidades de venda desperdiçadas (cross-sell). 8. Falta de mecanismos de conversão claros.

        A análise deve conter obrigatoriamente:
        1. benchmarking (uma lista com 5 concorrentes do nicho, contendo name, strengths, weaknesses baseadas nos 8 erros acima, gaps).
        2. gapsDeMercado (espaço não ocupado, explorando as falhas de UX e negócios listadas).
        3. vantagensCompetitivas (os 6 pilares de diferenciação técnica).
        4. oceanoAzul (nichos pouco explorados).
        5. filtroDeComunicacao (lista de termos gastos e o que usar no lugar baseando-se em provas concretas).
        
        Retorne estritamente o formato JSON:
        {
          "benchmarking": [
            { "name": "...", "strengths": "...", "weaknesses": "...", "gaps": "..." }
          ],
          "gapsDeMercado": "...",
          "vantagensCompetitivas": ["...", "..."],
          "oceanoAzul": "...",
          "filtroDeComunicacao": [
            { "termoGasto": "...", "substitutoFatos": "..." }
          ]
        }` }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const parsedEstrategica = JSON.parse(responseEstrategica.choices[0].message.content || "{}");

    res.json({
      success: true,
      data: {
        psicografia: parsedPsicografia,
        estrategia: parsedEstrategica
      }
    });

  } catch (error: any) {
    console.error("Erro ao gerar relatórios comerciais:", error);
    res.status(500).json({ error: error.message || "Failed to generate commercial reports" });
  }
});

// ─── GOOGLE STITCH INTEGRATION ───────────────────────────────────────────

app.post("/api/stitch-generate", async (req, res) => {
  try {
    const { companyName, niche, website, phone, email, address, placeId, analysisData } = req.body;
    if (!companyName) {
      res.status(400).json({ success: false, error: "companyName é obrigatório" });
      return;
    }

    // 1. Configurar chave de API do Stitch
    const stitchApiKey = process.env.STITCH_API_KEY;
    if (!stitchApiKey) {
      res.status(500).json({ success: false, error: "STITCH_API_KEY não configurada no ambiente" });
      return;
    }
    process.env.STITCH_API_KEY = stitchApiKey;

    // 2. Importar SDK do Stitch
    const { stitch } = await import('@google/stitch-sdk');

    // 3. Extrair parâmetros de design da análise
    const primaryColor = analysisData?.primaryHex || req.body.primaryHex || '#00d1ff';
    const tone = analysisData?.tone || req.body.tone || 'Profissional e Persuasivo';
    const audience = analysisData?.audience || req.body.audience || '';
    const differentiators = analysisData?.differentiators || '';
    const palette = analysisData?.colors || '';

    // Mapear tom para fontes apropriadas
    const fontMap: Record<string, string> = {
      'Profissional e Persuasivo': 'INTER',
      'Casual e Amigável': 'DM_SANS',
      'Jovem e Descontraído': 'SPACE_GROTESK',
      'Técnico e Especializado': 'IBM_PLEX_SANS',
      'Luxuoso e Exclusivo': 'EB_GARAMOND',
      'Agressivo (Hard Sell)': 'MANROPE',
    };
    const bodyFont = fontMap[tone] || 'INTER';
    const headlineFont = tone === 'Luxuoso e Exclusivo' ? 'EB_GARAMOND' :
                         tone === 'Jovem e Descontraído' ? 'SPACE_GROTESK' : 'PLUS_JAKARTA_SANS';

    // 4. Criar projeto no Stitch
    console.log(`[STITCH] Criando projeto para: ${companyName}`);
    const project = await stitch.createProject(`${companyName} - Site Profissional`);

    // 5. Criar design system com a marca
    const designTheme: any = {
      overridePrimaryColor: primaryColor,
      customColor: primaryColor || '#02c5ba',
      bodyFont: bodyFont,
      headlineFont: headlineFont,
      colorMode: "LIGHT",
      roundness: "ROUND_EIGHT",
    };
    if (palette) {
      const colors = palette.split(',').map((c: string) => c.trim()).filter(Boolean);
      if (colors.length >= 2) {
        designTheme.overrideSecondaryColor = colors[1] || '#666666';
        designTheme.overrideTertiaryColor = colors[2] || '#999999';
      }
    }

    await project.createDesignSystem({
      displayName: `${companyName} - Identidade Visual`,
      theme: designTheme,
    });

    console.log(`[STITCH] Projeto criado: ${project.projectId}`);

    // 6. Gerar screens em paralelo
    const screenPrompts = [
      {
        key: 'hero',
        prompt: `Hero section for ${companyName} website in ${niche || 'service'} industry. Professional header with company name, headline about their main value proposition, subheadline, and a prominent call-to-action button. Include a navigation bar at top. Clean, modern design with primary color #${primaryColor.replace('#', '')}. Tone: ${tone}.`,
      },
      {
        key: 'about',
        prompt: `About us section for ${companyName}. Professional biography and company story section showing credibility, experience, and expertise. Include space for a professional photo. Trust-building content with certifications or qualifications. ${audience ? `Target audience: ${audience}.` : ''}`,
      },
      {
        key: 'services',
        prompt: `Services or solutions section for ${companyName} in ${niche || 'service'} industry. Grid or list layout showing 4-6 main services with icons, titles, and brief descriptions. Clean cards with hover effects. Professional medical/service aesthetic.`,
      },
      {
        key: 'testimonials',
        prompt: `Testimonials section with customer reviews and ratings for ${companyName}. Carousel or grid layout showing 3-4 testimonial cards with quote text, customer name, and star ratings. Social proof design with clean typography.`,
      },
      {
        key: 'faq',
        prompt: `FAQ section for ${companyName} website. Accordion-style layout with 4-6 frequently asked questions and answers. Clean, minimal design with expandable items. Professional and helpful tone.`,
      },
      {
        key: 'contact',
        prompt: `Contact section for ${companyName} website. Include contact form with name, email, phone, message fields. Also show phone number, email address, physical address. Clean professional design with the primary color #${primaryColor.replace('#', '')}.`,
      },
    ];

    console.log(`[STITCH] Gerando ${screenPrompts.length} screens...`);
    const screenResults = await Promise.allSettled(
      screenPrompts.map(sp => project.generate(sp.prompt))
    );

    // 7. Download HTML de cada screen e organizar resultados
    const sections: Record<string, { html: string; screenId: string; status: string }> = {};
    const downloadPromises: Promise<void>[] = [];

    screenPrompts.forEach((sp, idx) => {
      const result = screenResults[idx];
      if (result.status === 'fulfilled' && result.value) {
        const screen = result.value;
        sections[sp.key] = { html: '', screenId: screen.screenId, status: 'downloading' };

        downloadPromises.push(
          (async () => {
            try {
              const downloadUrl = await screen.getHtml();
              if (downloadUrl) {
                const htmlResp = await fetch(downloadUrl);
                sections[sp.key].html = await htmlResp.text();
                sections[sp.key].status = 'ok';
                console.log(`[STITCH] Screen ${sp.key} baixada (${sections[sp.key].html.length} chars)`);
              }
            } catch (e: any) {
              console.error(`[STITCH] Erro ao baixar HTML do screen ${sp.key}:`, e.message);
              sections[sp.key].status = 'download_failed';
            }
          })()
        );
      } else {
        sections[sp.key] = { html: '', screenId: '', status: 'generation_failed' };
        console.error(`[STITCH] Screen ${sp.key} falhou:`, result.status === 'rejected' ? result.reason : 'no screen returned');
      }
    });

    await Promise.all(downloadPromises);

    // 8. Compor página única com camada de animação premium
    const animationLayer = `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;700&family=Space+Grotesk:wght@400;500;600;700&family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">

    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" defer></script>

    <style>
      :root {
        --primary: ${primaryColor};
        --primary-rgb: ${parseInt(primaryColor.slice(1,3),16)}, ${parseInt(primaryColor.slice(3,5),16)}, ${parseInt(primaryColor.slice(5,7),16)};
        --font-body: '${bodyFont === 'INTER' ? 'Inter' : bodyFont === 'DM_SANS' ? 'DM Sans' : bodyFont === 'SPACE_GROTESK' ? 'Space Grotesk' : bodyFont === 'EB_GARAMOND' ? 'EB Garamond' : bodyFont === 'IBM_PLEX_SANS' ? 'IBM Plex Sans' : 'Inter'}', sans-serif;
        --font-headline: '${headlineFont === 'PLUS_JAKARTA_SANS' ? 'Plus Jakarta Sans' : headlineFont === 'EB_GARAMOND' ? 'EB Garamond' : headlineFont === 'SPACE_GROTESK' ? 'Space Grotesk' : 'Plus Jakarta Sans'}', sans-serif;
        --glass-bg: rgba(255,255,255,0.08);
        --glass-border: rgba(255,255,255,0.12);
        --glass-shadow: 0 8px 32px rgba(0,0,0,0.12);
      }
      html { scroll-behavior: smooth; }
      body {
        margin: 0;
        font-family: var(--font-body);
        background: #ffffff;
        color: #1a1a1a;
        overflow-x: hidden;
        -webkit-font-smoothing: antialiased;
      }
      h1, h2, h3, h4, h5, h6 { font-family: var(--font-headline); }

      /* Glassmorphism */
      .glass {
        background: var(--glass-bg);
        backdrop-filter: blur(16px) saturate(180%);
        -webkit-backdrop-filter: blur(16px) saturate(180%);
        border: 1px solid var(--glass-border);
        box-shadow: var(--glass-shadow);
      }
      .glass-nav {
        background: rgba(255,255,255,0.75);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border-bottom: 1px solid rgba(0,0,0,0.06);
      }

      /* Entrance Animations */
      .reveal { opacity: 0; transform: translateY(40px); transition: all 0.8s cubic-bezier(0.16,1,0.3,1); }
      .reveal.visible { opacity: 1; transform: translateY(0); }
      .reveal-left { opacity: 0; transform: translateX(-60px); transition: all 0.8s cubic-bezier(0.16,1,0.3,1); }
      .reveal-left.visible { opacity: 1; transform: translateX(0); }
      .reveal-right { opacity: 0; transform: translateX(60px); transition: all 0.8s cubic-bezier(0.16,1,0.3,1); }
      .reveal-right.visible { opacity: 1; transform: translateX(0); }
      .reveal-scale { opacity: 0; transform: scale(0.9); transition: all 0.8s cubic-bezier(0.16,1,0.3,1); }
      .reveal-scale.visible { opacity: 1; transform: scale(1); }

      /* Card Hover Effects */
      .hover-lift { transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease; }
      .hover-lift:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(0,0,0,0.12); }

      /* Shimmer Button (Prospecção) */
      .btn-shimmer {
        position: relative;
        overflow: hidden;
        background: linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd);
        border: none;
        color: #fff;
        font-weight: 700;
        padding: 1rem 2.5rem;
        border-radius: 12px;
        cursor: pointer;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      .btn-shimmer::after {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%);
        animation: shimmer 3s ease-in-out infinite;
      }
      @keyframes shimmer {
        0% { transform: translateX(-100%) rotate(25deg); }
        100% { transform: translateX(100%) rotate(25deg); }
      }
      .btn-shimmer:hover { transform: scale(1.05); box-shadow: 0 12px 40px rgba(0,0,0,0.2); }

      /* Parallax Wrapper */
      .parallax { will-change: transform; }

      /* Stitch section container */
      .stitch-section { max-width: 1200px; margin: 0 auto; padding: 5rem 1.5rem; }
      .stitch-section > * { animation: none; }

      /* Three.js Canvas Background */
      #three-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; pointer-events: none; }

      /* Scroll Progress Bar */
      #scroll-progress {
        position: fixed; top: 0; left: 0; width: 0%; height: 3px;
        background: linear-gradient(90deg, ${primaryColor}, ${primaryColor}88);
        z-index: 9999; transition: width 0.1s linear;
      }

      /* Smooth section transitions */
      section { position: relative; }
      section::before {
        content: '';
        position: absolute; top: 0; left: 0; right: 0; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(0,0,0,0.06), transparent);
      }

      @media (max-width: 768px) {
        .stitch-section { padding: 3rem 1rem; }
        .reveal { transform: translateY(24px); }
      }
    </style>

    <script>
      // Three.js Background Scene
      let threeScene, threeCamera, threeRenderer, threeMesh;
      function initThree() {
        try {
          threeScene = new THREE.Scene();
          threeCamera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
          threeRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
          threeRenderer.setSize(window.innerWidth, window.innerHeight);
          threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          const container = document.getElementById('three-bg');
          if (container) { container.appendChild(threeRenderer.domElement); }

          const geometry = new THREE.IcosahedronGeometry(1.2, 0);
          const material = new THREE.MeshBasicMaterial({
            color: ${primaryColor.replace('#', '0x')},
            wireframe: true,
            transparent: true,
            opacity: 0.06
          });
          threeMesh = new THREE.Mesh(geometry, material);
          threeScene.add(threeMesh);
          threeCamera.position.z = 3.5;
          animateThree();
        } catch(e) { console.log('[3D] Skipped:', e.message); }
      }
      function animateThree() {
        requestAnimationFrame(animateThree);
        if (threeMesh) {
          threeMesh.rotation.x += 0.002;
          threeMesh.rotation.y += 0.004;
        }
        if (threeRenderer) threeRenderer.render(threeScene, threeCamera);
      }

      // GSAP Scroll Animations
      function initGSAP() {
        if (typeof gsap === 'undefined') { useIntersectionObserver(); return; }
        gsap.registerPlugin(ScrollTrigger);

        gsap.utils.toArray('.stitch-section').forEach((section, i) => {
          const direction = i % 2 === 0 ? -30 : 30;
          gsap.fromTo(section,
            { opacity: 0, y: 50 },
            {
              opacity: 1, y: 0,
              duration: 1.0,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                end: 'top 40%',
                toggleActions: 'play none none reverse'
              }
            }
          );

          // Parallax on inner elements
          const innerElements = section.querySelectorAll('h1, h2, h3, p, img, .card, button');
          innerElements.forEach((el, j) => {
            gsap.fromTo(el,
              { opacity: 0, y: 30 + (j * 10) },
              {
                opacity: 1, y: 0,
                duration: 0.7,
                delay: j * 0.08,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: section,
                  start: 'top 82%',
                  toggleActions: 'play none none reverse'
                }
              }
            );
          });
        });

        // Nav glass on scroll
        const nav = document.querySelector('nav, header');
        if (nav) {
          ScrollTrigger.create({
            start: 'top -40px',
            onUpdate: (self) => {
              if (self.progress > 0) {
                nav.classList.add('glass-nav');
              } else {
                nav.classList.remove('glass-nav');
              }
            }
          });
        }
      }

      // Fallback: Intersection Observer
      function useIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            }
          });
        }, { threshold: 0.15 });

        document.querySelectorAll('.stitch-section').forEach(s => {
          s.classList.add('reveal');
          observer.observe(s);
          // Also observe children for staggered animation
          s.querySelectorAll('h1, h2, h3, p, img, .card, button').forEach((el, i) => {
            el.style.transitionDelay = (i * 0.08) + 's';
            el.classList.add('reveal');
            observer.observe(el);
          });
        });
      }

      // Scroll Progress Bar
      function initScrollProgress() {
        const bar = document.getElementById('scroll-progress');
        if (!bar) return;
        window.addEventListener('scroll', () => {
          const h = document.documentElement.scrollHeight - window.innerHeight;
          bar.style.width = (window.scrollY / h * 100) + '%';
        });
      }

      // Count-up Animation
      function initCounters() {
        document.querySelectorAll('[data-count]').forEach(el => {
          const target = parseInt(el.dataset.count);
          const duration = 2000;
          const start = performance.now();
          function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            el.textContent = Math.floor(progress * target).toLocaleString('pt-BR');
            if (progress < 1) requestAnimationFrame(update);
          }
          const obs = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) { requestAnimationFrame(update); obs.unobserve(el); }
          }, { threshold: 0.5 });
          obs.observe(el);
        });
      }

      // Smooth Anchor Scroll
      document.addEventListener('click', (e) => {
        const a = e.target.closest('a[href^="#"]');
        if (a) {
          e.preventDefault();
          const target = document.querySelector(a.getAttribute('href'));
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });

      // Init on DOM ready
      document.addEventListener('DOMContentLoaded', () => {
        initThree();
        initGSAP();
        initScrollProgress();
        initCounters();
      });
    </script>
    `;

    let composedHtml = `<!DOCTYPE html><html lang="pt-BR"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${companyName} - Site Oficial</title>
<style>
:root { --primary: ${primaryColor}; --font-body: '${bodyFont.toLowerCase()}', sans-serif; --font-headline: '${headlineFont.toLowerCase()}', sans-serif; }
body { margin: 0; font-family: var(--font-body); }
</style>
${animationLayer}
</head><body>
<div id="three-bg"></div>
<div id="scroll-progress"></div>`;

    const sectionOrder = ['hero', 'about', 'services', 'testimonials', 'faq', 'contact'];
    for (const key of sectionOrder) {
      const sec = sections[key];
      if (sec && sec.html) {
        composedHtml += `\n<section id="${key}" class="stitch-section">${sec.html}</section>\n`;
      }
    }

    composedHtml += `\n</body></html>`;

    // 9. Salvar no Firestore
    await ensureAuth();
    const docId = project.projectId;
    const siteData = {
      projectId: docId,
      companyName,
      niche: niche || '',
      status: 'pending',
      score: 90,
      createdAt: Date.now(),
      htmlUrl: '',
      deployedUrl: '',
      originalUrl: website || '',
      phone: phone || '',
      email: email || '',
      address: address || '',
      placeId: placeId || '',
      stitchedSections: Object.keys(sections).filter(k => sections[k].status === 'ok'),
      analysis: JSON.stringify(analysisData || {}),
    };

    await setDoc(doc(db, "generated_sites", docId), siteData);

    console.log(`[STITCH] Site salvo no Firestore: ${docId}`);

    // 10. Salvar HTML composto em disco para preview
    const previewDir = path.join(process.cwd(), 'public', 'stitch-previews');
    if (!fs.existsSync(previewDir)) fs.mkdirSync(previewDir, { recursive: true });

    const previewPath = path.join(previewDir, `${docId}.html`);
    fs.writeFileSync(previewPath, composedHtml, 'utf-8');

    res.json({
      success: true,
      projectId: docId,
      stitchProjectId: project.projectId,
      companyName,
      sections: Object.fromEntries(
        Object.entries(sections).map(([k, v]) => [k, { screenId: v.screenId, status: v.status, size: v.html.length }])
      ),
      previewUrl: `/stitch-previews/${docId}.html`,
      message: `Site gerado com sucesso via Google Stitch! ${Object.values(sections).filter(s => s.status === 'ok').length}/${screenPrompts.length} screens prontos.`,
    });

  } catch (error: any) {
    console.error("[STITCH_GENERATE] Erro:", error);
    res.status(500).json({ success: false, error: error.message || "Erro ao gerar site via Stitch" });
  }
});

// GET /api/stitch-projects - Listar projetos Stitch do usuário
app.get("/api/stitch-projects", async (_req, res) => {
  try {
    const stitchApiKey = process.env.STITCH_API_KEY;
    if (!stitchApiKey) {
      res.status(500).json({ success: false, error: "STITCH_API_KEY não configurada" });
      return;
    }
    process.env.STITCH_API_KEY = stitchApiKey;

    const { stitch } = await import('@google/stitch-sdk');
    const projects = await stitch.projects();

    res.json({
      success: true,
      data: projects.map(p => ({
        projectId: p.projectId,
        title: p.data?.title || p.data?.name || '',
        screenCount: p.data?.screenInstances?.length || 0,
      }))
    });
  } catch (error: any) {
    console.error("[STITCH_PROJECTS] Erro:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default app;
