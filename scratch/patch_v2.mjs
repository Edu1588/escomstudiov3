/**
 * patch_v2.mjs - Corrige:
 * 1. Bug de invisibilidade: Elementos ficam em opacity:0 para sempre
 *    → Solução: CSS garante opacity:1 por padrão, GSAP só anima o slide (y/x)
 *    → Remover gsap.from com opacity, usar set() inicial apenas se JS carregou
 * 2. Seção comercial: Verde → Azul Ciano, remover parcelado
 */

import fs from 'fs';
import path from 'path';

const basePath = 'public';

// CSS shimmer para o botão do PDF — CIANO (#0ea5e9)
const escomStyles = `
        /* === ESCOM Studio: PDF Shimmer Button === */
        .btn-pdf-shimmer {
            position: relative;
            overflow: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            animation: pulse-glow-cyan 2s infinite alternate;
        }
        .btn-pdf-shimmer::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -60%;
            width: 30%;
            height: 200%;
            background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%);
            transform: rotate(30deg);
            animation: shimmer-btn 4.5s infinite ease-in-out;
        }
        @keyframes shimmer-btn {
            0% { left: -60%; }
            25% { left: 140%; }
            100% { left: 140%; }
        }
        @keyframes pulse-glow-cyan {
            0%   { box-shadow: 0 0 5px rgba(14,165,233,0.2); }
            100% { box-shadow: 0 0 28px rgba(14,165,233,0.85); }
        }
        /* Garantia: nenhum elemento animável fica invisível sem JS */
        .will-animate { opacity: 1; }
`;

// Script do GSAP completamente reescrito — seguro contra falhas de timing
const gsapScript = `
<script>
    /* ---- GSAP ScrollTrigger: Modo Seguro ----
       Elementos sempre visíveis no CSS (opacity:1).
       GSAP só faz slide (translateY) — nunca esconde opacity.
       ResizeObserver garante refresh após refluxo do Tailwind CDN.
    */
    window.addEventListener('load', function() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
        gsap.registerPlugin(ScrollTrigger);

        var pairs = [
            { sel: '#hero-content',           y: 40, delay: 0 },
            { sel: '#hero-image',             y: 30, delay: 0.3 },
            { sel: '#dilema-visual',          x: -40 },
            { sel: '#dilema-text',            x:  40 },
            { sel: '#tec-text',               x: -40 },
            { sel: '#tec-visual',             x:  40 },
            { sel: '#jornada-flow',           y:  40 },
            { sel: '#equipe-visual',          x: -40 },
            { sel: '#equipe-text',            x:  40 },
        ];

        var grids = [
            { container: '#pilares-grid',     children: '#pilares-grid > div' },
            { container: '#galeria-grid',     children: '#galeria-grid > div' },
            { container: '#depoimentos-grid', children: '#depoimentos-grid > div' },
            { container: '#faq-accordion',    children: '#faq-accordion > div' },
        ];

        // Animar elementos simples com slide (SEM opacity)
        pairs.forEach(function(p) {
            var el = document.querySelector(p.sel);
            if (!el) return;
            gsap.from(el, {
                scrollTrigger: { trigger: el, start: 'top 95%', once: true },
                x: p.x || 0,
                y: p.y || 0,
                duration: 0.9,
                delay: p.delay || 0,
                ease: 'power2.out'
            });
        });

        // Animar grids com stagger (SEM opacity)
        grids.forEach(function(g) {
            var container = document.querySelector(g.container);
            var children  = document.querySelectorAll(g.children);
            if (!container || !children.length) return;
            gsap.from(children, {
                scrollTrigger: { trigger: container, start: 'top 95%', once: true },
                y: 35,
                stagger: 0.12,
                duration: 0.8,
                ease: 'power2.out'
            });
        });

        // ResizeObserver para recalcular após reflow do Tailwind CDN
        if (window.ResizeObserver) {
            var ro = new ResizeObserver(function() { ScrollTrigger.refresh(); });
            ro.observe(document.body);
        }
        setTimeout(function() { ScrollTrigger.refresh(); }, 300);
        setTimeout(function() { ScrollTrigger.refresh(); }, 1000);
    });
</script>
`;

