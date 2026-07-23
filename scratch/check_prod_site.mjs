async function checkUrl(url) {
  try {
    const res = await fetch(url);
    const text = await res.text();
    console.log(`URL: ${url}`);
    console.log(`  Tamanho: ${text.length}`);
    console.log(`  Contem sec-1-urgencia? ${text.includes('sec-1-urgencia')}`);
    console.log(`  Contem Bricolage Grotesque? ${text.includes('Bricolage Grotesque')}`);
  } catch (err) {
    console.error(`Erro ao acessar ${url}:`, err.message);
  }
}

async function run() {
  await checkUrl('https://escomstudio.com.br/site-onward-consultoria');
  await checkUrl('https://escomstudio.com.br/site-onward-consultoria.html');
  await checkUrl('https://escomstudio.com.br/onward-consultoria.html');
  await checkUrl('https://escomstudio.com.br/onward.html');
  await checkUrl('https://escomstudio.com.br/sites/onward-consultoria.html');
}

run();
