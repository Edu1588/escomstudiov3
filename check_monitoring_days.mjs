import fs from 'fs';

const content = fs.readFileSync('api/index.ts', 'utf8');

// Vamos pesquisar a função runProposalMonitoringJob ou trechos de dias
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('Monitoring') || line.includes('monitoring') || line.includes('Sheets') || line.includes('sheets') || line.includes('expiresAt') || line.includes('expire') || line.includes('sheet') || line.includes('webhook')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
