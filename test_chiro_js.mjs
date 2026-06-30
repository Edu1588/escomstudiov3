import puppeteer from 'puppeteer';
import path from 'path';

async function checkConsoleErrors(slug) {
  console.log(`\n=== Testando JS de ${slug} ===`);
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  const absolutePath = path.resolve(`E:/ANTIGRAVITY/ESCOM_STUDIO/public/${slug}/index.html`);
  const fileUrl = `file://${absolutePath}`;

  try {
    await page.goto(fileUrl, { waitUntil: 'load' });
    
    // Rolar a página
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 50);
      });
    });

    await new Promise(r => setTimeout(r, 1000));
    
    const opacityResults = await page.evaluate(() => {
      const results = [];
      document.querySelectorAll('.gsap-stagger').forEach((el, i) => {
        const style = window.getComputedStyle(el);
        results.push({
          id: el.id,
          class: el.className.split(' ').filter(c => c !== 'gsap-stagger').join(' '),
          opacity: style.opacity,
          childrenCount: el.children.length,
          childrenOpacity: Array.from(el.children).map(c => window.getComputedStyle(c).opacity)
        });
      });
      return results;
    });

    console.log(`Resultados de Opacidade em ${slug}:`, JSON.stringify(opacityResults, null, 2));

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
