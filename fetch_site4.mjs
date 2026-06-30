import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { readFileSync, writeFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync(new URL('./firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function run() {
  try {
    const querySnapshot = await getDocs(collection(db, 'generated_sites'));
    console.log("Documents found in generated_sites: ", querySnapshot.docs.length);
    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      console.log(`\n--- Document ID: ${doc.id} ---`);
      console.log("Title:", data.title);
      console.log("URL:", data.url || data.siteUrl || data.deployUrl);
      console.log("Status:", data.status);
      console.log("Has HTML field:", !!data.html);
      console.log("Has htmlContent field:", !!data.htmlContent);
      console.log("Keys available:", Object.keys(data));
      
      // Save whatever looks like html
      if (data.htmlContent) {
          writeFileSync(`site_${doc.id}_htmlContent.html`, data.htmlContent);
      }
      if (data.html) {
          writeFileSync(`site_${doc.id}_html.html`, data.html);
      }
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
