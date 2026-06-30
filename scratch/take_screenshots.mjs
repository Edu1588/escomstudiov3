import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

const screenshotDir = 'C:/Users/escom/.gemini/antigravity/brain/866b4843-f45a-4d4a-965d-e1d706d8cba8';

const targets = [
  {
    name: 'belini',
    url: 'https://www.escomstudio.com.br/template-belini/'
  },
  {
    name: 'skozi',
    url: 'https://www.escomstudio.com.br/template-skozi-closet/'
  },
  {
    name: 'oralfix',
    url: 'https://www.escomstudio.com.br/template-oralfix/'
  },
  {
    name: 'chiro',
    url: 'https://www.escomstudio.com.br/template-chiroandmovement/'
  },
  {
    name: 'dominium',
    url: 'https://www.escomstudio.com.br/template-dominium-contabilidade/'
  }
];

async function capture() {
  console.log("=== INICIANDO CAPTURA VISUAL REAL COM PUPPETEER ===");
  
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  for (const target of targets) {
    try {
      console.log(`Abrindo: ${target.url}...`);
      const page = await browser.newPage();
      
      // Definir viewport confortável para desktop
      await page.setViewport({ width: 1440, height: 900 });
      
      // Navegar e aguardar o carregamento da rede ficar ocioso
      await page.goto(target.url, { waitUntil: 'networkidle2', timeout: 30000 });
      
      // Simular uma rolagem rápida até o final para disparar todos os reveals/scrolls
      await page.evaluate(async () => {
        await new Promise((resolve) => {
          let totalHeight = 0;
          const distance = 100;
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              resolve();
            }
          }, 50);
        });
      });

      // Voltar ao topo para tirar o screenshot do topo e da primeira rolagem
      await page.evaluate(() => {
        window.scrollTo(0, 0);
      });
      
      // Aguardar meio segundo para as transições finalizarem
      await new Promise(r => setTimeout(r, 600));

      const outputPath = path.join(screenshotDir, `${target.name}_screenshot.png`);
      
      // Capturar apenas a parte visível inicial (viewport) para ver se o hero e a seção seguinte aparecem corretos
      await page.screenshot({
        path: outputPath,
        fullPage: false // Captura a tela conforme visualizada (viewport)
      });
      
      console.log(`[SUCESSO] Screenshot salva em: ${outputPath}`);
      await page.close();
    } catch (err) {
      console.error(`[ERRO] Falha ao capturar ${target.name}:`, err.message);
    }
  }

  await browser.close();
  console.log("=== PROCESSO DE CAPTURA VISUAL FINALIZADO ===");
}

capture();
