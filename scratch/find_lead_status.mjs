import fs from 'fs';
import path from 'path';

const searchTerms = ['escom_lead_status'];
const ignoreDirs = ['node_modules', 'dist', '.git', '.vercel', 'scratch'];

function searchDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (!ignoreDirs.includes(file)) {
        searchDir(fullPath);
      }
    } else if (stat.isFile()) {
      if (file.endsWith('.js') || file.endsWith('.mjs') || file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.html') || file.endsWith('.json')) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          for (const term of searchTerms) {
            if (content.includes(term)) {
              console.log(`Found "${term}" in: ${fullPath}`);
            }
          }
        } catch (e) {
          // ignore
        }
      }
    }
  }
}

console.log('Searching for escom_lead_status...');
searchDir('.');
console.log('Search finished.');
