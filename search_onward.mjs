import { readdirSync, statSync, readFileSync } from 'fs';
import { join } from 'path';

function searchDir(dir) {
  try {
    const files = readdirSync(dir);
    for (const file of files) {
      const fullPath = join(dir, file);
      if (file === 'node_modules' || file === 'dist' || file === '.git' || file === '.vercel') {
        continue;
      }
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        searchDir(fullPath);
      } else {
        try {
          const content = readFileSync(fullPath, 'utf-8');
          if (content.toLowerCase().includes('onward')) {
            console.log(`Found 'onward' in: ${fullPath}`);
            const lines = content.split('\n');
            lines.forEach((line, idx) => {
              if (line.toLowerCase().includes('onward')) {
                console.log(`  Line ${idx + 1}: ${line.trim().substring(0, 150)}`);
              }
            });
          }
        } catch (e) {}
      }
    }
  } catch(e) {}
}

console.log("=== SEARCHING WORKSPACE FOR 'ONWARD' ===");
searchDir('E:/ANTIGRAVITY/ESCOM_STUDIO');

console.log("\n=== SEARCHING TRANSCRIPT LOGS FOR 'ONWARD' ===");
searchDir('C:/Users/escom/.gemini/antigravity/brain/b99f9a1c-e5c9-4f0b-b1c6-b61329bbf852/.system_generated/logs');
