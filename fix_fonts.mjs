import fs from 'fs';

let content = fs.readFileSync('rebuild_layouts_correctly.mjs', 'utf8');

const startIndex = content.indexOf('const elizabeteHtml = `<!DOCTYPE html>');
const endIndex = content.indexOf('</html>`;', startIndex) + 9;

if (startIndex !== -1 && endIndex !== -1) {
    let elizabeteBlock = content.substring(startIndex, endIndex);

    // Completely replace Google fonts to load ONLY Poppins and Inter
    elizabeteBlock = elizabeteBlock.replace(
        /https:\/\/fonts\.googleapis\.com\/css2\?family=[^"]+/g,
        'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap'
    );

    // Force ALL serif classes to sans-serif
    elizabeteBlock = elizabeteBlock.replace(/font-serif/g, 'font-sans font-bold tracking-tight');
    
    // Also change italic blocks from serif to normal sans
    elizabeteBlock = elizabeteBlock.replace(/italic/g, ''); // just remove italic for a cleaner look

    // The texts were VERY BLACK because I used 'slate-900'. Slate-900 is `#0f172a`, which is essentially black.
    // If the user feels it's too dark, we should use 'slate-800' or 'slate-700' for texts.
    elizabeteBlock = elizabeteBlock.replace(/text-nude-900/g, 'text-slate-800');
    elizabeteBlock = elizabeteBlock.replace(/text-slate-900/g, 'text-slate-800');
    
    // Backgrounds: The user might prefer true white for sections instead of everything being slate-50/sky-50
    elizabeteBlock = elizabeteBlock.replace(/bg-nude-50/g, 'bg-white');

    content = content.substring(0, startIndex) + elizabeteBlock + content.substring(endIndex);
}

fs.writeFileSync('rebuild_layouts_correctly.mjs', content, 'utf8');
console.log('Elizabete fonts completely sanitized to Poppins/Sans.');