function generateCommercialSections(company) {
  const isEn = company.isEn;
  const cName = company.display;
  const pdfUrl = company.pdfUrl;
  // Azul ciano padrão ESCOM
  const cyan = '#0ea5e9';

  const dossieHtml = `
<!-- ============================================================ -->
<!-- SEÇÃO DO DOSSIÊ COMERCIAL (PDF/ESTRATÉGIA) -->
<!-- ============================================================ -->
<section id="dossie-comercial" class="py-16 bg-[#111] text-center border-t-2 border-zinc-800">
    <div class="max-w-3xl mx-auto px-6">
        <h3 class="text-[${cyan}] font-mono text-xs font-bold uppercase tracking-widest mb-4">
            <i class="fa-solid fa-lock mr-2"></i> ${isEn ? 'Confidential Document' : 'Documento Confidencial'}
        </h3>
        <h2 class="text-3xl font-bold text-white mb-6">
            ${isEn ? 'Strategic Analysis & Market Dossier' : 'Análise Estratégica & Dossiê de Mercado'}
        </h2>
        <p class="text-zinc-400 mb-8 text-sm">
            ${isEn
              ? 'Restricted access to the conversion architecture study, local market insights, and financial projections for ' + cName + '.'
              : 'Acesso restrito ao estudo de arquitetura de conversão, dados reais de faturamento local e projeção financeira para ' + cName + '.'}
        </p>
        <a href="${pdfUrl}" target="_blank"
           class="btn-pdf-shimmer border-2 border-[${cyan}]/40 hover:border-[${cyan}] text-white font-bold py-4 px-8 rounded-xl transition-all inline-flex items-center gap-3 group">
            <i class="fa-solid fa-file-pdf text-[${cyan}] text-xl group-hover:scale-110 transition-transform"></i>
            ${isEn ? 'Access Strategic Dossier (PDF)' : 'Acessar Dossiê Estratégico (PDF)'}
        </a>
    </div>
</section>
`;

  const propostaHtml = `
<!-- ============================================================ -->
<!-- SEÇÃO COMERCIAL ESCOM STUDIO (PROPOSTA) -->
<!-- ============================================================ -->
<section id="proposta-comercial" class="py-24 bg-[#0a0a0a] relative overflow-hidden text-white border-t-8 border-[${cyan}]">
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-stone-900/20 via-[#0a0a0a] to-[#0a0a0a] pointer-events-none"></div>

    <div class="container mx-auto px-6 max-w-6xl relative z-10">
        <div class="text-center mb-16">
            <span class="bg-[${cyan}]/10 text-[${cyan}] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-[${cyan}]/25 mb-6 inline-block">
                ${isEn ? 'Exclusive ESCOM Studio Proposal' : 'Proposta Exclusiva ESCOM Studio'}
            </span>
            <h2 class="text-4xl md:text-5xl font-display font-extrabold text-white mb-6">
                ${isEn ? 'Project Investment' : 'Investimento do Projeto'}
            </h2>
            <p class="text-zinc-400 max-w-2xl mx-auto text-lg">
                ${isEn
                  ? 'This is the exact financial scope for the implementation of your website, with high-performance design and conversion engineering.'
                  : 'Este é o escopo financeiro exato para a implementação do site da sua empresa, com design de alta performance e engenharia de conversão voltada para captação.'}
            </p>
        </div>

        <!-- Card Principal de Preço -->
        <div class="max-w-2xl mx-auto bg-gradient-to-b from-stone-900/60 to-zinc-900/60 p-10 rounded-3xl border border-stone-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] mb-16 relative backdrop-blur-sm hover:scale-[1.01] transition-transform">
            <div class="absolute top-0 right-0 bg-[${cyan}] text-black text-xs font-bold px-4 py-1 rounded-tr-3xl rounded-bl-xl z-20">
                ${isEn ? 'CURRENT OFFER' : 'OFERTA DE PROSPECÇÃO'}
            </div>

            <h3 class="text-2xl font-bold mb-2">${isEn ? 'High-Conversion Website' : 'Website de Conversão Ativa'}</h3>
            <p class="text-zinc-400 text-sm mb-8 pb-6 border-b border-white/10">
                ${isEn
                  ? 'Custom UI/UX Design, Local SEO, Mobile-First Responsiveness, WhatsApp Integration, Persuasive Copywriting.'
                  : 'Design UI/UX Sob Medida, Otimização de SEO, Responsividade Mobile-First, Integração WhatsApp, Copywriting Persuasivo.'}
            </p>

            <!-- Preço à vista apenas -->
            <div class="flex flex-col items-center justify-center gap-3 mb-8 py-6 bg-stone-950/70 rounded-2xl border border-stone-800">
                <span class="text-zinc-400 text-sm uppercase tracking-widest font-semibold">
                    ${isEn ? 'One-Time Investment' : 'Investimento único'}
                </span>
                <div class="flex items-baseline gap-2">
                    <span class="text-2xl font-bold text-zinc-400">${isEn ? '$' : 'R$'}</span>
                    <span class="text-7xl font-black text-[${cyan}] drop-shadow-[0_0_15px_rgba(14,165,233,0.4)]">990</span>
                </div>
                <span class="bg-[${cyan}]/15 text-[${cyan}] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    PIX / ${isEn ? 'CARD / TRANSFER' : 'CARTÃO / TRANSFERÊNCIA'}
                </span>
            </div>

            <ul class="space-y-4 mb-10 text-sm text-zinc-300">
                <li class="flex items-center gap-3"><i class="fa-solid fa-check-circle text-[${cyan}] text-lg"></i> ${isEn ? 'Domain name registration & hosting setup' : 'Configuração completa de domínio e hospedagem'}</li>
                <li class="flex items-center gap-3"><i class="fa-solid fa-check-circle text-[${cyan}] text-lg"></i> ${isEn ? 'SEO optimization for Google Local Pack' : 'SEO integrado para posicionamento local'}</li>
                <li class="flex items-center gap-3"><i class="fa-solid fa-check-circle text-[${cyan}] text-lg"></i> ${isEn ? 'SSL Security Certificate Integration' : 'Certificado SSL de Conexão Segura'}</li>
                <li class="flex items-center gap-3"><i class="fa-solid fa-check-circle text-[${cyan}] text-lg"></i> ${isEn ? '30 Days of Priority Technical Support' : 'Suporte técnico prioritário de 30 dias'}</li>
                <li class="flex items-center gap-3"><i class="fa-solid fa-check-circle text-[${cyan}] text-lg"></i> ${isEn ? 'Ad-ready creative assets & WhatsApp integration' : 'Criativos de anúncios e integração WhatsApp'}</li>
            </ul>

            <button id="btn-aceitar-proposta"
                class="btn-pdf-shimmer w-full bg-[${cyan}] hover:bg-[#0284c7] text-black text-lg font-black py-5 rounded-2xl transition-all shadow-lg shadow-[${cyan}]/30 flex items-center justify-center gap-3 group">
                ${isEn ? 'ACCEPT PROPOSAL NOW' : 'ACEITAR PROPOSTA AGORA'}
                <i class="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
            </button>
            <p class="text-center text-xs text-zinc-500 mt-4">
                <i class="fa-solid fa-lock text-zinc-600 mr-1"></i>
                ${isEn ? 'Secure contract and invoice sent immediately after acceptance.' : 'Contrato e Nota Fiscal emitidos logo após a aprovação.'}
            </p>
        </div>

        <!-- Cronograma -->
        <div class="max-w-2xl mx-auto bg-stone-900/40 p-6 rounded-2xl border border-stone-800 mb-16 text-center">
            <div class="flex items-center justify-center gap-3 mb-2">
                <i class="fa-solid fa-clock text-[${cyan}] text-2xl"></i>
                <h3 class="text-xl font-bold text-white">${isEn ? 'Delivery Timeline' : 'Cronograma de Entrega'}</h3>
            </div>
            <p class="text-[${cyan}] text-2xl font-black mb-2">${isEn ? '15 Business Days' : '15 Dias Úteis'}</p>
            <p class="text-zinc-500 text-xs leading-relaxed max-w-md mx-auto">
                ${isEn
                  ? 'Swift development, local SEO, WhatsApp integration, and ad-ready assets.'
                  : 'Desenvolvimento ágil, SEO local, integrações de WhatsApp e criativos de anúncios prontos para tráfego.'}
            </p>
        </div>

        <!-- Seção de Serviços Adicionais (Upsells) -->
        <div class="max-w-5xl mx-auto bg-gradient-to-b from-[#1c1917]/40 to-[#0c0a09]/80 p-8 md:p-12 rounded-3xl border border-[${cyan}]/20 shadow-[0_0_50px_rgba(14,165,233,0.05)] relative backdrop-blur-md">
            <div class="absolute -top-4 left-8 bg-[${cyan}] text-black text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                ${isEn ? 'Advanced Expansions' : 'Expansões Tecnológicas'}
            </div>

            <h3 class="text-2xl md:text-3xl font-display font-extrabold text-white mb-4 flex items-center gap-3">
                <i class="fa-solid fa-square-plus text-[${cyan}]"></i>
                ${isEn ? 'Optional Tech Modules' : 'Módulos Avançados sob Demanda'}
            </h3>
            <p class="text-stone-400 mb-10 text-sm max-w-3xl leading-relaxed">
                ${isEn
                  ? 'Take your customer acquisition, operations, and analysis to the next level with advanced modules developed by ESCOM Studio:'
                  : 'Leve a sua captação, operação e análise para o próximo nível com recursos tecnológicos desenvolvidos sob medida pela ESCOM Studio:'}
            </p>

            <div class="grid md:grid-cols-2 gap-6 mb-12">
                ${['crm','dashboard','robot','estoque','processos','ecommerce'].map((mod, i) => {
                  const imgPath = '/template-silva-autocenter/upsell_' + (mod === 'robot' ? 'robot' : mod) + '.png';
                  const labels = {
                    crm:       [isEn ? 'CRM & Client Lead Management' : 'CRM e Controle de Clientes', isEn ? 'Automated scheduling funnels and follow-ups via WhatsApp.' : 'Funil de agendamentos automatizado e acompanhamento via WhatsApp.', 'fa-users', isEn ? 'Retention & Recurrence' : 'Retenção & Recorrência'],
                    dashboard: [isEn ? 'Financial Performance Dashboard' : 'Dashboard Financeiro', isEn ? 'Real-time billing analytics and conversion rates in a visual admin.' : 'Visualização de faturamento e conversão em tempo real.', 'fa-chart-line', isEn ? 'Management & Profit' : 'Gestão & Lucro'],
                    robot:     [isEn ? 'AI Customer Support Agent' : 'Agente de Atendimento IA', isEn ? 'Smart WhatsApp chatbot operating 24/7 for appointments and FAQs.' : 'Robô inteligente integrado ao WhatsApp Business, operando 24h.', 'fa-robot', isEn ? '24/7 Support' : 'Atendimento 24/7'],
                    estoque:   [isEn ? 'Smart Inventory Management' : 'Estoque Digital Inteligente', isEn ? 'Track stock with automated shortage alerts.' : 'Controle de entrada e saída de insumos com alerta de estoque mínimo.', 'fa-boxes-stacked', isEn ? 'Organization' : 'Organização & Agilidade'],
                    processos: [isEn ? 'Business Process Optimization' : 'Otimização de Processos', isEn ? 'Digital mapping of workflows to maximize team output.' : 'Mapeamento e automação de fluxos operacionais para maior produtividade.', 'fa-clock-rotate-left', isEn ? 'Productivity' : 'Produtividade Técnica'],
                    ecommerce: [isEn ? 'E-commerce & Digital Catalog' : 'Loja Digital & Catálogo', isEn ? 'Online store to sell services and products with online payment.' : 'Loja virtual integrada para venda online com pagamento digital.', 'fa-cart-shopping', isEn ? 'New Sales Channels' : 'Canal de Vendas Extra'],
                  };
                  const l = labels[mod];
                  return `
                <div class="group bg-stone-950/80 rounded-2xl border border-stone-800 hover:border-[${cyan}]/50 hover:shadow-[0_0_25px_rgba(14,165,233,0.12)] transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden">
                    <div class="h-44 w-full overflow-hidden relative">
                        <div class="absolute inset-0 bg-gradient-to-t from-stone-950/90 to-transparent z-10"></div>
                        <img src="${imgPath}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="${l[0]}" loading="lazy">
                        <div class="absolute bottom-4 left-5 z-20 w-10 h-10 bg-[${cyan}] rounded-xl flex items-center justify-center text-black text-lg shadow-lg">
                            <i class="fa-solid ${l[2]}"></i>
                        </div>
                    </div>
                    <div class="p-6 flex-1 flex flex-col justify-between">
                        <div>
                            <h4 class="font-bold text-white text-base mb-2">${l[0]}</h4>
                            <p class="text-stone-400 text-xs leading-relaxed">${l[1]}</p>
                        </div>
                        <span class="text-[10px] text-[${cyan}] font-bold uppercase tracking-wider mt-4 pt-4 border-t border-stone-800 block">
                            ${isEn ? 'Focus:' : 'Foco:'} ${l[3]}
                        </span>
                    </div>
                </div>`;
                }).join('')}
            </div>

            <!-- Formulário Upsell -->
            <div class="bg-stone-950/90 p-8 rounded-2xl border border-stone-800">
                <h4 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <i class="fa-solid fa-paper-plane text-[${cyan}]"></i>
                    ${isEn ? 'Request Expansion Details' : 'Solicitar Orçamento das Expansões'}
                </h4>
                <form id="form-upsell" class="space-y-4 text-xs">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="${isEn ? 'Your Name' : 'Seu Nome / Responsável'}" class="w-full bg-stone-900 px-4 py-3 rounded-xl border border-stone-800 focus:outline-none focus:border-[${cyan}] text-white placeholder-stone-600 transition" required>
                        <input type="email" placeholder="${isEn ? 'Corporate Email' : 'E-mail Corporativo'}" class="w-full bg-stone-900 px-4 py-3 rounded-xl border border-stone-800 focus:outline-none focus:border-[${cyan}] text-white placeholder-stone-600 transition" required>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select class="w-full bg-stone-900 px-4 py-3 rounded-xl border border-stone-800 focus:outline-none focus:border-[${cyan}] text-stone-400 transition" required>
                            <option value="" disabled selected>${isEn ? 'Select Module' : 'Selecione o Módulo'}</option>
                            <option>CRM</option>
                            <option>Dashboard</option>
                            <option>WhatsApp Bot</option>
                            <option>${isEn ? 'Smart Inventory' : 'Estoque Digital'}</option>
                            <option>${isEn ? 'Process Optimization' : 'Otimização de Processos'}</option>
                            <option>E-commerce</option>
                        </select>
                        <input type="tel" placeholder="${isEn ? 'WhatsApp Phone' : 'WhatsApp para Contato'}" class="w-full bg-stone-900 px-4 py-3 rounded-xl border border-stone-800 focus:outline-none focus:border-[${cyan}] text-white placeholder-stone-600 transition" required>
                    </div>
                    <button type="submit" class="w-full bg-[${cyan}] hover:bg-[#0284c7] text-black font-bold py-4 rounded-xl transition shadow-lg text-xs uppercase tracking-wider">
                        ${isEn ? 'Submit Request' : 'Enviar Solicitação'}
                    </button>
                </form>
            </div>
        </div>
    </div>
</section>
`;

  return dossieHtml + propostaHtml;
}

