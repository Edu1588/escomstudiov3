import fs from 'fs/promises';
import path from 'path';

async function rebuildSite(slug, customHTML) {
  const indexFile = path.resolve(`./public/${slug}/index.html`);
  
  try {
    const content = await fs.readFile(indexFile, 'utf8');
    
    // Split the content
    const heroMarker = '<!-- Hero Section -->';
    const prospectMarker = '<!-- SEÇÃO DO DOSSIÊ COMERCIAL (PDF/ESTRATÉGIA) -->';
    
    const startIndex = content.indexOf(heroMarker);
    const endIndex = content.indexOf(prospectMarker);
    
    if (startIndex === -1 || endIndex === -1) {
      throw new Error(`Markers not found in ${slug}`);
    }
    
    const topPart = content.substring(0, startIndex);
    const bottomPart = content.substring(endIndex);
    
    // Stitch them together
    const newContent = topPart + customHTML + bottomPart;
    
    await fs.writeFile(indexFile, newContent);
    console.log(`Successfully rebuilt ${slug} from scratch!`);
  } catch (err) {
    console.error(`Error rebuilding ${slug}:`, err);
  }
}

async function run() {
  const oralFixHTML = `
<!-- NOVO LAYOUT GERADO PARA ORAL FIX (ODONTOLOGIA) -->
<section id="hero" class="relative w-full h-[90vh] flex items-center justify-center overflow-hidden">
  <div class="absolute inset-0 w-full h-full">
    <img src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=2000&auto=format&fit=crop" class="w-full h-full object-cover" alt="Clínica Odontológica Premium" />
    <div class="absolute inset-0 bg-gradient-to-r from-[#000000e6] via-[#000000b3] to-transparent"></div>
  </div>
  <div class="relative z-10 container mx-auto px-6 md:px-xl flex flex-col items-start pt-20">
    <span class="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4 border-l-2 border-primary pl-3">Odontologia de Excelência</span>
    <h1 class="font-headline-lg text-[3rem] md:text-[4.5rem] leading-tight text-white max-w-3xl mb-6">
      Transformamos sorrisos, <br/><span class="text-primary italic">recuperamos vidas.</span>
    </h1>
    <p class="text-zinc-300 text-lg max-w-xl mb-10 leading-relaxed">
      A Oral Fix une tecnologia de ponta, especialistas renomados e um ambiente acolhedor para entregar os melhores resultados em implantes, lentes de contato e reabilitação oral.
    </p>
    <a href="#tratamentos" class="bg-primary text-white font-bold py-4 px-10 rounded-full hover:bg-white hover:text-primary transition-all duration-300 transform hover:-translate-y-1 shadow-xl">
      Conhecer Tratamentos
    </a>
  </div>
</section>

<section id="tratamentos" class="py-24 bg-surface-container-low">
  <div class="container mx-auto px-6 md:px-xl">
    <div class="text-center mb-16">
      <h2 class="font-headline-md text-4xl text-on-surface mb-4">Especialidades Clínicas</h2>
      <div class="w-20 h-1 bg-primary mx-auto"></div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Service 1 -->
      <div class="bg-white rounded-2xl overflow-hidden shadow-lg group hover:shadow-2xl transition-all duration-500">
        <div class="h-64 overflow-hidden relative">
          <img src="https://images.unsplash.com/photo-1537368910025-70280458b4fe?q=80&w=800&auto=format&fit=crop" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Implantes" />
          <div class="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div class="p-8">
          <h3 class="text-xl font-bold text-on-surface mb-3">Implantes Dentários</h3>
          <p class="text-on-surface-variant text-sm mb-6">Recupere a função mastigatória e a estética com nossa tecnologia de implantes de carga imediata.</p>
          <a href="#" class="text-primary font-bold text-sm uppercase tracking-wider flex items-center gap-2 hover:gap-4 transition-all">Saiba mais <i class="fa-solid fa-arrow-right"></i></a>
        </div>
      </div>
      
      <!-- Service 2 -->
      <div class="bg-white rounded-2xl overflow-hidden shadow-lg group hover:shadow-2xl transition-all duration-500">
        <div class="h-64 overflow-hidden relative">
          <img src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800&auto=format&fit=crop" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Lentes" />
          <div class="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div class="p-8">
          <h3 class="text-xl font-bold text-on-surface mb-3">Lentes de Contato</h3>
          <p class="text-on-surface-variant text-sm mb-6">Sorriso de porcelana, alinhado e perfeitamente branco em poucas sessões e sem dor.</p>
          <a href="#" class="text-primary font-bold text-sm uppercase tracking-wider flex items-center gap-2 hover:gap-4 transition-all">Saiba mais <i class="fa-solid fa-arrow-right"></i></a>
        </div>
      </div>

      <!-- Service 3 -->
      <div class="bg-white rounded-2xl overflow-hidden shadow-lg group hover:shadow-2xl transition-all duration-500">
        <div class="h-64 overflow-hidden relative">
          <img src="https://images.unsplash.com/photo-1609840114035-3c981b782dfe?q=80&w=800&auto=format&fit=crop" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Invisalign" />
          <div class="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div class="p-8">
          <h3 class="text-xl font-bold text-on-surface mb-3">Alinhadores Invisíveis</h3>
          <p class="text-on-surface-variant text-sm mb-6">Tratamento ortodôntico moderno, discreto e incrivelmente rápido para todas as idades.</p>
          <a href="#" class="text-primary font-bold text-sm uppercase tracking-wider flex items-center gap-2 hover:gap-4 transition-all">Saiba mais <i class="fa-solid fa-arrow-right"></i></a>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Footer Falso para fechar o layout -->
<footer class="bg-inverse-surface py-12 border-b-8 border-primary">
  <div class="container mx-auto px-6 text-center text-white/50 text-sm">
    &copy; 2024 Oral Fix - Odontologia Especializada. Todos os direitos reservados.
  </div>
</footer>
`;

  const miamiWellnessHTML = `
<!-- NOVO LAYOUT GERADO PARA MIAMI WELLNESS (QUIROPRAXIA) -->
<section id="hero" class="relative w-full h-[85vh] bg-[#f4f7f6] flex items-center">
  <div class="container mx-auto px-6 md:px-xl flex flex-col lg:flex-row items-center justify-between gap-12">
    <div class="lg:w-1/2 z-10 pt-20">
      <span class="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-6">Miami's #1 Wellness Center</span>
      <h1 class="text-5xl md:text-6xl font-extrabold text-[#1f2937] leading-[1.1] mb-6">
        Relieve Pain.<br/>Restore Motion.<br/><span class="text-primary">Reclaim Life.</span>
      </h1>
      <p class="text-gray-600 text-lg mb-10 max-w-lg leading-relaxed">
        Expert chiropractic adjustments, massage therapy, and rehabilitation protocols designed to help you live a pain-free, active life.
      </p>
      <div class="flex flex-wrap gap-4">
        <button class="bg-primary text-white font-bold py-4 px-8 rounded-lg shadow-lg shadow-primary/30 hover:-translate-y-1 transition-transform">
          Book an Appointment
        </button>
        <button class="bg-white text-[#1f2937] font-bold py-4 px-8 rounded-lg border border-gray-200 hover:border-primary transition-colors">
          View Our Services
        </button>
      </div>
    </div>
    <div class="lg:w-1/2 relative">
      <div class="absolute inset-0 bg-primary/20 rounded-full blur-3xl transform translate-x-10 translate-y-10"></div>
      <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200&auto=format&fit=crop" class="relative z-10 rounded-2xl shadow-2xl object-cover h-[600px] w-full" alt="Chiropractic Adjustment" />
      
      <!-- Floating Badge -->
      <div class="absolute bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-xl z-20 hidden md:block">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-xl">
            <i class="fa-solid fa-star"></i>
          </div>
          <div>
            <p class="font-bold text-gray-800 text-lg">5.0 / 5.0</p>
            <p class="text-sm text-gray-500">Over 2,000+ Happy Patients</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="py-20 bg-white">
  <div class="container mx-auto px-6 md:px-xl">
    <div class="text-center max-w-3xl mx-auto mb-16">
      <h2 class="text-4xl font-bold text-gray-900 mb-6">Our Healing Expertise</h2>
      <p class="text-gray-600 text-lg">We use evidence-based treatments to address the root cause of your pain, not just mask the symptoms.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-gray-50 p-8 rounded-2xl hover:bg-primary hover:text-white transition-colors group cursor-pointer">
        <i class="fa-solid fa-bone text-4xl text-primary group-hover:text-white mb-6 transition-colors"></i>
        <h3 class="text-xl font-bold mb-3">Spinal Adjustment</h3>
        <p class="text-sm opacity-80 leading-relaxed">Precise, safe alignments to improve nervous system function and mobility.</p>
      </div>
      <div class="bg-gray-50 p-8 rounded-2xl hover:bg-primary hover:text-white transition-colors group cursor-pointer">
        <i class="fa-solid fa-person-running text-4xl text-primary group-hover:text-white mb-6 transition-colors"></i>
        <h3 class="text-xl font-bold mb-3">Sports Rehab</h3>
        <p class="text-sm opacity-80 leading-relaxed">Recover faster from injuries and enhance your athletic performance naturally.</p>
      </div>
      <div class="bg-gray-50 p-8 rounded-2xl hover:bg-primary hover:text-white transition-colors group cursor-pointer">
        <i class="fa-solid fa-spa text-4xl text-primary group-hover:text-white mb-6 transition-colors"></i>
        <h3 class="text-xl font-bold mb-3">Massage Therapy</h3>
        <p class="text-sm opacity-80 leading-relaxed">Deep tissue and therapeutic massage to relieve muscle tension and stress.</p>
      </div>
      <div class="bg-gray-50 p-8 rounded-2xl hover:bg-primary hover:text-white transition-colors group cursor-pointer">
        <i class="fa-solid fa-bed-pulse text-4xl text-primary group-hover:text-white mb-6 transition-colors"></i>
        <h3 class="text-xl font-bold mb-3">Posture Correction</h3>
        <p class="text-sm opacity-80 leading-relaxed">Ergonomic training and exercises to reverse the damage of modern desk jobs.</p>
      </div>
    </div>
  </div>
</section>

<!-- Footer Falso para fechar o layout -->
<footer class="bg-gray-900 py-12 border-t border-gray-800">
  <div class="container mx-auto px-6 text-center text-gray-500 text-sm">
    &copy; 2024 Miami Wellness Chiropractic. All rights reserved.
  </div>
</footer>
`;

  await rebuildSite('template-oralfix', oralFixHTML);
  await rebuildSite('template-miamiwellness', miamiWellnessHTML);
}

run();
