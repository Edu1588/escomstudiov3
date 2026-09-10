import React, { useEffect, useRef } from 'react';

interface PixelArtCanvasProps {
  type: 'vortex' | 'structure' | 'sphere';
  className?: string;
}

export default function PixelArtCanvas({ type, className = '' }: PixelArtCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      time += 0.015;
      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);

      const cols = 120;
      const rows = 75;
      const cellW = width / cols;
      const cellH = height / rows;

      ctx.fillStyle = '#ffffff';

      if (type === 'vortex') {
        const cx = cols / 2;
        const cy = rows / 2;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const dx = c - cx;
            const dy = (r - cy) * 1.5;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);

            // Spiral wave
            const spiral = Math.sin(angle * 4 - dist * 0.2 + time);
            const noise = Math.sin(c * 0.15) * Math.cos(r * 0.15);
            const swirl = Math.sin(dist * 0.15 - angle * 2 + time * 0.8);

            let intensity = 0;
            if (dist < 32) {
              intensity = (spiral * 0.5 + swirl * 0.5 + noise * 0.3) * (1 - dist / 34);
            }

            // Scatter particles stream on left
            if (c < cols * 0.45) {
              const stream = Math.sin(c * 0.1 + r * 0.2 - time * 1.5);
              const stream2 = Math.cos(c * 0.05 - r * 0.1 + time);
              if (stream > 0.6 && stream2 > 0.3) {
                intensity += (stream - 0.6) * 1.8;
              }
            }

            if (intensity > 0.35) {
              const alpha = Math.min(1, (intensity - 0.35) * 2.2);
              ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(2)})`;
              const dotSize = Math.max(1, Math.floor(cellW * 0.85));
              ctx.fillRect(
                Math.floor(c * cellW),
                Math.floor(r * cellH),
                dotSize,
                dotSize
              );
            }
          }
        }
      } else if (type === 'structure') {
        // Architectural isometric stack of dot grids
        const cx = cols / 2;
        const cy = rows / 2;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const nx = (c - cx) / (cols * 0.4);
            const ny = (r - cy) / (rows * 0.4);

            // Layered isometric boxes
            let intensity = 0;

            // Stack levels
            const level1 = Math.abs(nx) < 0.6 && Math.abs(ny + 0.1) < 0.7;
            const level2 = Math.abs(nx) < 0.4 && Math.abs(ny - 0.05) < 0.5;
            const level3 = Math.abs(nx) < 0.2 && Math.abs(ny - 0.2) < 0.3;

            // Dotted wireframe patterns
            const gridPattern = (c % 2 === 0 && r % 2 === 0);
            const isoLines = Math.sin((c + r * 2) * 0.3 + time * 0.5) > 0.4;
            const crossHatch = Math.sin((c * 1.8 - r * 1.2) * 0.2) > 0.5;

            if (level1 && (gridPattern || isoLines)) {
              intensity += 0.4;
            }
            if (level2 && crossHatch) {
              intensity += 0.5;
            }
            if (level3 && (c % 3 === 0 || r % 3 === 0)) {
              intensity += 0.6;
            }

            // Central core glow
            const distCenter = Math.sqrt(nx * nx + ny * ny);
            if (distCenter < 0.25) {
              intensity += Math.sin(distCenter * 15 - time * 2) * 0.4;
            }

            if (intensity > 0.45) {
              const alpha = Math.min(1, (intensity - 0.45) * 2.5);
              ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(2)})`;
              const dotSize = Math.max(1, Math.floor(cellW * 0.85));
              ctx.fillRect(
                Math.floor(c * cellW),
                Math.floor(r * cellH),
                dotSize,
                dotSize
              );
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [type]);

  return (
    <canvas
      ref={canvasRef}
      width={480}
      height={300}
      className={`w-full h-full object-cover rounded-none select-none ${className}`}
    />
  );
}
