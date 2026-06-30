import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync(new URL('../firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const url = process.argv[2];
if (!url) {
    console.error("Please provide the deployed URL");
    process.exit(1);
}

async function run() {
  try {
    const docRef = doc(db, 'generated_sites', '16362500771644110426');
    await updateDoc(docRef, {
      deployedUrl: url,
      status: 'deployed'
    });
    console.log("Document updated successfully with URL:", url);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
