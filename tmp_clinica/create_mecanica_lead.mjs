import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync(new URL('../firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const analysisMarkdown = `### 01. Psicografia & Avatares de Compra

#### Mapeamento de Dores e Traumas:
- **Trauma do Orçamento Surpresa:** O cliente deixa o carro para resolver um barulho leve e a mecânica liga cobrando R$ 3.000 a mais por peças que não foram explicadas nem demonstradas.
- **Medo da "Enganação Técnica":** A desconfiança sistêmica de que mecânicos trocam peças desnecessárias ou usam peças recondicionadas vendidas como novas.
- **Falta de Feedback:** Ficar sem saber o status do conserto do carro, precisando ligar várias vezes para obter respostas vagas.
- **Desrespeito ao Prazo:** O carro prometido para sexta-feira às 18h só fica pronto no sábado ou na segunda-feira, quebrando a rotina familiar ou profissional do cliente.

#### Desejos Profundos:
- **Segurança Familiar:** Sentir que o carro está verdadeiramente seguro para rodar com quem mais ama na estrada sem riscos de quebra.
- **Previsibilidade Financeira:** Poder planejar exatamente quanto vai gastar sem surpresas ou aditivos ocultos no cartão de crédito.
- **Status de Dono Zeloso:** Orgulho de cuidar bem do seu patrimônio e manter o carro sempre em ótimo estado.
- **Comodidade Absoluta:** Resolver a manutenção sem precisar interromper sua jornada de trabalho ou rotina diária (Leva-e-Traz).

#### Objeções e Barreiras:
- **"O preço da concessionária é mais confiável":** Neutralizado com nossa garantia de 1 ano e uso de peças originais com nota fiscal eletrônica.
- **"Mecânica de bairro é tudo igual":** Neutralizado com nosso Diagnóstico Digital (fotos/vídeos do problema enviado via WhatsApp antes de executar).
- **"Não posso ficar sem carro hoje":** Neutralizado com agendamento prévio com hora marcada e serviço de Leva-e-Traz gratuito.

#### Níveis de Consciência:
- **Consciência de Problema (Maioria):** O cliente ouve um barulho estranho, sabe que tem um problema, mas adia a ida à oficina com medo de ser enganado ou do custo elevado.
- **Consciência da Solução:** Sabe que precisa de uma oficina de confiança, mas não tem referências objetivas além de indicações informais.

#### Criação de Avatares:
1. **Juliana (A Mãe de Família - 38 anos)**
   - *Perfil:* Mãe de duas crianças. Usa o carro diariamente para escola e atividades. Pânico de ficar parada no trânsito por quebra.
   - *Gancho:* "Manutenção preventiva transparente para você rodar com quem mais ama sem nenhuma preocupação. Explicamos tudo de forma simples."
2. **Roberto (O Motorista Profissional - 42 anos)**
   - *Perfil:* Motorista de aplicativo de 10-12h diárias. Carro é seu único sustento.
   - *Gancho:* "Oficina com hora marcada e diagnóstico ágil para seu instrumento de trabalho voltar a rodar no mesmo dia, sem surpresas no bolso."
3. **Fernando (O Profissional Autônomo - 45 anos)**
   - *Perfil:* Arquiteto atarefado. Valoriza tempo e odeia ir a oficinas sujas, barulhentas ou confusas.
   - *Gancho:* "Mecânica de alto padrão com Leva-e-Traz gratuito. Você aprova o orçamento pelo celular e nós cuidamos de tudo."

---

### 02. Análise Estratégica

#### Benchmarking de Concorrentes Locais:
1. **Mecânica do Zé (Oficina Tradicional):** Forte no bairro e barata, mas muito desorganizada, orçamentos manuais rasurados, sem nota fiscal.
2. **Auto Center Express (Franquia rápida):** Visual limpo e rápido, mas empurra serviços agressivamente ("empurroterapia") e carece de personalização.
3. **Oficina Multimarcas Silva:** Bom maquinário, mas atendimento lento e preço de concessionária sem benefícios claros.
4. **Bosch Car Service Autorizada:** Nome forte nacional e boa estrutura, mas burocrática e com preço extremamente elevado.
5. **Mecânica Speed (Importados):** Mão de obra qualificada para importados, mas inacessível para carros de classe média e fila de semanas.

#### Gaps de Mercado:
- **O Gap da Transparência Visual:** Nenhuma oficina local envia fotos/vídeos detalhados das peças desmontadas do carro antes do orçamento.
- **O Gap do Histórico Digital:** Clientes não possuem um histórico de revisões acessível e digital para valorizar o carro na futura venda.

#### Os 6 Pilares de Diferenciação Técnica (Silva Auto Center):
1. **Diagnóstico por Imagem:** Envio de vídeo do scanner e fotos das peças avariadas antes da execução.
2. **Orçamento Blindado:** O preço combinado no início é o preço pago no final. Itens extras exigem nova aprovação digital.
3. **Garantia Estendida de 1 Ano:** Cobertura de 12 meses para peças e serviços (dobro do mercado).
4. **Leva-e-Traz Gratuito:** Motorista da oficina busca e entrega o carro na casa ou trabalho do cliente com seguro total.
5. **Histórico Digital do Veículo:** Portal exclusivo para o cliente consultar todo o histórico de manutenções realizadas.
6. **Mecânica Limpa:** Ambiente higienizado, recepção climatizada com Wi-Fi e café espresso.

#### Posicionamento Oceano Azul:
- **"A Mecânica Transparente na Era Digital":** Atrair o público que odeia oficinas tradicionais (como mulheres e profissionais sem tempo) através da clareza e transparência total de orçamentos online.

#### Filtro de Comunicação:
- *Termo Gasto:* "Melhor preço da região" -> *Substituto:* "Garantimos o orçamento sem surpresas: o valor aprovado no WhatsApp é o valor pago."
- *Termo Gasto:* "Mão de obra qualificada" -> *Substituto:* "Técnicos certificados com treinamento anual em injeção eletrônica e diagnósticos por scanner."
- *Termo Gasto:* "Serviço rápido" -> *Substituto:* "Revisões básicas entregues em até 3 horas com agendamento online."

#### Tabela Comparativa de Posicionamento:
| Aspecto | Oficina Tradicional Comum | Silva Auto Center |
| :--- | :--- | :--- |
| **Aprovação de Serviços** | Por ligação de áudio, sem ver o que está quebrado. | Por link com fotos e relatório do scanner digital. |
| **Garantia** | 90 dias (mínimo legal). | 1 Ano de garantia completa. |
| **Leva-e-Traz** | O cliente precisa se virar ou pagar guincho. | Incluso gratuitamente com motorista próprio segurado. |
| **Ambiente** | Chão sujo, graxa por toda parte, sem sala de espera. | Ambiente limpo, recepção com café espresso e Wi-Fi. |
| **Preço** | Aparentemente barato, mas sobe com surpresas. | Preço justo (R$ 990 preventivo) e blindado. |
`;

async function run() {
  try {
    const docRef = doc(db, 'generated_sites', 'lead_mecanica');
    await setDoc(docRef, {
      projectId: "lead_mecanica",
      companyName: "Silva Auto Center",
      niche: "Oficina Mecânica",
      status: "pending",
      score: 92,
      htmlUrl: "https://escom-studio.vercel.app/template-silva-autocenter",
      analysis: analysisMarkdown,
      createdAt: serverTimestamp()
    });
    console.log("Silva Auto Center registrado em 'generated_sites' com sucesso!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
