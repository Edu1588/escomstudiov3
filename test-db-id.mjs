import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

async function testWithDbId() {
  try {
    const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf-8'));
    const app = initializeApp(firebaseConfig);
    
    console.log("Testing with (default)...");
    const dbWithId = getFirestore(app, "(default)");
    const snap1 = await getDocs(collection(dbWithId, "leads"));
    console.log("Success with (default), size:", snap1.size);
  } catch (e) {
    console.error("Error with (default):", e);
  }

  try {
    const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf-8'));
    const app = initializeApp(firebaseConfig);
    
    console.log("Testing without (default)...");
    const dbNoId = getFirestore(app);
    const snap2 = await getDocs(collection(dbNoId, "leads"));
    console.log("Success without (default), size:", snap2.size);
    process.exit(0);
  } catch (e) {
    console.error("Error without (default):", e);
    process.exit(1);
  }
}
testWithDbId();
