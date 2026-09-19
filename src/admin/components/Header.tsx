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
    <div className="border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between px-4 md:px-8 py-4 shrink-0 bg-[#000000]/80 backdrop-blur-md z-10 sticky top-0 gap-4">
      <div className="flex items-center gap-3">
        <button className="xl:hidden text-white/60 hover:text-white" onClick={toggleSidebar}>
          <Menu size={20} />
        </button>
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-light text-white tracking-tight">
            {title || "Olá, Eduardo"}
          </h1>
          {subtitle && (
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/50 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 self-end md:self-auto">
        {/* Selector de Período */}
        <div className="flex items-center gap-2 bg-[#09090b] border border-white/10 px-3 py-1.5 font-mono text-[11px] text-white/70 hover:border-cyan/40 hover:text-white transition-colors cursor-pointer">
          <Calendar size={13} className="text-cyan" />
          <span className="uppercase tracking-[0.06em]">{dateStr}</span>
          <ChevronDown size={12} className="text-white/40 ml-1" />
        </div>
        
        {/* Notificações */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)} 
            className="w-8 h-8 bg-[#09090b] border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-cyan/40 transition-colors relative outline-none"
          >
            <Bell size={15} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-cyan rounded-full"></span>
          </button>
          
          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-72 bg-[#09090b] border border-white/10 shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                <h3 className="font-mono text-[10px] uppercase tracking-[0.14em] text-white">Notificações</h3>
                <span className="font-mono text-[9px] bg-cyan/10 text-cyan border border-cyan/30 px-2 py-0.5 font-semibold">1 Nova</span>
              </div>
              <div className="space-y-2">
                <div className="p-2.5 bg-white/[0.02] border border-white/10">
                  <div className="font-serif text-xs font-medium text-white">Novo Lead Gerado</div>
                  <div className="font-mono text-[10px] text-white/50 mt-1">Lead interessado em Página Inicial.</div>
                  <div className="font-mono text-[9px] text-cyan mt-1">Há 10 minutos</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Botão Nova Proposta */}
        <button 
          onClick={handleNovaProposta} 
          className="bg-[#00d1ff] hover:bg-[#00b8e6] text-black font-mono text-[11px] uppercase tracking-[0.12em] font-bold px-4 py-2 flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap shadow-[0_0_15px_rgba(0,209,255,0.35)]"
        >
          <Plus size={14} strokeWidth={2.5} className="text-black" />
          <span className="text-black font-bold">Nova Proposta</span>
        </button>
      </div>
    </div>
  );
}
