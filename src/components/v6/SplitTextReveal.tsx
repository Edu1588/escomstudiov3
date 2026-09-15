import React, { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import SplitType from "split-type";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SplitTextRevealProps {
  children: ReactNode;
  className?: string;
  type?: "chars" | "words" | "lines";
}

export function SplitTextReveal({ children, className, type = "words" }: SplitTextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // We only want to split text, not HTML elements.
    // Assuming children is a plain string for simplicity in this component.
    const split = new SplitType(containerRef.current, { types: type });

    gsap.fromTo(
      split[type] as HTMLElement[],
      {
        y: 50,
        opacity: 0,
        rotateX: -90,
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        stagger: 0.02,
        duration: 0.8,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 90%",
        },
      }
    );

    return () => {
      split.revert();
    };
  }, [type]);

  return (
    <div ref={containerRef} className={className} style={{ perspective: "400px" }}>
      {children}
    </div>
  );
}
