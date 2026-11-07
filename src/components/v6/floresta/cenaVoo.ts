/*
 * Seção dos cards ("Sistemas em movimento"): o galpão do HERO de fundo com chão molhado reflexivo
 * e o robô voando em trajetória orgânica pelo salão: voa alto planando com os braços abertos,
 * desce suavemente para um pouso leve no chão molhado, desliza/agacha brevemente no piso,
 * e em seguida decola com os jatos voltando a subir para o ar.
 */
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Reflector } from "three/examples/jsm/objects/Reflector.js";
import { clamp, criarPurpurina, lerp, suave, texturaRadial } from "./roboCompartilhado";
import { URL_GALPAO, SHADER_CHAO_MOLHADO, gradarGalpao } from "./cenaGalpao";
import { URL_ROBO_CARDS } from "./cenaBusto";

export interface OpcoesVoo {
  /** a seção inteira (a rolagem dela move a câmera) */
  secao: HTMLElement;
}

/** centro do laço de voo */
const CENTRO = new THREE.Vector3(-2.5, 0, 3);
const ESCALA_ROBO = 1.6;
const VOLTA_S = 18;               // ciclo completo de voo, pouso leve e decolagem

type Mola = { x: number; v: number };
const novaMola = (x = 0): Mola => ({ x, v: 0 });
function mola(m: Mola, alvo: number, dt: number, freq: number, amort = 1): number {
  const w = 2 * Math.PI * freq;
  const f = 1 + 2 * dt * amort * w, hoo = dt * w * w, hhoo = dt * hoo, inv = 1 / (f + hhoo);
  const x = (f * m.x + dt * m.v + hhoo * alvo) * inv;
  m.v = (m.v + hoo * (alvo - m.x)) * inv;
  m.x = x;
  return x;
}
const angDif = (a: number, b: number) => Math.atan2(Math.sin(a - b), Math.cos(a - b));

