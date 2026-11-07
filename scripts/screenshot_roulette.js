import puppeteer from 'puppeteer';
import path from 'path';

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950 });

  console.log('Navigating to https://www.escomstudio.com.br ...');
  await page.goto('https://www.escomstudio.com.br', { waitUntil: 'networkidle2', timeout: 35000 });

  console.log('Scrolling to #trabalhos...');
  await page.evaluate(() => {
    const el = document.getElementById('trabalhos');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });

  await new Promise(r => setTimeout(r, 2000));

  const artifactDir = 'C:\\Users\\escom\\.gemini\\antigravity\\brain\\12a665ad-e3e2-42f9-a288-c987ad9fd3d2';

  // Hover explicitly over the center card
  console.log('Triggering hover on active card...');
  const cardHandle = await page.$('#trabalhos .group');
  if (cardHandle) {
    const box = await cardHandle.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    }
  }

  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ 
    path: path.join(artifactDir, 'screenshot_roulette_hover_verified.png')
  });
  console.log('Saved screenshot_roulette_hover_verified.png');

  await browser.close();
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
