import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync(new URL('./firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function cleanExceptAventis() {
  console.log("🧹 limpando Firestore 'generated_sites' mantendo apenas site-aventis-ma...");
  const snap1 = await getDocs(collection(db, 'generated_sites'));
  for (const document of snap1.docs) {
    if (document.id !== 'site-aventis-ma') {
      console.log(`Deletando de generated_sites: ${document.id}`);
      await deleteDoc(doc(db, 'generated_sites', document.id));
    }
  }

  console.log("🧹 limpando Firestore 'proposals' mantendo apenas proposta-escom-aventis-ma...");
  const snap2 = await getDocs(collection(db, 'proposals'));
  for (const document of snap2.docs) {
    if (document.id !== 'proposta-escom-aventis-ma') {
      console.log(`Deletando de proposals: ${document.id}`);
      await deleteDoc(doc(db, 'proposals', document.id));
    }
  }

  console.log("✅ Firestore limpo com sucesso! Apenas Aventis M&A está presente.");
}

cleanExceptAventis().catch(console.error);
