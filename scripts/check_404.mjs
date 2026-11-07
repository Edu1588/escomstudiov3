import puppeteer from "puppeteer";

async function check404() {
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ["--no-sandbox"]
  });

  const page = await browser.newPage();
  page.on("response", res => {
    if (res.status() >= 400) {
      console.log("ERRO HTTP:", res.status(), res.url());
    }
  });

  await page.goto("http://localhost:3000/home-teste/index.html", { waitUntil: "networkidle2" });
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
}

check404().catch(console.error);
