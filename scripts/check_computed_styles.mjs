import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Checar home-v5
  await page.goto('http://localhost:3000/home-v5/', { waitUntil: 'domcontentloaded' });
  const v5Info = await page.evaluate(() => {
    const sec = document.querySelector('[data-page-builder-section="cardsSection"]');
    const container = sec?.querySelector('.grid-container');
    const layout = sec?.querySelector('.grid-layout');
    const cols = sec?.querySelector('.grid-cols-1, .grid-cols-4, [class*="grid-cols"]');
    return {
      containerW: container ? window.getComputedStyle(container).width : 'null',
      layoutDisplay: layout ? window.getComputedStyle(layout).display : 'null',
      layoutCols: layout ? window.getComputedStyle(layout).gridTemplateColumns : 'null',
      colsDisplay: cols ? window.getComputedStyle(cols).display : 'null',
      colsCols: cols ? window.getComputedStyle(cols).gridTemplateColumns : 'null'
    };
  });
  console.log('V5 Info:', v5Info);

  // 2. Checar /en/
  await page.goto('http://localhost:3000/en/', { waitUntil: 'domcontentloaded' });
  const enInfo = await page.evaluate(() => {
    const sec = document.querySelector('[data-page-builder-section="cardsSection"]');
    const container = sec?.querySelector('.grid-container');
    const layout = sec?.querySelector('.grid-layout');
    const cols = sec?.querySelector('.grid-cols-1, .grid-cols-4, [class*="grid-cols"]');
    return {
      containerW: container ? window.getComputedStyle(container).width : 'null',
      layoutDisplay: layout ? window.getComputedStyle(layout).display : 'null',
      layoutCols: layout ? window.getComputedStyle(layout).gridTemplateColumns : 'null',
      colsDisplay: cols ? window.getComputedStyle(cols).display : 'null',
      colsCols: cols ? window.getComputedStyle(cols).gridTemplateColumns : 'null'
    };
  });
  console.log('EN Info:', enInfo);

  await browser.close();
})();
