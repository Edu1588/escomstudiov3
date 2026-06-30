import fs from 'fs';

try {
  let html = fs.readFileSync('public/template-clinica/index.html', 'utf8');
  
  // Substituindo a paleta Emerald/Green pela paleta Premium Violet/Purple
  html = html.replace(/#006d40/gi, '#4C1D95'); // primary e surface-tint
  html = html.replace(/#2bb673/gi, '#6B21A8'); // primary-container
  html = html.replace(/#5cde97/gi, '#8B5CF6'); // primary-fixed-dim / inverse-primary
  html = html.replace(/#7afbb1/gi, '#A78BFA'); // primary-fixed
  
  html = html.replace(/#00522f/gi, '#4C1D95'); // on-primary-fixed-variant
  html = html.replace(/#004024/gi, '#312E81'); // on-primary-container
  html = html.replace(/#002110/gi, '#1E1B4B'); // on-primary-fixed

  fs.writeFileSync('public/template-clinica/index.html', html, 'utf8');
  console.log('Cores da ImplArt atualizadas para Violeta com sucesso!');
} catch (error) {
  console.error('Erro ao atualizar cores:', error);
}
