import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [protocol, setProtocol] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setProtocol(result.protocol);
        setStatus("success");
        // Reset after 5s
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error('Falha na transmissão segura:', err);
      setStatus("error");
    }
  };

  return (
    <section className="py-32 px-6 bg-black relative" id="fale conosco">
       {/* Background gradient */}
       <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
       
       <div className="container mx-auto">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            <div>
               <h2 className="text-6xl md:text-9xl font-black font-tech leading-[0.85] mb-12 uppercase">
                 VAMOS CRIAR <br />
                 ALGO BRUTO <br />
                 <span className="text-primary">JUNTOS.</span>
               </h2>
               
               <p className="text-white/30 max-w-sm font-mono text-[10px] tracking-[0.25em] leading-relaxed mb-16 uppercase font-bold">
                 ENTRE EM CONTATO PARA DISCUTIR O SEU PRÓXIMO CORE DIGITAL.
               </p>

               <div className="space-y-10">
                 <div className="flex items-center gap-8 group cursor-pointer" onClick={() => window.location.href = 'mailto:es.comunicacao@outlook.com'}>
                   <div className="w-16 h-16 rounded-none bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:border-primary/50 transition-all group-hover:scale-110">
                     <Mail size={24} className="text-primary opacity-60 group-hover:opacity-100" />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em] mb-1">E-MAIL COMPARTILHADO</span>
                      <span className="font-mono text-sm tracking-widest text-white/60 group-hover:text-white transition-colors uppercase">ES.COMUNICACAO@OUTLOOK.COM</span>
                   </div>
                 </div>
               </div>
            </div>

            <div className="bg-[#050505] rounded-none p-12 border border-white/5 shadow-2xl relative overflow-hidden group">
               <AnimatePresence mode="wait">
                 {status === "success" ? (
                   <motion.div 
                     key="success"
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 1.1 }}
                     className="h-full flex flex-col items-center justify-center text-center py-20"
                   >
                     <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-8 border border-primary/30">
                       <CheckCircle2 size={48} className="text-primary" />
                     </div>
                     <h3 className="text-3xl font-black font-tech text-white uppercase mb-4">TRANSMISSÃO CONCLUÍDA</h3>
                     <p className="text-white/40 font-mono text-[10px] tracking-widest uppercase mb-8">
                       Sua mensagem foi criptografada e enviada para nossa central.
                     </p>
                     <div className="bg-primary/5 border border-primary/20 px-6 py-3 rounded-none">
                       <span className="text-[9px] font-mono text-white/40 uppercase block mb-1">PROTOCOLO DE SEGURANÇA</span>
                       <span className="text-primary font-mono font-bold tracking-[0.3em]">{protocol}</span>
                     </div>
                   </motion.div>
                 ) : (
                   <motion.div key="form">
                      <div className="flex items-center justify-between mb-16">
                        <div className="flex items-center gap-3 px-4 py-1.5 border border-primary/20 rounded-full w-fit bg-primary/5">
                           <div className={`w-1.5 h-1.5 rounded-full ${status === 'sending' ? 'bg-yellow-400 animate-pulse' : 'bg-primary'}`} />
                           <h3 className="font-bold tracking-[0.3em] uppercase text-[9px] font-mono text-primary">
                             {status === 'sending' ? 'TX_IN_PROGRESS' : 'ST_01 .SECURE_START'}
                           </h3>
                        </div>
                        {status === 'error' && (
                          <div className="flex items-center gap-2 text-red-500 font-mono text-[10px] uppercase font-bold">
                            <AlertCircle size={14} /> FALHA NO HANDSHAKE
                          </div>
                        )}
                      </div>

                      <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="relative group">
                            <input name="name" type="text" placeholder="NOME_COMPLETO" className="w-full bg-white/[0.02] border border-white/10 rounded-none px-8 py-5 text-xs font-mono tracking-widest focus:border-primary/50 outline-none transition-all placeholder:text-white/10 uppercase" required disabled={status === 'sending'} />
                          </div>
                          <div className="relative group">
                            <input name="email" type="email" placeholder="E-MAIL_CORPORATIVO" className="w-full bg-white/[0.02] border border-white/10 rounded-none px-8 py-5 text-xs font-mono tracking-widest focus:border-primary/50 outline-none transition-all placeholder:text-white/10 uppercase" required disabled={status === 'sending'} />
                          </div>
                        </div>

                        <div className="relative group">
                          <input name="phone" type="text" placeholder="WHATSAPP_ID" className="w-full bg-white/[0.02] border border-white/10 rounded-none px-8 py-5 text-xs font-mono tracking-widest focus:border-primary/50 outline-none transition-all placeholder:text-white/10 uppercase" disabled={status === 'sending'} />
                        </div>

                        <div className="relative group">
                          <textarea name="message" placeholder="DESCRIÇÃO_DO_PROJETO" className="w-full bg-white/[0.02] border border-white/10 rounded-none px-8 py-6 text-xs font-mono tracking-widest focus:border-primary/50 outline-none transition-all placeholder:text-white/10 min-h-[160px] resize-none uppercase" required disabled={status === 'sending'} />
                        </div>

                        <button 
                          disabled={status === 'sending'}
                          className={`w-full py-6 rounded-none font-black uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-4 transition-all transform active:scale-95 mt-6 ${
                            status === 'sending' 
                              ? 'bg-white/5 text-white/20 cursor-wait' 
                              : 'bg-primary text-black hover:shadow-[0_0_40px_rgba(0,255,0,0.2)]'
                          }`}
                        >
                          {status === 'sending' ? 'PROCESSANDO_DADOS' : 'INICIAR_TRANSMISSÃO'} 
                          {status !== 'sending' && <Send size={14} strokeWidth={3} />}
                        </button>
                      </form>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>
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
       `}</style>
    </section>
  );
}
