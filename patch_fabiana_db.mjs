import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync(new URL('./firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function fixFabiana() {
  try {
    const docRef = doc(db, 'generated_sites', '7160536542187121912');
    await updateDoc(docRef, {
      deployedUrl: '/template-fabiana/index.html'
    });
    console.log("DB da Fabiana atualizado para apontar para o novo template!");
  } catch (e) {
    console.error(e);
  }
}

fixFabiana();
