import fs from 'fs';

function generatePillLayout(config) {
    const isEn = config.isEn;
    const { bg, text, cardBg, cardBorder, primary, title, heroImg, aboutImg, logo, benefits, proc1, proc2, proc3 } = config;

    return `<!DOCTYPE html>
<html class="scroll-smooth" lang="${isEn ? 'en' : 'pt-BR'}">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>${title}</title>
    <link href="https://fonts.googleapis.com" rel="preconnect"/>
    <link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        brand: {
                            DEFAULT: '${primary}',
                            hover: '${primary}dd'
                        },
                        base: {
                            bg: '${bg}',
                            text: '${text}',
                            card: '${cardBg}',
                            border: '${cardBorder}'
                        }
                    },
                    fontFamily: {
                        sans: ['Outfit', 'sans-serif'],
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-base-bg text-base-text font-sans antialiased">

    <!-- Navbar Pílula Flutuante -->
    <nav class="fixed w-full z-50 top-6 px-6" id="navbar">
        <div class="max-w-5xl mx-auto bg-base-card/90 backdrop-blur-md border border-base-border rounded-full h-20 flex items-center justify-between px-8 shadow-2xl">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-brand rounded-full flex items-center justify-center text-white font-bold text-xl">${logo}</div>
                <span class="font-bold text-lg tracking-tight">${title.split(' ')[0]}</span>
            </div>
            <div class="hidden md:flex gap-8 text-sm font-medium">
                <a href="#" class="hover:text-brand transition-colors">${isEn ? 'Home' : 'Início'}</a>
                <a href="#about" class="hover:text-brand transition-colors">${isEn ? 'About Us' : 'Quem Somos'}</a>
                <a href="#procedures" class="hover:text-brand transition-colors">${isEn ? 'Procedures' : 'Procedimentos'}</a>
                <a href="#testimonials" class="hover:text-brand transition-colors">${isEn ? 'Testimonials' : 'Depoimentos'}</a>
            </div>
            <a href="#contato" class="bg-brand text-white px-6 py-2.5 rounded-full font-bold text-sm hover:opacity-90 transition-opacity">
                ${isEn ? 'Contact Us' : 'Entre em contato'}
            </a>
        </div>
    </nav>

    <!-- 1. Hero Full-width -->
    <header class="relative pt-40 pb-48 md:pt-56 md:pb-64 overflow-hidden">
        <div class="absolute inset-0">
            <img src="${heroImg}" class="w-full h-full object-cover" alt="Hero">
            <div class="absolute inset-0 bg-gradient-to-r from-base-bg via-base-bg/80 to-transparent"></div>
        </div>
        <div class="max-w-6xl mx-auto px-6 relative z-10">
            <div class="max-w-xl">
                <h1 class="text-5xl md:text-6xl font-bold leading-tight mb-6">
                    ${isEn ? 'Discover the power of your <span class="text-brand">natural movement</span>' : 'Descubra o poder do seu <span class="text-brand">sorriso natural</span>'}
                </h1>
                <p class="text-lg opacity-80 mb-10 leading-relaxed">
                    ${isEn ? 'Reveal your best version with our exclusive treatments, tailor-made to realize your full potential. Every session combines pain relief, firmness, and confidence.' : 'Revele a sua melhor versão com nossos tratamentos exclusivos, feitos sob medida para realçar a sua estética. Cada tratamento combina saúde, estética e confiança.'}
                </p>
                <a href="#contato" class="bg-brand text-white px-8 py-4 rounded-full font-bold text-lg hover:opacity-90 transition-opacity inline-flex items-center gap-3">
                    ${isEn ? 'Schedule Evaluation' : 'Agendar uma avaliação'} <i class="fa-solid fa-arrow-right"></i>
                </a>
            </div>
        </div>
    </header>

    <!-- 2. Benefícios: Cards Flutuantes -->
    <section class="relative z-20 -mt-24 px-6 mb-24">
        <div class="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            " + benefits.map(b => '<div class="bg-base-card border border-base-border p-6 rounded-3xl shadow-xl hover:-translate-y-2 transition-transform duration-300"><div class="w-12 h-12 rounded-full bg-brand/10 text-brand flex items-center justify-center text-xl mb-4 border border-brand/20"><i class="' + b.icon + '"></i></div><h3 class="font-bold mb-2">' + b.title + '</h3><p class="text-xs opacity-70">' + b.desc + '</p></div>').join('') + "
        </div>
    </section>

    <!-- 3. Quem Somos -->
    <section class="py-24" id="about">
        <div class="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
            <div>
                <h2 class="text-4xl font-bold mb-6">" + (isEn ? 'Who are we?' : 'Quem somos?') + "</h2>
                <p class="opacity-80 leading-relaxed mb-6">
                    " + (isEn ? 'With years of experience, we dedicate our lives to enhancing the health and well-being of our clients. Trained in advanced techniques, we frequently attend courses to offer the most modern and effective treatments.' : 'Com anos de experiência, dedicamos nossa vida a realizar a saúde e o bem-estar de nossos pacientes. Treinados em técnicas avançadas, frequentamos regularmente cursos para oferecer os tratamentos mais modernos e eficazes.') + "
                </p>
                <p class="opacity-80 leading-relaxed mb-10">
                    " + (isEn ? 'Our commitment is to provide exceptional results through personalized procedures, always with a touch of care and attention to detail.' : 'Nosso compromisso é proporcionar resultados excepcionais através de procedimentos personalizados, sempre com um toque de cuidado e atenção aos detalhes.') + "
                </p>
                <a href=\"#contato\" class=\"border border-brand text-brand hover:bg-brand hover:text-white px-8 py-3 rounded-full font-bold transition-colors inline-block\">
                    " + (isEn ? 'Meet the Team' : 'Conheça a Equipe') + "
                </a>
            </div>
            <div class=\"relative\">
                <img src=\"" + aboutImg + "\" alt=\"About\" class=\"rounded-[2rem] w-full h-[500px] object-cover border border-base-border shadow-2xl relative z-10\">
                <div class=\"absolute -bottom-6 -right-6 w-full h-full border-2 border-brand rounded-[2rem] z-0\"></div>
            </div>
        </div>
    </section>

    <!-- 4. Procedimentos (Prova Social) -->
    <section class=\"py-24 bg-base-card border-y border-base-border\" id=\"procedures\">
        <div class=\"max-w-6xl mx-auto px-6\">
            <div class=\"text-center mb-16\">
                <h2 class=\"text-4xl font-bold mb-4\">" + (isEn ? 'Our Procedures' : 'Nossos Procedimentos') + "</h2>
                <p class=\"opacity-80\">" + (isEn ? 'We will create an exclusive treatment protocol, specially customized for you.' : 'Vamos criar um protocolo de tratamento exclusivo, personalizado especialmente para você.') + "</p>
            </div>
            
            <div class=\"grid md:grid-cols-3 gap-6\">
                " + [proc1, proc2, proc3].map(p => '<div class="group rounded-[2rem] overflow-hidden relative h-[400px]"><img src="' + p.img + '" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"><div class="absolute inset-0 bg-gradient-to-t from-base-bg via-base-bg/60 to-transparent"></div><div class="absolute bottom-0 left-0 p-8"><h3 class="text-2xl font-bold mb-2">' + p.title + '</h3><p class="text-sm opacity-90">' + p.desc + '</p></div></div>').join('') + "
            </div>
        </div>
    </section>

    <!-- 5. Depoimentos -->
    <section class=\"py-24\" id=\"testimonials\">
        <div class=\"max-w-6xl mx-auto px-6\">
            <div class=\"text-center mb-16\">
                <h2 class=\"text-4xl font-bold mb-4\">" + (isEn ? 'Testimonials' : 'Depoimentos') + "</h2>
                <p class=\"opacity-80\">" + (isEn ? 'Schedule now and experience the excellence of our treatments.' : 'Agende agora mesmo e comprove a excelência de todos os nossos tratamentos.') + "</p>
            </div>
            
            <div class="grid md:grid-cols-3 gap-6">
                <!-- Testimonial 1 -->
                <div class="bg-base-card border border-base-border p-8 rounded-3xl">
                    <div class="flex text-brand mb-4 text-sm"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></div>
                    <p class="opacity-90 mb-8 text-sm italic">"${isEn ? 'The professional is amazing! She conveys a lot of confidence in all explanations, besides having a very light hand! I will definitely come back.' : 'Profissional completa! Passa muita confiança em todas as explicações, além de ter uma mão levíssima! Voltarei sempre.'}"</p>
                    <div class="flex items-center gap-3">
                        <img src="https://i.pravatar.cc/150?img=32" class="w-10 h-10 rounded-full">
                        <span class="font-bold text-sm">Mariana Alves</span>
                    </div>
                </div>
                <!-- Testimonial 2 -->
                <div class="bg-base-card border border-base-border p-8 rounded-3xl">
                    <div class="flex text-brand mb-4 text-sm"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></div>
                    <p class="opacity-90 mb-8 text-sm italic">"${isEn ? 'Understands all our expectations, respecting the nature of our body, exemplary care, I am very happy with the results.' : 'Entende todas as nossas expectativas, respeitando a natureza do nosso corpo, cuidado exemplar, estou muito feliz com os resultados.'}"</p>
                    <div class="flex items-center gap-3">
                        <img src="https://i.pravatar.cc/150?img=44" class="w-10 h-10 rounded-full">
                        <span class="font-bold text-sm">Luiza Santos</span>
                    </div>
                </div>
                <!-- Testimonial 3 -->
                <div class="bg-base-card border border-base-border p-8 rounded-3xl">
                    <div class="flex text-brand mb-4 text-sm"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></div>
                    <p class="opacity-90 mb-8 text-sm italic">"${isEn ? 'I was already a fan of the work shown on Instagram, I stood even more when I made the decision to consult, it was my best choice, changed my life!' : 'Já era fã do trabalho que mostrava no Instagram, fiquei mais ainda quando tomei a decisão de me consultar, foi a minha melhor escolha, mudou minha vida!'}"</p>
                    <div class="flex items-center gap-3">
                        <img src="https://i.pravatar.cc/150?img=5" class="w-10 h-10 rounded-full">
                        <span class="font-bold text-sm">Lucia Maria</span>
                    </div>
                </div>
            </div>
            
            <div class="text-center mt-12">
                <a href="#contato" class="bg-brand text-white px-8 py-4 rounded-full font-bold text-sm hover:opacity-90 transition-opacity inline-block">
                    ${isEn ? 'Schedule Evaluation' : 'Agendar uma avaliação'}
                </a>
            </div>
        </div>
    </section>
</main>
<!-- Patch comercial injetará FAQ, Contato, Dossiê e Proposta -->
</body>
</html>`;
}

