import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync(new URL('./firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function run() {
  try {
    const slug = "proposta-escom-teste-planilha";
    const proposal = {
      id: slug,
      clientName: "Cliente Teste Integracao",
      email: "teste@escomstudio.com.br",
      phone: "13981062787",
      company: "Teste Integracao LP",
      budget: "4.500,00",
      selectedServices: [
        { id: 1, name: "Landing Page Alta Conversão", price: "2.200,00" },
        { id: 5, name: "Identidade Visual", price: "2.300,00" }
      ],
      observations: "Proposta gerada automaticamente para validação do webhook do Google Sheets.",
      status: 'pendente', 
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 dias atrás
      expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      sentToSheets: false
    };

    console.log("Criando proposta de teste no Firestore...");
    await setDoc(doc(db, "proposals", slug), proposal);
    console.log("Proposta de teste criada com sucesso!");
    
  } catch (err) {
    console.error("Erro ao criar proposta de teste:", err);
  }
}

run();
