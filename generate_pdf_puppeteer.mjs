import puppeteer from 'puppeteer-core';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const tasks = [
  {
    html: 'file:///E:/Antigravity/ESCOM_STUDIO/public/template-silva-associados/dossie.html',
    pdf: 'E:/Antigravity/ESCOM_STUDIO/public/template-silva-associados/dossie-silva-associados.pdf',
    name: 'Silva & Associados Advocacia'
  },
  {
    html: 'file:///E:/Antigravity/ESCOM_STUDIO/public/template-silva-autocenter/dossie.html',
    pdf: 'E:/Antigravity/ESCOM_STUDIO/public/template-silva-autocenter/dossie-silva-autocenter.pdf',
    name: 'Silva Auto Center'
  },
  {
    html: 'file:///E:/Antigravity/ESCOM_STUDIO/public/template-clinica/dossie.html',
    pdf: 'E:/Antigravity/ESCOM_STUDIO/public/template-clinica/dossie-clinica-implart.pdf',
    name: 'Clínica ImplArt'
  }
];

async function generate() {
  console.log('Iniciando o Chrome Headless com Puppeteer...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  for (const t of tasks) {
    try {
      console.log(`Gerando PDF para ${t.name}...`);
      
      // Se o arquivo antigo existir, vamos tentar apagar para garantir que o novo seja gravado
      if (fs.existsSync(t.pdf)) {
        fs.unlinkSync(t.pdf);
        console.log(`  Arquivo antigo removido com sucesso.`);
      }

      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 1600 });
      
      // Carrega a página e espera até não haver mais requisições de rede (carrega fontes, imagens, etc.)
      await page.goto(t.html, { waitUntil: 'networkidle0' });

      // Emula media screen se quisermos garantir o CSS original, mas como nosso CSS agora é compatível com print, o print resolve.
      // Vamos gerar com as opções exatas de A4 e sem cabeçalhos/rodapés
      await page.pdf({
        path: t.pdf,
        format: 'A4',
        printBackground: true,
        margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
        displayHeaderFooter: false
      });

      console.log(`  PDF gerado com sucesso em: ${t.pdf}`);
      const stats = fs.statSync(t.pdf);
      console.log(`  Tamanho final do PDF: ${stats.size} bytes`);
      await page.close();
    } catch (err) {
      console.error(`  Erro ao gerar PDF para ${t.name}:`, err.message);
    }
  }

  await browser.close();
  console.log('Todos os PDFs processados.');
}

generate();
