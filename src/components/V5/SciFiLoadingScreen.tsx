import React, { useState, useEffect } from 'react';

interface SciFiLoadingScreenProps {
  onEnter: () => void;
  brandName?: string;
  tagline?: string;
  subTagline?: string;
}

export default function SciFiLoadingScreen({
  onEnter,
  brandName = "READY TO EXPLORE",
  tagline = "Onde o coração humano encontra a mente digital.",
  subTagline = "Where the human heart meets the digital mind."
}: SciFiLoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Simulação progressiva de carregamento dos sistemas PBR e assets
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsReady(true);
          return 100;
        }
        const increment = Math.floor(Math.random() * 9) + 4;
        return Math.min(prev + increment, 100);
      });
    }, 45);

    return () => clearInterval(interval);
  }, []);

  const handleEnterClick = () => {
    setIsExiting(true);
    setTimeout(() => {
      onEnter();
    }, 650);
  };

  return (
    <div 
      className={`fixed inset-0 z-[999] bg-[#020204] flex flex-col items-center justify-center select-none overflow-hidden transition-all duration-700 ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{ fontFamily: "'Space Mono', 'IBM Plex Mono', monospace" }}
    >
      {/* Background Cyber Grid / Radial Glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(0, 209, 255, 0.15) 0%, transparent 65%),
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 40px 40px, 40px 40px',
        }}
      />

      {/* Crosshair HUD elements in corners */}
      <div className="absolute top-8 left-8 text-[11px] text-[#00d1ff]/40 tracking-widest uppercase flex items-center gap-2">
        <span className="w-2 h-2 border-t border-l border-[#00d1ff]" />
        <span>SYS.V5 // ESCOM-CORE</span>
      </div>

      <div className="absolute top-8 right-8 text-[11px] text-[#00d1ff]/40 tracking-widest uppercase flex items-center gap-2">
        <span>STATUS: {isReady ? "READY" : `SYNCING ${progress}%`}</span>
        <span className="w-2 h-2 border-t border-r border-[#00d1ff]" />
      </div>

      <div className="absolute bottom-8 left-8 text-[11px] text-stone-600 tracking-widest uppercase flex items-center gap-2">
        <span className="w-2 h-2 border-b border-l border-stone-600" />
        <span>SEC_001_PBR</span>
      </div>

      <div className="absolute bottom-8 right-8 text-[11px] text-stone-600 tracking-widest uppercase flex items-center gap-2">
        <span>LATENCY &lt; 0.4s</span>
        <span className="w-2 h-2 border-b border-r border-stone-600" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-xl px-6">
        
        {/* Emblem / Glowing Cyber Logo SVG (igual à referência enviada) */}
        <div className="relative mb-8 group cursor-default">
          <div className="absolute -inset-4 bg-[#00d1ff]/20 rounded-full blur-xl animate-pulse" />
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
            <svg 
              viewBox="0 0 100 100" 
              className="w-full h-full text-[#00d1ff] drop-shadow-[0_0_20px_rgba(0,209,255,0.8)] transition-transform duration-500 hover:scale-105"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Formato orgânico cibernético tipo folha/olho tech da referência */}
              <rect x="22" y="24" width="12" height="52" fill="currentColor" rx="2" />
              <path 
                d="M 34 28 C 72 15, 88 40, 88 54 C 88 72, 68 82, 44 80 C 62 76, 74 65, 68 52 C 60 38, 38 48, 34 50" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="7" 
              />
              <circle cx="58" cy="53" r="5" fill="currentColor" />
            </svg>
          </div>
        </div>

        {/* Title: READY TO EXPLORE */}
        <h1 
          className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-[0.25em] text-[#00d1ff] uppercase mb-3 drop-shadow-[0_0_15px_rgba(0,209,255,0.4)]"
          style={{ fontFamily: "'Space Mono', 'Montserrat', sans-serif" }}
        >
          {brandName}
        </h1>

        {/* Subtitle / Tagline */}
        <p className="text-xs sm:text-sm text-stone-400 font-sans italic tracking-wide mb-10 max-w-md">
          {tagline}
        </p>

        {/* Cyberpunk Sci-Fi Enter Button (Conforme o print do usuário) */}
        <div className="relative">
          {/* Progress bar line if still loading */}
          {!isReady && (
            <div className="w-56 sm:w-64 h-1 bg-white/10 rounded-full overflow-hidden mb-4 mx-auto">
              <div 
                className="h-full bg-[#00d1ff] transition-all duration-150 shadow-[0_0_10px_#00d1ff]" 
                style={{ width: `${progress}%` }} 
              />
            </div>
          )}

          {/* Futuristic Button Wrapper */}
          <div className="relative inline-block p-1">
            {/* Corner Bracket Elements */}
            <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#00d1ff]" />
            <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#00d1ff]" />
            <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#00d1ff]" />
            <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#00d1ff]" />

            {/* Sub-label READY positioned on the bottom edge */}
            <span 
              className="absolute -bottom-2.5 right-2 text-[9px] font-mono tracking-widest text-[#00d1ff] bg-[#020204] px-1 font-bold z-20"
            >
              READY
            </span>

            {/* Clickable Button with Sci-Fi Chamfer / Hex border */}
            <button
              onClick={handleEnterClick}
              disabled={!isReady}
              className={`group relative flex items-center justify-center gap-3 px-8 sm:px-12 py-3.5 bg-[#00d1ff]/10 border border-[#00d1ff]/60 hover:border-[#00d1ff] hover:bg-[#00d1ff]/20 transition-all duration-300 cursor-pointer overflow-hidden ${
                isReady ? 'animate-pulse hover:animate-none' : 'opacity-60 cursor-wait'
              }`}
              style={{
                clipPath: 'polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 10px)',
              }}
            >
              {/* Scanline light effect on button */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00d1ff]/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

              {/* Diamond Icon Left */}
              <span className="w-1.5 h-1.5 bg-[#00d1ff] rotate-45 shadow-[0_0_6px_#00d1ff]" />

              {/* Text Label */}
              <span className="text-xs sm:text-sm font-bold tracking-[0.25em] text-[#00d1ff] group-hover:text-white uppercase transition-colors">
                {isReady ? "ENTRAR" : `CARREGANDO ${progress}%`}
              </span>

              {/* Diamond Icon Right */}
              <span className="w-1.5 h-1.5 bg-[#00d1ff] rotate-45 shadow-[0_0_6px_#00d1ff]" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}