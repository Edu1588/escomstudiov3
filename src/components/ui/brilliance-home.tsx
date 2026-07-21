import { useEffect, useState, useRef } from "react";
import { getPortfolioProjects } from "../../firebase";
import { motion } from "motion/react";



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
    title: "Plataforma proprietária de gestão patrimonial",
    desc: "Sistema blindado substituindo 6 SaaS distintos. Dashboard ao vivo, CRM nativo e automação de relatórios fiscais.",
    metrics: [
      { v: "+312%", k: "Conversão MQL→SQL" },
      { v: "−R$ 18k/mês", k: "Custo de stack" },
    ],
    tag: "PRODUTO DIGITAL",
    img: "https://image.mux.com/Neh02MwL00t9WWvvBAVV3Tgs43edE9kTsycNhC29aWz4Y/animated.webp?width=640&fps=15"
  },
  {
    n: "case_02",
    title: "Identidade e e-commerce de mobiliário autoral",
    desc: "Branding, fotografia direcionada e loja integrada a ERP. Checkout otimizado para ticket médio acima de R$ 12k.",
    metrics: [
      { v: "+R$ 2.4M", k: "GMV em 6 meses" },
      { v: "100/100", k: "Lighthouse" },
    ],
    tag: "E-COMMERCE",
    img: "https://image.mux.com/rjL6oQiSOfhaxXgbslqGUsFKnaRtqLdxwurjT6Yv5PQ/animated.webp?width=640&fps=15"
  },
  {
    n: "case_03",
    title: "Portal de cliente e automação de intake",
    desc: "Onboarding digital com assinatura eletrônica, KYC automatizado e área logada para acompanhamento processual.",
    metrics: [
      { v: "−72%", k: "Tempo de intake" },
      { v: "0", k: "Retrabalho manual" },
    ],
    tag: "SISTEMAS WEB",
    img: "https://image.mux.com/oyGPQ8mbNvS01JLrDUGJiQCd00HUn41EGTMIa601k767IE/animated.webp?width=640&fps=15"
  },
  {
    n: "case_04",
    title: "Landing pages brutalistas em escala",
    desc: "Engine de 40+ landing pages para tráfego pago. Carregamento sub-segundo, A/B nativo e webhook direto para CRM.",
    metrics: [
      { v: "+240%", k: "ROAS médio" },
      { v: "0.4s", k: "LCP" },
    ],
    tag: "LANDING PAGES",
    img: "https://image.mux.com/MSctoqC17nNR00ZSv5l7fTur9QOwcJHC01uL02uOFs1Vvs/animated.webp?width=640&fps=15"
  },
];

const FAQ = [
  { q: "Quanto tempo leva um projeto?", a: "Entre 4 e 8 semanas, dependendo da complexidade da infraestrutura e dos fluxos de automação." },
  { q: "Vocês oferecem manutenção?", a: "Sim. Planos de acompanhamento contínuo com suporte técnico ativo, garantindo sistema atualizado e otimizado." },
  { q: "O projeto é meu ou fica preso a vocês?", a: "100% seu. Entregamos código-fonte, chaves e acessos documentados. Soberania total." },
  { q: "Integram com meu CRM atual?", a: "Conexão direta via API ou webhooks personalizados. Nenhum lead perdido, dados fluindo sem fricção." },
  { q: "Qual a diferença entre a ESCOM e uma agência tradicional?", a: "Agências focam em design visual e tráfego pago isolados. Nós unificamos engenharia, copy, tráfego e automações em um único ecossistema focado em conversão e redução de custos operacionais." },
  { q: "Como funciona a hospedagem e o suporte pós-entrega?", a: "Hospedamos seu site em servidores VPS de alta velocidade com CDN global. Nosso suporte cobre atualizações de conteúdo, monitoramento de segurança 24/7 e backups automáticos semanais." },
  { q: "Os sites são otimizados para dispositivos móveis e SEO?", a: "Sim, todos os projetos são construídos mobile-first com carregamento sub-segundo (nota máxima no Lighthouse). Implementamos tags de SEO locais estruturadas e integração automática com mecanismos de busca." },
  { q: "Como funciona o processo de briefing e reuniões?", a: "O processo é totalmente digital. Realizamos um diagnóstico inicial para alinhar objetivos e mapear requisitos, seguido por reuniões de apresentação de layout e homologação antes do deploy oficial." }
];

