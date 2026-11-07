import puppeteer from 'puppeteer';

const outDir = 'C:/Users/escom/.gemini/antigravity/brain/12a665ad-e3e2-42f9-a288-c987ad9fd3d2';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    defaultViewport: { width: 1440, height: 900 }
  });
  const page = await browser.newPage();

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));

  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));

  // 1. Scroll to #metodo (O Diagnóstico -> Nó Embaraçado & Desembaraçado)
  await page.evaluate(() => {
    const el = document.querySelector('#metodo .box__0');
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 220, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: `${outDir}/fio_pagina_01_metodo_no.png` });

  // 1b. Scroll to #arquitetura (3D Cyan Building + Circuito Blueprint)
  await page.evaluate(() => {
    const el = document.querySelector('#arquitetura .graph__data');
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 240, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: `${outDir}/fio_pagina_01b_arquitetura_3d.png` });

  // 2. Scroll to #pilares (Contorno arredondado nos 3 Pilares)
  await page.evaluate(() => {
    const el = document.querySelector('#pilares');
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 120, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: `${outDir}/fio_pagina_02_pilares_contorno.png` });

  // 3. Scroll to #jornada (5 Degraus da Jornada e curva para #sobre)
  await page.evaluate(() => {
    const el = document.querySelector('#jornada .matrix__main');
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 180, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: `${outDir}/fio_pagina_03_jornada_degraus.png` });

  // 4. Scroll to #sobre (Curva Bézier final conectando à seção Construção & IA 24h)
  await page.evaluate(() => {
    const el = document.querySelector('#sobre .matrix__main');
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 180, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: `${outDir}/fio_pagina_04_sobre_fim.png` });

  const svgInfo = await page.evaluate(() => {
    const c = document.getElementById('escom-fio-caminho');
    const nos = document.querySelectorAll('.escom-fio-no');
    const acesos = document.querySelectorAll('.escom-fio-no.aceso');
    return {
      totalLength: c ? Math.round(c.getTotalLength()) : 0,
      nodesCount: nos.length,
      litNodesCount: acesos.length
    };
  });

  console.log('SVG Fio Info:', svgInfo);
  console.log('Errors count:', errors.length);
  if (errors.length) console.log('Errors:', errors);

  await browser.close();
})();
