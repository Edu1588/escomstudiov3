import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import MenuOverlay from './MenuOverlay';

export default function FixedOverlayV2() {
  const [timeCampinas, setTimeCampinas] = useState('');
  const [timeNewYork, setTimeNewYork] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      const campinasOptions: Intl.DateTimeFormatOptions = { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
      setTimeCampinas(now.toLocaleTimeString('en-US', campinasOptions).replace(/:/g, ' '));
      
      const newYorkOptions: Intl.DateTimeFormatOptions = { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
      setTimeNewYork(now.toLocaleTimeString('en-US', newYorkOptions).replace(/:/g, ' '));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      <div className="fixed inset-0 z-40 pointer-events-none p-6 md:p-10 flex flex-col justify-between text-[#F5F2EC]">
        
        {/* Top Bar */}
        <div className="flex justify-between items-center pointer-events-auto w-full gap-2 sm:gap-4">
          {/* Logo Corner: FÁBRICA mark */}
          <a href="/home" className="flex items-center gap-3 cursor-pointer group bg-[#050505]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 hover:border-[#ff4f00] transition-colors">
            <span className="text-xl font-bold text-[#ff4f00] tracking-tighter font-serif">F</span>
            <span className="text-[10px] sm:text-xs font-mono tracking-widest text-white/90 group-hover:text-[#ff4f00] transition-colors uppercase font-bold">
              FÁBRICA <span className="hidden sm:inline text-white/40 font-normal">— PUBLICIDADE & DIGITAL</span>
            </span>
          </a>

          {/* Anvil Heating Badge */}
          <div className="hidden lg:flex items-center gap-2 bg-[#050505]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#ff4f00]/30 font-mono text-[11px] text-white/80">
            <span className="w-2 h-2 rounded-full bg-[#ff4f00] animate-pulse" />
            <span className="text-white/60">Aquecendo a bigorna...</span>
          </div>

          {/* Center Control Box */}
          <div 
            className="flex items-center gap-3 text-[10px] md:text-xs bg-[#050505]/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 uppercase tracking-widest cursor-pointer hover:border-[#ff4f00] transition-all group shadow-2xl" 
            onClick={() => setIsMenuOpen(true)}
          >
             <span className="font-mono text-[#ff4f00] text-sm font-bold leading-none">&gt;|&lt;</span>
             <div className="flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 bg-[#ff4f00] rounded-full group-hover:scale-125 transition-transform"></div>
                ))}
             </div>
             <span className="text-white font-mono font-medium tracking-widest ml-1">MENU</span>
          </div>

          {/* Right CTA Corner: Iniciar Projeto */}
          <div className="flex items-center gap-2">
            <a 
              href="#contact"
              className="bg-[#ff4f00] hover:bg-[#ff4f00]/90 text-black font-mono font-bold text-[10px] sm:text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full transition-all shadow-lg shadow-[#ff4f00]/20"
            >
              Iniciar Projeto
            </a>

            <button 
              onClick={toggleLanguage}
              className="hidden sm:flex items-center gap-1 text-[10px] font-mono tracking-widest uppercase hover:text-[#ff4f00] transition-colors bg-[#050505]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10"
            >
              <span className={language === 'PT' ? "text-[#ff4f00] font-bold" : "text-white/40"}>PT</span>
              <span className="text-white/20">/</span>
              <span className={language === 'EN' ? "text-[#ff4f00] font-bold" : "text-white/40"}>EN</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex justify-between items-end text-xs font-mono text-white/60 pointer-events-auto w-full">
          <div className="hidden md:flex gap-8 bg-[#050505]/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <div className="flex gap-2 items-center">
              <span className="w-2 h-2 rounded-full bg-[#ff4f00] animate-ping" />
              <span className="text-white font-bold">{timeCampinas}</span>
              <span className="text-white/40">BRT, CAMPINAS</span>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-white font-bold">{timeNewYork}</span>
              <span className="text-white/40">EST, NYC</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#050505]/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 ml-auto md:ml-0">
            <span className="text-[#ff4f00] font-bold">SCROLL</span>
            <span className="text-white/40">↓</span>
          </div>
        </div>
        
      </div>
    </>
  );
}

