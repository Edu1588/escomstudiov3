import fs from 'fs/promises';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

async function searchInFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== '.vercel' && entry.name !== 'dist') {
        await searchInFiles(fullPath);
      }
    } else {
      if (entry.name.endsWith('.mjs') || entry.name.endsWith('.js') || entry.name.endsWith('.ts') || entry.name.endsWith('.tsx') || entry.name.endsWith('.html') || entry.name.endsWith('.css') || entry.name.endsWith('.json')) {
        try {
          const content = await fs.readFile(fullPath, 'utf8');
          if (content.toLowerCase().includes('implart')) {
            console.log(`Found in file: ${fullPath}`);
          }
        } catch (err) {
          // ignore
        }
      }
    }
  }
}

async function searchInFirestore() {
  try {
    const firebaseConfig = JSON.parse(await fs.readFile(new URL('../firebase-applet-config.json', import.meta.url), 'utf8'));
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

    const collections = ['leads', 'proposals', 'generated_sites'];
    for (const colName of collections) {
      console.log(`Searching Firestore collection: ${colName}...`);
      const snap = await getDocs(collection(db, colName));
      snap.forEach(doc => {
        const dataStr = JSON.stringify(doc.data()).toLowerCase();
        if (dataStr.includes('implart')) {
          console.log(`Found in Firestore doc: ${colName} -> ${doc.id}`);
          console.log(JSON.stringify(doc.data(), null, 2));
        }
      });
    }
  } catch (err) {
    console.error('Error searching Firestore:', err);
  }
}

async function run() {
  console.log('=== SEARCHING FOR IMPLART ===');
  await searchInFiles('E:\\ANTIGRAVITY\\ESCOM_STUDIO');
  await searchInFirestore();
  console.log('=== SEARCH COMPLETE ===');
}

run();
