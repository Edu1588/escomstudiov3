import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VerticalNav } from "@/components/v6/VerticalNav";
import { LenisProvider } from "@/components/v6/LenisProvider";
import { HeroManifestoStage } from "@/components/v6/HeroManifestoStage";
import { MethodStage } from "@/components/v6/MethodStage";
import { AboutInsightsStage } from "@/components/v6/AboutInsightsStage";
import { DiagnosisStage } from "@/components/v6/DiagnosisStage";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import "./home-v6.css";

const services = [
  [
    "01",
    "Sites e experiências digitais",
    "Sites, landing pages e plataformas construídos para comunicar valor, facilitar decisões e transformar atenção em oportunidade.",
    "Arquitetura · UX/UI · Copy · Desenvolvimento · Analytics · SEO",
    "Construir minha presença digital",
  ],
  [
    "02",
    "Branding e identidade de marca",
    "Marcas com clareza estratégica, presença consistente e uma linguagem capaz de ocupar espaço na mente do público certo.",
    "Posicionamento · Estratégia verbal · Identidade · Direção de arte",
    "Estruturar minha marca",
  ],
  [
    "03",
    "Automação e sistemas inteligentes",
    "Processos mais rápidos, atendimento organizado e menos trabalho manual por meio de automações conectadas à operação real.",
    "CRM · Integrações · Webhooks · Dashboards · Agentes de IA",
    "Automatizar minha operação",
  ],
  [
    "04",
    "Criações com inteligência artificial",
    "Aplicações práticas de IA para acelerar comunicação, atendimento, produção, análise e tomada de decisão.",
    "Agentes · Assistentes · Conteúdo · Protótipos · Soluções sob medida",
    "Explorar IA para meu negócio",
  ],
  [
    "05",
    "Tráfego pago e aquisição",
    "Campanhas orientadas por objetivo, dados e aprendizado contínuo para atrair demanda qualificada.",
    "Mídia · Criativos · Públicos · Funil · Remarketing · Otimização",
    "Acelerar minha aquisição",
  ],
  [
    "06",
    "Estratégia digital e crescimento",
    "Um mapa claro para decidir o que construir e conectar marketing, tecnologia e vendas em uma operação sustentável.",
    "Diagnóstico · Pesquisa · Oferta · Jornada · Plano de ação",
    "Organizar meu próximo ciclo",
  ],
];

const journey = [
  [
    "01",
    "Ser percebido",
    "Clareza, relevância e uma linguagem compatível com o valor que sua marca entrega.",
    "Branding, conteúdo, criativos e tráfego pago.",
  ],
  [
    "02",
    "Ser encontrado",
    "Estar presente nos momentos de busca, comparação e consideração do comprador.",
    "Search, SEO técnico, páginas focadas e canais de entrada.",
  ],
  [
    "03",
    "Ser escolhido",
    "A experiência remove dúvidas, constrói confiança e conduz para uma ação objetiva.",
    "Conversão, provas, ofertas e remarketing.",
  ],
  [
    "04",
    "Ser atendido",
    "Depois do contato, velocidade e organização também fazem parte da marca.",
    "CRM, automações, WhatsApp e agentes de IA.",
  ],
  [
    "05",
    "Ser lembrado",
    "Uma operação madura aprende com dados e cria novas oportunidades de relacionamento.",
    "Analytics, retenção e estratégia de crescimento.",
  ],
];

const process = [
  [
    "01",
    "Diagnóstico",
    "Entendemos negócio, público, oferta, canais e gargalos.",
    "Cenário, oportunidades e direção.",
  ],
  [
    "02",
    "Arquitetura",
    "Definimos estratégia, mensagem, jornada e prioridades.",
    "Plano de ação e critérios de sucesso.",
  ],
  [
    "03",
    "Construção",
    "Criamos os ativos e sistemas necessários para operar.",
    "Estrutura funcional e integrada.",
  ],
  [
    "04",
    "Ativação",
    "Colocamos a operação no ar e refinamos os primeiros sinais.",
    "Sistema ativo e mensurável.",
  ],
  [
    "05",
    "Evolução",
    "Usamos dados reais para melhorar e abrir oportunidades.",
    "Experimentos e plano de evolução.",
  ],
];

