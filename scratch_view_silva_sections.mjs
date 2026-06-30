import fs from 'fs';

const content = fs.readFileSync('public/template-silva-autocenter/index.html', 'utf8');
const faqIndex = content.indexOf('<!-- FAQ');
const footerEndIndex = content.lastIndexOf('</footer>');

if (faqIndex !== -1 && footerEndIndex !== -1) {
  console.log('Tamanho das seções comerciais:', footerEndIndex + 9 - faqIndex);
  fs.writeFileSync('scratch_silva_commercial_sections.html', content.substring(faqIndex, footerEndIndex + 9));
  console.log('Salvo em scratch_silva_commercial_sections.html');
} else {
  console.log('Não encontrado faq ou footer.');
}
