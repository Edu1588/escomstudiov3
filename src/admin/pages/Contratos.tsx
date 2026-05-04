import React, { useState } from "react";
import { Header } from "../components/Header";
import { Search, Plus, Clock } from "lucide-react";

export default function Contratos() {
  const [activeTab, setActiveTab] = useState("TUDO");
  const tabs = ["TUDO", "PENDENTES", "ATIVOS", "FINALIZADOS"];

  return (
    <div className="flex-1 overflow-y-auto w-full">
      <Header title="Análise Geral" />
      <div className="p-8 max-w-[1200px] mx-auto mt-4">
        
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-tight">Gestão de Contratos</h2>
            <p className="text-gray-400 text-sm mt-1">Visualize e gerencie todos os compromissos ativos do estúdio.</p>
          </div>
          <button className="flex items-center gap-2 bg-[#2EFF00] hover:bg-[#28e600] text-black px-4 py-2 rounded-lg text-sm font-bold transition-colors">
            <Plus size={16} />
            NOVO CONTRATO
          </button>
        </div>

        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#1a1a1a] flex items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Buscar por cliente ou empresa..." 
                className="w-full bg-[#111] border border-[#333] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#2EFF00] transition-colors"
              />
            </div>
            
            <div className="flex items-center gap-2">
              {tabs.map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded text-xs font-mono tracking-wider transition-colors ${
                    activeTab === tab ? 'bg-[#1a1a1a] text-white border border-[#333]' : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] text-gray-500 font-mono tracking-widest text-left border-b border-[#1a1a1a]">
                <th className="px-6 py-4 font-medium">CLIENTE/EMPRESA</th>
                <th className="px-6 py-4 font-medium">VALOR PROJETO</th>
                <th className="px-6 py-4 font-medium">DATA INÍCIO / PRAZO</th>
                <th className="px-6 py-4 font-medium text-center">STATUS</th>
                <th className="px-6 py-4 font-medium text-right">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {/* Empty state handles rendering */}
            </tbody>
          </table>
          <div className="py-24 flex flex-col items-center justify-center text-gray-500">
            <Clock size={32} className="mb-4 opacity-30" />
            <p className="text-xs font-mono tracking-widest uppercase">Carregando contratos...</p>
          </div>
        </div>

      </div>
    </div>
  );
}
