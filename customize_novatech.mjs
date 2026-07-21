import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

// Inicializar Firebase
const firebaseConfig = JSON.parse(fs.readFileSync(new URL('./firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Lendo a versão corrigida da pasta public em vez de dist
const filePath = path.join(process.cwd(), 'public', 'site-novatech-automotive', 'index.html');

async function customize() {
  if (!fs.existsSync(filePath)) {
    console.error("ERRO: O arquivo da NovaTech não existe em public/site-novatech-automotive/index.html");
    return;
  }

  const html = fs.readFileSync(filePath, 'utf8');

  // Sincronizar o HTML atualizado no Firebase Firestore
  try {
    const siteProjectId = "site_auto_novatech-automotive";
    await updateDoc(doc(db, "generated_sites", siteProjectId), {
      htmlContent: html,
      updatedAt: Date.now()
    });
    console.log("✅ NovaTech Firestore htmlContent atualizado com sucesso a partir de public!");
  } catch (e) {
    console.error("❌ Erro ao atualizar Firestore:", e.message);
  }
}

customize().catch(console.error);

