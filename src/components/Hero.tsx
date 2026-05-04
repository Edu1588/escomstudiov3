import { motion } from "motion/react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-secondary/10 blur-[120px] -z-10" />
      
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="z-10 order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="inline-block px-3 py-1 border border-primary/30 rounded-md mb-8"
          >
            <span className="font-mono text-[10px] tracking-[0.2em] text-primary">
              {">"} [ INIT_SYSTEM ]
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-5xl md:text-7xl font-bold font-display leading-[0.9] mb-8"
          >
            NÃO <br />
            CRIAMOS <br />
            APENAS SITES.
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="space-y-1"
          >
            <p className="font-mono text-sm tracking-widest text-white/60">CRIAMOS</p>
            <p className="font-mono text-sm tracking-widest text-white/60 underline decoration-primary underline-offset-4">EXPERIÊNCIAS</p>
            <p className="font-mono text-sm tracking-widest text-white/60">COMPLETAS.</p>
          </motion.div>
          
          <div className="mt-16 w-48 h-32 rounded-3xl overflow-hidden tech-border relative group cursor-pointer">
             <img 
               src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400" 
               className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
               alt="Digital context"
               referrerPolicy="no-referrer"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
               <div className="w-full h-0.5 bg-white/20">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: "60%" }}
                   className="h-full bg-primary"
                 />
               </div>
             </div>
          </div>
        </div>

        <div className="relative order-1 lg:order-2 flex justify-center">
          {/* Main Hero Image Placeholder - Since generate_image failed, using a high-quality alternative */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative w-full max-w-lg aspect-square"
          >
             {/* Glowing Ring */}
             <div className="absolute inset-0 rounded-full border-2 border-secondary/30 scale-110 animate-pulse" />
             <div className="absolute inset-0 rounded-full border border-secondary/10 scale-125" />
             
             <div className="w-full h-full rounded-full overflow-hidden relative border-4 border-white/5 glow-blue shadow-2xl">
               <img 
                 src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=800" 
                 className="w-full h-full object-cover grayscale mix-blend-screen scale-110"
                 alt="Core tech"
                 referrerPolicy="no-referrer"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
               <div className="absolute inset-0 bg-secondary/10 mix-blend-overlay" />
             </div>
             
             {/* Floating Info Boxes */}
             <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -right-8 top-1/4 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl max-w-[200px]"
             >
               <p className="font-mono text-[10px] text-white/40 uppercase mb-2">PROJETOS DIGITAIS QUE UNEM DESIGN,</p>
               <p className="font-mono text-[10px] text-white/40 uppercase">AUTOMAÇÃO E INFRAESTRUTURA INTELIGENTE.</p>
             </motion.div>

             <div className="absolute -bottom-10 right-0 flex items-center gap-6 bg-black/80 backdrop-blur-md px-4 py-3 rounded-full border border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="font-mono text-[10px] text-primary">ON</span>
                </div>
                <span className="font-mono text-[10px] text-white/60">17:47:34:95</span>
                <span className="font-mono text-[10px] text-primary/80 uppercase flex items-center gap-1">
                   <div className="w-3 h-0.5 bg-primary/40" /> SOL SE PONDO
                </span>
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
