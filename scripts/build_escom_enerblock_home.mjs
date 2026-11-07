import fs from 'fs';

// 1. Read ESCOM SVG paths from public/escom.svg
const escomSvgRaw = fs.readFileSync('E:/ANTIGRAVITY/ESCOM_STUDIO/public/escom.svg', 'utf8');
const escomGroupMatch = escomSvgRaw.match(/<g>([\s\S]*?)<\/g>/);
const escomPaths = escomGroupMatch ? escomGroupMatch[1] : '';

// 2. Read original formatted HTML as base
let html = fs.readFileSync('E:/ANTIGRAVITY/ESCOM_STUDIO/scripts/enerblock_formatted.html', 'utf8').replace(/\n/g, ' ');

// Replace <html lang="en"...> and head metadata
html = html
  .replace('<html lang="en"', '<html lang="pt-BR"')
  .replace('<meta http-equiv="content-language" content="en-GB">', '<meta http-equiv="content-language" content="pt-BR">')
  .replace('<link rel="canonical" href="https://enerblock.net/en/">', '<link rel="canonical" href="https://escomstudio.com.br/">')
  .replace(/<title>Enerblock \| Next-Gen Buildings<\/title>/g, '<title>ESCOM Studio | Sistemas de Crescimento Digital</title>')
  .replace(
    /We industrialize construction by connecting architecture, engineering and production to eliminate uncertainty and ensure predictable execution\./g,
    'Transformamos presença digital em sistemas que geram crescimento. Criamos sites, marcas, automações, experiências com inteligência artificial e operações de tráfego pago.'
  )
  .replace(/content="Enerblock \| Next-Gen Buildings"/g, 'content="ESCOM Studio | Sistemas de Crescimento Digital"')
  .replace(/content="Enerblock"/g, 'content="ESCOM Studio"')
  .replace(/<script type="module">\(function\(e,n,r,t,m\)[\s\S]*?GTM-NWH7LRRC"\);<\/script>/, '');

// Replace Header & Menu Logotype SVGs (Enerblock Logotype -> ESCOM STUDIO Logotype)
const headerLogoSvgRegex = /<svg viewBox="0 0 99\.4657 20" aria-label="Enerblock Logotype">[\s\S]*?<\/svg>/g;
const escomHeaderLogoSvg = `<svg viewBox="0 0 2403 432" aria-label="ESCOM Studio Logotype">${escomPaths}</svg>`;
html = html.replace(headerLogoSvgRegex, escomHeaderLogoSvg);

// Replace Footer Giant Wordmark SVG (Enerblock Wordmark -> ESCOM STUDIO Wordmark)
const footerLogoSvgRegex = /<svg viewBox="0 0 1920 315\.20001" aria-label="Enerblock Wordmark">[\s\S]*?<\/svg>/g;
const escomFooterLogoSvg = `<svg viewBox="0 0 2403 432" aria-label="ESCOM Studio Wordmark">${escomPaths}</svg>`;
html = html.replace(footerLogoSvgRegex, escomFooterLogoSvg);

// Update Header Contact button
html = html
  .replace('href="/en/contact"> <div class="contact__trigger button button--full button--black"> <div class="button__text"> <span class="button__text--sp button__text--sp--1">Contact</span> <span class="button__text--sp button__text--sp--2">Contact</span>',
           'href="#diagnostico"> <div class="contact__trigger button button--full button--black"> <div class="button__text"> <span class="button__text--sp button__text--sp--1">Diagnóstico</span> <span class="button__text--sp button__text--sp--2">Diagnóstico</span>')
  .replace('<a-link class="header__logo__link" href="/en">', '<a-link class="header__logo__link" href="#page-content">');

// Update Menu Drawer (.page__menu)
const oldMenuMainRegex = /<div class="menu__main" data-lenis-prevent>[\s\S]*?<\/div> <\/div> <\/div> <\/div> <main id="page-content">/;
const newMenuMain = `<div class="menu__main" data-lenis-prevent> <div class="menu__main__inner"> <div class="menu__primary"> <ul class="main__menu"> <li class="main__menu__item title title--s w--600"> <a-link href="#metodo" class="menu__item__link ajax--link"> <span class="mask"><span>Método</span></span> </a-link> </li>
<li class="main__menu__item title title--s w--600 has__submenu"> <div class="menu__item__submenu"> <span class="mask"><span>O que fazemos</span></span> <div class="submenu__icon plus__icon"></div> </div> <ul>
<li class="main__menu__subitem title text--xl"><a-link class="menu__item__link ajax--link" href="#stack--01">01 // Sites & Experiências Digitais</a-link></li>
<li class="main__menu__subitem title text--xl"><a-link class="menu__item__link ajax--link" href="#stack--02">02 // Branding & Identidade</a-link></li>
<li class="main__menu__subitem title text--xl"><a-link class="menu__item__link ajax--link" href="#stack--03">03 // Automação & Sistemas IA</a-link></li>
<li class="main__menu__subitem title text--xl"><a-link class="menu__item__link ajax--link" href="#stack--04">04 // Criações com IA Autônoma</a-link></li>
<li class="main__menu__subitem title text--xl"><a-link class="menu__item__link ajax--link" href="#stack--05">05 // Tráfego Pago & Aquisição</a-link></li>
<li class="main__menu__subitem title text--xl"><a-link class="menu__item__link ajax--link" href="#stack--06">06 // Estratégia & Growth</a-link></li>
</ul> </li>
<li class="main__menu__item title title--s w--600"> <a-link href="#arquitetura" class="menu__item__link ajax--link"> <span class="mask"><span>Arquitetura</span></span> </a-link> </li>
<li class="main__menu__item title title--s w--600"> <a-link href="#projetos" class="menu__item__link ajax--link"> <span class="mask"><span>Projetos</span></span> </a-link> </li>
<li class="main__menu__item title title--s w--600"> <a-link href="#diagnostico" class="menu__item__link ajax--link"> <span class="mask"><span>Diagnóstico</span></span> </a-link> </li> </ul> </div> <div class="menu__secondary"> <div class="menu__secondary__column"> <ul class="secondary__menu">
<li class="secondary__menu__item text--m"> <a-link href="#pilares" class="menu__item__link ajax--link"> <span class="mask"><span>Dados que Decidem</span></span> </a-link> </li>
<li class="secondary__menu__item text--m"> <a-link href="#pilares" class="menu__item__link ajax--link"> <span class="mask"><span>Performance 100/100</span></span> </a-link> </li>
<li class="secondary__menu__item text--m"> <a-link href="#pilares" class="menu__item__link ajax--link"> <span class="mask"><span>Ecossistema Fechado</span></span> </a-link> </li>
<li class="secondary__menu__item text--m"> <a-link href="#jornada" class="menu__item__link ajax--link"> <span class="mask"><span>Jornada de Conversão</span></span> </a-link> </li>
</ul> </div> <div class="menu__secondary__column"> <ul class="secondary__menu">
<li class="secondary__menu__item text--m"> <a href="https://wa.me/5513981062787?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20ESCOM%20Studio%20e%20quero%20iniciar%20um%20diagn%C3%B3stico." class="menu__item__link" target="_blank" rel="noopener noreferrer"> <span class="mask"><span>WhatsApp Direto</span></span> </a> </li>
</ul> <div class="menu__langs"> <div class="lang--active text--m w--700"> <div class="menu__item__link"> <span class="mask"><span>PT</span></span> </div> </div> <div class="text--m">|</div> <div class="text--m"> <a class="menu__item__link" href="/en/"> <span class="mask"><span>EN</span></span> </a> </div> </div> </div> </div> </div> </div> </div> </div> <main id="page-content">`;

if (!oldMenuMainRegex.test(html)) {
  throw new Error('Could not match oldMenuMainRegex');
}
html = html.replace(oldMenuMainRegex, newMenuMain);

// 3. Section 1 & 2: Original ESCOM 3D Blueprint Hero (Crouching Robot + Butterfly + Blueprint Warehouse Background)
const oldHeroAndVideoRegex = /<section class="home__hero hero bg--orange">[\s\S]*?<\/section>\s*<section class="home__video bg--orange">[\s\S]*?<\/section>/;
const heroArrowSvg = `<svg class="button-arrow" viewBox="0 0 12 12"><path class="st0" d="M7.4,0.7l4,5.3l-4,5.3H5.5l1.9-2.5c0.8-1,1.3-1.8,1.7-2.2H0.5V5.3H9C8.6,4.7,8,4,7.4,3.1L5.5,0.7H7.4z"/></svg>`;
const newEscomBlueprintHero = `<section class="home__hero hero hero--white escom-blueprint-hero" id="topo" data-hero-tela>
  <div id="escom-hero-3d-stage" class="escom-hero-3d-stage" aria-hidden="true"></div>
  <div class="escom-hero-vignette" aria-hidden="true"></div>
  <div class="wrp escom-hero-wrp">
    <div class="escom-hero-topbar">
      <div class="escom-hero-eyebrow">
        <span class="escom-hero-dot"></span>
        <span>ESCOM STUDIO · DIGITAL GROWTH SYSTEMS</span>
      </div>
      <div class="escom-hero-telemetry">
        <span id="escom-hero-pct">BLUEPRINT // ONLINE</span>
      </div>
    </div>
    <div class="escom-hero-body">
      <h1 class="escom-hero-title title title--l w--600">Transformamos presença digital em sistemas que geram crescimento.</h1>
      <p class="escom-hero-subtitle text--xl">Criamos sites, marcas, automações, experiências com inteligência artificial e operações de tráfego pago para empresas que precisam atrair melhor, vender mais e operar com menos fricção.</p>
      <div class="escom-hero-actions">
        <a-link class="button__link" href="#diagnostico">
          <div class="button escom-btn-cyan">
            <div class="button__text">
              <span class="button__text--sp button__text--sp--1">Iniciar diagnóstico</span>
              <span class="button__text--sp button__text--sp--2">Iniciar diagnóstico</span>
            </div>
            <div class="button__icon">
              <div class="button__icon__inner button__icon__inner--1"><div class="button__arrow">${heroArrowSvg}</div></div>
              <div class="button__icon__inner button__icon__inner--2"><div class="button__arrow">${heroArrowSvg}</div></div>
            </div>
          </div>
        </a-link>
        <a-link class="button__link" href="#solucoes">
          <div class="button button--ghost-white escom-btn-ghost">
            <div class="button__text">
              <span class="button__text--sp button__text--sp--1">Explorar soluções</span>
              <span class="button__text--sp button__text--sp--2">Explorar soluções</span>
            </div>
            <div class="button__icon">
              <div class="button__icon__inner button__icon__inner--1"><div class="button__arrow">${heroArrowSvg}</div></div>
              <div class="button__icon__inner button__icon__inner--2"><div class="button__arrow">${heroArrowSvg}</div></div>
            </div>
          </div>
        </a-link>
      </div>
      <p class="escom-hero-hint text--s">Conte-nos onde você está e onde quer chegar. Identificamos as oportunidades mais importantes para o seu próximo ciclo.</p>
    </div>
    <div class="escom-hero-bottombar">
      <span>STRATEGY // DESIGN // CODE // AUTOMATION // AI // MEDIA</span>
      <a href="#metodo" class="escom-hero-scroll">ROLE PARA EXPLORAR ↓</a>
      <span>ESCOM STUDIO // SYS. 2026</span>
    </div>
  </div>
</section>`;

if (!oldHeroAndVideoRegex.test(html)) {
  throw new Error('Could not match oldHeroAndVideoRegex');
}
html = html.replace(oldHeroAndVideoRegex, newEscomBlueprintHero);

// 5. Section 3: Vision / Manifesto (#metodo)
const oldVisionRegex = /<section class="home__vision bg--grey-50">[\s\S]*?<\/section>/;
const newVisionSection = `<section class="home__vision bg--grey-50" id="metodo"> <div class="wrp"> <div class="grid__layout"> <div class="grid__column grid__column--half no-padding--right no-padding--left"> <div class="vision__image"> <cross-image> <div class="crossimg"> <picture class="image__picture "> <img src="https://cdn.sanity.io/images/unkmsg3i/production/1c96f23dffa6ce54c3a25fd0eaeb77b7fa2223af-1920x1920.jpg?w=1440&q=80&auto=format" sizes="(min-width: 681px) 50vw, 100vw" alt="Arquitetura de Sistemas ESCOM Studio" loading="lazy" fetchpriority="auto" decoding="async" class="fit--cover"> </picture> </div> <div class="cross"> <div class="line vertical-fixed"></div> <div class="line horizontal-fixed"></div> <div class="line vertical"></div> <div class="line horizontal"></div> <div class="number-right"></div> <div class="number-bottom"></div> <div class="cross-point"></div> </div> </cross-image> </div> </div> <div class="grid__column grid__column--half"> <div class="vision__main flex flex--column"> <div class="block__inner"> <div class="vision__header"> <div class="wrp"> <div class="section__title"> <line-text> <h2 class="title title--m line__container"> O crescimento não acontece em partes isoladas. A ESCOM organiza todo o sistema </h2> </line-text> </div> <div class="pt--xxlarge"> <div class="text__description text--xl"> Estratégia, design, código, automação e mídia operando juntos. </div> </div> </div> </div> </div> <div class="vision__blocks"> <div class="box box__0"> <div class="block__inner"> <div class="wrp"> <animated-title> <div class="c__header hide"> <span class="pretitle content">O Diagnóstico</span> <span class="c__square"></span> </div> </animated-title> <div class="pt--xlarge"> <div class="text__description text--l">Um site desconectado. Uma marca sem direção. Tráfego sem estratégia. Automação sem contexto. Muitas empresas investem em ferramentas e campanhas que não conversam entre si, gerando leads perdidos e uma presença digital que não acompanha a ambição do negócio.</div> <a-link class="button__link" href="#solucoes"> <div class="button internal button--ghost-black"> <div class="button__text"> <span class="button__text--sp button__text--sp--1">Explorar soluções</span> <span class="button__text--sp button__text--sp--2">Explorar soluções</span> </div> <div class="button__icon"> <div class="button__icon__inner button__icon__inner--1"> <div class="button__arrow"><svg class="button-arrow" viewBox="0 0 12 12"><path class="st0" d="M7.4,0.7l4,5.3l-4,5.3H5.5l1.9-2.5c0.8-1,1.3-1.8,1.7-2.2H0.5V5.3H9C8.6,4.7,8,4,7.4,3.1L5.5,0.7H7.4z"/></svg></div> </div> <div class="button__icon__inner button__icon__inner--2"> <div class="button__arrow"><svg class="button-arrow" viewBox="0 0 12 12"><path class="st0" d="M7.4,0.7l4,5.3l-4,5.3H5.5l1.9-2.5c0.8-1,1.3-1.8,1.7-2.2H0.5V5.3H9C8.6,4.7,8,4,7.4,3.1L5.5,0.7H7.4z"/></svg></div> </div> </div> </div> </a-link> </div> </div> </div> </div>
<div class="box box__1"> <div class="block__inner"> <div class="wrp"> <animated-title> <div class="c__header hide"> <span class="pretitle content">Engenharia Orientada a Negócio</span> <span class="c__square"></span> </div> </animated-title> <div class="pt--xlarge"> <div class="text__description text--l">Projetamos a estrutura técnica e visual a partir dos objetivos comerciais da empresa. Em vez de produzir entregáveis avulsos sem contexto, alinhamos marca, plataforma sub-segundo e automação para sustentar as metas reais de receita da sua operação.</div> <a-link class="button__link" href="#projetos"> <div class="button internal button--ghost-black"> <div class="button__text"> <span class="button__text--sp button__text--sp--1">Ver projetos</span> <span class="button__text--sp button__text--sp--2">Ver projetos</span> </div> <div class="button__icon"> <div class="button__icon__inner button__icon__inner--1"> <div class="button__arrow"><svg class="button-arrow" viewBox="0 0 12 12"><path class="st0" d="M7.4,0.7l4,5.3l-4,5.3H5.5l1.9-2.5c0.8-1,1.3-1.8,1.7-2.2H0.5V5.3H9C8.6,4.7,8,4,7.4,3.1L5.5,0.7H7.4z"/></svg></div> </div> <div class="button__icon__inner button__icon__inner--2"> <div class="button__arrow"><svg class="button-arrow" viewBox="0 0 12 12"><path class="st0" d="M7.4,0.7l4,5.3l-4,5.3H5.5l1.9-2.5c0.8-1,1.3-1.8,1.7-2.2H0.5V5.3H9C8.6,4.7,8,4,7.4,3.1L5.5,0.7H7.4z"/></svg></div> </div> </div> </div> </a-link> </div> </div> </div> </div> </div> </div> </div> </div> </div> </section>`;

if (!oldVisionRegex.test(html)) {
  throw new Error('Could not match oldVisionRegex');
}
html = html.replace(oldVisionRegex, newVisionSection);

// 6. Section 4: Schema 3D Scroll-Frames (#arquitetura)
html = html
  .replace('<section class="schema__section schema--home">', '<section class="schema__section schema--home" id="arquitetura">')
  .replace(
    'The industrialized component system that reduces risk and provides certainty',
    'Arquitetura digital integrada que elimina gargalos e multiplica a conversão'
  )
  .replace(
    'Integrates enclosures, structure, and processes within an industrialized and digital framework. It connects design, manufacturing, and assembly to reduce deviations in timelines, costs, and compliance, turning construction into a planned assembly process.',
    'Unimos posicionamento de marca, páginas em Next.js com nota 100/100 no Google PageSpeed, triagem por Inteligência Artificial e gestão de tráfego pago em um único ecossistema. Do clique no anúncio ao fechamento no CRM, cada etapa opera com precisão cirúrgica.'
  )
  .replace(
    '<span class="text--s">Standard floor plan and axonometrics</span> <span class="text--s">Drawing No.: 158.01.00</span> <span class="text--s">Scale: 1/100</span>',
    '<span class="text--s">Arquitetura de Funil & Ecossistema Digital</span> <span class="text--s">Core Web Vitals: 100/100 Lighthouse</span> <span class="text--s">Carregamento: 0.4s LCP · +240% ROI</span>'
  );

// 6B & 6C: Inserir seções da v5 após Seção 2 (#arquitetura): Métricas e Como Operamos (fundo claro)
const v5MetricasRaw = fs.readFileSync('E:/ANTIGRAVITY/ESCOM_STUDIO/scripts/v5_metricas.html', 'utf8')
  .replace('<section data-theme="light" data-page-builder-section="cardsSection"', '<section data-theme="light" data-page-builder-section="cardsSection" id="metricas-escom" style="background-color: #f4f4f4 !important; color: #141314 !important;"');

const v5ComoOperamosRaw = fs.readFileSync('E:/ANTIGRAVITY/ESCOM_STUDIO/scripts/v5_como_operamos.html', 'utf8')
  .replace('<section data-theme="light" data-page-builder-section="animatedListSection"', '<section data-theme="light" data-page-builder-section="animatedListSection" id="como-operamos" style="background-color: #f4f4f4 !important; color: #141314 !important;"');

const schemaEndRegex = /(<section class="schema__section schema--home" id="arquitetura">[\s\S]*?<\/section>)/;
if (!schemaEndRegex.test(html)) {
  throw new Error('Could not match schemaEndRegex');
}
html = html.replace(schemaEndRegex, `$1\n${v5MetricasRaw}\n${v5ComoOperamosRaw}`);

// 7. Section 5: Sticky Stack Solutions (#solucoes — "O que fazemos") — All 6 ESCOM Solutions with Custom 3D Cyan Blueprint Animations!
const arrowSvg = `<svg class="button-arrow" viewBox="0 0 12 12"><path class="st0" d="M7.4,0.7l4,5.3l-4,5.3H5.5l1.9-2.5c0.8-1,1.3-1.8,1.7-2.2H0.5V5.3H9C8.6,4.7,8,4,7.4,3.1L5.5,0.7H7.4z"/></svg>`;
const dashSvg = `<svg class="dash-icon" viewBox="0 0 8 14" aria-label="Dash icon"><path d="M2.304 13.05H0L5.04 0H7.344L2.304 13.05Z"/></svg>`;
const escomSymbolMiniSvg = `<svg viewBox="0 0 24 20" aria-label="ESCOM Symbol"><path d="M21.9993 14.0002L15.9996 20H1.9995V18.0005L3.99899 16.001H14.0351L17.9979 11.9935H21.9981V14.0002H21.9993ZM1.9995 8.00048H5.9997L9.9999 4.00024H19.9998L21.9993 2.00073V0H7.9992L1.9995 5.99976V7.99928V8.00048ZM24 4.00024H19.9998L15.9996 8.00048H5.9997L0 14.0002V15.9998H4.0002L8.0004 11.9995L18.0003 11.9959L24 5.99976V4.00024Z"/></svg>`;

const escomSolutions = [
  {
    order: '01',
    pretitle: 'Sites e Experiências Digitais',
    title: 'Plataformas e landing pages construídas para transformar atenção em oportunidade',
    desc: 'Um site lento ou confuso afasta clientes qualificados antes do primeiro contato. Desenvolvemos páginas em Next.js e React com carregamento instantâneo (100/100 no Lighthouse), copy persuasiva e navegação objetiva para conduzir o visitante direto à decisão de compra e reduzir o ciclo de fechamento.',
    cta: 'Construir minha presença digital',
    specCode: 'MOD // 01 · WEB ENGINE',
    specs: [
      'ARQUITETURA: NEXT.JS + REACT 3D',
      'LIGHTHOUSE GRADE: A (100/100)',
      'LCP: 0.4S · TBT: 0MS · CLS: 0.00'
    ]
  },
  {
    order: '02',
    pretitle: 'Branding e Identidade de Marca',
    title: 'Marcas com clareza estratégica e linguagem capaz de dominar a mente do comprador',
    desc: 'Sem diferenciação clara, sua empresa disputa contratos por preço. Estruturamos posicionamento, estratégia verbal, identidade visual e direção de arte como um único organismo para justificar tickets mais altos e atrair clientes corporativos mais qualificados.',
    cta: 'Estruturar minha marca',
    specCode: 'MOD // 02 · BRAND SYSTEM',
    specs: [
      'GEOMETRIA: PROPORÇÃO ÁUREA φ 1.618',
      'SISTEMA: PP NEUE CORP · TOKENS',
      'POSICIONAMENTO & DIREÇÃO DE ARTE'
    ]
  },
  {
    order: '03',
    pretitle: 'Automação e Sistemas Inteligentes',
    title: 'Atendimento em segundos e processos conectados à operação real 24/7',
    desc: 'Vendedores sobrecarregados ou demora de minutos no primeiro atendimento custam dezenas de vendas todos os meses. Criamos integrações diretas entre CRM, WhatsApp, webhooks e ERP que respondem leads em segundos, qualificam oportunidades e agendam reuniões 24 horas por dia.',
    cta: 'Automatizar minha operação',
    specCode: 'MOD // 03 · PIPELINE 24/7',
    specs: [
      'FLUXO: WHATSAPP → CRM → ERP',
      'SLA DE RESPOSTA: < 2 SEGUNDOS',
      'OPERAÇÃO CONTÍNUA: 24/7 ATIVA'
    ]
  },
  {
    order: '04',
    pretitle: 'Criações com Inteligência Artificial',
    title: 'Agentes autônomos de IA treinados nas regras do seu negócio',
    desc: 'Enquanto concorrentes usam IA apenas para textos básicos, construímos agentes autônomos e assistentes sob medida integrados ao seu fluxo comercial para realizar triagem avançada de orçamentos, recuperação automática de ligações perdidas e suporte técnico em tempo real.',
    cta: 'Explorar IA para meu negócio',
    specCode: 'MOD // 04 · AI NEURAL CORE',
    specs: [
      'MODELO: AGENTES AUTÔNOMOS IA',
      'TRIAGEM & SCORING PREDITIVO: 99%',
      'RECUPERAÇÃO DE CHAMADAS 24H'
    ]
  },
  {
    order: '05',
    pretitle: 'Tráfego Pago e Aquisição',
    title: 'Campanhas orientadas por dados, CAC e LTV para atrair demanda qualificada',
    desc: 'Investir em anúncios sem uma engenharia de funil e criativos de alto impacto é queimar orçamento. Operamos campanhas cirúrgicas em Google Ads, Meta Ads e TikTok Ads orientadas por retorno real, atraindo tomadores de decisão com demanda reprimida e poder de compra.',
    cta: 'Acelerar minha aquisição',
    specCode: 'MOD // 05 · GROWTH FUNNEL',
    specs: [
      'CANAIS: GOOGLE · META · TIKTOK ADS',
      'ROAS MÉDIO: +240% · CAC OTIMIZADO',
      'RASTREAMENTO PONTA A PONTA'
    ]
  },
  {
    order: '06',
    pretitle: 'Estratégia Digital e Crescimento',
    title: 'Um mapa executivo claro conectando marketing, tecnologia e vendas',
    desc: 'Ações isoladas consomem tempo e verba sem gerar escala. Mapeamos gargalos operacionais e traçamos o plano de ação exato integrando marca, canais de aquisição, páginas de conversão e CRM para sua empresa expandir com previsibilidade e margem de lucro saudável.',
    cta: 'Organizar meu próximo ciclo',
    specCode: 'MOD // 06 · MASTERPLAN 3D',
    specs: [
      'JORNADA: 01 PERCEBIDO → 05 LEMBRADO',
      'BI AO VIVO: LTV / CAC / PIPELINE',
      'SOBERANIA TÉCNICA: 100% SUA'
    ]
  }
];

const stackItemsHtml = escomSolutions.map(s => `
<div class="stack__item stack--${s.order}" data-order="${s.order}" id="stack--${s.order}"> <div class="wrp"> <div class="grid__layout"> <div class="grid__column stack__column stack__column--1"> <div class="block__inner"> <div class="stack__item__order panel--scroll"> <div class="pretitle">${s.order}</div> <div class="dash">${dashSvg}</div> </div> </div> </div> <div class="grid__column stack__column stack__column--2"> <div class="block__inner h--full"> <div class="wrp h--full"> <div class="stack__item__inner"> <div class="stack__item__header"> <div class="pretitle panel--scroll">${s.pretitle}</div> <div class="stack__title title title--s">${s.title}</div> </div> <div class="stack__item__info"> <div class="text__description text--l"> <p>${s.desc}</p> </div> <a-link class="button__link" href="#diagnostico"> <div class="button button--ghost-black"> <div class="button__text"> <span class="button__text--sp button__text--sp--1">${s.cta}</span> <span class="button__text--sp button__text--sp--2">${s.cta}</span> </div> <div class="button__icon"> <div class="button__icon__inner button__icon__inner--1"> <div class="button__arrow">${arrowSvg}</div> </div> <div class="button__icon__inner button__icon__inner--2"> <div class="button__arrow">${arrowSvg}</div> </div> </div> </div> </a-link> </div> </div> </div> </div> </div> <div class="grid__column grid__column--third stack__column stack__column--3"> <div class="block__inner"> <div class="stack__item__image"> <div class="escom-service-blueprint" data-service="${s.order}"> <div class="escom-blueprint-top"> <span>${s.specCode}</span> <span class="escom-blueprint-dot">● LIVE 3D</span> </div> <canvas></canvas> <div class="escom-blueprint-footer"> <div class="escom-blueprint-logo">${escomSymbolMiniSvg}</div> <div class="escom-blueprint-specs"> <span>${s.specs[0]}</span> <span>${s.specs[1]}</span> <span>${s.specs[2]}</span> </div> </div> </div> </div> </div> </div> </div> </div> </div>`).join('\n');

const oldStackRegex = /<section class="home__stack bg--grey-50">[\s\S]*?<\/section>/;
const newStackSection = `<section class="home__stack bg--grey-50" id="solucoes"> <div class="section__header"> <div class="wrp"> <div class="grid__layout"> <div class="grid__column grid__column--half"> <div class="block__inner"> <div class="pb--large"> <animated-title> <div class="c__header hide"> <span class="pretitle content">/02 O Sistema // O que fazemos</span> <span class="c__square"></span> </div> </animated-title> <div class="section__title"> <line-text> <h2 class="title title--m line__container">Tudo o que sua empresa precisa para ser percebida, encontrada e escolhida</h2> </line-text> </div> </div> </div> </div> <div class="grid__column grid__column--half no-padding--right cross-hair__column"> <cross-hair></cross-hair> </div> </div> </div> </div> <div class="stack__container">${stackItemsHtml}</div> <div class="separator"> <div class="grid__separator"> <div class="wrp"> <div class="grid__layout"> <div class="grid__column grid__column--fourth"></div> <div class="grid__column grid__column--three-fourths"></div> </div> </div> </div> </div> </section>`;

if (!oldStackRegex.test(html)) {
  throw new Error('Could not match oldStackRegex');
}
html = html.replace(oldStackRegex, newStackSection);

// 8. Section 6: Substituir projetos pelo Switcher Interativo da v5 + Inserir O Padrão ESCOM (fundo claro)
const v5ProjetosRaw = fs.readFileSync('E:/ANTIGRAVITY/ESCOM_STUDIO/scripts/v5_projetos.html', 'utf8');
const v5PadraoEscomRaw = fs.readFileSync('E:/ANTIGRAVITY/ESCOM_STUDIO/scripts/v5_padrao_escom.html', 'utf8')
  .replace('<section data-theme="light" data-page-builder-section="indexedGridSection"', '<section data-theme="light" data-page-builder-section="indexedGridSection" id="padrao-escom" style="background-color: #f4f4f4 !important; color: #141314 !important;"');

const oldCarouselRegex = /<section class="home__carousel bg--grey-50">[\s\S]*?<\/section>/;
if (!oldCarouselRegex.test(html)) {
  throw new Error('Could not match oldCarouselRegex');
}
html = html.replace(oldCarouselRegex, `${v5ProjetosRaw}\n${v5PadraoEscomRaw}`);

// 9. Section 7: Values / Pillars Accordion (#pilares)
const oldValuesRegex = /<section class="values__section values__section--home bg--grey-50 has--border">[\s\S]*?<\/section>/;
const newValuesSection = `<section class="values__section values__section--home bg--grey-50 has--border" id="pilares"> <div class="values__container"> <div class="wrp"> <div class="grid__layout"> <div class="grid__column grid__column--half"> <div class="pb--medium"> <div class="block__inner"> <animated-title> <div class="c__header hide"> <span class="pretitle content">Pilares do Sistema</span> <span class="c__square"></span> </div> </animated-title> <div class="section__title"> <line-text> <h3 class="title title--m line__container"> Garantias de engenharia que asseguram velocidade, rastreabilidade e conversão real </h3> </line-text> </div> </div> </div> </div> <div class="grid__column toggle__column grid__column--half no-padding--right">
<toggle-box class="toogle__box"> <div class="toggle__inner"> <div class="toggle__header"> <div class="title title--xs">Dados que Decidem & BI ao Vivo</div> <div class="toggle__icon plus__icon"></div> </div> <div class="toggle__content"> <div class="wrp"> <div class="block__inner"> <div class="toogle__content__inner"> <div class="toggle__text"> <div class="text__description text--m">Toda decisão começa em número. Antes de qualquer investimento em mídia ou código, mapeamos seu funil com dashboards ao vivo e BI que mostram exatamente onde está o seu ROI — LTV, CAC, conversão e pipeline comercial.</div> <a-link class="button__link" href="#diagnostico"> <div class="button internal button--ghost-black"> <div class="button__text"> <span class="button__text--sp button__text--sp--1">Mapear meu funil</span> <span class="button__text--sp button__text--sp--2">Mapear meu funil</span> </div> <div class="button__icon"> <div class="button__icon__inner button__icon__inner--1"> <div class="button__arrow">${arrowSvg}</div> </div> <div class="button__icon__inner button__icon__inner--2"> <div class="button__arrow">${arrowSvg}</div> </div> </div> </div> </a-link> </div> <div class="toggle__image"> <picture class="image__picture"> <img src="https://cdn.sanity.io/images/unkmsg3i/production/e751d80d7c6c52b042c94641aee5fac9894cc3ea-1920x1920.jpg?w=640&q=80&auto=format" alt="Dados e Rastreabilidade" loading="lazy" fetchpriority="auto" decoding="async" class="fit--cover"> </picture> </div> </div> </div> </div> </div> </div> </toggle-box>
<toggle-box class="toogle__box"> <div class="toggle__inner"> <div class="toggle__header"> <div class="title title--xs">Performance 100/100 (Core Web Vitals)</div> <div class="toggle__icon plus__icon"></div> </div> <div class="toggle__content"> <div class="wrp"> <div class="block__inner"> <div class="toogle__content__inner"> <div class="toggle__text"> <div class="text__description text--m">Código modular em Next.js, React, Node e Tailwind com carregamento sub-segundo (0.4s LCP). Eliminamos a lentidão de templates prontos e a colcha de retalhos de plugins que derrubam a conversão do seu tráfego pago.</div> <a-link class="button__link" href="#diagnostico"> <div class="button internal button--ghost-black"> <div class="button__text"> <span class="button__text--sp button__text--sp--1">Auditar meu site</span> <span class="button__text--sp button__text--sp--2">Auditar meu site</span> </div> <div class="button__icon"> <div class="button__icon__inner button__icon__inner--1"> <div class="button__arrow">${arrowSvg}</div> </div> <div class="button__icon__inner button__icon__inner--2"> <div class="button__arrow">${arrowSvg}</div> </div> </div> </div> </a-link> </div> <div class="toggle__image"> <picture class="image__picture"> <img src="https://cdn.sanity.io/images/unkmsg3i/production/2f7752e3da4a656b9719b75475bf6aff71bd5b5d-1920x1920.jpg?w=640&q=80&auto=format" alt="Performance 100/100" loading="lazy" fetchpriority="auto" decoding="async" class="fit--cover"> </picture> </div> </div> </div> </div> </div> </div> </toggle-box>
<toggle-box class="toogle__box"> <div class="toggle__inner"> <div class="toggle__header"> <div class="title title--xs">Ecossistema Fechado & Soberania</div> <div class="toggle__icon plus__icon"></div> </div> <div class="toggle__content"> <div class="wrp"> <div class="block__inner"> <div class="toogle__content__inner"> <div class="toggle__text"> <div class="text__description text--m">Tudo integrado: tráfego → site → lead → CRM → automação IA → venda → dashboard. Sem custos invisíveis de dezenas de SaaS desconectados e com entrega 100% proprietária do código-fonte e acessos para sua empresa.</div> <a-link class="button__link" href="#diagnostico"> <div class="button internal button--ghost-black"> <div class="button__text"> <span class="button__text--sp button__text--sp--1">Solicitar proposta</span> <span class="button__text--sp button__text--sp--2">Solicitar proposta</span> </div> <div class="button__icon"> <div class="button__icon__inner button__icon__inner--1"> <div class="button__arrow">${arrowSvg}</div> </div> <div class="button__icon__inner button__icon__inner--2"> <div class="button__arrow">${arrowSvg}</div> </div> </div> </div> </a-link> </div> <div class="toggle__image"> <picture class="image__picture"> <img src="https://cdn.sanity.io/images/unkmsg3i/production/bece36037ca59fa7d26f8c333dc95f75b093b060-1920x1920.jpg?w=640&q=80&auto=format" alt="Ecossistema Fechado" loading="lazy" fetchpriority="auto" decoding="async" class="fit--cover"> </picture> </div> </div> </div> </div> </div> </div> </toggle-box>
</div> </div> </div> </div> </section>`;

if (!oldValuesRegex.test(html)) {
  throw new Error('Could not match oldValuesRegex');
}
html = html.replace(oldValuesRegex, newValuesSection);

// 10. Section 8: Matrix Sections (#jornada & Sobre/Planos)
const oldMatrixRegex = /<section class="matrix__section matrix__section--home bg--grey-50 right">[\s\S]*?<\/main>/;
const newMatrixSections = `<section class="matrix__section matrix__section--home bg--grey-50 right" id="jornada"> <div class="matrix__container"> <div class="wrp"> <div class="grid__layout"> <div class="grid__column grid__column--half no-padding--right no-padding--left"> <div class="matrix__image"> <cross-image> <div class="crossimg"> <picture class="image__picture "> <img src="https://cdn.sanity.io/images/unkmsg3i/production/0f584adf6f566bc44ec6e12963cd27d45cc8ecfb-1920x2880.jpg?w=1440&q=80&auto=format" alt="Jornada Digital ESCOM Studio" loading="lazy" fetchpriority="auto" decoding="async" class="fit--cover"> </picture> </div> <div class="cross"> <div class="line vertical-fixed"></div> <div class="line horizontal-fixed"></div> <div class="line vertical"></div> <div class="line horizontal"></div> <div class="number-right"></div> <div class="number-bottom"></div> <div class="cross-point"></div> </div> </cross-image> </div> </div>
<div class="grid__column grid__column--half grid__column--sticky"> <div class="wrp"> <div class="block__inner"> <div class="pb--margin"> <div class="matrix__main"> <div class="section__title"> <line-text> <h2 class="title title--m line__container"> Da primeira percepção à próxima venda: construímos a jornada completa </h2> </line-text> </div> <div class="text__description text--l"> <p>Quem tem sistema é visto; quem não tem, some. Estruturamos as 5 etapas que transformam desconhecidos em clientes recorrentes: Ser Percebido com uma marca de alto valor, Ser Encontrado no Google e em buscas de IA (SEO/GEO), Ser Escolhido em uma página de alta conversão, Ser Atendido em segundos via agentes de IA no WhatsApp e Ser Lembrado através de dados e retenção.</p> </div> <a-link class="button__link" href="#diagnostico"> <div class="button internal button--ghost-black"> <div class="button__text"> <span class="button__text--sp button__text--sp--1">Quero ser encontrado</span> <span class="button__text--sp button__text--sp--2">Quero ser encontrado</span> </div> <div class="button__icon"> <div class="button__icon__inner button__icon__inner--1"> <div class="button__arrow">${arrowSvg}</div> </div> <div class="button__icon__inner button__icon__inner--2"> <div class="button__arrow">${arrowSvg}</div> </div> </div> </div> </a-link> </div> </div> </div> </div> </div> </div> </div> </div> </section>
<section class="matrix__section matrix__section--home bg--grey-50" id="sobre"> <div class="matrix__container"> <div class="wrp"> <div class="grid__layout"> <div class="grid__column grid__column--half grid__column--sticky"> <div class="block__inner"> <div class="pb--margin"> <div class="matrix__main"> <div class="section__title"> <line-text> <h2 class="title title--m line__container"> Construção sob medida e evolução contínua com IA 24h </h2> </line-text> </div> <div class="text__description text--l"> <p>Cada projeto na ESCOM Studio começa com a construção completa do seu ecossistema — site sob medida, textos persuasivos e Google Business estruturado. Depois, evolui com manutenção ativa, produção contínua de conteúdo SEO/GEO e agentes de IA respondendo visitantes no chat e recuperando ligações perdidas no WhatsApp em segundos.</p> </div> <a href="https://wa.me/5513981062787?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20ESCOM%20Studio%20e%20quero%20conhecer%20os%20planos%20de%20Constru%C3%A7%C3%A3o%20e%20IA%2024h." target="_blank" rel="noopener noreferrer" aria-label="Falar com a ESCOM no WhatsApp">
<div class="button button--ghost-black">
<div class="button__text">
<span class="button__text--sp button__text--sp--1">Falar com Especialista</span>
<span class="button__text--sp button__text--sp--2">Falar com Especialista</span>
</div>
<div class="button__icon">
<div class="button__icon__inner button__icon__inner--1"><div class="button__arrow">${arrowSvg}</div></div>
<div class="button__icon__inner button__icon__inner--2"><div class="button__arrow">${arrowSvg}</div></div>
</div>
</div>
</a> </div> </div> </div> </div>
<div class="grid__column grid__column--half no-padding--right"> <div class="matrix__image"> <cross-image> <div class="crossimg"> <picture class="image__picture "> <img src="/escom-hero.jpg" alt="ESCOM Studio — Estratégia, Design e Engenharia" loading="lazy" fetchpriority="auto" decoding="async" class="fit--cover"> </picture> </div> <div class="cross"> <div class="line vertical-fixed"></div> <div class="line horizontal-fixed"></div> <div class="line vertical"></div> <div class="line horizontal"></div> <div class="number-right"></div> <div class="number-bottom"></div> <div class="cross-point"></div> </div> </cross-image> </div> </div> </div> </div> </div> </section> </main>`;

if (!oldMatrixRegex.test(html)) {
  throw new Error('Could not match oldMatrixRegex');
}
html = html.replace(oldMatrixRegex, newMatrixSections);

// 11. Section 9: Prefooter 3D Scroll-Frames (#diagnostico)
html = html
  .replace('<section class="prefooter bg--orange">', '<section class="prefooter bg--orange" id="diagnostico">')
  .replace(
    'Tell us about your project and we will advise you on the fit, scope, and options of the Enerblock System®, as well as how to integrate it into your project and the most suitable level of industrialized components based on your design objectives, technical and regulatory requirements, and timelines.',
    'Conte-nos qual é o desafio, onde você está e onde quer chegar. Primeiro entendemos o contexto do seu negócio, avaliamos sua presença atual e identificamos os gargalos de aquisição e conversão. Depois apresentamos o plano de ação exato para o seu próximo ciclo de crescimento.'
  )
  .replace(
    'Build with an industrialized and digital system',
    'O que sua empresa precisa construir agora?'
  )
  .replace(
    '<a-link class="button__link " href="/en/contact"> <div class="button  button--ghost-white"> <div class="button__text"> <span class="button__text--sp button__text--sp--1">Contact</span> <span class="button__text--sp button__text--sp--2">Contact</span>',
    '<a-link class="button__link" href="https://wa.me/5513981062787?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20ESCOM%20Studio%20e%20quero%20iniciar%20um%20diagn%C3%B3stico."> <div class="button button--ghost-white"> <div class="button__text"> <span class="button__text--sp button__text--sp--1">Iniciar Diagnóstico no WhatsApp</span> <span class="button__text--sp button__text--sp--2">Iniciar Diagnóstico no WhatsApp</span>'
  );

// 12. Section 10: Footer
const oldFooterNavRegex = /<nav class="footer__container">[\s\S]*?<\/nav>/;
const newFooterNav = `<nav class="footer__container"> <div class="wrp"> <div class="grid__layout"> <div class="grid__column grid__column--third"> <div class="block__inner"> <animated-title> <div class="c__header hide"> <span class="pretitle content">ESCOM. 01 // NAVEGAÇÃO</span> <span class="c__square"></span> </div> </animated-title> <div class="pt--xlarge"> <ul class="footer__menu primary__menu--footer">
<li class="footer__menu__item text--l"> <a-link href="#metodo" class="menu__item__link link--underline ajax--link"> <span>O Método ESCOM</span> </a-link> </li>
<li class="footer__menu__item text--l"> <a-link href="#arquitetura" class="menu__item__link link--underline ajax--link"> <span>Arquitetura Digital 3D</span> </a-link> </li>
<li class="footer__menu__item text--l"> <a-link href="#projetos" class="menu__item__link link--underline ajax--link"> <span>Portfólio & Casos Reais</span> </a-link> </li>
<li class="footer__menu__item text--l"> <a-link href="#diagnostico" class="menu__item__link link--underline ajax--link"> <span>Iniciar Diagnóstico</span> </a-link> </li>
<li class="footer__menu__item text--l"> <a-link href="#stack--01" class="menu__item__link link--underline ajax--link"> <span>01 · Sites & Landing Pages</span> </a-link> </li>
<li class="footer__menu__item text--l"> <a-link href="#stack--02" class="menu__item__link link--underline ajax--link"> <span>02 · Branding & Identidade</span> </a-link> </li>
<li class="footer__menu__item text--l"> <a-link href="#stack--03" class="menu__item__link link--underline ajax--link"> <span>03 · Automação & CRM</span> </a-link> </li>
<li class="footer__menu__item text--l"> <a-link href="#stack--04" class="menu__item__link link--underline ajax--link"> <span>04 · Agentes de IA 24h</span> </a-link> </li>
</ul> </div> </div> </div> <div class="grid__column grid__column--third"> <div class="block__inner"> <animated-title> <div class="c__header hide"> <span class="pretitle content">ESCOM. 02 // PILARES</span> <span class="c__square"></span> </div> </animated-title> <div class="pt--xlarge"> <ul class="footer__menu secondary__menu--footer">
<li class="footer__menu__item text--l"> <a-link href="#pilares" class="menu__item__link link--underline ajax--link"> <span>Dados que Decidem & BI</span> </a-link> </li>
<li class="footer__menu__item text--l"> <a-link href="#pilares" class="menu__item__link link--underline ajax--link"> <span>Performance 100/100</span> </a-link> </li>
<li class="footer__menu__item text--l"> <a-link href="#pilares" class="menu__item__link link--underline ajax--link"> <span>Ecossistema Fechado</span> </a-link> </li>
<li class="footer__menu__item text--l"> <a-link href="#jornada" class="menu__item__link link--underline ajax--link"> <span>Jornada de Conversão</span> </a-link> </li>
<li class="footer__menu__item text--l"> <a-link href="#sobre" class="menu__item__link link--underline ajax--link"> <span>Planos Construção & IA</span> </a-link> </li>
</ul> </div> </div> </div> <div class="grid__column grid__column--third"> <div class="wrp__left block__inner"> <animated-title> <div class="c__header hide"> <span class="pretitle content">ESCOM. 03 // CONTATO</span> <span class="c__square"></span> </div> </animated-title> <div class="pt--xlarge"> <div class="footer__menu__column"> <ul class="footer__social">
<li class="footer__menu__item text--l"> <a href="https://wa.me/5513981062787?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20ESCOM%20Studio%20e%20quero%20iniciar%20um%20diagn%C3%B3stico." class="menu__item__link link--underline" target="_blank" rel="noopener noreferrer"> <span>WhatsApp Comercial</span> </a> </li>
<li class="footer__menu__item text--l"> <a href="https://www.instagram.com/escomstudio/" class="menu__item__link link--underline" target="_blank" rel="noopener noreferrer"> <span>Instagram</span> </a> </li>
</ul> <div class="menu__langs"> <div class="lang--active text--l w--700">PT</div> <div class="text--l">|</div> <div class="text--l"> <a class="menu__item__link link--underline" href="/en/">EN</a> </div> </div> <div></div> </div> </div> </div> </div> </div> </div> </nav>`;

if (!oldFooterNavRegex.test(html)) {
  throw new Error('Could not match oldFooterNavRegex');
}
html = html.replace(oldFooterNavRegex, newFooterNav);

// Update Subfooter
html = html
  .replace('©2026 ENERBLOCK', '©2026 ESCOM STUDIO · SÃO PAULO · ATENDIMENTO GLOBAL')
  .replace('href="/en/terms"> <span>Terms and conditions</span>', 'href="/termos_de_servico.html"> <span>Termos de Serviço</span>')
  .replace('href="/en/privacy-policy"> <span>Privacy policy</span>', 'href="/politica_de_privacidade.html"> <span>Política de Privacidade</span>')
  .replace(
    /Website by <a[\s\S]*?WKHS®<\/a>/,
    'Engenharia Digital por <a target="_blank" rel="noopener noreferrer" href="https://escomstudio.com.br" class="link--underline">ESCOM STUDIO®</a>'
  );

// Inject escom-hero-blueprint.js, escom-service-animations.js, escom-fio-pagina.js, and escom-v5-integrated.js before </body> with cache-buster
html = html
  .replace('</head>', '<link rel="stylesheet" href="/css/escom-v5-integrated.css?v=20261106">\n</head>')
  .replace('/_astro/approach.DTy03nMz.css', '/_astro/approach.DTy03nMz.css?v=20261106')
  .replace(
    '<script defer src="/js/swiper-slider.js">',
    '<script defer src="/js/swiper-slider.js"></script><script defer src="/js/escom-hero-blueprint.js?v=20261106"></script><script defer src="/js/escom-service-animations.js?v=20261106"></script><script defer src="/js/escom-fio-pagina.js?v=20261106"></script><script defer src="/js/escom-v5-integrated.js?v=20261106"></script>'
  );

// 13. Update CSS in approach.DTy03nMz.css to support 6 sticky stack items, .escom-service-blueprint & .escom-blueprint-hero styling
let css = fs.readFileSync('E:/ANTIGRAVITY/ESCOM_STUDIO/public/_astro/approach.DTy03nMz.css', 'utf8');
const nth5Rule = '.home__stack .stack__item:nth-of-type(5){top:calc(4 * (1.125rem + var(--grid-margin) * 2) + var(--header-height) - 1px)}';
const nth6Rule = '.home__stack .stack__item:nth-of-type(6){top:calc(5 * (1.125rem + var(--grid-margin) * 2) + var(--header-height) - 1px)}';
if (css.includes(nth5Rule) && !css.includes(nth6Rule)) {
  css = css.replace(nth5Rule, nth5Rule + nth6Rule);
}

const blueprintCssMarker = '/* ESCOM_BLUEPRINT_ANIM_CSS */';
const blueprintCss = `${blueprintCssMarker}
.escom-service-blueprint{position:relative;width:100%;height:100%;aspect-ratio:1/1.25;background:#0c0b10;border:1px solid rgba(0,229,255,.32);display:flex;flex-direction:column;justify-content:space-between;overflow:hidden;box-sizing:border-box}
.escom-service-blueprint canvas{position:absolute;inset:0;width:100%!important;height:100%!important;display:block;pointer-events:none}
.escom-blueprint-top{position:relative;z-index:2;display:flex;justify-content:space-between;align-items:center;padding:.65rem .85rem;border-bottom:1px solid rgba(0,229,255,.25);background:rgba(12,11,16,.82);font-size:.68rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#00E5FF;line-height:1.2}
.escom-blueprint-dot{color:#00E5FF;font-weight:700}
.escom-blueprint-footer{position:relative;z-index:2;display:grid;grid-template-columns:3.2rem 1fr;border-top:1px solid rgba(0,229,255,.35);background:rgba(12,11,16,.9)}
.escom-blueprint-logo{display:flex;align-items:center;justify-content:center;border-right:1px solid rgba(0,229,255,.35);padding:.5rem}
.escom-blueprint-logo svg{width:1.6rem;height:auto;fill:#00E5FF}
.escom-blueprint-specs{display:flex;flex-direction:column;font-size:.62rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#00E5FF;line-height:1.2}
.escom-blueprint-specs span{padding:.32rem .65rem;border-bottom:1px solid rgba(0,229,255,.2)}
.escom-blueprint-specs span:last-child{border-bottom:none}
/* ESCOM_HERO_BLUEPRINT_3D */
body{opacity:1!important;background:#030507!important}
.preload, .transition__layer{display:none!important;pointer-events:none!important}
.escom-blueprint-hero{position:relative;width:100%;height:100svh;min-height:680px;background:#030507!important;color:#f4f7f9;overflow:hidden;padding:0!important;border-bottom:1px solid rgba(0,229,255,.28)}
.escom-hero-3d-stage{position:absolute;inset:0;width:100%;height:100%;z-index:1}
.escom-hero-vignette{position:absolute;inset:0;z-index:5;pointer-events:none;background:radial-gradient(circle at 72% 52%,rgba(3,5,7,0) 0%,rgba(3,5,7,.35) 52%,rgba(3,5,7,.82) 100%),linear-gradient(90deg,rgba(3,5,7,.88) 0%,rgba(3,5,7,.62) 42%,rgba(3,5,7,.05) 72%,rgba(3,5,7,.35) 100%)}
.escom-hero-wrp{position:relative;z-index:20;height:100%;display:flex;flex-direction:column;justify-content:space-between;padding-top:calc(var(--header-height,4.5rem) + 1.5rem)!important;padding-bottom:1.75rem!important;pointer-events:none}
.escom-hero-topbar{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:0 var(--grid-margin,2rem);border-bottom:1px solid rgba(255,255,255,.12);padding-bottom:.9rem;font-size:.72rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#9fdcff}
.escom-hero-eyebrow{display:inline-flex;align-items:center;gap:.55rem}
.escom-hero-dot{width:.45rem;height:.45rem;background:#00E5FF;box-shadow:0 0 10px #00E5FF;display:inline-block}
.escom-hero-telemetry{font-family:monospace;color:#00E5FF;letter-spacing:.16em}
.escom-hero-body{max-width:44rem;padding:0 var(--grid-margin,2rem);margin:auto 0;pointer-events:auto}
.escom-hero-title{color:#ffffff!important;font-size:clamp(2.35rem,4.4vw,4.6rem)!important;line-height:1.02!important;letter-spacing:-.02em;text-shadow:0 4px 24px rgba(0,0,0,.75);margin:0}
.escom-hero-subtitle{color:rgba(235,243,248,.86)!important;font-size:clamp(1rem,1.25vw,1.22rem)!important;line-height:1.5!important;max-width:36rem;margin-top:1.35rem;text-shadow:0 2px 12px rgba(0,0,0,.8)}
.escom-hero-actions{display:flex;flex-wrap:wrap;align-items:center;gap:1rem;margin-top:2rem}
.escom-btn-cyan{background:#00E5FF!important;border-color:#00E5FF!important;color:#03080c!important}
.escom-btn-cyan .button__text--sp{color:#03080c!important;font-weight:700}
.escom-btn-cyan .button__icon{border-left-color:rgba(3,8,12,.2)!important}
.escom-btn-cyan .button__arrow svg path{fill:#03080c!important}
.escom-btn-ghost{background:rgba(3,8,12,.45)!important;backdrop-filter:blur(8px);border-color:rgba(255,255,255,.35)!important}
.escom-hero-hint{color:rgba(190,208,220,.72)!important;max-width:30rem;margin-top:1.25rem;line-height:1.45}
.escom-hero-bottombar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1rem;padding:.9rem var(--grid-margin,2rem) 0;border-top:1px solid rgba(255,255,255,.12);font-size:.68rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:rgba(210,228,238,.68);pointer-events:auto}
.escom-hero-scroll{color:#00E5FF;text-decoration:none;transition:opacity .2s}
.escom-hero-scroll:hover{opacity:.75}
@media(max-width:767px){
  .escom-hero-vignette{background:linear-gradient(180deg,rgba(3,5,7,.35) 0%,rgba(3,5,7,.15) 38%,rgba(3,5,7,.88) 72%,rgba(3,5,7,.96) 100%)}
  .escom-hero-body{margin-top:auto;margin-bottom:1rem}
  .escom-hero-title{font-size:clamp(1.85rem,7vw,2.6rem)!important}
  .escom-hero-bottombar span:last-child{display:none}
}
`;

if (css.includes(blueprintCssMarker)) {
  css = css.slice(0, css.indexOf(blueprintCssMarker)) + blueprintCss;
} else {
  css += '\n' + blueprintCss;
}

// 14. Copy scripts, styles and assets across all 3 workspaces
const animJs = fs.readFileSync('E:/ANTIGRAVITY/ESCOM_STUDIO/public/js/escom-service-animations.js', 'utf8');
const heroBpJs = fs.readFileSync('E:/ANTIGRAVITY/ESCOM_STUDIO/public/js/escom-hero-blueprint.js', 'utf8');
const fioPaginaJs = fs.readFileSync('E:/ANTIGRAVITY/ESCOM_STUDIO/public/js/escom-fio-pagina.js', 'utf8');
const v5IntegratedCss = fs.readFileSync('E:/ANTIGRAVITY/ESCOM_STUDIO/public/css/escom-v5-integrated.css', 'utf8');
const v5IntegratedJs = fs.readFileSync('E:/ANTIGRAVITY/ESCOM_STUDIO/public/js/escom-v5-integrated.js', 'utf8');

const roots = [
  'E:/ANTIGRAVITY/ESCOM_STUDIO/public',
  'E:/ANTIGRAVITY/EDU/ESCOM_STUDIO/public',
  'G:/Meu Drive/ARQUIVOS/ANTIGRAVITY/ESCOM_STUDIO/public'
];

for (const root of roots) {
  if (fs.existsSync(root)) {
    fs.writeFileSync(`${root}/index.html`, html, 'utf8');
    fs.writeFileSync(`${root}/en/index.html`, html, 'utf8');
    fs.writeFileSync(`${root}/enerblock/index.html`, html, 'utf8');
    if (fs.existsSync(`${root}/home-teste`)) {
      fs.writeFileSync(`${root}/home-teste/enerblock.html`, html, 'utf8');
    }
    fs.writeFileSync(`${root}/_astro/approach.DTy03nMz.css`, css, 'utf8');
    
    fs.mkdirSync(`${root}/css`, { recursive: true });
    fs.writeFileSync(`${root}/css/escom-v5-integrated.css`, v5IntegratedCss, 'utf8');

    if (fs.existsSync(`${root}/js`)) {
      fs.writeFileSync(`${root}/js/escom-service-animations.js`, animJs, 'utf8');
      fs.writeFileSync(`${root}/js/escom-hero-blueprint.js`, heroBpJs, 'utf8');
      fs.writeFileSync(`${root}/js/escom-fio-pagina.js`, fioPaginaJs, 'utf8');
      fs.writeFileSync(`${root}/js/escom-v5-integrated.js`, v5IntegratedJs, 'utf8');
    }
    console.log('Updated HTML, CSS, 3D Hero Blueprint, 3D Service Animations, and V5 Sections in:', root);
  }
}
