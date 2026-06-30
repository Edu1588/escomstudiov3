import fs from 'fs';
import path from 'path';

const htmlTemplate = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>Dra. Elizabete De Marchi - Biomedicina Estética Segura</title>
    
    <!-- Google Fonts: Poppins e Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- FontAwesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
    
    <!-- CSS Fallback Anti-Invisibilidade e Estilos -->
    <style>
        /* Anti-Invisibilidade: Se o JS falhar ou a classe js-loaded não for adicionada, os fade-ups ficam opacos por padrão */
        .no-js .fade-up {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }

        html.lenis { height: auto; }
        .lenis.lenis-smooth { scroll-behavior: auto !important; }
        .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
        .lenis.lenis-stopped { overflow: hidden; }
        .lenis.lenis-scrolling iframe { pointer-events: none; }
        
        /* Utility classes for intersection observer animations */
        .fade-up {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .fade-up.is-visible {
            opacity: 1;
            transform: translateY(0);
        }
        .delay-100 { transition-delay: 100ms; }
        .delay-200 { transition-delay: 200ms; }
        .delay-300 { transition-delay: 300ms; }

        /* Split Type styling */
        .char {
            transform: translateY(115%);
            transition: transform .5s cubic-bezier(.19,1,.22,1);
        }
    </style>

    <!-- Tailwind Config -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        pme: {
                            50: '#f0f9ff', // sky-50
                            100: '#e0f2fe',
                            800: '#1e293b', // slate-800
                            900: '#0f172a', // slate-900
                        },
                        brand: {
                            DEFAULT: '#10b981', // emerald-500
                            dark: '#059669',
                            light: '#d1fae5'
                        }
                    },
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        title: ['Poppins', 'sans-serif'],
                    }
                }
            }
        }
    </script>
