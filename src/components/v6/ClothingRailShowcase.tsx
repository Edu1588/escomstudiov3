"use client";

import React from "react";
import { ClothingRailHero, RailGarment } from "@/components/ui/product-rail-gallery";
import { ShoppingBag, Sparkles, ArrowRight } from "lucide-react";

const ATELIER_ITEMS: RailGarment[] = [
  {
    id: "veste-01",
    name: "Jaqueta Bomber Estruturada",
    kind: "jacket",
    color: "#181a20",
    trim: "#00d1ff",
    tag: "R$ 1.890",
    description: "Tecido tecnológico impermeável com costuras termosseladas e forro térmico respirável.",
    details: ["Sarja Resinada 380g", "Zíper YKK Bidirecional", "Corte Oversized"],
  },
  {
    id: "veste-02",
    name: "Tricô Cashmere Gola Alta",
    kind: "knit",
    color: "#2a2725",
    trim: "#d4a373",
    tag: "R$ 1.250",
    description: "Malha encorpada em pura lã merino com toque aveludado e caimento drapeado impecável.",
    details: ["100% Lã Merino Australiana", "Acabamento Ribbed", "Sem Costura Lateral"],
  },
  {
    id: "veste-03",
    name: "Hoodie Brutalist 450 GSM",
    kind: "hoodie",
    color: "#121316",
    trim: "#00e6a5",
    tag: "R$ 790",
    description: "Moletom pesado de alta densidade com capuz estruturado duplo e bolso canguru embutido.",
    details: ["Algodão Pima 450g", "Capuz Anti-Deformação", "Pigment Dye"],
  },
  {
    id: "veste-04",
    name: "Camisa Oversized Oxford",
    kind: "shirt",
    color: "#d0d4dc",
    trim: "#111827",
    tag: "R$ 680",
    description: "Camisa estruturada de alfaiataria contemporânea com punhos chanfrados e botões em madrepérola.",
    details: ["Algodão Egípcio 120 Fios", "Gola Estruturada", "Bainha Reta"],
  },
  {
    id: "veste-05",
    name: "Casaco Sobretudo Lã Batida",
    kind: "coat",
    color: "#1f1d1b",
    trim: "#f6c65b",
    tag: "R$ 2.490",
    description: "Alfaiataria pesada com forro em cupro acetinado e ombreiras discretas para postura imponente.",
    details: ["Lã Batida 620g", "Forro Cupro", "Fechamento Transpassado"],
  },
];

export function ClothingRailShowcase() {
  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#0e0e11] via-[#09090b] to-[#040405] border border-white/10 p-4 sm:p-6 md:p-10 shadow-[0_25px_80px_rgba(0,0,0,0.85)]">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan">
            <ShoppingBag className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-cyan font-bold">E-Commerce & Moda</span>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-400 text-xs font-mono">Arara Física Interativa</span>
            </div>
            <h4 className="text-lg font-serif text-white font-light">Atelier Digital · Interação 360° no Cabide</h4>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
          <Sparkles className="size-3 text-[#00e6a5]" />
          <span>Passe o mouse ou toque para girar e ver frente e verso das peças</span>
        </div>
      </div>

      {/* Hero Interativo com Cabide e Rotação Física */}
      <div className="w-full overflow-hidden">
        <ClothingRailHero
          items={ATELIER_ITEMS}
          hanger="matte"
          autoplay={false}
          eyebrow="Coleção Editorial · Toque na arara"
          heading="O provador digital que transforma cliques em peças vendidas."
          caption="Deslize o cursor pela arara, puxe o cabide e inspecione a estrutura e acabamentos de cada peça em 360 graus."
          action={
            <div className="flex items-center gap-4 mt-2">
              <a
                href="#diagnostico"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-cyan text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-white transition-all shadow-[0_0_25px_rgba(0,209,255,0.35)]"
              >
                <span>Implantar no meu E-commerce</span>
                <ArrowRight className="size-3.5" />
              </a>
            </div>
          }
          className="bg-transparent py-4"
        />
      </div>
    </div>
  );
}

export default ClothingRailShowcase;
