import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { readFileSync, writeFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync(new URL('./firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function run() {
  try {
    const querySnapshot = await getDocs(collection(db, 'generated_sites'));
    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      console.log("ID:", doc.id, "Title:", data.metadata?.title, "Status:", data.status, "URL:", data.url);
      if (data.status === 'pending_approval' || data.status === 'aguardando aprovação' || !data.status || data.status.includes("approv")) {
          writeFileSync(`site_${doc.id}.html`, data.html);
      }
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
