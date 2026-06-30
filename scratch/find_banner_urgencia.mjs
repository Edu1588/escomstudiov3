import fs from 'fs/promises';
import path from 'path';

async function searchInFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== '.vercel' && entry.name !== 'dist') {
        await searchInFiles(fullPath);
      }
    } else {
      if (entry.name.endsWith('.mjs') || entry.name.endsWith('.js') || entry.name.endsWith('.ts') || entry.name.endsWith('.tsx') || entry.name.endsWith('.html') || entry.name.endsWith('.css') || entry.name.endsWith('.json')) {
        try {
          const content = await fs.readFile(fullPath, 'utf8');
          if (content.includes('banner-urgencia') || content.includes('banner_urgencia') || content.includes('URGÊNCIA')) {
            console.log(`Found in file: ${fullPath}`);
            // Print matching lines
            const lines = content.split('\n');
            lines.forEach((line, idx) => {
              if (line.includes('banner-urgencia') || line.includes('banner_urgencia') || line.includes('URGÊNCIA')) {
                console.log(`  L${idx+1}: ${line.trim().substring(0, 150)}`);
              }
            });
          }
        } catch (err) {
          // ignore
        }
      }
    }
  }
}

async function run() {
  console.log('=== SEARCHING FOR BANNER-URGENCIA ===');
  await searchInFiles('E:\\ANTIGRAVITY\\ESCOM_STUDIO');
  console.log('=== SEARCH COMPLETE ===');
}

run();
