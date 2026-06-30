/**
 * patch_v3.mjs - Corrige:
 * 1. Bug de invisibilidade (GSAP sem opacity:0).
 * 2. Seção comercial dinamicamente adaptada à IDENTIDADE VISUAL de cada página.
 */

import fs from 'fs';
import path from 'path';

const basePath = 'public';

// Script do GSAP (Seguro contra falhas de timing - Sem opacity:0)
const gsapScript = `
<script>
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
  const t = company.theme;
  const isEn = company.isEn;
  const cName = company.display;
  const pdfUrl = company.pdfUrl;

  const dossieHtml = `
<!-- ============================================================ -->
<!-- SEÇÃO DO DOSSIÊ COMERCIAL (PDF/ESTRATÉGIA) -->
<!-- ============================================================ -->
<section id="dossie-comercial" class="py-16 ${t.bgDark} ${t.textWhite} border-t-2 ${t.borderLight}">
    <div class="max-w-3xl mx-auto px-6 text-center">
        <h3 class="${t.textAccent} font-mono text-xs font-bold uppercase tracking-widest mb-4">
            <i class="fa-solid fa-lock mr-2"></i> ${isEn ? 'Confidential Document' : 'Documento Confidencial'}
        </h3>
        <h2 class="text-3xl font-bold mb-6">
            ${isEn ? 'Strategic Analysis & Market Dossier' : 'Análise Estratégica & Dossiê de Mercado'}
        </h2>
        <p class="${t.textMuted} mb-8 text-sm">
            ${isEn
              ? 'Restricted access to the conversion architecture study, local market insights, and financial projections for ' + cName + '.'
              : 'Acesso restrito ao estudo de arquitetura de conversão, dados reais de faturamento local e projeção financeira para ' + cName + '.'}
        </p>
        <a href="${pdfUrl}" target="_blank"
           class="btn-pdf-shimmer border-2 ${t.borderAccentBase} hover:${t.borderAccentHover} ${t.textWhite} font-bold py-4 px-8 rounded-xl transition-all inline-flex items-center gap-3 group">
            <i class="fa-solid fa-file-pdf ${t.textAccent} text-xl group-hover:scale-110 transition-transform"></i>
            ${isEn ? 'Access Strategic Dossier (PDF)' : 'Acessar Dossiê Estratégico (PDF)'}
        </a>
    </div>
</section>
`;

  const propostaHtml = `
