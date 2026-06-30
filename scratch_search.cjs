const fs = require('fs');
const path = require('path');

const targetPatterns = ['O site não fornece feedback claro e imediato', 'Reorganizar a navegação para seguir uma estrutura', 'Navegação Confusa'];

function searchDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (file === 'node_modules' || file === '.git' || file === 'dist' || file === '.vercel' || file === 'scratch_search.js' || file === 'scratch_search.cjs') continue;
    try {
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        searchDir(fullPath);
      } else if (stat.isFile()) {
        // Only read text files
        if (file.endsWith('.html') || file.endsWith('.js') || file.endsWith('.mjs') || file.endsWith('.json') || file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.css')) {
          const content = fs.readFileSync(fullPath, 'utf8');
          for (const pattern of targetPatterns) {
            if (content.toLowerCase().includes(pattern.toLowerCase())) {
              console.log(`Pattern "${pattern}" found in: ${fullPath}`);
            }
          }
        }
      }
    } catch (e) {
      // ignore errors
    }
  }
}

searchDir('E:\\ANTIGRAVITY\\ESCOM_STUDIO');
console.log('Search complete.');
