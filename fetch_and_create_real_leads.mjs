import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';

// 1. Inicializar o Firebase
const firebaseConfig = JSON.parse(readFileSync(new URL('./firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Função para chamar a IA na API de Produção
async function callProductionAI(promptText, jsonMode = false) {
  try {
    const response = await fetch("https://escom-studio.vercel.app/api/generate-copy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ promptText, jsonMode })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data.success) {
      if (jsonMode) {
        // Remover blocos de código markdown se a IA colocar mesmo com jsonMode
        let text = data.text.trim();
        if (text.startsWith("```json")) {
          text = text.replace(/^```json/, "").replace(/```$/, "").trim();
        } else if (text.startsWith("```")) {
          text = text.replace(/^```/, "").replace(/```$/, "").trim();
        }
        return JSON.parse(text);
      }
      return data.text;
    } else {
      throw new Error(data.error || "Geração de cópia falhou");
    }
  } catch (err) {
    console.error("Erro na chamada callProductionAI:", err);
    return null;
  }
}

// Função auxiliar para calcular score
function calculateLeadScore(ratingCount, website, issuesCount) {
  let score = 50;
  if (ratingCount > 500) {
    score -= 20;
  } else if (ratingCount >= 20 && ratingCount <= 250) {
    score += 25;
  } else if (ratingCount > 0 && ratingCount < 10) {
    score -= 10;
  }

  if (website && website.length > 5) {
    if (issuesCount >= 6) {
      score += 20;
    } else if (issuesCount <= 2) {
      score -= 30;
    } else {
      score += 5;
    }
  } else {
    score += 25;
  }
  return Math.max(0, Math.min(100, score));
}

// Função auxiliar para mapear templates por nicho e gerar nota flutuante
function getSiteParams(niche) {
  const n = (niche || "").toLowerCase();
  const score = Math.floor(Math.random() * (98 - 88 + 1)) + 88;
  let template = "template-clinica";
  
  if (n.includes("advocacia") || n.includes("direito") || n.includes("advogado")) {
    template = "template-silva-associados";
  } else if (n.includes("mecânica") || n.includes("oficina") || n.includes("centro automotivo") || n.includes("autocenter") || n.includes("veículos")) {
    template = "template-silva-autocenter";
  } else if (n.includes("dentista") || n.includes("odontologia") || n.includes("ortodontia")) {
    template = "template-oralfix";
  } else if (n.includes("quiropraxia") || n.includes("chiropractor") || n.includes("fisioterapia")) {
    template = "template-chiroandmovement";
  } else if (n.includes("nutrição") || n.includes("personal") || n.includes("academia") || n.includes("fitness") || n.includes("saúde")) {
    template = "template-chiroandmovement";
  } else if (n.includes("estética") || n.includes("biomedicina") || n.includes("harmonização") || n.includes("spa")) {
    template = "template-belini";
  } else if (n.includes("psicologia") || n.includes("terapia") || n.includes("pediatria")) {
    template = "template-giovana-lumertz";
  }
  
  return { score, url: `https://escom-studio.vercel.app/${template}/index.html` };
}

// Executar população dos leads
async function run() {
  console.log("Iniciando fluxo de importação e criação de leads reais via API de Produção...");

  // ==========================================
  // 1. Dra Ana Paula (SP)
  // ==========================================
  console.log("\n--- PROCESSANDO LEAD 1: Dra Ana Paula (SP) ---");
  
  const sitePlanPromptAna = `Você é Edu Santos, especialista em design de landing pages e conversão. Crie um plano estratégico de prospecção de site (para venda de Landing Page) para a empresa "Dra. Ana Paula Gonçalves - Biomedicina Estética" do nicho "Biomedicina Estética São Paulo" que atualmente não possui site.
  
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
  Gere pelo menos 5 seções estratégicas.`;

  console.log("Gerando sitePlan para Dra Ana Paula...");
  const sitePlanAna = await callProductionAI(sitePlanPromptAna, true);

  const markdownPromptAna = `Crie um relatório estratégico em markdown explicando os benefícios de ter uma Landing Page de Alta Performance para a empresa "Dra. Ana Paula Gonçalves - Biomedicina Estética" do nicho de "Biomedicina Estética São Paulo".
  O formato deve conter:
  ### Oportunidade Digital para Dra. Ana Paula Gonçalves
  (Explicar por que estar sem site hoje significa perder clientes de alto valor no nicho de biomedicina estética)
  
  ### Estrutura Recomendada para o Novo Protótipo
  (Explicar as seções principais da Landing Page de alta conversão, psicologia de cores premium e call to action direta no WhatsApp)
  
  ### Por que a ESCOM Studio?
  (Explicar nossa metodologia focada em otimização extrema, velocidade de carregamento menor que 1 segundo e design premium)
  
  Não use código ou json, apenas o markdown final direto.`;

  console.log("Gerando análise em markdown para Dra Ana Paula...");
  const markdownAna = await callProductionAI(markdownPromptAna, false);

  const scoreAna = calculateLeadScore(15, "", 0);

  const leadAna = {
    title: "Dra. Ana Paula Gonçalves - Biomedicina Estética",
    address: "Rua Roque Petrella, 46 - 805, Brooklin, São Paulo - SP, 04581-050",
    phone: "(11) 98543-9973",
    website: "",
    rating: 5,
    ratingCount: 15,
    placeId: "dra_ana_paula_sp",
    status: "pending",
    niche: "Biomedicina Estética São Paulo",
    auditData: null,
    sitePlan: sitePlanAna,
    score: scoreAna,
    createdAt: Date.now()
  };

  const proposalAna = {
    id: "proposta-escom-dra-ana-paula",
    clientName: "Dra. Ana Paula Gonçalves",
    email: "contato@draanapaula.com.br",
    phone: "11985439973",
    company: "Dra. Ana Paula Gonçalves - Biomedicina Estética",
    budget: "990,00",
    selectedServices: [
      { id: 1, name: "Landing Page Alta Conversão", price: "990,00" }
    ],
    observations: "Proposta exclusiva para desenvolvimento de posicionamento digital e Landing Page de Alta Conversão na Biomedicina Estética. A oferta é válida por 3 dias.",
    status: "pendente",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    sentToSheets: false
  };

  const paramsAna = getSiteParams(leadAna.niche);
  const siteAna = {
    score: paramsAna.score,
    companyName: "Dra. Ana Paula Gonçalves - Biomedicina Estética",
    originalUrl: "",
    status: "pending",
    analysis: markdownAna,
    deployedUrl: paramsAna.url,
    createdAt: Date.now(),
    screenId: "d0aefb2fabe24fd5819ec7029356002c",
    niche: "Biomedicina Estética",
    htmlUrl: "",
    projectId: "14582573840495252447"
  };

  console.log("Salvando Dra Ana Paula no Firestore...");
  await setDoc(doc(db, "leads", "dra_ana_paula_sp"), leadAna);
  await setDoc(doc(db, "proposals", "proposta-escom-dra-ana-paula"), proposalAna);
  await setDoc(doc(db, "generated_sites", "14582573840495252447"), siteAna);
  console.log("Dra Ana Paula salva com sucesso!");

  // ==========================================
  // 2. Dra Elizabete (Curitiba)
  // ==========================================
  console.log("\n--- PROCESSANDO LEAD 2: Dra Elizabete (Curitiba) ---");
  
  const sitePlanPromptEli = `Você é Edu Santos, especialista em design de landing pages e conversão. Crie um plano estratégico de prospecção de site (para venda de Landing Page) para a empresa "Dra. Elizabete De Marchi - Biomedicina Estética Avançada" do nicho "Biomedicina Estética Curitiba" que atualmente não possui site.
  
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
  Gere pelo menos 5 seções estratégicas.`;

  console.log("Gerando sitePlan para Dra Elizabete...");
  const sitePlanEli = await callProductionAI(sitePlanPromptEli, true);

  const markdownPromptEli = `Crie um relatório estratégico em markdown explicando os benefícios de ter uma Landing Page de Alta Performance para a empresa "Dra. Elizabete De Marchi - Biomedicina Estética Avançada" do nicho de "Biomedicina Estética Curitiba".
  O formato deve conter:
  ### Oportunidade Digital para Dra. Elizabete De Marchi
  (Explicar por que estar sem site hoje significa perder clientes de alto valor no nicho de biomedicina estética)
  
  ### Estrutura Recomendada para o Novo Protótipo
  (Explicar as seções principais da Landing Page de alta conversão, psicologia de cores premium e call to action direta no WhatsApp)
  
  ### Por que a ESCOM Studio?
  (Explicar nossa metodologia focada em otimização extrema, velocidade de carregamento menor que 1 segundo e design premium)
  
  Não use código ou json, apenas o markdown final direto.`;

  console.log("Gerando análise em markdown para Dra Elizabete...");
  const markdownEli = await callProductionAI(markdownPromptEli, false);

  const scoreEli = calculateLeadScore(22, "", 0);

  const leadEli = {
    title: "Dra. Elizabete De Marchi - Biomedicina Estética Avançada",
    address: "Av. Sete de Setembro, 5402 - Batel, Curitiba - PR, 80240-000",
    phone: "(41) 99665-5769",
    website: "",
    rating: 5,
    ratingCount: 22,
    placeId: "dra_elizabete_curitiba",
    status: "pending",
    niche: "Biomedicina Estética Curitiba",
    auditData: null,
    sitePlan: sitePlanEli,
    score: scoreEli,
    createdAt: Date.now()
  };

  const proposalEli = {
    id: "proposta-escom-dra-elizabete",
    clientName: "Dra. Elizabete De Marchi",
    email: "contato@draelizabete.com.br",
    phone: "41996655769",
    company: "Dra. Elizabete De Marchi - Biomedicina Estética Avançada",
    budget: "990,00",
    selectedServices: [
      { id: 1, name: "Landing Page Alta Conversão", price: "990,00" }
    ],
    observations: "Proposta de posicionamento estratégico digital e criação de Landing Page Premium de alta conversão. A oferta fica válida por 3 dias.",
    status: "pendente",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    sentToSheets: false
  };

  const paramsEli = getSiteParams(leadEli.niche);
  const siteEli = {
    score: paramsEli.score,
    companyName: "Dra. Elizabete De Marchi - Biomedicina Estética Avançada",
    originalUrl: "https://www.draelizabetedemarchi.com.br",
    status: "pending",
    analysis: markdownEli,
    deployedUrl: paramsEli.url,
    createdAt: Date.now(),
    screenId: "d0aefb2fabe24fd5819ec7029356002c",
    niche: "Biomedicina Estética",
    htmlUrl: "",
    projectId: "8244073350648594250"
  };

  console.log("Salvando Dra Elizabete no Firestore...");
  await setDoc(doc(db, "leads", "dra_elizabete_curitiba"), leadEli);
  await setDoc(doc(db, "proposals", "proposta-escom-dra-elizabete"), proposalEli);
  await setDoc(doc(db, "generated_sites", "8244073350648594250"), siteEli);
  console.log("Dra Elizabete salva com sucesso!");

  // ==========================================
  // 3. Miami Chiropractic & Wellness (EUA)
  // ==========================================
  console.log("\n--- PROCESSANDO LEAD 3: Miami Chiropractic (EUA) ---");
  
  const auditPromptMiami = `You are a senior UX/UI, Heuristics and CRO Director. The target website is: https://miamichiropracticwellness.com/ for the chiropractor clinic 'Miami Chiropractic & Wellness'. Do a complete website UX/UI audit based on your knowledge or domain analysis.
  
  Return ONLY a valid JSON. Do not include Markdown.
  Required format:
  { 
    "summary": "A professional analytical summary focused on conversion flaws in the current website.", 
    "brandAnalysis": {
      "companyName": "Miami Chiropractic & Wellness",
      "niche": "Chiropractor Clinic",
      "audience": "detailed description of the target audience",
      "differentiators": "suggested differentiators",
      "tone": "appropriate tone of voice",
      "colors": "suggested color palette",
      "primaryHex": "#hex color"
    },
    "issues": [
      { 
        "category": "tipografia",
        "tab": "IDENTIDADE VISUAL E UI",
        "title": "Short title in English focusing on the problem.",
        "description": "Technical explanation in English of the conversion leakage.",
        "recommendation": "Step-by-step correction in English."
      }
    ]
  }
  Generate exactly 6 to 8 issues distributed across the tabs.
  Note: The 'category' keys must be one of: "tipografia" | "cores" | "heuristica" | "vies" | "arquitetura" | "acessibilidade".
  The 'tab' keys must be EXACTLY one of: "IDENTIDADE VISUAL E UI" | "HEURÍSTICAS DE NIELSEN" | "VIESES COGNITIVOS E PSICOLOGIA" | "ARQUITETURA DA INFORMAÇÃO" | "ACESSIBILIDADE E INCLUSÃO" (so the frontend maps them properly), but the 'title', 'description', and 'recommendation' values must be written in English.`;

  console.log("Gerando auditoria de UX (em inglês) para Miami Chiropractic...");
  const auditDataMiami = await callProductionAI(auditPromptMiami, true);

  const markdownPromptMiami = `Create a strategic redesign report in markdown for the company "Miami Chiropractic & Wellness" (website: https://miamichiropracticwellness.com/).
  The format must contain:
  ### Original Website Audit (https://miamichiropracticwellness.com/)
  (Explain the main conversion leaks: lack of clear CTA above the fold, slow page load, mobile responsiveness issues, and high cognitive load)
  
  ### Strategic Analysis of the New Prototype
  (Explain our redesigned experience: premium aesthetic using smooth glassmorphism, clear hero section with instant booking CTA, optimized typography like Inter, and ultra-fast load time)
  
  ### Why ESCOM Studio?
  (Detail our methodology of custom high-conversion designs, extreme speed optimization, and professional branding without templates)
  
  Do not use code or json, output only the final markdown.`;

  console.log("Gerando análise em markdown (em inglês) para Miami Chiropractic...");
  const markdownMiami = await callProductionAI(markdownPromptMiami, false);

  const issuesCountMiami = auditDataMiami?.issues?.length || 0;
  const scoreMiami = calculateLeadScore(84, "https://miamichiropracticwellness.com/", issuesCountMiami);

  const leadMiami = {
    title: "Miami Chiropractic & Wellness",
    address: "1149 NW 36th St, Miami, FL 33127, United States",
    phone: "+13053224007",
    website: "https://miamichiropracticwellness.com/",
    rating: 4.9,
    ratingCount: 84,
    placeId: "miami_chiropractic_wellness",
    status: "pending",
    niche: "Chiropractor Miami",
    auditData: auditDataMiami,
    sitePlan: null,
    score: scoreMiami,
    createdAt: Date.now()
  };

  const proposalMiami = {
    id: "proposta-escom-miami-chiropractic-wellness",
    clientName: "Miami Chiropractic Team",
    email: "info@miamichiropracticwellness.com",
    phone: "13053224007", // formato DDI + phone sem '+'
    company: "Miami Chiropractic & Wellness",
    budget: "990.00",
    selectedServices: [
      { id: 1, name: "Premium High-Conversion Landing Page", price: "990" }
    ],
    observations: "Specialized high-performance Landing Page proposal. Our design eliminates cognitive noise, introduces crystal-clear calls-to-action, and ensures mobile optimization. Offer valid for 3 days.",
    status: "pendente",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    sentToSheets: false,
    isAmerican: true,
    currency: "USD"
  };

  const paramsMiami = getSiteParams(leadMiami.niche);
  const siteMiami = {
    score: paramsMiami.score,
    companyName: "Miami Chiropractic & Wellness",
    originalUrl: "https://miamichiropracticwellness.com/",
    status: "pending",
    analysis: markdownMiami,
    deployedUrl: paramsMiami.url,
    createdAt: Date.now(),
    screenId: "d0aefb2fabe24fd5819ec7029356002c",
    niche: "Chiropractor",
    htmlUrl: "",
    projectId: "16689071719369495606"
  };

  console.log("Salvando Miami Chiropractic no Firestore...");
  await setDoc(doc(db, "leads", "miami_chiropractic_wellness"), leadMiami);
  await setDoc(doc(db, "proposals", "proposta-escom-miami-chiropractic-wellness"), proposalMiami);
  await setDoc(doc(db, "generated_sites", "16689071719369495606"), siteMiami);
  console.log("Miami Chiropractic salvo com sucesso!");

  console.log("\nTodos os leads reais foram gerados, analisados e salvos com sucesso no Firestore!");
  process.exit(0);
}

run().catch(err => {
  console.error("Erro fatal ao rodar script:", err);
  process.exit(1);
});
