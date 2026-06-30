import fs from 'fs';
import path from 'path';

const file = 'public/template-chiropractic/index.html';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  console.log('Tamanho de template-chiropractic/index.html:', content.length);
  const terms = ['proposta-comercial', 'investimento', 'adicionais', 'crm', 'dashboard', 'dossie', 'dossier', 'serviços'];
  for (const term of terms) {
    console.log(`- Termo "${term}": ${content.toLowerCase().includes(term) ? 'Sim' : 'Não'}`);
  }
} else {
  console.log('Não existe.');
}
