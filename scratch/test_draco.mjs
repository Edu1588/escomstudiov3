import fs from 'fs';
import path from 'path';

// Let's test the Draco decompression and inspect the GLB
const filePath = path.resolve('public/models/futuristRobot-v1.glb');
const buffer = fs.readFileSync(filePath);
console.log("GLB Buffer Size:", buffer.length);

// Let's check draco decoders in public/draco/gltf/
console.log("Draco decoder wasm exists:", fs.existsSync('public/draco/gltf/draco_decoder.wasm'));
console.log("Draco wasm wrapper js exists:", fs.existsSync('public/draco/gltf/draco_wasm_wrapper.js'));
