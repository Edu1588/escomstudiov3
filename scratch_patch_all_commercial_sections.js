import fs from 'fs';
import path from 'path';

const basePath = 'public';

// 1. Configurações de Estilos por Nicho para FAQ e Formulário
const stylingConfigs = {
  belini: {
    faqBg: 'bg-[#fbf9f8] border-t border-outline-variant/10',
    faqText: 'text-on-background',
    faqTitle: 'text-primary',
    faqDesc: 'text-on-surface-variant',
    faqItemBg: 'bg-surface border border-outline-variant/20',
    faqItemActiveBorder: 'hover:border-primary/40',
    faqSummaryOpen: 'group-open:text-primary',
    faqSummaryText: 'text-on-surface',
    faqAnswerText: 'text-on-surface-variant border-t border-outline-variant/10',
    formBg: 'bg-[#fbf9f8]',
    formCardBg: 'bg-surface border border-outline-variant/20',
    formTitle: 'text-primary',
    formInput: 'bg-surface border border-outline-variant/30 focus:border-primary text-on-surface placeholder-on-surface-variant/50',
    formButton: 'bg-primary hover:bg-primary-container text-on-primary'
  },
  clinica: {
    faqBg: 'bg-implart-50/50 border-t border-purple-100',
    faqText: 'text-slate-900',
    faqTitle: 'text-implart-700',
    faqDesc: 'text-slate-600',
    faqItemBg: 'bg-white border border-purple-100',
    faqItemActiveBorder: 'hover:border-implart-500/50',
    faqSummaryOpen: 'group-open:text-implart-600',
    faqSummaryText: 'text-slate-800',
    faqAnswerText: 'text-slate-650 border-t border-purple-50',
    formBg: 'bg-implart-50/30',
    formCardBg: 'bg-white border border-purple-100',
    formTitle: 'text-implart-900',
    formInput: 'bg-slate-50 border border-purple-150 focus:border-implart-500 text-slate-900 placeholder-slate-400',
    formButton: 'bg-implart-600 hover:bg-implart-700 text-white'
  },
  giovana: {
    faqBg: 'bg-[#fbf9f8] border-t border-outline-variant/10',
    faqText: 'text-on-background',
    faqTitle: 'text-primary',
    faqDesc: 'text-on-surface-variant',
    faqItemBg: 'bg-surface border border-outline-variant/20',
    faqItemActiveBorder: 'hover:border-primary/40',
    faqSummaryOpen: 'group-open:text-primary',
    faqSummaryText: 'text-on-surface',
    faqAnswerText: 'text-on-surface-variant border-t border-outline-variant/10',
    formBg: 'bg-[#fbf9f8]',
    formCardBg: 'bg-surface border border-outline-variant/20',
    formTitle: 'text-primary',
    formInput: 'bg-surface border border-outline-variant/30 focus:border-primary text-on-surface placeholder-on-surface-variant/50',
    formButton: 'bg-primary hover:bg-primary/90 text-on-primary'
  },
  silva: {
    faqBg: 'bg-[#0c0a09] border-t border-stone-850',
    faqText: 'text-stone-100',
    faqTitle: 'text-mecanica-500',
    faqDesc: 'text-stone-400',
    faqItemBg: 'bg-[#1c1917] border border-stone-800',
    faqItemActiveBorder: 'hover:border-mecanica-500/50',
    faqSummaryOpen: 'group-open:text-mecanica-500',
    faqSummaryText: 'text-white',
    faqAnswerText: 'text-stone-300 border-t border-stone-800',
    formBg: 'bg-[#1c1917]/50',
    formCardBg: 'bg-[#0c0a09] border border-stone-800',
    formTitle: 'text-white',
    formInput: 'bg-[#1c1917] border border-stone-800 focus:border-mecanica-500 text-white placeholder-stone-500',
    formButton: 'bg-mecanica-600 hover:bg-mecanica-500 text-[#1c1917] font-bold'
  },
  chiropractic: {
    faqBg: 'bg-[#050c0f] border-t border-slate-800/85',
    faqText: 'text-slate-100',
    faqTitle: 'text-brand-500',
    faqDesc: 'text-slate-400',
    faqItemBg: 'bg-[#0a191e] border border-slate-800',
    faqItemActiveBorder: 'hover:border-brand-500/50',
    faqSummaryOpen: 'group-open:text-brand-500',
    faqSummaryText: 'text-white',
    faqAnswerText: 'text-slate-300 border-t border-slate-800',
    formBg: 'bg-[#0a191e]/50',
    formCardBg: 'bg-[#050c0f] border border-slate-800',
    formTitle: 'text-white',
    formInput: 'bg-[#0a191e] border border-slate-800 focus:border-brand-500 text-white placeholder-slate-500',
    formButton: 'bg-brand-500 hover:bg-brand-600 text-white'
  },
  austin: {
    faqBg: 'bg-[#131313] border-t border-stone-800/80',
    faqText: 'text-[#e5e2e1]',
    faqTitle: 'text-primary',
    faqDesc: 'text-stone-400',
    faqItemBg: 'bg-[#1c1b1b] border border-stone-800',
    faqItemActiveBorder: 'hover:border-primary/50',
    faqSummaryOpen: 'group-open:text-primary',
    faqSummaryText: 'text-white',
    faqAnswerText: 'text-stone-300 border-t border-stone-800',
    formBg: 'bg-[#1c1b1b]/50',
    formCardBg: 'bg-[#131313] border border-stone-800',
    formTitle: 'text-white',
    formInput: 'bg-[#1c1b1b] border border-stone-800 focus:border-primary text-white placeholder-stone-500',
    formButton: 'bg-primary hover:bg-[#99adff] text-on-primary'
  },
  elizabete: {
    faqBg: 'bg-[#fdfbf9] border-t border-[#e8d3c3]/30',
    faqText: 'text-[#2a241e]',
    faqTitle: 'text-[#07dc40]',
    faqDesc: 'text-[#5a4d41]',
    faqItemBg: 'bg-white border border-[#e8d3c3]/40',
    faqItemActiveBorder: 'hover:border-[#07dc40]/50',
    faqSummaryOpen: 'group-open:text-[#07dc40]',
    faqSummaryText: 'text-[#2a241e]',
    faqAnswerText: 'text-[#5a4d41] border-t border-[#e8d3c3]/30',
    formBg: 'bg-[#faf8f5]',
    formCardBg: 'bg-white border border-[#e8d3c3]/40 shadow-sm',
    formTitle: 'text-[#2a241e]',
    formInput: 'bg-[#fdfbf9] border border-[#e8d3c3]/50 focus:border-[#07dc40] text-[#2a241e] placeholder-[#a69888]',
    formButton: 'bg-[#07dc40] hover:bg-[#00b5ab] text-black font-bold transition-all duration-300 hover:scale-[1.02]'
  },
  skozi: {
    faqBg: 'bg-[#faf9f9] border-t border-[#D4AF37]/20',
    faqText: 'text-[#1b1c1c]',
    faqTitle: 'text-[#E91E63]',
    faqDesc: 'text-[#5e5e5c]',
    faqItemBg: 'bg-white border border-[#000]/5',
    faqItemActiveBorder: 'hover:border-[#E91E63]/40',
    faqSummaryOpen: 'group-open:text-[#E91E63]',
    faqSummaryText: 'text-[#1b1c1c]',
    faqAnswerText: 'text-[#5e5e5c] border-t border-[#000]/5',
    formBg: 'bg-[#faf9f9]',
    formCardBg: 'bg-white border border-[#000]/5 shadow-sm',
    formTitle: 'text-[#1b1c1c]',
    formInput: 'bg-[#faf9f9] border border-[#000]/10 focus:border-[#E91E63] text-[#1b1c1c] placeholder-[#5e5e5c]/50',
    formButton: 'bg-gradient-to-r from-[#E91E63] to-[#b80049] hover:opacity-90 text-white font-bold transition-all duration-300 hover:scale-[1.02]'
  }
};

