import fs from 'fs';
import path from 'path';

const filePath = path.resolve('public/models/3Dmodelrobot-v1.glb');
const buffer = fs.readFileSync(filePath);
const jsonChunkLength = buffer.readUInt32LE(12);
const jsonText = buffer.toString('utf8', 20, 20 + jsonChunkLength);
const gltf = JSON.parse(jsonText);

console.log("extensionsUsed:", gltf.extensionsUsed);
console.log("extensionsRequired:", gltf.extensionsRequired);
