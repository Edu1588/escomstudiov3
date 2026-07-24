import React, { useState } from "react";
import { Calendar, Clock, Phone, MapPin, User, Plus, Check, X } from "lucide-react";

export default function Agendamentos() {
  const [agendamentos, setAgendamentos] = useState<any[]>([
    {
      id: "ag-1",
      leadNome: "CI Odontologia",
      data: "2026-07-28",
      hora: "14:00",
      tipo: "Apresentação",
      telefone: "(11) 99753-3611",
      status: "Confirmado",
      notas: "Apresentar dossiê estratégico e LP de 15 seções"
    },
    {
      id: "ag-2", 
      leadNome: "YOKOTA & XAVIER Dentista",
      data: "2026-07-30",
      hora: "10:30",
      tipo: "Follow Up",
      telefone: "(11) 98765-4321",
      status: "Pendente",
      notas: "Retorno sobre proposta enviada"
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newAg, setNewAg] = useState({ leadNome: "", data: "", hora: "", tipo: "Apresentação", telefone: "", notas: "" });

  const handleAddAgendamento = () => {
    if (!newAg.leadNome || !newAg.data || !newAg.hora) return;
    setAgendamentos(prev => [...prev, { ...newAg, id: `ag-${Date.now()}`, status: "Pendente" }]);
    setNewAg({ leadNome: "", data: "", hora: "", tipo: "Apresentação", telefone: "", notas: "" });
    setShowForm(false);
  };

  const handleUpdateStatus = (id: string, status: string) => {
    setAgendamentos(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const getStatusColor = (status: string) => {
    if (status === "Confirmado") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400";
    if (status === "Cancelado") return "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400";
    return "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400";
  };

  return (
    <div className="flex-1 overflow-y-auto w-full bg-[#f8fafc] dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 min-h-screen p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Agendamentos</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Gerencie reuniões e apresentações com seus leads</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-2"
        >
          <Plus size={16} /> Novo Agendamento
        </button>
      </div>

      {/* FORMULÁRIO DE NOVO AGENDAMENTO */}
      {showForm && (
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">Novo Agendamento</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Nome do Lead"
              value={newAg.leadNome}
              onChange={(e) => setNewAg({ ...newAg, leadNome: e.target.value })}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="date"
              value={newAg.data}
              onChange={(e) => setNewAg({ ...newAg, data: e.target.value })}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="time"
              value={newAg.hora}
              onChange={(e) => setNewAg({ ...newAg, hora: e.target.value })}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Telefone"
              value={newAg.telefone}
              onChange={(e) => setNewAg({ ...newAg, telefone: e.target.value })}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <select
              value={newAg.tipo}
              onChange={(e) => setNewAg({ ...newAg, tipo: e.target.value })}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option>Apresentação</option>
              <option>Follow Up</option>
              <option>Reunião de Fechamento</option>
              <option>Entrega de Projeto</option>
            </select>
            <input
              type="text"
              placeholder="Notas"
              value={newAg.notas}
              onChange={(e) => setNewAg({ ...newAg, notas: e.target.value })}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setShowForm(false)} className="text-slate-500 text-sm font-medium px-4 py-2">Cancelar</button>
            <button onClick={handleAddAgendamento} className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-5 py-2 rounded-xl">Salvar</button>
          </div>
        </div>
      )}

      {/* LISTA DE AGENDAMENTOS */}
      <div className="space-y-4">
        {agendamentos.length === 0 ? (
          <div className="text-center py-16 text-slate-400">Nenhum agendamento cadastrado.</div>
        ) : (
          agendamentos.map(ag => (
            <div key={ag.id} className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">{ag.leadNome}</h4>
                    <div className="flex items-center gap-4 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(ag.data).toLocaleDateString("pt-BR")}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {ag.hora}</span>
                      <span className="flex items-center gap-1"><User size={12} /> {ag.tipo}</span>
                      {ag.telefone && <span className="flex items-center gap-1"><Phone size={12} /> {ag.telefone}</span>}
                    </div>
                    {ag.notas && <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 italic">"{ag.notas}"</p>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${getStatusColor(ag.status)}`}>
                    {ag.status}
                  </span>
                  <button
                    onClick={() => handleUpdateStatus(ag.id, "Confirmado")}
                    className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-emerald-500 transition-colors"
                    title="Confirmar"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(ag.id, "Cancelado")}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 transition-colors"
                    title="Cancelar"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
