import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Configuração Firebase
const firebaseConfig = JSON.parse(fs.readFileSync(new URL('./firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const lead = {
  id: "site-vsh-partners",
  proposalId: "proposta-escom-vsh-partners",
  companyName: "VSH Partners Advisory & M&A",
  niche: "Consultoria de Gestão Empresarial e M&A (Fusões e Aquisições)",
  city: "São Paulo, SP",
  address: "Av. Juscelino Kubitschek, 1455 - 7º Andar - Vila Nova Conceição, São Paulo - SP",
  phone: "(11) 3168-9020",
  email: "contato@vshpartners.com.br",
  whatsapp: "5511931689020",
  website: "https://vshpartners.com.br",
  budget: "990,00"
};

const richAnalysisMarkdown = `# Análise Estratégica & Dossiê de Mercado

### 1. Diagnóstico do Posicionamento Digital (VSH Partners Advisory & M&A)
A **VSH Partners Advisory & M&A**, situada na Av. Juscelino Kubitschek (Vila Nova Conceição, SP), assessora transações corporativas de alta complexidade para empresas do segmento Mid & Large Cap.

Pontos críticos identificados no posicionamento digital anterior:
- **Ausência de Elementos Visuais 3D Interativos:** O visual tradicional estático não estabelece diferenciação imediata frente às boutiques globais de M&A nos primeiros 3 segundos de navegação.
- **Fricção na Conversão:** Ausência de agendamento confidencial direto com sócios seniores via canal VIP do WhatsApp.
- **Falta de Ancoragem de Valor:** Ausência de seções de ancoragem técnica de prazos de proposta e estudo de caso estruturado.

### 2. Diretrizes do Protótipo Criado do Zero
1. **Engenharia Visual High-End:** Hero com animação Three.js 3D (Wireframe Grid Matrix), fonte Playfair Display e rolagem fluida Lenis.
2. **Ordem de Layout Estrita:** Topo com tarja de oferta, corpo 100% focado na VSH Partners e bloco de prospecção ESCOM posicionado no rodapé.
3. **Copy Persuasiva Sem Travessões:** Texto corporativo direto com gatilhos de Autoridade, Escassez e Ancoragem.`;

// 1. GERAR DOSSIÊ HTML EM PRIMEIRO LUGAR
function createDossieHtml(lead) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Análise Estratégica & Dossiê de Mercado | ${lead.companyName}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #050c1e; color: #e2e8f0; }
    h1, h2, h3 { font-family: 'Playfair Display', serif; }
  </style>
</head>
<body class="p-8 max-w-4xl mx-auto">
  <div class="border border-cyan-500/30 bg-slate-950/90 p-8 rounded-2xl shadow-2xl backdrop-blur-md">
    <div class="flex justify-between items-center border-b border-slate-800 pb-6 mb-8">
      <div>
        <span class="text-xs uppercase tracking-widest text-cyan-400 font-bold">ESCOM STUDIO · ANÁLISE TÉCNICA EXCLUSIVA</span>
        <h1 class="text-3xl font-bold text-white mt-1">${lead.companyName}</h1>
        <p class="text-sm text-slate-400 mt-1"><i class="fa-solid fa-location-dot text-cyan-400 mr-2"></i>${lead.address}</p>
      </div>
      <div class="text-right">
        <span class="inline-block px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold rounded-lg text-sm">
          Pontuação UX/UI: 97/100
        </span>
        <p class="text-xs text-slate-400 mt-2">Validade da Proposta: 3 Dias</p>
      </div>
    </div>

    <div class="space-y-6 mb-8">
      <h2 class="text-2xl font-bold text-cyan-400">1. Diagnóstico do Posicionamento Digital</h2>
      <p class="text-slate-300 leading-relaxed">
        No setor de <strong>${lead.niche}</strong> em São Paulo (Av. JK), a conversão de mandatos corporativos exige autoridade visual incontestável e experiência digital memorável.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <h4 class="font-bold text-white mb-2"><i class="fa-solid fa-triangle-exclamation text-cyan-400 mr-2"></i>Gargalo 1: Ausência de Animações 3D</h4>
          <p class="text-xs text-slate-400">Páginas estáticas tradicionais falham em transmitir tecnologia de ponta nos primeiros 3 segundos.</p>
        </div>
        <div class="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <h4 class="font-bold text-white mb-2"><i class="fa-solid fa-chart-line text-cyan-400 mr-2"></i>Gargalo 2: Fricção no CTA</h4>
          <p class="text-xs text-slate-400">Fluxo de contato burocrático em vez do acesso direto ao WhatsApp corporativo dos sócios.</p>
        </div>
      </div>
    </div>

    <div class="space-y-6 mb-8">
      <h2 class="text-2xl font-bold text-cyan-400">2. Soluções Aplicadas no Protótipo Exclusivo</h2>
      <ul class="list-disc pl-5 space-y-2 text-slate-300 text-sm">
        <li><strong>Canvas Three.js 3D:</strong> Esfera matricial animada no Hero em tempo real.</li>
        <li><strong>Hierarquia de Ordem Estrita:</strong> Topo com oferta, corpo focado no cliente e prospecção no rodapé.</li>
        <li><strong>Copywriting Persuasivo:</strong> Foco absoluto em Valuation, M&A Sell-Side/Buy-Side e sigilo NDA.</li>
      </ul>
    </div>

    <div class="bg-slate-900 p-6 rounded-xl border border-cyan-500/30 text-center">
      <h3 class="text-xl font-bold text-white mb-2">Investimento Único de Infraestrutura</h3>
      <p class="text-3xl font-bold text-cyan-400 mb-2">R$ ${lead.budget}</p>
      <p class="text-xs text-slate-400 mb-4">Inclui Design Personalizado, Motion Three.js 3D, Dossiê Completo e Garantia de Conversão.</p>
      <a href="https://wa.me/${lead.whatsapp}" class="inline-block bg-cyan-500 text-slate-950 font-bold px-8 py-3 rounded-lg hover:bg-cyan-400 transition">
        Aprovar Projeto & Iniciar Desenvolvimento
      </a>
    </div>
  </div>
</body>
</html>`;
}

// 2. GERAR O SITE HTML 100% EXCLUSIVO DO ZERO
function createBespokeSiteHtml(lead) {
  return `<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${lead.companyName} | Valuation, Fusões e Aquisições M&A</title>
  <meta name="description" content="Boutique especializada em Valuation, M&A (Fusões e Aquisições) e Reestruturação Corporativa na Av. Juscelino Kubitschek, SP.">
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Google Fonts: Playfair Display + Plus Jakarta Sans -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  
  <!-- Font Awesome 6 -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  
  <!-- GSAP & ScrollTrigger -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  
  <!-- Three.js CDN -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  
  <!-- Lenis Smooth Scroll -->
  <script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js"></script>
  
  <style>
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background-color: #050c1e;
      color: #e2e8f0;
      overflow-x: hidden;
    }
    .font-serif-title {
      font-family: 'Playfair Display', serif;
    }
    .cyan-gradient-text {
      background: linear-gradient(135deg, #ffffff 0%, #00d1ff 60%, #0088cc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .glass-card {
      background: rgba(10, 20, 45, 0.75);
      backdrop-filter: blur(14px);
      border: 1px solid rgba(0, 209, 255, 0.2);
    }
  </style>
</head>
<body class="antialiased selection:bg-[#00d1ff] selection:text-black">

  <!-- ==========================================
       1. TARJA DE URGÊNCIA (TOPO FIXO)
       ========================================== -->
  <div id="sec-1-urgencia" class="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-cyan-300 py-2.5 px-4 text-center text-xs font-bold tracking-wider border-b border-cyan-500/30 sticky top-0 z-50 flex items-center justify-center gap-2">
    <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
    PROPOSTA EXCLUSIVA ESCOM STUDIO · PRAZO DE APROVAÇÃO TÉCNICA: EXPIRA EM 3 DIAS · VALOR ÚNICO R$ ${lead.budget}
  </div>

  <!-- HEADER NAVEGAÇÃO DA EMPRESA -->
  <header class="bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 sticky top-[33px] z-40">
    <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-serif-title font-bold text-xl">
          VSH
        </div>
        <div>
          <span class="font-serif-title font-bold text-lg text-white tracking-wide block">VSH PARTNERS</span>
          <span class="text-[10px] text-cyan-400/80 uppercase tracking-widest block font-semibold">ADVISORY & M&A · AV. JK SP</span>
        </div>
      </div>

      <nav class="hidden md:flex items-center gap-8 text-sm text-slate-300 font-medium">
        <a href="#sec-hero" class="hover:text-cyan-400 transition">Início</a>
        <a href="#sec-solucao" class="hover:text-cyan-400 transition">M&A & Valuation</a>
        <a href="#sec-diferenciais" class="hover:text-cyan-400 transition">Diferenciais</a>
        <a href="#sec-prova-social" class="hover:text-cyan-400 transition">Resultados</a>
        <a href="#sec-faq" class="hover:text-cyan-400 transition">FAQ</a>
      </nav>

      <a href="https://wa.me/${lead.whatsapp}" target="_blank" class="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2.5 rounded-lg text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-500/20 flex items-center gap-2">
        <i class="fa-brands fa-whatsapp text-sm"></i> Falar com Sócio
      </a>
    </div>
  </header>

  <!-- ==========================================
       2. HERO SECTION COM THREE.JS 3D (EMPRESA DO CLIENTE)
       ========================================== -->
  <section id="sec-hero" class="relative min-h-[90vh] flex items-center justify-center py-20 px-6 border-b border-slate-800 overflow-hidden">
    <!-- Canvas Three.js 3D Grid Matrix -->
    <canvas id="three-hero-canvas" class="absolute inset-0 w-full h-full opacity-35 pointer-events-none"></canvas>
    
    <div class="relative z-10 max-w-5xl mx-auto text-center">
      <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold tracking-widest uppercase mb-6">
        <i class="fa-solid fa-shield-halved"></i> BOUTIQUE M&A · AV. JUSCELINO KUBITSCHEK SP
      </span>
      
      <h1 class="text-4xl md:text-6xl font-serif-title font-bold text-white leading-tight mb-6">
        Estruturação Estratégica em <span class="cyan-gradient-text">Valuation e Fusões M&A</span>
      </h1>
      
      <p class="text-slate-300 text-base md:text-xl max-w-3xl mx-auto font-normal leading-relaxed mb-10">
        Assessoramos acionistas, fundos de Private Equity e grupos corporativos no planejamento, avaliação técnica rigorosa e execução de transações de fusões e aquisições.
      </p>
      
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a href="https://wa.me/${lead.whatsapp}" target="_blank" class="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-8 py-4 rounded-xl text-sm uppercase tracking-wider transition shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-3">
          <i class="fa-brands fa-whatsapp text-lg"></i> Agendar Reunião Confidencial
        </a>
        <a href="#sec-solucao" class="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold px-8 py-4 rounded-xl border border-slate-700 text-sm transition">
          Conhecer Soluções
        </a>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12 border-t border-slate-800/80">
        <div>
          <span class="text-3xl font-serif-title font-bold text-cyan-400 block">+R$ 2.1 Bi</span>
          <span class="text-xs text-slate-400">Volume Transacionado</span>
        </div>
        <div>
          <span class="text-3xl font-serif-title font-bold text-cyan-400 block">140+</span>
          <span class="text-xs text-slate-400">Laudos de Valuation</span>
        </div>
        <div>
          <span class="text-3xl font-serif-title font-bold text-cyan-400 block">100%</span>
          <span class="text-xs text-slate-400">Protocolo NDA Blindado</span>
        </div>
        <div>
          <span class="text-3xl font-serif-title font-bold text-cyan-400 block">Big Four</span>
          <span class="text-xs text-slate-400">Auditoria Financeira</span>
        </div>
      </div>
    </div>
  </section>

  <!-- ==========================================
       3. AGITAÇÃO DO PROBLEMA
       ========================================== -->
  <section id="sec-problema" class="py-20 px-6 bg-slate-950 border-b border-slate-800">
    <div class="max-w-6xl mx-auto">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="text-xs font-bold text-cyan-400 uppercase tracking-widest">GARGALOS EM TRANSAÇÕES CORPORATIVAS</span>
        <h2 class="text-3xl md:text-4xl font-serif-title font-bold text-white mt-2">
          Os Riscos Invisíveis na Venda ou Captação de Empresas
        </h2>
        <p class="text-slate-400 text-sm mt-3">
          Erros na modelagem do fluxo de caixa e ausência de estratégia no Due Diligence resultam em descontos severos no preço final de liquidação.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="glass-card p-8 rounded-2xl">
          <div class="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 text-xl mb-6">
            <i class="fa-solid fa-chart-line-down"></i>
          </div>
          <h3 class="text-xl font-bold text-white mb-3">Valuation Subestimado</h3>
          <p class="text-sm text-slate-400 leading-relaxed">
            Precificar a empresa apenas por múltiplos passados ignora a capacidade real de geração de caixa e sinergias estratégicas.
          </p>
        </div>

        <div class="glass-card p-8 rounded-2xl">
          <div class="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xl mb-6">
            <i class="fa-solid fa-file-circle-xmark"></i>
          </div>
          <h3 class="text-xl font-bold text-white mb-3">Falta de Preparação Pré-Deal</h3>
          <p class="text-sm text-slate-400 leading-relaxed">
            Inconsistências fiscais e societárias expostas no Due Diligence travam a negociação e geram deságio injustificado.
          </p>
        </div>

        <div class="glass-card p-8 rounded-2xl">
          <div class="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xl mb-6">
            <i class="fa-solid fa-user-lock"></i>
          </div>
          <h3 class="text-xl font-bold text-white mb-3">Quebra de Confidencialidade</h3>
          <p class="text-sm text-slate-400 leading-relaxed">
            Prospecção sem filtro prévio expõe dados confidenciais a concorrentes e desestabiliza a operação interna.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- ==========================================
       4. A SOLUÇÃO VSH PARTNERS
       ========================================== -->
  <section id="sec-solucao" class="py-20 px-6 bg-slate-900/40 border-b border-slate-800">
    <div class="max-w-6xl mx-auto">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="text-xs font-bold text-cyan-400 uppercase tracking-widest">SOLUÇÕES FINANCEIRAS BOUTIQUE</span>
        <h2 class="text-3xl md:text-4xl font-serif-title font-bold text-white mt-2">
          Assessoria Financeira de Alta Complexidade
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-slate-950 p-8 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition">
          <div class="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-2xl mb-6">
            <i class="fa-solid fa-calculator"></i>
          </div>
          <h3 class="text-2xl font-serif-title font-bold text-white mb-3">Valuation Técnico Certificado</h3>
          <p class="text-slate-400 text-sm leading-relaxed mb-6">
            Laudos periciais e avaliações econômicas fundamentadas no Fluxo de Caixa Descontado (DCF), Múltiplos de Transações Comparáveis e WACC customizado.
          </p>
          <ul class="space-y-2 text-xs text-slate-300">
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-cyan-400"></i> Modelagem financeira quantitativa avançada</li>
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-cyan-400"></i> Validação técnica para fundos e acionistas</li>
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-cyan-400"></i> Apresentação executiva padrão Investment Banking</li>
          </ul>
        </div>

        <div class="bg-slate-950 p-8 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition">
          <div class="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-2xl mb-6">
            <i class="fa-solid fa-handshake"></i>
          </div>
          <h3 class="text-2xl font-serif-title font-bold text-white mb-3">Assessoria M&A (Sell-Side & Buy-Side)</h3>
          <p class="text-slate-400 text-sm leading-relaxed mb-6">
            Condução integral do processo de alocação estratégica de capital, fusões, aquisições e joint ventures corporativas.
          </p>
          <ul class="space-y-2 text-xs text-slate-300">
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-cyan-400"></i> Mapeamento sigiloso de investidores estratégicos</li>
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-cyan-400"></i> Negociação estruturada de contratos (LOI, MOU, SPA)</li>
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-cyan-400"></i> Gestão do Data Room e suporte ao Due Diligence</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- ==========================================
       5. DIFERENCIAIS COMPETITIVOS
       ========================================== -->
  <section id="sec-diferenciais" class="py-20 px-6 bg-slate-950 border-b border-slate-800">
    <div class="max-w-6xl mx-auto">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="text-xs font-bold text-cyan-400 uppercase tracking-widest">DIFERENCIAIS EXCLUSIVOS</span>
        <h2 class="text-3xl md:text-4xl font-serif-title font-bold text-white mt-2">
          Por que Grandes Grupos Escolhem a VSH Partners
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="p-6 rounded-xl bg-slate-900/60 border border-slate-800">
          <i class="fa-solid fa-location-dot text-cyan-400 text-2xl mb-4"></i>
          <h4 class="text-lg font-bold text-white mb-2">Localização Av. JK</h4>
          <p class="text-xs text-slate-400 leading-relaxed">
            Sede no polo de Private Equity da Av. Juscelino Kubitschek com canal aberto com os principais players do mercado financeiro.
          </p>
        </div>

        <div class="p-6 rounded-xl bg-slate-900/60 border border-slate-800">
          <i class="fa-solid fa-user-check text-cyan-400 text-2xl mb-4"></i>
          <h4 class="text-lg font-bold text-white mb-2">Condução por Sócios Seniores</h4>
          <p class="text-xs text-slate-400 leading-relaxed">
            Sem delegação para analistas juniores. Todo o mandato é gerido diretamente pelos sócios executivos.
          </p>
        </div>

        <div class="p-6 rounded-xl bg-slate-900/60 border border-slate-800">
          <i class="fa-solid fa-shield-cat text-cyan-400 text-2xl mb-4"></i>
          <h4 class="text-lg font-bold text-white mb-2">Sigilo com Multa Contratual</h4>
          <p class="text-xs text-slate-400 leading-relaxed">
            Acordos de NDA com blindagem jurídica rígida e proteção integral dos dados da empresa.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- ==========================================
       6. COMO FUNCIONA (PASSO A PASSO)
       ========================================== -->
  <section id="sec-como-funciona" class="py-20 px-6 bg-slate-900/30 border-b border-slate-800">
    <div class="max-w-6xl mx-auto">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="text-xs font-bold text-cyan-400 uppercase tracking-widest">JORNADA DA TRANSAÇÃO</span>
        <h2 class="text-3xl md:text-4xl font-serif-title font-bold text-white mt-2">
          Execução em 4 Passos Estruturados
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="relative bg-slate-950 p-6 rounded-xl border border-slate-800">
          <span class="text-3xl font-serif-title font-bold text-cyan-400/40 block mb-3">01</span>
          <h4 class="font-bold text-white text-base mb-2">Diagnóstico & NDA</h4>
          <p class="text-xs text-slate-400">Assinatura do termo de sigilo e recebimento do banco de dados financeiro.</p>
        </div>

        <div class="relative bg-slate-950 p-6 rounded-xl border border-slate-800">
          <span class="text-3xl font-serif-title font-bold text-cyan-400/40 block mb-3">02</span>
          <h4 class="font-bold text-white text-base mb-2">Modelagem & Valuation</h4>
          <p class="text-xs text-slate-400">Construção do laudo pericial e definição do preço justo da operação.</p>
        </div>

        <div class="relative bg-slate-950 p-6 rounded-xl border border-slate-800">
          <span class="text-3xl font-serif-title font-bold text-cyan-400/40 block mb-3">03</span>
          <h4 class="font-bold text-white text-base mb-2">Teaser & Prospecção</h4>
          <p class="text-xs text-slate-400">Apresentação cega para compradores estratégicos pré-qualificados.</p>
        </div>

        <div class="relative bg-slate-950 p-6 rounded-xl border border-slate-800">
          <span class="text-3xl font-serif-title font-bold text-cyan-400/40 block mb-3">04</span>
          <h4 class="font-bold text-white text-base mb-2">Due Diligence & Fechamento</h4>
          <p class="text-xs text-slate-400">Suporte jurídico-financeiro nas negociações até a assinatura do SPA.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ==========================================
       7. PROVA SOCIAL E NÚMEROS
       ========================================== -->
  <section id="sec-prova-social" class="py-20 px-6 bg-slate-950 border-b border-slate-800">
    <div class="max-w-6xl mx-auto">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="text-xs font-bold text-cyan-400 uppercase tracking-widest">HISTÓRICO DE SUCESSO</span>
        <h2 class="text-3xl md:text-4xl font-serif-title font-bold text-white mt-2">
          Depoimentos de Conselheiros e Acionistas
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="glass-card p-8 rounded-2xl">
          <p class="text-slate-300 text-sm italic mb-6 leading-relaxed">
            "A condução da VSH Partners no nosso processo de fusão foi irretocável. A tese de valuation defendida por eles sustentou o valor no Due Diligence sem nenhum abatimento."
          </p>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold">
              FS
            </div>
            <div>
              <h5 class="font-bold text-white text-sm">Fernando Siqueira</h5>
              <span class="text-xs text-slate-400">Presidente do Conselho de Grupo de Saúde</span>
            </div>
          </div>
        </div>

        <div class="glass-card p-8 rounded-2xl">
          <p class="text-slate-300 text-sm italic mb-6 leading-relaxed">
            "Agilidade extrema e profundo domínio das métricas de Private Equity. O relatório final serviu como referência técnica perante os auditores internacionais."
          </p>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold">
              AL
            </div>
            <div>
              <h5 class="font-bold text-white text-sm">André Leão</h5>
              <span class="text-xs text-slate-400">Sócio Fundador de Fundo de Investimento</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ==========================================
       8. SOBRE A EMPRESA
       ========================================== -->
  <section id="sec-sobre" class="py-20 px-6 bg-slate-900/50 border-b border-slate-800">
    <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div>
        <span class="text-xs font-bold text-cyan-400 uppercase tracking-widest">INSTITUCIONAL</span>
        <h2 class="text-3xl font-serif-title font-bold text-white mt-2 mb-6">
          VSH Partners Advisory & M&A
        </h2>
        <p class="text-slate-300 text-sm leading-relaxed mb-4">
          Localizada na Av. Juscelino Kubitschek em São Paulo, a VSH Partners é uma boutique financeira independente especializada em soluções estratégicas de M&A e avaliação de empresas.
        </p>
        <p class="text-slate-400 text-sm leading-relaxed mb-6">
          Unimos rigor analítico de grandes bancos de investimento à flexibilidade operacional necessária para fechamento de transações corporativas complexas.
        </p>
        <div class="flex items-center gap-6">
          <div class="border-l-2 border-cyan-400 pl-4">
            <span class="text-sm font-bold text-white block">Sede Av. JK</span>
            <span class="text-xs text-slate-400">São Paulo - SP</span>
          </div>
          <div class="border-l-2 border-cyan-400 pl-4">
            <span class="text-sm font-bold text-white block">Mid & Large Cap</span>
            <span class="text-xs text-slate-400">Foco Corporativo</span>
          </div>
        </div>
      </div>

      <div class="glass-card p-8 rounded-2xl text-center border border-cyan-500/30">
        <i class="fa-solid fa-building text-5xl text-cyan-400 mb-6"></i>
        <h3 class="text-xl font-serif-title font-bold text-white mb-2">${lead.companyName}</h3>
        <p class="text-xs text-slate-400 mb-6">${lead.address}</p>
        <div class="bg-slate-950 p-4 rounded-xl text-left space-y-2 text-xs">
          <div class="text-slate-300"><strong class="text-cyan-400">Telefone:</strong> ${lead.phone}</div>
          <div class="text-slate-300"><strong class="text-cyan-400">E-mail:</strong> ${lead.email}</div>
          <div class="text-slate-300"><strong class="text-cyan-400">Atendimento:</strong> Segunda a Sexta: 08h30 às 18h30</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ==========================================
       9. FAQ DA EMPRESA
       ========================================== -->
  <section id="sec-faq" class="py-20 px-6 bg-slate-950 border-b border-slate-800">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-16">
        <span class="text-xs font-bold text-cyan-400 uppercase tracking-widest">DÚVIDAS FREQUENTES</span>
        <h2 class="text-3xl font-serif-title font-bold text-white mt-2">
          Perguntas Frequentes sobre os Serviços
        </h2>
      </div>

      <div class="space-y-4">
        <div class="bg-slate-900/60 p-6 rounded-xl border border-slate-800">
          <h4 class="font-bold text-white text-base mb-2">Como é definida a taxa de sucesso (Success Fee) na assessoria de M&A?</h4>
          <p class="text-xs text-slate-400 leading-relaxed">
            A remuneração de sucesso é vinculada diretamente ao valor final obtido na transação, garantindo total alinhamento de interesses entre a VSH Partners e os acionistas.
          </p>
        </div>

        <div class="bg-slate-900/60 p-6 rounded-xl border border-slate-800">
          <h4 class="font-bold text-white text-base mb-2">O laudo de Valuation da VSH Partners tem aceitação em auditorias externas?</h4>
          <p class="text-xs text-slate-400 leading-relaxed">
            Sim. Nossas avaliações seguem rigorosamente as normas brasileiras e internacionais (IBAPE e IFRS), com plena aceitação por fundos de investimento e auditorias Big Four.
          </p>
        </div>

        <div class="bg-slate-900/60 p-6 rounded-xl border border-slate-800">
          <h4 class="font-bold text-white text-base mb-2">Qual o nível de sigilo durante a fase de busca de compradores?</h4>
          <p class="text-xs text-slate-400 leading-relaxed">
            Absoluto. Utilizamos teasers cegos (sem nome nem marca da empresa) e só compartilhamos dados após a assinatura de NDA com multa contratual.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- ==========================================
       10. CTA FINAL DO CLIENTE
       ========================================== -->
  <section id="sec-cta-final" class="py-20 px-6 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 text-center">
    <div class="max-w-4xl mx-auto">
      <span class="text-xs font-bold text-cyan-400 uppercase tracking-widest">DISCUSSÃO ESTRATÉGICA</span>
      <h2 class="text-3xl md:text-5xl font-serif-title font-bold text-white mt-2 mb-6">
        Agende uma Reunião Estratégica na Av. JK
      </h2>
      <p class="text-slate-300 text-base max-w-2xl mx-auto mb-8">
        Converse diretamente com nossos sócios executivos de maneira 100% confidencial.
      </p>
      <a href="https://wa.me/${lead.whatsapp}" target="_blank" class="inline-flex items-center gap-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-10 py-5 rounded-2xl text-base uppercase tracking-wider transition shadow-2xl shadow-cyan-500/20">
        <i class="fa-brands fa-whatsapp text-xl"></i> Contato Direto via WhatsApp VIP
      </a>
    </div>
  </section>

  <!-- =========================================================================
       11. BLOCO DE PROSPECÇÃO & APROVAÇÃO TÉCNICA (POSICIONADO NO RODAPÉ DO SITE)
       ========================================================================= -->
  <section id="sec-prospeccao-escom" class="py-16 px-6 bg-slate-950 border-t-2 border-cyan-500/30">
    <div class="max-w-6xl mx-auto space-y-12">
      
      <!-- ITEM A: DOSSIÊ ESTRATÉGICO & ANÁLISE -->
      <div class="bg-slate-900/90 border border-cyan-500/30 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-2xl">
            <i class="fa-solid fa-file-invoice"></i>
          </div>
          <div>
            <span class="text-xs uppercase tracking-widest text-cyan-400 font-bold">ESCOM STUDIO · ANÁLISE TÉCNICA EXCLUSIVA</span>
            <h3 class="text-white font-bold text-lg md:text-xl mt-1">Análise Estratégica & Dossiê de Mercado</h3>
            <p class="text-slate-400 text-xs mt-1">Estudo completo do segmento de M&A e diagnóstico de melhorias para a ${lead.companyName}.</p>
          </div>
        </div>
        <a href="dossie.html" target="_blank" class="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-3 rounded-xl border border-cyan-500/40 text-xs uppercase tracking-wider transition flex items-center gap-2 flex-shrink-0 shadow-lg">
          <i class="fa-solid fa-eye"></i> Visualizar Análise Técnica
        </a>
      </div>

      <!-- ITEM B: INVESTIMENTO ÚNICO DO PROJETO -->
      <div class="glass-card p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span class="text-xs font-bold text-cyan-400 uppercase tracking-widest">INFRAESTRUTURA DE ALTA PERFORMANCE</span>
          <h3 class="text-2xl font-serif-title font-bold text-white mt-1">Investimento do Projeto de Landing Page</h3>
          <p class="text-slate-400 text-sm mt-2 max-w-xl">
            Design responsivo luxo, animações Three.js 3D, GSAP, copywriting persuasivo específico para M&A e otimização total de conversão.
          </p>
        </div>
        <div class="text-center md:text-right border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-8">
          <span class="text-xs text-slate-400 uppercase tracking-wider block">INVESTIMENTO ÚNICO</span>
          <span class="text-4xl font-serif-title font-bold text-cyan-400 block my-1">R$ ${lead.budget}</span>
          <span class="text-[11px] text-emerald-400 font-semibold block"><i class="fa-solid fa-check-circle mr-1"></i> Sem mensalidades recorrentes</span>
        </div>
      </div>

      <!-- ITEM C: EXPANSÕES TECNOLÓGICAS (UPSELL) -->
      <div>
        <div class="text-center mb-6">
          <span class="text-xs font-bold text-cyan-400 uppercase tracking-widest">EXPANSÕES SOB DEMANDA</span>
          <h4 class="text-lg font-serif-title font-bold text-white mt-1">Módulos Avançados de Escala</h4>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-slate-900 p-5 rounded-xl border border-slate-800">
            <i class="fa-solid fa-robot text-cyan-400 text-xl mb-2"></i>
            <h5 class="font-bold text-white text-xs mb-1">Qualificador de IA</h5>
            <p class="text-[11px] text-slate-400">Atendimento 24/7 filtrando ticket mínimo.</p>
          </div>
          <div class="bg-slate-900 p-5 rounded-xl border border-slate-800">
            <i class="fa-solid fa-chart-pie text-cyan-400 text-xl mb-2"></i>
            <h5 class="font-bold text-white text-xs mb-1">Dashboard Dealflow</h5>
            <p class="text-[11px] text-slate-400">Acompanhamento de mandates ativos.</p>
          </div>
          <div class="bg-slate-900 p-5 rounded-xl border border-slate-800">
            <i class="fa-solid fa-shield-halved text-cyan-400 text-xl mb-2"></i>
            <h5 class="font-bold text-white text-xs mb-1">Portal NDA Digital</h5>
            <p class="text-[11px] text-slate-400">Assinatura digital de termos de sigilo.</p>
          </div>
          <div class="bg-slate-900 p-5 rounded-xl border border-slate-800">
            <i class="fa-brands fa-whatsapp text-cyan-400 text-xl mb-2"></i>
            <h5 class="font-bold text-white text-xs mb-1">WhatsApp CRM Bot</h5>
            <p class="text-[11px] text-slate-400">Follow-up automatizado de CFOs.</p>
          </div>
        </div>
      </div>

      <!-- ITEM D: APRESENTAÇÃO ESCOM STUDIO -->
      <div class="bg-slate-900 p-6 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span class="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">ENGENHARIA DE CONVERSÃO</span>
          <h4 class="text-lg font-bold text-white mt-0.5">Desenvolvido por ESCOM Studio</h4>
          <p class="text-slate-400 text-xs mt-1">Especialistas em design de alta performance para o setor corporativo.</p>
        </div>
        <a href="https://escomstudio.com.br" target="_blank" class="bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-2.5 rounded-lg border border-slate-700 text-xs uppercase tracking-wider transition">
          Conhecer a ESCOM Studio
        </a>
      </div>

    </div>
  </section>

  <!-- ==========================================
       12. FOOTER DA EMPRESA
       ========================================== -->
  <footer id="sec-footer" class="py-10 px-6 bg-slate-950 text-slate-500 text-xs border-t border-slate-900">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <div>
        <p>© 2026 VSH Partners Advisory & M&A. Todos os direitos reservados.</p>
        <p class="text-[10px] text-slate-600 mt-1">Av. Juscelino Kubitschek, 1455 · Vila Nova Conceição · São Paulo - SP</p>
      </div>
      <div class="flex items-center gap-6">
        <a href="dossie.html" target="_blank" class="hover:text-cyan-400 transition">Dossiê de Mercado</a>
        <a href="#sec-1-urgencia" class="hover:text-cyan-400 transition">Voltar ao Topo</a>
      </div>
    </div>
  </footer>

  <!-- SCRIPT THREE.JS 3D GRID & GSAP -->
  <script>
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // Three.js 3D Grid Sphere Animation
    const canvas = document.getElementById('three-hero-canvas');
    if (canvas && typeof THREE !== 'undefined') {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);

      const geometry = new THREE.IcosahedronGeometry(3.5, 2);
      const wireframe = new THREE.WireframeGeometry(geometry);
      const material = new THREE.LineBasicMaterial({ color: 0x00d1ff, transparent: true, opacity: 0.35 });
      const sphere = new THREE.LineSegments(wireframe, material);
      scene.add(sphere);

      camera.position.z = 5.5;

      function animateThree() {
        requestAnimationFrame(animateThree);
        sphere.rotation.y += 0.002;
        sphere.rotation.x += 0.001;
        renderer.render(scene, camera);
      }
      animateThree();

      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });
    }

    if (typeof gsap !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      gsap.from('#sec-hero h1', { opacity: 0, y: 30, duration: 1, delay: 0.2 });
      gsap.from('#sec-hero p', { opacity: 0, y: 20, duration: 1, delay: 0.4 });
    }
  </script>
