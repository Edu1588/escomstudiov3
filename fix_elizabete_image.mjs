import fs from 'fs';

let content = fs.readFileSync('build_elizabete_v2.mjs', 'utf8');

content = content.replace(
    'https://images.unsplash.com/photo-1596541223130-5d56a7b01004?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop'
);

fs.writeFileSync('build_elizabete_v2.mjs', content, 'utf8');
