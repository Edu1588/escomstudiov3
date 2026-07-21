import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync(new URL('./firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkSites() {
  console.log("=== LISTANDO TODOS OS DOCUMENTOS DA COLEÇÃO 'generated_sites' ===");
  const snapshot = await getDocs(collection(db, 'generated_sites'));
  console.log(`Total de documentos em generated_sites: ${snapshot.size}`);
  snapshot.forEach(doc => {
    const d = doc.data();
    console.log(`- ID: ${doc.id} | Empresa: ${d.companyName || d.clientName || 'N/A'} | Status: ${d.status}`);
  });

  console.log("\n=== LISTANDO TODOS OS DOCUMENTOS DA COLEÇÃO 'proposals' ===");
  const propSnap = await getDocs(collection(db, 'proposals'));
  console.log(`Total de documentos em proposals: ${propSnap.size}`);
  propSnap.forEach(doc => {
    const d = doc.data();
    console.log(`- ID: ${doc.id} | Empresa: ${d.companyName || d.clientName || 'N/A'}`);
  });
}

checkSites().catch(console.error);
