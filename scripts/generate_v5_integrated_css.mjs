import fs from 'fs';

fs.mkdirSync('public/css', { recursive: true });
let css = fs.readFileSync('public/home-v5/assets/goodfella.css', 'utf8');

// Remove regras perigosas que afetam o body globalmente na home principal
css = css.replace(/body\s*\{[^}]*position:\s*fixed[^}]*\}/g, '/* body position fixed removed */');
css = css.replace(/body\s*\{[^}]*overflow:\s*hidden[^}]*\}/g, '/* body overflow hidden removed */');
css = css.replace(/body\s*\{[^}]*overscroll-behavior:\s*none[^}]*\}/g, '/* body overscroll removed */');
css = css.replace(/body\s*\{[^}]*height:\s*100%[^}]*\}/g, '/* body height 100% removed */');
css = css.replace(/body\s*\{[^}]*min-height:\s*100svh[^}]*\}/g, '/* body min-height removed */');
css = css.replace(/body\s*\{[^}]*display:\s*flex[^}]*\}/g, '/* body display flex removed */');

const extraLightStyle = `
/* =========================================================================
   REGRAS ESPECÍFICAS PARA AS SEÇÕES V5 INTEGRADAS NA HOME PRINCIPAL
   ========================================================================= */

@media (min-width: 1024px) {
  .lg\\:hidden { display: none !important; }
  .lg\\:block { display: block !important; }
}
@media (max-width: 1023px) {
  .hidden { display: none !important; }
  .lg\\:hidden { display: block !important; }
}

[data-theme="light"],
section[data-page-builder-section="cardsSection"],
section[data-page-builder-section="animatedListSection"],
section[data-page-builder-section="indexedGridSection"] {
  background-color: #f4f4f4 !important;
  color: #141314 !important;
}

.bg-brand, [data-brand] {
  background-color: #ff4d00 !important;
}

/* 1. SEÇÃO MÉTRICAS (Cards 4 Colunas) */
[data-page-builder-section="cardsSection"] {
  background-color: #f4f4f4 !important;
  color: #141314 !important;
  padding: 6rem 0 !important;
}
[data-page-builder-section="cardsSection"] .grid-container {
  max-width: 1380px !important;
  width: calc(100% - 4rem) !important;
  margin: 0 auto !important;
}
[data-page-builder-section="cardsSection"] .grid-layout {
  display: block !important;
}
[data-page-builder-section="cardsSection"] .grid-cols-1,
[data-page-builder-section="cardsSection"] [class*="grid-cols"] {
  display: grid !important;
  grid-template-columns: repeat(4, 1fr) !important;
  gap: 1.5rem !important;
}
@media (max-width: 1023px) {
  [data-page-builder-section="cardsSection"] .grid-cols-1,
  [data-page-builder-section="cardsSection"] [class*="grid-cols"] {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}
@media (max-width: 640px) {
  [data-page-builder-section="cardsSection"] .grid-cols-1,
  [data-page-builder-section="cardsSection"] [class*="grid-cols"] {
    grid-template-columns: 1fr !important;
  }
}
[data-page-builder-section="cardsSection"] .min-h-\\[250px\\],
[data-page-builder-section="cardsSection"] .min-h-\\[300px\\],
[data-page-builder-section="cardsSection"] .min-h-\\[450px\\] {
  min-height: 440px !important;
  height: 440px !important;
  box-sizing: border-box !important;
}
[data-page-builder-section="cardsSection"] .bg-background-muted {
  background-color: #ffffff !important;
  border: 1px solid #e2e2e2 !important;
  border-radius: 4px;
}
[data-page-builder-section="cardsSection"] img {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  display: block !important;
  border-radius: 4px;
}
[data-page-builder-section="cardsSection"] .text-h1 {
  font-size: clamp(3rem, 4.4vw, 4.6rem) !important;
  font-weight: 300 !important;
  line-height: 1 !important;
  color: #141314 !important;
  display: flex !important;
  align-items: center !important;
  height: 1.15em !important;
  overflow: hidden !important;
}
[data-page-builder-section="cardsSection"] div[style*="height: 1em;"],
[data-page-builder-section="cardsSection"] .overflow-hidden {
  height: 1em !important;
  max-height: 1em !important;
  overflow: hidden !important;
  position: relative !important;
}
[data-page-builder-section="cardsSection"] [data-roller-inner] {
  display: flex !important;
  flex-direction: column !important;
  will-change: transform !important;
}
[data-page-builder-section="cardsSection"] [data-roller-inner] > div {
  height: 1em !important;
  line-height: 1em !important;
  font-size: inherit !important;
  color: #141314 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

/* 2. SEÇÃO COMO OPERAMOS (Processo com Dot e Foto Lateral) */
[data-page-builder-section="animatedListSection"] {
  background-color: #f4f4f4 !important;
  color: #141314 !important;
  position: relative !important;
}
[data-page-builder-section="animatedListSection"] .grid-container {
  max-width: 1380px !important;
  width: calc(100% - 4rem) !important;
  margin: 0 auto !important;
}
[data-page-builder-section="animatedListSection"] .grid-span-8.flex {
  display: flex !important;
  flex-direction: row !important;
  align-items: flex-start !important;
  justify-content: space-between !important;
  gap: 4rem !important;
  width: 100% !important;
}
[data-page-builder-section="animatedListSection"] .lg\\:flex-\\[1\\.1\\] {
  flex: 1.2 !important;
  width: 55% !important;
}
[data-page-builder-section="animatedListSection"] .aspect-\\[4\\/5\\] {
  aspect-ratio: 4 / 5 !important;
  flex: 1 !important;
  width: 42% !important;
  max-width: 480px !important;
  border-radius: 4px;
  overflow: hidden !important;
  box-shadow: 0 20px 40px rgba(0,0,0,0.06);
}
[data-page-builder-section="animatedListSection"] img {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
}
[data-page-builder-section="animatedListSection"] .text-h2 {
  font-size: clamp(2.4rem, 4vw, 3.8rem) !important;
  color: #141314 !important;
  font-weight: 500 !important;
  line-height: 1.1 !important;
}
[data-page-builder-section="animatedListSection"] .text-h4 {
  font-size: 1.55rem !important;
  color: #141314 !important;
  font-weight: 600 !important;
  letter-spacing: -0.01em !important;
}
[data-page-builder-section="animatedListSection"] .text-foreground-muted {
  color: #666666 !important;
  line-height: 1.55 !important;
}

/* 3. SEÇÃO PROJETOS EM DESTAQUE */
[data-page-builder-section="featuredWorkSection"] {
  background-color: #0c0b10 !important;
  color: #ffffff !important;
  padding: 6rem 0 !important;
  position: relative !important;
}
[data-page-builder-section="featuredWorkSection"] .grid-container {
  max-width: 1380px !important;
  width: calc(100% - 4rem) !important;
  margin: 0 auto !important;
}
[data-page-builder-section="featuredWorkSection"] .text-h2 {
  font-size: clamp(2.4rem, 4vw, 3.8rem) !important;
  color: #ffffff !important;
  font-weight: 500 !important;
  line-height: 1.1 !important;
}
[data-page-builder-section="featuredWorkSection"] .grid-layout {
  display: flex !important;
  flex-direction: row !important;
  justify-content: space-between !important;
  align-items: flex-start !important;
  gap: 3.5rem !important;
  width: 100% !important;
}
[data-page-builder-section="featuredWorkSection"] .grid-span-3 {
  flex: 0 0 35% !important;
  width: 35% !important;
}
[data-page-builder-section="featuredWorkSection"] .grid-span-8.grid-start-5 {
  flex: 0 0 62% !important;
  width: 62% !important;
}
[data-page-builder-section="featuredWorkSection"] .aspect-\\[16\\/10\\] {
  aspect-ratio: 16 / 10 !important;
  border-radius: 6px;
  overflow: hidden !important;
}
[data-page-builder-section="featuredWorkSection"] .aspect-\\[16\\/10\\] img {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
}

/* 4. SEÇÃO O PADRÃO ESCOM (6 Cards Técnicos) */
[data-page-builder-section="indexedGridSection"] {
  background-color: #f4f4f4 !important;
  color: #141314 !important;
  padding: 6rem 0 !important;
}
[data-page-builder-section="indexedGridSection"] .grid-container {
  max-width: 1380px !important;
  width: calc(100% - 4rem) !important;
  margin: 0 auto !important;
}
[data-page-builder-section="indexedGridSection"] .text-h2 {
  font-size: clamp(2.4rem, 4vw, 3.8rem) !important;
  color: #141314 !important;
  font-weight: 500 !important;
  line-height: 1.1 !important;
}
[data-page-builder-section="indexedGridSection"] .grid-layout {
  display: grid !important;
  grid-template-columns: repeat(3, 1fr) !important;
  gap: 2.5rem 2rem !important;
}
@media (max-width: 1023px) {
  [data-page-builder-section="indexedGridSection"] .grid-layout {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}
@media (max-width: 640px) {
  [data-page-builder-section="indexedGridSection"] .grid-layout {
    grid-template-columns: 1fr !important;
  }
}
[data-page-builder-section="indexedGridSection"] .text-accent {
  color: #141314 !important;
  font-weight: 700 !important;
  font-size: 1.1rem !important;
  letter-spacing: 0.04em !important;
}
[data-page-builder-section="indexedGridSection"] .text-foreground-muted {
  color: #555555 !important;
  line-height: 1.65 !important;
  font-size: 0.95rem !important;
}
[data-page-builder-section="indexedGridSection"] .bg-border {
  background-color: #d0d0d0 !important;
  height: 1px !important;
  margin: 0.75rem 0 !important;
}
`;

fs.writeFileSync('public/css/escom-v5-integrated.css', css + extraLightStyle);
console.log('public/css/escom-v5-integrated.css gerado com sucesso! Tamanho:', (css + extraLightStyle).length);
