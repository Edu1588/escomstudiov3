import { readdirSync, statSync, readFileSync } from 'fs';
import { join } from 'path';

const term = process.argv[2] || 'landing pages.exe';

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
    } else if (file.endsWith('.js') || file.endsWith('.mjs') || file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.html') || file.endsWith('.css')) {
      try {
        const content = readFileSync(fullPath, 'utf-8');
        if (content.toLowerCase().includes(term.toLowerCase())) {
          console.log(`Found in: ${fullPath}`);
          const lines = content.split('\n');
          lines.forEach((line, idx) => {
            if (line.toLowerCase().includes(term.toLowerCase())) {
              console.log(`  Line ${idx + 1}: ${line.trim()}`);
            }
          });
        }
      } catch (e) {
        // Ignore read errors
      }
    }
  }
}

console.log(`=== SEARCHING FOR '${term}' ===`);
searchDir('E:/ANTIGRAVITY/ESCOM_STUDIO');
