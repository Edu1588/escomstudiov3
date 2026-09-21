import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/v6/LanguageContext";

export function FixedContactButton() {
  const { t } = useLanguage();

  return (
    <a
      href="#diagnostico"
      className="fixed top-5 right-5 md:top-6 md:right-10 z-50 flex items-center gap-3 bg-black/90 hover:bg-black text-white hover:text-cyan border border-white/25 hover:border-cyan px-4 py-2 font-mono text-[11px] uppercase tracking-[0.20em] transition-all duration-200 backdrop-blur-md shadow-2xl group cursor-pointer"
      title="Iniciar diagnóstico e contato com a ESCOM"
    >
      <span className="font-semibold">{t.nav.contactBtn}</span>
      <span className="size-5 border border-white/30 group-hover:border-cyan flex items-center justify-center transition-colors">
        <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
      </span>
    </a>
  );
}

export function FixedBottomBar() {
  const { language, setLanguage } = useLanguage();
  const [spTime, setSpTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat("pt-BR", {
          timeZone: "America/Sao_Paulo",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });
        setSpTime(formatter.format(now));
      } catch {
        const d = new Date();
        setSpTime(d.toTimeString().split(" ")[0]);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside
      aria-label="Barra de status do sistema"
      className="fixed bottom-0 inset-x-0 z-40 h-8 bg-black/85 backdrop-blur-md border-t border-white/10 px-5 md:px-12 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.14em] text-white/70 pointer-events-auto select-none"
    >
      {/* Idiomas EN / ES / PT */}
      <div className="flex items-center gap-2">
        <span className="text-white/40 hidden sm:inline">REGION:</span>
        <div className="flex items-center gap-1.5">
          {(["EN", "ES", "PT"] as const).map((l, index) => (
            <React.Fragment key={l}>
              <button
                onClick={() => setLanguage(l)}
                className={`transition-colors cursor-pointer px-1 py-0.5 ${
                  language === l
                    ? "text-cyan font-bold border-b border-cyan"
                    : "text-white/40 hover:text-white"
                }`}
                title={`Alternar para ${l}`}
              >
                {l}
              </button>
              {index < 2 && <span className="text-white/20">/</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Horário de São Paulo ao Vivo */}
      <div className="flex items-center gap-2 font-mono">
        <span className="inline-block size-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-white/50">SÃO PAULO:</span>
        <span className="text-white font-medium tabular-nums">{spTime || "--:--:--"}</span>
        <span className="text-white/40 text-[8px] hidden sm:inline">BRT (UTC-3)</span>
      </div>
    </aside>
  );
}
