import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function HeroV2() {
  const textRef = useRef<HTMLHeadingElement>(null);
  
  const text = "FABRICA";
  const chars = text.split("");

  useEffect(() => {
    if (textRef.current) {
      gsap.fromTo(textRef.current.children, 
        { 
          opacity: 0, 
          filter: "blur(15px)",
          scale: 1.1,
          y: 30
        },
        {
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          y: 0,
          duration: 1.6,
          stagger: 0.08,
          ease: 'power3.out',
          delay: 0.2
        }
      );
    }
  }, []);

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Corner crosshairs like Dragonfly screenshot 1 */}
      <div className="absolute top-8 left-8 text-white/30 text-xs font-mono z-20 select-none">+</div>
      <div className="absolute top-8 right-8 text-white/30 text-xs font-mono z-20 select-none">+</div>
      <div className="absolute bottom-8 left-8 text-white/30 text-xs font-mono z-20 select-none">+</div>
      <div className="absolute bottom-8 right-8 text-white/30 text-xs font-mono z-20 select-none">+</div>

      {/* Hero ONLY giant centered name FABRICA */}
      <div className="relative z-20 px-4 w-full flex items-center justify-center text-center">
        <h1 
          ref={textRef}
          className="text-7xl sm:text-9xl md:text-[14rem] lg:text-[18rem] font-black tracking-tighter text-[#ff4f00] leading-none select-none uppercase"
          style={{ 
            fontFamily: "'Saira Extra Condensed', 'Barlow Condensed', 'Syne', 'Montserrat', sans-serif", 
            textShadow: '0 0 60px rgba(255,79,0,0.35)',
            letterSpacing: '-0.04em'
          }}
        >
          {chars.map((char, index) => (
            <span key={index} className="inline-block opacity-0">
              {char}
            </span>
          ))}
        </h1>
      </div>
    </section>
  );
}



