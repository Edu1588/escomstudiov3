import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { InteractiveTiltCard } from "./components/ui/tilt-card";

function PortfolioEduExtra() {
  return (
    <div style={{ width: "350px", height: "450px" }}>
      <InteractiveTiltCard
        image={{
          src: "https://eionstudio.com.br/wp-content/uploads/2026/02/about-slide-2.jpg",
          alt: "Edu Santos",
        }}
        tiltFactor={20}
        hoverScale={1.05}
        shadowIntensity={0.6}
        glareEffect={true}
        glareIntensity={0.4}
      />
    </div>
  );
}

const container = document.getElementById("tilt-card-root");
if (container) {
  createRoot(container).render(
    <StrictMode>
      <PortfolioEduExtra />
    </StrictMode>
  );
}
