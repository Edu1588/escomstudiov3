import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dossiePath = path.join(__dirname, 'public', 'template-clinica', 'dossie.html');
let content = fs.readFileSync(dossiePath, 'utf8');

// 1. Apresentação Institucional
const apresentacaoHtml = `
    <!-- PÁGINA 2: SOBRE NÓS -->
    <div class="pdf-page">
        <div class="decor-line"></div>
        <div class="content-layer">
            <h2 class="text-3xl font-display font-black text-zinc-900 mb-8 pb-3 border-b-2 border-zinc-100 flex items-center gap-3">
                Sobre Nós <span class="text-brand-primary text-sm font-mono font-normal">/ ESCOM Studio</span>
            </h2>
            
            <div class="flex-1">
                <p class="text-sm text-zinc-700 leading-relaxed mb-6 font-medium">
                    Olá! Somos a <strong>ESCOM Studio</strong>, uma empresa especializada em Web Design de luxo, Arquitetura de Conversão e Engenharia de Experiência do Usuário (UX).
                </p>
                <div class="bg-zinc-50 border border-zinc-200 rounded-xl p-6 mb-6">
                    <p class="text-xs text-zinc-650 leading-relaxed">
                        Nós não apenas desenhamos sites bonitos; nós desenvolvemos ecossistemas digitais baseados no comportamento humano, neurociência aplicada e posicionamento premium de mercado.
                        Fizemos uma análise detalhada sobre o seu negócio e identificamos oportunidades valiosas para elevar a percepção de valor da sua marca, 
                        aumentar o contraste e a usabilidade de acordo com as diretrizes internacionais (WCAG), e criar um design system irresistível aos olhos de clientes de alto ticket.
                    </p>
                </div>
                <p class="text-xs text-zinc-650 leading-relaxed">
                    Nas páginas a seguir, você encontrará um <strong>dossiê estratégico e visual</strong> cuidadosamente preparado, mostrando como sua presença digital atual pode ser aprimorada 
                    e as soluções exatas que implementamos no seu novo projeto de landing page premium.
                </p>
            </div>
            
            <div class="mt-auto flex justify-end text-xs text-zinc-400 font-mono border-t border-zinc-100 pt-4">Página 2</div>
        </div>
    </div>
`;

