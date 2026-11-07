import fs from "fs";

// Inspecionar o GLTF binário para ver se tem armatures, bones e clips de animação
function inspectGLB(filePath) {
  const buf = fs.readFileSync(filePath);
  // O GLB tem um header JSON nos primeiros bytes
  const magic = buf.readUInt32LE(0);
  const version = buf.readUInt32LE(4);
  const length = buf.readUInt32LE(8);
  const jsonChunkLength = buf.readUInt32LE(12);
  const jsonChunkType = buf.readUInt32LE(16);

  const jsonStr = buf.toString("utf8", 20, 20 + jsonChunkLength);
  const gltf = JSON.parse(jsonStr);

  return {
    file: filePath,
    animations: gltf.animations?.map(a => a.name) || [],
    nodesCount: gltf.nodes?.length || 0,
    skins: gltf.skins?.map(s => s.name || "skin") || [],
    meshes: gltf.meshes?.map(m => m.name) || []
  };
}

try {
  console.log("=== ROBO-AGACHADO ===");
  console.log(inspectGLB("E:\\ANTIGRAVITY\\ESCOM_STUDIO\\public\\models\\hero\\robo-agachado.glb"));
} catch (e) {
  console.error("Erro robo-agachado:", e.message);
}

try {
  console.log("=== ROBOLITO ===");
  console.log(inspectGLB("E:\\ANTIGRAVITY\\ESCOM_STUDIO\\public\\models\\robolito.glb"));
} catch (e) {
  console.error("Erro robolito:", e.message);
}

try {
  console.log("=== ROBO-VOANDO ===");
  console.log(inspectGLB("E:\\ANTIGRAVITY\\ESCOM_STUDIO\\public\\models\\hero\\robo-voando.glb"));
} catch (e) {
  console.error("Erro robo-voando:", e.message);
}
