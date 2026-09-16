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
  
  float rand(vec2 n) { 
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }
  
  void main() {
    float pixelsX = 220.0; 
    float pixelsY = pixelsX * (uResolution.y / uResolution.x);
    vec2 grid = vec2(pixelsX, pixelsY);
    
    vec2 pUv = floor(vUv * grid) / grid;
    
    vec2 aspectUv = pUv;
    aspectUv.x *= uResolution.x / uResolution.y;
    vec2 aspectCenter = vec2(0.5 * (uResolution.x / uResolution.y), 0.5);
    
    float dist = distance(aspectUv, aspectCenter) / distance(vec2(0.0), aspectCenter);
    float n = rand(pUv);
    
    float threshold = dist * 0.62 + n * 0.38;
    
    float band = 0.08;
    bool showB = false;
    
    if (uProgress > threshold + band) {
      showB = true;
    } else if (uProgress < threshold - band) {
      showB = false;
    } else {
      float prob = (uProgress - (threshold - band)) / (2.0 * band);
      float flickerNoise = rand(pUv * 100.0 + uTime * 15.0);
      if (flickerNoise < prob) {
        showB = true;
      }
    }
    
    if (!showB) {
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
  const heroContentRef = useRef<HTMLDivElement>(null);
  const manifestoContentRef = useRef<HTMLDivElement>(null);
  const pixelLayerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(-0.2);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const stage = stageRef.current;
    const screen = screenRef.current;
    const hero = heroContentRef.current;
    const manifesto = manifestoContentRef.current;
    const pixel = pixelLayerRef.current;

    if (!stage || !screen || !hero || !manifesto || !pixel) return;

    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: "+=160%",
          pin: screen,
          pinSpacing: true,
          scrub: 0.8,
          anticipatePin: 1,
        },
      });

      // 1. Hero fade-out (0.00 a 0.35)
      tl.to(
        hero,
        {
          opacity: 0,
          y: -40,
          duration: 0.35,
          ease: "power2.inOut",
        },
        0
      );

      // 2. Pixels crescem de -0.2 até 1.4 (0.05 a 0.50) cobrindo 100% da tela com bege (#ECECE3)
      tl.fromTo(
        progressRef,
        { current: -0.2 },
        {
          current: 1.4,
          duration: 0.45,
          ease: "none",
        },
        0.05
      );

      // 3. Em 0.50: A tela está 100% bege sólida.
      // Ativamos a visibilidade do manifesto por baixo dos pixels
      tl.set(manifesto, { pointerEvents: "auto" }, 0.5);

      // 4. Pixels dissolvem de 1.4 para -0.2 (0.50 a 0.95)
      tl.to(
        progressRef,
        {
          current: -0.2,
          duration: 0.45,
          ease: "none",
        },
        0.5
      );

      // 5. O conteúdo do Manifesto aparece no lugar com fade-in suave e subida elegante (0.50 a 0.85)
      tl.fromTo(
        manifesto,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: "power2.out",
        },
        0.5
      );
    }, stage);

    return () => {
      ctx.revert();
    };
  }, [mounted]);

  return (
    <div ref={stageRef} className="relative w-full">
      {/* Viewport fixado onde a mágica acontece sem nada rolar fora do lugar */}
      <div
        ref={screenRef}
        className="relative h-screen w-full overflow-hidden bg-[#000000]"
      >
        {/* CAMADA 1: HERO (Dark, fundo preto, imagem com esfera azul e tipografia) */}
        <section
          id="top"
          ref={heroContentRef}
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

        {/* CAMADA 2: MANIFESTO (Cream #ECECE3, fundo bege da marca com manifesto editorial) */}
        <section
          ref={manifestoContentRef}
          className="absolute inset-0 z-15 flex flex-col justify-center px-5 py-12 text-foreground md:px-12 xl:px-[22vw] bg-[#ecece3] opacity-0 pointer-events-none"
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

        {/* CAMADA 3: THREE.JS PIXEL SHADER CANVAS (Fica em z-30 cobrindo e desfazendo entre as duas seções) */}
        {mounted && (
          <div
            ref={pixelLayerRef}
            className="absolute inset-0 z-30 pointer-events-none"
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
      </div>
    </div>
  );
}
