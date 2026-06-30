import fs from 'fs';
import path from 'path';

const filePath = path.resolve('public/template-austin-simply-fit/index.html');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Injetar o Banner de Urgência em inglês logo após <body>
const bodyStart = '<body class="bg-background text-on-background">';
const bannerHtml = `
<!-- BANNER DE URGÊNCIA (PROPOSTA COMERCIAL) -->
<div id="banner-urgencia" class="fixed top-0 left-0 w-full min-h-[40px] py-1.5 bg-[#0066ff] text-white text-center flex items-center justify-center px-4 text-[10px] sm:text-xs md:text-sm font-bold shadow-md z-[100] animate-pulse transition-all">
    Technical implementation proposal available for approval of Austin Simply Fit. Valid for 3 days.
</div>`;

if (!content.includes('id="banner-urgencia"')) {
    content = content.replace(bodyStart, bodyStart + bannerHtml);
}

// 2. Ajustar header (top-10, id navbar)
const oldHeader = '<header class="fixed top-0 left-0 right-0 z-50 bg-surface-container border-b-2 border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full">';
const newHeader = '<header id="navbar" class="fixed top-10 left-0 right-0 z-50 bg-surface-container border-b-2 border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full transition-all duration-300">';
content = content.replace(oldHeader, newHeader);

// 3. Modificar container do nav para Grid de 3 colunas e ajustar elementos
const oldNavContainer = '<nav class="flex justify-between items-center h-20 px-gutter max-w-container-max mx-auto">';
const newNavContainer = '<nav class="grid grid-cols-3 items-center h-20 px-gutter max-w-container-max mx-auto w-full">';
content = content.replace(oldNavContainer, newNavContainer);

// Alinhamento do logo
const oldLogoDiv = '<div class="font-display-lg text-headline-md font-extrabold text-primary tracking-tighter uppercase">';
const newLogoDiv = '<div class="font-display-lg text-headline-md font-extrabold text-primary tracking-tighter uppercase text-left">';
content = content.replace(oldLogoDiv, newLogoDiv);

// Centralização do menu
const oldNavMenu = '<div class="hidden md:flex items-center gap-8 mx-auto">';
const newNavMenu = '<div class="hidden md:flex items-center justify-center gap-8">';
content = content.replace(oldNavMenu, newNavMenu);

// Ajuste do botão Agendar Consulta -> Ver Proposta (à direita)
const oldBtnLink = '<button class="font-label-bold text-label-bold uppercase bg-primary-container text-on-primary-container px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-primary transition-all active:translate-y-1">\r\n                BOOK SESSION\r\n            </button>';
const oldBtnLinkLF = '<button class="font-label-bold text-label-bold uppercase bg-primary-container text-on-primary-container px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-primary transition-all active:translate-y-1">\n                BOOK SESSION\n            </button>';

const newBtnLink = `
<div class="flex justify-end">
    <a class="font-label-bold text-label-bold uppercase bg-primary-container text-on-primary-container px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-primary transition-all active:translate-y-1 text-center inline-block" href="#proposta-comercial">
        VIEW PROPOSAL
    </a>
</div>`;

if (content.includes(oldBtnLink)) {
    content = content.replace(oldBtnLink, newBtnLink);
} else {
    content = content.replace(oldBtnLinkLF, newBtnLink);
}

// 4. Injetar Seções FAQ, Dossiê, Proposta e scripts de controle antes do Footer
const footerComment = '<!-- Footer -->';

