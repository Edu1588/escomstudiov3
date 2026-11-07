import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";

const OUT_DIR = path.resolve("public/home-teste/frames");
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

async function run() {
  console.log("Iniciando Puppeteer para capturar a cena nativa do HERO...");
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--use-gl=angle",
      "--use-angle=default",
      "--enable-webgl",
      "--ignore-gpu-blocklist",
      "--no-sandbox"
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });

  await page.goto("http://localhost:3000/", { waitUntil: "networkidle2", timeout: 60000 });

  console.log("Aguardando carregamento dos assets e abertura da cortina...");
  // Aguarda 6 segundos para a cena 3D carregar e a cortina abrir completamente
  await new Promise(r => setTimeout(r, 7000));

  // Ocultar todos os textos e overlays HTML
  await page.evaluate(() => {
    // Esconde textos, botões, cabeçalhos, rodapés
    const seletoresParaEsconder = [
      "#top",
      "header",
      "nav",
      ".manifesto-grid-frame",
      "[data-fixed-ui]",
      "div.fixed",
      "button",
      "h1",
      "p",
      ".manifesto-tag"
    ];
    seletoresParaEsconder.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        el.style.display = "none";
        el.style.opacity = "0";
      });
    });

    // Remove qualquer elemento com texto sobreposto
    const all = document.querySelectorAll("body *");
    all.forEach(el => {
      if (el.tagName !== "CANVAS" && !el.contains(document.querySelector("canvas"))) {
        const text = el.innerText?.trim();
        if (text && text.length > 0 && !el.querySelector("canvas")) {
          el.style.display = "none";
          el.style.opacity = "0";
        }
      }
    });
  });

  await new Promise(r => setTimeout(r, 1500));

  const outHeroReal = path.join(OUT_DIR, "hero_real_canvas.png");
  await page.screenshot({ path: outHeroReal });
  console.log("Screenshot do HERO nativo salvo em:", outHeroReal);

  await browser.close();
}

run().catch(err => {
  console.error("Erro na captura:", err);
  process.exit(1);
});
