import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('.').filter(f => f.endsWith('.mjs') || f.endsWith('.js') || f.endsWith('.ts'));

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('proposta-') || content.includes('dossie.pdf') || content.includes('dossie.html') || content.includes('puppeteer')) {
    console.log(`- ${file} contém referências.`);
  }
}
