import fs from 'fs';
import path from 'path';

const basePath = 'public';

// CSS de shimmer para o botão do PDF e pulse do neon
const escomStyles = `
        /* PDF Shimmer Button Animation */
        .btn-pdf-shimmer {
            position: relative;
            overflow: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            animation: pulse-glow-green 2s infinite alternate;
        }
        .btn-pdf-shimmer:active {
            animation: click-effect-green 0.2s forwards;
            transform: scale(0.95);
        }
        .btn-pdf-shimmer::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -60%;
            width: 30%;
            height: 200%;
            background: linear-gradient(
                to right,
                rgba(255, 255, 255, 0) 0%,
                rgba(255, 255, 255, 0.35) 30%,
                rgba(255, 255, 255, 0.45) 50%,
                rgba(255, 255, 255, 0.35) 70%,
                rgba(255, 255, 255, 0) 100%
            );
            transform: rotate(30deg);
            animation: shimmer-btn 4.5s infinite ease-in-out;
        }
        @keyframes shimmer-btn {
            0% { left: -60%; }
            25% { left: 140%; }
            100% { left: 140%; }
        }
        @keyframes pulse-glow-green {
            0% { box-shadow: 0 0 5px rgba(46, 255, 0, 0.2); border-color: rgba(63, 63, 70, 0.5); }
            100% { box-shadow: 0 0 25px rgba(46, 255, 0, 0.8); border-color: rgba(46, 255, 0, 0.9); }
        }
        @keyframes click-effect-green {
            0% { transform: scale(1); }
            50% { transform: scale(0.92); box-shadow: inset 0 0 25px rgba(46, 255, 0, 0.9); }
            100% { transform: scale(0.95); box-shadow: inset 0 0 10px rgba(46, 255, 0, 0.5); }
        }
`;

