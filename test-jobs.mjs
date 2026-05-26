import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

async function test() {
  try {
    const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf-8'));
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    const snap = await getDocs(collection(db, "jobs"));
    console.log("Jobs read success, count:", snap.size);
    process.exit(0);
  } catch (e) {
    console.error("Error:", e);
    process.exit(1);
  }
}
test();
