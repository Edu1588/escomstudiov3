import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync(new URL('./firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function list() {
  try {
    const querySnapshot = await getDocs(collection(db, 'portfolio_projects'));
    const projects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log("Portfólio_projects length:", projects.length);
    console.log("Sample:", projects[0]);
  } catch (err) {
    console.error(err);
  }
}
list();
