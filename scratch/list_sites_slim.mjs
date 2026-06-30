import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync(new URL('../firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function listSites() {
  try {
    const sitesSnap = await getDocs(collection(db, 'generated_sites'));
    console.log("=== LISTA DE SITES GERADOS (COLLECTION: generated_sites) ===");
    sitesSnap.forEach(doc => {
      const data = doc.data();
      console.log(`ID: ${doc.id}`);
      console.log(`  Empresa: ${data.companyName || data.name}`);
      console.log(`  deployedUrl: ${data.deployedUrl || 'N/A'}`);
      console.log(`  htmlUrl: ${data.htmlUrl || 'N/A'}`);
      console.log(`  status: ${data.status || 'N/A'}`);
      console.log(`  niche: ${data.niche || 'N/A'}`);
      console.log("------------------------");
    });
  } catch (err) {
    console.error("Erro ao listar sites:", err);
  }
}

listSites();
