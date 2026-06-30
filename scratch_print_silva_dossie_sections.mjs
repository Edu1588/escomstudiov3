import fs from 'fs';

const content = fs.readFileSync('public/template-silva-autocenter/dossie.html', 'utf8');

console.log('--- HEADINGS IN SILVA AUTOCENTER DOSSIE ---');
const headings = content.match(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi);
if (headings) {
  headings.forEach(h => console.log(h));
}

// Check some colors and images
const unsplashUrls = content.match(/https:\/\/images\.unsplash\.com\/[a-zA-Z0-9-?&=%]+/g);
console.log('--- Unsplash URLs in Silva ---');
console.log(unsplashUrls);
