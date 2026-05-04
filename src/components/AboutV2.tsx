import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

export default function AboutV2() {
  return (
    <section className="py-32 bg-black text-white" id="sobre">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Intro */}
        <div className="flex flex-col items-center text-center mb-40">
          <div className="w-8 h-4 rounded-full border border-white/20 mb-8" />
          <h2 className="text-4xl md:text-5xl font-black font-tech uppercase tracking-wide mb-8">SOBRE A ESCOM</h2>
          <p className="text-white/60 text-sm md:text-base font-rajdhani leading-relaxed max-w-3xl mb-12">
            A ESCOM desenvolve projetos digitais de alta performance que unem design estratégico e infraestrutura inteligente. Nosso foco é transformar a presença online em um sistema funcional de crescimento.
          </p>
          <button className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:border-primary hover:text-primary transition-all group">
            <ArrowUpRight size={24} className="group-hover:rotate-45 transition-transform" />
          </button>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-16">
          <div>
            <h3 className="text-4xl md:text-6xl font-black font-tech tracking-tight leading-[1.1] mb-6">
              Criamos o futuro<br />
              <span className="text-[#00e300]">digital</span> da sua<br />
              empresa
            </h3>
            <p className="text-white/60 text-sm leading-relaxed mb-10 max-w-md">
              Somos uma agência digital especializada em criar experiências web de alta performance. Transformamos ideias em soluções digitais que geram resultados reais para o seu negócio.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-3 rounded-md text-sm font-bold transition-all">
                Ver Portfólio
              </button>
              <button className="bg-[#00e300] hover:bg-[#00e300]/90 text-black px-8 py-3 rounded-md text-sm font-bold transition-all shadow-[0_0_20px_rgba(0,227,0,0.2)]">
                Iniciar Projeto
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 h-fit">
            <div className="border border-white/5 bg-white/[0.02] p-8 rounded-2xl flex flex-col items-center justify-center text-center hover:border-white/10 transition-colors">
              <span className="text-4xl font-black text-[#00e300] font-tech mb-2">150+</span>
              <span className="text-[9px] text-white/40 font-mono tracking-widest uppercase">Projetos Entregues</span>
            </div>
            <div className="border border-white/5 bg-white/[0.02] p-8 rounded-2xl flex flex-col items-center justify-center text-center hover:border-white/10 transition-colors">
              <span className="text-4xl font-black text-[#00e300] font-tech mb-2">5+</span>
              <span className="text-[9px] text-white/40 font-mono tracking-widest uppercase">Anos de Experiência</span>
            </div>
            <div className="border border-white/5 bg-white/[0.02] p-8 rounded-2xl flex flex-col items-center justify-center text-center hover:border-white/10 transition-colors">
              <span className="text-4xl font-black text-[#00e300] font-tech mb-2">98%</span>
              <span className="text-[9px] text-white/40 font-mono tracking-widest uppercase">Clientes Satisfeitos</span>
            </div>
            <div className="border border-white/5 bg-white/[0.02] p-8 rounded-2xl flex flex-col items-center justify-center text-center hover:border-white/10 transition-colors">
              <span className="text-4xl font-black text-[#00e300] font-tech mb-2">24/7</span>
              <span className="text-[9px] text-white/40 font-mono tracking-widest uppercase">Suporte</span>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border border-white/5 bg-white/[0.02] p-8 rounded-2xl hover:border-[#00e300]/30 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-[#00e300]/10 flex items-center justify-center mb-6 border border-[#00e300]/20 text-[#00e300]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <h4 className="font-bold mb-3 text-lg">Inovação</h4>
            <p className="text-white/40 text-[13px] leading-relaxed">
              Sempre buscamos as tecnologias mais recentes para entregar resultados de excelência.
            </p>
          </div>
          
          <div className="border border-white/5 bg-white/[0.02] p-8 rounded-2xl hover:border-[#00e300]/30 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-[#00e300]/10 flex items-center justify-center mb-6 border border-[#00e300]/20 text-[#00e300]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h4 className="font-bold mb-3 text-lg">Foco no Cliente</h4>
            <p className="text-white/40 text-[13px] leading-relaxed">
              Cada projeto é único. Entendemos suas necessidades e transformamos em soluções.
            </p>
          </div>

          <div className="border border-white/5 bg-white/[0.02] p-8 rounded-2xl hover:border-[#00e300]/30 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-[#00e300]/10 flex items-center justify-center mb-6 border border-[#00e300]/20 text-[#00e300]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15V3"/><circle cx="12" cy="18" r="3"/><path d="m8 6 4-3 4 3"/></svg>
            </div>
            <h4 className="font-bold mb-3 text-lg">Qualidade</h4>
            <p className="text-white/40 text-[13px] leading-relaxed">
              Standards altos em cada linha de código, cada pixel, cada interação.
            </p>
          </div>

          <div className="border border-white/5 bg-white/[0.02] p-8 rounded-2xl hover:border-[#00e300]/30 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-[#00e300]/10 flex items-center justify-center mb-6 border border-[#00e300]/20 text-[#00e300]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
            </div>
            <h4 className="font-bold mb-3 text-lg">Alcance Global</h4>
            <p className="text-white/40 text-[13px] leading-relaxed">
              Criamos soluções que funcionam para qualquer mercado, qualquer idioma.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
