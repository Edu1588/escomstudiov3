import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Inicializar Firebase
const firebaseConfig = JSON.parse(fs.readFileSync(new URL('./firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const goodSites = [
  {
    id: "dominium-contabilidade",
    companyName: "Dominium Contabilidade",
    niche: "Contabilidade",
    originalUrl: "https://dominiumcontabilidade.com.br",
    deployedUrl: "https://escom-studio.vercel.app/template-dominium-contabilidade/index.html",
    template: "template-dominium-contabilidade",
    phone: "(31) 98888-7777",
    address: "Av. do Contorno, 6500 - Savassi, Belo Horizonte - MG, 30110-044",
    analysis: `### Auditoria do Site Original (dominiumcontabilidade.com.br)
Durante a fase de mineração do negócio **Dominium Contabilidade**, identificamos um site institucional engessado e com excesso de termos técnicos que afasta o empresário moderno.

1. **Falta de Foco em Soluções:** O site foca em obrigações fiscais ao invés de atuar como um parceiro de inteligência de negócios.
2. **Navegação Complexa:** O cliente precisa dar 4 a 5 cliques para encontrar uma forma de contato simples.
3. **Design Visual Datado:** Uso de cores corporativas genéricas sem contraste adequado para leitura móvel rápida.

---

### Análise Estratégica do Novo Protótipo (Score 98)
Redesenhamos toda a presença da Dominium focando no posicionamento de inteligência tributária e crescimento corporativo:

**1. Dark Theme Premium**
Adotamos uma abordagem visual de alta credibilidade e sofisticação usando tons de grafite profundo e ouro champanhe para remeter a prestígio e segurança.

**2. Conversão Descomplicada**
Destaque para botões de agendamento de diagnóstico fiscal gratuito com redirecionamento de um clique para o WhatsApp.

**3. Apresentação Limpa de Serviços**
Seções divididas de forma clara entre BPO Financeiro, Planejamento Tributário e Abertura de Empresas.

### Por que a ESCOM Studio?
Design sob medida focado em converter tráfego qualificado em clientes recorrentes de contabilidade consultiva.`
  },
  {
    id: "clinica-belini",
    companyName: "Clínica Belini - Estética Avançada",
    niche: "Estética Avançada",
    originalUrl: "https://clinicabelini.com.br",
    deployedUrl: "https://escom-studio.vercel.app/template-belini/index.html",
    template: "template-belini",
    phone: "(31) 97777-6666",
    address: "Av. Afonso Pena, 2500 - Funcionários, Belo Horizonte - MG, 30130-007",
    analysis: `### Auditoria do Site Original (clinicabelini.com.br)
O site da Clínica Belini apresenta lentidão e falta de clareza nas especialidades de rejuvenescimento e procedimentos injetáveis.

1. **Excesso de Textos Clínicos:** Falta apelo estético visual imediato que conecte o paciente ao desejo do resultado.
2. **Ausência de Prova Social Estruturada:** Sem avaliações integradas ou depoimentos de destaque.
3. **Fricção de Contato:** Agendamento dependente de formulários complexos e sem botão ativo de WhatsApp na tela principal.

---

### Análise Estratégica do Novo Protótipo (Score 95)
Redesenhamos toda a jornada para elevar o posicionamento da clínica:

**1. Design Boutique Minimalista**
Uma paleta luxuosa e clean em ouro e branco que evoca higiene, beleza e atendimento personalizado de alto padrão.

**2. Agendamento Sem Fricção**
Gatilho rápido para contato com assessoria de agendamento em 1 clique via WhatsApp integrado.

**3. Galeria de Tratamentos Focada**
Apresentação sofisticada de toxina botulínica, bioestimuladores de colágeno e harmonização.

### Por que a ESCOM Studio?
Desenvolvimento focado em exclusividade. Criamos layouts que valorizam a beleza do consultório e captam clientes de alto ticket.`
  },
  {
    id: "clinica-implart",
    companyName: "Clínica ImplArt",
    niche: "Odontologia Premium e Alta Tecnologia",
    originalUrl: "https://www.implart.com.br",
    deployedUrl: "https://escom-studio.vercel.app/template-clinica/index.html",
    template: "template-clinica",
    phone: "(11) 96666-5555",
    address: "Rua Vergueiro, 2087 - Vila Mariana, São Paulo - SP, 04101-000",
    analysis: `### Auditoria do Site Original (implart.com.br)
Durante a fase de mineração do negócio **Clínica ImplArt**, localizada em São Paulo, identificamos um site que, embora rico em conteúdo tecnológico, possui gargalos de conversão devido ao excesso de informação e um design levemente defasado para o público ultra-premium.

1. **Excesso Cognitivo:** O site original apresenta menus massivos e muito texto longo logo na primeira tela, o que desvia a atenção da conversão rápida para implantes.
2. **Fricção no Contato:** O usuário precisa pesquisar na página para encontrar um direcionamento claro de agendamento.
3. **Estética:** O visual atual é puramente clínico (paleta em branco e violeta), com um layout engessado.

---

### Análise Estratégica do Novo Protótipo (Score 95)
Redesenhamos a experiência digital da ImplArt para dominar o topo do funil (Odontologia Premium e Alta Tecnologia):

**1. Above-the-Fold de Alto Impacto (Hero Section)**
O paciente que acessa o link é recebido por um vídeo cinemático imersivo com carregamento hiper-rápido via CDN Cloudinary, seguido de um fade-in suave com a Headline de vendas de conversão direta.

**2. Psicologia de Cores & Design**
Rompemos a poluição do site original. A paleta utiliza uma abordagem minimalista de altíssimo padrão (Clean Design com espaços de respiro) e tipografia moderna (Inter/Outfit), evocando higiene impecável, clareza e tecnologia de ponta sem cansar os olhos do paciente.

**3. Otimização de Conversão e Contato**
O ícone genérico foi substituído pelo WhatsApp Oficial em SVG. Não há fricção: o agendamento está a apenas 1 clique de distância.

### Por que a ESCOM Studio?
Ajustamos a presença digital da ImplArt para focar na facilitação da jornada: **Day Clinic Digital** (tratamento rápido em até 48h devido ao laboratório próprio) e **Sedação Consciente** (conforto e eliminação absoluta da dor), convertendo leads qualificados diretamente para o WhatsApp.`
  },
  {
    id: "skozie-closet",
    companyName: "Skoziê Closet de Moda Feminina",
    niche: "Moda Feminina Premium",
    originalUrl: "",
    deployedUrl: "https://escom-studio.vercel.app/template-skozi-closet/index.html",
    template: "template-skozi-closet",
    phone: "(11) 95555-4444",
    address: "Rua Oscar Freire, 800 - Jardins, São Paulo - SP, 01426-000",
    analysis: `### Oportunidade Digital para Skoziê Closet
A Skoziê Closet necessita de uma plataforma digital imersiva que reflita o luxo e a exclusividade de sua marca de moda feminina.

1. **Presença Virtual Única:** Criamos uma vitrine digital sofisticada para atrair o público interessado em coleções exclusivas.
2. **Visual Imersivo:** Tipografia refinada e layout estruturado para apresentar tendências de alta costura.
3. **Contato Direto Personalizado:** Botão de WhatsApp direcionando para atendimento com personal stylist.

---

### Estrutura Recomendada para o Novo Protótipo (Score 96)
Desenvolvemos uma experiência de visualização fluida e de alto padrão:

**1. Estética Editorial**
Layout limpo inspirado em revistas de moda internacionais, com tipografia sofisticada e grids harmônicos.

**2. Exibição de Coleções**
Seções amplas para fotos em alta resolução, com foco total nos detalhes dos tecidos e modelagens.

**3. Agendamento de Atendimento VIP**
Conversão focada em agendar visitas exclusivas ao showroom ou assessoria online.

### Por que a ESCOM Studio?
Unimos tecnologia e design sofisticado para marcas de moda que desejam se destacar pela elegância e experiência de compra única.`
  },
  {
    id: "auto-mecanica-silva",
    companyName: "Auto Mecânica Silva",
    niche: "Oficina Mecânica",
    originalUrl: "https://mecanicasilva.com.br",
    deployedUrl: "https://escom-studio.vercel.app/template-mecanica-silva/index.html",
    template: "template-mecanica-silva",
    phone: "(11) 94444-3333",
    address: "Rua Clélia, 1500 - Lapa, São Paulo - SP, 05042-000",
    analysis: `### Auditoria do Site Original (mecanicasilva.com.br)
A presença digital antiga da Auto Mecânica Silva carecia de credibilidade e transparência para o motorista moderno.

1. **Falta de Transparência:** Ausência de detalhes sobre diagnóstico e equipamentos utilizados.
2. **Contatos Antigos:** Sem facilidade de agendamento por WhatsApp, dependendo de ligações telefônicas clássicas.
3. **Interface Confusa:** Poluição visual com banners promocionais genéricos e sem foco em serviços.

---

### Análise Estratégica do Novo Protótipo (Score 94)
Redesenhamos a experiência para gerar confiança absoluta:

**1. Transparência Diagnóstica**
Destaque para o sistema de diagnóstico digital com fotos e vídeos enviados diretamente para o WhatsApp do cliente.

**2. Agendamento Simples**
Redução dos cliques para agendamento de revisão geral em apenas um botão flutuante.

**3. Apresentação Técnica**
Destaque para equipamentos de alinhamento computadorizado 3D e equipe certificada.

### Por que a ESCOM Studio?
Metodologia focada em remover a ansiedade da manutenção de carros por meio de interfaces claras e fluxos de agendamento objetivos.`
  },
  {
    id: "miami-chiropractic",
    companyName: "Chiropractic & Movement",
    niche: "Quiropraxia e Alinhamento Corporal",
    originalUrl: "https://miamichiropracticwellness.com/",
    deployedUrl: "https://escom-studio.vercel.app/template-chiroandmovement/index.html",
    template: "template-chiroandmovement",
    phone: "+1 (305) 322-4007",
    address: "1149 NW 36th St, Miami, FL 33127, United States",
    analysis: `### Original Website Audit (miamichiropracticwellness.com)
The chiropractic website has conversion leaks due to slow loading speeds and lack of clear call to actions on the mobile header.

1. **High Cognitive Load:** Excessively technical medical texts instead of focusing on pain relief benefits.
2. **Friction in Booking:** Long forms to schedule a simple adjustment session.
3. **Outdated Layout:** The interface does not reflect the premium quality of the clinical team.

---

### Strategic Analysis of the New Prototype (Score 96)
We designed a modern, high-performance experience focused on trust:

**1. Premium Glassmorphic Design**
A sleek dark interface with blue accents and glassmorphism elements, evoking wellness, technology, and professional care.

**2. Instant WhatsApp Scheduling**
Direct button for fast appointment setup on the floating menu.

**3. Clear Care Benefits**
Faceted cards showcasing Spinal Adjustment, Sports Recovery, and Posture Correction with high-end photography.

### Why ESCOM Studio?
We specialize in creating bespoke, high-converting digital interfaces for medical and wellness brands.`
  },
  {
    id: "oral-fix-implantes",
    companyName: "Oral Fix Implantes",
    niche: "Implantes Dentários",
    originalUrl: "https://oralfix.com.br",
    deployedUrl: "https://escom-studio.vercel.app/template-oralfix/index.html",
    template: "template-oralfix",
    phone: "(11) 93333-2222",
    address: "Av. Rebouças, 3000 - Pinheiros, São Paulo - SP, 05402-600",
    analysis: `### Auditoria do Site Original (oralfix.com.br)
O site da Oral Fix possuía um layout clínico genérico com baixo contraste e sem diferenciação comercial.

1. **Falta de Diferenciais:** Sem menção de tecnologias cruciais como carga imediata e scanner 3D intraoral.
2. **Depoimentos Invisíveis:** Avaliações escondidas e sem fotos de pacientes satisfeitos.
3. **Fluxo Comercial Lento:** Sem canais de contato rápidos.

---

### Análise Estratégica do Novo Protótipo (Score 93)
Posicionamos a Oral Fix como referência em reabilitação oral de alta performance:

**1. Design Limpo e Profissional**
Branco e azul médico em um layout equilibrado que passa segurança, competência técnica e assepsia.

**2. Destaque de Tecnologia in-house**
Seção valorizando o Scanner 3D e a possibilidade de sorriso novo em até 72 horas (Carga Imediata).

**3. Prova Social no Centro**
Carrossel estruturado com depoimentos de pacientes reais e pontuação 5 estrelas em evidência.

### Por que a ESCOM Studio?
Desenvolvimento técnico de Landing Pages focadas em transformar visitas em agendamentos de implantes de alto valor.`
  }
];

async function restore() {
  console.log("Restaurando os 7 sites ótimos originais no Firestore...");
  
  for (const site of goodSites) {
    const siteProjectId = "site_auto_" + site.id;
    const dbLeadId = "lead_auto_" + site.id;
    const proposalId = "proposta-escom-" + site.id;
    const score = Math.floor(Math.random() * (98 - 93 + 1)) + 93;
    const isUS = site.id === "miami-chiropractic";

    const leadData = {
      title: site.companyName,
      address: site.address,
      phone: site.phone,
      website: site.originalUrl,
      rating: 5,
      ratingCount: 30 + Math.floor(Math.random() * 50),
      placeId: dbLeadId,
      status: "approved",
      niche: site.niche,
      auditData: { summary: "Auditoria UX consolidada e aprovada." },
      sitePlan: {
        summary: `Reposicionamento digital de ${site.companyName}.`,
        colors: `Premium combinando com o nicho.`,
        tone: "Profissional e sofisticado.",
        differentiators: "Design limpo, conversão rápida e carregamento rápido.",
        sections: [{ title: "Hero", description: "Dobra principal focada em conversão rápida." }]
      },
      score: score,
      createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000 // Criado há 5 dias
    };

    const proposalData = {
      id: proposalId,
      clientName: site.companyName.split(" ")[0],
      email: `contato@${site.id}.com.br`,
      phone: site.phone.replace(/[^0-9]/g, ""),
      company: site.companyName,
      budget: isUS ? "990.00" : "990,00",
      selectedServices: [{ id: 1, name: "Landing Page Alta Conversão", price: isUS ? "990" : "990,00" }],
      observations: "Proposta consolidada e aceita.",
      status: "aprovada",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      sentToSheets: true,
      isAmerican: isUS,
      currency: isUS ? "USD" : "BRL"
    };

    const siteData = {
      score: score,
      companyName: site.companyName,
      niche: site.niche,
      originalUrl: site.originalUrl,
      website: site.originalUrl,
      status: "approved",
      analysis: site.analysis,
      deployedUrl: site.deployedUrl,
      htmlUrl: null,
      htmlContent: "", 
      createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now(),
      placeId: dbLeadId,
      projectId: siteProjectId
    };

    try {
      await setDoc(doc(db, "leads", dbLeadId), leadData);
      await setDoc(doc(db, "proposals", proposalId), proposalData);
      await setDoc(doc(db, "generated_sites", siteProjectId), siteData);
      console.log(`✅ Restaurado: ${site.companyName}`);
    } catch (e) {
      console.error(`❌ Erro ao restaurar ${site.companyName}:`, e.message);
    }
  }

  console.log("\nProcesso de restauração concluído!");
  process.exit(0);
}

restore().catch(console.error);