export function montarCenaVoo(container: HTMLElement, op: OpcoesVoo): { destruir: () => void } {
  const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const celular = window.innerWidth < 768;
  const limpezas: (() => void)[] = [];
  let destruida = false;

  const renderer = new THREE.WebGLRenderer({ antialias: !celular, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, celular ? 1.25 : 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;filter:saturate(1.1) contrast(1.05)";
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#0b1016");
  const camera = new THREE.PerspectiveCamera(46, 1, 0.05, 200);
  const CAM = new THREE.Vector3(1.0, 1.9, -1.4);
  const ALVO = new THREE.Vector3(CENTRO.x, 1.7, CENTRO.z);
  const desvio = { x: 0 };

  scene.add(new THREE.HemisphereLight("#c9d6e8", "#1a1410", 1.3));
  const chave = new THREE.DirectionalLight("#ffe2b8", 2.0); chave.position.set(-4, 6, -3); scene.add(chave);
  const contra = new THREE.DirectionalLight("#5fd0ff", 1.8); contra.position.set(3, 3, 6); scene.add(contra);

  const carregarGLTF = (url: string) =>
    new Promise<{ scene: THREE.Group; animations: THREE.AnimationClip[] }>((res, rej) =>
      new GLTFLoader().load(url, (g) => res({ scene: g.scene, animations: g.animations || [] }), undefined, rej)
    );
  Promise.all([carregarGLTF(URL_GALPAO), carregarGLTF(URL_ROBO_CARDS)])
    .then(([g, r]) => { if (!destruida) iniciar(g.scene, r.scene, r.animations); })
    .catch(() => { /* fallback */ });

  function iniciar(galpao: THREE.Group, robo: THREE.Group, clips: THREE.AnimationClip[]) {
    /* ---------- galpão com chão molhado ---------- */
    galpao.scale.multiplyScalar(100);
    galpao.traverse((o) => {
      // Oculta entulho, telhas de zinco e sobras de props secundárias
      if (/mdl_001|^unit|backdrop_grp_00[0-5]|backdrop_grp_009|backdrop_grp_01[0-9]/i.test(o.name)) {
        o.visible = false;
      }
    });
    gradarGalpao(galpao, CENTRO);
    scene.add(galpao);

    const espelho = new Reflector(new THREE.PlaneGeometry(16, 16), {
      textureWidth: celular ? 384 : 768, textureHeight: celular ? 384 : 768, color: 0xa8b4c0, clipBias: 0.003, shader: SHADER_CHAO_MOLHADO,
    });
    const matEspelho = espelho.material as THREE.ShaderMaterial;
    matEspelho.transparent = true; matEspelho.depthWrite = false;
    espelho.rotation.x = -Math.PI / 2;
    espelho.position.set(CENTRO.x, 0.006, CENTRO.z);
    scene.add(espelho);

    /* ---------- robô com animação fluida (Blender rig oficial, sem distorção) ---------- */
    robo.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.frustumCulled = false;
        ((o as THREE.Mesh).material as THREE.MeshStandardMaterial).envMapIntensity = 0.6;
      }
    });
    const voo = new THREE.Group();
    voo.rotation.order = "YXZ";
    voo.scale.setScalar(ESCALA_ROBO);
    robo.position.y = 0;
    voo.add(robo);
    scene.add(voo);

    // AnimationMixer do robô para movimento 100% orgânico e sem estiramento
    const mixer = new THREE.AnimationMixer(robo);
    const clipAndar = THREE.AnimationClip.findByName(clips, "run") || THREE.AnimationClip.findByName(clips, "andar") || clips[0];
    const acaoAndar = clipAndar ? mixer.clipAction(clipAndar) : null;
    if (acaoAndar) {
      acaoAndar.play();
      acaoAndar.timeScale = 0.35; // no ar: movimento suave, flutuante e delicado
    }

    // Jatos discretos na sola dos pés
    const texJato = texturaRadial([[0, "rgba(220,250,255,1)"], [0.3, "rgba(60,200,255,0.7)"], [1, "rgba(0,160,255,0)"]], 64);
    const matJato = new THREE.SpriteMaterial({ map: texJato, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    const jatoEsq = new THREE.Sprite(matJato); jatoEsq.scale.setScalar(0.24);
    const jatoDir = new THREE.Sprite(matJato); jatoDir.scale.setScalar(0.24);
    scene.add(jatoEsq, jatoDir);

    const luzJato = new THREE.PointLight("#3fd4ff", 2.2, 2.5, 1.8);
    scene.add(luzJato);
    const rastro = criarPurpurina(scene, 0.045, reduzir);

    // sombra suave no chão
    const texSombra = texturaRadial([[0, "rgba(0,0,0,0.75)"], [0.5, "rgba(0,0,0,0.3)"], [1, "rgba(0,0,0,0)"]]);
    const sombra = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: texSombra, transparent: true, depthWrite: false }));
    sombra.rotation.x = -Math.PI / 2;
    sombra.renderOrder = 2;
    scene.add(sombra);

    /* ---------- Trajetória fluida com fase de voo alto e fase de pouso leve ---------- */
    // u = 0.00 a 0.45: Voo alto pelo galpão (y = 2.2 a 2.5) planando suavemente
    // u = 0.45 a 0.60: Descida suave e elegante em direção ao chão
    // u = 0.60 a 0.78: Pouso suave no chão molhado (pés tocam y = 0, desliza agachado no reflexo)
    // u = 0.78 a 1.00: Impulso dos jatos, decolagem e subida de volta para o alto
    const trajeto = new THREE.CatmullRomCurve3([
      new THREE.Vector3(CENTRO.x + 1.6, 2.30, CENTRO.z + 0.3),   // u ~ 0.00 (cruzeiro alto)
      new THREE.Vector3(CENTRO.x + 0.8, 2.50, CENTRO.z + 1.6),   // u ~ 0.15 (curva alta suave)
      new THREE.Vector3(CENTRO.x - 1.0, 2.25, CENTRO.z + 1.4),   // u ~ 0.30 (inclinando suave)
      new THREE.Vector3(CENTRO.x - 1.8, 1.70, CENTRO.z + 0.2),   // u ~ 0.45 (inicia aproximação)
      new THREE.Vector3(CENTRO.x - 1.2, 0.98, CENTRO.z - 0.9),   // u ~ 0.58 (quase no piso)
      new THREE.Vector3(CENTRO.x - 0.2, 0.82, CENTRO.z - 1.5),   // u ~ 0.68 (touchdown suave no chão!)
      new THREE.Vector3(CENTRO.x + 0.9, 0.85, CENTRO.z - 1.3),   // u ~ 0.78 (desliza agachado no reflexo)
      new THREE.Vector3(CENTRO.x + 1.8, 1.45, CENTRO.z - 0.6),   // u ~ 0.88 (jatos disparam, decola)
    ], true, "centripetal");

    // Pegar referências dos nós para olhar e jatos
    const osso = (n: string) => (robo.getObjectByName(`mixamorig${n}`) || robo.getObjectByName(`mixamorig:${n}`)) as THREE.Bone | undefined;
    const peEsq = osso("LeftFoot");
    const peDir = osso("RightFoot");
    const cabeca = osso("Head");
    const pesc = osso("Neck");

    const eLado = new THREE.Vector3(), eAlto = new THREE.Vector3(), eFrente = new THREE.Vector3();
    const _qa = new THREE.Quaternion(), _qb = new THREE.Quaternion(), _qp = new THREE.Quaternion();
    const girarCabeca = (angY: number, angP: number) => {
      if (!cabeca && !pesc) return;
      if (pesc && Math.abs(angY) + Math.abs(angP) > 1e-4) {
        _qp.copy(pesc.quaternion);
        _qa.setFromAxisAngle(eAlto, angY * 0.35).multiply(_qb.setFromAxisAngle(eLado, angP * 0.35));
        pesc.quaternion.multiply(_qa);
      }
      if (cabeca && Math.abs(angY) + Math.abs(angP) > 1e-4) {
        _qp.copy(cabeca.quaternion);
        _qa.setFromAxisAngle(eAlto, angY * 0.65).multiply(_qb.setFromAxisAngle(eLado, angP * 0.65));
        cabeca.quaternion.multiply(_qa);
      }
    };

    const voar = { vel: 0, subida: 0, curva: 0, olharFrente: 0, pousando: 0 };
    let inclinaCorpo = 0, deitaCorpo = 0;
    const mOlhaY = novaMola(), mOlhaP = novaMola();

    const animarCorpo = (t: number, dt: number) => {
      if (acaoAndar) {
        // Velocidade da passada: lenta e majestosa no ar, compassada no chão
        acaoAndar.timeScale = lerp(0.32, 0.65, voar.pousando);
      }
      mixer.update(dt);

      // Olhar antecipado na direção da trajetória e subida/descida (apenas cabeça e pescoço)
      const m = reduzir ? 0 : 1;
      const olhaY = mola(mOlhaY, clamp(voar.olharFrente * 0.7, -0.4, 0.4) + Math.sin(t * 0.45) * 0.12 * m, dt, 0.5);
      const olhaP = mola(mOlhaP, -inclinaCorpo * 0.4 + voar.subida * 0.25 + (voar.pousando * 0.08), dt, 0.6);
      girarCabeca(olhaY, olhaP);

      robo.updateMatrixWorld(true);
    };

    const _p = new THREE.Vector3(), _t = new THREE.Vector3(), _tf = new THREE.Vector3(), _tl = new THREE.Vector3();
    const velMundo = new THREE.Vector3(), posAnt = new THREE.Vector3(), posPeEsq = new THREE.Vector3(), posPeDir = new THREE.Vector3(), posJato = new THREE.Vector3();
    let u = 0, rumo = 0, primeira = true, ritmo = 1;
    const mInclina = novaMola(0.6), mDeita = novaMola(), mRumo = novaMola();
    const DU = 0.012;

    const timer = new THREE.Timer();
    timer.connect(document);
    const camPos = new THREE.Vector3().copy(CAM), mira = new THREE.Vector3().copy(ALVO);

    const quadro = () => {
      timer.update();
      const dt = Math.min(timer.getDelta(), 0.05), t = timer.getElapsed();
      if (!reduzir) matEspelho.uniforms.tempo.value = t;

      if (reduzir) {
        _p.copy(trajeto.getPointAt(0)); _t.set(-1, 0, 0); _tf.copy(_t); _tl.copy(_t);
      } else {
        trajeto.getTangentAt(u, _t);
        // Ritmo orgânico: desacelera um pouco no pouso para dar peso e delicadeza
        const fatorPouso = (_p.y < 1.1) ? 0.75 : 1.0;
        ritmo = lerp(ritmo, clamp((1 - _t.y * 0.4) * fatorPouso, 0.65, 1.25), 1 - Math.exp(-dt * 1.5));
        u = (u + (dt * ritmo) / VOLTA_S) % 1;
        trajeto.getPointAt(u, _p);
        trajeto.getTangentAt(u, _t);
        trajeto.getTangentAt((u + DU) % 1, _tf);
        trajeto.getTangentAt((u + 0.06) % 1, _tl);
      }

      // Nível de pouso baseado na proximidade com o piso
      // voo.y ~ 0.82 significa pés no chão
      const altRelativa = clamp((_p.y - 0.82) / 1.0, 0, 1);
      const pousando = 1 - suave(0, 0.9, altRelativa); // 1 no chão, 0 no ar alto
      voar.pousando = pousando;

      // Flutuação leve apenas no ar; no chão fica firme e estável
      _p.y += (Math.sin(t * 1.1) * 0.04 + Math.sin(t * 0.5 + 1) * 0.02) * (1 - pousando * 0.9) * (reduzir ? 0.2 : 1);
      voo.position.copy(_p);

      if (primeira) { posAnt.copy(_p); primeira = false; rumo = mRumo.x = Math.atan2(_t.x, _t.z); }
      velMundo.copy(_p).sub(posAnt).divideScalar(Math.max(dt, 1e-4));
      posAnt.copy(_p);

      // Ângulos do corpo:
      const rumoAqui = Math.atan2(_t.x, _t.z);
      const curva = reduzir ? 0 : angDif(Math.atan2(_tf.x, _tf.z), rumoAqui) / ((DU * VOLTA_S) / ritmo);
      rumo = mola(mRumo, mRumo.x + angDif(rumoAqui, mRumo.x), dt, 0.9);
      // No chão diminui o deitar na curva
      const deita = mola(mDeita, clamp(-curva * 0.4 * (1 - pousando * 0.7), -0.5, 0.5), dt, 0.5, 0.8);
      
      const vel = Math.hypot(velMundo.x, velMundo.z);
      const sobe = clamp(_t.y * 1.4, -0.35, 0.35);
      // Ao pousar, o robô fica mais ereto (inclina reduz de ~0.65 para ~0.15)
      const inclinaAlvo = lerp(clamp(0.55 + vel * 0.18, 0.45, 0.95) - sobe, 0.14, pousando);
      const inclina = mola(mInclina, reduzir ? 0.15 : inclinaAlvo, dt, 0.4);

      voo.rotation.set(inclina, rumo, deita);
      voo.updateMatrixWorld(true);

      inclinaCorpo = inclina; deitaCorpo = deita;
      voar.vel = vel; voar.subida = _t.y; voar.curva = curva;
      voar.olharFrente = reduzir ? 0 : angDif(Math.atan2(_tl.x, _tl.z), rumo);
      animarCorpo(t, dt);

      // Posição exata dos pés para os jatos propulsores:
      if (peEsq && peDir) {
        peEsq.getWorldPosition(posPeEsq);
        peDir.getWorldPosition(posPeDir);
        jatoEsq.position.copy(posPeEsq).addScaledVector(eAlto, -0.04);
        jatoDir.position.copy(posPeDir).addScaledVector(eAlto, -0.04);
        posJato.copy(posPeEsq).add(posPeDir).multiplyScalar(0.5);
      } else {
        voo.localToWorld(posJato.set(0, -0.55, 0));
        jatoEsq.position.copy(posJato).addScaledVector(eLado, -0.15);
        jatoDir.position.copy(posJato).addScaledVector(eLado, 0.15);
      }

      // Intensidade dos jatos:
      // No ar: brilho pulsante e rastro azul. No chão: suave idle glow, sem fumaça
      const forcaJato = lerp(0.85 + Math.sin(t * 26) * 0.15, 0.15, pousando);
      const tamJato = lerp(0.24, 0.08, pousando);
      jatoEsq.scale.setScalar(tamJato * forcaJato);
      jatoDir.scale.setScalar(tamJato * forcaJato);
      luzJato.position.copy(posJato);
      luzJato.intensity = lerp(2.4, 0.5, pousando) * forcaJato;

      // Partículas saem apenas quando os jatos estão acelerando no ar
      if (pousando < 0.6) {
        const velJato = velMundo.clone().multiplyScalar(-0.4);
        rastro.atualizar(dt, t, posJato, velJato, reduzir ? 1 : 0);
      }

      // Sombra projetada no piso molhado
      sombra.position.set(_p.x, 0.012, _p.z);
      const altPiso = clamp(_p.y - 0.75, 0, 3);
      sombra.scale.setScalar(lerp(0.85, 2.2, suave(0, 2.5, altPiso)));
      (sombra.material as THREE.MeshBasicMaterial).opacity = lerp(0.85, 0.2, suave(0, 2.5, altPiso));

      // Câmera com paralaxe elegante
      const r = op.secao.getBoundingClientRect();
      const prog = clamp(-r.top / Math.max(1, r.height - window.innerHeight), 0, 1);
      camPos.copy(CAM).add(new THREE.Vector3(-0.7 * prog, 0.4 - prog * 0.8, 0.8 * prog));
      camera.position.lerp(camPos, 0.08);
      mira.lerp(ALVO.clone().lerp(_p, 0.32), 1 - Math.exp(-dt * 1.5));
      camera.lookAt(mira);
      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(() => {
      const r = op.secao.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) quadro();
      else timer.update();
    });

    limpezas.push(() => timer.dispose(), () => rastro.dispose());
    limpezas.push(() => {
      [texJato, texSombra].forEach((x) => x.dispose());
      matJato.dispose();
      espelho.dispose();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (!m.isMesh) return;
        m.geometry?.dispose();
        (Array.isArray(m.material) ? m.material : [m.material]).forEach((mat) => mat?.dispose());
      });
    });

    if (new URLSearchParams(location.search).has("debug3d")) {
      (window as unknown as Record<string, unknown>).__voo = { scene, camera, voo, trajeto, CAM, ALVO, desvio };
    }

    ajustar();
    camera.position.copy(CAM);
    quadro();
  }

  function ajustar() {
    const w = container.clientWidth || window.innerWidth, h = container.clientHeight || window.innerHeight;
    camera.aspect = w / h;
    const retrato = camera.aspect < 0.8;
    camera.fov = retrato ? 62 : 46;
    desvio.x = retrato ? 0 : camera.aspect < 1.6 ? -0.16 : -0.25;
    camera.setViewOffset(w, h, desvio.x * w, 0, w, h);
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  const ro = new ResizeObserver(ajustar);
  ro.observe(container);
  limpezas.push(() => ro.disconnect());

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
