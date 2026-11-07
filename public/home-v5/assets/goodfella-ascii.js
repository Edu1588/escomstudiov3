/**
 * Good Fella — Hero ASCII Canvas Renderer com Animação Completa
 * 1. Parallax tridimensional e rotação reativa ao cursor do mouse
 * 2. Matriz de caracteres com cintilação contínua (shimmer orgânico)
 * 3. Ondas de dispersão ao passar o mouse
 * 4. Carregamento ultra-rápido e responsivo
 */
(function () {
  const container = document.querySelector('.goodfella-ascii-container') || document.querySelector('section canvas')?.parentElement?.parentElement;
  if (!container) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'goodfella-ascii-canvas';
  canvas.style.cssText = 'position:absolute;top:0;right:0;width:100%;height:100%;object-fit:contain;pointer-events:none;z-index:2;transition:transform 0.15s ease-out;';
  container.innerHTML = '';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = '/home-v5/images/ascii_portrait_1.png';

  // Conjunto de caracteres do mapa de densidade ASCII original
  const CHARS = ' .`^",:;Il!i~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';
  const charLen = CHARS.length;

  let mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, normX: 0, normY: 0 };
  let width = 0;
  let height = 0;
  let imgLoaded = false;
  let offCanvas = document.createElement('canvas');
  let offCtx = offCanvas.getContext('2d', { willReadFrequently: true });

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.targetX = e.clientX - rect.left;
    mouse.targetY = e.clientY - rect.top;
    
    // Normalizado de -1 a 1 para o parallax 3D
    mouse.normX = ((e.clientX / window.innerWidth) - 0.5) * 2;
    mouse.normY = ((e.clientY / window.innerHeight) - 0.5) * 2;
  });

  function startAscii() {
    imgLoaded = true;
    resize();
    requestAnimationFrame(render);
  }

  if (img.complete && img.naturalWidth > 0) {
    startAscii();
  } else {
    img.onload = startAscii;
  }

  function resize() {
    const rect = container.getBoundingClientRect();
    width = rect.width || 600;
    height = rect.height || 850;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const cols = Math.floor(width / 7.2);
    const rows = Math.floor(height / 11.5);
    offCanvas.width = cols;
    offCanvas.height = rows;
  }

  window.addEventListener('resize', resize);

  let frame = 0;
  function render() {
    if (!imgLoaded) return;
    frame++;

    // Interpolação suave do mouse
    mouse.x += (mouse.targetX - mouse.x) * 0.08;
    mouse.y += (mouse.targetY - mouse.y) * 0.08;

    // Parallax 3D suave no container do canvas
    canvas.style.transform = `perspective(800px) rotateY(${mouse.normX * 5}deg) rotateX(${-mouse.normY * 4}deg) translateZ(10px)`;

    const w = offCanvas.width;
    const h = offCanvas.height;

    offCtx.clearRect(0, 0, w, h);
    
    const imgAspect = img.width / img.height;
    const canvasAspect = w / h;
    let dw, dh, dx, dy;
    
    if (canvasAspect > imgAspect) {
      dh = h;
      dw = h * imgAspect;
      dx = (w - dw) * 0.75;
      dy = 0;
    } else {
      dw = w;
      dh = w / imgAspect;
      dx = 0;
      dy = (h - dh) * 0.5;
    }

    offCtx.drawImage(img, dx, dy, dw, dh);
    const imgData = offCtx.getImageData(0, 0, w, h);
    const data = imgData.data;

    ctx.clearRect(0, 0, width, height);
    ctx.font = '600 10.5px "Geist Mono", monospace, monospace';
    ctx.textBaseline = 'top';

    const cellW = width / w;
    const cellH = height / h;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        const a = data[idx + 3];
        if (a < 35) continue;

        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        const px = x * cellW;
        const py = y * cellH;
        const dist = Math.hypot(px - mouse.x, py - mouse.y);
        
        // Cintilação orgânica (shimmer) sutil por ruído temporal
        const shimmer = Math.sin(frame * 0.08 + x * 0.4 + y * 0.6) * 0.08;
        let charIndex = Math.floor((brightness + shimmer) * (charLen - 1));

        // Dispersão do cursor
        if (dist < 130) {
          const power = (1 - dist / 130);
          charIndex = Math.min(charLen - 1, Math.floor(charIndex + power * 18 + Math.sin(frame * 0.25 + y) * 4));
        }

        const char = CHARS[Math.max(0, Math.min(charLen - 1, charIndex))];

        // Paleta Good Fella Laranja (#FF4D00 com toques de luz #FF8800)
        const alpha = Math.min(1, (a / 255) * (0.38 + brightness * 0.62));
        const greenTone = Math.floor(70 + brightness * 50 + (dist < 130 ? 40 : 0));
        ctx.fillStyle = `rgba(255, ${greenTone}, 0, ${alpha.toFixed(2)})`;
        ctx.fillText(char, px, py);
      }
    }

    requestAnimationFrame(render);
  }
})();
