import puppeteer from 'puppeteer';
import path from 'path';

async function main() {
  console.log("Iniciando Puppeteer...");
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 2 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--ignore-gpu-blocklist', '--enable-webgl', '--enable-features=WebGLDraftExtensions']
  });

  const page = await browser.newPage();
  console.log("Navegando para http://localhost:3000/ ...");
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 60000 });

  // Aguarda os modelos 3D carregarem totalmente e a cortina abrir
  console.log("Aguardando carregamento da cena 3D...");
  await new Promise(r => setTimeout(r, 9000));

  // Injeta estilos para remover absolutamente todos os textos, menus, botões e véus de gradiente
  console.log("Removendo textos, botões e sobreposições...");
  await page.evaluate(() => {
    const selectors = [
      'header',
      '#top',
      'nav',
      'button',
      'a',
      '[data-curtain]',
      '.loading-curtain',
      'div[class*="bg-[linear-gradient"]',
      'div[class*="bg-gradient-to-b"]',
      'div[class*="bg-[#020807]"]'
    ];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        el.style.setProperty('display', 'none', 'important');
      });
    });

    const canvases = document.querySelectorAll('canvas');
    canvases.forEach(c => {
      c.style.setProperty('opacity', '1', 'important');
      c.style.setProperty('visibility', 'visible', 'important');
    });
  });

  // Aguarda mais 5 segundos para a borboleta pousar no dedo e estabilizar
  console.log("Aguardando borboleta interagir com o dedo...");
  await new Promise(r => setTimeout(r, 5000));

  const outDir = 'C:\\Users\\escom\\.gemini\\antigravity\\brain\\12a665ad-e3e2-42f9-a288-c987ad9fd3d2';
  const outPath1 = path.join(outDir, 'hero_robo_borboleta_galpao_clean.png');

  console.log("Capturando screenshot 1920x1080...");
  await page.screenshot({
    path: outPath1,
    clip: { x: 0, y: 0, width: 1920, height: 1080 }
  });

  console.log("Screenshot 1 salvo em:", outPath1);

  // Também salvar em 2560x1440 (Ultra-Wide / 2K)
  await page.setViewport({ width: 2560, height: 1440, deviceScaleFactor: 1 });
  await new Promise(r => setTimeout(r, 2000));
  const outPath2 = path.join(outDir, 'hero_robo_borboleta_galpao_2k.png');
  await page.screenshot({
    path: outPath2,
    clip: { x: 0, y: 0, width: 2560, height: 1440 }
  });
  console.log("Screenshot 2 (2K) salvo em:", outPath2);

  await browser.close();
  console.log("Processo finalizado com sucesso!");
}

main().catch(err => {
  console.error("Erro no script de captura:", err);
  process.exit(1);
});
