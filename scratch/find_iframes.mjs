import fs from 'fs/promises';
import path from 'path';

async function searchInFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== '.vercel') {
        await searchInFiles(fullPath);
      }
    } else {
      if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts') || entry.name.endsWith('.js') || entry.name.endsWith('.html')) {
        try {
          const content = await fs.readFile(fullPath, 'utf8');
          if (content.toLowerCase().includes('iframe') || content.toLowerCase().includes('wacrm') || content.toLowerCase().includes('escom-crm') || content.toLowerCase().includes('wa-crm')) {
            console.log(`Found in: ${fullPath}`);
            const lines = content.split('\n');
            lines.forEach((line, idx) => {
              if (line.toLowerCase().includes('iframe') || line.toLowerCase().includes('wacrm') || line.toLowerCase().includes('escom-crm') || line.toLowerCase().includes('wa-crm')) {
                console.log(`  L${idx+1}: ${line.trim()}`);
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
  console.log('=== SEARCHING FOR IFRAMES/CRM ===');
  await searchInFiles('E:\\ANTIGRAVITY\\ESCOM_STUDIO\\src\\admin');
  console.log('=== COMPLETE ===');
}

run();
