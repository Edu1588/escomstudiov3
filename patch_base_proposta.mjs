import fs from 'fs';

const filePath = 'src/baseproposta/BaseProposta.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

console.log("Original content lines:", content.split('\n').length);

const patches = [
  // 1. Variáveis e calculateTotal (substituição do bloco de variáveis)
  {
    target: `  // Calculate generic total if not dynamic
  const calculateTotal = (servicesItems: any[], customBudget: string) => {
    if (customBudget) return \`R\$ \${customBudget}\`;
    if (!servicesItems || servicesItems.length === 0) return "R\$ 4.500,00";
    const total = servicesItems.reduce((acc, curr) => acc + parseFloat(curr.price.replace(".", "")), 0);
    return \`R\$ \${(total).toLocaleString('pt-BR')},00\`;
  };

  const clientName = proposal?.clientName || "Sua Empresa";
  const company = proposal?.company || "Sua Empresa";
  const dateSent = proposal?.createdAt ? new Date(proposal.createdAt).toLocaleDateString('pt-BR') : "06/05/2026";
  const totalValueSplit = calculateTotal(proposal?.selectedServices, proposal?.budget).replace("R\$ ", "").split(",");
  const phone = proposal?.phone ? \`55\${proposal.phone.replace(/\\D/g, '')}\` : "5548988626785";
  const wppText = encodeURIComponent(\`Olá ESCOM STUDIO, vi a proposta da \${company} e gostaria de fechar o projeto!\`);`,
    replacement: `  const isEn = proposal?.isAmerican || proposal?.currency === 'USD';

  // Calculate generic total if not dynamic
  const calculateTotal = (servicesItems: any[], customBudget: string) => {
    if (isEn) return "$ 990.00";
    if (customBudget) return \`R\$ \${customBudget}\`;
    if (!servicesItems || servicesItems.length === 0) return "R\$ 4.500,00";
    const total = servicesItems.reduce((acc, curr) => {
      const p = typeof curr.price === 'string' ? parseFloat(curr.price.replace(/\\./g, "").replace(",", ".")) : curr.price;
      return acc + (isNaN(p) ? 0 : p);
    }, 0);
    return \`R\$ \${(total).toLocaleString('pt-BR')},00\`;
  };

  const clientName = proposal?.clientName || "Sua Empresa";
  const company = proposal?.company || "Sua Empresa";
  const dateSent = proposal?.createdAt ? new Date(proposal.createdAt).toLocaleDateString(isEn ? 'en-US' : 'pt-BR') : "06/05/2026";
  const totalValue = calculateTotal(proposal?.selectedServices, proposal?.budget);
  const totalValueSplit = totalValue.replace("R\$ ", "").replace("$ ", "").split(/[.,]/);
  const phone = proposal?.phone ? (proposal.phone.replace(/\\D/g, '').startsWith('1') ? proposal.phone.replace(/\\D/g, '') : \`55\${proposal.phone.replace(/\\D/g, '')}\`) : "5548988626785";
  const wppText = encodeURIComponent(isEn ? \`Hello ESCOM STUDIO, I saw the proposal for \${company} and would like to proceed with the project!\` : \`Olá ESCOM STUDIO, vi a proposta da \${company} e gostaria de fechar o projeto!\`);

  const t = {
    dateSent: isEn ? "Sent Date:" : "Data de Envio:",
    validFor3Days: isEn ? "Proposal valid for 3 days" : "Proposta válida por 3 dias",
    viewInvestment: isEn ? "View Investment" : "Ver Investimento",
    downloadPdf: isEn ? "Download PDF" : "Baixar PDF",
    generating: isEn ? "Generating..." : "Gerando...",
    project: isEn ? "PROJECT" : "PROJETO",
    heroSubtitle: (name: string) => isEn 
      ? \`Hello \${name}, here you will get to know a little bit about my work and the information for your company's project, such as deadline, payment methods, and investment value.\`
      : \`Olá \${name}, aqui você vai conhecer um pouco do meu trabalho e as informações para o projeto da sua empresa, como prazo, formas de pagamento e o valor do investimento.\`,
    viewDetails: isEn ? "VIEW DETAILS" : "VER AS INFORMAÇÕES",
    clientsServed: isEn ? "+200 Clients Served" : "+200 Clientes Atendidos",
    countriesServed: isEn ? "Clients in over 5 Countries" : "Clients em mais de 5 Países",
    yearsExp: isEn ? "+15 Years of experience" : "+15 Anos de experiência",
    worksSpeak: isEn ? "Works that speak for themselves." : "Trabalhos que falam por si.",
    recentProjectsDesc: isEn 
      ? "Some of our most recent projects where we applied strategic design to generate real results."
      : "Alguns dos projetos mais recentes onde aplicamos design estratégico para gerar resultados reais.",
    farBeyond: isEn ? "Far beyond" : "Muito além",
    thePixel: isEn ? "the pixel." : "do pixel.",
    aboutDesc1: isEn
      ? "Seniority is not about time, but about the ability to predict what the market needs before it is even requested. Active for 15 years, my mission is to eliminate visual noise to leave only what matters: the message and the conversion."
      : "A senioridade não é sobre o tempo, mas sobre a capacidade de prever o que o mercado precisa antes mesmo de ser solicitado. Com 15 anos no ativo, a minha missão é eliminar o \\\"ruído\\\" visual para deixar apenas o que importa: a mensagem e a conversão.",
    aboutQuote: isEn
      ? "I am married to the best psychologist in the world, my love Ingrid. We have a Persian cat, Oreo, and some little fish. When I'm not creating designs, I'm enjoying life alongside my family."
      : "Sou casado com a melhor psicóloga do mundo, meu amor Ingrid. Temos um gatinho persa, o Oreo, e alguns peixinhos. Quando não estou criando designs, estou aproveitando a vida ao lado da minha família.",
    aboutDesc2: isEn
      ? "Currently, as an Art Director, I integrate technology and emotion to create digital journeys that stick in the memory — and on my clients' bank statements."
      : "Atualmente, como Diretor de Arte, integro tecnologia e emoção para criar jornadas digitais que ficam gravadas na memória — e no extrato bancário dos meus clientes.",
    creationProcess: isEn ? "Understand a bit of our Creation process" : "Entenda um pouco do processo de Criação",
    step1: isEn ? "STEP 01" : "ETAPA 01",
    mapping: isEn ? "Mapping" : "Mapeamento",
    briefingTitle: isEn ? "Briefing Application" : "Aplicação do Briefing",
    briefingDesc: isEn
      ? "The first step is to understand exactly what you want and collect the necessary information, such as: Copy, image files, visual identity, references, etc..."
      : "O primeiro passo é entender exatamente o que você quer e coletar as informações necessárias, como: Copy, arquivos de imagem, identidade visual, referências, etc...",
    step2: isEn ? "STEP 02" : "ETAPA 02",
    analysis: isEn ? "Analysis" : "Análise",
    strategyTitle: isEn ? "Research & Strategy" : "Pesquisa & Estratégia",
    strategyDesc: isEn
      ? "I analyze the niche to deeply understand competitors' strategies, identifying the best practices and references in the sector. This process allows me to absorb innovative and effective ideas."
      : "Realizo uma análise do nicho para compreender profundamente as estratégias dos concorrentes, identificando as melhores práticas e referências do setor. Esse processo me permite absorver ideias inovadoras e eficazes.",
    step3: isEn ? "STEP 03" : "ETAPA 03",
    direction: isEn ? "Direction" : "Direção",
    designTitle: isEn ? "Design Creation" : "Criação do Design",
    designDesc: isEn
      ? "From there, I will start developing the visual part, ensuring that the final result is not only attractive, but also highly competitive and aligned with market trends."
      : "A partir disso, iniciarei o desenvolvimento da parte visual, garantindo que o resultado final seja não apenas atrativo, mas também altamente competitivo e alinhado com as tendências de mercado.",
    step4: isEn ? "STEP 04" : "ETAPA 04",
    frontend: isEn ? "Development" : "Front-end",
    implTitle: isEn ? "Implementation" : "Implementação",
    implDesc: isEn
      ? "After the complete approval of the design by the client, I proceed with the implementation of the page, ensuring full responsiveness across all devices and guaranteeing a fluid user experience."
      : "Após a completa aprovação do design pelo cliente, procedo com a implementação da página, assegurando a plena responsividade em todos os dispositivos e garantindo uma experiência de usuário fluida.",
    step5: isEn ? "STEP 05" : "ETAPA 05",
    performance: isEn ? "Performance" : "Performance",
    optTitle: isEn ? "Extreme Optimization" : "Otimização Extrema",
    optDesc: isEn
      ? "During this phase, I dedicate myself to the complete optimization of the page, aiming to ensure fast and efficient loading. Speed is crucial for conversions and to prevent bounce rate."
      : "Durante esta fase, dedico-me à otimização integral da página, visando assegurar um carregamento rápido e eficiente. Velocidade é crucial para as conversões e para evitar abandonos.",
    perfReport: isEn ? "Performance Report" : "Performance Report",
    grade: isEn ? "Grade" : "Grade",
    perf: isEn ? "Perf." : "Perf.",
    struct: isEn ? "Struct." : "Struct.",
    proposalInfo: isEn ? "Proposal Information" : "Informações sobre a Proposta",
    importantNotice: isEn ? "IMPORTANT NOTICE" : "AVISOS IMPORTANTES",
    delivDeadline: isEn ? "Delivery Deadline" : "Prazo de Entrega",
    delivDesc: isEn
      ? "The delivery timeframe for a page is 10 to 15 business days, which may be delivered earlier depending on the workflow or the client's needs."
      : "O prazo de entrega de uma página é de <strong class=\\"text-white\\">10 a 15 dias úteis</strong>, podendo ser entregue antes dependendo do fluxo de demandas ou da necessidade do cliente.",
    paymentTerms: isEn ? "Payment Terms" : "Formas de Pagamento",
    paymentTermsDesc: isEn
      ? "With a payment of 50% upfront we start the project, and after the service is delivered and approved, the remaining 50%."
      : "A partir do pagamento de <strong class=\\"text-white\\">50% do valor</strong> começamos o projeto e depois que o serviço for entregue e aprovado, os outros 50%.",
    paymentMethods: isEn ? "Payment Methods" : "Meios de Pagamento",
    paymentMethodsDesc: isEn
      ? "You can pay via bank transfer or international wire. If you prefer, you can pay in installments by credit card (platform fees apply)."
      : "Você pode pagar através de PIX ou transferência bancária internacional. Se preferir, pode parcelar no cartão de crédito <span class=\\"text-[10px] text-gray-500\\">(plataforma com taxas aplicáveis).</span>",
    obs: isEn ? "Observations" : "Observações",
    investment: isEn ? "Investment" : "Investimento",
    servicesInc: isEn ? "SERVICES INCLUDED" : "SERVIÇOS INCLUSOS",
    validDesc: isEn ? "This Proposal with this promotional value is valid for 3 days." : "Essa Proposta com esse valor promocional é válida por 3 dias.",
    closeCta: isEn ? "I WANT TO WORK WITH YOU" : "QUERO FECHAR COM VOCÊ",
    wait: isEn ? "PLEASE WAIT..." : "AGUARDE...",
    questions: isEn ? "Still have any questions?" : "Ainda Ficou com alguma dúvida?",
    chatWpp: isEn ? "Click here to chat with me on WhatsApp" : "Clique aqui para me chamar no WhatsApp",
    allRights: isEn ? "© 2026 All rights reserved." : "© 2026 Todos os direitos reservados.",
    privPol: isEn ? "Privacy Policy" : "Políticas de Privacidade",
    termsUse: isEn ? "Terms of Use" : "Termos de Uso"
  };`
  }
];

