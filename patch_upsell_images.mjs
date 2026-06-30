import fs from 'fs';
import path from 'path';

const publicDir = './public';
const templates = fs.readdirSync(publicDir).filter(f => f.startsWith('template-'));

const replacements = {
  '/template-silva-autocenter/upsell_crm.png': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
  '/template-silva-autocenter/upsell_dashboard.png': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
  '/template-silva-autocenter/upsell_robot.png': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop',
  '/template-silva-autocenter/upsell_estoque.png': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
  '/template-silva-autocenter/upsell_processos.png': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop',
  '/template-silva-autocenter/upsell_ecommerce.png': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=800&auto=format&fit=crop'
};

templates.forEach(tpl => {
  const htmlPath = path.join(publicDir, tpl, 'index.html');
  if (fs.existsSync(htmlPath)) {
    let content = fs.readFileSync(htmlPath, 'utf8');
    let changed = false;
    for (const [oldSrc, newSrc] of Object.entries(replacements)) {
      if (content.includes(oldSrc)) {
        content = content.split(oldSrc).join(newSrc);
        changed = true;
      }
    }
    if (changed) {
      fs.writeFileSync(htmlPath, content, 'utf8');
      console.log(`Updated images in ${tpl}`);
    }
  }
});
