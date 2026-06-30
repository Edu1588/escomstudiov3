import { useEffect, useRef } from 'react';
import { getProject } from '@theatre/core';
import { Lock } from 'lucide-react';

export default function AnimatedLock({ size = 48 }: { size?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const proj = getProject('LockProject');
    const sheet = proj.sheet('LockSheet');
    const obj = sheet.object('Lock', {
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
      t += 0.03;
      if (containerRef.current) {
        const children = containerRef.current.children;
        const outerRing = children[0] as HTMLElement;
        const innerRing = children[1] as HTMLElement;
        const lockIcon = children[2] as HTMLElement;

        // Floating for lock
        const lockY = Math.sin(t * 3) * -2;
        lockIcon.style.transform = `translateY(${lockY}px)`;
        
        // No glow effect
        // lockIcon.style.filter = `drop-shadow(0 0 ${8 + glowPulse}px rgba(0,209,255,0.8))`;

        // Ring rotations (futuristic scanning rings)
        outerRing.style.transform = `rotate(${t * 30}deg) scale(1.4)`;
        outerRing.style.opacity = (0.2 + Math.sin(t * 2) * 0.1).toString();

        innerRing.style.transform = `rotate(${-t * 50}deg) scale(1.15)`;
        innerRing.style.opacity = (0.4 + Math.cos(t * 3) * 0.2).toString();
        // innerRing.style.filter = 'drop-shadow(0 0 4px rgba(0,209,255,0.6))';
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
      {/* Outer Dashed Ring */}
      <div className="absolute w-full h-full border border-dashed border-[#00d1ff] rounded-full pointer-events-none" />
      {/* Inner Scanning Ring */}
      <div className="absolute w-full h-full border-2 border-t-[#00d1ff] border-r-transparent border-b-[#00d1ff] border-l-transparent rounded-full pointer-events-none" />
      {/* Lock Icon */}
      <div className="absolute">
        <Lock size={size * 0.7} strokeWidth={2.5} />
      </div>
    </div>
  );
}
