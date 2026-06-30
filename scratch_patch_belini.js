import fs from 'fs';
import path from 'path';

const filePath = path.resolve('public/template-belini/index.html');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Capturar dinamicamente a tag de imagem com base64 para o rodapé (para não colar o base64 no script)
// Existem duas ocorrências de base64 no arquivo original: no header e no footer
// A do footer é a segunda ocorrência. Vamos capturar a do footer.
const imgRegex = /<img alt="Clínica Belini" class="h-8 w-8 filter brightness-200" src="data:image\/png;base64,[^"]+"/g;
const matches = [...content.matchAll(imgRegex)];
let footerLogoImg = '';
if (matches.length > 0) {
    footerLogoImg = matches[matches.length - 1][0] + ' />';
} else {
    // Fallback caso não ache
    footerLogoImg = '<img alt="Clínica Belini" class="h-8 w-8 filter brightness-200" src="" />';
}

console.log('Logo do rodapé capturada dinamicamente.');

// 2. Injetar o Banner de Urgência logo após <body>
const bodyStart = '<body class="bg-background text-on-background font-body-md overflow-x-hidden">';
const bannerHtml = `
<!-- BANNER DE URGÊNCIA (PROPOSTA COMERCIAL) -->
<div id="banner-urgencia" class="fixed top-0 left-0 w-full min-h-[40px] py-1.5 bg-[#8a4853] text-white text-center flex items-center justify-center px-4 text-[10px] sm:text-xs md:text-sm font-bold shadow-md z-[100] animate-pulse transition-all">
    Proposta de implementação técnica disponível para aprovação da Clínica Belini. Válida por 3 dias.
</div>`;

if (!content.includes('id="banner-urgencia"')) {
    content = content.replace(bodyStart, bodyStart + bannerHtml);
}

// 3. Ajustar header (top-10, id navbar)
const oldHeader = '<header class="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant/10 w-full shadow-sm">';
const newHeader = '<header id="navbar" class="fixed top-10 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant/10 w-full shadow-sm transition-all duration-300">';
content = content.replace(oldHeader, newHeader);

// 4. Modificar container do nav para Grid de 3 colunas e ajustar elementos
const oldNavContainer = '<div class="flex justify-between items-center px-6 md:px-xl py-md max-w-container-max mx-auto w-full">';
const newNavContainer = '<div class="grid grid-cols-3 items-center px-6 md:px-xl py-md max-w-container-max mx-auto w-full">';
content = content.replace(oldNavContainer, newNavContainer);

// Alinhamento do logo
const oldLogoDiv = '<div class="flex items-center gap-sm">';
const newLogoDiv = '<div class="flex items-center gap-sm justify-start">';
content = content.replace(oldLogoDiv, newLogoDiv);

// Centralização do menu
const oldNavMenu = '<nav class="hidden md:flex gap-lg items-center mx-auto">';
const newNavMenu = '<nav class="hidden md:flex gap-lg items-center justify-center">';
content = content.replace(oldNavMenu, newNavMenu);

// Ajuste do botão Agendar Consulta -> Ver Proposta (à direita)
const oldBtnLink = '<a class="bg-primary text-on-primary px-6 py-2 rounded-lg font-label-caps text-label-caps hover:bg-primary-container transition-all active:scale-95 soft-shadow" href="https://wa.me/5531997850078" target="_blank">\r\n            Agendar Consulta\r\n        </a>';
const oldBtnLinkLF = '<a class="bg-primary text-on-primary px-6 py-2 rounded-lg font-label-caps text-label-caps hover:bg-primary-container transition-all active:scale-95 soft-shadow" href="https://wa.me/5531997850078" target="_blank">\n            Agendar Consulta\n        </a>';

const newBtnLink = `
<div class="flex justify-end">
    <a class="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-label-caps text-label-caps hover:bg-primary-container transition-all active:scale-95 soft-shadow" href="#proposta-comercial">
        Ver Proposta
    </a>
</div>`;

if (content.includes(oldBtnLink)) {
    content = content.replace(oldBtnLink, newBtnLink);
} else {
    content = content.replace(oldBtnLinkLF, newBtnLink);
}

// 5. Injetar Seções FAQ, Dossiê, Proposta e scripts de controle antes do Footer
const footerComment = '<!-- Footer -->';

