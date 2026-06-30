import fs from 'fs';
import path from 'path';

const publicDir = 'public';
const dirs = fs.readdirSync(publicDir).filter(f => f.startsWith('template-'));

for (const dir of dirs) {
  const indexPath = path.join(publicDir, dir, 'index.html');
  if (fs.existsSync(indexPath)) {
    const content = fs.readFileSync(indexPath, 'utf8');
    const hasUpsells = content.includes('Módulos Avançados sob Demanda') || content.includes('Serviços Adicionais');
    const hasGreenButton = content.includes('btn-aceitar-proposta') && (content.includes('#2EFF00') || content.includes('bg-[#2EFF00]'));
    console.log(`- ${dir}:`);
    console.log(`  * Possui Módulos/Serviços Adicionais: ${hasUpsells ? 'Sim' : 'Não'}`);
    console.log(`  * Botão de Aceitar é Verde Neon (#2EFF00): ${hasGreenButton ? 'Sim' : 'Não'}`);
  }
}
