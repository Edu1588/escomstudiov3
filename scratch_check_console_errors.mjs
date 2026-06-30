import puppeteer from 'puppeteer';
import path from 'path';

async function checkConsoleErrors(slug) {
  console.log(`\n=== Testando Console de ${slug} ===`);
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.error(`[PAGE ERROR]:`, err.message);
  });

  const absolutePath = path.resolve(`public/${slug}/index.html`);
  const fileUrl = `file://${absolutePath}`;

  try {
    await page.goto(fileUrl, { waitUntil: 'load' });
    // Forçar scroll para ativar ScrollTriggers
    await page.evaluate(async () => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await new Promise(r => setTimeout(r, 2000));
  } catch (err) {
    console.error("Erro ao rodar página:", err);
  } finally {
    await browser.close();
  }
}

async function run() {
  await checkConsoleErrors('template-oralfix');
  await checkConsoleErrors('template-chiroandmovement');
}

run();