<!-- ============================================================ -->
<!-- SEÇÃO COMERCIAL ESCOM STUDIO (PROPOSTA) -->
<!-- ============================================================ -->
<section id="proposta-comercial" class="py-24 ${t.bgBase} relative overflow-hidden ${t.textBase} border-t-8 ${t.borderTopBase}">
    ${t.bgOverlay ? `<div class="absolute inset-0 ${t.bgOverlay} pointer-events-none"></div>` : ''}

    <div class="container mx-auto px-6 max-w-6xl relative z-10">
        <div class="text-center mb-16">
            <span class="${t.badgeBg} ${t.textAccent} px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${t.badgeBorder} mb-6 inline-block">
                ${isEn ? 'Exclusive ESCOM Studio Proposal' : 'Proposta Exclusiva ESCOM Studio'}
            </span>
            <h2 class="text-4xl md:text-5xl font-display font-extrabold ${t.textTitle} mb-6">
                ${isEn ? 'Project Investment' : 'Investimento do Projeto'}
            </h2>
            <p class="${t.textMuted} max-w-2xl mx-auto text-lg">
                ${isEn
                  ? 'This is the exact financial scope for the implementation of your website, with high-performance design and conversion engineering.'
                  : 'Este é o escopo financeiro exato para a implementação do site da sua empresa, com design de alta performance e engenharia de conversão voltada para captação.'}
            </p>
        </div>

        <!-- Card Principal de Preço -->
        <div class="max-w-2xl mx-auto ${t.cardMainBg} p-10 rounded-3xl border ${t.cardBorder} ${t.cardShadow} mb-16 relative hover:scale-[1.01] transition-transform backdrop-blur-sm">
            <div class="absolute top-0 right-0 ${t.accentBg} ${t.accentText} text-xs font-bold px-4 py-1 rounded-tr-3xl rounded-bl-xl z-20">
                ${isEn ? 'CURRENT OFFER' : 'OFERTA DE PROSPECÇÃO'}
            </div>

            <h3 class="text-2xl font-bold mb-2 ${t.textTitle}">${isEn ? 'High-Conversion Website' : 'Website de Conversão Ativa'}</h3>
            <p class="${t.textMuted} text-sm mb-8 pb-6 border-b ${t.dividerColor}">
                ${isEn
                  ? 'Custom UI/UX Design, Local SEO, Mobile-First Responsiveness, WhatsApp Integration, Persuasive Copywriting.'
                  : 'Design UI/UX Sob Medida, Otimização de SEO, Responsividade Mobile-First, Integração WhatsApp, Copywriting Persuasivo.'}
            </p>

            <!-- Preço à vista apenas -->
            <div class="flex flex-col items-center justify-center gap-3 mb-8 py-6 ${t.priceBg} rounded-2xl border ${t.cardBorder}">
                <span class="${t.textMuted} text-sm uppercase tracking-widest font-semibold">
                    ${isEn ? 'One-Time Investment' : 'Investimento único'}
                </span>
                <div class="flex items-baseline gap-2">
                    <span class="text-2xl font-bold ${t.textMuted}">${isEn ? '$' : 'R$'}</span>
                    <span class="text-7xl font-black ${t.textAccent} ${t.priceShadow}">990</span>
                </div>
                <span class="${t.badgeBg} ${t.textAccent} text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    PIX / ${isEn ? 'CARD / TRANSFER' : 'CARTÃO / TRANSFERÊNCIA'}
                </span>
            </div>

            <ul class="space-y-4 mb-10 text-sm ${t.textList}">
                <li class="flex items-center gap-3"><i class="fa-solid fa-check-circle ${t.textAccent} text-lg"></i> ${isEn ? 'Domain name registration & hosting setup' : 'Configuração completa de domínio e hospedagem'}</li>
                <li class="flex items-center gap-3"><i class="fa-solid fa-check-circle ${t.textAccent} text-lg"></i> ${isEn ? 'SEO optimization for Google Local Pack' : 'SEO integrado para posicionamento local'}</li>
                <li class="flex items-center gap-3"><i class="fa-solid fa-check-circle ${t.textAccent} text-lg"></i> ${isEn ? 'SSL Security Certificate Integration' : 'Certificado SSL de Conexão Segura'}</li>
                <li class="flex items-center gap-3"><i class="fa-solid fa-check-circle ${t.textAccent} text-lg"></i> ${isEn ? '30 Days of Priority Technical Support' : 'Suporte técnico prioritário de 30 dias'}</li>
                <li class="flex items-center gap-3"><i class="fa-solid fa-check-circle ${t.textAccent} text-lg"></i> ${isEn ? 'Ad-ready creative assets & WhatsApp integration' : 'Criativos de anúncios e integração WhatsApp'}</li>
            </ul>

            <button id="btn-aceitar-proposta"
                class="btn-pdf-shimmer w-full ${t.accentBg} hover:${t.accentBgHover} ${t.accentText} text-lg font-black py-5 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-3 group">
                ${isEn ? 'ACCEPT PROPOSAL NOW' : 'ACEITAR PROPOSTA AGORA'}
                <i class="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
            </button>
            <p class="text-center text-xs ${t.textMuted} mt-4">
                <i class="fa-solid fa-lock mr-1"></i>
                ${isEn ? 'Secure contract and invoice sent immediately after acceptance.' : 'Contrato e Nota Fiscal emitidos logo após a aprovação.'}
            </p>
        </div>

        <!-- Cronograma -->
        <div class="max-w-2xl mx-auto ${t.scheduleBg} p-6 rounded-2xl border ${t.cardBorder} mb-16 text-center">
            <div class="flex items-center justify-center gap-3 mb-2">
                <i class="fa-solid fa-clock ${t.textAccent} text-2xl"></i>
                <h3 class="text-xl font-bold ${t.textTitle}">${isEn ? 'Delivery Timeline' : 'Cronograma de Entrega'}</h3>
            </div>
            <p class="${t.textAccent} text-2xl font-black mb-2">${isEn ? '15 Business Days' : '15 Dias Úteis'}</p>
            <p class="${t.textMuted} text-xs leading-relaxed max-w-md mx-auto">
                ${isEn
                  ? 'Swift development, local SEO, WhatsApp integration, and ad-ready assets.'
                  : 'Desenvolvimento ágil, SEO local, integrações de WhatsApp e criativos de anúncios prontos para tráfego.'}
            </p>
        </div>

        <!-- Seção de Serviços Adicionais (Upsells) -->
        <div class="max-w-5xl mx-auto ${t.upsellContainerBg} p-8 md:p-12 rounded-3xl border ${t.upsellBorder} ${t.upsellShadow} relative backdrop-blur-md">
            <div class="absolute -top-4 left-8 ${t.accentBg} ${t.accentText} text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                ${isEn ? 'Advanced Expansions' : 'Expansões Tecnológicas'}
            </div>

            <h3 class="text-2xl md:text-3xl font-display font-extrabold ${t.textTitle} mb-4 flex items-center gap-3">
                <i class="fa-solid fa-square-plus ${t.textAccent}"></i>
                ${isEn ? 'Optional Tech Modules' : 'Módulos Avançados sob Demanda'}
            </h3>
            <p class="${t.textMuted} mb-10 text-sm max-w-3xl leading-relaxed">
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
                <div class="group ${t.upsellCardBg} rounded-2xl border ${t.cardBorder} hover:${t.cardBorderHover} hover:${t.upsellCardShadow} transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden">
                    <div class="h-44 w-full overflow-hidden relative">
                        <div class="absolute inset-0 bg-gradient-to-t ${t.imgGradient} z-10"></div>
                        <img src="${imgPath}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="${l[0]}" loading="lazy">
                        <div class="absolute bottom-4 left-5 z-20 w-10 h-10 ${t.accentBg} rounded-xl flex items-center justify-center ${t.accentText} text-lg shadow-lg">
                            <i class="fa-solid ${l[2]}"></i>
                        </div>
                    </div>
                    <div class="p-6 flex-1 flex flex-col justify-between">
                        <div>
                            <h4 class="font-bold ${t.textTitle} text-base mb-2">${l[0]}</h4>
                            <p class="${t.textMuted} text-xs leading-relaxed">${l[1]}</p>
                        </div>
                        <span class="text-[10px] ${t.textAccent} font-bold uppercase tracking-wider mt-4 pt-4 border-t ${t.dividerColor} block">
                            ${isEn ? 'Focus:' : 'Foco:'} ${l[3]}
                        </span>
                    </div>
                </div>`;
                }).join('')}
            </div>

            <!-- Formulário Upsell -->
            <div class="${t.formBg} p-8 rounded-2xl border ${t.cardBorder}">
                <h4 class="text-lg font-bold ${t.textTitle} mb-4 flex items-center gap-2">
                    <i class="fa-solid fa-paper-plane ${t.textAccent}"></i>
                    ${isEn ? 'Request Expansion Details' : 'Solicitar Orçamento das Expansões'}
                </h4>
                <form id="form-upsell" class="space-y-4 text-xs">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="${isEn ? 'Your Name' : 'Seu Nome / Responsável'}" class="w-full ${t.inputBg} px-4 py-3 rounded-xl border ${t.cardBorder} focus:outline-none focus:${t.borderAccentHover} ${t.textTitle} placeholder-opacity-50 transition" required>
                        <input type="email" placeholder="${isEn ? 'Corporate Email' : 'E-mail Corporativo'}" class="w-full ${t.inputBg} px-4 py-3 rounded-xl border ${t.cardBorder} focus:outline-none focus:${t.borderAccentHover} ${t.textTitle} placeholder-opacity-50 transition" required>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select class="w-full ${t.inputBg} px-4 py-3 rounded-xl border ${t.cardBorder} focus:outline-none focus:${t.borderAccentHover} ${t.textMuted} transition" required>
                            <option value="" disabled selected>${isEn ? 'Select Module' : 'Selecione o Módulo'}</option>
                            <option>CRM</option>
                            <option>Dashboard</option>
                            <option>WhatsApp Bot</option>
                            <option>${isEn ? 'Smart Inventory' : 'Estoque Digital'}</option>
                            <option>${isEn ? 'Process Optimization' : 'Otimização de Processos'}</option>
                            <option>E-commerce</option>
                        </select>
                        <input type="tel" placeholder="${isEn ? 'WhatsApp Phone' : 'WhatsApp para Contato'}" class="w-full ${t.inputBg} px-4 py-3 rounded-xl border ${t.cardBorder} focus:outline-none focus:${t.borderAccentHover} ${t.textTitle} placeholder-opacity-50 transition" required>
                    </div>
                    <button type="submit" class="w-full ${t.accentBg} hover:${t.accentBgHover} ${t.accentText} font-bold py-4 rounded-xl transition shadow-lg text-xs uppercase tracking-wider">
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

    document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
    document.addEventListener('copy', function(e) { e.clipboardData.setData('text/plain',''); e.preventDefault(); });
</script>
`;
}

