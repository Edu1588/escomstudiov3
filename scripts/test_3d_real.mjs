import puppeteer from "puppeteer";

async function run() {
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: [
      "--use-gl=angle",
      "--use-angle=default",
      "--enable-webgl",
      "--ignore-gpu-blocklist",
      "--no-sandbox"
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 810 });

  page.on("console", msg => console.log("PAGE LOG:", msg.text()));

  console.log("Carregando cena 3D...");
  await page.goto("http://localhost:3000/home-teste/index.html", { waitUntil: "networkidle2" });
  
  console.log("Aguardando carregamento completo do robô 3D...");
  await page.waitForFunction(() => {
    const el = document.getElementById("loading-overlay");
    return el && (el.style.display === "none" || el.style.opacity === "0");
  }, { timeout: 60000 });
  await new Promise(r => setTimeout(r, 1000));

  // Captura 1: Robô agachado no galpão
  await page.evaluate(() => window.setProgress(0.0));
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: "public/home-teste/real3d_0pct.png" });

  // Captura 2: Robô de pé com a katana
  await page.evaluate(() => window.setProgress(0.55));
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: "public/home-teste/real3d_55pct.png" });

  // Captura 3: Robô no corte frontal
  await page.evaluate(() => window.setProgress(0.95));
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: "public/home-teste/real3d_95pct.png" });

  console.log("Screenshots 3D reais capturados com sucesso!");
  await browser.close();
}

run().catch(console.error);
