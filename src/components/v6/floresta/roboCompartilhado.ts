/*
 * Peças comuns do robô agachado e da borboleta azul, usadas no HERO (cenaFloresta) e na seção dos cards (cenaBusto).
 *
 * Os dois GLBs são baixados uma vez só (cache por módulo). Na primeira carga são montados "moldes":
 * - robô: pose congelada (cada SkinnedMesh do Tripo vira Mesh comum, porque o esqueleto não bate com a malha),
 *   cabeça como grupo de 17 peças girando no pescoço, olho com halo, e o ponto de pouso na ponta do indicador;
 * - borboleta: cópia do galho dela na cena "Lost robot" (com esqueleto e a animação de bater asas).
 * Cada cena pega uma cópia própria dos moldes (geometrias e texturas compartilhadas).
 */
import * as THREE from "three";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { clone as clonarComEsqueleto } from "three/examples/jsm/utils/SkeletonUtils.js";
import { POSE_AGACHADO } from "./poseAgachado";

export const URL_FLORESTA = "/models/hero/floresta.glb";
export const URL_ROBO = "/models/hero/robo-agachado.glb";

const PECAS_CABECA = ["12", "14", "55", "57", "13", "38", "3", "46", "48", "53", "20", "35", "19", "29", "45", "36", "42"];
const PECA_OLHO = "tripo_part_53";
const PECA_BORBOLETA_LARANJA = "tripo_part_9";
export const NOME_BORBOLETA = "butterfly_6";

export const clamp = THREE.MathUtils.clamp;
export const lerp = THREE.MathUtils.lerp;
export const suave = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

export function texturaRadial(paradas: [number, string][], tam = 128): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = tam;
  const g = c.getContext("2d")!;
  const gr = g.createRadialGradient(tam / 2, tam / 2, 0, tam / 2, tam / 2, tam / 2);
  for (const [p, cor] of paradas) gr.addColorStop(p, cor);
  g.fillStyle = gr;
  g.fillRect(0, 0, tam, tam);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ============================ carga e moldes ============================ */

export interface Moldes {
  floresta: GLTF;
  robo: THREE.Group;            // molde do robô, escala 1, na origem, sem giro
  borboleta: THREE.Object3D;    // molde da borboleta (orientação e escala de mundo da cena original)
  bateAsas: THREE.AnimationClip | null;
}

let cache: Promise<Moldes> | null = null;
const progressoOuvintes = new Set<(pct: number) => void>();
let ultimoPct = 0;

/** Baixa os dois modelos uma vez só. `onProgress` recebe 0..95 durante o download. */
export function carregarMoldes(onProgress?: (pct: number) => void): Promise<Moldes> {
  if (onProgress) { progressoOuvintes.add(onProgress); onProgress(ultimoPct); }
  if (cache) return cache;
  const loader = new GLTFLoader();
  const bytes: Record<"a" | "b", [number, number]> = { a: [0, 3.1e6], b: [0, 5.1e6] };
  const informar = () => {
    ultimoPct = Math.min(95, Math.round(((bytes.a[0] + bytes.b[0]) / (bytes.a[1] + bytes.b[1])) * 95));
    progressoOuvintes.forEach((f) => f(ultimoPct));
  };
  const carregar = (url: string, k: "a" | "b") =>
    new Promise<GLTF>((res, rej) => loader.load(url, res, (ev) => { bytes[k] = [ev.loaded, ev.lengthComputable && ev.total ? ev.total : bytes[k][1]]; informar(); }, rej));
  cache = Promise.all([carregar(URL_FLORESTA, "a"), carregar(URL_ROBO, "b")]).then(([floresta, robo]) => ({
    floresta,
    robo: montarMoldeRobo(robo.scene, robo),
    ...montarMoldeBorboleta(floresta),
  }));
  cache.catch(() => { cache = null; });
  return cache;
}

