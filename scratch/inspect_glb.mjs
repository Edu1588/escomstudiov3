import fs from 'fs';
import path from 'path';

const filePath = path.resolve('public/models/futuristRobot-v1.glb');
const stats = fs.statSync(filePath);
console.log(`GLB File Size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);

const buffer = fs.readFileSync(filePath);
// Check GLB header magic (0x46544C67 = "glTF")
const magic = buffer.readUInt32LE(0);
console.log(`Magic Number: 0x${magic.toString(16)} (Expected: 46544c67 for glTF binary)`);
const version = buffer.readUInt32LE(4);
console.log(`GLTF Version: ${version}`);
const length = buffer.readUInt32LE(8);
console.log(`GLTF Total Length: ${length} bytes`);

// Read JSON chunk header
const jsonChunkLength = buffer.readUInt32LE(12);
const jsonChunkType = buffer.readUInt32LE(16);
console.log(`JSON Chunk Length: ${jsonChunkLength}, Type: 0x${jsonChunkType.toString(16)}`);

if (jsonChunkType === 0x4e4f534a) { // "JSON"
  const jsonText = buffer.toString('utf8', 20, 20 + jsonChunkLength);
  const gltfJson = JSON.parse(jsonText);
  console.log("GLTF Nodes Count:", gltfJson.nodes ? gltfJson.nodes.length : 0);
  console.log("GLTF Meshes Count:", gltfJson.meshes ? gltfJson.meshes.length : 0);
  console.log("GLTF Materials Count:", gltfJson.materials ? gltfJson.materials.length : 0);
  console.log("GLTF Animations Count:", gltfJson.animations ? gltfJson.animations.length : 0);
  
  if (gltfJson.nodes) {
    console.log("Sample Node Names:", gltfJson.nodes.map(n => n.name).filter(Boolean).slice(0, 15));
  }
}
