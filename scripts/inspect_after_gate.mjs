import puppeteer from "puppeteer";

async function bypassAgeGateAndInspect() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto("https://santionispirits.com/", { waitUntil: "networkidle2" });
  await new Promise(r => setTimeout(r, 2000));

  // Clicar no botão do AgeGate para entrar no site
  const clicked = await page.evaluate(() => {
    // Procura botão do age gate ("Yes", "Enter", "Indulge", etc.)
    const buttons = Array.from(document.querySelectorAll("button, a, div[role='button']"));
    const enterBtn = buttons.find(b => 
      b.innerText.toLowerCase().includes("yes") || 
      b.innerText.toLowerCase().includes("enter") || 
      b.innerText.toLowerCase().includes("indulge") ||
      b.className.includes("age") ||
      b.closest(".AgeGate")
    );
    if (enterBtn) {
      enterBtn.click();
      return enterBtn.innerText || enterBtn.className;
    }
    return null;
  });

  console.log("Botão clicado no AgeGate:", clicked);
  await new Promise(r => setTimeout(r, 3000));

  // Agora inspeciona a cena após o AgeGate
  const sceneInfo = await page.evaluate(() => {
    const glCanvases = Array.from(document.querySelectorAll("canvas"));
    const sections = Array.from(document.querySelectorAll("section, [class*='Section'], [class*='story'], [class*='hero']")).map(s => ({
      tag: s.tagName,
      className: s.className,
      id: s.id
    }));
    return {
      canvasCount: glCanvases.length,
      sections: sections.slice(0, 15)
    };
  });

  console.log("Cena pós AgeGate:", JSON.stringify(sceneInfo, null, 2));

  // Rola um pouco a página para ver o que ativa
  await page.evaluate(() => window.scrollBy(0, 1200));
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({ path: "public/home-teste/santioni_after_gate.png" });
  console.log("Screenshot pós-gate salvo!");

  await browser.close();
}

bypassAgeGateAndInspect().catch(console.error);
