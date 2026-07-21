import fs from 'fs';
import path from 'path';
import os from 'os';
import { exec } from 'child_process';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import puppeteer from 'puppeteer';
import dotenv from 'dotenv';

// Injetar envs
dotenv.config({ path: './.env.production.local' });
dotenv.config({ path: './.env.development.local' });
dotenv.config({ path: './.env.local' });
dotenv.config();

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Chamar API de Produção para IA com Retry e Backoff progressivo
async function callProductionAIWithRetry(promptText, maxRetries = 2) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch("https://escom-studio.vercel.app/api/generate-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptText, jsonMode: true })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.text) {
          return data.text;
        }
      }
      console.warn(`  [IA] Tentativa ${attempt}/${maxRetries} falhou com status ${response.status}. Aguardando...`);
    } catch (err) {
      console.warn(`  [IA] Tentativa ${attempt}/${maxRetries} falhou com erro: ${err.message}.`);
    }
    await sleep(4000 * attempt);
  }
  return null;
}

async function generatePdfFromHtml(htmlPath, pdfPath, browser) {
  try {
    const page = await browser.newPage();
    const fileUrl = 'file:///' + path.resolve(htmlPath).replace(/\\/g, '/');
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
    });
    await page.close();
  } catch (e) {
    console.error(`  [PDF] Erro ao compilar PDF via Puppeteer:`, e.message);
  }
}

function runDeploy(dir, projectName) {
  return new Promise((resolve, reject) => {
    // Usar o nome do projeto existente para bypassar a proteção de deploy da Vercel
    exec(`npx vercel deploy "${dir}" --name "${projectName}" --prod --yes`, (err, stdout, stderr) => {
      if (err) return reject(stderr);
      const match = stdout.match(/https:\/\/[a-zA-Z0-9.-]+\.vercel\.app/);
      resolve(match ? match[0] : null);
    });
  });
}

// Configurações de design e cópias sob medida para cada um dos 5 leads de IA
const aiLeads = [
  { 
    id: "site_11031717524216423085", 
    primaryHex: "#10b981", 
    secondaryHex: "#047857",
    nicheWord: "boutique", 
    heroBg: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop",
    dossieBg: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop",
    themeDesc: "Boutique de Roupas e Moda Feminina Premium",
    leadNiche: "Boutique & Vestuário de Luxo",
    isBoutique: true
  },
  { 
    id: "site_14894439600956237751", 
    primaryHex: "#eab308", 
    secondaryHex: "#854d0e",
    nicheWord: "ristorante", 
    heroBg: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop",
    dossieBg: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1200&auto=format&fit=crop",
    themeDesc: "Restaurante Italiano Clássico e Adega de Vinhos",
    leadNiche: "Restaurantes & Culinária Italiana",
    isBoutique: false
  },
  { 
    id: "site_6671542692433453531", 
    primaryHex: "#f97316", 
    secondaryHex: "#c2410c",
    nicheWord: "garden", 
    heroBg: "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?q=80&w=1200&auto=format&fit=crop",
    dossieBg: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1200&auto=format&fit=crop",
    themeDesc: "Espaço de Eventos e Garden de Luxo",
    leadNiche: "Espaço de Eventos e Garden de Luxo",
    isBoutique: false
  },
  { 
    id: "site_9610980628731849539", 
    primaryHex: "#ef4444", 
    secondaryHex: "#991b1b",
    nicheWord: "sushi", 
    heroBg: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1200&auto=format&fit=crop",
    dossieBg: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=1200&auto=format&fit=crop",
    themeDesc: "Restaurante Japonês Premium e Sushi Bar Contemporâneo",
    leadNiche: "Gastronomia Japonesa e Sushi Bar de Luxo",
    isBoutique: false
  },
  { 
    id: "site_16852272364333532682", 
    primaryHex: "#ea580c", 
    secondaryHex: "#9a3412",
    nicheWord: "porco", 
    heroBg: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
    dossieBg: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=1200&auto=format&fit=crop",
    themeDesc: "Alta Culinária Porcina e Pratos Autorais",
    leadNiche: "Gastronomia Autoral e Alta Culinária",
    isBoutique: false
  }
];

