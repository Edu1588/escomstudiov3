import { motion } from "motion/react";

export default function AbsoluteControl() {
  return (
    <section className="py-32 px-6 bg-black relative">
      <div className="container mx-auto">
        <div className="flex flex-col items-center mb-16 text-center">
           <div className="bg-black border border-white/10 rounded-full px-4 py-1.5 mb-8 flex items-center gap-2">
              <span className="text-[#00e300] font-mono text-xs font-bold">[ VISÃO_GERAL.EXE ]</span>
              <span className="text-white/40 font-rajdhani text-sm">O núcleo da sua operação</span>
           </div>
           
           <h2 className="text-4xl md:text-6xl font-black font-tech text-white mb-8 leading-[1.1] max-w-4xl">
             O controle absoluto do seu negócio em um só lugar.
           </h2>
           
           <p className="text-white/50 max-w-2xl font-rajdhani text-lg leading-relaxed">
             Esqueça dezenas de abas abertas. Integramos as principais métricas e ferramentas de gestão diretamente no seu sistema ESCOM.
           </p>
        </div>

        <div className="max-w-5xl mx-auto rounded-none overflow-hidden shadow-2xl relative group border border-white/5 bg-[#0a0a0a]">
           <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#00e300]/30 to-transparent" />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[#00e300]/10 blur-[120px] -z-10 rounded-full pointer-events-none" />
           <img 
             src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200" 
             className="w-full h-auto opacity-80 group-hover:opacity-100 transition-opacity duration-700 relative z-10" 
             alt="Dashboard Preview"
             referrerPolicy="no-referrer"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 z-20" />

           
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
              <div className="w-20 h-20 rounded-full border border-[#00e300]/30 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-pulse">
                <div className="w-3 h-3 rounded-full bg-[#00e300]" />
              </div>
           </div>
        </div>
      </div>
    </section>
  );
}
