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
  if (!fs.existsSync(filePath)) {
    console.log(`[PATCH] Arquivo não encontrado: ${relativePath}`);
    return;
  }

  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Substituir foto genérica do Unsplash pela foto real do Dr. Renato
  const oldPhoto = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=600';
  const newPhoto = 'https://cursoimplantes.com.br/wp-content/uploads/2023/11/foto-dr-renato.png';
  if (html.includes(oldPhoto)) {
    html = html.replaceAll(oldPhoto, newPhoto);
    console.log(`[PATCH] Foto substituída em ${relativePath}`);
  }

  // 2. Isolar as seções comerciais para aplicar a cor de prospecção do ESCOM Studio (#07dc40)
  // Vamos fazer a substituição sutil no bloco final do dossiê e da proposta comercial
  const splitMarker = '<!-- SEÇÃO DO DOSSIÊ COMERCIAL (PDF/ESTRATÉGIA) -->';
  const parts = html.split(splitMarker);
  if (parts.length === 2) {
    let commercialSection = parts[1];

    // Aplicar a cor verde de prospecção do ESCOM Studio nas classes comerciais
    commercialSection = commercialSection
      // Classes do dossiê
      .replaceAll('text-ciGold-500 font-mono', 'text-[#07dc40] font-mono')
      .replaceAll('border-t-2 border-ciGold-500/20', 'border-t-2 border-zinc-800')
      .replaceAll('border-2 border-ciGold-500/30', 'border-2 border-[#07dc40]/30')
      .replaceAll('hover:border-ciGold-500', 'hover:border-[#07dc40]')
      .replaceAll('text-ciGold-500 text-xl', 'text-[#07dc40] text-xl')
      // Classes da proposta
      .replaceAll('border-t-8 border-ciGold-500', 'border-t-8 border-[#07dc40]')
      .replaceAll('bg-ciGold-500/10 text-ciGold-500', 'bg-[#07dc40]/10 text-[#07dc40]')
      .replaceAll('border-ciGold-500/20', 'border-stone-800')
      .replaceAll('bg-ciGold-500 text-brand-primary', 'bg-[#07dc40] text-black')
      .replaceAll('bg-ciNavy-950 border border-ciGold-500/20', 'bg-stone-950/85 border border-stone-800')
      .replaceAll('text-ciGold-500 text-lg', 'text-[#07dc40] text-lg')
      .replaceAll('text-ciGold-500 tracking-tighter', 'text-[#07dc40] tracking-tighter')
      .replaceAll('text-ciGold-500 text-3xl', 'text-[#07dc40] text-3xl')
      // Botão aceitar proposta
      .replaceAll('bg-[#0096C7] hover:bg-[#00b5ab] text-white', 'bg-[#07dc40] hover:bg-[#00b5ab] text-black')
      .replaceAll('shadow-[#0096C7]/30', 'shadow-[#07dc40]/30')
      // Upsells e blocos adicionais
      .replaceAll('bg-ciGold-500 text-brand-primary text-xs font-bold px-4 py-1.5 rounded-full', 'bg-[#07dc40] text-black text-xs font-bold px-4 py-1.5 rounded-full')
      .replaceAll('bg-ciGold-500 rounded-xl', 'bg-[#07dc40] rounded-xl')
      .replaceAll('hover:border-ciGold-500/50 hover:shadow-[0_0_30px_rgba(197,160,89,0.15)]', 'hover:border-[#07dc40]/50 hover:shadow-[0_0_30px_rgba(7,220,64,0.15)]')
      .replaceAll('text-ciGold-500 font-bold uppercase tracking-wider mt-4 block', 'text-[#07dc40] font-bold uppercase tracking-wider mt-4 block');

    html = parts[0] + splitMarker + commercialSection;
    console.log(`[PATCH] Seções de prospecção comerciais alteradas para verde em ${relativePath}`);
  }

  fs.writeFileSync(filePath, html, 'utf8');
});

console.log("[PATCH] Concluído!");