if (!content.includes('id="proposta-comercial"')) {
    const sectionsHtml = `
<!-- FAQ Section (Accordion) -->
<section id="faq-commercial" class="py-24 bg-surface-container-low border-t-2 border-primary">
    <div class="container mx-auto px-6 max-w-4xl">
        <div class="text-center mb-16 space-y-4">
            <span class="text-primary font-label-bold uppercase tracking-widest block mb-2">FAQ — PROPOSAL DETAILS</span>
            <h2 class="font-headline-lg text-headline-lg uppercase">Frequently Asked Questions</h2>
            <p class="font-body-md text-on-surface-variant">Clarify your doubts regarding the execution timeline, visual style, and terms of the website implementation.</p>
        </div>
        
        <div class="space-y-4">
            <!-- FAQ Item 1 -->
            <div class="faq-item border border-outline-variant bg-surface p-6 cursor-pointer hover:border-primary transition-all">
                <div class="flex justify-between items-center">
                    <h3 class="font-label-bold text-label-bold uppercase text-on-surface">What is included in the website design process?</h3>
                    <span class="material-symbols-outlined text-primary transition-transform duration-300">expand_more</span>
                </div>
                <div class="faq-answer max-h-0 overflow-hidden transition-all duration-300">
                    <p class="font-body-sm text-on-surface-variant pt-4 leading-relaxed border-t border-outline-variant mt-4">
                        The proposal covers full UX/UI visual mockups, copy engineering tailored for high-conversion in fitness niches, responsive layout for mobile and desktop, basic search engine optimization (SEO), and WhatsApp integration.
                    </p>
                </div>
            </div>
            <!-- FAQ Item 2 -->
            <div class="faq-item border border-outline-variant bg-surface p-6 cursor-pointer hover:border-primary transition-all">
                <div class="flex justify-between items-center">
                    <h3 class="font-label-bold text-label-bold uppercase text-on-surface">What is the project delivery timeline?</h3>
                    <span class="material-symbols-outlined text-primary transition-transform duration-300">expand_more</span>
                </div>
                <div class="faq-answer max-h-0 overflow-hidden transition-all duration-300">
                    <p class="font-body-sm text-on-surface-variant pt-4 leading-relaxed border-t border-outline-variant mt-4">
                        The estimated timeline is 10 business days starting immediately after invoice payment and asset collection (branding files, copy details, or custom text guidelines).
                    </p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- DOSSIÊ COMERCIAL SECTION -->
<section id="dossie-comercial" class="py-20 bg-surface text-center relative overflow-hidden border-t-2 border-primary">
    <div class="container mx-auto px-6 max-w-4xl relative z-10 space-y-6">
        <h3 class="font-headline-lg text-headline-lg uppercase text-primary">UX/UI Analysis & Strategic Dossier</h3>
        <p class="font-body-md text-on-surface-variant max-w-xl mx-auto">
            Review the restricted UX/UI study, target demographic psychography, and visual optimization insights for Austin Simply Fit.
        </p>
        <div class="pt-4">
            <a href="/proposta-austin-simply-fit/dossie.pdf" target="_blank" class="inline-flex items-center gap-3 bg-primary-container text-on-primary-container px-8 py-4 font-label-bold text-label-bold uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-primary transition-all active:translate-y-1">
                <span class="material-symbols-outlined text-sm">picture_as_pdf</span> Access Intelligent Dossier (PDF)
            </a>
        </div>
    </div>
</section>

<!-- PROPOSTA COMERCIAL SECTION -->
<section id="proposta-comercial" class="py-24 bg-surface-container relative overflow-hidden border-t-8 border-primary">
    <div class="container mx-auto px-6 max-w-6xl relative z-10">
        <div class="text-center mb-16 space-y-4">
            <span class="bg-primary-container text-on-primary-container px-4 py-1.5 font-label-bold text-label-bold uppercase tracking-wider mb-6 inline-block">Exclusive ESCOM Studio Proposal</span>
            <h2 class="font-headline-lg text-headline-lg uppercase text-on-surface">Project Investment</h2>
            <p class="font-body-md text-on-surface-variant max-w-2xl mx-auto">This is the complete commercial proposal for the custom-built, high-converting Landing Page for Austin Simply Fit.</p>
        </div>

        <!-- Card Principal de Preço -->
        <div class="max-w-2xl mx-auto bg-surface p-10 border-2 border-primary shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] mb-16 relative">
            <div class="absolute top-0 right-0 bg-primary-container text-on-primary-container font-label-bold text-label-bold px-4 py-1.5 uppercase z-20">CURRENT OFFER</div>
            
            <h3 class="font-headline-sm text-headline-sm text-primary uppercase mb-2">High-Conversion Website</h3>
            <p class="font-body-sm text-on-surface-variant mb-6 pb-6 border-b border-outline-variant">Premium visual layouts, local SEO, mobile-first responsiveness, and priority technical setup.</p>
            
            <!-- Destaque Parcelamento 12x -->
            <div class="bg-primary-container/10 border-2 border-primary rounded-lg p-6 mb-8 relative mt-8">
                <div class="absolute -top-3 -right-3 bg-primary-container text-on-primary-container text-[10px] font-bold px-3 py-1 shadow-lg flex items-center gap-1 z-20">
                    PAY IN 12X
                </div>
                <div class="flex items-center justify-center gap-2 mb-4 mt-2">
                    <span class="material-symbols-outlined text-primary">credit_card</span>
                    <span class="font-label-bold text-label-bold text-primary uppercase">No-Interest Installments</span>
                </div>
                <div class="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1">
                    <span class="font-display-lg text-headline-lg text-primary">12x</span>
                    <span class="font-body-lg text-on-surface-variant">of</span>
                    <span class="font-display-lg text-display-lg text-primary">$82</span>
                    <span class="font-headline-lg text-headline-lg text-primary">.50</span>
                </div>
                <p class="text-center text-on-surface-variant font-label-bold text-label-bold mt-3">OR UPFRONT FOR $990 (WIRE / DEBIT)</p>
            </div>

            <ul class="space-y-4 mb-10 font-body-sm text-on-surface-variant">
                <li class="flex items-center gap-3"><span class="material-symbols-outlined text-primary text-[18px]">check_circle</span> Fast hosting & custom domain configurations</li>
                <li class="flex items-center gap-3"><span class="material-symbols-outlined text-primary text-[18px]">check_circle</span> Mobile-first speed & usability optimizations</li>
                <li class="flex items-center gap-3"><span class="material-symbols-outlined text-primary text-[18px]">check_circle</span> 100% secure SSL integration</li>
                <li class="flex items-center gap-3"><span class="material-symbols-outlined text-primary text-[18px]">check_circle</span> 30 days of direct technical monitoring</li>
            </ul>

            <button id="btn-aceitar-proposta" class="w-full bg-primary-container text-on-primary-container font-label-bold text-label-bold uppercase py-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-primary transition-all active:translate-y-1 flex items-center justify-center gap-3 group">
                ACCEPT PROPOSAL NOW <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
            <p class="text-center text-[11px] text-outline mt-4"><span class="material-symbols-outlined text-[12px] align-middle">lock</span> Secure contract generation. Agreement details sent via email immediately.</p>
        </div>
    </div>
</section>
`;

    content = content.replace(footerComment, sectionsHtml + footerComment);
}

