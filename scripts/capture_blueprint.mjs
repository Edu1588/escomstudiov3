// Renderiza o galpão real (galpao.glb) em estilo blueprint e salva PNGs de referência.
// Uso: node scripts/capture_blueprint.mjs
import puppeteer from "puppeteer";
import path from "path";

const BASE = "http://localhost:3000/home-teste/blueprint.html";
const OUT = path.resolve("public/home-teste/frames");
const vistas = [
  { nome: "galpao_blueprint_hero", q: "" },
  { nome: "galpao_blueprint_wide", q: "?cam=-8,4.5,-10&alvo=2,4,28&fov=58" },
];

const browser = await puppeteer.launch({ headless: "new", args: ["--use-angle=default", "--ignore-gpu-blocklist"] });
try {
  for (const v of vistas) {
    const page = await browser.newPage();
    page.on("console", (m) => console.log("[page]", m.text()));
    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
    await page.goto(BASE + v.q, { waitUntil: "networkidle0", timeout: 120000 });
    await page.waitForFunction("window.__pronto || window.__erro", { timeout: 120000 });
    const erro = await page.evaluate(() => window.__erro);
    if (erro) throw new Error(erro);
    const file = path.join(OUT, `${v.nome}.png`);
    await page.screenshot({ path: file });
    console.log("Salvo:", file);
    await page.close();
  }
} finally {
  await browser.close();
}
