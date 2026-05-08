import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";

export default function PortfolioGrid() {
  const projects = [
    { title: "UBAH DESIGN", tags: ["SITE", "STRATEGY"], img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800" },
    { title: "GOLONI URBAN FURNITURE", tags: ["WEB APP", "PERFORMANCE"], img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800" },
    { title: "FULL ENGLISH", tags: ["PLATFORM", "UX"], img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800" },
  ];

  return (
    <section className="py-32 px-6 bg-black" id="portfólio">
      <div className="container mx-auto">
        <div className="flex flex-col mb-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="px-3 py-1 border border-primary/20 rounded-none mb-8 inline-block w-fit"
          >
            <span className="font-mono text-[10px] tracking-widest text-primary">[ INDEX_01 ]</span>
          </motion.div>
          
          <h2 className="text-5xl md:text-9xl font-black font-tech mb-8 uppercase leading-none">PROJETOS SELECIONADOS</h2>
          <p className="text-white/30 max-w-md font-mono text-[10px] tracking-[0.2em] leading-relaxed uppercase font-bold bg-white/[0.03] px-6 py-2 rounded-full border border-white/5">
            CADA PROJETO É DESENVOLVIDO COMO UM SISTEMA COMPLETO — UNINDO DESIGN, ESTRATÉGIA E TECNOLOGIA.
          </p>
        </div>

        <div className="flex flex-col">
          {projects.map((project, idx) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group relative border-b border-white/5 py-16 cursor-pointer transition-all duration-700 overflow-hidden"
            >
              {/* Reveal background */}
              <div className="absolute inset-x-0 bottom-0 h-0 group-hover:h-full bg-primary transition-all duration-500 -z-10" />

              <div className="flex items-center justify-between relative z-10 px-8">
                <div className="flex flex-col">
                   <div className="flex items-center gap-6 mb-4">
                      <span className="font-mono text-[12px] text-white/20 group-hover:text-black/40 font-bold">IDX_0{idx + 1}</span>
                      <div className="flex gap-3 text-[9px] font-mono tracking-widest uppercase">
                        {project.tags.map(tag => (
                          <span key={tag} className="px-3 py-1 rounded-none border border-white/10 text-white/40 group-hover:text-black group-hover:border-black/30 transition-colors font-black">{tag}</span>
                        ))}
                      </div>
                   </div>
                   <h3 className="text-5xl md:text-[120px] font-black font-tech group-hover:text-black transition-all duration-500 leading-none uppercase">
                     {project.title}
                   </h3>
                </div>
                
                <div className="flex items-center gap-16">
                   <div className="hidden xl:block w-[400px] h-[240px] rounded-none overflow-hidden opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-95 translate-y-10 group-hover:translate-y-0 transition-all duration-500 shadow-2xl skew-x-[-2deg] group-hover:skew-x-0">
                     <img 
                       src={project.img} 
                       alt={project.title} 
                       className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                       referrerPolicy="no-referrer"
                     />
                  </div>
                  <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center group-hover:border-black group-hover:bg-black group-hover:rotate-45 transition-all duration-500">
                    <ArrowUpRight size={40} className="text-white/40 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-40 flex justify-center">
           <a href="/portfolio-projetos/" className="bg-primary text-black px-16 py-6 rounded-none font-black uppercase tracking-[0.4em] text-[11px] hover:shadow-[0_0_50px_rgba(0,255,0,0.25)] transition-all flex items-center gap-6 group hover:translate-y-[-4px]">
             VER WORK COMPLETO_ <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" strokeWidth={3} />
           </a>
        </div>
      </div>
    </section>
  );
}
