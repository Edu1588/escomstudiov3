import { motion } from "motion/react";
import { Globe, ArrowRight } from "lucide-react";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between"
    >
      <div className="flex items-center gap-12 bg-white/5 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl rounded-tl-none">
        <div className="flex items-center gap-1">
          <img src="https://res.cloudinary.com/djw0tqmiw/image/upload/v1779720673/peoloi6ok6i4ma0rqtvh.png" alt="ESCOM Logo" className="h-6 w-auto mr-1 filter brightness-100" />
          <span className="font-bold tracking-tighter text-xl font-display">ESCOM</span>
          <span className="font-bold tracking-tighter text-xl font-display text-primary">STUDIO</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-[11px] font-mono tracking-widest text-white/60">
          {["Início", "Sobre", "Serviços", "Portfólio", "Posicionamento"].map((item) => (
            <a key={item} href={item === "Sobre" ? "/sobre" : `/#${item.toLowerCase()}`} className="hover:text-primary transition-colors">
              {item}
            </a>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-[10px] font-mono tracking-widest">
          <Globe size={14} className="text-white/40" />
          <span className="text-primary">PT</span>
          <span className="text-white/20">|</span>
          <span className="text-white/40 hover:text-white cursor-pointer">EN</span>
          <span className="text-white/20">|</span>
          <span className="text-white/40 hover:text-white cursor-pointer">ES</span>
        </div>
        
        <button className="bg-primary text-black px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform">
          Fale Conosco
        </button>
      </div>
    </motion.nav>
  );
}
