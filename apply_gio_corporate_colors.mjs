import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

// Inicializar Firebase
const firebaseConfig = JSON.parse(fs.readFileSync(new URL('./firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const filePath = path.join(process.cwd(), 'dist', 'site-gio-estetica', 'index.html');

async function customizeGioColors() {
  if (!fs.existsSync(filePath)) {
    console.error("ERRO: site-gio-estetica/index.html não encontrado!");
    return;
  }

  let html = fs.readFileSync(filePath, 'utf8');

  // Substituir cores champanhe/ouro na config do Tailwind pelas cores da franquia GiO (Púrpura/Magenta e Rosa)
  html = html.replace(/"primary": "#c5a059"/g, '"primary": "#6f0052"'); // Púrpura principal
  html = html.replace(/"primary-fixed": "#f4ebd0"/g, '"primary-fixed": "#fdf2f8"'); // Rosa clarinho de fundo
  html = html.replace(/"primary-fixed-dim": "#d9b977"/g, '"primary-fixed-dim": "#f472b6"'); // Rosa médio
  html = html.replace(/"inverse-primary": "#e6c78a"/g, '"inverse-primary": "#ec4899"');
  html = html.replace(/"tertiary": "#8c6e3b"/g, '"tertiary": "#ff13a0"'); // Rosa vibrante
  html = html.replace(/"surface-tint": "#c5a059"/g, '"surface-tint": "#6f0052"');
  html = html.replace(/"tertiary-fixed-dim": "#c5a059"/g, '"tertiary-fixed-dim": "#f472b6"');

  // Ajustar cor dourada residual no CSS inline
  html = html.replace(/#c5a059/g, '#6f0052');
  html = html.replace(/#ffd9a3/g, '#fdf2f8');

  // Salvar localmente
  fs.writeFileSync(filePath, html, 'utf-8');
  console.log("✅ GiO Estética Avançada ajustada com as cores corporativas (Púrpura/Rosa)!");

  // Sincronizar de volta no Firestore
  try {
    const siteProjectId = "site_auto_gio-estetica";
    await updateDoc(doc(db, "generated_sites", siteProjectId), {
      htmlContent: html,
      updatedAt: Date.now()
    });
    console.log("✅ GiO Estética Firestore htmlContent atualizado com sucesso!");
  } catch (e) {
    console.error("❌ Erro ao atualizar Firestore:", e.message);
  }
}

customizeGioColors().catch(console.error);
