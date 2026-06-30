import fs from 'fs';

const path = 'C:/Users/escom/.gemini/antigravity/brain/d27fe65f-37de-4e01-9853-e5d6744dab25/.system_generated/steps/4553/content.md';
try {
  const content = fs.readFileSync(path, 'utf8');
  const urls = content.match(/https:\/\/www\.implart\.com\.br[^"'\s]*?\.jpg/g);
  if (urls) {
    const unique = [...new Set(urls)].slice(0, 15);
    console.log("IMAGENS ENCONTRADAS:");
    console.log(unique);
  } else {
    console.log("no jpgs found");
  }
} catch (e) {
  console.log(e.message);
}
