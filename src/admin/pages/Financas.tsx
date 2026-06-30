import React from "react";
import { DollarSign } from "lucide-react";

export default function Financas() {
  return (
    <div className="flex-1 h-full overflow-y-auto p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <DollarSign size={28} className="text-[#00d1ff]" />
            Finanças
          </h1>
          <p className="text-gray-500 text-sm mt-1">Módulo em desenvolvimento</p>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[400px] border border-dashed border-[#1a1a1a] rounded-2xl bg-[#0a0a0a]/50">
          <div className="w-20 h-20 rounded-2xl bg-[#00d1ff]/10 flex items-center justify-center mb-6">
            <DollarSign size={40} className="text-[#00d1ff]" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Em breve</h2>
          <p className="text-gray-500 text-sm text-center max-w-md">
            O módulo de Finanças está sendo desenvolvido. Em breve você terá acesso a todas as funcionalidades.
          </p>
          <div className="mt-6 px-4 py-2 rounded-full bg-[#00d1ff]/10 text-[#00d1ff] text-xs font-mono tracking-wider">
            COMING SOON
          </div>
        </div>
      </div>
    </div>
  );
}
