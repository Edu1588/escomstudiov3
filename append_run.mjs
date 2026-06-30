import fs from 'fs';

const runContent = `
async function run() {
  console.log("Iniciando geração de PDF para Cenário B (Auto Center São José)...");

  // Diretório do template
  const dirPath = await import('path').then(p => p.resolve('./public/template-saojose'));
  await import('fs/promises').then(fs => fs.mkdir(dirPath, { recursive: true }));

  await generateDossie10Pages('template-saojose', {
    color: '#ef4444', // Vermelho mecânica/urgência
    title: 'Auto Center São José',
    niche: 'Oficinas Mecânicas e Centros Automotivos',
    city: 'São Paulo - SP',
    ticket: 'R$ 1.500',
    revenue: 'R$ 75.000 (Perda Estimada)',
    monthlySearches: '18.400+',
    hasSite: false, // Cenário B ativado
    siteUrl: '',
    ctaWhatsapp: '(11) 98106-2787',
    ctaMessage: 'Este dossiê foi preparado exclusivamente para a direção do Auto Center São José. Gostaríamos de agendar uma conversa de 15 minutos para apresentar como podemos capturar essa demanda digital que hoje vai para a concorrência. Sem compromisso, sem pressão.',

    marketContext: 'A busca por serviços automotivos locais cresceu 180% nos últimos 2 anos. Motoristas não guardam mais cartões de visita; quando uma luz acende no painel ou precisam de uma revisão, eles buscam "mecânica perto de mim" no Google e escolhem a oficina com melhor presença online.',
    marketContext2: 'Estar fora do Google e não ter um site que transmita confiança imediata significa perder diariamente clientes que moram no seu próprio bairro, entregando esse faturamento diretamente para seus concorrentes locais.',

    diagItems: [
      { title: 'Invisibilidade Digital Absoluta', desc: 'Atualmente a oficina depende 100% de indicações ou passagem na porta. Os clientes da região que buscam no Google não encontram a sua oficina, indo direto para a concorrência que possui um site bem ranqueado.' },
      { title: 'Perda de Faturamento Fixo', desc: 'Com 18.400 buscas mensais na região, se apenas 0,5% escolhessem a sua oficina, seriam quase 100 novos clientes ao mês. Ao ticket médio de R$ 1.500, o custo dessa invisibilidade ultrapassa facilmente a casa dos R$ 100.000 mensais.' },
      { title: 'Falta de Confiança e Profissionalismo Visual', desc: 'Um site estruturado atua como uma vitrine 24h. Oficinas sem site passam a impressão de serem "amadoras" ou "de esquina", dificultando a venda de serviços mais caros como retíficas ou revisões preventivas completas.' },
      { title: 'Dificuldade de Contato via WhatsApp', desc: 'Não possuir um funil direto de agendamento online através de um clique força o cliente a ligar ou procurar outras opções. No trânsito ou com pressa, o cliente prefere a oficina que facilita o contato.' }
    ],

    colorPalette: [
      { hex: '#dc2626', name: 'Vermelho Urgência (Primária)', usage: 'Botões, CTAs, Alertas — Transmite ação rápida e mecânica' },
      { hex: '#1e293b', name: 'Asfalto Dark (Secundária)', usage: 'Headers, fundos escuros — Profissionalismo e robustez' },
      { hex: '#f8fafc', name: 'Cinza Gelo (Background)', usage: 'Fundos claros — Limpeza, organização técnica' },
      { hex: '#0f172a', name: 'Preto Motor (Texto)', usage: 'Corpo de texto — Contraste máximo e legibilidade' },
      { hex: '#eab308', name: 'Amarelo Atenção (Acento)', usage: 'Estrelas de avaliação, detalhes — Destaque' },
      { hex: '#ef4444', name: 'Alerta Red (Urgência)', usage: 'Banners de urgência — Ação imediata' }
    ],
    colorRationale: 'O esquema de cores une a robustez do asfalto escuro com o vermelho de alerta e urgência. Transmite a segurança de um centro automotivo moderno e limpo, diferenciando-se da oficina tradicional "suja de graxa".',

    typography: [
      { role: 'Títulos (Headline)', font: 'Playfair Display', weight: 'SemiBold 600', sample: 'Potência e Segurança em Cada Curva.', reason: 'Fonte forte e marcante que transmite tradição e confiabilidade.' },
      { role: 'Corpo de Texto (Body)', font: 'Inter', weight: 'Regular 400', sample: 'Agende a revisão do seu veículo agora pelo WhatsApp.', reason: 'Fonte técnica, moderna e legível para todas as telas.' }
    ],
    typoPersonality: 'robustez técnica e confiabilidade familiar',

    competitors: [
      { criteria: 'Visibilidade no Google', leaders: 'Top 3 (Maps e Busca)', yours: 'Invisível' },
      { criteria: 'Captura de Leads Automática', leaders: 'Botões WhatsApp', yours: 'Nenhuma' },
      { criteria: 'Credibilidade (Provas Sociais)', leaders: 'Depoimentos e Avaliações', yours: 'Ausente' },
      { criteria: 'Estrutura de Agendamento', leaders: 'Direto e Fácil', yours: 'Indicação Boca a Boca' },
      { criteria: 'Responsividade', leaders: 'Otimizado para Celular', yours: 'Sem site' },
      { criteria: 'Custo por Aquisição', leaders: 'Baixo (Orgânico Local)', yours: 'Perda de Faturamento' }
    ],
    compConclusion: 'Concorrentes locais com sites rápidos e organizados estão capturando diariamente os motoristas que buscam mecânica na sua região. Essa demanda existe e já está comprando, apenas não está comprando de você.',

    improvements: [
      { impact: 'Alto', title: 'Criação de Site Mobile-First', desc: 'Desenvolver uma Landing Page rápida, voltada para captura de leads urgentes (ex: carro quebrado) direto no celular.' },
      { impact: 'Alto', title: 'Integração com Google Meu Negócio', desc: 'Configurar e conectar o site para ranquear no mapa local, aparecendo para quem pesquisa "mecânica".' },
      { impact: 'Alto', title: 'Funil de Orçamento via WhatsApp', desc: 'Botão flutuante onipresente que leva o cliente com 1 clique para falar com o mecânico.' },
      { impact: 'Médio', title: 'Apresentação de Estrutura Física', desc: 'Fotos da oficina limpa, equipamentos modernos e equipe, passando credibilidade.' },
      { impact: 'Médio', title: 'Serviços Especializados em Destaque', desc: 'Páginas/Seções explicando serviços de alto valor (ex: câmbio automático, injeção eletrônica).' },
      { impact: 'Baixo', title: 'Provas Sociais em Vídeo', desc: 'Casos reais de clientes satisfeitos para aumentar a confiança inicial.' }
    ],

    solutionBlocks: [
      { icon: 'fa-solid fa-car-burst', title: 'Captação de Urgência', desc: 'Layout projetado para converter o cliente que está na rua precisando de ajuda rápida.' },
      { icon: 'fa-solid fa-bolt', title: 'Velocidade de Carregamento', desc: 'O site abre instantaneamente no 4G, evitando que o motorista feche e vá para o próximo.' },
      { icon: 'fa-solid fa-mobile-screen-button', title: 'Design Mobile-First', desc: 'Como 95% das buscas por mecânica ocorrem no celular, o site é 100% pensado para telas pequenas.' },
      { icon: 'fa-brands fa-whatsapp', title: 'Atendimento sem Fricção', desc: 'Mensagens pré-configuradas no botão do WhatsApp ("Preciso de orçamento").' },
      { icon: 'fa-solid fa-magnifying-glass-location', title: 'Otimização Local SEO', desc: 'Tags e estruturas otimizadas para ranquear nas pesquisas de bairro e região.' },
      { icon: 'fa-solid fa-shield-halved', title: 'Segurança Profissional', desc: 'Site blindado com certificado SSL, passando confiança e estabilidade para o cliente.' }
    ],
    conversionCurrent: '0% (Invisível)', conversionNew: 'Oportunidade', patientsOld: '0', patientsNew: '15+'
  });
  
  // Puppeteer para gerar PDF do Auto Center
  const puppeteer = await import('puppeteer');
  const browser = await puppeteer.default.launch({ headless: 'new' });
  const page = await browser.newPage();
  const htmlPath = 'file:///' + await import('path').then(p => p.resolve('./public/template-saojose/dossie.html')).replace(/\\\\/g, '/');
  
  await page.goto(htmlPath, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: './public/template-saojose/dossie.pdf',
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' }
  });
  await browser.close();

  console.log("PDF para Cenário B gerado com sucesso.");
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
`;

fs.appendFileSync('generate_cenario_b.mjs', runContent);
console.log("Appended run() to generate_cenario_b.mjs");