function generateCommercialSections(company) {
  const isEn = company.isEn;
  const cName = company.display;
  const pdfUrl = company.pdfUrl;

  const dossieHtml = `
<!-- ============================================================ -->
<!-- SEÇÃO DO DOSSIÊ COMERCIAL (PDF/ESTRATÉGIA) -->
<!-- ============================================================ -->
<section id="dossie-comercial" class="py-16 bg-[#111] text-center border-t-2 border-zinc-800">
    <div class="max-w-3xl mx-auto px-6">
        <h3 class="text-[#2EFF00] font-mono text-xs font-bold uppercase tracking-widest mb-4"><i class="fa-solid fa-lock mr-2"></i> ${isEn ? 'Confidential Document' : 'Documento Confidencial'}</h3>
        <h2 class="text-3xl font-bold text-white mb-6">${isEn ? 'Strategic Analysis & Market Dossier' : 'Análise Estratégica & Dossiê de Mercado'}</h2>
        <p class="text-zinc-400 mb-8 text-sm">${isEn ? 'Restricted access to the conversion architecture study, local market insights, and financial projections for ' + cName : 'Acesso restrito ao estudo de arquitetura de conversão, dados reais de faturamento local e projeção financeira para ' + cName}.</p>
        <a href="${pdfUrl}" target="_blank" class="btn-pdf-shimmer active:scale-95 active:translate-y-[1px] bg-transparent hover:bg-stone-850 border-2 border-[#2EFF00]/30 text-white font-bold py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-3 mx-auto group inline-flex hover:border-[#2EFF00]">
            <i class="fa-solid fa-file-pdf text-[#2EFF00] text-xl group-hover:scale-110 transition-transform"></i> ${isEn ? 'Access Strategic Dossier (PDF Analysis)' : 'Acessar Dossiê Estratégico (Acessar PDF da Análise)'}
        </a>
    </div>
</section>
  `;

  const propostaHtml = `
<!-- ============================================================ -->
<!-- SEÇÃO COMERCIAL ESCOM STUDIO (PROPOSTA) -->
<!-- ============================================================ -->
<section id="proposta-comercial" class="py-24 bg-[#0a0a0a] relative overflow-hidden text-white border-t-8 border-[#2EFF00]">
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-stone-900/20 via-[#0a0a0a] to-[#0a0a0a] pointer-events-none"></div>
    
    <div class="container mx-auto px-6 max-w-6xl relative z-10">
        <div class="text-center mb-16">
            <span class="bg-[#2EFF00]/10 text-[#2EFF00] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-[#2EFF00]/20 mb-6 inline-block">${isEn ? 'Exclusive ESCOM Studio Proposal' : 'Proposta Exclusiva ESCOM Studio'}</span>
            <h2 class="text-4xl md:text-5xl font-display font-extrabold text-white mb-6">${isEn ? 'Project Investment' : 'Investimento do Projeto'}</h2>
            <p class="text-zinc-400 max-w-2xl mx-auto text-lg">${isEn ? 'This is the exact financial scope for the implementation of your website, with high-performance design and conversion engineering.' : 'Este é o escopo financeiro exato para a implementação do site da sua empresa, com design de alta performance e engenharia de conversão voltada para captação.'}</p>
        </div>

        <!-- Card Principal de Preço -->
        <div class="max-w-2xl mx-auto bg-gradient-to-b from-stone-900/60 to-zinc-900/60 p-10 rounded-3xl border border-stone-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] mb-16 relative backdrop-blur-sm transform transition hover:scale-[1.01]">
            <div class="absolute top-0 right-0 bg-[#2EFF00] text-black text-xs font-bold px-4 py-1 rounded-tr-3xl rounded-bl-xl z-20">${isEn ? 'CURRENT OFFER' : 'OFERTA DE PROSPECÇÃO'}</div>
            
            <h3 class="text-2xl font-bold mb-2">${isEn ? 'High-Conversion Website' : 'Website de Conversão Ativa'}</h3>
            <p class="text-zinc-400 text-sm mb-6 pb-6 border-b border-white/10">${isEn ? 'Custom UI/UX Design, Local SEO, Mobile-First Responsiveness, WhatsApp Integration, Persuasive Copywriting.' : 'Design UI/UX Sob Medida, Otimização de SEO, Responsividade Mobile-First, Integração WhatsApp, Copywriting Persuasivo.'}</p>
            
            <!-- Destaque Parcelamento 12x -->
            <div class="bg-stone-950/85 border border-stone-800 rounded-2xl p-6 mb-8 relative shadow-[0_10px_30px_rgba(0,0,0,0.4)] mt-8">
                <div class="absolute -top-3 right-3 bg-[#2EFF00] text-black text-[10px] font-black px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 z-20">
                    <i class="fa-solid fa-star text-[8px]"></i> ${isEn ? 'PAY IN 12X' : 'PARCELE EM 12X'} <i class="fa-solid fa-star text-[8px]"></i>
                </div>
                <div class="flex items-center justify-center gap-2 mb-4 mt-2">
                    <i class="fa-solid fa-credit-card text-[#2EFF00] text-lg"></i>
                    <span class="text-[#2EFF00] text-xs font-bold uppercase tracking-widest">${isEn ? 'Interest-Free Credit Card' : 'Parcele no Cartão de Crédito'}</span>
                </div>
                <div class="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1">
                    <span class="text-xl sm:text-2xl font-black text-[#2EFF00] bg-[#2EFF00]/10 px-2.5 py-0.5 rounded-xl">12x</span>
                    <span class="text-base sm:text-lg text-stone-400 font-bold">${isEn ? 'of' : 'de'}</span>
                    <span class="text-xl sm:text-2xl font-bold text-stone-400">${isEn ? '$' : 'R$'}</span>
                    <span class="text-5xl sm:text-6xl font-black text-[#2EFF00] tracking-tighter drop-shadow-[0_0_15px_rgba(46,255,0,0.35)]">82</span>
                    <span class="text-2xl sm:text-3xl font-bold text-[#2EFF00]">${isEn ? '.50' : ',50'}</span>
                </div>
                <p class="text-center text-stone-500 text-[10px] mt-3 font-semibold tracking-wider uppercase">${isEn ? 'INTEREST-FREE PAYMENTS' : 'SEM JUROS NO CARTÃO DE CRÉDITO'}</p>
                <div class="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-stone-850">
                    <span class="text-stone-400 text-sm">${isEn ? 'or upfront for' : 'ou à vista por'}</span>
                    <span class="text-2xl font-bold text-stone-400">${isEn ? '$' : 'R$'} <span class="text-[#2EFF00]">990</span></span>
                    <span class="bg-[#2EFF00]/20 text-[#2EFF00] text-[10px] font-bold px-2 py-0.5 rounded-full">PIX / DEBIT</span>
                </div>
            </div>

            <ul class="space-y-4 mb-10 text-sm text-zinc-300">
                <li class="flex items-center gap-3"><i class="fa-solid fa-check-circle text-[#2EFF00] text-lg"></i> ${isEn ? 'Domain name registration & hosting setup' : 'Configuração completa de domínio e hospedagem'}</li>
                <li class="flex items-center gap-3"><i class="fa-solid fa-check-circle text-[#2EFF00] text-lg"></i> ${isEn ? 'SEO optimization for Google Local Pack' : 'SEO integrado para posicionamento local'}</li>
                <li class="flex items-center gap-3"><i class="fa-solid fa-check-circle text-[#2EFF00] text-lg"></i> ${isEn ? 'SSL Security Certificate Integration' : 'Certificado SSL de Conexão Segura'}</li>
                <li class="flex items-center gap-3"><i class="fa-solid fa-check-circle text-[#2EFF00] text-lg"></i> ${isEn ? '30 Days of Priority Technical Support' : 'Suporte técnico prioritário de 30 dias'}</li>
                <li class="flex items-center gap-3"><i class="fa-solid fa-credit-card text-[#2EFF00] text-lg"></i> <strong class="text-white">${isEn ? 'Up to 12 interest-free installments' : 'Parcelamento em até 12x sem juros'}</strong></li>
            </ul>

            <button id="btn-aceitar-proposta" class="btn-pdf-shimmer w-full bg-[#2EFF00] hover:bg-[#28e600] text-black text-lg font-black py-5 rounded-2xl transition-all shadow-lg shadow-[#2EFF00]/30 flex items-center justify-center gap-3 group relative overflow-hidden">
                ${isEn ? 'ACCEPT PROPOSAL NOW' : 'ACEITAR PROPOSTA AGORA'} <i class="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
            </button>
            <p class="text-center text-xs text-zinc-500 mt-4"><i class="fa-solid fa-lock text-zinc-600 mr-1"></i> ${isEn ? 'Secure contract and invoice sent immediately after acceptance.' : 'Contrato e Nota Fiscal emitidos logo após a aprovação.'}</p>
        </div>

        <!-- Seção de Serviços Adicionais (Upsells) -->
        <div class="max-w-5xl mx-auto mt-24 bg-gradient-to-b from-[#1c1917]/40 to-[#0c0a09]/80 p-8 md:p-12 rounded-3xl border border-[#2EFF00]/20 shadow-[0_0_50px_rgba(46,255,0,0.05)] relative backdrop-blur-md">
            <div class="absolute -top-4 left-8 bg-[#2EFF00] text-black text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                ${isEn ? 'Advanced Expansions' : 'Expansões Tecnológicas'}
            </div>
            
            <h3 class="text-2xl md:text-3xl font-display font-extrabold text-white mb-4 flex items-center gap-3">
                <i class="fa-solid fa-square-plus text-[#2EFF00]"></i> ${isEn ? 'Optional Tech Modules' : 'Módulos Avançados sob Demanda'}
            </h3>
            <p class="text-stone-400 mb-10 text-sm max-w-3xl leading-relaxed">
                ${isEn ? 'Take your customer acquisition, operations, and analysis to the next level. Integrate advanced modules developed by ESCOM Studio:' : 'Leve a sua captação, operação e análise para o próximo nível. Integre novos recursos tecnológicos desenvolvidos sob medida pela ESCOM Studio:'}
            </p>
            
            <div class="grid md:grid-cols-2 gap-6 mb-12">
                <!-- CRM -->
                <div class="group bg-stone-950/80 rounded-2xl border border-stone-850 hover:border-[#2EFF00]/50 hover:shadow-[0_0_30px_rgba(46,255,0,0.15)] transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden">
                    <div class="h-40 w-full overflow-hidden relative">
                        <div class="absolute inset-0 bg-gradient-to-t from-stone-950/90 to-transparent z-10"></div>
                        <img src="../template-silva-autocenter/upsell_crm.png" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="CRM">
                        <div class="absolute bottom-4 left-6 z-20 w-10 h-10 bg-[#2EFF00] rounded-xl flex items-center justify-center text-black text-lg shadow-lg">
                            <i class="fa-solid fa-users"></i>
                        </div>
                    </div>
                    <div class="p-6 flex-1 flex flex-col justify-between">
                        <div>
                            <h4 class="font-bold text-white text-base mb-2">${isEn ? 'CRM & Client Lead Management' : 'CRM e Controle de Clientes'}</h4>
                            <p class="text-stone-400 text-xs leading-relaxed">${isEn ? 'Automated scheduling funnels, automated alerts, and follow-ups via WhatsApp. Complete customer history database.' : 'Funil de agendamentos automatizado, envio de lembretes automáticos e acompanhamento via WhatsApp. Histórico de relacionamento com cliente.'}</p>
                        </div>
                        <span class="text-[10px] text-[#2EFF00] font-bold uppercase tracking-wider mt-4 block border-t border-stone-850 pt-4">${isEn ? 'Focus: Retention & Recurrence' : 'Foco: Retenção & Recorrência'}</span>
                    </div>
                </div>

                <!-- Dashboard -->
                <div class="group bg-stone-950/80 rounded-2xl border border-stone-850 hover:border-[#2EFF00]/50 hover:shadow-[0_0_30px_rgba(46,255,0,0.15)] transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden">
                    <div class="h-40 w-full overflow-hidden relative">
                        <div class="absolute inset-0 bg-gradient-to-t from-stone-950/90 to-transparent z-10"></div>
                        <img src="../template-silva-autocenter/upsell_dashboard.png" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Dashboard">
                        <div class="absolute bottom-4 left-6 z-20 w-10 h-10 bg-[#2EFF00] rounded-xl flex items-center justify-center text-black text-lg shadow-lg">
                            <i class="fa-solid fa-chart-line"></i>
                        </div>
                    </div>
                    <div class="p-6 flex-1 flex flex-col justify-between">
                        <div>
                            <h4 class="font-bold text-white text-base mb-2">${isEn ? 'Financial Performance Dashboard' : 'Dashboard Financeiro'}</h4>
                            <p class="text-stone-400 text-xs leading-relaxed">${isEn ? 'Real-time billing analytics, customer acquisition cost (CAC) tracking, and conversion rates inside a beautiful visual admin.' : 'Visualização do fluxo de caixa e conversão de novos clientes em tempo real, controle de faturamento diário com gráficos intuitivos.'}</p>
                        </div>
                        <span class="text-[10px] text-[#2EFF00] font-bold uppercase tracking-wider mt-4 block border-t border-stone-850 pt-4">${isEn ? 'Focus: Management & Profit' : 'Foco: Gestão & Lucro'}</span>
                    </div>
                </div>

                <!-- Agente IA -->
                <div class="group bg-stone-950/80 rounded-2xl border border-stone-850 hover:border-[#2EFF00]/50 hover:shadow-[0_0_30px_rgba(46,255,0,0.15)] transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden">
                    <div class="h-40 w-full overflow-hidden relative">
                        <div class="absolute inset-0 bg-gradient-to-t from-stone-950/90 to-transparent z-10"></div>
                        <img src="../template-silva-autocenter/upsell_robot.png" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="AI Agent">
                        <div class="absolute bottom-4 left-6 z-20 w-10 h-10 bg-[#2EFF00] rounded-xl flex items-center justify-center text-black text-lg shadow-lg">
                            <i class="fa-solid fa-robot"></i>
                        </div>
                    </div>
                    <div class="p-6 flex-1 flex flex-col justify-between">
                        <div>
                            <h4 class="font-bold text-white text-base mb-2">${isEn ? 'AI Customer Support Agent (WhatsApp)' : 'Agente de Atendimento IA'}</h4>
                            <p class="text-stone-400 text-xs leading-relaxed">${isEn ? 'Smart chatbot operating 24/7 to answer customer queries, schedule appointments, and qualify incoming leads automatically.' : 'Robô inteligente integrado ao WhatsApp Business, operando 24 horas por dia para realizar agendamentos e tirar dúvidas.'}</p>
                        </div>
                        <span class="text-[10px] text-[#2EFF00] font-bold uppercase tracking-wider mt-4 block border-t border-stone-850 pt-4">${isEn ? 'Focus: 24/7 Support' : 'Foco: Atendimento 24/7'}</span>
                    </div>
                </div>

                <!-- Estoque -->
                <div class="group bg-stone-950/80 rounded-2xl border border-stone-850 hover:border-[#2EFF00]/50 hover:shadow-[0_0_30px_rgba(46,255,0,0.15)] transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden">
                    <div class="h-40 w-full overflow-hidden relative">
                        <div class="absolute inset-0 bg-gradient-to-t from-stone-950/90 to-transparent z-10"></div>
                        <img src="../template-silva-autocenter/upsell_estoque.png" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Inventory">
                        <div class="absolute bottom-4 left-6 z-20 w-10 h-10 bg-[#2EFF00] rounded-xl flex items-center justify-center text-black text-lg shadow-lg">
                            <i class="fa-solid fa-boxes-stacked"></i>
                        </div>
                    </div>
                    <div class="p-6 flex-1 flex flex-col justify-between">
                        <div>
                            <h4 class="font-bold text-white text-base mb-2">${isEn ? 'Smart Inventory Management' : 'Estoque Digital Inteligente'}</h4>
                            <p class="text-stone-400 text-xs leading-relaxed">${isEn ? 'Track inputs and outputs with automated shortage alerts and instant restock notifications.' : 'Controle digital de entrada e saída de insumos com alerta de estoque mínimo e integração.'}</p>
                        </div>
                        <span class="text-[10px] text-[#2EFF00] font-bold uppercase tracking-wider mt-4 block border-t border-stone-850 pt-4">${isEn ? 'Focus: Organization' : 'Foco: Organização & Agilidade'}</span>
                    </div>
                </div>

                <!-- Processos -->
                <div class="group bg-stone-950/80 rounded-2xl border border-stone-850 hover:border-[#2EFF00]/50 hover:shadow-[0_0_30px_rgba(46,255,0,0.15)] transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden">
                    <div class="h-40 w-full overflow-hidden relative">
                        <div class="absolute inset-0 bg-gradient-to-t from-stone-950/90 to-transparent z-10"></div>
                        <img src="../template-silva-autocenter/upsell_processos.png" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Process">
                        <div class="absolute bottom-4 left-6 z-20 w-10 h-10 bg-[#2EFF00] rounded-xl flex items-center justify-center text-black text-lg shadow-lg">
                            <i class="fa-solid fa-clock-rotate-left"></i>
                        </div>
                    </div>
                    <div class="p-6 flex-1 flex flex-col justify-between">
                        <div>
                            <h4 class="font-bold text-white text-base mb-2">${isEn ? 'Business Process Optimization' : 'Otimização de Processos'}</h4>
                            <p class="text-stone-400 text-xs leading-relaxed">${isEn ? 'Digital mapping of operational workflows to identify bottlenecks and maximize team output.' : 'Mapeamento e automação de fluxos operacionais para remover gargalos e acelerar a produtividade.'}</p>
                        </div>
                        <span class="text-[10px] text-[#2EFF00] font-bold uppercase tracking-wider mt-4 block border-t border-stone-850 pt-4">${isEn ? 'Focus: Productivity' : 'Foco: Produtividade Técnica'}</span>
                    </div>
                </div>

                <!-- E-commerce -->
                <div class="group bg-stone-950/80 rounded-2xl border border-stone-850 hover:border-[#2EFF00]/50 hover:shadow-[0_0_30px_rgba(46,255,0,0.15)] transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden">
                    <div class="h-40 w-full overflow-hidden relative">
                        <div class="absolute inset-0 bg-gradient-to-t from-stone-950/90 to-transparent z-10"></div>
                        <img src="../template-silva-autocenter/upsell_ecommerce.png" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="E-commerce">
                        <div class="absolute bottom-4 left-6 z-20 w-10 h-10 bg-[#2EFF00] rounded-xl flex items-center justify-center text-black text-lg shadow-lg">
                            <i class="fa-solid fa-cart-shopping"></i>
                        </div>
                    </div>
                    <div class="p-6 flex-1 flex flex-col justify-between">
                        <div>
                            <h4 class="font-bold text-white text-base mb-2">${isEn ? 'E-commerce & Digital Catalog' : 'Loja de Peças & Acessórios'}</h4>
                            <p class="text-stone-400 text-xs leading-relaxed">${isEn ? 'Online store integration allowing clients to buy services, products, and schedule installations in advance.' : 'Loja virtual integrada para venda online de produtos ou serviços adicionais com pagamento online.'}</p>
                        </div>
                        <span class="text-[10px] text-[#2EFF00] font-bold uppercase tracking-wider mt-4 block border-t border-stone-850 pt-4">${isEn ? 'Focus: New Sales Channels' : 'Foco: Canal de Vendas Extra'}</span>
                    </div>
                </div>
            </div>

            <!-- Formulário Upsell -->
            <div class="bg-stone-950/90 p-8 rounded-2xl border border-stone-800 shadow-inner">
                <h4 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <i class="fa-solid fa-paper-plane text-[#2EFF00]"></i> ${isEn ? 'Request Expansion Details' : 'Solicitar Orçamento das Expansões'}
                </h4>
                <p class="text-stone-400 text-xs mb-6">${isEn ? 'Select the module you want. Our development team will analyze your infrastructure and send a custom quote.' : 'Selecione o módulo de seu interesse. Nossa equipe de arquitetura técnica analisará a infraestrutura necessária e enviará o orçamento detalhado.'}</p>
                
                <form id="form-upsell" class="space-y-4 text-xs">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" id="upsell-nome" placeholder="${isEn ? 'Your Name' : 'Seu Nome / Responsável'}" class="w-full bg-stone-900 px-4 py-3 rounded-xl border border-stone-800 focus:outline-none focus:border-[#2EFF00] text-white placeholder-stone-600 text-xs transition" required>
                        <input type="email" id="upsell-email" placeholder="${isEn ? 'Corporate Email' : 'E-mail Corporativo'}" class="w-full bg-stone-900 px-4 py-3 rounded-xl border border-stone-800 focus:outline-none focus:border-[#2EFF00] text-white placeholder-stone-600 text-xs transition" required>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select id="upsell-servico" class="w-full bg-stone-900 px-4 py-3 rounded-xl border border-stone-800 focus:outline-none focus:border-[#2EFF00] text-stone-400 text-xs transition" required>
                            <option value="" disabled selected>${isEn ? 'Select Module' : 'Selecione o Módulo Tecnológico'}</option>
                            <option value="crm">CRM</option>
                            <option value="dashboard">Dashboard</option>
                            <option value="bot">WhatsApp Bot</option>
                            <option value="estoque">${isEn ? 'Smart Inventory' : 'Estoque Digital'}</option>
                            <option value="otimizacao">${isEn ? 'Process Optimization' : 'Otimização de Processos'}</option>
                            <option value="ecommerce">E-commerce</option>
                        </select>
                        <input type="tel" id="upsell-whatsapp" placeholder="${isEn ? 'WhatsApp Phone' : 'WhatsApp para Contato'}" class="w-full bg-stone-900 px-4 py-3 rounded-xl border border-stone-800 focus:outline-none focus:border-[#2EFF00] text-white placeholder-stone-600 text-xs transition" required>
                    </div>
                    <button type="submit" class="w-full bg-[#2EFF00] hover:bg-[#28e600] text-black font-bold py-4 rounded-xl transition shadow-lg shadow-[#2EFF00]/20 border border-[#2EFF00]/10 text-xs uppercase tracking-wider">${isEn ? 'Submit Request' : 'Enviar Solicitação de Adicionais'}</button>
                </form>
            </div>
        </div>
    </div>
</section>
  `;

  return dossieHtml + propostaHtml;
}

