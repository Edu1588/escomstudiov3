import puppeteer from 'puppeteer-core';

async function run() {
  let browser;
  try {
    console.log('Conectando ao Chrome na porta 9222...');
    browser = await puppeteer.connect({
      browserWSEndpoint: 'ws://127.0.0.1:9222/devtools/browser/9fcb51ea-0d12-4ac4-8397-50f2e816104f'
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    
    console.log('Navegando para o site...');
    await page.goto('https://escom-studio.vercel.app/', { waitUntil: 'networkidle2' });
    
    console.log('Aguardando sumiço da tela de carregamento...');
    await StartSleep(3500);
    
    console.log('Tirando print do Hero...');
    await page.screenshot({ path: 'C:\\Users\\escom\\.gemini\\antigravity\\brain\\d27fe65f-37de-4e01-9853-e5d6744dab25\\hero_section.png' });
    
    console.log('Rolando até o carrossel de projetos...');
    await page.evaluate(() => {
      const el = document.getElementById('projetos');
      if (el) el.scrollIntoView({ behavior: 'auto' });
    });
    await StartSleep(2000);
    
    console.log('Tirando print do Carrossel...');
    await page.screenshot({ path: 'C:\\Users\\escom\\.gemini\\antigravity\\brain\\d27fe65f-37de-4e01-9853-e5d6744dab25\\projects_section.png' });
    
    console.log('Prints tirados com sucesso!');
    
    const robotInfo = await page.evaluate(() => {
      const el = document.getElementById('hero-robot');
      const parent = document.getElementById('projetos');
      const body = document.body;
      
      if (!el) return 'Elemento #hero-robot não encontrado!';
      
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      const img = el.querySelector('img');
      const imgRect = img ? img.getBoundingClientRect() : null;
      
      const parentRect = parent ? parent.getBoundingClientRect() : null;
      const parentStyle = parent ? window.getComputedStyle(parent) : null;
      
      const bodyRect = body.getBoundingClientRect();
      const bodyStyle = window.getComputedStyle(body);
      
      return {
        tag: el.outerHTML.substring(0, 300),
        rect: { width: rect.width, height: rect.height, left: rect.left, top: rect.top },
        display: style.display,
        position: style.position,
        zIndex: style.zIndex,
        transform: style.transform,
        opacity: style.opacity,
        img: img ? { width: imgRect.width, height: imgRect.height } : 'Sem img',
        parent: parent ? {
          id: parent.id,
          className: parent.className,
          rect: { width: parentRect.width, height: parentRect.height, left: parentRect.left, top: parentRect.top },
          position: parentStyle.position,
          display: parentStyle.display
        } : 'Sem parent',
        body: {
          rect: { width: bodyRect.width, height: bodyRect.height, left: bodyRect.left, top: bodyRect.top },
          margin: bodyStyle.margin,
          padding: bodyStyle.padding,
          width: bodyStyle.width,
          maxWidth: bodyStyle.maxWidth
        }
      };
    });
    
    console.log('--- INFO DO ROBÔ E PAIS ---');
    console.log(JSON.stringify(robotInfo, null, 2));
    
    await page.close();
  } catch (e) {
    console.error('Erro durante a execução do Puppeteer:', e);
  } finally {
    if (browser) await browser.disconnect();
  }
}

function StartSleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

run();
