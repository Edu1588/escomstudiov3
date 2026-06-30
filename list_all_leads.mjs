import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync(new URL('./firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function listAll() {
  try {
    console.log("=== LISTA DE PROPOSTAS ===");
    const proposalsSnap = await getDocs(collection(db, 'proposals'));
    const list = [];
    proposalsSnap.forEach(doc => {
      const data = doc.data();
      list.push({
        id: doc.id,
        clientName: data.clientName,
        company: data.company,
        createdAt: data.createdAt,
        status: data.status,
        expiresAt: data.expiresAt,
        budget: data.budget,
        currency: data.currency || 'BRL'
      });
    });
    
    // Ordenar por data de criação descrescente
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    list.forEach(p => {
      console.log(`SLUG: ${p.id}`);
      console.log(`CLIENTE: ${p.clientName} | EMPRESA: ${p.company}`);
      console.log(`CRIADO EM: ${p.createdAt} | STATUS: ${p.status}`);
      console.log(`VALIDADE: ${p.expiresAt}`);
      console.log(`VALOR: ${p.currency} ${p.budget || 'Calculado'}`);
      console.log(`URL PROPOSTA: https://escom-studio.vercel.app/${p.id}`);
      console.log("-------------------------------------------------");
    });
  } catch (err) {
    console.error("Erro ao listar:", err);
  }
}

listAll();
