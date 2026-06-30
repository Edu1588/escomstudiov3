import fs from 'fs';
import path from 'path';

const html = `<!DOCTYPE html>
<html class="scroll-smooth" lang="pt-BR">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>Dra. Elizabete De Marchi - Biomedicina Estética</title>
    <link href="https://fonts.googleapis.com" rel="preconnect"/>
    <link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet"/>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
    <script src="https://cdn.tailwindcss.com"></script>
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
    <style>
        .glass-nav {
            background: rgba(250, 248, 245, 0.85);
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

    <!-- Navbar -->
    <nav class="fixed w-full z-50 glass-nav transition-all duration-300" id="navbar">
        <div class="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-tiffany/10 rounded-full flex items-center justify-center text-tiffany font-serif text-xl italic font-bold">EM</div>
                <div>
                    <h1 class="font-serif font-bold text-nude-900 leading-tight">Dra. Elizabete De Marchi</h1>
                    <p class="text-xs text-nude-500 uppercase tracking-widest">Biomedicina Estética</p>
                </div>
            </div>
            <a href="#contato" class="btn-primary font-bold px-8 py-3 rounded-full hidden md:inline-block">Agendar Avaliação</a>
        </div>
    </nav>

    <!-- 1. Hero Section -->
    <header class="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-nude-100">
        <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] opacity-30 mix-blend-multiply"></div>
        <div class="max-w-7xl mx-auto px-6 relative z-10">
            <div class="grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <span class="text-tiffany font-bold uppercase tracking-widest text-sm mb-4 block">Estética Avançada em Curitiba</span>
                    <h2 class="text-5xl md:text-6xl font-serif font-bold text-nude-900 leading-tight mb-6">
                        Descubra os 4 Pilares do <span class="text-nude-500 italic">Rejuvenescimento</span> Facial
                    </h2>
                    <p class="text-lg text-nude-800 mb-10 max-w-lg leading-relaxed">
                        Tratamentos personalizados para um rosto mais jovem, harmônico e natural. Desvende o segredo para revitalizar sua aparência sem exageros.
                    </p>
                    <a href="#contato" class="btn-primary font-bold px-10 py-4 rounded-full inline-flex items-center gap-3 text-lg">
                        Quero agendar meu horário <i class="fa-solid fa-arrow-right"></i>
                    </a>
                </div>
                <div class="relative">
                    <div class="absolute inset-0 bg-nude-200 rounded-[3rem] transform rotate-3 scale-105 z-0"></div>
                    <img src="https://images.unsplash.com/photo-1594824432258-454fa9156637?q=80&w=800&auto=format&fit=crop" alt="Dra. Elizabete" class="relative z-10 rounded-[3rem] shadow-2xl object-cover h-[600px] w-full">
                    <div class="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl z-20">
                        <p class="font-serif font-bold text-2xl text-tiffany mb-1">+10 anos</p>
                        <p class="text-sm text-nude-500 uppercase tracking-widest">de Experiência</p>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- 3. Prova Social / Vídeo -->
    <section class="py-24 bg-white relative">
        <div class="max-w-7xl mx-auto px-6 text-center">
            <span class="text-nude-400 font-bold uppercase tracking-widest text-sm mb-4 block">Conheça o método</span>
            <h2 class="text-4xl font-serif font-bold text-nude-900 mb-16">
                Como recuperar a firmeza e a <br><span class="text-tiffany italic">juventude da sua pele</span>
            </h2>
            
            <div class="relative max-w-4xl mx-auto rounded-[2rem] overflow-hidden shadow-2xl group cursor-pointer border-8 border-nude-50">
                <img src="https://images.unsplash.com/photo-1614859324967-bdf31ce86910?q=80&w=1200&auto=format&fit=crop" class="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105" alt="Vídeo demonstrativo">
                <div class="absolute inset-0 bg-nude-900/20 group-hover:bg-nude-900/40 transition-colors duration-500"></div>
                <div class="absolute inset-0 flex items-center justify-center flex-col">
                    <div class="w-24 h-24 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-tiffany text-3xl shadow-[0_0_50px_rgba(255,255,255,0.5)] group-hover:scale-110 transition-transform duration-500">
                        <i class="fa-solid fa-play ml-2"></i>
                    </div>
                    <p class="mt-6 text-white font-serif text-xl italic drop-shadow-md">Clique e assista</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 2. Benefícios: 4 Pilares -->
    <section class="py-24 bg-nude-100 border-y border-nude-200" id="pilares">
        <div class="max-w-7xl mx-auto px-6">
            <div class="text-center mb-20">
                <h2 class="text-4xl font-serif font-bold text-nude-900 mb-4">O Tratamento Revolucionário</h2>
                <p class="text-nude-500 uppercase tracking-widest">Baseado nos 4 pilares do rejuvenescimento</p>
            </div>
            
            <div class="grid md:grid-cols-3 gap-8 items-center">
                <!-- Esquerda -->
                <div class="space-y-12">
                    <div class="text-right">
                        <span class="text-tiffany font-bold uppercase tracking-widest text-xs mb-2 block">Primeiro Pilar</span>
                        <h3 class="text-2xl font-serif font-bold text-nude-900 mb-3">Textura da Pele</h3>
                        <p class="text-nude-800 text-sm leading-relaxed">Melhoramos manchas, brilho e viço com peelings e microagulhamento, garantindo uma pele de porcelana.</p>
                    </div>
                    <div class="text-right">
                        <span class="text-tiffany font-bold uppercase tracking-widest text-xs mb-2 block">Terceiro Pilar</span>
                        <h3 class="text-2xl font-serif font-bold text-nude-900 mb-3">Rugas e Linhas</h3>
                        <p class="text-nude-800 text-sm leading-relaxed">Suavizamos expressões faciais com toxina botulínica, prevenindo marcas profundas e envelhecimento precoce.</p>
                    </div>
                </div>
                
                <!-- Centro (Imagem) -->
                <div class="relative px-4">
                    <div class="aspect-[3/4] rounded-[3rem] overflow-hidden relative shadow-2xl">
                        <img src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=800&auto=format&fit=crop" class="w-full h-full object-cover" alt="Tratamento">
                        <div class="absolute inset-0 border-2 border-white/50 m-4 rounded-[2.5rem]"></div>
                    </div>
                    <!-- Círculo Central Absoluto -->
                    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-nude-300 rounded-full flex items-center justify-center animate-[spin_30s_linear_infinite]">
                        <svg viewBox="0 0 100 100" class="w-full h-full text-nude-400 overflow-visible">
                            <path d="M 50, 50 m -50, 0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0" id="circle" fill="none" />
                            <text class="uppercase tracking-[0.3em] text-[10px] fill-current">
                                <textPath href="#circle">4 Pilares do Rejuvenescimento Facial *</textPath>
                            </text>
                        </svg>
                    </div>
                </div>
                
                <!-- Direita -->
                <div class="space-y-12">
                    <div class="text-left">
                        <span class="text-tiffany font-bold uppercase tracking-widest text-xs mb-2 block">Segundo Pilar</span>
                        <h3 class="text-2xl font-serif font-bold text-nude-900 mb-3">Flacidez</h3>
                        <p class="text-nude-800 text-sm leading-relaxed">Avaliamos a flacidez e utilizamos bioestimuladores de colágeno para recuperar a firmeza e sustentação natural.</p>
                    </div>
                    <div class="text-left">
                        <span class="text-tiffany font-bold uppercase tracking-widest text-xs mb-2 block">Quarto Pilar</span>
                        <h3 class="text-2xl font-serif font-bold text-nude-900 mb-3">Sustentação</h3>
                        <p class="text-nude-800 text-sm leading-relaxed">Preenchimento estratégico com ácido hialurônico para devolver volume aos locais onde ocorreu reabsorção óssea.</p>
                    </div>
                </div>
            </div>
            
            <div class="text-center mt-20">
                <a href="#contato" class="inline-flex items-center gap-4 bg-white border border-nude-200 text-nude-900 font-bold px-10 py-4 rounded-full hover:border-tiffany transition-colors shadow-sm">
                    Quero agendar meu horário <i class="fa-solid fa-arrow-right text-tiffany"></i>
                </a>
            </div>
        </div>
    </section>

    <!-- 4. Depoimentos -->
    <section class="py-24 bg-white" id="depoimentos">
        <div class="max-w-7xl mx-auto px-6">
            <h2 class="text-3xl font-serif font-bold text-center text-nude-900 mb-16">Com a palavra, <span class="text-tiffany italic">nossas pacientes</span>:</h2>
            
            <div class="grid md:grid-cols-3 gap-8">
                <div class="bg-nude-50 p-10 rounded-3xl border border-nude-100">
                    <div class="text-tiffany mb-6 text-2xl"><i class="fa-solid fa-quote-left"></i></div>
                    <p class="text-nude-800 mb-8 italic leading-relaxed">"O cuidado da Dra. Elizabete mudou minha autoestima. O resultado ficou extremamente natural, as pessoas notam que estou mais jovem, mas não sabem exatamente o que fiz!"</p>
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-nude-200 rounded-full overflow-hidden">
                            <img src="https://i.pravatar.cc/150?img=1" class="w-full h-full object-cover">
                        </div>
                        <div>
                            <p class="font-bold text-nude-900">Mariana S.</p>
                            <p class="text-xs text-nude-400">Toxina e Bioestimulador</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-nude-50 p-10 rounded-3xl border border-nude-100">
                    <div class="text-tiffany mb-6 text-2xl"><i class="fa-solid fa-quote-left"></i></div>
                    <p class="text-nude-800 mb-8 italic leading-relaxed">"Sempre tive medo de ficar com o rosto 'congelado'. A Dra me tranquilizou, explicou cada pilar e hoje confio de olhos fechados. Profissional excepcional."</p>
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-nude-200 rounded-full overflow-hidden">
                            <img src="https://i.pravatar.cc/150?img=5" class="w-full h-full object-cover">
                        </div>
                        <div>
                            <p class="font-bold text-nude-900">Fernanda C.</p>
                            <p class="text-xs text-nude-400">Harmonização Facial</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-nude-50 p-10 rounded-3xl border border-nude-100">
                    <div class="text-tiffany mb-6 text-2xl"><i class="fa-solid fa-quote-left"></i></div>
                    <p class="text-nude-800 mb-8 italic leading-relaxed">"O ambiente é maravilhoso, o atendimento impecável do início ao fim. O preenchimento labial ficou perfeito, com o contorno e volume que eu sempre sonhei."</p>
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-nude-200 rounded-full overflow-hidden">
                            <img src="https://i.pravatar.cc/150?img=9" class="w-full h-full object-cover">
                        </div>
                        <div>
                            <p class="font-bold text-nude-900">Juliana R.</p>
                            <p class="text-xs text-nude-400">Preenchimento Labial</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>
<!-- O script patch comercial injetará FAQ, Contato, Dossiê e Proposta aqui abaixo -->
</body>
</html>`;

fs.writeFileSync('public/template-elizabete/index.html', html, 'utf-8');
console.log("Template Elizabete gerado.");
