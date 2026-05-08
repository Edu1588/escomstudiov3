import React, { useState } from "react";
import { Bell, Calendar, Plus, Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
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
      // We are already on the page, force a reload to clear everything
      window.location.reload();
    } else {
      navigate("/propostas");
    }
  };

  const toggleSidebar = () => {
    window.dispatchEvent(new CustomEvent('toggle-sidebar'));
  };

  return (
    <div className="h-20 border-b border-[#1a1a1a] flex items-center justify-between px-4 md:px-8 shrink-0 bg-[#0a0a0a]/50 backdrop-blur-sm z-10 sticky top-0">
      <div className="flex items-center gap-3">
        <button className="md:hidden text-gray-400 hover:text-white" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold text-white truncate max-w-[150px] md:max-w-none">{title}</h1>
      </div>
      <div className="flex items-center gap-3 md:gap-6">
        <div className="hidden md:flex items-center gap-2 bg-[#1a1a1a] border border-[#333] px-3 py-1.5 rounded-lg text-xs text-gray-400 font-mono">
          <Calendar size={14} className="text-[#2EFF00]" />
          <span className="capitalize">{dateStr}</span>
          <span className="text-gray-600 ml-1">v</span>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)} 
            className="text-gray-400 hover:text-white relative outline-none"
          >
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-[#2EFF00] rounded-full border border-black"></span>
          </button>
          
          {showNotifications && (
            <div className="absolute top-full right-[-50px] md:right-0 mt-2 w-64 bg-[#111] border border-[#333] rounded-xl shadow-2xl p-4 z-50">
              <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-3">Notificações</h3>
              <div className="text-gray-500 text-sm italic text-center py-4">
                Nenhuma nova notificação
              </div>
            </div>
          )}
        </div>

        <button onClick={handleNovaProposta} className="bg-[#2EFF00] hover:bg-[#28e600] text-black font-bold text-sm px-3 md:px-4 py-2 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap">
          <Plus size={16} />
          <span className="hidden md:inline">Nova Proposta</span>
        </button>
      </div>
    </div>
  );
}

