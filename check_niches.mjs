import fs from 'fs';
import path from 'path';

const publicDir = 'public';
const dirs = fs.readdirSync(publicDir).filter(f => f.startsWith('template-'));

for (const dir of dirs) {
  const indexPath = path.join(publicDir, dir, 'index.html');
  if (fs.existsSync(indexPath)) {
    const content = fs.readFileSync(indexPath, 'utf8');
    const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : 'Sem título';
    
    // Let's get some meta tags or first few text paragraphs
    const metaDescMatch = content.match(/<meta[^>]+name="description"[^>]+content="([^"]+)"/i) || content.match(/<meta[^>]+content="([^"]+)"[^>]+name="description"/i);
    const desc = metaDescMatch ? metaDescMatch[1].trim() : 'Sem meta description';
    
    console.log(`- ${dir}:`);
    console.log(`  * Title: ${title}`);
    console.log(`  * Desc: ${desc}`);
  }
}
