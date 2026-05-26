import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BeamsBackground } from './components/ui/beams-background.tsx';
import { Starfield } from './components/ui/starfield-1.tsx';
import { MouseDistortion } from './components/ui/mouse-distortion.tsx';
import { CinematicHero } from './components/ui/cinematic-landing-hero.tsx';
import { RadarEffectDemo } from './components/ui/radar-effect-demo.tsx';
import { initHeroMarquee } from './components/ui/hero-marquee.tsx';
import { GLSLHills } from './components/ui/glsl-hills.tsx';

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

// Console warnings for oklch are expected with Tailwind v4 and framer-motion

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

const beamsElement = document.getElementById('react-beams-root');
if (beamsElement) {
  createRoot(beamsElement).render(
    <StrictMode>
      <BeamsBackground />
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

const cyberHeroElement = document.getElementById('cyber-hero-shader-root');
if (cyberHeroElement) {
}

const cinematicHeroElement = document.getElementById('cinematic-hero-root');
if (cinematicHeroElement) {
  createRoot(cinematicHeroElement).render(
    <StrictMode>
      <CinematicHero 
        brandName="Mobile"
        tagline1="Experiências Imersivas"
        tagline2="A qualquer momento."
        cardHeading="100% Otimizado para Mobile."
        cardDescription={<><span className="text-white font-semibold flex mb-2">Desempenho Sem Compromissos.</span> Desenvolvemos aplicações utilizando a arquitetura Mobile-First, garantindo velocidade incrível, fluidez e taxas de conversão superiores em qualquer dispositivo.</>}
        metricValue={100}
        metricLabel="Score Técnico"
      />
    </StrictMode>,
  );
}

const radarEffectElement = document.getElementById('radar-effect-root');
if (radarEffectElement) {
  createRoot(radarEffectElement).render(
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


