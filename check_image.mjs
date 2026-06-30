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
    
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.error('PAGE ERROR:', err.message));
    page.on('requestfailed', request => console.error('REQUEST FAILED:', request.url(), request.failure().errorText));

    console.log('Tentando carregar a imagem do robô diretamente...');
    const response = await page.goto('https://res.cloudinary.com/djw0tqmiw/image/upload/v1780432957/egm3ytgfzku5mjpzwfyj.png', { waitUntil: 'networkidle2' });
    
    console.log('Status HTTP da imagem:', response.status());
    if (response.status() === 200) {
      console.log('Imagem carregada com sucesso! Salvando screenshot...');
      await page.screenshot({ path: 'C:\\Users\\escom\\.gemini\\antigravity\\brain\\d27fe65f-37de-4e01-9853-e5d6744dab25\\robot_image_check.png' });
    } else {
      console.error('Falha ao carregar a imagem, status:', response.status());
    }
  } catch (err) {
    console.error('Erro:', err);
  } finally {
    if (browser) await browser.close();
  }
}

run();
