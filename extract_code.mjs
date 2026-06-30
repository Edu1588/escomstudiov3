import fs from 'fs';

function extract() {
  const data = JSON.parse(fs.readFileSync('temp_passo_35.json', 'utf-8'));
  
  // O conteúdo do view_file original geralmente está no content.
  // Vamos analisar onde o texto do arquivo está no JSON.
  const content = data.content || "";
  console.log("Início do content:", content.substring(0, 500));
  
  // O formato pode ser: "1: import React...\n2: ..."
  // Vamos separar por quebras de linha e limpar o prefixo de cada linha.
  const lines = content.split('\n');
  const cleanedLines = [];
  
  let started = false;
  for (const line of lines) {
    // A primeira linha pode conter "File Path:" ou "Total Lines:" etc.
    // O código de verdade começa quando achamos uma linha com "1: import " ou similar.
    if (!started) {
      if (line.match(/^\s*1:\s+/)) {
        started = true;
      } else {
        continue;
      }
    }
    
    // Se a linha começar com "N: ", removemos esse padrão
    const match = line.match(/^\s*\d+:\s?(.*)$/);
    if (match) {
      cleanedLines.push(match[1]);
    } else {
      // Se não der match (linha vazia ou continuação), mas já começamos, adicionamos como está ou tentamos contornar
      cleanedLines.push(line);
    }
  }
  
  if (cleanedLines.length > 0) {
    fs.writeFileSync('src/baseproposta/BaseProposta.tsx', cleanedLines.join('\n'), 'utf-8');
    console.log(`Reconstruído BaseProposta.tsx com ${cleanedLines.length} linhas!`);
  } else {
    console.error("Não foi possível achar o código no content do Passo 35. Verifique o arquivo temp_passo_35.json.");
  }
}

extract();
