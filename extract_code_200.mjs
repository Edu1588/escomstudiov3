import fs from 'fs';

function extract() {
  const data = JSON.parse(fs.readFileSync('temp_passo_200.json', 'utf-8'));
  const content = data.content || "";
  
  const lines = content.split('\n');
  const cleanedLines = [];
  
  let started = false;
  for (const line of lines) {
    if (!started) {
      if (line.match(/^\s*1:\s+/)) {
        started = true;
      } else {
        continue;
      }
    }
    
    const match = line.match(/^\s*\d+:\s?(.*)$/);
    if (match) {
      cleanedLines.push(match[1]);
    } else {
      cleanedLines.push(line);
    }
  }
  
  if (cleanedLines.length > 0) {
    fs.writeFileSync('src/baseproposta/BaseProposta.tsx', cleanedLines.join('\n'), 'utf-8');
    console.log(`Reconstruído BaseProposta.tsx do Passo 200 com ${cleanedLines.length} linhas!`);
  } else {
    console.error("Não foi possível extrair.");
  }
}

extract();
