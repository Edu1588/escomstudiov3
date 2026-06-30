import fs from 'fs';
const content = fs.readFileSync('E:/Antigravity/ESCOM_STUDIO/src/admin/pages/Mineracao.tsx', 'utf-8');
const lines = content.split('\n');
let start = -1;
lines.forEach((line, idx) => {
  if (line.includes('const handleApproveAndDeploy') || line.includes('handleApproveAndDeploy =')) {
    start = idx;
  }
});
if (start !== -1) {
  for (let i = start; i < start + 100; i++) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
}