let applied = 0;
for (const patch of patches) {
  if (content.includes(patch.target)) {
    content = content.replace(patch.target, patch.replacement);
    applied++;
  } else {
    console.warn("Patch target not found!");
  }
}

// 2. Erros de carregamento/não encontrado
content = content.replace('CARREGANDO PROPOSTA...', 'CARREGANDO PROPOSTA... / LOADING PROPOSAL...');
content = content.replace('PROPOSTA NÃO ENCONTRADA OU EXPIRADA.', 'PROPOSTA NÃO ENCONTRADA OU EXPIRADA. / PROPOSAL NOT FOUND OR EXPIRED.');

// 3. Barra superior (substituição cirúrgica do texto interno)
content = content.replace('Data de Envio: {dateSent}', '{t.dateSent} {dateSent}');
content = content.replace('Proposta válida por 3 dias', '{t.validFor3Days}');
content = content.replace('Proposta válida por 7 dias', '{t.validFor3Days}');

// 4. Header (substituição do botão Baixar PDF e Ver Investimento)
content = content.replace(
  `{isDownloadingPDF ? 'Gerando...' : 'Baixar PDF'}`,
  `{isDownloadingPDF ? t.generating : t.downloadPdf}`
);
content = content.replace('Ver Investimento', '{t.viewInvestment}');

