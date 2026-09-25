import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { InteractiveBlurTitle } from "@/components/v6/InteractiveBlurTitle";
import { ScrollGallery, type ScrollGallerySlide } from "@/components/ui/scroll-gallery";
import { Button } from "@/components/ui/button";

const worksSlides: ScrollGallerySlide[] = [
  {
    title: "Eion Studio // 3D Architecture",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1600",
    linkLabel: "Ver Case",
    url: "#diagnostico",
  },
  {
    title: "Clínica CI // Medical Growth & AI",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1600",
    linkLabel: "Ver Case",
    url: "#diagnostico",
  },
  {
    title: "Nexus Capital // Enterprise Portal",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1600",
    linkLabel: "Ver Case",
    url: "#diagnostico",
  },
  {
    title: "Apex Luxury // Editorial E-commerce",
    image: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&q=80&w=1600",
    linkLabel: "Ver Case",
    url: "#diagnostico",
  },
];

interface FeaturedWorksSectionProps {
  Eyebrow: React.ComponentType<{
    children: React.ReactNode;
    cyan?: boolean;
    light?: boolean;
    className?: string;
  }>;
}

export function FeaturedWorksSection({ Eyebrow }: FeaturedWorksSectionProps) {
  const scrollerTarget = typeof window !== "undefined" ? window : undefined;

  return (
    <section
      id="trabalhos"
      className="relative bg-[#000000] text-white border-t border-white/10 overflow-clip"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        {/* COLUNA 1 (FIXA / STICKY): Conteúdo editorial e contextual da ESCOM Studio */}
        <div className="lg:col-span-5 px-6 sm:px-10 md:px-12 xl:pl-[8vw] xl:pr-12 py-16 lg:py-0 flex flex-col justify-center lg:sticky lg:top-0 lg:h-screen z-20 bg-[#000000]">
          <div>
            <Eyebrow cyan>Portfólio Selecionado // Casos Reais</Eyebrow>

            <InteractiveBlurTitle
              as="h2"
              className="mt-6 md:mt-8 font-serif text-3xl sm:text-4xl md:text-5xl xl:text-6xl text-white font-light leading-[1.08] tracking-tight"
            >
              Alguns de nossos trabalhos
            </InteractiveBlurTitle>

            <p className="mt-6 text-xs sm:text-sm md:text-base leading-relaxed text-zinc-400 font-sans max-w-lg">
              Soluções completas onde estratégia de posicionamento, design suíço de alta precisão e engenharia de software se unem para transformar empresas em líderes de mercado.
            </p>

            {/* Marcadores Técnicos de Excelência */}
            <div className="mt-8 md:mt-10 space-y-4 border-t border-white/10 pt-6 max-w-lg">
              <div className="flex items-start gap-3">
                <span className="font-mono text-[10px] text-cyan pt-0.5">01 //</span>
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-wider text-white">Engenharia 120fps & 3D</h4>
                  <p className="text-[11px] text-zinc-400 leading-normal mt-0.5">
                    Interfaces ultra-rápidas, modelagem procedural e transições sem engasgos.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="font-mono text-[10px] text-cyan pt-0.5">02 //</span>
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-wider text-white">Arquitetura de Conversão</h4>
                  <p className="text-[11px] text-zinc-400 leading-normal mt-0.5">
                    Wireframes orientados a dados, UX persuasiva e CRO em cada detalhe visual.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="font-mono text-[10px] text-cyan pt-0.5">03 //</span>
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-wider text-white">Agentes IA & Automação</h4>
                  <p className="text-[11px] text-zinc-400 leading-normal mt-0.5">
                    Sistemas integrados para qualificação, agendamento e atendimento contínuo.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Alinhado */}
            <div className="mt-8 md:mt-10 flex flex-wrap items-center gap-4">
              <Button
                asChild
                className="h-11 px-6 text-[10px] uppercase tracking-[0.16em] font-mono bg-cyan text-black hover:bg-cyan/90 rounded-none transition-all"
              >
                <a href="#diagnostico">
                  <span>Iniciar Projeto</span>
                  <ArrowRight className="size-3.5 ml-2" />
                </a>
              </Button>

              <div className="flex items-center gap-2 text-zinc-500 font-mono text-[10px] uppercase tracking-wider">
                <Sparkles className="size-3 text-cyan" />
                <span>Role para navegar pelos projetos</span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUNA 2: Efeito de Scroll Gallery (Transição de Máscara por Fatias no Scroll) */}
        <div className="lg:col-span-7 relative border-t lg:border-t-0 lg:border-l border-white/10">
          <ScrollGallery
            slides={worksSlides}
            variant="studio"
            embedded={true}
            scroller={scrollerTarget}
            embeddedScrollPerTransition={110}
            stripsCount={24}
            prefixLabel="Projeto"
            linkLabel="Explorar"
            classNames={{
              info: "absolute top-1/2 left-0 z-[2] w-full -translate-y-1/2 border-white/20 border-b bg-black/40 backdrop-blur-md",
              infoInner: "flex items-center justify-between gap-4 px-6 md:px-10 py-3",
              titleText: "font-serif text-lg sm:text-2xl md:text-3xl text-white font-light tracking-tight",
              linkText: "font-mono text-xs uppercase tracking-widest text-cyan hover:underline",
              prefixText: "font-mono text-xs uppercase tracking-widest text-zinc-400",
            }}
          />
        </div>
      </div>
    </section>
  );
}

export default FeaturedWorksSection;
