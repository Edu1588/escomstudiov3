const fs = require('fs');

const files = [
  'E:\\ANTIGRAVITY\\ESCOM_STUDIO\\api\\index.ts',
  'E:\\ANTIGRAVITY\\ESCOM_STUDIO\\src\\baseproposta\\BaseProposta.tsx',
  'E:\\ANTIGRAVITY\\ESCOM_STUDIO\\public\\template-silva-autocenter\\index.html',
  'E:\\ANTIGRAVITY\\ESCOM_STUDIO\\public\\template-clinica\\index.html'
];

const patterns = [
  'fourDaysMs', 'sevenDaysMs', '4 dias', '7 dias', '15 dias', '3 dias', '1 dia',
  'valida por', 'válida por', 'válido por', 'valido por'
];

for (const file of files) {
  console.log(`\n=== File: ${file} ===`);
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    patterns.forEach(pattern => {
      if (line.toLowerCase().includes(pattern.toLowerCase())) {
        console.log(`Line ${index + 1}: ${line.trim()}`);
      }
    });
  });
}
