import fs from 'fs';

const templateCode = fs.readFileSync('api/barbershopTemplate.ts', 'utf8')
  .replace('export function renderBarbershopLandingPage', 'function renderBarbershopLandingPage');

let indexCode = fs.readFileSync('api/index.ts', 'utf8');

const targetStr = '// Função central de geração de landing page para lead via IA';
if (!indexCode.includes(targetStr)) {
  console.error('Target string not found!');
  process.exit(1);
}

indexCode = indexCode.replace(
  targetStr,
  templateCode + '\n\n' + targetStr
);

fs.writeFileSync('api/index.ts', indexCode);
console.log('Successfully embedded renderBarbershopLandingPage into api/index.ts!');
