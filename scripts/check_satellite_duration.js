import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const duration = await page.evaluate(async () => {
    const v = document.createElement('video');
    v.src = 'https://res.cloudinary.com/ifuatk2z/video/upload/v1791323378/satelite.mp4';
    return new Promise(resolve => {
      v.onloadedmetadata = () => resolve(v.duration);
      v.onerror = () => resolve(-1);
    });
  });
  console.log('Satellite Duration:', duration, 'seconds');
  await browser.close();
})();
