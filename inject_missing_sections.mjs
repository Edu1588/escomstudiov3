import fs from 'fs/promises';
import path from 'path';

async function injectSections(slug, newSections) {
  const indexFile = path.resolve(`./public/${slug}/index.html`);
  
  try {
    let content = await fs.readFile(indexFile, 'utf8');
    
    // Find the fake footer we added last time
    const footerMarker = '<!-- Footer Falso para fechar o layout -->';
    const splitIndex = content.indexOf(footerMarker);
    
    if (splitIndex === -1) {
      console.log(`Marker not found for ${slug}, maybe already injected?`);
      return;
    }
    
    const topPart = content.substring(0, splitIndex);
    // Let's remove the fake footer from the bottom part, it's roughly 250 characters long.
    // The fake footer ends at </footer>
    const footerEndMarker = '</footer>';
    const footerEndIndex = content.indexOf(footerEndMarker, splitIndex) + footerEndMarker.length;
    
    const bottomPart = content.substring(footerEndIndex);
    
    const newContent = topPart + newSections + bottomPart;
    
    await fs.writeFile(indexFile, newContent);
    console.log(`Successfully injected new sections for ${slug}`);
  } catch (err) {
    console.error(`Error processing ${slug}:`, err);
  }
}

async function run() {
  const oralFixSections = `
<!-- Sobre a Clínica (Autoridade) -->
<section id="sobre" class="py-24 bg-white">
  <div class="container mx-auto px-6 md:px-12 max-w-7xl flex flex-col md:flex-row items-center gap-12">
    <div class="md:w-1/2 relative">
      <div class="absolute -inset-4 bg-primary/10 rounded-3xl transform -rotate-3"></div>
      <img src="https://images.unsplash.com/photo-1599557424263-d1df5e783618?q=80&w=800&auto=format&fit=crop" class="relative z-10 rounded-2xl shadow-xl w-full h-[500px] object-cover" alt="Equipe Oral Fix" />
      <div class="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-2xl z-20 border border-gray-100">
        <p class="font-bold text-4xl text-primary mb-1">15+</p>
        <p class="text-sm text-gray-600 font-medium">Anos de Experiência</p>
      </div>
    </div>
    <div class="md:w-1/2">
      <span class="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4 border-l-2 border-primary pl-3">A Clínica</span>
      <h2 class="text-4xl font-serif text-gray-900 mb-6">Tecnologia, precisão e o mais puro cuidado humano.</h2>
      <p class="text-gray-600 mb-6 leading-relaxed">
        Na Oral Fix, acreditamos que a ida ao dentista não deve ser um momento de tensão. Desenvolvemos um protocolo de atendimento onde o conforto do paciente e a tecnologia andam lado a lado.
      </p>
      <p class="text-gray-600 mb-8 leading-relaxed">
        Com o uso de scanners 3D de última geração, conseguimos prever o resultado do seu tratamento antes mesmo dele começar, garantindo a excelência cirúrgica que você merece.
      </p>
      <ul class="space-y-3 mb-8">
        <li class="flex items-center gap-3 text-gray-800 font-medium"><i class="fa-solid fa-check text-primary"></i> Atendimento Humanizado</li>
        <li class="flex items-center gap-3 text-gray-800 font-medium"><i class="fa-solid fa-check text-primary"></i> Scanner Intraoral 3D</li>
        <li class="flex items-center gap-3 text-gray-800 font-medium"><i class="fa-solid fa-check text-primary"></i> Centro Cirúrgico Próprio</li>
      </ul>
    </div>
  </div>
</section>

<!-- Resultados / Galeria -->
<section class="py-24 bg-gray-50">
  <div class="container mx-auto px-6 md:px-12 max-w-7xl">
    <div class="text-center mb-16">
      <h2 class="font-serif text-4xl text-gray-900 mb-4">Sorrisos Transformados</h2>
      <p class="text-gray-600 max-w-2xl mx-auto">Confira a evolução estética e funcional de pacientes reais que confiaram sua saúde bucal à Oral Fix.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <img src="https://images.unsplash.com/photo-1606265752439-1f18756aa5fc?q=80&w=600&auto=format&fit=crop" class="rounded-2xl shadow-md hover:scale-105 transition-transform duration-500 h-64 w-full object-cover" alt="Resultado 1" />
      <img src="https://images.unsplash.com/photo-1572985011741-94572242cc3d?q=80&w=600&auto=format&fit=crop" class="rounded-2xl shadow-md hover:scale-105 transition-transform duration-500 h-64 w-full object-cover" alt="Resultado 2" />
      <img src="https://images.unsplash.com/photo-1524222717473-730000096953?q=80&w=600&auto=format&fit=crop" class="rounded-2xl shadow-md hover:scale-105 transition-transform duration-500 h-64 w-full object-cover" alt="Resultado 3" />
    </div>
  </div>
</section>

<!-- Depoimentos -->
<section class="py-24 bg-primary text-white">
  <div class="container mx-auto px-6 md:px-12 max-w-7xl text-center">
    <i class="fa-solid fa-quote-left text-5xl opacity-20 mb-8"></i>
    <h2 class="font-serif text-4xl mb-12">O que dizem nossos pacientes</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
      <div class="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/20">
        <div class="flex text-yellow-400 mb-4 text-sm"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></div>
        <p class="text-white/90 italic mb-6">"Fiz minhas lentes de contato e o resultado ficou incrível! O cuidado da equipe durante as sessões me tirou todo o medo que eu tinha de dentista."</p>
        <div class="font-bold">- Mariana Souza</div>
      </div>
      <div class="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/20">
        <div class="flex text-yellow-400 mb-4 text-sm"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></div>
        <p class="text-white/90 italic mb-6">"Os implantes mudaram a minha rotina. Voltei a mastigar qualquer alimento com segurança e a cirurgia foi totalmente indolor. Super recomendo!"</p>
        <div class="font-bold">- Carlos Roberto</div>
      </div>
    </div>
  </div>
</section>

<!-- FAQ e Contato Rápido -->
<section id="faq" class="py-24 bg-white">
  <div class="container mx-auto px-6 md:px-12 max-w-4xl">
    <div class="text-center mb-16">
      <h2 class="font-serif text-4xl text-gray-900 mb-4">Dúvidas Frequentes</h2>
    </div>
    <div class="space-y-4">
      <details class="bg-gray-50 rounded-xl p-6 group cursor-pointer border border-gray-100 open:bg-white open:border-primary/30 transition-all">
        <summary class="font-bold text-gray-800 outline-none list-none flex justify-between items-center group-open:text-primary">
          A cirurgia de implante dói? <i class="fa-solid fa-chevron-down group-open:rotate-180 transition-transform"></i>
        </summary>
        <p class="text-gray-600 mt-4 pt-4 border-t border-gray-200">Não. O procedimento é feito com anestesia local de alta eficácia. Nossa equipe foca 100% no controle da dor no pré e pós-operatório.</p>
      </details>
      <details class="bg-gray-50 rounded-xl p-6 group cursor-pointer border border-gray-100 open:bg-white open:border-primary/30 transition-all">
        <summary class="font-bold text-gray-800 outline-none list-none flex justify-between items-center group-open:text-primary">
          Quanto tempo dura o tratamento com Invisalign? <i class="fa-solid fa-chevron-down group-open:rotate-180 transition-transform"></i>
        </summary>
        <p class="text-gray-600 mt-4 pt-4 border-t border-gray-200">Depende de cada caso, mas geralmente os tratamentos com alinhadores invisíveis são concluídos entre 6 e 18 meses, sendo muito mais rápidos que os aparelhos convencionais.</p>
      </details>
    </div>
  </div>
</section>

<!-- Original Footer re-added to close properly -->
<footer class="bg-inverse-surface py-12 border-b-8 border-primary">
  <div class="container mx-auto px-6 text-center text-white/50 text-sm">
    &copy; 2024 Oral Fix - Odontologia Especializada. Todos os direitos reservados.
  </div>
</footer>
`;

  const miamiWellnessSections = `
<!-- About the Clinic -->
<section id="about" class="py-24 bg-white">
  <div class="container mx-auto px-6 md:px-12 max-w-7xl flex flex-col md:flex-row-reverse items-center gap-12">
    <div class="md:w-1/2 relative">
      <div class="absolute -inset-4 bg-primary/10 rounded-3xl transform rotate-3"></div>
      <img src="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=800&auto=format&fit=crop" class="relative z-10 rounded-2xl shadow-xl w-full h-[500px] object-cover" alt="Dr. Smith at Miami Wellness" />
    </div>
    <div class="md:w-1/2">
      <span class="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-4">About Our Practice</span>
      <h2 class="text-4xl font-extrabold text-gray-900 mb-6">Healing Miami, one spine at a time.</h2>
      <p class="text-gray-600 mb-6 leading-relaxed">
        At Miami Wellness Chiropractic, we don't just crack backs. We perform comprehensive bio-mechanical assessments to find the exact root cause of your discomfort, headaches, or mobility loss.
      </p>
      <p class="text-gray-600 mb-8 leading-relaxed">
        Our state-of-the-art facility uses drop-table techniques, decompression therapy, and therapeutic massage to ensure your recovery is fast, safe, and long-lasting.
      </p>
      <div class="grid grid-cols-2 gap-6 border-t border-gray-100 pt-8">
        <div>
          <p class="text-4xl font-bold text-primary mb-2">12k+</p>
          <p class="text-sm text-gray-500 font-medium">Adjustments Performed</p>
        </div>
        <div>
          <p class="text-4xl font-bold text-primary mb-2">98%</p>
          <p class="text-sm text-gray-500 font-medium">Patient Success Rate</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Success Cases -->
<section class="py-24 bg-gray-50 border-y border-gray-200">
  <div class="container mx-auto px-6 md:px-12 max-w-7xl">
    <div class="text-center mb-16">
      <h2 class="text-4xl font-extrabold text-gray-900 mb-4">Active Lifestyles Restored</h2>
      <p class="text-gray-600 max-w-2xl mx-auto">See how our patients went from chronic pain back to doing what they love.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="bg-white p-4 rounded-2xl shadow-sm hover:shadow-xl transition-shadow">
        <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop" class="rounded-xl h-48 w-full object-cover mb-4" alt="Yoga Recovery" />
        <h4 class="font-bold text-gray-900 text-lg mb-2">"Back to Yoga"</h4>
        <p class="text-sm text-gray-600">After severe lower back pain, Sarah was able to return to her daily Yoga routine in just 4 weeks.</p>
      </div>
      <div class="bg-white p-4 rounded-2xl shadow-sm hover:shadow-xl transition-shadow">
        <img src="https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=600&auto=format&fit=crop" class="rounded-xl h-48 w-full object-cover mb-4" alt="Runner" />
        <h4 class="font-bold text-gray-900 text-lg mb-2">"Marathon Ready"</h4>
        <p class="text-sm text-gray-600">John overcame a severe sciatica nerve pinch that stopped him from running half-marathons.</p>
      </div>
      <div class="bg-white p-4 rounded-2xl shadow-sm hover:shadow-xl transition-shadow">
        <img src="https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=600&auto=format&fit=crop" class="rounded-xl h-48 w-full object-cover mb-4" alt="Stretching" />
        <h4 class="font-bold text-gray-900 text-lg mb-2">"No More Desk Neck"</h4>
        <p class="text-sm text-gray-600">Correcting the 'tech neck' posture allowed Michael to work without daily migraines.</p>
      </div>
    </div>
  </div>
</section>

<!-- Testimonials -->
<section class="py-24 bg-gray-900 text-white relative overflow-hidden">
  <div class="absolute inset-0 bg-primary/10"></div>
  <div class="container mx-auto px-6 md:px-12 max-w-5xl relative z-10 text-center">
    <h2 class="text-4xl font-extrabold mb-12">Don't just take our word for it</h2>
    <div class="bg-gray-800/80 backdrop-blur p-10 rounded-3xl border border-gray-700">
      <div class="flex justify-center text-primary mb-6 text-xl gap-1">
        <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
      </div>
      <p class="text-2xl font-light italic text-gray-300 mb-8">
        "I had been dealing with a pinched nerve for over 6 months. I tried everything. Dr. Smith adjusted my lumbar spine and by the 3rd session, I was 90% pain-free. This place is magical!"
      </p>
      <div class="font-bold tracking-wide uppercase text-sm">- Jessica M., Miami Beach</div>
    </div>
  </div>
</section>

<!-- FAQ and Location -->
<section id="faq" class="py-24 bg-white">
  <div class="container mx-auto px-6 md:px-12 max-w-6xl flex flex-col md:flex-row gap-16">
    <div class="md:w-1/2">
      <h2 class="text-3xl font-extrabold text-gray-900 mb-8">Frequently Asked Questions</h2>
      <div class="space-y-4">
        <details class="bg-gray-50 rounded-xl p-5 group cursor-pointer border border-gray-100 open:bg-white transition-all">
          <summary class="font-bold text-gray-800 outline-none list-none flex justify-between items-center">
            Do adjustments hurt? <i class="fa-solid fa-plus group-open:hidden text-primary"></i><i class="fa-solid fa-minus hidden group-open:block text-primary"></i>
          </summary>
          <p class="text-gray-600 mt-3 text-sm">Most patients experience immediate relief. While you might feel slight pressure or hear a 'pop', the process is highly controlled and painless.</p>
        </details>
        <details class="bg-gray-50 rounded-xl p-5 group cursor-pointer border border-gray-100 open:bg-white transition-all">
          <summary class="font-bold text-gray-800 outline-none list-none flex justify-between items-center">
            Do you accept insurance? <i class="fa-solid fa-plus group-open:hidden text-primary"></i><i class="fa-solid fa-minus hidden group-open:block text-primary"></i>
          </summary>
          <p class="text-gray-600 mt-3 text-sm">Yes, we are in-network with most major PPO plans. Our front desk will verify your benefits before your first appointment.</p>
        </details>
        <details class="bg-gray-50 rounded-xl p-5 group cursor-pointer border border-gray-100 open:bg-white transition-all">
          <summary class="font-bold text-gray-800 outline-none list-none flex justify-between items-center">
            How many sessions will I need? <i class="fa-solid fa-plus group-open:hidden text-primary"></i><i class="fa-solid fa-minus hidden group-open:block text-primary"></i>
          </summary>
          <p class="text-gray-600 mt-3 text-sm">This depends entirely on your condition. After your initial exam, we provide a customized care plan with a precise timeline.</p>
        </details>
      </div>
    </div>
    <div class="md:w-1/2">
      <div class="bg-gray-100 h-full rounded-2xl overflow-hidden relative min-h-[300px] shadow-inner">
        <!-- Mock Map visual -->
        <img src="https://images.unsplash.com/photo-1536622359527-3ceebdd3e3b3?q=80&w=800&auto=format&fit=crop" class="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay grayscale" alt="Map" />
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="bg-white p-6 rounded-xl shadow-lg text-center">
            <i class="fa-solid fa-location-dot text-3xl text-primary mb-3"></i>
            <h4 class="font-bold text-gray-900 mb-1">Miami Wellness Center</h4>
            <p class="text-sm text-gray-500">1234 Biscayne Blvd<br/>Miami, FL 33132</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Original Footer re-added to close properly -->
<footer class="bg-gray-900 py-12 border-t border-gray-800">
  <div class="container mx-auto px-6 text-center text-gray-500 text-sm">
    &copy; 2024 Miami Wellness Chiropractic. All rights reserved.
  </div>
</footer>
`;

  await injectSections('template-oralfix', oralFixSections);
  await injectSections('template-miamiwellness', miamiWellnessSections);
}

run();
