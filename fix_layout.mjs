import fs from 'fs/promises';
import path from 'path';

async function fixLayout(slug, isOdonto) {
  const indexFile = path.resolve(`./public/${slug}/index.html`);
  
  try {
    let content = await fs.readFile(indexFile, 'utf8');

    // 1. Fix the Urgency Banner Color to Red
    // The banner currently has bg-[#0284c7] or bg-[#14b8a6]
    content = content.replace(/id="banner-urgencia" class="([^"]*)"/g, (match, classes) => {
      let newClasses = classes.replace(/bg-\[[^\]]+\]/g, 'bg-red-600');
      newClasses = newClasses.replace(/bg-primary/g, 'bg-red-600');
      return `id="banner-urgencia" class="${newClasses}"`;
    });

    // 2. Fix the Logo and Navbar Title
    // Let's find the header block and replace it completely to avoid overlap and remove the CB logo.
    const headerStart = content.indexOf('<!-- Header (TopNavBar) -->');
    const heroStart = content.indexOf('<!-- Hero Section -->') !== -1 
      ? content.indexOf('<!-- Hero Section -->') 
      : content.indexOf('<!-- NOVO LAYOUT');

    if (headerStart !== -1 && heroStart !== -1) {
      const topPart = content.substring(0, headerStart);
      const bottomPart = content.substring(heroStart);
      
      const title = isOdonto ? 'Oral Fix' : 'Miami Wellness';
      const icon = isOdonto ? 'fa-tooth' : 'fa-bone';
      
      const newHeader = `
<!-- Header (TopNavBar) -->
<header id="navbar" class="fixed top-10 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 w-full shadow-sm transition-all duration-300">
  <div class="px-6 md:px-12 py-4 max-w-7xl mx-auto w-full flex items-center justify-between">
    <!-- Logo -->
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
        <i class="fa-solid ${icon} text-lg"></i>
      </div>
      <span class="font-serif font-bold text-xl text-gray-800">${title}</span>
    </div>
    
    <!-- Menu -->
    <div class="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
      <a href="#tratamentos" class="hover:text-primary transition-colors">Especialidades</a>
      <a href="#faq" class="hover:text-primary transition-colors">Dúvidas</a>
      <a href="#contato" class="hover:text-primary transition-colors">Contato</a>
    </div>
    
    <!-- CTA -->
    <a href="#dossie-comercial" class="bg-primary text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-gray-900 transition-colors hidden sm:block">
      Ver Diagnóstico
    </a>
  </div>
</header>
`;
      content = topPart + newHeader + bottomPart;
    }

    // 3. Fix missing closing tags or z-index issues
    // Ensure the hero section doesn't overlap the rest of the page
    content = content.replace(/class="relative w-full h-\[90vh\]/g, 'class="relative w-full min-h-[90vh]');
    content = content.replace(/class="relative w-full h-\[85vh\]/g, 'class="relative w-full min-h-[85vh]');

    await fs.writeFile(indexFile, content);
    console.log(`Successfully fixed layout for ${slug}`);
  } catch (err) {
    console.error(`Error fixing layout for ${slug}:`, err);
  }
}

async function run() {
  await fixLayout('template-oralfix', true);
  await fixLayout('template-miamiwellness', false);
}

run();
