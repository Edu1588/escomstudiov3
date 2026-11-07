import React, { useEffect, useRef } from "react";
import { montarCenaBusto } from "@/components/v6/floresta/cenaBusto";

/**
 * Robô da seção dos cards (substitui o RobotBust3D antigo). Fica dentro da coluna da direita:
 * entra andando pela direita, senta de pernas cruzadas no canto e a cabeça acompanha os cards subindo.
 * Os cards são marcados com `data-busto-card`.
 */
export default function RoboBusto() {
  const colunaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const coluna = colunaRef.current;
    const secao = coluna?.closest("section");
    if (!coluna || !secao) return;
    let cena: ReturnType<typeof montarCenaBusto> | null = null;
    try {
      cena = montarCenaBusto({ coluna, secao });
    } catch {
      /* sem WebGL: a coluna fica só com o brilho de fundo */
    }
    return () => cena?.destruir();
  }, []);

  return <div ref={colunaRef} className="absolute inset-0" aria-hidden="true" />;
}
