import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync(new URL('./firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

async function addNicho1Vsh() {
  const proposalId = 'proposta-escom-nicho1-vsh-partners';
  const siteId = 'site-nicho1-vsh-partners';

  const proposalData = {
    clientName: 'VSH Partners',
    company: 'VSH Partners Advisory',
    niche: 'Consultoria de Gestão Empresarial e M&A',
    city: 'São Paulo, SP',
    phone: '(11) 3192-2970',
    website: 'https://vshpartners.com.br',
    address: 'Av. Cidade Jardim, 377 – Itaim Bibi, São Paulo – SP',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pendente',
    budget: '990,00',
    currency: 'BRL',
    siteUrl: 'https://escom-studio.vercel.app/site-consultoria-ma/index.html',
    pdfUrl: 'https://escom-studio.vercel.app/site-consultoria-ma/dossie-consultoria-ma.pdf'
  };

  const generatedSiteData = {
    projectId: siteId,
    companyName: 'VSH Partners Advisory',
    niche: 'Consultoria de Gestão Empresarial e M&A',
    score: 95,
    status: 'approved',
    deployedUrl: 'https://escom-studio.vercel.app/site-consultoria-ma/index.html',
    pdfUrl: 'https://escom-studio.vercel.app/site-consultoria-ma/dossie-consultoria-ma.pdf',
    createdAt: new Date().toISOString()
  };

  await setDoc(doc(db, 'proposals', proposalId), proposalData);
  await setDoc(doc(db, 'generated_sites', siteId), generatedSiteData);

  console.log("✅ Proposta e Site do Nicho 1 (VSH Partners M&A) registrados no Firestore com sucesso!");
}

addNicho1Vsh().catch(console.error);
