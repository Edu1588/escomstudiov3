/**
 * Envia email de prospecção para um lead do Supabase via Resend.
 *
 * Uso:
 *   npx tsx scripts/enviar-email-lead.ts --leadId "academia-gavies-24h-premium---taquaral-campinas" --para "email@destino.com"
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import Groq from "groq-sdk";
import { Resend } from "resend";

const args = process.argv.slice(2);
function arg(name: string, fallback = ""): string {
  const i = args.indexOf(`--${name}`);
  return i !== -1 ? args[i + 1] : fallback;
}

const LEAD_ID  = arg("leadId");
const PARA     = arg("para");

if (!LEAD_ID || !PARA) {
  console.error("❌ Uso: npx tsx scripts/enviar-email-lead.ts --leadId <id> --para <email>");
  process.exit(1);
}

const SUPABASE_URL     = process.env.SUPABASE_URL || "";
const SUPABASE_SVC_KEY = process.env.SUPABASE_SERVICE_KEY || "";
const RESEND_KEY       = process.env.RESEND_API_KEY || "";
const GROQ_KEY         = process.env.GROQ_API_KEY || "";

async function buscarLead() {
  const url = `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/leads?id=eq.${encodeURIComponent(LEAD_ID)}&select=*&limit=1`;
  const res = await fetch(url, {
    headers: { apikey: SUPABASE_SVC_KEY, Authorization: `Bearer ${SUPABASE_SVC_KEY}` },
  });
  const rows: any[] = await res.json();
  return rows?.[0] || null;
}

async function gerarEmailGroq(lead: any, siteUrl: string): Promise<string> {
  if (!GROQ_KEY) return "";
  const groq = new Groq({ apiKey: GROQ_KEY });
  const prompt = `Você é Eduardo Santos, especialista em estratégias para aumentar a lucratividade de negócios locais.
Escreva um email de prospecção PERSONALIZADO seguindo EXATAMENTE o formato abaixo.

Dados do negócio:
- Nome: ${lead.nome}
- Nicho: ${lead.categoria}
- Cidade: ${lead.cidade}
- Avaliação Google: ${lead.rating || "N/A"} estrelas (${lead.reviews_count || 0} avaliações)
- PageSpeed mobile: ${lead.diagnostico?.pagespeed?.performance ?? "N/A"}%
- URL do site gerado: ${siteUrl}

FORMATO OBRIGATÓRIO:
Oi, [primeiro nome ou apelido].

Sou Eduardo Santos, especialista em estratégias para aumentar a lucratividade de negócios locais.

Encontrei a [nome] no Google e vi que vocês têm [X] estrelas e [Y] avaliações.

Ou seja: vocês já têm reputação.

E para gerar mais oportunidades de negócio, montei essa página especificamente para vocês:
→ ${siteUrl}

E para aumentar seus lucros...

Quero fazer uma análise gratuita e sem compromisso da [nome] e mostrar, na prática, onde vejo as brechas deixadas pelos concorrentes e as oportunidades do mercado.

Para alinhar os detalhes, marcamos uma conversa de 15 minutos. Eu mostro o que encontrei, explico como fazer um projeto lucrativo no seu negócio.

55 13 98106-2787
Eduardo Santos

REGRAS:
- Tom direto entre profissionais, sem ser vendedor
- NÃO mencione ESCOM Studio no corpo
- Retorne APENAS o HTML do corpo (sem html/head/body)
- fonte Arial/sans-serif, cor #333, line-height 1.8
- Máximo 180 palavras`;

  const r = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.6,
    max_tokens: 2000,
  });
  let raw = r.choices?.[0]?.message?.content || "";
  if (raw.includes("```html")) raw = raw.split("```html")[1].split("```")[0].trim();
  else if (raw.includes("```")) raw = raw.split("```")[1].split("```")[0].trim();
  return raw.length > 50 ? raw : "";
}

async function main() {
  console.log(`\n📧 Enviando email de prospecção`);
  console.log(`   Lead ID: ${LEAD_ID}`);
  console.log(`   Destino: ${PARA}\n`);

  console.log("📡 Buscando lead no Supabase...");
  const lead = await buscarLead();
  if (!lead) { console.error("❌ Lead não encontrado"); process.exit(1); }
  console.log(`   ✅ ${lead.nome} | ${lead.rating}⭐ (${lead.reviews_count} avaliações)`);

  const siteUrl = lead.site_gerado || `https://www.escomstudio.com.br/api/site-preview/${LEAD_ID}`;
  const nomeSlug = (lead.nome || "").toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 20);
  const finalSiteUrl = lead.site_gerado || `https://${nomeSlug}.escomstudio.com.br`;

  console.log("🤖 Gerando copy do email com Groq...");
  let emailHtml = await gerarEmailGroq(lead, finalSiteUrl);

  if (!emailHtml) {
    console.warn("   ⚠️  Groq falhou — usando template fixo");
    const primeiroNome = lead.nome.split(/[\s']/)[0];
    emailHtml = `
      <p style="font-family:Arial,sans-serif;color:#333;font-size:15px;line-height:1.8;margin:0 0 16px">Oi, ${primeiroNome}.</p>
      <p style="font-family:Arial,sans-serif;color:#333;font-size:15px;line-height:1.8;margin:0 0 16px">Sou Eduardo Santos, especialista em estratégias para aumentar a lucratividade de negócios locais.</p>
      <p style="font-family:Arial,sans-serif;color:#333;font-size:15px;line-height:1.8;margin:0 0 16px">Encontrei a ${lead.nome} no Google e vi que vocês têm ${lead.rating} estrelas e ${lead.reviews_count} avaliações.<br>Ou seja: vocês já têm reputação.</p>
      <p style="font-family:Arial,sans-serif;color:#333;font-size:15px;line-height:1.8;margin:0 0 16px">E para gerar mais oportunidades de negócio, montei essa página especificamente para vocês:<br>→ <a href="${finalSiteUrl}" style="color:#0a0a14">${finalSiteUrl}</a></p>
      <p style="font-family:Arial,sans-serif;color:#333;font-size:15px;line-height:1.8;margin:0 0 16px">Quero fazer uma análise gratuita e sem compromisso da ${lead.nome} e mostrar, na prática, onde vejo as brechas deixadas pelos concorrentes.</p>
      <p style="font-family:Arial,sans-serif;color:#333;font-size:15px;line-height:1.8;margin:0 0 16px">Para alinhar os detalhes, marcamos uma conversa de 15 minutos.</p>
      <p style="font-family:Arial,sans-serif;color:#333;font-size:15px;line-height:1.8;margin:32px 0 0">
        <a href="https://wa.me/5513981062787" style="color:#0a0a14;text-decoration:none">55 13 98106-2787</a><br>
        <strong>Eduardo Santos</strong>
      </p>`;
  } else {
    console.log("   ✅ Copy gerada com sucesso");
  }

  const assunto = `RE: Sua página ${lead.nome} para aumentar seus lucros → ${finalSiteUrl}`;
  const emailFinal = `
    <div style="max-width:580px;margin:0 auto;background:#fff;padding:40px 32px">
      ${emailHtml}
      <p style="font-family:Arial,sans-serif;color:#bbb;font-size:10px;margin-top:48px;border-top:1px solid #eee;padding-top:16px">
        Para não receber mais mensagens, responda com "remover".
      </p>
    </div>`;

  // Preview do email gerado
  const bodyTexto = emailHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 600);
  console.log(`\n📝 Preview do email:\n${"─".repeat(50)}\n${bodyTexto}\n${"─".repeat(50)}`);

  console.log(`\n📤 Enviando via Resend...`);
  const resend = new Resend(RESEND_KEY);
  const result = await resend.emails.send({
    from: "Eduardo Santos <onboarding@resend.dev>",
    to: PARA,
    subject: assunto,
    html: emailFinal,
  });

  if (result.error) {
    console.error("❌ Resend erro:", result.error);
    process.exit(1);
  }

  console.log(`   ✅ Email enviado! ID: ${result.data?.id}`);
  console.log(`\n📬 Assunto: ${assunto}`);
  console.log(`   Para: ${PARA}\n`);
}

main().catch(err => { console.error("❌ Erro:", err.message); process.exit(1); });
