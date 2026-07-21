import { initializeApp } from 'firebase/app';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

const firebaseConfig = JSON.parse(fs.readFileSync(new URL('./firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const siteIds = [
  'site-nicho1-brasil-valuation',
  'site-nicho1-vsh-partners',
  'site-nicho1-apex-capital',
  'site-nicho1-valus-corporate',
  'site-nicho1-fortis-partners'
];

const proposalsIds = siteIds.map(id => `proposta-escom-${id}`);

async function cleanNicho1() {
  console.log('Iniciando limpeza dos sites do Nicho 1...');

  for (const siteId of siteIds) {
    try {
      const sitePath = path.join(process.cwd(), 'public', siteId);
      if (fs.existsSync(sitePath)) {
        fs.rmSync(sitePath, { recursive: true, force: true });
        console.log(`📁 Pasta deletada: public/${siteId}`);
      }

      await deleteDoc(doc(db, 'generated_sites', siteId));
      console.log(`🔥 Documento deletado: generated_sites/${siteId}`);
    } catch (e) {
      console.error(`Erro ao deletar ${siteId}:`, e);
    }
  }

  for (const propId of proposalsIds) {
    try {
      await deleteDoc(doc(db, 'proposals', propId));
      console.log(`🔥 Documento deletado: proposals/${propId}`);
    } catch (e) {
      console.error(`Erro ao deletar ${propId}:`, e);
    }
  }

  console.log('Limpeza concluída!');
}

cleanNicho1().catch(console.error);