function montarMoldeBorboleta(floresta: GLTF) {
  floresta.scene.updateMatrixWorld(true);
  const original = floresta.scene.getObjectByName(NOME_BORBOLETA)!;
  const copia = clonarComEsqueleto(original);
  original.getWorldQuaternion(copia.quaternion);
  original.getWorldScale(copia.scale);
  copia.position.set(0, 0, 0);
  copia.traverse((o) => { if ((o as THREE.Mesh).isMesh) o.frustumCulled = false; });
  // a animação da cena mexe em vários objetos; fica só com as trilhas dos ossos da borboleta
  const nomes = new Set<string>(); copia.traverse((o) => nomes.add(o.name));
  const clip = floresta.animations[0];
  const trilhas = clip ? clip.tracks.filter((t) => nomes.has(THREE.PropertyBinding.parseTrackName(t.name).nodeName)) : [];
  return { borboleta: copia, bateAsas: trilhas.length ? new THREE.AnimationClip("bate-asas", clip!.duration, trilhas) : null };
}

function montarMoldeRobo(cenaRobo: THREE.Group, gltf?: GLTF): THREE.Group {
  // Suporte para robôs com rig Mixamo (como robolito, robo-agachado ou robozitoOUT)
  const temArmature = Boolean(cenaRobo.getObjectByName("mixamorig:Hips") || cenaRobo.getObjectByName("mixamorigHips") || cenaRobo.getObjectByName("Armature"));
  const isNovo = temArmature || URL_ROBO.includes("robozitoOUT") || URL_ROBO.includes("robolito") || URL_ROBO.includes("robo-agachado");
  if (isNovo && gltf) {
    const R = gltf.scene;
    R.name = "robo";
    R.userData.isNovoRobo = true;
    R.userData.animations = gltf.animations;
    R.userData.pousoLocal = new THREE.Vector3(0.24, 0.44, 0.22);
    return R;
  }

  const _p = new THREE.Vector3();
  cenaRobo.updateMatrixWorld(true);
  // congela a pose
  const skinned: THREE.SkinnedMesh[] = [];
  cenaRobo.traverse((o) => { if ((o as THREE.SkinnedMesh).isSkinnedMesh) skinned.push(o as THREE.SkinnedMesh); });
  const v = new THREE.Vector3(), w = new THREE.Vector3(), n = new THREE.Vector3();
  for (const o of skinned) {
    const g = o.geometry.clone(), P = g.attributes.position, N = g.attributes.normal;
    for (let i = 0; i < P.count; i++) {
      v.fromBufferAttribute(P, i);
      if (N) { n.fromBufferAttribute(N, i); w.copy(v).addScaledVector(n, 1e-3); o.applyBoneTransform(i, w); }
      o.applyBoneTransform(i, v);
      if (N) { w.sub(v).normalize(); N.setXYZ(i, w.x, w.y, w.z); }
      P.setXYZ(i, v.x, v.y, v.z);
    }
    g.deleteAttribute("skinIndex");
    g.deleteAttribute("skinWeight");
    g.computeBoundingBox();
    g.computeBoundingSphere();
    const m = new THREE.Mesh(g, o.material);
    m.name = o.name;
    m.position.copy(o.position); m.quaternion.copy(o.quaternion); m.scale.copy(o.scale);
    o.parent!.add(m);
    o.parent!.remove(o);
    o.geometry.dispose();
  }
  // tira ossos e nós vazios do caminho: o molde fica só com as malhas, no mesmo lugar do mundo
  const R = new THREE.Group();
  R.name = "robo";
  cenaRobo.updateMatrixWorld(true);
  const malhas: THREE.Mesh[] = [];
  cenaRobo.traverse((o) => { if ((o as THREE.Mesh).isMesh) malhas.push(o as THREE.Mesh); });
  malhas.forEach((m) => { R.attach(m); (m.material as THREE.MeshStandardMaterial).envMapIntensity = 0.6; });
  R.updateMatrixWorld(true);

  const laranja = R.getObjectByName(PECA_BORBOLETA_LARANJA) as THREE.Mesh;
  // ponta do indicador: vértice do corpo mais perto da borboleta laranja que veio no modelo
  const pb = new THREE.Box3();
  { const P = laranja.geometry.attributes.position; for (let i = 0; i < P.count; i += 2) pb.expandByPoint(_p.fromBufferAttribute(P, i).applyMatrix4(laranja.matrixWorld)); }
  const c = pb.getCenter(new THREE.Vector3());
  let melhor = new THREE.Vector3(), d2 = Infinity;
  for (const m of malhas) {
    if (m === laranja) continue;
    const P = m.geometry.attributes.position;
    for (let i = 0; i < P.count; i++) { _p.fromBufferAttribute(P, i).applyMatrix4(m.matrixWorld); const d = _p.distanceToSquared(c); if (d < d2) { d2 = d; melhor = _p.clone(); } }
  }
  R.userData.pousoLocal = melhor;
  laranja.removeFromParent();
  laranja.geometry.dispose();

  // cabeça: 17 peças num grupo que gira em torno do pescoço
  const cabeca = new THREE.Group();
  cabeca.name = "cabeca";
  const pecas = PECAS_CABECA.map((k) => R.getObjectByName("tripo_part_" + k) as THREE.Mesh).filter(Boolean);
  const b = new THREE.Box3();
  pecas.forEach((o) => b.union(o.geometry.boundingBox!.clone().applyMatrix4(o.matrixWorld)));
  const cc = b.getCenter(new THREE.Vector3());
  cabeca.position.set(cc.x, b.min.y + (b.max.y - b.min.y) * 0.16, cc.z);
  R.add(cabeca);
  cabeca.updateMatrixWorld(true);
  pecas.forEach((o) => cabeca.attach(o));

  // olho: centro da parte ciano da textura (é onde o halo fica)
  const olho = R.getObjectByName(PECA_OLHO) as THREE.Mesh | undefined;
  if (olho) {
    const mat = olho.material as THREE.MeshStandardMaterial;
    const img = mat.map?.image as (CanvasImageSource & { width: number; height: number }) | undefined;
    const uv = olho.geometry.attributes.uv;
    const centro = new THREE.Vector3(); let qtd = 0;
    if (img && uv) {
      const cv = document.createElement("canvas"); cv.width = img.width; cv.height = img.height;
      const g = cv.getContext("2d", { willReadFrequently: true })!; g.drawImage(img, 0, 0);
      const d = g.getImageData(0, 0, cv.width, cv.height).data, P = olho.geometry.attributes.position;
      for (let i = 0; i < uv.count; i++) {
        const x = clamp(Math.floor(uv.getX(i) * cv.width), 0, cv.width - 1);
        const y = clamp(Math.floor((mat.map!.flipY ? 1 - uv.getY(i) : uv.getY(i)) * cv.height), 0, cv.height - 1);
        const k = (y * cv.width + x) * 4;
        if (d[k + 2] > 170 && d[k + 1] > 120 && d[k] < 120 && d[k + 2] - d[k] > 90) { centro.add(_p.fromBufferAttribute(P, i)); qtd++; }
      }
    }
    olho.userData.centroOlho = qtd ? centro.divideScalar(qtd) : olho.geometry.boundingBox!.getCenter(new THREE.Vector3());
  }
  return R;
}

