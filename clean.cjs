const fs = require('fs');
let html = fs.readFileSync('tmp_clinica/index.html', 'utf8');
html = html.replace(/src="data:image\/[^;]+;base64,[^"]+"/g, 'src="BASE64_IMAGE_REMOVED"');
fs.writeFileSync('tmp_clinica/index_clean.html', html);
console.log('Done!');