// 2. Cores e Tipografia
const coresTipografiaHtml = `
    <!-- PÁGINA X: CORES -->
    <div class="pdf-page">
        <div class="decor-line"></div>
        <div class="content-layer">
            <h2 class="text-3xl font-display font-black text-zinc-900 mb-4">Identidade Visual & Cores</h2>
            <p class="text-xs text-zinc-600 mb-4">
                A psicologia das cores foi ajustada especificamente para o posicionamento do seu negócio:
            </p>

            <div class="flex-1 bg-zinc-50/50 p-6 rounded-xl border border-zinc-200">
                <h3 class="text-brand-primary font-bold text-lg mb-3">Racional Psicocromático</h3>
                <p class="text-sm text-zinc-700 leading-relaxed mb-8">
                    <!-- INJECT_CORES_RACIONAL -->[Racional das cores será injetado aqui pelo script de dossiês]<!-- END_INJECT_CORES_RACIONAL -->
                </p>
                
                <div class="grid grid-cols-2 gap-4">
                    <div class="flex items-center gap-4">
                        <div class="w-16 h-16 rounded-full border border-zinc-300 shadow-sm" style="background-color: <!-- INJECT_COLOR_1_HEX -->#000000<!-- END_INJECT_COLOR_1_HEX -->"></div>
                        <div>
                            <p class="font-bold text-zinc-900 text-sm"><!-- INJECT_COLOR_1_NAME -->Cor 1<!-- END_INJECT_COLOR_1_NAME --></p>
                            <p class="text-[10px] text-zinc-500 font-mono"><!-- INJECT_COLOR_1_HEX -->#000000<!-- END_INJECT_COLOR_1_HEX --></p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="w-16 h-16 rounded-full border border-zinc-300 shadow-sm" style="background-color: <!-- INJECT_COLOR_2_HEX -->#FFFFFF<!-- END_INJECT_COLOR_2_HEX -->"></div>
                        <div>
                            <p class="font-bold text-zinc-900 text-sm"><!-- INJECT_COLOR_2_NAME -->Cor 2<!-- END_INJECT_COLOR_2_NAME --></p>
                            <p class="text-[10px] text-zinc-500 font-mono"><!-- INJECT_COLOR_2_HEX -->#FFFFFF<!-- END_INJECT_COLOR_2_HEX --></p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="mt-auto flex justify-end text-xs text-zinc-400 font-mono border-t border-zinc-100 pt-4">Página X</div>
        </div>
    </div>

    <!-- PÁGINA Y: TIPOGRAFIA -->
    <div class="pdf-page">
        <div class="decor-line"></div>
        <div class="content-layer">
            <h2 class="text-3xl font-display font-black text-zinc-900 mb-4">Tipografia Premium</h2>
            <p class="text-xs text-zinc-600 mb-4">
                A seleção de fontes para compor a estética premium e profissional do projeto:
            </p>

            <div class="flex-1 bg-zinc-50/50 p-6 rounded-xl border border-zinc-200">
                <h3 class="text-brand-primary font-bold text-lg mb-3">A Arquitetura das Palavras</h3>
                <p class="text-sm text-zinc-700 leading-relaxed mb-8">
                    <!-- INJECT_TIPO_RACIONAL -->[Racional tipográfico será injetado aqui pelo script de dossiês]<!-- END_INJECT_TIPO_RACIONAL -->
                </p>

                <div class="space-y-6">
                    <div class="p-4 bg-white border border-zinc-150 rounded-lg">
                        <p class="text-xs text-zinc-500 uppercase tracking-wider mb-2">Títulos e Chamadas Principais</p>
                        <p class="font-display text-3xl text-zinc-900" style="font-family: <!-- INJECT_FONT_1_CSS -->'Playfair Display', serif<!-- END_INJECT_FONT_1_CSS -->">
                            <!-- INJECT_FONT_1_NAME -->Playfair Display<!-- END_INJECT_FONT_1_NAME -->
                        </p>
                    </div>
                    <div class="p-4 bg-white border border-zinc-150 rounded-lg">
                        <p class="text-xs text-zinc-500 uppercase tracking-wider mb-2">Textos e Parágrafos</p>
                        <p class="font-sans text-xl text-zinc-800" style="font-family: <!-- INJECT_FONT_2_CSS -->'Inter', sans-serif<!-- END_INJECT_FONT_2_CSS -->">
                            <!-- INJECT_FONT_2_NAME -->Inter<!-- END_INJECT_FONT_2_NAME -->
                        </p>
                    </div>
                </div>
            </div>
            
            <div class="mt-auto flex justify-end text-xs text-zinc-400 font-mono border-t border-zinc-100 pt-4">Página Y</div>
        </div>
    </div>
`;

// Inject pages
// Insert after PÁGINA 1
content = content.replace(/(<!-- PÁGINA 2: ÍNDICE -->)/, apresentacaoHtml + '\n    $1');

// Insert after PÁGINA 5 (which will become page 7)
content = content.replace(/(<!-- PÁGINA 6: LACUNAS & FILTRO DE COPY -->)/, coresTipografiaHtml + '\n    $1');

