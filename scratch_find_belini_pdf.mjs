import fs from 'fs';
import readline from 'readline';

const logPath = 'C:/Users/escom/.gemini/antigravity/brain/d27fe65f-37de-4e01-9853-e5d6744dab25/.system_generated/logs/transcript.jsonl';

async function findBelini() {
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
      if (str.includes('proposta-belini') && step.tool_calls) {
        for (const tc of step.tool_calls) {
          if (tc.name === 'run_command') {
            console.log(`[PASSO ${stepIndex}] Command: ${tc.args.CommandLine}`);
          }
        }
      }
    } catch (e) {}
  }
}

findBelini();
