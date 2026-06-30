import fs from 'fs';

const file = 'public/template-silva-autocenter/index.html';
const content = fs.readFileSync(file, 'utf8');
const index = content.indexOf('id="banner-urgencia"');
if (index !== -1) {
  console.log(content.substring(index - 100, index + 800));
} else {
  console.log('Não encontrado banner-urgencia.');
}
