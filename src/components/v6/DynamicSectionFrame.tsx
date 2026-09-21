import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function DynamicSectionFrame({
  children,
  tag,
  dark = false,
  className = "",
}: {
  children: React.ReactNode;
  tag?: string;
  dark?: boolean;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineTopRef = useRef<HTMLDivElement>(null);
  const lineBottomRef = useRef<HTMLDivElement>(null);
  const lineLeftRef = useRef<HTMLDivElement>(null);
  const lineRightRef = useRef<HTMLDivElement>(null);
  const starTlRef = useRef<HTMLDivElement>(null);
  const starTrRef = useRef<HTMLDivElement>(null);
  const starBlRef = useRef<HTMLDivElement>(null);
  const starBrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 85%",
          end: "top 30%",
          scrub: 0.8,
        },
      });

      tl.fromTo(lineTopRef.current, { top: "45%" }, { top: "4%", ease: "power2.out" }, 0);
      tl.fromTo(lineBottomRef.current, { bottom: "45%" }, { bottom: "4%", ease: "power2.out" }, 0);
      tl.fromTo(lineLeftRef.current, { left: "45%" }, { left: "4vw", ease: "power2.out" }, 0);
      tl.fromTo(lineRightRef.current, { right: "45%" }, { right: "4vw", ease: "power2.out" }, 0);

      tl.fromTo(starTlRef.current, { top: "45%", left: "45%", opacity: 0 }, { top: "4%", left: "4vw", opacity: 1, ease: "power2.out" }, 0);
      tl.fromTo(starTrRef.current, { top: "45%", right: "45%", opacity: 0 }, { top: "4%", right: "4vw", opacity: 1, ease: "power2.out" }, 0);
      tl.fromTo(starBlRef.current, { bottom: "45%", left: "45%", opacity: 0 }, { bottom: "4%", left: "4vw", opacity: 1, ease: "power2.out" }, 0);
      tl.fromTo(starBrRef.current, { bottom: "45%", right: "45%", opacity: 0 }, { bottom: "4%", right: "4vw", opacity: 1, ease: "power2.out" }, 0);
    }, container);

    return () => ctx.revert();
  }, []);

  const lineColor = dark ? "bg-white/15" : "bg-black/15";
  const starColor = dark ? "text-cyan/90" : "text-black/80";
  const tagColor = dark ? "text-white/60" : "text-black/60";

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Moldura Editorial com Linhas Dinâmicas e estrelas ✦ */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {tag && (
          <div className={`absolute top-[calc(4%-22px)] left-[4vw] font-mono text-[9px] uppercase tracking-[0.2em] ${tagColor} flex items-center gap-2`}>
            <div className="grid grid-cols-2 gap-[2px] opacity-70">
              <div className="size-1 bg-current" />
              <div className="size-1 bg-current" />
              <div className="size-1 bg-current" />
              <div className="size-1 bg-current" />
            </div>
            <span>-- {tag}</span>
          </div>
        )}
        <div ref={lineTopRef} className={`absolute inset-x-0 h-px ${lineColor}`} />
        <div ref={lineBottomRef} className={`absolute inset-x-0 h-px ${lineColor}`} />
        <div ref={lineLeftRef} className={`absolute inset-y-0 w-px ${lineColor}`} />
        <div ref={lineRightRef} className={`absolute inset-y-0 w-px ${lineColor}`} />

        <div ref={starTlRef} className={`absolute -translate-x-1/2 -translate-y-1/2 ${starColor} font-serif text-sm`}>✦</div>
        <div ref={starTrRef} className={`absolute translate-x-1/2 -translate-y-1/2 ${starColor} font-serif text-sm`}>✦</div>
        <div ref={starBlRef} className={`absolute -translate-x-1/2 translate-y-1/2 ${starColor} font-serif text-sm`}>✦</div>
        <div ref={starBrRef} className={`absolute translate-x-1/2 translate-y-1/2 ${starColor} font-serif text-sm`}>✦</div>
      </div>

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
