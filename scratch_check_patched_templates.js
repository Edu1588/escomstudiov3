import fs from 'fs';
import path from 'path';

const publicDir = 'public';
const dirs = fs.readdirSync(publicDir).filter(f => f.startsWith('template-'));

console.log('=== VALIDANDO TEMPLATES APÓS O PATCH ===');
dirs.forEach(dir => {
  const indexPath = path.join(publicDir, dir, 'index.html');
  if (fs.existsSync(indexPath)) {
    const content = fs.readFileSync(indexPath, 'utf-8');
    const hasShimmer = content.includes('btn-pdf-shimmer');
    const hasGreen = content.includes('#2EFF00');
    const hasTwoCols = content.includes('<!-- CORREÇÃO: 2 colunas -->');
    const hasFaq = content.includes('id="faq"');
    const hasDossie = content.includes('id="dossie-comercial"');
    const hasProposta = content.includes('id="proposta-comercial"');
    
    console.log(`- ${dir}:`);
    console.log(`  * FAQ section: ${hasFaq ? 'Sim' : 'Não'}`);
    console.log(`  * Dossiê section: ${hasDossie ? 'Sim' : 'Não'}`);
    console.log(`  * Proposta section: ${hasProposta ? 'Sim' : 'Não'}`);
    console.log(`  * Botão Shimmer: ${hasShimmer ? 'Sim' : 'Não'}`);
    console.log(`  * Cor Verde Neon (#2EFF00): ${hasGreen ? 'Sim' : 'Não'}`);
    console.log(`  * Módulos em 2 Colunas: ${hasTwoCols ? 'Sim' : 'Não'}`);
  }
});