// Configurações e Temas
const companies = [
  { 
      dir: 'template-oralfix',         
      display: 'Oral Fix - Odontologia Especializada', 
      isEn: false, 
      pdfUrl: 'dossie.pdf',
      theme: {
          // Identidade Light / Azul e Dourado (Oralfix)
          bgDark: 'bg-primary',
          bgBase: 'bg-bgWarm',
          bgOverlay: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/60 via-transparent to-transparent',
          textBase: 'text-charcoal',
          textTitle: 'text-primary',
          textWhite: 'text-white',
          textMuted: 'text-charcoal/70',
          textList: 'text-charcoal/80',
          textAccent: 'text-primary',
          
          borderLight: 'border-white/10',
          borderTopBase: 'border-primary',
          borderAccentBase: 'border-primary/40',
          borderAccentHover: 'border-primary',
          
          badgeBg: 'bg-primary/10',
          badgeBorder: 'border-primary/25',
          
          cardMainBg: 'bg-white',
          cardBorder: 'border-charcoal/10',
          cardBorderHover: 'border-primary/30',
          cardShadow: 'shadow-[0_20px_40px_-15px_rgba(12,74,110,0.1)]',
          
          accentBg: 'bg-primary',
          accentBgHover: 'bg-[#0a3a57]',
          accentText: 'text-white',
          
          dividerColor: 'border-charcoal/10',
          priceBg: 'bg-bgContrast/50',
          priceShadow: '',
          
          scheduleBg: 'bg-white',
          
          upsellContainerBg: 'bg-white',
          upsellBorder: 'border-primary/20',
          upsellShadow: 'shadow-[0_20px_40px_-15px_rgba(12,74,110,0.05)]',
          
          upsellCardBg: 'bg-bgWarm/80',
          upsellCardShadow: 'shadow-[0_10px_25px_rgba(12,74,110,0.1)]',
          imgGradient: 'from-bgWarm/90 to-transparent',
          
          formBg: 'bg-bgWarm',
          inputBg: 'bg-white'
      }
  },
  { 
      dir: 'template-chiroandmovement', 
      display: 'Miami Chiropractic & Movement',       
      isEn: true,  
      pdfUrl: 'dossie.pdf',
      theme: {
          // Identidade Dark / Verde Emerald (Chiro)
          bgDark: 'bg-[#050806]',
          bgBase: 'bg-[#080c0a]',
          bgOverlay: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent',
          textBase: 'text-white',
          textTitle: 'text-white',
          textWhite: 'text-white',
          textMuted: 'text-gray-400',
          textList: 'text-gray-300',
          textAccent: 'text-primary',
          
          borderLight: 'border-white/5',
          borderTopBase: 'border-primary',
          borderAccentBase: 'border-primary/40',
          borderAccentHover: 'border-primary',
          
          badgeBg: 'bg-primary/10',
          badgeBorder: 'border-primary/25',
          
          cardMainBg: 'bg-gradient-to-b from-[#0f1612] to-[#080c0a]',
          cardBorder: 'border-white/5',
          cardBorderHover: 'border-primary/50',
          cardShadow: 'shadow-[0_0_50px_rgba(16,185,129,0.1)]',
          
          accentBg: 'bg-primary',
          accentBgHover: 'bg-[#059669]',
          accentText: 'text-[#050806]',
          
          dividerColor: 'border-white/10',
          priceBg: 'bg-[#0a0f0d]',
          priceShadow: 'drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]',
          
          scheduleBg: 'bg-[#0a0f0d]',
          
          upsellContainerBg: 'bg-gradient-to-b from-[#0a0f0d] to-[#050806]',
          upsellBorder: 'border-primary/20',
          upsellShadow: 'shadow-[0_0_50px_rgba(16,185,129,0.05)]',
          
          upsellCardBg: 'bg-[#0a0f0d]',
          upsellCardShadow: 'shadow-[0_0_25px_rgba(16,185,129,0.12)]',
          imgGradient: 'from-[#0a0f0d]/90 to-transparent',
          
          formBg: 'bg-[#050806]',
          inputBg: 'bg-[#0a0f0d]'
      }
  },
];