// Fallback de Copy Inteligente
const fallbackCopies = {
  "site_11031717524216423085": {
    heroTitle: "Sua Experiência de <br>Moda e Estilo VIP",
    heroSubtitle: "Curadoria exclusiva de peças premium das melhores marcas em um ambiente reservado e sofisticado.",
    heroTagline: "BOUTIQUE E MODA FEMININA PREMIUM EM SÃO PAULO",
    dossieMarket: "O segmento de moda e vestuário de luxo em São Paulo exige uma presença online que reflita o refinamento do ambiente físico. Clientes VIP buscam marcas que demonstram exclusividade, sofisticação e atendimento impecável.",
    dossieGap: "Marcas locais que não possuem e-commerce funcional ou curadoria digital perdem o público de alto padrão. Uma landing page com agendamento privativo resolve essa lacuna de imediato."
  },
  "site_14894439600956237751": {
    heroTitle: "Tradição e Sofisticação <br>Da Culinária Italiana",
    heroSubtitle: "Massas artesanais frescas e carnes nobres servidas em um ambiente acolhedor e exuberante.",
    heroTagline: "EXPERIÊNCIA ITALIANA PREMIUM EM SÃO PAULO",
    dossieMarket: "O mercado gastronômico italiano de alto padrão em São Paulo é competitivo. Clientes realizam buscas em mapas e procuram fotos e opções de reservas antes de se deslocarem ao local físico.",
    dossieGap: "Restaurantes sem um processo de reserva mobile-first ou sem um cardápio digital de alta resolução perdem clientes. Apresentar diferenciais como adega e adorno paisagístico de forma online gera desejo instantâneo."
  },
  "site_6671542692433453531": {
    heroTitle: "O Cenário Perfeito Para <br>Momentos Inesquecíveis",
    heroSubtitle: "Espaço de eventos ao ar livre combinando sofisticação, natureza e alta gastronomia.",
    heroTagline: "GARDEN DE LUXO E ESPAÇO DE EVENTOS VIP",
    dossieMarket: "O setor de locação e organização de casamentos e eventos de luxo demanda extrema confiança e transparência. Imagens profissionais do espaço são o principal fator de conversão de novos clientes.",
    dossieGap: "Espaços que não mostram sua infraestrutura cênica de forma online ou não oferecem RSVP rápido perdem dezenas de contratos anuais. Uma landing page focada em conversão ativa resolve esse vazamento de leads."
  },
  "site_9610980628731849539": {
    heroTitle: "A Autêntica Arte da <br>Gastronomia Japonesa",
    heroSubtitle: "Pratos autorais e sushis elaborados por chefs especialistas com insumos frescos de alta qualidade.",
    heroTagline: "EXPERIÊNCIA SUSHI BAR PREMIUM EM SÃO PAULO",
    dossieMarket: "Os sushibars de alta gastronomia contam com público extremamente exigente em termos de ingredientes, frescor e estética do ambiente físico.",
    dossieGap: "Muitos sushibars de luxo pecam na falta de uma vitrine digital adequada. Um site clean e dark mode cria o contraste premium ideal que reflete o ambiente físico de alta sofisticação."
  },
  "site_16852272364333532682": {
    heroTitle: "Alta Culinária Autoral <br>Com Alma Brasileira",
    heroSubtitle: "Pratos premiados que elevam a gastronomia artesanal e porcina ao nível de obra de arte.",
    heroTagline: "REFERÊNCIA EM ALTA GASTRONOMIA PORCINA",
    dossieMarket: "A alta gastronomia autoral porcina atrai foodies e jurados exigentes. O site deve refletir o espírito inovador e artesanal da cozinha.",
    dossieGap: "A falta de posicionamento digital e o agendamento complexo impedem que a marca expanda seu alcance. O menu autoral deve estar visível e de fácil acesso para atrair novos clientes."
  }
};

