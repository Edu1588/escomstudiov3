import { execSync } from 'child_process';
import fs from 'fs';

const paths = [
  'C:\\Program Files\\Git\\cmd\\git.exe',
  'C:\\Program Files\\Git\\bin\\git.exe',
  'C:\\Program Files (x86)\\Git\\cmd\\git.exe',
  'C:\\Program Files (x86)\\Git\\bin\\git.exe',
  'C:\\Users\\escom\\AppData\\Local\\Programs\\Git\\cmd\\git.exe',
  'git' // fallback
];

let gitPath = null;
for (const p of paths) {
  try {
    const out = execSync(`"${p}" --version`, { encoding: 'utf-8' });
    console.log(`Encontrou git em: ${p} (${out.trim()})`);
    gitPath = p;
    break;
  } catch (e) {
    // ignore
  }
}

if (gitPath) {
  try {
    const status = execSync(`"${gitPath}" status`, { cwd: 'E:/ANTIGRAVITY/ESCOM_STUDIO', encoding: 'utf-8' });
    console.log("Git status:\n", status);
    
    // Vamos restaurar o arquivo BaseProposta.tsx original!
    console.log("Restaurando src/baseproposta/BaseProposta.tsx original...");
    execSync(`"${gitPath}" checkout -- src/baseproposta/BaseProposta.tsx`, { cwd: 'E:/ANTIGRAVITY/ESCOM_STUDIO' });
    console.log("Restaurado com sucesso!");
    
    const lines = fs.readFileSync('src/baseproposta/BaseProposta.tsx', 'utf-8').split('\n').length;
    console.log(`O arquivo agora tem ${lines} linhas.`);
  } catch (err) {
    console.error("Erro ao rodar comando git:", err.message);
  }
} else {
  console.log("Git não encontrado.");
}
