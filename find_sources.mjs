import { readFileSync } from 'fs';

const path = 'C:/Users/escom/.gemini/antigravity/brain/d27fe65f-37de-4e01-9853-e5d6744dab25/.system_generated/steps/12265/content.md';
try {
  const content = readFileSync(path, 'utf-8');
  const lines = content.split('\n');
  console.log("=== LINHAS QUE CONTÉM SOURCE ===");
  lines.forEach((line, idx) => {
    if (line.toLowerCase().includes('source:') || line.toLowerCase().includes('http') && line.length < 200) {
      console.log(`${idx + 1}: ${line}`);
    }
  });
} catch (err) {
  console.error(err);
}
