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
}: {
  children: React.ReactNode;
  outline?: boolean;
}) {
  return (
    <Button
      asChild
      size="xl"
      variant={outline ? "editorialOutline" : "editorial"}
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
    <main className="relative overflow-x-hidden bg-[#000000] text-foreground pb-8">
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
              className="group grid gap-5 border-b border-border/40 py-9 md:grid-cols-12 md:items-start"
            >
              <span className="font-mono text-xs text-cyan md:col-span-1">
                {service.num}
              </span>
              <h3 className="font-serif text-3xl md:col-span-3 md:text-4xl text-foreground">
                {service.title}
              </h3>
              <p className="text-sm leading-6 md:col-span-4 text-muted-foreground">
                {service.desc}
              </p>
              <div className="md:col-span-3">
                <p className="font-mono text-[9px] uppercase leading-5 tracking-[0.1em] text-muted-foreground/80">
                  {service.items}
                </p>
                <a
                  href="#diagnostico"
                  className="mt-5 inline-flex items-center gap-2 border-b border-cyan pb-1 text-xs font-semibold text-cyan hover:opacity-80 transition-opacity"
                >
                  {service.cta}
                  <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* PALCO 2: TRANSIÇÃO SOLUÇÕES (Preto) -> MÉTODO (Bege) */}
      <MethodStage Eyebrow={Eyebrow} />

      {/* BLOCO CLARO CONTÍNUO (Fundo Bege #ecece3 sem nenhum pixel entre seções) */}
      <div className="bg-[#ecece3] text-[#000000]">
        {/* JORNADA DIGITAL (5 Colunas) */}
        <section className="px-5 py-24 md:px-12 xl:px-[22vw] md:py-32 border-t border-black/10">
          <Eyebrow light>{t.journey.eyebrow}</Eyebrow>
          <h2 className="mt-12 max-w-4xl font-serif text-4xl leading-[1.05] font-light md:text-6xl lg:text-7xl text-black">
            {t.journey.title}
          </h2>
          <div className="mt-16 grid border-y border-black/15 md:grid-cols-5">
            {t.journey.items.map((step) => (
              <article
                key={step.num}
                className="border-b border-black/15 p-5 md:min-h-96 md:border-r md:border-b-0"
              >
                <span className="font-mono text-[10px] text-black/50">{step.num}</span>
                <h3 className="mt-16 font-serif text-2xl md:text-3xl text-black">
                  {step.title}
                </h3>
                <p className="mt-5 text-sm leading-6 text-black/80">{step.desc}</p>
                <p className="mt-8 font-mono text-[9px] uppercase leading-5 text-black/60">
                  {step.related}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-10 text-right font-serif text-2xl md:text-3xl text-black">
            {t.journey.footer}
          </p>
        </section>

        {/* PROCESSO (5 Etapas) */}
        <section
          id="processo"
          className="px-5 py-24 md:px-12 xl:px-[22vw] md:py-32 border-t border-black/10"
        >
          <Eyebrow light>{t.processSection.eyebrow}</Eyebrow>
          <h2 className="mt-12 max-w-4xl font-serif text-4xl leading-[1.05] font-light md:text-6xl lg:text-7xl text-black">
            {t.processSection.title}
          </h2>
          <div className="mt-16">
            {t.processSection.items.map((step) => (
              <article
                key={step.num}
                className="grid gap-4 border-t border-black/15 py-6 md:grid-cols-12"
              >
                <span className="font-mono text-xs text-black/60 md:col-span-1">
                  {step.num}
                </span>
                <h3 className="font-serif text-3xl md:col-span-3 text-black">
                  {step.title}
                </h3>
                <p className="text-sm leading-6 md:col-span-4 text-black/80">
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
          <section className="relative min-h-[70vh] px-5 py-24 md:px-12 xl:px-[22vw] md:py-32">
            <div className="absolute -right-24 top-1/2 size-[36rem] -translate-y-1/2 rounded-full border border-black/10 pointer-events-none" />
            <div className="absolute right-16 top-1/2 size-72 -translate-y-1/2 rounded-full border border-black/10 pointer-events-none" />
            <div className="relative">
              <Eyebrow light>{t.aiSection.eyebrow}</Eyebrow>
              <h2 className="mt-12 max-w-4xl font-serif text-4xl leading-[1.05] font-light md:text-6xl lg:text-7xl text-black">
                {t.aiSection.title}
              </h2>
              <p className="mt-8 max-w-xl text-base leading-7 md:text-lg md:leading-8 text-black/80">
                {t.aiSection.desc}
              </p>
              <div className="mt-10">
                <AnchorButton outline>
                  {t.aiSection.cta}
                </AnchorButton>
              </div>
            </div>
          </section>
        </DynamicSectionFrame>

        {/* PROJETOS (Sistemas em Movimento) COM MOLDURA DINÂMICA DE LINHAS NO SCROLL & ROBÔ 3D STICKY */}
        <DynamicSectionFrame tag="SYSTEMS IN MOTION" dark={false} className="border-t border-black/10">
          <section
            id="projetos"
            className="px-5 py-24 md:px-12 xl:px-[14vw] md:py-32"
          >
            <Eyebrow light>{t.systemsSection.eyebrow}</Eyebrow>
            <h2 className="mt-12 max-w-4xl font-serif text-4xl leading-[1.05] font-light md:text-6xl lg:text-7xl text-black">
              {t.systemsSection.title}
            </h2>

            {/* LAYOUT DE 2 COLUNAS: ESQUERDA CARDS COM SCROLL | DIREITA ROBÔ 3D FIXO (STICKY) */}
            <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start relative">
              {/* COLUNA ESQUERDA: 6 CARDS DE CONTEÚDO SUBINDO COM O SCROLL */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                {t.systemsSection.items.map((item, i) => (
                  <article
                    key={item}
                    className="group flex min-h-56 flex-col justify-between bg-[#ecece3] border border-black/15 p-8 hover:bg-[#e4e4db] transition-colors"
                  >
                    <span className="font-mono text-[10px] text-black/50">
                      FIELD / 0{i + 1}
                    </span>
                    <h3 className="font-serif text-2xl md:text-3xl text-black font-light leading-snug">
                      {item}
                    </h3>
                    <div className="flex justify-end pt-4">
                      <ArrowRight className="size-5 text-black/60 transition-transform group-hover:translate-x-2" />
                    </div>
                  </article>
                ))}
              </div>

              {/* COLUNA DIREITA: ROBÔ 3D FIXO (STICKY) ACOMPANHANDO A ROLAGEM */}
              <div className="lg:col-span-5 lg:sticky lg:top-28 flex items-center justify-center">
                <div className="relative w-full h-[460px] sm:h-[520px] lg:h-[620px] flex items-center justify-center">
                  <div className="absolute size-72 md:size-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
                  <RobotBust3D />
                </div>
              </div>
            </div>
          </section>
        </DynamicSectionFrame>
      </div>

      {/* PALCO 3: TRANSIÇÃO PROJETOS (Bege) -> SOBRE (Preto) -> INSIGHTS (Bege) */}
      <AboutInsightsStage Eyebrow={Eyebrow} />

      {/* BLOCO CLARO CONTÍNUO: FAQ (Bege) */}
      <section className="border-t border-black/15 bg-[#ecece3] px-5 py-24 text-black md:px-12 xl:px-[22vw] md:py-32">
        <Eyebrow light>{t.faqsSection.eyebrow}</Eyebrow>
        <div className="mt-12 grid gap-12 md:grid-cols-12">
          <h2 className="font-serif text-4xl leading-tight font-light md:col-span-4 md:text-5xl lg:text-6xl text-black">
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
                <AccordionTrigger className="py-5 font-serif text-lg md:text-xl text-black no-underline hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="max-w-xl pb-5 text-sm leading-6 text-black/75">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

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
