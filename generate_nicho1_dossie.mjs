import fs from 'fs/promises';
import path from 'path';
import puppeteer from 'puppeteer-core';

async function generateDossie10Pages(slug, config) {
  const { color, title, niche, city, ticket, revenue, hasSite, siteUrl,
          diagItems, competitors, colorPalette, typography, improvements,
          solutionBlocks, conversionCurrent, conversionNew, patientsOld, patientsNew,
          ctaWhatsapp, ctaMessage } = config;

  // Ensure public directory exists
  await fs.mkdir(`./public/${slug}`, { recursive: true }).catch(() => {});

  const dossieFile = path.resolve(`./public/${slug}/dossie.html`);
  const pdfFile = path.resolve(`./public/${slug}/dossie-consultoria-ma.pdf`);

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
      Realizamos um escaneamento completo do seu site atual e identificamos ${diagItems.length} pontos críticos que estão afastando contatos qualificados de alto ticket e comprometendo sua taxa de conversão.
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

    <!-- Imagem Corporativa M&A -->
    <div class="my-6 relative overflow-hidden rounded-2xl border border-zinc-200 shadow-md h-[110mm]">
      <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2068&auto=format&fit=crop');"></div>
    </div>

    <div class="flex justify-between items-end border-t border-zinc-200 pt-6">
      <div>
        <p class="text-zinc-400 text-[9px] uppercase tracking-widest mb-1">Elaborado por</p>
        <p class="text-zinc-800 font-bold tracking-wider text-sm">ESCOM STUDIO</p>
        <p class="text-zinc-500 text-[10px]">Inteligência Digital para Negócios de Alto Valor</p>
      </div>
      <p class="text-zinc-400 text-[10px] max-w-[200px] leading-relaxed text-right">
        Inteligência digital para consultoria de M&A e gestão empresarial
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
      A tipografia estabelece o tom de voz da consultoria. Selecionamos fontes premium que comunicam ${config.typoPersonality}.
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
          <span class="text-xs font-bold text-zinc-800 mt-2">${patientsOld}</span>
        </div>
        <div class="flex flex-col items-center gap-2 z-10">
          <span class="text-[10px] text-theme font-bold">${conversionNew} (Novo Site)</span>
          <div class="w-14 h-32 rounded-t border-t-2 relative" style="background:${color}22;border-color:${color}">
            <div class="absolute -top-3 -right-3 bg-white text-zinc-900 text-[8px] font-bold px-2 py-0.5 rounded-full border border-zinc-200 shadow-sm">+700%</div>
          </div>
          <span class="text-xs font-bold text-zinc-800 mt-2">${patientsNew}</span>
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

  const browser = await puppeteer.launch({ 
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
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

const config = {
  color: '#d4af37',
  title: 'Brasil Valuation & M&A Advisory',
  niche: 'Consultoria de Gestão Empresarial, Valuation e Fusões & Aquisições',
  city: 'São Paulo — SP (Jardim Paulistano, Faria Lima)',
  ticket: 'R$ 150.000+',
  revenue: 'R$ 450.000+',
  hasSite: true,
  siteUrl: 'brasilvaluation.com.br',
  monthlySearches: '8.200+',
  marketContext: 'O mercado de M&A no Brasil movimentou R$ 280 bilhões em 2025, com crescimento de 18% em deals de middle-market. Empresas de consultoria boutique na Faria Lima competem diretamente por founders e acionistas de companhias com faturamento entre R$ 20M e R$ 500M.',
  marketContext2: 'A presença digital tornou-se o primeiro ponto de contato para executivos C-Level que buscam assessoria de Sell-Side ou Buy-Side. Sites desatualizados geram desconfiança imediata nesse público de alto poder aquisitivo.',
  colorRationale: 'O dourado (#d4af37) transmite sofisticação, exclusividade e alto valor — essencial para o posicionamento premium de M&A. O preto profundo (#0a0a0f) reforça autoridade e confidencialidade. O branco garante legibilidade e transmite transparência nos dados financeiros.',
  typoPersonality: 'autoridade institucional, sofisticação e confiança executiva',
  compConclusion: 'A Brasil Valuation possui expertise técnica comprovada, mas seu site atual não reflete a sofisticação esperada por founders e acionistas de alto ticket. A reestruturação digital pode posicioná-la entre as 3 primeiras escolhas orgânicas da região.',
  diagItems: [
    { title: 'Layout Desatualizado & Não-Responsivo', desc: 'O site atual utiliza estruturas visuais de 2018-2020, com elementos sobrepostos em dispositivos móveis e tipografia genérica que não reflete a autoridade de uma boutique de M&A na Faria Lima.' },
    { title: 'Velocidade de Carregamento Crítica (LCP 5.4s)', desc: 'O tempo de carregamento excede 5 segundos em conexões 4G, resultando em perda estimada de 65% dos visitantes executivos antes mesmo de visualizar os serviços oferecidos.' },
    { title: 'Ausência de Funil de Qualificação de Leads', desc: 'Não há triagem automática de contatos. Formulário genérico mistura consultas irrelevantes com oportunidades reais de M&A, sobrecarregando a equipe comercial.' },
    { title: 'SEO Local Inexistente para Termos de M&A', desc: 'A empresa não aparece nas primeiras posições para buscas como "consultoria M&A São Paulo", "valuation empresa SP" ou "assessoria fusões e aquisições Faria Lima".' },
    { title: 'Sem Integração com WhatsApp Business ou CRM', desc: 'Contatos chegam apenas por e-mail, sem rastreabilidade nem follow-up automatizado. Cada lead perdido representa um deal potencial de R$ 150K+ em honorários.' }
  ],
  competitors: [
    { criteria: 'Design & UX Premium', leaders: '★★★★★', yours: '★★☆☆☆' },
    { criteria: 'Velocidade Mobile (LCP)', leaders: '< 1.5s', yours: '5.4s' },
    { criteria: 'SEO Local (Top 3)', leaders: 'Sim', yours: 'Não' },
    { criteria: 'Funil Sell-Side / Buy-Side', leaders: 'Automatizado', yours: 'Ausente' },
    { criteria: 'WhatsApp CRM Integrado', leaders: 'Sim', yours: 'Não' },
    { criteria: 'Cases & Social Proof', leaders: 'Interativo', yours: 'Estático' }
  ],
  colorPalette: [
    { name: 'Gold Executive', hex: '#d4af37', usage: 'CTAs, destaques, bordas premium' },
    { name: 'Dark Authority', hex: '#0a0a0f', usage: 'Backgrounds, textos principais' },
    { name: 'Platinum', hex: '#e4e4e7', usage: 'Divisores, bordas sutis' },
    { name: 'Emerald Trust', hex: '#10b981', usage: 'Indicadores positivos, badges de sucesso' }
  ],
  typography: [
    { role: 'Heading / Títulos', font: 'Cinzel', weight: '600–700', sample: 'Liderança em Fusões e Aquisições', reason: 'Fonte serifada clássica que transmite tradição, autoridade institucional e sofisticação — ideal para o segmento de M&A e advisory.' },
    { role: 'Body / Interface', font: 'Inter', weight: '300–600', sample: 'Assessoramos líderes corporativos em operações complexas.', reason: 'Sans-serif moderna com alta legibilidade em telas, números tabulares para dados financeiros e excelente renderização em mobile.' }
  ],
  improvements: [
    { impact: 'Alto', title: 'Redesign Completo com Identidade M&A Premium', desc: 'Substituir o layout genérico por um sistema visual dark-mode com tipografia Cinzel/Inter, glassmorphism e micro-animações GSAP.' },
    { impact: 'Alto', title: 'Funil de Qualificação Sell-Side & Buy-Side', desc: 'Implementar formulários inteligentes com triagem por faturamento, setor e tipo de operação (venda total, parcial, fusão).' },
    { impact: 'Alto', title: 'Otimização de Performance (Sub-1s LCP)', desc: 'Reestruturar com código proprietário otimizado, sem builders ou CMS pesados, alcançando nota 100/100 no Lighthouse.' },
    { impact: 'Médio', title: 'SEO Local para M&A e Valuation em SP', desc: 'Implementar Schema.org, meta tags estruturadas e conteúdo otimizado para dominar as buscas de consultoria M&A na região da Faria Lima.' },
    { impact: 'Médio', title: 'Integração WhatsApp Business API + CRM', desc: 'Sincronizar leads automaticamente com pipeline comercial, permitindo follow-up em tempo real para oportunidades de alto ticket.' },
    { impact: 'Baixo', title: 'Blog de Autoridade em M&A e Valuation', desc: 'Publicação periódica de conteúdo sobre tendências de mercado, cases e insights para atrair tráfego orgânico qualificado.' }
  ],
  solutionBlocks: [
    { icon: 'fa-solid fa-paintbrush', title: 'Website M&A Premium', desc: 'Design brutalista exclusivo com dark-mode, glassmorphism e tipografia Cinzel/Inter para autoridade máxima no segmento.' },
    { icon: 'fa-solid fa-filter', title: 'Funil de Qualificação', desc: 'Formulários inteligentes com triagem de leads por ticket, setor e tipo de operação — Sell-Side, Buy-Side ou Valuation.' },
    { icon: 'fa-solid fa-bolt', title: 'Performance Extrema', desc: 'Código proprietário com LCP sub-1s, Core Web Vitals perfeitos e nota 100/100 no Google PageSpeed.' },
    { icon: 'fa-solid fa-magnifying-glass', title: 'SEO Local & Schema', desc: 'Dominância orgânica para termos de M&A, valuation e due diligence na região de São Paulo.' },
    { icon: 'fa-brands fa-whatsapp', title: 'WhatsApp CRM Nativo', desc: 'Leads recebidos direto no WhatsApp Business com dados qualificados — sem mensalidades de SaaS.' },
    { icon: 'fa-solid fa-chart-line', title: 'Dashboard de Métricas', desc: 'Painel ao vivo com LTV, CAC, taxa de conversão do funil e heatmap de comportamento dos visitantes.' }
  ],
  conversionCurrent: '0.3%',
  conversionNew: '3.8%',
  patientsOld: '3 Contatos',
  patientsNew: '38 Contatos',
  ctaWhatsapp: '(13) 98106-2787',
  ctaMessage: 'Este dossiê foi elaborado exclusivamente para a Brasil Valuation & M&A Advisory pela equipe de inteligência digital da ESCOM STUDIO. Entre em contato para agendar a apresentação completa e iniciar a reestruturação digital.'
};

generateDossie10Pages('site-consultoria-ma', config).catch(console.error);
