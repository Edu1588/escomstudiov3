import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

async function checkPage(slug) {
  console.log(`\n=== Verificando ${slug} ===`);
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push('[PAGE ERROR] ' + err.message));

  const absolutePath = path.resolve(`public/${slug}/index.html`);
  await page.goto(`file://${absolutePath}`, { waitUntil: 'networkidle0', timeout: 15000 }).catch(() => {});

  // Aguardar Tailwind compilar
  await new Promise(r => setTimeout(r, 2000));

  // Scroll até o fim para acionar os ScrollTriggers
  await page.evaluate(async () => {
    for (let y = 0; y <= document.body.scrollHeight; y += 300) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 50));
    }
  });
  await new Promise(r => setTimeout(r, 1500));

  // Checar visibilidade dos elementos críticos
  const checks = [
    { sel: '#pilares-grid > div:first-child', name: 'Card Pilar 01' },
    { sel: '#depoimentos-grid > div:first-child', name: 'Card Depoimento 01' },
    { sel: '#galeria-grid > div:first-child', name: 'Card Galeria 01' },
    { sel: '#proposta-comercial', name: 'Seção Proposta Comercial' },
    { sel: '#dossie-comercial', name: 'Seção Dossiê' },
    { sel: '#faq-accordion > div:first-child', name: 'FAQ Item 01' },
  ];

  for (const check of checks) {
    const result = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return { found: false, visible: false, opacity: null, height: null };
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        found: true,
        visible: style.opacity !== '0' && style.display !== 'none' && style.visibility !== 'hidden',
        opacity: style.opacity,
        height: el.offsetHeight,
      };
    }, check.sel);

    const status = !result.found ? '❌ NÃO ENCONTRADO' 
                 : result.visible ? '✅ VISÍVEL' 
                 : `❌ INVISÍVEL (opacity=${result.opacity}, h=${result.height})`;
    console.log(`  ${status} — ${check.name}`);
  }

  // Checar cor da seção comercial (deve ser ciano, não verde)
  const commercialColor = await page.evaluate(() => {
    const el = document.querySelector('#proposta-comercial .border-t-8');
    if (!el) {
      // checar via border-top-color do próprio section
      const sec = document.querySelector('#proposta-comercial');
      if (!sec) return 'elemento não encontrado';
      return window.getComputedStyle(sec).borderTopColor;
    }
    return window.getComputedStyle(el).borderTopColor;
  });
  console.log(`  Cor da borda da seção comercial: ${commercialColor}`);

  // Checar se tem texto "parcelado" ou "12x" na seção comercial
  const hasParcelado = await page.evaluate(() => {
    const sec = document.querySelector('#proposta-comercial');
    return sec ? sec.innerText.toLowerCase().includes('12x') || sec.innerText.toLowerCase().includes('parcel') : false;
  });
  console.log(`  ${hasParcelado ? '❌ AINDA TEM parcelado/12x' : '✅ Sem parcelado/12x'}`);

  if (errors.length > 0) {
    console.log(`  ⚠️  Erros de console: ${errors.length}`);
    errors.forEach(e => console.log(`     → ${e}`));
  } else {
    console.log(`  ✅ Sem erros de console.`);
  }

  await browser.close();
}

async function run() {
  await checkPage('template-oralfix');
  await checkPage('template-chiroandmovement');
  console.log('\n=== Verificação concluída ===');
}

run();
