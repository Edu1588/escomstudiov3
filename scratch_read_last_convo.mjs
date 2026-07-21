import fs from 'fs';
import readline from 'readline';

const logPath = 'C:/Users/escom/.gemini/antigravity/brain/05d3b164-1f2c-492a-9ebb-4ce2a7fce317/.system_generated/logs/transcript.jsonl';

async function run() {
  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let events = [];
  for await (const line of rl) {
    try {
      const step = JSON.parse(line);
      if (step.type === 'USER_INPUT') {
        events.push({ type: 'user', content: step.content });
      } else if (step.type === 'PLANNER_RESPONSE' && step.content) {
        events.push({ type: 'model', content: step.content });
      }
    } catch (e) {}
  }

  console.log(`=== ENCONTRADAS ${events.length} INTERAÇÕES ===`);
  const lastEvents = events.slice(-10);
  for (const ev of lastEvents) {
    console.log(`\n--- [${ev.type.toUpperCase()}] ---`);
    console.log(ev.content);
  }
}

run();
