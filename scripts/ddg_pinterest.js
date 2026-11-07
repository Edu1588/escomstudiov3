import fs from 'fs';

async function run() {
  const query = encodeURIComponent('site:pinterest.com/pin/ barbershop website');
  const res = await fetch(`https://html.duckduckgo.com/html/?q=${query}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const text = await res.text();
  fs.writeFileSync('ddg_out.html', text);
  // find all hrefs with pinterest
  const matches = [...text.matchAll(/href=\"([^\"]*pinterest[^\"]*)\"/gi)].map(m => decodeURIComponent(m[1]));
  console.log('Matches count:', matches.length);
  for (const m of matches) {
    console.log('Match:', m);
  }
}

run();
