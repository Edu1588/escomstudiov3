import fs from 'fs';

let content = fs.readFileSync('api/index.ts', 'utf8');
const search = 'if (lead.site_html && lead.site_html.trim().length > 100) {';
const replacement = 'const forceRegen = req.query.force === "1" || req.query.regen === "1";\n    if (lead.site_html && lead.site_html.trim().length > 100 && !forceRegen) {';

if (content.includes(search)) {
  content = content.replace(search, replacement);
  fs.writeFileSync('api/index.ts', content);
  console.log('Successfully added forceRegen to api/index.ts!');
} else {
  console.error('Target not found!');
}
