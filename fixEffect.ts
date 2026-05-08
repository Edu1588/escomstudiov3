import fs from 'fs';

const path = 'src/baseproposta/BaseProposta.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add import
const importStatement = `import { TextRotateEntrance } from "../components/ui/text-rotate-entrance";\n`;
content = content.replace(
  'import { InteractiveTiltCard } from "../components/ui/tilt-card";',
  'import { InteractiveTiltCard } from "../components/ui/tilt-card";\n' + importStatement
);

// Replace title
content = content.replace(
  '<h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight relative z-20 mix-blend-difference text-white pointer-events-none">\n              Muito além<br /><span className="text-[#2EFF00]">do pixel.</span>\n            </h2>',
  '<h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight relative z-20 mix-blend-difference text-white pointer-events-none">\n              <TextRotateEntrance text="Muito além" /><br /><span className="text-[#2EFF00]"><TextRotateEntrance text="do pixel." /></span>\n            </h2>'
);

// Fallback replace without exact newlines
content = content.replace(
  />\s*Muito além<br \/><span className="text-\[#2EFF00\]">do pixel\.<\/span>\s*<\/h2>/,
  '>\n              <TextRotateEntrance text="Muito além" /><br /><span className="text-[#2EFF00]"><TextRotateEntrance text="do pixel." /></span>\n            </h2>'
);

fs.writeFileSync(path, content);
console.log("Fixed effect!");
