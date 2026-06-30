import fs from 'fs';
import path from 'path';

const publicDir = 'public';
const dirs = fs.readdirSync(publicDir).filter(f => f.startsWith('proposta-') || f.startsWith('template-'));

for (const dir of dirs) {
  const fullPath = path.join(publicDir, dir);
  if (fs.statSync(fullPath).isDirectory()) {
    const files = fs.readdirSync(fullPath);
    console.log(`- ${dir}:`);
    files.forEach(f => {
      const stats = fs.statSync(path.join(fullPath, f));
      console.log(`  * ${f} (${stats.sizeBytes || stats.size} bytes)`);
    });
  }
}
