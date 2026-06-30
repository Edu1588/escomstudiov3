import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.production.local' });

const firebaseConfig = JSON.parse(readFileSync(new URL('./firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

function getSiteParams(niche) {
  const n = (niche || "").toLowerCase();
  const score = Math.floor(Math.random() * (98 - 88 + 1)) + 88;
  let template = "template-clinica";
  
  if (n.includes("advocacia") || n.includes("direito") || n.includes("advogado") || n.includes("associados")) {
    template = "template-silva-associados";
  } else if (n.includes("mecânica") || n.includes("oficina") || n.includes("centro automotivo") || n.includes("autocenter") || n.includes("veículos") || n.includes("motors")) {
    template = "template-silva-autocenter";
  } else if (n.includes("dentista") || n.includes("odontologia") || n.includes("ortodontia") || n.includes("implant")) {
    template = "template-oralfix";
  } else if (n.includes("quiropraxia") || n.includes("chiropractor") || n.includes("fisioterapia") || n.includes("movement")) {
    template = "template-chiroandmovement";
  } else if (n.includes("nutrição") || n.includes("personal") || n.includes("academia") || n.includes("fitness") || n.includes("saúde")) {
    // There is no template-austin-simply-fit, so fallback to chiroandmovement which is a fitness template
    template = "template-chiroandmovement"; 
  } else if (n.includes("estética") || n.includes("biomedicina") || n.includes("harmonização") || n.includes("spa") || n.includes("belini")) {
    template = "template-belini";
  } else if (n.includes("psicologia") || n.includes("terapia") || n.includes("pediatria")) {
    template = "template-giovana-lumertz";
  }
  
  return { score, url: `https://escom-studio.vercel.app/${template}/index.html` };
}

async function runPatch() {
  console.log("Iniciando patch dos sites e leads no Firestore...");
  
  // 1. Atualizar generated_sites
  const sitesRef = collection(db, "generated_sites");
  const sitesSnap = await getDocs(sitesRef);
  
  let updatedSites = 0;
  for (const siteDoc of sitesSnap.docs) {
    const data = siteDoc.data();
    const params = getSiteParams(data.niche || data.companyName);
    
    await updateDoc(doc(db, "generated_sites", siteDoc.id), {
      score: params.score,
      deployedUrl: params.url
    });
    console.log(`Site [${data.companyName}] atualizado -> Score: ${params.score}, URL: ${params.url}`);
    updatedSites++;
  }
  
  // 2. Atualizar leads (eles também guardam o score na raiz)
  const leadsRef = collection(db, "leads");
  const leadsSnap = await getDocs(leadsRef);
  
  let updatedLeads = 0;
  for (const leadDoc of leadsSnap.docs) {
    const data = leadDoc.data();
    const params = getSiteParams(data.niche || data.title);
    
    await updateDoc(doc(db, "leads", leadDoc.id), {
      score: params.score
    });
    console.log(`Lead [${data.title}] atualizado -> Score: ${params.score}`);
    updatedLeads++;
  }
  
  console.log(`PATCH CONCLUÍDO! Sites atualizados: ${updatedSites} | Leads atualizados: ${updatedLeads}`);
  process.exit(0);
}

runPatch().catch(console.error);
