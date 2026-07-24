import fs from 'fs';
import path from 'path';

// Arquivos da rota /ci-odontologia
const ciFiles = [
  'public/ci-odontologia/index.html',
  'ci-odontologia/index.html'
];

// Arquivos da rota /template-ci-odontologia
const templateFiles = [
  'public/template-ci-odontologia/index.html',
  'template-ci-odontologia/index.html'
];

const oldHeader = `<div class="flex-shrink-0 flex items-center gap-3">
                    <i class="fa-solid fa-tooth text-ciGold-500 text-3xl"></i>
                    <div>
                        <span class="font-serif font-bold text-2xl text-white tracking-tight block leading-none">C.I Odontologia</span>
                        <span class="text-[9px] text-ciGold-500 font-bold tracking-widest uppercase">Implantes & Reabilitação</span>
                    </div>
                </div>`;

const oldFooter = `<div class="flex items-center gap-2 mb-6">
                    <i class="fa-solid fa-tooth text-ciGold-500 text-2xl"></i>
                    <span class="font-serif font-bold text-2xl text-white">C.I Odontologia</span>
                </div>`;

// Processar arquivos /ci-odontologia
ciFiles.forEach(relativePath => {
  const filePath = path.resolve(relativePath);
  if (!fs.existsSync(filePath)) return;

  let html = fs.readFileSync(filePath, 'utf8');

  // Substituir cabeçalho
  const newHeader = `<a href="#inicio" class="flex-shrink-0 flex items-center">
                    <img src="/ci-odontologia/logo.png" alt="C.I Odontologia" class="h-14 w-auto object-contain">
                </a>`;
  
  // Substituir rodapé
  const newFooter = `<div class="flex items-center mb-6">
                    <img src="/ci-odontologia/logo.png" alt="C.I Odontologia Logo" class="h-12 w-auto object-contain">
                </div>`;

  if (html.includes(oldHeader) || html.includes(oldHeader.replace(/\r\n/g, '\n'))) {
    html = html.replace(oldHeader, newHeader).replace(oldHeader.replace(/\r\n/g, '\n'), newHeader);
  }
  if (html.includes(oldFooter) || html.includes(oldFooter.replace(/\r\n/g, '\n'))) {
    html = html.replace(oldFooter, newFooter).replace(oldFooter.replace(/\r\n/g, '\n'), newFooter);
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`[LOGO PATCH] Aplicado em ${relativePath}`);
});

// Processar arquivos /template-ci-odontologia
templateFiles.forEach(relativePath => {
  const filePath = path.resolve(relativePath);
  if (!fs.existsSync(filePath)) return;

  let html = fs.readFileSync(filePath, 'utf8');

  // Substituir cabeçalho
  const newHeader = `<a href="#inicio" class="flex-shrink-0 flex items-center">
                    <img src="/template-ci-odontologia/logo.png" alt="C.I Odontologia" class="h-14 w-auto object-contain">
                </a>`;
  
  // Substituir rodapé
  const newFooter = `<div class="flex items-center mb-6">
                    <img src="/template-ci-odontologia/logo.png" alt="C.I Odontologia Logo" class="h-12 w-auto object-contain">
                </div>`;

  if (html.includes(oldHeader) || html.includes(oldHeader.replace(/\r\n/g, '\n'))) {
    html = html.replace(oldHeader, newHeader).replace(oldHeader.replace(/\r\n/g, '\n'), newHeader);
  }
  if (html.includes(oldFooter) || html.includes(oldFooter.replace(/\r\n/g, '\n'))) {
    html = html.replace(oldFooter, newFooter).replace(oldFooter.replace(/\r\n/g, '\n'), newFooter);
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`[LOGO PATCH] Aplicado em ${relativePath}`);
});

console.log("[LOGO PATCH] Concluído!");