function generateControlScripts(cName, isEn) {
  return `
<script>
    // Accept Proposal
    var btnAceitar = document.getElementById('btn-aceitar-proposta');
    if (btnAceitar) {
        btnAceitar.addEventListener('click', function(e) {
            e.preventDefault();
            btnAceitar.textContent = '${isEn ? 'Processing...' : 'Processando...'}';
            btnAceitar.classList.add('opacity-80', 'cursor-wait');
            setTimeout(function() {
                localStorage.setItem('escom_new_lead_conversion', JSON.stringify({ empresa: '${cName}', status: 'pagamento_pendente', valor: 990, data: new Date().toISOString() }));
                btnAceitar.textContent = '${isEn ? 'PROPOSAL ACCEPTED!' : 'PROPOSTA ACEITA!'}';
                btnAceitar.classList.add('cursor-not-allowed');
                alert('${isEn ? 'Thank you! The ESCOM Studio team will contact you shortly.' : 'Obrigado! A equipe ESCOM Studio entrará em contato em breve.'}');
            }, 1500);
        });
    }

    // Navbar scroll
    window.addEventListener('scroll', function() {
        var nav = document.getElementById('navbar');
        if (!nav) return;
        if (window.scrollY > 50) {
            nav.classList.remove('top-10'); nav.classList.add('top-0', 'shadow-md');
        } else {
            nav.classList.remove('top-0', 'shadow-md'); nav.classList.add('top-10');
        }
    });

    // Anti-copy
    document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
    document.addEventListener('copy', function(e) { e.clipboardData.setData('text/plain',''); e.preventDefault(); });
</script>
`;
}

