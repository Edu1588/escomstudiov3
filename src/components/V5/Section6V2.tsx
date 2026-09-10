import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function Section6V2() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    company: '',
    segment: 'Tecnologia',
    needs: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const segments = [
    'Tecnologia',
    'Serviços',
    'Indústria / Varejo',
    'E-commerce',
    'Infoprodutos / Educação',
    'Outro',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        whatsapp: '',
        company: '',
        segment: 'Tecnologia',
        needs: '',
      });
    }, 4000);
  };

  return (
    <section id="contact" className="relative py-24 z-10 bg-[#050505] border-t border-white/15 w-full overflow-hidden">
      {/* Dragonfly Header */}
      <div className="flex flex-col items-center justify-center text-center mb-8 px-4">
        <span className="text-[#ff4f00] font-mono text-3xl md:text-4xl font-bold tracking-widest mb-1">
          08
        </span>
        <h2 className="text-white font-mono text-2xl md:text-4xl font-bold tracking-[0.25em] uppercase">
          CONTATO
        </h2>
      </div>

      {/* SEC Bar */}
      <div className="w-full border-y border-white/15 py-3 px-4 sm:px-8 mb-16 flex justify-between items-center font-mono text-xs text-white/40 tracking-widest">
        <span>SEC-08</span>
        <span>— FORMULÁRIO DE BRIEFING & CONTATO DIRETO</span>
        <span>[ LIGUE NOSSOS MOTORES ]</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left Side: Briefing Form */}
        <div className="lg:col-span-7 bg-[#050505]/80 backdrop-blur-md border border-white/15 p-8 sm:p-12 rounded-2xl">
          <div className="mb-8">
            <span className="text-[#ff4f00] font-mono text-xs font-bold tracking-[0.25em] uppercase block mb-2">
              AQUECER A SUA MARCA
            </span>
            <h3 className="text-2xl sm:text-4xl font-mono text-white font-bold tracking-tight uppercase">
              Preencha o briefing rápido
            </h3>
            <p className="font-sans text-xs sm:text-sm text-white/60 font-light mt-1">
              E ligue os nossos motores para forjar sua campanha ou ecossistema digital.
            </p>
          </div>

          {submitted ? (
            <div className="bg-[#ff4f00]/10 border border-[#ff4f00] p-6 rounded-xl text-center font-mono text-sm text-[#ff4f00]">
              ✓ BRIEFING ENVIADO COM SUCESSO!
              <p className="text-xs text-white/70 mt-1 font-sans">
                Nossos mestres da forja entrarão em contato em breve via WhatsApp.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/70 uppercase tracking-widest mb-2">
                    Seu nome *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nome completo"
                    className="w-full bg-[#050505]/60 border border-white/20 focus:border-[#ff4f00] text-white p-3.5 rounded-lg outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-white/70 uppercase tracking-widest mb-2">
                    Seu melhor e-mail *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@empresa.com"
                    className="w-full bg-[#050505]/60 border border-white/20 focus:border-[#ff4f00] text-white p-3.5 rounded-lg outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/70 uppercase tracking-widest mb-2">
                    WhatsApp de contato *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="(00) 0 0000-0000"
                    className="w-full bg-[#050505]/60 border border-white/20 focus:border-[#ff4f00] text-white p-3.5 rounded-lg outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-white/70 uppercase tracking-widest mb-2">
                    Nome da empresa
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Sua marca / empresa"
                    className="w-full bg-[#050505]/60 border border-white/20 focus:border-[#ff4f00] text-white p-3.5 rounded-lg outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 uppercase tracking-widest mb-2">
                  Segmento de Atuação
                </label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {segments.map((seg) => (
                    <button
                      type="button"
                      key={seg}
                      onClick={() => setFormData({ ...formData, segment: seg })}
                      className={`px-3 py-2 rounded-md transition-all text-[10px] tracking-wider uppercase border ${
                        formData.segment === seg
                          ? 'bg-[#ff4f00] text-black font-bold border-[#ff4f00]'
                          : 'bg-[#050505]/60 text-white/60 border-white/10 hover:border-white/30'
                      }`}
                    >
                      {seg}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white/70 uppercase tracking-widest mb-2">
                  O que sua marca mais precisa?
                </label>
                <textarea
                  rows={3}
                  value={formData.needs}
                  onChange={(e) => setFormData({ ...formData, needs: e.target.value })}
                  placeholder="Conte-nos brevemente sobre seus desafios e objetivos..."
                  className="w-full bg-[#050505]/60 border border-white/20 focus:border-[#ff4f00] text-white p-3.5 rounded-lg outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#ff4f00] hover:bg-[#ff4f00]/90 text-black font-bold py-4 px-8 rounded-xl flex items-center justify-between text-sm transition-all duration-300 shadow-lg shadow-[#ff4f00]/20 uppercase tracking-wider"
              >
                <span>INICIAR FORJAMENTO COMERCIAL</span>
                <span className="text-lg">→</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Side: Direct Contact */}
        <div className="lg:col-span-5 flex flex-col justify-between font-mono space-y-8">
          <div className="bg-[#050505]/80 backdrop-blur-md border border-white/15 p-8 rounded-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff4f00]/10 border border-[#ff4f00]/30 text-[#ff4f00] text-xs font-bold uppercase tracking-widest">
              <span>★ A FORJA ESTÁ ACESA</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-mono text-white font-bold tracking-tight uppercase">
              VAMOS FORJAR JUNTOS?
            </h3>

            <p className="font-sans text-xs sm:text-sm text-white/70 font-light leading-relaxed">
              Fale diretamente com os mestres da Fábrica. Preferimos um contato direto para alinhamentos rápidos ou orçamentos customizados que demandam urgência comercial.
            </p>

            <div className="space-y-4 pt-4 border-t border-white/10 text-xs">
              <a
                href="https://wa.me/5519982646492"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#ff4f00] hover:bg-[#ff4f00]/90 text-black font-bold py-4 px-6 rounded-xl flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">📱</span>
                  <span>WhatsApp: (19) 9 8264-6492</span>
                </div>
                <span>→</span>
              </a>

              <a
                href="https://instagram.com/fabricapublicidadedigital"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">📷</span>
                  <span>Instagram: @fabricapublicidadedigital</span>
                </div>
                <span>↗</span>
              </a>

              <a
                href="mailto:hello@fabricapublicidade.com.br"
                className="w-full bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">✉</span>
                  <span>hello@fabricapublicidade.com.br</span>
                </div>
                <span>↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info & Links */}
      <footer className="mt-24 pt-12 border-t border-white/15 max-w-7xl mx-auto px-6 md:px-16 w-full font-mono text-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-12">
          {/* Logo & Tagline */}
          <div className="md:col-span-5 space-y-3">
            <span className="text-[#ff4f00] text-[10px] font-bold tracking-[0.3em] uppercase block">
              ESTÚDIO INTEGRADO | RETORNO SOB ROI
            </span>
            <h4 className="text-xl font-bold text-white tracking-tight uppercase">
              FÁBRICA — PUBLICIDADE & DIGITAL
            </h4>
            <p className="font-sans text-xs text-white/50 leading-relaxed max-w-md font-light">
              Forjando marcas com estratégia, criatividade e performance desde o primeiro martelo. A sua marca moldada sob medida com fogo, consistência e força de ferro.
            </p>
          </div>

          {/* Quick Nav */}
          <div className="md:col-span-4 space-y-2">
            <span className="text-white/40 uppercase tracking-widest text-[10px] block mb-2 font-bold">
              NAVEGUE
            </span>
            <div className="flex flex-wrap gap-4 text-white/80">
              <a href="#journey" className="hover:text-[#ff4f00] transition-colors">Jornada</a>
              <a href="#services" className="hover:text-[#ff4f00] transition-colors">O que forjamos</a>
              <a href="#clients" className="hover:text-[#ff4f00] transition-colors">Clientes</a>
              <a href="#contact" className="hover:text-[#ff4f00] transition-colors">Contato</a>
            </div>
          </div>

          {/* Location */}
          <div className="md:col-span-3 text-right md:text-right space-y-1 text-white/40">
            <span className="text-white/40 uppercase tracking-widest text-[10px] block mb-2 font-bold">
              LOCALIZAÇÃO
            </span>
            <p className="text-white font-bold">Campinas / SP</p>
            <p>Santo Antônio / SP</p>
            <p>Atendimento Brasil & Global</p>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-white/40 text-[11px]">
          <div>
            © {new Date().getFullYear()} FÁBRICA PUBLICIDADE & DIGITAL. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-4">
            <span>BRANDING</span>
            <span>•</span>
            <span>COMUNICAÇÃO</span>
            <span>•</span>
            <span>DESIGN</span>
            <span>•</span>
            <span>DIGITAL</span>
            <span>•</span>
            <span>TECH HOUSE</span>
          </div>
        </div>
      </footer>
    </section>
  );
}


