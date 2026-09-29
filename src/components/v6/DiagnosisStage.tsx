import React, { useEffect, useRef, useState, type FormEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/v6/LanguageContext";
import { FlameWrap } from "@/components/ui/flame-wrap";

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
  const sectionRef = useRef<HTMLElement>(null);
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

    const section = sectionRef.current;
    if (!section) return;

    let ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll(".diagnosis-reveal"),
        { opacity: 0, y: 25, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.7,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            once: true,
          },
        }
      );
    }, section);

    return () => {
      ctx.revert();
    };
  }, [mounted]);

  return (
    <section
      id="diagnostico"
      ref={sectionRef}
      className="relative w-full bg-[#000000] text-foreground px-5 pt-16 pb-12 md:pt-24 md:pb-16 md:px-12 xl:px-[22vw] border-t border-white/10 dark overflow-hidden"
    >
      <div className="space-y-12">
        <div className="diagnosis-reveal">
          {/* Eyebrow em azul do brand da ESCOM */}
          <Eyebrow cyan>{t.diagnosis.eyebrow}</Eyebrow>
          <div className="mt-6 md:mt-8 grid gap-8 md:gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl lg:text-6xl leading-snug md:leading-tight font-light">
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
            <div className="relative md:col-span-7">
              {/* Box Externo com Chamas Ciano Elétricas no Contorno */}
              <div className="relative rounded-2xl border border-cyan/40 bg-[#060606]/95 p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(0,209,255,0.15)]">
                {/* Camada FlameWrap no contorno exterior do box */}
                <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-visible z-10">
                  <FlameWrap
                    enabled={true}
                    color={[0, 0.82, 1]}
                    intensity={1.25}
                    height={70}
                    spread={14}
                    radius={16}
                    sparks={1.8}
                    sparkSize={1.1}
                    sparkDensity={1.2}
                    sparkSpeed={1.0}
                    smoke={0.3}
                    className="w-full h-full"
                  />
                </div>

                {/* Conteúdo do Formulário (100% legível, sem cortes e com interação total) */}
                <div className="relative z-20">
                  {sent ? (
                    <div className="flex min-h-60 md:min-h-72 flex-col justify-center p-2">
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
                          className="border-border bg-black/40 text-foreground placeholder:text-muted-foreground focus-visible:border-cyan"
                        />
                        <Input
                          required
                          placeholder={t.diagnosis.companyPlaceholder}
                          value={formData.empresa}
                          onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                          className="border-border bg-black/40 text-foreground placeholder:text-muted-foreground focus-visible:border-cyan"
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Input
                          required
                          type="email"
                          placeholder={t.diagnosis.emailPlaceholder}
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="border-border bg-black/40 text-foreground placeholder:text-muted-foreground focus-visible:border-cyan"
                        />
                        <Input
                          placeholder={t.diagnosis.phonePlaceholder}
                          value={formData.whatsapp}
                          onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                          className="border-border bg-black/40 text-foreground placeholder:text-muted-foreground focus-visible:border-cyan"
                        />
                      </div>
                      <Textarea
                        required
                        rows={3}
                        placeholder={t.diagnosis.msgPlaceholder}
                        value={formData.mensagem}
                        onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                        className="border-border bg-black/40 text-foreground placeholder:text-muted-foreground focus-visible:border-cyan"
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
          </div>
        </div>

        <footer className="diagnosis-reveal border-t border-border/40 pt-6 flex flex-wrap items-center justify-between gap-4 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
          <div className="font-serif text-base text-foreground tracking-normal">
            ESCOM<span className="text-cyan">.</span>
          </div>
          <div>{t.footer.location}</div>
          <div>© {new Date().getFullYear()} {t.footer.rights}</div>
        </footer>
      </div>
    </section>
  );
}

export default DiagnosisStage;
