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

  console.log("Acessando Frame Sequence Scrubber...");
  await page.goto("http://localhost:3000/home-teste/index.html", { waitUntil: "networkidle2" });
  
  console.log("Aguardando carregamento dos frames...");
  await page.waitForFunction(() => {
    const el = document.getElementById("loading-overlay");
    return el && (el.style.display === "none" || el.style.opacity === "0");
  }, { timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));

  const steps = [
    { p: 0.0, name: "seq_preview_01_agachado.png" },
    { p: 0.2, name: "seq_preview_02_impulso.png" },
    { p: 0.4, name: "seq_preview_03_ascensao.png" },
    { p: 0.6, name: "seq_preview_04_em_pe.png" },
    { p: 0.8, name: "seq_preview_05_avanco.png" },
    { p: 1.0, name: "seq_preview_06_corte.png" }
  ];

  for (const step of steps) {
    await page.evaluate((val) => window.setProgress(val), step.p);
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: `C:/Users/escom/.gemini/antigravity/brain/12a665ad-e3e2-42f9-a288-c987ad9fd3d2/${step.name}` });
    console.log(`Capturado: ${step.name} (p=${step.p})`);
  }

  console.log("Todas as capturas da sequencia geradas com sucesso!");
  await browser.close();
}

run().catch(console.error);
