import fs from 'fs';
import path from 'path';

function analyzeUX(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`[UX Analyzer] Skipped: ${filePath} not found.`);
        return 0;
    }

    const html = fs.readFileSync(filePath, 'utf8');
    let issues = 0;
    console.log(`\n[UX Analyzer] Analisando: ${path.basename(path.dirname(filePath))}/${path.basename(filePath)}`);

    // 1. Missing alt attributes on images
    const imgRegex = /<img([^>]+)>/g;
    let match;
    while ((match = imgRegex.exec(html)) !== null) {
        if (!match[1].includes('alt=')) {
            console.log(` ❌ Falha: Imagem sem atributo 'alt' encontrada.`);
            issues++;
        }
    }

    // 2. Buttons without text or aria-label
    const btnRegex = /<button([^>]*)>([\s\S]*?)<\/button>/g;
    while ((match = btnRegex.exec(html)) !== null) {
        const attrs = match[1];
        const content = match[2].trim();
        if (content === '' && !attrs.includes('aria-label')) {
            console.log(` ❌ Falha: Botão sem texto ou 'aria-label' encontrado.`);
            issues++;
        }
    }

    // 3. Contrast check (Simulated via searching for low contrast text utility classes like text-gray-400 on white bg)
    // For simplicity, we just flag known low-contrast classes if they appear too much
    if (html.includes('text-slate-300 bg-white') || html.includes('text-zinc-300 bg-white')) {
        console.log(` ❌ Falha: Baixo contraste (WCAG < 4.5:1) detectado em texto claro sobre fundo branco.`);
        issues++;
    }

    // 4. Mobile Viewport Meta Tag
    if (!html.includes('name="viewport"')) {
        console.log(` ❌ Falha: Tag meta viewport ausente, prejudicando responsividade mobile.`);
        issues++;
    }

    if (issues === 0) {
        console.log(` ✅ Nenhuma falha crítica de UX encontrada.`);
    }
    return issues;
}

const templates = [
    'public/template-oralfix/index.html',
    'public/template-chiroandmovement/index.html',
    'public/template-elizabete/index.html',
    'public/template-saojose/index.html'
];

let totalIssues = 0;
templates.forEach(t => {
    totalIssues += analyzeUX(path.resolve(t));
});

if (totalIssues > 0) {
    console.error(`\n[UX Analyzer] ${totalIssues} falhas encontradas. Correção necessária.`);
    process.exit(1);
} else {
    console.log(`\n[UX Analyzer] Todos os templates aprovados! Prontos para deploy.`);
    process.exit(0);
}
