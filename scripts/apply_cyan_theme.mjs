import fs from "fs";
import path from "path";

const srcDir = "C:/Users/escom/.gemini/antigravity/brain/12a665ad-e3e2-42f9-a288-c987ad9fd3d2/scratch/enerblock_src";
const pubDirs = [
  "E:/ANTIGRAVITY/ESCOM_STUDIO/public",
  "E:/ANTIGRAVITY/EDU/ESCOM_STUDIO/public"
];

// 1. Transform CSS: _astro/approach.DTy03nMz.css
let css = fs.readFileSync(path.join(srcDir, "_astro/approach.DTy03nMz.css"), "utf8");
css = css
  .replace(/--color-orange:\s*255,\s*89,\s*73/gi, "--color-orange: 0, 229, 255; --orange: 0, 229, 255")
  .replace(/#ff5949/gi, "#00e5ff")
  .replace(/#ff0c00/gi, "#00b8d4");

// 2. Transform HTML: index.html
let html = fs.readFileSync(path.join(srcDir, "index.html"), "utf8");
html = html
  .replace(/#ff5949/gi, "#00E5FF")
  // Remove GTM & CookieYes external trackers so localhost has 0 external tracker errors
  .replace(/<script[^>]*googletagmanager[^>]*><\/script>/gi, "")
  .replace(/<script[^>]*cookieyes[^>]*><\/script>/gi, "")
  .replace(/<!-- Google Tag Manager -->[\s\S]*?<!-- End Google Tag Manager -->/gi, '<script type="module" src="/_astro/Layout.astro_astro_type_script_index_1_lang.uVUXMpcf.js"></script>')
  .replace(/<!-- Google Tag Manager \(noscript\) -->[\s\S]*?<!-- End Google Tag Manager \(noscript\) -->/gi, "");

for (const pub of pubDirs) {
  // Save CSS
  fs.mkdirSync(path.join(pub, "_astro"), { recursive: true });
  fs.writeFileSync(path.join(pub, "_astro/approach.DTy03nMz.css"), css, "utf8");

  // Save HTML to /en/index.html, /enerblock/index.html, and /home-teste/enerblock.html
  for (const sub of ["en", "enerblock"]) {
    fs.mkdirSync(path.join(pub, sub), { recursive: true });
    fs.writeFileSync(path.join(pub, sub, "index.html"), html, "utf8");
  }
  fs.mkdirSync(path.join(pub, "home-teste"), { recursive: true });
  fs.writeFileSync(path.join(pub, "home-teste/enerblock.html"), html, "utf8");

  // Transform favicon.svg and site.webmanifest if they exist
  const favPath = path.join(pub, "icon/favicon.svg");
  if (fs.existsSync(favPath)) {
    let fav = fs.readFileSync(favPath, "utf8");
    fav = fav.replace(/#ff5949/gi, "#00E5FF").replace(/#ff0c00/gi, "#00b8d4");
    fs.writeFileSync(favPath, fav, "utf8");
  }
  const webmPath = path.join(pub, "icon/site.webmanifest");
  if (fs.existsSync(webmPath)) {
    let wm = fs.readFileSync(webmPath, "utf8");
    wm = wm.replace(/#ff5949/gi, "#00E5FF");
    fs.writeFileSync(webmPath, wm, "utf8");
  }
}

console.log("CSS, HTML, and icons transformed to Cyan Blue (#00E5FF) in both workspaces!");
