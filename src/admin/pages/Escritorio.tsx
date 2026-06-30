import React, { useEffect, useRef, useState } from "react";
import { Monitor, Briefcase, Play, RefreshCw, Volume2, Sparkles, User, Coffee, Cat } from "lucide-react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Character details for the side details card
const TEAM_ROLES = {
  edu: {
    name: "Edu Santos",
    role: "Diretor de Arte & Criação",
    desc: "Lidera a direção criativa estratégica da ESCOM Studio. Alinha pixels, planeja identidades visuais de marca e garante que toda interface transmita o máximo valor comercial.",
    action: "Desenhar Design System",
    statusText: "Criando grade brutalista...",
    color: "#00d1ff"
  },
  ingrid: {
    name: "Ingrid",
    role: "Lead Scraper & Prospect",
    desc: "Responsável pelo motor de prospecção ativa da agência. Desenvolve e gerencia raspadores e robôs inteligentes para capturar, analisar e filtrar leads qualificados na web.",
    action: "Minerar Web",
    statusText: "Capturando novos domínios...",
    color: "#00E3FF"
  },
  oreo: {
    name: "Oreo",
    role: "Suporte & E-mail Automático",
    desc: "Garante a comunicação e agilidade. Gerencia o disparo de e-mails instantâneos e presta o melhor suporte com ronronares integrados ao sistema de CRM.",
    action: "Disparar E-mails",
    statusText: "Enviando propostas...",
    color: "#FF9F00"
  }
};

