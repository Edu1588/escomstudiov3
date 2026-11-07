import https from 'https';

async function search() {
  const q = 'site:pinterest.com/pin/ barbershop website';
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(q)}`;

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    }
  });

  const body = await res.text();
  // DuckDuckGo redirects through //duckduckgo.com/l/?uddg=https%3A%2F%2Fwww.pinterest.com%2Fpin%2F...
  const matches = [...body.matchAll(/uddg=([^&"]+)/g)].map(m => decodeURIComponent(m[1]));
  console.log('Total URLs found:', matches.length);
  const pinUrls = matches.filter(u => u.includes('pinterest.com/pin/'));
  console.log('Pinterest pin URLs:', pinUrls);

  // Check each pin
  for (const p of pinUrls.slice(0, 10)) {
    try {
      const pinRes = await fetch(p, { headers: { 'User-Agent': 'Mozilla/5.0' }, redirect: 'follow' });
      const pinHtml = await pinRes.text();
      const titleMatch = pinHtml.match(/<title>([^<]+)<\/title>/i);
      console.log(`URL: ${p} | Status: ${pinRes.status}`);
      console.log(`  Title: ${titleMatch ? titleMatch[1] : 'N/A'}`);
    } catch (e) {
      console.log(`Error checking ${p}:`, e.message);
    }
  }
}

search();
