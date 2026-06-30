import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync(new URL('./firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function listLeads() {
  try {
    console.log("=== TODOS OS LEADS ===");
    const leadsSnap = await getDocs(collection(db, 'leads'));
    leadsSnap.forEach(doc => {
      const data = doc.data();
      console.log(`- ID: ${doc.id} | Title: ${data.title} | Website: ${data.website || 'Nenhum'}`);
    });

    console.log("\n=== TODOS OS SITES GERADOS ===");
    const sitesSnap = await getDocs(collection(db, 'generated_sites'));
    sitesSnap.forEach(doc => {
      const data = doc.data();
      console.log(`- ID: ${doc.id} | Company: ${data.companyName} | Status: ${data.status} | htmlUrl: ${data.htmlUrl} | deployedUrl: ${data.deployedUrl}`);
    });
  } catch (err) {
    console.error("Erro ao listar:", err);
  }
}

listLeads();
