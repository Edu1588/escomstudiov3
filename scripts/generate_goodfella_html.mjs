import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

const htmlRaw = fs.readFileSync('E:/ANTIGRAVITY/ESCOM_STUDIO/scratch/goodfella/rendered.html', 'utf8');
const $ = cheerio.load(htmlRaw);

// 1. Remover scripts de tracking e telemetria
$('script[src*="vercel"], script[src*="google"], script[src*="analytics"], script[src*="sentry"]').remove();

// 2. Corrigir links de CSS
$('link[rel="stylesheet"]').each((_, el) => {
  const href = $(el).attr('href');
  if (href && href.includes('_next/static/chunks/')) {
    $(el).remove();
  }
});

// Adicionar nosso CSS unificado local e Typekit
$('head').append(`
  <link rel="stylesheet" href="/goodfella/assets/goodfella.css">
  <link rel="stylesheet" href="https://use.typekit.net/tdy7azi.css">
  <style>
    /* Ajustes de compatibilidade estética */
    body {
      background-color: #141314 !important;
      color: #eeeeee !important;
      font-family: aktiv-grotesk, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      overflow-x: hidden;
    }
    ::selection {
      background: #ff4d00;
      color: #ffffff;
    }
  </style>
`);

// 3. Mapear e substituir URLs das imagens para o caminho local
const imgMap = {
  'c6b897f2873c4b8c2d6f395cf6a5e0e5ed49d9ef': '/goodfella/images/founders.jpg',
  '9ffc1edd5cf99d75a405c6c125895281b389eb28': '/goodfella/images/powerade.jpg',
  '08e554af79798c7ce09316be88c0d296ace9ce4a': '/goodfella/images/bodyarmor.jpg',
  '4a67c5fddb677d52f4c76ec3e7a52d2861adc898': '/goodfella/images/annnimate.jpg',
  '5d302071b3ef530f3de3528f9f1d3a9678e0643c': '/goodfella/images/wkndhrs.jpg',
  'aaf4d81f4ba2322d94bfd8a2f87981244ade97c1': '/goodfella/images/fitgreenmind.jpg',
  'c7863541ce386e0b47397f3f7aec355f0f0368c6': '/goodfella/images/founders_process.jpg'
};

$('img').each((_, el) => {
  let src = $(el).attr('src') || '';
  for (const [key, localPath] of Object.entries(imgMap)) {
    if (src.includes(key)) {
      $(el).attr('src', localPath);
      $(el).removeAttr('srcset');
      $(el).removeClass('opacity-0');
      $(el).addClass('opacity-100');
    }
  }
});

// Salvar em public/goodfella/index.html
const outHtmlPath = 'E:/ANTIGRAVITY/ESCOM_STUDIO/public/goodfella/index.html';
fs.writeFileSync(outHtmlPath, $.html(), 'utf8');
console.log('HTML salvo em:', outHtmlPath);
