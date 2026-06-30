import fs from 'fs';

let content = fs.readFileSync('rebuild_layouts_correctly.mjs', 'utf8');

const newElizabeteHtml = `<!DOCTYPE html>
<html class="scroll-smooth" lang="pt-BR">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>Dra. Elizabete De Marchi - Biomedicina Estética Segura</title>
    <link href="https://fonts.googleapis.com" rel="preconnect"/>
    <link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet"/>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        nude: {
                            50: '#fdfbf9',
                            100: '#faf8f5',
                            200: '#f0e9df',
                            300: '#e5d7c5',
                            400: '#d5bda1',
                            500: '#c5a27e',
                            800: '#5e4835',
                            900: '#2a241e'
                        },
                        tiffany: {
                            DEFAULT: '#02c5ba',
                            dark: '#00b5ab',
                            light: '#e5faf8'
                        }
                    },
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        serif: ['Playfair Display', 'serif'],
                    }
                }
            }
        }
    </script>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .glass-nav {
            background: rgba(250, 248, 245, 0.95);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(197, 162, 126, 0.15);
        }
        .btn-primary {
            background-color: #02c5ba;
            color: #111;
            transition: all 0.3s ease;
        }
        .btn-primary:hover {
            background-color: #00b5ab;
            transform: translateY(-2px);
            box-shadow: 0 10px 20px -10px rgba(2, 197, 186, 0.4);
        }
    </style>
</head>
<body class="bg-nude-50 text-nude-900 font-sans antialiased selection:bg-tiffany selection:text-white">

    <nav class="fixed w-full z-50 glass-nav transition-all duration-300" id="navbar">
        <div class="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-tiffany/10 rounded-full flex items-center justify-center text-tiffany font-serif text-xl italic font-bold">EM</div>
                <div>
                    <h1 class="font-serif font-bold text-nude-900 leading-tight">Dra. Elizabete De Marchi</h1>
                    <p class="text-xs text-nude-500 uppercase tracking-widest">Biomedicina Segura</p>
                </div>
            </div>
            <div class="hidden md:flex gap-8 text-sm font-medium">
                <a href="#" class="hover:text-tiffany transition-colors">Início</a>
                <a href="#pilares" class="hover:text-tiffany transition-colors">Tratamentos</a>
                <a href="#depoimentos" class="hover:text-tiffany transition-colors">Depoimentos</a>
            </div>
            <a href="#contato" class="btn-primary font-bold px-8 py-3 rounded-full hidden md:inline-block">Falar no WhatsApp</a>
        </div>
    </nav>

    <!-- Main Content Area -->
    <main class="flex-grow">

    <!-- HERO Section -->
    <header class="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-nude-100 flex items-center min-h-[80vh]">
        <div class="max-w-7xl mx-auto px-6 relative z-10 w-full">
            <div class="grid md:grid-cols-2 gap-12 items-center">
                <div class="order-2 md:order-1 relative z-20">
                    <span class="text-tiffany font-bold uppercase tracking-widest text-sm mb-4 block">Estética Acessível e Segura em Curitiba</span>
                    <h2 class="text-5xl md:text-6xl font-serif font-bold text-nude-900 leading-tight mb-6">
                        Realce sua beleza de forma <span class="text-nude-500 italic">natural e sem exageros</span>.
                    </h2>
                    <p class="text-lg text-nude-800 mb-10 max-w-lg leading-relaxed">
                        Procedimentos seguros e acessíveis focados em devolver a sua autoestima. Sem padrões inatingíveis, apenas a melhor versão de você mesma.
                    </p>
                    <a href="#contato" class="btn-primary font-bold px-10 py-4 rounded-full inline-flex items-center gap-3 text-lg">
                        Agendar Avaliação Gratuita <i class="fa-solid fa-arrow-right"></i>
                    </a>
                </div>
                <div class="relative order-1 md:order-2">
                    <div class="absolute inset-0 bg-nude-200 rounded-[3rem] transform rotate-3 scale-105 z-0"></div>
                    <img src="https://images.unsplash.com/photo-1594824432258-454fa9156637?q=80&w=800&auto=format&fit=crop" onerror="this.src='https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=800&auto=format&fit=crop'" alt="Dra. Elizabete" class="relative z-10 rounded-[3rem] shadow-2xl object-cover h-[600px] w-full bg-nude-300">
                    <div class="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl z-20">
                        <p class="font-serif font-bold text-2xl text-tiffany mb-1">Cuidado</p>
                        <p class="text-sm text-nude-500 uppercase tracking-widest">e Preço Justo</p>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- Nossa História -->
    <section class="py-24 bg-nude-50 relative" id="historia">
        <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
            <div class="relative">
                <div class="absolute inset-0 bg-nude-200 rounded-[3rem] transform -rotate-3 scale-105 z-0"></div>
                <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop" class="relative z-10 rounded-[3rem] shadow-2xl object-cover h-[500px] w-full" alt="História">
            </div>
            <div>
                <span class="text-tiffany font-bold uppercase tracking-widest text-sm mb-4 block">Nossa Clínica de Bairro</span>
                <h2 class="text-4xl font-serif font-bold text-nude-900 mb-6">
                    Perto de você, com <span class="text-nude-500 italic">segurança e qualidade</span>
                </h2>
                <p class="text-nude-800 leading-relaxed mb-6">
                    Acreditamos que a estética não deve ser um privilégio, mas sim um cuidado acessível para todas as mulheres. Nossa missão é oferecer procedimentos seguros que respeitam o seu rosto e o seu bolso.
                </p>
                <p class="text-nude-800 leading-relaxed mb-8">
                    Não acreditamos em transformações artificiais. Focamos em pequenos cuidados que fazem uma grande diferença na sua autoestima do dia a dia, com total transparência nos valores e procedimentos.
                </p>
                <div class="grid grid-cols-2 gap-6 border-t border-nude-200 pt-8">
                    <div>
                        <p class="text-3xl font-serif font-bold text-tiffany mb-1">Local</p>
                        <p class="text-xs text-nude-500 uppercase tracking-widest">Fácil acesso</p>
                    </div>
                    <div>
                        <p class="text-3xl font-serif font-bold text-tiffany mb-1">Acessível</p>
                        <p class="text-xs text-nude-500 uppercase tracking-widest">Preços transparentes</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Por que nos escolher -->
    <section class="py-24 bg-white" id="diferenciais">
        <div class="max-w-7xl mx-auto px-6">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-serif font-bold text-nude-900 mb-4">Por que nos escolher?</h2>
                <p class="text-nude-500 uppercase tracking-widest">Qualidade sem complicações</p>
            </div>
            <div class="grid md:grid-cols-3 gap-8">
                <div class="bg-nude-50 p-10 rounded-[2rem] border border-nude-100 hover:border-tiffany transition-colors">
                    <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center text-tiffany text-2xl mb-6 shadow-sm">
                        <i class="fa-solid fa-leaf"></i>
                    </div>
                    <h3 class="text-xl font-serif font-bold text-nude-900 mb-3">Resultados Naturais</h3>
                    <p class="text-nude-800 text-sm leading-relaxed">Fazemos apenas o necessário para suavizar marcas do tempo. O objetivo é que você se sinta bem, sem ficar com aparência artificial.</p>
                </div>
                <div class="bg-nude-50 p-10 rounded-[2rem] border border-nude-100 hover:border-tiffany transition-colors">
                    <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center text-tiffany text-2xl mb-6 shadow-sm">
                        <i class="fa-solid fa-handshake"></i>
                    </div>
                    <h3 class="text-xl font-serif font-bold text-nude-900 mb-3">Preço Justo e Claro</h3>
                    <p class="text-nude-800 text-sm leading-relaxed">Apresentamos os valores antes de qualquer procedimento. Oferecemos opções de parcelamento para que o cuidado caiba no seu orçamento.</p>
                </div>
                <div class="bg-nude-50 p-10 rounded-[2rem] border border-nude-100 hover:border-tiffany transition-colors">
                    <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center text-tiffany text-2xl mb-6 shadow-sm">
                        <i class="fa-solid fa-shield-halved"></i>
                    </div>
                    <h3 class="text-xl font-serif font-bold text-nude-900 mb-3">Segurança em Primeiro Lugar</h3>
                    <p class="text-nude-800 text-sm leading-relaxed">Ambiente esterilizado e produtos regulamentados pela ANVISA. Explicamos cada etapa do processo para que você se sinta 100% segura.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Pilares de Tratamento -->
    <section class="py-24 bg-nude-100 border-y border-nude-200" id="pilares">
        <div class="max-w-7xl mx-auto px-6">
            <div class="text-center mb-20">
                <h2 class="text-4xl font-serif font-bold text-nude-900 mb-4">Nossos Tratamentos Essenciais</h2>
                <p class="text-nude-500 uppercase tracking-widest">O cuidado básico que toda pele merece</p>
            </div>
            <div class="grid md:grid-cols-3 gap-8 items-center">
                <div class="space-y-12">
                    <div class="text-right">
                        <span class="text-tiffany font-bold uppercase tracking-widest text-xs mb-2 block">Cuidado Diário</span>
                        <h3 class="text-2xl font-serif font-bold text-nude-900 mb-3">Limpeza de Pele</h3>
                        <p class="text-nude-800 text-sm leading-relaxed">Remoção de cravos e impurezas para uma pele respirar melhor e ficar macia.</p>
                    </div>
                    <div class="text-right">
                        <span class="text-tiffany font-bold uppercase tracking-widest text-xs mb-2 block">Prevenção</span>
                        <h3 class="text-2xl font-serif font-bold text-nude-900 mb-3">Toxina Botulínica Preventiva</h3>
                        <p class="text-nude-800 text-sm leading-relaxed">Suaviza expressões de forma leve antes que as rugas se tornem profundas.</p>
                    </div>
                </div>
                <div class="relative px-4">
                    <div class="aspect-[3/4] rounded-[3rem] overflow-hidden relative shadow-2xl">
                        <img src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=800&auto=format&fit=crop" class="w-full h-full object-cover" alt="Tratamento">
                    </div>
                </div>
                <div class="space-y-12">
                    <div class="text-left">
                        <span class="text-tiffany font-bold uppercase tracking-widest text-xs mb-2 block">Renovação</span>
                        <h3 class="text-2xl font-serif font-bold text-nude-900 mb-3">Microagulhamento</h3>
                        <p class="text-nude-800 text-sm leading-relaxed">Estimula a produção natural de colágeno, melhorando cicatrizes e manchas.</p>
                    </div>
                    <div class="text-left">
                        <span class="text-tiffany font-bold uppercase tracking-widest text-xs mb-2 block">Hidratação</span>
                        <h3 class="text-2xl font-serif font-bold text-nude-900 mb-3">Skinbooster</h3>
                        <p class="text-nude-800 text-sm leading-relaxed">Hidratação injetável profunda para devolver o brilho e o viço ao rosto cansado.</p>
                    </div>
                </div>
            </div>
            <div class="text-center mt-20">
                <a href="#contato" class="inline-flex items-center gap-4 bg-white border border-nude-200 text-nude-900 font-bold px-10 py-4 rounded-full hover:border-tiffany transition-colors shadow-sm">
                    Fale com a gente pelo WhatsApp <i class="fa-brands fa-whatsapp text-tiffany"></i>
                </a>
            </div>
        </div>
    </section>

    <!-- Depoimentos -->
    <section class="py-24 bg-white" id="depoimentos">
        <div class="max-w-7xl mx-auto px-6">
            <h2 class="text-3xl font-serif font-bold text-center text-nude-900 mb-16">O que nossas vizinhas <span class="text-tiffany italic">dizem</span>:</h2>
            <div class="grid md:grid-cols-3 gap-8">
                <div class="bg-nude-50 p-10 rounded-3xl border border-nude-100">
                    <div class="text-tiffany mb-6 text-2xl"><i class="fa-solid fa-quote-left"></i></div>
                    <p class="text-nude-800 mb-8 italic leading-relaxed">"Adoro que é perto de casa e o preço é ótimo. Sempre faço limpeza de pele aqui e saio renovada!"</p>
                </div>
                <div class="bg-nude-50 p-10 rounded-3xl border border-nude-100">
                    <div class="text-tiffany mb-6 text-2xl"><i class="fa-solid fa-quote-left"></i></div>
                    <p class="text-nude-800 mb-8 italic leading-relaxed">"Sempre tive medo de ficar artificial, mas a Dra. Elizabete fez um botox tão leve que minhas amigas nem perceberam o que era, só disseram que eu estava com a cara boa."</p>
                </div>
                <div class="bg-nude-50 p-10 rounded-3xl border border-nude-100">
                    <div class="text-tiffany mb-6 text-2xl"><i class="fa-solid fa-quote-left"></i></div>
                    <p class="text-nude-800 mb-8 italic leading-relaxed">"As formas de pagamento facilitam muito. Finalmente consegui cuidar de mim sem comprometer o orçamento do mês."</p>
                </div>
            </div>
        </div>
    </section>

    </main>

    <!-- Rodapé -->
    <footer class="bg-nude-900 text-[#e8d3c3] py-16 border-t border-[#02c5ba]/20">
        <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-12 text-sm">
            <div>
                <div class="flex items-center gap-4 mb-6">
                    <div class="w-12 h-12 bg-tiffany/10 rounded-full flex items-center justify-center text-tiffany font-serif text-xl italic font-bold">EM</div>
                    <div>
                        <h4 class="font-serif font-bold text-white leading-tight">Dra. Elizabete De Marchi</h4>
                        <p class="text-[10px] text-tiffany uppercase tracking-widest font-semibold">Estética Local Segura</p>
                    </div>
                </div>
                <p class="text-xs leading-relaxed text-[#c5a27e]">
                    Estética acessível, com segurança e foco em resultados naturais.
                </p>
            </div>
            <div>
                <h4 class="text-white font-bold mb-6 uppercase tracking-wider text-xs">Links Rápidos</h4>
                <ul class="space-y-3 text-xs">
                    <li><a href="#" class="hover:text-tiffany transition-colors">Início</a></li>
                    <li><a href="#pilares" class="hover:text-tiffany transition-colors">Tratamentos</a></li>
                    <li><a href="#depoimentos" class="hover:text-tiffany transition-colors">Depoimentos</a></li>
                </ul>
            </div>
            <div>
                <h4 class="text-white font-bold mb-6 uppercase tracking-wider text-xs">Atendimento</h4>
                <ul class="space-y-3 text-xs text-[#c5a27e]">
                    <li>Segunda a Sexta: 08h às 18h</li>
                    <li>Sábado: 08h às 12h</li>
                </ul>
            </div>
            <div>
                <h4 class="text-white font-bold mb-6 uppercase tracking-wider text-xs">Contato Local</h4>
                <div class="text-xs text-[#c5a27e] space-y-2">
                    <p><strong class="text-white">Responsável Técnica:</strong><br> Dra. Elizabete De Marchi<br>CRBM-PR 9991</p>
                    <p><strong class="text-white">Localização:</strong><br> Curitiba - PR</p>
                </div>
            </div>
        </div>
        <div class="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-[#02c5ba]/10 text-center text-xs flex flex-col md:flex-row justify-between items-center text-[#c5a27e]">
            <p>&copy; 2026 Dra. Elizabete De Marchi. Todos os direitos reservados.</p>
            <p class="mt-2 md:mt-0">Design & Otimização Local por <a href="#" class="text-white font-bold hover:text-tiffany transition">ESCOM STUDIO</a></p>
        </div>
    </footer>
</body>
</html>`;

const startString = "const elizabeteHtml = `<!DOCTYPE html>";
const endString = "</html>`;";

const startIndex = content.indexOf(startString);
const endIndex = content.indexOf(endString, startIndex) + endString.length;

if (startIndex === -1 || endIndex === -1) {
    console.error("Não foi possível encontrar a string de substituição");
    process.exit(1);
}

const before = content.substring(0, startIndex);
const after = content.substring(endIndex);

const newContent = before + "const elizabeteHtml = `" + newElizabeteHtml + "`;" + after;

fs.writeFileSync('rebuild_layouts_correctly.mjs', newContent, 'utf8');
console.log("Arquivo atualizado com sucesso!");
