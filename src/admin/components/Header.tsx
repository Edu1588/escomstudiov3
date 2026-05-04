import React from "react";
import { Bell, Calendar, Plus } from "lucide-react";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <div className="h-20 border-b border-[#1a1a1a] flex items-center justify-between px-8 shrink-0 bg-[#0a0a0a]/50 backdrop-blur-sm z-10 sticky top-0">
      <h1 className="text-xl font-bold text-white">{title}</h1>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#333] px-3 py-1.5 rounded-lg text-xs text-gray-400 font-mono">
          <Calendar size={14} className="text-[#2EFF00]" />
          <span>01 Mar, 2026 - 31 Mar, 2026</span>
          <span className="text-gray-600 ml-1">v</span>
        </div>
        <button className="text-gray-400 hover:text-white relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-[#2EFF00] rounded-full border border-black"></span>
        </button>
        <button className="bg-[#2EFF00] hover:bg-[#28e600] text-black font-bold text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={16} />
          Nova Proposta
        </button>
      </div>
    </div>
  );
}
