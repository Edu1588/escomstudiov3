import fs from 'fs';


// ==========================================
// 1. TEMPLATE PREMIUM ORALFIX (PORTUGUÊS)
// ==========================================
const oralfixHtml = `<!DOCTYPE html>
<html class="scroll-smooth" lang="pt-BR">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>Oral Fix Implantes Dentários - Odontologia Referência</title>
    <link href="https://fonts.googleapis.com" rel="preconnect"/>
    <link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        ocean: {
                            50: '#f0f9ff',
                            100: '#e0f2fe',
                            600: '#0ea5e9', // Sky blue
                            700: '#0369a1',
                            900: '#0c4a6e'  // Deep ocean
                        },
                        amber: {
                            500: '#f59e0b'
                        }
                    },
                    fontFamily: {
                        sans: ['Outfit', 'sans-serif'],
                        serif: ['Playfair Display', 'serif'],
                    }
                }
            }
        }
    </script>
    <style>
        .glass-nav {
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(12, 74, 110, 0.08);
        }
        .btn-primary {
            background-color: #0ea5e9;
            color: #ffffff;
            transition: all 0.3s ease;
        }
        .btn-primary:hover {
            background-color: #0c4a6e;
            transform: translateY(-2px);
            box-shadow: 0 10px 20px -10px rgba(14, 165, 233, 0.4);
        }
    </style>
</head>
<body class="bg-slate-50 text-slate-800 font-sans antialiased selection:bg-ocean-600 selection:text-white">

    <!-- Navbar Pílula Flutuante -->
    <nav class="fixed w-full z-50 glass-nav transition-all duration-300" id="navbar">
        <div class="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-ocean-100 rounded-full flex items-center justify-center text-ocean-900 font-bold text-xl">OF</div>
                <div>
                    <h1 class="font-serif font-bold text-ocean-900 leading-tight">Oral Fix Implantes</h1>
                    <p class="text-[10px] text-ocean-600 uppercase tracking-widest font-semibold">Odontologia Digital e Familiar</p>
                </div>
            </div>
            <div class="hidden lg:flex gap-8 text-sm font-medium">
                <a href="#" class="hover:text-ocean-600 transition-colors">Início</a>
                <a href="#about" class="hover:text-ocean-600 transition-colors">Quem Somos</a>
                <a href="#procedures" class="hover:text-ocean-600 transition-colors">Procedimentos</a>
                <a href="#technology" class="hover:text-ocean-600 transition-colors">Tecnologia</a>
                <a href="#team" class="hover:text-ocean-600 transition-colors">Equipe</a>
                <a href="#journey" class="hover:text-ocean-600 transition-colors">Jornada</a>
                <a href="#testimonials" class="hover:text-ocean-600 transition-colors">Depoimentos</a>
            </div>
            <a href="#contato" class="btn-primary font-bold px-8 py-3 rounded-full hidden md:inline-block">Agendar Consulta</a>
        </div>
    </nav>

    <!-- Main Content Area -->
    <main class="flex-grow">
 
    <!-- 1. Hero Section -->
    <header class="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-white flex items-center min-h-[85vh] overflow-hidden">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-ocean-50/40 via-transparent to-transparent pointer-events-none"></div>
        <div class="max-w-7xl mx-auto px-6 relative z-10 w-full">
            <div class="grid md:grid-cols-2 gap-12 items-center">
                <!-- Text Column (Left) -->
                <div>
                    <span class="text-ocean-600 font-bold uppercase tracking-widest text-xs mb-4 block">Odontologia Estética Moderna</span>
                    <h2 class="text-5xl md:text-6xl font-serif font-bold text-ocean-900 leading-tight mb-6">
                        Descubra o poder do seu <span class="text-ocean-600 italic">sorriso natural</span>
                    </h2>
                    <p class="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed">
                        Recupere sua mastigação forte e confiança de forma rápida e segura. Implantes e reabilitações completas planejadas por computador.
                    </p>
                    <a href="#contato" class="btn-primary font-bold px-10 py-4 rounded-full inline-flex items-center gap-3 text-lg shadow-lg shadow-ocean-600/10">
                        Quero agendar minha avaliação <i class="fa-solid fa-arrow-right"></i>
                    </a>
                </div>
                <!-- Image Column (Right) -->
                <div class="relative">
                    <div class="absolute inset-0 bg-ocean-100 rounded-[3rem] transform rotate-3 scale-105 z-0"></div>
                    <img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800&auto=format&fit=crop" class="relative z-10 rounded-[3rem] shadow-2xl object-cover h-[450px] w-full" alt="Consultório Oral Fix">
                </div>
            </div>
        </div>
    </header>

    <!-- 2. Seção Quem Somos (Sobre) -->
    <section id="about" class="py-24 bg-slate-50 border-t border-b border-slate-100">
        <div class="max-w-7xl mx-auto px-6">
            <div class="grid md:grid-cols-2 gap-16 items-center">
                <!-- Imagem do Consultório -->
                <div class="relative">
                    <div class="absolute inset-0 bg-ocean-100 rounded-[2.5rem] transform -rotate-3 scale-102 z-0"></div>
                    <img src="https://images.unsplash.com/photo-1629909615184-74f495363b67?q=80&w=800&auto=format&fit=crop" class="relative z-10 rounded-[2.5rem] shadow-xl object-cover h-[480px] w-full" alt="Equipe Oral Fix">
                </div>
                <!-- Textos -->
                <div>
                    <span class="text-ocean-600 font-bold uppercase tracking-widest text-xs mb-4 block">Sobre a Oral Fix</span>
                    <h2 class="text-4xl font-serif font-bold text-ocean-900 leading-tight mb-6">
                        Uma nova experiência em <span class="text-ocean-600 italic">cuidado odontológico</span>
                    </h2>
                    <p class="text-slate-650 mb-6 leading-relaxed">
                        Fundada sob o princípio de integrar tecnologia digital avançada e acolhimento humano, a Oral Fix Implantes redefiniu o padrão de tratamento odontológico. Nosso espaço foi projetado para oferecer o máximo conforto físico e tranquilidade psicológica para toda a família.
                    </p>
                    <p class="text-slate-650 mb-10 leading-relaxed">
                        Esqueça os tratamentos antigos, demorados e desconfortáveis. Com o uso de diagnósticos virtuais tridimensionais, entregamos soluções precisas e definitivas em tempo recorde.
                    </p>
                    <div class="grid grid-cols-2 gap-6">
                        <div class="border-l-2 border-ocean-600 pl-4">
                            <h4 class="font-bold text-ocean-900 text-lg">Tecnologia 3D</h4>
                            <p class="text-xs text-slate-500">Planejamento cirúrgico guiado por computador.</p>
                        </div>
                        <div class="border-l-2 border-ocean-600 pl-4">
                            <h4 class="font-bold text-ocean-900 text-lg">Sem Dor</h4>
                            <p class="text-xs text-slate-500">Protocolo de sedação consciente médica.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- 3. Seção de Procedimentos Especializados (Independente) -->
    <section id="procedures" class="py-24 bg-white">
        <div class="max-w-7xl mx-auto px-6">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-serif font-bold text-ocean-900 mb-4">Tratamentos Especializados</h2>
                <p class="text-slate-500 uppercase tracking-widest font-semibold text-xs">Tecnologia e Cuidado para Seu Sorriso</p>
            </div>
            
            <div class="grid md:grid-cols-3 gap-8">
                <!-- Procedimento 1 -->
                <div class="group rounded-[2.5rem] overflow-hidden relative h-[450px] shadow-lg border border-slate-100 bg-white">
                    <img src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=600&auto=format&fit=crop" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Implantes Dentários">
                    <div class="absolute inset-0 bg-gradient-to-t from-ocean-900 via-ocean-900/40 to-transparent"></div>
                    <div class="absolute bottom-0 left-0 p-8">
                        <h3 class="text-2xl font-serif font-bold text-white mb-2">Implantes Dentários</h3>
                        <p class="text-sm text-ocean-50/90 font-light">Substituição duradoura das raízes dos dentes com pinos de titânio de osseointegração rápida.</p>
                    </div>
                </div>
                <!-- Procedimento 2 -->
                <div class="group rounded-[2.5rem] overflow-hidden relative h-[450px] shadow-lg border border-slate-100 bg-white">
                    <img src="https://images.unsplash.com/photo-1468495244123-6c6c332eeece?q=80&w=600&auto=format&fit=crop" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Carga Imediata">
                    <div class="absolute inset-0 bg-gradient-to-t from-ocean-900 via-ocean-900/40 to-transparent"></div>
                    <div class="absolute bottom-0 left-0 p-8">
                        <h3 class="text-2xl font-serif font-bold text-white mb-2">Carga Imediata</h3>
                        <p class="text-sm text-ocean-50/90 font-light">Possibilidade de fixar dentes provisórios em até 72 horas após a cirurgia de implantes.</p>
                    </div>
                </div>
                <!-- Procedimento 3 -->
                <div class="group rounded-[2.5rem] overflow-hidden relative h-[450px] shadow-lg border border-slate-100 bg-white">
                    <img src="https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=600&auto=format&fit=crop" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Lentes de Porcelana">
                    <div class="absolute inset-0 bg-gradient-to-t from-ocean-900 via-ocean-900/40 to-transparent"></div>
                    <div class="absolute bottom-0 left-0 p-8">
                        <h3 class="text-2xl font-serif font-bold text-white mb-2">Lentes de Porcelana</h3>
                        <p class="text-sm text-ocean-50/90 font-light">Lâminas ultrafinas que corrigem imperfeições de formato, cor e pequenos desalinhamentos.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- 4. Seção Tecnologia & Infraestrutura -->
    <section id="technology" class="py-24 bg-slate-50 border-t border-b border-slate-100">
        <div class="max-w-7xl mx-auto px-6">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-serif font-bold text-ocean-900 mb-4">Infraestrutura Digital Avançada</h2>
                <p class="text-slate-500 uppercase tracking-widest font-semibold text-xs">Precisão, Agilidade e Conforto Clínico</p>
            </div>
            <div class="grid md:grid-cols-3 gap-8">
                <!-- Card 1 -->
                <div class="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-md transition">
                    <div class="w-14 h-14 bg-ocean-100 text-ocean-600 flex items-center justify-center rounded-2xl text-2xl mb-6">
                        <i class="fa-solid fa-camera"></i>
                    </div>
                    <h3 class="font-bold text-ocean-900 text-xl mb-3">Scanners Intraorais 3D</h3>
                    <p class="text-sm text-slate-500 leading-relaxed">Substituímos as moldagens de massa desconfortáveis por um escaneamento digital colorido de alta precisão em segundos.</p>
                </div>
                <!-- Card 2 -->
                <div class="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-md transition">
                    <div class="w-14 h-14 bg-ocean-100 text-ocean-600 flex items-center justify-center rounded-2xl text-2xl mb-6">
                        <i class="fa-solid fa-laptop-medical"></i>
                    </div>
                    <h3 class="font-bold text-ocean-900 text-xl mb-3">Cirurgia Guiada 3D</h3>
                    <p class="text-sm text-slate-500 leading-relaxed">Planejamos a posição exata de cada implante no software 3D antes da cirurgia, sem cortes agressivos ou pontos demorados.</p>
                </div>
                <!-- Card 3 -->
                <div class="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-md transition">
                    <div class="w-14 h-14 bg-ocean-100 text-ocean-600 flex items-center justify-center rounded-2xl text-2xl mb-6">
                        <i class="fa-solid fa-shield-halved"></i>
                    </div>
                    <h3 class="font-bold text-ocean-900 text-xl mb-3">Sedação Médica Consciente</h3>
                    <p class="text-sm text-slate-500 leading-relaxed">Contamos com médico anestesista para realizar sedação consciente, permitindo que você durma confortavelmente durante todo o procedimento.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 5. Seção Corpo Clínico -->
    <section id="team" class="py-24 bg-white">
        <div class="max-w-7xl mx-auto px-6">
            <div class="grid md:grid-cols-2 gap-16 items-center">
                <!-- Textos -->
                <div>
                    <span class="text-ocean-600 font-bold uppercase tracking-widest text-xs mb-4 block">Corpo Clínico</span>
                    <h2 class="text-4xl font-serif font-bold text-ocean-900 leading-tight mb-6">
                        Liderança científica com <span class="text-ocean-600 italic">foco no paciente</span>
                    </h2>
                    <p class="text-slate-650 mb-6 leading-relaxed">
                        O Dr. Leandro Luka (CRO-SP 88.991) é especialista em cirurgia bucomaxilofacial e implantodontia digital, com mais de 15 anos de atuação acadêmica e clínica. Sob sua liderança, nossa equipe de especialistas realiza procedimentos complexos de reabilitação com maestria e empatia.
                    </p>
                    <ul class="space-y-4 text-sm text-slate-600 mb-8">
                        <li class="flex items-center gap-3"><i class="fa-solid fa-circle-check text-ocean-600"></i> Membro da Sociedade Brasileira de Implantodontia</li>
                        <li class="flex items-center gap-3"><i class="fa-solid fa-circle-check text-ocean-600"></i> Especialista em Reabilitações Orais Complexas</li>
                        <li class="flex items-center gap-3"><i class="fa-solid fa-circle-check text-ocean-600"></i> Certificado em Cirurgia Guiada 3D e Fluxo Digital</li>
                    </ul>
                    <a href="#contato" class="btn-primary font-bold px-8 py-3 rounded-full inline-flex items-center gap-3">Falar com o Dr. Leandro</a>
                </div>
                <!-- Imagem do Profissional -->
                <div class="relative">
                    <div class="absolute inset-0 bg-ocean-100 rounded-[2.5rem] transform rotate-3 scale-102 z-0"></div>
                    <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop" class="relative z-10 rounded-[2.5rem] shadow-xl object-cover h-[480px] w-full" alt="Dr. Leandro Luka">
                </div>
            </div>
        </div>
    </section>

    <!-- 6. Seção Jornada do Cliente -->
    <section id="journey" class="py-24 bg-slate-50 border-t border-b border-slate-100">
        <div class="max-w-7xl mx-auto px-6">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-serif font-bold text-ocean-900 mb-4">Sua Jornada até o Novo Sorriso</h2>
                <p class="text-slate-500 uppercase tracking-widest font-semibold text-xs">Entenda Nosso Processo de Cuidado</p>
            </div>
            <div class="grid md:grid-cols-4 gap-8">
                <!-- Passo 1 -->
                <div class="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm text-center">
                    <div class="w-10 h-10 bg-ocean-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">1</div>
                    <h4 class="font-bold text-ocean-900 mb-2">Avaliação Digital</h4>
                    <p class="text-xs text-slate-500">Escaneamento e fotografias 3D da sua arcada.</p>
                </div>
                <!-- Passo 2 -->
                <div class="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm text-center">
                    <div class="w-10 h-10 bg-ocean-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">2</div>
                    <h4 class="font-bold text-ocean-900 mb-2">Planejamento 3D</h4>
                    <p class="text-xs text-slate-500">Desenhamos a cirurgia e a prótese no computador.</p>
                </div>
                <!-- Passo 3 -->
                <div class="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm text-center">
                    <div class="w-10 h-10 bg-ocean-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">3</div>
                    <h4 class="font-bold text-ocean-900 mb-2">Instalação Guiada</h4>
                    <p class="text-xs text-slate-500">Cirurgia indolor sem cortes tradicionais em minutos.</p>
                </div>
                <!-- Passo 4 -->
                <div class="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm text-center">
                    <div class="w-10 h-10 bg-ocean-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">4</div>
                    <h4 class="font-bold text-ocean-900 mb-2">Novo Sorriso</h4>
                    <p class="text-xs text-slate-500">Dentes fixos e mastigação forte estabelecidos.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 7. Depoimentos -->
    <section class="py-24 bg-white" id="testimonials">
        <div class="max-w-7xl mx-auto px-6">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-serif font-bold text-ocean-900 mb-4">Depoimentos dos Nossos Pacientes</h2>
                <p class="text-slate-500 uppercase tracking-widest font-semibold text-xs">Transformações Reais Registradas</p>
            </div>
            
            <div class="grid md:grid-cols-3 gap-8">
                <div class="bg-slate-50 border border-slate-100 p-10 rounded-[2.5rem] shadow-sm flex flex-col justify-between">
                    <div>
                        <div class="flex text-amber-500 mb-6 text-sm">
                            <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                        </div>
                        <p class="text-slate-755 mb-8 italic leading-relaxed text-sm">"Eu tinha pânico de dentista, mas a cirurgia de implantes com sedação na Oral Fix foi incrível. Dormi e acordei com tudo pronto, sem sentir absolutamente nada!"</p>
                    </div>
                    <div class="flex items-center gap-3">
                        <img src="https://i.pravatar.cc/150?img=32" class="w-10 h-10 rounded-full border border-slate-200" alt="Mariana Silva">
                        <div>
                            <p class="font-bold text-sm text-slate-800">Mariana Silva</p>
                            <p class="text-[10px] text-slate-500">Paciente de Carga Imediata</p>
                        </div>
                    </div>
                </div>
                <div class="bg-slate-50 border border-slate-100 p-10 rounded-[2.5rem] shadow-sm flex flex-col justify-between">
                    <div>
                        <div class="flex text-amber-500 mb-6 text-sm">
                            <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                        </div>
                        <p class="text-slate-755 mb-8 italic leading-relaxed text-sm">"A precisão do scanner 3D e o fato de as coroas serem fresadas na hora me poupou dias de idas e vindas ao consultório. O encaixe ficou perfeito!"</p>
                    </div>
                    <div class="flex items-center gap-3">
                        <img src="https://i.pravatar.cc/150?img=44" class="w-10 h-10 rounded-full border border-slate-200" alt="Carlos Eduardo">
                        <div>
                            <p class="font-bold text-sm text-slate-800">Carlos Eduardo</p>
                            <p class="text-[10px] text-slate-500">Paciente de Implante Unitário</p>
                        </div>
                    </div>
                </div>
                <div class="bg-slate-50 border border-slate-100 p-10 rounded-[2.5rem] shadow-sm flex flex-col justify-between">
                    <div>
                        <div class="flex text-amber-500 mb-6 text-sm">
                            <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                        </div>
                        <p class="text-slate-755 mb-8 italic leading-relaxed text-sm">"Fiz lentes de porcelana na Oral Fix e o resultado superou todas as expectativas. O contorno ficou super natural e agora sorrio sem qualquer vergonha."</p>
                    </div>
                    <div class="flex items-center gap-3">
                        <img src="https://i.pravatar.cc/150?img=47" class="w-10 h-10 rounded-full border border-slate-200" alt="Bárbara Santos">
                        <div>
                            <p class="font-bold text-sm text-slate-800">Bárbara Santos</p>
                            <p class="text-[10px] text-slate-500">Paciente de Lentes Estéticas</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    </main>

    <!-- Rodapé Premium Original do Cliente -->
    <footer class="bg-slate-950 text-slate-400 py-16 border-t border-ocean-900/20">
        <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-12 text-sm">
            <div>
                <div class="flex items-center gap-3 mb-6">
                    <div class="w-10 h-10 bg-ocean-600 rounded-full flex items-center justify-center text-white font-bold text-xl">OF</div>
                    <span class="font-bold text-lg text-white tracking-tight">Oral Fix</span>
                </div>
                <p class="text-xs leading-relaxed text-slate-500">
                    Clínica odontológica referência no ABC dedicada a implantes dentários, reabilitação estética e tecnologia cirúrgica guiada.
                </p>
            </div>
            <div>
                <h4 class="text-white font-bold mb-6 uppercase tracking-wider text-xs">Links Rápidos</h4>
                <ul class="space-y-3 text-xs">
                    <li><a href="#" class="hover:text-ocean-600 transition-colors">Início</a></li>
                    <li><a href="#about" class="hover:text-ocean-600 transition-colors">Quem Somos</a></li>
                    <li><a href="#procedures" class="hover:text-ocean-600 transition-colors">Procedimentos</a></li>
                    <li><a href="#testimonials" class="hover:text-ocean-600 transition-colors">Depoimentos</a></li>
                </ul>
            </div>
            <div>
                <h4 class="text-white font-bold mb-6 uppercase tracking-wider text-xs">Conformidade</h4>
                <ul class="space-y-3 text-xs">
                    <li><a href="#" class="hover:text-ocean-600 transition-colors">Política de Privacidade</a></li>
                    <li><a href="#" class="hover:text-ocean-600 transition-colors">Termos de Uso</a></li>
                </ul>
            </div>
            <div>
                <h4 class="text-white font-bold mb-6 uppercase tracking-wider text-xs">Dados Clínicos</h4>
                <div class="text-xs text-slate-500 space-y-2">
                    <p><strong class="text-slate-300">Diretoria Clínica:</strong><br> Dr. Leandro Luka<br>CRO-SP 88.991</p>
                    <p><strong class="text-slate-300">Clínica:</strong><br> Oral Fix Implantes Ltda.<br>CRO-SP CL-12.871</p>
                </div>
            </div>
        </div>
        <div class="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-900 text-center text-xs flex flex-col md:flex-row justify-between items-center text-slate-650">
            <p>&copy; 2026 Oral Fix Implantes. Todos os direitos reservados.</p>
            <p class="mt-2 md:mt-0">Design & Engenharia de Conversão por <a href="#" class="text-slate-450 font-bold hover:text-white transition">ESCOM STUDIO</a></p>
        </div>
    </footer>
</body>
</html>`;

