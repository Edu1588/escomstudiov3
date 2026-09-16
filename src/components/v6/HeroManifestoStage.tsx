import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitTextReveal } from "@/components/v6/SplitTextReveal";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import heroImage from "@/assets/escom-hero.jpg";

export function HeroManifestoStage({
  Eyebrow,
  AnchorButton,
}: {
  Eyebrow: React.ComponentType<{ children: React.ReactNode; light?: boolean }>;
  AnchorButton: React.ComponentType<{ children: React.ReactNode }>;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const manifestoRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const stage = stageRef.current;
    const screen = screenRef.current;
    const manifesto = manifestoRef.current;
    const hero = heroRef.current;

    if (!stage || !screen || !manifesto || !hero) return;

    // Resolução da máscara de pixels (grid de blocos tipo 8-bit chunky)
    const W = 160;
    const H = 90;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const imgData = ctx.createImageData(W, H);
    const data32 = new Uint32Array(imgData.data.buffer);

    // Pré-computa distâncias radiais e ruído pseudo-randômico estável para cada bloco
    const thresholdMap = new Float32Array(W * H);
    const aspect = W / H;
    const maxDist = Math.sqrt(0.5 * aspect * 0.5 * aspect + 0.5 * 0.5);

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const idx = y * W + x;
        const u = x / W;
        const v = y / H;
        const dx = (u - 0.5) * aspect;
        const dy = v - 0.5;
        const dist = Math.sqrt(dx * dx + dy * dy) / maxDist;
        // Ruído fractal baseado em senos para padrão orgânico brutalista consistente
        const n = Math.abs(
          Math.sin(x * 12.9898 + y * 78.233) * 43758.5453 % 1
        );
        thresholdMap[idx] = dist * 0.65 + n * 0.35;
      }
    }

    const applyPixelMask = (progress: number) => {
      if (progress <= 0.01) {
        manifesto.style.webkitMaskImage = "radial-gradient(circle, transparent 0, transparent 100%)";
        manifesto.style.maskImage = "radial-gradient(circle, transparent 0, transparent 100%)";
        manifesto.style.opacity = "0";
        return;
      }

      manifesto.style.opacity = "1";

      if (progress >= 0.99) {
        manifesto.style.webkitMaskImage = "none";
        manifesto.style.maskImage = "none";
        return;
      }

      // Mapeia progress (0 a 1) para o sweep de threshold (-0.1 a 1.25)
      const currentThresh = progress * 1.35 - 0.1;
      const band = 0.08;

      for (let i = 0; i < thresholdMap.length; i++) {
        const th = thresholdMap[i];
        if (currentThresh > th + band) {
          // Branco opaco (revela a Seção 2 com seus textos dentro)
          data32[i] = 0xffffffff;
        } else if (currentThresh < th - band) {
          // Transparente (continua mostrando o Hero escuro atrás)
          data32[i] = 0x00000000;
        } else {
          // Zona de transição com cintilação de ruído nos limites
          const prob = (currentThresh - (th - band)) / (2.0 * band);
          const flicker = Math.random();
          data32[i] = flicker < prob ? 0xffffffff : 0x00000000;
        }
      }

      ctx.putImageData(imgData, 0, 0);
      const maskUrl = `url(${canvas.toDataURL("image/png")})`;
      manifesto.style.webkitMaskImage = maskUrl;
      manifesto.style.maskImage = maskUrl;
      manifesto.style.webkitMaskSize = "100% 100%";
      manifesto.style.maskSize = "100% 100%";
      manifesto.style.webkitMaskRepeat = "no-repeat";
      manifesto.style.maskRepeat = "no-repeat";
    };

    // Estado inicial: Hero visível, Manifesto com máscara zerada
    applyPixelMask(0);

    const progressObj = { value: 0 };
    let ctxGsap = gsap.context(() => {
      gsap.to(progressObj, {
        value: 1,
        ease: "none",
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: "+=130%",
          pin: screen,
          pinSpacing: true,
          scrub: 0.6,
          anticipatePin: 1,
          onUpdate: (self) => {
            applyPixelMask(self.progress);
          },
        },
      });
    }, stage);

    return () => {
      ctxGsap.revert();
    };
  }, [mounted]);

  return (
    <div ref={stageRef} className="relative w-full">
      {/* Viewport fixado que segura a tela enquanto a transição de pixel acontece */}
      <div
        ref={screenRef}
        className="relative h-screen w-full overflow-hidden bg-[#000000]"
      >
        {/* CAMADA INFERIOR (Z-10): HERO (Escuro, 100% visível desde o carregamento inicial) */}
        <section
          id="top"
          ref={heroRef}
          className="absolute inset-0 z-10 flex flex-col justify-between pt-20 dark bg-background text-foreground"
        >
          <img
            src={heroImage}
            alt="Diretor criativo observa uma esfera azul, símbolo de um sistema digital em evolução"
            width={1536}
            height={1024}
            className="absolute inset-0 h-full w-full object-cover object-[62%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/75 to-transparent" />
          <div className="relative flex min-h-[calc(100vh-5rem)] flex-1 flex-col justify-between px-5 py-8 md:px-12 xl:px-[22vw] md:py-12">
            <Eyebrow>ESCOM STUDIO · DIGITAL GROWTH SYSTEMS</Eyebrow>
            <div className="max-w-4xl py-16">
              <SplitTextReveal
                type="words"
                className="max-w-3xl font-serif text-5xl leading-[0.95] font-light md:text-7xl lg:text-[5.5rem]"
              >
                Transformamos presença digital em sistemas que geram crescimento.
              </SplitTextReveal>
              <p className="mt-7 max-w-2xl text-sm leading-6 md:text-base">
                Criamos sites, marcas, automações, experiências com inteligência
                artificial e operações de tráfego pago para empresas que precisam
                atrair melhor, vender mais e operar com menos fricção.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <AnchorButton>Iniciar diagnóstico</AnchorButton>
                <Button asChild variant="editorialOutline" size="xl">
                  <a href="#solucoes">
                    Explorar soluções
                    <ArrowDown />
                  </a>
                </Button>
              </div>
              <p className="mt-5 max-w-xl text-xs leading-5 text-muted-foreground">
                Conte-nos onde você está e onde quer chegar. Identificamos as
                oportunidades mais importantes para o seu próximo ciclo.
              </p>
            </div>
            <div className="flex flex-wrap justify-between gap-3 border-t border-border pt-4 font-mono text-[9px] uppercase tracking-[0.12em]">
              <span>Strategy // Design // Code // Automation // Media</span>
              <span>System status: ready</span>
              <span>Built for conversion</span>
            </div>
          </div>
        </section>

        {/* CAMADA SUPERIOR (Z-20): MANIFESTO (Com a máscara de pixels aplicada - a cor clara que entra JÁ TRAZ TODO O CONTEÚDO!) */}
        <section
          ref={manifestoRef}
          className="absolute inset-0 z-20 flex flex-col justify-center px-5 py-12 text-foreground md:px-12 xl:px-[22vw] bg-[#ecece3] text-[#000000]"
          style={{
            imageRendering: "pixelated",
          }}
        >
          <Eyebrow light>O crescimento não acontece em partes isoladas</Eyebrow>
          <h2 className="mt-12 max-w-6xl font-serif text-4xl leading-[1.05] font-light md:text-6xl lg:text-7xl">
            Um site desconectado. Uma marca sem direção. Tráfego sem estratégia.
            Automação sem contexto.
          </h2>
          <div className="mt-14 grid gap-8 border-t border-border/30 pt-8 md:grid-cols-12">
            <p className="md:col-span-5 md:col-start-7 text-base leading-7 md:text-lg md:leading-8">
              Muitas empresas investem em canais, ferramentas e campanhas que não
              conversam entre si. O resultado é uma operação difícil de medir,
              leads perdidos e uma presença digital que não acompanha a ambição
              do negócio.
            </p>
            <p className="font-serif text-2xl md:col-span-6 md:col-start-7 md:text-3xl">
              A ESCOM organiza as partes para que o sistema inteiro trabalhe a
              favor do crescimento.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
