import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BeamsBackground } from './components/ui/beams-background.tsx';
import { Starfield } from './components/ui/starfield-1.tsx';
import { MouseDistortion } from './components/ui/mouse-distortion.tsx';

// Suppress framer-motion warning about Tailwind v4 oklch colors
const originalError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('oklch')) return;
  originalError(...args);
};
const originalWarn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('oklch')) return;
  originalWarn(...args);
};

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
  createRoot(cyberHeroElement).render(
    <StrictMode>
      <MouseDistortion />
    </StrictMode>,
  );
}


