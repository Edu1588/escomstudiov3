import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useLanguage } from '../../contexts/LanguageContext';

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      gsap.to(overlayRef.current, {
        autoAlpha: 1,
        duration: 0.4,
        ease: 'power3.out'
      });
      gsap.fromTo(linksRef.current, 
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'power3.out', delay: 0.1 }
      );
    } else {
      gsap.to(overlayRef.current, {
        autoAlpha: 0,
        duration: 0.3,
        ease: 'power3.in'
      });
    }
  }, [isOpen]);

  const navLinks = [
    { pt: '00 INÍCIO', en: '00 HOME', path: '/home', isRouter: true },
    { pt: '01 QUEM SOMOS', en: '01 ABOUT', path: '#philosophy', isRouter: false },
    { pt: '02 JORNADA DA FORJA', en: '02 JOURNEY', path: '#journey', isRouter: false },
    { pt: '03 O QUE FORJAMOS', en: '03 WHAT WE FORGE', path: '#services', isRouter: false },
    { pt: '04 CLIENTES', en: '04 CLIENTS', path: '#clients', isRouter: false },
    { pt: '05 APRESENTAÇÃO AZUL', en: '05 AZUL PRESENTATION', path: '/apresentacao-azul', isRouter: true, highlighted: true },
    { pt: '06 CONTATO', en: '06 CONTACT', path: '#contact', isRouter: false },
  ];

  return (
    <div 
      ref={overlayRef} 
      className="fixed inset-0 z-50 bg-[#050505]/95 backdrop-blur-2xl flex flex-col justify-center items-center text-[#F5F2EC] invisible opacity-0 border border-white/10"
    >
      <button 
        onClick={onClose}
        className="absolute top-10 right-10 text-xs font-mono tracking-[0.2em] uppercase hover:text-[#ff4f00] transition-colors border border-white/20 px-4 py-2 rounded-full bg-[#050505]/50"
      >
        [ {t('FECHAR', 'CLOSE')} ]
      </button>

      <nav className="flex flex-col items-center gap-6 my-auto">
        {navLinks.map((link, i) => (
          link.isRouter ? (
            <Link
              key={i}
              to={link.path}
              ref={el => { linksRef.current[i] = el; }}
              onClick={onClose}
              className={`text-2xl md:text-5xl font-mono tracking-tight transition-all duration-300 ${
                link.highlighted 
                  ? 'text-[#ff4f00] font-bold hover:scale-105' 
                  : 'text-white/80 hover:text-[#ff4f00] hover:translate-x-2'
              }`}
            >
              {t(link.pt, link.en)}
            </Link>
          ) : (
            <a
              key={i}
              href={link.path}
              ref={el => { linksRef.current[i] = el; }}
              onClick={(e) => {
                if (link.path.startsWith('#')) {
                  const targetEl = document.querySelector(link.path);
                  if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth' });
                  }
                }
                onClose();
              }}
              className="text-2xl md:text-5xl font-mono tracking-tight text-white/80 hover:text-[#ff4f00] transition-all duration-300 hover:translate-x-2"
            >
              {t(link.pt, link.en)}
            </a>
          )
        ))}
      </nav>
      
      <div className="absolute bottom-10 flex gap-8 text-xs font-mono tracking-widest opacity-60 uppercase">
        <span>FÁBRICA PUBLICIDADE &copy; 2026</span>
        <span className="text-white/20">|</span>
        <Link to="/admin" className="hover:text-[#ff4f00] transition-colors">{t('ADMIN PAINEL', 'ADMIN PANEL')}</Link>
      </div>
    </div>
  );
}

