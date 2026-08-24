import fs from 'fs';
import path from 'path';

const filePath = path.resolve('public/models/futuristRobot-v1.glb');
const buffer = fs.readFileSync(filePath);
const jsonChunkLength = buffer.readUInt32LE(12);
const jsonText = buffer.toString('utf8', 20, 20 + jsonChunkLength);
const gltf = JSON.parse(jsonText);

const posAccessor = gltf.accessors[1]; // position
console.log("Position min:", posAccessor.min);
console.log("Position max:", posAccessor.max);

const centerY = (posAccessor.min[1] + posAccessor.max[1]) / 2;
console.log("Centered Y min:", posAccessor.min[1] - centerY);
console.log("Centered Y max:", posAccessor.max[1] - centerY);
console.log("Suggested Neck Y (60% up):", (posAccessor.min[1] - centerY) + (posAccessor.max[1] - posAccessor.min[1]) * 0.55);
