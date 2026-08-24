import fs from 'fs';
import path from 'path';

const filePath = path.resolve('public/models/robotinho-v1.glb');
const buffer = fs.readFileSync(filePath);
const jsonChunkLength = buffer.readUInt32LE(12);
const jsonText = buffer.toString('utf8', 20, 20 + jsonChunkLength);
const gltf = JSON.parse(jsonText);

const node = gltf.nodes.find(n => n.name === "tripo_part_9");
console.log("tripo_part_9 node:", node);
if (node) {
  const mesh = gltf.meshes[node.mesh];
  const posAcc = gltf.accessors[mesh.primitives[0].attributes.POSITION];
  console.log("tripo_part_9 min/max:");
  console.log("X:", posAcc.min[0], "to", posAcc.max[0], "center:", (posAcc.min[0] + posAcc.max[0])/2);
  console.log("Y:", posAcc.min[1], "to", posAcc.max[1], "top Y (max):", posAcc.max[1]);
  console.log("Z:", posAcc.min[2], "to", posAcc.max[2], "center:", (posAcc.min[2] + posAcc.max[2])/2);
}
