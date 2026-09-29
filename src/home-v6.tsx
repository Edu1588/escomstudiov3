import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VerticalNav } from "@/components/v6/VerticalNav";
import { LenisProvider } from "@/components/v6/LenisProvider";
import { HeroManifestoStage } from "@/components/v6/HeroManifestoStage";
import { MethodStage } from "@/components/v6/MethodStage";
import { AboutInsightsStage } from "@/components/v6/AboutInsightsStage";
import { DiagnosisStage } from "@/components/v6/DiagnosisStage";
import { FixedContactButton, FixedBottomBar } from "@/components/v6/FixedUIElements";
import { LanguageProvider, useLanguage } from "@/components/v6/LanguageContext";
import { DynamicSectionFrame } from "@/components/v6/DynamicSectionFrame";
import { DeliveryPlansSection } from "@/components/v6/DeliveryPlansSection";
import { FeaturedWorksSection } from "@/components/v6/FeaturedWorksSection";
import { ClientsMarqueeSection } from "@/components/v6/ClientsMarqueeSection";
import { InteractiveBlurTitle } from "@/components/v6/InteractiveBlurTitle";
import RobotBust3D from "@/components/RobotBust3D";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import "./home-v6.css";

function Eyebrow({
  children,
  light = false,
  cyan = false,
}: {
  children: React.ReactNode;
  light?: boolean;
  cyan?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em] ${
        cyan
          ? "text-cyan"
          : light
          ? "text-foreground/70"
          : "text-muted-foreground"
      }`}
    >
      <span className="h-px w-5 bg-current" />
      {children}
    </div>
  );
}

function AnchorButton({
  children,
  outline = false,
  className,
}: {
  children: React.ReactNode;
  outline?: boolean;
  className?: string;
}) {
  return (
    <Button
      asChild
      size="xl"
      variant={outline ? "editorialOutline" : "editorial"}
      className={className}
    >
      <a href="#diagnostico">
        {children}
        <ArrowRight />
      </a>
    </Button>
  );
}

export function HomeV6() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLanguage();

  const navLinks = [
    { label: t.nav.solutions, id: "solucoes" },
    { label: t.nav.process, id: "processo" },
    { label: t.nav.projects, id: "projetos" },
    { label: t.nav.about, id: "sobre" },
    { label: t.nav.insights, id: "insights" },
    { label: t.nav.diagnosis, id: "diagnostico" },
  ];

  return (
    <main className="relative bg-[#000000] text-foreground pb-8">
      {/* BOTÃO FIXO NO CANTO SUPERIOR DIREITO DE CONTATO (Ref: APPLY ->) */}
      <FixedContactButton />

      {/* BARRA FIXA NO RODAPÉ COM IDIOMAS EN/ES/PT E HORÁRIO DE SP AO VIVO */}
      <FixedBottomBar />

      <VerticalNav />

      {/* HEADER MOBILE FIXO COM FUNDO TRANSPARENTE E BLUR */}
      <div className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl text-[#ecece3] xl:hidden">
        <div className="flex h-8 items-center justify-center border-b border-white/10 px-4 font-mono text-[9px] uppercase tracking-[0.14em] text-white/70 text-center">
          {t.nav.mobileBanner}
        </div>
        <header className="flex h-14 items-center justify-between px-4 md:px-10">
          <a href="#top" className="font-serif text-2xl text-white">
            ESCOM<span className="text-cyan">.</span>
          </a>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 hover:text-cyan"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </Button>
        </header>
        {menuOpen && (
          <nav className="grid border-t border-white/10 bg-black/85 backdrop-blur-2xl p-6 font-serif text-2xl">
            {navLinks.map(({ label, id }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setMenuOpen(false)}
                className="border-b border-white/10 py-3 text-white/90 transition-colors hover:text-cyan"
              >
                {label}
              </a>
            ))}
          </nav>
        )}
      </div>

      {/* PALCO 1: HERO (Preto) -> MANIFESTO (Bege) -> SOLUÇÕES INTRO (Preto) */}
      <HeroManifestoStage Eyebrow={Eyebrow} AnchorButton={AnchorButton} />

      {/* SOLUÇÕES: SEÇÃO LONGA (6 SERVIÇOS 01 a 06) EM FUNDO PRETO CONTÍNUO */}
      <section
        id="solucoes"
        className="relative bg-[#000000] px-5 pb-28 md:px-12 xl:px-[22vw] md:pb-36 dark text-foreground"
      >
        <div className="border-t border-border/50">
          {t.services.map((service) => (
            <article
              key={service.num}
              className="group relative grid gap-5 md:gap-8 border-b border-border/40 py-6 md:py-8 group-hover:py-9 md:group-hover:py-12 px-5 sm:px-7 md:px-8 group-hover:px-7 md:group-hover:px-10 -mx-4 sm:-mx-6 md:-mx-8 rounded-2xl group-hover:rounded-3xl md:grid-cols-12 md:items-start transition-all duration-300 ease-out hover:bg-cyan hover:scale-[1.05] sm:hover:scale-[1.07] lg:hover:scale-[1.09] hover:z-40 hover:shadow-[0_35px_100px_rgba(0,0,0,0.95),0_0_60px_rgba(0,209,255,0.45)] cursor-pointer"
            >
              <span className="font-mono text-xs group-hover:text-sm md:group-hover:text-base text-cyan group-hover:text-black font-semibold group-hover:font-bold transition-all md:col-span-1">
                {service.num}
              </span>
              <div className="md:col-span-3 flex flex-col justify-between h-full">
                <h3 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-[2rem] group-hover:text-2xl sm:group-hover:text-3xl md:group-hover:text-4xl lg:group-hover:text-[2.45rem] text-foreground group-hover:text-black font-light group-hover:font-normal leading-snug group-hover:leading-tight transition-all">
                  {service.title}
                </h3>

                {/* Pequena thumb animada abaixo do título revelada exclusivamente no hover */}
                {service.thumb && (
                  <div className="max-h-0 opacity-0 overflow-hidden group-hover:max-h-48 group-hover:opacity-100 group-hover:mt-4 transition-all duration-300 ease-out">
                    <div className="relative w-full max-w-[220px] aspect-[16/10] rounded-xl overflow-hidden border border-black/20 shadow-md bg-black/10">
                      <img
                        src={service.thumb}
                        alt={service.title}
                        loading="lazy"
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-xl pointer-events-none" />
                    </div>
                  </div>
                )}
              </div>
              <div className="md:col-span-5 space-y-3.5">
                <p className="text-xs sm:text-sm group-hover:text-sm sm:group-hover:text-base md:group-hover:text-[1.05rem] leading-5 md:leading-6 group-hover:leading-relaxed text-muted-foreground group-hover:text-black font-normal group-hover:font-medium transition-all">
                  {service.desc}
                </p>

                {/* Bloco Didático com Foco em Prospecção: Resumido/Oculto sem hover, desdobra completamente no hover com letras aumentadas */}
                {service.whyNeed && (
                  <div className="max-h-0 opacity-0 overflow-hidden group-hover:max-h-[500px] group-hover:opacity-100 group-hover:pt-4 border-t-0 group-hover:border-t group-hover:border-black/25 space-y-2 transition-all duration-300 ease-out">
                    <div className="flex items-center gap-2 font-mono text-[9px] group-hover:text-xs uppercase tracking-wider text-black font-black">
                      <span className="size-1.5 rounded-full bg-black" />
                      <span>Por que sua empresa precisa:</span>
                    </div>
                    <p className="text-[11px] sm:text-xs group-hover:text-sm sm:group-hover:text-[0.95rem] leading-relaxed text-black/95 font-semibold transition-all">
                      {service.whyNeed}
                    </p>
                    {service.prospectFocus && (
                      <p className="text-[10px] sm:text-[11px] group-hover:text-xs sm:group-hover:text-sm leading-relaxed text-black font-mono font-bold pt-1 transition-all">
                        → <strong>Impacto comercial:</strong> {service.prospectFocus}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="md:col-span-3 flex flex-col justify-between h-full space-y-4">
                <p className="font-mono text-[9px] group-hover:text-[11px] sm:group-hover:text-xs uppercase leading-5 group-hover:leading-6 tracking-[0.1em] text-muted-foreground/80 group-hover:text-black/90 font-medium transition-all">
                  {service.items}
                </p>
                <a
                  href="#diagnostico"
                  className="mt-4 md:mt-6 inline-flex items-center gap-2 border-b border-cyan group-hover:border-black pb-1 text-xs group-hover:text-sm sm:group-hover:text-base font-semibold group-hover:font-bold text-cyan group-hover:text-black transition-all self-start"
                >
                  {service.cta}
                  <ArrowRight className="size-3 group-hover:size-4 transition-transform group-hover:translate-x-2" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ALGUNS DE NOSSOS TRABALHOS (2 COLUNAS: ESQUERDA FIXA / DIREITA SCROLL GALLERY) */}
      <FeaturedWorksSection Eyebrow={Eyebrow} />

      {/* PALCO 2: TRANSIÇÃO SOLUÇÕES (Preto) -> MÉTODO (Bege) */}
      <MethodStage Eyebrow={Eyebrow} />

      {/* BLOCO CLARO CONTÍNUO (Fundo Bege #ecece3 sem nenhum pixel entre seções) */}
      <div className="bg-[#ecece3] text-[#000000]">
        {/* JORNADA DIGITAL (5 Colunas) */}
        <section className="px-5 py-16 md:px-10 lg:px-12 xl:px-[8vw] 2xl:px-[11vw] md:py-32 border-t border-black/10">
          <Eyebrow light>{t.journey.eyebrow}</Eyebrow>
          <InteractiveBlurTitle
            as="h2"
            className="mt-8 md:mt-12 max-w-4xl font-serif text-2xl sm:text-3xl md:text-6xl lg:text-7xl leading-[1.08] md:leading-[1.05] font-light text-black"
          >
            {t.journey.title}
          </InteractiveBlurTitle>
          <div className="mt-10 md:mt-16 grid border-y md:border-l border-black/15 md:grid-cols-5">
            {t.journey.items.map((step) => (
              <article
                key={step.num}
                className="border-b border-black/15 p-4 sm:p-5 lg:p-6 md:min-h-[380px] lg:min-h-[420px] md:border-r md:border-b-0 flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-[10px] text-black/50">{step.num}</span>
                  <h3 className="mt-6 md:mt-8 lg:mt-10 font-serif text-lg sm:text-xl md:text-xl lg:text-2xl xl:text-[1.65rem] text-black font-light leading-snug whitespace-normal md:whitespace-nowrap">
                    {step.title}
                  </h3>
                  <p className="mt-4 md:mt-6 text-xs sm:text-sm leading-5 md:leading-6 text-black/80">
                    {step.desc}
                  </p>
                </div>
                <p className="mt-6 md:mt-8 font-mono text-[9px] uppercase leading-5 text-black/60 pt-4 border-t border-black/10">
                  {step.related}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-8 md:mt-12 text-center md:text-right font-serif text-lg sm:text-xl md:text-3xl text-black">
            {t.journey.footer}
          </p>
        </section>

        {/* PROCESSO (5 Etapas) */}
        <section
          id="processo"
          className="px-5 py-16 md:px-12 xl:px-[22vw] md:py-32 border-t border-black/10"
        >
          <Eyebrow light>{t.processSection.eyebrow}</Eyebrow>
          <InteractiveBlurTitle
            as="h2"
            className="mt-8 md:mt-12 max-w-4xl font-serif text-2xl sm:text-3xl md:text-6xl lg:text-7xl leading-[1.08] md:leading-[1.05] font-light text-black"
          >
            {t.processSection.title}
          </InteractiveBlurTitle>
          <div className="mt-10 md:mt-16">
            {t.processSection.items.map((step) => (
              <article
                key={step.num}
                className="grid gap-3 md:gap-4 border-t border-black/15 py-5 md:py-6 md:grid-cols-12"
              >
                <span className="font-mono text-xs text-black/60 md:col-span-1">
                  {step.num}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl md:text-3xl text-black md:col-span-3">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm leading-5 md:leading-6 md:col-span-4 text-black/80">
                  {step.desc}
                </p>
                <p className="font-mono text-[10px] uppercase leading-5 text-black/60 md:col-span-3 md:col-start-10">
                  {step.output}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* INTELIGÊNCIA ARTIFICIAL APLICADA (COM MOLDURA DINÂMICA DE LINHAS NO SCROLL) */}
        <DynamicSectionFrame tag="INTELLIGENCE ENGINE" dark={false} className="border-t border-black/10">
          <section className="relative min-h-[50vh] md:min-h-[70vh] px-5 py-16 md:px-12 xl:px-[22vw] md:py-32">
            <div className="absolute -right-24 top-1/2 size-[36rem] -translate-y-1/2 rounded-full border border-black/10 pointer-events-none" />
            <div className="absolute right-16 top-1/2 size-72 -translate-y-1/2 rounded-full border border-black/10 pointer-events-none" />
            <div className="relative">
              <Eyebrow light>{t.aiSection.eyebrow}</Eyebrow>
              <InteractiveBlurTitle
                as="h2"
                className="mt-8 md:mt-12 max-w-4xl font-serif text-2xl sm:text-3xl md:text-6xl lg:text-7xl leading-[1.08] md:leading-[1.05] font-light text-black"
              >
                {t.aiSection.title}
              </InteractiveBlurTitle>
              <p className="mt-4 md:mt-8 max-w-xl text-xs sm:text-sm md:text-base leading-5 md:leading-7 text-black/80">
                {t.aiSection.desc}
              </p>
              <div className="mt-6 md:mt-10">
                <AnchorButton outline className="h-9 px-4 text-[10px] tracking-[0.16em] md:h-12 md:px-6">
                  {t.aiSection.cta}
                </AnchorButton>
              </div>
            </div>
          </section>
        </DynamicSectionFrame>

        {/* MODELOS DE ENTREGA: CONSTRUÇÃO, MANUTENÇÃO CONTÍNUA E MANUTENÇÃO COM AGENTE IA 24H */}
        <DeliveryPlansSection Eyebrow={Eyebrow} />
      </div>

      {/* PROJETOS (Sistemas em Movimento) COM CARDS STACKING E ROBÔ 3D FIXO (Fundo Preto #000000) */}
      <section
        id="projetos"
        className="border-t border-white/15 bg-[#000000] px-5 py-16 md:px-12 xl:pl-[14vw] xl:pr-12 2xl:pr-16 md:py-32 relative text-white"
      >
        <Eyebrow cyan>{t.systemsSection.eyebrow}</Eyebrow>
        <InteractiveBlurTitle
          as="h2"
          className="mt-8 md:mt-12 max-w-4xl font-serif text-2xl sm:text-3xl md:text-6xl lg:text-7xl leading-[1.08] md:leading-[1.05] font-light text-white"
        >
          {t.systemsSection.title}
        </InteractiveBlurTitle>

        {/* LAYOUT DE 2 COLUNAS: ESQUERDA CARDS COM SCROLL (6 col) | DIREITA ROBÔ 3D FIXO (6 col) */}
        <div className="mt-10 md:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative">
          {/* COLUNA ESQUERDA: 6 CARDS SUBINDO E SOBREPONDO O ANTERIOR NO SCROLL */}
          <div className="lg:col-span-6 relative pb-56">
            {t.systemsSection.items.map((item, i) => (
              <div
                key={item}
                style={{
                  top: `calc(5.5rem + ${i * 20}px)`,
                  zIndex: i + 1,
                }}
                className="sticky mb-12 sm:mb-16 md:mb-24 last:mb-0"
              >
                <article className="group flex min-h-[190px] sm:min-h-[220px] md:min-h-[280px] flex-col justify-between bg-[#0d0d0d] border border-white/15 p-5 sm:p-6 md:p-10 shadow-[0_-14px_35px_rgba(0,0,0,0.85)] hover:bg-[#141414] hover:border-white/30 transition-colors">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 md:pb-4">
                    <span className="font-mono text-xs tracking-widest text-cyan group-hover:text-white transition-colors">
                      FIELD // 0{i + 1}
                    </span>
                    <span className="font-mono text-[10px] text-white/50">
                      0{i + 1} / 06
                    </span>
                  </div>

                  <div className="my-4 md:my-6">
                    <h3 className="font-serif text-lg sm:text-xl md:text-3xl text-white font-light leading-snug">
                      {item}
                    </h3>
                  </div>

                  <div className="flex justify-end pt-3 md:pt-4 border-t border-white/10">
                    <ArrowRight className="size-4 md:size-5 text-white/60 transition-transform group-hover:translate-x-2 group-hover:text-cyan" />
                  </div>
                </article>
              </div>
            ))}
          </div>

          {/* COLUNA DIREITA: ROBÔ 3D FIXO (STICKY) APROVEITANDO O ESPAÇO À DIREITA */}
          <div className="lg:col-span-6 relative">
            <div className="lg:sticky lg:top-20 flex items-center justify-center">
              <div className="relative w-full h-[560px] sm:h-[640px] lg:h-[720px] xl:h-[780px] flex items-center justify-center overflow-visible">
                <div className="absolute size-96 md:size-[32rem] rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
                <RobotBust3D />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PALCO 3: TRANSIÇÃO PROJETOS (Bege) -> SOBRE (Preto) -> INSIGHTS (Bege) */}
      <AboutInsightsStage Eyebrow={Eyebrow} />

      {/* BLOCO CLARO CONTÍNUO: FAQ (Bege) */}
      <section className="border-t border-black/15 bg-[#ecece3] px-5 py-16 text-black md:px-12 xl:px-[22vw] md:py-32">
        <Eyebrow light>{t.faqsSection.eyebrow}</Eyebrow>
        <div className="mt-8 md:mt-12 grid gap-8 md:gap-12 md:grid-cols-12">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl lg:text-6xl leading-snug md:leading-tight font-light md:col-span-4 text-black">
            {t.faqsSection.title}
          </h2>
          <Accordion
            type="single"
            collapsible
            className="md:col-span-7 md:col-start-6"
          >
            {t.faqsSection.faqs.map((faq, i) => (
              <AccordionItem
                key={faq.q}
                value={`faq-${i}`}
                className="border-b border-black/15"
              >
                <AccordionTrigger className="py-4 md:py-5 font-serif text-base sm:text-lg md:text-xl text-black no-underline hover:no-underline text-left">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="max-w-xl pb-4 md:pb-5 text-xs sm:text-sm leading-5 md:leading-6 text-black/75">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CARROSSEL DE NOMES DE CLIENTES (MARQUEE LENTO EM FUNDO BEGE) */}
      <ClientsMarqueeSection Eyebrow={Eyebrow} />

      {/* PALCO 4: TRANSIÇÃO FAQ (Bege) -> DIAGNÓSTICO (Preto) */}
      <DiagnosisStage Eyebrow={Eyebrow} AnchorButton={AnchorButton} />
    </main>
  );
}

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <LanguageProvider>
        <LenisProvider>
          <HomeV6 />
        </LenisProvider>
      </LanguageProvider>
    </React.StrictMode>
  );
}

export default HomeV6;
