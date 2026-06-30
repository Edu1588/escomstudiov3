import fs from 'fs/promises';

async function findLines() {
  const content = await fs.readFile('./public/template-oralfix/index.html', 'utf-8');
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    if (line.includes('id="dossie-comercial"') || line.includes('id="proposta-comercial"') || line.includes('id="contato"')) {
      console.log(`Line ${index + 1}: ${line}`);
    }
  });
}

findLines();
