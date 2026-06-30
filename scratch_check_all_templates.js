import fs from 'fs';
import path from 'path';

const publicDir = 'public';
const dirs = fs.readdirSync(publicDir).filter(f => f.startsWith('template-'));

console.log('Verificando seções comerciais nos templates:');
dirs.forEach(dir => {
    const indexPath = path.join(publicDir, dir, 'index.html');
    if (fs.existsSync(indexPath)) {
        const content = fs.readFileSync(indexPath, 'utf-8');
        const hasProposta = content.includes('proposta-comercial') || content.includes('INVESTIMENTO') || content.includes('Investment');
        const hasDossie = content.includes('dossie') || content.includes('dossier');
        const hasBanner = content.includes('banner-urgencia');
        
        console.log(`- ${dir}:`);
        console.log(`  * Banner Urgência: ${hasBanner ? 'Sim' : 'Não'}`);
        console.log(`  * Seção Proposta: ${hasProposta ? 'Sim' : 'Não'}`);
        console.log(`  * Dossiê Técnico: ${hasDossie ? 'Sim' : 'Não'}`);
    }
});
