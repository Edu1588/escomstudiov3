import React, { useEffect, useRef, useState, type FormEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PixelTransitionCanvas } from "@/components/v6/PixelTransitionCanvas";
import { ArrowRight, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function DiagnosisStage({
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
  const diagnosisRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0.0);
  const [mounted, setMounted] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const stage = stageRef.current;
    const screen = screenRef.current;
    const diagnosis = diagnosisRef.current;

    if (!stage || !screen || !diagnosis) return;

    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: "+=120%",
          pin: screen,
          pinSpacing: true,
          scrub: 0.7,
          anticipatePin: 1,
        },
      });

      // Micro-pixels pretos cobrem a tela bege do FAQ
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

      // Revela Diagnóstico com foco óptico
      const children = Array.from(diagnosis.children);
      tl.fromTo(
        diagnosis,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.25,
          ease: "power2.out",
          onStart: () => {
            diagnosis.style.pointerEvents = "auto";
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
        className="relative min-h-screen w-full overflow-hidden bg-[#ecece3]"
      >
        {/* THREE.JS PIXEL SHADER PRETO (#000000) cobrindo FAQ (Bege) - CENTER */}
        {mounted && (
          <div className="z-10 absolute inset-0 pointer-events-none">
            <PixelTransitionCanvas
              color="#000000"
              progressRef={progressRef}
              direction="center"
            />
          </div>
        )}

        {/* DIAGNÓSTICO (Fundo Preto #000000) */}
        <section
          id="diagnostico"
          ref={diagnosisRef}
          className="absolute inset-0 z-20 flex flex-col justify-between px-5 py-8 md:py-12 dark bg-[#000000] text-foreground md:px-12 xl:px-[22vw] opacity-0 pointer-events-none"
        >
          <div>
            {/* Eyebrow em azul do brand da ESCOM */}
            <Eyebrow cyan>O próximo sistema começa com uma conversa</Eyebrow>
            <div className="mt-8 grid gap-12 md:grid-cols-12">
              <div className="md:col-span-5">
                <h2 className="font-serif text-4xl leading-tight font-light md:text-6xl lg:text-7xl">
                  O que sua empresa precisa construir agora?
                </h2>
                <p className="mt-6 max-w-md text-sm leading-6 md:text-base md:leading-7 text-muted-foreground">
                  Conte-nos qual é o desafio, onde você quer chegar e o que já
                  tentou. Primeiro entendemos o contexto. Depois indicamos o
                  caminho.
                </p>
                <a
                  href="https://wa.me/"
                  className="mt-8 inline-flex items-center gap-2 border-b border-cyan pb-1 text-xs font-semibold text-cyan hover:opacity-80 transition-opacity"
                >
                  Falar com a ESCOM no WhatsApp <ArrowRight className="size-3" />
                </a>
              </div>
              <div className="md:col-span-6 md:col-start-7">
                {sent ? (
                  <div className="flex min-h-72 flex-col justify-center border-y border-border p-6">
                    <Check className="mb-4 size-8 text-cyan" />
                    <h3 className="font-serif text-3xl">
                      Recebemos suas informações.
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                      Vamos analisar o contexto e retornaremos com o próximo
                      passo mais adequado para o seu projeto.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={submit} className="space-y-4">
                    <h3 className="font-serif text-2xl md:text-3xl">
                      Vamos mapear sua próxima oportunidade.
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input
                        required
                        placeholder="Nome"
                        className="border-border bg-transparent text-foreground placeholder:text-muted-foreground"
                      />
                      <Input
                        required
                        placeholder="Empresa"
                        className="border-border bg-transparent text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input
                        required
                        type="email"
                        placeholder="E-mail profissional"
                        className="border-border bg-transparent text-foreground placeholder:text-muted-foreground"
                      />
                      <Input
                        placeholder="WhatsApp"
                        className="border-border bg-transparent text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    <Textarea
                      required
                      rows={3}
                      placeholder="Qual é o momento do negócio e o objetivo que precisa ser resolvido?"
                      className="border-border bg-transparent text-foreground placeholder:text-muted-foreground"
                    />
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                      <AnchorButton>Enviar informações</AnchorButton>
                      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                        Retorno em até 1 dia útil
                      </span>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          <footer className="mt-8 border-t border-border/40 pt-4 flex flex-wrap items-center justify-between gap-4 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
            <div className="font-serif text-base text-foreground tracking-normal">
              ESCOM<span className="text-cyan">.</span>
            </div>
            <div>São Paulo · Atendimento global</div>
            <div>© {new Date().getFullYear()} ESCOM Studio</div>
          </footer>
        </section>
      </div>
    </div>
  );
}
