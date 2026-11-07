import fs from 'fs';

const html = fs.readFileSync('public/home-v5/index.html', 'utf8');

function extractSection(name) {
  const marker = `data-page-builder-section="${name}"`;
  const startIdx = html.indexOf(marker);
  if (startIdx === -1) {
    console.log('NOT FOUND:', name);
    return '';
  }
  const tagStart = html.lastIndexOf('<section', startIdx);
  const tagEnd = html.indexOf('</section>', startIdx) + 10;
  return html.slice(tagStart, tagEnd);
}

const metricas = extractSection('cardsSection');
const comoOperamos = extractSection('animatedListSection');
const projetos = extractSection('featuredWorkSection');
const padraoEscom = extractSection('indexedGridSection');

console.log('Metricas len:', metricas.length);
console.log('ComoOperamos len:', comoOperamos.length);
console.log('Projetos len:', projetos.length);
console.log('PadraoEscom len:', padraoEscom.length);

fs.writeFileSync('scripts/v5_metricas.html', metricas);
fs.writeFileSync('scripts/v5_como_operamos.html', comoOperamos);
fs.writeFileSync('scripts/v5_projetos.html', projetos);
fs.writeFileSync('scripts/v5_padrao_escom.html', padraoEscom);
console.log('Arquivos salvos com sucesso!');
