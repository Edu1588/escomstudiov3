import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

// Carregar firebase config
const firebaseConfig = JSON.parse(fs.readFileSync(new URL('./firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

// Carregar o template oficial
const templatePath = path.join(process.cwd(), 'templates', 'nicho1_consultoria_ma.html');
const baseTemplateHtml = fs.readFileSync(templatePath, 'utf8');

const nicho1Leads = [
  {
    proposalId: 'proposta-escom-nicho1-brasil-valuation',
    siteId: 'site-nicho1-brasil-valuation',
    legacySiteId: 'site-8346211196693755496',
    companyName: 'Brasil Valuation & M&A Advisory',
    brandName: 'BRASIL VALUATION',
    subBrand: '& M&A',
    headline: 'Excelência em <br> <span class="text-gradient">Valuation & M&A</span>',
    subtitle: 'Assessoria financeira independente, avaliação de ativos complexos e condução completa de fusões e aquisições para empresas de alto valor.',
    niche: 'Consultoria de Gestão Empresarial e M&A',
    address: 'Av. Brigadeiro Faria Lima, 3477 - Itaim Bibi, São Paulo - SP',
    phone: '(11) 3078-4500',
    email: 'contato@brasilvaluation.com.br',
    whatsapp: '551130784500',
    budget: '990,00',
    pdfUrl: 'https://escom-studio.vercel.app/site-consultoria-ma/dossie-consultoria-ma.pdf',
    // Customizações visuais
    gold: '#d4af37', // Gold
    goldLight: '#f3e5ab',
    heroImg: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=2070&q=80',
    sobreImg: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1000&q=80',
    analysisText: 'Avaliação profunda de múltiplos e estruturação financeira voltada para maximização de valor nas operações de M&A do Brasil Valuation.',
    sobreTitle: 'Precisão em <span class="text-[${lead.gold}]">Valuation</span>',
    sobreText1: 'Especialistas na avaliação profunda de ativos e determinação do justo valor de mercado para transações corporativas.',
    sobreText2: 'Atuamos com rigor metodológico internacional, entregando relatórios precisos para fundos, empresas familiares e investidores institucionais.',
    sobreBullet1: 'Modelagem financeira avançada.',
    sobreBullet2: 'Laudos de avaliação independentes.',
    sobreBullet3: 'Assessoria especializada em litígios societários.',
    stat1V: 'R$ 15B+', stat1L: 'Em Ativos Avaliados',
    stat2V: '300+', stat2L: 'Laudos Emitidos',
    stat3V: '20', stat3L: 'Especialistas',
    stat4V: '100%', stat4L: 'Independência'
  },
  {
    proposalId: 'proposta-escom-nicho1-vsh-partners',
    siteId: 'site-nicho1-vsh-partners',
    legacySiteId: 'site-8059201761862313788',
    companyName: 'VSH Partners Advisory',
    brandName: 'VSH',
    subBrand: 'PARTNERS',
    headline: 'Liderança em <br> <span class="text-gradient">Fusões e Aquisições</span>',
    subtitle: 'Assessoramos líderes corporativos e conselhos de administração em operações complexas de Buy-Side, Sell-Side e Reestruturação Estratégica.',
    niche: 'Consultoria de Gestão Empresarial e M&A',
    address: 'Av. Cidade Jardim, 377 - Itaim Bibi, São Paulo - SP',
    phone: '(11) 3192-2970',
    email: 'contato@vshpartners.com.br',
    whatsapp: '551131922970',
    budget: '990,00',
    pdfUrl: 'https://escom-studio.vercel.app/site-consultoria-ma/dossie-consultoria-ma.pdf',
    // Customizações visuais
    gold: '#60a5fa', // Blue
    goldLight: '#93c5fd',
    heroImg: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=2070&q=80',
    sobreImg: 'https://images.unsplash.com/photo-1554469251-62078eb11370?auto=format&fit=crop&w=1000&q=80',
    analysisText: 'Diagnóstico estratégico completo da VSH Partners para otimizar estrutura de capital e preparar a empresa para o mercado de capitais.',
    sobreTitle: 'Boutique de <span class="text-[${lead.gold}]">M&A Estratégico</span>',
    sobreText1: 'Uma advisory focada em operações complexas, fusões, aquisições e reorganização societária no Middle Market.',
    sobreText2: 'Apoiamos conselhos de administração e acionistas com total discrição, inteligência de mercado e foco implacável no fechamento.',
    sobreBullet1: 'Foco exclusivo no Middle Market.',
    sobreBullet2: 'Rede qualificada de investidores.',
    sobreBullet3: 'Alinhamento de interesses (Success Fee).',
    stat1V: 'R$ 3B+', stat1L: 'Em Transações',
    stat2V: '50+', stat2L: 'Deals Fechados',
    stat3V: '15', stat3L: 'Anos de Atuação',
    stat4V: '95%', stat4L: 'Taxa de Sucesso'
  },
  {
    proposalId: 'proposta-escom-nicho1-apex-capital',
    siteId: 'site-nicho1-apex-capital',
    legacySiteId: 'site-6950489851106358295',
    companyName: 'Apex Capital Consultoria & M&A',
    brandName: 'APEX CAPITAL',
    subBrand: 'M&A',
    headline: 'Estratégia Corporativa & <br> <span class="text-gradient">Transações M&A</span>',
    subtitle: 'Transformamos desafios operacionais em vantagens competitivas com metodologias internacionais de valuation e estruturação de capital.',
    niche: 'Consultoria de Gestão Empresarial e M&A',
    address: 'Av. das Nações Unidas, 12551 - Brooklin, São Paulo - SP',
    phone: '(11) 5503-8200',
    email: 'contato@apexcapital.com.br',
    whatsapp: '551155038200',
    budget: '990,00',
    pdfUrl: 'https://escom-studio.vercel.app/site-consultoria-ma/dossie-consultoria-ma.pdf',
    // Customizações visuais
    gold: '#10b981', // Emerald
    goldLight: '#34d399',
    heroImg: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2070&q=80',
    sobreImg: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80',
    analysisText: 'Mapeamento de riscos e oportunidades no setor de atuação, garantindo que a Apex Capital entregue prospecções de alto nível e fechamento ágil.',
    sobreTitle: 'Estratégia de <span class="text-[${lead.gold}]">Alto Impacto</span>',
    sobreText1: 'Ajudamos líderes empresariais na estruturação de capital, expansão de mercado e aquisições estratégicas (Buy-side).',
    sobreText2: 'Nosso foco é maximizar a alavancagem financeira de forma sustentável, preparando a empresa para dominar o seu setor de atuação.',
    sobreBullet1: 'Otimização avançada de capital.',
    sobreBullet2: 'Captação de recursos e dívida estruturada.',
    sobreBullet3: 'Mapeamento ativo e global de M&A (Buy-side).',
    stat1V: 'R$ 8B+', stat1L: 'Capital Estruturado',
    stat2V: '80+', stat2L: 'Mandatos Concluídos',
    stat3V: '10', stat3L: 'Anos no Mercado',
    stat4V: 'Top 5', stat4L: 'No Setor Industrial'
  },
  {
    proposalId: 'proposta-escom-nicho1-valus-corporate',
    siteId: 'site-nicho1-valus-corporate',
    legacySiteId: 'site-12358757581808087772',
    companyName: 'Valus Corporate Advisory',
    brandName: 'VALUS',
    subBrand: 'CORPORATE',
    headline: 'Gestão Empresarial & <br> <span class="text-gradient">Governança M&A</span>',
    subtitle: 'Boutique executiva focada na geração de valor sustentável, preparação para Sell-side e otimização de EBITDA para médias e grandes empresas.',
    niche: 'Consultoria de Gestão Empresarial e M&A',
    address: 'Av. Paulista, 1842 - Bela Vista, São Paulo - SP',
    phone: '(11) 3289-9100',
    email: 'contato@valuscorporate.com.br',
    whatsapp: '551132899100',
    budget: '990,00',
    pdfUrl: 'https://escom-studio.vercel.app/site-consultoria-ma/dossie-consultoria-ma.pdf',
    // Customizações visuais
    gold: '#b76e79', // Rose Gold
    goldLight: '#d8a7b1',
    heroImg: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=2070&q=80',
    sobreImg: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1000&q=80',
    analysisText: 'Auditoria de valuation exclusivo da Valus Corporate para garantir precisão e blindagem em operações de Due Diligence.',
    sobreTitle: 'Governança & <span class="text-[${lead.gold}]">Crescimento</span>',
    sobreText1: 'Especializados na preparação completa de empresas para processos sucessórios, fusões ou alienação total do controle.',
    sobreText2: 'Reestruturamos processos internos e controles operacionais com o objetivo único de aumentar exponencialmente a margem EBITDA.',
    sobreBullet1: 'Profissionalização imediata da gestão.',
    sobreBullet2: 'Aumento direto de margens operacionais.',
    sobreBullet3: 'Auditoria preventiva e Due Diligence.',
    stat1V: '+40%', stat1L: 'Aumento de EBITDA',
    stat2V: '200+', stat2L: 'Empresas Assessoradas',
    stat3V: '25', stat3L: 'Consultores Sênior',
    stat4V: '100%', stat4L: 'Confidencialidade'
  },
  {
    proposalId: 'proposta-escom-nicho1-fortis-partners',
    siteId: 'site-nicho1-fortis-partners',
    legacySiteId: 'site-2935962641878547175',
    companyName: 'Fortis Partners & M&A Consultants',
    brandName: 'FORTIS',
    subBrand: 'PARTNERS',
    headline: 'Maximização de Valor & <br> <span class="text-gradient">Estratégia M&A</span>',
    subtitle: 'Atuamos junto a fundadores, acionistas e fundos de Private Equity para conduzir transações estratégicas com confidencialidade e eficiência.',
    niche: 'Consultoria de Gestão Empresarial e M&A',
    address: 'Av. Pres. Juscelino Kubitschek, 1909 - Vila Nova Conceição, São Paulo - SP',
    phone: '(11) 4003-7520',
    email: 'contato@fortispartners.com.br',
    whatsapp: '551140037520',
    budget: '990,00',
    pdfUrl: 'https://escom-studio.vercel.app/site-consultoria-ma/dossie-consultoria-ma.pdf',
    // Customizações visuais
    gold: '#cd7f32', // Bronze
    goldLight: '#e6a86b',
    heroImg: 'https://images.unsplash.com/photo-1554469251-62078eb11370?auto=format&fit=crop&w=2070&q=80',
    sobreImg: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1000&q=80',
    analysisText: 'Mapeamento de target e prospecção ativa, estruturando a tese de investimento com a solidez característica da Fortis Partners.',
    sobreTitle: 'Solidez & <span class="text-[${lead.gold}]">M&A Executivo</span>',
    sobreText1: 'Oferecemos atendimento exclusivo a fundadores, famílias empresárias e grandes investidores institucionais globais.',
    sobreText2: 'Trabalhamos incansavelmente para proteger e multiplicar o valor gerado ao longo de décadas de trabalho duro pelos empresários.',
    sobreBullet1: 'Consultoria e estruturação Cross-border.',
    sobreBullet2: 'Assessoria integral em mandatos Sell-side.',
    sobreBullet3: 'Negociação direta com Private Equity.',
    stat1V: 'R$ 10B+', stat1L: 'Em Deals Concluídos',
    stat2V: '40+', stat2L: 'Fusões Internacionais',
    stat3V: '5', stat3L: 'Escritórios Globais',
    stat4V: '30', stat4L: 'Parceiros Executivos'
  }
];

function injectEscomDossierSection(html, lead) {
  const proposalUrl = lead.pdfUrl; // LINK DIRETO PARA O PDF
  
  // TARJA DE PRAZO NO TOPO DA SEÇÃO
  const escomSection = `
    <!-- ======================================================= -->
    <!-- BLOCO ESCOM STUDIO: ANÁLISE ESTRATÉGICA & PROPOSTA REAL -->
    <!-- ======================================================= -->
    <div class="bg-red-600 text-white text-center py-3 text-sm md:text-base font-bold tracking-[0.2em] uppercase relative z-50 shadow-lg border-b border-red-800 animate-pulse">
      ⚠️ ATENÇÃO: CONDIÇÃO ESPECIAL E PROJETO VÁLIDOS POR APENAS 72 HORAS ⚠️
    </div>
    <section id="analise" class="py-24 bg-darker relative z-30 border-t border-[${lead.gold}]/20">
      <div class="max-w-7xl mx-auto px-6 text-center">
        <span class="inline-block bg-[${lead.gold}]/10 text-[${lead.gold}] text-xs font-bold px-4 py-1.5 rounded-full border border-[${lead.gold}]/30 uppercase tracking-widest mb-6">Diagnóstico Digital Exclusivo</span>
        <h2 class="text-4xl md:text-5xl font-heading font-bold text-white mb-6">Análise Estratégica & <span class="text-[${lead.gold}]">Diagnóstico de Mercado</span></h2>
        
        <!-- ANÁLISE DO PROJETO (PERSONALIZADA) -->
        <div class="bg-dark p-8 rounded-xl border border-[${lead.gold}]/30 mb-12 max-w-4xl mx-auto text-left relative overflow-hidden">
          <div class="absolute top-0 right-0 p-4 opacity-5"><i class="ph ph-magnifying-glass text-9xl text-white"></i></div>
          <h3 class="text-2xl font-bold mb-4 text-white flex items-center gap-2"><i class="ph ph-target text-[${lead.gold}]"></i> Análise de Posicionamento - ${lead.companyName}</h3>
          <p class="text-gray-300 text-lg font-light leading-relaxed mb-4">
            ${lead.analysisText}
          </p>
          <p class="text-gray-400 text-sm">
            Nossa auditoria revelou que a atual infraestrutura digital e processos de prospecção podem ser aprimorados em até 340% utilizando a nossa metodologia de conversão corporativa de alto padrão.
          </p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
          <div class="glass p-6 rounded-xl border border-[${lead.gold}]/20">
            <i class="ph ph-chart-line-up text-[${lead.gold}] text-3xl mb-2"></i>
            <div class="text-3xl font-heading font-bold text-white">96/100</div>
            <div class="text-xs text-gray-400 uppercase tracking-wider mt-1">Score de Excelência</div>
          </div>
          <div class="glass p-6 rounded-xl border border-[${lead.gold}]/20">
            <i class="ph ph-shield-check text-[${lead.gold}] text-3xl mb-2"></i>
            <div class="text-3xl font-heading font-bold text-white">Confidencial</div>
            <div class="text-xs text-gray-400 uppercase tracking-wider mt-1">Auditoria de UX/UI</div>
          </div>
          <div class="glass p-6 rounded-xl border border-[${lead.gold}]/20">
            <i class="ph ph-rocket-launch text-[${lead.gold}] text-3xl mb-2"></i>
            <div class="text-3xl font-heading font-bold text-white">+340%</div>
            <div class="text-xs text-gray-400 uppercase tracking-wider mt-1">Potencial de Conversão</div>
          </div>
          <div class="glass p-6 rounded-xl border border-[${lead.gold}]/20">
            <i class="ph ph-lock-key text-[${lead.gold}] text-3xl mb-2"></i>
            <div class="text-3xl font-heading font-bold text-white">Acesso VIP</div>
            <div class="text-xs text-gray-400 uppercase tracking-wider mt-1">Validade de 3 Dias</div>
          </div>
        </div>

        <!-- LINK PARA PDF -->
        <a href="${proposalUrl}" target="_blank" rel="noopener noreferrer" class="btn-shine inline-flex items-center gap-3 px-8 py-4 bg-[${lead.gold}] text-dark font-bold uppercase tracking-wider rounded-lg hover:bg-white transition-all duration-300 shadow-[0_0_25px_rgba(0,0,0,0.4)] text-base">
          <i class="ph ph-file-pdf text-2xl"></i> Visualizar Análise Técnica Completa em PDF
        </a>
      </div>
    </section>

    <!-- BLOCO INVESTIMENTO E CONDIÇÕES -->
    <section id="investimento" class="py-24 bg-dark relative z-30 border-t border-white/5">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <span class="text-[${lead.gold}] tracking-widest text-sm uppercase font-semibold">Proposta Comercial</span>
        <h2 class="text-4xl md:text-5xl font-heading font-bold mt-4 mb-12">Infraestrutura Digital de Alta Performance</h2>

        <div class="glass-card p-10 rounded-2xl border border-[${lead.gold}]/30 max-w-xl mx-auto text-center relative overflow-hidden">
          <div class="absolute top-0 right-0 bg-[${lead.gold}] text-dark font-bold text-xs uppercase px-4 py-1.5 rounded-bl-lg tracking-wider">Condição Especial</div>
          <p class="text-gray-400 text-xs uppercase tracking-widest mb-2">Taxa Única de Licenciamento & Setup</p>
          <div class="text-6xl font-heading font-bold text-[${lead.gold}] mb-2">R$ 990,00</div>
          <p class="text-gray-300 text-sm mb-8">Pagamento único. Sem mensalidades ou taxas ocultas.</p>

          <ul class="text-left space-y-4 mb-10 text-gray-300 text-sm border-t border-b border-white/10 py-6">
            <li class="flex items-center gap-3"><i class="ph ph-check-circle text-[${lead.gold}] text-xl"></i> Design Exclusivo Nicho M&A com GSAP e Lenis Scroll</li>
            <li class="flex items-center gap-3"><i class="ph ph-check-circle text-[${lead.gold}] text-xl"></i> Código Ultrarrápido e Otimizado para SEO Corporativo</li>
            <li class="flex items-center gap-3"><i class="ph ph-check-circle text-[${lead.gold}] text-xl"></i> Hospedagem SSL Dedicada Inclusa por 12 meses</li>
            <li class="flex items-center gap-3"><i class="ph ph-check-circle text-[${lead.gold}] text-xl"></i> Canal Direto de Agendamento pelo WhatsApp</li>
            <li class="flex items-center gap-3"><i class="ph ph-check-circle text-[${lead.gold}] text-xl"></i> Suporte e Ajustes com a Equipe ESCOM Studio</li>
          </ul>

          <a href="https://wa.me/5511988832812?text=Ol%C3%A1,%20gostaria%20de%20aprovar%20o%20projeto%20da%20${encodeURIComponent(lead.companyName)}" target="_blank" class="btn-shine w-full block py-4 bg-[${lead.gold}] text-dark font-bold uppercase tracking-wider rounded-lg hover:bg-white transition-all text-center">
            Aprovar Projeto & Iniciar Implementação
          </a>
        </div>
      </div>
    </section>
  `;

  return html.replace('<footer', `${escomSection}\n<footer`);
}

async function rebuildAll() {
  console.log("🚀 Iniciando Reconstrução de TODOS os 5 Sites do Nicho 1 (Consultoria de Gestão e M&A) - V3 (Textos e Stats 100% Personalizados)...");

  for (const lead of nicho1Leads) {
    console.log(`\n--- Processando: ${lead.companyName} ---`);

    let html = baseTemplateHtml;

    // FIX: Correção do "Fale Connosco"
    html = html.replace(/Fale Connosco/gi, 'Fale Conosco');

    // Substituição das cores do template para as cores da marca
    html = html.replace(/#d4af37/g, lead.gold);
    html = html.replace(/#f3e5ab/g, lead.goldLight);

    // Substituição das imagens
    html = html.replace(/https:\/\/images\.unsplash\.com\/photo-1486406146926-c627a92ad1ab\?q=80&w=2070&auto=format&fit=crop/g, lead.heroImg);
    html = html.replace(/https:\/\/images\.unsplash\.com\/photo-1600880292203-757bb62b4baf\?ixlib=rb-4\.0\.3&auto=format&fit=crop&w=1000&q=80/g, lead.sobreImg);

    html = html.replace(/<title>.*?<\/title>/gi, `<title>${lead.companyName} | Consultoria de Gestão & M&A</title>`);
    html = html.replace(/Nexus Partners \| Consultoria & M&A/gi, `${lead.companyName} | M&A`);

    const brandHtml = `${lead.brandName}<span class="text-[${lead.gold}]">${lead.subBrand}</span>`;
    html = html.replace(/NEXUS<span class="text-gold">PARTNERS<\/span>/g, brandHtml);

    html = html.replace(/Liderança em <br> <span class="text-gradient">Fusões e Aquisições<\/span>/gi, lead.headline);
    html = html.replace(/Liderança em <br> <span class="text-gradient">Fusões e Aquisições<\/span>/gi, lead.headline); 
    html = html.replace(/Assessoramos líderes corporativos e conselhos de administração em operações complexas, garantindo a maximização do valor para os acionistas\./gi, lead.subtitle);
    html = html.replace(/Assessoramos líderes corporativos e conselhos de administração em operações complexas, garantindo a maximização do valor para os acionistas\./gi, lead.subtitle);

    html = html.replace(/https:\/\/wa\.me\/5511999999999/g, `https://wa.me/${lead.whatsapp}`);
    html = html.replace(/\(11\) 99999-9999/g, lead.phone);
    html = html.replace(/contato@nexuspartners\.com\.br/g, lead.email);
    
    // === NOVAS SUBSTITUIÇÕES PERSONALIZADAS (SOBRE NÓS & STATS) ===
    const titleSobreTemplate = `Tradição & <span class="text-gold">Inovação</span>`;
    html = html.replace(titleSobreTemplate, lead.sobreTitle.replace(/\${lead.gold}/g, lead.gold));
    
    const textoSobre1Template = `Somos uma boutique de consultoria de gestão e M&A focada na geração de valor sustentável para empresas de alto crescimento.`;
    html = html.replace(textoSobre1Template, lead.sobreText1);
    
    const textoSobre2Template = `Atuamos lado a lado com fundadores, diretores e acionistas para reestruturar operações e conduzir transações estratégicas com máxima precisão.`;
    html = html.replace(textoSobre2Template, lead.sobreText2);
    
    const bullet1Template = `Foco exclusivo em resultados escaláveis.`;
    html = html.replace(bullet1Template, lead.sobreBullet1);
    
    const bullet2Template = `Confidencialidade e ética rigorosa.`;
    html = html.replace(bullet2Template, lead.sobreBullet2);
    
    const bullet3Template = `Rede de contactos global (Cross-border).`;
    html = html.replace(bullet3Template, lead.sobreBullet3);

    // Substituir as estatísticas (4 colunas)
    // Estatística 1
    html = html.replace(/R\$ 5B\+/g, lead.stat1V);
    html = html.replace(/Em Transações/gi, lead.stat1L);
    
    // Estatística 2
    html = html.replace(/120\+/g, lead.stat2V);
    html = html.replace(/Deals Fechados/gi, lead.stat2L);
    
    // Estatística 3
    html = html.replace(/<h3 class="text-4xl md:text-5xl font-heading text-gold font-bold mb-2">45<\/h3>/g, `<h3 class="text-4xl md:text-5xl font-heading text-[${lead.gold}] font-bold mb-2">${lead.stat3V}</h3>`);
    html = html.replace(/Especialistas/gi, lead.stat3L);
    
    // Estatística 4
    html = html.replace(/<h3 class="text-4xl md:text-5xl font-heading text-gold font-bold mb-2">12<\/h3>/g, `<h3 class="text-4xl md:text-5xl font-heading text-[${lead.gold}] font-bold mb-2">${lead.stat4V}</h3>`);
    html = html.replace(/Países Atendidos/gi, lead.stat4L);

    // Injeta a seção "Escom Dossier" modificada com as exigências: tarja de prazo, análise de projeto e link pro PDF correto.
    html = injectEscomDossierSection(html, lead);

    const localDir = path.join(process.cwd(), 'public', lead.siteId);
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    fs.writeFileSync(path.join(localDir, 'index.html'), html, 'utf8');
    console.log(`  📁 Arquivo salvo em public/${lead.siteId}/index.html`);

    const mainDir = path.join(process.cwd(), 'public', 'site-consultoria-ma');
    if (!fs.existsSync(mainDir)) fs.mkdirSync(mainDir, { recursive: true });
    fs.writeFileSync(path.join(mainDir, 'index.html'), html, 'utf8');

    const nowIso = new Date().toISOString();

    const proposalData = {
      clientName: lead.companyName,
      company: lead.companyName,
      niche: lead.niche,
      city: 'São Paulo, SP',
      phone: lead.phone,
      address: lead.address,
      createdAt: nowIso,
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pendente',
      budget: lead.budget,
      currency: 'BRL',
      siteUrl: `https://escom-studio.vercel.app/${lead.siteId}/index.html`,
      pdfUrl: lead.pdfUrl
    };

    const siteData = {
      projectId: lead.siteId,
      companyName: lead.companyName,
      niche: lead.niche,
      score: 96,
      status: 'approved',
      htmlContent: html,
      deployedUrl: `https://escom-studio.vercel.app/${lead.siteId}/index.html`,
      address: lead.address,
      phone: lead.phone,
      originalUrl: lead.email,
      updatedAt: Date.now()
    };

    await setDoc(doc(db, 'proposals', lead.proposalId), proposalData);
    await setDoc(doc(db, 'generated_sites', lead.siteId), siteData);

    if (lead.legacySiteId) {
      await setDoc(doc(db, 'generated_sites', lead.legacySiteId), siteData, { merge: true });
      await setDoc(doc(db, 'proposals', `proposta-escom-${lead.legacySiteId}`), proposalData, { merge: true });
    }

    console.log(`  ✅ Firestore atualizado para ${lead.proposalId} e ${lead.siteId}`);
  }

  console.log("\n🎉 CONCLUÍDO! Todos os 5 sites do Nicho 1 foram reconstruídos COM SUCESSO (Cores, Imagens, Textos Exclusivos e Stats)!");
}

rebuildAll().catch(console.error);
