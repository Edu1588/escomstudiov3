import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
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
      <Analytics />
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


