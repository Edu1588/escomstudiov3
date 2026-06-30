import React from "react";
import { Header } from "../components/Header";
import { Plus, LayoutTemplate, ArrowUpRight } from "lucide-react";

export default function Paginas() {
  const paginas = [
    { title: "Página Inicial (Home)", path: "/", acessos: 0, leads: 2, status: "ATIVO" },
    { title: "Portfólio de Projetos", path: "/portfolio-projetos", acessos: 0, leads: 0, status: "ATIVO" },
    { title: "Portfólio EDU", path: "/portfolioedu", acessos: 0, leads: 0, status: "ATIVO" },
    { title: "Base de Propostas", path: "/baseproposta", acessos: 0, leads: 0, status: "ATIVO" },
    { title: "Sobre a ESCOM Studio", path: "/sobre", acessos: 0, leads: 0, status: "ATIVO" },
    { title: "Contato", path: "/contato", acessos: 0, leads: 0, status: "ATIVO" },
  ];

  return (
    <div className="flex-1 overflow-y-auto w-full">
      <Header title="Análise Geral" />
      <div className="p-8 max-w-[1200px] mx-auto mt-4">
        
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold">Gestão de Páginas</h2>
            <button className="flex items-center gap-2 bg-[#00d1ff] hover:bg-[#00b8e6] text-black px-4 py-2 rounded-lg text-sm font-bold transition-colors">
              <Plus size={16} />
              Criar Nova Página
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginas.map((pagina, i) => (
              <div key={i} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5 hover:border-[#333] transition-colors flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-gray-400">
                    <LayoutTemplate size={18} />
                  </div>
                  {pagina.status === "ATIVO" && (
                     <span className="bg-[#00d1ff]/10 text-[#00d1ff] text-[10px] font-bold px-2 py-1 rounded">ATIVO</span>
                  )}
                </div>
                
                <h3 className="font-bold text-white mb-1">{pagina.title}</h3>
                <div className="text-[11px] text-gray-500 font-mono mb-6">{pagina.path}</div>

                <div className="flex justify-between items-center mb-6">
                  <div>
                    <div className="text-[10px] text-gray-500 font-mono mb-1">ACESSOS</div>
                    <div className="text-xl font-bold">{pagina.acessos}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-[#00d1ff] font-mono mb-1">LEADS</div>
                    <div className="text-xl font-bold text-[#00d1ff]">{pagina.leads}</div>
                  </div>
                </div>

                <a 
                  href={pagina.path} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full mt-auto bg-[#1a1a1a] hover:bg-[#222] border border-[#333] text-white py-2.5 flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <ArrowUpRight size={16} />
                  Abrir Página
                </a>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
