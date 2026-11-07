/*
 * Cena 3D do HERO (a partir de 20/10/2026): o robô agachado dentro de um galpão, com o chão molhado refletindo
 * o robô. Substitui a floresta (cenaFloresta.ts continua no projeto, sem uso).
 *
 * Galpão: public/models/hero/galpao.glb = "burnout revenge - garage (ps2/xbox)", Sketchfab, autor
 * amogusstrikesback2, marcado CC BY 4.0 (crédito no rodapé do HERO). Aviso registrado no diário: é um cenário
 * extraído do jogo Burnout Revenge (EA); o dono decidiu usar mesmo assim.
 * Borboleta: a do "Lost robot" (Mikita_Hubanau, CC BY 4.0), carregada pelos moldes compartilhados.
 *
 * - A borboleta azul segue o mouse e a cabeça do robô também; mouse sobre o robô, parado por 4 s ou fora da
 *   janela: ela pousa no dedo, virada para ele, e o olho azul acende um pouco mais.
 * - Sem névoa nem fumaça (pedido do dono). Chão molhado: espelho (Reflector) com shader próprio que mistura o
 *   reflexo ao piso, com poças e uma leve ondulação, sumindo nas bordas.
 * - Rolagem (0..1 vindo do GSAP): o robô vira o rosto para a frente e a câmera mergulha no olho dele.
 *
 * Unidades: o galpão vem em escala 0,01 e é ampliado 100x (chão em y = 0, salão de ~40 x 18 x 40).
 * O robô tem 1,25 de escala (~1,2 de altura agachado). A borboleta e a purpurina usam a mesma proporção.
 */
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Reflector } from "three/examples/jsm/objects/Reflector.js";
import { carregarMoldes, criarBorboleta, criarPurpurina, criarRobo, texturaRadial, clamp, lerp, suave, type Moldes } from "./roboCompartilhado";
import type { OpcoesCena, CenaFloresta } from "./cenaFloresta";

export const URL_GALPAO = "/models/hero/galpao.glb";

/** Escala do robô e proporção para tudo que foi calibrado na floresta (onde o robô tinha escala 30). */
const ESCALA_ROBO = 1.25;
const K = ESCALA_ROBO / 30;

