import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync(new URL('./firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const keepSiteId = "site-nicho1-brasil-valuation";
const keepProposalId = "proposta-escom-nicho1-brasil-valuation";

async function cleanLegacy() {
  console.log("🔥 Limpando documentos antigos/legados do Firestore...");

  // 1. Coleção generated_sites
  const sitesSnap = await getDocs(collection(db, 'generated_sites'));
  for (const d of sitesSnap.docs) {
    if (d.id !== keepSiteId) {
      await deleteDoc(doc(db, 'generated_sites', d.id));
      console.log(`  Deletado generated_sites/${d.id}`);
    }
  }

  // 2. Coleção proposals
  const proposalsSnap = await getDocs(collection(db, 'proposals'));
  for (const d of proposalsSnap.docs) {
    if (d.id !== keepProposalId) {
      await deleteDoc(doc(db, 'proposals', d.id));
      console.log(`  Deletado proposals/${d.id}`);
    }
  }

  console.log("✅ Limpeza completa! Apenas o site atual (site-nicho1-brasil-valuation) foi mantido no Firestore.");
}

cleanLegacy().catch(console.error);
