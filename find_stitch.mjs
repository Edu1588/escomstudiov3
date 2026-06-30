import { readFileSync } from 'fs';

const content = readFileSync('E:/ANTIGRAVITY/ESCOM_STUDIO/src/admin/pages/Mineracao.tsx', 'utf-8');
const lines = content.split('\n');

console.log("=== STITCH / GENERATE / API ===");
lines.forEach((line, idx) => {
  if (line.toLowerCase().includes('stitch') || line.toLowerCase().includes('generate') || line.toLowerCase().includes('api/approve') || line.toLowerCase().includes('database') || line.toLowerCase().includes('collection')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
