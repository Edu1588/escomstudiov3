import puppeteer from 'puppeteer-core';

async function run() {
  let browser;
  try {
    console.log('Iniciando o Chrome...');
    browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    console.log('Navegando para o site em produção...');
    await page.goto('https://escom-studio.vercel.app/', { waitUntil: 'networkidle2' });

    console.log('Aguardando sumiço da tela de carregamento...');
    await new Promise(r => setTimeout(r, 4000));

    console.log('Obtendo dados de posicionamento...');
    const data = await page.evaluate(() => {
      const robot = document.getElementById('hero-robot');
      const projetos = document.getElementById('projetos');
      const body = document.body;
      const root = document.getElementById('root');
      const rock = document.querySelector('img[alt="Top Floating Asset Overlap"]');
      const rockParent = rock ? rock.parentElement : null;

      const getElementInfo = (el) => {
        if (!el) return 'Não encontrado';
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        return {
          id: el.id,
          tagName: el.tagName,
          className: el.className,
          rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height, right: rect.right, bottom: rect.bottom },
          position: style.position,
          display: style.display,
          widthStyle: style.width,
          maxWidthStyle: style.maxWidth,
          transform: style.transform,
          zIndex: style.zIndex
        };
      };

      return {
        robot: getElementInfo(robot),
        projetos: getElementInfo(projetos),
        rock: getElementInfo(rock),
        rockParent: getElementInfo(rockParent),
        body: getElementInfo(body),
        root: getElementInfo(root),
        viewport: { width: window.innerWidth, height: window.innerHeight }
      };
    });

    console.log('--- INFORMAÇÕES DE LAYOUT ---');
    console.log(JSON.stringify(data, null, 2));

    console.log('Tirando print do Hero...');
    await page.screenshot({ path: 'C:\\Users\\escom\\.gemini\\antigravity\\brain\\d27fe65f-37de-4e01-9853-e5d6744dab25\\hero_section.png' });

    console.log('Rolando para a seção de projetos...');
    await page.evaluate(() => {
      const el = document.getElementById('projetos');
      if (el) el.scrollIntoView({ behavior: 'auto' });
    });
    await new Promise(r => setTimeout(r, 2000));

    console.log('Tirando print da seção de projetos...');
    await page.screenshot({ path: 'C:\\Users\\escom\\.gemini\\antigravity\\brain\\d27fe65f-37de-4e01-9853-e5d6744dab25\\projects_section.png' });

    console.log('Concluído com sucesso!');
  } catch (err) {
    console.error('Erro na execução:', err);
  } finally {
    if (browser) await browser.close();
  }
}

run();
