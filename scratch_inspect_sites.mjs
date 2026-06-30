import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync(new URL('./firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function run() {
  console.log("--- GENERATED SITES ---");
  const sitesSnap = await getDocs(collection(db, 'generated_sites'));
  sitesSnap.forEach(doc => {
    console.log(`ID: ${doc.id}`);
    console.log(JSON.stringify(doc.data(), null, 2));
    console.log("----------------------");
  });

  console.log("\n--- LEADS ---");
  const leadsSnap = await getDocs(collection(db, 'leads'));
  leadsSnap.forEach(doc => {
    console.log(`ID: ${doc.id}`);
    console.log(JSON.stringify(doc.data(), null, 2));
    console.log("----------------------");
  });
}

run();
