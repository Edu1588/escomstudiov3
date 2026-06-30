import fs from 'fs';
import readline from 'readline';

const logPath = 'C:/Users/escom/.gemini/antigravity/brain/d27fe65f-37de-4e01-9853-e5d6744dab25/.system_generated/logs/transcript_full.jsonl';

async function searchTranscript() {
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
      // Procurar por chamadas de replace_file_content ou write_to_file para BaseProposta.tsx
      if (JSON.stringify(step).includes("BaseProposta.tsx")) {
        console.log(`[Passo ${stepCount}] - Encontrou menção a BaseProposta.tsx`);
        if (step.tool_calls) {
          for (const tc of step.tool_calls) {
            if (tc.name === "replace_file_content" || tc.name === "write_to_file" || tc.name === "multi_replace_file_content") {
              console.log(`  Ferramenta: ${tc.name}`);
              console.log(`  Argumentos:`, JSON.stringify(tc.args).substring(0, 300) + "...");
            }
          }
        }
        if (step.content && step.content.includes("BaseProposta.tsx")) {
          console.log(`  Tamanho do conteúdo: ${step.content.length}`);
        }
      }
    } catch (e) {
      // ignore parsing errors
    }
  }
  console.log(`Total de passos analisados: ${stepCount}`);
}

searchTranscript();
