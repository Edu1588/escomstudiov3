import fs from 'fs';

const content = fs.readFileSync('public/template-silva-autocenter/index.html', 'utf8');
const footerIndex = content.lastIndexOf('<!-- Footer -->');
if (footerIndex !== -1) {
  console.log(content.substring(footerIndex));
} else {
  console.log('Não encontrado.');
}
