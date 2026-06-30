import { useEffect, useRef } from 'react';
import { getProject } from '@theatre/core';
import { TrendingUp } from 'lucide-react';

export default function AnimatedGraph({ size = 48 }: { size?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const proj = getProject('GraphProject');
    const sheet = proj.sheet('GraphSheet');
    const obj = sheet.object('Graph', {
      progress: 0,
    });

    let frameId: number;
    let t = 0;

    let isVisible = true;
    const observer = new IntersectionObserver((entries) => {
        isVisible = entries[0].isIntersecting;
    }, { threshold: 0 });
    if (containerRef.current) observer.observe(containerRef.current);

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (!isVisible) return;
      t += 0.04;
      if (containerRef.current) {
        const children = containerRef.current.children;
        const dot1 = children[0] as HTMLElement;
        const dot2 = children[1] as HTMLElement;
        const graphIcon = children[2] as HTMLElement;

        // Animated draw effect using clip loop
        const drawPercent = ((Math.sin(t * 0.8) + 1) / 2) * 100; 
        graphIcon.style.clipPath = `polygon(0 0, ${drawPercent}% 0, ${drawPercent}% 100%, 0 100%)`;
        // graphIcon.style.filter = `drop-shadow(0 0 6px rgba(0,209,255,0.8))`;

        // Floating glowing data point 1
        const yBase1 = Math.sin(t * 1.5) * 4;
        dot1.style.transform = `translate(-${size * 0.25}px, ${yBase1 - size * 0.1}px) scale(${1 + Math.sin(t * 3) * 0.5})`;
        dot1.style.opacity = (Math.sin(t * 3) * 0.5 + 0.5).toString();

        // Floating glowing data point 2
        const yBase2 = Math.cos(t * 1.8) * 4;
        dot2.style.transform = `translate(${size * 0.3}px, ${yBase2 - size * 0.3}px) scale(${1 + Math.cos(t * 4) * 0.5})`;
        dot2.style.opacity = (Math.cos(t * 4) * 0.5 + 0.5).toString();
      }
      frameId = requestAnimationFrame(animate);
    };

    animate();

    const unsubscribe = obj.onValuesChange((values) => {
      if (values.progress !== 0) {
        // custom timeline overrides
      }
    });

    return () => {
      observer.disconnect();
      unsubscribe();
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative text-[#00d1ff] origin-center flex items-center justify-center no-global-anim" style={{ width: size, height: size }}>
      {/* Floating data particles */}
      <div className="absolute w-[6px] h-[6px] bg-[#00d1ff] rounded-full" />
      <div className="absolute w-[4px] h-[4px] bg-[#00d1ff] rounded-full" />
      {/* Graph Icon */}
      <div className="absolute overflow-hidden">
        <TrendingUp size={size} strokeWidth={2.5} />
      </div>
    </div>
  );
}
