import fs from 'fs';

const filePath = 'public/template-clinica/index.html';
let content = fs.readFileSync(filePath, 'utf8');

// Substituições:
content = content.replace(/Clínica Odontológica Restauração/g, 'Clínica ImplArt');
content = content.replace(/Restauração Odontologia/g, 'ImplArt');
content = content.replace(/Odontologia Restauração/g, 'ImplArt');
content = content.replace(/restauracaoodonto/g, 'implart');
content = content.replace(/Restauração/g, 'ImplArt');

fs.writeFileSync(filePath, content);
console.log('Substituição de Restauração para ImplArt concluída no HTML do template!');
