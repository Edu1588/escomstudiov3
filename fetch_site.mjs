import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { readFileSync, writeFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync(new URL('./firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function run() {
  try {
    const querySnapshot = await getDocs(collection(db, 'generated_sites'));
    let found = null;
    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.metadata?.title?.includes("Odontol") || data.metadata?.title?.includes("Restaur")) {
        console.log("ID:", doc.id, "Title:", data.metadata.title, "Status:", data.status, "URL:", data.url);
        found = doc.id;
        writeFileSync(`site_${doc.id}.html`, data.html);
        console.log("Saved HTML to", `site_${doc.id}.html`);
      }
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