// 5. Corrigir o rodapé flexbox espremido para estrutura simétrica
const oldFooterStart = '<footer class="w-full py-12 bg-surface-container-lowest border-t-4 border-surface-container-highest">';
const oldFooterEnd = '</footer>';

const footerStartIndex = content.indexOf(oldFooterStart);
const footerEndIndex = content.lastIndexOf(oldFooterEnd);

if (footerStartIndex !== -1 && footerEndIndex !== -1) {
    const newFooterHtml = `
<footer class="w-full py-12 bg-surface-container-lowest border-t-4 border-surface-container-highest flex flex-col gap-8">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter px-gutter max-w-container-max mx-auto w-full items-center">
        <div class="font-display-lg text-headline-md text-primary uppercase text-left">AUSTIN SIMPLY FIT</div>
        <div class="flex justify-center gap-6">
            <a class="font-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <a class="font-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
            <a class="font-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">Careers</a>
            <a class="font-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">Contact</a>
        </div>
        <div class="text-right font-body-md text-on-surface-variant">
            © 2026 AUSTIN SIMPLY FIT. ALL RIGHTS RESERVED.
        </div>
    </div>
    <div class="w-full max-w-container-max mx-auto px-gutter border-t border-outline-variant/10 pt-6 text-center text-xs text-on-surface-variant/40">
        Design & Conversion Engineering by <a href="#" class="text-primary font-bold hover:text-white transition">ESCOM STUDIO</a>
    </div>
</footer>
`;
    if (!content.includes('Conversion Engineering by')) {
        content = content.replace(content.substring(footerStartIndex, footerEndIndex + oldFooterEnd.length), newFooterHtml);
    }
}

