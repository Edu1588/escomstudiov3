import fs from 'fs';

const content = fs.readFileSync('public/template-belini/index.html', 'utf8');
const index = content.indexOf('Barra inferior simétrica');
if (index !== -1) {
  console.log(content.substring(index - 100, index + 1500));
} else {
  console.log('Não encontrado.');
}
