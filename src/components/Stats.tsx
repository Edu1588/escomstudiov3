import { motion } from "motion/react";

export default function Stats() {
  const stats = [
    { id: "001", label: "ANOS DE ATUAÇÃO", value: "15+" },
    { id: "002", label: "PAÍSES ATENDIDOS", value: "8" },
    { id: "003", label: "SQUADS ATIVAS", value: "12", active: true },
    { id: "004", label: "CLIENTES FELIZES", value: "100+" },
  ];

  return (
    <section className="py-24 px-6 bg-white relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
        <span className="text-[20vw] font-black font-display text-black -rotate-12 whitespace-nowrap">NÓS SOMOS</span>
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col items-center mb-20">
           <h2 className="text-7xl md:text-9xl font-black font-display text-zinc-100 uppercase tracking-tighter text-center">
             NÓS SOMOS
           </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="p-10 rounded-[40px] flex flex-col justify-between aspect-[3/4] shadow-xl transition-all duration-500 bg-white text-black border border-zinc-100 hover:bg-black hover:text-white group"
            >
              <div className="flex flex-col gap-4">
                <span className="font-mono text-[10px] text-black/30 group-hover:text-white/30 transition-colors">
                  {stat.id}
                </span>
                <div className="mt-12 text-[10px] font-mono tracking-widest max-w-[80px] text-black/50 group-hover:text-white/50 transition-colors">
                  {stat.label}
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                <span className="text-6xl font-black font-tech">{stat.value}</span>
                <div className="w-12 h-1 rounded-full bg-zinc-200 group-hover:bg-primary transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="mt-32 border-t border-zinc-100 pt-16 grid grid-cols-1 md:grid-cols-2 gap-12 text-black">
        <div className="max-w-md">
           <p className="text-2xl text-zinc-400 font-display">Um site não deve ser apenas uma vitrine.</p>
           <p className="text-2xl font-bold font-display mt-2 capitalize">Deve funcionar como uma ferramenta.</p>
        </div>
        <div className="flex justify-end items-end gap-12">
            <p className="text-sm text-zinc-500 font-mono tracking-tight max-w-[300px] text-right">
              Cada projeto é estruturado para operar como parte do negócio — combinando experiência, automação e inteligência de dados em um único sistema.
            </p>
            <div className="w-[1px] h-24 bg-primary" />
        </div>
      </div>
    </section>
  );
}
