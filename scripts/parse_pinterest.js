import fs from 'fs';

const html = fs.readFileSync('pinterest_search.html', 'utf-8');

// Look for script tags with json data
const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)];
console.log('Script tags count:', scripts.length);

for (let i = 0; i < scripts.length; i++) {
  const content = scripts[i][1];
  if (content.includes('pins') || content.includes('Pin') || content.includes('http')) {
    console.log(`Script ${i} length: ${content.length}, sample: ${content.slice(0, 100)}`);
    if (content.length > 500) {
      // search for pin numbers
      const matches = content.match(/\b\d{18}\b/g);
      if (matches) {
        console.log(`Script ${i} 18-digit numbers:`, matches.slice(0, 10));
      }
      const matches17 = content.match(/\b\d{17}\b/g);
      if (matches17) {
        console.log(`Script ${i} 17-digit numbers:`, matches17.slice(0, 10));
      }
    }
  }
}
