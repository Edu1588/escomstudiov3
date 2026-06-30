import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.production.local' });

// Inicializa Firebase
const firebaseConfig = JSON.parse(readFileSync(new URL('./firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Dados Mockados da Dra. Fabiana Beltrão
const lead1AuditData = {
  "summary": "O site original apresenta sérios problemas de UX e CRO, focando demasiadamente em textos longos técnicos sobre tratamentos dentários, em vez de focar na conversão direta e no agendamento pelo WhatsApp. A ausência de provas sociais estruturadas e o visual engessado diminuem a conversão do público de alto padrão.",
  "brandAnalysis": {
    "companyName": "Dra. Fabiana Beltrão - Ortodontia & Estética Dental",
    "niche": "Dentista Curitiba",
    "audience": "Pacientes de classe A e B que buscam tratamentos estéticos de excelência (Invisalign, clareamento, lentes de contato).",
    "differentiators": "Atendimento ultra-personalizado, tecnologia alemã no diagnóstico e tratamentos estéticos integrados.",
    "tone": "Profissional, acolhedor e altamente qualificado.",
    "colors": "Verde menta pastel, dourado champanhe suave e branco clínico.",
    "primaryHex": "#B2DFDB"
  },
  "issues": [
    {
      "category": "heuristica",
      "tab": "HEURÍSTICAS DE NIELSEN",
      "title": "Inconsistência e Falta de Padrões",
      "description": "O site exibe elementos visuais confusos e ícones inconsistentes para navegação nas abas de tratamento.",
      "recommendation": "Implementar um menu persistente e ícones padronizados para guiar o paciente suavemente pelas especialidades."
    },
    {
      "category": "cores",
      "tab": "IDENTIDADE VISUAL E UI",
      "title": "Baixo Contraste e Tipografia Inadequada",
      "description": "O texto cinza claro sobre fundo branco torna a leitura difícil e cansativa para a maioria dos visitantes.",
      "recommendation": "Utilizar cores contrastantes como verde menta e azul escuro profundo para uma leitura confortável e tipografia elegante."
    },
    {
      "category": "vies",
      "tab": "VIESES COGNITIVOS E PSICOLOGIA",
      "title": "Ausência de Ancoragem Social",
      "description": "Depoimentos não estruturados que não ativam o gatilho da prova social no momento da decisão.",
      "recommendation": "Inserir depoimentos reais com fotos dos pacientes e avaliações do Google integradas no fluxo da página."
    },
    {
      "category": "arquitetura",
      "tab": "ARQUITETURA DA INFORMAÇÃO",
      "title": "Fricção no Agendamento",
      "description": "Muitos cliques e formulários longos para conseguir entrar em contato ou agendar uma avaliação inicial.",
      "recommendation": "Inserir botões de ação (CTA) diretos de WhatsApp e formulário simplificado de agendamento na dobra inicial."
    },
    {
      "category": "acessibilidade",
      "tab": "ACESSIBILIDADE E INCLUSÃO",
      "title": "Falta de Recursos de Acessibilidade",
      "description": "Imagens clínicas de antes e depois não possuem descrições de acessibilidade (Alt tags), impossibilitando leitura por leitores de tela.",
      "recommendation": "Otimizar todas as imagens com tags descritivas apropriadas e garantir compatibilidade com leitores de tela."
    }
  ]
};

const lead1AnalysisMd = `### Auditoria do Site Original (drafabianabeltrao.com.br)
Durante a fase de mineração do negócio **Dra. Fabiana Beltrão**, localizada em Curitiba, identificamos um site que possui sérios gargalos de conversão devido ao excesso de conteúdo institucional acadêmico e falta de usabilidade voltada para o paciente moderno.

1. **Excesso Cognitivo e Acadêmico:** O site original apresenta longos textos científicos detalhando procedimentos, o que desvia a atenção da conversão rápida para tratamentos estéticos.
2. **Fricção no Contato:** O agendamento depende de preenchimento de formulários longos, sem o direcionamento de um clique direto para o WhatsApp.
3. **Identidade Visual Envelhecida:** Utilização de tons pastéis sem contraste e imagens de bancos de dados genéricas que não transmitem o alto padrão do consultório.

---

### Análise Estratégica do Novo Protótipo (Score 95)
Redesenhamos toda a experiência digital da **Dra. Fabiana Beltrão** para convertê-la em uma referência estética digital:

**1. Landing Page Premium Minimalista**
Adotamos uma abordagem minimalista de altíssimo padrão (*Clean Design*) com amplos espaços de respiro, transmitindo higiene, exclusividade e modernidade.

**2. Paleta de Cores Sofisticada**
A paleta de cores utiliza o Mint Green e Pure White, criando um equilíbrio perfeito entre clínica médica e spa boutique, combinando a sofisticação da marca com a suavidade.

**3. Foco em Conversão Dinâmica (WhatsApp)**
Reduzimos os pontos de atrito para zero. O paciente pode agendar uma avaliação com apenas um clique no botão de WhatsApp oficial que acompanha a navegação.

### Why ESCOM Studio?
A ESCOM Studio desenvolve designs sob medida focados em exclusividade e alta performance. Não utilizamos templates genéricos: cada elemento é projetado estrategicamente para transformar visitantes em pacientes de alto valor.`;

// Dados Mockados da Silva & Associados Advocacia
const lead2AuditData = {
  "summary": "O site da advocacia possui uma estrutura excessivamente formal e de difícil compreensão para o cliente final. A navegação é complexa e o site peca pela ausência de um fluxo de agendamento ágil. A ausência de contraste adequado e de adaptabilidade para dispositivos móveis prejudica a captação de clientes corporativos.",
  "brandAnalysis": {
    "companyName": "Silva & Associados Advocacia",
    "niche": "Advocacia Empresarial",
    "audience": "Diretores, CEOs e donos de empresas de médio e grande porte que precisam de proteção e assessoria jurídica corporativa.",
    "differentiators": "Atendimento consultivo ágil, sólida reputação em direito tributário e empresarial e foco em mitigar riscos financeiros.",
    "tone": "Autoritativo, confiável e corporativo.",
    "colors": "Azul marinho clássico, ouro champanhe e branco.",
    "primaryHex": "#0A192F"
  },
  "issues": [
    {
      "category": "heuristica",
      "tab": "HEURÍSTICAS DE NIELSEN",
      "title": "Falta de Feedback no Agendamento",
      "description": "Ao tentar enviar uma dúvida jurídica, o formulário não fornece uma confirmação visual clara de envio bem-sucedido.",
      "recommendation": "Implementar uma janela de confirmação ou redirecionar o usuário para uma página de agradecimento com links úteis."
    },
    {
      "category": "cores",
      "tab": "IDENTIDADE VISUAL E UI",
      "title": "Estética Visual Ultrapassada",
      "description": "O design visual carece de refinamento moderno, assemelhando-se a sites da década de 2010 e diminuindo a percepção de sofisticação.",
      "recommendation": "Adotar um layout com tema escuro (Dark Theme), tipografia elegante em serifas e detalhes dourados sutis para demonstrar prestígio."
    },
    {
      "category": "vies",
      "tab": "VIESES COGNITIVOS E PSICOLOGIA",
      "title": "Falta do Efeito de Autoridade",
      "description": "O site não destaca de forma atraente os prêmios recebidos, publicações ou os perfis acadêmicos renomados dos sócios.",
      "recommendation": "Inserir uma seção de 'Sócios e Reconhecimentos' no topo da página, exibindo credenciais e selos corporativos de destaque."
    },
    {
      "category": "arquitetura",
      "tab": "ARQUITETURA DA INFORMAÇÃO",
      "title": "Sobrecarga de Artigos Técnicos",
      "description": "A página inicial está sobrecarregada de posts jurídicos complexos que dispersam o lead corporativo do foco comercial.",
      "recommendation": "Manter a página inicial limpa e criar uma seção de Blog separada, focando o fluxo principal na apresentação das soluções corporativas."
    },
    {
      "category": "acessibilidade",
      "tab": "ACESSIBILIDADE E INCLUSÃO",
      "title": "Contraste de Texto Inadequado em Rodapés",
      "description": "O texto do rodapé e links de termos de uso possuem cores cinza-escuro em fundos pretos, inviabilizando a leitura por deficientes visuais.",
      "recommendation": "Corrigir os contrastes e tamanhos das fontes nos rodapés para estarem em conformidade com as diretrizes do WCAG 2.1."
    }
  ]
};

const lead2AnalysisMd = `### Auditoria do Site Original (silvaassociados.adv.br)
Durante a fase de mineração do negócio **Silva & Associados Advocacia**, em São Paulo, identificamos gargalos clássicos de captação digital corporativa:

1. **Excesso de Textos Jurídicos complexos:** O site funciona mais como um repositório de artigos jurídicos de difícil compreensão do que como um canal de aquisição de clientes empresariais.
2. **Design Visual Frágil:** A paleta de cores e o layout remetem a portais governamentais antigos, não passando a sofisticação e segurança que uma holding ou empresa de grande porte busca.
3. **Ausência de CTAs Comerciais Rápidos:** Nenhuma opção prática de consulta ágil ou contato corporativo rápido com a equipe técnica do escritório.

---

### Análise Estratégica do Novo Protótipo (Score 98)
Criamos um ecossistema digital que transmite seriedade jurídica e sofisticação de mercado para o escritório:

**1. Design Dark Theme Exclusivo**
Construímos a landing page com um fundo azul marinho profundo (#0A192F) com detalhes e acentos em Ouro Champanhe, remetendo a prestígio, tradição e luxo silencioso.

**2. Clareza de Práticas de Atuação**
Substituímos o feed de notícias genéricas por seções focadas em soluções empresariais estruturadas (Direito Corporativo, Planejamento Tributário e Defesa Trabalhista).

**3. Gatilho de Autoridade e Agendamento**
Apresentamos depoimentos institucionais de CEOs e uma chamada clara de consultoria jurídica estratégica, viabilizada com o botão de WhatsApp oficial.

### Why ESCOM Studio?
A ESCOM Studio é especializada em desenvolver identidades virtuais premium para marcas de alto valor. Entendemos que o direito empresarial exige postura visual impecável. Nossos projetos traduzem autoridade e sofisticação sem clichês.`;

async function main() {
  // Lead 1: Dra. Fabiana Beltrão
  const lead1 = {
    id: "place_fabiana_beltrao_test",
    placeId: "place_fabiana_beltrao_test",
    title: "Dra. Fabiana Beltrão - Ortodontia & Estética Dental",
    phone: "(41) 99876-5432",
    website: "https://www.drafabianabeltrao.com.br",
    createdAt: Date.now(),
    rating: 5,
    status: "pending",
    niche: "Dentista Curitiba",
    ratingCount: 45,
    address: "Av. Batel, 1230 - Batel, Curitiba - PR, 80420-090",
    score: 95,
    auditData: lead1AuditData
  };

  const site1 = {
    id: "7160536542187121912", // Stitch Project ID
    projectId: "7160536542187121912",
    screenId: "3e8105a0590c4a90aa1abc7bdba1a0a7",
    companyName: lead1.title,
    niche: lead1.niche,
    score: 95,
    deployedUrl: "https://escom-studio.vercel.app/template-clinica/index.html",
    createdAt: Date.now(),
    htmlUrl: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzE0NjEzZGRkM2QwZjRhZmU5OTk2OGM3OThiYTA3OWI1EgsSBxCCh-eE8AMYAZIBIwoKcHJvamVjdF9pZBIVQhM3MTYwNTM2NTQyMTg3MTIxOTEy&filename=&opi=96797242",
    status: "pending",
    analysis: lead1AnalysisMd
  };

  // Lead 2: Silva & Associados
  const lead2 = {
    id: "place_silva_associados_test",
    placeId: "place_silva_associados_test",
    title: "Silva & Associados Advocacia",
    phone: "(11) 98765-4321",
    website: "https://www.silvaassociados.adv.br",
    createdAt: Date.now(),
    rating: 4.9,
    status: "pending",
    niche: "Advocacia Empresarial",
    ratingCount: 88,
    address: "Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-100",
    score: 98,
    auditData: lead2AuditData
  };

  const site2 = {
    id: "12943424911819052785", // Stitch Project ID
    projectId: "12943424911819052785",
    screenId: "2e19b9350f3c455589434b2f1c1c0857",
    companyName: lead2.title,
    niche: lead2.niche,
    score: 98,
    deployedUrl: "https://escom-studio.vercel.app/template-clinica/index.html",
    createdAt: Date.now(),
    htmlUrl: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzI3ZjNlNTJkNjhmZTRjZTc5MGI5ZmU5ZTU2MzBkY2MwEgsSBxCCh-eE8AMYAZIBJAoKcHJvamVjdF9pZBIWQhQxMjk0MzQyNDkxMTgxOTA1Mjc4NQ&filename=&opi=96797242",
    status: "pending",
    analysis: lead2AnalysisMd
  };

  try {
    // Salvar Lead 1 no Firestore
    console.log(`Salvando Lead 1 no Firestore (${lead1.id})...`);
    await setDoc(doc(db, "leads", lead1.id), lead1);
    await setDoc(doc(db, "generated_sites", site1.id), site1);

    // Salvar Lead 2 no Firestore
    console.log(`Salvando Lead 2 no Firestore (${lead2.id})...`);
    await setDoc(doc(db, "leads", lead2.id), lead2);
    await setDoc(doc(db, "generated_sites", site2.id), site2);

    console.log("=== SUCESSO: 2 leads e protótipos criados e registrados com sucesso no Firebase ===");
  } catch (error) {
    console.error("Falha ao salvar no Firestore:", error);
  }
}

main();
