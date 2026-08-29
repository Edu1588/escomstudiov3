// ESCOM Studio — Full DOM Deep Translation Engine (PT | EN | ES | CH)

export type SupportedLanguage = 'pt' | 'en' | 'es' | 'ch';

export const fullPhraseDictionary: Record<'en' | 'es' | 'ch', Record<string, string>> = {
  en: {
    // HUD & Badges
    "ESCOM / STUDIO // TELEMETRY LINK — LIVE": "ESCOM / STUDIO // TELEMETRY LINK — LIVE",
    "SYSTEM ONLINE": "SYSTEM ONLINE",
    "MARK LXXXV // ESCOM STUDIO // ONLINE": "MARK LXXXV // ESCOM STUDIO // ONLINE",
    "ONLINE": "ONLINE",
    "GROWTH ENGINE": "GROWTH ENGINE",
    "Funil & Automação": "Funnel & Automation",
    "EFICIÊNCIA DO FUNIL": "FUNNEL EFFICIENCY",
    "SEQ 001 / 109": "SEQ 001 / 109",
    "SCROLL": "SCROLL",
    "// ESCOM STUDIO • DIAGNOSTIC INTERFACE": "// ESCOM STUDIO • DIAGNOSTIC INTERFACE",
    "v2026": "v2026",

    // Sidebar
    "INÍCIO": "HOME",
    "PILARES": "PILLARS",
    "SOLUÇÕES": "SOLUTIONS",
    "PLANOS": "PLANS",
    "PROCESSO": "PROCESS",
    "RESULTADOS": "RESULTS",
    "FAQ": "FAQ",
    "CONTATO": "CONTACT",

    // Hero Section
    "Sistema de": "System of",
    "Crescimento": "Growth",
    "& Growth.": "& Scale.",
    "Nós operamos o crescimento completo da sua empresa: análise de dados, automação, mídia paga, branding e geração de leads qualificados.": "We operate the full growth of your company: data analysis, automation, paid media, high-end branding, and qualified lead generation.",
    "Sem atalhos. Sem SaaS. Sem custos invisíveis.": "No shortcuts. No SaaS lock-in. No hidden costs.",
    "ACENDER ÓTICA": "ACTIVATE OPTICS",

    // Section 03 - Pilares
    "PILARES DO SISTEMA DE CRESCIMENTO": "GROWTH SYSTEM PILLARS",
    "MOTOR DE": "ENGINE OF",
    "GROWTH INTEGRADO": "INTEGRATED GROWTH",
    "P PILAR 01": "PILLAR 01",
    "DADOS QUE DECIDEM": "DATA THAT DECIDES",
    "Toda decisão começa em número. Análise de dados, dashboards ao vivo e BI que mostram exatamente onde está o seu ROI — LTV, CAC, conversão, pipeline.": "Every decision begins with numbers. Data analysis, live dashboards, and BI showing exactly where your ROI is — LTV, CAC, conversion, pipeline.",
    "P PILAR 02": "PILLAR 02",
    "TRÁFEGO QUE CONVERTE": "TRAFFIC THAT CONVERTS",
    "Mídia paga em escala (Google, Meta, TikTok) com engenharia de conversão por trás de cada clique. Não trazemos visitantes: trazemos leads qualificados.": "Paid media at scale (Google, Meta, TikTok) with conversion engineering behind every click. We do not bring visitors: we deliver qualified leads.",
    "P PILAR 03": "PILLAR 03",
    "AUTOMAÇÃO INTELIGENTE": "INTELLIGENT AUTOMATION",
    "Leads triados por IA, disparos automáticos de WhatsApp e e-mail, integração com seu ERP e pagamentos. Sua equipe comercial só fala com quem está pronto para comprar.": "AI-screened leads, automated WhatsApp & email workflows, ERP & payment integrations. Your sales team only talks to decision-ready buyers.",
    "P PILAR 04": "PILLAR 04",
    "BRANDING QUE VENDE": "BRANDING THAT SELLS",
    "Identidade e posicionamento que constroem percepção de valor inquestionável. Marca forte reduz custo de aquisição e aumenta ticket médio.": "Identity and positioning that build unquestionable perceived value. A strong brand lowers acquisition costs and boosts average ticket value.",
    "P PILAR 05": "PILLAR 05",
    "ECOSSISTEMA FECHADO": "CLOSED ECOSYSTEM",
    "Tudo integrado: tráfego → site → lead → CRM → automação → venda → dashboard. Sem ferramentas desconexas, sem dados perdidos, sem custos invisíveis.": "Fully integrated: traffic → site → lead → CRM → automation → sales → dashboard. No disconnected tools, no lost data, no hidden expenses.",
    "AGENDAR DIAGNÓSTICO →": "BOOK DIAGNOSTIC →",
    "VER RESULTADOS": "VIEW RESULTS",
    "VER RESULTADOS →": "VIEW RESULTS →",

    // Section 04 - Marquee Strip
    "LANÇAR TRÁFEGO": "LAUNCH TRAFFIC",
    "ANALISAR DADOS": "ANALYZE DATA",
    "QUALIFICAR LEADS": "QUALIFY LEADS",
    "AUTOMATIZAR VENDAS": "AUTOMATE SALES",
    "GERAR RESULTADO": "DELIVER RESULTS",
    "CONVERTER": "CONVERT",

    // Section 05 - O QUE RESOLVEMOS
    "O QUE BEM FAZEMOS": "WHAT WE DELIVER BEST",
    "Geração de Leads Qualificados e Vendas Recorrentes com um Sistema Completo de Growth": "Qualified Lead Generation and Recurring Revenue with an Integrated Growth System",
    "Você não precisa de mais um site bonito. Você precisa de um sistema que traz visitas, qualifica leads e converte vendas — e de alguém que responda por esses três números: custo por lead, taxa de conversão e receita gerada.": "You don't need another generic website. You need an engineered system that attracts visits, qualifies leads, and converts sales with total accountability.",
    "Somos especialistas em Marketing Digital orientado a processo. Temos CERTEZA que encontraremos a melhor aplicação para a sua empresa porque trabalhamos com funil completo, e não com peças isoladas:": "We specialize in process-driven digital growth. We build end-to-end full-funnel systems tailored to your company's stage:",
    "Etapa do funil": "Funnel Stage",
    "O que operamos": "What We Operate",
    "Atração": "Attraction",
    "Mídia paga (Google, Meta, TikTok), SEO e conteúdo que traz o público certo": "Paid ads (Google, Meta, TikTok), SEO & strategic content targeting the ideal buyers",
    "Conversão": "Conversion",
    "Sites e landing pages com engenharia de conversão e copy persuasiva": "High-converting landing pages engineered with persuasive copywriting",
    "Qualificação": "Qualification",
    "Automação com IA, triagem de leads e scoring inteligente": "AI automation, instant lead screening, and predictive scoring",
    "Fechamento": "Closing",
    "CRM próprio, disparos automáticos de WhatsApp/e-mail e dashboards ao vivo": "Proprietary CRM, automated WhatsApp/email cadences, and live BI dashboards",
    "Decisão": "Decision",
    "Análise de dados contínua: LTV, CAC, ROI — para escalar o que funciona": "Continuous data analytics: LTV, CAC, and ROI to scale what drives profits",
    "Fale com um Especialista →": "Talk to a Growth Specialist →",

    // Section 06 - Capacidades / O Sistema
    "/02 O SISTEMA": "/02 THE SYSTEM",
    "O que fazemos.": "What we do.",
    "Seis disciplinas operando como um único ecossistema. Do primeiro clique do tráfego pago ao fechamento da venda no seu CRM — cada etapa é supervisada, integrada e mensurada.": "Six disciplines operating as a single ecosystem. From the first ad click to closed deal in your CRM — every stage supervised and measured.",
    "Análise de Dados & BI": "Data Analytics & BI",
    "Antes de qualquer investimento, entendemos o seu funil. Dashboards ao vivo, análise de LTV, CAC e ROI, e inteligência contínua que diz para onde ir. Sem dados, não criamos nada.": "Before any ad spend, we map your funnel. Live dashboards, LTV/CAC/ROI analytics, and real-time intelligence driving every strategic move.",
    "Branding & Identidade": "Branding & Identity",
    "Sistemas de marca imponentes que constroem percepção de valor inquestionável. Tipografia, arquitetura visual e tom de voz lapidados como um único organismo — porque marca forte barateia lead e eleva ticket.": "Imposing brand systems building unquestionable perceived value. Typography, visual language, and brand tone lowering acquisition costs and elevating ticket.",
    "Mídia Paga & Tráfego": "Paid Media & Traffic",
    "Gestão de campanhas em Google, Meta e TikTok com foco em ROAS. Não compramos cliques: compramos leads qualificados dentro do seu CAC alvo, com estrutura de teste A/B nativa.": "Performance ad management across Google, Meta, and TikTok. We do not buy clicks: we deliver decision-ready leads within your target CAC.",
    "Sites & Landing Pages": "High-Converting Websites & Pages",
    "Páginas com engenharia de conversão brutalista para tráfego pago em escala. Carregamento sub-segundo (100/100 no Lighthouse) e bounce-rate cirúrgico — porque tráfego pago desperdiçado é dinheiro queimado.": "Conversion-engineered landing pages built for scale. Sub-second loading speed (100/100 Lighthouse) and surgical bounce-rate optimization.",
    "Automação & CRM": "Sales Automation & CRM",
    "Leads triados por IA, disparos automáticos de WhatsApp e e-mail, integração com pagamentos e ERP. Sua operação de vendas rodando 24/7 enquanto você dorme.": "AI-triaged leads, automated WhatsApp & email sequences, payment & ERP integrations. Your sales operation running 24/7 automatically.",
    "Sistemas Web & E-commerce": "Web Systems & E-Commerce",
    "Intranets, portais de cliente, CRMs sob medida e lojas integradas a dashboard ao vivo. Saiba o que está sendo visto, adicionado ao carrinho e comprado — em tempo real.": "Bespoke portals, custom CRMs, and e-commerce integrated with live analytics. Full visibility into real-time purchases and cart conversions.",
    "Engenharia": "Engineering",
    "Código modular em Next.js, React, Node e Tailwind. Arquitetura técnica construída para escalar sem teto — porque growth sem infraestrutura sólida quebra na primeira escala.": "Modular architecture in Next.js, React, and Node. Built to scale without limits — because growth without solid engineering breaks.",

    // Section 07 - Custo Invisível
    "/03 O CUSTO INVISÍVEL": "/03 THE HIDDEN COST",
    "O maior custo não está na criação do site. Está na pilha desconectada.": "The biggest cost isn't building a website. It's paying for a disconnected software stack.",
    "Métrica": "Metric",
    "MODELO COMUM — Colcha de retalhos de assinaturas": "COMMON MODEL — Disconnected SaaS Subscriptions",
    "MODELO ESCOM — Um único sistema blindado": "ESCOM MODEL — A Single Unified Growth Architecture",
    "Ferramentas": "Tools",
    "CRM externo, plataforma de e-mail, builder de landing pages, gerenciador de anúncios, analytics, heatmap": "Separate CRM, email tool, landing page builder, ads manager, analytics, heatmap",
    "+ CRM integrado nativamente + Automações no backend + Dashboard ao vivo + Heatmap proprietário + Gestão de tráfego unificada ao funil": "+ Native integrated CRM + Backend automations + Live BI dashboard + Unified full-funnel media management",
    "Dados": "Data",
    "Dispersos em 6 painéis que não conversam": "Scattered across disconnected dashboards",
    "Centralizados: do clique da campanha à venda no dashboard": "Unified: from first ad click to revenue in your dashboard",
    "Custo médio anual": "Average Annual Cost",
    "R$ 9.600 — R$ 27.600 + taxas de agência de mídia separada": "$ 2,000 — $ 6,000+ per year in third-party SaaS fees",
    "Eficiência máxima. Pronto para operar.": "Maximum efficiency. Zero unnecessary SaaS fees.",
    "Quem responde pelo lead": "Lead Accountability",
    "Ninguém — cada fornecedor cuida da sua peça": "Nobody — fragmented vendors blame each other",
    "A ESCOM responde pela jornada completa: tráfego → lead → venda": "ESCOM takes full accountability: traffic → lead → sale",

    // Section 08 - Planos
    "// INVESTIMENTO TRANSPARENTE": "// TRANSPARENT INVESTMENT",
    "Planos & Investimento.": "Plans & Investment.",
    "Sistemas proprietários construídos sob medida. Sem mensalidades ocultas de SaaS terceirizados.": "Bespoke growth systems built for your business. Zero hidden recurring fees.",
    "LANDING PAGE": "LANDING PAGE",
    "a partir de": "starting at",
    "Para freelancers, prestadores de serviços e campanhas de tráfego pago com foco em conversão rápida.": "For service providers, consultants, and direct ad campaigns seeking rapid sales conversion.",
    "MAIS POPULAR": "MOST POPULAR",
    "SITE PROFISSIONAL": "PROFESSIONAL WEBSITE",
    "ECOSSISTEMA COMPLETO": "COMPLETE ECOSYSTEM",
    "ESCOLHER LANDING PAGE": "CHOOSE LANDING PAGE",
    "ESCOLHER SITE PROFISSIONAL": "CHOOSE PROFESSIONAL WEBSITE",
    "SOLICITAR PROPOSTA": "REQUEST CUSTOM PROPOSAL",
    "FALAR COM ESPECIALISTA": "TALK TO SPECIALIST"
  },
  es: {
    // HUD & Badges
    "ESCOM / STUDIO // TELEMETRY LINK — LIVE": "ESCOM / STUDIO // TELEMETRÍA — EN VIVO",
    "SYSTEM ONLINE": "SISTEMA ONLINE",
    "MARK LXXXV // ESCOM STUDIO // ONLINE": "MARK LXXXV // ESCOM STUDIO // ONLINE",
    "ONLINE": "ONLINE",
    "GROWTH ENGINE": "MOTOR DE CRECIMIENTO",
    "Funil & Automação": "Embudo y Automatización",
    "EFICIÊNCIA DO FUNIL": "EFICIENCIA DEL EMBUDO",
    "SEQ 001 / 109": "SEC 001 / 109",
    "SCROLL": "DESLIZAR",
    "// ESCOM STUDIO • DIAGNOSTIC INTERFACE": "// ESCOM STUDIO • INTERFAZ DE DIAGNÓSTICO",
    "v2026": "v2026",

    // Sidebar
    "INÍCIO": "INICIO",
    "PILARES": "PILARES",
    "SOLUÇÕES": "SOLUCIONES",
    "PLANOS": "PLANES",
    "PROCESSO": "PROCESO",
    "RESULTADOS": "RESULTADOS",
    "FAQ": "FAQ",
    "CONTATO": "CONTACTO",

    // Hero Section
    "Sistema de": "Sistema de",
    "Crescimento": "Crecimiento",
    "& Growth.": "& Escala.",
    "Nós operamos o crescimento completo da sua empresa: análise de dados, automação, mídia paga, branding e geração de leads qualificados.": "Operamos el crecimiento completo de su empresa: análisis de datos, automatización, medios pagos, branding y generación de leads cualificados.",
    "Sem atalhos. Sem SaaS. Sem custos invisíveis.": "Sin atajos. Sin SaaS. Sin costos ocultos.",
    "ACENDER ÓTICA": "ENCENDER ÓPTICA",

    // Section 03 - Pilares
    "PILARES DO SISTEMA DE CRESCIMENTO": "PILARES DEL SISTEMA DE CRECIMIENTO",
    "MOTOR DE": "MOTOR DE",
    "GROWTH INTEGRADO": "CRECIMIENTO INTEGRADO",
    "P PILAR 01": "PILAR 01",
    "DADOS QUE DECIDEM": "DATOS QUE DECIDEN",
    "Toda decisão começa em número. Análise de dados, dashboards ao vivo e BI que mostram exatamente onde está o seu ROI — LTV, CAC, conversão, pipeline.": "Toda decisión comienza con números. Análisis de datos, dashboards en vivo y BI que muestran exactamente su ROI — LTV, CAC, conversión y pipeline.",
    "P PILAR 02": "PILAR 02",
    "TRÁFEGO QUE CONVERTE": "TRÁFICO QUE CONVIERTE",
    "Mídia paga em escala (Google, Meta, TikTok) com engenharia de conversão por trás de cada clique. Não trazemos visitantes: trazemos leads qualificados.": "Medios pagos a escala (Google, Meta, TikTok) con ingeniería de conversión en cada clic. No traemos visitas: traemos leads cualificados.",
    "P PILAR 03": "PILAR 03",
    "AUTOMAÇÃO INTELIGENTE": "AUTOMATIZACIÓN INTELIGENTE",
    "Leads triados por IA, disparos automáticos de WhatsApp e e-mail, integração com seu ERP e pagamentos. Sua equipe comercial só fala com quem está pronto para comprar.": "Leads filtrados con IA, envíos automáticos de WhatsApp y correo, integración con su ERP y pagos. Su equipo comercial solo habla con listos para comprar.",
    "P PILAR 04": "PILAR 04",
    "BRANDING QUE VENDE": "BRANDING QUE VENDE",
    "Identidade e posicionamento que constroem percepção de valor inquestionável. Marca forte reduz custo de aquisição e aumenta ticket médio.": "Identidad y posicionamiento que construyen una percepción de valor incuestionable. Una marca sólida reduce el CAC y eleva el ticket promedio.",
    "P PILAR 05": "PILAR 05",
    "ECOSSISTEMA FECHADO": "ECOSISTEMA INTEGRADO",
    "Tudo integrado: tráfego → site → lead → CRM → automação → venda → dashboard. Sem ferramentas desconexas, sem dados perdidos, sem custos invisíveis.": "Todo integrado: tráfico → web → lead → CRM → automatización → venta → dashboard. Sin herramientas sueltas ni costos ocultos.",
    "AGENDAR DIAGNÓSTICO →": "AGENDAR DIAGNÓSTICO →",
    "VER RESULTADOS": "VER RESULTADOS",
    "VER RESULTADOS →": "VER RESULTADOS →",

    // Section 04 - Marquee Strip
    "LANÇAR TRÁFEGO": "LANZAR TRÁFICO",
    "ANALISAR DADOS": "ANALIZAR DATOS",
    "QUALIFICAR LEADS": "CALIFICAR LEADS",
    "AUTOMATIZAR VENDAS": "AUTOMATIZAR VENTAS",
    "GERAR RESULTADO": "GENERAR RESULTADOS",
    "CONVERTER": "CONVERTIR",

    // Section 05 - O QUE RESOLVEMOS
    "O QUE BEM FAZEMOS": "LO QUE MEJOR HACEMOS",
    "Geração de Leads Qualificados e Vendas Recorrentes com um Sistema Completo de Growth": "Generación de Leads Cualificados y Ventas Recurrentes con un Sistema Completo de Crecimiento",
    "Fale com um Especialista →": "Hablar con un Especialista →",

    // Section 06 - Capacidades
    "/02 O SISTEMA": "/02 EL SISTEMA",
    "O que fazemos.": "Lo que hacemos.",
    "Seis disciplinas operando como um único ecossistema. Do primeiro clique do tráfego pago ao fechamento da venda no seu CRM — cada etapa é supervisada, integrada e mensurada.": "Seis disciplinas operando como un único ecosistema. Desde el primer clic publicitario hasta el cierre de venta en su CRM.",
    "Análise de Dados & BI": "Análisis de Datos y BI",
    "Branding & Identidade": "Branding e Identidad",
    "Mídia Paga & Tráfego": "Medios Pagos y Tráfico",
    "Sites & Landing Pages": "Sitios Web y Landing Pages",
    "Automação & CRM": "Automatización y CRM",
    "Sistemas Web & E-commerce": "Sistemas Web y Comercio Electrónico",
    "Engenharia": "Ingeniería",

    // Section 08 - Planos
    "// INVESTIMENTO TRANSPARENTE": "// INVERSIÓN TRANSPARENTE",
    "Planos & Investimento.": "Planes e Inversión.",
    "a partir de": "a partir de",
    "ESCOLHER LANDING PAGE": "ELEGIR LANDING PAGE",
    "ESCOLHER SITE PROFISSIONAL": "ELEGIR SITIO PROFESIONAL",
    "SOLICITAR PROPOSTA": "SOLICITAR PROPUESTA",
    "MAIS POPULAR": "MÁS POPULAR"
  },
  ch: {
    // HUD & Badges
    "ESCOM / STUDIO // TELEMETRY LINK — LIVE": "ESCOM / 工作室 // 实时数据监控",
    "SYSTEM ONLINE": "系统在线",
    "MARK LXXXV // ESCOM STUDIO // ONLINE": "MARK LXXXV // ESCOM 工作室 // 运行中",
    "ONLINE": "运行中",
    "GROWTH ENGINE": "商业增长引擎",
    "Funil & Automação": "转化漏斗与自动化",
    "EFICIÊNCIA DO FUNIL": "漏斗转化效率",
    "SEQ 001 / 109": "序号 001 / 109",
    "SCROLL": "向下滚动",
    "// ESCOM STUDIO • DIAGNOSTIC INTERFACE": "// ESCOM 工作室 • 智能增长诊断界面",
    "v2026": "v2026",

    // Sidebar
    "INÍCIO": "首页",
    "PILARES": "支柱",
    "SOLUÇÕES": "方案",
    "PLANOS": "规划",
    "PROCESSO": "流程",
    "RESULTADOS": "成果",
    "FAQ": "问答",
    "CONTATO": "联系",

    // Hero Section
    "Sistema de": "全方位",
    "Crescimento": "商业增长",
    "& Growth.": "系统架构。",
    "Nós operamos o crescimento completo da sua empresa: análise de dados, automação, mídia paga, branding e geração de leads qualificados.": "我们为您的企业全权运营全链路数字化增长：精准数据分析、全自动获客系统、全网付费广告投放、高端品牌重塑与高意向客户获取。",
    "Sem atalhos. Sem SaaS. Sem custos invisíveis.": "无套路 · 无隐藏费用 · 专属定制基础设施。",
    "ACENDER ÓTICA": "开启机器人视觉",

    // Section 03 - Pilares
    "PILARES DO SISTEMA DE CRESCIMENTO": "核心增长系统五大支柱",
    "MOTOR DE": "全链路集成",
    "GROWTH INTEGRADO": "商业增长引擎",
    "P PILAR 01": "核心支柱 01",
    "DADOS QUE DECIDEM": "数据驱动决策",
    "Toda decisão começa em número. Análise de dados, dashboards ao vivo e BI que mostram exatamente onde está o seu ROI — LTV, CAC, conversão, pipeline.": "所有商业决策均由真实数据驱动。实时商业智能（BI）看板，精准呈现您的获客成本（CAC）、客户终生价值（LTV）与全链路投资回报率。",
    "P PILAR 02": "核心支柱 02",
    "TRÁFEGO QUE CONVERTE": "高转化精准流量",
    "Mídia paga em escala (Google, Meta, TikTok) com engenharia de conversão por trás de cada clique. Não trazemos visitantes: trazemos leads qualificados.": "主流广告平台全网规模化投放（Google、Meta、TikTok），深度工程化转化架构。我们不只带来访客，我们精准交付高净值成单客户。",
    "P PILAR 03": "核心支柱 03",
    "AUTOMAÇÃO INTELIGENTE": "AI 智能业务自动化",
    "Leads triados por IA, disparos automáticos de WhatsApp e e-mail, integração com seu ERP e pagamentos. Sua equipe comercial só fala com quem está pronto para comprar.": "AI 智能意向客户自动初筛，全自动 WhatsApp 与邮件跟进序列，深度集成 ERP 与支付系统。您的销售团队只需对接高意向成交客户。",
    "P PILAR 04": "核心支柱 04",
    "BRANDING QUE VENDE": "高溢价品牌势能",
    "Identidade e posicionamento que constroem percepção de valor inquestionável. Marca forte reduz custo de aquisição e aumenta ticket médio.": "打造无可挑剔的市场权威认知与视觉资产。强势品牌不仅能显著降低获客成本，更能成倍提升客户客单价与忠诚度。",
    "P PILAR 05": "核心支柱 05",
    "ECOSSISTEMA FECHADO": "闭环数字化生态",
    "Tudo integrado: tráfego → site → lead → CRM → automação → venda → dashboard. Sem ferramentas desconexas, sem dados perdidos, sem custos invisíveis.": "全链路无缝整合：广告流量 → 专属落地页 → 客户获取 → CRM系统 → 自动跟进 → 成交转化 → 实时BI大盘。无孤岛、无损耗、无暗扣费用。",
    "AGENDAR DIAGNÓSTICO →": "预约增长诊断 →",
    "VER RESULTADOS": "查看客户成果",
    "VER RESULTADOS →": "查看客户成果 →",

    // Section 04 - Marquee Strip
    "LANÇAR TRÁFEGO": "全网精准引流",
    "ANALISAR DADOS": "深度数据洞察",
    "QUALIFICAR LEADS": "意向客户初筛",
    "AUTOMATIZAR VENDAS": "全自动促成交",
    "GERAR RESULTADO": "交付确定性成果",
    "CONVERTER": "极致转化",

    // Section 05 - O QUE RESOLVEMOS
    "O QUE BEM FAZEMOS": "我们最擅长的核心领域",
    "Geração de Leads Qualificados e Vendas Recorrentes com um Sistema Completo de Growth": "通过一体化全链路增长系统获取高意向客户与持续复购",
    "Você não precisa de mais um site bonito. Você precisa de um sistema que traz visitas, qualifica leads e converte vendas — e de alguém que responda por esses três números: custo por lead, taxa de conversão e receita gerada.": "您需要的不仅是一个漂亮的网站，而是一套能持续引流、自动筛选线索并高效促成交易的增长系统，并由单一团队对获客成本、转化率与总销售额全面负责。",
    "Somos especialistas em Marketing Digital orientado a processo. Temos CERTEZA que encontraremos a melhor aplicação para a sua empresa porque trabalhamos com funil completo, e não com peças isoladas:": "我们精通流程化数字化增长。我们全盘打造端到端完整漏斗闭环，而非孤立零散的单点服务：",
    "Etapa do funil": "漏斗流转阶段",
    "O que operamos": "我们全权运营的内容",
    "Atração": "全网精准获客",
    "Mídia paga (Google, Meta, TikTok), SEO e conteúdo que traz o público certo": "付费广告投放（Google、Meta、TikTok）、SEO优化与高意向内容引流",
    "Conversão": "高效成交流转",
    "Sites e landing pages com engenharia de conversão e copy persuasiva": "搭载说服力文案与极致转化率工程的专属高转化落地页",
    "Qualificação": "智能客户初筛",
    "Automação com IA, triagem de leads e scoring inteligente": "AI 意向客户自动初筛、智能打分与标签分类系统",
    "Fechamento": "成交转化与留存",
    "CRM próprio, disparos automáticos de WhatsApp/e-mail e dashboards ao vivo": "专属 CRM 系统、WhatsApp 与邮件全自动跟进序列及实时监控看板",
    "Decisão": "数据驱动决策",
    "Análise de dados contínua: LTV, CAC, ROI — para escalar o que funciona": "持续全盘数据分析：LTV、CAC 与投资回报率，全力放大盈利渠道",
    "Fale com um Especialista →": "与增长架构专家对话 →",

    // Section 06 - Capacidades / O Sistema
    "/02 O SISTEMA": "/02 核心增长体系",
    "O que fazemos.": "核心业务能力。",
    "Seis disciplinas operando como um único ecossistema. Do primeiro clique do tráfego pago ao fechamento da venda no seu CRM — cada etapa é supervisada, integrada e mensurada.": "六大专业学科协同构建单一增长生态。从广告首次触达到 CRM 最终成单 — 每一步均被严格监控、深度整合与精准归因。",
    "Análise de Dados & BI": "商业智能与数据洞察",
    "Antes de qualquer investimento, entendemos o seu funil. Dashboards ao vivo, análise de LTV, CAC e ROI, e inteligência contínua que diz para onde ir. Sem dados, não criamos nada.": "在进行任何投放前，我们首先解构您的业务漏斗。实时 BI 看板、LTV/CAC/ROI 深度分析，由数据直接指导战略方向。",
    "Branding & Identidade": "品牌重塑与市场定位",
    "Sistemas de marca imponentes que constroem percepção de valor inquestionável. Tipografia, arquitetura visual e tom de voz lapidados como um único organismo — porque marca forte barateia lead e eleva ticket.": "打造具有无可争议市场权威感的品牌视觉体系。字体、视觉语言与品牌基调融为一体，显著降低获客成本并提升客单价。",
    "Mídia Paga & Tráfego": "效果广告与精准流量",
    "Gestão de campanhas em Google, Meta e TikTok com foco em ROAS. Não compramos cliques: compramos leads qualificados dentro do seu CAC alvo, com estrutura de teste A/B nativa.": "精细化运营 Google、Meta 与 TikTok 广告。我们不买无效点击，只在您的目标获客成本内交付具备采购意向的高净值线索。",
    "Sites & Landing Pages": "极致转化率落地页构建",
    "Páginas com engenharia de conversão brutalista para tráfego pago em escala. Carregamento sub-segundo (100/100 no Lighthouse) e bounce-rate cirúrgico — porque tráfego pago desperdiçado é dinheiro queimado.": "专为规模化广告投放量身定制的工程化落地页。亚秒级秒开速度（Lighthouse 满分 100/100）与极低跳出率，确保每一分预算都发挥最大价值。",
    "Automação & CRM": "销售自动化与CRM系统",
    "Leads triados por IA, disparos automáticos de WhatsApp e e-mail, integração com pagamentos e ERP. Sua operação de vendas rodando 24/7 enquanto você dorme.": "AI 意向客户自动初筛、全自动 WhatsApp 与邮件跟进序列，深度打通支付与 ERP。您的销售系统 24/7 全天候持续运转。",
    "Sistemas Web & E-commerce": "定制Web系统与电商矩阵",
    "Intranets, portais de cliente, CRMs sob medida e lojas integradas a dashboard ao vivo. Saiba o que está sendo visto, adicionado ao carrinho e comprado — em tempo real.": "专属客户门户、定制化内部 CRM 与深度集成实时看板的电商系统。实时掌控加购、浏览与交易全流程数据。",
    "Engenharia": "高可用工程化架构",
    "Código modular em Next.js, React, Node e Tailwind. Arquitetura técnica construída para escalar sem teto — porque growth sem infraestrutura sólida quebra na primeira escala.": "基于 Next.js、React 与 Node 的模块化技术架构。专为无上限规模扩张构建 — 坚固的工程底座是商业增长的先决条件。",

    // Section 07 - Custo Invisível
    "/03 O CUSTO INVISÍVEL": "/03 消除隐藏成本",
    "O maior custo não está na criação do site. Está na pilha desconectada.": "企业最大的隐性成本不是建站费用，而是碎片化工具堆叠带来的内耗。",
    "Métrica": "核心维度",
    "MODELO COMUM — Colcha de retalhos de assinaturas": "传统模式 — 碎片化第三方软件订阅",
    "MODELO ESCOM — Um único sistema blindado": "ESCOM 模式 — 单一闭环增长基础设施",
    "Ferramentas": "工具生态",
    "CRM externo, plataforma de e-mail, builder de landing pages, gerenciador de anúncios, analytics, heatmap": "外接CRM、邮件群发工具、建站器、广告后台、分析平台、热力图",
    "+ CRM integrado nativamente + Automações no backend + Dashboard ao vivo + Heatmap proprietário + Gestão de tráfego unificada ao funil": "+ 原生深度集成 CRM + 后端全自动工作流 + 实时 BI 看板 + 全链路一体化流量运营",
    "Dados": "数据资产",
    "Dispersos em 6 painéis que não conversam": "分散在互不连通的多个独立后台中",
    "Centralizados: do clique da campanha à venda no dashboard": "完全集中：从广告触达到最终成单统一归因在看板中",
    "Custo médio anual": "年均成本",
    "R$ 9.600 — R$ 27.600 + taxas de agência de mídia separada": "每年需额外支付数万元的第三方软件订阅费与代运营费",
    "Eficiência máxima. Pronto para operar.": "极致效率，开箱即用，零无用软件续费负担",
    "Quem responde pelo lead": "线索成效责任人",
    "Ninguém — cada fornecedor cuida da sua peça": "无人负责 — 各供应商互相推诿",
    "A ESCOM responde pela jornada completa: tráfego → lead → venda": "ESCOM 对全链路负责：流量获取 → 客户初筛 → 销售成单",

    // Section 08 - Planos
    "// INVESTIMENTO TRANSPARENTE": "// 透明投资方案",
    "Planos & Investimento.": "增长方案与投资。",
    "Sistemas proprietários construídos sob medida. Sem mensalidades ocultas de SaaS terceirizados.": "为您的企业量身定制的专属增长系统。无任何第三方 SaaS 隐藏续费。",
    "LANDING PAGE": "高转化落地页",
    "a partir de": "起价",
    "Para freelancers, prestadores de serviços e campanhas de tráfego pago com foco em conversão rápida.": "适合咨询顾问、专业服务机构及追求高投产比的广告投放项目。",
    "MAIS POPULAR": "最受欢迎",
    "SITE PROFISSIONAL": "专业品牌官网",
    "ECOSSISTEMA COMPLETO": "全链路增长生态",
    "ESCOLHER LANDING PAGE": "选择高转化落地页",
    "ESCOLHER SITE PROFISSIONAL": "选择专业品牌官网",
    "SOLICITAR PROPOSTA": "获取定制提案",
    "FALAR COM ESPECIALISTA": "与战略专家对话"
  }
};

