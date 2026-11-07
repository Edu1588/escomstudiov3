/*
 * Cena 3D do HERO: o robô agachado no cenário "Lost robot" (Mikita_Hubanau, Sketchfab, CC BY 4.0 — o crédito
 * precisa aparecer na página).
 *
 * - A borboleta azul segue o mouse e a cabeça do robô também. Mouse sobre o robô, parado por 4 s ou fora da
 *   janela: ela pousa no dedo, virada para ele, e o olho azul acende um pouco mais.
 * - Purpurina no bater de asas, névoa rasteira e, de tempos em tempos, um banco de névoa passando da direita
 *   para a esquerda.
 * - Rolagem (0..1 vindo do GSAP): o robô vira o rosto para a frente e a câmera mergulha no olho dele;
 *   a transição em pixels do HeroManifestoStage leva para a próxima seção.
 */
import * as THREE from "three";
import { carregarMoldes, criarBorboleta, criarPurpurina, criarRobo, texturaRadial, clamp, lerp, suave, NOME_BORBOLETA, type Moldes } from "./roboCompartilhado";

export interface OpcoesCena {
  /** carregamento de 0 a 100 */
  onProgress?: (pct: number) => void;
  /** progresso da rolagem do HERO, 0..1 (lido a cada quadro) */
  rolagem?: { current: number };
}

export interface CenaFloresta {
  /** resolve quando o primeiro quadro foi desenhado; rejeita se o WebGL ou os modelos falharem */
  pronta: Promise<void>;
  destruir: () => void;
}

