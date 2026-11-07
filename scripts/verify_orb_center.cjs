const puppeteer = require("puppeteer");
const { spawn } = require("child_process");
const path = require("path");

async function main() {
  console.log("Iniciando preview local...");
  const preview = spawn("npx", ["vite", "preview", "--port", "4188", "--strictPort"], {
    cwd: "e:\\ANTIGRAVITY\\ESCOM_STUDIO",
    shell: true,
  });

  // Aguarda preview subir
  await new Promise((r) => setTimeout(r, 4000));

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    const W = 1440;
    const H = 900;
    await page.setViewport({ width: W, height: H });

    console.log("Navegando para http://localhost:4188...");
    await page.goto("http://localhost:4188", { waitUntil: "networkidle2", timeout: 45000 });

    // Aguarda o orb ser montado
    await page.waitForSelector("[data-slot='live-orb']", { timeout: 15000 });
    await new Promise((r) => setTimeout(r, 2000));

    // 1. Move o mouse exatamente para o MEIO DA TELA (720, 450)
    console.log("Movendo mouse para o centro da tela (720, 450)...");
    await page.mouse.move(W / 2, H / 2);
    await new Promise((r) => setTimeout(r, 800)); // dá tempo para a interpolação lerpar

    // Localiza o botão do orb
    const orbEl = await page.$("aside[aria-label='Atendimento rápido ESCOM Studio']");
    if (orbEl) {
      const outPathCenter = path.join(
        "C:\\Users\\escom\\.gemini\\antigravity\\brain\\12a665ad-e3e2-42f9-a288-c987ad9fd3d2",
        "orb_mouse_center.png"
      );
      await orbEl.screenshot({ path: outPathCenter });
      console.log("Screenshot do orb com mouse no centro salvo em:", outPathCenter);
    }

    // 2. Move o mouse para a esquerda da tela (200, 450)
    console.log("Movendo mouse para a esquerda (200, 450)...");
    await page.mouse.move(200, H / 2);
    await new Promise((r) => setTimeout(r, 800));
    if (orbEl) {
      const outPathLeft = path.join(
        "C:\\Users\\escom\\.gemini\\antigravity\\brain\\12a665ad-e3e2-42f9-a288-c987ad9fd3d2",
        "orb_mouse_left.png"
      );
      await orbEl.screenshot({ path: outPathLeft });
      console.log("Screenshot do orb com mouse na esquerda salvo em:", outPathLeft);
    }
  } finally {
    await browser.close();
    preview.kill();
    console.log("Finalizado!");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
