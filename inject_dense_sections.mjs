import fs from 'fs/promises';
import path from 'path';

async function injectDenseSections(slug, newSectionsHTML) {
  const indexFile = path.resolve(`./public/${slug}/index.html`);
  
  try {
    const content = await fs.readFile(indexFile, 'utf8');
    
    // We want to inject right before the FAQ section.
    // For Oral Fix: <section id="faq"
    // For Miami Wellness: <section id="faq"
    
    const faqMarker = '<section id="faq"';
    const splitIndex = content.indexOf(faqMarker);
    
    if (splitIndex === -1) {
      throw new Error('FAQ marker not found');
    }
    
    const topPart = content.substring(0, splitIndex);
    const bottomPart = content.substring(splitIndex);
    
    const newContent = topPart + newSectionsHTML + bottomPart;
    
    await fs.writeFile(indexFile, newContent);
    console.log(`Successfully injected dense sections into ${slug}`);
  } catch (err) {
    console.error(`Error processing ${slug}:`, err);
  }
}

async function run() {
  const oralFixDense = `
<!-- TECNOLOGIA & INFRAESTRUTURA -->
<section class="reveal py-24 bg-white border-t border-gray-100">
  <div class="container mx-auto px-6 md:px-12 max-w-7xl">
    <div class="flex flex-col lg:flex-row items-center gap-16">
      <div class="lg:w-1/2">
        <h2 class="font-serif text-4xl text-gray-900 mb-6">Tecnologia Odontológica de Alta Precisão</h2>
        <p class="text-gray-600 text-lg leading-relaxed mb-8">
          A Odontologia moderna exige previsibilidade. Na Oral Fix, abandonamos os moldes desconfortáveis de massa e operamos um fluxo 100% digital, garantindo que a sua prótese ou lente de contato seja desenhada de forma milimétrica.
        </p>
        <div class="space-y-6">
          <div class="flex gap-4">
            <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 text-primary text-xl">
              <i class="fa-solid fa-microchip"></i>
            </div>
            <div>
              <h4 class="font-bold text-gray-900 mb-1">Scanner Intraoral 3D</h4>
              <p class="text-sm text-gray-600">Copiamos a sua arcada dentária em segundos através de um escaneamento digital indolor e altamente preciso.</p>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 text-primary text-xl">
              <i class="fa-solid fa-x-ray"></i>
            </div>
            <div>
              <h4 class="font-bold text-gray-900 mb-1">Tomografia Computadorizada In-House</h4>
              <p class="text-sm text-gray-600">Realizamos exames radiográficos complexos dentro da própria clínica, poupando seu tempo com deslocamentos.</p>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 text-primary text-xl">
              <i class="fa-solid fa-bed-pulse"></i>
            </div>
            <div>
              <h4 class="font-bold text-gray-900 mb-1">Centro Cirúrgico Premium</h4>
              <p class="text-sm text-gray-600">Ambiente rigorosamente esterilizado equipado com sedação consciente para implantes sem nenhuma dor ou ansiedade.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="lg:w-1/2">
        <div class="relative">
          <div class="absolute -inset-4 bg-primary/5 rounded-3xl transform rotate-3"></div>
          <img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800&auto=format&fit=crop" class="relative z-10 rounded-2xl shadow-2xl object-cover h-[500px] w-full" alt="Tecnologia Odontológica 3D" />
        </div>
      </div>
    </div>
  </div>
</section>

<!-- PASSO A PASSO (JORNADA) -->
<section class="reveal py-24 bg-surface-container-low border-t border-gray-200">
  <div class="container mx-auto px-6 md:px-12 max-w-7xl text-center">
    <span class="text-primary font-bold tracking-widest uppercase text-xs mb-4 block">Como Funciona</span>
    <h2 class="font-serif text-4xl text-gray-900 mb-16">A sua Jornada para um Novo Sorriso</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
      <!-- Conector de linha visual (Desktop) -->
      <div class="hidden md:block absolute top-12 left-1/8 right-1/8 h-0.5 bg-gray-200 z-0"></div>
      
      <!-- Passo 1 -->
      <div class="relative z-10 flex flex-col items-center">
        <div class="w-24 h-24 bg-white border-4 border-primary rounded-full flex items-center justify-center text-3xl text-primary font-bold shadow-lg mb-6">
          <i class="fa-solid fa-user-doctor"></i>
        </div>
        <h3 class="font-bold text-xl text-gray-900 mb-3">1. Avaliação Digital</h3>
        <p class="text-sm text-gray-600">Mapeamos toda a sua saúde bucal e alinhamos as suas expectativas estéticas.</p>
      </div>
      
      <!-- Passo 2 -->
      <div class="relative z-10 flex flex-col items-center">
        <div class="w-24 h-24 bg-white border-4 border-gray-200 rounded-full flex items-center justify-center text-3xl text-gray-400 font-bold shadow-lg mb-6 transition-colors hover:border-primary hover:text-primary">
          <i class="fa-solid fa-laptop-medical"></i>
        </div>
        <h3 class="font-bold text-xl text-gray-900 mb-3">2. Planejamento 3D</h3>
        <p class="text-sm text-gray-600">Você aprova o desenho do seu novo sorriso no computador antes de qualquer procedimento.</p>
      </div>
      
      <!-- Passo 3 -->
      <div class="relative z-10 flex flex-col items-center">
        <div class="w-24 h-24 bg-white border-4 border-gray-200 rounded-full flex items-center justify-center text-3xl text-gray-400 font-bold shadow-lg mb-6 transition-colors hover:border-primary hover:text-primary">
          <i class="fa-solid fa-wand-magic-sparkles"></i>
        </div>
        <h3 class="font-bold text-xl text-gray-900 mb-3">3. Execução Indolor</h3>
        <p class="text-sm text-gray-600">Com sedação e tecnologia, realizamos a instalação das lentes ou implantes de forma tranquila.</p>
      </div>
      
      <!-- Passo 4 -->
      <div class="relative z-10 flex flex-col items-center">
        <div class="w-24 h-24 bg-white border-4 border-gray-200 rounded-full flex items-center justify-center text-3xl text-gray-400 font-bold shadow-lg mb-6 transition-colors hover:border-primary hover:text-primary">
          <i class="fa-solid fa-face-smile-beam"></i>
        </div>
        <h3 class="font-bold text-xl text-gray-900 mb-3">4. O Novo Sorriso</h3>
        <p class="text-sm text-gray-600">Manutenção preventiva e acompanhamento contínuo para que seus resultados durem a vida toda.</p>
      </div>
    </div>
  </div>
</section>

<!-- CORPO CLÍNICO -->
<section class="reveal py-24 bg-white border-t border-gray-100">
  <div class="container mx-auto px-6 md:px-12 max-w-6xl">
    <div class="bg-gray-50 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-12 shadow-sm border border-gray-100">
      <div class="w-full md:w-2/5">
        <img src="https://images.unsplash.com/photo-1594824436998-ddedce2289eb?q=80&w=800&auto=format&fit=crop" alt="Dr. Roberto Médico Chefe" class="rounded-2xl shadow-xl object-cover w-full h-[400px]">
      </div>
      <div class="w-full md:w-3/5">
        <span class="text-primary font-bold text-sm tracking-widest uppercase block mb-2">Direção Clínica</span>
        <h2 class="font-serif text-3xl md:text-4xl text-gray-900 mb-4">Dr. Roberto Almeida</h2>
        <p class="text-primary mb-6 italic">CRO-SP 123.456 | Especialista em Reabilitação Oral</p>
        <p class="text-gray-600 mb-6 leading-relaxed">
          Com mais de 15 anos de atuação exclusiva na odontologia de alta performance, o Dr. Roberto é referência em implantes de carga imediata e estética dental avançada. 
        </p>
        <p class="text-gray-600 mb-8 leading-relaxed">
          Sua filosofia de trabalho baseia-se na personalização: "Cada paciente carrega uma história, e o nosso papel é devolver a segurança e a auto-estima através da ciência e da arte de lapidar sorrisos."
        </p>
        <div class="flex items-center gap-4">
          <a href="#" class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors"><i class="fa-brands fa-instagram"></i></a>
          <a href="#" class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors"><i class="fa-brands fa-linkedin-in"></i></a>
        </div>
      </div>
    </div>
  </div>
</section>
`;

  const miamiWellnessDense = `
<!-- TECHNOLOGY & INFRASTRUCTURE -->
<section class="reveal py-24 bg-white border-t border-gray-100">
  <div class="container mx-auto px-6 md:px-12 max-w-7xl">
    <div class="flex flex-col lg:flex-row items-center gap-16">
      <div class="lg:w-1/2">
        <div class="relative">
          <div class="absolute -inset-4 bg-primary/5 rounded-3xl transform -rotate-3"></div>
          <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop" class="relative z-10 rounded-2xl shadow-2xl object-cover h-[500px] w-full" alt="Advanced Chiropractic Technology" />
        </div>
      </div>
      <div class="lg:w-1/2">
        <h2 class="text-4xl font-extrabold text-gray-900 mb-6">Advanced Healing Technology</h2>
        <p class="text-gray-600 text-lg leading-relaxed mb-8">
          We don't guess when it comes to your spine. Miami Wellness Center invests in state-of-the-art diagnostic and treatment technology to pinpoint exactly where your pain originates and solve it faster.
        </p>
        <div class="space-y-6">
          <div class="flex gap-4">
            <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 text-primary text-xl">
              <i class="fa-solid fa-bed"></i>
            </div>
            <div>
              <h4 class="font-bold text-gray-900 mb-1">Spinal Decompression Table</h4>
              <p class="text-sm text-gray-600">A non-surgical therapy that gently stretches the spine, relieving pressure on herniated or bulging discs.</p>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 text-primary text-xl">
              <i class="fa-solid fa-camera-retro"></i>
            </div>
            <div>
              <h4 class="font-bold text-gray-900 mb-1">Digital X-Ray Suite</h4>
              <p class="text-sm text-gray-600">Immediate, high-resolution imaging that allows us to see the exact structure of your spine before any adjustment.</p>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 text-primary text-xl">
              <i class="fa-solid fa-bolt"></i>
            </div>
            <div>
              <h4 class="font-bold text-gray-900 mb-1">Cold Laser Therapy</h4>
              <p class="text-sm text-gray-600">FDA-approved laser tech that accelerates cellular repair, reduces inflammation, and speeds up recovery tissue.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- THE HEALING JOURNEY -->
<section class="reveal py-24 bg-gray-50 border-t border-gray-200">
  <div class="container mx-auto px-6 md:px-12 max-w-7xl text-center">
    <span class="text-primary font-bold tracking-widest uppercase text-xs mb-4 block">The Process</span>
    <h2 class="text-4xl font-extrabold text-gray-900 mb-16">Your Roadmap to Recovery</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
      <div class="hidden md:block absolute top-12 left-1/8 right-1/8 h-0.5 bg-gray-300 z-0"></div>
      
      <div class="relative z-10 flex flex-col items-center">
        <div class="w-24 h-24 bg-white border-4 border-primary rounded-full flex items-center justify-center text-3xl text-primary font-bold shadow-lg mb-6">
          <i class="fa-solid fa-clipboard-user"></i>
        </div>
        <h3 class="font-bold text-xl text-gray-900 mb-3">1. Discovery Exam</h3>
        <p class="text-sm text-gray-600">We analyze your posture, mobility, and medical history to locate the root cause of your pain.</p>
      </div>
      
      <div class="relative z-10 flex flex-col items-center">
        <div class="w-24 h-24 bg-white border-4 border-gray-200 rounded-full flex items-center justify-center text-3xl text-gray-400 font-bold shadow-lg mb-6 transition-colors hover:border-primary hover:text-primary">
          <i class="fa-solid fa-map-location-dot"></i>
        </div>
        <h3 class="font-bold text-xl text-gray-900 mb-3">2. Custom Plan</h3>
        <p class="text-sm text-gray-600">A tailored treatment roadmap designed specifically for your body and your lifestyle goals.</p>
      </div>
      
      <div class="relative z-10 flex flex-col items-center">
        <div class="w-24 h-24 bg-white border-4 border-gray-200 rounded-full flex items-center justify-center text-3xl text-gray-400 font-bold shadow-lg mb-6 transition-colors hover:border-primary hover:text-primary">
          <i class="fa-solid fa-hands-holding-child"></i>
        </div>
        <h3 class="font-bold text-xl text-gray-900 mb-3">3. Active Treatment</h3>
        <p class="text-sm text-gray-600">Through adjustments and therapy, we correct the misalignments and restore nervous system flow.</p>
      </div>
      
      <div class="relative z-10 flex flex-col items-center">
        <div class="w-24 h-24 bg-white border-4 border-gray-200 rounded-full flex items-center justify-center text-3xl text-gray-400 font-bold shadow-lg mb-6 transition-colors hover:border-primary hover:text-primary">
          <i class="fa-solid fa-shield-heart"></i>
        </div>
        <h3 class="font-bold text-xl text-gray-900 mb-3">4. Wellness Maintained</h3>
        <p class="text-sm text-gray-600">Ongoing guidance on exercises and posture to ensure your pain stays away permanently.</p>
      </div>
    </div>
  </div>
</section>

<!-- THE CLINIC TEAM -->
<section class="reveal py-24 bg-white border-t border-gray-100">
  <div class="container mx-auto px-6 md:px-12 max-w-6xl">
    <div class="text-center mb-16">
      <h2 class="text-4xl font-extrabold text-gray-900 mb-4">Meet The Wellness Team</h2>
      <p class="text-gray-600 max-w-2xl mx-auto">Our certified experts are dedicated to helping you live a pain-free life.</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="text-center group">
        <div class="overflow-hidden rounded-3xl mb-6 shadow-lg">
          <img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=600&auto=format&fit=crop" alt="Dr. Michael Smith" class="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500">
        </div>
        <h3 class="text-xl font-bold text-gray-900">Dr. Michael Smith</h3>
        <p class="text-primary font-medium text-sm mb-3">Lead Chiropractor</p>
        <p class="text-gray-500 text-sm px-4">Specializes in sports rehabilitation and spinal decompression with 10+ years of experience.</p>
      </div>
      
      <div class="text-center group">
        <div class="overflow-hidden rounded-3xl mb-6 shadow-lg">
          <img src="https://images.unsplash.com/photo-1594824436998-ddedce2289eb?q=80&w=600&auto=format&fit=crop" alt="Dr. Sarah Jenkins" class="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500">
        </div>
        <h3 class="text-xl font-bold text-gray-900">Dr. Sarah Jenkins</h3>
        <p class="text-primary font-medium text-sm mb-3">Chiropractic Neurologist</p>
        <p class="text-gray-500 text-sm px-4">Focused on correcting chronic migraines, vertigo, and complex nervous system disorders.</p>
      </div>
      
      <div class="text-center group">
        <div class="overflow-hidden rounded-3xl mb-6 shadow-lg">
          <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=600&auto=format&fit=crop" alt="Emily Davis" class="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500">
        </div>
        <h3 class="text-xl font-bold text-gray-900">Emily Davis, LMT</h3>
        <p class="text-primary font-medium text-sm mb-3">Lead Massage Therapist</p>
        <p class="text-gray-500 text-sm px-4">Expert in deep tissue release and myofascial therapy to complement spinal adjustments.</p>
      </div>
    </div>
  </div>
</section>
`;

  await injectDenseSections('template-oralfix', oralFixDense);
  await injectDenseSections('template-miamiwellness', miamiWellnessDense);
}

run();
