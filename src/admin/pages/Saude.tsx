import React from "react";
import { HeartPulse, Activity, Dumbbell, Flame, Apple, CheckCircle2 } from "lucide-react";

export default function Saude() {
  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#070c18] p-4 md:p-8 text-slate-900 custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER PRINCIPAL */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-[#2563eb] text-white flex items-center justify-center font-bold border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <HeartPulse size={24} />
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                Saúde & Alta Performance
              </h1>
            </div>
            <p className="text-slate-600 text-sm font-medium">
              Acompanhamento de rotinas, treino, bio-métricas e foco em alta performance física e mental.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-4 py-2 bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              Status: Ativo & Em Expansão
            </span>
          </div>
        </div>

        {/* METRIC CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-slate-500">Batimento / Repouso</span>
              <Activity size={20} className="text-rose-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">62 BPM</div>
            <div className="text-xs font-bold text-emerald-600 mt-1">Ritmo Saudável</div>
          </div>

          <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-slate-500">Treinos Semanal</span>
              <Dumbbell size={20} className="text-[#2563eb]" />
            </div>
            <div className="text-2xl font-black text-slate-900">4 / 5 Dias</div>
            <div className="text-xs font-bold text-blue-600 mt-1">Meta em 80%</div>
          </div>

          <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-slate-500">Calorias Ativas</span>
              <Flame size={20} className="text-amber-500" />
            </div>
            <div className="text-2xl font-black text-slate-900">2.450 kcal</div>
            <div className="text-xs font-bold text-slate-500 mt-1">Gasto diário estimado</div>
          </div>

          <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-slate-500">Hidratação</span>
              <Apple size={20} className="text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">2.8L / 3.0L</div>
            <div className="text-xs font-bold text-emerald-600 mt-1">Quase concluído</div>
          </div>
        </div>

        {/* CONTAINER CONTEÚDO */}
        <div className="bg-white border-2 border-slate-900 rounded-2xl p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#2563eb] text-white mx-auto flex items-center justify-center border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <HeartPulse size={32} />
          </div>
          <h2 className="text-xl font-black text-slate-900">Painel de Saúde e Bio-Tracking</h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto font-semibold leading-relaxed">
            Módulo habilitado para registro de métricas corporais, rotinas de sono, treinos diários e otimização da fisiologia do trabalho.
          </p>
        </div>

      </div>
    </div>
  );
}
