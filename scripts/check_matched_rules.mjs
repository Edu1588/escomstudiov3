import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:3000/en/', { waitUntil: 'domcontentloaded' });
  const rules = await page.evaluate(() => {
    const sec = document.querySelector('[data-page-builder-section="cardsSection"]');
    const cols = sec?.querySelector('.grid-cols-1');
    const matched = [];
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (cols && cols.matches(rule.selectorText)) {
            matched.push({ selector: rule.selectorText, css: rule.cssText });
          }
        }
      } catch (e) {}
    }
    return matched;
  });
  console.log('Matched rules on /en/:', rules);
  await browser.close();
})();
