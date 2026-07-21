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
    } else if (file.endsWith('.js') || file.endsWith('.mjs') || file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.html')) {
      try {
        const content = readFileSync(fullPath, 'utf-8');
        if (content.includes('0.8') || content.includes('CLS') || content.includes('TBT')) {
          console.log(`Found in: ${fullPath}`);
          const lines = content.split('\n');
          lines.forEach((line, idx) => {
            if (line.includes('0.8') || line.includes('CLS') || line.includes('TBT')) {
              console.log(`  Line ${idx + 1}: ${line.trim()}`);
            }
          });
        }
      } catch (e) {}
    }
  }
}

searchDir('E:/ANTIGRAVITY/ESCOM_STUDIO');
