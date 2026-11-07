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
  await page.goto('https://www.escomstudio.com.br', { waitUntil: 'domcontentloaded', timeout: 45000 });

  const artifactDir = 'C:\\Users\\escom\\.gemini\\antigravity\\brain\\12a665ad-e3e2-42f9-a288-c987ad9fd3d2';

  // Wait 5.8s: loading curtain reaches 100% and opens, satellite video is actively playing!
  console.log('Waiting for curtain to open and satellite video to play...');
  await new Promise(r => setTimeout(r, 5800));

  await page.screenshot({ path: path.join(artifactDir, 'screenshot_satellite_midplay.png') });
  console.log('Saved screenshot_satellite_midplay.png');

  const satState = await page.evaluate(() => {
    const v = document.querySelector('video[src*="satelite.mp4"]');
    return v ? {
      currentTime: v.currentTime,
      duration: v.duration,
      paused: v.paused,
      opacity: window.getComputedStyle(v).opacity
    } : null;
  });
  console.log('Satellite state:', satState);

  await browser.close();
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
