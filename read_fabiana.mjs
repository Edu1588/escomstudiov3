import fs from 'fs';
const data = JSON.parse(fs.readFileSync('temp_step_392.json', 'utf8'));
const sites = data.generated_sites;
const site = Object.values(sites).find(s => s.id === '7160536542187121912' || s.companyName.includes('Fabiana'));
console.log(site);