// 2. Dados de FAQ por Nicho
const faqData = {
  belini: [
    {
      q: "Como funciona o agendamento de procedimentos?",
      a: "Todo o agendamento é feito de forma digital e prioritária. Após o contato inicial, agendamos uma avaliação detalhada onde analisamos a musculatura facial e a pele para planejar tratamentos como toxina botulínica e bioestimuladores de colágeno de forma personalizada."
    },
    {
      q: "Os resultados dos procedimentos ficam naturais?",
      a: "Sim! A filosofia da Clínica Belini é focar na harmonização sutil e elegante, realçando a beleza natural do paciente sem exageros ou feições artificiais (\"congeladas\")."
    },
    {
      q: "Qual o tempo de recuperação (downtime)?",
      a: "A maioria dos procedimentos injetáveis permite o retorno imediato às atividades normais. Procedimentos como bioestimuladores podem causar leve inchaço temporário, que é controlado com nossa rotina de cuidados pós-aplicação."
    },
    {
      q: "Qual a durabilidade dos tratamentos como Botox e Preenchimento?",
      a: "A toxina botulínica (Botox) costuma durar entre 4 e 6 meses, enquanto os preenchimentos com ácido hialurônico podem durar de 12 a 18 meses, variando conforme o metabolismo individual do paciente."
    },
    {
      q: "A partir de qual idade é recomendada a harmonização facial preventiva?",
      a: "Não existe idade fixa, mas a partir dos 25 anos começamos a perder colágeno de forma natural. Procedimentos preventivos sutis podem ser iniciados para manter a sustentação e viço da pele."
    },
    {
      q: "Quais são as marcas e a procedência dos produtos injetáveis?",
      a: "Trabalhamos exclusivamente com marcas importadas de referência científica global (ex: Botox, Restylane, Radiesse, Sculptra), todas liberadas pela Anvisa e com rastreabilidade total de lote."
    }
  ],
  clinica: [
    {
      q: "Como funciona o tratamento com sedação consciente?",
      a: "Contamos com uma equipe médica anestesista que realiza a sedação endovenosa na própria clínica. O paciente dorme confortavelmente durante a cirurgia de implantes e acorda sem qualquer lembrança de dor ou barulho de motorzinho."
    },
    {
      q: "O que é a carga imediata?",
      a: "É a técnica onde instalamos os dentes fixos provisórios sobre os implantes in até 72 horas após a cirurgia, permitindo que o paciente recupere a mastigação e estética sem precisar usar dentaduras móveis durante a cicatrização."
    },
    {
      q: "Quais as vantagens do laboratório CAD/CAM interno?",
      a: "Nosso laboratório digital próprio conta com scanners 3D e impressoras 3D/fresadoras que produzem os dentes de porcelana ou zircônia em minutos, garantindo precisão milimétrica e agilidade máxima sem depender de laboratórios terceiros."
    },
    {
      q: "Qual o tempo médio de cicatrização para fixação do implante definitivo?",
      a: "A cicatrização biológica do implante (osseointegração) leva em média de 3 a 6 meses. Durante esse período, o paciente usa dentes provisórios confortáveis antes de receber a prótese definitiva em cerâmica."
    },
    {
      q: "O procedimento de instalação de implantes dentários provoca dor?",
      a: "Não! A cirurgia é 100% indolor por ser feita sob anestesia local de última geração associada, quando preferido, à sedação médica. O pós-operatório é controlado com medicação analgésica preventiva."
    },
    {
      q: "Quais as opções de pagamento e financiamento do tratamento?",
      a: "Oferecemos condições personalizadas de parcelamento, convênios parceiros e financiamentos específicos de saúde para tornar o seu tratamento de reabilitação oral viável e confortável."
    }
  ],
  giovana: [
    {
      q: "O projeto inclui a maquete eletrônica (3D)?",
      a: "Sim! Desenvolvemos imagens 3D fotorrealistas de todos os ambientes. Você poderá visualizar com precisão as cores, iluminação, revestimentos e marcenaria antes de iniciar a obra física."
    },
    {
      q: "O que é o projeto executivo?",
      a: "É o conjunto de desenhos técnicos detalhados necessários para a obra (pontos de tomada, iluminação, paginação de gesso/piso, marmoraria e detalhamento técnico de marcenaria) que evita erros de execução e desperdício de material."
    },
    {
      q: "Como funciona o acompanhamento de obras?",
      a: "Realizamos visitas técnicas periódicas à obra para alinhar os detalhes com o empreiteiro, tirar dúvidas técnicas e garantir que tudo seja executado de acordo com o projeto de arquitetura aprovado."
    },
    {
      q: "Qual o prazo médio para entrega do projeto completo?",
      a: "O prazo varia conforme a complexidade do imóvel, mas geralmente fica entre 30 e 45 dias úteis, divididos em etapas que incluem briefing, estudo preliminar, imagens 3D e detalhamento executivo."
    },
    {
      q: "Como é definida a paleta de cores e estilo dos móveis?",
      a: "Definimos o conceito visual através de um briefing detalhado e painéis semânticos de estilo. Unimos as preferências do cliente às regras de proporção, iluminação natural e psicologia das cores."
    },
    {
      q: "Vocês desenvolvem projetos compatíveis com o orçamento de obra?",
      a: "Sim! Trabalhamos com uma estimativa de custos de materiais e acabamentos já no início do projeto, selecionando revestimentos e marcenarias que caibam exatamente na projeção financeira do cliente."
    }
  ],
  silva: [
    {
      q: "Como funciona o orçamento por WhatsApp?",
      a: "Gravamos vídeos explicativos e tiramos fotos das peças gastas do seu carro, enviando tudo de forma clara via WhatsApp com o valor detalhado antes de iniciar o serviço. Transparência total."
    },
    {
      q: "O serviço de Leva-e-Traz cobra alguma taxa?",
      a: "Não cobramos taxa! O Leva-e-Traz é 100% gratuito para serviços agendados acima de R$ 300,00 e que estejam localizados dentro do raio de até 8km da nossa oficina."
    },
    {
      q: "Qual a garantia dos serviços?",
      a: "Oferecemos 1 ano (12 meses) de garantia real na mão de obra e nas peças selecionadas de primeira linha, garantindo total segurança para você e sua família."
    },
    {
      q: "Com qual frequência devo realizar o alinhamento e balanceamento?",
      a: "Recomendamos fazer o alinhamento e balanceamento a cada 10.000 km rodados, após trocas de pneus, ou imediatamente se notar trepidações no volante ou desgaste irregular."
    },
    {
      q: "Quais marcas de óleo e filtros vocês utilizam?",
      a: "Utilizamos exclusivamente lubrificantes sintéticos homologados pelas montadoras e filtros de marcas renomadas (como Fram, Mann ou Bosch) para estender a vida útil do seu motor."
    },
    {
      q: "Vocês aceitam cartões e parcelamento?",
      a: "Sim! Aceitamos cartões de crédito e débito, pix e oferecemos parcelamentos especiais sem juros para reparos mecânicos completos."
    }
  ],
  chiropractic: [
    {
      q: "What is a chiropractic adjustment?",
      a: "A chiropractic adjustment is a precise, controlled force applied to a spinal joint to restore proper alignment, improve range of motion, and relieve nerve pressure/back pain."
    },
    {
      q: "Are chiropractic treatments safe?",
      a: "Yes, chiropractic care is widely recognized as one of the safest drug-free, non-invasive therapies available for back pain, neck pain, and joint issues."
    },
    {
      q: "How many sessions will I need?",
      a: "This depends on your condition, pain level, and lifestyle. After your initial evaluation, our clinical team will outline a personalized treatment plan for fast relief."
    },
    {
      q: "Does the chiropractic adjustment hurt?",
      a: "Generally, adjustments are painless. Many patients experience immediate relief or a feeling of release. Some mild soreness may occur afterwards, similar to starting a new exercise."
    },
    {
      q: "Can I seek chiropractic care if I am pregnant?",
      a: "Absolutely! Chiropractic adjustments are safe and beneficial during pregnancy, helping to balance the pelvis, reduce lower back stress, and improve overall alignment."
    },
    {
      q: "Do you accept health insurance or payment plans?",
      a: "We work with many major insurance providers and offer transparent self-pay rates and convenient family package plans to keep your spine care affordable."
    }
  ],
  austin: [
    {
      q: "How does personal training work here?",
      a: "We design completely custom workout plans based on your fitness level, goals, and mobility. Every session is guided by a certified trainer in a private environment."
    },
    {
      q: "Do you provide nutrition support?",
      a: "Yes, all our premium coaching programs include nutritional counseling, calorie target setting, and body composition tracking (InBody scans)."
    },
    {
      q: "What is your cancellation policy?",
      a: "We request a 24-hour notice for any session rescheduling to ensure we can accommodate other clients and optimize trainer availability."
    },
    {
      q: "I haven't worked out in years, can I still join?",
      a: "Yes! We specialize in starting from where you are today. All workouts are scaled to your current conditioning, strength, and past injuries to prevent burnout."
    },
    {
      q: "What should I bring to my first personal training session?",
      a: "Just wear comfortable athletic clothing, supportive training shoes, and bring a water bottle. We provide fresh towels, locker rooms, and all training gear."
    },
    {
      q: "How fast will I start seeing weight loss or muscle results?",
      a: "Most clients notice improvements in energy levels, sleep quality, and strength within the first 2-3 weeks. Visual muscle definition changes typically appear in 6-8 weeks."
    }
  ],
  elizabete: [
    {
      q: "Como funciona o agendamento de procedimentos com a Dra. Elizabete?",
      a: "Todo o agendamento é feito de forma digital e prioritária. Após o contato inicial, agendamos uma avaliação detalhada onde analisamos a musculatura facial e a pele para planejar tratamentos como toxina botulínica e bioestimuladores de colágeno de forma personalizada."
    },
    {
      q: "Os resultados dos procedimentos ficam naturais?",
      a: "Sim! A filosofia da Dra. Elizabete De Marchi é focar na harmonização sutil e elegante, realçando a beleza natural de cada paciente com refinamento técnico e sem exageros artificiais."
    },
    {
      q: "Qual o tempo de recuperação (downtime)?",
      a: "A maioria dos procedimentos de Biomedicina Estética permite o retorno imediato às atividades normais. Procedimentos como bioestimuladores podem causar leve inchaço temporário, que é conhecido e controlado com nossa rotina de cuidados pós-aplicação."
    },
    {
      q: "Quais são as marcas de produtos utilizadas?",
      a: "Trabalhamos apenas com produtos de altíssima qualidade e reconhecidos globalmente (ex: Botox, Restylane, Radiesse, Sculptra), todos devidamente liberados pela Anvisa para garantir máxima eficácia e segurança."
    },
    {
      q: "O tratamento para Melasma é definitivo?",
      a: "O Melasma é uma condição crônica, porém, com nossos protocolos avançados de microagulhamento, peelings químicos e skincare domiciliar, conseguimos clarear as manchas significativamente e manter a pele uniforme com manutenção contínua."
    },
    {
      q: "A partir de qual idade posso fazer o preenchimento labial?",
      a: "O preenchimento labial pode ser realizado em pacientes a partir dos 18 anos. Realizamos uma avaliação para entender os desejos da paciente, seja para hidratação (Skinbooster) ou volume, sempre respeitando a proporção áurea facial."
    }
  ],
  skozi: [
    {
      q: "Como funciona a curadoria de peças da Skoziê?",
      a: "Nossa curadoria é focada em peças premium de tecidos nobres, modelagens impecáveis e acabamento de alta costura. Selecionamos vestidos de festa, alfaiataria moderna e casual de luxo para vestir a mulher contemporânea com exclusividade e elegância."
    },
    {
      q: "Como encontro o tamanho ideal para o meu corpo?",
      a: "Oferecemos uma tabela de medidas detalhada em nossa boutique e, além disso, nossa equipe de consultoria de estilo está disponível em tempo integral no WhatsApp para lhe ajudar a escolher a modelagem e caimento perfeitos para suas curvas."
    },
    {
      q: "Qual o prazo de entrega das coleções em Goiânia?",
      a: "Oferecemos o serviço de entrega expressa via motoboy no mesmo dia para toda a região de Goiânia e Aparecida de Goiânia. Para outras cidades do Brasil, enviamos no mesmo dia útil com prazos que variam de 2 a 7 dias."
    },
    {
      q: "A Skoziê possui loja física em Goiânia?",
      a: "Sim! Nosso Closet físico fica localizado na Av. T-6, nº 201, no Setor Bueno, um dos corações da moda de Goiânia. Oferecemos atendimento sob agendamento prévio pelo WhatsApp para uma experiência de consultoria 100% personalizada e reservada."
    },
    {
      q: "Como funcionam as trocas e devoluções de peças?",
      a: "Você tem até 7 dias corridos após o recebimento para solicitar a troca ou devolução do produto. A peça deve estar com a etiqueta original fixada, sem sinais de uso ou lavagem."
    },
    {
      q: "Quais são as formas de pagamento na boutique?",
      a: "Aceitamos Pix com desconto exclusivo nas coleções vigentes e parcelamentos no cartão de crédito em até 6x sem juros para garantir conforto em suas compras premium."
    }
  ]
};

