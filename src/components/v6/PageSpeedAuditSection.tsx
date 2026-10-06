import React, { useState, useEffect, useRef } from "react";
import { CheckCircle2, Zap, ShieldCheck, Search } from "lucide-react";
import { useLanguage } from "@/components/v6/LanguageContext";
import { InteractiveBlurTitle } from "@/components/v6/InteractiveBlurTitle";

interface MetricGaugeProps {
  score: number;
  label: string;
  sublabel?: string;
  delay?: number;
  inView: boolean;
  color?: string;
}

function MetricGauge({
  score,
  label,
  sublabel,
  inView,
  color = "#0CCE6B",
}: MetricGaugeProps) {
  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    if (!inView) {
      setCurrentScore(0);
      return;
    }

    let startTime: number | null = null;
    const duration = 1600; // 1.6s animação suave
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing out cubic: 1 - Math.pow(1 - progress, 3)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const val = Math.round(easeOut * score);

      setCurrentScore(val);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCurrentScore(score);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [inView, score]);

  // Cálculo da circunferência SVG (r = 44 => C ≈ 276.46)
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  // Offset: se score = 100, offset = 0; se score = 94, offset = C * 0.06;
  const targetOffset = circumference * (1 - (inView ? currentScore / 100 : 0));

  return (
    <div className="flex flex-col items-center select-none group">
      {/* CÍRCULO LIGHTHOUSE EXATAMENTE COMO NO GOOGLE PAGESPEED */}
      <div className="relative size-24 sm:size-28 md:size-32 flex items-center justify-center">
        {/* Fundo interno suave característico do Google Lighthouse (#e6f4ea) */}
        <div 
          className="absolute inset-2 sm:inset-2.5 rounded-full transition-all duration-500 group-hover:scale-105"
          style={{ backgroundColor: "rgba(12, 206, 107, 0.12)" }}
        />

        <svg
          className="size-full -rotate-90 transform"
          viewBox="0 0 100 100"
        >
          {/* Trilha do círculo (cinza claro suave / trilha de fundo) */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="rgba(12, 206, 107, 0.20)"
            strokeWidth="5"
          />

          {/* Anel de progresso verde oficial do PageSpeed (#0CCE6B) */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="5.5"
            strokeDasharray={circumference}
            strokeDashoffset={targetOffset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 0.1s ease-out",
            }}
          />
        </svg>

        {/* NÚMERO CENTRAL (Verde e negrito, exatamente como no anexo) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-sans font-bold text-2xl sm:text-3xl md:text-4xl tracking-tight"
            style={{ color: "#0CCE6B" }}
          >
            {currentScore}
          </span>
        </div>
      </div>

      {/* RÓTULO ABAIXO DO CÍRCULO */}
      <div className="mt-3 text-center">
        <span className="block text-xs sm:text-sm font-medium text-zinc-200 group-hover:text-white transition-colors leading-tight">
          {label}
        </span>
        {sublabel && (
          <span className="block text-xs sm:text-sm font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors leading-tight">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}

interface PageSpeedAuditSectionProps {
  Eyebrow?: React.ComponentType<{
    children: React.ReactNode;
    cyan?: boolean;
    light?: boolean;
    className?: string;
  }>;
}

export function PageSpeedAuditSection({ Eyebrow }: PageSpeedAuditSectionProps) {
  const { language } = useLanguage();
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Gatilho de animação via IntersectionObserver
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Scores do PageSpeed de acordo com o anexo do usuário (99 Desempenho, 94 Acessibilidade, 100 Práticas recomendadas, 100 SEO)
  const scores = { perf: 99, a11y: 94, bp: 100, seo: 100 };

  return (
    <section
      ref={sectionRef}
      id="performance"
      className="relative bg-[#000000] border-t border-white/10 text-white px-5 py-12 md:px-12 xl:px-[8vw] 2xl:px-[10vw] md:py-16 overflow-hidden"
    >
      {/* Luz ambiente de alta tecnologia esmeralda/ciano sutil */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[46rem] rounded-full bg-[#0CCE6B]/[0.035] blur-[160px] pointer-events-none" />

      {/* CABEÇALHO DA SEÇÃO */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {Eyebrow ? (
          <div className="flex justify-center">
            <Eyebrow cyan>GOOGLE PAGESPEED // CORE WEB VITALS</Eyebrow>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#0CCE6B] bg-[#0CCE6B]/10 border border-[#0CCE6B]/30 px-3 py-1 rounded-full">
            <span className="size-1.5 rounded-full bg-[#0CCE6B] animate-pulse" />
            <span>PAGESPEED INSIGHTS // CORE WEB VITALS</span>
          </div>
        )}

        <InteractiveBlurTitle
          as="h2"
          className="mt-6 md:mt-8 font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tight leading-[1.1]"
        >
          {language === "PT"
            ? "Todos os Nossos Sites São Otimizados ao Máximo."
            : language === "EN"
            ? "Every Website We Build Is Engineered for Maximum Speed."
            : "Todos Nuestros Sitios Están Optimizados al Máximo."}
        </InteractiveBlurTitle>

        <p className="mt-4 md:mt-5 text-xs sm:text-sm md:text-base text-zinc-400 max-w-2xl mx-auto font-sans leading-relaxed">
          {language === "PT"
            ? "Design de alto nível com engenharia de ponta. Nossas aplicações atingem pontuação máxima nos Core Web Vitals, garantindo carregamento instantâneo e máxima retenção de leads."
            : language === "EN"
            ? "World-class design backed by elite engineering. Our digital systems score in the top tier of Core Web Vitals, ensuring sub-second load times and maximum lead retention."
            : "Diseño de alto nivel con ingeniería de punta. Nuestros sistemas obtienen las máximas calificaciones en Core Web Vitals, garantizando carga instantánea."}
        </p>
      </div>

      {/* CARD PRINCIPAL COM AS NOTAS DE PERFORMANCE */}
      <div className="relative z-10 mt-10 md:mt-12 max-w-5xl mx-auto">
        <div className="rounded-3xl border border-white/15 bg-gradient-to-b from-[#111111] to-[#090909] p-6 sm:p-8 md:p-10 shadow-[0_30px_100px_rgba(0,0,0,0.85),0_0_60px_rgba(12,206,107,0.08)]">
          {/* GRID COM OS 4 CÍRCULOS EM DESTAQUE ABSOLUTO */}
          <div className="py-6 sm:py-8 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-center justify-center border-b border-white/10">
            {/* 1. Desempenho (99) */}
            <MetricGauge
              score={scores.perf}
              label="Desempenho"
              inView={inView}
              color="#0CCE6B"
            />

            {/* 2. Acessibilidade (94) */}
            <MetricGauge
              score={scores.a11y}
              label="Acessibilidade"
              inView={inView}
              color="#0CCE6B"
            />

            {/* 3. Práticas recomendadas (100) */}
            <MetricGauge
              score={scores.bp}
              label="Práticas"
              sublabel="recomendadas"
              inView={inView}
              color="#0CCE6B"
            />

            {/* 4. SEO (100) */}
            <MetricGauge
              score={scores.seo}
              label="SEO"
              inView={inView}
              color="#0CCE6B"
            />
          </div>

          {/* PAINEL DE MÉTRICAS ESSENCIAIS DA WEB (CORE WEB VITALS DETALHADO) */}
          <div className="pt-8">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-[#0CCE6B]" />
                <span className="text-xs sm:text-sm font-sans font-bold text-white">
                  Avaliação das Métricas Essenciais da Web (Core Web Vitals):
                </span>
                <span className="text-xs font-mono font-bold text-[#0CCE6B] bg-[#0CCE6B]/15 px-2 py-0.5 rounded-full border border-[#0CCE6B]/30">
                  APROVADA
                </span>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">
                Padrão Verde Google (Percentil 95)
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-black/40 border border-white/10 rounded-2xl p-3.5 sm:p-4 hover:border-[#0CCE6B]/40 transition-colors">
                <div className="text-[10px] font-mono uppercase text-zinc-400 mb-1 flex items-center justify-between">
                  <span>First Contentful Paint (FCP)</span>
                  <span className="size-2 rounded-full bg-[#0CCE6B]" />
                </div>
                <div className="font-mono text-lg sm:text-xl font-bold text-white">0.4 s</div>
                <div className="text-[10px] text-[#0CCE6B] font-medium mt-0.5">Ultrarrápido (Bom)</div>
              </div>

              <div className="bg-black/40 border border-white/10 rounded-2xl p-3.5 sm:p-4 hover:border-[#0CCE6B]/40 transition-colors">
                <div className="text-[10px] font-mono uppercase text-zinc-400 mb-1 flex items-center justify-between">
                  <span>Largest Contentful Paint (LCP)</span>
                  <span className="size-2 rounded-full bg-[#0CCE6B]" />
                </div>
                <div className="font-mono text-lg sm:text-xl font-bold text-white">0.8 s</div>
                <div className="text-[10px] text-[#0CCE6B] font-medium mt-0.5">Carregamento Instantâneo</div>
              </div>

              <div className="bg-black/40 border border-white/10 rounded-2xl p-3.5 sm:p-4 hover:border-[#0CCE6B]/40 transition-colors">
                <div className="text-[10px] font-mono uppercase text-zinc-400 mb-1 flex items-center justify-between">
                  <span>Total Blocking Time (TBT)</span>
                  <span className="size-2 rounded-full bg-[#0CCE6B]" />
                </div>
                <div className="font-mono text-lg sm:text-xl font-bold text-white">0 ms</div>
                <div className="text-[10px] text-[#0CCE6B] font-medium mt-0.5">Sem travamentos</div>
              </div>

              <div className="bg-black/40 border border-white/10 rounded-2xl p-3.5 sm:p-4 hover:border-[#0CCE6B]/40 transition-colors">
                <div className="text-[10px] font-mono uppercase text-zinc-400 mb-1 flex items-center justify-between">
                  <span>Cumulative Layout Shift (CLS)</span>
                  <span className="size-2 rounded-full bg-[#0CCE6B]" />
                </div>
                <div className="font-mono text-lg sm:text-xl font-bold text-white">0.00</div>
                <div className="text-[10px] text-[#0CCE6B] font-medium mt-0.5">Estabilidade visual perfeita</div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 PILARES DE AUTORIDADE TÉCNICA */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
            <Zap className="size-4 text-[#0CCE6B] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-sans font-bold text-white">Conversão de Vendas Superior</h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed mt-1">
                A cada 100ms a menos de carregamento, a taxa de conversão sobe até 8%. Seus clientes não esperam.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
            <Search className="size-4 text-cyan shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-sans font-bold text-white">Prioridade nos Algoritmos do Google</h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed mt-1">
                Desde o Google Page Experience Update, sites com notas 90+ nos Core Web Vitals recebem bônus de ranking orgânico.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
            <ShieldCheck className="size-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-sans font-bold text-white">Engenharia Sem Bloatware</h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed mt-1">
                Sem temas pesados de WordPress ou plugins lentos. Código enxuto, assets compactados e CDNs globais edge.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PageSpeedAuditSection;
