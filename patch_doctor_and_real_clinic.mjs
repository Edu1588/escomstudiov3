import fs from 'fs';
import path from 'path';

const files = [
  'public/ci-odontologia/index.html',
  'ci-odontologia/index.html',
  'public/template-ci-odontologia/index.html',
  'template-ci-odontologia/index.html'
];

files.forEach(relativePath => {
  const filePath = path.resolve(relativePath);
  if (!fs.existsSync(filePath)) return;

  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Substituir foto de estrutura genérica pela foto real da clínica
  const oldStructureImage = 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop';
  const newStructureImage = relativePath.includes('template-ci-odontologia') 
    ? '/template-ci-odontologia/clinica_real.png' 
    : '/ci-odontologia/clinica_real.png';

  html = html.replaceAll(oldStructureImage, newStructureImage);

  // 2. Dar mais destaque ao Dr. Renato Vicente Ferreira substituindo o bloco do Corpo Clínico Highlight
  // Vamos buscar o bloco antigo do Dr. Renato
  const startMarker = '<!-- Corpo Clínico Highlight -->';
  const endMarker = '</div>\n                    </div>\n                    \n                    <!-- Galeria de Estrutura -->';
  
  // Como o endMarker pode variar de espaçamento ou quebra de linha, vamos buscar um trecho bem específico
  const oldDoctorBlockRegex = /<!-- Corpo Clínico Highlight -->[\s\S]*?<!-- Galeria de Estrutura -->/;

  const newDoctorBlock = `<!-- Corpo Clínico Highlight de Alto Destaque -->
                    <div class="bg-ciNavy-900 border border-ciGold-500/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden mb-8 mt-12 text-left">
                        <div class="absolute top-0 right-0 w-32 h-32 bg-ciGold-500/5 rounded-full blur-2xl"></div>
                        <div class="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                            <div class="relative shrink-0">
                                <div class="absolute inset-0 bg-ciGold-500/10 rounded-2xl rotate-6 transform scale-105"></div>
                                <img src="https://cursoimplantes.com.br/wp-content/uploads/2023/11/foto-dr-renato.png" alt="Dr. Renato Vicente Ferreira" class="relative z-10 w-32 h-36 rounded-2xl object-cover shadow-xl border-2 border-ciGold-500">
                            </div>
                            <div class="text-center md:text-left">
                                <span class="bg-ciGold-500/10 text-ciGold-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 inline-block">Responsável Clínico</span>
                                <h4 class="font-serif font-bold text-white text-2xl mb-1">Dr. Renato Vicente Ferreira</h4>
                                <p class="text-xs text-ciGold-500 font-mono tracking-wider uppercase mb-4">CRO-SP 42.595 • Responsável Técnico</p>
                                <p class="text-sm text-slate-300 leading-relaxed mb-4">
                                    Mestre em Osteometabolismo pela UNIFESP, especialista em Prótese Dentária pela UNESP Araraquara e especialista em Cirurgias Avançadas em Implantodontia pela Fundecto USP. Com mais de 30 anos de rigor científico e experiência acadêmica, o Dr. Renato lidera o corpo clínico da C.I. Odontologia promovendo tratamentos de reabilitação oral e implantes guiados 3D com precisão milimétrica.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Galeria de Estrutura -->`;

  if (oldDoctorBlockRegex.test(html)) {
    html = html.replace(oldDoctorBlockRegex, newDoctorBlock);
    console.log(`[DOCTOR PATCH] Destaque aplicado em ${relativePath}`);
  } else {
    // Caso o regex falhe por causa de quebras de linha diferentes, tentamos com menos restrição no final
    const altRegex = /<!-- Corpo Clínico Highlight -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<!-- Galeria de Estrutura -->/;
    if (altRegex.test(html)) {
      html = html.replace(altRegex, newDoctorBlock);
      console.log(`[DOCTOR PATCH] Destaque (alt regex) aplicado em ${relativePath}`);
    } else {
      console.log(`[DOCTOR PATCH] Bloco do doutor não localizado em ${relativePath}`);
    }
  }

  fs.writeFileSync(filePath, html, 'utf8');
});

console.log("[DOCTOR PATCH] Concluído!");
