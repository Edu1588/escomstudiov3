import puppeteer from "puppeteer";

async function inspectProd() {
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ["--no-sandbox"]
  });

  const page = await browser.newPage();
  const models = [];
  page.on("request", req => {
    const url = req.url();
    if (url.includes(".glb") || url.includes(".gltf") || url.includes("model") || url.includes(".bin")) {
      models.push(url);
    }
  });

  await page.goto("https://escomstudio.com.br/", { waitUntil: "networkidle2" });
  console.log("Modelos carregados em produção:");
  console.log(JSON.stringify(models, null, 2));

  // Inspecionar nós Three.js em window
  const threeDetails = await page.evaluate(() => {
    return {
      hasCanvas: !!document.querySelector("canvas"),
      canvasCount: document.querySelectorAll("canvas").length
    };
  });
  console.log("Three details:", threeDetails);

  await browser.close();
}

inspectProd().catch(console.error);
