import fs from 'fs';

const content = fs.readFileSync('public/template-clinica/dossie.html', 'utf8');
console.log('Tamanho do arquivo:', content.length);

// Search for image extensions or urls
const regex = /url\([^)]+\)|src="[^"]+"|\.png|\.jpg|\.jpeg|\.webp/gi;
let match;
let count = 0;
while ((match = regex.exec(content)) !== null && count < 30) {
  count++;
  console.log(`Match ${count}: ${match[0]} em ${match.index}`);
}
