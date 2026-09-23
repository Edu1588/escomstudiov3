import React, { useEffect, useRef, useState, type FormEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PixelTransitionCanvas } from "@/components/v6/PixelTransitionCanvas";
import { ArrowRight, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/v6/LanguageContext";

export function DiagnosisStage({
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
  const diagnosisRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0.0);
  const [mounted, setMounted] = useState(false);
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    empresa: "",
    email: "",
    whatsapp: "",
    mensagem: "",
  });

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);

    const text = encodeURIComponent(
      `*Novo Contato via Site ESCOM STUDIO*\n\n` +
      `• *Nome:* ${formData.nome}\n` +
      `• *Empresa:* ${formData.empresa}\n` +
      `• *E-mail:* ${formData.email}\n` +
      `• *WhatsApp:* ${formData.whatsapp || "Não informado"}\n` +
      `• *Objetivo:* ${formData.mensagem}`
    );

    window.open(`https://wa.me/5513981062787?text=${text}`, "_blank");
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
            <Eyebrow cyan>{t.diagnosis.eyebrow}</Eyebrow>
            <div className="mt-6 md:mt-8 grid gap-6 md:gap-12 md:grid-cols-12">
              <div className="md:col-span-5">
                <h2 className="font-serif text-2xl sm:text-3xl md:text-6xl lg:text-7xl leading-snug md:leading-tight font-light">
                  {t.diagnosis.title}
                </h2>
                <p className="mt-4 md:mt-6 max-w-md text-xs sm:text-sm md:text-base leading-5 md:leading-7 text-muted-foreground">
                  {t.diagnosis.desc}
                </p>
                <a
                  href="https://wa.me/5513981062787?text=Ol%C3%A1!%20Gostaria%20de%20conversar%20sobre%20um%20projeto%20com%20a%20ESCOM%20Studio."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 md:mt-8 inline-flex items-center gap-2 border-b border-cyan pb-1 text-xs font-semibold text-cyan hover:opacity-80 transition-opacity"
                >
                  {t.diagnosis.whatsappBtn} <ArrowRight className="size-3" />
                </a>
              </div>
              <div className="md:col-span-6 md:col-start-7">
                {sent ? (
                  <div className="flex min-h-60 md:min-h-72 flex-col justify-center border-y border-border p-5 md:p-6">
                    <Check className="mb-4 size-6 md:size-8 text-cyan" />
                    <h3 className="font-serif text-2xl md:text-3xl">
                      {t.diagnosis.successTitle}
                    </h3>
                    <p className="mt-3 max-w-md text-xs sm:text-sm leading-5 md:leading-6 text-muted-foreground">
                      {t.diagnosis.successDesc}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={submit} className="space-y-3 md:space-y-4">
                    <h3 className="font-serif text-lg sm:text-xl md:text-3xl">
                      {t.diagnosis.formTitle}
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input
                        required
                        placeholder={t.diagnosis.namePlaceholder}
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        className="border-border bg-transparent text-foreground placeholder:text-muted-foreground"
                      />
                      <Input
                        required
                        placeholder={t.diagnosis.companyPlaceholder}
                        value={formData.empresa}
                        onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                        className="border-border bg-transparent text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input
                        required
                        type="email"
                        placeholder={t.diagnosis.emailPlaceholder}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="border-border bg-transparent text-foreground placeholder:text-muted-foreground"
                      />
                      <Input
                        placeholder={t.diagnosis.phonePlaceholder}
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        className="border-border bg-transparent text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    <Textarea
                      required
                      rows={3}
                      placeholder={t.diagnosis.msgPlaceholder}
                      value={formData.mensagem}
                      onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                      className="border-border bg-transparent text-foreground placeholder:text-muted-foreground"
                    />
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                      <Button
                        type="submit"
                        size="xl"
                        variant="editorial"
                      >
                        {t.diagnosis.submitBtn}
                        <ArrowRight />
                      </Button>
                      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                        {t.diagnosis.sla}
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
            <div>{t.footer.location}</div>
            <div>© {new Date().getFullYear()} {t.footer.rights}</div>
          </footer>
        </section>
      </div>
    </div>
  );
}
