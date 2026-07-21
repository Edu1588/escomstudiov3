import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

// Inicializar Firebase
const firebaseConfig = JSON.parse(fs.readFileSync(new URL('./firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const filePath = path.join(process.cwd(), 'dist', 'site-clinica-pillar', 'index.html');

async function customizePillarColors() {
  if (!fs.existsSync(filePath)) {
    console.error("ERRO: site-clinica-pillar/index.html não encontrado!");
    return;
  }

  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Substituir a paleta de cores roxas pela paleta verde esmeralda no config do Tailwind
  const oldPillarColors = `                        Pillar: {
                            900: '#3B0764',
                            800: '#581C87',
                            700: '#6B21A8',
                            600: '#7E22CE',
                            500: '#9333EA',
                            400: '#A855F7',
                            50: '#FAF5FF',
                        }`;

  const newPillarColors = `                        Pillar: {
                            900: '#064e3b', // Verde Esmeralda Escuro
                            800: '#065f46',
                            700: '#047857', // Verde Esmeralda Oficial da Clínica Pillar
                            600: '#059669',
                            500: '#10b981',
                            400: '#34d399',
                            50: '#ecfdf5',
                        }`;

  html = html.replace(oldPillarColors, newPillarColors);

  // 2. Ajustar as fontes no Tailwind config
  html = html.replace(/sans: \['Inter', 'sans-serif'\],/g, "sans: ['Open Sans', 'sans-serif'],");
  html = html.replace(/display: \['Plus Jakarta Sans', 'sans-serif'\],/g, "display: ['Cinzel', 'serif'],");

  // 3. Substituir o link de fontes do Google Fonts no head para carregar Cinzel e Open Sans
  html = html.replace(
    /<link href="https:\/\/fonts.googleapis.com\/css2\?family=Montserrat:wght@400;600;700&family=Inter:wght@300;400;600&display=swap" rel="stylesheet">/g,
    '<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800&family=Open+Sans:wght@300;400;600;700&display=swap" rel="stylesheet">'
  );

  // 4. Mudar as cores dos elementos em roxo que possam estar hardcoded
  html = html.replace(/#3B0764/g, '#064e3b');
  html = html.replace(/#9333EA/g, '#10b981');
  html = html.replace(/bg-purple-900/g, 'bg-emerald-900');
  html = html.replace(/text-purple-600/g, 'text-emerald-600');
  html = html.replace(/text-purple-400/g, 'text-emerald-400');
  html = html.replace(/hover:text-purple-400/g, 'hover:text-emerald-400');
  html = html.replace(/bg-purple-600/g, 'bg-emerald-600');
  html = html.replace(/border-purple-500/g, 'border-emerald-500');

  // Salvar localmente
  fs.writeFileSync(filePath, html, 'utf-8');
  console.log("✅ Clínica Pillar ajustada com as cores Verde Esmeralda e fontes Cinzel/Open Sans!");

  // Sincronizar de volta no Firestore
  try {
    const siteProjectId = "site_auto_clinica-pillar";
    await updateDoc(doc(db, "generated_sites", siteProjectId), {
      htmlContent: html,
      updatedAt: Date.now()
    });
    console.log("✅ Clínica Pillar Firestore htmlContent atualizado com sucesso!");
  } catch (e) {
    console.error("❌ Erro ao atualizar Firestore:", e.message);
  }
}

customizePillarColors().catch(console.error);
