import puppeteer from "puppeteer";
import path from "path";

const outDir = "C:/Users/escom/.gemini/antigravity/brain/12a665ad-e3e2-42f9-a288-c987ad9fd3d2";

async function captureSite(browser, url, prefix) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise(r => setTimeout(r, 3500));

  // Hide CookieYes banner on reference if present so we compare pure page layout
  await page.evaluate(() => {
    const cky = document.querySelector(".cky-consent-container, .cky-overlay");
    if (cky) cky.style.display = "none";
  });

  const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  console.log(`${prefix} scrollHeight:`, totalHeight);

  const stops = [
    { name: "01_hero", y: 0 },
    { name: "02_3d_building_frames", y: Math.round(totalHeight * 0.25) },
    { name: "03_solutions_cards", y: Math.round(totalHeight * 0.46) },
    { name: "04_projects_slider", y: Math.round(totalHeight * 0.65) },
    { name: "05_prefooter_3d_logo", y: Math.round(totalHeight * 0.88) },
    { name: "06_footer", y: totalHeight - 900 }
  ];

  for (const stop of stops) {
    // Smooth scroll in steps so Lenis + GSAP ScrollTrigger + ScrollFrames update properly
    await page.evaluate(async (targetY) => {
      const currentY = window.scrollY;
      const steps = 15;
      for (let i = 1; i <= steps; i++) {
        const y = currentY + ((targetY - currentY) * i) / steps;
        window.scrollTo(0, y);
        if (window.lenis) window.lenis.scrollTo(y, { immediate: true });
        if (window.ScrollTrigger) window.ScrollTrigger.update();
        await new Promise(r => setTimeout(r, 40));
      }
    }, stop.y);
    await new Promise(r => setTimeout(r, 900));
    const file = path.join(outDir, `${prefix}_${stop.name}.png`);
    await page.screenshot({ path: file });
    console.log("Saved:", file);
  }

  await page.close();
}

async function run() {
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ["--no-sandbox"]
  });

  await captureSite(browser, "https://enerblock.net/en/", "ref_enerblock");
  await captureSite(browser, "http://localhost:3000/en/", "replica_cyan");

  await browser.close();
  console.log("Side-by-side verification screenshots complete!");
}

run();
