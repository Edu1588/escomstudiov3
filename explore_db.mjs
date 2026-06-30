import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, limit, query } from 'firebase/firestore';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync(new URL('./firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function explore() {
  try {
    console.log("=== COLEÇÃO: proposals ===");
    const proposalsSnap = await getDocs(query(collection(db, 'proposals'), limit(3)));
    proposalsSnap.forEach(doc => {
      console.log(`Doc ID: ${doc.id}`);
      console.log(JSON.stringify(doc.data(), null, 2));
      console.log("------------------------");
    });

    console.log("\n=== COLEÇÃO: generated_sites ===");
    const sitesSnap = await getDocs(query(collection(db, 'generated_sites'), limit(3)));
    sitesSnap.forEach(doc => {
      console.log(`Doc ID: ${doc.id}`);
      console.log(JSON.stringify(doc.data(), null, 2));
      console.log("------------------------");
    });

    console.log("\n=== COLEÇÃO: leads ===");
    const leadsSnap = await getDocs(query(collection(db, 'leads'), limit(3)));
    leadsSnap.forEach(doc => {
      console.log(`Doc ID: ${doc.id}`);
      console.log(JSON.stringify(doc.data(), null, 2));
      console.log("------------------------");
    });
  } catch (err) {
    console.error("Erro na exploração:", err);
  }
}

explore();
