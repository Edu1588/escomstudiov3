import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    defaultViewport: { width: 1440, height: 900 }
  });
  const page = await browser.newPage();
  await page.goto('https://dakshgajjar.com/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 4500));

  // Extract Orbit project SVG and thread layers
  const threadInfo = await page.evaluate(() => {
    const svgs = Array.from(document.querySelectorAll('svg'));
    return svgs.map((s, idx) => ({
      idx,
      className: s.getAttribute('class'),
      viewBox: s.getAttribute('viewBox'),
      pathCount: s.querySelectorAll('path').length,
      samplePaths: Array.from(s.querySelectorAll('path')).map(p => ({
        d: p.getAttribute('d'),
        stroke: p.getAttribute('stroke') || getComputedStyle(p).stroke,
        dasharray: getComputedStyle(p).strokeDasharray
      }))
    })).filter(s => s.samplePaths.some(p => p.d && p.d.length > 100));
  });

  console.log('Thread layers found:', JSON.stringify(threadInfo.slice(0, 5), null, 2));
  await browser.close();
})();
