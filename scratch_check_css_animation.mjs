import fs from 'fs';

const content = fs.readFileSync('public/template-silva-autocenter/index.html', 'utf8');

// Search for style tag and print it
const regex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
let match;
while ((match = regex.exec(content)) !== null) {
  const css = match[1];
  if (css.includes('shimmer') || css.includes('btn-pdf-shimmer')) {
    console.log('Encontrado CSS de shimmer:');
    console.log(css);
  }
}
