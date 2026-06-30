import fs from 'fs';

const content = fs.readFileSync('public/template-clinica/index.html', 'utf8');

const regex = /<script[\s\S]*?>([\s\S]*?)<\/script>/g;
let match;
let count = 0;
while ((match = regex.exec(content)) !== null) {
  count++;
  if (count === 8 || count === 9) {
    console.log(`=== SCRIPT ${count} ===`);
    console.log(match[1].trim());
  }
}
