async function check() {
  const res = await fetch('https://www.escomstudio.com.br/proposta/barbearia-los-hermanos-marilia');
  const text = await res.text();
  console.log('HTTP Status:', res.status);
  console.log('Length:', text.length);
  console.log('Includes font-serif-vintage:', text.includes('font-serif-vintage'));
  console.log('Includes btn-green-vip:', text.includes('btn-green-vip'));
  console.log('Includes Pontualidade Britânica:', text.includes('Pontualidade Britânica'));
  console.log('Title:', (text.match(/<title>([^<]+)<\/title>/i) || [])[1]);
}

check();