if (!content.includes('id="proposta-comercial"')) {
    const sectionsHtml = `
<!-- FAQ Section (Accordion) -->
<section id="faq" class="py-24 bg-surface-container-low border-t border-outline-variant/10">
    <div class="container mx-auto px-6 md:px-xl max-w-4xl">
        <div class="text-center mb-16 space-y-4">
            <span class="font-label-caps text-label-caps text-primary mb-4 block uppercase tracking-widest">DÚVIDAS FREQUENTES</span>
            <h2 class="font-headline-lg text-headline-lg text-on-surface">Perguntas Frequentes</h2>
            <p class="font-body-md text-on-surface-variant">Esclareça suas principais dúvidas sobre nossos procedimentos e a proposta.</p>
        </div>
        
        <div class="space-y-4">
            <!-- FAQ Item 1 -->
            <div class="faq-item border border-outline-variant/20 bg-surface rounded-lg p-6 cursor-pointer transition-all hover:border-primary/40">
                <div class="flex justify-between items-center">
                    <h3 class="font-bold text-on-surface text-base sm:text-lg">Como funciona a harmonização facial?</h3>
                    <span class="material-symbols-outlined text-primary transition-transform duration-300">expand_more</span>
                </div>
                <div class="faq-answer max-h-0 overflow-hidden transition-all duration-300">
                    <p class="font-body-sm text-on-surface-variant pt-4 leading-relaxed border-t border-outline-variant/10 mt-4">
                        A harmonização facial é um conjunto de procedimentos estéticos combinados (como preenchimento com ácido hialurônico e aplicação de toxina botulínica) que visa equilibrar e realçar os traços naturais do rosto de forma harmônica e personalizada.
                    </p>
                </div>
            </div>
            <!-- FAQ Item 2 -->
            <div class="faq-item border border-outline-variant/20 bg-surface rounded-lg p-6 cursor-pointer transition-all hover:border-primary/40">
                <div class="flex justify-between items-center">
                    <h3 class="font-bold text-on-surface text-base sm:text-lg">Quanto tempo duram os resultados dos bioestimuladores de colágeno?</h3>
                    <span class="material-symbols-outlined text-primary transition-transform duration-300">expand_more</span>
                </div>
                <div class="faq-answer max-h-0 overflow-hidden transition-all duration-300">
                    <p class="font-body-sm text-on-surface-variant pt-4 leading-relaxed border-t border-outline-variant/10 mt-4">
                        Os bioestimuladores de colágeno agem estimulando a própria produção natural de colágeno do corpo. Os resultados começam a aparecer de forma gradual e podem durar de 18 a 24 meses, dependendo da resposta metabólica individual.
                    </p>
                </div>
            </div>
            <!-- FAQ Item 3 -->
            <div class="faq-item border border-outline-variant/20 bg-surface rounded-lg p-6 cursor-pointer transition-all hover:border-primary/40">
                <div class="flex justify-between items-center">
                    <h3 class="font-bold text-on-surface text-base sm:text-lg">Os procedimentos são doloridos?</h3>
                    <span class="material-symbols-outlined text-primary transition-transform duration-300">expand_more</span>
                </div>
                <div class="faq-answer max-h-0 overflow-hidden transition-all duration-300">
                    <p class="font-body-sm text-on-surface-variant pt-4 leading-relaxed border-t border-outline-variant/10 mt-4">
                        Para o conforto do paciente, utilizamos anestésicos tópicos potentes e, em alguns casos, bloqueios anestésicos locais. A maioria das pacientes relata apenas um leve desconforto tolerável durante a aplicação.
                    </p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- DOSSIÊ COMERCIAL SECTION -->
<section id="dossie-comercial" class="py-20 bg-surface text-center relative overflow-hidden border-t border-outline-variant/10">
    <div class="container mx-auto px-6 max-w-4xl relative z-10 space-y-6">
        <h3 class="font-headline-lg text-headline-lg text-primary">Análise Estratégica UX/UI & Dossiê de Mercado</h3>
        <p class="font-body-md text-on-surface-variant max-w-xl mx-auto">
            Acesse o estudo completo sobre o perfil de conversão dos pacientes, psicologia do público de estética e os pontos de otimização aplicados a este projeto de alta performance.
        </p>
        <div class="pt-4">
            <a href="/proposta-belini/dossie.pdf" target="_blank" class="inline-flex items-center gap-3 bg-primary/10 border border-primary/30 hover:bg-primary hover:text-on-primary text-primary px-8 py-4 rounded-lg font-label-caps text-label-caps transition-all soft-shadow group">
                <span class="material-symbols-outlined">picture_as_pdf</span> Acessar Dossiê Inteligente (PDF)
            </a>
        </div>
    </div>
</section>

<!-- PROPOSTA COMERCIAL SECTION -->
<section id="proposta-comercial" class="py-24 bg-surface-container-low relative overflow-hidden border-t-8 border-primary">
    <div class="container mx-auto px-6 max-w-6xl relative z-10">
        <div class="text-center mb-16 space-y-4">
            <span class="bg-primary/10 text-primary px-4 py-1.5 rounded-full font-label-caps text-label-caps border border-primary/20 mb-6 inline-block">Proposta Exclusiva ESCOM Studio</span>
            <h2 class="font-headline-lg text-headline-lg text-on-surface">Investimento do Projeto</h2>
            <p class="font-body-md text-on-surface-variant max-w-2xl mx-auto">Esta é a proposta comercial detalhada para o desenvolvimento e implementação da Landing Page premium da Clínica Belini.</p>
        </div>

        <!-- Card Principal de Preço -->
        <div class="max-w-2xl mx-auto bg-surface p-10 rounded-xl border border-primary/30 shadow-lg mb-16 relative">
            <div class="absolute top-0 right-0 bg-primary text-on-primary font-label-caps text-label-caps px-4 py-1.5 rounded-bl-lg z-20">OFERTA ESPECIAL</div>
            
            <h3 class="font-headline-sm text-headline-sm text-primary mb-2">Landing Page de Alta Performance</h3>
            <p class="font-body-sm text-on-surface-variant mb-6 pb-6 border-b border-outline-variant/10">Design Visual Exclusivo, Otimização de SEO, Integração com WhatsApp, Redação Persuasiva (Copywriting) e Carregamento Ultrarrápido.</p>
            
            <!-- Destaque Parcelamento 12x -->
            <div class="bg-primary-container/20 border border-primary/40 rounded-lg p-6 mb-8 relative mt-8">
                <div class="absolute -top-3 -right-3 bg-primary text-on-primary text-[10px] font-bold px-3 py-1 rounded shadow-lg flex items-center gap-1 z-20">
                    PARCELADO EM 12X
                </div>
                <div class="flex items-center justify-center gap-2 mb-4 mt-2">
                    <span class="material-symbols-outlined text-primary">credit_card</span>
                    <span class="font-label-caps text-label-caps text-primary tracking-widest uppercase">Pagamento Sem Juros no Cartão</span>
                </div>
                <div class="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1">
                    <span class="font-display-lg text-headline-lg text-primary">12x</span>
                    <span class="font-body-lg text-on-surface-variant">de</span>
                    <span class="font-display-lg text-display-lg text-primary">R$ 82</span>
                    <span class="font-headline-lg text-headline-lg text-primary">,50</span>
                </div>
                <p class="text-center text-on-surface-variant font-label-bold text-label-bold mt-3">OU À VISTA POR R$ 990,00 NO PIX/DÉBITO</p>
            </div>

            <ul class="space-y-4 mb-10 font-body-sm text-on-surface-variant">
                <li class="flex items-center gap-3"><span class="material-symbols-outlined text-primary text-[18px]">check_circle</span> Configuração de Domínio & Hospedagem Premium</li>
                <li class="flex items-center gap-3"><span class="material-symbols-outlined text-primary text-[18px]">check_circle</span> Design Totalmente Responsivo (Mobile & Desktop)</li>
                <li class="flex items-center gap-3"><span class="material-symbols-outlined text-primary text-[18px]">check_circle</span> Certificado de Segurança SSL Incluso</li>
                <li class="flex items-center gap-3"><span class="material-symbols-outlined text-primary text-[18px]">check_circle</span> Suporte Técnico e Acompanhamento por 30 Dias</li>
            </ul>

            <button id="btn-aceitar-proposta" class="w-full bg-primary text-on-primary font-label-bold text-label-bold uppercase py-5 rounded-lg transition-all hover:bg-primary-container hover:scale-[1.01] flex items-center justify-center gap-3 group soft-shadow">
                ACEITAR PROPOSTA AGORA <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
            <p class="text-center text-[11px] text-outline mt-4"><span class="material-symbols-outlined text-[12px] align-middle">lock</span> Processo seguro. Contrato enviado imediatamente após o aceite.</p>
        </div>
    </div>
</section>
`;

    content = content.replace(footerComment, sectionsHtml + footerComment);
}

