import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Hero24GlobeHands() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 320);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 2. Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const radius = 95;

    // Create Dotted Sphere (Particles)
    const particleCount = 2400;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorCyan = new THREE.Color("#00d1ff");
    const colorTeal = new THREE.Color("#00e6a5");
    const colorDim = new THREE.Color("#1e293b");

    for (let i = 0; i < particleCount; i++) {
      // Fibonacci sphere distribution
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color variation
      const isHub = Math.random() > 0.82;
      const c = isHub ? (Math.random() > 0.5 ? colorCyan : colorTeal) : colorDim;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const pointSphere = new THREE.Points(geometry, material);
    globeGroup.add(pointSphere);

    // Glowing Inner Sphere Core
    const coreGeo = new THREE.SphereGeometry(radius * 0.94, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x030712,
      transparent: true,
      opacity: 0.92,
    });
    const coreSphere = new THREE.Mesh(coreGeo, coreMat);
    globeGroup.add(coreSphere);

    // Outer Atmosphere Glow Ring
    const atmosphereGeo = new THREE.RingGeometry(radius * 0.98, radius * 1.25, 64);
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: 0x00d1ff,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    atmosphere.rotation.x = Math.PI / 6;
    globeGroup.add(atmosphere);

    // Orbital Arc Connecting Lines
    const createArc = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const p1 = new THREE.Vector3(
        radius * Math.cos(lon1) * Math.sin(lat1),
        radius * Math.sin(lon1) * Math.sin(lat1),
        radius * Math.cos(lat1)
      );
      const p2 = new THREE.Vector3(
        radius * Math.cos(lon2) * Math.sin(lat2),
        radius * Math.sin(lon2) * Math.sin(lat2),
        radius * Math.cos(lat2)
      );

      const mid = p1.clone().add(p2).multiplyScalar(0.5);
      mid.normalize().multiplyScalar(radius * 1.35);

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const points = curve.getPoints(30);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const arcMat = new THREE.LineBasicMaterial({
        color: 0x00d1ff,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
      });
      return new THREE.Line(arcGeo, arcMat);
    };

    // Add connecting business routes
    globeGroup.add(createArc(1.2, 0.4, 0.6, 2.1));
    globeGroup.add(createArc(0.8, -1.2, 1.4, 0.5));
    globeGroup.add(createArc(-0.5, 1.8, 0.9, -0.4));
    globeGroup.add(createArc(0.2, 2.8, -0.8, 1.1));

    // Interaction & Animation Loop
    let animationFrameId: number;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        globeGroup.rotation.y += deltaX * 0.006;
        globeGroup.rotation.x += deltaY * 0.006;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isDragging) {
        globeGroup.rotation.y += 0.0025;
        globeGroup.rotation.x = Math.sin(Date.now() * 0.0008) * 0.08;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 500;
      const h = container.clientHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[520px] md:h-[580px] lg:h-[620px] flex items-center justify-center select-none overflow-visible group">
      
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#00d1ff]/15 via-[#00e6a5]/08 to-transparent rounded-full blur-[110px] pointer-events-none transform scale-90" />

      {/* 1. MÃO ESQUERDA (Slide in from Left) */}
      <div 
        className="absolute left-0 top-1/2 -translate-y-1/2 w-48 sm:w-60 md:w-72 lg:w-80 pointer-events-none z-20 transition-transform duration-700"
        style={{
          animation: "hand-slide-in-left 900ms cubic-bezier(0.16, 1, 0.3, 1) both"
        }}
      >
        <svg viewBox="0 0 340 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-[0_15px_30px_rgba(0,209,255,0.25)]">
          <defs>
            <linearGradient id="cyberArmLeft" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#09090b" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#1e293b" />
              <stop offset="90%" stopColor="#00d1ff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00e6a5" />
            </linearGradient>
            <filter id="glowLeft">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {/* Forearm & Wrist */}
          <path d="M-20 70 L90 75 L160 85 L220 88 L250 82" stroke="url(#cyberArmLeft)" strokeWidth="8" strokeLinecap="round" />
          <path d="M-20 100 L80 102 L150 108 L210 105 L245 98" stroke="url(#cyberArmLeft)" strokeWidth="6" strokeLinecap="round" />
          {/* Cyber Palm Shell */}
          <polygon points="210,75 265,68 285,92 245,115 195,100" fill="#0f172a" stroke="#00d1ff" strokeWidth="1.5" />
          {/* Fingers Reaching Globe */}
          {/* Thumb */}
          <path d="M240 70 L260 55 L285 52" stroke="#00d1ff" strokeWidth="3.5" strokeLinecap="round" filter="url(#glowLeft)" />
          {/* Index Finger */}
          <path d="M265 72 L298 68 L328 72" stroke="#00e6a5" strokeWidth="3" strokeLinecap="round" filter="url(#glowLeft)" />
          {/* Middle Finger */}
          <path d="M268 82 L308 82 L338 88" stroke="#00d1ff" strokeWidth="3.5" strokeLinecap="round" filter="url(#glowLeft)" />
          {/* Ring Finger */}
          <path d="M260 92 L295 98 L325 106" stroke="#00d1ff" strokeWidth="3" strokeLinecap="round" />
          {/* Pinky */}
          <path d="M248 102 L278 112 L305 122" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
          {/* Cyber Circuit Accents */}
          <circle cx="245" cy="85" r="4" fill="#00e6a5" />
          <circle cx="285" cy="52" r="2.5" fill="#00d1ff" />
          <circle cx="328" cy="72" r="2.5" fill="#00e6a5" />
          <circle cx="338" cy="88" r="2.5" fill="#00d1ff" />
        </svg>
      </div>

      {/* 2. 3D GLOBE CANVAS IN CENTER */}
      <div 
        ref={containerRef} 
        className="w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] lg:w-[480px] lg:h-[480px] relative z-10 cursor-grab active:cursor-grabbing flex items-center justify-center"
      />

      {/* 3. MÃO DIREITA (Slide in from Right) */}
      <div 
        className="absolute right-0 top-1/2 -translate-y-1/2 w-48 sm:w-60 md:w-72 lg:w-80 pointer-events-none z-20 transition-transform duration-700"
        style={{
          animation: "hand-slide-in-right 900ms cubic-bezier(0.16, 1, 0.3, 1) both"
        }}
      >
        <svg viewBox="0 0 340 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-[0_15px_30px_rgba(0,230,165,0.25)]">
          <defs>
            <linearGradient id="cyberArmRight" x1="100%" y1="50%" x2="0%" y2="50%">
              <stop offset="0%" stopColor="#09090b" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#1e293b" />
              <stop offset="90%" stopColor="#00e6a5" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00d1ff" />
            </linearGradient>
            <filter id="glowRight">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {/* Forearm & Wrist */}
          <path d="M360 70 L250 75 L180 85 L120 88 L90 82" stroke="url(#cyberArmRight)" strokeWidth="8" strokeLinecap="round" />
          <path d="M360 100 L260 102 L190 108 L130 105 L95 98" stroke="url(#cyberArmRight)" strokeWidth="6" strokeLinecap="round" />
          {/* Cyber Palm Shell */}
          <polygon points="130,75 75,68 55,92 95,115 145,100" fill="#0f172a" stroke="#00e6a5" strokeWidth="1.5" />
          {/* Fingers Reaching Globe */}
          {/* Thumb */}
          <path d="M100 70 L80 55 L55 52" stroke="#00e6a5" strokeWidth="3.5" strokeLinecap="round" filter="url(#glowRight)" />
          {/* Index Finger */}
          <path d="M75 72 L42 68 L12 72" stroke="#00d1ff" strokeWidth="3" strokeLinecap="round" filter="url(#glowRight)" />
          {/* Middle Finger */}
          <path d="M72 82 L32 82 L2 88" stroke="#00e6a5" strokeWidth="3.5" strokeLinecap="round" filter="url(#glowRight)" />
          {/* Ring Finger */}
          <path d="M80 92 L45 98 L15 106" stroke="#00e6a5" strokeWidth="3" strokeLinecap="round" />
          {/* Pinky */}
          <path d="M92 102 L62 112 L35 122" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
          {/* Cyber Circuit Accents */}
          <circle cx="95" cy="85" r="4" fill="#00d1ff" />
          <circle cx="55" cy="52" r="2.5" fill="#00e6a5" />
          <circle cx="12" cy="72" r="2.5" fill="#00d1ff" />
          <circle cx="2" cy="88" r="2.5" fill="#00e6a5" />
        </svg>
      </div>

      {/* 4. FLOATING GLASS CARDS (Hero-24 Style) */}
      {/* Top Floating Glass Card */}
      <div 
        className="absolute top-4 sm:top-8 right-2 sm:right-6 z-30 p-[1px] rounded-2xl bg-gradient-to-br from-cyan-500/40 via-cyan-900/20 to-transparent shadow-[0_15px_35px_rgba(0,209,255,0.2)] backdrop-blur-xl transition-transform duration-500 hover:scale-105"
        style={{ animation: "hero-reveal 600ms cubic-bezier(0.215, 0.61, 0.355, 1) both" }}
      >
        <div className="px-4 py-3 bg-zinc-950/70 rounded-2xl flex items-center gap-3 border border-cyan-500/20">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <div className="flex flex-col">
            <span className="text-[11px] font-mono text-zinc-200 font-semibold tracking-wider">REDE GLOBAL ATIVA</span>
            <span className="text-[10px] font-mono text-cyan-400 font-light tracking-widest">99.99% DISPONIBILIDADE</span>
          </div>
        </div>
      </div>

      {/* Bottom Floating Glass Card */}
      <div 
        className="absolute bottom-4 sm:bottom-8 left-2 sm:left-6 z-30 p-[1px] rounded-2xl bg-gradient-to-br from-[#00e6a5]/40 via-cyan-900/20 to-transparent shadow-[0_15px_35px_rgba(0,230,165,0.2)] backdrop-blur-xl transition-transform duration-500 hover:scale-105"
        style={{ animation: "hero-reveal 800ms cubic-bezier(0.215, 0.61, 0.355, 1) both" }}
      >
        <div className="px-4 py-3 bg-zinc-950/70 rounded-2xl flex items-center gap-3 border border-[#00e6a5]/20">
          <span className="text-cyan-400 text-xs font-mono">⚡</span>
          <div className="flex flex-col">
            <span className="text-[11px] font-mono text-zinc-200 font-semibold tracking-wider">LATÊNCIA &lt; 18ms</span>
            <span className="text-[10px] font-mono text-emerald-400 font-light tracking-widest">LATAM • EUA • EUROPA</span>
          </div>
        </div>
      </div>

    </div>
  );
}
