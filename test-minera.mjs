import fetch from 'node-fetch';
async function test() {
  const res = await fetch('http://127.0.0.1:3000/api/trigger-minera');
  const d = await res.json();
  console.log(JSON.stringify(d, null, 2));
}
test();