// 3. Função para gerar FAQ do cliente
function generateFaqHtml(key) {
  const style = stylingConfigs[key];
  const items = faqData[key];
  const isEn = key === 'chiropractic' || key === 'austin';
  const title = isEn ? 'Frequently Asked Questions (FAQ)' : 'Dúvidas Frequentes (FAQ)';
  
  let itemsHtml = '';
  items.forEach(item => {
    itemsHtml += `
            <div class="${style.faqItemBg} p-6 rounded-xl cursor-pointer group transition-all duration-300 ${style.faqItemActiveBorder} faq-item">
                <details class="w-full">
                    <summary class="font-bold ${style.faqSummaryText} list-none flex justify-between items-center ${style.faqSummaryOpen} select-none">
                        <span>${item.q}</span>
                        <i class="fa-solid fa-chevron-down group-open:rotate-180 transition-transform duration-300"></i>
                    </summary>
                    <p class="text-sm ${style.faqDesc} mt-4 pl-1 leading-relaxed ${style.faqAnswerText} pt-4">
                        ${item.a}
                    </p>
                </details>
            </div>
    `;
  });

  return `
<!-- FAQ Section -->
<section class="py-24 ${style.faqBg}" id="faq">
    <div class="max-w-4xl mx-auto px-6">
        <h2 class="text-center text-3xl font-display font-extrabold ${style.faqText} mb-12">${title}</h2>
        <div class="space-y-4">
            ${itemsHtml}
        </div>
    </div>
</section>
  `;
}

// 4. Função para gerar Formulário de Contato do cliente
function generateContactHtml(key) {
  const style = stylingConfigs[key];
  const isEn = key === 'chiropractic' || key === 'austin';
  
  const formTitle = isEn ? 'Get in Touch' : 'Fale Conosco';
  const namePlaceholder = isEn ? 'Your Name' : 'Seu Nome';
  const wppPlaceholder = isEn ? 'Your Phone' : 'Seu WhatsApp';
  const descPlaceholder = isEn ? 'Describe your request or questions...' : 'Descreva sua solicitação ou dúvidas...';
  const btnText = isEn ? 'Send Message' : 'Enviar Mensagem';

  return `
<!-- Contact Section -->
<section class="py-24 ${style.formBg}" id="${isEn ? 'contact' : 'contato'}">
    <div class="max-w-4xl mx-auto ${style.formCardBg} p-8 md:p-12 rounded-3xl">
        <h4 class="text-2xl font-bold ${style.formTitle} mb-6 text-center">${formTitle}</h4>
        <form class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="${namePlaceholder}" class="w-full ${style.formInput} px-4 py-3 rounded-xl focus:outline-none transition">
                <input type="tel" placeholder="${wppPlaceholder}" class="w-full ${style.formInput} px-4 py-3 rounded-xl focus:outline-none transition">
            </div>
            <textarea rows="4" placeholder="${descPlaceholder}" class="w-full ${style.formInput} px-4 py-3 rounded-xl focus:outline-none transition"></textarea>
            <button type="submit" class="w-full ${style.formButton} font-bold py-4 rounded-xl transition shadow-lg hover:shadow-xl">${btnText}</button>
        </form>
    </div>
</section>
  `;
}

