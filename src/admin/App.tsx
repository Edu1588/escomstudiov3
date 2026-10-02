import React, { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Tags, 
  Layers, 
  FileText, 
  Target, 
  Users, 
  FileSignature, 
  Briefcase, 
  Instagram, 
  BarChart2, 
  Settings,
  LogOut,
  Search,
  ChevronDown,
  ChevronRight,
  HeartPulse,
  DollarSign,
  Building,
  ExternalLink,
  Wrench,
  CheckSquare,
  Plug,
  Crown,
  Box,
  Globe,
  Sparkles
} from "lucide-react";

import Dashboard from "./pages/Dashboard";
import Servicos from "./pages/Servicos";
import Paginas from "./pages/Paginas";
import Propostas from "./pages/Propostas";
import Leads from "./pages/Leads";
import Contratos from "./pages/Contratos";
import Portfolio from "./pages/Portfolio";
import LogoCreator from "./pages/LogoCreator";
import InstagramGEM from "./pages/InstagramGEM";
import ProjetosNoAr from "./pages/ProjetosNoAr";
import Configuracoes from "./pages/Configuracoes";
import Prospect from "./pages/Prospect";
import Mineracao from "./pages/Mineracao";
import Saude from "./pages/Saude";
import Financas from "./pages/Financas";
import Login from "./pages/Login";
import Trajetoria from "./pages/Trajetoria";
import Escritorio from "./pages/Escritorio";
import Agendamentos from "./pages/Agendamentos";
import { VoicePoweredOrb } from "../components/ui/voice-powered-orb";

