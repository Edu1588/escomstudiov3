import fs from 'fs';
import path from 'path';

function searchDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (
      file === 'node_modules' || 
      file === '.git' || 
      file === 'dist' || 
      file === '.vercel' || 
      file === 'tmp_clinica'
    ) continue;
    try {
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        searchDir(fullPath);
      } else if (stat.isFile()) {
        if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.json') || file.endsWith('.js') || file.endsWith('.mjs') || file.endsWith('.md')) {
          const content = fs.readFileSync(fullPath, 'utf8');
          if (content.includes('docs.google.com/spreadsheets')) {
            console.log(`Encontrou em ${fullPath}:`);
            const lines = content.split('\n');
            lines.forEach((line, idx) => {
              if (line.includes('docs.google.com/spreadsheets')) {
                console.log(`  Linha ${idx + 1}: ${line.trim()}`);
              }
            });
          }
        }
      }
    } catch (e) {
      // ignore
    }
  }
}

searchDir('E:\\ANTIGRAVITY\\ESCOM_STUDIO');
console.log('Busca finalizada.');
