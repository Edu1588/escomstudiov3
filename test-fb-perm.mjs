import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, setDoc, doc, deleteDoc, addDoc } from 'firebase/firestore';
import fs from 'fs';

async function test() {
  try {
    const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf-8'));
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const snap = await getDocs(collection(db, "leads"));
    console.log("Leads read success, count:", snap.size);
    
    console.log("Testing write with addDoc...");
    const docRef = await addDoc(collection(db, "test_collection"), {
      title: "Test Write Auto ID",
      createdAt: Date.now()
    });
    console.log("Write success, auto ID:", docRef.id);
    
    console.log("Testing delete...");
    await deleteDoc(docRef);
    console.log("Delete success!");
    process.exit(0);
  } catch (e) {
    console.error("Error during operations:", e);
    process.exit(1);
  }
}
test();
