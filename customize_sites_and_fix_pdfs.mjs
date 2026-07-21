import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

// Inicializar Firebase
const firebaseConfig = JSON.parse(fs.readFileSync(new URL('./firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function customizePillar() {
  const filePath = path.join(process.cwd(), 'dist', 'site-clinica-pillar', 'index.html');
  if (!fs.existsSync(filePath)) {
    console.error("ERRO: site-clinica-pillar não encontrado localmente!");
    return "";
  }

  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Remover referências a Odontologia no menu e rodapé
  html = html.replace(/Pillar ODONTOLOGIA/g, 'Pillar CIRURGIA PLÁSTICA');
  html = html.replace(/ODONTOLOGIA/g, 'CIRURGIA PLÁSTICA');
  html = html.replace(/fa-tooth/g, 'fa-user-doctor');
  
  // 2. Mudar imagem de fundo do Hero (de dentista operando para recepção médica premium)
  html = html.replace(
    /https:\/\/images.unsplash.com\/photo-1606811841689-23dfddce3e95\?q=80&w=1600&auto=format&fit=crop/g,
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1600&auto=format&fit=crop'
  );

  // 3. Mudar imagem do "Sobre" (de sala clínica odontológica para sala de consulta elegante)
  html = html.replace(
    /https:\/\/images.unsplash.com\/photo-1588776814546-1ffcf47267a5\?q=80&w=800&auto=format&fit=crop/g,
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop'
  );

  // 4. Seção dos Diferenciais (imagem da cirurgiã)
  html = html.replace(
    /https:\/\/images.unsplash.com\/photo-1606265752439-1f18756aa5fc\?q=80&w=600&auto=format&fit=crop/g,
    'https://images.unsplash.com/photo-1594824813573-246434e33963?q=80&w=600&auto=format&fit=crop'
  );

  // 5. Ajustar a Headline e Textos Principais
  html = html.replace(/DAY CLINIC DE IMPLANTES DENTÁRIOS/g, 'CLÍNICA DE CIRURGIA PLÁSTICA PREMIUM');
  html = html.replace(
    /Especialistas em Odontologia Digital 3D. Realizamos o seu implante dentário de forma indolor, rápida e definitiva em Florianópolis, devolvendo sua autoestima e saúde mastigatória./g,
    'Especialistas em Cirurgia Plástica e Estética de Alto Padrão. Realizamos procedimentos modernos, seguros e personalizados em Florianópolis, devolvendo sua autoestima, contorno corporal e bem-estar.'
  );

  // 6. Substituir termos dentários nas abas e serviços
  html = html.replace(/Implantes Dentários/g, 'Lipoaspiração & Contorno');
  html = html.replace(/Recuperação total da função e estética com implantes alemães de zircônia pura./g, 'Contorno corporal avançado e remoção de gordura localizada com tecnologia de ponta.');
  
  html = html.replace(/Estética e Zircônia/g, 'Mamoplastia de Aumento');
  html = html.replace(/Lentes de contato dental e coroas em Zircônia para um sorriso impecável./g, 'Próteses de silicone de alta coesividade para um colo marcado, simétrico e natural.');
  
  html = html.replace(/Day Clinic & Sedação/g, 'Pós-Operatório VIP');
  html = html.replace(/Tratamentos extensos realizados em tempo recorde com sedação consciente monitorada./g, 'Acompanhamento continuado por equipe multidisciplinar com foco em recuperação acelerada.');

  // Outras substituições menores de copy
  html = html.replace(/implante dentário/g, 'procedimento cirúrgico');
  html = html.replace(/implantes dentários/g, 'procedimentos cirúrgicos');
  html = html.replace(/saúde mastigatória/g, 'harmonia corporal');
  html = html.replace(/dentário/g, 'estético');
  html = html.replace(/sorriso/g, 'corpo e rosto');
  html = html.replace(/sorrisos/g, 'vidas');
  html = html.replace(/implante/g, 'procedimento');

  // Ajustar depoimentos
  html = html.replace(/Invisalign/g, 'Lipo HD');
  html = html.replace(/tratamentos dentários/g, 'cirurgias plásticas');
  html = html.replace(/tratamento dentário/g, 'procedimento cirúrgico');

  fs.writeFileSync(filePath, html, 'utf-8');
  console.log("✅ Clínica Pillar customizada com sucesso (removido odontologia)!");
  return html;
}

async function customizeGio() {
  const filePath = path.join(process.cwd(), 'dist', 'site-gio-estetica', 'index.html');
  if (!fs.existsSync(filePath)) {
    console.error("ERRO: site-gio-estetica não encontrado localmente!");
    return "";
  }

  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Limpar "Belo Horizonte" residual do template original e trocar por Florianópolis
  html = html.replace(/Belo Horizonte/g, 'Florianópolis');

  // 2. Trocar a foto do hero (de acupuntura na testa para uma clínica estética ou aplicação facial de alta qualidade)
  html = html.replace(
    /https:\/\/images.unsplash.com\/photo-1512290923902-8a9f81dc236c\?q=80&w=1600&auto=format&fit=crop/g,
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1600&auto=format&fit=crop'
  );

  fs.writeFileSync(filePath, html, 'utf-8');
  console.log("✅ GiO Estética Avançada customizada com sucesso (removido Belo Horizonte)!");
  return html;
}

// Corrigir links de PDF em todos os 5 sites
async function patchPdfLinks() {
  const sites = [
    { id: "novatech-automotive", file: "site-novatech-automotive" },
    { id: "gio-estetica", file: "site-gio-estetica" },
    { id: "innovative-business", file: "site-innovative-business" },
    { id: "clinica-pillar", file: "site-clinica-pillar" },
    { id: "dr-raymond-hall", file: "site-dr-raymond-hall" }
  ];

  for (const site of sites) {
    const filePath = path.join(process.cwd(), 'dist', site.file, 'index.html');
    if (!fs.existsSync(filePath)) {
      console.warn(`Arquivo local para ${site.id} não encontrado, pulando...`);
      continue;
    }

    let html = fs.readFileSync(filePath, 'utf8');

    // Expressão regular para substituir qualquer link .pdf por link dinâmico da proposta do Firebase
    const pdfRegex = /href="[^"]*?\.pdf"/g;
    const dynamicProposalUrl = `href="/proposta-escom-${site.id}"`;
    
    html = html.replace(pdfRegex, dynamicProposalUrl);

    // Ajustar texto do botão do dossiê para ficar condizente que é uma página de proposta
    html = html.replace(/Acessar Dossiê Estratégico \(Acessar PDF da Análise\)/gi, 'Acessar Dossiê Estratégico & Proposta');
    html = html.replace(/Acessar Dossiê Estratégico/gi, 'Acessar Dossiê & Proposta');

    fs.writeFileSync(filePath, html, 'utf-8');
    console.log(`✅ Links de PDF corrigidos para /proposta-escom-${site.id} no site-${site.id}!`);

    // Sincronizar de volta no Firestore
    try {
      const siteProjectId = "site_auto_" + site.id;
      await updateDoc(doc(db, "generated_sites", siteProjectId), {
        htmlContent: html,
        updatedAt: Date.now()
      });
      console.log(`   Firestore atualizado para ${site.id}!`);
    } catch (e) {
      console.error(`   Erro ao salvar no Firestore para ${site.id}:`, e.message);
    }
  }
}

async function main() {
  console.log("=== INICIANDO CUSTOMIZAÇÃO DOS SITES E RESOLUÇÃO DOS PDFs ===");
  await customizePillar();
  await customizeGio();
  await patchPdfLinks();
  console.log("=== PROCESSO CONCLUÍDO COM SUCESSO! ===");
}

main().catch(console.error);
