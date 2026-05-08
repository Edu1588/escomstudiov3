import fs from 'fs';
const path = 'src/baseproposta/BaseProposta.tsx';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(/0,227,0/g, '46,255,0');
content = content.replace(/0, 227, 0/g, '46, 255, 0');

const adminPath = 'src/admin/pages/Propostas.tsx';
let adminContent = fs.readFileSync(adminPath, 'utf8');
adminContent = adminContent.replace(/0,227,0/g, '46,255,0');
adminContent = adminContent.replace(/0, 227, 0/g, '46, 255, 0');
fs.writeFileSync(adminPath, adminContent, 'utf8');

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed RGB');
