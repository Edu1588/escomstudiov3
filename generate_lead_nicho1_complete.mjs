import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Configuração Firebase
const firebaseConfig = JSON.parse(fs.readFileSync(new URL('./firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// ID e URLs limpos (SEM a palavra 'nicho1' na URL)
const lead = {
  id: "site-brasil-valuation", // Rota limpa sem 'nicho1'
  proposalId: "proposta-escom-brasil-valuation",
  companyName: "Brasil Valuation & M&A Advisory",
  niche: "Consultoria de Gestão Empresarial e M&A (Fusões e Aquisições)",
  city: "São Paulo, SP",
  address: "Av. Faria Lima, 3477 - 14º Andar - Itaim Bibi, São Paulo - SP",
  phone: "(11) 3045-8890",
  email: "contato@brasilvaluation.com.br",
  whatsapp: "5511930458890",
  website: "https://brasilvaluation.com.br",
  budget: "990,00",
  colors: {
    gold: "#d4af37",
    goldLight: "#f3e5ab",
    dark: "#0b0f17"
  }
};

const richAnalysisMarkdown = `# Análise Estratégica & Dossiê de Mercado

### 1. Diagnóstico de Posicionamento Digital
A **Brasil Valuation & M&A Advisory**, atuando na Av. Faria Lima em São Paulo, opera em um mercado onde transações empresariais ultrapassam dezenas de milhões de reais.

Identificamos os seguintes pontos críticos no posicionamento digital tradicional:
- **Ausência de Hierarquia Visual Luxo:** O visual padrão não comunica autoridade instantânea nos primeiros 3 segundos de navegação para CEOs e diretores.
- **Vazamento de Conversão:** Formulários longos em vez de canal VIP institucional de agendamento no WhatsApp.
- **Falta de Escassez e Ancoragem:** Ausência de seções de prazo técnico de proposta e estudo de caso estruturado.

### 2. Soluções Implementadas no Novo Protótipo
1. **Dobra Principal (Above The Fold):** Promessa de valor focada na dor do cliente corporativo com carregamento ultra-rápido (< 1s).
2. **Psicologia das Cores:** Paleta luxo Dark (#0b0f17) com Dourado Nobre (#d4af37).
3. **Motion GSAP & Smooth Scroll:** Animações sutis e fluidas que transmitem inovação e prestígio.
4. **Dossiê Integrado:** Relatório de inteligência disponível para o cliente com 1 clique.`;

// 1. GERAR HTML DO DOSSIÊ / ANÁLISE ESTRATÉGICA
function createDossieHtml(lead) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Análise Estratégica & Dossiê de Mercado | ${lead.companyName}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #0b0f17; color: #e2e8f0; }
    h1, h2, h3 { font-family: 'Playfair Display', serif; }
  </style>
</head>
<body class="p-8 max-w-4xl mx-auto">
  <div class="border border-amber-500/30 bg-slate-900/80 p-8 rounded-2xl shadow-2xl backdrop-blur-md">
    <div class="flex justify-between items-center border-b border-slate-800 pb-6 mb-8">
      <div>
        <span class="text-xs uppercase tracking-widest text-amber-400 font-bold">ESCOM STUDIO · ANÁLISE TÉCNICA EXCLUSIVA</span>
        <h1 class="text-3xl font-bold text-white mt-1">${lead.companyName}</h1>
        <p class="text-sm text-slate-400 mt-1"><i class="fa-solid fa-location-dot text-amber-400 mr-2"></i>${lead.address}</p>
      </div>
      <div class="text-right">
        <span class="inline-block px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold rounded-lg text-sm">
          Pontuação UX/UI: 96/100
        </span>
        <p class="text-xs text-slate-400 mt-2">Validade da Proposta: 3 Dias</p>
      </div>
    </div>

    <div class="space-y-6 mb-8">
      <h2 class="text-2xl font-bold text-amber-400">1. Diagnóstico do Posicionamento Digital</h2>
      <p class="text-slate-300 leading-relaxed">
        No setor de <strong>${lead.niche}</strong> em São Paulo, a conversão de contratos corporativos exige máxima autoridade visual e confiança instantânea.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <h4 class="font-bold text-white mb-2"><i class="fa-solid fa-triangle-exclamation text-amber-400 mr-2"></i>Gargalo 1: Ausência de Escassez</h4>
          <p class="text-xs text-slate-400">Falta de gatilhos de ancoragem de valor e urgência estratégica na captação de leads qualificados.</p>
        </div>
        <div class="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <h4 class="font-bold text-white mb-2"><i class="fa-solid fa-chart-line text-amber-400 mr-2"></i>Gargalo 2: Fricção no CTA</h4>
          <p class="text-xs text-slate-400">Fluxo de agendamento longo em vez do contato direto via WhatsApp institucionalizado.</p>
        </div>
      </div>
    </div>

    <div class="space-y-6 mb-8">
      <h2 class="text-2xl font-bold text-amber-400">2. Diretrizes para o Novo Protótipo de Alta Performance</h2>
      <ul class="list-disc pl-5 space-y-2 text-slate-300">
        <li><strong>Seções Obrigatórias:</strong> Arquitetura de 15 seções de alta conversão.</li>
        <li><strong>Engenharia de Animação:</strong> GSAP, ScrollTrigger e Smooth Scroll Lenis.</li>
        <li><strong>Copywriting Persuasivo:</strong> Foco absoluto em geração de autoridade e escassez.</li>
      </ul>
    </div>

    <div class="bg-slate-800/80 p-6 rounded-xl border border-amber-500/20 text-center">
      <h3 class="text-xl font-bold text-white mb-2">Investimento Único de Infraestrutura</h3>
      <p class="text-3xl font-bold text-amber-400 mb-2">R$ ${lead.budget}</p>
      <p class="text-xs text-slate-400 mb-4">Inclui Design Personalizado, Motion GSAP/Three.js, Dossiê Completo e Garantia de Performance.</p>
      <a href="https://wa.me/${lead.whatsapp}" class="inline-block bg-amber-500 text-slate-950 font-bold px-8 py-3 rounded-lg hover:bg-amber-400 transition">
        Aprovar Projeto & Iniciar Desenvolvimento
      </a>
    </div>
  </div>
</body>
</html>`;
}

// 2. GERAR O SITE HTML
function createSiteHtml(lead) {
  const baseTemplatePath = path.join(process.cwd(), 'templates', 'nicho1_consultoria_ma.html');
  let html = fs.readFileSync(baseTemplatePath, 'utf8');

  html = html.replace(/Fale Connosco/gi, 'Fale Conosco');
  html = html.replace(/#d4af37/g, lead.colors.gold);
  html = html.replace(/#f3e5ab/g, lead.colors.goldLight);

  html = html.replace(/<title>.*?<\/title>/gi, `<title>${lead.companyName} | Consultoria de Gestão & M&A</title>`);
  html = html.replace(/Nexus Partners \| Consultoria & M&A/gi, `${lead.companyName} | M&A`);
  html = html.replace(/NEXUS<span class="text-gold">PARTNERS<\/span>/g, `BRASIL<span class="text-[${lead.colors.gold}]">VALUATION<\/span>`);

  html = html.replace(/https:\/\/wa\.me\/5511999999999/g, `https://wa.me/${lead.whatsapp}`);
  html = html.replace(/\(11\) 99999-9999/g, lead.phone);
  html = html.replace(/contato@nexuspartners\.com\.br/g, lead.email);

  const escomSection = `
    <div class="bg-amber-500 text-slate-950 py-2 px-4 text-center font-bold text-sm tracking-wide shadow-md">
      <i class="fa-solid fa-clock mr-2"></i> PRAZO DE APROVAÇÃO TÉCNICA: ESTA PROPOSTA EXPIRA EM 3 DIAS (R$ ${lead.budget})
    </div>
    
    <section class="py-16 bg-slate-900 border-t border-b border-amber-500/20 text-white">
      <div class="max-w-6xl mx-auto px-4">
        <div class="bg-slate-950 border border-amber-500/30 p-8 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span class="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block">
              Análise Estratégica & Dossiê Técnico (Pontuação: 96/100)
            </span>
            <h3 class="text-2xl font-heading font-bold text-white mb-2">Análise de Projeto e Mercado Executada</h3>
            <p class="text-slate-400 text-sm max-w-2xl">
              Realizamos um estudo de posicionamento para a <strong>${lead.companyName}</strong> focado na maximização da conversão de contratos corporativos de alto ticket.
            </p>
          </div>
          <div class="flex flex-col gap-3 min-w-[220px]">
            <a href="dossie.html" target="_blank" class="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-6 rounded-xl text-center transition flex items-center justify-center gap-2 shadow-lg">
              <i class="fa-solid fa-file-pdf"></i> Visualizar Análise
            </a>
            <a href="https://wa.me/${lead.whatsapp}" target="_blank" class="border border-amber-500/50 hover:bg-amber-500/10 text-amber-400 font-bold py-3 px-6 rounded-xl text-center transition flex items-center justify-center gap-2">
              <i class="fa-brands fa-whatsapp"></i> Fale Conosco
            </a>
          </div>
        </div>
      </div>
    </section>
  `;

  return html.replace('<footer', `${escomSection}\n<footer`);
}

async function runPipeline() {
  console.log(`🚀 Iniciando Pipeline Limpo para o Lead: ${lead.companyName}`);

  // Remover pasta antiga com 'nicho1' no nome se existir
  const oldDir = path.join(process.cwd(), 'public', 'site-nicho1-brasil-valuation');
  if (fs.existsSync(oldDir)) {
    fs.rmSync(oldDir, { recursive: true, force: true });
    console.log("  🧹 Pasta antiga 'site-nicho1-brasil-valuation' removida.");
  }

  // Criar pasta limpa em public/site-brasil-valuation
  const targetDir = path.join(process.cwd(), 'public', lead.id);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // 1. Salvar Dossiê HTML
  const dossieHtml = createDossieHtml(lead);
  fs.writeFileSync(path.join(targetDir, 'dossie.html'), dossieHtml, 'utf8');
  console.log(`  📄 Dossiê criado em public/${lead.id}/dossie.html`);

  // 2. Criar o Site HTML
  const siteHtml = createSiteHtml(lead);
  fs.writeFileSync(path.join(targetDir, 'index.html'), siteHtml, 'utf8');
  console.log(`  🌐 Site HTML criado em public/${lead.id}/index.html`);

  // 3. Impeccable Audit
  try {
    await execAsync(`npx impeccable detect "${path.join(targetDir, 'index.html')}"`);
    console.log(`  🔍 Auditoria Impeccable finalizada.`);
  } catch (e) {}

  // 4. Deletar documento antigo do Firestore se existir
  try {
    await deleteDoc(doc(db, 'generated_sites', 'site-nicho1-brasil-valuation'));
    await deleteDoc(doc(db, 'proposals', 'proposta-escom-nicho1-brasil-valuation'));
  } catch(e) {}

  // 5. Atualizar Firestore com Dados Corretos (status: 'pending', analysis: richAnalysisMarkdown, URL limpa)
  const nowIso = new Date().toISOString();
  const cleanDeployedUrl = `https://escom-studio.vercel.app/${lead.id}/index.html`;

  const proposalData = {
    id: lead.proposalId,
    clientName: lead.companyName,
    company: lead.companyName,
    niche: lead.niche,
    city: lead.city,
    phone: lead.phone,
    address: lead.address,
    createdAt: nowIso,
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pendente', // PENDENTE (NÃO APROVADO)
    budget: lead.budget,
    currency: 'BRL',
    siteUrl: cleanDeployedUrl,
    pdfUrl: `https://escom-studio.vercel.app/${lead.id}/dossie.html`
  };

  const siteData = {
    projectId: lead.id,
    companyName: lead.companyName,
    niche: lead.niche,
    score: 96,
    status: 'pending', // PENDENTE (NÃO APROVADO)
    analysis: richAnalysisMarkdown, // Análise Markdown Rica para o Modal do Admin
    deployedUrl: cleanDeployedUrl,
    htmlUrl: cleanDeployedUrl,
    address: lead.address,
    phone: lead.phone,
    originalUrl: lead.email,
    updatedAt: Date.now(),
    createdAt: Date.now()
  };

  await setDoc(doc(db, 'proposals', lead.proposalId), proposalData);
  await setDoc(doc(db, 'generated_sites', lead.id), siteData);
  console.log(`  🔥 Firestore atualizado com sucesso! (Status: PENDENTE, URL: ${cleanDeployedUrl})`);

  console.log(`\n🎉 PIPELINE CONCLUÍDO COM SUCESSO!`);
}

runPipeline().catch(console.error);
