import fs from 'fs';

const content = fs.readFileSync('fetch_and_create_real_leads.mjs', 'utf8');
console.log('Tamanho:', content.length);

const terms = ['pdf', 'puppeteer', 'dossie', 'generate', 'chrome'];
for (const term of terms) {
  console.log(`Termo "${term}": ${content.toLowerCase().includes(term) ? 'Sim' : 'Não'}`);
}

// Find all matches for pdf or puppeteer and print context
const regex = /pdf|puppeteer/gi;
let match;
let count = 0;
while ((match = regex.exec(content)) !== null && count < 10) {
  count++;
  console.log(`Match ${count}:`, content.substring(match.index - 50, match.index + 150));
}
