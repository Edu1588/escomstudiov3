import React from "react";
import { Header } from "../components/Header";
import { Clock } from "lucide-react";

export default function InstagramGEM() {
  return (
    <div className="flex-1 overflow-y-auto w-full">
      <Header title="Análise Geral" />
      <div className="p-8 max-w-[1200px] mx-auto mt-4">
        
        <div className="flex justify-end mb-8">
          <button className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] text-gray-400 hover:text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors">
            <Clock size={14} />
            HISTÓRICO
          </button>
        </div>

        <div className="max-w-[700px] mx-auto bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-[#2EFF00] font-bold text-2xl uppercase tracking-wider mb-2">GERADOR ES COM</h2>
            <p className="text-gray-400 text-sm">Insira o JSON para gerar os seus posts.</p>
          </div>
          
          <div className="mb-6 relative">
            <textarea 
              className="w-full bg-black border border-[#1a1a1a] rounded-xl p-6 text-white font-mono text-xs focus:outline-none focus:border-[#2EFF00] transition-colors resize-y min-h-[300px]"
              placeholder='{ "titulo01": "...", "texto01": "..." }'
            ></textarea>
          </div>

          <div className="flex justify-between items-center gap-4">
            <button className="bg-[#1a1a1a] border border-[#333] hover:bg-[#222] text-sm text-gray-300 px-6 py-4 rounded-xl font-medium transition-colors">
              Carregar Exemplo
            </button>
            <button className="flex-1 bg-[#2EFF00] hover:bg-[#28e600] text-black font-bold text-lg px-6 py-4 rounded-xl transition-colors uppercase tracking-wider">
              GERAR CARROSSEL
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