/* ============================ instância do robô ============================ */

export interface Robo {
  R: THREE.Group;
  cabeca: THREE.Group;
  /** ponto de pouso (ponta do dedo) no espaço do robô */
  pousoLocal: THREE.Vector3;
  /** posição do olho no mundo (escreve em `alvo`) */
  olhoNoMundo: (alvo: THREE.Vector3) => THREE.Vector3;
  /** k 0..1: quanto o olho está aceso além do normal; clarao 0..1: o halo cresce e domina o quadro (fim do zoom) */
  acenderOlho: (k: number, t: number, clarao?: number) => void;
  /** gira a cabeça para olhar um ponto do mundo (suave) */
  olharPara: (ponto: THREE.Vector3, dt: number, rapidez?: number) => void;
  dispose: () => void;
}

function aplicarPoseAgachadoMixamo(R: THREE.Group) {
  const osso = (n: string) => (R.getObjectByName(`mixamorig:${n}`) || R.getObjectByName(`mixamorig${n}`)) as THREE.Bone | undefined;

  // Hips: baixa o quadril com o tronco mais ereto e natural
  const hips = osso("Hips");
  if (hips) {
    hips.position.y -= 0.30;
    hips.position.z += 0.02;
    hips.rotation.set(-0.04, 0, 0, "YXZ");
  }

  // Perna esquerda (lado de apoio e equilíbrio)
  const lUpLeg = osso("LeftUpLeg");
  const lLeg = osso("LeftLeg");
  const lFoot = osso("LeftFoot");
  if (lUpLeg) lUpLeg.rotation.set(-1.45, 0.15, 0.35, "YXZ");
  if (lLeg) lLeg.rotation.set(2.30, 0, 0, "YXZ");
  if (lFoot) lFoot.rotation.set(-0.85, -0.10, 0, "YXZ");

  // Perna direita
  const rUpLeg = osso("RightUpLeg");
  const rLeg = osso("RightLeg");
  const rFoot = osso("RightFoot");
  if (rUpLeg) rUpLeg.rotation.set(-1.45, -0.15, -0.35, "YXZ");
  if (rLeg) rLeg.rotation.set(2.30, 0, 0, "YXZ");
  if (rFoot) rFoot.rotation.set(-0.85, 0.10, 0, "YXZ");

  // Coluna / Tronco: ereto e firme em postura agachada
  const spine = osso("Spine");
  const spine1 = osso("Spine1");
  const spine2 = osso("Spine2");
  if (spine) spine.rotation.set(0.06, 0, 0, "YXZ");
  if (spine1) spine1.rotation.set(0.05, 0, 0, "YXZ");
  if (spine2) spine2.rotation.set(0.04, 0, 0, "YXZ");

  // Braço esquerdo: estendido para a frente na altura do peito onde a borboleta pousa
  const lShoulder = osso("LeftShoulder");
  const lArm = osso("LeftArm");
  const lForeArm = osso("LeftForeArm");
  const lHand = osso("LeftHand");
  if (lShoulder) lShoulder.rotation.set(0, -0.10, 0, "YXZ");
  if (lArm) lArm.rotation.set(0.18, -0.45, -0.85, "YXZ"); // estendido para a frente na altura média
  if (lForeArm) lForeArm.rotation.set(0.35, 0.15, -0.15, "YXZ");
  if (lHand) lHand.rotation.set(0.08, 0.20, -0.05, "YXZ");

  // Dedo indicador esquerdo estendido reto onde a borboleta pousa
  const lIdx1 = osso("LeftHandIndex1");
  const lIdx2 = osso("LeftHandIndex2");
  if (lIdx1) lIdx1.rotation.set(-0.15, 0, 0, "YXZ");
  if (lIdx2) lIdx2.rotation.set(-0.10, 0, 0, "YXZ");

  ["Middle", "Ring", "Pinky"].forEach((dedo) => {
    const d1 = osso(`LeftHand${dedo}1`);
    const d2 = osso(`LeftHand${dedo}2`);
    if (d1) d1.rotation.set(0.40, 0, 0, "YXZ");
    if (d2) d2.rotation.set(0.30, 0, 0, "YXZ");
  });

  // Braço direito: repousando relaxado e abaixado sobre a coxa/chão
  const rShoulder = osso("RightShoulder");
  const rArm = osso("RightArm");
  const rForeArm = osso("RightForeArm");
  const rHand = osso("RightHand");
  if (rShoulder) rShoulder.rotation.set(0, 0.05, 0, "YXZ");
  if (rArm) rArm.rotation.set(0.20, 0.10, -1.20, "YXZ"); // abaixado naturalmente
  if (rForeArm) rForeArm.rotation.set(0.30, 0, 0, "YXZ"); // antebraço apoiado
  if (rHand) rHand.rotation.set(0.10, 0, 0, "YXZ");

  // Cabeça: voltada para a borboleta na mão esquerda
  const head = osso("Head");
  if (head) head.rotation.set(0.06, 0.45, 0, "YXZ");
}

