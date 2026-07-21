import fs from 'fs';

const content = fs.readFileSync('src/baseproposta/BaseProposta.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, index) => {
  if (line.includes('selectedServices') || line.includes('selected') || line.includes('services')) {
    console.log(`L${index + 1}: ${line.trim().substring(0, 120)}`);
  }
});
