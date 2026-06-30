import React from "react";
import { createRoot } from "react-dom/client";
import { TextMorph } from "./text-morph";

export function HeroMarquee() {
  return (
    <div id="hero-heading" className="font-jakarta text-4xl md:text-6xl lg:text-[4.5rem] leading-[0.95] tracking-tighter text-white font-black uppercase">
      REDUZA CUSTOS.<br/>
      <div className="flex items-center text-[#00d1ff]">
        <span className="mr-3 md:mr-5">OTIMIZE</span>
        <TextMorph
          words={["RESULTADOS.", "VELOCIDADE.", "TEMPO.", "GANHOS.", "CLIENTES."]}
          color="#00d1ff"
          className=""
        />
      </div>
    </div>
  );
}

export function initHeroMarquee() {
  const rootElement = document.getElementById("hero-heading-react-root");
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<HeroMarquee />);
  }
}