// Update page numbers at the bottom of the pages
// Also update the index
content = content.replace(/<span class="font-black text-brand-primary text-lg font-mono">03<\/span>\s*<span class="text-zinc-900 font-semibold">Diagnóstico do Negócio Atual<\/span>/, '<span class="font-black text-brand-primary text-lg font-mono">04</span>\n                    <span class="text-zinc-900 font-semibold">Diagnóstico do Negócio Atual</span>');
content = content.replace(/<span class="font-black text-brand-primary text-lg font-mono">08<\/span>\s*<span class="text-zinc-900 font-semibold">Anatomia da LP de Alto Ticket<\/span>/, '<span class="font-black text-brand-primary text-lg font-mono">11</span>\n                    <span class="text-zinc-900 font-semibold">Anatomia da LP de Alto Ticket</span>');
content = content.replace(/<span class="font-black text-brand-primary text-lg font-mono">04<\/span>\s*<span class="text-zinc-900 font-semibold">Psicografia & Avatares<\/span>/, '<span class="font-black text-brand-primary text-lg font-mono">05</span>\n                    <span class="text-zinc-900 font-semibold">Psicografia & Avatares</span>');
content = content.replace(/<span class="font-black text-brand-primary text-lg font-mono">09<\/span>\s*<span class="text-zinc-900 font-semibold">ROI & Viabilidade Financeira<\/span>/, '<span class="font-black text-brand-primary text-lg font-mono">12</span>\n                    <span class="text-zinc-900 font-semibold">ROI & Viabilidade Financeira</span>');
content = content.replace(/<span class="font-black text-brand-primary text-lg font-mono">05<\/span>\s*<span class="text-zinc-900 font-semibold">O Campo de Batalha<\/span>/, '<span class="font-black text-brand-primary text-lg font-mono">06</span>\n                    <span class="text-zinc-900 font-semibold">O Campo de Batalha</span>');
content = content.replace(/<span class="font-black text-brand-primary text-lg font-mono">10<\/span>\s*<span class="text-zinc-900 font-semibold">Oceano Azul & Turismo<\/span>/, '<span class="font-black text-brand-primary text-lg font-mono">13</span>\n                    <span class="text-zinc-900 font-semibold">Oceano Azul & Turismo</span>');
content = content.replace(/<span class="font-black text-brand-primary text-lg font-mono">06<\/span>\s*<span class="text-zinc-900 font-semibold">Lacunas & Filtro de Copy<\/span>/, '<span class="font-black text-brand-primary text-lg font-mono">09</span>\n                    <span class="text-zinc-900 font-semibold">Lacunas & Filtro de Copy</span>');
content = content.replace(/<span class="font-black text-brand-primary text-lg font-mono">11<\/span>\s*<span class="text-zinc-900 font-semibold">Síntese Final<\/span>/, '<span class="font-black text-brand-primary text-lg font-mono">14</span>\n                    <span class="text-zinc-900 font-semibold">Síntese Final</span>');
content = content.replace(/<span class="font-black text-brand-primary text-lg font-mono">07<\/span>\s*<span class="text-zinc-900 font-semibold">Os 6 Pilares de Vantagem<\/span>/, '<span class="font-black text-brand-primary text-lg font-mono">10</span>\n                    <span class="text-zinc-900 font-semibold">Os 6 Pilares de Vantagem</span>');

// Let's add the Cores e Tipografia to the index
content = content.replace(/<div class="grid grid-cols-2 gap-y-6 gap-x-12 text-base flex-1 py-4">/, `<div class="grid grid-cols-2 gap-y-6 gap-x-12 text-base flex-1 py-4">
                <div class="flex items-baseline gap-3 border-b border-zinc-100 pb-2">
                    <span class="font-black text-brand-primary text-lg font-mono">07</span>
                    <span class="text-zinc-900 font-semibold">Identidade Visual & Cores</span>
                </div>
                <div class="flex items-baseline gap-3 border-b border-zinc-100 pb-2">
                    <span class="font-black text-brand-primary text-lg font-mono">08</span>
                    <span class="text-zinc-900 font-semibold">Tipografia Premium</span>
                </div>`);

// Now, replace all bottom page numbers dynamically
let pageCounter = 2; // Starts from 2 since page 1 has no number at the bottom, wait, page 2 has "Página 2"
content = content.replace(/Página (?:[2-9]|1[0-1]|X|Y)/g, (match) => {
    return `Página ${pageCounter++}`;
});

// Update the final page counter summary text (if any)
// The HTML has things like "Dossiê Clínica ImplArt - Confidencial</span>\n                <span>Página 11</span>" 
// My regex matched "Página 11", so they are all sequential now.

// Also need to rename the HTML comments (e.g., "<!-- PÁGINA 2: ÍNDICE -->")
let titleCounter = 1;
content = content.replace(/<!-- PÁGINA (?:[1-9]|1[0-1]|X|Y): (.*?) -->/g, (match, p1) => {
    return `<!-- PÁGINA ${titleCounter++}: ${p1} -->`;
});

fs.writeFileSync(dossiePath, content, 'utf8');
console.log("dossie.html updated successfully!");
