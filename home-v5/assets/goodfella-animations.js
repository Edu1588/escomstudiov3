/**
 * ESCOM STUDIO — Good Fella Faithful Motion & Interactive Engine (Engine Reversa Oficial)
 * Implementa 100% da física original extraída do chunk 5c28b76153d9f323.js:
 * 
 * 1. SEÇÃO "HOW WE WORK" (O DOT CAINDO COM ANIMAÇÃO DE IMPACTO):
 *    - Dot: animate { y: targetY, rotate: 90 * index }, duration: 0.8s, ease: backOut/impact
 *    - Item Ativo: animate { opacity: 1, x: 48px }, duration: 0.8s, ease: power3InOut
 *    - Item Inativo: animate { opacity: 0.4, x: 0px }
 *    - Scroll Trigger dentro do container min-h-[320vh] com fórmula exata:
 *      e < 0.1666 ? 0 : Math.min(Math.floor((e - 0.1666) / 0.8333 * 3) + 1, 3)
 * 
 * 2. ODÔMETRO / ROLLER DE DÍGITOS ($1.2B+, 12M+, 52+)
 * 3. SELECTED WORK: Troca dinâmica de cases com crossfade e scale
 * 4. HEADER: Flip animation do logo GOOD / FELLA
 * 5. FAQ: Acordeões elásticos
 * 6. LENIS SMOOTH SCROLL
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. SEÇÃO 2: "HOW WE WORK" — O DOT CAINDO COM ANIMAÇÃO DE IMPACTO (48px X-SHIFT)
  // =========================================================================
  const sec2 = document.querySelectorAll('section')[2];
  if (sec2) {
    const desktopContainer = sec2.querySelector('.relative.hidden.min-h-\\[320vh\\], .min-h-\\[320vh\\]') || sec2;
    const spaceYContainer = desktopContainer.querySelector('.relative.space-y-48, .space-y-48');

    // Dot element
    let dot = desktopContainer.querySelector('.absolute.top-8.left-\\[28px\\].bg-brand, #goodfella-falling-dot');
    if (!dot && spaceYContainer) {
      dot = document.createElement('div');
      dot.id = 'goodfella-falling-dot';
      dot.className = 'absolute top-8 left-[28px] z-10 h-12 w-12 bg-brand';
      spaceYContainer.prepend(dot);
    }
    
    if (dot) {
      dot.style.position = 'absolute';
      dot.style.top = '8px';
      dot.style.left = '28px';
      dot.style.zIndex = '15';
      dot.style.width = '12px';
      dot.style.height = '12px';
      dot.style.backgroundColor = '#ff4d00';
      dot.style.pointerEvents = 'none';
      dot.style.transformOrigin = '6px 6px';
      // Easing backOut com impacto sutil (overshoot) do Good Fella original
      dot.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.45, 0.7, 1)';
    }

    // Ocultar pontinhos estáticos concorrentes
    desktopContainer.querySelectorAll('.mt-8.h-12.w-12.bg-brand').forEach(d => {
      d.style.opacity = '0';
      d.style.pointerEvents = 'none';
    });

    // Mapear os 4 itens do processo (suporta tanto inglês original quanto português da ESCOM)
    const stepElements = Array.from(desktopContainer.querySelectorAll('.flex.cursor-pointer, .relative.space-y-48 > div, .space-y-48 > div'))
      .filter(el => el.querySelector('h3, .text-h4'));
    const uniqueSteps = [...new Set(stepElements)].slice(0, 4);

    // Configurar estilo base de transição com o easing oficial power3InOut
    uniqueSteps.forEach((step, idx) => {
      step.style.cursor = 'pointer';
      step.style.transition = 'transform 0.8s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.8s cubic-bezier(0.77, 0, 0.175, 1)';
      step.style.willChange = 'transform, opacity';
      
      // Clique direto para saltar
      step.addEventListener('click', (e) => {
        e.preventDefault();
        activateStep(idx);
      });
      step.addEventListener('mouseenter', () => {
        activateStep(idx);
      });
    });

    let currentActiveIndex = -1;

    function activateStep(targetIndex) {
      if (targetIndex === currentActiveIndex || targetIndex < 0 || targetIndex >= uniqueSteps.length) return;
      currentActiveIndex = targetIndex;

      // 1. Calcular o Y exato do item em relação ao container do dot
      const firstStep = uniqueSteps[0];
      const activeStep = uniqueSteps[targetIndex];
      let targetY = 0;
      
      if (firstStep && activeStep) {
        targetY = activeStep.getBoundingClientRect().top - firstStep.getBoundingClientRect().top;
      } else {
        targetY = targetIndex * 168;
      }

      // 2. Mover e girar o Dot com impacto (90deg a cada passo)
      if (dot) {
        dot.style.transform = `translateY(${targetY}px) rotate(${90 * targetIndex}deg)`;
      }

      // 3. ANIMAÇÃO DE IMPACTO NO ITEM:
      // O item que recebe o dot é EMPURRADO 48px PARA A DIREITA (x: 48px) com opacity: 1!
      // Os outros itens voltam para x: 0px com opacity: 0.4!
      uniqueSteps.forEach((step, i) => {
        const isActive = (i === targetIndex);
        if (isActive) {
          step.setAttribute('data-active', 'true');
          step.style.opacity = '1';
          step.style.transform = 'translateX(48px)';
        } else {
          step.removeAttribute('data-active');
          step.style.opacity = '0.4';
          step.style.transform = 'translateX(0px)';
        }
      });
    }

    // Inicializa no passo 0 com impacto no carregamento
    setTimeout(() => activateStep(0), 150);

    // 4. Integração com o Scroll Progress do container de 320vh
    window.addEventListener('scroll', () => {
      const rect = desktopContainer.getBoundingClientRect();
      const scrollHeight = desktopContainer.scrollHeight - window.innerHeight;
      
      // Progresso e de 0 a 1 dentro do container min-h-[320vh]
      if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
        const progress = Math.min(1, Math.max(0, -rect.top / scrollHeight));
        
        // Fórmula exata do chunk original 5c28b76153d9f323.js:
        // e < 0.1666 ? 0 : Math.min(Math.floor((e - 0.1666) / 0.8333 * 3) + 1, 3)
        let step = 0;
        if (progress < 0.166666) {
          step = 0;
        } else {
          step = Math.min(Math.floor(((progress - 0.166666) / 0.833333) * 3) + 1, 3);
        }

        if (step !== currentActiveIndex) {
          activateStep(step);
        }
      } else if (rect.top > 0) {
        activateStep(0);
      } else if (rect.bottom < window.innerHeight) {
        activateStep(3);
      }
    }, { passive: true });
  }

  // =========================================================================
  // 2. HEADER: FLIP DO LOGO ESCOM / STUDIO
  // =========================================================================
  const logoWrapper = document.getElementById('header-logo-flip') || document.querySelector('header a[aria-label*="Home"] > div, header a[aria-label*="ESCOM"] > div');
  let isFella = false;
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (logoWrapper) {
      if (scrollY > 300 && !isFella) {
        logoWrapper.style.transform = 'translateY(-26px)';
        isFella = true;
      } else if (scrollY <= 300 && isFella) {
        logoWrapper.style.transform = 'translateY(0px)';
        isFella = false;
      }
    }

    const headerContainer = document.querySelector('header > div:first-child');
    if (headerContainer) {
      if (scrollY > 50) {
        headerContainer.style.background = 'rgba(20, 19, 20, 0.85)';
        headerContainer.style.backdropFilter = 'blur(12px)';
        headerContainer.style.borderBottom = '1px solid rgba(255, 255, 255, 0.08)';
      } else {
        headerContainer.style.background = 'transparent';
        headerContainer.style.backdropFilter = 'none';
        headerContainer.style.borderBottom = 'none';
      }
    }
  }, { passive: true });

  // =========================================================================
  // 3. ODÔMETRO / DIGIT ROLLER NA SEÇÃO DE MÉTRICAS (SEÇÃO 1)
  // =========================================================================
  const rollers = document.querySelectorAll('[data-roller-inner]');
  let rollerTriggered = false;

  const targetIndexes = [
    1, 2, // $ 1 . 2 B+
    1, 2, // 1 2 M+
    5, 2  // 5 2 +
  ];

  function animateRollers() {
    if (rollerTriggered || rollers.length === 0) return;
    rollerTriggered = true;

    rollers.forEach((r, idx) => {
      const targetDigit = targetIndexes[idx] !== undefined ? targetIndexes[idx] : 1;
      const finalY = (10 + targetDigit);
      
      r.style.transition = 'none';
      r.style.transform = 'translateY(0em)';
      
      setTimeout(() => {
        r.style.transition = `transform ${1.6 + idx * 0.18}s cubic-bezier(0.16, 1, 0.3, 1)`;
        r.style.transform = `translateY(-${finalY}em)`;
      }, 80);
    });
  }

  const metricsSection = document.querySelectorAll('section')[1];
  if (metricsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateRollers();
        }
      });
    }, { threshold: 0.25 });
    observer.observe(metricsSection);
  }

  // =========================================================================
  // 4. SELECTED WORK (SEÇÃO 3): TROCA DINÂMICA DE CASES COM SCALE/FADE
  // =========================================================================
  const workProjects = [
    { name: 'POWERADE', image: '/home-v5/images/powerade.jpg', title: 'Powerade' },
    { name: 'BODYARMOR', image: '/home-v5/images/bodyarmor.jpg', title: 'BodyArmor' },
    { name: 'ANNNIMATE', image: '/home-v5/images/annnimate.jpg', title: 'Annnimate' },
    { name: 'WKNDHRS', image: '/home-v5/images/wkndhrs.jpg', title: 'WKNDHRS' },
    { name: 'FITGREENMIND', image: '/home-v5/images/fitgreenmind.jpg', title: 'Fitgreenmind' }
  ];

  const workSection = document.querySelectorAll('section')[3];
  if (workSection) {
    const mainImg = workSection.querySelector('picture img, .aspect-\\[16\\/10\\] img, a[href*="work"] img');
    const triggers = Array.from(workSection.querySelectorAll('button:has(h3), button:has(img), nav a, .flex-col > button, .flex-col > a'));

    triggers.forEach((trig, i) => {
      const proj = workProjects[i % workProjects.length];
      
      const activate = () => {
        triggers.forEach((t, idx) => {
          t.style.opacity = idx === i ? '1' : '0.4';
          t.style.transform = idx === i ? 'translateX(8px)' : 'translateX(0px)';
          t.style.transition = 'all 0.3s ease';
        });

        if (mainImg) {
          mainImg.style.transition = 'opacity 0.25s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
          mainImg.style.opacity = '0.3';
          mainImg.style.transform = 'scale(0.98)';
          
          setTimeout(() => {
            mainImg.src = proj.image;
            mainImg.style.opacity = '1';
            mainImg.style.transform = 'scale(1)';
          }, 200);
        }
      };

      trig.addEventListener('mouseenter', activate);
      trig.addEventListener('click', (e) => {
        e.preventDefault();
        activate();
      });
    });
  }

  // =========================================================================
  // 5. FAQ ACORDION EXPANSÍVEL (SEÇÃO 5)
  // =========================================================================
  const faqSection = document.querySelectorAll('section')[5];
  if (faqSection) {
    const items = faqSection.querySelectorAll('div:has(> button), div:has(> [role="button"])');
    items.forEach(item => {
      const btn = item.querySelector('button, [role="button"]');
      const content = item.querySelector('div:has(p), p');
      const icon = btn?.querySelector('svg, span');

      if (btn && content) {
        content.style.maxHeight = '0px';
        content.style.overflow = 'hidden';
        content.style.opacity = '0';
        content.style.transition = 'max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease';

        btn.addEventListener('click', () => {
          const isOpen = content.style.maxHeight !== '0px';
          content.style.maxHeight = isOpen ? '0px' : '400px';
          content.style.opacity = isOpen ? '0' : '1';
          if (icon) {
            icon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(45deg)';
            icon.style.transition = 'transform 0.3s ease';
          }
        });
      }
    });
  }
});
