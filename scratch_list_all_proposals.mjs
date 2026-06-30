import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync(new URL('./firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function listAll() {
  try {
    const proposalsSnap = await getDocs(collection(db, 'proposals'));
    console.log(`Total de propostas encontradas: ${proposalsSnap.size}`);
    proposalsSnap.forEach(doc => {
      console.log(`- ID: ${doc.id}`);
      const data = doc.data();
      console.log(`  Cliente: ${data.clientName}`);
      console.log(`  Empresa: ${data.company}`);
      console.log(`  Valor: ${data.budget || data.valor}`);
      console.log(`  Status: ${data.status}`);
    });
  } catch (err) {
    console.error("Erro ao listar propostas:", err);
  }
}

listAll();
