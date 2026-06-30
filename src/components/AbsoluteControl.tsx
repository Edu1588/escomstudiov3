import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { TextEffect } from '@/components/ui/text-effect';
import { useEffect } from "react";

function StatBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="text-white/70 font-mono text-xs tracking-widest uppercase mb-3">{label}</div>
      <div className="h-1 bg-white/10 rounded overflow-hidden">
         <motion.div 
           className="h-full bg-[#00d1ff]"
           initial={{ width: 0 }}
           whileInView={{ width: `${value * 100}%` }}
           viewport={{ once: true }}
           transition={{ duration: 1.5, ease: "easeOut" }}
         />
      </div>
    </div>
  );
}

function AnimatedGauge() {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const percentText = useTransform(rounded, (latest) => `${latest}%`);
  const dashoffset = useTransform(count, (latest) => {
    const r = 100;
    const pathLength = Math.PI * r;
    // For a semi-circle, the arc length is Pi * r.
    return pathLength - (latest / 100) * pathLength;
  });

  useEffect(() => {
    const animation = animate(count, 100, {
      duration: 3,
      repeat: Infinity,
      repeatDelay: 1, // Add a delay before looping again
      ease: "easeInOut",
    });
    return animation.stop;
  }, [count]);

  const r = 100;
  const strokeW = 16;
  const pathData = `M 20,120 A ${r},${r} 0 0,1 220,120`;
  const pathLength = Math.PI * r;

  return (
    <div className="relative w-80 h-48 flex flex-col items-center mx-auto mt-20">
       <svg viewBox="0 0 240 140" className="w-full h-full overflow-visible">
         <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
               <stop offset="0%" stopColor="#00d1ff" />
               <stop offset="100%" stopColor="#00ff88" />
            </linearGradient>
         </defs>

         {/* Background Track */}
         <path 
           d={pathData}
           fill="none"
           stroke="#1a1a1a"
           strokeWidth={strokeW}
           strokeLinecap="round"
         />
         
         {/* Animated Fill */}
         <motion.path 
           d={pathData}
           fill="none"
           stroke="url(#gaugeGradient)"
           strokeWidth={strokeW}
           strokeLinecap="round"
           strokeDasharray={pathLength}
           style={{ strokeDashoffset: dashoffset }}
         />
       </svg>

       <div className="absolute top-[70%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
         <motion.span className="text-6xl font-black font-tech text-white tracking-tighter">
           {percentText}
         </motion.span>
       </div>
       
       <div className="absolute bottom-[-10px] w-full flex justify-between px-6 text-white/50 font-mono text-base font-bold">
         <span>0%</span>
         <span>100%</span>
       </div>
    </div>
  );
}

export default function AbsoluteControl() {
  return (
    <section className="py-32 px-6 bg-[#050505] relative overflow-hidden">
      {/* Background Node Effect */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
         <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="node-grid" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="#00d1ff" />
                <path d="M 2 2 L 100 100" stroke="#00d1ff" strokeWidth="0.5" strokeOpacity="0.3" />
                <path d="M 100 2 L 2 100" stroke="#00d1ff" strokeWidth="0.5" strokeOpacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#node-grid)" />
         </svg>
      </div>

      <div className="container mx-auto relative z-10 max-w-7xl">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-16">
          
          {/* LEFT COLUMN - Text */}
          <div className="flex-1 text-left">
             <div className="inline-flex bg-black border border-[#00d1ff]/30 rounded-full px-4 py-1.5 mb-10 items-center gap-3">
                <div className="w-2 h-2 rounded-full border-2 border-[#00d1ff] bg-black ring-2 ring-[#00d1ff]/20"></div>
                <span className="text-white/70 font-mono text-xs tracking-widest">SISTEMA INTEGRADO</span>
             </div>
             <motion.h2
                initial={{ opacity: 0, filter: 'blur(20px)' }}
                whileInView={{ opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                viewport={{ once: true }}
                className="text-5xl md:text-7xl lg:text-8xl font-black font-tech text-white mb-8 leading-[1.1] tracking-tight"
              >
                O controle absoluto do seu <br/><span className="text-[#00d1ff]">negócio em um só</span> lugar.
              </motion.h2>
             <TextEffect preset="blur" per="word" as="p" className="text-white/50 max-w-xl font-rajdhani text-xl leading-relaxed">
                Esqueça dezenas de abas abertas. Integramos as principais métricas e ferramentas de gestão diretamente no seu sistema ESCOM.
              </TextEffect>
          </div>

          {/* RIGHT COLUMN - Stats & Gauge */}
          <div className="flex-1 w-full max-w-2xl relative">
             <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12">
                 <StatBar label="ANALYTICS" value={0.8} />
                 <StatBar label="LEADS & CRM" value={0.65} />
                 <StatBar label="E-MAIL" value={0.9} />
                 <StatBar label="AUTOMAÇÕES" value={0.4} />
                 <StatBar label="DADOS" value={0.3} />
                 <StatBar label="SEO" value={0.7} />
             </div>

             <AnimatedGauge />
          </div>
        </div>
      </div>
    </section>
  );
}
