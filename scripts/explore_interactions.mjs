import puppeteer from "puppeteer";

async function exploreInteractions() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto("https://santionispirits.com/", { waitUntil: "networkidle2" });
  await new Promise(r => setTimeout(r, 1500));

  // Clica no YES
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button, div, a"));
    const yesBtn = btns.find(b => b.textContent && b.textContent.trim().toUpperCase() === "YES");
    if (yesBtn) yesBtn.click();
  });

  await new Promise(r => setTimeout(r, 3000));

  // Simula interação com mouse wheel
  console.log("Simulando mouse wheel...");
  for (let i = 0; i < 20; i++) {
    await page.mouse.wheel({ deltaY: 300 });
    await new Promise(r => setTimeout(r, 150));
  }
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: "public/home-teste/santioni_interactive_story.png" });

  // Clica em COLLECTION
  console.log("Clicando em COLLECTION...");
  await page.evaluate(() => {
    const coll = Array.from(document.querySelectorAll("a, button, div")).find(el => el.textContent && el.textContent.trim() === "COLLECTION");
    if (coll) coll.click();
  });
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: "public/home-teste/santioni_collection.png" });

  await browser.close();
}

exploreInteractions().catch(console.error);
