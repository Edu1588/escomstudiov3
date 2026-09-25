import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { InteractiveBlurTitle } from "@/components/v6/InteractiveBlurTitle";
import { ScrollGallery, type ScrollGallerySlide } from "@/components/ui/scroll-gallery";
import { Button } from "@/components/ui/button";

const worksSlides: ScrollGallerySlide[] = [
  {
    video: "https://res.cloudinary.com/djw0tqmiw/video/upload/v1790374497/450e2001cc633e92a38d435f6f4c232b.mp4",
  },
  {
    video: "https://res.cloudinary.com/djw0tqmiw/video/upload/v1790374497/b3ecccbe43103abe5da4f3b610af3a37.mp4",
  },
  {
    video: "https://res.cloudinary.com/djw0tqmiw/video/upload/v1790374501/dk5kshrywj6gti0f816w.mp4",
  },
  {
    video: "https://res.cloudinary.com/djw0tqmiw/video/upload/v1790374496/0263c8292333293669f42df6e2782ea6.mp4",
  },
  {
    video: "https://res.cloudinary.com/djw0tqmiw/video/upload/v1790374497/044516c3efd6b312e96495faa8d4f9ef.mp4",
  },
  {
    video: "https://res.cloudinary.com/djw0tqmiw/video/upload/v1790374502/043a2a2d03caf1f8adc4e143b2f976c4.mp4",
  },
  {
    video: "https://res.cloudinary.com/djw0tqmiw/video/upload/v1790374732/c1a0adede9aafa4edb54d55eff51287b.mp4",
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
        {/* COLUNA 1 (FIXA / STICKY): Conteúdo editorial da ESCOM Studio */}
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
                <span>Role para navegar pelos vídeos</span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUNA 2: Efeito de Scroll com Vídeos em Looping Contínuo sem controles e sem textos sobrepostos */}
        <div className="lg:col-span-7 relative border-t lg:border-t-0 lg:border-l border-white/10 bg-black">
          <ScrollGallery
            slides={worksSlides}
            variant="studio"
            embedded={true}
            scroller={scrollerTarget}
            embeddedScrollPerTransition={110}
            stripsCount={24}
            showInfoBand={false}
            showPrefix={false}
            showLink={false}
          />
        </div>
      </div>
    </section>
  );
}

export default FeaturedWorksSection;
