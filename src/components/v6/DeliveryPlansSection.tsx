import React from "react";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/v6/LanguageContext";
import { Button } from "@/components/ui/button";
import { InteractiveBlurTitle } from "@/components/v6/InteractiveBlurTitle";

export function DeliveryPlansSection({
  Eyebrow,
}: {
  Eyebrow: React.ComponentType<{
    children: React.ReactNode;
    light?: boolean;
    cyan?: boolean;
  }>;
}) {
  const { t } = useLanguage();
  const plans = t.plansSection.plans;

  return (
    <section
      id="planos"
      className="border-t border-black/10 bg-[#ecece3] px-5 py-16 text-black md:px-10 lg:px-12 xl:px-[8vw] 2xl:px-[11vw] md:py-32"
    >
      {/* Cabeçalho da Seção com Identidade Suíça Editorial */}
      <div className="max-w-4xl">
        <Eyebrow light>{t.plansSection.eyebrow}</Eyebrow>
        <InteractiveBlurTitle
          as="h2"
          className="mt-8 md:mt-12 font-serif text-2xl sm:text-3xl md:text-5xl lg:text-6xl leading-[1.08] md:leading-[1.05] font-light text-black"
        >
          {t.plansSection.title}
        </InteractiveBlurTitle>
      </div>

      {/* Grade Arquitetônica de Colunas Técnicas (Estética Swiss / ESCOM Studio) */}
      <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 border-y md:border-l border-black/15">
        {plans.map((plan, idx) => {
          const isFeatured = plan.featured;
          const num = `0${idx + 1}`;

          return (
            <article
              key={plan.tag}
              className={`border-b md:border-b-0 md:border-r border-black/15 p-6 sm:p-8 lg:p-10 flex flex-col justify-between transition-colors duration-300 ${
                isFeatured
                  ? "bg-[#e5e5dc]/60 relative"
                  : "bg-transparent hover:bg-black/[0.015]"
              }`}
            >
              <div>
                {/* Cabeçalho Técnico da Coluna */}
                <div className="flex items-center justify-between gap-3 border-b border-black/15 pb-5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-black/50 tracking-wider">
                      {num} //
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold text-black/80">
                      {plan.tag}
                    </span>
                  </div>

                  {/* Badge de Destaque para o Agente IA (Identidade Cyan ESCOM) */}
                  {isFeatured && (
                    <div className="flex items-center gap-1.5 bg-black px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider text-[#00d1ff]">
                      <span className="size-1.5 rounded-full bg-[#00d1ff] animate-pulse" />
                      <span>24H ENGINE</span>
                    </div>
                  )}
                </div>

                {/* Título da Modalidade de Entrega */}
                <h3 className="mt-8 font-serif text-2xl sm:text-3xl lg:text-4xl text-black font-light leading-snug">
                  {plan.title}
                </h3>

                {/* Lista de Entregáveis Estruturados */}
                <ul className="mt-8 space-y-4 border-t border-black/10 pt-6">
                  {plan.items.map((item, itemIdx) => (
                    <li
                      key={itemIdx}
                      className="flex items-start gap-3 text-xs sm:text-sm text-black/75 leading-relaxed"
                    >
                      <span
                        className={`font-mono text-[11px] leading-5 shrink-0 ${
                          isFeatured ? "text-black font-bold" : "text-black/40"
                        }`}
                      >
                        ✦
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Botão de Ação Editorial alinhado ao Rodapé da Coluna */}
              <div className="mt-10 pt-6 border-t border-black/15">
                <Button
                  asChild
                  className={`w-full h-11 text-[10px] uppercase tracking-[0.16em] font-mono justify-between transition-all rounded-none ${
                    isFeatured
                      ? "bg-black text-[#ecece3] hover:bg-black/90 hover:text-white"
                      : "bg-transparent text-black border border-black/25 hover:bg-black hover:text-[#ecece3]"
                  }`}
                >
                  <a href="#diagnostico">
                    <span>{plan.cta}</span>
                    <ArrowRight className="size-3.5" />
                  </a>
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
