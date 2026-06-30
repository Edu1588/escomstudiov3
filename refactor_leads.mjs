import fs from 'fs/promises';
import path from 'path';

async function refactorSite(slug, colorHex, imageMap, textReplacements) {
  const indexFile = path.resolve(`./public/${slug}/index.html`);
  
  try {
    let content = await fs.readFile(indexFile, 'utf8');

    // 1. Color Replacement
    // Belini uses #02c5ba across the site
    content = content.replace(/#02c5ba/g, colorHex);

    // 2. Image Replacements
    for (const [oldImg, newImg] of Object.entries(imageMap)) {
      // Escape the URL for regex if needed, or just string replacement
      content = content.split(oldImg).join(newImg);
    }

    // 3. Text Replacements
    for (const [oldText, newText] of Object.entries(textReplacements)) {
      content = content.split(oldText).join(newText);
    }

    await fs.writeFile(indexFile, content);
    console.log(`Successfully refactored ${slug}`);
  } catch (err) {
    console.error(`Error refactoring ${slug}:`, err);
  }
}

async function run() {
  const beliniImages = [
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09', // hero
    'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c', // about
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348', // service 1
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d', // service 2
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881'  // service 3
  ];

  // ORAL FIX REFACTOR
  await refactorSite(
    'template-oralfix',
    '#0ea5e9', // Dental Blue
    {
      [beliniImages[0]]: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95',
      [beliniImages[1]]: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787',
      [beliniImages[2]]: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5',
      [beliniImages[3]]: 'https://images.unsplash.com/photo-1537368910025-70280458b4fe',
      [beliniImages[4]]: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe'
    },
    {
      'Biomedicina Estética Avançada': 'Odontologia Estética e Reabilitação',
      'Harmonização Facial': 'Lentes de Contato Dental',
      'Toxina Botulínica': 'Implantes Dentários',
      'Bioestimuladores de Colágeno': 'Invisalign e Alinhadores',
      'Realce sua beleza natural com naturalidade e precisão.': 'Recupere a confiança ao sorrir com naturalidade e precisão.',
      'procedimentos estéticos': 'procedimentos odontológicos'
    }
  );

  // MIAMI WELLNESS REFACTOR
  await refactorSite(
    'template-miamiwellness',
    '#14b8a6', // Wellness Teal
    {
      [beliniImages[0]]: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef',
      [beliniImages[1]]: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2',
      [beliniImages[2]]: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
      [beliniImages[3]]: 'https://images.unsplash.com/photo-1552693673-1bf958298935',
      [beliniImages[4]]: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b'
    },
    {
      'Biomedicina Estética Avançada': 'Premium Chiropractic & Wellness',
      'Harmonização Facial': 'Spinal Adjustments',
      'Toxina Botulínica': 'Pain Relief & Posture',
      'Bioestimuladores de Colágeno': 'Sports Rehabilitation',
      'Realce sua beleza natural com naturalidade e precisão.': 'Eliminate back pain and restore your mobility safely.',
      'procedimentos estéticos': 'chiropractic treatments',
      'Especialista em': 'Specialists in',
      'Tratamentos Exclusivos': 'Our Core Services'
    }
  );
}

run();
