import fs from 'fs/promises';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';

const firebaseConfig = JSON.parse(await fs.readFile(new URL('./firebase-applet-config.json', import.meta.url), 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const publicDir = path.join(process.cwd(), 'public');

// Seção de Análise / Prospecção Comercial Genérica (Premium)
const prospectionSection = `
    <!-- ========== SEÇÃO DE PROSPECÇÃO / ANÁLISE DIGITAL ========== -->
    <section id="analise" class="py-24 bg-zinc-900 relative overflow-hidden">
        <div class="container mx-auto px-6">
            <div class="max-w-3xl mx-auto text-center space-y-4 mb-16 fade-in-section">
                <span class="text-amber-500 text-xs font-bold uppercase tracking-[0.2em]">Análise Estratégica</span>
                <h2 class="text-3xl md:text-4xl lg:text-5xl font-black text-white">Diagnóstico Digital de <span class="text-amber-500">Alto Desempenho</span></h2>
                <p class="text-slate-400 text-base leading-relaxed max-w-xl mx-auto">Identificamos oportunidades e pontos críticos de melhoria com base nos mais altos padrões do seu segmento.</p>
                <div class="w-16 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-4 rounded-full"></div>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                <div class="bg-zinc-800/50 backdrop-blur-md rounded-2xl p-7 text-center space-y-4 border border-zinc-700/50 hover:border-amber-500/30 transition-all duration-500 fade-in-section">
                    <div class="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 mx-auto text-2xl">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="text-4xl font-black text-green-500">95</div>
                    <h3 class="text-sm font-bold text-white uppercase tracking-wider">Score de Qualidade</h3>
                    <p class="text-xs text-slate-400 leading-relaxed">Potencial de sucesso acima de 90% dos concorrentes.</p>
                </div>
                <div class="bg-zinc-800/50 backdrop-blur-md rounded-2xl p-7 text-center space-y-4 border border-zinc-700/50 hover:border-amber-500/30 transition-all duration-500 fade-in-section">
                    <div class="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 mx-auto text-2xl">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div class="text-4xl font-black text-red-500">4</div>
                    <h3 class="text-sm font-bold text-white uppercase tracking-wider">Pontos Críticos</h3>
                    <p class="text-xs text-slate-400 leading-relaxed">Fatores que precisam de atenção imediata.</p>
                </div>
                <div class="bg-zinc-800/50 backdrop-blur-md rounded-2xl p-7 text-center space-y-4 border border-zinc-700/50 hover:border-amber-500/30 transition-all duration-500 fade-in-section">
                    <div class="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mx-auto text-2xl">
                        <i class="fas fa-bullseye"></i>
                    </div>
                    <div class="text-4xl font-black text-blue-500">7</div>
                    <h3 class="text-sm font-bold text-white uppercase tracking-wider">Oportunidades</h3>
                    <p class="text-xs text-slate-400 leading-relaxed">Estratégias inexploradas no seu nicho.</p>
                </div>
                <div class="bg-zinc-800/50 backdrop-blur-md rounded-2xl p-7 text-center space-y-4 border border-zinc-700/50 hover:border-amber-500/30 transition-all duration-500 fade-in-section">
                    <div class="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mx-auto text-2xl">
                        <i class="fas fa-rocket"></i>
                    </div>
                    <div class="text-4xl font-black text-amber-500">+300%</div>
                    <h3 class="text-sm font-bold text-white uppercase tracking-wider">ROI Projetado</h3>
                    <p class="text-xs text-slate-400 leading-relaxed">Projeção de retorno com as otimizações aplicadas.</p>
                </div>
            </div>
        </div>
    </section>
`;

const urgencyBanner = `
    <!-- ========== FAIXA DE URGÊNCIA ========== -->
    <div id="banner-urgencia" class="fixed top-0 left-0 w-full z-[100] py-2 px-4 text-center" style="background: linear-gradient(90deg, #d97706, #b45309, #d97706); background-size: 200% 100%; animation: shimmer-bar 3s ease-in-out infinite;">
        <p class="text-white text-xs sm:text-sm font-bold tracking-wide flex items-center justify-center gap-2 flex-wrap">
            <span class="inline-flex items-center gap-1.5">
                <i class="fas fa-clock animate-pulse"></i>
                <span>Proposta exclusiva válida por <strong class="underline underline-offset-2">3 dias</strong></span>
            </span>
            <span class="hidden sm:inline text-white/70">|</span>
            <span class="text-white/90">Condições Especiais Liberadas</span>
        </p>
    </div>
    <style>
        @keyframes shimmer-bar {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }
        body { padding-top: 32px; } /* Espaço para o banner */
    </style>
`;

async function findDocumentIdForSite(slug) {
    const q = query(collection(db, "generated_sites"), where("siteProjectId", "==", slug));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
        return snapshot.docs[0].id;
    }
    // Fallbacks baseados nos nomes mais comuns
    if (slug === 'site-clinica-pillar') return 'site_auto_clinica-pillar';
    if (slug === 'site-dr-raymond-hall') return 'site_auto_dr-raymond-hall';
    if (slug === 'site-gio-estetica') return 'site_estetica_gio-estetica';
    if (slug === 'site-innovative-business') return 'site_auto_innovative-business';
    return slug;
}

async function run() {
    try {
        const entries = await fs.readdir(publicDir, { withFileTypes: true });
        
        for (const entry of entries) {
            if (entry.isDirectory() && entry.name.startsWith('site-')) {
                // Pular Novatech pois já reescrevemos do zero perfeitamente
                if (entry.name === 'site-novatech-automotive') continue;
                
                const indexPath = path.join(publicDir, entry.name, 'index.html');
                
                try {
                    let html = await fs.readFile(indexPath, 'utf8');
                    let modified = false;

                    // 1. Injetar Banner de Urgência
                    if (!html.includes('id="banner-urgencia"')) {
                        html = html.replace(/(<body\b[^>]*>)/i, `$1\n${urgencyBanner}`);
                        modified = true;
                        console.log(`[${entry.name}] Injetado banner de urgência.`);
                    }

                    // 2. Injetar Seção de Análise (se não houver)
                    if (!html.includes('id="analise"')) {
                        // Tentar colocar antes do FAQ, senão antes do footer
                        let insertIdx = html.indexOf('<section id="faq"');
                        if (insertIdx === -1) insertIdx = html.indexOf('<!-- FAQ');
                        if (insertIdx === -1) insertIdx = html.lastIndexOf('<footer');
                        
                        if (insertIdx !== -1) {
                            html = html.substring(0, insertIdx) + prospectionSection + '\\n' + html.substring(insertIdx);
                            modified = true;
                            console.log(`[${entry.name}] Injetada seção de análise.`);
                        }
                    }

                    // 3. Limpar botão "Ver Dossiê" do Hero se existir (geralmente fixado hardcoded por acidente)
                    if (html.includes('Ver Dossiê & Proposta') && html.includes('id="hero"')) {
                        html = html.replace(/<a[^>]*>[\s\S]*?Ver Dossiê & Proposta[\s\S]*?<\/a>/i, '');
                        modified = true;
                        console.log(`[${entry.name}] Removido botão dossiê do hero.`);
                    }

                    if (modified) {
                        await fs.writeFile(indexPath, html, 'utf8');
                        
                        // Atualizar no Firestore
                        let docId = await findDocumentIdForSite(entry.name);
                        
                        try {
                            const docRef = doc(db, 'generated_sites', docId);
                            await updateDoc(docRef, { htmlContent: html, updatedAt: Date.now() });
                            console.log(`[${entry.name}] Sincronizado com Firestore no doc ${docId}`);
                        } catch (e) {
                            console.log(`[${entry.name}] Erro sync Firestore: ${e.message}`);
                        }
                    } else {
                        console.log(`[${entry.name}] Nenhuma modificação necessária.`);
                    }
                } catch (e) {
                    console.error(`Erro ao ler/processar ${entry.name}:`, e.message);
                }
            }
        }
        
        console.log('Finalizado processo de injeção em todos os sites.');
        process.exit(0);
    } catch (e) {
        console.error('Erro geral:', e);
        process.exit(1);
    }
}

run();