// 5. Hero
content = content.replace('PROJETO<br/><span className="text-[#2EFF00] uppercase">{company}</span>', '{t.project}<br/><span className="text-[#2EFF00] uppercase">{company}</span>');
content = content.replace('Olá {clientName}, aqui você vai conhecer um pouco do meu trabalho e as informações para o projeto da sua empresa, como prazo, formas de pagamento e o valor do investimento.', '{t.heroSubtitle(clientName)}');
content = content.replace('VER AS INFORMAÇÕES <ArrowDown size={18} />', '{t.viewDetails} <ArrowDown size={18} />');

// 6. Hero Stats
content = content.replace('+200 Clientes Atendidos', '{t.clientsServed}');
content = content.replace('Clientes em mais de 5 Países', '{t.countriesServed}');
content = content.replace('+15 Anos de experiência', '{t.yearsExp}');

// 7. Portfolio Section
content = content.replace('text="[ PORTFOLIO ]"', 'text={isEn ? "[ PORTFOLIO ]" : "[ PORTFÓLIO ]"}');
content = content.replace(
  `<h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tight font-tech group cursor-default">
            <span className="group-hover:text-[#2EFF00] transition-colors duration-500">Trabalhos que</span> <span className="text-gray-600 group-hover:text-white transition-colors duration-500">falam por si.</span>
          </h2>`,
  `<h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tight font-tech group cursor-default">
            {isEn ? (
              <>
                <span className="group-hover:text-[#2EFF00] transition-colors duration-500">Works that</span> <span className="text-gray-600 group-hover:text-white transition-colors duration-500">speak for themselves.</span>
              </>
            ) : (
              <>
                <span className="group-hover:text-[#2EFF00] transition-colors duration-500">Trabalhos que</span> <span className="text-gray-600 group-hover:text-white transition-colors duration-500">falam por si.</span>
              </>
            )}
          </h2>`
);
content = content.replace('Alguns dos projetos mais recentes onde aplicamos design estratégico para gerar resultados reais.', '{t.recentProjectsDesc}');

