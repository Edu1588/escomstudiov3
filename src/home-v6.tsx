import React, { useState, type FormEvent } from "react";
import ReactDOM from "react-dom/client";
import { ArrowDown, ArrowRight, Check, Menu, X } from "lucide-react";
import heroImage from "@/assets/escom-hero.jpg";
import { Button } from "@/components/ui/button";
import { VerticalNav } from "@/components/v6/VerticalNav";
import { ChunkyTransition } from "@/components/v6/ChunkyTransition";
import { SplitTextReveal } from "@/components/v6/SplitTextReveal";
import { LenisProvider } from "@/components/v6/LenisProvider";
import { HeroManifestoStage } from "@/components/v6/HeroManifestoStage";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
    "Ser compreendido",
    "O visitante entende quem você ajuda, qual problema resolve e por que deve avançar.",
    "Sites, landing pages, copy e experiência.",
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
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em] ${light ? "text-foreground/70" : "text-muted-foreground"}`}
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
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <main className="relative overflow-x-hidden bg-background text-foreground">
      <VerticalNav />
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

      <HeroManifestoStage Eyebrow={Eyebrow} AnchorButton={AnchorButton} />
      <section
        id="solucoes"
        className="relative bg-background px-5 py-28 md:px-12 xl:px-[22vw] md:py-36 dark bg-background text-foreground"
      >
        
        <Eyebrow>Um sistema digital, várias frentes de crescimento</Eyebrow>
        <div className="mt-14 grid gap-8 md:grid-cols-12">
          <h2 className="font-serif text-5xl leading-none md:col-span-8 md:text-7xl">
            Tudo o que sua empresa precisa para ser percebida, encontrada e
            escolhida.
          </h2>
          <p className="self-end text-sm leading-6 md:col-span-4">
            Unimos marca, experiência digital, aquisição e automação. Cada
            solução pode existir sozinha ou fazer parte de um sistema mais
            amplo.
          </p>
        </div>
        <div className="mt-20 border-t border-border">
          {services.map(([n, title, text, includes, cta]) => (
            <article
              key={n}
              className="group grid gap-5 border-b border-border py-9 md:grid-cols-12 md:items-start"
            >
              <span className="font-mono text-xs text-muted-foreground md:col-span-1">
                {n}
              </span>
              <h3 className="font-serif text-3xl md:col-span-3 md:text-4xl">
                {title}
              </h3>
              <p className="text-sm leading-6 md:col-span-4">{text}</p>
              <div className="md:col-span-3">
                <p className="font-mono text-[9px] uppercase leading-5 tracking-[0.1em] text-muted-foreground">
                  {includes}
                </p>
                <a
                  href="#diagnostico"
                  className="mt-5 inline-flex items-center gap-2 border-b border-foreground pb-1 text-xs font-semibold"
                >
                  {cta}
                  <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="relative px-5 py-28 text-foreground md:px-12 xl:px-[22vw] md:py-40 bg-background text-foreground">
        
        <Eyebrow light>Não somos uma fábrica de entregáveis</Eyebrow>
        <h2 className="mt-14 max-w-5xl font-serif text-5xl leading-none md:text-7xl">
          Cada projeto começa pelo problema. E termina em uma estrutura que pode
          evoluir.
        </h2>
        <div className="mt-20 grid gap-12 md:grid-cols-12">
          <p className="text-lg leading-8 md:col-span-5">
            A ESCOM não começa perguntando qual peça você quer produzir. Começa
            entendendo o que precisa mudar no negócio. Combinamos pensamento
            estratégico, design, código, dados e automação para construir
            somente o que tem função no seu crescimento.
          </p>
          <div className="md:col-span-6 md:col-start-7">
            {[
              "Estratégia antes da execução.",
              "Tecnologia com função.",
              "Design que orienta decisões.",
              "Operação conectada.",
              "Evolução contínua.",
            ].map((x, i) => (
              <div key={x} className="flex gap-5 border-t border-border py-5">
                <span className="font-mono text-[10px]">0{i + 1}</span>
                <p className="font-serif text-2xl">{x}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background px-5 py-28 md:px-12 xl:px-[22vw] md:py-36">
        <Eyebrow>Da primeira percepção à próxima venda</Eyebrow>
        <h2 className="mt-14 max-w-4xl font-serif text-5xl leading-none md:text-7xl">
          Construímos a jornada digital que transforma desconhecidos em
          oportunidades.
        </h2>
        <div className="mt-20 grid border-y border-border md:grid-cols-5">
          {journey.map(([n, title, text, related]) => (
            <article
              key={n}
              className="border-b border-border p-5 md:min-h-96 md:border-r md:border-b-0"
            >
              <span className="font-mono text-[10px]">{n}</span>
              <h3 className="mt-16 font-serif text-3xl">{title}</h3>
              <p className="mt-5 text-sm leading-6">{text}</p>
              <p className="mt-8 font-mono text-[9px] uppercase leading-5 text-muted-foreground">
                {related}
              </p>
            </article>
          ))}
        </div>
        <p className="mt-10 text-right font-serif text-3xl">
          A jornada não termina no clique. É ali que a operação começa a provar
          seu valor.
        </p>
      </section>

      <section
        id="processo"
        className="px-5 py-28 md:px-12 xl:px-[22vw] md:py-36 bg-background text-foreground"
      >
        <Eyebrow>Como a ESCOM trabalha</Eyebrow>
        <h2 className="mt-14 max-w-4xl font-serif text-5xl leading-none md:text-7xl">
          Um processo claro para transformar ambição em execução.
        </h2>
        <div className="mt-20">
          {process.map(([n, title, text, output]) => (
            <article
              key={n}
              className="grid gap-4 border-t border-foreground/25 py-7 md:grid-cols-12"
            >
              <span className="font-mono text-xs md:col-span-1">{n}</span>
              <h3 className="font-serif text-4xl md:col-span-3">{title}</h3>
              <p className="text-sm leading-6 md:col-span-4">{text}</p>
              <p className="font-mono text-[10px] uppercase leading-5 md:col-span-3 md:col-start-10">
                Saída — {output}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative min-h-[75vh]   px-5 py-28 text-foreground md:px-12 xl:px-[22vw] md:py-36 bg-background text-foreground">
        <div className="absolute -right-24 top-1/2 size-[36rem] -translate-y-1/2 rounded-full border border-border" />
        <div className="absolute right-16 top-1/2 size-72 -translate-y-1/2 rounded-full border border-border" />
        <div className="relative">
          <Eyebrow light>Inteligência artificial aplicada</Eyebrow>
          <h2 className="mt-14 max-w-4xl font-serif text-5xl leading-none md:text-7xl">
            Menos promessa abstrata. Mais inteligência integrada ao trabalho
            real.
          </h2>
          <p className="mt-10 max-w-xl text-lg leading-8">
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

      <section
        id="projetos"
        className="bg-background px-5 py-28 md:px-12 xl:px-[22vw] md:py-36"
      >
        <Eyebrow>Sistemas em movimento</Eyebrow>
        <h2 className="mt-14 max-w-4xl font-serif text-5xl leading-none md:text-7xl">
          O que podemos construir para sua empresa.
        </h2>
        <div className="mt-20 grid gap-px bg-border border border-border md:grid-cols-3">
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
              className="group flex min-h-64 flex-col justify-between bg-background p-6"
            >
              <span className="font-mono text-[10px]">FIELD / 0{i + 1}</span>
              <h3 className="font-serif text-3xl">{x}</h3>
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-2" />
            </article>
          ))}
        </div>
          <ChunkyTransition nextColor="#000000" />
      </section>
      <section
        id="sobre"
        className="relative px-5 py-28 text-foreground md:px-12 xl:px-[22vw] md:py-36 dark bg-background text-foreground"
      >
        
        <Eyebrow light>Sobre a ESCOM</Eyebrow>
        <div className="mt-14 grid gap-12 md:grid-cols-12">
          <h2 className="font-serif text-5xl leading-none md:col-span-7 md:text-7xl">
            Somos uma equipe de estratégia, design e tecnologia para empresas em
            movimento.
          </h2>
          <div className="space-y-7 text-base leading-7 md:col-span-4 md:col-start-9">
            <p>
              A ESCOM nasceu da convicção de que presença digital precisa
              cumprir uma função clara dentro do negócio.
            </p>
            <p>
              Pensamos na marca, desenhamos a experiência, escrevemos a
              mensagem, construímos a tecnologia, conectamos os dados e
              observamos o que acontece depois do lançamento.
            </p>
          </div>
        </div>
        <div className="mt-20 grid border-t border-border md:grid-cols-3">
          {[
            "Clareza antes do ruído",
            "Estratégia antes da ferramenta",
            "Tecnologia a serviço do resultado",
            "Design com intenção",
            "Experimentos com responsabilidade",
            "Crescimento que pode ser melhorado",
          ].map((x, i) => (
            <div
              key={x}
              className="border-b border-border py-5 font-mono text-[10px] uppercase tracking-[0.1em] md:border-r"
            >
              <span className="mr-4 opacity-50">0{i + 1}</span>
              {x}
            </div>
          ))}
        </div>
        <ChunkyTransition nextColor="#ECECE3" />
      </section>
      <section
        id="insights"
        className="relative bg-background px-5 py-28 md:px-12 xl:px-[22vw] md:py-36"
      >
        
        <Eyebrow>Para quem é</Eyebrow>
        <div className="mt-14 grid gap-12 md:grid-cols-12">
          <h2 className="font-serif text-5xl leading-none md:col-span-7 md:text-7xl">
            Para empresas que já entenderam que o próximo estágio exige mais do
            que presença.
          </h2>
          <div className="md:col-span-4 md:col-start-9">
            <p className="leading-7">
              Empresas lançando, reposicionando ou acelerando uma operação — e
              prontas para transformar intenção em estrutura.
            </p>
            <ul className="mt-8 space-y-4 text-sm">
              {[
                "Lançar ou reconstruir um site",
                "Reposicionar uma marca",
                "Criar uma jornada de conversão",
                "Automatizar atendimento e vendas",
                "Aplicar IA em uma operação concreta",
                "Conectar marketing, tecnologia e vendas",
              ].map((x) => (
                <li key={x} className="flex gap-3 border-t border-border pt-4">
                  <Check className="size-4 shrink-0 text-cyan" />
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-20 max-w-4xl font-serif text-3xl md:text-4xl">
          Se você procura apenas uma peça pelo menor preço, talvez não sejamos a
          melhor escolha. Se procura uma solução pensada para o contexto,
          podemos conversar.
        </p>
      </section>

      <section className="border-y border-border bg-background px-5 py-28 md:px-12 xl:px-[22vw] md:py-36">
        <Eyebrow>Perguntas frequentes</Eyebrow>
        <div className="mt-14 grid gap-12 md:grid-cols-12">
          <h2 className="font-serif text-5xl md:col-span-4 md:text-6xl">
            Antes de começar.
          </h2>
          <Accordion
            type="single"
            collapsible
            className="md:col-span-7 md:col-start-6"
          >
            {faqs.map(([q, a], i) => (
              <AccordionItem key={q} value={`faq-${i}`}>
                <AccordionTrigger className="py-6 font-serif text-xl no-underline hover:no-underline">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="max-w-xl pb-6 text-sm leading-6 text-muted-foreground">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section
        id="diagnostico"
        className="relative px-5 py-28 text-foreground md:px-12 xl:px-[22vw] md:py-36 dark bg-background text-foreground"
      >
        
        <Eyebrow light>O próximo sistema começa com uma conversa</Eyebrow>
        <div className="mt-14 grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <h2 className="font-serif text-5xl leading-none md:text-7xl">
              O que sua empresa precisa construir agora?
            </h2>
            <p className="mt-8 max-w-md leading-7">
              Conte-nos qual é o desafio, onde você quer chegar e o que já
              tentou. Primeiro entendemos o contexto. Depois indicamos o
              caminho.
            </p>
            <a
              href="https://wa.me/"
              className="mt-10 inline-flex items-center gap-2 border-b border-current pb-1 text-xs font-semibold"
            >
              Falar com a ESCOM no WhatsApp <ArrowRight className="size-3" />
            </a>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            {sent ? (
              <div className="flex min-h-96 flex-col justify-center border-y border-border">
                <Check className="mb-6 size-10" />
                <h3 className="font-serif text-4xl">
                  Recebemos suas informações.
                </h3>
                <p className="mt-4 max-w-md leading-7">
                  Vamos analisar o contexto e retornaremos com o próximo passo
                  mais adequado para o seu projeto.
                </p>
              </div>
            ) : (
              <form onSubmit={submit}>
                <h3 className="font-serif text-3xl">
                  Vamos mapear sua próxima oportunidade.
                </h3>
                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  {[
                    ["Nome", "text"],
                    ["Empresa", "text"],
                    ["Cargo ou função", "text"],
                    ["E-mail profissional", "email"],
                    ["WhatsApp", "tel"],
                    ["Site ou Instagram", "url"],
                  ].map(([label, type]) => (
                    <label
                      key={label}
                      className="font-mono text-[9px] uppercase tracking-[0.1em]"
                    >
                      {label}
                      <Input
                        type={type}
                        required={
                          label === "Nome" || label === "E-mail profissional"
                        }
                        className="mt-2 h-11 rounded-none border-border text-foreground placeholder:text-foreground/40 focus-visible:ring-cobalt-foreground"
                      />
                    </label>
                  ))}
                </div>
                <label className="mt-5 block font-mono text-[9px] uppercase tracking-[0.1em]">
                  Principal objetivo
                  <select className="mt-2 h-11 w-full rounded-none border border-border bg-transparent px-3 text-sm normal-case">
                    <option className="text-foreground">
                      Criar ou reformular um site
                    </option>
                    <option className="text-foreground">
                      Construir ou reposicionar uma marca
                    </option>
                    <option className="text-foreground">
                      Gerar mais leads
                    </option>
                    <option className="text-foreground">
                      Melhorar tráfego pago
                    </option>
                    <option className="text-foreground">
                      Automatizar processos
                    </option>
                    <option className="text-foreground">
                      Aplicar IA na operação
                    </option>
                    <option className="text-foreground">Outro</option>
                  </select>
                </label>
                <label className="mt-5 block font-mono text-[9px] uppercase tracking-[0.1em]">
                  O que está impedindo esse avanço hoje?
                  <Textarea
                    required
                    className="mt-2 min-h-28 rounded-none border-border text-foreground placeholder:text-foreground/40 focus-visible:ring-cobalt-foreground"
                  />
                </label>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <label className="font-mono text-[9px] uppercase tracking-[0.1em]">
                    Investimento planejado
                    <Input className="mt-2 h-11 rounded-none border-border text-foreground focus-visible:ring-cobalt-foreground" />
                  </label>
                  <label className="font-mono text-[9px] uppercase tracking-[0.1em]">
                    Prazo desejado
                    <Input className="mt-2 h-11 rounded-none border-border text-foreground focus-visible:ring-cobalt-foreground" />
                  </label>
                </div>
                <Button
                  type="submit"
                  variant="editorialOutline"
                  size="xl"
                  className="mt-7 w-full"
                >
                  Enviar diagnóstico inicial <ArrowRight />
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
      <footer className="flex flex-col gap-8 bg-background text-foreground px-5 py-10 text-foreground md:flex-row md:items-end md:justify-between md:px-12 xl:px-[22vw] dark bg-background text-foreground">
        <div>
          <div className="font-serif text-5xl">
            ESCOM<span className="text-cyan">.</span>
          </div>
          <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.12em]">
            Strategy // Design // Code // Growth
          </p>
        </div>
        <div className="font-mono text-[9px] uppercase tracking-[0.12em]">
          © 2026 ESCOM Studio · Brasil
        </div>
      </footer>
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
