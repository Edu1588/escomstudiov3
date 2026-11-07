import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Container e Setup
const container = document.getElementById("canvas-container") as HTMLElement;
const scene = new THREE.Scene();
scene.background = new THREE.Color("#080c12");
scene.fog = new THREE.FogExp2("#080c12", 0.045);

const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.4, 4.2);

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 0.95, 0);
controls.minDistance = 1.5;
controls.maxDistance = 8;
controls.maxPolarAngle = Math.PI / 2 + 0.05;

/* =========================================================================
   1. CRIAÇÃO DA TEXTURA DE DEGRAUS TOON (gradientMap)
   NearestFilter garante que o Three.js NÃO suavize as sombras, criando as
   faixas rígidas características de animes e ilustrações Cel Shading.
   ========================================================================= */
function criarRampaCelShading(etapas: number = 3): THREE.DataTexture {
  const valores = etapas === 2 ? [70, 255] : [50, 155, 255];
  const tons = new Uint8Array(valores);
  const grad = new THREE.DataTexture(tons, tons.length, 1, THREE.RedFormat);
  grad.minFilter = THREE.NearestFilter;
  grad.magFilter = THREE.NearestFilter;
  grad.generateMipmaps = false;
  grad.needsUpdate = true;
  return grad;
}

const toonRamp = criarRampaCelShading(3);

/* =========================================================================
   2. ILUMINAÇÃO CEL SHADING
   ========================================================================= */
const luzAmbiente = new THREE.AmbientLight("#475569", 0.85);
scene.add(luzAmbiente);

// Luz principal que projeta as bandas de sombra anime
const luzToon = new THREE.DirectionalLight("#fff4e6", 2.4);
luzToon.position.set(3, 4, 3);
luzToon.castShadow = true;
luzToon.shadow.mapSize.width = 1024;
luzToon.shadow.mapSize.height = 1024;
scene.add(luzToon);

// Contra-luz ciano característica da identidade visual da ESCOM
const luzCiano = new THREE.DirectionalLight("#38bdf8", 1.8);
luzCiano.position.set(-3, 2, -2.5);
scene.add(luzCiano);

// Indicador visual da luz
const luzHelper = new THREE.Mesh(
  new THREE.SphereGeometry(0.08, 16, 16),
  new THREE.MeshBasicMaterial({ color: 0xffe2b8 })
);
scene.add(luzHelper);

/* =========================================================================
   3. CHÃO MOLHADO REFLEXIVO COM GRID ANIME
   ========================================================================= */
const chaoGeo = new THREE.PlaneGeometry(30, 30);
const chaoMat = new THREE.MeshStandardMaterial({
  color: 0x070b10,
  roughness: 0.15,
  metalness: 0.65,
});
const chao = new THREE.Mesh(chaoGeo, chaoMat);
chao.rotation.x = -Math.PI / 2;
chao.position.y = -0.01;
chao.receiveShadow = true;
scene.add(chao);

// Grade sutil no chão
const grid = new THREE.GridHelper(20, 40, "#1e293b", "#0f172a");
grid.position.y = 0;
scene.add(grid);

