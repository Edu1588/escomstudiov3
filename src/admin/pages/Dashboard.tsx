import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { DollarSign, MousePointerClick, Users, FileSignature, Loader2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { db } from "../../lib/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [totalViews, setTotalViews] = useState(0);
  const [totalLeads, setTotalLeads] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [pagesData, setPagesData] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch page views
        const viewsSnap = await getDocs(collection(db, "page_views"));
        let views = 0;
        let pData: any[] = [];
        viewsSnap.forEach(d => {
          views += (d.data().viewCount || 0);
          pData.push({ id: d.id, ...d.data() });
        });

        setTotalViews(views);
        setPagesData(pData.sort((a,b) => b.viewCount - a.viewCount));

        // Fetch leads total count (mock or true from collection if any form submission logs them)
        const leadsSnap = await getDocs(collection(db, "leads"));
        setTotalLeads(leadsSnap.size);

        // Fetch chart data
        const dailySnap = await getDocs(collection(db, "daily_views"));
        const cData: any[] = [];
        dailySnap.forEach(d => {
          cData.push({ name: d.id.substring(5), fullDate: d.id, value: d.data().viewCount || 0 });
        });
        
        cData.sort((a,b) => a.fullDate.localeCompare(b.fullDate));
        setChartData(cData.slice(-30));
      } catch (error) {
        console.warn("Could not load analytics (permissions or disabled):", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="flex-1 overflow-y-auto w-full">
      <Header title="Análise Geral" />
      <div className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-4 md:space-y-6">
        
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
            <div className="text-3xl font-bold text-white mb-2">{totalViews}</div>
            <div className="text-[11px] font-mono text-[#2EFF00] flex items-center gap-1">
              <span>{loading ? <Loader2 size={12} className="animate-spin" /> : "↗"}</span> Tempo real
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
            <div className="text-3xl font-bold text-white mb-2">{totalLeads}</div>
            <div className="text-[11px] font-mono text-[#2EFF00] flex items-center gap-1">
              <span>{loading ? <Loader2 size={12} className="animate-spin" /> : "↗"}</span> Monitoramento ao vivo
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
            <div className="min-h-[250px] w-full">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
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
                    <div className="text-4xl font-bold">{totalLeads}</div>
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
              <button onClick={() => navigate('/paginas')} className="text-[#2EFF00] text-sm font-medium hover:underline cursor-pointer">Ver todas</button>
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
                {pagesData.length > 0 ? pagesData.map((page, idx) => (
                  <tr key={idx} className="border-b border-[#1a1a1a]/50">
                    <td className="py-4 text-gray-300">{page.id || 'Página Desconhecida'}</td>
                    <td className="py-4 text-right font-mono">{page.viewCount || 0}</td>
                    <td className="py-4 text-right font-mono text-[#2EFF00]">--</td>
                    <td className="py-4 text-right"><span className="bg-[#2EFF00]/10 text-[#2EFF00] px-2 py-1 inline-flex rounded text-[10px] font-bold">Ativo</span></td>
                  </tr>
                )) : (
                  <tr><td colSpan={4} className="py-4 text-center text-gray-500 font-mono">Nenhum acesso registrado</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Leads Recentes</h3>
              <button onClick={() => navigate('/leads')} className="text-[#2EFF00] text-sm font-medium hover:underline cursor-pointer">Ir para CRM</button>
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
