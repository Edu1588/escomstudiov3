import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

async function run() {
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ["--no-sandbox"]
  });
  const page = await browser.newPage();

  async function convertWebpFile(inPath, outPath) {
    const b64 = fs.readFileSync(inPath).toString("base64");
    const outB64 = await page.evaluate(async (srcB64) => {
      const img = new Image();
      img.src = "data:image/webp;base64," + srcB64;
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imgData.data;
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i + 1], b = d[i + 2];
        if (r > b + 4 && r > g) {
          const diff = r - b;
          const w = Math.max(0, g - (b + diff * 0.10));
          const newR = Math.max(0, Math.min(255, Math.round(b - diff * 0.40 + w)));
          const newG = Math.max(0, Math.min(255, Math.round(b + diff * 0.857 + w * 0.5)));
          const newB = r;
          d[i] = newR;
          d[i + 1] = newG;
          d[i + 2] = newB;
        }
      }
      ctx.putImageData(imgData, 0, 0);
      return canvas.toDataURL("image/webp", 0.92).split(",")[1];
    }, b64);
    fs.writeFileSync(outPath, Buffer.from(outB64, "base64"));
  }

  await convertWebpFile(
    "C:/Users/escom/.gemini/antigravity/brain/12a665ad-e3e2-42f9-a288-c987ad9fd3d2/scratch/home_f060.webp",
    "C:/Users/escom/.gemini/antigravity/brain/12a665ad-e3e2-42f9-a288-c987ad9fd3d2/scratch/home_f060_cyan.webp"
  );
  await convertWebpFile(
    "C:/Users/escom/.gemini/antigravity/brain/12a665ad-e3e2-42f9-a288-c987ad9fd3d2/scratch/prefooter_f075.webp",
    "C:/Users/escom/.gemini/antigravity/brain/12a665ad-e3e2-42f9-a288-c987ad9fd3d2/scratch/prefooter_f075_cyan.webp"
  );

  console.log("Converted test frames to cyan!");
  await browser.close();
}

run();
