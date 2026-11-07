import fs from 'fs';

const html = fs.readFileSync('E:/ANTIGRAVITY/ESCOM_STUDIO/public/en/index.html', 'utf8');

// Let's find all tags that contain text or attributes
// Or even better, let's format the HTML with indentation so we can read it cleanly line-by-line!
const formatted = html
  .replace(/></g, '>\n<')
  .split('\n');

console.log('Total formatted lines:', formatted.length);
fs.writeFileSync('E:/ANTIGRAVITY/ESCOM_STUDIO/scripts/enerblock_formatted.html', formatted.join('\n'), 'utf8');
