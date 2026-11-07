import puppeteer from 'puppeteer';
import path from 'path';

async function capture() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://www.escomstudio.com.br/proposta/barbearia-los-hermanos-marilia', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });

  const artifactDir = 'C:\\Users\\escom\\.gemini\\antigravity\\brain\\12a665ad-e3e2-42f9-a288-c987ad9fd3d2';

  // 1. Hero
  const heroEl = await page.$('#hero');
  if (heroEl) {
    await heroEl.screenshot({ path: path.join(artifactDir, 'screenshot_hero.png') });
  } else {
    await page.screenshot({ path: path.join(artifactDir, 'screenshot_hero.png'), clip: { x: 0, y: 0, width: 1440, height: 900 } });
  }

  // 2. Services
  const servicosEl = await page.$('#servicos');
  if (servicosEl) {
    await servicosEl.screenshot({ path: path.join(artifactDir, 'screenshot_services.png') });
  }

  // 3. Gallery
  const galeriaEl = await page.$('#galeria');
  if (galeriaEl) {
    await galeriaEl.screenshot({ path: path.join(artifactDir, 'screenshot_gallery.png') });
  }

  // 4. Proposal
  const propostaEl = await page.$('#proposta-escom');
  if (propostaEl) {
    await propostaEl.screenshot({ path: path.join(artifactDir, 'screenshot_proposal.png') });
  }

  // 5. Footer
  const footerEl = await page.$('footer');
  if (footerEl) {
    await footerEl.screenshot({ path: path.join(artifactDir, 'screenshot_footer.png') });
  }

  console.log('Screenshots saved successfully!');
  await browser.close();
}

capture().catch(err => {
  console.error('Error capturing screenshot:', err);
  process.exit(1);
});
