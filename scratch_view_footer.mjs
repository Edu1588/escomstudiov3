import fs from 'fs';

const content = fs.readFileSync('public/template-silva-autocenter/index.html', 'utf8');
const index = content.indexOf('<footer');
if (index !== -1) {
  console.log(content.substring(index, index + 3000));
} else {
  console.log('Não encontrado.');
}
