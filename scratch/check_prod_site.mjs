import fs from 'fs';
import path from 'path';

function checkLocalFile(filePath) {
  const absPath = path.resolve(filePath);
  if (!fs.existsSync(absPath)) {
    console.log(`Local File: ${filePath} -> NÃO EXISTE`);
    return;
  }
  const text = fs.readFileSync(absPath, 'utf8');
  console.log(`Local File: ${filePath}`);
  console.log(`  Tamanho: ${text.length}`);
  console.log(`  Contem sec-1-urgencia? ${text.includes('sec-1-urgencia')}`);
  console.log(`  Contem Bricolage Grotesque? ${text.includes('Bricolage Grotesque')}`);
}

console.log('=== VERIFICANDO ARQUIVOS LOCAIS EM public/ ===');
checkLocalFile('public/site-onward-consultoria.html');
checkLocalFile('public/onward-consultoria.html');
checkLocalFile('public/onward.html');
checkLocalFile('public/sites/onward-consultoria.html');

console.log('\n=== VERIFICANDO ARQUIVOS LOCAIS EM dist/ ===');
checkLocalFile('dist/site-onward-consultoria.html');
checkLocalFile('dist/onward-consultoria.html');
checkLocalFile('dist/onward.html');
checkLocalFile('dist/sites/onward-consultoria.html');
