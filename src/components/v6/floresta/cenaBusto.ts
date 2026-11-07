/*
 * Seção dos cards ("Sistemas em movimento"): quando a coluna da direita aparece, o robô entra andando pela
 * direita, para no canto, vira para a frente e senta de pernas cruzadas. Sentado, a cabeça acompanha o card
 * da vez (o último que chegou ao topo da pilha) enquanto os cards sobem. Sem borboleta nesta seção.
 *
 * Modelo: public/models/hero/robo-cards.glb — o robô em pé com o esqueleto refeito no Blender (ossos alinhados
 * à malha, pesos por peça) e as animações "andar" (ciclo) e "sentar" (de pé → pernas cruzadas, mãos nos joelhos).
 */
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { clamp, lerp, suave, texturaRadial } from "./roboCompartilhado";

export const URL_ROBO_CARDS = "/models/NOVO_ROBO/robozitoOUT.glb";

export interface OpcoesBusto {
  /** a coluna da direita: o canvas fica dentro dela */
  coluna: HTMLElement;
  /** a seção (os cards são buscados dentro dela) */
  secao: HTMLElement;
  /** seletor dos cards dentro da seção */
  seletorCards?: string;
}

/** Caminhada: de fora da coluna (direita) até o lugar onde ele senta. Unidades do modelo (altura ~0,98). */
const X_INICIO = 2.4, X_SENTA = 0.22;
const VELOCIDADE = 0.62;                // unidades/s, casada com o ciclo de 1 s da animação
const ROSTO_SENTADO = -0.42;            // giro final: de frente, um pouco virado para os cards (esquerda)

