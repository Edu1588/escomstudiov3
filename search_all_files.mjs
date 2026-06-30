import { readdirSync, statSync, readFileSync } from 'fs';
import { join } from 'path';

function searchDir(dir) {
  const files = readdirSync(dir);
  for (const file of files) {
    const fullPath = join(dir, file);
    if (file === 'node_modules' || file === 'dist' || file === '.git' || file === '.vercel') {
      continue;
    }
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      searchDir(fullPath);
    } else if (file.endsWith('.js') || file.endsWith('.mjs') || file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.json')) {
      try {
        const content = readFileSync(fullPath, 'utf-8');
        if (content.toLowerCase().includes('stitch')) {
          console.log(`Found in: ${fullPath}`);
          // Print matching lines
          const lines = content.split('\n');
          lines.forEach((line, idx) => {
            if (line.toLowerCase().includes('stitch')) {
              console.log(`  Line ${idx + 1}: ${line.trim()}`);
            }
          });
        }
      } catch (e) {
        // Ignorar erros de leitura
      }
    }
  }
}

console.log("=== SEARCHING ALL FILES FOR 'STITCH' ===");
searchDir('E:/ANTIGRAVITY/ESCOM_STUDIO');
