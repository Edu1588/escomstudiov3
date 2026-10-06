export function renderBarbershopLandingPage(lead: any, media: any, waEscomUrl: string, botaoAceitarUrl: string): string {
  const rating = lead.rating || "4.8";
  const reviews = lead.reviews_count || lead.reviewsCount || 101;
  const cidade = lead.cidade || "Marília";
  const telefone = lead.telefone || "(14) 99760-6662";
  const endereco = lead.endereco || "Marília, SP";
  const waLink = `https://wa.me/55${telefone.replace(/\D/g, "")}`;
  const nome = lead.nome || "Barbearia Los Hermanos";

  return `<!DOCTYPE html>
<html lang="pt-BR" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${nome} — Tradição, Estilo & Navalha Fina</title>
  <meta name="description" content="A experiência definitiva de cuidados masculinos em ${cidade}. Cortes clássicos, barboterapia tradicional e ambiente exclusivo.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #080808; color: #F5F5F5; }
    .font-serif-vintage { font-family: 'Cinzel', serif; }
    .gold-gradient-text {
      background: linear-gradient(135deg, #FFF0B8 0%, #D4AF37 50%, #AA771C 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .gold-gradient-bg {
      background: linear-gradient(135deg, #D4AF37 0%, #AA771C 100%);
    }
    .glass-card {
      background: rgba(18, 18, 18, 0.75);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(212, 175, 55, 0.15);
    }
    .glass-card:hover {
      border-color: rgba(212, 175, 55, 0.4);
      box-shadow: 0 10px 30px -10px rgba(212, 175, 55, 0.15);
    }
    .btn-green-vip {
      background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%);
      box-shadow: 0 4px 20px rgba(34, 197, 94, 0.35);
      transition: all 0.3s ease;
    }
    .btn-green-vip:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(34, 197, 94, 0.5);
    }
  </style>
</head>
<body class="bg-[#080808] text-neutral-200 antialiased selection:bg-[#D4AF37] selection:text-black">

  <!-- 1. BANNER FIXO DE URGÊNCIA (DEMONSTRAÇÃO EXCLUSIVA) -->
  <div id="escom-banner" class="sticky top-0 z-50 bg-[#0c0c0e]/95 backdrop-blur-md border-b border-emerald-500/30 text-white px-4 py-2.5 shadow-2xl">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
      <div class="flex items-center gap-2">
        <span class="relative flex h-2.5 w-2.5">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span class="font-bold text-emerald-400 uppercase tracking-wider">⚡ Protótipo Exclusivo para ${nome}</span>
        <span class="hidden md:inline text-neutral-400">| Proposta comercial sob medida disponível no rodapé</span>
      </div>
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-1.5 bg-black/80 px-2.5 py-1 rounded border border-emerald-500/30 text-emerald-300 font-mono font-bold">
          <span>⏳ Expira em:</span>
          <span id="countdown-timer" class="tracking-wider">47h 59m 59s</span>
        </div>
        <a href="#proposta-escom" class="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-black px-4 py-1 rounded-full text-xs transition-all shadow-md">
          Ver Oferta (R$ 990)
        </a>
      </div>
    </div>
  </div>

  <!-- 2. NAVBAR DA BARBEARIA -->
  <header class="sticky top-[45px] z-40 bg-black/80 backdrop-blur-xl border-b border-white/5">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
      <a href="#hero" class="flex items-center gap-3 group">
        <div class="w-10 h-10 rounded-full border border-[#D4AF37]/50 flex items-center justify-center bg-neutral-900 group-hover:border-[#D4AF37] transition">
          <svg class="w-5 h-5 text-[#D4AF37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/>
          </svg>
        </div>
        <div>
          <span class="font-serif-vintage text-xl font-bold tracking-wider text-white group-hover:text-[#D4AF37] transition block leading-none">${nome}</span>
          <span class="text-[10px] uppercase tracking-widest text-neutral-400">Tradição & Estilo em ${cidade}</span>
        </div>
      </a>

      <nav class="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-neutral-300">
        <a href="#servicos" class="hover:text-[#D4AF37] transition">Serviços & Preços</a>
        <a href="#sobre" class="hover:text-[#D4AF37] transition">A Barbearia</a>
        <a href="#diferenciais" class="hover:text-[#D4AF37] transition">Diferenciais</a>
        <a href="#galeria" class="hover:text-[#D4AF37] transition">Galeria</a>
        <a href="#avaliacoes" class="hover:text-[#D4AF37] transition">Avaliações</a>
        <a href="#contato" class="hover:text-[#D4AF37] transition">Localização</a>
      </nav>

      <a href="${waLink}" target="_blank" class="btn-green-vip inline-flex items-center gap-2.5 text-white px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider">
        <svg class="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.585 1.961.947 2.796.947 3.179 0 5.765-2.587 5.765-5.766 0-3.18-2.586-5.766-5.765-5.766zm9.969 5.766c0 5.503-4.477 9.98-9.969 9.98-1.748 0-3.385-.453-4.819-1.246l-5.212 1.367 1.391-5.084c-.883-1.488-1.391-3.226-1.391-5.087 0-5.503 4.477-9.98 9.969-9.98 5.502 0 9.969 4.477 9.969 9.98z"/></svg>
        <span>Agendar Horário</span>
      </a>
    </div>
  </header>

  <!-- 3. HERO CINEMATOGRÁFICO DE LUXO -->
  <section id="hero" class="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-white/5">
    <div class="absolute inset-0 z-0">
      <img src="${media.heroImage}" alt="${nome}" class="w-full h-full object-cover object-center filter brightness-[0.35] scale-105" />
      <div class="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/60 to-transparent"></div>
      <div class="absolute inset-0 bg-radial-gradient from-transparent via-[#080808]/40 to-[#080808]"></div>
    </div>

    <div class="max-w-5xl mx-auto px-4 py-24 relative z-10 text-center">
      <div class="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#D4AF37]/40 bg-black/60 backdrop-blur-md mb-8">
        <span class="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
        <span class="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">Tradição & Navalha Fina em ${cidade}</span>
      </div>

      <h1 class="font-serif-vintage text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-tight text-white mb-6">
        O Estilo Que <span class="gold-gradient-text">Impõe Respeito</span>
      </h1>

      <p class="text-neutral-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-10">
        Ambiente exclusivo, navalha aquecida e mestres barbeiros dedicados ao alinhamento perfeito do seu visual.
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
        <a href="${waLink}" target="_blank" class="w-full sm:w-auto btn-green-vip px-8 py-4 rounded-full font-extrabold text-sm uppercase tracking-wider text-white inline-flex items-center justify-center gap-3">
          <svg class="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.585 1.961.947 2.796.947 3.179 0 5.765-2.587 5.765-5.766 0-3.18-2.586-5.766-5.765-5.766zm9.969 5.766c0 5.503-4.477 9.98-9.969 9.98-1.748 0-3.385-.453-4.819-1.246l-5.212 1.367 1.391-5.084c-.883-1.488-1.391-3.226-1.391-5.087 0-5.503 4.477-9.98 9.969-9.98 5.502 0 9.969 4.477 9.969 9.98z"/></svg>
          <span>Agendar Horário VIP</span>
        </a>
        <a href="#servicos" class="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider text-neutral-200 border border-white/20 hover:border-[#D4AF37] hover:text-[#D4AF37] transition bg-black/40 backdrop-blur-md">
          Ver Menu de Serviços
        </a>
      </div>

      <div class="inline-flex items-center gap-4 bg-neutral-900/60 border border-white/10 px-6 py-2.5 rounded-full backdrop-blur-md text-xs text-neutral-300">
        <div class="flex text-amber-400 text-sm">★★★★★</div>
        <span class="font-bold text-white">${rating} no Google</span>
        <span class="text-neutral-500">•</span>
        <span>+${reviews} clientes atendidos</span>
      </div>
    </div>
  </section>

  <!-- 4. ESTATÍSTICAS / BARRA DE AUTORIDADE -->
  <section class="py-12 bg-neutral-950 border-b border-white/5">
    <div class="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      <div class="border-r border-white/5 last:border-0">
        <div class="font-serif-vintage text-3xl md:text-4xl font-extrabold text-[#D4AF37] mb-1">10+</div>
        <div class="text-xs uppercase tracking-widest text-neutral-400">Anos de Experiência</div>
      </div>
      <div class="border-r border-white/5 last:border-0">
        <div class="font-serif-vintage text-3xl md:text-4xl font-extrabold text-[#D4AF37] mb-1">100%</div>
        <div class="text-xs uppercase tracking-widest text-neutral-400">Navalhas Descartáveis</div>
      </div>
      <div class="border-r border-white/5 last:border-0">
        <div class="font-serif-vintage text-3xl md:text-4xl font-extrabold text-[#D4AF37] mb-1">4.9★</div>
        <div class="text-xs uppercase tracking-widest text-neutral-400">Excelência no Google</div>
      </div>
      <div>
        <div class="font-serif-vintage text-3xl md:text-4xl font-extrabold text-[#D4AF37] mb-1">Chopp & Café</div>
        <div class="text-xs uppercase tracking-widest text-neutral-400">Cortesia Para Clientes</div>
      </div>
    </div>
  </section>

  <!-- 5. MENU DE SERVIÇOS & PREÇOS (DESIGN INSPIRADO NO PINTEREST) -->
  <section id="servicos" class="py-24 bg-[#080808] relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto mb-16">
        <div class="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-3">Tabela de Serviços</div>
        <h2 class="font-serif-vintage text-3xl sm:text-5xl font-bold text-white mb-4">
          Menu de Cuidados & <span class="gold-gradient-text">Preços Claros</span>
        </h2>
        <p class="text-neutral-400 text-sm">
          Sem surpresas no caixa. Atendimento pontual com produtos de linha premium.
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Serviço 1 -->
        <div class="glass-card p-6 rounded-2xl flex flex-col justify-between transition-all group">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div class="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>
              </div>
              <span class="text-xs font-semibold px-2.5 py-1 rounded bg-neutral-900 border border-white/10 text-neutral-400">45 min</span>
            </div>
            <h3 class="font-serif-vintage text-xl font-bold text-white mb-2 group-hover:text-[#D4AF37] transition">Corte Degradê Navalhado</h3>
            <p class="text-neutral-400 text-xs leading-relaxed mb-6">Transição milimétrica na pele (Skin Fade), fade intermediário ou taper com finalização precisa na navalha.</p>
          </div>
          <div class="pt-4 border-t border-white/5 flex items-center justify-between">
            <div>
              <span class="text-[10px] text-neutral-400 block uppercase">A partir de</span>
              <span class="text-xl font-extrabold text-[#22C55E]">R$ 45</span>
            </div>
            <a href="${waLink}" target="_blank" class="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition uppercase tracking-wider">
              <span>Agendar</span>
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>

        <!-- Serviço 2 -->
        <div class="glass-card p-6 rounded-2xl flex flex-col justify-between transition-all group border-emerald-500/30">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </div>
              <span class="text-xs font-semibold px-2.5 py-1 rounded bg-neutral-900 border border-white/10 text-neutral-400">35 min</span>
            </div>
            <h3 class="font-serif-vintage text-xl font-bold text-white mb-2 group-hover:text-[#D4AF37] transition">Barboterapia com Toalha Quente</h3>
            <p class="text-neutral-400 text-xs leading-relaxed mb-6">Abertura de poros com toalha aquecida, óleos emolientes, alinhamento simétrico e massagem facial relaxante.</p>
          </div>
          <div class="pt-4 border-t border-white/5 flex items-center justify-between">
            <div>
              <span class="text-[10px] text-neutral-400 block uppercase">A partir de</span>
              <span class="text-xl font-extrabold text-[#22C55E]">R$ 35</span>
            </div>
            <a href="${waLink}" target="_blank" class="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition uppercase tracking-wider">
              <span>Agendar</span>
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>

        <!-- Serviço 3 -->
        <div class="glass-card p-6 rounded-2xl flex flex-col justify-between transition-all group">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div class="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <span class="text-xs font-bold px-2.5 py-1 rounded bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">Mais Pedido</span>
            </div>
            <h3 class="font-serif-vintage text-xl font-bold text-white mb-2 group-hover:text-[#D4AF37] transition">Combo VIP (Cabelo + Barba)</h3>
            <p class="text-neutral-400 text-xs leading-relaxed mb-6">A experiência completa: corte degradê ou clássico + barboterapia com hidratação de barba e acabamento perfeito.</p>
          </div>
          <div class="pt-4 border-t border-white/5 flex items-center justify-between">
            <div>
              <span class="text-[10px] text-neutral-400 block uppercase">A partir de</span>
              <span class="text-xl font-extrabold text-[#22C55E]">R$ 75</span>
            </div>
            <a href="${waLink}" target="_blank" class="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition uppercase tracking-wider">
              <span>Agendar</span>
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>

        <!-- Serviço 4 -->
        <div class="glass-card p-6 rounded-2xl flex flex-col justify-between transition-all group">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div class="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <span class="text-xs font-semibold px-2.5 py-1 rounded bg-neutral-900 border border-white/10 text-neutral-400">40 min</span>
            </div>
            <h3 class="font-serif-vintage text-xl font-bold text-white mb-2 group-hover:text-[#D4AF37] transition">Corte Clássico na Tesoura</h3>
            <p class="text-neutral-400 text-xs leading-relaxed mb-6">Esculpido mecha a mecha respeitando o redemoinho e o caimento natural para quem busca elegância tradicional.</p>
          </div>
          <div class="pt-4 border-t border-white/5 flex items-center justify-between">
            <div>
              <span class="text-[10px] text-neutral-400 block uppercase">A partir de</span>
              <span class="text-xl font-extrabold text-[#22C55E]">R$ 50</span>
            </div>
            <a href="${waLink}" target="_blank" class="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition uppercase tracking-wider">
              <span>Agendar</span>
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>

        <!-- Serviço 5 -->
        <div class="glass-card p-6 rounded-2xl flex flex-col justify-between transition-all group">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div class="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <span class="text-xs font-semibold px-2.5 py-1 rounded bg-neutral-900 border border-white/10 text-neutral-400">20 min</span>
            </div>
            <h3 class="font-serif-vintage text-xl font-bold text-white mb-2 group-hover:text-[#D4AF37] transition">Alinhamento & Pezinho</h3>
            <p class="text-neutral-400 text-xs leading-relaxed mb-6">Manutenção rápida entre cortes. Contorno impecável da nuca, costeletas e sobrancelha com navalha descartável.</p>
          </div>
          <div class="pt-4 border-t border-white/5 flex items-center justify-between">
            <div>
              <span class="text-[10px] text-neutral-400 block uppercase">A partir de</span>
              <span class="text-xl font-extrabold text-[#22C55E]">R$ 25</span>
            </div>
            <a href="${waLink}" target="_blank" class="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition uppercase tracking-wider">
              <span>Agendar</span>
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>

        <!-- Serviço 6 -->
        <div class="glass-card p-6 rounded-2xl flex flex-col justify-between transition-all group">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div class="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <span class="text-xs font-semibold px-2.5 py-1 rounded bg-neutral-900 border border-white/10 text-neutral-400">30 min</span>
            </div>
            <h3 class="font-serif-vintage text-xl font-bold text-white mb-2 group-hover:text-[#D4AF37] transition">Tratamento & Hidratação</h3>
            <p class="text-neutral-400 text-xs leading-relaxed mb-6">Revitalização profunda com produtos importados contra ressecamento e caspa, finalizado com tônico fortalecedor.</p>
          </div>
          <div class="pt-4 border-t border-white/5 flex items-center justify-between">
            <div>
              <span class="text-[10px] text-neutral-400 block uppercase">A partir de</span>
              <span class="text-xl font-extrabold text-[#22C55E]">R$ 40</span>
            </div>
            <a href="${waLink}" target="_blank" class="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition uppercase tracking-wider">
              <span>Agendar</span>
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 6. SOBRE A BARBEARIA (SPLIT-SCREEN ELEGANTE) -->
  <section id="sobre" class="py-24 bg-neutral-950 border-y border-white/5 relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
      <div class="space-y-6">
        <div class="text-[#D4AF37] text-xs font-bold uppercase tracking-widest">Nossa História</div>
        <h2 class="font-serif-vintage text-3xl sm:text-5xl font-bold text-white leading-tight">
          Mais Que Um Corte, <br><span class="gold-gradient-text">Um Ritual Masculino</span>
        </h2>
        <p class="text-neutral-300 text-sm md:text-base leading-relaxed font-light">
          A <strong class="text-white font-semibold">${nome}</strong> nasceu com a missão de resgatar o valor clássico da barbearia tradicional em ${cidade}. Um refúgio onde o homem moderno pode desacelerar, tomar uma bebida de cortesia e confiar seu estilo aos melhores profissionais da região.
        </p>
        <p class="text-neutral-400 text-sm leading-relaxed">
          Cada detalhe foi rigorosamente planejado: cadeiras retrô em couro confortável, toalhas aquecidas em temperatura precisa, iluminação perfeita para cortes sem falhas e navalhas 100% descartadas na sua frente.
        </p>
        <div class="pt-4 flex items-center gap-6">
          <div>
            <div class="text-2xl font-bold text-[#D4AF37] font-serif-vintage">100%</div>
            <div class="text-xs text-neutral-400">Higiene & Navalha Individual</div>
          </div>
          <div class="w-px h-10 bg-white/10"></div>
          <div>
            <div class="text-2xl font-bold text-[#D4AF37] font-serif-vintage">Zero</div>
            <div class="text-xs text-neutral-400">Tempo de Espera com Horário Marcado</div>
          </div>
        </div>
      </div>

      <div class="relative">
        <div class="relative rounded-2xl overflow-hidden border border-[#D4AF37]/30 shadow-2xl">
          <img src="${media.aboutImage}" alt="Sobre a ${nome}" class="w-full h-[450px] object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          <div class="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black/70 backdrop-blur-md border border-white/10">
            <p class="text-xs text-neutral-300 font-medium">"A navalha não perdoa a pressa. Aqui cada corte é uma obra executada com maestria."</p>
            <p class="text-[11px] text-[#D4AF37] font-bold mt-1">— Equipe ${nome}</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 7. DIFERENCIAIS EXCLUSIVOS -->
  <section id="diferenciais" class="py-20 bg-[#080808]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-xl mx-auto mb-16">
        <div class="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-2">Padrão de Qualidade</div>
        <h2 class="font-serif-vintage text-3xl sm:text-4xl font-bold text-white">Por Que Escolher a ${nome}?</h2>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="glass-card p-6 rounded-2xl text-center">
          <div class="w-12 h-12 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <h3 class="font-serif-vintage text-base font-bold text-white mb-2">Pontualidade Britânica</h3>
          <p class="text-neutral-400 text-xs leading-relaxed">Seu tempo é sagrado. Você agenda pelo WhatsApp e é atendido exatamente no minuto marcado.</p>
        </div>

        <div class="glass-card p-6 rounded-2xl text-center">
          <div class="w-12 h-12 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
          </div>
          <h3 class="font-serif-vintage text-base font-bold text-white mb-2">Chopp & Café Artesanal</h3>
          <p class="text-neutral-400 text-xs leading-relaxed">Enquanto aguarda ou relaxa durante a barboterapia, aprecie uma bebida selecionada por nossa conta.</p>
        </div>

        <div class="glass-card p-6 rounded-2xl text-center">
          <div class="w-12 h-12 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <h3 class="font-serif-vintage text-base font-bold text-white mb-2">Ambiente Climatizado</h3>
          <p class="text-neutral-400 text-xs leading-relaxed">Conforto térmico impecável, trilha sonora refinada (blues, jazz e rock clássico) e cadeiras anatômicas.</p>
        </div>

        <div class="glass-card p-6 rounded-2xl text-center">
          <div class="w-12 h-12 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h3 class="font-serif-vintage text-base font-bold text-white mb-2">Higiene Absoluta</h3>
          <p class="text-neutral-400 text-xs leading-relaxed">Navalhas e lâminas 100% descartáveis abertas na sua frente e esterilização de grau hospitalar em autoclave.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 8. GALERIA VISUAL DE TRABALHOS -->
  <section id="galeria" class="py-24 bg-neutral-950 border-t border-white/5">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-xl mx-auto mb-16">
        <div class="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-2">Portfólio de Cortes</div>
        <h2 class="font-serif-vintage text-3xl sm:text-5xl font-bold text-white">
          Galeria de <span class="gold-gradient-text">Resultados Reais</span>
        </h2>
        <p class="text-neutral-400 text-sm mt-3">Confira o acabamento e a precisão do nosso trabalho diário.</p>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${media.gallery.map((item: any, idx: number) => `
        <div class="group relative rounded-2xl overflow-hidden border border-white/10 bg-neutral-900 transition-all duration-300 hover:border-[#D4AF37]/50 shadow-xl">
          <div class="h-72 overflow-hidden">
            <img src="${item.url}" alt="${item.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6">
            <span class="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold mb-1">0${idx+1} • Trabalho Oficial</span>
            <h3 class="font-serif-vintage text-lg font-bold text-white">${item.title}</h3>
            <p class="text-xs text-neutral-300 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">${item.desc}</p>
          </div>
        </div>
        `).join("")}
      </div>
    </div>
  </section>

  <!-- 9. COMO FUNCIONA O ATENDIMENTO -->
  <section class="py-20 bg-[#080808]">
    <div class="max-w-5xl mx-auto px-4 text-center">
      <div class="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-2">Simplicidade & Respeito</div>
      <h2 class="font-serif-vintage text-3xl sm:text-4xl font-bold text-white mb-14">Como Funciona Seu Agendamento</h2>

      <div class="grid sm:grid-cols-4 gap-8">
        <div class="text-center">
          <div class="w-12 h-12 rounded-full gold-gradient-bg text-black font-serif-vintage font-extrabold text-lg flex items-center justify-center mx-auto mb-4">1</div>
          <h3 class="font-bold text-white text-sm mb-1">Escolha o Serviço</h3>
          <p class="text-neutral-400 text-xs">Corte degradê, barba ou combo completo.</p>
        </div>
        <div class="text-center">
          <div class="w-12 h-12 rounded-full gold-gradient-bg text-black font-serif-vintage font-extrabold text-lg flex items-center justify-center mx-auto mb-4">2</div>
          <h3 class="font-bold text-white text-sm mb-1">Agende no WhatsApp</h3>
          <p class="text-neutral-400 text-xs">Escolha o melhor dia e horário com resposta imediata.</p>
        </div>
        <div class="text-center">
          <div class="w-12 h-12 rounded-full gold-gradient-bg text-black font-serif-vintage font-extrabold text-lg flex items-center justify-center mx-auto mb-4">3</div>
          <h3 class="font-bold text-white text-sm mb-1">Aproveite a Cortesia</h3>
          <p class="text-neutral-400 text-xs">Chegue e relaxe com seu café ou chopp artesanal.</p>
        </div>
        <div class="text-center">
          <div class="w-12 h-12 rounded-full gold-gradient-bg text-black font-serif-vintage font-extrabold text-lg flex items-center justify-center mx-auto mb-4">4</div>
          <h3 class="font-bold text-white text-sm mb-1">Estilo Alinhado</h3>
          <p class="text-neutral-400 text-xs">Saia renovado e pronto para qualquer compromisso.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 10. DEPOIMENTOS DE CLIENTES REAIS -->
  <section id="avaliacoes" class="py-24 bg-neutral-950 border-t border-white/5">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-xl mx-auto mb-16">
        <div class="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-2">Quem Frequenta Recomenda</div>
        <h2 class="font-serif-vintage text-3xl sm:text-4xl font-bold text-white">Avaliações 5 Estrelas no Google</h2>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <div class="glass-card p-8 rounded-2xl relative">
          <div class="flex text-amber-400 text-sm mb-4">★★★★★</div>
          <p class="text-neutral-300 text-sm leading-relaxed mb-6 font-light">"Melhor barbearia de Marília disparado. O atendimento com hora marcada é rigoroso, nunca fiquei esperando. Barboterapia sensacional!"</p>
          <div class="flex items-center gap-3">
            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80" alt="Rodrigo Mendes" class="w-11 h-11 rounded-full object-cover border border-[#D4AF37]/50" />
            <div>
              <div class="font-bold text-white text-xs">Rodrigo Mendes</div>
              <div class="text-[10px] text-neutral-400">Cliente há 2 anos • Marília</div>
            </div>
          </div>
        </div>

        <div class="glass-card p-8 rounded-2xl relative border-amber-500/30">
          <div class="flex text-amber-400 text-sm mb-4">★★★★★</div>
          <p class="text-neutral-300 text-sm leading-relaxed mb-6 font-light">"Ambiente de primeira, cerveja gelada de cortesia e o corte na tesoura perfeito. Não troco os profissionais da Los Hermanos por nada."</p>
          <div class="flex items-center gap-3">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80" alt="Marcelo Alcantara" class="w-11 h-11 rounded-full object-cover border border-[#D4AF37]/50" />
            <div>
              <div class="font-bold text-white text-xs">Marcelo Alcantara</div>
              <div class="text-[10px] text-neutral-400">Cliente VIP • Marília</div>
            </div>
          </div>
        </div>

        <div class="glass-card p-8 rounded-2xl relative">
          <div class="flex text-amber-400 text-sm mb-4">★★★★★</div>
          <p class="text-neutral-300 text-sm leading-relaxed mb-6 font-light">"Minha barba sempre encravava até fazer a barboterapia com a toalha quente deles. Navalha descartável e acabamento impecável."</p>
          <div class="flex items-center gap-3">
            <img src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&q=80" alt="Thiago Sampaio" class="w-11 h-11 rounded-full object-cover border border-[#D4AF37]/50" />
            <div>
              <div class="font-bold text-white text-xs">Thiago Sampaio</div>
              <div class="text-[10px] text-neutral-400">Empresário • Marília</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 11. FAQ ACCORDION -->
  <section class="py-20 bg-[#080808]">
    <div class="max-w-3xl mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="font-serif-vintage text-2xl sm:text-3xl font-bold text-white">Dúvidas Frequentes</h2>
      </div>

      <div class="space-y-4">
        <div class="glass-card rounded-xl overflow-hidden">
          <button class="w-full px-6 py-4 text-left font-semibold text-sm text-white flex justify-between items-center" onclick="this.nextElementSibling.classList.toggle('hidden')">
            <span>Preciso agendar horário com antecedência?</span>
            <span class="text-[#D4AF37] font-bold text-lg">+</span>
          </button>
          <div class="px-6 pb-4 text-xs text-neutral-400 leading-relaxed hidden">
            Recomendamos o agendamento prévio via WhatsApp para garantir que você seja atendido sem esperas no seu horário de preferência.
          </div>
        </div>

        <div class="glass-card rounded-xl overflow-hidden">
          <button class="w-full px-6 py-4 text-left font-semibold text-sm text-white flex justify-between items-center" onclick="this.nextElementSibling.classList.toggle('hidden')">
            <span>Quais são as formas de pagamento aceitas?</span>
            <span class="text-[#D4AF37] font-bold text-lg">+</span>
          </button>
          <div class="px-6 pb-4 text-xs text-neutral-400 leading-relaxed hidden">
            Aceitamos Pix, cartões de crédito e débito de todas as bandeiras, além de pagamento em dinheiro.
          </div>
        </div>

        <div class="glass-card rounded-xl overflow-hidden">
          <button class="w-full px-6 py-4 text-left font-semibold text-sm text-white flex justify-between items-center" onclick="this.nextElementSibling.classList.toggle('hidden')">
            <span>A barbearia possui estacionamento?</span>
            <span class="text-[#D4AF37] font-bold text-lg">+</span>
          </button>
          <div class="px-6 pb-4 text-xs text-neutral-400 leading-relaxed hidden">
            Sim, temos vagas fáceis e seguras na frente e nas proximidades da barbearia em ${cidade}.
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 12. LOCALIZAÇÃO & HORÁRIOS DA BARBEARIA -->
  <section id="contato" class="py-20 bg-neutral-950 border-t border-white/5">
    <div class="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
      <div>
        <div class="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-2">Visite Nossa Unidade</div>
        <h2 class="font-serif-vintage text-3xl font-bold text-white mb-6">Localização & Contato</h2>
        <div class="space-y-4 text-sm text-neutral-300 mb-8">
          <p class="flex items-start gap-3">
            <span class="text-emerald-400 text-lg">📍</span>
            <span><strong>Endereço:</strong> ${endereco}</span>
          </p>
          <p class="flex items-center gap-3">
            <span class="text-emerald-400 text-lg">📞</span>
            <span><strong>WhatsApp / Telefone:</strong> ${telefone}</span>
          </p>
          <p class="flex items-center gap-3">
            <span class="text-emerald-400 text-lg">🕒</span>
            <span><strong>Horário:</strong> Segunda a Sexta: 09h às 20h | Sábado: 09h às 18h</span>
          </p>
        </div>
        <a href="${waLink}" target="_blank" class="btn-green-vip inline-flex items-center gap-2 text-white px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider">
          <span>Tirar Dúvidas no WhatsApp</span>
        </a>
      </div>

      <div class="glass-card p-4 rounded-2xl">
        <iframe title="Mapa" class="w-full h-72 rounded-xl filter invert-[0.9] hue-rotate-180" src="https://maps.google.com/maps?q=${encodeURIComponent(endereco)}&t=&z=15&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>
      </div>
    </div>
  </section>

  <!-- 13. SEÇÃO DE PROPOSTA COMERCIAL ESCOM STUDIO (VERDE DE ALTA CONVERSÃO) -->
  <section id="proposta-escom" class="py-24 bg-[#060607] relative overflow-hidden border-t-2 border-emerald-500/40">
    <div class="max-w-5xl mx-auto px-4 relative z-10 text-center">
      <div class="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-black text-xs uppercase rounded-full px-5 py-2 mb-6 tracking-widest shadow-xl">
        <span>⚡ OPORTUNIDADE EXCLUSIVA ESCOM STUDIO</span>
      </div>

      <h2 class="font-serif-vintage text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
        Gostou do que viu? Este site oficial pode ser seu <span class="text-[#22C55E]">hoje mesmo</span>
      </h2>
      <p class="text-neutral-300 max-w-3xl mx-auto mb-14 text-sm md:text-base leading-relaxed">
        A equipe de engenharia da <strong class="text-emerald-400 font-bold">ESCOM Studio</strong> desenvolveu este projeto personalizado para a <strong class="text-white">${nome}</strong> em ${cidade}. Um site moderno, ultra-rápido e preparado para transformar buscas do Google em clientes recorrentes.
      </p>

      <!-- Comparativo visual -->
      <div class="grid md:grid-cols-2 gap-8 mb-14 text-left max-w-4xl mx-auto">
        <div class="bg-neutral-900/80 p-8 rounded-2xl border border-red-500/30 shadow-xl">
          <div class="flex items-center gap-3 mb-4">
            <span class="w-8 h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-lg">✕</span>
            <h3 class="font-serif-vintage text-xl text-red-400 font-bold">Sem Site Oficial ou Só Instagram</h3>
          </div>
          <ul class="text-neutral-300 space-y-3 text-sm">
            <li class="flex items-start gap-2"><span class="text-red-400 font-bold">•</span><span><strong>Invisível nas buscas:</strong> Quando alguém pesquisa por barbearia em ${cidade}, encontra a concorrência.</span></li>
            <li class="flex items-start gap-2"><span class="text-red-400 font-bold">•</span><span><strong>Dependência de algoritmo:</strong> O Instagram entrega seus posts para menos de 10% dos clientes.</span></li>
            <li class="flex items-start gap-2"><span class="text-red-400 font-bold">•</span><span><strong>Perda de clientes:</strong> Clientes com pressa não acham o cardápio de serviços nem o WhatsApp rápido.</span></li>
          </ul>
        </div>

        <div class="bg-neutral-900/90 p-8 rounded-2xl border-2 border-emerald-500/60 shadow-2xl relative">
          <div class="absolute -top-3 right-6 bg-emerald-500 text-white text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-md">
            Padrão Recomendado
          </div>
          <div class="flex items-center gap-3 mb-4">
            <span class="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">✓</span>
            <h3 class="font-serif-vintage text-xl text-emerald-300 font-bold">Com o Site Oficial ESCOM Studio</h3>
          </div>
          <ul class="text-neutral-200 space-y-3 text-sm">
            <li class="flex items-start gap-2"><span class="text-emerald-400 font-bold">•</span><span><strong>Google em 1º Lugar:</strong> Destaque imediato com suas avaliações positivas visíveis.</span></li>
            <li class="flex items-start gap-2"><span class="text-emerald-400 font-bold">•</span><span><strong>Carregamento em 0.8s:</strong> Navegação fluida sem travar no celular ou no computador.</span></li>
            <li class="flex items-start gap-2"><span class="text-emerald-400 font-bold">•</span><span><strong>Agendamento em 1 clique:</strong> Menu claro com botão direto para seu WhatsApp.</span></li>
          </ul>
        </div>
      </div>

      <!-- BOX DE OFERTA EXCLUSIVA COM CORES VERDES DE CONVERSÃO -->
      <div style="background: linear-gradient(180deg, rgba(10,24,14,0.95) 0%, rgba(6,16,10,0.98) 100%); border: 2px solid #22C55E; box-shadow: 0 0 50px rgba(34,197,94,0.25);" class="p-8 md:p-12 rounded-3xl max-w-3xl mx-auto relative text-center">
        <span class="inline-block bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
          CONDIÇÃO ESPECIAL DE LANÇAMENTO
        </span>

        <div class="my-6">
          <div class="text-neutral-400 text-sm font-semibold mb-1">
            Valor Regular de Desenvolvimento: <span class="line-through text-red-400 font-bold text-lg">R$ 4.500</span>
          </div>
          <div class="text-4xl md:text-6xl font-black text-white flex items-center justify-center gap-2">
            <span class="text-2xl text-emerald-400 font-bold">R$</span>
            <span style="color: #22C55E; text-shadow: 0 0 25px rgba(34,197,94,0.45);" class="text-5xl md:text-7xl">990</span>
            <span class="text-xs text-emerald-200 font-bold uppercase tracking-wider bg-emerald-500/20 border border-emerald-500/40 px-3 py-1.5 rounded-lg self-center ml-2">Taxa Única</span>
          </div>
          <p class="text-emerald-400 font-bold text-sm mt-3 flex items-center justify-center gap-1.5">
            <span>✓</span> Economia imediata de R$ 3.510 • Sem mensalidades obrigatórias de manutenção
          </p>
        </div>

        <div class="grid sm:grid-cols-2 gap-4 text-left text-xs md:text-sm text-neutral-200 my-8 max-w-xl mx-auto bg-black/60 p-6 rounded-2xl border border-emerald-500/20">
          <div class="flex items-center gap-2.5"><span class="text-emerald-400 text-base font-black">✓</span><span><strong>Domínio .com.br</strong> registrado grátis por 1 ano</span></div>
          <div class="flex items-center gap-2.5"><span class="text-emerald-400 text-base font-black">✓</span><span><strong>Hospedagem rápida</strong> inclusa por 12 meses</span></div>
          <div class="flex items-center gap-2.5"><span class="text-emerald-400 text-base font-black">✓</span><span><strong>Animações fluidas</strong> de alta conversão</span></div>
          <div class="flex items-center gap-2.5"><span class="text-emerald-400 text-base font-black">✓</span><span><strong>Botão WhatsApp</strong> integrado com mensagem pronta</span></div>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
          <a href="${waEscomUrl}" target="_blank" style="background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%) !important; color: #FFFFFF !important; font-weight: 900 !important; box-shadow: 0 4px 25px rgba(34,197,94,0.45) !important;" class="w-full sm:w-auto inline-flex items-center justify-center gap-3 py-4 px-10 rounded-full text-base md:text-lg transition hover:scale-105">
            <svg class="w-6 h-6 fill-white" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.585 1.961.947 2.796.947 3.179 0 5.765-2.587 5.765-5.766 0-3.18-2.586-5.766-5.765-5.766zm9.969 5.766c0 5.503-4.477 9.98-9.969 9.98-1.748 0-3.385-.453-4.819-1.246l-5.212 1.367 1.391-5.084c-.883-1.488-1.391-3.226-1.391-5.087 0-5.503 4.477-9.98 9.969-9.98 5.502 0 9.969 4.477 9.969 9.98z"/></svg>
            <span>Aceitar Proposta & Publicar Site (R$ 990)</span>
          </a>
        </div>
        
        <div class="mt-4">
          <a href="${botaoAceitarUrl}" class="text-neutral-400 hover:text-emerald-300 text-xs underline transition">
            Ou acesse o contrato digital de prestação de serviços
          </a>
        </div>

        <p class="text-neutral-400 text-xs mt-6">Garantia incondicional de 7 dias • Entrega completa e no ar em até 72 horas úteis</p>
      </div>
    </div>
  </section>

  <!-- 14. RODAPÉ EXCLUSIVO DA BARBEARIA DO CLIENTE -->
  <footer class="bg-black border-t border-white/10 pt-16 pb-12 text-neutral-400 text-xs">
    <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12 text-left">
      <div>
        <div class="font-serif-vintage text-xl text-white font-bold mb-3 tracking-wide">${nome}</div>
        <p class="text-neutral-400 text-xs leading-relaxed mb-4">
          Barbearia de referência em ${cidade}. Excelência em atendimento, mestres barbeiros especializados e ambiente clássico exclusivo.
        </p>
        <div class="space-y-1.5 text-xs text-neutral-300">
          <p class="flex items-center gap-2"><span class="text-emerald-400">📍</span> ${endereco}</p>
          <p class="flex items-center gap-2"><span class="text-emerald-400">📞</span> ${telefone}</p>
        </div>
      </div>

      <div>
        <h4 class="font-serif-vintage text-sm text-white font-bold uppercase tracking-wider mb-4 border-b border-white/10 pb-2">Navegação</h4>
        <ul class="space-y-2 text-xs">
          <li><a href="#hero" class="hover:text-emerald-400 transition">Início</a></li>
          <li><a href="#servicos" class="hover:text-emerald-400 transition">Serviços & Preços</a></li>
          <li><a href="#sobre" class="hover:text-emerald-400 transition">A Barbearia</a></li>
          <li><a href="#diferenciais" class="hover:text-emerald-400 transition">Diferenciais</a></li>
          <li><a href="#galeria" class="hover:text-emerald-400 transition">Galeria</a></li>
          <li><a href="#avaliacoes" class="hover:text-emerald-400 transition">Avaliações</a></li>
        </ul>
      </div>

      <div>
        <h4 class="font-serif-vintage text-sm text-white font-bold uppercase tracking-wider mb-4 border-b border-white/10 pb-2">Horário de Atendimento</h4>
        <ul class="space-y-1.5 text-xs text-neutral-300 mb-4">
          <li class="flex justify-between"><span>Segunda a Sexta:</span> <strong class="text-white">09:00 – 20:00</strong></li>
          <li class="flex justify-between"><span>Sábado:</span> <strong class="text-white">09:00 – 18:00</strong></li>
          <li class="flex justify-between"><span>Domingo:</span> <span class="text-neutral-500">Fechado</span></li>
        </ul>
      </div>

      <div>
        <h4 class="font-serif-vintage text-sm text-white font-bold uppercase tracking-wider mb-4 border-b border-white/10 pb-2">Agendamentos</h4>
        <p class="text-xs text-neutral-400 leading-relaxed mb-4">
          Garanta seu horário com nossa equipe de especialistas de forma prática e rápida.
        </p>
        <a href="${waLink}" target="_blank" class="btn-green-vip inline-flex items-center gap-2 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition">
          <span>Agendar Horário no WhatsApp</span>
        </a>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500 text-[11px]">
      <p>© 2026 ${nome} • Todos os direitos reservados.</p>
      <p>Site desenvolvido por <a href="https://escomstudio.com.br" target="_blank" class="text-neutral-400 hover:text-white transition">ESCOM Studio</a></p>
    </div>
  </footer>

  <!-- 15. BOTÃO FLUTUANTE WHATSAPP -->
  <a href="${waLink}" target="_blank" class="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full transition-all hover:scale-110 shadow-2xl" style="box-shadow: 0 4px 25px rgba(37, 211, 102, 0.5);" title="Falar no WhatsApp">
    <svg class="w-9 h-9 fill-white" viewBox="0 0 24 24">
      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.585 1.961.947 2.796.947 3.179 0 5.765-2.587 5.765-5.766 0-3.18-2.586-5.766-5.765-5.766zm9.969 5.766c0 5.503-4.477 9.98-9.969 9.98-1.748 0-3.385-.453-4.819-1.246l-5.212 1.367 1.391-5.084c-.883-1.488-1.391-3.226-1.391-5.087 0-5.503 4.477-9.98 9.969-9.98 5.502 0 9.969 4.477 9.969 9.98z"/>
    </svg>
  </a>

  <!-- SCRIPT DE COUNTDOWN -->
  <script>
    (function initCountdown() {
      let remaining = 48 * 3600 - 15;
      const el = document.getElementById('countdown-timer');
      if (!el) return;
      setInterval(() => {
        if (remaining > 0) remaining--;
        const h = Math.floor(remaining / 3600);
        const m = Math.floor((remaining % 3600) / 60);
        const s = remaining % 60;
        el.textContent = String(h).padStart(2, '0') + 'h ' + String(m).padStart(2, '0') + 'm ' + String(s).padStart(2, '0') + 's';
      }, 1000);
    })();
  </script>
</body>
</html>`;
}