function generateScripts(cName, isEn) {
  return `
<script>
    // FAQ Accordion (Nativo simples compatível com layouts existentes)
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-btn') || item.querySelector('summary');
        if (btn) {
            btn.addEventListener('click', () => {
                if (item.classList.contains('border-secondary/25')) {
                    const isActive = item.classList.contains('active');
                    faqItems.forEach(i => {
                        if (i.classList.contains('border-secondary/25')) {
                            i.classList.remove('active');
                            const ans = i.querySelector('.faq-answer');
                            if (ans) ans.style.maxHeight = null;
                        }
                    });
                    if (!isActive) {
                        item.classList.add('active');
                        const ans = item.querySelector('.faq-answer');
                        if (ans) ans.style.maxHeight = ans.scrollHeight + "px";
                    }
                }
            });
        }
    });
    
    // Scroll Navbar Effect
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        if (nav) {
            if (window.scrollY > 50) {
                nav.classList.remove('top-10');
                nav.classList.add('top-0', 'shadow-md');
            } else {
                const statusCache = localStorage.getItem('escom_lead_status');
                if (statusCache !== 'pago') {
                    nav.classList.remove('top-0');
                    nav.classList.add('top-10');
                }
            }
        }
    });

    // Accept Proposal Event Handler
    const btnAceitar = document.getElementById('btn-aceitar-proposta');
    if (btnAceitar) {
        btnAceitar.addEventListener('click', function(e) {
            e.preventDefault();
            btnAceitar.innerHTML = '${isEn ? 'Processing...' : 'Processando...'}';
            btnAceitar.classList.add('opacity-80', 'cursor-wait');

            setTimeout(() => {
                const leadData = {
                    id: 'lead_' + Date.now(),
                    empresa: '${cName}',
                    status: 'pagamento_pendente',
                    valor: 990,
                    data: new Date().toISOString()
                };
                
                localStorage.setItem('escom_new_lead_conversion', JSON.stringify(leadData));
                window.dispatchEvent(new CustomEvent('escom-lead-converted', { detail: leadData }));

                btnAceitar.innerHTML = '${isEn ? 'PROPOSAL ACCEPTED!' : 'PROPOSTA ACEITA!'}';
                btnAceitar.classList.remove('bg-[#2EFF00]', 'hover:bg-[#28e600]', 'text-black', 'cursor-wait');
                btnAceitar.classList.add('bg-zinc-800', 'text-[#2EFF00]', 'border', 'border-[#2EFF00]', 'cursor-not-allowed');
                
                alert("${isEn ? 'Thank you! Your acceptance has been registered. The ESCOM Studio team will contact you shortly.' : 'Obrigado! Seu aceite foi registrado. A equipe da ESCOM Studio entrará em contato para os detalhes de faturamento.'}");
            }, 1500);
        });
    }

    // Client Mode Check
    function verificarStatusDoLead() {
        const statusCache = localStorage.getItem('escom_lead_status');
        if (statusCache === 'pago') {
            const banner = document.getElementById('banner-urgencia');
            const dossie = document.getElementById('dossie-comercial');
            const proposta = document.getElementById('proposta-comercial');
            const navbar = document.getElementById('navbar');
            
            if (banner) banner.style.display = 'none';
            if (navbar) {
                navbar.classList.remove('top-10');
                nav.classList.add('top-0');
            }
            if (dossie) dossie.style.display = 'none';
            if (proposta) proposta.style.display = 'none';
        }
    }
    verificarStatusDoLead();
    window.addEventListener('storage', (e) => {
        if (e.key === 'escom_lead_status' && e.newValue === 'pago') {
            verificarStatusDoLead();
        }
    });

    // Blindagem Anti-Cópia Silenciosa
    document.addEventListener('contextmenu', event => event.preventDefault());
    document.addEventListener('keydown', (e) => {
        const isCopying = (e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C');
        const isSaving = (e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S');
        const isPrinting = (e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P');
        const isPrintScreen = e.key === 'PrintScreen';
        const isMacSnippet = e.metaKey && e.shiftKey;

        if (isCopying || isSaving || isPrinting || isPrintScreen || isMacSnippet) {
            e.preventDefault();
        }
    });
    document.addEventListener('copy', (e) => {
        e.clipboardData.setData('text/plain', '');
        e.preventDefault();
    });
</script>
  `;
}

