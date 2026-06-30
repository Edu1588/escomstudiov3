import fs from 'fs';

const files = fs.readdirSync('.').filter(f => f.endsWith('.js') || f.endsWith('.mjs'));
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('puppeteer')) {
    console.log(`- ${file} importou ou usou puppeteer`);
  }
}
