const webhookUrl = 'https://script.google.com/macros/s/AKfycbwtO8JcXQRG5fIdOFairXTjXOqDp7BZtoUmAKRTXZmyJqZoEIFkCGJC2mlc9I_Hqew-/exec';

const payload = {
  name: "Cliente Teste Antigravity",
  email: "antigravity.teste@escom.com.br",
  whatsapp: "11999999999",
  pageUrl: "https://escom-studio.vercel.app/proposta-escom-teste-planilha",
  pdfUrl: "https://escom-studio.vercel.app/proposta-escom-teste-planilha?download=pdf",
  status: "entrar em contato",
  company: "Silva Auto Center Teste",
  createdAt: new Date().toISOString(),
  timePendingDays: 5
};

console.log("Enviando payload para o Google Sheets Webhook...");
console.log(payload);

fetch(webhookUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(payload)
})
.then(res => {
  console.log(`Status da resposta: ${res.status} ${res.statusText}`);
  return res.text();
})
.then(text => {
  console.log("Resposta do servidor do Google Sheets:");
  console.log(text);
})
.catch(err => {
  console.error("Erro ao enviar requisição:", err);
});
