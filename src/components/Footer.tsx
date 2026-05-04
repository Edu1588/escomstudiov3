import { motion } from "motion/react";
import { Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black pt-24 pb-12 px-6 border-t border-white/5">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="col-span-1 md:col-span-2">
             <div className="flex items-center gap-1 mb-8">
                <span className="font-bold tracking-tighter text-2xl font-display">ESCOM</span>
                <span className="font-bold tracking-tighter text-2xl font-display text-primary">STUDIO</span>
             </div>
             <p className="text-white/40 max-w-sm font-mono text-[10px] tracking-widest leading-relaxed uppercase">
                A ESCOM desenvolve projetos digitais de alta performance que unem design estratégico e infraestrutura inteligente. Nosso foco é transformar a presença online em um sistema funcional de crescimento.
             </p>
             <div className="flex gap-4 mt-12">
                <div className="w-10 h-10 rounded-none bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary cursor-pointer transition-all">
                  <Instagram size={18} />
                </div>
                <div className="w-10 h-10 rounded-none bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary cursor-pointer transition-all">
                  <Linkedin size={18} />
                </div>
             </div>
          </div>
          
          <div>
            <h4 className="font-mono text-[10px] tracking-[0.3em] text-white/20 mb-8 uppercase">NAVEGAÇÃO</h4>
            <ul className="space-y-4 font-mono text-[11px] tracking-widest text-white/50">
              {["Início", "Sobre nós", "Serviços", "Projetos"].map(link => (
                <li key={link} className="hover:text-primary transition-colors cursor-pointer">{link}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-mono text-[10px] tracking-[0.3em] text-white/20 mb-8 uppercase">CONTATO</h4>
            <ul className="space-y-4 font-mono text-[11px] tracking-widest text-white/50">
              <li className="hover:text-primary transition-colors cursor-pointer flex items-center gap-3 underline decoration-primary/30">es.comunicacao@outlook.com</li>
              <li className="hover:text-primary transition-colors cursor-pointer">+55 (11) 99999-9999</li>
              <li className="hover:text-primary transition-colors cursor-pointer">São Paulo, SP - Brasil</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between gap-8">
           <span className="font-mono text-[10px] text-white/20 tracking-widest">
             © 2026 ESCOM STUDIO // TODOS OS DIREITOS RESERVADOS.
           </span>
           <div className="flex gap-8 font-mono text-[10px] text-white/20 tracking-widest uppercase">
              <span className="hover:text-white cursor-pointer">POLÍTICA DE PRIVACIDADE</span>
              <span className="hover:text-white cursor-pointer">TERMOS DE SERVIÇO</span>
           </div>
        </div>
      </div>
    </footer>
  );
}