/** Chão molhado: reflexo misturado ao piso, com poças, ondulação leve e borda que some. */
export const SHADER_CHAO_MOLHADO = {
  name: "ChaoMolhado",
  uniforms: {
    color: { value: null },
    tDiffuse: { value: null },
    textureMatrix: { value: null },
    opacidade: { value: 0.58 },
    raio: { value: 0.5 },
    tempo: { value: 0 },
  },
  vertexShader: /* glsl */ `
    uniform mat4 textureMatrix; varying vec4 vUvR; varying vec2 vUv;
    void main(){ vUv = uv; vUvR = textureMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: /* glsl */ `
    uniform vec3 color; uniform sampler2D tDiffuse; uniform float opacidade; uniform float raio; uniform float tempo;
    varying vec4 vUvR; varying vec2 vUv;
    float ruido(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    float suave(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
      return mix(mix(ruido(i), ruido(i + vec2(1, 0)), f.x), mix(ruido(i + vec2(0, 1)), ruido(i + vec2(1, 1)), f.x), f.y); }
    void main(){
      vec2 d = vec2(suave(vUv * 60.0 + tempo * 0.15), suave(vUv * 60.0 + 7.3 - tempo * 0.1)) - 0.5;   // água: distorce de leve
      vec4 uvr = vUvR; uvr.xy += d * 0.012 * uvr.w;
      vec3 refl = texture2DProj(tDiffuse, uvr).rgb * color;
      float poca = smoothstep(0.35, 0.75, suave(vUv * 6.0));                                          // partes mais molhadas
      float borda = 1.0 - smoothstep(raio * 0.55, raio, distance(vUv, vec2(0.5)));
      gl_FragColor = vec4(refl, opacidade * borda * mix(0.45, 1.0, poca));
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`,
};

/**
 * Retoque de cor e luz do galpão (pedido do dono, 20/10/2026): o original é sépia e chapado (textura com luz
 * pintada, material "unlit"). Aqui, no shader de cada material: tira parte da saturação e esfria para um azul
 * noturno; as partes claras (janelas, vãos) ganham brilho ciano da marca; uma poça de luz quente em volta do
 * robô e o resto escurece com a distância e com a altura (teto some no escuro).
 */
export function gradarGalpao(galpao: THREE.Object3D, centro: THREE.Vector3) {
  const feitos = new Set<THREE.Material>();
  galpao.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh || !m.visible) return;
    for (const mat of Array.isArray(m.material) ? m.material : [m.material]) {
      if (feitos.has(mat)) continue;
      feitos.add(mat);
      mat.onBeforeCompile = (sh) => {
        sh.uniforms.uCentro = { value: centro };
        sh.vertexShader = sh.vertexShader
          .replace("#include <common>", "#include <common>\nvarying vec3 vMundo;")
          .replace("#include <project_vertex>", "#include <project_vertex>\nvMundo = (modelMatrix * vec4(transformed, 1.0)).xyz;");
        sh.fragmentShader = sh.fragmentShader
          .replace("#include <common>", "#include <common>\nvarying vec3 vMundo;\nuniform vec3 uCentro;")
          .replace("#include <map_fragment>", `#include <map_fragment>
            {
              vec3 c = diffuseColor.rgb;
              float lum = dot(c, vec3(0.2126, 0.7152, 0.0722));
              vec3 frio = mix(vec3(lum), c, 0.45) * vec3(0.72, 0.88, 1.08);           // menos sépia, mais azul
              frio += smoothstep(0.32, 0.75, lum) * vec3(0.05, 0.32, 0.45);           // janelas e vãos em ciano
              float d = distance(vMundo.xz, uCentro.xz);
              float poca = exp(-d * d / 30.0);                                         // luz em volta do robô
              frio = mix(frio, frio * vec3(1.25, 1.08, 0.9), poca * 0.6);              // um toque quente perto dele
              frio *= 0.5 + 0.75 * poca;                                               // longe escurece
              frio *= mix(1.0, 0.55, smoothstep(2.5, 9.0, vMundo.y));                  // teto no escuro
              diffuseColor.rgb = frio;
            }`);
      };
      mat.customProgramCacheKey = () => "galpaoGradado";
      mat.needsUpdate = true;
    }
  });
}

/** Monta a cena dentro de `container` (que deve ter tamanho definido por CSS). Mesmo contrato da floresta. */
export function montarCenaGalpao(container: HTMLElement, opcoes: OpcoesCena = {}): CenaFloresta {
  const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const celular = window.innerWidth < 768;
  const descartaveis: { dispose: () => void }[] = [];
  const limpezas: (() => void)[] = [];
  let destruida = false;

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, celular ? 1.25 : 1.6));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;filter:saturate(1.12) contrast(1.06)";
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#0b1016");          // noite: aparece pelas aberturas e furos do telhado

  const LUGAR = new THREE.Vector3(-2, 0, 2.5);
  const CAM = new THREE.Vector3(0.4, 0.95, 0.1);
  const ALVO = new THREE.Vector3(LUGAR.x, 0.5, LUGAR.z);
  const CAM_BASE = CAM.clone();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.02, 200);
  const desvio = { x: 0, y: 0 };
  camera.position.copy(CAM);
  camera.lookAt(ALVO);

  // luz só para o robô (o galpão é "unlit", com a luz pintada na textura): quente de cima, ciano de contorno
  scene.add(new THREE.HemisphereLight("#c9d6e8", "#1a1410", 1.4));
  const chave = new THREE.DirectionalLight("#ffe2b8", 2.2); chave.position.set(-4, 6, 3); scene.add(chave);
  const contra = new THREE.DirectionalLight("#5fd0ff", 1.6); contra.position.set(3, 3, -4); scene.add(contra);

  let resolverPronta!: () => void, rejeitarPronta!: (e: unknown) => void;
  const pronta = new Promise<void>((res, rej) => { resolverPronta = res; rejeitarPronta = rej; });

  // galpão (próprio) + moldes do robô e da borboleta (compartilhados); progresso somado
  let pctMoldes = 0, pctGalpao = 0;
  const informar = () => opcoes.onProgress?.(Math.min(95, Math.round(pctMoldes * 0.85 + pctGalpao * 0.15)));
  const galpaoP = new Promise<THREE.Group>((res, rej) =>
    new GLTFLoader().load(URL_GALPAO, (g) => res(g.scene), (ev) => { if (ev.lengthComputable && ev.total) { pctGalpao = (ev.loaded / ev.total) * 100; informar(); } }, rej));
  Promise.all([carregarMoldes((p) => { pctMoldes = (p / 95) * 100; informar(); }), galpaoP])
    .then(([m, g]) => { if (!destruida) iniciar(m, g); })
    .catch((e) => { opcoes.onProgress?.(100); rejeitarPronta(e); });

  function iniciar(moldes: Moldes, galpao: THREE.Group) {
    const _p = new THREE.Vector3(), _v = new THREE.Vector3();

    /* ---------- galpão ---------- */
    galpao.scale.multiplyScalar(100);
    // Limpeza de entulhos, telhas e sobras do jogo para visão ampla e arquitetônica
    galpao.traverse((o) => {
      if (/mdl_001|^unit|backdrop_grp_00[0-5]|backdrop_grp_009|backdrop_grp_01[0-9]/i.test(o.name)) {
        o.visible = false;
      }
    });
    gradarGalpao(galpao, LUGAR);
    scene.add(galpao);
    galpao.updateMatrixWorld(true);

    /* ---------- robô ---------- */
    const robo = criarRobo(moldes.robo);
    descartaveis.push(robo);
    const R = robo.R;
    R.scale.setScalar(ESCALA_ROBO);
    R.position.copy(LUGAR);
    R.rotation.y = Math.atan2(CAM.x - LUGAR.x, CAM.z - LUGAR.z) - 0.6;   // 3/4 para a câmera, dedo de perfil
    scene.add(R);
    R.updateMatrixWorld(true);
    { const b = new THREE.Box3().setFromObject(R); R.position.y -= b.min.y + 0.004; R.updateMatrixWorld(true); }   // pés no chão (y = 0)
    const CAIXA_ROBO = new THREE.Box3().setFromObject(R);
    const CENTRO_ROBO = CAIXA_ROBO.getCenter(new THREE.Vector3());

    /* ---------- chão molhado com reflexo ---------- */
    const tamEspelho = celular ? 512 : 1024;
    const espelho = new Reflector(new THREE.PlaneGeometry(12, 12), {
      textureWidth: tamEspelho, textureHeight: tamEspelho, color: 0xa8b4c0, clipBias: 0.003, shader: SHADER_CHAO_MOLHADO,
    });
    const matEspelho = espelho.material as THREE.ShaderMaterial;
    matEspelho.transparent = true;
    matEspelho.depthWrite = false;
    espelho.rotation.x = -Math.PI / 2;
    espelho.position.set(LUGAR.x, 0.006, LUGAR.z);
    scene.add(espelho);
    descartaveis.push(espelho.geometry, matEspelho, { dispose: () => espelho.dispose() });

    /* ---------- sombra de contato (o galpão não recebe sombra real) ---------- */
    const texSombra = texturaRadial([[0, "rgba(0,0,0,.85)"], [0.45, "rgba(0,0,0,.45)"], [1, "rgba(0,0,0,0)"]]);
    const sombra = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: texSombra, transparent: true, depthWrite: false, opacity: 0.75, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 }));
    sombra.rotation.x = -Math.PI / 2;
    sombra.position.set(CENTRO_ROBO.x, 0.012, CENTRO_ROBO.z);
    sombra.scale.set(0.9, 0.62, 1);
    sombra.renderOrder = 2;
    scene.add(sombra);
    descartaveis.push(texSombra, sombra.geometry, sombra.material as THREE.Material);

    /* ---------- borboleta + purpurina ---------- */
    const borboleta = criarBorboleta(moldes, K, scene, reduzir);
    const purpurina = criarPurpurina(scene, K, reduzir);
    descartaveis.push(borboleta, purpurina);
    const dedo = new THREE.Vector3();
    const pontoDoDedo = (t: number) => {
      dedo.copy(robo.pousoLocal).applyMatrix4(R.matrixWorld);
      dedo.y += (0.35 + (reduzir ? 0 : Math.sin(t * 1.3) * 0.06)) * K;
      return dedo;
    };
    pontoDoDedo(0);
    const RUMO_DEDO = (() => { const d = robo.cabeca.getWorldPosition(new THREE.Vector3()).sub(dedo).setY(0); return Math.atan2(d.x, d.z); })();

    /* ---------- ponteiro ---------- */
    const ponteiro = { x: 0, y: 0, ativo: false, ultimo: -99 };
    const aoMover = (e: PointerEvent) => { ponteiro.x = e.clientX; ponteiro.y = e.clientY; ponteiro.ativo = true; ponteiro.ultimo = performance.now() / 1000; };
    const aoSair = () => { ponteiro.ativo = false; };
    window.addEventListener("pointermove", aoMover, { passive: true });
    window.addEventListener("pointerdown", aoMover, { passive: true });
    document.documentElement.addEventListener("pointerleave", aoSair);
    limpezas.push(() => {
      window.removeEventListener("pointermove", aoMover);
      window.removeEventListener("pointerdown", aoMover);
      document.documentElement.removeEventListener("pointerleave", aoSair);
    });
    const _ndc = new THREE.Vector2(), _ray = new THREE.Raycaster(), _c = new THREE.Vector3();
    const DIST = CAM.distanceTo(CENTRO_ROBO);
    const ponteiroNoMundo = (alvo: THREE.Vector3) => {
      const r = container.getBoundingClientRect();
      _ndc.set(((ponteiro.x - r.left) / r.width) * 2 - 1, -((ponteiro.y - r.top) / r.height) * 2 + 1);
      _ray.setFromCamera(_ndc, camera);
      alvo.copy(_ray.ray.origin).addScaledVector(_ray.ray.direction, DIST * 0.92);
      alvo.y = clamp(alvo.y, CENTRO_ROBO.y - 4 * K, CENTRO_ROBO.y + 3);
      return alvo;
    };
    const CANTOS: THREE.Vector3[] = [];
    for (const x of [CAIXA_ROBO.min.x, CAIXA_ROBO.max.x]) for (const y of [CAIXA_ROBO.min.y, CAIXA_ROBO.max.y]) for (const z of [CAIXA_ROBO.min.z, CAIXA_ROBO.max.z]) CANTOS.push(new THREE.Vector3(x, y, z));
    const ponteiroSobreRobo = () => {
      const r = container.getBoundingClientRect();
      let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      for (const c of CANTOS) {
        _c.copy(c).project(camera);
        const sx = r.left + ((_c.x + 1) / 2) * r.width, sy = r.top + ((1 - _c.y) / 2) * r.height;
        x0 = Math.min(x0, sx); x1 = Math.max(x1, sx); y0 = Math.min(y0, sy); y1 = Math.max(y1, sy);
      }
      const px = (x1 - x0) * 0.06, py = (y1 - y0) * 0.06;
      return ponteiro.x > x0 + px && ponteiro.x < x1 - px && ponteiro.y > y0 + py && ponteiro.y < y1 - py;
    };

    /* ---------- laço ---------- */
    const timer = new THREE.Timer();
    timer.connect(document);
    const camAlvo = new THREE.Vector3(), alvoB = new THREE.Vector3(), mundoMouse = new THREE.Vector3(), olhar = new THREE.Vector3();
    const olho = new THREE.Vector3(), mira = new THREE.Vector3(), perto = new THREE.Vector3(), praCam = new THREE.Vector3();
    let brilhoOlho = 0, offAnt = NaN;
    const quadro = () => {
      timer.update();
      const dt = Math.min(timer.getDelta(), 0.05), t = timer.getElapsed(), agora = performance.now() / 1000;
      if (!reduzir) matEspelho.uniforms.tempo.value = t;

      // rolagem: 0..0,3 vira o rosto para a câmera; 0,22..1 a câmera mergulha no olho
      const rol = clamp(opcoes.rolagem?.current ?? 0, 0, 1);
      const kOlhar = suave(0.01, 0.28, rol);
      const kZoom = suave(0.22, 1, rol) ** 1.6;

      // borboleta: segue o mouse; pousa no dedo se o mouse está sobre o robô, parado, fora — ou se a página rolou
      pontoDoDedo(t);
      const mexeu = ponteiro.ativo && agora - ponteiro.ultimo < 4;
      const segue = mexeu && !reduzir && rol < 0.02 && !ponteiroSobreRobo();
      if (segue) {
        ponteiroNoMundo(mundoMouse);
        alvoB.copy(mundoMouse);
        alvoB.x += Math.sin(t * 2.1) * 2.2 * K; alvoB.y += Math.sin(t * 3.3) * 1.6 * K; alvoB.z += Math.cos(t * 1.7) * 1.8 * K;
      } else alvoB.copy(dedo);
      const pousando = segue ? 0 : clamp(1 - borboleta.pos.distanceTo(dedo) / (12 * K), 0, 1);
      praCam.copy(camera.position).sub(borboleta.pos).setY(0).normalize();
      borboleta.atualizar(dt, alvoB, segue ? 3.2 : 4.2, pousando, RUMO_DEDO, praCam);
      purpurina.atualizar(dt, t, borboleta.pos, borboleta.vel, pousando);

      // cabeça: mouse ou borboleta; com a rolagem, vira para a câmera
      olhar.copy(segue ? mundoMouse : borboleta.pos).lerp(camera.position, kOlhar);
      robo.olharPara(olhar, dt, 6 + kOlhar * 4);
      brilhoOlho = lerp(brilhoOlho, Math.max(pousando > 0.85 ? 1 : 0, kZoom * 1.4), 1 - Math.exp(-dt * 2.5));
      // reta final da rolagem: o brilho do olho cresce e cobre a textura (que é de baixa resolução no modelo)
      robo.acenderOlho(clamp(brilhoOlho, 0, 1.4), t, suave(0.62, 0.98, rol));

      // câmera: paralaxe com o mouse; com a rolagem, vai do enquadramento normal até perto do olho
      const r = container.getBoundingClientRect();
      const mx = ponteiro.ativo ? ((ponteiro.x - r.left) / r.width) * 2 - 1 : 0, my = ponteiro.ativo ? ((ponteiro.y - r.top) / r.height) * 2 - 1 : 0;
      robo.olhoNoMundo(olho);
      camAlvo.copy(CAM_BASE);
      camAlvo.x += mx * 0.16 * (1 - kZoom); camAlvo.y -= my * 0.08 * (1 - kZoom);
      if (kZoom > 0) {
        // para a 5,5 (na escala da floresta) do olho: o rosto enche a tela
        perto.copy(CAM_BASE).sub(olho).normalize().multiplyScalar(5.5 * K).add(olho);
        camAlvo.lerp(perto, kZoom);
      }
      camera.position.lerp(camAlvo, reduzir || kZoom > 0 ? 0.35 : 0.05);
      mira.copy(ALVO).lerp(olho, suave(0, 0.6, kZoom));
      camera.lookAt(mira);
      // o enquadramento deslocado (texto à esquerda) volta ao centro durante o zoom
      const off = 1 - suave(0, 0.5, kZoom);
      if (off !== offAnt) {
        const w = container.clientWidth || window.innerWidth, h = container.clientHeight || window.innerHeight;
        if (desvio.x || desvio.y) camera.setViewOffset(w, h, desvio.x * w * off, desvio.y * h * off, w, h);
        offAnt = off;
        camera.updateProjectionMatrix();
      }
      renderer.render(scene, camera);
    };

    const io = new IntersectionObserver(([e]) => renderer.setAnimationLoop(e.isIntersecting ? quadro : null));
    io.observe(container);
    limpezas.push(() => io.disconnect(), () => timer.dispose());
    reajustar = () => { offAnt = NaN; };

    ajustar();
    quadro();
    renderer.setAnimationLoop(quadro);
    opcoes.onProgress?.(100);
    resolverPronta();
  }

  // ---------- tamanho: texto à esquerda empurra o robô para a direita; em pé (celular), o robô sobe ----------
  let reajustar = () => {};
  function ajustar() {
    const w = container.clientWidth || window.innerWidth, h = container.clientHeight || window.innerHeight;
    camera.aspect = w / h;
    const retrato = camera.aspect < 0.8;
    camera.fov = retrato ? 54 : 38;
    // telas médias (tablet deitado, janela estreita): o texto ocupa quase toda a largura; o robô vai para a
    // borda direita e a câmera recua para ele ficar menor e não ficar atrás do título
    const medio = !retrato && camera.aspect < 1.6;
    desvio.x = retrato ? 0 : medio ? -0.37 : -0.19;
    desvio.y = retrato ? 0.13 : medio ? 0.04 : 0;
    camera.setViewOffset(w, h, desvio.x * w, desvio.y * h, w, h);
    CAM_BASE.copy(CAM).lerp(ALVO, retrato ? -0.1 : medio ? -0.22 : 0.08);
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    reajustar();
  }
  const ro = new ResizeObserver(ajustar);
  ro.observe(container);
  limpezas.push(() => ro.disconnect());

  return {
    pronta,
    destruir() {
      destruida = true;
      renderer.setAnimationLoop(null);
      limpezas.forEach((f) => f());
      descartaveis.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