export default function Escritorio() {
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<any>(null);

  // Referências para persistir posições dos personagens entre reinicializações do useEffect
  const eduStateRef = useRef({
    x: -4.5,
    z: 6.0,
    y: 0,
    targetX: -4.5,
    targetZ: 6.0,
    state: "walking",
    stateTimer: 2.0,
    rotY: 0
  });

  const ingridStateRef = useRef({
    x: 4.5,
    z: 6.0,
    y: 0,
    targetX: 4.5,
    targetZ: 6.0,
    state: "walking",
    stateTimer: 3.5,
    rotY: 0
  });

  const oreoStateRef = useRef({
    x: 0.0,
    z: -3.0,
    y: 0.15,
    targetX: 0.0,
    targetZ: -3.0,
    state: "walking",
    stateTimer: 4.5,
    rotY: 0
  });
  
  // Interactive simulation states
  const [selectedChar, setSelectedChar] = useState<"edu" | "ingrid" | "oreo" | null>("edu");
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [isEmailBurst, setIsEmailBurst] = useState(false);
  const [isScrapingActive, setIsScrapingActive] = useState(false);
  const [isEduFocus, setIsEduFocus] = useState(false);
  
  // UI coordinate states for 3D overlay labels
  const [labels, setLabels] = useState({
    edu: { x: 0, y: 0, visible: false },
    ingrid: { x: 0, y: 0, visible: false },
    oreo: { x: 0, y: 0, visible: false }
  });

  // Action status logs
  const [logs, setLogs] = useState<string[]>([
    "Simulador carregado com sucesso.",
    "Oreo está descansando em cima do teclado.",
    "Ingrid iniciou monitoramento de conexões.",
    "Edu revisou a tipografia do site novo."
  ]);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setLogs(prev => [`[${time}] ${msg}`, ...prev.slice(0, 10)]);
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // --- THREE.JS SETUP ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#030303");
    scene.fog = new THREE.FogExp2("#030303", 0.015);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(16, 12, 16);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.05; // don't go below floor
    controls.minDistance = 5;
    controls.maxDistance = 35;
    controls.target.set(0, 1, 0);
    controlsRef.current = controls;

    // --- LIGHTS ---
    const ambientLight = new THREE.AmbientLight("#ffffff", 0.65);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight("#ffffff", 0.85);
    dirLight.position.set(15, 20, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.bias = -0.001;
    scene.add(dirLight);

    // Local Neon glows for desks
    const eduGlow = new THREE.PointLight("#00d1ff", 1.8, 6);
    eduGlow.position.set(-3, 2, 3);
    scene.add(eduGlow);

    const ingridGlow = new THREE.PointLight("#00E3FF", 1.8, 6);
    ingridGlow.position.set(3, 2, 3);
    scene.add(ingridGlow);

    const oreoGlow = new THREE.PointLight("#FF9F00", 1.8, 6);
    oreoGlow.position.set(0, 2, -4);
    scene.add(oreoGlow);

    // --- ENVIRONMENT ARCHITECTURE ---
    // 1. Tiled Floor (Procedural beige tiles)
    const floorCanvas = document.createElement("canvas");
    floorCanvas.width = 128;
    floorCanvas.height = 128;
    const fCtx = floorCanvas.getContext("2d")!;
    fCtx.fillStyle = "#faf4ee";
    fCtx.fillRect(0, 0, 128, 128);
    fCtx.strokeStyle = "#e5ded7";
    fCtx.lineWidth = 4;
    fCtx.strokeRect(0, 0, 128, 128);
    
    const floorTex = new THREE.CanvasTexture(floorCanvas);
    floorTex.wrapS = THREE.RepeatWrapping;
    floorTex.wrapT = THREE.RepeatWrapping;
    floorTex.repeat.set(12, 10);
    
    const floorGeo = new THREE.PlaneGeometry(24, 20);
    const floorMat = new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.85 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // 2. Corner Walls
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xede6df, roughness: 0.9 });
    
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4, 20), wallMat);
    leftWall.position.set(-12, 2, 0);
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    const topWall = new THREE.Mesh(new THREE.BoxGeometry(24.3, 4, 0.3), wallMat);
    topWall.position.set(0.15, 2, -10);
    topWall.receiveShadow = true;
    scene.add(topWall);

    // Decorative wall painting/frame
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.8, 3.2), new THREE.MeshStandardMaterial({ color: 0x111111 }));
    frame.position.set(-11.8, 2.2, 0);
    
    const artCanvas = document.createElement("canvas");
    artCanvas.width = 256;
    artCanvas.height = 128;
    const aCtx = artCanvas.getContext("2d")!;
    aCtx.fillStyle = "#fafafa";
    aCtx.fillRect(0, 0, 256, 128);
    aCtx.fillStyle = "#00d1ff"; // neon green block
    aCtx.fillRect(30, 20, 80, 80);
    aCtx.fillStyle = "#111111"; // black block
    aCtx.fillRect(130, 40, 90, 60);
    const artTex = new THREE.CanvasTexture(artCanvas);
    
    const painting = new THREE.Mesh(new THREE.PlaneGeometry(3.1, 1.7), new THREE.MeshBasicMaterial({ map: artTex }));
    painting.position.set(-11.77, 2.2, 0);
    painting.rotation.y = Math.PI / 2;
    scene.add(frame);
    scene.add(painting);

    // --- FURNITURE & PROP BUILDERS ---
    // Desk Builder
    const createDesk = (x: number, z: number, rotationY = 0) => {
      const deskGroup = new THREE.Group();
      deskGroup.position.set(x, 0, z);
      deskGroup.rotation.y = rotationY;

      // Tabletop (wood)
      const topGeo = new THREE.BoxGeometry(3.2, 0.1, 1.8);
      const topMat = new THREE.MeshStandardMaterial({ color: 0xcd853f, roughness: 0.7 });
      const top = new THREE.Mesh(topGeo, topMat);
      top.position.y = 1.15;
      top.castShadow = true;
      top.receiveShadow = true;
      deskGroup.add(top);

      // Legs (metal)
      const legGeo = new THREE.BoxGeometry(0.1, 1.1, 0.1);
      const legMat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.5 });
      const positions = [
        [-1.5, 0.55, -0.8],
        [1.5, 0.55, -0.8],
        [-1.5, 0.55, 0.8],
        [1.5, 0.55, 0.8]
      ];
      positions.forEach(pos => {
        const leg = new THREE.Mesh(legGeo, legMat);
        leg.position.set(pos[0], pos[1], pos[2]);
        leg.castShadow = true;
        deskGroup.add(leg);
      });

      // Keyboard
      const kb = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.02, 0.3), new THREE.MeshStandardMaterial({ color: 0xdde2e6 }));
      kb.position.set(0, 1.21, 0.4);
      deskGroup.add(kb);

      return deskGroup;
    };

    // Chair Builder
    const createChair = (x: number, z: number, rotY = 0) => {
      const chair = new THREE.Group();
      chair.position.set(x, 0, z);
      chair.rotation.y = rotY;

      const metalMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.4 });
      const seatMat = new THREE.MeshStandardMaterial({ color: 0x0066cc, roughness: 0.9 }); // blue office chairs

      // Legs/base
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.4, 0.5, 5), metalMat);
      base.position.y = 0.25;
      chair.add(base);

      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.4), metalMat);
      pole.position.y = 0.6;
      chair.add(pole);

      // Seat
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 0.8), seatMat);
      seat.position.y = 0.8;
      seat.castShadow = true;
      chair.add(seat);

      // Backrest
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.1), seatMat);
      back.position.set(0, 1.25, -0.35);
      back.castShadow = true;
      chair.add(back);

      const support = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.6, 0.1), metalMat);
      support.position.set(0, 1.05, -0.3);
      chair.add(support);

      return chair;
    };

    // --- INSTANTIATE DESKS & COMPUTERS ---
    // Desk 1: Edu (Creative director)
    const eduDesk = createDesk(-4.5, 3, 0);
    scene.add(eduDesk);
    scene.add(createChair(-4.5, 4.3, Math.PI));

    // Monitor 1: Creative Art board
    const mon1Group = new THREE.Group();
    mon1Group.position.set(-4.5, 1.2, 2.75);
    const mon1Stand = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.08, 0.4), new THREE.MeshStandardMaterial({ color: 0x222222 }));
    mon1Stand.position.y = 0.2;
    mon1Group.add(mon1Stand);
    const mon1Screen = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.7, 0.05), new THREE.MeshStandardMaterial({ color: 0x151515 }));
    mon1Screen.position.y = 0.5;
    mon1Screen.castShadow = true;
    mon1Group.add(mon1Screen);

    // Glowing screen content for Edu
    const canvasArt = document.createElement("canvas");
    canvasArt.width = 128;
    canvasArt.height = 64;
    const cCtx = canvasArt.getContext("2d")!;
    cCtx.fillStyle = "#111";
    cCtx.fillRect(0, 0, 128, 64);
    cCtx.strokeStyle = "#00d1ff";
    cCtx.lineWidth = 3;
    cCtx.strokeRect(4, 4, 120, 56);
    cCtx.fillStyle = "#fafafa";
    cCtx.font = "bold 11px Courier New";
    cCtx.fillText("ESCOM STUDIO", 15, 24);
    cCtx.fillStyle = "#00d1ff";
    cCtx.fillRect(15, 32, 90, 8);
    cCtx.fillStyle = "#888";
    cCtx.fillRect(15, 44, 50, 4);
    const screen1Tex = new THREE.CanvasTexture(canvasArt);
    const mon1Disp = new THREE.Mesh(new THREE.PlaneGeometry(1.15, 0.65), new THREE.MeshBasicMaterial({ map: screen1Tex }));
    mon1Disp.position.set(0, 0.5, 0.03);
    mon1Group.add(mon1Disp);
    scene.add(mon1Group);

    // Desk 2: Ingrid (Lead Scraper)
    const ingridDesk = createDesk(4.5, 3, 0);
    scene.add(ingridDesk);
    scene.add(createChair(4.5, 4.3, Math.PI));

    // Double Monitors for Ingrid (Scraper)
    const mon2Group = new THREE.Group();
    mon2Group.position.set(4, 1.2, 2.75);
    mon2Group.rotation.y = 0.25; // angled
    const mon2Stand = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.08, 0.4), new THREE.MeshStandardMaterial({ color: 0x222222 }));
    mon2Stand.position.y = 0.2;
    mon2Group.add(mon2Stand);
    const mon2Screen = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.6, 0.05), new THREE.MeshStandardMaterial({ color: 0x151515 }));
    mon2Screen.position.y = 0.5;
    mon2Group.add(mon2Screen);
    // Screen display (scraped leads log)
    const scraperCanvas = document.createElement("canvas");
    scraperCanvas.width = 128;
    scraperCanvas.height = 64;
    const sCtx = scraperCanvas.getContext("2d")!;
    sCtx.fillStyle = "#020802";
    sCtx.fillRect(0, 0, 128, 64);
    sCtx.fillStyle = "#00FF00";
    sCtx.font = "8px monospace";
    sCtx.fillText("LEADS SCRAPED:", 6, 12);
    sCtx.fillStyle = "#008800";
    sCtx.fillText("> domains parsed: 1,492", 6, 26);
    sCtx.fillText("> emails found  : 843", 6, 38);
    sCtx.fillText("> phone count   : 295", 6, 50);
    const screen2Tex = new THREE.CanvasTexture(scraperCanvas);
    const mon2Disp = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 0.55), new THREE.MeshBasicMaterial({ map: screen2Tex }));
    mon2Disp.position.set(0, 0.5, 0.03);
    mon2Group.add(mon2Disp);
    scene.add(mon2Group);

    // Second vertical screen for Ingrid
    const mon3Group = new THREE.Group();
    mon3Group.position.set(5.2, 1.2, 2.85);
    mon3Group.rotation.y = -0.45;
    const mon3Stand = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.08, 0.4), new THREE.MeshStandardMaterial({ color: 0x222222 }));
    mon3Stand.position.y = 0.2;
    mon3Group.add(mon3Stand);
    const mon3Screen = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.9, 0.05), new THREE.MeshStandardMaterial({ color: 0x151515 }));
    mon3Screen.position.y = 0.55;
    mon3Group.add(mon3Screen);
    
    // Matrix scroll canvas
    const matrixCanvas = document.createElement("canvas");
    matrixCanvas.width = 64;
    matrixCanvas.height = 128;
    const mCtx = matrixCanvas.getContext("2d")!;
    mCtx.fillStyle = "#000";
    mCtx.fillRect(0, 0, 64, 128);
    mCtx.fillStyle = "#0f0";
    mCtx.font = "8px monospace";
    for(let r=0; r<12; r++) {
      let codeLine = Math.random().toString(36).substring(3, 10);
      mCtx.fillText(codeLine, 4, 12 + r*10);
    }
    const screen3Tex = new THREE.CanvasTexture(matrixCanvas);
    const mon3Disp = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.85), new THREE.MeshBasicMaterial({ map: screen3Tex }));
    mon3Disp.position.set(0, 0.55, 0.03);
    mon3Group.add(mon3Disp);
    scene.add(mon3Group);

    // Desk 3: Oreo (The Cat - Emails and support)
    // Placed slightly to the back
    const oreoDesk = createDesk(0, -4, 0);
    scene.add(oreoDesk);
    
    // Cozy Cat Bed on the desk
    const bedGeo = new THREE.CylinderGeometry(0.55, 0.6, 0.12, 16);
    const bedMat = new THREE.MeshStandardMaterial({ color: 0xcc3333, roughness: 0.9 });
    const bed = new THREE.Mesh(bedGeo, bedMat);
    bed.position.set(-1.0, 1.25, -0.2);
    oreoDesk.add(bed);

    // Monitor for Oreo (showing email deliveries)
    const mon4Group = new THREE.Group();
    mon4Group.position.set(0, 1.2, -4.25);
    const mon4Stand = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.08, 0.4), new THREE.MeshStandardMaterial({ color: 0x222222 }));
    mon4Stand.position.y = 0.2;
    mon4Group.add(mon4Stand);
    const mon4Screen = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.65, 0.05), new THREE.MeshStandardMaterial({ color: 0x151515 }));
    mon4Screen.position.y = 0.5;
    mon4Group.add(mon4Screen);
    
    const emailCanvas = document.createElement("canvas");
    emailCanvas.width = 128;
    emailCanvas.height = 64;
    const eCtx = emailCanvas.getContext("2d")!;
    eCtx.fillStyle = "#1e1e24";
    eCtx.fillRect(0, 0, 128, 64);
    eCtx.fillStyle = "#FF9F00";
    eCtx.font = "bold 9px Arial";
    eCtx.fillText("OREO EMAIL ENGINE", 10, 15);
    eCtx.fillStyle = "#fff";
    eCtx.font = "8px Arial";
    eCtx.fillText("Status: Sending [24/7]", 10, 28);
    eCtx.fillStyle = "#a8ffb2";
    eCtx.fillText("✓ hello@client.com", 10, 40);
    eCtx.fillText("✓ info@agency.com", 10, 52);
    const screen4Tex = new THREE.CanvasTexture(emailCanvas);
    const mon4Disp = new THREE.Mesh(new THREE.PlaneGeometry(1.05, 0.6), new THREE.MeshBasicMaterial({ map: screen4Tex }));
    mon4Disp.position.set(0, 0.5, 0.03);
    mon4Group.add(mon4Disp);
    scene.add(mon4Group);


    // --- PING-PONG TABLE ---
    const ppTable = new THREE.Group();
    ppTable.position.set(-8.5, 0, -3.5);
    ppTable.rotation.y = 0.2;

    // Green Table Top
    const tableTop = new THREE.Mesh(
      new THREE.BoxGeometry(4.5, 0.1, 2.6),
      new THREE.MeshStandardMaterial({ color: 0x1e5a26, roughness: 0.85 })
    );
    tableTop.position.y = 1.05;
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    ppTable.add(tableTop);

    // White outline lines
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const outlineL = new THREE.Mesh(new THREE.PlaneGeometry(4.48, 0.03), lineMat);
    outlineL.rotation.x = -Math.PI/2;
    outlineL.position.set(0, 1.105, -1.285);
    ppTable.add(outlineL);

    const outlineR = new THREE.Mesh(new THREE.PlaneGeometry(4.48, 0.03), lineMat);
    outlineR.rotation.x = -Math.PI/2;
    outlineR.position.set(0, 1.105, 1.285);
    ppTable.add(outlineR);

    const outlineMid = new THREE.Mesh(new THREE.PlaneGeometry(4.48, 0.015), lineMat);
    outlineMid.rotation.x = -Math.PI/2;
    outlineMid.position.set(0, 1.105, 0);
    ppTable.add(outlineMid);

    // Ping pong net
    const netGeo = new THREE.BoxGeometry(0.04, 0.3, 2.76);
    const netMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, transparent: true, opacity: 0.7, wireframe: false });
    const net = new THREE.Mesh(netGeo, netMat);
    net.position.set(0, 1.2, 0);
    ppTable.add(net);

    // Legs
    const legPPGeo = new THREE.BoxGeometry(0.12, 1.0, 0.12);
    const legPPMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.6 });
    const ppLegPositions = [
      [-2.1, 0.5, -1.2],
      [2.1, 0.5, -1.2],
      [-2.1, 0.5, 1.2],
      [2.1, 0.5, 1.2],
      [0, 0.5, -1.15],
      [0, 0.5, 1.15]
    ];
    ppLegPositions.forEach(pos => {
      const leg = new THREE.Mesh(legPPGeo, legPPMat);
      leg.position.set(pos[0], pos[1], pos[2]);
      leg.castShadow = true;
      ppTable.add(leg);
    });

    // Paddles on table
    const paddleRed = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.02, 16), new THREE.MeshBasicMaterial({ color: 0xd92121 }));
    paddleRed.position.set(-1.0, 1.11, 0.4);
    paddleRed.rotation.x = Math.PI/2;
    ppTable.add(paddleRed);

    const paddleBlue = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.02, 16), new THREE.MeshBasicMaterial({ color: 0x215fd9 }));
    paddleBlue.position.set(1.0, 1.11, -0.3);
    paddleBlue.rotation.x = Math.PI/2;
    ppTable.add(paddleBlue);

    const ppBall = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    ppBall.position.set(-0.2, 1.12, 0.15);
    ppTable.add(ppBall);

    scene.add(ppTable);


    // --- WATER DISPENSER (BEBEDOURO) ---
    const waterDispenser = new THREE.Group();
    waterDispenser.position.set(-10.5, 0, 7.5);
    // Stand
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.2, 16), new THREE.MeshStandardMaterial({ color: 0xe5e7eb, roughness: 0.6 }));
    stand.position.y = 0.6;
    stand.castShadow = true;
    waterDispenser.add(stand);
    // Dispenser top
    const topCap = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16), new THREE.MeshStandardMaterial({ color: 0x9ca3af }));
    topCap.position.y = 1.3;
    waterDispenser.add(topCap);
    // Bottle (transparent light blue)
    const bottle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.28, 0.9, 16),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.65, roughness: 0.2, metalness: 0.1 })
    );
    bottle.position.y = 1.85;
    bottle.castShadow = true;
    waterDispenser.add(bottle);

    scene.add(waterDispenser);


    // --- LOW-POLY PINE TREES (PLANTS) ---
    const createPlant = (x: number, z: number) => {
      const plant = new THREE.Group();
      plant.position.set(x, 0, z);

      // Pot
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.25, 0.5, 8), new THREE.MeshStandardMaterial({ color: 0xa15c38, roughness: 0.9 }));
      pot.position.y = 0.25;
      pot.castShadow = true;
      plant.add(pot);

      // Trunk
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.5), new THREE.MeshStandardMaterial({ color: 0x5a3e2b }));
      trunk.position.y = 0.75;
      plant.add(trunk);

      // Foliage Cones
      const coneMat = new THREE.MeshStandardMaterial({ color: 0x228b22, roughness: 0.9 });
      for (let i = 0; i < 3; i++) {
        const cone = new THREE.Mesh(new THREE.ConeGeometry(0.65 - i*0.12, 0.7, 8), coneMat);
        cone.position.y = 1.2 + i*0.45;
        cone.castShadow = true;
        plant.add(cone);
      }

      return plant;
    };

    scene.add(createPlant(-10.5, -7.5));
    scene.add(createPlant(10.5, -7.5));
    scene.add(createPlant(10.5, 7.5));
    scene.add(createPlant(-5, -8.5)); // dividing wall area plants


    // --- OFFICE CABINETS ---
    const createCabinet = (x: number, z: number, rotationY = 0) => {
      const cab = new THREE.Group();
      cab.position.set(x, 0, z);
      cab.rotation.y = rotationY;

      const body = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.5, 0.8), new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.8 }));
      body.position.y = 1.25;
      body.castShadow = true;
      body.receiveShadow = true;
      cab.add(body);

      // Handles
      const hGeo = new THREE.BoxGeometry(0.05, 0.3, 0.05);
      const hMat = new THREE.MeshStandardMaterial({ color: 0xdde2e6, metalness: 0.8 });
      const h1 = new THREE.Mesh(hGeo, hMat);
      h1.position.set(-0.1, 1.4, 0.42);
      cab.add(h1);
      const h2 = new THREE.Mesh(hGeo, hMat);
      h2.position.set(0.1, 1.4, 0.42);
      cab.add(h2);

      return cab;
    };

    scene.add(createCabinet(-8, -9.3, 0));
    scene.add(createCabinet(8, -9.3, 0));


    // --- OFFICE DIVISION PARTITION WALL ---
    // A low-poly wall separating relax space (ping pong) from work area
    const partition = new THREE.Group();
    partition.position.set(-2, 0, -1);
    
    const divider = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 1.8, 6.0),
      new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.8 }) // green divider
    );
    divider.position.y = 0.9;
    divider.castShadow = true;
    divider.receiveShadow = true;
    partition.add(divider);

    // Frame/Border
    const frameGeo = new THREE.BoxGeometry(0.2, 1.9, 0.1);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0xcd853f });
    const fLeft = new THREE.Mesh(frameGeo, frameMat);
    fLeft.position.set(0, 0.95, -3.0);
    partition.add(fLeft);
    const fRight = new THREE.Mesh(frameGeo, frameMat);
    fRight.position.set(0, 0.95, 3.0);
    partition.add(fRight);

    scene.add(partition);


    // --- COLLISION DETECTION SETUP ---
    // Obstáculos estáticos no plano XZ
    const obstacles = [
      // Mesas
      { minX: -6.1, maxX: -2.9, minZ: 2.1, maxZ: 3.9 },  // Mesa Edu
      { minX: 2.9, maxX: 6.1, minZ: 2.1, maxZ: 3.9 },   // Mesa Ingrid
      { minX: -1.6, maxX: 1.6, minZ: -4.9, maxZ: -3.1 }, // Mesa Oreo
      
      // Mesa de Ping Pong
      { minX: -10.9, maxX: -6.1, minZ: -5.0, maxZ: -2.0 },
      
      // Armários (Cabinets)
      { minX: -9.2, maxX: -6.8, minZ: -9.8, maxZ: -8.7 },
      { minX: 6.8, maxX: 9.2, minZ: -9.8, maxZ: -8.7 },
      
      // Divisória (Partition)
      { minX: -2.2, maxX: -1.8, minZ: -4.1, maxZ: 2.1 },
      
      // Bebedouro
      { minX: -11.0, maxX: -10.0, minZ: 7.0, maxZ: 8.0 }
    ];

    const checkCollision = (x: number, z: number, radius = 0.45) => {
      // Limites das bordas do escritório para não saírem do piso visível (piso tem 24x20)
      if (x - radius < -10.8 || x + radius > 10.8 || z - radius < -8.8 || z + radius > 8.8) {
        return true;
      }
      
      // Verificar cada obstáculo
      for (const obs of obstacles) {
        if (x + radius > obs.minX && x - radius < obs.maxX &&
            z + radius > obs.minZ && z - radius < obs.maxZ) {
          return true;
        }
      }
      return false;
    };


    // --- BUILD CHARACTERS (EDU, INGRID, OREO) ---
    
    // 1. EDU Mesh Group (Art Director)
    const eduGroup = new THREE.Group();
    eduGroup.position.set(eduStateRef.current.x, eduStateRef.current.y, eduStateRef.current.z);
    eduGroup.rotation.y = eduStateRef.current.rotY;

    const skinMat = new THREE.MeshStandardMaterial({ color: 0xe09b67, roughness: 0.7 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 }); // t-shirt preta
    const neonGreenMat = new THREE.MeshStandardMaterial({ color: 0x2eff00, roughness: 0.5 }); // detalhes verdes
    const bluePantsMat = new THREE.MeshStandardMaterial({ color: 0x1d2d3d, roughness: 0.8 }); // calça azul escuro
    const greyTshirtMat = new THREE.MeshStandardMaterial({ color: 0x374151, roughness: 0.8 }); // camiseta cinza chumbo

    // Head
    const eduHead = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.65, 0.65), skinMat);
    eduHead.position.y = 2.15;
    eduHead.castShadow = true;
    eduGroup.add(eduHead);

    // Hair
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x2e1911, roughness: 0.9 });
    const hair = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.25, 0.7), hairMat);
    hair.position.set(0, 2.5, 0.02);
    eduGroup.add(hair);
    const tuft = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.15, 0.25), hairMat);
    tuft.position.set(0, 2.45, 0.35);
    eduGroup.add(tuft);

    // Glasses
    const glGeo = new THREE.BoxGeometry(0.72, 0.18, 0.05);
    const glMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const glasses = new THREE.Mesh(glGeo, glMat);
    glasses.position.set(0, 2.18, 0.32);
    eduGroup.add(glasses);

    // Torso (Camiseta cinza chumbo simples)
    const eduTorso = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.9, 0.45), greyTshirtMat);
    eduTorso.position.y = 1.35;
    eduTorso.castShadow = true;
    eduGroup.add(eduTorso);

    const eduNeck = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.15, 0.25), skinMat);
    eduNeck.position.y = 1.82;
    eduGroup.add(eduNeck);

    // Pernas Articuladas
    const eduLegL = new THREE.Group();
    eduLegL.position.set(-0.18, 0.9, 0);
    const eduLegLMesh = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.7, 0.22), bluePantsMat);
    eduLegLMesh.position.y = -0.35;
    eduLegLMesh.castShadow = true;
    eduLegL.add(eduLegLMesh);
    const eduShoeL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.1, 0.35), blackMat);
    eduShoeL.position.set(0, -0.7, 0.05);
    eduShoeL.castShadow = true;
    eduLegL.add(eduShoeL);
    // Sola branca premium
    const eduSoleL = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.04, 0.37), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    eduSoleL.position.set(0, -0.73, 0.05);
    eduLegL.add(eduSoleL);
    eduGroup.add(eduLegL);

    const eduLegR = new THREE.Group();
    eduLegR.position.set(0.18, 0.9, 0);
    const eduLegRMesh = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.7, 0.22), bluePantsMat);
    eduLegRMesh.position.y = -0.35;
    eduLegRMesh.castShadow = true;
    eduLegR.add(eduLegRMesh);
    const eduShoeR = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.1, 0.35), blackMat);
    eduShoeR.position.set(0, -0.7, 0.05);
    eduShoeR.castShadow = true;
    eduLegR.add(eduShoeR);
    // Sola branca premium
    const eduSoleR = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.04, 0.37), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    eduSoleR.position.set(0, -0.73, 0.05);
    eduLegR.add(eduSoleR);
    eduGroup.add(eduLegR);

    // Braços Articulados (Camiseta de manga curta cinza chumbo)
    const eduArmL = new THREE.Group();
    eduArmL.position.set(-0.45, 1.7, 0);
    const eduArmLMesh = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.65, 0.16), greyTshirtMat);
    eduArmLMesh.position.y = -0.2;
    eduArmLMesh.castShadow = true;
    eduArmL.add(eduArmLMesh);
    const eduForearmL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.35, 0.14), skinMat);
    eduForearmL.position.y = -0.5;
    eduForearmL.castShadow = true;
    eduArmL.add(eduForearmL);
    eduGroup.add(eduArmL);

    const eduArmR = new THREE.Group();
    eduArmR.position.set(0.45, 1.7, 0);
    const eduArmRMesh = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.65, 0.16), greyTshirtMat);
    eduArmRMesh.position.y = -0.2;
    eduArmRMesh.castShadow = true;
    eduArmR.add(eduArmRMesh);
    const eduForearmR = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.35, 0.14), skinMat);
    eduForearmR.position.y = -0.5;
    eduForearmR.castShadow = true;
    eduArmR.add(eduForearmR);
    eduGroup.add(eduArmR);

    scene.add(eduGroup);


    // 2. INGRID Mesh Group (Lead Scraper)
    const ingridGroup = new THREE.Group();
    ingridGroup.position.set(ingridStateRef.current.x, ingridStateRef.current.y, ingridStateRef.current.z);
    ingridGroup.rotation.y = ingridStateRef.current.rotY;

    const neonCianMat = new THREE.MeshStandardMaterial({ color: 0x00e3ff, roughness: 0.5 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 });
    const greyMat = new THREE.MeshStandardMaterial({ color: 0x374151, roughness: 0.85 });
    const yellowSkirtMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.8 }); // saia amarela mostarda

    // Head
    const ingHead = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), skinMat);
    ingHead.position.y = 2.12;
    ingHead.castShadow = true;
    ingridGroup.add(ingHead);

    // Hair
    const bobHairMat = new THREE.MeshStandardMaterial({ color: 0x4e3022, roughness: 0.95 });
    const hairBob = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.45, 0.66), bobHairMat);
    hairBob.position.set(0, 2.35, -0.02);
    ingridGroup.add(hairBob);
    const hairL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.55, 0.66), bobHairMat);
    hairL.position.set(-0.32, 2.05, -0.02);
    ingridGroup.add(hairL);
    const hairR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.55, 0.66), bobHairMat);
    hairR.position.set(0.32, 2.05, -0.02);
    ingridGroup.add(hairR);

    // Glasses
    const glRoundL = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.04, 8), glMat);
    glRoundL.rotation.x = Math.PI / 2;
    glRoundL.position.set(-0.16, 2.15, 0.3);
    ingridGroup.add(glRoundL);
    const glRoundR = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.04, 8), glMat);
    glRoundR.rotation.x = Math.PI / 2;
    glRoundR.position.set(0.16, 2.15, 0.3);
    ingridGroup.add(glRoundR);
    const glBridge = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.02, 0.04), glMat);
    glBridge.position.set(0, 2.15, 0.3);
    ingridGroup.add(glBridge);

    // Torso (Blusa regata branca)
    const ingTorso = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.9, 0.44), whiteMat);
    ingTorso.position.y = 1.35;
    ingTorso.castShadow = true;
    ingridGroup.add(ingTorso);

    const ingNeck = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.12, 0.22), skinMat);
    ingNeck.position.y = 1.8;
    ingridGroup.add(ingNeck);

    // Pernas Articuladas (Saia amarela mostarda longa)
    const ingLegL = new THREE.Group();
    ingLegL.position.set(-0.17, 0.9, 0);
    const ingLegLMesh = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.7, 0.2), yellowSkirtMat);
    ingLegLMesh.position.y = -0.35;
    ingLegLMesh.castShadow = true;
    ingLegL.add(ingLegLMesh);
    const ingShoeL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.1, 0.32), blackMat);
    ingShoeL.position.set(0, -0.7, 0.04);
    ingShoeL.castShadow = true;
    ingLegL.add(ingShoeL);
    // Solado plataforma branco
    const ingSoleL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.06, 0.34), whiteMat);
    ingSoleL.position.set(0, -0.74, 0.04);
    ingLegL.add(ingSoleL);
    ingridGroup.add(ingLegL);

    const ingLegR = new THREE.Group();
    ingLegR.position.set(0.17, 0.9, 0);
    const ingLegRMesh = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.7, 0.2), yellowSkirtMat);
    ingLegRMesh.position.y = -0.35;
    ingLegRMesh.castShadow = true;
    ingLegR.add(ingLegRMesh); // Corrigido de ingridGroup.add(ingLegRMesh) para ingLegR.add(ingLegRMesh)
    const ingShoeR = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.1, 0.32), blackMat);
    ingShoeR.position.set(0, -0.7, 0.04);
    ingShoeR.castShadow = true;
    ingLegR.add(ingShoeR);
    // Solado plataforma branco
    const ingSoleR = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.06, 0.34), whiteMat);
    ingSoleR.position.set(0, -0.74, 0.04);
    ingLegR.add(ingSoleR);
    ingridGroup.add(ingLegR);

    // Braços Articulados (Blusa sem mangas - pele nua)
    const ingArmL = new THREE.Group();
    ingArmL.position.set(-0.42, 1.65, 0);
    const ingArmLMesh = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.6, 0.15), skinMat);
    ingArmLMesh.position.y = -0.2;
    ingArmLMesh.castShadow = true;
    ingArmL.add(ingArmLMesh);
    const ingForearmL = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.3, 0.13), skinMat);
    ingForearmL.position.y = -0.45;
    ingForearmL.castShadow = true;
    ingArmL.add(ingForearmL);
    ingridGroup.add(ingArmL);

    const ingArmR = new THREE.Group();
    ingArmR.position.set(0.42, 1.65, 0);
    const ingArmRMesh = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.6, 0.15), skinMat);
    ingArmRMesh.position.y = -0.2;
    ingArmRMesh.castShadow = true;
    ingArmR.add(ingArmRMesh);
    const ingForearmR = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.3, 0.13), skinMat);
    ingForearmR.position.y = -0.45;
    ingForearmR.castShadow = true;
    ingArmR.add(ingForearmR);
    ingridGroup.add(ingArmR);

    scene.add(ingridGroup);


    // 3. OREO (THE CAT) Mesh Group
    const oreoGroup = new THREE.Group();
    oreoGroup.position.set(oreoStateRef.current.x, oreoStateRef.current.y, oreoStateRef.current.z);
    oreoGroup.rotation.y = oreoStateRef.current.rotY;

    const catMat = new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.8 }); // preto
    const catWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 }); // branco
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffa500 }); // olhos de gato laranja
    
    // Body
    const cBody = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.28, 0.55), catMat);
    cBody.position.y = 0.14;
    cBody.castShadow = true;
    oreoGroup.add(cBody);

    // Peito branco
    const cChest = new THREE.Mesh(new THREE.BoxGeometry(0.39, 0.20, 0.25), catWhiteMat);
    cChest.position.set(0, 0.10, 0.16);
    oreoGroup.add(cChest);

    // Head
    const cHead = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), catMat);
    cHead.position.set(0, 0.36, 0.2);
    cHead.castShadow = true;
    oreoGroup.add(cHead);
    
    // Focinho branco
    const cMuzzle = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.08, 0.08), catWhiteMat);
    cMuzzle.position.set(0, 0.28, 0.34);
    oreoGroup.add(cMuzzle);

    // Ears
    const earL = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.12, 4), catMat);
    earL.position.set(-0.09, 0.52, 0.2);
    earL.rotation.y = Math.PI / 4;
    oreoGroup.add(earL);
    const earR = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.12, 4), catMat);
    earR.position.set(0.09, 0.52, 0.2);
    earR.rotation.y = -Math.PI / 4;
    oreoGroup.add(earR);

    // Eyes
    const cEyeL = new THREE.Mesh(new THREE.SphereGeometry(0.038, 8, 8), eyeMat);
    cEyeL.position.set(-0.08, 0.40, 0.33);
    oreoGroup.add(cEyeL);
    const cEyeR = new THREE.Mesh(new THREE.SphereGeometry(0.038, 8, 8), eyeMat);
    cEyeR.position.set(0.08, 0.40, 0.33);
    oreoGroup.add(cEyeR);

    // Patinhas individuais com meias brancas
    const createCatLeg = (xPos: number, zPos: number) => {
      const legGroup = new THREE.Group();
      legGroup.position.set(xPos, 0.10, zPos);
      
      const legMesh = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.15, 0.08), catMat);
      legMesh.position.y = -0.055;
      legMesh.castShadow = true;
      legGroup.add(legMesh);

      const footMesh = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.04, 0.12), catWhiteMat);
      footMesh.position.set(0, -0.12, 0.02);
      footMesh.castShadow = true;
      legGroup.add(footMesh);

      return legGroup;
    };

    const legFL = createCatLeg(-0.14, 0.18);
    const legFR = createCatLeg(0.14, 0.18);
    const legBL = createCatLeg(-0.14, -0.18);
    const legBR = createCatLeg(0.14, -0.18);

    oreoGroup.add(legFL);
    oreoGroup.add(legFR);
    oreoGroup.add(legBL);
    oreoGroup.add(legBR);

    // Tail
    const tailGroup = new THREE.Group();
    tailGroup.position.set(0, 0.22, -0.26);
    const cTail = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.3), catMat);
    cTail.position.z = -0.13;
    cTail.rotation.x = 0.4;
    tailGroup.add(cTail);
    
    // Ponta branca da cauda
    const cTailTip = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.055, 0.08), catWhiteMat);
    cTailTip.position.set(0, 0.04, -0.28);
    cTailTip.rotation.x = 0.4;
    tailGroup.add(cTailTip);

    oreoGroup.add(tailGroup);

    scene.add(oreoGroup);


    // --- EMAIL ENVELOPES PARTICLES SYSTEM ---
    // Floating envelope particles flying from Oreo's computer screen towards the ceiling
    const mailParticles: { mesh: THREE.Mesh; speedY: number; speedX: number; speedZ: number; life: number }[] = [];
    const mailGroup = new THREE.Group();
    scene.add(mailGroup);

    const createEnvelopeMesh = () => {
      const eGroup = new THREE.Group();
      // Outer sheet
      const body = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.2), new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }));
      eGroup.add(body);
      // Red stamp point
      const stamp = new THREE.Mesh(new THREE.PlaneGeometry(0.04, 0.04), new THREE.MeshBasicMaterial({ color: 0xd92121 }));
      stamp.position.z = 0.005;
      eGroup.add(stamp);
      return eGroup;
    };

    const triggerEmailBurst = () => {
      // Spawn 15 particles
      for (let i = 0; i < 15; i++) {
        const mail = createEnvelopeMesh() as any;
        // Start near Oreo's screen (0, 1.6, -4.2)
        mail.position.set(
          (Math.random() - 0.5) * 0.6,
          1.5 + Math.random() * 0.3,
          -4.0 + (Math.random() - 0.5) * 0.3
        );
        mail.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          0
        );
        mail.scale.setScalar(0.7 + Math.random()*0.5);
        mailGroup.add(mail);
        mailParticles.push({
          mesh: mail,
          speedY: 0.03 + Math.random() * 0.04,
          speedX: (Math.random() - 0.5) * 0.02,
          speedZ: (Math.random() - 0.5) * 0.02,
          life: 1.0 // 100% health
        });
      }
    };


    // --- ANIMATION VARIABLES & LOOP ---
    let clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      let delta = clock.getDelta();
      if (delta > 0.1) delta = 0.1;
      const elapsedTime = clock.getElapsedTime();
      
      // OrbitControls update
      controls.update();

      // --- SIMULATION ANIMATIONS ---
      const speed = simulationSpeed;
      
      const getRandomTarget = (currentX: number, currentZ: number) => {
        let attempts = 0;
        while (attempts < 20) {
          const tx = (Math.random() - 0.5) * 20; // de -10 a 10
          const tz = (Math.random() - 0.5) * 16; // de -8 a 8
          if (!checkCollision(tx, tz, 0.45)) {
            return { tx, tz };
          }
          attempts++;
        }
        return { tx: currentX, tz: currentZ };
      };

      // --- UPDATE CHARACTERS AUTONOMOUSLY ---
      
      // 1. EDU
      if (eduGroup) {
        const edu = eduStateRef.current;
        edu.stateTimer -= delta * speed;
        
        if (edu.stateTimer <= 0) {
          if (edu.state === "walking") {
            if (Math.random() < 0.5) {
              edu.state = "sitting_down";
              edu.targetX = -4.5;
              edu.targetZ = 4.3;
              edu.stateTimer = 0.6; // transição
            } else {
              edu.state = "idle";
              edu.stateTimer = Math.random() * 4 + 2;
            }
          } else if (edu.state === "working") {
            edu.state = "standing_up";
            edu.targetX = -4.5;
            edu.targetZ = 5.6; // sai do obstáculo
            edu.stateTimer = 0.6; // transição
          } else if (edu.state === "sitting_down") {
            edu.state = "working";
            edu.x = -4.5;
            edu.z = 4.3;
            edu.y = -0.22;
            edu.stateTimer = Math.random() * 15 + 15;
          } else if (edu.state === "standing_up") {
            edu.state = "walking";
            edu.x = -4.5;
            edu.z = 5.6;
            edu.y = 0;
            const tgt = getRandomTarget(edu.x, edu.z);
            edu.targetX = tgt.tx;
            edu.targetZ = tgt.tz;
            edu.stateTimer = Math.random() * 12 + 6;
          } else {
            edu.state = "walking";
            const tgt = getRandomTarget(edu.x, edu.z);
            edu.targetX = tgt.tx;
            edu.targetZ = tgt.tz;
            edu.stateTimer = Math.random() * 12 + 6;
          }
        }

        if (edu.state === "sitting_down") {
          const duration = 0.6;
          const progress = (duration - edu.stateTimer) / duration;
          edu.x = -4.5;
          edu.z = 5.6 - (5.6 - 4.3) * progress;
          edu.y = Math.sin(progress * Math.PI) * 0.8 - 0.22 * progress;
          edu.rotY = Math.PI;
          eduLegL.rotation.x = -Math.PI / 4 * progress;
          eduLegR.rotation.x = -Math.PI / 4 * progress;
          eduGroup.position.y = edu.y;
        } else if (edu.state === "standing_up") {
          const duration = 0.6;
          const progress = (duration - edu.stateTimer) / duration;
          edu.x = -4.5;
          edu.z = 4.3 + (5.6 - 4.3) * progress;
          edu.y = -0.22 + Math.sin(progress * Math.PI) * 0.8 + 0.22 * progress;
          edu.rotY = 0;
          eduLegL.rotation.x = -Math.PI / 4 * (1 - progress);
          eduLegR.rotation.x = -Math.PI / 4 * (1 - progress);
          eduGroup.position.y = edu.y;
        } else if (edu.state === "walking" || (edu.state === "working" && (Math.abs(edu.x - edu.targetX) > 0.15 || Math.abs(edu.z - edu.targetZ) > 0.15))) {
          const dx = edu.targetX - edu.x;
          const dz = edu.targetZ - edu.z;
          const dist = Math.sqrt(dx * dx + dz * dz);
          
          if (dist > 0.1) {
            edu.rotY = Math.atan2(dx, dz);
            const moveStep = 0.9 * speed * delta;
            const step = Math.min(moveStep, dist);
            const nextX = edu.x + (dx / dist) * step;
            const nextZ = edu.z + (dz / dist) * step;
            
            if (!checkCollision(nextX, nextZ, 0.45)) {
              edu.x = nextX;
              edu.z = nextZ;
              edu.y = 0;
            } else {
              if (edu.state === "walking") {
                const tgt = getRandomTarget(edu.x, edu.z);
                edu.targetX = tgt.tx;
                edu.targetZ = tgt.tz;
              } else {
                edu.x = edu.targetX;
                edu.z = edu.targetZ;
              }
            }
          }
          
          const walkCycle = elapsedTime * 8 * speed;
          eduLegL.rotation.x = Math.sin(walkCycle) * 0.45;
          eduLegR.rotation.x = -Math.sin(walkCycle) * 0.45;
          eduArmL.rotation.x = -Math.sin(walkCycle) * 0.40;
          eduArmR.rotation.x = Math.sin(walkCycle) * 0.40;
          eduGroup.position.y = Math.abs(Math.sin(walkCycle * 2)) * 0.05;
        } else if (edu.state === "working") {
          edu.x = -4.5;
          edu.z = 4.3;
          edu.y = -0.22;
          edu.rotY = Math.PI;
          
          eduLegL.rotation.x = -Math.PI / 2.3;
          eduLegR.rotation.x = -Math.PI / 2.3;
          
          const typingSpeed = elapsedTime * 20 * speed;
          eduArmL.rotation.x = -Math.PI / 3 + Math.sin(typingSpeed) * 0.08;
          eduArmR.rotation.x = -Math.PI / 3 + Math.cos(typingSpeed) * 0.08;
          eduArmL.rotation.y = 0.1;
          eduArmR.rotation.y = -0.1;
          eduGroup.position.y = edu.y;
        } else {
          eduLegL.rotation.x = 0;
          eduLegR.rotation.x = 0;
          eduArmL.rotation.x = 0;
          eduArmR.rotation.x = 0;
          eduArmL.rotation.y = 0;
          eduArmR.rotation.y = 0;
          eduGroup.position.y = Math.sin(elapsedTime * 2.2 * speed) * 0.02;
        }

        if (isEduFocus) {
          edu.state = "working";
          edu.targetX = -4.5;
          edu.targetZ = 3.25;
          edu.x = -4.5;
          edu.z = 3.25;
          edu.y = 0;
          edu.rotY = Math.PI;
          eduHead.rotation.x = 0.25;
          eduGroup.position.y = 0;
        } else {
          eduHead.rotation.x = 0;
        }

        eduGroup.position.set(edu.x, eduGroup.position.y, edu.z);
        eduGroup.rotation.y = edu.rotY;
        eduHead.rotation.y = Math.sin(elapsedTime * 0.6 * speed) * 0.15;
      }

      // 2. INGRID
      if (ingridGroup) {
        const ing = ingridStateRef.current;
        ing.stateTimer -= delta * speed;

        if (ing.stateTimer <= 0) {
          if (ing.state === "walking") {
            if (Math.random() < 0.5) {
              ing.state = "sitting_down";
              ing.targetX = 4.5;
              ing.targetZ = 4.3;
              ing.stateTimer = 0.6; // transição
            } else {
              ing.state = "idle";
              ing.stateTimer = Math.random() * 3 + 2;
            }
          } else if (ing.state === "working") {
            ing.state = "standing_up";
            ing.targetX = 4.5;
            ing.targetZ = 5.6; // sai do obstáculo
            ing.stateTimer = 0.6; // transição
          } else if (ing.state === "sitting_down") {
            ing.state = "working";
            ing.x = 4.5;
            ing.z = 4.3;
            ing.y = -0.22;
            ing.stateTimer = Math.random() * 15 + 15;
          } else if (ing.state === "standing_up") {
            ing.state = "walking";
            ing.x = 4.5;
            ing.z = 5.6;
            ing.y = 0;
            const tgt = getRandomTarget(ing.x, ing.z);
            ing.targetX = tgt.tx;
            ing.targetZ = tgt.tz;
            ing.stateTimer = Math.random() * 12 + 6;
          } else {
            ing.state = "walking";
            const tgt = getRandomTarget(ing.x, ing.z);
            ing.targetX = tgt.tx;
            ing.targetZ = tgt.tz;
            ing.stateTimer = Math.random() * 12 + 6;
          }
        }

        if (ing.state === "sitting_down") {
          const duration = 0.6;
          const progress = (duration - ing.stateTimer) / duration;
          ing.x = 4.5;
          ing.z = 5.6 - (5.6 - 4.3) * progress;
          ing.y = Math.sin(progress * Math.PI) * 0.8 - 0.22 * progress;
          ing.rotY = Math.PI;
          ingLegL.rotation.x = -Math.PI / 4 * progress;
          ingLegR.rotation.x = -Math.PI / 4 * progress;
          ingridGroup.position.y = ing.y;
        } else if (ing.state === "standing_up") {
          const duration = 0.6;
          const progress = (duration - ing.stateTimer) / duration;
          ing.x = 4.5;
          ing.z = 4.3 + (5.6 - 4.3) * progress;
          ing.y = -0.22 + Math.sin(progress * Math.PI) * 0.8 + 0.22 * progress;
          ing.rotY = 0;
          ingLegL.rotation.x = -Math.PI / 4 * (1 - progress);
          ingLegR.rotation.x = -Math.PI / 4 * (1 - progress);
          ingridGroup.position.y = ing.y;
        } else if (ing.state === "walking" || (ing.state === "working" && (Math.abs(ing.x - ing.targetX) > 0.15 || Math.abs(ing.z - ing.targetZ) > 0.15))) {
          const dx = ing.targetX - ing.x;
          const dz = ing.targetZ - ing.z;
          const dist = Math.sqrt(dx * dx + dz * dz);

          if (dist > 0.1) {
            ing.rotY = Math.atan2(dx, dz);
            const moveStep = 0.95 * speed * delta;
            const step = Math.min(moveStep, dist);
            const nextX = ing.x + (dx / dist) * step;
            const nextZ = ing.z + (dz / dist) * step;

            if (!checkCollision(nextX, nextZ, 0.45)) {
              ing.x = nextX;
              ing.z = nextZ;
              ing.y = 0;
            } else {
              if (ing.state === "walking") {
                const tgt = getRandomTarget(ing.x, ing.z);
                ing.targetX = tgt.tx;
                ing.targetZ = tgt.tz;
              } else {
                ing.x = ing.targetX;
                ing.z = ing.targetZ;
              }
            }
          }

          const walkCycle = elapsedTime * 8.5 * speed;
          ingLegL.rotation.x = Math.sin(walkCycle) * 0.45;
          ingLegR.rotation.x = -Math.sin(walkCycle) * 0.45;
          ingArmL.rotation.x = -Math.sin(walkCycle) * 0.40;
          ingArmR.rotation.x = Math.sin(walkCycle) * 0.40;
          ingridGroup.position.y = Math.abs(Math.sin(walkCycle * 2)) * 0.05;
        } else if (ing.state === "working") {
          ing.x = 4.5;
          ing.z = 4.3;
          ing.y = -0.22;
          ing.rotY = Math.PI;

          ingLegL.rotation.x = -Math.PI / 2.3;
          ingLegR.rotation.x = -Math.PI / 2.3;

          const typingSpeed = elapsedTime * 24 * speed;
          ingArmL.rotation.x = -Math.PI / 3.2 + Math.sin(typingSpeed) * 0.08;
          ingArmR.rotation.x = -Math.PI / 3.2 + Math.cos(typingSpeed) * 0.08;
          ingArmL.rotation.y = 0.1;
          ingArmR.rotation.y = -0.1;
          ingridGroup.position.y = ing.y;
        } else {
          ingLegL.rotation.x = 0;
          ingLegR.rotation.x = 0;
          ingArmL.rotation.x = 0;
          ingArmR.rotation.x = 0;
          ingArmL.rotation.y = 0;
          ingArmR.rotation.y = 0;
          ingridGroup.position.y = Math.sin(elapsedTime * 2.0 * speed + 1) * 0.02;
        }

        ingridGroup.position.set(ing.x, ingridGroup.position.y, ing.z);
        ingridGroup.rotation.y = ing.rotY;
        ingHead.rotation.y = Math.sin(elapsedTime * 0.7 * speed) * 0.12;

        screen3Tex.offset.y = -(elapsedTime * 0.4 * speed) % 1;
      }

      // 3. OREO (O Gato)
      if (oreoGroup) {
        const oreo = oreoStateRef.current;
        oreo.stateTimer -= delta * speed;

        if (oreo.stateTimer <= 0) {
          if (oreo.state === "walking") {
            const roll = Math.random();
            if (roll < 0.4) {
              oreo.state = "sleeping";
              oreo.targetX = -0.6;
              oreo.targetZ = -4.2;
              oreo.stateTimer = Math.random() * 20 + 20;
            } else if (roll < 0.75) {
              oreo.state = "working";
              oreo.targetX = 0.2;
              oreo.targetZ = -3.7;
              oreo.stateTimer = Math.random() * 12 + 10;
            } else {
              oreo.state = "idle";
              oreo.stateTimer = Math.random() * 4 + 2;
            }
          } else {
            oreo.state = "walking";
            const tgt = getRandomTarget(oreo.x, oreo.z);
            oreo.targetX = tgt.tx;
            oreo.targetZ = tgt.tz;
            oreo.stateTimer = Math.random() * 10 + 5;
          }
        }

        if (oreo.state === "walking" || 
            ((oreo.state === "working" || oreo.state === "sleeping") && 
             (Math.abs(oreo.x - oreo.targetX) > 0.15 || Math.abs(oreo.z - oreo.targetZ) > 0.15))) {
          
          const dx = oreo.targetX - oreo.x;
          const dz = oreo.targetZ - oreo.z;
          const dist = Math.sqrt(dx * dx + dz * dz);

          if (dist > 0.1) {
            oreo.rotY = Math.atan2(dx, dz);
            const moveSpeed = 1.35 * speed * delta;
            const step = Math.min(moveSpeed, dist);
            const nextX = oreo.x + (dx / dist) * step;
            const nextZ = oreo.z + (dz / dist) * step;

            const destIsTable = (oreo.state === "working" || oreo.state === "sleeping");
            let col = false;
            if (!destIsTable) {
              col = checkCollision(nextX, nextZ, 0.3);
            } else {
              const isNearMyDesk = (nextX > -1.7 && nextX < 1.7 && nextZ > -5.0 && nextZ < -3.0);
              if (!isNearMyDesk) {
                col = checkCollision(nextX, nextZ, 0.3);
              }
            }

            if (!col) {
              oreo.x = nextX;
              oreo.z = nextZ;
              
              const isOnMyDesk = (oreo.x > -1.7 && oreo.x < 1.7 && oreo.z > -5.0 && oreo.z < -3.0);
              if (isOnMyDesk) {
                const targetY = (oreo.state === "sleeping") ? 1.32 : 1.2;
                oreo.y += (targetY - oreo.y) * 0.15;
              } else {
                oreo.y += (0.15 - oreo.y) * 0.2;
              }
            } else {
              if (oreo.state === "walking") {
                const tgt = getRandomTarget(oreo.x, oreo.z);
                oreo.targetX = tgt.tx;
                oreo.targetZ = tgt.tz;
              } else {
                oreo.x = oreo.targetX;
                oreo.z = oreo.targetZ;
              }
            }
          }

          const walkCycle = elapsedTime * 12 * speed;
          legFL.rotation.x = Math.sin(walkCycle) * 0.5;
          legFR.rotation.x = -Math.sin(walkCycle) * 0.5;
          legBL.rotation.x = -Math.sin(walkCycle) * 0.5;
          legBR.rotation.x = Math.sin(walkCycle) * 0.5;
          
          tailGroup.rotation.y = Math.sin(elapsedTime * 6 * speed) * 0.25;
          oreoGroup.position.y = oreo.y + Math.abs(Math.sin(walkCycle * 2)) * 0.02;
        } else if (oreo.state === "working") {
          oreo.x = 0.2;
          oreo.z = -3.7;
          oreo.y = 1.2;
          oreo.rotY = Math.PI - 0.2;
          
          const typingSpeed = elapsedTime * 22 * speed;
          legFL.rotation.x = -Math.PI / 4 + Math.sin(typingSpeed) * 0.3;
          legFR.rotation.x = -Math.PI / 4 + Math.cos(typingSpeed) * 0.3;
          legBL.rotation.x = 0;
          legBR.rotation.x = 0;
          
          tailGroup.rotation.y = Math.sin(elapsedTime * 9 * speed) * 0.45;
          oreoGroup.position.y = oreo.y;
        } else if (oreo.state === "sleeping") {
          oreo.x = -0.6;
          oreo.z = -4.2;
          oreo.y = 1.25;
          oreo.rotY = Math.PI / 2;
          
          legFL.rotation.x = -Math.PI / 3;
          legFR.rotation.x = -Math.PI / 3;
          legBL.rotation.x = -Math.PI / 3;
          legBR.rotation.x = -Math.PI / 3;
          
          tailGroup.rotation.y = Math.sin(elapsedTime * 1.5 * speed) * 0.15;
          oreoGroup.position.y = oreo.y + Math.sin(elapsedTime * 2.0 * speed) * 0.008;
        } else {
          legFL.rotation.x = 0;
          legFR.rotation.x = 0;
          legBL.rotation.x = 0;
          legBR.rotation.x = 0;
          tailGroup.rotation.y = Math.sin(elapsedTime * 3 * speed) * 0.2;
          oreoGroup.position.y = oreo.y + Math.sin(elapsedTime * 1.5 * speed) * 0.01;
        }

        if (isEmailBurst) {
          oreo.state = "working";
          oreo.targetX = 0.2;
          oreo.targetZ = -3.7;
          oreo.x = 0.2;
          oreo.z = -3.7;
          oreo.y = 1.2;
          oreo.rotY = Math.PI - 0.2;
          
          const typingSpeed = elapsedTime * 45 * speed;
          legFL.rotation.x = -Math.PI / 4 + Math.sin(typingSpeed) * 0.4;
          legFR.rotation.x = -Math.PI / 4 + Math.cos(typingSpeed) * 0.4;
          tailGroup.rotation.y = Math.sin(elapsedTime * 20 * speed) * 0.6;
        }

        oreoGroup.position.set(oreo.x, oreoGroup.position.y, oreo.z);
        oreoGroup.rotation.y = oreo.rotY;
        cHead.rotation.x = 0.1 + Math.sin(elapsedTime * 1.8 * speed) * 0.05;
      }

      if (isScrapingActive) {
        screen2Tex.offset.y = -(elapsedTime * 0.8 * speed) % 1;
      }

      // 5. Update Email envelopes particles
      for (let i = mailParticles.length - 1; i >= 0; i--) {
        const p = mailParticles[i];
        p.mesh.position.y += p.speedY * speed;
        p.mesh.position.x += p.speedX * speed;
        p.mesh.position.z += p.speedZ * speed;
        p.mesh.rotation.x += 0.02 * speed;
        p.mesh.rotation.y += 0.03 * speed;
        p.life -= 0.012 * speed;

        if (p.life <= 0) {
          mailGroup.remove(p.mesh);
          mailParticles.splice(i, 1);
        } else {
          // fade opacity
          (p.mesh.children[0] as any).material.opacity = p.life;
          (p.mesh.children[1] as any).material.opacity = p.life;
        }
      }

      // Continuous slow email spawn when idle
      if (Math.random() < 0.03 * speed && mailParticles.length < 20) {
        const mail = createEnvelopeMesh();
        mail.position.set(0, 1.6, -4.2);
        mail.scale.setScalar(0.6);
        mailGroup.add(mail);
        mailParticles.push({
          mesh: mail as any,
          speedY: 0.02 + Math.random() * 0.03,
          speedX: (Math.random() - 0.5) * 0.01,
          speedZ: Math.random() * 0.015 + 0.01,
          life: 1.0
        });
      }

      // --- PROJECT 3D LABELS TO 2D OVERLAYS ---
      const width = container.clientWidth;
      const height = container.clientHeight;
      const tempV = new THREE.Vector3();

      const updateLabelCoords = (mesh: THREE.Group, heightOffset: number) => {
        mesh.getWorldPosition(tempV);
        tempV.y += heightOffset; // label height above ground
        tempV.project(camera);
        
        // if behind camera, hide
        if (tempV.z > 1) {
          return { x: 0, y: 0, visible: false };
        }

        const x = (tempV.x * 0.5 + 0.5) * width;
        const y = (tempV.y * -0.5 + 0.5) * height;
        return { x, y, visible: true };
      };

      setLabels({
        edu: updateLabelCoords(eduGroup, 2.9),
        ingrid: updateLabelCoords(ingridGroup, 2.9),
        oreo: updateLabelCoords(oreoGroup, 0.65)
      });

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Event listener for custom triggers
    const handleEmailTrigger = () => {
      triggerEmailBurst();
    };
    window.addEventListener("simulation-email-burst", handleEmailTrigger);

    // --- CLEANUP ---
    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("simulation-email-burst", handleEmailTrigger);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [simulationSpeed, isScrapingActive, isEduFocus]);

  // Handlers for manual actions
  const triggerEmails = () => {
    setIsEmailBurst(true);
    addLog("Oreo foi cobrado! Enviando rajada de e-mails de prospecção...");
    window.dispatchEvent(new Event("simulation-email-burst"));
    const sound = new Audio("https://assets.mixkit.co/active_storage/sfx/937/937-400.wav");
    sound.volume = 0.15;
    sound.play().catch(() => {});
    setTimeout(() => setIsEmailBurst(false), 1200);
  };

  const triggerScrape = () => {
    setIsScrapingActive(true);
    addLog("Ingrid ativou raspador multithread. Escaneando leads...");
    const sound = new Audio("https://assets.mixkit.co/active_storage/sfx/1647/1647-400.wav");
    sound.volume = 0.15;
    sound.play().catch(() => {});
    setTimeout(() => {
      setIsScrapingActive(false);
      addLog("Scraping concluído. 14 novos leads injetados no CRM.");
    }, 4000);
  };

  const triggerEduFocus = () => {
    setIsEduFocus(true);
    addLog("Edu Santos está debruçado sobre a tela revisando o alinhamento visual.");
    setTimeout(() => {
      setIsEduFocus(false);
      addLog("Edu liberou o design! Grid de pixels aprovado.");
    }, 3500);
  };

  return (
    <div className="flex-1 h-full overflow-hidden flex flex-col bg-[#030303] text-white">
      {/* Header bar */}
      <div className="border-b border-[#111] px-6 py-4 flex items-center justify-between shrink-0 bg-[#070707]">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-3">
            <Briefcase size={22} className="text-[#00d1ff]" />
            Escritório 3D
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Visão em tempo real da equipe da ESCOM Studio simulando suas funções</p>
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-4 text-xs">
          <button 
            onClick={() => {
              if (controlsRef.current) {
                controlsRef.current.reset();
              }
              addLog("Câmera reiniciada para visão geral.");
            }} 
            className="flex items-center gap-1.5 bg-[#00d1ff]/10 text-[#00d1ff] border border-[#00d1ff]/20 px-3 py-1.5 rounded-lg hover:bg-[#00d1ff]/20 transition-colors"
          >
            <RefreshCw size={14} />
            Reset Câmera
          </button>
        </div>
      </div>

      {/* Main Workspace split */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* 3D Viewport container */}
        <div className="flex-1 h-full relative cursor-grab active:cursor-grabbing" ref={containerRef}>
          {/* Overlay instruction */}
          <div className="absolute top-4 left-4 z-10 pointer-events-none bg-black/70 backdrop-blur-md px-3 py-2 rounded-lg border border-white/10 text-[10px] font-mono tracking-wider text-gray-400">
            🖱️ Clique e arraste para ORBITAR | 📜 Scroll para ZOOM | 🖱️ Botão direito para ARRASTAR
          </div>

          {/* 3D FLOATING CSS LABELS */}
          {labels.edu.visible && (
            <div 
              style={{ position: "absolute", left: labels.edu.x, top: labels.edu.y }}
              className="pointer-events-none -translate-x-1/2 -translate-y-full mb-3"
            >
              <div 
                onClick={() => setSelectedChar("edu")}
                className="pointer-events-auto bg-black/90 backdrop-blur-md border border-[#00d1ff]/40 px-3 py-1.5 rounded-full shadow-[0_4px_12px_rgba(0,209,255,0.15)] flex items-center gap-2 hover:scale-105 transition-transform duration-200 cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-[#00d1ff] animate-pulse" />
                <span className="text-[10px] font-bold font-mono tracking-wide text-white uppercase">EDU (Art Director)</span>
              </div>
              <div className="w-px h-6 bg-[#00d1ff]/40 mx-auto" />
            </div>
          )}

          {labels.ingrid.visible && (
            <div 
              style={{ position: "absolute", left: labels.ingrid.x, top: labels.ingrid.y }}
              className="pointer-events-none -translate-x-1/2 -translate-y-full mb-3"
            >
              <div 
                onClick={() => setSelectedChar("ingrid")}
                className="pointer-events-auto bg-black/90 backdrop-blur-md border border-[#00E3FF]/40 px-3 py-1.5 rounded-full shadow-[0_4px_12px_rgba(0,227,255,0.15)] flex items-center gap-2 hover:scale-105 transition-transform duration-200 cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-[#00E3FF] animate-pulse" />
                <span className="text-[10px] font-bold font-mono tracking-wide text-white uppercase">INGRID (Leads Scraper)</span>
              </div>
              <div className="w-px h-6 bg-[#00E3FF]/40 mx-auto" />
            </div>
          )}

          {labels.oreo.visible && (
            <div 
              style={{ position: "absolute", left: labels.oreo.x, top: labels.oreo.y }}
              className="pointer-events-none -translate-x-1/2 -translate-y-full mb-3"
            >
              <div 
                onClick={() => setSelectedChar("oreo")}
                className="pointer-events-auto bg-black/90 backdrop-blur-md border border-[#FF9F00]/40 px-3 py-1.5 rounded-full shadow-[0_4px_12px_rgba(255,159,0,0.15)] flex items-center gap-2 hover:scale-105 transition-transform duration-200 cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-[#FF9F00] animate-pulse" />
                <span className="text-[10px] font-bold font-mono tracking-wide text-white uppercase">OREO 🐈 (Emails & Support)</span>
              </div>
              <div className="w-px h-6 bg-[#FF9F00]/40 mx-auto" />
            </div>
          )}
        </div>

        {/* Right side Dashboard Control panel */}
        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-[#111] bg-[#070707] flex flex-col overflow-y-auto shrink-0 p-6 space-y-6">
          
          {/* Card: Selected character specs */}
          {selectedChar && (
            <div className="bg-[#0b0b0b] rounded-2xl border border-white/5 p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent to-white/[0.02] rounded-bl-full pointer-events-none" />
              
              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="w-14 h-14 rounded-full border-2 shrink-0 relative bg-black/40 flex items-center justify-center"
                  style={{ borderColor: TEAM_ROLES[selectedChar].color }}
                >
                  {selectedChar === "oreo" ? (
                    <Cat className="w-7 h-7 text-[#FF9F00]" />
                  ) : selectedChar === "edu" ? (
                    <User className="w-7 h-7 text-[#00d1ff]" />
                  ) : (
                    <User className="w-7 h-7 text-[#00E3FF]" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white leading-none">{TEAM_ROLES[selectedChar].name}</h3>
                  <span className="text-[10px] font-bold font-mono tracking-widest uppercase mt-1 inline-block" style={{ color: TEAM_ROLES[selectedChar].color }}>
                    {TEAM_ROLES[selectedChar].role}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed font-normal mb-5">
                {TEAM_ROLES[selectedChar].desc}
              </p>
            </div>
          )}

          {/* Quick Team Status overview */}
          <div className="bg-[#0b0b0b] rounded-2xl border border-white/5 p-5 space-y-4">
            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">ESTADO DA EQUIPE</div>
            <div className="space-y-3">
              {Object.entries(TEAM_ROLES).map(([key, char]) => (
                <div 
                  key={key}
                  onClick={() => setSelectedChar(key as any)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${selectedChar === key ? "bg-white/5 border-white/10" : "border-transparent hover:bg-white/5"}`}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full border shrink-0 bg-black/40 flex items-center justify-center" 
                      style={{ borderColor: char.color }}
                    >
                      {key === "oreo" ? (
                        <Cat className="w-4 h-4 text-[#FF9F00]" />
                      ) : key === "edu" ? (
                        <User className="w-4 h-4 text-[#00d1ff]" />
                      ) : (
                        <User className="w-4 h-4 text-[#00E3FF]" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{char.name}</div>
                      <div className="text-[10px] text-gray-400 font-light truncate max-w-[130px]">{char.role}</div>
                    </div>
                  </div>
                  
                  <span className="text-[9px] font-mono px-2 py-1 rounded bg-black/40 text-gray-400 flex items-center gap-1.5 border border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: char.color }} />
                    {key === "oreo" && isEmailBurst ? "DISPARANDO" : 
                     key === "ingrid" && isScrapingActive ? "SCRAPING" :
                     key === "edu" && isEduFocus ? "REVISANDO" : "PRODUZINDO"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Console / Logs panel */}
          <div className="flex-1 flex flex-col bg-[#0b0b0b] rounded-2xl border border-white/5 p-5 overflow-hidden min-h-[160px]">
            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>CONSOLA DO ESCRITÓRIO</span>
              <span className="w-2 h-2 rounded-full bg-[#00d1ff]" />
            </div>
            <div className="flex-1 overflow-y-auto font-mono text-[10px] text-gray-400 space-y-2 select-text custom-scrollbar pr-1 leading-snug">
              {logs.map((log, idx) => (
                <div key={idx} className={`${idx === 0 ? "text-[#00d1ff] font-semibold" : "text-gray-400"}`}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
