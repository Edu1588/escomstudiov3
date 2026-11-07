import React, { useEffect, useRef, useState } from "react";
import { montarCenaGalpao } from "@/components/v6/floresta/cenaGalpao";

interface ForestHeroBackgroundProps {
  /** carregamento dos modelos, 0..100 (alimenta a LoadingCurtain) */
  onProgress?: (pct: number) => void;
  /** a cortina já abriu */
  curtainsOpen?: boolean;
  /** chamado quando o texto do HERO pode aparecer (cena pronta e cortina aberta) */
  onRevealed?: () => void;
  /** progresso da rolagem do palco: frameRef do GSAP vai de 0 a 95 */
  frameRef?: React.MutableRefObject<number>;
}

/** Atraso entre a cortina abrir e o texto aparecer, para a cena "respirar" primeiro. */
const REVELAR_APOS_MS = 450;

/**
 * Fundo do HERO: robô agachado na floresta com névoa e a borboleta azul (three.js).
 * Se o WebGL ou os modelos falharem, cai para um fundo escuro com gradiente e libera o HERO do mesmo jeito.
 */
export function ForestHeroBackground({ onProgress, curtainsOpen = false, onRevealed, frameRef }: ForestHeroBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [estado, setEstado] = useState<"carregando" | "pronta" | "falhou">("carregando");
  const rolagem = useRef(0);
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;
  const onRevealedRef = useRef(onRevealed);
  onRevealedRef.current = onRevealed;

  const escuroRef = useRef<HTMLDivElement>(null);
  // GSAP escreve em frameRef.current (0..95); a cena lê 0..1 a cada quadro.
  // Enquanto o texto do manifesto (seção 2) está na tela, a cena escurece para dar leitura;
  // no fim, quando a câmera chega no olho, o escuro sai para o brilho azul aparecer antes dos pixels.
  useEffect(() => {
    if (!frameRef) return;
    let id = 0;
    const suave = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
    const ler = () => {
      const r = frameRef.current / 95;
      rolagem.current = r;
      if (escuroRef.current) escuroRef.current.style.opacity = String(0.62 * suave(0.08, 0.24, r) * (1 - suave(0.8, 0.94, r)));
      id = requestAnimationFrame(ler);
    };
    id = requestAnimationFrame(ler);
    return () => cancelAnimationFrame(id);
  }, [frameRef]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let cena: ReturnType<typeof montarCenaGalpao> | null = null;
    try {
      cena = montarCenaGalpao(el, { onProgress: (p) => onProgressRef.current?.(p), rolagem });
      cena.pronta.then(() => setEstado("pronta")).catch(() => setEstado("falhou"));
    } catch {
      // WebGL indisponível
      onProgressRef.current?.(100);
      setEstado("falhou");
    }
    return () => cena?.destruir();
  }, []);

  useEffect(() => {
    if (!curtainsOpen || estado === "carregando") return;
    const t = setTimeout(() => onRevealedRef.current?.(), REVELAR_APOS_MS);
    return () => clearTimeout(t);
  }, [curtainsOpen, estado]);

  // trava de segurança: nunca deixa o HERO escondido se algo travar no carregamento
  useEffect(() => {
    if (!curtainsOpen) return;
    const t = setTimeout(() => onRevealedRef.current?.(), 6000);
    return () => clearTimeout(t);
  }, [curtainsOpen]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-[#0a1a19]">
      <div
        ref={containerRef}
        className="absolute inset-0 transition-opacity duration-1000"
        style={{ opacity: estado === "pronta" ? 1 : 0 }}
        aria-hidden="true"
      />
      {estado === "falhou" && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_55%,#1f4a40_0%,#0a1a19_60%)]" />
      )}
      {/* escurece a cena na seção 2 (opacidade controlada pela rolagem, acima) */}
      <div ref={escuroRef} className="absolute inset-0 bg-[#020807]" style={{ opacity: 0 }} />
      {/* véus de leitura: texto à esquerda no computador, embaixo no celular */}
      <div className="absolute inset-0 hidden md:block bg-[linear-gradient(90deg,rgba(4,12,14,.78)_0%,rgba(4,12,14,.48)_34%,rgba(4,12,14,0)_60%)]" />
      <div className="absolute inset-0 md:hidden bg-[linear-gradient(0deg,rgba(4,12,14,.9)_0%,rgba(4,12,14,.55)_40%,rgba(4,12,14,0)_64%)]" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent" />
    </div>
  );
}
