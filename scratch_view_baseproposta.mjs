import fs from 'fs';

const content = fs.readFileSync('src/baseproposta/BaseProposta.tsx', 'utf8');

// Find all unsplash urls
const urls = content.match(/https:\/\/images\.unsplash\.com\/[a-zA-Z0-9-?&=%_]+/g);
console.log('Unsplash URLs in BaseProposta.tsx:');
console.log([...new Set(urls)]);