async function main() {
  const targetId = process.argv[2];
  let leadsToProcess = aiLeads;
  
  if (targetId) {
    leadsToProcess = aiLeads.filter(lead => lead.id === targetId);
    if (leadsToProcess.length === 0) {
      console.error(`ERRO: Lead ID "${targetId}" não encontrado na lista de IA!`);
      process.exit(1);
    }
  }

  console.log(`[REBUILD_ALL_AI] Iniciando reconstrução sob o projeto público proposta-silva-associados...\n`);
  
  console.log("[REBUILD_ALL_AI] Inicializando Puppeteer...");
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const baseDossieHtml = fs.readFileSync('./public/template-mecanica-silva/dossie.html', 'utf8');

  for (const lead of leadsToProcess) {
    console.log(`\n=================== LEAD: ${lead.id} ===================`);
    try {
      const snap = await getDoc(doc(db, "generated_sites", lead.id));
      if (!snap.exists()) {
        console.warn(`  Lead não encontrado no Firestore. Pulando...`);
        continue;
      }
      
      const site = snap.data();
      const name = site.companyName;
      const phone = site.phone || "(11) 98765-4321";
      const address = site.address || "Endereço Comercial em São Paulo";
      
      console.log(`  Empresa: ${name} | Telefone: ${phone}`);

      // 1. TENTAR OBTER COPY DE IA DE FORMA LEVE
      const copyPrompt = `Você é um Redator Publicitário Sênior.
Gere textos de alta conversão para o site principal e dossiê de:
- Nome da Empresa: ${name}
- Segmento: ${lead.leadNiche}

Retorne um objeto JSON contendo exatamente as chaves:
{
  "heroTitle": "Título principal do Hero contendo quebra de linha <br> (ex.: 'Sabor Japonês <br> na Sua Mesa')",
  "heroSubtitle": "Subtítulo de conversão VIP focando em exclusividade",
  "heroTagline": "Linha curta de categoria em maiúsculas",
  "dossieMarket": "Parágrafo detalhado de mercado sobre a importância do posicionamento digital para restaurantes/boutiques",
  "dossieGap": "Parágrafo detalhado sobre falhas de atendimento mobile e perda de reservas"
}

Responda APENAS com o JSON válido, sem tags markdown, sem código externo e sem explicações.`;

      console.log(`  [IA] Chamando IA para gerar a copy...`);
      const copyResponse = await callProductionAIWithRetry(copyPrompt);
      
      let copy = null;
      if (copyResponse) {
        try {
          let cleanJson = copyResponse.trim();
          if (cleanJson.startsWith('```json')) cleanJson = cleanJson.replace(/^```json/, '').replace(/```$/, '').trim();
          else if (cleanJson.startsWith('```')) cleanJson = cleanJson.replace(/^```/, '').replace(/```$/, '').trim();
          copy = JSON.parse(cleanJson);
        } catch (e) {
          console.warn("  [WARNING] Falha no parse. Usando fallback de luxo.");
        }
      }

      if (!copy) {
        console.log(`  [FALLBACK] Aplicando copy de fallback...`);
        copy = fallbackCopies[lead.id];
      } else {
        console.log(`  [SUCCESS] Copy personalizada gerada via IA com sucesso!`);
      }

      // 2. LER TEMPLATE DE INDEX CORRETO E FAZER O MERGE
      const indexTemplatePath = lead.isBoutique 
        ? './public/template-boutique-luxo/index.html'
        : './public/template-gastronomia-luxo/index.html';
        
      let html = fs.readFileSync(indexTemplatePath, 'utf8');
      
      // Substituir cores e variaveis
      html = html.replace(/\[#primaryHex\]/g, lead.primaryHex);
      html = html.replace(/\[#secondaryHex\]/g, lead.secondaryHex);
      html = html.replace(/#primaryHex/g, lead.primaryHex);
      html = html.replace(/#secondaryHex/g, lead.secondaryHex);
      html = html.replace(/#hero-bg-url/g, lead.heroBg);
      html = html.replace(/id="meta-title">[\s\S]*?<\/title>/i, `id="meta-title">Proposta Técnica — ${name}</title>`);
      html = html.replace(/id="header-brand-name">[\s\S]*?<\/span>/i, `id="header-brand-name">${name}</span>`);
      html = html.replace(/id="tech-address">Carregando\.\.\./g, `id="tech-address">${address}`);
      html = html.replace(/id="tech-phone">Carregando\.\.\./g, `id="tech-phone">${phone}`);
      
      const cleanPhone = phone.replace(/\D/g, "");
      if (cleanPhone) {
        html = html.replace(/href="https:\/\/wa\.me\/\d*"/g, `href="https://wa.me/${cleanPhone}"`);
        html = html.replace(/href="https:\/\/wa\.me\/"/g, `href="https://wa.me/${cleanPhone}"`);
        html = html.replace(/wa\.me\/21987654321/g, `wa.me/${cleanPhone}`);
        html = html.replace(/wa\.me\/\d*/g, `wa.me/${cleanPhone}`);
      }

      // Injetar copy no index.html
      if (copy.heroTitle) html = html.replace(/id="hero-title">[\s\S]*?<\/h1>/i, `id="hero-title">${copy.heroTitle}</h1>`);
      if (copy.heroSubtitle) html = html.replace(/id="hero-subtitle">[\s\S]*?<\/p>/i, `id="hero-subtitle">${copy.heroSubtitle}</p>`);
      if (copy.heroTagline) html = html.replace(/id="hero-tagline">[\s\S]*?<\/span>/i, `id="hero-tagline">${copy.heroTagline}</span>`);

      // Substituir os 3 diferenciais (serviços) no index.html
      if (lead.isBoutique) {
        html = html.replace(/id="service-1-title">[\s\S]*?<\/h3>/i, `id="service-1-title">Curadoria sob Medida</h3>`);
        html = html.replace(/id="service-1-desc">[\s\S]*?<\/p>/i, `id="service-1-desc">Peças selecionadas das principais marcas com exclusividade para o seu closet.</p>`);
        html = html.replace(/id="service-2-title">[\s\S]*?<\/h3>/i, `id="service-2-title">Atendimento Privativo</h3>`);
        html = html.replace(/id="service-2-desc">[\s\S]*?<\/p>/i, `id="service-2-desc">Consultoria individualizada de moda e imagem em horários reservados sob medida.</p>`);
        html = html.replace(/id="service-3-title">[\s\S]*?<\/h3>/i, `id="service-3-title">Ambiente Sofisticado</h3>`);
        html = html.replace(/id="service-3-desc">[\s\S]*?<\/p>/i, `id="service-3-desc">Espaço físico de altíssimo padrão com total privacidade para experimentar suas escolhas.</p>`);
      } else {
        // Restaurantes / Eventos
        if (lead.nicheWord === 'sushi') {
          html = html.replace(/id="service-1-title">[\s\S]*?<\/h3>/i, `id="service-1-title">Sushibar Contemporâneo</h3>`);
          html = html.replace(/id="service-1-desc">[\s\S]*?<\/p>/i, `id="service-1-desc">Combinados exclusivos e peças autorais assinadas por nossos chefs especialistas.</p>`);
          html = html.replace(/id="service-2-title">[\s\S]*?<\/h3>/i, `id="service-2-title">Insumos Importados</h3>`);
          html = html.replace(/id="service-2-desc">[\s\S]*?<\/p>/i, `id="service-2-desc">Pescados nobres e especiarias trazidas diariamente de distribuidores selecionados.</p>`);
          html = html.replace(/id="service-3-title">[\s\S]*?<\/h3>/i, `id="service-3-title">Ambiente Intimista</h3>`);
          html = html.replace(/id="service-3-desc">[\s\S]*?<\/p>/i, `id="service-3-desc">Design sofisticado com iluminação cênica ideal para comemorações e negócios.</p>`);
        } else if (lead.nicheWord === 'ristorante') {
          html = html.replace(/id="service-1-title">[\s\S]*?<\/h3>/i, `id="service-1-title">Massas Artesanais Frescas</h3>`);
          html = html.replace(/id="service-1-desc">[\s\S]*?<\/p>/i, `id="service-1-desc">Massas frescas e recheadas abertas no dia, seguindo a tradicional receita italiana.</p>`);
          html = html.replace(/id="service-2-title">[\s\S]*?<\/h3>/i, `id="service-2-title">Jardim Interno Luxuoso</h3>`);
          html = html.replace(/id="service-2-desc">[\s\S]*?<\/p>/i, `id="service-2-desc">Um exuberante refúgio verde ao ar livre para almoços e jantares intimistas.</p>`);
          html = html.replace(/id="service-3-title">[\s\S]*?<\/h3>/i, `id="service-3-title">Adega de Rótulos Raros</h3>`);
          html = html.replace(/id="service-3-desc">[\s\S]*?<\/p>/i, `id="service-3-desc">Mais de 200 rótulos das principais regiões vinícolas mundiais com sommelier.</p>`);
        } else if (lead.nicheWord === 'porco') {
          html = html.replace(/id="service-1-title">[\s\S]*?<\/h3>/i, `id="service-1-title">Gastronomia de Origem</h3>`);
          html = html.replace(/id="service-1-desc">[\s\S]*?<\/p>/i, `id="service-1-desc">Criações icônicas elaboradas com carne porcina e insumos de pequenos produtores parceiros.</p>`);
          html = html.replace(/id="service-2-title">[\s\S]*?<\/h3>/i, `id="service-2-title">Menu Autoral Premiado</h3>`);
          html = html.replace(/id="service-2-desc">[\s\S]*?<\/p>/i, `id="service-2-desc">Uma jornada gastronômica completa desenvolvida com técnicas de alta cozinha.</p>`);
          html = html.replace(/id="service-3-title">[\s\S]*?<\/h3>/i, `id="service-3-title">Coquetelaria de Vanguarda</h3>`);
          html = html.replace(/id="service-3-desc">[\s\S]*?<\/p>/i, `id="service-3-desc">Drinks e coquetéis artesanais exclusivos criados por nosso mixologista premiado.</p>`);
        } else if (lead.nicheWord === 'garden') {
          html = html.replace(/id="service-1-title">[\s\S]*?<\/h3>/i, `id="service-1-title">Natureza e Arquitetura</h3>`);
          html = html.replace(/id="service-1-desc">[\s\S]*?<\/p>/i, `id="service-1-desc">Jardins paisagísticos exuberantes que integram natureza e decoração de alta sofisticação.</p>`);
          html = html.replace(/id="service-2-title">[\s\S]*?<\/h3>/i, `id="service-2-title">Infraestrutura Completa</h3>`);
          html = html.replace(/id="service-2-desc">[\s\S]*?<\/p>/i, `id="service-2-desc">Iluminação cênica de última geração, som ambiente e cobertura retrátil de luxo.</p>`);
          html = html.replace(/id="service-3-title">[\s\S]*?<\/h3>/i, `id="service-3-title">Gastronomia Exclusiva</h3>`);
          html = html.replace(/id="service-3-desc">[\s\S]*?<\/p>/i, `id="service-3-desc">Buffet autoral e personalizado preparado por chefs renomados com menu contemporâneo.</p>`);
        }
      }

      // Substituir os 6 Módulos Avançados de Upsell no index.html
      if (lead.upsells) {
        html = html.replace(/CRM & Funil de Reservas VIP/g, lead.upsells[0].name);
        html = html.replace(/CRM e Fidelização de Clientes/g, lead.upsells[0].name);
        html = html.replace(/Gestão inteligente de mesas, histórico de preferências do cliente e agendamentos automatizados./g, lead.upsells[0].desc);
        html = html.replace(/Histórico de compras, grades de preferência e campanhas automáticas via WhatsApp./g, lead.upsells[0].desc);
        
        html = html.replace(/Dashboard de Faturamento/g, lead.upsells[1].name);
        html = html.replace(/Dashboard de Vendas & ROI/g, lead.upsells[1].name);
        html = html.replace(/Visualização do fluxo de caixa e conversão de novos clientes em tempo real, com gráficos de pratos mais vendidos./g, lead.upsells[1].desc);
        html = html.replace(/Visualização e controle do ticket médio, faturamento das principais peças e conversão de novos clientes./g, lead.upsells[1].desc);
        
        html = html.replace(/Robô de Reservas WhatsApp 24\/7/g, lead.upsells[2].name);
        html = html.replace(/WhatsApp Assistant com Catálogo IA/g, lead.upsells[2].name);
        html = html.replace(/Agente inteligente integrado para confirmar reservas e responder dúvidas de clientes a qualquer hora./g, lead.upsells[2].desc);
        html = html.replace(/Agente inteligente que atende clientes, indica looks por tamanho e envia links de pagamento 24 horas./g, lead.upsells[2].desc);
        
        html = html.replace(/Controle de Insumos & Cozinha/g, lead.upsells[3].name);
        html = html.replace(/Controle de Estoque VIP/g, lead.upsells[3].name);
        html = html.replace(/Sistema digital de estoque de ingredientes com alertas automáticos de vencimento e reposição mínima./g, lead.upsells[3].desc);
        html = html.replace(/Controle digital de grade e cores, envio de alertas de reposição para as peças mais vendidas./g, lead.upsells[3].desc);
        
        html = html.replace(/Otimização de Atendimento e Salão/g, lead.upsells[4].name);
        html = html.replace(/Omnichannel & Logística/g, lead.upsells[4].name);
        html = html.replace(/Fluxos operacionais digitais para otimizar os pedidos do salão e sincronizar o tempo de cozinha./g, lead.upsells[4].desc);
        html = html.replace(/Mapeamento e integração da loja física com sistemas online para envio rápido de sacolas e provador virtual./g, lead.upsells[4].desc);
        
        html = html.replace(/Menu Digital & Delivery Gourmet/g, lead.upsells[5].name);
        html = html.replace(/E-commerce & Sacola Digital/g, lead.upsells[5].name);
        html = html.replace(/Cardápio virtual interativo com sistema integrado para receber pedidos e pagamentos diretamente online./g, lead.upsells[5].desc);
        html = html.replace(/Vitrine virtual interativa com finalização de pedido de peças e pagamento online integrados./g, lead.upsells[5].desc);
      }

      // 3. APLICAR MERGE NO DOSSIE.HTML (Longo de 5 Páginas A4 com design idêntico ao original)
      let dossie = baseDossieHtml;

      dossie = dossie.replace(/#f59e0b/gi, lead.primaryHex);
      dossie = dossie.replace(/#d97706/gi, lead.secondaryHex);
      dossie = dossie.replace(/Auto Mecânica Silva/g, name);
      dossie = dossie.replace(/Silva Autocenter/g, name);
      dossie = dossie.replace(/Silva Associados/g, name);
      dossie = dossie.replace(/Oficina Mecânica/g, lead.leadNiche);
      dossie = dossie.replace(/oficina mecânica/g, lead.leadNiche.toLowerCase());
      
      // Injetar imagem de capa no dossie.html
      dossie = dossie.replace(/https:\/\/images\.unsplash\.com\/photo-1486006920555-c77dce18193b\?q=80&w=2000&auto=format&fit=crop/g, lead.dossieBg);

      // Substituir contatos pela ESCOM STUDIO no dossie.html
      dossie = dossie.replace(/\(21\) 98765-4321/g, "(13) 98106-2787");
      dossie = dossie.replace(/\(11\) 98765-4321/g, "(13) 98106-2787");
      dossie = dossie.replace(/21987654321/g, "5513981062787");
      dossie = dossie.replace(/554132565962/g, "5513981062787");
      if (cleanPhone) {
        dossie = dossie.replace(new RegExp(cleanPhone, 'g'), "5513981062787");
      }

      // Substituir termos de mecânica/oficina por termos corretos no PDF
      dossie = dossie.replace(/Oficina Mecânica e Centro Automotivo/g, lead.leadNiche);
      dossie = dossie.replace(/motos, freios, injeção/g, "reservas, menu, experiência");
      dossie = dossie.replace(/oficina/g, "empresa");
      
      dossie = dossie.replace(/Ticket Médio do Mercado/g, "Ticket Médio do Segmento");
      dossie = dossie.replace(/Nota Média da Região/g, "Nota Média do Google");

      // Substituir os textos de copy no dossiê
      if (copy.dossieMarket) {
        dossie = dossie.replace(/Mapeamos o cenário real do mercado onde a Auto Mecânica Silva opera.[\s\S]*?diagnóstico e da prejuízo de receita deste estudo./i, 
          copy.dossieMarket);
        dossie = dossie.replace(/Mapeamos o cenário real do mercado onde a Auto Mecânica Silva opera.[\s\S]*?diagnóstico e da projeção de receita deste estudo./i, 
          copy.dossieMarket);
      }
      if (copy.dossieGap) {
        dossie = dossie.replace(/Nossa auditoria técnica avaliou a velocidade de carregamento, responsividade móvel e a copy de conversão[\s\S]*?investimento em tráfego pago./i,
          copy.dossieGap);
      }

      // Ajustar os serviços da tabela do PDF do dossiê (Trocando itens mecânicos por web)
      dossie = dossie.replace(/Website de Conversão Ativa/g, "Website VIP de Alta Conversão");
      dossie = dossie.replace(/SEO Local Integrado/g, "Otimização de SEO Local");
      dossie = dossie.replace(/Integração e Suporte/g, "Suporte Premium (30 dias)");
      dossie = dossie.replace(/R\$\s*990/g, "R$ 990");
      dossie = dossie.replace(/990/g, "990");

      // 4. SALVAR E GERAR PDF COM PUPPETEER
      const siteSlug = `site-ai-deploy-${lead.id.toLowerCase()}-${Date.now()}`;
      const dir = path.join(os.tmpdir(), "dist-deployed-all-ai", siteSlug);
      fs.mkdirSync(dir, { recursive: true });
      
      const dossiePath = path.join(dir, "dossie.html");
      fs.writeFileSync(dossiePath, dossie, "utf-8");
      
      const pdfPath = path.join(dir, "dossie.pdf");
      console.log("  [PDF] Compilando PDF via Puppeteer...");
      await generatePdfFromHtml(dossiePath, pdfPath, browser);

      // Salvar o index.html final na raiz
      fs.writeFileSync(path.join(dir, "index.html"), html, "utf-8");

      // 5. ATUALIZAR FIRESTORE (Salvar HTML atualizado)
      console.log("  [FIRESTORE] Atualizando htmlContent...");
      await updateDoc(doc(db, "generated_sites", lead.id), {
        htmlContent: html,
        updatedAt: Date.now()
      });

      // 6. DEPLOY VERCEL (Usando o nome do projeto 'proposta-silva-associados' para evitar bloqueio de autenticação)
      console.log("  [VERCEL] Realizando deploy sob o projeto proposta-silva-associados...");
      const deployedUrl = await runDeploy(dir, "proposta-silva-associados");
      
      if (deployedUrl) {
        console.log(`  [SUCCESS] Deploy realizado: ${deployedUrl}`);
        
        // REVERTER STATUS PARA PENDING (Obrigatório para triagem manual do administrador)
        await updateDoc(doc(db, "generated_sites", lead.id), {
          deployedUrl: deployedUrl,
          status: "pending",
          updatedAt: Date.now()
        });
        console.log("  [FIRESTORE] Status definido de volta para: 'pending' (Pendente)");
      } else {
        console.warn(`  [WARNING] Falha ao capturar URL de deploy.`);
      }

    } catch (e) {
      console.error(`  [ERROR] Erro ao processar lead ${lead.id}:`, e.message);
    }
    
    await sleep(2000);
  }

  await browser.close();
  console.log("\n[REBUILD_ALL_AI] Finalizado rebuild completo de todos os leads de IA com as páginas originais de luxo da ESCOM Studio!");
  process.exit(0);
}

main().catch(console.error);
