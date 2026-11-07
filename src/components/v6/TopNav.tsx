import { useEffect, useState } from "react";
import { useLanguage } from "@/components/v6/LanguageContext";

/**
 * Menu horizontal do topo (desktop, xl+): uma coluna por seção, rótulo em mono caixa-alta sobre um fio fino;
 * a seção visível ganha o ponto à esquerda. Fica entre as duas linhas verticais da página (8vw) e para antes
 * do botão fixo CONTATO, que continua no canto direito.
 */
export function TopNav() {
  const { t } = useLanguage();
  const [ativa, setAtiva] = useState("top");

  const itens = [
    { id: "top", label: "Home" },
    { id: "solucoes", label: t.nav.solutions },
    { id: "processo", label: t.nav.process },
    { id: "projetos", label: t.nav.projects },
    { id: "sobre", label: t.nav.about },
    { id: "insights", label: t.nav.insights },
  ];

  useEffect(() => {
    const ids = itens.map((i) => i.id);
    const obs = new IntersectionObserver(
      (entradas) => entradas.forEach((e) => { if (e.isIntersecting) setAtiva(e.target.id); }),
      { rootMargin: "-30% 0px -70% 0px" },
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
    // os ids são fixos; só os rótulos mudam com o idioma
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav
      aria-label="Menu principal"
      className="fixed top-6 z-50 hidden xl:grid grid-cols-6 gap-6 left-[calc(8vw+2rem)] right-[calc(8vw+11rem)] mix-blend-difference text-[#ECECE3]"
    >
      {itens.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          aria-current={ativa === id ? "true" : undefined}
          className="group flex items-center gap-2 border-b border-current/40 pb-1.5 font-mono text-[10px] uppercase tracking-[0.14em] whitespace-nowrap transition-colors hover:border-current"
        >
          <span
            className={`size-1.5 shrink-0 rounded-full bg-current transition-all duration-300 ${ativa === id ? "opacity-100 scale-100" : "opacity-0 scale-0 group-hover:opacity-60 group-hover:scale-100"}`}
          />
          <span className="truncate">{label}</span>
        </a>
      ))}
    </nav>
  );
}
