import React from "react";
import { Header } from "../components/Header";
import { Plus, Edit2, Trash2 } from "lucide-react";

export default function Portfolio() {
  const projetos = [
    { id: 1, name: "Ubah Design", category: "WEB DESIGN", desc: "Desenvolvemos um site completo com foco em conversão e usabilidade...", image: "https://eionstudio.com.br/wp-content/uploads/2026/02/about-slide-2.jpg", score: "90%" },
    { id: 2, name: "VCR Mobiliário Urbano", category: "WEB DESIGN", desc: "Desenvolvemos um ecossistema digital completo. O novo website foi construído...", image: "https://eionstudio.com.br/wp-content/uploads/2026/02/about-slide-2.jpg", score: "95%" },
    { id: 3, name: "Goloni Urban Furniture", category: "WEB DESIGN", desc: "Desenvolvemos um redesign minimalista apostando fortemente em tendências...", image: "https://eionstudio.com.br/wp-content/uploads/2026/02/about-slide-2.jpg", score: "92%" },
    { id: 4, name: "Estante do Escritor", category: "WEB DESIGN", desc: "Plataforma para autores independentes...", image: "https://eionstudio.com.br/wp-content/uploads/2026/02/about-slide-2.jpg", score: "85%" },
    { id: 5, name: "MOA PRO", category: "WEB DESIGN", desc: "Plataforma focada no ecossistema...", image: "https://eionstudio.com.br/wp-content/uploads/2026/02/about-slide-2.jpg", score: "95%" },
    { id: 6, name: "GF Engenharia", category: "WEB DESIGN", desc: "Página institucional...", image: "https://eionstudio.com.br/wp-content/uploads/2026/02/about-slide-2.jpg", score: "88%" },
  ];

  return (
    <div className="flex-1 overflow-y-auto w-full">
      <Header title="Análise Geral" />
      <div className="p-8 max-w-[1200px] mx-auto mt-4">
        
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-tight">Portfólio de Projetos</h2>
            <p className="text-gray-400 text-sm mt-1">Gerencie os projetos que aparecem no seu portfólio público.</p>
          </div>
          <button className="flex items-center gap-2 bg-[#2EFF00] hover:bg-[#28e600] text-black px-4 py-2 rounded-lg text-sm font-bold transition-colors">
            <Plus size={16} />
            Novo Projeto
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projetos.map((projeto) => (
            <div key={projeto.id} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl overflow-hidden group relative hover:border-[#333] transition-colors flex flex-col h-full">
              
              <div className="relative h-48 overflow-hidden bg-[#111]">
                <img src={projeto.image} alt={projeto.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                
                <div className="absolute top-0 right-0 p-3 flex gap-2">
                  <div className="bg-white/90 backdrop-blur text-black font-bold text-xs px-2 py-1 flex flex-col items-center justify-center rounded">
                    <span className="text-[10px] text-gray-500 font-mono leading-none">A</span>
                    <span>{projeto.score}</span>
                  </div>
                </div>

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button className="w-12 h-12 bg-[#2EFF00] hover:bg-[#28e600] text-black rounded-xl flex items-center justify-center transition-transform hover:scale-110">
                    <Edit2 size={20} />
                  </button>
                  <button className="w-12 h-12 bg-red-500/80 hover:bg-red-500 text-white rounded-xl flex items-center justify-center transition-transform hover:scale-110 shadow-lg">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-white">{projeto.name}</h3>
                  <span className="bg-[#1a1a1a] border border-[#333] text-gray-400 text-[10px] font-mono tracking-widest px-2 py-1 rounded">{projeto.category}</span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2 mt-auto">{projeto.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
