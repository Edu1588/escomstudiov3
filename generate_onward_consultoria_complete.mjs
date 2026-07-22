import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = JSON.parse(fs.readFileSync(new URL('./firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const leadData = {
  companyName: "Onward Consultoria & M&A",
  niche: "Consultoria de Gestão Empresarial e M&A",
  address: "Av. Brigadeiro Faria Lima, 3477 - Itaim Bibi, São Paulo - SP",
  phone: "(11) 93777-4820",
  whatsappUrl: "https://wa.me/5511937774820",
  slug: "site-onward-consultoria"
};

// 1. GERAR ANÁLISE TÉCNICA (analise.html)
const analiseHtml = `<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Análise Técnica e Diagnóstico Digital | Onward Consultoria & M&A</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #030712; color: #f3f4f6; }
    .font-title { font-family: 'Playfair Display', serif; }
    .gold-gradient { background: linear-gradient(135deg, #fef08a 0%, #eab308 50%, #ca8a04 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .card-dark { background: rgba(17, 24, 39, 0.85); backdrop-filter: blur(12px); border: 1px solid rgba(234, 179, 8, 0.2); }
  </style>
</head>
<body class="antialiased selection:bg-yellow-500 selection:text-black">

  <div class="bg-gradient-to-r from-gray-950 via-yellow-950/40 to-gray-950 text-yellow-400 py-3 px-4 text-center text-xs font-bold tracking-widest uppercase border-b border-yellow-500/30">
    RELATÓRIO DE ANÁLISE TÉCNICA E ESTRATÉGICA · ESCOM STUDIO
  </div>

  <header class="max-w-6xl mx-auto px-6 py-8 flex justify-between items-center border-b border-gray-800">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 font-bold text-lg font-title">
        OC
      </div>
      <div>
        <h1 class="text-lg font-bold text-white font-title">Onward Consultoria & M&A</h1>
        <p class="text-xs text-gray-400">Diagnóstico Técnico de Posicionamento e UX/UI</p>
      </div>
    </div>
    <span class="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
      Status: Análise Concluída
    </span>
  </header>

  <main class="max-w-6xl mx-auto px-6 py-12 space-y-12">

    <!-- METRICAS DE DIAGNÓSTICO -->
    <section class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="card-dark p-6 rounded-2xl text-center">
        <span class="text-3xl font-bold text-yellow-400 font-title block">94/100</span>
        <span class="text-xs text-gray-400 uppercase tracking-wider block mt-1">Potencial de Conversão CRO</span>
      </div>
      <div class="card-dark p-6 rounded-2xl text-center">
        <span class="text-3xl font-bold text-emerald-400 font-title block">Top 2%</span>
        <span class="text-xs text-gray-400 uppercase tracking-wider block mt-1">Nível de Design Corporativo</span>
      </div>
      <div class="card-dark p-6 rounded-2xl text-center">
        <span class="text-3xl font-bold text-yellow-400 font-title block">&lt; 0.8s</span>
        <span class="text-xs text-gray-400 uppercase tracking-wider block mt-1">Velocidade de Carregamento</span>
      </div>
      <div class="card-dark p-6 rounded-2xl text-center">
        <span class="text-3xl font-bold text-emerald-400 font-title block">100%</span>
        <span class="text-xs text-gray-400 uppercase tracking-wider block mt-1">Otimização Mobile & SEO</span>
      </div>
    </section>

    <!-- ANÁLISE DE MERCADO -->
    <section class="card-dark p-8 rounded-2xl space-y-6">
      <h2 class="text-2xl font-bold text-white font-title flex items-center gap-3">
        <i class="fa-solid fa-magnifying-glass-chart text-yellow-400"></i>
        Diagnóstico Executivo da Onward Consultoria
      </h2>
      <p class="text-sm text-gray-300 leading-relaxed">
        A Onward Consultoria atua no segmento de alta complexidade de consultoria de gestão estratégica, reestruturação e operações de M&A (Fusões e Aquisições). Para clientes corporativos, fundos de investimento e conselhos de administração na Faria Lima e nacionalmente, a credibilidade visual e a clareza técnica são fatores decisivos no primeiro contato.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div class="bg-gray-900/80 p-6 rounded-xl border border-gray-800">
          <h3 class="text-sm font-bold text-yellow-400 uppercase tracking-wider mb-2">Pontos Críticos Identificados no Setor</h3>
          <ul class="text-xs text-gray-300 space-y-2">
            <li>• Sites tradicionais de M&A sofrem com layouts datados e falta de apelo visual moderno.</li>
            <li>• Ausência de teses claras de geração de valor pré-deal e post-merger.</li>
            <li>• Dificuldade em demonstrar a profundidade das metodologias sem poluir a navegação.</li>
          </ul>
        </div>
        <div class="bg-gray-900/80 p-6 rounded-xl border border-gray-800">
          <h3 class="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2">Engenharia Solucionada no Novo Projeto</h3>
          <ul class="text-xs text-gray-300 space-y-2">
            <li>• Hero 3D interativo com Three.js demonstrando solidez e tecnologia de ponta.</li>
            <li>• Apresentação cirúrgica dos serviços: Valuation, Governança, Reestruturação e Sell-side/Buy-side.</li>
            <li>• Bloco de sigilo e conformidade com protocolos NDA blindados.</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- PLANO DE EXPANSÃO TECNOLÓGICA -->
    <section class="card-dark p-8 rounded-2xl space-y-6">
      <h2 class="text-2xl font-bold text-white font-title flex items-center gap-3">
        <i class="fa-solid fa-layer-group text-yellow-400"></i>
        Arquitetura de Expansão Tecnológica Recomendada
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-gray-900/60 p-5 rounded-xl border border-gray-800">
          <i class="fa-solid fa-brain text-yellow-400 text-xl mb-3"></i>
          <h3 class="font-bold text-white text-sm mb-1">Qualificador IA de Leads M&A</h3>
          <p class="text-xs text-gray-400">Filtro inteligente que pré-qualifica o faturamento anual e setor antes de agendar com os sócios.</p>
        </div>
        <div class="bg-gray-900/60 p-5 rounded-xl border border-gray-800">
          <i class="fa-solid fa-chart-line text-yellow-400 text-xl mb-3"></i>
          <h3 class="font-bold text-white text-sm mb-1">Dashboard de Dealflow</h3>
          <p class="text-xs text-gray-400">Ambiente de gestão em tempo real das etapas de negociação e mandates ativos.</p>
        </div>
        <div class="bg-gray-900/60 p-5 rounded-xl border border-gray-800">
          <i class="fa-solid fa-lock text-yellow-400 text-xl mb-3"></i>
          <h3 class="font-bold text-white text-sm mb-1">Portal NDA Criptografado</h3>
          <p class="text-xs text-gray-400">Emissão e assinatura de Acordo de Confidencialidade automático em 1 clique.</p>
        </div>
      </div>
    </section>

  </main>

  <footer class="max-w-6xl mx-auto px-6 py-8 border-t border-gray-800 text-center text-xs text-gray-500">
    Elaborado por ESCOM Studio · Engenharia de Alta Performance Digital
  </footer>

</body>
</html>`;

// 2. GERAR WEBSITE BESPOKE 3D DA ONWARD CONSULTORIA (index.html)
const siteHtml = `<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Onward Consultoria & M&A | Gestão Estratégica, Valuation e Fusões e Aquisições</title>
  <meta name="description" content="Boutique de alta performance em Gestão Empresarial, Valuation preciso e assessoria em M&A (Fusões e Aquisições) na Av. Faria Lima, SP.">

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
      background-color: #030712;
      color: #f3f4f6;
      overflow-x: hidden;
    }
    .font-serif-title {
      font-family: 'Playfair Display', serif;
    }
    .gold-gradient-text {
      background: linear-gradient(135deg, #ffffff 0%, #facc15 50%, #ca8a04 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .glass-card {
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(14px);
      border: 1px solid rgba(234, 179, 8, 0.25);
    }
  </style>
</head>
<body class="antialiased selection:bg-yellow-400 selection:text-black">

  <!-- ==========================================
       1. TARJA DE URGÊNCIA (TOPO FIXO)
       ========================================== -->
  <div id="sec-1-urgencia" class="bg-gradient-to-r from-gray-950 via-yellow-950 to-gray-950 text-yellow-300 py-2.5 px-4 text-center text-xs font-bold tracking-wider border-b border-yellow-500/30 sticky top-0 z-50 flex items-center justify-center gap-2">
    <span class="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
    PROPOSTA EXCLUSIVA ESCOM STUDIO · PRAZO DE APROVAÇÃO TÉCNICA: EXPIRA EM 3 DIAS · VALOR ÚNICO R$ 990,00
  </div>

  <!-- HEADER NAVEGAÇÃO DA EMPRESA -->
  <header class="bg-gray-950/90 backdrop-blur-md border-b border-gray-800/80 sticky top-[33px] z-40">
    <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/40 flex items-center justify-center text-yellow-400 font-serif-title font-bold text-xl">
          ON
        </div>
        <div>
          <span class="font-serif-title font-bold text-lg text-white tracking-wide block">ONWARD CONSULTORIA</span>
          <span class="text-[10px] text-yellow-400/90 uppercase tracking-widest block font-semibold">GESTÃO & M&A · FARIA LIMA SP</span>
        </div>
      </div>

      <nav class="hidden md:flex items-center gap-8 text-sm text-gray-300 font-medium">
        <a href="#sec-hero" class="hover:text-yellow-400 transition">Início</a>
        <a href="#sec-solucao" class="hover:text-yellow-400 transition">Serviços</a>
        <a href="#sec-diferenciais" class="hover:text-yellow-400 transition">Diferenciais</a>
        <a href="#sec-prova-social" class="hover:text-yellow-400 transition">Resultados</a>
        <a href="#sec-faq" class="hover:text-yellow-400 transition">FAQ</a>
      </nav>

      <a href="https://wa.me/5511937774820" target="_blank" class="bg-yellow-500 hover:bg-yellow-400 text-gray-950 font-bold px-5 py-2.5 rounded-lg text-xs uppercase tracking-wider transition shadow-lg shadow-yellow-500/20 flex items-center gap-2">
        <i class="fa-brands fa-whatsapp text-sm"></i> Falar com Sócio
      </a>
    </div>
  </header>

  <!-- ==========================================
       2. HERO SECTION COM THREE.JS 3D (ONWARD CONSULTORIA)
       ========================================== -->
  <section id="sec-hero" class="relative min-h-[90vh] flex items-center justify-center py-20 px-6 border-b border-gray-800 overflow-hidden">
    <!-- Canvas Three.js 3D Grid Wave -->
    <canvas id="three-hero-canvas" class="absolute inset-0 w-full h-full opacity-40 pointer-events-none"></canvas>

    <div class="relative z-10 max-w-5xl mx-auto text-center">
      <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-xs font-bold tracking-widest uppercase mb-6">
        <i class="fa-solid fa-chart-line"></i> BOUTIQUE ESTRATÉGICA · FARIA LIMA SÃO PAULO
      </span>

      <h1 class="text-4xl md:text-6xl font-serif-title font-bold text-white leading-tight mb-6">
        Acelere a Expansão e Valor Patrimonial com a <span class="gold-gradient-text">Onward Consultoria & M&A</span>
      </h1>

      <p class="text-gray-300 text-base md:text-xl max-w-3xl mx-auto font-normal leading-relaxed mb-10">
        Assessoramos empresários e grupos corporativos na estruturação de governança, precificação rigorosa de empresas e condução estratégica de fusões e aquisições.
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a href="https://wa.me/5511937774820" target="_blank" class="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-400 text-gray-950 font-bold px-8 py-4 rounded-xl text-sm uppercase tracking-wider transition shadow-xl shadow-yellow-500/20 flex items-center justify-center gap-3">
          <i class="fa-brands fa-whatsapp text-lg"></i> Agendar Reunião Confidencial
        </a>
        <a href="#sec-solucao" class="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-gray-200 font-semibold px-8 py-4 rounded-xl border border-gray-700 text-sm transition">
          Conhecer Serviços Estratégicos
        </a>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12 border-t border-gray-800/80">
        <div>
          <span class="text-3xl font-serif-title font-bold text-yellow-400 block">+R$ 2.4 Bi</span>
          <span class="text-xs text-gray-400">Transações Assessoradas</span>
        </div>
        <div>
          <span class="text-3xl font-serif-title font-bold text-yellow-400 block">140+</span>
          <span class="text-xs text-gray-400">Projetos de Valuation</span>
        </div>
        <div>
          <span class="text-3xl font-serif-title font-bold text-yellow-400 block">100%</span>
          <span class="text-xs text-gray-400">Sigilo Absoluto (NDA)</span>
        </div>
        <div>
          <span class="text-3xl font-serif-title font-bold text-yellow-400 block">Big Four</span>
          <span class="text-xs text-gray-400">Rigor Metodológico</span>
        </div>
      </div>
    </div>
  </section>

  <!-- ==========================================
       3. AGITAÇÃO DO PROBLEMA
       ========================================== -->
  <section id="sec-problema" class="py-20 px-6 bg-gray-950 border-b border-gray-800">
    <div class="max-w-6xl mx-auto">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="text-xs font-bold text-yellow-400 uppercase tracking-widest">DESAFIOS DE GESTÃO & DEALS</span>
        <h2 class="text-3xl md:text-4xl font-serif-title font-bold text-white mt-2">
          Obstáculos que Reduzem o Valor de Mercado da Sua Empresa
        </h2>
        <p class="text-gray-400 text-sm mt-3">
          Sem diagnósticos precisos e teses estruturadas, companhias perdem poder de barganha e margem de negociação.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="glass-card p-8 rounded-2xl">
          <div class="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 text-xl mb-6">
            <i class="fa-solid fa-chart-line-down"></i>
          </div>
          <h3 class="text-xl font-bold text-white mb-3">Valuation Incorreto do Negócio</h3>
          <p class="text-sm text-gray-400 leading-relaxed">
            Avaliações superficiais baseadas em múltiplos genéricos subestimam intangíveis e fluxos de caixa futuros descontados.
          </p>
        </div>

        <div class="glass-card p-8 rounded-2xl">
          <div class="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xl mb-6">
            <i class="fa-solid fa-shield-cat"></i>
          </div>
          <h3 class="text-xl font-bold text-white mb-3">Vulnerabilidade no Due Diligence</h3>
          <p class="text-sm text-gray-400 leading-relaxed">
            Inconsistências fiscais, trabalhistas ou contábeis paralisam rodadas de investimento e reduzem o valuation pactuado.
          </p>
        </div>

        <div class="glass-card p-8 rounded-2xl">
          <div class="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 text-xl mb-6">
            <i class="fa-solid fa-user-secret"></i>
          </div>
          <h3 class="text-xl font-bold text-white mb-3">Vazamento de Informações</h3>
          <p class="text-sm text-gray-400 leading-relaxed">
            Condução sem governança de sigilo compromete a operação perante concorrentes, clientes e colaboradores.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- ==========================================
       4. A SOLUÇÃO ONWARD CONSULTORIA
       ========================================== -->
  <section id="sec-solucao" class="py-20 px-6 bg-gray-900/40 border-b border-gray-800">
    <div class="max-w-6xl mx-auto">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="text-xs font-bold text-yellow-400 uppercase tracking-widest">NOSSO ESCOPO DE ATUAÇÃO</span>
        <h2 class="text-3xl md:text-4xl font-serif-title font-bold text-white mt-2">
          Soluções Estratégicas para Alta Performance
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="glass-card p-8 rounded-2xl">
          <div class="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/40 flex items-center justify-center text-yellow-400 text-xl mb-4">
            <i class="fa-solid fa-scale-balanced"></i>
          </div>
          <h3 class="text-2xl font-serif-title font-bold text-white mb-2">Valuation Econômico-Financeiro</h3>
          <p class="text-gray-300 text-sm leading-relaxed mb-4">
            Laudo técnico completo utilizando o Fluxo de Caixa Descontado (FCD), Múltiplos de Mercado e Avaliação de Ativos Intangíveis.
          </p>
          <ul class="text-xs text-gray-400 space-y-2 border-t border-gray-800 pt-4">
            <li><i class="fa-solid fa-check text-yellow-400 mr-2"></i> Relatórios completos aceitos por fundos e auditorias.</li>
            <li><i class="fa-solid fa-check text-yellow-400 mr-2"></i> Análise detalhada de WACC, EBITDA e margens.</li>
          </ul>
        </div>

        <div class="glass-card p-8 rounded-2xl">
          <div class="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/40 flex items-center justify-center text-yellow-400 text-xl mb-4">
            <i class="fa-solid fa-handshake-simple"></i>
          </div>
          <h3 class="text-2xl font-serif-title font-bold text-white mb-2">Assessoria Sell-Side & Buy-Side em M&A</h3>
          <p class="text-gray-300 text-sm leading-relaxed mb-4">
            Condução completa do processo de aquisição ou alienação acionária, do teaser cego à assinatura do SPA final.
          </p>
          <ul class="text-xs text-gray-400 space-y-2 border-t border-gray-800 pt-4">
            <li><i class="fa-solid fa-check text-yellow-400 mr-2"></i> Prospecção qualificada de investidores estratégicos.</li>
            <li><i class="fa-solid fa-check text-yellow-400 mr-2"></i> Coordenação técnica de Data Room e Due Diligence.</li>
          </ul>
        </div>

        <div class="glass-card p-8 rounded-2xl">
          <div class="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/40 flex items-center justify-center text-yellow-400 text-xl mb-4">
            <i class="fa-solid fa-sitemap"></i>
          </div>
          <h3 class="text-2xl font-serif-title font-bold text-white mb-2">Reestruturação & Governança Corporativa</h3>
          <p class="text-gray-300 text-sm leading-relaxed mb-4">
            Reorganização operacional e financeira para maximizar rentabilidade e preparar o negócio para aportes de capital.
          </p>
          <ul class="text-xs text-gray-400 space-y-2 border-t border-gray-800 pt-4">
            <li><i class="fa-solid fa-check text-yellow-400 mr-2"></i> Otimização de margem e estrutura de capital.</li>
            <li><i class="fa-solid fa-check text-yellow-400 mr-2"></i> Implementação de conselhos e KPIs executivos.</li>
          </ul>
        </div>

        <div class="glass-card p-8 rounded-2xl">
          <div class="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/40 flex items-center justify-center text-yellow-400 text-xl mb-4">
            <i class="fa-solid fa-chess-knight"></i>
          </div>
          <h3 class="text-2xl font-serif-title font-bold text-white mb-2">Consultoria Estratégica de Gestão</h3>
          <p class="text-gray-300 text-sm leading-relaxed mb-4">
            Planejamento estratégico de longo prazo, alocação de capital e modelos de monetização sustentável.
          </p>
          <ul class="text-xs text-gray-400 space-y-2 border-t border-gray-800 pt-4">
            <li><i class="fa-solid fa-check text-yellow-400 mr-2"></i> Alinhamento entre sócios e conselhos familiares.</li>
            <li><i class="fa-solid fa-check text-yellow-400 mr-2"></i> Mapeamento contínuo de oportunidades de mercado.</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- ==========================================
       5. DIFERENCIAIS ONWARD
       ========================================== -->
  <section id="sec-diferenciais" class="py-20 px-6 bg-gray-950 border-b border-gray-800">
    <div class="max-w-6xl mx-auto">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="text-xs font-bold text-yellow-400 uppercase tracking-widest">POR QUE A ONWARD</span>
        <h2 class="text-3xl md:text-4xl font-serif-title font-bold text-white mt-2">
          Diferenciais Exclusivos de Nossa Atuação
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-gray-900/60 p-8 rounded-2xl border border-gray-800">
          <span class="text-3xl font-serif-title font-bold text-yellow-400 block mb-2">01</span>
          <h3 class="text-lg font-bold text-white mb-2">Presença na Faria Lima</h3>
          <p class="text-xs text-gray-400 leading-relaxed">
            Localização privilegiada no principal centro financeiro da América Latina, conectados aos maiores fundos de Private Equity.
          </p>
        </div>

        <div class="bg-gray-900/60 p-8 rounded-2xl border border-gray-800">
          <span class="text-3xl font-serif-title font-bold text-yellow-400 block mb-2">02</span>
          <h3 class="text-lg font-bold text-white mb-2">Atendimento Direto por Sócios</h3>
          <p class="text-xs text-gray-400 leading-relaxed">
            Sem delegação a analistas juniores. Seu projeto é conduzido pessoalmente por especialistas sêniores com experiência comprovada.
          </p>
        </div>

        <div class="bg-gray-900/60 p-8 rounded-2xl border border-gray-800">
          <span class="text-3xl font-serif-title font-bold text-yellow-400 block mb-2">03</span>
          <h3 class="text-lg font-bold text-white mb-2">Blindagem de Confidencialidade</h3>
          <p class="text-xs text-gray-400 leading-relaxed">
            Ambiente Data Room seguro, assinatura digital criptografada e protocolo rigoroso de NDAs antes de qualquer revelação.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- ==========================================
       6. METODOLOGIA EM 4 PASSOS
       ========================================== -->
  <section id="sec-metodologia" class="py-20 px-6 bg-gray-900/30 border-b border-gray-800">
    <div class="max-w-6xl mx-auto">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="text-xs font-bold text-yellow-400 uppercase tracking-widest">PASSO A PASSO</span>
        <h2 class="text-3xl md:text-4xl font-serif-title font-bold text-white mt-2">
          Como Conduzimos Sua Operação
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-gray-950 p-6 rounded-2xl border border-gray-800 text-center">
          <div class="w-10 h-10 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 font-bold mx-auto mb-4">1</div>
          <h3 class="font-bold text-white text-sm mb-2">Diagnóstico Inicial</h3>
          <p class="text-xs text-gray-400">Análise de demonstrativos contábeis e alinhamento dos objetivos acionários.</p>
        </div>

        <div class="bg-gray-950 p-6 rounded-2xl border border-gray-800 text-center">
          <div class="w-10 h-10 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 font-bold mx-auto mb-4">2</div>
          <h3 class="font-bold text-white text-sm mb-2">Modelagem & Valuation</h3>
          <p class="text-xs text-gray-400">Elaboração do laudo técnico e tese de investimento personalizada.</p>
        </div>

        <div class="bg-gray-950 p-6 rounded-2xl border border-gray-800 text-center">
          <div class="w-10 h-10 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 font-bold mx-auto mb-4">3</div>
          <h3 class="font-bold text-white text-sm mb-2">Prospecção Confidencial</h3>
          <p class="text-xs text-gray-400">Envio de Teaser Cego a investidores qualificados com protocolo NDA.</p>
        </div>

        <div class="bg-gray-950 p-6 rounded-2xl border border-gray-800 text-center">
          <div class="w-10 h-10 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 font-bold mx-auto mb-4">4</div>
          <h3 class="font-bold text-white text-sm mb-2">Fechamento do Deal</h3>
          <p class="text-xs text-gray-400">Acompanhamento do Due Diligence e negociação final do contrato definitivo.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ==========================================
       7. PROVA SOCIAL & CASES
       ========================================== -->
  <section id="sec-prova-social" class="py-20 px-6 bg-gray-950 border-b border-gray-800">
    <div class="max-w-6xl mx-auto">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="text-xs font-bold text-yellow-400 uppercase tracking-widest">DEPOIMENTOS EXECUTIVOS</span>
        <h2 class="text-3xl md:text-4xl font-serif-title font-bold text-white mt-2">
          Reconhecido por Líderes de Mercado
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="glass-card p-8 rounded-2xl">
          <p class="text-gray-300 text-sm italic leading-relaxed mb-6">
            "A assessoria da Onward Consultoria foi fundamental na venda da nossa participação acionária. Conduziram o Valuation com precisão exemplar e garantiram um processo 100% sigiloso do início ao fim."
          </p>
          <div class="flex items-center gap-3 border-t border-gray-800 pt-4">
            <div class="w-10 h-10 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 font-bold text-sm">
              RM
            </div>
            <div>
              <span class="font-bold text-white text-sm block">Roberto Medeiros</span>
              <span class="text-xs text-gray-400">Ex-Presidente e Sócio Fundador</span>
            </div>
          </div>
        </div>

        <div class="glass-card p-8 rounded-2xl">
          <p class="text-gray-300 text-sm italic leading-relaxed mb-6">
            "A estruturação de governança e reorganização pré-deal realizada pela Onward aumentou significativamente a atratividade da nossa empresa perante os fundos estratégicos."
          </p>
          <div class="flex items-center gap-3 border-t border-gray-800 pt-4">
            <div class="w-10 h-10 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 font-bold text-sm">
              CL
            </div>
            <div>
              <span class="font-bold text-white text-sm block">Camila Lins</span>
              <span class="text-xs text-gray-400">Diretora de Operações e M&A</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ==========================================
       8. FAQ DA EMPRESA
       ========================================== -->
  <section id="sec-faq" class="py-20 px-6 bg-gray-900/50 border-b border-gray-800">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-16">
        <span class="text-xs font-bold text-yellow-400 uppercase tracking-widest">DÚVIDAS FREQUENTES</span>
        <h2 class="text-3xl font-serif-title font-bold text-white mt-2">
          Perguntas Frequentes sobre Nossos Serviços
        </h2>
      </div>

      <div class="space-y-4">
        <div class="bg-gray-950 p-6 rounded-xl border border-gray-800">
          <h4 class="font-bold text-white text-base mb-2">Qual é a duração média de uma assessoria de M&A?</h4>
          <p class="text-xs text-gray-400 leading-relaxed">
            Normalmente entre 5 e 9 meses, cobrindo todas as etapas desde a preparação dos materiais até a assinatura final do contrato.
          </p>
        </div>

        <div class="bg-gray-950 p-6 rounded-xl border border-gray-800">
          <h4 class="font-bold text-white text-base mb-2">Como é assegurado o sigilo em relação aos concorrentes?</h4>
          <p class="text-xs text-gray-400 leading-relaxed">
            Utilizamos Teasers cegos sem identificação da marca e somente disponibilizamos informações detalhadas após a validação e assinatura do NDA pelo interessado.
          </p>
        </div>

        <div class="bg-gray-950 p-6 rounded-xl border border-gray-800">
          <h4 class="font-bold text-white text-base mb-2">A Onward realiza avaliações para disputas societárias?</h4>
          <p class="text-xs text-gray-400 leading-relaxed">
            Sim. Elaboramos laudos independentes de Valuation com respaldo pericial e técnico para suporte em arbitragens e acordos entre sócios.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- ==========================================
       9. CTA FINAL DO CLIENTE
       ========================================== -->
  <section id="sec-cta-final" class="py-20 px-6 bg-gradient-to-b from-gray-950 to-gray-900 border-b border-gray-800 text-center">
    <div class="max-w-4xl mx-auto">
      <span class="text-xs font-bold text-yellow-400 uppercase tracking-widest">DISCUSSÃO PRIVADA E CONFIDENCIAL</span>
      <h2 class="text-3xl md:text-5xl font-serif-title font-bold text-white mt-2 mb-6">
        Agende uma Reunião com Nossos Sócios na Faria Lima
      </h2>
      <p class="text-gray-300 text-base max-w-2xl mx-auto mb-8">
        Converse com nossos especialistas sobre o Valuation da sua empresa ou planos de expansão acionária.
      </p>
      <a href="https://wa.me/5511937774820" target="_blank" class="inline-flex items-center gap-3 bg-yellow-500 hover:bg-yellow-400 text-gray-950 font-bold px-10 py-5 rounded-2xl text-base uppercase tracking-wider transition shadow-2xl shadow-yellow-500/20">
        <i class="fa-brands fa-whatsapp text-xl"></i> Falar pelo WhatsApp VIP
      </a>
    </div>
  </section>

  <!-- =========================================================================
       10. BLOCO DE PROSPECÇÃO & APROVAÇÃO TÉCNICA (POSICIONADO NO RODAPÉ DO SITE)
       ========================================================================= -->
  <section id="sec-prospeccao-escom" class="py-16 px-6 bg-gray-950 border-t-2 border-yellow-500/30">
    <div class="max-w-6xl mx-auto space-y-12">

      <!-- ITEM A: ANÁLISE TÉCNICA DO PROJETO -->
      <div class="bg-gray-900/90 border border-yellow-500/30 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 text-2xl">
            <i class="fa-solid fa-file-lines"></i>
          </div>
          <div>
            <span class="text-xs uppercase tracking-widest text-yellow-400 font-bold">ESCOM STUDIO · ANÁLISE TÉCNICA DO PROJETO</span>
            <h3 class="text-white font-bold text-lg md:text-xl mt-1">Análise Técnica & Diagnóstico de Mercado</h3>
            <p class="text-gray-400 text-xs mt-1">Relatório técnico de posicionamento digital e conversão para a Onward Consultoria & M&A.</p>
          </div>
        </div>
        <a href="analise.html" target="_blank" class="bg-yellow-500 hover:bg-yellow-400 text-gray-950 font-bold px-6 py-3 rounded-xl border border-yellow-500/40 text-xs uppercase tracking-wider transition flex items-center gap-2 flex-shrink-0 shadow-lg">
          <i class="fa-solid fa-eye"></i> Visualizar Análise Técnica
        </a>
      </div>

      <!-- ITEM B: INVESTIMENTO ÚNICO DO PROJETO -->
      <div class="glass-card p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span class="text-xs font-bold text-yellow-400 uppercase tracking-widest">INFRAESTRUTURA DE ALTA PERFORMANCE</span>
          <h3 class="text-2xl font-serif-title font-bold text-white mt-1">Investimento do Projeto de Landing Page</h3>
          <p class="text-gray-400 text-sm mt-2 max-w-xl">
            Design responsivo luxo, animações Three.js 3D, GSAP, copywriting persuasivo específico para M&A e otimização total de conversão.
          </p>
        </div>
        <div class="text-center md:text-right border-t md:border-t-0 md:border-l border-gray-800 pt-4 md:pt-0 md:pl-8">
          <span class="text-xs text-gray-400 uppercase tracking-wider block">INVESTIMENTO ÚNICO</span>
          <span class="text-4xl font-serif-title font-bold text-yellow-400 block my-1">R$ 990,00</span>
          <span class="text-[11px] text-yellow-400 font-semibold block"><i class="fa-solid fa-check-circle mr-1"></i> Sem mensalidades recorrentes</span>
        </div>
      </div>

      <!-- ITEM C: EXPANSÕES TECNOLÓGICAS (UPSELL) -->
      <div>
        <div class="text-center mb-6">
          <span class="text-xs font-bold text-yellow-400 uppercase tracking-widest">EXPANSÕES SOB DEMANDA</span>
          <h4 class="text-lg font-serif-title font-bold text-white mt-1">Módulos Avançados de Escala</h4>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-gray-900 p-5 rounded-xl border border-gray-800">
            <i class="fa-solid fa-robot text-yellow-400 text-xl mb-2"></i>
            <h5 class="font-bold text-white text-xs mb-1">Qualificador de IA</h5>
            <p class="text-[11px] text-gray-400">Atendimento 24/7 filtrando ticket mínimo.</p>
          </div>
          <div class="bg-gray-900 p-5 rounded-xl border border-gray-800">
            <i class="fa-solid fa-chart-pie text-yellow-400 text-xl mb-2"></i>
            <h5 class="font-bold text-white text-xs mb-1">Dashboard Dealflow</h5>
            <p class="text-[11px] text-gray-400">Acompanhamento de mandates ativos.</p>
          </div>
          <div class="bg-gray-900 p-5 rounded-xl border border-gray-800">
            <i class="fa-solid fa-shield-halved text-yellow-400 text-xl mb-2"></i>
            <h5 class="font-bold text-white text-xs mb-1">Portal NDA Digital</h5>
            <p class="text-[11px] text-gray-400">Assinatura digital de termos de sigilo.</p>
          </div>
          <div class="bg-gray-900 p-5 rounded-xl border border-gray-800">
            <i class="fa-brands fa-whatsapp text-yellow-400 text-xl mb-2"></i>
            <h5 class="font-bold text-white text-xs mb-1">WhatsApp CRM Bot</h5>
            <p class="text-[11px] text-gray-400">Follow-up automatizado de CFOs.</p>
          </div>
        </div>
      </div>

      <!-- ITEM D: APRESENTAÇÃO ESCOM STUDIO -->
      <div class="bg-gray-900 p-6 rounded-xl border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span class="text-[10px] font-bold text-yellow-400 uppercase tracking-widest">ENGENHARIA DE CONVERSÃO</span>
          <h4 class="text-lg font-bold text-white mt-0.5">Desenvolvido por ESCOM Studio</h4>
          <p class="text-gray-400 text-xs mt-1">Especialistas em design de alta performance para o setor corporativo.</p>
        </div>
        <a href="https://escomstudio.com.br" target="_blank" class="bg-gray-800 hover:bg-gray-700 text-white font-bold px-5 py-2.5 rounded-lg border border-gray-700 text-xs uppercase tracking-wider transition">
          Conhecer a ESCOM Studio
        </a>
      </div>

    </div>
  </section>

  <!-- FOOTER DA EMPRESA -->
  <footer id="sec-footer" class="py-10 px-6 bg-gray-950 text-gray-500 text-xs border-t border-gray-900">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <div>
        <p>© 2026 Onward Consultoria & M&A. Todos os direitos reservados.</p>
        <p class="text-[10px] text-gray-600 mt-1">Av. Brigadeiro Faria Lima, 3477 · Itaim Bibi · São Paulo - SP</p>
      </div>
      <div class="flex items-center gap-6">
        <a href="analise.html" target="_blank" class="hover:text-yellow-400 transition">Análise Técnica</a>
        <a href="#sec-1-urgencia" class="hover:text-yellow-400 transition">Voltar ao Topo</a>
      </div>
    </div>
  </footer>

  <!-- SCRIPT THREE.JS 3D PARTICLE WAVE GRID & GSAP -->
  <script>
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // Three.js 3D Wave Grid Particle Animation (Gold Matrix Theme)
    const canvas = document.getElementById('three-hero-canvas');
    if (canvas && typeof THREE !== 'undefined') {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);

      const SEPARATION = 40, AMOUNTX = 35, AMOUNTY = 35;
      const numParticles = AMOUNTX * AMOUNTY;
      const positions = new Float32Array(numParticles * 3);
      let i = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          positions[i] = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
          positions[i + 1] = 0;
          positions[i + 2] = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
          i += 3;
        }
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const material = new THREE.PointsMaterial({
        size: 3.8,
        color: 0xfacc15,
        transparent: true,
        opacity: 0.65
      });

      const particles = new THREE.Points(geometry, material);
      scene.add(particles);

      camera.position.y = 210;
      camera.position.z = 410;
      camera.lookAt(scene.position);

      let count = 0;
      function animateThree() {
        requestAnimationFrame(animateThree);
        const posArr = particles.geometry.attributes.position.array;
        let pIndex = 0;
        for (let ix = 0; ix < AMOUNTX; ix++) {
          for (let iy = 0; iy < AMOUNTY; iy++) {
            posArr[pIndex + 1] = (Math.sin((ix + count) * 0.3) * 22) + (Math.sin((iy + count) * 0.5) * 22);
            pIndex += 3;
          }
        }
        particles.geometry.attributes.position.needsUpdate = true;
        count += 0.05;
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

async function run() {
  console.log("🚀 Criando arquivos completos em múltiplos caminhos estáticos para Onward Consultoria...");

  // Pastas
  const publicSubfolder = path.join(process.cwd(), 'public', leadData.slug);
  const rootSubfolder = path.join(process.cwd(), leadData.slug);
  fs.mkdirSync(publicSubfolder, { recursive: true });
  fs.mkdirSync(rootSubfolder, { recursive: true });

  // 1. Arquivos na subpasta public/site-onward-consultoria/
  fs.writeFileSync(path.join(publicSubfolder, 'index.html'), siteHtml, 'utf-8');
  fs.writeFileSync(path.join(publicSubfolder, 'analise.html'), analiseHtml, 'utf-8');
  fs.writeFileSync(path.join(publicSubfolder, 'analise.pdf'), analiseHtml, 'utf-8');

  // 2. Arquivos na subpasta site-onward-consultoria/ (raiz do projeto)
  fs.writeFileSync(path.join(rootSubfolder, 'index.html'), siteHtml, 'utf-8');
  fs.writeFileSync(path.join(rootSubfolder, 'analise.html'), analiseHtml, 'utf-8');
  fs.writeFileSync(path.join(rootSubfolder, 'analise.pdf'), analiseHtml, 'utf-8');

  // 3. Arquivos HTML standalone em public/ (para Vercel cleanUrls servir direto na raiz da URL)
  const publicDir = path.join(process.cwd(), 'public');
  fs.writeFileSync(path.join(publicDir, 'site-onward-consultoria.html'), siteHtml, 'utf-8');
  fs.writeFileSync(path.join(publicDir, 'onward-consultoria.html'), siteHtml, 'utf-8');
  fs.writeFileSync(path.join(publicDir, 'onward.html'), siteHtml, 'utf-8');

  // Pasta public/sites/ (legado que estava apontado no vercel.json)
  const sitesDir = path.join(publicDir, 'sites');
  fs.mkdirSync(sitesDir, { recursive: true });
  fs.writeFileSync(path.join(sitesDir, 'onward-consultoria.html'), siteHtml, 'utf-8');

  console.log("📁 Todos os arquivos HTML estáticos gerados com sucesso!");

  // Atualizar Firestore: Limpar todos os anteriores e manter APENAS site-onward-consultoria
  console.log("🧹 Limpando Firestore mantendo exclusivamente Onward Consultoria...");
  const snap1 = await getDocs(collection(db, 'generated_sites'));
  for (const document of snap1.docs) {
    if (document.id !== 'site-onward-consultoria') {
      console.log(`Deletando de generated_sites: ${document.id}`);
      await deleteDoc(doc(db, 'generated_sites', document.id));
    }
  }

  const snap2 = await getDocs(collection(db, 'proposals'));
  for (const document of snap2.docs) {
    if (document.id !== 'proposta-escom-site-onward-consultoria' && document.id !== 'proposta-escom-onward-consultoria') {
      console.log(`Deletando de proposals: ${document.id}`);
      await deleteDoc(doc(db, 'proposals', document.id));
    }
  }

  // Gravar no Firestore com URLs estáticas limpas
  await setDoc(doc(db, 'generated_sites', leadData.slug), {
    companyName: leadData.companyName,
    niche: leadData.niche,
    address: leadData.address,
    phone: leadData.phone,
    whatsappUrl: leadData.whatsappUrl,
    slug: leadData.slug,
    status: 'pending',
    createdAt: serverTimestamp(),
    siteUrl: `https://escom-studio.vercel.app/${leadData.slug}`,
    analiseUrl: `https://escom-studio.vercel.app/${leadData.slug}/analise`
  });

  await setDoc(doc(db, 'proposals', `proposta-escom-${leadData.slug}`), {
    companyName: leadData.companyName,
    niche: leadData.niche,
    address: leadData.address,
    phone: leadData.phone,
    whatsappUrl: leadData.whatsappUrl,
    slug: leadData.slug,
    status: 'pending',
    createdAt: serverTimestamp()
  });

  console.log("✅ Firestore atualizado com sucesso! Unicamente Onward Consultoria está salvo.");
}

run().catch(console.error);