// 5. Função para gerar o HTML do Dossiê, Proposta e Upsells (ESCOM Studio Brand - Sempre Escuro/Neon)
function generateCommercialSections(company) {
  const isEn = company.isEn;
  const cName = company.display;
  const pdfUrl = company.pdfUrl;
  
  // Dossiê HTML
  const dossieHtml = `
<!-- SEÇÃO DO DOSSIÊ COMERCIAL (PDF/ESTRATÉGIA) -->
<section id="dossie-comercial" class="py-16 bg-[#111] text-center border-t-2 border-zinc-800">
    <div class="max-w-3xl mx-auto px-6">
        <h3 class="text-[#07dc40] font-mono text-xs font-bold uppercase tracking-widest mb-4"><i class="fa-solid fa-lock mr-2"></i> ${isEn ? 'Confidential Document' : 'Documento Confidencial'}</h3>
        <h2 class="text-3xl font-bold text-white mb-6">${isEn ? 'Strategic Analysis & Market Dossier' : 'Análise Estratégica & Dossiê de Mercado'}</h2>
        <p class="text-zinc-400 mb-8 text-sm">${isEn ? 'Restricted access to the conversion architecture study, local market insights, and financial projections for ' + cName : 'Acesso restrito ao estudo de arquitetura de conversão, dados reais de faturamento local e projeção financeira para ' + cName}.</p>
        <a href="${pdfUrl}" target="_blank" class="btn-pdf-shimmer active:scale-95 active:translate-y-[1px] bg-transparent hover:bg-stone-850 border-2 border-[#07dc40]/30 text-white font-bold py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-3 mx-auto group inline-flex hover:border-[#07dc40]">
            <i class="fa-solid fa-file-pdf text-[#07dc40] text-xl group-hover:scale-110 transition-transform"></i> ${isEn ? 'Access Strategic Dossier (PDF Analysis)' : 'Acessar Dossiê Estratégico (Acessar PDF da Análise)'}
        </a>
    </div>
</section>
  `;

  // Proposta HTML (Preço R$ 990 / $990)
  const propostaHtml = `
<!-- SEÇÃO COMERCIAL ESCOM STUDIO (PROPOSTA) -->
<section id="proposta-comercial" class="py-24 bg-[#0a0a0a] relative overflow-hidden text-white border-t-8 border-[#07dc40]">
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-stone-900/20 via-[#0a0a0a] to-[#0a0a0a] pointer-events-none"></div>
    
    <div class="container mx-auto px-6 max-w-6xl relative z-10">
        <div class="text-center mb-16">
            <span class="bg-[#07dc40]/10 text-[#07dc40] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-[#07dc40]/20 mb-6 inline-block">${isEn ? 'Exclusive ESCOM Studio Proposal' : 'Proposta Exclusiva ESCOM Studio'}</span>
            <h2 class="text-4xl md:text-5xl font-display font-extrabold text-white mb-6">${isEn ? 'Project Investment' : 'Investimento do Projeto'}</h2>
            <p class="text-zinc-400 max-w-2xl mx-auto text-lg">${isEn ? 'This is the exact financial scope for the implementation of your website, with high-performance design and conversion engineering.' : 'Este é o escopo financeiro exato para a implementação do site da sua empresa, com design de alta performance e engenharia de conversão voltada para captação.'}</p>
        </div>

        <!-- Card Principal de Preço -->
        <div class="max-w-2xl mx-auto bg-gradient-to-b from-stone-900/60 to-zinc-900/60 p-10 rounded-3xl border border-stone-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] mb-16 relative backdrop-blur-sm transform transition hover:scale-[1.01]">
            <div class="absolute top-0 right-0 bg-[#07dc40] text-black text-xs font-bold px-4 py-1 rounded-tr-3xl rounded-bl-xl z-20">${isEn ? 'CURRENT OFFER' : 'OFERTA DE PROSPECÇÃO'}</div>
            
            <h3 class="text-2xl font-bold mb-2">${isEn ? 'High-Conversion Website' : 'Website de Conversão Ativa'}</h3>
            <p class="text-zinc-400 text-sm mb-6 pb-6 border-b border-white/10">${isEn ? 'Custom UI/UX Design, Local SEO, Mobile-First Responsiveness, WhatsApp Integration, Persuasive Copywriting.' : 'Design UI/UX Sob Medida, Otimização de SEO, Responsividade Mobile-First, Integração WhatsApp, Copywriting Persuasivo.'}</p>
            
            <!-- Investimento Único (Sem parcelamento) -->
            <div class="bg-stone-950/85 border border-stone-800 rounded-2xl p-8 mb-8 relative shadow-[0_10px_30px_rgba(0,0,0,0.4)] mt-8 text-center">
                <div class="flex items-center justify-center gap-2 mb-4">
                    <i class="fa-solid fa-bolt text-[#07dc40] text-lg"></i>
                    <span class="text-[#07dc40] text-xs font-bold uppercase tracking-widest">${isEn ? 'Upfront Investment' : 'Investimento Único'}</span>
                </div>
                <div class="flex items-baseline justify-center gap-x-2">
                    <span class="text-2xl font-bold text-stone-400">${isEn ? '$' : 'R$'}</span>
                    <span class="text-5xl sm:text-6xl font-black text-[#07dc40] tracking-tighter drop-shadow-[0_0_15px_rgba(7, 220, 64,0.35)]">990</span>
                    <span class="text-lg font-medium text-stone-500">/${isEn ? 'single fee' : 'taxa única'}</span>
                </div>
                <p class="text-center text-stone-500 text-[10px] mt-4 font-semibold tracking-wider uppercase">${isEn ? 'PAYMENT VIA PIX, DEBIT, OR WIRE TRANSFER' : 'PAGAMENTO À VISTA VIA PIX OU TRANSFERÊNCIA'}</p>
            </div>

            <ul class="space-y-4 mb-10 text-sm text-zinc-300">
                <li class="flex items-center gap-3"><i class="fa-solid fa-check-circle text-[#07dc40] text-lg"></i> ${isEn ? 'Domain name registration & hosting setup' : 'Configuração completa de domínio e hospedagem'}</li>
                <li class="flex items-center gap-3"><i class="fa-solid fa-check-circle text-[#07dc40] text-lg"></i> ${isEn ? 'SEO optimization for Google Local Pack' : 'SEO integrado para posicionamento local'}</li>
                <li class="flex items-center gap-3"><i class="fa-solid fa-check-circle text-[#07dc40] text-lg"></i> ${isEn ? 'SSL Security Certificate Integration' : 'Certificado SSL de Conexão Segura'}</li>
                <li class="flex items-center gap-3"><i class="fa-solid fa-check-circle text-[#07dc40] text-lg"></i> ${isEn ? '30 Days of Priority Technical Support' : 'Suporte técnico prioritário de 30 dias'}</li>
                <li class="flex items-center gap-3"><i class="fa-solid fa-circle-info text-[#07dc40] text-lg"></i> <strong class="text-white">${isEn ? 'Single investment, no recurring monthly fees' : 'Investimento único, sem mensalidades ou taxas ocultas'}</strong></li>
            </ul>

            <button id="btn-aceitar-proposta" class="btn-pdf-shimmer w-full bg-[#07dc40] hover:bg-[#00b5ab] text-black text-lg font-black py-5 rounded-2xl transition-all shadow-lg shadow-[#07dc40]/30 flex items-center justify-center gap-3 group relative overflow-hidden">
                ${isEn ? 'ACCEPT PROPOSAL NOW' : 'ACEITAR PROPOSTA AGORA'} <i class="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
            </button>
            <p class="text-center text-xs text-zinc-500 mt-4"><i class="fa-solid fa-lock text-zinc-600 mr-1"></i> ${isEn ? 'Secure contract and invoice sent immediately after acceptance.' : 'Contrato e Nota Fiscal emitidos logo após a aprovação.'}</p>
        </div>

        <!-- Seção de Serviços Adicionais (Upsells) - 2 COLUNAS -->
        <div class="max-w-5xl mx-auto mt-24 bg-gradient-to-b from-[#1c1917]/40 to-[#0c0a09]/80 p-8 md:p-12 rounded-3xl border border-[#07dc40]/20 shadow-[0_0_50px_rgba(7, 220, 64,0.05)] relative backdrop-blur-md">
            <div class="absolute -top-4 left-8 bg-[#07dc40] text-black text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                ${isEn ? 'Advanced Expansions' : 'Expansões Tecnológicas'}
            </div>
            
            <h3 class="text-2xl md:text-3xl font-display font-extrabold text-white mb-4 flex items-center gap-3">
                <i class="fa-solid fa-square-plus text-[#07dc40]"></i> ${isEn ? 'Optional Tech Modules' : 'Módulos Avançados sob Demanda'}
            </h3>
            <p class="text-stone-400 mb-10 text-sm max-w-3xl leading-relaxed">
                ${isEn ? 'Take your customer acquisition, operations, and analysis to the next level. Integrate advanced modules developed by ESCOM Studio:' : 'Leve a sua captação, operação e análise para o próximo nível. Integre novos recursos tecnológicos desenvolvidos sob medida pela ESCOM Studio:'}
            </p>
            
            <div class="grid md:grid-cols-2 gap-6 mb-12">
                <!-- CRM -->
                <div class="group bg-stone-950/80 rounded-2xl border border-stone-850 hover:border-[#07dc40]/50 hover:shadow-[0_0_30px_rgba(7, 220, 64,0.15)] transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden">
                    <div class="h-40 w-full overflow-hidden relative">
                        <div class="absolute inset-0 bg-gradient-to-t from-stone-950/90 to-transparent z-10"></div>
                        <img src="/template-silva-autocenter/upsell_crm.png" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="CRM">
                        <div class="absolute bottom-4 left-6 z-20 w-10 h-10 bg-[#07dc40] rounded-xl flex items-center justify-center text-black text-lg shadow-lg">
                            <i class="fa-solid fa-users"></i>
                        </div>
                    </div>
                    <div class="p-6 flex-1 flex flex-col justify-between">
                        <div>
                            <h4 class="font-bold text-white text-base mb-2">${isEn ? 'CRM & Client Lead Management' : 'CRM e Controle de Clientes'}</h4>
                            <p class="text-stone-400 text-xs leading-relaxed">${isEn ? 'Automated scheduling funnels, automated alerts, and follow-ups via WhatsApp. Complete customer history database.' : 'Funil de agendamentos automatizado, envio de lembretes automáticos e acompanhamento via WhatsApp. Histórico de relacionamento com cliente.'}</p>
                        </div>
                        <span class="text-[10px] text-[#07dc40] font-bold uppercase tracking-wider mt-4 block border-t border-stone-850 pt-4">${isEn ? 'Focus: Retention & Recurrence' : 'Foco: Retenção & Recorrência'}</span>
                    </div>
                </div>

                <!-- Dashboard -->
                <div class="group bg-stone-950/80 rounded-2xl border border-stone-850 hover:border-[#07dc40]/50 hover:shadow-[0_0_30px_rgba(7, 220, 64,0.15)] transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden">
                    <div class="h-40 w-full overflow-hidden relative">
                        <div class="absolute inset-0 bg-gradient-to-t from-stone-950/90 to-transparent z-10"></div>
                        <img src="/template-silva-autocenter/upsell_dashboard.png" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Dashboard">
                        <div class="absolute bottom-4 left-6 z-20 w-10 h-10 bg-[#07dc40] rounded-xl flex items-center justify-center text-black text-lg shadow-lg">
                            <i class="fa-solid fa-chart-line"></i>
                        </div>
                    </div>
                    <div class="p-6 flex-1 flex flex-col justify-between">
                        <div>
                            <h4 class="font-bold text-white text-base mb-2">${isEn ? 'Financial Performance Dashboard' : 'Dashboard Financeiro'}</h4>
                            <p class="text-stone-400 text-xs leading-relaxed">${isEn ? 'Real-time billing analytics, customer acquisition cost (CAC) tracking, and conversion rates inside a beautiful visual admin.' : 'Visualização do fluxo de caixa e conversão de novos clientes em tempo real, controle de faturamento diário com gráficos intuitivos.'}</p>
                        </div>
                        <span class="text-[10px] text-[#07dc40] font-bold uppercase tracking-wider mt-4 block border-t border-stone-850 pt-4">${isEn ? 'Focus: Management & Profit' : 'Foco: Gestão & Lucro'}</span>
                    </div>
                </div>

                <!-- Agente IA -->
                <div class="group bg-stone-950/80 rounded-2xl border border-stone-850 hover:border-[#07dc40]/50 hover:shadow-[0_0_30px_rgba(7, 220, 64,0.15)] transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden">
                    <div class="h-40 w-full overflow-hidden relative">
                        <div class="absolute inset-0 bg-gradient-to-t from-stone-950/90 to-transparent z-10"></div>
                        <img src="/template-silva-autocenter/upsell_robot.png" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="AI Agent">
                        <div class="absolute bottom-4 left-6 z-20 w-10 h-10 bg-[#07dc40] rounded-xl flex items-center justify-center text-black text-lg shadow-lg">
                            <i class="fa-solid fa-robot"></i>
                        </div>
                    </div>
                    <div class="p-6 flex-1 flex flex-col justify-between">
                        <div>
                            <h4 class="font-bold text-white text-base mb-2">${isEn ? 'AI Customer Support Agent (WhatsApp)' : 'Agente de Atendimento IA'}</h4>
                            <p class="text-stone-400 text-xs leading-relaxed">${isEn ? 'Smart chatbot operating 24/7 to answer customer queries, schedule appointments, and qualify incoming leads automatically.' : 'Robô inteligente integrado ao WhatsApp Business, operando 24 horas por dia para realizar agendamentos e tirar dúvidas.'}</p>
                        </div>
                        <span class="text-[10px] text-[#07dc40] font-bold uppercase tracking-wider mt-4 block border-t border-stone-850 pt-4">${isEn ? 'Focus: 24/7 Support' : 'Foco: Atendimento 24/7'}</span>
                    </div>
                </div>

                <!-- Estoque -->
                <div class="group bg-stone-950/80 rounded-2xl border border-stone-850 hover:border-[#07dc40]/50 hover:shadow-[0_0_30px_rgba(7, 220, 64,0.15)] transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden">
                    <div class="h-40 w-full overflow-hidden relative">
                        <div class="absolute inset-0 bg-gradient-to-t from-stone-950/90 to-transparent z-10"></div>
                        <img src="/template-silva-autocenter/upsell_estoque.png" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Inventory">
                        <div class="absolute bottom-4 left-6 z-20 w-10 h-10 bg-[#07dc40] rounded-xl flex items-center justify-center text-black text-lg shadow-lg">
                            <i class="fa-solid fa-boxes-stacked"></i>
                        </div>
                    </div>
                    <div class="p-6 flex-1 flex flex-col justify-between">
                        <div>
                            <h4 class="font-bold text-white text-base mb-2">${isEn ? 'Smart Inventory Management' : 'Estoque Digital Inteligente'}</h4>
                            <p class="text-stone-400 text-xs leading-relaxed">${isEn ? 'Track inputs and outputs with automated shortage alerts and instant restock notifications.' : 'Controle digital de entrada e saída de insumos com alerta de estoque mínimo e integração.'}</p>
                        </div>
                        <span class="text-[10px] text-[#07dc40] font-bold uppercase tracking-wider mt-4 block border-t border-stone-850 pt-4">${isEn ? 'Focus: Organization' : 'Foco: Organização & Agilidade'}</span>
                    </div>
                </div>

                <!-- Processos -->
                <div class="group bg-stone-950/80 rounded-2xl border border-stone-850 hover:border-[#07dc40]/50 hover:shadow-[0_0_30px_rgba(7, 220, 64,0.15)] transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden">
                    <div class="h-40 w-full overflow-hidden relative">
                        <div class="absolute inset-0 bg-gradient-to-t from-stone-950/90 to-transparent z-10"></div>
                        <img src="/template-silva-autocenter/upsell_processos.png" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Process">
                        <div class="absolute bottom-4 left-6 z-20 w-10 h-10 bg-[#07dc40] rounded-xl flex items-center justify-center text-black text-lg shadow-lg">
                            <i class="fa-solid fa-clock-rotate-left"></i>
                        </div>
                    </div>
                    <div class="p-6 flex-1 flex flex-col justify-between">
                        <div>
                            <h4 class="font-bold text-white text-base mb-2">${isEn ? 'Business Process Optimization' : 'Otimização de Processos'}</h4>
                            <p class="text-stone-400 text-xs leading-relaxed">${isEn ? 'Digital mapping of operational workflows to identify bottlenecks and maximize team output.' : 'Mapeamento e automação de fluxos operacionais para remover gargalos e acelerar a produtividade.'}</p>
                        </div>
                        <span class="text-[10px] text-[#07dc40] font-bold uppercase tracking-wider mt-4 block border-t border-stone-850 pt-4">${isEn ? 'Focus: Productivity' : 'Foco: Produtividade Técnica'}</span>
                    </div>
                </div>

                <!-- E-commerce -->
                <div class="group bg-stone-950/80 rounded-2xl border border-stone-850 hover:border-[#07dc40]/50 hover:shadow-[0_0_30px_rgba(7, 220, 64,0.15)] transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden">
                    <div class="h-40 w-full overflow-hidden relative">
                        <div class="absolute inset-0 bg-gradient-to-t from-stone-950/90 to-transparent z-10"></div>
                        <img src="/template-silva-autocenter/upsell_ecommerce.png" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="E-commerce">
                        <div class="absolute bottom-4 left-6 z-20 w-10 h-10 bg-[#07dc40] rounded-xl flex items-center justify-center text-black text-lg shadow-lg">
                            <i class="fa-solid fa-cart-shopping"></i>
                        </div>
                    </div>
                    <div class="p-6 flex-1 flex flex-col justify-between">
                        <div>
                            <h4 class="font-bold text-white text-base mb-2">${isEn ? 'E-commerce & Digital Catalog' : 'Loja de Peças & Acessórios'}</h4>
                            <p class="text-stone-400 text-xs leading-relaxed">${isEn ? 'Online store integration allowing clients to buy services, products, and schedule installations in advance.' : 'Loja virtual integrada para venda online de produtos ou serviços adicionais com pagamento online.'}</p>
                        </div>
                        <span class="text-[10px] text-[#07dc40] font-bold uppercase tracking-wider mt-4 block border-t border-stone-850 pt-4">${isEn ? 'Focus: New Sales Channels' : 'Foco: Canal de Vendas Extra'}</span>
                    </div>
                </div>
            </div>

            <!-- Formulário Upsell -->
            <div class="bg-stone-950/90 p-8 rounded-2xl border border-stone-800 shadow-inner">
                <h4 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <i class="fa-solid fa-paper-plane text-[#07dc40]"></i> ${isEn ? 'Request Expansion Details' : 'Solicitar Orçamento das Expansões'}
                </h4>
                <p class="text-stone-400 text-xs mb-6">${isEn ? 'Select the module you want. Our development team will analyze your infrastructure and send a custom quote.' : 'Selecione o módulo de seu interesse. Nossa equipe de arquitetura técnica analisará a infraestrutura necessária e enviará o orçamento detalhado.'}</p>
                
                <form id="form-upsell" class="space-y-4 text-xs">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" id="upsell-nome" placeholder="${isEn ? 'Your Name' : 'Seu Nome / Responsável'}" class="w-full bg-stone-900 px-4 py-3 rounded-xl border border-stone-800 focus:outline-none focus:border-[#07dc40] text-white placeholder-stone-600 text-xs transition" required>
                        <input type="email" id="upsell-email" placeholder="${isEn ? 'Corporate Email' : 'E-mail Corporativo'}" class="w-full bg-stone-900 px-4 py-3 rounded-xl border border-stone-800 focus:outline-none focus:border-[#07dc40] text-white placeholder-stone-600 text-xs transition" required>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select id="upsell-servico" class="w-full bg-stone-900 px-4 py-3 rounded-xl border border-stone-800 focus:outline-none focus:border-[#07dc40] text-stone-400 text-xs transition" required>
                            <option value="" disabled selected>${isEn ? 'Select Module' : 'Selecione o Módulo Tecnológico'}</option>
                            <option value="crm">CRM</option>
                            <option value="dashboard">Dashboard</option>
                            <option value="bot">WhatsApp Bot</option>
                            <option value="estoque">${isEn ? 'Smart Inventory' : 'Estoque Digital'}</option>
                            <option value="otimizacao">${isEn ? 'Process Optimization' : 'Otimização de Processos'}</option>
                            <option value="ecommerce">E-commerce</option>
                        </select>
                        <input type="tel" id="upsell-whatsapp" placeholder="${isEn ? 'WhatsApp Phone' : 'WhatsApp para Contato'}" class="w-full bg-stone-900 px-4 py-3 rounded-xl border border-stone-800 focus:outline-none focus:border-[#07dc40] text-white placeholder-stone-600 text-xs transition" required>
                    </div>
                    <button type="submit" class="w-full bg-[#07dc40] hover:bg-[#00b5ab] text-black font-bold py-4 rounded-xl transition shadow-lg shadow-[#07dc40]/20 border border-[#07dc40]/10 text-xs uppercase tracking-wider">${isEn ? 'Submit Request' : 'Enviar Solicitação de Adicionais'}</button>
                </form>
            </div>
        </div>
    </div>
</section>

<!-- RODAPÉ COMERCIAL FINAL DA PROPOSTA (ESCOM STUDIO) -->
<footer class="py-12 bg-[#060606] border-t border-zinc-900 text-center text-xs text-zinc-500 relative z-10 font-sans">
    <div class="max-w-3xl mx-auto px-6 space-y-3">
        <p class="font-bold tracking-wider text-zinc-400">ESCOM STUDIO · CONVERSÃO DIGITAL PREMIUM</p>
        <p class="opacity-80">${isEn ? 'This technical proposal and its contents are confidential and property of the recipient and ESCOM Studio.' : 'Esta proposta técnica de implementação e seu conteúdo são confidenciais e de propriedade exclusiva do destinatário e da ESCOM Studio.'}</p>
        <p class="text-[10px] opacity-50">&copy; 2026 ESCOM Studio. Todos os direitos reservados.</p>
    </div>
</footer>
  `;

  return dossieHtml + propostaHtml;
}

