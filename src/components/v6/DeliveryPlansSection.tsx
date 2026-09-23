import React from "react";
import { ArrowRight, Check } from "lucide-react";
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
      className="border-t border-black/10 bg-[#ecece3] px-5 py-16 text-black md:px-12 xl:px-[22vw] md:py-28"
    >
      <div className="max-w-4xl">
        <Eyebrow light>{t.plansSection.eyebrow}</Eyebrow>
        <InteractiveBlurTitle
          as="h2"
          className="mt-8 md:mt-12 font-serif text-2xl sm:text-3xl md:text-5xl lg:text-6xl leading-[1.08] md:leading-[1.05] font-light text-black"
        >
          {t.plansSection.title}
        </InteractiveBlurTitle>
      </div>

      <div className="mt-12 md:mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {plans.map((plan, idx) => {
          const isFeatured = plan.featured;
          return (
            <article
              key={plan.tag}
              className={`flex flex-col justify-between rounded-2xl p-6 sm:p-8 transition-all duration-300 ${
                isFeatured
                  ? "bg-[#faf7ee] border-2 border-[#b89552] shadow-lg shadow-[#b89552]/10"
                  : "bg-white border border-black/10 shadow-sm hover:shadow-md hover:border-black/20"
              }`}
            >
              <div>
                {/* Header do Card */}
                <div className="flex items-center justify-between gap-2 border-b border-black/10 pb-5">
                  <span
                    className={`font-mono text-[10px] uppercase tracking-[0.2em] font-semibold ${
                      isFeatured ? "text-[#997736]" : "text-black/60"
                    }`}
                  >
                    {plan.tag}
                  </span>
                  {isFeatured && (
                    <span className="font-mono text-[9px] uppercase tracking-wider bg-[#b89552]/15 text-[#886626] px-2.5 py-0.5 rounded-full font-medium">
                      24h AI
                    </span>
                  )}
                </div>

                {/* Título do Card */}
                <h3 className="mt-6 font-serif text-2xl sm:text-3xl text-black font-light leading-snug">
                  {plan.title}
                </h3>

                {/* Lista de Entregáveis */}
                <ul className="mt-6 space-y-3.5 border-t border-black/5 pt-6">
                  {plan.items.map((item, itemIdx) => (
                    <li
                      key={itemIdx}
                      className="flex items-start gap-3 text-xs sm:text-sm text-black/80 leading-relaxed"
                    >
                      <span
                        className={`mt-1.5 size-1.5 rounded-full shrink-0 ${
                          isFeatured ? "bg-[#b89552]" : "bg-black/50"
                        }`}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ação / CTA */}
              <div className="mt-8 pt-6 border-t border-black/10">
                <Button
                  asChild
                  className={`w-full h-11 text-xs uppercase tracking-[0.14em] font-mono justify-between transition-colors ${
                    isFeatured
                      ? "bg-[#b89552] text-white hover:bg-[#a07f3e]"
                      : "bg-black text-white hover:bg-black/85"
                  }`}
                >
                  <a href="#diagnostico">
                    <span>{plan.cta}</span>
                    <ArrowRight className="size-4" />
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