// Sombra fake suave projetada sob os pés
const texSombra = (() => {
  const c = document.createElement("canvas"); c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(0,0,0,0.85)");
  g.addColorStop(0.5, "rgba(0,0,0,0.35)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
})();
const sombraPe = new THREE.Mesh(
  new THREE.PlaneGeometry(1.2, 0.8),
  new THREE.MeshBasicMaterial({ map: texSombra, transparent: true, depthWrite: false })
);
sombraPe.rotation.x = -Math.PI / 2;
sombraPe.position.set(0, 0.005, 0);
scene.add(sombraPe);

/* =========================================================================
   4. MATERIAIS CEL SHADING COM PALETA EXATA DO NOVO ROBÔ
   ========================================================================= */
const MAT_OUTLINE = new THREE.MeshBasicMaterial({
  color: 0x15100d,
  side: THREE.BackSide,
});

const matPeleRobo = new THREE.MeshToonMaterial({
  color: "#d8c3b4",
  gradientMap: toonRamp,
});

const matCamiseta = new THREE.MeshToonMaterial({
  color: "#f5d4bc",
  gradientMap: toonRamp,
});

const matBermuda = new THREE.MeshToonMaterial({
  color: "#372c28",
  gradientMap: toonRamp,
});

const matMetalMembros = new THREE.MeshToonMaterial({
  color: "#735c50",
  gradientMap: toonRamp,
});

const matFones = new THREE.MeshToonMaterial({
  color: "#967a68",
  gradientMap: toonRamp,
});

// Olhos Azuis Brilhantes (Cyan Glow Emissivo)
const matOlhos = new THREE.MeshBasicMaterial({
  color: "#38bdf8",
});

/* =========================================================================
   5. RECONSTRUÇÃO PROCEDURAL DO NOVO ROBÔ (Modelagem Cel Shading 3D)
   Baseada fielmente nas 3 vistas ortográficas (frente, lado, costas).
   ========================================================================= */
const grupoRobo = new THREE.Group();
const listaContornos: THREE.Mesh[] = [];

function criarPecaComContorno(geo: THREE.BufferGeometry, mat: THREE.Material, escalaOutline = 1.045): THREE.Group {
  const g = new THREE.Group();
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  g.add(mesh);

  const outline = new THREE.Mesh(geo, MAT_OUTLINE);
  outline.scale.setScalar(escalaOutline);
  g.add(outline);
  listaContornos.push(outline);

  return g;
}

// --- CABEÇA & FONES ---
const grupoCabeca = new THREE.Group();
grupoCabeca.position.set(0, 1.62, 0);

// Crânio/Rosto ovalado andróide
const geoCabeca = new THREE.SphereGeometry(0.18, 32, 24);
geoCabeca.scale(0.88, 1.15, 0.95);
const pecaCabeca = criarPecaComContorno(geoCabeca, matPeleRobo, 1.04);
grupoCabeca.add(pecaCabeca);

// Fone/Capacete traseiro
const geoCapacete = new THREE.SphereGeometry(0.182, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.55);
geoCapacete.rotateX(Math.PI);
geoCapacete.scale(0.89, 1.14, 0.94);
const pecaCapacete = criarPecaComContorno(geoCapacete, matFones, 1.035);
pecaCapacete.position.set(0, 0, -0.01);
grupoCabeca.add(pecaCapacete);

// Fones laterais cilíndricos com aletas traseiras
[-1, 1].forEach((lado) => {
  const fone = new THREE.Group();
  fone.position.set(lado * 0.17, 0.02, 0);

  // Almofada circular
  const geoCil = new THREE.CylinderGeometry(0.075, 0.075, 0.04, 24);
  geoCil.rotateZ(Math.PI / 2);
  const pecaCil = criarPecaComContorno(geoCil, matFones, 1.05);
  fone.add(pecaCil);

  // Aleta traseira estilizada (aponta para trás no eixo -Z como em lado.png)
  const aletaShape = new THREE.Shape();
  aletaShape.moveTo(0, -0.035);
  aletaShape.lineTo(-0.16, -0.01);
  aletaShape.lineTo(-0.14, 0.04);
  aletaShape.lineTo(0, 0.035);
  aletaShape.closePath();

  const aletaGeo = new THREE.ExtrudeGeometry(aletaShape, { depth: 0.02, bevelEnabled: false });
  aletaGeo.rotateY(lado > 0 ? 0.25 : -0.25);
  aletaGeo.translate(lado * 0.01, 0, -0.06);
  const pecaAleta = criarPecaComContorno(aletaGeo, matFones, 1.04);
  fone.add(pecaAleta);

  grupoCabeca.add(fone);
});

// Olhos Azuis Ciano Emissivos (Neon)
[-1, 1].forEach((lado) => {
  const geoOlho = new THREE.CapsuleGeometry(0.018, 0.036, 4, 12);
  geoOlho.rotateZ(Math.PI / 2);
  const meshOlho = new THREE.Mesh(geoOlho, matOlhos);
  meshOlho.position.set(lado * 0.065, 0.02, 0.158);
  grupoCabeca.add(meshOlho);
});

// Pequena luz pontual suave para emitir o brilho azul nos olhos
const luzOlhos = new THREE.PointLight("#38bdf8", 0.25, 0.4, 2);
luzOlhos.position.set(0, 0.02, 0.18);
grupoCabeca.add(luzOlhos);

grupoRobo.add(grupoCabeca);

// --- PESCOÇO MECÂNICO ARTICULADO ---
const geoPescoco = new THREE.CylinderGeometry(0.045, 0.055, 0.16, 16);
const pecaPescoco = criarPecaComContorno(geoPescoco, matMetalMembros, 1.06);
pecaPescoco.position.set(0, 1.48, -0.015);
grupoRobo.add(pecaPescoco);

// --- CAMISETA OVERSIZED ---
const grupoTronco = new THREE.Group();
grupoTronco.position.set(0, 1.15, 0);

// Corpo da camiseta solta (formato trapezoidal suave)
const geoCamiseta = new THREE.CylinderGeometry(0.24, 0.34, 0.52, 24);
geoCamiseta.scale(1.05, 1.0, 0.75);
const pecaCamiseta = criarPecaComContorno(geoCamiseta, matCamiseta, 1.035);
grupoTronco.add(pecaCamiseta);

// Gola redonda
const geoGola = new THREE.TorusGeometry(0.12, 0.025, 12, 24);
geoGola.rotateX(Math.PI / 2);
const pecaGola = criarPecaComContorno(geoGola, matCamiseta, 1.05);
pecaGola.position.set(0, 0.26, -0.01);
grupoTronco.add(pecaGola);

// Mangas volumosas e dobradas (oversized)
const ombros: { lado: number; g: THREE.Group }[] = [];
[-1, 1].forEach((lado) => {
  const gOmbro = new THREE.Group();
  gOmbro.position.set(lado * 0.28, 0.18, 0);

  // Manga caída ao lado do corpo
  const geoManga = new THREE.CylinderGeometry(0.11, 0.14, 0.32, 16);
  geoManga.rotateZ(-lado * 0.16);
  const pecaManga = criarPecaComContorno(geoManga, matCamiseta, 1.04);
  pecaManga.position.set(lado * 0.04, -0.12, 0);
  gOmbro.add(pecaManga);

  // Dobra da manga
  const geoDobra = new THREE.TorusGeometry(0.12, 0.03, 12, 20);
  geoDobra.rotateX(Math.PI / 2);
  geoDobra.rotateZ(-lado * 0.16);
  const pecaDobra = criarPecaComContorno(geoDobra, matCamiseta, 1.04);
  pecaDobra.position.set(lado * 0.07, -0.26, 0);
  gOmbro.add(pecaDobra);

  // Braço mecânico saindo da manga
  const geoBraco = new THREE.CylinderGeometry(0.032, 0.03, 0.28, 12);
  const pecaBraco = criarPecaComContorno(geoBraco, matMetalMembros, 1.06);
  pecaBraco.position.set(lado * 0.08, -0.38, 0);
  gOmbro.add(pecaBraco);

  // Articulação de pulso
  const geoPulso = new THREE.SphereGeometry(0.034, 12, 12);
  const pecaPulso = criarPecaComContorno(geoPulso, matMetalMembros, 1.06);
  pecaPulso.position.set(lado * 0.08, -0.52, 0);
  gOmbro.add(pecaPulso);

  // Mão robótica estendida
  const geoMao = new THREE.BoxGeometry(0.035, 0.09, 0.06);
  const pecaMao = criarPecaComContorno(geoMao, matMetalMembros, 1.06);
  pecaMao.position.set(lado * 0.08, -0.58, 0);
  gOmbro.add(pecaMao);

  grupoTronco.add(gOmbro);
  ombros.push({ lado, g: gOmbro });
});

grupoRobo.add(grupoTronco);

// --- BERMUDA CARGO MARROM ESCURA ---
const grupoBermuda = new THREE.Group();
grupoBermuda.position.set(0, 0.78, 0);

// Cinto / Cintura
const geoCintura = new THREE.CylinderGeometry(0.28, 0.31, 0.18, 24);
geoCintura.scale(1.0, 1.0, 0.72);
grupoBermuda.add(criarPecaComContorno(geoCintura, matBermuda, 1.035));

// Pernas da bermuda (largas com corte reto)
[-1, 1].forEach((lado) => {
  const geoPernaShorts = new THREE.CylinderGeometry(0.14, 0.165, 0.22, 20);
  geoPernaShorts.scale(1.0, 1.0, 0.85);
  const pecaPerna = criarPecaComContorno(geoPernaShorts, matBermuda, 1.035);
  pecaPerna.position.set(lado * 0.13, -0.15, 0);
  grupoBermuda.add(pecaPerna);
});

grupoRobo.add(grupoBermuda);

// --- PERNAS MECÂNICAS & PÉS ANDRÓIDES ---
const pernas: { lado: number; coxa: THREE.Group; canela: THREE.Group }[] = [];
[-1, 1].forEach((lado) => {
  const gCoxa = new THREE.Group();
  gCoxa.position.set(lado * 0.13, 0.58, 0);

  // Coxa mecânica
  const geoCoxa = new THREE.CylinderGeometry(0.042, 0.046, 0.18, 16);
  const pecaCoxa = criarPecaComContorno(geoCoxa, matMetalMembros, 1.06);
  pecaCoxa.position.set(0, -0.08, 0);
  gCoxa.add(pecaCoxa);

  // Joelho articulado esférico
  const geoJoelho = new THREE.SphereGeometry(0.052, 16, 16);
  const pecaJoelho = criarPecaComContorno(geoJoelho, matMetalMembros, 1.06);
  pecaJoelho.position.set(0, -0.18, 0);
  gCoxa.add(pecaJoelho);

  // Canela andróide alongada
  const gCanela = new THREE.Group();
  gCanela.position.set(0, -0.18, 0);

  const geoCanela = new THREE.CylinderGeometry(0.046, 0.035, 0.36, 16);
  const pecaCanela = criarPecaComContorno(geoCanela, matMetalMembros, 1.06);
  pecaCanela.position.set(0, -0.18, 0);
  gCanela.add(pecaCanela);

  // Tornozelo
  const geoTornozelo = new THREE.SphereGeometry(0.04, 14, 14);
  const pecaTornozelo = criarPecaComContorno(geoTornozelo, matMetalMembros, 1.06);
  pecaTornozelo.position.set(0, -0.36, 0);
  gCanela.add(pecaTornozelo);

  // Pé chanfrado estilizado
  const geoPe = new THREE.BoxGeometry(0.08, 0.055, 0.18);
  const pecaPe = criarPecaComContorno(geoPe, matMetalMembros, 1.06);
  pecaPe.position.set(0, -0.39, 0.04);
  gCanela.add(pecaPe);

  gCoxa.add(gCanela);
  grupoRobo.add(gCoxa);

  pernas.push({ lado, coxa: gCoxa, canela: gCanela });
});

scene.add(grupoRobo);

/* =========================================================================
   6. MODO TRI-PLANAR (MODEL SHEET ORIGINAL DAS 3 IMAGENS PNG)
   ========================================================================= */
const grupoTriPlanar = new THREE.Group();
grupoTriPlanar.visible = false;
scene.add(grupoTriPlanar);

const texLoader = new THREE.TextureLoader();
function carregarPlanoOrtografico(url: string, pos: THREE.Vector3, rotY: number) {
  texLoader.load(url, (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    const aspect = tex.image.width / tex.image.height;
    const altura = 1.9;
    const largura = altura * aspect;
    const planeGeo = new THREE.PlaneGeometry(largura, altura);
    const planeMat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.position.copy(pos);
    mesh.rotation.y = rotY;
    grupoTriPlanar.add(mesh);
  });
}

// Três planos ortogonais no espaço 3D (Frente, Lado, Costas)
carregarPlanoOrtografico("/models/NOVO_ROBO/frente.png", new THREE.Vector3(0, 0.95, 0), 0);
carregarPlanoOrtografico("/models/NOVO_ROBO/lado.png", new THREE.Vector3(0, 0.95, 0), Math.PI / 2);
carregarPlanoOrtografico("/models/NOVO_ROBO/costas.png", new THREE.Vector3(0, 0.95, 0), Math.PI);

/* =========================================================================
   7. INTERATIVIDADE & CONTROLES DA INTERFACE
   ========================================================================= */
let modoExibicao: "3d" | "sheet" = "3d";
let modoAnimacao: "float" | "orbit" = "float";
let contornoAtivo = true;
let anguloLuz = 45;

const btnMode3d = document.getElementById("btn-mode-3d")!;
const btnModeSheet = document.getElementById("btn-mode-sheet")!;
const btnOutlineOn = document.getElementById("btn-outline-on")!;
const btnOutlineOff = document.getElementById("btn-outline-off")!;
const btnAnimFloat = document.getElementById("btn-anim-float")!;
const btnAnimOrbit = document.getElementById("btn-anim-orbit")!;
const lightSlider = document.getElementById("light-slider") as HTMLInputElement;
const lightAngleVal = document.getElementById("light-angle-val")!;

btnMode3d.addEventListener("click", () => {
  modoExibicao = "3d";
  btnMode3d.classList.add("active");
  btnModeSheet.classList.remove("active");
  grupoRobo.visible = true;
  grupoTriPlanar.visible = false;
});

btnModeSheet.addEventListener("click", () => {
  modoExibicao = "sheet";
  btnModeSheet.classList.add("active");
  btnMode3d.classList.remove("active");
  grupoRobo.visible = false;
  grupoTriPlanar.visible = true;
});

btnOutlineOn.addEventListener("click", () => {
  contornoAtivo = true;
  btnOutlineOn.classList.add("active");
  btnOutlineOff.classList.remove("active");
  listaContornos.forEach((o) => (o.visible = true));
});

btnOutlineOff.addEventListener("click", () => {
  contornoAtivo = false;
  btnOutlineOff.classList.add("active");
  btnOutlineOn.classList.remove("active");
  listaContornos.forEach((o) => (o.visible = false));
});

btnAnimFloat.addEventListener("click", () => {
  modoAnimacao = "float";
  btnAnimFloat.classList.add("active");
  btnAnimOrbit.classList.remove("active");
});

btnAnimOrbit.addEventListener("click", () => {
  modoAnimacao = "orbit";
  btnAnimOrbit.classList.add("active");
  btnAnimFloat.classList.remove("active");
});

lightSlider.addEventListener("input", (e) => {
  anguloLuz = Number((e.target as HTMLInputElement).value);
  lightAngleVal.textContent = `${anguloLuz}°`;
  atualizarPosicaoLuz();
});

function atualizarPosicaoLuz() {
  const rad = (anguloLuz * Math.PI) / 180;
  const raio = 4.5;
  const x = Math.cos(rad) * raio;
  const z = Math.sin(rad) * raio;
  luzToon.position.set(x, 4.0, z);
  luzHelper.position.copy(luzToon.position);
}
atualizarPosicaoLuz();

// Atalhos para as vistas do model sheet
document.getElementById("view-front")?.addEventListener("click", () => {
  camera.position.set(0, 1.1, 3.8);
  controls.target.set(0, 0.95, 0);
});
document.getElementById("view-side")?.addEventListener("click", () => {
  camera.position.set(3.8, 1.1, 0);
  controls.target.set(0, 0.95, 0);
});
document.getElementById("view-back")?.addEventListener("click", () => {
  camera.position.set(0, 1.1, -3.8);
  controls.target.set(0, 0.95, 0);
});

/* =========================================================================
   8. LOOP DE ANIMAÇÃO & RENDERIZAÇÃO
   ========================================================================= */
const clock = new THREE.Clock();
let frames = 0, ultimoTempoFps = performance.now();
const fpsEl = document.getElementById("fps-counter");

function animar() {
  requestAnimationFrame(animar);

  const t = clock.getElapsedTime();
  const dt = clock.getDelta();

  // Contador de FPS
  frames++;
  const agora = performance.now();
  if (agora - ultimoTempoFps >= 500) {
    if (fpsEl) fpsEl.textContent = `${Math.round((frames * 1000) / (agora - ultimoTempoFps))} FPS`;
    frames = 0;
    ultimoTempoFps = agora;
  }

  // Pulso emissivo nos olhos ciano neon
  const pulsoOlhos = 0.85 + Math.sin(t * 3.5) * 0.15;
  matOlhos.color.setRGB(0.22 * pulsoOlhos, 0.74 * pulsoOlhos, 0.97 * pulsoOlhos);
  luzOlhos.intensity = 0.5 * pulsoOlhos;

  // Cinemática orgânica do robô
  if (modoAnimacao === "float") {
    // Flutuação leve e respiração senoidal
    const flutuaY = Math.sin(t * 1.6) * 0.035;
    grupoRobo.position.y = flutuaY;
    grupoTriPlanar.position.y = flutuaY;

    // Sombra no chão se expande/contrai com a altura
    sombraPe.scale.setScalar(1 - flutuaY * 2.5);

    // Respiração sutil no peito
    grupoTronco.scale.set(1 + Math.sin(t * 1.8) * 0.012, 1, 1 + Math.sin(t * 1.8) * 0.015);

    // Leve oscilação natural dos braços
    ombros.forEach(({ lado, g }) => {
      g.rotation.z = Math.sin(t * 1.4 + lado) * 0.035;
      g.rotation.x = Math.sin(t * 1.2) * 0.025;
    });

    // Cabeça altiva olha sutilmente em antecipação
    grupoCabeca.rotation.y = Math.sin(t * 0.7) * 0.06;
    grupoCabeca.rotation.x = Math.sin(t * 1.4) * 0.025;
  } else if (modoAnimacao === "orbit") {
    // Giro contínuo para apresentação em 360°
    grupoRobo.rotation.y += 0.012;
    grupoTriPlanar.rotation.y += 0.012;
  }

  controls.update();
  renderer.render(scene, camera);
}

animar();

// Redimensionamento responsivo
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
