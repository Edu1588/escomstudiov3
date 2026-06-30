import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync(new URL('../firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function run() {
  try {
    const sitesSnapshot = await getDocs(collection(db, 'generated_sites'));
    for (const d of sitesSnapshot.docs) {
      const data = d.data();
      if (data.companyName === 'Clínica ImplArt') {
        const novaAnalise = `### Auditoria do Site Original (implart.com.br)
Durante a fase de mineração do negócio **Clínica ImplArt**, localizada em São Paulo, identificamos um site que, embora rico em conteúdo tecnológico, possui gargalos de conversão devido ao excesso de informação e um design levemente defasado para o público ultra-premium.

1. **Excesso Cognitivo:** O site original apresenta menus massivos e muito texto longo logo na primeira tela, o que desvia a atenção da conversão rápida para implantes.
2. **Fricção no Contato:** O usuário precisa pesquisar na página para encontrar um direcionamento claro de agendamento.
3. **Estética:** O visual atual é puramente clínico (paleta em branco e violeta), com um layout engessado.

---

### Análise Estratégica do Novo Protótipo (Score 95)
Redesenhamos a experiência digital da **ImplArt** para dominar o topo do funil (Odontologia Premium e Alta Tecnologia):

**1. Above-the-Fold de Alto Impacto (Hero Section)**
O paciente que acessa o link é recebido por um vídeo cinemático imersivo com carregamento hiper-rápido via CDN Cloudinary, seguido de um *fade-in* suave com a Headline de vendas de conversão direta.

**2. Psicologia de Cores & Design**
Rompemos a poluição do site original. A paleta utiliza uma abordagem minimalista de altíssimo padrão (*Clean Design* com espaços de respiro) e tipografia moderna (Inter/Outfit), evocando **higiene impecável, clareza e tecnologia de ponta** sem cansar os olhos do paciente.

**3. Otimização de Conversão e Contato**
O ícone genérico foi substituído pelo **WhatsApp Oficial em SVG**. Não há fricção: o agendamento está a apenas 1 clique de distância, com *Call-to-Action* agressivo para 'Agendar Avaliação com Tomografia'.

> *Análise gerada cruzando os dados da presença digital da 'Clínica ImplArt' com as métricas de conversão exigidas pela ESCOM Studio.*
`;
        await updateDoc(doc(db, 'generated_sites', d.id), { 
          analysis: novaAnalise
        });
        console.log('Análise da ImplArt atualizada no Firebase!');
      }
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
