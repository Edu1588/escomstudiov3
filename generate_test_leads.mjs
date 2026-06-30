import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import puppeteer from 'puppeteer';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = JSON.parse(fs.readFileSync(new URL('./firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const leads = [
  {
    id: 'oralfix_br',
    slug: 'template-oralfix',
    name: 'Oral Fix - Odontologia Especializada',
    shortName: 'Oral Fix',
    website: 'https://oralfix.com.br',
    niche: 'Odontologia'
  },
  {
    id: 'miamiwellness_us',
    slug: 'template-miamiwellness',
    name: 'Miami Wellness Chiropractic',
    shortName: 'Miami Wellness',
    website: 'https://miamiwellness.com',
    niche: 'Chiropractic'
  }
];

async function generateSites() {
  const browser = await puppeteer.launch();

  for (const lead of leads) {
    console.log(`Generating site for ${lead.name}...`);
    const templateDir = path.resolve(`./public/${lead.slug}`);
    
    // 1. Copy Belini Template
    await fsp.cp(path.resolve('./public/template-belini'), templateDir, { recursive: true });

    // 2. Replace Texts in index.html
    const indexFile = path.join(templateDir, 'index.html');
    let indexHtml = await fsp.readFile(indexFile, 'utf8');
    indexHtml = indexHtml.replace(/Clínica Belini/g, lead.name);
    indexHtml = indexHtml.replace(/template-belini/g, lead.slug);
    await fsp.writeFile(indexFile, indexHtml);

    // 3. Replace Texts in dossie.html
    const baseDossieFile = path.resolve('./public/base-dossie.html');
    const dossieFile = path.join(templateDir, 'dossie.html');
    let dossieHtml = await fsp.readFile(baseDossieFile, 'utf8');
    dossieHtml = dossieHtml.replace(/{{COMPANY_NAME}}/g, lead.name);
    dossieHtml = dossieHtml.replace(/{{INITIALS}}/g, lead.name.substring(0, 2).toUpperCase());
    await fsp.writeFile(dossieFile, dossieHtml);

    // 4. Generate PDF
    console.log(`Generating PDF for ${lead.name}...`);
    const page = await browser.newPage();
    const fileUrl = 'file:///' + dossieFile.replace(/\\/g, '/');
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });
    await page.pdf({
      path: path.join(templateDir, 'dossie.pdf'),
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });
    await page.close();

    // 5. Add to Firebase
    console.log(`Adding ${lead.name} to Firestore...`);
    const leadData = {
      title: lead.name,
      website: lead.website,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'leads', lead.id), leadData);

    const siteData = {
      leadId: lead.id,
      companyName: lead.name,
      htmlUrl: `/${lead.slug}/index.html`,
      deployedUrl: `/${lead.slug}/index.html`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'generated_sites', `proj_${lead.id}`), siteData);
  }

  await browser.close();
  console.log('All done!');
}

generateSites().catch(console.error);
