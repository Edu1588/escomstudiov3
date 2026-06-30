import fs from 'fs';
import path from 'path';

function searchInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        searchInDir(fullPath);
      }
    } else if (file.endsWith('.js') || file.endsWith('.mjs') || file.endsWith('.ts') || file.endsWith('.json')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('dossie.pdf') || content.includes('generate_pdf') || content.includes('proposta-belini/dossie.pdf')) {
        console.log(`Match em: ${fullPath}`);
      }
    }
  }
}

searchInDir('.');
