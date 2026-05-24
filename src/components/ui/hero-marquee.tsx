import React from "react";
import { createRoot } from "react-dom/client";
import { TextMarquee } from "./text-marquee";

export function HeroMarquee() {
  return (
    <h1 id="hero-heading" className="font-jakarta text-4xl md:text-6xl lg:text-[4.5rem] leading-[0.95] tracking-tighter text-white font-black uppercase">
      REDUZA CUSTOS.<br/>
      <div className="flex items-center text-[#2EFF00]">
        <TextMarquee
          prefix={<span className="mr-3 md:mr-5">OTIMIZE</span>}
          height={90}
          speed={1.5}
          className="h-[60px] md:h-[80px] lg:h-[100px]"
        >
          <span>RESULTADOS.</span>
          <span>VELOCIDADE.</span>
          <span>TEMPO.</span>
          <span>GANHOS.</span>
          <span>CLIENTES.</span>
        </TextMarquee>
      </div>
    </h1>
  );
}

export function initHeroMarquee() {
  const rootElement = document.getElementById("hero-heading-react-root");
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<HeroMarquee />);
  }
}