function generateGsapScript(isChiro) {
  const animateSectionsStr = `
            { id: '#dilema-visual', x: -40, y: 0 },
            { id: '#dilema-text', x: 40, y: 0 },
            { id: '#pilares-grid > div', trigger: '#pilares-grid', x: 0, y: 40, stagger: 0.15 },
            { id: '#tec-text', x: -40, y: 0 },
            { id: '#tec-visual', x: 40, y: 0 },
            { id: '#jornada-flow', x: 0, y: 40 },
            { id: '#equipe-visual', x: -40, y: 0 },
            { id: '#equipe-text', x: 40, y: 0 },
            { id: '#galeria-grid > div', trigger: '#galeria-grid', x: 0, y: 30, stagger: 0.12 },
            { id: '#depoimentos-grid > div', trigger: '#depoimentos-grid', x: 0, y: 30, stagger: 0.15 },
            { id: '#faq-accordion > div', trigger: '#faq-accordion', x: 0, y: 25, stagger: 0.1 }
  `;

  return `
<script>
    // --- GSAP Animações com ScrollTrigger (Versão Ultra Estável com ResizeObserver) ---
    window.addEventListener('load', () => {
        gsap.registerPlugin(ScrollTrigger);

        // Hero Fade In
        gsap.from('#hero-content', {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: 'power3.out'
        });
        gsap.from('#hero-image', {
            opacity: 0,
            scale: 0.95,
            duration: 1.2,
            delay: 0.3,
            ease: 'power2.out'
        });

        // Configuração das Seções a serem animadas
        const animateSections = [
            ${animateSectionsStr}
        ];

        // Inicializar ScrollTriggers nativos
        animateSections.forEach(item => {
            const elements = document.querySelectorAll(item.id);
            const triggerEl = item.trigger ? document.querySelector(item.trigger) : document.querySelector(item.id);
            if (elements.length === 0 || !triggerEl) return;

            gsap.from(elements, {
                scrollTrigger: {
                    trigger: triggerEl,
                    start: 'top 95%', // Dispara logo no início da entrada na tela
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                x: item.x || 0,
                y: item.y || 0,
                stagger: item.stagger || 0,
                duration: 0.9,
                ease: 'power2.out'
            });
        });

        // ResizeObserver no body para recalcular ScrollTrigger dinamicamente em reflows (essencial para Tailwind CDN)
        if (window.ResizeObserver) {
            const ro = new ResizeObserver(() => {
                ScrollTrigger.refresh();
            });
            ro.observe(document.body);
        }

        // Refreshes periódicos de segurança
        setTimeout(() => ScrollTrigger.refresh(), 200);
        setTimeout(() => ScrollTrigger.refresh(), 800);
        setTimeout(() => ScrollTrigger.refresh(), 2000);
    });
</script>
  `;
}

