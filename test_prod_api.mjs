async function test() {
  try {
    const response = await fetch("https://escom-studio.vercel.app/api/generate-copy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        promptText: "Diga 'Olá mundo, estou funcionando!'",
        jsonMode: false
      })
    });
    const data = await response.json();
    console.log("Resposta da produção:", data);
  } catch (err) {
    console.error("Erro ao chamar API de produção:", err);
  }
}
test();