export function criarRobo(molde: THREE.Group): Robo {
  if (molde.userData.isNovoRobo) {
    const R = clonarComEsqueleto(molde);
    R.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.frustumCulled = false;
        ((o as THREE.Mesh).material as THREE.MeshStandardMaterial).envMapIntensity = 0.6;
      }
    });

    const descartaveis: { dispose: () => void }[] = [];

    // Aplica a pose agachada anatômica calibrada
    aplicarPoseAgachadoMixamo(R);
    R.updateMatrixWorld(true);

    const osso = (n: string) => (R.getObjectByName(`mixamorig:${n}`) || R.getObjectByName(`mixamorig${n}`)) as THREE.Bone | undefined;
    const cabeca = (osso("Head") ?? R) as unknown as THREE.Group;
    const noR = (o: THREE.Object3D) => R.worldToLocal(o.getWorldPosition(new THREE.Vector3()));

    // Ponto de pouso: ponta do indicador (mão que aponta para a borboleta)
    const pontas = [osso("LeftHandIndex4"), osso("RightHandIndex4"), osso("LeftHandIndex3"), osso("RightHandIndex3"), osso("LeftHand"), osso("RightHand")].filter((o): o is THREE.Bone => !!o).map(noR);
    const pousoLocal = pontas[0] ?? new THREE.Vector3(0.25, 0.45, 0.25);

    // direção de repouso do rosto: para o dedo (pitch pela metade, como no robô antigo)
    const cabecaR = noR(cabeca);
    const paraDedo = pousoLocal.clone().sub(cabecaR);
    const refDir = { yaw: Math.atan2(paraDedo.x, paraDedo.z), pitch: 0.5 * Math.atan2(paraDedo.y, Math.hypot(paraDedo.x, paraDedo.z)) };

    // halo azul no olho: preso ao osso da cabeça, à frente e acima do pivô do pescoço
    const escalaRel = cabeca.getWorldScale(new THREE.Vector3()).x / R.getWorldScale(new THREE.Vector3()).x;
    const frente = new THREE.Vector3(Math.sin(refDir.yaw), 0, Math.cos(refDir.yaw));
    const olhoR = cabecaR.clone().addScaledVector(frente, 0.07).add(new THREE.Vector3(0, 0.07, 0));
    const tex = texturaRadial([[0, "rgba(160,235,255,1)"], [0.25, "rgba(80,200,255,.55)"], [1, "rgba(60,180,255,0)"]], 64);
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.35, fog: false }));
    halo.position.copy(cabeca.worldToLocal(R.localToWorld(olhoR.clone())));
    halo.scale.setScalar(0.07 / escalaRel);
    cabeca.add(halo);
    descartaveis.push(tex, halo.material);

    const olhoNoMundo = (alvo: THREE.Vector3) => halo.getWorldPosition(alvo);
    const acenderOlho = (k: number, _t: number, clarao = 0) => {
      (halo.material as THREE.SpriteMaterial).opacity = Math.min(1, 0.3 + k * 0.55 + clarao * 0.4);
      halo.scale.setScalar((0.07 + k * 0.035 + clarao * clarao * 0.55) / escalaRel);
    };

    // olhar: giro calculado no espaço do robô e aplicado sobre a pose base do osso
    const qBase = cabeca.quaternion.clone();
    const qCab = new THREE.Quaternion(), qAlvo = new THREE.Quaternion(), e = new THREE.Euler(0, 0, 0, "YXZ");
    const qR = new THREE.Quaternion(), qPai = new THREE.Quaternion(), qDelta = new THREE.Quaternion();
    const _v = new THREE.Vector3(), _d = new THREE.Vector3();
    const olharPara = (ponto: THREE.Vector3, dt: number, rapidez = 6) => {
      cabeca.quaternion.copy(qBase);
      cabeca.updateMatrixWorld(true);
      R.getWorldQuaternion(qR);
      cabeca.getWorldPosition(_v);
      const d = _d.copy(ponto).sub(_v).applyQuaternion(qR.clone().invert());
      let dy = Math.atan2(d.x, d.z) - refDir.yaw;
      dy = Math.atan2(Math.sin(dy), Math.cos(dy));
      const dp = Math.atan2(d.y, Math.hypot(d.x, d.z)) - refDir.pitch;
      e.set(-clamp(dp, -0.55, 0.6), clamp(dy, -1.05, 1.05), 0);
      qAlvo.setFromEuler(e);
      qCab.slerp(qAlvo, 1 - Math.exp(-dt * rapidez));
      // delta em mundo = R * qCab * R⁻¹ ; local novo = Pai⁻¹ * delta * (Pai * base)
      qDelta.copy(qR).multiply(qCab).multiply(qR.clone().invert());
      cabeca.parent!.getWorldQuaternion(qPai);
      const mundoBase = qPai.clone().multiply(qBase);
      cabeca.quaternion.copy(qPai.clone().invert().multiply(qDelta.multiply(mundoBase)));
    };

    return { R, cabeca, pousoLocal, olhoNoMundo, acenderOlho, olharPara, dispose: () => descartaveis.forEach((x) => x.dispose()) };
  }

  const R = molde.clone(true);
  const cabeca = R.getObjectByName("cabeca") as THREE.Group;
  const pousoLocal = (molde.userData.pousoLocal as THREE.Vector3).clone();
  const descartaveis: { dispose: () => void }[] = [];

  // olho com material próprio (o brilho muda por cena) e halo azul
  const olho = R.getObjectByName(PECA_OLHO) as THREE.Mesh | undefined;
  let matOlho: THREE.MeshStandardMaterial | null = null, halo: THREE.Sprite | null = null;
  if (olho) {
    matOlho = (olho.material as THREE.MeshStandardMaterial).clone();
    matOlho.emissive = new THREE.Color("#4fd8ff");
    matOlho.emissiveMap = matOlho.map;
    matOlho.emissiveIntensity = 0.25;
    olho.material = matOlho;
    const tex = texturaRadial([[0, "rgba(160,235,255,1)"], [0.25, "rgba(80,200,255,.55)"], [1, "rgba(60,180,255,0)"]], 64);
    halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.35, fog: false }));
    halo.position.copy(molde.getObjectByName(PECA_OLHO)!.userData.centroOlho as THREE.Vector3);
    halo.scale.setScalar(0.07);
    olho.add(halo);
    descartaveis.push(matOlho, tex, halo.material);
  }
  const olhoNoMundo = (alvo: THREE.Vector3) => (halo ? halo.getWorldPosition(alvo) : cabeca.getWorldPosition(alvo));
  const acenderOlho = (k: number, t: number, clarao = 0) => {
    if (matOlho) matOlho.emissiveIntensity = 0.25 + k * 0.6 + clarao * 1.2 + Math.sin(t * 2) * 0.04 * k;
    if (halo) {
      (halo.material as THREE.SpriteMaterial).opacity = Math.min(1, 0.3 + k * 0.55 + clarao * 0.4);
      halo.scale.setScalar(0.07 + k * 0.035 + clarao * clarao * 0.55);
    }
  };

  // olhar: para onde o rosto aponta no modelo. O lado vem do olho (pescoço → olho, no chão); a inclinação,
  // metade da direção até o dedo (na pose original ele olha um pouco para baixo, para a mão).
  const refDir = (() => {
    R.updateMatrixWorld(true);
    const dedo = pousoLocal.clone().sub(cabeca.position);
    const pitch = 0.5 * Math.atan2(dedo.y, Math.hypot(dedo.x, dedo.z));
    if (!halo) return { yaw: Math.atan2(dedo.x, dedo.z), pitch };
    const rosto = R.worldToLocal(halo.getWorldPosition(new THREE.Vector3())).sub(cabeca.position);
    return { yaw: Math.atan2(rosto.x, rosto.z), pitch };
  })();
  const qCab = new THREE.Quaternion(), qAlvo = new THREE.Quaternion(), e = new THREE.Euler(0, 0, 0, "YXZ"), inv = new THREE.Quaternion();
  const _v = new THREE.Vector3(), _d = new THREE.Vector3();
  const olharPara = (ponto: THREE.Vector3, dt: number, rapidez = 6) => {
    cabeca.getWorldPosition(_v);
    R.getWorldQuaternion(inv).invert();
    const d = _d.copy(ponto).sub(_v).applyQuaternion(inv);
    let dy = Math.atan2(d.x, d.z) - refDir.yaw;
    dy = Math.atan2(Math.sin(dy), Math.cos(dy));
    const dp = Math.atan2(d.y, Math.hypot(d.x, d.z)) - refDir.pitch;
    e.set(-clamp(dp, -0.55, 0.6), clamp(dy, -1.05, 1.05), 0);
    qAlvo.setFromEuler(e);
    qCab.slerp(qAlvo, 1 - Math.exp(-dt * rapidez));
    cabeca.quaternion.copy(qCab);
  };

  return { R, cabeca, pousoLocal, olhoNoMundo, acenderOlho, olharPara, dispose: () => descartaveis.forEach((x) => x.dispose()) };
}

