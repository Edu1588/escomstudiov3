import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';

const firebaseConfig = JSON.parse(fs.readFileSync(new URL('./firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function clean() {
  console.log("🧹 Apagando VSH Partners...");
  
  // Apagar pasta local
  const dir = path.join(process.cwd(), 'public', 'site-vsh-partners');
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log("  Pasta local public/site-vsh-partners removida.");
  }

  // Apagar documentos no Firestore
  try {
    await deleteDoc(doc(db, 'generated_sites', 'site-vsh-partners'));
    await deleteDoc(doc(db, 'proposals', 'proposta-escom-vsh-partners'));
    console.log("  Documentos VSH apagados do Firestore.");
  } catch (e) {
    console.error("  Erro ao apagar do Firestore:", e.message);
  }
}

clean().catch(console.error);
