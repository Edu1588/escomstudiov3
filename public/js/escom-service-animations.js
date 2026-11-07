/**
 * ESCOM STUDIO — 3D Isometric Cyan Blueprint Animations for "O que fazemos" (Services 01–06)
 * Matches the exact #00E5FF on #0c0b10 3D CAD/Wireframe aesthetic of the reference.
 */
(function () {
  const BG_COLOR = '#0c0b10';
  const CYAN = '#00E5FF';
  const CYAN_MID = 'rgba(0, 229, 255, 0.55)';
  const CYAN_DIM = 'rgba(0, 229, 255, 0.18)';
  const CYAN_FILL_LIGHT = 'rgba(0, 229, 255, 0.82)';
  const CYAN_FILL_MED = 'rgba(0, 185, 215, 0.72)';
  const CYAN_FILL_DARK = 'rgba(0, 125, 155, 0.55)';

  // Isometric 3D projection helper
  function createProjector(cx, cy, scale, rotY, tiltX) {
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const cosX = Math.cos(tiltX);
    const sinX = Math.sin(tiltX);

    return function project(x, y, z) {
      // Rotate around Y axis
      const rx = x * cosY - z * sinY;
      const rz = x * sinY + z * cosY;
      // Rotate around X axis (isometric tilt)
      const ry = y * cosX - rz * sinX;
      const rz2 = y * sinX + rz * cosX;
      return {
        x: cx + rx * scale,
        y: cy - ry * scale,
        z: rz2
      };
    };
  }

  // Draw a 3D line between two 3D points
  function drawLine3D(ctx, p, x1, y1, z1, x2, y2, z2, color = CYAN, width = 1.2) {
    const a = p(x1, y1, z1);
    const b = p(x2, y2, z2);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  }

  // Draw a filled 3D quad with wireframe outline
  function drawQuad3D(ctx, p, pts, fillStyle, strokeStyle = CYAN, lineWidth = 1.2) {
    const proj = pts.map(pt => p(pt[0], pt[1], pt[2]));
    ctx.beginPath();
    ctx.moveTo(proj[0].x, proj[0].y);
    for (let i = 1; i < proj.length; i++) {
      ctx.lineTo(proj[i].x, proj[i].y);
    }
    ctx.closePath();
    if (fillStyle) {
      ctx.fillStyle = fillStyle;
      ctx.fill();
    }
    if (strokeStyle) {
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
  }

  // Draw a 3D wireframe box with vertical CAD studs (Enerblock signature style)
  function drawStuddedWall3D(ctx, p, x1, y1, z1, x2, y2, z2, height, studs = 8, progress = 1, solidFace = false) {
    const curH = height * Math.max(0, Math.min(1, progress));
    if (curH <= 0.01) return;

    const topY1 = y1 + curH;
    const topY2 = y2 + curH;

    if (solidFace) {
      drawQuad3D(
        ctx,
        p,
        [
          [x1, y1, z1],
          [x2, y2, z2],
          [x2, topY2, z2],
          [x1, topY1, z1]
        ],
        CYAN_FILL_MED,
        CYAN,
        1.4
      );
    } else {
      // Bottom & top rails
      drawLine3D(ctx, p, x1, y1, z1, x2, y2, z2, CYAN, 1.5);
      drawLine3D(ctx, p, x1, topY1, z1, x2, topY2, z2, CYAN, 1.5);
      // Vertical studs
      for (let i = 0; i <= studs; i++) {
        const t = i / studs;
        const sx = x1 + (x2 - x1) * t;
        const sy = y1 + (y2 - y1) * t;
        const sz = z1 + (z2 - z1) * t;
        drawLine3D(ctx, p, sx, sy, sz, sx, sy + curH, sz, CYAN, i === 0 || i === studs ? 1.5 : 1.0);
      }
    }
  }

  // Draw a 3D Isometric Box (solid or wireframe)
  function drawBox3D(ctx, p, cx, y0, cz, w, h, d, solid = false, studCount = 0) {
    const hw = w / 2;
    const hd = d / 2;
    const x0 = cx - hw, x1 = cx + hw;
    const z0 = cz - hd, z1 = cz + hd;
    const y1 = y0 + h;

    if (solid) {
      // Back faces
      drawQuad3D(ctx, p, [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], CYAN_FILL_DARK, CYAN, 1);
      drawQuad3D(ctx, p, [[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], CYAN_FILL_DARK, CYAN, 1);
      // Front faces
      drawQuad3D(ctx, p, [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], CYAN_FILL_MED, CYAN, 1.3);
      drawQuad3D(ctx, p, [[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]], CYAN_FILL_DARK, CYAN, 1.3);
      // Top face
      drawQuad3D(ctx, p, [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], CYAN_FILL_LIGHT, CYAN, 1.4);
    } else {
      // Bottom rect
      drawQuad3D(ctx, p, [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], 'rgba(0, 229, 255, 0.05)', CYAN_MID, 1);
      // Pillars
      drawLine3D(ctx, p, x0, y0, z0, x0, y1, z0, CYAN, 1.2);
      drawLine3D(ctx, p, x1, y0, z0, x1, y1, z0, CYAN, 1.2);
      drawLine3D(ctx, p, x1, y0, z1, x1, y1, z1, CYAN, 1.2);
      drawLine3D(ctx, p, x0, y0, z1, x0, y1, z1, CYAN, 1.2);
      // Studs if requested
      if (studCount > 0) {
        drawStuddedWall3D(ctx, p, x0, y0, z1, x1, y0, z1, h, studCount, 1, false);
        drawStuddedWall3D(ctx, p, x1, y0, z0, x1, y0, z1, h, studCount, 1, false);
      }
      // Top rect
      drawQuad3D(ctx, p, [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], 'rgba(0, 229, 255, 0.12)', CYAN, 1.4);
    }
  }

  // Draw subtle isometric floor grid
  function drawFloorGrid(ctx, p, size = 2.2, divisions = 8, y = -0.8) {
    for (let i = 0; i <= divisions; i++) {
      const t = -size + (size * 2 * i) / divisions;
      drawLine3D(ctx, p, t, y, -size, t, y, size, CYAN_DIM, 0.7);
      drawLine3D(ctx, p, -size, y, t, size, y, t, CYAN_DIM, 0.7);
    }
  }

  // ============================================================================
  // SCENE 01: SITES & EXPERIÊNCIAS DIGITAIS (3D Isometric Web Platform + Lighthouse 100%)
  // ============================================================================
  function renderService01(ctx, w, h, t, mouseX, mouseY) {
    const rotY = -0.68 + Math.sin(t * 0.6) * 0.12 + mouseX * 0.25;
    const tiltX = 0.52 + mouseY * 0.12;
    const scale = Math.min(w, h) * 0.23;
    const p = createProjector(w * 0.5, h * 0.50, scale, rotY, tiltX);

    drawFloorGrid(ctx, p, 2.0, 8, -0.75);

    // Cycle assembly progression
    const cycle = (t * 0.35) % 1;
    const ease = pVal => Math.max(0, Math.min(1, pVal));

    // 1. Base Server/DOM Foundation Slab (Solid Cyan Perimeter + Studded Interior)
    drawBox3D(ctx, p, 0, -0.75, 0, 2.8, 0.18, 2.0, true, 0);

    // 2. Structural UI Wireframe Walls (like Enerblock's studded blueprint!)
    const wallProg = ease(( Math.sin(t * 0.9) + 1.2 ) / 1.8);
    // Outer frame walls (solid cyan with window cutouts)
    drawStuddedWall3D(ctx, p, -1.4, -0.57, -1.0, 1.4, -0.57, -1.0, 0.65, 12, 1, true);
    drawStuddedWall3D(ctx, p, -1.4, -0.57, -1.0, -1.4, -0.57, 1.0, 0.65, 8, 1, true);
    // Inner UI layout gridpartitions (wireframe studs!)
    drawStuddedWall3D(ctx, p, -1.4, -0.57, 1.0, 1.4, -0.57, 1.0, 0.65, 14, 1, false);
    drawStuddedWall3D(ctx, p, 1.4, -0.57, -1.0, 1.4, -0.57, 1.0, 0.65, 10, 1, false);
    // Internal modular component partitions (Hero, 3-col features, CTA)
    drawStuddedWall3D(ctx, p, -1.4, -0.57, -0.2, 1.4, -0.57, -0.2, 0.58, 12, wallProg, false);
    drawStuddedWall3D(ctx, p, -0.45, -0.57, -1.0, -0.45, -0.57, 1.0, 0.58, 9, wallProg, false);
    drawStuddedWall3D(ctx, p, 0.45, -0.57, -1.0, 0.45, -0.57, 1.0, 0.58, 9, wallProg, false);

    // 3. Floating Interactive UI Layer above the structure
    const floatY = 0.35 + Math.sin(t * 1.8) * 0.08;
    // Hero banner floating plane
    drawQuad3D(
      ctx,
      p,
      [[-1.3, floatY, -0.9], [1.3, floatY, -0.9], [1.3, floatY, -0.25], [-1.3, floatY, -0.25]],
      'rgba(0, 229, 255, 0.22)',
      CYAN,
      1.5
    );
    // 3 Floating Feature Cards
    [-0.88, 0, 0.88].forEach((cx, idx) => {
      const cardY = floatY + 0.08 * Math.sin(t * 2.2 + idx);
      drawBox3D(ctx, p, cx, cardY, 0.35, 0.72, 0.14, 0.9, idx === 1, 4);
    });

    // 4. Vertical Laser Scanline (Lighthouse Audit Beam)
    const scanZ = -1.0 + ((t * 0.65) % 1) * 2.0;
    drawQuad3D(
      ctx,
      p,
      [[-1.45, -0.57, scanZ], [1.45, -0.57, scanZ], [1.45, 0.65, scanZ], [-1.45, 0.65, scanZ]],
      'rgba(0, 229, 255, 0.16)',
      CYAN,
      1.6
    );
  }

  // ============================================================================
  // SCENE 02: BRANDING & IDENTIDADE DE MARCA (3D ESCOM Monolith + Golden Ratio CAD)
  // ============================================================================
  function renderService02(ctx, w, h, t, mouseX, mouseY) {
    const rotY = -0.55 + Math.sin(t * 0.55) * 0.18 + mouseX * 0.3;
    const tiltX = 0.48 + mouseY * 0.15;
    const scale = Math.min(w, h) * 0.24;
    const p = createProjector(w * 0.5, h * 0.50, scale, rotY, tiltX);

    drawFloorGrid(ctx, p, 2.0, 8, -0.8);

    // 1. Golden Ratio CAD Construction Cage (Wireframe Cube)
    drawBox3D(ctx, p, 0, -0.8, 0, 2.4, 1.6, 1.6, false, 0);

    // 2. 3D Extruded ESCOM "E" Monolith (3 parallel geometric bars in 3D space)
    const barDepth = 0.45;
    const bars = [
      { y: 0.35, x0: -0.75, x1: 0.85, solid: true },
      { y: -0.08, x0: -0.95, x1: 0.95, solid: false },
      { y: -0.52, x0: -0.85, x1: 0.75, solid: true }
    ];

    bars.forEach((b, idx) => {
      const shiftX = Math.sin(t * 1.4 + idx * 1.1) * 0.08;
      const bw = b.x1 - b.x0;
      const cx = (b.x0 + b.x1) / 2 + shiftX;
      drawBox3D(ctx, p, cx, b.y, 0, bw, 0.24, barDepth, b.solid, 10);
      // Diagonal bevel connectors (signature ESCOM E geometry)
      drawLine3D(ctx, p, cx - bw / 2, b.y, barDepth / 2, cx + bw / 2, b.y + 0.24, barDepth / 2, CYAN, 1.4);
    });

    // 3. Orbiting Golden Ratio (Phi = 1.618) Construction Rings in 3D
    const segs = 36;
    const radius = 1.35;
    ctx.beginPath();
    for (let i = 0; i <= segs; i++) {
      const ang = (i / segs) * Math.PI * 2;
      const gx = Math.cos(ang) * radius;
      const gy = Math.sin(ang) * radius * 0.65;
      const pt = p(gx, gy, 0.55);
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    }
    ctx.strokeStyle = CYAN_MID;
    ctx.lineWidth = 1.1;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // ============================================================================
  // SCENE 03: AUTOMAÇÃO E SISTEMAS INTELIGENTES (3D 24/7 Pipeline CRM + WhatsApp + ERP)
  // ============================================================================
  function renderService03(ctx, w, h, t, mouseX, mouseY) {
    const rotY = -0.65 + Math.sin(t * 0.45) * 0.1 + mouseX * 0.25;
    const tiltX = 0.54 + mouseY * 0.12;
    const scale = Math.min(w, h) * 0.23;
    const p = createProjector(w * 0.5, h * 0.50, scale, rotY, tiltX);

    drawFloorGrid(ctx, p, 2.1, 8, -0.75);

    // 4 Isometric Automation Nodes (WhatsApp -> IA Triagem -> CRM -> ERP)
    const nodes = [
      { x: -1.1, z: -0.7, h: 0.55, solid: true, studs: 6 },
      { x: 0.9, z: -0.7, h: 0.85, solid: false, studs: 8 },
      { x: -0.9, z: 0.7, h: 0.75, solid: false, studs: 8 },
      { x: 1.1, z: 0.7, h: 1.05, solid: true, studs: 6 }
    ];

    // Draw 3D Conduits connecting the nodes
    const paths = [
      [nodes[0], nodes[1]],
      [nodes[1], nodes[2]],
      [nodes[2], nodes[3]],
      [nodes[0], nodes[2]]
    ];

    paths.forEach(([n1, n2], idx) => {
      const y = -0.45;
      drawLine3D(ctx, p, n1.x, y, n1.z, n2.x, y, n2.z, CYAN, 1.8);
      drawLine3D(ctx, p, n1.x, y + 0.12, n1.z, n2.x, y + 0.12, n2.z, CYAN_MID, 1.0);

      // Animated data packet cube traveling along the conduit
      const prog = ((t * 0.55 + idx * 0.25) % 1);
      const px = n1.x + (n2.x - n1.x) * prog;
      const pz = n1.z + (n2.z - n1.z) * prog;
      drawBox3D(ctx, p, px, y - 0.04, pz, 0.22, 0.22, 0.22, true, 0);
    });

    // Draw the 4 Node Towers with studded wireframe walls
    nodes.forEach((n, idx) => {
      const pulseH = n.h + Math.sin(t * 2 + idx) * 0.05;
      drawBox3D(ctx, p, n.x, -0.75, n.z, 0.78, pulseH, 0.78, n.solid, n.studs);
    });
  }

  // ============================================================================
  // SCENE 04: CRIAÇÕES COM INTELIGÊNCIA ARTIFICIAL (3D Neural Cortex & Decision Core)
  // ============================================================================
  function renderService04(ctx, w, h, t, mouseX, mouseY) {
    const rotY = t * 0.35 + mouseX * 0.4;
    const tiltX = 0.45 + mouseY * 0.15;
    const scale = Math.min(w, h) * 0.24;
    const p = createProjector(w * 0.5, h * 0.48, scale, rotY, tiltX);

    drawFloorGrid(ctx, p, 2.0, 8, -0.85);

    // 1. Central Solid Cyan AI Core Monolith
    drawBox3D(ctx, p, 0, -0.35, 0, 0.75, 0.75, 0.75, true, 0);

    // 2. Outer Wireframe Studded Containment Cage
    drawBox3D(ctx, p, 0, -0.65, 0, 1.65, 1.35, 1.65, false, 6);

    // 3. Orbiting 3D Neural Satellites & Synaptic Beams
    const satCount = 8;
    for (let i = 0; i < satCount; i++) {
      const ang = (i / satCount) * Math.PI * 2 + t * 0.4;
      const rx = Math.cos(ang) * 1.45;
      const rz = Math.sin(ang) * 1.45;
      const ry = Math.sin(t * 1.5 + i * 0.9) * 0.45;

      // Synaptic beam to core
      drawLine3D(ctx, p, 0, 0, 0, rx, ry, rz, CYAN, 1.3);
      // Satellite node cube
      drawBox3D(ctx, p, rx, ry - 0.1, rz, 0.24, 0.24, 0.24, i % 2 === 0, 0);
    }
  }

  // ============================================================================
  // SCENE 05: TRÁFEGO PAGO E AQUISIÇÃO (3D Isometric Conversion Funnel & ROAS Tower)
  // ============================================================================
  function renderService05(ctx, w, h, t, mouseX, mouseY) {
    const rotY = -0.62 + Math.sin(t * 0.5) * 0.12 + mouseX * 0.25;
    const tiltX = 0.52 + mouseY * 0.12;
    const scale = Math.min(w, h) * 0.23;
    const p = createProjector(w * 0.5, h * 0.50, scale, rotY, tiltX);

    drawFloorGrid(ctx, p, 2.0, 8, -0.8);

    // 4 Concentric Isometric Funnel Tiers (Top wide -> Bottom concentrated high-ROAS core)
    const tiers = [
      { y: 0.45, size: 2.3, h: 0.22, solid: false, studs: 10 },
      { y: 0.08, size: 1.75, h: 0.22, solid: false, studs: 8 },
      { y: -0.28, size: 1.25, h: 0.22, solid: true, studs: 6 },
      { y: -0.75, size: 0.78, h: 0.35, solid: true, studs: 4 }
    ];

    tiers.forEach((tr, idx) => {
      const yOff = Math.sin(t * 1.8 - idx * 0.6) * 0.03;
      drawBox3D(ctx, p, 0, tr.y + yOff, 0, tr.size, tr.h, tr.size, tr.solid, tr.studs);
    });

    // Vertical conversion laser axis through the center of the funnel
    drawLine3D(ctx, p, 0, 0.95, 0, 0, -0.8, 0, CYAN, 2.2);

    // Descending lead particles converging into the funnel
    for (let i = 0; i < 6; i++) {
      const prog = ((t * 0.45 + i / 6) % 1);
      const spread = (1 - prog) * 1.05;
      const ang = i * ((Math.PI * 2) / 6) + t;
      const lx = Math.cos(ang) * spread;
      const lz = Math.sin(ang) * spread;
      const ly = 0.85 - prog * 1.55;
      drawBox3D(ctx, p, lx, ly, lz, 0.16, 0.16, 0.16, true, 0);
    }
  }

  // ============================================================================
  // SCENE 06: ESTRATÉGIA DIGITAL E CRESCIMENTO (5-Stage Ascending 3D Blueprint Matrix)
  // ============================================================================
  function renderService06(ctx, w, h, t, mouseX, mouseY) {
    const rotY = -0.68 + Math.sin(t * 0.45) * 0.12 + mouseX * 0.25;
    const tiltX = 0.50 + mouseY * 0.12;
    const scale = Math.min(w, h) * 0.23;
    const p = createProjector(w * 0.5, h * 0.54, scale, rotY, tiltX);

    drawFloorGrid(ctx, p, 2.1, 8, -0.75);

    // 5 Ascending 3D Architectural Towers (01 Percebido -> 05 Lembrado)
    const stages = [
      { x: -1.25, z: 0.4, h: 0.42, solid: false },
      { x: -0.62, z: 0.2, h: 0.68, solid: true },
      { x: 0.0,   z: 0.0, h: 0.96, solid: false },
      { x: 0.62,  z: -0.2, h: 1.28, solid: true },
      { x: 1.25,  z: -0.4, h: 1.62, solid: true }
    ];

    stages.forEach((st, idx) => {
      const animH = st.h * (0.88 + 0.12 * Math.sin(t * 1.6 + idx * 0.5));
      drawBox3D(ctx, p, st.x, -0.75, st.z, 0.46, animH, 0.68, st.solid, 6);

      // Connect tops with ascending growth trajectory line
      if (idx > 0) {
        const prev = stages[idx - 1];
        const prevH = prev.h * (0.88 + 0.12 * Math.sin(t * 1.6 + (idx - 1) * 0.5));
        drawLine3D(
          ctx,
          p,
          prev.x,
          -0.75 + prevH + 0.12,
          prev.z,
          st.x,
          -0.75 + animH + 0.12,
          st.z,
          CYAN,
          2.2
        );
      }
    });
  }

  const RENDERERS = {
    '01': renderService01,
    '02': renderService02,
    '03': renderService03,
    '04': renderService04,
    '05': renderService05,
    '06': renderService06
  };

  function initServiceAnimations() {
    const containers = document.querySelectorAll('.escom-service-blueprint');
    if (!containers.length) return;

    const instances = [];

    containers.forEach((container) => {
      if (container.dataset.initialized === 'true') return;
      container.dataset.initialized = 'true';

      const serviceId = container.dataset.service || '01';
      const canvas = container.querySelector('canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;
      let isVisible = true;

      container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      });
      container.addEventListener('mouseleave', () => {
        targetX = 0;
        targetY = 0;
      });

      const resize = () => {
        const rect = container.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.max(300, rect.width) * dpr;
        canvas.height = Math.max(360, rect.height) * dpr;
      };
      resize();
      window.addEventListener('resize', resize);

      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isVisible = entry.isIntersecting;
        });
      }, { threshold: 0.02 });
      io.observe(container);

      instances.push({
        serviceId,
        canvas,
        ctx,
        getVisible: () => isVisible,
        stepMouse: () => {
          mouseX += (targetX - mouseX) * 0.08;
          mouseY += (targetY - mouseY) * 0.08;
          return { mouseX, mouseY };
        }
      });
    });

    const startTime = performance.now();
    function animate(now) {
      const t = (now - startTime) * 0.001;
      for (const inst of instances) {
        if (!inst.getVisible()) continue;
        const { canvas, ctx, serviceId } = inst;
        const w = canvas.width;
        const h = canvas.height;

        ctx.fillStyle = BG_COLOR;
        ctx.fillRect(0, 0, w, h);

        const { mouseX, mouseY } = inst.stepMouse();
        const fn = RENDERERS[serviceId] || renderService01;
        fn(ctx, w, h, t, mouseX, mouseY);
      }
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initServiceAnimations);
  } else {
    initServiceAnimations();
  }
})();
