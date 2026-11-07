import fs from 'fs';
import path from 'path';
import https from 'https';

const baseDir = 'E:/ANTIGRAVITY/ESCOM_STUDIO/public/goodfella';
const assetsDir = path.join(baseDir, 'assets');
const imgDir = path.join(baseDir, 'images');

if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });
if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
      return resolve(dest);
    }
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(dest);
      });
    }).on('error', err => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log('Baixando CSS do Good Fella...');
  await downloadFile('https://good-fella.com/_next/static/chunks/90a90edca99d048d.css', path.join(assetsDir, 'chunk1.css'));
  await downloadFile('https://good-fella.com/_next/static/chunks/b89f16516982ade0.css', path.join(assetsDir, 'chunk2.css'));

  // Concatenar CSS local
  const css1 = fs.readFileSync(path.join(assetsDir, 'chunk1.css'), 'utf8');
  const css2 = fs.readFileSync(path.join(assetsDir, 'chunk2.css'), 'utf8');
  fs.writeFileSync(path.join(assetsDir, 'goodfella.css'), css1 + '\n' + css2, 'utf8');
  console.log('CSS unificado em goodfella.css');

  // Baixar imagens essenciais
  const imgs = [
    { name: 'founders.jpg', url: 'https://cdn.sanity.io/images/degpnzrx/production/c6b897f2873c4b8c2d6f395cf6a5e0e5ed49d9ef-1600x2400.heif?w=1600&h=2400&q=90&auto=format' },
    { name: 'powerade.jpg', url: 'https://cdn.sanity.io/images/degpnzrx/production/9ffc1edd5cf99d75a405c6c125895281b389eb28-1931x1091.jpg?w=1931&h=1091&q=90&auto=format' },
    { name: 'bodyarmor.jpg', url: 'https://cdn.sanity.io/images/degpnzrx/production/08e554af79798c7ce09316be88c0d296ace9ce4a-2250x1500.jpg?w=2250&h=1500&q=90&fit=crop&auto=format' },
    { name: 'annnimate.jpg', url: 'https://cdn.sanity.io/images/degpnzrx/production/4a67c5fddb677d52f4c76ec3e7a52d2861adc898-3462x2550.jpg?w=3462&h=2550&q=90&fit=crop&auto=format' },
    { name: 'wkndhrs.jpg', url: 'https://cdn.sanity.io/images/degpnzrx/production/5d302071b3ef530f3de3528f9f1d3a9678e0643c-3000x2250.jpg?w=3000&h=2250&q=90&fit=crop&auto=format' },
    { name: 'fitgreenmind.jpg', url: 'https://cdn.sanity.io/images/degpnzrx/production/aaf4d81f4ba2322d94bfd8a2f87981244ade97c1-3000x2250.jpg?w=3000&h=2250&q=90&fit=crop&auto=format' },
    { name: 'founders_process.jpg', url: 'https://cdn.sanity.io/images/degpnzrx/production/c7863541ce386e0b47397f3f7aec355f0f0368c6-1600x2400.heif?rect=0,134,1600,2133&w=1600&h=2133&q=90&fit=crop&auto=format' }
  ];

  for (const img of imgs) {
    try {
      console.log(`Baixando ${img.name}...`);
      await downloadFile(img.url, path.join(imgDir, img.name));
    } catch (e) {
      console.warn(`Aviso ao baixar ${img.name}:`, e.message);
    }
  }

  console.log('Downloads concluídos com sucesso!');
}

run();
