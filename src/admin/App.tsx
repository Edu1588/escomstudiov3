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
  Globe
} from "lucide-react";

import Dashboard from "./pages/Dashboard";
import Servicos from "./pages/Servicos";
import Paginas from "./pages/Paginas";
import Propostas from "./pages/Propostas";
import Leads from "./pages/Leads";
import Contratos from "./pages/Contratos";
import Portfolio from "./pages/Portfolio";
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
    { name: "Resumo Geral", path: "/", icon: <LayoutDashboard size={18} /> },
    { name: "Leads", path: "/leads", icon: <Users size={18} /> },
    { name: "Propostas", path: "/propostas", icon: <FileText size={18} /> },
    { name: "Clientes", path: "/prospect", icon: <Briefcase size={18} /> },
    { name: "Gestão de Páginas", path: "/paginas", icon: <Layers size={18} /> },
    { name: "Contratos", path: "/contratos", icon: <FileSignature size={18} /> },
    { name: "Portfólio", path: "/portfolio", icon: <Briefcase size={18} /> },
    { name: "Instagram GEM", path: "/instagram", icon: <Instagram size={18} /> },
    { name: "Tarefas", path: "/agendamentos", icon: <CheckSquare size={18} /> },
    { name: "Relatórios", path: "/projetos-no-ar", icon: <BarChart2 size={18} /> },
    { name: "Integrações", path: "/servicos", icon: <Plug size={18} /> },
    { name: "Configurações", path: "/configuracoes", icon: <Settings size={18} /> },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 xl:hidden" onClick={() => setIsOpen(false)} />
      )}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 w-64 h-full bg-[#0b1324] border-r border-[#16233b] flex flex-col pt-5 pb-4 shrink-0 overflow-hidden ${isOpen ? 'xl:relative xl:translate-x-0' : ''}`}>
        
        {/* Brand Header */}
        <div className="px-5 mb-6 flex items-center justify-between shrink-0">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#2563eb] to-[#38bdf8] flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Box size={18} className="text-white fill-white/20" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">
              ESCOM Studio
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
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive 
                        ? "bg-[#132342] text-white border-l-4 border-[#2563eb] shadow-sm" 
                        : "text-gray-400 hover:text-white hover:bg-[#101b33]"
                    }`}
                  >
                    <span className={isActive ? "text-[#3b82f6]" : "text-gray-400"}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Card do Plano Atual */}
        <div className="px-3 my-3 shrink-0">
          <div className="bg-[#0e1930] border border-[#1b2b4a] rounded-2xl p-3.5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-gray-400 font-medium">Plano Atual</span>
              <Crown size={14} className="text-[#3b82f6]" />
            </div>
            <div className="text-sm font-bold text-[#3b82f6] flex items-center gap-1.5">
              Profissional
            </div>
            <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Status: Ativo
            </div>
            <button className="w-full mt-2.5 bg-transparent border border-[#1d3257] hover:bg-[#152442] text-white text-xs py-1.5 rounded-xl font-medium transition-colors">
              Ver Detalhes
            </button>
          </div>
        </div>

        {/* User Profile Info Footer */}
        <div className="px-3 shrink-0 pt-2 border-t border-[#15223a]">
          <div className="flex items-center justify-between bg-[#0e1930] border border-[#1b2b4a] rounded-2xl p-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#1e2e4a] border border-[#2b4168] flex items-center justify-center text-xs font-bold text-white shrink-0">
                ES
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white truncate">Eduardo Santos</div>
                <div className="text-[10px] text-gray-400 truncate">admin@escom.studio</div>
              </div>
            </div>
            <button 
              onClick={() => {
                localStorage.removeItem("admin_auth");
                window.location.reload();
              }}
              className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors"
              title="Opções / Sair"
            >
              <ChevronDown size={16} />
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
    <div className="flex h-screen bg-[#070c18] text-white overflow-hidden font-sans relative">
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
      <div className="fixed bottom-6 right-6 z-[100] w-20 h-20 pointer-events-none">
        <VoicePoweredOrb
          enableVoiceControl={false}
          voiceSensitivity={3}
          maxRotationSpeed={2}
          maxHoverIntensity={1.2}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
