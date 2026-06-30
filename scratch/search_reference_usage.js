import fs from 'fs/promises';
import path from 'path';

const projectRoot = 'E:/ANTIGRAVITY/ESCOM_STUDIO';
const referenceDir = 'E:/ANTIGRAVITY/ESCOM_STUDIO/_referencias';

async function getAllReferenceFiles(dir) {
  let results = [];
  try {
    const list = await fs.readdir(dir, { withFileTypes: true });
    for (const file of list) {
      const fullPath = path.join(dir, file.name);
      if (file.isDirectory()) {
        const subResults = await getAllReferenceFiles(fullPath);
        results = results.concat(subResults);
      } else {
        results.push(file.name);
      }
    }
  } catch (err) {
    // Ignore error
  }
  return results;
}

async function scanDir(dir, referenceFiles) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '_referencias' || entry.name === '.vercel') {
        continue;
      }
      await scanDir(fullPath, referenceFiles);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (['.html', '.js', '.mjs', '.ts', '.tsx', '.json', '.css'].includes(ext)) {
        try {
          const content = await fs.readFile(fullPath, 'utf-8');
          for (const img of referenceFiles) {
            if (content.includes(img)) {
              console.log(`FOUND REFERENCE TO ${img} IN ${fullPath}`);
            }
          }
        } catch (err) {
          // ignore
        }
      }
    }
  }
}

async function run() {
  console.log('Gathering all reference files from _referencias...');
  const referenceFiles = await getAllReferenceFiles(referenceDir);
  console.log(`Found ${referenceFiles.length} reference files in _referencias.`);
  console.log(JSON.stringify(referenceFiles, null, 2));

  console.log('Scanning project files for any of these reference files...');
  await scanDir(projectRoot, referenceFiles);
  console.log('Scan completed.');
}

run();