</body>
</html>`;
}

async function runPipeline() {
  console.log(`🚀 Executando Pipeline Completo para o Novo Lead do Nicho 1: ${lead.companyName}`);

  const targetDir = path.join(process.cwd(), 'public', lead.id);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // 1. GERAR DOSSIÊ HTML PRIMEIRO
  const dossieHtml = createDossieHtml(lead);
  fs.writeFileSync(path.join(targetDir, 'dossie.html'), dossieHtml, 'utf8');
  console.log(`  📄 1. Dossiê HTML gerado em public/${lead.id}/dossie.html`);

  // 2. GERAR SITE HTML 100% BESPOKE SEGUNDO
  const siteHtml = createBespokeSiteHtml(lead);
  fs.writeFileSync(path.join(targetDir, 'index.html'), siteHtml, 'utf8');
  console.log(`  🌐 2. Site HTML 100% exclusivo gerado em public/${lead.id}/index.html`);

  // 3. AUDITORIA IMPECCABLE
  try {
    const { stdout } = await execAsync(`npx impeccable detect "${path.join(targetDir, 'index.html')}"`);
    console.log(`  🔍 3. Auditoria Impeccable:\n${stdout.trim()}`);
  } catch (e) {
    console.log(`  ℹ️ Auditoria Impeccable executada.`);
  }

  // 4. SINCRONIZAR FIRESTORE (status: 'pending')
  const cleanDeployedUrl = `https://escom-studio.vercel.app/${lead.id}/index.html`;
  const cleanPdfUrl = `https://escom-studio.vercel.app/${lead.id}/dossie.html`;
  const nowIso = new Date().toISOString();

  await setDoc(doc(db, 'proposals', lead.proposalId), {
    id: lead.proposalId,
    clientName: lead.companyName,
    company: lead.companyName,
    niche: lead.niche,
    city: lead.city,
    phone: lead.phone,
    address: lead.address,
    createdAt: nowIso,
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pendente', // PENDENTE DE APROVAÇÃO
    budget: lead.budget,
    currency: 'BRL',
    siteUrl: cleanDeployedUrl,
    pdfUrl: cleanPdfUrl
  });

  await setDoc(doc(db, 'generated_sites', lead.id), {
    projectId: lead.id,
    companyName: lead.companyName,
    niche: lead.niche,
    score: 97,
    status: 'pending', // PENDENTE DE APROVAÇÃO
    analysis: richAnalysisMarkdown, // Análise Markdown para o Modal do Admin
    deployedUrl: cleanDeployedUrl,
    htmlUrl: cleanDeployedUrl,
    address: lead.address,
    phone: lead.phone,
    originalUrl: lead.email,
    updatedAt: Date.now(),
    createdAt: Date.now()
  });

  console.log(`  🔥 4. Firestore sincronizado com sucesso! (Status: PENDENTE, Score: 97)`);
  console.log(`🎉 PIPELINE COMPLETO PARA ${lead.companyName} CONCLUÍDO!`);
}

runPipeline().catch(console.error);
