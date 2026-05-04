import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

const faqs = [
  { q: "Quanto custa um projeto?", a: "Os custos variam conforme a complexidade e os requisitos específicos do projeto. Realizamos um diagnóstico inicial para apresentar uma proposta personalizada alinhada aos seus objetivos." },
  { q: "Quanto tempo leva?", a: "Depende do escopo. Um projeto de branding com plataforma web pode levar de 6 a 12 semanas. Definimos um cronograma claro antes do início de qualquer trabalho." },
  { q: "Vocês trabalham com empresas internacionais?", a: "Sim, nossa estrutura permite atender clientes de qualquer lugar do mundo de forma 100% remota e eficiente, adaptando-nos aos diferentes fusos horários." },
  { q: "Vocês fazem manutenção ou apenas criação?", a: "Ambos. Oferecemos pacotes de evolução e suporte contínuo para garantir que a infraestrutura digital cresça junto com a sua empresa." },
];

export default function FAQV2() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="py-32 px-6 bg-black relative">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col items-center mb-16 text-center">
           <p className="text-[#00e300] font-mono text-[10px] tracking-widest uppercase mb-4">FAQ</p>
           <h2 className="text-4xl md:text-6xl font-black font-tech text-white mb-6">Dúvidas Frequentes</h2>
           <p className="text-white/40 text-sm">Tire suas dúvidas sobre nossos serviços.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div key={i} className={`border ${isOpen ? 'border-[#00e300]/20 bg-white/[0.02]' : 'border-white/5'} rounded-2xl overflow-hidden transition-all duration-300`}>
                 <button 
                   onClick={() => setOpenIdx(isOpen ? null : i)}
                   className="w-full flex items-center justify-between p-8 text-left hover:bg-white/5 transition-colors group"
                 >
                   <span className={`font-tech text-xl ${isOpen ? 'text-[#00e300]' : 'text-white'} transition-colors`}>{faq.q}</span>
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-[#00e300]' : 'bg-transparent border border-white/10 group-hover:border-white/30'}`}>
                     {isOpen ? <Minus size={16} className="text-black" /> : <Plus size={16} className="text-white" />}
                   </div>
                 </button>
                 <AnimatePresence>
                   {isOpen && (
                     <motion.div
                       initial={{ height: 0, opacity: 0 }}
                       animate={{ height: "auto", opacity: 1 }}
                       exit={{ height: 0, opacity: 0 }}
                       className="px-8 pb-8 pt-2"
                     >
                       <div className="h-[1px] w-full bg-white/5 mb-6" />
                       <p className="text-white/40 text-[15px] leading-relaxed font-rajdhani">
                         {faq.a}
                       </p>
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
