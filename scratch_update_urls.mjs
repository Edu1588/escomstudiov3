import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import fs from "fs";

async function main() {
  console.log("Iniciando atualização de URLs no Firestore...");
  const config = JSON.parse(fs.readFileSync("firebase-applet-config.json", "utf-8"));
  const app = initializeApp(config);
  const db = getFirestore(app);

  const updates = [
    {
      id: "14582573840495252447",
      name: "Dra. Ana Paula Gonçalves",
      url: "https://www.escomstudio.com.br/template-belini/index.html"
    },
    {
      id: "8244073350648594250",
      name: "Dra. Elizabete De Marchi",
      url: "https://www.escomstudio.com.br/template-belini/index.html"
    },
    {
      id: "16689071719369495606",
      name: "Miami Chiropractic & Wellness",
      url: "https://www.escomstudio.com.br/template-austin-simply-fit/index.html"
    }
  ];

  for (const item of updates) {
    try {
      const docRef = doc(db, "generated_sites", item.id);
      await updateDoc(docRef, { deployedUrl: item.url });
      console.log(`Sucesso ao atualizar ${item.name} para: ${item.url}`);
    } catch (err) {
      console.error(`Erro ao atualizar ${item.name}:`, err.message);
    }
  }

  console.log("Atualizações concluídas!");
  process.exit(0);
}

main().catch(err => {
  console.error("Erro fatal:", err);
  process.exit(1);
});
