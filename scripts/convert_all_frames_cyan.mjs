import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

const pubMain = "E:/ANTIGRAVITY/ESCOM_STUDIO/public";
const pubEdu = "E:/ANTIGRAVITY/EDU/ESCOM_STUDIO/public";

const files = [];
for (let i = 1; i <= 121; i++) {
  files.push(`/imgs/home/frame_${String(i).padStart(4, "0")}.webp`);
}
for (let i = 1; i <= 145; i++) {
  files.push(`/imgs/prefooter/frame_${String(i).padStart(4, "0")}.webp`);
}

async function run() {
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ["--no-sandbox"]
  });
  const page = await browser.newPage();

  console.log(`Converting ${files.length} WebP frames to Cyan Blue...`);
  const batchSize = 15;
  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    const inputs = batch.map(rel => ({
      rel,
      b64: fs.readFileSync(path.join(pubMain, rel)).toString("base64")
    }));

    const outputs = await page.evaluate(async (items) => {
      return Promise.all(items.map(async ({ rel, b64 }) => {
        const img = new Image();
        img.src = "data:image/webp;base64," + b64;
        await img.decode();
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = imgData.data;
        for (let k = 0; k < d.length; k += 4) {
          const r = d[k], g = d[k + 1], b = d[k + 2];
          if (r > b + 4 && r > g) {
            const diff = r - b;
            const w = Math.max(0, g - (b + diff * 0.10));
            d[k] = Math.max(0, Math.min(255, Math.round(b - diff * 0.40 + w)));
            d[k + 1] = Math.max(0, Math.min(255, Math.round(b + diff * 0.857 + w * 0.5)));
            d[k + 2] = r;
          }
        }
        ctx.putImageData(imgData, 0, 0);
        return {
          rel,
          outB64: canvas.toDataURL("image/webp", 0.90).split(",")[1]
        };
      }));
    }, inputs);

    for (const { rel, outB64 } of outputs) {
      const buf = Buffer.from(outB64, "base64");
      fs.writeFileSync(path.join(pubMain, rel), buf);
      fs.writeFileSync(path.join(pubEdu, rel), buf);
    }
    console.log(`Converted ${Math.min(i + batchSize, files.length)}/${files.length}`);
  }

  await browser.close();
  console.log("All 266 WebP frames converted to Cyan Blue in both workspaces!");
}

run();
