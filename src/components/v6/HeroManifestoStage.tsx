import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitTextReveal } from "@/components/v6/SplitTextReveal";
import { PixelTransitionCanvas } from "@/components/v6/PixelTransitionCanvas";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import RobotBust3D from "@/components/RobotBust3D";

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
  const stageRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const manifestoRef = useRef<HTMLDivElement>(null);
  const solutionsIntroRef = useRef<HTMLDivElement>(null);
  const progress1Ref = useRef(0.0);
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

      // Micro-pixels beges sobem de baixo para cima cobrindo o Hero
      tl.fromTo(
        progress1Ref,
        { current: 0.0 },
        {
          current: 1.35,
          duration: 0.30,
          ease: "none",
        },
        0.02
      );

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

      // Micro-pixels pretos sobem de baixo para cima cobrindo o Manifesto
      tl.fromTo(
        progress2Ref,
        { current: 0.0 },
        {
          current: 1.35,
          duration: 0.27,
          ease: "none",
        },
        0.58
      );

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
      {/* Viewport fixado onde as 3 telas ocorrem em tela cheia fixa */}
      <div
        ref={screenRef}
        className="relative h-screen w-full overflow-hidden bg-[#000000]"
      >
        {/* CAMADA 1 (Z-10): HERO (Preto com Robô 3D à direita) */}
        <section
          id="top"
          ref={heroRef}
          className="absolute inset-0 z-10 flex flex-col justify-between pt-12 md:pt-14 dark bg-[#000000] text-foreground"
        >
          {/* Robô 3D interativo à direita (Busto fixo, cabeça seguindo o cursor) */}
          <div className="absolute right-0 top-12 bottom-0 w-full lg:top-0 lg:w-[50vw] z-0 pointer-events-auto flex items-center justify-center opacity-35 lg:opacity-100 scale-90 lg:scale-105 lg:-translate-y-8 transition-all">
            <RobotBust3D />
          </div>

          <div className="relative z-10 flex h-full flex-1 flex-col justify-between px-5 pt-2 pb-6 md:px-12 xl:px-[22vw] md:pt-4 md:pb-8 pointer-events-none">
            <div className="pointer-events-auto">
              <Eyebrow cyan>ESCOM STUDIO · DIGITAL GROWTH SYSTEMS</Eyebrow>
            </div>
            
            <div className="max-w-3xl py-3 md:py-5 pointer-events-auto">
              <SplitTextReveal
                type="words"
                className="max-w-2xl font-serif text-5xl leading-[0.95] font-light md:text-7xl lg:text-[5.5rem]"
              >
                Transformamos presença digital em sistemas que geram crescimento.
              </SplitTextReveal>
              <p className="mt-5 max-w-xl text-sm leading-6 md:text-base text-muted-foreground">
                Criamos sites, marcas, automações, experiências com inteligência
                artificial e operações de tráfego pago para empresas que precisam
                atrair melhor, vender mais e operar com menos fricção.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <AnchorButton>Iniciar diagnóstico</AnchorButton>
                <Button asChild variant="editorialOutline" size="xl">
                  <a href="#solucoes">
                    Explorar soluções
                    <ArrowDown />
                  </a>
                </Button>
              </div>
              <p className="mt-4 max-w-lg text-xs leading-5 text-muted-foreground/80">
                Conte-nos onde você está e onde quer chegar. Identificamos as
                oportunidades mais importantes para o seu próximo ciclo.
              </p>
            </div>

            <div className="flex flex-wrap justify-between gap-3 border-t border-border/50 pt-3 pb-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground pointer-events-auto">
              <span>Strategy // Design // Code // Automation // Media</span>
              <span>System status: ready</span>
              <span>Built for conversion</span>
            </div>
          </div>
        </section>

        {/* CAMADA 2 (Z-20): THREE.JS PIXEL SHADER BEGE (#ecece3) - CENTER */}
        {mounted && (
          <div className="z-20 absolute inset-0 pointer-events-none">
            <PixelTransitionCanvas
              color="#ecece3"
              progressRef={progress1Ref}
              direction="center"
            />
          </div>
        )}

        {/* CAMADA 3 (Z-30): MANIFESTO (Bege) */}
        <section
          ref={manifestoRef}
          className="absolute inset-0 z-30 flex flex-col justify-center px-5 py-12 text-[#000000] md:px-12 xl:px-[22vw] opacity-0 pointer-events-none bg-[#ecece3]"
        >
          <Eyebrow light>O crescimento não acontece em partes isoladas</Eyebrow>
          <h2 className="mt-12 max-w-6xl font-serif text-4xl leading-[1.05] font-light md:text-6xl lg:text-7xl">
            Um site desconectado. Uma marca sem direção. Tráfego sem estratégia.
            Automação sem contexto.
          </h2>
          <div className="mt-14 grid gap-8 border-t border-black/15 pt-8 md:grid-cols-12">
            <p className="md:col-span-5 md:col-start-7 text-base leading-7 md:text-lg md:leading-8 text-black/80">
              Muitas empresas investem em canais, ferramentas e campanhas que não
              conversam entre si. O resultado é uma operação difícil de medir,
              leads perdidos e uma presença digital que não acompanha a ambição
              do negócio.
            </p>
            <p className="font-serif text-2xl md:col-span-6 md:col-start-7 md:text-3xl text-black">
              A ESCOM organiza as partes para que o sistema inteiro trabalhe a
              favor do crescimento.
            </p>
          </div>
        </section>

        {/* CAMADA 4 (Z-40): THREE.JS PIXEL SHADER PRETO (#000000) - CENTER */}
        {mounted && (
          <div className="z-40 absolute inset-0 pointer-events-none">
            <PixelTransitionCanvas
              color="#000000"
              progressRef={progress2Ref}
              direction="center"
            />
          </div>
        )}

        {/* CAMADA 5 (Z-50): CABEÇALHO DE SOLUÇÕES (Preto) */}
        <section
          id="solucoes-intro"
          ref={solutionsIntroRef}
          className="absolute inset-0 z-50 flex flex-col justify-center px-5 py-12 dark bg-[#000000] text-foreground md:px-12 xl:px-[22vw] opacity-0 pointer-events-none"
        >
          <Eyebrow cyan>Um sistema digital, várias frentes de crescimento</Eyebrow>
          <div className="mt-14 grid gap-8 md:grid-cols-12">
            <h2 className="font-serif text-5xl leading-none md:col-span-8 md:text-7xl">
              Tudo o que sua empresa precisa para ser percebida, encontrada e
              escolhida.
            </h2>
            <p className="self-end text-sm leading-6 md:col-span-4 text-muted-foreground">
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
