import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function generatePdf() {
  const htmlPath = path.join(process.cwd(), 'public', 'site-consultoria-ma', 'dossie.html');
  const pdfPath = path.join(process.cwd(), 'public', 'site-consultoria-ma', 'dossie-consultoria-ma.pdf');

  console.log('Iniciando o Chrome Headless via Puppeteer...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1600 });
  const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
    displayHeaderFooter: false
  });

  console.log('✅ PDF do Dossiê do Nicho 1 (VSH Partners M&A) gerado com sucesso!');
  const stats = fs.statSync(pdfPath);
  console.log(`Tamanho final do PDF: ${stats.size} bytes`);

  await browser.close();
}

generatePdf().catch(console.error);
