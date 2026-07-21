import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function main() {
  const snap = await getDocs(collection(db, "generated_sites"));
  console.log("=== SITES NA COLAÇÃO generated_sites ===");
  snap.forEach(doc => {
    console.log(`- ID: ${doc.id} | Company: ${doc.data().companyName} | Status: ${doc.data().status}`);
  });
}

main().catch(console.error);
