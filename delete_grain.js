const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');
const startTag = '// Inicializar quando o DOM estiver pronto';
const endTag = 'new GrainEffect("grainCanvas");\n      });';
const startIndex = code.indexOf(startTag);
const endIndex = code.indexOf(endTag) + endTag.length;
if(startIndex > -1 && endIndex > startTag.length){
  code = code.substring(0, startIndex) + code.substring(endIndex + 1);
  fs.writeFileSync('index.html', code);
  console.log("Deleted");
} else {
  console.log("Not found");
}
