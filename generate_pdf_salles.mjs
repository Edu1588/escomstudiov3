import puppeteer from 'puppeteer';
import path from 'path';

async function generatePDF() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Salles Nogueira
  const htmlPathSN = 'file:///' + path.resolve('./public/template-salles-nogueira/dossie.html').replace(/\\/g, '/');
  await page.goto(htmlPathSN, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: './public/template-salles-nogueira/dossie.pdf',
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' }
  });
  console.log('PDF gerado para Salles Nogueira');

  // Dra Elizabete
  const htmlPathEl = 'file:///' + path.resolve('./public/template-elizabete/dossie.html').replace(/\\/g, '/');
  await page.goto(htmlPathEl, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: './public/template-elizabete/dossie.pdf',
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' }
  });
  console.log('PDF gerado para Dra Elizabete');

  await browser.close();
}

generatePDF().catch(console.error);
