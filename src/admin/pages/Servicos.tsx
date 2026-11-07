import React, { useState } from "react";
import { Header } from "../components/Header";
import { Settings, Trash2, RotateCcw, Plus, X } from "lucide-react";

interface Service {
  id: number | string;
  name: string;
  price: string;
  active: boolean;
  description?: string;
  recorrencia?: "unico" | "mensal";
  precoPaginaExtra?: string;
}

const brl = (v: string | number) => {
  const n = Number(v);
  return Number.isFinite(n) ? n.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : String(v);
};

export default function Servicos() {
  const [services, setServices] = useState<Service[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<number | string | null>(null);

  React.useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/services");
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const data = await res.json();
        // Convert prices to string to match the local interface easily
        const formatted = data.services.map((s: any) => ({
          ...s,
          price: s.price.toString(),
          precoPaginaExtra: String(s.precoPaginaExtra ?? 0),
          recorrencia: s.recorrencia === "mensal" ? "mensal" : "unico"
        }));
        setServices(formatted);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleStatus = async (id: number | string) => {
    const service = services.find(s => s.id === id);
    if (!service) return;
    
    // Optimistic update
    setServices(services.map(s => 
      s.id === id ? { ...s, active: !s.active } : s
    ));

    try {
      await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...service, active: !service.active })
      });
      fetchServices();
    } catch (e) {
      console.error(e);
    }
  };

  const handleNewService = () => {
    setEditingService({ id: Date.now(), name: "", price: "", active: true, description: "", recorrencia: "unico", precoPaginaExtra: "0" });
    setIsModalOpen(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService({ ...service });
    setIsModalOpen(true);
  };

  const handleSaveService = async () => {
    if (!editingService) return;
    
    // Optimistic update
    if (services.find((s) => s.id === editingService.id)) {
        setServices(services.map((s) => s.id === editingService.id ? editingService : s));
    } else {
        setServices([...services, editingService]);
    }
    setIsModalOpen(false);
    
    try {
      await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingService)
      });
      fetchServices();
    } catch (e) {
      console.error(e);
    }
    
    setEditingService(null);
  };

  const handleDelete = (id: number | string) => {
    setServiceToDelete(id);
  };

  const confirmDelete = async () => {
    if (serviceToDelete !== null) {
      // Optimistic update
      setServices(services.filter((s) => s.id !== serviceToDelete));
      const id = serviceToDelete;
      setServiceToDelete(null);

      try {
        await fetch(`/api/services/${id}`, {
          method: "DELETE"
        });
        fetchServices();
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="flex-1 overflow-y-auto w-full relative">
      <Header title="Serviços" />
      <div className="p-8 max-w-[1000px] mx-auto mt-4">
        
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold">Valores & Serviços</h2>
            <div className="flex gap-4">
              
              <button onClick={() => { setEditingService({ id: 0, name: "", price: "", active: true, description: "", recorrencia: "unico", precoPaginaExtra: "0" }); handleNewService(); }} className="flex items-center gap-2 bg-[#00d1ff] hover:bg-[#00b8e6] text-black px-4 py-2 rounded-lg text-sm font-bold transition-colors">
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
                    className={`w-12 h-6 rounded-full cursor-pointer relative transition-colors ${service.active ? 'bg-[#00d1ff]' : 'bg-[#333]'}`}
                  >
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${service.active ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </div>
                  <div>
                    <div className={`font-medium ${service.active ? 'text-white' : 'text-gray-400'}`}>{service.name}</div>
                    {service.description && (
                      <div className="text-xs text-gray-500 mt-1 line-clamp-1">{service.description}</div>
                    )}
                    <div className="text-[10px] font-mono text-gray-500 uppercase mt-1">{service.active ? 'Ativo' : 'Inativo'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                     {Number(service.price) > 0 ? (
                       <>
                         <span className="text-xs font-mono text-gray-500">R$</span>
                         <span className={`font-mono font-medium ${service.active ? 'text-white' : 'text-gray-400'}`}>{brl(service.price)}</span>
                         {service.recorrencia === "mensal" && <span className="text-xs font-mono text-gray-500">/mês</span>}
                       </>
                     ) : (
                       <span className="text-xs font-mono text-amber-400">defina o preço</span>
                     )}
                  </div>
                  <div className="flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleDelete(service.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/10">
                      <Trash2 size={16} />
                    </button>
                    <button onClick={() => handleEditService(service)} className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10">
                      <Settings size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {isModalOpen && editingService && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111] border border-[#333] rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-[#333]">
              <h3 className="text-lg font-bold">
                {services.some(s => s.id === editingService.id) ? 'Editar Serviço' : 'Novo Serviço'}
              </h3>
              <button 
                onClick={() => { setIsModalOpen(false); setEditingService(null); }}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-mono text-gray-500 mb-1">NOME DO SERVIÇO</label>
                <input 
                  type="text" 
                  value={editingService.name}
                  onChange={(e) => setEditingService({...editingService, name: e.target.value})}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white outline-none focus:border-[#00d1ff] transition-colors"
                  placeholder="Ex: Landing Page"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-500 mb-1">DESCRIÇÃO DO SERVIÇO</label>
                <textarea 
                  value={editingService.description || ""}
                  onChange={(e) => setEditingService({...editingService, description: e.target.value})}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white outline-none focus:border-[#00d1ff] transition-colors min-h-[80px]"
                  placeholder="Ex: Página com foco em conversão"
                />
              </div>
              
              <div>
                <label className="block text-xs font-mono text-gray-500 mb-1">VALOR (R$)</label>
                <input 
                  type="text" 
                  value={editingService.price}
                  onChange={(e) => setEditingService({...editingService, price: e.target.value})}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white outline-none focus:border-[#00d1ff] transition-colors"
                  placeholder="Ex: 2.500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-500 mb-1">COBRANÇA</label>
                <select
                  value={editingService.recorrencia || "unico"}
                  onChange={(e) => setEditingService({...editingService, recorrencia: e.target.value as "unico" | "mensal"})}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white outline-none focus:border-[#00d1ff] transition-colors"
                >
                  <option value="unico">Valor único (projeto)</option>
                  <option value="mensal">Mensalidade (recorrente)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-500 mb-1">PÁGINA EXTRA (R$ por página, 0 = não se aplica)</label>
                <input
                  type="text"
                  value={editingService.precoPaginaExtra ?? "0"}
                  onChange={(e) => setEditingService({...editingService, precoPaginaExtra: e.target.value})}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-white outline-none focus:border-[#00d1ff] transition-colors"
                  placeholder="Ex: 300"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-sm">Status Ativo</span>
                <div 
                  onClick={() => setEditingService({...editingService, active: !editingService.active})}
                  className={`w-12 h-6 rounded-full cursor-pointer relative transition-colors ${editingService.active ? 'bg-[#00d1ff]' : 'bg-[#333]'}`}
                >
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${editingService.active ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#0a0a0a] border-t border-[#333] flex justify-end gap-3">
              <button 
                onClick={() => { setIsModalOpen(false); setEditingService(null); }}
                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveService}
                disabled={!editingService.name || !editingService.price}
                className="px-4 py-2 text-sm font-bold bg-[#00d1ff] text-black rounded-lg hover:bg-[#00b8e6] disabled:opacity-50 transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {serviceToDelete !== null && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111] border border-[#333] rounded-xl shadow-xl w-full max-w-sm overflow-hidden text-center p-6">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Excluir Serviço?</h3>
            <p className="text-gray-400 text-sm mb-6">Esta ação não pode ser desfeita. Tem certeza que deseja remover este serviço da lista?</p>
            <div className="flex gap-3 justify-center">
               <button 
                onClick={() => setServiceToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                Cancelar
               </button>
               <button 
                onClick={confirmDelete}
                className="px-6 py-2 text-sm font-bold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                >
                Sim, Excluir
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
