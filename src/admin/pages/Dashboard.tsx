import React from "react";
import { Header } from "../components/Header";
import { DollarSign, MousePointerClick, Users, FileSignature } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: '20/04', value: 2 },
  { name: '21/04', value: 1 },
  { name: '22/04', value: 17 },
  { name: '23/04', value: 16 },
  { name: '24/04', value: 6 },
  { name: '25/04', value: 1 },
  { name: '26/04', value: 1 },
  { name: '27/04', value: 5 },
  { name: '28/04', value: 5 },
  { name: '29/04', value: 10 },
  { name: '30/04', value: 16 },
  { name: '01/05', value: 1 },
  { name: '02/05', value: 12 },
  { name: '03/05', value: 1 },
  { name: '04/05', value: 3 },
];

export default function Dashboard() {
  return (
    <div className="flex-1 overflow-y-auto w-full">
      <Header title="Análise Geral" />
      <div className="p-8 max-w-[1400px] mx-auto space-y-6">
        
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm text-gray-400">Receita Estimada</span>
              <div className="w-8 h-8 rounded-lg bg-[#2EFF00]/10 flex items-center justify-center text-[#2EFF00]">
                <DollarSign size={16} />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">R$ 0</div>
            <div className="text-[11px] font-mono text-[#2EFF00] flex items-center gap-1">
              <span>~</span> Baseado em propostas aceitas
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm text-gray-400">Acessos nas Páginas</span>
              <div className="w-8 h-8 rounded-lg bg-[#2EFF00]/10 flex items-center justify-center text-[#2EFF00]">
                <MousePointerClick size={16} />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">575</div>
            <div className="text-[11px] font-mono text-[#2EFF00] flex items-center gap-1">
              <span>↗</span> Tempo real
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#2EFF00] to-transparent"></div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm text-gray-400">Novos Leads</span>
              <div className="w-8 h-8 rounded-lg bg-[#2EFF00]/10 flex items-center justify-center text-[#2EFF00]">
                <Users size={16} />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">2</div>
            <div className="text-[11px] font-mono text-[#2EFF00] flex items-center gap-1">
              <span>↗</span> +22% vs último mês
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm text-gray-400">Contratos Ativos</span>
              <div className="w-8 h-8 rounded-lg bg-[#2EFF00]/10 flex items-center justify-center text-[#2EFF00]">
                <FileSignature size={16} />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">0</div>
            <div className="text-[11px] font-mono text-[#2EFF00] flex items-center gap-1">
              <span>✓</span> 0 contratos total
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Dinâmica de Acessos & Leads</h3>
              <select className="bg-[#050505] border border-[#333] text-sm text-gray-400 rounded px-2 py-1 outline-none">
                <option>Últimos 30 dias</option>
              </select>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <XAxis dataKey="name" stroke="#333" fontSize={10} tickMargin={10} />
                  <YAxis stroke="#333" fontSize={10} tickFormatter={(value) => `${value}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', borderColor: '#2EFF00', borderRadius: '8px' }}
                    itemStyle={{ color: '#2EFF00' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#2EFF00" 
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6, fill: '#000', stroke: '#2EFF00', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6 flex flex-col">
            <h3 className="text-lg font-bold mb-6">Origem dos Leads</h3>
            <div className="flex-1 flex flex-col items-center justify-center relative">
              <div className="w-48 h-48 rounded-full border-[16px] border-[#1a1a1a] border-t-[#2EFF00] border-r-[#2EFF00] transform rotate-45 mb-8 flex items-center justify-center">
                 <div className="transform -rotate-45 text-center mt-[-30px] ml-[-30px]">
                    <div className="text-4xl font-bold">2</div>
                    <div className="text-[10px] text-gray-500 font-mono">TOTAL</div>
                 </div>
              </div>
              <div className="w-full flex justify-between px-4 border-t border-[#1a1a1a] pt-4 mt-auto">
                <div className="text-center">
                  <div className="text-lg font-bold flex flex-col items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#1a1a1a]"></span>
                    0%
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono mt-1">ORGÂNICO</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold flex flex-col items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#1a1a1a]"></span>
                    0%
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono mt-1">ADS</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold flex flex-col items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#2EFF00]"></span>
                    100%
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono mt-1">DIRETO</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Multi-Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Páginas em Monitoramento</h3>
              <button className="text-[#2EFF00] text-sm font-medium hover:underline">Ver todas</button>
            </div>
            
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] text-gray-500 font-mono text-left border-b border-[#1a1a1a]">
                  <th className="pb-3 font-medium">NOME DA PÁGINA</th>
                  <th className="pb-3 font-medium text-right">ACESSOS</th>
                  <th className="pb-3 font-medium text-right">LEADS</th>
                  <th className="pb-3 font-medium text-right">STATUS</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#1a1a1a]/50">
                  <td className="py-4 text-gray-300">Página Inicial (Home)</td>
                  <td className="py-4 text-right font-mono">190</td>
                  <td className="py-4 text-right font-mono text-[#2EFF00]">2</td>
                  <td className="py-4 text-right"><span className="bg-[#2EFF00]/10 text-[#2EFF00] px-2 py-1 inline-flex rounded text-[10px] font-bold">Ativo</span></td>
                </tr>
                <tr className="border-b border-[#1a1a1a]/50">
                  <td className="py-4 text-gray-300">Portfólio de Projetos</td>
                  <td className="py-4 text-right font-mono">5</td>
                  <td className="py-4 text-right font-mono text-[#2EFF00]">0</td>
                  <td className="py-4 text-right"><span className="bg-[#2EFF00]/10 text-[#2EFF00] px-2 py-1 inline-flex rounded text-[10px] font-bold">Ativo</span></td>
                </tr>
                <tr className="border-b border-[#1a1a1a]/50">
                  <td className="py-4 text-gray-300">Página de Propostas</td>
                  <td className="py-4 text-right font-mono">5</td>
                  <td className="py-4 text-right font-mono text-[#2EFF00]">0</td>
                  <td className="py-4 text-right"><span className="bg-[#2EFF00]/10 text-[#2EFF00] px-2 py-1 inline-flex rounded text-[10px] font-bold">Ativo</span></td>
                </tr>
                <tr>
                  <td className="py-4 text-gray-300">Portfolio EDU</td>
                  <td className="py-4 text-right font-mono">237</td>
                  <td className="py-4 text-right font-mono text-[#2EFF00]">0</td>
                  <td className="py-4 text-right"><span className="bg-[#2EFF00]/10 text-[#2EFF00] px-2 py-1 inline-flex rounded text-[10px] font-bold">Ativo</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Leads Recentes</h3>
              <button className="text-[#2EFF00] text-sm font-medium hover:underline">Ir para CRM</button>
            </div>
            
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] text-gray-500 font-mono text-left border-b border-[#1a1a1a]">
                  <th className="pb-3 font-medium w-1/2">CLIENTE</th>
                  <th className="pb-3 font-medium">INTERESSE</th>
                  <th className="pb-3 font-medium text-right">AÇÃO</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#1a1a1a]/50">
                  <td className="py-4">
                    <div className="text-gray-300 font-medium">Clínica Brasil Dentistas</div>
                    <div className="text-[11px] text-gray-500">contato@clinicabrasildentistas.com.br</div>
                  </td>
                  <td className="py-4">
                    {/* Empty interest logic mock */}
                  </td>
                  <td className="py-4 text-right">
                    <button className="bg-[#1a1a1a] text-gray-300 hover:text-white px-3 py-1.5 rounded text-xs border border-[#333] transition-colors">Gerar Proposta</button>
                  </td>
                </tr>
                <tr>
                  <td className="py-4">
                    <div className="text-gray-300 font-medium">Clínica Odontológica OralDents</div>
                    <div className="text-[11px] text-gray-500">contato@oraldents.com.br</div>
                  </td>
                  <td className="py-4">
                  </td>
                  <td className="py-4 text-right">
                    <button className="bg-[#1a1a1a] text-gray-300 hover:text-white px-3 py-1.5 rounded text-xs border border-[#333] transition-colors">Gerar Proposta</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