// ===========================
// PROCESSAR CADA TEMPLATE
// ===========================
const companies = [
  { dir: 'template-oralfix',         display: 'Oral Fix - Odontologia Especializada', isEn: false, pdfUrl: 'dossie.pdf' },
  { dir: 'template-chiroandmovement', display: 'Miami Chiropractic & Movement',       isEn: true,  pdfUrl: 'dossie.pdf' },
];

companies.forEach(function(company) {
  const filePath = path.join(basePath, company.dir, 'index.html');
  if (!fs.existsSync(filePath)) { console.error('Não encontrado: ' + filePath); return; }

  console.log('\nProcessando: ' + company.display);
  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Injetar CSS de shimmer
  if (!html.includes('btn-pdf-shimmer')) {
    const si = html.indexOf('</style>');
    if (si !== -1) html = html.substring(0, si) + escomStyles + html.substring(si);
    console.log('  → CSS shimmer injetado.');
  } else {
    // Atualizar CSS existente (remover bloco antigo e reinserir)
    const cssStart = html.indexOf('/* === ESCOM Studio: PDF Shimmer Button ===');
    const cssAltStart = html.indexOf('/* PDF Shimmer Button Animation */');
    const startIdx = cssStart !== -1 ? cssStart : cssAltStart;
    if (startIdx !== -1) {
      const styleEnd = html.indexOf('</style>');
      if (styleEnd > startIdx) {
        // Remover o bloco antigo e reinserir
        const before = html.substring(0, startIdx);
        const after = html.substring(styleEnd);
        html = before + escomStyles + '\n        ' + after;
        console.log('  → CSS shimmer atualizado (azul ciano).');
      }
    }
  }

  // 2. Cortar no fechamento do footer
  const footerClose = '</footer>';
  const fi = html.lastIndexOf(footerClose);
  if (fi === -1) { console.error('  → ERRO: </footer> não encontrado.'); return; }
  const bodyBase = html.substring(0, fi + footerClose.length);

  // 3. Gerar seções comerciais, scripts e GSAP
  const commercial = generateCommercialSections(company);
  const ctrlScripts = generateControlScripts(company.display, company.isEn);

  // 4. Montar o documento final
  const newHtml = bodyBase + '\n' + commercial + '\n' + ctrlScripts + '\n' + gsapScript + '\n</body>\n</html>';
  fs.writeFileSync(filePath, newHtml, 'utf8');
  console.log('  → Sucesso! ' + company.display + ' atualizado.');
});

console.log('\n--- Patch v2 concluído! ---');
