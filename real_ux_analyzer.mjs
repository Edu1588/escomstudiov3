import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import https from 'https';
import http from 'http';

const ANSI_RED = '\x1b[31m';
const ANSI_GREEN = '\x1b[32m';
const ANSI_YELLOW = '\x1b[33m';
const ANSI_RESET = '\x1b[0m';

async function checkImageExists(url) {
    if (!url || url.trim() === '') return false;
    if (url.startsWith('data:')) return true; // Base64
    
    return new Promise((resolve) => {
        const client = url.startsWith('https') ? https : http;
        const req = client.request(url, { method: 'HEAD', timeout: 5000 }, (res) => {
            resolve(res.statusCode >= 200 && res.statusCode < 400);
        });
        
        req.on('error', () => resolve(false));
        req.on('timeout', () => {
            req.destroy();
            resolve(false);
        });
        req.end();
    });
}

async function analyzeUX(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`${ANSI_YELLOW}[UX Analyzer] Skipped: ${filePath} not found.${ANSI_RESET}`);
        return 0;
    }

    const html = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(html);
    let issues = 0;
    const templateName = path.basename(path.dirname(filePath));
    console.log(`\n[UX Analyzer] Analisando: ${templateName}/${path.basename(filePath)}`);

    const images = $('img').toArray();
    for (const el of images) {
        const alt = $(el).attr('alt');
        const src = $(el).attr('src');
        
        if (!alt || alt.trim() === '') {
            console.log(`${ANSI_RED} ❌ Falha (Acessibilidade/SEO): Imagem <img src="${src}"> sem atributo 'alt'.${ANSI_RESET}`);
            issues++;
        }
        
        if (src && src.startsWith('http')) {
            const isOk = await checkImageExists(src);
            if (!isOk) {
                console.log(`${ANSI_RED} ❌ Falha Crítica (UX/UI): Imagem quebrada detectada. Link retornou erro 404/Timeout: ${src}${ANSI_RESET}`);
                issues++;
            }
        }
    }

    // 2. Buttons without text or aria-label
    $('button, a').each((i, el) => {
        const text = $(el).text().trim();
        const ariaLabel = $(el).attr('aria-label');
        if (text === '' && !ariaLabel && $(el).children('img, svg, i').length === 0) {
            console.log(`${ANSI_RED} ❌ Falha (Usabilidade): Elemento clicável (${el.tagName}) vazio sem 'aria-label'.${ANSI_RESET}`);
            issues++;
        }
    });

    // 3. Contrast / Colors checks
    const bodyClasses = $('body').attr('class') || '';
    $('*').each((i, el) => {
        const classes = $(el).attr('class') || '';
        if ((classes.includes('text-slate-300') || classes.includes('text-gray-300')) && 
            (classes.includes('bg-white') || bodyClasses.includes('bg-white'))) {
            if (!classes.includes('bg-') || classes.includes('bg-white')) {
                console.log(`${ANSI_RED} ❌ Falha (Contraste): Texto cinza claro sobre fundo branco detectado.${ANSI_RESET}`);
                issues++;
            }
        }
        if (classes.includes('text-[#D1D5DB]') && classes.includes('bg-[#2EFF00]')) {
            console.log(`${ANSI_RED} ❌ Falha Crítica (Contraste): Texto cinza (#D1D5DB) sobre verde limão (#2EFF00). Violação WCAG 2.1.${ANSI_RESET}`);
            issues++;
        }
    });

    // 4. Mobile Viewport Meta Tag
    const viewport = $('meta[name="viewport"]');
    if (viewport.length === 0) {
        console.log(`${ANSI_RED} ❌ Falha (Responsividade): Tag <meta name="viewport"> ausente.${ANSI_RESET}`);
        issues++;
    }

    // 5. Hierarquia de Títulos
    const h1s = $('h1').length;
    if (h1s === 0) {
        console.log(`${ANSI_RED} ❌ Falha (SEO/IA): Ausência de tag <h1> principal.${ANSI_RESET}`);
        issues++;
    } else if (h1s > 1) {
        console.log(`${ANSI_YELLOW} ⚠️ Aviso (Hierarquia): Múltiplas tags <h1> encontradas (${h1s}). O ideal é apenas 1 por página.${ANSI_RESET}`);
    }

    if (issues === 0) {
        console.log(`${ANSI_GREEN} ✅ Aprovado! Nenhuma falha crítica de UX/UI estrutural encontrada.${ANSI_RESET}`);
    }
    return issues;
}

async function run() {
    const templates = [
        'public/template-oralfix/index.html',
        'public/template-chiroandmovement/index.html',
        'public/template-elizabete/index.html',
        'public/template-saojose/index.html',
        'public/template-skozi-closet/index.html'
    ];

    let totalIssues = 0;
    for (const t of templates) {
        totalIssues += await analyzeUX(path.resolve(t));
    }

    if (totalIssues > 0) {
        console.error(`\n${ANSI_RED}⛔ [UX Analyzer] BLOQUEIO DE DEPLOY: ${totalIssues} falhas estruturais críticas encontradas. Corrija o código HTML gerado antes de continuar.${ANSI_RESET}`);
        process.exit(1);
    } else {
        console.log(`\n${ANSI_GREEN}🚀 [UX Analyzer] SUCESSO: Todos os templates aprovados! Pipeline de deploy liberado.${ANSI_RESET}`);
        process.exit(0);
    }
}

run();