// 8. Bastidores ScrambleTag e Título
content = content.replace('text="[ BASTIDORES ]"', 'text={isEn ? "[ BEHIND THE SCENES ]" : "[ BASTIDORES ]"}');
content = content.replace('Muito além', '{t.farBeyond}');
content = content.replace('do pixel.', '{t.thePixel}');

// 9. Bastidores Texto
content = content.replace(
  `A senioridade não é sobre o tempo, mas sobre a capacidade de prever o que o mercado precisa antes mesmo de ser solicitado. Com 15 anos no ativo, a minha missão é eliminar o "ruído" visual para deixar apenas o que importa: a mensagem e a conversão.`,
  `{t.aboutDesc1}`
);
content = content.replace(
  `"Sou casado com a melhor psicóloga do mundo, meu amor Ingrid. Temos um gatinho persa, o Oreo, e alguns peixinhos. Quando não estou criando designs, estou aproveitando a vida ao lado da minha família."`,
  `"{t.aboutQuote}"`
);
content = content.replace(
  `Atualmente, como Diretor de Arte, integro tecnologia e emoção para criar jornadas digitais que ficam gravadas na memória — e no extrato bancário dos meus clientes.`,
  `{t.aboutDesc2}`
);

// 10. Timeline Section
content = content.replace('text="[ TIMELINE ]"', 'text={isEn ? "[ TIMELINE ]" : "[ LINHA DO TEMPO ]"}');
content = content.replace(
  `<h2 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-[1.1] group cursor-default">
              <span className="group-hover:text-[#2EFF00] transition-colors duration-500">Entenda um pouco</span><br />
              <span className="group-hover:text-white transition-colors duration-500">do processo de</span><br />
              <span className="text-[#2EFF00] group-hover:text-white transition-colors duration-500">Criação</span>
            </h2>`,
  `<h2 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-[1.1] group cursor-default">
              {isEn ? (
                <>
                  <span className="group-hover:text-[#2EFF00] transition-colors duration-500">Understand a bit</span><br />
                  <span className="group-hover:text-white transition-colors duration-500">of our process of</span><br />
                  <span className="text-[#2EFF00] group-hover:text-white transition-colors duration-500">Creation</span>
                </>
              ) : (
                <>
                  <span className="group-hover:text-[#2EFF00] transition-colors duration-500">Entenda um pouco</span><br />
                  <span className="group-hover:text-white transition-colors duration-500">do processo de</span><br />
                  <span className="text-[#2EFF00] group-hover:text-white transition-colors duration-500">Criação</span>
                </>
              )}
            </h2>`
);

