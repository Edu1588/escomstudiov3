import fs from 'fs';

const content = fs.readFileSync('public/template-clinica/dossie.html', 'utf8');

// Find all elements with class "pdf-page" or pages
const regex = /<div class="pdf-page[^"]*"[^>]*>/g;
let match;
let count = 0;
while ((match = regex.exec(content)) !== null) {
  count++;
  console.log(`Page ${count} found at index ${match.index}:`);
  console.log(content.substring(match.index, match.index + 200));
  console.log('------------------');
}