const faqs = [
  [
    "O que a ESCOM entrega?",
    "Sites, landing pages, branding, automações, experiências com inteligência artificial, tráfego pago e sistemas de crescimento. O escopo nasce do diagnóstico e do objetivo.",
  ],
  [
    "Vocês fazem apenas sites?",
    "Não. O site pode ser o ponto de partida, mas o trabalho também pode envolver marca, aquisição, automação, IA, CRM, analytics e estratégia digital.",
  ],
  [
    "Posso contratar apenas um serviço?",
    "Sim. É possível contratar uma solução específica ou combinar diferentes frentes em um projeto integrado.",
  ],
  [
    "Vocês atendem quais segmentos?",
    "A adequação depende mais do problema e do momento da empresa do que de um setor específico.",
  ],
  [
    "Como funciona o primeiro contato?",
    "Você compartilha informações sobre a empresa e o objetivo. Avaliamos o contexto e indicamos o melhor próximo passo.",
  ],
  [
    "Vocês garantem resultados?",
    "Não prometemos resultados sem entender oferta, mercado, investimento e operação. Construímos uma estrutura clara, mensurável e preparada para evoluir.",
  ],
  [
    "Quanto custa um projeto?",
    "O investimento depende do escopo, complexidade e nível de integração. Após o diagnóstico, apresentamos uma recomendação compatível com o objetivo.",
  ],
];

