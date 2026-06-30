import fs from 'fs/promises';
import path from 'path';

async function replaceImages(slug, newImages) {
  const indexFile = path.resolve(`./public/${slug}/index.html`);
  
  try {
    let content = await fs.readFile(indexFile, 'utf8');
    
    // Find all unsplash photo IDs (the part before ? or ")
    const regex = /https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9\-]+/g;
    let match;
    let i = 0;
    
    content = content.replace(regex, (original) => {
      // Don't replace the tech/upsell ones (which I added previously for the dashboard section)
      // Wait, the upsell section has IDs: 1551288049, 1460925895917, 1677442136019, 1555066931, 1519389950473, 1563013544.
      // I should leave those intact since they are for software upsells.
      const upsellIds = [
        '1551288049-bebda4e38f71', '1460925895917-afdab827c52f', '1677442136019-21780ecad995',
        '1555066931-4365d14bab8c', '1519389950473-47ba0277781c', '1563013544-824ae1b704d3'
      ];
      
      if (upsellIds.some(id => original.includes(id))) {
        return original; // Keep tech upsell images
      }
      
      const replacement = newImages[i % newImages.length];
      i++;
      return replacement;
    });

    await fs.writeFile(indexFile, content);
    console.log(`Successfully replaced all images in ${slug}`);
  } catch (err) {
    console.error(`Error replacing images in ${slug}:`, err);
  }
}

async function run() {
  const odontoImages = [
    'https://images.unsplash.com/photo-1606811841689-23dfddce3e95',
    'https://images.unsplash.com/photo-1598256989800-fe5f95da9787',
    'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5',
    'https://images.unsplash.com/photo-1537368910025-70280458b4fe',
    'https://images.unsplash.com/photo-1609840114035-3c981b782dfe',
    'https://images.unsplash.com/photo-1572985011741-94572242cc3d', // teeth whitening
    'https://images.unsplash.com/photo-1524222717473-730000096953', // dentist working
    'https://images.unsplash.com/photo-1599557424263-d1df5e783618', // smile
    'https://images.unsplash.com/photo-1606265752439-1f18756aa5fc'  // clinic
  ];
  
  const chiroImages = [
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef',
    'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
    'https://images.unsplash.com/photo-1552693673-1bf958298935',
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b',
    'https://images.unsplash.com/photo-1519823551278-64ac92734fb1', // stretching
    'https://images.unsplash.com/photo-1536622359527-3ceebdd3e3b3', // spine
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b', // gym rehab
    'https://images.unsplash.com/photo-1588286840104-8957b019727f'  // yoga wellness
  ];

  await replaceImages('template-oralfix', odontoImages);
  await replaceImages('template-miamiwellness', chiroImages);
}

run();
