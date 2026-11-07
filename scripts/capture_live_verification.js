import puppeteer from 'puppeteer';
import path from 'path';

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950 });

  console.log('Visiting live website...');
  await page.goto('https://www.escomstudio.com.br', { waitUntil: 'networkidle2', timeout: 45000 });

  const artifactDir = 'C:\\Users\\escom\\.gemini\\antigravity\\brain\\12a665ad-e3e2-42f9-a288-c987ad9fd3d2';

  // 1. Screenshot of floating contact button on the bottom right of hero
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(artifactDir, 'screenshot_live_orb_button.png') });
  console.log('Saved screenshot_live_orb_button.png');

  // 2. Scroll to #trabalhos for LiquidGlassCarousel
  await page.evaluate(() => {
    const el = document.getElementById('trabalhos');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(artifactDir, 'screenshot_liquid_glass_portfolio.png') });
  console.log('Saved screenshot_liquid_glass_portfolio.png');

  // 3. Scroll to #performance for streamlined PageSpeed + Method transition
  await page.evaluate(() => {
    const el = document.getElementById('performance');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(artifactDir, 'screenshot_pagespeed_streamlined.png') });
  console.log('Saved screenshot_pagespeed_streamlined.png');

  await browser.close();
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
