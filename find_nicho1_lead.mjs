import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync(new URL('./firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function findLead() {
  const snapshot = await getDocs(collection(db, 'leads'));
  const leads = [];
  snapshot.forEach(doc => {
    leads.push({ id: doc.id, ...doc.data() });
  });

  const nicho1Leads = leads.filter(l => 
    l.niche && (l.niche.toLowerCase().includes('consultoria') || l.niche.toLowerCase().includes('m&a') || l.niche.toLowerCase().includes('gestão'))
  );

  console.log(`Encontrados ${nicho1Leads.length} leads do Nicho 1 no banco.`);
  if (nicho1Leads.length > 0) {
    console.log(JSON.stringify(nicho1Leads[0], null, 2));
  } else {
    // Lead padrão do Nicho 1 caso não haja nenhum
    const lead = {
      placeId: "brasil_valuation_sp",
      companyName: "Brasil Valuation & M&A Advisory",
      niche: "Consultoria de Gestão Empresarial e M&A",
      city: "São Paulo, SP",
      address: "Av. Faria Lima, 3477 - 14º Andar - Itaim Bibi, São Paulo - SP",
      phone: "(11) 3045-8890",
      email: "contato@brasilvaluation.com.br",
      website: "https://brasilvaluation.com.br",
      colors: { gold: "#d4af37", dark: "#0b0f17", accent: "#f3e5ab" },
      budget: "990,00"
    };
    console.log("LEAD_SELECIONADO:", JSON.stringify(lead, null, 2));
  }
}

findLead().catch(console.error);
