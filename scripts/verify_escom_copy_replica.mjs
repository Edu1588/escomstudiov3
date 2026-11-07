import puppeteer from 'puppeteer';

const ARTIFACT_DIR = 'C:/Users/escom/.gemini/antigravity/brain/12a665ad-e3e2-42f9-a288-c987ad9fd3d2';

const browser = await puppeteer.launch({
  headless: 'new',
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  defaultViewport: { width: 1440, height: 900 }
});

const page = await browser.newPage();
const errors = [];
const failedReqs = [];

page.on('pageerror', err => errors.push(err.message));
page.on('response', res => {
  if (res.status() >= 400 && !res.url().includes('googletagmanager')) {
    failedReqs.push(`${res.status()} ${res.url()}`);
  }
});

await page.goto('http://localhost:3000/en/', { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 2500));

const totalHeight = await page.evaluate(() => document.documentElement.scrollHeight);
console.log('Total Scroll Height:', totalHeight, 'Page Title:', await page.title());

const captures = [
  { name: 'escom_enerblock_01_hero.png', y: 0 },
  { name: 'escom_enerblock_02_manifesto.png', y: 1700 },
  { name: 'escom_enerblock_03_3d_arquitetura.png', y: 2950 },
  { name: 'escom_enerblock_04_solucoes_stack.png', y: 4700 },
  { name: 'escom_enerblock_05_trabalhos_swiper.png', y: 8100 },
  { name: 'escom_enerblock_06_pilares_jornada.png', y: 9200 },
  { name: 'escom_enerblock_07_prefooter_3d.png', y: totalHeight - 1750 },
  { name: 'escom_enerblock_08_footer_escom.png', y: totalHeight - 900 }
];

for (const c of captures) {
  await page.evaluate(y => window.scrollTo(0, y), c.y);
  await new Promise(r => setTimeout(r, 900));
  await page.screenshot({ path: `${ARTIFACT_DIR}/${c.name}` });
  console.log('Captured:', c.name, 'at y =', c.y);
}

console.log('Errors:', errors.length, 'Failed Reqs:', failedReqs.length);
if (errors.length) console.log('Error details:', errors);
if (failedReqs.length) console.log('Failed req details:', failedReqs);

await browser.close();
