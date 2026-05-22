import fs from 'fs';
const html = fs.readFileSync('index.html', 'utf8');
const scriptMatches = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)];
scriptMatches.forEach((m, i) => {
  fs.writeFileSync(`check_sc_${i}.js`, m[1]);
  console.log(`Saved check_sc_${i}.js`);
});