export function montarCenaBusto(op: OpcoesBusto): { destruir: () => void } {
  const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const seletor = op.seletorCards ?? "[data-busto-card]";
  const limpezas: (() => void)[] = [];
  let destruida = false;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;filter:saturate(1.15) contrast(1.05)";
  op.coluna.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.01, 50);
  scene.add(new THREE.HemisphereLight("#cfefff", "#101418", 1.5));
  const chave = new THREE.DirectionalLight("#ffffff", 2.4); chave.position.set(-1.5, 2, 2); scene.add(chave);
  const contra = new THREE.DirectionalLight("#00d1ff", 2.6); contra.position.set(1.8, 1.2, -1.5); scene.add(contra);
  const quente = new THREE.DirectionalLight("#ffc98a", 0.7); quente.position.set(-2, 0.4, -1.2); scene.add(quente);

  new GLTFLoader().load(URL_ROBO_CARDS, (gltf) => { if (!destruida) iniciar(gltf.scene, gltf.animations); }, undefined, () => { /* sem o robô: a coluna fica só com o brilho */ });

  function iniciar(robo: THREE.Group, clips: THREE.AnimationClip[]) {
    robo.traverse((o) => { if ((o as THREE.Mesh).isMesh) { o.frustumCulled = false; ((o as THREE.Mesh).material as THREE.MeshStandardMaterial).envMapIntensity = 0.6; } });
    // no modelo os pés já estão em y = 0
    const corpo = new THREE.Group();
    corpo.add(robo);
    robo.position.y = 0;
    scene.add(corpo);

    const ossos: Record<string, THREE.Bone> = {};
    robo.traverse((o) => { if ((o as THREE.Bone).isBone) ossos[o.name.replace(/^mixamorig:?/, "")] = o as THREE.Bone; });
    const mixer = new THREE.AnimationMixer(robo);
    const clip = (n: string) => clips.find((c) => c.name === n);
    const andarClip = clip("run") || clip("andar");
    const sentarClip = clip("sit") || clip("sentar");
    const andar = andarClip ? mixer.clipAction(andarClip) : null;
    const sentar = sentarClip ? mixer.clipAction(sentarClip) : null;
    if (sentar) { sentar.setLoop(THREE.LoopOnce, 1); sentar.clampWhenFinished = true; }

    // sombra no chão
    const texSombra = texturaRadial([[0, "rgba(0,0,0,.75)"], [0.5, "rgba(0,0,0,.35)"], [1, "rgba(0,0,0,0)"]]);
    const sombra = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: texSombra, transparent: true, depthWrite: false }));
    sombra.rotation.x = -Math.PI / 2; sombra.position.y = 0.002;
    scene.add(sombra);
    limpezas.push(() => { texSombra.dispose(); sombra.geometry.dispose(); (sombra.material as THREE.Material).dispose(); });

    /* ---------- roteiro: espera → anda → senta → sentado ---------- */
    type Fase = "espera" | "anda" | "senta" | "sentado";
    let fase: Fase = reduzir ? "sentado" : "espera", tFase = 0;
    const DUR_SENTAR = sentarClip?.duration ?? 1.3;
    if (reduzir && sentar) { sentar.play(); sentar.time = DUR_SENTAR; mixer.update(0); }
    corpo.position.x = reduzir ? X_SENTA : X_INICIO;
    corpo.rotation.y = reduzir ? ROSTO_SENTADO : -Math.PI / 2;        // andando, olha para a esquerda (-X)
    const comecar = () => {
      if (fase !== "espera") return;
      fase = "anda"; tFase = 0;
      enquadrar();
      corpo.position.x = X_SENTA + larguraMundo * 0.42 + 0.35;      // entra de fora do canvas, pela direita
      andar?.reset().play();
    };

    /* ---------- cabeça acompanha o card da vez ---------- */
    const cardDaVez = (): HTMLElement | null => {
      const cards = Array.from(op.secao.querySelectorAll<HTMLElement>(seletor));
      let ultimo: HTMLElement | null = null;
      for (const c of cards) {
        const r = c.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight * 0.85) continue;
        const topoSticky = parseFloat(getComputedStyle(c.parentElement!).top) || 0;
        if (r.top <= topoSticky + window.innerHeight * 0.25) ultimo = c;
        else if (!ultimo) ultimo = c;
      }
      return ultimo;
    };
    const cabecaMundo = new THREE.Vector3(), alvoOlhar = new THREE.Vector3(), _q = new THREE.Quaternion(), _q2 = new THREE.Quaternion(), _qp = new THREE.Quaternion();
    const _f = new THREE.Vector3(), _l = new THREE.Vector3(), _ax = new THREE.Vector3(), EIXO_Y = new THREE.Vector3(0, 1, 0);
    const _ndc = new THREE.Vector2(), _ray = new THREE.Raycaster(), plano = new THREE.Plane(), _dir = new THREE.Vector3();
    const telaNoMundo = (sx: number, sy: number, alvo: THREE.Vector3) => {
      const r = renderer.domElement.getBoundingClientRect();
      _ndc.set(((sx - r.left) / r.width) * 2 - 1, -((sy - r.top) / r.height) * 2 + 1);   // pode passar de -1: o card fica fora da coluna
      _ray.setFromCamera(_ndc, camera);
      camera.getWorldDirection(_dir);
      plano.setFromNormalAndCoplanarPoint(_dir, cabecaMundo);
      return _ray.ray.intersectPlane(plano, alvo) ?? alvo.copy(cabecaMundo).add(new THREE.Vector3(-1, 0, 0));
    };
    const olhar = { yaw: 0, pitch: 0 };
    /** gira um osso no MUNDO em torno do próprio pivô (aplicado por cima da animação) */
    const girarNoMundo = (osso: THREE.Bone, q: THREE.Quaternion) => {
      osso.getWorldQuaternion(_qp);
      const novo = q.clone().multiply(_qp);
      osso.parent!.getWorldQuaternion(_qp).invert();
      osso.quaternion.copy(_qp.multiply(novo));
      osso.updateMatrixWorld(true);
    };
    const aplicarOlhar = (dt: number, peso: number) => {
      const cab = ossos.Head, pesc = ossos.Neck;
      if (!cab || !pesc) return;
      cab.getWorldPosition(cabecaMundo);
      const card = cardDaVez();
      let yawAlvo = 0, pitchAlvo = 0;
      if (card) {
        const r = card.getBoundingClientRect();
        telaNoMundo(r.left + r.width * 0.5, r.top + Math.min(r.height * 0.4, 140), alvoOlhar);
        // direção até o card no referencial do corpo (frente = +Z do modelo depois do giro do corpo)
        _l.copy(alvoOlhar).sub(cabecaMundo);
        _f.set(0, 0, 1).applyAxisAngle(EIXO_Y, corpo.rotation.y);
        const yaw = Math.atan2(_l.x, _l.z) - Math.atan2(_f.x, _f.z);
        yawAlvo = clamp(Math.atan2(Math.sin(yaw), Math.cos(yaw)), -0.6, 0.6);
        // inclinação contida: com o card lá no alto ele só levanta um pouco o rosto (mais que isso estica o pescoço)
        pitchAlvo = clamp(Math.atan2(_l.y, Math.hypot(_l.x, _l.z)) * 0.5, -0.15, 0.12);
      }
      const k = 1 - Math.exp(-dt * 2.2);           // devagar: os cards sobem aos trancos, a cabeça não
      olhar.yaw = lerp(olhar.yaw, yawAlvo * peso, k);
      olhar.pitch = lerp(olhar.pitch, pitchAlvo * peso, k);
      // só pescoço (35%) e cabeça (65%): os braços são filhos do peito, girar o peito tira as mãos dos joelhos
      _ax.set(1, 0, 0).applyAxisAngle(EIXO_Y, corpo.rotation.y + olhar.yaw);
      for (const [osso, parte] of [[pesc, 0.35], [cab, 0.65]] as const) {
        _q.setFromAxisAngle(EIXO_Y, olhar.yaw * parte).premultiply(_q2.setFromAxisAngle(_ax, -olhar.pitch * parte));
        girarNoMundo(osso, _q);
      }
    };

    /* ---------- laço ---------- */
    const OSSOS_OLHAR = ["Spine2", "Neck", "Head"];
    let poseBase: Map<string, THREE.Quaternion> | null = null;
    const timer = new THREE.Timer();
    timer.connect(document);
    const quadro = () => {
      timer.update();
      const dt = Math.min(timer.getDelta(), 0.05), t = timer.getElapsed();
      tFase += dt;
      if (fase === "anda") {
        corpo.position.x = Math.max(X_SENTA, corpo.position.x - VELOCIDADE * dt);
        if (corpo.position.x <= X_SENTA + 1e-3) {
          fase = "senta"; tFase = 0;
          if (sentar) { sentar.reset().play(); andar?.crossFadeTo(sentar, 0.35, false); }
        }
      } else if (fase === "senta") {
        // vira de frente nos primeiros 60% do sentar
        corpo.rotation.y = lerp(-Math.PI / 2, ROSTO_SENTADO, suave(0, DUR_SENTAR * 0.6, tFase));
        if (tFase >= DUR_SENTAR + 0.1) { fase = "sentado"; tFase = 0; andar?.stop(); }
      }
      // Sentado, a pose é congelada: guarda peito, pescoço e cabeça uma vez e, a cada quadro, volta a eles antes
      // de somar o olhar. Depois que "sentar" termina o mixer pode parar de reescrever os ossos, e o giro somado
      // se acumulava quadro a quadro (a cabeça ficava girando sem parar).
      if (fase !== "sentado") mixer.update(dt);
      else {
        if (!poseBase) { mixer.update(0); poseBase = new Map(OSSOS_OLHAR.map((n) => [n, ossos[n]?.quaternion.clone()] as const).filter((e): e is [string, THREE.Quaternion] => !!e[1])); }
        poseBase.forEach((q, n) => ossos[n].quaternion.copy(q));
      }
      robo.updateMatrixWorld(true);
      // sentado: respira e a cabeça passa a acompanhar os cards
      if (fase === "sentado") {
        if (!reduzir && ossos.Spine2) girarNoMundo(ossos.Spine2, _q.setFromAxisAngle(_ax.set(1, 0, 0).applyAxisAngle(EIXO_Y, corpo.rotation.y), Math.sin(t * 1.4) * 0.006));   // respiração bem leve (mexe os braços junto)
        aplicarOlhar(dt, reduzir ? 1 : suave(0, 0.8, tFase));
      }
      sombra.position.x = corpo.position.x; sombra.position.z = corpo.position.z;
      const sentadoK = fase === "sentado" ? 1 : fase === "senta" ? suave(0, DUR_SENTAR, tFase) : 0;
      sombra.scale.set(lerp(0.32, 0.62, sentadoK), lerp(0.18, 0.46, sentadoK), 1);
      enquadrar();
      renderer.render(scene, camera);
    };

    // câmera FIXA (o robô tem o mesmo tamanho andando e sentado). A coluna costuma ser mais alta que a tela:
    // enquadra pela parte dela que cabe na janela quando grudada no topo (sticky top-20), não pela coluna inteira.
    const VISIVEL = 1.16;          // altura do mundo que ocupa a parte visível (cabe o robô em pé, 0,98)
    const MIRA_Y = 0.45;           // ponto do corpo que fica no centro vertical da parte visível
    let larguraMundo = 2;          // largura do canvas em unidades do mundo (para ele entrar de fora da tela)
    let chaveTam = "";
    function enquadrar() {
      const w = op.coluna.clientWidth, h = op.coluna.clientHeight;
      if (!w || !h) return;
      const regiao = Math.min(h, window.innerHeight - 100);        // px da coluna visíveis com ela grudada no topo
      const k = `${w}x${h}|${regiao}`;
      if (k === chaveTam) return;
      chaveTam = k;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      const fov = THREE.MathUtils.degToRad(camera.fov);
      const alturaCanvas = (VISIVEL * h) / regiao;                // mundo que o canvas inteiro mostra na vertical
      const dist = alturaCanvas / (2 * Math.tan(fov / 2));
      larguraMundo = alturaCanvas * camera.aspect;
      camera.position.set(X_SENTA, MIRA_Y + 0.05, dist);
      camera.lookAt(X_SENTA, MIRA_Y, 0);
      // o ponto mirado vai para 62% da largura e para o meio da parte visível (um pouco acima do centro)
      const cx = w * 0.62, cy = regiao * 0.47;
      camera.setViewOffset(w, h, w / 2 - cx, h / 2 - cy, w, h);
      camera.updateProjectionMatrix();
    }

    // inspeção: ?debug3d na URL expõe o estado da cena no console
    if (new URLSearchParams(location.search).has("debug3d")) {
      (window as unknown as Record<string, unknown>).__busto = { corpo, ossos, camera, estado: () => ({ fase, tFase, giro: corpo.rotation.y, x: corpo.position.x, olhar: { ...olhar } }) };
    }

    // começa a andar quando a coluna aparece de verdade; só desenha enquanto ela está na tela
    const io = new IntersectionObserver(([e]) => {
      renderer.setAnimationLoop(e.isIntersecting ? quadro : null);
      if (e.isIntersecting && e.intersectionRatio > 0.35) comecar();
    }, { threshold: [0, 0.35, 0.6] });
    io.observe(op.coluna);
    limpezas.push(() => io.disconnect(), () => { timer.dispose(); mixer.stopAllAction(); });
    limpezas.push(() => robo.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      m.geometry.dispose();
      const mat = m.material as THREE.MeshStandardMaterial;
      [mat.map, mat.normalMap, mat.roughnessMap, mat.metalnessMap].forEach((x) => x?.dispose());
      mat.dispose();
    }));
  }

  return {
    destruir() {
      destruida = true;
      renderer.setAnimationLoop(null);
      limpezas.forEach((f) => f());
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