// 6. Definições de cada Template
const templateConfigs = [
  {
    dir: 'template-belini',
    display: 'Clínica Belini',
    isEn: false,
    pdfUrl: '/proposta-belini/dossie.pdf',
    faqKey: 'belini',
    contactLang: 'belini',
    bannerBg: '#dc2626'
  },
  {
    dir: 'template-chiropractic',
    display: 'Miami Chiropractic',
    isEn: true,
    pdfUrl: '/proposta-escom-miami-chiropractic-wellness?pdf=true',
    faqKey: 'chiropractic',
    contactLang: 'chiropractic',
    bannerBg: '#dc2626'
  },
  {
    dir: 'template-clinica',
    display: 'Clínica ImplArt',
    isEn: false,
    pdfUrl: '/template-clinica/dossie-clinica-implart.pdf',
    faqKey: 'clinica',
    contactLang: 'clinica',
    bannerBg: '#dc2626'
  },
  {
    dir: 'template-giovana-lumertz',
    display: 'Giovana Lumertz',
    isEn: false,
    pdfUrl: '/proposta-giovana-lumertz/dossie.pdf',
    faqKey: 'giovana',
    contactLang: 'giovana',
    bannerBg: '#dc2626'
  },
  {
    dir: 'template-austin-simply-fit',
    display: 'Austin Simply Fit',
    isEn: true,
    pdfUrl: '/proposta-austin-simply-fit/dossie.pdf',
    faqKey: 'austin',
    contactLang: 'austin',
    bannerBg: '#dc2626'
  },
  {
    dir: 'template-silva-autocenter',
    display: 'Silva Auto Center',
    isEn: false,
    pdfUrl: '/template-silva-autocenter/dossie-silva-autocenter.pdf',
    faqKey: 'silva',
    contactLang: 'silva',
    bannerBg: '#dc2626'
  },
  {
    dir: 'template-mecanica-silva',
    display: 'Auto Mecânica Silva',
    isEn: false,
    pdfUrl: '/template-mecanica-silva/dossie.pdf',
    faqKey: 'silva',
    contactLang: 'silva',
    bannerBg: '#dc2626'
  },
  {
    dir: 'template-dominium-contabilidade',
    display: 'Dominium Contabilidade',
    isEn: false,
    pdfUrl: '/template-dominium-contabilidade/dossie.pdf',
    faqKey: 'silva',
    contactLang: 'silva',
    bannerBg: '#dc2626'
  },
  {
    dir: 'template-oralfix',
    display: 'Oral Fix',
    isEn: false,
    pdfUrl: '/template-oralfix/dossie.pdf',
    faqKey: 'clinica',
    contactLang: 'clinica',
    bannerBg: '#dc2626'
  },
  {
    dir: 'template-chiroandmovement',
    display: 'Chiro and Movement',
    isEn: true,
    pdfUrl: '/template-chiroandmovement/dossie.pdf',
    faqKey: 'chiropractic',
    contactLang: 'chiropractic',
    bannerBg: '#dc2626'
  },
  {
    dir: 'template-elizabete',
    display: 'Dra. Elizabete De Marchi',
    isEn: false,
    pdfUrl: '/template-elizabete/dossie.pdf',
    faqKey: 'elizabete',
    contactLang: 'elizabete',
    bannerBg: '#dc2626'
  },
  {
    dir: 'template-skozi-closet',
    display: 'Skoziê Closet de Moda Feminina',
    isEn: false,
    pdfUrl: '/skozi-closet/dossie.pdf',
    faqKey: 'skozi',
    contactLang: 'skozi',
    bannerBg: '#E91E63'
  }
];

