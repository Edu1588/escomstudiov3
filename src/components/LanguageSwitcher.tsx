import { useEffect, useState } from "react";
import { Globe } from "lucide-react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState<string>("pt");

  useEffect(() => {
    // Verificar idioma salvo ou cookie existente
    const saved = localStorage.getItem("escom_selected_lang") || "pt";
    setCurrentLang(saved);

    // Ocultar a barra padrao e tooltip do Google Translate via CSS
    if (!document.getElementById("google-translate-custom-css")) {
      const style = document.createElement("style");
      style.id = "google-translate-custom-css";
      style.innerHTML = `
        .goog-te-banner-frame, .goog-te-balloon-frame, #goog-gt-tt, .goog-te-spinner-pos, .skiptranslate {
          display: none !important;
        }
        body {
          top: 0px !important;
          position: static !important;
        }
        .goog-tooltip, .goog-tooltip:hover {
          display: none !important;
        }
        .goog-text-highlight {
          background-color: transparent !important;
          box-shadow: none !important;
        }
        #google_translate_element {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    }

    // Criar elemento container invisivel se nao existir
    if (!document.getElementById("google_translate_element")) {
      const gdiv = document.createElement("div");
      gdiv.id = "google_translate_element";
      gdiv.style.display = "none";
      document.body.appendChild(gdiv);
    }

    // Callback de inicializacao do Google Translate
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "pt",
            includedLanguages: "pt,en,es,zh-CN",
            autoDisplay: false,
          },
          "google_translate_element"
        );

        // Se houver idioma salvo diferente de PT, aplicar apos inicializacao
        if (saved && saved !== "pt") {
          setTimeout(() => {
            const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
            if (select) {
              select.value = saved;
              select.dispatchEvent(new Event("change"));
            }
          }, 600);
        }
      }
    };

    // Carregar script do Google Translate se nao estiver presente
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const changeLanguage = (langCode: string) => {
    setCurrentLang(langCode);
    localStorage.setItem("escom_selected_lang", langCode);

    const domain = window.location.hostname;

    if (langCode === "pt") {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
      document.cookie = `googtrans=/pt/pt; path=/; domain=${domain}`;
      document.cookie = `googtrans=/pt/pt; path=/`;
    } else {
      document.cookie = `googtrans=/pt/${langCode}; path=/; domain=${domain}`;
      document.cookie = `googtrans=/pt/${langCode}; path=/`;
    }

    const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (select) {
      select.value = langCode === "pt" ? "" : langCode;
      select.dispatchEvent(new Event("change"));
    } else {
      window.location.reload();
    }
  };

  const languages = [
    { code: "pt", label: "PT" },
    { code: "en", label: "EN" },
    { code: "es", label: "ES" },
    { code: "zh-CN", label: "CH" },
  ];

  return (
    <div className="fixed top-4 right-4 z-[99999] flex items-center gap-1.5 bg-black/85 backdrop-blur-xl border border-cyan-500/30 rounded-full px-3 py-1.5 shadow-[0_0_20px_rgba(0,229,255,0.2)] font-mono text-[11px] tracking-wider text-zinc-300 select-none">
      <span className="text-cyan-400/80 mr-1 flex items-center gap-1">
        <Globe size={13} />
      </span>
      {languages.map((lang, index) => (
        <div key={lang.code} className="flex items-center gap-1.5">
          <button
            onClick={() => changeLanguage(lang.code)}
            className={`px-2 py-0.5 rounded-full transition-all cursor-pointer font-mono ${
              currentLang === lang.code
                ? "text-cyan-400 font-bold bg-cyan-400/20 border border-cyan-400/50 shadow-[0_0_10px_rgba(0,229,255,0.3)]"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-white/10"
            }`}
          >
            {lang.label}
          </button>
          {index < languages.length - 1 && <span className="text-zinc-700 select-none">|</span>}
        </div>
      ))}
    </div>
  );
}
