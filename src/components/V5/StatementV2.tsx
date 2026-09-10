import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function StatementV2() {
  const containerRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLHeadingElement>(null);
  const line2Ref = useRef<HTMLHeadingElement>(null);
  const line3Ref = useRef<HTMLHeadingElement>(null);
  const line4Ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const lines = [line1Ref.current, line2Ref.current, line3Ref.current, line4Ref.current].filter(Boolean);

    if (lines.length > 0) {
      gsap.fromTo(
        lines,
        { opacity: 0, y: 80, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
            end: 'bottom 25%',
            toggleActions: 'play reverse play reverse',
          },
        }
      );
    }
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center py-20 px-4 z-10 bg-[#050505]/90 select-none overflow-hidden border-t border-white/15"
    >
      <div className="w-full flex flex-col items-center justify-center text-center">
        {/* Giant Dragonfly-Style Serif Display Typography (Screenshot 3 style) */}
        <div className="flex flex-col items-center justify-center space-y-[-0.15em] sm:space-y-[-0.2em] w-full">
          <h2
            ref={line1Ref}
            className="text-7xl sm:text-9xl md:text-[12rem] lg:text-[15rem] font-serif font-normal tracking-tight text-white leading-none uppercase mix-blend-difference"
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
          >
            FORJANDO
          </h2>

          <h2
            ref={line2Ref}
            className="text-7xl sm:text-9xl md:text-[12rem] lg:text-[15rem] font-serif font-normal tracking-tight text-[#ff4f00] leading-none uppercase mix-blend-difference"
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
          >
            MARCAS
          </h2>

          <h2
            ref={line3Ref}
            className="text-7xl sm:text-9xl md:text-[12rem] lg:text-[15rem] font-serif font-normal tracking-tight text-white/90 leading-none uppercase mix-blend-difference"
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
          >
            DESDE O
          </h2>

          <h2
            ref={line4Ref}
            className="text-7xl sm:text-9xl md:text-[12rem] lg:text-[15rem] font-serif font-normal tracking-tight text-white leading-none uppercase mix-blend-difference"
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
          >
            DIA 1
          </h2>
        </div>

        {/* Small Caption/Tagline */}
        <div className="mt-16 flex items-center gap-4 font-mono text-xs md:text-sm text-white/50 tracking-[0.3em] uppercase">
          <span className="w-8 h-[1px] bg-[#ff4f00]" />
          <span>FÁBRICA PUBLICIDADE & DIGITAL — CAMPINAS & SANTO ANTÔNIO</span>
          <span className="w-8 h-[1px] bg-[#ff4f00]" />
        </div>
      </div>
    </section>
  );
}

