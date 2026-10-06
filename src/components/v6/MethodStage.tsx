import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PixelTransitionCanvas } from "@/components/v6/PixelTransitionCanvas";
import { useLanguage } from "@/components/v6/LanguageContext";
import { InteractiveBlurTitle } from "@/components/v6/InteractiveBlurTitle";

export function MethodStage({
  Eyebrow,
}: {
  Eyebrow: React.ComponentType<{
    children: React.ReactNode;
    light?: boolean;
    cyan?: boolean;
  }>;
}) {
  const { t } = useLanguage();
  const stageRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0.0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const stage = stageRef.current;
    const screen = screenRef.current;
    const content = contentRef.current;

    if (!stage || !screen || !content) return;

    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: "+=100%",
          pin: screen,
          pinSpacing: true,
          scrub: 0.7,
          anticipatePin: 1,
        },
      });

      // 1. Micro-pixels claros crescem sobre a tela imediatamente
      tl.fromTo(
        progressRef,
        { current: 0.0 },
        {
          current: 1.35,
          duration: 0.45,
          ease: "none",
        },
        0.0
      );

      // 2. Revela Método e fundo bege suavemente desde o início do scroll
      tl.fromTo(
        content,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.25,
          ease: "power2.out",
          onStart: () => {
            content.style.pointerEvents = "auto";
          },
        },
        0.05
      );

      // 3. Linhas dinâmicas que se expandem com a rolagem (Referência The Model)
      tl.fromTo(".method-line-top", { top: "45%" }, { top: "10%", duration: 0.30, ease: "power2.out" }, 0.10);
      tl.fromTo(".method-line-bottom", { bottom: "45%" }, { bottom: "10%", duration: 0.30, ease: "power2.out" }, 0.10);
      tl.fromTo(".method-line-left", { left: "45%" }, { left: "8vw", duration: 0.30, ease: "power2.out" }, 0.10);
      tl.fromTo(".method-line-right", { right: "45%" }, { right: "8vw", duration: 0.30, ease: "power2.out" }, 0.10);

      tl.fromTo(".method-star-tl", { top: "45%", left: "45%", opacity: 0 }, { top: "10%", left: "8vw", opacity: 1, duration: 0.30, ease: "power2.out" }, 0.10);
      tl.fromTo(".method-star-tr", { top: "45%", right: "45%", opacity: 0 }, { top: "10%", right: "8vw", opacity: 1, duration: 0.30, ease: "power2.out" }, 0.10);
      tl.fromTo(".method-star-bl", { bottom: "45%", left: "45%", opacity: 0 }, { bottom: "10%", left: "8vw", opacity: 1, duration: 0.30, ease: "power2.out" }, 0.10);
      tl.fromTo(".method-star-br", { bottom: "45%", right: "45%", opacity: 0 }, { bottom: "10%", right: "8vw", opacity: 1, duration: 0.30, ease: "power2.out" }, 0.10);

      tl.fromTo(".method-tag", { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.18, ease: "power2.out" }, 0.15);

      // 4. Elementos de texto ganham nitidez
      const children = Array.from(content.children);
      tl.fromTo(
        children,
        {
          opacity: 0,
          filter: "blur(10px)",
          y: 16,
        },
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          duration: 0.28,
          stagger: 0.04,
          ease: "power2.out",
        },
        0.12
      );
    }, stage);

    return () => {
      ctx.revert();
    };
  }, [mounted]);

  return (
    <div ref={stageRef} className="relative w-full">
      <div
        ref={screenRef}
        className="relative h-screen w-full overflow-hidden bg-[#000000]"
      >
        {/* THREE.JS PIXEL SHADER BEGE (#ecece3) - BOTTOM-UP (ÚNICA SEÇÃO DE BAIXO PARA CIMA) */}
        {mounted && (
          <div className="z-10 absolute inset-0 pointer-events-none">
            <PixelTransitionCanvas
              color="#ecece3"
              progressRef={progressRef}
              direction="bottom-up"
            />
          </div>
        )}

        {/* MÉTODO (Fundo Claro Bege #ecece3 com Linhas Dinâmicas) */}
        <section
          id="metodo"
          ref={contentRef}
          className="absolute inset-0 z-20 flex flex-col justify-center px-5 py-8 md:py-12 text-[#000000] md:px-12 xl:px-[22vw] opacity-0 pointer-events-none bg-[#ecece3] overflow-hidden"
        >
          {/* Grade de Linhas Dinâmicas com nós ✦ (Referência The Model) */}
          <div className="method-grid-frame absolute inset-0 pointer-events-none z-0">
            <div className="method-tag absolute top-[calc(10%-26px)] left-[8vw] font-mono text-[9px] uppercase tracking-[0.2em] text-black/60 flex items-center gap-2">
              <div className="grid grid-cols-2 gap-[2px] opacity-70">
                <div className="size-1 bg-current" />
                <div className="size-1 bg-current" />
                <div className="size-1 bg-current" />
                <div className="size-1 bg-current" />
              </div>
              <span>-- {t.method.tag}</span>
            </div>

            <div className="method-line-top absolute inset-x-0 h-px bg-black/15" />
            <div className="method-line-bottom absolute inset-x-0 h-px bg-black/15" />
            <div className="method-line-left absolute inset-y-0 w-px bg-black/15" />
            <div className="method-line-right absolute inset-y-0 w-px bg-black/15" />

            <div className="method-star-tl absolute -translate-x-1/2 -translate-y-1/2 text-black/80 font-serif text-sm">✦</div>
            <div className="method-star-tr absolute translate-x-1/2 -translate-y-1/2 text-black/80 font-serif text-sm">✦</div>
            <div className="method-star-bl absolute -translate-x-1/2 translate-y-1/2 text-black/80 font-serif text-sm">✦</div>
            <div className="method-star-br absolute translate-x-1/2 translate-y-1/2 text-black/80 font-serif text-sm">✦</div>
          </div>

          <div className="relative z-10">
          <Eyebrow light>{t.method.eyebrow}</Eyebrow>
          <InteractiveBlurTitle
            as="h2"
            className="mt-6 md:mt-10 max-w-5xl font-serif text-2xl sm:text-3xl md:text-6xl lg:text-7xl leading-[1.1] md:leading-[1.05] font-light text-[#000000]"
          >
            {t.method.title}
          </InteractiveBlurTitle>
          <div className="mt-6 md:mt-12 grid gap-6 md:gap-12 md:grid-cols-12">
            <p className="text-xs sm:text-sm md:text-lg leading-5 md:leading-8 md:col-span-5 text-black/80">
              {t.method.desc}
            </p>
            <div className="md:col-span-6 md:col-start-7">
              {t.method.steps.map((x, i) => (
                <div
                  key={x}
                  className="flex gap-4 md:gap-5 border-t border-black/15 py-3 md:py-4"
                >
                  <span className="font-mono text-[9px] md:text-[10px] text-black/60">
                    0{i + 1}
                  </span>
                  <p className="font-serif text-base sm:text-lg md:text-2xl text-black">
                    {x}
                  </p>
                </div>
              ))}
            </div>
          </div>
          </div>
        </section>
      </div>
    </div>
  );
}
