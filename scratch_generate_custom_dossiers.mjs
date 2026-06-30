import fs from 'fs';
import path from 'path';

const basePath = 'public';
const baseDossierHtml = fs.readFileSync(path.join(basePath, 'template-clinica', 'dossie.html'), 'utf8');

const companies = [
  {
    name: 'belini',
    display: 'Clínica Belini',
    dossierDir: 'proposta-belini',
    dossierFile: 'dossie.html',
    title: 'Clínica Belini - Estética Avançada',
    primaryColor: '#731C2D', // Wine-red
    accentColor: '#D4AF37',  // Gold
    image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=2070&auto=format&fit=crop', // Modern clean clinic room
    replacements: [
      // Page 3 - Fundação e Fundadores (no início para rodar primeiro)
      ['Fundada há mais de 15 anos em São Paulo (SP) pelo renomado cirurgião-dentista Dr. Roberto Markarian, especialista em odontologia premium e implantes, a Clínica ImplArt destaca-se no mercado nacional.', 'Fundada há 12 anos em Belo Horizonte (MG) pela especialista Fabíola Rodrigues Firmino Laporte, referência em estética avançada e rejuvenescimento, a Clínica Belini destaca-se no mercado regional.'],
      ['4. Autoridade Científica USP', '4. Autoridade Clínica e Prática'],
      ['Fundamentação técnica e coordenação de cirurgias liderada pelo Dr. Roberto Markarian, Mestre e Doutor pela USP.', 'Fundamentação técnica e coordenação dos protocolos estéticos liderada por Fabíola Rodrigues Firmino Laporte, especialista com 12 anos de atuação.'],
      ['"Coroa finalizada em até 48h"', '"Resultados visíveis em até 24h"'],
      ['"Diretor Doutor pela USP"', '"Especialista com 12 anos de atuação"'],
      ['"Cirurgia com Anestesiologista"', '"Técnicas de Anestesia Tópica Avançada"'],
      ['"Selo e componentes Straumann"', '"Utilização de injetáveis Allergan e Galderma"'],
      ['"O luxo de sorrir"', '"Beleza sem exageros"'],

      // Page 1
      ['Dossiê Estratégico | ImplArt', 'Dossiê Estratégico | Clínica Belini'],
      ['Análise Estratégica <br><span class="text-brand-primary">Clínica ImplArt</span>', 'Análise Estratégica <br><span class="text-brand-primary">Clínica Belini</span>'],
      ['https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop', 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=2070&auto=format&fit=crop'],
      
      // Page 3 - Diagnóstico
      ['Este documento apresenta um raio-x estratégico para a reabilitação oral e odontologia digital premium. O foco está em centralizar a jornada cirúrgica do paciente sem fricção, sem dor e de forma extremamente veloz.', 'Este documento apresenta um raio-x estratégico para o mercado de estética avançada e rejuvenescimento de alto padrão. O foco está em atrair pacientes qualificados interessados em resultados naturais e elegantes de forma totalmente segura.'],
      ['Dossiê Clínica ImplArt - Inteligência Comercial', 'Dossiê Clínica Belini - Inteligência Comercial'],
      ['ImplArt Frente ao Posicionamento de Mercado', 'Clínica Belini Frente ao Posicionamento de Mercado'],
      ['A Clínica ImplArt destaca-se sob a liderança do Dr. Roberto Markarian (Doutor e Mestre pela USP) e possui infraestrutura tecnológica fantástica in-house (Scanner Intraoral e Fresagem Robótica CAD/CAM). Isso a coloca no topo de capacidade técnica de atendimento nacional.', 'A Clínica Belini destaca-se sob a liderança da Diretoria Belini (com ampla especialização internacional) e possui infraestrutura clínica premium com tecnologia de ponta para análise facial e aplicação de injetáveis. Isso a coloca no topo de capacidade de atendimento sofisticado na região.'],
      ['O site atual e a abordagem digital focam excessivamente em terminologia científica fria de engenharia e cirurgia dos implantes. Esse foco técnico acaba ativando barreiras subconscientes de medo da dor na mente do paciente premium, além de atrair leads não-qualificados que buscam preço/convênio.', 'O site atual e a abordagem digital focam excessivamente em terminologias clínicas frias de procedimentos. Esse foco muito técnico acaba não gerando o desejo aspiracional na mente do paciente premium, além de atrair leads que buscam apenas preço ou descontos em tratamentos estéticos.'],
      ['Ajustar a presença digital da ImplArt para focar na facilitação da jornada: **Day Clinic Digital** (tratamento rápido em até 48h devido ao laboratório próprio) e **Sedação Consciente** (conforto e eliminação absoluta da dor), convertendo leads qualificados diretamente para o WhatsApp.', 'Ajustar a presença digital da Clínica Belini para focar no rejuvenescimento natural e elegância: **Protocolo Recovery Acelerado** (procedimentos rápidos com mínimo downtime) e **Técnicas de Anestesia Tópica Avançada** (conforto absoluto), convertendo pacientes diretamente para o WhatsApp.'],
      
      ['Clínica ImplArt', 'Clínica Belini'],
      ['implart.com.br', 'clinicabelini.com.br'],
      ['odontologia premium e implantes', 'estética avançada e rejuvenescimento'],
      ['implantes e próteses', 'procedimentos estéticos faciais e corporais'],
      ['tomografia computadorizada e Day Clinic', 'avaliação facial tridimensional e protocolos exclusivos'],
      ['área odontológica', 'área de dermatologia e estética avançada'],
      ['tratamentos odontológicos', 'procedimentos estéticos'],
      ['dentistas e implantodontistas', 'médicos e biomédicos estetas'],
      ['sorriso e mastigação', 'autoestima e rejuvenescimento natural'],
      ['implante e prótese', 'botox, preenchimento e bioestimulador'],
      ['consultório dentário', 'clínica de estética avançada'],
      
      // Page 4 - Avatares
      ['Avatar A: O Executivo / Empresário', 'Avatar A: A Executiva / Empresária de Sucesso'],
      ['Foco em restabelecer a mastigação e estética rapidamente', 'Foco em rejuvenescimento facial natural, redução de rugas e cansaço visual'],
      ['dente quebrado ou prótese desajustada', 'linhas de expressão profundas e perda de volume facial'],
      ['Medo de sentir dor ou de ficar sem os dentes durante o processo.', 'Medo de ficar com aparência artificial ("congelada") ou de downtime longo.'],
      ['Avatar B: A Paciente Madura (Mãe/Avó)', 'Avatar B: A Mulher Madura e Ativa (45-60 anos)'],
      ['Deseja segurança para mastigar e sorrir sem constrangimentos.', 'Deseja desacelerar o envelhecimento e recuperar a firmeza da pele.'],
      ['perda óssea e dentes moles', 'flacidez no pescoço, olheiras profundas e perda do contorno da mandíbula'],
      ['Preocupação com o custo e se a saúde geral permite fazer a cirurgia.', 'Preocupação em investir em tratamentos ineficazes e sofrer com dor.'],
      ['Dor do tratamento', 'Dor dos procedimentos'],
      ['Anestesia computadorizada e sedação consciente coordenada por médico anestesista na própria clínica.', 'Protocolo de anestesia tópica de alta potência e técnicas minimamente invasivas com microcânulas.'],
      ['Prótese provisória fixa no mesmo dia, sem ficar sem dentes.', 'Retorno imediato às atividades normais com mínimo inchaço ou hematoma.'],
      
      // Page 5 - Campo de Batalha
      ['Consultórios Boutique Jardins', 'Clínicas Boutique Premium (Estilo Jardins)'],
      ['Redes Populares', 'Franquias de Estética Populares'],
      ['Franquias de Médio Porte', 'Clínicas de Estética de Bairro'],
      ['Franquias Estéticas (Facetas)', 'Clínicas Low-Cost (Estética de Shopping)'],
      ['Consultórios Familiares Tradicionais', 'Consultórios de Dermatologia Tradicionais'],
      ['Foco em implantes de alto ticket e atendimento VIP.', 'Foco em pacotes de harmonização de alto ticket e branding de luxo.'],
      ['Tratamentos rápidos, materiais de baixa qualidade e foco em volume.', 'Foco em volume de procedimentos rápidos e preenchedores de baixo custo.'],
      ['Foco em ortodontia e clínica geral.', 'Foco em tratamentos corporais e limpezas de pele padrão.'],
      ['Venda agressiva de lentes de contato de resina com preços baixos.', 'Promoções agressivas de toxina botulínica e preenchimento labial.'],
      ['Dentista da família, focado em tratamentos tradicionais de saúde bucal.', 'Dermatologista focado apenas em doenças de pele, sem foco em estética moderna.'],
      ['Terceirizam o laboratório. Prazos de até 20 dias para entrega de próteses definitivas.', 'Profissionais sem treinamento avançado de injetáveis. Resultados artificiais ou insatisfatórios por falta de estudo facial individualizado.'],
      ['Não possuem centro cirúrgico preparado para Sedação Consciente com anestesiologista.', 'Não possuem aparelhos de alta tecnologia clínica (como ultrassom microfocado) e aplicam produtos nacionais de menor durabilidade.'],
      ['Foco em estética rápida; falta de bagagem técnica para reabilitações ósseas complexas.', 'Foco em pacotes promocionais de volume; falta de especialização em rejuvenescimento facial complexo e natural.'],
      
      // Page 6 - Gaps & Copy
      ['Medo do motorzinho / dor na cirurgia', 'Medo de ficar com visual artificial ou deformado'],
      ['Uso da sedação consciente médica para fricção zero de dor.', 'Técnicas de aplicação avançadas focadas em realçar a beleza natural.'],
      ['Segurança dos implantes importados (Straumann)', 'Qualidade dos produtos importados homologados (Allergan, Galderma)'],
      ['Garantia estendida e rastreabilidade total do implante.', 'Certificação dos produtos e abertura das ampolas na frente da paciente.'],
      ['Falta de clareza sobre o tempo de tratamento', 'Falta de clareza sobre o tempo de recuperação (downtime)'],
      ['Explicação visual da carga imediata (dentes fixos em 72h).', 'Cronograma visual simples mostrando a evolução dos resultados em 7 a 15 dias.'],
      
      // Page 7 - 6 Pilares
      ['Os 6 Pilares de Vantagem da ImplArt', 'Os 6 Pilares de Vantagem da Clínica Belini'],
      ['Fresadora robotizada interna de Zircônia 3D. Próteses fixas executadas em tempo recorde sem envio para laboratórios externos.', 'Uso de softwares de mapeamento facial computadorizado. Protocolos estéticos aplicados em sintonia milimétrica com a expressão natural.'],
      ['Tomografia digital panorâmica realizada instantaneamente na consulta inicial, eliminando exames externos.', 'Tecnologias de Firmeza e Colágeno. Combinação sinérgica de bioestimuladores e ultrassom para tratar a flacidez de dentro para fora.'],
      ['Protocolos específicos que viabilizam a extração e inserção do dente provisório no mesmo dia cirúrgico.', 'Protocolo Recovery Acelerado. Combinação de lasers terapêuticos e LED de baixa intensidade para acelerar a cicatrização pós-procedimento.'],
      ['6. Componentes Straumann', '6. Injetáveis de Altíssima Pureza'],
      ['Utilização exclusiva da marca de implantes suíça número 1 do mundo, oferecendo as maiores taxas de ósseointegração.', 'Uso exclusivo de toxina botulínica e preenchedores de marcas líderes mundiais, garantindo estabilidade e biocompatibilidade.'],
      ['Computadorização em 3D que planeja o sorriso e fresa as coroas em minutos.', 'Uso de softwares de análise facial para projetar os resultados de forma natural.'],
      ['Sedação monitorada por anestesista para realizar cirurgias sem qualquer dor.', 'Uso de técnicas anestésicas locais inovadoras que garantem conforto total.'],
      ['Tomografia computadorizada 3D e raio-x panorâmico dentro do consultório.', 'Combinação de ultrassom microfocado e bioestimuladores no mesmo plano.'],
      ['Liderança técnica com mestrado e doutorado na melhor universidade do país.', 'Corpo técnico altamente especializado e em constante atualização científica.'],
      ['Dentes fixos sobre implantes em até 72 horas em vez de esperar 6 meses.', 'Combinação de lasers e LED para reduzir edema e acelerar a cicatrização pós-procedimento.'],
      ['Uso dos melhores implantes suíços do mundo com garantia vitalícia.', 'Uso exclusivo de toxina botulínica e preenchedores de marcas líderes mundiais.'],
      
      // Page 8 - Anatomia LP
      ['Bloco da Sedação Sem Dor', 'Bloco dos Resultados Naturais'],
      ['Explicando a sedação consciente médica para eliminar o medo da dor.', 'Mostrando a filosofia de rejuvenescimento elegante sem exageros.'],
      ['Provas Tecnológicas Visuais', 'Tecnologia por Trás dos Resultados'],
      ['Demonstração do laboratório digital e scanners intra-orais em vídeo.', 'Apresentação dos aparelhos modernos de ultrassom e rejuvenescimento.'],
      ['Tomografia Computadorizada', 'Avaliação Facial Digital'],
      
      // Page 9 - ROI e Gaps
      ['Day Clinic e Carga Imediata de Zircônia em 48h.', 'Harmonização Facial Sutil e Protocolos de Firmeza de Pele.'],
      ['Ancoragem da durabilidade vitalícia e luxo da Zircônia 3D.', 'Ancoragem no valor intangível do rejuvenescimento natural e na alta qualidade dos injetáveis importados.'],
      ['Mapeamento das forças e fraquezas dos concorrentes locais para guiar o diferencial competitivo da ImplArt:', 'Mapeamento das forças e fraquezas dos concorrentes locais para guiar o diferencial competitivo da Clínica Belini:'],
      ['Fotos atrativas de lentes de resina no Instagram.', 'Imagens estéticas de antes e depois bem produzidas.'],
      ['Zero tecnologia intraoral in-house. O paciente precisa ir a um centro radiológico externo fazer exames básicos.', 'Falta de acompanhamento pós-procedimento estruturado. Paciente se sente inseguro após a aplicação.'],
      ['A grande oportunidade reside em atender o paciente que precisa de reabilitação complexa e exige <strong class="text-zinc-800">velocidade máxima, conforto absoluto e zero dor.</strong> A centralização estrutural (Tomografia + Cirurgia com Médico Anestesiologista + Laboratório Digital 3D Próprio) é o trunfo comercial que isola a ImplArt do mercado convencional.', 'A grande oportunidade reside em atender a paciente que busca rejuvenescimento elegante e exige <strong class="text-zinc-800">naturalidade nos resultados, agilidade e absoluto conforto.</strong> O posicionamento em procedimentos injetáveis de alta performance sem exageros é o trunfo comercial que isola a Clínica Belini do mercado convencional.'],
      ['Coroa finalizada em até 48h', 'Harmonização elegante e natural'],
      ['Selo e componentes Straumann', 'Injetáveis importados de alta pureza'],
      ['Mensagem imediata de tempo e conforto: destaque para "Day Clinic" e "Dentes Fixos no mesmo dia". Resolve a objeção de falta de tempo do Executivo.', 'Mensagem imediata de rejuvenescimento e segurança: destaque para "Resultados Naturais" e "Sem Dor". Resolve a objeção do medo de artificialidade.'],
      ['Exposição da fresadora de Zircônia e dos scanners 3D. Mostra que a clínica possui laboratório tecnológico próprio e não terceiriza.', 'Exposição da tecnologia clínica de ponta e dos certificados dos especialistas. Passa credibilidade científica instantânea.'],
      ['Diferente do tráfego comum de odontologia de convênio, as campanhas premium focam na atração de poucos casos de alta rentabilidade por mês:', 'Diferente do tráfego comum de estética popular focado em volume de limpeza de pele, as campanhas premium focam na atração de casos de harmonização de alta rentabilidade por mês:'],
      ['Estimativa de custo de investimento em tráfego focado de alta intenção variando de R$ 350 a R$ 600 por paciente de implante complexo fechado.', 'Estimativa de custo de investimento em tráfego focado de alta intenção variando de R$ 200 a R$ 450 por paciente de procedimento estético fechado.'],
      ['Tratamentos de reabilitação oral e protocolos em Zircônia possuem tickets médios de R$ 8.000 a R$ 25.000+, estabelecendo alta margem.', 'Tratamentos injetáveis e de rejuvenescimento facial possuem tickets médios de R$ 3.000 a R$ 10.000+, estabelecendo alta margem.'],
      
      // Page 10 - Oceano Azul
      ['Turismo Odontológico Executivo', 'Clube de Beleza e Estética (Recorrência)'],
      ['Mirar em pacientes de alta renda do interior paulista ou de outros estados. A capacidade do Day Clinic da ImplArt de resolver casos complexos em até 48h torna viável o "Implante Tour" (viajar para a capital, fazer o procedimento cirúrgico com anestesista e retornar com os dentes fixados em Zircônia).', 'Implementar um programa de assinatura de cuidados faciais preventivos (peelings, hidratações profundas) que traga receita previsível e recorrente para a clínica, fidelizando o paciente ao longo de todo o ano.'],
      ['Mapeamento de pacientes que já possuem próteses protocolo antigas em resina desgastada ou acrílico amarelado. O tráfego pago focará na substituição e upgrade para a Zircônia 3D Metal-Free, com maior durabilidade, estética e resistência.', 'Mapeamento de pacientes que já realizaram procedimentos em outras clínicas e estão insatisfeitas com a falta de naturalidade. O tráfego focará em correções sutis e refinamentos estéticos elegantes.'],
      
      ['Implante Unitário Premium', 'Tratamento de Toxina Botulínica (3 áreas)'],
      ['Implante Nacional + Coroa', 'Preenchimento Labial com Ácido Hialurônico'],
      ['Protocolo All-on-4 (Arcada Completa)', 'Protocolo de Harmonização Facial (6 seringas)'],
      ['R$ 4.500,00', 'R$ 1.800,00'],
      ['R$ 3.200,00', 'R$ 1.400,00'],
      ['R$ 22.000,00', 'R$ 8.900,00'],
      ['5 implantes unitários por mês', '12 aplicações de toxina por mês'],
      ['2 protocolos de arcada por mês', '3 harmonizações completas por mês'],
      ['R$ 66.500,00', 'R$ 48.300,00'],
      ['R$ 12.000,00', 'R$ 8.500,00'],
      ['R$ 54.500,00', 'R$ 39.800,00'],
      
      // Page 11 - Síntese
      ['Roberto Markarian', 'Diretoria Belini'],
      ['Dr. Roberto Markarian', 'Diretoria Belini'],
      ['Dossiê Clínica ImplArt - Confidencial', 'Dossiê Clínica Belini - Confidencial'],
      
      // Identidade Visual
      ['<!-- INJECT_CORES_RACIONAL -->[Racional das cores será injetado aqui pelo script de dossiês]<!-- END_INJECT_CORES_RACIONAL -->', 'Cores sofisticadas com base em um Vinho Red profundo, que transmite paixão, energia e estética boutique, equilibrado pelo Ouro Champagne, simbolizando requinte, maturidade e alta classe.'],
      ['<!-- INJECT_COLOR_1_HEX -->#000000<!-- END_INJECT_COLOR_1_HEX -->', '#731C2D'],
      ['<!-- INJECT_COLOR_1_NAME -->Cor 1<!-- END_INJECT_COLOR_1_NAME -->', 'Vinho Red'],
      ['<!-- INJECT_COLOR_2_HEX -->#FFFFFF<!-- END_INJECT_COLOR_2_HEX -->', '#D4AF37'],
      ['<!-- INJECT_COLOR_2_NAME -->Cor 2<!-- END_INJECT_COLOR_2_NAME -->', 'Ouro Champagne'],
      ['<!-- INJECT_TIPO_RACIONAL -->[Racional tipográfico será injetado aqui pelo script de dossiês]<!-- END_INJECT_TIPO_RACIONAL -->', 'Playfair Display traz a elegância atemporal, enquanto a Inter assegura legibilidade e um toque contemporâneo para comunicar os resultados precisos dos protocolos de beleza.'],
      ['<!-- INJECT_FONT_1_CSS -->\\\'Playfair Display\\\', serif<!-- END_INJECT_FONT_1_CSS -->', "'Playfair Display', serif"],
      ['<!-- INJECT_FONT_1_NAME -->Playfair Display<!-- END_INJECT_FONT_1_NAME -->', 'Playfair Display'],
      ['<!-- INJECT_FONT_2_CSS -->\\\'Inter\\\', sans-serif<!-- END_INJECT_FONT_2_CSS -->', "'Inter', sans-serif"],
      ['<!-- INJECT_FONT_2_NAME -->Inter<!-- END_INJECT_FONT_2_NAME -->', 'Inter'],

      // Limpeza genérica final
      ['Day Clinic', 'Protocolo Express'],
      ['ImplArt', 'Clínica Belini'],
      ['implantes', 'procedimentos estéticos'],
      ['implante', 'procedimento estético'],
      ['São Paulo - SP', 'Belo Horizonte - MG']
    ]
  },
  {
    name: 'giovana-lumertz',
    display: 'Giovana Lumertz',
    dossierDir: 'proposta-giovana-lumertz',
    dossierFile: 'dossie.html',
    title: 'Giovana Lumertz | Arquitetura e Interiores',
    primaryColor: '#5B4F43', // Stone/taupe
    accentColor: '#C5A880',  // Gold/bronze
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2070&auto=format&fit=crop', // Luxury living room
    replacements: [
      // Page 3 - Fundação e Fundadores (no início para rodar primeiro)
      ['Fundada há mais de 15 anos em São Paulo (SP) pelo renomado cirurgião-dentista Dr. Roberto Markarian, especialista em odontologia premium e implantes, a Clínica ImplArt destaca-se no mercado nacional.', 'Fundado e dirigido pela arquiteta Giovana Lumertz, especializada em arquitetura residencial e interiores de luxo com unidades em Porto Alegre e Canoas (RS), o escritório destaca-se por seus projetos autorais.'],
      ['4. Autoridade Científica USP', '4. Autoridade em Interiores'],
      ['Fundamentação técnica e coordenação de cirurgias liderada pelo Dr. Roberto Markarian, Mestre e Doutor pela USP.', 'Direção criativa e coordenação dos projetos liderada pela arquiteta Giovana Lumertz, especialista em interiores de alto padrão.'],
      ['"Coroa finalizada em até 48h"', '"Detalhamento executivo anti-erros"'],
      ['"Diretor Doutor pela USP"', '"Projetos autorais exclusivos"'],
      ['"Cirurgia com Anestesiologista"', '"Visualização fotorrealista imersiva 3D"'],
      ['"Selo e componentes Straumann"', '"Assessoria de escolha de acabamentos"'],
      ['"O luxo de sorrir"', '"O prazer de morar bem"'],

      // Page 1
      ['Dossiê Estratégico | ImplArt', 'Dossiê Estratégico | Giovana Lumertz'],
      ['Análise Estratégica <br><span class="text-brand-primary">Clínica ImplArt</span>', 'Análise Estratégica <br><span class="text-brand-primary">Giovana Lumertz</span>'],
      ['https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop', 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2070&auto=format&fit=crop'],
      
      // Page 3 - Diagnóstico
      ['Este documento apresenta um raio-x estratégico para a reabilitação oral e odontologia digital premium. O foco está em centralizar a jornada cirúrgica do paciente sem fricção, sem dor e de forma extremamente veloz.', 'Este documento apresenta um raio-x estratégico para o mercado de arquitetura de luxo e design de interiores premium. O foco está em captar clientes de alto padrão interessados em projetos autorais, sofisticação e conforto de forma diferenciada.'],
      ['Dossiê Clínica ImplArt - Inteligência Comercial', 'Dossiê Giovana Lumertz - Inteligência Comercial'],
      ['ImplArt Frente ao Posicionamento de Mercado', 'Giovana Lumertz Frente ao Posicionamento de Mercado'],
      ['A Clínica ImplArt destaca-se sob a liderança do Dr. Roberto Markarian (Doutor e Mestre pela USP) e possui infraestrutura tecnológica fantástica in-house (Scanner Intraoral e Fresagem Robótica CAD/CAM). Isso a coloca no topo de capacidade técnica de atendimento nacional.', 'A Giovana Lumertz Arquitetura destaca-se sob a liderança da arquiteta Giovana Lumertz (Especialista em Interiores de Alto Padrão) e possui infraestrutura digital de ponta com realidade virtual e maquetes fotorrealistas imersivas. Isso coloca o escritório em destaque na execução técnica nacional.'],
      ['O site atual e a abordagem digital focam excessivamente em terminologia científica fria de engenharia e cirurgia dos implantes. Esse foco técnico acaba ativando barreiras subconscientes de medo da dor na mente do paciente premium, além de atrair leads não-qualificados que buscam preço/convênio.', 'O site atual e a abordagem digital focam excessivamente em portfólios simples ou termos técnicos de engenharia. Esse foco sem narrativa conceitual não valoriza o diferencial estético na mente do cliente premium, atraindo leads que apenas comparam preços por metro quadrado.'],
      ['Ajustar a presença digital da ImplArt para focar na facilitação da jornada: **Day Clinic Digital** (tratamento rápido em até 48h devido ao laboratório próprio) e **Sedação Consciente** (conforto e eliminação absoluta da dor), convertendo leads qualificados diretamente para o WhatsApp.', 'Ajustar a presença digital de Giovana Lumertz para focar na sofisticação e segurança: **Modelagem 3D Fotorrealista** (visualização idêntica ao resultado real) e **Detalhamento Executivo Rígido** (previsibilidade absoluta contra erros na obra), convertendo potenciais clientes diretamente para o WhatsApp.'],
      
      ['Clínica ImplArt', 'Giovana Lumertz Arquitetura'],
      ['implart.com.br', 'giovanalumertz.com.br'],
      ['odontologia premium e implantes', 'arquitetura residencial e interiores de luxo'],
      ['implantes e próteses', 'projetos residenciais, comerciais e interiores autorais'],
      ['tomografia computadorizada e Day Clinic', 'detalhamento executivo completo e maquete 3D fotorrealista'],
      ['área odontológica', 'área de arquitetura e design de luxo'],
      ['tratamentos odontológicos', 'projetos de arquitetura e decoração'],
      ['dentistas e implantodontistas', 'arquitetos e designers de interiores'],
      ['sorriso e mastigação', 'funcionalidade, conforto e status do espaço'],
      ['implante e prótese', 'projeto de interiores e detalhamento de marcenaria'],
      ['consultório dentário', 'escritório de arquitetura de alto padrão'],
      
      // Page 4 - Avatares
      ['Avatar A: O Executivo / Empresário', 'Avatar A: O Proprietário / Investidor Imobiliário'],
      ['Foco em restabelecer a mastigação e estética rapidamente', 'Foco em valorizar o imóvel, obter sofisticação e otimizar espaços para moradia'],
      ['dente quebrado ou prótese desajustada', 'compra de imóvel novo em osso ou necessidade de reforma completa'],
      ['Medo de sentir dor ou de ficar sem os dentes durante o processo.', 'Medo de projetos impraticáveis que estourem o orçamento da obra ou sofram atrasos.'],
      ['Avatar B: A Paciente Madura (Mãe/Avó)', 'Avatar B: A Mulher/Família de Alto Padrão'],
      ['Deseja segurança para mastigar e sorrir sem constrangimentos.', 'Deseja uma casa integrada, com cozinha gourmet e marcenaria sob medida elegante.'],
      ['perda óssea e dentes moles', 'ambientes mal iluminados, espaços apertados e móveis genéricos sem design'],
      ['Preocupação com o custo e se a saúde geral permite fazer a cirurgia.', 'Preocupação com dores de cabeça com empreiteiros e falta de tempo para gerenciar a obra.'],
      ['Dor do tratamento', 'Atraso e Erros de Obra'],
      ['Anestesia computadorizada e sedação consciente coordenada por médico anestesista na própria clínica.', 'Elaboração de projetos executivos com riqueza técnica absoluta, evitando erros de encanamento ou elétrica.'],
      ['Prótese provisória fixa no mesmo dia, sem ficar sem dentes.', 'Cronograma detalhado de obras e indicação de parceiros homologados confiáveis.'],
      
      // Page 5 - Campo de Batalha
      ['Consultórios Boutique Jardins', 'Escritórios de Arquitetura de Grife (Renomados)'],
      ['Redes Populares', 'Construtoras e Reformadoras de Volume'],
      ['Franquias de Médio Porte', 'Arquitetos Autônomos Recém-Formados'],
      ['Franquias Estéticas (Facetas)', 'Plataformas de Decoração Online (Low-Cost)'],
      ['Consultórios Familiares Tradicionais', 'Designers de Interiores Tradicionais'],
      ['Foco em implantes de alto ticket e atendimento VIP.', 'Cobrança de taxas de projeto altíssimas e foco em marcas famosas de grife.'],
      ['Tratamentos rápidos, materiais de baixa qualidade e foco em volume.', 'Foco apenas na entrega da obra básica, sem refinamento estético ou autoral.'],
      ['Foco em ortodontia e clínica geral.', 'Preços baixos de projeto, mas com pouca experiência técnica e erros frequentes na obra.'],
      ['Venda agressiva de lentes de contato de resina com preços baixos.', 'Serviços de decoração rápidos em 3D genéricos sem especificações executivas.'],
      ['Dentista da família, focado em tratamentos tradicionais de saúde bucal.', 'Focados em soluções de decoração clássicas, sem o uso de maquetes fotorrealistas modernas.'],
      ['Terceirizam o laboratório. Prazos de até 20 dias para entrega de próteses definitivas.', 'Terceirizam o detalhamento executivo de marcenaria. Desenhos genéricos que geram retrabalho na obra.'],
      ['Não possuem centro cirúrgico preparado para Sedação Consciente com anestesiologista.', 'Não oferecem visualização fotorrealista em 3D. O cliente aprova a planta baixa sem entender a real volumetria do espaço.'],
      ['Foco em estética rápida; falta de bagagem técnica para reabilitações ósseas complexas.', 'Foco em reformas básicas de curto prazo; falta de capacidade técnica para reformas estruturais e compatibilização de projetos.'],
      
      // Page 6 - Gaps & Copy
      ['Medo do motorzinho / dor na cirurgia', 'Medo de o projeto não caber no bolso ou estourar a obra'],
      ['Uso da sedação consciente médica para fricção zero de dor.', 'Apresentação de uma estimativa de custos detalhada de materiais logo no início.'],
      ['Segurança dos implantes importados (Straumann)', 'Dificuldade de visualizar os espaços prontos antes da obra'],
      ['Garantia estendida e rastreabilidade total do implante.', 'Criação de imagens 3D fotorrealistas (Renders) imersivas de alta qualidade.'],
      ['Falta de clareza sobre o tempo de tratamento', 'Projetos esteticamente lindos mas impossíveis de executar'],
      ['Explicação visual da carga imediata (dentes fixos em 72h).', 'Compatibilização de projetos estruturais e executivos detalhados para os pedreiros.'],
      
      // Page 7 - 6 Pilares
      ['Os 6 Pilares de Vantagem da ImplArt', 'Os 6 Pilares de Vantagem de Giovana Lumertz'],
      ['Fresadora robotizada interna de Zircônia 3D. Próteses fixas executadas em tempo recorde sem envio para laboratórios externos.', 'Modelagem 3D Fotorrealista Imersiva. Renderizações tridimensionais idênticas ao resultado real para aprovação sem surpresas.'],
      ['Tomografia digital panorâmica realizada instantaneamente na consulta inicial, eliminando exames externos.', 'Detalhamento Técnico Milimétrico. Desenho detalhado de gesso, marcenaria, mármores e paginação de piso livre de erros de obra.'],
      ['Protocolos específicos que viabilizam a extração e inserção do dente provisório no mesmo dia cirúrgico.', 'Acompanhamento Técnico. Visitas periódicas ao canteiro de obras para esclarecer dúvidas da equipe e garantir fidelidade ao projeto.'],
      ['6. Componentes Straumann', '6. Rede de Fornecedores'],
      ['Utilização exclusiva da marca de implantes suíça número 1 do mundo, oferecendo as maiores taxas de ósseointegração.', 'Acesso direto a fornecedores de mármores, marcenaria e iluminação premium com condições especiais de negociação.'],
      ['Computadorização em 3D que planeja o sorriso e fresa as coroas em minutos.', 'Renderizações tridimensionais idênticas ao resultado real para aprovação sem surpresas.'],
      ['Sedação monitorada por anestesista para realizar cirurgias sem qualquer dor.', 'Desenho técnico milimétrico de marcenaria, gesso, marmoraria e paginação de pisos.'],
      ['Tomografia computadorizada 3D e raio-x panorâmico dentro do consultório.', 'Cálculo de quantitativos e sugestão de acabamentos que otimizam o orçamento do cliente.'],
      ['Liderança técnica com mestrado e doutorado na melhor universidade do país.', 'Estilo estético contemporâneo e clean, focado no luxo discreto e atemporal.'],
      ['Dentes fixos sobre implantes em até 72 horas em vez de esperar 6 meses.', 'Visitas periódicas ao canteiro de obras para garantir que a execução siga fielmente o projeto.'],
      ['Uso dos melhores implantes suíços do mundo com garantia vitalícia.', 'Acesso direto a fornecedores de pedras, móveis e iluminação com condições especiais.'],
      
      // Page 8 - Anatomia LP
      ['Bloco da Sedação Sem Dor', 'Galeria de Projetos Autorais'],
      ['Explicando a sedação consciente médica para eliminar o medo da dor.', 'Apresentando imagens em alta definição de projetos concluídos e renderizações 3D.'],
      ['Provas Tecnológicas Visuais', 'Detalhamento de Etapas do Projeto'],
      ['Demonstração do laboratório digital e scanners intra-orais em vídeo.', 'Passo a passo didático de como o projeto é desenvolvido, aprovado e executado.'],
      ['Tomografia Computadorizada', 'Especificações e Memorial Descritivo'],
      
      // Page 9 - ROI e Gaps
      ['Day Clinic e Carga Imediata de Zircônia em 48h.', 'Projetos Autorais Premium e Gestão Inteligente de Obra.'],
      ['Ancoragem da durabilidade vitalícia e luxo da Zircônia 3D.', 'Ancoragem na valorização patrimonial do imóvel e no design autoral atemporal.'],
      ['Mapeamento das forças e fraquezas dos concorrentes locais para guiar o diferencial competitivo da ImplArt:', 'Mapeamento das forças e fraquezas dos concorrentes locais para guiar o diferencial competitivo de Giovana Lumertz:'],
      ['Fotos atrativas de lentes de resina no Instagram.', 'Fotos profissionais de ambientes prontos de luxo.'],
      ['Zero tecnologia intraoral in-house. O paciente precisa ir a um centro radiológico externo fazer exames básicos.', 'Projetos sem detalhamento executivo rigoroso, gerando discussões e erros caros com pedreiros na obra.'],
      ['A grande oportunidade reside em atender o paciente que precisa de reabilitação complexa e exige <strong class="text-zinc-800">velocidade máxima, conforto absoluto e zero dor.</strong> A centralização estrutural (Tomografia + Cirurgia com Médico Anestesiologista + Laboratório Digital 3D Próprio) é o trunfo comercial que isola a ImplArt do mercado convencional.', 'A grande oportunidade reside em atender o cliente que deseja renovar ou construir seu imóvel e exige <strong class="text-zinc-800">maquetes 3D realistas, detalhamento executivo e fidelidade estética.</strong> O acompanhamento técnico e a compatibilização rigorosa de projetos são os trunfos comerciais que isolam Giovana Lumertz do mercado convencional.'],
      ['Coroa finalizada em até 48h', 'Maquete 3D Fotorrealista idêntica à obra'],
      ['Selo e componentes Straumann', 'Detalhamento executivo livre de erros'],
      ['Mensagem imediata de tempo e conforto: destaque para "Day Clinic" e "Dentes Fixos no mesmo dia". Resolve a objeção de falta de tempo do Executivo.', 'Mensagem imediata de segurança e fidelidade: destaque para "Maquetes 3D Realistas" e "Projetos Executivos Sem Erro". Resolve a objeção de surpresas na obra.'],
      ['Exposição da fresadora de Zircônia e dos scanners 3D. Mostra que a clínica possui laboratório tecnológico próprio e não terceiriza.', 'Exposição das imagens tridimensionais (Renders) comparadas com fotos reais de obras concluídas, demonstrando precisão absoluta.'],
      ['Diferente do tráfego comum de odontologia de convênio, as campanhas premium focam na atração de poucos casos de alta rentabilidade por mês:', 'Diferente do tráfego comum de reformas populares e decoração express, as campanhas premium focam na atração de clientes interessados em projetos residenciais de luxo:'],
      ['Estimativa de custo de investimento em tráfego focado de alta intenção variando de R$ 350 a R$ 600 por paciente de implante complexo fechado.', 'Estimativa de custo de investimento em tráfego focado de alta intenção variando de R$ 400 a R$ 800 por projeto residencial de luxo fechado.'],
      ['Tratamentos de reabilitação oral e protocolos em Zircônia possuem tickets médios de R$ 8.000 a R$ 25.000+, estabelecendo alta margin.', 'Projetos de interiores e reformas completas possuem tickets médios de projeto de R$ 10.000 a R$ 35.000+, estabelecendo excelente faturamento.'],
      ['Tratamentos de reabilitação oral e protocolos em Zircônia possuem tickets médios de R$ 8.000 a R$ 25.000+, estabelecendo alta margem.', 'Projetos de interiores e reformas completas possuem tickets médios de projeto de R$ 10.000 a R$ 35.000+, estabelecendo excelente faturamento.'],
      
      // Page 10 - Oceano Azul
      ['Turismo Odontológico Executivo', 'Decoração Corporativa para Médicos e Advogados'],
      ['Mirar em pacientes de alta renda do interior paulista ou de outros estados. A capacidade do Day Clinic da ImplArt de resolver casos complexos em até 48h torna viável o "Implante Tour" (viajar para a capital, fazer o procedimento cirúrgico com anestesista e retornar com os dentes fixados em Zircônia).', 'Especializar-se em reformas rápidas de consultórios médicos, clínicas de estética e escritórios de advocacia de alto padrão, focando em layouts funcionais que melhorem a experiência do cliente e valorizem a marca corporativa.'],
      ['Mapeamento de pacientes que já possuem próteses protocolo antigas em resina desgastada ou acrílico amarelado. O tráfego pago focará na substituição e upgrade para a Zircônia 3D Metal-Free, com maior durabilidade, estética e resistência.', 'Mapeamento de novos proprietários de imóveis recém-entregues por construtoras de luxo. Campanhas segmentadas focarão em projetos completos de marcenaria e acabamentos na planta.'],
      
      ['Implante Unitário Premium', 'Projeto de Interiores Completo (por m²)'],
      ['Implante Nacional + Coroa', 'Projeto Arquitetônico Residencial'],
      ['Protocolo All-on-4 (Arcada Completa)', 'Consultoria Express de Decoração'],
      ['R$ 4.500,00', 'R$ 120,00 / m²'],
      ['R$ 3.200,00', 'R$ 80,00 / m²'],
      ['R$ 22.000,00', 'R$ 2.500,00'],
      ['5 implantes unitários por mês', '3 projetos de interiores por mês (média 100m² cada)'],
      ['2 protocolos de arcada por mês', '2 projetos arquitetônicos por mês (média 250m² cada)'],
      ['R$ 66.500,00', 'R$ 76.000,00'],
      ['R$ 12.000,00', 'R$ 9.500,00'],
      ['R$ 54.500,00', 'R$ 66.500,00'],
      
      // Page 11 - Síntese
      ['Roberto Markarian', 'Giovana Lumertz'],
      ['Dr. Roberto Markarian', 'Giovana Lumertz'],
      ['Dossiê Clínica ImplArt - Confidencial', 'Dossiê Giovana Lumertz - Confidencial'],
      
      // Identidade Visual
      ['<!-- INJECT_CORES_RACIONAL -->[Racional das cores será injetado aqui pelo script de dossiês]<!-- END_INJECT_CORES_RACIONAL -->', 'O Stone Taupe evoca solidez arquitetônica, conforto tátil e modernidade atemporal, enquanto o Bronze traz um brilho sutil de luxo, refletindo exclusividade nos acabamentos de interiores.'],
      ['<!-- INJECT_COLOR_1_HEX -->#000000<!-- END_INJECT_COLOR_1_HEX -->', '#5B4F43'],
      ['<!-- INJECT_COLOR_1_NAME -->Cor 1<!-- END_INJECT_COLOR_1_NAME -->', 'Stone Taupe'],
      ['<!-- INJECT_COLOR_2_HEX -->#FFFFFF<!-- END_INJECT_COLOR_2_HEX -->', '#C5A880'],
      ['<!-- INJECT_COLOR_2_NAME -->Cor 2<!-- END_INJECT_COLOR_2_NAME -->', 'Bronze'],
      ['<!-- INJECT_TIPO_RACIONAL -->[Racional tipográfico será injetado aqui pelo script de dossiês]<!-- END_INJECT_TIPO_RACIONAL -->', 'A tipografia Playfair Display expressa a assinatura artística e autoral do escritório, enquanto a Inter suporta o aspecto técnico e milimétrico dos detalhamentos executivos.'],
      ['<!-- INJECT_FONT_1_CSS -->\\\'Playfair Display\\\', serif<!-- END_INJECT_FONT_1_CSS -->', "'Playfair Display', serif"],
      ['<!-- INJECT_FONT_1_NAME -->Playfair Display<!-- END_INJECT_FONT_1_NAME -->', 'Playfair Display'],
      ['<!-- INJECT_FONT_2_CSS -->\\\'Inter\\\', sans-serif<!-- END_INJECT_FONT_2_CSS -->', "'Inter', sans-serif"],
      ['<!-- INJECT_FONT_2_NAME -->Inter<!-- END_INJECT_FONT_2_NAME -->', 'Inter'],

      // Limpeza genérica final
      ['Day Clinic', 'Modelagem 3D'],
      ['ImplArt', 'Giovana Lumertz'],
      ['implantes', 'projetos autorais'],
      ['implante', 'projeto autoral'],
      ['São Paulo - SP', 'Torres - RS']
    ]
  },
  {
    name: 'austin-simply-fit',
    display: 'Austin Simply Fit',
    dossierDir: 'proposta-austin-simply-fit',
    dossierFile: 'dossie.html',
    title: 'Austin Simply Fit | High-Performance Personal Training',
    primaryColor: '#e05a00', // Orange
    accentColor: '#22c55e',  // Green
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop', // Modern gym
    replacements: [
      // Page 3 - Fundação e Fundadores (no início para rodar primeiro)
      ['Fundada há mais de 15 anos em São Paulo (SP) pelo renomado cirurgião-dentista Dr. Roberto Markarian, especialista em odontologia premium e implantes, a Clínica ImplArt destaca-se no mercado nacional.', 'Founded in 2010 in Austin (Texas) by athlete and coach Mark Rogers, and co-developed with Krista Bergeron, Austin Simply Fit stands out as a premier studio for high-performance personal training and fitness transformation.'],
      ['4. Autoridade Científica USP', '4. Certified Performance Experts'],
      ['Fundamentação técnica e coordenação de cirurgias liderada pelo Dr. Roberto Markarian, Mestre e Doutor pela USP.', 'Program design and training coordination led by Mark Rogers and Krista Bergeron, with certified fitness specialists.'],
      ['"Coroa finalizada em até 48h"', '"1-on-1 private training sessions"'],
      ['"Diretor Doutor pela USP"', '"Highly certified elite coaches"'],
      ['"Cirurgia com Anestesiologista"', '"Scientific periodization and tracking"'],
      ['"Selo e componentes Straumann"', '"Premium strength & conditioning systems"'],
      ['"O luxo de sorrir"', '"High performance lifestyle"'],

      // Page 1
      ['Dossiê Estratégico | ImplArt', 'Dossiê Estratégico | Austin Simply Fit'],
      ['Análise Estratégica <br><span class="text-brand-primary">Clínica ImplArt</span>', 'Análise Estratégica <br><span class="text-brand-primary">Austin Simply Fit</span>'],
      ['https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop'],
      
      // Page 3 - Diagnóstico
      ['Este documento apresenta um raio-x estratégico para a reabilitação oral e odontologia digital premium. O foco está em centralizar a jornada cirúrgica do paciente sem fricção, sem dor e de forma extremamente veloz.', 'This document presents a strategic blueprint for the high-performance personal training and fitness market. The focus is on attracting high-value clients looking for body transformation and customized performance coaching.'],
      ['Dossiê Clínica ImplArt - Inteligência Comercial', 'Dossier Austin Simply Fit - Commercial Intelligence'],
      ['ImplArt Frente ao Posicionamento de Mercado', 'Austin Simply Fit vs. Market Positioning'],
      ['A Clínica ImplArt destaca-se sob a liderança do Dr. Roberto Markarian (Doutor e Mestre pela USP) e possui infraestrutura tecnológica fantástica in-house (Scanner Intraoral e Fresagem Robótica CAD/CAM). Isso a coloca no topo de capacidade técnica de atendimento nacional.', 'Austin Simply Fit stands out under the leadership of the Austin Simply Fit Team (highly certified coaches) and features premium private gym facilities with dedicated strength and conditioning systems. This positions the studio at the top of high-performance personal training.'],
      ['O site atual e a abordagem digital focam excessivamente em terminologia científica fria de engenharia e cirurgia dos implantes. Esse foco técnico acaba ativando barreiras subconscientes de medo da dor na mente do paciente premium, além de atrair leads não-qualificados que buscam preço/convênio.', 'The current website and digital presence focus too much on generic workout routines and features. This technical focus fails to create an aspirational desire in high-value clients, attracting low-ticket leads who are just comparing gym membership prices.'],
      ['Ajustar a presença digital da ImplArt para focar na facilitação da jornada: **Day Clinic Digital** (tratamento rápido em até 48h devido ao laboratório próprio) e **Sedação Consciente** (conforto e eliminação absoluta da dor), convertendo leads qualificados diretamente para o WhatsApp.', 'Align Austin Simply Fit\'s digital presence to focus on personalized results: **Private 1-on-1 Training** (no crowded spaces, high efficiency) and **Scientific Periodization** (maximum safety and customized nutritional support), driving qualified leads to contact directly via WhatsApp.'],
      
      ['Clínica ImplArt', 'Austin Simply Fit Studio'],
      ['implart.com.br', 'austinsimplyfit.com'],
      ['odontologia premium e implantes', 'personal training e preparação física de alta performance'],
      ['implantes e próteses', 'planos de treinamento personalizado, avaliação física e saúde'],
      ['tomografia computadorizada e Day Clinic', 'avaliação de bioimpedância computadorizada e periodização integrada'],
      ['área odontológica', 'área de fitness, bem-estar e personal training'],
      ['tratamentos odontológicos', 'programas de treinamento físico'],
      ['dentistas e implantodontistas', 'personal trainers e coaches de saúde'],
      ['sorriso e mastigação', 'composição corporal, vitalidade e força física'],
      ['implante e prótese', 'treino sob medida e plano nutricional de suporte'],
      ['consultório dentário', 'estúdio de treinamento personalizado e fitness'],
      
      // Page 4 - Avatares
      ['Avatar A: O Executivo / Empresário', 'Avatar A: O Executivo / Empresário Sobrecarregado'],
      ['Foco em restabelecer a mastigação e estética rapidamente', 'Foco em emagrecimento saudável, redução do estresse e ganho de energia'],
      ['dente quebrado ou prótese desajustada', 'sedentarismo prolongado, fadiga e ganho de peso repentino'],
      ['Medo de sentir dor ou de ficar sem os dentes durante o processo.', 'Medo de perder tempo com treinos genéricos e sofrer lesões por má execução.'],
      ['Avatar B: A Paciente Madura (Mãe/Avó)', 'Avatar B: O Atleta Amador / Buscador de Performance'],
      ['Deseja segurança para mastigar e sorrir sem constrangimentos.', 'Deseja melhorar o rendimento na corrida/ciclismo e evitar lesões articulares.'],
      ['perda óssea e dentes moles', 'dores recorrentes no joelho/lombar e falta de evolução nos treinos tradicionais'],
      ['Preocupação com o custo e se a saúde geral permite fazer a cirurgia.', 'Preocupação com falta de disciplina e medo de não conseguir manter a constância.'],
      ['Dor do tratamento', 'Risco de Lesões e Fracasso'],
      ['Anestesia computadorizada e sedação consciente coordenada por médico anestesista na própria clínica.', 'Acompanhamento milimétrico da execução dos exercícios e periodização científica adaptada.'],
      ['Prótese provisória fixa no mesmo dia, sem ficar sem dentes.', 'Avaliação constante e ajustes de intensidade que mantêm a motivação e os treinos seguros.'],
      
      // Page 5 - Campo de Batalha
      ['Consultórios Boutique Jardins', 'Estúdios de Personal Training Premium (Boutique)'],
      ['Redes Populares', 'Grandes Academias de Rede (Low-Cost)'],
      ['Franquias de Médio Porte', 'Academias de Bairro Tradicionais'],
      ['Franquias Estéticas (Facetas)', 'Aplicativos de Treino e Consultorias Online'],
      ['Consultórios Familiares Tradicionais', 'Personal Trainers Autônomos Sem Metodologia'],
      ['Foco em implantes de alto ticket e atendimento VIP.', 'Atendimento altamente exclusivo com ambiente privado e hora marcada.'],
      ['Tratamentos rápidos, materiais de baixa qualidade e foco em volume.', 'Acesso barato à estrutura, mas com superlotação e falta de acompanhamento real.'],
      ['Foco em ortodontia e clínica geral.', 'Ambiente básico com poucos equipamentos e professores sobrecarregados na sala.'],
      ['Venda agressiva de lentes de contato de resina com preços baixos.', 'Fichas de treino genéricas no celular e falta de contato presencial.'],
      ['Dentista da família, focado em tratamentos tradicionais de saúde bucal.', 'Profissionais focados apenas em passar exercícios, sem análise de mobilidade ou nutrição.'],
      ['Terceirizam o laboratório. Prazos de até 20 dias para entrega de próteses definitivas.', 'High trainer turnover. Clients are often reassigned to different trainers with no consistent training method.'],
      ['Não possuem centro cirúrgico preparado para Sedação Consciente com anestesiologista.', 'Crowded workout spaces and waiting for machines, causing distractions and inefficient training sessions.'],
      ['Foco em estética rápida; falta de bagagem técnica para reabilitações ósseas complexas.', 'Focus on generic group classes; lack of physical assessment and customized programming for injury prevention.'],
      
      // Page 6 - Gaps & Copy
      ['Medo do motorzinho / dor na cirurgia', 'Medo de não se adaptar à rotina ou desistir no início'],
      ['Uso da sedação consciente médica para fricção zero de dor.', 'Metodologia de progressão suave com metas de curto prazo e alta motivação.'],
      ['Segurança dos implantes importados (Straumann)', 'Lesões e dores articulares decorrentes de treinos errados'],
      ['Garantia estendida e rastreabilidade total do implante.', 'Foco absoluto em biomecânica correta e testes de mobilidade articular.'],
      ['Falta de clareza sobre o tempo de tratamento', 'Falta de tempo dos executivos para treinar na semana'],
      ['Explicação visual da carga imediata (dentes fixos em 72h).', 'Programas compactos de alta intensidade (HIIT) de 45 minutos com hora marcada.'],
      
      // Page 7 - 6 Pilares
      ['Os 6 Pilares de Vantagem da ImplArt', 'Os 6 Pilares de Vantagem da Austin Simply Fit'],
      ['Fresadora robotizada interna de Zircônia 3D. Próteses fixas executadas em tempo recorde sem envio para laboratórios externos.', 'Scientific Periodization. Workouts built upon exact weekly progression metrics, customized specifically to your body\'s adaptations.'],
      ['Tomografia digital panorâmica realizada instantaneamente na consulta inicial, eliminando exames externos.', 'Advanced Body Composition (InBody). Detailed monitoring of visceral fat, skeletal muscle mass, and metabolic rate evolution.'],
      ['Protocolos específicos que viabilizam a extração e inserção do dente provisório no mesmo dia cirúrgico.', 'Injury Prevention. Focus on mobility, core stability, and correct joint mechanics to keep you training pain-free.'],
      ['6. Componentes Straumann', '6. Private Gym Environment'],
      ['Utilização exclusiva da marca de implantes suíça número 1 do mundo, oferecendo as maiores taxas de ósseointegração.', 'No waiting for machines, no crowds. A premium facility tailored to high-value individuals demanding absolute privacy.'],
      ['Computadorização em 3D que planeja o sorriso e fresa as coroas em minutos.', 'Análise detalhada de gordura corporal, massa magra e taxa metabólica.'],
      ['Sedação monitorada por anestesista para realizar cirurgias sem qualquer dor.', 'Desenvolvimento de planilhas de treino dinâmicas ajustadas à sua evolução semanal.'],
      ['Tomografia computadorizada 3D e raio-x panorâmico dentro do consultório.', 'Prescrição alimentar voltada para performance e otimização hormonal.'],
      ['Liderança técnica com mestrado e doutorado na melhor universidade do país.', 'Profissionais com pós-graduação e certificações nas melhores escolas de performance.'],
      ['Dentes fixos sobre implantes em até 72 horas em vez de esperar 6 meses.', 'Prevenção de lesões através de exercícios preparatórios e liberação miofascial.'],
      ['Uso dos melhores implantes suíços do mundo com garantia vitalícia.', 'Treine em um espaço planejado, sem filas para equipamentos e com foco total em você.'],
      
      // Page 8 - Anatomia LP
      ['Bloco da Sedação Sem Dor', 'Apresentação da Estrutura e Aparelhos'],
      ['Explicando a sedação consciente médica para eliminar o medo da dor.', 'Fotos reais e vídeos do ambiente privativo e equipamentos de alta performance.'],
      ['Provas Tecnológicas Visuais', 'Testemunhos e Resultados de Alunos'],
      ['Demonstração do laboratório digital e scanners intra-orais em vídeo.', 'Histórias de sucesso com fotos de antes e depois e dados reais de perda de gordura.'],
      ['Tomografia Computadorizada', 'Periodização e Linha do Tempo de Treino'],
      
      // Page 9 - ROI e Gaps
      ['Day Clinic e Carga Imediata de Zircônia em 48h.', 'Private 1-on-1 Personal Training & Body Composition.'],
      ['Ancoragem da durabilidade vitalícia e luxo da Zircônia 3D.', 'Anchoring the value in custom physical programming, professional coaching, and long-term health benefits.'],
      ['Mapeamento das forças e fraquezas dos concorrentes locais para guiar o diferencial competitivo da ImplArt:', 'Mapping local competitor strengths and weaknesses to guide the competitive edge of Austin Simply Fit:'],
      ['Fotos atrativas de lentes de resina no Instagram.', 'Active gym community and dynamic social media content.'],
      ['Zero tecnologia intraoral in-house. O paciente precisa ir a um centro radiológico externo fazer exames básicos.', 'Generic workout plans and crowded peak hours, reducing trainer attention.'],
      ['A grande oportunidade reside em atender o paciente que precisa de reabilitação complexa e exige <strong class="text-zinc-800">velocidade máxima, conforto absoluto e zero dor.</strong> A centralização estrutural (Tomografia + Cirurgia com Médico Anestesiologista + Laboratório Digital 3D Próprio) é o trunfo comercial que isola a ImplArt do mercado convencional.', 'The key opportunity is in serving high-value clients who require a structured fitness transformation with <strong class="text-zinc-800">personalized programming, maximum safety, and expert nutrition.</strong> The private training environment combined with scientific body tracking (InBody) is the commercial edge that sets Austin Simply Fit apart from public gyms.'],
      ['Coroa finalizada em até 48h', 'Private gym environment, no crowds'],
      ['Selo e componentes Straumann', '1-on-1 personalized training & tracking'],
      ['Mensagem imediata de tempo e conforto: destaque para "Day Clinic" e "Dentes Fixos no mesmo dia". Resolve a objeção de falta de tempo do Executivo.', 'Immediate value proposition: highlighting "Private 1-on-1 Environment" and "Scientific Tracking". Resolves the crowded gym objection.'],
      ['Exposição da fresadora de Zircônia e dos scanners 3D. Mostra que a clínica possui laboratório tecnológico próprio e não terceiriza.', 'Display of the InBody report, private equipment setup, and international coach credentials. Shows that this is a scientific studio.'],
      ['Diferente do tráfego comum de odontologia de convênio, as campanhas premium focam na atração de poucos casos de alta rentabilidade por mês:', 'Unlike generic local gym advertising focused on low-ticket memberships, premium campaigns target high-value clients looking for full-service coaching programs:'],
      ['Estimativa de custo de investimento em tráfego focado de alta intenção variando de R$ 350 a R$ 600 por paciente de implante complexo fechado.', 'Estimated client acquisition cost (CAC) in target campaigns ranging from $100 to $250 per premium contract closed.'],
      ['Tratamentos de reabilitação oral e protocolos em Zircônia possuem tickets médios de R$ 8.000 a R$ 25.000+, estabelecendo alta margem.', 'Custom annual contracts and premium coaching programs average $3,000 to $8,000+, ensuring high customer lifetime value (LTV).'],
      
      // Page 10 - Oceano Azul
      ['Turismo Odontológico Executivo', 'High-End Corporate Wellness Programs'],
      ['Mirar em pacientes de alta renda do interior paulista ou de outros estados. A capacidade do Day Clinic da ImplArt de resolver casos complexos em até 48h torna viável o "Implante Tour" (viajar para a capital, fazer o procedimento cirúrgico com anestesista e retornar com os dentes fixados em Zircônia).', 'Partner with local high-end corporations to offer private wellness and performance coaching for top executives. The VIP program can be integrated into corporate benefits.'],
      ['Mapeamento de pacientes que já possuem próteses protocolo antigas em resina desgastada ou acrílico amarelado. O tráfego pago focará na substituição e upgrade para a Zircônia 3D Metal-Free, com maior durabilidade, estética e resistência.', 'Targeting high-earning individuals currently stuck in generic gym routines. Paid ads will focus on professional coaching, biomechanics correction, and time-efficient personal training.'],
      
      ['Implante Unitário Premium', 'Plano Mensal Gold (3x na semana)'],
      ['Implante Nacional + Coroa', 'Plano Trimestral Platinum (Treino + Nutrição)'],
      ['Protocolo All-on-4 (Arcada Completa)', 'Planos Anuais VIP de Alta Performance'],
      ['R$ 4.500,00', 'R$ 800,00'],
      ['R$ 3.200,00', 'R$ 2.200,00'],
      ['R$ 22.000,00', 'R$ 7.900,00'],
      ['5 implantes unitários por mês', '15 planos mensais ativos'],
      ['2 protocolos de arcada por mês', '5 planos anuais fechados por mês'],
      ['R$ 66.500,00', 'R$ 51.500,00'],
      ['R$ 12.000,00', 'R$ 7.500,00'],
      ['R$ 54.500,00', 'R$ 44.000,00'],
      
      // Page 11 - Síntese
      ['Roberto Markarian', 'Austin Simply Fit Team'],
      ['Dr. Roberto Markarian', 'Austin Simply Fit Team'],
      ['Dossiê Clínica ImplArt - Confidencial', 'Dossier Austin Simply Fit - Confidential'],
      
      // Identidade Visual
      ['<!-- INJECT_CORES_RACIONAL -->[Racional das cores será injetado aqui pelo script de dossiês]<!-- END_INJECT_CORES_RACIONAL -->', 'O Premium Orange atua como um estímulo imediato de alta performance, energia explosiva e foco, contrastando com o Vibrant Green que remete a saúde regenerativa, vitalidade e nutrição.'],
      ['<!-- INJECT_COLOR_1_HEX -->#000000<!-- END_INJECT_COLOR_1_HEX -->', '#e05a00'],
      ['<!-- INJECT_COLOR_1_NAME -->Cor 1<!-- END_INJECT_COLOR_1_NAME -->', 'Premium Orange'],
      ['<!-- INJECT_COLOR_2_HEX -->#FFFFFF<!-- END_INJECT_COLOR_2_HEX -->', '#22c55e'],
      ['<!-- INJECT_COLOR_2_NAME -->Cor 2<!-- END_INJECT_COLOR_2_NAME -->', 'Vibrant Green'],
      ['<!-- INJECT_TIPO_RACIONAL -->[Racional tipográfico será injetado aqui pelo script de dossiês]<!-- END_INJECT_TIPO_RACIONAL -->', 'A fonte Playfair Display é mantida para garantir o status premium e exclusivo do estúdio, enquanto a Inter é utilizada para dados analíticos, métricas corporais e clareza de leitura nas planilhas.'],
      ['<!-- INJECT_FONT_1_CSS -->\\\'Playfair Display\\\', serif<!-- END_INJECT_FONT_1_CSS -->', "'Playfair Display', serif"],
      ['<!-- INJECT_FONT_1_NAME -->Playfair Display<!-- END_INJECT_FONT_1_NAME -->', 'Playfair Display'],
      ['<!-- INJECT_FONT_2_CSS -->\\\'Inter\\\', sans-serif<!-- END_INJECT_FONT_2_CSS -->', "'Inter', sans-serif"],
      ['<!-- INJECT_FONT_2_NAME -->Inter<!-- END_INJECT_FONT_2_NAME -->', 'Inter'],

      // Limpeza genérica final
      ['Day Clinic', 'Training Studio'],
      ['ImplArt', 'Austin Simply Fit'],
      ['implantes', 'workout programs'],
      ['implante', 'workout program'],
      ['São Paulo - SP', 'Austin - Texas (EUA)']
    ]
  },
  {
    name: 'elizabete',
    display: 'Dra. Elizabete De Marchi',
    dossierDir: 'template-elizabete',
    dossierFile: 'dossie.html',
    title: 'Dra. Elizabete De Marchi - Biomedicina Estética',
    primaryColor: '#02c5ba', // Tiffany
    accentColor: '#c5a27e',  // Nude/Rosê
    image: 'https://images.unsplash.com/photo-1594824432258-454fa9156637?q=80&w=800&auto=format&fit=crop',
    replacements: [
      ['Fundada há mais de 15 anos em São Paulo (SP) pelo renomado cirurgião-dentista Dr. Roberto Markarian, especialista em odontologia premium e implantes, a Clínica ImplArt destaca-se no mercado nacional.', 'Atuando há mais de 10 anos em Curitiba (PR), a especialista Dra. Elizabete De Marchi, referência em biomedicina estética e harmonização facial de alto padrão, destaca-se pela individualização absoluta.'],
      ['4. Autoridade Científica USP', '4. Autoridade e Reconhecimento Local'],
      ['Fundamentação técnica e coordenação de cirurgias liderada pelo Dr. Roberto Markarian, Mestre e Doutor pela USP.', 'Ganhadora do prêmio Melhores do Ano por três anos consecutivos (2021, 2022 e 2023) pelo Jornal A Folha do Batel.'],
      ['"Coroa finalizada em até 48h"', '"Consulta com 3 horas de duração"'],
      ['"Diretor Doutor pela USP"', '"Prêmio Melhores do Ano 3x consecutivas"'],
      ['"Cirurgia com Anestesiologista"', '"Técnicas de Biossegurança Rígidas"'],
      ['"Selo e componentes Straumann"', '"Utilização de Allergan e Galderma"'],
      ['"O luxo de sorrir"', '"Beleza Natural e Elegante"'],
      ['Dossiê Estratégico | ImplArt', 'Dossiê Estratégico | Dra. Elizabete De Marchi'],
      ['Análise Estratégica <br><span class="text-brand-primary">Clínica ImplArt</span>', 'Análise Estratégica <br><span class="text-brand-primary">Dra. Elizabete De Marchi</span>'],
      ['https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop', 'https://images.unsplash.com/photo-1594824432258-454fa9156637?q=80&w=800&auto=format&fit=crop'],
      ['Este documento apresenta um raio-x estratégico para a reabilitação oral e odontologia digital premium. O foco está em centralizar a jornada cirúrgica do paciente sem fricção, sem dor e de forma extremamente veloz.', 'Este documento apresenta um raio-x estratégico para o mercado de estética avançada e rejuvenescimento facial de alto padrão. O foco está em atrair pacientes qualificados e que valorizam a individualização do diagnóstico.'],
      ['Dossiê Clínica ImplArt - Inteligência Comercial', 'Dossiê Dra. Elizabete De Marchi - Inteligência Comercial'],
      ['ImplArt Frente ao Posicionamento de Mercado', 'Dra. Elizabete De Marchi Frente ao Posicionamento de Mercado'],
      ['A Clínica ImplArt destaca-se sob a liderança do Dr. Roberto Markarian (Doutor e Mestre pela USP) e possui infraestrutura tecnológica fantástica in-house (Scanner Intraoral e Fresagem Robótica CAD/CAM). Isso a coloca no topo de capacidade técnica de atendimento nacional.', 'A Dra. Elizabete De Marchi destaca-se no mercado pelo atendimento focado em segurança e sua metodologia de consulta diagnóstica detalhada. É ganhadora de prêmios locais de melhor biomédica esteta e grande referência de confiança na região de Curitiba.'],
      ['O site atual e a abordagem digital focam excessivamente em terminologia científica fria de engenharia e cirurgia dos implantes. Esse foco técnico acaba ativando barreiras subconscientes de medo da dor na mente do paciente premium, além de atrair leads não-qualificados que buscam preço/convênio.', 'A abordagem digital atual capta muitos curiosos e pacientes desqualificados que buscam apenas "procedimentos de tabela" e pacotes fechados. Isso sobrecarrega a equipe de atendimento com leads que não entendem a exclusividade e a entrega de valor de um tratamento individualizado.'],
      ['Ajustar a presença digital da ImplArt para focar na facilitação da jornada: **Day Clinic Digital** (tratamento rápido em até 48h devido ao laboratório próprio) e **Sedação Consciente** (conforto e eliminação absoluta da dor), convertendo leads qualificados diretamente para o WhatsApp.', 'Ajustar a presença digital para atuar como um **ímã de atração local**, posicionando a Dra. Elizabete como a clínica mais confiável ("Beleza sem Exageros") e valorizando o atendimento individualizado, convertendo pacientes da comunidade local para o WhatsApp.'],
      ['Clínica ImplArt', 'Clínica Elizabete De Marchi'],
      ['implart.com.br', 'draelizabete.com.br'],
      ['odontologia premium e implantes', 'biomedicina estética avançada e harmonização'],
      ['implantes e próteses', 'procedimentos estéticos faciais e corporais'],
      ['tomografia computadorizada e Day Clinic', 'avaliação tridimensional e consulta individualizada'],
      ['área odontológica', 'área de biomedicina estética e harmonização'],
      ['tratamentos odontológicos', 'procedimentos de rejuvenescimento'],
      ['dentistas e implantodontistas', 'biomédicos estetas e especialistas'],
      ['sorriso e mastigação', 'autoestima e beleza natural'],
      ['implante e prótese', 'botox, preenchimento e bioestimulador'],
      ['consultório dentário', 'clínica de estética local'],
      ['Avatar A: O Executivo / Empresário', 'Avatar A: A Executiva / Empresária de Sucesso'],
      ['Foco em restabelecer a mastigação e estética rapidamente', 'Foco em rejuvenescimento natural, suavização de rugas e cansaço visual'],
      ['dente quebrado ou prótese desajustada', 'linhas de expressão marcadas e perda de firmeza na pele'],
      ['Medo de sentir dor ou de ficar sem os dentes durante o processo.', 'Medo de resultados artificiais ("rosto congelado") ou downtime longo.'],
      ['Avatar B: A Paciente Madura (Mãe/Avó)', 'Avatar B: A Mulher Madura e Ativa (45-65 anos)'],
      ['Deseja segurança para mastigar e sorrir sem constrangimentos.', 'Deseja gerenciar o envelhecimento mantendo a elegância e firmeza.'],
      ['perda óssea e dentes moles', 'flacidez facial e perda de volume no contorno mandibular'],
      ['Preocupação com o custo e se a saúde geral permite fazer a cirurgia.', 'Preocupação com tratamentos dolorosos ou ineficazes.'],
      ['Dor do tratamento', 'Desconforto do procedimento'],
      ['Anestesia computadorizada e sedação consciente coordenada por médico anestesista na própria clínica.', 'Uso de anestésicos tópicos de alta potência e técnicas minimamente invasivas com microcânulas.'],
      ['Prótese provisória fixa no mesmo dia, sem ficar sem dentes.', 'Retorno rápido às atividades diárias com mínimo edema ou inchaço.'],
      ['Consultórios Boutique Jardins', 'Clínicas de Harmonização Premium'],
      ['Redes Populares', 'Franquias de Estética Low-Cost'],
      ['Franquias de Médio Porte', 'Clínicas de Estética de Bairro'],
      ['Franquias Estéticas (Facetas)', 'Redes de Estética Populares'],
      ['Consultórios Familiares Tradicionais', 'Consultórios Médicos Tradicionais'],
      ['Foco em implantes de alto ticket e atendimento VIP.', 'Foco em pacotes prontos de harmonização e preenchedores de baixo custo.'],
      ['Tratamentos rápidos, materiais de baixa qualidade e foco em volume.', 'Foco em volume rápido de aplicação de toxina botulínica barata.'],
      ['Foco em ortodontia e clínica geral.', 'Foco em limpezas de pele padrão e peelings superficiais.'],
      ['Venda agressiva de lentes de contato de resina com preços baixos.', 'Promoções em massa de preenchimento labial e descontos agressivos.'],
      ['Dentista da família, focado em tratamentos tradicionais de saúde bucal.', 'Dermatologistas focados apenas em patologias da pele, sem foco em estética moderna.'],
      ['Terceirizam o laboratório. Prazos de até 20 dias para entrega de próteses definitivas.', 'Resultados padronizados ("rostos iguais") por falta de estudo individualizado.'],
      ['Não possuem centro cirúrgico preparado para Sedação Consciente com anestesiologista.', 'Não utilizam bioestimuladores importados de alta durabilidade e pureza.'],
      ['Foco em estética rápida; falta de bagagem técnica para reabilitações ósseas complexas.', 'Foco em pacotes fechados de grande volume; falta de especialização em rejuvenescimento natural.'],
      ['Medo do motorzinho / dor na cirurgia', 'Medo de artificialidade / visual exagerado'],
      ['Uso da sedação consciente médica para fricção zero de dor.', 'Técnicas de mapeamento avançadas para resultados elegantes e sutis.'],
      ['Segurança dos implantes importados (Straumann)', 'Qualidade dos produtos importados (Allergan, Galderma)'],
      ['Garantia estendida e rastreabilidade total do implante.', 'Abertura dos produtos lacrados na frente da paciente, garantindo segurança.'],
      ['Falta de clareza sobre o tempo de tratamento', 'Falta de clareza sobre o tempo de recuperação (downtime)'],
      ['Explicação visual da carga imediata (dentes fixos em 72h).', 'Cronograma simples detalhando a evolução e estabilização dos resultados.'],
      ['Os 6 Pilares de Vantagem da ImplArt', 'Os 6 Pilares de Vantagem da Dra. Elizabete'],
      ['Fresadora robotizada interna de Zircônia 3D. Próteses fixas executadas em tempo recorde sem envio para laboratórios externos.', 'Consulta de Diagnóstico Biomédico de até 3 horas de duração para análise facial completa.'],
      ['Tomografia digital panorâmica realizada instantaneamente na consulta inicial, eliminando exames externos.', 'Mapeamento Tridimensional das expressões faciais para manter a naturalidade dos movimentos.'],
      ['Protocolos específicos que viabilizam a extração e inserção do dente provisório no mesmo dia cirúrgico.', 'Uso exclusivo de injetáveis importados de altíssima pureza (Allergan e Galderma).'],
      ['6. Componentes Straumann', '6. Protocolo de Biossegurança Rígido'],
      ['Utilização exclusiva da marca de implantes suíça número 1 do mundo, oferecendo as maiores taxas de ósseointegração.', 'Acompanhamento detalhado pós-procedimento e suporte dedicado para total segurança clínica.'],
      ['Computadorização em 3D que planeja o sorriso e fresa as coroas em minutos.', 'Softwares avançados de análise facial computadorizada.'],
      ['Sedação monitorada por anestesista para realizar cirurgias sem qualquer dor.', 'Uso de técnicas anestésicas locais exclusivas para conforto total.'],
      ['Tomografia computadorizada 3D e raio-x panorâmico dentro do consultório.', 'Uso de bioestimuladores e ultrassom para tratar a flacidez em camadas.'],
      ['Liderança técnica com mestrado e doutorado na melhor universidade do país.', 'Autoridade local premiada por 3 anos consecutivos em estética.'],
      ['Dentes fixos sobre implantes em até 72 horas em vez de esperar 6 meses.', 'Resultados estáveis e naturais, valorizando as características individuais.'],
      ['Uso dos melhores implantes suíços do mundo com garantia vitalícia.', 'Utilização exclusiva dos melhores produtos e marcas líderes mundiais.'],
      ['Bloco da Sedação Sem Dor', 'Bloco da Beleza Natural'],
      ['Explicando a sedação consciente médica para eliminar o medo da dor.', 'Apresentando a filosofia de rejuvenescimento sutil e refinado.'],
      ['Provas Tecnológicas Visuais', 'Qualificação da Metodologia'],
      ['Demonstração do laboratório digital e scanners intra-orais em vídeo.', 'Apresentação da consulta diagnóstica individualizada e prêmios.'],
      ['Tomografia Computadorizada', 'Mapeamento Facial Digital'],
      ['Day Clinic e Carga Imediata de Zircônia em 48h.', 'Harmonização Facial Individualizada e Protocolos de Rejuvenescimento.'],
      ['Ancoragem da durabilidade vitalícia e luxo da Zircônia 3D.', 'Ancoragem no valor inestimável da autoestima, segurança e produtos de alto padrão.'],
      ['Mapeamento das forças e fraquezas dos concorrentes locais para guiar o diferencial competitivo da ImplArt:', 'Mapeamento das forças e fraquezas dos concorrentes locais para guiar o diferencial competitivo da Dra. Elizabete:'],
      ['Fotos atrativas de lentes de resina no Instagram.', 'Postagens estéticas de antes e depois no feed.'],
      ['Zero tecnologia intraoral in-house. O paciente precisa ir a um centro radiológico externo fazer exames básicos.', 'Atendimento acelerado de volume; falta de personalização no pós-procedimento.'],
      ['A grande oportunidade reside em atender o paciente que precisa de reabilitação complexa e exige <strong class="text-zinc-800">velocidade máxima, conforto absoluto e zero dor.</strong> A centralização estrutural (Tomografia + Cirurgia com Médico Anestesiologista + Laboratório Digital 3D Próprio) é o trunfo comercial que isola a ImplArt do mercado convencional.', 'A grande oportunidade reside em captar pacientes locais que buscam rejuvenescimento facial seguro e exigem <strong class="text-zinc-800">resultados naturais, segurança absoluta e um profissional de confiança no bairro.</strong> A metodologia ética (consulta detalhada + produtos de qualidade + prêmio local) é o trunfo que a isola das clínicas populares massificadas.'],
      ['Coroa finalizada em até 48h', 'Resultados elegantes e naturais'],
      ['Selo e componentes Straumann', 'Injetáveis importados de alta pureza'],
      ['Mensagem imediata de tempo e conforto: destaque para "Day Clinic" e "Dentes Fixos no mesmo dia". Resolve a objeção de falta de tempo do Executivo.', 'Mensagem imediata de rejuvenescimento sutil e segurança: destaque para "Resultados Naturais" e "Biossegurança". Afasta curiosos de preço.'],
      ['Exposição da fresadora de Zircônia e dos scanners 3D. Mostra que a clínica possui laboratório tecnológico próprio e não terceiriza.', 'Exposição dos certificados de especialista e do prêmio Melhores do Ano. Passa credibilidade inabalável.'],
      ['Diferente do tráfego comum de odontologia de convênio, as campanhas premium focam na atração de poucos casos de alta rentabilidade por mês:', 'Diferente do tráfego focado apenas em limpezas baratas, as campanhas focam na atração de pacientes regulares e fiéis para tratamentos de estética facial contínuos:'],
      ['Estimativa de custo de investimento em tráfego focado de alta intenção variando de R$ 350 a R$ 600 por paciente de implante complexo fechado.', 'Estimativa de investimento de tráfego variando de R$ 200 a R$ 400 por paciente de harmonização de alto valor fechado.'],
      ['Tratamentos de reabilitação oral e protocolos em Zircônia possuem tickets médios de R$ 8.000 a R$ 25.000+, estabelecendo alta margem.', 'Tratamentos de rejuvenescimento e harmonização facial possuem tickets excelentes, estabelecendo previsibilidade e escala de pacientes.'],
      ['Turismo Odontológico Executivo', 'Plano Facial de Manutenção Anual'],
      ['Mirar em pacientes de alta renda do interior paulista ou de outros estados. A capacidade do Day Clinic da ImplArt de resolver casos complexos em até 48h torna viável o "Implante Tour" (viajar para a capital, fazer o procedimento cirúrgico com anestesista e retornar com os dentes fixados em Zircônia).', 'Criar planos de acompanhamento continuado para aplicação preventiva de toxina botulínica e bioestimuladores de colágeno ao longo do ano, garantindo previsibilidade de receita e fidelização do paciente.'],
      ['Mapeamento de pacientes que já possuem próteses protocolo antigas em resina desgastada ou acrílico amarelado. O tráfego pago focará na substituição e upgrade para a Zircônia 3D Metal-Free, com maior durabilidade, estética e resistência.', 'Captação de pacientes insatisfeitas com procedimentos exagerados realizados em outras clínicas, focando no posicionamento de refinamento sutil e correções elegantes.'],
      ['Implante Unitário Premium', 'Toxina Botulínica (3 áreas)'],
      ['Implante Nacional + Coroa', 'Preenchimento Labial / Olheiras'],
      ['Protocolo All-on-4 (Arcada Completa)', 'Protocolo de Rejuvenescimento Facial (5 seringas)'],
      ['R$ 4.500,00', 'R$ 1.900,00'],
      ['R$ 3.200,00', 'R$ 1.500,00'],
      ['R$ 22.000,00', 'R$ 7.900,00'],
      ['5 implantes unitários por mês', '12 aplicações de botox por mês'],
      ['2 protocolos de arcada por mês', '3 protocolos de rejuvenescimento por mês'],
      ['R$ 66.500,00', 'R$ 46.500,00'],
      ['R$ 12.000,00', 'R$ 7.500,00'],
      ['R$ 54.500,00', 'R$ 39.000,00'],
      ['Roberto Markarian', 'Dra. Elizabete De Marchi'],
      ['Dr. Roberto Markarian', 'Dra. Elizabete De Marchi'],
      ['Dossiê Clínica ImplArt - Confidencial', 'Dossiê Dra. Elizabete De Marchi - Confidencial'],

      // Identidade Visual
      ['<!-- INJECT_CORES_RACIONAL -->[Racional das cores será injetado aqui pelo script de dossiês]<!-- END_INJECT_CORES_RACIONAL -->', 'O Tiffany Blue comunica biossegurança, tranquilidade clínica e estética premium internacional, enquanto o Nude Rosé evoca feminilidade, delicadeza e acolhimento humano em cada consulta.'],
      ['<!-- INJECT_COLOR_1_HEX -->#000000<!-- END_INJECT_COLOR_1_HEX -->', '#02c5ba'],
      ['<!-- INJECT_COLOR_1_NAME -->Cor 1<!-- END_INJECT_COLOR_1_NAME -->', 'Tiffany Blue'],
      ['<!-- INJECT_COLOR_2_HEX -->#FFFFFF<!-- END_INJECT_COLOR_2_HEX -->', '#c5a27e'],
      ['<!-- INJECT_COLOR_2_NAME -->Cor 2<!-- END_INJECT_COLOR_2_NAME -->', 'Nude Rosé'],
      ['<!-- INJECT_TIPO_RACIONAL -->[Racional tipográfico será injetado aqui pelo script de dossiês]<!-- END_INJECT_TIPO_RACIONAL -->', 'A tipografia Playfair Display transmite a exclusividade de um atendimento boutique, enquanto a Inter garante legibilidade moderna e didática nas explicações dos procedimentos faciais.'],
      ['<!-- INJECT_FONT_1_CSS -->\\\'Playfair Display\\\', serif<!-- END_INJECT_FONT_1_CSS -->', "'Playfair Display', serif"],
      ['<!-- INJECT_FONT_1_NAME -->Playfair Display<!-- END_INJECT_FONT_1_NAME -->', 'Playfair Display'],
      ['<!-- INJECT_FONT_2_CSS -->\\\'Inter\\\', sans-serif<!-- END_INJECT_FONT_2_CSS -->', "'Inter', sans-serif"],
      ['<!-- INJECT_FONT_2_NAME -->Inter<!-- END_INJECT_FONT_2_NAME -->', 'Inter'],

      ['Day Clinic', 'Protocolo Boutique'],
      ['ImplArt', 'Dra. Elizabete De Marchi'],
      ['implantes', 'procedimentos estéticos'],
      ['implante', 'procedimento estético'],
      ['São Paulo - SP', 'Curitiba - PR']
    ]
  }
];

companies.forEach(company => {
  console.log(`\nGerando dossie.html para ${company.display}...`);
  let content = baseDossierHtml;
  
  // 1. Substituir cores primária e secundária/acento
  content = content.replace(/#7c3aed/g, company.primaryColor); // Substitui cor roxa
  content = content.replace(/#10b981/g, company.accentColor);  // Substitui cor verde
  
  // 2. Aplicar todas as substituições textuais
  company.replacements.forEach(([search, replace]) => {
    // Usar regex global para garantir que todas as ocorrências de texto sejam substituídas
    // Escapar caracteres especiais para o regex funcionar corretamente
    const escapedSearch = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    content = content.replace(new RegExp(escapedSearch, 'g'), replace);
  });
  
  // 3. Gravar arquivo HTML
  const outDir = path.join(basePath, company.dossierDir);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  const outFile = path.join(outDir, company.dossierFile);
  fs.writeFileSync(outFile, content, 'utf8');
  console.log(`Dossiê HTML gravado com sucesso em: ${outFile}`);
});

console.log('\n--- Geração concluída com sucesso! ---');
