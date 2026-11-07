import puppeteer from 'puppeteer';

const outDir = 'C:/Users/escom/.gemini/antigravity/brain/12a665ad-e3e2-42f9-a288-c987ad9fd3d2';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    defaultViewport: { width: 1440, height: 900 }
  });
  const page = await browser.newPage();
  console.log('Opening https://dakshgajjar.com/ ...');
  await page.goto('https://dakshgajjar.com/', { waitUntil: 'networkidle2', timeout: 30000 });
  
  // Wait for loader to disappear
  await new Promise(r => setTimeout(r, 4500));
  await page.screenshot({ path: `${outDir}/daksh_site_01_hero.png` });

  // Scroll down to cards
  await page.evaluate(() => window.scrollBy(0, 1000));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: `${outDir}/daksh_site_02_section.png` });

  await page.evaluate(() => window.scrollBy(0, 1500));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: `${outDir}/daksh_site_03_cards.png` });

  await page.evaluate(() => window.scrollBy(0, 2000));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: `${outDir}/daksh_site_04_further.png` });

  await browser.close();
  console.log('Site captures complete!');
})();
