import React from "react";
import { Header } from "../components/Header";
import { ExternalLink, Terminal } from "lucide-react";

// O Harvey roda no computador que tem a assinatura do Claude, não na Vercel. Por isso esta tela só leva ao painel local.
// O link só abre quando o Harvey estiver rodando (harvey dashboard) nesta máquina.
const PAINEL_HARVEY = "http://localhost:5555";

export default function Prospeccao() {
  return (
    <div className="h-full flex flex-col relative">
      <Header title="Prospecção" subtitle="Harvey: agente de prospecção que roda neste computador" />
      <div className="p-8 flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-[#111] border border-white/10 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Terminal size={20} className="text-cyan" />
              <h2 className="font-bold text-lg">Painel do Harvey</h2>
            </div>
            <p className="text-sm text-gray-400">
              O painel do Harvey fica no computador onde ele está instalado. Para abrir, o Harvey precisa estar rodando nesta máquina
              (<code className="text-cyan">harvey dashboard</code>).
            </p>
            <a
              href={PAINEL_HARVEY}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#00d1ff] hover:bg-[#00b8e6] text-black font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
            >
              Abrir painel do Harvey <ExternalLink size={14} />
            </a>
            <p className="text-xs text-gray-500">Endereço: {PAINEL_HARVEY}. Se a página não abrir, o Harvey não está rodando nesta máquina.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
