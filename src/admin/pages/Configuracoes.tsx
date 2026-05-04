import React from "react";
import { Header } from "../components/Header";
import { Settings, BarChart } from "lucide-react";

export default function Configuracoes() {
  return (
    <div className="flex-1 overflow-y-auto w-full">
      <Header title="Análise Geral" />
      <div className="p-8 max-w-[1200px] mx-auto mt-4">
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#2EFF00]/10 text-[#2EFF00] flex items-center justify-center">
            <Settings size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Configurações do Sistema</h2>
            <p className="text-gray-400 text-sm mt-1">Gerencie suas preferências e integrações.</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-10">
            {/* Perfil */}
            <div>
              <div className="text-[10px] text-[#2EFF00] font-mono tracking-widest mb-6">PERFIL DO ADMINISTRADOR</div>
              <div className="flex items-start gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl bg-[#1a1a1a] border border-[#333] overflow-hidden flex-shrink-0">
                    <img src="https://eionstudio.com.br/wp-content/uploads/2026/02/about-slide-2.jpg" alt="Edu Santos" className="w-full h-full object-cover" />
                  </div>
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-black border border-[#333] rounded-full flex items-center justify-center text-white hover:text-[#2EFF00] hover:border-[#2EFF00] transition-colors">
                    +
                  </button>
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-gray-500 font-mono tracking-widest mb-2">NOME EXIBIDO</label>
                    <input type="text" defaultValue="Edu Santos" className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2EFF00] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 font-mono tracking-widest mb-2">E-MAIL</label>
                    <input type="text" defaultValue="es.comunicacao@outlook.com" className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2EFF00] transition-colors" />
                  </div>
                </div>
              </div>
            </div>

            {/* Integrações */}
            <div>
              <div className="text-[10px] text-[#2EFF00] font-mono tracking-widest mb-6">INTEGRAÇÕES & APIS</div>
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#111] border border-[#333] flex items-center justify-center">
                    <BarChart size={18} className="text-gray-400" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">Google Analytics 4</div>
                    <div className="text-[11px] text-gray-500">Desconectado</div>
                  </div>
                </div>
                <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">Conectar</a>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-80 space-y-6">
            {/* Security */}
            <div className="bg-[#0a0a0a] border border-[#2EFF00]/20 rounded-xl p-6">
              <h3 className="font-bold text-white mb-2">Segurança</h3>
              <p className="text-xs text-gray-500 mb-6">Sua senha foi alterada pela última vez há 12 dias.</p>
              <button className="w-full bg-[#111] border border-[#333] hover:border-[#2EFF00]/50 text-white rounded-lg py-3 text-sm font-medium transition-colors">
                Alterar Senha
              </button>
            </div>

            {/* Danger Zone */}
            <div className="bg-[#0a0a0a] border border-red-500/20 rounded-xl p-6">
              <h3 className="font-bold text-red-500 mb-2">Zona de Perigo</h3>
              <p className="text-xs text-gray-500 mb-6">Ações irreversíveis que afetam todo o sistema.</p>
              <button className="w-full bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 text-red-500 rounded-lg py-3 text-sm font-medium transition-colors">
                Resetar Banco de Dados
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
