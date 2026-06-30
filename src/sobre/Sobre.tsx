import React from "react";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function Sobre() {
  return (
    <div className="bg-black text-white min-h-screen flex flex-col font-sans">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6 max-w-[1600px]">
          <a href="/" className="inline-flex items-center text-gray-500 hover:text-white transition-colors mb-16 text-[10px] tracking-widest font-mono uppercase">
            <ArrowLeft size={14} className="mr-2" />
            Voltar para Home
          </a>
        </div>
        
        <section className="bg-black text-white" id="sobre">
          <div className="container mx-auto px-6 max-w-6xl">
            {/* Content Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-16">
              <div>
                <h3 className="text-4xl md:text-6xl font-black font-tech tracking-tight leading-[1.1] mb-6">
                  Criamos o futuro<br />
                  <span className="text-[#00d1ff]">digital</span> da sua<br />
                  empresa
                </h3>
                <p className="text-white/60 text-sm leading-relaxed mb-10 max-w-md font-sans">
                  Somos uma agência digital especializada em criar experiências web de alta performance. Transformamos ideias em soluções digitais que geram resultados reais para o seu negócio.
                </p>
                <div className="flex flex-wrap gap-4 font-sans">
                  <a href="/#portfolio" className="bg-[#111] hover:bg-[#222] border border-[#333] px-8 py-3 rounded-md text-sm font-bold transition-all text-white flex items-center justify-center">
                    Ver Portfólio
                  </a>
                  <a href="/#contato" className="bg-[#00d1ff] hover:bg-[#00d1ff]/90 text-black px-8 py-3 rounded-md text-sm font-bold transition-all shadow-[0_0_20px_rgba(0,209,255,0.2)] flex items-center justify-center">
                    Iniciar Projeto
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 h-fit">
                <div className="border border-white/5 bg-[#111] p-8 rounded-2xl flex flex-col items-center justify-center text-center hover:border-white/10 transition-colors">
                  <span className="text-4xl font-black text-[#00d1ff] font-tech mb-2">150+</span>
                  <span className="text-[9px] text-white/40 font-mono tracking-widest uppercase">Projetos Entregues</span>
                </div>
                <div className="border border-white/5 bg-[#111] p-8 rounded-2xl flex flex-col items-center justify-center text-center hover:border-white/10 transition-colors">
                  <span className="text-4xl font-black text-[#00d1ff] font-tech mb-2">5+</span>
                  <span className="text-[9px] text-white/40 font-mono tracking-widest uppercase">Anos de Experiência</span>
                </div>
                <div className="border border-white/5 bg-[#111] p-8 rounded-2xl flex flex-col items-center justify-center text-center hover:border-white/10 transition-colors">
                  <span className="text-4xl font-black text-[#00d1ff] font-tech mb-2">98%</span>
                  <span className="text-[9px] text-white/40 font-mono tracking-widest uppercase">Clientes Satisfeitos</span>
                </div>
                <div className="border border-white/5 bg-[#111] p-8 rounded-2xl flex flex-col items-center justify-center text-center hover:border-white/10 transition-colors">
                  <span className="text-4xl font-black text-[#00d1ff] font-tech mb-2">24/7</span>
                  <span className="text-[9px] text-white/40 font-mono tracking-widest uppercase">Suporte</span>
                </div>
              </div>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-24">
              <div className="border border-white/5 bg-[#111] rounded-2xl hover:border-[#00d1ff]/30 transition-all group overflow-hidden">
                <div className="p-8 pb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#00d1ff]/10 flex items-center justify-center mb-6 border border-[#00d1ff]/20 text-[#00d1ff]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                    </div>
                    <h4 className="font-bold mb-3 text-lg font-sans">Inovação</h4>
                    <p className="text-white/40 text-[13px] leading-relaxed font-sans pb-8">
                    Sempre buscamos as tecnologias mais recentes para entregar resultados de excelência.
                    </p>
                </div>
              </div>
              
              <div className="border border-white/5 bg-[#111] rounded-2xl hover:border-[#00d1ff]/30 transition-all group overflow-hidden">
                <div className="p-8 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#00d1ff]/10 flex items-center justify-center mb-6 border border-[#00d1ff]/20 text-[#00d1ff]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>
                  <h4 className="font-bold mb-3 text-lg font-sans">Foco no Cliente</h4>
                  <p className="text-white/40 text-[13px] leading-relaxed font-sans pb-8">
                    Cada projeto é único. Entendemos suas necessidades e transformamos em soluções.
                  </p>
                </div>
              </div>

              <div className="border border-white/5 bg-[#111] rounded-2xl hover:border-[#00d1ff]/30 transition-all group overflow-hidden">
                <div className="p-8 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#00d1ff]/10 flex items-center justify-center mb-6 border border-[#00d1ff]/20 text-[#00d1ff]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15V3"/><circle cx="12" cy="18" r="3"/><path d="m8 6 4-3 4 3"/></svg>
                  </div>
                  <h4 className="font-bold mb-3 text-lg font-sans">Qualidade</h4>
                  <p className="text-white/40 text-[13px] leading-relaxed font-sans pb-8">
                    Standards altos em cada linha de código, cada pixel, cada interação.
                  </p>
                </div>
              </div>

              <div className="border border-white/5 bg-[#111] rounded-2xl hover:border-[#00d1ff]/30 transition-all group overflow-hidden">
                <div className="p-8 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#00d1ff]/10 flex items-center justify-center mb-6 border border-[#00d1ff]/20 text-[#00d1ff]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
                  </div>
                  <h4 className="font-bold mb-3 text-lg font-sans">Alcance Global</h4>
                  <p className="text-white/40 text-[13px] leading-relaxed font-sans pb-8">
                    Criamos soluções que funcionam para qualquer mercado, qualquer idioma.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-auto border-t border-[#333] pt-12 pb-16 bg-[#0a0a0a]">
        <div className="container mx-auto px-6 max-w-6xl text-center">
            <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">© 2026 ESCOM STUDIO // TODOS OS DIREITOS RESERVADOS.</p>
        </div>
      </div>
    </div>
  );
}
