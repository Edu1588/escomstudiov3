import fs from 'fs/promises';
import path from 'path';

async function fixEffects(slug) {
  const indexFile = path.resolve(`./public/${slug}/index.html`);
  
  try {
    let content = await fs.readFile(indexFile, 'utf8');
    
    // 1. Add FontAwesome if missing
    if (!content.includes('font-awesome')) {
      const headEndIndex = content.indexOf('</head>');
      if (headEndIndex !== -1) {
        const fontAwesomeLink = `\n<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />\n`;
        content = content.substring(0, headEndIndex) + fontAwesomeLink + content.substring(headEndIndex);
      }
    }

    // 2. Add 'reveal' class to sections for Animate on Scroll effect
    // We only want to add it to sections inside the body, excluding hero, dossie, and proposta
    content = content.replace(/<section([^>]*)>/g, (match, attrs) => {
      if (attrs.includes('id="hero"') || attrs.includes('id="dossie-comercial"') || attrs.includes('id="proposta-comercial"')) {
        return match; // skip these
      }
      
      // If it already has class
      if (attrs.includes('class="')) {
        if (!attrs.includes('reveal')) {
          return match.replace('class="', 'class="reveal ');
        }
        return match;
      } else {
        return `<section${attrs} class="reveal">`;
      }
    });

    await fs.writeFile(indexFile, content);
    console.log(`Successfully fixed effects and icons for ${slug}`);
  } catch (err) {
    console.error(`Error processing ${slug}:`, err);
  }
}

async function run() {
  await fixEffects('template-oralfix');
  await fixEffects('template-miamiwellness');
}

run();
