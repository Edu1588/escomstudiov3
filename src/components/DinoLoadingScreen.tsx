import { useEffect, useRef, useState } from "react";

export default function DinoLoadingScreen() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadProgress, setLoadProgress] = useState(15);
  const [isDismissed, setIsDismissed] = useState(false);
  const isDismissedRef = useRef(false);

  // 1. Carregamento Ágil e Real dos Modelos 3D
  useEffect(() => {
    let progress = 20;
    setLoadProgress(progress);

    const checkInterval = setInterval(() => {
      progress += Math.floor(Math.random() * 15 + 10);
      if (progress >= 100) {
        progress = 100;
        setLoadProgress(100);
        clearInterval(checkInterval);

        // Transição automática rápida após atingir 100%
        setTimeout(() => {
          setIsDismissed(true);
          isDismissedRef.current = true;
        }, 600);
      } else {
        setLoadProgress(progress);
      }
    }, 180);

    // Carregamento de suporte
    const assets = ["/models/robotinho-v1.glb", "/models/3Dmodelrobot-v1.glb"];
    assets.forEach((url) => {
      fetch(url, { cache: "force-cache" }).catch(() => {});
    });

    return () => clearInterval(checkInterval);
  }, []);

  // 2. Jogo do Dinossauro Ultra Leve e Responsivo (60fps Puro)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animationId: number;

    const W = 600;
    const H = 140;
    const GROUND_Y = 115;
    const GRAVITY = 0.65;

    // Dinossauro
    const dino = {
      x: 35,
      y: GROUND_Y - 32,
      w: 28,
      h: 32,
      vy: 0,
      isGrounded: true,
      jumpForce: -11.0,
    };

    // Obstáculos (Cactos)
    type Obstacle = { x: number; y: number; w: number; h: number };
    let obstacles: Obstacle[] = [];
    let speed = 6.0;
    let obstacleTimer = 40;
    let isDead = false;
    let groundX = 0;

    const jump = () => {
      if (isDead) {
        // Reiniciar jogo
        obstacles = [];
        dino.y = GROUND_Y - 32;
        dino.vy = 0;
        dino.isGrounded = true;
        isDead = false;
        speed = 6.0;
        return;
      }
      if (dino.isGrounded) {
        dino.vy = dino.jumpForce;
        dino.isGrounded = false;
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };

    const onTap = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      jump();
    };

    window.addEventListener("keydown", onKeyDown);
    canvas.addEventListener("mousedown", onTap);
    canvas.addEventListener("touchstart", onTap, { passive: false });

    let frameCount = 0;

    const loop = () => {
      if (isDismissedRef.current) return;
      frameCount++;

      // Fundo escuro limpo e rápido
      ctx.fillStyle = "#09090b";
      ctx.fillRect(0, 0, W, H);

      // Linha do Chão
      if (!isDead) {
        groundX = (groundX + speed) % 16;
      }
      ctx.fillStyle = "#27272a";
      ctx.fillRect(0, GROUND_Y, W, 2);

      // Pontilhado do chão estilo Chrome Dino
      ctx.fillStyle = "#3f3f46";
      for (let x = -groundX; x < W; x += 16) {
        ctx.fillRect(x, GROUND_Y + 4, 8, 1);
      }

      if (!isDead) {
        // Física do pulo
        dino.vy += GRAVITY;
        dino.y += dino.vy;

        if (dino.y >= GROUND_Y - dino.h) {
          dino.y = GROUND_Y - dino.h;
          dino.vy = 0;
          dino.isGrounded = true;
        }

        // Spawn de cactos
        obstacleTimer--;
        if (obstacleTimer <= 0) {
          const isDouble = Math.random() > 0.6;
          obstacles.push({
            x: W + 10,
            y: GROUND_Y - (isDouble ? 28 : 24),
            w: isDouble ? 22 : 12,
            h: isDouble ? 28 : 24,
          });
          obstacleTimer = Math.floor(Math.random() * 40 + 45);
        }
      }

      // Desenhar e mover Cactos
      ctx.fillStyle = "#00d1ff";
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        if (!isDead) obs.x -= speed;

        // Cacto pixel art minimalista
        ctx.fillRect(obs.x + 3, obs.y, obs.w - 6, obs.h);
        ctx.fillRect(obs.x, obs.y + 6, obs.w, 8);

        // Colisão AABB com margem
        if (
          dino.x + 4 < obs.x + obs.w - 4 &&
          dino.x + dino.w - 4 > obs.x + 4 &&
          dino.y + 4 < obs.y + obs.h - 4 &&
          dino.y + dino.h - 4 > obs.y + 4
        ) {
          isDead = true;
        }

        if (obs.x < -30) {
          obstacles.splice(i, 1);
        }
      }

      // Desenhar Dinossauro (Pixel Art Ciano/Verde)
      ctx.fillStyle = "#00e6a5";

      // Cabeça & Focinho
      ctx.fillRect(dino.x + 10, dino.y, 16, 12);
      ctx.fillStyle = "#09090b";
      ctx.fillRect(dino.x + 18, dino.y + 2, 3, 3); // Olho
      ctx.fillStyle = "#00e6a5";

      // Corpo & Cauda
      ctx.fillRect(dino.x + 4, dino.y + 10, 14, 12);
      ctx.fillRect(dino.x, dino.y + 12, 5, 5);
      ctx.fillRect(dino.x + 15, dino.y + 14, 4, 3); // Braço

      // Pernas animadas
      if (dino.isGrounded && !isDead) {
        const step = Math.floor(frameCount / 4) % 2;
        if (step === 0) {
          ctx.fillRect(dino.x + 6, dino.y + 22, 4, 10);
          ctx.fillRect(dino.x + 13, dino.y + 22, 4, 5);
        } else {
          ctx.fillRect(dino.x + 6, dino.y + 22, 4, 5);
          ctx.fillRect(dino.x + 13, dino.y + 22, 4, 10);
        }
      } else {
        ctx.fillRect(dino.x + 6, dino.y + 22, 4, 8);
        ctx.fillRect(dino.x + 13, dino.y + 22, 4, 5);
      }

      // Game Over simples
      if (isDead) {
        ctx.fillStyle = "rgba(9, 9, 11, 0.7)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#a1a1aa";
        ctx.font = "12px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText("CLIQUE OU ESPAÇO PARA REINICIAR", W / 2, H / 2);
      }

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("keydown", onKeyDown);
      canvas.removeEventListener("mousedown", onTap);
      canvas.removeEventListener("touchstart", onTap);
    };
  }, []);

  if (isDismissed) return null;

  return (
    <div
      className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#09090b] text-zinc-200 select-none transition-opacity duration-500 ${
        isDismissed ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Container Minimalista Central */}
      <div className="w-full max-w-[640px] px-6 flex flex-col items-center gap-5">
        
        {/* Canvas do Jogo do Dinossauro */}
        <div className="w-full bg-[#09090b] rounded-2xl border border-zinc-800 p-2 overflow-hidden shadow-2xl cursor-pointer">
          <canvas
            ref={canvasRef}
            width={600}
            height={140}
            className="w-full h-[120px] sm:h-[140px] block"
          />
        </div>

        {/* Barra de Progresso e Porcentagem Estritamente Limpa */}
        <div className="w-full flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs font-mono tracking-widest text-zinc-400">
            <span>CARREGANDO...</span>
            <span className="text-cyan-400 font-bold">{loadProgress}%</span>
          </div>

          <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
            <div
              className="h-full bg-cyan-400 rounded-full transition-all duration-200 shadow-[0_0_10px_rgba(0,209,255,0.6)]"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
