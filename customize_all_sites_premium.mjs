import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

// Inicializar Firebase
const firebaseConfig = JSON.parse(fs.readFileSync(new URL('./firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function customizeNovaTech() {
  const filePath = path.join(process.cwd(), 'public', 'site-novatech-automotive', 'index.html');
  if (!fs.existsSync(filePath)) {
    console.error("ERRO: O arquivo local da NovaTech não existe em dist/site-novatech-automotive/index.html");
    return;
  }

  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Substituir cores básicas para paleta Deep Navy e Laranja Premium
  html = html.replace(/--primary-color: #1e293b !important;/g, '--primary-color: #091124 !important;');
  html = html.replace(/--secondary-color: #94a3b8 !important;/g, '--secondary-color: #11192a !important;');
  html = html.replace(/--accent-color: #38bdf8 !important;/g, '--accent-color: #f96c26 !important;');
  html = html.replace(/--font-heading: 'Montserrat', sans-serif !important;/g, "--font-heading: 'Roboto', sans-serif !important;");
  html = html.replace(/--font-body: 'Inter', sans-serif !important;/g, "--font-body: 'Roboto Slab', serif !important;");

  // 2. Links do Google Fonts
  html = html.replace(
    /<link href="https:\/\/fonts.googleapis.com\/css2\?family=Montserrat:wght@400;600;700&family=Inter:wght@300;400;600&display=swap" rel="stylesheet">/g,
    '<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Roboto+Slab:wght@300;400;600;700;900&display=swap" rel="stylesheet">'
  );

  // 3. Atualizar a paleta de cores no objeto de configuração do Tailwind CSS
  const oldTailwindConfig = `mecanica: {
                            900: '#1c1917',
                            800: '#292524',
                            700: '#44403c',
                            600: '#ea580c',
                            500: '#f97316',
                            400: '#fb923c',
                            50: '#fff7ed',
                        }`;

  const newTailwindConfig = `mecanica: {
                            900: '#091124', // Deep Navy
                            800: '#0d1830', 
                            700: '#1c2841', 
                            600: '#f96c26', // Laranja Premium Oficial
                            500: '#ffa173', 
                            400: '#ffbca0',
                            50: '#fff5f0',
                        }`;
  html = html.replace(oldTailwindConfig, newTailwindConfig);

  // 4. Mudar o background do body
  html = html.replace(/body \{ background-color: #0c0a09; color: #e7e5e4;/g, 'body { background-color: #091124; color: #e2e8f0;');
  html = html.replace(/background: rgba\(28, 25, 23, 0.90\);/g, 'background: rgba(9, 17, 36, 0.90);');
  html = html.replace(/background-color: #0c0a09;/g, 'background-color: #091124;');
  html = html.replace(/background: linear-gradient\(to right, rgba\(12, 10, 9, 0.9\), rgba\(12, 10, 9, 0.5\)\);/g, 'background: linear-gradient(to right, rgba(9, 17, 36, 0.95), rgba(9, 17, 36, 0.6));');

  // 5. Injetar logotipo oficial da NovaTech no cabeçalho
  // Procura pelo logo de texto ou ícone e substitui pela imagem do logotipo oficial
  const headerLogoTarget = `<div class="flex items-center gap-3">\n                    <i class="fa-solid fa-screwdriver-wrench text-mecanica-500 text-3xl"><\/i>\n                    <span class="font-display font-bold text-white text-2xl tracking-tight">NovaTech Automotive<\/span>\n                <\/div>`;
  const headerLogoReplacement = `<div class="flex items-center gap-3">
                    <img src="https://novatechautomotive.com.br/wp-content/uploads/2019/10/Novatech-Automotive-Curitiba-Imports.png" alt="NovaTech Automotive Logo" class="h-12 object-contain" />
                </div>`;
  html = html.replace(headerLogoTarget, headerLogoReplacement);

  // Também na seção de rodapé
  const footerLogoTarget = `<div class="flex items-center gap-3 mb-6">\n                    <i class="fa-solid fa-screwdriver-wrench text-mecanica-500 text-3xl"><\/i>\n                    <span class="font-display font-bold text-white text-2xl tracking-tight">NovaTech Automotive<\/span>\n                <\/div>`;
  const footerLogoReplacement = `<div class="flex items-center gap-3 mb-6">
                    <img src="https://novatechautomotive.com.br/wp-content/uploads/2019/10/Novatech-Automotive-Curitiba-Imports.png" alt="NovaTech Automotive Logo" class="h-12 object-contain" />
                </div>`;
  html = html.replace(footerLogoTarget, footerLogoReplacement);

  // 6. Substituir as imagens por veículos esportivos e importados alemães (Porsche, BMW, Audi, Mercedes)
  html = html.replace(
    /background-image: url\('https:\/\/images.unsplash.com\/photo-1619642751034-765dfdf7c58e\?q=80&w=2070&auto=format&fit=crop'\)/g,
    "background-image: url('https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=2070&auto=format&fit=crop')"
  );
  html = html.replace(
    /src="https:\/\/images.unsplash.com\/photo-1616788494707-ec28f08d05a1\?q=80&w=2070&auto=format&fit=crop"/g,
    'src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop"'
  );

  // 7. Customizar os títulos e copies para a pegada premium de importados e híbridos
  html = html.replace(
    /<h1>Diagnóstico Avançado para Veículos Premium em Curitiba.<\/h1>/gi,
    '<h1>Especialistas em Veículos Importados e Híbridos em Curitiba.</h1>'
  );
  html = html.replace(
    /Equipe altamente treinada, oficina limpa e orçamento detalhado via foto e vídeo diretamente no seu WhatsApp. Saiba exatamente o que seu carro precisa, sem taxas ocultas./g,
    'Sua oficina premium especializada em marcas alemãs (Audi, BMW, Mercedes, Porsche) e veículos de alta performance. Diagnóstico computadorizado original, transparência por vídeo e garantia de 1 ano.'
  );

  // 8. Customizar os serviços da ferramenta OBD2 interativa
  html = html.replace(/Injeção Eletrônica/g, 'Codificação & Programação ECU');
  html = html.replace(/Sensores Eletrônicos/g, 'Diagnóstico Alemão (Odis/Icom)');
  html = html.replace(/Freios e ABS \(Pastilhas\)/g, 'Pastilhas de Cerâmica (Brembo)');
  html = html.replace(/Segurança Ativa/g, 'Frenagem de Alta Performance');
  html = html.replace(/Suspensão & Amortecedores/g, 'Ajuste de Suspensão Pneumática');
  html = html.replace(/Estabilidade/g, 'Calibração Eletrônica de Eixos');

  // 9. Atualizar contatos reais
  html = html.replace(/41999998888/g, '4132565962');
  html = html.replace(/\(41\)\s*99999-8888/g, '(41) 3256-5962');
  html = html.replace(/contato@novatech\.com\.br/g, 'contato@novatechautomotive.com.br');
  html = html.replace(/Rua Brigadeiro Franco, 3000 - Rebouças/g, 'Rua Professora Carmem Lima de Almeida, 108A - Bacacheri');
  
  // Link do WhatsApp
  html = html.replace(/wa\.me\/5541999998888/g, 'wa.me/554132565962');

  fs.writeFileSync(filePath, html, 'utf-8');
  console.log("✅ NovaTech index.html customizado localmente!");
}

async function customizeGio() {
  const filePath = path.join(process.cwd(), 'public', 'site-gio-estetica', 'index.html');
  if (!fs.existsSync(filePath)) {
    console.error("ERRO: O arquivo local da GiO não existe em dist/site-gio-estetica/index.html");
    return;
  }

  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Substituir cores champanhe pelas cores da franquia (Púrpura/Magenta e Rosa) no config do Tailwind
  html = html.replace(/"primary": "#c5a059"/g, '"primary": "#6f0052"');
  html = html.replace(/"primary-fixed": "#f4ebd0"/g, '"primary-fixed": "#fdf2f8"');
  html = html.replace(/"primary-fixed-dim": "#d9b977"/g, '"primary-fixed-dim": "#f472b6"');
  html = html.replace(/"inverse-primary": "#e6c78a"/g, '"inverse-primary": "#ec4899"');
  html = html.replace(/"tertiary": "#8c6e3b"/g, '"tertiary": "#ff13a0"');
  html = html.replace(/"surface-tint": "#c5a059"/g, '"surface-tint": "#6f0052"');
  html = html.replace(/"tertiary-fixed-dim": "#c5a059"/g, '"tertiary-fixed-dim": "#f472b6"');

  // Cores residuais inline
  html = html.replace(/#c5a059/g, '#6f0052');
  html = html.replace(/#ffd9a3/g, '#fdf2f8');

  // 2. Substituir termos holísticos de acupuntura por Estética Avançada e Rejuvenescimento
  html = html.replace(/Acupuntura Tradicional/g, 'Estética Avançada Premium');
  html = html.replace(/acupuntura/g, 'estética avançada');
  html = html.replace(/Acupuntura/g, 'Estética Avançada');
  
  html = html.replace(/Tratamentos de Acupuntura/g, 'Protocolos de Rejuvenescimento');
  html = html.replace(/Medicina Tradicional Chinesa/g, 'Alta Tecnologia Estética');
  html = html.replace(/agulhas de acupuntura/g, 'bioestimuladores de colágeno');

  // 3. Trocar a foto do hero (de acupuntura para uma foto de estética premium)
  html = html.replace(
    /https:\/\/images.unsplash.com\/photo-1512290923902-8a9f81dc236c\?q=80&w=1600&auto=format&fit=crop/g,
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1600&auto=format&fit=crop'
  );

  // 4. Substituir contatos reais da unidade de Florianópolis
  html = html.replace(/48999997777/g, '48988527927');
  html = html.replace(/\(48\)\s*99999-7777/g, '(48) 98852-7927');
  html = html.replace(/Av. Prefeito Osmar Cunha, 412 - Centro/g, 'Av. Pref. Osmar Cunha, 260 - Loja 03 - Centro');
  html = html.replace(/wa\.me\/5548999997777/g, 'wa.me/5548988527927');

  fs.writeFileSync(filePath, html, 'utf-8');
  console.log("✅ GiO Estética index.html customizado localmente!");
}

async function customizePillar() {
  const filePath = path.join(process.cwd(), 'public', 'site-clinica-pillar', 'index.html');
  if (!fs.existsSync(filePath)) {
    console.error("ERRO: O arquivo local da Clínica Pillar não existe em dist/site-clinica-pillar/index.html");
    return;
  }

  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Limpar terminologias odontológicas e dentes
  html = html.replace(/Pillar ODONTOLOGIA/g, 'Pillar CIRURGIA PLÁSTICA');
  html = html.replace(/ODONTOLOGIA/g, 'CIRURGIA PLÁSTICA');
  html = html.replace(/fa-tooth/g, 'fa-user-doctor');
  
  html = html.replace(/DAY CLINIC DE IMPLANTES DENTÁRIOS/g, 'CLÍNICA DE CIRURGIA PLÁSTICA PREMIUM');
  html = html.replace(
    /Especialistas em Odontologia Digital 3D. Realizamos o seu implante dentário de forma indolor, rápida e definitiva em Florianópolis, devolvendo sua autoestima e saúde mastigatória./g,
    'Especialistas em Cirurgia Plástica e Estética de Alto Padrão. Realizamos procedimentos modernos, seguros e personalizados em Florianópolis, devolvendo sua autoestima, contorno corporal e bem-estar.'
  );

  html = html.replace(/Implantes Dentários/g, 'Lipoaspiração & Contorno');
  html = html.replace(/Recuperação total da função e estética com implantes alemães de zircônia pura./g, 'Contorno corporal avançado e remoção de gordura localizada com tecnologia de ponta.');
  
  html = html.replace(/Estética e Zircônia/g, 'Mamoplastia de Aumento');
  html = html.replace(/Lentes de contato dental e coroas em Zircônia para um sorriso impecável./g, 'Próteses de silicone de alta coesividade para um colo marcado, simétrico e natural.');
  
  html = html.replace(/Day Clinic & Sedação/g, 'Pós-Operatório VIP');
  html = html.replace(/Tratamentos extensos realizados em tempo recorde com sedação consciente monitorada./g, 'Acompanhamento continuado por equipe multidisciplinar com foco em recuperação acelerada.');

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

  // 2. Substituir a paleta de cores roxas pela paleta verde esmeralda no config do Tailwind
  const oldPillarColors = `Pillar: {
                            900: '#3B0764',
                            800: '#581C87',
                            700: '#6B21A8',
                            600: '#7E22CE',
                            500: '#9333EA',
                            400: '#A855F7',
                            50: '#FAF5FF',
                        }`;

  const newPillarColors = `Pillar: {
                            900: '#064e3b', // Verde Esmeralda Escuro
                            800: '#065f46',
                            700: '#047857', // Verde Esmeralda Oficial da Clínica Pillar
                            600: '#059669',
                            500: '#10b981',
                            400: '#34d399',
                            50: '#ecfdf5',
                        }`;
  html = html.replace(oldPillarColors, newPillarColors);

  // Fontes no Tailwind
  html = html.replace(/sans: \['Inter', 'sans-serif'\],/g, "sans: ['Open Sans', 'sans-serif'],");
  html = html.replace(/display: \['Plus Jakarta Sans', 'sans-serif'\],/g, "display: ['Cinzel', 'serif'],");

  // Google Fonts Cinzel/Open Sans
  html = html.replace(
    /<link href="https:\/\/fonts.googleapis.com\/css2\?family=Montserrat:wght@400;600;700&family=Inter:wght@300;400;600&display=swap" rel="stylesheet">/g,
    '<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800&family=Open+Sans:wght@300;400;600;700&display=swap" rel="stylesheet">'
  );

  // Mudar as cores dos elementos em roxo que possam estar hardcoded
  html = html.replace(/#3B0764/g, '#064e3b');
  html = html.replace(/#9333EA/g, '#10b981');
  html = html.replace(/bg-purple-900/g, 'bg-emerald-900');
  html = html.replace(/text-purple-600/g, 'text-emerald-600');
  html = html.replace(/text-purple-400/g, 'text-emerald-400');
  html = html.replace(/hover:text-purple-400/g, 'hover:text-emerald-400');
  html = html.replace(/bg-purple-600/g, 'bg-emerald-600');
  html = html.replace(/border-purple-500/g, 'border-emerald-500');

  // Imagens Premium
  html = html.replace(
    /https:\/\/images.unsplash.com\/photo-1606811841689-23dfddce3e95\?q=80&w=1600&auto=format&fit=crop/g,
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1600&auto=format&fit=crop'
  );
  html = html.replace(
    /https:\/\/images.unsplash.com\/photo-1588776814546-1ffcf47267a5\?q=80&w=800&auto=format&fit=crop/g,
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop'
  );
  html = html.replace(
    /https:\/\/images.unsplash.com\/photo-1606265752439-1f18756aa5fc\?q=80&w=600&auto=format&fit=crop/g,
    'https://images.unsplash.com/photo-1594824813573-246434e33963?q=80&w=600&auto=format&fit=crop'
  );

  // Contatos Reais Fictícios Elegantes
  html = html.replace(/48999995555/g, '48991223344');
  html = html.replace(/\(48\)\s*99999-5555/g, '(48) 99122-3344');
  html = html.replace(/wa\.me\/5548999995555/g, 'wa.me/5548991223344');

  fs.writeFileSync(filePath, html, 'utf-8');
  console.log("✅ Clínica Pillar index.html customizado localmente!");
}

async function customizeInnovative() {
  const filePath = path.join(process.cwd(), 'public', 'site-innovative-business', 'index.html');
  if (!fs.existsSync(filePath)) {
    console.error("ERRO: O arquivo local da Innovative não existe em dist/site-innovative-business/index.html");
    return;
  }

  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Substituir contatos reais
  html = html.replace(/11999996666/g, '11916222210');
  html = html.replace(/\(11\)\s*99999-6666/g, '(11) 91622-2210');
  html = html.replace(/contato@innovativebusiness\.com\.br/g, 'contato@innovbusiness.com.br');
  html = html.replace(/Av. Paulista, 1765 - Bela Vista/g, 'Avenida Paulista, 2028 - Conjunto 111, Bela Vista');
  html = html.replace(/wa\.me\/5511999996666/g, 'wa.me/5511916222210');

  fs.writeFileSync(filePath, html, 'utf-8');
  console.log("✅ Innovative Business index.html customizado localmente!");
}

async function customizeDrRaymond() {
  const filePath = path.join(process.cwd(), 'public', 'site-dr-raymond-hall', 'index.html');
  if (!fs.existsSync(filePath)) {
    console.error("ERRO: O arquivo local do Dr. Raymond não existe em dist/site-dr-raymond-hall/index.html");
    return;
  }

  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Substituir contatos reais
  html = html.replace(/13109994444/g, '13108734415');
  html = html.replace(/\(310\)\s*999-4444/g, '(310) 873-4415');
  html = html.replace(/info@raymondhall\.com/g, 'info@drraymondhall.com');
  html = html.replace(/9000 Wilshire Blvd, Los Angeles, CA 90211, USA/g, '11710 Wilshire Blvd., Los Angeles, CA 90025');
  html = html.replace(/wa\.me\/5513109994444/g, 'wa.me/13108734415');
  html = html.replace(/wa\.me\/13109994444/g, 'wa.me/13108734415');

  fs.writeFileSync(filePath, html, 'utf-8');
  console.log("✅ Dr. Raymond Hall index.html customizado localmente!");
}

async function patchPdfLinksAndSyncFirebase() {
  const sites = [
    { id: "novatech-automotive", file: "site-novatech-automotive" },
    { id: "gio-estetica", file: "site-gio-estetica" },
    { id: "innovative-business", file: "site-innovative-business" },
    { id: "clinica-pillar", file: "site-clinica-pillar" },
    { id: "dr-raymond-hall", file: "site-dr-raymond-hall" }
  ];

  for (const site of sites) {
    const filePath = path.join(process.cwd(), 'public', site.file, 'index.html');
    if (!fs.existsSync(filePath)) {
      console.warn(`Arquivo local para ${site.id} não encontrado, pulando...`);
      continue;
    }

    let html = fs.readFileSync(filePath, 'utf8');

    // Substituir links .pdf por rota de proposta
    const pdfRegex = /href="[^"]*?\.pdf"/g;
    const dynamicProposalUrl = `href="/proposta-escom-${site.id}"`;
    html = html.replace(pdfRegex, dynamicProposalUrl);

    // Ajustar texto do botão
    html = html.replace(/Acessar Dossiê Estratégico \(Acessar PDF da Análise\)/gi, 'Acessar Dossiê Estratégico & Proposta');
    html = html.replace(/Acessar Dossiê Estratégico/gi, 'Acessar Dossiê & Proposta');

    fs.writeFileSync(filePath, html, 'utf-8');
    console.log(`✅ Links de PDF corrigidos para /proposta-escom-${site.id}`);

    // Sincronizar de volta no Firestore e limpar deployedUrl
    try {
      const siteProjectId = "site_auto_" + site.id;
      await updateDoc(doc(db, "generated_sites", siteProjectId), {
        htmlContent: html,
        deployedUrl: "", // Limpar para forçar novo deploy real
        updatedAt: Date.now()
      });
      console.log(`✅ Firestore atualizado e deployedUrl resetada para ${site.id}!`);
    } catch (e) {
      console.error(`❌ Erro ao salvar no Firestore para ${site.id}:`, e.message);
    }
  }
}

async function main() {
  console.log("=== INICIANDO PÓS-PROCESSAMENTO PREMIUM E HIGIENIZAÇÃO DE LEADS ===");
  await customizeNovaTech();
  await customizeGio();
  await customizePillar();
  await customizeInnovative();
  await customizeDrRaymond();
  await patchPdfLinksAndSyncFirebase();
  console.log("=== SCRIPT PREMIUM FINALIZADO COM SUCESSO! ===");
}

main().catch(console.error);
