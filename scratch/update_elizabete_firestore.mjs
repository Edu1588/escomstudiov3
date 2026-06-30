import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync(new URL('../firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function updateDatabase() {
  try {
    console.log("Iniciando criação/atualização do site gerado para Dra Elizabete...");
    
    // Criar/atualizar na coleção generated_sites para a Dra Elizabete De Marchi (ID: 8244073350648594250)
    const siteDocRef = doc(db, "generated_sites", "8244073350648594250");
    await setDoc(siteDocRef, {
      projectId: "8244073350648594250",
      companyName: "Dra. Elizabete De Marchi - Biomedicina Estética Avançada",
      niche: "Biomedicina Estética",
      score: 95,
      deployedUrl: "https://escom-studio.vercel.app/template-elizabete/index.html",
      htmlUrl: "/template-elizabete/index.html",
      status: "pending",
      createdAt: Date.now(),
      analysis: "### Oportunidade Digital para Dra. Elizabete De Marchi\nDesenvolvemos um protótipo estratégico exclusivo focado em rejuvenescimento facial, botox e fios de PDO, diferenciando-a com design Tiffany de altíssimo luxo e conversão direta no WhatsApp."
    });
    console.log("Firestore: Site gerado para Dra Elizabete criado/atualizado com sucesso!");
    
    console.log("Banco de dados atualizado com sucesso!");
  } catch (err) {
    console.error("Erro ao atualizar o banco de dados:", err);
  }
}

updateDatabase();