// 6. Corrigir o rodapé flexbox espremido para estrutura simétrica
const oldFooterStart = '<footer class="w-full px-6 md:px-xl py-lg flex flex-col md:flex-row justify-between items-start gap-md bg-inverse-surface text-primary-fixed">';
const oldFooterEnd = '</footer>';

const footerStartIndex = content.indexOf(oldFooterStart);
const footerEndIndex = content.lastIndexOf(oldFooterEnd);

if (footerStartIndex !== -1 && footerEndIndex !== -1) {
    const originalFooterInner = content.substring(footerStartIndex + oldFooterStart.length, footerEndIndex);
    
    // Vamos reconstruir o footer com o copyright na barra inferior usando o footerLogoImg capturado dinamicamente
    const newFooterHtml = `
<footer class="w-full px-6 md:px-xl py-lg bg-inverse-surface text-primary-fixed flex flex-col gap-10">
    <div class="w-full flex flex-col md:flex-row justify-between items-start gap-md max-w-container-max mx-auto">
        <div class="flex flex-col gap-sm max-w-sm">
            <div class="flex items-center gap-xs">
                ${footerLogoImg}
                <span class="font-headline-sm text-headline-sm text-primary-fixed tracking-tight">Clínica Belini</span>
            </div>
            <p class="font-body-sm text-body-sm text-outline-variant">Tratamentos estéticos personalizados de alta performance.</p>
        </div>
        <div class="flex flex-wrap gap-lg md:gap-xl">
            <div>
                <h4 class="font-label-caps text-label-caps text-primary-fixed-dim mb-4 uppercase tracking-widest">Navegação</h4>
                <ul class="space-y-sm font-body-sm text-on-surface-variant">
                    <li><a class="hover:text-primary-fixed transition-colors" href="#services">Serviços</a></li>
                    <li><a class="hover:text-primary-fixed transition-colors" href="#about">Sobre</a></li>
                    <li><a class="hover:text-primary-fixed transition-colors" href="#results">Resultados</a></li>
                </ul>
            </div>
            <div>
                <h4 class="font-label-caps text-label-caps text-primary-fixed-dim mb-4 uppercase tracking-widest">Legal</h4>
                <ul class="space-y-sm font-body-sm text-on-surface-variant">
                    <li><a class="hover:text-primary-fixed transition-colors" href="/politica-de-privacidade">Privacidade</a></li>
                    <li><a class="hover:text-primary-fixed transition-colors" href="/termos-de-servico">Termos</a></li>
                </ul>
            </div>
        </div>
    </div>
    
    <!-- Barra inferior simétrica -->
    <div class="w-full mt-8 pt-8 border-t border-outline-variant/10 text-center text-xs flex flex-col md:flex-row justify-between items-center text-outline-variant gap-4 max-w-container-max mx-auto">
        <p>&copy; 2026 Clínica Belini. Todos os direitos reservados.</p>
        <p>Design & Engenharia de Conversão por <a href="#" class="text-primary font-bold hover:text-white transition">ESCOM STUDIO</a></p>
    </div>
</footer>
`;
    // Fazer a substituição apenas se o footer não tiver sido atualizado ainda
    if (!content.includes('Barra inferior simétrica')) {
        content = content.replace(content.substring(footerStartIndex, footerEndIndex + oldFooterEnd.length), newFooterHtml);
    }
}

