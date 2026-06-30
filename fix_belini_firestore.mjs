import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync(new URL('./firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function fixFirestore() {
  try {
    console.log("Iniciando correção do Firestore para a Clínica Belini...");

    // 1. Atualizar generated_sites / 14582573840495252447
    const siteRef = doc(db, 'generated_sites', '14582573840495252447');
    const siteSnap = await getDoc(siteRef);
    if (siteSnap.exists()) {
      console.log("Documento em 'generated_sites' encontrado!");
      await updateDoc(siteRef, {
        companyName: "Clínica Belini - Estética Avançada",
        niche: "Estética Avançada",
        analysis: "### Oportunidade Digital para Clínica Belini\nA Clínica Belini, sob a liderança da Dra. Fabíola Laporte, tem uma presença física consolidada em Belo Horizonte, mas a captação digital pode ser otimizada. Desenvolvemos uma landing page focada em tratamentos estéticos premium, rejuvenescimento e procedimentos injetáveis com alto rigor científico, garantindo que o design e as conversões estejam em sintonia com a sofisticação da clínica."
      });
      console.log("Documento em 'generated_sites' atualizado com sucesso!");
    } else {
      console.log("ERRO: Documento em 'generated_sites' (ID: 14582573840495252447) não encontrado!");
    }

    // 2. Atualizar proposals / proposta-escom-dra-ana-paula
    const proposalRef = doc(db, 'proposals', 'proposta-escom-dra-ana-paula');
    const proposalSnap = await getDoc(proposalRef);
    if (proposalSnap.exists()) {
      console.log("Documento em 'proposals' encontrado!");
      await updateDoc(proposalRef, {
        clientName: "Dra. Fabíola Laporte",
        company: "Clínica Belini - Estética Avançada"
      });
      console.log("Documento em 'proposals' atualizado com sucesso!");
    } else {
      console.log("ERRO: Documento em 'proposals' (ID: proposta-escom-dra-ana-paula) não encontrado!");
    }

    console.log("Correções no Firestore finalizadas.");
  } catch (err) {
    console.error("Erro ao atualizar Firestore:", err);
  }
}

fixFirestore();
