import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PixelTransitionCanvas } from "@/components/v6/PixelTransitionCanvas";
import { Check } from "lucide-react";
import { useLanguage } from "@/components/v6/LanguageContext";

export function AboutInsightsStage({
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
  const aboutRef = useRef<HTMLDivElement>(null);
  const insightsRef = useRef<HTMLDivElement>(null);
  const progress2Ref = useRef(0.0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const stage = stageRef.current;
    const screen = screenRef.current;
    const about = aboutRef.current;
    const insights = insightsRef.current;

    if (!stage || !screen || !about || !insights) return;

    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: "+=160%",
          pin: screen,
          pinSpacing: true,
          scrub: 0.7,
          anticipatePin: 1,
        },
      });

      // SOBRE já inicia visível e ativo em fundo preto contínuo com Projetos
      // Transição: SOBRE (Preto) -> INSIGHTS (Bege)
      tl.to(
        about,
        {
          opacity: 0,
          y: -24,
          duration: 0.35,
          ease: "power1.inOut",
          onComplete: () => {
            about.style.pointerEvents = "none";
          },
        },
        0.25
      );

      tl.fromTo(
        progress2Ref,
        { current: 0.0 },
        {
          current: 1.35,
          duration: 0.45,
          ease: "none",
        },
        0.25
      );

      const insightsChildren = Array.from(insights.children);
      tl.fromTo(
        insights,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.35,
          ease: "power2.out",
          onStart: () => {
            insights.style.pointerEvents = "auto";
          },
        },
        0.45
      );
      tl.fromTo(
        insightsChildren,
        {
          opacity: 0,
          filter: "blur(14px)",
          y: 18,
        },
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          duration: 0.40,
          stagger: 0.06,
          ease: "power2.out",
        },
        0.48
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
        {/* SOBRE A ESCOM (Fundo Preto #000000 Contínuo) */}
        <section
          id="sobre"
          ref={aboutRef}
          className="absolute inset-0 z-20 flex flex-col justify-center px-5 py-8 md:py-10 dark bg-[#000000] text-foreground md:px-12 xl:px-[22vw] opacity-100 pointer-events-auto"
        >
          {/* Eyebrow na cor azul do brand da ESCOM */}
          <Eyebrow cyan>{t.about.eyebrow}</Eyebrow>
          <div className="mt-6 md:mt-10 grid gap-6 md:gap-8 md:grid-cols-12">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-6xl lg:text-7xl leading-snug md:leading-tight font-light md:col-span-7">
              {t.about.title}
            </h2>
            <div className="space-y-4 md:space-y-5 text-xs sm:text-sm md:text-base leading-5 md:leading-7 text-muted-foreground md:col-span-4 md:col-start-9">
              <p>{t.about.p1}</p>
              <p>{t.about.p2}</p>
            </div>
          </div>
          <div className="mt-8 md:mt-14 grid border-t border-border/40 md:grid-cols-3">
            {t.about.principles.map((x, i) => (
              <div
                key={x}
                className="border-b border-border/30 py-3 md:py-4 font-mono text-[9px] md:text-[10px] uppercase tracking-[0.1em] text-muted-foreground md:border-r"
              >
                <span className="mr-3 text-cyan">0{i + 1}</span>
                <span className="text-foreground/90">{x}</span>
              </div>
            ))}
          </div>
        </section>

        {/* THREE.JS PIXEL SHADER BEGE (#ecece3) cobrindo Sobre (Preto) */}
        {mounted && (
          <div className="z-30 absolute inset-0 pointer-events-none">
            <PixelTransitionCanvas
              color="#ecece3"
              progressRef={progress2Ref}
              direction="center"
            />
          </div>
        )}

        {/* INSIGHTS / PARA QUEM É (Fundo Claro Bege #ecece3) */}
        <section
          id="insights"
          ref={insightsRef}
          className="absolute inset-0 z-40 flex flex-col justify-center px-5 py-8 md:py-10 text-[#000000] md:px-12 xl:px-[22vw] opacity-0 pointer-events-none bg-[#ecece3]"
        >
          <Eyebrow light>{t.insights.eyebrow}</Eyebrow>
          <div className="mt-6 md:mt-8 grid gap-6 md:gap-8 md:grid-cols-12">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-6xl lg:text-7xl leading-snug md:leading-tight font-light md:col-span-7 text-[#000000]">
              {t.insights.title}
            </h2>
            <div className="md:col-span-4 md:col-start-9">
              <p className="text-xs sm:text-sm md:text-base leading-5 md:leading-7 text-black/80">
                {t.insights.desc}
              </p>
              <ul className="mt-4 md:mt-6 space-y-2.5 md:space-y-3 text-xs md:text-sm">
                {t.insights.items.map((x) => (
                  <li
                    key={x}
                    className="flex items-center gap-3 border-t border-black/15 pt-2 text-black/90"
                  >
                    <Check className="size-3.5 md:size-4 shrink-0 text-[#008ba3]" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-6 md:mt-10 max-w-4xl font-serif text-base sm:text-xl md:text-3xl text-black">
            {t.insights.footerQuote}
          </p>
        </section>
      </div>
    </div>
  );
}
