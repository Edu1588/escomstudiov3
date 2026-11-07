import puppeteer from "puppeteer";

async function analyzeSite() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const networkAssets = [];
  page.on("response", res => {
    const url = res.url();
    const contentType = res.headers()["content-type"] || "";
    if (
      url.endsWith(".glb") ||
      url.endsWith(".gltf") ||
      url.endsWith(".mp4") ||
      url.endsWith(".webm") ||
      url.endsWith(".json") ||
      url.includes(".js") ||
      contentType.includes("javascript") ||
      contentType.includes("video") ||
      contentType.includes("json")
    ) {
      networkAssets.push({ url, type: contentType });
    }
  });

  console.log("Navegando para https://santionispirits.com/ ...");
  try {
    await page.goto("https://santionispirits.com/", {
      waitUntil: "networkidle2",
      timeout: 60000
    });
  } catch (e) {
    console.log("Timeout ou erro de rede parcial:", e.message);
  }

  await new Promise(r => setTimeout(r, 4000));

  const pageInfo = await page.evaluate(() => {
    // Verificar objetos globais conhecidos
    const globals = [];
    if (window.THREE) globals.push("Three.js (window.THREE)");
    if (window.gsap) globals.push("GSAP (window.gsap)");
    if (window.ScrollTrigger) globals.push("GSAP ScrollTrigger");
    if (window.PIXI) globals.push("Pixi.js (window.PIXI)");
    if (window.Lenis) globals.push("Lenis Smooth Scroll");
    if (window.__locomotive) globals.push("Locomotive Scroll");
    if (window.WebGLRenderingContext) globals.push("WebGL suportado");

    // Verificar canvas e WebGL
    const canvases = Array.from(document.querySelectorAll("canvas")).map(c => {
      const gl = c.getContext("webgl") || c.getContext("webgl2");
      return {
        width: c.width,
        height: c.height,
        className: c.className,
        id: c.id,
        isWebGL: !!gl,
        glVersion: gl ? (c.getContext("webgl2") ? "WebGL 2.0" : "WebGL 1.0") : "2D/None"
      };
    });

    // Verificar scripts inclusos
    const scripts = Array.from(document.querySelectorAll("script[src]")).map(s => s.src);

    // Estrutura do DOM
    const bodyClasses = document.body.className;
    const metaGenerator = document.querySelector('meta[name="generator"]')?.content || "";

    return {
      globals,
      canvases,
      scripts,
      bodyClasses,
      metaGenerator,
      title: document.title
    };
  });

  console.log("PAGE INFO:", JSON.stringify(pageInfo, null, 2));

  const relevantAssets = networkAssets.filter(a => 
    a.url.endsWith(".glb") || 
    a.url.endsWith(".gltf") || 
    a.url.includes("three") || 
    a.url.includes("gsap") || 
    a.url.includes("shader") ||
    a.url.includes("ogl") ||
    a.url.includes("curtains") ||
    a.url.includes("lenis") ||
    a.url.endsWith(".mp4")
  );
  console.log("RELEVANT ASSETS:", JSON.stringify(relevantAssets, null, 2));

  // Tirar um screenshot da página
  const screenshotPath = "public/home-teste/santioni_screenshot.png";
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log("Screenshot salvo em:", screenshotPath);

  await browser.close();
}

analyzeSite().catch(console.error);
