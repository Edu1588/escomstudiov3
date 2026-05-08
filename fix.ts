import fs from 'fs';

const path = 'src/baseproposta/BaseProposta.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/#00e300/g, '#2EFF00');
content = content.replace(/Olá Edu/g, 'Olá ESCOM STUDIO');
content = content.replace(/Edu Santos/g, 'ESCOM STUDIO');
content = content.replace(/Edu/g, 'ESCOM STUDIO');

// Also fix the text glow in "Muito além do pixel"
content = content.replace(
  'Muito além<br /><span className="text-[#2EFF00] drop-shadow-[0_0_15px_rgba(0,227,0,0.8)] relative" style={{ textShadow: "0 0 10px rgba(0, 227, 0, 0.5)"}}>do pixel.</span>',
  'Muito além<br /><span className="text-[#2EFF00]">do pixel.</span>'
);

// We need to run floatImage animation correctly
content = content.replace(
  'className="absolute top-[10%] left-[20%] md:left-[30%] z-10 opacity-100 animate-[floatImage_6s_ease-in-out_infinite]"',
  'className="absolute top-[10%] left-[20%] md:left-[30%] z-10 opacity-100" style={{ animation: "floatImage 6s ease-in-out infinite" }}'
);

fs.writeFileSync(path, content, 'utf8');
console.log('Done!');
