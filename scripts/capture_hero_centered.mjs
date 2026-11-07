import puppeteer from 'puppeteer';
import path from 'path';

async function main() {
  console.log("Iniciando captura limpa do HERO...");
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 2 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--ignore-gpu-blocklist', '--enable-webgl', '--enable-features=WebGLDraftExtensions']
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 60000 });

  // Aguarda 8 segundos para a cena 3D carregar e a borboleta estabilizar
  console.log("Aguardando carregamento da cena 3D...");
  await new Promise(r => setTimeout(r, 8500));

  console.log("Removendo todos os textos, HUD, réguas e overlays...");
  await page.evaluate(() => {
    // 1. Remove qualquer elemento de texto, cabeçalho, menu, botões, widgets e réguas
    const toRemove = [
      'header',
      '#top',
      'nav',
      'button',
      'a',
      '[data-curtain]',
      '.loading-curtain',
      // Réguas e elementos de HUD (coordenadas, horário de SP, Fale Conosco, logo grid)
      'div[class*="region"]',
      'div[class*="fixed"]',
      'div[class*="bottom-"]',
      'div[class*="top-"]',
      'div[class*="z-50"]',
      'div[class*="z-40"]',
      'div[class*="bg-[linear-gradient"]',
      'div[class*="bg-gradient-to-b"]',
      'div[class*="bg-[#020807]"]',
      'svg'
    ];
    toRemove.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        // Se for o canvas, não remove!
        if (el.tagName.toLowerCase() !== 'canvas' && !el.querySelector('canvas')) {
          el.style.setProperty('display', 'none', 'important');
        }
      });
    });

    // 2. Garante visibilidade 100% pura do canvas 3D
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach(c => {
      c.style.setProperty('opacity', '1', 'important');
      c.style.setProperty('visibility', 'visible', 'important');
    });
  });

  // Aguarda mais 3 segundos com borboleta brilhando
  await new Promise(r => setTimeout(r, 3500));

  const outDir = 'C:\\Users\\escom\\.gemini\\antigravity\\brain\\12a665ad-e3e2-42f9-a288-c987ad9fd3d2';
  
  // 1. Captura 1920x1080 pura sem nenhum texto ou elemento de HUD
  const outPath1 = path.join(outDir, 'hero_robo_borboleta_blueprint_1080p.png');
  console.log("Salvando captura 1080p limpa...");
  await page.screenshot({
    path: outPath1,
    clip: { x: 0, y: 0, width: 1920, height: 1080 }
  });
  console.log("Salvo:", outPath1);

  // 2. Captura focada no robô, na borboleta e nas paredes do galpão (plano médio majestoso)
  const outPathCrop = path.join(outDir, 'hero_robo_borboleta_closeup.png');
  console.log("Salvando close-up cinematográfico...");
  await page.screenshot({
    path: outPathCrop,
    clip: { x: 400, y: 150, width: 1520, height: 930 }
  });
  console.log("Salvo:", outPathCrop);

  // 3. Captura em 2560x1440 (Ultra HD 2K)
  await page.setViewport({ width: 2560, height: 1440, deviceScaleFactor: 1 });
  await new Promise(r => setTimeout(r, 2000));
  const outPath2K = path.join(outDir, 'hero_robo_borboleta_blueprint_2k.png');
  await page.screenshot({
    path: outPath2K,
    clip: { x: 0, y: 0, width: 2560, height: 1440 }
  });
  console.log("Salvo:", outPath2K);

  await browser.close();
  console.log("Todas as capturas foram concluídas com sucesso!");
}

main().catch(err => {
  console.error("Erro na captura:", err);
  process.exit(1);
});
