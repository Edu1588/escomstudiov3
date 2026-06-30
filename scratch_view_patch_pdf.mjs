import fs from 'fs';

const content = fs.readFileSync('scratch_patch_belini.js', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('pdf') || line.includes('dossie') || line.includes('dossier') || line.includes('puppeteer')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
