import fs from 'fs';
import path from 'path';

const filePath = path.resolve('public/models/3Dmodelrobot-v1.glb');
const buffer = fs.readFileSync(filePath);
const jsonChunkLength = buffer.readUInt32LE(12);
const jsonText = buffer.toString('utf8', 20, 20 + jsonChunkLength);
const gltf = JSON.parse(jsonText);

console.log("Nodes count:", gltf.nodes ? gltf.nodes.length : 0);
console.log("Nodes:", JSON.stringify(gltf.nodes, null, 2));
console.log("Skins count:", gltf.skins ? gltf.skins.length : 0);
if (gltf.skins) {
  console.log("Skins:", JSON.stringify(gltf.skins, null, 2));
}
console.log("Animations count:", gltf.animations ? gltf.animations.length : 0);
if (gltf.animations) {
  console.log("Animations:", gltf.animations.map(a => a.name));
}
console.log("Meshes count:", gltf.meshes ? gltf.meshes.length : 0);
if (gltf.meshes) {
  console.log("Meshes:", gltf.meshes.map(m => m.name));
}
