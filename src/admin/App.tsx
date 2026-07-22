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
  Wrench
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
import { VoicePoweredOrb } from "../components/ui/voice-powered-orb";

function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) {
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>("Prospect");

  React.useEffect(() => {
    if (window.innerWidth < 1280) {
      setIsOpen(false);
    } else {
      if (location.pathname !== '/mineracao') {
        setIsOpen(true);
      }
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

  const menuPrincipal = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={18} /> },
    { name: "Valores & Serviços", path: "/servicos", icon: <Tags size={18} /> },
    { name: "Gestão de Páginas", path: "/paginas", icon: <Layers size={18} /> },
    { name: "Gerar Propostas", path: "/propostas", icon: <FileText size={18} /> },
    { 
      name: "Prospect", 
      icon: <Target size={18} />,
      subItems: [
        { name: "Prospect Suite", path: "/prospect" },
        { name: "Mineração de Sites", path: "/mineracao" },
        { name: "Leads", path: "/leads" },
        { name: "WhatsApp CRM ↗", path: "https://escom-crm.vercel.app", isExternal: true }
      ]
    },
    { name: "Onward Consultoria", path: "/onward", icon: <Briefcase size={18} />, isExternal: true, url: "/onward" },
    { name: "Contratos", path: "/contratos", icon: <FileSignature size={18} /> },
    { name: "Projetos do Portfolio", path: "/portfolio", icon: <Briefcase size={18} /> },
    { name: "Trajetória Profissional", path: "/trajetoria", icon: <Briefcase size={18} /> },
    { name: "Instagram GEM", path: "/instagram", icon: <Instagram size={18} /> },
    { name: "Saúde", path: "/saude", icon: <HeartPulse size={18} /> },
    { name: "Finanças", path: "/financas", icon: <DollarSign size={18} /> },
    { name: "Escritório 3D", path: "/escritorio", icon: <Building size={18} /> },
    {
      name: "Ferramentas",
      icon: <Wrench size={18} />,
      subItems: [
        { name: "Fooocus ↗", path: "https://github.com/lllyasviel/Fooocus.git", isExternal: true },
        { name: "Análise Plausível ↗", path: "https://github.com/plausible/analytics.git", isExternal: true },
        { name: "AppFlowy (Notion) ↗", path: "https://github.com/AppFlowy-IO/AppFlowy-Cloud.git", isExternal: true },
        { name: "Penpot (Design) ↗", path: "https://github.com/penpot/penpot.git", isExternal: true }
      ]
    },
  ];

  const sistema = [
    { name: "Projetos no ar", path: "/projetos-no-ar", icon: <BarChart2 size={18} /> },
    { name: "Configurações", path: "/configuracoes", icon: <Settings size={18} /> },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setIsOpen(false)} />
      )}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 w-64 h-full bg-[#0a0a0a] border-r border-[#1a1a1a] flex flex-col pt-6 pb-4 shrink-0 overflow-hidden ${isOpen ? 'xl:relative xl:translate-x-0' : ''}`}>
        <div className="px-6 mb-6 flex items-center justify-between shrink-0">
          <span className="font-bold text-xl text-white tracking-wider flex items-center">
            EDU<span className="text-[#00d1ff]">SANTOS</span>
          </span>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 px-4 custom-scrollbar">
          <div className="text-[10px] text-gray-500 font-mono tracking-widest mb-4 px-2">MENU PRINCIPAL</div>
          <ul className="space-y-1 mb-8">
            {menuPrincipal.map((item) => (
              <li key={item.name}>
                {item.subItems ? (
                  <div className="flex flex-col">
                    <button 
                      onClick={() => setOpenSubmenu(openSubmenu === item.name ? null : item.name)}
                      className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        item.subItems.some(sub => location.pathname === sub.path) || openSubmenu === item.name ? "text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.name}</span>
                      </div>
                      {openSubmenu === item.name ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                    {openSubmenu === item.name && (
                      <ul className="mt-1 ml-9 space-y-1">
                        {item.subItems.map((subItem: any) => (
                          <li key={subItem.name}>
                            {subItem.isExternal ? (
                              <a 
                                href={subItem.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-[#00d1ff] hover:bg-white/5 transition-colors font-medium"
                              >
                                <span>{subItem.name}</span>
                              </a>
                            ) : (
                              <Link 
                                to={subItem.path} 
                                onClick={() => handleMenuClick(subItem.name)}
                                className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                                  location.pathname === subItem.path ? "bg-[#00d1ff]/10 text-[#00d1ff] font-semibold" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                                }`}
                              >
                                <span>{subItem.name}</span>
                              </Link>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : item.isExternal ? (
                  <a 
                    href={item.url || item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-gray-400 hover:text-white hover:bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.name}</span>
                    </div>
                    <ExternalLink size={12} className="text-gray-600" />
                  </a>
                ) : (
                  <Link 
                    to={item.path!} 
                    onClick={() => handleMenuClick(item.name)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === item.path ? "bg-[#00d1ff]/10 text-[#00d1ff] border border-[#00d1ff]/20" : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.name}</span>
                    </div>
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <div className="text-[10px] text-gray-500 font-mono tracking-widest mb-4 px-2">SISTEMA</div>
          <ul className="space-y-1 mb-8">
            {sistema.map((item) => (
              <li key={item.name}>
                <Link 
                  to={item.path} 
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.path ? "bg-[#00d1ff]/10 text-[#00d1ff] border border-[#00d1ff]/20" : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Card do Usuário Fixo no Bottom da Sidebar */}
        <div className="px-4 mt-auto shrink-0">
          <div className="relative">
            <div className="absolute -inset-3 z-0 opacity-60 blur-sm pointer-events-none">
              <VoicePoweredOrb
                enableVoiceControl={false}
                hue={120}
                voiceSensitivity={2.5}
                maxRotationSpeed={1.8}
                className="w-20 h-20 rounded-full overflow-hidden"
              />
            </div>
            <div className="relative z-10 flex items-center gap-3 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-3 py-3 shadow-lg hover:border-[#00d1ff]/30 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-full bg-[#00d1ff] flex items-center justify-center text-black font-bold text-xs shrink-0 relative ring-2 ring-[#00d1ff]/30 ring-offset-2 ring-offset-black">
                <img src="https://res.cloudinary.com/djw0tqmiw/image/upload/v1781623854/dson8tpoeb04giyqooqd.png" alt="Edu Santos" className="w-full h-full object-cover rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white truncate">Edu Santos</div>
                <div className="text-[10px] text-gray-400 truncate flex items-center gap-1.5">
                  Admin
                  <span className="w-1.5 h-1.5 bg-[#00d1ff] rounded-full inline-block animate-pulse"></span>
                  <span className="text-[#00d1ff] font-semibold">ONLINE</span>
                </div>
              </div>
              <button onClick={() => {
                localStorage.removeItem("admin_auth");
                window.location.reload();
              }} className="text-gray-500 hover:text-red-400 transition-colors ml-1" title="Sair">
                <LogOut size={16} />
              </button>
            </div>
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
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans relative">
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
