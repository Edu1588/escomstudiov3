import fs from 'fs';

const content = fs.readFileSync('public/template-silva-autocenter/index.html', 'utf8');
const regex = /upsell_([a-z0-9]+)\.png/g;
let match;
const found = [];
while ((match = regex.exec(content)) !== null) {
  found.push(match[0]);
}
console.log('Arquivos de imagem de upsell encontrados:', [...new Set(found)]);
