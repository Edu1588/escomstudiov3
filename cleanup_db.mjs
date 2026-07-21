import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

// Inicializar Firebase
const firebaseConfigPath = new URL('./firebase-applet-config.json', import.meta.url);
const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function cleanCollection(collectionName) {
  console.log(`Limpando coleção: ${collectionName}...`);
  const snap = await getDocs(collection(db, collectionName));
  let count = 0;
  for (const document of snap.docs) {
    // Manter apenas as estruturas fixas novas se necessário, mas para limpar tudo:
    await deleteDoc(doc(db, collectionName, document.id));
    count++;
  }
  console.log(`Coleção ${collectionName} limpa! ${count} documentos deletados.`);
}

async function run() {
  await cleanCollection("generated_sites");
  await cleanCollection("leads");
  await cleanCollection("proposals");
  console.log("Banco de dados limpo com sucesso!");
  process.exit(0);
}

run().catch(console.error);
