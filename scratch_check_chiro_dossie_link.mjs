import fs from 'fs';

const content = fs.readFileSync('public/template-chiropractic/index.html', 'utf8');

// Find all matches for .pdf or dossie
const regex = /dossie|dossier|pdf/gi;
let match;
while ((match = regex.exec(content)) !== null) {
  console.log(`Encontrado ${match[0]} na posição ${match.index}:`);
  console.log(content.substring(match.index - 50, match.index + 150));
}
