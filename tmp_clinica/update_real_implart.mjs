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
      if (data.companyName === 'Clínica Odontológica Restauração' || data.companyName === 'Clínica ImplArt') {
        const novaAnalise = `### Auditoria do Site Original (implart.com.br)
Durante a fase de mineração do negócio **Clínica ImplArt**, localizada na região de São Paulo, identificamos um site que, embora rico em conteúdo, possui gargalos de conversão devido ao excesso de informação e um design que pode ser modernizado para o público ultra-premium.

1. **Excesso Cognitivo:** O site original apresenta menus massivos e muito texto longo logo na primeira tela, o que desvia a atenção da conversão rápida para implantes.
2. **Fricção no Contato:** O usuário precisa pesquisar na página para encontrar um direcionamento claro de agendamento.
3. **Estética:** O visual atual é puramente clínico (branco/azul padrão).

---

### Análise Estratégica do Novo Protótipo (Score 95)
Redesenhamos a experiência digital da **ImplArt** para dominar o topo do funil (Odontologia Premium e Alta Tecnologia):

**1. Above-the-Fold de Alto Impacto (Hero Section)**
Removemos a rolagem inicial obrigatoriamente. O paciente que acessa o link é recebido por um vídeo cinemático de loading imersivo, seguido de um *fade-in* suave com a Headline focada no resultado final.

**2. Psicologia de Cores & Design**
Rompemos o padrão do mercado. A paleta utiliza um fundo *Dark Mode* sofisticado com acentos em Verde Neon/Ciano, evocando **tecnologia, higiene impecável e tratamento de ponta**. 

**3. Otimização de Conversão e Contato**
O ícone genérico foi substituído pelo **WhatsApp Oficial em SVG**. Não há fricção: o agendamento está a apenas 1 clique de distância.

> *Análise gerada cruzando os dados da presença digital da 'Clínica ImplArt' com as métricas de conversão exigidas pela ESCOM Studio.*
`;
        await updateDoc(doc(db, 'generated_sites', d.id), { 
          companyName: 'Clínica ImplArt',
          originalUrl: 'https://www.implart.com.br',
          analysis: novaAnalise
        });
        console.log('Site atualizado para ImplArt!');
      }
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
