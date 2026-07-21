import fs from 'fs';
import path from 'path';
import os from 'os';
import { exec } from 'child_process';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import dotenv from 'dotenv';

dotenv.config({ path: './.env.production.local' });
dotenv.config({ path: './.env.development.local' });
dotenv.config({ path: './.env.local' });
dotenv.config();

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function main() {
  console.log("=========================================");
  console.log("  GERANDO SITE DE TESTE V7.0 (PARRILLA)  ");
  console.log("=========================================\n");

  // Importar dinamicamente após dotenv.config()
  const { autoBuildSiteFromLead, ensureAuth } = await import('./api/index.js');

  console.log("[PASSO 0] Autenticando no Firebase...");
  await ensureAuth();

  const mockLead = {
    title: "Barba Ruiva Parrilla",
    website: "https://www.google.com",
    phoneNumber: "11987654321",
    address: "Avenida Paulista, 1500 - São Paulo, SP",
    phone: "11987654321",
    placeId: "test_parrilla_v7",
    cid: "test_parrilla_v7"
  };

  const niche = "Parrilla Uruguaia e Boutique de Carnes";

  console.log("[PASSO 1] Disparando autoBuildSiteFromLead v7.0 com cor de brasa...");
  const siteRecord = await autoBuildSiteFromLead(mockLead, niche, null);

  const projectId = "site_test_parrilla_v7";
  const siteSlug = "barba-ruiva-parrilla-v7-" + Math.floor(1000 + Math.random() * 9000);
  const tempDir = path.join(os.tmpdir(), "dist-deployed", siteSlug);
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
  fs.writeFileSync(path.join(tempDir, "index.html"), siteRecord.htmlContent, "utf-8");

  console.log(`[PASSO 2] Fazendo deploy no Vercel sob o slug: ${siteSlug}...`);
  exec(`npx vercel deploy "${tempDir}" --name "${siteSlug}" --prod --yes`, async (err, stdout, stderr) => {
    if (err) {
      console.error("ERRO NO DEPLOY:", stderr);
      process.exit(1);
    }
    const match = stdout.match(/https:\/\/[a-zA-Z0-9.-]+\.vercel\.app/);
    const deployedUrl = match ? match[0] : null;

    if (deployedUrl) {
      console.log(`✅ DEPLOY SUCESSO: ${deployedUrl}`);
      siteRecord.deployedUrl = deployedUrl;
      siteRecord.status = "deployed";
      await setDoc(doc(db, "generated_sites", projectId), siteRecord, { merge: true });
      console.log(`[PASSO 3] Atualizado e sincronizado no Firestore!`);
    } else {
      console.error("Não foi possível capturar a URL do deploy.");
    }
    process.exit(0);
  });
}

main().catch(console.error);
