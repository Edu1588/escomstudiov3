import fs from 'fs/promises';
import path from 'path';
import puppeteer from 'puppeteer';

async function generateDossie10Pages(slug, config) {
  const { color, title, niche, city, ticket, revenue, hasSite, siteUrl,
          diagItems, competitors, colorPalette, typography, improvements,
          solutionBlocks, conversionCurrent, conversionNew, patientsOld, patientsNew,
          ctaWhatsapp, ctaMessage } = config;

  const dossieFile = path.resolve(`./public/${slug}/dossie.html`);
  const pdfFile = path.resolve(`./public/${slug}/dossie.pdf`);

  // --- Build diagnostic cards ---
  let diagHTML = '';
  diagItems.forEach((d, i) => {
    diagHTML += `
    <div class="bg-slate-50 border border-zinc-200 p-5 rounded-xl flex gap-4 mb-4 shadow-sm">
      <div class="w-10 h-10 rounded-full bg-red-500/10 text-red-600 flex items-center justify-center flex-shrink-0 text-lg border border-red-500/20">
        <i class="fa-solid fa-triangle-exclamation"></i>
      </div>
      <div>
        <h4 class="text-zinc-900 font-bold mb-1 text-sm">${d.title}</h4>
        <p class="text-xs text-zinc-600 leading-relaxed">${d.desc}</p>
      </div>
    </div>`;
  });

  // --- Build competitor table rows ---
  let compRows = '';
  competitors.forEach(c => {
    compRows += `
    <tr class="border-b border-zinc-200">
      <td class="py-4 px-3 text-zinc-900 text-sm font-medium">${c.criteria}</td>
      <td class="py-4 px-3 text-center text-green-600 text-sm font-semibold">${c.leaders}</td>
      <td class="py-4 px-3 text-center text-red-600 text-sm font-semibold">${c.yours}</td>
    </tr>`;
  });

  // --- Build color palette swatches ---
  let colorSwatches = '';
  colorPalette.forEach(c => {
    colorSwatches += `
    <div class="flex items-center gap-4 mb-4">
      <div class="w-14 h-14 rounded-xl shadow-md flex-shrink-0" style="background:${c.hex}; border: 1px solid #e4e4e7;"></div>
      <div>
        <p class="text-zinc-900 font-bold text-sm">${c.name}</p>
        <p class="text-zinc-500 text-xs">HEX: ${c.hex} · ${c.usage}</p>
      </div>
    </div>`;
  });

  // --- Build improvements list ---
  let improvHTML = '';
  improvements.forEach(imp => {
    const badgeColor = imp.impact === 'Alto' ? 'bg-red-500/10 text-red-600 border-red-500/20' :
                       imp.impact === 'Médio' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' :
                       'bg-blue-500/10 text-blue-600 border-blue-500/20';
    improvHTML += `
    <div class="flex items-start gap-4 mb-4 bg-zinc-50 p-4 rounded-lg border border-zinc-200">
      <span class="text-xs font-bold px-2 py-0.5 rounded border ${badgeColor} flex-shrink-0 mt-0.5">${imp.impact}</span>
      <div>
        <h4 class="text-zinc-900 font-bold text-sm mb-1">${imp.title}</h4>
        <p class="text-zinc-500 text-xs leading-relaxed">${imp.desc}</p>
      </div>
    </div>`;
  });

  // --- Build solution blocks ---
  let solHTML = '';
  solutionBlocks.forEach(s => {
    solHTML += `
    <div class="border border-zinc-200 bg-zinc-50 p-5 rounded-xl relative overflow-hidden shadow-sm">
      <div class="absolute top-0 left-0 w-1 h-full" style="background:${color}"></div>
      <i class="${s.icon} text-lg mb-3" style="color:${color}"></i>
      <h4 class="text-zinc-900 font-bold mb-2 text-sm">${s.title}</h4>
      <p class="text-[11px] text-zinc-500 leading-relaxed">${s.desc}</p>
    </div>`;
  });

  // --- Conditional page 3 content ---
  const page3Content = hasSite ? `
    <div class="border-b border-zinc-200 pb-5 mb-8 mt-8">
      <span class="text-theme text-[10px] tracking-[0.3em] uppercase font-bold">Fase 02 • Auditoria do Site Atual</span>
      <h2 class="text-3xl font-serif mt-3 text-zinc-900">Diagnóstico do Site: ${siteUrl || title}</h2>
    </div>
    <p class="text-sm text-zinc-600 leading-relaxed mb-8">
      Realizamos um escaneamento completo do seu site atual e identificamos ${diagItems.length} pontos críticos que estão afastando pacientes de alto ticket e comprometendo sua taxa de conversão.
    </p>
    <div>${diagHTML}</div>
  ` : `
    <div class="border-b border-zinc-200 pb-5 mb-8 mt-8">
      <span class="text-theme text-[10px] tracking-[0.3em] uppercase font-bold">Fase 02 • Ausência Digital</span>
      <h2 class="text-3xl font-serif mt-3 text-zinc-900">O Custo de Não Ter um Site Profissional</h2>
    </div>
    <p class="text-sm text-zinc-600 leading-relaxed mb-8">
      Hoje, ${title} não possui um site estruturado. Isso representa uma perda real e mensurável de faturamento, já que seus concorrentes estão captando 100% da demanda digital do seu mercado.
    </p>
    <div>${diagHTML}</div>
  `;

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Dossiê Confidencial - ${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    body { background:#f4f4f5; color:#3f3f46; font-family:'Inter',sans-serif; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    .page { width:210mm; height:297mm; padding:18mm; margin:30px auto; background:#ffffff; border:1px solid #e4e4e7; position:relative; overflow:hidden; page-break-after:always; page-break-inside:avoid; display:flex; flex-direction:column; justify-content:between; }
    @media print { body { background:#ffffff !important; } .page { margin:0 !important; border:none !important; width:210mm !important; height:297mm !important; padding:14mm !important; background:#ffffff !important; color:#3f3f46 !important; } }
    .font-serif { font-family:'Playfair Display',serif; }
    .text-theme { color:${color}; }
    .bg-theme { background-color:${color}; }
    .bg-grid { background-size:40px 40px; background-image:linear-gradient(to right,rgba(0,0,0,.015) 1px,transparent 1px),linear-gradient(to bottom,rgba(0,0,0,.015) 1px,transparent 1px); }
    .glow { position:absolute; width:500px; height:500px; background:radial-gradient(circle,${color}08 0%,transparent 70%); z-index:0; pointer-events:none; }
    .z { position:relative; z-index:10; display:flex; flex-direction:column; justify-content:between; height:100%; }
    .decor-line { position:absolute; top:0; left:0; width:100%; height:6px; background:${color}; z-index:20; }
  </style>
</head>
<body>

<!-- ═══════════════════════════════════════════════ -->
<!-- PÁGINA 1: CAPA EDITORIAL CLEAN                 -->
<!-- ═══════════════════════════════════════════════ -->
<div class="page bg-grid">
  <div class="decor-line"></div>
  <div class="glow" style="top:-200px;right:-200px"></div>
  <div class="z py-4">
    <div class="text-[9px] tracking-[0.4em] text-zinc-400 uppercase flex items-center gap-2 mb-6">
      <i class="fa-solid fa-lock text-theme"></i> Documento Confidencial — Acesso Restrito
    </div>
    
    <div class="space-y-4">
      <p class="text-theme uppercase tracking-[0.4em] text-[10px] font-bold">Inteligência Competitiva & Auditoria UX</p>
      <h1 class="text-zinc-900 font-serif font-black text-5xl leading-tight">Dossiê Estratégico<br><span class="italic text-zinc-500 font-light text-4xl">${title}</span></h1>
      <div class="w-16 h-1 bg-brand-accent" style="background:${color}"></div>
    </div>

    <!-- Imagem em Arco Premium de Odontologia -->
    <div class="my-6 relative overflow-hidden rounded-2xl border border-zinc-200 shadow-md h-[110mm]">
      <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop');"></div>
    </div>

    <div class="flex justify-between items-end border-t border-zinc-200 pt-6">
      <div>
        <p class="text-zinc-400 text-[9px] uppercase tracking-widest mb-1">Elaborado por</p>
        <p class="text-zinc-800 font-bold tracking-wider text-sm">ESCOM STUDIO</p>
        <p class="text-zinc-500 text-[10px]">Inteligência Digital para Negócios de Alto Valor</p>
      </div>
      <p class="text-zinc-400 text-[10px] max-w-[200px] leading-relaxed text-right">
        Estudo estratégico para reabilitação e captação estética premium.
      </p>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════ -->
<!-- PÁGINA 2: ANÁLISE DO NEGÓCIO                   -->
<!-- ═══════════════════════════════════════════════ -->
<div class="page bg-grid">
  <div class="decor-line"></div>
  <div class="glow" style="bottom:-200px;left:-200px"></div>
  <div class="z">
    <div class="border-b border-zinc-200 pb-5 mb-8 mt-8">
      <span class="text-theme text-[10px] tracking-[0.3em] uppercase font-bold">Fase 01 • Inteligência de Mercado</span>
      <h2 class="text-3xl font-serif mt-3 text-zinc-900">Análise do Negócio e Oportunidade</h2>
    </div>
    <p class="text-sm text-zinc-600 leading-relaxed mb-8">
      Mapeamos o cenário real do mercado onde a ${title} opera. Esses dados formam a base do diagnóstico e da projeção de receita deste estudo.
    </p>

    <div class="grid grid-cols-2 gap-4 mb-8">
      <div class="bg-zinc-50 border border-zinc-200 p-5 rounded-xl text-center">
        <i class="fa-solid fa-bullseye text-theme text-xl mb-3"></i>
        <p class="text-zinc-400 text-[10px] uppercase mb-1">Segmento</p>
        <p class="text-zinc-800 font-bold text-sm">${niche}</p>
      </div>
      <div class="bg-zinc-50 border border-zinc-200 p-5 rounded-xl text-center">
        <i class="fa-solid fa-location-dot text-theme text-xl mb-3"></i>
        <p class="text-zinc-400 text-[10px] uppercase mb-1">Região</p>
        <p class="text-zinc-800 font-bold text-sm">${city}</p>
      </div>
      <div class="bg-zinc-50 border border-zinc-200 p-5 rounded-xl text-center">
        <i class="fa-solid fa-money-bill-trend-up text-theme text-xl mb-3"></i>
        <p class="text-zinc-400 text-[10px] uppercase mb-1">Ticket Médio do Mercado</p>
        <p class="text-zinc-800 font-bold text-lg">${ticket}</p>
      </div>
      <div class="bg-zinc-50 border border-zinc-200 p-5 rounded-xl text-center">
        <i class="fa-solid fa-users text-theme text-xl mb-3"></i>
        <p class="text-zinc-400 text-[10px] uppercase mb-1">Buscas Mensais (Google)</p>
        <p class="text-zinc-800 font-bold text-lg">${config.monthlySearches || '12.400+'}</p>
      </div>
    </div>

    <div class="bg-zinc-50 border border-zinc-200 p-6 rounded-xl flex gap-6 items-center">
      <div class="w-1/3 h-28 rounded-xl overflow-hidden shadow-sm border border-zinc-200">
        <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=300" className="w-full h-full object-cover" />
      </div>
      <div class="w-2/3">
        <h3 class="text-zinc-900 font-bold mb-2 text-sm flex items-center gap-2"><i class="fa-solid fa-chart-line text-theme"></i> Contexto de Mercado</h3>
        <p class="text-[11px] text-zinc-600 leading-relaxed mb-2">${config.marketContext}</p>
        <p class="text-[11px] text-zinc-600 leading-relaxed">${config.marketContext2}</p>
      </div>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════ -->
<!-- PÁGINA 3: DIAGNÓSTICO DO SITE / AUSÊNCIA       -->
<!-- ═══════════════════════════════════════════════ -->
<div class="page bg-grid">
  <div class="decor-line"></div>
  <div class="z">
    ${page3Content}
  </div>
</div>

<!-- ═══════════════════════════════════════════════ -->
<!-- PÁGINA 4: ANÁLISE VISUAL — PALETA DE CORES     -->
<!-- ═══════════════════════════════════════════════ -->
<div class="page bg-grid">
  <div class="decor-line"></div>
  <div class="glow" style="top:-150px;left:50%;transform:translateX(-50%)"></div>
  <div class="z">
    <div class="border-b border-zinc-200 pb-5 mb-8 mt-8">
      <span class="text-theme text-[10px] tracking-[0.3em] uppercase font-bold">Fase 03 • Identidade Visual</span>
      <h2 class="text-3xl font-serif mt-3 text-zinc-900">Paleta de Cores Estratégica</h2>
    </div>
    <p class="text-sm text-zinc-600 leading-relaxed mb-8">
      As cores não são apenas escolhas visuais — elas moldam subconscientemente a percepção de valor. Definimos um ecossistema cromático sofisticado voltado ao público de ${niche}.
    </p>
    <div class="grid grid-cols-2 gap-6 mb-8">
      ${colorSwatches}
    </div>
    <div class="bg-zinc-50 border border-zinc-200 p-5 rounded-xl">
      <h4 class="text-zinc-900 font-bold text-sm mb-2"><i class="fa-solid fa-palette text-theme mr-2"></i> Racional Psicocromático</h4>
      <p class="text-xs text-zinc-600 leading-relaxed">${config.colorRationale}</p>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════ -->
<!-- PÁGINA 5: ANÁLISE VISUAL — TIPOGRAFIA          -->
<!-- ═══════════════════════════════════════════════ -->
<div class="page bg-grid">
  <div class="decor-line"></div>
  <div class="z">
    <div class="border-b border-zinc-200 pb-5 mb-8 mt-8">
      <span class="text-theme text-[10px] tracking-[0.3em] uppercase font-bold">Fase 03 (cont.) • Tipografia</span>
      <h2 class="text-3xl font-serif mt-3 text-zinc-900">Sistema Tipográfico</h2>
    </div>
    <p class="text-sm text-zinc-600 leading-relaxed mb-8">
      A tipografia estabelece o tom de voz da clínica. Selecionamos fontes premium que comunicam ${config.typoPersonality}.
    </p>

    ${typography.map(t => `
    <div class="bg-zinc-50 border border-zinc-200 p-6 rounded-xl mb-6 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <div>
          <p class="text-zinc-400 text-[10px] uppercase tracking-widest">${t.role}</p>
          <p class="text-zinc-900 text-2xl font-bold font-serif" style="font-family:'${t.font}',sans-serif">${t.font}</p>
        </div>
        <span class="text-theme text-xs font-bold border border-theme/20 px-3 py-1 rounded-full bg-theme/5">${t.weight}</span>
      </div>
      <p class="text-2xl text-zinc-800 mb-3" style="font-family:'${t.font}',sans-serif">${t.sample}</p>
      <p class="text-xs text-zinc-500">${t.reason}</p>
    </div>
    `).join('')}
  </div>
</div>

<!-- ═══════════════════════════════════════════════ -->
<!-- PÁGINA 6: BENCHMARK COMPETITIVO                -->
<!-- ═══════════════════════════════════════════════ -->
<div class="page bg-grid">
  <div class="decor-line"></div>
  <div class="z">
    <div class="border-b border-zinc-200 pb-5 mb-8 mt-8">
      <span class="text-theme text-[10px] tracking-[0.3em] uppercase font-bold">Fase 04 • Inteligência Competitiva</span>
      <h2 class="text-3xl font-serif mt-3 text-zinc-900">Benchmark Local — ${city}</h2>
    </div>
    <p class="text-sm text-zinc-600 leading-relaxed mb-8">
      Comparamos o posicionamento digital da sua marca frente aos líderes da região. A análise revela um gargalo de tráfego qualificado.
    </p>

    <table class="w-full text-left border-collapse mb-8">
      <thead>
        <tr class="border-b border-zinc-200 text-[10px] uppercase tracking-wider text-zinc-400">
          <th class="py-3 px-3 font-normal">Critério</th>
          <th class="py-3 px-3 font-normal text-center">Líderes de Mercado</th>
          <th class="py-3 px-3 font-normal text-center text-red-500">Você Hoje</th>
        </tr>
      </thead>
      <tbody>${compRows}</tbody>
    </table>

    <div class="bg-zinc-50 border border-zinc-200 p-5 rounded-xl text-center">
      <p class="text-theme font-bold mb-1 text-sm">Oportunidade Estratégica</p>
      <p class="text-xs text-zinc-600">${config.compConclusion}</p>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════ -->
<!-- PÁGINA 7: PONTOS A MELHORAR / FAZER            -->
<!-- ═══════════════════════════════════════════════ -->
<div class="page bg-grid">
  <div class="decor-line"></div>
  <div class="z">
    <div class="border-b border-zinc-200 pb-5 mb-8 mt-8">
      <span class="text-theme text-[10px] tracking-[0.3em] uppercase font-bold">Fase 05 • Plano de Ação</span>
      <h2 class="text-3xl font-serif mt-3 text-zinc-900">Pontos a Melhorar / Implementar</h2>
    </div>
    <p class="text-sm text-zinc-600 leading-relaxed mb-6">
      Mapeamento e priorização de melhorias com foco imediato no aumento de captação e redução de bounce-rate.
    </p>
    ${improvHTML}
  </div>
</div>

<!-- ═══════════════════════════════════════════════ -->
<!-- PÁGINA 8: ARQUITETURA DA SOLUÇÃO               -->
<!-- ═══════════════════════════════════════════════ -->
<div class="page bg-grid">
  <div class="decor-line"></div>
  <div class="z">
    <div class="border-b border-zinc-200 pb-5 mb-8 mt-8">
      <span class="text-theme text-[10px] tracking-[0.3em] uppercase font-bold">Fase 06 • A Nova Infraestrutura</span>
      <h2 class="text-3xl font-serif mt-3 text-zinc-900">Arquitetura de Conversão Proposta</h2>
    </div>
    <p class="text-sm text-zinc-600 leading-relaxed mb-8">
      Modelamos uma plataforma premium baseada em seis pilares técnicos para blindar a conversão de anúncios em contatos comerciais.
    </p>
    <div class="grid grid-cols-2 gap-4">
      ${solHTML}
    </div>
    <div class="mt-8 bg-zinc-50 border border-zinc-200 rounded-xl p-5 text-center flex items-center justify-center gap-4">
      <i class="fa-solid fa-lock text-zinc-400 text-xl"></i>
      <p class="text-[10px] text-zinc-600 text-left leading-relaxed">
        Plataforma hospedada em infraestrutura VPS, com SSL ativo e CDN de alta performance, preparada para grandes picos de tráfego.
      </p>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════ -->
<!-- PÁGINA 9: PROJEÇÃO DE FATURAMENTO E ROI        -->
<!-- ═══════════════════════════════════════════════ -->
<div class="page bg-grid">
  <div class="decor-line"></div>
  <div class="glow" style="top:-200px;right:-200px"></div>
  <div class="z">
    <div class="border-b border-zinc-200 pb-5 mb-8 mt-8">
      <span class="text-theme text-[10px] tracking-[0.3em] uppercase font-bold">Fase 07 • Impacto Financeiro</span>
      <h2 class="text-3xl font-serif mt-3 text-zinc-900">Projeção Conservadora de ROI</h2>
    </div>
    <p class="text-sm text-zinc-600 leading-relaxed mb-6">
      Substituir o site genérico por uma máquina de vendas não é custo, é um investimento de retorno previsível.
    </p>

    <div class="bg-slate-50 border border-zinc-200 p-6 rounded-xl mb-6 shadow-sm">
      <h3 class="text-zinc-900 font-bold mb-4 text-center text-sm">Cenário Esperado: 1000 Visitantes Únicos/mês</h3>
      <div class="flex items-end justify-around h-40 border-b border-zinc-200 pb-2 relative">
        <div class="absolute top-0 w-full border-t border-zinc-100 border-dashed"></div>
        <div class="absolute top-1/2 w-full border-t border-zinc-100 border-dashed"></div>
        <div class="flex flex-col items-center gap-2 z-10">
          <span class="text-[10px] text-zinc-500">${conversionCurrent} (Atual)</span>
          <div class="w-14 h-8 bg-red-500/20 rounded-t border-t-2 border-red-500"></div>
          <span class="text-xs font-bold text-zinc-800 mt-2">${patientsOld} Pacientes</span>
        </div>
        <div class="flex flex-col items-center gap-2 z-10">
          <span class="text-[10px] text-theme font-bold">${conversionNew} (Novo Site)</span>
          <div class="w-14 h-32 rounded-t border-t-2 relative" style="background:${color}22;border-color:${color}">
            <div class="absolute -top-3 -right-3 bg-white text-zinc-900 text-[8px] font-bold px-2 py-0.5 rounded-full border border-zinc-200 shadow-sm">+700%</div>
          </div>
          <span class="text-xs font-bold text-zinc-800 mt-2">${patientsNew} Pacientes</span>
        </div>
      </div>
      <p class="text-center text-[9px] text-zinc-400 mt-3 uppercase tracking-widest font-mono">Taxa de Conversão do Funil</p>
    </div>

    <div class="grid grid-cols-2 gap-4 mb-6">
      <div class="bg-zinc-50 border border-zinc-200 p-4 rounded-xl text-center shadow-sm">
        <p class="text-zinc-400 text-[10px] uppercase mb-1">Ticket Médio Estimado</p>
        <p class="text-2xl font-bold text-zinc-900">${ticket}</p>
      </div>
      <div class="bg-zinc-50 border rounded-xl text-center p-4 shadow-sm" style="border-color:${color}55;">
        <p class="text-theme text-[10px] uppercase mb-1 font-bold">Potencial Faturamento Mensal</p>
        <p class="text-2xl font-bold text-zinc-900">${revenue}</p>
      </div>
    </div>
    <div class="text-center bg-zinc-50 border border-zinc-200 p-4 rounded-xl">
      <p class="text-[10px] text-zinc-500 leading-relaxed"><i class="fa-solid fa-info-circle text-theme mr-1"></i> Projeção baseada em taxas de conversão de benchmarks locais do mesmo segmento.</p>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════ -->
<!-- PÁGINA 10: CTA — VAMOS CONVERSAR?              -->
<!-- ═══════════════════════════════════════════════ -->
<div class="page bg-grid flex flex-col justify-center items-center text-center">
  <div class="decor-line"></div>
  <div class="glow" style="top:50%;left:50%;transform:translate(-50%,-50%)"></div>
  <div class="z max-w-md my-auto">
    <div class="w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-6 mx-auto" style="background:${color}15;color:${color};border:1px solid ${color}33">
      <i class="fa-brands fa-whatsapp"></i>
    </div>
    <p class="text-theme uppercase tracking-[0.3em] text-[10px] font-bold mb-3">Próximo Passo</p>
    <h2 class="text-3xl font-serif mb-4 text-zinc-900">Agendar Apresentação</h2>
    <div class="w-12 h-[2px] bg-zinc-200 mx-auto mb-6"></div>
    <p class="text-zinc-600 text-xs leading-relaxed mb-8">
      ${ctaMessage}
    </p>

    <div class="bg-slate-50 border border-zinc-200 rounded-2xl p-6 mb-6 w-full max-w-xs mx-auto shadow-sm">
      <p class="text-zinc-500 text-[10px] uppercase tracking-wider mb-2">WhatsApp de Contato</p>
      <div class="text-xl font-bold text-zinc-800 mb-1">${ctaWhatsapp}</div>
      <p class="text-zinc-400 text-[9px]">Fale diretamente com nossa equipe de vendas</p>
    </div>

    <div class="bg-[#25D366] text-white font-bold px-6 py-3.5 rounded-xl shadow-md inline-flex items-center gap-2 text-xs uppercase tracking-wider transition-all hover:scale-105">
      <i class="fa-brands fa-whatsapp text-sm"></i> Iniciar Conversa no WhatsApp
    </div>

    <div class="mt-12 pt-6 border-t border-zinc-200 w-full">
      <p class="text-[9px] text-zinc-400 uppercase tracking-widest mb-1">Estudo conduzido por</p>
      <p class="text-zinc-900 font-bold tracking-wider text-sm">ESCOM STUDIO</p>
      <p class="text-zinc-400 text-[9px] mt-0.5">Inteligência Digital de Alta Conversão</p>
    </div>
  </div>
</div>

</body>
</html>`;

  await fs.writeFile(dossieFile, html);

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.emulateMediaType('print');
  await page.goto('file://' + dossieFile, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.pdf({
    path: pdfFile,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' }
  });
  await browser.close();

  console.log(`Generated 10-PAGE dossie for ${slug}`);
}

async function generateDossie10PagesEn(slug, config) {
  const { color, title, niche, city, ticket, revenue, hasSite, siteUrl,
          diagItems, competitors, colorPalette, typography, improvements,
          solutionBlocks, conversionCurrent, conversionNew, patientsOld, patientsNew,
          ctaWhatsapp, ctaMessage } = config;

  const dossieFile = path.resolve(`./public/${slug}/dossie.html`);
  const pdfFile = path.resolve(`./public/${slug}/dossie.pdf`);

  // --- Build diagnostic cards ---
  let diagHTML = '';
  diagItems.forEach((d, i) => {
    diagHTML += `
    <div class="bg-slate-50 border border-zinc-200 p-5 rounded-xl flex gap-4 mb-4 shadow-sm">
      <div class="w-10 h-10 rounded-full bg-red-500/10 text-red-600 flex items-center justify-center flex-shrink-0 text-lg border border-red-500/20">
        <i class="fa-solid fa-triangle-exclamation"></i>
      </div>
      <div>
        <h4 class="text-zinc-900 font-bold mb-1 text-sm">${d.title}</h4>
        <p class="text-xs text-zinc-600 leading-relaxed">${d.desc}</p>
      </div>
    </div>`;
  });

  // --- Build competitor table rows ---
  let compRows = '';
  competitors.forEach(c => {
    compRows += `
    <tr class="border-b border-zinc-200">
      <td class="py-4 px-3 text-zinc-900 text-sm font-medium">${c.criteria}</td>
      <td class="py-4 px-3 text-center text-green-600 text-sm font-semibold">${c.leaders}</td>
      <td class="py-4 px-3 text-center text-red-600 text-sm font-semibold">${c.yours}</td>
    </tr>`;
  });

  // --- Build color palette swatches ---
  let colorSwatches = '';
  colorPalette.forEach(c => {
    colorSwatches += `
    <div class="flex items-center gap-4 mb-4">
      <div class="w-14 h-14 rounded-xl shadow-md flex-shrink-0" style="background:${c.hex}; border: 1px solid #e4e4e7;"></div>
      <div>
        <p class="text-zinc-900 font-bold text-sm">${c.name}</p>
        <p class="text-zinc-500 text-xs">HEX: ${c.hex} · ${c.usage}</p>
      </div>
    </div>`;
  });

  // --- Build improvements list ---
  let improvHTML = '';
  improvements.forEach(imp => {
    const badgeColor = imp.impact === 'High' || imp.impact === 'Alto' ? 'bg-red-500/10 text-red-600 border-red-500/20' :
                       imp.impact === 'Medium' || imp.impact === 'Médio' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' :
                       'bg-blue-500/10 text-blue-600 border-blue-500/20';
    improvHTML += `
    <div class="flex items-start gap-4 mb-4 bg-zinc-50 p-4 rounded-lg border border-zinc-200">
      <span class="text-xs font-bold px-2 py-0.5 rounded border ${badgeColor} flex-shrink-0 mt-0.5">${imp.impact}</span>
      <div>
        <h4 class="text-zinc-900 font-bold text-sm mb-1">${imp.title}</h4>
        <p class="text-zinc-500 text-xs leading-relaxed">${imp.desc}</p>
      </div>
    </div>`;
  });

  // --- Build solution blocks ---
  let solHTML = '';
  solutionBlocks.forEach(s => {
    solHTML += `
    <div class="border border-zinc-200 bg-zinc-50 p-5 rounded-xl relative overflow-hidden shadow-sm">
      <div class="absolute top-0 left-0 w-1 h-full" style="background:${color}"></div>
      <i class="${s.icon} text-lg mb-3" style="color:${color}"></i>
      <h4 class="text-zinc-900 font-bold mb-2 text-sm">${s.title}</h4>
      <p class="text-[11px] text-zinc-500 leading-relaxed">${s.desc}</p>
    </div>`;
  });

  // --- Conditional page 3 content ---
  const page3Content = hasSite ? `
    <div class="border-b border-zinc-200 pb-5 mb-8 mt-8">
      <span class="text-theme text-[10px] tracking-[0.3em] uppercase font-bold">Phase 02 • Current Website Audit</span>
      <h2 class="text-3xl font-serif mt-3 text-zinc-900">Clinic Website Diagnostics: ${siteUrl || title}</h2>
    </div>
    <p class="text-sm text-zinc-600 leading-relaxed mb-8">
      We ran a comprehensive audit of your current online setup and identified ${diagItems.length} critical optimization gaps that are actively deterring high-ticket patients and draining your conversion potential.
    </p>
    <div>${diagHTML}</div>
  ` : `
    <div class="border-b border-zinc-200 pb-5 mb-8 mt-8">
      <span class="text-theme text-[10px] tracking-[0.3em] uppercase font-bold">Phase 02 • Digital Absence Cost</span>
      <h2 class="text-3xl font-serif mt-3 text-zinc-900">The Hard Cost of Lacking a Premium Site</h2>
    </div>
    <p class="text-sm text-zinc-600 leading-relaxed mb-8">
      Currently, ${title} has no structured landing platform. This represents a direct, measurable loss of clinic revenue as competitors absorb 100% of the digital demand in your geographical area.
    </p>
    <div>${diagHTML}</div>
  `;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Confidential Dossier - ${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    body { background:#f4f4f5; color:#3f3f46; font-family:'Inter',sans-serif; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    .page { width:210mm; height:297mm; padding:18mm; margin:30px auto; background:#ffffff; border:1px solid #e4e4e7; position:relative; overflow:hidden; page-break-after:always; page-break-inside:avoid; display:flex; flex-direction:column; justify-content:between; }
    @media print { body { background:#ffffff !important; } .page { margin:0 !important; border:none !important; width:210mm !important; height:297mm !important; padding:14mm !important; background:#ffffff !important; color:#3f3f46 !important; } }
    .font-serif { font-family:'Playfair Display',serif; }
    .text-theme { color:${color}; }
    .bg-theme { background-color:${color}; }
    .bg-grid { background-size:40px 40px; background-image:linear-gradient(to right,rgba(0,0,0,.015) 1px,transparent 1px),linear-gradient(to bottom,rgba(0,0,0,.015) 1px,transparent 1px); }
    .glow { position:absolute; width:500px; height:500px; background:radial-gradient(circle,${color}08 0%,transparent 70%); z-index:0; pointer-events:none; }
    .z { position:relative; z-index:10; display:flex; flex-direction:column; justify-content:between; height:100%; }
    .decor-line { position:absolute; top:0; left:0; width:100%; height:6px; background:${color}; z-index:20; }
  </style>
</head>
<body>

<!-- ═══════════════════════════════════════════════ -->
<!-- PÁGINA 1: CAPA EDITORIAL CLEAN                 -->
<!-- ═══════════════════════════════════════════════ -->
<div class="page bg-grid">
  <div class="decor-line"></div>
  <div class="glow" style="top:-200px;right:-200px"></div>
  <div class="z py-4">
    <div class="text-[9px] tracking-[0.4em] text-zinc-400 uppercase flex items-center gap-2 mb-6">
      <i class="fa-solid fa-lock text-theme"></i> Confidential Document — Restricted Access
    </div>
    
    <div class="space-y-4">
      <p class="text-theme uppercase tracking-[0.4em] text-[10px] font-bold">Competitive Intelligence & UX Audit</p>
      <h1 class="text-zinc-900 font-serif font-black text-5xl leading-tight">Strategic Dossier<br><span class="italic text-zinc-500 font-light text-4xl">${title}</span></h1>
      <div class="w-16 h-1 bg-brand-accent" style="background:${color}"></div>
    </div>

    <!-- Imagem em Arco Premium de Quiropraxia/Reabilitação -->
    <div class="my-6 relative overflow-hidden rounded-2xl border border-zinc-200 shadow-md h-[110mm]">
      <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1597764690523-15bea4c581c9?q=80&w=2070');"></div>
    </div>

    <div class="flex justify-between items-end border-t border-zinc-200 pt-6">
      <div>
        <p class="text-zinc-400 text-[9px] uppercase tracking-widest mb-1">Prepared by</p>
        <p class="text-zinc-800 font-bold tracking-wider text-sm">ESCOM STUDIO</p>
        <p class="text-zinc-500 text-[10px]">Digital Intelligence for High-Value Practices</p>
      </div>
      <p class="text-zinc-400 text-[10px] max-w-[200px] leading-relaxed text-right">
        Strategic analysis for sports rehab and athletic recovery positioning.
      </p>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════ -->
<!-- PÁGINA 2: ANÁLISE DO NEGÓCIO                   -->
<!-- ═══════════════════════════════════════════════ -->
<div class="page bg-grid">
  <div class="decor-line"></div>
  <div class="glow" style="bottom:-200px;left:-200px"></div>
  <div class="z">
    <div class="border-b border-zinc-200 pb-5 mb-8 mt-8">
      <span class="text-theme text-[10px] tracking-[0.3em] uppercase font-bold">Phase 01 • Market Intelligence</span>
      <h2 class="text-3xl font-serif mt-3 text-zinc-900">Practice Analysis & Local Opportunity</h2>
    </div>
    <p class="text-sm text-zinc-600 leading-relaxed mb-8">
      We mapped the clinical and demographic ecosystem where ${title} operates. These metrics establish the baseline for our revenue projections.
    </p>

    <div class="grid grid-cols-2 gap-4 mb-8">
      <div class="bg-zinc-50 border border-zinc-200 p-5 rounded-xl text-center">
        <i class="fa-solid fa-bullseye text-theme text-xl mb-3"></i>
        <p class="text-zinc-400 text-[10px] uppercase mb-1">Practice Segment</p>
        <p class="text-zinc-800 font-bold text-sm">${niche}</p>
      </div>
      <div class="bg-zinc-50 border border-zinc-200 p-5 rounded-xl text-center">
        <i class="fa-solid fa-location-dot text-theme text-xl mb-3"></i>
        <p class="text-zinc-400 text-[10px] uppercase mb-1">Geographical Market</p>
        <p class="text-zinc-800 font-bold text-sm">${city}</p>
      </div>
      <div class="bg-zinc-50 border border-zinc-200 p-5 rounded-xl text-center">
        <i class="fa-solid fa-money-bill-trend-up text-theme text-xl mb-3"></i>
        <p class="text-zinc-400 text-[10px] uppercase mb-1">Estimated Industry Ticket</p>
        <p class="text-zinc-800 font-bold text-lg">${ticket}</p>
      </div>
      <div class="bg-zinc-50 border border-zinc-200 p-5 rounded-xl text-center">
        <i class="fa-solid fa-users text-theme text-xl mb-3"></i>
        <p class="text-zinc-400 text-[10px] uppercase mb-1">Monthly Search Demands</p>
        <p class="text-zinc-800 font-bold text-lg">${config.monthlySearches || '12.400+'}</p>
      </div>
    </div>

    <div class="bg-zinc-50 border border-zinc-200 p-6 rounded-xl flex gap-6 items-center">
      <div class="w-1/3 h-28 rounded-xl overflow-hidden shadow-sm border border-zinc-200">
        <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=300" className="w-full h-full object-cover" />
      </div>
      <div class="w-2/3">
        <h3 class="text-zinc-900 font-bold mb-2 text-sm flex items-center gap-2"><i class="fa-solid fa-chart-line text-theme"></i> Market Context</h3>
        <p class="text-[11px] text-zinc-600 leading-relaxed mb-2">${config.marketContext}</p>
        <p class="text-[11px] text-zinc-600 leading-relaxed">${config.marketContext2}</p>
      </div>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════ -->
<!-- PÁGINA 3: DIAGNÓSTICO DO SITE / AUSÊNCIA       -->
<!-- ═══════════════════════════════════════════════ -->
<div class="page bg-grid">
  <div class="decor-line"></div>
  <div class="z">
    ${page3Content}
  </div>
</div>

<!-- ═══════════════════════════════════════════════ -->
<!-- PÁGINA 4: ANÁLISE VISUAL — PALETA DE CORES     -->
<!-- ═══════════════════════════════════════════════ -->
<div class="page bg-grid">
  <div class="decor-line"></div>
  <div class="glow" style="top:-150px;left:50%;transform:translateX(-50%)"></div>
  <div class="z">
    <div class="border-b border-zinc-200 pb-5 mb-8 mt-8">
      <span class="text-theme text-[10px] tracking-[0.3em] uppercase font-bold">Phase 03 • Visual Identity</span>
      <h2 class="text-3xl font-serif mt-3 text-zinc-900">Strategic Color System</h2>
    </div>
    <p class="text-sm text-zinc-600 leading-relaxed mb-8">
      Color selections are vital brand-positioning choices that trigger immediate behavioral responses. We selected a palette built for ${niche}.
    </p>
    <div class="grid grid-cols-2 gap-6 mb-8">
      ${colorSwatches}
    </div>
    <div class="bg-zinc-50 border border-zinc-200 p-5 rounded-xl">
      <h4 class="text-zinc-900 font-bold text-sm mb-2"><i class="fa-solid fa-palette text-theme mr-2"></i> Design Psychology</h4>
      <p class="text-xs text-zinc-600 leading-relaxed">${config.colorRationale}</p>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════ -->
<!-- PÁGINA 5: ANÁLISE VISUAL — TIPOGRAFIA          -->
<!-- ═══════════════════════════════════════════════ -->
<div class="page bg-grid">
  <div class="decor-line"></div>
  <div class="z">
    <div class="border-b border-zinc-200 pb-5 mb-8 mt-8">
      <span class="text-theme text-[10px] tracking-[0.3em] uppercase font-bold">Phase 03 (cont.) • Typography</span>
      <h2 class="text-3xl font-serif mt-3 text-zinc-900">Font System</h2>
    </div>
    <p class="text-sm text-zinc-600 leading-relaxed mb-8">
      Typography establishes the tone of voice of the practice. We selected premium fonts that convey ${config.typoPersonality}.
    </p>

    ${typography.map(t => `
    <div class="bg-zinc-50 border border-zinc-200 p-6 rounded-xl mb-6 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <div>
          <p class="text-zinc-400 text-[10px] uppercase tracking-widest">${t.role}</p>
          <p class="text-zinc-900 text-2xl font-bold font-serif" style="font-family:'${t.font}',sans-serif">${t.font}</p>
        </div>
        <span class="text-theme text-xs font-bold border border-theme/20 px-3 py-1 rounded-full bg-theme/5">${t.weight}</span>
      </div>
      <p class="text-2xl text-zinc-800 mb-3" style="font-family:'${t.font}',sans-serif">${t.sample}</p>
      <p class="text-xs text-zinc-500">${t.reason}</p>
    </div>
    `).join('')}
  </div>
</div>

<!-- ═══════════════════════════════════════════════ -->
<!-- PÁGINA 6: BENCHMARK COMPETITIVO                -->
<!-- ═══════════════════════════════════════════════ -->
<div class="page bg-grid">
  <div class="decor-line"></div>
  <div class="z">
    <div class="border-b border-zinc-200 pb-5 mb-8 mt-8">
      <span class="text-theme text-[10px] tracking-[0.3em] uppercase font-bold">Phase 04 • Competitive Analysis</span>
      <h2 class="text-3xl font-serif mt-3 text-zinc-900">Local Benchmark — ${city}</h2>
    </div>
    <p class="text-sm text-zinc-600 leading-relaxed mb-8">
      We compared your online presence against leading local clinics. Data highlights a substantial mobile positioning gap.
    </p>

    <table class="w-full text-left border-collapse mb-8">
      <thead>
        <tr class="border-b border-zinc-200 text-[10px] uppercase tracking-wider text-zinc-400">
          <th class="py-3 px-3 font-normal">Audit Criteria</th>
          <th class="py-3 px-3 font-normal text-center">Market Leaders</th>
          <th class="py-3 px-3 font-normal text-center text-red-500">Your Practice</th>
        </tr>
      </thead>
      <tbody>${compRows}</tbody>
    </table>

    <div class="bg-zinc-50 border border-zinc-200 p-5 rounded-xl text-center">
      <p class="text-theme font-bold mb-1 text-sm">Strategic Summary</p>
      <p class="text-xs text-zinc-600">${config.compConclusion}</p>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════ -->
<!-- PÁGINA 7: PONTOS A MELHORAR / FAZER            -->
<!-- ═══════════════════════════════════════════════ -->
<div class="page bg-grid">
  <div class="decor-line"></div>
  <div class="z">
    <div class="border-b border-zinc-200 pb-5 mb-8 mt-8">
      <span class="text-theme text-[10px] tracking-[0.3em] uppercase font-bold">Phase 05 • Action Plan</span>
      <h2 class="text-3xl font-serif mt-3 text-zinc-900">Prioritized Optimization Gaps</h2>
    </div>
    <p class="text-sm text-zinc-600 leading-relaxed mb-6">
      Actionable steps designed to optimize traffic retention, clinical credibility, and direct conversions.
    </p>
    ${improvHTML}
  </div>
</div>

<!-- ═══════════════════════════════════════════════ -->
<!-- PÁGINA 8: ARQUITETURA DA SOLUÇÃO               -->
<!-- ═══════════════════════════════════════════════ -->
<div class="page bg-grid">
  <div class="decor-line"></div>
  <div class="z">
    <div class="border-b border-zinc-200 pb-5 mb-8 mt-8">
      <span class="text-theme text-[10px] tracking-[0.3em] uppercase font-bold">Phase 06 • Proposed Platform</span>
      <h2 class="text-3xl font-serif mt-3 text-zinc-900">High-Conversion Web Architecture</h2>
    </div>
    <p class="text-sm text-zinc-600 leading-relaxed mb-8">
      We engineered a custom high-performance web platform built around six key performance factors.
    </p>
    <div class="grid grid-cols-2 gap-4">
      ${solHTML}
    </div>
    <div class="mt-8 bg-zinc-50 border border-zinc-200 rounded-xl p-5 text-center flex items-center justify-center gap-4">
      <i class="fa-solid fa-lock text-zinc-400 text-xl"></i>
      <p class="text-[10px] text-zinc-600 text-left leading-relaxed">
        Hosted on specialized VPS servers with global CDN, active security shield, and active SSL, optimized for heavy search and paid traffic.
      </p>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════ -->
<!-- PÁGINA 9: PROJEÇÃO DE FATURAMENTO E ROI        -->
<!-- ═══════════════════════════════════════════════ -->
<div class="page bg-grid">
  <div class="decor-line"></div>
  <div class="glow" style="top:-200px;right:-200px"></div>
  <div class="z">
    <div class="border-b border-zinc-200 pb-5 mb-8 mt-8">
      <span class="text-theme text-[10px] tracking-[0.3em] uppercase font-bold">Phase 07 • Financial Impact</span>
      <h2 class="text-3xl font-serif mt-3 text-zinc-900">Conservative ROI Projections</h2>
    </div>
    <p class="text-sm text-zinc-600 leading-relaxed mb-6">
      Upgrading to a high-end conversion setup is an immediate catalyst for patient acquisition.
    </p>

    <div class="bg-slate-50 border border-zinc-200 p-6 rounded-xl mb-6 shadow-sm">
      <h3 class="text-zinc-900 font-bold mb-4 text-center text-sm">Baseline Model: 1,000 Unique Visitors/mo</h3>
      <div class="flex items-end justify-around h-40 border-b border-zinc-200 pb-2 relative">
        <div class="absolute top-0 w-full border-t border-zinc-100 border-dashed"></div>
        <div class="absolute top-1/2 w-full border-t border-zinc-100 border-dashed"></div>
        <div class="flex flex-col items-center gap-2 z-10">
          <span class="text-[10px] text-zinc-500">${conversionCurrent} (Current)</span>
          <div class="w-14 h-8 bg-red-500/20 rounded-t border-t-2 border-red-500"></div>
          <span class="text-xs font-bold text-zinc-800 mt-2">${patientsOld} Patients</span>
        </div>
        <div class="flex flex-col items-center gap-2 z-10">
          <span class="text-[10px] text-theme font-bold">${conversionNew} (New Site)</span>
          <div class="w-14 h-32 rounded-t border-t-2 relative" style="background:${color}22;border-color:${color}">
            <div class="absolute -top-3 -right-3 bg-white text-zinc-900 text-[8px] font-bold px-2 py-0.5 rounded-full border border-zinc-200 shadow-sm">+700%</div>
          </div>
          <span class="text-xs font-bold text-zinc-800 mt-2">${patientsNew} Patients</span>
        </div>
      </div>
      <p class="text-center text-[9px] text-zinc-400 mt-3 uppercase tracking-widest font-mono">Funnel Conversion Rate</p>
    </div>

    <div class="grid grid-cols-2 gap-4 mb-6">
      <div class="bg-zinc-50 border border-zinc-200 p-4 rounded-xl text-center shadow-sm">
        <p class="text-zinc-400 text-[10px] uppercase mb-1">Industry Ticket Baseline</p>
        <p class="text-2xl font-bold text-zinc-900">${ticket}</p>
      </div>
      <div class="bg-zinc-50 border rounded-xl text-center p-4 shadow-sm" style="border-color:${color}55;">
        <p class="text-theme text-[10px] uppercase mb-1 font-bold">New Monthly Revenue Potential</p>
        <p class="text-2xl font-bold text-zinc-900">${revenue}</p>
      </div>
    </div>
    <div class="text-center bg-zinc-50 border border-zinc-200 p-4 rounded-xl">
      <p class="text-[10px] text-zinc-500 leading-relaxed"><i class="fa-solid fa-info-circle text-theme mr-1"></i> Projections based on conservative conversion uplifts mapped across similar wellness segments.</p>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════ -->
<!-- PÁGINA 10: CTA — NEXT STEPS                     -->
<!-- ═══════════════════════════════════════════════ -->
<div class="page bg-grid flex flex-col justify-center items-center text-center">
  <div class="decor-line"></div>
  <div class="glow" style="top:50%;left:50%;transform:translate(-50%,-50%)"></div>
  <div class="z max-w-md my-auto">
    <div class="w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-6 mx-auto" style="background:${color}15;color:${color};border:1px solid ${color}33">
      <i class="fa-brands fa-whatsapp"></i>
    </div>
    <p class="text-theme uppercase tracking-[0.3em] text-[10px] font-bold mb-3">Next Steps</p>
    <h2 class="text-3xl font-serif mb-4 text-zinc-900">Schedule a 15-Min Walkthrough</h2>
    <div class="w-12 h-[2px] bg-zinc-200 mx-auto mb-6"></div>
    <p class="text-zinc-600 text-xs leading-relaxed mb-8">
      ${ctaMessage}
    </p>

    <div class="bg-slate-50 border border-zinc-200 rounded-2xl p-6 mb-6 w-full max-w-xs mx-auto shadow-sm">
      <p class="text-zinc-500 text-[10px] uppercase tracking-wider mb-2">Direct Contact Number</p>
      <div class="text-xl font-bold text-zinc-800 mb-1">${ctaWhatsapp}</div>
      <p class="text-zinc-400 text-[9px]">Click below or scan the QR code to start</p>
    </div>

    <div class="bg-[#25D366] text-white font-bold px-6 py-3.5 rounded-xl shadow-md inline-flex items-center gap-2 text-xs uppercase tracking-wider transition-all hover:scale-105">
      <i class="fa-brands fa-whatsapp text-sm"></i> Launch Conversation on WhatsApp
    </div>

    <div class="mt-12 pt-6 border-t border-zinc-200 w-full">
      <p class="text-[9px] text-zinc-400 uppercase tracking-widest mb-1">A production by</p>
      <p class="text-zinc-900 font-bold tracking-wider text-sm">ESCOM STUDIO</p>
      <p class="text-zinc-400 text-[9px] mt-0.5">Premium Digital Conversion Intelligence</p>
    </div>
  </div>
</div>

</body>
</html>`;

  await fs.writeFile(dossieFile, html);

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.emulateMediaType('print');
  await page.goto('file://' + dossieFile, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.pdf({
    path: pdfFile,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' }
  });
  await browser.close();

  console.log(`Generated 10-PAGE EN dossie for ${slug}`);
}



async function run() {
  console.log("Iniciando geração de PDF para Cenário B (Auto Center São José)...");

  // Diretório do template
  const dirPath = await import('path').then(p => p.resolve('./public/template-saojose'));
  await import('fs/promises').then(fs => fs.mkdir(dirPath, { recursive: true }));

  await generateDossie10Pages('template-saojose', {
    color: '#ef4444', // Vermelho mecânica/urgência
    title: 'Auto Center São José',
    niche: 'Oficinas Mecânicas e Centros Automotivos',
    city: 'São Paulo - SP',
    ticket: 'R$ 1.500',
    revenue: 'R$ 75.000 (Perda Estimada)',
    monthlySearches: '18.400+',
    hasSite: false, // Cenário B ativado
    siteUrl: '',
    ctaWhatsapp: '(11) 98106-2787',
    ctaMessage: 'Este dossiê foi preparado exclusivamente para a direção do Auto Center São José. Gostaríamos de agendar uma conversa de 15 minutos para apresentar como podemos capturar essa demanda digital que hoje vai para a concorrência. Sem compromisso, sem pressão.',

    marketContext: 'A busca por serviços automotivos locais cresceu 180% nos últimos 2 anos. Motoristas não guardam mais cartões de visita; quando uma luz acende no painel ou precisam de uma revisão, eles buscam "mecânica perto de mim" no Google e escolhem a oficina com melhor presença online.',
    marketContext2: 'Estar fora do Google e não ter um site que transmita confiança imediata significa perder diariamente clientes que moram no seu próprio bairro, entregando esse faturamento diretamente para seus concorrentes locais.',

    diagItems: [
      { title: 'Invisibilidade Digital Absoluta', desc: 'Atualmente a oficina depende 100% de indicações ou passagem na porta. Os clientes da região que buscam no Google não encontram a sua oficina, indo direto para a concorrência que possui um site bem ranqueado.' },
      { title: 'Perda de Faturamento Fixo', desc: 'Com 18.400 buscas mensais na região, se apenas 0,5% escolhessem a sua oficina, seriam quase 100 novos clientes ao mês. Ao ticket médio de R$ 1.500, o custo dessa invisibilidade ultrapassa facilmente a casa dos R$ 100.000 mensais.' },
      { title: 'Falta de Confiança e Profissionalismo Visual', desc: 'Um site estruturado atua como uma vitrine 24h. Oficinas sem site passam a impressão de serem "amadoras" ou "de esquina", dificultando a venda de serviços mais caros como retíficas ou revisões preventivas completas.' },
      { title: 'Dificuldade de Contato via WhatsApp', desc: 'Não possuir um funil direto de agendamento online através de um clique força o cliente a ligar ou procurar outras opções. No trânsito ou com pressa, o cliente prefere a oficina que facilita o contato.' }
    ],

    colorPalette: [
      { hex: '#dc2626', name: 'Vermelho Urgência (Primária)', usage: 'Botões, CTAs, Alertas — Transmite ação rápida e mecânica' },
      { hex: '#1e293b', name: 'Asfalto Dark (Secundária)', usage: 'Headers, fundos escuros — Profissionalismo e robustez' },
      { hex: '#f8fafc', name: 'Cinza Gelo (Background)', usage: 'Fundos claros — Limpeza, organização técnica' },
      { hex: '#0f172a', name: 'Preto Motor (Texto)', usage: 'Corpo de texto — Contraste máximo e legibilidade' },
      { hex: '#eab308', name: 'Amarelo Atenção (Acento)', usage: 'Estrelas de avaliação, detalhes — Destaque' },
      { hex: '#ef4444', name: 'Alerta Red (Urgência)', usage: 'Banners de urgência — Ação imediata' }
    ],
    colorRationale: 'O esquema de cores une a robustez do asfalto escuro com o vermelho de alerta e urgência. Transmite a segurança de um centro automotivo moderno e limpo, diferenciando-se da oficina tradicional "suja de graxa".',

    typography: [
      { role: 'Títulos (Headline)', font: 'Playfair Display', weight: 'SemiBold 600', sample: 'Potência e Segurança em Cada Curva.', reason: 'Fonte forte e marcante que transmite tradição e confiabilidade.' },
      { role: 'Corpo de Texto (Body)', font: 'Inter', weight: 'Regular 400', sample: 'Agende a revisão do seu veículo agora pelo WhatsApp.', reason: 'Fonte técnica, moderna e legível para todas as telas.' }
    ],
    typoPersonality: 'robustez técnica e confiabilidade familiar',

    competitors: [
      { criteria: 'Visibilidade no Google', leaders: 'Top 3 (Maps e Busca)', yours: 'Invisível' },
      { criteria: 'Captura de Leads Automática', leaders: 'Botões WhatsApp', yours: 'Nenhuma' },
      { criteria: 'Credibilidade (Provas Sociais)', leaders: 'Depoimentos e Avaliações', yours: 'Ausente' },
      { criteria: 'Estrutura de Agendamento', leaders: 'Direto e Fácil', yours: 'Indicação Boca a Boca' },
      { criteria: 'Responsividade', leaders: 'Otimizado para Celular', yours: 'Sem site' },
      { criteria: 'Custo por Aquisição', leaders: 'Baixo (Orgânico Local)', yours: 'Perda de Faturamento' }
    ],
    compConclusion: 'Concorrentes locais com sites rápidos e organizados estão capturando diariamente os motoristas que buscam mecânica na sua região. Essa demanda existe e já está comprando, apenas não está comprando de você.',

    improvements: [
      { impact: 'Alto', title: 'Criação de Site Mobile-First', desc: 'Desenvolver uma Landing Page rápida, voltada para captura de leads urgentes (ex: carro quebrado) direto no celular.' },
      { impact: 'Alto', title: 'Integração com Google Meu Negócio', desc: 'Configurar e conectar o site para ranquear no mapa local, aparecendo para quem pesquisa "mecânica".' },
      { impact: 'Alto', title: 'Funil de Orçamento via WhatsApp', desc: 'Botão flutuante onipresente que leva o cliente com 1 clique para falar com o mecânico.' },
      { impact: 'Médio', title: 'Apresentação de Estrutura Física', desc: 'Fotos da oficina limpa, equipamentos modernos e equipe, passando credibilidade.' },
      { impact: 'Médio', title: 'Serviços Especializados em Destaque', desc: 'Páginas/Seções explicando serviços de alto valor (ex: câmbio automático, injeção eletrônica).' },
      { impact: 'Baixo', title: 'Provas Sociais em Vídeo', desc: 'Casos reais de clientes satisfeitos para aumentar a confiança inicial.' }
    ],

    solutionBlocks: [
      { icon: 'fa-solid fa-car-burst', title: 'Captação de Urgência', desc: 'Layout projetado para converter o cliente que está na rua precisando de ajuda rápida.' },
      { icon: 'fa-solid fa-bolt', title: 'Velocidade de Carregamento', desc: 'O site abre instantaneamente no 4G, evitando que o motorista feche e vá para o próximo.' },
      { icon: 'fa-solid fa-mobile-screen-button', title: 'Design Mobile-First', desc: 'Como 95% das buscas por mecânica ocorrem no celular, o site é 100% pensado para telas pequenas.' },
      { icon: 'fa-brands fa-whatsapp', title: 'Atendimento sem Fricção', desc: 'Mensagens pré-configuradas no botão do WhatsApp ("Preciso de orçamento").' },
      { icon: 'fa-solid fa-magnifying-glass-location', title: 'Otimização Local SEO', desc: 'Tags e estruturas otimizadas para ranquear nas pesquisas de bairro e região.' },
      { icon: 'fa-solid fa-shield-halved', title: 'Segurança Profissional', desc: 'Site blindado com certificado SSL, passando confiança e estabilidade para o cliente.' }
    ],
    conversionCurrent: '0% (Invisível)', conversionNew: 'Oportunidade', patientsOld: '0', patientsNew: '15+'
  });
  
  // Puppeteer para gerar PDF do Auto Center
  const puppeteer = await import('puppeteer');
  const browser = await puppeteer.default.launch({ headless: 'new' });
  const page = await browser.newPage();
  const htmlPath = 'file:///' + (await import('path')).resolve('./public/template-saojose/dossie.html').replace(/\\/g, '/');
  
  await page.goto(htmlPath, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: './public/template-saojose/dossie.pdf',
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' }
  });
  await browser.close();

  console.log("PDF para Cenário B gerado com sucesso.");
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
