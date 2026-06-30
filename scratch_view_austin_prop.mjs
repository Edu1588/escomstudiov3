import fs from 'fs';

const content = fs.readFileSync('public/template-austin-simply-fit/index.html', 'utf8');
const index = content.indexOf('id="proposta-comercial"');
if (index !== -1) {
  console.log(content.substring(index - 100, index + 1500));
} else {
  console.log('Não encontrado.');
}
