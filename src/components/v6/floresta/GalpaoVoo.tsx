import React, { useEffect, useRef } from "react";
import { montarCenaVoo } from "@/components/v6/floresta/cenaVoo";

/**
 * Fundo da seção dos cards (substitui o RoboBusto sentado): o galpão do HERO com o robô voando por dentro.
 * Deve ficar dentro da <section>: ocupa a seção inteira e o canvas gruda na tela (sticky) enquanto ela passa.
 * Os véus escurecem a esquerda (título e cards) e as bordas de cima e de baixo (junção com as outras seções).
 */
export default function GalpaoVoo() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const secao = el?.closest("section");
    if (!el || !secao) return;
    let cena: ReturnType<typeof montarCenaVoo> | null = null;
    try {
      cena = montarCenaVoo(el, { secao });
    } catch {
      /* sem WebGL: fica o fundo preto da seção */
    }
    return () => cena?.destruir();
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div ref={ref} className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/10 max-md:bg-black/45" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent" />
      </div>
    </div>
  );
}
