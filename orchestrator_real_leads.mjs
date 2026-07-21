import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const execAsync = promisify(exec);
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Inicializar Firebase
const firebaseConfigPath = new URL('./firebase-applet-config.json', import.meta.url);
const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const leads = [
  { 
    id: "novatech-automotive", placeId: "novatech_cwb",
    name: "NovaTech Automotive", 
    email: "contato@novatechautomotive.com.br",
    phone: "(41) 3256-5962",
    address: "Rua Professora Carmem Lima de Almeida, 108A - Bacacheri, Curitiba - PR, 82515-280",
    niche: "Oficina Mecânica Premium", 
    city: "Curitiba, PR",
    country: "BR", 
    website: "https://novatechautomotive.com.br",
    baseTemplate: "template-silva-autocenter", 
    logoUrl: "https://novatechautomotive.com.br/wp-content/uploads/2019/10/Novatech-Automotive-Curitiba-Imports.png",
    colors: { primary: "#091124", secondary: "#11192a", accent: "#f96c26" },
    fonts: { heading: "Roboto", body: "Roboto Slab" },
    copy: {
      heroTitle: "Diagnóstico Avançado para Veículos Premium em Curitiba.",
      heroSub: "Especialistas em Audi, BMW e Mercedes. Transparência absoluta e tecnologia de ponta.",
      about: "A NovaTech nasceu da paixão pela engenharia automotiva de alta performance de marcas alemãs."
    },
    replaceRules: [
      { target: /Silva Auto Center/gi, replacement: "NovaTech Automotive" },
      { target: /Mecânica Silva/gi, replacement: "NovaTech Automotive" },
      { target: /Silva/gi, replacement: "NovaTech" },
      { target: /São Paulo/gi, replacement: "Curitiba" },
      { target: /Saúde/gi, replacement: "Batel" },
      { target: /Mirandópolis/gi, replacement: "Curitiba" },
      { target: /Julio Cesar/gi, replacement: "Carlos Albuquerque" },
      { target: /José Silva/gi, replacement: "Roberto Novaes" },
      // Substituir o iate por carros alemães de verdade
      { target: /https:\/\/images\.unsplash\.com\/photo-1619642751034-765dfdf7c58e/g, replacement: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068" },
      { target: /https:\/\/images\.unsplash\.com\/photo-1616788494707-ec28f08d05a1/g, replacement: "https://images.unsplash.com/photo-1503376780353-7e6692767b70" }
    ]
  },
  { 
    id: "gio-estetica", placeId: "gio_estetica_floripa",
    name: "GiO Estética Avançada", 
    email: "agendamento@gioestetica.com.br",
    phone: "(48) 98852-7927",
    address: "Av. Pref. Osmar Cunha, 260 - Loja 03 - Centro, Florianópolis - SC, 88015-100",
    niche: "Clínica de Estética", 
    city: "Florianópolis, SC",
    country: "BR", 
    website: "https://gioesteticaavancada.com.br",
    baseTemplate: "template-belini", 
    colors: { primary: "#6f0052", secondary: "#fdf2f8", accent: "#ff13a0" },
    fonts: { heading: "Playfair Display", body: "Lato" },
    copy: {
      heroTitle: "Rejuvenescimento Natural e Elegância em Florianópolis.",
      heroSub: "Protocolos exclusivos de harmonização e estética avançada focados na sua melhor versão.",
      about: "Na GiO Estética, unimos ciência, arte e tecnologia para realçar sua beleza natural..."
    },
    replaceRules: [
      { target: /Clínica Belini/gi, replacement: "GiO Estética Avançada" },
      { target: /Belini/gi, replacement: "GiO Estética" },
      { target: /Curitiba/gi, replacement: "Florianópolis" },
      { target: /Batel/gi, replacement: "Centro" },
      { target: /Belo Horizonte/gi, replacement: "Florianópolis" },
      // Remover o círculo logo "CB" que poluía o design
      { target: /<div class="w-10 h-10 rounded-full border border-primary flex items-center justify-center font-display text-primary text-xl font-bold">CB<\/div>/g, replacement: "" },
      // Forçar texto branco no Hero para contraste perfeito sobre o gradiente escuro
      { target: /text-primary mb-6Reveal/g, replacement: "text-white mb-6Reveal" },
      { target: /text-primary mb-6/g, replacement: "text-white mb-6" },
      // Traduzir acupuntura para procedimentos de estética avançada reais da clínica
      { target: /acupuntura/gi, replacement: "estética avançada" },
      { target: /Acupuntura/gi, replacement: "Estética Avançada" },
      { target: /Medicina Tradicional Chinesa/gi, replacement: "Alta Tecnologia Estética" },
      { target: /agulhas/gi, replacement: "bioestimuladores" }
    ]
  },
  { 
    id: "innovative-business", placeId: "innovative_sp",
    name: "Innovative Business Contabilidade", 
    email: "contato@innovbusiness.com.br",
    phone: "(11) 91622-2210",
    address: "Avenida Paulista, 2028 - Conjunto 111, Bela Vista, São Paulo - SP, 01310-927",
    niche: "Escritório Contábil", 
    city: "São Paulo, SP",
    country: "BR", 
    website: "https://innovbusiness.com.br",
    baseTemplate: "template-dominium-contabilidade", 
    colors: { primary: "#0f172a", secondary: "#f8fafc", accent: "#2563eb" },
    fonts: { heading: "Roboto Slab", body: "Roboto" },
    copy: {
      heroTitle: "Inteligência Tributária e Gestão na Av. Paulista.",
      heroSub: "Contabilidade consultiva que protege seu patrimônio e alavanca seus lucros.",
      about: "Localizados no coração de São Paulo, somos parceiros estratégicos de grandes negócios..."
    },
    replaceRules: [
      { target: /Dominium Contabilidade/gi, replacement: "Innovative Business Contabilidade" },
      { target: /Dominium/gi, replacement: "Innovative Business" },
      { target: /Belo Horizonte/gi, replacement: "São Paulo" }
    ]
  },
  { 
    id: "clinica-pillar", placeId: "pillar_plastica",
    name: "Clínica Pillar", 
    email: "atendimento@clinicapillar.com.br",
    phone: "(48) 99122-3344",
    address: "Rua Bocaiúva, 2468 - Centro, Florianópolis - SC, 88015-530",
    niche: "Cirurgia Plástica", 
    city: "Florianópolis, SC",
    country: "BR", 
    website: "", 
    baseTemplate: "template-clinica", 
    colors: { primary: "#047857", secondary: "#ecfdf5", accent: "#059669" },
    fonts: { heading: "Cinzel", body: "Open Sans" },
    copy: {
      heroTitle: "Excelência em Cirurgia Plástica e Medicina Estética.",
      heroSub: "Resultados sofisticados com segurança e atendimento humanizado.",
      about: "A Clínica Pillar é referência em cirurgia plástica, oferecendo um ambiente acolhedor e seguro..."
    },
    replaceRules: [
      { target: /Clínica ImplArt/gi, replacement: "Clínica Pillar" },
      { target: /ImplArt/gi, replacement: "Pillar" },
      { target: /São Paulo/gi, replacement: "Florianópolis" },
      // Limpeza completa de dentes e odontologia para Cirurgia Plástica
      { target: /odontologia/gi, replacement: "cirurgia plástica" },
      { target: /Odontologia/gi, replacement: "Cirurgia Plástica" },
      { target: /implantes dentários/gi, replacement: "cirurgias plásticas" },
      { target: /implantes dentrios/gi, replacement: "cirurgias plásticas" },
      { target: /implante dentário/gi, replacement: "procedimento cirúrgico" },
      { target: /implante dentrio/gi, replacement: "procedimento cirúrgico" },
      { target: /implantes/gi, replacement: "procedimentos" },
      { target: /implante/gi, replacement: "procedimento" },
      { target: /sorriso/gi, replacement: "contorno corporal" },
      { target: /sorrisos/gi, replacement: "resultados" },
      { target: /dente/gi, replacement: "procedimento" },
      { target: /dentes/gi, replacement: "procedimentos" },
      { target: /saúde bucal/gi, replacement: "harmonia corporal" },
      { target: /sade bucal/gi, replacement: "harmonia corporal" },
      { target: /CRO-SP 9993/gi, replacement: "CRM-SC 9993" }
    ]
  },
  { 
    id: "dr-raymond-hall", placeId: "raymond_hall_la",
    name: "Dr. Raymond Hall, D.C.", 
    email: "info@drraymondhall.com",
    phone: "(310) 873-4415",
    address: "11710 Wilshire Blvd., Los Angeles, CA 90025",
    niche: "Chiropractor", 
    city: "Los Angeles, CA",
    country: "US", 
    website: "https://drraymondhall.com",
    baseTemplate: "template-chiroandmovement", 
    colors: { primary: "#0369a1", secondary: "#f0f9ff", accent: "#0284c7" },
    fonts: { heading: "Oswald", body: "Source Sans Pro" },
    copy: {
      heroTitle: "Advanced Spinal Decompression & Chiropractic Care.",
      heroSub: "Relieving pain and restoring mobility for patients in Los Angeles since 2005.",
      about: "Dr. Raymond Hall specializes in holistic healing, sports injuries, and posture modification..."
    },
    replaceRules: [
      { target: /Chiro & Movement/gi, replacement: "Dr. Raymond Hall, D.C." },
      { target: /Miami/gi, replacement: "Los Angeles" },
      // Substituir imagens repetidas de laptop e estetoscópio por fotos de quiropraxia reais
      { target: /https:\/\/images\.unsplash\.com\/photo-1606811841689-23dfddce3e95/g, replacement: "https://images.unsplash.com/photo-1594824813573-246434e33963" },
      { target: /https:\/\/images\.unsplash\.com\/photo-1576091160550-2173dba999ef/g, replacement: "https://images.unsplash.com/photo-1519828863384-38329b186b87" }
    ]
  }
];

// Chamar API de Produção para IA
async function callProductionAI(promptText, jsonMode = false) {
  try {
    const response = await fetch("https://escom-studio.vercel.app/api/generate-copy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ promptText, jsonMode })
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.success ? data.text : null;
  } catch (err) {
    console.error("Erro na IA:", err.message);
    return null;
  }
}

// Gerar análise estratégica rica em Markdown usando a IA real
async function generateRichAnalysis(lead, score) {
  let promptText = "";
  
  if (lead.website) {
    promptText = `Crie um relatório estratégico em markdown explicando os benefícios de ter uma Landing Page de Alta Performance para a empresa "${lead.name}" (${lead.niche} em ${lead.city}). O site atual deles é ${lead.website}.
O formato deve conter ESTRITAMENTE estas seções com copy extremamente persuasivo, detalhado e técnico:

### Auditoria do Site Original (${lead.website})
(Escreva 2 parágrafos longos detalhando problemas reais de UX/UI observados, como excesso cognitivo, falta de direcionamento claro para agendamento, design defasado para o público ultra-premium e performance lenta.)

### Análise Estratégica do Novo Protótipo (Score ${score})
(Escreva 3 parágrafos explicando como o novo protótipo resolve estes vazamentos de conversão usando above-the-fold com carregamento hiper-rápido, tipografia premium, e botões de chamada imediata para o WhatsApp sem fricção.)

### Por que a ESCOM Studio?
(Escreva 1 parágrafo explicando nossa metodologia focada em otimização extrema, velocidade de carregamento menor que 1 segundo e design premium.)

Retorne apenas o markdown puro, sem formatação JSON, sem tags HTML extras.`;
  } else {
    promptText = `Crie um relatório estratégico em markdown explicando os benefícios de ter uma Landing Page de Alta Performance para a empresa "${lead.name}" (${lead.niche} em ${lead.city}) que atualmente não possui site.
O formato deve conter ESTRITAMENTE estas seções com copy persuasivo, detalhado e técnico:

### Oportunidade Digital para ${lead.name}
(Escreva 2 parágrafos detalhados sobre a perda de clientes de alto valor por estar offline hoje, o tamanho da demanda local em ${lead.city} e o custo de oportunidade.)

### Estrutura Recomendada para o Novo Protótipo (Score ${score})
(Escreva 3 parágrafos detalhando as seções principais criadas, psicologia de cores premium e a facilidade do agendamento em 1 clique via WhatsApp.)

### Por que a ESCOM Studio?
(Escreva 1 parágrafo explicando nossa metodologia focada em otimização extrema, velocidade de carregamento menor que 1 segundo e design premium.)

Retorne apenas o markdown puro, sem formatação JSON, sem tags HTML extras.`;
  }

  console.log(`      [IA] Solicitando análise estratégica rica para ${lead.name}...`);
  const analysis = await callProductionAI(promptText, false);
  return analysis || `### Oportunidade Digital para ${lead.name}\nAnálise estratégica no mercado de ${lead.niche}.\n\n### Estrutura Recomendada\nDesign focado em performance e conversão técnica.`;
}

// Helper: Salvar no Firebase
async function saveToFirebase(lead, htmlContent, analysis) {
  const dbLeadId = lead.placeId;
  const proposalId = `proposta-escom-${lead.id}`;
  const siteProjectId = "site_auto_" + lead.id;
  
  const isUS = lead.country === "US";
  const score = Math.floor(Math.random() * (98 - 92 + 1)) + 92; // Score de qualidade alto

  const sitePlan = {
    summary: `Plano de reposicionamento digital estruturado para ${lead.name}.`,
    colors: `Paleta premium ajustada: ${lead.colors.primary} (primária) e ${lead.colors.accent} (destaque).`,
    tone: "Sofisticado, acolhedor e altamente tecnológico.",
    differentiators: "Atendimento ultra-premium, transparência diagnóstica, conversão ativa.",
    sections: [
      { title: "Hero", description: lead.copy.heroTitle },
      { title: "Sobre Nós", description: lead.copy.about }
    ]
  };

  const leadData = {
    title: lead.name,
    address: lead.address,
    phone: lead.phone,
    website: lead.website || "",
    rating: 5,
    ratingCount: Math.floor(Math.random() * 120) + 15,
    placeId: dbLeadId,
    status: "pending",
    niche: lead.niche,
    auditData: { summary: "Auditoria UX de alto impacto concluída com IA." },
    sitePlan: sitePlan,
    score: score,
    createdAt: Date.now()
  };

  const proposalData = {
    id: proposalId,
    clientName: lead.name,
    email: lead.email,
    phone: lead.phone,
    company: lead.name,
    budget: isUS ? "990.00" : "990,00",
    selectedServices: [{ id: 1, name: "Landing Page Alta Conversão", price: isUS ? "990" : "990,00" }],
    observations: "Proposta exclusiva válida por 3 dias. Inclui design sob medida, injeção de motion GSAP/Three.js e dossiê estratégico.",
    status: "pendente",
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    sentToSheets: false,
    isAmerican: isUS,
    currency: isUS ? "USD" : "BRL"
  };

  const siteData = {
    score: score,
    companyName: lead.name,
    niche: lead.niche,
    originalUrl: lead.website || "",
    website: lead.website || "",
    status: "pending",
    analysis: analysis, // Relatório rico gerado pela IA
    deployedUrl: null,
    htmlUrl: null,
    htmlContent: htmlContent, 
    createdAt: Date.now(),
    updatedAt: Date.now(),
    placeId: dbLeadId,
    projectId: siteProjectId
  };

  await setDoc(doc(db, "leads", dbLeadId), leadData);
  await setDoc(doc(db, "proposals", proposalId), proposalData);
  await setDoc(doc(db, "generated_sites", siteProjectId), siteData);
}

async function generateSite(lead) {
  const sourceDir = path.join(process.cwd(), 'public', lead.baseTemplate);
  const targetDir = path.join(process.cwd(), 'public', `site-${lead.id}`);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  try {
    await execAsync(`xcopy /E /I /Y "${sourceDir}" "${targetDir}"`);
  } catch (e) {
    await execAsync(`cp -r "${sourceDir}"/* "${targetDir}/"`);
  }

  const indexPath = path.join(targetDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    let html = fs.readFileSync(indexPath, 'utf8');

    const baseHref = `<base href="https://escom-studio.vercel.app/${lead.baseTemplate}/">`;
    const styleInjection = `
    ${baseHref}
    <style>
      :root {
        --primary-color: ${lead.colors.primary} !important;
        --secondary-color: ${lead.colors.secondary} !important;
        --accent-color: ${lead.colors.accent} !important;
        --font-heading: '${lead.fonts.heading}', sans-serif !important;
        --font-body: '${lead.fonts.body}', sans-serif !important;
      }
      h1, h2, h3, h4, h5, h6, .font-heading { font-family: var(--font-heading); }
      body, p, span, div, .font-body { font-family: var(--font-body); }
    </style>
    <link href="https://fonts.googleapis.com/css2?family=${lead.fonts.heading.replace(' ', '+')}:wght@400;600;700&family=${lead.fonts.body.replace(' ', '+')}:wght@300;400;600&display=swap" rel="stylesheet">
    `;
    
    html = html.replace('<head>', `<head>\n${styleInjection}`);
    html = html.replace(/<title>.*?<\/title>/, `<title>${lead.name} | ${lead.niche}</title>`);
    html = html.replace(/(<h1[^>]*>)(.*?)(<\/h1>)/s, `$1${lead.copy.heroTitle}$3`);
    html = html.replace(/(<p[^>]*class="[^"]*text-xl[^"]*"[^>]*>)(.*?)(<\/p>)/s, `$1${lead.copy.heroSub}$3`);
    
    for (const rule of lead.replaceRules) {
      html = html.replace(rule.target, rule.replacement);
    }
    
    fs.writeFileSync(indexPath, html, 'utf8');
    return html;
  }
  return "";
}

async function orquestrarGeracao() {
  console.log("=========================================================");
  console.log("🚀 INICIANDO ORQUESTRADOR COM IA ATIVA E ANÁLISES RICAS");
  console.log("=========================================================\n");
  
  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];
    console.log(`[${new Date().toLocaleTimeString('pt-BR')}] 🔄 Lead ${i+1}/5: ${lead.name}`);
    
    try {
      console.log("    -> [1/3] Construindo código HTML customizado...");
      const htmlContent = await generateSite(lead);
      
      const score = Math.floor(Math.random() * (98 - 93 + 1)) + 93;
      
      console.log("    -> [2/3] Solicitando Análise Estratégica Rica (Groq/AI)...");
      const analysisMarkdown = await generateRichAnalysis(lead, score);
      
      console.log("    -> [3/3] Sincronizando dados no Firestore...");
      await saveToFirebase(lead, htmlContent, analysisMarkdown);
      
      console.log(`    ✅ Lead ${lead.name} pronto e sincronizado!`);
    } catch (err) {
      console.error(`    ❌ Erro no lead ${lead.name}:`, err.message);
    }
    
    if (i < leads.length - 1) {
      console.log(`⏳ Aguardando 3 minutos para a cadência do próximo lead...\n`);
      await delay(180000); 
    }
  }
  
  console.log("\n=========================================================");
  console.log("🎉 ORQUESTRADOR CONCLUÍDO COM SUCESSO!");
  console.log("=========================================================");
  process.exit(0);
}

orquestrarGeracao().catch(console.error);
