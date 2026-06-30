import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync(new URL('../firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function run() {
  console.log("Iniciando a atualização de links no Firestore (generated_sites)...");
  
  const updates = [
    {
      id: "217696366907448046", // Skoziê Closet
      companyName: "Skoziê Closet de Moda Feminina",
      deployedUrl: "https://www.escomstudio.com.br/template-skozi-closet/index.html",
      htmlUrl: "/template-skozi-closet/index.html"
    },
    {
      id: "14582573840495252447", // Clínica Belini
      companyName: "Clínica Belini - Estética Avançada",
      deployedUrl: "https://www.escomstudio.com.br/template-belini/index.html",
      htmlUrl: "/template-belini/index.html"
    },
    {
      id: "proj_chiroandmovement_us", // Chiropractic & Movement
      companyName: "Chiropractic and Movement Studio",
      deployedUrl: "https://www.escomstudio.com.br/template-chiroandmovement/index.html",
      htmlUrl: "/template-chiroandmovement/index.html"
    },
    {
      id: "proj_oralfix_br", // Oral Fix
      companyName: "Oral Fix - Odontologia Especializada",
      deployedUrl: "https://www.escomstudio.com.br/template-oralfix/index.html",
      htmlUrl: "/template-oralfix/index.html"
    }
  ];

  for (const item of updates) {
    try {
      const docRef = doc(db, "generated_sites", item.id);
      await updateDoc(docRef, {
        deployedUrl: item.deployedUrl,
        htmlUrl: item.htmlUrl
      });
      console.log(`[OK] Atualizado: ${item.companyName} (ID: ${item.id})`);
    } catch (err) {
      console.error(`[ERRO] Falha ao atualizar ${item.companyName} (ID: ${item.id}):`, err.message);
    }
  }

  console.log("Atualização concluída!");
}

run();
