import fs from 'fs';
import path from 'path';

// Let's inspect materials of 3Dmodelrobot-v1.glb
const filePath = path.resolve('public/models/3Dmodelrobot-v1.glb');
const buffer = fs.readFileSync(filePath);
const jsonChunkLength = buffer.readUInt32LE(12);
const jsonText = buffer.toString('utf8', 20, 20 + jsonChunkLength);
const gltf = JSON.parse(jsonText);

console.log("Materials count:", gltf.materials.length);
console.log("Materials:", JSON.stringify(gltf.materials, null, 2));
