import fs from 'fs';

const content = fs.readFileSync('public/template-clinica/index.html', 'utf8');
const index = content.indexOf('<footer');
if (index !== -1) {
  console.log(content.substring(index, index + 3000));
}
