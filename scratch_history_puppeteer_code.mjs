import fs from 'fs';
import readline from 'readline';

const logPath = 'C:/Users/escom/.gemini/antigravity/brain/d27fe65f-37de-4e01-9853-e5d6744dab25/.system_generated/logs/transcript.jsonl';

async function searchCode() {
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
      if (str.includes('generate_pdf_puppeteer.mjs') && (str.includes('write_to_file') || str.includes('replace_file_content'))) {
        console.log(`\n--- PASSO ${stepIndex} (${step.type}) ---`);
        if (step.tool_calls) {
          for (const tc of step.tool_calls) {
            if (tc.name === 'write_to_file' || tc.name === 'replace_file_content') {
              console.log(`  Ferramenta: ${tc.name}`);
              console.log(`  CodeContent/ReplacementContent:`, (tc.args.CodeContent || tc.args.ReplacementContent || '').substring(0, 800));
            }
          }
        }
      }
    } catch (e) {}
  }
}

searchCode();
