import { motion } from "motion/react";
import { TextEffect } from '@/components/ui/text-effect';

export default function Services() {
  const services = [
    { title: "UI/UX DESIGN", desc: "Design focado em experiência do usuário e conversão." },
    { title: "BRANDING & ESTRATÉGIA", desc: "Posicionamento de marca e identidade visual impactante.", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=400" },
    { title: "WEB DESIGN PERFORMANCE", desc: "Sites otimizados para velocidade e SEO técnico.", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400", active: true },
    { title: "DESIGN SAAS & DASHBOARDS", desc: "Interfaces complexas para sistemas de alta performance." },
    { title: "DIREÇÃO CRIATIVA", desc: "Visão artística aliada a objetivos comerciais.", image: "https://images.unsplash.com/photo-1493421416290-99a87240a79a?auto=format&fit=crop&q=80&w=400" },
    { title: "MVP & PRODUTOS", desc: "Lançamento rápido de produtos validados no mercado.", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400" },
  ];

  return (
    <section className="py-32 px-6 bg-black relative" id="serviços">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
          <div className="flex flex-col text-left">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="px-3 py-1 border border-primary/20 rounded-md mb-8 inline-block self-start"
            >
              <span className="font-mono text-[10px] tracking-widest text-primary">[ NOSSOS_SERVIÇOS ]</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, filter: 'blur(20px)' }}
              whileInView={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              viewport={{ once: true }}
              className="text-6xl md:text-[10rem] font-black font-tech uppercase leading-none m-0"
            >O QUE<br/>FAZEMOS</motion.h2>
          </div>
          <div className="md:max-w-sm pb-4">
            <TextEffect preset="blur" per="word" as="p" className="text-white/80 font-mono text-sm tracking-[0.1em] uppercase font-bold border-l-2 border-primary pl-4 leading-relaxed">
               DESIGN COM PROPÓSITO COMERCIAL E INFRAESTRUTURA INTEGRADA PARA MÁXIMA PERFORMANCE.
             </TextEffect>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="p-10 rounded-[48px] min-h-[460px] flex flex-col justify-between transition-all duration-500 border bg-[#0a0a0a] border-white/5 hover:border-primary/50 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 text-[10px] font-mono text-white/5 uppercase select-none">
                SVC_00{idx + 1}
              </div>

              <div>
                <h3 className="text-3xl font-black font-tech uppercase mb-6 text-white group-hover:text-primary transition-colors leading-[0.9]">
                  {service.title}
                </h3>
                <div className="w-16 h-[1px] bg-white/10 mb-8 group-hover:bg-primary/50 group-hover:w-32 transition-all duration-500" />
                <p className="text-white/40 font-mono text-[10px] tracking-widest leading-relaxed group-hover:text-white/60 transition-colors uppercase font-bold pr-12">
                  {service.desc}
                </p>
              </div>

              {service.image && (
                <div className="mt-12 rounded-2xl overflow-hidden aspect-video relative border border-transparent group-hover:border-primary/30">
                  <img 
                    src={service.image} 
                    className="w-full h-full object-cover transition-all duration-700 grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110"
                    alt={service.title}
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
