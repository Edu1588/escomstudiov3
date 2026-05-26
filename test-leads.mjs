import fetch from 'node-fetch';
async function run() {
  const res = await fetch('http://127.0.0.1:3000/api/leads');
  const d = await res.json();
  console.log(JSON.stringify(d, null, 2));
}
run();
