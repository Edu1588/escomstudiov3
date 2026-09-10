import React, { useEffect, useRef } from 'react';

export default function PixelMapV2() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = 420);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 420;
    };

    window.addEventListener('resize', handleResize);

    // Grid of dots representing the World Map (Simplified Pixel Matrix)
    const cols = 70;
    const rows = 35;
    const cellW = width / cols;
    const cellH = height / rows;

    // Landmass approximation matrix (1 for land, 0 for ocean)
    // Simple pixel map grid
    const landPoints: { col: number; row: number }[] = [];
    
    // Generate continents pixel clusters
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = (c / cols) * 2 - 1; // -1 to 1
        const y = (r / rows) * 2 - 1; // -1 to 1

        // Americas
        if (x > -0.8 && x < -0.3 && y > -0.6 && y < 0.7) {
          if (Math.random() > 0.35) landPoints.push({ col: c, row: r });
        }
        // Europe & Africa
        else if (x > -0.15 && x < 0.25 && y > -0.7 && y < 0.6) {
          if (Math.random() > 0.35) landPoints.push({ col: c, row: r });
        }
        // Asia & Oceania
        else if (x > 0.25 && x < 0.85 && y > -0.65 && y < 0.7) {
          if (Math.random() > 0.4) landPoints.push({ col: c, row: r });
        }
      }
    }

    // Active HQ points (Campinas, São Paulo, Global)
    const hqPoints = [
      { c: 22, r: 24, label: 'CAMPINAS, SP [ HQ ]' },
      { c: 23, r: 25, label: 'SÃO PAULO [ SP ]' },
      { c: 32, r: 10, label: 'LISBOA [ EU ]' },
      { c: 18, r: 12, label: 'MIAMI [ US ]' },
    ];

    let pulse = 0;

    const render = () => {
      pulse += 0.05;
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);

      // Draw faint grid background lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let c = 0; c < cols; c += 5) {
        ctx.beginPath();
        ctx.moveTo(c * cellW, 0);
        ctx.lineTo(c * cellW, height);
        ctx.stroke();
      }
      for (let r = 0; r < rows; r += 5) {
        ctx.beginPath();
        ctx.moveTo(0, r * cellH);
        ctx.lineTo(width, r * cellH);
        ctx.stroke();
      }

      // Draw land pixels
      landPoints.forEach((p) => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fillRect(p.col * cellW + 1, p.row * cellH + 1, cellW - 2, cellH - 2);
      });

      // Draw HQ Pulsing Orange Dots
      hqPoints.forEach((hq) => {
        const px = hq.c * cellW;
        const py = hq.r * cellH;

        // Glowing circle
        const glowSize = (Math.sin(pulse) + 1.5) * 8;
        ctx.fillStyle = 'rgba(255, 79, 0, 0.25)';
        ctx.beginPath();
        ctx.arc(px, py, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.fillStyle = '#ff4f00';
        ctx.fillRect(px - cellW / 2, py - cellH / 2, cellW + 2, cellH + 2);

        // Label
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px monospace';
        ctx.fillText(hq.label, px + 10, py + 3);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section id="map" className="relative py-24 z-10 bg-[#050505] border-t border-white/15 w-full overflow-hidden flex flex-col justify-center">
      {/* Header matching Dragonfly screenshot 9 */}
      <div className="flex flex-col items-center justify-center text-center mb-8 px-4">
        <span className="text-[#ff4f00] font-mono text-3xl md:text-4xl font-bold tracking-widest mb-1">
          🌐
        </span>
        <h2 className="text-white font-mono text-2xl md:text-4xl font-bold tracking-[0.25em] uppercase">
          PRESENÇA GLOBAL
        </h2>
      </div>

      {/* Hairline SEC Bar */}
      <div className="w-full border-y border-white/15 py-3 px-4 sm:px-8 mb-8 flex justify-between items-center font-mono text-xs text-white/40 tracking-widest">
        <span>MAPA MUNDI PIXEL</span>
        <span>— COORDENADAS & HUB</span>
        <span>[ 22°54'S 47°03'W ]</span>
      </div>

      {/* Canvas Container */}
      <div className="w-full relative border-b border-white/15 bg-[#050505]">
        <canvas ref={canvasRef} className="w-full block" />
        
        {/* Corner coordinates overlay */}
        <div className="absolute top-4 left-6 font-mono text-[10px] text-white/40 tracking-widest">
          SYS.LAT: -22.9056 | SYS.LON: -47.0608
        </div>
        <div className="absolute bottom-4 right-6 font-mono text-[10px] text-[#ff4f00] font-bold tracking-widest">
          ● ONLINE: CAMPINAS & GLOBAL NETWORK
        </div>
      </div>
    </section>
  );
}
