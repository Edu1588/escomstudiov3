import fs from 'fs';

const content = fs.readFileSync('api/index.ts', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(440, 540).map((l, i) => `${i + 441}: ${l}`).join('\n'));
