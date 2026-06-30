import fs from 'fs';

const content = fs.readFileSync('public/template-clinica/dossie.html', 'utf8');

// Find all unsplash images
const unsplashUrls = content.match(/https:\/\/images\.unsplash\.com\/[a-zA-Z0-9-?&=%]+/g);
console.log('--- Unsplash URLs ---');
console.log(unsplashUrls);

// Let's search for color hexes or color styles
const colors = content.match(/#[a-fA-F0-9]{6}/g);
console.log('--- Colors found ---');
console.log([...new Set(colors)]);
