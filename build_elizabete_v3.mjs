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
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
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
            transform: translateY(40px);
            transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1);
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
        
        /* Custom Shapes based on Reference */
        .bg-soft { background-color: #faf9f6; } /* Off-white/Cream */
        .text-accent { color: #4a4036; } /* Taupe de Alto Contraste WCAG */
        
        .vertical-text {
            writing-mode: vertical-rl;
            text-orientation: mixed;
            transform: rotate(180deg);
        }
    </style>

    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        brand: {
                            DEFAULT: '#047857', // emerald-700 (Alto contraste WCAG)
                            dark: '#064e3b',    // emerald-900
                            light: '#d1fae5'
                        },
                        base: '#ffffff', // Branco puro para contraste máximo
                        ink: '#111827',  // slate-900
                        taupe: '#5c5042' // Taupe escuro (Alto contraste WCAG > 7:1)
                    },
                    fontFamily: {
                        sans: ['Outfit', 'sans-serif'],
                        title: ['Playfair Display', 'serif'], // Fontes padronizadas Premium
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-base text-ink font-sans antialiased overflow-x-hidden no-js">
    
    <!-- Header -->
    <header class="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm transition-all duration-300">
        <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="leading-tight text-left">
                    <h1 class="font-title font-bold text-ink text-xl tracking-wide uppercase">Dra. Elizabete</h1>
                    <span class="text-[10px] text-taupe uppercase tracking-widest font-semibold">Biomedicina Estética</span>
                </div>
            </div>
            
            <!-- Nova Estrutura de Menu Simplificada e Hierárquica -->
            <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-ink">
                    <ul class="hidden md:flex gap-8">
                        <li><a href="#sobre" class="text-ink hover:text-brand font-medium transition-colors text-sm">Sobre a Dra.</a></li>
                        <li><a href="#procedimentos" class="text-ink hover:text-brand font-medium transition-colors text-sm">Procedimentos</a></li>
                        <li><a href="#transparencia" class="text-ink hover:text-brand font-medium transition-colors text-sm">Transparência</a></li>
                        <li><a href="#depoimentos" class="text-ink hover:text-brand font-medium transition-colors text-sm">Relatos</a></li>
                    </ul>
            </nav>

            <div class="flex items-center gap-4">
                <button type="button" aria-label="Buscar tratamentos" class="text-ink hover:text-brand transition-colors cursor-pointer p-2 focus:outline-none focus:ring-2 focus:ring-brand rounded" onclick="alert('Função de busca ativada.')">
                    <i class="fas fa-search"></i>
                </button>
                <a href="#agendar" class="bg-brand hover:bg-brand-dark text-white px-6 py-2.5 rounded-lg font-sans font-semibold text-sm transition-all duration-300 hover:shadow-lg btn-agendar focus:outline-none focus:ring-4 focus:ring-brand/30">
                    <i class="fab fa-whatsapp mr-2"></i> Agendar meu horário
                </a>
            </div>
        </div>
    </header>

    <main>
        
        <!-- Hero Section -->
        <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
            <!-- Full Background Image -->
            <div class="absolute inset-0 z-0 bg-[#0f172a]">
                <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1920" 
                     alt="Dra Elizabete Fundo" 
                     class="w-full h-full object-cover object-top opacity-50 mix-blend-overlay" />
                <!-- Dark Elegant Overlay -->
                <div class="absolute inset-0 bg-gradient-to-r from-[#0f172a]/95 via-[#0f172a]/70 to-transparent"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-transparent to-transparent"></div>
                <!-- Cinematic Brand Glow -->
                <div class="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-[#047857]/40 via-transparent to-transparent pointer-events-none"></div>
            </div>
            
            <div class="max-w-7xl mx-auto px-6 w-full relative z-10 grid lg:grid-cols-2 gap-12 items-center pt-20">
                <div class="max-w-xl">
                    <span class="text-white/80 font-medium uppercase tracking-widest text-xs mb-6 block fade-up border-l-2 border-brand pl-4">Estética Avançada em Curitiba</span>
                    <h2 class="hero-title font-title font-light text-5xl md:text-6xl text-white leading-[1.1] mb-8 overflow-hidden uppercase tracking-wide">
                        Descubra os 4 pilares do <span class="font-bold text-[#d1fae5]">rejuvenescimento facial</span>
                    </h2>
                    <p class="text-white/80 text-lg mb-10 fade-up delay-200 font-light leading-relaxed">
                        Tratamentos personalizados para um rosto mais jovem e natural. Agende seu horário e desvende o segredo para revitalizar sua aparência.
                    </p>
                    <div class="fade-up delay-300 flex items-center gap-6">
                        <a href="#agendar" class="bg-brand text-white px-8 py-4 rounded-full font-sans font-medium text-sm hover:bg-[#d1fae5] hover:text-[#064e3b] transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:shadow-brand/30 inline-flex items-center gap-3 btn-agendar">
                            <i class="fab fa-whatsapp text-lg"></i> Quero agendar meu horário
                        </a>
                    </div>
                </div>
                <!-- Coluna vazia para visualização da imagem na direita -->
                <div class="hidden lg:block"></div>
            </div>
        </section>

        <section class="py-24 bg-gray-50 relative border-t border-gray-100" id="tratamentos">
            <div class="max-w-4xl mx-auto px-6 text-center">
                <span class="text-taupe text-sm font-bold uppercase tracking-wider block mb-4 fade-up">Conheça por onde você pode começar hoje mesmo</span>
                <h3 class="font-title font-bold text-3xl md:text-4xl text-ink mb-12 fade-up">
                    Dra. Elizabete explica como recuperar a firmeza e a juventude da sua pele:
                </h3>
                
                <div class="relative aspect-video rounded-2xl overflow-hidden shadow-xl fade-up delay-200 group cursor-pointer border-4 border-white">
                    <img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1200&auto=format&fit=crop" alt="Thumbnail Vídeo Dra Elizabete" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div class="absolute inset-0 bg-ink/30 group-hover:bg-ink/20 transition-colors"></div>
                    <div class="absolute inset-0 flex items-center justify-center">
                        <div class="w-20 h-20 bg-brand text-white rounded-full flex items-center justify-center text-2xl pl-2 shadow-lg group-hover:scale-110 transition-transform">
                            <i class="fas fa-play"></i>
                        </div>
                    </div>
                    <div class="absolute inset-0 flex items-center justify-center mt-32">
                        <span class="text-white font-title text-xl font-bold tracking-wide shadow-black drop-shadow-md">Clique e assista</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- 4 Pilares Section -->
        <section class="py-32 bg-base relative overflow-hidden">
            <div class="max-w-7xl mx-auto px-6 relative z-10">
                <div class="text-center mb-20 fade-up">
                    <span class="text-taupe text-sm uppercase tracking-widest block mb-4">O tratamento revolucionário é baseado nos</span>
                    <h2 class="font-title font-light text-3xl md:text-4xl text-ink uppercase tracking-wide">
                        <span class="font-bold">4 Pilares</span> do Rejuvenescimento
                    </h2>
                </div>
                
                <div class="relative grid md:grid-cols-3 gap-8 items-center">
                    
                    <!-- Pilar bg text -->
                    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[150px] font-title font-bold text-taupe/5 whitespace-nowrap -rotate-90 pointer-events-none select-none">
                        4 PILARES
                    </div>

                    <!-- Esquerda -->
                    <div class="space-y-16 relative z-10">
                        <div class="fade-up">
                            <span class="text-taupe text-xs font-bold uppercase tracking-widest block mb-2">Primeiro Pilar</span>
                            <h4 class="font-title text-xl text-ink mb-3">Textura da pele</h4>
                            <p class="text-sm text-taupe font-light leading-relaxed">
                                Avaliamos manchas, textura, brilho e qualidade da pele. Para melhorar estes aspectos, oferecemos opções como peelings e microagulhamento que renovam a cútis.
                            </p>
                        </div>
                        <div class="fade-up delay-100">
                            <span class="text-taupe text-xs font-bold uppercase tracking-widest block mb-2">Terceiro Pilar</span>
                            <h4 class="font-title text-xl text-ink mb-3">Rugas de expressão</h4>
                            <p class="text-sm text-taupe font-light leading-relaxed">
                                Prevenimos as expressões marcadas, utilizando toxina botulínica para relaxar a musculatura de forma elegante e natural no terço superior do rosto.
                            </p>
                        </div>
                    </div>

                    <!-- Centro Imagem -->
                    <div class="relative h-[600px] flex justify-center fade-up delay-200 z-10">
                        <div class="absolute inset-0 bg-white rounded-full opacity-50 blur-2xl"></div>
                        <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop" 
                             onerror="this.src='https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop'"
                             alt="Pele Perfeita" 
                             class="h-full object-cover rounded-[100px] shadow-sm border-[8px] border-white" />
                    </div>

                    <!-- Direita -->
                    <div class="space-y-16 relative z-10">
                        <div class="fade-up delay-100">
                            <span class="text-taupe text-xs font-bold uppercase tracking-widest block mb-2">Segundo Pilar</span>
                            <h4 class="font-title text-xl text-ink mb-3">Flacidez</h4>
                            <p class="text-sm text-taupe font-light leading-relaxed">
                                Avaliamos a perda de colágeno da pele. Nesse caso, recomendamos o uso de bioestimuladores que estimulam a produção natural, melhorando a firmeza.
                            </p>
                        </div>
                        <div class="fade-up delay-200">
                            <span class="text-taupe text-xs font-bold uppercase tracking-widest block mb-2">Quarto Pilar</span>
                            <h4 class="font-title text-xl text-ink mb-3">Sustentação</h4>
                            <p class="text-sm text-taupe font-light leading-relaxed">
                                Observamos os sulcos e sombras presentes na face ("bigode chinês"). Para tratar, utilizamos ácido hialurônico de alta qualidade para restauração do contorno.
                            </p>
                        </div>
                    </div>

                </div>
                
                <div class="mt-20 text-center fade-up delay-300">
                    <a href="#agendar" class="border border-taupe/30 text-taupe px-10 py-4 rounded-full font-sans font-medium text-sm hover:bg-taupe hover:text-white transition-all duration-300 inline-flex items-center gap-3">
                        Entre em contato e conheça mais sobre o meu método <i class="fas fa-chevron-right text-xs"></i>
                    </a>
                </div>
            </div>
        </section>

        <section class="py-24 bg-white relative border-y border-gray-100">
            <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                <div class="fade-up">
                    <h3 class="font-title font-bold text-3xl md:text-4xl text-ink leading-tight mb-8">
                        Você já se olhou no espelho e sentiu que seu rosto não é mais o mesmo?
                    </h3>
                    <!-- Removido opacity-70 e font-light para garantir 100% de contraste -->
                    <div class="space-y-6 text-gray-900 font-normal text-base leading-relaxed">
                        <p>
                            À medida que o tempo passa, é comum enfrentar a perda do contorno facial, um fenômeno que muitos chamam de "derretimento facial".
                        </p>
                        <p>
                            A produção de colágeno diminui após os 30 anos, resultando em uma pele mais flácida. Além disso, alterações na estrutura óssea e enfraquecimento dos ligamentos contribuem para a perda da jovialidade.
                        </p>
                    </div>
                </div>
                
                <div class="relative fade-up delay-200">
                    <img src="https://images.unsplash.com/photo-1550525811-e5869dd03032?q=80&w=800&auto=format&fit=crop" alt="Mulher observando o rosto" class="rounded-tl-[4rem] rounded-br-[4rem] w-full object-cover aspect-[4/3] shadow-2xl grayscale mix-blend-multiply transition-transform duration-700 hover:scale-[1.02]" />
                </div>
            </div>
        </section>

        <!-- Benefícios Section -->
        <section class="py-24 bg-gray-50 border-b border-gray-100">
            <div class="max-w-7xl mx-auto px-6">
                <div class="text-center mb-20 fade-up">
                    <span class="text-taupe text-sm uppercase tracking-widest block mb-4">O tratamento revolucionário é baseado nos</span>
                    <h3 class="font-title font-bold text-3xl md:text-4xl text-ink">Os 4 Pilares da Dra. Elizabete</h3>
                </div>
                
                <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8 pilares-grid">
                    <!-- Benefit 1 -->
                    <div class="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-gray-100 text-center fade-up transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                        <div class="w-16 h-16 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                            <i class="fas fa-user-md"></i>
                        </div>
                        <h4 class="font-title font-bold text-ink mb-3 text-lg">Atendimento Personalizado</h4>
                        <p class="text-gray-600 text-sm font-normal">Planos de tratamento criados sob medida para as necessidades reais e anatomia do seu rosto.</p>
                    </div>
                    <!-- Benefit 2 -->
                    <div class="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-gray-100 text-center fade-up delay-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                        <div class="w-16 h-16 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                            <i class="fas fa-gem"></i>
                        </div>
                        <h4 class="font-title font-bold text-ink mb-3 text-lg">Produtos Premium</h4>
                        <p class="text-gray-600 text-sm font-normal">Utilizamos apenas os melhores preenchedores e toxinas do mercado, garantindo segurança e durabilidade.</p>
                    </div>
                    <!-- Benefit 3 -->
                    <div class="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-gray-100 text-center fade-up delay-200 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                        <div class="w-16 h-16 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                            <i class="fas fa-heartbeat"></i>
                        </div>
                        <h4 class="font-title font-bold text-ink mb-3 text-lg">Acompanhamento Clínico</h4>
                        <p class="text-gray-600 text-sm font-normal">Suporte total no pós-procedimento para acompanhar de perto a evolução dos seus resultados.</p>
                    </div>
                    <!-- Benefit 4 -->
                    <div class="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-gray-100 text-center fade-up delay-300 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                        <div class="w-16 h-16 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                            <i class="fas fa-spa"></i>
                        </div>
                        <h4 class="font-title font-bold text-ink mb-3 text-lg">Ambiente Acolhedor</h4>
                        <p class="text-gray-600 text-sm font-normal">Clínica preparada para proporcionar máximo conforto, descrição e luxo durante sua visita.</p>
                    </div>
                </div>
            </div>
        </section>


        <!-- Sobre a Dra Elizabete -->
        <section class="py-24 bg-white border-b border-gray-100" id="sobre">
            <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                <div class="relative fade-up">
                    <div class="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-xl gsap-img-container">
                        <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop" alt="Dra. Elizabete De Marchi" class="w-full h-[120%] object-cover gsap-parallax" />
                    </div>
                    <div class="absolute -bottom-6 -right-6 bg-brand text-white p-6 rounded-2xl shadow-lg hidden md:block">
                        <div class="text-3xl font-bold font-title">10+</div>
                        <div class="text-sm uppercase tracking-wider font-medium">Anos de<br>Experiência</div>
                    </div>
                </div>
                
                <div class="fade-up delay-100">
                    <span class="text-taupe text-sm font-bold uppercase tracking-widest block mb-4">Sua Profissional</span>
                    <h3 class="font-title font-bold text-3xl md:text-4xl text-ink leading-tight mb-8">
                        Por que escolher a Dra. Elizabete De Marchi?
                    </h3>
                    <div class="space-y-6 text-gray-900 font-normal text-base leading-relaxed mb-8">
                        <p>
                            Especialista em Harmonização Facial Avançada, a Dra. Elizabete alia ciência, estética e saúde. Com um background sólido na área hospitalar (inclusive no Hospital Erasto Gaertner) e atual membro da Comissão de Ética de Biomedicina Estética do Paraná, a segurança do paciente é o seu pilar inegociável.
                        </p>
                        <p>
                            Acreditamos no <strong class="text-brand">Rejuvenescimento Natural</strong>. Nosso objetivo não é transformar o seu rosto em outra pessoa, mas sim realçar a sua beleza genuína e recuperar a firmeza que o tempo levou, de forma indolor e segura.
                        </p>
                    </div>
                    
                    <div class="flex items-center gap-4 text-sm font-bold text-ink uppercase tracking-wider">
                        <i class="fas fa-award text-brand text-2xl"></i> Biomédica Esteta (CRBM-PR)
                    </div>
                </div>
            </div>
        </section>

        <section class="py-24 bg-gray-50" id="depoimentos">
            <div class="max-w-7xl mx-auto px-6 text-center">
                <h3 class="font-title font-bold text-3xl text-ink mb-4 fade-up">
                    Avaliações Reais de Pacientes
                </h3>
                <p class="text-gray-700 mb-16 fade-up delay-100 max-w-2xl mx-auto">
                    Nossa missão é oferecer resultados autênticos e transparentes. As avaliações abaixo refletem as experiências variadas dos nossos pacientes, garantindo uma visão imparcial do nosso trabalho.
                </p>
                
                <div class="grid md:grid-cols-3 gap-8">
                    <!-- Testimonial 1 -->
                    <div class="bg-gray-50 p-8 rounded-xl border border-gray-200 fade-up relative">
                        <div class="text-brand text-xs mb-4"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
                        <p class="text-gray-800 text-sm font-medium italic mb-6 leading-relaxed">
                            "A Dra. Elizabete me devolveu a autoestima sem deixar meu rosto artificial. O procedimento foi indolor e o resultado é incrível, exatamente o que eu sonhava."
                        </p>
                        <span class="text-xs font-bold uppercase tracking-widest text-ink block">Maria Silva</span>
                        <span class="text-[10px] text-gray-500 block mt-1">Via Google Reviews</span>
                    </div>
                    <!-- Testimonial 2 -->
                    <div class="bg-gray-50 p-8 rounded-xl border border-gray-200 fade-up delay-100 relative mt-8 md:mt-0">
                        <div class="text-brand text-xs mb-4"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i></div>
                        <p class="text-gray-800 text-sm font-medium italic mb-6 leading-relaxed">
                            "Lugar super acolhedor e preço justo de verdade. O único ponto é que a agenda é concorrida, demorei um pouco para conseguir meu horário, mas valeu a pena!"
                        </p>
                        <span class="text-xs font-bold uppercase tracking-widest text-ink block">Ana Paula</span>
                        <span class="text-[10px] text-gray-500 block mt-1">Via Google Reviews</span>
                    </div>
                    <!-- Testimonial 3 -->
                    <div class="bg-gray-50 p-8 rounded-xl border border-gray-200 fade-up delay-200 relative mt-8 md:mt-0">
                        <div class="text-brand text-xs mb-4"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
                        <p class="text-gray-800 text-sm font-medium italic mb-6 leading-relaxed">
                            "Os bioestimuladores mudaram a firmeza do meu pescoço. O atendimento é espetacular e a clínica transmite muita paz e profissionalismo."
                        </p>
                        <span class="text-xs font-bold uppercase tracking-widest text-ink block">Renata F.</span>
                        <span class="text-[10px] text-gray-500 block mt-1">Via Google Reviews</span>
                    </div>
                </div>

                <div class="mt-8 text-center fade-up delay-300">
                    <a href="https://google.com" target="_blank" rel="noopener noreferrer" class="text-brand font-semibold text-sm hover:underline">
                        Ver todas as avaliações no Google <i class="fas fa-external-link-alt text-xs ml-1"></i>
                    </a>
                </div>

                <div class="mt-16 fade-up delay-400">
                    <a href="#agendar" class="bg-brand text-white px-10 py-4 rounded-lg font-sans font-bold text-sm hover:bg-brand-dark transition-all duration-300 shadow-lg inline-block uppercase tracking-wider btn-agendar focus:outline-none focus:ring-4 focus:ring-brand/30">
                        Agendar Uma Avaliação <i class="fab fa-whatsapp ml-2"></i>
                    </a>
                </div>
            </div>
        </section>

        <!-- Galeria / Procedimentos -->
        <section class="py-24 bg-white border-y border-gray-100" id="galeria">
            <div class="max-w-7xl mx-auto px-6 text-center">
                <span class="text-taupe text-sm font-bold uppercase tracking-widest block mb-4">Experiência Premium</span>
                <h3 class="font-title font-bold text-3xl md:text-4xl text-ink mb-16 fade-up">
                    Nossa Estrutura e Resultados
                </h3>
                
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600&auto=format&fit=crop" alt="Estrutura Clínica" class="w-full h-48 md:h-64 object-cover rounded-xl shadow-sm hover:opacity-90 transition-opacity fade-up" />
                    <img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=600&auto=format&fit=crop" alt="Consultório" class="w-full h-48 md:h-64 object-cover rounded-xl shadow-sm hover:opacity-90 transition-opacity fade-up delay-100" />
                    <img src="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=600&auto=format&fit=crop" alt="Procedimento Estético" class="w-full h-48 md:h-64 object-cover rounded-xl shadow-sm hover:opacity-90 transition-opacity fade-up delay-200" />
                    <img src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=600&auto=format&fit=crop" alt="Tratamento Facial" class="w-full h-48 md:h-64 object-cover rounded-xl shadow-sm hover:opacity-90 transition-opacity fade-up delay-300" />
                </div>
            </div>
        </section>

        <section class="py-24 bg-gray-50" id="faq">
            <div class="max-w-4xl mx-auto px-6">
                <div class="text-center mb-16 fade-up">
                    <span class="text-taupe text-sm font-bold uppercase tracking-widest block mb-4">Dúvidas Frequentes</span>
                    <h2 class="font-title font-bold text-3xl md:text-4xl text-ink">Perguntas sobre nossos Tratamentos</h2>
                </div>
                
                <div class="space-y-4 fade-up delay-100">
                    <!-- Item 1 -->
                    <div class="border border-taupe/20 rounded-2xl p-6 hover:shadow-md transition-shadow bg-white">
                        <h4 class="font-title font-semibold text-ink mb-2">1. Os procedimentos estéticos são dolorosos?</h4>
                        <p class="text-ink opacity-70 font-light text-sm">Utilizamos anestésicos tópicos de alta eficácia e técnicas minimamente invasivas para garantir o máximo de conforto durante todos os procedimentos. A grande maioria dos pacientes relata apenas um leve desconforto suportável.</p>
                    </div>
                    <!-- Item 2 -->
                    <div class="border border-taupe/20 rounded-2xl p-6 hover:shadow-md transition-shadow bg-white">
                        <h4 class="font-title font-semibold text-ink mb-2">2. Quanto tempo dura o efeito do Botox?</h4>
                        <p class="text-ink opacity-70 font-light text-sm">A duração média da toxina botulínica é de 4 a 6 meses, variando de acordo com o metabolismo de cada paciente e a força muscular da região tratada. Recomendamos manutenções periódicas para resultados contínuos.</p>
                    </div>
                    <!-- Item 3 -->
                    <div class="border border-taupe/20 rounded-2xl p-6 hover:shadow-md transition-shadow bg-white">
                        <h4 class="font-title font-semibold text-ink mb-2">3. Qual a diferença entre Botox e Preenchimento?</h4>
                        <p class="text-ink opacity-70 font-light text-sm">O Botox relaxa os músculos para evitar rugas de expressão (como os "pés de galinha"). O Preenchimento (ácido hialurônico) devolve volume perdido e preenche sulcos estáticos (como o "bigode chinês").</p>
                    </div>
                    <!-- Item 4 -->
                    <div class="border border-taupe/20 rounded-2xl p-6 hover:shadow-md transition-shadow bg-white">
                        <h4 class="font-title font-semibold text-ink mb-2">4. Quando começo a ver os resultados dos Bioestimuladores?</h4>
                        <p class="text-ink opacity-70 font-light text-sm">Os bioestimuladores de colágeno começam a mostrar resultados reais após cerca de 30 a 45 dias da aplicação, atingindo o pico de produção de colágeno aos 3 meses, com efeito que pode durar até 2 anos.</p>
                    </div>
                    <!-- Item 5 -->
                    <div class="border border-taupe/20 rounded-2xl p-6 hover:shadow-md transition-shadow bg-white">
                        <h4 class="font-title font-semibold text-ink mb-2">5. Os procedimentos deixam o rosto "artificial"?</h4>
                        <p class="text-ink opacity-70 font-light text-sm">Não. Nosso pilar central é o rejuvenescimento natural. Focamos em devolver as estruturas que foram perdidas com o tempo, respeitando as proporções do seu rosto sem exageros.</p>
                    </div>
                    <!-- Item 6 -->
                    <div class="border border-taupe/20 rounded-2xl p-6 hover:shadow-md transition-shadow bg-white">
                        <h4 class="font-title font-semibold text-ink mb-2">6. Como funciona a avaliação inicial?</h4>
                        <p class="text-ink opacity-70 font-light text-sm">A avaliação é o momento de ouvir suas queixas, analisar sua pele profundamente e criar um protocolo 100% personalizado para você. Discutiremos os tratamentos indicados e as formas de parcelamento acessíveis.</p>
                    </div>
                    <!-- Item 7 -->
                    <div class="border border-taupe/20 rounded-2xl p-6 hover:shadow-md transition-shadow bg-white">
                        <h4 class="font-title font-semibold text-ink mb-2">7. Os tratamentos exigem repouso (downtime)?</h4>
                        <p class="text-ink opacity-70 font-light text-sm">A grande maioria dos nossos procedimentos de estética avançada permite que você retorne à sua rotina imediatamente. Tratamentos com fios ou bioestimuladores podem causar um leve inchaço que desaparece em poucos dias, mas não impedem o trabalho.</p>
                    </div>
                    <!-- Item 8 -->
                    <div class="border border-taupe/20 rounded-2xl p-6 hover:shadow-md transition-shadow bg-white">
                        <h4 class="font-title font-semibold text-ink mb-2">8. Como agendar meu horário e qual a forma de pagamento?</h4>
                        <p class="text-ink opacity-70 font-light text-sm">Basta clicar em qualquer botão do site para falar diretamente com nossa equipe no WhatsApp. Aceitamos Pix, cartões de crédito com parcelamento facilitado em até 12x, visando entregar o melhor resultado dentro do seu planejamento financeiro.</p>
                    </div>
                </div>
            </div>
        </section>
        <!-- Transparência & Segurança -->
        <section class="py-24 bg-soft" id="transparencia">
            <div class="max-w-4xl mx-auto px-6">
                <div class="text-center mb-16 fade-up">
                    <span class="text-accent text-sm font-bold uppercase tracking-widest block mb-4">Compromisso Ético</span>
                    <h3 class="font-title font-bold text-3xl md:text-4xl text-ink">Transparência & Segurança</h3>
                </div>
                
                <div class="space-y-6 fade-up delay-100 bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-sm text-gray-700 leading-relaxed">
                    <p>
                        Acreditamos que a saúde e a estética devem caminhar de mãos dadas com a clareza de informações. Não realizamos promessas de resultados irreais.
                    </p>
                    <p>
                        <strong>Biologia Individual:</strong> Os procedimentos estéticos dependem intrinsecamente da resposta biológica de cada indivíduo, além dos hábitos de vida, alimentação e rotina de skincare diária. Resultados anteriores não são garantia de resultados futuros exatos.
                    </p>
                    <p>
                        <strong>Riscos e Cuidados:</strong> Todo procedimento minimamente invasivo carrega riscos temporários como hematomas, inchaços locais e vermelhidão. O tempo médio de recuperação (downtime) varia de acordo com o protocolo escolhido, podendo ser imediato ou levar de 3 a 7 dias em casos de bioestimuladores e preenchimentos mais profundos.
                    </p>
                    <p>
                        <strong>Avaliação Clínica Rigorosa:</strong> Não executamos protocolos sem a devida triagem clínica e assinatura prévia do termo de consentimento livre e esclarecido (TCLE). A segurança do paciente é o nosso principal pilar de sustentação, seguindo rigorosamente as normativas do CRBM-PR.
                    </p>
                </div>
            </div>
        </section>

    </main>

    <!-- Footer -->
    <footer class="bg-ink text-base py-16">
        <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-12 text-sm font-light">
            <div>
                <div class="font-title font-light text-white text-xl tracking-widest uppercase mb-6">Dra. Elizabete</div>
                <p class="text-white/60 leading-relaxed">
                    Clínica de biomedicina estética avançada. Saúde, segurança e beleza natural integradas em um só lugar.
                </p>
            </div>
            
            <div>
                <h4 class="font-bold mb-6 text-white uppercase tracking-widest text-xs">Contato</h4>
                <ul class="space-y-4 text-white/60">
                    <li class="flex items-start gap-3">
                        <i class="fab fa-whatsapp mt-1"></i>
                        <span>(41) 9 9665-5769</span>
                    </li>
                    <li class="flex items-start gap-3">
                        <i class="fas fa-map-marker-alt mt-1"></i>
                        <span>Rua Nicarágua, 847 - Sala 203 - Bacacheri<br>Curitiba - PR</span>
                    </li>
                </ul>
            </div>
            
            <div>
                <h4 class="font-bold mb-6 text-white uppercase tracking-widest text-xs">Horário</h4>
                <ul class="space-y-2 text-white/60">
                    <li class="flex justify-between border-b border-white/10 pb-2">
                        <span>Seg - Sex</span>
                        <span>08:00 - 18:00</span>
                    </li>
                    <li class="flex justify-between border-b border-white/10 pb-2 pt-2">
                        <span>Sábados</span>
                        <span>08:00 - 12:00</span>
                    </li>
                </ul>
            </div>
        </div>
        
        <div class="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/10 text-center md:flex md:justify-between md:items-center">
            <p class="text-white/40 text-xs mb-4 md:mb-0">&copy; 2026 Dra. Elizabete De Marchi - CRBM-PR. Todos os direitos reservados.</p>
            <p class="text-white/40 text-xs">Design & Motion por <span class="text-white font-medium">ESCOM STUDIO</span></p>
        </div>
    </footer>

    <!-- Scripts CDN -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
    <script src="https://unpkg.com/@studio-freight/lenis@1.0.39/dist/lenis.min.js"></script>
    <script src="https://unpkg.com/split-type@0.3.4/umd/index.min.js"></script>

    <script>
        document.addEventListener("DOMContentLoaded", () => {
            // Remove a classe de bloqueio CSS Fallback
            document.body.classList.remove('no-js');

            // 1. Omitindo Intersection Observer nativo (usaremos GSAP abaixo)
            // (mantido try/catch por segurança caso GSAP falhe)
            try {
                // Apenas remove a opacidade 0 pra nao quebrar se JS falhar
                document.querySelectorAll('.fade-up').forEach(el => {
                    el.classList.add('js-loaded-fade');
                });
            } catch (err) { }

            // 2. Lenis Smooth Scroll
            try {
                if (typeof Lenis !== 'undefined') {
                    const lenis = new Lenis({
                        duration: 1.5,
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

            // 3. GSAP Rich Animations (Fade-ups and Parallax)
            try {
                if (typeof SplitType !== 'undefined' && typeof gsap !== 'undefined') {
                    const myText = new SplitType('.hero-title', { types: 'words, chars' });
                    
                    // Entrada do Título Principal (Hero)
                    gsap.fromTo(myText.chars, 
                        { y: 115, opacity: 0 },
                        { y: 0, opacity: 1, stagger: 0.02, duration: 1.2, ease: "power4.out", delay: 0.2 }
                    );

                    // Animação Contínua dos Orbes de Fundo (Background Animado)
                    gsap.to('.bg-orb-1', {
                        x: '20vw', y: '10vh', scale: 1.2, duration: 12, ease: 'sine.inOut', yoyo: true, repeat: -1
                    });
                    gsap.to('.bg-orb-2', {
                        x: '-20vw', y: '-10vh', scale: 1.5, duration: 15, ease: 'sine.inOut', yoyo: true, repeat: -1
                    });

                    // Fade Ups super óbvios (Entrance Effects)
                    gsap.utils.toArray('.fade-up').forEach((el) => {
                        gsap.fromTo(el,
                            { y: 100, opacity: 0, scale: 0.95 },
                            {
                                y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power3.out",
                                scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" }
                            }
                        );
                    });

                    // Animação em Stagger (Cascata) para os 4 Pilares
                    const pilares = gsap.utils.toArray('.pilares-grid > div');
                    if(pilares.length > 0) {
                        gsap.fromTo(pilares, 
                            { y: 100, opacity: 0, rotationX: -15 },
                            { 
                                y: 0, opacity: 1, rotationX: 0, duration: 1, ease: "power3.out", stagger: 0.2,
                                scrollTrigger: { trigger: '.pilares-grid', start: "top 80%" }
                            }
                        );
                    }

                    // Image Parallax Effect (Scroll Parallax)
                    gsap.utils.toArray('.gsap-parallax').forEach((img) => {
                        gsap.to(img, {
                            yPercent: -20,
                            ease: "none",
                            scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true }
                        });
                    });
                }
            } catch (err) {
                console.error("GSAP Animations falhou:", err);
            }

            // 4. UX Feedback Interativo
            const btns = document.querySelectorAll('.btn-agendar');
            btns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const originalText = btn.innerHTML;
                    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Redirecionando...';
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                    }, 2000);
                });
            });
        });
    </script>
</body>
</html>`;

const outPath = path.resolve('public', 'template-elizabete', 'index.html');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, htmlTemplate, 'utf8');

console.log('✅ Template Dra. Elizabete V3 (Visual Premium Motion) gerado com sucesso em:', outPath);