// 11. Etapa 1 a 5
content = content.replace('ETAPA 01', '{t.step1}');
content = content.replace('Mapeamento', '{t.mapping}');
content = content.replace('Aplicação do Briefing', '{t.briefingTitle}');
content = content.replace(
  'O primeiro passo é entender exatamente o que você quer e coletar as informações necessárias, como: Copy, arquivos de imagem, identidade visual, referências, etc...',
  '{t.briefingDesc}'
);

content = content.replace('ETAPA 02', '{t.step2}');
content = content.replace('Análise', '{t.analysis}');
content = content.replace('Pesquisa & Estratégia', '{t.strategyTitle}');
content = content.replace(
  'Realizo uma análise do nicho para compreender profundamente as estratégias dos concorrentes, identificando as melhores práticas e referências do setor. Esse processo me permite absorver ideias inovadoras e eficazes.',
  '{t.strategyDesc}'
);

content = content.replace('ETAPA 03', '{t.step3}');
content = content.replace('Direção', '{t.direction}');
content = content.replace('Criação do Design', '{t.designTitle}');
content = content.replace(
  'A partir disso, iniciarei o desenvolvimento da parte visual, garantindo que o resultado final seja não apenas atrativo, mas também altamente competitivo e alinhado com as tendências de mercado.',
  '{t.designDesc}'
);

content = content.replace('ETAPA 04', '{t.step4}');
content = content.replace('Front-end', '{t.frontend}');
content = content.replace('Implementação', '{t.implTitle}');
content = content.replace(
  'Após a completa aprovação do design pelo cliente, procedo com a implementação da página, assegurando a plena responsividade em todos os dispositivos e garantindo uma experiência de usuário fluida.',
  '{t.implDesc}'
);

content = content.replace('ETAPA 05', '{t.step5}');
content = content.replace('Performance', '{t.performance}');
content = content.replace('Otimização Extrema', '{t.optTitle}');
content = content.replace(
  'Durante esta fase, dedico-me à otimização integral da página, visando assegurar um carregamento rápido e eficiente. Velocidade é crucial para as conversões e para evitar abandonos.',
  '{t.optDesc}'
);

