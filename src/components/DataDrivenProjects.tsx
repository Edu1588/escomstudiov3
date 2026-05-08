import { motion } from "motion/react";
import { Brain } from "lucide-react";
import AnimatedZap from "./AnimatedZap";

export default function DataDrivenProjects() {
  return (
    <section className="py-32 px-6 bg-black relative">
      <div className="container mx-auto">
        <div className="flex flex-col items-center mb-24 text-center">
          <div className="border border-[#00e300]/30 px-4 py-1 rounded-sm mb-4">
            <span className="text-[#00e300] font-mono text-[10px] tracking-widest uppercase">CIÊNCIA & PERFORMANCE</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black font-tech text-white leading-[1.1]">
            Projetado com base em dados.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-[#0a0a0a] p-12 rounded-none border border-white/5 hover:border-[#00e300]/30 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00e300]/5 blur-[80px] rounded-full group-hover:bg-[#00e300]/10 transition-colors pointer-events-none" />
            <div className="w-16 h-16 mb-8 text-[#00e300] opacity-80 group-hover:opacity-100 transition-opacity">
              <Brain size={48} strokeWidth={2} />
            </div>
            <h3 className="text-2xl font-black font-tech text-white mb-6 leading-tight">
              UX Engineering & <br /> Psicologia Cognitiva
            </h3>
            <p className="text-white/50 text-[14px] leading-relaxed mb-10 font-rajdhani">
              Analisamos e otimizamos interfaces com base nas Heurísticas de Nielsen, Gestalt, Leis de UX, Don Norman e Vieses Cognitivos.
            </p>
            <div className="flex flex-wrap gap-2">
              {["HEURÍSTICAS", "GESTALT", "VIESES"].map(tag => (
                <span key={tag} className="text-[10px] font-mono tracking-widest px-3 py-1 bg-[#00e300]/5 border border-[#00e300]/20 text-[#00e300] rounded-sm uppercase">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-[#0a0a0a] p-12 rounded-none border border-white/5 hover:border-[#00e300]/30 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00e300]/5 blur-[80px] rounded-full group-hover:bg-[#00e300]/10 transition-colors pointer-events-none" />
            <div className="w-16 h-16 mb-8 text-[#00e300] opacity-80 group-hover:opacity-100 transition-opacity">
              <AnimatedZap />
            </div>
            <h3 className="text-2xl font-black font-tech text-white mb-6 leading-tight">
              Performance & <br /> SEO Técnico
            </h3>
            <p className="text-white/50 text-[14px] leading-relaxed mb-10 font-rajdhani">
              Otimizamos o SEO ao máximo: desde a compressão cirúrgica do tamanho dos arquivos até a renomeação automática de imagens.
            </p>
            <div className="flex flex-wrap gap-2">
              {["OTIMIZAÇÃO", "AUTO-NAMING"].map(tag => (
                <span key={tag} className="text-[10px] font-mono tracking-widest px-3 py-1 bg-[#00e300]/5 border border-[#00e300]/20 text-[#00e300] rounded-sm uppercase">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
