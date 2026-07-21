import fs from 'fs';

const content = fs.readFileSync('src/baseproposta/BaseProposta.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, index) => {
  if (line.includes('proposal.') && !line.includes('proposal.selectedServices') && !line.includes('proposal.budget') && !line.includes('proposal.company') && !line.includes('proposal.clientName') && !line.includes('proposal.phone') && !line.includes('proposal.createdAt')) {
    console.log(`L${index + 1}: ${line.trim().substring(0, 120)}`);
  }
});