/** Monta a cena dentro de `container` (que deve ter tamanho definido por CSS). */
export function montarCenaFloresta(container: HTMLElement, opcoes: OpcoesCena = {}): CenaFloresta {
  const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const descartaveis: { dispose: () => void }[] = [];
  const limpezas: (() => void)[] = [];
  let destruida = false;

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.25 : 1.6));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  // correção de cor: a cena pintada é bem dessaturada; um filtro leve no canvas dá vida ao verde e ao azul
  renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;filter:saturate(1.32) contrast(1.07) brightness(1.04)";
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#0a1a19");
  scene.fog = new THREE.Fog("#3d7a6c", 120, 440);       // verde-azulada: une o robô ao cenário sem lavar as cores

  const camera = new THREE.PerspectiveCamera(36, 1, 0.5, 2000);
  const ALVO = new THREE.Vector3(-6, 54, 40);
  const CAM = new THREE.Vector3(-30, 60, 117);
  const CAM_BASE = CAM.clone();
  const desvio = { x: 0, y: 0, fov: 36 };              // enquadramento base (ajustar) antes do zoom no olho
  camera.position.copy(CAM);
  camera.lookAt(ALVO);

  // luz só para o robô (o cenário é "unlit", com a luz pintada na textura)
  scene.add(new THREE.HemisphereLight("#b5f0de", "#24452a", 1.7));
  const sol = new THREE.DirectionalLight("#e8fff0", 2.3); sol.position.set(-60, 140, 40); scene.add(sol);
  const contra = new THREE.DirectionalLight("#5fd0ff", 1.8); contra.position.set(40, 80, -80); scene.add(contra);
  const quente = new THREE.DirectionalLight("#ffc98a", 0.9); quente.position.set(-90, 40, -60); scene.add(quente);

  let resolverPronta!: () => void, rejeitarPronta!: (e: unknown) => void;
  const pronta = new Promise<void>((res, rej) => { resolverPronta = res; rejeitarPronta = rej; });

  carregarMoldes((p) => opcoes.onProgress?.(p))
    .then((m) => { if (!destruida) iniciar(m); })
    .catch((e) => { opcoes.onProgress?.(100); rejeitarPronta(e); });

  function iniciar(moldes: Moldes) {
    const _p = new THREE.Vector3(), _v = new THREE.Vector3();
    const cena = moldes.floresta;

    /* ---------- cenário ---------- */
    scene.add(cena.scene);
    cena.scene.getObjectByName("Robot_11")!.visible = false;            // sai o robô original
    cena.scene.getObjectByName(NOME_BORBOLETA)!.visible = false;         // a borboleta é a cópia controlada abaixo
    cena.scene.getObjectByName("Light_8")?.traverse((o) => {              // raios de luz: translúcidos (vinham opacos)
      const m = (o as THREE.Mesh).material as THREE.MeshBasicMaterial | undefined;
      if (!(o as THREE.Mesh).isMesh || !m) return;
      Object.assign(m, { transparent: true, blending: THREE.AdditiveBlending, opacity: 0.22, depthWrite: false, alphaTest: 0 });
      m.color.set("#bfffee");
      m.needsUpdate = true;
    });
    cena.scene.getObjectByName("Cube_7")?.traverse((o) => {                // o fundo pintado não recebe névoa
      if ((o as THREE.Mesh).isMesh) ((o as THREE.Mesh).material as THREE.Material & { fog: boolean }).fog = false;
    });
    const mixer = new THREE.AnimationMixer(cena.scene);                    // vaga-lumes e raios da cena original
    cena.animations.forEach((a) => mixer.clipAction(a).play());
    cena.scene.updateMatrixWorld(true);

    const chao: THREE.Object3D[] = [];
    for (const n of ["Tree_main_9", "grass_main_12"]) cena.scene.getObjectByName(n)?.traverse((o) => { if ((o as THREE.Mesh).isMesh) chao.push(o); });
    const ray = new THREE.Raycaster();
    const alturaChao = (x: number, z: number) => {
      ray.set(new THREE.Vector3(x, 200, z), new THREE.Vector3(0, -1, 0));
      const h = ray.intersectObjects(chao, false)[0];
      return h ? h.point.y : 34;
    };

    /* ---------- robô ---------- */
    const robo = criarRobo(moldes.robo);
    descartaveis.push(robo);
    const R = robo.R;
    const LUGAR = new THREE.Vector3(1, 0, 40);
    R.scale.setScalar(30);
    R.position.copy(LUGAR);
    R.rotation.y = Math.atan2(CAM.x - LUGAR.x, CAM.z - LUGAR.z) - 0.6;   // 3/4 para a câmera, dedo de perfil
    scene.add(R);
    R.updateMatrixWorld(true);
    // assenta cada pé no chão inclinado (média dos dois pés), mergulhando 0,2 na grama
    {
      const baixos: THREE.Vector3[] = [];
      R.traverse((o) => { const m = o as THREE.Mesh; if (!m.isMesh) return; const P = m.geometry.attributes.position; for (let i = 0; i < P.count; i += 3) baixos.push(_p.fromBufferAttribute(P, i).applyMatrix4(m.matrixWorld).clone()); });
      baixos.sort((a, b) => a.y - b.y);
      const sola = baixos.slice(0, 300);
      const lado = new THREE.Vector3(1, 0, 0).applyQuaternion(R.quaternion);
      const meio = sola.reduce((s, v) => s + v.dot(lado), 0) / sola.length;
      const folga = [Infinity, Infinity];
      for (const v of sola) { const f = v.y - alturaChao(v.x, v.z); const k = v.dot(lado) < meio ? 0 : 1; folga[k] = Math.min(folga[k], f); }
      const ok = folga.filter(Number.isFinite);
      R.position.y -= ok.reduce((s, v) => s + v, 0) / ok.length + 0.2;
      R.updateMatrixWorld(true);
    }
    const CAIXA_ROBO = new THREE.Box3().setFromObject(R);
    const CENTRO_ROBO = CAIXA_ROBO.getCenter(new THREE.Vector3());

    /* ---------- sombra no chão (não há sombra real numa cena "unlit") ---------- */
    const texSombra = texturaRadial([[0, "rgba(2,10,8,.95)"], [0.45, "rgba(2,10,8,.55)"], [1, "rgba(2,10,8,0)"]]);
    descartaveis.push(texSombra);
    const mancha = (cx: number, cz: number, larg: number, comp: number, rot: number, opac: number) => {
      const mat = new THREE.MeshBasicMaterial({ map: texSombra, transparent: true, depthWrite: false, opacity: opac, fog: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 });
      const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
      const gx = (alturaChao(cx + 3, cz) - alturaChao(cx - 3, cz)) / 6, gz = (alturaChao(cx, cz + 3) - alturaChao(cx, cz - 3)) / 6;
      m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(-gx, 1, -gz).normalize())
        .multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), rot));
      m.position.set(cx, alturaChao(cx, cz) + 0.6, cz);
      m.scale.set(larg, comp, 1);
      m.renderOrder = 1;
      scene.add(m);
      descartaveis.push(m.geometry, mat);
    };
    mancha(CENTRO_ROBO.x + 4.5, CENTRO_ROBO.z - 1, 30, 17, 0.25, 0.6);
    mancha(CENTRO_ROBO.x + 0.5, CENTRO_ROBO.z + 1, 15, 10, 0.2, 0.9);

    /* ---------- borboleta + purpurina ---------- */
    const borboleta = criarBorboleta(moldes, 1, scene, reduzir);
    const purpurina = criarPurpurina(scene, 1, reduzir);
    descartaveis.push(borboleta, purpurina);
    const dedo = new THREE.Vector3();
    const pontoDoDedo = (t: number) => {
      dedo.copy(robo.pousoLocal).applyMatrix4(R.matrixWorld);
      dedo.y += 0.35 + (reduzir ? 0 : Math.sin(t * 1.3) * 0.06);
      return dedo;
    };
    pontoDoDedo(0);
    // pousada, fica virada para o robô (do dedo para a cabeça, no plano do chão)
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
      alvo.x = clamp(alvo.x, -110, 110);
      alvo.y = clamp(alvo.y, CENTRO_ROBO.y - 4, 150);
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

    /* ---------- névoa rasteira + bancos de névoa que atravessam a cena ---------- */
    const texNevoa = texturaRadial([[0, "rgba(215,240,232,.6)"], [0.5, "rgba(195,230,220,.2)"], [1, "rgba(195,230,220,0)"]], 256);
    descartaveis.push(texNevoa);
    const nevoa: THREE.Sprite[] = [];
    for (let i = 0; i < 12; i++) {
      const mat = new THREE.SpriteMaterial({ map: texNevoa, transparent: true, depthWrite: false, opacity: 0.3 + Math.random() * 0.2, fog: false });
      const s = new THREE.Sprite(mat);
      const ang = Math.random() * Math.PI * 2, r = 25 + Math.random() * 90;
      s.position.set(Math.cos(ang) * r, 0, 30 + Math.sin(ang) * r * 0.7);
      s.position.y = alturaChao(s.position.x, s.position.z) + 4 + Math.random() * 6;
      s.scale.set(60 + Math.random() * 50, 18 + Math.random() * 10, 1);
      s.userData = { vx: (Math.random() - 0.5) * 1.6, base: s.position.x };
      scene.add(s); nevoa.push(s); descartaveis.push(mat);
    }
    const banco: { s: THREE.Sprite; dx: number; dy: number; dz: number; opMax: number }[] = [];
    for (let i = 0; i < 9; i++) {
      const mat = new THREE.SpriteMaterial({ map: texNevoa, transparent: true, depthWrite: false, opacity: 0, fog: false });
      const s = new THREE.Sprite(mat);
      s.scale.set(70 + Math.random() * 60, 22 + Math.random() * 18, 1);
      s.visible = false;
      scene.add(s); descartaveis.push(mat);
      banco.push({ s, dx: (Math.random() - 0.5) * 90, dy: 4 + Math.random() * 22, dz: -25 + Math.random() * 75, opMax: 0.32 + Math.random() * 0.3 });
    }
    let bancoT = -1, proximoBanco = reduzir ? Infinity : 6 + Math.random() * 6;
    const DUR_BANCO = 16;
    const passarBanco = (dt: number) => {
      if (bancoT < 0) { proximoBanco -= dt; if (proximoBanco <= 0) { bancoT = 0; banco.forEach((b) => (b.s.visible = true)); } return; }
      bancoT += dt;
      const f = bancoT / DUR_BANCO;
      const xCentro = lerp(170, -170, f);
      const envelope = Math.sin(Math.PI * clamp(f, 0, 1)) ** 1.5;
      for (const b of banco) {
        const x = xCentro + b.dx;
        b.s.position.set(x, alturaChao(clamp(x, -120, 120), CENTRO_ROBO.z + b.dz) + b.dy, CENTRO_ROBO.z + b.dz);
        (b.s.material as THREE.SpriteMaterial).opacity = b.opMax * envelope;
      }
      if (f >= 1) { bancoT = -1; proximoBanco = 14 + Math.random() * 12; banco.forEach((b) => (b.s.visible = false)); }
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
      mixer.update(reduzir ? 0 : dt);
      if (!reduzir) for (const s of nevoa) { s.position.x += s.userData.vx * dt; if (Math.abs(s.position.x - s.userData.base) > 30) s.userData.vx *= -1; }
      passarBanco(dt);

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
        alvoB.x += Math.sin(t * 2.1) * 2.2; alvoB.y += Math.sin(t * 3.3) * 1.6; alvoB.z += Math.cos(t * 1.7) * 1.8;
      } else alvoB.copy(dedo);
      const pousando = segue ? 0 : clamp(1 - borboleta.pos.distanceTo(dedo) / 12, 0, 1);
      praCam.copy(camera.position).sub(borboleta.pos).setY(0).normalize();
      borboleta.atualizar(dt, alvoB, segue ? 3.2 : 4.2, pousando, RUMO_DEDO, praCam);
      purpurina.atualizar(dt, t, borboleta.pos, borboleta.vel, pousando);

      // cabeça: mouse ou borboleta; com a rolagem, vira para a câmera
      olhar.copy(segue ? mundoMouse : borboleta.pos).lerp(camera.position, kOlhar);
      robo.olharPara(olhar, dt, 6 + kOlhar * 4);
      brilhoOlho = lerp(brilhoOlho, Math.max(pousando > 0.85 ? 1 : 0, kZoom * 1.4), 1 - Math.exp(-dt * 2.5));
      // reta final da rolagem: o brilho do olho cresce e cobre a textura (que é de baixa resolução no modelo)
      robo.acenderOlho(clamp(brilhoOlho, 0, 1.4), t, suave(0.62, 0.98, rol));

      // câmera: paralaxe com o mouse; com a rolagem, vai do enquadramento normal até colar no olho
      const r = container.getBoundingClientRect();
      const mx = ponteiro.ativo ? ((ponteiro.x - r.left) / r.width) * 2 - 1 : 0, my = ponteiro.ativo ? ((ponteiro.y - r.top) / r.height) * 2 - 1 : 0;
      robo.olhoNoMundo(olho);
      camAlvo.copy(CAM_BASE);
      camAlvo.x += mx * 5 * (1 - kZoom); camAlvo.y -= my * 2.5 * (1 - kZoom);
      if (kZoom > 0) {
        // ponto final: à frente do olho, na direção da câmera inicial (o rosto já está virado para ela)
        // para a 5,5 do olho (o rosto enche a tela): mais perto que isso a textura do modelo (128–1024 px) fica borrada
        perto.copy(CAM_BASE).sub(olho).normalize().multiplyScalar(5.5).add(olho);
        camAlvo.lerp(perto, kZoom);
      }
      camera.position.lerp(camAlvo, reduzir || kZoom > 0 ? 0.35 : 0.05);
      mira.copy(ALVO).lerp(olho, suave(0, 0.6, kZoom));
      camera.lookAt(mira);
      // o enquadramento deslocado (texto à esquerda) volta ao centro durante o zoom
      const off = 1 - suave(0, 0.5, kZoom);
      // perto do olho o plano de corte precisa chegar mais perto; longe, 0,5 mantém a precisão de profundidade
      const near = kZoom > 0.45 ? 0.05 : 0.5;
      if (off !== offAnt || near !== camera.near) {
        camera.near = near;
        const w = container.clientWidth || window.innerWidth, h = container.clientHeight || window.innerHeight;
        if (desvio.x || desvio.y) camera.setViewOffset(w, h, desvio.x * w * off, desvio.y * h * off, w, h);
        offAnt = off;
        camera.updateProjectionMatrix();
      }
      renderer.render(scene, camera);
    };

    // só desenha enquanto o HERO está na tela
    const io = new IntersectionObserver(([e]) => renderer.setAnimationLoop(e.isIntersecting ? quadro : null));
    io.observe(container);
    limpezas.push(() => io.disconnect(), () => { timer.dispose(); mixer.stopAllAction(); });
    reajustar = () => { offAnt = NaN; };

    ajustar();
    quadro();
    renderer.setAnimationLoop(quadro);
    opcoes.onProgress?.(100);
    resolverPronta();
  }

  // ---------- tamanho: texto à esquerda empurra o robô para a direita; em pé, o robô sobe ----------
  let reajustar = () => {};
  function ajustar() {
    const w = container.clientWidth || window.innerWidth, h = container.clientHeight || window.innerHeight;
    camera.aspect = w / h;
    const retrato = camera.aspect < 0.8;
    camera.fov = retrato ? 52 : 36;
    desvio.x = retrato ? 0 : camera.aspect < 1.25 ? -0.06 : -0.19;
    desvio.y = retrato ? 0.13 : 0;
    camera.setViewOffset(w, h, desvio.x * w, desvio.y * h, w, h);
    CAM_BASE.copy(CAM).lerp(ALVO, retrato ? 0 : camera.aspect < 1.25 ? 0.06 : 0.15);
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
      // geometrias e texturas dos moldes são compartilhadas com a seção dos cards: ficam no cache
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
