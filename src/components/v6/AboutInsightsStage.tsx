import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PixelTransitionCanvas } from "@/components/v6/PixelTransitionCanvas";
import { Check } from "lucide-react";

export function AboutInsightsStage({
  Eyebrow,
}: {
  Eyebrow: React.ComponentType<{
    children: React.ReactNode;
    light?: boolean;
    cyan?: boolean;
  }>;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const insightsRef = useRef<HTMLDivElement>(null);
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
    const about = aboutRef.current;
    const insights = insightsRef.current;

    if (!stage || !screen || !about || !insights) return;

    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: "+=240%",
          pin: screen,
          pinSpacing: true,
          scrub: 0.7,
          anticipatePin: 1,
        },
      });

      // ==========================================
      // ETAPA 1: PROJETOS (Bege) -> SOBRE (Preto) (0.0 a 0.45)
      // ==========================================
      tl.fromTo(
        progress1Ref,
        { current: 0.0 },
        {
          current: 1.35,
          duration: 0.32,
          ease: "none",
        },
        0.02
      );

      const aboutChildren = Array.from(about.children);
      tl.fromTo(
        about,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.22,
          ease: "power2.out",
          onStart: () => {
            about.style.pointerEvents = "auto";
          },
        },
        0.14
      );
      tl.fromTo(
        aboutChildren,
        {
          opacity: 0,
          filter: "blur(14px)",
          y: 18,
        },
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          duration: 0.28,
          stagger: 0.05,
          ease: "power2.out",
        },
        0.16
      );

      // ==========================================
      // ETAPA 2: SOBRE FICA ESTÁTICO (0.42 a 0.58)
      // ==========================================

      // ==========================================
      // ETAPA 3: SOBRE (Preto) -> INSIGHTS (Bege) (0.58 a 1.0)
      // ==========================================
      tl.to(
        about,
        {
          opacity: 0,
          y: -20,
          duration: 0.16,
          ease: "power1.inOut",
        },
        0.58
      );

      tl.fromTo(
        progress2Ref,
        { current: 0.0 },
        {
          current: 1.35,
          duration: 0.28,
          ease: "none",
        },
        0.58
      );

      const insightsChildren = Array.from(insights.children);
      tl.fromTo(
        insights,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.22,
          ease: "power2.out",
          onStart: () => {
            insights.style.pointerEvents = "auto";
          },
        },
        0.70
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
          duration: 0.28,
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
      <div
        ref={screenRef}
        className="relative h-screen w-full overflow-hidden bg-[#ecece3]"
      >
        {/* THREE.JS PIXEL SHADER PRETO (#000000) cobrindo Projetos (Bege) */}
        {mounted && (
          <div className="z-10 absolute inset-0 pointer-events-none">
            <PixelTransitionCanvas
              color="#000000"
              progressRef={progress1Ref}
              direction="center"
            />
          </div>
        )}

        {/* SOBRE A ESCOM (Fundo Preto #000000) */}
        <section
          id="sobre"
          ref={aboutRef}
          className="absolute inset-0 z-20 flex flex-col justify-center px-5 py-10 dark bg-[#000000] text-foreground md:px-12 xl:px-[22vw] opacity-0 pointer-events-none"
        >
          {/* Eyebrow na cor azul do brand da ESCOM */}
          <Eyebrow cyan>Sobre a ESCOM</Eyebrow>
          <div className="mt-10 grid gap-8 md:grid-cols-12">
            <h2 className="font-serif text-4xl leading-tight font-light md:col-span-7 md:text-6xl lg:text-7xl">
              Somos uma equipe de estratégia, design e tecnologia para empresas em
              movimento.
            </h2>
            <div className="space-y-5 text-sm leading-6 md:text-base md:leading-7 text-muted-foreground md:col-span-4 md:col-start-9">
              <p>
                A ESCOM nasceu da convicção de que presença digital precisa
                cumprir uma função clara dentro do negócio.
              </p>
              <p>
                Pensamos na marca, desenhamos a experiência, escrevemos a
                mensagem, construímos a tecnologia, conectamos os dados e
                observamos o que acontece depois do lançamento.
              </p>
            </div>
          </div>
          <div className="mt-14 grid border-t border-border/40 md:grid-cols-3">
            {[
              "Clareza antes do ruído",
              "Estratégia antes da ferramenta",
              "Tecnologia a serviço do resultado",
              "Design com intenção",
              "Experimentos com responsabilidade",
              "Crescimento que pode ser melhorado",
            ].map((x, i) => (
              <div
                key={x}
                className="border-b border-border/30 py-4 font-mono text-[9px] md:text-[10px] uppercase tracking-[0.1em] text-muted-foreground md:border-r"
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
          className="absolute inset-0 z-40 flex flex-col justify-center px-5 py-10 text-[#000000] md:px-12 xl:px-[22vw] opacity-0 pointer-events-none bg-[#ecece3]"
        >
          <Eyebrow light>Para quem é</Eyebrow>
          <div className="mt-8 grid gap-8 md:grid-cols-12">
            <h2 className="font-serif text-4xl leading-tight font-light md:col-span-7 md:text-6xl lg:text-7xl text-[#000000]">
              Para empresas que já entenderam que o próximo estágio exige mais do
              que presença.
            </h2>
            <div className="md:col-span-4 md:col-start-9">
              <p className="text-sm leading-6 md:text-base md:leading-7 text-black/80">
                Empresas lançando, reposicionando ou acelerando uma operação — e
                prontas para transformar intenção em estrutura.
              </p>
              <ul className="mt-6 space-y-3 text-xs md:text-sm">
                {[
                  "Lançar ou reconstruir um site",
                  "Reposicionar uma marca",
                  "Criar uma jornada de conversão",
                  "Automatizar atendimento e vendas",
                  "Aplicar IA em uma operação concreta",
                  "Conectar marketing, tecnologia e vendas",
                ].map((x) => (
                  <li
                    key={x}
                    className="flex items-center gap-3 border-t border-black/15 pt-2 text-black/90"
                  >
                    <Check className="size-4 shrink-0 text-[#008ba3]" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-10 max-w-4xl font-serif text-2xl md:text-3xl text-black">
            Se você procura apenas uma peça pelo menor preço, talvez não sejamos a
            melhor escolha. Se procura uma solução pensada para o contexto,
            podemos conversar.
          </p>
        </section>
      </div>
    </div>
  );
}
