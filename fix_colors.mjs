import fs from 'fs/promises';
import path from 'path';

async function fixColors(slug, primaryHex) {
  const indexFile = path.resolve(`./public/${slug}/index.html`);
  
  try {
    let content = await fs.readFile(indexFile, 'utf8');

    // Replace the specific Gold colors with the new Primary hex
    const goldColors = ['#c5a059', '#8c6e3b', '#e6c78a', '#d9b977', '#8a4853'];
    for (const gold of goldColors) {
      content = content.split(gold).join(primaryHex);
    }

    await fs.writeFile(indexFile, content);
    console.log(`Successfully fixed colors for ${slug}`);
  } catch (err) {
    console.error(`Error fixing colors for ${slug}:`, err);
  }
}

async function run() {
  await fixColors('template-oralfix', '#0284c7'); // Odonto Blue
  await fixColors('template-miamiwellness', '#14b8a6'); // Wellness Teal
}

run();
