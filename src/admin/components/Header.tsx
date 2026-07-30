import React, { useState } from "react";
import { Bell, Calendar, Plus, Menu, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  
  const currentDate = new Date();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).replace(" de ", " ").replace(" de ", ", ").replace(".", "");
  };

  const dateStr = `${formatDate(firstDay)} - ${formatDate(lastDay)}`;

  const handleNovaProposta = () => {
    if (location.pathname === "/propostas") {
      window.location.reload();
    } else {
      navigate("/propostas");
    }
  };

  const toggleSidebar = () => {
    window.dispatchEvent(new CustomEvent('toggle-sidebar'));
  };

  return (
    <div className="border-b border-[#16233b] flex flex-col md:flex-row md:items-center justify-between px-4 md:px-8 py-4 shrink-0 bg-[#09101f]/80 backdrop-blur-md z-10 sticky top-0 gap-4">
      <div className="flex items-center gap-3">
        <button className="xl:hidden text-gray-400 hover:text-white" onClick={toggleSidebar}>
          <Menu size={22} />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            {title || "Olá, Eduardo! 👋"}
          </h1>
          {subtitle && (
            <p className="text-xs md:text-sm text-gray-400 mt-0.5 font-normal">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 self-end md:self-auto">
        {/* Selector de Período */}
        <div className="flex items-center gap-2 bg-[#0e172a] border border-[#1e2e4a] px-3 py-2 rounded-xl text-xs text-gray-300 font-medium hover:border-[#2b4168] transition-colors cursor-pointer">
          <Calendar size={15} className="text-[#3b82f6]" />
          <span className="capitalize">{dateStr}</span>
          <ChevronDown size={14} className="text-gray-500 ml-1" />
        </div>
        
        {/* Notificações */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)} 
            className="w-9 h-9 rounded-xl bg-[#0e172a] border border-[#1e2e4a] flex items-center justify-center text-gray-300 hover:text-white hover:border-[#2b4168] transition-colors relative outline-none"
          >
            <Bell size={17} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#3b82f6] rounded-full ring-2 ring-[#0e172a]"></span>
          </button>
          
          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-72 bg-[#0e172a] border border-[#1e2e4a] rounded-2xl shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between mb-3 border-b border-[#1b2b48] pb-2">
                <h3 className="text-white text-xs font-bold uppercase tracking-wider">Notificações</h3>
                <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-semibold">1 Nova</span>
              </div>
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-[#14223d] border border-[#1d3257]">
                  <div className="text-xs font-semibold text-white">Novo Lead Gerado! 🎉</div>
                  <div className="text-[11px] text-gray-400 mt-1">Lead interessado em Página Inicial (Home).</div>
                  <div className="text-[10px] text-blue-400 mt-1">Há 10 minutos</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Botão Nova Proposta */}
        <button 
          onClick={handleNovaProposta} 
          className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold text-xs md:text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-600/25 active:scale-95 whitespace-nowrap"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Nova Proposta</span>
        </button>
      </div>
    </div>
  );
}


