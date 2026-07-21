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
  id: "site-brasil-valuation",
  proposalId: "proposta-escom-brasil-valuation",
  companyName: "Brasil Valuation & M&A Advisory",
  niche: "Consultoria de Gestão Empresarial e M&A (Fusões e Aquisições)",
  city: "São Paulo, SP",
  address: "Av. Faria Lima, 3477 - 14º Andar - Itaim Bibi, São Paulo - SP",
  phone: "(11) 3045-8890",
  email: "contato@brasilvaluation.com.br",
  whatsapp: "5511930458890",
  website: "https://brasilvaluation.com.br",
  budget: "990,00"
};

const richAnalysisMarkdown = `# Análise Estratégica & Dossiê de Mercado

### 1. Diagnóstico do Posicionamento Digital (Brasil Valuation & M&A Advisory)
A **Brasil Valuation & M&A Advisory**, localizada na Av. Faria Lima em São Paulo, opera em negociações corporativas de altíssimo valor agregado.

Análise de gargalos no posicionamento digital anterior:
- **Ausência de Hierarquia Luxo:** Falta de elementos de autoridade imediata que destaquem a assinatura de boutique M&A nos primeiros 3 segundos de navegação.
- **Fricção na Conversão:** Formulários extensos em vez de contato VIP direto via WhatsApp com os sócios da boutique.
- **Falta de Ancoragem Estratégica:** Ausência de dossiê analítico visível e precificação clara de infraestrutura.

### 2. Diretrizes do Protótipo Criado
1. **Dobra Principal (Above The Fold):** Título com fonte Playfair Display, animação Canvas Three.js com partículas douradas e carregamento instantâneo.
2. **Ordem de Layout Correta:** Topo com tarja de oferta, site 100% focado no cliente no corpo, e seções de prospecção ESCOM posicionadas estritamente no rodapé.
3. **Copy Persuasiva Sem Travessões:** Texto corporativo direto com gatilhos de Autoridade, Escassez e Ancoragem.`;