</head>
<!-- A classe no-js é adicionada de fábrica e será removida se o JS rodar perfeitamente -->
<body class="bg-pme-50 text-pme-800 font-sans antialiased overflow-x-hidden no-js">
    
    <!-- Header -->
    <header class="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-brand text-white rounded flex items-center justify-center font-title font-bold text-lg">EM</div>
                <div class="leading-tight">
                    <h1 class="font-title font-bold text-pme-900 text-sm md:text-base">Dra. Elizabete De Marchi</h1>
                    <span class="text-[10px] md:text-xs text-gray-500 font-medium uppercase tracking-wider">Estética Segura & Acessível</span>
                </div>
            </div>
            <a href="#agendar" class="bg-brand hover:bg-brand-dark text-white px-5 py-2.5 rounded-full font-title font-medium text-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                <i class="fab fa-whatsapp mr-2"></i> Falar Agora
            </a>
        </div>
    </header>

    <main class="pt-20">
        
        <!-- Hero Section -->
        <section class="relative min-h-[90vh] flex items-center overflow-hidden bg-white">
            <div class="absolute top-0 right-0 w-1/2 h-full bg-pme-50 rounded-bl-[100px] -z-0"></div>
            
            <div class="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10 py-12">
                <div class="max-w-xl">
                    <span class="text-brand font-bold uppercase tracking-wider text-sm mb-4 block fade-up">Estética Acessível em Curitiba</span>
                    <h2 class="hero-title font-title font-bold text-4xl md:text-5xl lg:text-6xl text-pme-900 leading-[1.1] mb-6 overflow-hidden">
                        Realce sua beleza de forma natural e segura.
                    </h2>
                    <p class="text-gray-600 text-lg mb-8 fade-up delay-200 leading-relaxed">
                        Procedimentos estéticos de excelência não precisam ser inacessíveis. Devolvemos sua autoestima com protocolos seguros, foco em saúde e preços justos.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 fade-up delay-300">
                        <a href="#agendar" class="bg-brand text-white text-center px-8 py-4 rounded-full font-title font-semibold text-lg hover:bg-brand-dark transition-all duration-300 hover:shadow-xl hover:shadow-brand/20 hover:-translate-y-1">
                            Agendar Avaliação Gratuita <i class="fas fa-arrow-right ml-2"></i>
                        </a>
                    </div>
                    
                    <div class="mt-12 flex items-center gap-6 fade-up delay-300 border-t border-gray-100 pt-6">
                        <div class="flex items-center gap-2">
                            <i class="fas fa-check-circle text-brand text-xl"></i>
                            <span class="text-sm font-medium text-gray-700">Registro ANVISA</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <i class="fas fa-check-circle text-brand text-xl"></i>
                            <span class="text-sm font-medium text-gray-700">Parcelamento Flexível</span>
                        </div>
                    </div>
                </div>
                
                <div class="relative w-full aspect-[4/5] lg:aspect-square fade-up delay-100">
                    <div class="absolute inset-0 bg-brand-light rounded-[2rem] transform translate-x-4 translate-y-4"></div>
                    <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop" 
                         onerror="this.src='https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop'"
                         alt="Dra Elizabete Atendendo" 
                         class="absolute inset-0 w-full h-full object-cover rounded-[2rem] shadow-xl z-10" />
                    
                    <div class="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-2xl z-20 fade-up delay-300 border border-gray-100">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 bg-pme-50 rounded-full flex items-center justify-center text-brand text-xl">
                                <i class="fas fa-star"></i>
                            </div>
                            <div>
                                <div class="font-title font-bold text-pme-900">Resultados Naturais</div>
                                <div class="text-sm text-gray-500">Sem exageros</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Diferenciais -->
        <section class="py-24 bg-pme-50">
            <div class="max-w-7xl mx-auto px-6">
                <div class="text-center max-w-2xl mx-auto mb-16 fade-up">
                    <h2 class="font-title font-bold text-3xl md:text-4xl text-pme-900 mb-4">Por que nos escolher?</h2>
                    <p class="text-gray-600">Trabalhamos com o conceito de estética humanizada. Seu bem-estar e segurança estão acima de qualquer padrão inatingível.</p>
                </div>
                
                <div class="grid md:grid-cols-3 gap-8">
                    <!-- Card 1 -->
                    <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow fade-up">
                        <div class="w-14 h-14 bg-brand-light text-brand rounded-xl flex items-center justify-center text-2xl mb-6">
                            <i class="fas fa-hand-holding-medical"></i>
                        </div>
                        <h3 class="font-title font-bold text-xl text-pme-900 mb-3">Segurança em 1º Lugar</h3>
                        <p class="text-gray-600 text-sm leading-relaxed">
                            Utilizamos apenas produtos com registro rigoroso da ANVISA e técnicas comprovadas. Sem atalhos, focamos totalmente na sua saúde.
                        </p>
                    </div>
                    <!-- Card 2 -->
                    <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow fade-up delay-100">
                        <div class="w-14 h-14 bg-brand-light text-brand rounded-xl flex items-center justify-center text-2xl mb-6">
                            <i class="fas fa-wallet"></i>
                        </div>
                        <h3 class="font-title font-bold text-xl text-pme-900 mb-3">Acessível de Verdade</h3>
                        <p class="text-gray-600 text-sm leading-relaxed">
                            Acreditamos que cuidar de si não é luxo. Oferecemos pacotes justos e condições de parcelamento que cabem no bolso do seu negócio familiar.
                        </p>
                    </div>
                    <!-- Card 3 -->
                    <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow fade-up delay-200">
                        <div class="w-14 h-14 bg-brand-light text-brand rounded-xl flex items-center justify-center text-2xl mb-6">
                            <i class="fas fa-leaf"></i>
                        </div>
                        <h3 class="font-title font-bold text-xl text-pme-900 mb-3">Resultados Naturais</h3>
                        <p class="text-gray-600 text-sm leading-relaxed">
                            Nossa abordagem evita o aspecto artificial. Queremos que você se sinta você mesma(o), apenas mais jovem e confiante.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Serviços -->
        <section class="py-24 bg-white" id="servicos">
            <div class="max-w-7xl mx-auto px-6">
                <div class="flex flex-col md:flex-row justify-between items-end mb-12 fade-up">
                    <div class="max-w-xl">
                        <span class="text-brand font-bold uppercase tracking-wider text-sm mb-2 block">Nossos Procedimentos</span>
                        <h2 class="font-title font-bold text-3xl md:text-4xl text-pme-900">Tratamentos fáceis, rápidos e seguros.</h2>
                    </div>
                    <a href="#agendar" class="hidden md:inline-flex items-center text-brand font-bold hover:text-brand-dark transition-colors">
                        Ver tabela de preços <i class="fas fa-arrow-right ml-2"></i>
                    </a>
                </div>

                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div class="group relative overflow-hidden rounded-2xl aspect-[4/3] fade-up">
                        <img src="https://images.unsplash.com/photo-1620331311520-246422fd82f9?q=80&w=600&auto=format&fit=crop" 
                             onerror="this.src='https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop'"
                             alt="Preenchimento Facial" 
                             class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div class="absolute inset-0 bg-gradient-to-t from-pme-900/90 via-pme-900/40 to-transparent"></div>
                        <div class="absolute bottom-0 left-0 p-6 w-full">
                            <h3 class="font-title font-bold text-white text-xl mb-2">Preenchimento</h3>
                            <p class="text-gray-300 text-sm opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                                Suavização de sulcos e devolução de volume com ácido hialurônico seguro.
                            </p>
                        </div>
                    </div>
                    <div class="group relative overflow-hidden rounded-2xl aspect-[4/3] fade-up delay-100">
                        <img src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=600&auto=format&fit=crop" 
                             onerror="this.src='https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop'"
                             alt="Toxina Botulínica" 
                             class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div class="absolute inset-0 bg-gradient-to-t from-pme-900/90 via-pme-900/40 to-transparent"></div>
                        <div class="absolute bottom-0 left-0 p-6 w-full">
                            <h3 class="font-title font-bold text-white text-xl mb-2">Toxina Botulínica</h3>
                            <p class="text-gray-300 text-sm opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                                Prevenção de rugas dinâmicas mantendo suas expressões naturais.
                            </p>
                        </div>
                    </div>
                    <div class="group relative overflow-hidden rounded-2xl aspect-[4/3] fade-up delay-200">
                        <img src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=600&auto=format&fit=crop" 
                             onerror="this.src='https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop'"
                             alt="Bioestimuladores de Colágeno" 
                             class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div class="absolute inset-0 bg-gradient-to-t from-pme-900/90 via-pme-900/40 to-transparent"></div>
                        <div class="absolute bottom-0 left-0 p-6 w-full">
                            <h3 class="font-title font-bold text-white text-xl mb-2">Bioestimuladores</h3>
                            <p class="text-gray-300 text-sm opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                                Tratamento para flacidez estimulando o colágeno do seu próprio corpo.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    </main>

    <!-- Footer -->
    <footer class="bg-pme-900 text-white py-16">
        <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            <div>
                <div class="flex items-center gap-3 mb-6">
                    <div class="w-10 h-10 bg-brand text-white rounded flex items-center justify-center font-title font-bold text-lg">EM</div>
                    <div class="leading-tight">
                        <span class="font-title font-bold block">Dra. Elizabete De Marchi</span>
                        <span class="text-[10px] text-gray-400 font-medium uppercase tracking-wider">CRBM-PR 9991</span>
                    </div>
                </div>
                <p class="text-gray-400 text-sm leading-relaxed mb-6">
                    Clínica de biomedicina estética acessível, focada em segurança, saúde e no resgate da sua autoestima de forma natural.
                </p>
            </div>
            
            <div>
                <h4 class="font-title font-bold mb-6 text-brand">Contato & Agendamento</h4>
                <ul class="space-y-4 text-sm text-gray-300">
                    <li class="flex items-start gap-3">
                        <i class="fab fa-whatsapp text-brand mt-1"></i>
                        <span>(41) 99999-9999<br><span class="text-xs text-gray-500">Respondemos em até 10 minutos.</span></span>
                    </li>
                    <li class="flex items-start gap-3">
                        <i class="fas fa-map-marker-alt text-brand mt-1"></i>
                        <span>Curitiba - PR<br><span class="text-xs text-gray-500">Fácil acesso e estacionamento.</span></span>
                    </li>
                </ul>
            </div>
            
            <div>
                <h4 class="font-title font-bold mb-6 text-brand">Horário de Atendimento</h4>
                <ul class="space-y-2 text-sm text-gray-300">
                    <li class="flex justify-between border-b border-gray-800 pb-2">
                        <span>Segunda a Sexta</span>
                        <span class="font-medium text-white">08:00 - 18:00</span>
                    </li>
                    <li class="flex justify-between border-b border-gray-800 pb-2 pt-2">
                        <span>Sábados</span>
                        <span class="font-medium text-white">08:00 - 12:00</span>
                    </li>
                </ul>
            </div>
        </div>
        
        <div class="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-800 text-center md:flex md:justify-between md:items-center">
            <p class="text-gray-500 text-sm mb-4 md:mb-0">&copy; 2026 Dra. Elizabete De Marchi. Todos os direitos reservados.</p>
            <p class="text-gray-500 text-sm">Design Acessível & Otimizado por <span class="text-brand font-bold">ESCOM STUDIO</span></p>
        </div>
    </footer>

    <!-- Scripts CDN -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
    <script src="https://unpkg.com/@studio-freight/lenis@1.0.39/dist/lenis.min.js"></script>
    <script src="https://unpkg.com/split-type@0.3.4/umd/index.min.js"></script> <!-- FIXED CDN -->

    <script>
        document.addEventListener("DOMContentLoaded", () => {
            // Remove a classe de bloqueio CSS Fallback
            document.body.classList.remove('no-js');

            // 1. Inicializar Intersection Observer (Mais crítico e leve)
            try {
                const observerOptions = {
                    root: null,
                    rootMargin: '0px',
                    threshold: 0.1
                };

                const observer = new IntersectionObserver((entries, obs) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('is-visible');
                            obs.unobserve(entry.target);
                        }
                    });
                }, observerOptions);

                document.querySelectorAll('.fade-up').forEach(el => {
                    observer.observe(el);
                });
            } catch (err) {
                console.error("IntersectionObserver falhou:", err);
                document.body.classList.add('no-js'); // Força a revelação
            }

            // 2. Inicializar Lenis (Scroll Smooth)
            try {
                if (typeof Lenis !== 'undefined') {
                    const lenis = new Lenis({
                        duration: 1.2,
                        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                        direction: 'vertical',
                        gestureDirection: 'vertical',
                        smooth: true,
                        smoothTouch: false,
                        touchMultiplier: 2,
                    });

                    function raf(time) {
                        lenis.raf(time);
                        requestAnimationFrame(raf);
                    }
                    requestAnimationFrame(raf);

                    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
                        gsap.registerPlugin(ScrollTrigger);
                        lenis.on('scroll', ScrollTrigger.update);
                        gsap.ticker.add((time)=>{
                            lenis.raf(time * 1000);
                        });
                        gsap.ticker.lagSmoothing(0);
                    }
                }
            } catch (err) {
                console.error("Lenis/GSAP Scroll falhou:", err);
            }

            // 3. Inicializar SplitType
            try {
                if (typeof SplitType !== 'undefined' && typeof gsap !== 'undefined') {
                    const myText = new SplitType('.hero-title', { types: 'words, chars' });
                    
                    gsap.fromTo(myText.chars, 
                        { 
                            y: 115,
                            opacity: 0
                        },
                        {
                            y: 0,
                            opacity: 1,
                            stagger: 0.02,
                            duration: 0.8,
                            ease: "power4.out",
                            delay: 0.1
                        }
                    );
                } else {
                    console.warn("SplitType ou GSAP não encontrados, título carregado sem animação custom.");
                }
            } catch (err) {
                console.error("SplitType falhou:", err);
            }
        });
    </script>
</body>
</html>`;

const outPath = path.resolve('public', 'template-elizabete', 'index.html');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, htmlTemplate, 'utf8');

console.log('✅ Template Dra. Elizabete V2 gerado com sucesso em:', outPath);