const originalTextMap = new Map<Node, string>();

function traverseAndTranslate(node: Node, lang: SupportedLanguage) {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.nodeValue?.trim();
    if (!text || text.length < 2) return;

    if (!originalTextMap.has(node)) {
      originalTextMap.set(node, node.nodeValue || '');
    }

    const orig = originalTextMap.get(node) || '';
    const origTrim = orig.trim();

    if (lang === 'pt') {
      node.nodeValue = orig;
    } else {
      const dict = fullPhraseDictionary[lang];
      if (dict && dict[origTrim]) {
        const leadingSpace = orig.match(/^\s*/)?.[0] || '';
        const trailingSpace = orig.match(/\s*$/)?.[0] || '';
        node.nodeValue = leadingSpace + dict[origTrim] + trailingSpace;
      }
    }
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as HTMLElement;
    if (['SCRIPT', 'STYLE', 'SVG', 'ICONIFY-ICON', 'CANVAS', 'CODE'].includes(el.tagName)) return;

    // Traduzir placeholders
    if (el.hasAttribute('placeholder')) {
      const ph = el.getAttribute('placeholder')?.trim();
      if (ph) {
        if (!el.hasAttribute('data-orig-ph')) {
          el.setAttribute('data-orig-ph', ph);
        }
        const origPh = el.getAttribute('data-orig-ph') || '';
        if (lang === 'pt') {
          el.setAttribute('placeholder', origPh);
        } else if (fullPhraseDictionary[lang]?.[origPh]) {
          el.setAttribute('placeholder', fullPhraseDictionary[lang][origPh]);
        }
      }
    }

    node.childNodes.forEach((child) => traverseAndTranslate(child, lang));
  }
}