content = content.replace('Performance Report', '{t.perfReport}');
content = content.replace('>Grade</div>', '>{t.grade}</div>');
content = content.replace('>Perf.</div>', '>{t.perf}</div>');
content = content.replace('>Struct.</div>', '>{t.struct}</div>');

// 12. Info Section
content = content.replace('Informações sobre a Proposta</h2>', '{t.proposalInfo}</h2>');
content = content.replace('AVISOS IMPORTANTES</span>', '{t.importantNotice}</span>');

content = content.replace('Prazo de<br />Entrega</h3>', 'Prazo de<br />Entrega</h3>'); // Mantemos a tag, mas alteramos os textos abaixo
content = content.replace('Prazo de<br />Entrega', '{isEn ? "Delivery<br />Timeframe" : "Prazo de<br />Entrega"}'); // Se necessário

content = content.replace('Formas de<br />Pagamento', '{isEn ? "Payment<br />Terms" : "Formas de<br />Pagamento"}');
content = content.replace('Meios de<br />Pagamento', '{isEn ? "Payment<br />Methods" : "Meios de<br />Pagamento"}');
content = content.replace('Observações</h3>', '{t.obs}</h3>');

// 13. Preços e Investimento
content = content.replace('text-[#2EFF00] mb-8">Investimento</h2>', 'text-[#2EFF00] mb-8">{t.investment}</h2>');
content = content.replace('SERVIÇOS INCLUSOS</h4>', '{t.servicesInc}</h4>');

// Substituição do box de preço com suporte a USD
content = content.replace(
  `<div className="flex items-start justify-center gap-2 mb-8 mt-4">
            <span className="text-xl font-bold mt-2">R$</span>
            <span className="text-6xl md:text-8xl font-black tracking-tighter">{totalValueSplit[0]}</span>
            <span className="text-xl font-bold mt-2">,{totalValueSplit[1] || '00'}</span>
          </div>`,
  `<div className="flex items-start justify-center gap-2 mb-8 mt-4">
            <span className="text-xl font-bold mt-2">{isEn ? "$" : "R$"}</span>
            <span className="text-6xl md:text-8xl font-black tracking-tighter">{totalValueSplit[0]}</span>
            <span className="text-xl font-bold mt-2">{isEn ? "." : ","}{totalValueSplit[1] || '00'}</span>
          </div>`
);

content = content.replace(
  'Essa Proposta com esse valor promocional é válida por <strong className="text-red-500 font-bold">3 dias</strong>.',
  '{t.validDesc}'
);

content = content.replace(
  'onClick={handleAcceptProposal} disabled={isAccepting} className="inline-flex items-center justify-center gap-2 bg-[#2EFF00] text-black w-full md:w-auto px-12 py-5 rounded-full font-bold text-lg hover:bg-[#2EFF00]/90 transition-colors shadow-[0_0_30px_rgba(46,255,0,0.3)] hover:scale-105 transform duration-300 disabled:opacity-50">\n            {isAccepting ? "AGUARDE..." : "QUERO FECHAR COM VOCÊ"}',
  'onClick={handleAcceptProposal} disabled={isAccepting} className="inline-flex items-center justify-center gap-2 bg-[#2EFF00] text-black w-full md:w-auto px-12 py-5 rounded-full font-bold text-lg hover:bg-[#2EFF00]/90 transition-colors shadow-[0_0_30px_rgba(46,255,0,0.3)] hover:scale-105 transform duration-300 disabled:opacity-50">\n            {isAccepting ? t.wait : t.closeCta}'
);

