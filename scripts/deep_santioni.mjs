import puppeteer from "puppeteer";
import fs from "fs";

async function deepAnalyze() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  const allRequests = [];
  page.on("request", req => {
    allRequests.push(req.url());
  });

  await page.goto("https://santionispirits.com/", { waitUntil: "networkidle2" });
  await new Promise(r => setTimeout(r, 2000));

  // Simula scroll lento até o fim para carregar tudo
  for (let y = 0; y < 15000; y += 800) {
    await page.evaluate((pos) => window.scrollTo(0, pos), y);
    await new Promise(r => setTimeout(r, 200));
  }

  await new Promise(r => setTimeout(r, 3000));

  // Extrair detalhes técnicos do bundle JS
  const scriptContent = await page.evaluate(async () => {
    const res = await fetch("https://santionispirits.com/assets/js/app.1782836328290.js");
    return await res.text();
  });

  const analysis = {
    hasThree: scriptContent.includes("THREE") || scriptContent.includes("three.module") || scriptContent.includes("WebGLRenderer"),
    hasOGL: scriptContent.includes("OGL") || scriptContent.includes("Renderer") && scriptContent.includes("Transform"),
    hasGSAP: scriptContent.includes("gsap") || scriptContent.includes("TweenMax") || scriptContent.includes("ScrollTrigger"),
    hasCurtains: scriptContent.includes("curtainsjs") || scriptContent.includes("Curtains"),
    hasLenis: scriptContent.includes("lenis") || scriptContent.includes("Lenis"),
    hasBarba: scriptContent.includes("barba"),
    hasLottie: scriptContent.includes("lottie") || scriptContent.includes("bodymovin"),
    hasGLTF: scriptContent.includes("GLTFLoader") || scriptContent.includes(".glb") || scriptContent.includes(".gltf"),
    hasDraco: scriptContent.includes("DRACOLoader") || scriptContent.includes("draco"),
    hasShaders: scriptContent.includes("precision highp float") || scriptContent.includes("gl_FragColor") || scriptContent.includes("fragmentShader"),
  };

  // Buscar palavras-chave de bibliotecas no bundle
  const matches = [];
  ["three", "ogl", "twgl", "regl", "pixi", "matter", "cannon", "rapier", "howler", "locomotive", "locomotive-scroll", "swup", "barba", "split-type", "splittext", "scrolltrigger", "lenis"].forEach(lib => {
    if (new RegExp(`\\b${lib}\\b`, "i").test(scriptContent)) {
      matches.push(lib);
    }
  });

  // Identificar shaders no código
  const shaderSnippets = [];
  const regex = /(uniform\s+[^;]+;\s*)+(varying|attribute|void\s+main)/g;
  let match;
  while ((match = regex.exec(scriptContent)) !== null) {
    shaderSnippets.push(match[0].slice(0, 100));
    if (shaderSnippets.length >= 5) break;
  }

  // Filtrar requisições de arquivos interessantes (.glb, .bin, .png, .jpg, .json)
  const assetTypes = {
    models: allRequests.filter(r => r.endsWith(".glb") || r.endsWith(".gltf")),
    media: allRequests.filter(r => r.endsWith(".mp4") || r.endsWith(".webm")),
    textures: allRequests.filter(r => r.match(/\.(png|jpg|jpeg|webp)(\?|$)/i)),
    json: allRequests.filter(r => r.endsWith(".json")),
  };

  console.log("=== ANÁLISE DO BUNDLE JS ===");
  console.log(JSON.stringify(analysis, null, 2));
  console.log("Bibliotecas detectadas:", matches);
  console.log("Modelos 3D:", assetTypes.models);
  console.log("Mídia (vídeos):", assetTypes.media);
  console.log("Texturas WebGL / Imagens (total):", assetTypes.textures.length);
  console.log("Exemplos de texturas:", assetTypes.textures.slice(0, 10));

  // Inspecionar canvas específico
  const canvasDetails = await page.evaluate(() => {
    const c = document.querySelector("canvas");
    if (!c) return null;
    return {
      style: c.getAttribute("style"),
      classes: c.className,
      parentElement: c.parentElement?.outerHTML?.slice(0, 200)
    };
  });
  console.log("Canvas Details:", canvasDetails);

  await browser.close();
}

deepAnalyze().catch(console.error);
