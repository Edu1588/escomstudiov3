import React from "react";
import { Header } from "../components/Header";
import { BarChart2 } from "lucide-react";

export default function Relatorios() {
  return (
    <div className="flex-1 overflow-y-auto w-full">
      <Header title="Análise Geral" />
      <div className="p-8 max-w-[1200px] mx-auto mt-4 text-center">
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-24 flex flex-col items-center justify-center">
          <BarChart2 size={48} className="text-[#2EFF00] mb-4 opacity-50" />
          <h2 className="text-xl font-bold uppercase tracking-widest text-[#2EFF00] mb-2">Relatórios</h2>
          <p className="text-gray-500 font-mono text-sm max-w-[400px]">Este módulo agregará todos os painéis avançados de exportação no futuro.</p>
        </div>
      </div>
    </div>
  );
}
