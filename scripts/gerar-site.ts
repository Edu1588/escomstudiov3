/**
 * Gera site-amostra localmente via Gemini e salva no Firebase.
 *
 * Uso:
 *   npm run gerar-site -- --nome "Jhom's Barbearia" --nicho "Barbearia" --cidade "Marilia" --telefone "(14) 99831-5675" --endereco "Av. João Martins Coelho, 2063" --website "https://www.cashbarber.com.br/jhomsbarbearia"
 *
 * Env vars necessárias em .env.local:
 *   GEMINI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { MercadoPagoConfig, Preference } from "mercadopago";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// ── Args ──────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
function arg(name: string, fallback = ""): string {
  const i = args.indexOf(`--${name}`);
  return i !== -1 ? args[i + 1] : fallback;
}

const NOME     = arg("nome",     "Empresa");
const NICHO    = arg("nicho",    "");
const CIDADE   = arg("cidade",   "");
const TELEFONE = arg("telefone", "");
const ENDERECO = arg("endereco", "");
const WEBSITE  = arg("website",  "");
const ESTADO   = arg("estado",   "SP");

// ── Credenciais ───────────────────────────────────────────────────────────────
const GEMINI_KEY       = process.env.GEMINI_API_KEY || "";
const SUPABASE_URL     = process.env.SUPABASE_URL || "";
const SUPABASE_SVC_KEY = process.env.SUPABASE_SERVICE_KEY || "";
const MP_ACCESS_TOKEN  = process.env.MERCADOPAGO_ACCESS_TOKEN || "";
const MP_PRECO         = Number(process.env.MERCADOPAGO_PRECO || "990");

if (!GEMINI_KEY) { console.error("❌ GEMINI_API_KEY não encontrada no .env.local"); process.exit(1); }

// ── Firebase ──────────────────────────────────────────────────────────────────
const firebaseConfig = {
  projectId: "escom-studio-portfolio",
  appId: "1:885439718303:web:531fc4658dd499cde713aa",
  apiKey: "AIzaSyDjDQAtyv_csEsFVZRsj1gYPLy81eDYKA8",
  authDomain: "escom-studio-portfolio.firebaseapp.com",
  firestoreDatabaseId: "(default)",
};
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

async function ensureAuth() {
  if (!auth.currentUser) {
    const email = process.env.FIREBASE_ADMIN_EMAIL || "";
    const password = process.env.FIREBASE_ADMIN_PASSWORD || "";
    if (!email || !password) throw new Error("FIREBASE_ADMIN_EMAIL e FIREBASE_ADMIN_PASSWORD não configurados");
    await signInWithEmailAndPassword(auth, email, password);
  }
}

// ── Supabase ──────────────────────────────────────────────────────────────────
async function buscarLeadSupabase(): Promise<any> {
  if (!SUPABASE_URL || !SUPABASE_SVC_KEY) return null;
  try {
    const nomeLower = NOME.toLowerCase().trim();
    let query = SUPABASE_URL.replace(/\/$/, "") + `/rest/v1/leads?select=*&limit=1`;
    if (WEBSITE) query += `&website=eq.${encodeURIComponent(WEBSITE)}`;
    else query += `&nome=ilike.${encodeURIComponent("%" + nomeLower + "%")}`;

    const res = await fetch(query, {
      headers: {
        apikey: SUPABASE_SVC_KEY,
        Authorization: `Bearer ${SUPABASE_SVC_KEY}`,
      },
    });
    if (!res.ok) return null;
    const rows = await res.json();
    return rows?.[0] || null;
  } catch { return null; }
}

// ── Geração de imagens por nicho ──────────────────────────────────────────────
function imagensPorNicho(niche: string): { hero: string; solution: string; about: string } {
  const n = niche.toLowerCase();
  if (n.includes("barbearia") || n.includes("barber") || n.includes("salão") || n.includes("beleza"))
    return {
      hero:     "https://images.unsplash.com/photo-1621607512022-6aecc4fed814?q=80&w=1200&auto=format&fit=crop",
      solution: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1200&auto=format&fit=crop",
      about:    "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1200&auto=format&fit=crop",
    };
  if (n.includes("restaurante") || n.includes("comida") || n.includes("pizzaria"))
    return {
      hero:     "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
      solution: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop",
      about:    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1200&auto=format&fit=crop",
    };
  if (n.includes("odonto") || n.includes("clínica") || n.includes("médica") || n.includes("saúde"))
    return {
      hero:     "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200&auto=format&fit=crop",
      solution: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop",
      about:    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop",
    };
  return {
    hero:     "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
    solution: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    about:    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
  };
}

// ── Prompt ────────────────────────────────────────────────────────────────────
function buildPrompt(lead: any, pid: string): string {
  const phone = TELEFONE.replace(/\D/g, "");
  const diagnostico = lead?.diagnostico || null;
  const pagespeed = diagnostico?.pagespeed || null;
  const geminiAnalysis = diagnostico ? {
    identidadeVisual: diagnostico.identidadeVisualUI,
    heuristicas: diagnostico.heuristicasNielsen,
    arquitetura: diagnostico.arquiteturaInformacao,
    acessibilidade: diagnostico.acessibilidade,
  } : null;

  const ratingStr = lead?.rating
    ? `${lead.rating} estrelas (${lead.reviews_count || 0} avaliações Google)`
    : "não disponível";
  const scoreStr = lead?.score_oportunidade ? `${lead.score_oportunidade}/100` : "não calculado";
  const psStr = pagespeed
    ? `Performance: ${pagespeed.performance}%, Acessibilidade: ${pagespeed.acessibilidade}%, SEO: ${pagespeed.seo}%`
    : "não disponível";
  const imgs = imagensPorNicho(NICHO);

  const isBarbearia = NICHO.toLowerCase().includes("barbearia") || NICHO.toLowerCase().includes("barber") || NICHO.toLowerCase().includes("salão");
  const accentColor = isBarbearia ? "#C9A035" : "#ff5a00";
  const accentColorDark = isBarbearia ? "#8B6A1A" : "#cc4400";

  const nichoDesign = isBarbearia ? `
ESTÉTICA OBRIGATÓRIA — BARBEARIA PREMIUM (nível Behance/Awwwards):
- Visual EDITORIAL masculino de luxo, inspirado em barbearias europeias e americanas vintage
- Fotografias FULL-BLEED sem bordas nem caixas — imagem vai de ponta a ponta da tela
- Overlay escuro sobre fotos: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.85) 100%)
- H1 do hero: fonte Playfair Display italic 900, tamanho 6rem desktop / 3.5rem mobile, ocupando ~70% da largura
- Lettering dividido em linhas dramáticas: linha 1 normal, linha 2 em dourado (#C9A035), linha 3 normal
- Linha decorativa horizontal dourada (2px, width 80px) entre titulo e subtitulo do hero
- Textura sutil: grain overlay com opacity 0.04 usando SVG feTurbulence no body
- Numeração de seções: 01, 02, 03... em fonte monospace, cor #C9A035, font-size 0.7rem, letter-spacing 0.3em
- Cards sem glass — usar bordas finas de 1px #C9A035/30 em fundo #111111
- Ícones em SVG inline estilo vintage (tesoura, navalha, pente) — nao usar emoji
- Separadores de secao: linha fina 1px #C9A035/20 com margem automatica
- Servicos com grid assimetrico: 1 card grande (2 cols) + 2 cards pequenos por linha
- Depoimentos com aspas tipograficas gigantes " em Playfair Display, cor #C9A035/20, font-size 8rem, posicao absolute
- Stats em numeros grandes: font-size 4rem, Playfair Display, cor #C9A035` : `
ESTÉTICA — NEGÓCIO LOCAL PREMIUM:
- Layout moderno limpo com glassmorphism cards
- Cor de acento #ff5a00 em CTAs e destaques`;

  return `Você é um Engenheiro de Front-end Sênior, Copywriter de Elite e Especialista em UI/UX da ESCOM Studio.
Gere o código HTML COMPLETO de uma Landing Page de ALTA conversão e visual PREMIUM para o lead abaixo.

════════════════════════════════════════
DADOS REAIS DA EMPRESA
════════════════════════════════════════
Nome: ${NOME}
Nicho: ${NICHO}
Cidade: ${CIDADE} - ${ESTADO}
Telefone: ${TELEFONE}
Endereço: ${ENDERECO}
Site atual: ${WEBSITE || "não possui"}
Avaliação Google: ${ratingStr}
Score de oportunidade: ${scoreStr}

════════════════════════════════════════
DIAGNÓSTICO TÉCNICO
════════════════════════════════════════
PageSpeed mobile: ${psStr}
Análise UX: ${geminiAnalysis ? JSON.stringify(geminiAnalysis) : "não disponível"}
${nichoDesign}

════════════════════════════════════════
TIPOGRAFIA E PALETA GLOBAIS
════════════════════════════════════════
FONTES:
- Títulos: Playfair Display (700, 900, italic 700) — gigantes, dramáticos, editoriais
- Corpo e UI: Plus Jakarta Sans (400, 500, 600, 700)

PALETA ${NICHO.toUpperCase()}:
- Fundo global: #0d0d0d
- Fundo seção alternada: #111111
- Cor de acento / ouro: ${accentColor}
- Acento escuro (hover): ${accentColorDark}
- Texto principal: #F0EAD6 (creme quente, não branco puro)
- Texto secundário: #8A8070
- Cor ESCOM Studio (Blocos A e C): #00d1ff

ESPAÇAMENTO:
- Seções: padding vertical 120px desktop, 80px mobile
- Container: max-width 1200px, padding lateral 24px
- Botões: height 52px, border-radius 4px, font-weight 700, letter-spacing 0.08em, text-transform uppercase, font-size 13px

ANIMAÇÕES:
- GSAP ScrollTrigger: fade-up stagger 0.15s, duration 0.9s, ease "power3.out", start "top 85%"
- Lenis smooth scroll: lerp 0.08, duration 1.2
- Hover em cards: transform translateY(-4px) + border-color ${accentColor} — transition 0.3s

════════════════════════════════════════
STACK TÉCNICA OBRIGATÓRIA (copiar exatamente)
════════════════════════════════════════
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"></script>

IMAGENS (usar exatamente estas URLs, sem modificar):
- Hero fullbleed: ${imgs.hero}
- Seção solução: ${imgs.solution}
- Seção sobre: ${imgs.about}
- Depoimento avatar 1: https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=80&h=80&fit=crop&crop=face
- Depoimento avatar 2: https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=80&h=80&fit=crop&crop=face
- Depoimento avatar 3: https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=80&h=80&fit=crop&crop=face

════════════════════════════════════════
SEO TÉCNICO OBRIGATÓRIO
════════════════════════════════════════
- <html lang="pt-br">
- <meta name="robots" content="noindex, nofollow">
- <meta name="viewport" content="width=device-width, initial-scale=1">
- <title>${NOME} | Proposta Exclusiva ESCOM Studio</title>
- Open Graph: og:title, og:description, og:type, og:image
- Schema.org JSON-LD: ${isBarbearia ? "HairSalon" : "LocalBusiness"} com name, address, telephone, aggregateRating
- Todos os <img> com loading="lazy" width e height definidos

════════════════════════════════════════
ESTRUTURA: 15 SEÇÕES COMPLETAS
════════════════════════════════════════

BLOCO B — SITE DO CLIENTE (acento: ${accentColor})

1. NAV (id="nav"): Fixo no topo. Fundo transparent → #0d0d0dcc ao scroll (JS). Logo "${NOME}" em Playfair Display italic. Links: Serviços, Sobre, Contato. CTA "Agendar" em botão dourado. Hamburger mobile.

2. HERO (id="hero"): 100vh. Imagem ${imgs.hero} FULL-BLEED (position absolute, object-fit cover, inset 0). Overlay duplo. Conteúdo centralizado verticalmente. Badge pequeno acima do H1: "DESDE 2015 — ${CIDADE.toUpperCase()}" em monospace uppercase letter-spacing 0.3em cor ${accentColor}. H1 em Playfair Display italic 900: headline específica de ${NOME} com palavra-chave em ${accentColor}. Linha decorativa ${accentColor} 2px 60px. Subtítulo em Plus Jakarta Sans 18px. Dois CTAs: primário "Agendar Agora via WhatsApp" → https://wa.me/55${phone}?text=Olá,+quero+agendar+um+horário e secundário outline "Nossos Serviços". GSAP stagger na entrada.

3. SERVIÇOS (id="servicos"): Fundo #111111. Label "01 — SERVIÇOS" em monospace ${accentColor}. H2 Playfair Display. Grid assimétrico: 1 card principal (span 2) + 2 menores. Cards com borda 1px ${accentColor}30, fundo #0d0d0d, hover borda ${accentColor}. Serviços reais do nicho ${NICHO}: corte, barba, pigmentação, etc. Cada card com ícone SVG inline, nome do serviço, descrição curta e preço estimado.

4. PROBLEMA (id="problema"): Fundo #0d0d0d. Label "02 — O PROBLEMA". H2 questionando a dor real do cliente em ${CIDADE}. Layout: texto à esquerda (40%) + 3 problemas listados à direita com número grande ${accentColor} e descrição. SEM cards com bordas todas, usar separadores horizontais finos.

5. SOLUÇÃO (id="solucao"): Imagem ${imgs.solution} FULL-BLEED à direita (50% da tela), texto à esquerda 50%. Label "03 — A SOLUÇÃO". H2 Playfair. 4 itens com check SVG dourado e texto específico de como ${NOME} resolve cada dor.

6. DIFERENCIAIS (id="diferenciais"): Fundo #111111. Label "04 — DIFERENCIAIS". H2. Grid 2x2 sem bordas visíveis — apenas número grande em ${accentColor}20, título do diferencial em negrito, descrição curta. Hover: número fica ${accentColor}80.

7. COMO FUNCIONA (id="como-funciona"): Label "05 — COMO FUNCIONA". 3 passos em linha horizontal (desktop) / vertical (mobile). Cada passo: número 01/02/03 gigante em Playfair ${accentColor}, título, descrição. Linha conectora entre passos (desktop).

8. DEPOIMENTOS (id="depoimentos"): Fundo #111111. Label "06 — DEPOIMENTOS". H2. Aspas tipográficas " em Playfair Display 8rem ${accentColor}15 absolute. 3 cards com texto do depoimento, avatar circular, nome e "Cliente em ${CIDADE}".${lead?.rating ? ` Nota de referência: ${lead.rating} estrelas.` : ""}

9. SOBRE (id="sobre"): Split 50/50. Esquerda: imagem ${imgs.about} full-height sem border-radius. Direita: Label "07 — SOBRE", H2 Playfair, texto história de ${NOME}, 3 stats em números Playfair grande ${accentColor} (ex: "+500 Clientes", "5 Anos", "4.9 Nota").

10. CTA FINAL (id="cta-final"): Fundo com imagem ${imgs.hero} + overlay escuro 85%. Texto centralizado. H2 Playfair italic urgência. Botão grande "Garantir Meu Horário" → https://wa.me/55${phone}?text=Quero+agendar+agora.

BLOCO A — PROPOSTA ESCOM STUDIO (acento: #00d1ff)

11. URGÊNCIA (id="banner-urgencia"): Fundo #00d1ff. Texto escuro #0a0a0a. Texto: "Proposta exclusiva para ${NOME} — válida por 72 horas". Contador regressivo animado em JS (72:00:00 decrescente).

12. DOSSIÊ (id="dossie"): Fundo #0a0a14. Borda superior 3px #00d1ff. Label em #00d1ff. H2 "Diagnóstico Digital: ${NOME}". 4 métricas em cards: Score ${scoreStr} / PageSpeed ${psStr} / Oportunidade identificada / ROI projetado em 6 meses. CTA "Ver Análise Completa" → /api/gerar-analise/${lead?.id || pid}.

13. INVESTIMENTO (id="investimento"): Fundo #0a0a14. De R$ 4.500 (riscado) por R$ ${MP_PRECO} (grande, negrito, cor #00d1ff). Lista de 8 entregáveis com check #00d1ff (site profissional, domínio 1 ano, hospedagem 1 ano, SEO técnico, painel admin, suporte 30 dias, integração WhatsApp, Google Analytics). Badge "Oferta válida 72h" piscando suavemente. CTA principal "Contratar Agora" → {{CHECKOUT_URL}} (botão grande, fundo #00d1ff, texto #0a0a0a, font-weight 700). Abaixo do botão: texto pequeno "Pagamento seguro via Pix, cartão ou boleto".

14. EXPANSÕES (id="expansoes"): Fundo #060610. H3 "Módulos de Expansão". Grid 2x2: CRM Inteligente R$97/mês, Chatbot IA R$147/mês, Dashboard Analytics R$97/mês, WhatsApp Bot R$197/mês. Cards com borda #00d1ff20 hover #00d1ff60.

BLOCO C — ESCOM STUDIO (acento: #00d1ff)

15. RODAPÉ (id="footer"): Fundo #03030a. Logo ESCOM STUDIO em #00d1ff. Tagline da agência. Coluna contatos. Botão "Contratar Agora" → {{CHECKOUT_URL}} com ícone de cadeado e texto "Pagamento 100% seguro". Copyright. Botão WhatsApp FIXO (position:fixed bottom:24px right:24px z-index:9999) → https://wa.me/55${phone}?text=Quero+saber+mais+sobre+a+proposta.

════════════════════════════════════════
REGRAS ABSOLUTAS
════════════════════════════════════════
1. PROIBIDO travessão (— ou –) no texto visível. Use vírgula ou ponto.
2. PROIBIDO frases genéricas: "Excelência em", "Bem-vindo", "Soluções inovadoras", "Compromisso com qualidade", "Transforme seu negócio"
3. TODA copy específica a ${NOME}, ${NICHO}, ${CIDADE}. Nenhuma frase genérica.
4. WhatsApp sempre com DDI: https://wa.me/55${phone}
5. Gere o HTML COMPLETO sem truncar. Todas as 15 seções.
6. Retorne APENAS o HTML. Comece com <!DOCTYPE html>. Sem markdown, sem explicações.
7. CSS inline via <style> tag no <head>. Não usar classes Tailwind para o design principal — Tailwind apenas para utilities de layout.
8. JavaScript no final do body: inicializar Lenis, GSAP ScrollTrigger, accordion do FAQ, nav scroll behavior, contador regressivo do banner.
9. REGRA CRÍTICA DE GSAP — HERO: O hero NUNCA usa ScrollTrigger. Os elementos do hero animam com gsap.from() disparado direto no DOMContentLoaded, sem ScrollTrigger. Exemplo correto:
   gsap.from("#hero .hero-content > *", { opacity: 0, y: 40, duration: 1, stagger: 0.15, ease: "power3.out", delay: 0.2 });
   Nunca usar gsap.to() com opacity:0 no hero, nunca usar ScrollTrigger no hero.
10. REGRA CRÍTICA DE GSAP — OUTRAS SEÇÕES: Todas as outras seções usam ScrollTrigger com once:true obrigatório (para não reverter ao rolar de volta) e toggleActions:"play none none none". Usar sempre gsap.from() com opacity partindo de 0, nunca gsap.set() separado. Exemplo:
    gsap.from(".animate-section", { opacity: 0, y: 50, duration: 0.9, stagger: 0.15, ease: "power3.out", scrollTrigger: { trigger: ".animate-section", start: "top 85%", once: true } });
11. Todo elemento animado deve ter CSS padrão: opacity: 1; visibility: visible; — GSAP sobrescreve no from() e restaura ao terminar.`;
}

// ── Geração via Gemini ────────────────────────────────────────────────────────
const MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-3.6-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash-002",
  "gemini-1.5-flash-8b",
];

async function chamarGemini(model: string, prompt: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 65536 },
      }),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`HTTP ${res.status}: ${err}`);
  }
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

async function gerarHtml(prompt: string): Promise<string> {
  for (const model of MODELS) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      console.log(`🤖 Tentando ${model} (tentativa ${attempt}/3)...`);
      try {
        let html = await chamarGemini(model, prompt);
        if (html.includes("```html")) html = html.split("```html")[1].split("```")[0].trim();
        else if (html.includes("```")) html = html.split("```")[1].split("```")[0].trim();
        html = html.trim().replace(/—/g, ",").replace(/–/g, ",");
        if (!html.startsWith("<!DOCTYPE html>") && !html.includes("<html")) {
          throw new Error("Resposta não é HTML válido");
        }
        console.log(`   ✅ Sucesso com ${model}`);
        return html;
      } catch (e: any) {
        const msg = e.message || "";
        const is503 = msg.includes("503") || msg.includes("UNAVAILABLE");
        const is429 = msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED");
        console.warn(`   ⚠️  ${model} tentativa ${attempt}: ${msg.slice(0, 120)}`);
        if (is429 || msg.includes("404")) break; // sem créditos ou modelo inexistente — próximo
        if (is503 && attempt < 3) {
          const wait = attempt * 15000;
          console.log(`   ⏳ Aguardando ${wait / 1000}s antes de tentar novamente...`);
          await new Promise(r => setTimeout(r, wait));
        }
      }
    }
  }
  throw new Error("Todos os modelos Gemini falharam");
}

// ── Mercado Pago ──────────────────────────────────────────────────────────────
async function criarPreferenciaMp(pid: string): Promise<{ checkoutUrl: string; preferenceId: string }> {
  if (!MP_ACCESS_TOKEN) {
    console.warn("   ⚠️  MERCADOPAGO_ACCESS_TOKEN não configurado — usando link de fallback WhatsApp");
    return { checkoutUrl: `https://wa.me/5514991234567?text=Quero+contratar+o+pacote+ESCOM`, preferenceId: "" };
  }
  const mp = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
  const preference = new Preference(mp);
  const result = await preference.create({
    body: {
      items: [{
        id: pid,
        title: `Site Profissional + Domínio 1 ano — ${NOME}`,
        quantity: 1,
        unit_price: MP_PRECO,
        currency_id: "BRL",
      }],
      notification_url: `https://www.escomstudio.com.br/api/mp-webhook`,
      back_urls: {
        success: `https://www.escomstudio.com.br/api/site-preview/${pid}?pago=1`,
        failure: `https://www.escomstudio.com.br/api/site-preview/${pid}?pago=0`,
        pending: `https://www.escomstudio.com.br/api/site-preview/${pid}?pago=pendente`,
      },
      auto_return: "approved",
      external_reference: pid,
      statement_descriptor: "ESCOM STUDIO",
    },
  });
  const checkoutUrl = result.init_point || result.sandbox_init_point || "";
  const preferenceId = result.id || "";
  console.log(`   💳 Preferência MP criada: ${preferenceId}`);
  return { checkoutUrl, preferenceId };
}

// ── Salva no Firebase ─────────────────────────────────────────────────────────
async function salvarNoFirebase(pid: string, html: string, lead: any, mpData: { checkoutUrl: string; preferenceId: string }) {
  console.log("🔥 Autenticando no Firebase...");
  await ensureAuth();
  const record = {
    companyName: NOME,
    niche: NICHO,
    status: "pending",
    deployedUrl: null,
    htmlContent: html,
    phone: TELEFONE,
    address: ENDERECO,
    website: WEBSITE,
    city: CIDADE,
    score: lead?.score_oportunidade || 0,
    rating: lead?.rating || null,
    mpPreferenceId: mpData.preferenceId,
    mpCheckoutUrl: mpData.checkoutUrl,
    mpPreco: MP_PRECO,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    expiraEm: Date.now() + 72 * 60 * 60 * 1000,
  };
  await setDoc(doc(db, "generated_sites", pid), record, { merge: true });
  console.log(`🔥 Salvo no Firebase: generated_sites/${pid}`);
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log("\n🚀 Escom — Gerador de Site Local");
  console.log(`   Empresa: ${NOME} | ${NICHO} | ${CIDADE}/${ESTADO}\n`);

  console.log("📡 Buscando dados do lead no Supabase...");
  const lead = await buscarLeadSupabase();
  if (lead) {
    console.log(`   ✅ Lead encontrado: score=${lead.score_oportunidade}, rating=${lead.rating}`);
    if (lead.diagnostico?.pagespeed) {
      console.log(`   📊 PageSpeed: perf=${lead.diagnostico.pagespeed.performance}%`);
    }
  } else {
    console.log("   ⚠️  Lead não encontrado no Supabase — gerando sem diagnóstico");
  }

  const pid = "site_" + Date.now();
  const prompt = buildPrompt(lead, pid);

  console.log("\n⏳ Gerando HTML (pode levar 30-120s)...");
  const startTime = Date.now();
  let html = await gerarHtml(prompt);
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`   ✅ HTML gerado em ${elapsed}s (${html.length.toLocaleString()} chars)`);

  console.log("\n💳 Criando preferência de pagamento no Mercado Pago...");
  const mpData = await criarPreferenciaMp(pid);
  html = html.replace(/\{\{CHECKOUT_URL\}\}/g, mpData.checkoutUrl);
  console.log(`   ✅ Link de checkout injetado no HTML`);

  await salvarNoFirebase(pid, html, lead, mpData);

  const previewUrl = `https://www.escomstudio.com.br/api/site-preview/${pid}`;

  // Salva URL de volta no Supabase para aparecer no card do lead
  if (lead && SUPABASE_URL && SUPABASE_SVC_KEY) {
    try {
      console.log("📡 Salvando link no lead do Supabase...");
      await fetch(`${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/leads?id=eq.${lead.id}`, {
        method: "PATCH",
        headers: {
          apikey: SUPABASE_SVC_KEY,
          Authorization: `Bearer ${SUPABASE_SVC_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ site_gerado: previewUrl }),
      });
      console.log("   ✅ Link salvo no lead");
    } catch (e: any) {
      console.warn("   ⚠️  Não foi possível salvar no Supabase:", e.message);
    }
  }

  console.log(`\n✅ Concluído!`);
  console.log(`   🌐 Visualizar: ${previewUrl}\n`);
}

main().catch(err => {
  console.error("❌ Erro:", err.message);
  process.exit(1);
});
