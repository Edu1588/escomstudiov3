import fs from 'fs/promises';

const filePath = './rebuild_pdfs.mjs';

async function updateFile() {
  const content = await fs.readFile(filePath, 'utf-8');
  
  // We want to find the line that marks the end of generateDossie10Pages
  // which ends with: console.log(`Generated 10-PAGE dossie for ${slug}`);
  // }
  const searchStr = '  console.log(`Generated 10-PAGE dossie for ${slug}`);\r\n}';
  const searchStrLF = '  console.log(`Generated 10-PAGE dossie for ${slug}`);\n}';
  
  let splitIndex = content.indexOf(searchStr);
  let searchLength = searchStr.length;
  
  if (splitIndex === -1) {
    splitIndex = content.indexOf(searchStrLF);
    searchLength = searchStrLF.length;
  }
  
  if (splitIndex === -1) {
    console.error('Could not find split point in rebuild_pdfs.mjs!');
    return;
  }

  // The base content before the run function
  const baseContent = content.substring(0, splitIndex + searchLength);

  const newPart = `

async function generateDossie10PagesEn(slug, config) {
  const { color, title, niche, city, ticket, revenue, hasSite, siteUrl,
          diagItems, competitors, colorPalette, typography, improvements,
          solutionBlocks, conversionCurrent, conversionNew, patientsOld, patientsNew,
          ctaWhatsapp, ctaMessage } = config;

  const dossieFile = path.resolve(\`./public/\${slug}/dossie.html\`);
  const pdfFile = path.resolve(\`./public/\${slug}/dossie.pdf\`);

  // --- Build diagnostic cards ---
  let diagHTML = '';
  diagItems.forEach((d, i) => {
    diagHTML += \`
    <div class="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl flex gap-5 mb-4">
      <div class="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center flex-shrink-0 text-lg border border-red-500/20">
        <i class="fa-solid fa-triangle-exclamation"></i>
      </div>
      <div>
        <h4 class="text-white font-bold mb-1">\${d.title}</h4>
        <p class="text-xs text-zinc-400 leading-relaxed">\${d.desc}</p>
      </div>
    </div>\`;
  });

  // --- Build competitor table rows ---
  let compRows = '';
  competitors.forEach(c => {
    compRows += \`
    <tr class="border-b border-zinc-800/50">
      <td class="py-4 px-3 text-white text-sm">\${c.criteria}</td>
      <td class="py-4 px-3 text-center text-green-400 text-sm font-medium">\${c.leaders}</td>
      <td class="py-4 px-3 text-center text-red-400 text-sm font-medium">\${c.yours}</td>
    </tr>\`;
  });

  // --- Build color palette swatches ---
  let colorSwatches = '';
  colorPalette.forEach(c => {
    colorSwatches += \`
    <div class="flex items-center gap-4 mb-4">
      <div class="w-16 h-16 rounded-xl shadow-lg flex-shrink-0" style="background:\${c.hex}"></div>
      <div>
        <p class="text-white font-bold text-sm">\${c.name}</p>
        <p class="text-zinc-500 text-xs">HEX: \${c.hex} · \${c.usage}</p>
      </div>
    </div>\`;
  });

  // --- Build improvements list ---
  let improvHTML = '';
  improvements.forEach(imp => {
    const badgeColor = imp.impact === 'Alto' || imp.impact === 'High' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                       imp.impact === 'Médio' || imp.impact === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                       'bg-blue-500/20 text-blue-400 border-blue-500/30';
    improvHTML += \`
    <div class="flex items-start gap-4 mb-4 bg-zinc-900/30 p-4 rounded-lg border border-zinc-800">
      <span class="text-xs font-bold px-2 py-1 rounded border \${badgeColor} flex-shrink-0 mt-0.5">\${imp.impact}</span>
      <div>
        <h4 class="text-white font-bold text-sm mb-1">\${imp.title}</h4>
        <p class="text-zinc-500 text-xs leading-relaxed">\${imp.desc}</p>
      </div>
    </div>\`;
  });

  // --- Build solution blocks ---
  let solHTML = '';
  solutionBlocks.forEach(s => {
    solHTML += \`
    <div class="border border-zinc-800 bg-zinc-950 p-5 rounded-xl relative overflow-hidden">
      <div class="absolute top-0 left-0 w-1 h-full" style="background:\${color}"></div>
      <i class="\${s.icon} text-xl mb-3" style="color:\${color}"></i>
      <h4 class="text-white font-bold mb-2 text-sm">\${s.title}</h4>
      <p class="text-[11px] text-zinc-500 leading-relaxed">\${s.desc}</p>
    </div>\`;
  });

  // --- Conditional page 3 content ---
  const page3Content = hasSite ? \`
    <div class="border-b border-zinc-800 pb-6 mb-10 mt-10">
      <span class="text-theme text-[10px] tracking-[0.3em] uppercase font-bold">Phase 02 • Current Website Audit</span>
      <h2 class="text-3xl font-serif mt-3 text-white">Website Diagnostics: \${siteUrl || title}</h2>
    </div>
    <p class="text-sm text-zinc-400 leading-relaxed mb-8">
      We performed a comprehensive scan of your current website and identified \${diagItems.length} critical flaws that are driving high-value patients away and limiting your conversion rates.
    </p>
    <div>\${diagHTML}</div>
  \` : \`
    <div class="border-b border-zinc-800 pb-6 mb-10 mt-10">
      <span class="text-theme text-[10px] tracking-[0.3em] uppercase font-bold">Phase 02 • Digital Absence</span>
      <h2 class="text-3xl font-serif mt-3 text-white">The Cost of Not Having a Professional Website</h2>
    </div>
    <p class="text-sm text-zinc-400 leading-relaxed mb-8">
      Currently, \${title} does not have a structured website. This represents a measurable loss of revenue, as local competitors are capturing 100% of the digital demand in your market.
    </p>
    <div>\${diagHTML}</div>
  \`;

  const html = \`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Confidential Dossier - \${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    body { background:#050505; color:#fff; font-family:'Inter',sans-serif; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    .page { width:210mm; min-height:297mm; padding:18mm; margin:0 auto; background:#050505; position:relative; overflow:hidden; page-break-after:always; }
    @media print { body,.page { margin:0; background:#050505; } .page { width:100%; height:100%; padding:14mm; } }
    .font-serif { font-family:'Playfair Display',serif; }
    .text-theme { color:\${color}; }
    .bg-theme { background-color:\${color}; }
    .bg-grid { background-size:40px 40px; background-image:linear-gradient(to right,rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,.02) 1px,transparent 1px); }
    .glow { position:absolute; width:500px; height:500px; background:radial-gradient(circle,\${color}22 0%,transparent 70%); z-index:0; pointer-events:none; }
    .z { position:relative; z-index:10; }
  </style>
</head>
<body>

<!-- ═══════════════════════════════════════════════ -->
<!-- PÁGINA 1: CAPA CONFIDENCIAL                    -->
<!-- ═══════════════════════════════════════════════ -->
<div class="page bg-grid flex flex-col justify-center items-center text-center">
  <div class="glow" style="top:-200px;right:-200px"></div>
  <div class="z">
    <div class="absolute top-8 left-8 text-[9px] tracking-[0.4em] text-zinc-600 uppercase flex items-center gap-2">
      <i class="fa-solid fa-lock text-theme"></i> Confidential Document — Restricted Access
    </div>
    <div class="w-24 h-24 rounded-full border border-zinc-800 flex items-center justify-center text-theme text-4xl mb-10">
      <i class="fa-solid fa-shield-halved"></i>
    </div>
    <p class="text-theme uppercase tracking-[0.4em] text-[10px] font-bold mb-6">Competitive Intelligence & UX Audit</p>
    <h1 class="text-5xl font-serif leading-[1.1] mb-6 font-bold">Strategic Dossier<br><span class="italic text-zinc-400 font-light text-4xl">\${title}</span></h1>
    <div class="w-14 h-[2px] bg-zinc-800 mb-10 mx-auto"></div>
    <p class="text-zinc-500 max-w-sm mx-auto text-xs leading-relaxed mb-20">
      In-depth market study, visual diagnostics, conversion architecture, and financial projection for \${niche} in the region of \${city}.
    </p>
    <div class="inline-block border border-zinc-800 rounded-lg px-5 py-3 bg-zinc-950/50">
      <p class="text-[9px] uppercase tracking-widest text-zinc-600 mb-1">Prepared by</p>
      <p class="text-white font-bold tracking-wider text-sm">ESCOM STUDIO</p>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════ -->
<!-- PÁGINA 2: ANÁLISE DO NEGÓCIO                   -->
<!-- ═══════════════════════════════════════════════ -->
<div class="page bg-grid">
  <div class="glow" style="bottom:-200px;left:-200px"></div>
  <div class="z">
    <div class="border-b border-zinc-800 pb-5 mb-8 mt-8">
      <span class="text-theme text-[10px] tracking-[0.3em] uppercase font-bold">Phase 01 • Market Intelligence</span>
      <h2 class="text-3xl font-serif mt-3 text-white">Business & Opportunity Analysis</h2>
    </div>
    <p class="text-sm text-zinc-400 leading-relaxed mb-8">
      Before proposing any solution, we mapped the actual market scenario where \${title} operates. These metrics form the basis for our diagnostics and ROI projection.
    </p>

    <div class="grid grid-cols-2 gap-4 mb-8">
      <div class="bg-zinc-900/50 border border-zinc-800 p-5 rounded-xl text-center">
        <i class="fa-solid fa-bullseye text-theme text-xl mb-3"></i>
        <p class="text-zinc-500 text-[10px] uppercase mb-1">Segment</p>
        <p class="text-white font-bold text-sm">\${niche}</p>
      </div>
      <div class="bg-zinc-900/50 border border-zinc-800 p-5 rounded-xl text-center">
        <i class="fa-solid fa-location-dot text-theme text-xl mb-3"></i>
        <p class="text-zinc-500 text-[10px] uppercase mb-1">Region</p>
        <p class="text-white font-bold text-sm">\${city}</p>
      </div>
      <div class="bg-zinc-900/50 border border-zinc-800 p-5 rounded-xl text-center">
        <i class="fa-solid fa-money-bill-trend-up text-theme text-xl mb-3"></i>
        <p class="text-zinc-500 text-[10px] uppercase mb-1">Market Average Ticket</p>
        <p class="text-white font-bold text-lg">\${ticket}</p>
      </div>
      <div class="bg-zinc-900/50 border border-zinc-800 p-5 rounded-xl text-center">
        <i class="fa-solid fa-users text-theme text-xl mb-3"></i>
        <p class="text-zinc-500 text-[10px] uppercase mb-1">Monthly Searches (Google)</p>
        <p class="text-white font-bold text-lg">\${config.monthlySearches || '12,400+'}</p>
      </div>
    </div>

    <div class="bg-zinc-900/30 border border-zinc-800 p-6 rounded-xl">
      <h3 class="text-white font-bold mb-3 flex items-center gap-2"><i class="fa-solid fa-chart-line text-theme"></i> Market Context</h3>
      <p class="text-xs text-zinc-400 leading-relaxed mb-3">\${config.marketContext}</p>
      <p class="text-xs text-zinc-400 leading-relaxed">\${config.marketContext2}</p>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════ -->
<!-- PÁGINA 3: DIAGNÓSTICO DO SITE / AUSÊNCIA       -->
<!-- ═══════════════════════════════════════════════ -->
<div class="page bg-grid">
  <div class="z">
    \${page3Content}
  </div>
</div>

<!-- ═══════════════════════════════════════════════ -->
<!-- PÁGINA 4: ANÁLISE VISUAL — PALETA DE CORES     -->
<!-- ═══════════════════════════════════════════════ -->
<div class="page bg-grid">
  <div class="glow" style="top:-150px;left:50%;transform:translateX(-50%)"></div>
  <div class="z">
    <div class="border-b border-zinc-800 pb-5 mb-8 mt-8">
      <span class="text-theme text-[10px] tracking-[0.3em] uppercase font-bold">Phase 03 • Visual Identity</span>
      <h2 class="text-3xl font-serif mt-3 text-white">Strategic Color Palette</h2>
    </div>
    <p class="text-sm text-zinc-400 leading-relaxed mb-8">
      Colors are not random aesthetic choices — they directly influence consumer buying decisions. We designed a palette based on color psychology for the \${niche} segment.
    </p>
    <div class="grid grid-cols-2 gap-6 mb-8">
      \${colorSwatches}
    </div>
    <div class="bg-zinc-900/30 border border-zinc-800 p-5 rounded-xl">
      <h4 class="text-white font-bold text-sm mb-2"><i class="fa-solid fa-palette text-theme mr-2"></i> Why this palette?</h4>
      <p class="text-xs text-zinc-400 leading-relaxed">\${config.colorRationale}</p>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════ -->
<!-- PÁGINA 5: ANÁLISE VISUAL — TIPOGRAFIA          -->
<!-- ═══════════════════════════════════════════════ -->
<div class="page bg-grid">
  <div class="z">
    <div class="border-b border-zinc-800 pb-5 mb-8 mt-8">
      <span class="text-theme text-[10px] tracking-[0.3em] uppercase font-bold">Phase 03 (cont.) • Typography</span>
      <h2 class="text-3xl font-serif mt-3 text-white">Typographic System</h2>
    </div>
    <p class="text-sm text-zinc-400 leading-relaxed mb-8">
      Typography defines the brand's visual personality. We selected typefaces that communicate \${config.typoPersonality}.
    </p>

    \${typography.map(t => \`
    <div class="bg-zinc-900/30 border border-zinc-800 p-6 rounded-xl mb-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <p class="text-zinc-500 text-[10px] uppercase tracking-widest">\${t.role}</p>
          <p class="text-white text-2xl font-bold" style="font-family:'\${t.font}',sans-serif">\${t.font}</p>
        </div>
        <span class="text-theme text-xs font-bold border border-theme/30 px-3 py-1 rounded-full">\${t.weight}</span>
      </div>
      <p class="text-3xl text-white mb-3" style="font-family:'\${t.font}',sans-serif">\${t.sample}</p>
      <p class="text-xs text-zinc-500">\${t.reason}</p>
    </div>
    \`).join('')}
  </div>
</div>

<!-- ═══════════════════════════════════════════════ -->
<!-- PÁGINA 6: BENCHMARK COMPETITIVO                -->
<!-- ═══════════════════════════════════════════════ -->
<div class="page bg-grid">
  <div class="z">
    <div class="border-b border-zinc-800 pb-5 mb-8 mt-8">
      <span class="text-theme text-[10px] tracking-[0.3em] uppercase font-bold">Phase 04 • Competitive Intelligence</span>
      <h2 class="text-3xl font-serif mt-3 text-white">Local Benchmark — \${city}</h2>
    </div>
    <p class="text-sm text-zinc-400 leading-relaxed mb-8">
      We compared your digital presence with leading clinics in your local market. The metrics are clear.
    </p>

    <table class="w-full text-left border-collapse mb-8">
      <thead>
        <tr class="border-b border-zinc-700 text-[10px] uppercase tracking-wider text-zinc-500">
          <th class="py-3 px-3 font-normal">Criteria</th>
          <th class="py-3 px-3 font-normal text-center">Market Leaders</th>
          <th class="py-3 px-3 font-normal text-center text-red-400">You Today</th>
        </tr>
      </thead>
      <tbody>\${compRows}</tbody>
    </table>

    <div class="bg-theme/10 border border-theme/30 p-5 rounded-xl text-center">
      <p class="text-theme font-bold mb-1">Competitive Conclusion</p>
      <p class="text-xs text-zinc-300">\${config.compConclusion}</p>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════ -->
<!-- PÁGINA 7: PONTOS A MELHORAR / FAZER            -->
<!-- ═══════════════════════════════════════════════ -->
<div class="page bg-grid">
  <div class="z">
    <div class="border-b border-zinc-800 pb-5 mb-8 mt-8">
      <span class="text-theme text-[10px] tracking-[0.3em] uppercase font-bold">Phase 05 • Action Plan</span>
      <h2 class="text-3xl font-serif mt-3 text-white">Areas of Improvement / Implementation</h2>
    </div>
    <p class="text-sm text-zinc-400 leading-relaxed mb-6">
      Prioritized list of technical and visual actions that directly impact conversion of visitors into active customers.
    </p>
    \${improvHTML}
  </div>
</div>

<!-- ═══════════════════════════════════════════════ -->
<!-- PÁGINA 8: ARQUITETURA DA SOLUÇÃO               -->
<!-- ═══════════════════════════════════════════════ -->
<div class="page bg-grid">
  <div class="z">
    <div class="border-b border-zinc-800 pb-5 mb-8 mt-8">
      <span class="text-theme text-[10px] tracking-[0.3em] uppercase font-bold">Phase 06 • The New Infrastructure</span>
      <h2 class="text-3xl font-serif mt-3 text-white">Proposed Conversion Architecture</h2>
    </div>
    <p class="text-sm text-zinc-400 leading-relaxed mb-8">
      To reverse this scenario, ESCOM Studio designed a conversion-focused platform based on 6 technical pillars.
    </p>
    <div class="grid grid-cols-2 gap-5">
      \${solHTML}
    </div>
    <div class="mt-8 bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
      <i class="fa-solid fa-lock text-zinc-600 text-2xl mb-3"></i>
      <h3 class="text-white font-bold mb-1">Secure & Scalable Environment</h3>
      <p class="text-[10px] text-zinc-400">SSL Certificate, Global CDN distribution, engineered for heavy digital advertising traffic.</p>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════ -->
<!-- PÁGINA 9: PROJEÇÃO DE FATURAMENTO E ROI        -->
<!-- ═══════════════════════════════════════════════ -->
<div class="page bg-grid">
  <div class="glow" style="top:-200px;right:-200px"></div>
  <div class="z">
    <div class="border-b border-zinc-800 pb-5 mb-8 mt-8">
      <span class="text-theme text-[10px] tracking-[0.3em] uppercase font-bold">Phase 07 • Financial Impact</span>
      <h2 class="text-3xl font-serif mt-3 text-white">Conservative ROI Projection</h2>
    </div>
    <p class="text-sm text-zinc-400 leading-relaxed mb-6">
      A professional website is not an expense, it is the primary leverage for revenue.
    </p>

    <div class="bg-zinc-900/80 border border-zinc-800 p-6 rounded-xl mb-8">
      <h3 class="text-white font-bold mb-6 text-center text-sm">Scenario: 1000 Monthly Visitors</h3>
      <div class="flex items-end justify-around h-44 border-b border-zinc-700 pb-2 relative">
        <div class="absolute top-0 w-full border-t border-zinc-800 border-dashed"></div>
        <div class="absolute top-1/2 w-full border-t border-zinc-800 border-dashed"></div>
        <div class="flex flex-col items-center gap-2 z-10">
          <span class="text-[10px] text-zinc-400">\${conversionCurrent} (Current)</span>
          <div class="w-14 h-10 bg-red-500/50 rounded-t border-t-2 border-red-500"></div>
          <span class="text-xs font-bold text-white mt-2">\${patientsOld} Patients</span>
        </div>
        <div class="flex flex-col items-center gap-2 z-10">
          <span class="text-[10px] text-theme font-bold">\${conversionNew} (New Site)</span>
          <div class="w-14 h-36 rounded-t border-t-2 relative" style="background:\${color}55;border-color:\${color}">
            <div class="absolute -top-3 -right-3 bg-white text-black text-[8px] font-bold px-2 py-0.5 rounded-full shadow">+700%</div>
          </div>
          <span class="text-xs font-bold text-white mt-2">\${patientsNew} Patients</span>
        </div>
      </div>
      <p class="text-center text-[9px] text-zinc-500 mt-3 uppercase tracking-widest">Conversion Rate vs Real Volume</p>
    </div>

    <div class="grid grid-cols-2 gap-5 mb-8">
      <div class="bg-zinc-950 border border-zinc-800 p-5 rounded-xl text-center">
        <p class="text-zinc-500 text-[10px] uppercase mb-1">Average Ticket</p>
        <p class="text-2xl font-bold text-white">\${ticket}</p>
      </div>
      <div class="bg-zinc-950 border rounded-xl text-center p-5" style="border-color:\${color}55;box-shadow:0 0 20px \${color}22">
        <p class="text-theme text-[10px] uppercase mb-1 font-bold">New Monthly Revenue</p>
        <p class="text-2xl font-bold text-white">\${revenue}</p>
      </div>
    </div>
    <div class="text-center bg-zinc-900/30 border border-zinc-800 p-4 rounded-xl">
      <p class="text-xs text-zinc-400"><i class="fa-solid fa-info-circle text-theme mr-1"></i> Conservative projection based on industry benchmarks. Real results may exceed expectations.</p>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════ -->
<!-- PÁGINA 10: CTA — VAMOS CONVERSAR?              -->
<!-- ═══════════════════════════════════════════════ -->
<div class="page bg-grid flex flex-col justify-center items-center text-center">
  <div class="glow" style="top:50%;left:50%;transform:translate(-50%,-50%)"></div>
  <div class="z max-w-md">
    <div class="w-20 h-20 rounded-full flex items-center justify-center text-3xl mb-8 mx-auto" style="background:\${color}22;color:\${color};border:1px solid \${color}44">
      <i class="fa-brands fa-whatsapp"></i>
    </div>
    <p class="text-theme uppercase tracking-[0.3em] text-[10px] font-bold mb-4">Next Step</p>
    <h2 class="text-4xl font-serif mb-6 text-white">Let's Talk?</h2>
    <div class="w-12 h-[2px] bg-zinc-800 mx-auto mb-8"></div>
    <p class="text-zinc-400 text-sm leading-relaxed mb-10">
      \${ctaMessage}
    </p>

    <div class="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 mb-8">
      <p class="text-white font-bold mb-3">Speak directly with our team:</p>
      <div class="inline-block text-2xl font-bold text-theme mb-4">\${ctaWhatsapp}</div>
      <p class="text-zinc-500 text-xs">Click the link below or scan the QR Code</p>
    </div>

    <div class="bg-theme text-black font-bold px-8 py-4 rounded-xl shadow-lg inline-block text-sm">
      <i class="fa-brands fa-whatsapp mr-2"></i> Start Conversation on WhatsApp
    </div>

    <div class="mt-12 pt-8 border-t border-zinc-800">
      <p class="text-[10px] text-zinc-600 uppercase tracking-widest mb-2">Produced by</p>
      <p class="text-white font-bold tracking-wider">ESCOM STUDIO</p>
      <p class="text-zinc-600 text-[10px] mt-1">Digital Intelligence for High-Value Businesses</p>
    </div>
  </div>
</div>

</body>
</html>\`;

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

  console.log(\`Generated 10-PAGE EN dossie for \${slug}\`);
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
    ctaWhatsapp: '(48) 99806-5099',
    ctaMessage: 'Este dossiê foi preparado exclusivamente para a direção da Oralfix Odonto. Gostaríamos de agendar uma conversa de 15 minutos para apresentar as soluções ao vivo e responder suas dúvidas. Sem compromisso, sem pressão — apenas clareza sobre o potencial inexplorado do seu negócio.',

    marketContext: 'O mercado de odontologia estética no Brasil movimenta mais de R$ 38 bilhões por ano (ABIMO 2024). São Caetano do Sul e a região do ABC Paulista concentram uma alta densidade de pacientes de alto ticket, dispostos a investir R$ 15.000–R$ 60.000 em lentes e facetas de resina, desde que confiem plenamente no profissional.',
    marketContext2: 'A pesquisa por clínicas de reabilitação e odontologia estética de alto padrão cresceu 340% nos últimos 3 anos no Google. Estar posicionado de forma ultra-premium é o fator decisivo para captar esse público qualificado.',

    diagItems: [
      { title: 'Visual aquém do ticket de alta performance', desc: 'Pacientes de estética de alto padrão buscam sofisticação extrema. Se o posicionamento digital da clínica parecer genérico ou datado, há uma desconexão imediata com o valor dos tratamentos premium, gerando desconfiança de preço.' },
      { title: 'Ausência de provas sociais integradas de forma imersiva', desc: 'Para tratamentos conservadores de lentes de resina, a prova visual é o fator número um de conversão. Faltam fotos de antes/depois interativas e depoimentos estruturados logo na página inicial.' },
      { title: 'Excesso de explicações puramente técnicas', desc: 'O paciente busca a transformação do seu sorriso, a recuperação da sua autoestima e um atendimento humanizado. Termos extremamente técnicos afastam o leigo, que compra a experiência de beleza e saúde.' },
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
    colorRationale: 'O azul é a cor mais associada a saúde, confiança e higiene na psicologia do consumidor. Combinado com tons brancos e o acento dourado, cria uma atmosfera de clínica premium e tecnológica, afastando a sensação de "consultório popular".',

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
    compConclusion: 'A estrutura física do Instituto Dr. Leandro Luka e da Oralfix Odonto é fantástica, mas no ambiente digital, concorrentes locais com posicionamentos premium de velocidade e UX captam a maior parte dos leads que buscam na web.',

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
    ctaWhatsapp: '+55 (48) 99806-5099',
    ctaMessage: 'This dossier was prepared exclusively for the leadership of Chiropractic and Movement Studio (Dr. Karen Maley). We would love to schedule a 15-minute call to walk you through these findings and answer your questions. No commitment, no pressure — just clarity on the untapped revenue your clinic is leaving on the table due to Weebly limitations.',

    marketContext: 'The U.S. chiropractic market is valued at $19.5 billion (IBISWorld 2024). Miami-Dade County ranks among the top 5 metro areas for wellness searches, with patients actively seeking non-surgical pain relief, sports rehab, and athletic performance solutions.',
    marketContext2: 'The search term "sports chiropractor near me" has grown 310% in the last 3 years in the Pinecrest and Kendall areas. Active individuals and CrossFit athletes choose providers based on website speed, credibility, and mobile user experience before ever booking.',

    diagItems: [
      { title: 'Weebly platform limits responsiveness & speed', desc: 'The site is hosted on Weebly, generating sluggish load times, limiting local SEO visibility, and preventing high-end interactive visual storytelling suited for premium athletes.' },
      { title: 'Dr. Karen\\\'s bio and authority are buried on home', desc: 'Dr. Karen Maley\\\'s credentials and athletic background are secondary. Her biography and certifications are nested in hard-to-reach subpages instead of the main page fold.' },
      { title: 'No prominent floating booking CTAs', desc: 'While the clinic leverages Janeapp for bookings, there are no floating booking elements that stay with the user as they scroll on mobile, leading to a conversion loss of up to 35%.' },
      { title: 'Lack of visible testimonials and recovery proof', desc: 'For an athletic rehabilitation clinic, visible proof of recovery and social testimonials right on the home page flow are vital to establish clinical trust before scheduling.' }
    ],

    colorPalette: [
      { hex: '#10b981', name: 'Emerald Green (Primary)', usage: 'CTAs, highlights — Healing, energy, athletic movement' },
      { hex: '#064e3b', name: 'Deep Emerald (Secondary)', usage: 'Headers, dark accents — Premium authority and strength' },
      { hex: '#f0fdf4', name: 'Mint Cream (Background)', usage: 'Light sections — Clean, fresh, balanced feel' },
      { hex: '#111827', name: 'Charcoal Dark (Text)', usage: 'Body copy — Maximum readability and contrast' },
      { hex: '#f59e0b', name: 'Warm Amber (Accent)', usage: 'Star ratings, trust badges — Exclusivity and trust' },
      { hex: '#ef4444', name: 'Signal Red (Urgency)', usage: 'Urgency notifications, pain relief — Quick action' }
    ],
    colorRationale: 'Emerald Green is psychologically associated with health, movement, and recovery. Combined with Deep Emerald and Charcoal, it creates a sports-focused, high-end athletic brand identity suited for CrossFit athletes and active patients in Miami.',

    typography: [
      { role: 'Headlines', font: 'Montserrat', weight: 'Bold 700', sample: 'Optimize Your Movement. Live Pain-Free.', reason: 'A geometric sans-serif typeface that communicates strength, modern style, and athletic performance.' },
      { role: 'Body Text', font: 'Inter', weight: 'Regular 400', sample: 'Book your sports chiropractic session online in seconds.', reason: 'A modern, neutral sans-serif designed for high readability on small viewports and print formats.' }
    ],
    typoPersonality: 'athletic strength and modern clinical precision',

    competitors: [
      { criteria: 'Mobile Speed', leaders: '1.1s', yours: '5.2s (Weebly)' },
      { criteria: 'Visual Authority', leaders: 'Custom Premium', yours: 'Basic Weebly Layout' },
      { criteria: 'Patient Testimonials', leaders: 'Video + Written', yours: 'Hidden on Subpage' },
      { criteria: 'Online Booking UX', leaders: 'Instant 1-Click', yours: 'Standard Link (Janeapp)' },
      { criteria: 'Google Local SEO', leaders: 'Page 1 Organic', yours: 'Weak Local Optimization' },
      { criteria: 'Mobile Responsiveness', leaders: 'Fully Optimized', yours: 'Basic Weebly Template' }
    ],
    compConclusion: 'Your clinical expertise and locations inside CrossFit boxes are incredible advantages. However, your Weebly website fails to convey this premium positioning. Local competitors with modern, fast websites are capturing high-value athletes searching on Google.',

    improvements: [
      { impact: 'High', title: 'Migration from Weebly to Native Code', desc: 'Rebuild the landing page in ultra-fast HTML5/Tailwind/GSAP, reducing mobile load time from 5.2s to sub-1s.' },
      { impact: 'High', title: 'Optimized Mobile Booking Funnel', desc: 'Implement fixed and floating elements connecting visitors directly to your Janeapp agenda.' },
      { impact: 'High', title: 'Highlight Dr. Karen\\\'s Clinical Authority', desc: 'Position Dr. Karen\\\'s photo and sports background on the home page fold to generate instant trust.' },
      { impact: 'Medium', title: 'Google Reviews & Testimonials Integration', desc: 'Display 5-star Google Reviews and patient success stories directly on the home page flow.' },
      { impact: 'Medium', title: 'Optimized Local SEO Strategy', desc: 'Inject sports chiropractic schema markups and target local searches in Pinecrest and Kendall.' },
      { impact: 'Low', title: 'Performance & Mobility Blog', desc: 'Share mobility drills and CrossFit recovery tips to rank organically on search engines.' }
    ],

    solutionBlocks: [
      { icon: 'fa-solid fa-dumbbell', title: 'Athletic UI/UX', desc: 'Custom visuals and layouts designed specifically to convert athletes and active individuals.' },
      { icon: 'fa-solid fa-bolt', title: 'Sub-Second Loading', desc: 'Clean, optimized code that loads in under 1 second on mobile devices, preventing bounce.' },
      { icon: 'fa-solid fa-bullseye', title: 'Persuasive Copywriting', desc: 'Benefit-driven headlines focusing on recovery, mobility, and pain-free movement.' },
      { icon: 'fa-solid fa-calendar-check', title: 'Seamless Janeapp Booking', desc: 'Floating booking elements that guide the user to schedule their visit in 1 click.' },
      { icon: 'fa-solid fa-chart-simple', title: 'Performance Analytics', desc: 'Complete conversion tracking of appointments, clicks, and traffic source channels.' },
      { icon: 'fa-solid fa-shield-halved', title: 'SSL Security + CDN', desc: 'Global CDN distribution and secure SSL encryption to safeguard all digital interactions.' }
    ],
    conversionCurrent: '0.5%', conversionNew: '3.5%', patientsOld: '5', patientsNew: '35'
  });
}

run();
`;

  await fs.writeFile(filePath, baseContent + newPart);
  console.log('rebuild_pdfs.mjs updated successfully!');
}

updateFile();
