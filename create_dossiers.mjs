import fs from 'fs';
import path from 'path';

const templatePath = path.join(process.cwd(), 'public', 'template-clinica', 'dossie.html');
const template = fs.readFileSync(templatePath, 'utf8');

// 1. Clínica Belini
let dossieBelini = template.replace(/Clínica ImplArt/g, 'Clínica Belini');
dossieBelini = dossieBelini.replace(/Roberto Markarian/g, 'Diretoria Belini');
dossieBelini = dossieBelini.replace(/ImplArt/g, 'Belini');
const dirBelini = path.join(process.cwd(), 'public', 'proposta-belini');
if (!fs.existsSync(dirBelini)) fs.mkdirSync(dirBelini, { recursive: true });
fs.writeFileSync(path.join(dirBelini, 'dossie.html'), dossieBelini);

// 2. Giovana Lumertz
let dossieGiovana = template.replace(/Clínica ImplArt/g, 'Giovana Lumertz Arquitetura');
dossieGiovana = dossieGiovana.replace(/Roberto Markarian/g, 'Giovana Lumertz');
dossieGiovana = dossieGiovana.replace(/ImplArt/g, 'Giovana Lumertz');
const dirGiovana = path.join(process.cwd(), 'public', 'proposta-giovana-lumertz');
if (!fs.existsSync(dirGiovana)) fs.mkdirSync(dirGiovana, { recursive: true });
fs.writeFileSync(path.join(dirGiovana, 'dossie.html'), dossieGiovana);

// 3. Austin Simply Fit
let dossieAustin = template.replace(/Clínica ImplArt/g, 'Austin Simply Fit');
dossieAustin = dossieAustin.replace(/Roberto Markarian/g, 'Austin Simply Fit Team');
dossieAustin = dossieAustin.replace(/ImplArt/g, 'Austin Simply Fit');
const dirAustin = path.join(process.cwd(), 'public', 'proposta-austin-simply-fit');
if (!fs.existsSync(dirAustin)) fs.mkdirSync(dirAustin, { recursive: true });
fs.writeFileSync(path.join(dirAustin, 'dossie.html'), dossieAustin);

console.log("Dossiês gerados com sucesso!");
