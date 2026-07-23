import http from 'http';

http.get('http://localhost:3000/template-ci-odontologia/index.html', (res) => {
  console.log(`LOCAL SERVER STATUS: ${res.statusCode}`);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(`HTML Title Found: ${data.includes('C.I Odontologia') ? 'YES' : 'NO'}`);
  });
}).on('error', (err) => {
  console.error("Local Server Error:", err.message);
});