/* ============================ borboleta ============================ */

export interface Borboleta {
  objeto: THREE.Object3D;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  /**
   * Leva a borboleta até `alvo`. `pousando` (0..1) amortece o voo e a vira para `rumoPouso` (radianos, no chão).
   * `praCamera` é a direção horizontal até a câmera (as asas inclinam para ela).
   */
  atualizar: (dt: number, alvo: THREE.Vector3, rapidez: number, pousando: number, rumoPouso: number, praCamera: THREE.Vector3) => void;
  dispose: () => void;
}

export function criarBorboleta(moldes: Moldes, escala: number, cena: THREE.Object3D, reduzir: boolean): Borboleta {
  const obj = clonarComEsqueleto(moldes.borboleta);
  obj.scale.copy(moldes.borboleta.scale).multiplyScalar(escala);
  cena.add(obj);
  const mixer = new THREE.AnimationMixer(obj);
  if (moldes.bateAsas && !reduzir) mixer.clipAction(moldes.bateAsas).play();
  const Q_ORIG = moldes.borboleta.quaternion.clone();
  // o corpo dela fica no eixo X do modelo e a cabeça é o lado -X (pontas escuras das asas dianteiras)
  const EIXO_CORPO = new THREE.Vector3(1, 0, 0).applyQuaternion(Q_ORIG);
  const RUMO_ORIG = (() => { const d = EIXO_CORPO.clone().setY(0).normalize(); return Math.atan2(d.x, d.z); })();
  const EIXO_Y = new THREE.Vector3(0, 1, 0);
  const pos = new THREE.Vector3(), vel = new THREE.Vector3();
  const _v = new THREE.Vector3(), _q = new THREE.Quaternion(), _q2 = new THREE.Quaternion(), _q3 = new THREE.Quaternion(), eixoInclina = new THREE.Vector3();
  let rumo = 0, primeira = true;

  const atualizar: Borboleta["atualizar"] = (dt, alvo, rapidez, pousando, rumoPouso, praCamera) => {
    mixer.update(dt);
    if (primeira) { pos.copy(alvo); rumo = rumoPouso; primeira = false; }
    _v.copy(alvo).sub(pos);
    const passo = 1 - Math.exp(-dt * rapidez);
    vel.copy(_v).multiplyScalar(passo / Math.max(dt, 1e-4));
    pos.addScaledVector(_v, passo);
    if (pousando > 0.95 && _v.length() < 0.05 * escala) pos.copy(alvo);
    obj.position.copy(pos);
    // rumo: vira para onde voa (curva suave); pousando, para o rumo pedido
    const hv = Math.hypot(vel.x, vel.z);
    let rumoAlvo = rumo;
    if (pousando > 0.6) rumoAlvo = rumoPouso;
    else if (hv > 1.5 * escala) rumoAlvo = Math.atan2(vel.x, vel.z);
    const dr = Math.atan2(Math.sin(rumoAlvo - rumo), Math.cos(rumoAlvo - rumo));
    const giro = dr * (1 - Math.exp(-dt * 6));
    rumo += giro;
    const inclinaCurva = clamp((-giro / Math.max(dt, 1e-3)) * 0.12, -0.5, 0.5) * (1 - pousando);
    const arfa = clamp((vel.y / escala) * 0.01, -0.35, 0.35) * (1 - pousando);
    eixoInclina.crossVectors(EIXO_Y, praCamera).normalize();
    _q.setFromAxisAngle(eixoInclina, 0.9 + arfa)                                  // asas inclinadas para a câmera
      .multiply(_q2.setFromAxisAngle(EIXO_Y, rumo - RUMO_ORIG + Math.PI))
      .multiply(_q3.setFromAxisAngle(EIXO_CORPO, inclinaCurva))
      .multiply(Q_ORIG);
    obj.quaternion.copy(_q);
  };
  return { objeto: obj, pos, vel, atualizar, dispose: () => { mixer.stopAllAction(); obj.removeFromParent(); } };
}

