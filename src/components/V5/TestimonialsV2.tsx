import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function TestimonialsV2() {
  const { t } = useLanguage();

  const testimonials = [
    {
      name: 'Renata Freitas',
      role: 'Fundadora na Renata Freitas Studio',
      quote:
        'O reposicionamento visual e estrutural que a Fábrica fez superou expectativas. Nossa marca agora transmite premiumness absoluta e as conversões aumentaram em 180%.',
      rating: 5,
    },
    {
      name: 'Arthur M. Borges',
      role: 'Diretor Comercial na Azul Veículos',
      quote:
        'Forjaram nossas campanhas de tráfego de um jeito agressivo e cirúrgico. Saímos da estagnação e batemos o recorde anual de vendas em apenas 3 meses.',
      rating: 5,
    },
    {
      name: 'Patrícia Silva',
      role: 'CMO na Telic Technologies',
      quote:
        'A equipe possui uma obsessão por design e performance que raramente se vê. O novo ecossistema digital que forjaram para nós é uma verdadeira máquina de conversão.',
      rating: 5,
    },
    {
      name: 'Gustavo Paioça',
      role: 'Sócio Administrador na Paioça do Caboclo',
      quote:
        'Estratégia digital brilhante combinada com desenvolvimento limpo. Entregaram no prazo e com um nível estético que chamou a atenção de todo o mercado.',
      rating: 5,
    },
    {
      name: 'Marcos G. Correia',
      role: 'Diretor de Operações na Gorre',
      quote:
        'Sempre tivemos pé atrás com agências até conhecer o processo de forja da Fábrica. Eles não oferecem fórmulas mágicas, entregam engenharia e criatividade pura.',
      rating: 5,
    },
    {
      name: 'Isabela Alencar',
      role: 'Fundadora na Estoque & Office',
      quote:
        'O ecossistema institucional que criaram deu uma nova cara técnica para a nossa empresa. Nossas propostas agora fecham com ticket 3x maior devido ao posicionamento.',
      rating: 5,
    },
    {
      name: 'Roberto Campos',
      role: 'Head de Marketing na Unimais Veículos',
      quote:
        'A velocidade de execução e a precisão do design nos deixaram impressionados. O tráfego qualificado dobrou e o suporte pós-lançamento é sensacional.',
      rating: 5,
    },
    {
      name: 'Renan Brasil',
      role: 'CEO na Brasil Visa',
      quote:
        'Processos transparentes e métricas reais. Eles derrubaram velhos conceitos de agências tradicionais e colocaram tecnologia modular a serviço do nosso negócio.',
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="relative py-24 z-10 bg-[#050505] border-t border-white/15 w-full overflow-hidden flex flex-col justify-center">
      {/* Dragonfly Header */}
      <div className="flex flex-col items-center justify-center text-center mb-8 px-4">
        <span className="text-[#ff4f00] font-mono text-3xl md:text-4xl font-bold tracking-widest mb-1">
          07
        </span>
        <h2 className="text-white font-mono text-2xl md:text-4xl font-bold tracking-[0.25em] uppercase">
          TESTEMUNHOS REAIS
        </h2>
      </div>

      {/* SEC Bar */}
      <div className="w-full border-y border-white/15 py-3 px-4 sm:px-8 mb-12 flex justify-between items-center font-mono text-xs text-white/40 tracking-widest">
        <span>SEC-07</span>
        <span>— TESTEMUNHOS REAIS</span>
        <span>[ FORJADOS NA PRÁTICA ]</span>
      </div>

      {/* Title & Desc */}
      <div className="px-6 md:px-16 max-w-4xl mx-auto mb-16 text-center">
        <h3 className="text-3xl sm:text-5xl font-mono text-white font-bold mb-4 tracking-tight uppercase">
          Forjados na prática, provados no mercado.
        </h3>
        <p className="font-sans text-sm sm:text-base text-white/70 font-light leading-relaxed max-w-2xl mx-auto">
          A honestidade do nosso resultado se reflete no crescimento e orgulho dos nossos clientes. Veja o que dizem aqueles que tiveram suas marcas forjadas na Fábrica.
        </p>
      </div>

      {/* 2 & 4 Grid Matrix Edge-to-Edge with Hairline Borders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full border-y border-white/15">
        {testimonials.map((tItem, idx) => (
          <div
            key={idx}
            className={`p-8 border-b border-white/15 ${
              (idx + 1) % 4 !== 0 ? 'lg:border-r border-white/15' : ''
            } hover:bg-white/[0.02] transition-colors flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[#ff4f00] font-mono text-xs font-bold">
                  0{idx + 1}
                </span>
                <div className="text-[#ff4f00] text-xs">
                  {'★'.repeat(tItem.rating)}
                </div>
              </div>

              <blockquote className="font-serif italic text-xs sm:text-sm text-white/80 leading-relaxed mb-6">
                "{tItem.quote}"
              </blockquote>
            </div>

            <div className="border-t border-white/10 pt-4 font-mono text-xs">
              <div className="text-white font-bold tracking-wide uppercase">
                {tItem.name}
              </div>
              <div className="text-white/40 text-[10px] uppercase tracking-wider mt-0.5">
                {tItem.role}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Banner at bottom */}
      <div className="w-full border-b border-white/15 bg-[#050505]/80 py-8 px-6 text-center">
        <span className="font-mono text-xs sm:text-sm text-[#ff4f00] font-bold tracking-[0.25em] uppercase">
          ★ 100% dos parceiros com canais digitais forjados sob medida
        </span>
      </div>
    </section>
  );
}
