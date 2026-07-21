import fs from 'fs';
import path from 'path';
import readline from 'readline';

const brainDir = 'C:/Users/escom/.gemini/antigravity/brain';

if (!fs.existsSync(brainDir)) {
  console.log(`Diretório ${brainDir} não existe.`);
  process.exit(1);
}

const dirs = fs.readdirSync(brainDir);
console.log(`Encontrados ${dirs.length} subdiretórios em brain.`);

const results = [];

for (const dir of dirs) {
  const logPath = path.join(brainDir, dir, '.system_generated/logs/transcript.jsonl');
  const fullLogPath = path.join(brainDir, dir, '.system_generated/logs/transcript_full.jsonl');
  
  let targetPath = logPath;
  if (!fs.existsSync(targetPath) && fs.existsSync(fullLogPath)) {
    targetPath = fullLogPath;
  }
  
  if (fs.existsSync(targetPath)) {
    const stats = fs.statSync(targetPath);
    results.push({
      dir,
      mtime: stats.mtime,
      logPath: targetPath
    });
  }
}

results.sort((a, b) => b.mtime - a.mtime);

async function getLogSummary(res) {
  const fileStream = fs.createReadStream(res.logPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let userMessages = [];
  let steps = 0;
  for await (const line of rl) {
    steps++;
    try {
      const step = JSON.parse(line);
      if (step.type === 'USER_INPUT') {
        userMessages.push(step.content);
      }
    } catch (e) {}
  }
  return {
    dir: res.dir,
    mtime: res.mtime,
    steps,
    userMessages
  };
}

const summaries = [];
for (const res of results.slice(0, 10)) {
  try {
    const sum = await getLogSummary(res);
    summaries.push(sum);
  } catch (e) {
    console.error(`Erro ao ler ${res.dir}:`, e.message);
  }
}

console.log("\nSumário das conversas recentes:");
for (const sum of summaries) {
  console.log(`\n=========================================`);
  console.log(`Conversa: ${sum.dir}`);
  console.log(`Data: ${sum.mtime.toLocaleString()}`);
  console.log(`Passos: ${sum.steps}`);
  console.log(`Mensagens de Usuário encontradas: ${sum.userMessages.length}`);
  if (sum.userMessages.length > 0) {
    console.log(`Últimas mensagens:`);
    const lastMsgs = sum.userMessages.slice(-3);
    for (const msg of lastMsgs) {
      console.log(`---`);
      console.log(msg.substring(0, 400) + (msg.length > 400 ? '...' : ''));
    }
  }
}
