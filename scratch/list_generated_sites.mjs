import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync(new URL('../firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function listSites() {
  try {
    console.log("=== LISTA DE SITES GERADOS ===");
    const sitesSnap = await getDocs(collection(db, 'generated_sites'));
    sitesSnap.forEach(doc => {
      const data = doc.data();
      console.log(`Doc ID: ${doc.id}`);
      console.log(`EMPRESA: ${data.companyName} | NICHO: ${data.niche}`);
      console.log(`URL: ${data.deployedUrl}`);
      console.log("-------------------------------------------");
    });
  } catch (err) {
    console.error("Erro ao listar:", err);
  }
}

listSites();
