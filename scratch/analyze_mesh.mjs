import fs from 'fs';
import path from 'path';

// Let's inspect the GLTF buffer positions directly
const filePath = path.resolve('public/models/futuristRobot-v1.glb');
const buffer = fs.readFileSync(filePath);
const jsonChunkLength = buffer.readUInt32LE(12);
const jsonText = buffer.toString('utf8', 20, 20 + jsonChunkLength);
const gltf = JSON.parse(jsonText);

console.log("Meshes:", gltf.meshes);
console.log("Accessors:", gltf.accessors);
