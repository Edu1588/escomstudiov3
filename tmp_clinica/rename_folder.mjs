import { renameSync, existsSync, rmSync } from 'fs';
import { join } from 'path';

const oldPath = join('E:', 'Antigravity', 'ESCOM_STUDIO', 'public', 'template-mecanica');
const newPath = join('E:', 'Antigravity', 'ESCOM_STUDIO', 'public', 'template-silva-autocenter');

try {
  if (existsSync(newPath)) {
    rmSync(newPath, { recursive: true, force: true });
    console.log("Pasta de destino antiga removida.");
  }
  if (existsSync(oldPath)) {
    renameSync(oldPath, newPath);
    console.log("Pasta renomeada de template-mecanica para template-silva-autocenter com sucesso!");
  } else {
    console.log("Pasta template-mecanica não encontrada.");
  }
  process.exit(0);
} catch (err) {
  console.error("Erro ao renomear pasta:", err);
  process.exit(1);
}