const ServiceMockup = ({ index, title }: { index: number, title: string }) => {
  const [timeProgress, setTimeProgress] = useState(0);

  // States para a simulação do GTMetrix (Landing Pages)
  const [simState, setSimState] = useState<'analyzing' | 'results'>('analyzing');
  const [progress, setProgress] = useState(0);
  const [perfCount, setPerfCount] = useState(0);
  const [structCount, setStructCount] = useState(0);
  const [lcpCount, setLcpCount] = useState(3200);
  const [tbtCount, setTbtCount] = useState(450);
  const [clsCount, setClsCount] = useState(0.15);

  useEffect(() => {
    if (index !== 2) return;
    
    let interval: NodeJS.Timeout;
    let resultInterval: NodeJS.Timeout;
    
    const startCycle = () => {
      setSimState('analyzing');
      setProgress(0);
      setPerfCount(0);
      setStructCount(0);
      setLcpCount(3200);
      setTbtCount(450);
      setClsCount(0.15);
      
      let currentProg = 0;
      interval = setInterval(() => {
        currentProg += 5;
        if (currentProg <= 100) {
          setProgress(currentProg);
        } else {
          clearInterval(interval);
          setSimState('results');
          
          let perf = 0;
          let struct = 0;
          let lcp = 3200;
          let tbt = 450;
          let cls = 0.15;
          
          resultInterval = setInterval(() => {
            let done = true;
            if (perf < 100) {
              perf += 5;
              setPerfCount(Math.min(perf, 100));
              done = false;
            }
            if (struct < 100) {
              struct += 4;
              setStructCount(Math.min(struct, 100));
              done = false;
            }
            if (lcp > 349) {
              lcp -= 150;
              setLcpCount(Math.max(lcp, 349));
              done = false;
            }
            if (tbt > 0) {
              tbt -= 25;
              setTbtCount(Math.max(tbt, 0));
              done = false;
            }
            if (cls > 0.01) {
              cls -= 0.01;
              setClsCount(Math.max(cls, 0.01));
              done = false;
            }
            if (done) {
              clearInterval(resultInterval);
            }
          }, 30);
        }
      }, 70);
    };

    startCycle();
    
    const loopInterval = setInterval(() => {
      startCycle();
    }, 12000);

    return () => {
      clearInterval(interval);
      clearInterval(resultInterval);
      clearInterval(loopInterval);
    };
  }, [index]);


  useEffect(() => {
    if (index !== 4) return;
    const interval = setInterval(() => {
      setTimeProgress(prev => (prev + 15) % 1440); // Avança 15 minutos a cada 150ms (~14.4 segundos por ciclo de 24h)
    }, 150);
    return () => clearInterval(interval);
  }, [index]);

  const hours = Math.floor(timeProgress / 60);
  const minutes = timeProgress % 60;
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  const isDay = hours >= 6 && hours < 18; // Dia: das 06:00 às 17:59

  if (index === 0) {
    // 01: IDENTIDADE (Tipografia e Cores)
    return (
      <div className="absolute inset-0 flex flex-col justify-center items-center gap-8 w-full h-full p-6">
        <motion.div initial={{opacity:0.5, y:10}} animate={{opacity:1, y:0}} transition={{repeat: Infinity, repeatType: "reverse", duration: 4}} className="text-center space-y-3">
           <div className="text-6xl font-bold font-sans text-white tracking-tighter">Aa</div>
           <div className="text-[10px] text-muted-foreground font-mono-tag tracking-widest">INTER / BOLD / 700</div>
        </motion.div>
        <div className="flex gap-4">
           {['#00d1ff', '#80f5d2', '#ffffff', '#222222'].map((color, i) => (
             <motion.div key={i} initial={{scale:0.8, opacity: 0.5}} animate={{scale:1, opacity: 1}} transition={{delay: i*0.3, repeat: Infinity, repeatType: "reverse", duration: 2}} className="w-10 h-10 rounded-full border border-ink/50 shadow-lg" style={{backgroundColor: color}} />
           ))}
        </div>
      </div>
    );
  }

  if (index === 1) {
    // 02: PRODUTO DIGITAL (Skeleton UI) - Fundo escuro, apenas os esqueletos internos brilham/piscam em branco
    return (
      <div className="absolute inset-0 flex gap-4 w-full h-full p-6 bg-[#050505] overflow-hidden relative">
         <div className="w-1/4 h-full bg-[#0d0d0d] rounded-xl flex flex-col gap-3 p-3 border border-[#1a1a1a]">
            <div className="w-full h-8 bg-[#1a1a1a] rounded-md mb-2" />
            {[1,2,3,4].map(i => <motion.div key={i} animate={{opacity:[0.3, 0.7, 0.3]}} transition={{duration:2.5, delay:i*0.2, repeat:Infinity}} className="w-full h-3 bg-[#222] rounded" />)}
         </div>
         <div className="flex-1 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <motion.div animate={{width: ['30%', '60%', '30%']}} transition={{duration:5, repeat:Infinity, ease:"easeInOut"}} className="h-6 bg-[#0d0d0d] border border-[#1a1a1a] rounded-md" />
              <div className="w-8 h-8 rounded-full bg-[#0d0d0d] border border-[#1a1a1a]" />
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
               {[1,2,3,4].map(i => (
                 <motion.div 
                   key={i} 
                   initial={{y: 10, opacity:0}} 
                   animate={{y:0, opacity:1}} 
                   transition={{duration:0.8, delay:i*0.3, repeat:Infinity, repeatDelay:4}}
                   className="bg-[#0d0d0d] rounded-xl border border-[#1a1a1a] p-3 flex flex-col gap-2 justify-between"
                 >
                    <div className="flex items-center gap-2">
                       <motion.div 
                         animate={{ opacity: [0.2, 0.8, 0.2] }} 
                         transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                         className="w-5 h-5 rounded-full bg-white" 
                       />
                       <div className="flex-1 flex flex-col gap-1">
                          <motion.div 
                            animate={{ opacity: [0.2, 0.8, 0.2] }} 
                            transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                            className="h-1.5 bg-white rounded w-3/4" 
                          />
                          <motion.div 
                            animate={{ opacity: [0.1, 0.6, 0.1] }} 
                            transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
                            className="h-1 bg-white rounded w-1/2" 
                          />
                       </div>
                    </div>
                    <motion.div 
                      animate={{ opacity: [0.1, 0.5, 0.1] }} 
                      transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
                      className="w-full h-8 bg-white/20 rounded border border-white/10" 
                    />
                 </motion.div>
               ))}
            </div>
         </div>
      </div>
    );
  }

  if (index === 2) {
    // 03: LANDING PAGES (GTMetrix Simulation)
    return (
      <div className="absolute inset-0 flex flex-col justify-center items-center p-4 w-full h-full bg-[#050505] overflow-hidden select-none font-mono">
        {simState === 'analyzing' ? (
          <div className="w-full max-w-sm flex flex-col gap-4 px-6">
            <div className="flex flex-col gap-1.5 text-left">
              <span className="text-[9px] text-[#00d1ff] tracking-wider uppercase font-bold animate-pulse">{">_ ANALYZING PERFORMANCE..."}</span>
              <span className="text-[10px] text-zinc-400 font-mono break-all font-semibold">GET https://escom.studio/landing-page</span>
            </div>
            
            {/* Progress Bar Container */}
            <div className="w-full bg-[#0d0d11] h-3.5 rounded-full p-[2px] border border-zinc-800 flex items-center">
              <motion.div 
                className="bg-gradient-to-r from-[#00d1ff] to-[#80f5d2] h-full rounded-full"
                style={{ width: `${progress}%`, boxShadow: '0 0 10px rgba(0, 209, 255, 0.6)' }}
                layoutId="progressBar"
              />
            </div>
            
            <div className="flex justify-between items-center text-[9px] text-zinc-500 uppercase font-bold font-mono">
              <span>Auditing Lighthouse Core Vitals</span>
              <span className="text-[#00d1ff] font-semibold">{progress}%</span>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-sm flex flex-col items-center">
            {/* Header */}
            <div className="w-full flex justify-between items-center mb-2.5 text-[8px] font-bold text-zinc-500 uppercase tracking-widest px-1">
              <span>GTMetrix Grade</span>
              <span>Web Vitals (Fully Optimized)</span>
            </div>

            {/* GTMetrix Style Grid */}
            <div className="w-full grid grid-cols-12 gap-2 text-zinc-800">
              {/* Card Grade A */}
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="col-span-4 bg-white border border-zinc-200 rounded-lg p-2.5 flex flex-col justify-center items-center shadow-md relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/5 to-transparent opacity-30"></div>
                <span className="text-4xl md:text-5xl font-black bg-gradient-to-br from-[#10b981] to-[#059669] bg-clip-text text-transparent filter drop-shadow-[0_2px_4px_rgba(16,185,129,0.2)] tracking-tighter">
                  A
                </span>
                <span className="text-[6px] text-zinc-400 font-bold mt-1 tracking-widest">GRADE</span>
              </motion.div>

              {/* Card Performance */}
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="col-span-4 bg-white border border-zinc-200 rounded-lg p-2.5 flex flex-col justify-center items-center shadow-md"
              >
                <span className="text-2xl font-bold font-mono text-[#10b981] tracking-tight">
                  {perfCount}%
                </span>
                <span className="text-[6px] text-zinc-400 font-bold mt-1.5 tracking-wider">PERFORMANCE</span>
              </motion.div>

              {/* Card Structure */}
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="col-span-4 bg-white border border-zinc-200 rounded-lg p-2.5 flex flex-col justify-center items-center shadow-md"
              >
                <span className="text-2xl font-bold font-mono text-[#10b981] tracking-tight">
                  {structCount}%
                </span>
                <span className="text-[6px] text-zinc-400 font-bold mt-1.5 tracking-wider">STRUCTURE</span>
              </motion.div>

              {/* Web Vitals: LCP */}
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="col-span-4 bg-white border border-zinc-200 rounded-lg py-2 px-1 flex flex-col justify-center items-center shadow-md"
              >
                <span className="text-[7px] text-zinc-400 font-bold tracking-wider uppercase">LCP</span>
                <span className="text-sm font-extrabold font-mono text-[#10b981] mt-1">
                  {lcpCount > 999 ? `${(lcpCount/1000).toFixed(1)}s` : `${Math.round(lcpCount)}ms`}
                </span>
              </motion.div>

              {/* Web Vitals: TBT */}
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="col-span-4 bg-white border border-zinc-200 rounded-lg py-2 px-1 flex flex-col justify-center items-center shadow-md"
              >
                <span className="text-[7px] text-zinc-400 font-bold tracking-wider uppercase">TBT</span>
                <span className="text-sm font-extrabold font-mono text-[#10b981] mt-1">
                  {tbtCount}ms
                </span>
              </motion.div>

              {/* Web Vitals: CLS */}
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="col-span-4 bg-white border border-zinc-200 rounded-lg py-2 px-1 flex flex-col justify-center items-center shadow-md"
              >
                <span className="text-[7px] text-zinc-400 font-bold tracking-wider uppercase">CLS</span>
                <span className="text-sm font-extrabold font-mono text-[#10b981] mt-1">
                  {clsCount.toFixed(2)}
                </span>
              </motion.div>
            </div>

            {/* Linha de status inferior */}
            <div className="w-full flex justify-between items-center mt-3 text-[7px] font-bold text-zinc-500 uppercase tracking-widest px-1">
              <span>Status: Fully Optimized</span>
              <span>Server: London, UK</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (index === 3) {
    // 04: E-COMMERCE (Live Sales Feed)
    return (
      <div className="absolute inset-0 flex flex-col justify-end p-6 w-full h-full">
         <div className="absolute top-6 left-6 font-mono-tag text-[10px] text-[#00d1ff] flex items-center gap-2 bg-[#00d1ff]/10 px-3 py-1.5 border border-[#00d1ff]/30 rounded-full">
            <motion.div animate={{opacity:[1,0]}} transition={{duration:0.8, repeat:Infinity}} className="w-2 h-2 rounded-full bg-[#00d1ff] shadow-[0_0_8px_#00d1ff]" />
            LIVE DASHBOARD
         </div>
         <div className="space-y-3 w-full max-w-[280px] mx-auto relative z-10">
            {/* Fade overlay top */}
            <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-[#050505] to-transparent z-20" />
            {[1,2,3].map(i => (
              <motion.div key={i} initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.5, delay: i*1.5, repeat:Infinity, repeatDelay:3}} className="bg-[#111] border border-[#222] rounded-lg p-3 flex justify-between items-center shadow-lg">
                 <div className="flex gap-3 items-center">
                    <div className="w-8 h-8 bg-[#2a2a2a] rounded-md" />
                    <div className="flex flex-col gap-1.5">
                      <div className="w-16 h-2 bg-[#444] rounded" />
                      <div className="w-10 h-1.5 bg-[#333] rounded" />
                    </div>
                 </div>
                 <div className="text-xs text-[#00d1ff] font-mono font-bold">+R$ 1.250</div>
              </motion.div>
            ))}
         </div>
      </div>
    );
  }

  if (index === 4) {
    // 05: SISTEMAS WEB (Terminal Worker Logs) - fluxo 24h contínuo com transição Dia/Noite
    const processes = ['Monitor', 'Worker 1', 'Sync DB'];
    const logsList = [
      { time: "00:00", msg: "Iniciando ciclo noturno..." },
      { time: "01:30", msg: "Processando filas pendentes" },
      { time: "03:00", msg: "Backup automático [OK]" },
      { time: "04:15", msg: "Sincronizando réplicas" },
      { time: "05:30", msg: "Limpeza de cache CDN" },
      { time: "06:45", msg: "Pré-carregando assets" },
      { time: "08:00", msg: "Despertando instâncias" },
      { time: "09:15", msg: "Escalando workers +3" },
      { time: "10:30", msg: "Fila de e-mails [OK]" },
      { time: "11:45", msg: "Health check [PASS]" },
      { time: "13:00", msg: "Pico de tráfego detectado" },
      { time: "14:15", msg: "Auto-scale ativo" },
      { time: "15:30", msg: "Otimizando queries DB" },
      { time: "16:45", msg: "Webhook dispatch [OK]" },
      { time: "18:00", msg: "Gerando relatórios" },
      { time: "19:15", msg: "Compactando logs" },
      { time: "20:30", msg: "Reduzindo instâncias -2" },
      { time: "21:45", msg: "Verificação de segurança" },
      { time: "23:00", msg: "Encerrando sessão diária" },
      { time: "23:59", msg: "Reiniciando ciclo..." }
    ];

    const activeLogs = logsList.filter(log => {
      const [lHour, lMin] = log.time.split(':').map(Number);
      const logMinutes = lHour * 60 + lMin;
      return timeProgress >= logMinutes;
    });

    if (activeLogs.length === 0) {
      activeLogs.push(logsList[0]);
    }

    return (
      <div className={`absolute inset-0 flex w-full h-full p-4 transition-colors duration-1000 ${isDay ? 'bg-slate-100/50' : 'bg-black/50'}`}>
        <div className={`w-full h-full flex border text-xs font-mono shadow-2xl overflow-hidden relative transition-colors duration-1000 ${isDay ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#060606] border-[#1a1a1a] text-slate-100'}`}>
           {/* Painel esquerdo - Processos e Relógio */}
           <div className={`w-[38%] border-r p-4 flex flex-col justify-between transition-colors duration-1000 ${isDay ? 'bg-slate-50/50 border-slate-200' : 'bg-[#040404] border-[#1a1a1a]'}`}>
              <div className="flex flex-col gap-4">
                 <div className={`text-[9px] tracking-widest font-bold ${isDay ? 'text-slate-400' : 'text-[#555]'}`}>PROCESSOS</div>
                 <div className="flex flex-col gap-1.5 relative">
                   {/* Linha vertical de fluxo */}
                   <motion.div 
                     className="absolute left-[7px] top-3 bottom-3 w-px"
                     animate={{ background: isDay 
                       ? ["linear-gradient(to bottom, #00d1ff, #e2e8f0, #e2e8f0)", "linear-gradient(to bottom, #e2e8f0, #00d1ff, #e2e8f0)", "linear-gradient(to bottom, #e2e8f0, #e2e8f0, #00d1ff)", "linear-gradient(to bottom, #00d1ff, #e2e8f0, #e2e8f0)"]
                       : ["linear-gradient(to bottom, #00d1ff, #333, #333)", "linear-gradient(to bottom, #333, #00d1ff, #333)", "linear-gradient(to bottom, #333, #333, #00d1ff)", "linear-gradient(to bottom, #00d1ff, #333, #333)"]
                     }}
                     transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                   />
                   {processes.map((lbl, i) => (
                     <motion.div 
                       key={lbl} 
                       animate={{ 
                         color: isDay 
                           ? ["rgba(100,100,100,0.5)", "rgba(30,41,59,1)", "rgba(100,100,100,0.5)"]
                           : ["rgba(120,120,120,0.5)", "rgba(255,255,255,1)", "rgba(120,120,120,0.5)"],
                       }}
                       transition={{ duration: 6, repeat: Infinity, delay: i * 2, times: [0, 0.15, 0.35] }}
                       className="flex items-center gap-3 py-2 px-1 rounded relative z-10 text-[11px]"
                     >
                        <motion.div 
                           animate={{ 
                             backgroundColor: isDay ? ["#e2e8f0", "#00d1ff", "#e2e8f0"] : ["#222", "#00d1ff", "#222"],
                             boxShadow: ["0 0 0px transparent", "0 0 10px #00d1ff", "0 0 0px transparent"]
                           }}
                           transition={{ duration: 6, repeat: Infinity, delay: i * 2, times: [0, 0.15, 0.35] }}
                           className="w-[6px] h-[6px] rounded-full flex-shrink-0" 
                        />
                        {lbl}
                     </motion.div>
                   ))}
                 </div>
              </div>
              
              {/* Indicador 24/7 com Sol e Lua e Relógio Digital */}
              <div className={`flex flex-col gap-2 pt-3 border-t transition-colors duration-1000 ${isDay ? 'border-slate-200' : 'border-[#1a1a1a]'}`}>
                 <div className="flex items-center gap-2">
                   <div className={`text-sm font-bold font-mono tracking-wider transition-colors duration-1000 ${isDay ? 'text-slate-800' : 'text-white'}`}>
                     {formattedTime}
                   </div>
                   <div className={`w-4 h-4 transition-colors duration-1000 ${isDay ? 'text-amber-500' : 'text-indigo-400'}`}>
                     {isDay ? (
                       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M17.36 17.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M17.36 6.64l1.42-1.42"/></svg>
                     ) : (
                       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                     )}
                   </div>
                 </div>
                 <div className={`text-[8px] tracking-widest font-bold transition-colors duration-1000 ${isDay ? 'text-amber-600' : 'text-[#00d1ff]'}`}>
                   {isDay ? 'DIA (SOL)' : 'NOITE (LUA)'}
                 </div>
              </div>
           </div>
           
           {/* Painel direito - Fluxo de logs scrollando */}
           <div className={`flex-1 relative overflow-hidden transition-colors duration-1000 ${isDay ? 'bg-slate-50' : 'bg-[#060606]'}`}>
              {/* Fade overlays */}
              <div className={`absolute top-0 left-0 right-0 h-8 z-20 pointer-events-none transition-colors duration-1000 ${isDay ? 'bg-gradient-to-b from-slate-50 to-transparent' : 'bg-gradient-to-b from-[#060606] to-transparent'}`} />
              <div className={`absolute bottom-0 left-0 right-0 h-8 z-20 pointer-events-none transition-colors duration-1000 ${isDay ? 'bg-gradient-to-t from-slate-50 to-transparent' : 'bg-gradient-to-t from-[#060606] to-transparent'}`} />
              
              <div className="flex flex-col gap-0 absolute top-2 left-0 right-0 px-2">
                 {activeLogs.slice().reverse().slice(0, 8).map((log, i) => {
                   const [lHour] = log.time.split(':').map(Number);
                   const isLogNight = lHour < 6 || lHour >= 18;
                   return (
                     <div key={i} className={`flex gap-2 py-[5px] px-2 text-[10px] sm:text-[11px] border-b transition-colors duration-1000 ${isDay ? 'border-slate-100' : 'border-[#111]'}`}>
                       <span className={`font-bold flex-shrink-0 w-[36px] transition-colors duration-1000 ${isLogNight ? 'text-indigo-500' : 'text-amber-500'}`}>{log.time}</span>
                       <span className={`transition-colors duration-1000 ${isDay ? 'text-slate-600' : 'text-[#777]'}`}>{log.msg}</span>
                     </div>
                   );
                 })}
              </div>
           </div>
        </div>
      </div>
    );
  }

  // 06: ENGENHARIA (Network Graph / Arquitetura)
  const nodes = [
    { x: 50, y: 30, label: "Frontend", delay: 0 },
    { x: 250, y: 40, label: "Database", delay: 0.2 },
    { x: 40, y: 150, label: "Analytics", delay: 0.4 },
    { x: 260, y: 160, label: "Webhooks", delay: 0.6 },
    { x: 150, y: 220, label: "API", delay: 0.8 },
  ];
  const center = { x: 150, y: 100 };

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 w-full h-full">
      <svg className="w-full h-full" viewBox="0 0 300 250" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00d1ff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00d1ff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {nodes.map((node, i) => (
          <g key={`line-${i}`}>
            <line x1={center.x} y1={center.y} x2={node.x} y2={node.y} stroke="#333" strokeWidth="1" strokeDasharray="2 4" />
            <motion.line
              x1={center.x} y1={center.y} x2={node.x} y2={node.y}
              stroke="#00d1ff" strokeWidth="1.5" strokeDasharray="10 50"
              initial={{ strokeDashoffset: 100 }} animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 2 + (i * 0.5), repeat: Infinity, ease: "linear" }}
            />
          </g>
        ))}

        <circle cx={center.x} cy={center.y} r="30" fill="url(#glow)" />
        <motion.circle cx={center.x} cy={center.y} r="12" fill="#111" stroke="#00d1ff" strokeWidth="2" />
        <motion.circle 
          cx={center.x} cy={center.y} r="4" fill="#00d1ff"
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <text x={center.x} y={center.y + 28} fill="#fff" fontSize="8" fontFamily="monospace" textAnchor="middle" letterSpacing="1">
          {title.toUpperCase()} V1.0
        </text>

        {nodes.map((node, i) => (
          <g key={`node-${i}`}>
            <rect x={node.x - 30} y={node.y - 8} width="60" height="16" rx="4" fill="#050505" stroke="#222" strokeWidth="1" />
            <text x={node.x} y={node.y + 3} fill="#888" fontSize="6" fontFamily="monospace" textAnchor="middle">{node.label}</text>
            <motion.circle 
              cx={node.x - 24} cy={node.y} r="2" fill="#00d1ff"
              initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, delay: node.delay, repeat: Infinity }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
};

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

function AnimatedMetric({ value, className }: { value: string; className?: string }) {
  const [count, setCount] = useState(0);
  const [inView, setInView] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);

  const numMatch = value.match(/\d+/);
  const targetNum = numMatch ? parseInt(numMatch[0], 10) : 0;
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true);
    }, { threshold: 0.1 });
    if (nodeRef.current) observer.observe(nodeRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (inView && targetNum > 0) {
      let startTime: number | null = null;
      const duration = 2000;
      
      const update = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(easeOut * targetNum));
        
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          setCount(targetNum);
        }
      };
      requestAnimationFrame(update);
    }
  }, [inView, targetNum]);

  const displayValue = targetNum > 0 ? value.replace(targetNum.toString(), count.toString()) : value;

  return (
    <div ref={nodeRef} className={className}>
      {displayValue}
    </div>
  );
}

