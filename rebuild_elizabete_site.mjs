import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "fs";
import { join } from "path";
import * as cheerio from "cheerio";

// ─── DADOS DA DRA. ELIZABETE ───
const lead = {
  companyName: "Dra. Elizabete De Marchi",
  niche: "Biomedicina Estética",
  primaryHex: "#02c5ba",
  palette: ["#fdfbf9", "#faf8f5", "#c5a27e", "#02c5ba", "#2a241e"],
  phone: "(41) 99665-5769",
  email: "contato@draelizabete.com.br",
  address: "Rua Nicarágua, 847 - Sala 203 - Bacacheri, Curitiba - PR",
  slug: "dra-elizabete-de-marchi",
  website: "https://www.draelizabetedemarchi.com.br"
};

// ─── SCRAPER DE IMAGENS REAIS (mesma lógica do builder) ───
async function scrapeLeadRealImages(websiteUrl) {
  if (!websiteUrl || !websiteUrl.startsWith("http")) return [];
  try {
    const resp = await fetch(websiteUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
      signal: AbortSignal.timeout(8000)
    });
    if (!resp.ok) return [];
    const html = await resp.text();
    const $ = cheerio.load(html);
    const images = [];

    $("img").each((_i, el) => {
      let src = $(el).attr("src") || $(el).attr("data-src") || "";
      if (!src || src.startsWith("data:") || src.includes("base64")) return;
      try { src = new URL(src, websiteUrl).href; } catch { return; }
      const alt = ($(el).attr("alt") || "").toLowerCase();
      const cls = ($(el).attr("class") || "").toLowerCase();
      const id = ($(el).attr("id") || "").toLowerCase();
      const ignoreTerms = ["logo", "icon", "avatar", "thumbnail", "thumb", "menu", "close", "search", "arrow", "social", "spinner", "loading", "banner-ad", "pixel", "tracking"];
      if (ignoreTerms.some(t => alt.includes(t) || cls.includes(t) || id.includes(t) || src.includes(t))) return;
      const w = parseInt($(el).attr("width") || "0");
      const h = parseInt($(el).attr("height") || "0");
      const area = w * h;
      if (area > 0 && area < 10000) return;
      images.push({ src, area: area || 999999 });
    });

    $("[style*='background-image'], [style*=\"background-image\"]").each((_i, el) => {
      const style = $(el).attr("style") || "";
      const m = style.match(/url\(['"]?(.*?)['"]?\)/);
      if (!m) return;
      let src = m[1];
      try { src = new URL(src, websiteUrl).href; } catch { return; }
      if (images.some(i => i.src === src)) return;
      images.push({ src, area: 999999 });
    });

    images.sort((a, b) => b.area - a.area);
    const seen = new Set();
    return images.filter(i => { if (seen.has(i.src)) return false; seen.add(i.src); return true; }).slice(0, 5).map(i => i.src);
  } catch {
    return [];
  }
}

// ─── PALETA INTELIGENTE (mesma lógica do builder) ───
const hexToRgb = (h) => { const r = h.replace("#",""); return { r: parseInt(r.substring(0,2),16), g: parseInt(r.substring(2,4),16), b: parseInt(r.substring(4,6),16) }; };
const luminance = (h) => { if (!h || !/^#[0-9a-fA-F]{6}$/.test(h)) return 0.5; const c = hexToRgb(h); return (0.2126*c.r + 0.7152*c.g + 0.0722*c.b)/255; };
const isLight = (h) => luminance(h) > 0.5;

const palette = lead.palette;
const primaryHex = lead.primaryHex;

let brandBg, brandBgAlt, brandText, brandTextMuted, brandBorder, brandCard, brandAccent, brandAccentText, brandFooter, brandFooterText;

if (palette && Array.isArray(palette) && palette.length >= 5) {
  const sorted = [...palette].sort((a, b) => luminance(b) - luminance(a));
  brandBg = sorted[0];
  brandBgAlt = sorted[1];
  brandCard = sorted[1];
  brandText = sorted[4];
  brandFooter = sorted[4];
  const mid = sorted[2];
  brandTextMuted = mid;
  brandBorder = mid;
  brandAccent = primaryHex;
  brandAccentText = isLight(brandAccent) ? "#111827" : "#ffffff";
  const footerLum = luminance(brandFooter);
  brandFooterText = footerLum < 0.3 ? "#9ca3af" : footerLum < 0.6 ? "#6b7280" : "#374151";
} else {
  brandBg = "#ffffff"; brandBgAlt = "#f9fafb"; brandText = "#111827"; brandTextMuted = "#6b7280";
  brandBorder = "#e5e7eb"; brandCard = "#ffffff"; brandAccent = primaryHex;
  brandAccentText = isLight(brandAccent) ? "#111827" : "#ffffff";
  brandFooter = "#111827"; brandFooterText = "#9ca3af";
}

console.log("Paleta mapeada:");
console.log(`  brandBg: ${brandBg}`);
console.log(`  brandBgAlt: ${brandBgAlt}`);
console.log(`  brandAccent: ${brandAccent}`);
console.log(`  brandAccentText: ${brandAccentText}`);
console.log(`  brandText: ${brandText}`);
console.log(`  brandTextMuted: ${brandTextMuted}`);
console.log(`  brandBorder: ${brandBorder}`);
console.log(`  brandFooter: ${brandFooter}`);
console.log(`  brandFooterText: ${brandFooterText}`);

// ─── FALLBACK UNSPLASH (qualidade profissional para estética/saúde) ───
// [0] hero = ambiente clínica/tratamento, [1] about = foto profissional, [2] benefits = clínica
const unsplashPool = [
  "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1920&q=90",
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=900&q=85",
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&q=85",
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=900&q=85",
  "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=900&q=85",
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=900&q=85",
  "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=900&q=85"
];

// ─── HIERARQUIA: real > Unsplash > referencias ───
const realImages = await scrapeLeadRealImages(lead.website);
console.log(`Imagens reais scrapadas do site: ${realImages.length}`);
const heroBgImg = realImages[0] || unsplashPool[0];
const aboutImg = realImages[realImages.length > 1 ? 1 : 0] || unsplashPool[1];
const decorativeImg = realImages[2] || unsplashPool[2];
console.log(`heroBgImg: ${heroBgImg.substring(0,60)}...`);
console.log(`aboutImg: ${aboutImg.substring(0,60)}...`);
console.log(`decorativeImg: ${decorativeImg.substring(0,60)}...`);

// ─── WHATSAPP ───
const rawPhone = (lead.phone || "").replace(/\D/g, "");
const waPhone = rawPhone.startsWith("55") ? rawPhone : "55" + rawPhone;
const waMsg = encodeURIComponent(`Olá! Gostaria de saber mais sobre os procedimentos da ${lead.companyName}.`);
const waLink = `https://wa.me/${waPhone}?text=${waMsg}`;

// ─── SEÇÕES DO SITE ───
const esc = (s) => { if (!s) return ""; return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); };

const sections = {
  hero: true, about: true, services: true, benefits: true,
  testimonials: true, pricing: true, faq: true
};

let sectionsHtml = "";

// ─── BANNER DE URGÊNCIA (PROPOSTA) ───
sectionsHtml += `<div id="banner-urgencia" style="position:sticky;top:0;left:0;width:100%;padding:0.5rem 1rem;background:#dc2626;color:#fff;text-align:center;font-size:0.75rem;font-weight:700;z-index:500;box-shadow:0 2px 10px rgba(0,0,0,0.2);animation:pulse 2s infinite;">
  Proposta de implementação técnica disponível para aprovação de ${esc(lead.companyName)}. Válida por 3 dias.
</div>
<style>@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.85}}</style>`;

// ─── NAV ───
sectionsHtml += `<nav style="background:${brandBg};border-bottom:1px solid ${brandBorder};padding:1rem 5%;display:flex;justify-content:space-between;align-items:center;position:sticky;top:40px;z-index:100;">
  <div style="display:flex;align-items:center;gap:0.5rem;">
    <div style="width:2rem;height:2rem;border-radius:0.375rem;background:${brandAccent};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:0.75rem;">E</div>
    <span style="font-weight:800;font-size:1.125rem;color:${brandText};letter-spacing:-0.02em;">${esc(lead.companyName)}</span>
  </div>
  <a href="${esc(waLink)}" target="_blank" rel="noopener" style="background:${brandAccent};color:${brandAccentText};padding:0.5rem 1.5rem;border-radius:0.5rem;font-weight:700;font-size:0.75rem;text-decoration:none;text-transform:uppercase;letter-spacing:0.05em;">Fale Conosco</a>
</nav>`;

// ─── HERO (fundo accent + imagem real priority) ───
if (sections.hero) {
  const heroHasBg = !!heroBgImg;
  const heroBgStyle = heroBgImg ? `background-image:url(${esc(heroBgImg)});background-size:cover;background-position:center 30%;` : "";
  sectionsHtml += `<section style="position:relative;padding:6rem 5%;display:flex;flex-direction:column;align-items:center;text-align:center;overflow:hidden;min-height:80vh;background:#1a1a2e;${heroBgStyle}">
    <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0.55) 0%,rgba(0,0,0,0.7) 100%);"></div>
    <div style="position:relative;z-index:2;max-width:900px;">
      <div style="display:inline-block;padding:0.375rem 1rem;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.18);border-radius:999px;font-size:0.6875rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#fff;margin-bottom:2rem;">BIOMEDICINA ESTÉTICA AVANÇADA</div>
      <h1 style="font-size:clamp(2.25rem,5vw,4rem);font-weight:900;color:#fff;line-height:1.1;margin:0 0 1.5rem;letter-spacing:-0.03em;">Realce sua beleza de forma natural e segura</h1>
      <p style="font-size:1.125rem;color:rgba(255,255,255,0.85);max-width:650px;margin:0 auto 2rem;line-height:1.6;">${esc(lead.niche)} em Curitiba — protocolos exclusivos com tecnologia avançada e resultados que preservam sua identidade.</p>
      <a href="${esc(waLink)}" target="_blank" rel="noopener" style="display:inline-block;background:#02c5ba;color:#111827;padding:1rem 2.5rem;border-radius:0.5rem;font-weight:800;font-size:1rem;text-decoration:none;box-shadow:0 4px 20px rgba(0,0,0,0.2);transition:all 0.2s;">Agende sua Avaliação →</a>
    </div>
  </section>`;
}

// ─── ABOUT (fundo brandBg) ───
if (sections.about) {
  sectionsHtml += `<section id="about" style="padding:5rem 5%;background:linear-gradient(180deg,${brandBg} 0%,${brandBgAlt} 100%);border-top:4px solid ${brandAccent}22;display:flex;flex-direction:column;align-items:center;text-align:center;">
        ${aboutImg ? `<div style="max-width:280px;margin:0 auto 2rem;border-radius:1rem;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);"><img src="${esc(aboutImg)}" alt="Foto ${esc(lead.companyName)}" style="width:100%;display:block;" /></div>` : ""}
    <div style="max-width:800px;">
      <h2 style="font-size:clamp(1.75rem,3vw,2.75rem);font-weight:800;color:${brandText};margin:0 0 1rem;letter-spacing:-0.02em;">Sobre a Dra. Elizabete</h2>
      <div style="width:3rem;height:0.25rem;background:${brandAccent};border-radius:999px;margin:0 auto 2rem;"></div>
      <p style="font-size:1.125rem;line-height:1.8;color:${brandTextMuted};max-width:700px;margin:0 auto;">Com vasta experiência em Biomedicina Estética, a Dra. Elizabete De Marchi (CRBM-PR 9991) oferece atendimento personalizado focado em resultados naturais e segurança. Cada protocolo é desenhado para o seu biotipo, respeitando sua individualidade e realçando sua beleza única.</p>
    </div>
  </section>`;
}

// ─── SERVICES (fundo brandBgAlt) ───
if (sections.services) {
  const serviceImages = [
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=85",
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=85",
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=85",
    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=85"
  ];
  const services = [
    { title: "Toxina Botulínica (Botox)", description: "Suavização de rugas de expressão com resultado natural. Procedimento rápido com duração de 4 a 6 meses, perfeito para manter a pele jovem e descansada." },
    { title: "Preenchimento Facial", description: "Restauração de volume e contorno facial com ácido hialurônico. Lábios, bigode chinês, olheiras e mandíbula com resultados sutis e elegantes." },
    { title: "Bioestimuladores", description: "Estimulação de colágeno para flacidez facial e corporal. Sculptra, Radiesse e protocolos que devolvem firmeza e sustentação à pele de forma progressiva e duradoura." },
    { title: "Skinbooster & Peelings", description: "Hidratação profunda e renovação celular. Protocolos de rejuvenescimento que melhoram textura, luminosidade e viço da pele com mínimo downtime." }
  ];
  let cardsHtml = "";
  for (let sIdx = 0; sIdx < services.length; sIdx++) {
    const svc = services[sIdx];
    const svcImg = serviceImages[sIdx] || decorativeImg;
    cardsHtml += `<div style="background:${brandBg};border:1px solid ${brandBorder};border-radius:1rem;overflow:hidden;transition:all 0.3s;display:flex;flex-direction:column;box-shadow:0 1px 3px rgba(0,0,0,0.04);">
      <div style="height:12rem;overflow:hidden;"><img src="${esc(svcImg)}" alt="${esc(svc.title)}" style="width:100%;height:100%;object-fit:cover;" /></div>
      <div style="padding:1.5rem;flex:1;">
        <h3 style="font-size:1.125rem;font-weight:700;color:${brandText};margin:0 0 0.5rem;">${esc(svc.title)}</h3>
        <p style="font-size:0.875rem;color:${brandTextMuted};line-height:1.6;margin:0;">${esc(svc.description)}</p>
      </div>
    </div>`;
  }
  sectionsHtml += `<section style="padding:5rem 5%;background:${brandBgAlt};border-top:4px solid ${brandAccent}22;">
    <h2 style="font-size:clamp(1.75rem,3vw,2.5rem);font-weight:800;color:${brandText};text-align:center;margin:0 0 3rem;letter-spacing:-0.02em;">Procedimentos</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.5rem;max-width:1100px;margin:0 auto;">${cardsHtml}</div>
  </section>`;
}

// ─── BENEFITS (fundo brandBg) ───
  // Força imagem feminina/clínica no lugar de homem
  const benefitsImg = unsplashPool[3] || decorativeImg;
if (sections.benefits) {
  const benefits = [
    { title: "Atendimento Personalizado", description: "Consulta de 3h com mapeamento facial 3D para criar o protocolo ideal para seu biotipo e objetivos." },
    { title: "Produtos Premium", description: "Utilizamos marcas certificadas pela ANVISA como Allergan, Galderma, Merz - segurança e eficácia comprovadas." },
    { title: "Resultados Naturais", description: "Filosofia 'Beleza sem Exageros' — realçar sua beleza sem perder sua identidade facial." },
    { title: "Biossegurança Total", description: "Sala de procedimentos com rigorosos protocolos de esterilização e materiais descartáveis de uso único." }
  ];
  let benefitsHtml = "";
  for (const ben of benefits) {
    benefitsHtml += `<div style="display:flex;align-items:flex-start;gap:1rem;">
      <div style="width:2.5rem;height:2.5rem;border-radius:0.75rem;background:${brandAccent}15;display:flex;align-items:center;justify-content:center;color:${brandAccent};font-size:1.25rem;flex-shrink:0;">✓</div>
      <div>
        <h4 style="font-size:1.125rem;font-weight:700;color:${brandText};margin:0 0 0.375rem;">${esc(ben.title)}</h4>
        <p style="font-size:0.875rem;color:${brandTextMuted};line-height:1.6;margin:0;">${esc(ben.description)}</p>
      </div>
    </div>`;
  }
  sectionsHtml += `<section style="padding:5rem 5%;background:${brandBg};">
    <div style="max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:center;">
      <div>
        <h2 style="font-size:clamp(1.5rem,3vw,2.25rem);font-weight:800;color:${brandText};margin:0 0 2rem;letter-spacing:-0.02em;">Por que nos escolher?</h2>
        <div style="display:flex;flex-direction:column;gap:1.5rem;">${benefitsHtml}</div>
      </div>
      <div style="aspect-ratio:1;border-radius:1.5rem;background:${brandBgAlt};border:1px solid ${brandBorder};display:flex;align-items:center;justify-content:center;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.06);">
        <img src="${esc(benefitsImg)}" alt="Clínica" style="width:100%;height:100%;object-fit:cover;" />
      </div>
    </div>
  </section>`;
}

// ─── TESTIMONIALS (fundo brandBgAlt) ───
if (sections.testimonials) {
  const testimonials = [
    { name: "Carla M.", role: "Paciente", text: "Fiz protocolo de bioestimuladores com a Dra. Elizabete e o resultado superou minhas expectativas. Profissional extremamente competente e carinhosa. Super recomendo!" },
    { name: "Juliana R.", role: "Paciente", text: "Sempre tive medo de procedimentos estéticos, mas a Dra. me deixou super à vontade. O resultado do botox ficou muito natural, exatamente como eu queria." },
    { name: "Patrícia S.", role: "Paciente", text: "Consultório lindo, equipamentos modernos e a Dra. Elizabete é um amor de pessoa. O preenchimento labial ficou perfeito, voltei para fazer mais procedimentos." }
  ];
  let testHtml = "";
  for (const t of testimonials) {
    testHtml += `<div style="background:${brandBg};border:1px solid ${brandBorder};border-radius:1.25rem;padding:2rem;position:relative;box-shadow:0 1px 3px rgba(0,0,0,0.04);">
      <div style="position:absolute;top:-0.75rem;left:-0.75rem;width:2.5rem;height:2.5rem;border-radius:50%;background:${brandBgAlt};border:1px solid ${brandBorder};display:flex;align-items:center;justify-content:center;color:${brandAccent};font-size:1.25rem;">"</div>
      <p style="color:${brandTextMuted};font-style:italic;line-height:1.7;margin:0.5rem 0 1.5rem;font-size:0.9375rem;">${esc(t.text)}</p>
      <div style="display:flex;align-items:center;gap:0.75rem;">
        <div style="width:2.5rem;height:2.5rem;border-radius:50%;background:${brandAccent}15;display:flex;align-items:center;justify-content:center;color:${brandAccent};font-weight:700;font-size:0.875rem;">${esc(t.name[0])}</div>
        <div>
          <p style="font-weight:700;color:${brandText};margin:0;font-size:0.875rem;">${esc(t.name)}</p>
          <p style="color:${brandTextMuted};font-size:0.75rem;text-transform:uppercase;letter-spacing:0.05em;margin:0;">${esc(t.role)}</p>
        </div>
      </div>
    </div>`;
  }
  sectionsHtml += `<section style="padding:5rem 5%;background:${brandBgAlt};border-top:4px solid ${brandAccent}22;">
    <h2 style="font-size:clamp(1.5rem,3vw,2.25rem);font-weight:800;color:${brandText};text-align:center;margin:0 0 3rem;">O que dizem sobre nós</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1.5rem;max-width:1000px;margin:0 auto;">${testHtml}</div>
  </section>`;
}

// ─── PRICING (fundo accent) — sem valores, apenas como funciona ───
if (sections.pricing) {
  const steps = [
    { title: "1. Avaliação", desc: "Agende uma consulta de 3h com mapeamento facial 3D e análise do seu biotipo." },
    { title: "2. Protocolo", desc: "Criamos o plano de tratamento ideal para seus objetivos, com orçamento transparente." },
    { title: "3. Resultado", desc: "Acompanhamento personalizado em cada sessão até alcançar o resultado desejado." }
  ];
  let stepsHtml = "";
  for (const step of steps) {
    stepsHtml += `<div style="display:flex;align-items:flex-start;gap:1.25rem;">
      <div style="width:3rem;height:3rem;border-radius:1rem;background:${brandAccent};color:${brandAccentText};display:flex;align-items:center;justify-content:center;font-weight:900;font-size:1.25rem;flex-shrink:0;">${esc(step.title[0])}</div>
      <div>
        <h3 style="font-size:1.25rem;font-weight:700;color:#fff;margin:0 0 0.375rem;">${esc(step.title)}</h3>
        <p style="font-size:0.9375rem;color:rgba(255,255,255,0.7);line-height:1.6;margin:0;">${esc(step.desc)}</p>
      </div>
    </div>`;
  }
  sectionsHtml += `<section style="padding:5rem 5%;background:linear-gradient(135deg,${brandAccent} 0%,${brandText} 100%);">
    <div style="max-width:800px;margin:0 auto;">
      <h2 style="font-size:clamp(1.5rem,3vw,2.25rem);font-weight:800;color:#fff;text-align:center;margin:0 0 1rem;">Como Funciona</h2>
      <p style="color:rgba(255,255,255,0.7);text-align:center;max-width:500px;margin:0 auto 3rem;font-size:0.9375rem;">Valores personalizados conforme o protocolo indicado para você. Consulte condições.</p>
      <div style="display:flex;flex-direction:column;gap:2rem;">${stepsHtml}</div>
      <div style="text-align:center;margin-top:3rem;">
        <a href="${esc(waLink)}" target="_blank" rel="noopener" style="display:inline-block;background:#fff;color:${brandAccent};padding:1rem 3rem;border-radius:0.75rem;font-weight:800;font-size:1rem;text-decoration:none;box-shadow:0 4px 20px rgba(0,0,0,0.2);">Solicitar Orçamento</a>
      </div>
    </div>
  </section>`;
}

// ─── FAQ (fundo brandBgAlt) ───
if (sections.faq) {
  const faq = [
    { question: "Os procedimentos estéticos são dolorosos?", answer: "Utilizamos técnicas anestésicas locais e protocolos que minimizam o desconforto. A maioria dos pacientes relata apenas uma leve sensação de picada ou pressão durante a aplicação." },
    { question: "Quanto tempo dura o efeito do Botox?", answer: "O efeito do Botox dura em média de 4 a 6 meses. Recomendamos sessões de manutenção para preservar os resultados e evitar o reaparecimento completo das rugas." },
    { question: "Qual a diferença entre Botox e Preenchimento?", answer: "O Botox suaviza rugas de expressão relaxando a musculatura, enquanto o Preenchimento com ácido hialurônico devolve volume e contorno facial. São procedimentos complementares." },
    { question: "Os resultados ficam artificiais?", answer: "Não. Nossa filosofia é 'Beleza sem Exageros'. Trabalhamos com técnica sutil e progressiva, respeitando a anatomia do seu rosto para resultados naturais e elegantes." },
    { question: "Como funciona a avaliação inicial?", answer: "Agende uma consulta de avaliação de 3 horas, onde realizamos mapeamento facial 3D, análise do seu biotipo e criamos um protocolo totalmente personalizado para você." },
    { question: "Quanto tempo de recuperação (downtime) é necessário?", answer: "A maioria dos procedimentos permite retorno imediato às atividades. Bioestimuladores podem causar leve inchaço nos primeiros dias, mas sem necessidade de repouso." }
  ];
  let faqHtml = "";
  for (const f of faq) {
    faqHtml += `<details style="background:${brandBg};border:1px solid ${brandBorder};border-radius:0.75rem;overflow:hidden;margin-bottom:0.75rem;">
      <summary style="padding:1.25rem 1.5rem;font-weight:600;color:${brandText};cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;">
        <span>${esc(f.question)}</span>
        <span style="color:${brandAccent};font-size:0.875rem;transition:transform 0.2s;">▼</span>
      </summary>
      ${f.answer ? `<div style="padding:0 1.5rem 1.25rem;color:${brandTextMuted};line-height:1.7;font-size:0.9375rem;border-top:1px solid ${brandBorder};padding-top:1rem;">${esc(f.answer)}</div>` : ""}
    </details>`;
  }
  sectionsHtml += `<section style="padding:5rem 5%;background:${brandBgAlt};border-top:4px solid ${brandAccent}22;">
    <h2 style="font-size:clamp(1.5rem,3vw,2.25rem);font-weight:800;color:${brandText};text-align:center;margin:0 0 3rem;">Dúvidas Frequentes</h2>
    <div style="max-width:700px;margin:0 auto;">${faqHtml}</div>
  </section>`;
}

// ─── CONTACT (fundo brandBg) ───
const mapsUrl = `https://maps.google.com/maps?q=${encodeURIComponent(lead.address)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
sectionsHtml += `<section id="contact" style="padding:5rem 5%;background:${brandBg};">
  <div style="max-width:1100px;margin:0 auto;">
    <h2 style="font-size:clamp(1.75rem,3vw,2.5rem);font-weight:800;color:${brandText};text-align:center;margin:0 0 0.5rem;">Vamos transformar sua autoestima?</h2>
    <p style="color:${brandTextMuted};text-align:center;max-width:600px;margin:0 auto 3rem;font-size:0.9375rem;">Agende sua avaliação gratuita e descubra o protocolo ideal para realçar sua beleza natural.</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:3rem;">
      <div style="background:${brandBg};border:1px solid ${brandBorder};border-radius:1.25rem;padding:2rem;">
        <form onsubmit="var n=this.querySelector('[name=nome]').value,t=this.querySelector('[name=tel]').value,e=this.querySelector('[name=email]').value,m=this.querySelector('[name=msg]').value;window.open('https://wa.me/${waPhone}?text='+encodeURIComponent('Ol\u00E1! Me chamo '+n+'. Telefone: '+t+'. E-mail: '+e+'. Mensagem: '+m),'_blank');return false;">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
            <input type="text" name="nome" placeholder="Nome Completo" required style="width:100%;padding:0.875rem 1rem;background:${brandBgAlt};border:1px solid ${brandBorder};border-radius:0.75rem;color:${brandText};font-size:0.875rem;outline:none;box-sizing:border-box;" />
            <input type="text" name="tel" placeholder="Telefone" required style="width:100%;padding:0.875rem 1rem;background:${brandBgAlt};border:1px solid ${brandBorder};border-radius:0.75rem;color:${brandText};font-size:0.875rem;outline:none;box-sizing:border-box;" />
          </div>
          <input type="email" name="email" placeholder="E-mail" required style="width:100%;padding:0.875rem 1rem;background:${brandBgAlt};border:1px solid ${brandBorder};border-radius:0.75rem;color:${brandText};font-size:0.875rem;outline:none;margin-bottom:1rem;box-sizing:border-box;" />
          <textarea name="msg" placeholder="Conte um pouco sobre seus objetivos estéticos..." style="width:100%;padding:0.875rem 1rem;background:${brandBgAlt};border:1px solid ${brandBorder};border-radius:0.75rem;color:${brandText};font-size:0.875rem;outline:none;min-height:120px;resize:none;margin-bottom:1.5rem;box-sizing:border-box;font-family:inherit;"></textarea>
          <button type="submit" style="width:100%;padding:1rem;background:${brandAccent};color:${brandAccentText};border:none;border-radius:0.75rem;font-weight:800;font-size:1rem;cursor:pointer;transition:opacity 0.2s;">Enviar Solicitação →</button>
        </form>
      </div>
      <div style="display:flex;flex-direction:column;gap:1.5rem;">
        <div style="background:${brandBg};border:1px solid ${brandBorder};border-radius:1.25rem;padding:1.5rem;">
          <div style="display:flex;align-items:center;gap:0.75rem;padding:0.5rem 0;"><div style="width:2.25rem;height:2.25rem;border-radius:50%;background:${brandAccent}15;display:flex;align-items:center;justify-content:center;color:${brandAccent};font-size:0.875rem;">📞</div><div><p style="color:${brandTextMuted};font-size:0.625rem;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 0.125rem;font-weight:700;">WhatsApp</p><a href="${esc(waLink)}" target="_blank" rel="noopener" style="color:${brandText};font-weight:500;margin:0;text-decoration:none;">${esc(lead.phone)}</a></div></div>
          <div style="display:flex;align-items:center;gap:0.75rem;padding:0.5rem 0;"><div style="width:2.25rem;height:2.25rem;border-radius:50%;background:${brandAccent}15;display:flex;align-items:center;justify-content:center;color:${brandAccent};font-size:0.875rem;">✉</div><div><p style="color:${brandTextMuted};font-size:0.625rem;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 0.125rem;font-weight:700;">Email</p><p style="color:${brandText};font-weight:500;margin:0;">${esc(lead.email)}</p></div></div>
          <div style="display:flex;align-items:center;gap:0.75rem;padding:0.5rem 0;"><div style="width:2.25rem;height:2.25rem;border-radius:50%;background:${brandAccent}15;display:flex;align-items:center;justify-content:center;color:${brandAccent};font-size:0.875rem;">📍</div><div><p style="color:${brandTextMuted};font-size:0.625rem;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 0.125rem;font-weight:700;">Endereço</p><p style="color:${brandText};font-weight:500;margin:0;">${esc(lead.address)}</p></div></div>
        </div>
        <div style="background:${brandBgAlt};border:1px solid ${brandBorder};border-radius:1.25rem;overflow:hidden;flex:1;min-height:200px;">
          <iframe src="${esc(mapsUrl)}" style="width:100%;height:100%;min-height:200px;border:none;filter:grayscale(0.3) opacity(0.8);" loading="lazy"></iframe>
        </div>
      </div>
    </div>
  </div>
</section>`;

// ─── PROPOSTA COMERCIAL ESCOM ───
sectionsHtml += `<section id="proposta-comercial" style="padding:5rem 5%;background:#0a0a0a;color:#fff;border-top:8px solid ${brandAccent};">
  <div style="max-width:1000px;margin:0 auto;">
    <div style="text-align:center;margin-bottom:3rem;">
      <span style="display:inline-block;background:${brandAccent}15;color:${brandAccent};padding:0.25rem 1rem;border-radius:999px;font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;border:1px solid ${brandAccent}33;margin-bottom:1rem;">Proposta Exclusiva ESCOM Studio</span>
      <h2 style="font-size:clamp(1.75rem,3vw,2.5rem);font-weight:800;color:#fff;margin:0 0 1rem;">Investimento do Projeto</h2>
      <p style="color:#a1a1aa;max-width:600px;margin:0 auto;">Este é o escopo financeiro exato para a implementação do site da sua empresa, com design de alta performance e engenharia de conversão.</p>
    </div>

    <div style="max-width:600px;margin:0 auto;background:linear-gradient(180deg,#1c1917 0%,#18181b 100%);border:1px solid #444;border-radius:1.5rem;padding:2.5rem;position:relative;">
      <div style="position:absolute;top:0;right:0;background:${brandAccent};color:#111827;font-size:0.75rem;font-weight:900;padding:0.25rem 1rem;border-radius:0 1.5rem 0 1rem;text-transform:uppercase;letter-spacing:0.05em;">OFERTA DE PROSPECÇÃO</div>
      <h3 style="font-size:1.5rem;font-weight:700;color:#fff;margin:0 0 0.5rem;">Website de Conversão Ativa</h3>
      <p style="color:#a1a1aa;font-size:0.875rem;padding-bottom:1.5rem;border-bottom:1px solid #333;margin-bottom:1.5rem;">Design UI/UX Sob Medida, SEO, Responsividade Mobile-First, WhatsApp API, Copywriting Persuasivo.</p>

      <div style="background:rgba(0,0,0,0.5);border:1px solid #444;border-radius:1rem;padding:1.5rem;text-align:center;margin-bottom:1.5rem;">
        <p style="color:${brandAccent};font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 0.5rem;">Investimento Único</p>
        <div style="display:flex;align-items:baseline;justify-content:center;gap:0.25rem;">
          <span style="font-size:1.5rem;font-weight:700;color:#a1a1aa;">R$</span>
          <span style="font-size:3.5rem;font-weight:900;color:${brandAccent};">990</span>
          <span style="font-size:1rem;color:#a1a1aa;font-weight:500;">,00</span>
        </div>
        <p style="color:#666;font-size:0.625rem;margin-top:0.5rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Pagamento à vista via pix ou transferência</p>
      </div>

      <ul style="list-style:none;padding:0;margin:0 0 2rem;">
        <li style="display:flex;align-items:center;gap:0.75rem;padding:0.5rem 0;color:#d4d4d8;font-size:0.875rem;"><span style="color:${brandAccent};">✓</span> Configuração completa de domínio e hospedagem</li>
        <li style="display:flex;align-items:center;gap:0.75rem;padding:0.5rem 0;color:#d4d4d8;font-size:0.875rem;"><span style="color:${brandAccent};">✓</span> SEO integrado para posicionamento local</li>
        <li style="display:flex;align-items:center;gap:0.75rem;padding:0.5rem 0;color:#d4d4d8;font-size:0.875rem;"><span style="color:${brandAccent};">✓</span> Certificado SSL de Conexão Segura</li>
        <li style="display:flex;align-items:center;gap:0.75rem;padding:0.5rem 0;color:#d4d4d8;font-size:0.875rem;"><span style="color:${brandAccent};">✓</span> Suporte técnico prioritário de 30 dias</li>
        <li style="display:flex;align-items:center;gap:0.75rem;padding:0.5rem 0;color:#d4d4d8;font-size:0.875rem;"><span style="color:${brandAccent};">✓</span> <strong style="color:#fff;">Investimento único, sem mensalidades ou taxas ocultas</strong></li>
      </ul>

      <button id="btn-aceitar-proposta" style="width:100%;background:${brandAccent};color:#111827;border:none;border-radius:1rem;padding:1.25rem;font-size:1.125rem;font-weight:900;cursor:pointer;box-shadow:0 4px 20px ${brandAccent}44;transition:all 0.3s;">
        ACEITAR PROPOSTA AGORA →
      </button>
      <p style="text-align:center;color:#666;font-size:0.75rem;margin-top:1rem;">🔒 Contrato e Nota Fiscal emitidos logo após a aprovação.</p>
    </div>
  </div>
</section>`;

// ─── FOOTER ───
sectionsHtml += `<footer style="background:${brandFooter};padding:3rem 5%;text-align:center;">
  <p style="color:${brandFooterText};font-size:0.8125rem;margin:0 0 0.5rem;">© ${new Date().getFullYear()} ${esc(lead.companyName)}. Todos os direitos reservados.</p>
  <p style="color:#6b7280;font-size:0.6875rem;margin:0;">Feito com Escom Studio — Estratégia, Design & Conversão</p>
</footer>`;

// ─── MONTAR HTML COMPLETO ───
const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${esc(lead.companyName)} — ${esc(lead.niche)} em Curitiba</title>
<meta name="description" content="Dra. Elizabete De Marchi — Biomedicina Estética Avançada em Curitiba. Botox, Preenchimento, Bioestimuladores e mais. Resultados naturais com segurança.">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:${brandBg};color:${brandText}}
img{max-width:100%;height:auto}
a{color:inherit}
section{width:100%}
details summary::-webkit-details-marker{display:none}
details[open] summary span:last-child{transform:rotate(180deg)}
@media(max-width:768px){
  section{padding:3rem 1.25rem !important}
  #contact > div > div{grid-template-columns:1fr !important}
}
</style>
</head>
<body>
 ${sectionsHtml}
<script>
(function(){function n(){var e=localStorage.getItem("escom_lead_status_"+t)||localStorage.getItem("escom_lead_status");if(e==="pago"){var o=document.getElementById("banner-urgencia"),i=document.getElementById("proposta-comercial");if(o)o.style.display="none";if(i)i.style.display="none"}}var t=window.location.pathname.split("/").find(function(e){return e.indexOf("template-")===0})||"default";n();window.addEventListener("storage",function(e){if((e.key==="escom_lead_status"||e.key==="escom_lead_status_"+t)&&e.newValue==="pago")n()});var a=document.getElementById("btn-aceitar-proposta");if(a){a.addEventListener("click",function(e){e.preventDefault();a.innerHTML="Processando...";a.style.opacity="0.8";a.style.cursor="wait";setTimeout(function(){var o={id:"lead_"+Date.now(),empresa:"${esc(lead.companyName)}",status:"pagamento_pendente",valor:990,data:new Date().toISOString()};localStorage.setItem("escom_new_lead_conversion",JSON.stringify(o));window.dispatchEvent(new CustomEvent("escom-lead-converted",{detail:o}));a.innerHTML="PROPOSTA ACEITA!";a.style.background="#27272a";a.style.color="${brandAccent}";a.style.border="2px solid ${brandAccent}";a.style.cursor="not-allowed";a.style.opacity="1";alert("Obrigado! Seu aceite foi registrado. A equipe da ESCOM Studio entrará em contato.")},1500)})}document.addEventListener("contextmenu",function(e){e.preventDefault()});document.addEventListener("keydown",function(e){if((e.ctrlKey||e.metaKey)&&(e.key==="c"||e.key==="C"||e.key==="s"||e.key==="S"||e.key==="p"||e.key==="P")||e.key==="PrintScreen"){e.preventDefault()}});document.addEventListener("copy",function(e){e.clipboardData.setData("text/plain","");e.preventDefault()})})();
</script>
</body>
</html>`;

// ─── SALVAR ───
const outDir = join(process.cwd(), "dist-elizabete-rebuild");
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "index.html"), html, "utf-8");
console.log(`\n✅ Site salvo em: ${join(outDir, "index.html")}`);
console.log(`Tamanho: ${(html.length / 1024).toFixed(0)} KB`);
console.log(`Seções: hero about services benefits testimonials pricing faq contact footer`);
console.log(`Paleta: ${JSON.stringify([brandBg, brandBgAlt, brandAccent, brandTextMuted, brandText])}`);
