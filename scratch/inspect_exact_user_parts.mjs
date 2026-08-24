import fs from 'fs';
import path from 'path';

const filePath = path.resolve('public/models/robotinho-v1.glb');
const buffer = fs.readFileSync(filePath);
const jsonChunkLength = buffer.readUInt32LE(12);
const jsonText = buffer.toString('utf8', 20, 20 + jsonChunkLength);
const gltf = JSON.parse(jsonText);

const headParts = ["tripo_part_4", "tripo_part_10", "tripo_part_25", "tripo_part_28", "tripo_part_26", "tripo_part_23"];
const fingerParts = ["tripo_part_34", "tripo_part_31", "tripo_part_27", "tripo_part_32", "tripo_part_45", "tripo_part_49", "tripo_part_46", "tripo_part_37", "tripo_part_43", "tripo_part_54"];

console.log("HEAD PARTS BOUNDS:");
headParts.forEach(name => {
  const node = gltf.nodes.find(n => n.name === name);
  if (!node) return console.log("Not found:", name);
  const mesh = gltf.meshes[node.mesh];
  const posAcc = gltf.accessors[mesh.primitives[0].attributes.POSITION];
  console.log(`${name}: Y=[${posAcc.min[1]}..${posAcc.max[1]}], X=[${posAcc.min[0]}..${posAcc.max[0]}], Z=[${posAcc.min[2]}..${posAcc.max[2]}]`);
});

console.log("\nFINGER PARTS BOUNDS:");
fingerParts.forEach(name => {
  const node = gltf.nodes.find(n => n.name === name);
  if (!node) return console.log("Not found:", name);
  const mesh = gltf.meshes[node.mesh];
  const posAcc = gltf.accessors[mesh.primitives[0].attributes.POSITION];
  console.log(`${name}: Y=[${posAcc.min[1]}..${posAcc.max[1]}], X=[${posAcc.min[0]}..${posAcc.max[0]}], Z=[${posAcc.min[2]}..${posAcc.max[2]}]`);
});
