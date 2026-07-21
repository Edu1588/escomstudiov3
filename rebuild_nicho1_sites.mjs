import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

// Carregar firebase config
const firebaseConfig = JSON.parse(fs.readFileSync(new URL('./firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

// Carregar o template oficial do Nicho 1 (Consultoria de Gestão e M&A)
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
    headline: 'Excelência em <br> <span class="text-gradient">Valuation & M&A</span>',
    subtitle: 'Assessoria financeira independente, avaliação de ativos complexos e condução completa de fusões e aquisições para empresas de alto valor.',
    niche: 'Consultoria de Gestão Empresarial e M&A',
    address: 'Av. Brigadeiro Faria Lima, 3477 - Itaim Bibi, São Paulo - SP',
    phone: '(11) 3078-4500',
    email: 'contato@brasilvaluation.com.br',
    whatsapp: '551130784500',
    budget: '990,00'
  },
  {
    proposalId: 'proposta-escom-nicho1-vsh-partners',
    siteId: 'site-nicho1-vsh-partners',
    legacySiteId: 'site-8059201761862313788',
    companyName: 'VSH Partners Advisory',
    brandName: 'VSH',
    subBrand: 'PARTNERS',
    headline: 'Liderança em <br> <span class="text-gradient">Fusões e Aquisições</span>',
    subtitle: 'Assessoramos líderes corporativos e conselhos de administração em operações complexas de Buy-Side, Sell-Side e Reestruturação Estratégica.',
    niche: 'Consultoria de Gestão Empresarial e M&A',
    address: 'Av. Cidade Jardim, 377 - Itaim Bibi, São Paulo - SP',
    phone: '(11) 3192-2970',
    email: 'contato@vshpartners.com.br',
    whatsapp: '551131922970',
    budget: '990,00'
  },
  {
    proposalId: 'proposta-escom-nicho1-apex-capital',
    siteId: 'site-nicho1-apex-capital',
    legacySiteId: 'site-6950489851106358295',
    companyName: 'Apex Capital Consultoria & M&A',
    brandName: 'APEX CAPITAL',
    subBrand: 'M&A',
    headline: 'Estratégia Corporativa & <br> <span class="text-gradient">Transações M&A</span>',
    subtitle: 'Transformamos desafios operacionais em vantagens competitivas com metodologias internacionais de valuation e estruturação de capital.',
    niche: 'Consultoria de Gestão Empresarial e M&A',
    address: 'Av. das Nações Unidas, 12551 - Brooklin, São Paulo - SP',
    phone: '(11) 5503-8200',
    email: 'contato@apexcapital.com.br',
    whatsapp: '551155038200',
    budget: '990,00'
  },
  {
    proposalId: 'proposta-escom-nicho1-valus-corporate',
    siteId: 'site-nicho1-valus-corporate',
    legacySiteId: 'site-12358757581808087772',
    companyName: 'Valus Corporate Advisory',
    brandName: 'VALUS',
    subBrand: 'CORPORATE',
    headline: 'Gestão Empresarial & <br> <span class="text-gradient">Governança M&A</span>',
    subtitle: 'Boutique executiva focada na geração de valor sustentável, preparação para Sell-side e otimização de EBITDA para médias e grandes empresas.',
    niche: 'Consultoria de Gestão Empresarial e M&A',
    address: 'Av. Paulista, 1842 - Bela Vista, São Paulo - SP',
    phone: '(11) 3289-9100',
    email: 'contato@valuscorporate.com.br',
    whatsapp: '551132899100',
    budget: '990,00'
  },
  {
    proposalId: 'proposta-escom-nicho1-fortis-partners',
    siteId: 'site-nicho1-fortis-partners',
    legacySiteId: 'site-2935962641878547175',
    companyName: 'Fortis Partners & M&A Consultants',
    brandName: 'FORTIS',
    subBrand: 'PARTNERS',
    headline: 'Maximização de Valor & <br> <span class="text-gradient">Estratégia M&A</span>',
    subtitle: 'Atuamos junto a fundadores, acionistas e fundos de Private Equity para conduzir transações estratégicas com confidencialidade e eficiência.',
    niche: 'Consultoria de Gestão Empresarial e M&A',
    address: 'Av. Pres. Juscelino Kubitschek, 1909 - Vila Nova Conceição, São Paulo - SP',
    phone: '(11) 4003-7520',
    email: 'contato@fortispartners.com.br',
    whatsapp: '551140037520',
    budget: '990,00'
  }
];

function injectEscomDossierSection(html, lead) {
  const proposalUrl = `https://escom-studio.vercel.app/${lead.proposalId}`;
  
  const escomSection = `
    <!-- ======================================================= -->
    <!-- BLOCO ESCOM STUDIO: DOSSIÊ ESTRATÉGICO & PROPOSTA REAL -->
    <!-- ======================================================= -->
    <section id="dossie" class="py-24 bg-darker relative z-30 border-t border-gold/20">
      <div class="max-w-7xl mx-auto px-6 text-center">
        <span class="inline-block bg-gold/10 text-gold text-xs font-bold px-4 py-1.5 rounded-full border border-gold/30 uppercase tracking-widest mb-6">Diagnóstico Digital Exclusivo</span>
        <h2 class="text-4xl md:text-5xl font-heading font-bold text-white mb-6">Dossiê Estratégico & <span class="text-gold">Análise de Mercado</span></h2>
        <p class="text-gray-300 max-w-2xl mx-auto mb-12 text-lg font-light leading-relaxed">
          Elaboramos um diagnóstico de mercado completo para <strong>${lead.companyName}</strong>, mapeando oportunidades de alta conversão e blindagem de marca no ambiente digital.
        </p>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
          <div class="glass p-6 rounded-xl border border-gold/20">
            <i class="ph ph-chart-line-up text-gold text-3xl mb-2"></i>
            <div class="text-3xl font-heading font-bold text-white">96/100</div>
            <div class="text-xs text-gray-400 uppercase tracking-wider mt-1">Score de Excelência</div>
          </div>
          <div class="glass p-6 rounded-xl border border-gold/20">
            <i class="ph ph-shield-check text-gold text-3xl mb-2"></i>
            <div class="text-3xl font-heading font-bold text-white">Confidencial</div>
            <div class="text-xs text-gray-400 uppercase tracking-wider mt-1">Auditoria de UX/UI</div>
          </div>
          <div class="glass p-6 rounded-xl border border-gold/20">
            <i class="ph ph-rocket-launch text-gold text-3xl mb-2"></i>
            <div class="text-3xl font-heading font-bold text-white">+340%</div>
            <div class="text-xs text-gray-400 uppercase tracking-wider mt-1">Potencial de Conversão</div>
          </div>
          <div class="glass p-6 rounded-xl border border-gold/20">
            <i class="ph ph-lock-key text-gold text-3xl mb-2"></i>
            <div class="text-3xl font-heading font-bold text-white">Acesso VIP</div>
            <div class="text-xs text-gray-400 uppercase tracking-wider mt-1">Validade de 3 Dias</div>
          </div>
        </div>

        <a href="${proposalUrl}" target="_blank" rel="noopener noreferrer" class="btn-shine inline-flex items-center gap-3 px-8 py-4 bg-gold text-dark font-bold uppercase tracking-wider rounded-lg hover:bg-white transition-all duration-300 shadow-[0_0_25px_rgba(212,175,55,0.4)] text-base">
          <i class="ph ph-file-pdf text-2xl"></i> Visualizar Dossiê Técnico Completo em PDF
        </a>
      </div>
    </section>

    <!-- BLOCO INVESTIMENTO E CONDIÇÕES -->
    <section id="investimento" class="py-24 bg-dark relative z-30 border-t border-white/5">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <span class="text-gold tracking-widest text-sm uppercase font-semibold">Proposta Comercial</span>
        <h2 class="text-4xl md:text-5xl font-heading font-bold mt-4 mb-12">Infraestrutura Digital de Alta Performance</h2>

        <div class="glass-card p-10 rounded-2xl border border-gold/30 max-w-xl mx-auto text-center relative overflow-hidden">
          <div class="absolute top-0 right-0 bg-gold text-dark font-bold text-xs uppercase px-4 py-1.5 rounded-bl-lg tracking-wider">Condição Especial</div>
          <p class="text-gray-400 text-xs uppercase tracking-widest mb-2">Taxa Única de Licenciamento & Setup</p>
          <div class="text-6xl font-heading font-bold text-gold mb-2">R$ 990,00</div>
          <p class="text-gray-300 text-sm mb-8">Pagamento único. Sem mensalidades ou taxas ocultas.</p>

          <ul class="text-left space-y-4 mb-10 text-gray-300 text-sm border-t border-b border-white/10 py-6">
            <li class="flex items-center gap-3"><i class="ph ph-check-circle text-gold text-xl"></i> Design Exclusivo Nicho M&A com GSAP e Lenis Scroll</li>
            <li class="flex items-center gap-3"><i class="ph ph-check-circle text-gold text-xl"></i> Código Ultrarrápido e Otimizado para SEO Corporativo</li>
            <li class="flex items-center gap-3"><i class="ph ph-check-circle text-gold text-xl"></i> Hospedagem SSL Dedicada Inclusa por 12 meses</li>
            <li class="flex items-center gap-3"><i class="ph ph-check-circle text-gold text-xl"></i> Canal Direto de Agendamento pelo WhatsApp</li>
            <li class="flex items-center gap-3"><i class="ph ph-check-circle text-gold text-xl"></i> Suporte e Ajustes com a Equipe ESCOM Studio</li>
          </ul>

          <a href="${proposalUrl}" target="_blank" class="btn-shine w-full block py-4 bg-gold text-dark font-bold uppercase tracking-wider rounded-lg hover:bg-white transition-all text-center">
            Aprovar Projeto & Iniciar Implementação
          </a>
        </div>
      </div>
    </section>
  `;

  return html.replace('<footer', `${escomSection}\n<footer`);
}

async function rebuildAll() {
  console.log("🚀 Iniciando Reconstrução de TODOS os 5 Sites do Nicho 1 (Consultoria de Gestão e M&A)...");

  for (const lead of nicho1Leads) {
    console.log(`\n--- Processando: ${lead.companyName} ---`);

    let html = baseTemplateHtml;

    html = html.replace(/<title>.*?<\/title>/gi, `<title>${lead.companyName} | Consultoria de Gestão & M&A</title>`);
    html = html.replace(/Nexus Partners \| Consultoria & M&A/gi, `${lead.companyName} | M&A`);

    const brandHtml = `${lead.brandName}<span class="text-gold">${lead.subBrand}</span>`;
    html = html.replace(/NEXUS<span class="text-gold">PARTNERS<\/span>/g, brandHtml);

    html = html.replace(/Liderança em <br> <span class="text-gradient">Fusões e Aquisições<\/span>/gi, lead.headline);
    html = html.replace(/Assessoramos líderes corporativos e conselhos de administração em operações complexas, garantindo a maximização do valor para os acionistas\./gi, lead.subtitle);

    html = html.replace(/https:\/\/wa\.me\/5511999999999/g, `https://wa.me/${lead.whatsapp}`);
    html = html.replace(/\(11\) 99999-9999/g, lead.phone);
    html = html.replace(/contato@nexuspartners\.com\.br/g, lead.email);

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
      city: 'São Paulo, SP',
      phone: lead.phone,
      address: lead.address,
      createdAt: nowIso,
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pendente',
      budget: lead.budget,
      currency: 'BRL',
      siteUrl: `https://escom-studio.vercel.app/${lead.siteId}/index.html`,
      pdfUrl: `https://escom-studio.vercel.app/site-consultoria-ma/dossie-consultoria-ma.pdf`
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

  console.log("\n🎉 CONCLUÍDO! Todos os 5 sites do Nicho 1 foram reconstruídos com base no template oficial de M&A!");
}

rebuildAll().catch(console.error);
