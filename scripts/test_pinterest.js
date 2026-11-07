import fs from 'fs';

async function run() {
  const res = await fetch('https://www.pinterest.com/search/pins/?q=barbershop+website+design', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    }
  });
  const text = await res.text();
  fs.writeFileSync('pinterest_search.html', text);
  console.log('Saved pinterest_search.html, size:', text.length);

  // Search for pin IDs or hrefs
  const pinIds = [];
  const regex = /pin\/(\d+)/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    pinIds.push(match[1]);
  }
  console.log('Regex pin IDs count:', pinIds.length);
  const uniquePins = Array.from(new Set(pinIds));
  console.log('Unique pin IDs:', uniquePins.slice(0, 15));

  // Also check for "id":"123..."
  const regexId = /"id":"(\d{15,22})"/g;
  const ids2 = [];
  while ((match = regexId.exec(text)) !== null) {
    ids2.push(match[1]);
  }
  console.log('IDs pattern count:', ids2.length);
  const uniqueIds2 = Array.from(new Set(ids2));
  console.log('Unique numeric IDs:', uniqueIds2.slice(0, 15));
}

run();
