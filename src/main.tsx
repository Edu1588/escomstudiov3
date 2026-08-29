import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import App from './App.tsx';
import './index.css';
import { BeamsBackground } from './components/ui/beams-background.tsx';
import { Starfield } from './components/ui/starfield-1.tsx';
import { MouseDistortion } from './components/ui/mouse-distortion.tsx';
import { CinematicHero } from './components/ui/cinematic-landing-hero.tsx';
import { RadarEffectDemo } from './components/ui/radar-effect-demo.tsx';
import { initHeroMarquee } from './components/ui/hero-marquee.tsx';
import { GLSLHills } from './components/ui/glsl-hills.tsx';
import { InfiniteRibbon } from './components/ui/infinite-ribbon.tsx';
import RobotBust3D from './components/RobotBust3D.tsx';
import ParticleSphere from './components/ParticleSphere.tsx';
import EscomLoadingScreen from './components/EscomLoadingScreen.tsx';
import GradualBlur from './components/GradualBlur.tsx';

// Prevent cyclic object value crashes from third party libs
const origStringify = JSON.stringify;
JSON.stringify = function(value, replacer, space) {
  try {
    return origStringify(value, replacer, space);
  } catch (err) {
    console.warn("Cyclic object value caught in JSON.stringify", err);
    return '"[Cyclic Object]"';
  }
};

// 1. ESCOM Preloader com ConveyorLoop e SVG Esticando
const dinoLoadingElement = document.getElementById('dino-loading-root');
if (dinoLoadingElement) {
  createRoot(dinoLoadingElement).render(
    <StrictMode>
      <EscomLoadingScreen />
    </StrictMode>,
  );
}

// 2. Gradual Blur nas bordas da página (Somente Fundo)

const gradualBlurBottomElement = document.getElementById('gradual-blur-bottom-root');
if (gradualBlurBottomElement) {
  createRoot(gradualBlurBottomElement).render(
    <StrictMode>
      <GradualBlur
        position="bottom"
        height="6rem"
        strength={2.5}
        divCount={6}
        curve="bezier"
        opacity={0.95}
        zIndex={40}
      />
    </StrictMode>,
  );
}

// 3. Main React App
const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
      <Analytics />
    </StrictMode>,
  );
}

// 4. Background & Decorative WebGL Elements
const beamsElement = document.getElementById('react-beams-root');
if (beamsElement) {
  createRoot(beamsElement).render(
    <StrictMode>
      <BeamsBackground />
    </StrictMode>,
  );
}

const ribbonElement = document.getElementById('react-ribbon-root');
if (ribbonElement) {
  createRoot(ribbonElement).render(
    <StrictMode>
      <div className="relative w-full h-[250px] flex items-center justify-center bg-transparent overflow-hidden">
        <InfiniteRibbon 
          duration={40} 
          rotation={-3}
          className="absolute bg-[#00d1ff] text-black border-none font-mono tracking-[0.2em] uppercase font-bold text-[3.5rem] py-4 drop-shadow-[0_0_15px_rgba(0,209,255,0.5)] z-10"
          repeat={10}
        >
          &nbsp; ESTRATÉGIA &nbsp;&bull;&nbsp; AUTOMAÇÃO &nbsp;&bull;&nbsp; RESULTADOS &nbsp;&bull;&nbsp; DESIGN &nbsp;&bull;&nbsp;
        </InfiniteRibbon>
        <InfiniteRibbon 
          duration={40} 
          reverse={true} 
          rotation={3}
          className="absolute bg-black text-[#00d1ff] border-y border-[#00d1ff]/30 font-mono tracking-[0.2em] uppercase font-bold text-[3.5rem] py-4 drop-shadow-[0_0_10px_rgba(0,209,255,0.3)] z-0"
          repeat={10}
        >
          &nbsp; ESTRATÉGIA &nbsp;&bull;&nbsp; AUTOMAÇÃO &nbsp;&bull;&nbsp; RESULTADOS &nbsp;&bull;&nbsp; DESIGN &nbsp;&bull;&nbsp;
        </InfiniteRibbon>
      </div>
    </StrictMode>,
  );
}

const contactCanvasElement = document.getElementById('contact-canvas-root');
if (contactCanvasElement) {
  createRoot(contactCanvasElement).render(
    <StrictMode>
      <Starfield mouseAdjust={true} starColor="#a3e635" bgColor="rgba(9, 9, 11, 1)" opacity={0.6} speed={1.5} />
    </StrictMode>,
  );
}

