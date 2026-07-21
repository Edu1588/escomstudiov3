import fs from 'fs';
import path from 'path';

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    if (!fs.existsSync(path.dirname(dest))) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
    }
    fs.copyFileSync(src, dest);
  }
}

console.log("📦 Copiando todos os arquivos de public/ para dist/...");
const publicDir = path.join(process.cwd(), 'public');
const distDir = path.join(process.cwd(), 'dist');

if (fs.existsSync(publicDir) && fs.existsSync(distDir)) {
  copyRecursiveSync(publicDir, distDir);
  console.log("✅ Todos os arquivos e HTMLs de public/ copiados com sucesso para dist/!");
} else {
  console.error("❌ Direta public/ ou dist/ não encontrada.");
}
