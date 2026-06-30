import fs from 'fs';
import readline from 'readline';

const logPath = 'C:/Users/escom/.gemini/antigravity/brain/d27fe65f-37de-4e01-9853-e5d6744dab25/.system_generated/logs/transcript_full.jsonl';

async function search() {
  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let stepCount = 0;
  for await (const line of rl) {
    stepCount++;
    try {
      const step = JSON.parse(line);
      const str = JSON.stringify(step);
      if (str.includes("990") && (str.includes("real") || str.includes("reais") || str.includes("R$") || str.includes("nacional") || str.includes("nacionais"))) {
        console.log(`[Passo ${stepCount}] - Encontrou 990 com referência a reais/nacional:`);
        if (step.type === "USER_INPUT") {
          console.log(`  USER: ${step.content}`);
        } else if (step.tool_calls) {
          console.log(`  TOOL CALLS: ${JSON.stringify(step.tool_calls).substring(0, 300)}`);
        } else {
          console.log(`  MODEL: ${step.content?.substring(0, 300)}`);
        }
      }
    } catch (e) {
      // ignore
    }
  }
}

search();
