import { readFileSync } from 'fs';

const content = readFileSync('E:/ANTIGRAVITY/ESCOM_STUDIO/api/index.ts', 'utf-8');
const lines = content.split('\n');

console.log("=== SEARCH FOR STITCH/PROJECT/GENERATE IN index.ts ===");
lines.forEach((line, idx) => {
  const lower = line.toLowerCase();
  if (lower.includes('stitch') || lower.includes('createproject') || lower.includes('generatesite') || lower.includes('generation')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
