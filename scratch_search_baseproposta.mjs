import fs from 'fs';

const content = fs.readFileSync('src/baseproposta/BaseProposta.tsx', 'utf8');

// Search for pdf
const regex = /pdf|jspdf|canvas/gi;
let match;
while ((match = regex.exec(content)) !== null) {
  console.log(`Encontrado ${match[0]} em ${match.index}:`);
  console.log(content.substring(match.index - 50, match.index + 150));
  console.log('------------------');
}