// ==========================================
// 2. TEMPLATE PREMIUM CHIROANDMOVEMENT (INGLÊS)
// ==========================================
const chiroHtml = `<!DOCTYPE html>
<html class="scroll-smooth" lang="en">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>Chiropractic & Movement Studio - Sports Rehab & Pain Relief</title>
    <link href="https://fonts.googleapis.com" rel="preconnect"/>
    <link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        emerald: {
                            50: '#f0fdf4',
                            100: '#dcfce7',
                            500: '#10b981', // Emerald green
                            800: '#065f46',
                            900: '#064e3b'  // Deep emerald
                        },
                        slate: {
                            925: '#0a1417',
                            950: '#050c0f'  // Deep dark metallic bg
                        },
                        amber: {
                            500: '#f59e0b'
                        }
                    },
                    fontFamily: {
                        sans: ['Outfit', 'sans-serif'],
                        serif: ['Playfair Display', 'serif'],
                    }
                }
            }
        }
    </script>
    <style>
        .glass-nav {
            background: rgba(5, 12, 15, 0.85);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(16, 185, 129, 0.08);
        }
        .btn-primary {
            background-color: #10b981;
            color: #ffffff;
            transition: all 0.3s ease;
        }
        .btn-primary:hover {
            background-color: #065f46;
            transform: translateY(-2px);
            box-shadow: 0 10px 20px -10px rgba(16, 185, 129, 0.4);
        }
    </style>
</head>
<body class="bg-slate-950 text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-white">

    <!-- Navbar Pílula Flutuante -->
    <nav class="fixed w-full z-50 glass-nav transition-all duration-300" id="navbar">
        <div class="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-emerald-900/35 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 font-bold text-xl">CM</div>
                <div>
                    <h1 class="font-serif font-bold text-white leading-tight">Chiropractic & Movement</h1>
                    <p class="text-[10px] text-emerald-500 uppercase tracking-widest font-semibold">High-Performance Wellness</p>
                </div>
            </div>
            <div class="hidden md:flex gap-8 text-sm font-medium">
                <a href="#" class="hover:text-emerald-500 transition-colors">Home</a>
                <a href="#about" class="hover:text-emerald-500 transition-colors">About Us</a>
                <a href="#procedures" class="hover:text-emerald-500 transition-colors">Procedures</a>
                <a href="#testimonials" class="hover:text-emerald-500 transition-colors">Testimonials</a>
                <a href="#faq" class="hover:text-emerald-500 transition-colors">FAQ</a>
            </div>
            <a href="#contato" class="btn-primary font-bold px-8 py-3 rounded-full hidden md:inline-block">Book Evaluation</a>
        </div>
    </nav>

    <!-- Main Content Area -->
    <main class="flex-grow">

    <!-- 1. Hero Section -->
    <header class="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-slate-950 flex items-center min-h-[85vh] overflow-hidden">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-900/10 via-transparent to-transparent pointer-events-none"></div>
        <div class="max-w-7xl mx-auto px-6 relative z-10 w-full">
            <div class="grid md:grid-cols-2 gap-12 items-center">
                <!-- Text Column (Left) -->
                <div>
                    <span class="text-emerald-500 font-bold uppercase tracking-widest text-xs mb-4 block">Sports Chiropractic & Pain Recovery</span>
                    <h2 class="text-5xl md:text-6xl font-serif font-bold text-white leading-tight mb-6">
                        Discover the power of your <span class="text-emerald-500 italic">natural movement</span>
                    </h2>
                    <p class="text-lg text-slate-350 mb-10 max-w-lg leading-relaxed">
                        Reveal your best physical version with custom care, joint adjustments, and myofascial recovery. Accelerate recovery and achieve pain-free health.
                    </p>
                    <a href="#contato" class="btn-primary font-bold px-10 py-4 rounded-full inline-flex items-center gap-3 text-lg shadow-lg shadow-emerald-500/10">
                        Book Your Evaluation <i class="fa-solid fa-arrow-right"></i>
                    </a>
                </div>
                <!-- Image Column (Right) -->
                <div class="relative">
                    <div class="absolute inset-0 bg-emerald-900/20 rounded-[3rem] transform rotate-3 scale-105 z-0 border border-emerald-500/10"></div>
                    <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200&auto=format&fit=crop" alt="Sports Rehab Clinic" class="relative z-10 rounded-[3rem] shadow-2xl object-cover h-[550px] w-full">
                    <div class="absolute -bottom-8 -left-8 bg-slate-925 p-6 rounded-2xl shadow-xl z-20 border border-slate-800">
                        <p class="font-serif font-bold text-2xl text-emerald-500 mb-1">+5,000</p>
                        <p class="text-xs text-slate-400 uppercase tracking-widest font-semibold">Active Lives Recovered</p>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- 2. Diferenciais / Benefícios -->
    <section class="relative z-20 -mt-16 px-6 mb-24">
        <div class="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-slate-925 border border-slate-800 p-6 rounded-3xl shadow-xl hover:-translate-y-2 transition-transform duration-300">
                <div class="w-12 h-12 rounded-full bg-emerald-950/50 text-emerald-500 flex items-center justify-center text-xl mb-4 border border-emerald-500/25">
                    <i class="fa-solid fa-location-dot"></i>
                </div>
                <h3 class="font-bold text-white mb-2">Easy Access</h3>
                <p class="text-xs text-slate-450">Convenient Miami area location with dedicated private parking.</p>
            </div>
            <div class="bg-slate-925 border border-slate-800 p-6 rounded-3xl shadow-xl hover:-translate-y-2 transition-transform duration-300">
                <div class="w-12 h-12 rounded-full bg-emerald-950/50 text-emerald-500 flex items-center justify-center text-xl mb-4 border border-emerald-500/25">
                    <i class="fa-solid fa-user-doctor"></i>
                </div>
                <h3 class="font-bold text-white mb-2">Dr. Karen Maley</h3>
                <p class="text-xs text-slate-450">Elite-level provider with years of sports performance background.</p>
            </div>
            <div class="bg-slate-925 border border-slate-800 p-6 rounded-3xl shadow-xl hover:-translate-y-2 transition-transform duration-300">
                <div class="w-12 h-12 rounded-full bg-emerald-950/50 text-emerald-500 flex items-center justify-center text-xl mb-4 border border-emerald-500/25">
                    <i class="fa-solid fa-spa"></i>
                </div>
                <h3 class="font-bold text-white mb-2">Modern Setup</h3>
                <p class="text-xs text-slate-450">A relaxing, recovery-oriented environment built for wellness.</p>
            </div>
            <div class="bg-slate-925 border border-slate-800 p-6 rounded-3xl shadow-xl hover:-translate-y-2 transition-transform duration-300">
                <div class="w-12 h-12 rounded-full bg-emerald-950/50 text-emerald-500 flex items-center justify-center text-xl mb-4 border border-emerald-500/25">
                    <i class="fa-solid fa-certificate"></i>
                </div>
                <h3 class="font-bold text-white mb-2">Expert Adjustments</h3>
                <p class="text-xs text-slate-450">Advanced clinical techniques that target spinal wellness and motion.</p>
            </div>
        </div>
    </section>

    <!-- 3. Nossa História (Quem Somos) -->
    <section class="py-24 bg-slate-950 relative overflow-hidden" id="about">
        <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
            <div class="relative">
                <div class="absolute inset-0 bg-emerald-900/10 rounded-[3rem] transform -rotate-3 scale-105 z-0 border border-emerald-500/10"></div>
                <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop" class="relative z-10 rounded-[3rem] shadow-2xl object-cover h-[500px] w-full" alt="About us">
            </div>
            <div>
                <span class="text-emerald-500 font-bold uppercase tracking-widest text-xs mb-4 block">Clinical Mastery</span>
                <h2 class="text-4xl font-serif font-bold text-white mb-6">
                    Dedicated to restoring and <span class="text-emerald-500 italic">optimizing your motion</span>
                </h2>
                <p class="text-slate-355 leading-relaxed mb-6">
                    Our journey began with a clear purpose: to help individuals escape chronic limitations and recover from athletic fatigue. Led by Dr. Karen Maley, a recognized voice in sports chiropractic, we focus on rebuilding the body's functional foundation.
                </p>
                <p class="text-slate-355 leading-relaxed mb-8">
                    We combine precise spinal alignments, advanced myofascial release, and kinetic screening to deliver rapid, lasting physical recovery. Whether you are a competitive athlete or striving for a pain-free daily lifestyle, we construct a tailor-made roadmap for you.
                </p>
                <div class="grid grid-cols-2 gap-6 border-t border-slate-800 pt-8">
                    <div>
                        <p class="text-3xl font-serif font-bold text-emerald-500 mb-1">+10 Years</p>
                        <p class="text-xs text-slate-400 uppercase tracking-widest font-semibold">clinical dedication</p>
                    </div>
                    <div>
                        <p class="text-3xl font-serif font-bold text-emerald-500 mb-1">100%</p>
                        <p class="text-xs text-slate-400 uppercase tracking-widest font-semibold">custom programming</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- 4. Por que nos escolher -->
    <section class="py-24 bg-slate-925 border-y border-slate-800" id="diferenciais">
        <div class="max-w-7xl mx-auto px-6">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-serif font-bold text-white mb-4">Why Chiropractic & Movement?</h2>
                <p class="text-slate-450 uppercase tracking-widest font-semibold text-xs text-slate-400">The Gold Standard in Sports & Spinal Rehab</p>
            </div>
            <div class="grid md:grid-cols-3 gap-8">
                <div class="bg-slate-950 p-10 rounded-[2.5rem] border border-slate-800 hover:border-emerald-500 transition-colors shadow-sm">
                    <div class="w-16 h-16 bg-emerald-950/30 rounded-full flex items-center justify-center text-emerald-500 text-2xl mb-6 shadow-sm border border-emerald-500/10">
                        <i class="fa-solid fa-gem"></i>
                    </div>
                    <h3 class="text-xl font-serif font-bold text-white mb-3">Elegant Results</h3>
                    <p class="text-slate-400 text-sm leading-relaxed">We focus on biomechanical balance. Our goal is a natural recovery where you recover joint freedom and build systemic endurance.</p>
                </div>
                <div class="bg-slate-950 p-10 rounded-[2.5rem] border border-slate-800 hover:border-emerald-500 transition-colors shadow-sm">
                    <div class="w-16 h-16 bg-emerald-950/30 rounded-full flex items-center justify-center text-emerald-500 text-2xl mb-6 shadow-sm border border-emerald-500/10">
                        <i class="fa-solid fa-heart-pulse"></i>
                    </div>
                    <h3 class="text-xl font-serif font-bold text-white mb-3">Personalized Evaluation</h3>
                    <p class="text-slate-400 text-sm leading-relaxed">You are never treated as a number. We dedicate targeted diagnostic sessions to screen your posture, mobility, and kinetic triggers.</p>
                </div>
                <div class="bg-slate-950 p-10 rounded-[2.5rem] border border-slate-800 hover:border-emerald-500 transition-colors shadow-sm">
                    <div class="w-16 h-16 bg-emerald-950/30 rounded-full flex items-center justify-center text-emerald-500 text-2xl mb-6 shadow-sm border border-emerald-500/10">
                        <i class="fa-solid fa-microscope"></i>
                    </div>
                    <h3 class="text-xl font-serif font-bold text-white mb-3">Advanced Diagnostics</h3>
                    <p class="text-slate-400 text-sm leading-relaxed">We harness advanced movement monitoring tools and clinical safety protocols to ensure dynamic recovery without friction.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 5. Prova Social / Caso de Vídeo -->
    <section class="py-24 bg-slate-950 relative">
        <div class="max-w-7xl mx-auto px-6 text-center">
            <span class="text-slate-500 font-bold uppercase tracking-widest text-xs mb-4 block">Rehab & Motion</span>
            <h2 class="text-4xl font-serif font-bold text-white mb-16">
                How we restore and <br><span class="text-emerald-500 italic">optimize joint movement</span>
            </h2>
            
            <div class="relative max-w-4xl mx-auto rounded-[2rem] overflow-hidden shadow-2xl group cursor-pointer border-8 border-slate-900">
                <img src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=600&auto=format&fit=crop" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Chiro practice image">
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                    <div class="absolute bottom-0 left-0 p-8">
                        <h3 class="text-2xl font-serif font-bold text-white mb-2">Spinal Adjustment</h3>
                        <p class="text-sm text-emerald-50/90 font-light">Targeted manual adjustments designed to improve neural pathways, relieve pressure, and align the spine.</p>
                    </div>
                </div>
                <!-- Procedimento 2 -->
                <div class="group rounded-[2.5rem] overflow-hidden relative h-[450px] shadow-lg border border-slate-800">
                    <img src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=600&auto=format&fit=crop" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Chiro session">
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                    <div class="absolute bottom-0 left-0 p-8">
                        <h3 class="text-2xl font-serif font-bold text-white mb-2">Sports Recovery</h3>
                        <p class="text-sm text-emerald-50/90 font-light">Kinetic soft-tissue therapies designed to relieve lactic buildup, reduce spasms, and speed up tissue healing.</p>
                    </div>
                </div>
                <!-- Procedimento 3 -->
                <div class="group rounded-[2.5rem] overflow-hidden relative h-[450px] shadow-lg border border-slate-800">
                    <img src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=600&auto=format&fit=crop" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Chiro results">
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                    <div class="absolute bottom-0 left-0 p-8">
                        <h3 class="text-2xl font-serif font-bold text-white mb-2">Posture Correction</h3>
                        <p class="text-sm text-emerald-50/90 font-light">Custom rehabilitative exercises aimed at correcting muscle imbalances and maintaining spinal health.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- 7. Depoimentos -->
    <section class="py-24 bg-slate-950" id="testimonials">
        <div class="max-w-7xl mx-auto px-6">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-serif font-bold text-white mb-4">Patient Testimonials</h2>
                <p class="text-slate-455 uppercase tracking-widest font-semibold text-xs font-sans">Reviews From Our Active Community</p>
            </div>
            
            <div class="grid md:grid-cols-3 gap-8">
                <div class="bg-slate-925 border border-slate-800 p-10 rounded-[2.5rem] shadow-sm flex flex-col justify-between">
                    <div>
                        <div class="flex text-amber-500 mb-6 text-sm">
                            <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                        </div>
                        <p class="text-slate-300 mb-8 italic leading-relaxed text-sm">"Dr. Karen Maley has an outstanding sports rehab setup. Her targeted adjustments got me back to pain-free squatting in just three sessions!"</p>
                    </div>
                    <div class="flex items-center gap-3">
                        <img src="https://i.pravatar.cc/150?img=11" class="w-10 h-10 rounded-full border border-slate-800" alt="Marcus Reynolds">
                        <div>
                            <p class="font-bold text-sm text-white">Marcus Reynolds</p>
                            <p class="text-[10px] text-slate-500">CrossFit Athlete</p>
                        </div>
                    </div>
                </div>
                <div class="bg-slate-925 border border-slate-800 p-10 rounded-[2.5rem] shadow-sm flex flex-col justify-between">
                    <div>
                        <div class="flex text-amber-500 mb-6 text-sm">
                            <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                        </div>
                        <p class="text-slate-300 mb-8 italic leading-relaxed text-sm">"My neck strain from desk work has improved massively. The workspace screening and ergonomics guidance she gave made a huge difference."</p>
                    </div>
                    <div class="flex items-center gap-3">
                        <img src="https://i.pravatar.cc/150?img=49" class="w-10 h-10 rounded-full border border-slate-800" alt="Sarah Jenkins">
                        <div>
                            <p class="font-bold text-sm text-white">Sarah Jenkins</p>
                            <p class="text-[10px] text-slate-500">Software Engineer</p>
                        </div>
                    </div>
                </div>
                <div class="bg-slate-925 border border-slate-800 p-10 rounded-[2.5rem] shadow-sm flex flex-col justify-between">
                    <div>
                        <div class="flex text-amber-500 mb-6 text-sm">
                            <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                        </div>
                        <p class="text-slate-300 mb-8 italic leading-relaxed text-sm">"The clinical depth combined with athletic knowledge here is fantastic. Highly professional and recovery-oriented. I recommend them to everyone."</p>
                    </div>
                    <div class="flex items-center gap-3">
                        <img src="https://i.pravatar.cc/150?img=68" class="w-10 h-10 rounded-full border border-slate-800" alt="Johnathan Cruz">
                        <div>
                            <p class="font-bold text-sm text-white">Johnathan Cruz</p>
                            <p class="text-[10px] text-slate-500">Triathlon Competitor</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    </main>

    <!-- Rodapé Premium Original do Cliente -->
    <footer class="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
        <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-12 text-sm">
            <div>
                <div class="flex items-center gap-3 mb-6">
                    <div class="w-10 h-10 bg-emerald-900/40 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 font-bold text-xl">CM</div>
                    <span class="font-bold text-lg text-white tracking-tight">Chiro & Movement</span>
                </div>
                <p class="text-xs leading-relaxed text-slate-500">
                    Community-trusted chiropractic and kinesiology studio focused on sports recovery, spine health, and athletic movement optimization in Miami.
                </p>
            </div>
            <div>
                <h4 class="text-white font-bold mb-6 uppercase tracking-wider text-xs font-sans">Quick Links</h4>
                <ul class="space-y-3 text-xs">
                    <li><a href="#" class="hover:text-emerald-500 transition-colors">Home</a></li>
                    <li><a href="#about" class="hover:text-emerald-500 transition-colors">About Us</a></li>
                    <li><a href="#procedures" class="hover:text-emerald-500 transition-colors">Procedures</a></li>
                    <li><a href="#testimonials" class="hover:text-emerald-500 transition-colors">Testimonials</a></li>
                </ul>
            </div>
            <div>
                <h4 class="text-white font-bold mb-6 uppercase tracking-wider text-xs font-sans">Compliance</h4>
                <ul class="space-y-3 text-xs">
                    <li><a href="#" class="hover:text-emerald-500 transition-colors">Privacy Policy</a></li>
                    <li><a href="#" class="hover:text-emerald-500 transition-colors">Terms of Use</a></li>
                </ul>
            </div>
            <div>
                <h4 class="text-white font-bold mb-6 uppercase tracking-wider text-xs font-sans">Location</h4>
                <div class="text-xs text-slate-500 space-y-2">
                    <p><strong class="text-slate-350">Miami Studio:</strong><br> Modern Wellness Area<br>Miami - Florida (USA)</p>
                    <p class="italic text-[10px] text-slate-600">* Professional chiropractic care. Initial diagnostic checks are mandatory.</p>
                </div>
            </div>
        </div>
        <div class="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-900 text-center text-xs flex flex-col md:flex-row justify-between items-center text-slate-600 font-sans">
            <p>&copy; 2026 Chiropractic & Movement. All rights reserved.</p>
            <p class="mt-2 md:mt-0">Design & Conversion by <a href="#" class="text-slate-400 font-bold hover:text-white transition">ESCOM STUDIO</a></p>
        </div>
    </footer>
</body>
</html>`;

// Salvar os templates estáticos do OralFix e Chiropractic no disco físico
fs.writeFileSync('public/template-oralfix/index.html', oralfixHtml, 'utf8');
fs.writeFileSync('public/template-chiroandmovement/index.html', chiroHtml, 'utf8');
console.log("-> Templates premium OralFix e Chiropractic & Movement gravados no disco local.");

// ==========================================
// 3. TEMPLATE PREMIUM ELIZABETE (MANTIDO)
// ==========================================

import { execSync } from 'child_process';
execSync('node build_elizabete_v3.mjs', {stdio: 'inherit'});


console.log("Arquivos estáticos base gravados com sucesso (OralFix, Chiro, Elizabete).");

// Rodar o patch comercial e scripts adjacentes
execSync('node scratch_patch_all_commercial_sections.js', { stdio: 'inherit' });