// 6.5 Funções para gerar Banner de Urgência e ajustar Navbar
function generateBannerHtml(conf) {
  const isEn = conf.isEn;
  const cName = conf.display;
  const bgColor = conf.bannerBg || '#000000';
  return `
<!-- BANNER DE URGÊNCIA (PROPOSTA COMERCIAL) -->
<div id="banner-urgencia" class="fixed top-0 left-0 w-full min-h-[40px] py-2 bg-[${bgColor}] text-white text-center flex items-center justify-center px-4 text-[10px] sm:text-xs md:text-sm font-bold shadow-md z-[100] animate-pulse transition-all">
    ${isEn 
      ? `Technical proposal available for ${cName}. Valid for 3 days.` 
      : `Proposta de implementação técnica disponível para aprovação de ${cName}. Válida por 3 dias.`}
</div>`;
}

function patchNavbarClass(html) {
  const tagRegex = /<(nav|header)\b[^>]*id="navbar"[^>]*>/i;
  const match = html.match(tagRegex);
  if (match) {
    let fullTag = match[0];
    let classMatch = fullTag.match(/class="([^"]*)"/i);
    if (classMatch) {
      let classes = classMatch[1];
      let newClasses = classes.replace(/\btop-\S+/g, '').trim();
      if (!newClasses.includes('top-10')) newClasses += ' top-10';
      if (!newClasses.includes('transition-all')) newClasses += ' transition-all';
      if (!newClasses.includes('duration-300')) newClasses += ' duration-300';
      
      let newTag = fullTag.replace(/class="[^"]*"/i, `class="${newClasses}"`);
      html = html.replace(fullTag, newTag);
    } else {
      let newTag = fullTag.replace(/>$/, ' class="top-10 transition-all duration-300">');
      html = html.replace(fullTag, newTag);
    }
  }
  return html;
}

