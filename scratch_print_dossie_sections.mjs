import fs from 'fs';

const content = fs.readFileSync('public/template-clinica/dossie.html', 'utf8');
const lines = content.split('\n');

// Print first 50 lines and look for sections
console.log('--- FIRST 50 LINES ---');
console.log(lines.slice(0, 50).join('\n'));

console.log('--- HEADINGS ---');
const headings = content.match(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi);
if (headings) {
  headings.forEach(h => console.log(h));
}
