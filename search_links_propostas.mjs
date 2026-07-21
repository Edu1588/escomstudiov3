import fs from 'fs';

const content = fs.readFileSync('api/index.ts', 'utf8');
const lines = content.split('\n');
lines.forEach((line, index) => {
  if (line.includes('escom-studio.vercel.app/proposta') || line.includes('proposta?id=')) {
    console.log(`L${index + 1}: ${line.trim().substring(0, 120)}`);
  }
});
