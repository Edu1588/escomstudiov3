import puppeteer from 'puppeteer';
import path from 'path';

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950 });
  await page.goto('https://www.escomstudio.com.br', { waitUntil: 'networkidle2', timeout: 45000 });

  const artifactDir = 'C:\\Users\\escom\\.gemini\\antigravity\\brain\\12a665ad-e3e2-42f9-a288-c987ad9fd3d2';

  // Scroll to #metodo
  await page.evaluate(() => {
    const el = document.getElementById('metodo');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(artifactDir, 'screenshot_metodo_transition.png') });
  console.log('Saved screenshot_metodo_transition.png');

  await browser.close();
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
