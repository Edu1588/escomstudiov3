import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync(new URL('../firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function run() {
  try {
    await addDoc(collection(db, 'external_projects'), {
      name: "Template Clínica (Aguardando Aprovação)",
      desc: "Protótipo gerado de clínica odontológica.",
      urlPaginaVendas: "https://escom-studio.vercel.app/template-clinica/index.html",
      urlAdmin: "",
      observacao: "Este template foi adicionado à raiz do sistema de forma que não utiliza projeto separado na Vercel.",
      createdAt: serverTimestamp()
    });
    console.log("Projeto adicionado ao external_projects com sucesso!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
