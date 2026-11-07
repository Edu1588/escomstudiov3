import puppeteer from "puppeteer";

async function run() {
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: [
      "--use-gl=angle",
      "--use-angle=default",
      "--enable-webgl",
      "--ignore-gpu-blocklist",
      "--no-sandbox"
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 810 });

  page.on("console", msg => console.log("PAGE LOG:", msg.type(), msg.text()));
  page.on("pageerror", err => console.log("PAGE ERROR:", err.message));

  await page.goto("http://localhost:3000/home-teste/index.html", { waitUntil: "networkidle2" });
  await new Promise(r => setTimeout(r, 6000));
  await browser.close();
}

run().catch(console.error);