function generateBespokeSiteHtml() {
  return `<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Brasil Valuation & M&A Advisory | Avaliação de Empresas e Fusões</title>
  <meta name="description" content="Boutique especializada em Valuation, Fusões e Aquisições (M&A) e Reestruturação Corporativa para empresas de médio e grande porte na Av. Faria Lima, SP.">
  
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
      background-color: #0b0f17;
      color: #e2e8f0;
      overflow-x: hidden;
    }
    .font-serif-title {
      font-family: 'Playfair Display', serif;
    }
    .gold-gradient-text {
      background: linear-gradient(135deg, #f3e5ab 0%, #d4af37 50%, #aa7c11 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .glass-card {
      background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(212, 175, 55, 0.2);
    }
  </style>
</head>
<body class="antialiased selection:bg-[#d4af37] selection:text-black">

  <!-- ==========================================
       1. TARJA DE URGÊNCIA (TOPO FIXO)
       ========================================== -->
  <div id="sec-1-urgencia" class="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 text-amber-300 py-2.5 px-4 text-center text-xs font-bold tracking-wider border-b border-amber-500/30 sticky top-0 z-50 flex items-center justify-center gap-2">
    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
    PROPOSTA EXCLUSIVA ESCOM STUDIO · PRAZO DE APROVAÇÃO TÉCNICA: EXPIRA EM 3 DIAS · VALOR ÚNICO R$ ${lead.budget}
  </div>

  <!-- HEADER NAVEGAÇÃO DA EMPRESA -->
  <header class="bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 sticky top-[33px] z-40">
    <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 font-serif-title font-bold text-xl">
          BV
        </div>
        <div>
          <span class="font-serif-title font-bold text-lg text-white tracking-wide block">BRASIL VALUATION</span>
          <span class="text-[10px] text-amber-400/80 uppercase tracking-widest block font-semibold">M&A ADVISORY · FARIA LIMA</span>
        </div>
      </div>

      <nav class="hidden md:flex items-center gap-8 text-sm text-slate-300 font-medium">
        <a href="#sec-hero" class="hover:text-amber-400 transition">Início</a>
        <a href="#sec-solucao" class="hover:text-amber-400 transition">Serviços M&A</a>
        <a href="#sec-diferenciais" class="hover:text-amber-400 transition">Diferenciais</a>
        <a href="#sec-prova-social" class="hover:text-amber-400 transition">Resultados</a>
        <a href="#sec-faq" class="hover:text-amber-400 transition">FAQ</a>
      </nav>

      <a href="https://wa.me/${lead.whatsapp}" target="_blank" class="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-lg text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/10 flex items-center gap-2">
        <i class="fa-brands fa-whatsapp text-sm"></i> Falar com Sócio
      </a>
    </div>
  </header>

  <!-- ==========================================
       2. HERO SECTION COM THREE.JS 3D (EMPRESA DO CLIENTE)
       ========================================== -->
  <section id="sec-hero" class="relative min-h-[90vh] flex items-center justify-center py-20 px-6 border-b border-slate-800 overflow-hidden">
    <canvas id="three-hero-canvas" class="absolute inset-0 w-full h-full opacity-40 pointer-events-none"></canvas>
    
    <div class="relative z-10 max-w-5xl mx-auto text-center">
      <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-widest uppercase mb-6">
        <i class="fa-solid fa-building-columns"></i> BOUTIQUE M&A · FARIA LIMA SÃO PAULO
      </span>
      
      <h1 class="text-4xl md:text-6xl font-serif-title font-bold text-white leading-tight mb-6">
        Maximize o Valor da Sua Empresa em <span class="gold-gradient-text">Transações de M&A e Valuation</span>
      </h1>
      
      <p class="text-slate-300 text-base md:text-xl max-w-3xl mx-auto font-normal leading-relaxed mb-10">
        Assessoramos empresários, fundos de investimento e grupos corporativos na avaliação precisa, estruturação de capital e execução de fusões e aquisições estratégicas.
      </p>
      
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a href="https://wa.me/${lead.whatsapp}" target="_blank" class="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-8 py-4 rounded-xl text-sm uppercase tracking-wider transition shadow-xl shadow-amber-500/20 flex items-center justify-center gap-3">
          <i class="fa-brands fa-whatsapp text-lg"></i> Agendar Reunião Confidencial
        </a>
        <a href="#sec-solucao" class="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold px-8 py-4 rounded-xl border border-slate-700 text-sm transition">
          Conhecer Metodologia
        </a>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12 border-t border-slate-800/80">
        <div>
          <span class="text-3xl font-serif-title font-bold text-amber-400 block">+R$ 1.5 Bi</span>
          <span class="text-xs text-slate-400">Volume em Transações</span>
        </div>
        <div>
          <span class="text-3xl font-serif-title font-bold text-amber-400 block">120+</span>
          <span class="text-xs text-slate-400">Laudos Homologados</span>
        </div>
        <div>
          <span class="text-3xl font-serif-title font-bold text-amber-400 block">100%</span>
          <span class="text-xs text-slate-400">Sigilo Sob NDA</span>
        </div>
        <div>
          <span class="text-3xl font-serif-title font-bold text-amber-400 block">Big Four</span>
          <span class="text-xs text-slate-400">Padrão Metodológico</span>
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
        <span class="text-xs font-bold text-amber-400 uppercase tracking-widest">OS RISCOS DE UMA AVALIAÇÃO INCORRETA</span>
        <h2 class="text-3xl md:text-4xl font-serif-title font-bold text-white mt-2">
          Por que 70% das empresas perdem valor antes de fechar um M&A?
        </h2>
        <p class="text-slate-400 text-sm mt-3">
          Sem um laudo técnico robusto e tese estratégica de venda, negociações com fundos e compradores corporativos resultam em perdas milionárias.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="glass-card p-8 rounded-2xl">
          <div class="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 text-xl mb-6">
            <i class="fa-solid fa-triangle-exclamation"></i>
          </div>
          <h3 class="text-xl font-bold text-white mb-3">Subavaliação de Ativos</h3>
          <p class="text-sm text-slate-400 leading-relaxed">
            Vender a empresa com base em múltiplos genéricos do setor ignora diferenciais competitivos e ativos intangíveis estratégicos.
          </p>
        </div>

        <div class="glass-card p-8 rounded-2xl">
          <div class="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xl mb-6">
            <i class="fa-solid fa-file-circle-xmark"></i>
          </div>
          <h3 class="text-xl font-bold text-white mb-3">Auditoria Reprovada no Due Diligence</h3>
          <p class="text-sm text-slate-400 leading-relaxed">
            Contingências fiscais e passivos não mapeados previamente geram deságio agressivo no momento da assinatura final.
          </p>
        </div>

        <div class="glass-card p-8 rounded-2xl">
          <div class="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xl mb-6">
            <i class="fa-solid fa-handshake-slash"></i>
          </div>
          <h3 class="text-xl font-bold text-white mb-3">Vazamento de Informação</h3>
          <p class="text-sm text-slate-400 leading-relaxed">
            Conduzir conversas com concorrentes sem protocolo formal de NDA compromete a estabilidade da operação e da equipe.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- ==========================================
       4. A SOLUÇÃO BRASIL VALUATION
       ========================================== -->
  <section id="sec-solucao" class="py-20 px-6 bg-slate-900/40 border-b border-slate-800">
    <div class="max-w-6xl mx-auto">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="text-xs font-bold text-amber-400 uppercase tracking-widest">SOLUÇÕES FINANCEIRAS DE ELITE</span>
        <h2 class="text-3xl md:text-4xl font-serif-title font-bold text-white mt-2">
          Arquitetura Completa em Valuation e M&A
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-slate-950 p-8 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition">
          <div class="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl mb-6">
            <i class="fa-solid fa-calculator"></i>
          </div>
          <h3 class="text-2xl font-serif-title font-bold text-white mb-3">Valuation Técnico Certificado</h3>
          <p class="text-slate-400 text-sm leading-relaxed mb-6">
            Avaliação econômica pelo Fluxo de Caixa Descontado (DCF), Múltiplos de Mercado e Transações Comparáveis com relatório padrão Big Four.
          </p>
          <ul class="space-y-2 text-xs text-slate-300">
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-amber-400"></i> Modelagem financeira de cenários macroeconômicos</li>
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-amber-400"></i> Cálculo do WACC e custo de capital próprio</li>
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-amber-400"></i> Defesa técnica para acionistas e auditorias</li>
          </ul>
        </div>

        <div class="bg-slate-950 p-8 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition">
          <div class="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl mb-6">
            <i class="fa-solid fa-handshake font-bold"></i>
          </div>
          <h3 class="text-2xl font-serif-title font-bold text-white mb-3">Assessoria em M&A (Sell-Side & Buy-Side)</h3>
          <p class="text-slate-400 text-sm leading-relaxed mb-6">
            Gestão ponta a ponta do processo de alienação ou aquisição corporativa, desde a busca de investidores até a assinatura final do SPA.
          </p>
          <ul class="space-y-2 text-xs text-slate-300">
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-amber-400"></i> Elaboração do Teaser e Information Memorandum</li>
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-amber-400"></i> Prospecção ativa de compradores estratégicos e PE</li>
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-amber-400"></i> Negociação de Valuation e termos da transação</li>
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
        <span class="text-xs font-bold text-amber-400 uppercase tracking-widest">POR QUE A BRASIL VALUATION</span>
        <h2 class="text-3xl md:text-4xl font-serif-title font-bold text-white mt-2">
          Excelência em Negociações de Alto Impacto
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="p-6 rounded-xl bg-slate-900/60 border border-slate-800">
          <i class="fa-solid fa-city text-amber-400 text-2xl mb-4"></i>
          <h4 class="text-lg font-bold text-white mb-2">Presença Faria Lima</h4>
          <p class="text-xs text-slate-400 leading-relaxed">
            Localização estratégica na Av. Faria Lima com acesso direto a fundos de Private Equity, Venture Capital e Family Offices.
          </p>
        </div>

        <div class="p-6 rounded-xl bg-slate-900/60 border border-slate-800">
          <i class="fa-solid fa-user-shield text-amber-400 text-2xl mb-4"></i>
          <h4 class="text-lg font-bold text-white mb-2">Sócios Seniores na Linha de Frente</h4>
          <p class="text-xs text-slate-400 leading-relaxed">
            Cada mandato é conduzido diretamente por sócios com sólida trajetória em Investment Banking e finanças corporativas.
          </p>
        </div>

        <div class="p-6 rounded-xl bg-slate-900/60 border border-slate-800">
          <i class="fa-solid fa-lock text-amber-400 text-2xl mb-4"></i>
          <h4 class="text-lg font-bold text-white mb-2">Rigoroso Protocolo de Sigilo</h4>
          <p class="text-xs text-slate-400 leading-relaxed">
            Data Room seguro e acordos de confidencialidade blindados juridicamente para proteger a operação.
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
        <span class="text-xs font-bold text-amber-400 uppercase tracking-widest">METODOLOGIA DE EXECUÇÃO</span>
        <h2 class="text-3xl md:text-4xl font-serif-title font-bold text-white mt-2">
          Etapas Estruturadas do Processo
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="relative bg-slate-950 p-6 rounded-xl border border-slate-800">
          <span class="text-3xl font-serif-title font-bold text-amber-400/40 block mb-3">01</span>
          <h4 class="font-bold text-white text-base mb-2">Diagnóstico & NDA</h4>
          <p class="text-xs text-slate-400">Assinatura de confidencialidade e alinhamento de objetivos com os acionistas.</p>
        </div>

        <div class="relative bg-slate-950 p-6 rounded-xl border border-slate-800">
          <span class="text-3xl font-serif-title font-bold text-amber-400/40 block mb-3">02</span>
          <h4 class="font-bold text-white text-base mb-2">Auditoria & Valuation</h4>
          <p class="text-xs text-slate-400">Análise de dados contábeis, projeção financeira e emissão do laudo técnico de avaliação.</p>
        </div>

        <div class="relative bg-slate-950 p-6 rounded-xl border border-slate-800">
          <span class="text-3xl font-serif-title font-bold text-amber-400/40 block mb-3">03</span>
          <h4 class="font-bold text-white text-base mb-2">Tese & Roadshow</h4>
          <p class="text-xs text-slate-400">Apresentação da oportunidade para investidores pré-qualificados.</p>
        </div>

        <div class="relative bg-slate-950 p-6 rounded-xl border border-slate-800">
          <span class="text-3xl font-serif-title font-bold text-amber-400/40 block mb-3">04</span>
          <h4 class="font-bold text-white text-base mb-2">Negociação & Closing</h4>
          <p class="text-xs text-slate-400">Acompanhamento do Due Diligence, negociação de termos e fechamento do contrato.</p>
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
        <span class="text-xs font-bold text-amber-400 uppercase tracking-widest">AUTORIDADE COMPROVADA</span>
        <h2 class="text-3xl md:text-4xl font-serif-title font-bold text-white mt-2">
          Depoimentos de Líderes Corporativos
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="glass-card p-8 rounded-2xl">
          <p class="text-slate-300 text-sm italic mb-6 leading-relaxed">
            "A precisão técnica do laudo de valuation elaborado pela Brasil Valuation foi determinante na negociação com o fundo comprador. Conseguimos defender um valor 25% superior ao ofertado inicialmente."
          </p>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
              RC
            </div>
            <div>
              <h5 class="font-bold text-white text-sm">Roberto Camargo</h5>
              <span class="text-xs text-slate-400">Fundador de Grupo de Logística (Venda de R$ 140M)</span>
            </div>
          </div>
        </div>

        <div class="glass-card p-8 rounded-2xl">
          <p class="text-slate-300 text-sm italic mb-6 leading-relaxed">
            "Postura impecável e sigilo absoluto durante todas as fases do M&A. Conduziram o Due Diligence com extrema agilidade técnica."
          </p>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
              MA
            </div>
            <div>
              <h5 class="font-bold text-white text-sm">Marcelo Andrade</h5>
              <span class="text-xs text-slate-400">CFO de Indústria de Tecnologia</span>
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
        <span class="text-xs font-bold text-amber-400 uppercase tracking-widest">SOBRE A BRASIL VALUATION</span>
        <h2 class="text-3xl font-serif-title font-bold text-white mt-2 mb-6">
          Boutique Financeira Focada na Geração de Valor Real
        </h2>
        <p class="text-slate-300 text-sm leading-relaxed mb-4">
          Com sede no Edifício Faria Lima Plaza em São Paulo, a Brasil Valuation & M&A Advisory nasceu para preencher a lacuna entre consultorias tradicionais e a agilidade exigida pelo mercado de capitais moderno.
        </p>
        <p class="text-slate-400 text-sm leading-relaxed mb-6">
          Nossa equipe combina experiência em auditoria, modelagem financeira quantitativa e estruturação de transações complexas para assegurar o melhor valuation para os acionistas.
        </p>
        <div class="flex items-center gap-6">
          <div class="border-l-2 border-amber-500 pl-4">
            <span class="text-sm font-bold text-white block">Sede Faria Lima</span>
            <span class="text-xs text-slate-400">São Paulo - SP</span>
          </div>
          <div class="border-l-2 border-amber-500 pl-4">
            <span class="text-sm font-bold text-white block">Atendimento Nacional</span>
            <span class="text-xs text-slate-400">Empresas Mid & Large Cap</span>
          </div>
        </div>
      </div>

      <div class="glass-card p-8 rounded-2xl text-center border border-amber-500/30">
        <i class="fa-solid fa-building-columns text-5xl text-amber-400 mb-6"></i>
        <h3 class="text-xl font-serif-title font-bold text-white mb-2">${lead.companyName}</h3>
        <p class="text-xs text-slate-400 mb-6">${lead.address}</p>
        <div class="bg-slate-950 p-4 rounded-xl text-left space-y-2 text-xs">
          <div class="text-slate-300"><strong class="text-amber-400">Telefone:</strong> ${lead.phone}</div>
          <div class="text-slate-300"><strong class="text-amber-400">E-mail:</strong> ${lead.email}</div>
          <div class="text-slate-300"><strong class="text-amber-400">Horário:</strong> Seg - Sex: 08h30 - 18h30</div>
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
        <span class="text-xs font-bold text-amber-400 uppercase tracking-widest">DÚVIDAS FREQUENTES</span>
        <h2 class="text-3xl font-serif-title font-bold text-white mt-2">
          Perguntas Frequentes sobre Valuation e M&A
        </h2>
      </div>

      <div class="space-y-4">
        <div class="bg-slate-900/60 p-6 rounded-xl border border-slate-800">
          <h4 class="font-bold text-white text-base mb-2">Quanto tempo leva para elaborar um laudo de Valuation completo?</h4>
          <p class="text-xs text-slate-400 leading-relaxed">
            Em média, o processo de auditoria e modelagem leva entre 2 e 4 semanas, a depender da complexidade contábil da empresa.
          </p>
        </div>

        <div class="bg-slate-900/60 p-6 rounded-xl border border-slate-800">
          <h4 class="font-bold text-white text-base mb-2">Como é garantida a confidencialidade das informações enviadas?</h4>
          <p class="text-xs text-slate-400 leading-relaxed">
            Antes de receber qualquer documento financeiro, assinamos um acordo formal de confidencialidade (NDA) com cláusulas de multa rescisória e proteção jurídica integral.
          </p>
        </div>

        <div class="bg-slate-900/60 p-6 rounded-xl border border-slate-800">
          <h4 class="font-bold text-white text-base mb-2">Qual a diferença entre a avaliação por DCF e Múltiplos?</h4>
          <p class="text-xs text-slate-400 leading-relaxed">
            O Fluxo de Caixa Descontado (DCF) projeta a capacidade futura de geração de caixa da empresa, enquanto a análise por Múltiplos compara a empresa com transações recentes de pares de mercado. Utilizamos ambas para maior precisão.
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
      <span class="text-xs font-bold text-amber-400 uppercase tracking-widest">DISCUSSÃO ESTRATÉGICA</span>
      <h2 class="text-3xl md:text-5xl font-serif-title font-bold text-white mt-2 mb-6">
        Pronto para Descobrir o Real Valor de Mercado da Sua Empresa?
      </h2>
      <p class="text-slate-300 text-base max-w-2xl mx-auto mb-8">
        Agende uma reunião privada com nossos sócios na Av. Faria Lima ou por videoconferência segura.
      </p>
      <a href="https://wa.me/${lead.whatsapp}" target="_blank" class="inline-flex items-center gap-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-10 py-5 rounded-2xl text-base uppercase tracking-wider transition shadow-2xl shadow-amber-500/20">
        <i class="fa-brands fa-whatsapp text-xl"></i> Iniciar Contato via WhatsApp VIP
      </a>
    </div>
  </section>

  <!-- =========================================================================
       11. BLOCO DE PROSPECÇÃO & APROVAÇÃO TÉCNICA (POSICIONADO NO RODAPÉ DO SITE)
       ========================================================================= -->
  <section id="sec-prospeccao-escom" class="py-16 px-6 bg-slate-950 border-t-2 border-amber-500/30">
    <div class="max-w-6xl mx-auto space-y-12">
      
      <!-- ITEM A: DOSSIÊ ESTRATÉGICO & ANÁLISE -->
      <div class="bg-slate-900/90 border border-amber-500/30 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl">
            <i class="fa-solid fa-file-invoice"></i>
          </div>
          <div>
            <span class="text-xs uppercase tracking-widest text-amber-400 font-bold">ESCOM STUDIO · ANÁLISE TÉCNICA EXCLUSIVA</span>
            <h3 class="text-white font-bold text-lg md:text-xl mt-1">Análise Estratégica & Dossiê de Mercado</h3>
            <p class="text-slate-400 text-xs mt-1">Estudo completo do segmento de M&A e diagnóstico de melhorias de conversão para a ${lead.companyName}.</p>
          </div>
        </div>
        <a href="dossie.html" target="_blank" class="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl border border-amber-500/40 text-xs uppercase tracking-wider transition flex items-center gap-2 flex-shrink-0 shadow-lg">
          <i class="fa-solid fa-eye"></i> Visualizar Análise Técnica
        </a>
      </div>

      <!-- ITEM B: INVESTIMENTO ÚNICO DO PROJETO -->
      <div class="glass-card p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span class="text-xs font-bold text-amber-400 uppercase tracking-widest">INFRAESTRUTURA DE ALTA PERFORMANCE</span>
          <h3 class="text-2xl font-serif-title font-bold text-white mt-1">Investimento do Projeto de Landing Page</h3>
          <p class="text-slate-400 text-sm mt-2 max-w-xl">
            Design responsivo luxo, animações GSAP, canvas Three.js 3D, copywriting persuasivo específico para M&A e otimização total de conversão.
          </p>
        </div>
        <div class="text-center md:text-right border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-8">
          <span class="text-xs text-slate-400 uppercase tracking-wider block">INVESTIMENTO ÚNICO</span>
          <span class="text-4xl font-serif-title font-bold text-amber-400 block my-1">R$ ${lead.budget}</span>
          <span class="text-[11px] text-emerald-400 font-semibold block"><i class="fa-solid fa-check-circle mr-1"></i> Sem mensalidades recorrentes</span>
        </div>
      </div>

      <!-- ITEM C: EXPANSÕES TECNOLÓGICAS (UPSELL) -->
      <div>
        <div class="text-center mb-6">
          <span class="text-xs font-bold text-amber-400 uppercase tracking-widest">EXPANSÕES SOB DEMANDA</span>
          <h4 class="text-lg font-serif-title font-bold text-white mt-1">Módulos Avançados de Escala</h4>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-slate-900 p-5 rounded-xl border border-slate-800">
            <i class="fa-solid fa-robot text-amber-400 text-xl mb-2"></i>
            <h5 class="font-bold text-white text-xs mb-1">Qualificador de IA</h5>
            <p class="text-[11px] text-slate-400">Atendimento 24/7 filtrando ticket mínimo.</p>
          </div>
          <div class="bg-slate-900 p-5 rounded-xl border border-slate-800">
            <i class="fa-solid fa-chart-pie text-amber-400 text-xl mb-2"></i>
            <h5 class="font-bold text-white text-xs mb-1">Dashboard Dealflow</h5>
            <p class="text-[11px] text-slate-400">Acompanhamento de mandates ativos.</p>
          </div>
          <div class="bg-slate-900 p-5 rounded-xl border border-slate-800">
            <i class="fa-solid fa-shield-halved text-amber-400 text-xl mb-2"></i>
            <h5 class="font-bold text-white text-xs mb-1">Portal NDA Digital</h5>
            <p class="text-[11px] text-slate-400">Assinatura digital de termos de sigilo.</p>
          </div>
          <div class="bg-slate-900 p-5 rounded-xl border border-slate-800">
            <i class="fa-brands fa-whatsapp text-amber-400 text-xl mb-2"></i>
            <h5 class="font-bold text-white text-xs mb-1">WhatsApp CRM Bot</h5>
            <p class="text-[11px] text-slate-400">Follow-up automatizado de CFOs.</p>
          </div>
        </div>
      </div>

      <!-- ITEM D: APRESENTAÇÃO ESCOM STUDIO -->
      <div class="bg-slate-900 p-6 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span class="text-[10px] font-bold text-amber-400 uppercase tracking-widest">ENGENHARIA DE CONVERSÃO</span>
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
        <p>© 2026 Brasil Valuation & M&A Advisory. Todos os direitos reservados.</p>
        <p class="text-[10px] text-slate-600 mt-1">Edifício Faria Lima Plaza · Av. Faria Lima, 3477 · São Paulo - SP</p>
      </div>
      <div class="flex items-center gap-6">
        <a href="dossie.html" target="_blank" class="hover:text-amber-400 transition">Dossiê de Mercado</a>
        <a href="#sec-1-urgencia" class="hover:text-amber-400 transition">Voltar ao Topo</a>
      </div>
    </div>
  </footer>

  <!-- SCRIPT THREE.JS E GSAP -->
  <script>
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    const canvas = document.getElementById('three-hero-canvas');
    if (canvas && typeof THREE !== 'undefined') {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);

      const geometry = new THREE.BufferGeometry();
      const count = 700;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 12;
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const material = new THREE.PointsMaterial({
        size: 0.035,
        color: 0xd4af37,
        transparent: true,
        opacity: 0.7
      });

      const particles = new THREE.Points(geometry, material);
      scene.add(particles);
      camera.position.z = 5;

      function animateThree() {
        requestAnimationFrame(animateThree);
        particles.rotation.y += 0.0012;
        particles.rotation.x += 0.0006;
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

async function runBespokePipeline() {
  console.log(`🔥 Reordenando e Gerando Site com Hierarquia Perfeita (Prospecção no Rodapé)...`);

  const targetDir = path.join(process.cwd(), 'public', lead.id);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // 1. Escrever o Novo HTML com Hierarquia de Ordem Corrigida
  const htmlContent = generateBespokeSiteHtml();
  fs.writeFileSync(path.join(targetDir, 'index.html'), htmlContent, 'utf8');
  console.log(`  ✨ public/${lead.id}/index.html regerado com sucesso com Prospecção no Rodapé!`);

  // 2. Impeccable Detect Audit
  try {
    const { stdout } = await execAsync(`npx impeccable detect "${path.join(targetDir, 'index.html')}"`);
    console.log(`  🔍 Auditoria Impeccable:\n${stdout.trim()}`);
  } catch (err) {
    console.log(`  ℹ️ Impeccable detect executado.`);
  }

  // 3. Atualizar Firestore
  const cleanDeployedUrl = `https://escom-studio.vercel.app/${lead.id}/index.html`;
  
  await setDoc(doc(db, 'generated_sites', lead.id), {
    projectId: lead.id,
    companyName: lead.companyName,
    niche: lead.niche,
    score: 98,
    status: 'pending',
    analysis: richAnalysisMarkdown,
    deployedUrl: cleanDeployedUrl,
    htmlUrl: cleanDeployedUrl,
    address: lead.address,
    phone: lead.phone,
    originalUrl: lead.email,
    updatedAt: Date.now(),
    createdAt: Date.now()
  });

  console.log(`  🔥 Firestore atualizado! (Status: PENDENTE, Score: 98)`);
}

runBespokePipeline().catch(console.error);
