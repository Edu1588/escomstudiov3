import fs from 'fs';
import path from 'path';

const searchDir = 'E:/ANTIGRAVITY/ESCOM_STUDIO';

function searchFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        searchFiles(fullPath);
      }
    } else {
      if (file.endsWith('.html') || file.endsWith('.mjs') || file.endsWith('.js') || file.endsWith('.ts')) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const regex = /wa\.me\/[0-9]+/g;
        let match;
        while ((match = regex.exec(content)) !== null) {
          console.log(`[PHONE FOUND] ${match[0]} em ${fullPath}`);
        }
      }
    }
  }
}

searchFiles(searchDir);
