import fs from 'fs';
import readline from 'readline';

const logPath = 'C:/Users/escom/.gemini/antigravity/brain/d27fe65f-37de-4e01-9853-e5d6744dab25/.system_generated/logs/transcript.jsonl';

async function searchProposta() {
  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let stepIndex = 0;
  for await (const line of rl) {
    stepIndex++;
    try {
      const step = JSON.parse(line);
      // We look for user inputs or model responses that talk about the layout or definition of sections
      if (step.type === 'USER_INPUT' && (
        step.content.toLowerCase().includes('preço') || 
        step.content.toLowerCase().includes('proposta') || 
        step.content.toLowerCase().includes('seções') || 
        step.content.toLowerCase().includes('investimento') ||
        step.content.toLowerCase().includes('dossie') ||
        step.content.toLowerCase().includes('dossiê')
      )) {
        console.log(`\n--- PASSO ${stepIndex} (${step.type}) ---`);
        console.log(step.content);
      }
    } catch (e) {}
  }
}

searchProposta();
