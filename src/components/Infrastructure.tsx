import { motion } from "motion/react";
import { CheckCircle2, ArrowUpRight, Cpu } from "lucide-react";

export default function Infrastructure() {
  const features = [
    "CAPTURA E GESTÃO DE LEADS",
    "INTEGRAÇÃO COM CRM",
    "ANÁLISE E DADOS",
    "FLUXOS AUTOMATIZADOS",
    "MAPAS DE CALOR",
    "TESTES E OTIMIZAÇÃO",
  ];

  return (
    <section className="py-32 px-6 bg-black">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-[#0a0a0a] rounded-none p-12 border border-white/5 relative overflow-hidden">
              {/* Abstract Circuit Lines */}
             <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-20">
                <svg width="100%" height="100%" viewBox="0 0 800 600" fill="none">
                  <defs>
                    <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="transparent" />
                      <stop offset="50%" stopColor="#00FF00" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                  
                  {/* Static Paths */}
                  <path d="M0 100H200L250 150V300H400L450 350V600" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  <path d="M0 200H150L200 250V400H350L400 450V600" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  
                  {/* Flowing Lines */}
                  <motion.path 
                    d="M0 100H200L250 150V300H400L450 350V600" 
                    stroke="url(#flowGradient)" 
                    strokeWidth="2"
                    initial={{ pathLength: 0, pathOffset: 0 }}
                    animate={{ pathLength: [0.1, 0.3, 0.1], pathOffset: [0, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  />
                  
                  <motion.path 
                    d="M0 200H150L200 250V400H350L400 450V600" 
                    stroke="url(#flowGradient)" 
                    strokeWidth="2"
                    initial={{ pathLength: 0, pathOffset: 0 }}
                    animate={{ pathLength: [0.1, 0.3, 0.1], pathOffset: [0, 1] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 1 }}
                  />

                  {/* Flowing Dots */}
                  {[0, 1, 2].map((i) => (
                    <motion.circle
                      key={i}
                      r="2.5"
                      fill="#00FF00"
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: [0, 1, 0],
                        cx: [0, 200, 250, 250, 400, 450, 450],
                        cy: [100, 100, 150, 300, 300, 350, 600]
                      }}
                      transition={{ 
                        duration: 6, 
                        repeat: Infinity, 
                        ease: "linear",
                        delay: i * 2
                      }}
                    />
                  ))}
                </svg>
             </div>

             <div className="relative z-10">
               <div className="w-12 h-12 bg-white/5 rounded-none flex items-center justify-center mb-8 border border-white/10 shrink-0">
                 <Cpu className="text-primary" size={24} />
               </div>
               
               <h2 className="text-4xl md:text-6xl font-black font-tech uppercase leading-[0.9] mb-12">
                 INFRAESTRUTURA <br />
                 INTELIGENTE
               </h2>
               
               <p className="text-white/40 max-w-xl font-mono text-[10px] tracking-widest leading-relaxed mb-16 uppercase">
                 Cada projeto é desenvolvido com uma base inteligente que centraliza funções essenciais dentro do próprio site. Menos dependência, mais controle total do seu ecossistema.
               </p>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-12 relative overflow-hidden">
                 {/* Animation Overlay */}
                 <div className="absolute inset-0 pointer-events-none">
                    <motion.div 
                      animate={{ x: [-100, 800], opacity: [0, 1, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="absolute top-1/4 h-[1px] w-32 bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-sm"
                    />
                    <motion.div 
                      animate={{ x: [-200, 600], opacity: [0, 1, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 2 }}
                      className="absolute top-2/3 h-[1px] w-24 bg-gradient-to-r from-transparent via-primary/40 to-transparent blur-sm"
                    />
                 </div>
                 {features.map((feature) => (
                   <div key={feature} className="flex items-center gap-4 group">
                     {/* Connector line effect */}
                     <div className="hidden md:block w-8 h-[1px] bg-white/10 group-hover:bg-primary/50 transition-colors" />
                     <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary transition-colors">
                       <CheckCircle2 size={14} className="text-primary" />
                     </div>
                     <span className="font-mono text-[10px] tracking-widest text-white/60 group-hover:text-white transition-colors">
                       {feature}
                     </span>
                   </div>
                 ))}
               </div>
             </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex-1 bg-primary rounded-none p-12 text-black flex flex-col justify-between relative overflow-hidden">
               <ArrowUpRight className="absolute top-10 right-10 opacity-20" size={120} />
               
               <div>
                  <h3 className="text-3xl font-black font-display leading-[0.9] uppercase mb-6">
                    Menos ferramentas. <br />
                    Mais eficiência.
                  </h3>
                  <p className="text-black/70 text-sm font-sans font-medium">
                    Ao integrar funcionalidades diretamente no projeto, reduzimos significativamente custos recorrentes com plataformas externas.
                  </p>
               </div>

               <div className="mt-12 bg-black/10 rounded-none p-6 backdrop-blur-sm border border-black/5">
                  <p className="text-[10px] font-mono font-bold tracking-widest uppercase mb-2">RESULTADO</p>
                  <p className="text-sm font-bold leading-tight">
                    Centralização melhora a performance e facilita a gestão do seu negócio.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
