import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { motion } from 'motion/react';
import { Globe, ArrowUpRight, Send, X } from 'lucide-react';
import './index.css';

import Navbar from "./components/Navbar";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import { logPageView } from "./lib/analytics";
import { getPortfolioProjects, PortfolioProject } from "./firebase";

function getRandomScore(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  const base = 89 + (Math.abs(hash) % 11);
  return `${base}%`;
}

function PortfolioPage() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  useEffect(() => {
    logPageView("Portfolio Projetos");
    getPortfolioProjects().then(data => {
      setProjects(data);
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedProject(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen text-white font-rajdhani selection:bg-white selection:text-black">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-12 bg-white/5 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl rounded-tl-none">
          <a href="/" className="flex items-center gap-1">
            <span className="font-bold tracking-tighter text-xl font-display">ESCOM</span>
            <span className="font-bold tracking-tighter text-xl font-display text-[#00d1ff]">STUDIO</span>
          </a>
          
          <div className="hidden md:flex items-center gap-8 text-[11px] font-mono tracking-widest text-white/60">
            {Object.entries({
              "Início": "inicio",
              "Sobre": "sobre",
              "Serviços": "servicos",
              "Portfólio": "portfolio",
              "Posicionamento": "posicionamento"
            }).map(([label, id]) => (
              <a key={label} href={`/#${id}`} className="hover:text-[#00d1ff] transition-colors">
                {label}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-[10px] font-mono tracking-widest">
            <Globe size={14} className="text-white/40" />
            <span className="text-[#00d1ff]">PT</span>
            <span className="text-white/20">|</span>
            <span className="text-white/40 hover:text-white cursor-pointer">EN</span>
            <span className="text-white/20">|</span>
            <span className="text-white/40 hover:text-white cursor-pointer">ES</span>
          </div>
          
          <a href="/#contato" className="bg-[#00d1ff] text-black px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform">
            Fale Conosco
          </a>
        </div>
      </motion.nav>

      <main className="pt-40 pb-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center text-center mb-24">
            <div className="border border-[#00d1ff] text-[#00d1ff] px-4 py-1 text-xs font-mono tracking-widest mb-6 rounded-none">
              [ PROJETOS ]
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6">Nosso Portfólio</h1>
            <p className="text-gray-400 text-lg md:text-xl font-mono">
              Explore nossos projetos de design, desenvolvimento web e branding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj, i) => (
              <motion.div 
                key={proj.id || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative border border-white/10 bg-[#0a0a0a] rounded-2xl overflow-hidden hover:border-[#00d1ff]/50 transition-colors flex flex-col cursor-pointer"
                onClick={() => setSelectedProject(proj)}
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={proj.image || "https://fakeimg.pl/800x600/111/333?text=Sem+foto"} 
                    alt={proj.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" 
                  />
                  {(proj.score || true) && (
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-black flex items-center pr-3 rounded">
                      <div className="bg-[#00d1ff] text-black font-bold text-2xl px-4 py-2 flex items-center justify-center h-full">
                        A
                      </div>
                      <div className="flex flex-col text-[10px] uppercase font-bold leading-none py-2 pl-3 border-l border-black/10">
                        <span className="text-black/50 mb-1">Performance + Structure</span>
                        <div className="flex gap-2">
                           <span className="text-green-700">{getRandomScore(proj.name + (proj.id || ''))}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                   <div className="flex justify-between items-center mb-4">
                     <span className="text-xs font-bold font-mono text-[#00d1ff] tracking-widest bg-[#00d1ff]/10 px-2 py-1 rounded">
                       {proj.category}
                     </span>
                     <ArrowUpRight size={16} className="text-gray-500 group-hover:text-white" />
                   </div>
                   <h3 className="text-xl font-bold mb-3">{proj.name}</h3>
                   <p className="text-gray-400 text-sm leading-relaxed font-mono line-clamp-3">
                     {proj.desc}
                   </p>
                   <span className="text-[#00d1ff] text-xs font-mono tracking-wider mt-3 inline-block group-hover:underline underline-offset-4">
                     LER MAIS →
                   </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Contact Section */}
      <section className="py-24 border-t border-white/5 bg-[#0a0a0a]">
         <div className="container mx-auto px-6 max-w-4xl">
            <div className="flex flex-col items-center justify-center text-center mb-12">
               <div className="border border-[#00d1ff] text-[#00d1ff] px-4 py-1 text-xs font-mono tracking-widest mb-6 rounded-none">
                 [ CONTATO ]
               </div>
               <h2 className="text-4xl md:text-5xl font-black mb-4">Vamos Trabalhar Juntos?</h2>
               <p className="text-gray-400 font-mono">
                 Tem um projeto em mente? Entre em contato e vamos criar algo incrível juntos.
               </p>
            </div>
            
            <form className="space-y-4" onSubmit={async (e) => {
               e.preventDefault();
               const form = e.currentTarget;
               const btn = form.querySelector('button');
               if(btn) { btn.disabled = true; btn.innerHTML = 'ENVIANDO...'; }
               try {
                 const data = {
                   name: (form.querySelector('input[type="text"]') as HTMLInputElement).value,
                   email: (form.querySelector('input[type="email"]') as HTMLInputElement).value,
                   phone: (form.querySelectorAll('input[type="text"]')[1] as HTMLInputElement).value,
                   message: (form.querySelector('textarea') as HTMLTextAreaElement).value
                 };
                 await fetch('/api/contact', {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify(data)
                 });
                 if(btn) { btn.innerHTML = 'ENVIADO COM SUCESSO ✓'; btn.classList.replace('bg-[#00d1ff]','bg-green-600'); }
                 form.reset();
               } catch(err) {
                 if(btn) { btn.disabled = false; btn.innerHTML = 'ERRO - TENTAR NOVAMENTE'; }
               }
            }}>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </span>
                    <input type="text" placeholder="Seu nome" className="w-full bg-[#111] border border-white/10 rounded-lg py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#00d1ff] transition-colors font-mono text-sm" />
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    </span>
                    <input type="email" placeholder="Seu e-mail corporativo" className="w-full bg-[#111] border border-white/10 rounded-lg py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#00d1ff] transition-colors font-mono text-sm" />
                  </div>
               </div>
               <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </span>
                  <input type="text" placeholder="WhatsApp" className="w-full bg-[#111] border border-white/10 rounded-lg py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#00d1ff] transition-colors font-mono text-sm" />
               </div>
               <div className="relative">
                  <span className="absolute left-4 top-5 text-gray-500">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  </span>
                  <textarea placeholder="Conte sobre seu projeto..." rows={5} className="w-full bg-[#111] border border-white/10 rounded-lg py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#00d1ff] transition-colors font-mono text-sm resize-none"></textarea>
               </div>
               <button className="w-full bg-[#00d1ff] hover:bg-[#00a8cc] text-black font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors uppercase tracking-widest shadow-[0_0_20px_rgba(0,209,255,0.3)]">
                  Enviar <Send size={18} />
               </button>
            </form>
         </div>
      </section>

      {/* Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-[#00d1ff] hover:text-black flex items-center justify-center text-white transition-all"
            >
              <X size={20} />
            </button>

            <div className="md:w-1/2 overflow-y-auto max-h-[45vh] md:max-h-[90vh]">
              <img
                src={selectedProject.image || "https://fakeimg.pl/800x600/111/333?text=Sem+foto"}
                alt={selectedProject.name}
                className="w-full h-auto object-contain"
              />
            </div>

            <div className="md:w-1/2 p-8 flex flex-col overflow-y-auto max-h-[45vh] md:max-h-[90vh]">
              <span className="text-xs font-bold font-mono text-[#00d1ff] tracking-widest bg-[#00d1ff]/10 px-3 py-1.5 rounded self-start mb-4">
                {selectedProject.category}
              </span>

              <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight">
                {selectedProject.name}
              </h2>

              <div className="flex-1 overflow-y-auto pr-2 mb-6">
                <p className="text-gray-400 text-sm leading-relaxed font-mono whitespace-pre-wrap">
                  {selectedProject.desc}
                </p>
              </div>

              <div className="border-t border-white/10 pt-5 mt-auto flex items-center justify-between text-xs font-mono text-gray-500">
                <span>SCORE: {getRandomScore(selectedProject.name + (selectedProject.id || ''))}</span>
                <span>STATUS: FINALIZADO</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <BackToTop />
    </div>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <PortfolioPage />
    </StrictMode>
  );
}
