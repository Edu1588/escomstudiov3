console.log("Chamando trigger-monitoring na Vercel...");

fetch("https://escom-studio.vercel.app/api/trigger-monitoring")
  .then(res => {
    console.log(`Status HTTP: ${res.status} ${res.statusText}`);
    return res.json();
  })
  .then(data => {
    console.log("Resposta da API de produção:");
    console.log(JSON.stringify(data, null, 2));
  })
  .catch(err => {
    console.error("Erro ao fazer requisição:", err);
  });
