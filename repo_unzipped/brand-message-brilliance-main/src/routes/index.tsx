import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

const SERVICES = [
  { n: "01", name: "Identidade", desc: "Sistemas de marca imponentes que constroem percepção de valor inquestionável. Tipografia, arquitetura visual e tom de voz lapidados como um único organismo." },
  { n: "02", name: "Produto Digital", desc: "Interfaces desenhadas com precisão cirúrgica. UX/UI orientado a remover gargalos e guiar o usuário ao próximo passo com fricção zero." },
  { n: "03", name: "Landing Pages", desc: "Páginas brutalistas para tráfego pago em escala. Carregamento instantâneo, engenharia de conversão e bounce-rate cirúrgico." },
  { n: "04", name: "E-commerce", desc: "Plataformas integradas a CRM próprio e dashboard ao vivo. Saiba o que está sendo visto, adicionado ao carrinho e comprado — em tempo real." },
  { n: "05", name: "Sistemas Web", desc: "Intranets, portais de cliente, CRMs sob medida e BIs. Automações que eliminam tarefas manuais e centralizam operação." },
  { n: "06", name: "Engenharia", desc: "Código modular em Next.js, React, Node e Tailwind. Arquitetura técnica construída para escalar sem teto." },
];

const PHASES = [
  { n: "phase_01", title: "Mapeamento", desc: "Diagnóstico profundo de objetivos, público e gargalos. Definimos arquitetura de informação e fluxos de automação." },
  { n: "phase_02", title: "Design", desc: "Interfaces de alto impacto. Tipografia, hierarquia, micro-interações e alinhamento total ao branding." },
  { n: "phase_03", title: "Engenharia", desc: "Código limpo, performance otimizada e integração via webhooks entre design visual e lógica de negócio." },
  { n: "phase_04", title: "Lançamento", desc: "Testes de stress, SEO técnico, documentação e entrega final para sua equipe assumir o controle." },
];

const METRICS = [
  { v: "98+", k: "Automação de pipeline", d: "Tarefas repetitivas eliminadas — até 40h/semana por equipe." },
  { v: "0%", k: "Erro humano", d: "Mitigado em processos de deploy e sincronização com CRMs." },
  { v: "+240%", k: "Aumento de conversão", d: "Média comparada ao baseline anterior de cada cliente." },
  { v: "100/100", k: "Lighthouse score", d: "Performance, SEO e acessibilidade no topo absoluto." },
];

const PORTFOLIO = [
  {
    n: "case_01",
    client: "Halden Capital",
    sector: "Fintech / Investimentos",
    title: "Plataforma proprietária de gestão patrimonial",
    desc: "Sistema blindado substituindo 6 SaaS distintos. Dashboard ao vivo, CRM nativo e automação de relatórios fiscais.",
    metrics: [
      { v: "+312%", k: "Conversão MQL→SQL" },
      { v: "−R$ 18k/mês", k: "Custo de stack" },
    ],
    tag: "PRODUTO DIGITAL",
  },
  {
    n: "case_02",
    client: "Nordform Studio",
    sector: "Arquitetura de interiores",
    title: "Identidade e e-commerce de mobiliário autoral",
    desc: "Branding, fotografia direcionada e loja integrada a ERP. Checkout otimizado para ticket médio acima de R$ 12k.",
    metrics: [
      { v: "+R$ 2.4M", k: "GMV em 6 meses" },
      { v: "100/100", k: "Lighthouse" },
    ],
    tag: "E-COMMERCE",
  },
  {
    n: "case_03",
    client: "Vertex Legal",
    sector: "Advocacia tributária",
    title: "Portal de cliente e automação de intake",
    desc: "Onboarding digital com assinatura eletrônica, KYC automatizado e área logada para acompanhamento processual.",
    metrics: [
      { v: "−72%", k: "Tempo de intake" },
      { v: "0", k: "Retrabalho manual" },
    ],
    tag: "SISTEMAS WEB",
  },
  {
    n: "case_04",
    client: "Atlas Performance",
    sector: "Marketing de performance",
    title: "Landing pages brutalistas em escala",
    desc: "Engine de 40+ landing pages para tráfego pago. Carregamento sub-segundo, A/B nativo e webhook direto para CRM.",
    metrics: [
      { v: "+240%", k: "ROAS médio" },
      { v: "0.4s", k: "LCP" },
    ],
    tag: "LANDING PAGES",
  },
];