export default function BrillianceHome() {
  const [gifs, setGifs] = useState<string[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const colors = ['#00d1ff', '#ffffff', '#222222'];
      // Extensão do Efeito de Pixel Explosivo
      for (let i = 0; i < 45; i++) {
        const particle = document.createElement('div');
        particle.className = 'fixed pointer-events-none z-[99999]';
        const size = Math.random() * 12 + 4;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.mixBlendMode = 'difference';
        particle.style.left = e.clientX + 'px';
        particle.style.top = e.clientY + 'px';
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = 50 + Math.random() * 150; // Maior força de explosão
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        document.body.appendChild(particle);
        
        particle.animate([
          { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
          { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`, opacity: 0 }
        ], {
          duration: 1000 + Math.random() * 800, // Maior duração
          easing: 'cubic-bezier(0, .9, .57, 1)'
        });
        
        setTimeout(() => particle.remove(), 2000);
      }
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    getPortfolioProjects().then(data => {
      const destaqueImages = data.filter(p => p.destaque && p.image).map(p => p.image);
      setGifs(destaqueImages.length > 0 ? destaqueImages : [
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400",
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400",
          "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=400"
      ]);
    });
  }, []);

  const [open, setOpen] = useState<number | null>(0);
  const [scrollY, setScrollY] = useState(0);
  const [innerHeight, setInnerHeight] = useState(800);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInnerHeight(window.innerHeight);
    const handleResize = () => setInnerHeight(window.innerHeight);
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    const handleMouse = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      setMouseX((e.clientX - cx) / cx);
      setMouseY((e.clientY - cy) / cy);
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  // Fórmulas para o Parallax e Smooth Blur no scroll (iniciando apenas após a Seção 2 cobrir 70% da tela)
  const triggerPoint = innerHeight * 0.7;
  const endPoint = innerHeight;
  
  let textOpacity = 1;
  let textBlur = 0;
  let mediaOpacity = 1;
  let mediaBlur = 0;

  if (scrollY > triggerPoint) {
    const progress = Math.min(1, (scrollY - triggerPoint) / (endPoint - triggerPoint));
    textOpacity = 1 - progress;
    textBlur = progress * 12;
    mediaOpacity = 1 - progress;
    mediaBlur = progress * 16;
  }

  // Evita que as propriedades de opacidade/blur parciais forcem o navegador a criar um Stacking Context isolado
  // na div do título no topo da tela, o que impede a mesclagem mix-blend-mode: difference com o robô/rochas de trás.
  const titleStyle = scrollY > 0 ? {
    opacity: textOpacity,
    filter: `blur(${textBlur}px)`
  } : {};

  const bgTranslateY = scrollY * 0.12;
  const robotTranslateY = scrollY * 0.2;
  const rocksTranslateY = scrollY * 0.32;

  // Header dinâmico com base no scroll
  const headerBg = scrollY > 50 
    ? "bg-[#050505]/90 backdrop-blur-md border-b border-white/10" 
    : "bg-transparent border-b border-transparent";
  
  const headerTextColor = "text-white";
  const headerTextColorMuted = "text-white/80";
    
  const headerButtonClass = scrollY > 50
    ? "font-mono-tag border border-white/20 bg-white/10 px-4 py-2 text-white transition hover:bg-signal hover:text-black hover:border-signal"
    : "font-mono-tag border border-white bg-white px-4 py-2 text-black transition hover:bg-signal hover:text-black hover:border-signal";

  const headerPosition = scrollY > 50 
    ? "fixed top-0 left-0 w-full" 
    : "absolute top-0 left-0 w-full";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <header className={`${headerPosition} z-50 transition-all duration-300 ${headerBg}`}>
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-10">
          <a href="#" className={`font-mono-tag font-semibold transition-colors duration-300 ${headerTextColor} flex items-center gap-2.5`}>
            <span className="w-2.5 h-2.5 bg-[#00d1ff] inline-block"></span>
            ESCOM/STUDIO
          </a>
          <nav className={`hidden gap-8 font-mono-tag md:flex transition-colors duration-300 ${headerTextColorMuted}`}>
            <a href="#servicos" className="hover:text-[#00d1ff] uppercase">Serviços</a>
            <a href="#processo" className="hover:text-[#00d1ff] uppercase">Processo</a>
            <a href="#portfolio" className="hover:text-[#00d1ff] uppercase">Portfólio</a>
            <a href="#custos" className="hover:text-[#00d1ff] uppercase">Custos</a>
            <a href="#contato" className="hover:text-[#00d1ff] uppercase">Contato</a>
          </nav>
          <a href="#contato" className={`transition-all duration-300 uppercase ${headerButtonClass}`}>
            Iniciar →
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="sticky top-0 z-10 h-screen w-full overflow-hidden bg-[#050505] flex flex-col justify-between">
        {/* Camada z-0: Imagem de Fundo Estática com Parallax e Smooth Blur */}
        <div 
          className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
          style={{ 
            transform: `translateY(${bgTranslateY}px)`, 
            opacity: mediaOpacity,
            filter: `blur(${mediaBlur}px)`
          }}
        >
          <img className="absolute inset-0 w-full h-full object-cover object-center scale-[1.40]" src="https://res.cloudinary.com/djw0tqmiw/image/upload/v1780418938/jciyygvvbgjb5otgwoys.png" alt="Static Background" />
        </div>

        {/* Camada z-20: Robô com repulsão suave ao mouse + parallax scroll */}
        <div 
          className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none z-20"
          style={{
            transform: `translateY(${robotTranslateY}px) translateX(${-mouseX * 15}px) translateY(${-mouseY * 15}px)`,
            opacity: mediaOpacity,
            filter: `blur(${mediaBlur}px)`
          }}
        >
          <img 
            src="https://res.cloudinary.com/djw0tqmiw/image/upload/v1780418950/fu4xtoaqvpiao1fmpyuq.png" 
            className="max-w-[85vw] md:max-w-[48vw] h-auto object-contain pointer-events-none animate-float-slow" 
            alt="Floating Visual Element 1" 
          />
        </div>
        
        {/* Camada z-30: Círculo com repulsão suave ao mouse (mais intensa) + parallax scroll */}
        <div 
          className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none z-30"
          style={{
            transform: `translateY(${rocksTranslateY}px) translateX(${-mouseX * 22}px) translateY(${-mouseY * 22}px)`,
            opacity: mediaOpacity,
            filter: `blur(${mediaBlur}px)`
          }}
        >
          <img 
            src="https://res.cloudinary.com/djw0tqmiw/image/upload/v1780418951/bp7wdizjvdpklcx3jt6h.png" 
            className="max-w-[92vw] md:max-w-[52vw] h-auto object-contain pointer-events-none animate-float-rocks" 
            alt="Floating Visual Element 2" 
          />
        </div>

        {/* Camada z-35: Overlay Mask Superior com Smooth Blur */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] md:w-[65vw] pointer-events-none z-[35]"
          style={{
            transform: `translateY(${bgTranslateY}px)`,
            opacity: mediaOpacity,
            filter: `blur(${mediaBlur}px)`
          }}
        >
          <img src="https://res.cloudinary.com/djw0tqmiw/image/upload/v1780418939/e84odyan3ohg2t8646rg.png" className="w-full h-auto object-contain pointer-none origin-top" style={{ maskImage: 'linear-gradient(to bottom, black 45%, transparent 90%)', WebkitMaskImage: 'linear-gradient(to bottom, black 45%, transparent 90%)' }} alt="Overlay Mask" />
        </div>

        {/* Camada z-40: Bloco de Conteúdo Principal (Alinhado à esquerda) */}
        <div 
          className="mx-auto max-w-[1400px] px-6 md:px-10 w-full flex-1 flex flex-col justify-center relative z-40 pt-16 pointer-events-none"
          style={{
            opacity: textOpacity,
            filter: `blur(${textBlur}px)`
          }}
        >
          <div className="max-w-2xl text-left flex flex-col pointer-events-auto">
            {/* Tag exe / metadados */}
            <div className="mb-6 flex items-center gap-2.5 font-mono text-[10px] tracking-[0.2em] text-[#888] uppercase select-none">
              <span className="text-[#00d1ff] animate-[pulse_1.5s_infinite] font-sans font-bold">▮</span>
              <span>{">_ [ ARQUITETURA_DIGITAL.EXE ] / V.2026.01"}</span>
            </div>

            {/* Título principal empilhado (sem fonte serifada) */}
            <h1 className="display-mega text-[9.5vw] md:text-[6.5vw] lg:text-[5.5vw] xl:text-[5vw] leading-[0.95] select-none text-white opacity-95 flex flex-col w-full font-bold">
              <span className="w-full block">Engenharia</span>
              <span className="w-full block text-zinc-400 italic leading-[1.05] mt-1">e conversão</span>
              <span className="w-full block italic leading-[1.05] text-white mt-1">brutalista</span>
            </h1>

            {/* Linha horizontal ciano */}
            <div className="w-16 h-[2px] bg-[#00d1ff] my-6" />

            {/* Parágrafo explicativo */}
            <p className="text-sm md:text-base leading-relaxed text-zinc-300 max-w-lg mb-8 select-text">
              Projetos digitais de alta performance que unem <span className="text-[#00d1ff] font-medium">design, automação e inteligência de dados</span> em um único ecossistema. Sem atalhos. Sem SaaS. Sem custos invisíveis.
            </p>

            {/* Botões de Ação */}
            <div className="flex flex-wrap gap-4">
              <a href="#contato" className="border border-[#00d1ff] bg-[#00d1ff] text-black px-6 py-3.5 font-mono text-xs uppercase tracking-wider font-bold transition hover:bg-white hover:text-black hover:border-white shadow-lg">
                Agendar diagnóstico →
              </a>
              <a href="#servicos" className="border border-white/30 bg-black/40 text-white px-6 py-3.5 font-mono text-xs uppercase tracking-wider font-bold transition hover:bg-white hover:text-black hover:border-white backdrop-blur-md">
                Ver capacidades
              </a>
            </div>
          </div>
        </div>

        {/* Camada z-40: Diferenciais Soltos Flutuantes (Alinhados à direita) */}
        <div 
          className="absolute right-6 md:right-12 lg:right-20 top-[52%] -translate-y-1/2 hidden lg:flex flex-col gap-10 max-w-[280px] z-40 pointer-events-none"
          style={{
            opacity: textOpacity,
            filter: `blur(${textBlur}px)`
          }}
        >
          {/* Diferencial 1 */}
          <motion.div 
            className="flex flex-col text-left pointer-events-auto"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="flex items-center gap-2 text-[#00d1ff] mb-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
              </svg>
              <span className="font-mono text-[9px] uppercase tracking-wider font-semibold text-white">TECNOLOGIA SOB MEDIDA</span>
            </div>
            <p className="text-[11px] leading-normal text-zinc-400">
              Soluções personalizadas com foco em performance e segurança.
            </p>
          </motion.div>

          {/* Diferencial 2 */}
          <motion.div 
            className="flex flex-col text-left pointer-events-auto"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <div className="flex items-center gap-2 text-[#00d1ff] mb-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                <rect x="16" y="16" width="6" height="6" rx="1" />
                <rect x="2" y="16" width="6" height="6" rx="1" />
                <rect x="9" y="2" width="6" height="6" rx="1" />
                <path d="M12 8v8M12 16h4M12 16H8" />
              </svg>
              <span className="font-mono text-[9px] uppercase tracking-wider font-semibold text-white">AUTOMAÇÃO INTELIGENTE</span>
            </div>
            <p className="text-[11px] leading-normal text-zinc-400">
              Processos otimizados com IA e integração de sistemas sem dependência de SaaS.
            </p>
          </motion.div>

          {/* Diferencial 3 */}
          <motion.div 
            className="flex flex-col text-left pointer-events-auto"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <div className="flex items-center gap-2 text-[#00d1ff] mb-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
              </svg>
              <span className="font-mono text-[9px] uppercase tracking-wider font-semibold text-white">DADOS QUE DECIDEM</span>
            </div>
            <p className="text-[11px] leading-normal text-zinc-400">
              Transformamos dados em vantagem competitiva com análise e visualização.
            </p>
          </motion.div>

          {/* Diferencial 4 */}
          <motion.div 
            className="flex flex-col text-left pointer-events-auto"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          >
            <div className="flex items-center gap-2 text-[#00d1ff] mb-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              <span className="font-mono text-[9px] uppercase tracking-wider font-semibold text-white">ECOSSISTEMA FECHADO</span>
            </div>
            <p className="text-[11px] leading-normal text-zinc-400">
              Tudo que você precisa, integrado. Sem custos invisíveis.
            </p>
          </motion.div>
        </div>

        {/* Elemento de rodapé vazio apenas para manter alinhamento flex da section */}
        <div className="w-full h-8 opacity-0 pointer-events-none mt-auto" />
      </section>

      {/* SEÇÃO 2 WRAPPER: Sobe sobre o HERO fixo no scroll */}
      <div className="relative z-20 bg-[#050505] shadow-[0_-15px_40px_rgba(0,0,0,0.95)]">
        {/* MARQUEE */}
      <div className="overflow-hidden border-b border-ink bg-ink py-4 text-paper">
        <div className="flex animate-[scroll_40s_linear_infinite] gap-12 whitespace-nowrap font-mono-tag">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="flex items-center gap-12">
              <span>LANDING PAGE</span><span className="text-signal">◆</span>
              <span>SITE</span><span className="text-signal">◆</span>
              <span>E-COMMERCE</span><span className="text-signal">◆</span>
              <span>CRM</span><span className="text-signal">◆</span>
              <span>DASHBOARD</span><span className="text-signal">◆</span>
              <span>PORTAIS</span><span className="text-signal">◆</span>
            </span>
          ))}
        </div>
        <style>{`@keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
      </div>

      {/* SERVICES */}
      <section id="servicos" className="border-b border-ink bg-[#050505] relative overflow-hidden">
        {/* Background glow sutil para o estilo galáxia/espaço */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#00e6a5]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#00d1ff]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 md:py-32 relative z-10">
          
          {/* BLOCO O QUE BEM FAZEMOS (CONFORME ANEXO 1) */}
          <div className="mb-24 grid gap-12 lg:grid-cols-12 items-center">
            {/* Lado Esquerdo: Grid 2x2 de Cards de Serviços */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Card 1 */}
              <motion.div 
                whileHover={{ y: -5, borderColor: "rgba(0, 230, 165, 0.4)" }}
                className="bg-[#0b0c14]/90 border border-white/10 rounded-2xl p-6 relative overflow-hidden group shadow-xl backdrop-blur-md flex flex-col justify-between min-h-[190px]"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#00e6a5]/5 rounded-full blur-xl group-hover:bg-[#00e6a5]/15 transition-all" />
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00e6a5] mb-4 text-2xl group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-white tracking-tight leading-snug">Estratégias de Marketing</h4>
                </div>
                <div className="flex justify-end mt-4">
                  <a href="#contato" className="w-9 h-9 rounded-lg bg-white/5 group-hover:bg-[#00e6a5] text-white group-hover:text-black flex items-center justify-center transition-colors">
                    <span className="text-lg">→</span>
                  </a>
                </div>
              </motion.div>

              {/* Card 2 */}
              <motion.div 
                whileHover={{ y: -5, borderColor: "rgba(0, 230, 165, 0.4)" }}
                className="bg-[#0b0c14]/90 border border-white/10 rounded-2xl p-6 relative overflow-hidden group shadow-xl backdrop-blur-md flex flex-col justify-between min-h-[190px]"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#00d1ff]/5 rounded-full blur-xl group-hover:bg-[#00d1ff]/15 transition-all" />
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00e6a5] mb-4 text-2xl group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-white tracking-tight leading-snug">Automação de Marketing</h4>
                </div>
                <div className="flex justify-end mt-4">
                  <a href="#contato" className="w-9 h-9 rounded-lg bg-white/5 group-hover:bg-[#00e6a5] text-white group-hover:text-black flex items-center justify-center transition-colors">
                    <span className="text-lg">→</span>
                  </a>
                </div>
              </motion.div>

              {/* Card 3 */}
              <motion.div 
                whileHover={{ y: -5, borderColor: "rgba(0, 230, 165, 0.4)" }}
                className="bg-[#0b0c14]/90 border border-white/10 rounded-2xl p-6 relative overflow-hidden group shadow-xl backdrop-blur-md flex flex-col justify-between min-h-[190px]"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#00e6a5]/5 rounded-full blur-xl group-hover:bg-[#00e6a5]/15 transition-all" />
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00e6a5] mb-4 text-2xl group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 12h-2.25m-.166 5.834-1.591-1.591M12 18v2.25m-5.834-.166 1.591-1.591M3.75 12h2.25m.166-5.834 1.591 1.591" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-white tracking-tight leading-snug">Mídia Paga e Performance</h4>
                </div>
                <div className="flex justify-end mt-4">
                  <a href="#contato" className="w-9 h-9 rounded-lg bg-white/5 group-hover:bg-[#00e6a5] text-white group-hover:text-black flex items-center justify-center transition-colors">
                    <span className="text-lg">→</span>
                  </a>
                </div>
              </motion.div>

              {/* Card 4 */}
              <motion.div 
                whileHover={{ y: -5, borderColor: "rgba(0, 230, 165, 0.4)" }}
                className="bg-[#0b0c14]/90 border border-white/10 rounded-2xl p-6 relative overflow-hidden group shadow-xl backdrop-blur-md flex flex-col justify-between min-h-[190px]"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#00d1ff]/5 rounded-full blur-xl group-hover:bg-[#00d1ff]/15 transition-all" />
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00e6a5] mb-4 text-2xl group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 0 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-white tracking-tight leading-snug">Marketing de Conteúdo</h4>
                </div>
                <div className="flex justify-end mt-4">
                  <a href="#contato" className="w-9 h-9 rounded-lg bg-white/5 group-hover:bg-[#00e6a5] text-white group-hover:text-black flex items-center justify-center transition-colors">
                    <span className="text-lg">→</span>
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Lado Direito: Título, Descrição e Botão CTA Principal */}
            <div className="lg:col-span-6 flex flex-col justify-center gap-6">
              <span className="text-xs font-mono font-bold tracking-[0.25em] text-[#00e6a5] uppercase">
                O QUE BEM FAZEMOS
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-sans tracking-tight">
                Geração de Leads Qualificados com Estratégias Profissionais em Marketing Digital
              </h2>
              <p className="text-base md:text-lg leading-relaxed text-zinc-300">
                Somos especialistas em Marketing Digital e temos <strong class="text-[#00e6a5]">CERTEZA</strong> que encontraremos a melhor aplicação para a sua empresa. Acreditamos em <strong class="text-[#00e6a5]">PROCESSOS de MARKETING</strong>, focado em conversão e em melhorar o relacionamento com seus clientes atuais.
              </p>
              <div>
                <a 
                  href="https://wa.me/5513981062787?text=Ola!%20Quero%20falar%20com%20um%20especialista%20da%20ESCOM%20STUDIO" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-[#00e6a5] hover:bg-[#00c58e] text-black font-extrabold px-8 py-4 rounded-xl text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_0_25px_rgba(0,230,165,0.4)] hover:scale-105"
                >
                  Fale com um Especialista →
                </a>
              </div>
            </div>
          </div>

          {/* DETALHAMENTO DE CAPACIDADES */}
          <div className="border-t border-white/10 pt-20">
            <div className="mb-16 grid gap-8 md:grid-cols-12">
              <div className="md:col-span-4">
                <div className="font-mono-tag text-[#00d1ff]">{">_ /02 CAPACIDADES"}</div>
                <h2 className="display-mega mt-4 text-5xl md:text-6xl">O que<br />fazemos.</h2>
              </div>
              <p className="text-lg leading-relaxed md:col-span-7 md:col-start-6 md:text-xl text-zinc-300">
                Seis disciplinas operando como um único ecossistema. Cada entrega é lapidada com supervisão criativa direta, do primeiro wireframe ao deploy final.
              </p>
            </div>
            <div className="flex flex-col gap-24 mt-16 border-t border-ink pt-16">
              {SERVICES.map((s, i) => (
                <div
                  key={s.n}
                  className="grid gap-12 items-center md:grid-cols-2 group"
                >
                  {/* TEXT SIDE */}
                  <div className={`flex flex-col gap-6 ${i % 2 !== 0 ? 'md:order-2' : ''}`}>
                    <div className="flex items-center gap-4">
                      <span className="font-mono-tag bg-gradient-to-r from-[#00d1ff] to-[#80f5d2] bg-clip-text text-transparent font-bold">/{s.n}</span>
                      <div className="h-px bg-ink flex-1 max-w-[100px]"></div>
                    </div>
                    <h3 className="display-mega text-4xl md:text-5xl lg:text-6xl">{s.name}</h3>
                    <p className="text-lg leading-relaxed text-muted-foreground max-w-lg">{s.desc}</p>
                    <div>
                      <a href="#contato" className="inline-block mt-4 border border-ink bg-background text-foreground px-6 py-3 font-mono-tag transition hover:bg-ink hover:text-paper">
                        Explorar {s.name} →
                      </a>
                    </div>
                  </div>

                  {/* ANIMATED BOX SIDE */}
                  <div className={`relative h-[300px] md:h-[400px] w-full rounded-2xl border border-ink bg-[#050505] overflow-hidden flex items-center justify-center p-6 md:p-12 ${i % 2 !== 0 ? 'md:order-1' : ''}`}>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#00d1ff] to-transparent"></div>
                    
                    {/* Mockup Window */}
                    <motion.div 
                      initial={{ y: 20, opacity: 0.8 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      transition={{ duration: 0.5 }}
                      viewport={{ once: true }}
                      className="relative z-10 w-full h-full border border-ink bg-black rounded-lg shadow-2xl flex flex-col overflow-hidden"
                    >
                      {/* Header */}
                      <div className="h-8 border-b border-ink flex items-center px-4 gap-2 bg-[#0a0a0a]">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 shadow-[0_0_5px_rgba(239,68,68,0.3)]"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 shadow-[0_0_5px_rgba(234,179,8,0.3)]"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80 shadow-[0_0_5px_rgba(34,197,94,0.3)]"></div>
                        <div className="mx-auto text-[10px] font-mono-tag text-muted-foreground opacity-70 tracking-widest">{s.name.toUpperCase()}.EXE</div>
                      </div>
                      {/* Body */}
                      <div className="flex-1 p-6 flex flex-col justify-center items-center relative overflow-hidden">
                        {/* Grid lines inside */}
                        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(#ffffff10 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
                        
                        <ServiceMockup index={i} title={s.name} />
                      </div>
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
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
                {['— CRM externo', '— Plataforma de e-mail', '— Builder de landing pages', '— Ferramenta de automação', '— Analytics + heatmap'].map((item, i) => (
                  <motion.li 
                    key={item}
                    initial={{ color: "rgba(238, 237, 232, 0.7)" }}
                    whileInView={{ color: "#ef4444" }}
                    transition={{ duration: 0.4, delay: 0.3 + (i * 0.2) }}
                    viewport={{ once: true }}
                  >
                    {item}
                  </motion.li>
                ))}
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

      {/* SEÇÃO PREÇOS ELEGANTES / PRICING (CONFORME ANEXO 2) */}
      <section id="precos" className="border-b border-white/10 bg-[#050507] py-24 relative overflow-hidden">
        {/* Marca d'água "Pricing" ao fundo com glow radial */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18vw] font-bold text-white/[0.02] tracking-widest pointer-events-none uppercase font-mono select-none">
          Pricing
        </div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#00d1ff]/15 via-[#00e6a5]/10 to-transparent rounded-full blur-[140px] pointer-events-none" />

        <div className="mx-auto max-w-[1400px] px-6 md:px-10 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-xs font-mono font-bold tracking-[0.3em] text-[#00d1ff] uppercase">
              INVESTIMENTO TRANSPARENTE
            </span>
            <h2 className="display-mega mt-3 text-4xl md:text-6xl text-white">
              Planos & Preços Elegantes
            </h2>
            <p className="mt-4 text-base md:text-lg text-zinc-400">
              Sistemas proprietários construídos sob medida. Sem mensalidades ocultas de SaaS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Card 1: Landing Page */}
            <motion.div 
              whileHover={{ y: -8 }}
              className="bg-[#0b0d17]/80 backdrop-blur-xl border border-white/10 hover:border-[#00d1ff]/40 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative group"
            >
              <div>
                <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest block mb-2">
                  Landing Page
                </span>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-xs font-mono text-zinc-400">a partir de</span>
                  <span className="text-4xl md:text-5xl font-extrabold text-white tracking-tight font-sans">
                    R$ 2.200
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mb-8 leading-relaxed">
                  Para freelancers, prestadores de serviços e campanhas de tráfego pago com foco em conversão rápida.
                </p>
                <div className="space-y-3 border-t border-white/10 pt-6 text-xs text-zinc-300 font-mono">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#00e6a5] font-bold">✓</span>
                    <span>Design Brutalista & Mobile First</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#00e6a5] font-bold">✓</span>
                    <span>Carregamento Sub-segundo (100/100)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#00e6a5] font-bold">✓</span>
                    <span>Copy Persuasiva & Engenharia CRO</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#00e6a5] font-bold">✓</span>
                    <span>Webhook Direto para CRM / WhatsApp</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#00e6a5] font-bold">✓</span>
                    <span>Sem mensalidades de SaaS terceirizados</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-6">
                <a 
                  href="https://wa.me/5513981062787?text=Ola!%20Quero%20contratar%20a%20Landing%20Page%20por%20R$%202.200" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs uppercase tracking-wider font-bold text-center block transition-all group-hover:border-[#00d1ff]/60"
                >
                  Escolher Landing Page →
                </a>
              </div>
            </motion.div>

            {/* Card 2: Site Profissional (Destaque Popular) */}
            <motion.div 
              whileHover={{ y: -8 }}
              className="bg-gradient-to-b from-[#0e1324]/90 to-[#0b0d17]/90 backdrop-blur-xl border-2 border-[#00d1ff]/60 rounded-3xl p-8 flex flex-col justify-between shadow-[0_0_50px_rgba(0,209,255,0.15)] relative group"
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#00d1ff] text-black text-[10px] font-mono font-extrabold uppercase tracking-widest px-4 py-1 rounded-full shadow-lg">
                MAIS POPULAR
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-[#00d1ff] uppercase tracking-widest block mb-2">
                  Site Profissional
                </span>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-xs font-mono text-zinc-400">a partir de</span>
                  <span className="text-4xl md:text-5xl font-extrabold text-white tracking-tight font-sans">
                    R$ 4.500
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mb-8 leading-relaxed">
                  Para empresas que buscam autoridade inquestionável, posicionamento premium e estrutura multi-páginas.
                </p>
                <div className="space-y-3 border-t border-white/10 pt-6 text-xs text-zinc-300 font-mono">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#00d1ff] font-bold">✓</span>
                    <span>Estrutura Multi-páginas (Home, Sobre, Serviços)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#00d1ff] font-bold">✓</span>
                    <span>Dossiê de Análise Comercial + Prospecção Nativa</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#00d1ff] font-bold">✓</span>
                    <span>Micro-interações & Animações GSAP</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#00d1ff] font-bold">✓</span>
                    <span>SEO Local Avançado & Schema.org</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#00d1ff] font-bold">✓</span>
                    <span>Blog / CMS Integrado para Conteúdo</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#00d1ff] font-bold">✓</span>
                    <span>Suporte & Treinamento por 30 dias</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-6">
                <a 
                  href="https://wa.me/5513981062787?text=Ola!%20Quero%20contratar%20o%20Site%20Profissional%20por%20R$%204.500" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 rounded-xl bg-[#00d1ff] hover:bg-white text-black font-mono text-xs uppercase tracking-wider font-bold text-center block transition-all shadow-[0_0_20px_rgba(0,209,255,0.4)]"
                >
                  Escolher Site Profissional →
                </a>
              </div>
            </motion.div>

            {/* Card 3: Automação de Marketing */}
            <motion.div 
              whileHover={{ y: -8 }}
              className="bg-[#0b0d17]/80 backdrop-blur-xl border border-white/10 hover:border-[#00e6a5]/40 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative group"
            >
              <div>
                <span className="text-xs font-mono font-bold text-[#00e6a5] uppercase tracking-widest block mb-2">
                  Automação de Marketing
                </span>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-xs font-mono text-zinc-400">a partir de</span>
                  <span className="text-4xl md:text-5xl font-extrabold text-white tracking-tight font-sans">
                    R$ 6.800
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mb-8 leading-relaxed">
                  Para operações em crescimento que querem automatizar atendimento, triagem e fechamento de vendas 24/7.
                </p>
                <div className="space-y-3 border-t border-white/10 pt-6 text-xs text-zinc-300 font-mono">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#00e6a5] font-bold">✓</span>
                    <span>CRM Proprietário Integrado ao Backend</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#00e6a5] font-bold">✓</span>
                    <span>Agentes de IA & Triagem Automática de Leads</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#00e6a5] font-bold">✓</span>
                    <span>Disparos de WhatsApp & E-mail Automatizados</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#00e6a5] font-bold">✓</span>
                    <span>Dashboard de Métricas ao Vivo (LTV, CAC, ROI)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#00e6a5] font-bold">✓</span>
                    <span>Integração de Webhooks, Pagamentos & ERP</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-6">
                <a 
                  href="https://wa.me/5513981062787?text=Ola!%20Quero%20contratar%20a%20Automacao%20de%20Marketing%20por%20R$%206.800" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs uppercase tracking-wider font-bold text-center block transition-all group-hover:border-[#00e6a5]/60"
                >
                  Escolher Automação →
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="processo" className="border-b border-ink">
        <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 md:py-32">
          <div className="mb-16 grid gap-8 md:grid-cols-12">
            <div className="md:col-span-5">
              <div className="font-mono-tag text-[#00d1ff]">{">_ /04 PROCESSO"}</div>
              <h2 className="display-mega mt-4 text-5xl md:text-7xl">Racionalidade<br />aplicada.</h2>
            </div>
            <p className="text-lg leading-relaxed md:col-span-6 md:col-start-7 md:text-xl">
              Focada em ROI imediato através da eliminação de ineficiências técnicas e operacionais. Justificamos cada escolha com dados, afastando-nos do design puramente estético.
            </p>
          </div>
          <div className="grid gap-px bg-ink md:grid-cols-4">
            {PHASES.map((p) => (
              <div key={p.n} className="bg-background p-8 md:p-10">
                <div className="font-mono-tag bg-gradient-to-r from-[#00d1ff] to-[#80f5d2] bg-clip-text text-transparent font-bold">{p.n}_</div>
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
            <div className="font-mono-tag text-[#00d1ff]">{">_ /05 MÉTRICAS"}</div>
            <h2 className="display-mega mt-4 text-5xl md:text-7xl">Resultados<br /><span className="italic font-light">tangíveis.</span></h2>
          </div>
          <div className="grid gap-px bg-ink md:grid-cols-4">
            {METRICS.map((m) => (
              <div key={m.k} className="bg-background p-8 md:p-10">
                <AnimatedMetric value={m.v} className="display-mega text-5xl md:text-6xl bg-gradient-to-r from-[#00d1ff] to-[#80f5d2] bg-clip-text text-transparent font-light" />
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
              <div className="font-mono-tag text-[#00d1ff]">{">_ /06 PORTFÓLIO"}</div>
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
                  <span className="bg-gradient-to-r from-[#00d1ff] to-[#80f5d2] bg-clip-text text-transparent font-bold">/{c.n}</span>
                  <span className="text-muted-foreground group-hover:text-signal">{c.tag}</span>
                </div>

                <div className="mb-8 aspect-[16/10] w-full border border-ink bg-paper transition group-hover:border-paper overflow-hidden">
                  <img src={c.img} alt={c.title} className="w-full h-full object-cover transition-all duration-500" referrerPolicy="no-referrer" />
                </div>

                <h3 className="display-mega mt-3 text-3xl leading-tight md:text-4xl">{c.title}</h3>
                <p className="mt-4 max-w-lg text-base leading-relaxed">{c.desc}</p>

                <div className="mt-8 grid grid-cols-2 gap-px bg-ink/20 group-hover:bg-paper/20">
                  {c.metrics.map((m) => (
                    <div key={m.k} className="bg-background p-4 group-hover:bg-ink">
                      <div className="display-mega text-2xl md:text-3xl bg-gradient-to-r from-[#00d1ff] to-[#80f5d2] bg-clip-text text-transparent font-bold">{m.v}</div>
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

      {/* MARQUEE DE MARCAS CONFIÁVEIS */}
      <div className="border-t border-b border-ink bg-[#050505] py-12 overflow-hidden">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 mb-6">
          <span className="font-mono-tag text-muted-foreground text-xs uppercase tracking-widest">{">_ PARCEIROS E CLIENTES QUE CONFIAM"}</span>
        </div>
        <div className="flex animate-[scroll_25s_linear_infinite] gap-16 whitespace-nowrap text-3xl md:text-4xl font-bold text-white/30 uppercase font-mono-tag">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="flex items-center gap-16">
              <span>UBAH Design</span><span className="text-[#00d1ff]">◆</span>
              <span>Goloni Mobiliario</span><span className="text-[#00d1ff]">◆</span>
              <span>Moa</span><span className="text-[#00d1ff]">◆</span>
              <span>Full English</span><span className="text-[#00d1ff]">◆</span>
              <span>Studio One</span><span className="text-[#00d1ff]">◆</span>
              <span>Cardeal TV</span><span className="text-[#00d1ff]">◆</span>
              <span>Academia Gaviões</span><span className="text-[#00d1ff]">◆</span>
            </span>
          ))}
        </div>
      </div>
      {/* COMPARATIVE TABLE */}
      <section className="border-b border-ink bg-[#050505]">
        <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 md:py-32">
          <div className="mb-16">
            <div className="font-mono-tag text-[#00d1ff]">{">_ /06 INTELIGÊNCIA"}</div>
            <h2 className="display-mega mt-4 text-4xl md:text-6xl max-w-3xl">
              Nossos sistemas inteligentes<br />por trás da operação.
            </h2>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="border-b border-ink">
                  <th className="py-6 px-4 font-mono-tag text-muted-foreground w-1/4"></th>
                  <th className="py-6 px-4 font-mono-tag text-muted-foreground text-lg w-1/3">Modelos Comuns</th>
                  <th className="py-6 px-4 font-mono-tag text-[#00d1ff] text-lg font-bold w-5/12">Sistemas ESCOM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/50 text-sm md:text-base">
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-6 px-4 font-mono-tag text-muted-foreground">O que faz</td>
                  <td className="py-6 px-4 text-white/70">Entrega uma ferramenta estática (site/app)</td>
                  <td className="py-6 px-4 text-[#00d1ff]">Opera tarefas e conclui processos complexos</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-6 px-4 font-mono-tag text-muted-foreground">Como funciona</td>
                  <td className="py-6 px-4 text-white/70">Plugins que não se conversam</td>
                  <td className="py-6 px-4 text-[#00d1ff]">Ecossistema unificado — dispara webhooks, integra APIs, exibe dashboards</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-6 px-4 font-mono-tag text-muted-foreground">Disponibilidade</td>
                  <td className="py-6 px-4 text-white/70">Depende de humanos para puxar relatórios</td>
                  <td className="py-6 px-4 text-[#00d1ff]">Sempre ativo, monitorando e executando 24/7</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-6 px-4 font-mono-tag text-muted-foreground">Aprendizado</td>
                  <td className="py-6 px-4 text-white/70">Fica defasado rapidamente</td>
                  <td className="py-6 px-4 text-[#00d1ff]">Inteligência arquitetural baseada no seu negócio</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-6 px-4 font-mono-tag text-muted-foreground">Fora do horário</td>
                  <td className="py-6 px-4 text-white/70">Nada acontece</td>
                  <td className="py-6 px-4 text-[#00d1ff]">Monitora acessos, alerta vendas e age de forma proativa</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-6 px-4 font-mono-tag text-muted-foreground">Configuração</td>
                  <td className="py-6 px-4 text-white/70">Ajustes manuais em múltiplos painéis</td>
                  <td className="py-6 px-4 text-[#00d1ff]">Descreva a regra uma vez, executa automaticamente</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-6 px-4 font-mono-tag text-muted-foreground">O que você ainda faz</td>
                  <td className="py-6 px-4 text-white/70">Todo o resto, manualmente</td>
                  <td className="py-6 px-4 text-[#00d1ff]">Revisar, aprovar métricas e focar no produto</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-ink">
        <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 md:py-32">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <div className="font-mono-tag text-[#00d1ff]">{">_ /07 FAQ"}</div>
              <h2 className="display-mega mt-4 text-5xl md:text-6xl">Perguntas<br />diretas.</h2>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              {FAQ.map((f, i) => (
                <div key={i} className="border-t border-ink last:border-b">
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    className="flex w-full items-center justify-between py-6 text-left transition hover:text-signal"
                  >
                    <span className="text-xl md:text-2xl font-light tracking-wide">{f.q}</span>
                    <span className="font-mono-tag text-2xl font-light">{open === i ? "−" : "+"}</span>
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
                <li><a href="#servicos" className="hover:text-signal transition-colors duration-200">Identidade</a></li>
                <li><a href="#servicos" className="hover:text-signal transition-colors duration-200">Produto</a></li>
                <li><a href="#servicos" className="hover:text-signal transition-colors duration-200">Sistemas</a></li>
                <li><a href="#servicos" className="hover:text-signal transition-colors duration-200">Engenharia</a></li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <div className="font-mono-tag text-paper/60">// JURÍDICO</div>
              <ul className="mt-4 space-y-2 font-mono-tag">
                <li><a href="/termos" className="hover:text-signal transition-colors duration-200">Termos</a></li>
                <li><a href="/privacidade" className="hover:text-signal transition-colors duration-200">Privacidade</a></li>
                <li><a href="/aviso-legal" className="hover:text-signal transition-colors duration-200">Aviso legal</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-16 flex flex-wrap items-end justify-between gap-6 border-t border-paper/20 pt-8 font-mono-tag text-paper/60">
            <div>© 2026 ESCOM/STUDIO — Todos os direitos reservados.</div>
            <div>São Paulo — Brasil</div>
          </div>
        </div>
      </footer>
      {/* Botões Flutuantes */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {/* Voltar ao Topo */}
        {scrollY > 300 && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition hover:bg-white hover:text-black shadow-lg"
            aria-label="Voltar ao topo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
          </button>
        )}
        {/* WhatsApp */}
        <a
          href="https://wa.me/5513981062787"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110"
          aria-label="Falar no WhatsApp"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.489 0 9.954-4.47 9.957-9.96.002-2.66-1.033-5.159-2.915-7.04C16.43 1.722 13.932.68 11.272.68 5.785.68 1.32 5.148 1.317 10.638c-.001 1.57.43 3.106 1.246 4.467l-.997 3.636 3.722-.977-.001.002zM17.387 14.1c-.29-.145-1.714-.846-1.978-.941-.264-.096-.457-.145-.65.145-.19.29-.738.941-.906 1.132-.167.19-.336.213-.626.069-.29-.145-1.22-.45-2.324-1.434-.86-.767-1.44-1.716-1.609-2.005-.167-.29-.018-.445.127-.589.13-.13.29-.336.435-.506.145-.168.193-.288.29-.481.096-.192.048-.36-.024-.506-.073-.145-.65-1.565-.89-2.143-.235-.566-.47-.489-.65-.499-.168-.008-.36-.01-.553-.01-.193 0-.507.073-.772.361-.265.29-1.012.988-1.012 2.41 0 1.42 1.036 2.793 1.18 2.986.145.193 2.037 3.111 4.935 4.362.69.298 1.229.476 1.649.61.693.22 1.325.19 1.823.115.556-.084 1.714-.7 1.958-1.378.243-.678.243-1.26.17-1.378-.073-.117-.265-.19-.556-.336z"/>
          </svg>
        </a>
      </div>
      </div> {/* Fechamento do wrapper da Seção 2 */}
    </div>
  );
}
