import fs from 'fs';

const filePath = 'public/template-clinica/index.html';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/\+55 \(11\) 3456-7890/g, '(11) 99598-1866');
content = content.replace(/contato@restauracao\.com/g, 'contato@implart.com.br');
// Certificar que R. Augusta 1500 não está lá, se não, trocar pra Cincinato Braga, 37 - conj. 112
content = content.replace(/Rua Augusta, 1500/g, 'R. Cincinato Braga, 37 - conj. 112, Bela Vista - São Paulo-SP - CEP 01333-011');
content = content.replace(/Rua Cincinato Braga, 37 - Bela Vista, SP/g, 'R. Cincinato Braga, 37 - conj. 112, Bela Vista - São Paulo-SP');

fs.writeFileSync(filePath, content);
console.log('Dados de contato e footer atualizados para ImplArt!');
