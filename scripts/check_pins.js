import fs from 'fs';

async function check() {
  const pinIds = [
    '649433208756353974',
    '339599628165575510',
    '626492998270146039',
    '798544202690947702',
    '661958845239106043',
    '843932417758364861',
    '577023833519808386',
    '154811987104374301',
    '49258195924749326',
    '422282902568600109',
    '109071622227181057',
    '237846424056247656'
  ];

  for (const id of pinIds) {
    const url = `https://www.pinterest.com/pin/${id}/`;
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
        }
      });
      const html = await res.text();
      const title = (html.match(/<title>([^<]+)<\/title>/i) || [])[1] || '';
      const ogTitle = (html.match(/property="og:title"\s+content="([^"]+)"/i) || [])[1] || '';
      const ogDesc = (html.match(/property="og:description"\s+content="([^"]+)"/i) || [])[1] || '';
      console.log(`PIN: ${id} | HTTP ${res.status}`);
      console.log(`  Title: ${ogTitle || title}`);
      console.log(`  Desc: ${ogDesc.slice(0, 120)}`);
      console.log('---');
    } catch (e) {
      console.log(`PIN ${id} failed:`, e.message);
    }
  }
}

check();
