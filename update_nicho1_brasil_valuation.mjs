import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync(new URL('./firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

async function updateNicho1() {
  const proposalId = 'proposta-escom-nicho1-brasil-valuation';
  const siteId = 'site-nicho1-brasil-valuation';

  const proposalData = {
    clientName: 'Brasil Valuation & M&A',
    company: 'Brasil Valuation & M&A Advisory',
    niche: 'Consultoria de Gestão Empresarial e M&A',
    city: 'São Paulo, SP',
    phone: '(11) 98883-2812',
    website: 'https://brasilvaluation.com.br',
    address: 'Av. Brigadeiro Faria Lima, 1811, cj 918 - Jardim Paulistano, São Paulo – SP',
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
    companyName: 'Brasil Valuation & M&A Advisory',
    niche: 'Consultoria de Gestão Empresarial e M&A (Site Defasado - Qualificado)',
    score: 32,
    status: 'approved',
    deployedUrl: 'https://escom-studio.vercel.app/site-consultoria-ma/index.html',
    pdfUrl: 'https://escom-studio.vercel.app/site-consultoria-ma/dossie-consultoria-ma.pdf',
    createdAt: new Date().toISOString()
  };

  await setDoc(doc(db, 'proposals', proposalId), proposalData);
  await setDoc(doc(db, 'generated_sites', siteId), generatedSiteData);

  console.log("✅ Proposta e Site do Nicho 1 (Brasil Valuation M&A) atualizados no Firestore!");
}

updateNicho1().catch(console.error);
