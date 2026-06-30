import fs from 'fs';
import readline from 'readline';

const logPath = 'C:/Users/escom/.gemini/antigravity/brain/d27fe65f-37de-4e01-9853-e5d6744dab25/.system_generated/logs/transcript.jsonl';

async function findPdfGen() {
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
      // We look for where the agent runs commands like "node" or "npm" or "npx" that might generate these PDFs,
      // or where they write pdf files.
      if (str.includes('dossie.pdf') && step.tool_calls) {
        for (const tc of step.tool_calls) {
          if (tc.name === 'run_command' && (tc.args.CommandLine.includes('node') || tc.args.CommandLine.includes('pdf') || tc.args.CommandLine.includes('dossie'))) {
            console.log(`[PASSO ${stepIndex}] Command: ${tc.args.CommandLine}`);
          }
        }
      }
    } catch (e) {}
  }
}

findPdfGen();
