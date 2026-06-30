import fs from 'fs';
import path from 'path';

const searchDir = 'E:/ANTIGRAVITY/ESCOM_STUDIO';

function searchFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        searchFiles(fullPath);
      }
    } else {
      if (file.endsWith('.html') || file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js')) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        if (content.includes('Sistemas de marca imponentes') || content.includes('UBAH Design')) {
          console.log(`[FOUND TEXT] em ${fullPath}`);
        }
      }
    }
  }
}

searchFiles(searchDir);
