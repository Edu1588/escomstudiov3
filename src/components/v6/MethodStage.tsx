import React from "react";
import { useLanguage } from "@/components/v6/LanguageContext";
import { InteractiveBlurTitle } from "@/components/v6/InteractiveBlurTitle";

export function MethodStage({
  Eyebrow,
}: {
  Eyebrow: React.ComponentType<{
    children: React.ReactNode;
    light?: boolean;
    cyan?: boolean;
  }>;
}) {
  const { t } = useLanguage();

  return (
    <section
      id="metodo"
      className="relative z-20 w-full flex flex-col justify-center px-5 py-16 md:py-24 text-[#000000] md:px-12 xl:px-[22vw] bg-[#ecece3] border-t border-black/10 overflow-hidden"
    >
      {/* Grade de Linhas Dinâmicas com nós ✦ (Referência The Model) */}
      <div className="method-grid-frame absolute inset-0 pointer-events-none z-0">
        <div className="method-tag absolute top-6 left-[8vw] font-mono text-[9px] uppercase tracking-[0.2em] text-black/60 flex items-center gap-2">
          <div className="grid grid-cols-2 gap-[2px] opacity-70">
            <div className="size-1 bg-current" />
            <div className="size-1 bg-current" />
            <div className="size-1 bg-current" />
            <div className="size-1 bg-current" />
          </div>
          <span>-- {t.method.tag}</span>
        </div>

        <div className="method-line-top absolute inset-x-0 top-12 h-px bg-black/15" />
        <div className="method-line-bottom absolute inset-x-0 bottom-12 h-px bg-black/15" />
        <div className="method-line-left absolute inset-y-0 left-[8vw] w-px bg-black/15" />
        <div className="method-line-right absolute inset-y-0 right-[8vw] w-px bg-black/15" />

        <div className="method-star-tl absolute top-12 left-[8vw] -translate-x-1/2 -translate-y-1/2 text-black/80 font-serif text-sm">✦</div>
        <div className="method-star-tr absolute top-12 right-[8vw] translate-x-1/2 -translate-y-1/2 text-black/80 font-serif text-sm">✦</div>
        <div className="method-star-bl absolute bottom-12 left-[8vw] -translate-x-1/2 translate-y-1/2 text-black/80 font-serif text-sm">✦</div>
        <div className="method-star-br absolute bottom-12 right-[8vw] translate-x-1/2 translate-y-1/2 text-black/80 font-serif text-sm">✦</div>
      </div>

      <div className="relative z-10">
        <Eyebrow light>{t.method.eyebrow}</Eyebrow>
        <InteractiveBlurTitle
          as="h2"
          className="mt-6 md:mt-10 max-w-5xl font-serif text-2xl sm:text-3xl md:text-6xl lg:text-7xl leading-[1.1] md:leading-[1.05] font-light text-[#000000]"
        >
          {t.method.title}
        </InteractiveBlurTitle>
        <div className="mt-6 md:mt-12 grid gap-6 md:gap-12 md:grid-cols-12">
          <p className="text-xs sm:text-sm md:text-lg leading-5 md:leading-8 md:col-span-5 text-black/80">
            {t.method.desc}
          </p>
          <div className="md:col-span-6 md:col-start-7">
            {t.method.steps.map((x, i) => (
              <div
                key={x}
                className="flex gap-4 md:gap-5 border-t border-black/15 py-3 md:py-4"
              >
                <span className="font-mono text-[9px] md:text-[10px] text-black/60">
                  0{i + 1}
                </span>
                <p className="font-serif text-base sm:text-lg md:text-2xl text-black">
                  {x}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default MethodStage;
