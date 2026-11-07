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

  await page.goto('http://localhost:3000/en/', { waitUntil: 'domcontentloaded', timeout: 30000 });

  // Wait for canvas to mount and capture blueprint scan phase (~1.8s)
  await new Promise(r => setTimeout(r, 1800));
  await page.screenshot({ path: `${outDir}/escom_hero_blueprint_scan.png` });

  // Wait another 4s for the crouching robot to solidify, wet floor reflection to appear, and butterfly to land on finger
  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: `${outDir}/escom_hero_blueprint_final.png` });

  // Simulate mouse movement so the blue butterfly flies with sparkle trail
  await page.mouse.move(820, 360, { steps: 15 });
  await new Promise(r => setTimeout(r, 900));
  await page.screenshot({ path: `${outDir}/escom_hero_blueprint_butterfly_flight.png` });

  console.log('Errors count:', errors.length);
  if (errors.length) console.log('Errors:', errors);

  await browser.close();
})();
