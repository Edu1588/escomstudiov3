import fs from 'fs';

function extractFromJSON(filename, outputFilename) {
  if (!fs.existsSync(filename)) {
    console.error(`${filename} não existe.`);
    return;
  }
  const data = JSON.parse(fs.readFileSync(filename, 'utf-8'));
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
    fs.writeFileSync(outputFilename, cleanedLines.join('\n'), 'utf-8');
    console.log(`Reconstruído ${outputFilename} com ${cleanedLines.length} linhas!`);
  } else {
    console.error(`Não foi possível extrair de ${filename}`);
  }
}

extractFromJSON('temp_step_390.json', 'recovered_390.tsx');
extractFromJSON('temp_step_392.json', 'recovered_392.tsx');
