/**
 * ESCOM STUDIO — V5 Sections Interactive Motion Engine
 * Controles de animação para:
 * 1. Métricas Odômetro ($50B+, 10M+, 50+)
 * 2. Processo ESCOM (Dot caindo com impacto 24px X-shift e rotação 90deg)
 * 3. Projetos em Destaque (Case Switcher interativo com scale e fade)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. ODÔMETRO NA SEÇÃO DE MÉTRICAS
  const metricsSection = document.getElementById('metricas-escom');
  if (metricsSection) {
    const rollers = metricsSection.querySelectorAll('[data-roller-inner]');
    let triggered = false;

    const targetDigits = [
      5, 0, // $ 5 0 B+
      1, 0, // 1 0 M+
      5, 0  // 5 0 +
    ];

    function runOdometers() {
      if (triggered || rollers.length === 0) return;
      triggered = true;

      rollers.forEach((r, idx) => {
        const digit = targetDigits[idx] !== undefined ? targetDigits[idx] : 0;
        const finalY = 10 + digit;
        r.style.transition = 'none';
        r.style.transform = 'translateY(0em)';

        setTimeout(() => {
          r.style.transition = `transform ${1.8 + idx * 0.15}s cubic-bezier(0.16, 1, 0.3, 1)`;
          r.style.transform = `translateY(-${finalY}em)`;
        }, 100);
      });
    }

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runOdometers();
        }
      });
    }, { threshold: 0.2 });
    obs.observe(metricsSection);
  }

  // 2. COMO OPERAMOS — DOT CAINDO COM IMPACTO E 24px X-SHIFT
  const processSection = document.getElementById('como-operamos');
  if (processSection) {
    const dot = document.getElementById('goodfella-falling-dot');
    const steps = Array.from(processSection.querySelectorAll('.step-item'));
    const foto = document.getElementById('como-operamos-foto');

    const photos = [
      'https://cdn.sanity.io/images/degpnzrx/production/728234c6dbc099bb9ffd7ab8160a443b7ed9b239-1600x2400.heif?w=1024&q=90&auto=format',
      'https://cdn.sanity.io/images/degpnzrx/production/8c7de2558b412dbf660620894a264bfc0a21dd46-1600x2400.heif?w=1024&q=90&auto=format',
      'https://cdn.sanity.io/images/degpnzrx/production/dacef92f30d8e3ebe3c32ed098eb878f39e133ef-1600x2400.heif?w=1024&q=90&auto=format',
      'https://cdn.sanity.io/images/degpnzrx/production/b370e4f512a2d26bb53dd93bc1d84b473ffcb988-2400x1600.heif?w=1024&q=90&auto=format'
    ];

    let currentStep = 0;

    function activateStep(idx) {
      if (idx < 0 || idx >= steps.length) return;
      currentStep = idx;

      const firstStep = steps[0];
      const activeEl = steps[idx];
      let targetY = 0;
      if (firstStep && activeEl) {
        targetY = activeEl.getBoundingClientRect().top - firstStep.getBoundingClientRect().top;
      }

      if (dot) {
        dot.style.transform = `translateY(${targetY}px) rotate(${90 * idx}deg)`;
      }

      steps.forEach((s, i) => {
        if (i === idx) {
          s.style.opacity = '1';
          s.style.transform = 'translateX(24px)';
        } else {
          s.style.opacity = '0.45';
          s.style.transform = 'translateX(0px)';
        }
      });

      if (foto && photos[idx]) {
        foto.style.opacity = '0.6';
        setTimeout(() => {
          foto.src = photos[idx];
          foto.style.opacity = '1';
        }, 150);
      }
    }

    steps.forEach((step, idx) => {
      step.addEventListener('click', () => activateStep(idx));
      step.addEventListener('mouseenter', () => activateStep(idx));
    });

    // Anima com scroll
    window.addEventListener('scroll', () => {
      const rect = processSection.getBoundingClientRect();
      const h = window.innerHeight;
      if (rect.top < h * 0.7 && rect.bottom > h * 0.3) {
        const total = rect.height;
        const current = h * 0.7 - rect.top;
        const progress = Math.min(1, Math.max(0, current / total));
        const stepIdx = Math.min(3, Math.floor(progress * 4));
        if (stepIdx !== currentStep) {
          activateStep(stepIdx);
        }
      }
    }, { passive: true });
  }

  // 3. PROJETOS EM DESTAQUE — TROCA DINÂMICA DE CASES
  const workSection = document.getElementById('projetos');
  if (workSection) {
    const triggers = Array.from(workSection.querySelectorAll('nav button, .flex-col > button, button[aria-label^="Go to"]'));
    const bigProjects = Array.from(workSection.querySelectorAll('.grid-span-8.grid-start-5 > .flex.flex-col, .grid-span-8 > .flex.flex-col'));

    triggers.forEach((trig, i) => {
      trig.addEventListener('click', (e) => {
        e.preventDefault();
        selectProject(i);
      });
      trig.addEventListener('mouseenter', () => {
        selectProject(i);
      });
    });

    function selectProject(index) {
      triggers.forEach((t, idx) => {
        const dot = t.querySelector('.bg-brand');
        const imgDiv = t.querySelector('.aspect-\\[16\\/9\\], .aspect-video');
        if (idx === index) {
          t.setAttribute('aria-current', 'true');
          if (imgDiv) imgDiv.style.opacity = '1';
          if (!dot) {
            const newDot = document.createElement('div');
            newDot.className = 'h-8 w-8 bg-brand';
            newDot.style.flexShrink = '0';
            t.appendChild(newDot);
          } else {
            dot.style.display = 'block';
          }
        } else {
          t.removeAttribute('aria-current');
          if (imgDiv) imgDiv.style.opacity = '0.4';
          if (dot) dot.style.display = 'none';
        }
      });

      if (bigProjects.length > index && bigProjects[index]) {
        bigProjects[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }
});
