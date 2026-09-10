import React from 'react';

export default function FooterV2() {
  return (
    <footer className="relative z-10 bg-[#050505] border-t border-white/15 w-full text-white font-mono text-xs overflow-hidden">
      {/* Top 3 Columns: SECTIONS, CONNECT, LEGAL matching Dragonfly screenshot 10 */}
      <div className="grid grid-cols-1 md:grid-cols-3 w-full border-b border-white/15">
        {/* Col 1: SECTIONS */}
        <div className="p-8 sm:p-12 border-b md:border-b-0 md:border-r border-white/15">
          <span className="text-[#ff4f00] font-bold tracking-widest uppercase block mb-6">
            [ SECTIONS ]
          </span>
          <ul className="space-y-3 text-white/70 tracking-wider">
            <li>
              <a href="#philosophy" className="hover:text-[#ff4f00] transition-colors">
                01. SOBRE / PHILOSOPHY
              </a>
            </li>
            <li>
              <a href="#services" className="hover:text-[#ff4f00] transition-colors">
                02. SERVIÇOS / O QUE FORJAMOS
              </a>
            </li>
            <li>
              <a href="#team" className="hover:text-[#ff4f00] transition-colors">
                03. TIME / MESTRES DE FORJA
              </a>
            </li>
            <li>
              <a href="#portfolio" className="hover:text-[#ff4f00] transition-colors">
                04. PORTFOLIO / CASOS
              </a>
            </li>
            <li>
              <a href="#spotlight" className="hover:text-[#ff4f00] transition-colors">
                05. SPOTLIGHT / CLIENTES
              </a>
            </li>
            <li>
              <a href="#careers" className="hover:text-[#ff4f00] transition-colors">
                06. CAREERS / VAGAS
              </a>
            </li>
          </ul>
        </div>

        {/* Col 2: CONNECT */}
        <div className="p-8 sm:p-12 border-b md:border-b-0 md:border-r border-white/15">
          <span className="text-[#ff4f00] font-bold tracking-widest uppercase block mb-6">
            [ CONNECT ]
          </span>
          <ul className="space-y-3 text-white/70 tracking-wider">
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#ff4f00] transition-colors"
              >
                INSTAGRAM ↗
              </a>
            </li>
            <li>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#ff4f00] transition-colors"
              >
                LINKEDIN ↗
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/5519999999999"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#ff4f00] transition-colors"
              >
                WHATSAPP / DIRETO ↗
              </a>
            </li>
            <li>
              <a
                href="mailto:contato@fabricapublicidade.com.br"
                className="hover:text-[#ff4f00] transition-colors"
              >
                CONTATO@FABRICAPUBLICIDADE.COM.BR
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: LEGAL & HQ */}
        <div className="p-8 sm:p-12">
          <span className="text-[#ff4f00] font-bold tracking-widest uppercase block mb-6">
            [ LEGAL & HQ ]
          </span>
          <div className="space-y-3 text-white/60 leading-relaxed">
            <p>FÁBRICA PUBLICIDADE & DIGITAL LTDA.</p>
            <p>CAMPINAS & SANTO ANTÔNIO / SP — BRASIL</p>
            <p className="pt-2 text-white/40 text-[10px]">
              © {new Date().getFullYear()} FÁBRICA. TODOS OS DIREITOS RESERVADOS.
            </p>
          </div>
        </div>
      </div>

      {/* Centered ASCII Logo Emblem >| |< matching Dragonfly screenshot 10 */}
      <div className="py-8 flex justify-center items-center border-b border-white/15 bg-[#050505]">
        <pre className="font-mono text-lg text-[#ff4f00] font-bold tracking-widest select-none">
          &gt;| FÁBRICA |&lt;
        </pre>
      </div>

      {/* Bottom Info Paragraph matching Dragonfly screenshot 10 */}
      <div className="p-6 sm:p-10 text-center text-white/40 text-[11px] leading-relaxed max-w-4xl mx-auto">
        Fábrica Publicidade & Digital é uma agência brasileira independente focada em branding de alto impacto, estratégias digitais, direção de arte e engenharia web de alta performance. Moldamos marcas com a resistência do ferro para liderar mercados disputados.
      </div>
    </footer>
  );
}
