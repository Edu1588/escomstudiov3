import fs from 'fs';
import path from 'path';
import os from 'os';
import { exec } from 'child_process';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import dotenv from 'dotenv';

// Injetar envs
dotenv.config({ path: './.env.production.local' });
dotenv.config({ path: './.env.development.local' });
dotenv.config({ path: './.env.local' });
dotenv.config();

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Chamar API de Produção para IA (Bypass de chaves locais)
async function callProductionAI(promptText) {
  try {
    console.log("[REBUILD] Enviando prompt para a IA de produção (escom-studio.vercel.app)...");
    const response = await fetch("https://escom-studio.vercel.app/api/generate-copy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ promptText, jsonMode: false })
    });
    if (!response.ok) {
      console.error(`Erro na requisição: ${response.status} ${response.statusText}`);
      return null;
    }
    const data = await response.json();
    return data.success ? data.text : null;
  } catch (err) {
    console.error("Erro ao chamar a IA de produção:", err.message);
    return null;
  }
}

async function main() {
  const docId = process.argv[2];
  if (!docId) {
    console.error("ERRO: Por favor, forneça o ID do site. Exemplo: node scratch_rebuild_any_site.mjs site_auto_auto-mecanica-silva");
    process.exit(1);
  }

  console.log(`[REBUILD] Buscando dados de generated_sites/${docId}...`);
  
  const snap = await getDoc(doc(db, "generated_sites", docId));
  if (!snap.exists()) {
    console.error(`Documento ${docId} não encontrado no Firestore!`);
    process.exit(1);
  }
  
  const site = snap.data();
  const name = site.companyName || "Empresa";
  const niche = site.niche || "Serviços Premium";
  const phone = site.phone || "";
  const address = site.address || "";
  const primaryHex = site.primaryHex || "#00d1ff";
  
  let siteData = {};
  if (site.generatedPrompt) {
    try {
      let cleanJson = site.generatedPrompt;
      if (cleanJson.startsWith('```json')) cleanJson = cleanJson.replace(/^```json/, '').replace(/```$/, '').trim();
      else if (cleanJson.startsWith('```')) cleanJson = cleanJson.replace(/^```/, '').replace(/```$/, '').trim();
      siteData = JSON.parse(cleanJson);
    } catch (e) {
      console.warn("Aviso: Falha ao fazer parse do generatedPrompt JSON:", e.message);
    }
  }

  const prompt = `Você é um Web Designer Sênior e Engenheiro de Front-End de elite especializado em CRO (Otimização de Conversão) e UI/UX Premium, atuando como o construtor inteligente de sites (estilo Lovable, v0 ou Google Stitch).
Sua missão é criar o código HTML completo de uma Landing Page ultra-premium, moderna e responsiva para este cliente.

Como a sua saída DEVE ser um objeto JSON válido, retorne um objeto JSON contendo exatamente a chave "html" com a string completa do código HTML gerado. Exemplo de formato de resposta:
{
  "html": "<!DOCTYPE html>..."
}

Dados do Cliente:
- Nome da Empresa: ${name}
- Nicho de Atuação: ${niche}
- Cor de Destaque Sugerida (Primary Hex): ${primaryHex} (Use esta cor e crie uma paleta complementar harmônica para o design)
- Telefone: ${phone}
- Endereço: ${address}
- Dados de Copy e Seções de Referência: ${JSON.stringify(siteData)}

Diretrizes Obrigatórias de Design e Tecnologia para colocar no HTML:
1. Frameworks: Use Tailwind CSS via CDN (<script src="https://cdn.tailwindcss.com"></script>) para estilização de ponta e flexível. Use Google Fonts para importar tipografias elegantes adequadas ao nicho e FontAwesome para ícones premium (<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">).
2. Estética: O design deve parecer feito sob medida por uma agência de luxo. Use gradientes de cor modernos, cantos muito arredondados (ex. rounded-2xl ou rounded-3xl), sombras profundas e suaves, transições de hover animadas e um layout elegante. Escolha o tema visual (Dark Mode luxuoso ou Light Mode clean/sofisticado) de acordo com o nicho (ex.: clínicas de estética e bem-estar combinam com tons claros, limpos e orgânicos; oficinas mecânicas de luxo, escritórios de advocacia corporativa e consultorias combinam com fundos escuros, profundos e contrastes vibrantes).
3. Componentes de Prospecção Comercial Obrigatórios no HTML:
   A. FAIXA DE URGÊNCIA (Banner) no topo absoluto (com id="banner-urgencia"): Fixado no topo (fixed top-0 left-0 w-full z-[100] h-[32px]), com fundo em gradiente animado de tons âmbar/laranja e texto: "Proposta exclusiva válida por 3 dias | Condições Especiais Liberadas". Garanta que o body tenha padding-top (pt-[32px] ou pt-8) para que o banner de urgência não cubra o cabeçalho.
   B. SEÇÃO DE DIAGNÓSTICO E ANÁLISE ESTRATÉGICA (com id="analise"): Posicionada antes do FAQ ou depoimentos (ou em local proeminente antes do rodapé). Deve conter exatamente 4 blocos/cards com:
      - Card 1: Score de Qualidade: 95
      - Card 2: Pontos Críticos: 4
      - Card 3: Oportunidades: 7
      - Card 4: ROI Projetado: +300%
      Cada bloco deve usar ícones FontAwesome apropriados (ex. fas fa-chart-line, fas fa-exclamation-triangle, fas fa-bullseye, fas fa-rocket) com um visual moderno de dashboard.
   C. FORMULÁRIO DE CAPTAÇÃO (com id="prospection"): Um formulário elegante e persuasivo para solicitação de Diagnóstico Gratuito para a empresa.
   D. BOTÃO FLUTUANTE DO WHATSAPP: No canto inferior direito, linkando para wa.me/${phone.replace(/\D/g, "")} (se houver telefone).
4. Seções da Página: Hero impactante (título forte, subtítulo e CTA), Serviços reais e altamente atraentes para o segmento de mercado do cliente (crie 3 soluções convincentes e específicas caso não existam no JSON), Sobre Nós e Depoimentos de clientes satisfeitos reais.
5. Imagens do Unsplash: Use URLs reais e de alta qualidade do Unsplash (ex. https://images.unsplash.com/photo-...) com termos de busca relevantes para o nicho (ex. "office", "mechanic", "spa", "dentist") e parâmetros de otimização de tamanho (?q=80&w=1200&auto=format&fit=crop). Não use placeholders genéricos.`;

  // Chamar IA via API de produção
  let responseText = await callProductionAI(prompt);

  if (!responseText) {
    console.error("ERRO: A IA de produção falhou ao gerar a resposta.");
    process.exit(1);
  }

  // Parse do JSON retornado pela IA para extrair a string HTML limpa
  let html = "";
  try {
    const parsed = JSON.parse(responseText.trim());
    if (parsed.html) {
      html = parsed.html;
    } else {
      const firstKey = Object.keys(parsed)[0];
      if (firstKey && typeof parsed[firstKey] === 'string') {
        html = parsed[firstKey];
      }
    }
  } catch (e) {
    console.warn("Aviso: Falha ao fazer parse direto do JSON. Tentando extração manual de strings...");
    const match = responseText.match(/<!DOCTYPE html>[\s\S]*<\/html>/i);
    if (match) {
      html = match[0];
    } else {
      html = responseText.trim();
    }
  }

  // Limpeza de marcações markdown
  if (html.includes("```html")) html = html.split("```html")[1].split("```")[0].trim();
  else if (html.includes("```")) html = html.split("```")[1].split("```")[0].trim();
  html = html.trim();

  if (!html.startsWith("<!DOCTYPE html>") && !html.includes("<html")) {
    console.error("ERRO: O HTML extraído não é válido. Conteúdo recebido:", html.substring(0, 500));
    process.exit(1);
  }
  
  console.log("[REBUILD] HTML decodificado e limpo com sucesso. Salvando no Firestore...");
  
  // Atualizar htmlContent localmente no Firestore
  await updateDoc(doc(db, "generated_sites", docId), {
    htmlContent: html,
    updatedAt: Date.now()
  });
  console.log("[REBUILD] Firestore atualizado.");

  // Gravar o index.html na pasta temporária para deploy
  const siteSlug = `site-rebuild-${docId.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-${Date.now()}`;
  const dir = path.join(os.tmpdir(), "dist-deployed", siteSlug);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html, "utf-8");
  console.log(`[REBUILD] Arquivo HTML temporário gravado em: ${dir}`);

  // Deploy vercel
  console.log("[REBUILD] Iniciando deploy na Vercel...");
  exec(`npx vercel deploy "${dir}" --name "${siteSlug}" --prod --yes`, async (err, stdout, stderr) => {
    if (err) {
      console.error("[REBUILD_DEPLOY] Erro ao fazer deploy na Vercel:", stderr);
      process.exit(1);
    }
    const match = stdout.match(/https:\/\/[a-zA-Z0-9.-]+\.vercel\.app/);
    const deployedUrl = match ? match[0] : null;
    
    if (deployedUrl) {
      console.log(`[REBUILD] Deploy concluído com sucesso! URL: ${deployedUrl}`);
      // Salvar URL de deploy no Firestore e aprovar
      await updateDoc(doc(db, "generated_sites", docId), {
        deployedUrl: deployedUrl,
        status: "approved",
        updatedAt: Date.now()
      });
      console.log("[REBUILD] URL de deploy atualizada no Firestore!");
      process.exit(0);
    } else {
      console.error("[REBUILD] Falha ao extrair a URL de deploy da Vercel. Output:", stdout);
      process.exit(1);
    }
  });
}

main().catch(console.error);
