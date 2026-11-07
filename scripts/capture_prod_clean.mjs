import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";

const DIR = path.resolve("public/home-teste/frames/cena1");
if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });

async function main() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--use-gl=angle", "--use-angle=default", "--enable-webgl", "--ignore-gpu-blocklist", "--no-sandbox"]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });

  await page.goto("https://escomstudio.com.br/", { waitUntil: "networkidle2", timeout: 90000 });
  await new Promise(r => setTimeout(r, 8000));

  await page.evaluate(() => {
    // 1. Remover header, nav, aside (chat/fale conosco), etc
    const seletores = [
      "#top", "header", "nav", "aside", "[data-fixed-ui]", "div.fixed", "button", "h1", "p", "span", "a",
      ".manifesto-grid-frame", ".manifesto-tag", "iframe"
    ];
    seletores.forEach(s => {
      document.querySelectorAll(s).forEach(el => el.remove());
    });

    // 2. Remover qualquer elemento além do canvas no body
    document.querySelectorAll("aside").forEach(el => el.remove());
    document.querySelectorAll("[class*='fixed']").forEach(el => el.remove());
  });

  await new Promise(r => setTimeout(r, 1000));

  const canvasEl = await page.$("canvas");
  const outHero = path.resolve("public/home-teste/frames/cena1/frame_1A_hero_limpo.png");
  if (canvasEl) {
    await canvasEl.screenshot({ path: outHero });
    console.log("Canvas Three.js capturado diretamente em:", outHero);
  } else {
    await page.screenshot({ path: outHero });
    console.log("Cena HERO salva em:", outHero);
  }

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
