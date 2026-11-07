const puppeteer = require("puppeteer");
const { spawn } = require("child_process");
const path = require("path");
const OUT = "C:\\Users\\escom\\.gemini\\antigravity\\brain\\12a665ad-e3e2-42f9-a288-c987ad9fd3d2";

(async () => {
  const preview = spawn("npx", ["vite", "preview", "--port", "4189", "--strictPort"], { cwd: "e:\\ANTIGRAVITY\\ESCOM_STUDIO", shell: true });
  await new Promise((r) => setTimeout(r, 5000));
  const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-gl=angle"] });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto("http://localhost:4189", { waitUntil: "networkidle2", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 9000));
    await page.mouse.move(5, 5);
    await page.evaluate(() => document.getElementById("trabalhos")?.scrollIntoView({ block: "center" }));
    await new Promise((r) => setTimeout(r, 2500));
    const sec = await page.$("#trabalhos canvas");
    const counter = () => page.evaluate(() => (document.querySelector("#trabalhos")?.innerText.match(/0\d\s*\/\s*0\d/) || [""])[0]);
    const c1 = await counter();
    await sec.screenshot({ path: path.join(OUT, "carousel_lens_a.png") });
    await new Promise((r) => setTimeout(r, 4200));
    const c2 = await counter();
    await sec.screenshot({ path: path.join(OUT, "carousel_lens_b.png") });
    const box = await sec.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await new Promise((r) => setTimeout(r, 300));
    const c3 = await counter();
    await new Promise((r) => setTimeout(r, 5000));
    const c4 = await counter();
    console.log(JSON.stringify({ c1, c2_afterAutoplay: c2, hoverStart: c3, hoverAfter5s: c4 }));
  } finally {
    await browser.close();
    preview.kill();
    process.exit(0);
  }
})();
