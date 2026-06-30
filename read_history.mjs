import fs from 'fs';
import readline from 'readline';

const logPath = 'C:/Users/escom/.gemini/antigravity/brain/d27fe65f-37de-4e01-9853-e5d6744dab25/.system_generated/logs/transcript.jsonl';

async function readHistory() {
  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let userMessages = [];
  let stepIndex = 0;
  for await (const line of rl) {
    stepIndex++;
    try {
      const step = JSON.parse(line);
      if (step.type === 'USER_INPUT') {
        userMessages.push({
          step: stepIndex,
          content: step.content
        });
      }
    } catch (e) {}
  }

  console.log(`Encontradas ${userMessages.length} mensagens de usuário.`);
  // Print the last 15 user messages
  const lastMessages = userMessages.slice(-15);
  for (const msg of lastMessages) {
    console.log(`\n--- PASSO ${msg.step} ---`);
    console.log(msg.content);
  }
}

readHistory();