const companies = [
  {
    dir: 'template-oralfix',
    display: 'Oral Fix - Odontologia Especializada',
    isEn: false,
    pdfUrl: 'dossie.pdf',
    isChiro: false
  },
  {
    dir: 'template-chiroandmovement',
    display: 'Miami Chiropractic & Movement',
    isEn: true,
    pdfUrl: 'dossie.pdf',
    isChiro: true
  }
];

companies.forEach(company => {
  const filePath = path.join(basePath, company.dir, 'index.html');
  if (!fs.existsSync(filePath)) {
    console.error(`Erro: arquivo não encontrado ${filePath}`);
    return;
  }

  console.log(`\nProcessando ${company.display} (${filePath})...`);
  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Injetar CSS de Shimmer nas tags style se não existir
  if (!html.includes('btn-pdf-shimmer')) {
    const styleEndIndex = html.indexOf('</style>');
    if (styleEndIndex !== -1) {
      html = html.substring(0, styleEndIndex) + escomStyles + html.substring(styleEndIndex);
      console.log('  -> CSS de shimmer injetado com sucesso.');
    }
  }

  // 2. Fatiar o HTML no rodapé original para remover as seções comerciais incorretas
  const footerCloseTag = '</footer>';
  const footerIndex = html.lastIndexOf(footerCloseTag);
  if (footerIndex === -1) {
    console.error(`  -> Erro crítico: a tag ${footerCloseTag} não foi encontrada!`);
    return;
  }

  // Pegamos a primeira parte até o fechamento do footer
  const bodyBase = html.substring(0, footerIndex + footerCloseTag.length);

  // 3. Gerar as novas seções de prospecção comercial da ESCOM Studio
  const commercialSections = generateCommercialSections(company);

  // 4. Gerar scripts comerciais gerais e script GSAP estável
  const ctrlScripts = generateScripts(company.display, company.isEn);
  const gsapScript = generateGsapScript(company.isChiro);

  // 5. Unir tudo e fechar o documento
  const newHtml = bodyBase + '\n' + commercialSections + '\n' + ctrlScripts + '\n' + gsapScript + '\n</body>\n</html>';

  // Gravar no arquivo original
  fs.writeFileSync(filePath, newHtml, 'utf8');
  console.log(`  -> Sucesso! ${company.display} index.html atualizado.`);
});

console.log('\n--- Patches aplicados com sucesso nas páginas Oralfix e Chiropractic! ---');
