import puppeteer from "puppeteer";

async function enterSite() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto("https://santionispirits.com/", { waitUntil: "networkidle2" });
  await new Promise(r => setTimeout(r, 1500));

  // Clica no botão YES
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button, div, a"));
    const yesBtn = btns.find(b => b.textContent && b.textContent.trim().toUpperCase() === "YES");
    if (yesBtn) yesBtn.click();
  });

  console.log("Clicou no YES! Aguardando transição de entrada...");
  await new Promise(r => setTimeout(r, 4000));

  await page.screenshot({ path: "public/home-teste/santioni_main_home.png" });

  // Rola para a seção dos produtos / história
  for (let s = 1; s <= 5; s++) {
    await page.evaluate((step) => window.scrollBy(0, 1000), s);
    await new Promise(r => setTimeout(r, 1000));
  }

  await page.screenshot({ path: "public/home-teste/santioni_scrolled.png" });

  const techStack = await page.evaluate(() => {
    // Inspecionar canvas WebGL e shaders em execução
    const canvas = document.querySelector("canvas");
    const gl = canvas ? (canvas.getContext("webgl2") || canvas.getContext("webgl")) : null;
    
    // Classes do DOM visíveis
    const elements = Array.from(document.querySelectorAll("[class]"))
      .map(el => el.className)
      .filter((v, i, a) => typeof v === 'string' && a.indexOf(v) === i && v.length < 50);

    return {
      canvasSize: canvas ? { w: canvas.width, h: canvas.height } : null,
      glVersion: gl ? gl.getParameter(gl.VERSION) : null,
      glRenderer: gl ? gl.getParameter(gl.RENDERER) : null,
      glVendor: gl ? gl.getParameter(gl.VENDOR) : null,
      domClasses: elements.slice(0, 30)
    };
  });

  console.log("TECH STACK EM TEMPO REAL:", JSON.stringify(techStack, null, 2));

  await browser.close();
}

enterSite().catch(console.error);