// ChiroAndMovement Config (Dark)
const chiroConfig = {
    isEn: true,
    title: 'Miami Chiropractic And Movement',
    logo: 'CM',
    bg: '#050c0f',
    text: '#f1f5f9',
    cardBg: '#0a191e',
    cardBorder: '#1e293b',
    primary: '#0ea5e9', // Brand Blue
    heroImg: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1600&auto=format&fit=crop',
    aboutImg: 'https://images.unsplash.com/photo-1552196563-55259259a545?q=80&w=800&auto=format&fit=crop',
    benefits: [
        { icon: 'fa-solid fa-location-dot', title: 'Location', desc: 'Easy access and private parking.' },
        { icon: 'fa-solid fa-user-doctor', title: 'Qualified Team', desc: 'Highly trained professionals with years of experience.' },
        { icon: 'fa-solid fa-spa', title: 'Welcoming', desc: 'Environment designed for your relaxation.' },
        { icon: 'fa-solid fa-certificate', title: 'Expertise', desc: 'Thousands of successful adjustments performed.' }
    ],
    proc1: { title: 'Spinal Adjustment', desc: 'Precision corrections to align the spine and nervous system.', img: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=600&auto=format&fit=crop' },
    proc2: { title: 'Sports Recovery', desc: 'Advanced therapies for athletes to speed up healing.', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop' },
    proc3: { title: 'Posture Correction', desc: 'Targeted exercises and adjustments for perfect posture.', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop' }
};

// OralFix Config (Light Dentist)
const oralfixConfig = {
    isEn: false,
    title: 'Oral Fix Implantes',
    logo: 'OF',
    bg: '#ffffff',
    text: '#0f172a',
    cardBg: '#f8fafc',
    cardBorder: '#e2e8f0',
    primary: '#2563eb', // Medical Blue
    heroImg: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1600&auto=format&fit=crop',
    aboutImg: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800&auto=format&fit=crop',
    benefits: [
        { icon: 'fa-solid fa-location-dot', title: 'Localização', desc: 'Fácil acesso e estacionamento próprio.' },
        { icon: 'fa-solid fa-tooth', title: 'Especialistas', desc: 'Equipe focada 100% em implantodontia.' },
        { icon: 'fa-solid fa-microscope', title: 'Tecnologia', desc: 'Raio-X e Scanner 3D na própria clínica.' },
        { icon: 'fa-solid fa-award', title: 'Resultados', desc: 'Mais de 10.000 sorrisos transformados.' }
    ],
    proc1: { title: 'Implantes Dentários', desc: 'Dentes fixos com aparência natural e alta durabilidade.', img: 'https://images.unsplash.com/photo-1598256989800-fea5ce5146f5?q=80&w=600&auto=format&fit=crop' },
    proc2: { title: 'Carga Imediata', desc: 'Sorriso novo em até 72 horas após a cirurgia.', img: 'https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?q=80&w=600&auto=format&fit=crop' },
    proc3: { title: 'Lentes de Porcelana', desc: 'Estética perfeita corrigindo cor e formato.', img: 'https://images.unsplash.com/photo-1606265752439-1f18756aa5fc?q=80&w=600&auto=format&fit=crop' }
};

fs.writeFileSync('public/template-chiroandmovement/index.html', generatePillLayout(chiroConfig), 'utf-8');
fs.writeFileSync('public/template-oralfix/index.html', generatePillLayout(oralfixConfig), 'utf-8');
console.log("Templates Chiro e OralFix gerados com sucesso!");
