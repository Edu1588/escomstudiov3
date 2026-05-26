import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import fs from 'fs';

async function testAuth() {
  try {
    const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf-8'));
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    console.log("Signing in anonymously...");
    const userCredential = await signInAnonymously(auth);
    console.log("Success! UID:", userCredential.user.uid);

    console.log("Testing write with auth...");
    const docRef = await addDoc(collection(db, "leads"), {
      title: "Test Write Auth-ID",
      createdAt: Date.now()
    });
    console.log("Write success, auto ID:", docRef.id);
    process.exit(0);
  } catch (e) {
    console.error("Auth test failed:", e);
    process.exit(1);
  }
}
testAuth();
