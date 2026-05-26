import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();

async function run() {
  const firebaseConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'firebase-applet-config.json'), 'utf-8'));
  const firebaseApp = initializeApp(firebaseConfig);
  const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId || '(default)');

  try {
     const querySnapshot = await getDocs(collection(db, "leads"));
     const existingLeads = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
     console.log("existing leads:", existingLeads.length);
     
     const newDocRef = await addDoc(collection(db, "leads"), {
        title: "Test lead",
        address: "Test address",
        phone: "Test phone",
        website: "Test website",
        rating: 5,
        ratingCount: 1,
        placeId: Date.now().toString(),
        status: 'pending',
        createdAt: new Date().toISOString()
     });
     console.log("Created", newDocRef.id);
     process.exit(0);
  } catch(e) {
     console.error("Firebase Error:", e);
     process.exit(1);
  }
}
run();
