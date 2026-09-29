import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "PT" | "EN" | "ES";

export interface Translations {
  nav: {
    solutions: string;
    process: string;
    projects: string;
    about: string;
    insights: string;
    diagnosis: string;
    contactBtn: string;
    mobileBanner: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    hint: string;
    footerStatus: string;
  };
  manifesto: {
    eyebrow: string;
    title: string;
    text: string;
    highlight: string;
    tag: string;
  };
  servicesHeading: {
    eyebrow: string;
    title: string;
    description: string;
  };
  services: Array<{
    num: string;
    title: string;
    desc: string;
    whyNeed?: string;
    prospectFocus?: string;
    thumb?: string;
    items: string;
    cta: string;
  }>;
  method: {
    eyebrow: string;
    title: string;
    desc: string;
    tag: string;
    steps: string[];
  };
  journey: {
    eyebrow: string;
    title: string;
    items: Array<{
      num: string;
      title: string;
      desc: string;
      related: string;
    }>;
    footer: string;
  };
  processSection: {
    eyebrow: string;
    title: string;
    items: Array<{
      num: string;
      title: string;
      desc: string;
      output: string;
    }>;
  };
  aiSection: {
    eyebrow: string;
    title: string;
    desc: string;
    cta: string;
  };
  systemsSection: {
    eyebrow: string;
    title: string;
    items: string[];
  };
  plansSection: {
    eyebrow: string;
    title: string;
    plans: Array<{
      tag: string;
      title: string;
      items: string[];
      cta: string;
      featured?: boolean;
    }>;
  };
  about: {
    eyebrow: string;
    title: string;
    p1: string;
    p2: string;
    principles: string[];
  };
  insights: {
    eyebrow: string;
    title: string;
    desc: string;
    items: string[];
    footerQuote: string;
  };
  faqsSection: {
    eyebrow: string;
    title: string;
    faqs: Array<{ q: string; a: string }>;
  };
  diagnosis: {
    eyebrow: string;
    title: string;
    desc: string;
    whatsappBtn: string;
    formTitle: string;
    namePlaceholder: string;
    companyPlaceholder: string;
    emailPlaceholder: string;
    phonePlaceholder: string;
    msgPlaceholder: string;
    submitBtn: string;
    sla: string;
    successTitle: string;
    successDesc: string;
  };
  footer: {
    region: string;
    location: string;
    rights: string;
  };
}

