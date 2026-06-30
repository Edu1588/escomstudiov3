import { useEffect, useRef } from 'react';
import { getProject } from '@theatre/core';
import { Zap } from 'lucide-react';

export default function AnimatedZap({ size = 48 }: { size?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Keep Theatre JS integration for potential Studio overrides
    const proj = getProject('ZapProject');
    const sheet = proj.sheet('ZapSheet');
    const zapObj = sheet.object('Lightning', {
      progress: 0,
      intensity: 1,
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
      t += 0.05;
      if (containerRef.current) {
        const layers = containerRef.current.children;
        const glow1 = layers[0] as HTMLElement;
        const glow2 = layers[1] as HTMLElement;
        const mainZap = layers[2] as HTMLElement;

        // Floating up and down
        const y = Math.sin(t * 2) * -3;
        
        // Zapping effect (random flashes)
        const isFlashing = Math.random() > 0.92;
        const flash = isFlashing ? 1.4 : 1;
        const pulse = (Math.sin(t * 10) + 1) / 2;
        const baseScale = 1 + pulse * 0.05;

        // Main icon animation
        mainZap.style.transform = `translateY(${y}px) scale(${baseScale * flash})`;
        // mainZap.style.filter = `drop-shadow(0 0 ${12 * flash}px rgba(0,209,255,0.9))`;
        
        // Cyan glitch echo
        glow1.style.transform = `translateY(${y + Math.cos(t * 5) * 2}px) translateX(${Math.sin(t * 6) * 2}px) scale(${baseScale})`;
        glow1.style.opacity = (isFlashing ? 0.8 : 0.2).toString();
        glow1.style.color = '#00ffcc';
        // glow1.style.filter = 'blur(1px)';

        // Yellow glitch echo
        glow2.style.transform = `translateY(${y + Math.sin(t * 7) * -2}px) translateX(${Math.cos(t * 4) * 2}px) scale(${baseScale})`;
        glow2.style.opacity = (isFlashing ? 0.8 : 0.2).toString();
        glow2.style.color = '#ccff00';
        // glow2.style.filter = 'blur(1px)';
      }
      frameId = requestAnimationFrame(animate);
    };
    
    animate();

    const unsubscribe = zapObj.onValuesChange((values) => {
      // Allow Studio override if values change
      if (values.progress !== 0) {
        // custom mapping
      }
    });

    return () => {
      observer.disconnect();
      unsubscribe();
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative flex items-center justify-center text-[#00d1ff] no-global-anim" style={{ width: size, height: size }}>
       <Zap size={size} strokeWidth={2} className="absolute transition-colors duration-75" />
       <Zap size={size} strokeWidth={2} className="absolute transition-colors duration-75" />
       <Zap size={size} strokeWidth={2} className="absolute z-10 transition-transform duration-75" />
    </div>
  );
}
