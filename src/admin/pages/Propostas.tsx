import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { FileText, ArrowRight, FileSignature, Copy, CheckCircle2, Trash2 } from "lucide-react";

export default function Propostas() {
  const [services, setServices] = useState<any[]>([]);

  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [formData, setFormData] = useState({ clientName: "", phone: "", company: "", observations: "" });
  const [loading, setLoading] = useState(false);
  const [propostas, setPropostas] = useState<any[]>([]);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [extraPages, setExtraPages] = useState(0);
  const [additionalPercentage, setAdditionalPercentage] = useState(0);

  useEffect(() => {
    fetchServices();
    fetchPropostas();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/services");
      if (res.ok) {
        const data = await res.json();
        // optionally filter for only active services
        setServices(data.services.filter((s:any) => s.active));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPropostas = async () => {
    try {
      const res = await fetch("/api/proposals");
      if (res.ok) {
        const data = await res.json();
        const sorted = data.proposals.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setPropostas(sorted);
      }
    } catch (error) {
      console.error("Erro ao buscar propostas", error);
    }
  };

  const formatDate = (date: any) => {
    if (!date) return "--";
    const d = new Date(date);
    return isNaN(d.getTime()) ? String(date) : d.toLocaleDateString('pt-BR');
  };

  const toggleService = (id: number) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter(s => s !== id));
      if (id === 2) setExtraPages(0);
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const calculateFinalTotal = () => {
    let base = 0;
    selectedServices.forEach(id => {
      const service = services.find(s => s.id === id);
      if (service) {
        base += service.price;
        if (id === 2 && extraPages > 0) {
          base += extraPages * 300;
        }
      }
    });

    if (additionalPercentage > 0) {
      base = base + (base * (additionalPercentage / 100));
    }

    return base.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  };

  const handleGenerate = async () => {
    setError(null);
    if (!formData.company) {
      setError("O nome da empresa é obrigatório.");
      return;
    }
    
    setLoading(true);
    try {
        const formattedServices = selectedServices.map(id => {
          const service = services.find(s => s.id === id)!;
          let finalPrice = service.price;
          let finalName = service.name;
          
          if (id === 2 && extraPages > 0) {
            finalPrice += extraPages * 300;
            finalName += ` + ${extraPages} página(s)`;
          }

          if (additionalPercentage > 0) {
            finalPrice = finalPrice + (finalPrice * (additionalPercentage / 100));
          }

          const priceStr = finalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
          return { id: service.id, name: finalName, price: priceStr };
        });

        const finalBudgetStr = calculateFinalTotal();

        const payload = {
            ...formData,
            budget: finalBudgetStr,
            selectedServices: formattedServices
        };
        const res = await fetch("/api/proposals", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            const data = await res.json();
            alert(`Proposta gerada! Link: /${data.slug}`);
            setFormData({ clientName: "", phone: "", company: "", observations: "" });
            setSelectedServices([]);
            setExtraPages(0);
            setAdditionalPercentage(0);
            fetchPropostas();
        } else {
            const error = await res.json();
            alert(error.error || "Erro ao gerar");
        }
    } catch (error) {
        console.error(error);
        alert("Erro de conexão.");
    } finally {
        setLoading(false);
    }
  };

  const calculateTotalStr = (servicesItems: any[], customBudget: string) => {
    if (customBudget) {
      if (customBudget.includes(',')) return `R$ ${customBudget}`;
      return `R$ ${customBudget},00`;
    }
    const total = servicesItems.reduce((acc, curr) => acc + parseFloat(curr.price.replace(".", "")), 0);
    return `R$ ${(total).toLocaleString('pt-BR')},00`;
  };

  const copyToClipboard = (slug: string) => {
      const url = `${window.location.origin}/${slug}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(slug);
      setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja apagar esta proposta?")) return;
    
    try {
      const res = await fetch(`/api/proposals/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPropostas(propostas.filter(p => p.id !== id));
      } else {
        alert("Erro ao apagar proposta.");
      }
    } catch (e) {
      console.error(e);
      alert("Erro de conexão.");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto w-full">
      <Header title="Análise Geral" />
      <div className="p-4 md:p-8 max-w-[1000px] mx-auto mt-2 md:mt-4 space-y-6">
        
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4 md:p-8">
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
              <input type="text" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} placeholder="Ex: João Silva" className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2EFF00] transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] text-gray-500 font-mono tracking-widest mb-2">WHATSAPP DO CLIENTE</label>
              <input type="text" value={formData.phone} onChange={e => {
                const val = e.target.value.replace(/[^0-9+\-()\s]/g, '');
                setFormData({...formData, phone: val});
              }} placeholder="Ex: 5548988626785" className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2EFF00] transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] text-gray-500 font-mono tracking-widest mb-2">EMPRESA *</label>
              <input type="text" value={formData.company} onChange={e => { setFormData({...formData, company: e.target.value}); if (error) setError(null); }} placeholder="Ex: TechCorp Ltda" className={`w-full bg-[#111] border ${error ? 'border-red-500 focus:border-red-500' : 'border-[#333] focus:border-[#2EFF00]'} rounded-lg px-4 py-3 text-white focus:outline-none transition-colors`} />
              {error && <span className="text-red-500 text-xs mt-1 block">{error}</span>}
            </div>
            <div>
              <label className="block text-[10px] text-gray-500 font-mono tracking-widest mb-2">PORCENTAGEM ADICIONAL (%)</label>
              <div className="relative">
                <input 
                  type="text" 
                  inputMode="numeric" 
                  value={additionalPercentage === 0 ? "" : additionalPercentage} 
                  onChange={e => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setAdditionalPercentage(Number(val));
                  }} 
                  placeholder="0" 
                  className="w-full bg-[#111] border border-[#333] rounded-lg pl-4 pr-12 py-3 text-white focus:outline-none focus:border-[#2EFF00] transition-colors font-mono" 
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono font-bold">%</span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-[10px] text-gray-500 font-mono tracking-widest mb-4">SERVIÇOS SELECIONADOS</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map(service => (
                <div key={service.id} className="flex flex-col gap-2">
                  <div 
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
                      {service.description && <div className="text-[10px] text-gray-400 mt-1 line-clamp-2">{service.description}</div>}
                      <div className="text-[11px] text-gray-500 mt-0.5">Preço base: <span className="text-[#2EFF00] font-mono">R$ {service.price.toLocaleString('pt-BR')}</span></div>
                    </div>
                  </div>
                  {service.id === 2 && selectedServices.includes(2) && (
                     <div className="pl-4 border-l-2 border-[#2EFF00]/30 ml-4 mb-2 flex items-center justify-between">
                        <label className="text-xs text-gray-400">Páginas extras (+ R$ 300 cada):</label>
                        <div className="flex items-center bg-[#1a1a1a] border border-[#333] rounded-lg overflow-hidden">
                           <button onClick={(e) => { e.stopPropagation(); setExtraPages(Math.max(0, extraPages - 1))}} className="px-3 py-1 hover:bg-[#333] transition-colors text-gray-400 text-lg leading-none">-</button>
                           <div className="w-8 text-center text-xs font-mono text-white">{extraPages}</div>
                           <button onClick={(e) => { e.stopPropagation(); setExtraPages(extraPages + 1)}} className="px-3 py-1 hover:bg-[#333] transition-colors text-gray-400 text-lg leading-none">+</button>
                        </div>
                     </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-8 bg-[#111] border border-[#333] rounded-lg p-6 flex flex-col items-center justify-center">
            <label className="block text-[10px] text-gray-500 font-mono tracking-widest mb-1 text-center">ORÇAMENTO TOTAL ESTIMADO</label>
            <div className="text-4xl font-black text-[#2EFF00] mt-2 mb-2">R$ {calculateFinalTotal()}</div>
            <div className="text-xs text-gray-500 text-center">Valor auto-calculado com base aos serviços e +{additionalPercentage}% repasse</div>
          </div>

          <div className="mb-8">
            <label className="block text-[10px] text-gray-500 font-mono tracking-widest mb-2">OBSERVAÇÕES ADICIONAIS</label>
            <textarea value={formData.observations} onChange={e => setFormData({...formData, observations: e.target.value})} placeholder="Detalhes específicos do projeto..." className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white min-h-[120px] resize-y focus:outline-none focus:border-[#2EFF00] transition-colors"></textarea>
          </div>

          <div className="flex justify-end items-center gap-4 pt-4 border-t border-[#1a1a1a]">
            <button onClick={() => {setFormData({ clientName: "", phone: "", company: "", observations: "" }); setSelectedServices([]); setExtraPages(0); setAdditionalPercentage(0);}} className="text-gray-400 hover:text-white px-4 py-2 font-medium transition-colors text-sm">Limpar</button>
            <button onClick={handleGenerate} disabled={loading} className="flex items-center gap-2 bg-[#2EFF00] hover:bg-[#28e600] disabled:opacity-50 text-black px-6 py-3 rounded-lg font-bold transition-colors">
              <ArrowRight size={18} />
              {loading ? "Gerando..." : "Gerar Link da Proposta"}
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
              {propostas.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    <FileSignature size={32} className="mx-auto mb-4 opacity-20" />
                    <p className="text-sm">Nenhuma proposta gerada ainda.</p>
                  </td>
                </tr>
              )}
              {propostas.map(p => (
                <tr key={p.id} className="border-b border-[#1a1a1a] hover:bg-[#111] transition-colors">
                  <td className="py-4">
                    <div className="font-bold">{p.company}</div>
                    <div className="text-xs text-gray-500">{p.clientName}</div>
                  </td>
                  <td className="py-4 text-[#2EFF00] font-mono">{calculateTotalStr(p.selectedServices, p.budget)}</td>
                  <td className="py-4 text-center text-gray-400">{formatDate(p.createdAt)}</td>
                  <td className="py-4 text-center">
                    <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded text-[10px] font-bold">ATIVA</span>
                  </td>
                  <td className="py-4 text-right flex justify-end gap-2">
                    <button onClick={() => copyToClipboard(p.id)} className="p-2 bg-[#111] border border-[#333] hover:border-gray-500 flex items-center justify-center rounded transition-colors text-white" title="Copiar Link">
                      {copiedLink === p.id ? <CheckCircle2 size={16} className="text-[#2EFF00]" /> : <Copy size={16} />}
                    </button>
                    <a href={`/${p.id}`} target="_blank" rel="noreferrer" className="p-2 bg-[#111] border border-[#333] hover:border-[#2EFF00] hover:text-[#2EFF00] flex items-center justify-center rounded transition-colors text-white" title="Abrir Proposta">
                      <ArrowRight size={16} />
                    </a>
                    <button onClick={() => handleDelete(p.id)} className="p-2 bg-[#111] border border-[#333] hover:border-red-500 hover:text-red-500 flex items-center justify-center rounded transition-colors text-white" title="Apagar Proposta">
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
