import fs from 'fs';

const files = ['debug_local.mjs', 'debug_site.mjs'];
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  console.log(`--- ${file} ---`);
  const lines = content.split('\n');
  console.log(lines.slice(0, 40).join('\n'));
}
