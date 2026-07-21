import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function main() {
  const ids = ["site_auto_gio-estetica", "site_auto_clinica-pillar", "site_auto_novatech-automotive"];
  for (const id of ids) {
    const snap = await getDoc(doc(db, "generated_sites", id));
    if (snap.exists()) {
      const data = snap.data();
      console.log(`=== ID: ${id} ===`);
      console.log(`deployedUrl: ${data.deployedUrl}`);
      console.log(`htmlUrl: ${data.htmlUrl}`);
      console.log(`has htmlContent: ${!!data.htmlContent}`);
      if (data.htmlContent) {
        console.log(`htmlContent length: ${data.htmlContent.length}`);
      }
    } else {
      console.log(`=== ID: ${id} NÃO ENCONTRADO ===`);
    }
  }
}

main().catch(console.error);
