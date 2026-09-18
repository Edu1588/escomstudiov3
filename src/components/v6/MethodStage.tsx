import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PixelTransitionCanvas } from "@/components/v6/PixelTransitionCanvas";

export function MethodStage({
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
          end: "+=130%",
          pin: screen,
          pinSpacing: true,
          scrub: 0.7,
          anticipatePin: 1,
        },
      });

      // 1. Micro-pixels claros crescem sobre a tela preta de Soluções
      tl.fromTo(
        progressRef,
        { current: 0.0 },
        {
          current: 1.35,
          duration: 0.45,
          ease: "none",
        },
        0.05
      );

      // 2. Revela Método com foco óptico no fundo bege
      const children = Array.from(content.children);
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
        0.35
      );

      tl.fromTo(
        children,
        {
          opacity: 0,
          filter: "blur(14px)",
          y: 20,
        },
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          duration: 0.35,
          stagger: 0.06,
          ease: "power2.out",
        },
        0.38
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
        {/* THREE.JS PIXEL SHADER BEGE (#ecece3) */}
        {mounted && (
          <div className="z-10 absolute inset-0 pointer-events-none">
            <PixelTransitionCanvas color="#ecece3" progressRef={progressRef} />
          </div>
        )}

        {/* MÉTODO (Fundo Claro Bege #ecece3) */}
        <section
          id="metodo"
          ref={contentRef}
          className="absolute inset-0 z-20 flex flex-col justify-center px-5 py-12 text-[#000000] md:px-12 xl:px-[22vw] opacity-0 pointer-events-none bg-[#ecece3]"
        >
          <Eyebrow light>Não somos uma fábrica de entregáveis</Eyebrow>
          <h2 className="mt-10 max-w-5xl font-serif text-4xl leading-[1.05] font-light md:text-6xl lg:text-7xl text-[#000000]">
            Cada projeto começa pelo problema. E termina em uma estrutura que
            pode evoluir.
          </h2>
          <div className="mt-12 grid gap-12 md:grid-cols-12">
            <p className="text-base leading-7 md:col-span-5 md:text-lg md:leading-8 text-black/80">
              A ESCOM não começa perguntando qual peça você quer produzir. Começa
              entendendo o que precisa mudar no negócio. Combinamos pensamento
              estratégico, design, código, dados e automação para construir
              somente o que tem função no seu crescimento.
            </p>
            <div className="md:col-span-6 md:col-start-7">
              {[
                "Estratégia antes da execução.",
                "Tecnologia com função.",
                "Design que orienta decisões.",
                "Operação conectada.",
                "Evolução contínua.",
              ].map((x, i) => (
                <div
                  key={x}
                  className="flex gap-5 border-t border-black/15 py-4"
                >
                  <span className="font-mono text-[10px] text-black/60">
                    0{i + 1}
                  </span>
                  <p className="font-serif text-xl md:text-2xl text-black">
                    {x}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
