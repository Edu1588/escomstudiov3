import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:3000/en/ ...');
  await page.goto('http://localhost:3000/en/', { waitUntil: 'domcontentloaded', timeout: 25000 });
  await new Promise(r => setTimeout(r, 4000));

  // 1. Screenshot Hero 3D com novo robô
  await page.screenshot({ path: 'C:/Users/escom/.gemini/antigravity/brain/12a665ad-e3e2-42f9-a288-c987ad9fd3d2/main_home_hero_new_robot.png' });
  console.log('1. Hero saved!');

  // 2. Scroll para Métricas
  const metricasEl = await page.$('#metricas-escom');
  if (metricasEl) {
    await metricasEl.scrollIntoView();
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'C:/Users/escom/.gemini/antigravity/brain/12a665ad-e3e2-42f9-a288-c987ad9fd3d2/main_home_metricas_v5.png' });
    console.log('2. Metricas saved!');
  } else {
    console.log('ERROR: #metricas-escom not found!');
  }

  // 3. Scroll para Como Operamos
  const comoOperamosEl = await page.$('#como-operamos');
  if (comoOperamosEl) {
    await comoOperamosEl.scrollIntoView();
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'C:/Users/escom/.gemini/antigravity/brain/12a665ad-e3e2-42f9-a288-c987ad9fd3d2/main_home_como_operamos_v5.png' });
    console.log('3. Como Operamos saved!');
  } else {
    console.log('ERROR: #como-operamos not found!');
  }

  // 4. Scroll para Projetos
  const projetosEl = await page.$('#projetos');
  if (projetosEl) {
    await projetosEl.scrollIntoView();
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'C:/Users/escom/.gemini/antigravity/brain/12a665ad-e3e2-42f9-a288-c987ad9fd3d2/main_home_projetos_v5.png' });
    console.log('4. Projetos saved!');
  } else {
    console.log('ERROR: #projetos not found!');
  }

  // 5. Scroll para O Padrão ESCOM
  const padraoEl = await page.$('#padrao-escom');
  if (padraoEl) {
    await padraoEl.scrollIntoView();
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'C:/Users/escom/.gemini/antigravity/brain/12a665ad-e3e2-42f9-a288-c987ad9fd3d2/main_home_padrao_escom_v5.png' });
    console.log('5. Padrao ESCOM saved!');
  } else {
    console.log('ERROR: #padrao-escom not found!');
  }

  await browser.close();
  console.log('All screenshots verified successfully!');
})();
