import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitTextReveal } from "@/components/v6/SplitTextReveal";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { RobozitoSequenceBackground } from "@/components/v6/RobozitoSequenceBackground";
import { PixelTransitionCanvas } from "@/components/v6/PixelTransitionCanvas";
import { LoadingCurtain } from "@/components/v6/LoadingCurtain";
import { useLanguage } from "@/components/v6/LanguageContext";
import { InteractiveBlurTitle } from "@/components/v6/InteractiveBlurTitle";

export function HeroManifestoStage({
  Eyebrow,
  AnchorButton,
}: {
  Eyebrow: React.ComponentType<{
    children: React.ReactNode;
    light?: boolean;
    cyan?: boolean;
  }>;
  AnchorButton: React.ComponentType<{
    children: React.ReactNode;
    outline?: boolean;
    className?: string;
  }>;
}) {
  const { t } = useLanguage();
  const stageRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const manifestoRef = useRef<HTMLDivElement>(null);
  const solutionsIntroRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const pixelProgressRef = useRef(0.0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [curtainsOpen, setCurtainsOpen] = useState(false);
  const [heroRevealed, setHeroRevealed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const stage = stageRef.current;
    const screen = screenRef.current;
    const hero = heroRef.current;
    const manifesto = manifestoRef.current;
    const solutionsIntro = solutionsIntroRef.current;

    if (!stage || !screen || !hero || !manifesto || !solutionsIntro) return;

    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: "+=200%",
          pin: screen,
          pinSpacing: true,
          scrub: 0.7,
          anticipatePin: 1,
        },
      });

      // Inicialização rigorosa das camadas no topo (scroll = 0)
      tl.set(hero, { zIndex: 40, pointerEvents: "auto" }, 0);
      tl.set(manifesto, { zIndex: 10, pointerEvents: "none" }, 0);
      tl.set(solutionsIntro, { zIndex: 10, pointerEvents: "none" }, 0);

      // ==========================================
      // 1. SEQUÊNCIA DO ROBÔ (FRAME 001 A 096)
      // Chega no último frame (frame 95) em 0.55
      // ==========================================
      tl.to(
        frameRef,
        {
          current: 95,
          ease: "none",
          duration: 0.55,
        },
        0
      );

      // ==========================================
      // 2. HERO -> MANIFESTO (0.0 a 0.35)
      // ==========================================
      tl.to(
        hero,
        {
          opacity: 0,
          y: -25,
          duration: 0.15,
          ease: "power1.inOut",
        },
        0.02
      );
      tl.set(hero, { zIndex: 10, pointerEvents: "none" }, 0.14);

      // Linhas dinâmicas que se movem abrindo o quadro (Referência The Model)
      tl.fromTo(".manifesto-line-top", { top: "46%" }, { top: "10%", duration: 0.25, ease: "power2.out" }, 0.06);
      tl.fromTo(".manifesto-line-bottom", { bottom: "46%" }, { bottom: "10%", duration: 0.25, ease: "power2.out" }, 0.06);
      tl.fromTo(".manifesto-line-left", { left: "46%" }, { left: "8vw", duration: 0.25, ease: "power2.out" }, 0.06);
      tl.fromTo(".manifesto-line-right", { right: "46%" }, { right: "8vw", duration: 0.25, ease: "power2.out" }, 0.06);

      tl.fromTo(".manifesto-star-tl", { top: "46%", left: "46%", opacity: 0 }, { top: "10%", left: "8vw", opacity: 1, duration: 0.25, ease: "power2.out" }, 0.06);
      tl.fromTo(".manifesto-star-tr", { top: "46%", right: "46%", opacity: 0 }, { top: "10%", right: "8vw", opacity: 1, duration: 0.25, ease: "power2.out" }, 0.06);
      tl.fromTo(".manifesto-star-bl", { bottom: "46%", left: "46%", opacity: 0 }, { bottom: "10%", left: "8vw", opacity: 1, duration: 0.25, ease: "power2.out" }, 0.06);
      tl.fromTo(".manifesto-star-br", { bottom: "46%", right: "46%", opacity: 0 }, { bottom: "10%", right: "8vw", opacity: 1, duration: 0.25, ease: "power2.out" }, 0.06);

      tl.fromTo(".manifesto-tag", { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.15, ease: "power2.out" }, 0.10);

      const manifestoChildren = Array.from(manifesto.children);
      tl.set(manifesto, { zIndex: 40, pointerEvents: "auto" }, 0.08);
      tl.fromTo(
        manifesto,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.16,
          ease: "power2.out",
        },
        0.08
      );
      tl.fromTo(
        manifestoChildren,
        {
          opacity: 0,
          filter: "blur(16px)",
          y: 16,
        },
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          duration: 0.20,
          stagger: 0.04,
          ease: "power2.out",
        },
        0.10
      );

      // ==========================================
      // 3. MANIFESTO FICA ESTÁTICO (0.28 a 0.38) E SAI (0.38 a 0.48)
      // ==========================================
      tl.to(
        manifesto,
        {
          opacity: 0,
          y: -25,
          duration: 0.10,
          ease: "power1.inOut",
        },
        0.38
      );
      tl.set(manifesto, { zIndex: 10, pointerEvents: "none" }, 0.38);
      tl.to(".manifesto-grid-frame", { opacity: 0, duration: 0.08, ease: "power1.inOut" }, 0.38);

      // ==========================================
      // 4. ÚLTIMO FRAME -> TRANSIÇÃO PIXEL PRETO (#000000) DO CENTRO (0.46 a 0.62)
      // ==========================================
      tl.fromTo(
        pixelProgressRef,
        { current: 0.0 },
        {
          current: 1.35,
          duration: 0.16,
          ease: "none",
        },
        0.46
      );

      // ==========================================
      // 5. SOLUÇÕES INTRO APARECE SOBRE OS PIXELS (0.54 a 0.70) E PERMANECE VISÍVEL ATÉ O FIM!
      // ==========================================
      const solutionsChildren = Array.from(solutionsIntro.children);
      tl.set(solutionsIntro, { zIndex: 40, pointerEvents: "auto" }, 0.54);
      tl.fromTo(
        solutionsIntro,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.14,
          ease: "power2.out",
        },
        0.54
      );
      tl.fromTo(
        solutionsChildren,
        {
          opacity: 0,
          filter: "blur(16px)",
          y: 16,
        },
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          duration: 0.18,
          stagger: 0.04,
          ease: "power2.out",
        },
        0.56
      );
    }, stage);

    return () => {
      ctx.revert();
    };
  }, [mounted]);

  return (
    <div ref={stageRef} className="relative w-full">
      {/* TELA DE LOADING FUNCIONAL COM ABERTURA EM CORTINA */}
      <LoadingCurtain
        progress={loadingProgress}
        onCurtainsOpen={() => setCurtainsOpen(true)}
      />

      {/* Viewport fixado onde as 3 seções ocorrem com o Robô de fundo animando no scroll */}
      <div
        ref={screenRef}
        className="relative h-screen w-full overflow-hidden bg-[#000000]"
      >
        {/* SEQUÊNCIA DE FUNDO DO ROBÔ COM BRILHO NATURAL (Frames 001 a 096 fluindo no scroll) */}
        <RobozitoSequenceBackground
          frameRef={frameRef}
          onProgress={setLoadingProgress}
          curtainsOpen={curtainsOpen}
          onSatelliteEnded={() => setHeroRevealed(true)}
        />

        {/* CAMADA 1: SEÇÃO 1 - HERO */}
        <section
          id="top"
          ref={heroRef}
          className="absolute inset-0 z-20 flex flex-col justify-between pt-12 md:pt-14 dark bg-transparent text-foreground pointer-events-auto"
        >
          {/* Conteúdo do Hero só aparece quando o vídeo do robô (2º vídeo) assume a tela */}
          <div
            className="relative z-20 flex h-full flex-1 flex-col justify-between px-5 pt-2 pb-6 md:px-12 xl:px-[22vw] md:pt-4 md:pb-8 transition-all duration-1000 ease-out"
            style={{
              opacity: heroRevealed ? 1 : 0,
              transform: heroRevealed ? "translateY(0)" : "translateY(14px)",
              pointerEvents: heroRevealed ? "auto" : "none",
            }}
          >
            <div className="pointer-events-auto">
              <Eyebrow cyan>{t.hero.eyebrow}</Eyebrow>
            </div>
            
            <div className="relative z-30 max-w-3xl py-2 md:py-5 pointer-events-auto">
              <InteractiveBlurTitle
                as="h1"
                className="max-w-2xl font-serif text-2xl sm:text-3xl md:text-7xl lg:text-[5.5rem] leading-[1.08] md:leading-[0.95] font-light text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
              >
                {t.hero.title}
              </InteractiveBlurTitle>
              <p className="mt-3 md:mt-5 max-w-sm md:max-w-xl text-xs sm:text-sm md:text-base leading-5 md:leading-6 text-zinc-300 drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
                {t.hero.subtitle}
              </p>
              <div className="mt-4 md:mt-6 flex flex-wrap gap-2.5 md:gap-3">
                <AnchorButton className="h-9 px-4 text-[10px] tracking-[0.16em] md:h-12 md:px-6">{t.hero.ctaPrimary}</AnchorButton>
                <Button asChild variant="editorialOutline" className="h-9 px-4 text-[10px] tracking-[0.16em] md:h-12 md:px-6">
                  <a href="#solucoes">
                    {t.hero.ctaSecondary}
                    <ArrowDown className="size-3 md:size-4" />
                  </a>
                </Button>
              </div>
              <p className="mt-3 md:mt-4 max-w-xs md:max-w-lg text-[10px] sm:text-xs leading-4 md:leading-5 text-zinc-400 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                {t.hero.hint}
              </p>
            </div>

            <div className="flex flex-wrap justify-between gap-3 border-t border-white/15 pt-3 pb-2 font-mono text-[9px] uppercase tracking-[0.12em] text-zinc-400 pointer-events-auto">
              <span>{t.hero.footerStatus}</span>
              <span>System status: ready</span>
              <span>Built for conversion</span>
            </div>
          </div>
        </section>

        {/* CAMADA 2: SEÇÃO 2 - MANIFESTO COM LINHAS DINÂMICAS */}
        <section
          ref={manifestoRef}
          className="absolute inset-0 z-10 flex flex-col justify-center px-5 py-8 md:py-12 text-white md:px-12 xl:px-[22vw] opacity-0 pointer-events-none bg-transparent overflow-hidden"
        >
          {/* Grade de Linhas Dinâmicas com nós ✦ (Referência The Model) */}
          <div className="manifesto-grid-frame absolute inset-0 pointer-events-none z-0">
            {/* Tag editorial de topo */}
            <div className="manifesto-tag absolute top-[calc(10%-26px)] left-[8vw] font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-300 flex items-center gap-2">
              <div className="grid grid-cols-2 gap-[2px] opacity-70">
                <div className="size-1 bg-cyan-400" />
                <div className="size-1 bg-cyan-400" />
                <div className="size-1 bg-cyan-400" />
                <div className="size-1 bg-cyan-400" />
              </div>
              <span>-- {t.manifesto.tag}</span>
            </div>

            {/* Linhas que se expandem com o scroll */}
            <div className="manifesto-line-top absolute inset-x-0 h-px bg-white/20" />
            <div className="manifesto-line-bottom absolute inset-x-0 h-px bg-white/20" />
            <div className="manifesto-line-left absolute inset-y-0 w-px bg-white/20" />
            <div className="manifesto-line-right absolute inset-y-0 w-px bg-white/20" />

            {/* Cruzes de interseção nos 4 cantos */}
            <div className="manifesto-star-tl absolute -translate-x-1/2 -translate-y-1/2 text-cyan-400 font-serif text-sm">✦</div>
            <div className="manifesto-star-tr absolute translate-x-1/2 -translate-y-1/2 text-cyan-400 font-serif text-sm">✦</div>
            <div className="manifesto-star-bl absolute -translate-x-1/2 translate-y-1/2 text-cyan-400 font-serif text-sm">✦</div>
            <div className="manifesto-star-br absolute translate-x-1/2 translate-y-1/2 text-cyan-400 font-serif text-sm">✦</div>
          </div>

          <div className="relative z-30 pointer-events-auto">
            <Eyebrow cyan>{t.manifesto.eyebrow}</Eyebrow>
            <InteractiveBlurTitle
              as="h2"
              className="mt-6 md:mt-12 max-w-6xl font-serif text-2xl sm:text-3xl md:text-6xl lg:text-7xl leading-[1.1] md:leading-[1.05] font-light text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]"
            >
              {t.manifesto.title}
            </InteractiveBlurTitle>
            <div className="mt-6 md:mt-14 grid gap-6 md:gap-8 border-t border-white/15 pt-6 md:pt-8 md:grid-cols-12">
              <p className="md:col-span-5 md:col-start-7 text-xs sm:text-sm md:text-lg leading-5 md:leading-8 text-zinc-200 drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]">
                {t.manifesto.text}
              </p>
              <p className="font-serif text-base sm:text-xl md:col-span-6 md:col-start-7 md:text-3xl text-cyan-300 drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
                {t.manifesto.highlight}
              </p>
            </div>
          </div>
        </section>

        {/* CAMADA 3 (Z-15): THREE.JS PIXEL SHADER PRETO (#000000) - ABRINDO DO CENTRO */}
        {mounted && (
          <div className="z-15 absolute inset-0 pointer-events-none">
            <PixelTransitionCanvas
              color="#000000"
              progressRef={pixelProgressRef}
              direction="center"
            />
          </div>
        )}

        {/* CAMADA 4 (Z-10): INTRODUÇÃO DE SOLUÇÕES (Sobre o fundo preto com pixels abrindo do centro) */}
        <section
          id="solucoes-intro"
          ref={solutionsIntroRef}
          className="absolute inset-0 z-10 flex flex-col justify-center px-5 py-8 md:py-12 dark bg-transparent text-foreground md:px-12 xl:px-[22vw] opacity-0 pointer-events-none"
        >
          <div className="relative z-30 pointer-events-auto">
            <Eyebrow cyan>{t.servicesHeading.eyebrow}</Eyebrow>
            <div className="mt-6 md:mt-14 grid gap-6 md:gap-8 md:grid-cols-12">
            <InteractiveBlurTitle
              as="h2"
              className="font-serif text-2xl sm:text-3xl md:text-7xl leading-snug md:leading-none md:col-span-8 text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] font-light"
            >
              {t.servicesHeading.title}
            </InteractiveBlurTitle>
            <p className="self-end text-xs sm:text-sm leading-5 md:leading-6 md:col-span-4 text-zinc-300 drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]">
              {t.servicesHeading.description}
            </p>
          </div>
          </div>
        </section>
      </div>
    </div>
  );
}
