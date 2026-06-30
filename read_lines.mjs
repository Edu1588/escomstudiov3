import { readFileSync } from 'fs';

const content = readFileSync('E:/ANTIGRAVITY/ESCOM_STUDIO/api/index.ts', 'utf-8');
const lines = content.split('\n');

const start = 1310;
const end = 1380;

for (let i = start; i <= end; i++) {
  console.log(`${i}: ${lines[i - 1]}`);
}
