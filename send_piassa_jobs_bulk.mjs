import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Resend } from 'resend';

const firebaseConfig = {
  projectId: "escom-studio-portfolio",
  appId: "1:885439718303:web:531fc4658dd499cde713aa",
  apiKey: "AIzaSyDjDQAtyv_csEsFVZRsj1gYPLy81eDYKA8",
  authDomain: "escom-studio-portfolio.firebaseapp.com",
  firestoreDatabaseId: "(default)",
  storageBucket: "escom-studio-portfolio.firebasestorage.app",
  messagingSenderId: "885439718303",
  measurementId: ""
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

async function run() {
  console.log("[BULK_SENDER] Autenticando no Firebase...");
  await signInWithEmailAndPassword(auth, "admin@escom.com", "Edu@1508001");
  console.log("[BULK_SENDER] Autenticado com sucesso!");

  console.log("[BULK_SENDER] Buscando todas as vagas...");
  const snap = await getDocs(collection(db, "jobs"));
  console.log(`[BULK_SENDER] Total de vagas encontradas: ${snap.size}`);

  const jobs = snap.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      title: data.title || "Vaga de Marketing",
      company: data.company || "Não informada",
      snippet: data.snippet || "",
      link: data.link || "",
      role: data.role || "Não informada",
      status: data.status || "Pendente",
      emailContato: data.emailContato || null,
      createdAt: data.createdAt || 0
    };
  });

  // Ordenar das mais recentes para as mais antigas
  jobs.sort((a, b) => b.createdAt - a.createdAt);

  const resendApiKey = process.env.RESEND_API_KEY || "re_UmqH3RyE_MK1VdBdNEpdgQtuNvN8nAjq1";
  const resend = new Resend(resendApiKey);
  const receiverEmail = "vamosvencerjuntos@gmail.com";

  const chunkSize = 30;
  let batchCount = 0;

  for (let i = 0; i < jobs.length; i += chunkSize) {
    const chunk = jobs.slice(i, i + chunkSize);
    batchCount++;
    const startIndex = i + 1;
    const endIndex = Math.min(i + chunkSize, jobs.length);

    console.log(`[BULK_SENDER] Preparando envio do Lote ${batchCount} (${startIndex} a ${endIndex} de ${jobs.length} vagas)...`);

    let jobsHtml = "";
    chunk.forEach((job, idx) => {
      const globalIndex = i + idx + 1;
      const formattedDate = job.createdAt ? new Date(job.createdAt).toLocaleDateString("pt-BR") : "N/A";
      jobsHtml += `
        <div style="border-bottom: 1px solid #eee; padding: 15px 0; font-family: sans-serif;">
          <h4 style="margin: 0 0 5px 0; color: #00d1ff; font-size: 16px;">#${globalIndex} - ${job.title}</h4>
          <p style="margin: 0 0 5px 0; font-size: 13px;">
            <strong>Empresa:</strong> ${job.company} | 
            <strong>Função:</strong> ${job.role} | 
            <strong>Status:</strong> <span style="background: #eee; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${job.status}</span>
          </p>
          ${job.emailContato ? `<p style="margin: 0 0 5px 0; font-size: 13px;"><strong>E-mail Contato:</strong> ${job.emailContato}</p>` : ""}
          <p style="margin: 0; font-size: 12px; color: #666; font-style: italic;">"${job.snippet}"</p>
          <div style="margin-top: 8px; font-size: 12px; display: flex; gap: 15px;">
            <span><strong>Criada em:</strong> ${formattedDate}</span>
            ${job.link ? `<span><a href="${job.link}" target="_blank" style="color: #00d1ff; text-decoration: none; font-weight: bold;">Acessar Vaga &rarr;</a></span>` : ""}
          </div>
        </div>
      `;
    });

    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #111; border-bottom: 2px solid #00d1ff; padding-bottom: 10px; margin-top: 0;">📦 Piassa - Vagas Salvas (Lote ${batchCount})</h2>
        <p>Este e-mail contém o lote de vagas de número <strong>${batchCount}</strong>, cobrindo o intervalo de <strong>${startIndex} a ${endIndex}</strong> de um total de <strong>${jobs.length}</strong> vagas cadastradas.</p>
        <hr style="border: 0; border-top: 1px solid #eee;"/>
        ${jobsHtml}
        <br/>
        <p>Acesse o painel do Piassa para gerenciamento em tempo real: <a href="https://escomstudio.com.br/piassa" target="_blank" style="color: #00d1ff; font-weight: bold; text-decoration: none;">Painel Piassa</a></p>
      </div>
    `;

    try {
      await resend.emails.send({
        from: "Piassa Vagas <onboarding@resend.dev>",
        to: receiverEmail,
        subject: `📦 Piassa Vagas - Lote ${batchCount} (${startIndex} a ${endIndex} de ${jobs.length})`,
        html: emailHtml
      });
      console.log(`[BULK_SENDER] Lote ${batchCount} enviado com sucesso para ${receiverEmail}!`);
      // Esperar 1.5s entre os envios para respeitar os limites de taxa do Resend (rate limits de contas gratuitas)
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (err) {
      console.error(`[BULK_SENDER] Erro ao enviar o Lote ${batchCount}:`, err.message);
    }
  }

  console.log(`[BULK_SENDER] Finalizado! Todos os ${batchCount} lotes de vagas foram processados.`);
  process.exit(0);
}

run().catch(err => {
  console.error("[BULK_SENDER] Fatal error:", err);
  process.exit(1);
});
