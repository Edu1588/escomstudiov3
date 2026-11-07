import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

const htmlPath = 'E:/ANTIGRAVITY/ESCOM_STUDIO/scratch/goodfella/rendered.html';
const html = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(html);

console.log('=== GOOD FELLA ENGENHARIA REVERSA ===');
console.log('Title:', $('title').text());

// 1. Canvas
const canvases = [];
$('canvas').each((i, el) => {
  canvases.push({
    index: i,
    class: $(el).attr('class'),
    style: $(el).attr('style'),
    parentClass: $(el).parent().attr('class'),
    parentStyle: $(el).parent().attr('style')
  });
});
console.log('\n[Canvas]:', canvases);

// 2. Imagens
const images = [];
$('img').each((i, el) => {
  images.push({
    src: $(el).attr('src'),
    alt: $(el).attr('alt'),
    class: $(el).attr('class')
  });
});
console.log('\n[Imagens]:', images);

// 3. SVGs (Logos e Ícones)
const svgs = [];
$('svg').each((i, el) => {
  svgs.push({
    viewBox: $(el).attr('viewBox'),
    class: $(el).attr('class'),
    width: $(el).attr('width'),
    height: $(el).attr('height'),
    parentText: $(el).parent().text().trim().slice(0, 30)
  });
});
console.log('\n[Total SVGs]:', svgs.length);

// 4. Seções completas
const sections = [];
$('section, footer').each((i, el) => {
  sections.push({
    index: i,
    tag: el.tagName,
    class: $(el).attr('class'),
    id: $(el).attr('id') || '',
    h2: $(el).find('h1, h2, h3').map((_, h) => $(h).text().trim().replace(/\s+/g, ' ')).get()
  });
});
console.log('\n[Seções]:', JSON.stringify(sections, null, 2));
