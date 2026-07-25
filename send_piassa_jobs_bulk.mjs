// Script standalone para enviar todas as vagas Piassa por email
// Execute com: node send_piassa_jobs_bulk.mjs

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Resend } from 'resend';

const firebaseConfig = {
  apiKey: "AIzaSyDjDQAtyv_csEsFVZRsj1gYPLy81eDYKA8",
  authDomain: "escom-studio-portfolio.firebaseapp.com",
  projectId: "escom-studio-portfolio",
  storageBucket: "escom-studio-portfolio.firebasestorage.app",
  messagingSenderId: "885439718303",
  appId: "1:885439718303:web:531fc4658dd499cde713aa",
  firestoreDatabaseId: "(default)"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const RESEND_API_KEY = "re_Hmg78ECH_8JJ7LJUeQ92FUfMwWwUyzPqY";
const RECEIVER_EMAIL = "vamosvencerjuntos@gmail.com";
const BATCH_SIZE = 30;

async function main() {
  console.log("[SEND_ALL] Autenticando...");
  await signInWithEmailAndPassword(auth, "admin@escom.com", "Edu@1508001");
  console.log("[SEND_ALL] Autenticado.");

  console.log("[SEND_ALL] Buscando todas as vagas...");
  const snap = await getDocs(collection(db, "jobs"));
  const allJobs = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  if (allJobs.length === 0) {
    console.log("[SEND_ALL] Nenhuma vaga encontrada.");
    return;
  }

  console.log(`[SEND_ALL] ${allJobs.length} vagas encontradas.`);

  const resend = new Resend(RESEND_API_KEY);
  const totalBatches = Math.ceil(allJobs.length / BATCH_SIZE);
  let sentBatches = 0;

  for (let i = 0; i < allJobs.length; i += BATCH_SIZE) {
    const batch = allJobs.slice(i, i + BATCH_SIZE);
    const batchNum = sentBatches + 1;

    let listHtml = "";
    batch.forEach((job, idx) => {
      listHtml += `
        <div style="border-bottom: 1px solid #eee; padding: 12px 0; font-family: sans-serif;">
          <h4 style="margin: 0 0 4px 0; color: #00d1ff; font-size: 14px;">#${i + idx + 1} - ${job.title || "Sem Titulo"}</h4>
          <p style="margin: 0 0 4px 0; font-size: 12px;"><strong>Empresa:</strong> ${job.company || "N/I"} | <strong>Funcao:</strong> ${job.role || "N/I"} | <strong>Status:</strong> ${job.status || "Pendente"}</p>
          ${job.emailContato ? `<p style="margin: 0 0 4px 0; font-size: 12px;"><strong>E-mail Contato:</strong> ${job.emailContato}</p>` : ""}
          <p style="margin: 0; font-size: 11px; color: #666; font-style: italic;">"${(job.snippet || "").substring(0, 120)}..."</p>
          ${job.link ? `<p style="margin: 4px 0 0 0; font-size: 11px;"><a href="${job.link}" target="_blank" style="color: #00d1ff; text-decoration: none; font-weight: bold;">Acessar Vaga</a></p>` : ""}
        </div>
      `;
    });

    await resend.emails.send({
      from: "Piassa Vagas <onboarding@resend.dev>",
      to: RECEIVER_EMAIL,
      subject: `Lote ${batchNum}/${totalBatches} - ${batch.length} Vagas Piassa (${allJobs.length} total)`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #111; border-bottom: 2px solid #00d1ff; padding-bottom: 10px; margin-top: 0;">Lote ${batchNum} de ${totalBatches}</h2>
          <p>Envio em lotes de 30 vagas. Esta e a <strong>${batchNum}a remessa</strong> de <strong>${totalBatches}</strong> total.</p>
          <hr style="border: 0; border-top: 1px solid #eee;"/>
          ${listHtml}
          <br/>
          <p style="font-size: 12px; color: #888;">Progresso: ${Math.min(i + BATCH_SIZE, allJobs.length)}/${allJobs.length} vagas enviadas.</p>
          <p>Acesse o painel: <a href="https://escomstudio.com.br/piassa" target="_blank" style="color: #00d1ff; font-weight: bold; text-decoration: none;">Painel Piassa</a></p>
        </div>
      `
    });

    sentBatches++;
    console.log(`[SEND_ALL] Lote ${batchNum}/${totalBatches} enviado com ${batch.length} vagas.`);
  }

  console.log(`[SEND_ALL] Concluido! ${sentBatches} lotes enviados. Total: ${allJobs.length} vagas.`);
}

main().catch(e => {
  console.error("[SEND_ALL] Erro:", e.message);
  process.exit(1);
});
