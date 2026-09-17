import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitTextReveal } from "@/components/v6/SplitTextReveal";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import heroImage from "@/assets/escom-hero.jpg";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform vec3 uColor;
  uniform float uProgress;
  uniform vec2 uResolution;
  uniform float uTime;
  
  float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }
  
  void main() {
    // Se o progresso for <= 0.005 (início/sem scroll), descarta 100% dos fragmentos.
    // Garante que nenhum pixel pisque no Hero no frame 0.
    if (uProgress <= 0.005) {
      discard;
    }

    // Micro-pixels densos: escala para grãos ultra finos (~1.5px a 2px) como na referência
    float pixelsX = clamp(uResolution.x * 0.48, 700.0, 1000.0); 
    float pixelsY = pixelsX * (uResolution.y / uResolution.x);
    vec2 grid = vec2(pixelsX, pixelsY);
    
    vec2 pUv = floor(vUv * grid) / grid;
    
    vec2 aspectUv = pUv;
    aspectUv.x *= uResolution.x / uResolution.y;
    vec2 aspectCenter = vec2(0.5 * (uResolution.x / uResolution.y), 0.5);
    
    vec2 dBox = abs(aspectUv - aspectCenter);
    float boxDist = max(dBox.x / aspectCenter.x, dBox.y / aspectCenter.y);
    float radialDist = length(dBox) / length(aspectCenter);
    float shapeDist = mix(boxDist, radialDist, 0.35);
    
    float n = hash(pUv * 876.54);
    float threshold = 0.04 + shapeDist * 0.70 + n * 0.26;
    float band = 0.18;
    
    bool show = false;
    if (uProgress >= threshold + band) {
      show = true;
    } else if (uProgress <= threshold - band) {
      show = false;
    } else {
      float prob = (uProgress - (threshold - band)) / (2.0 * band);
      float grain = hash(pUv * 1423.17 + fract(uTime * 15.0));
      if (grain < prob) {
        show = true;
      }
    }
    
    if (!show) {
      discard;
    }
    
    gl_FragColor = vec4(uColor, 1.0);
  }
`;

function Scene({ color, progressRef }: { color: string; progressRef: React.MutableRefObject<number> }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const colorVec = new THREE.Color(color);
  const { size } = useThree();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uProgress.value = progressRef.current;
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
        uniforms={{
          uColor: { value: colorVec },
          uProgress: { value: 0 },
          uTime: { value: 0 },
          uResolution: { value: new THREE.Vector2(size.width, size.height) }
        }}
      />
    </mesh>
  );
}

export function HeroManifestoStage({
  Eyebrow,
  AnchorButton,
}: {
  Eyebrow: React.ComponentType<{ children: React.ReactNode; light?: boolean }>;
  AnchorButton: React.ComponentType<{ children: React.ReactNode }>;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const manifestoRef = useRef<HTMLDivElement>(null);
  const pixelLayerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0.0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const stage = stageRef.current;
    const screen = screenRef.current;
    const hero = heroRef.current;
    const manifesto = manifestoRef.current;
    const pixel = pixelLayerRef.current;

    if (!stage || !screen || !hero || !manifesto || !pixel) return;

    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: "+=130%",
          pin: screen,
          pinSpacing: true,
          scrub: 0.7,
          anticipatePin: 1,
        },
      });

      // 1. O Hero faz fade out suave enquanto os micro-pixels claros tomam a tela (0.04 a 0.38)
      tl.to(
        hero,
        {
          opacity: 0,
          y: -25,
          duration: 0.34,
          ease: "power1.inOut",
        },
        0.04
      );

      // 2. Os micro-pixels WebGL da cor clara (#ECECE3) crescem e cobrem 100% da tela (0.04 a 0.55)
      // Um único fluxo contínuo onde a poeira stardust se expande até a tela ficar clara!
      tl.fromTo(
        progressRef,
        { current: 0.0 },
        {
          current: 1.35,
          duration: 0.51,
          ease: "none",
        },
        0.04
      );

      // 3. O conteúdo do Manifesto emerge com revelação óptica de desfoque/blur gradual (conforme a referência)
      // As letras iniciam difusas/borradas e cristalizam em foco nítido à medida que o fundo se consolida
      const manifestoChildren = Array.from(manifesto.children);

      tl.fromTo(
        manifesto,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.35,
          ease: "power2.out",
          onStart: () => {
            manifesto.style.pointerEvents = "auto";
          },
        },
        0.15
      );

      tl.fromTo(
        manifestoChildren,
        {
          opacity: 0,
          filter: "blur(16px)",
          y: 16,
        },
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          duration: 0.45,
          stagger: 0.08,
          ease: "power2.out",
        },
        0.18
      );
    }, stage);

    return () => {
      ctx.revert();
    };
  }, [mounted]);

  return (
    <div ref={stageRef} className="relative w-full">
      {/* Viewport fixado onde a transição de pixel ocorre com precisão */}
      <div
        ref={screenRef}
        className="relative h-screen w-full overflow-hidden bg-[#000000]"
      >
        {/* CAMADA INFERIOR (Z-10): HERO (Fundo escuro, 100% visível ao entrar no site) */}
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

        {/* CAMADA INTERMEDIÁRIA (Z-20): THREE.JS PIXEL SHADER (Shader WebGL com ruído de blocos claros) */}
        {mounted && (
          <div
            ref={pixelLayerRef}
            className="absolute inset-0 z-20 pointer-events-none"
          >
            <Canvas
              camera={{ position: [0, 0, 1] }}
              gl={{ alpha: true, antialias: false }}
              resize={{ scroll: false }}
            >
              <Scene color="#ecece3" progressRef={progressRef} />
            </Canvas>
          </div>
        )}

        {/* CAMADA SUPERIOR (Z-30): CONTEÚDO DO MANIFESTO (Emerge NA FRENTE do canvas bege logo após o fundo mudar de cor) */}
        <section
          ref={manifestoRef}
          className="absolute inset-0 z-30 flex flex-col justify-center px-5 py-12 text-[#000000] md:px-12 xl:px-[22vw] opacity-0 pointer-events-none"
        >
          <Eyebrow light>O crescimento não acontece em partes isoladas</Eyebrow>
          <h2 className="mt-12 max-w-6xl font-serif text-4xl leading-[1.05] font-light md:text-6xl lg:text-7xl">
            Um site desconectado. Uma marca sem direção. Tráfego sem estratégia.
            Automação sem contexto.
          </h2>
          <div className="mt-14 grid gap-8 border-t border-black/15 pt-8 md:grid-cols-12">
            <p className="md:col-span-5 md:col-start-7 text-base leading-7 md:text-lg md:leading-8 text-black/80">
              Muitas empresas investem em canais, ferramentas e campanhas que não
              conversam entre si. O resultado é uma operação difícil de medir,
              leads perdidos e uma presença digital que não acompanha a ambição
              do negócio.
            </p>
            <p className="font-serif text-2xl md:col-span-6 md:col-start-7 md:text-3xl text-black">
              A ESCOM organiza as partes para que o sistema inteiro trabalhe a
              favor do crescimento.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