export function setLanguage(lang: SupportedLanguage) {
  localStorage.setItem('escom_lang', lang);

  // 1. Tradução Global e Recursiva de todo o corpo da página
  const mainContent = document.body;
  if (mainContent) {
    traverseAndTranslate(mainContent, lang);
  }

  // 2. Atualizar sidebar links
  const targetToNavKey: Record<string, string> = {
    'main-content': 'INÍCIO',
    'pilares': 'PILARES',
    'capacidades': 'SOLUÇÕES',
    'planos': 'PLANOS',
    'processo': 'PROCESSO',
    'metricas': 'RESULTADOS',
    'faq': 'FAQ',
    'contato': 'CONTATO',
  };

  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  sidebarLinks.forEach((link) => {
    const target = link.getAttribute('data-target');
    const span = link.querySelector('.sidebar-text');
    if (span && target && targetToNavKey[target]) {
      const origKey = targetToNavKey[target];
      if (lang === 'pt') {
        span.textContent = origKey;
      } else {
        span.textContent = fullPhraseDictionary[lang]?.[origKey] || origKey;
      }
    }
  });

  // 3. Atualizar botões de idioma no dropdown desktop e mobile
  const langOptionBtns = document.querySelectorAll('.lang-option-btn, .mobile-lang-opt-btn');
  langOptionBtns.forEach((btn) => {
    const bLang = btn.getAttribute('data-lang');
    if (bLang === lang) {
      btn.classList.add('text-cyan-400', 'bg-cyan-950', 'border-cyan-500/30');
      btn.classList.remove('text-zinc-400', 'text-zinc-300');
    } else {
      btn.classList.remove('text-cyan-400', 'bg-cyan-950', 'border-cyan-500/30');
      btn.classList.add('text-zinc-400');
    }
  });

  const mobileLangCurrent = document.getElementById('mobile-lang-current');
  if (mobileLangCurrent) {
    mobileLangCurrent.textContent = lang.toUpperCase();
  }

  console.log(`[ESCOM / i18n] Página traduzida com sucesso para: ${lang.toUpperCase()}`);
}

export function initLanguage() {
  const saved = (localStorage.getItem('escom_lang') as SupportedLanguage) || 'pt';
  setLanguage(saved);
}
