import { readFileSync } from 'fs';

const content = readFileSync('E:/ANTIGRAVITY/ESCOM_STUDIO/src/admin/pages/Mineracao.tsx', 'utf-8');
const lines = content.split('\n');

const startIndex = 494; // linha 495 (0-indexed seria 494)
console.log(lines.slice(startIndex, startIndex + 100).join('\n'));
