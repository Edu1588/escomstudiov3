import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

const faqs = [
  { q: "QUANTO TEMPO LEVA PARA DESENVOLVER UM PROJETO?", a: "O tempo médio varia entre 4 a 8 semanas, dependendo da complexidade da infraestrutura e dos fluxos de automação necessários." },
  { q: "VOCÊS TRABALHAM COM MANUTENÇÃO?", a: "Sim, oferecemos planos de acompanhamento contínuo para garantir que seu sistema permaneça atualizado e otimizado." },
  { q: "O SITE É MEU OU FICA PRESO A VOCÊS?", a: "O projeto é 100% seu. Entregamos todo o código e acessos, garantindo total independência do seu negócio." },
  { q: "COMO FUNCIONA A INTEGRAÇÃO COM MEU CRM?", a: "Realizamos a conexão direta via API ou webhooks, garantindo que nenhum lead seja perdido e que os dados fluam sem fricção." },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="py-32 px-6 bg-black relative">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col items-center mb-16 text-center">
           <h2 className="text-4xl md:text-6xl font-black font-tech text-white mb-4 uppercase">FAQ</h2>
           <p className="text-white/40 font-mono text-[10px] tracking-[0.3em] uppercase">PERGUNTAS FREQUENTES</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-white/5 rounded-none overflow-hidden">
               <button 
                 onClick={() => setOpenIdx(openIdx === i ? null : i)}
                 className="w-full flex items-center justify-between p-8 text-left hover:bg-white/5 transition-colors group"
               >
                 <span className="font-tech text-lg text-white group-hover:text-primary transition-colors">{faq.q}</span>
                 {openIdx === i ? <Minus className="text-primary" /> : <Plus className="text-white/30" />}
               </button>
               <AnimatePresence>
                 {openIdx === i && (
                   <motion.div
                     initial={{ height: 0, opacity: 0 }}
                     animate={{ height: "auto", opacity: 1 }}
                     exit={{ height: 0, opacity: 0 }}
                     className="px-8 pb-8"
                   >
                     <p className="text-white/40 font-mono text-xs tracking-widest leading-relaxed">
                       {faq.a}
                     </p>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
