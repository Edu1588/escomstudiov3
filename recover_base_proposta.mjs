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
    if (stepCount === 35) {
      try {
        const step = JSON.parse(line);
        console.log(`[Passo 35] Lendo dados...`);
        // O conteúdo do view_file original está na propriedade 'content' do passo (ou na resposta do tool call)
        const content = step.content || "";
        console.log(`Tamanho do conteúdo do Passo 35: ${content.length}`);
        
        // Vamos salvar o JSON bruto em um arquivo temporário para podermos analisar e extrair o código exato
        fs.writeFileSync('temp_passo_35.json', JSON.stringify(step, null, 2), 'utf-8');
        console.log("Salvo temp_passo_35.json");
        
      } catch (err) {
        console.error("Erro ao processar linha do passo 35:", err);
      }
      break;
    }
  }
}

recover();
