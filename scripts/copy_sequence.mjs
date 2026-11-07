import fs from "fs";
import path from "path";

const targetDir1 = "E:\\ANTIGRAVITY\\ESCOM_STUDIO\\public\\home-teste\\frames\\sequence";
const targetDir2 = "E:\\ANTIGRAVITY\\EDU\\ESCOM_STUDIO\\public\\home-teste\\frames\\sequence";

fs.mkdirSync(targetDir1, { recursive: true });
fs.mkdirSync(targetDir2, { recursive: true });

const brainDir = "C:\\Users\\escom\\.gemini\\antigravity\\brain\\12a665ad-e3e2-42f9-a288-c987ad9fd3d2";

const mapping = [
  { src: "frame_1A_hero_limpo.png", dest: "seq_01.png" },
  { src: "frame_02_inicio_subida_1793393901527.jpg", dest: "seq_02.jpg" },
  { src: "frame_03_meio_subida_1793393958769.jpg", dest: "seq_03.jpg" },
  { src: "frame_04_fullbody_duas_maos_1793394094375.jpg", dest: "seq_04.jpg" },
  { src: "frame_05_ataque_avanco_1793394204709.jpg", dest: "seq_05.jpg" },
  { src: "frame_1c_correto_olho_apagado_1793363995238.jpg", dest: "seq_06.jpg" }
];

for (const m of mapping) {
  const srcPath = path.join(brainDir, m.src);
  fs.copyFileSync(srcPath, path.join(targetDir1, m.dest));
  fs.copyFileSync(srcPath, path.join(targetDir2, m.dest));
  console.log("Copiado:", m.dest);
}
