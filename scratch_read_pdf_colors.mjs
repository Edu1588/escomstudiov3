import fs from 'fs';

const filePath = 'E:/ANTIGRAVITY/ESCOM_STUDIO/rebuild_pdfs.mjs';
const content = fs.readFileSync(filePath, 'utf-8');

// Vamos pesquisar se há termos de cor como "bg-stone-950", "bg-black", "bg-[#", etc.
const matches = content.match(/bg-[a-z0-9#-]+/g) || [];
const uniqueMatches = [...new Set(matches)];
console.log("Cores encontradas no PDF script:", uniqueMatches);

// Vamos ver trechos do HTML gerado para Oralfix e Chiro.
const lines = content.split('\n');
console.log("Total de linhas em rebuild_pdfs.mjs:", lines.length);

// Procurar onde as funções são declaradas
lines.forEach((line, idx) => {
  if (line.includes('generateDossie10Pages') || line.includes('generateDossie10PagesEn')) {
    console.log(`Linha ${idx + 1}: ${line}`);
  }
});