// 7. CSS para Animações e Shimmer (estilo ESCOM Studio)
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
            0% { box-shadow: 0 0 5px rgba(7, 220, 64, 0.2); border-color: rgba(63, 63, 70, 0.5); }
            100% { box-shadow: 0 0 25px rgba(7, 220, 64, 0.8); border-color: rgba(7, 220, 64, 0.9); }
        }
        @keyframes click-effect-green {
            0% { transform: scale(1); }
            50% { transform: scale(0.92); box-shadow: inset 0 0 25px rgba(7, 220, 64, 0.9); }
            100% { transform: scale(0.95); box-shadow: inset 0 0 10px rgba(7, 220, 64, 0.5); }
        }
`;

// 8. Scripts JS de Controle Comercial (Accordion, Accept Event, Client Mode, Copy Prevention)
function generateScripts(cName, isEn) {
  return `
<!-- Estilos dinâmicos injetados para elementos flutuantes -->
<style>
    /* WhatsApp Flutuante com Efeito Pulse */
    .whatsapp-float { 
        position: fixed; 
        bottom: 24px; 
        right: 24px; 
        z-index: 9998; 
        width: 60px; 
        height: 60px; 
        border-radius: 50%; 
        background: #25D366; 
        color: #fff; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        font-size: 32px; 
        box-shadow: 0 8px 30px rgba(37,211,102,.4); 
        transition: all .3s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
        cursor: pointer; 
        text-decoration: none; 
        animation: pulse-wpp 2s infinite; 
    }
    .whatsapp-float:hover { 
        transform: scale(1.1) rotate(5deg); 
        background: #22c55e; 
        color: #fff;
    }
    @keyframes pulse-wpp {
      0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7); }
      70% { box-shadow: 0 0 0 15px rgba(37, 211, 102, 0); }
      100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
    }

    /* Botão Voltar ao Topo Flutuante */
    .back-to-top { 
        position: fixed; 
        bottom: 96px; 
        right: 29px; 
        z-index: 9998; 
        width: 50px; 
        height: 50px; 
        border-radius: 50%; 
        background: #1b1c1c; 
        color: #fff; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        font-size: 20px; 
        box-shadow: 0 4px 20px rgba(0,0,0,.15); 
        border: 1px solid rgba(255,255,255,.1); 
        transition: all .3s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
        cursor: pointer; 
        text-decoration: none; 
        opacity: 0; 
        pointer-events: none; 
        transform: scale(0.8); 
    }
    .back-to-top.visible { 
        opacity: 1; 
        pointer-events: auto; 
        transform: scale(1); 
    }
    .back-to-top:hover { 
        transform: scale(1.1) translateY(-3px); 
        background: #E91E63; 
        box-shadow: 0 8px 25px rgba(233,30,99,.3); 
        color: #fff; 
    }

    /* Cards Flutuantes de Categoria e Depoimentos */
    .product-card { 
        transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease; 
        box-shadow: 0 4px 15px rgba(0,0,0,0.05); 
    }
    .product-card:hover { 
        transform: translateY(-8px) scale(1.01); 
        box-shadow: 0 20px 40px rgba(0,0,0,0.15); 
    }
    .product-card img { 
        transition: transform .6s cubic-bezier(.16,1,.3,1); 
    }
    .product-card:hover img { 
        transform: scale(1.05); 
    }

    .testimonial-card-hover { 
        transition: transform 0.4s ease, box-shadow 0.4s ease; 
    }
    .testimonial-card-hover:hover { 
        transform: translateY(-6px); 
        box-shadow: 0 15px 35px rgba(0,0,0,0.08); 
    }
</style>

<!-- Botão WhatsApp Flutuante Fixo -->
<a href="#" id="globalWhatsAppBtn" target="_blank" class="whatsapp-float" aria-label="Fale conosco no WhatsApp">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style="width: 30px; height: 30px; display: block;">
        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
    </svg>
</a>

<!-- Botão Voltar ao Topo Flutuante Fixo -->
<a href="#" id="backToTop" class="back-to-top" aria-label="Voltar ao topo">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor" style="width: 20px; height: 20px; display: block;">
        <path d="M352 352c-8.188 0-16.38-3.125-22.62-9.375L192 205.3 54.6 342.6c-12.5 12.5-32.75 12.5-45.25 0s-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0l160 160c12.5 12.5 12.5 32.75 0 45.25C368.4 348.9 360.2 352 352 352z"/>
    </svg>
</a>

<!-- Bibliotecas de Animação e Interatividade Premium -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.36/dist/lenis.min.js"></script>
<script src="https://unpkg.com/split-type"></script>

<script>
    // Configurar o link de WhatsApp dinamicamente
    (function() {
        const wppBtn = document.getElementById('globalWhatsAppBtn');
        if (wppBtn) {
            const firstWppLink = Array.from(document.querySelectorAll('a')).find(a => {
                return a.href.includes('wa.me') && !a.classList.contains('whatsapp-float') && !a.id.includes('globalWhatsAppBtn');
            });
            if (firstWppLink) {
                wppBtn.href = firstWppLink.href;
            } else {
                wppBtn.href = "https://wa.me/5562983232480?text=Ol%C3%A1%20Skozi%C3%AA!%20Vi%20o%20site%20e%20quero%20saber%20mais";
            }
        }
    })();

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const details = item.querySelector('details');
        const summary = item.querySelector('summary');
        if (details && summary) {
            summary.addEventListener('click', (e) => {
                // Fechar outros accordions abertos se desejado, ou deixar nativo
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
                btnAceitar.classList.remove('bg-[#07dc40]', 'hover:bg-[#00b5ab]', 'text-black', 'cursor-wait');
                btnAceitar.classList.add('bg-zinc-800', 'text-[#07dc40]', 'border', 'border-[#07dc40]', 'cursor-not-allowed');
                
                alert("${isEn ? 'Thank you! Your acceptance has been registered. The ESCOM Studio team will contact you shortly.' : 'Obrigado! Seu aceite foi registrado. A equipe da ESCOM Studio entrará em contato para os detalhes de faturamento.'}");
            }, 1500);
        });
    }

    // Upsell Form Event Handler
    const formUpsell = document.getElementById('form-upsell');
    if (formUpsell) {
        formUpsell.addEventListener('submit', function(e) {
            e.preventDefault();
            const btnSubmit = formUpsell.querySelector('button[type="submit"]');
            const originalText = btnSubmit.innerHTML;
            
            btnSubmit.innerHTML = '${isEn ? 'Sending Request...' : 'Enviando Solicitação...'}';
            btnSubmit.classList.add('opacity-80', 'cursor-wait');
            
            setTimeout(() => {
                alert("${isEn ? 'Request successfully sent! Our technical team will reach out.' : 'Mensagem enviada com sucesso! Nossa equipe técnica entrará em contato.'}");
                btnSubmit.innerHTML = '${isEn ? 'Sent successfully' : 'Enviado com sucesso'}';
                btnSubmit.classList.remove('opacity-80', 'cursor-wait', 'bg-[#07dc40]', 'hover:bg-[#00b5ab]');
                btnSubmit.classList.add('bg-zinc-800', 'text-[#07dc40]', 'cursor-not-allowed', 'border', 'border-[#07dc40]');
                formUpsell.reset();
            }, 1000);
        });
    }

    // Client Mode Check
    function verificarStatusDoLead() {
        const pathParts = window.location.pathname.split('/');
        const templateSlug = pathParts.find(p => p.startsWith('template-')) || 'default';
        const statusCache = localStorage.getItem('escom_lead_status_' + templateSlug) || localStorage.getItem('escom_lead_status');
        if (statusCache === 'pago') {
            const banner = document.getElementById('banner-urgencia');
            const dossie = document.getElementById('dossie-comercial');
            const proposta = document.getElementById('proposta-comercial');
            const navbar = document.getElementById('navbar');
            
            if (banner) banner.style.display = 'none';
            if (navbar) {
                navbar.classList.remove('top-10');
                navbar.classList.add('top-0');
            }
            if (dossie) dossie.style.display = 'none';
            if (proposta) proposta.style.display = 'none';
        }
    }
    verificarStatusDoLead();
    window.addEventListener('storage', (e) => {
        const pathParts = window.location.pathname.split('/');
        const templateSlug = pathParts.find(p => p.startsWith('template-')) || 'default';
        if ((e.key === 'escom_lead_status' || e.key === ('escom_lead_status_' + templateSlug)) && e.newValue === 'pago') {
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

    // Controle do Botão Voltar ao Topo
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Inicialização do Lenis Smooth Scroll Global
    (function() {
        if (typeof Lenis !== 'undefined') {
            const lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smoothWheel: true
            });
            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
            
            // Sincronizar Lenis com GSAP ScrollTrigger
            if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
                lenis.on('scroll', ScrollTrigger.update);
                gsap.ticker.add((time) => {
                    lenis.raf(time * 1000);
                });
                gsap.ticker.lagSmoothing(0);
            }
        }
    })();

    // GSAP ScrollTrigger para Efeito de Reveal Premium nos Elementos
    (function() {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            
            // Animar elementos com classe reveal
            gsap.utils.toArray('.reveal').forEach((el) => {
                gsap.fromTo(el, 
                    { opacity: 0, y: 30 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        duration: 0.8, 
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 88%",
                            toggleActions: "play none none none"
                        }
                    }
                );
            });

            // Animação de hover 3D em cards flutuantes (depoimentos, serviços e produtos)
            const floatCards = document.querySelectorAll('.product-card, .testimonial-card-hover, .service-card');
            floatCards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                    gsap.to(card, { y: -8, scale: 1.01, boxShadow: "0 20px 40px rgba(0,0,0,0.12)", duration: 0.4, ease: "power2.out" });
                });
                card.addEventListener('mouseleave', () => {
                    gsap.to(card, { y: 0, scale: 1, boxShadow: "0 4px 15px rgba(0,0,0,0.05)", duration: 0.4, ease: "power2.out" });
                });
            });
        } else {
            // Fallback clássico caso as CDNs falhem por algum bloqueio
            const revealElements = document.querySelectorAll('.reveal');
            if (revealElements.length > 0) {
                const checkReveal = () => {
                    const triggerBottom = window.innerHeight * 0.85;
                    revealElements.forEach(el => {
                        const elTop = el.getBoundingClientRect().top;
                        if (elTop < triggerBottom) {
                            el.classList.add('active');
                        }
                    });
                };
                window.addEventListener('scroll', checkReveal);
                window.addEventListener('resize', checkReveal);
                checkReveal();
                setTimeout(checkReveal, 300);
            }
        }
    })();
