import React, { useEffect, useState } from "react";

interface LoadingCurtainProps {
  progress: number; // 0 to 100
  onFinished?: () => void;
}

export function LoadingCurtain({ progress, onFinished }: LoadingCurtainProps) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [hideNumber, setHideNumber] = useState(false);
  const [openCurtains, setOpenCurtains] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  // Garantir que a página sempre abra no topo e sem barra de rolagem durante o loading
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);

      const prevHtmlOverflow = document.documentElement.style.overflow;
      const prevBodyOverflow = document.body.style.overflow;

      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";

      return () => {
        document.documentElement.style.overflow = prevHtmlOverflow;
        document.body.style.overflow = prevBodyOverflow;
      };
    }
  }, []);

  // Quando as cortinas abrem, destrava a rolagem da página e garante o topo
  useEffect(() => {
    if (openCurtains && typeof window !== "undefined") {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      window.scrollTo(0, 0);
    }
  }, [openCurtains]);

  // Interpolação suave do progresso de 0 a 100%
  useEffect(() => {
    const timer = setInterval(() => {
      setDisplayProgress((prev) => {
        if (prev < progress) {
          const diff = progress - prev;
          const increment = Math.max(1, Math.ceil(diff * 0.18));
          return Math.min(100, prev + increment);
        }
        return prev;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [progress]);

  // Quando atinge 100%: visualiza completo, some os elementos e abre a cortina lateralmente
  useEffect(() => {
    if (displayProgress >= 100) {
      // 1. Dá tempo do usuário contemplar o "O" esticado em 100%
      const hideTimer = setTimeout(() => {
        setHideNumber(true);
      }, 400);

      // 2. Abre as duas metades da cortina lateralmente
      const openTimer = setTimeout(() => {
        setOpenCurtains(true);
      }, 750);

      // 3. Remove o elemento do DOM após a conclusão da animação
      const finishTimer = setTimeout(() => {
        setIsRemoved(true);
        if (typeof window !== "undefined") {
          document.documentElement.style.overflow = "";
          document.body.style.overflow = "";
          window.scrollTo(0, 0);
        }
        if (onFinished) onFinished();
      }, 1800);

      return () => {
        clearTimeout(hideTimer);
        clearTimeout(openTimer);
        clearTimeout(finishTimer);
      };
    }
  }, [displayProgress, onFinished]);

  if (isRemoved) return null;

  // Cálculo matemático rigoroso do esticamento do "O" de ESCOM (preloader-0 -> preloader-100)
  const S = (displayProgress / 100) * 4148.731;
  const viewBoxWidth = 3217 + S;

  const oPath =
    S <= 10
      ? `M1021.498,840.329c-27.158,0 -50.295,-5.196 -69.414,-15.589c-19.118,-10.392 -33.702,-25.466 -43.751,-45.222c-10.049,-19.755 -15.074,-43.702 -15.074,-71.84l0,-171.181c0,-28.236 5.025,-52.207 15.074,-71.914c10.049,-19.706 24.633,-34.756 43.751,-45.148c19.118,-10.392 42.256,-15.589 69.414,-15.589c27.256,0 50.418,5.196 69.487,15.589c19.069,10.392 33.628,25.442 43.678,45.148c10.049,19.706 15.074,43.678 15.074,71.914l0,171.181c0,28.138 -5.025,52.085 -15.074,71.84c-10.049,19.755 -24.609,34.829 -43.678,45.222c-19.069,10.392 -42.232,15.589 -69.487,15.589Zm0,-40.442c27.354,0 48.506,-7.892 63.458,-23.677c14.951,-15.785 22.427,-37.942 22.427,-66.472l0,-175.299c0,-28.628 -7.476,-50.81 -22.427,-66.546c-14.951,-15.736 -36.104,-23.604 -63.458,-23.604c-27.256,0 -48.384,7.868 -63.384,23.604c-15,15.736 -22.501,37.918 -22.501,66.546l0,175.299c0,28.53 7.5,50.688 22.501,66.472c15,15.785 36.128,23.677 63.384,23.677Z`
      : `M1035.747,840.329c-4.508,0 -8.905,-0.143 -13.192,-0.43c-21.537,-1.439 -40.277,-6.492 -56.222,-15.159c-19.118,-10.392 -33.702,-25.466 -43.751,-45.222c-10.049,-19.755 -15.074,-43.702 -15.074,-71.84l0,-171.181c0,-28.236 5.025,-52.207 15.074,-71.914c10.049,-19.706 24.633,-34.756 43.751,-45.148c19.118,-10.392 42.256,-15.589 69.414,-15.589c4.895,0 ${S.toFixed(3)},0.168 ${(S + 4.632).toFixed(3)},0.503c21.154,1.531 39.553,6.56 55.197,15.086c19.069,10.392 33.628,25.442 43.678,45.148c10.049,19.706 15.074,43.678 15.074,71.914l0,171.181c0,28.138 -5.025,52.085 -15.074,71.84c-10.049,19.755 -24.609,34.829 -43.678,45.222c-19.069,10.392 -${(S + 32.573).toFixed(3)},15.589 -${(S + 59.828).toFixed(3)},15.589Zm0,-40.442c4.242,0 ${S.toFixed(3)},-0.19 ${(S + 3.944).toFixed(3)},-0.569c21.486,-2.068 38.546,-9.771 51.178,-23.108c14.951,-15.785 22.427,-37.942 22.427,-66.472l0,-175.299c0,-28.628 -7.476,-50.81 -22.427,-66.546c-12.717,-13.384 -29.919,-21.076 -51.608,-23.076c-3.811,-0.352 -${(S + 0.574).toFixed(3)},-0.527 -${(S + 4.663).toFixed(3)},-0.527c-27.256,0 -48.384,7.868 -63.384,23.604c-15,15.736 -22.501,37.918 -22.501,66.546l0,175.299c0,28.53 7.5,50.688 22.501,66.472c15,15.785 36.128,23.677 63.384,23.677Z`;

  return (
    <div
      className={`fixed inset-0 z-[99999] overflow-hidden select-none pointer-events-none transition-opacity duration-300 ${
        openCurtains ? "pointer-events-none" : "pointer-events-auto"
      }`}
      aria-hidden={openCurtains}
    >
      {/* Cortina Metade Esquerda */}
      <div
        className="absolute top-0 bottom-0 left-0 w-1/2 bg-[#050505] transition-transform duration-1000 ease-[cubic-bezier(0.77,0,0.175,1)] will-change-transform"
        style={{
          transform: openCurtains ? "translateX(-100%)" : "translateX(0)",
        }}
      />

      {/* Cortina Metade Direita */}
      <div
        className="absolute top-0 bottom-0 right-0 w-1/2 bg-[#050505] transition-transform duration-1000 ease-[cubic-bezier(0.77,0,0.175,1)] will-change-transform"
        style={{
          transform: openCurtains ? "translateX(100%)" : "translateX(0)",
        }}
      />

      {/* Header Superior Técnico */}
      <div
        className="absolute top-0 left-0 right-0 z-20 w-full px-5 sm:px-10 pt-5 sm:pt-8 pb-2 flex justify-between items-center font-mono text-[10px] sm:text-xs text-zinc-500 tracking-widest uppercase pointer-events-none transition-all duration-300"
        style={{
          opacity: hideNumber ? 0 : 1,
          transform: hideNumber ? "translateY(-10px)" : "translateY(0)",
        }}
      >
        <div className="flex items-center gap-2">
          <div className="size-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00d1ff]" />
          <span className="text-zinc-300 font-light">ESCOM / SYSTEM BOOT</span>
        </div>
        <span className="text-zinc-600 font-mono tracking-[0.2em]">MARK LXXXV // v2026</span>
      </div>

      {/* Conteúdo Central: Indicador Editorial Limpo */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 transition-all duration-300 overflow-hidden"
        style={{
          opacity: hideNumber ? 0 : 1,
          transform: hideNumber ? "scale(0.96) translateY(8px)" : "scale(1) translateY(0)",
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="size-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-mono text-[10px] sm:text-xs tracking-[0.28em] text-zinc-400 uppercase text-center font-light">
            INITIALIZING GROWTH ARCHITECTURE
          </span>
        </div>
      </div>

      {/* Canto Inferior: Efeito ESCOM com "O" que estica até 100% de ponta a ponta */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 w-full px-4 sm:px-8 md:px-10 pb-4 sm:pb-8 flex flex-col gap-2 pointer-events-none transition-all duration-300"
        style={{
          opacity: hideNumber ? 0 : 1,
          transform: hideNumber ? "translateY(16px)" : "translateY(0)",
        }}
      >
        {/* Linha com Porcentagem no Topo do Efeito (idêntico à referência enviada) */}
        <div className="w-full flex justify-between items-end font-mono px-0.5 mb-1">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tight tabular-nums drop-shadow-[0_0_12px_rgba(255,255,255,0.25)]">
              {displayProgress}%
            </span>
          </div>
          <span className="hidden sm:inline-block text-[10px] sm:text-xs font-mono uppercase tracking-[0.22em] text-zinc-500">
            HIGH PERFORMANCE ARCHITECTURE
          </span>
        </div>

        {/* SVG Esticando com viewBox dinâmico e oPath matematicamente calculado */}
        <div className="w-full flex items-end justify-center overflow-hidden">
          <svg
            viewBox={`0 360 ${viewBoxWidth} 500`}
            preserveAspectRatio="xMidYMid meet"
            className="w-full h-10 sm:h-14 md:h-18 lg:h-22 fill-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            style={{ display: "block", willChange: "viewBox" }}
          >
            {/* 1. Letras 'ESC' (Fixas na esquerda) */}
            <g>
              {/* E */}
              <path
                d="M-0,835.917l0,-427.659l42.354,0l0,427.659l-42.354,0Zm29.118,0l0,-39.413l200.005,0l0,39.413l-200.005,0Zm0,-192.652l0,-39.413l176.475,0l0,39.413l-176.475,0Zm0,-195.594l0,-39.413l200.005,0l0,39.413l-200.005,0Z"
                style={{ fill: "#fff", fillRule: "nonzero" }}
              />
              {/* S */}
              <path
                d="M408.761,840.329c-21.879,0 -41.617,-2.932 -59.216,-8.796c-17.599,-5.867 -32.407,-15.23 -44.427,-28.089c-12.019,-12.862 -20.684,-29.742 -25.993,-50.64l39.905,-14.734c6.354,22.715 17.517,38.933 33.489,48.655c15.975,9.721 34.722,14.582 56.242,14.582c28.515,0 50.329,-6.204 65.443,-18.613c15.117,-12.411 22.675,-30.309 22.675,-53.692l0,-12.817c0,-16.538 -4.167,-29.676 -12.5,-39.413c-8.334,-9.74 -19.172,-17.546 -32.515,-23.42c-13.343,-5.876 -27.76,-11.232 -43.25,-16.067c-14.118,-4.495 -28.208,-9.237 -42.271,-14.228c-14.06,-4.994 -26.87,-11.351 -38.429,-19.072c-11.56,-7.721 -20.854,-17.758 -27.882,-30.111c-7.025,-12.353 -10.538,-28.138 -10.538,-47.354l0,-10.612c0,-36.554 10.939,-64.369 32.818,-83.444c21.882,-19.078 53.444,-28.618 94.685,-28.618c31.995,0 57.347,6.684 76.054,20.051c18.711,13.364 32.037,34.581 39.978,63.651l-39.385,14.513c-6.489,-20.54 -15.927,-35.54 -28.314,-45.001c-12.384,-9.461 -28.495,-14.192 -48.333,-14.192c-27.599,0 -48.788,6.083 -63.568,18.25c-14.78,12.163 -22.17,29.838 -22.17,53.025l0,10.612c0,16.391 4.706,29.325 14.118,38.802c9.412,9.476 21.614,17.055 36.605,22.735c14.994,5.677 30.727,11.106 47.198,16.287c13.481,4.118 26.692,8.812 39.633,14.081c12.942,5.27 24.682,11.973 35.222,20.111c10.54,8.137 18.942,18.449 25.207,30.934c6.269,12.482 9.403,28.054 9.403,46.715l0,13.824c0,36.472 -11.112,64.271 -33.337,83.398c-22.222,19.124 -54.404,28.686 -96.547,28.686Z"
                style={{ fill: "#fff", fillRule: "nonzero" }}
              />
              {/* C */}
              <path
                d="M717.152,840.329c-25.638,0 -47.734,-5.423 -66.289,-16.269c-18.554,-10.846 -32.844,-26.3 -42.869,-46.362c-10.025,-20.062 -15.037,-43.99 -15.037,-71.785l0,-167.357c0,-27.991 5.012,-52.017 15.037,-72.079c10.025,-20.062 24.314,-35.516 42.869,-46.362c18.554,-10.846 40.651,-16.269 66.289,-16.269c23.726,0 44.487,4.927 62.281,14.78c17.795,9.853 31.949,23.973 42.464,42.359c10.515,18.383 16.692,40.343 18.53,65.88l-42.354,0c-1.765,-17.329 -6.293,-32.152 -13.585,-44.468c-7.292,-12.317 -16.719,-21.796 -28.282,-28.438c-11.563,-6.642 -24.581,-9.964 -39.054,-9.964c-25.408,0 -45.401,8.438 -59.979,25.313c-14.575,16.875 -21.862,39.958 -21.862,69.248l0,167.357c0,29.167 7.292,52.171 21.876,69.009c14.587,16.839 34.59,25.258 60.011,25.258c21.735,0 39.967,-7.2 54.698,-21.6c14.731,-14.4 23.457,-34.823 26.177,-61.27l42.354,0c-1.838,25.537 -8.033,47.498 -18.585,65.884c-10.552,18.383 -24.707,32.501 -42.464,42.354c-17.758,9.853 -38.5,14.78 -62.226,14.78Z"
                style={{ fill: "#fff", fillRule: "nonzero" }}
              />
            </g>

            {/* 2. Letra 'O' Dinâmica (Estica no centro em linha reta) */}
            <g>
              <path d={oPath} style={{ fill: "#fff", fillRule: "nonzero" }} />
            </g>

            {/* 3. Letras 'MSTUDIO' (Deslocadas para a direita por +S) */}
            <g transform={`translate(${S}, 0)`}>
              {/* M */}
              <path
                d="M1381.508,718.561l116.768,-310.303l42.942,0l0,427.659l-41.619,0l0,-355.598l3.677,18.824l-105.297,277.36l-32.942,0l-105.297,-271.478l3.677,-24.707l0,355.598l-41.619,0l0,-427.659l42.942,0l116.768,310.303Z"
                style={{ fill: "#fff", fillRule: "nonzero" }}
              />
              {/* S */}
              <path
                d="M1738.503,840.329c-21.879,0 -41.617,-2.932 -59.216,-8.796c-17.599,-5.867 -32.407,-15.23 -44.427,-28.089c-12.019,-12.862 -20.684,-29.742 -25.993,-50.64l39.905,-14.734c6.354,22.715 17.517,38.933 33.489,48.655c15.975,9.721 34.722,14.582 56.242,14.582c28.515,0 50.329,-6.204 65.443,-18.613c15.117,-12.411 22.675,-30.309 22.675,-53.692l0,-12.817c0,-16.538 -4.167,-29.676 -12.5,-39.413c-8.334,-9.74 -19.172,-17.546 -32.515,-23.42c-13.343,-5.876 -27.76,-11.232 -43.25,-16.067c-14.118,-4.495 -28.208,-9.237 -42.271,-14.228c-14.06,-4.994 -26.87,-11.351 -38.429,-19.072c-11.56,-7.721 -20.854,-17.758 -27.882,-30.111c-7.025,-12.353 -10.538,-28.138 -10.538,-47.354l0,-10.612c0,-36.554 10.939,-64.369 32.818,-83.444c21.882,-19.078 53.444,-28.618 94.685,-28.618c31.995,0 57.347,6.684 76.054,20.051c18.711,13.364 32.037,34.581 39.978,63.651l-39.385,14.513c-6.489,-20.54 -15.927,-35.54 -28.314,-45.001c-12.384,-9.461 -28.495,-14.192 -48.333,-14.192c-27.599,0 -48.788,6.083 -63.568,18.25c-14.78,12.163 -22.17,29.838 -22.17,53.025l0,10.612c0,16.391 4.706,29.325 14.118,38.802c9.412,9.476 21.614,17.055 36.605,22.735c14.994,5.677 30.727,11.106 47.198,16.287c13.481,4.118 26.692,8.812 39.633,14.081c12.942,5.27 24.682,11.973 35.222,20.111c10.54,8.137 18.942,18.449 25.207,30.934c6.269,12.482 9.403,28.054 9.403,46.715l0,13.824c0,36.472 -11.112,64.271 -33.337,83.398c-22.222,19.124 -54.404,28.686 -96.547,28.686Z"
                style={{ fill: "#fff", fillRule: "nonzero" }}
              />
              {/* T */}
              <path
                d="M2000.937,835.917l0,-401.481l42.354,0l0,401.481l-42.354,0Zm-106.179,-388.246l0,-39.413l254.713,0l0,39.413l-254.713,0Z"
                style={{ fill: "#fff", fillRule: "nonzero" }}
              />
              {/* U */}
              <path
                d="M2306.827,840.329c-41.374,0 -72.306,-10.662 -92.797,-31.986c-20.491,-21.324 -30.736,-53.408 -30.736,-96.253l0,-303.832l42.354,0l0,305.891c0,28.236 6.74,49.389 20.221,63.458c13.481,14.069 33.8,21.104 60.958,21.104c27.452,0 47.942,-7.035 61.472,-21.104c13.53,-14.069 20.295,-35.222 20.295,-63.458l0,-305.891l42.354,0l0,303.832c0,42.844 -10.294,74.929 -30.883,96.253c-20.589,21.324 -51.668,31.986 -93.238,31.986Z"
                style={{ fill: "#fff", fillRule: "nonzero" }}
              />
              {/* D */}
              <path
                d="M2534.775,835.917l0,-39.413l100.444,0c24.903,0 43.653,-6.16 56.252,-18.479c12.598,-12.32 18.898,-30.572 18.898,-54.758l0,-202.358c0,-24.189 -6.299,-42.441 -18.898,-54.758c-12.598,-12.32 -31.349,-18.479 -56.252,-18.479l-100.444,0l0,-39.413l98.679,0c39.413,0 69.144,9.706 89.194,29.118c20.05,19.412 30.074,48.041 30.074,85.885l0,197.652c0,25.157 -4.51,46.276 -13.53,63.356c-9.02,17.078 -22.386,29.955 -40.098,38.632c-17.709,8.677 -39.687,13.015 -65.935,13.015l-98.385,0Zm-31.766,0l0,-427.659l42.354,0l0,427.659l-42.354,0Z"
                style={{ fill: "#fff", fillRule: "nonzero" }}
              />
              {/* I */}
              <rect x="2832.283" y="408.258" width="42.354" height="427.659" style={{ fill: "#fff", fillRule: "nonzero" }} />
              {/* O */}
              <path
                d="M3095.342,840.329c-27.158,0 -50.295,-5.196 -69.414,-15.589c-19.118,-10.392 -33.702,-25.466 -43.751,-45.222c-10.049,-19.755 -15.074,-43.702 -15.074,-71.84l0,-171.181c0,-28.236 5.025,-52.207 15.074,-71.914c10.049,-19.706 24.633,-34.756 43.751,-45.148c19.118,-10.392 42.256,-15.589 69.414,-15.589c27.256,0 50.418,5.196 69.487,15.589c19.069,10.392 33.628,25.442 43.678,45.148c10.049,19.706 15.074,43.678 15.074,71.914l0,171.181c0,28.138 -5.025,52.085 -15.074,71.84c-10.049,19.755 -24.609,34.829 -43.678,45.222c-19.069,10.392 -42.232,15.589 -69.487,15.589Zm0,-40.442c27.354,0 48.506,-7.892 63.458,-23.677c14.951,-15.785 22.427,-37.942 22.427,-66.472l0,-175.299c0,-28.628 -7.476,-50.81 -22.427,-66.546c-14.951,-15.736 -36.104,-23.604 -63.458,-23.604c-27.256,0 -48.384,7.868 -63.384,23.604c-15,15.736 -22.501,37.918 -22.501,66.546l0,175.299c0,28.53 7.5,50.688 22.501,66.472c15,15.785 36.128,23.677 63.384,23.677Z"
                style={{ fill: "#fff", fillRule: "nonzero" }}
              />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
