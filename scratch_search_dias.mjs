import fs from 'fs';
import path from 'path';

const targetPatterns = ['generated_sites', 'generated-sites', 'create_test_lead', 'proposal'];

function searchDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (
      file === 'node_modules' || 
      file === '.git' || 
      file === 'dist' || 
      file === '.vercel' || 
      file.startsWith('scratch_search') || 
      file === 'tmp_clinica'
    ) continue;
    try {
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        searchDir(fullPath);
      } else if (stat.isFile()) {
        if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.json') || file.endsWith('.js') || file.endsWith('.mjs')) {
          const content = fs.readFileSync(fullPath, 'utf8');
          const lines = content.split('\n');
          lines.forEach((line, idx) => {
            for (const pattern of targetPatterns) {
              if (line.toLowerCase().includes(pattern.toLowerCase())) {
                console.log(`${fullPath.replace('E:\\ANTIGRAVITY\\ESCOM_STUDIO\\', '')}:${idx + 1} - "${pattern}": ${line.trim()}`);
              }
            }
          });
        }
      }
    } catch (e) {
      // ignore
    }
  }
}

searchDir('E:\\ANTIGRAVITY\\ESCOM_STUDIO');
console.log('Search complete.');