function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) {
  const location = useLocation();

  React.useEffect(() => {
    if (window.innerWidth < 1280) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [location.pathname, setIsOpen]);

  const handleMenuClick = (itemName: string) => {
    if (itemName === "Saúde") {
      const audio = new Audio("/audio/saude_barriga.mp3");
      audio.play().catch(err => console.log("Audio play prevented:", err));
      window.dispatchEvent(new Event('app-audio-active'));
    }
    if (itemName === "Instagram GEM") {
      const audio = new Audio("/audio/geradorInsta.mp3");
      audio.play().catch(err => console.log("Audio play prevented:", err));
      window.dispatchEvent(new Event('app-audio-active'));
    }
    if (itemName === "Prospect Suite") {
      const audio = new Audio("/audio/buscarCliente.mp3");
      audio.play().catch(err => console.log("Audio play prevented:", err));
      window.dispatchEvent(new Event('app-audio-active'));
    }
  };
  const navItems = [
    { name: "Resumo Geral", path: "/", icon: <LayoutDashboard size={18} />, hoverColor: "group-hover:text-cyan text-cyan" },
    { name: "Leads", path: "/leads", icon: <Users size={18} />, hoverColor: "group-hover:text-sky-400 text-sky-400" },
    { name: "Propostas", path: "/propostas", icon: <FileText size={18} />, hoverColor: "group-hover:text-amber-400 text-amber-400" },
    { name: "Clientes", path: "/prospect", icon: <Briefcase size={18} />, hoverColor: "group-hover:text-blue-400 text-blue-400" },
    { name: "Gestão de Páginas", path: "/paginas", icon: <Layers size={18} />, hoverColor: "group-hover:text-indigo-400 text-indigo-400" },
    { name: "Contratos", path: "/contratos", icon: <FileSignature size={18} />, hoverColor: "group-hover:text-orange-400 text-orange-400" },
    { name: "Finanças", path: "/financas", icon: <DollarSign size={18} />, hoverColor: "group-hover:text-emerald-400 text-emerald-400" },
    { name: "Saúde", path: "/saude", icon: <HeartPulse size={18} />, hoverColor: "group-hover:text-rose-500 text-rose-500" },
    { name: "Portfólio", path: "/portfolio", icon: <Briefcase size={18} />, hoverColor: "group-hover:text-fuchsia-400 text-fuchsia-400" },
    { name: "Logo Studio", path: "/logos", icon: <Sparkles size={18} />, hoverColor: "group-hover:text-amber-400 text-amber-400" },
    { name: "Instagram GEM", path: "/instagram", icon: <Instagram size={18} />, hoverColor: "group-hover:text-pink-500 text-pink-500" },
    { name: "Tarefas", path: "/agendamentos", icon: <CheckSquare size={18} />, hoverColor: "group-hover:text-teal-400 text-teal-400" },
    { name: "Relatórios", path: "/projetos-no-ar", icon: <BarChart2 size={18} />, hoverColor: "group-hover:text-cyan-400 text-cyan-400" },
    { name: "Integrações", path: "/servicos", icon: <Plug size={18} />, hoverColor: "group-hover:text-yellow-400 text-yellow-400" },
    { name: "Configurações", path: "/configuracoes", icon: <Settings size={18} />, hoverColor: "group-hover:text-slate-200 text-slate-200" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 xl:hidden" onClick={() => setIsOpen(false)} />
      )}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 w-64 h-full bg-[#000000] border-r border-white/10 flex flex-col pt-6 pb-4 shrink-0 overflow-hidden ${isOpen ? 'xl:relative xl:translate-x-0' : ''}`}>
        
        {/* Brand Header */}
        <div className="px-5 mb-8 flex items-center justify-between shrink-0">
          <Link to="/" className="flex flex-col group">
            <span className="font-serif text-2xl font-light text-white tracking-tight">
              ESCOM<span className="text-cyan">.</span>
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/40 mt-1">
              Studio Operating System
            </span>
          </Link>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto min-h-0 px-3 custom-scrollbar space-y-6">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.name}>
                  <Link 
                    to={item.path} 
                    onClick={() => handleMenuClick(item.name)}
                    className={`group flex items-center gap-3 px-3 py-2 text-xs transition-all duration-200 border-l-2 ${
                      isActive 
                        ? "bg-cyan-950/30 text-cyan border-cyan shadow-none" 
                        : "border-transparent text-white/50 hover:text-cyan hover:bg-cyan-950/20 hover:border-cyan/60"
                    }`}
                  >
                    <span className={`transition-colors duration-200 ${isActive ? item.hoverColor.split(' ')[1] : `text-white/40 ${item.hoverColor.split(' ')[0]}`}`}>
                      {item.icon}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.06em] transition-colors group-hover:text-cyan">
                      {item.name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* User Profile Info Footer */}
        <div className="px-3 shrink-0 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between bg-[#09090b] border border-white/10 p-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 bg-cyan/10 border border-cyan/30 flex items-center justify-center font-mono text-[10px] font-bold text-cyan shrink-0">
                ES
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-serif text-xs font-medium text-white truncate">Eduardo Santos</div>
                <div className="font-mono text-[9px] uppercase tracking-[0.06em] text-white/40 truncate">admin@escom.studio</div>
              </div>
            </div>
            <button 
              onClick={() => {
                localStorage.removeItem("admin_auth");
                window.location.reload();
              }}
              className="text-white/40 hover:text-white p-1 transition-colors"
              title="Opções / Sair"
            >
              <ChevronDown size={14} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("admin_auth") === "true";
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth >= 1280);

  React.useEffect(() => {
    const handleToggle = () => setIsSidebarOpen(prev => !prev);
    const handleClose = () => setIsSidebarOpen(false);
    const handleOpen = () => setIsSidebarOpen(true);
    window.addEventListener('toggle-sidebar', handleToggle);
    window.addEventListener('close-sidebar', handleClose);
    window.addEventListener('open-sidebar', handleOpen);
    return () => {
      window.removeEventListener('toggle-sidebar', handleToggle);
      window.removeEventListener('close-sidebar', handleClose);
      window.removeEventListener('open-sidebar', handleOpen);
    };
  }, []);

  React.useEffect(() => {
    if (isAuthenticated) {
      const audioPath = "/audio/ElevenLabs_2026-05-29T18_19_02_Otto - Intimidating and Aggressive_pvc_sp100_s100_sb100_se0_m2.mp3";
      const audioInstance = new Audio(audioPath);
      audioInstance.play().catch(err => {
        console.warn("Audio autoplay blocked by browser. Playing on first interaction.", err);
        const playOnInteraction = () => {
          audioInstance.play().catch(e => console.error("Failed to play audio:", e));
          window.removeEventListener('click', playOnInteraction);
        };
        window.addEventListener('click', playOnInteraction);
      });
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    localStorage.setItem("admin_auth", "true");
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-[#000000] text-white overflow-hidden font-sans relative">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main className="flex-1 h-full overflow-hidden flex flex-col relative w-full">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/servicos" element={<Servicos />} />
          <Route path="/paginas" element={<Paginas />} />
          <Route path="/propostas" element={<Propostas />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/contratos" element={<Contratos />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/logos" element={<LogoCreator />} />
          <Route path="/trajetoria" element={<Trajetoria />} />
          <Route path="/instagram" element={<InstagramGEM />} />
          <Route path="/projetos-no-ar" element={<ProjetosNoAr />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/prospect" element={<Prospect />} />
          <Route path="/mineracao" element={<Mineracao />} />
          <Route path="/saude" element={<Saude />} />
          <Route path="/financas" element={<Financas />} />
          <Route path="/escritorio" element={<Escritorio />} />
          <Route path="/agendamentos" element={<Agendamentos />} />
        </Routes>
      </main>

      {/* EFEITO VISUAL DE SOM DE BOLHA 3D REACTIVA (SEM MICROFONE) */}
      <div className="fixed bottom-6 right-6 z-50 w-24 h-24 pointer-events-none drop-shadow-[0_0_25px_rgba(37,99,235,0.6)]">
        <VoicePoweredOrb className="w-full h-full" enableVoiceControl={false} />
      </div>
    </div>
  );
}