const escomStyles = `
        /* === ESCOM Studio: PDF Shimmer Button (Dynamic Color via CSS/Tailwind is handled by classes now) === */
        .btn-pdf-shimmer {
            position: relative;
            overflow: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-pdf-shimmer::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -60%;
            width: 30%;
            height: 200%;
            background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%);
            transform: rotate(30deg);
            animation: shimmer-btn 4.5s infinite ease-in-out;
        }
        @keyframes shimmer-btn {
            0% { left: -60%; }
            25% { left: 140%; }
            100% { left: 140%; }
        }
        .will-animate { opacity: 1; }
`;

companies.forEach(function(company) {
  const filePath = path.join(basePath, company.dir, 'index.html');
  if (!fs.existsSync(filePath)) { console.error('Não encontrado: ' + filePath); return; }

  console.log('\\nProcessando: ' + company.display);
  let html = fs.readFileSync(filePath, 'utf8');

  // Atualizar CSS de animação
  const cssStart = html.indexOf('/* === ESCOM Studio: PDF Shimmer Button ===');
  const cssAltStart = html.indexOf('/* PDF Shimmer Button Animation */');
  const startIdx = cssStart !== -1 ? cssStart : cssAltStart;
  if (startIdx !== -1) {
    const styleEnd = html.indexOf('</style>');
    if (styleEnd > startIdx) {
      const before = html.substring(0, startIdx);
      const after = html.substring(styleEnd);
      html = before + escomStyles + '\\n        ' + after;
    }
  }

  // Cortar no fechamento do footer
  const footerClose = '</footer>';
  const fi = html.lastIndexOf(footerClose);
  if (fi === -1) { console.error('  → ERRO: </footer> não encontrado.'); return; }
  const bodyBase = html.substring(0, fi + footerClose.length);

  // Gerar HTML
  const commercial = generateCommercialSections(company);
  const ctrlScripts = generateControlScripts(company.display, company.isEn);

  // Salvar
  const newHtml = bodyBase + '\\n' + commercial + '\\n' + ctrlScripts + '\\n' + gsapScript + '\\n</body>\\n</html>';
  fs.writeFileSync(filePath, newHtml, 'utf8');
  console.log('  → Identidade Visual adaptada aplicada com sucesso.');
});
