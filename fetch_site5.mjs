import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { readFileSync, writeFileSync } from 'fs';
import https from 'https';

const firebaseConfig = JSON.parse(readFileSync(new URL('./firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function run() {
  try {
    const querySnapshot = await getDocs(collection(db, 'generated_sites'));
    for (const doc of querySnapshot.docs) {
      const data = doc.data();
      console.log(`\n--- Document ID: ${doc.id} ---`);
      console.log("companyName:", data.companyName);
      console.log("htmlUrl:", data.htmlUrl);
      
      if (data.htmlUrl) {
          https.get(data.htmlUrl, (res) => {
              let htmlData = '';
              res.on('data', chunk => htmlData += chunk);
              res.on('end', () => {
                  writeFileSync(`site_${doc.id}.html`, htmlData);
                  console.log(`Baixado e salvo: site_${doc.id}.html`);
              });
          }).on('error', (e) => {
              console.error(e);
          });
      }
    }
  } catch (err) {
    console.error(err);
  }
}
run();