const translations: Record<Language, Translations> = {
  PT: {
    nav: {
      solutions: "Soluções",
      process: "Como funciona",
      projects: "Projetos",
      about: "Sobre a ESCOM",
      insights: "Insights",
      diagnosis: "Iniciar diagnóstico",
      contactBtn: "CONTATO",
      mobileBanner: "Engenharia digital para empresas que querem operar na próxima fase do mercado.",
    },
    hero: {
      eyebrow: "ESCOM STUDIO · DIGITAL GROWTH SYSTEMS",
      title: "Transformamos presença digital em sistemas que geram crescimento.",
      subtitle:
        "Criamos sites, marcas, automações, experiências com inteligência artificial e operações de tráfego pago para empresas que precisam atrair melhor, vender mais e operar com menos fricção.",
      ctaPrimary: "Iniciar diagnóstico",
      ctaSecondary: "Explorar soluções",
      hint: "Conte-nos onde você está e onde quer chegar. Identificamos as oportunidades mais importantes para o seu próximo ciclo.",
      footerStatus: "Strategy // Design // Code // Automation // Media",
    },
    manifesto: {
      eyebrow: "O crescimento não acontece em partes isoladas",
      title:
        "Um site desconectado. Uma marca sem direção. Tráfego sem estratégia. Automação sem contexto.",
      text:
        "Muitas empresas investem em canais, ferramentas e campanhas que não conversam entre si. O resultado é uma operação difícil de medir, leads perdidos e uma presença digital que não acompanha a ambição do negócio.",
      highlight:
        "A ESCOM organiza as partes para que o sistema inteiro trabalhe a favor do crescimento.",
      tag: "SYSTEM ARCHITECTURE",
    },
    servicesHeading: {
      eyebrow: "Sistemas desenhados para gerar tração real",
      title: "Arquitetura completa para empresas em expansão.",
      description:
        "Cada solução funciona de forma autônoma ou integrada em um ecossistema digital contínuo.",
    },
    services: [
      {
        num: "01",
        title: "Sites e experiências digitais",
        desc: "Sites, landing pages e plataformas construídos para comunicar valor, facilitar decisões e transformar atenção em oportunidade.",
        whyNeed: "Um site genérico, lento ou com visual amador faz sua empresa perder contratos antes mesmo do primeiro contato. Desenvolvemos ecossistemas em Next.js com design suíço e 120fps que transmitem autoridade imediata, guiam o visitante direto para a decisão de compra e multiplicam a taxa de conversão do seu tráfego e indicações.",
        prospectFocus: "Transforme visitas em clientes pagantes com arquitetura projetada para fechar negócios, não apenas visitas.",
        thumb: "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/hero%20sections/animated%20(8).webp",
        items: "Arquitetura · UX/UI · Copy · Desenvolvimento · Analytics · SEO",
        cta: "Construir minha presença digital",
      },
      {
        num: "02",
        title: "Branding e identidade de marca",
        desc: "Marcas com clareza estratégica, presença consistente e uma linguagem capaz de ocupar espaço na mente do público certo.",
        whyNeed: "Sem diferenciação clara, seu negócio é forçado a disputar por preço. Estruturamos um posicionamento de alto valor percebido e linguagem visual sofisticada para sua empresa cobrar mais caro, atrair clientes de ticket superior e se consolidar como líder indiscutível no seu mercado.",
        prospectFocus: "Elimine a guerra de preços. Faça seu cliente entender imediatamente por que o seu serviço vale mais.",
        thumb: "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/hero%20sections/animated%20(38).webp",
        items: "Posicionamento · Estratégia verbal · Identidade · Direção de arte",
        cta: "Estruturar minha marca",
      },
      {
        num: "03",
        title: "Automação e sistemas inteligentes",
        desc: "Processos mais rápidos, atendimento organizado e menos trabalho manual por meio de automações conectadas à operação real.",
        whyNeed: "Vendedores sobrecarregados ou demora de minutos no primeiro atendimento custam dezenas de vendas todos os meses. Criamos integrações diretas entre CRM, WhatsApp e ERP que respondem leads em segundos, qualificam oportunidades e agendam reuniões 24 horas por dia.",
        prospectFocus: "Atendimento comercial instantâneo: zero perda de oportunidades e aceleração comprovada do ciclo de fechamento.",
        thumb: "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/animated%20(63).webp",
        items: "CRM · Integrações · Webhooks · Dashboards · Agentes de IA",
        cta: "Automatizar minha operação",
      },
      {
        num: "04",
        title: "Criações com inteligência artificial",
        desc: "Aplicações práticas de IA para acelerar comunicação, atendimento, produção, análise e tomada de decisão.",
        whyNeed: "Enquanto concorrentes usam IA apenas para gerar textos básicos, construímos agentes autônomos treinados na inteligência e nas regras do seu negócio para realizar triagem avançada de orçamentos, prospecção e rotinas complexas que antes demandavam dias.",
        prospectFocus: "Multiplique a capacidade produtiva da sua equipe comercial e responda demandas de clientes em tempo real.",
        items: "Agentes · Assistentes · Conteúdo · Protótipos · Soluções sob medida",
        cta: "Explorar IA para meu negócio",
      },
      {
        num: "05",
        title: "Tráfego pago e aquisição",
        desc: "Campanhas orientadas por objetivo, dados e aprendizado contínuo para atrair demanda qualificada.",
        whyNeed: "Investir em anúncios sem uma estratégia de funil e criativos de alto impacto é queimar orçamento. Criamos campanhas cirúrgicas em Meta Ads e Google Ads orientadas por CAC e LTV, atraindo tomadores de decisão com demanda reprimida e poder real de compra.",
        prospectFocus: "Fluxo constante, previsível e escalável de novos contatos qualificados na mesa dos seus consultores.",
        items: "Mídia · Criativos · Públicos · Funil · Remarketing · Otimização",
        cta: "Acelerar minha aquisição",
      },
      {
        num: "06",
        title: "Estratégia digital e crescimento",
        desc: "Um mapa claro para decidir o que construir e conectar marketing, tecnologia e vendas em uma operação sustentável.",
        whyNeed: "Ações isoladas e sem direção consomem tempo, verba e não geram escala. Mapeamos gargalos operacionais e traçamos o plano de ação exato integrando marca, canais, produto e funil para sua empresa expandir com previsibilidade e margem de lucro saudável.",
        prospectFocus: "Visão executiva clara de onde investir cada centavo para maximizar receita e dominar seu segmento.",
        items: "Diagnóstico · Pesquisa · Oferta · Jornada · Plano de ação",
        cta: "Organizar meu próximo ciclo",
      },
    ],
    method: {
      eyebrow: "Não somos uma fábrica de entregáveis",
      title: "Cada projeto começa pelo problema. E termina em uma estrutura que pode evoluir.",
      desc:
        "A ESCOM não começa perguntando qual peça você quer produzir. Começa entendendo o que precisa mudar no negócio. Combinamos pensamento estratégico, design, código, dados e automação para construir somente o que tem função no seu crescimento.",
      tag: "OPERATIONAL METHOD",
      steps: [
        "Estratégia antes da execução.",
        "Tecnologia com função.",
        "Design que orienta decisões.",
        "Operação conectada.",
        "Evolução contínua.",
      ],
    },
    journey: {
      eyebrow: "Da primeira percepção à próxima venda",
      title: "Construímos a jornada digital que transforma desconhecidos em oportunidades.",
      items: [
        {
          num: "01",
          title: "Ser percebido",
          desc: "Clareza, relevância e uma linguagem compatível com o valor que sua marca entrega.",
          related: "Branding, conteúdo, criativos e tráfego pago.",
        },
        {
          num: "02",
          title: "Ser encontrado",
          desc: "Estar presente nos momentos de busca, comparação e consideração do comprador.",
          related: "Search, SEO técnico, páginas focadas e canais de entrada.",
        },
        {
          num: "03",
          title: "Ser escolhido",
          desc: "A experiência remove dúvidas, constrói confiança e conduz para uma ação objetiva.",
          related: "Conversão, provas, ofertas e remarketing.",
        },
        {
          num: "04",
          title: "Ser atendido",
          desc: "Depois do contato, velocidade e organização também fazem parte da marca.",
          related: "CRM, automações, WhatsApp e agentes de IA.",
        },
        {
          num: "05",
          title: "Ser lembrado",
          desc: "Uma operação madura aprende com dados e cria novas oportunidades de relacionamento.",
          related: "Analytics, retenção e estratégia de crescimento.",
        },
      ],
      footer: "A jornada não termina no clique. É ali que a operação começa a provar seu valor.",
    },
    processSection: {
      eyebrow: "Como a ESCOM trabalha",
      title: "Um processo claro para transformar ambição em execução.",
      items: [
        {
          num: "01",
          title: "Diagnóstico e clareza",
          desc: "Mapeamos modelo de negócio, canais atuais, dados de aquisição e gargalos para definir prioridades reais.",
          output: "Mapa estratégico e priorização",
        },
        {
          num: "02",
          title: "Arquitetura e proposta",
          desc: "Desenhamos a solução ideal — seja um ecossistema completo ou uma peça cirúrgica de alta conversão.",
          output: "Escopo, prazos e métricas",
        },
        {
          num: "03",
          title: "Design e prototipagem",
          desc: "Criamos interfaces funcionais, identidade consistente e redação estratégica orientada a tomada de decisão.",
          output: "Protótipos navegáveis e assets",
        },
        {
          num: "04",
          title: "Engenharia e integração",
          desc: "Desenvolvemos com código moderno, performático e conectamos bancos de dados, APIs e automações.",
          output: "Sistemas em produção e testes",
        },
        {
          num: "05",
          title: "Tração e otimização",
          desc: "Acompanhamos métricas de conversão, dados de tráfego e comportamento do usuário para evoluir o sistema.",
          output: "Relatórios e melhorias contínuas",
        },
      ],
    },
    aiSection: {
      eyebrow: "Inteligência artificial aplicada",
      title: "Menos promessa abstrata. Mais inteligência integrada ao trabalho real.",
      desc:
        "A IA pode responder clientes, organizar informações, acelerar produção e apoiar equipes. Investigamos onde ela gera impacto real antes de escolher a tecnologia.",
      cta: "Descobrir onde a IA pode gerar valor",
    },
    systemsSection: {
      eyebrow: "Sistemas em movimento",
      title: "O que podemos construir para sua empresa.",
      items: [
        "Uma nova marca pronta para entrar no mercado",
        "Um site que transforma tráfego em reuniões",
        "Um fluxo que não deixa leads esperando",
        "Mídia conectada à operação comercial",
        "Um agente de IA para uma tarefa específica",
        "Um sistema que substitui tarefas dispersas",
      ],
    },
    plansSection: {
      eyebrow: "O que entregamos",
      title: "Cada projeto começa com construção. Depois, evolui com manutenção contínua.",
      plans: [
        {
          tag: "CONSTRUÇÃO",
          title: "Construção do Site",
          items: [
            "Site completo, sob medida",
            "Textos escritos para vender",
            "Suas fotos tratadas",
            "Google Business organizado",
            "No ar em poucos dias",
          ],
          cta: "Iniciar Diagnóstico",
        },
        {
          tag: "MANUTENÇÃO",
          title: "Manutenção Contínua",
          items: [
            "Perfil do Google em dia: posts, fotos, horários, respostas",
            "2 artigos novos por semana, do seu ramo e da sua cidade",
            "SEO, AEO e GEO contínuos",
            "Hospedagem, domínio e alterações de texto e foto",
            "Relatório mensal por e-mail: ligações, orçamentos, visualizações e publicações",
            "Suporte direto no WhatsApp",
          ],
          cta: "Iniciar Diagnóstico",
        },
        {
          tag: "MANUTENÇÃO + IA 24H",
          title: "Manutenção + Agente IA",
          items: [
            "Tudo da Manutenção",
            "Ligação perdida respondida por mensagem em segundos",
            "Chat com IA no site, respondendo visitante 24h",
          ],
          cta: "Iniciar Diagnóstico",
          featured: true,
        },
      ],
    },
    about: {
      eyebrow: "Sobre a ESCOM",
      title: "Somos uma equipe de estratégia, design e tecnologia para empresas em movimento.",
      p1: "A ESCOM nasceu da convicção de que presença digital precisa cumprir uma função clara dentro do negócio.",
      p2: "Pensamos na marca, desenhamos a experiência, escrevemos a mensagem, construímos a tecnologia, conectamos os dados e observamos o que acontece depois do lançamento.",
      principles: [
        "Clareza antes do ruído",
        "Estratégia antes da ferramenta",
        "Tecnologia a serviço do resultado",
        "Design com intenção",
        "Experimentos com responsabilidade",
        "Crescimento que pode ser melhorado",
      ],
    },
    insights: {
      eyebrow: "Para quem é",
      title: "Para empresas que já entenderam que o próximo estágio exige mais do que presença.",
      desc: "Empresas lançando, reposicionando ou acelerando uma operação — e prontas para transformar intenção em estrutura.",
      items: [
        "Lançar ou reconstruir um site",
        "Reposicionar uma marca",
        "Criar uma jornada de conversão",
        "Automatizar atendimento e vendas",
        "Aplicar IA em uma operação concreta",
        "Conectar marketing, tecnologia e vendas",
      ],
      footerQuote:
        "Se você procura apenas uma peça pelo menor preço, talvez não sejamos a melhor escolha. Se procura uma solução pensada para o contexto, podemos conversar.",
    },
    faqsSection: {
      eyebrow: "Perguntas frequentes",
      title: "Antes de começar.",
      faqs: [
        {
          q: "Como funciona o primeiro contato?",
          a: "Você compartilha informações sobre a empresa e o objetivo. Avaliamos o contexto e indicamos o melhor próximo passo.",
        },
        {
          q: "Vocês garantem resultados?",
          a: "Não prometemos resultados sem entender oferta, mercado, investimento e operação. Construímos uma estrutura clara, mensurável e preparada para evoluir.",
        },
        {
          q: "Quanto custa um projeto?",
          a: "O investimento depende do escopo, complexidade e nível de integração. Após o diagnóstico, apresentamos uma recomendação compatível com o objetivo.",
        },
      ],
    },
    diagnosis: {
      eyebrow: "O próximo sistema começa com uma conversa",
      title: "O que sua empresa precisa construir agora?",
      desc:
        "Conte-nos qual é o desafio, onde você quer chegar e o que já tentou. Primeiro entendemos o contexto. Depois indicamos o caminho.",
      whatsappBtn: "Falar com a ESCOM no WhatsApp",
      formTitle: "Vamos mapear sua próxima oportunidade.",
      namePlaceholder: "Nome",
      companyPlaceholder: "Empresa",
      emailPlaceholder: "E-mail profissional",
      phonePlaceholder: "WhatsApp (com DDD)",
      msgPlaceholder: "Qual é o momento do negócio e o objetivo que precisa ser resolvido?",
      submitBtn: "Enviar informações",
      sla: "Retorno em até 1 dia útil",
      successTitle: "Recebemos suas informações.",
      successDesc: "Abrimos o WhatsApp com o resumo do seu projeto e entraremos em contato rapidamente.",
    },
    footer: {
      region: "REGIÃO:",
      location: "São Paulo · Atendimento global",
      rights: "ESCOM Studio",
    },
  },
  EN: {
    nav: {
      solutions: "Solutions",
      process: "How it works",
      projects: "Work",
      about: "About ESCOM",
      insights: "Insights",
      diagnosis: "Start diagnosis",
      contactBtn: "CONTACT",
      mobileBanner: "Digital engineering for enterprises ready to operate in the next market phase.",
    },
    hero: {
      eyebrow: "ESCOM STUDIO · DIGITAL GROWTH SYSTEMS",
      title: "We transform digital presence into systems that drive real growth.",
      subtitle:
        "We build websites, brands, automations, AI experiences, and paid media operations for companies looking to attract better clients, sell more, and operate with zero friction.",
      ctaPrimary: "Start diagnosis",
      ctaSecondary: "Explore solutions",
      hint: "Tell us where you are and where you want to go. We identify the most impactful levers for your next cycle.",
      footerStatus: "Strategy // Design // Code // Automation // Media",
    },
    manifesto: {
      eyebrow: "Growth does not happen in isolated silos",
      title:
        "A disconnected website. A brand without direction. Traffic without strategy. Automation without context.",
      text:
        "Too many businesses invest in fragmented channels and tools that never talk to each other. The result is unmeasurable spend, lost leads, and a digital footprint that lags far behind the company's real ambition.",
      highlight:
        "ESCOM integrates every single piece so the entire system works cohesively for measurable growth.",
      tag: "SYSTEM ARCHITECTURE",
    },
    servicesHeading: {
      eyebrow: "Engineered systems for sustainable traction",
      title: "End-to-end digital architecture for expanding businesses.",
      description:
        "Every solution operates independently or seamlessly connected within a unified digital ecosystem.",
    },
    services: [
      {
        num: "01",
        title: "Websites & Digital Experiences",
        desc: "Websites, landing pages, and web apps engineered to communicate authority, streamline decisions, and convert traffic into revenue.",
        thumb: "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/hero%20sections/animated%20(8).webp",
        items: "Architecture · UI/UX · Copywriting · Development · Analytics · SEO",
        cta: "Build my digital presence",
      },
      {
        num: "02",
        title: "Brand Identity & Strategy",
        desc: "Brands built with sharp strategic positioning, cohesive visual systems, and a verbal voice that dominates the target market.",
        thumb: "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/hero%20sections/animated%20(38).webp",
        items: "Positioning · Verbal strategy · Visual identity · Art direction",
        cta: "Structure my brand",
      },
      {
        num: "03",
        title: "Intelligent Systems & Automation",
        desc: "Faster workflows, structured customer service, and zero manual toil through bespoke integrations tied to your actual business operations.",
        thumb: "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/animated%20(63).webp",
        items: "CRM · API Integrations · Webhooks · Live Dashboards · AI Agents",
        cta: "Automate my operations",
      },
      {
        num: "04",
        title: "Artificial Intelligence Integrations",
        desc: "Practical generative AI systems to accelerate customer acquisition, response times, content production, and executive decision-making.",
        items: "Autonomous Agents · AI Assistants · Custom Pipelines · Prototypes",
        cta: "Deploy AI in my business",
      },
      {
        num: "05",
        title: "Paid Media & Growth Acquisition",
        desc: "Performance-driven ad campaigns governed by hard data and continuous algorithmic learning to capture qualified pipeline.",
        items: "Meta Ads · Google Ads · Creatives · Funnels · Retargeting · CRO",
        cta: "Scale my acquisition",
      },
      {
        num: "06",
        title: "Digital Strategy & Growth Architecture",
        desc: "A concrete roadmap to prioritize technology investments and connect marketing, tech, and sales into a self-sustaining engine.",
        items: "Diagnosis · Market Research · Offer Architecture · Action Roadmap",
        cta: "Plan my next growth cycle",
      },
    ],
    method: {
      eyebrow: "We are not a feature-factory agency",
      title: "Every engagement starts at the root problem. And ends with infrastructure ready to scale.",
      desc:
        "ESCOM does not ask which graphic asset you want to produce. We diagnose what needs to change in your business engine. We merge strategic thinking, high-end design, clean code, telemetry, and automation to build only what drives growth.",
      tag: "OPERATIONAL METHOD",
      steps: [
        "Strategy before execution.",
        "Purpose-driven technology.",
        "Design that guides decisions.",
        "Interconnected operations.",
        "Continuous evolution.",
      ],
    },
    journey: {
      eyebrow: "From initial impression to the next sale",
      title: "We construct the digital journey that turns strangers into high-value opportunities.",
      items: [
        {
          num: "01",
          title: "Be Noticed",
          desc: "Clarity, authority, and language aligned with the true value your brand delivers.",
          related: "Branding, content, creative direction, and paid acquisition.",
        },
        {
          num: "02",
          title: "Be Discovered",
          desc: "Be prominently present during key moments of buyer research and comparison.",
          related: "Search, technical SEO, high-intent landing pages, and inbound channels.",
        },
        {
          num: "03",
          title: "Be Chosen",
          desc: "The digital experience eliminates friction, builds undeniable trust, and triggers action.",
          related: "Conversion optimization, social proof, offer design, and retargeting.",
        },
        {
          num: "04",
          title: "Be Served",
          desc: "Instant responsiveness and structured follow-up define your brand experience.",
          related: "CRM pipelines, instant automations, WhatsApp API, and AI agents.",
        },
        {
          num: "05",
          title: "Be Remembered",
          desc: "A mature operation harnesses data feedback to cultivate lifetime customer relationships.",
          related: "Analytics, retention loops, and sustainable growth strategy.",
        },
      ],
      footer: "The journey never ends at the click. That is where real business value begins.",
    },
    processSection: {
      eyebrow: "How ESCOM Operates",
      title: "A battle-tested process turning ambition into systematic execution.",
      items: [
        {
          num: "01",
          title: "Diagnosis & Strategic Clarity",
          desc: "We analyze your business model, customer touchpoints, unit economics, and bottlenecks to identify high-leverage opportunities.",
          output: "Strategic blueprint & priorities",
        },
        {
          num: "02",
          title: "System Architecture & Scope",
          desc: "We engineer the optimal architecture — whether an interconnected ecosystem or a surgical, high-conversion asset.",
          output: "Scope, milestones & KPIs",
        },
        {
          num: "03",
          title: "Design & High-Fidelity Prototyping",
          desc: "We craft seamless user interfaces, coherent brand languages, and persuasive copy engineered for decision-making.",
          output: "Interactive prototypes & design system",
        },
        {
          num: "04",
          title: "Modern Engineering & Integration",
          desc: "We develop with high-performance codebases, integrating databases, APIs, webhooks, and automation pipelines.",
          output: "Production deployments & QA tests",
        },
        {
          num: "05",
          title: "Traction & Continuous Optimization",
          desc: "We monitor telemetry, conversion rates, and behavioral patterns to iteratively refine and scale the system.",
          output: "Live reporting & iterative growth",
        },
      ],
    },
    aiSection: {
      eyebrow: "Applied Artificial Intelligence",
      title: "Less abstract hype. More practical intelligence deployed into daily operations.",
      desc:
        "AI can respond to prospective clients, synthesize complex data, accelerate production, and empower teams. We assess exactly where AI generates tangible ROI before writing a single line of integration code.",
      cta: "Discover where AI creates enterprise value",
    },
    systemsSection: {
      eyebrow: "Systems in Motion",
      title: "What we engineer for your organization.",
      items: [
        "A market-ready brand identity built for immediate authority",
        "A high-conversion web platform turning traffic into qualified meetings",
        "An automated pipeline ensuring zero inbound leads slip away",
        "Paid media campaigns strictly tied to commercial revenue",
        "An autonomous AI agent handling dedicated business workflows",
        "A unified system replacing scattered tools and spreadsheets",
      ],
    },
    plansSection: {
      eyebrow: "What We Deliver",
      title: "Every project starts with construction. Then it evolves with continuous maintenance.",
      plans: [
        {
          tag: "BUILD",
          title: "Website Construction",
          items: [
            "Custom-built, complete website",
            "Sales-driven copywriting",
            "Your photos professionally treated",
            "Google Business fully organized",
            "Live within days",
          ],
          cta: "Start Diagnosis",
        },
        {
          tag: "MAINTENANCE",
          title: "Ongoing Maintenance",
          items: [
            "Google profile up to date: posts, photos, hours, responses",
            "2 new articles per week, tailored to your industry and city",
            "Continuous SEO, AEO and GEO",
            "Hosting, domain, and text/photo updates",
            "Monthly email report: calls, quote requests, views, and publications",
            "Direct WhatsApp support",
          ],
          cta: "Start Diagnosis",
        },
        {
          tag: "MAINTENANCE + AI 24H",
          title: "Maintenance + AI Agent",
          items: [
            "Everything in Maintenance",
            "Missed calls answered by message in seconds",
            "AI chat on site, responding to visitors 24h",
          ],
          cta: "Start Diagnosis",
          featured: true,
        },
      ],
    },
    about: {
      eyebrow: "About ESCOM",
      title: "We are a multidisciplinary team combining strategy, design, and technology for forward-moving businesses.",
      p1: "ESCOM was founded on the conviction that a digital presence must serve a clear, measurable function inside a business.",
      p2: "We shape the brand, engineer the user journey, craft the message, build the code, unify data streams, and stay involved post-launch to ensure impact.",
      principles: [
        "Clarity over noise",
        "Strategy before tooling",
        "Technology in service of outcomes",
        "Design with rigorous intention",
        "High-responsibility experiments",
        "Continuous, measurable growth",
      ],
    },
    insights: {
      eyebrow: "Who We Work With",
      title: "For ambitious leaders who recognize that the next tier demands far more than basic digital presence.",
      desc: "Companies launching, repositioning, or scaling up operations — ready to transform ambition into resilient structure.",
      items: [
        "Launch or re-engineer a high-performance web platform",
        "Reposition a brand to command premium market pricing",
        "Construct an end-to-end customer conversion funnel",
        "Automate inbound sales and client communication",
        "Deploy practical AI into real-world business workflows",
        "Harmonize marketing, technology, and sales into one engine",
      ],
      footerQuote:
        "If you are seeking the cheapest disposable deliverable, we might not be the right partner. If you seek an engineered solution built for long-term leverage, let's talk.",
    },
    faqsSection: {
      eyebrow: "Frequently Asked Questions",
      title: "Before we begin.",
      faqs: [
        {
          q: "How does the initial consultation work?",
          a: "You share your business background, current challenges, and goals. We analyze your context and propose the most effective next step.",
        },
        {
          q: "Do you guarantee results?",
          a: "We never make unrealistic promises without deeply understanding your offer, market, and operations. What we guarantee is a transparent, data-driven system built to scale.",
        },
        {
          q: "How much does an engagement cost?",
          a: "Investment varies based on scope, technical complexity, and integrations. Following the diagnosis, we provide a structured proposal aligned with your goals.",
        },
      ],
    },
    diagnosis: {
      eyebrow: "The next system begins with a conversation",
      title: "What does your enterprise need to build right now?",
      desc:
        "Tell us about your challenge, your target metrics, and what you have attempted so far. First we understand the context. Then we chart the path.",
      whatsappBtn: "Chat with ESCOM on WhatsApp",
      formTitle: "Let's map out your next growth opportunity.",
      namePlaceholder: "Your name",
      companyPlaceholder: "Company",
      emailPlaceholder: "Work email",
      phonePlaceholder: "Phone / WhatsApp",
      msgPlaceholder: "What is your current business stage and the primary goal you need to achieve?",
      submitBtn: "Submit information",
      sla: "Response within 1 business day",
      successTitle: "Information received.",
      successDesc: "We have opened WhatsApp with your project brief and will get in touch shortly.",
    },
    footer: {
      region: "REGION:",
      location: "São Paulo · Global clients",
      rights: "ESCOM Studio",
    },
  },
  ES: {
    nav: {
      solutions: "Soluciones",
      process: "Cómo funciona",
      projects: "Proyectos",
      about: "Sobre ESCOM",
      insights: "Insights",
      diagnosis: "Iniciar diagnóstico",
      contactBtn: "CONTACTO",
      mobileBanner: "Ingeniería digital para empresas preparadas para operar en la próxima fase del mercado.",
    },
    hero: {
      eyebrow: "ESCOM STUDIO · DIGITAL GROWTH SYSTEMS",
      title: "Transformamos presencia digital en sistemas que generan crecimiento real.",
      subtitle:
        "Desarrollamos sitios web, marcas, automatizaciones, experiencias con inteligencia artificial y operaciones de tráfico pago para empresas que buscan captar mejor, vender más y operar sin fricción.",
      ctaPrimary: "Iniciar diagnóstico",
      ctaSecondary: "Explorar soluciones",
      hint: "Cuéntanos dónde estás y adónde deseas llegar. Identificamos las oportunidades más decisivas para tu próximo ciclo de crecimiento.",
      footerStatus: "Strategy // Design // Code // Automation // Media",
    },
    manifesto: {
      eyebrow: "El crecimiento no ocurre en piezas aisladas",
      title:
        "Un sitio web desconectado. Una marca sin rumbo. Tráfico sin estrategia. Automatización sin contexto.",
      text:
        "Demasiadas empresas invierten en canales, herramientas y campañas que jamás se comunican entre sí. El resultado son presupuestos ciegos, prospectos desatendidos y una presencia digital muy por detrás de la ambición de la compañía.",
      highlight:
        "ESCOM sincroniza cada parte para que el sistema completo trabaje en sinergia para el crecimiento.",
      tag: "SYSTEM ARCHITECTURE",
    },
    servicesHeading: {
      eyebrow: "Sistemas diseñados para generar tracción tangible",
      title: "Arquitectura integral para empresas en fase de expansión.",
      description:
        "Cada solución funciona de forma autónoma o interconectada en un ecosistema digital continuo.",
    },
    services: [
      {
        num: "01",
        title: "Sitios web y experiencias digitales",
        desc: "Sitios web, landing pages y plataformas diseñadas para comunicar autoridad, facilitar decisiones y convertir atención en clientes.",
        thumb: "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/hero%20sections/animated%20(8).webp",
        items: "Arquitectura · UI/UX · Copywriting · Desarrollo · Analytics · SEO",
        cta: "Construir mi presencia digital",
      },
      {
        num: "02",
        title: "Branding e identidad de marca",
        desc: "Marcas con posicionamiento estratégico, presencia coherente y un lenguaje diseñado para destacar en la mente de la audiencia correcta.",
        items: "Posicionamiento · Estrategia verbal · Identidad · Dirección de arte",
        thumb: "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/hero%20sections/animated%20(38).webp",
        cta: "Estructurar mi marca",
      },
      {
        num: "03",
        title: "Automatización y sistemas inteligentes",
        desc: "Procesos más ágiles, atención organizada y cero fricción manual mediante integraciones conectadas a la operativa real.",
        items: "CRM · Webhooks · Integraciones API · Dashboards · Agentes IA",
        thumb: "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/animated%20(63).webp",
        cta: "Automatizar mi operación",
      },
      {
        num: "04",
        title: "Integraciones de Inteligencia Artificial",
        desc: "Aplicaciones prácticas de IA generativa para acelerar la comunicación, atención al cliente, producción y toma de decisiones.",
        items: "Agentes a medida · Asistentes IA · Análisis de datos · Prototipos",
        cta: "Explorar IA para mi empresa",
      },
      {
        num: "05",
        title: "Tráfico pago y adquisición",
        desc: "Campañas publicitarias orientadas por datos y aprendizaje algorítmico continuo para atraer demanda altamente calificada.",
        items: "Meta Ads · Google Ads · Creativos · Embudos · Remarketing",
        cta: "Acelerar mi adquisición",
      },
      {
        num: "06",
        title: "Estrategia digital y crecimiento",
        desc: "Un mapa claro para priorizar inversiones tecnológicas y articular marketing, producto y ventas en un motor sostenible.",
        items: "Diagnóstico · Investigación de mercado · Arquitectura de oferta · Plan de acción",
        cta: "Planificar mi próximo ciclo",
      },
    ],
    method: {
      eyebrow: "No somos una fábrica de entregables",
      title: "Cada proyecto comienza en el problema raíz. Y culmina en una infraestructura lista para escalar.",
      desc:
        "ESCOM no empieza preguntando qué pieza gráfica necesitas. Analizamos qué necesita transformarse en el negocio. Combinamos pensamiento estratégico, diseño, código, analítica y automatización para construir únicamente lo que impulsa el crecimiento.",
      tag: "OPERATIONAL METHOD",
      steps: [
        "Estrategia antes de la ejecución.",
        "Tecnología con propósito.",
        "Diseño que orienta decisiones.",
        "Operación interconectada.",
        "Evolución continua.",
      ],
    },
    journey: {
      eyebrow: "De la primera impresión a la siguiente venta",
      title: "Diseñamos la ruta digital que convierte desconocidos en oportunidades de alto valor.",
      items: [
        {
          num: "01",
          title: "Ser Percibido",
          desc: "Claridad, relevancia y un lenguaje alineado con el verdadero valor que tu marca aporta.",
          related: "Branding, contenido, dirección creativa y pauta publicitaria.",
        },
        {
          num: "02",
          title: "Ser Encontrado",
          desc: "Presencia sólida en los momentos críticos de búsqueda, comparación y consideración del comprador.",
          related: "SEO técnico, landing pages de alta intención y canales de entrada.",
        },
        {
          num: "03",
          title: "Ser Elegido",
          desc: "La experiencia elimina dudas, genera certidumbre y motiva una decisión contundente.",
          related: "Optimización de conversión, pruebas de autoridad, ofertas y remarketing.",
        },
        {
          num: "04",
          title: "Ser Atendido",
          desc: "Inmediatez y procesos organizados que fortalecen la percepción de profesionalismo.",
          related: "CRM, flujos automatizados, API de WhatsApp y agentes inteligentes.",
        },
        {
          num: "05",
          title: "Ser Recordado",
          desc: "Una operación madura aprende de los datos para crear relaciones comerciales duraderas.",
          related: "Analítica avanzada, retención y estrategias continuas de crecimiento.",
        },
      ],
      footer: "El recorrido no termina en el clic. Allí es donde la operación demuestra su valor.",
    },
    processSection: {
      eyebrow: "Cómo trabaja ESCOM",
      title: "Un método riguroso para transformar visión estratégica en ejecución técnica.",
      items: [
        {
          num: "01",
          title: "Diagnóstico y claridad",
          desc: "Mapeamos el modelo comercial, los canales actuales, las métricas de captación y los cuellos de botella para priorizar impacto real.",
          output: "Mapa estratégico y prioridades",
        },
        {
          num: "02",
          title: "Arquitectura y alcance",
          desc: "Diseñamos la solución óptima — sea un ecosistema completo o una pieza quirúrgica de alta conversión.",
          output: "Alcance, cronograma y métricas clave",
        },
        {
          num: "03",
          title: "Diseño y prototipado",
          desc: "Diseñamos interfaces intuitivas, sistemas visuales consistentes y redacción orientada a la toma de acción.",
          output: "Prototipos navegables y sistema de diseño",
        },
        {
          num: "04",
          title: "Ingeniería e integración",
          desc: "Desarrollamos con código limpio y moderno, conectando bases de datos, APIs y flujos de automatización.",
          output: "Despliegues en producción y control de calidad",
        },
        {
          num: "05",
          title: "Tracción y optimización",
          desc: "Monitoreamos analítica, tasas de conversión y comportamiento de usuarios para evolucionar la plataforma.",
          output: "Informes en tiempo real y mejoras continuas",
        },
      ],
    },
    aiSection: {
      eyebrow: "Inteligencia artificial aplicada",
      title: "Menos promesas abstractas. Más inteligencia integrada al trabajo real.",
      desc:
        "La IA puede cualificar prospectos, organizar información compleja, acelerar la producción y empoderar a los equipos. Analizamos dónde genera un retorno medible antes de elegir la herramienta tecnológica.",
      cta: "Descubrir dónde la IA genera valor en tu negocio",
    },
    systemsSection: {
      eyebrow: "Sistemas en movimiento",
      title: "Lo que construimos para tu empresa.",
      items: [
        "Una nueva marca lista para liderar en el mercado",
        "Un sitio web que convierte tráfico en reuniones de negocio",
        "Un flujo que no deja prospectos esperando respuesta",
        "Campañas de medios conectadas directamente al equipo comercial",
        "Un agente de IA dedicado a optimizar un proceso crítico",
        "Un sistema integral que reemplaza herramientas dispersas",
      ],
    },
    plansSection: {
      eyebrow: "Lo que entregamos",
      title: "Cada proyecto comienza con construcción. Luego evoluciona con mantenimiento continuo.",
      plans: [
        {
          tag: "CONSTRUCCIÓN",
          title: "Construcción del Sitio Web",
          items: [
            "Sitio web completo y a medida",
            "Textos persuasivos para vender",
            "Tus fotos tratadas profesionalmente",
            "Google Business totalmente optimizado",
            "En línea en pocos días",
          ],
          cta: "Iniciar Diagnóstico",
        },
        {
          tag: "MANTENIMIENTO",
          title: "Mantenimiento Continuo",
          items: [
            "Perfil de Google al día: publicaciones, fotos, horarios, respuestas",
            "2 artículos nuevos por semana, de tu rubro y tu ciudad",
            "SEO, AEO y GEO continuos",
            "Alojamiento, dominio y modificaciones de texto y foto",
            "Reporte mensual por correo: llamadas, solicitudes de presupuesto, visitas y publicaciones",
            "Soporte directo por WhatsApp",
          ],
          cta: "Iniciar Diagnóstico",
        },
        {
          tag: "MANTENIMIENTO + IA 24H",
          title: "Mantenimiento + Agente de IA",
          items: [
            "Todo lo del Mantenimiento",
            "Llamada perdida respondida por mensaje en segundos",
            "Chat con IA en el sitio web, respondiendo visitantes 24h",
          ],
          cta: "Iniciar Diagnóstico",
          featured: true,
        },
      ],
    },
    about: {
      eyebrow: "Sobre ESCOM",
      title: "Somos un equipo de estrategia, diseño y tecnología para empresas en expansión.",
      p1: "ESCOM nació de la convicción de que la presencia digital debe cumplir una función financiera y operativa clara dentro del negocio.",
      p2: "Conceptualizamos la marca, diseñamos la experiencia, escribimos el mensaje, programamos la tecnología, integramos los datos y optimizamos tras el lanzamiento.",
      principles: [
        "Claridad antes del ruido",
        "Estrategia antes de la herramienta",
        "Tecnología al servicio de resultados",
        "Diseño con intención rigurosa",
        "Experimentación con responsabilidad",
        "Crecimiento continuamente medible",
      ],
    },
    insights: {
      eyebrow: "Para quién es",
      title: "Para empresas que comprenden que el próximo nivel exige más que una presencia básica.",
      desc: "Empresas lanzando, reposicionando o escalando operaciones — listas para convertir visión en una infraestructura sólida.",
      items: [
        "Lanzar o renovar un sitio web de alta conversión",
        "Reposicionar una marca hacia un segmento premium",
        "Diseñar un embudo completo de adquisición",
        "Automatizar atención al cliente y seguimiento de ventas",
        "Implementar IA en operaciones concretas del negocio",
        "Articular marketing, tecnología y ventas en un solo motor",
      ],
      footerQuote:
        "Si buscas el trabajo más barato del mercado, probablemente no seamos la opción adecuada. Si buscas una solución diseñada a la medida de tus objetivos de crecimiento, conversemos.",
    },
    faqsSection: {
      eyebrow: "Preguntas frecuentes",
      title: "Antes de comenzar.",
      faqs: [
        {
          q: "¿Cómo funciona el primer contacto?",
          a: "Nos compartes los datos de tu empresa y tus objetivos. Analizamos el contexto y definimos la ruta más conveniente.",
        },
        {
          q: "¿Garantizan resultados?",
          a: "No hacemos promesas vacías sin estudiar la oferta, el mercado y la operación. Garantizamos una infraestructura transparente, medible y preparada para escalar.",
        },
        {
          q: "¿Cuál es el costo de un proyecto?",
          a: "La inversión se define según el alcance, complejidad técnica e integraciones requeridas. Tras el diagnóstico, presentamos una propuesta ajustada al objetivo.",
        },
      ],
    },
    diagnosis: {
      eyebrow: "Tu próximo sistema comienza con una conversación",
      title: "¿Qué necesita construir tu empresa en este momento?",
      desc:
        "Cuéntanos tu desafío actual, tus metas y lo que has intentado. Primero comprendemos el contexto. Luego trazamos la ruta de acción.",
      whatsappBtn: "Hablar con ESCOM por WhatsApp",
      formTitle: "Mapeemos tu próxima oportunidad de crecimiento.",
      namePlaceholder: "Nombre completo",
      companyPlaceholder: "Empresa",
      emailPlaceholder: "Correo corporativo",
      phonePlaceholder: "Teléfono / WhatsApp",
      msgPlaceholder: "¿Cuál es la etapa de tu negocio y el objetivo clave que deseas resolver?",
      submitBtn: "Enviar información",
      sla: "Respuesta en menos de 24h hábiles",
      successTitle: "Información recibida.",
      successDesc: "Hemos abierto WhatsApp con el resumen de tu proyecto y nos pondremos en contacto rápidamente.",
    },
    footer: {
      region: "REGIÓN:",
      location: "São Paulo · Atención global",
      rights: "ESCOM Studio",
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "PT",
  setLanguage: () => {},
  t: translations.PT,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("escom_language");
      if (saved === "EN" || saved === "ES" || saved === "PT") {
        return saved;
      }
    }
    return "PT";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("escom_language", lang);
      window.dispatchEvent(new CustomEvent("escom-lang-changed", { detail: lang }));
    }
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
