import fs from 'fs';
import readline from 'readline';

const logPath = 'C:/Users/escom/.gemini/antigravity/brain/05d3b164-1f2c-492a-9ebb-4ce2a7fce317/.system_generated/logs/transcript.jsonl';

async function run() {
  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let matchIndex = 0;
  for await (const line of rl) {
    try {
      const step = JSON.parse(line);
      if (step.type === 'USER_INPUT') {
        const content = step.content || '';
        if (content.toLowerCase().includes('definido') || content.toLowerCase().includes('site') || content.toLowerCase().includes('constru') || content.toLowerCase().includes('novatech')) {
          matchIndex++;
          console.log(`\n=== MATCH ${matchIndex} (PASSO ${step.step_index}) ===`);
          console.log(content);
        }
      }
    } catch (e) {}
  }
}

run();
