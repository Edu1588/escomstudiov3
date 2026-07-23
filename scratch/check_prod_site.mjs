import https from 'https';

function checkUrlFollowRedirect(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      console.log(`REQ: ${url} -> STATUS: ${res.statusCode} | LOCATION: ${res.headers.location || 'NONE'}`);
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location) {
        const nextUrl = res.headers.location.startsWith('http') 
          ? res.headers.location 
          : new URL(res.headers.location, url).toString();
        checkUrlFollowRedirect(nextUrl).then(resolve);
      } else {
        resolve({ url, status: res.statusCode });
      }
    }).on('error', (err) => {
      console.error(`REQ: ${url} -> ERROR:`, err.message);
      resolve({ url, status: 500 });
    });
  });
}

async function testAll() {
  console.log("=== TESTANDO URLs E SEGUINDO REDIRECTS NA VERCEL ===");
  await checkUrlFollowRedirect('https://escom-studio.vercel.app/template-clinica/index.html');
  await checkUrlFollowRedirect('https://escom-studio.vercel.app/template-ci-odontologia/index.html');
  await checkUrlFollowRedirect('https://escom-studio.vercel.app/template-ci-odontologia/');
  await checkUrlFollowRedirect('https://escom-studio.vercel.app/template-ci-odontologia');
}

testAll();
