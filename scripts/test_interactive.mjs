import puppeteer from "puppeteer";

async function testExperience() {
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 810 });

  await page.goto("http://localhost:3000/home-teste/index.html", { waitUntil: "networkidle2" });
  await new Promise(r => setTimeout(r, 2000));

  // Screenshot Estado 1: 0% (Robô agachado contemplando)
  await page.evaluate(() => window.setProgress(0.0));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: "public/home-teste/teste_0pct.png" });

  // Avançar para 50% (Robô de pé com katana de energia azul)
  await page.evaluate(() => window.setProgress(0.50));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: "public/home-teste/teste_50pct.png" });

  // Avançar para 95% (O Corte rasgando a tela)
  await page.evaluate(() => window.setProgress(0.95));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: "public/home-teste/teste_95pct.png" });

  console.log("Screenshots das 3 etapas capturados com sucesso!");
  await browser.close();
}

testExperience().catch(console.error);
