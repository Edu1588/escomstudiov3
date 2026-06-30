import fs from 'fs';
import readline from 'readline';

const logPath = 'C:/Users/escom/.gemini/antigravity/brain/d27fe65f-37de-4e01-9853-e5d6744dab25/.system_generated/logs/transcript_full.jsonl';

async function scan() {
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
      // Vamos procurar se há chamadas de write_to_file ou replace_file_content que contenham o BaseProposta completo ou partes grandes dele
      if (step.tool_calls) {
        for (const tc of step.tool_calls) {
          if (tc.name === "write_to_file" && tc.args.TargetFile && tc.args.TargetFile.includes("BaseProposta.tsx")) {
            console.log(`[Passo ${stepCount}] write_to_file para BaseProposta.tsx com tamanho ${tc.args.CodeContent.length}`);
            fs.writeFileSync(`recovered_step_${stepCount}.tsx`, tc.args.CodeContent, 'utf-8');
          }
          if (tc.name === "replace_file_content" && tc.args.TargetFile && tc.args.TargetFile.includes("BaseProposta.tsx")) {
            console.log(`[Passo ${stepCount}] replace_file_content para BaseProposta.tsx com replacement length ${tc.args.ReplacementContent.length}`);
          }
        }
      }
      // Também verificar se o agent respondeu algo contendo o código
      if (step.content && step.content.includes("import React") && step.content.includes("BaseProposta") && step.content.length > 20000) {
        console.log(`[Passo ${stepCount}] contem bloco de codigo grande de ${step.content.length} caracteres no content.`);
      }
    } catch (e) {
      // ignore
    }
  }
}

scan();
