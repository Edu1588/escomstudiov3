import React, { useCallback, useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Settings, ShieldCheck, LogOut, RefreshCw, CheckCircle2, XCircle, DownloadCloud } from "lucide-react";
import { getAuth, sendPasswordResetEmail, signOut } from "firebase/auth";
import { app, db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

interface Checagem { ok: boolean; ms: number; erro?: string }
interface Status { supabase: Checagem; tabelas: Checagem; chaves: Record<string, boolean> }

function Linha({ ok, titulo, detalhe }: { ok: boolean; titulo: string; detalhe?: string }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-[#1a1a1a] last:border-0">
      {ok ? <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" /> : <XCircle size={16} className="text-red-400 mt-0.5 shrink-0" />}
      <div className="min-w-0">
        <div className="text-sm text-white">{titulo}</div>
        {detalhe && <div className="text-[11px] text-gray-500 mt-0.5 break-words">{detalhe}</div>}
      </div>
    </div>
  );
}

export default function Configuracoes() {
  const auth = getAuth(app);
  const email = auth.currentUser?.email || "";
  const [aviso, setAviso] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [status, setStatus] = useState<Status | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [falhaStatus, setFalhaStatus] = useState("");
  const [importando, setImportando] = useState(false);
  const [resultadoImport, setResultadoImport] = useState("");

  // Traz do Firestore (base antiga) o Portfólio, a Trajetória e o contador de visitas para o Supabase. Pode repetir sem duplicar.
  const importarFirestore = async () => {
    setImportando(true); setResultadoImport("");
    try {
      const ler = async (nome: string) => (await getDocs(collection(db, nome))).docs.map(d => ({ id: d.id, ...d.data() }));
      const [portfolio, experiences, page_views, daily_views] = await Promise.all([
        ler("portfolio_projects"), ler("experiences"), ler("page_views"), ler("daily_views"),
      ]);
      const r = await fetch("/api/migrar-firestore", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portfolio, experiences, page_views, daily_views }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.success) throw new Error(j.error || `A API respondeu ${r.status}`);
      setResultadoImport(`Importado: ${j.portfolio} projetos, ${j.experiences} experiências, ${j.page_views} páginas e ${j.daily_views} dias de visitas.`);
    } catch (e: any) { setResultadoImport("Erro: " + (e?.message || "falha na importação")); }
    finally { setImportando(false); }
  };

  const carregarStatus = useCallback(async () => {
    setCarregando(true);
    setFalhaStatus("");
    try {
      const res = await fetch("/api/system-status");
      if (!res.ok) throw new Error(res.status === 401 ? "Sessão sem autorização. Saia e entre de novo." : `A API respondeu ${res.status}`);
      setStatus(await res.json());
    } catch (e: any) {
      setStatus(null);
      setFalhaStatus(e?.message || "Não foi possível consultar a API.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregarStatus(); }, [carregarStatus]);

  const trocarSenha = async () => {
    if (!email) return;
    setEnviando(true);
    setAviso(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setAviso({ tipo: "ok", texto: `Enviamos um link para redefinir a senha em ${email}. Confira também o spam.` });
    } catch (e: any) {
      setAviso({ tipo: "erro", texto: "Não foi possível enviar o e-mail agora. Tente de novo em instantes." });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto w-full">
      <Header title="Configurações" />
      <div className="p-8 max-w-[1200px] mx-auto mt-4">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#00d1ff]/10 text-[#00d1ff] flex items-center justify-center">
            <Settings size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Configurações do Sistema</h2>
            <p className="text-gray-400 text-sm mt-1">Sua conta e o estado real dos serviços de que o painel depende.</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Estado dos serviços */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[10px] text-[#00d1ff] font-mono tracking-widest">ESTADO DOS SERVIÇOS</div>
              <button onClick={carregarStatus} disabled={carregando} className="flex items-center gap-2 text-xs text-gray-400 hover:text-white disabled:opacity-50 transition-colors">
                <RefreshCw size={13} className={carregando ? "animate-spin" : ""} /> Atualizar
              </button>
            </div>
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-5 py-2">
              {carregando && !status && <div className="py-6 text-sm text-gray-500">Consultando…</div>}
              {falhaStatus && <Linha ok={false} titulo="API do painel" detalhe={falhaStatus} />}
              {status && (
                <>
                  <Linha ok={status.supabase.ok} titulo="Banco de leads (Supabase)"
                    detalhe={status.supabase.ok ? `Respondeu em ${status.supabase.ms} ms` : `Fora do ar: ${status.supabase.erro}. Leads, Mineração, Contratos e as propostas dos leads dependem dele — confira se o projeto não está pausado no painel do Supabase.`} />
                  <Linha ok={status.tabelas.ok} titulo="Tabelas do painel (Supabase)"
                    detalhe={status.tabelas.ok ? `Todas as 17 tabelas encontradas (${status.tabelas.ms} ms)` : `Faltando: rode o arquivo SUPABASE_SETUP.sql no SQL Editor do Supabase. Detalhe: ${status.tabelas.erro}`} />
                  {Object.entries(status.chaves).map(([nome, ok]) => (
                    <Linha key={nome} ok={ok} titulo={nome} detalhe={ok ? "Chave configurada" : "Chave não configurada no Vercel (ou com o nome errado)"} />
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Conta e segurança */}
          <div className="w-full lg:w-80 space-y-6">
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6">
              <div className="text-[10px] text-[#00d1ff] font-mono tracking-widest mb-4">CONTA</div>
              <div className="text-xs text-gray-500 mb-1">E-mail de acesso</div>
              <div className="text-sm text-white break-all">{email || "—"}</div>
            </div>

            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6">
              <h3 className="font-bold text-white mb-2 flex items-center gap-2"><DownloadCloud size={16} className="text-[#00d1ff]" /> Dados antigos</h3>
              <p className="text-xs text-gray-500 mb-5">Copia do Firestore para o Supabase o Portfólio, a Trajetória e o contador de visitas. Pode repetir: não duplica. (Finanças tem o próprio botão.)</p>
              <button onClick={importarFirestore} disabled={importando}
                className="w-full bg-[#111] border border-[#333] hover:border-[#00d1ff]/50 text-white rounded-lg py-3 text-sm font-medium transition-colors disabled:opacity-50">
                {importando ? "Importando…" : "Importar do Firestore"}
              </button>
              {resultadoImport && <p className={`text-xs mt-3 ${resultadoImport.startsWith("Erro") ? "text-red-400" : "text-emerald-400"}`}>{resultadoImport}</p>}
            </div>

            <div className="bg-[#0a0a0a] border border-[#00d1ff]/20 rounded-xl p-6">
              <h3 className="font-bold text-white mb-2 flex items-center gap-2"><ShieldCheck size={16} className="text-[#00d1ff]" /> Segurança</h3>
              <p className="text-xs text-gray-500 mb-5">Enviamos um link para o seu e-mail para você criar uma nova senha.</p>
              <button onClick={trocarSenha} disabled={enviando || !email}
                className="w-full bg-[#111] border border-[#333] hover:border-[#00d1ff]/50 text-white rounded-lg py-3 text-sm font-medium transition-colors disabled:opacity-50">
                {enviando ? "Enviando…" : "Enviar link para alterar a senha"}
              </button>
              {aviso && <p className={`text-xs mt-3 ${aviso.tipo === "ok" ? "text-emerald-400" : "text-red-400"}`}>{aviso.texto}</p>}
              <button onClick={() => signOut(auth).catch(() => {})}
                className="w-full mt-3 flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white py-2 transition-colors">
                <LogOut size={14} /> Sair do painel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
