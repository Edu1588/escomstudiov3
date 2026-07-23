import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

async function generatePDF() {
  console.log("Iniciando geração de PDF para C.I Odontologia...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  const htmlPath = path.resolve('public/template-ci-odontologia/dossie.html');
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
  
  const pdfPath = path.resolve('public/template-ci-odontologia/dossie-ci-odontologia.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });
  
  await browser.close();
  console.log(`PDF gerado com sucesso em: ${pdfPath}`);

  // Copiar também para a raiz em template-ci-odontologia/dossie-ci-odontologia.pdf
  const rootDir = path.resolve('template-ci-odontologia');
  if (!fs.existsSync(rootDir)) {
    fs.mkdirSync(rootDir, { recursive: true });
  }
  fs.copyFileSync(pdfPath, path.join(rootDir, 'dossie-ci-odontologia.pdf'));
  console.log("Cópia sincronizada para a raiz!");
}

generatePDF().catch(err => {
  console.error("Erro ao gerar PDF:", err);
  process.exit(1);
});
