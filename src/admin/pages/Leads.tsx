import React from "react";
import { Header } from "../components/Header";
import { Plus, Trash2, ChevronDown } from "lucide-react";

export default function Leads() {
  const leads = [
    { id: 1, nome: "Clínica Brasil Dentistas", email: "contato@clinicabrasildentistas.com.br", origem: "Site", data: "08/04/2026", status: "NOVO" },
    { id: 2, nome: "Clínica Odontológica OralDents", email: "contato@oraldents.com.br", origem: "Site", data: "08/04/2026", status: "NOVO" },
  ];

  return (
    <div className="flex-1 overflow-y-auto w-full">
      <Header title="Análise Geral" />
      <div className="p-8 max-w-[1200px] mx-auto mt-4 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6">
            <div className="text-[10px] text-gray-500 font-mono tracking-widest mb-2">LEADS ATIVOS</div>
            <div className="text-3xl font-bold text-white mb-2">2</div>
            <div className="text-[11px] font-mono text-[#2EFF00] flex items-center gap-1">
              <span>↗</span> Em progressão
            </div>
          </div>
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6">
            <div className="text-[10px] text-gray-500 font-mono tracking-widest mb-2">PROPOSTAS ENVIADAS</div>
            <div className="text-3xl font-bold text-white mb-2">0</div>
            <div className="text-[11px] font-mono text-gray-500 flex items-center gap-1">
              Total histórico
            </div>
          </div>
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6">
            <div className="text-[10px] text-gray-500 font-mono tracking-widest mb-2">TAXA DE CONVERSÃO</div>
            <div className="text-3xl font-bold text-white mb-2">0%</div>
            <div className="text-[11px] font-mono text-gray-500 flex items-center gap-1">
              Propostas aceitas
            </div>
          </div>
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6">
            <div className="text-[10px] text-gray-500 font-mono tracking-widest mb-2">PIPELINE TOTAL</div>
            <div className="text-3xl font-bold text-[#2EFF00] mb-2">R$ 0</div>
            <div className="text-[11px] font-mono text-gray-500 flex items-center gap-1">
              Volume em negociação
            </div>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold">Gestão de Leads</h2>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Exportar CSV
              </button>
              <button className="flex items-center gap-2 bg-[#2EFF00] hover:bg-[#28e600] text-black px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                <Plus size={16} />
                Novo Lead
              </button>
            </div>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] text-gray-500 font-mono text-left border-b border-[#1a1a1a]">
                <th className="pb-3 font-medium">NOME / CONTATO</th>
                <th className="pb-3 font-medium">ORIGEM</th>
                <th className="pb-3 font-medium">INTERESSE</th>
                <th className="pb-3 font-medium">DATA</th>
                <th className="pb-3 font-medium text-right">STATUS</th>
                <th className="pb-3 font-medium text-right">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-[#1a1a1a]/50">
                  <td className="py-4">
                    <div className="font-bold text-white mb-0.5">{lead.nome}</div>
                    <div className="text-[11px] text-gray-500">{lead.email}</div>
                  </td>
                  <td className="py-4 text-gray-300">{lead.origem}</td>
                  <td className="py-4 text-gray-300">-</td>
                  <td className="py-4 text-gray-300">{lead.data}</td>
                  <td className="py-4 text-right">
                    <div className="inline-flex items-center gap-4 bg-[#111] border border-[#333] rounded px-3 py-1.5 cursor-pointer">
                      <span className="text-xs font-medium text-gray-300">{lead.status}</span>
                      <ChevronDown size={14} className="text-gray-500" />
                    </div>
                  </td>
                  <td className="py-4 text-right pl-4">
                    <button className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
