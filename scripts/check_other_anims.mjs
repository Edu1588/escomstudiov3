import fs from "fs";

function getAnims(p) {
  try {
    const buf = fs.readFileSync(p);
    const jsonLen = buf.readUInt32LE(12);
    const gltf = JSON.parse(buf.toString("utf8", 20, 20 + jsonLen));
    return gltf.animations?.map(a => a.name) || [];
  } catch(e) {
    return [e.message];
  }
}

const files = [
  "E:\\ANTIGRAVITY\\ESCOM_STUDIO\\public\\models\\3Dmodelrobot-v1.glb",
  "E:\\ANTIGRAVITY\\ESCOM_STUDIO\\public\\models\\futuristRobot-v1.glb",
  "E:\\ANTIGRAVITY\\ESCOM_STUDIO\\public\\models\\robotinho-v1.glb",
  "E:\\ANTIGRAVITY\\ESCOM_STUDIO\\public\\models\\humanoid robot 3d model.glb",
  "E:\\ANTIGRAVITY\\ESCOM_STUDIO\\public\\models\\roboticfarrapo.glb",
  "E:\\ANTIGRAVITY\\ESCOM_STUDIO\\public\\models\\hero\\robo-cards.glb"
];

for (const f of files) {
  console.log(f.split("\\").pop(), "->", getAnims(f));
}
