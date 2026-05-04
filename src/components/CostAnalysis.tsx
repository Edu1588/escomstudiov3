import { motion } from "motion/react";
import { CheckCircle2, TrendingDown } from "lucide-react";

export default function CostAnalysis() {
  const commonCosts = [
    { name: "Hotjar Mapas de Calor", cost: "$39 a $99/mês" },
    { name: "Google Analytics Versão Avançada", cost: "Enterprise", highlight: true },
    { name: "HubSpot CRM & Leads", cost: "$50 a $150/mês" },
    { name: "ClickUp / Asana Gestão", cost: "$10 a $24/usuário" },
    { name: "Mailchimp E-mail Marketing", cost: "$20 a $100/mês" },
    { name: "Zapier Integrações", cost: "$29 a $73/mês" },
  ];

  const escomFeatures = [
    { title: "Captura e gestão de leads", desc: "Sem necessidade de CRMs caros para operações básicas." },
    { title: "Análise de comportamento", desc: "Dados centralizados sobre como o usuário interage." },
    { title: "Estrutura de dados", desc: "Informações organizadas em um único banco de dados." },
    { title: "Automação de fluxos", desc: "Processos que rodam sozinhos, sem Zapier." },
    { title: "Otimização contínua", desc: "Base pronta para escalar sem refazer o código." },
  ];

  return (
    <section className="py-32 px-6 bg-black">
      <div className="container mx-auto">
        <div className="flex flex-col items-center mb-24 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="hidden"
          >
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-8">
            O custo invisível das ferramentas
          </h2>
          
          <p className="text-white/50 max-w-2xl font-rajdhani text-lg leading-relaxed">
            A maioria das empresas não percebe que o maior custo não está na criação do site — mas na soma das assinaturas necessárias para fazê-lo funcionar.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
          <div className="bg-[#0a0a0a] rounded-none border border-red-500/10 flex flex-col overflow-hidden">
             <div className="p-10 pb-0">
                <h3 className="text-2xl font-bold mb-2 text-white">Modelo Comum</h3>
                <p className="text-white/40 text-sm font-rajdhani mb-10">Múltiplas assinaturas e integrações complexas.</p>
                
                <div className="space-y-6 mb-12">
                   {commonCosts.map(item => (
                     <div key={item.name} className="flex justify-between items-center group">
                        <span className="font-rajdhani text-sm text-white/50 group-hover:text-white transition-colors">{item.name}</span>
                        <div className="grow mx-4 border-b border-white/5 border-dotted" />
                        <span className={`font-rajdhani text-sm font-bold ${item.highlight ? "text-red-500" : "text-red-500/80"}`}>{item.cost}</span>
                     </div>
                   ))}
                </div>
             </div>
             
             <div className="mt-auto bg-gradient-to-t from-red-500/5 p-10 border-t border-red-500/10">
                <p className="text-red-500 text-[10px] font-bold tracking-widest uppercase mb-1">CUSTO MÉDIO ANUAL</p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-black text-white">R$9.600 a R$27.600</span>
                </div>
                <p className="text-white/40 text-[12px] font-rajdhani">Apenas em ferramentas externas que não se falam.</p>
             </div>
          </div>

          <div className="bg-[#050f05] rounded-none border border-[#00e300]/20 flex flex-col overflow-hidden relative">
             <div className="absolute top-8 right-8 flex items-center gap-2 px-3 py-1 bg-[#00e300]/10 rounded-sm border border-[#00e300]/20">
                <span className="font-mono text-[9px] text-[#00e300] font-bold tracking-widest">INTEGRADO</span>
             </div>
             
             <div className="p-10">
                <h3 className="text-2xl font-bold mb-2 text-white">Modelo ESCOM</h3>
                <p className="text-white/60 text-sm font-rajdhani mb-12 max-w-sm">Um único sistema estruturado e otimizado que centraliza as principais funções.</p>
                
                <div className="space-y-6">
                   {escomFeatures.map(item => (
                     <div key={item.title} className="flex gap-4">
                        <div className="w-5 h-5 rounded-full border border-[#00e300]/30 flex items-center justify-center shrink-0 mt-0.5">
                           <CheckCircle2 size={12} className="text-[#00e300]" />
                        </div>
                        <div>
                           <h4 className="font-bold text-sm text-white mb-1.5">{item.title}</h4>
                           <p className="text-white/40 text-[13px] font-rajdhani">{item.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             <div className="mt-auto bg-[#00e300]/10 border-t border-[#00e300]/20 p-10 mt-8">
                <p className="text-[#00e300] text-[10px] font-bold tracking-widest uppercase mb-2">PRONTO PARA OPERAR.</p>
                <h3 className="text-3xl font-black text-white mb-4">Pronto para operar.</h3>
                <p className="text-[#00e300]/80 text-[15px] font-rajdhani leading-relaxed">
                  Em vez de depender de várias ferramentas, você passa a possuir um único sistema estratégico que potencializa seu ROI.
                </p>
             </div>
          </div>
        </div>

        {/* Removed Valued Card since screenshot only shows true integration next */}
        <div className="mt-8 max-w-5xl mx-auto">
          <div className="bg-[#0a0a0a] rounded-none p-10 border border-white/5 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden group">
             <div className="bg-black/40 border border-[#00e300]/20 rounded-sm px-3 py-1 absolute top-8 left-8">
                <span className="text-[#00e300] font-mono text-[10px] font-bold tracking-widest">[ ROI_REFORÇADO.EXE ]</span>
             </div>

             <div className="flex-1 mt-12 md:mt-0">
                <h3 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                  O verdadeiro valor da integração
                </h3>
                <p className="text-white/50 font-rajdhani text-lg leading-relaxed max-w-xl">
                  Com um ecossistema centralizado, cada interação do usuário alimenta automaticamente o seu sistema de vendas, sem perda de dados.
                </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:w-auto">
               {[
                 { title: "Velocidade", desc: "Carregamento instantâneo sem scripts de terceiros pesados." },
                 { title: "Controle", desc: "Seus dados são seus. Sem depender de APIs externas para o básico." },
                 { title: "Escala", desc: "Infraestrutura pronta para crescer conforme seu tráfego aumenta." }
               ].map((feat) => (
                  <div key={feat.title} className="bg-[#050505] p-6 rounded-none border border-white/5 min-w-[220px]">
                     <h4 className="text-[#00e300] font-bold text-sm mb-2">{feat.title}</h4>
                     <p className="text-white/50 font-rajdhani text-[13px] leading-relaxed">{feat.desc}</p>
                  </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
