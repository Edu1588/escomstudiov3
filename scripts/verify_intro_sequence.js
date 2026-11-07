import puppeteer from 'puppeteer';
import path from 'path';

const URL = process.argv[2] || 'http://localhost:4173';
const artifactDir = 'C:\\Users\\escom\\.gemini\\antigravity\\brain\\12a665ad-e3e2-42f9-a288-c987ad9fd3d2';

async function run() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });

  // Poll every 50ms: logo width ratio, satellite state, hero content opacity
  const samples = [];
  const t0 = Date.now();
  let shotTaken = false;
  while (Date.now() - t0 < 14000) {
    const s = await page.evaluate(() => {
      const svg = document.querySelector('svg[viewBox^="0 360"]');
      let ratio = null, pct = null;
      if (svg) {
        // Real rendered width of the wordmark content (getBBox * scale)
        const r = svg.getBoundingClientRect();
        const vb = svg.viewBox.baseVal;
        const scale = Math.min(r.width / vb.width, r.height / vb.height);
        ratio = (vb.width * scale) / window.innerWidth;
        const pctEl = Array.from(document.querySelectorAll('span')).find(e => /^\d+%$/.test(e.textContent.trim()));
        pct = pctEl ? pctEl.textContent.trim() : null;
      }
      const sat = document.querySelector('video[src*="satelite"]');
      const heroContent = document.querySelector('#top > div');
      return {
        ratio, pct,
        curtainPresent: !!svg,
        satTime: sat ? +sat.currentTime.toFixed(2) : null,
        satPaused: sat ? sat.paused : null,
        heroOpacity: heroContent ? getComputedStyle(heroContent).opacity : null,
      };
    });
    s.t = Date.now() - t0;
    samples.push(s);
    if (s.pct === '100%' && !shotTaken) {
      shotTaken = true;
      await page.screenshot({ path: path.join(artifactDir, 'verify_loader_100.png') });
    }
    await new Promise(r => setTimeout(r, 50));
  }

  const maxRatio = Math.max(...samples.filter(s => s.ratio).map(s => s.ratio));
  const curtainGone = samples.find(s => !s.curtainPresent);
  const satStart = samples.find(s => s.satPaused === false);
  const satDuringCurtain = samples.some(s => s.curtainPresent && s.satPaused === false);
  const heroDuringSat = samples.filter(s => s.satPaused === false && s.satTime < 3.4).map(s => s.heroOpacity);
  const heroFinal = samples[samples.length - 1].heroOpacity;

  console.log('Max logo width / viewport :', maxRatio.toFixed(4));
  console.log('Curtain removed at (ms)   :', curtainGone?.t);
  console.log('Satellite started at (ms) :', satStart?.t, 'first currentTime:', satStart?.satTime);
  console.log('Satellite played under curtain?:', satDuringCurtain);
  console.log('Hero opacity during satellite:', [...new Set(heroDuringSat)].join(','));
  console.log('Hero opacity at end         :', heroFinal);

  await page.screenshot({ path: path.join(artifactDir, 'verify_hero_after_satellite.png') });
  await browser.close();
}

run().catch(e => { console.error(e); process.exit(1); });
