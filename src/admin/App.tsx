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
  LogOut
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
import Login from "./pages/Login";

function Sidebar({ onLogout, isOpen, setIsOpen }: { onLogout: () => void, isOpen: boolean, setIsOpen: (val: boolean) => void }) {
  const location = useLocation();

  React.useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, setIsOpen]);

  const menuPrincipal = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={18} /> },
    { name: "Valores & Serviços", path: "/servicos", icon: <Tags size={18} /> },
    { name: "Gestão de Páginas", path: "/paginas", icon: <Layers size={18} /> },
    { name: "Gerar Propostas", path: "/propostas", icon: <FileText size={18} /> },
    { name: "Prospect", path: "/prospect", icon: <Target size={18} /> },
    { name: "Leads", path: "/leads", icon: <Users size={18} /> },
    { name: "Contratos", path: "/contratos", icon: <FileSignature size={18} /> },
    { name: "Projetos do Portfolio", path: "/portfolio", icon: <Briefcase size={18} /> },
    { name: "Instagram GEM", path: "/instagram", icon: <Instagram size={18} /> },
  ];

  const sistema = [
    { name: "Projetos no ar", path: "/projetos-no-ar", icon: <BarChart2 size={18} /> },
    { name: "Configurações", path: "/configuracoes", icon: <Settings size={18} /> },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setIsOpen(false)} />
      )}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition-transform duration-300 w-64 h-full bg-[#0a0a0a] border-r border-[#1a1a1a] flex flex-col pt-6 pb-4 shrink-0 overflow-y-auto`}>
        <div className="px-6 mb-8 flex items-center justify-between">
          <span className="font-bold text-xl text-white tracking-wider flex items-center">
            EDU<span className="text-[#2EFF00]">SANTOS</span>
          </span>
        </div>

        <div className="flex-1 px-4">
          <div className="text-[10px] text-gray-500 font-mono tracking-widest mb-4 px-2">MENU PRINCIPAL</div>
          <ul className="space-y-1 mb-8">
            {menuPrincipal.map((item) => (
              <li key={item.name}>
                <Link 
                  to={item.path} 
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.path ? "bg-[#2EFF00]/10 text-[#2EFF00] border border-[#2EFF00]/20" : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <div className="text-[10px] text-gray-500 font-mono tracking-widest mb-4 px-2">SISTEMA</div>
          <ul className="space-y-1">
            {sistema.map((item) => (
              <li key={item.name}>
                <Link 
                  to={item.path} 
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.path ? "bg-[#2EFF00]/10 text-[#2EFF00] border border-[#2EFF00]/20" : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="px-4 mt-auto pt-6">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-[#2EFF00] flex items-center justify-center text-black font-bold text-xs shrink-0 relative">
              <img src="https://eionstudio.com.br/wp-content/uploads/2026/02/about-slide-2.jpg" alt="Edu Santos" className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-white truncate">Edu Santos</div>
              <div className="text-[10px] text-gray-500 truncate flex items-center gap-1">Admin <span className="w-1 h-1 bg-[#2EFF00] rounded-full inline-block"></span> ON</div>
            </div>
            <button onClick={onLogout} className="text-gray-500 hover:text-white transition-colors">
              <LogOut size={16} />
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  React.useEffect(() => {
    const handleToggle = () => setIsSidebarOpen(prev => !prev);
    window.addEventListener('toggle-sidebar', handleToggle);
    return () => window.removeEventListener('toggle-sidebar', handleToggle);
  }, []);

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
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
      <Sidebar onLogout={handleLogout} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main className="flex-1 h-full overflow-hidden flex flex-col relative w-full">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/servicos" element={<Servicos />} />
          <Route path="/paginas" element={<Paginas />} />
          <Route path="/propostas" element={<Propostas />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/contratos" element={<Contratos />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/instagram" element={<InstagramGEM />} />
          <Route path="/projetos-no-ar" element={<ProjetosNoAr />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/prospect" element={<Prospect />} />
        </Routes>
      </main>
    </div>
  );
}
