import fs from 'fs';
import readline from 'readline';

const logPath = 'C:/Users/escom/.gemini/antigravity/brain/d27fe65f-37de-4e01-9853-e5d6744dab25/.system_generated/logs/transcript_full.jsonl';

async function extract() {
  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let stepCount = 0;
  for await (const line of rl) {
    stepCount++;
    if (stepCount === 390 || stepCount === 392) {
      try {
        const step = JSON.parse(line);
        console.log(`Extraindo Passo ${stepCount}...`);
        fs.writeFileSync(`temp_step_${stepCount}.json`, JSON.stringify(step, null, 2), 'utf-8');
      } catch (err) {
        console.error(err);
      }
    }
  }
}

extract();
