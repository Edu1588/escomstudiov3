import puppeteer from "puppeteer";

async function main() {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto("https://escomstudio.com.br/", { waitUntil: "networkidle2" });
  await new Promise(r => setTimeout(r, 4000));
  const elements = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("*"))
      .filter(el => (el.innerText && el.innerText.includes("FALE CONOSCO")) || el.id.includes("chat") || el.className.toString().includes("chat") || el.tagName.toLowerCase().includes("chat"))
      .map(el => ({ tag: el.tagName, className: el.className, id: el.id, parent: el.parentElement?.tagName }));
  });
  console.log(JSON.stringify(elements, null, 2));
  await browser.close();
}

main().catch(console.error);
