import fs from 'fs';
import readline from 'readline';

const logPath = 'C:/Users/escom/.gemini/antigravity/brain/d27fe65f-37de-4e01-9853-e5d6744dab25/.system_generated/logs/transcript_full.jsonl';

async function recover() {
  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let stepCount = 0;
  for await (const line of rl) {
    stepCount++;
    if (stepCount === 200) {
      try {
        const step = JSON.parse(line);
        console.log(`[Passo 200] Lendo dados...`);
        const content = step.content || "";
        console.log(`Tamanho do conteúdo: ${content.length}`);
        
        fs.writeFileSync('temp_passo_200.json', JSON.stringify(step, null, 2), 'utf-8');
        console.log("Salvo temp_passo_200.json");
        
      } catch (err) {
        console.error("Erro:", err);
      }
      break;
    }
  }
}

recover();
