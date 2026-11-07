import puppeteer from "puppeteer";

async function inspectEngine() {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto("https://santionispirits.com/", { waitUntil: "networkidle2" });

  const techBreakdown = await page.evaluate(async () => {
    const js = await (await fetch("https://santionispirits.com/assets/js/app.1782836328290.js")).text();
    
    // Análise de arquitetura
    return {
      totalSizeKb: Math.round(js.length / 1024),
      frameworks: {
        ogl: js.includes("OGL") || js.includes("Renderer") && js.includes("Transform"),
        three: js.includes("THREE") || js.includes("WebGLRenderer"),
        pixi: js.includes("PIXI"),
        gsap: js.includes("gsap") || js.includes("TweenMax"),
        lottie: js.includes("lottie"),
        howler: js.includes("Howl") || js.includes("howler")
      },
      shadersCount: (js.match(/void main\(\)/g) || []).length,
      uniforms: (js.match(/uniform\s+\w+\s+\w+/g) || []).slice(0, 15),
      storyControllers: [
        "WanderUI", "ProfileUI", "ApproachUI", "NearUI", "HandUI", 
        "TargetUI", "TransitionUI", "CathedralUI", "DrinkSelectionUI"
      ]
    };
  });

  console.log("TECH BREAKDOWN:", JSON.stringify(techBreakdown, null, 2));
  await browser.close();
}

inspectEngine().catch(console.error);