function Eyebrow({
  children,
  light = false,
  cyan = false,
}: {
  children: React.ReactNode;
  light?: boolean;
  cyan?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em] ${
        cyan
          ? "text-cyan"
          : light
          ? "text-foreground/70"
          : "text-muted-foreground"
      }`}
    >
      <span className="h-px w-5 bg-current" />
      {children}
    </div>
  );
}

function AnchorButton({
  children,
  outline = false,
}: {
  children: React.ReactNode;
  outline?: boolean;
}) {
  return (
    <Button
      asChild
      size="xl"
      variant={outline ? "editorialOutline" : "editorial"}
    >
      <a href="#diagnostico">
        {children}
        <ArrowRight />
      </a>
    </Button>
  );
}

export function HomeV6() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="relative overflow-x-hidden bg-[#000000] text-foreground">
      <VerticalNav />

      {/* HEADER MOBILE FIXO */}
      <div className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md xl:hidden">
        <div className="flex h-9 items-center justify-center border-b border-border px-4 font-mono text-[9px] uppercase tracking-[0.14em] md:text-[10px]">
          Engenharia digital para empresas que querem operar na próxima fase do
          mercado.
        </div>
        <header className="flex h-16 items-center justify-between px-4 md:px-10">
          <a href="#top" className="font-serif text-2xl">
            ESCOM<span className="text-cyan">.</span>
          </a>
          <nav className="hidden items-center gap-7 font-mono text-[9px] uppercase tracking-[0.14em] lg:flex">
            <a href="#solucoes">Soluções</a>
            <a href="#processo">Como funciona</a>
            <a href="#projetos">Projetos</a>
            <a href="#sobre">Sobre a ESCOM</a>
            <a href="#insights">Insights</a>
          </nav>
          <div className="hidden lg:block">
            <AnchorButton>Iniciar diagnóstico</AnchorButton>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </header>
        {menuOpen && (
          <nav className="grid border-t border-border bg-background p-5 font-serif text-3xl lg:hidden">
            {[
              ["Soluções", "solucoes"],
              ["Como funciona", "processo"],
              ["Projetos", "projetos"],
              ["Sobre a ESCOM", "sobre"],
              ["Insights", "insights"],
              ["Iniciar diagnóstico", "diagnostico"],
            ].map(([label, id]) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setMenuOpen(false)}
                className="border-b border-border py-3"
              >
                {label}
              </a>
            ))}
          </nav>
        )}
      </div>

      {/* PALCO 1: HERO (Preto) -> MANIFESTO (Bege) -> SOLUÇÕES INTRO (Preto) */}
      <HeroManifestoStage Eyebrow={Eyebrow} AnchorButton={AnchorButton} />

      {/* SOLUÇÕES: SEÇÃO LONGA (6 SERVIÇOS 01 a 06) EM FUNDO PRETO CONTÍNUO */}
      <section
        id="solucoes"
        className="relative bg-[#000000] px-5 pb-28 md:px-12 xl:px-[22vw] md:pb-36 dark text-foreground"
      >
        <div className="border-t border-border/50">
          {services.map(([n, title, text, includes, cta]) => (
            <article
              key={n}
              className="group grid gap-5 border-b border-border/40 py-9 md:grid-cols-12 md:items-start"
            >
              <span className="font-mono text-xs text-cyan md:col-span-1">
                {n}
              </span>
              <h3 className="font-serif text-3xl md:col-span-3 md:text-4xl text-foreground">
                {title}
              </h3>
              <p className="text-sm leading-6 md:col-span-4 text-muted-foreground">
                {text}
              </p>
              <div className="md:col-span-3">
                <p className="font-mono text-[9px] uppercase leading-5 tracking-[0.1em] text-muted-foreground/80">
                  {includes}
                </p>
                <a
                  href="#diagnostico"
                  className="mt-5 inline-flex items-center gap-2 border-b border-cyan pb-1 text-xs font-semibold text-cyan hover:opacity-80 transition-opacity"
                >
                  {cta}
                  <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* PALCO 2: TRANSIÇÃO SOLUÇÕES (Preto) -> MÉTODO (Bege) */}
      <MethodStage Eyebrow={Eyebrow} />

      {/* BLOCO CLARO CONTÍNUO (Fundo Bege #ecece3 sem nenhum pixel entre seções) */}
      <div className="bg-[#ecece3] text-[#000000]">
        {/* JORNADA DIGITAL (5 Colunas) */}
        <section className="px-5 py-24 md:px-12 xl:px-[22vw] md:py-32 border-t border-black/10">
          <Eyebrow light>Da primeira percepção à próxima venda</Eyebrow>
          <h2 className="mt-12 max-w-4xl font-serif text-4xl leading-[1.05] font-light md:text-6xl lg:text-7xl text-black">
            Construímos a jornada digital que transforma desconhecidos em
            oportunidades.
          </h2>
          <div className="mt-16 grid border-y border-black/15 md:grid-cols-5">
            {journey.map(([n, title, text, related]) => (
              <article
                key={n}
                className="border-b border-black/15 p-5 md:min-h-96 md:border-r md:border-b-0"
              >
                <span className="font-mono text-[10px] text-black/50">{n}</span>
                <h3 className="mt-16 font-serif text-2xl md:text-3xl text-black">
                  {title}
                </h3>
                <p className="mt-5 text-sm leading-6 text-black/80">{text}</p>
                <p className="mt-8 font-mono text-[9px] uppercase leading-5 text-black/60">
                  {related}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-10 text-right font-serif text-2xl md:text-3xl text-black">
            A jornada não termina no clique. É ali que a operação começa a provar
            seu valor.
          </p>
        </section>

        {/* PROCESSO (5 Etapas) */}
        <section
          id="processo"
          className="px-5 py-24 md:px-12 xl:px-[22vw] md:py-32 border-t border-black/10"
        >
          <Eyebrow light>Como a ESCOM trabalha</Eyebrow>
          <h2 className="mt-12 max-w-4xl font-serif text-4xl leading-[1.05] font-light md:text-6xl lg:text-7xl text-black">
            Um processo claro para transformar ambição em execução.
          </h2>
          <div className="mt-16">
            {process.map(([n, title, text, output]) => (
              <article
                key={n}
                className="grid gap-4 border-t border-black/15 py-6 md:grid-cols-12"
              >
                <span className="font-mono text-xs text-black/60 md:col-span-1">
                  {n}
                </span>
                <h3 className="font-serif text-3xl md:col-span-3 text-black">
                  {title}
                </h3>
                <p className="text-sm leading-6 md:col-span-4 text-black/80">
                  {text}
                </p>
                <p className="font-mono text-[10px] uppercase leading-5 text-black/60 md:col-span-3 md:col-start-10">
                  Saída — {output}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* INTELIGÊNCIA ARTIFICIAL APLICADA */}
        <section className="relative min-h-[70vh] px-5 py-24 md:px-12 xl:px-[22vw] md:py-32 border-t border-black/10">
          <div className="absolute -right-24 top-1/2 size-[36rem] -translate-y-1/2 rounded-full border border-black/10 pointer-events-none" />
          <div className="absolute right-16 top-1/2 size-72 -translate-y-1/2 rounded-full border border-black/10 pointer-events-none" />
          <div className="relative">
            <Eyebrow light>Inteligência artificial aplicada</Eyebrow>
            <h2 className="mt-12 max-w-4xl font-serif text-4xl leading-[1.05] font-light md:text-6xl lg:text-7xl text-black">
              Menos promessa abstrata. Mais inteligência integrada ao trabalho
              real.
            </h2>
            <p className="mt-8 max-w-xl text-base leading-7 md:text-lg md:leading-8 text-black/80">
              A IA pode responder clientes, organizar informações, acelerar
              produção e apoiar equipes. Investigamos onde ela gera impacto real
              antes de escolher a tecnologia.
            </p>
            <div className="mt-10">
              <AnchorButton outline>
                Descobrir onde a IA pode gerar valor
              </AnchorButton>
            </div>
          </div>
        </section>

        {/* PROJETOS (Sistemas em Movimento) */}
        <section
          id="projetos"
          className="px-5 py-24 md:px-12 xl:px-[22vw] md:py-32 border-t border-black/10"
        >
          <Eyebrow light>Sistemas em movimento</Eyebrow>
          <h2 className="mt-12 max-w-4xl font-serif text-4xl leading-[1.05] font-light md:text-6xl lg:text-7xl text-black">
            O que podemos construir para sua empresa.
          </h2>
          <div className="mt-16 grid gap-px bg-black/15 border border-black/15 md:grid-cols-3">
            {[
              "Uma nova marca pronta para entrar no mercado",
              "Um site que transforma tráfego em reuniões",
              "Um fluxo que não deixa leads esperando",
              "Mídia conectada à operação comercial",
              "Um agente de IA para uma tarefa específica",
              "Um sistema que substitui tarefas dispersas",
            ].map((x, i) => (
              <article
                key={x}
                className="group flex min-h-64 flex-col justify-between bg-[#ecece3] p-6 hover:bg-[#e4e4db] transition-colors"
              >
                <span className="font-mono text-[10px] text-black/50">
                  FIELD / 0{i + 1}
                </span>
                <h3 className="font-serif text-2xl text-black">{x}</h3>
                <ArrowRight className="size-5 text-black/60 transition-transform group-hover:translate-x-2" />
              </article>
            ))}
          </div>
        </section>
      </div>

      {/* PALCO 3: TRANSIÇÃO PROJETOS (Bege) -> SOBRE (Preto) -> INSIGHTS (Bege) */}
      <AboutInsightsStage Eyebrow={Eyebrow} />

      {/* BLOCO CLARO CONTÍNUO: FAQ (Bege) */}
      <section className="border-t border-black/15 bg-[#ecece3] px-5 py-24 text-black md:px-12 xl:px-[22vw] md:py-32">
        <Eyebrow light>Perguntas frequentes</Eyebrow>
        <div className="mt-12 grid gap-12 md:grid-cols-12">
          <h2 className="font-serif text-4xl leading-tight font-light md:col-span-4 md:text-5xl lg:text-6xl text-black">
            Antes de começar.
          </h2>
          <Accordion
            type="single"
            collapsible
            className="md:col-span-7 md:col-start-6"
          >
            {faqs.map(([q, a], i) => (
              <AccordionItem
                key={q}
                value={`faq-${i}`}
                className="border-b border-black/15"
              >
                <AccordionTrigger className="py-5 font-serif text-lg md:text-xl text-black no-underline hover:no-underline">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="max-w-xl pb-5 text-sm leading-6 text-black/75">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* PALCO 4: TRANSIÇÃO FAQ (Bege) -> DIAGNÓSTICO (Preto) */}
      <DiagnosisStage Eyebrow={Eyebrow} AnchorButton={AnchorButton} />
    </main>
  );
}

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <LenisProvider>
        <HomeV6 />
      </LenisProvider>
    </React.StrictMode>
  );
}

export default HomeV6;
