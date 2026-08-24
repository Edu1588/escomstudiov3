import fs from 'fs';
import path from 'path';

const filePath = path.resolve('public/models/robotinho-v1.glb');
const buffer = fs.readFileSync(filePath);
const jsonChunkLength = buffer.readUInt32LE(12);
const jsonText = buffer.toString('utf8', 20, 20 + jsonChunkLength);
const gltf = JSON.parse(jsonText);

console.log("GLTF meshes count:", gltf.meshes.length);
const meshBounds = [];

gltf.meshes.forEach((m, idx) => {
  const node = gltf.nodes.find(n => n.mesh === idx);
  const nodeName = node ? node.name : `mesh_${idx}`;
  
  // Find accessor min/max for POSITION
  let min = [0,0,0], max = [0,0,0];
  if (m.primitives && m.primitives[0]) {
    const posAccIdx = m.primitives[0].attributes.POSITION;
    if (posAccIdx !== undefined) {
      const acc = gltf.accessors[posAccIdx];
      if (acc && acc.min && acc.max) {
        min = acc.min;
        max = acc.max;
      }
    }
  }
  const centerY = (min[1] + max[1]) / 2;
  const centerX = (min[0] + max[0]) / 2;
  const centerZ = (min[2] + max[2]) / 2;

  meshBounds.push({
    nodeName,
    idx,
    minY: min[1].toFixed(3),
    maxY: max[1].toFixed(3),
    minX: min[0].toFixed(3),
    maxX: max[0].toFixed(3),
    minZ: min[2].toFixed(3),
    maxZ: max[2].toFixed(3),
    centerX: centerX.toFixed(3),
    centerY: centerY.toFixed(3),
    centerZ: centerZ.toFixed(3),
  });
});

meshBounds.sort((a, b) => parseFloat(b.centerY) - parseFloat(a.centerY));
meshBounds.forEach(m => {
  console.log(`${m.nodeName}: Y=[${m.minY}..${m.maxY}], X=[${m.minX}..${m.maxX}], Z=[${m.minZ}..${m.maxZ}], center=(${m.centerX}, ${m.centerY}, ${m.centerZ})`);
});
