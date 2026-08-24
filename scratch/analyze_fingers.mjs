import fs from 'fs';
import path from 'path';

const filePath = path.resolve('public/models/robotinho-v1.glb');
const buffer = fs.readFileSync(filePath);
const jsonChunkLength = buffer.readUInt32LE(12);
const jsonText = buffer.toString('utf8', 20, 20 + jsonChunkLength);
const gltf = JSON.parse(jsonText);

const fingerPartNames = [
  "tripo_part_34",
  "tripo_part_31",
  "tripo_part_27",
  "tripo_part_32",
  "tripo_part_45",
  "tripo_part_49",
  "tripo_part_46",
  "tripo_part_37",
  "tripo_part_43",
  "tripo_part_54"
];

// Let's also check other hand parts around this area to see the entire hand
console.log("Analyzing all meshes in the raised hand area (X around -0.18 to -0.05, Y around 0.60 to 0.82):");

const handMeshes = [];
gltf.meshes.forEach((m, idx) => {
  const node = gltf.nodes.find(n => n.mesh === idx);
  const name = node ? node.name : `mesh_${idx}`;
  const posAcc = gltf.accessors[m.primitives[0].attributes.POSITION];
  const min = posAcc.min;
  const max = posAcc.max;
  const cX = (min[0] + max[0]) / 2;
  const cY = (min[1] + max[1]) / 2;
  const cZ = (min[2] + max[2]) / 2;

  if (cY >= 0.65 && cY <= 0.82 && cX <= -0.07) {
    handMeshes.push({
      name,
      minY: min[1],
      maxY: max[1],
      minX: min[0],
      maxX: max[0],
      minZ: min[2],
      maxZ: max[2],
      cX, cY, cZ
    });
  }
});

handMeshes.sort((a, b) => a.cX - b.cX);
console.log("Meshes in hand sorted by X (from thumb X=-0.17 to pinky X=-0.08):");
handMeshes.forEach(m => {
  console.log(`${m.name.padEnd(14)}: cX=${m.cX.toFixed(3)}, cY=${m.cY.toFixed(3)}, cZ=${m.cZ.toFixed(3)}, Y=[${m.minY.toFixed(3)}..${m.maxY.toFixed(3)}], Z=[${m.minZ.toFixed(3)}..${m.maxZ.toFixed(3)}]`);
});
