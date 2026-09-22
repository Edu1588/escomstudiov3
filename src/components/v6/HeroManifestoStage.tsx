import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitTextReveal } from "@/components/v6/SplitTextReveal";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { RobozitoSequenceBackground } from "@/components/v6/RobozitoSequenceBackground";
import { LoadingCurtain } from "@/components/v6/LoadingCurtain";
import { useLanguage } from "@/components/v6/LanguageContext";

export function HeroManifestoStage({
  Eyebrow,
  AnchorButton,
}: {
  Eyebrow: React.ComponentType<{
    children: React.ReactNode;
    light?: boolean;
    cyan?: boolean;
  }>;
  AnchorButton: React.ComponentType<{ children: React.ReactNode }>;
}) {
  const { t } = useLanguage();
  const stageRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const manifestoRef = useRef<HTMLDivElement>(null);
  const solutionsIntroRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
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
          end: "+=260%",
          pin: screen,
          pinSpacing: true,
          scrub: 0.7,
          anticipatePin: 1,
        },
      });

      // ==========================================
      // SEQUÊNCIA DO ROBÔ (FRAME 001 A 096)
      // Conecta o Hero, Seção 2 (Manifesto) e Seção 3 (Soluções)
      // ==========================================
      tl.to(
        frameRef,
        {
          current: 95,
          ease: "none",
          duration: 1.0,
        },
        0
      );

      // ==========================================
      // ETAPA 1: HERO -> MANIFESTO (0.0 a 0.45)
      // ==========================================
      tl.to(
        hero,
        {
          opacity: 0,
          y: -25,
          duration: 0.20,
          ease: "power1.inOut",
        },
        0.02
      );

      // Linhas dinâmicas que se movem abrindo o quadro (Referência The Model)
      tl.fromTo(".manifesto-line-top", { top: "46%" }, { top: "10%", duration: 0.32, ease: "power2.out" }, 0.10);
      tl.fromTo(".manifesto-line-bottom", { bottom: "46%" }, { bottom: "10%", duration: 0.32, ease: "power2.out" }, 0.10);
      tl.fromTo(".manifesto-line-left", { left: "46%" }, { left: "8vw", duration: 0.32, ease: "power2.out" }, 0.10);
      tl.fromTo(".manifesto-line-right", { right: "46%" }, { right: "8vw", duration: 0.32, ease: "power2.out" }, 0.10);

      tl.fromTo(".manifesto-star-tl", { top: "46%", left: "46%", opacity: 0 }, { top: "10%", left: "8vw", opacity: 1, duration: 0.32, ease: "power2.out" }, 0.10);
      tl.fromTo(".manifesto-star-tr", { top: "46%", right: "46%", opacity: 0 }, { top: "10%", right: "8vw", opacity: 1, duration: 0.32, ease: "power2.out" }, 0.10);
      tl.fromTo(".manifesto-star-bl", { bottom: "46%", left: "46%", opacity: 0 }, { bottom: "10%", left: "8vw", opacity: 1, duration: 0.32, ease: "power2.out" }, 0.10);
      tl.fromTo(".manifesto-star-br", { bottom: "46%", right: "46%", opacity: 0 }, { bottom: "10%", right: "8vw", opacity: 1, duration: 0.32, ease: "power2.out" }, 0.10);

      tl.fromTo(".manifesto-tag", { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.20, ease: "power2.out" }, 0.18);

      const manifestoChildren = Array.from(manifesto.children);
      tl.fromTo(
        manifesto,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.22,
          ease: "power2.out",
          onStart: () => {
            manifesto.style.pointerEvents = "auto";
          },
        },
        0.12
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
          duration: 0.28,
          stagger: 0.05,
          ease: "power2.out",
        },
        0.14
      );

      // ==========================================
      // ETAPA 2: MANIFESTO FICA ESTÁTICO (0.40 a 0.58)
      // ==========================================

      // ==========================================
      // ETAPA 3: MANIFESTO -> SOLUÇÕES INTRO (0.58 a 1.0)
      // ==========================================
      tl.to(
        manifesto,
        {
          opacity: 0,
          y: -25,
          duration: 0.16,
          ease: "power1.inOut",
        },
        0.58
      );
      tl.to(".manifesto-grid-frame", { opacity: 0, duration: 0.14, ease: "power1.inOut" }, 0.58);

      const solutionsChildren = Array.from(solutionsIntro.children);
      tl.fromTo(
        solutionsIntro,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.22,
          ease: "power2.out",
          onStart: () => {
            solutionsIntro.style.pointerEvents = "auto";
          },
        },
        0.70
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
          duration: 0.26,
          stagger: 0.05,
          ease: "power2.out",
        },
        0.72
      );
    }, stage);

    return () => {
      ctx.revert();
    };
  }, [mounted]);

  return (
    <div ref={stageRef} className="relative w-full">
      {/* TELA DE LOADING FUNCIONAL COM ABERTURA EM CORTINA */}
      <LoadingCurtain progress={loadingProgress} />

      {/* Viewport fixado onde as 3 seções ocorrem com o Robô de fundo animando no scroll */}
      <div
        ref={screenRef}
        className="relative h-screen w-full overflow-hidden bg-[#000000]"
      >
        {/* SEQUÊNCIA DE FUNDO DO ROBÔ COM BRILHO NATURAL (Frames 001 a 095 fluindo no scroll) */}
        <RobozitoSequenceBackground
          frameRef={frameRef}
          onProgress={setLoadingProgress}
        />

        {/* CAMADA 1: SEÇÃO 1 - HERO */}
        <section
          id="top"
          ref={heroRef}
          className="absolute inset-0 z-10 flex flex-col justify-between pt-12 md:pt-14 dark bg-transparent text-foreground"
        >
          <div className="relative z-10 flex h-full flex-1 flex-col justify-between px-5 pt-2 pb-6 md:px-12 xl:px-[22vw] md:pt-4 md:pb-8 pointer-events-none">
            <div className="pointer-events-auto">
              <Eyebrow cyan>{t.hero.eyebrow}</Eyebrow>
            </div>
            
            <div className="max-w-3xl py-3 md:py-5 pointer-events-auto">
              <SplitTextReveal
                type="words"
                className="max-w-2xl font-serif text-5xl leading-[0.95] font-light md:text-7xl lg:text-[5.5rem] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
              >
                {t.hero.title}
              </SplitTextReveal>
              <p className="mt-5 max-w-xl text-sm leading-6 md:text-base text-zinc-300 drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
                {t.hero.subtitle}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <AnchorButton>{t.hero.ctaPrimary}</AnchorButton>
                <Button asChild variant="editorialOutline" size="xl">
                  <a href="#solucoes">
                    {t.hero.ctaSecondary}
                    <ArrowDown />
                  </a>
                </Button>
              </div>
              <p className="mt-4 max-w-lg text-xs leading-5 text-zinc-400 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
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
          className="absolute inset-0 z-20 flex flex-col justify-center px-5 py-12 text-white md:px-12 xl:px-[22vw] opacity-0 pointer-events-none bg-transparent overflow-hidden"
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

          <div className="relative z-10">
            <Eyebrow cyan>{t.manifesto.eyebrow}</Eyebrow>
            <h2 className="mt-12 max-w-6xl font-serif text-4xl leading-[1.05] font-light md:text-6xl lg:text-7xl text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
              {t.manifesto.title}
            </h2>
            <div className="mt-14 grid gap-8 border-t border-white/15 pt-8 md:grid-cols-12">
              <p className="md:col-span-5 md:col-start-7 text-base leading-7 md:text-lg md:leading-8 text-zinc-200 drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]">
                {t.manifesto.text}
              </p>
              <p className="font-serif text-2xl md:col-span-6 md:col-start-7 md:text-3xl text-cyan-300 drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
                {t.manifesto.highlight}
              </p>
            </div>
          </div>
        </section>

        {/* CAMADA 3: SEÇÃO 3 - INTRODUÇÃO DE SOLUÇÕES */}
        <section
          id="solucoes-intro"
          ref={solutionsIntroRef}
          className="absolute inset-0 z-30 flex flex-col justify-center px-5 py-12 dark bg-transparent text-foreground md:px-12 xl:px-[22vw] opacity-0 pointer-events-none"
        >
          <Eyebrow cyan>Um sistema digital, várias frentes de crescimento</Eyebrow>
          <div className="mt-14 grid gap-8 md:grid-cols-12">
            <h2 className="font-serif text-5xl leading-none md:col-span-8 md:text-7xl text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
              Tudo o que sua empresa precisa para ser percebida, encontrada e
              escolhida.
            </h2>
            <p className="self-end text-sm leading-6 md:col-span-4 text-zinc-300 drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]">
              Unimos marca, experiência digital, aquisição e automação. Cada
              solução pode existir sozinha ou fazer parte de um sistema mais
              amplo.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
