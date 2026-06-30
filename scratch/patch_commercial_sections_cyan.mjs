import fs from 'fs';
import path from 'path';

const filePath = path.resolve('scratch_patch_all_commercial_sections.js');
let code = fs.readFileSync(filePath, 'utf8');

// 1. Substituir cores nas seções de prospecção (de verde #2EFF00 para azul ciano #02c5ba)
code = code.replace(/#2EFF00/g, '#02c5ba');
code = code.replace(/#28e600/g, '#00b5ab');
code = code.replace(/rgba\(46,\s*255,\s*0/g, 'rgba(2, 197, 186');

// 2. Modificar as configurações de templates (templateConfigs) para incluir oralfix, chiroandmovement e elizabete
const oldConfigsStart = 'const templateConfigs = [';
const oldConfigsEnd = '];';

const startIndex = code.indexOf(oldConfigsStart);
const endIndex = code.indexOf(oldConfigsEnd, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  const newConfigs = `const templateConfigs = [
  {
    dir: 'template-belini',
    display: 'Clínica Belini',
    isEn: false,
    pdfUrl: '/proposta-belini/dossie.pdf',
    faqKey: 'belini',
    contactLang: 'belini'
  },
  {
    dir: 'template-chiropractic',
    display: 'Miami Chiropractic',
    isEn: true,
    pdfUrl: '/proposta-escom-miami-chiropractic-wellness?pdf=true',
    faqKey: 'chiropractic',
    contactLang: 'chiropractic'
  },
  {
    dir: 'template-clinica',
    display: 'Clínica ImplArt',
    isEn: false,
    pdfUrl: '/template-clinica/dossie-clinica-implart.pdf',
    faqKey: 'clinica',
    contactLang: 'clinica'
  },
  {
    dir: 'template-giovana-lumertz',
    display: 'Giovana Lumertz',
    isEn: false,
    pdfUrl: '/proposta-giovana-lumertz/dossie.pdf',
    faqKey: 'giovana',
    contactLang: 'giovana'
  },
  {
    dir: 'template-austin-simply-fit',
    display: 'Austin Simply Fit',
    isEn: true,
    pdfUrl: '/proposta-austin-simply-fit/dossie.pdf',
    faqKey: 'austin',
    contactLang: 'austin'
  },
  {
    dir: 'template-silva-autocenter',
    display: 'Silva Auto Center',
    isEn: false,
    pdfUrl: '/template-silva-autocenter/dossie-silva-autocenter.pdf',
    faqKey: 'silva',
    contactLang: 'silva'
  },
  {
    dir: 'template-oralfix',
    display: 'Oral Fix',
    isEn: false,
    pdfUrl: '/template-oralfix/dossie.pdf',
    faqKey: 'clinica',
    contactLang: 'clinica'
  },
  {
    dir: 'template-chiroandmovement',
    display: 'Chiro and Movement',
    isEn: true,
    pdfUrl: '/template-chiroandmovement/dossie.pdf',
    faqKey: 'chiropractic',
    contactLang: 'chiropractic'
  },
  {
    dir: 'template-elizabete',
    display: 'Dra. Elizabete De Marchi',
    isEn: false,
    pdfUrl: '/proposta-belini/dossie.pdf',
    faqKey: 'belini',
    contactLang: 'belini'
  }
];`;

  code = code.substring(0, startIndex) + newConfigs + code.substring(endIndex + oldConfigsEnd.length);
  console.log("Configurações dos templates atualizadas com sucesso!");
} else {
  console.error("Não foi possível encontrar a definição de templateConfigs no arquivo.");
}

fs.writeFileSync(filePath, code, 'utf8');
console.log("Arquivo scratch_patch_all_commercial_sections.js patcheado com sucesso para usar azul ciano e novos templates!");