// 6. Injetar scripts de controle e FAQ do accordion antes de </body>
const bodyClose = '</body>';
const controlScripts = `
<script>
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const answer = item.querySelector('.faq-answer');
            const icon = item.querySelector('.material-symbols-outlined');
            const isActive = item.classList.contains('active');
            
            faqItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-answer').style.maxHeight = '0px';
                i.querySelector('.material-symbols-outlined').style.transform = 'rotate(0deg)';
            });
            
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });

    // Scroll Navbar Effect
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        if (window.scrollY > 50) {
            nav.classList.remove('top-10');
            nav.classList.add('top-0', 'shadow-md');
        } else {
            const statusCache = localStorage.getItem('escom_lead_status');
            if (statusCache !== 'pago') {
                nav.classList.remove('top-0');
                nav.classList.add('top-10');
            }
        }
    });

    // Accept Proposal Event Handler
    const btnAceitar = document.getElementById('btn-aceitar-proposta');
    if (btnAceitar) {
        btnAceitar.addEventListener('click', function(e) {
            e.preventDefault();
            btnAceitar.innerHTML = 'Processing...';
            btnAceitar.classList.add('opacity-80', 'cursor-wait');

            setTimeout(() => {
                const leadData = {
                    id: 'lead_' + Date.now(),
                    empresa: 'Austin Simply Fit',
                    status: 'pagamento_pendente',
                    valor: 990,
                    data: new Date().toISOString()
                };
                
                localStorage.setItem('escom_new_lead_conversion', JSON.stringify(leadData));
                window.dispatchEvent(new CustomEvent('escom-lead-converted', { detail: leadData }));

                btnAceitar.innerHTML = 'PROPOSAL ACCEPTED!';
                btnAceitar.classList.remove('bg-primary-container', 'hover:bg-primary');
                btnAceitar.classList.add('bg-zinc-800', 'text-primary', 'cursor-not-allowed');
                
                alert("Thank you! Your proposal approval has been registered. The ESCOM Studio team will contact you shortly with invoicing details!");
            }, 1500);
        });
    }

    // Client Mode Check
    function verificarStatusDoLead() {
        const statusCache = localStorage.getItem('escom_lead_status');
        if (statusCache === 'pago') {
            const banner = document.getElementById('banner-urgencia');
            const dossie = document.getElementById('dossie-comercial');
            const proposta = document.getElementById('proposta-comercial');
            const faqSection = document.getElementById('faq-commercial');
            const navbar = document.getElementById('navbar');
            
            if (banner) banner.style.display = 'none';
            if (navbar) {
                navbar.classList.remove('top-10');
                navbar.classList.add('top-0');
            }
            if (dossie) dossie.style.display = 'none';
            if (proposta) proposta.style.display = 'none';
            if (faqSection) faqSection.style.display = 'none';
        }
    }
    verificarStatusDoLead();
    window.addEventListener('storage', (e) => {
        if (e.key === 'escom_lead_status' && e.newValue === 'pago') {
            verificarStatusDoLead();
        }
    });
</script>
`;

if (!content.includes('verificarStatusDoLead')) {
    content = content.replace(bodyClose, controlScripts + bodyClose);
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Template Austin Simply Fit atualizado com sucesso!');
