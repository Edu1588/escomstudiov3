import fs from 'fs';
import path from 'path';

const templates = [
  'template-belini',
  'template-skozi-closet',
  'template-oralfix',
  'template-chiroandmovement'
];

async function verify() {
  console.log("=== INICIANDO AUDITORIA FÍSICA DE SEÇÕES E CONTEÚDO ===");
  let hasErrors = false;

  for (const t of templates) {
    const filePath = path.resolve(`./public/${t}/index.html`);
    if (!fs.existsSync(filePath)) {
      console.error(`[FALHA] Arquivo não encontrado: ${filePath}`);
      hasErrors = true;
      continue;
    }

    const html = fs.readFileSync(filePath, 'utf8');
    const totalLength = html.length;

    // 1. Verificar tamanho total (arquivos corrompidos ou apagados costumam ter tamanho anormalmente pequeno)
    if (totalLength < 10000) {
      console.error(`[FALHA] ${t}: O arquivo está muito pequeno (${totalLength} bytes). Possível corrupção.`);
      hasErrors = true;
      continue;
    }

    // 2. Contar a quantidade de seções
    const sectionCount = (html.match(/<section/g) || []).length;
    const headerCount = (html.match(/<header/g) || []).length;
    const footerCount = (html.match(/<footer/g) || []).length;

    // 3. Verificar se o corpo principal sumiu (linhas vazias gigantes)
    // Um erro comum é ter sequências excessivas de linhas vazias (\n\s*\n\s*\n) ou tags de body vazias
    const bodyContent = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const bodyText = bodyContent ? bodyContent[1].trim() : "";
    const cleanText = bodyText.replace(/<!--[\s\S]*?-->/g, "").replace(/\s+/g, " ");

    console.log(`\nAuditando ${t}:`);
    console.log(`  - Tamanho do arquivo: ${totalLength} bytes`);
    console.log(`  - Seções encontradas: ${sectionCount}`);
    console.log(`  - Headers encontrados: ${headerCount}`);
    console.log(`  - Footers encontrados: ${footerCount}`);
    console.log(`  - Tamanho do texto limpo do body: ${cleanText.length} caracteres`);

    // Validações lógicas
    if (sectionCount === 0) {
      console.error(`  [ERRO] ${t}: Nenhuma seção (<section>) foi encontrada no arquivo!`);
      hasErrors = true;
    }
    if (cleanText.length < 2000) {
      console.error(`  [ERRO] ${t}: O conteúdo do body está anormalmente curto (${cleanText.length} caracteres)!`);
      hasErrors = true;
    }
    
    // Verificar se há o bug específico de seções em branco gigantes (ex: navbar colada no footer)
    const navbarIndex = html.indexOf('id="navbar"');
    const footerIndex = html.indexOf('<footer');
    if (navbarIndex !== -1 && footerIndex !== -1 && footerIndex > navbarIndex) {
      const intermediateHtml = html.substring(navbarIndex, footerIndex);
      const intermediateClean = intermediateHtml.replace(/<!--[\s\S]*?-->/g, "").replace(/\s+/g, " ").trim();
      // Se não houver nada entre a navbar e o footer
      if (intermediateClean.length < 500) {
        console.error(`  [ERRO] ${t}: Navbar colada no Footer! Seções intermediárias parecem vazias.`);
        hasErrors = true;
      }
    }
  }

  if (hasErrors) {
    console.log("\n❌ AUDITORIA CONCLUÍDA: Foram detectados problemas em algum template!");
    process.exit(1);
  } else {
    console.log("\n✅ AUDITORIA CONCLUÍDA: Todos os templates estão com conteúdo íntegro e seções preservadas!");
  }
}

verify();
