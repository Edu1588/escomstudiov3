import fs from 'fs';
import readline from 'readline';

const logPath = 'C:/Users/escom/.gemini/antigravity/brain/d27fe65f-37de-4e01-9853-e5d6744dab25/.system_generated/logs/transcript.jsonl';

async function searchHistoryPdf() {
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
      const str = JSON.stringify(step);
      if (str.includes('dossie.pdf') || str.includes('generate_pdf_puppeteer')) {
        console.log(`\n--- PASSO ${stepIndex} (${step.type || 'SYSTEM/TOOL'}) ---`);
        if (step.tool_calls) {
          for (const tc of step.tool_calls) {
            console.log(`  Ferramenta: ${tc.name}`);
            console.log(`  Argumentos:`, JSON.stringify(tc.args).substring(0, 500));
          }
        } else if (step.content) {
          console.log(step.content.substring(0, 1000));
        }
      }
    } catch (e) {}
  }
}

searchHistoryPdf();
