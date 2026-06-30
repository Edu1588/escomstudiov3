import fs from 'fs';

const content = fs.readFileSync('api/index.ts', 'utf-8');
const lines = content.split('\n');
for (let i = 440; i <= 540; i++) {
  console.log(`${i}: ${lines[i - 1]}`);
}