const cinematicHeroElement = document.getElementById('cinematic-hero-root');
if (cinematicHeroElement) {
  createRoot(cinematicHeroElement).render(
    <StrictMode>
      <CinematicHero />
    </StrictMode>,
  );
}

const mouseDistortionElement = document.getElementById('mouse-distortion-root');
if (mouseDistortionElement) {
  createRoot(mouseDistortionElement).render(
    <StrictMode>
      <MouseDistortion />
    </StrictMode>,
  );
}

const radarElement = document.getElementById('radar-root');
if (radarElement) {
  createRoot(radarElement).render(
    <StrictMode>
      <RadarEffectDemo />
    </StrictMode>,
  );
}

initHeroMarquee();

const statementHillsElement = document.getElementById('statement-glsl-hills-root');
if (statementHillsElement) {
  createRoot(statementHillsElement).render(
    <StrictMode>
      <GLSLHills width="100%" height="100%" color="#999999" />
    </StrictMode>,
  );
}

const robot3DHeroElement = document.getElementById('robot-3d-hero-root');
if (robot3DHeroElement) {
  createRoot(robot3DHeroElement).render(
    <StrictMode>
      <RobotBust3D />
    </StrictMode>,
  );
}

const globeHandsContactElement = document.getElementById('globe-hands-contact-root');
if (globeHandsContactElement) {
  createRoot(globeHandsContactElement).render(
    <StrictMode>
      <ParticleSphere
        particlesCount={9000}
        particleSize={2.2}
        speed={0.003}
        radius={88}
        repelStrength={28}
        repelRadius={60}
        sphereColor="#00d1ff"
      />
    </StrictMode>,
  );
}

// 5. Inicialização do Motor de Tradução i18n
import { initLanguage, setLanguage, SupportedLanguage } from './lib/i18n.ts';
initLanguage();
(window as any).setLanguage = setLanguage;

window.addEventListener('change-language', (e: any) => {
  if (e.detail && e.detail.lang) {
    setLanguage(e.detail.lang as SupportedLanguage);
  }
});

// 6. Controle do Menu Hambúrguer Mobile Fixo e Navegação Drawer
document.addEventListener('DOMContentLoaded', () => {
  const mobileToggleBtn = document.getElementById('mobile-menu-toggle-btn');
  const mobileDrawer = document.getElementById('mobile-menu-drawer');
  const iconOpen = document.getElementById('mobile-menu-icon-open');
  const iconClose = document.getElementById('mobile-menu-icon-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const mobileLangBtns = document.querySelectorAll('.mobile-lang-opt-btn');
  const mobileLangTrigger = document.getElementById('mobile-lang-btn');

  let isDrawerOpen = false;

  const toggleMobileMenu = (forceClose = false) => {
    if (forceClose) {
      isDrawerOpen = false;
    } else {
      isDrawerOpen = !isDrawerOpen;
    }

    if (mobileDrawer) {
      if (isDrawerOpen) {
        mobileDrawer.classList.remove('-translate-y-full', 'opacity-0', 'pointer-events-none');
        mobileDrawer.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');
        document.body.style.overflow = 'hidden';
      } else {
        mobileDrawer.classList.add('-translate-y-full', 'opacity-0', 'pointer-events-none');
        mobileDrawer.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
        document.body.style.overflow = '';
      }
    }

    if (iconOpen && iconClose) {
      if (isDrawerOpen) {
        iconOpen.classList.add('hidden');
        iconClose.classList.remove('hidden');
      } else {
        iconOpen.classList.remove('hidden');
        iconClose.classList.add('hidden');
      }
    }
  };

  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', () => toggleMobileMenu());
  }

  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      toggleMobileMenu(true);
    });
  });

  mobileLangBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetLang = btn.getAttribute('data-lang') as SupportedLanguage;
      if (targetLang) {
        setLanguage(targetLang);
      }
    });
  });

  // Botão de idioma do header mobile: cicla idiomas ou abre menu
  const supportedLangs: SupportedLanguage[] = ['pt', 'en', 'es', 'ch'];
  if (mobileLangTrigger) {
    mobileLangTrigger.addEventListener('click', () => {
      const currentLang = ((localStorage.getItem('escom_lang') as SupportedLanguage) || 'pt');
      const currentIndex = supportedLangs.indexOf(currentLang);
      const nextLang = supportedLangs[(currentIndex + 1) % supportedLangs.length];
      setLanguage(nextLang);
    });
  }
});
