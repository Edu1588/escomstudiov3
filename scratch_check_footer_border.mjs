import fs from 'fs';

const content = fs.readFileSync('public/template-clinica/index.html', 'utf8');
const index = content.indexOf('<footer');
if (index !== -1) {
  const footerHtml = content.substring(index, index + 3500);
  const borders = footerHtml.match(/border[^"\s]*/g);
  console.log('Bordas encontradas no rodapé da Clínica:', borders);
}
