import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { ExternalLink, RefreshCw, CheckCircle2 } from "lucide-react";

// Projetos no Ar = sites que o CLIENTE aceitou. O aceite é o pagamento confirmado pelo Mercado Pago
// (webhook /api/mp-webhook grava status "pago" em generated_sites no Supabase). Aprovação interna ("approved") não conta.
interface SiteAceito {
  projectId: string;
  company_name?: string;
  niche?: string;
  deployed_url?: string;
  pago_valor?: number | string;
  pago_em?: number;
  pagador_email?: string;
}

const brl = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "—";
};
const dataBR = (ms?: number) => (ms ? new Date(ms).toLocaleDateString("pt-BR") : "—");

export default function ProjetosNoAr() {
  const [sites, setSites] = useState<SiteAceito[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const carregar = async () => {
    setLoading(true);
    setErro("");
    try {
      const res = await fetch("/api/generated-sites");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const aceitos = ((json.data || []) as Array<SiteAceito & { status?: string }>)
        .filter(s => s.status === "pago")
        .sort((a, b) => (b.pago_em || 0) - (a.pago_em || 0));
      setSites(aceitos);
    } catch (e: any) {
      setErro("Não consegui carregar do Supabase (" + (e?.message || "erro") + "). Veja Configurações > Status do sistema.");
      setSites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  const total = sites.reduce((acc, s) => acc + (Number(s.pago_valor) || 0), 0);

  return (
    <div className="h-full flex flex-col relative">
      <Header title="Projetos no Ar" subtitle="Sites aceitos e pagos pelos clientes" />
      <div className="p-8 flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <div className="flex gap-6">
              <div>
                <div className="text-3xl font-bold">{sites.length}</div>
                <div className="text-xs font-mono uppercase text-white/40">sites aceitos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#39ff14]">{brl(total)}</div>
                <div className="text-xs font-mono uppercase text-white/40">recebido</div>
              </div>
            </div>
            <button onClick={carregar} className="px-4 py-2 rounded border border-white/10 text-sm flex items-center gap-2 hover:bg-white/5">
              <RefreshCw size={14} /> Atualizar
            </button>
          </div>

          {erro && <div className="mb-6 p-4 rounded-lg border border-red-500/30 bg-red-500/10 text-sm text-red-300">{erro}</div>}

          {loading ? (
            <div className="text-gray-400">Carregando projetos...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sites.map(s => (
                <div key={s.projectId} className="bg-[#111] rounded-xl border border-white/5 p-5 flex flex-col">
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <h3 className="font-bold text-lg">{s.company_name || "Sem nome"}</h3>
                    <span className="flex items-center gap-1 text-[10px] font-mono uppercase text-[#39ff14] border border-[#39ff14]/30 px-2 py-1 rounded">
                      <CheckCircle2 size={12} /> Aceito
                    </span>
                  </div>
                  {s.niche && <p className="text-sm text-gray-400 mb-4">{s.niche}</p>}
                  <div className="text-xs text-gray-500 space-y-1 mb-4">
                    <div>Pago em {dataBR(s.pago_em)} · {brl(s.pago_valor)}</div>
                    {s.pagador_email && <div className="truncate">{s.pagador_email}</div>}
                  </div>
                  {s.deployed_url ? (
                    <a href={s.deployed_url} target="_blank" rel="noopener noreferrer"
                       className="mt-auto flex items-center justify-between p-2 rounded bg-white/5 hover:bg-white/10 text-sm text-gray-300">
                      <span className="truncate mr-2">{s.deployed_url.replace(/^https?:\/\//, "")}</span>
                      <ExternalLink size={14} className="text-[#39ff14] flex-shrink-0" />
                    </a>
                  ) : (
                    <div className="mt-auto text-xs text-amber-400">Site aceito, mas sem URL publicada registrada.</div>
                  )}
                </div>
              ))}
              {!erro && sites.length === 0 && (
                <div className="col-span-full py-12 text-center text-gray-500 border border-dashed border-white/10 rounded-xl">
                  Nenhum site aceito ainda. Quando um cliente pagar pelo link do Mercado Pago, o site aparece aqui sozinho.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
