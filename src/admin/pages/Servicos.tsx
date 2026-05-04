import React, { useState } from "react";
import { Header } from "../components/Header";
import { Settings, Trash2, RotateCcw, Plus } from "lucide-react";

export default function Servicos() {
  const [services, setServices] = useState([
    { id: 1, name: "Landing Page Alta Conversão", price: "2.200", active: true },
    { id: 2, name: "Site Completo (5 a 6 páginas)", price: "4.500", active: true },
    { id: 3, name: "E-commerce Básico", price: "6.500", active: true },
    { id: 4, name: "Gestão de Tráfego Mensal", price: "1.500", active: false },
    { id: 5, name: "Identidade Visual", price: "3.200", active: true },
  ]);

  const toggleStatus = (id: number) => {
    setServices(services.map(s => 
      s.id === id ? { ...s, active: !s.active } : s
    ));
  };

  return (
    <div className="flex-1 overflow-y-auto w-full">
      <Header title="Análise Geral" />
      <div className="p-8 max-w-[1000px] mx-auto mt-4">
        
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold">Valores & Serviços</h2>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <RotateCcw size={16} />
                Restaurar Padrões
              </button>
              <button className="flex items-center gap-2 bg-[#2EFF00] hover:bg-[#28e600] text-black px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                <Plus size={16} />
                Novo Serviço
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {services.map((service) => (
              <div 
                key={service.id} 
                className="flex items-center justify-between p-4 bg-[#111] border border-[#1a1a1a] rounded-xl group hover:border-[#333] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div 
                    onClick={() => toggleStatus(service.id)}
                    className={`w-12 h-6 rounded-full cursor-pointer relative transition-colors ${service.active ? 'bg-[#2EFF00]' : 'bg-[#333]'}`}
                  >
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${service.active ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </div>
                  <div>
                    <div className={`font-medium ${service.active ? 'text-white' : 'text-gray-400'}`}>{service.name}</div>
                    <div className="text-[10px] font-mono text-gray-500 uppercase">{service.active ? 'Ativo' : 'Inativo'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                     <span className="text-xs font-mono text-gray-500">R$</span>
                     <span className={`font-mono font-medium ${service.active ? 'text-white' : 'text-gray-400'}`}>{service.price}</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/10">
                      <Trash2 size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10">
                      <Settings size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
