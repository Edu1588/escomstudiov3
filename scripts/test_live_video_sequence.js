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

  // Wait for loading curtain to finish (about 2.5s)
  await new Promise(r => setTimeout(r, 2800));

  // Take screenshot of Satellite video playing
  await page.screenshot({ path: path.join(artifactDir, 'screenshot_satellite_playing.png') });
  console.log('Saved screenshot_satellite_playing.png');

  // Check which video is playing
  const videoState1 = await page.evaluate(() => {
    const videos = Array.from(document.querySelectorAll('video'));
    return videos.map(v => ({
      src: v.src,
      currentTime: v.currentTime,
      paused: v.paused,
      opacity: window.getComputedStyle(v).opacity
    }));
  });
  console.log('Video State 1 (Satellite):', JSON.stringify(videoState1, null, 2));

  // Wait 4.2 seconds for satellite video to complete (it has 4.004s duration)
  console.log('Waiting for satellite to finish and hero to take over...');
  await new Promise(r => setTimeout(r, 4500));

  // Take screenshot of Hero robot video playing in loop
  await page.screenshot({ path: path.join(artifactDir, 'screenshot_hero_robot_looping.png') });
  console.log('Saved screenshot_hero_robot_looping.png');

  const videoState2 = await page.evaluate(() => {
    const videos = Array.from(document.querySelectorAll('video'));
    return videos.map(v => ({
      src: v.src,
      currentTime: v.currentTime,
      paused: v.paused,
      opacity: window.getComputedStyle(v).opacity
    }));
  });
  console.log('Video State 2 (Hero Robot):', JSON.stringify(videoState2, null, 2));

  await browser.close();
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