content = content.replace('Ainda Ficou com alguma dúvida?', '{t.questions}');
content = content.replace(
  'href={`https://wa.me/${phone}?text=${encodeURIComponent("Olá ESCOM STUDIO, tive uma dúvida sobre a proposta.")}`} target="_blank" rel="noreferrer" className="text-[#2EFF00] underline hover:text-white transition-colors mt-2 inline-block">Clique aqui para me chamar no WhatsApp</a>',
  'href={`https://wa.me/${phone}?text=${encodeURIComponent(isEn ? "Hello ESCOM STUDIO, I had a question about the proposal." : "Olá ESCOM STUDIO, tive uma dúvida sobre a proposta.")}`} target="_blank" rel="noreferrer" className="text-[#2EFF00] underline hover:text-white transition-colors mt-2 inline-block">{t.chatWpp}</a>'
);

// 14. Footer
content = content.replace('© 2026 Todos os direitos reservados.', '{t.allRights}');
content = content.replace('Políticas de Privacidade', '{t.privPol}');
content = content.replace('Termos de Uso', '{t.termsUse}');

// 15. PDF capture
content = content.replace('Proposta Comercial - ESCOM STUDIO</h1>', '{isEn ? "Commercial Proposal - ESCOM STUDIO" : "Proposta Comercial - ESCOM STUDIO"}</h1>');
content = content.replace('Data de Envio: {dateSent} | <span className="text-red-500 font-bold">Proposta válida por 3 dias</span>', '{t.dateSent} {dateSent} | <span className="text-red-500 font-bold">{t.validFor3Days}</span>');
content = content.replace('OLÁ {clientName?.toUpperCase() || \'\'},', '{isEn ? "HELLO" : "OLÁ"} {clientName?.toUpperCase() || \'\'},');
content = content.replace('Aqui você vai conhecer um pouco do meu trabalho e as informações para o projeto da sua empresa, como prazo, formas de pagamento e o valor do investimento.', '{t.heroSubtitle(clientName)}');

// Stats PDF
content = content.replace('<p className="font-bold">+200 Clientes Atendidos</p>', '<p className="font-bold">{t.clientsServed}</p>');
content = content.replace('<p className="font-bold">Clientes em mais de 5 Países</p>', '<p className="font-bold">{t.countriesServed}</p>');
content = content.replace('<p className="font-bold">+15 Anos de experiência</p>', '<p className="font-bold">{t.yearsExp}</p>');

content = content.replace('Trabalhos que falam por si.</h2>', '{t.worksSpeak}</h2>');
content = content.replace('Alguns dos projetos mais recentes onde aplicamos design estratégico para gerar resultados reais.</p>', '{t.recentProjectsDesc}</p>');
content = content.replace('Muito além do pixel.</h3>', '{t.farBeyond} {t.thePixel}</h3>');

content = content.replace(
  'A senioridade não é sobre o tempo, mas sobre a capacidade de prever o que o mercado precisa antes mesmo de ser solicitado. Com 15 anos no ativo, a minha missão é eliminar o "ruído" visual para deixar apenas o que importa: a mensagem e a conversão.</p>',
  '{t.aboutDesc1}</p>'
);
content = content.replace(
  '<p className="mb-4 italic">"Sou casado com a melhor psicóloga do mundo, meu amor Ingrid. Temos um gatinho persa, o Oreo, e alguns peixinhos. Quando não estou criando designs, estou aproveitando a vida ao lado da minha família."</p>',
  '<p className="mb-4 italic">"{t.aboutQuote}"</p>'
);
content = content.replace(
  '<p className="mb-8">Atualmente, como Diretor de Arte, integro tecnologia e emoção para criar jornadas digitais que ficam gravadas na memória — e no extrato bancário dos meus clientes.</p>',
  '<p className="mb-8">{t.aboutDesc2}</p>'
);

// Processo PDF
content = content.replace('Entenda um pouco do processo de Criação</h2>', '{t.creationProcess}</h2>');
content = content.replace('<h4 className="text-[#2EFF00] font-bold mb-1">Otimização Extrema da Página</h4>', '<h4 className="text-[#2EFF00] font-bold mb-1">{t.optTitle}</h4>');
content = content.replace('<p className="text-sm">Durante esta fase, dedico-me à otimização integral da página, visando assegurar um carregamento rápido e eficiente. Velocidade é crucial para as conversões e para evitar abandonos.</p>', '<p className="text-sm">{t.optDesc}</p>');

