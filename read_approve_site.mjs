import { readFileSync } from 'fs';

const content = readFileSync('E:/ANTIGRAVITY/ESCOM_STUDIO/api/index.ts', 'utf-8');
const lines = content.split('\n');

console.log("=== API ROUETS IN index.ts ===");
lines.forEach((line, idx) => {
  if (line.includes('/approve-site') || line.includes('/generated-sites') || line.includes('Stitch')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
