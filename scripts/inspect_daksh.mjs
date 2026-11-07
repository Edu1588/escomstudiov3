import puppeteer from 'puppeteer';
import fs from 'fs';

const outDir = 'C:/Users/escom/.gemini/antigravity/brain/12a665ad-e3e2-42f9-a288-c987ad9fd3d2';

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
      defaultViewport: { width: 1440, height: 900 }
    });
    const page = await browser.newPage();
    console.log('Navigating to https://dakshgajjar.com/ ...');
    await page.goto('https://dakshgajjar.com/', { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Screenshot topo
    await page.screenshot({ path: `${outDir}/daksh_01_top.png` });

    const analysis = await page.evaluate(() => {
      const svgs = Array.from(document.querySelectorAll('svg'));
      const lineElements = [];

      svgs.forEach((svg, index) => {
        const paths = Array.from(svg.querySelectorAll('path'));
        paths.forEach(p => {
          const d = p.getAttribute('d') || '';
          if (d.length > 50) {
            lineElements.push({
              index,
              svgClass: svg.getAttribute('class'),
              svgStyle: svg.getAttribute('style'),
              pathD: d.slice(0, 300) + '... (len: ' + d.length + ')',
              stroke: p.getAttribute('stroke') || getComputedStyle(p).stroke,
              strokeWidth: p.getAttribute('stroke-width') || getComputedStyle(p).strokeWidth,
              strokeDasharray: getComputedStyle(p).strokeDasharray
            });
          }
        });
      });

      return {
        title: document.title,
        lineElements,
        bodyHtmlSnippet: document.body.innerHTML.slice(0, 1000)
      };
    });

    console.log('Analysis result:', JSON.stringify(analysis, null, 2));

    // Scroll 800px
    await page.evaluate(() => window.scrollBy(0, 900));
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: `${outDir}/daksh_02_scroll900.png` });

    // Scroll 1800px
    await page.evaluate(() => window.scrollBy(0, 1200));
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: `${outDir}/daksh_03_scroll2100.png` });

    // Scroll 3200px
    await page.evaluate(() => window.scrollBy(0, 1400));
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: `${outDir}/daksh_04_scroll3500.png` });

    await browser.close();
    console.log('Done!');
  } catch (err) {
    console.error('Error during inspection:', err);
  }
})();