const FAQ = [
  { q: "Quanto tempo leva um projeto?", a: "Entre 4 e 8 semanas, dependendo da complexidade da infraestrutura e dos fluxos de automação." },
  { q: "Vocês oferecem manutenção?", a: "Sim. Planos de acompanhamento contínuo com suporte técnico ativo, garantindo sistema atualizado e otimizado." },
  { q: "O projeto é meu ou fica preso a vocês?", a: "100% seu. Entregamos código-fonte, chaves e acessos documentados. Soberania total." },
  { q: "Integram com meu CRM atual?", a: "Conexão direta via API ou webhooks personalizados. Nenhum lead perdido, dados fluindo sem fricção." },
];

function useClock(tz: string) {
  const [t, setT] = useState("--:--:--");
  useEffect(() => {
    const tick = () => {
      const f = new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
      setT(f.format(new Date()));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tz]);
  return t;
}

function Clock({ city, tz }: { city: string; tz: string }) {
  const t = useClock(tz);
  return (
    <div className="flex items-baseline gap-2 font-mono-tag">
      <span>• {city}</span>
      <span className="text-muted-foreground">{t}</span>
    </div>
  );
}

function Index() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-ink bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-10">
          <a href="#" className="font-mono-tag font-medium">ESCOM/STUDIO</a>
          <nav className="hidden gap-8 font-mono-tag md:flex">
            <a href="#servicos" className="hover:text-signal">Serviços</a>
            <a href="#processo" className="hover:text-signal">Processo</a>
            <a href="#portfolio" className="hover:text-signal">Portfólio</a>
            <a href="#custos" className="hover:text-signal">Custos</a>
            <a href="#contato" className="hover:text-signal">Contato</a>
          </nav>
          <a href="#contato" className="font-mono-tag border border-ink bg-ink px-4 py-2 text-paper transition hover:bg-signal hover:text-ink hover:border-signal">
            Iniciar →
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="border-b border-ink">
        <div className="mx-auto max-w-[1400px] px-6 pb-20 pt-16 md:px-10 md:pb-32 md:pt-24">
          <div className="mb-12 flex items-center gap-3 font-mono-tag text-muted-foreground">
            <span className="inline-block h-2 w-2 bg-signal" />
            <span>{">_ [ ARQUITETURA_DIGITAL.EXE ] / v.2026.01"}</span>
          </div>
          <h1 className="display-mega text-[14vw] md:text-[10vw]">
            Engenharia<br />
            de conversão<br />
            <span className="italic font-light">brutalista.</span>
          </h1>
          <div className="mt-16 grid gap-10 md:grid-cols-12">
            <div className="md:col-span-5 md:col-start-7">
              <p className="text-lg leading-relaxed md:text-xl">
                Projetos digitais de alta performance que unem <span className="bg-signal px-1">design, automação e inteligência de dados</span> em um único ecossistema. Sem retalhos de SaaS. Sem custos invisíveis.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#contato" className="border border-ink bg-ink px-6 py-3 font-mono-tag text-paper transition hover:bg-signal hover:text-ink hover:border-signal">
                  Agendar diagnóstico →
                </a>
                <a href="#servicos" className="border border-ink px-6 py-3 font-mono-tag transition hover:bg-ink hover:text-paper">
                  Ver capacidades
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="overflow-hidden border-b border-ink bg-ink py-4 text-paper">
        <div className="flex animate-[scroll_40s_linear_infinite] gap-12 whitespace-nowrap font-mono-tag">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="flex items-center gap-12">
              <span>DESIGN BRUTALISTA</span><span className="text-signal">◆</span>
              <span>AUTOMAÇÃO INVISÍVEL</span><span className="text-signal">◆</span>
              <span>ENGENHARIA DE CONVERSÃO</span><span className="text-signal">◆</span>
              <span>ARQUITETURA BLINDADA</span><span className="text-signal">◆</span>
            </span>
          ))}
        </div>
        <style>{`@keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
      </div>

      {/* SERVICES */}
      <section id="servicos" className="border-b border-ink">
        <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 md:py-32">
          <div className="mb-16 grid gap-8 md:grid-cols-12">
            <div className="md:col-span-4">
              <div className="font-mono-tag text-muted-foreground">{">_ /02 CAPACIDADES"}</div>
              <h2 className="display-mega mt-4 text-5xl md:text-6xl">O que<br />fazemos.</h2>
            </div>
            <p className="text-lg leading-relaxed md:col-span-7 md:col-start-6 md:text-xl">
              Seis disciplinas operando como um único ecossistema. Cada entrega é lapidada com supervisão criativa direta, do primeiro wireframe ao deploy final.
            </p>
          </div>
          <div className="grid border-t border-ink md:grid-cols-2">
            {SERVICES.map((s, i) => (
              <article
                key={s.n}
                className={`group border-b border-ink p-8 transition hover:bg-ink hover:text-paper md:p-12 ${i % 2 === 0 ? "md:border-r" : ""}`}
              >
                <div className="mb-6 flex items-baseline justify-between font-mono-tag">
                  <span>/{s.n}</span>
                  <span className="text-muted-foreground group-hover:text-signal">→</span>
                </div>
                <h3 className="display-mega mb-4 text-4xl md:text-5xl">{s.name}</h3>
                <p className="max-w-md text-base leading-relaxed">{s.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* COST COMPARISON */}
      <section id="custos" className="border-b border-ink bg-ink text-paper">
        <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 md:py-32">
          <div className="mb-16">
            <div className="font-mono-tag text-signal">{">_ /03 O CUSTO INVISÍVEL"}</div>
            <h2 className="display-mega mt-4 text-5xl md:text-7xl">
              O maior custo não está<br /><span className="italic font-light">na criação do site.</span>
            </h2>
          </div>
          <div className="grid gap-px bg-paper/20 md:grid-cols-2">
            <div className="bg-ink p-10 md:p-14">
              <div className="font-mono-tag text-paper/60">MODELO COMUM</div>
              <h3 className="display-mega mt-4 text-3xl md:text-4xl">Colcha de retalhos<br />de assinaturas.</h3>
              <ul className="mt-8 space-y-2 font-mono-tag text-paper/70">
                <li>— CRM externo</li>
                <li>— Plataforma de e-mail</li>
                <li>— Builder de landing pages</li>
                <li>— Ferramenta de automação</li>
                <li>— Analytics + heatmap</li>
              </ul>
              <div className="mt-10 border-t border-paper/30 pt-6">
                <div className="font-mono-tag text-paper/60">CUSTO MÉDIO ANUAL</div>
                <div className="display-mega mt-2 text-4xl md:text-5xl">R$ 9.600 — 27.600</div>
              </div>
            </div>
            <div className="bg-signal p-10 text-ink md:p-14">
              <div className="font-mono-tag">MODELO ESCOM</div>
              <h3 className="display-mega mt-4 text-3xl md:text-4xl">Um único sistema<br />blindado.</h3>
              <ul className="mt-8 space-y-2 font-mono-tag">
                <li>+ CRM integrado nativamente</li>
                <li>+ Automações no backend</li>
                <li>+ Dashboard ao vivo</li>
                <li>+ Heatmap proprietário</li>
                <li>+ Você dono do código</li>
              </ul>
              <div className="mt-10 border-t border-ink pt-6">
                <div className="font-mono-tag">EFICIÊNCIA MÁXIMA</div>
                <div className="display-mega mt-2 text-4xl md:text-5xl">Pronto para operar.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="processo" className="border-b border-ink">
        <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 md:py-32">
          <div className="mb-16 grid gap-8 md:grid-cols-12">
            <div className="md:col-span-5">
              <div className="font-mono-tag text-muted-foreground">{">_ /04 PROCESSO"}</div>
              <h2 className="display-mega mt-4 text-5xl md:text-7xl">Racionalidade<br />aplicada.</h2>
            </div>
            <p className="text-lg leading-relaxed md:col-span-6 md:col-start-7 md:text-xl">
              Focada em ROI imediato através da eliminação de ineficiências técnicas e operacionais. Justificamos cada escolha com dados, afastando-nos do design puramente estético.
            </p>
          </div>
          <div className="grid gap-px bg-ink md:grid-cols-4">
            {PHASES.map((p) => (
              <div key={p.n} className="bg-background p-8 md:p-10">
                <div className="font-mono-tag text-signal">{p.n}_</div>
                <h3 className="display-mega mt-6 text-3xl">{p.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section className="border-b border-ink">
        <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 md:py-32">
          <div className="mb-16">
            <div className="font-mono-tag text-muted-foreground">{">_ /05 MÉTRICAS"}</div>
            <h2 className="display-mega mt-4 text-5xl md:text-7xl">Resultados<br /><span className="italic font-light">tangíveis.</span></h2>
          </div>
          <div className="grid gap-px bg-ink md:grid-cols-4">
            {METRICS.map((m) => (
              <div key={m.k} className="bg-background p-8 md:p-10">
                <div className="display-mega text-5xl md:text-6xl">{m.v}</div>
                <div className="mt-6 font-mono-tag">{m.k}</div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{m.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section id="portfolio" className="border-b border-ink">
        <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 md:py-32">
          <div className="mb-16 grid gap-8 md:grid-cols-12">
            <div className="md:col-span-5">
              <div className="font-mono-tag text-muted-foreground">{">_ /06 PORTFÓLIO"}</div>
              <h2 className="display-mega mt-4 text-5xl md:text-7xl">Operações<br /><span className="italic font-light">em campo.</span></h2>
            </div>
            <p className="text-lg leading-relaxed md:col-span-6 md:col-start-7 md:text-xl">
              Quatro recortes de projetos onde substituímos pilhas de SaaS, retalhos de agências e gargalos operacionais por sistemas únicos, blindados e mensuráveis.
            </p>
          </div>

          <div className="grid border-t border-ink md:grid-cols-2">
            {PORTFOLIO.map((c, i) => (
              <article
                key={c.n}
                className={`group relative border-b border-ink p-8 transition hover:bg-ink hover:text-paper md:p-12 ${i % 2 === 0 ? "md:border-r" : ""}`}
              >
                <div className="mb-8 flex items-baseline justify-between font-mono-tag">
                  <span>/{c.n}</span>
                  <span className="text-muted-foreground group-hover:text-signal">{c.tag}</span>
                </div>

                <div className="mb-8 aspect-[16/10] w-full border border-ink bg-paper transition group-hover:border-paper">
                  <div className="grid h-full grid-cols-6 grid-rows-4">
                    {Array.from({ length: 24 }).map((_, k) => (
                      <div
                        key={k}
                        className={`border-r border-b border-ink/10 group-hover:border-paper/10 ${
                          [3, 8, 14, 17, 22].includes(k) ? "bg-signal" : ""
                        } ${[5, 11, 19].includes(k) ? "bg-ink group-hover:bg-paper" : ""}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="font-mono-tag text-muted-foreground group-hover:text-paper/60">
                  {c.client} — {c.sector}
                </div>
                <h3 className="display-mega mt-3 text-3xl leading-tight md:text-4xl">{c.title}</h3>
                <p className="mt-4 max-w-lg text-base leading-relaxed">{c.desc}</p>

                <div className="mt-8 grid grid-cols-2 gap-px bg-ink/20 group-hover:bg-paper/20">
                  {c.metrics.map((m) => (
                    <div key={m.k} className="bg-background p-4 group-hover:bg-ink">
                      <div className="display-mega text-2xl md:text-3xl">{m.v}</div>
                      <div className="mt-1 font-mono-tag text-xs text-muted-foreground group-hover:text-paper/60">{m.k}</div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border-t border-ink pt-8">
            <p className="font-mono-tag text-muted-foreground">
              {">_ 24 PROJETOS ATIVOS / 8 SETORES / 4 PAÍSES"}
            </p>
            <a href="#contato" className="border border-ink px-6 py-3 font-mono-tag transition hover:bg-ink hover:text-paper">
              Solicitar dossiê completo →
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-ink">
        <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 md:py-32">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <div className="font-mono-tag text-muted-foreground">{">_ /06 FAQ"}</div>
              <h2 className="display-mega mt-4 text-5xl md:text-6xl">Perguntas<br />diretas.</h2>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              {FAQ.map((f, i) => (
                <div key={i} className="border-t border-ink last:border-b">
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    className="flex w-full items-center justify-between py-6 text-left transition hover:text-signal"
                  >
                    <span className="display-mega text-2xl md:text-3xl">{f.q}</span>
                    <span className="font-mono-tag text-2xl">{open === i ? "−" : "+"}</span>
                  </button>
                  {open === i && (
                    <p className="pb-6 pr-12 text-base leading-relaxed text-muted-foreground">{f.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contato" className="border-b border-ink bg-signal text-ink">
        <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 md:py-32">
          <div className="font-mono-tag">{">_ /07 CONTATO"}</div>
          <h2 className="display-mega mt-4 text-6xl md:text-[12vw]">
            Iniciar<br /><span className="italic font-light">a revolução.</span>
          </h2>
          <div className="mt-16 grid gap-12 md:grid-cols-12">
            <p className="text-lg leading-relaxed md:col-span-5 md:text-xl">
              Preencha e nossa equipe técnica entra em contato em menos de 24 horas para agendar uma reunião estratégica de diagnóstico.
            </p>
            <form className="md:col-span-6 md:col-start-7" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-6">
                <div>
                  <label className="font-mono-tag">Nome</label>
                  <input className="mt-2 w-full border-b border-ink bg-transparent py-3 text-lg outline-none placeholder:text-ink/40 focus:border-b-2" placeholder="Seu nome completo" />
                </div>
                <div>
                  <label className="font-mono-tag">E-mail</label>
                  <input type="email" className="mt-2 w-full border-b border-ink bg-transparent py-3 text-lg outline-none placeholder:text-ink/40 focus:border-b-2" placeholder="voce@empresa.com" />
                </div>
                <div>
                  <label className="font-mono-tag">Projeto</label>
                  <textarea rows={3} className="mt-2 w-full border-b border-ink bg-transparent py-3 text-lg outline-none placeholder:text-ink/40 focus:border-b-2" placeholder="Descreva brevemente seu objetivo" />
                </div>
                <button className="mt-6 border border-ink bg-ink px-8 py-4 font-mono-tag text-paper transition hover:bg-background hover:text-ink">
                  Enviar mensagem →
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-ink text-paper">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10">
          <div className="mb-12 flex flex-wrap gap-x-10 gap-y-3">
            <span className="font-mono-tag">ESCOM/STUDIO</span>
            <Clock city="São Paulo" tz="America/Sao_Paulo" />
            <Clock city="Tokyo" tz="Asia/Tokyo" />
            <Clock city="London" tz="Europe/London" />
            <Clock city="New York" tz="America/New_York" />
          </div>
          <div className="grid gap-12 border-t border-paper/20 pt-12 md:grid-cols-12">
            <p className="text-lg leading-relaxed md:col-span-5">
              Desenvolvemos ecossistemas digitais blindados que eliminam custos ocultos de múltiplos SaaS. Otimize tempo, ROI e conversões hoje.
            </p>
            <div className="md:col-span-2 md:col-start-7">
              <div className="font-mono-tag text-paper/60">// NAV</div>
              <ul className="mt-4 space-y-2 font-mono-tag">
                <li><a href="#servicos" className="hover:text-signal">Serviços</a></li>
                <li><a href="#processo" className="hover:text-signal">Processo</a></li>
                <li><a href="#custos" className="hover:text-signal">Custos</a></li>
                <li><a href="#contato" className="hover:text-signal">Contato</a></li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <div className="font-mono-tag text-paper/60">// SERVIÇOS</div>
              <ul className="mt-4 space-y-2 font-mono-tag">
                <li>Identidade</li>
                <li>Produto</li>
                <li>Sistemas</li>
                <li>Engenharia</li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <div className="font-mono-tag text-paper/60">// JURÍDICO</div>
              <ul className="mt-4 space-y-2 font-mono-tag">
                <li>Termos</li>
                <li>Privacidade</li>
                <li>Aviso legal</li>
              </ul>
            </div>
          </div>
          <div className="mt-16 flex flex-wrap items-end justify-between gap-6 border-t border-paper/20 pt-8 font-mono-tag text-paper/60">
            <div>© 2026 ESCOM/STUDIO — Todos os direitos reservados.</div>
            <div>São Paulo — Brasil</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