// 7. Injetar o script de controle e acordeon do FAQ antes de </body>
const bodyClose = '</body>';
const controlScripts = `
<script>
    // Accordion do FAQ
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const answer = item.querySelector('.faq-answer');
            const icon = item.querySelector('.material-symbols-outlined');
            const isActive = item.classList.contains('active');
            
            // Fecha todos
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

    // Ajuste do navbar no scroll
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

    // Clique em Aceitar Proposta
    const btnAceitar = document.getElementById('btn-aceitar-proposta');
    if (btnAceitar) {
        btnAceitar.addEventListener('click', function(e) {
            e.preventDefault();
            btnAceitar.innerHTML = 'Processando...';
            btnAceitar.classList.add('opacity-80', 'cursor-wait');

            setTimeout(() => {
                const leadData = {
                    id: 'lead_' + Date.now(),
                    empresa: 'Clínica Belini',
                    status: 'pagamento_pendente',
                    valor: 990,
                    data: new Date().toISOString()
                };
                
                localStorage.setItem('escom_new_lead_conversion', JSON.stringify(leadData));
                window.dispatchEvent(new CustomEvent('escom-lead-converted', { detail: leadData }));

                btnAceitar.innerHTML = 'PROPOSTA ACEITA!';
                btnAceitar.classList.remove('bg-primary', 'hover:bg-primary-container');
                btnAceitar.classList.add('bg-zinc-800', 'text-primary', 'cursor-not-allowed');
                
                alert("Obrigado! Seu aceite foi registrado. A equipe da ESCOM Studio entrará em contato para os detalhes de faturamento.");
            }, 1500);
        });
    }

    // Ocultar seções se já pago
    function verificarStatusDoLead() {
        const statusCache = localStorage.getItem('escom_lead_status');
        if (statusCache === 'pago') {
            const banner = document.getElementById('banner-urgencia');
            const dossie = document.getElementById('dossie-comercial');
            const proposta = document.getElementById('proposta-comercial');
            const navbar = document.getElementById('navbar');
            
            if (banner) banner.style.display = 'none';
            if (navbar) {
                navbar.classList.remove('top-10');
                navbar.classList.add('top-0');
            }
            if (dossie) dossie.style.display = 'none';
            if (proposta) proposta.style.display = 'none';
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
console.log('Template Belini atualizado com sucesso via script dinâmico!');