// Report PDF
content = content.replace('Performance Report</h2>', '{t.perfReport}</h2>');
content = content.replace('<p className="mb-1">Grade: <strong>A</strong></p>', '<p className="mb-1">{t.grade}: <strong>A</strong></p>');
content = content.replace('<p className="mb-1">Performance: <strong>100%</strong></p>', '<p className="mb-1">{isEn ? "Performance" : "Desempenho"}: <strong>100%</strong></p>');
content = content.replace('<p className="mb-1">Structure: <strong>99%</strong></p>', '<p className="mb-1">{isEn ? "Structure" : "Estrutura"}: <strong>99%</strong></p>');

// Info PDF
content = content.replace('01 Prazo de Entrega</h4>', '01 {t.delivDeadline}</h4>');
content = content.replace('O prazo de entrega de uma página é de <strong>10 a 15 dias úteis</strong>, podendo ser entregue antes dependendo do fluxo de demandas ou da necessidade do cliente.</p>', '{t.delivDesc}</p>');
content = content.replace('02 Formas de Pagamento</h4>', '02 {t.paymentTerms}</h4>');
content = content.replace('A partir do pagamento de <strong>50% do valor</strong> começamos o projeto e depois que o serviço for entregue e aprovado, os outros 50%.</p>', '{t.paymentTermsDesc}</p>');
content = content.replace('03 Meios de Pagamento</h4>', '03 {t.paymentMethods}</h4>');
content = content.replace('Você pode pagar através de PIX ou transferência bancária internacional. Se preferir, pode parcelar no cartão de crédito (plataforma com taxas aplicáveis).</p>', '{t.paymentMethodsDesc}</p>');

// Observações PDF
content = content.replace('Observações</h4>', '{t.obs}</h4>');

// Investimento PDF
content = content.replace('Investimento</h3>', '{t.investment}</h3>');
content = content.replace('SERVIÇOS INCLUSOS</h4>', '{t.servicesInc}</h4>');
content = content.replace(
  'p className="text-4xl text-[#2EFF00] font-black leading-none mb-2">R$ {totalValueSplit[0]},{totalValueSplit[1] || \'00\'}</p>',
  'p className="text-4xl text-[#2EFF00] font-black leading-none mb-2">{isEn ? "$" : "R$"} {totalValueSplit[0]}{isEn ? "." : ","}{totalValueSplit[1] || \'00\'}</p>'
);
content = content.replace('Essa Proposta com esse valor promocional é válida por 3 dias.</p>', '{t.validDesc}</p>');

// Rodapé PDF e CTAs
content = content.replace('Gostou? Clique abaixo para começarmos!</p>', '{isEn ? "Liked it? Click below to get started!" : "Gostou? Clique abaixo para começarmos!"}</p>');
content = content.replace('>QUERO FECHAR COM VOCÊ</a>', '>{t.closeCta}</a>');
content = content.replace('Ainda Ficou com alguma dúvida?</p>', '{t.questions}</p>');
content = content.replace('>Clique aqui para me chamar no WhatsApp</a>', '>{t.chatWpp}</a>');
content = content.replace('<p>© 2026 Todos os direitos reservados.</p>', '<p>{t.allRights}</p>');

// Truncamento final
content = content.replace(/<truncated[\s\S]*$/, "");
if (!content.trim().endsWith("}")) {
  content = content.trim();
  if (content.endsWith("</div>")) {
    content += "\n    </div>\n  );\n}";
  } else if (content.endsWith(");")) {
    content += "\n}";
  } else if (!content.endsWith("}")) {
    content += "\n      </div>\n    </div>\n  );\n}";
  }
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log("Substituições cirúrgicas concluídas!");
console.log("Final content lines:", content.split('\n').length);
