import React, { useState } from "react";
import { Header } from "../components/Header";
import { FileText, ArrowRight, FileSignature } from "lucide-react";

export default function Propostas() {
  const services = [
    { id: 1, name: "Landing Page Alta Conversão", price: "2.200" },
    { id: 2, name: "Site Completo (5 a 6 páginas)", price: "4.500" },
    { id: 3, name: "E-commerce Básico", price: "6.500" },
    { id: 4, name: "Gestão de Tráfego Mensal", price: "1.500" },
    { id: 5, name: "Identidade Visual", price: "3.200" },
  ];

  const [selectedServices, setSelectedServices] = useState<number[]>([]);

  const toggleService = (id: number) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter(s => s !== id));
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto w-full">
      <Header title="Análise Geral" />
      <div className="p-8 max-w-[1000px] mx-auto mt-4 space-y-6">
        
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-8">
          <div className="flex items-center justify-center flex-col text-center mb-10">
            <div className="w-12 h-12 rounded-xl bg-[#2EFF00]/10 text-[#2EFF00] flex items-center justify-center mb-4">
               <FileText size={24} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Gerador de Propostas</h2>
            <p className="text-gray-400 text-sm">Crie propostas comerciais profissionais em segundos.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-[10px] text-gray-500 font-mono tracking-widest mb-2">NOME DO CLIENTE</label>
              <input type="text" placeholder="Ex: João Silva" className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2EFF00] transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] text-gray-500 font-mono tracking-widest mb-2">WHATSAPP DO CLIENTE</label>
              <input type="text" placeholder="Ex: 5548988626785" className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2EFF00] transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] text-gray-500 font-mono tracking-widest mb-2">EMPRESA</label>
              <input type="text" placeholder="Ex: TechCorp Ltda" className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2EFF00] transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] text-gray-500 font-mono tracking-widest mb-2">ORÇAMENTO TOTAL (PERSONALIZADO)</label>
              <input type="text" placeholder="Vazio para somar serviços" className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2EFF00] transition-colors" />
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-[10px] text-gray-500 font-mono tracking-widest mb-4">SERVIÇOS SELECIONADOS</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map(service => (
                <div 
                  key={service.id} 
                  onClick={() => toggleService(service.id)}
                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                    selectedServices.includes(service.id) ? 'bg-[#2EFF00]/5 border-[#2EFF00]/30' : 'bg-[#111] border-[#333] hover:border-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border flex flex-shrink-0 items-center justify-center transition-colors ${
                    selectedServices.includes(service.id) ? 'bg-[#2EFF00] border-[#2EFF00]' : 'bg-transparent border-gray-500'
                  }`}>
                    {selectedServices.includes(service.id) && <span className="text-black text-xs font-bold">✓</span>}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">{service.name}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">Preço: <span className="text-[#2EFF00] font-mono">R$ {service.price}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-[10px] text-gray-500 font-mono tracking-widest mb-2">OBSERVAÇÕES ADICIONAIS</label>
            <textarea placeholder="Detalhes específicos do projeto..." className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white min-h-[120px] resize-y focus:outline-none focus:border-[#2EFF00] transition-colors"></textarea>
          </div>

          <div className="flex justify-end items-center gap-4 pt-4 border-t border-[#1a1a1a]">
            <button className="text-gray-400 hover:text-white px-4 py-2 font-medium transition-colors text-sm">Limpar</button>
            <button className="flex items-center gap-2 bg-[#2EFF00] hover:bg-[#28e600] text-black px-6 py-3 rounded-lg font-bold transition-colors">
              <ArrowRight size={18} />
              Gerar Link da Proposta
            </button>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6">
          <h3 className="text-lg font-bold mb-6">Histórico de Propostas</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] text-gray-500 font-mono text-left border-b border-[#1a1a1a]">
                <th className="pb-3 font-medium">EMPRESA / CLIENTE</th>
                <th className="pb-3 font-medium">VALOR TOTAL</th>
                <th className="pb-3 font-medium text-center">DATA</th>
                <th className="pb-3 font-medium text-center">STATUS</th>
                <th className="pb-3 font-medium text-right">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {/* Empty state */}
            </tbody>
          </table>
          <div className="py-12 flex flex-col items-center justify-center text-gray-500">
            <FileSignature size={32} className="mb-4 opacity-20" />
            <p className="text-sm">Nenhuma proposta gerada ainda.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
