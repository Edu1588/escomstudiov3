import fs from 'fs/promises';

async function extractImages() {
  const files = [
    './public/template-oralfix/index.html',
    './public/template-chiroandmovement/index.html'
  ];

  for (const file of files) {
    try {
      const content = await fs.readFile(file, 'utf-8');
      console.log(`\n=== Images in ${file} ===`);
      const imgRegex = /<img[^>]+src=["']([^"']+)["']/g;
      let match;
      while ((match = imgRegex.exec(content)) !== null) {
        console.log(`  img src: ${match[1]}`);
      }
      
      const bgRegex = /url\(["']?([^"')]+)["']?\)/g;
      while ((match = bgRegex.exec(content)) !== null) {
        console.log(`  bg url: ${match[1]}`);
      }
    } catch (err) {
      console.log(`Error reading ${file}: ${err.message}`);
    }
  }
}

extractImages();
