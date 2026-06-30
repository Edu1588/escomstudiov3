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
        if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js')) {
          const content = fs.readFileSync(fullPath, 'utf8');
          if (content.includes('Route') || content.includes('router') || content.includes('proposta-escom') || content.includes('proposta/')) {
            console.log(`Encontrou rota em ${fullPath}:`);
            const lines = content.split('\n');
            lines.forEach((line, idx) => {
              if (line.includes('Route') || line.includes('router') || line.includes('proposta-escom') || line.includes('proposta/')) {
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
