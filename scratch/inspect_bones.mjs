import fs from 'fs';
import path from 'path';

const filePath = path.resolve('public/models/futuristRobot-v1.glb');
const buffer = fs.readFileSync(filePath);
const jsonChunkLength = buffer.readUInt32LE(12);
const jsonText = buffer.toString('utf8', 20, 20 + jsonChunkLength);
const gltf = JSON.parse(jsonText);

console.log("GLTF Skins:", gltf.skins ? gltf.skins.length : 0);
console.log("GLTF Nodes:", JSON.stringify(gltf.nodes, null, 2));
if (gltf.skins) {
  console.log("Skin details:", JSON.stringify(gltf.skins, null, 2));
}
