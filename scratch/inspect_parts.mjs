globalThis.self = globalThis;
globalThis.window = globalThis;

import fs from 'fs';
import path from 'path';

// Let's inspect all meshes in robotinho-v1.glb with their bounding boxes
// We can parse the GLTF buffers and accessors or use Three.js in a script!
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

const filePath = path.resolve('public/models/robotinho-v1.glb');
const buffer = fs.readFileSync(filePath);
const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

loader.parse(arrayBuffer, '', (gltf) => {
  console.log("Parsed GLTF successfully!");
  const scene = gltf.scene;
  const parts = [];

  scene.traverse((child) => {
    if (child.isMesh) {
      child.geometry.computeBoundingBox();
      const bb = child.geometry.boundingBox;
      parts.push({
        name: child.name,
        minY: bb.min.y.toFixed(3),
        maxY: bb.max.y.toFixed(3),
        minX: bb.min.x.toFixed(3),
        maxX: bb.max.x.toFixed(3),
        minZ: bb.min.z.toFixed(3),
        maxZ: bb.max.z.toFixed(3),
        centerY: ((bb.min.y + bb.max.y) / 2).toFixed(3),
        centerX: ((bb.min.x + bb.max.x) / 2).toFixed(3),
        centerZ: ((bb.min.z + bb.max.z) / 2).toFixed(3),
      });
    }
  });

  // Sort by centerY descending
  parts.sort((a, b) => b.centerY - a.centerY);
  console.log("All meshes sorted by height (top to bottom):");
  parts.forEach((p, idx) => {
    console.log(`[${idx}] ${p.name} -> Y: [${p.minY} to ${p.maxY}], X: [${p.minX} to ${p.maxX}], Z: [${p.minZ} to ${p.maxZ}], center: (${p.centerX}, ${p.centerY}, ${p.centerZ})`);
  });
  process.exit(0);
}, (err) => {
  console.error("Error parsing:", err);
  process.exit(1);
});
