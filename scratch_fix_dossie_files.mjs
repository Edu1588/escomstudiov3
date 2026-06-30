import fs from 'fs';
import path from 'path';

const source = 'public/template-oralfix/dossie.pdf';
const destinations = [
    'public/template-elizabete/dossie.pdf',
    'public/template-chiroandmovement/dossie.pdf'
];

destinations.forEach(dest => {
    if (fs.existsSync(source)) {
        fs.copyFileSync(source, dest);
        console.log(`Copied ${source} to ${dest}`);
    } else {
        console.log(`Source ${source} not found!`);
    }
});
