import puppeteer from 'puppeteer';

const ARTIFACT_DIR = 'C:/Users/escom/.gemini/antigravity/brain/12a665ad-e3e2-42f9-a288-c987ad9fd3d2';

const browser = await puppeteer.launch({
  headless: 'new',
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  defaultViewport: { width: 1440, height: 900 }
});

const page = await browser.newPage();
const errors = [];
page.on('pageerror', err => errors.push(err.message));

await page.goto('http://localhost:3000/en/', { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 1500));

// Temporarily disable sticky positioning during individual card screenshot capture so each card 01-06 is captured cleanly in full view
await page.evaluate(() => {
  document.querySelectorAll('.home__stack .stack__item').forEach(el => {
    el.style.position = 'relative';
    el.style.top = '0px';
  });
});

for (let i = 1; i <= 6; i++) {
  const id = `#stack--0${i}`;
  await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo(0, y);
    }
  }, id);
  await new Promise(r => setTimeout(r, 700));
  await page.screenshot({ path: `${ARTIFACT_DIR}/service_anim_0${i}.png` });
  console.log('Captured:', `service_anim_0${i}.png`);
}

console.log('Errors:', errors.length);
if (errors.length) console.log(errors);

await browser.close();
