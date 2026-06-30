import fs from 'fs';

let content = fs.readFileSync('rebuild_layouts_correctly.mjs', 'utf8');

const startIndex = content.indexOf('const elizabeteHtml = `<!DOCTYPE html>');
const endIndex = content.indexOf('fs.writeFileSync(\'public/template-elizabete/index.html\', elizabeteHtml, \'utf8\');');

if (startIndex !== -1 && endIndex !== -1) {
    const fullEndIndex = endIndex + 'fs.writeFileSync(\'public/template-elizabete/index.html\', elizabeteHtml, \'utf8\');'.length;
    
    // We will replace this entire block with a call to our new script
    content = content.substring(0, startIndex) + 
              "\nimport { execSync } from 'child_process';\nexecSync('node build_elizabete_v2.mjs', {stdio: 'inherit'});\n" + 
              content.substring(fullEndIndex);
}

fs.writeFileSync('rebuild_layouts_correctly.mjs', content, 'utf8');
console.log('Removed old Elizabete HTML and injected build_elizabete_v2.mjs call.');
