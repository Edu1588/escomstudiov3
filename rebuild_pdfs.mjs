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
  // ═══════════════════════════
  // ORAL FIX (Odontologia)
  // ═══════════════════════════
  await generateDossie10Pages('template-oralfix', {
    color: '#0ea5e9',
    title: 'Oralfix Odonto',
    niche: 'Clínicas de Odontologia Estética e Reabilitação',
    city: 'São Caetano do Sul - SP',
    ticket: 'R$ 8.500',
    revenue: 'R$ 297.500',
    monthlySearches: '14.800+',
    hasSite: true,
    siteUrl: 'oralfixodonto.com.br',
    ctaWhatsapp: '(13) 98106-2787',
    ctaMessage: 'Este dossiê foi preparado exclusivamente para a direção da Oralfix Odonto. Gostaríamos de agendar uma conversa de 15 minutos para apresentar as soluções ao vivo e responder suas dúvidas. Sem compromisso, sem pressão — apenas clareza sobre o potencial inexplorado do seu negócio.',

    marketContext: 'O mercado de odontologia no Brasil segue em crescimento, mas a competição local exige posicionamento forte. São Caetano do Sul e a região do ABC Paulista concentram famílias e pacientes que buscam tratamentos duradouros e confiáveis, desde que encontrem um dentista de referência na região.',
    marketContext2: 'A pesquisa por dentistas locais bem avaliados e acessíveis cresceu 340% nos últimos 3 anos no Google. Estar posicionado como a clínica mais confiável do bairro é o fator decisivo para captar as famílias que moram ao redor.',

    diagItems: [
      { title: 'Visual aquém da credibilidade necessária', desc: 'Pacientes buscando tratamento odontológico querem sentir segurança e acolhimento. Se o posicionamento digital da clínica parecer desatualizado, há uma desconexão imediata com o valor dos tratamentos, gerando desconfiança e busca pelo concorrente de esquina.' },
      { title: 'Ausência de provas sociais da comunidade', desc: 'Para tratamentos odontológicos para a família, a prova visual é o fator número um de conversão. Faltam depoimentos de moradores da região estruturados logo na página inicial.' },
      { title: 'Excesso de explicações puramente técnicas', desc: 'O paciente busca resolver a dor de dente ou melhorar o sorriso com facilidade e parcelamento. Termos extremamente técnicos afastam o leigo, que compra a experiência de estar sendo cuidado com segurança.' },
      { title: 'Jornada de conversão digital com fricção', desc: 'Falta um funil de agendamento ultra-rápido e direto de WhatsApp. Fazer o usuário rolar páginas e preencher formulários escondidos no rodapé gera perdas de até 40% nas conversões.' }
    ],

    colorPalette: [
      { hex: '#0284c7', name: 'Sky Blue (Primária)', usage: 'Botões, CTAs, destaques — Transmite confiança e saúde' },
      { hex: '#0c4a6e', name: 'Deep Ocean (Secundária)', usage: 'Headers, fundos escuros — Seriedade e profissionalismo' },
      { hex: '#f0f9ff', name: 'Ice White (Background)', usage: 'Fundos claros, cards — Limpeza e higiene visual' },
      { hex: '#1e293b', name: 'Charcoal (Texto)', usage: 'Corpo de texto — Legibilidade máxima' },
      { hex: '#f59e0b', name: 'Amber Gold (Acento)', usage: 'Estrelas de avaliação, selos de prêmio — Exclusividade' },
      { hex: '#dc2626', name: 'Alert Red (Urgência)', usage: 'Banners de urgência, avisos — Ação imediata' }
    ],
    colorRationale: 'O azul é a cor mais associada a saúde, confiança e higiene na psicologia do consumidor. Combinado com tons brancos e o acento dourado, cria uma atmosfera de clínica confiável, moderna e preparada para receber a comunidade.',

    typography: [
      { role: 'Títulos (Headline)', font: 'Playfair Display', weight: 'SemiBold 600', sample: 'Transformamos sorrisos, recuperamos vidas.', reason: 'Fonte serifada elegante que transmite sofisticação e tradição médica.' },
      { role: 'Corpo de Texto (Body)', font: 'Inter', weight: 'Regular 400', sample: 'Agende sua avaliação digital completa hoje mesmo.', reason: 'Fonte sans-serif moderna, de alta legibilidade em telas pequenas e impressão.' }
    ],
    typoPersonality: 'sofisticação médica e acessibilidade moderna',

    competitors: [
      { criteria: 'Velocidade Mobile', leaders: '1.2s', yours: '5.8s' },
      { criteria: 'Design & Autoridade', leaders: 'Alto Padrão', yours: 'Genérico' },
      { criteria: 'Prova Social Visível', leaders: 'Sempre Visível', yours: 'Oculta' },
      { criteria: 'Agendamento Online', leaders: 'WhatsApp Integrado', yours: 'Telefone Fixo' },
      { criteria: 'SEO (Google Local)', leaders: 'Página 1', yours: 'Invisível' },
      { criteria: 'Responsividade', leaders: 'Mobile-First', yours: 'Quebrado no Mobile' }
    ],
    compConclusion: 'A estrutura física do Instituto Dr. Leandro Luka e da Oralfix Odonto é excelente, mas no ambiente digital, concorrentes locais com sites rápidos e modernos captam a maior parte das famílias e pacientes que buscam na web.',

    improvements: [
      { impact: 'Alto', title: 'Redesign completo Mobile-First', desc: 'Reconstruir toda a interface responsiva com design de alto padrão otimizado para celulares.' },
      { impact: 'Alto', title: 'Botão flutuante de WhatsApp', desc: 'CTA omnipresente em toda a navegação, reduzindo a fricção de contato de 5 cliques para 1.' },
      { impact: 'Alto', title: 'Galeria de Antes/Depois interativa', desc: 'Seção dedicada com slider comparativo para os principais procedimentos.' },
      { impact: 'Médio', title: 'SEO Local (Google Meu Negócio)', desc: 'Otimização de meta tags, schema markup para dentistas e integração com Google Maps.' },
      { impact: 'Médio', title: 'Depoimentos em destaque', desc: 'Cards com foto, nome e relato do paciente na home page.' },
      { impact: 'Baixo', title: 'Blog com conteúdo educativo', desc: 'Artigos sobre cuidados dentários que posicionam organicamente no Google.' }
    ],

    solutionBlocks: [
      { icon: 'fa-solid fa-paintbrush', title: 'Design Sensorial', desc: 'Visual imersivo com paleta psicológica que transmite exclusividade e confiança.' },
      { icon: 'fa-solid fa-bolt', title: 'Carga Ultra-Rápida', desc: 'Código otimizado para carregamento em menos de 1 segundo no mobile.' },
      { icon: 'fa-solid fa-bullseye', title: 'Copywriting Persuasivo', desc: 'Textos focados em benefícios e alívio da dor, não em jargão técnico.' },
      { icon: 'fa-solid fa-robot', title: 'Funil WhatsApp Automático', desc: 'Botão fixo que direciona o lead para atendimento imediato.' },
      { icon: 'fa-solid fa-chart-simple', title: 'Analytics Integrado', desc: 'Rastreamento completo de cliques, conversões e origens de tráfego.' },
      { icon: 'fa-solid fa-shield-halved', title: 'SSL + Blindagem', desc: 'Certificado de segurança e proteção contra cópia do código-fonte.' }
    ],
    conversionCurrent: '0.5%', conversionNew: '3.5%', patientsOld: '5', patientsNew: '35'
  });

  // ═══════════════════════════
  // CHIROPRACTIC AND MOVEMENT STUDIO (Quiropraxia)
  // ═══════════════════════════
  await generateDossie10PagesEn('template-chiroandmovement', {
    color: '#10b981',
    title: 'Chiropractic and Movement Studio',
    niche: 'Sports Chiropractic & Myofascial Release',
    city: 'Miami - FL',
    ticket: '$ 3,200',
    revenue: '$ 112,000',
    monthlySearches: '22,100+',
    hasSite: true,
    siteUrl: 'chiroandmovement.com',
    ctaWhatsapp: '+55 (13) 98106-2787',
    ctaMessage: 'This dossier was prepared exclusively for the leadership of Chiropractic and Movement Studio (Dr. Karen Maley). We would love to schedule a 15-minute call to walk you through these findings and answer your questions. No commitment, no pressure — just clarity on the untapped revenue your clinic is leaving on the table due to Weebly limitations.',

    marketContext: 'The U.S. chiropractic market is valued at $19.5 billion (IBISWorld 2024). Miami-Dade County ranks among the top 5 metro areas for wellness searches, with patients actively seeking non-surgical pain relief, sports rehab, and athletic performance solutions.',
    marketContext2: 'The search term "sports chiropractor near me" has grown 310% in the last 3 years in the Pinecrest and Kendall areas. Active individuals and CrossFit athletes choose providers based on website speed, credibility, and mobile user experience before ever booking.',

    diagItems: [
      { title: 'Weebly platform limits responsiveness & speed', desc: 'The site is hosted on Weebly, generating sluggish load times, limiting local SEO visibility, and preventing clear, straightforward booking for local patients.' },
      { title: 'Dr. Karen\'s bio and authority are buried on home', desc: 'Dr. Karen Maley\'s credentials are secondary. Her biography and certifications are nested in hard-to-reach subpages instead of the main page fold, failing to build trust with the local community.' },
      { title: 'No prominent floating booking CTAs', desc: 'While the clinic leverages Janeapp for bookings, there are no floating booking elements that stay with the user as they scroll on mobile, leading to a conversion loss of up to 35%.' },
      { title: 'Lack of visible testimonials and recovery proof', desc: 'For a local neighborhood clinic, visible proof of recovery and social testimonials right on the home page flow are vital to establish clinical trust before scheduling.' }
    ],

    colorPalette: [
      { hex: '#10b981', name: 'Emerald Green (Primary)', usage: 'CTAs, highlights — Healing, energy, athletic movement' },
      { hex: '#064e3b', name: 'Deep Emerald (Secondary)', usage: 'Headers, dark accents — Premium authority and strength' },
      { hex: '#f0fdf4', name: 'Mint Cream (Background)', usage: 'Light sections — Clean, fresh, balanced feel' },
      { hex: '#111827', name: 'Charcoal Dark (Text)', usage: 'Body copy — Maximum readability and contrast' },
      { hex: '#f59e0b', name: 'Warm Amber (Accent)', usage: 'Star ratings, trust badges — Exclusivity and trust' },
      { hex: '#ef4444', name: 'Signal Red (Urgency)', usage: 'Urgency notifications, pain relief — Quick action' }
    ],
    colorRationale: 'Emerald green communicates health, vitality, and cellular recovery. Contrasted with clean light gray and highlights of amber, it delivers a professional and welcoming feeling, establishing the clinic as a reliable community staple.',

    typography: [
      { role: 'Headers (Headline)', font: 'Playfair Display', weight: 'SemiBold 600', sample: 'Accelerate Recovery. Maximize Power.', reason: 'A premium serif typeface that reflects clinical authority and precision.' },
      { role: 'Body Copy (Body)', font: 'Inter', weight: 'Regular 400', sample: 'Book your sports chiropractic diagnostics today.', reason: 'A modern, clean sans-serif typeface that ensures high legibility on mobile screens.' }
    ],
    typoPersonality: 'clinical expertise and dynamic athletic performance',

    competitors: [
      { criteria: 'Mobile Loading Speed', leaders: '1.4s', yours: '6.2s' },
      { criteria: 'Visual & Authority Design', leaders: 'Elite Standards', yours: 'Generic Weebly' },
      { criteria: 'Visible Patient Trust', leaders: 'Always On Screen', yours: 'No Reviews on Home' },
      { criteria: 'Floating Booking CTAs', leaders: 'Yes (1-Click)', yours: 'Text Links Only' },
      { criteria: 'SEO (Miami Search Rank)', leaders: 'Page 1 Pack', yours: 'Not Indexed Locally' },
      { criteria: 'Mobile Optimization', leaders: 'Perfect Mobile-First', yours: 'Stretched Layouts' }
    ],
    compConclusion: 'While Chiropractic and Movement Studio provides stellar clinical care in Miami, the outdated Weebly web design limits local search indexing and paid traffic conversion efficiency compared to modern local competitors.',

    improvements: [
      { impact: 'High', title: 'Vite-React Performance Redesign', desc: 'Rebuild the site as a static, sub-second loading application optimized for mobile sports audiences.' },
      { impact: 'High', title: 'Sticky Booking CTAs', desc: 'Introduce high-contrast, omnipresent booking links to Janeapp to reduce scheduling friction.' },
      { impact: 'High', title: 'Prominent Authority Placement', desc: 'Move Dr. Karen\'s elite credentials, athletic experience, and clinical bio directly to the main fold.' },
      { impact: 'Medium', title: 'Local Miami SEO & Schema', desc: 'Inject LocalBusiness schema markup and optimize Pinecrest-area SEO keywords.' },
      { impact: 'Medium', title: 'Embedded Athletic Proof', desc: 'Display patient testimonials, before/after movement audits, and Google reviews on the homepage.' },
      { impact: 'Low', title: 'Sports Recovery Blog Section', desc: 'Publish specialized clinical insights on dry needling and soft tissue release to drive organic traffic.' }
    ],

    solutionBlocks: [
      { icon: 'fa-solid fa-dumbbell', title: 'Community Branding', desc: 'Professional visual tone designed for local families, weekend warriors, and active lifestyles.' },
      { icon: 'fa-solid fa-gauge-high', title: 'Sub-Second Loading', desc: 'Lightweight static HTML code designed to load in under 1 second on mobile devices.' },
      { icon: 'fa-solid fa-feather-pointed', title: 'Persuasive Copywriting', desc: 'Result-oriented copy focusing on pain relief, recovery time, and physical performance.' },
      { icon: 'fa-solid fa-calendar-check', title: 'Janeapp Optimization', desc: 'Direct, streamlined links and booking calendar integrations across the navigation.' },
      { icon: 'fa-solid fa-chart-column', title: 'Conversion Tracking', desc: 'Full Google Analytics, tracking pixel, and event tracking integration.' },
      { icon: 'fa-solid fa-shield-virus', title: 'SSL & Code Protection', desc: 'Standard security certificate and source code encryption.' }
    ],
    conversionCurrent: '0.4%', conversionNew: '3.5%', patientsOld: '4', patientsNew: '35'
  });

  // ═══════════════════════════
  // DRA ELIZABETE (Biomedicina Estética)
  // ═══════════════════════════
  console.log("Gerando PDF para Dra Elizabete...");
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const htmlPathEl = 'file:///' + path.resolve('./public/template-elizabete/dossie.html').replace(/\\/g, '/');
  await page.goto(htmlPathEl, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: './public/template-elizabete/dossie.pdf',
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' }
  });
  await browser.close();
  console.log('PDF gerado para Dra Elizabete com sucesso!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
