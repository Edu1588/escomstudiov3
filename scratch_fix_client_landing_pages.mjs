import fs from 'fs';
import path from 'path';

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  console.log(`Corrigindo arquivo: ${filePath}`);

  // 1. Corrigir telefones
  content = content.replace(/5548998065099/g, '5513981062787');
  content = content.replace(/\(48\) 99806-5099/g, '(13) 98106-2787');
  content = content.replace(/48998065099/g, '13981062787');

  // 2. Corrigir lógica do GSAP ScrollTrigger
  const oldGsapBlock = `    // Animar seções ao rolar a tela (Fade in + slide up)
    const animateSections = [
        { id: '#dilema-visual', x: -40, y: 0 },
        { id: '#dilema-text', x: 40, y: 0 },
        { id: '#pilares-grid > div', x: 0, y: 40, stagger: 0.15 },
        { id: '#tec-text', x: -40, y: 0 },
        { id: '#tec-visual', x: 40, y: 0 },
        { id: '#jornada-flow', x: 0, y: 40 },
        { id: '#equipe-visual', x: -40, y: 0 },
        { id: '#equipe-text', x: 40, y: 0 },
        { id: '#galeria-grid > div', x: 0, y: 30, stagger: 0.12 },
        { id: '#depoimentos-grid > div', x: 0, y: 30, stagger: 0.15 },
        { id: '#faq-accordion > div', x: 0, y: 25, stagger: 0.1 }
    ];

    animateSections.forEach(item => {
        gsap.from(item.id, {
            scrollTrigger: {
                trigger: item.id,
                start: 'top 95%', // Dispara assim que surge na parte inferior
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: item.x || 0,
            y: item.y || 0,
            stagger: item.stagger || 0,
            duration: 0.9,
            ease: 'power2.out'
        });
    });`;

  const newGsapBlock = `    // Animar seções ao rolar a tela (Fade in + slide up)
    const animateSections = [
        { id: '#dilema-visual', x: -40, y: 0 },
        { id: '#dilema-text', x: 40, y: 0 },
        { id: '#pilares-grid > div', trigger: '#pilares-grid', x: 0, y: 40, stagger: 0.15 },
        { id: '#tec-text', x: -40, y: 0 },
        { id: '#tec-visual', x: 40, y: 0 },
        { id: '#jornada-flow', x: 0, y: 40 },
        { id: '#equipe-visual', x: -40, y: 0 },
        { id: '#equipe-text', x: 40, y: 0 },
        { id: '#galeria-grid > div', trigger: '#galeria-grid', x: 0, y: 30, stagger: 0.12 },
        { id: '#depoimentos-grid > div', trigger: '#depoimentos-grid', x: 0, y: 30, stagger: 0.15 },
        { id: '#faq-accordion > div', trigger: '#faq-accordion', x: 0, y: 25, stagger: 0.1 }
    ];

    animateSections.forEach(item => {
        const triggerEl = item.trigger ? document.querySelector(item.trigger) : document.querySelector(item.id);
        if (!triggerEl) return;
        gsap.from(item.id, {
            scrollTrigger: {
                trigger: triggerEl,
                start: 'top 95%', // Dispara assim que surge na parte inferior
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: item.x || 0,
            y: item.y || 0,
            stagger: item.stagger || 0,
            duration: 0.9,
            ease: 'power2.out'
        });
    });`;

  // Tenta substituir usando regex ou normalizado para lidar com pequenas variações de quebra de linha
  const oldNormalized = oldGsapBlock.replace(/\r?\n/g, '\n');
  const newNormalized = newGsapBlock.replace(/\r?\n/g, '\n');
  const contentNormalized = content.replace(/\r?\n/g, '\n');

  if (contentNormalized.includes(oldNormalized)) {
    content = contentNormalized.replace(oldNormalized, newNormalized);
    console.log(`GSAP ScrollTrigger atualizado com sucesso em: ${filePath}`);
  } else {
    console.warn(`Aviso: Bloco GSAP não encontrado exatamente. Tentando substituição genérica de ScrollTrigger...`);
    // Fallback de substituição mais flexível se as quebras de linha variarem
    const simpleOld = `gsap.from(item.id, {
            scrollTrigger: {
                trigger: item.id,`;
    const simpleNew = `const triggerEl = item.trigger ? document.querySelector(item.trigger) : document.querySelector(item.id);
        if (!triggerEl) return;
        gsap.from(item.id, {
            scrollTrigger: {
                trigger: triggerEl,`;
                
    if (content.includes(simpleOld)) {
      content = content.replace(simpleOld, simpleNew);
      // E atualizar a definição do array também!
      content = content.replace(
        `{ id: '#pilares-grid > div', x: 0, y: 40, stagger: 0.15 },`,
        `{ id: '#pilares-grid > div', trigger: '#pilares-grid', x: 0, y: 40, stagger: 0.15 },`
      );
      content = content.replace(
        `{ id: '#galeria-grid > div', x: 0, y: 30, stagger: 0.12 },`,
        `{ id: '#galeria-grid > div', trigger: '#galeria-grid', x: 0, y: 30, stagger: 0.12 },`
      );
      content = content.replace(
        `{ id: '#depoimentos-grid > div', x: 0, y: 30, stagger: 0.15 },`,
        `{ id: '#depoimentos-grid > div', trigger: '#depoimentos-grid', x: 0, y: 30, stagger: 0.15 },`
      );
      content = content.replace(
        `{ id: '#faq-accordion > div', x: 0, y: 25, stagger: 0.1 }`,
        `{ id: '#faq-accordion > div', trigger: '#faq-accordion', x: 0, y: 25, stagger: 0.1 }`
      );
      console.log(`GSAP ScrollTrigger atualizado via substituição flexível em: ${filePath}`);
    } else {
      console.error(`Erro crítico: Não foi possível atualizar o ScrollTrigger de forma automatizada no arquivo: ${filePath}`);
    }
  }

  fs.writeFileSync(filePath, content, 'utf-8');
}

fixFile('public/template-oralfix/index.html');
fixFile('public/template-chiroandmovement/index.html');
console.log("=== Processamento Concluído ===");
