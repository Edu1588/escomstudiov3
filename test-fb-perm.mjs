import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

async function test() {
  try {
    const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf-8'));
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const snap = await getDocs(collection(db, "leads"));
    console.log("Leads success, count:", snap.size);
    snap.forEach(doc => console.log(doc.id, doc.data()));
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
