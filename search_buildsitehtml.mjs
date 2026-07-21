import fs from 'fs';

const content = fs.readFileSync('api/index.ts', 'utf8');
const lines = content.split('\n');
lines.forEach((line, index) => {
  if (line.includes('function buildSiteHtml')) {
    console.log(`L${index + 1}: ${line.trim()}`);
  }
});
