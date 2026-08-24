import fs from 'fs';
import path from 'path';

const filePath = path.resolve('public/models/3Dmodelrobot-v1.glb');
const buffer = fs.readFileSync(filePath);
const jsonChunkLength = buffer.readUInt32LE(12);
const jsonText = buffer.toString('utf8', 20, 20 + jsonChunkLength);
const gltf = JSON.parse(jsonText);

console.log("Accessors count:", gltf.accessors.length);

gltf.meshes.forEach((mesh, index) => {
  const prim = mesh.primitives[0];
  const posAccIndex = prim.attributes.POSITION;
  const posAcc = gltf.accessors[posAccIndex];
  console.log(`Part ${index} (Mesh ${mesh.name || index}):`);
  console.log(`  Min: [${posAcc.min.map(v => v.toFixed(3)).join(', ')}]`);
  console.log(`  Max: [${posAcc.max.map(v => v.toFixed(3)).join(', ')}]`);
  const centerY = (posAcc.min[1] + posAcc.max[1]) / 2;
  const sizeY = posAcc.max[1] - posAcc.min[1];
  console.log(`  Center Y: ${centerY.toFixed(3)}, Height: ${sizeY.toFixed(3)}`);
});