</script>
  `;
}

// Função para limpar injeções comerciais e scripts antigos de forma limpa antes do novo patch
function cleanHtmlOfPreviousInjections(html) {
  let cleaned = html;
  
  // 1. Remover Banner de Urgência antigo
  cleaned = cleaned.replace(/<!-- BANNER DE URGÊNCIA \(PROPOSTA COMERCIAL\) -->[\s\S]*?<\/div>/g, '');
  cleaned = cleaned.replace(/<div id="banner-urgencia"[\s\S]*?<\/div>/g, '');
  
  // 2. Encontrar o rodapé (footer) do cliente. 
  let footerIndex = cleaned.lastIndexOf('<!-- Footer');
  if (footerIndex === -1) footerIndex = cleaned.lastIndexOf('<footer');
  
  if (footerIndex !== -1) {
    let footerEndIndex = cleaned.indexOf('</footer>', footerIndex);
    if (footerEndIndex !== -1) {
      footerEndIndex += 9; // incluir </footer>
      
      // O rodapé deve ser mantido, mas descartamos tudo após o rodapé
      // no HTML original limpo (apenas mantendo </body> e </html>)
      cleaned = cleaned.substring(0, footerEndIndex) + '\n</body>\n</html>';
    }
  }
  
  // 3. Remover nosso FAQ e Formulário de Contato antigo antes do rodapé
  let faqIndex = cleaned.indexOf('<!-- FAQ Section -->');
  if (faqIndex === -1) faqIndex = cleaned.indexOf('<!-- FAQ Section');
  if (faqIndex === -1) faqIndex = cleaned.indexOf('<section id="faq"');
  
  if (faqIndex !== -1) {
    if (cleaned.substring(faqIndex - 20, faqIndex).includes('<section')) {
      faqIndex = cleaned.lastIndexOf('<section', faqIndex);
    }
    
    let tempFooterIndex = cleaned.lastIndexOf('<!-- Footer');
    if (tempFooterIndex === -1) tempFooterIndex = cleaned.lastIndexOf('<footer');
    
    if (tempFooterIndex !== -1 && faqIndex < tempFooterIndex) {
      cleaned = cleaned.substring(0, faqIndex) + cleaned.substring(tempFooterIndex);
    }
  }
  
  // 4. Garantir que as tags body e html não fiquem órfãs ou quebradas
  if (!cleaned.includes('</body>')) cleaned += '\n</body>';
  if (!cleaned.includes('</html>')) cleaned += '\n</html>';
  
  return cleaned;
}

// 9. Loop de aplicação de patches em cada template
templateConfigs.forEach(conf => {
  const filePath = path.join(basePath, conf.dir, 'index.html');
  if (fs.existsSync(filePath)) {
    console.log(`Aplicando patch comercial em: ${filePath}`);
    let html = fs.readFileSync(filePath, 'utf8');
    
    // Limpar o HTML de quaisquer patches e duplicatas anteriores antes de reaplicar
    html = cleanHtmlOfPreviousInjections(html);

    // Injetar o Banner de Urgência
    const bannerHtml = generateBannerHtml(conf);
    html = html.replace(/(<body\b[^>]*>)/i, `$1\n${bannerHtml}`);

    // Ajustar a classe da navbar para iniciar com top-10
    html = patchNavbarClass(html);

    // Injetar CSS nas tags de estilo
    if (!html.includes('btn-pdf-shimmer')) {
      const styleEndIndex = html.indexOf('</style>');
      if (styleEndIndex !== -1) {
        html = html.substring(0, styleEndIndex) + escomStyles + html.substring(styleEndIndex);
        console.log('  -> CSS de shimmer injetado');
      }
    }

    // Gerar novas seções
    const faqSection = generateFaqHtml(conf.faqKey);
    const contactSection = generateContactHtml(conf.contactLang);
    const commercialSections = generateCommercialSections(conf);

    // Substituir bloco antigo
    let blockStartIndex = html.indexOf('<!-- FAQ');
    if (blockStartIndex === -1) blockStartIndex = html.indexOf('<section id="faq"');
    if (blockStartIndex === -1) blockStartIndex = html.indexOf('id="dossie-comercial"');
    
    let footerIndex = html.lastIndexOf('<!-- Footer');
    if (footerIndex === -1) footerIndex = html.lastIndexOf('<footer');

    let footerEndIndex = html.indexOf('</footer>', footerIndex);
    if (footerEndIndex !== -1) {
      footerEndIndex += 9; // incluir </footer>
    } else {
      footerEndIndex = footerIndex;
    }

    if (blockStartIndex !== -1 && footerIndex !== -1 && blockStartIndex < footerIndex) {
      // Ajusta o índice de início se for id="faq" ou similar para capturar a tag anterior
      if (html.substring(blockStartIndex - 20, blockStartIndex).includes('<section')) {
        blockStartIndex = html.lastIndexOf('<section', blockStartIndex);
      }
      
      const beforeFooter = html.substring(0, blockStartIndex) + faqSection + contactSection;
      const footer = html.substring(footerIndex, footerEndIndex);
      const afterFooter = commercialSections + html.substring(footerEndIndex);
      
      html = beforeFooter + footer + afterFooter;
      console.log('  -> Seções comerciais substituídas e rodapé reposicionado');
    } else {
      // Se não encontrou o bloco mas encontrou o rodapé, injetamos o FAQ e Form antes, e as seções comerciais depois
      if (footerIndex !== -1) {
        const beforeFooter = html.substring(0, footerIndex) + faqSection + contactSection;
        const footer = html.substring(footerIndex, footerEndIndex);
        const afterFooter = commercialSections + html.substring(footerEndIndex);
        
        html = beforeFooter + footer + afterFooter;
        console.log('  -> Seções comerciais injetadas em torno do rodapé');
      }
    }

    // Injetar scripts de controle antes do fim do body
    const bodyCloseIndex = html.lastIndexOf('</body>');
    if (bodyCloseIndex !== -1) {
      // Remover scripts comerciais antigos se existirem
      const oldScriptMarker = html.indexOf('// FAQ Accordion');
      if (oldScriptMarker !== -1) {
        const scriptStart = html.lastIndexOf('<script>', oldScriptMarker);
        const scriptEnd = html.indexOf('</script>', oldScriptMarker) + 9;
        if (scriptStart !== -1 && scriptEnd !== -1) {
          html = html.substring(0, scriptStart) + html.substring(scriptEnd);
          console.log('  -> Scripts antigos removidos');
        }
      }
      
      // Injetar novos scripts
      const newCloseIndex = html.lastIndexOf('</body>');
      const scripts = generateScripts(conf.display, conf.isEn);
      html = html.substring(0, newCloseIndex) + scripts + html.substring(newCloseIndex);
      console.log('  -> Scripts de controle injetados');
    }

    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`  -> Sucesso! ${conf.display} index.html atualizado.`);
  } else {
    console.log(`Arquivo não existe: ${filePath}`);
  }
});

console.log('\n--- Aplicação de Patches concluída com sucesso! ---');
