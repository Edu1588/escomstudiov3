import { motion } from "motion/react";
import { ContainerScroll, CardSticky } from "./ui/cards-stack";

export default function ValueProposition() {
  const values = [
    { title: "Autoridade", desc: "Design orientado à percepção de valor e posicionamento de mercado.", icon: "01", active: false },
    { title: "Estratégia", desc: "Engenharia de conversão (CRO) aplicada em cada interface.", icon: "02", active: false },
    { title: "Tecnologia", desc: "Infraestrutura inteligente com foco em performance bruta.", icon: "03", active: false },
    { title: "Resultado Real", desc: "Transformamos visitantes em clientes com fluxos otimizados.", icon: "04", active: true },
  ];

  return (
    <section className="py-32 px-6 bg-black relative">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 md:gap-8 xl:gap-24 relative">
          {/* Left Side: Sticky */}
          <div className="left-0 top-0 md:sticky md:h-svh md:py-32">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="px-3 py-1 border border-primary/20 rounded-none mb-8 inline-block w-fit"
            >
              <span className="font-mono text-[10px] tracking-widest text-primary uppercase">[ EXPERIÊNCIA ]</span>
            </motion.div>
            
            <h2 className="text-5xl md:text-7xl font-black font-tech mb-12 leading-[0.9] uppercase">
              O QUE VOCÊ SENTE <br/> É RESULTADO.
            </h2>
            
            <div className="space-y-6 text-white/40 font-mono text-sm tracking-widest uppercase mb-12">
              <p>Cada interação foi projetada para criar fluência, autoridade e, acima de tudo,</p>
              <p className="text-white font-bold">conversão real para o seu negócio.</p>
              <p>Não basta ser bonito. Tem que vender.</p>
            </div>

            <div className="hidden lg:block w-32 h-32 rounded-full border border-white/5 p-1">
               <div className="w-full h-full rounded-full border border-primary/20 border-dashed animate-spin-slow flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary" />
               </div>
            </div>
          </div>

          {/* Right Side: Stacking Cards */}
          <ContainerScroll className="min-h-[400vh] space-y-8 py-32">
             {values.map((v, index) => (
                <CardSticky
                  key={v.title}
                  index={index + 2}
                  className={`p-10 rounded-none border flex flex-col gap-8 shadow-2xl transition-all duration-500 overflow-hidden ${
                    v.active 
                     ? "bg-primary text-black border-primary tech-shadow" 
                     : "bg-[#0a0a0a] border-white/10"
                  }`}
                >
                   <div className="flex items-center gap-6">
                     <div className={`w-14 h-14 rounded-none flex items-center justify-center shrink-0 ${v.active ? "bg-black text-primary" : "bg-white/5 border border-white/10"}`}>
                        <span className="font-tech text-2xl font-bold">{v.icon}</span>
                     </div>
                     <div>
                       <h4 className={`font-black text-3xl uppercase tracking-tight mb-1 ${v.active ? "text-black" : "text-white"}`}>{v.title}</h4>
                       <p className={`text-[10px] font-mono tracking-widest uppercase ${v.active ? "text-black/60" : "text-white/30"}`}>
                         {v.desc}
                       </p>
                     </div>
                   </div>
                   
                   <p className={`font-mono text-xs leading-relaxed uppercase tracking-wider ${v.active ? "text-black/70" : "text-white/40"}`}>
                     Desenvolvemos sistemas que operam em harmonia com seus objetivos comerciais, garantindo que cada pixel contribua para o seu crescimento sustentável e previsível.
                   </p>
                </CardSticky>
             ))}
          </ContainerScroll>
        </div>
      </div>

      <style>{`
        .animate-spin-slow {
          animation: spin 12s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .tech-shadow {
          box-shadow: 0 0 60px rgba(0, 255, 0, 0.2);
        }
      `}</style>
    </section>
  );
}