/* ============================ purpurina ============================ */

export function criarPurpurina(cena: THREE.Object3D, escala: number, reduzir: boolean) {
  const N = 220;
  const geo = new THREE.BufferGeometry();
  const pPos = new Float32Array(N * 3), pCor = new Float32Array(N * 3), pVel = new Float32Array(N * 3);
  const pVida = new Float32Array(N), pVidaMax = new Float32Array(N).fill(1), pBase = new Float32Array(N * 3), pFase = new Float32Array(N);
  geo.setAttribute("position", new THREE.BufferAttribute(pPos, 3).setUsage(THREE.DynamicDrawUsage));
  geo.setAttribute("color", new THREE.BufferAttribute(pCor, 3).setUsage(THREE.DynamicDrawUsage));
  const tex = (() => {
    const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d")!;
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.25, "rgba(255,255,255,.7)"); gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    g.globalCompositeOperation = "lighter"; g.fillStyle = "rgba(255,255,255,.55)";
    g.fillRect(31, 6, 2, 52); g.fillRect(6, 31, 52, 2);                       // cruzinha de brilho
    return new THREE.CanvasTexture(c);
  })();
  const mat = new THREE.PointsMaterial({ size: 0.55 * escala, map: tex, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });
  const pontos = new THREE.Points(geo, mat);
  pontos.frustumCulled = false;
  cena.add(pontos);
  const PALETA = [[0.45, 0.85, 1], [0.7, 0.95, 1], [1, 1, 1], [0.35, 0.6, 1]];
  let proxima = 0, acumula = 0;
  /** `origem`/`vel`: posição e velocidade da borboleta; `pousada` 0..1 */
  const atualizar = (dt: number, t: number, origem: THREE.Vector3, velB: THREE.Vector3, pousada: number) => {
    if (reduzir) return;
    const pulso = Math.max(0, Math.sin(t * 9)) ** 6;                            // bater de asas mais forte: rajada
    acumula += dt * (lerp(26, 5, pousada) + (Math.hypot(velB.x, velB.z) / escala) * 0.35 + pulso * 40);
    while (acumula >= 1) {
      acumula--;
      const i = proxima; proxima = (proxima + 1) % N;
      const a = Math.random() * Math.PI * 2, r = (0.4 + Math.random() * 1.6) * escala;
      pPos[i * 3] = origem.x + Math.cos(a) * r; pPos[i * 3 + 1] = origem.y + (Math.random() - 0.3) * 0.6 * escala; pPos[i * 3 + 2] = origem.z + Math.sin(a) * r;
      pVel[i * 3] = -velB.x * 0.12 + (Math.random() - 0.5) * 0.8 * escala; pVel[i * 3 + 1] = (-0.4 - Math.random() * 0.9) * escala; pVel[i * 3 + 2] = -velB.z * 0.12 + (Math.random() - 0.5) * 0.8 * escala;
      pVidaMax[i] = pVida[i] = 1.1 + Math.random() * 1.3;
      const c = PALETA[(Math.random() * PALETA.length) | 0];
      pBase[i * 3] = c[0]; pBase[i * 3 + 1] = c[1]; pBase[i * 3 + 2] = c[2];
      pFase[i] = Math.random() * 20;
    }
    for (let i = 0; i < N; i++) {
      if (pVida[i] <= 0) { pCor[i * 3] = pCor[i * 3 + 1] = pCor[i * 3 + 2] = 0; continue; }
      pVida[i] -= dt;
      pVel[i * 3] *= 0.985; pVel[i * 3 + 2] *= 0.985; pVel[i * 3 + 1] -= 0.25 * escala * dt;
      pPos[i * 3] += pVel[i * 3] * dt; pPos[i * 3 + 1] += pVel[i * 3 + 1] * dt; pPos[i * 3 + 2] += pVel[i * 3 + 2] * dt;
      const vida = Math.max(pVida[i], 0) / pVidaMax[i];
      const k = Math.min(1, vida * 2.5) * vida ** 0.4 * (0.45 + 0.55 * Math.abs(Math.sin(t * 14 + pFase[i]))) * 0.9;
      pCor[i * 3] = pBase[i * 3] * k; pCor[i * 3 + 1] = pBase[i * 3 + 1] * k; pCor[i * 3 + 2] = pBase[i * 3 + 2] * k;
    }
    geo.attributes.position.needsUpdate = true;
    geo.attributes.color.needsUpdate = true;
  };
  return { atualizar, dispose: () => { geo.dispose(); mat.dispose(); tex.dispose(); pontos.removeFromParent(); } };
}
